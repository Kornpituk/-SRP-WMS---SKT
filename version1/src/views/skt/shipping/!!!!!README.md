# 📘 Shipment Plan Refactoring Guide

## 📊 Executive Summary

**Current Status**: Monolithic component (~2,500 lines)  
**Target**: Modular, maintainable architecture  
**Timeline**: 4 weeks  
**Priority**: High

---

## 🚨 Current Issues

### Critical Problems

| Issue | Severity | Impact |
|-------|----------|--------|
| God Component (2,500+ lines) | 🔴 High | Maintainability |
| 50+ reactive variables | 🔴 High | State management |
| Mixed responsibilities | 🔴 High | Code clarity |
| Duplicate code | 🟡 Medium | DRY principle |
| No TypeScript | 🟡 Medium | Type safety |

### Code Smells

```javascript
// ❌ Too many responsibilities in one file
- API calls (20+)
- State management (50+ refs)
- Business logic
- UI logic
- File uploads
- Validation
- Dialogs (10+)
```

---

## 🎯 Refactoring Goals

- ✅ Reduce main component to <300 lines
- ✅ Extract reusable composables
- ✅ Create atomic UI components
- ✅ Improve type safety
- ✅ Add unit tests
- ✅ Enhance performance

---

## 📋 4-Week Roadmap

### Week 1: Foundation & Composables

#### Day 1-2: Setup Structure
```bash
# Create new directory structure
composables/shipment/
├── useShipmentState.js
├── useShipmentAPI.js
├── useShipmentPermissions.js
├── useShipmentDialogs.js
└── useFileUpload.js

utils/shipment/
├── validation.js
├── formatters.js
├── constants.js
└── helpers.js
```

#### Day 3-4: Extract State Management

**File**: `composables/shipment/useShipmentState.js`

```javascript
import { ref, computed } from 'vue'

/**
 * Shipment state management composable
 * @returns {Object} State and computed properties
 */
export const useShipmentState = () => {
  // Search data
  const searchPlanData = ref([])
  const selectedItems = ref([])
  const isLoading = ref(false)

  // Filters
  const filters = ref({
    statusId: sessionStorage.getItem('StatusIdSearchProductionFilter') || '',
    eta: sessionStorage.getItem('ETASearchProductionFilter') || '',
    etd: sessionStorage.getItem('ETDSearchProductionFilter') || '',
    salesOrderNo: sessionStorage.getItem('SalesOrderNoSearchProductionFilter') || '',
    payerName: sessionStorage.getItem('PayerNameSearchProductionFilter') || '',
    itemName: sessionStorage.getItem('ItemNameSearchProductionFilter') || '',
    lot: sessionStorage.getItem('LotSearchProductionFilter') || '',
    sortColumn: '',
    sortDirection: ''
  })

  // Pagination
  const pagination = ref({
    currentPage: 1,
    itemsPerPage: 10,
    selectedItemsPerPage: 10
  })

  // Computed
  const totalItems = computed(() => searchPlanData.value.length)
  
  const totalPages = computed(() => 
    Math.ceil(totalItems.value / pagination.value.itemsPerPage)
  )

  const paginatedData = computed(() => {
    const start = (pagination.value.currentPage - 1) * pagination.value.itemsPerPage
    const end = pagination.value.currentPage * pagination.value.itemsPerPage
    return searchPlanData.value.slice(start, end)
  })

  // Methods
  const resetFilters = () => {
    filters.value = {
      statusId: '',
      eta: '',
      etd: '',
      salesOrderNo: '',
      payerName: '',
      itemName: '',
      lot: '',
      sortColumn: '',
      sortDirection: ''
    }
  }

  const saveFilterHistory = () => {
    sessionStorage.setItem('StatusIdSearchProductionFilter', filters.value.statusId)
    sessionStorage.setItem('ETASearchProductionFilter', filters.value.eta)
    sessionStorage.setItem('ETDSearchProductionFilter', filters.value.etd)
    sessionStorage.setItem('SalesOrderNoSearchProductionFilter', filters.value.salesOrderNo)
    sessionStorage.setItem('PayerNameSearchProductionFilter', filters.value.payerName)
    sessionStorage.setItem('ItemNameSearchProductionFilter', filters.value.itemName)
    sessionStorage.setItem('LotSearchProductionFilter', filters.value.lot)
  }

  return {
    // State
    searchPlanData,
    selectedItems,
    isLoading,
    filters,
    pagination,
    
    // Computed
    totalItems,
    totalPages,
    paginatedData,
    
    // Methods
    resetFilters,
    saveFilterHistory
  }
}
```

#### Day 5: Extract API Calls

**File**: `composables/shipment/useShipmentAPI.js`

