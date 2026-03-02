import { ref } from 'vue'
import { createCarrierService, deleteCarrierService, updateCarrierService } from '../services/carrier.service'

export function useCarrierActions() {
  const submitting = ref(false)

  const saveItem = async payload => {
    submitting.value = true
    try {
      if (payload?.id)
        return await updateCarrierService(payload.id, payload)

      return await createCarrierService(payload)
    } finally {
      submitting.value = false
    }
  }

  const removeItem = async id => {
    submitting.value = true
    try {
      return await deleteCarrierService(id)
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
