export const fields = [
  {
    key: 'packageName',
    label: 'Package Name',
    type: 'text',
    required: true,
    width: '300px',
    searchable: true,
  },
  {
    key: 'packageType',
    label: 'Package',
    type: 'select',
    required: true,
    width: '150px',
    searchable: true,
    options: [
      { label: 'Drum', value: 'Drum' },
      { label: 'Pallet', value: 'Pallet' },
    ],
  },
  {
    key: 'tareWeight',
    label: 'Tare Weight',
    type: 'number',
    required: true,
    width: '150px',
    searchable: true,
  },
]
