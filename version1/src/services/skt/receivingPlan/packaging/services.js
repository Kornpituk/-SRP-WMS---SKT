import axios from '@axios'

export const uploadFiles = async files => {
  const formData = new FormData()
  
  files.forEach(file => {
    formData.append('files', file)
  })

  try {
    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    console.error('Error uploading files:', error)
    throw error
  }
}

// services/mockDataService.js
import { mockData } from '@/model/skt/receivingPlan/packaging/model'

//----------------- Header --------------------------------
export const fetchMockData = () => {
  return mockData.value // ส่งข้อมูลจำลองกลับไป
}

// services/apiService.js API Service (ในอนาคต): สำหรับส่งข้อมูลไปยัง API (ตอนนี้ยังไม่ใช้งาน)
export const saveMockDataToAPI = async data => {
  try {
    // ใส่ API URL ของคุณตรงนี้
    const response = await fetch('https://your-api-url.com/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    console.log('API Response:', result)
  } catch (error) {
    console.error('API Error:', error)
  }
}


//-------------- Lot --------------------------------
// services/dataService.js
// ฟังก์ชันที่ใช้จัดการข้อมูล (ถ้ามีการแปลงข้อมูลเพิ่มเติม สามารถเพิ่มในนี้)
export const parseData = data => {
  // คุณสามารถเพิ่มการจัดการข้อมูลเพิ่มเติมที่นี่ เช่น แปลงรูปแบบข้อมูล
  return data || []
}
