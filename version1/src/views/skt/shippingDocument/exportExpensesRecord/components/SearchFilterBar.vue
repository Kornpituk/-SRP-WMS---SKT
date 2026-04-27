<template>
  <!--
    ============================================================
    SearchFilterBar.vue
    Collapsible filter panel.
    ETD = single field, click to open a date-range menu (From→To).
    Displays as "DD/MM/YYYY - DD/MM/YYYY" when both dates selected.
    ============================================================ 
  -->
  <VCard
    class="filter-card mb-4"
    elevation="1"
    rounded="lg"
  >
    <!-- ── Header ───────────────────────────────────────────────── -->
    <VCardTitle
      class="filter-header"
      @click="toggleExpand"
    >
      <div class="header-left">
        <VIcon
          size="18"
          color="#1976d2"
          class="m-2"
        >
          ri-close-fill
        </VIcon>
      </div>
      <span class="header-title">Export Expenses Record</span>
      <VBtn
        :icon="isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        variant="text"
        size="small"
        density="compact"
        color="grey-darken-1"
        aria-label="Toggle filters"
        @click.stop="toggleExpand"
      />
    </VCardTitle>

    <VDivider v-if="isExpanded" />

    <!-- ── Collapsible Body ──────────────────────────────────────── -->
    <VExpandTransition>
      <div v-show="isExpanded">
        <VCardText class="filter-body">
          <!-- Row 1: Sale Order No. | PO No. | Invoice In SAP -->
          <VRow dense>
            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VTextField
                v-model="localFilters.salesOrderNo"
                label="Sale Order No."
                placeholder="e.g. TL1100001"
                density="compact"
                variant="outlined"
                clearable
                hide-details="auto"
                @keyup.enter="emit('search')"
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VTextField
                v-model="localFilters.poNo"
                label="PO No."
                placeholder="e.g. PO4000000001TQ"
                density="compact"
                variant="outlined"
                clearable
                hide-details="auto"
                @keyup.enter="emit('search')"
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VTextField
                v-model="localFilters.invoiceInSap"
                label="Invoice in SAP"
                placeholder="e.g. 9200012345"
                density="compact"
                variant="outlined"
                clearable
                hide-details="auto"
                @keyup.enter="emit('search')"
              />
            </VCol>
          </VRow>

          <!-- Row 2: Invoice | Payer Name | End User -->
          <VRow dense>
            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VTextField
                v-model="localFilters.invoice"
                label="Invoice"
                placeholder="e.g. INV1000001"
                density="compact"
                variant="outlined"
                clearable
                hide-details="auto"
                @keyup.enter="emit('search')"
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VTextField
                v-model="localFilters.payerName"
                label="Payer Name"
                placeholder="Search payer..."
                density="compact"
                variant="outlined"
                clearable
                hide-details="auto"
                @keyup.enter="emit('search')"
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VTextField
                v-model="localFilters.endUser"
                label="End User"
                placeholder="Search end user..."
                density="compact"
                variant="outlined"
                clearable
                hide-details="auto"
                @keyup.enter="emit('search')"
              />
            </VCol>
          </VRow>

          <!-- Row 3: ETD range (single field) | Sale Order No. | Invoice | Item | Actions -->
          <VRow
            dense
            class="mt-2"
          >
            <!-- Item -->
            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VTextField
                v-model="localFilters.item"
                label="Item"
                placeholder="Search item..."
                density="compact"
                variant="outlined"
                clearable
                hide-details="auto"
                @keyup.enter="emit('search')"
              />
            </VCol>

            <!-- ── ETD Range — single text field + popover menu ─── -->
            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <AppDateTimePicker
                v-model="etdRangeInput"
                label="ETD"
                placeholder="DD/MM/YYYY - DD/MM/YYYY"
                :config="{ mode: 'range' }"
                prepend-inner-icon="mdi-calendar-range"
                density="compact"
                clearable
                style="font-size: 12px;"
                @click:clear="clearEtd"
              />
            </VCol>
            
            <!-- Action Buttons -->
            <VCol
              cols="12"
              md="4"
              class="d-flex flex-column flex-sm-row align-stretch justify-end gap-2"
            >
              <VBtn
                color="primary"
                variant="flat"
                prepend-icon="mdi-magnify"
                :loading="loading"
                class="flex-grow-1"
                @click="emit('search')"
              >
                Search
              </VBtn>

              <VBtn
                color="red"
                variant="flat"
                prepend-icon="mdi-refresh"
                :disabled="loading"
                class="flex-grow-1 reset-btn"
                @click="handleReset"
              >
                Reset
              </VBtn>

              

              <VBtn
                color="warning"
                variant="flat"
                prepend-icon="mdi-export"
                class="flex-grow-1 export-btn"
                @click="emit('export')"
              >
                Export
              </VBtn>
            </VCol>
          </VRow>
        </VCardText>
      </div>
    </VExpandTransition>
  </VCard>
