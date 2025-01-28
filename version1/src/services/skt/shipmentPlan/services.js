import { shipmentPlanRepository, FileService,
} from '@/repository/skt/shipmentPlan/respository'

export const useGetUserPermissionService = () => {
  const getUserPermissionResult = ref(null)
  const errorGetUserPermission = ref(null)
  
  const fetchUserPermission = async (urlApi, form, whereHouse, accessToke, params = {}) => {
    try {
      errorGetUserPermission.value = null

      // console.log('Fetching fetchUserPermission...')
  
      const result = await shipmentPlanRepository.getPermissionUser(urlApi, form, whereHouse, accessToke, params)
        
      if (result) {
        // console.log('Fetching data fetchUserPermission:', result)
        getUserPermissionResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.log('Error in fetchUserPermission:', error)
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

      // console.log('Fetching fetchSelectData...')
  
      const result = await shipmentPlanRepository.getSelect(urlApi, form, type, whereHouse, accessToke)
        
      if (result) {
        // console.log('Fetching data fetchSelectData:', result)
        getSelectDataResult.value = result.data.data
        
        return result.data.data
      } else {
        // console.warn('No data returned from the API')
      }
    } catch (error) {
      console.log('Error in fetchSelectData:', error)
      errorGetSelectData.value = error.message
    }
  }
  
  return {
    getSelectDataResult,
    errorGetSelectData,
    fetchSelectData,
  }
}

export const useGetSearchPlanService = () => {
  const getSearchPlanResult = ref(null)
  const errorGetSearchPlan = ref(null)
  
  const fetchSearchPlan = async (urlApi, form, whereHouse, accessToke, params = {}, statusID) => {
    try {
      errorGetSearchPlan.value = null

      // console.log('Fetching fetchSearchPlan...')
  
      const result = await shipmentPlanRepository.getSearchPlan(urlApi, form, whereHouse, accessToke, params, statusID)
        
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

//---------------------------------- post ---------------------------------
export const useSaveSearchPlanService = () => {
  const saveSearchPlanResult = ref(null)
  const errorSaveSearchPlan = ref(null)
  
  const saveSearchPlan = async (urlApi, form, whereHouse, accessToke, body) => {
    try {
      errorSaveSearchPlan.value = null
      console.log('Fetching saveSearchPlan...')
  
      const result = await shipmentPlanRepository.saveSearchPlan(urlApi, form, whereHouse, accessToke, body)
        
      if (result) {
        // console.log('Fetching data saveSearchPlan:', result)
        saveSearchPlanResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.log('Error in saveSearchPlan:', error)
      errorSaveSearchPlan.value = error.message
    }
  }
  
  return {
    saveSearchPlanResult,
    errorSaveSearchPlan,
    saveSearchPlan,
  }
}

export const useSubmitShipmentPlanService = () => {
  const submitShipmentPlanResult = ref(null)
  const errorSubmitShipmentPlan = ref(null)
  
  const submitShipmentPlan = async (urlApi, form, whereHouse, accessToke, soeId) => {
    try {
      errorSubmitShipmentPlan.value = null
      console.log('submitShipmentPlan...')
  
      const result = await shipmentPlanRepository.submitShipmentPlan(urlApi, form, whereHouse, accessToke, soeId)
        
      if (result) {
        // console.log('submitShipmentPlan:', result)
        submitShipmentPlanResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.log('Error in submitShipmentPlan:', error)
      errorSubmitShipmentPlan.value = error.message
    }
  }
  
  return {
    submitShipmentPlanResult,
    errorSubmitShipmentPlan,
    submitShipmentPlan,
  }
}

//-------------------------------- Print ----------------------------------
export const usePrintShipmentPDFService = () => {
  const printShipmentPDFResult = ref(null)
  const errorPrintShipmentPDF = ref(null)
  
  const printShipmentPDF = async (urlApi, form, whereHouse, accessToke, soeId) => {
    try {
      errorPrintShipmentPDF.value = null
      console.log('printShipmentPDF...')
  
      const result = await shipmentPlanRepository.printShipperPDFRepo(urlApi, form, whereHouse, accessToke, soeId)
        
      if (result) {
        // console.log('printShipmentPDF:', result)
        printShipmentPDFResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.log('Error in printShipmentPDF:', error)
      errorPrintShipmentPDF.value = error.message
    }
  }
  
  return {
    printShipmentPDFResult,
    errorPrintShipmentPDF,
    printShipmentPDF,
  }
}

export const usePrintTruckOrderFormPDFService = () => {
  const printTruckOrderFormPDFResult = ref(null)
  const errorPrintTruckOrderFormPDF = ref(null)
  
  const printTruckOrderFormPDF = async (urlApi, param = {}, whereHouse, accessToke, soeId) => {
    try {
      errorPrintTruckOrderFormPDF.value = null
      console.log('printTruckOrderFormPDF...')
  
      const result = await shipmentPlanRepository.printTruckOrderFormPDFRepo(urlApi, param, whereHouse, accessToke, soeId)
        
      if (result) {
        // console.log('printTruckOrderFormPDF:', result)
        printTruckOrderFormPDFResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.log('Error in printTruckOrderFormPDF:', error)
      errorPrintTruckOrderFormPDF.value = error.message
    }
  }
  
  return {
    printTruckOrderFormPDFResult,
    errorPrintTruckOrderFormPDF,
    printTruckOrderFormPDF,
  }
}


//------------------------------------- COA ---------------------------------
export const useSaveFileFormService = () => {
  const resultSaveFielForm = ref(null) // เก็บข้อมูล response ของการบันทึก
  const errorMessageSaveFileForm = ref(null) // เก็บข้อความแจ้งข้อผิดพลาด

  const functionSaveFileForm = async (files, soEtlLogDetailJournalID, poEtlLogDetailJournalID, form, urlApi, whereHouse, accessToken) => {
    try {
      // ตรวจสอบว่ามีไฟล์และข้อมูลก่อนที่จะดำเนินการบันทึก
      if (!files || files.length === 0) {
        throw new Error('No files selected')
      }

      if (!poEtlLogDetailJournalID || !urlApi || !accessToken) {
        throw new Error('Missing required parameters')
      }

      errorMessageSaveFileForm.value = null

      // console.log('Saving Draft Form COA...')

      // เรียกใช้ Service เพื่อบันทึกข้อมูล
      const result = await FileService.saveDraftFileForm(files, soEtlLogDetailJournalID, poEtlLogDetailJournalID, form, urlApi, whereHouse, accessToken)

      if (result) {
        // console.log('Save data COA Controller:', result)
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

      // console.log('Fetching File Form ...')

      const result = await FileService.fetchFileForm(soEtlLogDetailJournalID, form, type, urlApi, whereHouse, accessToken)
      
      if (result) {
        // console.log('Received File Form:', result)
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
