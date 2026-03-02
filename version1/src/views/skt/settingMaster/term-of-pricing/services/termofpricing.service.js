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
  code: 'TPR' + String(index).padStart(3, '0'),
  name: label,
  description: 'Term of Pricing master record ' + index,
  contactName: ['Somchai K.', 'Worathida P.', 'Tossapol N.', 'Siriporn A.', 'Anongrat B.'][index % 5],
  contactNo: '08' + (10000000 + index * 1379).toString().slice(0, 8),
  status: index % 4 === 0 ? 'INACTIVE' : 'ACTIVE',
  createdAt: `2024-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 27) + 1).padStart(2, '0')}`,
  updatedAt: `2025-${String(((index + 2) % 12) + 1).padStart(2, '0')}-${String(((index + 6) % 27) + 1).padStart(2, '0')}`,
})

let mockRows = [
  makeMockRow(1, 'EXW Ex Works'),
  makeMockRow(2, 'FOB Free On Board'),
  makeMockRow(3, 'CIF Cost Insurance and Freight'),
  makeMockRow(4, 'DAP Delivered At Place'),
  makeMockRow(5, 'DDP Delivered Duty Paid'),
  makeMockRow(6, 'CFR Cost and Freight'),
  makeMockRow(7, 'FCA Free Carrier'),
  makeMockRow(8, 'CPT Carriage Paid To'),
  makeMockRow(9, 'CIP Carriage and Insurance Paid To'),
  makeMockRow(10, 'FAS Free Alongside Ship'),
  makeMockRow(11, 'Domestic contract rate 2024'),
  makeMockRow(12, 'Seasonal bulk discount matrix'),
  makeMockRow(13, 'Tiered customer pricing level A'),
  makeMockRow(14, 'Urgent handling surcharge policy'),
  makeMockRow(15, 'Weekend dispatch premium'),
  makeMockRow(16, 'Fuel index linked pricing'),
  makeMockRow(17, 'Volume rebate annual agreement'),
  makeMockRow(18, 'Special hazardous cargo rate'),
  makeMockRow(19, 'Long-term framework price'),
  makeMockRow(20, 'Spot market flexible price'),
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

const basePath = `${urlApi.value}/api/v1/SettingMaster/term-of-pricing`

export const fetchTermOfPricingListService = async (params = {}) => {
  if (USE_MOCK)
    return fetchMock()

  const response = await axiosIns.get(basePath, {
    params,
    headers: getHeaders(),
  })

  return response.data?.data || response.data || []
}

export const createTermOfPricingService = async payload => {
  if (USE_MOCK)
    return createMock(payload)

  const response = await axiosIns.post(basePath, payload, {
    headers: getHeaders(),
  })

  return response.data
}

export const updateTermOfPricingService = async (id, payload) => {
  if (USE_MOCK)
    return updateMock(id, payload)

  const response = await axiosIns.put(`${basePath}/${id}`, payload, {
    headers: getHeaders(),
  })

  return response.data
}

export const deleteTermOfPricingService = async id => {
  if (USE_MOCK)
    return deleteMock(id)

  const response = await axiosIns.delete(`${basePath}/${id}`, {
    headers: getHeaders(),
  })

  return response.data
}
