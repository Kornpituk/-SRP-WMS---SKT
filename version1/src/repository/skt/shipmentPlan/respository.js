import axios from '@axios'

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
        // console.log('success get repo getPermissionUser...')

        // console.log('Service Response data getPermissionUser:', response.data)
            
        return { data: response.data, success: true }
      } else {
        console.log('Error repo Error If getPermissionUser...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try getPermissionUser...')
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

        // console.log('Service Response data getSelect:', response.data)
            
        return { data: response.data, success: true }
      } else {
        console.log('Error repo Error If getSelect...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try getSelect...')
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
          ETD: params.ETD || '',
          SalesOrderNoSearch: params.SalesOrderNoSearch || '',
          PayerNameSearch: params.PayerNameSearch || '',
          ItemNameSearch: params.ItemNameSearch || '',
          LotSearch: params.LotSearch || '',
          SortColumn: params.SortColumn || '',
          SortDirection: params.SortDirection || '',
        },
      })
    
      if (response && response.data) {

        // console.log('Service Response data getSearchPlan:', response.data)
            
        return { data: response.data, success: true }
      } else {
        console.log('Error repo Error If getSearchPlan...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try getSearchPlan...')
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
        console.log('success get repo saveSearchPlan...')

        // console.log('Service Response data saveSearchPlan:', response.data)
            
        return { data: response.data, success: true }
      } else {
        console.log('Error repo Error If saveSearchPlan...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try saveSearchPlan...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch saveSearchPlan ${error.response?.data?.message || error.message}`)
    }
  },

  async submitShipmentPlan(urlApi, form, whereHouse, accessToken, edId) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/ShipmentPlan/${form}/${edId}`, {}, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
    
      if (response && response.data) {
        console.log('success get repo submit Shipment Plan...')

        // console.log('Service Response data submit Shipment Plan:', response.data)
            
        return { data: response.data, success: true }
      } else {
        console.log('Error repo Error If submit Shipment Plan...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try submit Shipment Plan...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch submit Shipment Plan ${error.response?.data?.message || error.message}`)
    }
  },

  async submitShipmentPlan(urlApi, form, whereHouse, accessToken, edId) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/ShipmentPlan/${form}/${edId}`, {}, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
    
      if (response && response.data) {
        console.log('success get repo submit Shipment Plan...')

        // console.log('Service Response data submit Shipment Plan:', response.data)
            
        return { data: response.data, success: true }
      } else {
        console.log('Error repo Error If submit Shipment Plan...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try submit Shipment Plan...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch submit Shipment Plan ${error.response?.data?.message || error.message}`)
    }
  },

  //-------------------------------- Print ----------------------------------
  async printShipperPDFRepo(urlApi, type, whereHouse, accessToken, edId) {
    try {
      const response = await axios.post(
        `${urlApi}/api/v1/PrintLabel/ShipmertPlan/Pdf/${type}/${edId}`,
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
        console.log('Service Response print PDF  form:', response.data)
  
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
    console.log('Service Response print PDF  form:', response.data)
  
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
        // console.log(`Service Response data File:`, response.data)
          
        return { success: true, data: response.data }
      } else {
        // throw { success: false, error }
      }
    } catch (error) {
      // console.error('Error in fetchFileForm:', error)
      // throw new Error(`Failed to fetch header for ID ${soEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
    }
  },

  async saveDraftFileForm(files, soEtlLogDetailJournalID, form, urlApi, whereHouse, accessToken) {
    const formData = new FormData()

    // Loop ผ่านไฟล์ที่ต้องการอัปโหลด
    // ตรวจสอบว่า files.files มีค่าหรือไม่
    if (files?.files) {
      console.log('Have File Selected', files.files)

      // Loop ผ่านไฟล์ที่ต้องการอัปโหลด
      files.files.forEach(file => {
        formData.append('files', file.file) // ใช้ file.file เพราะไฟล์ถูกเก็บใน key `file`
      })
    } else {
      console.log('No File Selected', files)
    }

    console.log("Files Upload", files)

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
        console.log('Service Response data detelete coa:', response.data.messageResult)
        
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

  async deleteAllCoaForm(poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken) {

    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/DeleteAllCoA/${poEtlLogDetailJournalID}`, {}, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      if (response && response.data) {
        console.log('Service Response data all detelete coa:', response.data.messageResult)
        
        return { success: true, data: response.data.messageResult }
      } else {
        throw new Error('No data delete all coa from the server')
      }
    } catch (error) {
      console.error('Error in deleteAllCoaForm:', error)
      error = new Error(`Deleted to coa all for ID ${poEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
      throw { success: false, error }
    }
  },
}

//---------------------------------- check sheet -------------------

export const checkSheetShipmentPlanRepository = {

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

        // console.log('Service Response data getSelect:', response.data)
            
        return { data: response.data, success: true }
      } else {
        console.log('Error repo Error If getSelect...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try getSelect...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch getSelect ${error.response?.data?.message || error.message}`)
    }
  },

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

        // console.log('Service Response data getShippingCheckSheet:', response.data)
            
        return { data: response.data, success: true }
      } else {
        console.log('Error repo Error If getShippingCheckSheet...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try getShippingCheckSheet...')
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
        console.log(`success get repo generate ${form}...`)

        // console.log('Service Response data generate ${form}:', response.data)
            
        return { data: response.data, success: true }
      } else {
        console.log(`Error repo Error If generate ${form}...`)
        throw new Error(`No data received from the server`)
      }
    } catch (error) {
      console.log(`Error repo Error Try generate ${form}...`)
      console.error(`Error in getProductionShippingForm:`, error)
      throw new Error(`Failed to fetch generate ${form} ${error.response?.data?.message || error.message}`)
    }
  },

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
        console.log('success get repo saveSearchPlan...')

        // console.log('Service Response data saveSearchPlan:', response.data)
            
        return { data: response.data, success: true }
      } else {
        console.log('Error repo Error If saveSearchPlan...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try saveSearchPlan...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch saveSearchPlan ${error.response?.data?.message || error.message}`)
    }
  },

  async submitCheckSheet(urlApi, form, whereHouse, accessToken, SoEId) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/submit/${SoEId}`, {}, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
    
      if (response && response.data) {
        console.log('success get repo submit CheckSheet...')

        // console.log('Service Response data submit CheckSheet:', response.data)
            
        return { data: response.data, success: true }
      } else {
        console.log('Error repo Error If submit CheckSheet...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try submit CheckSheet...')
      console.error('Error in submitCheckSheet:', error)
      throw new Error(`Failed to fetch submit CheckSheet ${error.response?.data?.message || error.message}`)
    }
  },

  //-------------------------------- Print ----------------------------------
  async printShipperPDFRepo(urlApi, type, whereHouse, accessToken, edId) {
    try {
      const response = await axios.post(
        `${urlApi}/api/v1/PrintLabel/ShipmertPlan/Pdf/${type}/${edId}`,
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
        console.log('Service Response print PDF  form:', response.data)
  
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

}
