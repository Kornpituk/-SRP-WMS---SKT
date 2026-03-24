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
function formatNumber(value) {
  if (value === null || value === undefined || value === '') return '-'
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/** ISO → DD/MM/YYYY */
function formatDate(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleDateString('en-GB')
}

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
const headers = [
  // ── Identity ────────────────────────────────────────────────────────────
  {
    title: 'No.',
    key: 'no',
    sortable: false,
    width: '56px',
    align: 'center',

    // ใช้ slot แทน (no-cell class)
  },
  {
    title: 'Sale Order No.',
    key: 'salesOrderNo',
    sortable: true,
    minWidth: '145px',
  },
  {
    title: 'PO No.',
    key: 'poNo',
    sortable: true,
    minWidth: '125px',
  },
  {
    title: 'Invoice',
    key: 'invoice',
    sortable: false,
    minWidth: '120px',
  },
  {
    title: 'Invoice in SAP',
    key: 'invoiceInSap',
    sortable: false,
    minWidth: '135px',
  },
  {
    title: 'Payer Name',
    key: 'payerName',
    sortable: true,
    minWidth: '155px',
  },
  {
    title: 'End User',
    key: 'endUser',
    sortable: false,
    minWidth: '155px',
  },
  {
    title: 'Item',
    key: 'item',
    sortable: false,
    minWidth: '200px',
  },
  {
    title: 'ETD',
    key: 'etd',
    sortable: true,
    minWidth: '105px',

    // ใช้ slot แทน (formatDate)
  },
  {
    title: 'Term',
    key: 'term',
    sortable: false,
    width: '80px',
    align: 'center',
  },
  {
    title: 'Sale',
    key: 'sale',
    sortable: false,
    width: '80px',
    align: 'center',
  },

  // ── Expense columns ──────────────────────────────────────────────────────
  // ✅ value() function → Vuetify render cell text โดยตรง ไม่ต้องใช้ slot
  {
    title: 'Forwarder',
    key: 'forwarder',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.forwarder),
  },
  {
    title: 'Baht',
    key: 'bahtForwarder',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.bahtForwarder),
  },
  {
    title: 'Customs OT Fee',
    key: 'customsOtFee',
    sortable: false,
    width: '130px',
    align: 'end',
    value: item => formatNumber(item.customsOtFee),
  },
  {
    title: 'Courier',
    key: 'courier',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.courier),
  },
  {
    title: 'Baht',
    key: 'bahtCourier',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.bahtCourier),
  },
  {
    title: 'Trucking',
    key: 'trucking',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.trucking),
  },
  {
    title: 'Baht',
    key: 'bahtTrucking',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.bahtTrucking),
  },
  {
    title: 'Storage',
    key: 'storage',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.storage),
  },
  {
    title: 'Baht',
    key: 'bahtStorage',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.bahtStorage),
  },
  {
    title: 'Insurance',
    key: 'insurance',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.insurance),
  },
  {
    title: 'Baht',
    key: 'bahtInsurance',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.bahtInsurance),
  },
  {
    title: 'FTA Form',
    key: 'ftaForm',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.ftaForm),
  },
  {
    title: 'Baht',
    key: 'bahtFtaForm',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.bahtFtaForm),
  },
  {
    title: 'Shipping',
    key: 'shipping',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.shipping),
  },
  {
    title: 'Baht',
    key: 'bahtShipping',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.bahtShipping),
  },
  {
    title: 'Other',
    key: 'other',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.other),
  },
  {
    title: 'Baht',
    key: 'bahtOther',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.bahtOther),
  },

  // ── Summary ──────────────────────────────────────────────────────────────
  {
    title: 'Total Cost',
    key: 'totalCost',
    sortable: true,
    minWidth: '115px',
    align: 'end',

    // ใช้ slot แทน (bold class)
  },
  {
    title: 'Quantity',
    key: 'quantity',
    sortable: false,
    width: '90px',
    align: 'end',
  },
  {
    title: 'Cost/Unit',
    key: 'costPerUnit',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.costPerUnit),
  },
  {
    title: 'Updated By',
    key: 'updatedBy',
    sortable: false,
    minWidth: '115px',
  },
  {
    title: 'Updated Date',
    key: 'updatedDate',
    sortable: false,
    minWidth: '115px',

    // ใช้ slot แทน (formatDate)
  },
]

const itemsPerPageOptions = [
  { value: 10,  title: '10' },
  { value: 25,  title: '25' },
  { value: 50,  title: '50' },
  { value: 100, title: '100' },
]
</script>

<style src="./ExpensesDataTable.css" scoped></style>
