// print-templates/packing-list/customs.js
import { baseContent } from './base'
import { formatNumber } from '@/views/skt/shippingDocument/printForn/utils/pdfmake-utils'

export default async function customsTemplate(data) {
  const items = data.items || []
  const totalNet = items.reduce((sum, i) => sum + (i.netWeight || 0), 0)
  const totalGross = items.reduce((sum, i) => sum + (i.grossWeight || 0), 0)

  return {
    pageSize: 'A4',
    pageMargins: [59.52, 70.86, 36.85, 70.86],
    content: [
      ...baseContent(data),  // ใช้ base layout
      // ตารางสินค้า (customs ต้องการแสดงข้อมูลบางอย่างเพิ่มเติม?)
      itemsTable(items, totalNet, totalGross),

      // footer
      ...footerFields(data),
      signature(),
    ],
    styles: {
      companyName: { fontSize: 16, bold: true },
      tableHeader: { bold: true, fillColor: '#eee' },

      // ...
    },
    defaultStyle: { },  // ใช้ฟอนต์ไทย
  }
}

// ฟังก์ชันสร้างตารางสินค้า
function itemsTable(items, totalNet, totalGross) {
  return {
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
  }
}

function buildPackageDisplay(item) {
  // ... logic เหมือนเดิม
}
