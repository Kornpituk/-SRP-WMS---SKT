// constants/tabRegistry.js
// ─────────────────────────────────────────────────────────────────────────────
// Tab registry — single source of truth สำหรับ label, order, และ visibility
// ─────────────────────────────────────────────────────────────────────────────
import { TabKey } from '../types/shipDocument'

/**
 * TAB_REGISTRY
 * ลำดับใน array = ลำดับที่แสดงบน VTabs
 */
export const TAB_REGISTRY = [
  {
    key: TabKey.PACKING_LIST,
    label: 'Packing List',
    order: 1,
  },
  {
    key: TabKey.COMMERCIAL_INVOICE,
    label: 'Commercial Invoice',
    order: 2,
  },
  {
    key: TabKey.CERTIFICATE_OF_ORIGIN,
    label: 'Certificate of Origin',
    order: 3,
  },
  {
    key: TabKey.PACKING_DECLARATION,
    label: 'Packing Declaration',
    order: 4,
  },
  {
    key: TabKey.SHIPPING_PARTICULAR,
    label: 'Shipping Particular',
    order: 5,
  },

  // ← เพิ่ม tab ใหม่ตรงนี้
  {
    key: TabKey.SHIPPING_EXPENSE,
    label: 'Shipping Expense',
    order: 6,
  },
]

/**
 * คืน array เรียงตาม order
 * ใช้ใน [id].vue → orderedTabs
 */
export const getOrderedTabs = () =>
  [...TAB_REGISTRY].sort((a, b) => a.order - b.order)
