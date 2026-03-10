<!--
  CommercialInvoiceTab.vue — Vue 3 + Vuetify 3 + Composition API
  Stylelint: stylelint-config-standard + stylelint-order (grouped)

  Figma analysis:
  - Image 1 (SAVED): mostly display text, yellow = pre-filled data
  Editable: Unit Price, Amount currency, FOB value, Ocean Freight, Insurance, Account No dropdown
  - Image 2 (CONFIRMED): all display text, no inputs

  Sections:
  1. Title + refs (always display, yellow highlight when SAVED)
  2. Payer | Consignee | Payment + Due Date (always text)
  3. Shipping (always text)
  4. Items table (unit price = input, amount currency = dropdown)
  5. CIF/FOB/Freight/Insurance (some inputs)
  6. Footer (always display text, some yellow highlight)
  7. Banking Detail (account no = dropdown, rest text)
-->
<template>
  <div class="tab-page">
    <div class="tab-content">
      <!-- ================================================ -->
      <!-- SECTION 1: Title + Reference (always display)     -->
      <!-- ================================================ -->
      <div class="section">
        <h2 class="section-title">
          COMMERCIAL INVOICE
        </h2>

        <div class="ref-area">
          <div class="ref-area__spacer" />
          <div class="ref-area__content">
            <div
              class="ref-val"
              :class="{ 'ref-val--highlight': !isConfirmed }"
            >
              {{ formData.date }}
            </div>
            <div
              class="ref-val"
              :class="{ 'ref-val--highlight': !isConfirmed }"
            >
              INVOICE NO. : {{ formData.invoiceNo }} ({{ formData.contractNo }})
            </div>
            <div
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

      <!-- ================================================ -->
      <!-- SECTION 2: Payer | Consignee | Payment (all text) -->
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

          <!-- Payment + Due Date (always text) -->
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

      <!-- ================================================ -->
      <!-- SECTION 3: Shipping (always text)                  -->
      <!-- ================================================ -->
      <div class="section">
        <div class="ship-grid">
          <div class="ship-cell ship-cell--wide">
            <span class="ship-label">Feeder :</span>
            <span class="ship-value">{{ formData.feeder }}</span>
          </div>
          <div class="ship-cell ship-cell--wide">
            <span class="ship-label">Vessel :</span>
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
      </div>

      <!-- ================================================ -->
      <!-- SECTION 4: Items Table                             -->
      <!-- ================================================ -->
      <div class="section">
        <!-- Header -->
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
            UNIT PRICE<br>(US$/KGS)
          </div>
          <div class="tbl-c tbl-c--amt text-right">
            AMOUNT
            <!-- Currency dropdown (edit mode only) -->
            <div
              v-if="!isReadonly"
              class="amt-currency"
            >
              <VSelect
                :model-value="formData.amountCurrency || 'US$'"
                :items="CURRENCY_OPTIONS"
                variant="outlined"
                density="compact"
                hide-details
                class="amt-currency__select"
                @update:model-value="(v) => updateField('amountCurrency', v)"
              />
            </div>
            <div
              v-else
              class="amt-currency-text"
            >
              US$
            </div>
          </div>
        </div>

        <!-- Rows -->
        <div
          v-for="(item, idx) in formData.items"
          :key="item.id || idx"
          class="tbl-body"
        >
          <!-- Marks -->
          <div class="tbl-c tbl-c--marks">
            <div
              v-for="(line, li) in splitLines(item.marksAndNos)"
              :key="li"
            >
              {{ line }}
            </div>
          </div>

          <!-- Description -->
          <div class="tbl-c tbl-c--desc">
            <div>{{ item.descriptionOfGoods }}</div>
            <div class="text-muted">
              ({{ item.subDescription }})
            </div>
          </div>

          <!-- Quantity (display, yellow highlight in edit) -->
          <div class="tbl-c tbl-c--qty text-right">
            <span :class="{ 'highlight-val': !isConfirmed }">
              {{ fmtNum(item.quantity) }}
            </span>
          </div>

          <!-- Unit Price (INPUT in edit mode) -->
          <div class="tbl-c tbl-c--price text-right">
            <VTextField
              v-if="!isReadonly"
              :model-value="item.unitPrice"
              type="number"
              variant="outlined"
              density="compact"
              hide-details
              reverse
              @update:model-value="(v) => handleItemUpdate(idx, 'unitPrice', Number(v))"
            />
            <span v-else>{{ item.unitPrice?.toFixed(2) }}</span>
          </div>

          <!-- Amount (display, calculated) -->
          <div class="tbl-c tbl-c--amt text-right">
            {{ fmtNum(item.amount) }}
          </div>
        </div>

        <!-- Empty -->
        <div
          v-if="!formData.items?.length"
          class="tbl-empty"
        >
          No items
        </div>

        <!-- Total -->
        <div class="tbl-foot">
          <div class="tbl-c tbl-c--marks tbl-c--bold">
            Total
          </div>
          <div class="tbl-c tbl-c--desc" />
          <div class="tbl-c tbl-c--qty text-right">
            <div>{{ fmtNum(totalQty) }}</div>
            <div
              v-if="formData.totalDescription"
              :class="{ 'highlight-val': !isConfirmed }"
            >
              ({{ formData.totalDescription }})
            </div>
          </div>
          <div class="tbl-c tbl-c--price" />
          <div class="tbl-c tbl-c--amt text-right tbl-c--bold">
            {{ fmtNum(totalAmount) }}
          </div>
        </div>
      </div>

      <!-- ================================================ -->
      <!-- SECTION 5: CIF / FOB / Freight / Insurance         -->
      <!-- ================================================ -->
      <div class="section">
        <div
          v-for="row in pricingRows"
          :key="row.key"
          class="pricing-row"
        >
          <!-- Type + Port -->
          <div class="pricing-row__left">
            <!-- CIF/FOB dropdown in edit mode -->
            <template v-if="row.hasType && !isReadonly">
              <VSelect
                :model-value="row.type"
                :items="['CIF', 'FOB']"
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
              {{ row.type }}
            </span>

            <span class="pricing-row__port">{{ row.port }}</span>
          </div>

          <!-- US$ + Value -->
          <div class="pricing-row__right">
            <span class="pricing-row__currency">US$</span>
            <div class="pricing-row__amount">
              <!-- FOB, Ocean Freight, Insurance = INPUT in edit mode -->
              <VTextField
                v-if="!isReadonly && row.editable"
                :model-value="formData[row.key]"
                type="number"
                variant="outlined"
                density="compact"
                hide-details
                reverse
                @update:model-value="(v) => updateField(row.key, Number(v))"
              />
              <span
                v-else
                class="pricing-row__val"
              >
                {{ fmtNum(formData[row.key]) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================ -->
      <!-- SECTION 6: Footer (always display text)            -->
      <!-- ================================================ -->
      <div class="section">
        <div
          v-for="f in FOOTER_FIELDS"
          :key="f.key"
          class="info-row"
        >
          <span class="info-row__label">{{ f.label }}</span>
          <span
            class="info-row__value"
            :class="{ 'highlight-val': f.highlight && !isConfirmed }"
          >
            {{ formData[f.key] }}
          </span>
        </div>
      </div>

      <!-- ================================================ -->
      <!-- SECTION 7: Banking Detail                          -->
      <!-- ================================================ -->
      <div class="section">
        <h3 class="banking-title">
          Banking Detail
        </h3>

        <!-- Account No = dropdown in edit mode -->
        <div class="info-row">
          <span class="info-row__label">Account No :</span>
          <div class="info-row__value">
            <VSelect
              v-if="!isReadonly"
              :model-value="formData.bankingDetail?.accountNo"
              :items="ACCOUNT_OPTIONS"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="(v) => updateBanking('accountNo', v)"
            />
            <span v-else>{{ formData.bankingDetail?.accountNo }}</span>
          </div>
        </div>

        <!-- Bank Name, Address, Swift Code = always text -->
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

    <!-- Action Bar -->
    <TabActionBar
      :tab-key="TabKey.COMMERCIAL_INVOICE"
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
import { TabKey, TabStatus } from '../../types/shipDocument'
import { useTabForm } from '../../composables/useTabForm'
import { usePrint } from '../../composables/usePrint'
import { useShipDocumentStore } from '../../stores/shipDocumentStore'
import { tabApiMap } from '../../services/shipDocumentApi'
import TabActionBar from '../shared/TabActionBar.vue'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CURRENCY_OPTIONS = ['US$', 'THB', 'EUR']

const ACCOUNT_OPTIONS = [
  '21-31080051 SANYO KASEI (THAILAND) LTD.',
]

const FOOTER_FIELDS = [
  { key: 'packing', label: 'PACKING :', highlight: true },
  { key: 'countryOfOrigin', label: 'COUNTRY OF ORIGIN :', highlight: false },
  { key: 'makerName', label: 'MAKER NAME :', highlight: false },
  { key: 'packaging', label: 'PACKAGING :', highlight: true },
  { key: 'lotNo', label: 'Lot No :', highlight: false },
]

// ---------------------------------------------------------------------------
// Composables
// ---------------------------------------------------------------------------

const store = useShipDocumentStore()

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

const { print: handlePrint } = usePrint(TabKey.COMMERCIAL_INVOICE)

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------

const isConfirmed = computed(() => tabStatus.value === TabStatus.CONFIRMED)

const totalQty = computed(() => {
  return (formData.value.items || []).reduce((s, i) => s + (i.quantity || 0), 0)
})

const totalAmount = computed(() => {
  return (formData.value.items || []).reduce((s, i) => s + (i.amount || 0), 0)
})

const pricingRows = computed(() => [
  {
    key: 'cifValue',
    typeKey: 'cifType',
    hasType: true,
    type: 'CIF',
    port: formData.value.cifPort || 'HCM CITY, VIETNAM',
    editable: false,
  },
  {
    key: 'fobValue',
    typeKey: 'fobType',
    hasType: true,
    type: 'FOB',
    port: formData.value.fobPort || 'LAEM CHABANG, THAILAND',
    editable: true,
  },
  {
    key: 'oceanFreight',
    typeKey: '',
    hasType: false,
    type: '',
    port: 'OCEAN FREIGHT',
    editable: true,
  },
  {
    key: 'insurance',
    typeKey: '',
    hasType: false,
    type: '',
    port: 'INSURANCE',
    editable: true,
  },
])

// ---------------------------------------------------------------------------
// Methods
// ---------------------------------------------------------------------------

function handleItemUpdate(index, field, value) {
  const items = [...formData.value.items]

  items[index] = { ...items[index], [field]: value }
  updateField('items', items)
}

function updateBanking(field, value) {
  updateField('bankingDetail', {
    ...formData.value.bankingDetail,
    [field]: value,
  })
}

function splitLines(text) {
  return text ? String(text).split('\n') : []
}

function fmtNum(v) {
  return v != null
    ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00'
}
</script>

<style src="./css/CommercialInvoiceTab.css">

</style>
