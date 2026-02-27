<script setup>
import { computed, onMounted, ref } from 'vue'
import { usePackageActions } from './composables/usePackageActions'
import { usePackageData } from './composables/usePackageData'

const pageTitle = 'Package'
const { items, loading, error, loadItems } = usePackageData()
const { submitting, saveItem, removeItem } = usePackageActions()
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
  { title: 'Package', key: 'name' },
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
  <VContainer
    fluid
    class="setting-master-page"
  >
    <div class="setting-master-content">
      <section class="setting-section">
        <div class="page-head">
          <h1 class="page-title">
            {{ pageTitle }}
          </h1>
          <VBtn
            color="primary"
            class="action-btn add-btn"
            @click="openCreate"
          >
            Add {{ pageTitle }}
          </VBtn>
        </div>
      </section>
      <section class="setting-section">
        <VCard
          elevation="1"
          class="setting-card"
        >
          <div class="section-title">
            Package List
          </div>
          <VTextField
            v-model="search"
            density="comfortable"
            variant="outlined"
            hide-details
            placeholder="Search by code, name or contact"
            class="search-field"
          />
          <VAlert
            v-if="error"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ error }}
          </VAlert>
          <VSkeletonLoader
            v-if="loading"
            type="table"
          />
          <template v-else>
            <div
              v-if="isEmptyState"
              class="empty-state"
            >
              No data found
            </div>
            <VDataTable
              v-else
              density="compact"
              class="setting-table"
              :headers="headers"
              :items="filteredItems"
              :items-per-page="10"
            >
              <template #item.status="{ item }">
                <VChip
                  size="small"
                  :color="item.status === 'ACTIVE' ? 'success' : 'grey'"
                  variant="tonal"
                >
                  {{ item.status }}
                </VChip>
              </template>
              <template #item.actions="{ item }">
                <div class="table-actions">
                  <VBtn
                    variant="text"
                    color="primary"
                    class="action-btn edit-btn"
                    @click="openEdit(item)"
                  >
                    Edit
                  </VBtn>
                  <VBtn
                    color="error"
                    class="action-btn delete-btn"
                    @click="askDelete(item)"
                  >
                    Delete
                  </VBtn>
                </div>
              </template>
            </VDataTable>
          </template>
        </VCard>
      </section>
    </div>
    <VDialog
      v-model="dialog"
      max-width="500"
    >
      <VCard
        elevation="1"
        class="setting-card dialog-card"
      >
        <div class="section-title">
          {{ form.id ? `Edit ${pageTitle}` : `Add ${pageTitle}` }}
        </div>
        <VForm ref="formRef">
          <div class="dialog-fields">
            <VTextField
              v-model="form.code"
              label="Code"
              :rules="[v => !!v || 'Code is required']"
            />
            <VTextField
              v-model="form.name"
              :label="pageTitle"
              :rules="[v => !!v || `${pageTitle} is required`]"
            />
            <VTextField
              v-model="form.description"
              label="Description"
            />
            <VTextField
              v-model="form.contactName"
              label="Contact Name"
            />
            <VTextField
              v-model="form.contactNo"
              label="Contact No."
            />
            <VSelect
              v-model="form.status"
              :items="['ACTIVE', 'INACTIVE']"
              label="Status"
            />
          </div>
        </VForm>
        <VCardActions class="dialog-actions">
          <VBtn
            variant="text"
            class="action-btn"
            @click="dialog = false"
          >
            Cancel
          </VBtn>
          <VBtn
            color="primary"
            class="action-btn"
            :loading="submitting"
            @click="submitForm"
          >
            Save
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
    <VDialog
      v-model="deleteDialog"
      max-width="500"
    >
      <VCard
        elevation="1"
        class="setting-card dialog-card"
      >
        <div class="section-title text-center">
          Confirm Delete
        </div>
        <div class="delete-message">
          Do you want to delete <strong>{{ selected?.name || '-' }}</strong>?
        </div>
        <VCardActions class="dialog-actions justify-center">
          <VBtn
            variant="text"
            class="action-btn"
            @click="deleteDialog = false"
          >
            Cancel
          </VBtn>
          <VBtn
            color="error"
            class="action-btn"
            :loading="submitting"
            @click="confirmDelete"
          >
            Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
    <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
    >
      {{ snackbar.text }}
    </VSnackbar>
  </VContainer>
</template>

<style scoped>
.setting-master-page {
  padding: 24px;
}
.setting-master-content { max-width: 1440px; margin: 0 auto; }
.setting-section + .setting-section { margin-top: 32px; }
.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.page-title { margin: 0; font-size: 20px; font-weight: 600; line-height: 28px; }
.section-title { margin: 0 0 16px; font-size: 16px; font-weight: 500; line-height: 24px; }
.setting-card { border-radius: 8px; padding: 24px; }
.search-field {
  margin-bottom: 16px;
}
.empty-state { color: rgb(var(--v-theme-on-surface), 0.6); text-align: center; padding: 32px 0; }
.action-btn { min-height: 40px; border-radius: 8px; text-transform: none; }
.add-btn {
  padding-inline: 18px;
}
.delete-btn {
  min-width: 84px;
}
.table-actions { display: flex; justify-content: flex-end; align-items: center; gap: 4px; }
.dialog-card {
  border-radius: 8px;
}
.dialog-fields { display: grid; gap: 16px; }
.dialog-actions { margin-top: 16px; gap: 8px; }
.delete-message { margin: 12px 0 8px; text-align: center; font-size: 15px; }
:deep(.setting-table .v-data-table-header th) { font-size: 14px; font-weight: 600; }
:deep(.setting-table tbody tr:hover td) { background: #f6f8fa; }
</style>
