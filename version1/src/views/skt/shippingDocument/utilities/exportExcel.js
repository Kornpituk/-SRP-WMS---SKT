// utils/exportExcel.js
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export function exportToExcel(data, fileName = 'export.xlsx') {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(wb, ws, 'Data')

  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })

  saveAs(new Blob([buffer]), fileName)
}
