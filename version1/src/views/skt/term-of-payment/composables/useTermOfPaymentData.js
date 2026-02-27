import { ref } from 'vue'
import { fetchTermOfPaymentListService } from '../services/termofpayment.service'

export const useTermOfPaymentData = () => {
  const rows = ref([])
  const loading = ref(false)
  const error = ref('')

  const loadRows = async (params = {}) => {
    loading.value = true
    error.value = ''

    try {
      const response = await fetchTermOfPaymentListService(params)

      rows.value = Array.isArray(response) ? response : []
    } catch (err) {
      rows.value = []
      error.value = err?.response?.data?.message || err?.message || 'Failed to load TermOfPayment list'
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
