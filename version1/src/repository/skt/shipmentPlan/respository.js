import axios from '@axios'

export const shipmentPlanRepository = {
  async getPermissionUser(urlApi, form, whereHouse, accessToken, params = {}) {
    console.log('get repo getPermissionUser...')
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
        console.log('success get repo getPermissionUser...')

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
  async getSelect(urlApi, form, whereHouse, accessToken) {
    console.log('get repo getSelect...')
    try {
      const response = await axios.get(`${urlApi}/api/v1/ShipmentPlan/${form}`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
    
      if (response && response.data) {
        console.log('success get repo getSelect...')

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

  async getSearchPlan(urlApi, form, whereHouse, accessToken, params = {}) {
    console.log('get repo getSearchPlan...')
    try {
      const response = await axios.get(`${urlApi}/api/v1/ShipmentPlan/${form}`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          StatusId: params.StatusId || '',
          ETA: params.ETA || '',
          ETD: params.ETD || '',
          SalesOrderNoSearch: params.SalesOrderNoSearch || '',
          PayerNameSearch: params.PayerNameSearch || '',
          ItemNameSearch: params.ItemNameSearch || '',
          SortColumn: params.SortColumn || '',
          SortDirection: params.SortDirection || '',
        },
      })
    
      if (response && response.data) {
        console.log('success get repo getSearchPlan...')

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
    console.log('get repo saveSearchPlan...')
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
    console.log('get repo submit Shipment Plan...')
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

  
}

export const FileService = {
  async saveDraftFileForm(files, soEtlLogDetailJournalID, form, urlApi, whereHouse, accessToken) {
    const formData = new FormData()

    // Loop ผ่านไฟล์ที่ต้องการอัปโหลด
    files.forEach(file => {
      formData.append('files', file)
    })

    console.log("Files Upload", files)

    try {
      const response = await axios.post(`${urlApi}/api/v1/ShippingFile/${form}/${soEtlLogDetailJournalID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-location': whereHouse,
          'Authorization': `Bearer ${accessToken}`,
        },
      })

      return { success: true, data: response.data }
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
