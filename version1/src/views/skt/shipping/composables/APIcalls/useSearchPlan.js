export const useSearchPlan = () => {
  const searchPlanData = ref([])
  const isLoading = ref(false)
  const selectedDataTables = ref([])

  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const selectedItemsPerPage = ref(10)

  const sortColumn = ref('')
  const sortDirection = ref('')
  
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


  const saveHistoryFilter = () => {
    sessionStorage.setItem("StatusIdSearchProductionFilter", filterForSearchPlan.value.StatusId || ''),
    sessionStorage.setItem("ETASearchProductionFilter", etaDateModel.value) || '',
    sessionStorage.setItem("ETDSearchProductionFilter", etdDateModel.value) || '',
    sessionStorage.setItem("SalesOrderNoSearchProductionFilter", filterForSearchPlan.value.SalesOrderNoSearch) || '',
    sessionStorage.setItem("PayerNameSearchProductionFilter", filterForSearchPlan.value.PayerNameSearch) || '',
    sessionStorage.setItem("LotSearchProductionFilter", filterForSearchPlan.value.LotSearch) || '',
    sessionStorage.setItem("ItemNameSearchProductionFilter", filterForSearchPlan.value.ItemNameSearch) || ''
  }

  return {
    searchPlanData,
    isLoading,
    selectedDataTables,
    currentPage,
    itemsPerPage,
    selectedItemsPerPage,
    sortColumn,
    sortDirection,
    etaDateModel,
    etdDateModel,
    filterForSearchPlan,

    saveHistoryFilter,
  }
}
