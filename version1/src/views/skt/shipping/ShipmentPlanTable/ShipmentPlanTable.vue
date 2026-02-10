<template>
  <VCard class="mt-2">
    <!-- Loading and Error States -->
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
          :can-visible-user-permission="canVisibleUserPermission"
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
            :type-file-input="typeFileInput"
            :can-visible-user-permission="canVisibleUserPermission"
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
            @update-field="onUpdateField"
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
    
    <!-- Empty State -->
    <section v-if="!isLoading && paginatedData.length === 0">
      <VCardText class="text-center">
        <VIcon
          size="64"
          color="grey"
          class="mb-2"
        >
          ri-inbox-line
        </VIcon>
        <p class="text-h6 text-grey">
          No data found
        </p>
      </VCardText>
    </section>
  </VCard>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import ShipmentPlanTableHeader from './ShipmentPlanTableHeader.vue'
import ShipmentPlanTableRow from './ShipmentPlanTableRow.vue'
import ShipmentPlanTablePagination from './ShipmentPlanTablePagination.vue'

// Props Definition
const props = defineProps({
  // Data
  paginatedData: {
    type: Array,
    required: true,
    default: () => [],
  },
  
  // Loading and Error States
  isLoading: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  
  // Selection
  selectedDataTables: {
    type: Array,
    default: () => [],
  },
  isSelectAll: {
    type: Boolean,
    default: false,
  },
  isIndeterminate: {
    type: Boolean,
    default: false,
  },
  
  // Sorting
  sortColumn: {
    type: String,
    default: '',
  },
  sortDirection: {
    type: String,
    default: 'desc',
  },
  
  // Pagination
  currentPage: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  selectedItemsPerPage: {
    type: [Number, String],
    default: 10,
  },
  
  // UI State
  dataTableNummberedToggle: {
    type: [Number, String],
    default: null,
  },
  dataTableColor: {
    type: String,
    default: '',
  },
  
  // User and Permissions
  userDataInfo: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  statusPermission: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  canVisibleUserPermission: {
    type: Function,
    required: true,
  },
  
  // Dropdown Models
  freightForwarderModel: {
    type: Array,
    default: () => [],
  },
  carrierModel: {
    type: Array,
    default: () => [],
  },
  vesselsModel: {
    type: Array,
    default: () => [],
  },
  truckModel: {
    type: Array,
    default: () => [],
  },
  
  // File Input Type
  typeFileInput: {
    type: String,
    default: '',
  },
  
  // Loading States
  saveDraftLoading: {
    type: Boolean,
    default: false,
  },
  saveDraftLoadingSOERow: {
    type: [Number, String],
    default: null,
  },
  submitLoading: {
    type: Boolean,
    default: false,
  },
  submitLoadingSOERow: {
    type: [Number, String],
    default: null,
  },
  
  // Account Types
  accountINSP: {
    type: Boolean,
    default: false,
  },
  accountWHSub: {
    type: Boolean,
    default: false,
  },
})

// Emit Events
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
  'updateField',
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

// Event Handlers
const onToggleDirection = column => {
  emit('toggleDirection', column)
}

const onToggleSelectAll = () => {
  emit('toggleSelectAll')
}

const onSelectRow = product => {
  emit('selectRow', product)
}

const onHighlightRow = id => {
  emit('highlightRow', id)
}

const onSaveDraft = (product, type) => {
  emit('saveDraft', product, type)
}

const onSubmitRow = (type, id, product) => {
  emit('submitRow', type, id, product)
}

const onDeleteRow = (type, id, product) => {
  emit('deleteRow', type, id, product)
}

const onUpdateFileSO = (files, productId) => {
  emit('updateFileSO', files, productId)
}

const onUpdateFilePO = (files, productId) => {
  emit('updateFilePO', files, productId)
}

const onUpdateFileCOA = (files, productId) => {
  emit('updateFileCOA', files, productId)
}

const onUpdateFileTruckOrder = (files, productId) => {
  emit('updateFileTruckOrder', files, productId)
}

const onUpdateFileDeliNote = (files, productId) => {
  emit('updateFileDeliNote', files, productId)
}

const onUpdateField = ({ field, value, id }) => {
  emit('updateField', { field, value, id })
}

const onShowDialogTruckOrder = (salesOrderNo, journalId, product) => {
  emit('showDialogTruckOrder', salesOrderNo, journalId, product)
}

const onOpenTextareaDialog = (type, value, id, disabled, canExecute) => {
  emit('openTextareaDialog', type, value, id, disabled, canExecute)
}

const onOpenTextareaDialog2 = (type, mark, conditions, index, id, active, product, disabled, canExecute) => {
  emit('openTextareaDialog2', type, mark, conditions, index, id, active, product, disabled, canExecute)
}

const onActionBtn = product => {
  emit('actionBtn', product)
}

const onUpdateItemsPerPage = value => {
  emit('updateItemsPerPage', value)
}

const onGoFirstPage = () => {
  emit('goFirstPage')
}

const onGoPrevPage = () => {
  emit('goPrevPage')
}

const onGoNextPage = () => {
  emit('goNextPage')
}

const onGoLastPage = () => {
  emit('goLastPage')
}
</script>

<style scoped>
.error {
  color: #ff4444;
  background-color: #ffebee;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  border: 1px solid #ffcdd2;
}

.table-header-bg {
  background-color: #f5f5f5;
}

.sticky-column {
  position: sticky;
  left: 0;
  z-index: 1;
  background-color: inherit;
}

.sticky-columnBody {
  position: sticky;
  left: 0;
  z-index: 1;
  background-color: inherit;
}

.sticky-action {
  position: sticky;
  right: 0;
  z-index: 1;
  background-color: inherit;
}

.clickable-icon {
  cursor: pointer;
}

.clickable-icon:hover {
  opacity: 0.7;
}

.cell-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.cursor-pointer {
  cursor: pointer;
}

.pagination-container {
  display: flex;
  align-items: center;
  gap: 4px;
}

.text-wrap {
  white-space: normal;
  word-wrap: break-word;
}

.truncate-select {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-field :deep(.v-field__input) {
  font-size: 12px;
}
</style>