</template>

<script setup>
import { ref, watch } from 'vue'

// ─────────────────────────────────────────────────────────────────────────────
// Props & Emits
// ─────────────────────────────────────────────────────────────────────────────
const props = defineProps({
  filters: { type: Object, required: true },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:filters', 'search', 'reset', 'export'])

// ─────────────────────────────────────────────────────────────────────────────
// Panel expand state
// ─────────────────────────────────────────────────────────────────────────────
const isExpanded = ref(true)

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

// ─────────────────────────────────────────────────────────────────────────────
// Local filter state
// ─────────────────────────────────────────────────────────────────────────────
const localFilters = ref({ ...props.filters })

// Sync outward
watch(localFilters, val => emit('update:filters', { ...val }), { deep: true })

// Sync inward (e.g. after parent calls reset)
watch(() => props.filters, val => { localFilters.value = { ...val } }, { deep: true })

// ─────────────────────────────────────────────────────────────────────────────
// ETD Date Range — single field logic
// ─────────────────────────────────────────────────────────────────────────────

const etdRangeInput = ref('')

/**
 * The Date array bound to v-date-picker (multiple="range").
 * Vuetify fills in all intermediate dates; we only care about
 * index 0 (start) and last index (end) when the user confirms.
 */
const etdRangeModel = ref([])

/**
 * Convert a Date object → "YYYY-MM-DD" string for the filter model.
 */
function toIso(date) {
  if (!date) return null
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date.trim())) return date.trim()

  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return null

  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  
  return `${y}-${m}-${day}`
}

/**
 * User clicked OK — extract start/end from the range array and
 * write into localFilters, then close the menu.
 */
function syncEtdRange(value) {
  const parts = Array.isArray(value)
    ? value
    : String(value || '').split(/\s+(?:to|-)\s+/i)

  const sorted = parts
    .map(part => toIso(part))
    .filter(Boolean)
    .sort()

  localFilters.value = {
    ...localFilters.value,
    etdFrom: sorted[0] ?? null,
    etdTo: sorted[sorted.length - 1] ?? null,
  }
}

/**
 * Clear button — wipe the range selection and filter values.
 */
function clearEtd() {
  etdRangeModel.value = []
  etdRangeInput.value = ''
  localFilters.value = {
    ...localFilters.value,
    etdFrom: null,
    etdTo: null,
  }
}

watch(etdRangeInput, syncEtdRange)

// If parent resets etd externally, clear the picker model too
watch(
  () => [props.filters.etdFrom, props.filters.etdTo],
  ([from, to]) => {
    if (!from && !to) {
      etdRangeModel.value = []
      etdRangeInput.value = ''
    }
  },
)

// ─────────────────────────────────────────────────────────────────────────────
// Reset
// ─────────────────────────────────────────────────────────────────────────────
function handleReset() {
  etdRangeModel.value = []
  etdRangeInput.value = ''
  emit('reset')
}
</script>

<style src="./SearchFilterBar.css">

</style>