```javascript
import { ref } from 'vue'
import { useGetSearchPlanService, useSaveSearchPlanService, useSubmitShipmentPlanService } from '@/services/skt/shipmentPlan/services'
import { formatDateSave, convertDateFormat } from '@/utils/shipment/formatters'

/**
 * Shipment API operations
 * @param {string} urlApi - API URL
 * @param {string} whereHouse - Warehouse name
 * @param {string} accessToken - Access token
 * @returns {Object} API methods
 */
export const useShipmentAPI = (urlApi, whereHouse, accessToken) => {
  const { getSearchPlanResult, errorGetSearchPlan, fetchSearchPlan } = useGetSearchPlanService()
  const { saveSearchPlanResult, errorSaveSearchPlan, saveSearchPlan } = useSaveSearchPlanService()
  const { submitShipmentPlanResult, errorSubmitShipmentPlan, submitShipmentPlan } = useSubmitShipmentPlanService()

  /**
   * Search shipment plans
   * @param {Object} filters - Search filters
   * @returns {Promise<Array>} Search results
   */
  const searchShipmentPlans = async (filters) => {
    try {
      // Prepare filters
      const preparedFilters = {
        ...filters,
        ETA: formatDateSave(filters.ETA),
        ETD: filters.ETD
      }

      // Handle ETD date range
      if (preparedFilters.ETD) {
        if (preparedFilters.ETD.includes(' to ')) {
          const [startDate, endDate] = preparedFilters.ETD.split(' to ')
          preparedFilters.ETDDateFrom = convertDateFormat(startDate)
          preparedFilters.ETDDateTo = convertDateFormat(endDate)
        } else {
          preparedFilters.ETDDateFrom = convertDateFormat(preparedFilters.ETD)
          preparedFilters.ETDDateTo = convertDateFormat(preparedFilters.ETD)
        }
      }

      const result = await fetchSearchPlan(
        urlApi,
        'searchplans',
        whereHouse,
        accessToken,
        preparedFilters,
        filters.StatusId
      )

      return getSearchPlanResult.value?.datas || []
    } catch (error) {
      console.error('Error searching shipment plans:', error)
      throw error
    }
  }

  /**
   * Save shipment plan
   * @param {Object} data - Shipment data
   * @returns {Promise<boolean>} Success status
   */
  const saveShipmentPlanData = async (data) => {
    try {
      const requestData = {
        soEtlLogDetailJournalID: data.soEtlLogDetailJournalID || 0,
        loadingDate: formatDateSave(data.logUpdatedDate),
        updatedBy: data.salUpdatedBy || 'system',
        poNo: data.poNo || '',
        sapInvoiceNo: data.sapInvoiceNo || '',
        shipperMark: data.shipperMark || '',
        shipperConditions: data.shipperConditions || '',
        shippingEndUser: data.shippingEndUser || '',
        shipperLocation: data.shipperLocation || '',
        shippingMarkActive: data.shippingMarkActive || '',
        freightForwarder: data.freightForwarder || '',
        carrier: data.carrier || '',
        vesselName: data.vesselName || '',
        voy: data.voy || '',
        truck: data.truck || '',
        truckReservingNumber: data.truckReservingNumber || '',
        truckFee: data.truckFee || '',
        etd: formatDateSave(data.etd),
        eta: formatDateSave(data.eta),
        saL_Remarks: data.saL_Remarks || '',
        wH_Remarks: data.wH_Remarks || '',
        loG_Remarks: data.loG_Remarks || ''
      }

      const response = await saveSearchPlan(
        urlApi,
        'save',
        whereHouse,
        accessToken,
        requestData
      )

      return saveSearchPlanResult.value?.success || false
    } catch (error) {
      console.error('Error saving shipment plan:', error)
      throw error
    }
  }

  /**
   * Submit shipment plan
   * @param {string} type - Action type (submit, approve, reject, back, delete)
   * @param {string|Array} id - Journal ID(s)
   * @param {string} comment - Optional comment
   * @returns {Promise<boolean>} Success status
   */
  const submitShipmentPlanData = async (type, id, comment = '') => {
    try {
      const result = await submitShipmentPlan(
        urlApi,
        type,
        whereHouse,
        accessToken,
        id,
        comment
      )

      return submitShipmentPlanResult.value?.success || false
    } catch (error) {
      console.error('Error submitting shipment plan:', error)
      throw error
    }
  }

  return {
    searchShipmentPlans,
    saveShipmentPlanData,
    submitShipmentPlanData,
    
    // Expose results for reactivity
    getSearchPlanResult,
    saveSearchPlanResult,
    submitShipmentPlanResult,
    
    // Expose errors
    errorGetSearchPlan,
    errorSaveSearchPlan,
    errorSubmitShipmentPlan
  }
}
```

---

### Week 2: Components Extraction

#### Day 1-2: Create Table Components

**File**: `components/shipment/ShipmentTable.vue`

