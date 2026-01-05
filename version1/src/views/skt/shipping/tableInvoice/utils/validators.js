/**
 * Validation and Helper Utilities
 * Extracted from indexTIE.vue
 */

/**
 * Get value or return default if value is null/undefined
 * @param {*} value - Value to check
 * @param {*} defaultValue - Default value to return if value is null/undefined
 * @returns {*} Value or default value
 */
export function getOrDefault(value, defaultValue = '') {
  return value ?? defaultValue
}

/**
 * Validation rules for text input
 * @type {Array<Function>}
 */
export const rules = [v => v.length <= 150 || 'Max 150 characters']
