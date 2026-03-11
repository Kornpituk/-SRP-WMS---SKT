// ============================================================================
// Service — Ship Document API
// ============================================================================
// USE_MOCK = true  → ใช้ mock data ได้ทันทีไม่ต้องรอ backend
// USE_MOCK = false → ใช้ axios จริง (เปลี่ยนเมื่อ backend พร้อม)
// ============================================================================

import { TabKey } from '../types/shipDocument'
import { mockDocumentList, mockDocumentDetail, mockVoidedDocument } from '../mocks/mockData'

// ★★★ เปลี่ยนเป็น false เมื่อ backend พร้อม ★★★
const USE_MOCK = true
const MOCK_DELAY = 500

// ---------------------------------------------------------------------------
// Real HTTP Client (uncomment เมื่อ backend พร้อม)
// ---------------------------------------------------------------------------
// import apiClient from '@/lib/axios'
// const BASE = '/api/ship-documents'
// async function request(method, url, data) {
//   const res = await apiClient({ method, url, data })
//   return res.data
// }
// async function requestBlob(method, url) {
//   const res = await apiClient({ method, url, responseType: 'blob' })
//   return res.data
// }

// ---------------------------------------------------------------------------
// Mock Helpers
// ---------------------------------------------------------------------------

const delay = (ms = MOCK_DELAY) => new Promise(r => setTimeout(r, ms))
const ok = (data, msg = 'OK') => ({ success: true, data, message: msg })
const clone = obj => JSON.parse(JSON.stringify(obj))

// In-memory store — persists during browser session
let _docs = clone([mockDocumentDetail, mockVoidedDocument])
let _list = clone(mockDocumentList)

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

