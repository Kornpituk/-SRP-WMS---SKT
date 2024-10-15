import { coaService } from '@/services/skt/receivingPlan/rawMat/service'


export const useGetCOAFormController = () => {
  const getCoaForm = ref(null)
  const errorMessageGetCoa = ref(null)
  
  const fetchCoaForm = async (poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken) => {
    try {
      errorMessageGetCoa.value = null
      console.log('Fetching Form COA...')
  
      const result = await coaService.GetCOAForm(poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken)
        
      if (result) {
        console.log('data COA Controller:', result)
        getCoaForm.value = result
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in fetchCoaForm:', error)
      errorMessageGetCoa.value = error.message
    }
  }
  
  return {
    getCoaForm,
    errorMessageGetCoa,
    fetchCoaForm,
  }
}

export const useGetCOAFilePackagingFormController = () => {
  const getFileCoa = ref(null)
  const errorMessageFileCoa = ref(null)

  const fetchFileCoaHeader = async (fileName, poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken) => {
    try {
      errorMessageFileCoa.value = null
      console.log('++++Fetching Packaging Form File COA...')

      const result = await coaService.GetFileCOAForm(fileName, poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken)
      
      if (result?.success) {
        console.log('Fetched data file COA Controller:', result)
        getFileCoa.value = { data: result, success: true }
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in getFileCoa:', error)
      errorMessageFileCoa.value = error.message
    }
  }

  return {
    getFileCoa,
    errorMessageFileCoa,
    fetchFileCoaHeader,
  }
}
  
export const useDeleteCoaFormController = () => {
  const resultDeleteByIdCoa = ref(null)
  const errorMessageDeleteCoa = ref(null)

  const deleteCoaForm = async (body, poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken) => {
    try {
      errorMessageDeleteCoa.value = null
      console.log('delete coa form ...')

      const result = await coaService.deleteCoaForm(body, poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken)
      
      if (result?.success) {
        console.log('delete coa Controller success:', result)
        resultDeleteByIdCoa.value = { data: result, success: true } 
      } else {
        console.warn('No data returned from the API')
        throw new Error('Failed to delete by id data')
      }
    } catch (error) {
      console.error('Error in deleteCoaForm:', error)
      errorMessageDeleteCoa.value = error.message
    }
  }

  return {
    resultDeleteByIdCoa,
    errorMessageDeleteCoa,
    deleteCoaForm,
  }
}

export const useDeleteAllCoaFormController = () => {
  const resultDeleteAllCoa = ref(null)
  const errorMessageDeleteAllCoa = ref(null)

  const deleteAllCoaForm = async (poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken) => {
    try {
      errorMessageDeleteAllCoa.value = null
      console.log('delete coa form ...')

      const result = await coaService.deleteAllCoaForm(poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken)
      
      if (result?.success) {
        console.log('delete all coa Controller:', result)
        resultDeleteAllCoa.value = { data: result, success: true }
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in deleteAllCoaForm:', error)
      errorMessageDeleteAllCoa.value = error.message
    }
  }

  return {
    resultDeleteAllCoa,
    errorMessageDeleteAllCoa,
    deleteAllCoaForm,
  }
}
  
export const useSaveCOAFormController = () => {
  const saveCoaForm = ref(null) // เก็บข้อมูล response ของการบันทึก
  const errorMessageSaveCoa = ref(null) // เก็บข้อความแจ้งข้อผิดพลาด
  
  const handleSaveDraftCoaForm = async (files, poEtlLogDetailJournalID,  urlApi, form, whereHouse, accessToken) => {
    try {
      // ตรวจสอบว่ามีไฟล์และข้อมูลก่อนที่จะดำเนินการบันทึก
      if (!files || files.length === 0) {
        throw new Error('No files selected')
      }
  
      if (!poEtlLogDetailJournalID || !urlApi || !accessToken) {
        throw new Error('Missing required parameters')
      }
  
      errorMessageSaveCoa.value = null
      console.log('Saving Draft Form COA...')
  
      // เรียกใช้ Service เพื่อบันทึกข้อมูล
      const result = await coaService.saveDraftCOAForm(files, poEtlLogDetailJournalID,  urlApi, form, whereHouse, accessToken)
  
      if (result?.success) {
        console.log('Save data COA Controller:', result)
        saveCoaForm.value = { data: result, success: true } // เก็บข้อมูล response
      } else {
        throw new Error('Failed to save data')
      }
    } catch (error) {
      console.error('Error in handleSaveDraftCoaForm:', error)

      // saveCoaForm.value = { data: result, success: false }

      // เก็บข้อมูลข้อผิดพลาด
      errorMessageSaveCoa.value = { message: error.message, success: false }
    }
  }
  
  return {
    saveCoaForm,
    errorMessageSaveCoa,
    handleSaveDraftCoaForm, // เปลี่ยนชื่อเป็น handleSaveDraftCoaForm เพื่อให้ชัดเจน
  }
}
  