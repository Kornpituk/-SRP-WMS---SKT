import { checkSheetLorryFlexiRepository,
} from '@/repository/skt/shipmentPlan/respository'


//----------------------- Get ----------------------
export const useGetShippingCheckSheetService = () => {
  const getShippingCheckSheetResult = ref(null)
  const errorGetShippingCheckSheet = ref(null)
    
  const fetchShippingCheckSheet = async (urlApi, form, whereHouse, accessToke, SoEId) => {
    try {
      errorGetShippingCheckSheet.value = null
  
      // console.log('Fetching fetchShippingCheckSheet...')
    
      const result = await checkSheetLorryFlexiRepository.
        getShippingCheckSheetLorry(urlApi, form, whereHouse, accessToke, SoEId)
          
      if (result) {
        // console.log('Fetching data fetchShippingCheckSheet:', result)
        getShippingCheckSheetResult.value = result
          
        return result
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.log('Error in fetchShippingCheckSheet:', error)
      errorGetShippingCheckSheet.value = error.message
    }
  }
    
  return {
    getShippingCheckSheetResult,
    errorGetShippingCheckSheet,
    fetchShippingCheckSheet,
  }
}