```vue
<script setup>
import { computed } from 'vue'
import ShipmentTableRow from './ShipmentTableRow.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  selected: {
    type: Array,
    default: () => []
  },
  pagination: {
    type: Object,
    required: true
  },
  permissions: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:selected',
  'save',
  'submit',
  'delete',
  'sort'
])

const isAllSelected = computed(() => {
  return props.data.length > 0 && props.selected.length === props.data.length
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    emit('update:selected', [])
  } else {
    emit('update:selected', [...props.data])
  }
}

const handleSort = (column) => {
  emit('sort', column)
}
</script>

<template>
  <VCard>
    <VProgressLinear
      v-if="loading"
      height="20"
      indeterminate
      color="primary"
    >
      <span>Loading Data....</span>
    </VProgressLinear>

    <VTable v-else>
      <thead>
        <tr>
          <th>
            <VCheckbox
              :model-value="isAllSelected"
              @click="toggleSelectAll"
            />
          </th>
          <th>No.</th>
          <th @click="handleSort('status')">
            Status
            <VIcon icon="ri-arrow-down-line" />
          </th>
          <th @click="handleSort('salesOrderNo')">
            Sale Order No.
            <VIcon icon="ri-arrow-down-line" />
          </th>
          <!-- Add more headers -->
        </tr>
      </thead>

      <tbody>
        <ShipmentTableRow
          v-for="(item, index) in data"
          :key="item.soEtlLogDetailJournalID"
          :item="item"
          :index="index"
          :selected="selected.includes(item)"
          :permissions="permissions"
          @toggle-select="emit('update:selected', $event)"
          @save="emit('save', $event)"
          @submit="emit('submit', $event)"
          @delete="emit('delete', $event)"
        />
      </tbody>
    </VTable>
  </VCard>
</template>
```

#### Day 3-4: Create Cell Components

**File**: `components/shipment/cells/FileUploadCell.vue`

```vue
<script setup>
import FileInputDialogCarousels from '@/components/golbal/flieUploadDialogCarousels.vue'

const props = defineProps({
  files: {
    type: Array,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update'])

const handleFileUpdate = (files) => {
  emit('update', files)
}
</script>

<template>
  <FileInputDialogCarousels
    :files-from-a-p-i="files"
    :title-dialog="title"
    :disabled-prop="disabled"
    :type-file-input="'hideInput'"
    :file-name="fileName"
    @updateFiles="handleFileUpdate"
  />
</template>
```

**File**: `components/shipment/cells/AutocompleteCell.vue`

```vue
<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  items: {
    type: Array,
    required: true
  },
  itemTitle: {
    type: String,
    default: 'text'
  },
  itemValue: {
    type: String,
    default: 'value'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <VAutocomplete
    :model-value="modelValue"
    :items="items"
    :item-title="itemTitle"
    :item-value="itemValue"
    :disabled="disabled"
    density="compact"
    class="truncate-select"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #selection="{ item }">
      <div class="truncate-select" style="min-width: 150px;">
        {{ item.title }}
      </div>
    </template>
  </VAutocomplete>
</template>
```

#### Day 5: Create Dialog Components

**File**: `components/shipment/dialogs/RemarkDialog.vue`

```vue
<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  remark: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'update:remark', 'save'])

const localRemark = ref(props.remark)

watch(() => props.remark, (newVal) => {
  localRemark.value = newVal
})

const handleSave = () => {
  emit('update:remark', localRemark.value)
  emit('save', localRemark.value)
  emit('update:modelValue', false)
}
</script>

<template>
  <VDialog
    :model-value="modelValue"
    persistent
    max-width="900px"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <VCard>
      <VCardTitle class="text-center">
        {{ title }}
      </VCardTitle>

      <DialogCloseBtn
        variant="text"
        size="default"
        @click="emit('update:modelValue', false)"
      />

      <VCardText>
        <VTextarea
          v-model="localRemark"
          :readonly="disabled"
          auto-grow
          rows="7"
          counter
          outlined
        />
      </VCardText>

      <VCardActions v-if="!disabled" class="d-flex justify-end">
        <VBtn
          color="primary"
          @click="handleSave"
        >
          Save
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
```

---

### Week 3: Utilities & Validation

#### Day 1-2: Create Validation Utils

**File**: `utils/shipment/validation.js`

```javascript
/**
 * Validate shipment data before save
 * @param {Object} data - Shipment data
 * @returns {Object} Validation result
 */
export const validateShipmentData = (data) => {
  const errors = []

  // Required fields
  if (!data.sapInvoiceNo) {
    errors.push('SAP Invoice No is required')
  }

  if (!data.etd) {
    errors.push('ETD is required')
  }

  if (!data.eta) {
    errors.push('ETA is required')
  }

  // Date validation
  if (data.etd && data.eta) {
    const etd = new Date(data.etd)
    const eta = new Date(data.eta)
    
    if (eta < etd) {
      errors.push('ETA must be after ETD')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Check if save draft is disabled
 * @param {Object} product - Product data
 * @param {Object} permissions - User permissions
 * @returns {boolean} Is disabled
 */
export const isDraftDisabled = (product, permissions) => {
  return disabledStatusSaveDraft(
    product.inspStatusId,
    product.logStatusId,
    product.salStatusId,
    product.whStatusId,
    product
  ) || !permissions.canVisible
}

/**
 * Check if submit is disabled
 * @param {Object} product - Product data
 * @param {Object} permissions - User permissions
 * @returns {boolean} Is disabled
 */
export const isSubmitDisabled = (product, permissions) => {
  return disabledStatus(
    product.inspStatusId,
    product.logStatusId,
    product.salStatusId,
    product.whStatusId,
    product
  ) || !permissions.canVisible
}

/**
 * Check if status allows editing
 * @param {number} statusId - Status ID
 * @returns {boolean} Can edit
 */
export const canEditByStatus = (statusId) => {
  const editableStatuses = [201, 202, 203, 204, 205]
  return editableStatuses.includes(statusId)
}

/**
 * Check if all required files are uploaded
 * @param {Object} product - Product data
 * @returns {boolean} All files uploaded
 */
export const hasAllRequiredFiles = (product) => {
  const requiredFiles = ['SO', 'PO']
  
  return requiredFiles.every(type => {
    const fileKey = `get${type}FileData`
    return product[fileKey]?.length > 0
  })
}
```

