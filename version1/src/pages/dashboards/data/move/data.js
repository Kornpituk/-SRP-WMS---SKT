import { defineStore } from 'pinia'
import { ref } from 'vue'
import { urlApi } from '@/api'
import axios from '@axios'

export const useDataMoveStore = defineStore('dataMove', () => {
  const dataMove = ref(null)
  const isLoading = ref(false)

  const fetchDataMove = async (day, accessToken, whereHouse, type) => {
    isLoading.value = true
    try {
      const response = await axios.get(`${urlApi.value}/api/v1/Dashboard/${type}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-location': whereHouse,
        },
        params: { day },
      })

      dataMove.value = response.data
      console.log('DataMove fetched successfully:', dataMove.value)
    } catch (err) {
      console.error('Error fetching dataMove:', err)
    } finally {
      isLoading.value = false
    }
  }

  return { dataMove, fetchDataMove, isLoading }
})
