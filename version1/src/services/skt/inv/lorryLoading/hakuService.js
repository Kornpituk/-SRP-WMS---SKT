

export const hakuRequestData = {
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
  "l0901010101": "0",
  "l0901020101": "0",
  "l0901030101": "0",
  "l0901040101": "-1",
  "l0901050101": "-1",
  "l0902010101": "-1",
  "l0904010101": "-1",
  "l0904020101": "-1",
  "l0904030101": "-1",
  "l0904040101": "-1",
  "l0904050101": "-1",
  "l0904060101": "-1",
  "l0904070101": "-1",
  "l0904080101": "-1",
  "l0904090101": "-1",
  "l0904100101": "-1",
  "l0904110101": "-1",
  "l0904120101": "-1",
  "l0904130101": "-1",
  "l0904140101": "-1",
  "l0904150101": "0",
  "l0904150102": "0",
  "l0905020101": "0",
  "l0905030101": "0",
  "l0905040101": "-1",
  "l0905050101": "-1",
  "l0905060101": "-1",
  "l0905070101": "-1",
  "l0905080101": "-1",
  "l0905090101": "-1",
  "l0906010101": "0",
  "l0906020101": "0",
  "l0906030101": "0",
  "l0906010102": "0",
  "l0906040101": "-1",
  "l0906050101": "-1",
  "l0906060101": "-1",
  "l0906070101": "-1",
  "l0906080101": "-1",
  "l0906090101": "-1",
  "l0906100101": "-1",
  "l090301": "0",
  "l090302": "0",
  "l090303": "0",
  "l090304": "0",
  "l090305": "0",
  "l090306": "0",
  "l090307": "0",
  "l090401": "0",
  "l090402": "0",
  "l090403": "0",
  "l090404": "0",
  "l090405": "0",
  "l090406": "0",
  "l090407": "0",
  "l090408": "0",
  "l090409": "0",
  "l090410": "0",
  "l090411": "0",
  "l090412": "0",
  "l090413": "0",
  "l090414": "0",
  "l090415": "0",
  "l090504": "0",
  "l090505": "0",
  "l090506": "0",
  "l090507": "0",
  "l090508": "0",
  "l090509": "0",
  "l090601": "0",
  "l090602": "0",
  "l090603": "0",
  "l090604": "0",
  "l090605": "0",
  "l090606": "0",
  "l090607": "0",
  "l090608": "0",
  "l090609": "0",
  "l090610": "0",

}

