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
}
