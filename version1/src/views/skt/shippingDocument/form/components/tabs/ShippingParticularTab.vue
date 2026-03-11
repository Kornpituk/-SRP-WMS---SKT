<!--
  ShippingParticularTab.vue — Vue 3 + Vuetify 3 + Composition API
  Stylelint: stylelint-config-standard + stylelint-order

  Figma analysis (Shipping_Document_30_.png):

  INPUTS:
  - BOOKING NO, B/L NO (text fields)
  - Container Type (dropdown: CY)
  - FCL CONTAINER (text field: 2 X 20)
  - M3 (text field: 0.00)
  - "-" field under product desc
  - HS CODE (dropdown: 3906.90.20)
  - CONTAINER & SEAL: MARK, FREIGHT PREPAID, SURRENDER B/L

  YELLOW CHIPS (display):
  - ETD, ETA dates
  - Package desc "160 DRUMS (20 PALLETS)"
  - N.W., G.W. values
  - Product desc "SN-DISPERSANT 5040..."

  PLAIN TEXT (display):
  - DATE, SHIPPER block, CONSIGNEE block, NOTIFY PARTY block
  - PORT OF RECEIPT, PORT OF LOADING, FEEDER, VESSEL
  - PORT, PORT OF DELIVERY, CY
  - Marks text, COUNTRY OF ORIGIN, pallet note
