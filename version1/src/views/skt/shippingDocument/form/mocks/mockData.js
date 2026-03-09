// ============================================================================
// Mock Data — Realistic sample data from actual screenshots
// ============================================================================
// ใช้สำหรับ dev/test โดยไม่ต้องรอ backend
// ลบไฟล์นี้ได้เลยเมื่อ backend พร้อม
// ============================================================================

import { DocumentStatus, TabStatus, TabKey } from '../types/shipDocument'

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
let _id = 0
const uid = () => `item-${++_id}`

// ---------------------------------------------------------------------------
// Mock: Document List (สำหรับ ShipDocumentList.vue)
// ---------------------------------------------------------------------------
export const mockDocumentList = [
  {
    id: 'TIP2509041',
    documentNo: 'SD-2025-001',
    status: DocumentStatus.ACTIVE,
    createdAt: '2025-12-08T10:00:00Z',
    updatedAt: '2025-12-08T14:30:00Z',
    tabStatuses: [
      { key: TabKey.PACKING_LIST, status: TabStatus.CONFIRMED },
      { key: TabKey.COMMERCIAL_INVOICE, status: TabStatus.SAVED },
      { key: TabKey.CERTIFICATE_OF_ORIGIN, status: TabStatus.SAVED },
      { key: TabKey.PACKING_DECLARATION, status: TabStatus.SAVED },
      { key: TabKey.SHIPPING_PARTICULAR, status: TabStatus.DRAFT },
    ],
  },
  {
    id: 'TIP2509042',
    documentNo: 'SD-2025-002',
    status: DocumentStatus.VOID,
    createdAt: '2025-11-20T08:00:00Z',
    updatedAt: '2025-11-25T09:00:00Z',
    tabStatuses: [
      { key: TabKey.PACKING_LIST, status: TabStatus.CONFIRMED },
      { key: TabKey.COMMERCIAL_INVOICE, status: TabStatus.CONFIRMED },
      { key: TabKey.CERTIFICATE_OF_ORIGIN, status: TabStatus.CONFIRMED },
      { key: TabKey.PACKING_DECLARATION, status: TabStatus.CONFIRMED },
      { key: TabKey.SHIPPING_PARTICULAR, status: TabStatus.CONFIRMED },
    ],
  },
  {
    id: 'TIP2509043',
    documentNo: 'SD-2025-003',
    status: DocumentStatus.ACTIVE,
    createdAt: '2025-12-01T07:00:00Z',
    updatedAt: '2025-12-01T07:00:00Z',
    tabStatuses: [
      { key: TabKey.PACKING_LIST, status: TabStatus.DRAFT },
      { key: TabKey.COMMERCIAL_INVOICE, status: TabStatus.DRAFT },
      { key: TabKey.CERTIFICATE_OF_ORIGIN, status: TabStatus.DRAFT },
      { key: TabKey.PACKING_DECLARATION, status: TabStatus.DRAFT },
      { key: TabKey.SHIPPING_PARTICULAR, status: TabStatus.DRAFT },
    ],
  },
]

