<script setup>
import { computed, onMounted, ref } from 'vue'
import { useTermOfPaymentActions } from './composables/useTermOfPaymentActions'
import { useTermOfPaymentData } from './composables/useTermOfPaymentData'
import  BaseMasterCrud  from '../components/BaseMasterCrud.vue'
import { useMasterCrud } from '../components/useMasterCrud'
import { termOfPaymentService } from './services/termOfPaymentAdapter'
import  { fields } from './types/TermOfPaymentView'

const pageTitle = 'Term of Payment'
const { items, loading, error, loadItems } = useTermOfPaymentData()
const { submitting, saveItem, removeItem } = useTermOfPaymentActions()
const dialog = ref(false)
const deleteDialog = ref(false)
const formRef = ref()
const selected = ref(null)
const search = ref('')

const snackbar = ref({
  show: false,
  color: 'success',
  text: '',
})

const form = ref({
  id: null,
  code: '',
  name: '',
  description: '',
  contactName: '',
  contactNo: '',
  status: 'ACTIVE',
})

const headers = [
  { title: 'Code', key: 'code' },
  { title: 'Term of Payment', key: 'name' },
  { title: 'Contact Name', key: 'contactName' },
  { title: 'Contact No.', key: 'contactNo' },
  { title: 'Status', key: 'status', align: 'center' },
  { title: 'Updated At', key: 'updatedAt' },
  { title: 'Action', key: 'actions', sortable: false, align: 'end' },
]

const filteredItems = computed(() => {
  if (!search.value)
    return items.value
  const keyword = search.value.toLowerCase()
  
  return items.value.filter(item =>
    [item.code, item.name, item.contactName, item.contactNo, item.status]
      .filter(Boolean)
      .some(value => String(value).toLowerCase().includes(keyword)),
  )
})

const isEmptyState = computed(() => !loading.value && !error.value && filteredItems.value.length === 0)

const resetForm = () => {
  form.value = { id: null, code: '', name: '', description: '', contactName: '', contactNo: '', status: 'ACTIVE' }
}

const openCreate = () => {
  resetForm()
  dialog.value = true
}

const openEdit = row => {
  form.value = {
    id: row.id,
    code: row.code || '',
    name: row.name || '',
    description: row.description || '',
    contactName: row.contactName || '',
    contactNo: row.contactNo || '',
    status: row.status || 'ACTIVE',
  }
  dialog.value = true
}

const askDelete = row => {
  selected.value = row
  deleteDialog.value = true
}

const showSnack = (text, color = 'success') => {
  snackbar.value = { show: true, text, color }
}

const submitForm = async () => {
  const valid = await formRef.value?.validate()
  if (valid && !valid.valid)
    return
  try {
    await saveItem(form.value)
    dialog.value = false
    await loadItems()
    showSnack('Saved successfully')
  } catch (err) {
    showSnack(err?.response?.data?.message || err?.message || 'Save failed', 'error')
  }
}

const confirmDelete = async () => {
  if (!selected.value?.id)
    return
  try {
    await removeItem(selected.value.id)
    deleteDialog.value = false
    selected.value = null
    await loadItems()
    showSnack('Deleted successfully')
  } catch (err) {
    showSnack(err?.response?.data?.message || err?.message || 'Delete failed', 'error')
  }
}

const reload = async () => {
  try {
    await loadItems()
  } catch (err) {
    showSnack(err?.response?.data?.message || err?.message || 'Unable to load data', 'error')
  }
}

onMounted(reload)
</script>

<template>
  <BaseMasterCrud
    title="Term of Payment"
    :fields="fields"
    :service="termOfPaymentService"
    delete-name-key="termOfPaymentName"
  />
</template>
