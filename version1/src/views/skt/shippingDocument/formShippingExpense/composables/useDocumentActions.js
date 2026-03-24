// composables/useDocumentActions.js
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useShippingDocumentStore } from '../stores/shippingDocumentStore'

/**
 * useDocumentActions
 * ─────────────────────────────────────────────────────────────────────────────
 * จัดการ: fetch document, void document, navigate, cleanup
 *
 * @param {Object} api  - { fetchDocument, voidDocument, fetchMasterData }
 */
export const useDocumentActions = api => {
  const store  = useShippingDocumentStore()
  const router = useRouter()

  const isLoading = ref(false)
  const isVoiding = ref(false)
  const fetchError = ref(null)

  // ── Fetch document by id ────────────────────────────────────────────────────
  const fetchDocument = async docId => {
    isLoading.value  = true
    fetchError.value = null
    store.setLoadingDoc(true)

    try {
      const [doc, master] = await Promise.all([
        api.fetchDocument(docId),
        api.fetchMasterData?.() ?? Promise.resolve(null),
      ])

      store.setDocument(doc)

      if (master) store.setMasterData(master)

      // hydrate each tab's data from document payload
      if (doc?.tabs) {
        Object.entries(doc.tabs).forEach(([tabKey, data]) => {
          store.setTabData(tabKey, data)
        })
      }
    } catch (err) {
      console.error('[useDocumentActions] fetchDocument error:', err)
      fetchError.value = err?.message ?? 'Failed to load document'
    } finally {
      isLoading.value = false
      store.setLoadingDoc(false)
    }
  }

  // ── Create new document then redirect to detail ────────────────────────────
  const createDocument = async (payload, routeName = 'ShipDocumentDetail') => {
    isLoading.value = true
    try {
      const doc = await api.createDocument(payload)

      store.setDocument(doc)

      // replace URL จาก create mode → real id
      await router.replace({ name: routeName, params: { id: doc.id } })
      
      return doc
    } catch (err) {
      console.error('[useDocumentActions] createDocument error:', err)
      fetchError.value = err?.message ?? 'Failed to create document'
      
      return null
    } finally {
      isLoading.value = false
    }
  }

  // ── Void document ──────────────────────────────────────────────────────────
  const voidDocument = async () => {
    const docId = store.document?.id
    if (!docId) return

    isVoiding.value = true
    try {
      await api.voidDocument(docId)
      store.setDocumentVoid()
    } catch (err) {
      console.error('[useDocumentActions] voidDocument error:', err)
    } finally {
      isVoiding.value = false
    }
  }

  // ── Navigate back to list ──────────────────────────────────────────────────
  const navigateToList = (routeName = 'ShipDocumentList') => {
    router.push({ name: routeName })
  }

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  const cleanup = () => {
    store.resetStore()
  }

  return {
    isLoading,
    isVoiding,
    fetchError,
    fetchDocument,
    createDocument,
    voidDocument,
    navigateToList,
    cleanup,
  }
}