export const shipDocumentApi = {
  // === Create ===
  async createDocument(mode, sourceId) {
    if (USE_MOCK) {
      await delay()


      // สร้าง doc ใหม่จาก template
      const newDoc = {
        ...clone(mockDocumentDetail),
        id: `doc-${Date.now()}`,
        documentNo: `SD-${Date.now()}`,
        status: 'ACTIVE',
        shippingMode: mode,
      }

      _docs.push(newDoc)
      console.log(`[Mock] Created doc ${newDoc.id} mode=${mode}`)

      return ok(clone(newDoc))
    }

    throw new Error('API not connected')
  },

  // === List ===
  async getList(params) {
    if (USE_MOCK) {
      await delay()
      let items = clone(_list)
      if (params?.search) {
        const q = params.search.toLowerCase()

        items = items.filter(d => d.documentNo.toLowerCase().includes(q))
      }
      if (params?.status) items = items.filter(d => d.status === params.status)
      const page = params?.page || 1
      const size = params?.pageSize || 20
      
      return ok({ items: items.slice((page - 1) * size, page * size), total: items.length })
    }
    throw new Error('API not connected')
  },

  // === Get By ID ===
  async getById(id) {
    if (USE_MOCK) {
      await delay()

      const doc = _docs.find(d => d.id === id)
      if (!doc) return { success: false, data: null, message: `Document ${id} not found` }
      
      return ok(clone(doc))
    }
    throw new Error('API not connected')
  },

  // === Void ===
  async voidDocument(id) {
    if (USE_MOCK) {
      await delay(300)

      const doc = _docs.find(d => d.id === id)
      if (doc) doc.status = 'VOID'
      const li = _list.find(d => d.id === id)
      if (li) li.status = 'VOID'
      console.log(`[Mock] Voided: ${id}`)
      
      return ok(null, 'Voided')
    }
    throw new Error('API not connected')
  },

  // === Save Draft ===
  async savePackingList(docId, data) { return this._save(docId, TabKey.PACKING_LIST, data) },
  async saveCommercialInvoice(docId, data) { return this._save(docId, TabKey.COMMERCIAL_INVOICE, data) },
  async saveCertificateOfOrigin(docId, data) { return this._save(docId, TabKey.CERTIFICATE_OF_ORIGIN, data) },
  async savePackingDeclaration(docId, data) { return this._save(docId, TabKey.PACKING_DECLARATION, data) },
  async saveShippingParticular(docId, data) { return this._save(docId, TabKey.SHIPPING_PARTICULAR, data) },

  // === Confirm ===
  async confirmPackingList(docId, data) { return this._confirm(docId, TabKey.PACKING_LIST, data) },
  async confirmCommercialInvoice(docId, data) { return this._confirm(docId, TabKey.COMMERCIAL_INVOICE, data) },
  async confirmCertificateOfOrigin(docId, data) { return this._confirm(docId, TabKey.CERTIFICATE_OF_ORIGIN, data) },
  async confirmPackingDeclaration(docId, data) { return this._confirm(docId, TabKey.PACKING_DECLARATION, data) },
  async confirmShippingParticular(docId, data) { return this._confirm(docId, TabKey.SHIPPING_PARTICULAR, data) },

  // === Print ===
  async printTab(docId, tabKey, target) {
    if (USE_MOCK) {
      await delay(800)

      const txt = `[Mock PDF] Doc=${docId} Tab=${tabKey} Target=${target} Time=${new Date().toISOString()}`

      console.log(`[Mock] Print: ${tabKey} → ${target}`)
      
      return new Blob([txt], { type: 'application/pdf' })
    }
    throw new Error('API not connected')
  },

  // === Internal mock helpers ===
  async _save(docId, tabKey, data) {
    if (USE_MOCK) {
      await delay()

      const doc = _docs.find(d => d.id === docId)
      if (doc?.tabs[tabKey]) {
        doc.tabs[tabKey].data = clone(data)
        doc.tabs[tabKey].status = 'SAVED'
        doc.tabs[tabKey].lastSavedAt = new Date().toISOString()
      }
      console.log(`[Mock] Save draft: ${tabKey}`)
      
      return ok(null, 'Saved')
    }
    throw new Error('API not connected')
  },

  async _confirm(docId, tabKey, data) {
    if (USE_MOCK) {
      await delay()

      const doc = _docs.find(d => d.id === docId)
      if (doc?.tabs[tabKey]) {
        doc.tabs[tabKey].data = clone(data)
        doc.tabs[tabKey].status = 'CONFIRMED'
        doc.tabs[tabKey].lastConfirmedAt = new Date().toISOString()
      }
      console.log(`[Mock] Confirmed: ${tabKey}`)
      
      return ok(null, 'Confirmed')
    }
    throw new Error('API not connected')
  },
}

// ---------------------------------------------------------------------------
// TabKey → API map (ใช้ .bind เพราะ mock helpers ใช้ this)
// ---------------------------------------------------------------------------

export const tabApiMap = {
  [TabKey.PACKING_LIST]: { save: shipDocumentApi.savePackingList.bind(shipDocumentApi), confirm: shipDocumentApi.confirmPackingList.bind(shipDocumentApi) },
  [TabKey.COMMERCIAL_INVOICE]: { save: shipDocumentApi.saveCommercialInvoice.bind(shipDocumentApi), confirm: shipDocumentApi.confirmCommercialInvoice.bind(shipDocumentApi) },
  [TabKey.CERTIFICATE_OF_ORIGIN]: { save: shipDocumentApi.saveCertificateOfOrigin.bind(shipDocumentApi), confirm: shipDocumentApi.confirmCertificateOfOrigin.bind(shipDocumentApi) },
  [TabKey.PACKING_DECLARATION]: { save: shipDocumentApi.savePackingDeclaration.bind(shipDocumentApi), confirm: shipDocumentApi.confirmPackingDeclaration.bind(shipDocumentApi) },
  [TabKey.SHIPPING_PARTICULAR]: { save: shipDocumentApi.saveShippingParticular.bind(shipDocumentApi), confirm: shipDocumentApi.confirmShippingParticular.bind(shipDocumentApi) },
}