#### Day 3-4: Create Helper Functions

**File**: `utils/shipment/helpers.js`

```javascript
/**
 * Get or return default value
 * @param {*} value - Value to check
 * @param {*} defaultValue - Default value
 * @returns {*} Value or default
 */
export const getOrDefault = (value, defaultValue = '') => {
  return value ?? defaultValue
}

/**
 * Format date for display
 * @param {string} dateString - Date string
 * @returns {string} Formatted date
 */
export const formatDisplayDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  if (isNaN(date)) return ''
  
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  
  return `${day}/${month}/${year}`
}

/**
 * Convert date format from DD/MM/YYYY to YYYY-MM-DD
 * @param {string} dateString - Date in DD/MM/YYYY format
 * @returns {string} Date in YYYY-MM-DD format
 */
export const convertDateFormat = (dateString) => {
  if (!dateString) return ''
  
  const [day, month, year] = dateString.split('/')
  return `${year}-${month}-${day}`
}

/**
 * Get status color by ID
 * @param {number} statusId - Status ID
 * @returns {Object} Color config
 */
export const getStatusColor = (statusId) => {
  const statusColors = {
    201: { color: 'warning', text: 'Draft' },
    202: { color: 'info', text: 'Pending' },
    203: { color: 'primary', text: 'Approved' },
    204: { color: 'success', text: 'Completed' },
    205: { color: 'error', text: 'Rejected' }
  }
  
  return statusColors[statusId] || { color: 'grey', text: 'Unknown' }
}

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
```

#### Day 5: Create Constants

**File**: `utils/shipment/constants.js`

```javascript
/**
 * File type constants
 */
export const FILE_TYPES = {
  SO: 'SaveSo',
  PO: 'SavePo',
  COA: 'SaveCOA',
  TRUCK_ORDER: 'SaveTruckOrder',
  DELIVERY_NOTE: 'SaveDeliveryNote'
}

export const DELETE_FILE_TYPES = {
  SO: 'DeleteSO',
  PO: 'DeletePO',
  COA: 'DeleteCOA',
  TRUCK_ORDER: 'DeleteTruckOrder',
  DELIVERY_NOTE: 'DeleteDeliveryNote'
}

/**
 * Action type constants
 */
export const ACTION_TYPES = {
  SAVE_DRAFT: 'save draft',
  SUBMIT: 'submit',
  APPROVE: 'approve',
  REJECT: 'reject',
  SEND_BACK: 'back',
  DELETE: 'delete'
}

/**
 * Dialog type constants
 */
export const DIALOG_TYPES = {
  SHIPPING_MARK: 'ShipMC',
  REMARK_SAL: 'Remark SAL',
  REMARK_WH: 'Remark WH',
  REMARK_LOG: 'Remark LOG',
  LOT: 'Lot'
}

/**
 * Status ID constants
 */
export const STATUS_IDS = {
  DRAFT: 201,
  PENDING_SAL: 202,
  PENDING_LOG: 203,
  PENDING_WH: 204,
  APPROVED: 205,
  REJECTED: 206,
  COMPLETED: 207
}

/**
 * Permission context IDs
 */
export const PERMISSION_CONTEXTS = {
  SHIPMENT_PLAN: 7
}

/**
 * Department names
 */
export const DEPARTMENTS = {
  WAREHOUSE: 'Warehouse',
  LOGISTIC: 'Logistic',
  SALES: 'Sale and marketing',
  INSPECTION: 'Inspection'
}

/**
 * Reload delay in milliseconds
 */
export const RELOAD_DELAY = 500

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  SEARCH_PLANS: 'searchplans',
  SAVE: 'save',
  SUBMIT: 'submit',
  APPROVE: 'approve',
  REJECT: 'reject',
  DELETE: 'delete'
}

/**
 * Date format patterns
 */
export const DATE_FORMATS = {
  DISPLAY: 'd/m/Y',
  API: 'YYYY-MM-DD'
}

/**
 * Pagination defaults
 */
export const PAGINATION_DEFAULTS = {
  ITEMS_PER_PAGE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100, 'All']
}
```

---

### Week 4: Final Integration & Polish

#### Day 1-2: Refactor Main Component

**File**: `pages/shipment/ShipmentPlanPage.vue`

