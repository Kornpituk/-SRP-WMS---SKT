// composables/usePermissions.js
import { computed } from 'vue'
import {
  useShippingDocumentStore,
  TAB_STATUS,
  DOCUMENT_STATUS,
} from '../stores/shippingDocumentStore'

/**
 * usePermissions
 * ─────────────────────────────────────────────────────────────────────────────
 * คำนวณสิทธิ์ของแต่ละ tab จาก documentStatus + tabStatus
 * ไม่มี side effects — computed อย่างเดียว
 *
 * @param {string} tabKey
 */
export const usePermissions = tabKey => {
  const store = useShippingDocumentStore()

  const documentStatus = computed(() => store.documentStatus)
  const tabStatus      = computed(() => store.getTabStatus(tabKey))

  /** Document ยัง ACTIVE อยู่ */
  const isDocumentActive = computed(
    () => documentStatus.value === DOCUMENT_STATUS.ACTIVE,
  )

  /**
   * แก้ไขฟอร์มได้เมื่อ:
   *  - Document ยัง ACTIVE
   *  - Tab ยังไม่ CONFIRMED
   */
  const canEdit = computed(
    () =>
      isDocumentActive.value &&
      tabStatus.value !== TAB_STATUS.CONFIRMED,
  )

  /**
   * กด Save ได้เมื่อ:
   *  - canEdit
   *  - Tab เป็น DRAFT หรือ SAVED (กด save ซ้ำได้)
   */
  const canSave = computed(
    () =>
      canEdit.value &&
      [TAB_STATUS.DRAFT, TAB_STATUS.SAVED].includes(tabStatus.value),
  )

  /**
   * กด Confirm ได้เมื่อ:
   *  - canEdit
   *  - Tab เป็น DRAFT หรือ SAVED
   */
  const canConfirm = computed(
    () =>
      canEdit.value &&
      [TAB_STATUS.DRAFT, TAB_STATUS.SAVED].includes(tabStatus.value),
  )

  /** แสดง action buttons (SAVE DRAFT / CONFIRM) */
  const showActions = computed(
    () => canEdit.value,
  )

  /** Tab ถูก Confirm แล้ว — แสดง badge/indicator */
  const isConfirmed = computed(
    () => tabStatus.value === TAB_STATUS.CONFIRMED,
  )

  /** Document ถูก Void แล้ว */
  const isVoid = computed(
    () => documentStatus.value === DOCUMENT_STATUS.VOID,
  )

  return {
    canEdit,
    canSave,
    canConfirm,
    showActions,
    isConfirmed,
    isVoid,
    isDocumentActive,
    documentStatus,
    tabStatus,
  }
}
