import { formatNumber, formatDate } from '../utils/pdfmake-utils'

export default function packingDeclarationMapper(formData) {

  const content = [

    // DATE — right aligned
    {
      text: formatDate(formData.date),
      alignment: 'right',
      margin: [0, 0, 0, 20],
    },

    // REF NO. — left aligned
    {
      text: `REF.NO. ${formData.refNo || ''}`,
      alignment: 'left',
      margin: [0, 0, 0, 4],
    },

    // TO WHOM IT MAY CONCERN
    {
      text: 'TO   WHOM IT MAY CONCERN :',
      alignment: 'left',
      margin: [0, 0, 0, 20],
    },

    // TITLE — centered bold
    {
      text: 'PACKING DECLARATION',
      alignment: 'center',
      style: 'title',
      margin: [0, 0, 0, 4],
    },

    // SUBTITLE — centered
    {
      text: '(THERE IS NO WOOD IN THE CONTAINER)',
      alignment: 'center',
      margin: [0, 0, 0, 16],
    },

    // GOODS TABLE
    {
      table: {
        headerRows: 1,
        widths: ['30%', '28%', '22%', '20%'],
        body: [
          // Header row
          [
            {
              text: 'DESCRIPTION OF GOODS\nOR ITEM NO.',
              style: 'tableHeader',
              alignment: 'center',
            },
            {
              text: 'PACKAGE',
              style: 'tableHeader',
              alignment: 'center',
            },
            {
              text: 'NET WEIGHT',
              style: 'tableHeader',
              alignment: 'center',
            },
            {
              text: 'GROSS WEIGHT',
              style: 'tableHeader',
              alignment: 'center',
            },
          ],

          // Data row
          [
            {
              text: formData.descriptionOfGoods || '',
              alignment: 'center',
              margin: [4, 6, 4, 6],
            },
            {
              stack: [
                {
                  text: formData.packageType || '',
                  alignment: 'center',
                  margin: [0, 4, 0, 4],
                },
                {
                  text: formData.packageDimensions
                    ? `(${formData.packageDimensions})`
                    : '',
                  alignment: 'center',
                  fontSize: 9,
                },
              ],
              margin: [4, 6, 4, 6],
            },
            {
              stack: [
                {
                  text: `${formatNumber(formData.netWeight)}  ${formData.netWeightUnit || 'KGS'}`,
                  alignment: 'center',
                },
                formData.totalDrums
                  ? {
                    text: `(TOTAL=${formData.totalDrums} DRUMS)`,
                    alignment: 'center',
                    fontSize: 9,
                  }
                  : null,
              ].filter(Boolean),
              margin: [4, 6, 4, 6],
            },
            {
              text: `${formatNumber(formData.grossWeight)}  ${formData.grossWeightUnit || 'KGS'}`,
              alignment: 'center',
              margin: [4, 6, 4, 6],
            },
          ],
        ],
      },

      layout: {
        // eslint-disable-next-line sonarjs/no-all-duplicated-branches
        hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 1 : 1),
        vLineWidth: () => 1,
        hLineColor: () => '#000000',
        vLineColor: () => '#000000',
      },

      margin: [0, 0, 0, 20],
    },

    // SHIPMENT REFERENCE BLOCK
    {
      columns: [
        // Labels column
        {
          width: 120,
          stack: [
            { text: 'INVOICE NO.', margin: [0, 0, 0, 4] },
            { text: 'NAME OF VESSEL', margin: [0, 0, 0, 4] },
            { text: 'DATE OF SHIPMENT', margin: [0, 0, 0, 4] },
            { text: 'B/L NO.', margin: [0, 0, 0, 4] },
          ],
        },

        // Values column
        {
          width: '*',
          stack: [
            { text: `: ${formData.invoiceNo || ''}`, margin: [0, 0, 0, 4] },
            { text: `: ${formData.vesselName || ''}`, margin: [0, 0, 0, 4] },
            { text: `: ${formatDate(formData.dateOfShipment) || ''}`, margin: [0, 0, 0, 4] },
            { text: `: ${formData.blNo || ''}`, margin: [0, 0, 0, 4] },
          ],
        },
      ],
      margin: [0, 0, 0, 60],
    },

    // SIGNATURE BLOCK — right aligned
    {
      columns: [

        { width: '*', text: '' }, // spacer ด้านซ้าย

        {
          width: 'auto',
          alignment: 'center',
          margin: [0, 0, 0, 80],
          stack: [
            {
              text: 'SANYO KASEI (THAILAND) LTD.',
              bold: true,
              margin: [0, 0, 0, 40],
            },
            {
              canvas: [
                {
                  type: 'line',
                  x1: 0,
                  y1: 0,
                  x2: 180,
                  y2: 0,
                  lineWidth: 1,
                  dash: { length: 4, space: 2 },
                },
              ],
              margin: [0, 0, 0, 8],
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
    pageMargins: [60, 60, 60, 60],
    content,

    styles: {
      title: {
        fontSize: 13,
        bold: true,
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
      },
    },

    defaultStyle: {
      fontSize: 10,
      lineHeight: 1.4,
    },
  }
}
