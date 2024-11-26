

export const telaRequestData = {
  "RmLorryLoadingFormJournalId": 0,
  "ProductId": "",
  "ProductName": "",
  "LoadedDate": null,
  "PurchaseOrderNo": null,
  "WHStaff": "",
  "WHStaffUpdatedDate": null,
  "WHLeader": "",
  "WHLeaderDate": null,
  "WHSupervisor": "",
  "WHSupervisorDate": null,
  "l1101010101": "0",
  "l1101020101": "0",
  "l1101030101": "0",
  "l1102010101": "-1",
  "l1103010101": "-1",
  "l1105010101": "-1",
  "l1105020101": "-1",
  "l1105030101": "-1",
  "l1105040101": "-1",
  "l1105050101": "-1",
  "l1105060101": "-1",
  "l1105070101": "-1",
  "l1105080101": "-1",
  "l1105090101": "-1",
  "l1105100101": "-1",
  "l1105110101": "0",
  "l1105110102": "0",
  "l1106020101": "0",
  "l1106030101": "0",
  "l1106040101": "-1",
  "l1106050101": "-1",
  "l1106060101": "-1",
  "l1106070101": "-1",
  "l1106080101": "-1",
  "l1106090101": "-1",
  "l1106100101": "-1",
  "l1106110101": "-1",
  "l1106120101": "-1",
  "l1107010101": "0",
  "l1107010102": "0",
  "l1107020101": "-1",
  "l1107030101": "0",
  "l1107040101": "0",
  "l1107050101": "-1",
  "l1107060101": "-1",
  "l1107070101": "-1",
  "l110102": "0",
  "l110401": "0",
  "l110402": "0",
  "l110403": "0",
  "l110404": "0",
  "l110405": "0",
  "l110501": "0",
  "l110502": "0",
  "l110503": "0",
  "l110504": "0",
  "l110505": "0",
  "l110506": "0",
  "l110507": "0",
  "l110508": "0",
  "l110509": "0",
  "l110510": "0",
  "l110511": "0",
  "l110604": "0",
  "l110605": "0",
  "l110606": "0",
  "l110607": "0",
  "l110608": "0",
  "l110609": "0",
  "l110610": "0",
  "l110611": "0",
  "l110612": "0",
  "l110701": "0",
  "l110702": "0",
  "l110704": "0",
  "l110705": "0",
  "l110706": "0",
  "l110707": "0",

}

