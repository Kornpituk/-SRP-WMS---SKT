// serviceUtils.js
import axiosIns from '@axios'
import { urlApi } from '@/api'

export const getHeaders = () => ({
  Authorization: `Bearer ${sessionStorage.getItem('accessToken') || ''}`,
  'x-location': sessionStorage.getItem('location') || '',
})

const h = () => ({ headers: getHeaders() })

export function createCrudService({
  resourceName, // เช่น 'Forwarder', 'Port'
  idField,      // เช่น 'forwarderId', 'portId'
  mockData = [],
  useMock = true,
}) {
  let rows = [...mockData]

  // Base URL สำหรับ SKT API ที่มักจะขึ้นต้นด้วย Mst
  const baseUrl = `${urlApi.value}/api/Mst${resourceName}`

  return {
    // 1. ดึงข้อมูลทั้งหมด
    getList: async () => {
      if (useMock) return rows
      const r = await axiosIns.get(`${baseUrl}/Get${resourceName}Active`, h())
      
      return r.data
    },

    // 2. ดึงข้อมูลตัวเดียว (ถ้าต้องใช้)
    getById: async id => {
      if (useMock) return rows.find(r => r[idField] === id)
      const r = await axiosIns.get(`${baseUrl}/Get${resourceName}ById/${id}`, h())
      
      return r.data
    },

    // 3. บันทึก (ทั้ง Create และ Update มักใช้ Save ตัวเดียวกันใน .NET)
    save: async payload => {
      if (useMock) {
        // Mock logic สำหรับการจำลอง Save
        return payload
      }
      const r = await axiosIns.post(`${baseUrl}/Save${resourceName}`, payload, h())
      
      return r.data
    },

    // 4. ลบ (ใช้ POST ตามที่ API กำหนด)
    delete: async id => {
      if (useMock) {
        rows = rows.filter(r => r[idField] !== id)
        
        return { success: true }
      }

      // ส่ง payload { forwarderId: id } ตาม spec
      const payload = { [idField]: id }
      const r = await axiosIns.post(`${baseUrl}/Delete${resourceName}`, payload, h())
      
      return r.data
    },

    // 5. แถม: Validate (เฉพาะทาง)
    validate: async payload => {
      if (useMock) return { valid: true }
      const r = await axiosIns.post(`${baseUrl}/Validate${resourceName}`, payload, h())
      
      return r.data
    },
  }
}
