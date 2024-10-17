import { uploadFiles, fetchMockData, saveMockDataToAPI, parseData  } from '@/repository/skt/receivingPlan/packaging/services'

import { FileModel, dataHeaderModel } from '@/model/skt/receivingPlan/packaging/model'

export const handleFilesOMvc = async files => {
  try {
    // Convert files to FileModel
    const fileModels = files.map(file => new FileModel(file.name, URL.createObjectURL(file), FileModel.formatFileSize(file.size), file.type))

    // ส่งไปยัง service เพื่ออัปโหลดไฟล์
    const uploadedPaths = await uploadFiles(files)

    console.log('Files uploaded successfully:', uploadedPaths)

    // คุณสามารถทำการอัปเดต state หรือลอจิกอื่น ๆ ที่นี่
    return uploadedPaths
  } catch (error) {
    console.error('Error handling files:', error)
  }
}

//--------------------- Header --------------------------------

export const getMockData = () => {
  return fetchMockData() // เรียกใช้ Service เพื่อนำข้อมูลจำลองมาใช้งาน
}

export const saveMockData = data => {
  console.log('!![ MVC ]!! Saving Data:', data) // แสดงข้อมูลใน console
  // ในอนาคตสามารถใช้ saveMockDataToAPI เพื่อส่งข้อมูลไปยัง API ได้
}

export const saveMockHeaderData = data => {
  console.log('!![ MVC ]!! Saving Data:', data) // แสดงข้อมูลใน console
  // ในอนาคตสามารถใช้ saveMockDataToAPI เพื่อส่งข้อมูลไปยัง API ได้
}

//------------------ Lot --------------------------------
import { useRoute } from 'vue-router'

//------------------- Get --------------------------------
// ฟังก์ชันจัดการข้อมูลจาก route
export const getRouteData = () => {
  const route = useRoute()
  
  return JSON.parse(route.query.Data || '[]')
}

// ฟังก์ชันจัดการข้อมูลจาก props
export const getPropsData = propsData => {
  return parseData(propsData)
}

//------------------- Post --------------------------------
// controller/dataController.js
import { createPayload } from '@/model/skt/receivingPlan/packaging/lotDataModel'

export function submitData(data) {
  const payload = createPayload(data)

  console.log(payload) // แสดงข้อมูลใน console

  // ที่นี่คุณสามารถส่ง payload ไปยัง API ได้
  // Example: return this.$http.post('your-api-endpoint', payload);
}

// receivingModel.js
export const ReceivingModel = {
  getReceivingData(poEtlLogDetailJournalID) {
    return axios.get(`/api/v1/ReceivingPlan/GetByPoEtlLogDetailJournalID/${poEtlLogDetailJournalID}`)
  },
}

export const controllerDeleteAllCIA = {
  deleteAllCIA () {
    coaFiles.value = []
    files.value = []
  },
}

//--------------------------------------------------------------------- Real --------------------
import { ReceivingFormService, 
  GetLotPackagingFormService, 
  GetCOAService, PackagingFormService, 
  saveDraftPackagingFormHeader, saveDraftLotItemsBatch,
  SaveCOAService,
} from '@/repository/skt/receivingPlan/packaging/services'

