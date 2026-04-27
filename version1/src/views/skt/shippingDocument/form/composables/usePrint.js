import { ref, toRaw } from 'vue'
import { useTabPermissions } from './usePermissions'
import { shipDocumentApi } from '../services/shipDocumentApi'
import { useShipDocumentStore } from '../stores/shipDocumentStore'

export function usePrint(tabKey, getFormData) {
  const store = useShipDocumentStore()
  const { permissions } = useTabPermissions(tabKey)

  const isPrinting = ref(false)
  const showPrintDialog = ref(false)
  const printTarget = ref('buyer') // ค่าเริ่มต้น

  async function print(target, display, shippMode) {
    
    console.log("tabKey", tabKey)
    console.log("target", target)
    console.log("display", display)
    console.log("shippMode", shippMode)

    if (!permissions.value?.canPrint) return false

    isPrinting.value = true

    try {
      const rawDisplay = toRaw(display) ?? []  // ← แปลง Proxy → Array ธรรมดา

      const formData = getFormData ? getFormData() : {}

      console.log("getFormData", formData)
      
      await shipDocumentApi.printTab(
        store.documentId,
        tabKey,
        shippMode,
        target,
        rawDisplay,
        formData,
      )

      // const url = URL.createObjectURL(blob)

      // window.open(url, '_blank')
      // setTimeout(() => URL.revokeObjectURL(url), 60000)

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
