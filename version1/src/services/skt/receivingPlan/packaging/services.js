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

//----------------------------------------------- Real -------------------------------- -
//----------- Genter ----------------------------
export const PackagingFormService = {
  async generatePackagingForm(poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/Packaging/Generate/${poEtlLogDetailJournalID}`, {}, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      if (response && response.data) {
        console.log('Service Response data Genterate:', response.data.data)
        
        return response.data.data
      } else {
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.error('Error in generatePackagingForm:', error)
      throw new Error(`Failed to fetch header for ID ${poEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
    }
  },

  async acceptPackagingForm(poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/Packaging/Accept/${poEtlLogDetailJournalID}`, {}, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      if (response && response.data) {
        console.log('Service Response data Genterate:', response.data.data)
        
        return response.data.data
      } else {
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.error('Error in generatePackagingForm:', error)
      throw new Error(`Failed to fetch header for ID ${poEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
    }
  },

  async rejectPackagingForm(comment, poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/Packaging/Reject/${poEtlLogDetailJournalID}`, comment, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      if (response && response.data) {
        console.log('Service Response data Reject:', response.data.data)
        
        return response.data.data
      } else {
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.error('Error in rejectPackagingForm:', error)
      throw new Error(`Failed to reject for ID ${poEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
    }
  },
}

//----------- Accept ----------------------------
//----------- Reject ----------------------------
//-- Header --------------------------------
export const ReceivingFormService = {
  async getHearderPackagingForm(poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) {
    try {
      const response = await axios.get(`${urlApi}/api/v1/Packaging/View/${poEtlLogDetailJournalID}`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      if (response && response.data) {
        console.log('Service Response data Header:', response.data.data)
        
        return response.data.data
      } else {
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.error('Error in getHearderPackagingForm:', error)
      throw new Error(`Failed to fetch header for ID ${poEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
    }
  },
}

export const saveDraftPackagingFormHeader = async (poEtlLogDetailJournalID, body, urlApi, whereHouse, accessTokenAtStore) => {
  try {
    const response = await axios.post(`${urlApi}/api/v1/Packaging/Save/${poEtlLogDetailJournalID}`, body, {
      headers: {
        'accept': '*/*',
        'x-location': whereHouse,
        'Authorization': `Bearer ${accessTokenAtStore}`,
      },
    })

    
    return { success: true, data: response.data }
  } catch (error) {
    const errorMsg = error.response ? error.response.data : 'Network or server error'

    console.error('Error:', error)

    return { success: false, error }
  }
}

//-- Lot --------------------------------

export const GetLotPackagingFormService = {
  async GetHearderPackagingForm(poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) {
    try {
      const response = await axios.get(`${urlApi}/api/v1/Packaging/Analyticalltems/${poEtlLogDetailJournalID}`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      if (response && response.data) {
        console.log('Service Response data Lot:', response.data.data)
        
        return response.data.data
      } else {
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.error('Error in getHearderPackagingForm:', error)
      throw new Error(`Failed to fetch header for ID ${poEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
    }
  },
}

const saveSingleLotDetail = async (item, url, warehouse, token) => {
  try {
    const response = await axiosIns.post(`${url}/api/v1/Packaging/SaveLotDetails`, item, {
      headers: {
        'accept': '*/*',
        'x-location': `${warehouse}`,
        'Authorization': `Bearer ${token}`,
      },
    })

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('Error in saveSingleLotDetail:', error)
    
    return {
      success: false,
      error: error,
    }
  }
}

// export const saveDraftLotItemsBatch = async (items, urlApi, whereHouse, accessTokenAtStore) => {
//   try {
//     const body = items.map(item => ({
//       inspReqLotJournalId: item.pkgInspReqFormAnalyticalItemsJournalId,
//       actualAnalysis: item.sqnText,
//       okState: 0,
//     }))

//     const response = await axios.post(`${urlApi}/api/v1/Packaging/SaveLotDetails`, body, {
//       headers: {
//         'accept': '*/*',
//         'x-location': whereHouse,
//         Authorization: `Bearer ${accessTokenAtStore}`,
//       },
//     })

//     return { success: true, data: response.data }
//   } catch (error) {
//     console.error('Error:', error)
    
//     return { success: false }
//   }
// }

export const saveDraftLotItemsBatch = async (item, urlApi, whereHouse, accessTokenAtStore) => {
  const body = {
    inspReqLotJournalId: item.pkgInspReqFormAnalyticalItemsJournalId,
    actualAnalysis: item.sqnText,
    okState: 0,

    // อื่นๆ
  }

  try {
    const response = await axios.post(`${urlApi}/api/v1/Packaging/SaveLotDetails`, body, {
      headers: {
        'accept': '*/*',
        'x-location': whereHouse,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
    })

    
    return { success: true, data: response.data } // ส่งข้อมูลกลับไป
  } catch (error) {
    console.error('Error sending draft lot item:', error)
    throw { success: false, error }
  }
}

//-- COA --------------------------------

export const GetCOAService = {
  async GetCOAPackagingForm(poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) {
    try {
      const response = await axios.get(`${urlApi}/api/v1/Packaging/GetCoa/${poEtlLogDetailJournalID}`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      if (response && response.data) {
        console.log('Service Response data COA:', response.data.data)
        
        return response.data.data
      } else {
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.error('Error in GetCOAPackagingForm:', error)
      throw new Error(`Failed to fetch header for ID ${poEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
    }
  },
}

export const SaveCOAService = {
  async saveDraftCOAForm(files, poEtlLogDetailJournalID, form, urlApi, whereHouse, accessToken) {
    const formData = new FormData()

    // Loop ผ่านไฟล์ที่ต้องการอัปโหลด
    files.forEach(file => {
      formData.append('files', file)
    })

    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/SaveCoA/${poEtlLogDetailJournalID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-location': whereHouse,
          'Authorization': `Bearer ${accessToken}`,
        },
      })

      return response.data
    } catch (error) {
      throw new Error(`Error while saving COA: ${error.message}`)
    }
  },

  async deleteCoaForm(poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken) {

    const body = 0

    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/DeleteCoa/${poEtlLogDetailJournalID}`, body, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      if (response && response.data) {
        console.log('Service Response data detelete coa:', response.data.data)
        
        return response.data.data
      } else {
        throw new Error('No data delete coa from the server')
      }
    } catch (error) {
      console.error('Error in deleteCoaForm:', error)
      throw new Error(`Failed to delete coa for ID ${poEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
    }
  },
}
