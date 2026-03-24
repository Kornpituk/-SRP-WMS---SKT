// stores/shippingDocumentStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ─── Tab Status FSM ───────────────────────────────────────────────────────────
export const TAB_STATUS = /** @type {const} */ ({
  DRAFT: 'DRAFT',
  SAVED: 'SAVED',
  CONFIRMED: 'CONFIRMED',
})

export const DOCUMENT_STATUS = /** @type {const} */ ({
  ACTIVE: 'ACTIVE',
  VOID: 'VOID',
})

// ─── Tab Keys ─────────────────────────────────────────────────────────────────
export const TAB_KEY = /** @type {const} */ ({
  PACKING_LIST: 'packingList',
  COMMERCIAL_INVOICE: 'commercialInvoice',
  CERTIFICATE_OF_ORIGIN: 'certificateOfOrigin',
  PACKING_DECLARATION: 'packingDeclaration',
  SHIPPING_PARTICULAR: 'shippingParticular',
  SHIPPING_EXPENSE: 'shippingExpense',
})

// ─── Default Data Factories ───────────────────────────────────────────────────
const createDefaultVendorPrice = () => ({ vendor: null, price: null })

const createDefaultShippingExpense = () => ({
  salePerson: null,
  forwarder: createDefaultVendorPrice(),
  customsOverTime: { price: null },
  courier: createDefaultVendorPrice(),
  trucking: createDefaultVendorPrice(),
  storage: createDefaultVendorPrice(),
  insurance: createDefaultVendorPrice(),
  ftaForm: createDefaultVendorPrice(),
  shipping: createDefaultVendorPrice(),
  other: createDefaultVendorPrice(),
  remark: null,
})

const createInitialTabData = () => ({
  [TAB_KEY.PACKING_LIST]: {},
  [TAB_KEY.COMMERCIAL_INVOICE]: {},
  [TAB_KEY.CERTIFICATE_OF_ORIGIN]: {},
  [TAB_KEY.PACKING_DECLARATION]: {},
  [TAB_KEY.SHIPPING_PARTICULAR]: {},
  [TAB_KEY.SHIPPING_EXPENSE]: createDefaultShippingExpense(),
})

const createInitialTabStatus = () =>
  Object.fromEntries(
    Object.values(TAB_KEY).map(key => [key, TAB_STATUS.DRAFT]),
  )

// ─── FSM Transition Rules ─────────────────────────────────────────────────────
const ALLOWED_TRANSITIONS = {
  [TAB_STATUS.DRAFT]: [TAB_STATUS.SAVED],
  [TAB_STATUS.SAVED]: [TAB_STATUS.CONFIRMED, TAB_STATUS.DRAFT],
  [TAB_STATUS.CONFIRMED]: [TAB_STATUS.DRAFT], // void resets
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useShippingDocumentStore  = defineStore('shippingDocument', () => {

  // ── State ──────────────────────────────────────────────────────────────────
  const document      = ref(null)
  const tabData       = ref(createInitialTabData())
  const tabStatus     = ref(createInitialTabStatus())
  const tabErrors     = ref(Object.fromEntries(Object.values(TAB_KEY).map(k => [k, {}])))
  const masterData    = ref(null)
  const isLoadingDoc  = ref(false)
  const isSavingTab   = ref(Object.fromEntries(Object.values(TAB_KEY).map(k => [k, false])))
  const activeTabKey  = ref(TAB_KEY.PACKING_LIST)

  // ── Getters ────────────────────────────────────────────────────────────────
  const documentStatus = computed(() => document.value?.status ?? DOCUMENT_STATUS.ACTIVE)
  const isDocumentVoid = computed(() => documentStatus.value === DOCUMENT_STATUS.VOID)

  const getTabData   = tabKey => tabData.value[tabKey]
  const getTabStatus = tabKey => tabStatus.value[tabKey] ?? TAB_STATUS.DRAFT
  const getTabErrors = tabKey => tabErrors.value[tabKey] ?? {}

  // ── FSM Transition ─────────────────────────────────────────────────────────
  /**
   * เดียวทางที่จะเปลี่ยน tabStatus — ผ่าน function นี้เท่านั้น
   * @param {string} tabKey
   * @param {string} nextStatus
   * @returns {boolean} success
   */
  const executeTransition = (tabKey, nextStatus) => {
    const current = tabStatus.value[tabKey]
    const allowed = ALLOWED_TRANSITIONS[current] ?? []

    if (!allowed.includes(nextStatus)) {
      console.warn(
        `[ShippingDocStore] Invalid transition: ${tabKey} ${current} → ${nextStatus}`,
      )
      
      return false
    }

    tabStatus.value[tabKey] = nextStatus
    
    return true
  }

  // ── Mutations ──────────────────────────────────────────────────────────────
  const setDocument = doc => {
    document.value = doc
  }

  const setMasterData = data => {
    masterData.value = data
  }

  const updateTabField = (tabKey, field, value) => {
    if (!tabData.value[tabKey]) return
    tabData.value[tabKey] = {
      ...tabData.value[tabKey],
      [field]: value,
    }
  }

  const setTabData = (tabKey, data) => {
    tabData.value[tabKey] = { ...data }
  }

  const setTabErrors = (tabKey, errors) => {
    tabErrors.value[tabKey] = { ...errors }
  }

  const clearTabErrors = tabKey => {
    tabErrors.value[tabKey] = {}
  }

  const setTabSaving = (tabKey, val) => {
    isSavingTab.value[tabKey] = val
  }

  const setLoadingDoc = val => {
    isLoadingDoc.value = val
  }

  const setDocumentVoid = () => {
    if (document.value) {
      document.value = { ...document.value, status: DOCUMENT_STATUS.VOID }
    }

    // reset all tab statuses
    Object.values(TAB_KEY).forEach(k => {
      tabStatus.value[k] = TAB_STATUS.DRAFT
    })
  }

  const resetStore = () => {
    document.value   = null
    tabData.value    = createInitialTabData()
    tabStatus.value  = createInitialTabStatus()
    tabErrors.value  = Object.fromEntries(Object.values(TAB_KEY).map(k => [k, {}]))
    isSavingTab.value = Object.fromEntries(Object.values(TAB_KEY).map(k => [k, false]))
    masterData.value  = null
  }

  return {
    // state
    document,
    tabData,
    tabStatus,
    tabErrors,
    masterData,
    isLoadingDoc,
    isSavingTab,
    activeTabKey,

    // getters
    documentStatus,
    isDocumentVoid,
    getTabData,
    getTabStatus,
    getTabErrors,

    // actions
    executeTransition,
    setDocument,
    setMasterData,
    updateTabField,
    setTabData,
    setTabErrors,
    clearTabErrors,
    setTabSaving,
    setLoadingDoc,
    setDocumentVoid,
    resetStore,
  }
})
