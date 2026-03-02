import { ref } from 'vue'
import { createShipDocumentService, deleteShipDocumentService, updateShipDocumentService } from '../services/shipDocument.service'

export function useShipDocumentActions() {
  const submitting = ref(false)

  const saveItem = async payload => {
    submitting.value = true
    try {
      if (payload?.id)
        return await updateShipDocumentService(payload.id, payload)

      return await createShipDocumentService(payload)
    } finally {
      submitting.value = false
    }
  }

  const removeItem = async id => {
    submitting.value = true
    try {
      return await deleteShipDocumentService(id)
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
