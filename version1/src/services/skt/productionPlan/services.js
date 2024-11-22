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

export const useDeleteBatchProductionPlanService = () => {
  const responseDeleteBatchProductionPlan = ref(null)
  const errorMessageDeleteBatchProductionPlan = ref(null)
  
  const deleteBatchProdutcionPlanFunc = async (batchId, urlApi, form, whereHouse, accessToke) => {
    try {
      errorMessageDeleteBatchProductionPlan.value = null
      console.log('Delete Batch Produtcion Plan Func...')
  
      const result = await productionPlanRepository.deleteBatchProductionPlan(batchId, urlApi, form, whereHouse, accessToke)
        
      if (result) {
        console.log('Delete Batch Produtcion Plan Func result:', result)
        responseDeleteBatchProductionPlan.value = result
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in deleteBatchProdutcionPlanFunc:', error)
      errorMessageDeleteBatchProductionPlan.value = error.message
    }
  }
  
  return {
    responseDeleteBatchProductionPlan,
    errorMessageDeleteBatchProductionPlan,
    deleteBatchProdutcionPlanFunc,
  }
}

export const useDeleteProductionPlanService = () => {
  const responseDeleteProductionPlan = ref(null)
  const errorMessageDeleteProductionPlan = ref(null)
  
  const deleteProdutcionPlanFunc = async (planningId, urlApi, form, whereHouse, accessToke) => {
    try {
      errorMessageDeleteProductionPlan.value = null
      console.log('Delete Produtcion Plan Func...')
  
      const result = await productionPlanRepository.deleteProductionPlan(planningId, urlApi, form, whereHouse, accessToke)
        
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

export const useGetProductionPlanMasterService = () => {
  const getProductionplanMasterResult = ref(null)
  const errorMessageGetProductionPlanMaster = ref(null)
  
  const fetchGetProductionplanMaster = async (search, urlApi, form, whereHouse, accessToke) => {
    try {
      errorMessageGetProductionPlanMaster.value = null
      console.log('Fetching fetchGetProductionplanMaster...')
  
      const result = await productionPlanRepository.getProductionPlanMaster(search, urlApi, form, whereHouse, accessToke)
        
      if (result) {
        console.log('Fetching data fetchGetProductionplanMaster:', result)
        getProductionplanMasterResult.value = result
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in fetchGetProductionplanMaster:', error)
      errorMessageGetProductionPlanMaster.value = error.message
    }
  }
  
  return {
    getProductionplanMasterResult,
    errorMessageGetProductionPlanMaster,
    fetchGetProductionplanMaster,
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
