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
