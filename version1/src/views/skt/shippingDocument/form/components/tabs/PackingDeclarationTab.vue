<!--
  PackingDeclarationTab.vue — Vue 3 + Vuetify 3 + Composition API
  Stylelint: stylelint-config-standard + stylelint-order

  Figma analysis (Shipping_Document_29_.png):

  Layout top → bottom:
  ┌─────────────────────────────────────────────────────┐
  │                                        08/12/2025   │  ← date text right
  │ REF NO. : [13/35 INPUT]                             │  ← left, INPUT
  │ TO : WHOM IT MAY CONCERN,                           │  ← left text
  │            PACKING DECLARATION                      │  ← centered bold
  │       (THERE IS NO WOOD IN THE CONTAINER)           │  ← centered text
  ├─────────────────────────────────────────────────────┤
  │ DESC OF GOODS    │ PACKAGE │ NET WEIGHT │ GROSS WT  │
  ├──────────────────┼─────────┼────────────┼───────────┤
  │ SN DISPERSANT    │[DRUM]yel│ 64,000 KGS │70,400 KGS │  ← DRUM = yellow chip
  │   (text)         │[dimens] │ (320 DRUMS)│  (chip)   │  ← dimensions = INPUT
  │                  │ INPUT   │  (chip)    │           │
  ├─────────────────────────────────────────────────────┤
  │ INVOICE NO :     [1100081950]  yellow chip          │
  │ NAME OF VESSEL : [KMTC TOKYO]  yellow chip          │
  │ DATE OF SHIPMENT:[02/09/2025]  yellow chip          │
  │ B/L NO. :        [CKCOLCH...]  INPUT (no yellow)    │
  └─────────────────────────────────────────────────────┘

  Only INPUTS: REF NO, Package Dimensions, B/L NO
  Yellow chips (display): DRUM, Net Weight, Gross Weight, Invoice, Vessel, Date of Shipment
  Plain text (display): everything else
