import { checkSheetShipmentPlanRepository, FileService,
} from '@/repository/skt/shipmentPlan/respository'

//----------------------- Get ----------------------
export const useGetShippingCheckSheetService = () => {
  const getShippingCheckSheetResult = ref(null)
  const errorGetShippingCheckSheet = ref(null)
    
  const fetchShippingCheckSheet = async (urlApi, form, whereHouse, accessToke, SoEId) => {
    try {
      errorGetShippingCheckSheet.value = null
  
      // console.log('Fetching fetchShippingCheckSheet...')
    
      const result = await checkSheetShipmentPlanRepository.getShippingCheckSheet(urlApi, form, whereHouse, accessToke, SoEId)
          
      if (result) {
        // console.log('Fetching data fetchShippingCheckSheet:', result)
        getShippingCheckSheetResult.value = result.data
          
        return result.data
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

//----------------------- Post ----------------------
export const useGenerateFormService = () => {
  const generateFormResult = ref(null)
  const generateFormError = ref(null)
  
  const generateFormFunction = async (urlApi, form, whereHouse, accessToke, soeId) => {
    try {
      generateFormError.value = null
      console.log('generateFormFunction...')
  
      const result = await checkSheetShipmentPlanRepository.generateForm(urlApi, form, whereHouse, accessToke, soeId)
        
      if (result) {
        // console.log('generateFormFunction:', result)
        generateFormResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.log('Error in generateFormFunction:', error)
      generateFormError.value = error.message
    }
  }
  
  return {
    generateFormResult,
    generateFormError,
    generateFormFunction,
  }
}

export const useSubmitCheckSheetService = () => {
  const submitCheckSheetResult = ref(null)
  const submitCheckSheetError = ref(null)
  
  const submitCheckSheetFunction = async (urlApi, form, whereHouse, accessToke, soeId) => {
    try {
      submitCheckSheetError.value = null
      console.log('submitCheckSheetFunctio...')
  
      const result = await checkSheetCheckSheetRepository.submitCheckSheet(urlApi, form, whereHouse, accessToke, soeId)
        
      if (result) {
        // console.log('submitCheckSheetFunctio:', result)
        submitCheckSheetResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.log('Error in submitCheckSheetFunctio:', error)
      submitCheckSheetError.value = error.message
    }
  }
  
  return {
    submitCheckSheetResult,
    submitCheckSheetError,
    submitCheckSheetFunctio,
  }
}
