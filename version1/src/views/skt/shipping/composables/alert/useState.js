export const useStateAlert = () => {
  //------------------------------- alert
  const isDialogVisibleAlertDialog = ref(false)
  const wordForSubmit = ref('')
  const subWordForSubmit = ref('')
  const successDialAlert = ref(false)

  //------------------------------ Alert Loading
  const isDialogLoadingVisible = ref(false)
  const wordLoading = ref('')

  //------------------------------ Alert Confirm
  const confirmDialog2 = ref('')
  const typeConfirmDialog = ref('')
  const soEIdConfirmDialog = ref('')
  const productRowModel = ref(null)
  const checkConfirmBottonActive = ref(false)
  const checkCancelBottonActive = ref(false)
  const rowData = ref(null)

  const textAlertDialogFunction = (word, success) => {
    subWordForSubmit.value = ''
    wordForSubmit.value = word
    successDialAlert.value = success
    isDialogVisibleAlertDialog.value = true
  }

  const handleDialogLoading = type => {
    wordLoading.value = type
    isDialogLoadingVisible.value = true
  }

  const resetValueInCheckBottonConfirm = () => {
    checkConfirmBottonActive.value = false
    checkCancelBottonActive.value = false
  }


  return {
    isDialogVisibleAlertDialog,
    wordForSubmit,
    subWordForSubmit,
    successDialAlert,
    textAlertDialogFunction,

    isDialogLoadingVisible,
    wordLoading,
    handleDialogLoading,

    confirmDialog2,
    typeConfirmDialog,
    soEIdConfirmDialog,
    productRowModel,
    checkConfirmBottonActive,
    checkCancelBottonActive,
    rowData,
    resetValueInCheckBottonConfirm,
    
  }
}
