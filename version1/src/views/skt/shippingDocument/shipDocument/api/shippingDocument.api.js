import { ShippingDocStatus } from '../constants/shippingDocument.constants'

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
    invoiceInSAP: 'TIP2509041', invoice: '1100082196',
    payerName: 'TOYOTSU CHEMIPLAS(THAILAND)CO.,LTD.',
    consignee: 'TOYOTSU CHEMIPLAS(THAILAND)CO.,LTD.',
    item: 'MAT-105T',                       qty: 3000,
    uom: 'KGS', termOfPricing: 'FOB',      shippingMode: 'AIR',
    etd: '01/09/2025', destination: 'MALAYSIA',
    updatedDate: '01/09/2025',              updatedBy: 'Rungthiwa Sunpakeaw',
  },
  {
    id: '3', status: ShippingDocStatus.COMPLETED,
    invoiceInSAP: 'TIP2509042', invoice: '1100082232',
    payerName: 'SANYO CHEMICAL INDUSTRIES, LTD.',
    consignee: 'SANYO CHEMICAL INDUSTRIES, LTD.',
    item: 'OSMORIN DA-50',                  qty: 41840,
    uom: 'KGS', termOfPricing: 'CIF',      shippingMode: 'SEA',
    etd: '05/09/2025', destination: 'SINGAPORE',
    updatedDate: '05/09/2025',              updatedBy: 'Rungthiwa Sunpakeaw',
  },
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

/**
 * @param {object} params - filter params
 * @param {'list'|'void'} mode
 */
export async function fetchShippingDocs(params, mode) {
  await delay()
  let result = [...MOCK_SHIPPING_DOCS]

  // mode=void: backend จะ filter เฉพาะ void เสมอ
  if (mode === 'void') {
    result = result.filter(r => r.status === ShippingDocStatus.VOID)
  } else if (params.status && params.status !== 'All') {
    result = result.filter(r => r.status === params.status)
  }

  if (params.invoiceInSAP) result = result.filter(r => r.invoiceInSAP.toLowerCase().includes(params.invoiceInSAP.toLowerCase()))
  if (params.invoice)      result = result.filter(r => r.invoice.includes(params.invoice))
  if (params.payerName)    result = result.filter(r => r.payerName.toLowerCase().includes(params.payerName.toLowerCase()))
  if (params.consignee)    result = result.filter(r => r.consignee.toLowerCase().includes(params.consignee.toLowerCase()))
  if (params.item)         result = result.filter(r => r.item.toLowerCase().includes(params.item.toLowerCase()))
  if (params.shippingMode) result = result.filter(r => r.shippingMode === params.shippingMode)

  return { data: result, total: result.length }
}

export async function fetchShippingExpenses(params) {
  await delay()
  let result = [...MOCK_SHIPPING_EXPENSES]

  if (params.status && params.status !== 'All') result = result.filter(r => r.status === params.status)
  if (params.invoiceInSAP) result = result.filter(r => r.invoiceInSAP.toLowerCase().includes(params.invoiceInSAP.toLowerCase()))
  if (params.invoice)      result = result.filter(r => r.invoice.includes(params.invoice))
  if (params.payerName)    result = result.filter(r => r.payerName.toLowerCase().includes(params.payerName.toLowerCase()))

  return { data: result, total: result.length }
}
