import { checkSheetShipmentPlanRepository, FileShippingCheckSheetFileService,
} from '@/repository/skt/shipmentPlan/respository'

//----------------------- Get ----------------------
export const useGetShippingCheckSheetService = () => {
  const getShippingCheckSheetResult = ref(null)
  const errorGetShippingCheckSheet = ref(null)
    
  const fetchShippingCheckSheet = async (urlApi, form, whereHouse, accessToke, SoEId) => {
    try {
      errorGetShippingCheckSheet.value = null
  
      // //console.log('Fetching fetchShippingCheckSheet...')
    
      const result = await checkSheetShipmentPlanRepository.getShippingCheckSheet(urlApi, form, whereHouse, accessToke, SoEId)
          
      if (result) {
        // //console.log('Fetching data fetchShippingCheckSheet:', result)
        getShippingCheckSheetResult.value = result.data
          
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      //console.log('Error in fetchShippingCheckSheet:', error)
      errorGetShippingCheckSheet.value = error.message
    }
  }
    
  return {
    getShippingCheckSheetResult,
    errorGetShippingCheckSheet,
    fetchShippingCheckSheet,
  }
}

export const useGetShippingCheckSheetFileIconService = () => {
  const getShippingCheckSheetFileResult = ref(null)
  const errorGetShippingCheckSheetFile = ref(null)
    
  const fetchShippingCheckSheetFile = async (
    urlApi, form, whereHouse, accessToke,  
    userCode, itemCode, fileName, licensePlate) => {
    try {
      errorGetShippingCheckSheetFile.value = null
    
      const result = await checkSheetShipmentPlanRepository.getShippingCheckSheetFile(
        urlApi, form, whereHouse, accessToke,  userCode, itemCode, fileName, licensePlate)
          
      if (result) {
        getShippingCheckSheetFileResult.value = result.data
          
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      //console.log('Error in fetchShippingCheckSheetFile:', error)
      errorGetShippingCheckSheetFile.value = error.message
    }
  }
    
  return {
    getShippingCheckSheetFileResult,
    errorGetShippingCheckSheetFile,
    fetchShippingCheckSheetFile,
  }
}

export const useGetShippingChecksheetImageService = () => {
  const getShippingChecksheetImageResult = ref(null)
  const errorGetShippingChecksheetImage = ref(null)
    
  const fetchShippingChecksheetImage = async (urlApi, form, whereHouse, accessToken, ItemCode, fileName  ) => {
    try {
      errorGetShippingChecksheetImage.value = null
  
      // //console.log('Fetching fetchShippingChecksheetImage...')
    
      const result = await checkSheetShipmentPlanRepository.getShippingChecksheetImage(urlApi, form, whereHouse, accessToken, ItemCode, fileName  )
          
      if (result) {
        // //console.log('Fetching data fetchShippingChecksheetImage:', result)
        getShippingChecksheetImageResult.value = result.data
          
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      //console.log('Error in fetchShippingChecksheetImage:', error)
      errorGetShippingChecksheetImage.value = error.message
    }
  }
    
  return {
    getShippingChecksheetImageResult,
    errorGetShippingChecksheetImage,
    fetchShippingChecksheetImage,
  }
}

export const useGetShippingSpecialConditionIconService = () => {
  const getShippingSpecialConditionIconResult = ref(null)
  const errorGetShippingSpecialConditionIcon = ref(null)
    
  const fetchShippingSpecialConditionIcon = async (urlApi, form, whereHouse, accessToken, ItemCode, fileName ) => {
    try {
      errorGetShippingSpecialConditionIcon.value = null
  
      // //console.log('Fetching fetchShippingSpecialConditionIcon...')
    
      const result = await checkSheetShipmentPlanRepository.
        getShippingSpecialConditionIcon(urlApi, form, whereHouse, 
          accessToken, ItemCode, fileName  )
          
      if (result) {
        // //console.log('Fetching data fetchShippingSpecialConditionIcon:', result)
        getShippingSpecialConditionIconResult.value = result.data
          
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      //console.log('Error in fetchShippingSpecialConditionIcon:', error)
      errorGetShippingSpecialConditionIcon.value = error.message
    }
  }
    
  return {
    getShippingSpecialConditionIconResult,
    errorGetShippingSpecialConditionIcon,
    fetchShippingSpecialConditionIcon,
  }
}

//----------------------- Post ----------------------
export const useGenerateFormService = () => {
  const generateFormResult = ref(null)
  const generateFormError = ref(null)
  
  const generateFormFunction = async (urlApi, form, whereHouse, accessToke, soeId) => {
    try {
      generateFormError.value = null

      //console.log('generateFormFunction...')
  
      const result = await checkSheetShipmentPlanRepository.generateForm(urlApi, form, whereHouse, accessToke, soeId)
        
      if (result) {
        // //console.log('generateFormFunction:', result)
        generateFormResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      //console.log('Error in generateFormFunction:', error)
      generateFormError.value = error.message
    }
  }
  
  return {
    generateFormResult,
    generateFormError,
    generateFormFunction,
  }
}

export const useShippingCheckSheetService = () => {
  const saveShippingCheckSheetResult = ref(null)
  const errorSaveShippingCheckSheet = ref(null)
  
  const saveShippingCheckSheet = async (urlApi, form, whereHouse, accessToke, body) => {
    try {
      errorSaveShippingCheckSheet.value = null

      //console.log('Fetching saveShippingCheckSheet...')
  
      const result = await checkSheetShipmentPlanRepository.saveShippingCheckSheet(urlApi, form, whereHouse, accessToke, body)
        
      if (result) {
        // //console.log('Fetching data saveShippingCheckSheet:', result)
        saveShippingCheckSheetResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      //console.log('Error in saveShippingCheckSheet:', error)
      errorSaveShippingCheckSheet.value = error.message
    }
  }
  
  return {
    saveShippingCheckSheetResult,
    errorSaveShippingCheckSheet,
    saveShippingCheckSheet,
  }
}

export const useSubmitCheckSheetService = () => {
  const submitCheckSheetResult = ref(null)
  const submitCheckSheetError = ref(null)
  
  const submitCheckSheetFunction = async (urlApi, form, whereHouse, accessToke, soeId) => {
    try {
      submitCheckSheetError.value = null

      //console.log('submitCheckSheetFunctio...')
  
      const result = await checkSheetShipmentPlanRepository.submitCheckSheet(urlApi, form, whereHouse, accessToke, soeId)
        
      if (result) {
        // //console.log('submitCheckSheetFunctio:', result)
        submitCheckSheetResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      //console.log('Error in submitCheckSheetFunctio:', error)
      submitCheckSheetError.value = error.message
    }
  }
  
  return {
    submitCheckSheetResult,
    submitCheckSheetError,
    submitCheckSheetFunction,
  }
}

//----------------------- File ----------------------
export const useShippingCheckSheetFileFormService = () => {
  const resultSaveFielForm = ref(null) // เก็บข้อมูล response ของการบันทึก
  const errorMessageSaveFileForm = ref(null) // เก็บข้อความแจ้งข้อผิดพลาด

  const functionSaveFileForm = async (files, soEtlLogDetailJournalID, licensePlate, form, 
    urlApi, whereHouse, accessToken) => {
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

      // //console.log('Saving Draft Form COA...')

      // เรียกใช้ Service เพื่อบันทึกข้อมูล
      const result = await FileShippingCheckSheetFileService.saveShippingCheckSheetFileForm(files, soEtlLogDetailJournalID, licensePlate, form, urlApi, whereHouse, accessToken)

      if (result) {
        // //console.log('Save data COA Controller:', result)
        resultSaveFielForm.value = { data: result, success: true } // เก็บข้อมูล response
        
        return result
      } else {
        throw new Error('Failed to save data', accessToken)
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

  const getFileFormFunction = async (soEtlLogDetailJournalID, LicensePlate, form, type, urlApi, whereHouse, accessToken) => {
    try {
      errorMessageGetFileForm.value = null

      // //console.log('Fetching File Form ...')

      const result = await FileShippingCheckSheetFileService
        .fetchShippingCheckSheetFileForm(soEtlLogDetailJournalID, LicensePlate, form, type, urlApi, whereHouse, accessToken)
      
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

  const deleteFileFormFunction = async (soEtlLogDetailJournalID, licensePlate, fileName, type, form, urlApi, whereHouse, accessToken) => {
    try {
      errorMessageDeleteFileForm.value = null

      // //console.log('Fetching File Form ...')

      const result = await FileShippingCheckSheetFileService.deleteFileForm(soEtlLogDetailJournalID, licensePlate, fileName, type, form, urlApi, whereHouse, accessToken)
      
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

//-------------------- PDF  ---------------------------------
export const usePrintPDFService = () => {
  const printPDFResult = ref(null)
  const printPDFErrorMessage = ref(null)

  const printPDFService = async (urlApi, form, type, whereHouse, accessToken, params = {}) => {
   
    try {
      printPDFErrorMessage.value = null
  
      const result = await checkSheetShipmentPlanRepository.printPDF(urlApi, form, type, whereHouse, accessToken, params)
        
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
