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
