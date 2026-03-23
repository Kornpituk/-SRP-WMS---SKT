// ─── Constants ───────────────────────────────────────────────────────────────

export const PAYMENT_OPTIONS = ['T/T in advance', 'L/C', 'D/P', 'D/A']
export const PORT_OPTIONS    = ['LAEM CHABANG, THAILAND', 'HCM CITY, VIETNAM', 'HAIPHONG, VIETNAM', 'BANGKOK, THAILAND']
export const PACKAGE_TYPES   = ['250KG PLASTIC DRUM', '200KG PLASTIC DRUM', '1000KG IBC TANK', '25KG BAG']
export const UNIT_TYPES      = ['DRUM', 'CARTON', 'BAG']

export const FOOTER_FIELDS = [
  { key: 'packing',         label: 'PACKING :'           },
  { key: 'countryOfOrigin', label: 'COUNTRY OF ORIGIN :' },
  { key: 'makerName',       label: 'MAKER NAME :'        },
  { key: 'packaging',       label: 'PACKAGING :'         },
  { key: 'lotNo',           label: 'Lot No :'            },
  { key: 'hsCode',          label: 'HS CODE :'            },
]

// ─── #5 Master: Tare Weight per Package Type ─────────────────────────────────
// SOURCE: Replace with API call to your master data endpoint
export const TARE_WEIGHT_BY_PACKAGE = {
  '250KG PLASTIC DRUM': 2.00,
  '200KG PLASTIC DRUM': 1.80,
  '1000KG IBC TANK': 5.00,
  '25KG BAG': 0.50,
}

// ─── #6 Master: Tare Weight options for Pallets ──────────────────────────────
// SOURCE: Replace with API call to your master data endpoint
export const TARE_PALLET_MASTER = [
  { title: 'Plastic Pallet (3 kg)',    value: 3.00 },
  { title: 'Wood Pallet (5 kg)',       value: 5.00 },
  { title: 'Heavy Wood Pallet (6 kg)', value: 6.00 },
  { title: 'Export Pallet (4 kg)',     value: 4.00 },
]

// ─── #3 Payment → Due Date offset rules ──────────────────────────────────────
// base: which date to add offset to ('etd' or 'eta')
// offsetDays: number of days to add
export const DUE_DATE_RULES = {
  'T/T in advance': { base: 'etd', offsetDays: 0   },
  'L/C': { base: 'etd', offsetDays: 30  },
  'D/P': { base: 'eta', offsetDays: 0   },
  'D/A': { base: 'eta', offsetDays: 30  },
}

// ─── #4 HS Code Types ────────────────────────────────────────────────────────
export const HS_CODE_TYPES = [
  { title: '3906.90.20',    value: '3906.90.20' },
  { title: '3906.90.20',    value: '3906.90.20' },
  { title: '3906.90.20',    value: '3906.90.20' },
  { title: '3906.90.20',    value: '3906.90.20' },
]

// ─── #7 Print Display Fields ────────────────────────────────────────────────
export const PRINT_DISPLAY_FIELDS = {
  buyer: ['lotNo', 'productDescription', 'note'],
  customs: ['lotNo'],
}
