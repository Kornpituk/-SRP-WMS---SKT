export const isDraftDisabled = (
  product,
  accountINSP,
  disabledStatus,
) => {
  return accountINSP ||
    disabledStatus(
      product.inspStatusId,
      product.logStatusId,
      product.salStatusId,
      product.whStatusId,
      product,
    )
}
export const isDraftLoading = (saveDraftLoading, product) => {
  saveDraftLoading &&
  product.soEtlLogDetailJournalID === saveDraftLoadingSOERow
}
  
export const isSubmitDisabled = (
  product,
  accountINSP,
  disabledStatus,
  disabledStatusWithOutAdminUser,
  canSubmit,
) => {
  return (
    accountINSP ||
    !canSubmit ||
    disabledStatus(
      product.inspStatusId,
      product.logStatusId,
      product.salStatusId,
      product.whStatusId,
      product,
    ) ||
    disabledStatusWithOutAdminUser(
      product.inspStatusId,
      product.logStatusId,
      product.salStatusId,
      product.whStatusId,
    )
  )
}

export const isSubmitLoading = (
  product,
  submitLoading,
  submitLoadingSOERow,
) => {
  return (
    submitLoading &&
    product.soEtlLogDetailJournalID === submitLoadingSOERow
  )
}

export const disabledStatus = (inspStatusId, logStatusId, salStatusId, whStatusId, dataRow) => {
  return !!(dataRow?.statusId === 206 || dataRow?.statusId === 207)
}

export const disabledStatusSaveDraft = (inspStatusId, logStatusId, salStatusId, whStatusId, dataRow) => {
  if(dataRow?.statusId === 206 || dataRow?.statusId === 207){
    return true
  // eslint-disable-next-line sonarjs/no-duplicated-branches
  }else if (department.value === 'Warehouse' && whStatusId === 404) {
    return true
  // eslint-disable-next-line sonarjs/no-duplicated-branches
  } else if (department.value === 'Logistic' && logStatusId === 504) {
    return true
  // eslint-disable-next-line sonarjs/no-duplicated-branches
  } else if (department.value === 'Inspection' && inspStatusId === 604) {
    return true
  // eslint-disable-next-line sonarjs/no-duplicated-branches
  } else if (department.value === 'Sale and Marketing' && salStatusId === 304) {
    return true
  } 

}

export const checkStatusInComplete = status => {
  return !!(status === 207 || status === 206)
}

export const disableShowDataByDepartment = userData => {

  if (userData) {
    return !(userData.departmentId === '007' ||
      userData.departmentId === '008' ||
      userData.departmentId === '010' ||
      userData.departmentId === '009')
  }
}

export const checkStatusBeforeAvtion = sataus => {
  if (sataus === 205) {
    return true
  } else if (sataus === 206) {
    return false
  } else {
    return false
  }
}

//-- Truck

export const checkBgTruck = truck => {
  if (truck === 'BTS') {
    return 'bg-red-lighten-4'
  } else if (truck === 'LCL') {
    return 'bg-warning'
  }
}

// validate Btn
