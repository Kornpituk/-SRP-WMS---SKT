// Courier = 2 tabs เท่านั้น
getVisibleTabs('courier')  // → [PACKING_LIST, COMMERCIAL_INVOICE]
getVisibleTabs('ocean')    // → [ทุก 5 tabs]

export const SHIPPING_MODES = [
  { value: 'ocean', label: 'Ocean' },
  { value: 'air', label: 'Air' },
  { value: 'truck', label: 'Truck' },
  { value: 'courier', label: 'Courier' },
]

export const SHIPPING_MODE_CONFIG = {
  ocean: ['PACKING_LIST', 'COMMERCIAL_INVOICE', 'SHIPPING_INSTRUCTION', 'DELIVERY_ORDER', 'SHIPPING_NOTE'],
  air: ['PACKING_LIST', 'COMMERCIAL_INVOICE', 'SHIPPING_INSTRUCTION', 'DELIVERY_ORDER', 'SHIPPING_NOTE'],
  truck: ['PACKING_LIST', 'COMMERCIAL_INVOICE', 'SHIPPING_INSTRUCTION', 'DELIVERY_ORDER', 'SHIPPING_NOTE'],
  courier: ['PACKING_LIST', 'COMMERCIAL_INVOICE'],
}