```vue
<script setup>
import { onMounted } from 'vue'
import { urlApi } from '@/api'

// Composables
import { useShipmentState } from './composables/useShipmentState'
import { useShipmentAPI } from './composables/useShipmentAPI'
import { useFileUpload } from './composables/useFileUpload'
import { useShipmentDialogs } from './composables/useShipmentDialogs'
import { usePermissions } from '@/composables/usePermissions'

// Components
import ShipmentFilters from './components/ShipmentFilters.vue'
import ShipmentTable from './components/ShipmentTable.vue'
import ShippingMarkDialog from './components/dialogs/ShippingMarkDialog.vue'
import TruckOrderDialog from './components/dialogs/TruckOrderDialog.vue'
import RemarkDialog from './components/dialogs/RemarkDialog.vue'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'
import AlertDialog from '@/components/dialogs/AlertDialog.vue'

// Utils
import { ACTION_TYPES, RELOAD_DELAY } from '@/utils/shipment/constants'

// Config
const whereHouse = localStorage.getItem('whereHouseName')
const accessToken = sessionStorage.getItem('accessTokenAtStore')

// State
const {
  searchPlanData,
  selectedItems,
  filters,
  pagination,
  isLoading,
  totalItems,
  totalPages,
  paginatedData,
  resetFilters,
  saveFilterHistory
} = useShipmentState()

// API
const {
  searchShipmentPlans,
  saveShipmentPlanData,
  submitShipmentPlanData
} = useShipmentAPI(urlApi.value, whereHouse, accessToken)

// File Upload
const fileUpload = useFileUpload(urlApi.value, whereHouse, accessToken)

// Dialogs
const dialogs = useShipmentDialogs()

// Permissions
const permissions = usePermissions()

// ============================================
// Event Handlers
// ============================================

/**
 * Handle search
 */
const handleSearch = async () => {
  isLoading.value = true
  saveFilterHistory()
  
  try {
    const results = await searchShipmentPlans(filters.value)
    searchPlanData.value = results
  } catch (error) {
    dialogs.showAlert('Search failed', false)
  } finally {
    isLoading.value = false
  }
}

/**
 * Handle clear filters
 */
const handleClearFilters = async () => {
  resetFilters()
  await handleSearch()
}

/**
 * Handle save
 */
const handleSave = async (row) => {
  try {
    // Upload files first
    await fileUpload.uploadAllFiles(row)
    
    // Save data
    const success = await saveShipmentPlanData(row)
    
    if (success) {
      dialogs.showAlert('Saved successfully', true)
      setTimeout(() => location.reload(), RELOAD_DELAY)
    } else {
      dialogs.showAlert('Save failed', false)
    }
  } catch (error) {
    dialogs.showAlert('An error occurred', false)
  }
}

/**
 * Handle submit
 */
const handleSubmit = async (row) => {
  const confirmed = await dialogs.confirm('Submit this shipment plan?')
  
  if (confirmed) {
    try {
      // Save first
      await handleSave(row)
      
      // Then submit
      const success = await submitShipmentPlanData(
        ACTION_TYPES.SUBMIT,
        row.soEtlLogDetailJournalID
      )
      
      if (success) {
        dialogs.showAlert('Submitted successfully', true)
        setTimeout(() => location.reload(), RELOAD_DELAY)
      } else {
        dialogs.showAlert('Submit failed', false)
      }
    } catch (error) {
      dialogs.showAlert('An error occurred', false)
    }
  }
}

/**
 * Handle bulk approve
 */
const handleBulkApprove = async () => {
  if (selectedItems.value.length === 0) {
    dialogs.showAlert('Please select items to approve', false)
    return
  }
  
  const confirmed = await dialogs.confirm(
    `Approve ${selectedItems.value.length} item(s)?`
  )
  
  if (confirmed) {
    const ids = selectedItems.value.map(item => item.soEtlLogDetailJournalID)
    
    try {
      const success = await submitShipmentPlanData(ACTION_TYPES.APPROVE, ids)
      
      if (success) {
        dialogs.showAlert('Approved successfully', true)
        setTimeout(() => location.reload(), RELOAD_DELAY)
      } else {
        dialogs.showAlert('Approve failed', false)
      }
    } catch (error) {
      dialogs.showAlert('An error occurred', false)
    }
  }
}

/**
 * Handle sort
 */
const handleSort = (column) => {
  if (filters.value.sortColumn === column) {
    filters.value.sortDirection = 
      filters.value.sortDirection === 'asc' ? 'desc' : 'asc'
  } else {
    filters.value.sortColumn = column
    filters.value.sortDirection = 'asc'
  }
  
  handleSearch()
}

// ============================================
// Lifecycle
// ============================================

onMounted(async () => {
  await permissions.loadPermissions()
  await handleSearch()
})
</script>

<template>
  <div class="shipment-plan-page">
    <!-- Filters -->
    <ShipmentFilters
      v-model:filters="filters"
      @search="handleSearch"
      @clear="handleClearFilters"
    />

    <!-- Bulk Actions -->
    <VCard class="my-2">
      <VCardText class="pa-2">
        <VBtn
          v-if="permissions.canApprove"
          :disabled="selectedItems.length === 0"
          color="primary"
          @click="handleBulkApprove"
        >
          Approve ({{ selectedItems.length }})
        </VBtn>
      </VCardText>
    </VCard>

    <!-- Table -->
    <ShipmentTable
      :data="paginatedData"
      :selected="selectedItems"
      :pagination="pagination"
      :permissions="permissions"
      :loading="isLoading"
      @update:selected="selectedItems = $event"
      @save="handleSave"
      @submit="handleSubmit"
      @sort="handleSort"
    />

    <!-- Dialogs -->
    <ShippingMarkDialog v-model="dialogs.shippingMark" />
    <TruckOrderDialog v-model="dialogs.truckOrder" />
    <RemarkDialog v-model="dialogs.remark" />
    <ConfirmDialog v-model="dialogs.confirm" />
    <AlertDialog v-model="dialogs.alert" />
  </div>
</template>

<style scoped>
.shipment-plan-page {
  padding: 1rem;
}
</style>
```