// ---------------------------------------------------------------------------
// Mock: Full Document Detail (สำหรับ ShipDocumentDetail.vue)
// ---------------------------------------------------------------------------
export const mockDocumentDetail = {
  id: 'TIP2509041',
  documentNo: 'SD-2025-001',
  status: DocumentStatus.ACTIVE,
  createdAt: '2025-12-08T10:00:00Z',
  updatedAt: '2025-12-08T14:30:00Z',
  createdBy: 'Rungthiwa-Admin',

  tabs: {
    // =====================================================================
    // Packing List — CONFIRMED (readonly, green check)
    // =====================================================================
    [TabKey.PACKING_LIST]: {
      key: TabKey.PACKING_LIST,
      status: TabStatus.SAVED,
      isDirty: false,
      isLoading: false,
      errors: {},
      lastSavedAt: '2025-12-08T12:00:00Z',
      lastConfirmedAt: '2025-12-08T13:00:00Z',
      data: {
        date: '2025-12-08',
        invoiceNo: '1100082921',
        contractNo: 'C-2509155',
        poNo: 'PO-250268',
        proformaInvoiceNo: 'SKT06007/2025',
        payer: {
          name: 'AGE D\'OR PTE LTD',
          address: '25 BUKIT BATOK CRESCENT',
          address2: '#06-13 THE ELITIST',
          city: 'SINGAPORE',
          country: '658066',
          tel: '+65 6776 5228',
          attn: 'MS. POOI YEE',
        },
        consignee: {
          name: 'ATH CO., LTD',
          address: '53 QUANG TRUNG STREET',
          address2: '#17-02B PRIME CENTRE',
          address3: 'HAI BA TRUNG WARD',
          city: 'HANOI',
          country: 'VIETNAM',
          tel: '(848) 822 9362 - 3',
          taxId: '0101509379',
        },
        payment: 'T/T in advance',
        dueDate: '2025-01-04',
        feeder: 'KMTC BANGKOK V.2511N',
        vessel: 'KMTC BANGKOK V.2511N',
        from: 'LAEM CHABANG, THAILAND',
        to: 'HCM CITY, VIETNAM',
        etd: '2025-09-25',
        eta: '2025-09-27',
        items: [
          {
            id: uid(),
            marksAndNos: 'ATH CO LTD\nPO-250264\nHAIPHONG-VIETNAM',
            descriptionOfGoods: 'SN DISPERSANT 5040',
            subDescription: 'SODIUM POLYACRY LATE',
            package: '250KG PLASTIC DRUM',
            packageDetail: '160 DRUMS (40 PALLETS)',
            packageType: '250KG PLASTIC DRUM',
            quantity: 160,
            unitType: 'DRUM',
            palletCount: 40,
            tareWeightDrum: 2.00,
            tareWeightPallet: 5.00,
            netWeight: 40000.00,
            grossWeight: 40520.00,
          },
        ],
        packing: '250KG PLASTIC DRUM',
        countryOfOrigin: 'THAILAND',
        makerName: 'SANYO KASEI (THAILAND) LTD.',
        packaging: '160 DRUMS (40 PALLETS)',
        lotNo: 'SN DISPERSANT 5040 : PA25060014 = 4,500 KGS, PA25080020 = 2,210 KGS',
      },
    },

    // =====================================================================
    // Commercial Invoice — SAVED (orange dot, editable)
    // =====================================================================
    [TabKey.COMMERCIAL_INVOICE]: {
      key: TabKey.COMMERCIAL_INVOICE,
      status: TabStatus.SAVED,
      isDirty: false,
      isLoading: false,
      errors: {},
      lastSavedAt: '2025-12-08T14:00:00Z',
      lastConfirmedAt: null,
      data: {
        date: '2025-12-08',
        invoiceNo: '1100082921',
        contractNo: 'C-2509155',
        poNo: 'PO-250268',
        proformaInvoiceNo: 'SKT06007/2025',
        payer: {
          name: 'AGE D\'OR PTE LTD',
          address: '25 BUKIT BATOK CRESCENT',
          address2: '#06-13 THE ELITIST',
          city: 'SINGAPORE',
          country: '658066',
          tel: '+65 6776 5228',
          attn: 'MS. POOI YEE',
        },
        consignee: {
          name: 'ATH CO., LTD',
          address: '53 QUANG TRUNG STREET',
          address2: '#17-02B PRIME CENTRE',
          address3: 'HAI BA TRUNG WARD',
          city: 'HANOI',
          country: 'VIETNAM',
          tel: '(848) 822 9362 - 3',
          taxId: '0101509379',
        },
        payment: 'T/T in advance',
        dueDate: '2025-01-04',
        feeder: 'KMTC BANGKOK V.2511N',
        vessel: 'KMTC BANGKOK V.2511N',
        from: 'LAEM CHABANG, THAILAND',
        to: 'HCM CITY, VIETNAM',
        etd: '2025-09-25',
        eta: '2025-09-27',
        items: [
          {
            id: uid(),
            marksAndNos: 'ATH CO LTD\nPO-250264\nHCMC - VIETNAM',
            descriptionOfGoods: 'SN DISPERSANT 5040',
            subDescription: 'SODIUM POLYACRYLATE',
            quantity: 40000.00,
            unitPrice: 0.92,
            amount: 36800.00,
            currency: 'US$',
          },
        ],
        totalDescription: '250KGX160DRUMS',
        cifValue: 36800.00,
        cifPort: 'HCM CITY, VIETNAM',
        fobValue: 36550.94,
        fobPort: 'LAEM CHABANG, THAILAND',
        oceanFreight: 160.00,
        insurance: 89.06,
        packing: '250KG PLASTIC DRUM',
        countryOfOrigin: 'THAILAND',
        makerName: 'SANYO KASEI (THAILAND) LTD.',
        packaging: '160 DRUMS (40 PALLETS)',
        lotNo: 'SN DISPERSANT 5040 : PA25060014 = 4,500 KGS, PA25080020 = 2,210 KGS',
        bankingDetail: {
          accountNo: '21-31080051 SANYO KASEI (THAILAND) LTD.',
          bankName: 'SUMITOMO MITSUI BANKING CORPORATION Bangkok Branch',
          address: '8th-10th Floor, Q.House Lumpini Building, South Sathorn, Tungmahamek, Sathorn, Bangkok 10120 THAILAND',
          swiftCode: 'SMBCTHBK',
        },
      },
    },

    // =====================================================================
    // Certificate of Origin — SAVED (orange dot)
    // =====================================================================
    [TabKey.CERTIFICATE_OF_ORIGIN]: {
      key: TabKey.CERTIFICATE_OF_ORIGIN,
      status: TabStatus.SAVED,
      isDirty: false,
      isLoading: false,
      errors: {},
      lastSavedAt: '2025-12-08T14:10:00Z',
      lastConfirmedAt: null,
      data: {
        date: '2025-12-08',
        totalWeight: '40,000 KGS (250KGX160DRUM)',
        containerCount: '2X20',
        containerType: '',
        productName: 'SN-DISPERSANT 5040',
        manufacturer: 'SANYO KASEI (THAILAND) LTD.',
        originCountry: 'THAILAND',
        invoiceNo: 'INVOICE NO.1100082921 (C-2509155)',
        contractNo: 'C-2509155',
        poNo: 'PO-250268',
      },
    },

    // =====================================================================
    // Packing Declaration — SAVED (orange dot)
    // =====================================================================
    [TabKey.PACKING_DECLARATION]: {
      key: TabKey.PACKING_DECLARATION,
      status: TabStatus.SAVED,
      isDirty: false,
      isLoading: false,
      errors: {},
      lastSavedAt: '2025-12-08T14:15:00Z',
      lastConfirmedAt: null,
      data: {
        date: '2025-12-08',
        refNo: '13/35',
        descriptionOfGoods: 'SN DISPERSANT 5040',
        packageType: 'DRUM',
        packageDimensions: '517MMx571×887MM',
        netWeight: 64000.00,
        netWeightUnit: 'KGS',
        totalDrums: 320,
        grossWeight: 70400.00,
        grossWeightUnit: 'KGS',
        invoiceNo: '1100081950',
        vesselName: 'KMTC TOKYO V.2511N',
        dateOfShipment: '2025-09-02',
        blNo: 'CKCOLCH0047440',
        declaration: 'THERE IS NO WOOD IN THE CONTAINER',
      },
    },

    // =====================================================================
    // Shipping Particular — DRAFT (grey outline, fully editable)
    // =====================================================================
    [TabKey.SHIPPING_PARTICULAR]: {
      key: TabKey.SHIPPING_PARTICULAR,
      status: TabStatus.DRAFT,
      isDirty: false,
      isLoading: false,
      errors: {},
      lastSavedAt: null,
      lastConfirmedAt: null,
      data: {
        bookingNo: '7265139390',
        blNo: 'CKCOLCH0047440',
        date: '2025-09-25',
        shipper: {
          name: 'SANYO KASEI (THAILAND) LTD.',
          address: '22 SOI SUKHUMVIT 42, SUKHUMVIT RD,',
          address2: 'PRAKANONG, KLONGTOEY,',
          city: 'BANGKOK 10110',
          country: 'THAILAND',
          tel: '+662-7121089 # 3',
          taxId: '0105540022288',
        },
        consignee: {
          name: 'ATH CO., LTD',
          address: '53 QUANG TRUNG STREET',
          address2: '#17-02B PRIME CENTRE',
          address3: 'HAI BA TRUNG WARD',
          city: 'HANOI',
          country: 'VIETNAM',
          tel: '(848) 822 9362 - 3',
          taxId: '0101509379',
          attn: 'MS. TRANG',
          email: 'huong.dao@csplegal.com',
        },
        notifyParty: {
          name: 'AGE D\'OR PTE LTD',
          address: '25 BUKIT BATOK CRESCENT',
          address2: '#06-13 THE ELITIST',
          city: 'SINGAPORE',
          country: '658066',
          tel: '+65 6776 5228',
          taxId: '198305357N',
          attn: 'MS. POOI YEE',
          email: 'poolyee@agedor.com.sg',
        },
        portOfReceipt: 'LAEM CHABANG, THAILAND',
        portOfLoading: 'LAEM CHABANG, THAILAND',
        feeder: 'KMTC BANGKOK V.2511N',
        vessel: 'KMTC BANGKOK V.2511N',
        etd: '2025-12-20',
        eta: '2025-12-26',
        containerType: 'CY',
        portOfDischarge: 'HCM CITY, VIETNAM',
        portOfDelivery: 'HCM CITY, VIETNAM',
        deliveryType: 'CY',
        shippingMark: {
          marks: ['ATH CO LTD', 'PO-250264', 'HCMC - VIETNAM'],
          packageDescription: '160 DRUMS (20 PALLETS)',
          fclContainer: '2 X 20',
          netWeight: 40000.00,
          grossWeight: 40520.00,
          cbm: 0.00,
          productDescription: 'SN-DISPERSANT 5040 (SODIUM POLYACRYLATE)',
          hsCode: '3906.90.20',
          countryOfOrigin: 'THAILAND',
          palletNote: 'TWENTY PALLETS ONLY',
        },
        containerSealNo: {
          mark: '',
          freightTerms: 'FREIGHT PREPAID',
          blType: 'SURRENDER B/L',
        },
      },
    },
  },
}

// ---------------------------------------------------------------------------
// Mock: Voided Document (สำหรับ test VOID state)
// ---------------------------------------------------------------------------
export const mockVoidedDocument = {
  ...mockDocumentDetail,
  id: 'doc-002',
  documentNo: 'SD-2025-002',
  status: DocumentStatus.VOID,
}
