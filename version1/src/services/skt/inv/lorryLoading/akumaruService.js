

export const akumaruRequestData = {
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
  "l0701010101": "0",
  "l0701020101": "0",
  "l0701030101": "0",
  "l0702010101": "-1",
  "l0703010101": "-1",
  "l0703020101": "0",
  "l0703030101": "-1",
  "l0705010101": "-1",
  "l0705020101": "-1",
  "l0705030101": "-1",
  "l0705040101": "-1",
  "l0705050101": "-1",
  "l0705060101": "-1",
  "l0705070101": "-1",
  "l0705080101": "-1",
  "l0705090101": "-1",
  "l0705100101": "-1",
  "l0705110101": "-1",
  "l0705120101": "-1",
  "l0705130101": "",
  "l0705130102": "",
  "l0706020101": "0",
  "l0706030101": "0",
  "l0706040101": "-1",
  "l0706050101": "-1",
  "l0706060101": "-1",
  "l0706070101": "-1",
  "l0706080101": "-1",
  "l0706090101": "-1",
  "l0707010101": "",
  "l0707010102": "",
  "l0707020101": "-1",
  "l0707030101": "-1",
  "l0707040101": "-1",
  "l0707050101": "-1",
  "l0707060101": "0",
  "l0707070101": "0",
  "l0707080101": "-1",
  "l0707090101": "-1",
  "l0707100101": "-1"
}

