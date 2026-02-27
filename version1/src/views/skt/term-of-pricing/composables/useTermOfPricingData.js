import { ref } from 'vue'
import { fetchTermOfPricingListService } from '../services/termofpricing.service'

export const useTermOfPricingData = () => {
  const rows = ref([])
  const loading = ref(false)
  const error = ref('')

  const loadRows = async (params = {}) => {
    loading.value = true
    error.value = ''

    try {
      const response = await fetchTermOfPricingListService(params)

      rows.value = Array.isArray(response) ? response : []
    } catch (err) {
      rows.value = []
      error.value = err?.response?.data?.message || err?.message || 'Failed to load TermOfPricing list'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    rows,
    loading,
    error,
    loadRows,
  }
}
