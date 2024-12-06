import { urlApi } from '@/api'
import axios from '@axios'

export async function generate(poEtllogDetailJournalID) {
  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  await axios.post(`${urlApi.value}/api/v1/LorryFormSktEpBe/generate?poEtllogDetailJournalID=${poEtllogDetailJournalID}`, [], {
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

  return await axios.get(`${urlApi.value}/api/v1/LorryFormSktEpBe/get/${poEtllogDetailJournalID}`, {
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

export async function save(poEtlLogDetailJournalIDQueryParameters, ipaRequestData) {
  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  // eslint-disable-next-line sonarjs/prefer-immediate-return
  var response =  await axios.post(`${urlApi.value}/api/v1/LorryFormSktEpBe/save/${poEtlLogDetailJournalIDQueryParameters.value}`, ipaRequestData.value, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
  
  return response
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


export function passInitialData(type, params, index) {
  if (type == "oknot" || type=="leak" ) {
    return params.toString()
  }else if(type == "bd" || type == "litre" || type == "percen" || type == "c" || type=='mpa'|| type=='amp' || type == "mm" || type =="ac"){
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
  }else if(type == "percent"){
    if(params == undefined)
      return 0
    else parseFloat(params)
  }
  else {
    if(isNaN(Number(params))){
      return parseFloat( params.replace(/,/g, ''))
    }else{
      return parseFloat(params)
    }
  }
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
          "name": "l0401010001",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": ": ให้ ปิดโทรศัพท์ขณะ Loading สาร",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0401020001",

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": ": หากมี ของเหลว หยดลงพื้น ให้ใช้ผ้า หรือ ตัวดูดซับ ห้ามใช้น้ำล้าง ",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0401030001",

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
          "name": "l0401040001",

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": ": แจ้ง Leader Production เวลา Loading ว่าไม่ตรงกับเวลาการใช้ 11P-144,11P-145 ในการผลิต",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0401050001",

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": ": Check ถังดับเพลิงประเภท เคมีแห้ง ว่าพร้อมใช้งาน",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0401060001",

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
      "type": "a",
      "field": [
        {
          "name": "l0402010101", // A

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "2.  Level ที่อ่านได้จาก Tank 11V-144 ก่อนรับ    ",
    "condition": "ต้องไม่เกิน 180 mm.",
    "result": {
      "type": "bc",
      "field": [
        {
          "name": "l0402020101", // B

        },
        {
          "name": "l0402020102", // C

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3. ตรวจสอบว่าปริมาณหลังจากรับไม่เกินความจุถัง",
    "condition": " ต้องไม่เกิน 2130 mm.เทียบกับ Level หน้า Tank",
    "result": {
      "type": "mm",
      "field": [
        {
          "name": "l0402030101", // mm

        },
        {
          "name": "l0402030102", // OkNot

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "4. ตรวจสอบ ปริมาณ ใน DCS",
    "condition": "กดดูที่ถัง 11V-144 ต้องไม่เกิน 22,835 kg.",
    "result": {
      "type": "ac",
      "field": [
        {
          "name": "l0402040101", // Kg

        },
        {
          "name": "l0402040102", // OkNot

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "5. Check Seal No.ที่รถส่งของ ",
    "condition": "Seal ล็อกวาล์วไม่ขาดตรงตามใบส่ง",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0402050101", // litre

        },
      ],
    },
  },
  {
    "isSection": true,
    "rowSpan": 6,
    "sequence": "<strong>ก่อนการปฏิบัติงาน<strong>",
    "practice": "1. หยุดรถและดับเครื่องเรียบร้อย",
    "condition": "รถต้องหยุดนิ่งสนิท",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0403010101", // oknot

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
          "name": "l0403020101", // oknot

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
          "name": "l0403030101", // oknot

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "4. เก็บตัวอย่าง ส่ง Inspection เรียบร้อย",
    "condition": "1 ขวดแก้วใหญ่ด้านบนรถ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0403040101", // oknot

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "5. นำลูกกุญแจมาเปิดล็อกวาล์ว 29จากหัวหน้างาน",
    "condition": "กุญแจ EP-400BE",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0403050101", // oknot

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
      "type": "percent",
      "field": [
        {
          "name": "l0402060101", // percent

        },
        {
          "name": "l0402060102", // OkNot

        },
      ],
    },
  },
  {
    "isSection": true,
    "rowSpan": 3,
    "sequence": "<strong>Line setting หัวถัง 11V-144</strong>",
    "practice": "1. วาล์ว 1, 2,3,4,5,19",
    "condition": "Open ( เปิด )",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0404010101", // oknot

        },
      ],
    },
  },

  {
    "isSection": false,
    "sequence": "",
    "practice": "2. วาล์ว 6,7,8,9",
    "condition": "Close ( ปิด )",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0404020101", // percen

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3. Temperature เท่าไหร่",
    "condition": "อุณหภูมิต้องไม่สูงกว่า  35 C' ",
    "result": {
      "type": "35c",
      "field": [
        {
          "name": "l0404030101", // percen

        },
        {
          "name": "l0404030102", // percen

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
          "name": "l0405010101", // percen

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
          "name": "l0405020101", // percen

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": " - ผ้าปิดจมูกคาร์บอนสีเขียว",
    "condition": "ใส่ให้ถูกวิธี",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0405030101", // percen

        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": " - เข็มขัดนิรภัย",
    "condition": "ใช้เฉพาะตัวกรองสีดำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0405040101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "",
    "condition": "ใส่ทั้งเสื้อและกางเกงแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0405050101", // percen
        },
      ],
    },
  },
  {
    "isSection": true,
    "rowSpan": 3,
    "sequence": "<strong>lorry tank</strong>",
    "practice": "1. วาล์ว 18,21,24,25,26,27,28,29",
    "condition": "Close ( ปิด )",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0406010101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "2. ต่อสายHose   เข้ากับ Valve 29 แล้วต่อเข้ากับ Valve ตูดถังของ ISO Container",
    "condition": "ต้องไม่รั่ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0406020101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3. เปิดวาล์วระบายอากาศบนหัวถัง ISO Container",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0406030101", // percen
        },
      ],
    },
  },
  {
    "isSection": true,
    "rowSpan": 8,
    "sequence": "<strong>Charging</strong>",
    "practice": "1. เปิดวาล์ว 22",
    "condition": "Open ( เปิด )",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0407010101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "2. เลือกโหมด Manual ที่ตู้สวิตท์ 11P-145",
    "condition": "บิด switch ไปที่โหมด Manual",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0407020101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3. หน้าจอ DCS ตรง SELECTION TO ให้เลือกถัง 11V-144 แล้วเปิดวาล์ว XV-11FT145",
    "condition": "วงกลมสีแดงไปอยู่ที่ตำแหน่งถัง 11V-144",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0407030101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "4. ทำการเปิดวาล์ว XV-11FT145",
    "condition": "วาล์ว XV-11FT145 เปลี่ยนจากสีเขียวเป็นสีแดง",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0407040101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "5. เปิดวาล์วที่ตูด ISO Container ",
    "condition": "Open ( เปิด )",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0407050101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "6. ค่อยๆเปิดวาล์ว 25 เพื่อทำการให้ปั้มทำงาน",
    "condition": "Open ( เปิด )",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0407060101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "7. เปิดวาล์ว 29 ",
    "condition": "Open ( เปิด ) เวลาเริ่มโหลดสินค้า",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l0407070101", // percen
        },
        {
          "name": "l0407070101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "8. ในกรณีที่ระดับของเหลวในถัง11V-144 สูงไม่สามารถรับได้ให้สลับไป Charging เข้าสู่ถัง 11V-145",
    "condition": " ต้องไม่เกิน 2130 mm.หรือ 22,835 kg.",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0407080101", // percen
        },
      ],
    },
  },
  {
    "isSection": true,
    "rowSpan": 12,
    "sequence": "<strong>เมื่อรับเสร็จ</strong>",
    "practice": "1. เมื่อมั่นใจว่าของเหลวใน ISO Container หมดแล้วให้ทำการปิดวาล์วที่ตูดถัง ISO Container",
    "condition": "Close ( ปิด )",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0408010101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "2. ถอดสาย Hose ที่ต่อกับวาล์วตูดถัง ISO Container ออกโดยที่ปั้มยังทำงานอยู่เพื่อให้ดูดของเหลวที่ค้างอยู่ในสายจนหมด",
    "condition": "ยกสายเพื่อทำการไล่ของเหลวในสายจนหมด(โดยดูจาก pressure gauge)",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0408020101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3. ปิดวาล์ว 25 เพื่อทำการหยุดปั้ม",
    "condition": "Close ( ปิด )",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0408030101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "4. ปิดวาล์ว 29 ",
    "condition": "Close ( ปิด ) เวลาโหลดสินค้าเสร็จ",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l0408040101", // percen
        },
        {
          "name": "l0408040102", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "5. เปิดวาล์ว 28 เพื่อทำการไล่ของเหลวที่ค้างในท่อให้เข้าไปในถัง 11V-144  จนหมดแล้วจึงทำการปิด",
    "condition": "ทำการไล่ของเหลวในท่อจนหมด(โดยดูจาก pressure gauge)แล้วจึงทำการปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0408050101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "6.ปิดวาล์ว 22,19,1",
    "condition": "Close ( ปิด )",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0408060101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "7.ปิดวาล์วระบายอากาศบนหัวถัง ISO Container",
    "condition": "ด้านบนถัง ISO Container",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0408070101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "8.ปิดวาล์ว 24 ที่หน้าจอ DCS",
    "condition": "วาล์ว XV-11FT145 เปลี่ยนจากสีแดงเป็นสีเขียว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0408080101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "9. อ่าน Level ที่ถัง11V-144 ทำการ Record ",
    "condition": "Actual  Check",
    "result": {
      "type": "mm2",
      "field": [
        {
          "name": "l0408090101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "10. Check level DCS ได้เท่าไหร่",
    "condition": "Actual  Check",
    "result": {
      "type": "e",
      "field": [
        {
          "name": "l0408100101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "11. ส่วนต่างระหว่าง ก่อนการรับ และหลังรับ จำนวนกี่กีโลกรัม",
    "condition": "ต้องไม่ต่างกันมากจากการคำนวน",
    "result": {
      "type": "de",
      "field": [
        {
          "name": "l0408110101", // percen
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "12. หลังจากโหลดเสร็จล็อกวาล์ว 29 คืนกุญแจ และให้หัวหน้างานให้Checkซ้ำ",
    "condition": "Lock valve",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0408120101", // percen
        },
      ],
    },
  },
]

