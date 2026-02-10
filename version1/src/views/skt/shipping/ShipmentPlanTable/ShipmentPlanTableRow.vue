<template>
  <tr>
    <!-- Checkbox Cell -->
    <CheckboxCell
      :product="product"
      :selected-data-tables="selectedDataTables"
      :row-style="rowStyle"
      :show-checkbox="showCheckbox"
      :show-delete-button="showDeleteButton"
      @highlight="highlightRow"
      @delete="deleteRow"
      @select="selectRow"
    />
    
    <!-- Number Cell -->
    <NumberCell
      :row-number="rowNumber"
      :row-style="rowStyle"
      @highlight="highlightRow"
    />
    
    <!-- Status Cell -->
    <StatusCell
      :product="product"
      :row-style="rowStyle"
      @highlight="highlightRow"
    />
    
    <!-- Sale Order No Cell -->
    <SaleOrderNoCell
      v-if="showSaleOrderNo"
      :product="product"
      :row-style="rowStyle"
      :can-edit="canEditSaleOrderNo"
      @highlight="highlightRow"
    />
    
    <!-- SO Attachment Cell -->
    <SOAttachmentCell
      v-if="showSOAttachment"
      :product="product"
      :row-style="rowStyle"
      :can-edit="canEditSOAttachment"
      :type-file-input="typeFileInput"
      @highlight="highlightRow"
      @update-files="updateSOFiles"
    />
    
    <!-- PO No Cell -->
    <PONoCell
      v-if="showPONo"
      :product="product"
      :row-style="rowStyle"
      :can-edit="canEditPONo"
      @highlight="highlightRow"
      @update-po-no="updatePONo"
    />
    
    <!-- PO Attachment Cell -->
    <POAttachmentCell
      v-if="showPOAttachment"
      :product="product"
      :row-style="rowStyle"
      :can-edit="canEditPOAttachment"
      :type-file-input="typeFileInput"
      @highlight="highlightRow"
      @update-files="updatePOFiles"
    />
    
    <!-- SAP Invoice No Cell -->
    <SAPInvoiceNoCell
      v-if="showSAPInvoiceNo"
      :product="product"
      :row-style="rowStyle"
      :can-edit="canEditSAPInvoiceNo"
      @highlight="highlightRow"
      @update-sap-invoice="updateSAPInvoice"
    />
    
    <!-- ... เพิ่ม Cell Components อื่นๆ ตามต้องการ ... -->
  </tr>
</template>

<script setup>
import { defineProps, computed, defineEmits } from 'vue'

// Import Cell Components
import CheckboxCell from './cells/CheckboxCell.vue'
import NumberCell from './cells/NumberCell.vue'
import StatusCell from './cells/StatusCell.vue'
import SaleOrderNoCell from './cells/SaleOrderNoCell.vue'

import SOAttachmentCell from './cells/SOAttachmentCell.vue'
import PONoCell from './cells/PONoCell.vue'
import POAttachmentCell from './cells/POAttachmentCell.vue'
import SAPInvoiceNoCell from './cells/SAPInvoiceNoCell.vue'

// Import อื่นๆ...

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  dataTableNumberedToggle: {
    type: [Number, String],
    default: null,
  },
  dataTableColor: {
    type: String,
    default: '',
  },
  selectedDataTables: {
    type: Array,
    default: () => [],
  },
  userDataInfo: {
    type: Object,
    required: true,
  },
  statusPermission: {
    type: Object,
    required: true,
  },

  // เพิ่ม props อื่นๆ ที่จำเป็น
  canVisibleUserPermission: {
    type: Function,
    required: true,
  },
  typeFileInput: {
    type: String,
    default: '',
  },

  // Loading states
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
})

const emit = defineEmits([
  'selectRow',
  'highlightRow',
  'deleteRow',
  'saveDraft',
  'submitRow',
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
])

// Computed Properties
const rowNumber = computed(() => 
  (props.currentPage - 1) * 10 + props.index + 1,
)

const rowStyle = computed(() => ({
  backgroundColor: 
    props.dataTableNumberedToggle === props.product.soEtlLogDetailJournalID 
      ? props.dataTableColor 
      : isSelected.value ? '#E0F7FA' : '',
  borderTop: 
    props.dataTableNumberedToggle === props.product.soEtlLogDetailJournalID 
      ? '1px solid #BBDEFB' : '',
  borderBottom: 
    props.dataTableNumberedToggle === props.product.soEtlLogDetailJournalID 
      ? '1px solid #BBDEFB' : '',
}))

const isSelected = computed(() => 
  props.selectedDataTables.includes(props.product),
)

// Permission Computed Properties
const showCheckbox = computed(() => {
  return props.userDataInfo.id === '00023' || 
         props.userDataInfo.id === '00025' || 
         props.canVisibleUserPermission(props.statusPermission, 'BTN_APPROVE').canVisible
})

const showDeleteButton = computed(() => {
  return props.canVisibleUserPermission(props.statusPermission, 'BTN_SENDBACK').canVisible && 
         checkIfForBtnDeleteSOE(props.product) // ต้องมีฟังก์ชันนี้
})

const showSaleOrderNo = computed(() => 
  props.canVisibleUserPermission(props.statusPermission, 'COL_SALE_ORDER_NO').canVisible,
)

const canEditSaleOrderNo = computed(() => 
  props.canVisibleUserPermission(props.statusPermission, 'COL_SALE_ORDER_NO').canExecute,
)

const showSOAttachment = computed(() => 
  props.canVisibleUserPermission(props.statusPermission, 'COL_SO_ATTACHMENT').canVisible,
)

const canEditSOAttachment = computed(() => 
  props.canVisibleUserPermission(props.statusPermission, 'COL_SO_ATTACHMENT').canExecute,
)

const showPONo = computed(() => 
  props.canVisibleUserPermission(props.statusPermission, 'COL_SAP_INVOICE_NO').canVisible,
)

const canEditPONo = computed(() => 
  props.canVisibleUserPermission(props.statusPermission, 'COL_SAP_INVOICE_NO').canExecute,
)

// Event Handlers
const highlightRow = () => 
  emit('highlightRow', props.product.soEtlLogDetailJournalID)

const deleteRow = () => 
  emit('deleteRow', 'delete', props.product.soEtlLogDetailJournalID, props.product)

const selectRow = value => 
  emit('selectRow', value)

const updateSOFiles = files => 
  emit('updateFileSO', files, props.product.soEtlLogDetailJournalID)

const updatePOFiles = files => 
  emit('updateFilePO', files, props.product.soEtlLogDetailJournalID)

const updatePONo = value => 
  emit('updateField', { field: 'poNo', value, id: props.product.soEtlLogDetailJournalID })

const updateSAPInvoice = value => 
  emit('updateField', { field: 'sapInvoiceNo', value, id: props.product.soEtlLogDetailJournalID })

// ฟังก์ชัน helper (ต้องนำเข้าจาก parent หรือกำหนดที่นี่)
const checkIfForBtnDeleteSOE = product => {
  // โลจิกการตรวจสอบ
  return true // ตัวอย่าง
}
</script>
