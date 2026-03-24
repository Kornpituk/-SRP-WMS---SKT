// composables/usePrintManager.js
import { ref } from 'vue'
import { useShipDocumentStore } from '@/views/skt/shippingDocument/printForn/stores/shipDocumentStore'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

pdfMake.vfs = pdfFonts.pdfMake.vfs

export function usePrintManager(tabKey, templateMapping) {
  const store = useShipDocumentStore()
  const isPrinting = ref(false)

  const print = async (target, customData = null) => {
    isPrinting.value = true
    try {
      const templateFn = templateMapping[target]
      if (!templateFn) throw new Error(`No template for target: ${target}`)

      // ดึงข้อมูลจาก store หรือรับ customData
      const data = customData || store.getTabData(tabKey)

      // templateFn อาจเป็นฟังก์ชัน async (รองรับ dynamic import)
      const docDefinition = await templateFn(data)

      // สร้าง PDF
      return new Promise(resolve => {
        pdfMake.createPdf(docDefinition).getBlob(blob => {
          const url = URL.createObjectURL(blob)

          window.open(url, '_blank')
          setTimeout(() => URL.revokeObjectURL(url), 60000)
          resolve()
        })
      })
    } catch (err) {
      console.error('Print failed:', err)

      // อาจแสดง Toast แจ้ง error
    } finally {
      isPrinting.value = false
    }
  }

  return { isPrinting, print }
}
