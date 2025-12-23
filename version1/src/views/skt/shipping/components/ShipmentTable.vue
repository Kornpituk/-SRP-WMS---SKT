// =====================================================
// 📄 components/ShipmentTable.vue
// =====================================================
<template>
  <VCard>
    <VProgressLinear v-if="loading" indeterminate />
    
    <VTable class="shipment-table">
      <thead>
        <ShipmentTableHeader
          :columns="visibleColumns"
          :sort-column="sortColumn"
          :sort-direction="sortDirection"
          @sort="$emit('sort', $event)"
        />
      </thead>
      
      <tbody>
        <ShipmentTableRow
          v-for="(item, index) in data"
          :key="item.soEtlLogDetailJournalID"
          :item="item"
          :index="index"
          :columns="visibleColumns"
          :permissions="permissions"
          @action="$emit('row-action', $event)"
        />
      </tbody>
    </VTable>
  </VCard>
</template>

<script setup>
import { computed } from 'vue'
import ShipmentTableHeader from './ShipmentTableHeader.vue'
import ShipmentTableRow from './ShipmentTableRow.vue'

const props = defineProps({
  data: Array,
  loading: Boolean,
  permissions: Object,
  sortColumn: String,
  sortDirection: String
})

const emit = defineEmits(['row-action', 'sort'])

// ✅ Only show columns user can see
const visibleColumns = computed(() => {
  const allColumns = [
    { key: 'salesOrderNo', label: 'Sale Order No.', permission: 'COL_SALE_ORDER_NO' },
    { key: 'sapInvoiceNo', label: 'SAP Invoice No', permission: 'COL_SAP_INVOICE_NO' },
    { key: 'payerName', label: 'Payer Name', permission: 'COL_PAYER_NAME' },
    // ... etc
  ]
  
  return allColumns.filter(col =>
    props.permissions.canVisible(col.permission)
  )
})
</script>
