import { ref } from 'vue';


export const ipaRequestData = {
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
  "L0101010001": 0.0,
  "L0101020001": 0.0,
  "L0101030001": 0.0,
  "L0101040001": 0.0,
  "L0101050001": 0.0,
  "L0101060001": 0.0,
  "L0102010101": 0.0,
  "L0102010102": 0.0,
  "L0102020101": 0.0,
  "L0102020102": 0.0,
  "L0102030101": 0.0,
  "L0102030102": 0.0,
  "L0102040101": 0.0,
  "L0102040102": 0.0,
  "L0102050101": 0.0,
  "L0103010101": 0.0,
  "L0103020101": 0.0,
  "L0103030101": 0.0,
  "L0103040101": 0.0,
  "L0103050101": 0.0,
  "L0103060101": 0.0,
  "L0103060102": 0.0,
  "L0104010101": 0.0,
  "L0104020101": 0.0,
  "L0104030101": 0.0,
  "L0104030102": 0.0,
  "L0105010101": 0.0,
  "L0105020101": 0.0,
  "L0105030101": 0.0,
  "L0106010101": 0.0,
  "L0106020101": 0.0,
  "L0106030101": 0.0,
  "L0106040101": 0.0,
  "L0106050101": 0.0,
  "L0106060101": 0.0,
  "L0107010101": 0.0,
  "L0107020101": 0.0,
  "L0107030101": 0.0,
  "L0107040101": 0.0,
  "L0108010101": 0.0,
  "L0108020101": 0.0,
  "L0108030101": 0.0,
  "L0108030102": 0.0,
  "L0108040101": 0.0,
  "L0108040102": 0.0,
  "L0108050101": 0.0,
  "L0109010101": 0.0,
  "L0109020101": 0.0,
  "L0109030101": 0.0,
  "L0109040101": 0.0,
  "L0109050101": 0.0,
  "L0109060101": 0.0,
  "L0109060102": 0.0,
  "L0109070101": 0.0,
  "L0109080101": 0.0,
  "L0109090101": 0.0,
  "L0109090102": 0.0,
  "L0109100101": 0.0,
  "L0109110101": 0.0,
  "L0109120101": 0.0,
  "L0109120102": 0.0
}

