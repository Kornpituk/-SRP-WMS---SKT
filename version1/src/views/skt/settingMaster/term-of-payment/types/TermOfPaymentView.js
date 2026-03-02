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
    key: 'startDate',
    label: 'Start Date',
    type: 'select',
    required: true,
    width: '150px',
    searchable: true,
    options: [
      { label: 'B/L Date', value: 'B/L Date' },
      { label: 'END MONTH', value: 'END MONTH' },
    ],
  },
  {
    key: 'days',
    label: 'Days',
    type: 'number',
    required: true,
    width: '100px',
    searchable: true,
  },
]
