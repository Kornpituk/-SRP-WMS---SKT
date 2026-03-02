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

const makeMockRow = (index, label) => ({
  id: index,
  code: 'SAL' + String(index).padStart(3, '0'),
  name: label,
  description: 'Sale Person master record ' + index,
  contactName: ['Somchai K.', 'Worathida P.', 'Tossapol N.', 'Siriporn A.', 'Anongrat B.'][index % 5],
  contactNo: '08' + (10000000 + index * 1379).toString().slice(0, 8),
  status: index % 4 === 0 ? 'INACTIVE' : 'ACTIVE',
  createdAt: `2024-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 27) + 1).padStart(2, '0')}`,
  updatedAt: `2025-${String(((index + 2) % 12) + 1).padStart(2, '0')}-${String(((index + 6) % 27) + 1).padStart(2, '0')}`,
})

let mockRows = [
  makeMockRow(1, 'Somchai Kittipong'),
  makeMockRow(2, 'Anongrat Boonmee'),
  makeMockRow(3, 'Preecha Sanguan'),
  makeMockRow(4, 'Worawit Chansiri'),
  makeMockRow(5, 'Kanyarat Munkong'),
  makeMockRow(6, 'Nattapong Siriporn'),
  makeMockRow(7, 'Sasithorn Lertsakul'),
  makeMockRow(8, 'Phongsakorn Wongchai'),
  makeMockRow(9, 'Chanida Pattanakul'),
  makeMockRow(10, 'Thanawat Rattanaporn'),
  makeMockRow(11, 'Patchara Intarakul'),
  makeMockRow(12, 'Suphakorn Limcharoen'),
  makeMockRow(13, 'Jirawan Chansawat'),
  makeMockRow(14, 'Atthapon Kongsiri'),
  makeMockRow(15, 'Nicha Wongprasert'),
  makeMockRow(16, 'Kritsada Poomchai'),
  makeMockRow(17, 'Panita Sornchai'),
  makeMockRow(18, 'Saran Bunyapong'),
  makeMockRow(19, 'Rinrada Chaisiri'),
  makeMockRow(20, 'Tossapol Meesuk'),
]

const fetchMock = async () => {
  await wait(MOCK_DELAY)
  maybeThrowMockError()

  return [...mockRows]
}

const createMock = async payload => {
  await wait(MOCK_DELAY)
  maybeThrowMockError()

  const id = mockRows.length ? Math.max(...mockRows.map(item => item.id)) + 1 : 1
  const now = new Date().toISOString().slice(0, 10)

  const next = {
    ...payload,
    id,
    status: payload.status || 'ACTIVE',
    createdAt: payload.createdAt || now,
    updatedAt: now,
  }

  mockRows = [next, ...mockRows]

  return next
}

const updateMock = async (id, payload) => {
  await wait(MOCK_DELAY)
  maybeThrowMockError()

  const now = new Date().toISOString().slice(0, 10)

  mockRows = mockRows.map(item =>
    item.id === id
      ? { ...item, ...payload, updatedAt: now }
      : item,
  )

  return mockRows.find(item => item.id === id)
}

const deleteMock = async id => {
  await wait(MOCK_DELAY)
  maybeThrowMockError()
  mockRows = mockRows.filter(item => item.id !== id)

  return { success: true }
}

const basePath = `${urlApi.value}/api/v1/SettingMaster/sale-person`

export const fetchSalePersonListService = async (params = {}) => {
  if (USE_MOCK)
    return fetchMock()

  const response = await axiosIns.get(basePath, {
    params,
    headers: getHeaders(),
  })

  return response.data?.data || response.data || []
}

export const createSalePersonService = async payload => {
  if (USE_MOCK)
    return createMock(payload)

  const response = await axiosIns.post(basePath, payload, {
    headers: getHeaders(),
  })

  return response.data
}

export const updateSalePersonService = async (id, payload) => {
  if (USE_MOCK)
    return updateMock(id, payload)

  const response = await axiosIns.put(`${basePath}/${id}`, payload, {
    headers: getHeaders(),
  })

  return response.data
}

export const deleteSalePersonService = async id => {
  if (USE_MOCK)
    return deleteMock(id)

  const response = await axiosIns.delete(`${basePath}/${id}`, {
    headers: getHeaders(),
  })

  return response.data
}
