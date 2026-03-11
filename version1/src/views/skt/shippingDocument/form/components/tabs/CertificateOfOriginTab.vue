<!--
  CertificateOfOriginTab.vue — Vue 3 + Vuetify 3 + Composition API
  Stylelint: stylelint-config-standard + stylelint-order

  Figma analysis (Image 1 = SAVED):
  - Date: yellow chip top-right (display)
  - "TO : WHOM IT MAY CONCERN," left aligned (display)
  - "CERTIFICATE OF ORIGIN" centered (display)
  - "THIS IS TO CERTIFY THAT TOTAL [yellow] IN [INPUT: 2X20] ' CONTAINER"
  - "OF SN-DISPERSANT 5040" (display)
  - "MANUFACTURED BY SANYO... ARE OF THAILAND ORIGIN" (display)
  - REF. [yellow chip] (display)
  - PO NO [yellow chip] (display)

  Only INPUT: containerCount ("2X20")
  Everything else: display text (some with yellow highlight)
-->
<template>
  <div class="tab-page">
    <div class="tab-content">
      <!-- Date — top right, yellow chip -->
      <div class="date-area">
        <span class="chip chip--yellow">
          {{ formData.date }}
        </span>
      </div>

      <!-- TO -->
      <p class="cert-to">
        TO : WHOM IT MAY CONCERN,
      </p>

      <!-- Title -->
      <h2 class="cert-title">
        CERTIFICATE OF ORIGIN
      </h2>
    </div>
    
    <div class="tab-content">
      <!-- Sentence block -->
      <div class="cert-body">
        <!-- THIS IS TO CERTIFY THAT TOTAL [chip] IN [input] ' CONTAINER -->
        <div class="cert-sentence">
          <span>THIS IS TO CERTIFY THAT TOTAL</span>
          <span class="chip chip--yellow">
            {{ formData.totalWeight }}
          </span>
          <span>IN</span>
          <span class="cert-sentence__input">
            <VTextField
              :model-value="formData.containerCount"
              :readonly="isReadonly"
              variant="outlined"
              density="compact"
              hide-details
              class="cert-inline-field"
              @update:model-value="(v) => updateField('containerCount', v)"
            />
          </span>
          <span>' CONTAINER</span>
        </div>

        <!-- OF [product] -->
        <p class="cert-line">
          OF {{ formData.productName }}
        </p>

        <!-- MANUFACTURED BY ... ARE OF ... ORIGIN -->
        <p class="cert-line">
          MANUFACTURED BY {{ formData.manufacturer }} ARE OF {{ formData.originCountry }} ORIGIN
        </p>

        <!-- REF. -->
        <div class="cert-ref">
          <span class="cert-ref__label">REF.</span>
          <div class="cert-ref__values">
            <span class="chip chip--yellow">
              INVOICE NO.{{ formData.invoiceNo }} ({{ formData.contractNo }})
            </span>
            <span class="chip chip--yellow">
              PO NO : {{ formData.poNo }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Bar -->
    <TabActionBar
      :tab-key="TabKey.CERTIFICATE_OF_ORIGIN"
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

const store = useShipDocumentStore()

const {
  formData,
  isDirty,
  isLoading,
  isReadonly,
  updateField,
  saveDraft,
  confirm,
} = useTabForm(TabKey.CERTIFICATE_OF_ORIGIN, {
  onSaveDraft: data => tabApiMap[TabKey.CERTIFICATE_OF_ORIGIN].save(store.documentId, data),
  onConfirm: data => tabApiMap[TabKey.CERTIFICATE_OF_ORIGIN].confirm(store.documentId, data),
})

const { print: handlePrint } = usePrint(TabKey.CERTIFICATE_OF_ORIGIN)

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
</script>

<style src="./css/CertificateOfOriginTab.css">

</style>
