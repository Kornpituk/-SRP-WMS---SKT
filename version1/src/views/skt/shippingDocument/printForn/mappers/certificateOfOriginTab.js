import { formatDate } from '../utils/pdfmake-utils'

export default function certificateOfOriginMapper(formData) {

  const content = [

    // DATE — top right
    {
      text: formatDate(formData.date),
      alignment: 'center',
      margin: [0, 0, 0, 20],
    },

    // TO : WHOM IT MAY CONCERN,
    {
      text: 'TO : WHOM IT MAY CONCERN,',
      alignment: 'left',
      margin: [0, 0, 0, 20],
    },

    // CERTIFICATE OF ORIGIN — centered title
    {
      text: 'CERTIFICATE OF ORIGIN',
      alignment: 'center',
      style: 'title',
      margin: [0, 0, 0, 30],
    },

    // THIS IS TO CERTIFY THAT TOTAL [totalWeight] IN [containerCount] ' CONTAINER
    {
      text: [
        'THIS IS TO CERTIFY THAT TOTAL ',
        { text: formData.totalWeight || '', decoration: 'underline' },
        ' IN ',
        { text: formData.containerCount || '', decoration: 'underline' },
        "\x27 CONTAINER",
      ],
      margin: [0, 0, 0, 4],
    },

    // OF [productName]
    {
      text: `OF ${formData.productName || ''}`,
      margin: [0, 0, 0, 4],
    },

    // MANUFACTURED BY ... ARE OF ... ORIGIN
    {
      text: `MANUFACTURED BY ${formData.manufacturer || ''} ARE OF ${formData.originCountry || ''} ORIGIN`,
      margin: [0, 0, 0, 20],
    },

    // REF. — label + invoice/contract + PO
    {
      columns: [
        {
          width: 60,
          text: 'REF.',
        },
        {
          width: '*',
          stack: [
            {
              text: `INVOICE NO.${formData.invoiceNo || ''}`,
              margin: [0, 0, 0, 4],
            },
            {
              text: `CONTRACT NO. ${formData.contractNo || ''}`,
              margin: [0, 0, 0, 4],
            },
            formData.poNo
              ? {
                text: `PO NO : ${formData.poNo}`,
                margin: [0, 0, 0, 0],
              }
              : null,
          ].filter(Boolean),
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
        fontSize: 14,
        bold: true,
      },
    },

    defaultStyle: {
      font: 'Arial',
      fontSize: 10,
      lineHeight: 1.4,
    },
  }
}
