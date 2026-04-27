<template>
  <!--
    ============================================================
    ExportExpensesRecord.vue
    Root page — owns filter state + table state.

    ⚠️  FIX: v-data-table-server fires @update:options automatically on
    mount, so we must NOT also call loadData() in onMounted().
    Having both causes two concurrent fetches → race condition →
    items get cleared before the table finishes rendering.

    Solution: remove onMounted. Let handleTableOptions() be the
    single entry point that drives every data load.
    ============================================================ 
  -->
  <div class="expenses-page">
    <!-- 1. Collapsible Filter Bar -->
    <SearchFilterBar
      v-model:filters="filters"
      :loading="tableState.loading"
      @search="handleSearch"
      @reset="handleReset"
      @export="handleExport"
    />

    <!-- 2. Data Table --> 
    <ExpensesDataTable
      v-model:page="tableState.page"
      v-model:items-per-page="tableState.itemsPerPage"
      :items="tableState.items"
      :total-items="tableState.totalItems"
      :loading="tableState.loading"
      @update:options="handleTableOptions"
    />

    <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="2500"
      location="top right"
    >
      <VIcon start>
        {{ snackbar.icon }}
      </VIcon>
      {{ snackbar.message }}
    </VSnackbar>
  </div>
</template>

<script setup>
import { nextTick, reactive } from 'vue'
import SearchFilterBar from './components/SearchFilterBar.vue'
import ExpensesDataTable from './components/ExpensesDataTable.vue'
import { useExpensesService } from './composables/useExpensesService'
import { exportToExcelWithHeader, mapTableToExcel } from '@/views/skt/shippingDocument/mappers/shippingDocExcel.mapper'
import { headers } from './constants/ExportExpensesRecord'

const { fetchExpenses } = useExpensesService()
let requestId = 0

const snackbar = reactive({ show: false, message: '', color: 'primary', icon: 'mdi-information' })

function showToast(message, color = 'primary', icon = 'mdi-information') {
  Object.assign(snackbar, { show: true, message, color, icon })
}


// ── Filter form state ──────────────────────────────────────────────────────
const filters = reactive({
  invoiceInSap: '',
  endUser: '',
  poNo: '',
  payerName: '',
  etdFrom: null,
  etdTo: null,
  salesOrderNo: '',
  invoice: '',
  item: '',
})

// ── Table state ────────────────────────────────────────────────────────────
const tableState = reactive({
  items: [],
  totalItems: 0,
  loading: false,
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
})

// ── Core data loader ───────────────────────────────────────────────────────
async function loadData() {
  const currentRequestId = ++requestId

  tableState.loading = true
  tableState.items = [] // ✅ เคลียร์ก่อน → skeleton ชัดขึ้น

  // ✅ บังคับให้ Vue render skeleton ก่อน
  await nextTick()
  try {
    const { data, total } = await fetchExpenses({
      ...filters,
      page: tableState.page,
      itemsPerPage: tableState.itemsPerPage,
      sortBy: tableState.sortBy,
    })

    if (currentRequestId !== requestId) return

    tableState.items      = data
    tableState.totalItems = total
  } finally {
    if (currentRequestId === requestId) tableState.loading = false
  }
}

// ── Event handlers ─────────────────────────────────────────────────────────

/**
 * v-data-table-server emits this on mount AND on every page/sort change.
 * This is the ONLY trigger for loadData() — no onMounted needed.
 */
function handleTableOptions({ page, itemsPerPage, sortBy }) {
  tableState.page         = page
  tableState.itemsPerPage = itemsPerPage
  tableState.sortBy       = sortBy ?? []
  loadData()
}

/** Search button clicked — reset to page 1 then reload */
function handleSearch() {
  tableState.page = 1
  loadData()
}

/** Reset button clicked — clear all filters then reload */
function handleReset() {
  Object.assign(filters, {
    invoiceInSap: '',
    endUser: '',
    poNo: '',
    payerName: '',
    etdFrom: null,
    etdTo: null,
    salesOrderNo: '',
    invoice: '',
    item: '',
  })
  tableState.page = 1
  loadData()
}

function handleExport() {
  if (!tableState.items.length) {
    showToast('No data to export', 'warning', 'mdi-alert-circle-outline')
    
    return
  }

  const { rows, alignMap, colWidths, numberFormatMap } = mapTableToExcel(tableState.items, headers, tableState)

  exportToExcelWithHeader(
    rows,
    `Export Expenses Record Page ${tableState.page}.xlsx`,
    {
      title: 'Export Expenses Record',
      department: '-',
      alignMap,
      colWidths,
      numberFormatMap,
    },
  )

  showToast('Export success', 'success', 'mdi-check-circle-outline')
}
</script>

<style src="./ExportExpensesRecord.css">

</style>
