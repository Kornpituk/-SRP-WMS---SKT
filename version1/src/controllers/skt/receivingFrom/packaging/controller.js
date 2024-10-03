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
