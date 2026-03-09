// ============================================================================
// Composable — useUnsavedChangesGuard
// ============================================================================

import { onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useShipDocumentStore } from '../stores/shipDocumentStore'

export function useUnsavedChangesGuard() {
  const store = useShipDocumentStore()

  const handler = (e) => {
    if (store.hasUnsavedChanges) {
      e.preventDefault()
      e.returnValue = ''
    }
  }

  window.addEventListener('beforeunload', handler)
  onBeforeUnmount(() => window.removeEventListener('beforeunload', handler))

  onBeforeRouteLeave((_to, _from, next) => {
    if (store.hasUnsavedChanges) {
      const ok = window.confirm('You have unsaved changes. Leave anyway?')
      if (!ok) return next(false)
    }
    next()
  })
}
