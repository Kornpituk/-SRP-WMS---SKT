import { ref } from 'vue'
import { createContainerTypeService, deleteContainerTypeService, updateContainerTypeService } from '../services/containerType.service'

export function useContainerTypeActions() {
  const submitting = ref(false)

  const saveItem = async payload => {
    submitting.value = true
    try {
      if (payload?.id)
        return await updateContainerTypeService(payload.id, payload)

      return await createContainerTypeService(payload)
    } finally {
      submitting.value = false
    }
  }

  const removeItem = async id => {
    submitting.value = true
    try {
      return await deleteContainerTypeService(id)
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
