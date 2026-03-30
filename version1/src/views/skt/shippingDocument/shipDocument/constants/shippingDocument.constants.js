// ============================================================
// ENUMS
// ============================================================

export const ShippingDocTab = Object.freeze({
  LIST: 'LIST',
  VOID: 'VOID',
  EXPENSE: 'EXPENSE',
})

export const ShippingDocStatus = Object.freeze({
  WAITING: 'Waiting',
  DRAFT: 'Draft',
  COMPLETED: 'Completed',
  VOID: 'Void',
})

// ============================================================
// TAB CONFIG
// ============================================================

export const TAB_CONFIG = [
  { key: ShippingDocTab.LIST,    label: 'List of Shipping Doc', icon: 'mdi-file-document-multiple-outline' },
  { key: ShippingDocTab.VOID,    label: 'Void of Document',     icon: 'mdi-file-cancel-outline'           },
  { key: ShippingDocTab.EXPENSE, label: 'Shipping Expense',     icon: 'mdi-cash-multiple'                 },
]

// ============================================================
// STATUS CONFIG (for badge color)
// ============================================================

export const STATUS_CONFIG = {
  [ShippingDocStatus.WAITING]: { color: 'warning', textColor: 'warning' },
  [ShippingDocStatus.DRAFT]: { color: 'warning', textColor: 'warning' },
  [ShippingDocStatus.COMPLETED]: { color: 'success', textColor: 'success' },
  [ShippingDocStatus.VOID]: { color: 'error',   textColor: 'error'   },
}

// ============================================================
// SELECT OPTIONS
// ============================================================

export const STATUS_OPTIONS = [
  { title: 'All',                        value: 'All'                        },
  { title: ShippingDocStatus.WAITING,    value: ShippingDocStatus.WAITING    },
  { title: ShippingDocStatus.DRAFT,      value: ShippingDocStatus.DRAFT      },
  { title: ShippingDocStatus.COMPLETED,  value: ShippingDocStatus.COMPLETED  },
  { title: ShippingDocStatus.VOID,       value: ShippingDocStatus.VOID       },
]

export const SHIPPING_MODE_OPTIONS = [
  { title: 'All',   value: '' },
  { title: 'SEA',   value: 'SEA'   },
  { title: 'AIR',   value: 'AIR'   },
  { title: 'TRUCK', value: 'TRUCK' },
]

export const PAGE_SIZE_OPTIONS = [10, 25, 50]

// ============================================================
// TABLE HEADERS — ShippingDoc (Tab LIST & VOID)
// ============================================================

export const SHIPPING_DOC_HEADERS = [
  { title: 'No.',             key: 'no',           sortable: false, align: 'center', maxWidth: 6  },
  { title: 'Status',          key: 'status',       sortable: true,                  minWidth: 12 },
  { title: 'Invoice In SAP',  key: 'invoiceInSAP', sortable: true,                  minWidth: 16 },
  { title: 'Invoice',         key: 'invoice',      sortable: true,                  minWidth: 14 },
  { title: 'Payer Name',      key: 'payerName',    sortable: true,                  minWidth: 20 },
  { title: 'Consignee',       key: 'consignee',    sortable: true,                  minWidth: 20 },
  { title: 'Item',            key: 'item',         sortable: true                               },
  { title: 'Qty',             key: 'qty',          sortable: true,  align: 'end',   maxWidth: 8, decimal: 2  },
  { title: 'UOM',             key: 'uom',          sortable: false,                 maxWidth: 8  },
  { title: 'Term Of Pricing', key: 'termOfPricing', sortable: true,                  minWidth: 16 },
  { title: 'Shipping Mode',   key: 'shippingMode', sortable: true,                  minWidth: 14 },
  { title: 'ETD',             key: 'etd',          sortable: true,                  maxWidth: 12 },
  { title: 'Destination',     key: 'destination',  sortable: true,                  minWidth: 14 },
  { title: 'Updated Date',    key: 'updatedDate',  sortable: true,                  maxWidth: 14 },
  { title: 'Updated By',      key: 'updatedBy',    sortable: true,                  minWidth: 14 },
  { title: 'Action',          key: 'actions',      sortable: false, align: 'center'              },
]

// ============================================================
// TABLE HEADERS — ShippingExpense (Tab EXPENSE)
// ============================================================

export const SHIPPING_EXPENSE_HEADERS = [
  { title: 'No.',            key: 'no',            sortable: false, width: 60 },
  { title: 'Status',         key: 'status',        sortable: true             },
  { title: 'Invoice In SAP', key: 'invoiceInSAP',  sortable: true             },
  { title: 'Invoice',        key: 'invoice',       sortable: true             },
  { title: 'Payer Name',     key: 'payerName',     sortable: true             },
  { title: 'ETD',            key: 'etd',           sortable: true             },
  { title: 'Action',         key: 'actions',       sortable: false, align: 'center' },
]
