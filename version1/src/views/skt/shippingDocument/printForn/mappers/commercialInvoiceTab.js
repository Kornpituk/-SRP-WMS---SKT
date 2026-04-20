import { formatNumber, formatDate } from '../utils/pdfmake-utils'
import {
  buildCommercialInvoiceRows,
  buildPackagingSummary,
  buildPackingNames,
} from '../../form/utils/packingDerived'

/**
 * commercialInvoiceMapper
 *
 * @param {object} formData
 * @param {object} options
 * @param {string} options.shippMode     - 'ocean' | 'air' | 'truck' | 'courier'
 * @param {string} options.target        - 'buyer' | 'customs'
 * @param {string[]} options.displayFields
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export default function commercialInvoiceMapper(formData, options = {}) {

  const {
    shippMode     = 'ocean',
    target        = 'buyer',
    displayFields = [],
  } = options

  const formItems = formData.items || []
  const packingItems = formData.packingItems || []

  const sourceItems = packingItems.length
    ? packingItems.map((item, idx) => ({
      ...item,
      unitPrice: formItems[idx]?.unitPrice ?? item.unitPrice,
      amount: formItems[idx]?.amount ?? item.amount,
    }))
    : formItems

  const items      = buildCommercialInvoiceRows(sourceItems)
  const totalQty   = items.reduce((s, i) => s + (i.quantity   || 0), 0)
  const totalAmount = items.reduce((s, i) => s + (i.amount    || 0), 0)
  const packingSummary = buildPackingNames(packingItems) || formData.packing
  const packagingSummary = buildPackagingSummary(packingItems) || formData.totalDescription || formData.packaging

  const currency = formData.amountCurrency || 'US$'

  // ─── helpers ──────────────────────────────────────────────────────────────

  function show(field) {
    if (target === 'buyer') {
      return displayFields.includes(field)
    }

    // customs
    if (field === 'lotNo') return displayFields.includes('lotNo')
    
    // 👇 เพิ่มบรรทัดนี้: ถ้าไม่ใช่ buyer (เป็น customs) ไม่ต้องแสดง note 
    // eslint-disable-next-line sonarjs/prefer-single-boolean-return
    if (field === 'note') return false 
    
    return true // field อื่น ๆ แสดงเสมอ
  }

  function hasValue(field) {
    return !!formData[field]
  }

  // ─── Shipping table label ตาม mode ────────────────────────────────────────
  function buildShippingTable() {
    const noVLine = {
      hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1 : 0,
      vLineWidth: (i, node) => (i === 0 || i === node.table.widths.length) ? 1 : 0,
    }

    let label1, label2
    if (shippMode === 'truck') {
      label1 = 'TRUCK'; label2 = 'CARRIER'
    } else if (shippMode === 'courier') {
      label1 = 'COURIER'; label2 = 'AWB NO.'
    } else if (shippMode === 'air') {
      label1 = 'FLIGHT'; label2 = 'CARRIER'
    } else {
      label1 = 'FEEDER'; label2 = 'VESSEL'
    }

    return {
      table: {
        widths: ['35%', '35%', '30%'],
        body: [
          [
            buildPair(label1, formData.feeder),
            buildPair(label2, formData.vessel),
            buildPair('ETD', formatDate(formData.etd)),
          ],
          [
            buildPair('FROM', formData.from),
            buildPair('TO', formData.to),
            buildPair('ETA', formatDate(formData.eta)),
          ],
        ],
      },
      layout: noVLine,
      margin: [0, 0, 0, 10],
    }
  }

  // ─── Pricing rows (CIF / FOB / FREIGHT / INSURANCE) ───────────────────────
  function buildPricingRows() {
    const rows = []
    const term = formData.pricingTerm || 'CIF'

    const normalizedMode = String(shippMode).toLowerCase()
    let modeLabel = `${shippMode.toUpperCase()} FREIGHT`

    if (['air', 'courier'].includes(normalizedMode)) modeLabel = 'AIR FREIGHT'
    if (normalizedMode === 'truck') modeLabel = 'INLAND FREIGHT'

    const addRow = (label, value) => {
      rows.push({
        columns: [
          { width: '*',    text: '' },
          { width: 160,    text: label },
          { width: 40,     text: currency,                  alignment: 'right' },
          { width: 80,     text: formatNumber(value || 0),  alignment: 'right' },
        ],
        margin: [0, 0, 0, 2],
      })
    }

    // CIF — แสดงเสมอ
    addRow(
      `${formData.cifType || 'CIF'} ${formData.cifPort || ''}`,
      formData.cifValue,
    )

    // FOB / FREIGHT / INSURANCE ตาม displayFields (buyer) หรือเสมอ (customs)
    if (show('FOB')) {
      addRow(
        `${formData.fobType || 'FOB'} ${formData.fobPort || ''}`,
        formData.fobValue,
      )
    }

    if (show('Freight')) {
      addRow(modeLabel, formData.oceanFreight)
    }

    if (show('Insurance') && term !== 'EXWORK') {
      addRow('INSURANCE', formData.insurance)
    }

    return rows
  }

  // ─── GOODS TABLE body rows ─────────────────────────────────────────────────
  const goodsBody = [
    // Header row 1
    // Header row 1
    [
      { text: 'MARKS & NOS', style: 'tableHeader', rowSpan: 2, alignment: 'center', margin: [0, 6, 0, 0] },
      { text: 'DESCRIPTION OF GOODS', style: 'tableHeader', rowSpan: 2, alignment: 'center', margin: [0, 6, 0, 0] },
      { text: `QUANTITY`, style: 'tableHeader', alignment: 'center' },
      { text: `UNIT PRICE`, style: 'tableHeader', alignment: 'center' },
      { text: `AMOUNT`, style: 'tableHeader', alignment: 'center' },
    ],

    // Header row 2 (ต้องมี content จริง)
    [
      {},
      {},
      { text: '(KGS)', style: 'tableHeader', alignment: 'center' },
      { text: `(${currency}/KGS)`, style: 'tableHeader', alignment: 'center' },
      { text: `(${currency})`, style: 'tableHeader', alignment: 'center' },
    ],

    // Data rows
    ...items.map(item => [
      buildMarksAndNos(item),
      buildDescription(item, show),
      { text: formatNumber(item.quantity),  alignment: 'right' },
      { text: formatNumber(item.unitPrice), alignment: 'right' },
      { text: item.amountText || formatNumber(item.amount), alignment: 'right' },
    ]),

    // Total row
    [
      { text: 'TOTAL', bold: true, colSpan: 2 },
      {},
      {
        alignment: 'right',
        stack: [
          { text: formatNumber(totalQty), bold: true },
          packagingSummary
            ? { text: `(${packagingSummary})`, fontSize: 8 }
            : null,
        ].filter(Boolean),
      },
      { text: '' },
      { text: formatNumber(totalAmount), alignment: 'right', bold: true },
    ],
  ]

  // ─── FOOTER fields ─────────────────────────────────────────────────────────
  const footerItems = [
    packingSummary
      ? buildFooterRow('PACKING :', packingSummary)          : null,
    packagingSummary
      ? buildFooterRow('PACKAGING :', packagingSummary)      : null,
    hasValue('countryOfOrigin')
      ? buildFooterRow('COUNTRY OF ORIGIN :', formData.countryOfOrigin) : null,
    hasValue('makerName')
      ? buildFooterRow('MAKER NAME :', formData.makerName)     : null,

    // LOT NO — แสดงตาม checkbox
    show('lotNo') && hasValue('lotNo')
      ? buildFooterRow('LOT NO. :', formData.lotNo, true)      : null,

    // HS CODE — ซ่อนถ้าไม่มีข้อมูล
    hasValue('hsCode')
      ? buildFooterRow('HS CODE :', formData.hsCode, true)     : null,

    // Note — แสดงตาม checkbox
    show('Note') && hasValue('note') && target === 'buyer'
      ? { text: `NOTE : ${formData.note}`, italics: true, margin: [0, 2, 0, 0] } : null,
  ].filter(Boolean)

  // ─── BANKING DETAIL ────────────────────────────────────────────────────────
  const banking = formData.bankingDetail || {}

  const bankingItems = [
    { columns: [ { width: 80, text: 'Account no. :' }, { width: '*', text: banking.accountNo || '' } ], margin: [0, 0, 0, 2] },
    { columns: [ { width: 80, text: 'Bank name :' },   { width: '*', text: banking.bankName  || '' } ], margin: [0, 0, 0, 2] },
    { columns: [ { width: 80, text: 'Address :' },     { width: '*', text: banking.address   || '' } ], margin: [0, 0, 0, 2] },
    { columns: [ { width: 80, text: 'Swift Code :' },  { width: '*', text: banking.swiftCode || '' } ], margin: [0, 0, 0, 2] },
  ]

  // ─── CONTENT ───────────────────────────────────────────────────────────────

  const content = [

    // TITLE
    { text: 'COMMERCIAL INVOICE', style: 'title', alignment: 'center', margin: [0, 0, 0, 10] },

    // REFERENCE — right aligned
    {
      columns: [
        { width: '*', text: '' },
        {
          width: 'auto',
          stack: [
            { text: formatDate(formData.date), alignment: 'left', margin: [0, 0, 0, 4] },
            { text: `INVOICE NO. : ${formData.invoiceNo || ''}${formData.contractNo ? ` (${formData.contractNo})` : ''}`, decoration: 'underline' },
            { text: `PO NO. : ${formData.poNo || ''}`, decoration: 'underline', margin: [0, 2, 0, 2] },
            hasValue('proformaInvoiceNo')
              ? { text: `PROFORMA INVOICE NO. : ${formData.proformaInvoiceNo}`, decoration: 'underline' }
              : null,
          ].filter(Boolean),
        },
      ],
      margin: [0, 0, 0, 14],
    },

    // PAYER | CONSIGNEE | PAYMENT + DUE DATE
    {
      table: {
        widths: ['30%', '35%', '35%'],
        body: [
          [
            { text: 'PAYER',     style: 'boxHeader' },
            { text: 'CONSIGNEE', style: 'boxHeader' },
            { text: 'PAYMENT',   style: 'boxHeader' },
          ],
          [
            buildSoldTo(formData),
            buildShipTo(formData),
            {
              rowSpan: 2,
              stack: [
                { text: formData.payment || '' },
                formData.dueDate
                  ? {
                    stack: [
                      { text: 'DUE DATE', style: 'boxHeader', margin: [0, 8, 0, 2] },
                      { text: formData.dueDate },
                    ],
                  }
                  : null,
              ].filter(Boolean),
            },
          ],
          [ {}, {}, {} ],
        ],
      },
      layout: {
        hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1 : 0,
        vLineWidth: () => 1,
      },
      margin: [0, 0, 0, 10],
    },

    // SHIPPING TABLE
    buildShippingTable(),

    // GOODS TABLE
    {
      table: {
        headerRows: 2,
        widths: ['22%', '28%', '14%', '16%', '20%'],
        body: goodsBody,
      },
      layout: {
        hLineWidth: (i, node) => {
          if (i === 0) return 1           // top
          if (i === 2) return 1           // หลัง header
          if (i === node.table.body.length) return 1
          
          return 0.5
        },

        vLineWidth: (i, node) => {
          return 1
        },

        // 👇 คุมเส้นแนวนอนระหว่าง header row 1 กับ 2
        hLineColor: (i, node) => {
          if (i === 1) return 'white'     // 👈 ซ่อนเส้นกลาง header
          
          return 'black'
        },
      },
      margin: [0, 0, 0, 6],
    },

    // PRICING ROWS (CIF / FOB / FREIGHT / INSURANCE)
    ...buildPricingRows(),

    // FOOTER
    { stack: footerItems, margin: [0, 10, 0, 0] },

    // BANK DETAILS
    {
      stack: [
        { text: 'BANK DETAILS', style: 'boxHeader', margin: [0, 10, 0, 6] },
        ...bankingItems,
      ],
      margin: [0, 0, 0, 0],
    },

    // SIGNATURE
    {
      columns: [
        // ── ซ้าย: NOTE (แสดงตาม displayFields) ──
        {
          width: '*',
          stack: [
            show('Note') && hasValue('note') && target === 'buyer'
              ? {
                stack: [
                  { text: 'NOTE :', bold: true, margin: [0, 0, 0, 4] },
                  { text: formData.note, italics: true },
                ],
                margin: [0, 20, 0, 0],
              }
              : { text: '' },
          ],
        },
 
        // ── ขวา: SIGNATURE ──
        {
          width: 'auto',
          alignment: 'center',
          margin: [0, 20, 0, 0],
          stack: [
            { text: 'SANYO KASEI (THAILAND) LTD.', bold: true, margin: [0, 0, 0, 30] },
            {
              canvas: [{
                type: 'line', x1: 0, y1: 0, x2: 180, y2: 0,
                lineWidth: 1, dash: { length: 4, space: 2 },
              }],
              margin: [20, 0, 0, 6],
            },
            { text: 'AUTHORISED SIGNATURE' },
          ],
        },
      ],
    },

  ]

  return {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 40],
    content,
    styles: {
      title: { fontSize: 10, bold: true },
      boxHeader: { bold: true, decoration: 'underline' },
      tableHeader: { bold: true, alignment: 'center', fontSize: 9 },
      textSub: { fontSize: 5 },
    },
    defaultStyle: {
      font: 'Arial',
      fontSize: 8,
      lineHeight: 1.3,
    },
  }
}

// ─── Shared helpers ────────────────────────────────────────────────────────────

function buildSoldTo(formData) {
  const p = formData.payer || {}
  
  return {
    stack: [
      p.name     ? { text: p.name, bold: true }               : null,
      p.address  || null,
      p.address2 || null,
      (p.city || p.country) ? `${p.city || ''} ${p.country || ''}`.trim() : null,
      p.tel  ? `TEL.: ${p.tel}`                               : null,
      p.attn ? { text: `ATTN : ${p.attn}`, bold: true }       : null,
    ].filter(Boolean),
  }
}

function buildShipTo(formData) {
  const c = formData.consignee || {}
  
  return {
    stack: [
      c.name     ? { text: c.name, bold: true }               : null,
      c.address  || null,
      c.address2 || null,
      c.address3 || null,
      (c.city || c.country) ? `${c.city || ''} – ${c.country || ''}`.trim() : null,
      c.tel   ? `TEL.: ${c.tel}`                              : null,
      c.taxId ? `TAX ID : ${c.taxId}`                        : null,
      c.attn  ? { text: `ATTN : ${c.attn}`, bold: true }      : null,
    ].filter(Boolean),
  }
}

function buildPair(label, value) {
  return { text: `${label} : ${value || ''}` }
}

function buildMarksAndNos(item) {
  const lines = (item.marksAndNos || '').split('\n').filter(Boolean)
  
  return lines.length > 1
    ? { stack: lines.map(l => ({ text: l })) }
    : { text: item.marksAndNos || '' }
}

function buildDescription(item, show) {
  const showSub = show ? show('productDescription') : true

  const sampleText = item.isSample && item.sampleDescription
    ? {
      text: `\n${item.sampleDescription}`,
      fontSize: 5,
      color: '#333333',
    }
    : ''

  return {
    text: [
      { text: item.descriptionOfGoods || '' },

      showSub && item.subDescription
        ? {
          text: `\n(${item.subDescription})`,
          fontSize: 5,        // 👈 ลดขนาดตรงนี้
          color: '#666666',   // (optional) ทำให้ดูเป็น sub
        }
        : '',
      sampleText,
    ],
  }
}

function buildFooterRow(label, value, highlight = false) {
  return {
    columns: [
      { width: 120, text: label },
      { width: '*',  text: value },
    ],
    margin: [0, 1, 0, 1],
  }
}

// function formatNumber(v) {
//   if (v == null || v === '') return ''
//   return Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
// }
