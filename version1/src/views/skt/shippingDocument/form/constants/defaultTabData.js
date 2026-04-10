// ============================================================================
// Default Tab Data Factories
// ============================================================================

import { TabKey, TabStatus } from '../types/shipDocument'

function emptyParty() {
  return { name: '', address: '', address2: '', address3: '', city: '', country: '', tel: '', taxId: '', attn: '', email: '' }
}

export function createDefaultPackingList() {
  return {
    date: '', invoiceNo: '', contractNo: '', poNo: '', proformaInvoiceNo: '',
    payer: emptyParty(), consignee: emptyParty(),
    payment: '', dueDate: '',
    feeder: '', vessel: '', mawbNo: '', hawbNo: '', from: '', to: '', etd: '', etdTime: '', eta: '', etaTime: '',
    items: [],
    packing: '', countryOfOrigin: '', makerName: '', packaging: '', lotNo: '',
  }
}

export function createDefaultCommercialInvoice() {
  return {
    date: '', invoiceNo: '', contractNo: '', poNo: '', proformaInvoiceNo: '',
    payer: emptyParty(), consignee: emptyParty(),
    payment: '', dueDate: '',
    feeder: '', vessel: '', mawbNo: '', hawbNo: '', from: '', to: '', etd: '', etdTime: '', eta: '', etaTime: '',
    items: [],
    cifValue: 0, cifPort: '', fobValue: 0, fobPort: '',
    oceanFreight: 0, insurance: 0,
    packing: '', countryOfOrigin: '', makerName: '', packaging: '', lotNo: '',
    bankingDetail: { accountNo: '', bankName: '', address: '', swiftCode: '' },
  }
}

export function createDefaultCertificateOfOrigin() {
  return {
    date: '', totalWeight: '', containerCount: '', containerType: '',
    productName: '', manufacturer: '', originCountry: '',
    invoiceNo: '', contractNo: '', poNo: '',
  }
}

export function createDefaultPackingDeclaration() {
  return {
    date: '', refNo: '', descriptionOfGoods: '',
    packageType: '', packageDimensions: '',
    netWeight: 0, netWeightUnit: 'KGS', totalDrums: 0,
    grossWeight: 0, grossWeightUnit: 'KGS',
    invoiceNo: '', vesselName: '', dateOfShipment: '', blNo: '', mawbNo: '', hawbNo: '',
    declaration: 'THERE IS NO WOOD IN THE CONTAINER',
  }
}

export function createDefaultShippingParticular() {
  return {
    bookingNo: '', blNo: '', date: '',
    shipper: emptyParty(), consignee: emptyParty(), notifyParty: emptyParty(),
    consigneeNote: '',
    portOfReceipt: '', portOfLoading: '', feeder: '', vessel: '',
    etd: '', eta: '', containerType: '',
    portOfDischarge: '', portOfDelivery: '', deliveryType: '',
    shippingMark: {
      marks: [], packageDescription: '', fclContainer: '',
      netWeight: 0, grossWeight: 0, cbm: 0,
      productDescription: '', hsCode: '', countryOfOrigin: '', palletNote: '',
    },
    containerSealNo: { mark: '', freightTerms: '', blType: '' },
  }
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

const dataFactories = {
  [TabKey.PACKING_LIST]: createDefaultPackingList,
  [TabKey.COMMERCIAL_INVOICE]: createDefaultCommercialInvoice,
  [TabKey.CERTIFICATE_OF_ORIGIN]: createDefaultCertificateOfOrigin,
  [TabKey.PACKING_DECLARATION]: createDefaultPackingDeclaration,
  [TabKey.SHIPPING_PARTICULAR]: createDefaultShippingParticular,
}

/**
 * @param {string} key — TabKey value
 * @returns {import('../types/shipDocument').TabState}
 */
export function createDefaultTabState(key) {
  const factory = dataFactories[key]
  if (!factory) throw new Error(`No data factory for tab: ${key}`)

  return {
    key,
    status: TabStatus.DRAFT,
    data: factory(),
    isDirty: false,
    isLoading: false,
    errors: {},
    lastSavedAt: null,
    lastConfirmedAt: null,
  }
}