-->
<template>
  <div class="tab-page">
    <div class="tab-content">
      <!-- ================================================ -->
      <!-- Title                                              -->
      <!-- ================================================ -->
      <div class="section">
        <h2 class="section-title">
          SHIPPING PARTICULAR
        </h2>
      </div>

      <!-- ================================================ -->
      <!-- BOOKING NO / B/L NO / DATE                        -->
      <!-- ================================================ -->
      <div class="section">
        <div class="book-grid">
          <div class="book-cell">
            <span class="book-cell__label">BOOKING NO :</span>
            <VTextField
              :model-value="formData.bookingNo"
              :readonly="isReadonly"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="(v) => updateField('bookingNo', v)"
            />
          </div>
          <div class="book-cell">
            <span class="book-cell__label">B/L NO :</span>
            <VTextField
              :model-value="formData.blNo"
              :readonly="isReadonly"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="(v) => updateField('blNo', v)"
            />
          </div>
          <div class="book-cell book-cell--date">
            <span class="book-cell__label">DATE :</span>
            <span class="book-cell__text">{{ formData.date }}</span>
          </div>
        </div>
      </div>

      <!-- ================================================ -->
      <!-- SHIPPER (text) + "KINDLY ISSUE US..." (text)      -->
      <!-- ================================================ -->
      <div class="section">
        <div class="shipper-grid">
          <div class="shipper-grid__left">
            <div class="party-label">
              SHIPPER. :
            </div>
            <div class="party-text">
              <div>{{ formData.shipper?.name }}</div>
              <div>{{ formData.shipper?.address }}</div>
              <div v-if="formData.shipper?.address2">
                {{ formData.shipper.address2 }}
              </div>
              <div v-if="formData.shipper?.address3">
                {{ formData.shipper.address3 }}
              </div>
              <div>{{ formData.shipper?.city }}, {{ formData.shipper?.country }}</div>
              <div v-if="formData.shipper?.tel">
                TEL. {{ formData.shipper.tel }}
              </div>
              <div v-if="formData.shipper?.taxId">
                TAX ID {{ formData.shipper.taxId }}
              </div>
            </div>
          </div>
          <div class="shipper-grid__right">
            KINDLY ISSUE US, AT OUR REQUEST,<br>
            SHIPPING ORDER OR B/L FOR THE<br>
            FOLLOWING PARTICULAR:-
          </div>
        </div>
      </div>

      <!-- ================================================ -->
      <!-- CONSIGNEE (text)                                   -->
      <!-- ================================================ -->
      <div class="section">
        <div class="party-label">
          CONSIGNEE. :
        </div>
        <div class="party-text party-text--indent">
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
              – {{ formData.consignee.country }}
            </template>
          </div>
          <div v-if="formData.consignee?.tel">
            TEL.: {{ formData.consignee.tel }}
          </div>
          <div v-if="formData.consignee?.taxId">
            TAX ID : {{ formData.consignee.taxId }}
          </div>
          <div v-if="formData.consignee?.attn">
            ATTN : {{ formData.consignee.attn }}
          </div>
          <div v-if="formData.consignee?.email">
            Email : {{ formData.consignee.email }}
          </div>
        </div>
      </div>

      <!-- ================================================ -->
      <!-- NOTIFY PARTY (bordered box, text)                  -->
      <!-- ================================================ -->
      <div class="section">
        <div class="party-label">
          NOTIFY PARTY :
        </div>
        <div class="notify-box">
          <div>{{ formData.notifyParty?.name }}</div>
          <div>{{ formData.notifyParty?.address }}</div>
          <div v-if="formData.notifyParty?.address2">
            {{ formData.notifyParty.address2 }}
          </div>
          <div>{{ formData.notifyParty?.city }} {{ formData.notifyParty?.country }}</div>
          <div v-if="formData.notifyParty?.tel">
            TEL.: {{ formData.notifyParty.tel }}
          </div>
          <div v-if="formData.notifyParty?.taxId">
            TAX ID : {{ formData.notifyParty.taxId }}
          </div>
          <div v-if="formData.notifyParty?.attn">
            ATTN : {{ formData.notifyParty.attn }}
          </div>
          <div v-if="formData.notifyParty?.email">
            E-MAIL : {{ formData.notifyParty.email }}
          </div>
        </div>
      </div>

      <!-- ================================================ -->
      <!-- PORT OF RECEIPT / PORT OF LOADING (text)           -->
      <!-- ================================================ -->
      <div class="section">
        <div class="info-line">
          <span class="info-line__label">PORT OF RECEIPT :</span>
          <span>{{ formData.portOfReceipt }}</span>
        </div>
        <div class="info-line">
          <span class="info-line__label">PORT OF LOADING:</span>
          <span>{{ formData.portOfLoading }}</span>
        </div>
      </div>

      <!-- ================================================ -->
      <!-- FEEDER / VESSEL / Container Type / ETD / ETA       -->
      <!-- ================================================ -->
      <div class="section">
        <!-- Row 1: FEEDER (text) + ETD (yellow chip) -->
        <div class="ship-row">
          <div class="ship-row__main">
            <span class="ship-row__label">FEEDER :</span>
            <span>{{ formData.feeder }}</span>
          </div>
          <div class="ship-row__end">
            <span class="chip chip--yellow">ETD : {{ formData.etd }}</span>
          </div>
        </div>

        <!-- Row 2: VESSEL (text) + Container Type (dropdown) + ETA (yellow chip) -->
        <div class="ship-row ship-row--spaced">
          <div class="ship-row__main">
            <span class="ship-row__label">VESSEL :</span>
            <span>{{ formData.vessel }}</span>
          </div>
          <div class="ship-row__mid">
            <span class="ship-row__label">Container Type :</span>
            <VSelect
              :model-value="formData.containerType"
              :readonly="isReadonly"
              :items="CONTAINER_TYPES"
              variant="outlined"
              density="compact"
              hide-details
              class="ship-row__select"
              @update:model-value="(v) => updateField('containerType', v)"
            />
          </div>
          <div class="ship-row__end">
            <span class="chip chip--yellow">ETA : {{ formData.eta }}</span>
          </div>
        </div>
      </div>

      <!-- ================================================ -->
      <!-- PORT / PORT OF DELIVERY (text)                     -->
      <!-- ================================================ -->
      <div class="section">
        <div class="info-line">
          <span class="info-line__label">PORT :</span>
          <span>{{ formData.portOfDischarge }}</span>
        </div>
        <div class="info-line">
          <span class="info-line__label">PORT OF DELIVERY :</span>
          <span>{{ formData.portOfDelivery }}</span>
          <span class="info-line__extra">{{ formData.deliveryType || formData.containerType }}</span>
        </div>
      </div>

      <!-- ================================================ -->
      <!-- SHIPPING MARK (complex grid)                       -->
      <!-- ================================================ -->
      <div class="section">
        <div class="mark-label">
          SHIPPING MARK :
        </div>

        <div class="mark-grid">
          <!-- Left: Mark text lines -->
          <div class="mark-grid__left">
            <div
              v-for="(m, i) in (formData.shippingMark?.marks || [])"
              :key="i"
              class="mark-text"
            >
              {{ m }}
            </div>
          </div>

          <!-- Right: Detail grid -->
          <div class="mark-grid__right">
            <!-- Row 1: Package desc (chip) | N.W. | G.W. | M3 headers -->
            <div class="mark-detail-row">
              <div class="mark-detail-row__pkg">
                <span class="chip chip--yellow">{{ formData.shippingMark?.packageDescription }}</span>
              </div>
              <div class="mark-detail-row__header">
                N.W.
              </div>
              <div class="mark-detail-row__header">
                G.W.
              </div>
              <div class="mark-detail-row__header">
                M3
              </div>
            </div>

            <!-- Row 2: FCL CONTAINER (input) | values (chips) | M3 (input) -->
            <div class="mark-detail-row">
              <div class="mark-detail-row__pkg">
                <span class="mark-detail-row__fcl-label">FCL CONTAINER :</span>
                <VTextField
                  :model-value="formData.shippingMark?.fclContainer"
                  :readonly="isReadonly"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="mark-detail-row__fcl-input"
                  @update:model-value="(v) => updateMark('fclContainer', v)"
                />
              </div>
              <div class="mark-detail-row__val">
                <span class="chip chip--yellow">{{ fmtNum(formData.shippingMark?.netWeight) }}</span>
              </div>
              <div class="mark-detail-row__val">
                <span class="chip chip--yellow">{{ fmtNum(formData.shippingMark?.grossWeight) }}</span>
              </div>
              <div class="mark-detail-row__val">
                <VTextField
                  :model-value="formData.shippingMark?.cbm"
                  :readonly="isReadonly"
                  type="number"
                  variant="outlined"
                  density="compact"
                  hide-details
                  @update:model-value="(v) => updateMark('cbm', Number(v))"
                />
              </div>
            </div>

            <!-- Product description (chip) -->
            <div class="mark-line">
              <span class="chip chip--yellow">{{ formData.shippingMark?.productDescription }}</span>
            </div>

            <!-- Extra field (dash or text, INPUT) -->
            <div class="mark-line">
              <VTextField
                :model-value="formData.shippingMark?.extraNote || '-'"
                :readonly="isReadonly"
                variant="outlined"
                density="compact"
                hide-details
                class="mark-extra-input"
                @update:model-value="(v) => updateMark('extraNote', v)"
              />
            </div>

            <!-- HS CODE (dropdown) -->
            <div class="mark-hs-row">
              <span class="mark-hs-row__label">HS CODE :</span>
              <VSelect
                :model-value="formData.shippingMark?.hsCode"
                :readonly="isReadonly"
                :items="HS_CODES"
                variant="outlined"
                density="compact"
                hide-details
                class="mark-hs-row__select"
                @update:model-value="(v) => updateMark('hsCode', v)"
              />
            </div>

            <!-- Country of Origin (text) -->
            <div class="mark-info">
              COUNTRY OF ORIGIN : {{ formData.shippingMark?.countryOfOrigin || 'THAILAND' }}
            </div>

            <!-- Pallet note (text) -->
            <div class="mark-info">
              {{ formData.shippingMark?.palletNote }}
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================ -->
      <!-- CONTAINER & SEAL NO.                               -->
      <!-- ================================================ -->
      <div class="section">
        <div class="seal-label">
          CONTAINER & SEAL NO.:
        </div>
        <div class="seal-grid">
          <div class="seal-cell">
            <span class="seal-cell__label">MARK :</span>
            <VTextField
              :model-value="formData.containerSealNo?.mark"
              :readonly="isReadonly"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="(v) => updateSeal('mark', v)"
            />
          </div>
          <div class="seal-cell">
            <VTextField
              :model-value="formData.containerSealNo?.freightTerms"
              :readonly="isReadonly"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="(v) => updateSeal('freightTerms', v)"
            />
          </div>
          <div class="seal-cell">
            <VTextField
              :model-value="formData.containerSealNo?.blType"
              :readonly="isReadonly"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="(v) => updateSeal('blType', v)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Action Bar -->
    <TabActionBar
      :tab-key="TabKey.SHIPPING_PARTICULAR"
      :is-loading="isLoading"
      :is-dirty="isDirty"
      :notes="notes"
      @print="handlePrint"
      @save-draft="saveDraft"
      @confirm="confirm"
      @add-note="handleAddNote"
      @delete-note="handleDeleteNote"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { TabKey } from '../../types/shipDocument'
