

import { urlApi } from '@/api'
import axios from '@axios'

export async function generate(poEtlLogDetailJournalID) {
  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  await axios.post(`${urlApi.value}/api/v1/LorryFormDiesel/generate?poEtlLogDetailJournalID=${poEtlLogDetailJournalID}`, [], {
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

  return await axios.get(`${urlApi.value}/api/v1/LorryFormDiesel/get/${poEtlLogDetailJournalID}`, {
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
  var response =  await axios.post(`${urlApi.value}/api/v1/LorryFormDiesel/save/${poEtlLogDetailJournalIDQueryParameters.value}`, ipaRequestData.value, {
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
  if (type == "oknot" || type=="leak"  || type=="soldout" || type=="straight") {
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
  if (type == "oknot" || type=="leak" || type=="soldout" || type=="straight") {
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
  }else if(type =="checkbox4" || type=="checkbox" || type=="checkbox3" || type=="checkbox2"){
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
export const dieselItemTemplate = [
  // 1.check ใบส่งสินค้า  
  {
    "isSection": true,
    "rowSpan": 4,
    "sequence": "<strong>1.check ใบส่งสินค้า  </strong>",
    "practice": "( <span class='text-red'>A</span> ) จำนวนน้ำมันที่ระบุ ในใบส่งสินค้า    ",
    "condition": "",
    "result": {
      "type": "LTR",
      "field": [
        {
          "name": "l1101010101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "( <span class='text-red'>B</span> ) จำนวนน้ำมันที่คิดได้จาก Level",
      "endPracticeText": "mm.",
      "type": "d",
      "field": [
        {
          "name": "l110102",
          
        },
      ],
    },
    "condition": "<span class='text-red'>B</span> ห้ามเกิน 1,400 mm.",
    "result": {
      "type": "LTR",
      "field": [
        {
          "name": "l1101020101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "( <span class='text-red'>C</span> ) จากการคำนวน Level (A + B)",
    "condition": "ต้องไม่เกิน 15,000 LTR",
    "result": {
      "type": "c",
      "field": [
        {
          "name": "l1101030101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "type": "center",
      "field": [
        { 
          "startPracticeText": "<strong><u>หากพบว่าไม่ตรงให้แจ้งหัวหน้างานทันที</u></strong>",
          "endPracticeText": "",
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "",
      "field": [],
    },
  },

  // 2.Seal No. check
  {
    "isSection": true,
    "rowSpan": 1,
    "sequence": "<strong>2.Seal No. check</strong>",
    "practice": "Check Seal No.ที่ล็อกวาล์วและฝาถังว่าตรงกับใบส่งหรือไม่ NO.11",
    "condition": "ตรงและครบ",
    "result": {
      "type": "straight",
      "field": [
        {
          "name": "l1102010101",
          
        },
      ],
    },
  },

  // 3. check ในlorry tank
  {
    "isSection": true,
    "rowSpan": 1,
    "sequence": "<strong>3. check ในlorry tank</strong>",
    "practice": "Check level ในถัง Diesel oil ว่าท่วมแป้น 9,000 ลิตร NO.11",
    "condition": "ทุกช่องต้องท่วมแป้น",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1103010101",
          
        },
      ],
    },
  },

  // 4.อุปกรณ์ PPE  
  {
    "isSection": true,
    "rowSpan": 2,
    "sequence": "<strong>4.อุปกรณ์ PPE  </strong>",
    "practice": {
      "type": "checkbox4",
      "field": [
        {
          "startPracticeText": "ถุงมือ",
          "endPracticeText": "",
          "name": "l110401",
          
        },
        {
          "startPracticeText": "ชุดป้องกันการกระเด็นใส่",
          "endPracticeText": "",
          "name": "l110402",
          
        },
        {
          "startPracticeText": "กระบังหน้า",
          "endPracticeText": "",
          "name": "l110403",
          
        },
        {
          "startPracticeText": "รองเท้าบูท",
          "endPracticeText": "",
          "name": "l110404",
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
    "practice": {
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "แว่นตา",
          "endPracticeText": "",
          "name": "l110405",
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
    "rowSpan": 11,
    "sequence": "<strong>5. ขั้นตอนการปฏิบัติ</strong>",
    "practice": {
      "type": "checkbox",
      "field": [
        { 
          "startPracticeText": "หยุดรถบริเวณที่ปฏิบัติงาน และดับเครื่องยนต์ NO.1",
          "endPracticeText": "",
          "name": "l110501",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1105010101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "ใส่หมอนรองห้ามล้อเคลื่อน NO.2",
          "endPracticeText": "",
          "name": "l110502",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1105020101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "ต่อสายกราวน์เข้ากับตัวรถ NO.3",
          "endPracticeText": "",
          "name": "l110503",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1105030101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "นำกรวยมาวางกั้นบอกพื้นที่ปฏิบัติงาน NO.4",
          "endPracticeText": "",
          "name": "l110504",
          
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1105040101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "ต่อสาย NO.5 จากรถเข้า pump ",
          "endPracticeText": "",
          "name": "l110505",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1105050101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "เปิด  valve จาก   Lorry ทุก Tank NO.6",
          "endPracticeText": "",
          "name": "l110506",
        },
      ],
    },
    "condition": "เปิดเรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1105060101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "เปิดวาล์วเข้า Pump  NO.7",
          "endPracticeText": "",
          "name": "l110507",
          
        },
      ],
    },
    "condition": "เปิดเรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1105070101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "Check leak ที่สายต่อว่ารั่วหรือไม่  NO.5",
          "endPracticeText": "",
          "name": "l110508",
          
        },
      ],
    },
    "condition": "ต้องไม่รั่ว",
    "result": {
      "type": "leak",
      "field": [
        {
          "name": "l1105080101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "เปิดวาล์วตรง Hopper เพื่อ blow อากาศ  NO.8",
          "endPracticeText": "",
          "name": "l110509",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1105090101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "ปิด วาล์ว Hopper เมื่อไม่มีอากาศอยู่ใน line pump NO.8",
          "endPracticeText": "",
          "name": "l110510",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1105100101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "บันทึกเวลา start  (101P-023) NO.9",
          "endPracticeText": "",
          "name": "l110511",
          
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l1105110101", // A
          
        },
        {
          "name": "l1105110102", // B
          
        },
      ],
    },
  },

  // 6. ขั้นตอนขณะปฏิบัติงาน
  {
    "isSection": true,
    "rowSpan": 12,
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
    "condition": "อยู่ระหว่าง  0.2 - 0.4",
    "result": {
      "type": "mpa2",
      "field": [
        {
          "name": "l1106020101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "      :  Amp miter ",
    "condition": " ( 7 - 14 Amp )",
    "result": {
      "type": "amp2",
      "field": [
        {
          "name": "l1106030101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
     
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "หยุด Pump  เมื่อ diesel ใน lorry หมด  NO.9",
          "endPracticeText": "",
          "name": "l110604",
          
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1106040101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ปิดวาล์ว Lorry  NO.6",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "ปิดวาล์ว Lorry  NO.6",
          "endPracticeText": "",
          "name": "l110605",
          
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1106050101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
     
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "ปิดวาล์ว Receiving  NO.7",
          "endPracticeText": "",
          "name": "l110606",
          
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1106060101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "Drain น้ำมันในหม้อพักที่รถและในสาย hose ลง hopper. NO.10",
          "endPracticeText": "",
          "name": "l110607",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1106070101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "เปิดวาล์ว Hopper  NO.8",
          "endPracticeText": "",
          "name": "l110608",
          
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1106080101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "Start pump อีกครั้ง  (101P-023). NO.9",
          "endPracticeText": "",
          "name": "l110609",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1106090101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "หยุด Pump เมื่อใน hopper หมด.NO.9",
          "endPracticeText": "",
          "name": "l110610",
          
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1106100101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "ปิดวาล์วลง Hopper NO.8",
          "endPracticeText": "",
          "name": "l110611",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1106110101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "Check ใน lorry ว่าหมดแน่นอน  NO.11",
          "endPracticeText": "",
          "name": "l110612",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "soldout",
      "field": [
        {
          "name": "l1106120101",
          
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
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "บันทึกเวลารับเสร็จ",
          "endPracticeText": "",
          "name": "l110701",
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l1107010101",
          
        },
        {
          "name": "l1107010102",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "ถอด สาย hose - สายกราวด์ ออกแล้วหรือยัง NO.5 , NO.3",
          "endPracticeText": "",
          "name": "l110702",
          
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1107020101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "<span class='text-red'>(D)</span> เช็ค Level ในแท้งค์101V-020  <span class='text-red'>NO.12</span>",
    "condition": "น้ำหนักที่อ่านได้",
    "result": {
      "type": "LTR",
      "field": [
        {
          "name": "l1107030101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "ส่วนต่างระหว่างจำนวนที่คำนวณได้และจำนวนที่รับจริง",
          "endPracticeText": "",
          "name": "l110704",
          
        },
      ],
    },
    "condition": "(C - D)",
    "result": {
      "type": "cd",
      "field": [
        {
          "name": "l1107040101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "ตรวจเช็ค valve เปิด-ปิด อีกครั้งให้อยู่ในสภาพเดิมก่อนรับ  NO.7 ,8",
          "endPracticeText": "",
          "name": "l110705",
          
        },
      ],
    },
    "condition": "อยู่สภาพเดิมก่อนรับ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1107050101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "เอาหมอนรองล้อ รถออก  NO.2",
          "endPracticeText": "",
          "name": "l110706",
          
        },
      ],
    },
    "condition": "เอาออกแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1107060101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "type": "checkbox",
      "field": [
        {
          "startPracticeText": "เก็บกรวย และอุปกรณ์ PPE ทำความสะอาด  NO.4",
          "endPracticeText": "",
          "name": "l110707",
          
        },
      ],
    },
    "condition": "เก็บเรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1107070101",
          
        },
      ],
    },
  },
  

]
