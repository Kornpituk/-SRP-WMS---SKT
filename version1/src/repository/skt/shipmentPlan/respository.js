import axios from '@axios'
import { saveAs } from 'file-saver'

export const shipmentPlanRepository = {
  async getPermissionUser(urlApi, form, whereHouse, accessToken, params = {}) {
    try {
      const response = await axios.get(`${urlApi}/api/UserShipping/${form}`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          empId: params.empId || '',
          statusId: params.statusId || '',
          uiControlContextId: params.uiControlContextId || '',
        },
      })
    
      if (response && response.data) {
        // //console.log('success get repo getPermissionUser...')

        // //console.log('Service Response data getPermissionUser:', response.data)
            
        return { data: response.data, success: true }
      } else {
        //console.log('Error repo Error If getPermissionUser...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      //console.log('Error repo Error Try getPermissionUser...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch getPermissionUser ${error.response?.data?.message || error.message}`)
    }
  },

  //------------------------------ Get ----------------------------
  async getSelect(urlApi, form, type, whereHouse, accessToken) {
    try {
      const response = await axios.get(`${urlApi}/api/v1/${type}/${form}`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
    
      if (response && response.data) {

        // //console.log('Service Response data getSelect:', response.data)
            
        return { data: response.data, success: true }
      } else {
        //console.log('Error repo Error If getSelect...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      //console.log('Error repo Error Try getSelect...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch getSelect ${error.response?.data?.message || error.message}`)
    }
  },

  async getDataTruckOrderRepo(urlApi, SoeId, form, type, whereHouse, accessToken) {
    try {
      const response = await axios.get(`${urlApi}/api/v1/${type}/${form}/${SoeId}`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
    
      if (response && response.data) {

        // //console.log('Service Response data getSelect:', response.data)
            
        return { data: response.data, success: true }
      } else {
        //console.log('Error repo Error If getSelect...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      //console.log('Error repo Error Try getSelect...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch getSelect ${error.response?.data?.message || error.message}`)
    }
  },

  async getSearchPlan(urlApi, form, whereHouse, accessToken, params = {}, statusID) {
    try {
      const response = await axios.get(`${urlApi}/api/v1/ShipmentPlan/${form}`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          StatusId: statusID || '',
          ETA: params.ETA || '',
          ETD_St: params.ETDDateFrom || '',
          ETD_END: params.ETDDateTo || '',
          SalesOrderNoSearch: params.SalesOrderNoSearch || '',
          PayerNameSearch: params.PayerNameSearch || '',
          ItemNameSearch: params.ItemNameSearch || '',
          LotSearch: params.LotSearch || '',
          SortColumn: params.SortColumn || '',
          SortDirection: params.SortDirection || '',
        },
      })
    
      if (response && response.data) {

        // //console.log('Service Response data getSearchPlan:', response.data)
            
        return { data: response.data, success: true }
      } else {
        //console.log('Error repo Error If getSearchPlan...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      //console.log('Error repo Error Try getSearchPlan...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch getSearchPlan ${error.response?.data?.message || error.message}`)
    }
  },

  //---------------------------- post --------------------------------
  async saveSearchPlan(urlApi, form, whereHouse, accessToken, body) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/ShipmentPlan/${form}`, body, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
    
      if (response && response.data) {
        //console.log('success get repo saveSearchPlan...')

        // //console.log('Service Response data saveSearchPlan:', response.data)
            
        return { data: response.data, success: true }
      } else {
        //console.log('Error repo Error If saveSearchPlan...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      //console.log('Error repo Error Try saveSearchPlan...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch saveSearchPlan ${error.response?.data?.message || error.message}`)
    }
  },

  async saveTruckOrderRepo(urlApi, form, whereHouse, accessToken, body) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/ShippingTruckOrder/${form}`, {}, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          soEtlLogDetailJournalID: body.soEtlLogDetailJournalID,
          company: body.company,
          address: body.address,
          transComName: body.transComName,
          truckType: body.truckType,
          truckLicense: body.truckLicense,
          driverName: body.driverName,
          contactAndTel: body.contactAndTel,
          remark: body.remark,
          driverAndTel: body.driverAndTel,
          orderBy: body.orderBy,
          authorizedBy: body.authorizedBy,
          contactDate: body.contactDate,
          orderDate: body.orderDate,
          authorizedDate: body.authorizedDate,
          lastPrintDateTime: body.lastPrintDateTime,
        },
      })
    
      if (response && response.data) {
        //console.log('success get repo saveTruckOrderRepo...')

        // //console.log('Service Response data saveTruckOrderRepo:', response.data)
            
        return { data: response.data, success: true }
      } else {
        //console.log('Error repo Error If saveTruckOrderRepo...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      //console.log('Error repo Error Try saveTruckOrderRepo...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch saveTruckOrderRepo ${error.response?.data?.message || error.message}`)
    }
  },

  async submitShipmentPlan(urlApi, form, whereHouse, accessToken, edId, comment) {
    //console.log('submitShipmentPlan repo...')
    try {
      let response
      if(form === 'approve' || form === 'submit' || form === 'back'){
        response = await axios.post(`${urlApi}/api/v1/ShipmentPlan/${form}/${edId}`, {}, {
          headers: {
            'accept': '*/*',
            'x-location': whereHouse,
            Authorization: `Bearer ${accessToken}`,
          },
        })
      }else if(form === 'reject'){
        response = await axios.post(`${urlApi}/api/v1/ShipmentPlan/${form}/${edId}`, {}, {
          headers: {
            'accept': '*/*',
            'x-location': whereHouse,
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            Comment: comment,
          },
        })
      }
      
    
      if (response && response.data) {
        //console.log('success get repo submit Shipment Plan...')

        // //console.log('Service Response data submit Shipment Plan:', response.data)
            
        return { data: response.data, success: true }
      } else {
        //console.log('Error repo Error If submit Shipment Plan...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      //console.log('Error repo Error Try submit Shipment Plan...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch submit Shipment Plan ${error.response?.data?.message || error.message}`)
    }
  },

  //-------------------------------- Print ----------------------------------
  async printShipperPDFRepo(urlApi, type, whereHouse, accessToken, edId) {
    try {
      const url = ref('')

      if(type === 'ShippingCheckSheet'){
        url.value = `${urlApi}/api/v1/PrintForm/Shipment/ShippingCheckSheet/Pdf`
        
      }else{
        url.value = `${urlApi}/api/v1/PrintLabel/ShipmertPlan/Pdf/${type}/${edId}`
      }

      const response = await axios.post(
        url.value,
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
        //console.log('Service Response print PDF  form:', response.data)
  
        // สร้าง Blob จาก response
        const blob = new Blob([response.data], { type: 'application/pdf' })
  
        // สร้าง URL สำหรับ Blob
        const blobUrl = URL.createObjectURL(blob)
  
        // เปิดหน้าต่างใหม่เพื่อแสดง PDF หรือเปลี่ยนเป็นการดาวน์โหลดก็ได้
        window.open(blobUrl)
  
        return { success: true, data: blob }
      } else {
        throw new Error('No data Genterate print PDF  form')
      }
    } catch (error) {
      console.error('Error in printPDF Barcode:', error)
      throw new Error(`Failed to printPDF Barcode for Lot ${edId}: ${error.response?.data?.message || error.message}`)
    }
  },

  async printTruckOrderFormPDFRepo(urlApi, param = {}, whereHouse, accessToken, soId) {
    try {
      const response = await axios.post(
        `${urlApi}/api/v1/PrintForm/Shipment/TruckOrder/Pdf/${soId}`,
        {},
        {
          headers: this.getHeaders(whereHouse, accessToken),
          params: this.getParams(param),
          responseType: 'blob', // รับ response เป็น Blob
        },
      )
  
      if (response && response.data) {
        return this.handleResponse(response)
      } else {
        throw new Error('No data Genterate print PDF  form')
      }
    } catch (error) {
      this.handleError(error, soId)
    }
  },

  getHeaders(whereHouse, accessToken) {
    return {
      'accept': 'application/pdf', // รับไฟล์ PDF
      'x-location': whereHouse,
      Authorization: `Bearer ${accessToken}`,
    }
  },

  getParams(param) {
    return {
      runningNum: param.runningNum || '',
      comName: param.comName || '',
      address: param.address || '',
      transportComName: param.transportComName || '',
      truckType: param.truckType || '',
      truckLicense: param.truckLicense || '',
      driverName: param.driverName || '',
      tel: param.tel || '',
      remark: param.remark || '',
      driverBy: param.driverBy || '',
      dateDriverBy: param.dateDriverBy || '',
      orderBy: param.orderBy || '',
      dateOrderBy: param.dateOrderBy || '',
      authorizedBy: param.authorizedBy || '',
      dateAuthorizedBy: param.dateAuthorizedBy || '',
    }
  },

  handleResponse(response) {
    //console.log('Service Response print PDF  form:', response.data)
  
    // สร้าง Blob จาก response
    const blob = new Blob([response.data], { type: 'application/pdf' })
  
    // สร้าง URL สำหรับ Blob
    const blobUrl = URL.createObjectURL(blob)
  
    // เปิดหน้าต่างใหม่เพื่อแสดง PDF หรือเปลี่ยนเป็นการดาวน์โหลดก็ได้
    window.open(blobUrl)
  
    return { success: true, data: blob }
  },

  handleError(error, soId) {
    console.error('Error in printPDF Barcode:', error)
    throw new Error(`Failed to printPDF Barcode for Lot ${soId}: ${error.response?.data?.message || error.message}`)
  },

  //------------------------------ Export Excel ------------------------------
  async printExportExcel(urlApi, form, type, whereHouse, accessToken, params = {}, statusID) {
    try {
      const response = await axios.get(
        `${urlApi}/api/v1/${form}/ExportExcel/${type}/Detail`,
        {
          headers: {
            'accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
            'x-location': whereHouse,
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            StatusId: statusID || '',
            ETA: params.ETA || '',
            ETD: params.ETD || '',
            SalesOrderNoSearch: params.SalesOrderNoSearch || '',
            PayerNameSearch: params.PayerNameSearch || '',
            ItemNameSearch: params.ItemNameSearch || '',
            LotSearch: params.LotSearch || '',
            SortColumn: params.SortColumn || '',
            SortDirection: params.SortDirection || '',
          },
          responseType: 'blob', // รับ response เป็น Blob
        },
      )
  
      if (response && response.data) {
        //console.log('Service Response export Excel form:', response.data)
  
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

}

//--------------------------------- File ----------------------------------------
export const FileService = {
  async fetchFileForm(soEtlLogDetailJournalID, form, type, urlApi, whereHouse, accessToken) {
    try {
      const response = await axios.get(`${urlApi}/api/v1/${form}/${type}/${soEtlLogDetailJournalID}`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
        
      if (response && response.data) {
        // //console.log(`Service Response data File:`, response.data)
          
        return { success: true, data: response.data }
      } else {
        // throw { success: false, error }
      }
    } catch (error) {
      // console.error('Error in fetchFileForm:', error)
      // throw new Error(`Failed to fetch header for ID ${soEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)

      return { success: false, error: error.response?.data?.message || 'Unknown error' }
    }
  },

  async saveDraftFileForm(files, soEtlLogDetailJournalID, form, urlApi, whereHouse, accessToken) {
    const formData = new FormData()

    // Loop ผ่านไฟล์ที่ต้องการอัปโหลด
    // ตรวจสอบว่า files.files มีค่าหรือไม่
    if (files?.files) {
      //console.log('Have File Selected', files.files)

      // Loop ผ่านไฟล์ที่ต้องการอัปโหลด
      files.files.forEach(file => {
        formData.append('files', file.file) // ใช้ file.file เพราะไฟล์ถูกเก็บใน key `file`
      })
    } else {
      //console.log('No File Selected', files)
    }

    //console.log("Files Upload", files)

    try {
      const response = await axios.post(`${urlApi}/api/v1/ShippingFile/${form}/${soEtlLogDetailJournalID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-location': whereHouse,
          'Authorization': `Bearer ${accessToken}`,
        },
      })

      return { success: true, data: response.data.data }
    } catch (error) {
      // throw { success: false, error }
    }
  },

  // async saveDraftFileForm(files, soEtlLogDetailJournalID, form, urlApi, whereHouse, accessToken) {
  //   const formData = new FormData()
  
  //   // แยกประเภทไฟล์
  //   const fileList = files?.files || []
  //   const apiFiles = fileList.filter(file => file.fileUri) // ไฟล์จาก API
  //   const uploadedFiles = fileList.filter(file => file.file) // ไฟล์ที่เพิ่งอัปโหลด
  
  //   //console.log("API Files:", apiFiles)
  //   //console.log("Uploaded Files:", uploadedFiles)
  
  //   // แปลง API Files ให้มีโครงสร้างแบบ Uploaded Files
  //   const transformedApiFiles = await Promise.all(apiFiles.map(async file => {
  //     try {
  //       const response = await fetch(file.fileUri, { 
  //         headers: { 'Authorization': `Bearer ${accessToken}` }, // ใช้ token ถ้าจำเป็น
  //       })

  //       const blob = await response.blob()
  //       const objectUrl = URL.createObjectURL(blob)
  
  //       return {
  //         file: blob,
  //         name: file.fileName,
  //         objectUrl: objectUrl,
  //         type: file.contentType.includes("image") ? "image" : "other",
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch file from API:", file.fileUri, error)
        
  //       return null
  //     }
  //   }))
  
  //   // รวมไฟล์ทั้งหมด (ที่โหลดจาก API + ที่อัปโหลดใหม่)
  //   const allFiles = [...transformedApiFiles.filter(Boolean), ...uploadedFiles]
  
  //   // เพิ่มไฟล์ทั้งหมดลงใน FormData
  //   allFiles.forEach(file => {
  //     formData.append('files', file.file)
  //   })
  
  //   if (allFiles.length === 0) {
  //     //console.log("No File Selected")
      
  //     return { success: false, error: "No files to upload" }
  //   }
  
  //   try {
  //     const response = await axios.post(`${urlApi}/api/v1/ShippingFile/${form}/${soEtlLogDetailJournalID}`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         'x-location': whereHouse,
  //         'Authorization': `Bearer ${accessToken}`,
  //       },
  //     })
  
  //     return { success: true, data: response.data.data }
  //   } catch (error) {
  //     console.error("Upload failed", error)
      
  //     return { success: false, error }
  //   }
  // },

  async deleteCoaForm(body, poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken) {

    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/DeleteCoa/${poEtlLogDetailJournalID}`, body, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      if (response && response.data) {
        //console.log('Service Response data detelete coa:', response.data.messageResult)
        
        return { success: true, data: response.data.messageResult }
      } else {
        throw new Error('No data delete coa from the server')
      }
    } catch (error) {
      console.error('Error in deleteCoaForm:', error)
      error = new Error(`Deleted to coa by id for ID ${poEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
      throw { success: false, error }
    }
  },

  async deleteFileForm(soEtlLogDetailJournalID,  form, urlApi, whereHouse, accessToken) {

    try {
      const response = await axios.post(`${urlApi}/api/v1/ShippingFile/${form}/${soEtlLogDetailJournalID}`, {}, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      if (response && response.data) {
        //console.log('Service Response data all detelete coa:', response.data.messageResult)
        
        return { success: true, data: response.data.messageResult }
      } else {
        throw new Error('No data delete all coa from the server')
      }
    } catch (error) {
      console.error('Error in deleteAllCoaForm:', error)
      error = new Error(`Deleted to coa all for ID ${soEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
      throw { success: false, error }
    }
  },
}

//---------------------------------- check sheet -------------------

export const checkSheetShipmentPlanRepository = {

  //------------------------------ Get ----------------------------

  async getShippingCheckSheet(urlApi, form, whereHouse, accessToken, SoEId) {
    try {
      const response = await axios.get(`${urlApi}/api/v1/${form}/get/${SoEId}`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
    
      if (response && response.data) {

        // //console.log('Service Response data getShippingCheckSheet:', response.data)
            
        return { data: response.data, success: true }
      } else {
        //console.log('Error repo Error If getShippingCheckSheet...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      //console.log('Error repo Error Try getShippingCheckSheet...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch getShippingCheckSheet ${error.response?.data?.message || error.message}`)
    }
  },

  async getShippingChecksheetImage(urlApi, form, whereHouse, accessToken, ItemCode, fileName  ) {
    try {
      const response = await axios.get(`${urlApi}/api/v1/ShippingFile/${form}/${ItemCode}/${fileName}`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
    
      if (response && response.data) {

        // //console.log('Service Response data getShippingCheckSheet:', response.data)
            
        return { data: response.data, success: true }
      } else {
        // //console.log('Error repo Error If getShippingChecksheetImage...')
        // throw new Error('No data received from the server')
      }
    } catch (error) {
      // //console.log('Error repo Error Try getShippingChecksheetImage...')
      // console.error('Error in getProductionPlan:', error)

      // throw new Error(`Failed to fetch getShippingChecksheetImage ${error.response?.data?.message || error.message}`)
    }
  },

  async getShippingSpecialConditionIcon(urlApi, form, whereHouse, accessToken, ItemCode, fileName  ) {
    try {
      const response = await axios.get(`${urlApi}/api/v1/ShippingCheckSheetFile/${form}/${fileName}/${ItemCode}`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
    
      if (response && response.data) {

        // //console.log('Service Response data getShippingCheckSheet:', response.data)
            
        return { data: response.data, success: true }
      } else {
        // //console.log('Error repo Error If getShippingChecksheetImage...')
        // throw new Error('No data received from the server')
      }
    } catch (error) {
      // //console.log('Error repo Error Try getShippingChecksheetImage...')
      // console.error('Error in getProductionPlan:', error)

      // throw new Error(`Failed to fetch getShippingChecksheetImage ${error.response?.data?.message || error.message}`)
    }
  },

  async getShippingCheckSheetFile(urlApi, form, whereHouse, accessToken,  userCode, itemCode, fileName, licensePlate) {
    try {

      let response
      if(form === 'GetSpecialConditionIcon'){
        response = await axios.get(`${urlApi}/api/v1/ShippingCheckSheetFile/${userCode}/${itemCode}`, {
          headers: {
            'accept': '*/*',
            'x-location': whereHouse,
            Authorization: `Bearer ${accessToken}`,
          },
        })
      }else if(form === 'ShippingSpecialConditionIcon'){
        response = await axios.get(`${urlApi}/api/v1/ShippingCheckSheetFile/${form}/${fileName}`, {
          headers: {
            'accept': '*/*',
            'x-location': whereHouse,
            Authorization: `Bearer ${accessToken}`,
          },
        })
      }else if(form === 'licensePlate'){
        response = await axios.get(`${urlApi}/api/v1/ShippingCheckSheetFile/${form}/${fileName}/${licensePlate }`, {
          headers: {
            'accept': '*/*',
            'x-location': whereHouse,
            Authorization: `Bearer ${accessToken}`,
          },
        })
      }
      
      if (response && response.data) {

        // //console.log('Service Response data getShippingCheckSheet:', response.data)
            
        return { data: response.data, success: true }
      } else {
        //console.log('Error repo Error If getShippingCheckSheet...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      //console.log('Error repo Error Try getShippingCheckSheet...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch getShippingCheckSheet ${error.response?.data?.message || error.message}`)
    }
  },

  //---------------------------- post --------------------------------
  async generateForm(urlApi, form, whereHouse, accessToken, edId) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/regenerate?journalId=${edId}`, {}, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
    
      if (response && response.data) {
        //console.log(`success get repo generate ${form}...`)

        // //console.log('Service Response data generate ${form}:', response.data)
            
        return { data: response.data, success: true }
      } else {
        //console.log(`Error repo Error If generate ${form}...`)
        throw new Error(`No data received from the server`)
      }
    } catch (error) {
      //console.log(`Error repo Error Try generate ${form}...`)
      console.error(`Error in getProductionShippingForm:`, error)
      throw new Error(`Failed to fetch generate ${form} ${error.response?.data?.message || error.message}`)
    }
  },

  async saveShippingCheckSheet(urlApi, form, whereHouse, accessToken, body) {
    try {

      const response = await axios.post(`${urlApi}/api/v1/ShippingCheckSheet/${form}`, body, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
    
      if (response && response.data) {
        //console.log('success get repo ShippingCheckSheet...')

        // //console.log('Service Response data ShippingCheckSheet:', response.data)
            
        return { data: response.data, success: true }
      } else {
        //console.log('Error repo Error If ShippingCheckSheet...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      //console.log('Error repo Error Try ShippingCheckSheet...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch ShippingCheckSheet ${error.response?.data?.message || error.message}`)
    }
  },

  async submitCheckSheet(urlApi, form, whereHouse, accessToken, SoEId) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/ShippingCheckSheet/${form}/${SoEId}`, {}, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
    
      if (response && response.data) {
        //console.log('success get repo submit CheckSheet...')

        // //console.log('Service Response data submit CheckSheet:', response.data)
            
        return { data: response.data, success: true }
      } else {
        //console.log('Error repo Error If submit CheckSheet...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      //console.log('Error repo Error Try submit CheckSheet...')
      throw new Error(`${error.response?.data?.message || error.message}`)
    }
  },

  //-------------------------------- Print ----------------------------------
  
}

//---------------------------------- CheckSheet File -------------------
export const FileShippingCheckSheetFileService = {
  async fetchShippingCheckSheetFileForm(soEtlLogDetailJournalID, LicensePlate, form, type, urlApi, whereHouse, accessToken) {
    try {

      let response
      if(type === 'GetLicensePlate'){
        response = await axios.get(`${urlApi}/api/v1/${form}/${type}/${soEtlLogDetailJournalID}/${LicensePlate}`, {
          headers: {
            'accept': '*/*',
            'x-location': whereHouse,
            Authorization: `Bearer ${accessToken}`,
          },
        })
      }
        
      if (response && response.data) {
        // //console.log(`Service Response data File:`, response.data)
          
        return { success: true, data: response.data }
      } else {
        // throw { success: false, error }
      }
    } catch (error) {
      // console.error('Error in fetchFileForm:', error)
      // throw new Error(`Failed to fetch header for ID ${soEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
    }
  },

  async saveShippingCheckSheetFileForm(files, soEtlLogDetailJournalID, licensePlate, form, urlApi, whereHouse, accessToken) {
    const formData = new FormData()

    // Loop ผ่านไฟล์ที่ต้องการอัปโหลด
    // ตรวจสอบว่า files.files มีค่าหรือไม่
    if (files) {
      //console.log('Have File Selected', files)

      // Loop ผ่านไฟล์ที่ต้องการอัปโหลด
      files.forEach(file => {
        formData.append('files', file) // ใช้ file.file เพราะไฟล์ถูกเก็บใน key `file`
      })
    } else {
      //console.log('No File Selected', files)
    }

    //console.log("Files Upload", files, soEtlLogDetailJournalID, licensePlate, form, urlApi, whereHouse, accessToken)

    let url = `${urlApi}/api/v1/ShippingCheckSheetFile/${form}/
    ${soEtlLogDetailJournalID}/${licensePlate}`
    let url2 = `https://sktdevwebapi.easetrackwms.com/api/v1/ShippingCheckSheetFile/SaveLicensePlate/276/%E0%B8%81%E0%B8%A21556`

    try {
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-location': whereHouse,
          'Authorization': `Bearer ${accessToken}`,
        },
      })

      return { success: true, data: response.data.data }
    } catch (error) {
      throw { success: false, error }
    }
  },

  async deleteCoaForm(body, poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken) {

    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/DeleteCoa/${poEtlLogDetailJournalID}`, body, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      if (response && response.data) {
        //console.log('Service Response data detelete coa:', response.data.messageResult)
        
        return { success: true, data: response.data.messageResult }
      } else {
        throw new Error('No data delete coa from the server')
      }
    } catch (error) {
      console.error('Error in deleteCoaForm:', error)
      error = new Error(`Deleted to coa by id for ID ${poEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
      throw { success: false, error }
    }
  },

  async deleteFileForm(soEtlLogDetailJournalID, licensePlate, fileName, type, form, urlApi, whereHouse, accessToken) {

    try {
      let response

      if(type === 'DeleteOneLicensePlate'){
        response = await axios.post(`${urlApi}/api/v1/${form}/${type}/${soEtlLogDetailJournalID}/${licensePlate}/${fileName}`, {}, {
          headers: {
            'accept': '*/*',
            'x-location': whereHouse,
            Authorization: `Bearer ${accessToken}`,
          },
        })
      }else if(type === 'DeleteAllLicensePlate'){
        response = await axios.post(`${urlApi}/api/v1/${form}/${type}/${soEtlLogDetailJournalID}/${licensePlate}`, {}, {
          headers: {
            'accept': '*/*',
            'x-location': whereHouse,
            Authorization: `Bearer ${accessToken}`,
          },
        })
      }
      
      
      if (response && response.data) {
        //console.log('Service Response data all delete :', response.data.messageResult)
        
        return { success: true, data: response.data.messageResult }
      } else {
        throw new Error('No data delete all  from the server')
      }
    } catch (error) {
      console.error('Error in deleteAllCoaForm:', error)
      error = new Error(`Deleted to  all for ID ${soEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
      throw { success: false, error }
    }
  },
}


//---------------------------------- check sheet Lorry /Flexi  -------------------

export const checkSheetLorryFlexiRepository = {

  async getShippingCheckSheetLorry(urlApi, form, whereHouse, accessToken, SoEId) {
    try {
      const response = await axios.get(`${urlApi}/api/v1/${form}/get/${SoEId}`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
    
      if (response && response.data) {

        // //console.log('Service Response data getShippingCheckSheet:', response.data)
            
        return { data: response.data, success: true }
      } else {
        //console.log('Error repo Error If getShippingCheckSheet...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      //console.log('Error repo Error Try getShippingCheckSheet...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch getShippingCheckSheet ${error.response?.data?.message || error.message}`)
    }
  },

  async saveShippingCheckSheetLorry(urlApi, form, whereHouse, accessToken, body) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/ShippingLorryFlexi/${form}`, body, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
    
      if (response && response.data) {
        //console.log('success get repo ShippingLorryFlexi...')

        // //console.log('Service Response data ShippingLorryFlexi:', response.data)
            
        return { data: response.data, success: true }
      } else {
        //console.log('Error repo Error If ShippingLorryFlexi...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      //console.log('Error repo Error Try ShippingLorryFlexi...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch ShippingLorryFlexi ${error.response?.data?.message || error.message}`)
    }
  },

  async submitShippingCheckSheetLorry(urlApi, form, whereHouse, accessToken, edId, comment) {
    //console.log('submitShipmentPlan repo...')
    try {
      let response
      if(form === 'leaderapprove' || form === 'submit'|| form === 'back'){
        response = await axios.post(`${urlApi}/api/v1/ShippingLorryFlexi/${form}/${edId}`, {}, {
          headers: {
            'accept': '*/*',
            'x-location': whereHouse,
            Authorization: `Bearer ${accessToken}`,
          },
        })
      }else if(form === 'reject' || form === 'Reject'){
        response = await axios.post(`${urlApi}/api/v1/ShippingLorryFlexi/${form}/${edId}`, {}, {
          headers: {
            'accept': '*/*',
            'x-location': whereHouse,
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            Comment: comment,
          },
        })
      }
    
      if (response && response.data) {
        //console.log('success get repo submit Shipment Plan...')

        // //console.log('Service Response data submit Shipment Plan:', response.data)
            
        return { data: response.data, success: true }
      } else {
        //console.log('Error repo Error If submit Shipment Plan...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      //console.log('Error repo Error Try submit Shipment Plan...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch submit Shipment Plan ${error.response?.data?.message || error.message}`)
    }
  },

  //---------------------------- Print Check sheet PDF ----------------
  async printPDF(urlApi, form, type, whereHouse, accessToken, params = {}, LicensePlate, page) {
    try {
      if(!params){
        throw 'params not f', params
      }else{
        //console.log('params repo', params)
      }

      let response

      if(type === 'ShippingCheckSheet'){
        response = await axios.post(
          `${urlApi}/api/v1/PrintForm/Shipment/${type}/${form}/
          ${params[0].SoEtlLogDetailJournalID}/${params[0].SaleOrder}/${params[0].UserCode}/${params[0].ItemCode}/${page}`, {},
          {
            headers: {
              'accept': '*/*', 
              'x-location': whereHouse,
              Authorization: `Bearer ${accessToken}`,
            },

            responseType: 'blob', // รับ response เป็น Blob
          },
        )
      }else if(type === 'ShippingCheckSheetIBC2'){
        let dataParameters = {
          SaleOrder: params[0].SaleOrder,
          Customer: params[0].Customer, ///---- UserCode
          ItemName: params[0].ItemName,
          Code: params[0].ItemCode, /// -- ItemCode
          page: page,
        }
        response = await axios.post(
          `${urlApi}/api/v1/PrintForm/Shipment/${type}/${form}/${params[0].SoEtlLogDetailJournalID}
          /${params[0].ItemName }/${params[0].ItemCode}/${params[0].Customer}/${params[0].SaleOrder}/${page}`, {},
          {
            headers: {
              'accept': '*/*', 
              'x-location': whereHouse,
              Authorization: `Bearer ${accessToken}`,
            },

            // params: {
            //   SaleOrder: params[0].SaleOrder,
            //   Customer: params[0].Customer, ///---- UserCode
            //   ItemName: params[0].ItemName,
            //   Code: params[0].ItemCode, /// -- ItemCode
            // },
            responseType: 'blob', // รับ response เป็น Blob
          },
        )
      }else if(type === 'ShippingCheckSheetContainer'){
        response = await axios.post(
          `${urlApi}/api/v1/PrintForm/Shipment/${type}/${form}/${params[0].SoEtlLogDetailJournalID}/${LicensePlate}/${params[0].SaleOrder}/${page}`, {}, 
          {
            headers: {
              'accept': '*/*', 
              'x-location': whereHouse,
              Authorization: `Bearer ${accessToken}`,
            },
            responseType: 'blob', // รับ response เป็น Blob
          },
        )
      }else if(type === 'ShippingLorry'|| type === 'ShippingFlexi'){
        let dataParameters = {
          Customer: params[0].Customer,
          ItemName: params[0].ItemName,
          SaleOrder: params[0].SaleOrder,
        }
        response = await axios.post(
          `${urlApi}/api/v1/PrintForm/Shipment/${type}/${form}/${params[0].SoEtlLogDetailJournalID}
          /${params[0].Customer}/${params[0].ItemName}/${params[0].SaleOrder}/${params[0].location}`, {},
          {
            headers: {
              'accept': '*/*', 
              'x-location': whereHouse,
              Authorization: `Bearer ${accessToken}`,
            },

            // params: {
            //   Customer: params[0].Customer,
            //   ItemName: params[0].ItemName,
            // },
            responseType: 'blob', // รับ response เป็น Blob
          },
        )
      }else{
        throw 'Invalid Type: ' + type
      }
      if (response && response.data) {
        //console.log('Service Response print PDF  form:', response.data)
  
        // สร้าง Blob จาก response
        const blob = new Blob([response.data], { type: 'application/pdf' })

        const now = new Date()
        const dd = String(now.getDate()).padStart(2, '0')
        const mm = String(now.getMonth() + 1).padStart(2, '0') // เดือนเริ่มจาก 0
        const yyyy = now.getFullYear()
        const hh = String(now.getHours()).padStart(2, '0')
        const min = String(now.getMinutes()).padStart(2, '0')

        const formattedDate = `date/${dd}/${mm}/${yyyy} time/(${hh}/${min})`

        saveAs(blob, `page_${page}_${type}_report_${formattedDate}.pdf`)  // ตั้งชื่อไฟล์
  
        return { success: true, data: blob }
      } else {
        throw new Error('No data Genterate print PDF  form')
      }
    } catch (error) {
      console.error('Error in export excel:', error)
      throw new Error(`Failed to export Excel file: ${error.response?.data?.message || error.message}`)
    }
  },

}

