// types/shipDocument.js
// ─────────────────────────────────────────────────────────────────────────────
// TabKey — ใช้เป็น identifier ทั้งใน store, tabRegistry, tabComponents, FSM
// ─────────────────────────────────────────────────────────────────────────────

export const TabKey = /** @type {const} */ ({
  PACKING_LIST: 'packingList',
  COMMERCIAL_INVOICE: 'commercialInvoice',
  CERTIFICATE_OF_ORIGIN: 'certificateOfOrigin',
  PACKING_DECLARATION: 'packingDeclaration',
  SHIPPING_PARTICULAR: 'shippingParticular',
  SHIPPING_EXPENSE: 'shippingExpense',   // ← เพิ่มตรงนี้
})

export const DocumentStatus = /** @type {const} */ ({
  ACTIVE: 'ACTIVE',
  VOID: 'VOID',
})

export const TabStatus = /** @type {const} */ ({
  DRAFT: 'DRAFT',
  SAVED: 'SAVED',
  CONFIRMED: 'CONFIRMED',
})
