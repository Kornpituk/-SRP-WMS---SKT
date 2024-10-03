export default [
  {
    title: 'Inventory',
    icon: { icon: 'mdi-warehouse' },
    children: [
      {
        title: 'Stock Update',
        to: 'inventory-stockUpdate',
      },

      {
        title: 'Total Details',
        to: 'inventory-serial-details',
      },

      {
        title: 'Total Summary',
        to: 'inventory-serial-summary',
      },
      
    ],
  },
]
