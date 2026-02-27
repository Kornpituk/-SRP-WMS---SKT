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
  {
    key: 'setting-master',
    title: 'Setting Master',
    icon: { icon: 'ri-settings-3-line' },
    children: [
      { title: 'Term of Payment', to: 'skt-term-of-payment' },
      { title: 'Port', to: 'skt-port' },
      { title: 'Term of Pricing', to: 'skt-term-of-pricing' },
      { title: 'Currency', to: 'skt-currency' },
      { title: 'Container Type', to: 'skt-container-type' },
      { title: 'Package', to: 'skt-package' },
      { title: 'HS Code No', to: 'skt-hs-code-no' },
      { title: 'Bank Account No', to: 'skt-bank-account-no' },
      { title: 'Shipping Mode', to: 'skt-shipping-mode' },
      { title: 'Carrier', to: 'skt-carrier' },
      { title: 'Sale Person', to: 'skt-sale-person' },
      { title: 'Ship Document', to: 'skt-ship-document' },
    ],
  },
]

