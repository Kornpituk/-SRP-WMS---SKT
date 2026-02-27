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
  code: 'TOP' + String(index).padStart(3, '0'),
  name: label,
  description: 'Term of Payment master record ' + index,
  contactName: ['Somchai K.', 'Worathida P.', 'Tossapol N.', 'Siriporn A.', 'Anongrat B.'][index % 5],
  contactNo: '08' + (10000000 + index * 1379).toString().slice(0, 8),
  status: index % 4 === 0 ? 'INACTIVE' : 'ACTIVE',
  createdAt: `2024-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 27) + 1).padStart(2, '0')}`,
  updatedAt: `2025-${String(((index + 2) % 12) + 1).padStart(2, '0')}-${String(((index + 6) % 27) + 1).padStart(2, '0')}`,
})

let mockRows = [
  makeMockRow(1, 'Net 30 days'),
  makeMockRow(2, 'Cash on Delivery'),
  makeMockRow(3, 'Advance 50% before shipment'),
  makeMockRow(4, 'Net 45 with credit approval'),
  makeMockRow(5, 'End of month + 15 days'),
  makeMockRow(6, 'Letter of Credit at sight'),
  makeMockRow(7, 'Bank transfer within 7 days'),
  makeMockRow(8, 'Installment 3 terms'),
  makeMockRow(9, 'Prompt payment 2% discount'),
  makeMockRow(10, 'Net 60 enterprise terms'),
  makeMockRow(11, 'Payment against shipping documents'),
  makeMockRow(12, 'Prepaid before production'),
  makeMockRow(13, 'Net 15 fast settlement'),
  makeMockRow(14, 'Quarterly settlement agreement'),
  makeMockRow(15, 'Milestone-based payment'),
  makeMockRow(16, 'Deferred payment seasonal'),
  makeMockRow(17, 'Open account arrangement'),
  makeMockRow(18, 'Cash in advance for custom orders'),
  makeMockRow(19, 'Split payment with retention'),
  makeMockRow(20, 'Net 90 strategic account'),
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

const basePath = `${urlApi.value}/api/v1/SettingMaster/term-of-payment`

export const fetchTermOfPaymentListService = async (params = {}) => {
  if (USE_MOCK)
    return fetchMock()

  const response = await axiosIns.get(basePath, {
    params,
    headers: getHeaders(),
  })

  return response.data?.data || response.data || []
}

export const createTermOfPaymentService = async payload => {
  if (USE_MOCK)
    return createMock(payload)

  const response = await axiosIns.post(basePath, payload, {
    headers: getHeaders(),
  })

  return response.data
}

export const updateTermOfPaymentService = async (id, payload) => {
  if (USE_MOCK)
    return updateMock(id, payload)

  const response = await axiosIns.put(`${basePath}/${id}`, payload, {
    headers: getHeaders(),
  })

  return response.data
}

export const deleteTermOfPaymentService = async id => {
  if (USE_MOCK)
    return deleteMock(id)

  const response = await axiosIns.delete(`${basePath}/${id}`, {
    headers: getHeaders(),
  })

  return response.data
}