#### Day 3: Add TypeScript Types

**File**: `types/shipment.ts`

```typescript
/**
 * Shipment plan data structure
 */
export interface ShipmentPlan {
  soEtlLogDetailJournalID: number
  journalID: number
  salesOrderNo: string
  sapInvoiceNo: string
  poNo: string
  payerName: string
  shippingUserCode: string
  shippingUserName: string
  shipperName: string
  shipperLocation: string
  shipperMark: string
  shipperConditions: string
  shippingMarkActive: boolean
  shippingEndUser: string
  consignee: string
  itemCode: string
  itemName: string
  catId: string
  lot: string
  quantity: number
  freightForwarder: string
  carrier: string
  vesselName: string
  voy: string
  truck: string
  truckReservingNumber: string
  truckFee: string
  doEx: string
  country: string
  loadingDate: string | null
  etd: string | null
  eta: string | null
  saL_Remarks: string
  wH_Remarks: string
  loG_Remarks: string
  statusId: number
  statusText: string
  inspStatusId: number
  inspStatusText: string
  logStatusId: number
  logStatusText: string
  salStatusId: number
  salStatusText: string
  whStatusId: number
  whStatusText: string
  csLfStatusId: number
  csLfStatusText: string
  checkSheetTypeID: number
  checkSheetTypeName: string
  updatedBy: string
  updatedDate: string
  // File data
  getSOFileData: FileData[]
  getPOFileData: FileData[]
  getCOAFileData: FileData[]
  getTruckOrderFileData: FileData[]
  getDeliveryNoteFileData: FileData[]
}

/**
 * File data structure
 */
export interface FileData {
  fileName: string
  fileUrl: string
  uploadDate: string
}

/**
 * Filter options
 */
export interface ShipmentFilters {
  statusId: string
  eta: string
  etd: string
  etdDateFrom: string
  etdDateTo: string
  salesOrderNo: string
  payerName: string
  itemName: string
  lot: string
  sortColumn: string
  sortDirection: 'asc' | 'desc' | ''
}

/**
 * Pagination config
 */
export interface PaginationConfig {
  currentPage: number
  itemsPerPage: number
  selectedItemsPerPage: number | 'All'
}

/**
 * Permission structure
 */
export interface Permission {
  canVisible: boolean
  canExecute: boolean
}

/**
 * API response structure
 */
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}
```

#### Day 4: Add Unit Tests

**File**: `__tests__/shipment/useShipmentState.test.js`

```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { useShipmentState } from '@/composables/shipment/useShipmentState'

describe('useShipmentState', () => {
  let state

  beforeEach(() => {
    // Clear sessionStorage
    sessionStorage.clear()
    
    // Initialize state
    state = useShipmentState()
  })

  describe('filters', () => {
    it('should initialize with default values', () => {
      expect(state.filters.value).toEqual({
        statusId: '',
        eta: '',
        etd: '',
        salesOrderNo: '',
        payerName: '',
        itemName: '',
        lot: '',
        sortColumn: '',
        sortDirection: ''
      })
    })

    it('should load from sessionStorage if available', () => {
      sessionStorage.setItem('StatusIdSearchProductionFilter', '201')
      const newState = useShipmentState()
      
      expect(newState.filters.value.statusId).toBe('201')
    })
  })

  describe('pagination', () => {
    it('should calculate total pages correctly', () => {
      state.searchPlanData.value = new Array(25).fill({})
      state.pagination.value.itemsPerPage = 10
      
      expect(state.totalPages.value).toBe(3)
    })

    it('should paginate data correctly', () => {
      state.searchPlanData.value = new Array(25).fill({}).map((_, i) => ({ id: i }))
      state.pagination.value.currentPage = 2
      state.pagination.value.itemsPerPage = 10
      
      const paginated = state.paginatedData.value
      
      expect(paginated.length).toBe(10)
      expect(paginated[0].id).toBe(10)
    })
  })

  describe('resetFilters', () => {
    it('should reset all filters to default', () => {
      state.filters.value.statusId = '201'
      state.filters.value.salesOrderNo = 'SO123'
      
      state.resetFilters()
      
      expect(state.filters.value.statusId).toBe('')
      expect(state.filters.value.salesOrderNo).toBe('')
    })
  })

  describe('saveFilterHistory', () => {
    it('should save filters to sessionStorage', () => {
      state.filters.value.statusId = '201'
      state.filters.value.salesOrderNo = 'SO123'
      
      state.saveFilterHistory()
      
      expect(sessionStorage.getItem('StatusIdSearchProductionFilter')).toBe('201')
      expect(sessionStorage.getItem('SalesOrderNoSearchProductionFilter')).toBe('SO123')
    })
  })
})
```

