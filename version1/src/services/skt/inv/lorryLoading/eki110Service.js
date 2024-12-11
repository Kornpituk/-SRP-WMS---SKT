import { urlApi } from '@/api'
import axios from '@axios'

export async function generate(poEtlLogDetailJournalID) {
  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  await axios.post(`${urlApi.value}/api/v1/LorryFormEkiA/generate?poEtlLogDetailJournalID=${poEtlLogDetailJournalID}`, [], {
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

  return await axios.get(`${urlApi.value}/api/v1/LorryFormEkiA/get/${poEtlLogDetailJournalID}`, {
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
  var response =  await axios.post(`${urlApi.value}/api/v1/LorryFormEkiA/save/${poEtlLogDetailJournalIDQueryParameters.value}`, ipaRequestData.value, {
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
export const eki110ItemTemplate = [
  // 1.check ใบส่งสินค้า  
  {
    "isSection": true,
    "rowSpan": 5,
    "sequence": "<strong>1.check ใบส่งสินค้า  </strong>",
    "practice": "( <span class='text-red'>A</span> ) จำนวนที่ระบุ ในใบส่งสินค้า    ",
    "condition": "",
    "result": {
      "type": "kgA",
      "field": [
        {
          "name": "l1001010101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "( <span class='text-red'>B</span>  ) จำนวนที่ได้จาก Level  จากการอ่าน DCS",
    "condition": "ต้องไม่เกิน 25,000 kg",
    "result": {
      "type": "kgB",
      "field": [
        {
          "name": "l1001020101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "( <span class='text-red'>C</span>  ) ปริมาณที่คำนวณได้ก่อนการรับ (A + B) ",
    "condition": "A+B",
    "result": {
      "type": "abkg",
      "field": [
        {
          "name": "l1001030101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "จำเป็นต้องยืนยันว่า A+B ต้องน้อยกว่า 40,000 kg",
    "condition": "A+B = < 40,000 kg",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1001040101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "ตรวจสอบไฟสถานะอนุญาต ติดหรือดับ ( Y )",
    "condition": "ไฟดับ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1001050101",
          
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
          "name": "l1002010101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "<strong><u>หากพบว่าไม่ตรงให้แจ้งหัวหน้างานทันที</u></strong>",
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
          "name": "l100301",
          
        },
        {
          "startPracticeText": "ชุดป้องกันสารเคมี",
          "endPracticeText": "",
          "name": "l100302",
          
        },
        {
          "startPracticeText": "กระบังหน้า",
          "endPracticeText": "",
          "name": "l100303",
          
        },
        {
          "startPracticeText": "รองเท้าเซฟตี๊",
          "endPracticeText": "",
          "name": "l100304",
          
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
          "name": "l100305",
          
        },
        {
          "startPracticeText": "หน้ากาก กรองสารเคมี (สีขาว)",
          "endPracticeText": "",
          "name": "l100306",
          
        },
        {
          "startPracticeText": "เข็มขัดนิรภัย",
          "endPracticeText": "",
          "name": "l100307",
          
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
          "name": "l100401",
          
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1004010101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ใส่หมอนรองห้ามล้อเคลื่อนด้านหน้า-หลัง No.2",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l100402",
          
        },
      ],
    },
    "condition": "ใส่แล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1004020101",
          
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
          "name": "l100403",
          
        },
      ],
    },
    "condition": "ต่อแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1004030101",
          
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
          "name": "l100404",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1004040101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เก็บ Sample (จาก Lorry tank )ส่ง INSP No.4 ( รอผล Lab )",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l100405",
          
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1004050101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ต่อสายจากรถเข้า pump 11P-110A No.5",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l100406",
          
        },
      ],
    },
    "condition": "ต่อแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1004060101",
          
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
          "name": "l100407",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1004070101",
          
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
          "name": "l100408",
          
        },
      ],
    },
    "condition": "เปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1004080101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Check leak ที่สายต่อว่ารั่วหรือไม่ No.5",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l100409",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "leak",
      "field": [
        {
          "name": "l1004090101",
          
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
          "name": "l100410",
          
        },
      ],
    },
    "condition": "เปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1004100101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "กดปุ่ม Unloading ( วงกลมสีแดง ) ( X )",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l100411",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1004110101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เช็คที่ตู้ควบคุมวาล์ว XV-110 C ต้องเปิด ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l100412",
          
        },
      ],
    },
    "condition": "เปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1004120101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ตรวจสอบไฟสถานะอนุญาต ดับหรือติด ( Y )",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l100413",
          
        },
      ],
    },
    "condition": "ไฟติด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1004130101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "กดปุ่ม Start ที่ตัวควบคุมปั๊ม ( วงกลมสีแดง ) ( Z )",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l100414",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1004140101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "บันทึกเวลา start  (11P-110A)",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l100415",
          
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l1004150101", // A
          
        },
        {
          "name": "l1004150102", // B
          
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
    "condition": "อยู่ระหว่าง  0.25 - 0.35",
    "result": {
      "type": "mpa2",
      "field": [
        {
          "name": "l1005020101",
          
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
          "name": "l1005030101",
          
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
          "name": "l100504",
          
        },
      ],
    },
    "condition": "ปิดสวิตซ์อยู่ที่ off",
    "result": {
      "type": "",
      "field": [],
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
          "name": "l100505",
          
        },
      ],
    },
    "condition": "หมด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1005050101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ปิดสวิตซ์ Pump  ไปตำแหน่ง OFF",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l100506",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1005060101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ต่อสายลมจาก No.12 มาต่อที่ข้อต่อที่Tank  แล้วเปิด Air ไล่สารในสายให้หมด",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l100507",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1005070101",
          
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
          "name": "l100508",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1005080101",
          
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
          "name": "l100509",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1005090101",
          
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
          "name": "l100601",
          
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l1006010101",
          
        },
        {
          "name": "l1006010102",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "( <span class='text-red'>D</span>  )  เช็ค Level ในแท้งค์11V-110 เท่ากับ",
      "endPracticeText": "%     ( X )     ",
      "type": "d",
      "field": [
        {
          "name": "l100602",
          
        },
      ],
    },
    "condition": "น้ำหนักที่อ่านได้",
    "result": {
      "type": "kg",
      "field": [
        {
          "name": "l1006020101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ส่วนต่างระหว่างจำนวนที่คำนวณได้และจำนวนที่รับจริง  (<span class='text-red'>C - D</span> )",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l100603",
          
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "cdkg",
      "field": [
        {
          "name": "l1006030101",
          
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
          "name": "l100604",
          
        },
      ],
    },
    "condition": "ปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1006040101",
          
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
          "name": "l100605",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1006050101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "กดปุ่ม finish unloading ( วงกลมสีเขียว )(X)",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l100606",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1006060101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เช็คตู้ควบคุมวาล์ว XV-110C ต้องปิด",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l100607",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1006070101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ตรวจสอบไฟสถานะอนุญาต ดับหรือติด ( Y )",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l100608",
          
        },
      ],
    },
    "condition": "ไฟดับ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1006080101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เอาหมอนรองล้อ รถออก  No.2",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l100609",
          
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1006090101",
          
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
          "name": "l100610",
          
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1006100101",
          
        },
      ],
    },
  },

]
