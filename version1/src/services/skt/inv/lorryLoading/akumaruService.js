
import { urlApi } from '@/api'
import axios from '@axios'

export function currencyFormat(number) {
  return new Intl.NumberFormat("th-TH", {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number)
}

export function passInitialData(type, params, index) {
  if (type == "oknot" ) {
    return params.toString()
  }else if(type == "bd" || type == "litre" || type == "percen" || type == "c" || type=='mpa'|| type=='amp' || type=='ab'){
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

export async function save(poEtlLogDetailJournalIDQueryParameters, lorryRequestData){
  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')
  
  return await axios.post(`${urlApi.value}/api/v1/LorryFormAkumaru/save/${poEtlLogDetailJournalIDQueryParameters.value}`, lorryRequestData.value, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
}

export const akumuruItemTemplate = [
  // 1.check ใบส่งสินค้า 
  {
    "isSection": true,
    "rowSpan": 4,
    "sequence": "<strong>1.check ใบส่งสินค้า  </strong>",
    "practice": "( <span class='text-red'>A</span> ) จำนวนที่ระบุ ในใบส่งสินค้า ",
    "condition": "",
    "result": {
      "type": "kg",
      "field": [
        {
          "name": "l0701010101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "( <span class='text-red'>B</span> ) จำนวนที่คิดได้จาก Level ก่อนรับ ",
      "endPracticeText": "mm.",
      "type": "d",
      "field": [
        {
          "name": "l070102",
          
        },
      ],
    },
    "condition": "ต้องไม่เกิน 1,100 mm.",
    "result": {
      "type": "kg",
      "field": [
        {
          "name": "l0701020101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "( <span class='text-red'>C</span> ) จากการคำนวนค่าที่ได้( A + B )",
    "condition": "ต้องไม่เกิน 40,000  Kg.",
    "result": {
      "type": "c",
      "field": [
        {
          "name": "l0701030101",
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

  // 2.Seal check
  {
    "isSection": true,
    "rowSpan": 1,
    "sequence": "<strong>2.Seal check</strong>",
    "practice": "Check Seal ที่ล็อกวาล์วและฝาถังว่าล็อกสนิทหรือไม่",
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0702010101",
          
        },
      ],
    },
  },

  // 3. check ก่อนปฏิบัติ
  {
    "isSection": true,
    "rowSpan": 3,
    "sequence": "<strong>3. check ก่อนปฏิบัติ</strong>",
    "practice": " Confirm Fire Work บริเวณที่ใกล้เคียง",
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0703010101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": " Checkอุณหภูมิ ในlorry tank ",
    "condition": "<span class='text-indigo-darken-4'>ต้องไม่เกิน 25 °C</span>",
    "result": {
      "type": "c2",
      "field": [
        {
          "name": "l0703020101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": " สายดินไม่ขาด",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0703030101",
          
        },
      ],
    },
  },

  // 4.อุปกรณ์ PPE 
  {
    "isSection": true,
    "rowSpan": 2,
    "sequence": "<strong>4.อุปกรณ์ PPE </strong>",
    "practice": {
      "type": "checkbox4",
      "field": [
        {
          "startPracticeText": "ถุงมือ",
          "endPracticeText": "",
          "name": "l070401",
          
        },
        {
          "startPracticeText": "ชุดป้องกันสารเคมี",
          "endPracticeText": "",
          "name": "l070402",
          
        },
        {
          "startPracticeText": "กระบังหน้า",
          "endPracticeText": "",
          "name": "l070403",
          
        },
        {
          "startPracticeText": "รองเท้าบูท",
          "endPracticeText": "",
          "name": "l070404",
          
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
          "name": "l070405",
          
        },
        {
          "startPracticeText": "หน้ากาก กรองอากาศสีเหลือง",
          "endPracticeText": "",
          "name": "l070406",
          
        },
        {
          "startPracticeText": "เข็มขัดนิรภัย",
          "endPracticeText": "",
          "name": "l070407",
          
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
    "rowSpan": 13,
    "sequence": "<strong>5. ขั้นตอนการปฏิบัติ</strong>",
    "practice": {
      "startPracticeText": "หยุดรถบริเวณที่ปฏิบัติงาน และดับเครื่องยนต์",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070501",
          
        },
      ],
    },
    "condition": "หยุด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0705010101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ใส่หมอนรองห้ามล้อเคลื่อนทั้งด้านหน้า - หลัง",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070502",
          
        },
      ],
    },
    "condition": "ใส่แล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0705020101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ต่อสายกราวน์เข้ากับตัวรถ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070503",
          
        },
      ],
    },
    "condition": "ต่อแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0705030101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ต่อ Line Vent เข้ากับ Vent บนรถ พร้อมเปิด Vent (No. 6)",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070504",
          
        },
      ],
    },
    "condition": "ต่อแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0705040101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เก็บตัวอย่างที่ 1 จาก Line Drain sample ( No. 16 )",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070505",
          
        },
      ],
    },
    "condition": "เก็บแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0705050101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ต่อสายจากรถเข้า pump <span class='text-red'>(ในวงกลม)</span> พร้อมล็อกให้เรียบร้อย",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070506",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0705060101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิด pump ว่าพร้อมใช้งานหรือไม่โดยเลื่อน สวิตซ์ไปที่ ON ถ้า Pump ทำงานปกติให้เลื่อนกลับมาที่ AUTO  ( No. 14 )",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070507",
          
        },
      ],
    },
    "condition": "pump ทำงาน",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0705070101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิดวาล์วท้ายรถ Check leak ที่สายต่อว่ารั่วหรือไม่",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070508",
          
        },
      ],
    },
    "condition": "ไม่รั่ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0705080101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ปิดวาล์วหมายเลข No. 4 , 3 , 2 ,16 ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070509",
          
        },
      ],
    },
    "condition": "ปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0705090101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิดวาล์วท้ายรถ และเปิดวาล์วเข้า Pump No.5 , 1",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070510",
          
        },
      ],
    },
    "condition": "เปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0705100101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ปรับระดับการไหลของเคมี โดยค่อย ๆ ปิด Line circulate",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070511",
          
        },
      ],
    },
    "condition": "ปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0705110101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "หากมีสิ่งแปลกปลอมเข้า pump ให้หยุดทันที<span class='text-indigo-darken-4'>(สังเกตแผ่นกระจกใส No. 5)</span>",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070512",
          
        },
      ],
    },
    "condition": "ไม่มีสิ่งแปลกปลอม",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0705120101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "บันทึกเวลา start  (11P-131)",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070513",
          
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l0705130101", // A
          
        },
        {
          "name": "l0705130102", // B
          
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
    "condition": "อยู่ระหว่าง  0.2 - 0.6",
    "result": {
      "type": "mpa2",
      "field": [
        {
          "name": "l0706020101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "      :  Amp meter ",
    "condition": " ( 7 - 20 Amp )",
    "result": {
      "type": "amp2",
      "field": [
        {
          "name": "l0706030101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Pumpหยุดเมื่อเคมีใน lorry หมด ให้ปิดสวิตซ์ไป Off เปิด circulate No. 17",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070604",
          
        },
      ],
    },
    "condition": "ปิดสวิตซ์อยู่ที่ off",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0706040101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Start ไปที่ ON อีกครั้ง โดยหรี่วาล์ว Line circulate 431 จนแน่ใจว่าหมด",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070605",
          
        },
      ],
    },
    "condition": "หมด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0706050101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ปิดวาล์วท้ายรถ และ วาล์วหัว pump No 5,1",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070606",
          
        },
      ],
    },
    "condition": "ปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0706060101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Start pump โดยเปิด circulate 431 100% ทิ้งไว้ 15 นาที",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070607",
          
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0706070101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ถอดสาย Hose และเก็บ sample จาก line No.2",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070608",
          
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0706080101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ถอด line vent และปิด เรียบร้อย  No.6",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070609",
          
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0706090101",
          
        },
      ],
    },
  },

  // 7.ขั้นตอนเมื่อรับเสร็จ
  {
    "isSection": true,
    "rowSpan": 10,
    "sequence": "<strong>7.ขั้นตอนเมื่อรับเสร็จ</strong>",
    "practice": {
      "startPracticeText": "บันทึกเวลารับเสร็จ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070701",
          
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l0707010101",
          
        },
        {
          "name": "l0707010102",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ถอด สาย hose - สายกราวด์ ออกแล้วหรือยัง",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070702",
          
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0707020101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ตรวจเช็ค valve เปิด อีกครั้งให้อยู่ในสภาพเดิมก่อนรับ No.17,431,413",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070703",
          
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0707030101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "หลังจาก 15 นาที ให้เลื่อนสวิตซ์ไปที่ auto เก็บตัวอย่างที่ 3 No.16",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070704",
          
        },
      ],
    },
    "condition": "เก็บแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0707040101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เก็บกรวย และอุปกรณ์ PPE ทำความสะอาด",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070705",
          
        },
      ],
    },
    "condition": "เก็บแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0707050101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "(<span class='text-red'>D</span>)  เช็ค Level ในแท้งค์11V-431 เท่ากับ ",
      "endPracticeText": "mm.",
      "type": "d",
      "field": [
        {
          "name": "l070706",
          
        },
      ],
    },
    "condition": "น้ำหนักที่อ่านได้",
    "result": {
      "type": "kg",
      "field": [
        {
          "name": "l0707060101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ส่วนต่างระหว่างจำนวนที่คำนวณได้และจำนวนที่รับจริง ( <span class='text-red'>C</span> - <span class='text-red'>D</span> )",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070707",
          
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "cdkg",
      "field": [
        {
          "name": "l0707070101",    
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "อุปกรณ์  ทำความสะอาด และหมอน รองล้อรถออก",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070708",
          
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "",
      "field": [
        {
          "name": "l0707080101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ตรวจเช็ค valve ปิด อีกครั้งให้อยู่ในสภาพเดิมก่อนรับ No. 5,4,3,2,1,16",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070709",
          
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0707090101",
          
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ทำการล้าง ตาม check sheet วิธีการล้าง",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l070710",
          
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0707100101",
          
        },
      ],
    },
  },

]