**File**: `__tests__/shipment/validation.test.js`

```javascript
import { describe, it, expect } from 'vitest'
import { validateShipmentData, isDraftDisabled, isSubmitDisabled } from '@/utils/shipment/validation'

describe('Shipment Validation', () => {
  describe('validateShipmentData', () => {
    it('should pass validation with valid data', () => {
      const data = {
        sapInvoiceNo: 'SAP123',
        etd: '2024-01-15',
        eta: '2024-01-20'
      }
      
      const result = validateShipmentData(data)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should fail validation with missing required fields', () => {
      const data = {}
      
      const result = validateShipmentData(data)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('SAP Invoice No is required')
      expect(result.errors).toContain('ETD is required')
    })

    it('should fail validation when ETA is before ETD', () => {
      const data = {
        sapInvoiceNo: 'SAP123',
        etd: '2024-01-20',
        eta: '2024-01-15'
      }
      
      const result = validateShipmentData(data)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('ETA must be after ETD')
    })
  })

  describe('isDraftDisabled', () => {
    it('should return true when status is completed', () => {
      const product = { statusId: 207 }
      const permissions = { canVisible: true }
      
      expect(isDraftDisabled(product, permissions)).toBe(true)
    })

    it('should return true when no permission', () => {
      const product = { statusId: 201 }
      const permissions = { canVisible: false }
      
      expect(isDraftDisabled(product, permissions)).toBe(true)
    })
  })
})
```

#### Day 5: Documentation & Performance Optimization

**File**: `docs/SHIPMENT_PLAN.md`

```markdown
# Shipment Plan Module Documentation

## Overview

The Shipment Plan module manages the complete lifecycle of shipment orders from draft to completion.

## Architecture

### Directory Structure

```
shipment/
├── components/
│   ├── ShipmentTable.vue
│   ├── ShipmentTableRow.vue
│   ├── ShipmentFilters.vue
│   ├── cells/
│   │   ├── FileUploadCell.vue
│   │   ├── AutocompleteCell.vue
│   │   └── DatePickerCell.vue
│   └── dialogs/
│       ├── ShippingMarkDialog.vue
│       ├── TruckOrderDialog.vue
│       └── RemarkDialog.vue
├── composables/
│   ├── useShipmentState.js
│   ├── useShipmentAPI.js
│   ├── useFileUpload.js
│   └── useShipmentDialogs.js
└── utils/
    ├── validation.js
    ├── formatters.js
    ├── constants.js
    └── helpers.js
```

### State Management

State is managed through composables:

- `useShipmentState`: Manages local component state
- `useShipmentAPI`: Handles all API interactions
- `useFileUpload`: Manages file upload operations

### Data Flow

```
User Action → Component → Composable → API → Backend
                ↓
            Update State
                ↓
          Re-render UI
```

## Key Features

### 1. Search & Filter
- Multi-criteria search
- Date range filtering
- Sort by columns
- Persistent filter state

### 2. Bulk Operations
- Multi-select items
- Bulk approve
- Bulk reject
- Bulk send back

### 3. File Management
- SO attachment
- PO attachment
- COA upload
- Truck order
- Delivery note

### 4. Status Workflow
```
Draft → Pending SAL → Pending LOG → Pending WH → Approved → Completed
              ↓           ↓            ↓
           Rejected    Rejected     Rejected
```

## API Endpoints

### Search
```
POST /api/shipmentplan/searchplans
```

### Save
```
POST /api/shipmentplan/save
```

### Submit
```
POST /api/shipmentplan/submit/{type}
```

## Permissions

Permissions are context-based (Context ID: 7)

### Available Permissions
- `BTN_APPROVE`: Can approve shipments
- `BTN_REJECT`: Can reject shipments
- `BTN_SAVE_DRAFT`: Can save drafts
- `BTN_SUBMIT`: Can submit shipments
- `COL_*`: Column visibility/edit permissions

## Development Guide

### Adding New Features

1. Create composable if needed
2. Create component if needed
3. Add types to `types/shipment.ts`
4. Add tests
5. Update documentation

### Testing

```bash
# Run unit tests
npm run test:unit

# Run with coverage
npm run test:coverage

# Run specific test
npm run test shipment
```

### Performance Tips

1. Use `v-once` for static content
2. Use `v-memo` for expensive computations
3. Lazy load heavy components
4. Debounce search inputs
5. Use virtual scrolling for large lists

## Troubleshooting

### Common Issues

**Issue**: Table not updating after save
**Solution**: Check if `searchPlanData.value` is being mutated correctly

**Issue**: Permissions not working
**Solution**: Ensure `fetchUserPermissions()` is called in `onMounted`

**Issue**: Files not uploading
**Solution**: Check file size limits and file type restrictions

## Future Improvements

- [ ] Add export to Excel
- [ ] Add print preview
- [ ] Add email notifications
- [ ] Add activity log
- [ ] Add advanced search
- [ ] Add favorites/bookmarks
```

