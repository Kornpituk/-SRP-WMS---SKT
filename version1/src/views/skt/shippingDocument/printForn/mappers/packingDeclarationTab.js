import { formatNumber, formatDate } from '../utils/pdfmake-utils'

/**
 * packingDeclarationMapper
 *
 * @param {object} formData
 * @param {object} options
 * @param {string} options.shippMode     - 'ocean' | 'air' | 'truck' | 'courier'
 * @param {string} options.target        - 'buyer' | 'customs'
 * @param {string[]} options.displayFields
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export default function packingDeclarationMapper(formData, options = {}) {

  const {
    shippMode     = 'ocean',
    target        = 'buyer',
    displayFields = [],
  } = options

  // ─── label ตาม shippMode ──────────────────────────────────────────────────
  const vesselLabel = (() => {
    switch (shippMode) {
    case 'air':     return 'CARRIER'
    case 'truck':   return 'TRUCK'
    case 'courier': return 'COURIER'
    default:        return 'NAME OF VESSEL'   // ocean
    }
  })()

  console.log("Mode print", shippMode)

  // ─── helpers ──────────────────────────────────────────────────────────────
  function show(field) {
    if (target === 'buyer') return displayFields.includes(field)
    if (field === 'lotNo')  return displayFields.includes('lotNo')
    
    return true
  }

  function hasValue(field) {
    return !!formData[field]
  }

  const content = [

    // DATE — right aligned
    {
      text: formatDate(formData.date),
      alignment: 'right',
      margin: [0, 0, 0, 20],
    },

    // REF NO.
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

    // TITLE
    {
      text: 'PACKING DECLARATION',
      alignment: 'center',
      style: 'title',
      margin: [0, 0, 0, 4],
    },

    // SUBTITLE
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
          [
            { text: 'DESCRIPTION OF GOODS\nOR ITEM NO.', style: 'tableHeader', alignment: 'center' },
            { text: 'PACKAGE',      style: 'tableHeader', alignment: 'center' },
            { text: 'NET WEIGHT',   style: 'tableHeader', alignment: 'center' },
            { text: 'GROSS WEIGHT', style: 'tableHeader', alignment: 'center' },
          ],
          [
            {
              text: formData.descriptionOfGoods || '',
              alignment: 'center',
              margin: [4, 6, 4, 6],
            },
            {
              stack: [
                { text: formData.packageType || '', alignment: 'center', margin: [0, 4, 0, 4] },
                formData.packageDimensions
                  ? { text: `(${formData.packageDimensions})`, alignment: 'center', fontSize: 9 }
                  : null,
              ].filter(Boolean),
              margin: [4, 6, 4, 6],
            },
            {
              stack: [
                {
                  text: `${formatNumber(formData.netWeight)}  ${formData.netWeightUnit || 'KGS'}`,
                  alignment: 'center',
                },
                formData.totalDrums
                  ? { text: `(TOTAL=${formData.totalDrums} DRUMS)`, alignment: 'center', fontSize: 9 }
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
        hLineWidth: () => 1,
        vLineWidth: () => 1,
        hLineColor: () => '#000000',
        vLineColor: () => '#000000',
      },
      margin: [0, 0, 0, 20],
    },

    // SHIPMENT REFERENCE BLOCK
    {
      columns: [
        {
          width: 140,
          stack: [
            { text: 'INVOICE NO.',      margin: [0, 0, 0, 4] },
            { text: vesselLabel,         margin: [0, 0, 0, 4] },  // ← NAME OF VESSEL / CARRIER / TRUCK / COURIER
            { text: 'DATE OF SHIPMENT', margin: [0, 0, 0, 4] },
            { text: 'B/L NO.',          margin: [0, 0, 0, 4] },
          ],
        },
        {
          width: '*',
          stack: [
            { text: `: ${formData.invoiceNo || ''}`,                  margin: [0, 0, 0, 4] },
            { text: `: ${formData.vesselName || ''}`,                 margin: [0, 0, 0, 4] },
            { text: `: ${formatDate(formData.dateOfShipment) || ''}`, margin: [0, 0, 0, 4] },
            { text: `: ${formData.blNo || ''}`,                       margin: [0, 0, 0, 4] },
          ],
        },
      ],
      margin: [0, 0, 0, 40],
    },

    // NOTE — มุมซ้ายล่าง (ถ้า displayFields มี 'Note' และมีข้อมูล)
    show('Note') && hasValue('note')
      ? {
        stack: [
          { text: 'NOTE :', bold: true, margin: [0, 0, 0, 4] },
          { text: formData.note, italics: true },
        ],
        margin: [0, 0, 0, 16],
      }
      : null,

    // SIGNATURE — right aligned
    {
      columns: [
        { width: '*', text: '' },
        {
          width: 'auto',
          alignment: 'center',
          margin: [0, 0, 0, 0],
          stack: [
            { text: 'SANYO KASEI (THAILAND) LTD.', bold: true, margin: [0, 0, 0, 40] },
            {
              canvas: [{
                type: 'line', x1: 0, y1: 0, x2: 180, y2: 0,
                lineWidth: 1, dash: { length: 4, space: 2 },
              }],
              margin: [0, 0, 0, 8],
            },
            { text: 'AUTHORISED SIGNATURE' },
          ],
        },
      ],
    },

  ].filter(Boolean)

  return {
    pageSize: 'A4',
    pageMargins: [60, 60, 60, 60],
    content,
    styles: {
      title: { fontSize: 13, bold: true },
      tableHeader: { bold: true, fontSize: 10 },
    },
    defaultStyle: {
      font: 'Arial',
      fontSize: 10,
      lineHeight: 1.4,
    },
  }
}
