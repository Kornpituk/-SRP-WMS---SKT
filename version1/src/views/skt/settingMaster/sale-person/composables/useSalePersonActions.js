import { ref } from 'vue'
import { createSalePersonService, deleteSalePersonService, updateSalePersonService } from '../services/salePerson.service'

export function useSalePersonActions() {
  const submitting = ref(false)

  const saveItem = async payload => {
    submitting.value = true
    try {
      if (payload?.id)
        return await updateSalePersonService(payload.id, payload)

      return await createSalePersonService(payload)
    } finally {
      submitting.value = false
    }
  }

  const removeItem = async id => {
    submitting.value = true
    try {
      return await deleteSalePersonService(id)
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
