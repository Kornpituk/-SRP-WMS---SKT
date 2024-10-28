import { ref } from 'vue';


export const ipaItemTemplate = [
  {
    "row": 1,
    "jobFlow": "<strong><u>ข้อควรระวัง</u><strong>",
    "practice": [
      ": หากมีงาน Hot work or Fire work ใกล้เคียง ให้แจ้งหัวหน้างานให้หยุดชั่วคราว",
      ": ให้ ปิดโทรศัพท์ขณะ Loading EPICHLO",
      ": หากมี EPICHLO หยดลงพื้น ให้ใช้ผ้า หรือ ตัวดูดซับ ห้ามใช้น้ำล้าง",
      ": Check วาล์ว ปิด ประตูน้ำก่อนปฏิบัติงาน",
      ": แจ้ง Leader Production เวลา Loading ว่าไม่ตรงกับเวลาการใช้ Pump 109D,S",
      ": ในการผลิต Check ถังดับเพลิงประเภท เคมีแห้ง ว่าพร้อมใช้งาน"
    ],
    "condition": "",
    "results": [
      {
        type: "oknot",
        value: "",
        fieldName: ""
      },
      {
        type: "oknot",
        value: "CB02"
      },
      {
        type: "oknot",
        value: ""
      }, {
        type: "oknot",
        value: ""
      }, {
        type: "oknot",
        value: ""
      }, {
        type: "oknot",
        value: ""
      }
    ],
  },
  {
    "row": 2,
    "jobFlow": "Document Check",
    "practice": [
      "1. จำนวนที่ระบุ ในใบส่งสินค้า",
      "2. Level ที่อ่านได้จาก Tank 11V-109A ก่อนรับ",
      "3. ตรวจสอบว่าปริมาณหลังจากรับไม่เกินความจุถัง",
      "4. ตรวจสอบ ปริมาณ ใน DCS",
      "5. Check Seal No.ที่รถส่งของ และ แป้นในถัง lorry ว่าตรง 10,000 ลิตร หรือไม่"
    ],
    "condition": [
      "ตามเอกสารใบส่ง",
      "ต้องไม่เกิน 575 mm.",
      " ต้องไม่เกิน 15,800 Litre",
      "กดดูที่ถัง 11V-109A ต้องไม่เกิน 3790 Litre.",
      "Seal ล็อกวาล์วไม่ขาดตรงตามใบส่ง"
    ],
    "results": [
      {
        type: "ab",
        value: ""
      },
      {
        type: "cd",
        value: ""
      },
      {
        type: "bd",
        value: ""
      }, {
        type: "litre",
        value: ""
      }, {
        type: "oknot",
        value: ""
      }, {
        type: "oknot",
        value: ""
      }
    ],
  },
  {
    "row": 3,
    "jobFlow": "ก่อนการปฏิบัติงาน",
    "practice": [
      "1. หยุดรถและดับเครื่องเรียบร้อย",
      "2. เอาหมอนรองล้อรถเรียบร้อย",
      "3. ต่อสายกราวน์เรียบร้อย",
      "4. เก็บตัวอย่าง ส่ง INSP เรียบร้อย",
      "5. นำลูกกุญแจมาเปิดล็อกวาล์ว 11",
      "6. Moisture เท่าไหร่"
    ],
    "condition": [
      "รถต้องหยุดนิ่งสนิท",
      "รองล้อรถทั่งด้านหน้าและด้านหลัง",
      "ต่อสายกราวน์บริเวณที่โหลดเข้ากับรถ",
      "1 ขวดแก้วเล็กและ 1 ขวดแก้วใหญ่เล็กด้านบนรถ",
      "IPA กุญแจใช้รหัสล็อค",
      "0.100 Max"
    ],
    "results": [
      {
        type: "oknot",
        value: ""
      },
      {
        type: "oknot",
        value: ""
      },
      {
        type: "oknot",
        value: ""
      }, {
        type: "oknot",
        value: ""
      }, {
        type: "oknot",
        value: ""
      }, {
        type: "percen",
        value: ""
      }
    ],
  },
  {
    "row": 4,
    "jobFlow": "Line setting </br> หัวถัง 11V-109A",
    "practice": [
      "1. วาล์ว 1, 2",
      "2. วาล์ว 3, 4 , 5",
      "3. Temperature เท่าไหร่",
    ],
    "condition": [
      "Open ( เปิด )",
      "Close ( ปิด )",
      "อุณหภูมิต้องไม่สูงกว่า  25 C' ",
    ],
    "results": [
      {
        type: "oknot",
        value: ""
      },
      {
        type: "oknot",
        value: ""
      },
      {
        type: "C",
        value: ""
      }

    ],
  },
  {
    "row": 5,
    "jobFlow": "Operator </br> ทำการสวมใส่อุปกรณ์ PPE",
    "practice": [
      " - ถุงมือ",
      " - แว่น safety",
      " - หน้ากากคางหมู",
      " - กรองอากาศ ( สีดำ )",
      " - ชุดป้องกันสารเคมี",
      " - เข็มขัดนิรภัย",
    ],
    "condition": [
      "ใส่ถุงมือยาง",
      "ต้องเป็นแว่น safety เท่านั้น",
      "ใส่ให้ถูกวิธี",
      "ใช้เฉพาะตัวกรองสีดำ",
      "ใส่ทั้งเสื้อและกางเกงแล้ว",
      ""
    ],
    "results": [
      {
        type: "oknot",
        value: ""
      },
      {
        type: "oknot",
        value: ""
      },
      {
        type: "oknot",
        value: ""
      },
      {
        type: "oknot",
        value: ""
      },
      {
        type: "oknot",
        value: ""
      },
      {
        type: "oknot",
        value: ""
      }
    ],
  },
  {
    "row": 6,
    "jobFlow": "Lorry tank",
    "practice": [
      "1. ต่อสายHose เข้ากับ Valve 11",
      "2. ต่อ Line Vent เข้ากับ Vent ของ Lorry และเปิด Valve 12",
      "3. เปิดวาล์วจาก Lorry",
      "4. Check Leak สาย Hose, ข้อต่อวาล์ว ระหว่าง Valve 11 , 14"
    ],
    "condition": [
      "ต่อโดยตรงโดยไม่ผ่าน Pump รถ Lorry",
      "อย่าลืมเปิดวาล์ว 12",
      "No.14 Open (เปิด)",
      "ต้องไม่รั่ว"
    ],
    "results": [
      {
        type: "oknot",
        value: ""
      },
      {
        type: "oknot",
        value: ""
      },
      {
        type: "oknot",
        value: ""
      },
      {
        type: "oknot",
        value: ""
      }
    ],
  },
  {
    "row": 7,
    "jobFlow": "Charging",
    "practice": [
      "1. เปิดวาล์ว",
      "2. Start Pump เวลาเริ่ม",
      "3. Check pressure 11P-109A",
      "4. Check Ampmeter ของตัว Pump",
      "5. Check ไฟที่หัว Pump"
    ],
    "condition": [
      "วาล์ว 11 เปิด",
      "Actual Check",
      "ดูจาก pressure gauge ผ่าน Pump (0.2 - 0.45)",
      "ดูจากตู้ Control Pump 11P-109A (ไม่ต่ำกว่า 8 Amp)",
      "ไฟต้องแสดงเป็นสีเขียวเท่านั้น"
    ],
    "results": [
      {
        type: "oknot",
        value: ""
      },
      {
        type: "actualCheck",
        value: ""
      },
      {
        type: "mpa",
        value: ""
      },
      {
        type: "amp",
        value: ""
      },
      {
        type: "oknot",
        value: ""
      }
    ],
  },
  {
    "row": 8,
    "jobFlow": "เมื่อรับเสร็จ",
    "practice": [
      "1. เมื่อ Pump หยุดทำงาน ปิด Valve 11, 14 และ Vent 12",
      "2. Drain จากสาย Hose และ Lorry ให้หมด",
      "3. บันทึกเวลารับเสร็จ",
      "4. ถอดสายดินออกจากรถ",
      "5. เปิด Valve 8 และ Cerculate 10 นาที",
      "6. เก็บ Sample Check Moisture 1 ขวดแก้วใหญ่",
      "7. ปิด Valve 8",
      "8. เปิด Valve 4, 5",
      "9. อ่าน Level ที่ถัง 11V-109A ทำการ Record",
      "10. Check level DCS ได้เท่าไหร่",
      "11. หลังจากโหลดเสร็จล็อกวาล์ว 11",
      "12. ส่วนต่างระหว่าง (B + D) - F ="
    ]
    ,
    "condition": [
      "ด้านล่าง บริเวณ Pump 11V-109A",
      "ใน Lorry และ Hose หมด",
      "Actual Check",
      "เอาออกเรียบร้อย",
      "Open (เปิด) วาล์ว 8",
      "0.100 Max",
      "Close (ปิด) วาล์ว 8",
      "ด้านบนถัง 11V-109A",
      "Actual Check",
      "Actual Check",
      "กุญแจล็อครหัส",
      "ต้องไม่ต่างกันมากจากการคำนวณ"
    ],
    "results": [
      {
        type: "oknot",
        value: ""
      },
      {
        type: "oknot",
        value: ""
      },
      {
        type: "actualCheck",
        value: ""
      },
      {
        type: "oknot",
        value: ""
      },
      {
        type: "oknot",
        value: ""
      },
      {
        type: "percen",
        value: ""
      },
      {
        type: "oknot",
        value: ""
      },
      {
        type: "oknot",
        value: ""
      },
      {
        type: "ef",
        value: ""
      },
      {
        type: "g",
        value: ""
      },
      {
        type: "oknot",
        value: ""
      },
      {
        type: "litre",
        value: ""
      },
    ],
  }
]
