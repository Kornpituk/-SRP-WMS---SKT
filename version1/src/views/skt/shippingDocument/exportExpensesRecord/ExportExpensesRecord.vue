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
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import SearchFilterBar from './components/SearchFilterBar.vue'
import ExpensesDataTable from './components/ExpensesDataTable.vue'
import { useExpensesService } from './composables/useExpensesService'
import { exportToExcel } from '@/views/skt/shippingDocument/utilities/exportExcel'
import { mapTableToExcel } from '@/views/skt/shippingDocument/mappers/shippingDocExcel.mapper'
import { headers } from './constants/ExportExpensesRecord'

const { fetchExpenses } = useExpensesService()

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
})

// ── Core data loader ───────────────────────────────────────────────────────
async function loadData() {
  tableState.loading = true
  try {
    const { data, total } = await fetchExpenses({
      ...filters,
      page: tableState.page,
      itemsPerPage: tableState.itemsPerPage,
    })

    tableState.items      = data
    tableState.totalItems = total
  } finally {
    tableState.loading = false
  }
}

// ── Event handlers ─────────────────────────────────────────────────────────

/**
 * v-data-table-server emits this on mount AND on every page/sort change.
 * This is the ONLY trigger for loadData() — no onMounted needed.
 */
function handleTableOptions({ page, itemsPerPage }) {
  tableState.page         = page
  tableState.itemsPerPage = itemsPerPage
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

  const mapped = mapTableToExcel(tableState.items, headers, tableState)

  exportToExcel(
    mapped,
    `Export Expenses Record Page ${tableState.page}.xlsx`,
  )

  showToast('Export success', 'success', 'mdi-check-circle-outline')
}
</script>

<style src="./ExportExpensesRecord.css">

</style>
