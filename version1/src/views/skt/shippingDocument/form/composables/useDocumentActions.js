// ============================================================================
// Composable — useDocumentActions (fetch, void, navigate)
// ============================================================================

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useShipDocumentStore } from '../stores/shipDocumentStore'
import { useDocumentPermissions } from './usePermissions'
import { shipDocumentApi } from '../services/shipDocumentApi'

export function useDocumentActions() {
  const store = useShipDocumentStore()
  const router = useRouter()
  const { documentPermissions } = useDocumentPermissions()
  const fetchError = ref(null)

  async function fetchDocument(id) {
    store.isLoading = true
    fetchError.value = null
    try {
      const res = await shipDocumentApi.getById(id)
      if (res.success && res.data) {
        store.loadDocument(res.data)
        return true
      }
      fetchError.value = res.message || 'Failed to load document'
      return false
    } catch (err) {
      fetchError.value = 'Network error. Please try again.'
      console.error('[useDocumentActions] fetchDocument:', err)
      return false
    } finally {
      store.isLoading = false
    }
  }

  async function voidDocument() {
    if (!documentPermissions.value.canVoid) return false
    try {
      await shipDocumentApi.voidDocument(store.documentId)
      store.voidDocument()
      return true
    } catch (err) {
      console.error('[useDocumentActions] voidDocument:', err)
      return false
    }
  }

  function goBackToList() {
    router.push({ name: 'ship-document-list' })
  }

  function cleanup() {
    store.$reset()
  }

  return { fetchDocument, voidDocument, goBackToList, cleanup, fetchError, documentPermissions }
}
