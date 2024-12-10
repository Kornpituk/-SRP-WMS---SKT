
import { urlApi } from '@/api'
import axios from '@axios'

export async function generate(poEtlLogDetailJournalID) {
  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  await axios.post(`${urlApi.value}/api/v1/LorryFormTela/generate?poEtlLogDetailJournalID=${poEtlLogDetailJournalID}`, [], {
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

  return await axios.get(`${urlApi.value}/api/v1/LorryFormTela/get/${poEtlLogDetailJournalID}`, {
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
  var response =  await axios.post(`${urlApi.value}/api/v1/LorryFormTela/save/${poEtlLogDetailJournalIDQueryParameters.value}`, ipaRequestData.value, {
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
  }else if(type =="checkbox4" || type=="checkbox" || type=="checkbox3"){
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

export const telaItemTemplate = [
  // 1.check ใบส่งสินค้า  
  {
    "isSection": true,
    "rowSpan": 4,
    "sequence": "<strong>1.check ใบส่งสินค้า  </strong>",
    "practice": "( <span class='text-red'>A</span> ) จำนวนที่ระบุ ในใบส่งสินค้า  ",
    "condition": "",
    "result": {
      "type": "kg",
      "field": [
        {
          "name": "l1201010101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "( <span class='text-red'>B</span> ) จำนวนสารเคมีที่ดูได้จาก DCS           ",
    "condition": "",
    "result": {
      "type": "kg",
      "field": [
        {
          "name": "l1201020101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "( <span class='text-red'>C</span> ) จำนวนใน DCS + จำนวนที่รับจริง <span class='text-red'>(A +B )</span> Kg.",
    "condition": "<u>ต้องไม่เกิน 8,500 Kg.</u>",
    "result": {
      "type": "c",
      "field": [
        {
          "name": "l1201030101",
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
    "condition": "ตรงกัน",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1202010101",
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
          "name": "l120301",
          "value:": "",
        },
        {
          "startPracticeText": "ชุดป้องกันสารเคมี",
          "endPracticeText": "",
          "name": "l120302",
          "value:": "",
        },
        {
          "startPracticeText": "กระบังหน้า",
          "endPracticeText": "",
          "name": "l120303",
          "value:": "",
        },
        {
          "startPracticeText": "รองเท้าบูท",
          "endPracticeText": "",
          "name": "l120304",
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
          "name": "l120305",
          "value:": "",
        },
        {
          "startPracticeText": "หน้ากาก กรองสารเคมี (สีเขียว)",
          "endPracticeText": "",
          "name": "l120306",
          "value:": "",
        },
        {
          "startPracticeText": "เข็มขัดนิรภัย",
          "endPracticeText": "",
          "name": "l120307",
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
    "rowSpan": 15,
    "sequence": "<strong>5. ขั้นตอนการปฏิบัติ</strong>",
    "practice": {
      "startPracticeText": "หยุดรถบริเวณที่ปฏิบัติงาน และดับเครื่องยนต์ NO.1",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120401",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1204010101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ใส่หมอนรองห้ามล้อเคลื่อน",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120402",
          "value:": "",
        },
      ],
    },
    "condition": "ใส่แล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1204020101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ต่อสายกราวน์เข้ากับตัวรถ NO.2",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120403",
          "value:": "",
        },
      ],
    },
    "condition": "ต่อแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1204030101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "นำกรวยมาวางกั้นบอกพื้นที่ปฏิบัติงาน  NO.3",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120404",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1204040101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ให้เปิดวาล์วตูดถัง 11V-511 จาก DCS ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120405",
          "value:": "",
        },
      ],
    },
    "condition": "เปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1204050101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ต่อสายจากรถเข้า pump 11P-133  NO.4",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120406",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1204060101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ตรวจดูการต่อสาย Hose มีการล็อก ข้อต่อสาย เรียบร้อย  NO.5,6",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120407",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1204070101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิด  valve จาก Lorry  Tank  NO.5",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120408",
          "value:": "",
        },
      ],
    },
    "condition": "เปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1204080101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิดวาล์วเข้า Pump  NO.6",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120409",
          "value:": "",
        },
      ],
    },
    "condition": "เปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1204090101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Check leak ที่สายต่อว่ารั่วหรือไม่  NO.4",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120410",
          "value:": "",
        },
      ],
    },
    "condition": "ไม่รั่ว",
    "result": {
      "type": "leak",
      "field": [
        {
          "name": "l1204100101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Check pump ว่าพร้อมใช้งานหรือไม่ โดยเลื่อน switch ไปที่ ON ถ้า pump ทำงานปกติให้เลื่อนกลับมาที่ AUTO   NO.7  ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120411",
          "value:": "",
        },
      ],
    },
    "condition": "ปกติอยู่ที่ Auto",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1204110101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ปกติ  Line หล่อ 11P-133 จะเปิด 100 %  NO.10",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120412",
          "value:": "",
        },
      ],
    },
    "condition": "เปิด 100 %",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1204120101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ปรับ switch 11P-133 ไปที่ ON   NO.7",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120413",
          "value:": "",
        },
      ],
    },
    "condition": "เลื่อนไปที่ ON",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1204130101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ปรับระดับการไหลของเคมี โดยค่อยๆ ปิด line circulate  NO.8",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120414",
          "value:": "",
        },
      ],
    },
    "condition": "ปิดเรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1204140101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "บันทึกเวลา start  (11P-133)",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120415",
          "value:": "",
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l1204150101", // A
          "value:": "",
        },
        {
          "name": "l1204150102", // B
          "value:": "",
        },
      ],
    },
  },

  // 6. ขั้นตอนขณะปฏิบัติงาน
  {
    "isSection": true,
    "rowSpan": 9,
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
          "name": "l1205020101",
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
          "name": "l1205030101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Pumpหยุดเมื่อเคมีใน lorry หมด ให้ปิดสวิตซ์ไป Off เปิด circulate",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120504",
          "value:": "",
        },
      ],
    },
    "condition": "ปิดไปที่ Off",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1205040101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Start ไปที่ ON อีกครั้ง โดยหรี่วาล์ว Line circulate 511 จนแน่ใจว่าหมด",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120505",
          "value:": "",
        },
      ],
    },
    "condition": "ปริมาณใน lorry หมด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1205050101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิดวาล์ว  Line circulate 100% No.8",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120506",
          "value:": "",
        },
      ],
    },
    "condition": "เปิดเรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1205060101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ปิดวาล์ว No.5",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120507",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1205070101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ถอดสาย Hose และล้างหัววาล์ว ปิด cap เรียบร้อย No.6",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120508",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1205080101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เลื่อนสวิตซ์11P-133 ไปที่ AUTO ตามปกติ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120509",
          "value:": "",
        },
      ],
    },
    "condition": "เลื่อนไป auto",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1205090101",
          "value:": "",
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
      "startPracticeText": "บันทึกเวลาที่รับเสร็จ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120610",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l1206100101",
          "value:": "",
        },
        {
          "name": "l1206100102",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "(<span class='text-red'>D</span>)  เช็คปริมาณ ในแท็งค์11V-511 จาก DCS ห้อง control room ",
    "condition": "ปริมาณที่ DCS ",
    "result": {
      "type": "kg",
      "field": [
        {
          "name": "l1206110101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ส่วนต่างระหว่างจำนวนที่คำนวณได้และจำนวนที่รับจริง  <span class='text-red'>(C - D)</span>",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120612",
          "value:": "",
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "cd",
      "field": [
        {
          "name": "l1206120101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ตรวจเช็ค valve เปิด-ปิด อีกครั้งให้อยู่ในสภาพเดิมก่อนรับ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120613",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1206130101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เอาหมอนรองล้อ รถออก  NO.1",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120614",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1206140101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เก็บกรวย และอุปกรณ์ PPE ทำความสะอาด  NO.3",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l120615",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1206150101",
          "value:": "",
        },
      ],
    },
  },
  

]
