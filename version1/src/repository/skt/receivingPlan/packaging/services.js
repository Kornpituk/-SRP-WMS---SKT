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
export const  PackagingFormService = {
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

  async generatePackagingIdForm(poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) {
    try {
      const response = await axios.get(`${urlApi}/api/v1/Packaging/View/${poEtlLogDetailJournalID}`, {}, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      if (response && response.data) {
        console.log('Service Response data Genterate View:', response.data.data)
        
        return response.data.data
      } else {
        throw new Error('No data Genterate View from the server')
      }
    } catch (error) {
      console.error('Error in generatePackagingIdForm:', error)
      throw new Error(`Failed to fetch header for ID ${poEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
    }
  },

  async acceptPackagingForm(poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/Accept/${poEtlLogDetailJournalID}`, {}, {
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

    console.log("acceptPackagingForm serviece", poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken)
  },

  async rejectPackagingForm(comment, poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken) {
    const body = {
      statusComments: comment,
    }

    // console.log("rejectPackagingForm serviece", body, poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken)

    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/Reject/${poEtlLogDetailJournalID}`, body, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      if (response && response.data) {
        console.log('Service Response data Reject:', response.data.messageResult)
        
        return { data: response.data.messageResult, success: true }
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
    console.log('get repo Packaging Form Header...')
    try {
      const response = await axios.get(`${urlApi}/api/v1/Packaging/View/${poEtlLogDetailJournalID}`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })

      console.log("response", response)
      
      if (response && response.data) {
        console.log('success get repo Error If Packaging Form Header...')
        console.log('Service Response data Header:', response.data.data)
        
        return response.data.data
      } else {
        console.log('Error repo Error If Packaging Form Header...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try Packaging Form Header...')
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
    actualAnalysis: item.actualAnalysis,
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

  async GetFileCOAPackagingForm(fileName, poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) {
    try {
      const response = await axios.get(`${urlApi}/api/v1/Packaging/getfile?fileName=${fileName}`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      if (response && response.data) {
        console.log('Service Response data file COA:', response.data)
        
        return { success: true, data: response.data }
      } else {
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.error('Error in GetCOAPackagingForm:', error)
      error = new Error(`Failed to file coa for ID ${poEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
      throw { success: false, error }
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

    console.log("Files Upload", files)

    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/SaveCoA/${poEtlLogDetailJournalID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-location': whereHouse,
          'Authorization': `Bearer ${accessToken}`,
        },
      })

      return { success: true, data: response.data }
    } catch (error) {
      throw { success: false, error }
    }
  },

  async deleteCoaForm(body, poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken) {

    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/DeleteCoa/${poEtlLogDetailJournalID}`, body, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      if (response && response.data) {
        console.log('Service Response data detelete coa:', response.data.messageResult)
        
        return { success: true, data: response.data.messageResult }
      } else {
        throw new Error('No data delete coa from the server')
      }
    } catch (error) {
      console.error('Error in deleteCoaForm:', error)
      error = new Error(`Deleted to coa by id for ID ${poEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
      throw { success: false, error }
    }
  },


  async deleteAllCoaForm(poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken) {

    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/DeleteAllCoA/${poEtlLogDetailJournalID}`, {}, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      if (response && response.data) {
        console.log('Service Response data all detelete coa:', response.data.messageResult)
        
        return { success: true, data: response.data.messageResult }
      } else {
        throw new Error('No data delete all coa from the server')
      }
    } catch (error) {
      console.error('Error in deleteAllCoaForm:', error)
      error = new Error(`Deleted to coa all for ID ${poEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
      throw { success: false, error }
    }
  },
}
