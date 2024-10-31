

export const DieselOilTankItem = [
  {
    "row": 1,
    "jobflow": "Check ใบส่งสินค้า",
    "manualWork": [
      "( A ) จำนวนน้ำมันที่ระบุ ในใบส่งสินค้า",
      "( B ) จำนวนน้ำมันที่คิดได้จาก Level           ……………..………mm.",
      "( C ) จากการคำนวน Level (A + B)",
      "หากพบว่าไม่ตรงให้แจ้งหัวหน้างานทันที",
    ],
    "condition": [
      "",
      "B ห้ามเกิน 1,400 mm.",
      "ต้องไม่เกิน 15,000 LTR",
      "",
    ],
    "result": [
      {
        type: "freeText",
        value: "",
        prefixText: "LTR",
      },
      {
        type: "freeText",
        value: "",
        prefixText: "LTR",
      },
      {
        type: "freeText",
        value: "",
        prefixText: "LTR",
      },
      {
        type: "advice",
        value: "",
        prefixText: "",
      },
    ],
  },
  {
    "row": 2,
    "jobflow": "Seal No. check",
    "manualWork": [
      "Check Seal No.ที่ล็อกวาล์วและฝาถังว่าตรงกับใบส่งหรือไม่ NO.11",
    ],
    "condition": [
      "ตรงและครบ",
    ],
    "result": [
      {
        type: "oknot",
        value: "",
        prefixText: "",
      },
    ],
  },
  {
    "row": 3,
    "jobflow": " check ในlorry tank",
    "manualWork": [
      "Check level ในถัง Diesel oil ว่าท่วมแป้น 9,000 ลิตร NO.11",
    ],
    "condition": [
      "ทุกช่องต้องท่วมแป้น",
    ],
    "result": [
      {
        type: "oknot",
        value: "",
        prefixText: "",
      },
    ],
  },
  {
    "row": 4,
    "jobflow": "อุปกรณ์ PPE",
    "manualWork": [
      "O  ถุงมือ O ชุดป้องกันการกระเด็นใส่  O กระบังหน้า O รองเท้าบูท",
      "O  แว่นตา",
    ],
    "condition": [
      "",
      "",
    ],
    "result": [
      {
        type: "",
        value: "",
        prefixText: "",
      },
    ],
  },
  {
    "row": 5,
    "jobflow": "ขั้นตอนการปฏิบัติ",
    "manualWork": [
      "O  หยุดรถบริเวณที่ปฏิบัติงาน และดับเครื่องยนต์ NO.1",
      "O  ใส่หมอนลองห้ามล้อเคลื่อน NO.2",
      "O  ต่อสายกราวน์เข้ากับตัวรถ NO.3",
      "O  นำกรวยมาวางกั้นบอกพื้นที่ปฏิบัติงาน NO.4",
      "O  ต่อสาย NO.5 จากรถเข้า pump",
      "O  เปิด valve จาก Lorry ทุก Tank NO.6",
      "O  เปิดวาล์วเข้า Pump  NO.7",
      "O  Check leak ที่สายต่อว่ารั่วหรื่อไม่  NO.5",
      "O  เปิดวาล์วตรง Hopper เพื่อ blow อากาศ  NO.8",
      "O  ปิด วาล์ว Hopper เมื่อไม่มีอากาศอยู่ใน line pump NO.8",
      "O  บันทึกเวลา start  (101P-023) NO.9",
    ],
    "condition": [
      "เรียบร้อย",
      "เรียบร้อย",
      "เรียบร้อย",
      "เรียบร้อย",
      "เรียบร้อย",
      "เปิดเรียบร้อย",
      "เปิดเรียบร้อย",
      "ต้องไม่รั่ว",
      "เรียบร้อย",
      "เรียบร้อย",
      "",
    ],
    "result": [
      {
        type: "oknot",
        value: "",
        prefixText: "",
      },
      {
        type: "",
        value: "",
        prefixText: "",
      },
    ],
  },
]
