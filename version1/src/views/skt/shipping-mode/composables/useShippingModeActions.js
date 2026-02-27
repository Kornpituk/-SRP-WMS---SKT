import { ref } from 'vue'
import { createShippingModeService, deleteShippingModeService, updateShippingModeService } from '../services/shippingMode.service'

export function useShippingModeActions() {
  const submitting = ref(false)

  const saveItem = async payload => {
    submitting.value = true
    try {
      if (payload?.id)
        return await updateShippingModeService(payload.id, payload)

      return await createShippingModeService(payload)
    } finally {
      submitting.value = false
    }
  }

  const removeItem = async id => {
    submitting.value = true
    try {
      return await deleteShippingModeService(id)
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
