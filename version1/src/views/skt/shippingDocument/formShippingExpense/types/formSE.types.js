// ─────────────────────────────────────────────────────────────────────────────
// types/shippingExpense.js
// Default factory for the Shipping Expense tab.
// Import in the component, store default factory, and service mapper.
// ─────────────────────────────────────────────────────────────────────────────

export const createDefaultShippingExpense = () => ({
  salePerson: null,
  forwarder: { vendor: null, price: null },
  customsOverTime: { price: null },
  courier: { vendor: null, price: null },
  trucking: { vendor: null, price: null },
  storage: { vendor: null, price: null },
  insurance: { vendor: null, price: null },
  ftaForm: { vendor: null, price: null },
  shipping: { vendor: null, price: null },
  other: { vendor: null, price: null },
  remark: null,
})
