import axios from '@axios'

export const ipaRepo = {
  async printIPAFormPDF(typeLorryID, poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) {
    try {
      const response = await axios.post(
        `${urlApi}/api/v1/PrintForm/${typeLorryID}/Pdf/${poEtlLogDetailJournalID}`,
        {},
        {
          headers: {
            'accept': 'application/pdf', // รับไฟล์ PDF
            'x-location': whereHouse,
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: 'blob', // รับ response เป็น Blob
        },
      )
      
      if (response && response.data) {
        console.log('Service Response print IPA form:', response.data)
      
        // สร้าง Blob จาก response
        const blob = new Blob([response.data], { type: 'application/pdf' })
      
        // สร้าง URL สำหรับ Blob
        const blobUrl = URL.createObjectURL(blob)
      
        // เปิดหน้าต่างใหม่เพื่อแสดง PDF หรือเปลี่ยนเป็นการดาวน์โหลดก็ได้
        window.open(blobUrl)
      
        return { success: true, data: blob }
      } else {
        throw new Error('No data Genterate print IPA form')
      }
    } catch (error) {
      console.error('Error in printIPAFormPDF:', error)
      throw new Error(`Failed to printReceivingFormPDF for ID ${poEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
    }
  },
}
