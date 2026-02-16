export const useTextAreanaDialog = () => {
  const dialogDataTextArea = ref('')
  const dialogData2TextArea = ref('')
  const dialogVisible = ref(false)
  const dialogVisibleTextarea = ref(false)
  const dialogRemark = ref('')
 
  // --- define Model
 
  const shippingCondition = ref('')
  const typeDialogTextArea = ref('')
 
  const sapInValueView = ref('')
  const lotValueView = ref('')
  const typeDialogView = ref('')
  const typeBtnView = ref('')
  const titleDialogView = ref('')
  const soEIdModel = ref('')
  const indexDataDialogTextArea = ref('')
  const activeShipMarkModel = ref('')
  const disabledModel = ref(false)

  return {
    dialogDataTextArea,
    dialogData2TextArea,
    dialogVisible,
    dialogVisibleTextarea,
    dialogRemark,
    shippingCondition,
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
  }
}
