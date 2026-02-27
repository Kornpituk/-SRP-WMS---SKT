import { ref } from 'vue'
import { createBankAccountNoService, deleteBankAccountNoService, updateBankAccountNoService } from '../services/bankAccountNo.service'

export function useBankAccountNoActions() {
  const submitting = ref(false)

  const saveItem = async payload => {
    submitting.value = true
    try {
      if (payload?.id)
        return await updateBankAccountNoService(payload.id, payload)

      return await createBankAccountNoService(payload)
    } finally {
      submitting.value = false
    }
  }

  const removeItem = async id => {
    submitting.value = true
    try {
      return await deleteBankAccountNoService(id)
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
