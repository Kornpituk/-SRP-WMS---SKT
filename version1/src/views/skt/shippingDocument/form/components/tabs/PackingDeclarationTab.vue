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

        <!-- Body row -->
        <div class="tbl-body">
          <!-- Description — plain text -->
          <div class="tbl-c tbl-c--desc">
            {{ formData.descriptionOfGoods }}
          </div>

          <!-- Package — DRUM chip (display) + Dimensions (INPUT) -->
          <div class="tbl-c tbl-c--pkg">
            <span class="chip chip--yellow pkg-chip">
              {{ formData.packageType }}
            </span>
            <VTextField
              v-if="!isReadonly"
              :model-value="formData.packageDimensions"
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
              {{ fmtNum(formData.netWeight) }} {{ formData.netWeightUnit }}
              <br>
              (TOTAL = {{ formData.totalDrums }} DRUMS)
            </span>
          </div>

          <!-- Gross Weight — yellow chip (display) -->
          <div class="tbl-c tbl-c--gross text-right">
            <span class="chip chip--yellow">
              {{ fmtNum(formData.grossWeight) }} {{ formData.grossWeightUnit }}
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

        <!-- NAME OF VESSEL — yellow chip (display) -->
        <div class="ref-row">
          <span class="ref-row__label">NAME OF VESSEL :</span>
          <span class="chip chip--yellow">
            {{ formData.vesselName }}
          </span>
        </div>

        <!-- DATE OF SHIPMENT — yellow chip (display) -->
        <div class="ref-row">
          <span class="ref-row__label">DATE OF SHIPMENT :</span>
          <span class="chip chip--yellow">
            {{ formData.dateOfShipment }}
          </span>
        </div>

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
      </div>
    </div>

    <!-- Action Bar -->
    <TabActionBar
      :tab-key="TabKey.PACKING_DECLARATION"
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

const { print: handlePrint } = usePrint(TabKey.PACKING_DECLARATION)

// ---------------------------------------------------------------------------
// Notes (per-tab)
// ---------------------------------------------------------------------------

const notes = ref([])

function handleAddNote(text) {
  notes.value.push({
    id: Date.now(),
    text,
    date: new Date().toLocaleDateString('en-GB'),
  })
}

function handleDeleteNote(noteId) {
  notes.value = notes.value.filter(n => n.id !== noteId)
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmtNum(v) {
  return v != null
    ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00'
}
</script>

<style src="./css/PackingDeclarationTab.css">

</style>