export const akumuruItemTemplate = [
  // 1.check ใบส่งสินค้า 
  {
    "isSection": true,
    "rowSpan": 4,
    "sequence": "<strong>1.check ใบส่งสินค้า  </strong>",
    "practice": "( A ) จำนวนที่ระบุ ในใบส่งสินค้า    ",
    "condition": "",
    "result": {
      "type": "kg",
      "field": [
        {
          "name": "l0701010101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "( B ) จำนวนที่คิดได้จาก Level ก่อนรับ          .…………..………….…mm.",
    "condition": "ต้องไม่เกิน 1,100 mm.",
    "result": {
      "type": "kg",
      "field": [
        {
          "name": "l0701020101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "( C ) จากการคำนวนค่าที่ได้( A + B )",
    "condition": "ต้องไม่เกิน 40,000  Kg.",
    "result": {
      "type": "kg",
      "field": [
        {
          "name": "l0701030101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "หากพบว่าไม่ตรงให้แจ้งหัวหน้างานทันที",
    "condition": "",
    "result": {
      "type": "",
      "field": []
    }
  },
  // 2.Seal check
  {
    "isSection": true,
    "rowSpan": 1,
    "sequence": "<strong>2.Seal check</strong>",
    "practice": "Check Seal ที่ล็อกวาล์วและฝาถังว่าล็อกสนิดหรือไม่",
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0702010101",
          "value:": ""
        }
      ]
    }
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
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": " Checkอุณหภูมิ ในlorry tank ",
    "condition": "ต้องไม่เกิน 25 C'",
    "result": {
      "type": "c2",
      "field": [
        {
          "name": "l0703020101",
          "value:": "",
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
          "value:": ""
        }
      ]
    }
  },
  // 4.อุปกรณ์ PPE 
  {
    "isSection": true,
    "rowSpan": 2,
    "sequence": "<strong>4.อุปกรณ์ PPE </strong>",
    "practice": "   O  ถุงมือ O ชุดป้องกันสารเคมี  O กระบังหน้า O รองเท้าบูท",
    "condition": "",
    "result": {
      "type": "",
      "field": []
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "   O แว่นตา    O หน้ากาก กรองอากาศสีเหลือง O เข็มขัดนิรภัย",
    "condition": "",
    "result": {
      "type": "",
      "field": []
    }
  },
  // 5. ขั้นตอนการปฏิบัติ
  {
    "isSection": true,
    "rowSpan": 13,
    "sequence": "<strong>5. ขั้นตอนการปฏิบัติ</strong>",
    "practice": "O  หยุดรถบริเวณที่ปฏิบัติงาน และดับเครื่องยนต์",
    "condition": "หยุด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0705010101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O  ใส่หมอนลองห้ามล้อเคลื่อนทั้งด้านหน้า - หลัง",
    "condition": "ใส่แล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0705020101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O  ต่อสายกราวน์เข้ากับตัวรถ",
    "condition": "ต่อแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0705030101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O  ต่อ Line Vent เข้ากับ Vent บนรถ พร้อมเปิด Vent (No. 6)",
    "condition": "ต่อแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0705040101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O  เก็บตัวอย่างที่ 1 จาก Line Drain sample ( No. 16 )",
    "condition": "เก็บแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0705050101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O  ต่อสายจากรถเข้า pump (ในวงกลม) พร้อมล็อกให้เรียบร้อย",
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0705060101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O  เปิด pump ว่าพร้อมใช้งานหรือไม่โดยเลื่อน สวิตซ์ไปที่ ON ถ้า Pump ทำงานปกติให้เลื่อนกลับมาที่ AUTO  ( No. 14 )",
    "condition": "pump ทำงาน",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0705070101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O   เปิดวาล์วท้ายรถ Check leak ที่สายต่อว่ารั่วหรื่อไม่",
    "condition": "ไม่รั่ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0705080101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O   ปิดวาล์วหมายเลข No. 4 , 3 , 2 ,16 ",
    "condition": "ปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0705090101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O   เปิดวาล์วท้ายรถ และเปิดวาล์วเข้า Pump No.5 , 1",
    "condition": "เปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0705100101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O   ปรับระดับการไหลของเคมี โดยค่อย ๆ ปิด Line circulate",
    "condition": "ปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0705110101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O   หากมีสิ่งแปลกปลอมเข้า pump ให้หยุดทันที(สังเกตแผ่นกระจกใส No. 5)",
    "condition": "ไม่มีสิ่งแปลกปลอม",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0705120101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O   บันทึกเวลา start  (11P-131)",
    "condition": "",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l0705130101", // A
          "value:": ""
        },
        {
          "name": "l0705130102", // B
          "value:": ""
        }
      ]
    }
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
      "field": []
    }
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
          "value:": ""
        }
      ]
    }
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
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O    Pumpหยุดเมื่อเคมีใน lorry หมด ให้ปิดสวิตซ์ไป Off เปิด circulate No. 17",
    "condition": "ปิดสวิตซ์อยู่ที่ off",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0706040101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O   Start ไปที่ ON อีกครั้ง โดยหรี่วาล์ว Line circulate 431 จนแน่ใจว่าหมด",
    "condition": "หมด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0706050101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O   ปิดวาล์วท้ายรถ และ วาล์วหัว pump No 5,1",
    "condition": "ปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0706060101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O   Start pump โดยเปิด circulate 431 100% ทิ้งไว้ 15 นาที",
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0706070101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O   ถอดสาย Hose และเก็บ sample จาก line No.2",
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0706080101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O   ถอด line vent และปิด เรียบร้อย  No.6",
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0706090101",
          "value:": ""
        }
      ]
    }
  },
  // 7.ขั้นตอนเมื่อรับเสร็จ
  {
    "isSection": true,
    "rowSpan": 10,
    "sequence": "<strong>7.ขั้นตอนเมื่อรับเสร็จ</strong>",
    "practice": "O  บันทึกเวลารับเสร็จ",
    "condition": "",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l0707010101",
          "value:": ""
        },
        {
          "name": "l0707010102",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O   ถอด สาย hose - สายกราวด์ ออกแล้วหรือยัง",
    "condition": "ปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0707020101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O  ตรวจเช็ค valve เปิด อีกครั้งให้อยู่ในสภาพเดิมก่อนรับ No.17,431,413",
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0707030101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O  หลังจาก 15 นาที ให้เลื่อนสวิตซ์ไปที่ auto เก็บตัวอย่างที่ 3 No.16",
    "condition": "เก็บแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0707040101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O  เก็บกรวย และอุปกรณ์ PPE ทำความสะอาด",
    "condition": "เก็บแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0707050101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "(D)  เช็ค Level ในแท้งค์11V-431 เท่ากับ………………….mm.          ",
    "condition": "น้ำหนักที่อ่านได้",
    "result": {
      "type": "kg",
      "field": [
        {
          "name": "l0707060101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O  ส่วนต่างระหว่างจำนวนที่คำนวณได้และจำนวนที่รับจริง  (C - D)                    ",
    "condition": "",
    "result": {
      "type": "kg",
      "field": [
        {
          "name": "l0707070101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O  อุปกรณ์  ทำความสะอาด และหมอน ลองล้อรถออก           ",
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0707080101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O  ตรวจเช็ค valve ปิด อีกครั้งให้อยู่ในสภาพเดิมก่อนรับ No. 5,4,3,2,1,16",
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0707090101",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "O  ทำการล้าง ตาม check sheet วิธีการล้าง ",
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0707100101",
          "value:": ""
        }
      ]
    }
  },

]
