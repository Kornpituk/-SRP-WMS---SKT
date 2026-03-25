<template>
  <!--
    ============================================================
    ExpensesDataTable.vue

    ✅ FIX: ไม่ใช้ v-for + dynamic slot name (#[`item.${key}`])
    เพราะ Vue 3 ไม่ support v-for บน <template> ที่มี dynamic
    slot name ใน Vuetify component → slot ไม่ถูก register → ไม่แสดงผล

    วิธีแก้: ใช้ `value: (item) => ...` ใน header definition แทน
    Vuetify 3 จะ call ฟังก์ชันนี้เพื่อ render cell โดยตรง
    ไม่ต้องเขียน slot เลย ยกเว้น Status (VChip) และ ETD / Updated Date
    ที่ต้องการ HTML element พิเศษ
    ============================================================
  -->
  <VCard
    elevation="1"
    rounded="lg"
    class="table-card"
  >
    <VDataTableServer
      v-model:page="currentPage"
      v-model:items-per-page="currentItemsPerPage"
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :loading="loading"
      :items-per-page-options="itemsPerPageOptions"
      density="compact"
      hover
      fixed-header
      height="520"
      class="expenses-table"
      @update:options="emit('update:options', $event)"
    >
      <!-- ── Loading Skeleton ──────────────────────────────────── -->
      <template #loading>
        <VSkeletonLoader type="table-row@8" />
      </template>

      <!-- ── No Data ──────────────────────────────────────────── -->
      <template #no-data>
        <div class="no-data-state">
          <VIcon
            size="48"
            color="grey-lighten-2"
          >
            mdi-file-search-outline
          </VIcon>
          <p class="no-data-text">
            No records found
          </p>
          <p class="no-data-sub">
            Try adjusting your filters and search again
          </p>
        </div>
      </template>

      <!--
        ── Explicit slots เฉพาะ column ที่ต้องการ HTML element พิเศษ ──
        column อื่นๆ ทุกตัว (currency, number) ใช้ value() ใน headers แทน
      -->

      <!-- No. -->
      <template #item.no="{ item }">
        <span class="no-cell">{{ item.raw.no }}</span>
      </template>
      <!-- ETD — format date -->
      <template #item.etd="{ item }">
        <span class="date-cell">{{ formatDate(item.raw.etd) }}</span>
      </template>

      <!-- Updated Date — format date -->
      <template #item.updatedDate="{ item }">
        <span class="date-cell">{{ formatDate(item.raw.updatedDate) }}</span>
      </template>

      <!-- Status — VChip (ต้องการ HTML component จึงใช้ slot) -->
      <template #item.status="{ item }">
        <VChip
          :color="statusColor(item.status)"
          size="x-small"
          variant="flat"
          class="status-chip"
        >
          {{ item.status }}
        </VChip>
      </template>

      <!-- Total Cost — bold (ต้องการ class พิเศษ) -->
      <template #item.totalCost="{ item }">
        <span class="currency-cell font-weight-bold">{{ formatNumber(item.totalCost) }}</span>
      </template>
    </VDataTableServer>
  </VCard>
</template>

<script setup>
import { computed } from 'vue'
import { formatNumber, formatDate } from '../utilities/formats'
import { headers, itemsPerPageOptions } from '../constants/ExportExpensesRecord'


// ─────────────────────────────────────────────────────────────────────────────
// Props & Emits
// ─────────────────────────────────────────────────────────────────────────────
const props = defineProps({
  items: { type: Array,   default: () => [] },
  totalItems: { type: Number,  default: 0 },
  loading: { type: Boolean, default: false },
  page: { type: Number,  default: 1 },
  itemsPerPage: { type: Number,  default: 10 },
})

const emit = defineEmits(['update:page', 'update:items-per-page', 'update:options'])

// ─────────────────────────────────────────────────────────────────────────────
// v-model proxies
// ─────────────────────────────────────────────────────────────────────────────
const currentPage = computed({
  get: () => props.page,
  set: val => emit('update:page', val),
})

const currentItemsPerPage = computed({
  get: () => props.itemsPerPage,
  set: val => emit('update:items-per-page', val),
})

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Number formatter — ใช้ใน header value() และใน slot */


/** Status → chip colour */
function statusColor(status) {
  const map = {
    MPL: 'success',
    CIP: 'info',
    CFR: 'warning',
    TVL: 'deep-purple',
    Pending: 'grey',
    Cancelled: 'error',
  }

  
  return map[status] ?? 'grey'
}

// ─────────────────────────────────────────────────────────────────────────────
// Column Definitions
//
// ✅ KEY PATTERN:
//    currency/number columns → ใส่ `value: item => formatNumber(item.xxx)`
//    ใน header definition โดยตรง → Vuetify render ให้เองโดยไม่ต้องใช้ slot
//
// ⚠️  "Baht" title ซ้ำกันหลาย column → ใช้ key ที่ unique เสมอ
//     convention: baht<Category> เช่น bahtForwarder, bahtCourier ...
// ─────────────────────────────────────────────────────────────────────────────
</script>

<style src="./ExpensesDataTable.css" scoped></style>