//----- Generate ----------------------------
export const useGeneratePackagingFormController = () => {
  const packagingFormGenerate = ref(null)
  const errorMessageGenerate = ref(null)

  const fetchPackagingFormGenerate = async (poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) => {
    try {
      errorMessageGenerate.value = null
      console.log('Fetching Packaging Form Header...')

      const result = await PackagingFormService.generatePackagingForm(poEtlLogDetailJournalID, urlApi, whereHouse, accessToken)
      
      if (result) {
        console.log('Packaging data Generate Controller:', result)
        packagingFormGenerate.value = result
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in fetchPackagingFormGenerate:', error)
      errorMessageGenerate.value = error.message
    }
  }

  return {
    packagingFormGenerate,
    errorMessageGenerate,
    fetchPackagingFormGenerate,
  }
}

export const useGeneratePackagingViewFormController = () => {
  const packagingFormGenerateView = ref(null)
  const errorMessageGenerateView = ref(null)

  const fetchPackagingViewFormGenerate = async (poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) => {
    try {
      errorMessageGenerateView.value = null
      console.log('Fetching Packaging Form Generate view...')

      const result = await PackagingFormService.generatePackagingIdForm(poEtlLogDetailJournalID, urlApi, whereHouse, accessToken)
      
      if (result) {
        console.log('Packaging data Generate view Controller:', result)
        
        packagingFormGenerateView.value = result

        return { success: true, data: result }
      } else {
        console.warn('No data returned from the API')

        return { success: false, error: 'No data returned from the API /Packaging/View.' }
      }
    } catch (error) {
      console.error('Error in fetchPackagingViewFormGenerate:', error)
      errorMessageGenerateView.value = error.message

      return { success: false, error: error.message }
    }
  }

  return {
    packagingFormGenerateView,
    errorMessageGenerateView,
    fetchPackagingViewFormGenerate,
  }
}

export const useAcceptPackagingFormController = () => {
  const packagingFormAccept = ref(null)
  const errorMessageAccept = ref(null)

  const acceptPackagingForm = async (poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken) => {
    try {
      errorMessageAccept.value = null
      console.log('accept Packaging Form...')

      const result = await PackagingFormService.acceptPackagingForm(poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken)
      
      if (result) {
        console.log('Packaging data Accept Controller:', result)
        packagingFormAccept.value = result
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in acceptPackagingForm:', error)
      errorMessageAccept.value = error.message
    }
  }

  return {
    packagingFormAccept,
    errorMessageAccept,
    acceptPackagingForm,
  }
}

import { createModelReject, createDraftBody } from '@/model/skt/receivingPlan/packaging/headerModel'

export const useRejectPackagingFormController = () => {
  const packagingFormReject = ref(null)
  const errorMessageReject = ref(null)

  const rejectPackagingForm = async (comment, poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken) => {
    try {
      errorMessageReject.value = null
      console.log('Reject Packaging Form...')

      // const comment = createModelReject(dataHeader)


      const result = await PackagingFormService.rejectPackagingForm(comment, poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken)
      
      if (result) {
        console.log('Packaging data Reject Controller:', result)
        packagingFormReject.value = result
        
        return { success: true, data: result }
      } else {
        console.warn('No data returned from the API')
        console.error('Failed to Reject:', result)
        
        return { success: false, error: 'Failed to Reject.' }
      }
    } catch (error) {
      console.error('Error in rejectPackagingForm:', error)
      errorMessageReject.value = error.message
      
      return { success: false, error: error.message }
    }
  }

  return {
    packagingFormReject,
    errorMessageReject,
    rejectPackagingForm,
  }
}


//--- header --------------------------------
export const useReceivingFormController = () => {
  const packagingFormHeader = ref(null)
  const errorMessage = ref(null)

  const fetchPackagingFormHeader = async (poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) => {
    try {
      errorMessage.value = null
      console.log('Fetching Packaging Form Header...')

      const result = await ReceivingFormService.getHearderPackagingForm(poEtlLogDetailJournalID, urlApi, whereHouse, accessToken)
      
      if (result) {
        console.log('Received data Header Controller:', result)
        packagingFormHeader.value = result
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in fetchPackagingFormHeader:', error)
      errorMessage.value = error.message
    }
  }

  return {
    packagingFormHeader,
    errorMessage,
    fetchPackagingFormHeader,
  }
}

export const handleSaveDraft = async (poEtlLogDetailJournalID, dataHeader, urlApi,
  whereHouse, accessTokenAtStore,
) => {
  try {
    // ตรวจสอบค่าว่างใน dataHeader
    // if (
    //   !dataHeader.limConditionDetail ||
    //   !dataHeader.coAChecked ||
    //   !dataHeader.note ||
    //   !dataHeader.limConditionDetail
    // ) {
    //   return { success: false, error: 'Required fields are missing.'+poEtlLogDetailJournalID, dataHeader, urlApi,
    //     whereHouse, accessTokenAtStore }
    // }

    // แสดงผลข้อมูลก่อนส่งเพื่อช่วยในการ debug
    

    // สร้างข้อมูล body สำหรับการบันทึก
    const body = createDraftBody(dataHeader)

    // เรียกใช้ฟังก์ชันบันทึกและรอผลลัพธ์
    const result = await saveDraftPackagingFormHeader(
      poEtlLogDetailJournalID,
      body,
      urlApi,
      whereHouse,
      accessTokenAtStore,
    )

    // ตรวจสอบผลลัพธ์การบันทึก
    if (result?.success) {
      console.log('Draft saved successfully:', result)
      
      return { success: true, data: result }
    } else {
      console.error('Failed to save draft:', result)
      
      return { success: false, error: 'Failed to save draft.' }
    }
  } catch (error) {
    // จัดการข้อผิดพลาด
    console.error('Error occurred while saving draft:', error)
    
    return { success: false, error: error.message }
  }
}

//--- lot --------------------------------
export const useGetLotPackagingFormController = () => {
  const packagingFormLot = ref(null)
  const errorMessageLot = ref(null)

  const fetchPackagingFormLot = async (poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) => {
    try {
      errorMessageLot.value = null
      console.log('Fetching Packaging Form Header...')

      const result = await GetLotPackagingFormService.GetHearderPackagingForm(poEtlLogDetailJournalID, urlApi, whereHouse, accessToken)
      
      if (result) {
        console.log('Received data Lot Controller:', result)
        packagingFormLot.value = result
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in fetchPackagingFormLot:', error)
      errorMessageLot.value = error.message
    }
  }

  return {
    packagingFormLot,
    errorMessageLot,
    fetchPackagingFormLot,
  }
}

import { createDraftLot, createLotItem  } from '@/model/skt/receivingPlan/packaging/lotDataModel'

export const handleSaveDraftLot = async (dataLot, urlApi, whereHouse, accessTokenAtStore) => {
  try {
    // ตรวจสอบว่า dataLot มีข้อมูลที่ต้องการหรือไม่
    if (!dataLot || dataLot.length === 0) {
      throw new Error('No data provided for saving draft lot')
    }

    // สร้าง body ข้อมูลสำหรับส่งไปยัง API
    const body = createDraftLot(dataLot)

    // เก็บผลลัพธ์สำหรับแต่ละ item
    const results = []
    let allSuccess = true

    for (const item of dataLot) {
      // เรียกใช้ service เพื่อส่งข้อมูลทีละตัว
      const result = await saveDraftLotItemsBatch(item, urlApi, whereHouse, accessTokenAtStore)

      // เก็บผลลัพธ์สำหรับแต่ละ item
      results.push(result)

      // ตรวจสอบว่ามีการบันทึกสำเร็จหรือไม่
      if (!result?.success) {
        allSuccess = false // ถ้าส่งไม่สำเร็จ แสดงว่าไม่สมบูรณ์
      }
    }

    // ตรวจสอบผลลัพธ์
    if (allSuccess) {
      return { success: true, data: results }
    } else {
      throw new Error('Failed to save one or more draft lots')
    }
  } catch (error) {
    console.error('Error in handleSaveDraftLot:', error.message)

    return { success: false, error: error.message }
  }
}

//--- COA --------------------------------
export const useGetCOAPackagingFormController = () => {
  const getFormCoa = ref(null)
  const errorMessageCoaHeader = ref(null)

  const fetchFormCoaHeader = async (poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) => {
    try {
      errorMessageCoaHeader.value = null
      console.log('Fetching Packaging Form COA...')

      const result = await GetCOAService.GetCOAPackagingForm(poEtlLogDetailJournalID, urlApi, whereHouse, accessToken)
      
      if (result) {
        console.log('Received data COA Controller:', result)
        getFormCoa.value = result
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in getFormCoa:', error)
      errorMessageCoaHeader.value = error.message
    }
  }

  return {
    getFormCoa,
    errorMessageCoaHeader,
    fetchFormCoaHeader,
  }
}

export const useGetCOAFilePackagingFormController = () => {
  const getFileCoa = ref(null)
  const errorMessageFileCoa = ref(null)

  const fetchFileCoaHeader = async (fileName, poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) => {
    try {
      errorMessageFileCoa.value = null
      console.log('++++Fetching Packaging Form File COA...')

      const result = await GetCOAService.GetFileCOAPackagingForm(fileName, poEtlLogDetailJournalID, urlApi, whereHouse, accessToken)
      
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

      const result = await SaveCOAService.deleteCoaForm(body, poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken)
      
      if (result?.success) {
        console.log('delete coa Controller:', result)
        resultDeleteByIdCoa.value = { data: result, success: true }
      } else {
        console.warn('No data returned from the API')
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

      const result = await SaveCOAService.deleteAllCoaForm(poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken)
      
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

  const handleSaveDraftCoaForm = async (files, poEtlLogDetailJournalID, form, urlApi, whereHouse, accessToken) => {
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
      const result = await SaveCOAService.saveDraftCOAForm(files, poEtlLogDetailJournalID, form, urlApi, whereHouse, accessToken)

      if (result?.success) {
        console.log('Save data COA Controller:', result)
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
