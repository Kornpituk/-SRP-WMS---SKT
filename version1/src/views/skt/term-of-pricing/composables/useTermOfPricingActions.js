import { ref } from 'vue'
import { createTermOfPricingService, deleteTermOfPricingService, updateTermOfPricingService } from '../services/termOfPricing.service'

export function useTermOfPricingActions() {
  const submitting = ref(false)

  const saveItem = async payload => {
    submitting.value = true
    try {
      if (payload?.id)
        return await updateTermOfPricingService(payload.id, payload)

      return await createTermOfPricingService(payload)
    } finally {
      submitting.value = false
    }
  }

  const removeItem = async id => {
    submitting.value = true
    try {
      return await deleteTermOfPricingService(id)
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
