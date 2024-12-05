import { urlApi } from '@/api'
import axios from '@axios'

export async function generate(poEtllogDetailJournalID) {
  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  await axios.post(`${urlApi.value}/api/v1/lorryFormEpichlo/generate?poEtllogDetailJournalID=${poEtllogDetailJournalID}`, [], {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
}

export async function get(poEtllogDetailJournalID) {
  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  return await axios.get(`${urlApi.value}/api/v1/lorryFormEpichlo/get/${poEtllogDetailJournalID}`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
}

export async function GetByPoEtlLogDetailJournalID(poEtllogDetailJournalIDQueryParameters) {
  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
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
    minimumFractionDigits: 0,
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




export const ItemTemplate = [
  // ข้อควรระวัง
  {
    "isSection": true,
    "rowSpan": 6,
    "sequence": "<strong>ข้อควรระวัง</strong>",
    "practice": " : หากมีงาน Hot work or Fire work ใกล้เคียง ให้แจ้งหัวหน้างานให้หยุดชั่วคราว",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0301010001",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": ": ให้ ปิดโทรศัพท์ขณะ loading EPICHlO",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0301020001",

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": ": หากมี EPICHlO หยดลงพื้น ให้ใช้ผ้า หรือ ตัวดูดซับ ห้ามใช้น้ำล้าง ",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0301030001",

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": ": Check วาล์ว ปิด ประตูน้ำก่อนปฏิบัติงาน ",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0301040001",

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": ": แจ้ง leader Production เวลา loading ว่าไม่ตรงกับเวลาการใช้ Pump 109D,S",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0301050001",

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": ": ในการผลิต Check ถังดับเพลิงประเภท เคมีแห้ง ว่าพร้อมใช้งาน",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0301060001",

        },
      ],
    },
  },

  //Document Check
  {
    "isSection": true,
    "rowSpan": 5,
    "sequence": "<strong>Document Check</strong>",
    "practice": "1. จำนวนที่ระบุ ในใบส่งสินค้า",
    "condition": "ตามเอกสารใบส่ง",
    "result": {
      "type": "ab",
      "field": [
        {
          "name": "l0302010101", // A

        },
        {
          "name": "l0302010102", // B

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "2.  level ที่อ่านได้จาก Tank 11V-109D,S ก่อนรับ    ",
    "condition": "ต้องไม่เกิน 480 mm.",
    "result": {
      "type": "cd",
      "field": [
        {
          "name": "l0302020101", // C

        },
        {
          "name": "l0302020102", // D

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3. ตรวจสอบว่าปริมาณหลังจากรับไม่เกินความจุถัง",
    "condition": "ต้องไม่เกิน 15,500 litre",
    "result": {
      "type": "bd",
      "field": [
        {
          "name": "l0302030101", // BD

        },
        {
          "name": "l0302030102", // OkNot

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "4. ตรวจสอบ ปริมาณ ใน DCS",
    "condition": "กดดูที่ถัง 11V-109D,Sต้องไม่เกิน 3,000  litre.",
    "result": {
      "type": "litre",
      "field": [
        {
          "name": "l0302040101", // litre

        },
        {
          "name": "l0302040102", // OkNot

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "5. Check Seal No.ที่รถส่งของ และ line Vent ข้างบนแท็งค์",
    "condition": "Seal ล็อกวาล์วไม่ขาดตรงตามใบส่ง",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0302050101", // litre

        },
      ],
    },
  },
  {
    "isSection": true,
    "rowSpan": 4,
    "sequence": "<strong>ก่อนการปฏิบัติงาน<strong>",
    "practice": "1. หยุดรถและดับเครื่องเรียบร้อย",
    "condition": "รถต้องหยุดนิ่งสนิท",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0303010101", // oknot

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "2. เอาหมอนรองล้อรถเรียบร้อย",
    "condition": "รองล้อรถทั่งด้านหน้าและด้านหลัง",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0303020101", // oknot

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
          "name": "l0303030101", // oknot

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "4.กรวยจราจร วางปิดกั้นพื้นที่",
    "condition": "ปิดกั้นพื้นที่รอบตัวรถขนส่ง",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0303040101", // oknot

        },
      ],
    },
  },
  {
    "isSection": true,
    "rowSpan": 3,
    "sequence": "<strong>line setting หัวถัง 11V-109D</strong>",
    "practice": "1. วาล์ว 1, 2",
    "condition": "Open ( เปิด )",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0304010101", // oknot

        },
      ],
    },
  },

  {
    "isSection": false,
    "sequence": "",
    "practice": "2. วาล์ว 3, 4 , 5",
    "condition": "Close ( ปิด )",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0304020101", // percen

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3. Temperature เท่าไหร่",
    "condition": "อุณหภูมิต้องไม่สูงกว่า  25 C' ",
    "result": {
      "type": "25c",
      "field": [
        {
          "name": "l0304030101", // percen

        },
        {
          "name": "l0304030102", // percen

        },
      ],
    },
  },
  {
    "isSection": true,
    "rowSpan": 3,
    "sequence": "<strong>11P-109D</strong>",
    "practice": "1. วาล์ว 6 , 7 , 8 , 9 ",
    "condition": "Close ( ปิด )",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0305040101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "2. วาล์ว 10 Open 40 % ",
    "condition": "Open 40 % ตามขีดที่กำหนดไว้",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0305050101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3.Check ว่า valve 13 Open",
    "condition": "ปกติวาล์วจะเปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0305060101", // percen

        },
      ],
    },
  },
  {
    "isSection": true,
    "rowSpan": 5,
    "sequence": "<strong>Operator ทำการสวมใส่อุปกรณ์ PPE </strong>",
    "practice": " - ถุงมือ",
    "condition": "ใส่ถุงมือยาง",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0306010101", // percen

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": " - แว่น safety",
    "condition": "ต้องเป็นแว่น safety เท่านั้น",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0306020101", // percen

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": " - หน้ากาก Full Face",
    "condition": "ใส่ให้ถูกวิธี",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0306030101", // percen

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": " - กรองอากาศ ( สีดำ )",
    "condition": "ใช้เฉพาะตัวกรองสีดำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0306040101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": " - ชุดป้องกันสารเคมี",
    "condition": "ใส่ทั้งเสื้อและกางเกงแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0306050101", // percen
        },
      ],
    },
  },
  {
    "isSection": true,
    "rowSpan": 4,
    "sequence": "<strong>lorry tank</strong>",
    "practice": "1. ต่อสายHose   เข้ากับ Valve 11",
    "condition": "ต่อโดยตรงโดยไม่ผ่านPump รถ lorry",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0307010101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "2. ต่อ line Vent  เข้ากับ Vent ของ lorry และเปิด Valve 12",
    "condition": "อย่าลืมเปิดวาล์ว 12",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0307020101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3. เปิดวาล์วจาก lorry",
    "condition": "No.14 Open ( เปิด )",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0307030101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "4. Check leak สาย Hose, ข้อต่อวาล์ว ระหว่าง Valve 11 , 14",
    "condition": "ต้องไม่รั่ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0307040101", // percen
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
          "name": "l0308010101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "2. Start Pump  เวลาเริ่ม",
    "condition": "Actual  Check",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l0308020101", // percen
        },
        {
          "name": "l0308020102", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3. Check pressure 11P- 109D,S",
    "condition": "ดูจาก pressure guage  ผ่าน Pump (0.2 - 0.45)",
    "result": {
      "type": "mpa",
      "field": [
        {
          "name": "l0308030101", // percen
        },
        {
          "name": "l0308030102", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "4. Check Ampmeter ของตัว Pump",
    "condition": "ดูจากตู้ Control Pump 11P-109D ( ไม่ต่ำกว่า  12 Amp)",
    "result": {
      "type": "amp",
      "field": [
        {
          "name": "l0308040101", // percen
        },
        {
          "name": "l0308040102", // percen
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
          "name": "l0308050101", // percen
        },
      ],
    },
  },
  {
    "isSection": true,
    "rowSpan": 10,
    "sequence": "<strong>เมื่อรับเสร็จ</strong>",
    "practice": "1. เมื่อ Pump หยุดทำงาน ปิด Valve   11, 14 และ Vent  12 ",
    "condition": "ด้านล่าง บริเวณ Pump 11V-109D",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0309010101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "2. Drain จากสาย Hose และ lorry ให้หมด",
    "condition": "ใน lorry และ Hose หมด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0309020101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3. บันทึกเวลารับเสร็จ ",
    "condition": "Actual  Check",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l0309030101", // percen
        },
        {
          "name": "l0309030102", // percen
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
          "name": "l0309040101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "5. เปิด Valve  8 และ Cerculate 10 นาที",
    "condition": "Open ( เปิด ) วาล์ว 8",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0309050101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "6. ปิด Valve 8",
    "condition": "Close ( ปิด ) วาล์ว 8",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0309060101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "7. เปิด Valve  4 , 5 ",
    "condition": "ด้านบนถัง 11V-109D",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0309070101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "8. อ่าน level ที่ถัง11V-109D,S ทำการ Record ",
    "condition": "Actual  Check",
    "result": {
      "type": "ef",
      "field": [
        {
          "name": "l0309080101", // percen
        },
        {
          "name": "l0309080102", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "9. Check level DCS ได้เท่าไหร่",
    "condition": "Actual  Check",
    "result": {
      "type": "g",
      "field": [
        {
          "name": "l0309090101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "10. ส่วนต่างระหว่าง  (B + D ) -F = ",
    "condition": "ต้องไม่ต่างกันมากจากการคำนวน",
    "result": {
      "type": "litrekg",
      "field": [
        {
          "name": "l0309100101", // percen
        },
        {
          "name": "l0309100102", // percen
        },
      ],
    },
  },
]

export function passInitialData(type, params, index) {
  if (type == "oknot" ) {
    return params.toString()
  }else if(type == "bd" || type == "litre" || type == "percen" || type == "c" || type=='mpa'|| type=='amp' || type=="25c"){
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
    if(isNaN(Number(params))){
      return parseFloat( params.replace(/,/g, ''))
    }else{
      return parseFloat(params)
    }
  }
}
