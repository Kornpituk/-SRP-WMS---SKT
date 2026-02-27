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
  code: 'PRT' + String(index).padStart(3, '0'),
  name: label,
  description: 'Port master record ' + index,
  contactName: ['Somchai K.', 'Worathida P.', 'Tossapol N.', 'Siriporn A.', 'Anongrat B.'][index % 5],
  contactNo: '08' + (10000000 + index * 1379).toString().slice(0, 8),
  status: index % 4 === 0 ? 'INACTIVE' : 'ACTIVE',
  createdAt: `2024-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 27) + 1).padStart(2, '0')}`,
  updatedAt: `2025-${String(((index + 2) % 12) + 1).padStart(2, '0')}-${String(((index + 6) % 27) + 1).padStart(2, '0')}`,
})

let mockRows = [
  makeMockRow(1, 'Laem Chabang Deep Sea Port Terminal A'),
  makeMockRow(2, 'Bangkok Port Khlong Toei'),
  makeMockRow(3, 'Map Ta Phut Industrial Port'),
  makeMockRow(4, 'Songkhla Port Complex'),
  makeMockRow(5, 'Ranong Port Free Zone'),
  makeMockRow(6, 'Chiang Saen River Port'),
  makeMockRow(7, 'Sriracha Harbor Logistics Point'),
  makeMockRow(8, 'Pattani Coastal Port'),
  makeMockRow(9, 'Phuket Inter-Island Cargo Port'),
  makeMockRow(10, 'Satun Ferry and Cargo Port'),
  makeMockRow(11, 'Ayutthaya Inland Container Depot'),
  makeMockRow(12, 'Khon Kaen Dry Port Hub'),
  makeMockRow(13, 'Nakhon Ratchasima Rail Port'),
  makeMockRow(14, 'Udon Thani Distribution Port'),
  makeMockRow(15, 'Surat Thani Container Yard'),
  makeMockRow(16, 'Trang Coastal Cargo Point'),
  makeMockRow(17, 'Chonburi Inland Logistics Port'),
  makeMockRow(18, 'Rayong Chemical Port'),
  makeMockRow(19, 'Samut Prakan Riverside Port'),
  makeMockRow(20, 'Tak Cross-Border Cargo Terminal'),
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

const basePath = `${urlApi.value}/api/v1/SettingMaster/port`

export const fetchPortListService = async (params = {}) => {
  if (USE_MOCK)
    return fetchMock()

  const response = await axiosIns.get(basePath, {
    params,
    headers: getHeaders(),
  })

  return response.data?.data || response.data || []
}

export const createPortService = async payload => {
  if (USE_MOCK)
    return createMock(payload)

  const response = await axiosIns.post(basePath, payload, {
    headers: getHeaders(),
  })

  return response.data
}

export const updatePortService = async (id, payload) => {
  if (USE_MOCK)
    return updateMock(id, payload)

  const response = await axiosIns.put(`${basePath}/${id}`, payload, {
    headers: getHeaders(),
  })

  return response.data
}

export const deletePortService = async id => {
  if (USE_MOCK)
    return deleteMock(id)

  const response = await axiosIns.delete(`${basePath}/${id}`, {
    headers: getHeaders(),
  })

  return response.data
}
