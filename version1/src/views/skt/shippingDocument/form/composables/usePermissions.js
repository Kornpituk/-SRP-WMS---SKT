// ============================================================================
// Composable — usePermissions
// ============================================================================
// Permissions are COMPUTED — never stored. Document status overrides tab.
// ============================================================================

import { computed, isRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipDocumentStore } from '../stores/shipDocumentStore'
import { DocumentStatus, TabStatus } from '../types/shipDocument'

export function useDocumentPermissions() {
  const store = useShipDocumentStore()
  const { documentStatus } = storeToRefs(store)

  const documentPermissions = computed(() => {
    const isVoid = documentStatus.value === DocumentStatus.VOID
    const isLocked = isVoid || documentStatus.value === DocumentStatus.APPROVED
    
    return {
      canApprove: !isLocked,
      canVoid: !isLocked,
      canEdit: !isLocked,
      canPrint: true,
      isLocked,
    }
  })

  return { documentPermissions }
}

export function useTabPermissions(tabKey) {
  const store = useShipDocumentStore()
  const { documentStatus, tabs } = storeToRefs(store)

  const permissions = computed(() => {
    const key = isRef(tabKey) ? tabKey.value : tabKey
    const tabState = tabs.value[key]
    const docStatus = documentStatus.value

    // Priority 1: terminal document states override everything
    if (docStatus === DocumentStatus.VOID || docStatus === DocumentStatus.APPROVED) {
      return { canView: true, canEdit: false, canSave: false, canConfirm: false, canPrint: true, canVoid: false }
    }

    // Priority 2: Tab status
    switch (tabState.status) {
    case TabStatus.DRAFT:
      return { canView: true, canEdit: true, canSave: true, canConfirm: true, canPrint: false, canVoid: false }
    case TabStatus.SAVED:
      return { canView: true, canEdit: true, canSave: true, canConfirm: true, canPrint: true, canVoid: false }
    case TabStatus.CONFIRMED:
      return { canView: true, canEdit: false, canSave: false, canConfirm: false, canPrint: true, canVoid: false }
    default:
      return { canView: true, canEdit: false, canSave: false, canConfirm: false, canPrint: false, canVoid: false }
    }
  })

  return { permissions }
}

export function usePermissions(tabKey) {
  const { documentPermissions } = useDocumentPermissions()
  const { permissions: tabPermissions } = useTabPermissions(tabKey)
  
  return { documentPermissions, tabPermissions }
}
