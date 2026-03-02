import axiosIns from '@axios'
import { urlApi } from '@/api'

const USE_MOCK = true
const MOCK_DELAY = 500

const getHeaders = () => ({
  Authorization: sessionStorage.getItem('accessToken') || '',
  'x-location': sessionStorage.getItem('location') || '',
})

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

const maybeThrowMockError = () => {
  const shouldThrow = false
  if (shouldThrow)
    throw new Error('Mock service error')
}


let mockRowTable = [
  { 
    id: 1, 
    abb: "MPL", 
    forwarderName: "MASS POWER LOGISTICS CO.,LTD.", 
    address: "716/44 Sol Watchannai, Bangkolaem, Bangkokloam, Bangkok 10120", 
    contactName: "SIRIPORN", 
    contactNo: "091-5450630", 
  },
  { 
    id: 2, 
    abb: "LEO", 
    forwarderName: "LEO Global Logistics Public Company Limited", 
    address: "251/1 Soi Pakdee, Rama 3 Road, Bangkokreem, Bangkok 10120 Thailand", 
    contactName: "TOSAPOL", 
    contactNo: "084-3878325", 
  },
  { 
    id: 3, 
    abb: "TVL", 
    forwarderName: "T.V.L.Global Logistics (Thailand) Co.Ltd.", 
    address: "11/4 Ratchadaphisek Road, Chongnonsi, Yannawa, Bangkok 10120", 
    contactName: "WORATHIDA", 
    contactNo: "02-6781685 # 309", 
  },
  { 
    id: 4, 
    abb: "HCL", 
    forwarderName: "HazChem Logistics Management Co.Ltd.", 
    address: "628, 4th Floor, Triple i Builg, Soi Klab Chom, Nonsee Road, Chongnonsee, Yannawa, Bangkok 10120", 
    contactName: "SURAWADEE", 
    contactNo: "085-1256648", 
  },
]

const fetchMock = async () => {
  await wait(MOCK_DELAY)
  maybeThrowMockError()

  return [...mockRowTable]
}

const createMock = async payload => {
  await wait(MOCK_DELAY)
  maybeThrowMockError()

  const id = mockRowTable.length ? Math.max(...mockRowTable.map(item => item.id)) + 1 : 1
  const now = new Date().toISOString().slice(0, 10)

  const next = {
    ...payload,
    id,
    status: payload.status || 'ACTIVE',
    createdAt: payload.createdAt || now,
    updatedAt: now,
  }

  mockRowTable = [next, ...mockRowTable]

  return next
}

const updateMock = async (id, payload) => {
  await wait(MOCK_DELAY)
  maybeThrowMockError()

  const now = new Date().toISOString().slice(0, 10)

  mockRowTable = mockRowTable.map(item =>
    item.id === id
      ? { ...item, ...payload, updatedAt: now }
      : item,
  )

  return mockRowTable.find(item => item.id === id)
}

const deleteMock = async id => {
  await wait(MOCK_DELAY)
  maybeThrowMockError()
  mockRowTable = mockRowTable.filter(item => item.id !== id)

  return { success: true }
}

const basePath = `${urlApi.value}/api/v1/SettingMaster/term-of-payment`

export const fetchListService = async (params = {}) => {
  if (USE_MOCK)
    return fetchMock()

  const response = await axiosIns.get(basePath, {
    params,
    headers: getHeaders(),
  })

  return response.data?.data || response.data || []
}

export const createService = async payload => {
  if (USE_MOCK)
    return createMock(payload)

  const response = await axiosIns.post(basePath, payload, {
    headers: getHeaders(),
  })

  return response.data
}

export const updateService = async (id, payload) => {
  if (USE_MOCK)
    return updateMock(id, payload)

  const response = await axiosIns.put(`${basePath}/${id}`, payload, {
    headers: getHeaders(),
  })

  return response.data
}

export const deleteService = async id => {
  if (USE_MOCK)
    return deleteMock(id)

  const response = await axiosIns.delete(`${basePath}/${id}`, {
    headers: getHeaders(),
  })

  return response.data
}
