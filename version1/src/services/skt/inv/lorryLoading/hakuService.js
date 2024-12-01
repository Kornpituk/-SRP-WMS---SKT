

import { urlApi } from '@/api'
import axios from '@axios'

export async function generate(poEtlLogDetailJournalID) {
  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  await axios.post(`${urlApi.value}/api/v1/LorryFormHaku/generate?poEtlLogDetailJournalID=${poEtlLogDetailJournalID}`, [], {
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

  return await axios.get(`${urlApi.value}/api/v1/LorryFormHaku/get/${poEtlLogDetailJournalID}`, {
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
  var response =  await axios.post(`${urlApi.value}/api/v1/LorryFormHaku/save/${poEtlLogDetailJournalIDQueryParameters.value}`, ipaRequestData.value, {
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
  if (type == "oknot" ) {
    return params.toString()
  }else if(type == "bd" || type == "litre" || type == "percen" || type == "c" || type=='mpa'|| type=='amp'){
    if(index == 0){
      return params
    }else{
      return params.toString()
    }
  }else if(type =="checkbox4" || type=="checkbox" || type=="checkbox3"){
    return params == 1
  }
  else {
    return params
  }
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function passSubmitData(type, params) {
  if (type == "oknot") {
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
  }else if(type =="checkbox4" || type=="checkbox" || type=="checkbox3"){
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

export const hakuItemTemplate = [
  // 1.check ใบส่งสินค้า 
  {
    "isSection": true,
    "rowSpan": 5,
    "sequence": "<strong>1.check ใบส่งสินค้า  </strong>",
    "practice": "( A ) จำนวนที่ระบุ ในใบส่งสินค้า ",
    "condition": "",
    "result": {
      "type": "kgA",
      "field": [
        {
          "name": "l0901010101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "( B ) จำนวนที่ได้จาก Level  จากการอ่าน DCS",
    "condition": "ต้องไม่เกิน 15,000 kg",
    "result": {
      "type": "kgB",
      "field": [
        {
          "name": "l0901020101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "( C ) ปริมาณที่คำนวณได้ก่อนการรับ (A + B) ",
    "condition": "A+B",
    "result": {
      "type": "ab",
      "field": [
        {
          "name": "l0901030101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "จำเป็นต้องยืนยันว่า A+B ต้องน้อยกว่า 28,000 kg",
    "condition": "A+B = < 28,000 kg",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0901040101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "ตรวจสอบไฟสถานะอนุญาติ ติดหรือดับ ( Y )",
    "condition": "ไฟดับ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0901050101",
          
        },
      ],
    },
  },

  // 2.Seal No. check
  {
    "isSection": true,
    "rowSpan": 2,
    "sequence": "<strong>2.Seal No. check</strong>",
    "practice": "Check Seal No.ที่ล็อกวาล์วและฝาถังว่าตรงกับใบส่งหรือไม่",
    "condition": "ตรง",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0902010101",
          
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
          "name": "l090301",
          
        },
        {
          "startPracticeText": "ชุดป้องกันสารเคมี",
          "endPracticeText": "",
          "name": "l090302",
          
        },
        {
          "startPracticeText": "กระบังหน้า",
          "endPracticeText": "",
          "name": "l090303",
          
        },
        {
          "startPracticeText": "รองเท้าบูท",
          "endPracticeText": "",
          "name": "l090304",
          
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
          "name": "l090305",
          
        },
        {
          "startPracticeText": "หน้ากาก กรองสารเคมี (สีขาว)",
          "endPracticeText": "",
          "name": "l090306",
          
        },
        {
          "startPracticeText": "เข็มขัดนิรภัย",
          "endPracticeText": "",
          "name": "l090307",
          
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "",
      "field": [],
    },
  },

  // 4. ขั้นตอนการปฏิบัติ
  {
    "isSection": true,
    "rowSpan": 15,
    "sequence": "<strong>4. ขั้นตอนการปฏิบัติ</strong>",
    "practice": {
      "startPracticeText": "หยุดรถบริเวณที่ปฏิบัติงาน และดับเครื่องยนต์ No.1",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090401",
          
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904010101",
          
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
          "name": "l090402",
          
        },
      ],
    },
    "condition": "ใส่แล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904020101",
          
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
          "name": "l090403",
          
        },
      ],
    },
    "condition": "ต่อแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904030101",
          
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
          "name": "l090404",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904040101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เก็บ Sample (จาก Lorry tank )ส่ง INSP  รอผล Lab",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090405",
          
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904050101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ต่อสายจากรถเข้า pump 11P-111A No.5",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090406",
          
        },
      ],
    },
    "condition": "ต่อแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904060101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ตรวจดูการต่อสาย Hose มีการล็อก ข้อต่อสาย เรียบร้อย No.5,6",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090407",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904070101",
          
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
          "name": "l090408",
          
        },
      ],
    },
    "condition": "เปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904080101",
          
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
          "name": "l090409",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "leak",
      "field": [
        {
          "name": "l0904090101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิดวาล์วเข้า Pump  No.5,8,9,10",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090410",
          
        },
      ],
    },
    "condition": "เปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904100101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "กดปุ่ม Unloading วงกลมสีแดง ( X )",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090411",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904110101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เช็คตู้ควบคุมวาล์ว XV-111C,D ต้องเปิด",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090412",
          
        },
      ],
    },
    "condition": "เปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904120101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ตรวจสอบไฟสถานะอนุญาติ ดับหรือติด ( Y )/ ตัว Scrubber ต้องทำงาน",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090413",
          
        },
      ],
    },
    "condition": "ไฟติด/ทำงาน",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904130101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "กดปุ่ม Start ที่ตัวควบคุม ( วงกลมสีแดง ) ( Z )",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090414",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904140101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "บันทึกเวลา start  (11P-111A)",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090415",
          
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l0904150101", // A
          
        },
        {
          "name": "l0904150102", // B
          
        },
      ],
    },
  },

  // 5. ขั้นตอนขณะปฏิบัติงาน
  {
    "isSection": true,
    "rowSpan": 9,
    "sequence": "<strong>5. ขั้นตอนขณะปฏิบัติงาน</strong>",
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
          "name": "l0905020101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "      :  Amp meter ",
    "condition": " ( 5 - 10 Amp )",
    "result": {
      "type": "amp2",
      "field": [
        {
          "name": "l0905030101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Pumpหยุดเมื่อเคมีใน lorry หมด ให้ปิดสวิตซ์ไป Off หรี่วาล์ว No.10",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090504",
          
        },
      ],
    },
    "condition": "ปิดสวิตซ์อยู่ที่ off",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0905040101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Start ไปที่ ON อีกครั้ง โดยหรี่วาล์ว Valve Line No.10 จนแน่ใจว่าหมดโดยดูที่ช่องใส No.9",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090505",
          
        },
      ],
    },
    "condition": "หมด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0905050101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ปิดสวตซ์ Pump  ไปตำแหน่ง OFF",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090506",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0905060101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ต่อสายลมจาก No.12 มาต่อที่ข้อต่อที่Tankแล้วเปิด Air ไล่สารในสายให้หมด",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090507",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0905070101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ปิดวาล์ว No.12,6,5,8,9,10 ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090508",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0905080101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิดNo.13 ไล่อากาศออกถอดสาย Hose และล้างหัววาลว์ ปิด cap เรียบร้อย No.5",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090509",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0905090101",
          
        },
      ],
    },
  },

  // 6.ขั้นตอนเมื่อรับเสร็จ
  {
    "isSection": true,
    "rowSpan": 10,
    "sequence": "<strong>6.ขั้นตอนเมื่อรับเสร็จ</strong>",
    "practice": {
      "startPracticeText": "บันทึกเวลาที่รับเสร็จ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090601",
          
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l0906010101",
          
        },
        {
          "name": "l0906010102",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "(D)  เช็ค Level ในแท้งค์11V-111 เท่ากับ",
      "endPracticeText": "%     ( X )     ",
      "type": "d",
      "field": [
        {
          "name": "l090602",
          
        },
      ],
    },
    "condition": "น้ำหนักที่อ่านได้",
    "result": {
      "type": "kg",
      "field": [
        {
          "name": "l0906020101",
          
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
          "name": "l090603",
          
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "kg",
      "field": [
        {
          "name": "l0906030101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เช็ค valveปิด อีกครั้ง No. 5,8,9,10",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l0906040101",
          
        },
      ],
    },
    "condition": "ปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0906040101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "กดปุ่ม Stop ปั๊ม ( วงกลมสีเขียว ) ( Z ) ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090605",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0906050101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "กดปุ่ม Finish unloading  ( วงกลมสีเขียว ) ( X ) ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090606",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0906060101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เช็คตู้ควบคุมวาล์ว XV-111 C, D ต้องปิด ( X ) ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090607",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0906070101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Scrubber blower ต้องดับไม่ทำงาน ( New scrubber area )",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090608",
          
        },
      ],
    },
    "condition": "ไม่ทำงาน",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0906080101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ตรวจสอบไฟสถานะอนุญาติ ติดหรือดับ ( Y )",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090609",
          
        },
      ],
    },
    "condition": "ดับ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0906090101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เก็บกรวยและอุปกรณ์ PPE ทำความสะอาดพื้นที่",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090610",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0906100101",
          
        },
      ],
    },
  },

]
