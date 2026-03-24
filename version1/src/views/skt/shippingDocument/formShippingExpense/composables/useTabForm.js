// composables/useTabForm.js
import { computed, ref } from 'vue'
import { TAB_STATUS, useShippingDocumentStore } from '../stores/shippingDocumentStore'

/**
 * useTabForm
 * ─────────────────────────────────────────────────────────────────────────────
 * Composable หลักสำหรับทุก Tab ใน shippingDocument form.
 * จัดการ: update field, save (→ SAVED), confirm (→ CONFIRMED), validate.
 *
 * @param {string}   tabKey          - key จาก TAB_KEY constant
 * @param {Function} [validateFn]    - optional (data) => errorsObject
 * @param {Object}   [apiHandlers]   - { save, confirm } async functions รับ (docId, data)
 */
export const useTabForm = (tabKey, validateFn = null, apiHandlers = {}) => {
  const store = useShippingDocumentStore()

  const isSaving    = ref(false)
  const isConfirming = ref(false)

  // ── Derived from store (read-only views) ────────────────────────────────────
  const formData = computed(() => store.getTabData(tabKey))
  const errors   = computed(() => store.getTabErrors(tabKey))
  const status   = computed(() => store.getTabStatus(tabKey))

  // ── Update a single top-level field ────────────────────────────────────────
  const handleUpdate = (field, value) => {
    store.updateTabField(tabKey, field, value)
  }

  // ── Internal validator ──────────────────────────────────────────────────────
  const runValidation = () => {
    if (typeof validateFn !== 'function') return true

    const errs = validateFn(formData.value)

    store.setTabErrors(tabKey, errs ?? {})
    
    return !errs || Object.keys(errs).length === 0
  }

  // ── Save → DRAFT → SAVED ───────────────────────────────────────────────────
  const handleSave = async () => {
    if (isSaving.value) return
    store.clearTabErrors(tabKey)

    const isValid = runValidation()
    if (!isValid) return

    isSaving.value = true
    try {
      const docId = store.document?.id
      if (apiHandlers.save) {
        await apiHandlers.save(docId, formData.value)
      }
      store.executeTransition(tabKey, TAB_STATUS.SAVED)
    } catch (err) {
      console.error(`[useTabForm] save failed for ${tabKey}:`, err)
      store.setTabErrors(tabKey, { _global: err?.message ?? 'Save failed' })
    } finally {
      isSaving.value = false
    }
  }

  // ── Confirm → SAVED → CONFIRMED ────────────────────────────────────────────
  const handleConfirm = async () => {
    if (isConfirming.value) return
    store.clearTabErrors(tabKey)

    const isValid = runValidation()
    if (!isValid) return

    isConfirming.value = true
    try {
      const docId = store.document?.id
      if (apiHandlers.confirm) {
        await apiHandlers.confirm(docId, formData.value)
      }

      // Auto-save first if still DRAFT
      if (status.value === TAB_STATUS.DRAFT) {
        store.executeTransition(tabKey, TAB_STATUS.SAVED)
      }
      store.executeTransition(tabKey, TAB_STATUS.CONFIRMED)
    } catch (err) {
      console.error(`[useTabForm] confirm failed for ${tabKey}:`, err)
      store.setTabErrors(tabKey, { _global: err?.message ?? 'Confirm failed' })
    } finally {
      isConfirming.value = false
    }
  }

  // ── Manually set errors (e.g. from parent) ─────────────────────────────────
  const setErrors = errs => store.setTabErrors(tabKey, errs)
  const clearErrors = () => store.clearTabErrors(tabKey)

  return {
    formData,
    errors,
    status,
    isSaving,
    isConfirming,
    handleUpdate,
    handleSave,
    handleConfirm,
    setErrors,
    clearErrors,
  }
}
