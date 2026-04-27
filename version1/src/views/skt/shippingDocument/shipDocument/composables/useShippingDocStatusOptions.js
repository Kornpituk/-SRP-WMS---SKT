import { ref } from 'vue'
import { STATUS_OPTIONS } from '../constants/shippingDocument.constants'
import { fetchShippingDocStatusSelector } from '../api/shippingDocument.api'

export function useShippingDocStatusOptions() {
  const statusOptions = ref([...STATUS_OPTIONS])
  const loading = ref(false)
  const error = ref(null)

  async function loadStatusOptions() {
    loading.value = true
    error.value = null

    try {
      const options = await fetchShippingDocStatusSelector()

      statusOptions.value = options.length ? options : [...STATUS_OPTIONS]
    }
    catch (err) {
      error.value = err
      statusOptions.value = [...STATUS_OPTIONS]
    }
    finally {
      loading.value = false
    }
  }

  return {
    statusOptions,
    loading,
    error,
    loadStatusOptions,
  }
}
