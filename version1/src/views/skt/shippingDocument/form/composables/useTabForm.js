// ============================================================================
// Composable — useTabForm (Core reusable composable for every tab)
// ============================================================================

import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipDocumentStore } from '../stores/shipDocumentStore'
import { useTabPermissions } from './usePermissions'

/**
 * @param {string} tabKey — TabKey value
 * @param {Object} [options]
 * @param {function(Object):Promise<void>} [options.onSaveDraft]
 * @param {function(Object):Promise<void>} [options.onConfirm]
 * @param {function():void} [options.onSaveSuccess]
 * @param {function():void} [options.onConfirmSuccess]
 * @param {function(*):void} [options.onError]
 * @param {function(Object):(Object|null)} [options.validate]
 */
export function useTabForm(tabKey, options = {}) {
  const store = useShipDocumentStore()
  const { tabs } = storeToRefs(store)
  const { permissions } = useTabPermissions(tabKey)

  const tabState = computed(() => tabs.value[tabKey])
  const formData = computed(() => tabState.value.data)
  const isDirty = computed(() => tabState.value.isDirty)
  const isLoading = computed(() => tabState.value.isLoading)
  const errors = computed(() => tabState.value.errors)
  const tabStatus = computed(() => tabState.value.status)
  const isReadonly = computed(() => !permissions.value.canEdit)

  function updateField(field, value) {
    if (!permissions.value.canEdit) return
    store.updateTabData(tabKey, { [field]: value })
  }

  function updateFields(partial) {
    if (!permissions.value.canEdit) return
    store.updateTabData(tabKey, partial)
  }

  function _runValidation() {
    if (!options.validate) return true
    const errs = options.validate(formData.value)
    if (errs && Object.keys(errs).length > 0) {
      store.setTabErrors(tabKey, errs)
      
      return false
    }
    store.clearTabErrors(tabKey)
    
    return true
  }

  function _handleApiError(error) {
    if (error && typeof error === 'object' && error.errors && typeof error.errors === 'object') {
      store.setTabErrors(tabKey, error.errors)
    }
  }

  async function saveDraft() {
    if (!permissions.value.canSave) {
      console.warn(`[useTabForm] Save not allowed for ${tabKey}`)
      
      return false
    }
    if (!_runValidation()) return false

    store.setTabLoading(tabKey, true)
    store.clearTabErrors(tabKey)

    try {
      if (options.onSaveDraft) await options.onSaveDraft(formData.value)
      const ok = store.executeTransition(tabKey, 'SAVE_DRAFT')
      if (ok) options.onSaveSuccess?.()
      
      return ok
    } catch (err) {
      _handleApiError(err)
      options.onError?.(err)
      
      return false
    } finally {
      store.setTabLoading(tabKey, false)
    }
  }

  async function confirm() {
    if (!permissions.value.canConfirm) {
      console.warn(`[useTabForm] Confirm not allowed for ${tabKey}`)
      
      return false
    }
    if (!_runValidation()) return false

    store.setTabLoading(tabKey, true)
    store.clearTabErrors(tabKey)

    try {
      if (options.onConfirm) await options.onConfirm(formData.value)
      const ok = store.executeTransition(tabKey, 'CONFIRM')
      if (ok) options.onConfirmSuccess?.()
      
      return ok
    } catch (err) {
      _handleApiError(err)
      options.onError?.(err)
      
      return false
    } finally {
      store.setTabLoading(tabKey, false)
    }
  }

  function resetForm() {
    store.clearTabErrors(tabKey)
  }

  function hasError(field) {
    return computed(() => !!(errors.value[field]?.length))
  }

  function getError(field) {
    return computed(() => errors.value[field]?.[0] ?? '')
  }

  return {
    formData, isDirty, isLoading, errors, tabStatus, permissions, isReadonly,
    updateField, updateFields, saveDraft, confirm, resetForm, hasError, getError,
  }
}
