import { formatNumber, formatDate } from '../utils/pdfmake-utils'

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function shippingParticularMapper(formData) {

  const shipper       = formData.shipper        || {}
  const consignee     = formData.consignee      || {}
  const notifyParty   = formData.notifyParty    || {}
  const mark          = formData.shippingMark   || {}
  const seal          = formData.containerSealNo || {}

  // ─── helpers ────────────────────────────────────────────────────────────────

  function partyStack(obj) {
    return [
      obj.name       ? { text: obj.name,                    bold: true }              : null,
      obj.address    ? { text: obj.address }                                          : null,
      obj.address2   ? { text: obj.address2 }                                         : null,
      obj.address3   ? { text: obj.address3 }                                         : null,
      (obj.city || obj.country)
        ? { text: [obj.city, obj.country].filter(Boolean).join(' – ') }               : null,
      obj.tel        ? { text: `TEL.: ${obj.tel}` }                                   : null,
      obj.taxId      ? { text: `TAX ID : ${obj.taxId}` }                              : null,
      obj.attn       ? { text: `ATTN : ${obj.attn}` }                                 : null,
      obj.email      ? { text: `E-MAIL : ${obj.email}` }                              : null,
    ].filter(Boolean)
  }

  // ─── content ────────────────────────────────────────────────────────────────

  function normalizeMultiline(text) {
    return (text || '')
      .split('\n')
      .map(line => ({ text: line }))
  }

  console.log("formData print", formData)

  const content = [

    // ── TITLE in bordered box ──────────────────────────────────────────────────
    {
      table: {
        widths: ['*'],
        body: [[
          {
            text: 'SHIPPING PARTICULAR',
            style: 'title',
            alignment: 'center',
            margin: [0, 6, 0, 6],
            border: [true, true, true, true],
          },
        ]],
      },
      layout: 'noBorders',
      margin: [60, 0, 60, 14],
    },

    // ── BOOKING NO / B/L NO / DATE row ────────────────────────────────────────
    {
      table: {
        widths: ['auto', 'auto', 'auto', '*', 'auto', 'auto'],
        body: [[
          { text: 'BOOKING NO.:',  border: [true, true, false, true], margin: [4, 4, 4, 4] },
          { text: formData.bookingNo || '', border: [false, true, true, true], margin: [4, 4, 16, 4] },
          { text: 'B/L NO.:', border: [true, true, false, true], margin: [4, 4, 4, 4] },
          { text: formData.blNo || '', border: [false, true, true, true], margin: [4, 4, 16, 4] },
          { text: 'DATE :', border: [true, true, false, true], margin: [4, 4, 4, 4] },
          { text: formatDate(formData.date) || '', border: [false, true, true, true], margin: [4, 4, 8, 4] },
        ]],
      },
      margin: [0, 0, 0, 12],
    },

    // ── SHIPPER ───────────────────────────────────────────────────────────────
    {
      columns: [
        {
          width: '55%',
          stack: [
            { text: 'SHIPPER', bold: true, decoration: 'underline', margin: [0, 0, 0, 2] },
            ...partyStack(shipper),
          ],
        },
        {
          width: '*',
          text: [
            'KINDLY ISSUE US, AT OUR REQUEST,\n',
            'SHIPPING ORDER OR B/L FOR THE\n',
            'FOLLOWING PARTICULAR:-',
          ],
          margin: [0, 14, 0, 0],
        },
      ],
      margin: [0, 0, 0, 10],
    },

    // ── CONSIGNEE ─────────────────────────────────────────────────────────────
    {
      stack: [
        { text: 'CONSIGNEE', bold: true, decoration: 'underline', margin: [0, 0, 0, 2] },
        ...partyStack(consignee),
      ],
      margin: [0, 0, 0, 10],
    },

    // ── NOTIFY PARTY ──────────────────────────────────────────────────────────
    {
      stack: [
        { text: 'NOTIFY PARTY', bold: true, decoration: 'underline', margin: [0, 0, 0, 2] },

        // Support both free-text textarea and structured object
        ...(
          typeof notifyParty.notifyParty === 'string'
            ? notifyParty.notifyParty
              .split('\n')
              .filter(line => line.trim() !== '')
              .map(line => ({
                text: line.trim(),
                margin: [0, 0, 0, 0], // 👈 สำคัญ
              }))
            : partyStack(notifyParty)
        ),
      ],
      margin: [0, 0, 0, 6],
    },

    // ── PORT OF LOADING ───────────────────────────────────────────────────────
    {
      columns: [
        { width: 100, text: 'PORT OF LOADING:', bold: true },
        { width: '*',  text: formData.portOfLoading || '' },
      ],
      margin: [0, 0, 0, 10],
    },

    // ── TRUCK / CARRIER + ETD / ETA ───────────────────────────────────────────
    {
      columns: [
        {
          width: '55%',
          stack: [
            {
              columns: [
                { width: 60, text: 'TRUCK :', bold: true },
                { width: '*', text: formData.feeder || '' },
              ],
              margin: [0, 0, 0, 2],
            },
            {
              columns: [
                { width: 60, text: 'CARRIER :', bold: true },
                { width: '*', text: formData.vessel || '' },
              ],
            },
          ],
        },
        {
          width: '*',
          stack: [
            {
              columns: [
                { width: 30, text: 'ETD :', bold: true },
                { width: '*', text: formatDate(formData.etd) || '' },
              ],
              margin: [0, 0, 0, 2],
            },
            {
              columns: [
                { width: 30, text: 'ETA :', bold: true },
                { width: '*', text: formatDate(formData.eta) || '' },
              ],
            },
          ],
        },
      ],
      margin: [0, 0, 0, 10],
    },

    // ── PORT / PORT OF DELIVERY ───────────────────────────────────────────────
    {
      stack: [
        {
          columns: [
            { width: 100, text: 'PORT :', bold: true },
            { width: '*',  text: formData.portOfDischarge || '' },
          ],
          margin: [0, 0, 0, 2],
        },
        {
          columns: [
            { width: 100, text: 'PORT OF DELIVERY :', bold: true },
            { width: '*',  text: [formData.portOfDelivery, formData.deliveryType || formData.containerType].filter(Boolean).join('   ') },
          ],
        },
      ],
      margin: [0, 0, 0, 14],
    },

    // ── SHIPPING MARK ─────────────────────────────────────────────────────────
    {
      columns: [
        // Left: label + mark lines
        {
          width: '35%',
          stack: [
            { text: 'SHIPPING MARK :', bold: true, decoration: 'underline', margin: [0, 0, 0, 6] },
            ...(mark.marks || []).map(m => ({ text: m, margin: [0, 0, 0, 2] })),
          ],
        },

        // Right: detail block
        {
          width: '*',
          stack: [

            // Row 1: package desc (header) | N.W. | G.W. | M3 (underlined headers)
            {
              columns: [
                { width: '*',  text: mark.packageDescription || '', margin: [0, 0, 0, 2] },
                { width: 'auto', text: 'N.W.', bold: false, decoration: 'underline', margin: [8, 0, 8, 2] },
                { width: 'auto', text: 'G.W.', bold: false, decoration: 'underline', margin: [8, 0, 8, 2] },
                { width: 'auto', text: 'M3',   bold: false, decoration: 'underline', margin: [8, 0, 0, 2] },
              ],
              margin: [0, 0, 0, 4],
            },

            // Row 2: FCL CONTAINER value | N.W. value | G.W. value | M3 value
            {
              columns: [
                {
                  width: '*',
                  text: [
                    { text: 'FCL CONTAINER :' },
                    { text: mark.fclContainer  },
                  ],
                  margin: [0, 0, 0, 2],
                },
                { width: 'auto', text: formatNumber(mark.netWeight),   alignment: 'right', margin: [8, 0, 8, 2] },
                { width: 'auto', text: formatNumber(mark.grossWeight),  alignment: 'right', margin: [8, 0, 8, 2] },
                { width: 'auto', text: formatNumber(mark.cbm, 2),       alignment: 'right', margin: [8, 0, 0, 2] },
              ],
              margin: [0, 0, 0, 4],
            },

            // Product description
            { text: mark.productDescription || '', margin: [0, 0, 0, 4] },

            // Extra note (dash or text)
            { text: mark.extraNote || '-', margin: [0, 0, 0, 4] },

            // HS CODE (colored)
            {
              text: [
                { text: 'HS CODE : ' },
                { text: mark.hsCode },
              ],
              margin: [0, 0, 0, 6],
            },

            // COUNTRY OF ORIGIN
            {
              columns: [
                { width: 'auto', text: 'COUNTRY OF ORIGIN :', bold: true, margin: [0, 0, 8, 4] },
                { width: '*',    text: mark.countryOfOrigin || 'THAILAND', margin: [0, 0, 0, 4] },
              ],
            },

            // Pallet note
            { text: mark.palletNote || '', margin: [0, 4, 0, 0] },
          ],
        },
      ],
      margin: [0, 0, 0, 14],
    },

    // ── CONTAINER & SEAL NO. ──────────────────────────────────────────────────
    {
      stack: [
        { text: 'CONTAINER & SEAL NO.:', bold: true, decoration: 'underline', margin: [0, 0, 0, 6] },

        // MARK: FREIGHT PREPAID  |  SURRENDER B/L (boxed)
        {
          columns: [
            {
              width: '*',
              text: [
                { text: 'MARK', decoration: 'underline' },
                { text: ' : ' },
                { text: seal.freightTerms || 'FREIGHT PREPAID' },
              ],
              margin: [0, 0, 0, 0],
            },
            {
              width: 'auto',
              table: {
                body: [[
                  {
                    text: seal.blType || 'SURRENDER B/L',
                    margin: [8, 4, 8, 4],
                    border: [true, true, true, true],
                  },
                ]],
              },
              layout: {
                hLineWidth: () => 1,
                vLineWidth: () => 1,
              },
            },
          ],
        },
      ],
    },

  ]

  // ─── document definition ──────────────────────────────────────────────────

  return {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 40],
    content,

    styles: {
      title: {
        fontSize: 14,
        bold: true,
      },
    },

    defaultStyle: {
      font: 'Arial',
      fontSize: 9.5,
      lineHeight: 1.1,
    },
  }
}
