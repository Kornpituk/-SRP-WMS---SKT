/**
 * Dialog Management Composable
 * Manages all dialog states and operations
 */
import { ref } from 'vue'
import { dialogConfig as dialogConfigImport } from '../utils/dialogConfig'

export function useDialog() {
  // =============== Dialog States ===============
  const dialogVisible = ref(false)
  const dialogVisibleTextarea = ref(false)
  const dialogDataTextArea = ref('')
  const dialogData2TextArea = ref('')
  const dialogRemark = ref('')
  
  // =============== Dialog Data ===============
  const typeDialogTextArea = ref('')
  const sapInValueView = ref('')
  const lotValueView = ref('')
  const typeDialogView = ref('')
  const typeBtnView = ref('')
  const titleDialogView = ref('')
  const soEIdModel = ref('')
  const indexDataDialogTextArea = ref('')
  const activeShipMarkModel = ref('')
  const disabledModel =ref(false)
  const dataRowForUse = ref()
  
  // =============== Alert Dialog ===============
  const isDialogVisibleAlertDialog = ref(false)
  const wordForSubmit = ref('')
  const subWordForSubmit = ref('')
  const successDialAlert = ref(false)
  
  // =============== Loading Dialog ===============
  const isDialogLoadingVisible = ref(false)
  const wordLoading = ref('')
  
  // =============== Confirmation Dialog ===============
  const confirmDialog2 = ref('')
  const typeConfirmDialog = ref('')
  const soEIdConfirmDialog = ref('')
  const productRowModel = ref(null)
  const checkConfirmBottonActive = ref(false)
  const checkCancelBottonActive = ref(false)
  const rowData = ref(null)
  
  // =============== SAP Invoice Dialog ===============
  const isDialogSapInV = ref(false)
  const dataRowDailog = ref(null)
  const typeSap = ref(null)
  const soEIdSap = ref(null)
  
  // =============== Comment Dialog ===============
  const isDialogVisibleCommentDialog = ref(false)
  const statusCommnetValue = ref('')
  
  // =============== Action Dialog ===============
  const actionIsDialogVisible = ref(false)
  const prouctRowAction = ref()
  
  // =============== Truck Order Dialog ===============
  const isDialogVisiblePrintTruck = ref(false)
  const saleOrderNo = ref('')
  
  // =============== Methods ===============
  
  /**
   * Open text area dialog
   */
  function textAreaDialogActive(type, data, index) {
    typeDialogTextArea.value = type
    indexDataDialogTextArea.value = index
    
    const config = dialogConfigImport[type]
    if (config) {
      titleDialogView.value = config.title
      typeDialogView.value = config.type
      sapInValueView.value = config.sapIn
      typeBtnView.value = config.btn
      dialogDataTextArea.value = data
    }
    
    dialogVisible.value = true
  }
  
  /**
   * Open remark text area dialog
   */
  function textAreaRemarkDialogActive(type, data, soEId, disabledRow, disPermiss) {
    typeDialogTextArea.value = type
    soEIdModel.value = soEId
    titleDialogView.value = 'Shipping Mark Con'
    dialogRemark.value = data
    dialogVisibleTextarea.value = true
    
    const disabledCanExecute = ref(false)
    if (disPermiss) {
      disabledCanExecute.value = disabledRow ? true : false
    } else {
      disabledCanExecute.value = true
    }
    
    disabledModel.value = disabledCanExecute.value
  }
  
  /**
   * Open shipping mark/condition dialog
   */
  function textAreaShipDialogActive2(type, data, data2, index, soEId, activeShipMark, dataProduct, disabledRow, disabledPermission) {
    typeDialogTextArea.value = type
    indexDataDialogTextArea.value = index
    soEIdModel.value = soEId
    titleDialogView.value = 'Shipping Mark Con'
    typeDialogView.value = 'ShipMC'
    dialogDataTextArea.value = data
    dialogData2TextArea.value = data2
    activeShipMarkModel.value = activeShipMark
    dataRowForUse.value = dataProduct
    dialogVisible.value = true
    
    const disabledCanExecute = ref(false)
    if (disabledPermission) {
      disabledCanExecute.value = disabledRow ? true : false
    } else {
      disabledCanExecute.value = true
    }
    
    disabledModel.value = disabledCanExecute.value
  }
  
  /**
   * Show alert dialog
   */
  function textAlertDialogFunction(word, success) {
    subWordForSubmit.value = ''
    wordForSubmit.value = word
    successDialAlert.value = success
    isDialogVisibleAlertDialog.value = true
  }
  
  /**
   * Handle loading dialog
   */
  function handleDialogLoading(type) {
    wordLoading.value = type
    isDialogLoadingVisible.value = true
  }
  
  /**
   * Reset confirmation button states
   */
  function resetValueInCheckBottonConfirm() {
    checkConfirmBottonActive.value = false
    checkCancelBottonActive.value = false
  }
  
  /**
   * Open confirmation dialog
   */
  function openConfirmDialog(type, SoEId, productRow) {
    productRowModel.value = productRow
    resetValueInCheckBottonConfirm()
    
    if (type === 'submit') {
      wordForSubmit.value = type
      typeConfirmDialog.value = type
      soEIdConfirmDialog.value = SoEId
    } else if (type === 'back') {
      wordForSubmit.value = "SEND BACK"
      typeConfirmDialog.value = type
      soEIdConfirmDialog.value = SoEId
    } else if (type === 'check sap invoice no') {
      rowData.value = productRow
      wordForSubmit.value = "Confirm sap invoice no"
      typeConfirmDialog.value = type
      soEIdConfirmDialog.value = SoEId
    }
    
    confirmDialog2.value.openDialog()
  }
  
  /**
   * Handle dialog cancel
   */
  function handleCancel() {
    checkCancelBottonActive.value = true
  }
  
  /**
   * Open action dialog
   */
  function actionBtn(product) {
    prouctRowAction.value = product
    actionIsDialogVisible.value = true
  }
  
  return {
    // Dialog States
    dialogVisible,
    dialogVisibleTextarea,
    dialogDataTextArea,
    dialogData2TextArea,
    dialogRemark,
    typeDialogTextArea,
    sapInValueView,
    lotValueView,
    typeDialogView,
    typeBtnView,
    titleDialogView,
    soEIdModel,
    indexDataDialogTextArea,
    activeShipMarkModel,
    disabledModel,
    dataRowForUse,
    
    // Alert Dialog
    isDialogVisibleAlertDialog,
    wordForSubmit,
    subWordForSubmit,
    successDialAlert,
    
    // Loading Dialog
    isDialogLoadingVisible,
    wordLoading,
    
    // Confirmation Dialog
    confirmDialog2,
    typeConfirmDialog,
    soEIdConfirmDialog,
    productRowModel,
    checkConfirmBottonActive,
    checkCancelBottonActive,
    rowData,
    
    // SAP Invoice Dialog
    isDialogSapInV,
    dataRowDailog,
    typeSap,
    soEIdSap,
    
    // Comment Dialog
    isDialogVisibleCommentDialog,
    statusCommnetValue,
    
    // Action Dialog
    actionIsDialogVisible,
    prouctRowAction,
    
    // Truck Order Dialog
    isDialogVisiblePrintTruck,
    saleOrderNo,
    
    // Methods
    textAreaDialogActive,
    textAreaRemarkDialogActive,
    textAreaShipDialogActive2,
    textAlertDialogFunction,
    handleDialogLoading,
    resetValueInCheckBottonConfirm,
    openConfirmDialog,
    handleCancel,
    actionBtn,
  }
}