-->
<template>
  <div class="tab-page">
    <div class="tab-content">
      <!-- ================================================ -->
      <!-- Header: Date (right) + REF NO (left) + TO + Title -->
      <!-- ================================================ -->
      <div class="section">
        <!-- Date — right aligned plain text -->
        <div class="header-date">
          {{ formData.date }}
        </div>

        <!-- REF NO — left aligned, INPUT -->
        <div class="header-ref">
          <span class="header-ref__label">REF NO. :</span>
          <VTextField
            v-if="!isReadonly"
            :model-value="formData.refNo"
            variant="outlined"
            density="compact"
            hide-details
            class="header-ref__input"
            @update:model-value="(v) => updateField('refNo', v)"
          />
          <span v-else>{{ formData.refNo }}</span>
        </div>

        <!-- TO -->
        <p class="header-to">
          TO : WHOM IT MAY CONCERN,
        </p>

        <!-- Title -->
        <h2 class="decl-title">
          PACKING DECLARATION
        </h2>
        <p class="decl-subtitle">
          (THERE IS NO WOOD IN THE CONTAINER)
        </p>
      </div>

      <!-- ================================================ -->
      <!-- Table: DESC | PACKAGE | NET WEIGHT | GROSS WEIGHT -->
      <!-- ================================================ -->
      <div class="section">
        <!-- Header -->
        <div class="tbl-head">
          <div class="tbl-c tbl-c--desc">
            DESCRIPTION OF GOODS OR ITEM NO.
          </div>
          <div class="tbl-c tbl-c--pkg">
            PACKAGE
          </div>
          <div class="tbl-c tbl-c--net text-right">
            NET WEIGHT (KGS)
          </div>
          <div class="tbl-c tbl-c--gross text-right">
            GROSS WEIGHT (KGS)
          </div>
        </div>

        <!-- Body rows -->
        <div
          v-for="(item, idx) in declarationItems"
          :key="item.id ?? idx"
          class="tbl-body"
        >
          <!-- Description — plain text -->
          <div class="tbl-c tbl-c--desc">
            {{ item.descriptionOfGoods || formData.descriptionOfGoods }}
          </div>

          <!-- Package — DRUM chip (display) + Dimensions (INPUT) -->
          <div class="tbl-c tbl-c--pkg">
            <span class="chip chip--yellow pkg-chip">
              {{ item.unitType || formData.packageType }}
            </span>
            <VTextField
              v-if="!isReadonly"
              :model-value="item.packageDimensions || formData.packageDimensions"
              variant="outlined"
              density="compact"
              hide-details
              placeholder="(517MMx571×887MM)"
              class="pkg-dim-input"
              @update:model-value="(v) => updateField('packageDimensions', v)"
            />
            <span v-else>{{ formData.packageDimensions }}</span>
          </div>

          <!-- Net Weight — yellow chip (display) -->
          <div class="tbl-c tbl-c--net text-right">
            <span class="chip chip--yellow">
              {{ fmtNum(item.netWeight || formData.netWeight) }} {{ formData.netWeightUnit }}
              <br>
              (TOTAL = {{ item.quantity || formData.totalDrums }} {{ pluralUnit(item.unitType || formData.packageType, item.quantity || formData.totalDrums) }})
            </span>
          </div>

          <!-- Gross Weight — yellow chip (display) -->
          <div class="tbl-c tbl-c--gross text-right">
            <span class="chip chip--yellow">
              {{ fmtNum(item.grossWeight || formData.grossWeight) }} {{ formData.grossWeightUnit }}
            </span>
          </div>
        </div>
      </div>

      <!-- ================================================ -->
      <!-- Shipment Reference                                -->
      <!-- ================================================ -->
      <div class="section">
        <!-- INVOICE NO — yellow chip (display) -->
        <div class="ref-row">
          <span class="ref-row__label">INVOICE NO :</span>
          <span class="chip chip--yellow">
            {{ formData.invoiceNo }}
          </span>
        </div>

        <template v-if="!isAirMode">
          <!-- NAME OF VESSEL — yellow chip (display) -->
          <div class="ref-row">
            <span class="ref-row__label">NAME OF VESSEL :</span>
            <span class="chip chip--yellow">
              {{ formData.vesselName }}
            </span>
          </div>
        </template>

        <!-- DATE OF SHIPMENT — yellow chip (display) -->
        <div class="ref-row">
          <span class="ref-row__label">DATE OF SHIPMENT :</span>
          <span class="chip chip--yellow">
            {{ formData.dateOfShipment }}
          </span>
        </div>

        <template v-if="isAirMode">
          <div class="ref-row">
            <span class="ref-row__label">MAWB NO. :</span>
            <div class="ref-row__input">
              <VTextField
                v-if="!isReadonly"
                :model-value="formData.mawbNo"
                variant="outlined"
                density="compact"
                hide-details
                class="ref-row__input--highlight"
                @update:model-value="(v) => updateField('mawbNo', v)"
              />
              <span
                v-else
                class="chip chip--yellow"
              >{{ formData.mawbNo }}</span>
            </div>
          </div>

          <div class="ref-row">
            <span class="ref-row__label">HAWB NO. :</span>
            <div class="ref-row__input">
              <VTextField
                v-if="!isReadonly"
                :model-value="formData.hawbNo"
                variant="outlined"
                density="compact"
                hide-details
                class="ref-row__input--highlight"
                @update:model-value="(v) => updateField('hawbNo', v)"
              />
              <span
                v-else
                class="chip chip--yellow"
              >{{ formData.hawbNo }}</span>
            </div>
          </div>
        </template>

        <template v-else>
          <!-- B/L NO — INPUT (no yellow, outlined field) -->
          <div class="ref-row">
            <span class="ref-row__label">B/L NO. :</span>
            <div class="ref-row__input">
              <VTextField
                v-if="!isReadonly"
                :model-value="formData.blNo"
                variant="outlined"
                density="compact"
                hide-details
                @update:model-value="(v) => updateField('blNo', v)"
              />
              <span v-else>{{ formData.blNo }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Action Bar -->
    <TabActionBar
      :tab-key="TabKey.PACKING_DECLARATION"
      :is-loading="isLoading"
      :show-print-options="false"
      :is-dirty="isDirty"
      :notes="notes"
      :is-printing="isPrinting"
      :can-print="!isReadonly"
      :print-targets="printTargets"
      :print-config="{
        buyer: {
          hasDisplay: false,
          displayFields: PRINT_DISPLAY_FIELDS.buyer
        },
        customs: {
          hasDisplay: false,
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
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { TabKey } from '../../types/shipDocument'
import { useTabForm } from '../../composables/useTabForm'
import { usePrint } from '../../composables/usePrint'
import { useShipDocumentStore } from '../../stores/shipDocumentStore'
import { tabApiMap } from '../../services/shipDocumentApi'
import { getPackingItems } from '../../utils/packingDerived'
import TabActionBar from '../shared/TabActionBar.vue'

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
} = useTabForm(TabKey.PACKING_DECLARATION, {
  onSaveDraft: data => tabApiMap[TabKey.PACKING_DECLARATION].save(store.documentId, data),
  onConfirm: data => tabApiMap[TabKey.PACKING_DECLARATION].confirm(store.documentId, data),
})
 
const route    = useRoute()
const shippMode = computed(() => route.query.mode || 'ocean')
const isAirMode = computed(() => shippMode.value === 'air')
const packingListData = computed(() => store.tabs[TabKey.PACKING_LIST]?.data || {})

const declarationItems = computed(() => {
  const items = getPackingItems(packingListData.value).filter(item => !item.isSample)

  return items.length
    ? items
    : [{
      descriptionOfGoods: formData.value.descriptionOfGoods,
      packageType: formData.value.packageType,
      packageDimensions: formData.value.packageDimensions,
      quantity: formData.value.totalDrums,
      unitType: formData.value.packageType,
      netWeight: formData.value.netWeight,
      grossWeight: formData.value.grossWeight,
    }]
})

// ---------------------------------------------------------------------------
// Print
// ---------------------------------------------------------------------------

// ── usePrint — merge note เข้า getFormData ────────────────────────────────
const { isPrinting, print } = usePrint(
  TabKey.PACKING_DECLARATION,
  () => ({
    ...formData.value,
    packingItems: store.tabs[TabKey.PACKING_LIST]?.data?.items || [],
    note: notes.value[0]?.text ?? '',
  }),
)

const printTarget = ref('buyer')

const printTargets = [
  { label: 'Product Description', value: 'productDescription' },
  { label: 'Note', value: 'note' },
]

// ── handlePrint รับ payload จาก TabActionBar ──────────────────────────────
function handlePrint(payload) {
  // ── guard: payload อาจเป็น undefined เมื่อ showPrintOptions=false ──
  print(
    payload?.target  ?? 'buyer',
    payload?.display ?? [],
    shippMode.value,
  )
}

// ---------------------------------------------------------------------------
// Notes (per-tab)
// ---------------------------------------------------------------------------

// ── note 1 อัน ────────────────────────────────────────────────────────────
const notes = ref([])
 
function handleAddNote(text) {
  notes.value = [{ id: Date.now(), text, date: new Date().toLocaleString('en-GB') }]
}
 
function handleEditNote({ id, text }) {
  if (notes.value[0]?.id === id) notes.value[0].text = text
}
 
function handleDeleteNote(noteId) {
  notes.value = notes.value.filter(n => n.id !== noteId)
}

// ─── #7 Print Display Fields ────────────────────────────────────────────────
const PRINT_DISPLAY_FIELDS = {
  buyer: ['FOB', 'Freight', 'Insurance', 'Lot No.', 'Product Description', 'Note'],
  customs: ['lotNo'],
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmtNum(v) {
  return v != null
    ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00'
}

function pluralUnit(unit, qty) {
  const normalized = String(unit || '').trim().toUpperCase()
  if (!normalized) return ''
  if (Number(qty) === 1 || normalized.endsWith('S')) return normalized

  return `${normalized}S`
}
</script>

<style src="./css/PackingDeclarationTab.css">

</style>
