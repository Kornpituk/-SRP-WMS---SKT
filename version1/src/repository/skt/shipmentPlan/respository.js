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
        console.log('Service Response data getPermissionUser:', response.data)
            
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
}
