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
]