import { useTabForm } from '../../composables/useTabForm'
import { usePrint } from '../../composables/usePrint'
import { useShipDocumentStore } from '../../stores/shipDocumentStore'
import { tabApiMap } from '../../services/shipDocumentApi'
import TabActionBar from '../shared/TabActionBar.vue'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CONTAINER_TYPES = ['CY', 'CFS', 'FCL', 'LCL']
const HS_CODES = ['3906.90.20', '3906.90.90']

// ---------------------------------------------------------------------------
// Composables
// ---------------------------------------------------------------------------

const store = useShipDocumentStore()

const {
  formData,
  isDirty,
  isLoading,
  isReadonly,
  updateField,
  saveDraft,
  confirm,
} = useTabForm(TabKey.SHIPPING_PARTICULAR, {
  onSaveDraft: data => tabApiMap[TabKey.SHIPPING_PARTICULAR].save(store.documentId, data),
  onConfirm: data => tabApiMap[TabKey.SHIPPING_PARTICULAR].confirm(store.documentId, data),
})

const { print: handlePrint } = usePrint(TabKey.SHIPPING_PARTICULAR)

// ---------------------------------------------------------------------------
// Notes
// ---------------------------------------------------------------------------

const notes = ref([])

function handleAddNote(text) {
  notes.value.push({ id: Date.now(), text, date: new Date().toLocaleDateString('en-GB') })
}

