<template>
  <div>
    <!--
      ต้องใช้ v-model:filters ไม่ใช่ :filters
      เพราะ ShippingExpenseFilter ใช้ local copy + emit('update:filters')
    -->
    <ShippingExpenseFilter
      v-model:filters="filters"
      @search="handleSearch"
      @clear="handleClear"
      @export="handleExport"
    />

    <VDivider />

    <ShippingExpenseTable
      :items="items"
      :total="total"
      :loading="loading"
      :pagination="pagination"
      :sort-by="sortBy"
      @update:options="handleUpdateOptions"
      @action="handleAction"
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
import { reactive } from 'vue'
import { useShippingExpense } from '../../composables/useShippingExpense'
import ShippingExpenseFilter from '../filters/ShippingExpenseFilter.vue'
import ShippingExpenseTable  from '../tables/ShippingExpenseTable.vue'

const {
  loading, items, total,
  filters, pagination, sortBy,
  handleSearch, handleClear,
  handleUpdateOptions,
} = useShippingExpense()

const snackbar = reactive({ show: false, message: '', color: 'primary', icon: 'mdi-information' })

function showToast(message, color = 'primary', icon = 'mdi-information') {
  Object.assign(snackbar, { show: true, message, color, icon })
}

function handleAction(item) {
  showToast(`Opening expense: ${item.invoiceInSAP}`, 'primary', 'mdi-cash-multiple')
}

function handleExport() {
  showToast('Exporting to Excel...', 'success', 'mdi-microsoft-excel')
}
</script>
