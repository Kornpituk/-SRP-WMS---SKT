

import { urlApi } from '@/api'
import axios from '@axios'

export async function generate(poEtlLogDetailJournalID) {
  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  await axios.post(`${urlApi.value}/api/v1/LorryFormNpan/generate?poEtlLogDetailJournalID=${poEtlLogDetailJournalID}`, [], {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
}

export async function get(poEtlLogDetailJournalID) {
  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  return await axios.get(`${urlApi.value}/api/v1/LorryFormNpan/get/${poEtlLogDetailJournalID}`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
}

export async function save(poEtlLogDetailJournalIDQueryParameters, ipaRequestData) {
  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  // eslint-disable-next-line sonarjs/prefer-immediate-return
  var response =  await axios.post(`${urlApi.value}/api/v1/LorryFormNpan/save/${poEtlLogDetailJournalIDQueryParameters.value}`, ipaRequestData.value, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
  
  return response
}

export async function GetByPoEtlLogDetailJournalID(poEtlLogDetailJournalIDQueryParameters) {
  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  return await axios.get(`${urlApi.value}/api/v1/ReceivingPlan/GetByPoEtlLogDetailJournalID/${poEtlLogDetailJournalIDQueryParameters}`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
}

export function currencyFormat(number) {
  return new Intl.NumberFormat("th-TH", {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number)
}


export function mm2litre(mm) {
  let litre = mm * 5.32 + 740.45

  return litre.toFixed(2)
}

//----------------- Formate
export function formatDate(dateString) {
  if (dateString === null || dateString === '' || dateString === undefined) {
    return 'Null'
  } else if (dateString.length > 0) {
    const date = new Date(dateString) // แปลงสตริงเป็นวัตถุ Date
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0') // เดือนเริ่มต้นที่ 0, ดังนั้นต้อง +1
    const year = date.getFullYear()

    return `${day}/${month}/${year}`

  }

  return 'null'
}

export function passInitialData(type, params, index) {
  if (type == "oknot" || type=="leak" ) {
    return params.toString()
  }else if(type == "bd" || type == "litre" || type == "percen" || type == "c" || type=='mpa'|| type=='amp'){
    if(index == 0){
      return params
    }else{
      return params.toString()
    }
  }else if(type =="checkbox4" || type=="checkbox" || type=="checkbox3"|| type=="checkbox2"){
    return params == 1
  }
  else {
    return params
  }
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function passSubmitData(type, params) {
  if (type == "oknot" || type=="leak") {
    if (params == "0") {
      return 0
    } else if (params == "1") {
      return 1
    } else {
      return -1
    }
  }
  else if(type == "actualCheck"){
    return !params ? "0": params.toString()
  }else if(type =="checkbox4" || type=="checkbox" || type=="checkbox3"|| type=="checkbox2"){
    if(params === true)
      return 1
    else
      return 0
  }
  else {
    if(isNaN(Number(params))){
      return parseFloat( params.replace(/,/g, ''))
    }else{
      return parseFloat(params)
    }
  }
}

export const npanItemTemplate = [
  // 1.check ใบส่งสินค้า  
  {
    "isSection": true,
    "rowSpan": 1,
    "sequence": "<strong>1.check ใบส่งสินค้า  </strong>",
    "practice": {
      "startPracticeText": "จำนวนที่ระบุ ในใบส่งสินค้า",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l150101",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "kg",
      "field": [
        {
          "name": "l1501010101",
        },
      ],
    },
  },

  // 2.Seal No. check
  {
    "isSection": true,
    "rowSpan": 1,
    "sequence": "<strong>2.Seal No. check</strong>",
    "practice": "Check No.ตู้ ตรงกับใบส่งหรือไม่",
    "condition": "ตรง",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1502010101",
          
        },
      ],
    },
  },

  // 3.อุปกรณ์ PPE  
  {
    "isSection": true,
    "rowSpan": 2,
    "sequence": "<strong>3.อุปกรณ์ PPE  </strong>",
    "practice": {
      "type": "checkbox3",
      "field": [
        {
          "startPracticeText": "ถุงมือ",
          "endPracticeText": "",
          "name": "l150301",
          
        },
        {
          "startPracticeText": "ชุดป้องกันสารเคมี",
          "endPracticeText": "",
          "name": "l150302",
          
        },
        {
          "startPracticeText": "กระบังหน้า",
          "endPracticeText": "",
          "name": "l150303",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1503010101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "type": "checkbox2",
      "field": [
        {
          "startPracticeText": "แว่นตา",
          "endPracticeText": "",
          "name": "l150304",
        },
        {
          "startPracticeText": "เข็มขัดนิรภัย",
          "endPracticeText": "",
          "name": "l150305",
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "",
      "field": [],
    },
  },

  // 5. ขั้นตอนการปฏิบัติ
  {
    "isSection": true,
    "rowSpan": 10,
    "sequence": "<strong>5. ขั้นตอนการปฏิบัติ</strong>",
    "practice": {
      "startPracticeText": "หยุดรถบริเวณที่ปฏิบัติงาน และดับเครื่องยนต์ No.1",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l150401",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1504010101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ใส่หมอนลองห้ามล้อเคลื่อนด้านหน้า-หลัง No.2",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l150402",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1504020101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ต่อสายกราวน์เข้ากับตัวรถ No.3",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l150403",
          
        },
      ],
    },
    "condition": "ต่อแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1504030101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "นำกรวยมาวางกั้นบอกพื้นที่ปฏิบัติงาน No.1",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l150404",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1504040101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ตรวจดูการต่อสาย Hose มีการล็อก ข้อต่อสาย เรียบร้อย No.4",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l150405",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1504050101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ตรวจสอบภายใน IBC มีสิ่งปลอมปนหรือไม่พร้อมทั้งปิด Valve no.5 ที่ IBC",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l150406",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1504060101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "นำ IBC มาวางเพื่อรับเคมี ที่ line ลง IBC",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l150407",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1504070101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิด  valve จาก Lorry  Tank No.4,6",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l150408",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1504080101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Check leak ที่สายต่อว่ารั่วหรื่อไม่ No.4",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l150409",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1504090101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิด Valve No.4 ไป IBC (เก็บ sample ส่ง INSP ที่ IBC ใบแรก)",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l150410",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1504100101",
          
        },
      ],
    },
  },

  // 6. ขั้นตอนขณะปฏิบัติงาน
  {
    "isSection": true,
    "rowSpan": 4,
    "sequence": "<strong>6. ขั้นตอนขณะปฏิบัติงาน</strong>",
    "practice": {
      "startPracticeText": "บันทึกเวลา start ลงใน check sheet",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l150501",
          
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l1505010101", // A
          
        },
        {
          "name": "l1505010102", // B
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิด Valve No.4 อย่างช้าๆ จนถึง 100 % ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l150502",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1505020101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ปิด  Valve No. 4 เมื่อสารเคมีใกล้เต็ม IBC ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l150503",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1505030101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "นำ IBC มารองรับสารเคมีและทำจนกว่าจะรับสารเคมีหมด Lorry",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l150504",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1505040101",
          
        },
      ],
    },
  },

  // 7.ขั้นตอนเมื่อรับเสร็จ
  {
    "isSection": true,
    "rowSpan": 6,
    "sequence": "<strong>7.ขั้นตอนเมื่อรับเสร็จ</strong>",
    "practice": {
      "startPracticeText": "ปิด Valve ไป IBC no.4 และ ปิดวาล์วLine vent  no.6ข้างบนTank lorry",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l150601",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1506010101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ถอดสาย Hose และล้างทำความสะอาดให้เรียบร้อย",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l150602",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1506020101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "บันทึกเวลาที่รับเสร็จ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l150603",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1506030101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เช็ค valveปิดเรียบร้อย อีกครั้ง ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l150604",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1506040101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เอาหมอนลองล้อ รถออก  No.2",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l150605",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1506050101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เก็บกรวย และอุปกรณ์ PPE ทำความสะอาด No.1",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l150606",
          
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1506060101",
          
        },
      ],
    },
  },
  

]
