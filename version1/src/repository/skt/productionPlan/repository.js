import axios from '@axios'

export const productionPlanRepository = {

  async getProductionPlan(batchId, urlApi, form, whereHouse, accessToken) {
    console.log('get repo Production Plan...')
    try {
      const response = await axios.get(`${urlApi}/api/v1/${form}/get/${batchId}`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })

      console.log("response", response)
      if (response && response.data) {
        console.log('success get repo Production Plan...')
        console.log('Service Response data Production Plan:', response.data.data)
        
        return { data: response.data.data, success: true }
      } else {
        console.log('Error repo Error If Production Plan...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try Production Plan...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch Production Plan for batch ID ${batchId}: ${error.response?.data?.message || error.message}`)
    }
  },

  async getProductionPlanSearch(filter, urlApi, form, whereHouse, accessToken) {
    console.log('get repo Production Plan Search...')
    try {
      const response = await axios.get(`${urlApi}/api/v1/${form}/searchplans`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          StatusID: filter.StatusID,
          ProductionTextSearch: filter.ProductionTextSearch,
          ItemTextSearch: filter.ItemTextSearch,
          ProducingDateFrom: filter.ProducingDateFrom,
          ProducingDateTo: filter.ProducingDateTo,
          LotTextSearch: filter.LotTextSearch,
        },
      })

      console.log("response", response)
      if (response && response.data) {
        console.log('success get repo Production Plan Search...')
        console.log('Service Response data Production Plan Search:', response.data.data)
        
        return { data: response.data.data, success: true }
      } else {
        console.log('Error repo Error If Production Plan Search...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try Production Plan Search...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch Production Plan Search ${error.response?.data?.message || error.message}`)
    }
  },

  async getProductionPlanMaster(search, urlApi, form, whereHouse, accessToken) {
    console.log('get repo Production Plan...')
    try {
      const response = await axios.get(`${urlApi}/api/v1/${form}/getmasters`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          Search: search,
        },
      })

      console.log("response", response)
      if (response && response.data) {
        console.log('success get repo Production Plan Master...')
        console.log('Service Response data Production Plan Master:', response.data.data)
        
        return { data: response.data.data, success: true }
      } else {
        console.log('Error repo Error If Production Plan Master...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try Production Plan Master...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch Production Plan Master${error.response?.data?.message || error.message}`)
    }
  },

  async getProductionPlanBatch(urlApi, form, whereHouse, accessToken) {
    console.log('get batch repo Production Plan...')
    try {
      const response = await axios.get(`${urlApi}/api/v1/${form}/newId/`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response && response.data) {
        console.log('success get batch repo Production Plan...')

        // console.log('Service Response data Production Plan:', response.data)
        
        return { data: response.data, success: true }
      } else {
        console.log('Error repo Error If Production Plan...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try Production Plan...')
      console.error('Error in getProductionPlanBatch:', error)
      throw new Error(`Failed to fetch Production Plan for batch }: ${error.response?.data?.message || error.message}`)
    }
  },

  async newProductionPlan(batchId, planningId, urlApi, form, whereHouse, accessToken) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/new`, {}, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-location': whereHouse,
          'Authorization': `Bearer ${accessToken}`,
        },
        params: {
          BatchID: batchId,
          PlaningID: planningId,
        },
      })
  
      if (response && response.data) {
        console.log('Repo Response data new production plan:', response.data.data)
        
        return { data: response.data.data, success: true }
      } else {
        throw new Error('No data received from the server')
      }
    } catch (error) {
      throw { success: false, error }
    }
  },

  async deleteBatchProductionPlan(batchId, urlApi, form, whereHouse, accessToken) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/delete`, batchId, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-location': whereHouse,
          'Authorization': `Bearer ${accessToken}`,
        },
      })
  
      if (response && response.data) {
        console.log('Repo Response data delete Batch production plan:', response.data.data)
        
        return { data: response.data.data, success: true }
      } else {
        throw new Error('No data received from the server')
      }
    } catch (error) {
      throw { success: false, error }
    }
  },

  async generateLotBatchProductionPlan(batchId, urlApi, form, whereHouse, accessToken) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/genlot?BatchID=${batchId}`, {}, {
        headers: {
          'x-location': whereHouse,
          'Authorization': `Bearer ${accessToken}`,
        },
      })
  
      if (response && response.data) {
        console.log('Repo Response data genlot Batch production plan:', response.data.data)
        
        return { data: response.data.data, success: true }
      } else {
        throw new Error('No data received from the server')
      }
    } catch (error) {
      throw { success: false, error }
    }
  },

  async submitProductionPlan(planningId, urlApi, form, whereHouse, accessToken) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/submit`, planningId, {
        headers: {
          'x-location': whereHouse,
          'Authorization': `Bearer ${accessToken}`,
        },
      })
  
      if (response && response.data) {
        console.log('Repo Response data submit Batch production plan:', response.data.data)
  
        return { data: response.data.data, success: true }
      } else {
        return { success: false, error: 'Unexpected response format.' }
      }
    } catch (error) {
      // จัดการข้อผิดพลาดและระบุข้อความที่ส่งกลับ
      if (error.response && error.response.data) {
        // กรณี API ส่งข้อผิดพลาดพร้อม response
        console.error('API Error:', error.response.data.message || 'Unknown API error')
        
        return { 
          success: false, 
          error: error.response.data.message || 'Unknown error from server.', 
        }
      } else if (error.request) {
        // กรณีข้อผิดพลาดเกี่ยวกับการเชื่อมต่อเครือข่าย
        console.error('Network Error:', error.message)
        
        return { 
          success: false, 
          error: 'Network error. Please check your internet connection.', 
        }
      } else {
        // กรณีข้อผิดพลาดทั่วไป เช่น การตั้งค่าผิดพลาด
        console.error('Unexpected Error:', error.message)
        
        return { 
          success: false, 
          error: 'An unexpected error occurred. Please try again.', 
        }
      }
    }
  },

  async approveProductionPlan(planningId, urlApi, form, whereHouse, accessToken) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/approve`, planningId, {
        headers: {
          'x-location': whereHouse,
          'Authorization': `Bearer ${accessToken}`,
        },
      })
  
      if (response && response.data) {
        console.log('Repo Response data approve Batch production plan:', response.data.data)
        
        return { data: response.data.data, success: true }
      } else {
        throw new Error('No data received from the server')
      }
    } catch (error) {
      throw { success: false, error }
    }
  },

  async deleteProductionPlan(planningId, urlApi, form, whereHouse, accessToken) {
    const body = JSON.stringify(planningId)  // แปลงเป็น JSON string
    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/delete`, planningId, {
        headers: {
          'x-location': whereHouse,
          'Authorization': `Bearer ${accessToken}`,
        },
      })
  
      if (response && response.data) {
        console.log('Repo Response data delete production plan:', response.data.data)
        
        return { data: response.data.data, success: true }
      } else {
        throw new Error('No data received from the server')
      }
    } catch (error) {
      throw { success: false, error }
    }
  },

  async saveProductionPlan(formData, urlApi, form, whereHouse, accessToken) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/save`, formData, {
        headers: {
          'x-location': whereHouse,
          'Authorization': `Bearer ${accessToken}`,
        },
      })
  
      if (response && response.data) {
        console.log('Repo Response data save production plan:', response.data.data)
        
        return { data: response.data.data, success: true }
      } else {
        throw new Error('No data received from the server')
      }
    } catch (error) {
      throw { success: false, error }
    }
  },
}
