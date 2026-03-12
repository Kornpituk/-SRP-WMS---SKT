import { ref } from 'vue'
import { useTabPermissions } from './usePermissions'
import { shipDocumentApi } from '../services/shipDocumentApi'
import { useShipDocumentStore } from '../stores/shipDocumentStore'

export function usePrint(tabKey, getFormData) {
  const store = useShipDocumentStore()
  const { permissions } = useTabPermissions(tabKey)

  const isPrinting = ref(false)
  const showPrintDialog = ref(false)
  const printTarget = ref('buyer') // ค่าเริ่มต้น

  async function print(target = printTarget.value) {
    if (!permissions.value.canPrint) return

    isPrinting.value = true

    try {
      const formData = getFormData ? getFormData() : {}

      console.log("formData", formData)

      const blob = await shipDocumentApi.printTab(
        store.documentId,
        tabKey,
        target,
        formData,
      )

      const url = URL.createObjectURL(blob)

      window.open(url, '_blank')
      setTimeout(() => URL.revokeObjectURL(url), 60000)

    } catch (err) {
      console.error(`[usePrint] ${tabKey}:`, err)
    } finally {
      isPrinting.value = false
    }
  }

  function openPrintDialog() { showPrintDialog.value = true }
  function closePrintDialog() { showPrintDialog.value = false }

  return {
    isPrinting,
    showPrintDialog,
    printTarget,
    print,
    openPrintDialog,
    closePrintDialog,
  }
}
