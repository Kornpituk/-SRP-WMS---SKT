/**
 * Date and Number Formatting Utilities
 * Extracted from indexTIE.vue
 */

/**
 * Convert date from DD/MM/YYYY to YYYY-MM-DD format for saving
 * @param {string} date - Date string in DD/MM/YYYY format
 * @returns {string|null} Date string in YYYY-MM-DD format or null
 */
export function formatDateSave(date) {
  if (!date) return null // หากค่าว่างให้คืน null

  const [day, month, year] = date.split('/') // แยกวันที่ตามรูปแบบ dd/mm/yyyy
  if (!day || !month || !year) return null // ตรวจสอบว่าแยกข้อมูลสำเร็จ

  // สร้างวันที่ในรูปแบบ yyyy-mm-dd
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/**
 * Convert date from DD/MM/YYYY to YYYY-MM-DD format
 * @param {string} dateString - Date string in DD/MM/YYYY format
 * @returns {string} Date string in YYYY-MM-DD format or error message
 */
export function convertDateFormat(dateString) {
  const parts = dateString.split("/") // แยกส่วนของวันที่
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts // จัดเรียงใหม่

    return `${yyyy}-${mm}-${dd}`
  }

  return "Invalid Date Format" // กรณีรูปแบบไม่ถูกต้อง
}

/**
 * Get current date formatted as DD/MM/YYYY
 * @returns {string} Current date in DD/MM/YYYY format
 */
export function getCurrentDateFormatted() {
  const today = new Date()
  const day = String(today.getDate()).padStart(2, '0')
  const month = String(today.getMonth() + 1).padStart(2, '0') // เดือนเริ่มที่ 0 ต้อง +1
  const year = today.getFullYear()

  return `${day}/${month}/${year}`
}

/**
 * Format date object/string to DD/MM/YYYY format
 * @param {Date|string} dateString - Date object or ISO string
 * @returns {string|null} Formatted date string or null
 */
export function formatToDate(dateString) {
  if (!dateString) return null // จัดการค่าว่าง
  const date = new Date(dateString)
  if (isNaN(date)) return null // จัดการค่าที่ไม่ใช่วันที่
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

/**
 * Format date for display (alternative implementation)
 * @param {Date|string} date - Date object or string
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()

  return `${day}/${month}/${year}`
}

/**
 * Convert DD/MM/YYYY to ISO 8601 format
 * @param {string} dateStr - Date string in DD/MM/YYYY format
 * @returns {string} ISO 8601 date string
 */
export function convertToISO8601(dateStr) {
  // แยกค่าจากรูปแบบ "DD/MM/YYYY"
  const [day, month, year] = dateStr.split('/')
  const date = new Date(`${year}-${month}-${day}T00:00:00.000Z`)

  return date.toISOString() || ''
}

/**
 * Convert ISO date string to DD/MM/YYYY format
 * @param {string} isoDateStr - ISO date string
 * @returns {string} Date in DD/MM/YYYY format
 */
export function convertToDDMMYYYY(isoDateStr) {
  const date = new Date(isoDateStr)
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const year = date.getUTCFullYear()

  return `${day}/${month}/${year}` || ''
}

/**
 * Format decimal number based on config
 * @param {number} decimal - Number to format
 * @returns {number} Formatted number (ceiling if config is true, original otherwise)
 */
export function formatDecimal(decimal) {
  const configsShowDigit = localStorage.getItem('configsShowDigit')
  if (configsShowDigit == 'true') {
    return Math.ceil(decimal)
  } else {
    return decimal
  }
}
