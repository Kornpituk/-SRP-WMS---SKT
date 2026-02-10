
<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import ShipmentPlanTableHeader from './ShipmentPlanTableHeader.vue'
import ShipmentPlanTableRow from './ShipmentPlanTableRow.vue'
import ShipmentPlanTablePagination from './ShipmentPlanTablePagination.vue'

const props = defineProps({
  // Data
  paginatedData: {
    type: Array,
    required: true,
  },
  
  // Loading and Error
  isLoading: Boolean,
  errorMessage: String,
  
  // Selection
  selectedDataTables: Array,
  isSelectAll: Boolean,
  isIndeterminate: Boolean,
  
  // Sorting
  sortColumn: String,
  sortDirection: String,
  
  // Pagination
  currentPage: Number,
  itemsPerPage: Number,
  totalItems: Number,
  selectedItemsPerPage: [Number, String],
  
  // UI State
  dataTableNummberedToggle: [Number, String],
  dataTableColor: String,
  
  // User and Permissions
  userDataInfo: Object,
  statusPermission: Object,
  
  // Dropdown Models
  freightForwarderModel: Array,
  carrierModel: Array,
  vesselsModel: Array,
  truckModel: Array,
  
  // Loading States
  saveDraftLoading: Boolean,
  saveDraftLoadingSOERow: [Number, String],
  submitLoading: Boolean,
  submitLoadingSOERow: [Number, String],
  
  // Account Types
  accountINSP: Boolean,
  accountWHSub: Boolean,
})

const emit = defineEmits([
  'toggleDirection',
  'toggleSelectAll',
  'selectRow',
  'highlightRow',
  'saveDraft',
  'submitRow',
  'deleteRow',
  'updateFileSO',
  'updateFilePO',
  'updateFileCOA',
  'updateFileTruckOrder',
  'updateFileDeliNote',
  'showDialogTruckOrder',
  'openTextareaDialog',
  'openTextareaDialog2',
  'actionBtn',
  'updateItemsPerPage',
  'goFirstPage',
  'goPrevPage',
  'goNextPage',
  'goLastPage',
])

// Event handlers
const onToggleDirection = column => emit('toggleDirection', column)
const onToggleSelectAll = () => emit('toggleSelectAll')
const onSelectRow = product => emit('selectRow', product)
const onHighlightRow = id => emit('highlightRow', id)
const onSaveDraft = (product, type) => emit('saveDraft', product, type)
const onSubmitRow = (type, id, product) => emit('submitRow', type, id, product)
const onDeleteRow = (type, id, product) => emit('deleteRow', type, id, product)
const onUpdateFileSO = (files, productId) => emit('updateFileSO', files, productId)
const onUpdateFilePO = (files, productId) => emit('updateFilePO', files, productId)
const onUpdateFileCOA = (files, productId) => emit('updateFileCOA', files, productId)
const onUpdateFileTruckOrder = (files, productId) => emit('updateFileTruckOrder', files, productId)
const onUpdateFileDeliNote = (files, productId) => emit('updateFileDeliNote', files, productId)

const onShowDialogTruckOrder = (salesOrderNo, journalId, product) => 
  emit('showDialogTruckOrder', salesOrderNo, journalId, product)

const onOpenTextareaDialog = (type, value, id, disabled, canExecute) => 
  emit('openTextareaDialog', type, value, id, disabled, canExecute)

const onOpenTextareaDialog2 = (type, mark, conditions, index, id, active, product, disabled, canExecute) => 
  emit('openTextareaDialog2', type, mark, conditions, index, id, active, product, disabled, canExecute)

const onActionBtn = product => emit('actionBtn', product)
const onUpdateItemsPerPage = value => emit('updateItemsPerPage', value)
const onGoFirstPage = () => emit('goFirstPage')
const onGoPrevPage = () => emit('goPrevPage')
const onGoNextPage = () => emit('goNextPage')
const onGoLastPage = () => emit('goLastPage')
</script>

<template>
  <VCard class="mt-2">
    <!-- Loading และ Error States -->
    <div>
      <div
        v-if="errorMessage"
        class="error"
      >
        {{ errorMessage }}
      </div>
      
      <VProgressLinear
        v-if="isLoading"
        height="20"
        indeterminate
        color="primary"
        class="elevation-1"
      >
        <span>Loading Data.... {{ errorMessage }}</span>
      </VProgressLinear>
    </div>
    
    <!-- Table Section -->
    <section v-if="!isLoading && paginatedData.length > 0">
      <VTable
        v-if="!isLoading"
        class="text-wrap table-header-bg rounded-0"
      >
        <!-- Header Component -->
        <ShipmentPlanTableHeader
          :sort-column="sortColumn"
          :sort-direction="sortDirection"
          :is-select-all="isSelectAll"
          :is-indeterminate="isIndeterminate"
          :user-data-info="userDataInfo"
          :status-permission="statusPermission"
          @toggle-direction="onToggleDirection"
          @toggle-select-all="onToggleSelectAll"
        />
        
        <!-- Table Body -->
        <tbody>
          <ShipmentPlanTableRow
            v-for="(product, index) in paginatedData"
            :key="product.soEtlLogDetailJournalID"
            :product="product"
            :index="index"
            :current-page="currentPage"
            :data-table-numbered-toggle="dataTableNummberedToggle"
            :data-table-color="dataTableColor"
            :selected-data-tables="selectedDataTables"
            :user-data-info="userDataInfo"
            :status-permission="statusPermission"
            :freight-forwarder-model="freightForwarderModel"
            :carrier-model="carrierModel"
            :vessels-model="vesselsModel"
            :truck-model="truckModel"
            :save-draft-loading="saveDraftLoading"
            :save-draft-loading-soe-row="saveDraftLoadingSOERow"
            :submit-loading="submitLoading"
            :submit-loading-soe-row="submitLoadingSOERow"
            :account-insp="accountINSP"
            :account-wh-sub="accountWHSub"
            @select-row="onSelectRow"
            @highlight-row="onHighlightRow"
            @save-draft="onSaveDraft"
            @submit-row="onSubmitRow"
            @delete-row="onDeleteRow"
            @update-file-so="onUpdateFileSO"
            @update-file-po="onUpdateFilePO"
            @update-file-coa="onUpdateFileCOA"
            @update-file-truck-order="onUpdateFileTruckOrder"
            @update-file-deli-note="onUpdateFileDeliNote"
            @show-dialog-truck-order="onShowDialogTruckOrder"
            @open-textarea-dialog="onOpenTextareaDialog"
            @open-textarea-dialog-2="onOpenTextareaDialog2"
            @action-btn="onActionBtn"
          />
        </tbody>
        
        <VDivider />
      </VTable>
      
      <VDivider />
      
      <!-- Pagination Component -->
      <ShipmentPlanTablePagination
        :current-page="currentPage"
        :items-per-page="itemsPerPage"
        :total-items="totalItems"
        :selected-items-per-page="selectedItemsPerPage"
        @update:selected-items-per-page="onUpdateItemsPerPage"
        @go-first-page="onGoFirstPage"
        @go-prev-page="onGoPrevPage"
        @go-next-page="onGoNextPage"
        @go-last-page="onGoLastPage"
      />
    </section>
  </VCard>
</template>

<style scoped>
.error {
  color: #ff4444;
  background-color: #ffebee;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
}
</style>
