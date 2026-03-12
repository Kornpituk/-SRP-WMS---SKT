// print-templates/packing-list/base.js
import { formatNumber, formatDate } from '@/views/skt/shippingDocument/printForn/utils/pdfmake-utils'

export function baseContent(data) {
  return [
    // ส่วนหัวบริษัท (เหมือนกันทุกรูปแบบ)
    companyHeader(),

    // เส้นคั่น
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },

    // หัวข้อเอกสาร (จะ Override ในแต่ละเทมเพลต)
    documentTitle(data),

    // ข้อมูลอ้างอิง (invoice no, po no)
    referenceInfo(data),

    // ฝั่ง payer / consignee
    partyInfo(data),

    // การชำระเงิน
    paymentInfo(data),

    // รายละเอียดการขนส่ง
    shippingInfo(data),
  ]
}

export function companyHeader() {
  return {
    columns: [
      { text: 'Sanyo Kasei (Thailand)', style: 'companyName' },
    ],
  }
}

// ... ฟังก์ชันอื่น ๆ
