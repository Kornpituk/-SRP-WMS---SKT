
import {
  companyHeader,
  companyAddress,
  formatNumber,
  formatDate,
} from '../utils/pdfmake-utils'

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function packingListMapper(formData, target) {
  const items = formData.items || []
  const totalNet = items.reduce((sum, i) => sum + (i.netWeight || 0), 0)
  const totalGross = items.reduce((sum, i) => sum + (i.grossWeight || 0), 0)

  // สร้าง docDefinition ตาม target (อาจมีส่วนต่าง เช่น การแสดงข้อมูลเพิ่มเติม)
  const content = [
    companyHeader(),
    companyAddress(),
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },

    // หัวข้อ + วันที่
    {
      columns: [
        { text: 'PACKING LIST', style: 'title' },
        { text: formData.date || '', alignment: 'right', margin: [0, 6, 0, 0] },
      ],
      margin: [0, 10, 0, 5],
    },

    // เลขอ้างอิง
    {
      layout: 'noBorders',
      table: {
        widths: ['auto', '*', 'auto', '*'],
        body: [
          [
            { text: 'INVOICE NO. :', alignment: 'right', margin: [0, 2, 5, 2] },
            { text: (formData.invoiceNo || '') + (formData.contractNo ? ` (${formData.contractNo})` : ''), margin: [0, 2] },
            { text: 'PO NO :', alignment: 'right', margin: [0, 2, 5, 2] },
            { text: formData.poNo || '', margin: [0, 2] },
          ],
          [
            { text: 'PROFORMA INVOICE NO. :', alignment: 'right', margin: [0, 2, 5, 2] },
            { text: formData.proformaInvoiceNo || '', margin: [0, 2] },
            { text: '', margin: [0, 2] },
            { text: '', margin: [0, 2] },
          ],
        ],
      },
    },

    // Payer / Consignee
    {
      columns: [
        {
          width: '50%',
          stack: [
            { text: 'SOLD TO', style: 'subheader' },
            formData.payer?.name,
            formData.payer?.address,
            formData.payer?.address2,
            `${formData.payer?.city || ''} ${formData.payer?.country || ''}`.trim(),
            formData.payer?.tel ? `TEL.: ${formData.payer.tel}` : '',
            formData.payer?.attn ? `ATTN : ${formData.payer.attn}` : '',
          ].filter(Boolean),
        },
        {
          width: '50%',
          stack: [
            { text: 'SHIP TO', style: 'subheader' },
            formData.consignee?.name,
            formData.consignee?.address,
            formData.consignee?.address2,
            formData.consignee?.address3,
            `${formData.consignee?.city || ''} - ${formData.consignee?.country || ''}`.trim(),
            formData.consignee?.tel ? `TEL.: ${formData.consignee.tel}` : '',
            formData.consignee?.taxId ? `TAX ID : ${formData.consignee.taxId}` : '',
          ].filter(Boolean),
        },
      ],
      margin: [0, 10, 0, 10],
    },

    // Payment
    { text: `Payment : ${formData.payment || ''}`, margin: [0, 0, 0, 5] },

    // Shipping details
    {
      layout: 'noBorders',
      table: {
        widths: ['auto', '*', 'auto', '*', 'auto', '*'],
        body: [
          [
            { text: 'SHIPPED ON', bold: true, margin: [0, 2, 2, 2] },
            formData.vessel || '',
            { text: 'ON OR ABOUT', bold: true, margin: [0, 2, 2, 2] },
            formData.etd || '',
            '',
            '',
          ],
          [
            { text: 'FROM', bold: true, margin: [0, 2, 2, 2] },
            formData.from || '',
            { text: 'TO', bold: true, margin: [0, 2, 2, 2] },
            formData.to || '',
            { text: 'ETA', bold: true, margin: [0, 2, 2, 2] },
            formData.eta || '',
          ],
        ],
      },
    },

    // Items Table
    {
      style: 'itemsTable',
      table: {
        headerRows: 1,
        widths: ['20%', '30%', '20%', '15%', '15%'],
        body: [
          [
            { text: 'MARKS & NOS', style: 'tableHeader' },
            { text: 'DESCRIPTION OF GOODS', style: 'tableHeader' },
            { text: 'PACKAGE', style: 'tableHeader' },
            { text: 'NET WEIGHT (KGS)', style: 'tableHeader', alignment: 'right' },
            { text: 'GROSS WEIGHT (KGS)', style: 'tableHeader', alignment: 'right' },
          ],
          ...items.map(item => [
            item.marksAndNos || '',
            (item.descriptionOfGoods || '') + (item.subDescription ? `\n(${item.subDescription})` : ''),
            buildPackageDisplay(item),
            { text: formatNumber(item.netWeight), alignment: 'right' },
            { text: formatNumber(item.grossWeight), alignment: 'right' },
          ]),
          [
            { text: 'TOTAL', bold: true, colSpan: 3, alignment: 'left' },
            {},
            {},
            { text: formatNumber(totalNet), bold: true, alignment: 'right' },
            { text: formatNumber(totalGross), bold: true, alignment: 'right' },
          ],
        ],
      },
      margin: [0, 15, 0, 10],
    },
  ]

  // Footer fields (เฉพาะที่มีค่า)
  const footerFields = ['packing', 'countryOfOrigin', 'makerName', 'packaging', 'lotNo']

  footerFields.forEach(field => {
    if (formData[field]) {
      content.push({ text: `${field.replace(/([A-Z])/g, ' $1').toUpperCase()} : ${formData[field]}`, margin: [0, 2] })
    }
  })

  // Signature
  content.push({
    columns: [
      { width: '*', text: '' },
      {
        width: 'auto',
        stack: [
          { text: 'SANYO KASEI (THAILAND) LTD.', alignment: 'right', margin: [0, 20] },
          { text: 'AUTHORISED SIGNATURE', alignment: 'right', decoration: 'underline', margin: [0, 10] },
        ],
      },
    ],
  })

  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    content,
    styles: {
      companyName: { fontSize: 16, bold: true, margin: [0, 0, 0, 5] },
      address: { fontSize: 9, lineHeight: 1.2 },
      title: { fontSize: 18, bold: true, decoration: 'underline' },
      subheader: { fontSize: 11, bold: true, margin: [0, 5, 0, 2] },
      tableHeader: { bold: true, fillColor: '#eeeeee', margin: [4, 4, 4, 4] },
      itemsTable: { fontSize: 9 },
    },
    defaultStyle: {  fontSize: 10 }, // เปลี่ยนเป็นฟอนต์ที่ต้องการ
  }
}

// Helper ภายในไฟล์
function buildPackageDisplay(item) {
  const parts = []
  if (item.packageType) parts.push(item.packageType)
  if (item.quantity && item.unitType) {
    const pkg = item.palletCount
      ? `${item.quantity} ${item.unitType} (${item.palletCount} PALLETS)`
      : `${item.quantity} ${item.unitType}`

    parts.push(pkg)
  }
  
  return parts.join('\n')
}
