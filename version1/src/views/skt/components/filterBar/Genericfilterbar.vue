<!--
  ============================================================
  SearchFilterBar.vue
  ============================================================
  ใช้ได้ 2 แบบ ไฟล์เดียว:

  แบบที่ 1 — ไม่ส่ง filters  →  title bar อย่างเดียว กดไม่ได้
  <SearchFilterBar />

  แบบที่ 2 — ส่ง filters  →  กด toggle expand/collapse ได้ปกติ
  <SearchFilterBar
  v-model:filters="filters"
  :loading="tableState.loading"
  @search="handleSearch"
  @reset="handleReset"
  @export="handleExport"
  />
  ============================================================
-->
<template>
  <VCard
    class="filter-card mb-4"
    elevation="1"
    rounded="lg"
  >
    <!-- ── Header ───────────────────────────────────────────────── -->
    <VCardTitle
      class="filter-header"
      :class="{ 'filter-header--clickable': hasFilters }"
      @click="hasFilters && toggleExpand()"
    >
      <div class="header-left">
        <VIcon
          size="18"
          color="#1976d2"
          class="m-2"
          @click="emit('back')"
        >
          ri-close-fill
        </VIcon>
      </div>

      <span class="header-title">{{ title }}</span>

      <!-- ปุ่ม chevron แสดงเฉพาะเมื่อมี filters -->
      <VBtn
        :icon="isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        variant="text"
        size="small"
        density="compact"
        :disabled="!hasFilters"
        color="grey-darken-1"
        aria-label="Toggle filters"
        @click.stop="toggleExpand"
      />
    </VCardTitle>

    <VDivider v-if="hasFilters && isExpanded" />

    <!-- ── Collapsible Body ──────────────────────────────────────── -->
    <VExpandTransition>
      <div
        v-if="hasFilters"
        v-show="isExpanded"
      >
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

          <!-- Row 3: Item | ETD | Actions -->
          <VRow
            dense
            class="mt-2"
          >
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

            <!-- ETD Range -->
            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VMenu
                v-model="etdMenuOpen"
                :close-on-content-click="false"
                min-width="auto"
              >
                <template #activator="{ props: menuActivator }">
                  <VTextField
                    v-bind="menuActivator"
                    :model-value="etdDisplayValue"
                    label="ETD"
                    placeholder="DD/MM/YYYY - DD/MM/YYYY"
                    density="compact"
                    variant="outlined"
                    clearable
                    readonly
                    prepend-inner-icon="mdi-calendar-range"
                    hide-details="auto"
                    class="etd-trigger-field"
                    @click:clear.stop="clearEtd"
                  />
                </template>

                <VCard
                  class="etd-menu-card"
                  elevation="4"
                >
                  <div class="calendar-nav">
                    <VBtn
                      icon="mdi-chevron-left"
                      variant="text"
                      size="small"
                      density="compact"
                      @click="prevMonth"
                    />
                    <span class="calendar-month-label">{{ displayMonthLabel }}</span>
                    <VBtn
                      icon="mdi-chevron-right"
                      variant="text"
                      size="small"
                      density="compact"
                      @click="nextMonth"
                    />
                  </div>

                  <VDatePicker
                    v-model="etdRangeModel"
                    multiple="range"
                    :view-date="calendarViewDate"
                    hide-header
                    show-adjacent-months
                    elevation="0"
                    class="etd-date-picker"
                  />

                  <VDivider />
                  <div class="etd-menu-actions d-flex align-center">
                    <span class="etd-hint-text">เลือกวันเริ่มต้นและสิ้นสุด</span>
                    <VSpacer />
                    <VBtn
                      variant="text"
                      size="small"
                      @click="clearEtd"
                    >
                      ล้าง
                    </VBtn>
                    <VBtn
                      color="primary"
                      variant="flat"
                      size="small"
                      class="ms-1"
                      @click="confirmEtd"
                    >
                      ตกลง
                    </VBtn>
                  </div>
                </VCard>
              </VMenu>
            </VCol>

            <!-- Action Buttons -->
            <VCol
              cols="12"
              md="4"
              class="d-flex flex-column flex-sm-row align-stretch justify-end gap-2"
            >
              <VBtn
                color="grey-lighten-1"
                variant="outlined"
                prepend-icon="mdi-refresh"
                :disabled="loading"
                class="flex-grow-1 reset-btn"
                @click="handleReset"
              >
                Reset
              </VBtn>

              <VBtn
                color="success"
                variant="flat"
                prepend-icon="mdi-magnify"
                :loading="loading"
                class="flex-grow-1"
                @click="emit('search')"
              >
                Search
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
import { ref, computed, watch } from 'vue'

// ─────────────────────────────────────────────────────────────────────────────
// Props & Emits
// ─────────────────────────────────────────────────────────────────────────────
const props = defineProps({
  /** ไม่ส่งมา (null) = title-only, กด toggle ไม่ได้ */
  filters: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:filters', 'search', 'reset', 'export', 'back'])

// ─────────────────────────────────────────────────────────────────────────────
// ตรวจว่ามี filters ส่งมาหรือเปล่า — ใช้ควบคุมพฤติกรรมทั้งหมด
// ─────────────────────────────────────────────────────────────────────────────
const hasFilters = computed(() => props.filters !== null)

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
const localFilters = ref({ ...(props.filters ?? {}) })

watch(localFilters, val => emit('update:filters', { ...val }), { deep: true })
watch(() => props.filters, val => { if (val) localFilters.value = { ...val } }, { deep: true })

// ─────────────────────────────────────────────────────────────────────────────
// ETD Date Range
// ─────────────────────────────────────────────────────────────────────────────
const etdMenuOpen = ref(false)
const etdRangeModel = ref([])
const calendarViewDate = ref(new Date())

const displayMonthLabel = computed(() =>
  calendarViewDate.value.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' }),
)

const etdDisplayValue = computed(() => {
  const { etdFrom, etdTo } = localFilters.value
  if (!etdFrom && !etdTo) return ''

  const fmt = iso => {
    if (!iso) return ''
    const [y, m, d] = iso.split('-')

    return `${d}/${m}/${y}`
  }

  if (etdFrom && etdTo) return `${fmt(etdFrom)} - ${fmt(etdTo)}`

  return fmt(etdFrom) || fmt(etdTo)
})

function prevMonth() {
  const d = new Date(calendarViewDate.value)

  d.setMonth(d.getMonth() - 1)
  calendarViewDate.value = d
}

function nextMonth() {
  const d = new Date(calendarViewDate.value)

  d.setMonth(d.getMonth() + 1)
  calendarViewDate.value = d
}

function toIso(date) {
  const d = new Date(date)

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function confirmEtd() {
  if (etdRangeModel.value.length >= 2) {
    const sorted = [...etdRangeModel.value].sort((a, b) => new Date(a) - new Date(b))

    localFilters.value = {
      ...localFilters.value,
      etdFrom: toIso(sorted[0]),
      etdTo: toIso(sorted[sorted.length - 1]),
    }
  }
  etdMenuOpen.value = false
}

function clearEtd() {
  etdRangeModel.value = []
  localFilters.value = { ...localFilters.value, etdFrom: null, etdTo: null }
  etdMenuOpen.value = false
}

watch(
  () => [props.filters?.etdFrom, props.filters?.etdTo],
  ([from, to]) => { if (!from && !to) etdRangeModel.value = [] },
)

// ─────────────────────────────────────────────────────────────────────────────
// Reset
// ─────────────────────────────────────────────────────────────────────────────
function handleReset() {
  etdRangeModel.value = []
  emit('reset')
}
</script>

<style src="./Genericfilterbar.css" />
