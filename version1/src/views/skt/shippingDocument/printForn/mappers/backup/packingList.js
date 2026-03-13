import { formatNumber, formatDate } from '../utils/pdfmake-utils'

export default function packingListMapper(formData) {

  const items = formData.items || []

  const totalNet = items.reduce((s, i) => s + (i.netWeight || 0), 0)
  const totalGross = items.reduce((s, i) => s + (i.grossWeight || 0), 0)

  const content = [

    // TITLE
    {
      text: 'PACKING LIST',
      alignment: 'center',
      style: 'title',
      margin: [0, 0, 0, 10],
    },

    // DATE
    {
      text: formatDate(formData.date),
      alignment: 'right',
      margin: [0, 0, 0, 5],
    },

    // REFERENCE
    {
      alignment: 'right',
      stack: [
        {
          text: `INVOICE NO : ${formData.invoiceNo || ''}`,
          decoration: 'underline',
        },
        {
          text: `PO NO : ${formData.poNo || ''}`,
          decoration: 'underline',
        },
        {
          text: `PROFORMA INVOICE NO : ${formData.proformaInvoiceNo || ''}`,
          decoration: 'underline',
        },
      ],
      margin: [0, 0, 0, 10],
    },

    // SOLD TO / SHIP TO / PAYMENT
    {
      table: {
        widths: ['40%', '40%', '20%'],
        body: [

          [
            { text: 'SOLD TO', style: 'boxHeader' },
            { text: 'SHIP TO', style: 'boxHeader' },
            { text: 'PAYMENT', style: 'boxHeader' },
          ],

          [
            buildSoldTo(formData),
            buildShipTo(formData),
            { text: formData.payment || '' },
          ],

        ],
      },
      margin: [0, 0, 0, 10],
    },

    // SHIPPING TABLE
    {
      table: {
        widths: ['50%', '50%'],
        body: [

          [
            buildPair('SHIPPED ON', formData.vessel),
            buildPair('ON OR ABOUT', formatDate(formData.etd)),
          ],

          [
            buildPair('FROM', formData.from),
            buildPair('TO', formData.to),
          ],

          [
            '',
            buildPair('ETA', formatDate(formData.eta)),
          ],

        ],
      },
      margin: [0, 0, 0, 10],
    },

    // GOODS TABLE
    {
      table: {
        headerRows: 3,
        widths: ['20%', '35%', '15%', '15%', '15%'],

        body: [

          [
            { text: 'MARKS', style: 'tableHeader', rowSpan: 3 },
            { text: 'DESCRIPTION', style: 'tableHeader', rowSpan: 3 },
            { text: 'PACKAGE', style: 'tableHeader', rowSpan: 3 },

            { text: 'NET', style: 'tableHeader' },
            { text: 'GROSS', style: 'tableHeader' },
          ],

          [
            {},
            {},
            {},
            { text: 'WEIGHT', style: 'tableHeader' },
            { text: 'WEIGHT', style: 'tableHeader' },
          ],

          [
            {},
            {},
            {},
            { text: '(KGS)', style: 'tableHeader' },
            { text: '(KGS)', style: 'tableHeader' },
          ],

          ...items.map(i => [
            i.marksAndNos || '',
            buildDescription(i),
            buildPackageDisplay(i),
            { text: formatNumber(i.netWeight), alignment: 'right' },
            { text: formatNumber(i.grossWeight), alignment: 'right' },
          ]),

          [
            { text: 'TOTAL', colSpan: 3, bold: true },
            {},
            {},
            { text: formatNumber(totalNet), alignment: 'right', bold: true },
            { text: formatNumber(totalGross), alignment: 'right', bold: true },
          ],
        ],
      },

      layout: {

        hLineWidth: function (i, node) {

          if (i === 0) return 1

          if (i === node.table.body.length) return 1

          if (i <= 3) return 0

          return 0.5
        },

        vLineWidth: function () {
          return 1
        },
      },
    },

    // SIGNATURE
    {
      margin: [0, 30, 0, 0],
      stack: [

        { text: `PACKING : ${formData.packing || ''}` },

        { text: `COUNTRY OF ORIGIN : ${formData.countryOfOrigin || ''}` },

        { text: `MAKER NAME : ${formData.makerName || ''}` },

        { text: `PACKAGING : ${formData.packaging || ''}` },

      ],
    },
    {
      alignment: 'right',
      stack: [

        {
          text: 'SANYO KASEI (THAILAND) LTD.',
          bold: true,
          margin: [0, 20, 0, 40],
        },

        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 200,
              y2: 0,
              lineWidth: 1,
            },
          ],
          margin: [0, 40, 0, 5], // ช่องเซ็นลายเซ็น
        },

        {
          text: 'AUTHORISED SIGNATURE',
        },

      ],
    },

  ]

  return {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 40],
    content,

    styles: {

      title: {
        fontSize: 16,
        bold: true,
      },

      boxHeader: {
        bold: true,
        decoration: 'underline',
      },

      tableHeader: {
        bold: true,
        alignment: 'center',
      },

    },

    defaultStyle: {
      fontSize: 10,
    },

  }
}


function buildSoldTo(formData) {

  const p = formData.payer || {}

  return {
    stack: [
      { text: p.name, bold: true },
      p.address,
      p.address2,
      `${p.city || ''} ${p.country || ''}`.trim(),
      p.tel ? `TEL : ${p.tel}` : '',
      p.attn ? { text: `ATTN : ${p.attn}`, bold: true } : '',
    ].filter(Boolean),
  }
}


function buildShipTo(formData) {

  const c = formData.consignee || {}

  return {
    stack: [
      { text: c.name, bold: true },
      c.address,
      c.address2,
      c.address3,
      `${c.city || ''} - ${c.country || ''}`.trim(),
      c.tel ? `TEL : ${c.tel}` : '',
      c.taxId ? `TAX ID : ${c.taxId}` : '',
      c.attn ? { text: `ATTN : ${c.attn}`, bold: true } : '',
    ].filter(Boolean),
  }
}


function buildPair(label, value) {

  return {
    columns: [
      { text: `${label} : `, bold: true },
      { text: value || '' },
    ],
  }

}


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


function buildDescription(item) {

  return [
    item.descriptionOfGoods,
    item.subDescription ? `(${item.subDescription})` : '',
  ]
    .filter(Boolean)
    .join('\n')
}
