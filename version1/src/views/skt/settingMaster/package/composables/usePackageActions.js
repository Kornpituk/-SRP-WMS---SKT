import { ref } from 'vue'
import { createPackageService, deletePackageService, updatePackageService } from '../services/package.service'

export function usePackageActions() {
  const submitting = ref(false)

  const saveItem = async payload => {
    submitting.value = true
    try {
      if (payload?.id)
        return await updatePackageService(payload.id, payload)

      return await createPackageService(payload)
    } finally {
      submitting.value = false
    }
  }

  const removeItem = async id => {
    submitting.value = true
    try {
      return await deletePackageService(id)
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
