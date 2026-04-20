// menu.config.js
export const MENU_LIST = [
  {
    key: 'stock-update',
    title: 'Stock Update',
    icon: { icon: 'ri-store-3-line' },
    to: 'skt-stockUpdate',
  },
  {
    key: 'receiving',
    title: 'Receiving Plan',
    icon: { icon: 'ri-inbox-archive-fill' },
    to: 'skt-receiving',
  },
  {
    key: 'production',
    title: 'Production Plan',
    icon: { icon: 'ri-calendar-schedule-fill' },
    to: 'skt-planning-schedule',
  },
  {
    key: 'shipment',
    title: 'Shipment Plan',
    icon: { icon: 'ri-truck-fill' },
    to: 'skt-shipping',
  },
  {
    key: 'print-label',
    title: 'Print Label',
    icon: { icon: 'ri-printer-fill' },
    to: 'skt-printLabel',
    children: [
      { title: 'Sticker Label', to: 'skt-printLabel-sticker' },
      { title: 'Product Label', to: 'skt-printLabel-productionLabel' },
    ],
  },

  // {
  //   title: 'Master Setting',
  //   icon: { icon: 'ri-settings-3-line' },
  //   children: [
  //     { title: 'Forwarder', to: 'skt-settingMaster-forwarder' },
  //     { title: 'Term of Payment', to: 'skt-settingMaster-termOfPayment' },
  //     { title: 'Port', to: 'skt-settingMaster-port' },
  //     { title: 'Term of Pricing', to: 'skt-settingMaster-termOfPricing' },
  //     { title: 'Currency', to: 'skt-settingMaster-currency' },
  //     { title: 'Container Type', to: 'skt-settingMaster-containerType' },
  //     { title: 'Package', to: 'skt-settingMaster-package' },
  //     { title: 'HS Code No', to: 'skt-settingMaster-hsCodeNo' },
  //     { title: 'Bank Account No.', to: 'skt-settingMaster-bankAccountNo' },
  //     { title: 'Shipping Mode', to: 'skt-settingMaster-shippingMode' },
  //     { title: 'Carrier', to: 'skt-settingMaster-carrier' },
  //     { title: 'Sale Person', to: 'skt-settingMaster-salePerson' },
  //   ],
  // },

  {
    title: 'Shipping Documents',
    icon: { icon: 'mdi-file-outline' },
    children: [
      
      {
        title: 'Master Setting',
        children: [
          { title: 'Forwarder', to: 'skt-settingMaster-forwarder' },
          { title: 'End User', to: 'skt-settingMaster-endUser' },
          { title: 'Term of Payment', to: 'skt-settingMaster-termOfPayment' },
          { title: 'Port', to: 'skt-settingMaster-port' },
          { title: 'Term of Pricing', to: 'skt-settingMaster-termOfPricing' },
          { title: 'Currency', to: 'skt-settingMaster-currency' },
          { title: 'Container Type', to: 'skt-settingMaster-containerType' },
          { title: 'Package', to: 'skt-settingMaster-package' },
          { title: 'HS Code No', to: 'skt-settingMaster-hsCodeNo' },
          { title: 'Bank Account No.', to: 'skt-settingMaster-bankAccountNo' },
          { title: 'Shipping Mode', to: 'skt-settingMaster-shippingMode' },
          { title: 'Carrier', to: 'skt-settingMaster-carrier' },
          { title: 'Sale Person', to: 'skt-settingMaster-salePerson' },
        ],
      },
      { title: 'Shipping Document', to: 'skt-shippingDocument-shippingDocument-ShippingDocumentPage' },
      { 
        title: 'Export Expenses Record', 
        to: 'skt-shippingDocument-exportExpensesRecord-exportExpensesRecord', 
      },
    ],
  },
]

