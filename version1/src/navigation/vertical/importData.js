export default [
  {
    title: 'Import Data',
    icon: { icon: 'mdi-import' },
    children: [
      {
        title: 'Import Purchase Order',
        to: 'importData-importPurchaseOrder-purchaseOrderList',
      },
      {
        title: 'Import Delivery Note',
        to: 'importData-importDeliveryNote-purchaseOrderDeliveryList',
      },

      // {
      //   title: 'Import Product And Inventory Data',
      //   to: 'pages-misc-not-found',
      // },
    ],
  
  },
    
]
