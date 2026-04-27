import { ShippingDocStatus } from '../constants/shippingDocument.constants'
import axiosIns from '@axios'
import { urlApi } from '@/api'

// ============================================================
// MOCK DATA
// ============================================================

const MOCK_SHIPPING_DOCS = [
  {
    id: '1', status: ShippingDocStatus.WAITING,
    invoiceInSAP: 'TIP2509041', invoice: '1100082196',
    payerName: "AGE D'OR PTE LTD",          consignee: 'ATH CO., LTD',
    item: 'SN DISPERSANT 5040',             qty: 40000,
    uom: 'KGS', termOfPricing: 'CIF',      shippingMode: 'SEA',
    etd: '01/09/2025', destination: 'VIETNAM',
    updatedDate: '01/09/2025',              updatedBy: 'Rungthiwa Sunpakeaw',
  },
  {
    id: '2', status: ShippingDocStatus.DRAFT,
    invoiceInSAP: 'TIP2509042', invoice: '1100082196',
    payerName: 'TOYOTSU CHEMIPLAS(THAILAND)CO.,LTD.',
    consignee: 'TOYOTSU CHEMIPLAS(THAILAND)CO.,LTD.',
    item: 'MAT-105T',                       qty: 3000,
    uom: 'KGS', termOfPricing: 'FOB',      shippingMode: 'AIR',
    etd: '01/09/2025', destination: 'MALAYSIA',
    updatedDate: '01/09/2025',              updatedBy: 'Rungthiwa Sunpakeaw',
  },
  {
    id: '3', status: ShippingDocStatus.COMPLETED,
    invoiceInSAP: 'TIP2509043', invoice: '1100082232',
    payerName: 'SANYO CHEMICAL INDUSTRIES, LTD.',
    consignee: 'SANYO CHEMICAL INDUSTRIES, LTD.',
    item: 'OSMORIN DA-50',                  qty: 41840,
    uom: 'KGS', termOfPricing: 'CIF',      shippingMode: 'SEA',
    etd: '05/09/2025', destination: 'SINGAPORE',
    updatedDate: '05/09/2025',              updatedBy: 'Rungthiwa Sunpakeaw',
  },
]


const MOCK_SHIPPING_DOCS_VOID = [
  {
    id: '4', status: ShippingDocStatus.VOID,
    invoiceInSAP: 'TIX2509013', invoice: '1100024635',
    payerName: "AGE D'OR PTE LTD",          consignee: "AGE D'OR PTE LTD",
    item: 'CHEMICLEAN AS-S142T',            qty: 20000,
    uom: 'KGS', termOfPricing: 'CIF',      shippingMode: 'TRUCK',
    etd: '20/10/2025', destination: 'VIETNAM',
    updatedDate: '20/10/2025',              updatedBy: 'Rungthiwa Sunpakeaw',
  },
  {
    id: '5', status: ShippingDocStatus.VOID,
    invoiceInSAP: 'TIP2509015', invoice: '1100082166',
    payerName: 'TOYOTSU CHEMIPLAS(THAILAND)CO.,LTD.',
    consignee: 'TOYOTSU CHEMIPLAS(THAILAND)CO.,LTD.',
    item: 'MAT-105T',                       qty: 33000,
    uom: 'KGS', termOfPricing: 'FOB',      shippingMode: 'AIR',
    etd: '01/09/2025', destination: 'MALAYSIA',
    updatedDate: '01/09/2025',              updatedBy: 'Rungthiwa Sunpakeaw',
  },
  {
    id: '6', status: ShippingDocStatus.VOID,
    invoiceInSAP: 'TIP2509031', invoice: '1100082234',
    payerName: 'SANYO CHEMICAL INDUSTRIES, LTD.',
    consignee: 'SANYO CHEMICAL INDUSTRIES, LTD.',
    item: 'OSMORIN DA-50',                  qty: 41000,
    uom: 'KGS', termOfPricing: 'CIF',      shippingMode: 'SEA',
    etd: '05/09/2025', destination: 'SINGAPORE',
    updatedDate: '05/09/2025',             updatedBy: 'Rungthiwa Sunpakeaw',
  },
]

