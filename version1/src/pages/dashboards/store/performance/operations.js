import { defineStore } from 'pinia'
import axios from '@axios'
import { urlApi } from '@/api'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    performanceData: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchPerformanceData(params) {
      this.loading = true
      this.error = null
      
      try {
        const whereHouse = localStorage.getItem('whereHouseName')
        const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')
        
        const response = await axios.get(
          `${urlApi.value}/api/v1/Dashboard/Summary/Performance`, 
          {
            params, // ส่ง query parameters
            headers: {
              'Accept': '*/*',
              'x-location': whereHouse || '', // ใช้ค่า default หากไม่มี
              'Authorization': `Bearer ${accessTokenAtStore || ''}`,
            },
          },
        )
        
        this.performanceData = response.data
        console.log('performanceData', response.data)      
      } catch (error) {
        this.error = error.response?.data?.message || error.message
        console.error('API Error:', error)
      } finally {
        this.loading = false
      }
    },
  },
  getters: {
    receivedSuccessfully: state => state.performanceData?.receivedSuccessfully || {},
    receivedPending: state => state.performanceData?.receivedPending || {},
    pickingSuccessfully: state => state.performanceData?.pickingSuccessfully || {},
    pickingPending: state => state.performanceData?.pickingPending || {},
  },
})
