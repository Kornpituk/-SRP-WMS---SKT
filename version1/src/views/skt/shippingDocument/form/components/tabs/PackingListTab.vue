 · VUE
<!--
  PackingListTab.vue — Vue 3 + Vuetify 3 + Composition API
  Style: Stylelint compliant (stylelint-config-standard + stylelint-order)

  Property order convention (grouped):
  1. Positioning  (position, top, right, bottom, left, z-index)
  2. Box Model    (display, flex, grid, width, height, margin, padding, border)
  3. Typography   (font, line-height, letter-spacing, text-align, white-space, color)
  4. Visual       (background, opacity, overflow)
  5. Misc         (cursor, transition)
-->
<template>
  <div class="tab-page">
    <div class="tab-content">
      <!-- ================================================ -->
      <!-- SECTION 1: Title + Reference fields               -->
      <!-- ================================================ -->
      <div class="section">
        <h2 class="section-title">
          PACKING LIST
        </h2>

        <!-- Date -->
        <div class="ref-line">
          <div class="ref-line__label" />
          <div class="ref-line__field">
            <VTextField
              :model-value="formData.date"
              :readonly="isReadonly"
              type="date"
              variant="outlined"
              density="compact"
              hide-details
              prepend-inner-icon="mdi-calendar"
              :error-messages="getError('date').value"
              @update:model-value="(v) => updateField('date', v)"
            />
          </div>
        </div>

        <!-- Invoice No + (C-No) -->
        <div class="ref-line">
          <div class="ref-line__label">
            INVOICE NO. :
          </div>
          <div class="ref-line__field ref-line__field--split">
            <VTextField
              :model-value="formData.invoiceNo"
              :readonly="isReadonly"
              variant="outlined"
              density="compact"
              hide-details
              class="ref-line__main"
              :error-messages="getError('invoiceNo').value"
              @update:model-value="(v) => updateField('invoiceNo', v)"
            />
            <VTextField
              :model-value="formData.contractNo"
              :readonly="isReadonly"
              variant="outlined"
              density="compact"
              hide-details
              class="ref-line__sub"
              placeholder="(C-2509155)"
              @update:model-value="(v) => updateField('contractNo', v)"
            />
          </div>
        </div>

        <!-- PO No -->
        <div class="ref-line">
          <div class="ref-line__label">
            PO NO :
          </div>
          <div class="ref-line__field">
            <VTextField
              :model-value="formData.poNo"
              :readonly="isReadonly"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="(v) => updateField('poNo', v)"
            />
          </div>
        </div>

        <!-- Proforma Invoice No -->
        <div class="ref-line">
          <div class="ref-line__label">
            PROFORMA INVOICE NO. :
          </div>
          <div class="ref-line__field">
            <VTextField
              :model-value="formData.proformaInvoiceNo"
              :readonly="isReadonly"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="(v) => updateField('proformaInvoiceNo', v)"
            />
          </div>
        </div>
      </div>

      <!-- ================================================ -->
      <!-- SECTION 2: Payer (text) | Consignee (text) |      -->
      <!--            Payment + Due Date (inputs)             -->
      <!-- ================================================ -->
      <div class="section">
        <div class="party-grid">
          <!-- Payer -->
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

          <!-- Consignee -->
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

          <!-- Payment + Due Date -->
          <div class="party-block party-block--inputs">
            <div class="kv-pair">
              <span class="kv-pair__label">Payment :</span>
              <VSelect
                :model-value="formData.payment"
                :readonly="isReadonly"
                :items="PAYMENT_OPTIONS"
                variant="outlined"
                density="compact"
                hide-details
                class="kv-pair__input"
                @update:model-value="(v) => updateField('payment', v)"
              />
            </div>
            <div class="kv-pair kv-pair--spaced">
              <span class="kv-pair__label">Due Date :</span>
              <VTextField
                :model-value="formData.dueDate"
                :readonly="isReadonly"
                type="date"
                variant="outlined"
                density="compact"
                hide-details
                prepend-inner-icon="mdi-calendar"
                class="kv-pair__input"
                @update:model-value="(v) => updateField('dueDate', v)"
              />
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
              :model-value="formData.feeder"
              :readonly="isReadonly"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="(v) => updateField('feeder', v)"
            />
          </div>
          <div class="ship-cell ship-cell--wide">
            <span class="ship-label">Vessel :</span>
            <VTextField
              :model-value="formData.vessel"
              :readonly="isReadonly"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="(v) => updateField('vessel', v)"
            />
          </div>
          <div class="ship-cell ship-cell--narrow">
            <span class="ship-label">ETD :</span>
            <VTextField
              :model-value="formData.etd"
              :readonly="isReadonly"
              type="date"
              variant="outlined"
              density="compact"
              hide-details
              prepend-inner-icon="mdi-calendar"
              @update:model-value="(v) => updateField('etd', v)"
            />
          </div>
        </div>

        <div class="ship-grid ship-grid--spaced">
          <div class="ship-cell ship-cell--wide">
            <span class="ship-label">From :</span>
            <VAutocomplete
              :model-value="formData.from"
              :readonly="isReadonly"
              :items="PORT_OPTIONS"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="(v) => updateField('from', v)"
            />
          </div>
          <div class="ship-cell ship-cell--wide">
            <span class="ship-label">To :</span>
            <VAutocomplete
              :model-value="formData.to"
              :readonly="isReadonly"
              :items="PORT_OPTIONS"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="(v) => updateField('to', v)"
            />
          </div>
          <div class="ship-cell ship-cell--narrow">
            <span class="ship-label">ETA:</span>
            <VTextField
              :model-value="formData.eta"
              :readonly="isReadonly"
              type="date"
              variant="outlined"
              density="compact"
              hide-details
              prepend-inner-icon="mdi-calendar"
              @update:model-value="(v) => updateField('eta', v)"
            />
          </div>
        </div>
      </div>

      <!-- ================================================ -->
      <!-- SECTION 3: Items Table                             -->
      <!-- ================================================ -->
      <div class="section">
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
              <div class="text-muted">
                ({{ item.subDescription }})
              </div>
            </template>
          </div>

          <div class="tbl-c tbl-c--pkg">
            <template v-if="!isReadonly">
              <VSelect
                :model-value="item.packageType"
                :items="PACKAGE_TYPES"
                variant="outlined"
                density="compact"
                hide-details
                class="tbl-field--spaced"
                @update:model-value="(v) => handleItemUpdate(idx, 'packageType', v)"
              />
              <div class="pkg-row tbl-field--spaced">
                <div class="pkg-row__qty">
                  {{ item.quantity }}
                </div>
                <VSelect
                  :model-value="item.unitType"
                  :items="UNIT_TYPES"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="pkg-row__unit"
                  @update:model-value="(v) => handleItemUpdate(idx, 'unitType', v)"
                />
                <VTextField
                  :model-value="item.palletCount"
                  type="number"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="pkg-row__pallet"
                  @update:model-value="(v) => handleItemUpdate(idx, 'palletCount', Number(v))"
                />
                <span class="pkg-row__text">PALLET</span>
              </div>
              <div class="tare-row">
                <span>Tare Weight (KG)</span>
                <span class="tare-row__val">{{ fmtDec(item.tareWeightDrum) }}</span>
                <span>Tare Weight (KG)</span>
                <VSelect
                  :model-value="item.tareWeightPallet"
                  :items="TARE_OPTIONS"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="tare-row__select"
                  @update:model-value="(v) => handleItemUpdate(idx, 'tareWeightPallet', Number(v))"
                />
              </div>
            </template>
            <template v-else>
              <div>{{ item.package || item.packageType }}</div>
              <div class="text-muted">
                {{ fmtPkg(item) }}
              </div>
            </template>
          </div>

          <div class="tbl-c tbl-c--wt text-right">
            <VTextField
              v-if="!isReadonly"
              :model-value="item.netWeight"
              type="number"
              variant="outlined"
              density="compact"
              hide-details
              reverse
              @update:model-value="(v) => handleItemUpdate(idx, 'netWeight', Number(v))"
            />
            <span v-else>{{ fmtNum(item.netWeight) }}</span>
          </div>

          <div class="tbl-c tbl-c--wt text-right">
            <VTextField
              v-if="!isReadonly"
              :model-value="item.grossWeight"
              type="number"
              variant="outlined"
              density="compact"
              hide-details
              reverse
              @update:model-value="(v) => handleItemUpdate(idx, 'grossWeight', Number(v))"
            />
            <span v-else>{{ fmtNum(item.grossWeight) }}</span>
          </div>
        </div>


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

      <!-- ================================================ -->
      <!-- SECTION 4: Footer (display text only)              -->
      <!-- ================================================ -->
      <div class="section">
        <div
          v-for="f in FOOTER_FIELDS"
          :key="f.key"
          class="info-row"
        >
          <span class="info-row__label">{{ f.label }}</span>
          <span class="info-row__value">{{ formData[f.key] }}</span>
        </div>
      </div>
    </div>

    <TabActionBar
      :tab-key="TabKey.PACKING_LIST"
      :is-loading="isLoading"
      :is-dirty="isDirty"
      @print="handlePrint"
      @save-draft="saveDraft"
      @confirm="confirm"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { TabKey } from '../../types/shipDocument'
