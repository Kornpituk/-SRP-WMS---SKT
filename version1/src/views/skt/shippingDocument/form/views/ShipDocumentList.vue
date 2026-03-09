<template>
  <div class="ship-document-list">
    <div class="d-flex align-center justify-space-between pa-4">
      <h1 class="text-h5 font-weight-bold">
        Ship Documents
      </h1>
    </div>

    <VCard
      class="mx-4"
      flat
    >
      <VCardText>
        <VRow dense>
          <VCol
            cols="12"
            md="4"
          >
            <VTextField
              v-model="search"
              label="Search document no."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              clearable
              @update:model-value="debouncedFetch"
            />
          </VCol>
          <VCol
            cols="12"
            md="3"
          >
            <VSelect
              v-model="statusFilter"
              label="Status"
              :items="statusOptions"
              variant="outlined"
              density="compact"
              clearable
              @update:model-value="fetchData"
            />
          </VCol>
        </VRow>
      </VCardText>

      <VDataTableServer
        v-model:items-per-page="perPage"
        v-model:page="page"
        :headers="headers"
        :items="items"
        :items-length="total"
        :loading="loading"
        @update:options="fetchData"
        @click:row="goToDetail"
      >
        <template #item.status="{ item }">
          <VChip
            :color="getDocStatusColor(item.status)"
            variant="flat"
            size="small"
          >
            {{ item.status }}
          </VChip>
        </template>
        <template #item.tabProgress="{ item }">
          <div class="d-flex gap-1">
            <VIcon
              v-for="tab in item.tabStatuses || []"
              :key="tab.key"
              :color="getTabColor(tab.status)"
              :icon="getTabIcon(tab.status)"
              size="18"
            />
          </div>
        </template>
      </VDataTableServer>
    </VCard>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"                          
import { DocumentStatus } from "../types/shipDocument"
import {
  getDocumentStatusDisplay,
  getTabStatusDisplay,
} from "../utils/statusDisplay"                           

const router = useRouter()

const search = ref("")
const statusFilter = ref(null)
const page = ref(1)
const perPage = ref(20)
const total = ref(0)
const loading = ref(false)
const items = ref([])

const headers = [
  { title: "Document No.", key: "documentNo", sortable: true },
  { title: "Status", key: "status", sortable: true },
  { title: "Tab Progress", key: "tabProgress", sortable: false },
  { title: "Created", key: "createdAt", sortable: true },
  { title: "Updated", key: "updatedAt", sortable: true },
]

const statusOptions = Object.values(DocumentStatus)

const getDocStatusColor = s => getDocumentStatusDisplay(s).color
const getTabColor = s => getTabStatusDisplay(s).color
const getTabIcon = s => getTabStatusDisplay(s).icon

async function fetchData() {
  loading.value = true
  try {
    // const res = await shipDocumentApi.getList({ page: page.value, pageSize: perPage.value, search: search.value, status: statusFilter.value })
    // items.value = res.data.items
    // total.value = res.data.total
  } finally {
    loading.value = false
  }
}

let timer
function debouncedFetch() {
  clearTimeout(timer)
  timer = setTimeout(fetchData, 300)
}

function goToDetail(_e, row) {
  router.push({ name: "ship-document-detail", params: { id: row.item.id } })
}
</script>
