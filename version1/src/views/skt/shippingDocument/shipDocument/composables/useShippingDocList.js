import { ref, reactive, computed } from 'vue'
import { fetchShippingDocs } from '../api/shippingDocument.api'

const createDefaultFilters = () => ({
  status: 'All',
  invoiceInSAP: '',
  invoice: '',
  payerName: '',
  consignee: '',
  item: '',
  shippingMode: '',
  etdRange: '', 
})

/**
 * useShippingDocList
 * @param {'list'|'void'} mode
 */
export function useShippingDocList(mode) {
  const loading    = ref(false)
  const items      = ref([])
  const total      = ref(0)
  const filters    = reactive(createDefaultFilters())
  const pagination = reactive({ page: 1, itemsPerPage: 20 })
  const sortBy     = ref([])
  let requestId = 0

  const statusFilterDisabled = computed(() => mode === 'void')

  async function loadData() {
    const currentRequestId = ++requestId

    loading.value = true
    try {
      const { data, total: t } = await fetchShippingDocs({
        ...filters,
        page: pagination.page,
        itemsPerPage: pagination.itemsPerPage,
        sortBy: sortBy.value,
      }, mode)

      if (currentRequestId !== requestId) return

      items.value = data
      total.value = t
    }
    finally {
      if (currentRequestId === requestId) loading.value = false
    }
  }

  function handleSearch() {
    pagination.page = 1
    loadData()
  }

  function handleClear() {
    Object.assign(filters, createDefaultFilters())
    pagination.page = 1
    pagination.itemsPerPage = 20
    sortBy.value = []
    loadData()
  }

  /**
   * VDataTableServer fires @update:options on mount → initial load
   * และ fire ซ้ำทุกครั้งที่ page/sort เปลี่ยน
   * ไม่ต้องเรียก loadData() ใน init แยกต่างหากอีก
   */
  function handleUpdateOptions(options) {
    pagination.page = options.page
    pagination.itemsPerPage = options.itemsPerPage
    sortBy.value = options.sortBy ?? []
    loadData()
  }

  // ❌ ลบ loadData() ออกจากที่นี่
  // VDataTableServer จะ fire @update:options ตอน mount เองอยู่แล้ว

  return {
    loading,
    items,
    total,
    filters,
    pagination,
    sortBy,
    statusFilterDisabled,
    handleSearch,
    handleClear,
    handleUpdateOptions,
    reload: loadData,
  }
}
