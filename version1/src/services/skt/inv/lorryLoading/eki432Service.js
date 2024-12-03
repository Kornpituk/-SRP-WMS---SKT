
import { urlApi } from '@/api'
import axios from '@axios'

export async function generate(poEtlLogDetailJournalID) {
  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  await axios.post(`${urlApi.value}/api/v1/LorryFormEkiNaOH/generate?poEtlLogDetailJournalID=${poEtlLogDetailJournalID}`, [], {
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

  return await axios.get(`${urlApi.value}/api/v1/LorryFormEkiNaOH/get/${poEtlLogDetailJournalID}`, {
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
  var response =  await axios.post(`${urlApi.value}/api/v1/LorryFormEkiNaOH/save/${poEtlLogDetailJournalIDQueryParameters.value}`, ipaRequestData.value, {
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

export const eki432ItemTemplate = [
  // 1.check ใบส่งสินค้า  
  {
    "isSection": true,
    "rowSpan": 4,
    "sequence": "<strong>1.check ใบส่งสินค้า  </strong>",
    "practice": "( A ) จำนวนที่ระบุ ในใบส่งสินค้า    ",
    "condition": "",
    "result": {
      "type": "kg",
      "field": [
        {
          "name": "l1301010101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "( B ) จำนวนที่คิดได้จาก Level",
      "endPracticeText": "mm.",
      "type": "d",
      "field": [
        {
          "name": "l130102",
          "value:": "",
        },
      ],
    },
    "condition": "ต้องไม่เกิน 2,015 mm.",
    "result": {
      "type": "kg",
      "field": [
        {
          "name": "l1301020101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "( C ) ปริมาณที่คำนวณได้ก่อนการรับ (A + B) ",
    "condition": "ต้องไม่เกิน 45,000 Kg.",
    "result": {
      "type": "c",
      "field": [
        {
          "name": "l1301030101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "หากพบว่าไม่ตรงให้แจ้งหัวหน้างานทันที",
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
    "practice": "Check Seal No.ที่ล็อกวาล์วและฝาถังว่าตรงกับใบส่งหรือไม่",
    "condition": "ตรง",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1302010101",
          "value:": "",
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
      "type": "checkbox4",
      "field": [
        {
          "startPracticeText": "ถุงมือ",
          "endPracticeText": "",
          "name": "l130301",
          "value:": "",
        },
        {
          "startPracticeText": "ชุดป้องกันสารเคมี",
          "endPracticeText": "",
          "name": "l130302",
          "value:": "",
        },
        {
          "startPracticeText": "กระบังหน้า",
          "endPracticeText": "",
          "name": "l130303",
          "value:": "",
        },
        {
          "startPracticeText": "รองเท้าบูท",
          "endPracticeText": "",
          "name": "l130304",
          "value:": "",
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
      "type": "checkbox3",
      "field": [
        {
          "startPracticeText": "แว่นตา",
          "endPracticeText": "",
          "name": "l130305",
          "value:": "",
        },
        {
          "startPracticeText": "หน้ากาก กรองสารเคมี (สีขาว)",
          "endPracticeText": "",
          "name": "l130306",
          "value:": "",
        },
        {
          "startPracticeText": "เข็มขัดนิรภัย",
          "endPracticeText": "",
          "name": "l130307",
          "value:": "",
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
    "rowSpan": 16,
    "sequence": "<strong>5. ขั้นตอนการปฏิบัติ</strong>",
    "practice": {
      "startPracticeText": "หยุดรถบริเวณที่ปฏิบัติงาน และดับเครื่องยนต์ No.1",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l130401",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1304010101",
          "value:": "",
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
          "name": "l130402",
          "value:": "",
        },
      ],
    },
    "condition": "ใส่แล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1304020101",
          "value:": "",
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
          "name": "l130403",
          "value:": "",
        },
      ],
    },
    "condition": "ต่อแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1304030101",
          "value:": "",
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
          "name": "l130404",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1304040101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เก็บ Sample (จาก Lorry tank บนรถ)ส่ง INSP No.4",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l130405",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1304050101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ต่อสายจากรถเข้า pump 11P-132 No.5",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l130406",
          "value:": "",
        },
      ],
    },
    "condition": "ต่อแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1304060101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ตรวจดูการต่อสาย Hose มีการล็อก ข้อต่อสาย เรียบร้อย No.7,6",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l130407",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1304070101",
          "value:": "",
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
          "name": "l130408",
          "value:": "",
        },
      ],
    },
    "condition": "เปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1304080101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": " เปิดวาล์วเข้า Pump  No.7",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l130409",
          "value:": "",
        },
      ],
    },
    "condition": "เปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1304090101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Check leak ที่สายต่อว่ารั่วหรื่อไม่ No.5",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l130410",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "leak",
      "field": [
        {
          "name": "l1304100101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Check pump ว่าพร้อมใช้งานหรือไม่ โดยเลื่อน switch ไปที่ ON  ถ้า pump ทำงานปกติให้เลื่อนกลับมาที่ AUTO  No.8  ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l130411",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1304110101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิด Valve น้ำ CTWS หล่อ 11P-132 ประมาณ 50 % No.9",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l130412",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1304120101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ปิด Valve ไป 11R-311  No.11",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l130413",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1304130101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ปรับ switch 11P-132 ไปที่ ON  No.8",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l130414",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1304140101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ปรับระดับการไหลของเคมี โดยค่อยๆ ปิด line circulate No.10",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l130415",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1304150101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "บันทึกเวลา start  (11P-132)",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120416",
          "value:": "",
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l1204160101", // A
          "value:": "",
        },
        {
          "name": "l1204160102", // B
          "value:": "",
        },
      ],
    },
  },

  // 6. ขั้นตอนขณะปฏิบัติงาน
  {
    "isSection": true,
    "rowSpan": 10,
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
          "name": "l1305020101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "      :  Amp meter ",
    "condition": " ( 10 - 20 Amp )",
    "result": {
      "type": "amp2",
      "field": [
        {
          "name": "l1305030101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Pumpหยุดเมื่อเคมีใน lorry หมด ให้ปิดสวิตซ์ไป Off เปิด circulate No.10",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l130504",
          "value:": "",
        },
      ],
    },
    "condition": "ปิดสวิตซ์อยู่ที่ off",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1305040101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Start ไปที่ ON อีกครั้ง โดยหรี่วาล์ว Line circulate No.10 จนแน่ใจว่าหมด",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l130505",
          "value:": "",
        },
      ],
    },
    "condition": "หมด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1305050101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิดวาล์ว  Line circulate 100%",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l130506",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1305060101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ปิดน้ำ CTWS และปิด  No.9 และเปิดวาล์ว No.6",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l130507",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1305070101",
          "value:": "",
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
          "name": "l130508",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1305080101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เลื่อนสวิตซ์11P-132 ไปที่ AUTO ตามปกติ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l130509",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1305090101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิด Valve ไป 11R-311ไปที่ตำแหน่งปกติคือเปิด  No.11",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l130510",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1305100101",
          "value:": "",
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
      "startPracticeText": "บันทึกเวลาที่รับเสร็จ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l130601",
          "value:": "",
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l1306010101",
          "value:": "",
        },
        {
          "name": "l1306010102",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "(D)  เช็ค Level ในแท้งค์11V-432 เท่ากับ",
      "endPracticeText": "mm.",
      "type": "d",
      "field": [
        {
          "name": "l130602",
          "value:": "",
        },
      ],
    },
    "condition": "น้ำหนักที่อ่านได้",
    "result": {
      "type": "kg",
      "field": [
        {
          "name": "l1306020101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ส่วนต่างระหว่างจำนวนที่คำนวณได้และจำนวนที่รับจริง  (C - D)                    ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l130603",
          "value:": "",
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "cd",
      "field": [
        {
          "name": "l1306030101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เช็ค valveปิด อีกครั้ง No. 7,9",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l130604",
          "value:": "",
        },
      ],
    },
    "condition": "ปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1306040101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เช็ค valve เปิด อีกครั้ง No.10",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l130605",
          "value:": "",
        },
      ],
    },
    "condition": "เปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1306050101",
          "value:": "",
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
          "name": "l130606",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1306060101",
          "value:": "",
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
          "name": "l130607",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1306070101",
          "value:": "",
        },
      ],
    },
  },
  

]
