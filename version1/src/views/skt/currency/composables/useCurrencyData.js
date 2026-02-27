import { ref } from 'vue'
import { fetchCurrencyListService } from '../services/currency.service'

export function useCurrencyData() {
  const items = ref([])
  const loading = ref(false)
  const error = ref('')

  const loadItems = async (params = {}) => {
    loading.value = true
    error.value = ''
    try {
      items.value = await fetchCurrencyListService(params)
    } catch (err) {
      error.value = err?.response?.data?.message || err?.message || 'Failed to load data'
      items.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    loading,
    error,
    loadItems,
  }
}
