// ════════════════════════════════════════════════
// Shared utilities — ใช้ร่วมกันทุก service
// ════════════════════════════════════════════════
import axiosIns from '@axios'
import { urlApi } from '@/api'

/** Headers มาตรฐานทุก request */
export const getHeaders = () => ({
  Authorization: sessionStorage.getItem('accessToken') || '',
  'x-location': sessionStorage.getItem('location')    || '',
  
})

/** Mock delay */
export const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

/** Base URL ของ SettingMaster */
export const settingMasterBase = () =>
  `${urlApi.value}/api/v1/SettingMaster`

/**
 * Factory สร้าง CRUD service สำเร็จรูป
 * ใช้แทนการ copy service ทุกไฟล์
 *
 * @param {string}   endpoint   - ชื่อ endpoint เช่น 'forwarder', 'port'
 * @param {object[]} mockData   - ข้อมูล mock
 * @param {boolean}  useMock    - เปิด/ปิด mock (default: true)
 */
export function createCrudService(endpoint, mockData = [], useMock = true) {
  let rows = [...mockData]
  const base = `${settingMasterBase()}/${endpoint}`

  // ── Mock functions ────────────────────────────
  const fetchMock  = async ()             => { await wait(500) 

    return [...rows] }

  const createMock = async payload      => {
    await wait(500)

    const id   = rows.length ? Math.max(...rows.map(r => r.id)) + 1 : 1
    const now  = new Date().toISOString().slice(0, 10)
    const next = { ...payload, id, createdAt: now, updatedAt: now }

    rows = [next, ...rows]
    
    return next
  }

  const updateMock = async (id, payload)  => {
    await wait(500)

    const now = new Date().toISOString().slice(0, 10)

    rows = rows.map(r => r.id === id ? { ...r, ...payload, updatedAt: now } : r)
    
    return rows.find(r => r.id === id)
  }

  const deleteMock = async id           => {
    await wait(500)
    rows = rows.filter(r => r.id !== id)
    
    return { success: true }
  }

  // ── Real API functions ────────────────────────
  const h = () => ({ headers: getHeaders() })

  return {
    getList: async (params = {}) => {
      if (useMock) return fetchMock()
      const r = await axiosIns.get(base, { params, ...h() })
      
      return r.data?.data ?? r.data ?? []
    },
    create: async payload => {
      if (useMock) return createMock(payload)
      const r = await axiosIns.post(base, payload, h())
      
      return r.data
    },
    update: async (id, payload) => {
      if (useMock) return updateMock(id, payload)
      const r = await axiosIns.put(`${base}/${id}`, payload, h())
      
      return r.data
    },
    delete: async id => {
      if (useMock) return deleteMock(id)
      const r = await axiosIns.delete(`${base}/${id}`, h())
      
      return r.data
    },
  }
}
