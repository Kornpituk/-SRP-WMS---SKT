import { checkSheetLorryFlexiRepository,
} from '@/repository/skt/stockUpdate/repository'


export const useGetSearchPlanService = () => {
  const getSearchPlanResult = ref(null)
  const errorGetSearchPlan = ref(null)
  
  const fetchSearchPlan = async (urlApi, form, whereHouse, accessToke, params = {}, statusID) => {
    try {
      errorGetSearchPlan.value = null

      // console.log('Fetching fetchSearchPlan...')
  
      const result = await checkSheetLorryFlexiRepository.getSearchPlan(urlApi, form, whereHouse, accessToke, params, statusID)
        
      if (result) {
        // console.log('Fetching data fetchSearchPlan:', result)
        getSearchPlanResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.log('Error in fetchSearchPlan:', error)
      errorGetSearchPlan.value = error.message
    }
  }
  
  return {
    getSearchPlanResult,
    errorGetSearchPlan,
    fetchSearchPlan,
  }
}


export const useGetItemSelectService = () => {
  const getItemSelectResult = ref(null)
  const errorGetItemSelect = ref(null)
  
  const fetchItemSelect = async (urlApi, form, whereHouse, accessToken, params, typeParams) => {
    try {
      errorGetItemSelect.value = null

      // console.log('Fetching fetchItemSelect...')
  
      const result = await checkSheetLorryFlexiRepository.getFilterSelectItem(urlApi, form, whereHouse, accessToken, params, typeParams)
        
      if (result) {
        // console.log('Fetching data fetchItemSelect:', result)
        getItemSelectResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.log('Error in fetchItemSelect:', error)
      errorGetItemSelect.value = error.message
    }
  }
  
  return {
    getItemSelectResult,
    errorGetItemSelect,
    fetchItemSelect,
  }
}

//---------------------------------- Export Excel ---------------------------------------
export const usePrintExportExcelService = () => {
  const printExportExcelResult = ref(null)
  const printExportExcelErrorMessage = ref(null)

  const printExportExcelService = async (urlApi, form, type, whereHouse, accessToken, params = {}, statusID) => {
   
    try {
      printExportExcelErrorMessage.value = null

      // console.log('Print Export Excel Form Service Starting...', urlApi, form, type, whereHouse, accessToken, params = {}, statusID)
  
      const result = await checkSheetLorryFlexiRepository.printExportExcel(urlApi, form, type, whereHouse, accessToken, params, statusID)
        
      if (result && result.success) {
        console.log('Print Export Excel Form Service Complete:', result)
        printExportExcelResult.value = result.data
        
        return { success: true, data: printExportExcelResult.value }
      } else {
        console.warn('Print Export Excel Form Service Failed')
        
        return { success: false, error: 'Print Export Excel Form Service Failed' }
      }
    } catch (error) {
      console.error('Error in printExportExcelService:', error)
      printExportExcelErrorMessage.value = error.message
      printExportExcelResult.value = null
      
      return { success: false, error: error.message }
    }
  }
  
  return {
    printExportExcelResult,
    printExportExcelErrorMessage,
    printExportExcelService,
  }
}
