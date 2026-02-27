import { reactive, ref } from 'vue'
import {
  createHsCodeNoService,
  deleteHsCodeNoService,
  updateHsCodeNoService,
} from '../services/hscodeno.service'

const defaultForm = () => ({
  id: null,
  code: '',
  name: '',
  description: '',
  contactName: '',
  contactNo: '',
  active: true,
})

export const useHsCodeNoActions = (refreshList, onError) => {
  const dialogOpen = ref(false)
  const confirmDeleteOpen = ref(false)
  const submitting = ref(false)
  const deleting = ref(false)
  const selectedItem = ref(null)
  const form = reactive(defaultForm())

  const snackbar = reactive({
    show: false,
    color: 'success',
    message: '',
  })

  const showSnackbar = (message, color = 'success') => {
    snackbar.show = true
    snackbar.color = color
    snackbar.message = message
  }

  const resetForm = () => {
    Object.assign(form, defaultForm())
  }

  const openCreateDialog = () => {
    resetForm()
    dialogOpen.value = true
  }

  const openEditDialog = item => {
    Object.assign(form, {
      ...defaultForm(),
      ...item,
      id: item.id || item.hscodenoId || null,
    })
    dialogOpen.value = true
  }

  const closeDialog = () => {
    dialogOpen.value = false
  }

  const saveItem = async () => {
    submitting.value = true

    try {
      if (form.id) {
        await updateHsCodeNoService(form.id, form)
        showSnackbar('HsCodeNo updated successfully')
      } else {
        await createHsCodeNoService(form)
        showSnackbar('HsCodeNo created successfully')
      }

      closeDialog()
      await refreshList()
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to save HsCodeNo'

      showSnackbar(message, 'error')
      onError(message)
    } finally {
      submitting.value = false
    }
  }

  const openDeleteDialog = item => {
    selectedItem.value = item
    confirmDeleteOpen.value = true
  }

  const closeDeleteDialog = () => {
    confirmDeleteOpen.value = false
    selectedItem.value = null
  }

  const removeItem = async () => {
    if (!selectedItem.value)
      return

    deleting.value = true

    try {
      const id = selectedItem.value.id || selectedItem.value.hscodenoId

      await deleteHsCodeNoService(id)
      showSnackbar('HsCodeNo deleted successfully')
      closeDeleteDialog()
      await refreshList()
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to delete HsCodeNo'

      showSnackbar(message, 'error')
      onError(message)
    } finally {
      deleting.value = false
    }
  }

  return {
    dialogOpen,
    confirmDeleteOpen,
    submitting,
    deleting,
    form,
    snackbar,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    saveItem,
    openDeleteDialog,
    closeDeleteDialog,
    removeItem,
  }
}
