/**
 * Status Helper Utilities
 * Extracted from indexTIE.vue
 */

/**
 * Status configuration array
 * Maps status names to IDs and colors
 */
export const itemsStatus = [
  { name: 'Cancel', id: 200, color: 'blue-grey' },
  { name: 'ETL Failed!', id: 201, color: 'deep-orange' },
  { name: 'Waiting for Shipping', id: 202, color: 'pink' },
  { name: 'Draft Shipping', id: 203, color: 'amber' },
  { name: 'In Submitting', id: 204, color: 'pink' },
  { name: 'Waiting for WH APVL', id: 205, color: 'brown' },
  { name: 'Shipping Rejected', id: 206, color: 'red' },
  { name: 'Shipping Completed', id: 207, color: 'green' },
  { name: 'All', id: 0, color: 'grey' },
]

/**
 * Get status ID by status name
 * @param {string} statusName - Name of the status
 * @returns {number|string} Status ID or empty string if not found
 */
export function getStatusIdByName(statusName) {
  const matchedItem = itemsStatus.find(item => item.name === statusName)
  
  return matchedItem ? matchedItem.id : ''
}

/**
 * Get color and display info for a status ID
 * @param {number} id - Status ID
 * @returns {Object} Object with color, message, text, and bgColor properties
 */
export function colorStatusWithId(id) {
  switch (id) {
  case 200:
    return { color: 'grey', message: 'orange-darken-1', text: 'Cancel', bgColor: '#E0E0E0' }
  case 201:
    return { color: 'deep-orange', message: 'green', text: 'ETL Failed!', bgColor: '#EF9A9A' }
  case 202:
    return { color: 'pink', message: 'pink-darken-4', text: 'Waiting for Shipping', bgColor: '#FCE4EC' }
  case 203:
    return { color: 'amber', message: 'purple', text: 'Draft Shipping', bgColor: '#FFC107' }

  case 302:
    return { color: 'pink', message: 'brown', text: 'Waiting for SAL Draft', bgColor: '#EFEBE9' }
  case 303:
    return { color: 'amber', message: 'green', text: 'SAL Draft Shipping', bgColor: '#E8F5E9' }
  case 304:
    return { color: 'teal', message: 'red', text: 'SAL Submitted', bgColor: '#FFEBEE' }

  case 402:
    return { color: 'pink', message: 'red', text: 'Waiting for WH Draft', bgColor: '#FFEBEE' }
  case 403:
    return { color: 'amber', message: 'red', text: 'WH Draft Shipping', bgColor: '#FFEBEE' }
  case 404:
    return { color: 'teal', message: 'red', text: 'WH Submitted', bgColor: '#FFEBEE' }

  case 502:
    return { color: 'pink', message: 'red', text: 'Waiting FOR LOG Draft', bgColor: '#FFEBEE' }
  case 503:
    return { color: 'amber', message: 'red', text: 'LOG Draft Shipping', bgColor: '#FFEBEE' }
  case 504:
    return { color: 'teal', message: 'red', text: 'LOG Submitted', bgColor: '#FFEBEE' }

  case 602:
    return { color: 'pink', message: 'red', text: 'Waiting FOR INSP Draft', bgColor: '#FFEBEE' }
  case 603:
    return { color: 'amber', message: 'red', text: 'INSP Draft Shipping', bgColor: '#FFEBEE' }
  case 604:
    return { color: 'teal', message: 'red', text: 'INSP Submitted', bgColor: '#FFEBEE' }

  case 1002:
    return { color: 'pink', message: 'red', text: 'Waiting for CS Draft', bgColor: '#FFEBEE' }
  case 1003:
    return { color: 'amber', message: 'red', text: 'CS1 Draft Shipping', bgColor: '#FFEBEE' }
  case 1004:
    return { color: 'amber', message: 'red', text: 'CS2 Draft Shipping', bgColor: '#FFEBEE' }
  case 1005:
    return { color: 'teal', message: 'red', text: 'CS Submitted', bgColor: '#FFEBEE' }

  case 1102:
    return { color: 'pink', message: 'red', text: 'Waiting for Draft', bgColor: '#FFEBEE' }
  case 1103:
    return { color: 'amber', message: 'red', text: 'Draft Shipping LF', bgColor: '#FFEBEE' }
  case 1104:
    return { color: 'amber', message: 'red', text: 'Waiting for Lorry/Flex APVL', bgColor: '#FFEBEE' }
  case 1105:
    return { color: 'teal', message: 'red', text: 'Lorry/Flex Submitted', bgColor: '#FFEBEE' }

  case 204:
    return { color: 'pink', message: 'red', text: 'In Submitting (SWL )', bgColor: '#FFEBEE' }
  case 205:
    return { color: 'brown', message: 'red', text: 'Waiting for WH APVL', bgColor: '#FFEBEE' }
  case 206:
    return { color: 'red', message: 'red', text: 'Shipping Rejected', bgColor: '#FFEBEE' }
  case 207:
    return { color: 'green', message: 'red', text: 'Shipping Completed', bgColor: '#FFEBEE' }
  default:
    return { color: 'grey', message: 'grey', text: '', bgColor: '#FFF3E0' }
  }
}

/**
 * Check if status should show action buttons
 * @param {number} status - Status ID
 * @returns {boolean} True if status is 205 (Waiting for WH APVL)
 */
export function checkStatusBeforeAction(status) {
  if (status === 205) {
    return true
  } else if (status === 206) {
    return false
  } else {
    return false
  }
}

/**
 * Check background color class for truck type
 * @param {string} truck - Truck type
 * @returns {string|undefined} CSS class for background color
 */
export function checkBgTruck(truck) {
  if (truck === 'BTS') {
    return 'bg-red-lighten-4'
  } else if (truck === 'LCL') {
    return 'bg-warning'
  }
}

/**
 * Mapping for checksheet type navigation
 */
export const checkSheetTypeNameMapping = {
  0: '',
  1: 'Drum',
  2: 'Drum',
  3: 'Flexi',
  4: 'Flexi',
}

/**
 * Navigate to checksheet page based on product status
 * @param {Object} product - Product object with statusId, journalID, etc.
 */
export function redirectBasedOnStatus(product) {
  const mainCheckSheetTypeName = product.checkSheetTypeID

  // ตรวจสอบว่า status มีใน mapping หรือไม่
  const subPath = checkSheetTypeNameMapping[mainCheckSheetTypeName] || "unknown-status"

  // ต่อ URL เดิมด้วย path ใหม่
  const currentPath = window.location.pathname // ดึง path ปัจจุบัน
  const newPath = `${currentPath}/${subPath}` // ต่อท้าย subPath

  const params = new URLSearchParams({
    journalIdParams: product.journalID,
    SoEtlLogDetailJournalIDParams: product.soEtlLogDetailJournalID,
    statusParams: product.statusId,
    salesOrderNoParams: product.salesOrderNo,
    itemCodeParams: product.itemCode,
    checkSheetTypeNameParams: product.checkSheetTypeName,
    csLfStatusIdParams: product.csLfStatusId,
  }).toString()

  sessionStorage.setItem('productDataSession', JSON.stringify(product))

  // 🔥 Redirect ไปยัง URL ใหม่พร้อม Query
  const finalPath = `${newPath}`

  window.location.href = finalPath
}

/**
 * Check if status is in completed state
 * @param {number} status - Status ID
 * @returns {boolean} True if status is 207 or 206
 */
export function checkStatusInComplete(status) {
  return !!(status === 207 || status === 206)
}