export const telaItemTemplate = [
  // 1.check ใบส่งสินค้า  
  {
    "isSection": true,
    "rowSpan": 4,
    "sequence": "<strong>1.check ใบส่งสินค้า  </strong>",
    "practice": "( A ) จำนวนที่ระบุ ในใบส่งสินค้า  ",
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
    "practice": "( B ) จำนวนสารเคมีที่ดูได้จาก DCS           ",
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
    "practice": "( C ) จำนวนใน DCS + จำนวนที่รับจริง  (A +B )   Kg.        ",
    "condition": "ต้องไม่เกิน 8,500 Kg.",
    "result": {
      "type": "kg",
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
    "rowSpan": 11,
    "sequence": "<strong>5. ขั้นตอนการปฏิบัติ</strong>",
    "practice": {
      "startPracticeText": "หยุดรถบริเวณที่ปฏิบัติงาน และดับเครื่องยนต์ NO.1",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110501",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1105010101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ใส่หมอนลองห้ามล้อเคลื่อน NO.2",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110502",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1105020101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ต่อสายกราวน์เข้ากับตัวรถ NO.3",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110503",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1105030101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "นำกรวยมาวางกั้นบอกพื้นที่ปฏิบัติงาน NO.4",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110504",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1105040101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ต่อสาย NO.5 จากรถเข้า pump ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110505",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1105050101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิด  valve จาก Lorry ทุก Tank NO.6",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110508",
          "value:": "",
        },
      ],
    },
    "condition": "เปิดเรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1105080101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิดวาล์วเข้า Pump  NO.7",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110508",
          "value:": "",
        },
      ],
    },
    "condition": "เปิดเรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1105080101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Check leak ที่สายต่อว่ารั่วหรื่อไม่  NO.5",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110509",
          "value:": "",
        },
      ],
    },
    "condition": "ต้องไม่รั่ว",
    "result": {
      "type": "leak",
      "field": [
        {
          "name": "l1105090101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิดวาล์วตรง Hopper เพื่อ blow อากาศ  NO.8",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110510",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1105100101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ปิด วาล์ว Hopper เมื่อไม่มีอากาศอยู่ใน line pump NO.8",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110511",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1105110101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "บันทึกเวลา start  (101P-023) NO.9",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110511",
          "value:": "",
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l1105110101", // A
          "value:": "",
        },
        {
          "name": "l1105110102", // B
          "value:": "",
        },
      ],
    },
  },

  // 6. ขั้นตอนขณะปฏิบัติงาน
  {
    "isSection": true,
    "rowSpan": 12,
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
          "name": "l1106020101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "      :  Amp miter ",
    "condition": " ( 7 - 14 Amp )",
    "result": {
      "type": "amp2",
      "field": [
        {
          "name": "l1106030101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "หยุด Pump  เมื่อ tela ใน lorry หมด  NO.9",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110604",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1106040101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ปิดวาล์ว Lorry  NO.6",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110605",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1106050101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ปิดวาล์ว Receiving  NO.7",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110606",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1106060101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Drain น้ำมันในหม้อพักที่รถและในสาย hose ลง hopper. NO.10",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110607",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1106070101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิดวาล์ว Hopper  NO.8",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110608",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1106080101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Start pump อีกครั้ง  (101P-023). NO.9",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110609",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1106090101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "หยุด Pump เมื่อใน hopper หมด.NO.9",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110610",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1106100101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ปิดวาล์วลง Hopper NO.8",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110611",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1106110101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Check ใน lorry ว่าหมดแน่นอน  NO.11",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110612",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "soldout",
      "field": [
        {
          "name": "l1106120101",
          "value:": "",
        },
      ],
    },
  },

  // 7.ขั้นตอนเมื่อรับเสร็จ
  {
    "isSection": true,
    "rowSpan": 7,
    "sequence": "<strong>7.ขั้นตอนเมื่อรับเสร็จ</strong>",
    "practice": {
      "startPracticeText": "บันทึกเวลาที่รับเสร็จ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110701",
          "value:": "",
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l1107010101",
          "value:": "",
        },
        {
          "name": "l1107010102",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ถอด สาย hose - สายกราวด์ ออกแล้วหรือยัง NO.5 , NO.3",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110702",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1107020101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": true,
    "sequence": "",
    "practice": "(D) เช็ค Level ในแท้งค์101V-020  NO.12 ",
    "condition": "น้ำหนักที่อ่านได้",
    "result": {
      "type": "LTR",
      "field": [
        {
          "name": "l1107030101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ส่วนต่างระหว่างจำนวนที่คำนวณได้และจำนวนที่รับจริง                      ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110704",
          "value:": "",
        },
      ],
    },
    "condition": "(C - D)",
    "result": {
      "type": "LTR",
      "field": [
        {
          "name": "l1107040101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ตรวจเช็ค valve เปิด-ปิด อีกครั้งให้อยู่ในสภาพเดิมก่อนรับ  NO.7 ,8",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110705",
          "value:": "",
        },
      ],
    },
    "condition": "อยู่สภาพเดิมก่อนรับ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1107050101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เอาหมอนลองล้อ รถออก  NO.2",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110706",
          "value:": "",
        },
      ],
    },
    "condition": "เอาออกแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1107060101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เก็บกรวย และอุปกรณ์ PPE ทำความสะอาด  NO.4",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l110707",
          "value:": "",
        },
      ],
    },
    "condition": "เก็บเรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1107070101",
          "value:": "",
        },
      ],
    },
  },
  

]
