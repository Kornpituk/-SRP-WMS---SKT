import { formatNumber, formatDate } from '../utils/pdfmake-utils'
import {
  buildSampleDescription,
  buildPackingNames,
  buildPackagingSummary,
  buildTotalGross,
  buildTotalNet,
  getItemTotalGross,
  getItemTotalNet,
} from '../../form/utils/packingDerived'

/**
 * packingListMapper
 *
 * @param {object} formData  - ข้อมูลจาก formData (PackingListTab)
 * @param {object} options
 * @param {string} options.shippMode        - 'ocean' | 'air' | 'truck' | 'courier'
 * @param {string} options.target        - 'buyer' | 'customs'
 * @param {string[]} options.displayFields - checkbox ที่ user เลือก เช่น ['lotNo','note']
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export default function packingListMapper(formData, options = {}) {

  const {
    tabKey       = '',
    shippMode    = '',
    target       = 'buyer',
    displayFields = [],
  } = options

  const items      = formData.items || []
  const totalNet   = buildTotalNet(items)
  const totalGross = buildTotalGross(items)
  const packingSummary = buildPackingNames(items) || formData.packing
  const packagingSummary = buildPackagingSummary(items) || formData.packaging

  // ─── helper: ควรแสดง field นี้ไหม ─────────────────────────────────────────
  // buyer  → แสดงเฉพาะ field ที่ user tick checkbox
  // customs→ แสดงทุก field ยกเว้น lotNo (lotNo แสดงเฉพาะเมื่อ tick)
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

  // ─── helper: แสดง field ก็ต่อเมื่อมีข้อมูลด้วย (ใช้กับ proforma / hsCode) ──
  function hasValue(field) {
    return !!formData[field]
  }

  // ─── REFERENCE block (top-right) ──────────────────────────────────────────
  // PROFORMA INVOICE NO. → ซ่อน label+value ถ้าไม่มีข้อมูล
  const refStack = [
    { text: formatDate(formData.date), alignment: 'left', margin: [0, 0, 0, 5] },

    {
      text: `INVOICE NO : ${formData.invoiceNo || ''}${formData.contractNo ? ` (${formData.contractNo})` : ''}`,
      decoration: 'underline',
      alignment: 'left',
    },

    {
      text: `PO NO : ${formData.poNo || ''}`,
      decoration: 'underline',
      alignment: 'left',
    },

    // ── #rule: ซ่อนถ้าไม่มีข้อมูล ──
    hasValue('proformaInvoiceNo') ? {
      text: `PROFORMA INVOICE NO : ${formData.proformaInvoiceNo}`,
      decoration: 'underline',
      alignment: 'left',
    } : null,

  ].filter(Boolean)

  // ─── SHIPPING TABLE rows ตาม tabKey ────────────────────────────────────────
  // ocean/air → SHIPPED ON / FROM / TO / ETA
  // truck     → TRUCK / FROM / TO
  // courier   → COURIER / FROM / TO
  function buildShippingTable() {

    // layout ไม่มีเส้นแนวตั้ง แต่ยังมีเส้นแนวนอนบน/ล่าง
    const noVLineLayout = {
      hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1 : 0,
      vLineWidth: (i, node) => (i === 0 || i === node.table.widths.length) ? 1 : 0,
    }

    let label = ''
    let label2 = ''

    console.log("shippMode in print", shippMode)
    
    if (shippMode === 'truck' || shippMode === 'courier') {
      label = shippMode === 'truck' ? 'TRUCK' : 'COURIER'
      label2 = shippMode === 'truck' ? 'CARRIER' : 'AWB NO.'
    } else{
      label = shippMode === 'ocean' ? 'FEEDER' : 'FIGHT'
      label2 = shippMode === 'ocean' ? 'VESSEL' : 'CARRIER'
    }

    // ocean / air
    return {
      table: {
        widths: ['35%', '35%', '30%'],
        body: [
          [
            buildPair(label, formData.feeder),
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
      layout: noVLineLayout,  // ← ใช้ layout ใหม่
      margin: [0, 0, 0, 10],
    }
  }


  // --------  GOODS TABLE Product Description
  function buildDescription(item, show) {
    const showSub = show ? show('productDescription') : true

    const sampleDescription = item.isSample
      ? `\n${buildSampleDescription(item)}`
      : ''

    //              ↑ ถ้าไม่ส่ง show เข้ามา → แสดงเสมอ (backward compat)

    return {
      text: [
        item.descriptionOfGoods || '',

        // แสดง subDescription เฉพาะเมื่อ show('productDescription') = true
        showSub && item.subDescription
          ? `\n(${item.subDescription})`
          : '',
        sampleDescription,
      ].join(''),
    }
  }

  // ─── FOOTER fields ─────────────────────────────────────────────────────────
  // HS CODE → ซ่อน label+value ถ้าไม่มีข้อมูล
  // lotNo, productDescription, note → แสดงตาม show()
  const footerItems = [

    packingSummary
      ? { text: `PACKING : ${packingSummary}` }
      : null,

    hasValue('countryOfOrigin')
      ? { text: `COUNTRY OF ORIGIN : ${formData.countryOfOrigin}` }
      : null,

    hasValue('makerName')
      ? { text: `MAKER NAME : ${formData.makerName}` }
      : null,

    packagingSummary
      ? { text: `PACKAGING : ${packagingSummary}` }
      : null,

    // ── #rule: lotNo → แสดงตาม checkbox ──
    show('lotNo') && hasValue('lotNo')
      ? { text: `LOT NO : ${formData.lotNo}`, margin: [0, 2, 0, 0] }
      : null,

    // ── #rule: HS CODE ซ่อนถ้าไม่มีข้อมูล ──
    hasValue('hsCode')
      ? { text: `HS CODE : ${formData.hsCode}`, margin: [0, 2, 0, 0] }
      : null,


    // ── #rule: productDescription → buyer checkbox / customs always ──
    show('productDescription') && hasValue('productDescription')
      ? { text: formData.productDescription, margin: [0, 2, 0, 0] }
      : null,

    // ── #rule: note → buyer checkbox / customs always ──
    // show('note') && hasValue('note')
    //   ? { text: `NOTE : ${formData.note}`, italics: true, margin: [0, 2, 0, 0] }
    //   : null,

  ].filter(Boolean)

  // ─── CONTENT ───────────────────────────────────────────────────────────────

  const content = [

    // TITLE
    {
      text: 'PACKING LIST',
      alignment: 'center',
      style: 'title',
      margin: [0, 0, 0, 10],
    },

    // REFERENCE (date + invoice + po + proforma?)
    {
      columns: [
        { width: '*', text: '' },
        { width: 'auto', stack: refStack },
      ],
      margin: [0, 0, 0, 10],
    },

    // SOLD TO / SHIP TO / PAYMENT
    {
      table: {
        widths: ['30%', '30%', '40%'],
        body: [
          [
            { text: 'SOLD TO',  style: 'boxHeader' },
            { text: 'SHIP TO',  style: 'boxHeader' },
            { text: 'PAYMENT',  style: 'boxHeader' },
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

    // SHIPPING TABLE (ต่างกันตาม tabKey)
    buildShippingTable(),

    // GOODS TABLE
    {
      table: {
        headerRows: 3,
        widths: ['30%', '30%', '12%', '13%', '15%'],
        body: [
          [
            { text: 'MARKS & NOS',          style: 'tableHeader', rowSpan: 3, alignment: 'center', margin: [0, 12, 0, 0] },
            { text: 'DESCRIPTION OF GOODS', style: 'tableHeader', rowSpan: 3, alignment: 'center', margin: [0, 12, 0, 0] },
            { text: 'PACKAGE',              style: 'tableHeader', rowSpan: 3, alignment: 'center', margin: [0, 12, 0, 0] },
            { text: 'NET',   style: 'tableHeader' },
            { text: 'GROSS', style: 'tableHeader' },
          ],
          [ {}, {}, {}, { text: 'WEIGHT', style: 'tableHeader' }, { text: 'WEIGHT', style: 'tableHeader' } ],
          [ {}, {}, {}, { text: '(KGS)',  style: 'tableHeader' }, { text: '(KGS)',  style: 'tableHeader' } ],

          ...items.map(i => [
            buildMarksAndNos(i),
            buildDescription(i, show),   // ← เพิ่ม show
            buildPackageDisplay(i),
            { text: formatNumber(getItemTotalNet(i)),   alignment: 'right' },
            { text: formatNumber(getItemTotalGross(i)), alignment: 'right' },
          ]),

          [
            { text: 'TOTAL', colSpan: 3, bold: true },
            {},
            {},
            { text: formatNumber(totalNet),   alignment: 'right', bold: true },
            { text: formatNumber(totalGross), alignment: 'right', bold: true },
          ],
        ],
      },
      layout: {
        hLineWidth: (i, node) => {
          if (i === 0) return 1
          if (i === 1 || i === 2) return 0
          if (i === 3) return 1
          if (i === node.table.body.length) return 1
          
          return 0.5
        },
        vLineWidth: () => 1,
      },
    },

    // FOOTER
    {
      margin: [0, 16, 0, 0],
      stack: footerItems,
    },

    // SIGNATURE
    {
      columns: [
        // ── ซ้าย: NOTE (แสดงตาม displayFields) ──
        {
          width: '*',
          stack: [
            show('note') && hasValue('note')
              ? {
                stack: [
                  { text: 'NOTE :', bold: true },
                  { text: formData.note, italics: true },
                ],
                margin: [0, 10, 0, 0], // 👈 คุม spacing ที่ block แทน
              }
              : null,
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
              margin: [0, 0, 0, 6],
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
      title: { fontSize: 16, bold: true },
      boxHeader: { bold: true, decoration: 'underline' },
      tableHeader: { bold: true, alignment: 'center' },
    },
    defaultStyle: {
      font: 'Arial',
      fontSize: 9.5,
    },
  }
}

// ─── Shared helpers ────────────────────────────────────────────────────────────

function simpleLayout() {
  return {
    hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1 : 0,
    vLineWidth: () => 1,
  }
}

function buildSoldTo(formData) {
  const p = formData.payer || {}
  
  return {
    stack: [
      p.name    ? { text: p.name, bold: true } : null,
      p.address  || null,
      p.address2 || null,
      (p.city || p.country) ? `${p.city || ''} ${p.country || ''}`.trim() : null,
      p.tel  ? `TEL : ${p.tel}`              : null,
      p.attn ? { text: `ATTN : ${p.attn}`, bold: true } : null,
    ].filter(Boolean),
  }
}

function buildShipTo(formData) {
  const c = formData.consignee || {}
  
  return {
    stack: [
      c.name    ? { text: c.name, bold: true } : null,
      c.address  || null,
      c.address2 || null,
      c.address3 || null,
      (c.city || c.country) ? `${c.city || ''} - ${c.country || ''}`.trim() : null,
      c.tel   ? `TEL : ${c.tel}`               : null,
      c.taxId ? `TAX ID : ${c.taxId}`          : null,
      c.attn  ? { text: `ATTN : ${c.attn}`, bold: true } : null,
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

function buildPackageDisplay(item) {
  const parts = []
  if (item.packageType) parts.push(item.packageType)
  if (item.quantity && item.unitType) {
    parts.push(
      item.palletCount
        ? `${item.quantity} ${item.unitType} (${item.palletCount} PALLETS)`
        : `${item.quantity} ${item.unitType}`,
    )
  }
  
  return { text: parts.join('\n') }
}

function buildDescription(item) {
  const sampleDescription = item.isSample
    ? `\n${buildSampleDescription(item)}`
    : ''

  return {
    text: [
      item.descriptionOfGoods || '',
      item.subDescription ? `\n(${item.subDescription})` : '',
      sampleDescription,
    ].join(''),
  }
}