---

## 📝 Checklist

### Week 1: Foundation
- [ ] Create composables directory structure
- [ ] Extract `useShipmentState.js`
- [ ] Extract `useShipmentAPI.js`
- [ ] Extract `useFileUpload.js`
- [ ] Create `constants.js`
- [ ] Create `formatters.js`
- [ ] Test composables independently

### Week 2: Components
- [ ] Create `ShipmentTable.vue`
- [ ] Create `ShipmentTableRow.vue`
- [ ] Create `FileUploadCell.vue`
- [ ] Create `AutocompleteCell.vue`
- [ ] Create `DatePickerCell.vue`
- [ ] Create `RemarkDialog.vue`
- [ ] Test components in isolation

### Week 3: Utilities
- [ ] Create `validation.js`
- [ ] Create `helpers.js`
- [ ] Refactor duplicate code
- [ ] Add error handling
- [ ] Add loading states
- [ ] Add success/error messages

### Week 4: Integration
- [ ] Refactor main component
- [ ] Add TypeScript types
- [ ] Add unit tests (>80% coverage)
- [ ] Performance optimization
- [ ] Documentation
- [ ] Code review
- [ ] QA testing
- [ ] Deploy to staging

---

## 🎯 Success Metrics

### Code Quality
- [ ] Main component < 300 lines
- [ ] Functions < 50 lines
- [ ] Cyclomatic complexity < 10
- [ ] No duplicate code
- [ ] All linter rules pass

### Performance
- [ ] Initial load < 2s
- [ ] Search response < 500ms
- [ ] No memory leaks
- [ ] Smooth scrolling (60fps)

### Testing
- [ ] Unit test coverage > 80%
- [ ] All critical paths tested
- [ ] No console errors
- [ ] Works on all browsers

### Documentation
- [ ] README updated
- [ ] API documented
- [ ] Components documented
- [ ] Examples provided

---

## 🔄 Migration Strategy

### Phase 1: Parallel Development
- Keep old code intact
- Build new structure alongside
- Test thoroughly

### Phase 2: Gradual Migration
- Start with one feature
- Move to new structure
- Verify functionality

### Phase 3: Complete Switch
- Remove old code
- Update references
- Final testing

### Phase 4: Cleanup
- Remove unused files
- Update imports
- Optimize bundle

---

## 📚 Additional Resources

### Learning Materials
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue Testing Handbook](https://lmiller1990.github.io/vue-testing-handbook/)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)

### Tools
- [Vue DevTools](https://devtools.vuejs.org/)
- [Vitest](https://vitest.dev/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

---

## 👥 Team Responsibilities

### Developer
- Write code
- Write tests
- Create documentation
- Code review

### QA
- Test functionality
- Report bugs
- Verify fixes
- UAT approval

### Tech Lead
- Architecture review
- Code review approval
- Performance monitoring
- Final sign-off

---

## 📅 Timeline

| Week | Focus | Deliverables |
|------|-------|--------------|
| 1 | Foundation | Composables, Utils |
| 2 | Components | UI Components, Dialogs |
| 3 | Logic | Validation, Helpers |
| 4 | Polish | Tests, Docs, Deploy |

**Start Date**: [TBD]  
**End Date**: [TBD]  
**Review Date**: [TBD]

---

## ⚠️ Risks & Mitigation

### Risk 1: Breaking Changes
**Mitigation**: Parallel development, thorough testing

### Risk 2: Performance Regression
**Mitigation**: Performance monitoring, benchmarks

### Risk 3: Missing Requirements
**Mitigation**: Regular stakeholder check-ins

### Risk 4: Timeline Overrun
**Mitigation**: Prioritize critical features first

---

**Last Updated**: [Date]  
**Version**: 1.0  
**Status**: Draft


*** PS
---

## 🙇‍♂️ คำขอโทษจากผู้เขียนโค้ดในอดีต

ถึงผู้กล้าหาญที่เข้ามาอ่านไฟล์นี้  

ผู้เขียนขอแสดงความเสียใจอย่างสุดซึ้ง  
ต่อโค้ดจำนวนหลายพันบรรทัด  
ที่รวมเอา  
API, State, Business Logic, UI, Dialog, และอารมณ์ส่วนตัว  
ไว้ในไฟล์เดียวอย่างไม่เกรงใจใคร

ในขณะนั้น ผู้เขียนเชื่อว่า  
> “เดี๋ยวค่อย refactor ทีหลัง”

ซึ่งทีหลังนั้น… ก็คือคุณ 😅

ขอให้เอกสาร Refactoring Guide นี้  
เป็นแสงสว่างปลายอุโมงค์  
และขอให้คุณโชคดี มี unit test คุ้มครอง  
🙏
