import { ref, reactive } from 'vue'
import { fetchShippingExpenses } from '../api/shippingDocument.api'

const createDefaultFilters = () => ({
  status: 'All',
  invoiceInSAP: '',
  invoice: '',
  payerName: '',
  etdRange: '',
})

export function useShippingExpense() {
  const loading    = ref(false)
  const items      = ref([])
  const total      = ref(0)
  const filters    = reactive(createDefaultFilters())
  const pagination = reactive({ page: 1, itemsPerPage: 10 })
  const sortBy     = ref([])

  async function loadData() {
    loading.value = true
    try {
      const { data, total: t } = await fetchShippingExpenses({ ...filters })

      items.value = data
      total.value = t
    }
    finally {
      loading.value = false
    }
  }

  function handleSearch() {
    pagination.page = 1
    loadData()
  }

  function handleClear() {
    Object.assign(filters, createDefaultFilters())
    pagination.page = 1
    pagination.itemsPerPage = 10
    sortBy.value = []
    loadData()
  }

  // ❌ ลบ loadData() ออกจาก init
  // VDataTableServer fire @update:options ตอน mount ให้อัตโนมัติ
  function handleUpdateOptions(options) {
    pagination.page = options.page
    pagination.itemsPerPage = options.itemsPerPage
    sortBy.value = options.sortBy ?? []
    loadData()
  }

  return {
    loading,
    items,
    total,
    filters,
    pagination,
    sortBy,
    handleSearch,
    handleClear,
    handleUpdateOptions,
    reload: loadData,
  }
}
