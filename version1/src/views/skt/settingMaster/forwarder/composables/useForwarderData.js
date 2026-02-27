import { ref } from 'vue'
import { fetchForwarderListService } from '../services/forwarder.service'

export const useForwarderData = () => {
  const rows = ref([])
  const loading = ref(false)
  const error = ref('')

  const loadRows = async (params = {}) => {
    loading.value = true
    error.value = ''

    try {
      const response = await fetchForwarderListService(params)

      rows.value = Array.isArray(response) ? response : []
    } catch (err) {
      rows.value = []
      error.value = err?.response?.data?.message || err?.message || 'Failed to load Forwarder list'
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