import { useTabForm } from '../../composables/useTabForm'
import { usePrint } from '../../composables/usePrint'
import { useShipDocumentStore } from '../../stores/shipDocumentStore'
import { tabApiMap } from '../../services/shipDocumentApi'
import TabActionBar from '../shared/TabActionBar.vue'

const PAYMENT_OPTIONS = ['T/T in advance', 'L/C', 'D/P', 'D/A']
const PORT_OPTIONS = ['LAEM CHABANG, THAILAND', 'HCM CITY, VIETNAM', 'HAIPHONG, VIETNAM', 'BANGKOK, THAILAND']
const PACKAGE_TYPES = ['250KG PLASTIC DRUM', '200KG PLASTIC DRUM', '1000KG IBC TANK', '25KG BAG']
const UNIT_TYPES = ['DRUM', 'CARTON', 'BAG']
const TARE_OPTIONS = [3.00, 4.00, 5.00, 6.00]

const FOOTER_FIELDS = [
  { key: 'packing', label: 'PACKING :' },
  { key: 'countryOfOrigin', label: 'COUNTRY OF ORIGIN :' },
  { key: 'makerName', label: 'MAKER NAME :' },
  { key: 'packaging', label: 'PACKAGING :' },
  { key: 'lotNo', label: 'Lot No :' },
]

