<!--
  PackingListTab.vue — Vue 3 + Vuetify 3 + Composition API
  Style: Stylelint compliant (stylelint-config-standard + stylelint-order)

  ✅ Requirements implemented:
  #1  Invoice Running Number (auto-generated prefix) + free-text suffix
  #2  Date validation: new invoice date >= previous invoice date
  #3  Due Date auto-calculate from Payment + ETD/ETA
  #4  Gross Weight auto-calculate = (qty × tare) + (pallets × tarePallet) + net
  #5  Tare Weight auto-fill from master on packageType change
  #6  Tare Pallet show/hide based on palletCount + master options
  #7  PACKAGING auto-format with palletCount suffix
  #8  MARKS & NOS default value from consignee/PO
  #9  Vessel sync → store (Shipping Particular tab)
  #15 Note feature (add/edit/delete, always editable)
  #16 Note auto-save on click-outside
  #17 Empty field filter flag (for print template)
-->
<template>
  <div class="tab-page">
    <div class="tab-content">
      <!-- ================================================ -->
      <!-- SECTION 1: Title + Reference fields               -->
      <!--                                                    -->
      <!-- Layout:                                            -->
      <!--  |          PACKING LIST          |               -->
      <!--  |      [ date picker      ]      |               -->
      <!--  |  INVOICE NO. : 110008  [input] |               -->
      <!--  |  PO NO :       [input        ] |               -->
      <!--  |  PROFORMA :    [input        ] |               -->
      <!--                                                    -->
      <!-- All rows are centered as one block.               -->
      <!-- Label (right-align) + field inline per row.       -->
      <!-- ================================================ -->
      <div class="section">
        <h2 class="section-title">
          PACKING LIST
        </h2>

        <!-- Centered ref block -->
        <div class="ref-block">
          <!-- Date — full-width within block, no label -->
          <div class="ref-row">
            <div class="ref-row__label" />
            <div class="ref-row__field">
              <template v-if="!isReadonly">
                <VTextField
                  :model-value="formData.date"
                  type="date"
                  variant="outlined"
                  density="compact"
                  hide-details
                  prepend-inner-icon="mdi-calendar"
                  :error-messages="getError('date').value"
                  @update:model-value="(v) => handleDateChange(v)"
                />
                <div
                  v-if="dateWarning"
                  class="field-warning"
                >
                  {{ dateWarning }}
                </div>
              </template>
              <span
                v-else
                class="ref-row__text"
              >{{ formData.date }}</span>
            </div>
          </div>

          <!-- INVOICE NO. : [bold auto number] [suffix input] -->
          <div class="ref-row">
            <div class="ref-row__label">
              INVOICE NO. :
            </div>
            <div class="ref-row__field ref-row__field--invoice">
              <template v-if="!isReadonly">
                <!-- System-generated running number (read-only) -->
                <span class="invoice-num">{{ formData.invoiceNo || nextInvoiceNumber }}</span>
                <!-- Optional suffix input e.g. (C-2509155) -->
                <VTextField
                  :model-value="invoiceSuffix"
                  variant="outlined"
                  density="compact"
                  hide-details
                  placeholder="(C-2509155)"
                  class="invoice-suffix"
                  @update:model-value="handleSuffixChange"
                />
              </template>
              <span
                v-else
                class="ref-row__text"
              >
                {{ formData.invoiceNo }}
                <template v-if="invoiceSuffix">&nbsp;({{ invoiceSuffix }})</template>
              </span>
            </div>
          </div>

          <!-- PO NO -->
          <div class="ref-row">
            <div class="ref-row__label">
              PO NO :
            </div>
            <div class="ref-row__field">
              <VTextField
                v-if="!isReadonly"
                :model-value="formData.poNo"
                variant="outlined"
                density="compact"
                hide-details
                @update:model-value="(v) => updateField('poNo', v)"
              />
              <span
                v-else
                class="ref-row__text"
              >{{ formData.poNo }}</span>
            </div>
          </div>

          <!-- PROFORMA INVOICE NO. -->
          <div class="ref-row">
            <div class="ref-row__label">
              PROFORMA INVOICE NO. :
            </div>
            <div class="ref-row__field">
              <VTextField
                v-if="!isReadonly"
                :model-value="formData.proformaInvoiceNo"
                variant="outlined"
                density="compact"
                hide-details
                @update:model-value="(v) => updateField('proformaInvoiceNo', v)"
              />
              <span
                v-else
                class="ref-row__text"
              >{{ formData.proformaInvoiceNo }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================ -->
      <!-- SECTION 2: Payer | Consignee | Payment + Due Date -->
      <!-- ================================================ -->
      <div class="section">
        <div class="party-grid">
          <!-- Payer — read-only from Shipment Plan -->
          <div class="party-block">
            <span class="party-block__label">Payer :</span>
            <div class="party-block__body">
              <div>{{ formData.payer?.name }}</div>
              <div>{{ formData.payer?.address }}</div>
              <div v-if="formData.payer?.address2">
                {{ formData.payer.address2 }}
              </div>
              <div>{{ formData.payer?.city }} {{ formData.payer?.country }}</div>
              <div v-if="formData.payer?.tel">
                TEL.: {{ formData.payer.tel }}
              </div>
              <div v-if="formData.payer?.attn">
                ATTN : {{ formData.payer.attn }}
              </div>
            </div>
          </div>

          <!-- Consignee — read-only from Shipment Plan -->
          <div class="party-block">
            <span class="party-block__label">Consignee :</span>
            <div class="party-block__body">
              <div>{{ formData.consignee?.name }}</div>
              <div>{{ formData.consignee?.address }}</div>
              <div v-if="formData.consignee?.address2">
                {{ formData.consignee.address2 }}
              </div>
              <div v-if="formData.consignee?.address3">
                {{ formData.consignee.address3 }}
              </div>
              <div>
                {{ formData.consignee?.city }}
                <template v-if="formData.consignee?.country">
                  - {{ formData.consignee.country }}
                </template>
              </div>
              <div v-if="formData.consignee?.tel">
                TEL.: {{ formData.consignee.tel }}
              </div>
              <div v-if="formData.consignee?.taxId">
                TAX ID : {{ formData.consignee.taxId }}
              </div>
            </div>
          </div>

          <!-- Payment + Due Date (#3 Due Date auto-calc) -->
          <div class="party-block party-block--inputs">
            <div class="kv-pair">
              <span class="kv-pair__label">Payment :</span>
              <VSelect
                v-if="!isReadonly"
                :model-value="formData.payment"
                :items="PAYMENT_OPTIONS"
                variant="outlined"
                density="compact"
                hide-details
                class="kv-pair__input"
                @update:model-value="(v) => handlePaymentChange(v)"
              />
              <span
                v-else
                class="kv-pair__value"
              >{{ formData.payment }}</span>
            </div>
            <div class="kv-pair kv-pair--spaced">
              <span class="kv-pair__label">Due Date :</span>
              <!-- #3: Auto-calculated; shown as read-only with badge -->
              <div
                v-if="!isReadonly"
                class="due-date-wrap"
              >
                <VTextField
                  :model-value="formData.dueDate"
                  type="date"
                  variant="outlined"
                  density="compact"
                  hide-details
                  prepend-inner-icon="mdi-calendar"
                  class="kv-pair__input"
                  :readonly="isDueDateAutoCalc"
                  :bg-color="isDueDateAutoCalc ? 'grey-lighten-4' : undefined"
                  @update:model-value="(v) => updateField('dueDate', v)"
                />
                <VTooltip
                  v-if="isDueDateAutoCalc"
                  text="Calculated automatically from Payment + ETD/ETA"
                  location="top"
                >
                  <template #activator="{ props }">
                    <VIcon
                      v-bind="props"
                      class="due-date-info"
                      size="16"
                      color="info"
                    >
                      mdi-information-outline
                    </VIcon>
                  </template>
                </VTooltip>
              </div>
              <span
                v-else
                class="kv-pair__value"
              >{{ formData.dueDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================ -->
      <!-- SECTION: Shipping                                  -->
      <!-- ================================================ -->
      <div class="section">
        <div class="ship-grid">
          <div class="ship-cell ship-cell--wide">
            <span class="ship-label">Feeder :</span>
            <VTextField
              v-if="!isReadonly"
              :model-value="formData.feeder"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="(v) => updateField('feeder', v)"
            />
            <span v-else>{{ formData.feeder }}</span>
          </div>

          <!-- #9: Vessel — syncs to Shipping Particular tab -->
          <div class="ship-cell ship-cell--wide">
            <span class="ship-label">Vessel :</span>
            <VTextField
              v-if="!isReadonly"
              :model-value="formData.vessel"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="(v) => handleVesselChange(v)"
            />
            <span v-else>{{ formData.vessel }}</span>
          </div>

          <div class="ship-cell ship-cell--narrow">
            <span class="ship-label">ETD :</span>
            <VTextField
              v-if="!isReadonly"
              :model-value="formData.etd"
              type="date"
              variant="outlined"
              density="compact"
              hide-details
              prepend-inner-icon="mdi-calendar"
              @update:model-value="(v) => handleEtdChange(v)"
            />
            <span v-else>{{ formData.etd }}</span>
          </div>
        </div>

        <div class="ship-grid ship-grid--spaced">
          <div class="ship-cell ship-cell--wide">
            <span class="ship-label">From :</span>
            <VAutocomplete
              v-if="!isReadonly"
              :model-value="formData.from"
              :items="PORT_OPTIONS"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="(v) => updateField('from', v)"
            />
            <span v-else>{{ formData.from }}</span>
          </div>
          <div class="ship-cell ship-cell--wide">
            <span class="ship-label">To :</span>
            <VAutocomplete
              v-if="!isReadonly"
              :model-value="formData.to"
              :items="PORT_OPTIONS"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="(v) => updateField('to', v)"
            />
            <span v-else>{{ formData.to }}</span>
          </div>
          <div class="ship-cell ship-cell--narrow">
            <span class="ship-label">ETA:</span>
            <VTextField
              v-if="!isReadonly"
              :model-value="formData.eta"
              type="date"
              variant="outlined"
              density="compact"
              hide-details
              prepend-inner-icon="mdi-calendar"
              @update:model-value="(v) => handleEtaChange(v)"
            />
            <span v-else>{{ formData.eta }}</span>
          </div>
        </div>
      </div>

      <!-- ================================================ -->
      <!-- SECTION 3: Items Table                             -->
      <!-- ================================================ -->
      <div class="section">
        <div class="section--item--table">
          <div class="tbl-head">
            <div class="tbl-c tbl-c--marks">
              MARKS &amp; NOS
            </div>
            <div class="tbl-c tbl-c--desc">
              DESCRIPTION OF GOODS
            </div>
            <div class="tbl-c tbl-c--pkg">
              PACKAGE
            </div>
            <div class="tbl-c tbl-c--wt">
              NET WEIGHT (KGS)
            </div>
            <div class="tbl-c tbl-c--wt">
              GROSS WEIGHT (KGS)
            </div>
          </div>

          <div
            v-for="(item, idx) in formData.items"
            :key="item.id || idx"
            class="tbl-body"
          >
            <!-- MARKS & NOS — #8: default from consignee/PO, editable -->
            <div class="tbl-c tbl-c--marks">
              <VTextarea
                v-if="!isReadonly"
                :model-value="item.marksAndNos"
                variant="outlined"
                density="compact"
                hide-details
                rows="3"
                auto-grow
                @update:model-value="(v) => handleItemUpdate(idx, 'marksAndNos', v)"
              />
              <div v-else>
                <div
                  v-for="(line, li) in splitLines(item.marksAndNos)"
                  :key="li"
                >
                  {{ line }}
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="tbl-c tbl-c--desc">
              <template v-if="!isReadonly">
                <VTextField
                  :model-value="item.descriptionOfGoods"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="tbl-field--spaced"
                  @update:model-value="(v) => handleItemUpdate(idx, 'descriptionOfGoods', v)"
                />
                <VTextField
                  :model-value="item.subDescription"
                  variant="outlined"
                  density="compact"
                  hide-details
                  @update:model-value="(v) => handleItemUpdate(idx, 'subDescription', v)"
                />
              </template>
              <template v-else>
                <div>{{ item.descriptionOfGoods }}</div>
                <div
                  v-if="item.subDescription"
                  class="text-muted"
                >
                  ({{ item.subDescription }})
                </div>
              </template>
            </div>

            <!-- Package + Tare -->
            <div class="tbl-c tbl-c--pkg">
              <template v-if="!isReadonly">
                <!-- Row 1: Package type — full width -->
                <VSelect
                  :model-value="item.packageType"
                  :items="PACKAGE_TYPES"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="pkg-type-select"
                  @update:model-value="(v) => handleItemUpdate(idx, 'packageType', v)"
                />

                <!--
                  TRUE 4-column grid — both rows have exactly 4 independent cells.
                  grid-template-columns: auto | 1fr | auto | auto
                  Row 2: [160] | [DRUM▼] | [40] | [PALLET]
                  Row 3: [Tare W.(KG)] | [2.00] | [Tare W.(KG)] | [5.00▼]
                -->
                <div class="pkg-tare-grid">
                  <!-- ── Row 2 ── -->
                  <span class="ptg-qty">{{ item.quantity || 0 }}</span>
                  <span class="ptg-pallet-label">{{ item.unitType }}</span>


                  <span class="ptg-tare-text">Tare Weight (KG)</span>
                  <span class="ptg-tare-val">{{ fmtDec(item.tareWeightDrum) }}</span>

                 

                  <!-- ── Row 3: each cell aligns under row 2 ── -->
                  <VTextField
                    :model-value="item.palletCount"
                    type="number"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="ptg-pallet"
                    @update:model-value="(v) => handleItemUpdate(idx, 'palletCount', Number(v))"
                  />
                  <span class="ptg-pallet-label">PALLET</span>
                  
                  
                  <span
                    class="ptg-tare-text"
                    :style="{ visibility: item.palletCount > 0 ? 'visible' : 'hidden' }"
                  >Tare Weight (KG)</span>

                  <VSelect
                    v-if="item.palletCount > 0"
                    :model-value="item.tareWeightPallet"
                    :items="TARE_PALLET_MASTER"
                    item-title="value"
                    item-value="value"
                    variant="outlined"
                    class="ptg-pallet"
                    density="compact"
                    hide-details
                    @update:model-value="(v) => handleItemUpdate(idx, 'tareWeightPallet', Number(v))"
                  />
                  <span v-else />
                </div>

              <!-- Row 4: packaging summary -->
              <!--
                <div class="pkg-summary-label">
                {{ buildPackagingLabel(item) }}
                </div> 
              -->
              </template>

              <template v-else>
                <div v-if="item.packageType || item.package">
                  {{ item.packageType || item.package }}
                </div>
                <div
                  v-if="buildPackagingLabel(item)"
                  class="text-muted"
                >
                  {{ buildPackagingLabel(item) }}
                </div>
              </template>
            </div>

            <!-- Net Weight -->
            <div class="tbl-c tbl-c--wt text-right">
              <VTextField
                v-if="!isReadonly"
                :model-value="item.netWeight"
                type="number"
                variant="outlined"
                density="compact"
                hide-details
                style="min-width: 100px;"
                reverse
                @update:model-value="(v) => handleItemUpdate(idx, 'netWeight', Number(v))"
              />
              <span v-else>{{ fmtNum(item.netWeight) }}</span>
            </div>

            <!-- #4: Gross Weight — auto-calculated, read-only badge -->
            <div class="tbl-c tbl-c--wt text-right">
              <div
                v-if="!isReadonly"
                class="gross-weight-wrap"
              >
                <VTextField
                  :model-value="item.grossWeight"
                  type="number"
                  variant="outlined"
                  density="compact"
                  hide-details
                  reverse
                  style="min-width: 100px;"
                  bg-color="grey-lighten-4"
                  readonly
                />
                <VTooltip
                  text="Auto-calculated: Net + (Qty × Tare) + (Pallets × Tare Pallet)"
                  location="top"
                >
                  <template #activator="{ props }">
                    <VIcon
                      v-bind="props"
                      class="gross-info"
                      size="14"
                      color="info"
                    >
                      mdi-information-outline
                    </VIcon>
                  </template>
                </VTooltip>
              </div>
              <span v-else>{{ fmtNum(item.grossWeight) }}</span>
            </div>
          </div>

          <!-- Totals -->
          <div class="tbl-foot">
            <div class="tbl-c tbl-c--marks tbl-c--bold">
              Total
            </div>
            <div class="tbl-c tbl-c--desc" />
            <div class="tbl-c tbl-c--pkg" />
            <div class="tbl-c tbl-c--wt tbl-c--bold text-right">
              {{ fmtNum(totalNet) }}
            </div>
            <div class="tbl-c tbl-c--wt tbl-c--bold text-right">
              {{ fmtNum(totalGross) }}
            </div>
          </div>

          <div
            v-if="!formData.items?.length"
            class="tbl-empty"
          >
            No items
          </div>
        </div>
      </div>

      <!-- ================================================ -->
      <!-- SECTION 4: Footer (display text only)              -->
      <!-- ================================================ -->
      <div class="section">
        <div
          v-for="f in FOOTER_FIELDS"
          :key="f.key"
          class="info-row"
        >
          <!-- #17: Only display if value exists -->
          <template v-if="formData[f.key]">
            <span
              v-if="f.key === 'lotNo'"
              class="info-row__label"
            >{{ f.label }}</span>
            <span
              v-else
              class="info-row__label"
            >{{ f.label }}</span>
            <span
              v-if="f.key === 'lotNo'"
              class="info-row__value"
            >
              <VTextField
                :model-value="formData.lotNo"
                variant="outlined"
                density="compact"
                hide-details
                class=""
                style="max-width: 500px;"
                @update:model-value="(v) => handleItemUpdate('lotNo', v)"
              />
            </span>
            <span
              v-else-if="f.key === 'hsCode'"
              class="info-row__value"
            >
              <VSelect
                :model-value="formData.hsCode"
                :items="HS_CODE_TYPES"
                variant="outlined"
                density="compact"
                hide-details
                style="max-width: 500px;"
                class=""
                @update:model-value="(v) => handleItemUpdate('hsCode', v)"
              />
            </span>
            <span
              v-else
              class="info-row__value"
            >{{ formData[f.key] }}</span>
          </template>
        </div>
      </div>
    </div>

    <TabActionBar
      v-model:selected-target="printTarget"
      :tab-key="TabKey.PACKING_LIST"
      :is-loading="isLoading"
      :is-dirty="isDirty"
      :notes="notes"
      :is-printing="isPrinting"
      :can-print="!isReadonly"
      :print-targets="printTargets"
      :print-config="{
        buyer: {
          hasDisplay: true,
          displayFields: PRINT_DISPLAY_FIELDS.buyer
        },
        customs: {
          hasDisplay: true,
          displayFields: PRINT_DISPLAY_FIELDS.customs
        }
      }"
      @print="handlePrint"
      @save-draft="saveDraft"
      @confirm="confirm"
      @add-note="handleAddNote"
      @delete-note="handleDeleteNote"
      @edit-note="handleEditNote"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { TabKey } from '../../types/shipDocument'
import { useTabForm } from '../../composables/useTabForm'
import { usePrint } from '../../composables/usePrint'
import { useShipDocumentStore } from '../../stores/shipDocumentStore'
import { tabApiMap } from '../../services/shipDocumentApi'
import TabActionBar from '../shared/TabActionBar.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// อ่าน ?mode=ocean จาก URL  ← แทน props.tabKey ที่ไม่มีค่า
const shippMode = computed(() => route.query.mode || 'ocean')

// ─── Constants ───────────────────────────────────────────────────────────────

const PAYMENT_OPTIONS = ['T/T in advance', 'L/C', 'D/P', 'D/A']
const PORT_OPTIONS    = ['LAEM CHABANG, THAILAND', 'HCM CITY, VIETNAM', 'HAIPHONG, VIETNAM', 'BANGKOK, THAILAND']
const PACKAGE_TYPES   = ['250KG PLASTIC DRUM', '200KG PLASTIC DRUM', '1000KG IBC TANK', '25KG BAG']
const UNIT_TYPES      = ['DRUM', 'CARTON', 'BAG']

const FOOTER_FIELDS = [
  { key: 'packing',         label: 'PACKING :'           },
  { key: 'countryOfOrigin', label: 'COUNTRY OF ORIGIN :' },
  { key: 'makerName',       label: 'MAKER NAME :'        },
  { key: 'packaging',       label: 'PACKAGING :'         },
  { key: 'lotNo',           label: 'Lot No :'            },
  { key: 'hsCode',          label: 'HS CODE :'            },
]

// ─── #5 Master: Tare Weight per Package Type ─────────────────────────────────
// SOURCE: Replace with API call to your master data endpoint
const TARE_WEIGHT_BY_PACKAGE = {
  '250KG PLASTIC DRUM': 2.00,
  '200KG PLASTIC DRUM': 1.80,
  '1000KG IBC TANK': 5.00,
  '25KG BAG': 0.50,
}

// ─── #6 Master: Tare Weight options for Pallets ──────────────────────────────
// SOURCE: Replace with API call to your master data endpoint
const TARE_PALLET_MASTER = [
  { title: 'Plastic Pallet (3 kg)',    value: 3.00 },
  { title: 'Wood Pallet (5 kg)',       value: 5.00 },
  { title: 'Heavy Wood Pallet (6 kg)', value: 6.00 },
  { title: 'Export Pallet (4 kg)',     value: 4.00 },
]

// ─── #3 Payment → Due Date offset rules ──────────────────────────────────────
// base: which date to add offset to ('etd' or 'eta')
// offsetDays: number of days to add
const DUE_DATE_RULES = {
  'T/T in advance': { base: 'etd', offsetDays: 0   },
  'L/C': { base: 'etd', offsetDays: 30  },
  'D/P': { base: 'eta', offsetDays: 0   },
  'D/A': { base: 'eta', offsetDays: 30  },
}

// ─── #4 HS Code Types ────────────────────────────────────────────────────────
const HS_CODE_TYPES = [
  { title: '3906.90.20',    value: '3906.90.20' },
  { title: '3906.90.20',    value: '3906.90.20' },
  { title: '3906.90.20',    value: '3906.90.20' },
  { title: '3906.90.20',    value: '3906.90.20' },
]

// ─── #7 Print Display Fields ────────────────────────────────────────────────
const PRINT_DISPLAY_FIELDS = {
  buyer: ['lotNo', 'productDescription', 'note'],
  customs: ['lotNo'],
}

// ─── Store + Composables ─────────────────────────────────────────────────────

const store = useShipDocumentStore()

const {
  formData, isDirty, isLoading, isReadonly,
  updateField, saveDraft, confirm, getError,
} = useTabForm(TabKey.PACKING_LIST, {
  onSaveDraft: data => tabApiMap[TabKey.PACKING_LIST].save(store.documentId, data),
  onConfirm: data => tabApiMap[TabKey.PACKING_LIST].confirm(store.documentId, data),
  validate: data => {
    const errors = {}

    if (!data.date) {
      errors.date = ['Date is required']
    } else if (dateWarning.value) {
      // #2: Block save when date is before previous invoice
      errors.date = [dateWarning.value]
    }

    if (!data.invoiceNo) errors.invoiceNo = ['Invoice No. is required']

    return Object.keys(errors).length > 0 ? errors : null
  },
})

// const { print: handlePrint } = usePrint(TabKey.PACKING_LIST)

const { isPrinting, print } = usePrint(
  TabKey.PACKING_LIST,
  () => ({
    ...formData.value,
    note: notes.value[0]?.text ?? '',  // ← merge note ตรงนี้
  }),
)

const printTarget = ref('buyer')

const printTargets = [
  { label: 'For Buyer', value: 'buyer' },
  { label: 'For Customs', value: 'customs' },
]

function handlePrint(payload) {
  print(
    payload.target,
    payload.display,
    shippMode.value,
  )
}

// ─── #1: Invoice Running Number ───────────────────────────────────────────────
// `store.nextInvoiceNumber` — the backend-generated next sequential number
// The prefix is read-only; only the suffix (in parentheses) is user-editable
const nextInvoiceNumber = computed(() => store.nextInvoiceNumber || formData.value.invoiceNo || '')
const invoiceSuffix     = ref(formData.value.contractNo || '')

function handleSuffixChange(val) {
  invoiceSuffix.value = val

  // Store suffix separately so print template can format "INV# (SUFFIX)"
  updateField('contractNo', val)
}

// ─── #2: Date validation — new date must be >= last invoice date ──────────────
const dateWarning = computed(() => {
  const lastDate = store.lastInvoiceDate // e.g. '2026-02-05' from store
  if (!lastDate || !formData.value.date) return null

  const current  = new Date(formData.value.date)
  const previous = new Date(lastDate)

  if (current < previous) {
    return `Date cannot be earlier than previous invoice (${lastDate})`
  }
  
  return null
})

function handleDateChange(val) {
  updateField('date', val)

  // Re-calculate due date when date changes
  recalcDueDate(formData.value.payment, formData.value.etd, formData.value.eta)
}

// ─── #3: Due Date auto-calculation ───────────────────────────────────────────
const isDueDateAutoCalc = computed(() => !!DUE_DATE_RULES[formData.value.payment])

function calcDueDate(payment, etd, eta) {
  const rule = DUE_DATE_RULES[payment]
  if (!rule) return null

  const baseStr = rule.base === 'etd' ? etd : eta
  if (!baseStr) return null

  const d = new Date(baseStr)

  d.setDate(d.getDate() + rule.offsetDays)
  
  return d.toISOString().split('T')[0]
}

function recalcDueDate(payment, etd, eta) {
  const calculated = calcDueDate(payment, etd, eta)
  if (calculated) updateField('dueDate', calculated)
}

function handlePaymentChange(val) {
  updateField('payment', val)
  recalcDueDate(val, formData.value.etd, formData.value.eta)
}

function handleEtdChange(val) {
  updateField('etd', val)
  recalcDueDate(formData.value.payment, val, formData.value.eta)
}

function handleEtaChange(val) {
  updateField('eta', val)
  recalcDueDate(formData.value.payment, formData.value.etd, val)
}

// ─── #9: Vessel sync to Shipping Particular tab ───────────────────────────────
function handleVesselChange(val) {
  updateField('vessel', val)

  // Syncs to store so ShippingParticularTab can read it
  store.syncVessel(val)
}

// ─── #4: Gross Weight auto-calculation ───────────────────────────────────────
// Formula: (quantity × tareWeightDrum) + (palletCount × tareWeightPallet) + netWeight
function calcGrossWeight(item) {
  const net     = Number(item.netWeight)      || 0
  const qty     = Number(item.quantity)       || 0
  const tare    = Number(item.tareWeightDrum) || 0
  const pallets = Number(item.palletCount)    || 0
  const tarePlt = Number(item.tareWeightPallet) || 0
  
  return net + (qty * tare) + (pallets * tarePlt)
}

// ─── #7: PACKAGING label builder ─────────────────────────────────────────────
// e.g. "160 DRUMS (40 PALLETS)" or "160 DRUMS"
function buildPackagingLabel(item) {
  const qty     = item.quantity    || 0
  const pallets = item.palletCount || 0
  const unit    = item.unitType    || item.packageType || ''
  if (!qty) return ''
  
  return pallets > 0
    ? `${qty} ${unit} (${pallets} PALLETS)`
    : `${qty} ${unit}`
}

// ─── #8 Default MARKS & NOS from consignee/PO ────────────────────────────────
function buildDefaultMarks() {
  const parts = []
  if (formData.value.consignee?.name)    parts.push(formData.value.consignee.name)
  if (formData.value.poNo)               parts.push(formData.value.poNo)
  if (formData.value.consignee?.city)    parts.push(formData.value.consignee.city?.toUpperCase())
  
  return parts.join('\n')
}

// ─── Item Update handler (central) ───────────────────────────────────────────
function handleItemUpdate(index, field, value) {
  const items = [...(formData.value.items || [])]

  items[index] = { ...items[index], [field]: value }

  // #5: Auto-fill Tare Weight from master when packageType changes
  if (field === 'packageType') {
    items[index].tareWeightDrum = TARE_WEIGHT_BY_PACKAGE[value] ?? 0
  }

  // #6: Reset tare pallet when palletCount goes to 0
  if (field === 'palletCount' && Number(value) === 0) {
    items[index].tareWeightPallet = 0
  }

  // #4: Recalculate Gross Weight
  const recalcFields = ['netWeight', 'quantity', 'tareWeightDrum', 'palletCount', 'tareWeightPallet']
  if (recalcFields.includes(field) || field === 'packageType') {
    items[index].grossWeight = calcGrossWeight(items[index])
  }

  // #7: Auto-update PACKAGING footer field
  // We update the last item's packaging as summary (or you can combine all items)
  if (['quantity', 'unitType', 'palletCount', 'packageType'].includes(field)) {
    // Update PACKAGING field based on all items combined
    const packagingLines = items.map(buildPackagingLabel).filter(Boolean).join(', ')

    updateField('packaging', packagingLines)
  }

  // #8: Set default MARKS & NOS on first edit if blank
  if (field === 'marksAndNos' && !value && !items[index].marksNosManuallySet) {
    items[index].marksAndNos = buildDefaultMarks()
  }
  if (field === 'marksAndNos') {
    items[index].marksNosManuallySet = true
  }

  updateField('items', items)
}

// ─── Totals ───────────────────────────────────────────────────────────────────
const totalNet   = computed(() => (formData.value.items || []).reduce((s, i) => s + (i.netWeight   || 0), 0))
const totalGross = computed(() => (formData.value.items || []).reduce((s, i) => s + (i.grossWeight || 0), 0))

// ─── #15 #16 Notes ───────────────────────────────────────────────────────────
// Notes are always editable even after Confirm (stored separately from formData)
// ── note เก็บแค่ 1 อัน ──────────────────────────────────────────────────
const notes = ref(
  store.commercialInvoiceNote ? [store.commercialInvoiceNote] : [],
)
 
// เพิ่ม note ได้แค่ครั้งเดียว (ถ้ามีแล้วให้ replace)
function handleAddNote(text) {
  const note = {
    id: Date.now(),
    text,
    date: new Date().toLocaleString('en-GB'),
  }

  notes.value = [note]               // ← replace ไม่ใช่ push
}
 
// แก้ไข note
function handleEditNote({ id, text }) {
  if (notes.value[0]?.id === id) {
    notes.value[0].text = text
  }
}
 
// ลบ note
function handleDeleteNote(noteId) {
  notes.value = notes.value.filter(n => n.id !== noteId)
}
 


// ─── Confirm wrapper ──────────────────────────────────────────────────────────
function handleConfirm() {
  if (dateWarning.value) return   // #2: block confirm when date is invalid
  confirm()
}

// ─── Watchers ─────────────────────────────────────────────────────────────────
// #8: Auto-set MARKS & NOS defaults when items load and field is empty
watch(
  () => formData.value.items,
  items => {
    if (!items?.length) return

    const updated = items.map(item => ({
      ...item,
      marksAndNos: item.marksAndNos || buildDefaultMarks(),
    }))


    // Only patch if any item was missing the default
    const needsPatch = items.some((item, i) => item.marksAndNos !== updated[i].marksAndNos)
    if (needsPatch) updateField('items', updated)
  },
  { immediate: true, deep: false },
)

// Re-init notes from store when document changes
watch(() => store.documentId, () => {
  notes.value = store.packingListNotes || []
})

// ─── Utilities ────────────────────────────────────────────────────────────────
function splitLines(text) {
  return text ? String(text).split('\n') : []
}

function fmtNum(v) {
  return v != null
    ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00'
}

function fmtDec(v) {
  return v != null ? Number(v).toFixed(2) : '0.00'
}

function truncate(str, len) {
  return str?.length > len ? str.slice(0, len) + '…' : str
}
</script>

<style src="./css/PackingListTab.css" />
