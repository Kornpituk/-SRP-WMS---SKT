/**
 * Shipment State Management Composable
 * Manages table data, pagination, filtering, and selection state
 */
import { computed, ref, watch } from 'vue'

export function useShipmentState() {
  // =============== Data State ===============
  const products = ref([]) // All products
  const searchPlanData = ref([]) // Search plan data
  const isLoading = ref(false)
  
  // =============== Pagination State ===============
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const selectedItemsPerPage = ref(10)
  
  const totalItems = computed(() => searchPlanData.value.length)
  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))
  
  // Paginated data
  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = currentPage.value * itemsPerPage.value
    
    return searchPlanData.value.slice(start, end)
  })
  
  // =============== Selection State ===============
  const selectedDataTables = ref([])
  const isSelectAll = ref(false)
  
  const isAllSelected = computed(() => {
    return paginatedData.value.length > 0 && 
           selectedDataTables.value.length === paginatedData.value.length
  })
  
  // =============== Filter State ===============
  const etaDateModel = ref(sessionStorage.getItem("ETASearchProductionFilter"))
  const etdDateModel = ref(sessionStorage.getItem("ETDSearchProductionFilter"))
  
  const filterForSearchPlan = ref({
    StatusId: sessionStorage.getItem("StatusIdSearchProductionFilter") || '',
    ETA: etaDateModel.value || '',
    ETD: etdDateModel.value || '',
    ETDDateFrom: '',
    ETDDateTo: '',
    SalesOrderNoSearch: sessionStorage.getItem("SalesOrderNoSearchProductionFilter") || '',
    PayerNameSearch: sessionStorage.getItem("PayerNameSearchProductionFilter") || '',
    ItemNameSearch: sessionStorage.getItem("ItemNameSearchProductionFilter") || '',
    LotSearch: sessionStorage.getItem("LotSearchProductionFilter") || '',
    SortColumn: '',
    SortDirection: '',
  })
  
  // =============== Sorting State ===============
  const sortColumn = ref('')
  const sortDirection = ref('')
  
  // =============== Table Highlight State ===============
  const dataTableColor = ref('#E0F7FA')
  const dataTableNummberedToggle = ref(null)
  
  // =============== Watchers ===============
  watch(selectedItemsPerPage, newVal => {
    const newItems = newVal === 'All' ? totalItems.value : newVal
    if (itemsPerPage.value !== newItems) {
      itemsPerPage.value = newItems
      currentPage.value = 1
    }
  })
  
  watch(currentPage, newVal => {
    if (newVal < 1) currentPage.value = 1
    if (newVal > totalPages.value) currentPage.value = totalPages.value
  })
  
  // =============== Methods ===============
  
  /**
   * Save filter history to sessionStorage
   */
  function saveHistoryFilter() {
    sessionStorage.setItem("StatusIdSearchProductionFilter", filterForSearchPlan.value.StatusId || '')
    sessionStorage.setItem("ETASearchProductionFilter", etaDateModel.value) || ''
    sessionStorage.setItem("ETDSearchProductionFilter", etdDateModel.value) || ''
    sessionStorage.setItem("SalesOrderNoSearchProductionFilter", filterForSearchPlan.value.SalesOrderNoSearch) || ''
    sessionStorage.setItem("PayerNameSearchProductionFilter", filterForSearchPlan.value.PayerNameSearch) || ''
    sessionStorage.setItem("LotSearchProductionFilter", filterForSearchPlan.value.LotSearch) || ''
    sessionStorage.setItem("ItemNameSearchProductionFilter", filterForSearchPlan.value.ItemNameSearch) || ''
  }
  
  /**
   * Clear all filters
   */
  function clearFilters() {
    filterForSearchPlan.value = {
      StatusId: '',
      ETA: '',
      ETD: '',
      SalesOrderNoSearch: '',
      PayerNameSearch: '',
      ItemNameSearch: '',
      LotSearch: '',
      SortColumn: '',
      SortDirection: '',
    }
    etaDateModel.value = ''
    etdDateModel.value = ''
  }
  
  /**
   * Toggle column sort direction
   */
  function toggleDirection(key) {
    if (key) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    }
    sortColumn.value = key
  }
  
  /**
   * Toggle select all rows
   */
  function toggleSelectAll() {
    if (isAllSelected.value) {
      selectedDataTables.value = []
    } else {
      selectedDataTables.value = [...paginatedData.value]
    }
  }
  
  /**
   * Check if item is selected
   */
  function isSelected(item) {
    return selectedDataTables.value.some(
      selectedItem => selectedItem.journalID === item.journalID,
    )
  }
  
  /**
   * Toggle row highlight
   */
  function dataTableClickHighlightIsToggle(no) {
    if (dataTableNummberedToggle.value === no) {
      dataTableNummberedToggle.value = null
    } else if (dataTableNummberedToggle.value === null) {
      dataTableNummberedToggle.value = no
    }
  }
  
  // =============== Pagination Navigation ===============
  function goToFirstPage() {
    currentPage.value = 1
  }
  
  function goToPrevPage() {
    currentPage.value = Math.max(1, currentPage.value - 1)
  }
  
  function goToNextPage() {
    currentPage.value = Math.min(totalPages.value, currentPage.value + 1)
  }
  
  function goToLastPage() {
    currentPage.value = totalPages.value
  }
  
  return {
    // State
    products,
    searchPlanData,
    isLoading,
    currentPage,
    itemsPerPage,
    selectedItemsPerPage,
    totalItems,
    totalPages,
    paginatedData,
    selectedDataTables,
    isSelectAll,
    isAllSelected,
    filterForSearchPlan,
    etaDateModel,
    etdDateModel,
    sortColumn,
    sortDirection,
    dataTableColor,
    dataTableNummberedToggle,
    
    // Methods
    saveHistoryFilter,
    clearFilters,
    toggleDirection,
    toggleSelectAll,
    isSelected,
    dataTableClickHighlightIsToggle,
    goToFirstPage,
    goToPrevPage,
    goToNextPage,
    goToLastPage,
  }
}
