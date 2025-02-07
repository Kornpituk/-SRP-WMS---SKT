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

export const useSaveShippingCheckSheetService = () => {
  const saveShippingCheckSheetResult = ref(null)
  const errorSaveShippingCheckSheet = ref(null)
  
  const saveShippingCheckSheet = async (urlApi, form, whereHouse, accessToke, body) => {
    try {
      errorSaveShippingCheckSheet.value = null
      console.log('Fetching saveShippingCheckSheet...')
  
      const result = await checkSheetLorryFlexiRepository.saveShippingCheckSheetLorry(urlApi, form, whereHouse, accessToke, body)
        
      if (result) {
        // console.log('Fetching data saveShippingCheckSheet:', result)
        saveShippingCheckSheetResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.log('Error in saveShippingCheckSheet:', error)
      errorSaveShippingCheckSheet.value = error.message
    }
  }
  
  return {
    saveShippingCheckSheetResult,
    errorSaveShippingCheckSheet,
    saveShippingCheckSheet,
  }
}

export const useShippingCheckSheetLorryService = () => {
  const submitShipmentPlanResult = ref(null)
  const errorShippingCheckSheetLorry = ref(null)
  
  const submitShipmentPlan = async (urlApi, form, whereHouse, accessToke, soeId, comment) => {
    console.log('submitShipmentPlan sevice.')
    try {
      errorShippingCheckSheetLorry.value = null
      console.log('submitShipmentPlan...')
  
      const result = await checkSheetLorryFlexiRepository.submitShippingCheckSheetLorry(urlApi, form, whereHouse, accessToke, soeId, comment)
        
      if (result) {
        // console.log('submitShipmentPlan:', result)
        submitShipmentPlanResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.log('Error in submitShipmentPlan:', error)
      errorShippingCheckSheetLorry.value = error.message
    }
  }
  
  return {
    submitShipmentPlanResult,
    errorShippingCheckSheetLorry,
    submitShipmentPlan,
  }
}
