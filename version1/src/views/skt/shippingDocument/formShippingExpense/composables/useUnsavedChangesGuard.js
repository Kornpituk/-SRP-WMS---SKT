// composables/useUnsavedChangesGuard.js
import { computed, onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { TAB_STATUS, useShippingDocumentStore } from '../stores/shippingDocumentStore'

/**
 * useUnsavedChangesGuard
 * ─────────────────────────────────────────────────────────────────────────────
 * ป้องกันผู้ใช้ออกจากหน้าเมื่อมีแท็บที่ยัง DRAFT (ยังไม่ save)
 *
 * วิธีใช้: เรียกใน setup() ของ Detail Page
 *
 * @param {Object} [options]
 * @param {string} [options.confirmMessage]  - ข้อความ confirm dialog
 * @param {string[]} [options.watchTabKeys]  - เฉพาะ tab ที่ต้องการ guard (default = ทุก tab)
 */
export const useUnsavedChangesGuard = (options = {}) => {
  const {
    confirmMessage = 'มีข้อมูลที่ยังไม่ได้บันทึก ต้องการออกจากหน้านี้หรือไม่?',
    watchTabKeys   = null,
  } = options

  const store = useShippingDocumentStore()

  // ── ตรวจว่ามี tab ที่ยัง DRAFT อยู่ไหม ──────────────────────────────────────
  const hasDraftTabs = computed(() => {
    const keys = watchTabKeys ?? Object.keys(store.tabStatus)
    
    return keys.some(k => store.getTabStatus(k) === TAB_STATUS.DRAFT)
  })

  // ── Vue Router guard ───────────────────────────────────────────────────────
  onBeforeRouteLeave((_to, _from, next) => {
    if (!hasDraftTabs.value) {
      next()
      
      return
    }

    const confirmed = window.confirm(confirmMessage)
    if (confirmed) {
      next()
    } else {
      next(false)
    }
  })

  // ── Browser tab / window close guard ─────────────────────────────────────
  const handleBeforeUnload = e => {
    if (!hasDraftTabs.value) return
    e.preventDefault()
    e.returnValue = confirmMessage // Chrome requires returnValue to be set
  }

  window.addEventListener('beforeunload', handleBeforeUnload)

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })

  return {
    hasDraftTabs,
  }
}
