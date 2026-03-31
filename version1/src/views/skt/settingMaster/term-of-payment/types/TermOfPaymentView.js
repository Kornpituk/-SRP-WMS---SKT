export const fields = [
  {
    key: 'abb',
    label: 'ABB',
    type: 'text',
    required: true,
    width: '100px',
    searchable: true,
  },
  {
    key: 'termOfPaymentName',
    label: 'Term Of Payment Name',
    type: 'text',
    required: true,
    width: '250px',
    searchable: true,
  },
  {
    // ตาราง → แสดง label เช่น "B/L Date", "INVOICE_DATE"
    key: 'startDateLabel',
    label: 'Start Date',
    type: 'text',
    width: '150px',
    searchable: false,
    hideInForm: true,     // ← ไม่แสดงใน Create/Edit form
  },
  {
    // form → ส่ง startDateType เช่น "BL_DATE", "INVOICE_DATE"
    key: 'startDateType',
    label: 'Start Date',
    type: 'select',
    required: true,
    searchable: false,
    hideInTable: true,    // ← ไม่แสดงในตาราง
    options: [
      { label: 'Invoice Date',  value: 'INVOICE_DATE' },
      { label: 'B/L Date',      value: 'BL_DATE' },
      { label: 'End of Month',  value: 'END_MONTH' },
    ],
  },
  {
    key: 'days',
    label: 'Days',
    type: 'number',
    required: true,
    width: '100px',
    searchable: false,
  },
]
