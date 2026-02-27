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
  code: 'CAR' + String(index).padStart(3, '0'),
  name: label,
  description: 'Carrier master record ' + index,
  contactName: ['Somchai K.', 'Worathida P.', 'Tossapol N.', 'Siriporn A.', 'Anongrat B.'][index % 5],
  contactNo: '08' + (10000000 + index * 1379).toString().slice(0, 8),
  status: index % 4 === 0 ? 'INACTIVE' : 'ACTIVE',
  createdAt: `2024-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 27) + 1).padStart(2, '0')}`,
  updatedAt: `2025-${String(((index + 2) % 12) + 1).padStart(2, '0')}-${String(((index + 6) % 27) + 1).padStart(2, '0')}`,
})

let mockRows = [
  makeMockRow(1, 'Maersk Line Thailand Co., Ltd.'),
  makeMockRow(2, 'Evergreen Marine Asia (Thailand) Ltd.'),
  makeMockRow(3, 'ONE Ocean Network Express Thailand'),
  makeMockRow(4, 'CMA CGM Siam Logistics Service'),
  makeMockRow(5, 'Hapag-Lloyd (Thailand) Limited'),
  makeMockRow(6, 'MSC Mediterranean Shipping Thailand'),
  makeMockRow(7, 'DHL Global Forwarding Thailand'),
  makeMockRow(8, 'Kuehne + Nagel Logistics Thailand'),
  makeMockRow(9, 'DB Schenker (Thailand) Ltd.'),
  makeMockRow(10, 'Nippon Express Logistics (Thailand)'),
  makeMockRow(11, 'Yusen Logistics Thailand Co., Ltd.'),
  makeMockRow(12, 'Bollore Logistics Thailand'),
  makeMockRow(13, 'Sino-Thai Freight Management'),
  makeMockRow(14, 'Thai Airways Cargo Services'),
  makeMockRow(15, 'Qatar Airways Cargo Bangkok'),
  makeMockRow(16, 'Cathay Cargo Thailand'),
  makeMockRow(17, 'FedEx Trade Networks Thailand'),
  makeMockRow(18, 'UPS Supply Chain Solutions TH'),
  makeMockRow(19, 'Kerry Logistics Network Thailand'),
  makeMockRow(20, 'Lalamove Corporate Logistics'),
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

const basePath = `${urlApi.value}/api/v1/SettingMaster/carrier`

export const fetchCarrierListService = async (params = {}) => {
  if (USE_MOCK)
    return fetchMock()

  const response = await axiosIns.get(basePath, {
    params,
    headers: getHeaders(),
  })

  return response.data?.data || response.data || []
}

export const createCarrierService = async payload => {
  if (USE_MOCK)
    return createMock(payload)

  const response = await axiosIns.post(basePath, payload, {
    headers: getHeaders(),
  })

  return response.data
}

export const updateCarrierService = async (id, payload) => {
  if (USE_MOCK)
    return updateMock(id, payload)

  const response = await axiosIns.put(`${basePath}/${id}`, payload, {
    headers: getHeaders(),
  })

  return response.data
}

export const deleteCarrierService = async id => {
  if (USE_MOCK)
    return deleteMock(id)

  const response = await axiosIns.delete(`${basePath}/${id}`, {
    headers: getHeaders(),
  })

  return response.data
}
