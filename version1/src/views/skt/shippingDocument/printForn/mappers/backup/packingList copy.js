import {
  formatNumber,
  formatDate,
} from '../utils/pdfmake-utils'

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function packingListMapper(formData, target) {

  const items = formData.items || []

  const totalNet = items.reduce((sum, i) => sum + (i.netWeight || 0), 0)
  const totalGross = items.reduce((sum, i) => sum + (i.grossWeight || 0), 0)

  const content = [

    // TITLE
    {
      text: 'PACKING LIST',
      alignment: 'center',
      style: 'title',
      margin: [0, 0, 0, 10],
    },

    // DATE + REF
    {
      alignment: 'right',
      stack: [
        formatDate(formData.date),
        { text: `INVOICE NO. : ${formData.invoiceNo || ''} ${formData.contractNo ? `(${formData.contractNo})` : ''}` },
        { text: `PO NO : ${formData.poNo || ''}` },
        { text: `PROFORMA INVOICE NO. : ${formData.proformaInvoiceNo || ''}` },
      ],
      margin: [0, 0, 0, 10],
    },

    // SOLD TO / SHIP TO / PAYMENT
    {
      table: {
        widths: ['33%', '33%', '34%'],
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

    // SHIPPING
    {
      table: {
        widths: ['50%', '50%'],
        body: [

          [
            {
              columns: [
                { text: 'SHIPPED ON : ', bold: true },
                { text: formData.vessel || '' },
              ],
            },
            {
              columns: [
                { text: 'ON OR ABOUT : ', bold: true },
                { text: formatDate(formData.etd) },
              ],
            },
          ],

          [
            {
              columns: [
                { text: 'FROM : ', bold: true },
                { text: formData.from || '' },
              ],
            },
            {
              columns: [
                { text: 'TO : ', bold: true },
                { text: formData.to || '' },
              ],
            },
          ],

          [
            '',
            {
              columns: [
                { text: 'ETA : ', bold: true },
                { text: formatDate(formData.eta) },
              ],
            },
          ],

        ],
      },
      margin: [0, 0, 0, 10],
    },

    // ITEMS TABLE
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

    // PACKING SUMMARY
    {
      columns: [

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
        margin: [0, 2, 0, 4],
      },

      tableHeader: {
        bold: true,
        alignment: 'center',
        margin: [4, 4, 4, 4],
      },

      itemsTable: {
        fontSize: 9,
      },

    },

    defaultStyle: {
      fontSize: 10,
    },

  }
}


function buildSoldTo(formData) {

  const payer = formData.payer || {}

  return {
    stack: [
      payer.name,
      payer.address,
      payer.address2,
      `${payer.city || ''} ${payer.country || ''}`.trim(),
      payer.tel ? `TEL : ${payer.tel}` : '',
      payer.attn ? `ATTN : ${payer.attn}` : '',
    ].filter(Boolean),
  }

}

function buildShipTo(formData) {

  const c = formData.consignee || {}

  return {
    stack: [
      c.name,
      c.address,
      c.address2,
      c.address3,
      `${c.city || ''} - ${c.country || ''}`.trim(),
      c.tel ? `TEL : ${c.tel}` : '',
      c.taxId ? `TAX ID : ${c.taxId}` : '',
      c.attn ? `ATTN : ${c.attn}` : '',
    ].filter(Boolean),
  }

}

function buildFooterField(label, value) {

  if (!value) return null

  return {
    text: `${label} : ${value}`,
    margin: [0, 2],
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