function handleDeleteNote(noteId) {
  notes.value = notes.value.filter(n => n.id !== noteId)
}

// ---------------------------------------------------------------------------
// Nested object update helpers
// ---------------------------------------------------------------------------

function updateMark(field, value) {
  updateField('shippingMark', { ...formData.value.shippingMark, [field]: value })
}

function updateSeal(field, value) {
  updateField('containerSealNo', { ...formData.value.containerSealNo, [field]: value })
}

// ---------------------------------------------------------------------------
// Format
// ---------------------------------------------------------------------------

function fmtNum(v) {
  return v != null
    ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00'
}
</script>

<style scoped>
/**
 * Stylelint: stylelint-config-standard + stylelint-order (grouped)
 * Order: Position → Box Model → Typography → Visual
 */

/* =================================================================
   Layout
   ================================================================= */

.tab-page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: #f5f5f5;
}

.tab-content {
  flex: 1;
  padding: 0;
}

/* =================================================================
   Section
   ================================================================= */

.section {
  padding: 24px 32px;
  border-bottom: 1px solid #e8e8e8;
  background: #fff;
}

.section-title {
  margin-bottom: 0;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-align: center;
  color: #222;
}

/* =================================================================
   Booking row
   ================================================================= */

.book-grid {
  display: flex;
  align-items: center;
  gap: 16px;
}

.book-cell {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 10px;
}

.book-cell--date {
  flex: 0 0 auto;
}

.book-cell__label {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  color: #333;
}

.book-cell__text {
  font-size: 14px;
  color: #333;
}

/* =================================================================
   Shipper grid (2 columns)
   ================================================================= */

.shipper-grid {
  display: flex;
  gap: 40px;
}

.shipper-grid__left {
  flex: 1;
}

.shipper-grid__right {
  flex: 0 0 300px;
  padding-top: 8px;
  font-size: 14px;
  line-height: 1.7;
  color: #333;
}

/* =================================================================
   Party text blocks (shared)
   ================================================================= */

.party-label {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #333;
}

.party-text {
  font-size: 13px;
  line-height: 1.8;
  color: #333;
}

.party-text--indent {
  padding-left: 20px;
}

/* =================================================================
   Notify Party (bordered box)
   ================================================================= */

