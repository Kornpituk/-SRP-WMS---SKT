

export const npanRequestData = {
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
}

export const npanItemTemplate = [
  // 1.check ใบส่งสินค้า  
  {
    "isSection": true,
    "rowSpan": 1,
    "sequence": "<strong>1.check ใบส่งสินค้า  </strong>",
    "practice": {
      "startPracticeText": "จำนวนที่ระบุ ในใบส่งสินค้า    ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160101",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "kg",
      "field": [
        {
          "name": "l1601010101",
          "value:": "",
        },
      ],
    },
  },

  // 2.Seal No. check
  {
    "isSection": true,
    "rowSpan": 1,
    "sequence": "<strong>2.Seal No. check</strong>",
    "practice": "Check No.ตู้ ตรงกับใบส่งหรือไม่",
    "condition": "ตรง",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1602010101",
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
      "type": "checkbox3",
      "field": [
        {
          "startPracticeText": "ถุงมือ",
          "endPracticeText": "",
          "name": "l160301",
          "value:": "",
        },
        {
          "startPracticeText": "ชุดป้องกันสารเคมี",
          "endPracticeText": "",
          "name": "l160302",
          "value:": "",
        },
        {
          "startPracticeText": "กระบังหน้า",
          "endPracticeText": "",
          "name": "l160303",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1603010101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "type": "checkbox2",
      "field": [
        {
          "startPracticeText": "แว่นตา",
          "endPracticeText": "",
          "name": "l160304",
          "value:": "",
        },
        {
          "startPracticeText": "เข็มขัดนิรภัย",
          "endPracticeText": "",
          "name": "l160305",
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
    "rowSpan": 19,
    "sequence": "<strong>5. ขั้นตอนการปฏิบัติ</strong>",
    "practice": {
      "startPracticeText": "หยุดรถบริเวณที่ปฏิบัติงาน และดับเครื่องยนต์ No.1",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160401",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604010101",
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
          "name": "l160402",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604020101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ประตูด้านซ้าย ติดป้ายเตือน \"ห้ามเปิดประตูตู้ 2 บาน\"",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160403",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604030101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "แล้วให้เปิดประตูบานด้านขวาบานเดียว",
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604040101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "( Please do not open this latch Liquid Contents may spill out)",
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
      "startPracticeText": "ต่อสายกราวน์เข้ากับตัวรถ No.3",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160406",
          "value:": "",
        },
      ],
    },
    "condition": "ต่อแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604060101",
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
          "name": "l160407",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604070101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ต่อสายจากรถเข้า pump 11P-143 No.6 ,7",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160408",
          "value:": "",
        },
      ],
    },
    "condition": "ต่อแล้ว",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604080101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ตรวจดูการต่อสาย Hose มีการล็อก ข้อต่อสาย เรียบร้อย No.6,7",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160409",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604090101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "นำ IBC มาวางเพื่อรับเคมี ที่ line ลง IBC,Drums",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160410",
          "value:": "",
        },
      ],
    },
    "condition": "เปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604100101",
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
          "name": "l160411",
          "value:": "",
        },
      ],
    },
    "condition": "เปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604110101",
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
          "name": "l160412",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "leak",
      "field": [
        {
          "name": "l1604120101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Check leak ที่สายต่อว่ารั่วหรื่อไม่ No.6,7",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160413",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604130101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Check pump ว่าพร้อมใช้งานหรือไม่ โดยกด switch ไปที่ ON   ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160414",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604140101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิด Valve No.10 (line circulate)",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160415",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604150101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "กดswitch 11P-143 ไปที่ ON  No.13",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160416",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604160101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิด Valve No.11 ไป IBC No.12, 13(เก็บ sample ส่งQC ที่ IBC ใบแรก)",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160417",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604170101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ปรับระดับการไหลของเคมี โดยค่อยๆ ปิด line circulate No.10  80%",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160418",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1604180101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "บันทึกเวลา start  (11P-143)ลงใน check sheet",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160419",
          "value:": "",
        },
      ],
    },
    "condition": "",
    "result": {
      "type": "actualCheck",
      "field": [
        {
          "name": "l1604190101", // A
          "value:": "",
        },
        {
          "name": "l1604190102", // B
          "value:": "",
        },
      ],
    },
  },

  // 6. ขั้นตอนขณะปฏิบัติงาน
  {
    "isSection": true,
    "rowSpan": 6,
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
    "condition": "อยู่ระหว่าง 0.35 - 0.50 ",
    "result": {
      "type": "mpa2",
      "field": [
        {
          "name": "l1605020101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "      :  Amp meter ",
    "condition": " ( 6.1 Amp )",
    "result": {
      "type": "amp2",
      "field": [
        {
          "name": "l1605030101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": " เปิดวาล์ว circulate No.10 เพิ่มขึ้นและ ปิด วาล์วไป IBC No.11 , 12, 13",
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1605040101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "Start ไปที่ ON อีกครั้ง โดยหรี่วาล์ว Line circulate No.10 ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160505",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1605050101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เปิดวาล์ว  Line circulate 20%",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160506",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1605060101",
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
      "startPracticeText": "เปิด Valve ไป IBC และ เปิดวาล์ว  Line circulate 100% ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160607",
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
    "practice": " เปิด N2 เพื่อไล่สารออกให้หมด",
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1606080101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "ถอดสาย Hose และล้างหัววาลว์ ปิด cap เรียบร้อย No.7",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160609",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1606090101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "บันทึกเวลาที่รับเสร็จ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160610",
          "value:": "",
        },
      ],
    },
    "condition": "ทำ",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1606100101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เช็ค valveปิด อีกครั้ง ",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160611",
          "value:": "",
        },
      ],
    },
    "condition": "ปิด",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1606110101",
          "value:": "",
        },
      ],
    },
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": {
      "startPracticeText": "เอาหมอนลองล้อ รถออก  No.2",
      "endPracticeText": "",
      "type": "checkbox",
      "field": [
        {
          "name": "l160612",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1606120101",
          "value:": "",
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
          "name": "l160613",
          "value:": "",
        },
      ],
    },
    "condition": "เรียบร้อย",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "l1606130101",
          "value:": "",
        },
      ],
    },
  },
  

]
