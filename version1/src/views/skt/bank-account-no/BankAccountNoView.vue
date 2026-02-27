<script setup>
import { computed, reactive } from 'vue'
import { useBankAccountNoActions } from './composables/useBankAccountNoActions'
import { useBankAccountNoData } from './composables/useBankAccountNoData'

const search = reactive({
  keyword: '',
})

const { rows, loading, error, loadRows } = useBankAccountNoData()

const applySearch = async () => {
  await loadRows({
    keyword: search.keyword,
  })
}

const setError = message => {
  error.value = message
}

const {
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
} = useBankAccountNoActions(applySearch, setError)

const headers = [
  { title: 'Code', key: 'code' },
  { title: 'Name', key: 'name' },
  { title: 'Description', key: 'description' },
  { title: 'Contact Name', key: 'contactName' },
  { title: 'Contact No.', key: 'contactNo' },
  { title: 'Status', key: 'active' },
  { title: 'Actions', key: 'actions', sortable: false, width: 160 },
]

const hasData = computed(() => rows.value.length > 0)

onMounted(async () => {
  try {
    await applySearch()
  } catch (err) {
    // error state is already handled in composable
  }
})
</script>

<template>
  <VContainer fluid>
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardTitle class="d-flex align-center justify-space-between gap-4 flex-wrap">
            <span>Bank Account No</span>
            <VBtn
              color="primary"
              prepend-icon="ri-add-line"
              @click="openCreateDialog"
            >
              Create
            </VBtn>
          </VCardTitle>
          <VCardText>
            <VRow>
              <VCol
                cols="12"
                md="4"
              >
                <VTextField
                  v-model="search.keyword"
                  label="Search"
                  clearable
                  density="comfortable"
                  @keyup.enter="applySearch"
                />
              </VCol>
              <VCol
                cols="12"
                md="8"
                class="d-flex align-center justify-end gap-2"
              >
                <VBtn
                  color="primary"
                  variant="tonal"
                  @click="applySearch"
                >
                  Search
                </VBtn>
                <VBtn
                  color="secondary"
                  variant="text"
                  @click="() => { search.keyword = ''; applySearch() }"
                >
                  Clear
                </VBtn>
              </VCol>
            </VRow>

            <VAlert
              v-if="error"
              type="error"
              class="mb-4"
              variant="tonal"
            >
              {{ error }}
            </VAlert>

            <VDataTable
              :headers="headers"
              :items="rows"
              :loading="loading"
              class="text-no-wrap"
              item-key="id"
            >
              <template #item.active="{ item }">
                <VChip
                  :color="item.active ? 'success' : 'error'"
                  size="small"
                >
                  {{ item.active ? 'Active' : 'Inactive' }}
                </VChip>
              </template>

              <template #item.actions="{ item }">
                <div class="d-flex gap-2">
                  <VBtn
                    size="small"
                    color="warning"
                    variant="tonal"
                    @click="openEditDialog(item)"
                  >
                    Edit
                  </VBtn>
                  <VBtn
                    size="small"
                    color="error"
                    variant="tonal"
                    @click="openDeleteDialog(item)"
                  >
                    Delete
                  </VBtn>
                </div>
              </template>

              <template #no-data>
                <div class="py-8 text-center">
                  <p class="text-medium-emphasis mb-0">
                    {{ loading ? 'Loading data...' : 'No records found' }}
                  </p>
                </div>
              </template>
            </VDataTable>
            <VAlert
              v-if="!loading && !error && !hasData"
              type="info"
              variant="tonal"
              class="mt-4"
            >
              No data available. Create a new record to get started.
            </VAlert>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VDialog
      v-model="dialogOpen"
      max-width="720"
    >
      <VCard>
        <VCardTitle>{{ form.id ? 'Edit' : 'Create' }} Bank Account No</VCardTitle>
        <VCardText>
          <VRow>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="form.code"
                label="Code"
                density="comfortable"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="form.name"
                label="Name"
                density="comfortable"
              />
            </VCol>
            <VCol cols="12">
              <VTextarea
                v-model="form.description"
                label="Description"
                rows="3"
                density="comfortable"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="form.contactName"
                label="Contact Name"
                density="comfortable"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="form.contactNo"
                label="Contact No."
                density="comfortable"
              />
            </VCol>
            <VCol cols="12">
              <VSwitch
                v-model="form.active"
                label="Active"
                inset
              />
            </VCol>
          </VRow>
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn
            variant="text"
            @click="closeDialog"
          >
            Cancel
          </VBtn>
          <VBtn
            color="primary"
            :loading="submitting"
            @click="saveItem"
          >
            Save
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog
      v-model="confirmDeleteOpen"
      max-width="420"
    >
      <VCard>
        <VCardTitle>Delete Bank Account No</VCardTitle>
        <VCardText>Are you sure you want to delete this item?</VCardText>
        <VCardActions class="justify-end">
          <VBtn
            variant="text"
            @click="closeDeleteDialog"
          >
            Cancel
          </VBtn>
          <VBtn
            color="error"
            :loading="deleting"
            @click="removeItem"
          >
            Confirm
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
      location="top end"
    >
      {{ snackbar.message }}
    </VSnackbar>
  </VContainer>
</template>
