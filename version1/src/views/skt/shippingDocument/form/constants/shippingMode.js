// ============================================================================
// Shipping Mode — Constants & Tab Visibility
// ============================================================================
// Shipping mode ถูกเลือกตอน Create เท่านั้น → ไม่เปลี่ยนหลังสร้าง
//
// Mode → Tab mapping:
//   Ocean  = ทุก tab (5 tabs)
//   Air    = ทุก tab (5 tabs)
//   Truck  = ทุก tab (5 tabs)
//   Courier = แค่ 2 tabs (Packing List + Commercial Invoice)
// ============================================================================

import { TabKey } from '../types/shipDocument'

/** @readonly */
export const ShippingMode = Object.freeze({
  OCEAN: 'ocean',
  AIR: 'air',
  TRUCK: 'truck',
  COURIER: 'courier',
})

/** Shipping mode → label (for display) */
export const SHIPPING_MODE_LABELS = Object.freeze({
  [ShippingMode.OCEAN]: 'Ocean',
  [ShippingMode.AIR]: 'Air',
  [ShippingMode.TRUCK]: 'Truck',
  [ShippingMode.COURIER]: 'Courier',
})

/** All 5 tab keys in default order */
const ALL_TABS = [
  TabKey.PACKING_LIST,
  TabKey.COMMERCIAL_INVOICE,
  TabKey.CERTIFICATE_OF_ORIGIN,
  TabKey.PACKING_DECLARATION,
  TabKey.SHIPPING_PARTICULAR,
]

/** Courier = only Packing List + Commercial Invoice */
const COURIER_TABS = [
  TabKey.PACKING_LIST,
  TabKey.COMMERCIAL_INVOICE,
]

const TRUCK_TABS = [
  TabKey.PACKING_LIST,
  TabKey.COMMERCIAL_INVOICE,
  TabKey.SHIPPING_PARTICULAR,
]

/**
 * Get visible tab keys based on shipping mode.
 * @param {string} mode — ShippingMode value
 * @returns {string[]} — array of TabKey values
 */
export function getVisibleTabs(mode) {
  if (mode === ShippingMode.COURIER) {
    return COURIER_TABS
  }
  if (mode === ShippingMode.TRUCK) {
    return TRUCK_TABS
  }

  return ALL_TABS
}

/**
 * Check if a specific tab is visible for the given mode.
 * @param {string} mode — ShippingMode value
 * @param {string} tabKey — TabKey value
 * @returns {boolean}
 */
export function isTabVisible(mode, tabKey) {
  return getVisibleTabs(mode).includes(tabKey)
}
