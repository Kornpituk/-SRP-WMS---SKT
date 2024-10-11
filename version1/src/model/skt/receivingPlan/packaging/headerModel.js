const dataHeader = ref({
  rmInspectionRequestFormJournalId: null,
  productId: "",
  productName: "",
  supplierId: "",
  supplierName: "",
  tradeName: "",
  makerName: "",
  coAChecked: false,
  remark: "",
  note: "",
  limConditionDetail: "",
  sktLot: "",
  purchaseOrderNo: "",
  purchasingQuantityPcs: 0,
  actualCheck: true,
  inspStaffUpdateBy: "",
  inspStaffUpdateDate: "",
  whUpdateBy: "",
  whUpdateDate: "",
  receivedDate: "",
  isAccept: false,
  isReject: false,
  statusComments: "",
  packagingImg: null,
})


export const createDraftBody = dataHeader => {
  return {
    limConditionDetail: dataHeader.limConditionDetail,
    note: dataHeader.note,
    coAChecked: dataHeader.coAChecked,
    actualCheck: dataHeader.actualCheck,
  }
}

export const createModelReject = dataHeader => {
  return {
    statusComments: dataHeader.statusComments,
  }
}
