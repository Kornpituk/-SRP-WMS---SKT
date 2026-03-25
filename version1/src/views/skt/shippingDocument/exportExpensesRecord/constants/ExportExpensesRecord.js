import { formatNumber, formatDate } from '../utilities/formats'

export const headers = [
  // ── Identity ────────────────────────────────────────────────────────────
  {
    title: 'No.',
    key: 'no',
    sortable: false,
    width: '56px',
    align: 'center',

    // ใช้ slot แทน (no-cell class)
  },
  {
    title: 'Sale Order No.',
    key: 'salesOrderNo',
    sortable: true,
    minWidth: '145px',
  },
  {
    title: 'PO No.',
    key: 'poNo',
    sortable: true,
    minWidth: '125px',
  },
  {
    title: 'Invoice',
    key: 'invoice',
    sortable: false,
    minWidth: '120px',
  },
  {
    title: 'Invoice in SAP',
    key: 'invoiceInSap',
    sortable: false,
    minWidth: '135px',
  },
  {
    title: 'Payer Name',
    key: 'payerName',
    sortable: true,
    minWidth: '155px',
  },
  {
    title: 'End User',
    key: 'endUser',
    sortable: false,
    minWidth: '155px',
  },
  {
    title: 'Item',
    key: 'item',
    sortable: false,
    minWidth: '200px',
  },
  {
    title: 'ETD',
    key: 'etd',
    sortable: true,
    minWidth: '105px',

    // ใช้ slot แทน (formatDate)
  },
  {
    title: 'Term',
    key: 'term',
    sortable: false,
    width: '80px',
    align: 'center',
  },
  {
    title: 'Sale',
    key: 'sale',
    sortable: false,
    width: '80px',
    align: 'center',
  },

  // ── Expense columns ──────────────────────────────────────────────────────
  // ✅ value() function → Vuetify render cell text โดยตรง ไม่ต้องใช้ slot
  {
    title: 'Forwarder',
    key: 'forwarder',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.forwarder),
  },
  {
    title: 'Baht',
    key: 'bahtForwarder',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.bahtForwarder),
  },
  {
    title: 'Customs OT Fee',
    key: 'customsOtFee',
    sortable: false,
    width: '130px',
    align: 'end',
    value: item => formatNumber(item.customsOtFee),
  },
  {
    title: 'Courier',
    key: 'courier',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.courier),
  },
  {
    title: 'Baht',
    key: 'bahtCourier',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.bahtCourier),
  },
  {
    title: 'Trucking',
    key: 'trucking',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.trucking),
  },
  {
    title: 'Baht',
    key: 'bahtTrucking',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.bahtTrucking),
  },
  {
    title: 'Storage',
    key: 'storage',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.storage),
  },
  {
    title: 'Baht',
    key: 'bahtStorage',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.bahtStorage),
  },
  {
    title: 'Insurance',
    key: 'insurance',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.insurance),
  },
  {
    title: 'Baht',
    key: 'bahtInsurance',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.bahtInsurance),
  },
  {
    title: 'FTA Form',
    key: 'ftaForm',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.ftaForm),
  },
  {
    title: 'Baht',
    key: 'bahtFtaForm',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.bahtFtaForm),
  },
  {
    title: 'Shipping',
    key: 'shipping',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.shipping),
  },
  {
    title: 'Baht',
    key: 'bahtShipping',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.bahtShipping),
  },
  {
    title: 'Other',
    key: 'other',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.other),
  },
  {
    title: 'Baht',
    key: 'bahtOther',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.bahtOther),
  },

  // ── Summary ──────────────────────────────────────────────────────────────
  {
    title: 'Total Cost',
    key: 'totalCost',
    sortable: true,
    minWidth: '115px',
    align: 'end',

    // ใช้ slot แทน (bold class)
  },
  {
    title: 'Quantity',
    key: 'quantity',
    sortable: false,
    width: '90px',
    align: 'end',
  },
  {
    title: 'Cost/Unit',
    key: 'costPerUnit',
    sortable: false,
    width: '110px',
    align: 'end',
    value: item => formatNumber(item.costPerUnit),
  },
  {
    title: 'Updated By',
    key: 'updatedBy',
    sortable: false,
    minWidth: '115px',
  },
  {
    title: 'Updated Date',
    key: 'updatedDate',
    sortable: false,
    minWidth: '115px',

    // ใช้ slot แทน (formatDate)
  },
]

export const itemsPerPageOptions = [
  { value: 10,  title: '10' },
  { value: 25,  title: '25' },
  { value: 50,  title: '50' },
  { value: 100, title: '100' },
]
