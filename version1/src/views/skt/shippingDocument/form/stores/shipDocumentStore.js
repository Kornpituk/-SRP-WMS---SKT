// ============================================================================
// Pinia Store — Ship Document (Single Store for entire document)
// ============================================================================

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { DocumentStatus, TabStatus, TabKey } from '../types/shipDocument'
import { transition, canTransition, getAllowedActions } from '../constants/statusMachine'
import { createDefaultTabState } from '../constants/defaultTabData'
import { TAB_REGISTRY } from '../constants/tabRegistry'

export const useShipDocumentStore = defineStore('shipDocument', () => {
  // -- State --
  const documentId = ref('')
  const documentNo = ref('')
  const documentStatus = ref(DocumentStatus.ACTIVE)
  const createdAt = ref('')
  const updatedAt = ref('')
  const createdBy = ref('')
  const isLoading = ref(false)
  const activeTabKey = ref(TabKey.PACKING_LIST)

  const tabs = ref({
    [TabKey.PACKING_LIST]: createDefaultTabState(TabKey.PACKING_LIST),
    [TabKey.COMMERCIAL_INVOICE]: createDefaultTabState(TabKey.COMMERCIAL_INVOICE),
    [TabKey.CERTIFICATE_OF_ORIGIN]: createDefaultTabState(TabKey.CERTIFICATE_OF_ORIGIN),
    [TabKey.PACKING_DECLARATION]: createDefaultTabState(TabKey.PACKING_DECLARATION),
    [TabKey.SHIPPING_PARTICULAR]: createDefaultTabState(TabKey.SHIPPING_PARTICULAR),
  })

  // -- Getters --
  const isVoided = computed(() => documentStatus.value === DocumentStatus.VOID)
  const isApproved = computed(() => documentStatus.value === DocumentStatus.APPROVED)
  const isActionLocked = computed(() => isVoided.value || isApproved.value)
  const getTab = computed(() => key => tabs.value[key])
  const activeTab = computed(() => tabs.value[activeTabKey.value])
  const hasUnsavedChanges = computed(() => Object.values(tabs.value).some(t => t.isDirty))
  const confirmedTabCount = computed(() => Object.values(tabs.value).filter(t => t.status === TabStatus.CONFIRMED).length)
  const allTabsConfirmed = computed(() => confirmedTabCount.value === TAB_REGISTRY.length)

  const tabStatusSummary = computed(() =>
    TAB_REGISTRY.map(c => ({
      key: c.key,
      label: c.label,
      status: tabs.value[c.key].status,
      isDirty: tabs.value[c.key].isDirty,
      isOverriddenByVoid: isVoided.value,
    })),
  )

  // -- Private --
  function _buildContext(tabKey) {
    return {
      documentStatus: documentStatus.value,
      tabKey,
      currentTabStatus: tabs.value[tabKey].status,
    }
  }

  // -- Actions --
  function loadDocument(doc) {
    documentId.value = doc.id
    documentNo.value = doc.documentNo
    documentStatus.value = doc.status
    createdAt.value = doc.createdAt
    updatedAt.value = doc.updatedAt
    createdBy.value = doc.createdBy

    for (const key of Object.values(TabKey)) {
      if (doc.tabs[key]) {
        tabs.value[key] = { ...doc.tabs[key], isDirty: false, isLoading: false, errors: {} }
      }
    }
  }

  function updateTabData(tabKey, data) {
    const tab = tabs.value[tabKey]

    tab.data = { ...tab.data, ...data }
    tab.isDirty = true
  }

  function setTabLoading(tabKey, loading) {
    tabs.value[tabKey].isLoading = loading
  }

  function setTabErrors(tabKey, errors) {
    tabs.value[tabKey].errors = errors
  }

  function clearTabErrors(tabKey) {
    tabs.value[tabKey].errors = {}
  }

  function executeTransition(tabKey, action) {
    const ctx = _buildContext(tabKey)
    const newStatus = transition(action, ctx)

    if (newStatus === null) {
      console.warn(`[ShipDocument] Transition blocked: ${action} on ${tabKey} (current=${ctx.currentTabStatus}, doc=${ctx.documentStatus})`)
      
      return false
    }

    tabs.value[tabKey].status = newStatus
    tabs.value[tabKey].isDirty = false

    const now = new Date().toISOString()
    if (action === 'SAVE_DRAFT') tabs.value[tabKey].lastSavedAt = now
    if (action === 'CONFIRM') tabs.value[tabKey].lastConfirmedAt = now

    return true
  }

  function canExecute(tabKey, action) {
    return canTransition(action, _buildContext(tabKey))
  }

  function getAvailableActions(tabKey) {
    return getAllowedActions(_buildContext(tabKey))
  }

  function voidDocument() {
    documentStatus.value = DocumentStatus.VOID
  }

  function approveDocument() {
    documentStatus.value = DocumentStatus.APPROVED
  }

  function setActiveTab(tabKey) {
    activeTabKey.value = tabKey
  }

  function $reset() {
    documentId.value = ''
    documentNo.value = ''
    documentStatus.value = DocumentStatus.ACTIVE
    createdAt.value = ''
    updatedAt.value = ''
    createdBy.value = ''
    isLoading.value = false
    activeTabKey.value = TabKey.PACKING_LIST
    for (const key of Object.values(TabKey)) {
      tabs.value[key] = createDefaultTabState(key)
    }
  }

  return {
    documentId, documentNo, documentStatus, createdAt, updatedAt, createdBy, isLoading, activeTabKey, tabs,
    isVoided, isApproved, isActionLocked, getTab, activeTab, hasUnsavedChanges, tabStatusSummary, confirmedTabCount, allTabsConfirmed,
    loadDocument, updateTabData, setTabLoading, setTabErrors, clearTabErrors,
    executeTransition, canExecute, getAvailableActions, voidDocument, approveDocument, setActiveTab, $reset,
  }
})
