import { shipmentPlanRepository, FileService, checkSheetLorryFlexiRepository,
} from '@/repository/skt/shipmentPlan/respository'

export const useGetUserPermissionService = () => {
  const getUserPermissionResult = ref(null)
  const errorGetUserPermission = ref(null)
  
  const fetchUserPermission = async (urlApi, form, whereHouse, accessToke, params = {}) => {
    try {
      errorGetUserPermission.value = null

      // //console.log('Fetching fetchUserPermission...')
  
      const result = await shipmentPlanRepository.getPermissionUser(urlApi, form, whereHouse, accessToke, params)
        
      if (result) {
        // //console.log('Fetching data fetchUserPermission:', result)
        getUserPermissionResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      //console.log('Error in fetchUserPermission:', error)
      errorGetUserPermission.value = error.message
    }
  }
  
  return {
    getUserPermissionResult,
    errorGetUserPermission,
    fetchUserPermission,
  }
}

//----------------------------------- get ----------------------------
export const useGetSelectDataService = () => {
  const getSelectDataResult = ref(null)
  const errorGetSelectData = ref(null)
  
  const fetchSelectData = async (urlApi, form, type, whereHouse, accessToke) => {
    try {
      errorGetSelectData.value = null

      // //console.log('Fetching fetchSelectData...')
  
      const result = await shipmentPlanRepository.getSelect(urlApi, form, type, whereHouse, accessToke)
        
      if (result) {
        // //console.log('Fetching data fetchSelectData:', result)
        getSelectDataResult.value = result.data.data
        
        return result.data.data
      } else {
        // console.warn('No data returned from the API')
      }
    } catch (error) {
      //console.log('Error in fetchSelectData:', error)
      errorGetSelectData.value = error.message
    }
  }
  
  return {
    getSelectDataResult,
    errorGetSelectData,
    fetchSelectData,
  }
}

export const useGetDataTruckOrderService = () => {
  const getTruckOrderDataResult = ref(null)
  const errorGetTruckOrderData = ref(null)
  
  const fetchTruckOrderData = async (urlApi, SoeId, form, type, whereHouse, accessToke) => {
    try {
      errorGetTruckOrderData.value = null

      // //console.log('Fetching fetchTruckOrderData...')
  
      const result = await shipmentPlanRepository.getDataTruckOrderRepo(urlApi, SoeId, form, type, whereHouse, accessToke)
        
      if (result) {
        // //console.log('Fetching data fetchTruckOrderData:', result)
        getTruckOrderDataResult.value = result.data.data
        
        return result.data.data
      } else {
        // console.warn('No data returned from the API')
      }
    } catch (error) {
      //console.log('Error in fetchTruckOrderData:', error)
      errorGetTruckOrderData.value = error.message
    }
  }
  
  return {
    getTruckOrderDataResult,
    errorGetTruckOrderData,
    fetchTruckOrderData,
  }
}

export const useGetSearchPlanService = () => {
  const getSearchPlanResult = ref(null)
  const errorGetSearchPlan = ref(null)
  
  const fetchSearchPlan = async (urlApi, form, whereHouse, accessToke, params = {}, statusID) => {
    try {
      errorGetSearchPlan.value = null

      // //console.log('Fetching fetchSearchPlan...')
  
      const result = await shipmentPlanRepository.getSearchPlan(urlApi, form, whereHouse, accessToke, params, statusID)
        
      if (result) {
        // //console.log('Fetching data fetchSearchPlan:', result)
        getSearchPlanResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      //console.log('Error in fetchSearchPlan:', error)
      errorGetSearchPlan.value = error.message
    }
  }
  
  return {
    getSearchPlanResult,
    errorGetSearchPlan,
    fetchSearchPlan,
  }
}

export const useGetSearchPlanSapinvoicenoIsexistService = () => {
  const getSearchPlanSapInVResult = ref(null)
  const errorGetSearchPlanSapInV = ref(null)
  
  const fetchSearchPlanSapInV = async (urlApi, form, whereHouse, accessToke, SoEtlLogDetailJournalID, SAPInvoiceNo) => {
    try {
      errorGetSearchPlanSapInV.value = null
  
      const result = await shipmentPlanRepository.getSearchPlanSapinvoicenoIsexist(urlApi, form, whereHouse, accessToke, SoEtlLogDetailJournalID, SAPInvoiceNo)
        
      if (result) {
        getSearchPlanSapInVResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      errorGetSearchPlanSapInV.value = error.message
    }
  }
  
  return {
    getSearchPlanSapInVResult,
    errorGetSearchPlanSapInV,
    fetchSearchPlanSapInV,
  }
}


//---------------------------------- post ---------------------------------
export const useSaveSearchPlanService = () => {
  const saveSearchPlanResult = ref(null)
  const errorSaveSearchPlan = ref(null)
  
  const saveSearchPlan = async (urlApi, form, whereHouse, accessToke, body) => {
    try {
      errorSaveSearchPlan.value = null

      //console.log('Fetching saveSearchPlan...')
  
      const result = await shipmentPlanRepository.saveSearchPlan(urlApi, form, whereHouse, accessToke, body)
        
      if (result) {
        // //console.log('Fetching data saveSearchPlan:', result)
        saveSearchPlanResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      //console.log('Error in saveSearchPlan:', error)
      errorSaveSearchPlan.value = error.message
    }
  }
  
  return {
    saveSearchPlanResult,
    errorSaveSearchPlan,
    saveSearchPlan,
  }
}

export const useSaveTruckOrderService = () => {
  const saveTruckOrderResult = ref(null)
  const errorSaveTruckOrder = ref(null)
  
  const saveTruckOrder = async (urlApi, form, whereHouse, accessToke, body) => {
    try {
      errorSaveTruckOrder.value = null

      //console.log('Fetching saveTruckOrder...')
  
      const result = await shipmentPlanRepository.saveTruckOrderRepo(urlApi, form, whereHouse, accessToke, body)
        
      if (result) {
        // //console.log('Fetching data saveTruckOrder:', result)
        saveTruckOrderResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      //console.log('Error in saveTruckOrder:', error)
      errorSaveTruckOrder.value = error.message
    }
  }
  
  return {
    saveTruckOrderResult,
    errorSaveTruckOrder,
    saveTruckOrder,
  }
}

export const useSubmitShipmentPlanService = () => {
  const submitShipmentPlanResult = ref(null)
  const errorSubmitShipmentPlan = ref(null)
  
  const submitShipmentPlan = async (urlApi, form, whereHouse, accessToke, soeId, comment) => {
    //console.log('submitShipmentPlan sevice.')
    try {
      errorSubmitShipmentPlan.value = null

      // console.log('submitShipmentPlan...')
  
      const result = await shipmentPlanRepository.submitShipmentPlan(urlApi, form, whereHouse, accessToke, soeId, comment)
        
      if (result) {
        // //console.log('submitShipmentPlan:', result)
        submitShipmentPlanResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      errorSubmitShipmentPlan.value = error.message
    }
  }
  
  return {
    submitShipmentPlanResult,
    errorSubmitShipmentPlan,
    submitShipmentPlan,
  }
}

export const useSubmitShipmentPlanService2 = () => {
  const submitShipmentPlanResult2 = ref(null)
  const errorSubmitShipmentPlan2 = ref(null)
  
  const submitShipmentPlan2 = async (urlApi, form, whereHouse, accessToke, soeId, comment) => {
    //console.log('submitShipmentPlan sevice.')
    try {
      errorSubmitShipmentPlan2.value = null

      //console.log('submitShipmentPlan...')
  
      const result = await shipmentPlanRepository.submitShipmentPlan(urlApi, form, whereHouse, accessToke, soeId, comment)
        
      if (result) {
        // //console.log('submitShipmentPlan:', result)
        submitShipmentPlanResult2.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      //console.log('Error in submitShipmentPlan:', error)
      errorSubmitShipmentPlan2.value = error.message
    }
  }
  
  return {
    submitShipmentPlanResult2,
    errorSubmitShipmentPlan2,
    submitShipmentPlan2,
  }
}

//-------------------------------- Print ----------------------------------
export const usePrintShipmentPDFService = () => {
  const printShipmentPDFResult = ref(null)
  const errorPrintShipmentPDF = ref(null)
  
  const printShipmentPDF = async (urlApi, form, whereHouse, accessToke, soeId) => {
    try {
      errorPrintShipmentPDF.value = null

      //console.log('printShipmentPDF...')
  
      const result = await shipmentPlanRepository.printShipperPDFRepo(urlApi, form, whereHouse, accessToke, soeId)
        
      if (result) {
        // //console.log('printShipmentPDF:', result)
        printShipmentPDFResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      //console.log('Error in printShipmentPDF:', error)
      errorPrintShipmentPDF.value = error.message
    }
  }
  
  return {
    printShipmentPDFResult,
    errorPrintShipmentPDF,
    printShipmentPDF,
  }
}

export const usePrintPDFService = () => {
  const printPDFResult = ref(null)
  const printPDFErrorMessage = ref(null)

  const printPDFService = async (urlApi, form, type, whereHouse, accessToken, params = {}, LicensePlate, page) => {
   
    try {
      printPDFErrorMessage.value = null
  
      const result = await checkSheetLorryFlexiRepository.printPDF(urlApi, form, type, whereHouse, accessToken, params, LicensePlate, page)
        
      if (result && result.success) {
        //console.log('Print PDF Excel Form Service Complete:', result)
        printPDFResult.value = result.data
        
        return { success: true, data: printPDFResult.value }
      } else {
        console.warn('Print PDF Excel Form Service Failed')
        
        return { success: false, error: 'Print PDF Excel Form Service Failed' }
      }
    } catch (error) {
      console.error('Error in printPDFService:', error)
      printPDFErrorMessage.value = error.message
      printPDFResult.value = null
      
      return { success: false, error: error.message }
    }
  }
  
  return {
    printPDFResult,
    printPDFErrorMessage,
    printPDFService,
  }
}

export const usePrintTruckOrderFormPDFService = () => {
  const printTruckOrderFormPDFResult = ref(null)
  const errorPrintTruckOrderFormPDF = ref(null)
  
  const printTruckOrderFormPDF = async (urlApi, param = {}, whereHouse, accessToke, soeId) => {
    try {
      errorPrintTruckOrderFormPDF.value = null

      //console.log('printTruckOrderFormPDF...')
  
      const result = await shipmentPlanRepository.printTruckOrderFormPDFRepo(urlApi, param, whereHouse, accessToke, soeId)
        
      if (result) {
        // //console.log('printTruckOrderFormPDF:', result)
        printTruckOrderFormPDFResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      //console.log('Error in printTruckOrderFormPDF:', error)
      errorPrintTruckOrderFormPDF.value = error.message
    }
  }
  
  return {
    printTruckOrderFormPDFResult,
    errorPrintTruckOrderFormPDF,
    printTruckOrderFormPDF,
  }
}

//---------------------------------- Export Excel ---------------------------------------
export const usePrintExportExcelService = () => {
  const printExportExcelResult = ref(null)
  const printExportExcelErrorMessage = ref(null)

  const printExportExcelService = async (urlApi, form, type, whereHouse, accessToken, params = {}, statusID) => {
    try {
      printExportExcelErrorMessage.value = null

      //console.log('Print Export Excel Form Service Starting...')
  
      const result = await shipmentPlanRepository.printExportExcel(urlApi, form, type, whereHouse, accessToken, params, statusID)
        
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

//------------------------------------- File ---------------------------------
export const useSaveFileFormService = () => {
  const resultSaveFielForm = ref(null) // เก็บข้อมูล response ของการบันทึก
  const errorMessageSaveFileForm = ref(null) // เก็บข้อความแจ้งข้อผิดพลาด

  const functionSaveFileForm = async (files, soEtlLogDetailJournalID, form, urlApi, whereHouse, accessToken) => {
    try {
      // ตรวจสอบว่ามีไฟล์และข้อมูลก่อนที่จะดำเนินการบันทึก
      if (!files || files.length === 0) {
        //console.log('No files selected', files)
        throw new Error('No files selected', files)
      }

      if (!soEtlLogDetailJournalID || !urlApi || !accessToken) {
        throw new Error('Missing required parameters')
      }

      errorMessageSaveFileForm.value = null

      //console.log('Saving Draft Form COA...')

      // เรียกใช้ Service เพื่อบันทึกข้อมูล
      const result = await FileService.saveDraftFileForm(files, soEtlLogDetailJournalID, form, urlApi, whereHouse, accessToken)

      if (result) {
        // //console.log('Save data COA Controller:', result)
        resultSaveFielForm.value = { data: result, success: true } // เก็บข้อมูล response
        
        return result
      } else {
        throw new Error('Failed to save data')
      }
    } catch (error) {
      // console.error('Error in functionSaveFileForm:', error)

      // เก็บข้อมูลข้อผิดพลาด
      errorMessageSaveFileForm.value = { message: error.message, success: false }
    }
  }

  return {
    resultSaveFielForm,
    errorMessageSaveFileForm,
    functionSaveFileForm, // เปลี่ยนชื่อเป็น handleSaveDraftCoaForm เพื่อให้ชัดเจน
  }
}

export const useGetFileFormService = () => {
  const getFileFormResult = ref(null)
  const errorMessageGetFileForm = ref(null)

  const getFileFormFunction = async (soEtlLogDetailJournalID, form, type, urlApi, whereHouse, accessToken) => {
    try {
      errorMessageGetFileForm.value = null

      // //console.log('Fetching File Form ...')

      const result = await FileService.fetchFileForm(soEtlLogDetailJournalID, form, type, urlApi, whereHouse, accessToken)
      
      if (result) {
        // //console.log('Received File Form:', result)
        getFileFormResult.value = result
        
        return result // ส่งค่า��ลับเป็นข้อมูลที่ได้รับมา
      } else {
        // console.warn('No data returned from the API')
      }
    } catch (error) {
      // console.error('Error in getFileFormResult:', error)
      errorMessageGetFileForm.value = error.message
    }
  }

  return {
    getFileFormResult,
    errorMessageGetFileForm,
    getFileFormFunction,
  }
}

export const useDeleteFileFormService = () => {
  const deleteFileFormResult = ref(null)
  const errorMessageDeleteFileForm = ref(null)

  const deleteFileFormFunction = async (soEtlLogDetailJournalID, form, type, urlApi, whereHouse, accessToken) => {
    try {
      errorMessageDeleteFileForm.value = null

      // //console.log('Fetching File Form ...')

      const result = await FileService.deleteFileForm(soEtlLogDetailJournalID, form, type, urlApi, whereHouse, accessToken)
      
      if (result) {
        // //console.log('Received File Form:', result)
        deleteFileFormResult.value = result
        
        return result // ส่งค่า��ลับเป็นข้อมูลที่ได้รับมา
      } else {
        // console.warn('No data returned from the API')
      }
    } catch (error) {
      // console.error('Error in deleteFileFormResult:', error)
      errorMessageDeleteFileForm.value = error.message
    }
  }

  return {
    deleteFileFormResult,
    errorMessageDeleteFileForm,
    deleteFileFormFunction,
  }
}


