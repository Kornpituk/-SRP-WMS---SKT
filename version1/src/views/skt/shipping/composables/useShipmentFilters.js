// =====================================================
// 📄 composables/useShipmentFilters.js
// =====================================================
import { ref, computed, watch } from 'vue'

export function useShipmentFilters(data) {
  const filters = ref({
    StatusId: '',
    ETA: '',
    ETD: '',
    SalesOrderNoSearch: '',
    PayerNameSearch: '',
    ItemNameSearch: '',
    LotSearch: '',
  })
  
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const sortColumn = ref('')
  const sortDirection = ref('asc')
  
  // ✅ Efficient filtering with computed
  const filteredData = computed(() => {
    let result = data.value
    
    // Apply filters
    if (filters.value.StatusId) {
      result = result.filter(item => 
        item.statusText === filters.value.StatusId,
      )
    }
    
    if (filters.value.SalesOrderNoSearch) {
      const search = filters.value.SalesOrderNoSearch.toLowerCase()

      result = result.filter(item =>
        item.salesOrderNo?.toLowerCase().includes(search),
      )
    }
    
    // Apply sorting
    if (sortColumn.value) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortColumn.value]
        const bVal = b[sortColumn.value]
        const modifier = sortDirection.value === 'asc' ? 1 : -1
        
        return aVal > bVal ? modifier : -modifier
      })
    }
    
    return result
  })
  
  // ✅ Pagination
  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    
    return filteredData.value.slice(start, end)
  })
  
  const totalItems = computed(() => filteredData.value.length)

  const totalPages = computed(() => 
    Math.ceil(totalItems.value / itemsPerPage.value),
  )
  
  // Reset page when filters change
  watch(filters, () => {
    currentPage.value = 1
  }, { deep: true })
  
  function toggleSort(column) {
    if (sortColumn.value === column) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortColumn.value = column
      sortDirection.value = 'asc'
    }
  }
  
  return {
    filters,
    currentPage,
    itemsPerPage,
    sortColumn,
    sortDirection,
    filteredData,
    paginatedData,
    totalItems,
    totalPages,
    toggleSort,
  }
}
