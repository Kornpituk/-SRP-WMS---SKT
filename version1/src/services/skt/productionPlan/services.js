import { productionPlanRepository,
} from '@/repository/skt/productionPlan/repository'


export const useNewProductionPlanService = () => {
  const responseNewProductionPlan = ref(null)
  const errorMessageNewProductionPlan = ref(null)
  
  const newProdutcionPlanFunc = async (batchId, planningId, urlApi, form, whereHouse, accessToke) => {
    try {
      errorMessageNewProductionPlan.value = null
      console.log('New Produtcion Plan Func...')
  
      const result = await productionPlanRepository.newProductionPlan(batchId, planningId, urlApi, form, whereHouse, accessToke)
        
      if (result) {
        console.log('New Produtcion Plan Func result:', result)
        responseNewProductionPlan.value = result
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in newProdutcionPlanFunc:', error)
      errorMessageNewProductionPlan.value = error.message
    }
  }
  
  return {
    responseNewProductionPlan,
    errorMessageNewProductionPlan,
    newProdutcionPlanFunc,
  }
}

export const useDeleteProductionPlanService = () => {
  const responseDeleteProductionPlan = ref(null)
  const errorMessageDeleteProductionPlan = ref(null)
  
  const deleteProdutcionPlanFunc = async (batchId, planningId, urlApi, form, whereHouse, accessToke) => {
    try {
      errorMessageDeleteProductionPlan.value = null
      console.log('Delete Produtcion Plan Func...')
  
      const result = await productionPlanRepository.deleteProductionPlan(batchId, planningId, urlApi, form, whereHouse, accessToke)
        
      if (result) {
        console.log('Delete Produtcion Plan Func result:', result)
        responseDeleteProductionPlan.value = result
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in deleteProdutcionPlanFunc:', error)
      errorMessageDeleteProductionPlan.value = error.message
    }
  }
  
  return {
    responseDeleteProductionPlan,
    errorMessageDeleteProductionPlan,
    deleteProdutcionPlanFunc,
  }
}

export const useSaveProductionPlanService = () => {
  const responseSaveProductionPlan = ref(null)
  const errorMessageSaveProductionPlan = ref(null)
    
  const saveProdutcionPlanFunc = async (formData, batchId, urlApi, form, whereHouse, accessToke) => {
    try {
      errorMessageSaveProductionPlan.value = null
      console.log('New Produtcion Plan Func...')
    
      const result = await productionPlanRepository.saveProductionPlan(formData, batchId, urlApi, form, whereHouse, accessToke)
          
      if (result) {
        console.log('New Produtcion Plan Func result:', result)
        responseSaveProductionPlan.value = result
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in saveProdutcionPlanFunc:', error)
      errorMessageSaveProductionPlan.value = error.message
    }
  }
    
  return {
    responseSaveProductionPlan,
    errorMessageSaveProductionPlan,
    saveProdutcionPlanFunc,
  }
}

export const useGetProductionPlanService = () => {
  const getProductionplanResult = ref(null)
  const errorMessageGetProductionPlan = ref(null)
  
  const fetchGetProductionplan = async (batchId, urlApi, form, whereHouse, accessToke) => {
    try {
      errorMessageGetProductionPlan.value = null
      console.log('Fetching getProductionplan...')
  
      const result = await productionPlanRepository.getProductionPlan(batchId, urlApi, form, whereHouse, accessToke)
        
      if (result) {
        console.log('Fetching data getProductionplan:', result)
        getProductionplanResult.value = result
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in fetchGetProductionplan:', error)
      errorMessageGetProductionPlan.value = error.message
    }
  }
  
  return {
    getProductionplanResult,
    errorMessageGetProductionPlan,
    fetchGetProductionplan,
  }
}

export const useGetBatchProductionPlanService = () => {
  const getBatchProductionplanResult = ref(null)
  const errorMessageGetBatchProductionPlan = ref(null)
  
  const fetchGetBatchProductionplan = async (urlApi, form, whereHouse, accessToke) => {
    try {
      errorMessageGetBatchProductionPlan.value = null
      console.log('Fetching fetchGetBatchProductionplan...')
  
      const result = await productionPlanRepository.getProductionPlanBatch(urlApi, form, whereHouse, accessToke)
        
      if (result) {
        // console.log('Fetching data fetchGetBatchProductionplan:', result.data)
        getBatchProductionplanResult.value = result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in fetchGetBatchProductionplan:', error)
      errorMessageGetBatchProductionPlan.value = error.message
    }
  }
  
  return {
    getBatchProductionplanResult,
    errorMessageGetBatchProductionPlan,
    fetchGetBatchProductionplan,
  }
}
