/**
 * Status and Permissions Composable
 * Manages status checking and user permissions
 */
import { ref } from 'vue'

export function useStatusAndPermissions() {
  // =============== Account/Role States ===============
  const accountAmin = ref(false)
  const accountViewerKK = ref(false)
  const accountINSP = ref(false)
  const accountSALLOG = ref(false)
  const accountSAL = ref(false)
  const accountLOG = ref(false)
  const accountWH = ref(false)
  const accountWHSub = ref(false)
  const accountAll = ref(false)
  
  const statusPermission = ref(-1)
  
  // =============== Status Checking Methods ===============
  
  /**
   * Check if action should be disabled based on status
   */
  function disabledStatus(inspStatusId, logStatusId, salStatusId, whStatusId, dataRow) {
    return !!(dataRow?.statusId === 206 || dataRow?.statusId === 207)
  }
  
  /**
   * Check if save draft should be disabled
   */
  function disabledStatusSaveDraft(inspStatusId, logStatusId, salStatusId, whStatusId, dataRow) {
    if (dataRow?.statusId === 206 || dataRow?.statusId === 207) {
      return true
    // eslint-disable-next-line sonarjs/no-duplicated-branches
    } else if (department.value === 'Warehouse' && whStatusId === 404) {
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
    
    return false
  }
  
  /**
   * Check if status is complete (rejected or completed)
   */
  function checkStatusInComplete(status) {
    return !!(status === 207 || status === 206)
  }
  
  /**
   * Check status before action (for approve/reject)
   */
  function checkStatusBeforeAction(status) {
    if (status === 205) {
      return true
    } else if (status === 206) {
      return false
    } else {
      return false
    }
  }
  
  /**
   * Disable show table based on user ID
   */
  function disShowTableShipmentPLand(userDataInfo) {
    return !['00011',
      '00012',
      '00013',
      '00014',
      '00015',
      '00029',
      '00030', 
      '00031',
      '00033',
      '00032',
      '00034',
      '00044',
      '00045'].includes(userDataInfo.value.id)
  }
  
  /**
   * Disable show data by department
   */
  function disableShowDataByDepartment(userData) {
    if (userData?.value) {
      return !(userData.value.departmentId === '007' ||
        userData.value.departmentId === '008' ||
        userData.value.departmentId === '010' ||
        userData.value.departmentId === '009')
    }
    
    return false
  }
  
  /**
   * Switch account roles based on rolestring
   */
  function switchAccount(role) {
    // Reset all accounts
    accountAmin.value = false
    accountViewerKK.value = false
    accountINSP.value = false
    accountSALLOG.value = false
    accountSAL.value = false
    accountLOG.value = false
    accountWH.value = false
    accountWHSub.value = false
    accountAll.value = false
    
    // Set specific account based on role
    if (role === 'admin') {
      accountAmin.value = true
    } else if (role === 'ViewerKK') {
      accountViewerKK.value = true
    } else if (role === 'INSP') {
      accountINSP.value = true
    } else if (role === 'SALLOG') {
      accountSALLOG.value = true
    } else if (role === 'SAL') {
      accountSAL.value = true
    } else if (role === 'LOG') {
      accountLOG.value = true
    } else if (role === 'WH') {
      accountWH.value = true
    } else if (role === 'WHSub') {
      accountWHSub.value = true
    } else if (role === 'All') {
      accountAll.value = true
    }
  }
  
  /**
   * Check if print PDF checksheet should be disabled
   */
  function didabledPrintPDFCheckSheet(statusId) {
    return !(statusId === 1003 || statusId === 1004 || statusId === 1005 || 
             statusId === 1103 || statusId === 1104 || statusId === 1105)
  }

  /** Check If for btn Delete SOE */
  function checkIfForBtnDeleteSOE(product) {
    if(product.statusId === 202 || product.statusId === 203 || product.statusId === 204){
      return product.csLfStatusId === 1002 || product.csLfStatusId === 1003 || product.csLfStatusId === 1103 || product.csLfStatusId === 1104
    }else{
      return false
    }
  }
  
  return {
    // Account States
    accountAmin,
    accountViewerKK,
    accountINSP,
    accountSALLOG,
    accountSAL,
    accountLOG,
    accountWH,
    accountWHSub,
    accountAll,
    statusPermission,
    
    // Methods
    disabledStatus,
    disabledStatusSaveDraft,
    checkStatusInComplete,
    checkStatusBeforeAction,
    disShowTableShipmentPLand,
    disableShowDataByDepartment,
    switchAccount,
    didabledPrintPDFCheckSheet,
    checkIfForBtnDeleteSOE,
  }
}
