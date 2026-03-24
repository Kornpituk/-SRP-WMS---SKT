<!--
  SelectShippingModeDialog.vue — Vue 3 + Vuetify 3 + Composition API
  Stylelint: stylelint-config-standard + stylelint-order

  Figma: "Select Shipping Mode" dialog
  - Title: "Select Shipping Mode"
  - Message: "Please select a shipping mode to create the shipping document."
  - Table-like radio list: Ocean, Air, Truck, Courier
  - Cancel (red outline) | Confirm (green, disabled until selected)

  Courier = only 2 forms (Invoice + Packing List)
  Others = all 5 tabs
-->
<template>
  <VDialog
    :model-value="modelValue"
    max-width="560"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <VCard class="dialog-card">
      <!-- Header -->
      <div class="dialog-header">
        <h3 class="dialog-title">
          Select Shipping Mode
        </h3>
        <p class="dialog-message">
          Please select a shipping mode to create the shipping document.
        </p>
      </div>

      <!-- Radio table -->
      <div class="dialog-body">
        <div class="mode-table">
          <!-- Table header -->
          <div class="mode-table__head">
            <div class="mode-table__radio-col" />
            <div class="mode-table__label-col">
              Shipping Mode
            </div>
          </div>

          <!-- Radio rows -->
          <div
            v-for="mode in SHIPPING_MODES"
            :key="mode.value"
            class="mode-table__row"
            :class="{ 'mode-table__row--selected': selectedMode === mode.value }"
            @click="selectedMode = mode.value"
          >
            <div class="mode-table__radio-col">
              <VRadioGroup
                :model-value="selectedMode"
                hide-details
                class="mode-radio"
                @update:model-value="selectedMode = $event"
              >
                <VRadio
                  :value="mode.value"
                  density="compact"
                />
              </VRadioGroup>
            </div>
            <div class="mode-table__label-col">
              {{ mode.label }}
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="dialog-actions">
        <VBtn
          variant="outlined"
          color="error"
          rounded="lg"
          class="text-none dialog-btn"
          min-width="140"
          @click="handleCancel"
        >
          <VIcon start>
            mdi-close
          </VIcon>
          Cancel
        </VBtn>

        <VBtn
          variant="elevated"
          color="green"
          rounded="lg"
          class="text-none dialog-btn"
          min-width="140"
          :disabled="!selectedMode"
          @click="handleConfirm"
        >
          <VIcon start>
            mdi-check
          </VIcon>
          Confirm
        </VBtn>
      </div>
    </VCard>
  </VDialog>
</template>

<script setup>
import { ref, watch } from 'vue'

// ---------------------------------------------------------------------------
// Props / Emits
// ---------------------------------------------------------------------------

const props = defineProps({
  modelValue: { type: Boolean, default: false },
})

const emit = defineEmits([
  'update:modelValue',
  'confirm',
  'cancel',
])

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Shipping Modes
 * - Ocean, Air, Truck = all 5 tabs
 * - Courier = only 2 tabs (Packing List + Commercial Invoice)
 */
const SHIPPING_MODES = [
  { value: 'ocean', label: 'Ocean' },
  { value: 'air', label: 'Air' },
  { value: 'truck', label: 'Truck' },
  { value: 'courier', label: 'Courier' },
]

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const selectedMode = ref(null)

// Reset selection when dialog opens
watch(() => props.modelValue, open => {
  if (open) {
    selectedMode.value = null
  }
})

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

function handleCancel() {
  selectedMode.value = null
  emit('update:modelValue', false)
  emit('cancel')
}

function handleConfirm() {
  if (!selectedMode.value) {
    return
  }

  emit('confirm', selectedMode.value)
  emit('update:modelValue', false)
}
</script>

<style scoped>
/**
 * Stylelint: stylelint-config-standard + stylelint-order (grouped)
 */

/* =================================================================
   Dialog card
   ================================================================= */

.dialog-card {
  border-radius: 12px !important;
  overflow: hidden;
}

/* =================================================================
   Header
   ================================================================= */

.dialog-header {
  padding: 24px 24px 0;
}

.dialog-title {
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #222;
}

.dialog-message {
  margin-bottom: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #666;
}

/* =================================================================
   Body — Radio table
   ================================================================= */

.dialog-body {
  padding: 20px 24px;
}

.mode-table {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.mode-table__head {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
}

.mode-table__head .mode-table__label-col {
  font-size: 13px;
  font-weight: 600;
  color: #555;
}

.mode-table__row {
  display: flex;
  align-items: center;
  padding: 6px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.15s;
}

.mode-table__row:last-child {
  border-bottom: none;
}

.mode-table__row:hover {
  background: #f8f8f8;
}

.mode-table__row--selected {
  background: #f0faf0;
}

.mode-table__radio-col {
  flex: 0 0 48px;
}

.mode-table__label-col {
  flex: 1;
  font-size: 14px;
  color: #333;
}

/* Hide radio-group extra spacing */

.mode-radio {
  margin: 0;
  padding: 0;
}

.mode-radio :deep(.v-selection-control-group) {
  gap: 0;
}

.mode-radio :deep(.v-input__details) {
  display: none;
}

/* =================================================================
   Actions
   ================================================================= */

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 0 24px 24px;
}

.dialog-btn {
  min-height: 42px;
}

/* =================================================================
   Responsive
   ================================================================= */

@media (max-width: 600px) {
  .dialog-actions {
    flex-direction: column;
    gap: 8px;
  }

  .dialog-btn {
    width: 100%;
  }
}
</style>
