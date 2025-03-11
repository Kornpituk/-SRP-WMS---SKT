import { coaService } from '@/repository/skt/global/service'

export const useGetCOAFormController = () => {
  const getCoaForm = ref(null)
  const errorMessageGetCoa = ref(null)
  
  const fetchCoaForm = async (poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken) => {
    try {
      errorMessageGetCoa.value = null

      //console.log('Fetching Form COA...')
  
      const result = await gobalService.fetchGenerateView(poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken)
        
      if (result) {
        //console.log('data COA Controller:', result)
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
  
export const useDeleteCoaFormController = () => {
  const packagingFormGenerate = ref(null)
  const errorMessageDeleteCoa = ref(null)

  const deleteCoaForm = async (body, poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken) => {
    try {
      errorMessageDeleteCoa.value = null

      //console.log('delete coa form ...')

      const result = await SaveCOAService.deleteCoaForm(body, poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken)
      
      if (result) {
        //console.log('delete coa Controller:', result)
        packagingFormGenerate.value = result
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in deleteCoaForm:', error)
      errorMessageDeleteCoa.value = error.message
    }
  }

  return {
    packagingFormGenerate,
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

      //console.log('delete coa form ...')

      const result = await SaveCOAService.deleteAllCoaForm(poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken)
      
      if (result) {
        //console.log('delete all coa Controller:', result)
        resultDeleteAllCoa.value = result
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

      //console.log('Saving Draft Form COA...')
  
      // เรียกใช้ Service เพื่อบันทึกข้อมูล
      const result = await coaService.saveDraftCOAForm(files, poEtlLogDetailJournalID,  urlApi, form, whereHouse, accessToken)
  
      if (result?.success) {
        //console.log('Save data COA Controller:', result)
        saveCoaForm.value = { data: result, success: true } // เก็บข้อมูล response
      } else {
        throw new Error('Failed to save data')
      }
    } catch (error) {
      console.error('Error in handleSaveDraftCoaForm:', error)
  
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
  