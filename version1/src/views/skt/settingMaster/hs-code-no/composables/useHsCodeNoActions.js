import { ref } from 'vue'
import { createHsCodeNoService, deleteHsCodeNoService, updateHsCodeNoService } from '../services/hsCodeNo.service'

export function useHsCodeNoActions() {
  const submitting = ref(false)

  const saveItem = async payload => {
    submitting.value = true
    try {
      if (payload?.id)
        return await updateHsCodeNoService(payload.id, payload)

      return await createHsCodeNoService(payload)
    } finally {
      submitting.value = false
    }
  }

  const removeItem = async id => {
    submitting.value = true
    try {
      return await deleteHsCodeNoService(id)
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