export const hakuItemTemplate = [
  // 1.check ใบส่งสินค้า 
  {
    "isSection": true,
    "rowSpan": 4,
    "sequence": "<strong>1.check ใบส่งสินค้า  </strong>",
    "practice": "( A ) จำนวนที่ระบุ ในใบส่งสินค้า ",
    "condition": "",
    "result": {
      "type": "kgA",
      "field": [
        {
          "name": "l0901010101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "( B ) จำนวนที่ได้จาก Level  จากการอ่าน DCS",
      "endPracticeText": "",
      "type": "d",
      "field": [
        {
          "name": "",
          "value:": "",
        },
      ],
    },
    "condition": "ต้องไม่เกิน 15,000 kg",
    "result": {
      "type": "kgB",
      "field": [
        {
          "name": "l0901020101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "( C ) ปริมาณที่คำนวณได้ก่อนการรับ (A + B) ",
    "condition": "A+B",
    "result": {
      "type": "kg",
      "field": [
        {
          "name": "l0901030101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "จำเป็นต้องยืนยันว่า A+B ต้องน้อยกว่า 28,000 kg",
    "condition": "A+B = < 28,000 kg",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0901040101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "ตรวจสอบไฟสถานะอนุญาติ ติดหรือดับ ( Y )",
    "condition": "ไฟดับ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0901050101",
          "value:": "",
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
          "name": "l0902010101",
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
          "name": "l090301",
          "value:": "",
        },
        {
          "startPracticeText": "ชุดป้องกันสารเคมี",
          "endPracticeText": "",
          "name": "l090302",
          "value:": "",
        },
        {
          "startPracticeText": "กระบังหน้า",
          "endPracticeText": "",
          "name": "l090303",
          "value:": "",
        },
        {
          "startPracticeText": "รองเท้าบูท",
          "endPracticeText": "",
          "name": "l090304",
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
          "name": "l090305",
          "value:": "",
        },
        {
          "startPracticeText": "หน้ากาก กรองสารเคมี (สีขาว)",
          "endPracticeText": "",
          "name": "l090306",
          "value:": "",
        },
        {
          "startPracticeText": "เข็มขัดนิรภัย",
          "endPracticeText": "",
          "name": "l090307",
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
          "name": "l090401",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904010101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ใส่หมอนลองห้ามล้อเคลื่อนด้านหน้า-หลัง No.2",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090402",
          "value:": "",
        },
      ],
    },
    "condition": "ใส่แล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904020101",
          "value:": "",
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
          "name": "l090403",
          "value:": "",
        },
      ],
    },
    "condition": "ต่อแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904030101",
          "value:": "",
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
          "name": "l090404",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904040101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เก็บ Sample (จาก Lorry tank )ส่ง INSP  รอผล Lab",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090405",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904050101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ต่อสายจากรถเข้า pump 11P-111A No.5",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090406",
          "value:": "",
        },
      ],
    },
    "condition": "ต่อแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904060101",
          "value:": "",
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
          "name": "l090407",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904070101",
          "value:": "",
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
          "name": "l090408",
          "value:": "",
        },
      ],
    },
    "condition": "เปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904080101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Check leak ที่สายต่อว่ารั่วหรื่อไม่ No.5",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090409",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "leak",
      "field": [
        {
          "name": "l0904090101",
          "value:": "",
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
          "name": "l090410",
          "value:": "",
        },
      ],
    },
    "condition": "เปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904100101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "กดปุ่ม Unloading วงกลมสีแดง ( X )",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090411",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904110101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เช็คตู้ควบคุมวาล์ว XV-111C,D ต้องเปิด",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090412",
          "value:": "",
        },
      ],
    },
    "condition": "เปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904120101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ตรวจสอบไฟสถานะอนุญาติ ดับหรือติด ( Y )/ ตัว Scrubber ต้องทำงาน",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090413",
          "value:": "",
        },
      ],
    },
    "condition": "ไฟติด/ทำงาน",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904130101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "กดปุ่ม Start ที่ตัวควบคุม ( วงกลมสีแดง ) ( Z )",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090414",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0904140101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "บันทึกเวลา start  (11P-111A)",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090415",
          "value:": "",
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l0904150101", // A
          "value:": "",
        },
        {
          "name": "l0904150102", // B
          "value:": "",
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
    "condition": "อยู่ระหว่าง  0.2 - 0.4",
    "result": {
      "type": "mpa2",
      "field": [
        {
          "name": "l0905020101",
          "value:": "",
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
          "name": "l0905030101",
          "value:": "",
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
          "name": "l090504",
          "value:": "",
        },
      ],
    },
    "condition": "ปิดสวิตซ์อยู่ที่ off",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0905040101",
          "value:": "",
        },
      ],
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
          "name": "l090505",
          "value:": "",
        },
      ],
    },
    "condition": "หมด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0905050101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ปิดสวตซ์ Pump  ไปตำแหน่ง OFF",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090506",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0905060101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ต่อสายลมจาก No.12 มาต่อที่ข้อต่อที่Tankแล้วเปิด Air ไล่สารในสายให้หมด",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090507",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0905070101",
          "value:": "",
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
          "name": "l090508",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0905080101",
          "value:": "",
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
          "name": "l090509",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0905090101",
          "value:": "",
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
          "name": "l090601",
          "value:": "",
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l0906010101",
          "value:": "",
        },
        {
          "name": "l0906010102",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "(D)  เช็ค Level ในแท้งค์11V-111 เท่ากับ",
      "endPracticeText": "%     ( X )     ",
      "type": "d",
      "field": [
        {
          "name": "l090602",
          "value:": "",
        },
      ],
    },
    "condition": "น้ำหนักที่อ่านได้",
    "result": {
      "type": "kg",
      "field": [
        {
          "name": "l0906020101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ส่วนต่างระหว่างจำนวนที่คำนวณได้และจำนวนที่รับจริง  (C - D)                    ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090603",
          "value:": "",
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "kg",
      "field": [
        {
          "name": "l0906030101",
          "value:": "",
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
          "name": "l07l0906040704",
          "value:": "",
        },
      ],
    },
    "condition": "ปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0906040101",
          "value:": "",
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
          "name": "l090605",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0906050101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "กดปุ่ม Finish unloading  ( วงกลมสีเขียว ) ( X ) ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090606",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0906060101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เช็คตู้ควบคุมวาล์ว XV-111 C, D ต้องปิด ( X ) ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090607",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0906070101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Scrubber blower ต้องดับไม่ทำงาน ( New scrubber area )",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090608",
          "value:": "",
        },
      ],
    },
    "condition": "ไม่ทำงาน",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0906080101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ตรวจสอบไฟสถานะอนุญาติ ติดหรือดับ ( Y )",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090609",
          "value:": "",
        },
      ],
    },
    "condition": "ดับ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0906090101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เก็บกรวยและอุปกรณ์ PPE ทำความสะอาดพื้นที่",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l090610",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l0906100101",
          "value:": "",
        },
      ],
    },
  },

]
