<!--
  CommercialInvoiceTab.vue — Vue 3 + Vuetify 3 + Composition API
  ✅ REQ-1  Yellow-highlight fields read-only, sourced from Packing List
  ✅ REQ-2  Currency dropdown · Amount = Qty×Price · CIF calc · Insurance calc
  ✅ REQ-3  Save Draft
  ✅ REQ-4  Banking dropdown + USD/JPY prefix + L/C|D/P always USD-account
  ✅ REQ-5  Shipping Mode → "{MODE} FREIGHT"
  ✅ REQ-6  FOB type + Term of Pricing dropdowns from master data
-->
<template>
  <div class="tab-page">
    <div class="tab-content">
      <!-- SECTION 1: Title + Reference -->
      <div class="section">
        <h2 class="section-title">
          COMMERCIAL INVOICE
        </h2>
        <div class="ref-area">
          <div class="ref-area__spacer" />
          <div class="ref-area__content">
            <div
              data-testid="field-date"
              class="ref-val"
              :class="{ 'ref-val--highlight': !isConfirmed }"
            >
              {{ formData.date }}
            </div>
            <div
              data-testid="field-invoice-no"
              class="ref-val"
              :class="{ 'ref-val--highlight': !isConfirmed }"
            >
              INVOICE NO. : {{ formData.invoiceNo }} ({{ formData.contractNo }})
            </div>
            <div
              data-testid="field-po-no"
              class="ref-val"
              :class="{ 'ref-val--highlight': !isConfirmed }"
            >
              PO NO : {{ formData.poNo }}
            </div>
            <div class="ref-val">
              PROFORMA INVOICE NO. : {{ formData.proformaInvoiceNo }}
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 2: Payer | Consignee | Payment -->
      <div class="section">
        <div class="party-grid">
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
          <div class="party-block party-block--narrow">
            <div class="kv-pair">
              <span class="kv-pair__label">Payment :</span>
              <span class="kv-pair__value">{{ formData.payment }}</span>
            </div>
            <div class="kv-pair kv-pair--spaced">
              <span class="kv-pair__label">Due Date :</span>
              <span class="kv-pair__value">{{ formData.dueDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 3: Shipping -->
      <div class="section">
        <template v-if="isAirMode">
          <div class="air-ship-layout">
            <div class="air-ship-layout__left">
              <div class="air-ship-flight">
                <span class="ship-label">Fight :</span>
                <div class="air-ship-flight__body">
                  <span class="ship-value">{{ formData.feeder }}</span>
                  <div class="air-ship-subfield">
                    <span class="air-ship-subfield__label">MAWB NO.</span>
                    <span class="ship-value">{{ formData.mawbNo }}</span>
                  </div>
                  <div class="air-ship-subfield">
                    <span class="air-ship-subfield__label">HAWB NO.</span>
                    <span class="ship-value">{{ formData.hawbNo }}</span>
                  </div>
                </div>
              </div>

              <div class="air-ship-route">
                <div class="ship-cell ship-cell--wide">
                  <span class="ship-label">From :</span>
                  <span class="ship-value">{{ formData.from }}</span>
                </div>
                <div class="ship-cell ship-cell--wide">
                  <span class="ship-label">To :</span>
                  <span class="ship-value">{{ formData.to }}</span>
                </div>
              </div>
            </div>

            <div class="air-ship-layout__right">
              <div class="air-ship-time">
                <span class="ship-label">ETD :</span>
                <div class="ship-datetime">
                  <span class="ship-value">{{ formData.etd }}</span>
                  <span class="ship-value">{{ formatTimeDisplay(formData.etdTime) }}</span>
                </div>
              </div>
              <div class="air-ship-time air-ship-time--spaced">
                <span class="ship-label">ETA:</span>
                <div class="ship-datetime">
                  <span class="ship-value">{{ formData.eta }}</span>
                  <span class="ship-value">{{ formatTimeDisplay(formData.etaTime) }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="ship-grid">
            <div class="ship-cell ship-cell--wide">
              <span class="ship-label">{{ primaryShipLabel }}</span>
              <span class="ship-value">{{ formData.feeder }}</span>
            </div>
            <div class="ship-cell ship-cell--wide">
              <span class="ship-label">{{ secondaryShipLabel }}</span>
              <span class="ship-value">{{ formData.vessel }}</span>
            </div>
            <div class="ship-cell ship-cell--narrow">
              <span class="ship-label">ETD :</span>
              <span class="ship-value">{{ formData.etd }}</span>
            </div>
          </div>
          <div class="ship-grid ship-grid--spaced">
            <div class="ship-cell ship-cell--wide">
              <span class="ship-label">From :</span>
              <span class="ship-value">{{ formData.from }}</span>
            </div>
            <div class="ship-cell ship-cell--wide">
              <span class="ship-label">To :</span>
              <span class="ship-value">{{ formData.to }}</span>
            </div>
            <div class="ship-cell ship-cell--narrow">
              <span class="ship-label">ETA:</span>
              <span class="ship-value">{{ formData.eta }}</span>
            </div>
          </div>
        </template>

        <!-- REQ-5: Shipping Mode display -->
        <div
          v-if="shippingModeLabel"
          class="ship-grid ship-grid--spaced"
        >
          <div class="ship-cell ship-cell--wide">
            <span class="ship-label">Shipping Mode :</span>
            <span
              data-testid="shipping-mode-display"
              class="ship-value ship-value--mode"
            >
              {{ shippingModeLabel }}
            </span>
          </div>
        </div>
      </div>

      <!-- SECTION 4: Items Table -->
      <div class="section">
        <div class="tbl-head">
          <div class="tbl-c tbl-c--marks">
            MARKS &amp; NOS
          </div>
          <div class="tbl-c tbl-c--desc">
            DESCRIPTION OF GOODS
          </div>
          <div class="tbl-c tbl-c--qty text-right">
            QUANTITY<br>(KGS)
          </div>
          <div class="tbl-c tbl-c--price text-right">
            UNIT PRICE<br>({{ activeCurrency }}/KGS)
          </div>
          <div class="tbl-c tbl-c--amt text-right">
            <div
              v-if="!isReadonly"
              class="amt-currency"
            >
              <span class="amt-currency__label">AMOUNT</span>
              <VSelect
                :model-value="formData.amountCurrency || DEFAULT_CURRENCY"
                :items="CURRENCY_OPTIONS"
                variant="outlined"
                density="compact"
                hide-details
                class="amt-currency__select"
                data-testid="currency-select"
                @update:model-value="handleCurrencyChange"
              />
            </div>
            <div
              v-else
              class="amt-currency-text"
            >
              AMOUNT ({{ activeCurrency }})
            </div>
          </div>
        </div>

        <div
          v-for="(item, idx) in invoiceItems"
          :key="item.id ?? idx"
          class="tbl-body"
        >
          <div class="tbl-c tbl-c--marks">
            <div
              v-for="(line, li) in splitLines(item.marksAndNos)"
              :key="li"
            >
              {{ line }}
            </div>
          </div>
          <div class="tbl-c tbl-c--desc">
            <div>{{ item.descriptionOfGoods }}</div>
            <div class="text-muted">
              ({{ item.subDescription }})
            </div>
            <div
              v-if="item.isSample"
              class="sample-desc"
            >
              <div
                v-for="(line, si) in splitLines(item.sampleDescription)"
                :key="si"
              >
                {{ line }}
              </div>
            </div>
          </div>
          <div class="tbl-c tbl-c--qty text-right">
            <span :class="{ 'highlight-val': !isConfirmed }">{{ fmtNum(item.quantity) }}</span>
          </div>
          <div class="tbl-c tbl-c--price text-right">
            <VTextField
              v-if="!isReadonly"
              :model-value="item.unitPrice"
              type="number"
              variant="outlined"
              density="compact"
              hide-details
              reverse
              @update:model-value="(v) => handleItemUpdate(idx, Number(v))"
            />
            <span v-else>{{ fmtNum(item.unitPrice) }}</span>
          </div>
          <div class="tbl-c tbl-c--amt text-right">
            {{ item.amountText || fmtNum(item.amount) }}
          </div>
        </div>

        <div
          v-if="!invoiceItems.length"
          class="tbl-empty"
        >
          No items
        </div>

        <div class="tbl-foot">
          <div class="tbl-c tbl-c--marks tbl-c--bold">
            Total
          </div>
          <div class="tbl-c tbl-c--desc" />
          <div class="tbl-c tbl-c--qty text-right">
            <div>{{ fmtNum(totalQty) }}</div>
            <div
              v-if="derivedPackaging"
              :class="{ 'highlight-val': !isConfirmed }"
            >
              ({{ derivedPackaging }})
            </div>
          </div>
          <div class="tbl-c tbl-c--price" />
          <div class="tbl-c tbl-c--amt text-right tbl-c--bold">
            {{ fmtNum(totalAmount) }}
          </div>
        </div>
      </div>

      <!-- SECTION 5: Term of Pricing + CIF/FOB/Freight/Insurance -->
      <div class="section">
        <!-- REQ-6: Term of Pricing dropdown -->
        <div class="pricing-term-row">
          <span class="pricing-term-row__label">Term of Pricing :</span>
          <div class="pricing-term-row__control">
            <VSelect
              v-if="!isReadonly"
              :model-value="formData.pricingTerm"
              :items="PRICING_TERM_OPTIONS"
              variant="outlined"
              density="compact"
              hide-details
              data-testid="term-of-pricing-select"
              @update:model-value="handlePricingTermChange"
            />
            <span
              v-else
              data-testid="term-of-pricing-display"
              class="pricing-term-row__value"
            >
              {{ formData.pricingTerm }}
            </span>
          </div>
        </div>

        <div
          v-for="row in visiblePricingRows"
          :key="row.key"
          class="pricing-row"
        >
          <div class="pricing-row__left">
            <template v-if="row.hasType && !isReadonly">
              <VSelect
                :model-value="formData[row.typeKey]"
                :items="FOB_TYPE_OPTIONS"
                variant="outlined"
                density="compact"
                hide-details
                class="pricing-row__type-select"
                @update:model-value="(v) => updateField(row.typeKey, v)"
              />
            </template>
            <span
              v-else-if="row.hasType"
              class="pricing-row__type-text"
            >
              {{ formData[row.typeKey] || row.defaultType }}
            </span>
            <span class="pricing-row__port">{{ row.port }}</span>
          </div>
          <div class="pricing-row__right">
            <span class="pricing-row__currency">{{ activeCurrency }}</span>
            <div class="pricing-row__amount">
              <VTextField
                v-if="!isReadonly && row.editable"
                :model-value="formData[row.key]"
                type="number"
                variant="outlined"
                density="compact"
                hide-details
                reverse
                @update:model-value="(v) => handlePricingInput(row.key, Number(v))"
              />
              <span
                v-else
                class="pricing-row__val"
              >{{ fmtNum(formData[row.key]) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 6: Footer -->
      <div class="section">
        <div
          v-for="f in FOOTER_FIELDS"
          :key="f.key"
          class="info-row"
        >
          <!-- #17: Only display if value exists -->
          <template v-if="footerValue(f.key)">
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
                @update:model-value="(v) => updateField('lotNo', v)"
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
                @update:model-value="(v) => updateField('hsCode', v)"
              />
            </span>
            <span
              v-else
              class="info-row__value"
            >{{ footerValue(f.key) }}</span>
          </template>
        </div>
      </div>

      <!-- SECTION 7: Banking Detail -->
      <div class="section">
        <h3 class="banking-title">
          Banking Detail
        </h3>
        <div class="info-row">
          <span class="info-row__label">Account No :</span>
          <div class="info-row__value">
            <VSelect
              v-if="!isReadonly"
              :model-value="formData.bankingDetail?.accountNo"
              :items="filteredAccountOptions"
              variant="outlined"
              density="compact"
              hide-details
              data-testid="account-no-select"
              @update:model-value="(v) => updateBanking('accountNo', v)"
            />
            <span v-else>{{ formData.bankingDetail?.accountNo }}</span>
          </div>
        </div>
        <div class="info-row">
          <span class="info-row__label">Bank Name :</span>
          <span class="info-row__value">{{ formData.bankingDetail?.bankName }}</span>
        </div>
        <div class="info-row">
          <span class="info-row__label">Address :</span>
          <span class="info-row__value">{{ formData.bankingDetail?.address }}</span>
        </div>
        <div class="info-row">
          <span class="info-row__label">Swift Code :</span>
          <span class="info-row__value">{{ formData.bankingDetail?.swiftCode }}</span>
        </div>
      </div>
    </div>

    <TabActionBar
      :tab-key="TabKey.COMMERCIAL_INVOICE"
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
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'                          // ✅ FIX: เพิ่ม import useRoute
import { TabKey, TabStatus } from '../../types/shipDocument'
import { useTabForm } from '../../composables/useTabForm'
import { usePrint } from '../../composables/usePrint'
import { useShipDocumentStore } from '../../stores/shipDocumentStore'
import { tabApiMap } from '../../services/shipDocumentApi'
import {
  buildCommercialInvoiceRows,
  buildCommercialTotalAmount,
  buildPackagingSummary,
  buildPackingNames,
} from '../../utils/packingDerived'
import TabActionBar from '../shared/TabActionBar.vue'

const route = useRoute()

// อ่าน ?mode=ocean จาก URL  ← แทน props.tabKey ที่ไม่มีค่า
const shippMode = computed(() => route.query.mode || 'ocean')
const isAirMode = computed(() => shippMode.value === 'air')
const isCourierMode = computed(() => shippMode.value === 'courier')
const primaryShipLabel = computed(() => (isCourierMode.value ? 'Courier :' : 'Feeder :'))
const secondaryShipLabel = computed(() => (isCourierMode.value ? 'AWB No. :' : 'Vessel :'))


// ---------------------------------------------------------------------------
// Master Data constants
// ---------------------------------------------------------------------------

const DEFAULT_CURRENCY = 'US$'
const INSURANCE_RATE   = 0.0016   // 0.16%
const INSURANCE_MIN    = 15       // minimum $15
const INSURANCE_MARKUP = 1.1      // ×110%

const CURRENCY_OPTIONS     = ['US$', 'THB', 'EUR', 'JPY']
const PRICING_TERM_OPTIONS = ['CIF', 'FOB', 'EXWORK', 'C&F']
const FOB_TYPE_OPTIONS     = ['CIF', 'FOB', 'CFR']

/**
 * REQ-4: All bank accounts from Master Data.
 * Prefix 21 = USD accounts | Prefix 22 = JPY accounts
 */
const ALL_ACCOUNT_OPTIONS = [
  '21-31080051 SANYO KASEI (THAILAND) LTD.',
  '21-31080052 SANYO KASEI USD SECONDARY',
  '22-31080053 SANYO KASEI (THAILAND) JPY',
]

const FOOTER_FIELDS = [
  { key: 'packing',         label: 'PACKING :',           highlight: true  },
  { key: 'countryOfOrigin', label: 'COUNTRY OF ORIGIN :',  highlight: false },
  { key: 'makerName',       label: 'MAKER NAME :',         highlight: false },
  { key: 'packaging',       label: 'PACKAGING :',          highlight: true  },
  { key: 'lotNo',           label: 'Lot No :',             highlight: false },
  { key: 'hsCode',          label: 'HS CODE :'            },
]

// ─── #4 HS Code Types ────────────────────────────────────────────────────────
const HS_CODE_TYPES = [
  { title: '3906.90.20',    value: '3906.90.20' },
  { title: '3906.90.21',    value: '3906.90.21' },
  { title: '3906.90.22',    value: '3906.90.22' },
  { title: '3906.90.23',    value: '3906.90.23' },
]

// ─── #7 Print Display Fields ────────────────────────────────────────────────
const PRINT_DISPLAY_FIELDS = {
  buyer: ['FOB', 'Freight', 'Insurance', 'Lot No.', 'Product Description', 'Note'],
  customs: ['lotNo'],
}

// ---------------------------------------------------------------------------
// Composables
// ---------------------------------------------------------------------------

const store = useShipDocumentStore()                       // ✅ FIX: ใช้งานได้แล้ว

const {
  formData,
  isDirty,
  isLoading,
  isReadonly,
  tabStatus,
  updateField,
  saveDraft,
  confirm,
} = useTabForm(TabKey.COMMERCIAL_INVOICE, {
  onSaveDraft: data => tabApiMap[TabKey.COMMERCIAL_INVOICE].save(store.documentId, data),
  onConfirm: data => tabApiMap[TabKey.COMMERCIAL_INVOICE].confirm(store.documentId, data),
})

// ---------------------------------------------------------------------------
// Print
// ---------------------------------------------------------------------------

const { isPrinting, print } = usePrint(
  TabKey.COMMERCIAL_INVOICE,
  () => ({
    ...formData.value,
    packingItems: store.tabs[TabKey.PACKING_LIST]?.data?.items || [],
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

// ---------------------------------------------------------------------------
// Derived state
// ---------------------------------------------------------------------------

/** REQ-2: Active currency label used across the whole document */
const activeCurrency = computed(() => formData.value.amountCurrency || DEFAULT_CURRENCY)

/** REQ-1: confirmed state controls yellow highlight visibility */
const isConfirmed = computed(() => tabStatus.value === TabStatus.CONFIRMED)

const packingListData = computed(() => store.tabs[TabKey.PACKING_LIST]?.data || {})
const packingListItems = computed(() => packingListData.value.items || [])

const invoiceItems = computed(() => {
  const formItems = formData.value.items || []

  const sourceItems = packingListItems.value.length
    ? packingListItems.value.map((item, idx) => ({
      ...item,
      unitPrice: formItems[idx]?.unitPrice ?? item.unitPrice,
      amount: formItems[idx]?.amount ?? item.amount,
    }))
    : formItems

  return buildCommercialInvoiceRows(sourceItems)
})

const derivedPacking = computed(() => buildPackingNames(packingListItems.value) || formData.value.packing)
const derivedPackaging = computed(() => buildPackagingSummary(packingListItems.value) || formData.value.totalDescription || formData.value.packaging)

/** REQ-5: "{MODE} FREIGHT" display label */
const shippingModeLabel = computed(() => {
  const mode = formData.value.shippingMode

  if (!mode) return ''

  const upperMode = String(mode).toUpperCase()

  if (upperMode === 'AIR') return 'AIR FREIGHT'
  if (upperMode === 'TRUCK') return 'INLAND FREIGHT'

  return `${upperMode} FREIGHT`
})

/**
 * REQ-4: Bank accounts filtered by currency and payment method.
 *
 * Rules:
 *  - L/C or D/P payment → always USD account (prefix 21)
 *  - JPY currency        → prefix 22
 *  - All others          → prefix 21
 */
const filteredAccountOptions = computed(() => {
  const paymentMethod = formData.value.payment
  const currency      = activeCurrency.value

  // REQ-4: L/C and D/P always use USD accounts
  if (['L/C', 'D/P'].includes(paymentMethod)) {
    return ALL_ACCOUNT_OPTIONS.filter(a => a.startsWith('21'))
  }

  if (currency === 'JPY') {
    return ALL_ACCOUNT_OPTIONS.filter(a => a.startsWith('22'))
  }

  return ALL_ACCOUNT_OPTIONS.filter(a => a.startsWith('21'))
})

/** REQ-2: Total quantity (read-only, from PL) */
const totalQty = computed(() =>
  invoiceItems.value.reduce((s, i) => s + (i.quantity || 0), 0),
)

/** REQ-2: Total amount */
const totalAmount = computed(() =>
  buildCommercialTotalAmount(invoiceItems.value),
)

/** REQ-2: Auto-calculated insurance. null when EXWORK. */
const autoInsurance = computed(() => {
  if (formData.value.pricingTerm === 'EXWORK') return null
  const baseCost = Number(formData.value.fobValue || 0) + Number(formData.value.oceanFreight || 0)
  const raw      = baseCost * INSURANCE_MARKUP * INSURANCE_RATE
  
  return Math.max(raw, INSURANCE_MIN)
})

/** REQ-5: Shipping mode from route query (used in ocean freight row label) */
const modeFreight = computed(() => {
  const mode = String(route.query?.mode || 'OCEAN').toUpperCase()

  if (mode === 'AIR' || mode === 'COURIER') return 'AIR FREIGHT'
  if (mode === 'TRUCK') return 'INLAND FREIGHT'

  return `${mode} FREIGHT`
})

/** REQ-2: Pricing rows — insurance row hidden when EXWORK */
const visiblePricingRows = computed(() => {
  const rows = [
    {
      key: 'cifValue',
      typeKey: 'cifType',
      hasType: true,
      defaultType: 'CIF',
      port: formData.value.cifPort || 'HCM CITY, VIETNAM',
      editable: false,
    },
    {
      key: 'fobValue',
      typeKey: 'fobType',
      hasType: true,
      defaultType: 'FOB',
      port: formData.value.fobPort || 'LAEM CHABANG, THAILAND',
      editable: true,
    },
    {
      key: 'oceanFreight',
      typeKey: '',
      hasType: false,
      defaultType: '',
      port: modeFreight.value,
      editable: true,
    },
  ]

  if (formData.value.pricingTerm !== 'EXWORK') {
    rows.push({
      key: 'insurance',
      typeKey: '',
      hasType: false,
      defaultType: '',
      port: 'INSURANCE',
      editable: true,
    })
  }

  return rows
})

// ---------------------------------------------------------------------------
// REQ-2: Unified watcher — CIF + Insurance auto-calculation
// ---------------------------------------------------------------------------

watch(
  () => [
    formData.value.fobValue,
    formData.value.oceanFreight,
    formData.value.insurance,
    formData.value.pricingTerm,
  ],
  (newVals, oldVals) => {
    const term    = formData.value.pricingTerm
    const fob     = Number(formData.value.fobValue     || 0)
    const freight = Number(formData.value.oceanFreight || 0)
    let   insur   = Number(formData.value.insurance    || 0)

    const isInsuranceManuallyEdited = newVals[2] !== oldVals?.[2]

    if (term === 'EXWORK' || term === 'C&F') {
      // C&F / EXWORK: CIF = FOB + Freight (no insurance)
      updateField('cifValue', fob + freight)
      
      return
    }

    if (term === 'CIF' || term === 'CFR') {
      if (!isInsuranceManuallyEdited) {
        // Auto-seed insurance from base cost (prevents circular dependency)
        const calculatedInsur = Math.max(
          (fob + freight) * INSURANCE_MARKUP * INSURANCE_RATE,
          INSURANCE_MIN,
        )

        if (insur !== calculatedInsur) {
          updateField('insurance', calculatedInsur)
          insur = calculatedInsur
        }
      }
      updateField('cifValue', fob + freight + insur)
    }
  },
  { deep: true },
)

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

/** REQ-2: Currency change + REQ-4: reset mismatched account */
function handleCurrencyChange(currency) {
  updateField('amountCurrency', currency)

  const currentAccount = formData.value.bankingDetail?.accountNo || ''
  const payment        = formData.value.payment

  // L/C and D/P always stay on prefix 21 regardless of currency
  if (['L/C', 'D/P'].includes(payment)) return

  const expectedPrefix = currency === 'JPY' ? '22' : '21'
  if (!currentAccount.startsWith(expectedPrefix)) {
    updateBanking('accountNo', null)
  }
}

/** REQ-2: unitPrice change → recalculate amount = qty × unitPrice */
function handleItemUpdate(index, unitPrice) {
  const items = [...(formData.value.items || [])]
  const item  = { ...(items[index] || {}) }
  const quantity = invoiceItems.value[index]?.quantity || item.quantity || 0

  item.unitPrice = unitPrice
  item.quantity = quantity
  item.amount    = quantity * unitPrice

  items[index] = item
  updateField('items', items)
}

/** REQ-2: Direct pricing field edit (watcher handles CIF recalc) */
function handlePricingInput(key, value) {
  updateField(key, value)
}

/** REQ-6: Pricing term change → seed insurance */
function handlePricingTermChange(term) {
  updateField('pricingTerm', term)
  if (term !== 'EXWORK' && autoInsurance.value !== null) {
    updateField('insurance', autoInsurance.value)
  }
}

/** REQ-4: Update single banking field */
function updateBanking(field, value) {
  updateField('bankingDetail', {
    ...formData.value.bankingDetail,
    [field]: value,
  })
}

function footerValue(key) {
  if (key === 'packing') return derivedPacking.value
  if (key === 'packaging') return derivedPackaging.value

  return formData.value[key]
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function splitLines(text) {
  return text ? String(text).split('\n') : []
}

function fmtNum(v) {
  return v != null
    ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00'
}

function formatTimeDisplay(value) {
  if (!value) return ''

  const [hours, minutes] = String(value).split(':')
  if (hours == null || minutes == null) return value

  const hourNum = Number(hours)
  const suffix = hourNum >= 12 ? 'PM' : 'AM'
  const normalized = ((hourNum + 11) % 12) + 1

  return `${String(normalized).padStart(2, '0')}:${minutes} ${suffix}`
}

// ---------------------------------------------------------------------------
// Notes
// ---------------------------------------------------------------------------

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
</script>

<style src="./css/CommercialInvoiceTab.css"></style>
