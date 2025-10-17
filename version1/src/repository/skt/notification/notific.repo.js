import axios from '@axios'
import { urlApi } from '@/api'


// const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')
const whereHouse = localStorage.getItem('whereHouseName')

export const notificationSetReadRepository = {

  async setReadNotification(NotiId, accessTokenAtStore) {
    //console.log('get repo Production Plan...')
    try {
      const response = await axios.post(`${urlApi.value}/api/v1/ReceivingPlanNotification/SetRead/${NotiId}`, {}, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
      })

      //console.log("response", response)
      if (response && response.data) {
        //console.log('success get repo Production Plan...')
        //console.log('Service Response data Production Plan:', response.data.data)
        
        return { data: response.data.data, success: true }
      } else {
        //console.log('Error repo Error If Production Plan...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      //console.log('Error repo Error Try Production Plan...')
      console.error('Error in fetch:', error)
      throw new Error(`Failed to fetch: ${error.response?.data?.message || error.message}`)
    }
  },

  async getNotification(accessTokenAtStore) {
    //console.log('get repo Production Plan...')
    try {
      const response = (await axios.get(`${urlApi.value}/api/v1/ReceivingPlanNotification`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
      }))

      //console.log("response", response)
      if (response && response.data) {

        return { data: response.data, success: true }
      } else {
        //console.log('Error repo Error If Production Plan...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      //console.log('Error repo Error Try Production Plan...')
      console.error('Error in fetch:', error)
      throw new Error(`Failed to fetch: ${error.response?.data?.message || error.message}`)
    }
  },
}