const MOCK_SHIPPING_EXPENSES = [
  { id: '1', status: ShippingDocStatus.WAITING,   invoiceInSAP: 'TIP2509041', invoice: '1100082196', payerName: "AGE D'OR PTE LTD",                  etd: '01/09/2025' },
  { id: '2', status: ShippingDocStatus.DRAFT,     invoiceInSAP: 'TIP2509041', invoice: '1100082196', payerName: 'TOYOTSU CHEMIPLAS(THAILAND)CO.,LTD.', etd: '01/09/2025' },
  { id: '3', status: ShippingDocStatus.COMPLETED, invoiceInSAP: 'TIP2509042', invoice: '1100082232', payerName: 'SANYO CHEMICAL INDUSTRIES, LTD.',      etd: '05/09/2025' },
  { id: '4', status: ShippingDocStatus.VOID,      invoiceInSAP: 'TIX2509013', invoice: '1100024635', payerName: "AGE D'OR PTE LTD",                   etd: '20/10/2025' },
  { id: '5', status: ShippingDocStatus.VOID,      invoiceInSAP: 'TIP2509015', invoice: '1100082166', payerName: 'TOYOTSU CHEMIPLAS(THAILAND)CO.,LTD.', etd: '01/09/2025' },
  { id: '6', status: ShippingDocStatus.VOID,      invoiceInSAP: 'TIP2509031', invoice: '1100082234', payerName: 'SANYO CHEMICAL INDUSTRIES, LTD.',      etd: '05/09/2025' },
]

// ============================================================
// Simulate async API (swap กับ axios จริง ๆ ได้ทันที)
// ============================================================
// eslint-disable-next-line promise/param-names
const delay = (ms = 300) => new Promise(res => setTimeout(res, ms))
const USE_MOCK = import.meta.env?.VITE_SHIP_DOCUMENT_API_MODE === 'mock'

const SORT_FIELD_MAP = {
  status: 'STATUS',
  invoiceInSAP: 'SAPINVOICENO',
  invoice: 'INVOICENO',
  payerName: 'PAYERNAME',
  consignee: 'CONSIGNEENAME',
  item: 'ITEM',
  termOfPricing: 'TERMOFPRICING',
  shippingMode: 'SHIPPINGMODE',
  etd: 'ETD',
  destination: 'DESTINATION',
  updatedDate: 'UPDATEDDATE',
  updatedBy: 'UPDATEDBY',
}

const STATUS_CODE_BY_NAME = {
  All: 'All',
  Waiting: 'WAITING',
  Draft: 'DRAFT',
  Completed: 'COMPLETED',
  Void: 'VOID',
}

function getAccessToken() {
  return localStorage.getItem('accessToken') || ''
}

function authHeaders() {
  const token = getAccessToken()

  return token ? { Authorization: `Bearer ${token}` } : {}
}

function formatDateForDisplay(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return date.toLocaleDateString('en-GB')
}

function normalizeStatusForApi(value) {
  if (!value) return 'All'

  return STATUS_CODE_BY_NAME[value] ?? value
}

function normalizeStatusForMock(value) {
  const code = normalizeStatusForApi(value)
  const match = Object.entries(STATUS_CODE_BY_NAME).find(([, statusCode]) => statusCode === code)

  return match?.[0] ?? value
}

function normalizeShippingModeId(value) {
  const id = Number(value)

  return Number.isInteger(id) && id > 0 ? id : undefined
}

function getSortParams(sortBy = []) {
  const [sort] = Array.isArray(sortBy) ? sortBy : []

  return {
    sortField: SORT_FIELD_MAP[sort?.key] ?? 'UPDATEDDATE',
    sortDirection: sort?.order === 'asc' ? 'ASC' : 'DESC',
  }
}