.notify-box {
  max-width: 420px;
  padding: 16px 20px;
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.8;
  color: #333;
}

/* =================================================================
   Info lines (PORT OF RECEIPT etc.)
   ================================================================= */

.info-line {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-height: 32px;
  margin-bottom: 4px;
  font-size: 14px;
  color: #333;
}

.info-line:last-child {
  margin-bottom: 0;
}

.info-line__label {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  color: #333;
}

.info-line__extra {
  margin-left: 60px;
  font-weight: 700;
}

/* =================================================================
   Shipping rows (FEEDER/VESSEL + ETD/ETA)
   ================================================================= */

.ship-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.ship-row--spaced {
  margin-top: 10px;
}

.ship-row__main {
  display: flex;
  flex: 1;
  align-items: baseline;
  gap: 8px;
  font-size: 14px;
  color: #333;
}

.ship-row__label {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  color: #333;
}

.ship-row__mid {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ship-row__select {
  width: 100px;
}

.ship-row__end {
  flex-shrink: 0;
}

/* =================================================================
   Shipping Mark (complex grid)
   ================================================================= */

.mark-label {
  margin-bottom: 16px;
  font-size: 13px;
  font-weight: 700;
  color: #333;
}

.mark-grid {
  display: flex;
  gap: 32px;
}

.mark-grid__left {
  flex: 0 0 160px;
  font-size: 13px;
  line-height: 1.8;
  color: #333;
}

.mark-grid__right {
  flex: 1;
  min-width: 0;
}

/* Mark detail rows */

.mark-detail-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.mark-detail-row__pkg {
  display: flex;
  flex: 0 0 280px;
  align-items: center;
  gap: 8px;
}

.mark-detail-row__header {
  flex: 0 0 100px;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  color: #555;
}

.mark-detail-row__val {
  flex: 0 0 100px;
  text-align: center;
}

.mark-detail-row__fcl-label {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  color: #555;
}

.mark-detail-row__fcl-input {
  width: 100px;
}

/* Mark misc lines */

.mark-line {
  margin-bottom: 10px;
}

.mark-extra-input {
  max-width: 280px;
}

.mark-hs-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.mark-hs-row__label {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  color: #555;
}

.mark-hs-row__select {
  width: 160px;
}

.mark-info {
  margin-bottom: 6px;
  font-size: 13px;
  color: #333;
}

.mark-text {
  line-height: 1.8;
}

/* =================================================================
   Container & Seal No.
   ================================================================= */

.seal-label {
  margin-bottom: 16px;
  font-size: 13px;
  font-weight: 700;
  color: #333;
}

.seal-grid {
  display: flex;
  gap: 16px;
}

.seal-cell {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 10px;
}

.seal-cell__label {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  color: #333;
}

/* =================================================================
   Chip (yellow highlight)
   ================================================================= */

.chip {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 3px;
  font-size: 14px;
  line-height: 1.4;
  color: #333;
}

.chip--yellow {
  border: 1px solid #f5deb3;
  background: #fff8e1;
}

/* =================================================================
   Responsive — Tablet (≤ 960px)
   ================================================================= */

@media (max-width: 960px) {
  .section {
    padding: 16px 20px;
  }

  .book-grid {
    flex-wrap: wrap;
  }

  .book-cell {
    flex: 1 1 45%;
  }

  .shipper-grid {
    flex-direction: column;
    gap: 16px;
  }

  .shipper-grid__right {
    flex: none;
  }

  .ship-row {
    flex-wrap: wrap;
    gap: 10px;
  }

  .mark-grid {
    flex-direction: column;
    gap: 16px;
  }

  .mark-grid__left {
    flex: none;
  }

  .mark-detail-row {
    flex-wrap: wrap;
  }

  .seal-grid {
    flex-direction: column;
  }
}

/* =================================================================
   Responsive — Mobile (≤ 600px)
   ================================================================= */

@media (max-width: 600px) {
  .book-cell {
    flex: 1 1 100%;
  }

  .info-line {
    flex-direction: column;
    gap: 2px;
  }

  .mark-detail-row__pkg {
    flex: 1 1 100%;
  }
}
</style>
