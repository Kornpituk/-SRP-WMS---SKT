export const INFO_LEFT = [
  { key: 'invoiceInSap',  label: 'Invoice in SAP'  },
  { key: 'payerName',     label: 'Payer Name'       },
  { key: 'item',          label: 'Item'             },
  { key: 'termOfPricing', label: 'Term Of Pricing'  },
  { key: 'etd',           label: 'ETD'              },
]
 
export const INFO_RIGHT = [
  { key: 'invoice',      label: 'Invoice'       },
  { key: 'consignee',    label: 'Consignee'     },
  { key: 'qty',          label: 'Qty'           },
  { key: 'shippingMode', label: 'Shipping Mode' },
  { key: 'destination',  label: 'Destination'   },
]
 
/** ทุก field ราคาที่รวมเป็น total */
export const PRICE_FIELDS = [
  'forwarderPrice',
  'customsOverTimePrice',
  'courierPrice',
  'truckingPrice',
  'storagePrice',
  'insurancePrice',
  'ftaFormPrice',
  'shippingPrice',
  'otherPrice',
]
 
/**
 * Dropdown items
 * TODO: replace with useMasterData() when API is ready
 */
export const SALE_PERSON_ITEMS = [{ title: 'Pisud', value: 'Pisud' }]
export const FORWARDER_ITEMS   = [{ title: 'TVL',   value: 'TVL'   }, { title: 'DHL', value: 'DHL' }]
export const COURIER_ITEMS     = [{ title: 'DHL',   value: 'DHL'   }, { title: 'FedEx', value: 'FedEx' }]
export const TRUCKING_ITEMS    = [{ title: 'LEO',   value: 'LEO'   }]
