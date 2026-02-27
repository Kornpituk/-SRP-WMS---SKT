import { ref } from 'vue'
import { createCurrencyService, deleteCurrencyService, updateCurrencyService } from '../services/currency.service'

export function useCurrencyActions() {
  const submitting = ref(false)

  const saveItem = async payload => {
    submitting.value = true
    try {
      if (payload?.id)
        return await updateCurrencyService(payload.id, payload)

      return await createCurrencyService(payload)
    } finally {
      submitting.value = false
    }
  }

  const removeItem = async id => {
    submitting.value = true
    try {
      return await deleteCurrencyService(id)
    } finally {
      submitting.value = false
    }
  }

  return {
    submitting,
    saveItem,
    removeItem,
  }
}