function getEtdParams(etdRange) {
  const { from, to } = parseRangeValue(etdRange)

  return {
    etdStart: from ? new Date(from).toISOString() : undefined,
    etdEnd: to ? new Date(to).toISOString() : undefined,
  }
}

function compactParams(params) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )
}

function mapSearchRow(row) {
  return {
    id: row.shipDocId,
    shipDocId: row.shipDocId,
    shipDocNo: row.shipDocNo,
    salesOrderNo: row.salesOrderNo,
    status: row.statusName || row.statusCode || '',
    statusCode: row.statusCode,
    invoiceInSAP: row.sapInvoiceNo || '',
    invoice: row.invoiceNo || '',
    payerName: row.payerName || '',
    consignee: row.consigneeName || '',
    item: row.item || row.salesOrderNo || '',
    qty: row.qty ?? row.quantity ?? '',
    uom: row.uom || row.uomCode || '',
    termOfPricing: row.termOfPricingCode || row.termOfPricingName || '',
    shippingModeId: row.shippingModeId,
    shippingMode: row.shippingModeCode || row.shippingModeName || '',
    etd: formatDateForDisplay(row.etd),
    destination: row.destination || '',
    updatedDate: formatDateForDisplay(row.updatedDate),
    updatedBy: row.updatedBy || '',
  }
}

async function fetchShipDocSearch(params, tabName) {
  const { sortField, sortDirection } = getSortParams(params.sortBy)
  const { etdStart, etdEnd } = getEtdParams(params.etdRange)

  const response = await axiosIns.get(`${urlApi.value}/api/ShipDoc/Search`, {
    headers: authHeaders(),
    params: compactParams({
      tabName,
      includeVoid: true,
      status: normalizeStatusForApi(params.status),
      payerName: params.payerName,
      shippingModeId: normalizeShippingModeId(params.shippingMode),
      sapInvoiceNo: params.invoiceInSAP,
      consigneeName: params.consignee,
      invoiceNo: params.invoice,
      item: params.item,
      etdStart,
      etdEnd,
      page: params.page || 1,
      perPage: params.itemsPerPage || params.perPage || 20,
      sortField,
      sortDirection,
    }),
  })

  const rows = Array.isArray(response.data?.data) ? response.data.data : []

  return {
    data: rows.map(mapSearchRow),
    total: response.data?.totalCount ?? rows.length,
  }
}

export async function fetchShippingDocStatusSelector() {
  const response = await axiosIns.get(`${urlApi.value}/api/ShipDoc/Selector`, {
    headers: authHeaders(),
  })

  const rows = Array.isArray(response.data?.data) ? response.data.data : []
  const optionMap = new Map()

  rows
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .forEach(row => {
      const key = row.statusCode || row.statusName
      if (!key) return

      const option = {
        title: row.statusName || row.statusCode,
        value: row.statusCode || row.statusName,
        statusCode: row.statusCode,
        shipDocStatusId: row.shipDocStatusId,
        sortOrder: row.sortOrder,
      }

      const existing = optionMap.get(key)

      if (!existing || (existing.shipDocStatusId == null && option.shipDocStatusId != null)) {
        optionMap.set(key, option)
      }
    })

  return [...optionMap.values()].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

function parseDisplayDate(value) {
  if (!value) return null

  const text = String(value).trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const [year, month, day] = text.split('-')

    return new Date(Number(year), Number(month) - 1, Number(day)).getTime()
  }

  const [day, month, year] = text.split('/')
  if (!day || !month || !year) return null

  return new Date(Number(year), Number(month) - 1, Number(day)).getTime()
}

function parseRangeValue(value) {
  if (!value) return {}

  const parts = Array.isArray(value)
    ? value
    : String(value).split(/\s+(?:to|-)\s+/i)

  const [from, to] = parts.map(part => String(part).trim()).filter(Boolean)

  return {
    from: parseDisplayDate(from),
    to: parseDisplayDate(to || from),
  }
}

