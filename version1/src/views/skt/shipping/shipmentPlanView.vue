<script setup>
import { useShipmentData } from './composables/useShipmentData'
import { useShipmentFilters } from './composables/useShipmentFilters'
import { useShipmentPermissions } from './composables/useShipmentPermissions'
  
const {
  data: shipmentData,
  isLoading,
  totalItems,
  fetchData,
  updateShipment,
} = useShipmentData()
  
const {
  filters,
  paginatedData,
  currentPage,
  itemsPerPage,
} = useShipmentFilters(shipmentData)
  
const {
  permissions,
  canExecute,
} = useShipmentPermissions()
  
const selectedItems = ref([])
  
// Simplified handlers
const handleSearch = () => fetchData(filters.value)

const handleClear = () => {
  filters.value = {}
  fetchData()
}
</script>

<template>
  <div class="shipment-plan">
    <PageHeader title="Shipment Plan" />
    
    <ShipmentFilter
      v-model:filters="filters"
      @search="handleSearch"
      @clear="handleClear"
    />
    
    <ShipmentActions
      :selected-items="selectedItems"
      :permissions="permissions"
      @approve="handleApprove"
      @reject="handleReject"
    />
    
    <ShipmentTable
      :data="paginatedData"
      :loading="isLoading"
      :permissions="permissions"
      @row-action="handleRowAction"
      @selection-change="handleSelectionChange"
    />
    
    <Pagination
      v-model:page="currentPage"
      v-model:per-page="itemsPerPage"
      :total="totalItems"
    />
  </div>
</template>
