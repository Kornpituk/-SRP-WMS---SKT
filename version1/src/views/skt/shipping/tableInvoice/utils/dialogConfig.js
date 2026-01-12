/**
 * Dialog Configuration
 * Extracted from indexTIE.vue
 */

/**
 * Dialog configuration for different dialog types
 * Maps dialog type to title, type, sapIn value, and button type
 */
export const dialogConfig = {
  ShipCon: { title: 'Shipping Condition', type: 'ShipCon', sapIn: '', btn: 'nonPrint' },
  ShipMark: { title: 'Shipping Mark', type: 'ShipMark', sapIn: 'TIX2406001', btn: 'nonPrint' },
  ShipMC: { title: 'Shipping Mark Con', type: 'ShipMC', sapIn: 'TIX2406001', btn: 'twinPrint' },
  Lot: { title: 'Lot', type: 'Lot', sapIn: 'TIX2406001', btn: 'nonPrint' },
  ShipMarkPrint: { title: 'Shipping Mark', type: 'ShipMark', sapIn: 'TIX240602', btn: 'print' },
  ShipConPrint: { title: 'Shipping Condition', type: 'ShipCon', sapIn: 'TIX240602', btn: 'print' },
  RemarkWH: { title: 'Remark WH', type: 'RemarkWH', sapIn: 'TIX2406001', btn: 'nonPrint' },
  RemarkSAL: { title: 'Remark SAL', type: 'RemarkSAL', sapIn: 'TIX2406001', btn: 'nonPrint' },
  RemarkLOG: { title: 'Remark LOG', type: 'RemarkLOG', sapIn: 'TIX2406001', btn: 'nonPrint' },
}

/**
 * Truck items configuration
 */
export const itemsTruck = [
  'LEO',
  'BTS',
  'LCL',
]
