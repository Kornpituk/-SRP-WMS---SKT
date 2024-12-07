

import { urlApi } from '@/api'
import axios from '@axios'

export async function generate(poEtlLogDetailJournalID) {
  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  await axios.post(`${urlApi.value}/api/v1/LorryFormSannix/generate?poEtlLogDetailJournalID=${poEtlLogDetailJournalID}`, [], {
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

  return await axios.get(`${urlApi.value}/api/v1/LorryFormSannix/get/${poEtlLogDetailJournalID}`, {
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
  var response =  await axios.post(`${urlApi.value}/api/v1/LorryFormSannix/save/${poEtlLogDetailJournalIDQueryParameters}`, ipaRequestData, {
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

export const sannixItemTemplate = [
  // 1.check ใบส่งสินค้า  
  {
    "isSection": true,
    "rowSpan": 1,
    "sequence": "<strong>1.check ใบส่งสินค้า  </strong>",
    "practice": {
      "startPracticeText": "จำนวนที่ระบุ ในใบส่งสินค้า    ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160101",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "kg",
      "field": [
        {
          "name": "l1601010101",
          
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
          "name": "l1602010101",
          
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
          "name": "l160301",
        },
        {
          "startPracticeText": "ชุดป้องกันสารเคมี",
          "endPracticeText": "",
          "name": "l160302",       
        },
        {
          "startPracticeText": "กระบังหน้า",
          "endPracticeText": "",
          "name": "l160303",  
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1603010101",
          
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
          "name": "l160304",
          
        },
        {
          "startPracticeText": "เข็มขัดนิรภัย",
          "endPracticeText": "",
          "name": "l160305",
          
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
    "rowSpan": 19,
    "sequence": "<strong>5. ขั้นตอนการปฏิบัติ</strong>",
    "practice": {
      "startPracticeText": "หยุดรถบริเวณที่ปฏิบัติงาน และดับเครื่องยนต์ No.1",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160401",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604010101",
          
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
          "name": "l160402",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604020101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ประตูด้านซ้าย ติดป้ายเตือน \"ห้ามเปิดประตูตู้ 2 บาน\"",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160403",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604030101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "แล้วให้เปิดประตูบานด้านขวาบานเดียว",
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604040101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "( Please do not open this latch Liquid Contents may spill out)",
    "condition": "",
    "result": {
      "type": "",
      "field": [],
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
          "name": "l160406",
          
        },
      ],
    },
    "condition": "ต่อแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604060101",
          
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
          "name": "l160407",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604070101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ต่อสายจากรถเข้า pump 11P-143 No.6 ,7",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160408",
          
        },
      ],
    },
    "condition": "ต่อแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604080101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ตรวจดูการต่อสาย Hose มีการล็อก ข้อต่อสาย เรียบร้อย No.6,7",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160409",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604090101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "นำ IBC มาวางเพื่อรับเคมี ที่ line ลง IBC,Drums",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160410",
          
        },
      ],
    },
    "condition": "เปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604100101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิด  valve จาก Lorry  Tank No.6",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160411",
          
        },
      ],
    },
    "condition": "เปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604110101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิดวาล์วเข้า Pump  NO.7",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160412",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "leak",
      "field": [
        {
          "name": "l1604120101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Check leak ที่สายต่อว่ารั่วหรื่อไม่ No.6,7",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160413",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604130101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Check pump ว่าพร้อมใช้งานหรือไม่ โดยกด switch ไปที่ ON   ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160414",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604140101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิด Valve No.10 (line circulate)",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160415",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604150101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "กดswitch 11P-143 ไปที่ ON  No.13",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160416",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604160101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิด Valve No.11 ไป IBC No.12, 13(เก็บ sample ส่งQC ที่ IBC ใบแรก)",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160417",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604170101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ปรับระดับการไหลของเคมี โดยค่อยๆ ปิด line circulate No.10  80%",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160418",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604180101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "บันทึกเวลา start  (11P-143)ลงใน check sheet",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160419",
          
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l1604190101", // A
          
        },
        {
          "name": "l1604190102", // B
          
        },
      ],
    },
  },

  // 6. ขั้นตอนขณะปฏิบัติงาน
  {
    "isSection": true,
    "rowSpan": 6,
    "sequence": "<strong>6. ขั้นตอนขณะปฏิบัติงาน</strong>",
    "practice": " Check",
    "condition": "",
    "result": {
      "type": "",
      "field": [],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "      :  pressure",
    "condition": "อยู่ระหว่าง 0.35 - 0.50 ",
    "result": {
      "type": "mpa2",
      "field": [
        {
          "name": "l1605020101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "      :  Amp meter ",
    "condition": " ( 6.1 Amp )",
    "result": {
      "type": "amp2",
      "field": [
        {
          "name": "l1605030101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": " เปิดวาล์ว circulate No.10 เพิ่มขึ้นและ ปิด วาล์วไป IBC No.11 , 12, 13",
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1605040101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Start ไปที่ ON อีกครั้ง โดยหรี่วาล์ว Line circulate No.10 ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160505",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1605050101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิดวาล์ว  Line circulate 20%",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160506",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1605060101",
        },
      ],
    },
  },

  // 7.ขั้นตอนเมื่อรับเสร็จ
  {
    "isSection": true,
    "rowSpan": 7,
    "sequence": "<strong>7.ขั้นตอนเมื่อรับเสร็จ</strong>",
    "practice": {
      "startPracticeText": "เปิด Valve ไป IBC และ เปิดวาล์ว  Line circulate 100% ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160607",
          
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "",
      "field": [],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": " เปิด N2 เพื่อไล่สารออกให้หมด",
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1606080101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ถอดสาย Hose และล้างหัววาลว์ ปิด cap เรียบร้อย No.7",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160609",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1606090101",
          
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
          "name": "l160610",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1606100101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เช็ค valveปิด อีกครั้ง ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160611",
          
        },
      ],
    },
    "condition": "ปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1606110101",
          
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
          "name": "l160612",
          
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1606120101",
          
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
          "name": "l160613",
          
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1606130101",
          
        },
      ],
    },
  },
  

]
