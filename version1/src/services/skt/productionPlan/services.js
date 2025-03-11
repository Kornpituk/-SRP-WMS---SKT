import { productionPlanRepository,
} from '@/repository/skt/productionPlan/repository'

export const useNewProductionPlanService = () => {
  const responseNewProductionPlan = ref(null)
  const errorMessageNewProductionPlan = ref(null)
  
  const newProdutcionPlanFunc = async (batchId, planningId, urlApi, form, whereHouse, accessToke) => {
    try {
      errorMessageNewProductionPlan.value = null

      //console.log('New Produtcion Plan Func...')
  
      const result = await productionPlanRepository.newProductionPlan(batchId, planningId, urlApi, form, whereHouse, accessToke)
        
      if (result) {
        //console.log('New Produtcion Plan Func result:', result)
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

      //console.log('Delete Batch Produtcion Plan Func...')
  
      const result = await productionPlanRepository.deleteBatchProductionPlan(batchId, urlApi, form, whereHouse, accessToke)
        
      if (result) {
        //console.log('Delete Batch Produtcion Plan Func result:', result)
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

      //console.log('Delete Produtcion Plan Func...')
  
      const result = await productionPlanRepository.deleteProductionPlan(planningId, urlApi, form, whereHouse, accessToke)
        
      if (result) {
        //console.log('Delete Produtcion Plan Func result:', result)
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

export const useRejectProductionPlanService = () => {
  const responseRejectProductionPlan = ref(null)
  const errorMessageRejectProductionPlan = ref(null)
  
  const rejectProdutcionPlanFunc = async (statusComment, planningId, urlApi, form, whereHouse, accessToke) => {
    try {
      errorMessageRejectProductionPlan.value = null

      //console.log('Reject Produtcion Plan Func...')
  
      const result = await productionPlanRepository.rejectBatchProductionPlan(statusComment, planningId, urlApi, form, whereHouse, accessToke)
        
      if (result) {
        //console.log('Reject Produtcion Plan Func result:', result)
        responseRejectProductionPlan.value = result
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in rejectProdutcionPlanFunc:', error)
      errorMessageRejectProductionPlan.value = error.message
    }
  }
  
  return {
    responseRejectProductionPlan,
    errorMessageRejectProductionPlan,
    rejectProdutcionPlanFunc,
  }
}

export const useValidateBatchProductionPlanService = () => {
  const responseValidateLotBatchProductionPlan = ref(null)
  const errorMessageValidateLotBatchProductionPlan = ref(null)
  
  const validateLotBatchProdutcionPlanFunc = async (planningId, urlApi, form, whereHouse, accessToke) => {
    try {
      errorMessageValidateLotBatchProductionPlan.value = null

      //console.log('Genertate Batch lot Produtcion Plan Func...')
  
      const result = await productionPlanRepository.validateLotBatchProductionPlan(planningId, urlApi, form, whereHouse, accessToke)
        
      if (result) {
        //console.log('Genertate Batch lot Produtcion Plan Func result:', result)
        responseValidateLotBatchProductionPlan.value = result.data.message
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in validateLotBatchProdutcionPlanFunc:', error.error.data.message)
      errorMessageValidateLotBatchProductionPlan.value = error.error.data.message
    }
  }
  
  return {
    responseValidateLotBatchProductionPlan,
    errorMessageValidateLotBatchProductionPlan,
    validateLotBatchProdutcionPlanFunc,
  }
}

export const useGenerateBatchProductionPlanService = () => {
  const responseGenerateLotBatchProductionPlan = ref(null)
  const errorMessageGenerateLotBatchProductionPlan = ref(null)
  
  const generateLotBatchProdutcionPlanFunc = async (planningId, urlApi, form, whereHouse, accessToke) => {
    try {
      errorMessageGenerateLotBatchProductionPlan.value = null

      //console.log('Genertate Batch lot Produtcion Plan Func...')
  
      const result = await productionPlanRepository.generateLotBatchProductionPlan(planningId, urlApi, form, whereHouse, accessToke)
        
      if (result) {
        //console.log('Genertate Batch lot Produtcion Plan Func result:', result)
        responseGenerateLotBatchProductionPlan.value = result
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in generateLotBatchProdutcionPlanFunc:', error)
      errorMessageGenerateLotBatchProductionPlan.value = error.message
    }
  }
  
  return {
    responseGenerateLotBatchProductionPlan,
    errorMessageGenerateLotBatchProductionPlan,
    generateLotBatchProdutcionPlanFunc,
  }
}

export const useSubmitProductionPlanService = () => {
  const responseSubmitProductionPlan = ref(null)
  const errorMessageSubmitProductionPlan = ref(null)
  
  const submitProdutcionPlanFunc = async (planningId, urlApi, form, whereHouse, accessToke) => {
    try {
      errorMessageSubmitProductionPlan.value = null

      //console.log('Submit Produtcion Plan Func...')
  
      const result = await productionPlanRepository.submitProductionPlan(planningId, urlApi, form, whereHouse, accessToke)
        
      if (result) {
        //console.log('Submit Produtcion Plan Func result:', result)
        if(result.success){
          responseSubmitProductionPlan.value = result
        }else{
          errorMessageSubmitProductionPlan.value = result.error
        }
        
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in submitProdutcionPlanFunc:', error)
      errorMessageSubmitProductionPlan.value = error.message
    }
  }
  
  return {
    responseSubmitProductionPlan,
    errorMessageSubmitProductionPlan,
    submitProdutcionPlanFunc,
  }
}

export const useApproveProductionPlanService = () => {
  const responseApproveProductionPlan = ref(null)
  const errorMessageApproveProductionPlan = ref(null)
  
  const approveProdutcionPlanFunc = async (planningId, urlApi, form, type, whereHouse, accessToke) => {
    try {
      errorMessageApproveProductionPlan.value = null

      //console.log('Approve Produtcion Plan Func...')
  
      const result = await productionPlanRepository.approveProductionPlan(planningId, urlApi, form, type, whereHouse, accessToke)
        
      if (result) {
        //console.log('Approve Produtcion Plan Func result:', result)
        responseApproveProductionPlan.value = result
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in ApproveProdutcionPlanFunc:', error)
      errorMessageApproveProductionPlan.value = error.message
    }
  }
  
  return {
    responseApproveProductionPlan,
    errorMessageApproveProductionPlan,
    approveProdutcionPlanFunc,
  }
}

export const useGetProductionPlanSearchService = () => {
  const getProductionplanSearchResult = ref(null)
  const errorMessageGetProductionPlanSearch = ref(null)
  
  const fetchGetProductionplanSearch = async (filter, urlApi, form, whereHouse, accessToke) => {
    try {
      errorMessageGetProductionPlanSearch.value = null

      //console.log('Fetching getProductionPlanSearch...')
  
      const result = await productionPlanRepository.getProductionPlanSearch(filter, urlApi, form, whereHouse, accessToke)
        
      if (result) {
        //console.log('Fetching data getProductionPlanSearch:', result)
        getProductionplanSearchResult.value = result
        
        return result
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      //console.log('Error in fetchGetProductionplanSearch:', error)
      errorMessageGetProductionPlanSearch.value = error.message
    }
  }
  
  return {
    getProductionplanSearchResult,
    errorMessageGetProductionPlanSearch,
    fetchGetProductionplanSearch,
  }
}

export const useGetProductionPlanService = () => {
  const getProductionplanResult = ref(null)
  const errorMessageGetProductionPlan = ref(null)
  
  const fetchGetProductionplan = async (batchId, sortColumn, sortDirection, urlApi, form, whereHouse, accessToke) => {
    try {
      errorMessageGetProductionPlan.value = null

      //console.log('Fetching getProductionplan...')
  
      const result = await productionPlanRepository.getProductionPlan(batchId, sortColumn, sortDirection, urlApi, form, whereHouse, accessToke)
        
      if (result) {
        //console.log('Fetching data getProductionplan:', result)
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

      //console.log('Fetching fetchGetProductionplanMaster...')
  
      const result = await productionPlanRepository.getProductionPlanMaster(search, urlApi, form, whereHouse, accessToke)
        
      if (result) {
        //console.log('Fetching data fetchGetProductionplanMaster:', result)
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

      //console.log('Fetching fetchGetBatchProductionplan...')
  
      const result = await productionPlanRepository.getProductionPlanBatch(urlApi, form, whereHouse, accessToke)
        
      if (result) {
        // //console.log('Fetching data fetchGetBatchProductionplan:', result.data)
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

export const useSaveProductionPlanService = () => {
  const responseSaveProductionPlan = ref(null)
  const errorMessageSaveProductionPlan = ref(null)
  
  const saveProdutcionPlanFunc = async (formData, urlApi, form, whereHouse, accessToke) => {
    try {
      errorMessageSaveProductionPlan.value = null

      //console.log('Save Produtcion Plan Func...')
  
      const result = await productionPlanRepository.saveProductionPlan(formData, urlApi, form, whereHouse, accessToke)
        
      if (result) {
        //console.log('Save Produtcion Plan Func result:', result)
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

//--------------------------------------- Excel ---------------------------------------

export const usePrintExportExcelService = () => {
  const printExportExcelResult = ref(null)
  const printExportExcelErrorMessage = ref(null)

  const printExportExcelService = async (urlApi, whereHouse, accessToken, params = {}) => {
    try {
      printExportExcelErrorMessage.value = null

      //console.log('Print Export Excel Form Service Starting...')
  
      const result = await productionPlanRepository.printExportExcel(urlApi, whereHouse, accessToken, params)
        
      if (result && result.success) {
        //console.log('Print Export Excel Form Service Complete:', result)
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

export const useGetStatusTextService = () => {
  const getStatusTextCodeResult = ref(null)
  const errorMessageGetStatusText = ref(null)
  
  const fetchGetStatusText = async (urlApi, form, whereHouse, accessToke) => {
    try {
      errorMessageGetStatusText.value = null

      //console.log('Fetching fetchGetStatusText...')
  
      const result = await productionPlanRepository.getStatusText(urlApi, form, whereHouse, accessToke)
        
      if (result) {
        //console.log('Fetching data fetchGetStatusText:', result)
        getStatusTextCodeResult.value = result
        
        return result
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      //console.log('Error in fetchGetStatusText:', error)
      errorMessageGetStatusText.value = error.message
    }
  }
  
  return {
    getStatusTextCodeResult,
    errorMessageGetStatusText,
    fetchGetStatusText,
  }
}