export const ipaItemTemplate = [
  // ข้อควรระวัง
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
          "name": "",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "ให้ปิดโทรศัพท์ขณะ Loading Solvent",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "หากมี Solvent หยดลงพื้น ให้ใช้ผ้า หรือ ตัวดูดซับ ห้ามใช้น้ำล้าง",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": [
        {
          "name": "",
          "value:": ""
        }
      ]
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "Check วาล์ว ปิด ประตูน้ำก่อนปฏิบัติงาน",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": "L0101050004"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "แจ้ง Leader Production เวลา Loading ว่าไม่ตรงกับเวลาการใช้ Pump 109A ในการผลิต",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": "L0101050005"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "Check ถังดับเพลิงประเภท เคมีแห้ง ว่าพร้อมใช้งาน",
    "condition": "",
    "result": {
      "type": "oknot",
      "field": "L0101050006"
    }
  },
  {
    "isSection": true,
    "rowSpan": 5,
    "sequence": "<strong>Document Check</strong>",
    "practice": "1. จำนวนที่ระบุ ในใบส่งสินค้า",
    "condition": "ตามเอกสารใบส่ง",
    "result": {
      "type": "ab",
      "field": {
        "a": "",
        "b": ""
      }
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "2. Level ที่อ่านได้จาก Tank 11V-109A ก่อนรับ",
    "condition": "ต้องไม่เกิน 575 mm.",
    "result": {
      "type": "cd",
      "field": {
        "c": "",
        "d": ""
      }
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3. ตรวจสอบว่าปริมาณหลังจากรับไม่เกินความจุถัง",
    "condition": "ต้องไม่เกิน 15,800 Litre",
    "result": {
      "type": "bd",
      "field": {
        "bd": "",
        "ok": ""
      }
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "4. ตรวจสอบ ปริมาณ ใน DCS",
    "condition": "กดดูที่ถัง 11V-109A ต้องไม่เกิน 3790 Litre.",
    "result": {
      "type": "litre",
      "field": {
        "litre": "",
        "ok": ""
      }
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "5. Check Seal No. ที่รถส่งของ และ แป้นในถัง lorry ว่าตรง 10,000 ลิตร หรือไม่",
    "condition": "Seal ล็อกวาล์วไม่ขาดตรงตามใบส่ง",
    "result": {
      "type": "oknot",
      "field": "L0101060005"
    }
  },
  {
    "isSection": true,
    "rowSpan": 6,
    "sequence": "<strong>ก่อนการปฏิบัติงาน</strong>",
    "practice": "1. หยุดรถและดับเครื่องเรียบร้อย",
    "condition": "รถต้องหยุดนิ่งสนิท",
    "result": {
      "type": "oknot",
      "field": "L0101070001"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "2. เอาหมอนรองล้อรถเรียบร้อย",
    "condition": "รองล้อรถทั้งด้านหน้าและด้านหลัง",
    "result": {
      "type": "oknot",
      "field": "L0101070002"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3. ต่อสายกราวน์เรียบร้อย",
    "condition": "ต่อสายกราวน์บริเวณที่โหลดเข้ากับรถ",
    "result": {
      "type": "oknot",
      "field": "L0101070003"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "4. เก็บตัวอย่าง ส่ง INSP เรียบร้อย",
    "condition": "1 ขวดแก้วเล็กและ 1 ขวดแก้วใหญ่เล็กด้านบนรถ",
    "result": {
      "type": "oknot",
      "field": "L0101070004"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "5. นำลูกกุญแจมาเปิดล็อกวาล์ว 11",
    "condition": "IPA กุญแจใช้รหัสล็อค",
    "result": {
      "type": "oknot",
      "field": "L0101070005"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "6. Moisture เท่าไหร่",
    "condition": "0.100 Max",
    "result": {
      "type": "percen",
      "field": {
        "percen": "",
        "ok": ""
      }
    }
  },
  {
    "isSection": true,
    "rowSpan": 3,
    "sequence": "<strong>Line setting หัวถัง 11V-109A</strong>",
    "practice": "1. วาล์ว 1, 2",
    "condition": "Open (เปิด)",
    "result": {
      "type": "oknot",
      "field": "L0101080001"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "2. วาล์ว 3, 4, 5",
    "condition": "Close (ปิด)",
    "result": {
      "type": "oknot",
      "field": "L0101080002"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3. Temperature เท่าไหร่",
    "condition": "อุณหภูมิต้องไม่สูงกว่า 25 C'",
    "result": {
      "type": "c",
      "field": {
        "c": "",
        "ok": ""
      }
    }
  },
  {
    "isSection": true,
    "rowSpan": 3,
    "sequence": "<strong>11P-109A</strong>",
    "practice": "1. วาล์ว 6, 7, 8, 9",
    "condition": "Close (ปิด)",
    "result": {
      "type": "oknot",
      "field": "L0101090001"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "2. วาล์ว 10 Open 40%",
    "condition": "Open 40% ตามขีดที่กำหนดไว้",
    "result": {
      "type": "oknot",
      "field": "L0101090002"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3. Check ว่า valve 13 Open",
    "condition": "ปกติวาล์วจะเปิด",
    "result": {
      "type": "oknot",
      "field": "L0101090003"
    }
  },
  {
    "isSection": true,
    "rowSpan": 6,
    "sequence": "<strong>Operator ทำการสวมใส่อุปกรณ์ PPE</strong>",
    "practice": "- ถุงมือ",
    "condition": "ใส่ถุงมือยาง",
    "result": {
      "type": "oknot",
      "field": "L0101140001"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "- แว่น safety",
    "condition": "ต้องเป็นแว่น safety เท่านั้น",
    "result": {
      "type": "oknot",
      "field": "L0101140002"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "- หน้ากากคางหมู",
    "condition": "ใส่ให้ถูกวิธี",
    "result": {
      "type": "oknot",
      "field": "L0101140003"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "- กรองอากาศ (สีดำ)",
    "condition": "ใช้เฉพาะตัวกรองสีดำ",
    "result": {
      "type": "oknot",
      "field": "L0101140004"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "- ชุดป้องกันสารเคมี",
    "condition": "ใส่ทั้งเสื้อและกางเกงแล้ว",
    "result": {
      "type": "oknot",
      "field": "L0101140005"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "- เข็มขัดนิรภัย",
    "condition": "-",
    "result": {
      "type": "oknot",
      "field": "L0101140006"
    }
  },
  {
    "isSection": true,
    "rowSpan": 4,
    "sequence": "<strong>Lorry tank</strong>",
    "practice": "1. ต่อสาย Hose เข้ากับ Valve 11",
    "condition": "ต่อโดยตรงโดยไม่ผ่าน Pump รถ Lorry",
    "result": {
      "type": "oknot",
      "field": "L0101150001"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "2. ต่อ Line Vent เข้ากับ Vent ของ Lorry และเปิด Valve 12",
    "condition": "อย่าลืมเปิดวาล์ว 12",
    "result": {
      "type": "oknot",
      "field": "L0101150002"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3. เปิดวาล์วจาก Lorry No.14",
    "condition": "Open (เปิด)",
    "result": {
      "type": "oknot",
      "field": "L0101150003"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "4. Check Leak สาย Hose, ข้อต่อวาล์ว ระหว่าง Valve 11 , 14",
    "condition": "ต้องไม่รั่ว",
    "result": {
      "type": "oknot",
      "field": "L0101150004"
    }
  },
  {
    "isSection": true,
    "rowSpan": 5,
    "sequence": "<strong>Charging</strong>",
    "practice": "1. เปิดวาล์ว",
    "condition": "วาล์ว 11 เปิด",
    "result": {
      "type": "oknot",
      "field": "L0101160001"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "2. Start Pump เวลาเริ่ม",
    "condition": "Actual Check",
    "result": {
      "type": "actualCheck",
      "field": {
        "a": "",
        "b": ""
      }
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3. Check pressure 11P-109A",
    "condition": "ดูจาก pressure gauge ผ่าน Pump (0.2 - 0.45)",
    "result": {
      "type": "mpa",
      "field": {
        "mpa": "",
        "ok": ""
      }
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "4. Check Ampmeter ของตัว Pump",
    "condition": "ดูจากตู้ Control Pump 11P-109A (ไม่ต่ำกว่า 8 Amp)",
    "result": {
      "type": "amp",
      "field": {
        "amp": "",
        "ok": ""
      }
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "5. Check ไฟที่ หัว Pump",
    "condition": "ไฟต้องแสดงเป็นสีเขียวเท่านั้น",
    "result": {
      "type": "oknot",
      "field": "L0101160005"
    }
  },
  {
    "isSection": true,
    "rowSpan": 12,
    "sequence": "<strong>เมื่อรับเสร็จ</strong>",
    "practice": "1. เมื่อ Pump หยุดทำงาน ปิด Valve 11, 14 และ Vent 12",
    "condition": "ด้านล่าง บริเวณ Pump 11V-109A",
    "result": {
      "type": "oknot",
      "field": "L0101170001"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "2. Drain จากสาย Hose และ Lorry ให้หมด",
    "condition": "ใน Lorry และ Hose หมด",
    "result": {
      "type": "oknot",
      "field": "L0101170002"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "3. บันทึกเวลารับเสร็จ",
    "condition": "Actual Check",
    "result": {
      "type": "actualCheck",
      "field": {
        'a': "",
        'b': ""
      }
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "4. ถอดสายดินออกจากรถ",
    "condition": "เอาออกเรียบร้อย",
    "result": {
      "type": "oknot",
      "field": "L0101170004"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "5. เปิด Valve 8 และ Cerculate 10 นาที",
    "condition": "Open (เปิด) วาล์ว 8",
    "result": {
      "type": "oknot",
      "field": "L0101170005"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "6. เก็บ Sample Check Moisture 1 ขวดแก้วใหญ่",
    "condition": "0.100 Max",
    "result": {
      "type": "percen",
      "field": {
        "percen": "",
        "ok": ""
      }
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "7. ปิด Valve 8",
    "condition": "Close (ปิด) วาล์ว 8",
    "result": {
      "type": "oknot",
      "field": "L0101170007"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "8. เปิด Valve 4 , 5",
    "condition": "ด้านบนถัง 11V-109A",
    "result": {
      "type": "oknot",
      "field": "L0101170008"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "9. อ่าน Level ที่ถัง 11V-109A ทำการ Record",
    "condition": "Actual Check",
    "result": {
      "type": "ef",
      "field": {
        "e": "",
        "f": ""
      }
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "10. Check level DCS ได้เท่าไหร่",
    "condition": "Actual Check",
    "result": {
      "type": "g",
      "field": {
        "g": ""
      }
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "11. หลังจากโหลดเสร็จล็อกวาล์ว 11",
    "condition": "กุญแจล็อครหัส",
    "result": {
      "type": "oknot",
      "field": "L0101170011"
    }
  },
  {
    "isSection": false,
    "sequence": "",
    "practice": "12. ส่วนต่างระหว่าง (B + D) - F = ",
    "condition": "ต้องไม่ต่างกันมากจากการคำนวณ",
    "result": {
      "type": "litrekg",
      "field": {
        "litre": "",
        "kg": ""
      }
    }
  }

]
