<template>
  <div>
    <!--
      v-model:filters="filters" = shorthand ของ
      :filters="filters" + @update:filters="val => Object.assign(filters, val)"
    -->
    <ShippingDocFilter
      v-model:filters="filters"
      :status-filter-disabled="statusFilterDisabled"
      @search="handleSearch"
      @clear="handleClear"
      @export="handleExport"
    />

    <VDivider />

    <ShippingDocTable
      :items="items"
      :total="total"
      :loading="loading"
      :pagination="pagination"
      :sort-by="sortBy"
      :mode="mode"
      @update:options="handleUpdateOptions"
      @action="handleAction"
      @void="handleVoid"
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
import { useShippingDocList } from '../../composables/useShippingDocList'
import ShippingDocFilter from '../filters/ShippingDocFilter.vue'
import ShippingDocTable  from '../tables/ShippingDocTable.vue'

const props = defineProps({
  mode: {
    type: String,
    default: 'list',
    validator: v => ['list', 'void'].includes(v),
  },
})

const {
  loading, items, total,
  filters, pagination, sortBy,
  statusFilterDisabled,
  handleSearch, handleClear,
  handleUpdateOptions,
} = useShippingDocList(props.mode)

// ─── Toast ────────────────────────────────────────────────────
const snackbar = reactive({ show: false, message: '', color: 'primary', icon: 'mdi-information' })

function showToast(message, color = 'primary', icon = 'mdi-information') {
  Object.assign(snackbar, { show: true, message, color, icon })
}

// ─── Actions ──────────────────────────────────────────────────
function handleAction(item) {
  showToast(`Opening detail: ${item.invoiceInSAP}`, 'primary', 'mdi-file-eye-outline')
}

function handleVoid(item) {
  showToast(`Voiding: ${item.invoiceInSAP}`, 'error', 'mdi-file-cancel-outline')
}

function handleExport() {
  showToast('Exporting to Excel...', 'success', 'mdi-microsoft-excel')
}
</script>
