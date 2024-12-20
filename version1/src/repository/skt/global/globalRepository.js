
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

  async printReceivingFormPDF(typeReceiving, poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) {
    try {
      const response = await axios.post(
        `${urlApi}/api/v1/PrintForm/${typeReceiving}/Pdf/${poEtlLogDetailJournalID}`,
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

  async printPackagingFormPDF(poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) {
    try {
      const response = await axios.post(
        `${urlApi}/api/v1/PrintForm/PackagingForm/Pdf/${poEtlLogDetailJournalID}`,
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
        console.log('Service Response print PackagingForm form:', response.data)
  
        // สร้าง Blob จาก response
        const blob = new Blob([response.data], { type: 'application/pdf' })
  
        // สร้าง URL สำหรับ Blob
        const blobUrl = URL.createObjectURL(blob)
  
        // เปิดหน้าต่างใหม่เพื่อแสดง PDF หรือเปลี่ยนเป็นการดาวน์โหลดก็ได้
        window.open(blobUrl)
  
        return { success: true, data: blob }
      } else {
        throw new Error('No data Genterate print PackagingForm form')
      }
    } catch (error) {
      console.error('Error in printPackagingFormPDF:', error)
      throw new Error(`Failed to printPackagingFormPDF for ID ${poEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
    }
  },

  //--------------------------------------------------- Label

  async printLabelView(urlApi, whereHouse, accessToken, lot) {
    try {
      const response = await axios.get(
        `${urlApi}/api/v1/PrintLabel/Label?lot=${lot}`,
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
        console.log('Service Response print Label form:', response.data)
  
        // สร้าง Blob จาก response
        const blob = new Blob([response.data], { type: 'application/pdf' })
  
        // สร้าง URL สำหรับ Blob
        const blobUrl = URL.createObjectURL(blob)
  
        // เปิดหน้าต่างใหม่เพื่อแสดง PDF หรือเปลี่ยนเป็นการดาวน์โหลดก็ได้
        window.open(blobUrl)
  
        return { success: true, data: blob }
      } else {
        throw new Error('No data Genterate print Label form')
      }
    } catch (error) {
      console.error('Error in printLabelView:', error)
      throw new Error(`Failed to printLabelView for Lot ${lot}: ${error.response?.data?.message || error.message}`)
    }
  },

  async printLabelView(urlApi, whereHouse, accessToken, lot) {
    console.log('printLabelView Response print label View:', urlApi, whereHouse, accessToken, lot)
    try {
      const response = await axios.get(
        `${urlApi}/api/v1/PrintLabel/Label?lot=${lot}`, {},
        {
          headers: {
            'accept': '*/*',
            'x-location': whereHouse,
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      console.log('Print label Service try...', urlApi, whereHouse, accessToken, lot)
  
      if (response && response.data) {
        console.log('Service Response print label View:', response.data.data)

        console.log('Print label Service Response ...', response.data.data)
          
        return response.data.data
      } else {
        throw new Error('No data print label View from the server')
      }
    } catch (error) {
      console.error('Error in printLabelView:', error)
      throw new Error(`Failed to printLabelView for Lot ${lot}: ${error.response?.data?.message || error.message}`)
    }
  },


  //-----
  async getPrintLabel (form, urlApi, warehouseId, accessToken, params = {}) {
    try {
      const response = await axios.get(`${urlApi}/api/v1/PrintLabel/${form}`, {
        headers: {
          'accept': '*/*',
          'x-location': warehouseId,
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          lot: params.lot || '',
          productId: params.productId || '',
          productName: params.productName || '',
          purchaseOrderNo: params.purchaseOrderNo || '',
          receivedDate: params.receivedDate || '',
          category: params.category || '',
        },
      })

      return response.data
    } catch (error) {
      throw new Error(`Failed to printLabelView ${error.response?.data?.message || error.message}`)
    }
  },

  async getPrintLabelGroup (urlApi, warehouseId, accessToken, params = {}) {
    try {
      const response = await axios.get(`${urlApi}/api/v1/PrintLabel/Label`, {
        headers: {
          'accept': '*/*',
          'x-location': warehouseId,
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          lot: params.lot || '',
          productId: params.productId || '',
          productName: params.productName || '',
          purchaseOrderNo: params.purchaseOrderNo || '',
          receivedDate: params.receivedDate || '',
          category: params.category || '',
        },
      })

      return response.data
    } catch (error) {
      throw new Error(`Failed to printLabelView ${error.response?.data?.message || error.message}`)
    }
  },

  async saveToPrintLotByBarcode (urlApi, warehouseId, accessToken, barcode) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/PrintLabel/SaveToPrintLot/byBarcode`, barcode, {
        headers: {
          'accept': '*/*',
          'x-location': warehouseId,
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response && response.data) {
        console.log('Service Response save to print Barcode form:', response.data)
        
        return { success: true, data: response.data }
      } else {
        throw new Error('No data Genterate print Barcode form')
      }
    } catch (error) {
      throw new Error(`Failed to saveToPrintLotByBarcode ${error.response?.data?.message || error.message}`)
    }
  },

  async printLabelBarcode(urlApi, whereHouse, accessToken) {
    try {
      const response = await axios.post(
        `${urlApi}/api/v1/PrintLabel/Label/Small/Pdf`,
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
        console.log('Service Response print Label form:', response.data)
  
        // สร้าง Blob จาก response
        const blob = new Blob([response.data], { type: 'application/pdf' })
  
        // สร้าง URL สำหรับ Blob
        const blobUrl = URL.createObjectURL(blob)
  
        // เปิดหน้าต่างใหม่เพื่อแสดง PDF หรือเปลี่ยนเป็นการดาวน์โหลดก็ได้
        window.open(blobUrl)
  
        return { success: true, data: blob }
      } else {
        throw new Error('No data Genterate print Label form')
      }
    } catch (error) {
      console.error('Error in printLabelBarcode:', error)
      throw new Error(`Failed to printLabelBarcode for Lot ${lot}: ${error.response?.data?.message || error.message}`)
    }
  },

  async printLabelBarcodeGroup(urlApi, whereHouse, accessToken) {
    try {
      const response = await axios.post(
        `${urlApi}/api/v1/PrintLabel/Label/Small/Pdf`,
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
        console.log('Service Response print Label form:', response.data)
  
        // สร้าง Blob จาก response
        const blob = new Blob([response.data], { type: 'application/pdf' })
  
        // สร้าง URL สำหรับ Blob
        const blobUrl = URL.createObjectURL(blob)
  
        // เปิดหน้าต่างใหม่เพื่อแสดง PDF หรือเปลี่ยนเป็นการดาวน์โหลดก็ได้
        window.open(blobUrl)
  
        return { success: true, data: blob }
      } else {
        throw new Error('No data Genterate print Label form')
      }
    } catch (error) {
      console.error('Error in printLabelBarcode:', error)
      throw new Error(`Failed to printLabelBarcode for Lot ${lot}: ${error.response?.data?.message || error.message}`)
    }
  },

  async printExportExcel(urlApi, whereHouse, accessToken, params = {}) {
    try {
      const response = await axios.get(
        `${urlApi}/api/v1/ReceivingPlan/Summary/ReceivingExpire/Detail`,
        {
          headers: {
            'accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
            'x-location': whereHouse,
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            deliveryDateFrom: params.deliveryDateFrom,
            deliveryDateTo: params.deliveryDateTo,
            productId: params.productId,
            productName: params.productName,
            supplierId: params.supplierId,
            supplierName: params.supplierName,
            purchaseOrderNo: params.purchaseOrderNo,
            statusName: params.statusName,
          },
          responseType: 'blob', // รับ response เป็น Blob
        },
      )
  
      if (response && response.data) {
        console.log('Service Response export Excel form:', response.data)
  
        // สร้าง Blob จาก response
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  
        // สร้าง URL สำหรับ Blob
        const blobUrl = URL.createObjectURL(blob)
  
        // สร้างลิงก์สำหรับดาวน์โหลดไฟล์
        const link = document.createElement('a')

        link.href = blobUrl
        link.download = 'exported_file.xlsx' // ตั้งชื่อไฟล์ที่ต้องการให้ดาวน์โหลด
        document.body.appendChild(link)
        link.click()
  
        // ลบลิงก์ออกหลังการดาวน์โหลด
        document.body.removeChild(link)
        URL.revokeObjectURL(blobUrl) // ปิด URL Blob
  
        return { success: true, data: blob }
      } else {
        throw new Error('No data generated for export Excel form')
      }
    } catch (error) {
      console.error('Error in export excel:', error)
      throw new Error(`Failed to export Excel file: ${error.response?.data?.message || error.message}`)
    }
  },

  //---------------------- Pritn Production --------------------------------
  
  async getTempateByItemCode(ItemCode, urlApi, form, whereHouse, accessToken) {
    console.log('get repo getTempateByItemCode...')
    try {
      const response = await axios.get(`${urlApi}/api/v1/${form}/GetTemplatesByItemCode/${ItemCode}`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response && response.data) {
        console.log('success get repo getTempateByItemCode...')
        console.log('Service Response data getTempateByItemCode:', response.data.data)
        
        return { data: response.data.data, success: true }
      } else {
        console.log('Error repo Error If getTempateByItemCode...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try getTempateByItemCode...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch getTempateByItemCode ${error.response?.data?.message || error.message}`)
    }
  },
}
  