const store = useShipDocumentStore()

const {
  formData, isDirty, isLoading, isReadonly,
  updateField, saveDraft, confirm, getError,
} = useTabForm(TabKey.PACKING_LIST, {
  onSaveDraft: data => tabApiMap[TabKey.PACKING_LIST].save(store.documentId, data),
  onConfirm: data => tabApiMap[TabKey.PACKING_LIST].confirm(store.documentId, data),
  validate: data => {
    const errors = {}
    if (!data.date) errors.date = ['Date is required']
    if (!data.invoiceNo) errors.invoiceNo = ['Invoice No. is required']
    
    return Object.keys(errors).length > 0 ? errors : null
  },
})

const { print: handlePrint } = usePrint(TabKey.PACKING_LIST)

const totalNet = computed(() => (formData.value.items || []).reduce((s, i) => s + (i.netWeight || 0), 0))
const totalGross = computed(() => (formData.value.items || []).reduce((s, i) => s + (i.grossWeight || 0), 0))

function handleItemUpdate(index, field, value) {
  const items = [...formData.value.items]

  items[index] = { ...items[index], [field]: value }
  updateField('items', items)
}

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

function fmtPkg(item) {
  return item.packageDetail || `${item.quantity || 0} DRUMS (${item.palletCount || 0} PALLETS)`
}
</script>

<style  src="./css/PackingListTab.css" />
