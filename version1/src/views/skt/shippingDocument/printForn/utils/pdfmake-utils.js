import pdfMake from 'pdfmake/build/pdfmake'
import vfs from '@/assets/vfs_fonts'

pdfMake.vfs = vfs

pdfMake.fonts = {
  // Roboto: {
  //   normal: 'Roboto-Regular.ttf',
  //   bold: 'Roboto-Medium.ttf',
  //   italics: 'Roboto-Italic.ttf',
  //   bolditalics: 'Roboto-MediumItalic.ttf',
  // },
  Arial: {
    normal: 'ARIAL.TTF',
    bold: 'ARIALBD.TTF',
    italics: 'ARIALI.TTF',
    bolditalics: 'ARIALBI.TTF',
  },
}

export const formatNumber = (val, digits = 2) => {
  return (val ?? 0).toFixed(digits)
}

export function formatDate(date) {
  if (!date) return ''

  const d = new Date(date)

  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ]

  const day = d.getDate()
  const month = months[d.getMonth()]
  const year = d.getFullYear()

  return `${month} ${day}, ${year}`
}

// ฟังก์ชันอื่น ๆ ที่ใช้ร่วมกัน (เช่น สร้าง Header บริษัท)
export const companyHeader = () => ({
  columns: [
    { text: 'Sanyo Kasei (Thailand)', style: 'companyName' },
  ],
})

export const companyAddress = () => ({
  text: [
    'Bangkok Office:\n',
    '22 Soi Sukhumvit 42, Sukhumvit Rd., Prakanong, Klongtoey, Bangkok 10110 Thailand\n',
    'Tel: (02) 390-2061/86 Fax: (02) 712-2094  http://www.sanyo-kasei.co.th\n\n',
    'Rayong Factory:\n',
    'Rojana Industrial Park, Rayong, 5th Moo 11, Tambol Nongbua, Amphur Bankhai, Rayong 21120 Thailand\n',
    'Tel: (038) 627-0500 Fax: (038) 946-072  http://www.sanyo-kasei.co.th',
  ],
  style: 'address',
})
