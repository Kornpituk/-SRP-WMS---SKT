import { urlApi } from '@/api'
import axios from '@axios'

export async function generate(poEtlLogDetailJournalID) {
  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  await axios.post(`${urlApi.value}/api/v1/LorryFormKaramu/generate?poEtlLogDetailJournalID=${poEtlLogDetailJournalID}`, [], {
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

  return await axios.get(`${urlApi.value}/api/v1/LorryFormKaramu/get/${poEtlLogDetailJournalID}`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
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

export async function save(poEtlLogDetailJournalIDQueryParameters, ipaRequestData) {
  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  return await axios.post(`${urlApi.value}/api/v1/LorryFormKaramu/save/${poEtlLogDetailJournalIDQueryParameters.value}`, ipaRequestData.value, {
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

export function passInitialData(type, params) {
  if (type == "oknot" || type == "bd" || type == "litre" || type == "percen") {
    if (params == 0) {
      return "0"
    } else if (params == 1) {
      return "1"
    } else {
      return "-1"
    }
  } else {
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


export const kumaruItemTemplate = [
  {
    "isSection": true,
    "rowSpan": 6,
    "sequence": "<strong>ข้อควรระวัง</strong>",
    "practice": "หากมีงาน Hot work or Fire work ใกล้เคียง ให้แจ้งหัวหน้างานให้หยุดชั่วคราว",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0601010001",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ข้อควรระวัง</strong>",
    "practice": "ให้ปิดโทรศัพท์ขณะ Loading สาร",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0601020001",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ข้อควรระวัง</strong>",
    "practice": "หากมีสารหยดลงพื้น ให้ใช้ผ้าหรือ ตัวดูดซับ ห้ามใช้น้ำล้าง",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0601030001",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ข้อควรระวัง</strong>",
    "practice": "Check วาล์วปิดประตูน้ำก่อนปฏิบัติงาน",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0601040001",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ข้อควรระวัง</strong>",
    "practice": "แจ้ง Leader Production TP-2 เพื่อตรวจสอบว่าไม่มีการใช้งานขณะที่กำลังจะ Loading สาร",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0601050001",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ข้อควรระวัง</strong>",
    "practice": "Check ถังดับเพลิงประเภทเคมีแห้งว่าพร้อมใช้งาน",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0601060001",
        },
      ],
    },
  },
  {
    "isSection": true,
    "rowSpan": 5,
    "sequence": "<strong>รายการที่ต้องตรวจสอบ</strong>",
    "practice": "1. จำนวนที่ระบุในใบส่งสินค้า",
    "condition": "ตามเอกสารใบส่ง",
    "result": {
      "type": "a",
      "field": [
        {
          "name": "l0602010101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>รายการที่ต้องตรวจสอบ</strong>",
    "practice": "2. Level ที่อ่านได้จาก Tank 21V-306 ก่อนรับ",
    "condition": "ต้องไม่เกิน 7,000 kg",
    "result": {
      "type": "b",
      "field": [
        {
          "name": "l0602020101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>รายการที่ต้องตรวจสอบ</strong>",
    "practice": "3. ตรวจสอบว่าปริมาณหลังจากรับไม่เกินความจุถัง",
    "condition": "ต้องไม่เกิน 27,000 kg",
    "result": {
      "type": "ab",
      "field": [
        {
          "name": "l0602030101",
        },
        {
          "name": "l0302030102",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>รายการที่ต้องตรวจสอบ</strong>",
    "practice": "4. Check Seal No. ที่รถส่งของ",
    "condition": "Seal ล็อกวาล์วไม่ขาดตรงตามใบส่ง",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0602040101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>รายการที่ต้องตรวจสอบ</strong>",
    "practice": "5. ตรวจสอบอุณหภูมิของรถ ISO container",
    "condition": "ต้องอยู่ระหว่าง 60-90 องศาเซลเซียส",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0602050101",
        },
      ],
    },
  },
  {
    "isSection": true,
    "rowSpan": 11,
    "sequence": "<strong>ก่อนการปฏิบัติงาน</strong>",
    "practice": "1. หยุดรถและดับเครื่องเรียบร้อย",
    "condition": "รถต้องหยุดนิ่งสนิท",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0603010101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ก่อนการปฏิบัติงาน</strong>",
    "practice": "2. เอาหมอนรองล้อรถเรียบร้อย",
    "condition": "รองล้อรถทั้งด้านหน้าและด้านหลัง",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0603020101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ก่อนการปฏิบัติงาน</strong>",
    "practice": "3. ต่อสายกราวน์เรียบร้อย",
    "condition": "ต่อสายกราวน์บริเวณที่โหลดเข้ากับรถ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0603030101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ก่อนการปฏิบัติงาน</strong>",
    "practice": "4. ต่อสาย Hose line nitrogen เข้ากับท่อ line vent จากรถ ISO container",
    "condition": "ต่อสาย Hose line nitrogen",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0603040101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ก่อนการปฏิบัติงาน</strong>",
    "practice": "5. สวมข้อต่อเข้ากับท่อโหลดที่มากับรถ ISO container แล้วทำการทดสอบการรั่วโดยการอัดไนโตรเจนเข้าที่ความดัน 0.25 Mpa",
    "condition": "สวมข้อต่อเข้ากับ ISO container",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0603050101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ก่อนการปฏิบัติงาน</strong>",
    "practice": "แล้วทำการเช็ครอยรั่วของข้อต่อ ถ้ามีการรั่วให้ทำการทดสอบอีกครั้งจนกว่าจะผ่าน แต่ถ้าไม่มีการรั่วให้ทำขั้นตอนต่อไป",
    "condition": "ทำการเช็ครอยรั่ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0603060101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ก่อนการปฏิบัติงาน</strong>",
    "practice": "6. ต่อสาย Hose line load จาก 21P-101 เข้ากับท่อโหลดจากรถ ISO container แล้วทำการทดสอบการรั่วของข้อต่อ",
    "condition": "ต่อสาย Hose line loading",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0603070101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ก่อนการปฏิบัติงาน</strong>",
    "practice": "7. ต่อ line steam เพื่อให้ความร้อนแก่ท่อด้านในของ ISO container จนถึงท่อ line load ของ 21P-101",
    "condition": "ต่อสาย Hose line steam",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0603080101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ก่อนการปฏิบัติงาน</strong>",
    "practice": "8. เปิด valve steam ให้ความร้อนจนกว่า bottom valve ของ ISO container จะเปิดได้",
    "condition": "เปิด valve steam",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0603090101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ก่อนการปฏิบัติงาน</strong>",
    "practice": "9. ทำการทดสอบความดันใน ISO container จนถึงวาล์วสุดท้ายของ ISO container โดยการอัดไนโตรเจนเข้าที่ความดัน 0.20 Mpa และเก็บเป็นเวลา 5 นาที",
    "condition": "อัดไนโตรเจนเข้าที่ความดัน 0.20 Mpa และเก็บเป็นเวลา 5 นาที",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0603100101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ก่อนการปฏิบัติงาน</strong>",
    "practice": "10. ตรวจสอบความดันในถัง ถ้าลดลงต่ำกว่า 0.19 Mpa ให้ทำการตรวจสอบหารอยรั่วจนกว่าจะหายรั่ว แต่ถ้าความดันลดลงไม่เกิน 0.19 Mpa ให้ทำขั้นตอนต่อไป",
    "condition": "ลดลงไม่เกิน 0.19 Mpa",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0603110101",
        },
      ],
    },
  },
  {
    "isSection": true,
    "rowSpan": 4,
    "sequence": "<strong>ทำการสวมใส่อุปกรณ์ PPE</strong>",
    "practice": "1. ถุงมือทนความร้อน",
    "condition": "สวมถุงมือขณะปฏิบัติงาน",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0604010101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ทำการสวมใส่อุปกรณ์ PPE</strong>",
    "practice": "2. แว่น Safety",
    "condition": "สวมแว่นตาขณะปฏิบัติงาน",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0604020101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ทำการสวมใส่อุปกรณ์ PPE</strong>",
    "practice": "3. ผ้ากันเปื้อน",
    "condition": "สวมผ้ากันเปื้อนขณะปฏิบัติงาน",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0604030101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 11,
    "sequence": "<strong>ทำการสวมใส่อุปกรณ์ PPE</strong>",
    "practice": "4. Harness แบบเต็มตัว",
    "condition": "สวม Harness ขณะปฏิบัติงานบนที่สูง",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0604040101",
        },
      ],
    },
  },
  {
    "isSection": true,
    "rowSpan": 10,
    "sequence": "<strong>ขณะทำการ loading to 21V-306</strong>",
    "practice": "1. ทำการเปิดไนโตรเจนเข้าไปใน ISO container",
    "condition": "ทำการเปิดวาล์วค้างไว้",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0605010101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ขณะทำการ loading to 21V-306</strong>",
    "practice": "2. เปิดระบบควบคุมที่ DCS",
    "condition": "เปิดที่ DCS",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0605020101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ขณะทำการ loading to 21V-306</strong>",
    "practice": "3. ค่อยๆ เปิดวาล์วตูดถังของ ISO container",
    "condition": "ระวังความดันตอนเปิดวาล์ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0605030101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ขณะทำการ loading to 21V-306</strong>",
    "practice": "4. ทำการตรวจสอบที่ side glass ว่ามีของมาหรือเปล่า",
    "condition": "ตรวจสอบด้วยสายตา",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0605040101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ขณะทำการ loading to 21V-306</strong>",
    "practice": "5. เปิดวาล์วจาก 21P-101 ไปที่ 21V-306",
    "condition": "ทำการยืนยันว่าเปิดทั้งหมด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0605050101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ขณะทำการ loading to 21V-306</strong>",
    "practice": "6. ทำการ start pump 21P-101 ที่หน้างานชั้น 1",
    "condition": "สตาร์ทที่ Panel ตรงปั้มชั้น 1",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l0605060101",
        },
        {
          "name": "l0305060102",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ขณะทำการ loading to 21V-306</strong>",
    "practice": "7. ทำการตรวจสอบความดันในท่อ โดยความดันจะอยู่ประมาณ 0.4 Mpa",
    "condition": "ความดันอยู่ประมาณ 0.4 Mpa",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0605070101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ขณะทำการ loading to 21V-306</strong>",
    "practice": "8. ทำการตรวจสอบแอมมิเตอร์ของปั้ม อยู่ประมาณ 14.2 Amp.",
    "condition": "แอม์มิเตอร์ที่ Panel อยู่ประมาณ 14.2 Amp.",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0605080101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ขณะทำการ loading to 21V-306</strong>",
    "practice": "9. ทำการตรวจสอบอัตราการไหล",
    "condition": "ตรวจสอบที่ side glass",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0605090101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>ขณะทำการ loading to 21V-306</strong>",
    "practice": "10. ทำการตรวจสอบการทำงานของปั้ม",
    "condition": "โชว์สถานะสีเขียว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0605100101",
        },
      ],
    },
  },
  {
    "isSection": true,
    "rowSpan": 15,
    "sequence": "<strong>เสร็จสิ้นการ loading</strong>",
    "practice": "1. เมื่ออัตราการไหลต่ำ ให้ทำการหยุดปั๊ม และทำการสตาร์ทปั้มอีกรอบจนกว่าจะแน่ใจว่าไม่มีของเหลวคงค้างในท่อ",
    "condition": "หยุดปั้ม ที่ Panel ตรงปั้มชั้น 1",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0606010101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>เสร็จสิ้นการ loading</strong>",
    "practice": "2. ปิดไนโตรเจนสำหรับ ISO container",
    "condition": "ตรวจเช็คว่า valve ปิดจริง",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0606020101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>เสร็จสิ้นการ loading</strong>",
    "practice": "3. ปิดวาล์วตูดถังของ ISO container",
    "condition": "ตรวจเช็คว่า valve ปิดจริง",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0606030101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>เสร็จสิ้นการ loading</strong>",
    "practice": "4. เปิดไนโตรเจนไล่ของเหลวที่อยู่ในท่อตั้งหน้าปั้ม 21P-101 จนถึง 21V-306",
    "condition": "ตรวจสอบที่ side glass ว่าไม่มีของเหลวเหลืออยู่",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0606040101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>เสร็จสิ้นการ loading</strong>",
    "practice": "5. ต่อสายไนโตรเจนเข้ากับวาล์วหมายเลข 9 แล้วเปิดไนโตรเจนไล่ของเหลวที่อยู่ในสาย hose จนถึง 21V-306 โดยให้ทำการตรวจสอบที่ side glass จนกว่าไม่มีของไหล",
    "condition": "ตรวจสอบที่ side glass ว่าไม่มีของเหลวตกค้าง",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0606060101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>เสร็จสิ้นการ loading</strong>",
    "practice": "6. ปิดวาล์วแล้วทำการถอดสายไนโตรเจนออกจากวาล์วหมายเลข 9",
    "condition": "ตรวจเช็คว่า valve ปิดจริง",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0606070101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>เสร็จสิ้นการ loading</strong>",
    "practice": "7. ปิดวาล์ว steam ให้ความร้อนแก่สาย hose ที่เชื่อมต่อกับ ISO container และเก็บอุปกรณ์",
    "condition": "ตรวจเช็คว่า valve ปิดจริง",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0606080101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>เสร็จสิ้นการ loading</strong>",
    "practice": "8. ถอดสาย hose จาก ISO container ไปต่อกับ line ไนโตรเจน",
    "condition": "ตรวจเช็คว่าทำการต่อถูกต้อง",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0606090101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>เสร็จสิ้นการ loading</strong>",
    "practice": "9. ทำการเปิดไนโตรเจนไล่ของเหลวที่ค้างอยู่ในสาย hose และใน line ท่อ ให้หมดเพื่อป้องกันการอุดตัน",
    "condition": "ตรวจสอบที่ side glass ว่าไม่มีของเหลวตกค้าง",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0606100101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>เสร็จสิ้นการ loading</strong>",
    "practice": "10. หลังจากตรวจสอบแล้วว่าไม่มีของเหลวค้างภายในท่อให้ทำการปิดไนโตรเจนและปิดวาล์วที่ขึ้นไป 21V-306",
    "condition": "ตรวจเช็คว่า valve ปิดจริง",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l0606110101",
        },
        {
          "name": "l0306110102",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>เสร็จสิ้นการ loading</strong>",
    "practice": "11. ถอดสายดินที่ต่อกับรถออก",
    "condition": "ถอดออกและเก็บเข้าที่",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0606120101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>เสร็จสิ้นการ loading</strong>",
    "practice": "12. ปิดระบบควบคุมที่ DCS",
    "condition": "ตรวจเช็คของจริงว่าปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0606130101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>เสร็จสิ้นการ loading</strong>",
    "practice": "13. ตรวจสอบระดับของเหลวใน 21V-306",
    "condition": "ตรวจเช็คที่ DCS",
    "result": {
      "type": "cdcs",
      "field": [
        {
          "name": "l0606140101",
        },
      ],
    },
  },
  {
    "isSection": false,
    "rowSpan": 1,
    "sequence": "<strong>เสร็จสิ้นการ loading</strong>",
    "practice": "14. ทำการจดบันทึกค่าที่ต่างกันหลังจากรับ",
    "condition": "ต้องไม่ต่างจากที่คำนวณไม่เกิน...........kg",
    "result": {
      "type": "cb",
      "field": [
        {
          "name": "l0606150101",
        },
      ],
    },
  },

]

