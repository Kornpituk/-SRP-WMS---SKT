import { ref } from 'vue'
import { createTermOfPaymentService, deleteTermOfPaymentService, updateTermOfPaymentService } from '../services/termOfPayment.service'

export function useTermOfPaymentActions() {
  const submitting = ref(false)

  const saveItem = async payload => {
    submitting.value = true
    try {
      if (payload?.id)
        return await updateTermOfPaymentService(payload.id, payload)

      return await createTermOfPaymentService(payload)
    } finally {
      submitting.value = false
    }
  }

  const removeItem = async id => {
    submitting.value = true
    try {
      return await deleteTermOfPaymentService(id)
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
