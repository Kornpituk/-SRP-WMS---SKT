import { urlApi } from '@/api'
import axios from '@axios'

export async function generate(poEtllogDetailJournalID) {
  const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  await axios.post(`${urlApi.value}/api/v1/LorryFormEA/generate?poEtllogDetailJournalID=${poEtllogDetailJournalID}`, [], {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
}

export async function get(poEtllogDetailJournalID) {
  const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  return await axios.get(`${urlApi.value}/api/v1/LorryFormEA/get/${poEtllogDetailJournalID}`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
}


export async function save(poEtlLogDetailJournalIDQueryParameters, ipaRequestData) {
  const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  // eslint-disable-next-line sonarjs/prefer-immediate-return
  var response =  await axios.post(`${urlApi.value}/api/v1/LorryFormEA/save/${poEtlLogDetailJournalIDQueryParameters}`, ipaRequestData, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
  
  return response
}
export async function GetByPoEtlLogDetailJournalID(poEtllogDetailJournalIDQueryParameters) {
  const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  return await axios.get(`${urlApi.value}/api/v1/ReceivingPlan/GetByPoEtllogDetailJournalID/${poEtllogDetailJournalIDQueryParameters}`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
}

export function currencyFormat(number) {
  console.log("currencyFormat", number)
  
  return new Intl.NumberFormat("th-TH", {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number)
}


export function mm2litre(mm) {
  return mm * 5.2 + 511.24
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
  if (type == "oknot") {
    return params.toString()
  }else if(type == "bd" || type == "litre" || type == "percen" || type == "c" || type=='mpa'|| type=='amp'){
    if(index == 0){
      return params
    }else{
      return params.toString()
    }
  }
  else {
    return params
  }
}

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
  }
  else {
    if(isNaN(Number(params)) && type != ""){
      return parseFloat( params.replace(/,/g, ''))
    }else{
      return parseFloat(params)
    }
  }
}


export const eaItemTemplate = [
  // ข้อควรระวัง
  {
    "isSection": true,
    "rowSpan": 6,
    "sequence": "<strong><u>ข้อควรระวัง</u></strong>",
    "practice": "หากมีงาน Hot work or Fire work ใกล้เคียง ให้แจ้งหัวหน้างานให้หยุดชั่วคราว",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0201010101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "ให้<u>ปิด</u>โทรศัพท์ขณะ loading Solvent",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0201020101",

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "หากมี Solvent หยดลงพื้น ให้ใช้ผ้า หรือ ตัวดูดซับ <strong>ห้ามใช้น้ำล้าง</strong>",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0201030101",

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "Check วาล์ว ปิด ประตูน้ำก่อนปฏิบัติงาน",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0201040101",

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "แจ้ง Leader Production เวลา Loading ว่าไม่ตรงกับเวลาการใช้ Pump 109B,C ในการผลิต",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0201050101",

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "Check ถังดับเพลิงประเภท เคมีแห้ง ว่าพร้อมใช้งาน",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0201060101",

        },
      ],
    },
  },

  //Document Check
  {
    "isSection": true,
    "rowSpan": 5,
    "sequence": "Document Check",
    "practice": "1. จำนวนที่ระบุ ในใบส่งสินค้า",
    "condition": "ตามเอกสารใบส่ง",
    "result": {
      "type": "ab",
      "field": [
        {
          "name": "l0202010101", // A

        },
        {
          "name": "l0202010102", // B

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "2.  Level ที่อ่านได้จาก Tank 11V-109B,C ก่อนรับ    ",
    "condition": "ต้องไม่เกิน 320 mm.",
    "result": {
      "type": "cd",
      "field": [
        {
          "name": "l0202020101", // C

        },
        {
          "name": "l0202020102", // D

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3. ตรวจสอบว่าปริมาณหลังจากรับไม่เกินความจุถัง",
    "condition": "ต้องไม่เกิน 15,500 Litre",
    "result": {
      "type": "bd",
      "field": [
        {
          "name": "l0202030101", // BD

        },
        {
          "name": "l0202030102", // OkNot

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "4. ตรวจสอบ ปริมาณ ใน DCS",
    "condition": "กดดูที่ถัง 11V-109B,C ต้องไม่เกิน 2170  Litre.",
    "result": {
      "type": "litre",
      "field": [
        {
          "name": "l0202040101", // litre

        },
        {
          "name": "l0202040102", // OkNot

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "5. Check Seal No. ที่รถส่งของ และ แป้นในถัง lorry ว่าตรง 10,000 ลิตร หรือไม่",
    "condition": "Seal ล็อกวาล์วไม่ขาดตรงตามใบส่ง",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0202050101", // litre

        },
      ],
    },
  },
  {
    "isSection": true,
    "rowSpan": 6,
    "sequence": "ก่อนการปฏิบัติงาน",
    "practice": "1. หยุดรถและดับเครื่องเรียบร้อย",
    "condition": "รถต้องหยุดนิ่งสนิท",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0203010101", // oknot

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "2. เอาหมอนรองล้อรถเรียบร้อย",
    "condition": "รองล้อรถทั้งด้านหน้าและด้านหลัง",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0203020101", // oknot

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3. ต่อสายกราวน์เรียบร้อย",
    "condition": "ต่อสายกราวน์บริเวณที่โหลดเข้ากับรถ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0203030101", // oknot

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "4. เก็บตัวอย่าง ส่ง INSP เรียบร้อย",
    "condition": "1 ขวดแก้วเล็กและ 1 ขวดแก้วใหญ่ด้านบนรถ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0203040101", // oknot

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "5. นำลูกกุญแจมาเปิดล็อกวาล์ว 11",
    "condition": "EA กุญแจใช้ล็อครหัส",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0203050101", // oknot

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "6. Moisture เท่าไหร่",
    "condition": "0.05 Max",
    "result": {
      "type": "percen",
      "field": [
        {
          "name": "l0203060101", // percen
          "value:": 0,
        },
        {
          "name": "l0203060102", // ok

        },
      ],
    },
  },
  {
    "isSection": true,
    "rowSpan": 3,
    "sequence": "<strong>Line setting หัวถัง 11V-109C</strong>",
    "practice": "1. วาล์ว 1, 2",
    "condition": "Open (เปิด)",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0204010101", // percen

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "2. วาล์ว 3, 4, 5",
    "condition": "Close (ปิด)",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0204020101", // percen

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3. Temperature เท่าไหร่",
    "condition": "อุณหภูมิต้องไม่สูงกว่า 25 C°",
    "result": {
      "type": "c",
      "field": [
        {
          "name": "l0204030101", // percen

        },
        {
          "name": "l0204030102", // percen

        },
      ],
    },
  },
  {
    "isSection": true,
    "rowSpan": 3,
    "sequence": "11P-109C",
    "practice": "1. วาล์ว 6, 7, 8, 9",
    "condition": "Close (ปิด)",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0205010101", // percen

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "2. วาล์ว 10 Open 40%",
    "condition": "Open 40% ตามขีดที่กำหนดไว้",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0205020101", // percen

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3. Check ว่า valve 13 Open",
    "condition": "ปกติวาล์วจะเปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0205030101", // percen

        },
      ],
    },
  },
  {
    "isSection": true,
    "rowSpan": 6,
    "sequence": "<strong>Operator ทำการสวมใส่อุปกรณ์ PPE</strong>",
    "practice": "- ถุงมือ",
    "condition": "ใส่ถุงมือยาง",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0206010101", // percen

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "- แว่น safety",
    "condition": "ต้องเป็นแว่น safety เท่านั้น",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0206020101", // percen

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "- หน้ากากคางหมู",
    "condition": "ใส่ให้ถูกวิธี",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0206030101", // percen

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "- กรองอากาศ (สีดำ)",
    "condition": "ใช้เฉพาะตัวกรองสีดำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0206040101", // percen

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "- ชุดป้องกันสารเคมี",
    "condition": "ใส่ทั้งเสื้อและกางเกงแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0206050101", // percen

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "- เข็มขัดนิรภัย",
    "condition": "-",
    "result": {
      "type": "",
      "field": [
      ],
    },
  },
  {
    "isSection": true,
    "rowSpan": 4,
    "sequence": "<strong>Lorry tank</strong>",
    "practice": "1. ต่อสาย Hose เข้ากับ Valve 11",
    "condition": "ต่อโดยตรงโดยไม่ผ่าน Pump รถ Lorry",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0207010101", // percen

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "2. ต่อ Line Vent เข้ากับ Vent ของ Lorry และเปิด Valve 12",
    "condition": "อย่าลืมเปิดวาล์ว 12",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0207020101", // percen

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3. เปิดวาล์วจาก Lorry ",
    "condition": "No.14 Open (เปิด)",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0207030101", // percen

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "4. Check Leak สาย Hose, ข้อต่อวาล์ว ระหว่าง Valve 11 , 14",
    "condition": "ต้องไม่รั่ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0207040101", // percen

        },
      ],
    },
  },
  {
    "isSection": true,
    "rowSpan": 5,
    "sequence": "<strong>Charging</strong>",
    "practice": "1. เปิดวาล์ว",
    "condition": "วาล์ว 11 เปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0208010101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "2. Start Pump เวลาเริ่ม",
    "condition": "Actual Check",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l0208020101", // 1

        },
        {
          "name": "l0208020102", // 2

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3. Check pressure 11P-109B,C",
    "condition": "ดูจาก pressure guage ผ่าน Pump (0.2 - 0.45)",
    "result": {
      "type": "mpa",
      "field": [
        {
          "name": "l0208030101", // 1

        }, {
          "name": "l0208030102", // 1

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "4. Check Ampmeter ของตัว Pump",
    "condition": "ดูจากตู้ Control Pump 11P-109B,C (ไม่ต่ำกว่า 12 Amp)",
    "result": {
      "type": "amp",
      "field": [
        {
          "name": "l0208040101", // 1

        }, {
          "name": "l0208040102", // 1

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "5. Check ไฟที่ หัว Pump",
    "condition": "ไฟต้องแสดงเป็นสีเขียวเท่านั้น",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0208050101", // 1

        },
      ],
    },
  },
  {
    "isSection": true,
    "rowSpan": 12,
    "sequence": "<strong>เมื่อรับเสร็จ</strong>",
    "practice": "1. เมื่อ Pump หยุดทำงาน ปิด Valve 11, 14 และ Vent 12",
    "condition": "ด้านล่าง บริเวณ Pump 11V-109B,C",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0209010101", // 1

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "2. Drain จากสาย Hose และ Lorry ให้หมด",
    "condition": "ใน Lorry และ Hose หมด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0209020101", // 1

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3. บันทึกเวลารับเสร็จ",
    "condition": "Actual Check",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l0209030101", // 1

        },
        {
          "name": "l0209030102", // 1

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "4. ถอดสายดินออกจากรถ",
    "condition": "เอาออกเรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0209040101", // 1

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "5. เปิด Valve 8 และ Cerculate 10 นาที",
    "condition": "Open (เปิด) วาล์ว 8",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0209050101", // 1

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "6. เก็บ Sample Check Moisture 1 ขวดแก้วใหญ่",
    "condition": "0.05 Max",
    "result": {
      "type": "percen",
      "field": [
        {
          "name": "l0209060101", // 1

        },
        {
          "name": "l0209060102", // 1

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "7. ปิด Valve 8",
    "condition": "Close (ปิด) วาล์ว 8",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0209070101", // 1

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "8. เปิด Valve 4 , 5",
    "condition": "ด้านบนถัง 11V-109B,C",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0209080101", // 1

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "9. อ่าน Level ที่ถัง 11V-109C ทำการ Record",
    "condition": "Actual Check",
    "result": {
      "type": "ef",
      "field": [
        {
          "name": "l0209090101", // 1
        },
        {
          "name": "l0209090102", // 1
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "10. Check level DCS ได้เท่าไหร่",
    "condition": "Actual Check",
    "result": {
      "type": "g",
      "field": [
        {
          "name": "l0209100101", // 1
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "11. หลังจากโหลดเสร็จล็อกวาล์ว 11",
    "condition": "กุญแจรหัส",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0209110101", // 1

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "12. ส่วนต่างระหว่าง (B + D) - F = ",
    "condition": "ต้องไม่ต่างกันมากจากการคำนวณ",
    "result": {
      "type": "litrekg",
      "field": [
        {
          "name": "l0209120101", // 1    
        },
        {
          "name": "l0209120102", // 1         
        },
      ],
    },
  },

]


