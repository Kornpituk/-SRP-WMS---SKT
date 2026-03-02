import { ref } from 'vue'
import { createPortService, deletePortService, updatePortService } from '../services/port.service'

export function usePortActions() {
  const submitting = ref(false)

  const saveItem = async payload => {
    submitting.value = true
    try {
      if (payload?.id)
        return await updatePortService(payload.id, payload)

      return await createPortService(payload)
    } finally {
      submitting.value = false
    }
  }

  const removeItem = async id => {
    submitting.value = true
    try {
      return await deletePortService(id)
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
