
import axios from '@axios'

export const  globalService = {
  
  async generateViewForm(poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) {
    try {
      const response = await axios.get(`${urlApi}/api/v1/ReceivingPlan/View/${poEtlLogDetailJournalID}`, {}, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
        
      if (response && response.data) {
        console.log('Service Response data Genterate View:', response.data.data)
          
        return response.data.data
      } else {
        throw new Error('No data Genterate View from the server')
      }
    } catch (error) {
      console.error('Error in generatePackagingIdForm:', error)
      throw new Error(`Failed to fetch header for ID ${poEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
    }
  },

  async printReceivingFormPDF(poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) {
    try {
      const response = await axios.post(
        `${urlApi}/api/v1/PrintForm/ReceivingForm/Pdf/${poEtlLogDetailJournalID}`,
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
        console.log('Service Response print receiving form:', response.data)
  
        // สร้าง Blob จาก response
        const blob = new Blob([response.data], { type: 'application/pdf' })
  
        // สร้าง URL สำหรับ Blob
        const blobUrl = URL.createObjectURL(blob)
  
        // เปิดหน้าต่างใหม่เพื่อแสดง PDF หรือเปลี่ยนเป็นการดาวน์โหลดก็ได้
        window.open(blobUrl)
  
        return { success: true, data: blob }
      } else {
        throw new Error('No data Genterate print receiving form')
      }
    } catch (error) {
      console.error('Error in printReceivingFormPDF:', error)
      throw new Error(`Failed to printReceivingFormPDF for ID ${poEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
    }
  },

  async printInspectionFormPDF(poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) {
    try {
      const response = await axios.post(
        `${urlApi}/api/v1/PrintForm/Inspection/Pdf/${poEtlLogDetailJournalID}`,
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
        console.log('Service Response print Inspection form:', response.data)
  
        // สร้าง Blob จาก response
        const blob = new Blob([response.data], { type: 'application/pdf' })
  
        // สร้าง URL สำหรับ Blob
        const blobUrl = URL.createObjectURL(blob)
  
        // เปิดหน้าต่างใหม่เพื่อแสดง PDF หรือเปลี่ยนเป็นการดาวน์โหลดก็ได้
        window.open(blobUrl)
  
        return { success: true, data: blob }
      } else {
        throw new Error('No data Genterate print Inspection form')
      }
    } catch (error) {
      console.error('Error in printInspectionFormPDF:', error)
      throw new Error(`Failed to printInspectionFormPDF for ID ${poEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
    }
  },
  
}
  