
// models/mockData.js
import { ref } from 'vue'

export const mockData = ref([
  { AItem: "Appearance(Dent/Clearness/Scratch)", CheckM: "By Sight", SR: "No Dent, Clearness, NoScratch", ActualC: [], A: [], B: [] },
  { AItem: "Color (Body and Top)", CheckM: "By Sight", SR: "Green, White (SK), B2C ", ActualC: [], A: [], B: [] },
])

export const modelHeader = ref([
  { sktName: "AZOBIS", 
    rawMatCode: "4156391503420", 
    supplierName: "No Dent, Clearness, NoScratch", 
    receivedDate: "", 
    tradeName: "", 
    manufacturerName: "",
    cerCOA: false,
    note: "",
    details: "",
    staffWH: "",
    suppWH: "",
    staffDate: "",
    suppDate: "",
  },
])

export const dataHeaderModel = {
  Data: [
    {
      sktName: String,                 // ชื่อสินค้า
      RawMatCode: String,              // รหัสวัตถุดิบ
      SupplierName: String,            // ชื่อซัพพลายเออร์
      ReceivedDate: String,            // วันที่รับ
      TradeName: String,               // ชื่อการค้า
      ManufacturerName: String,        // ชื่อผู้ผลิต
      CerCOA: false,               // ใบรับรอง COA
      note: String,                    // บันทึก
      details: String,                 // รายละเอียด
      staffWH: String,                 // พนักงานคลังสินค้า
      SuppWH: String,                  // คลังซัพพลายเออร์
      staffDate: String,               // วันที่พนักงาน
      suppDate: String,                // วันที่ซัพพลายเออร์
    },
  ],
}


export class FileModel {
  constructor(name, src, size, type) {
    this.name = name
    this.src = src
    this.size = size
    this.type = type
  }

  // Format size (optional function)
  static formatFileSize(size) {
    return size < 1024 ? size + ' B' : (size / 1024).toFixed(2) + ' KB'
  }
}
