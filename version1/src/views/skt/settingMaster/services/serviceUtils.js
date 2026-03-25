// serviceUtils.js
import axiosIns from '@axios'
import { urlApi } from '@/api'

export const getHeaders = () => ({
  Authorization: `Bearer ${sessionStorage.getItem('accessToken') || ''}`,
  'x-location': sessionStorage.getItem('location') || '',
})

const h = () => ({ headers: getHeaders() })

/**
 * @param {Object} config
 * @param {string} config.resourceName - เช่น 'Forwarder'
 * @param {Object} config.map - แผนผังการแปลงชื่อ Field { uiField: 'apiField' }
 */
export function createCrudService({ resourceName, map, useMock = true, mockData = [] }) {
  const baseUrl = `${urlApi.value}/api/Mst${resourceName}`
  
  // หาชื่อ Primary Key จาก map (สมมติว่าเรา map 'id' ไว้เสมอ)
  const apiKey = map.id 

  // --- Helper: แปลง Data จาก API -> UI ---
  const transformFromApi = data => {
    if (!data) return data
    if (Array.isArray(data)) return data.map(transformFromApi)
    
    const transformed = {}
    for (const [uiKey, apiKey] of Object.entries(map)) {
      transformed[uiKey] = data[apiKey]
    }

    // เก็บกวาด field อื่นๆ ที่ไม่ได้ map (ถ้าจำเป็น)
    return { ...data, ...transformed }
  }

  // --- Helper: แปลง Data จาก UI -> API (ตอน Save) ---
  const transformToApi = payload => {
    const apiPayload = { ...payload }
    for (const [uiKey, apiKey] of Object.entries(map)) {
      apiPayload[apiKey] = payload[uiKey]
    }
    
    return apiPayload
  }

  return {
    getList: async () => {
      if (useMock) return transformFromApi(mockData)
      const r = await axiosIns.get(`${baseUrl}/Get${resourceName}Active`, h())
      
      return transformFromApi(r.data)
    },

    save: async payload => {
      const apiPayload = transformToApi(payload)
      if (useMock) return payload
      const r = await axiosIns.post(`${baseUrl}/Save${resourceName}`, apiPayload, h())
      
      return transformFromApi(r.data)
    },

    delete: async id => {
      if (useMock) return { success: true }

      // ส่ง payload { forwarderId: 1 } ตามที่ API ต้องการ
      const r = await axiosIns.post(`${baseUrl}/Delete${resourceName}`, { [apiKey]: id }, h())
      
      return r.data
    },
  }
}
