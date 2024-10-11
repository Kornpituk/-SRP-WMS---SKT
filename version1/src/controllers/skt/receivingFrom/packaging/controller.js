import { uploadFiles, fetchMockData, saveMockDataToAPI, parseData  } from '@/services/skt/receivingPlan/packaging/services'

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
  saveDraftPackagingFormHeader, saveDraftLotItemsBatch  } from '@/services/skt/receivingPlan/packaging/services'

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

export const useAcceptPackagingFormController = () => {
  const packagingFormAccept = ref(null)
  const errorMessageAccept = ref(null)

  const acceptPackagingForm = async (poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) => {
    try {
      errorMessageAccept.value = null
      console.log('accept Packaging Form...')

      const result = await PackagingFormService.acceptPackagingForm(poEtlLogDetailJournalID, urlApi, whereHouse, accessToken)
      
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

  const rejectPackagingForm = async (poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) => {
    try {
      errorMessageReject.value = null
      console.log('Reject Packaging Form...')

      const comment = createModelReject(dataHeader)


      const result = await PackagingFormService.rejectPackagingForm(comment, poEtlLogDetailJournalID, urlApi, whereHouse, accessToken)
      
      if (result) {
        console.log('Packaging data Reject Controller:', result)
        packagingFormReject.value = result
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in rejectPackagingForm:', error)
      errorMessageReject.value = error.message
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

export const handleSaveDraft = async (poEtlLogDetailJournalID, dataHeader, urlApi, whereHouse, accessTokenAtStore) => {
  // ตรวจสอบค่าว่างใน dataHeader
  if (!dataHeader.limConditionDetail || !dataHeader.coAChecked || !dataHeader.note || !dataHeader.limConditionDetail) {
    return { success: false, error: 'Required fields are missing.' }
  }

  const body = createDraftBody(dataHeader)
  
  return await saveDraftPackagingFormHeader(poEtlLogDetailJournalID, body, urlApi, whereHouse, accessTokenAtStore)
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

// export const handleSaveDraftLot = async (dataLot, urlApi, whereHouse, accessTokenAtStore) => {
//   const body = createDraftLot(dataLot)
  
//   return await saveDraftPackagingFormHeader(body, urlApi, whereHouse, accessTokenAtStore)
// }

export const handleSaveDraftLot = async (dataLot, urlApi, whereHouse, accessTokenAtStore) => {
  try {
    // วนลูปผ่านรายการข้อมูลใน dataLot
    for (const item of dataLot) {
      // เรียกใช้ service เพื่อส่งข้อมูลทีละตัว
      const result = await saveDraftLotItemsBatch(item, urlApi, whereHouse, accessTokenAtStore)

      console.log('Success:', result) // แสดงผลลัพธ์ที่ได้
      
      return result
    }

    // แสดง dialog เมื่อสำเร็จ
    // isDialogSubmitSuccessVisible.value = true
  } catch (error) {
    // แสดง dialog เมื่อมีข้อผิดพลาด
    // isDialogSubmitFailedVisible.value = true
    console.error('Error saving draft lot:', error)
  }
}





//--- COA --------------------------------
export const useGetCOAPackagingFormController = () => {
  const packagingFormCoaHeader = ref(null)
  const errorMessageCoaHeader = ref(null)

  const fetchPackagingFormCoaHeader = async (poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) => {
    try {
      errorMessageCoaHeader.value = null
      console.log('Fetching Packaging Form COA...')

      const result = await GetCOAService.GetCOAPackagingForm(poEtlLogDetailJournalID, urlApi, whereHouse, accessToken)
      
      if (result) {
        console.log('Received data COA Controller:', result)
        packagingFormCoaHeader.value = result
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in fetchPackagingFormCoaHeader:', error)
      errorMessageCoaHeader.value = error.message
    }
  }

  return {
    packagingFormCoaHeader,
    errorMessageCoaHeader,
    fetchPackagingFormCoaHeader,
  }
}
