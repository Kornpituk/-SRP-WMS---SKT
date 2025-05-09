export function mapInspectionHeader(inspData) {
  const fields = {
    sktName: 'productName',
    sktId: 'sktLot',
    itemCode: 'productId',
    supplierName: 'supplierName',
    tradeNames: 'tradeName',
    ManufacturerName: 'makerName',
    receivedDate: 'receivedDate',
    remark: 'remark',
    note: 'note',
    details: 'limConditionDetail',
    spacialCase: 'spacialCase',
    updateByStaffWH: 'whStaff',
    updateBySuperWH: 'whSupervisor',
    updateByStaffInsp: 'inspStaff',
    updateBySuperInsp: 'inspSupervisor',
    lastUpdatedStaffWH: 'whStaffUpdatedDate',
    lastUpdatedSuperWH: 'whSupervisorDate',
    lastUpdatedStaffInsp: 'inspStaffUpdatedDate',
    lastUpdatedSuperInsp: 'inspSupervisorDate',
    remarkReject: 'statusComments',
    isAccept: 'isAccept',
    isReject: 'isReject',
  }
  
  return Object.fromEntries(
    Object.entries(fields).map(([k, v]) => [k, inspData?.[v] ?? '']),
  )
}

export function success(data, isReject = false, isAccept = false) {
  return { success: true, data, isReject, isAccept }
}
    
export function failure(message) {
  return { success: false, message }
}

// composables/useValidation.js
export const checkHasEmptyFields = fields => {
  return fields.some(field => field.isEmpty)
}