function applyEtdRange(rows, etdRange) {
  const { from, to } = parseRangeValue(etdRange)
  if (!from && !to) return rows

  return rows.filter(row => {
    const etd = parseDisplayDate(row.etd)

    return Boolean(etd) && !(from && etd < from) && !(to && etd > to)
  })
}

function compareValues(a, b) {
  const dateA = parseDisplayDate(a)
  const dateB = parseDisplayDate(b)

  if (dateA && dateB) return dateA - dateB

  if (typeof a === 'number' && typeof b === 'number') return a - b

  return String(a ?? '').localeCompare(String(b ?? ''), undefined, {
    numeric: true,
    sensitivity: 'base',
  })
}

function applySort(rows, sortBy = []) {
  if (!Array.isArray(sortBy) || !sortBy.length) return rows

  return [...rows].sort((a, b) => {
    for (const sort of sortBy) {
      const key = sort.key
      if (!key) continue

      const direction = sort.order === 'desc' ? -1 : 1
      const result = compareValues(a[key], b[key])
      if (result !== 0) return result * direction
    }

    return 0
  })
}

function applyPagination(rows, params = {}) {
  const page = Number(params.page) || 1
  const itemsPerPage = Number(params.itemsPerPage) || 20
  const start = (page - 1) * itemsPerPage

  return rows.slice(start, start + itemsPerPage)
}

/**
 * @param {object} params - filter params
 * @param {'list'|'void'} mode
 */
export async function fetchShippingDocs(params, mode) {
  if (!USE_MOCK) {
    return fetchShipDocSearch(params, mode === 'void' ? 'VOID' : 'LIST')
  }

  await delay()
  let result = [...MOCK_SHIPPING_DOCS]

  // mode=void: backend จะ filter เฉพาะ void เสมอ
  if (mode === 'void') {
    result = [...MOCK_SHIPPING_DOCS_VOID]
  } else if (params.status && params.status !== 'All') {
    result = result.filter(r => r.status === normalizeStatusForMock(params.status))
  }

  if (params.invoiceInSAP) result = result.filter(r => r.invoiceInSAP.toLowerCase().includes(params.invoiceInSAP.toLowerCase()))
  if (params.invoice)      result = result.filter(r => r.invoice.includes(params.invoice))
  if (params.payerName)    result = result.filter(r => r.payerName.toLowerCase().includes(params.payerName.toLowerCase()))
  if (params.consignee)    result = result.filter(r => r.consignee.toLowerCase().includes(params.consignee.toLowerCase()))
  if (params.item)         result = result.filter(r => r.item.toLowerCase().includes(params.item.toLowerCase()))
  if (params.shippingMode) result = result.filter(r => r.shippingMode === params.shippingMode)
  result = applyEtdRange(result, params.etdRange)

  const total = result.length
  const data = applyPagination(applySort(result, params.sortBy), params)

  return { data, total }
}

export async function fetchShippingExpenses(params) {
  if (!USE_MOCK) {
    return fetchShipDocSearch(params, 'EXPENSE')
  }

  await delay()
  let result = [...MOCK_SHIPPING_EXPENSES]

  if (params.status && params.status !== 'All') result = result.filter(r => r.status === normalizeStatusForMock(params.status))
  if (params.invoiceInSAP) result = result.filter(r => r.invoiceInSAP.toLowerCase().includes(params.invoiceInSAP.toLowerCase()))
  if (params.invoice)      result = result.filter(r => r.invoice.includes(params.invoice))
  if (params.payerName)    result = result.filter(r => r.payerName.toLowerCase().includes(params.payerName.toLowerCase()))
  result = applyEtdRange(result, params.etdRange)

  const total = result.length
  const data = applyPagination(applySort(result, params.sortBy), params)

  return { data, total }
}
