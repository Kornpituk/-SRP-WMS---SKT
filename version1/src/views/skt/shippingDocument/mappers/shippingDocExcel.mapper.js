// mappers/shippingDocExcel.mapper.js

// mappers/shippingDocExcel.mapper.js

export function mapTableToExcel(items, headers, pagination) {
  const exportableHeaders = headers
    .filter(h => h.exportable !== false)
    .filter(h => h.key !== 'actions')

  const titleCounts = exportableHeaders.reduce((counts, h) => {
    counts[h.title] = (counts[h.title] ?? 0) + 1

    return counts
  }, {})

  const exportTitle = h => titleCounts[h.title] > 1 ? `${h.title} (${h.key})` : h.title

  const rows = items.map((item, index) => {
    const row = {}

    exportableHeaders.forEach(h => {
      const title = exportTitle(h)

      if (h.key === 'no') {
        row[title] = (pagination.page - 1) * pagination.itemsPerPage + index + 1
      } else {
        row[title] = item[h.key] ?? ''
      }
    })
    
    return row
  })

  // alignMap
  const alignMap = {}

  exportableHeaders.forEach(h => {
    alignMap[exportTitle(h)] = h.align === 'end' ? 'right'
      : h.align === 'center' ? 'center'
        : 'left'
  })

  // colWidths
  const colWidths = exportableHeaders.map(h => {
    const contentMax = rows.reduce((max, row) => {
      return Math.max(max, String(row[exportTitle(h)] ?? '').length)
    }, 0)

    const auto = Math.max(contentMax, h.title.length) + 2
    const min  = h.minWidth ?? 8
    const max  = h.maxWidth ?? 40
    
    return { wch: Math.min(Math.max(auto, min), max) }
  })

  // ✅ numberFormatMap — อ่านจาก decimal config
  const numberFormatMap = {}

  exportableHeaders.forEach(h => {
    if (h.decimal !== undefined) {
      // สร้าง format string เช่น decimal: 2 → '0.00', decimal: 0 → '0'
      const decimals   = '0'.repeat(h.decimal)
      const formatStr  = h.decimal > 0 ? `#,##0.${decimals}` : '#,##0'

      numberFormatMap[exportTitle(h)] = formatStr
    }
  })

  return { rows, alignMap, colWidths, numberFormatMap }
}

import { saveAs } from 'file-saver'
import dayjs from 'dayjs'
import XLSXStyle from 'xlsx-js-style'

// eslint-disable-next-line sonarjs/cognitive-complexity
export function exportToExcelWithHeader(rows, fileName = 'export.xlsx', options = {}) {
  const {
    company          = 'Sanyo Kasei (Thailand)',
    title            = 'List of Shipping Doc',
    department       = '-',
    alignMap         = {},
    colWidths        = [],
    numberFormatMap  = {},   // ✅ รับเข้ามา
  } = options

  const ws = XLSXStyle.utils.json_to_sheet([])
  const dateStr = dayjs().format('DD/MM/YYYY')

  // ✅ แยก col A และ B สำหรับ row 3
  const headerRows = [
    [company],
    [`${title}   Department : ${department}`],
    ['Printed Date : ', dateStr],   // ← แยกเป็น A3, B3
    [],
  ]

  XLSXStyle.utils.sheet_add_aoa(ws, headerRows, { origin: 'A1' })

  // ✅ A1, A2 → Bold
  ;['A1', 'A2'].forEach(ref => {
    if (ws[ref]) ws[ref].s = { font: { bold: true } }
  })

  // ✅ A3 "Printed Date : " → Bold สีปกติ
  if (ws['A3']) {
    ws['A3'].s = { font: { bold: true } }
  }

  // ✅ B3 วันที่ → Bold + สีแดง
  if (ws['B3']) {
    ws['B3'].s = { font: { bold: true, color: { rgb: 'FF0000' } } }
  }

  // ── Data rows ──────────────────────────────────────────
  const dataStartRow = headerRows.length + 1  // = 5

  XLSXStyle.utils.sheet_add_json(ws, rows, {
    origin: `A${dataStartRow}`,
    skipHeader: false,
  })

  if (rows.length > 0) {
    const colKeys = Object.keys(rows[0])

    colKeys.forEach((key, colIndex) => {
      // Header cell
      const headerCellRef = XLSXStyle.utils.encode_cell({ r: dataStartRow - 1, c: colIndex })
      if (ws[headerCellRef]) {
        ws[headerCellRef].s = {
          font: { bold: true },
          alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
        }
      }

      // Data cells
      rows.forEach((_, rowIndex) => {
        const dataCellRef = XLSXStyle.utils.encode_cell({ r: dataStartRow + rowIndex, c: colIndex })
        if (ws[dataCellRef]) {
          ws[dataCellRef].s = {
            alignment: {
              horizontal: alignMap[key] ?? 'left',
              vertical: 'center',
            },
          }

          // ✅ ใส่ number format ถ้า column นี้มี decimal config
          if (numberFormatMap[key]) {
            ws[dataCellRef].z = numberFormatMap[key]
            ws[dataCellRef].t = 'n'   // บอก xlsx ว่าเป็น number type
          }
        }
      })
    })
  }

  if (colWidths.length) ws['!cols'] = colWidths

  const wb = XLSXStyle.utils.book_new()

  XLSXStyle.utils.book_append_sheet(wb, ws, 'Sheet1')

  const buffer = XLSXStyle.write(wb, { bookType: 'xlsx', type: 'array' })

  saveAs(new Blob([buffer]), fileName)
}
