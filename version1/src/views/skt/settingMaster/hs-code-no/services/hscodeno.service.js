import { createCrudService } from '@/views/skt/settingMaster/services/serviceUtils'

let mockData = [
  { 
    id: 1, 
    hsCodeNo: "3909.5011", 
    itemCode: "39095011", 
    itemName: "SN DISPERSANT 5040", 
    country: "Vietnam",
  },

  // เพิ่มข้อมูลตัวอย่างเพิ่มเติมตามประเภทสินค้าต่างๆ
  { 
    id: 2, 
    hsCodeNo: "3909.5012", 
    itemCode: "39095012", 
    itemName: "SN DISPERSANT 5020", 
    country: "Thailand",
  },
  { 
    id: 3, 
    hsCodeNo: "3909.5020", 
    itemCode: "39095020", 
    itemName: "SN WETTING AGENT", 
    country: "China",
  },
  { 
    id: 4, 
    hsCodeNo: "3909.5030", 
    itemCode: "39095030", 
    itemName: "SN DEFOAMER", 
    country: "Japan",
  },
  { 
    id: 5, 
    hsCodeNo: "3909.5040", 
    itemCode: "39095040", 
    itemName: "SN THICKENER", 
    country: "USA",
  },
  { 
    id: 6, 
    hsCodeNo: "3909.5050", 
    itemCode: "39095050", 
    itemName: "SN LEVELING AGENT", 
    country: "Germany",
  },
  { 
    id: 7, 
    hsCodeNo: "3909.5060", 
    itemCode: "39095060", 
    itemName: "SN EMULSIFIER", 
    country: "Singapore",
  },
  { 
    id: 8, 
    hsCodeNo: "3909.5070", 
    itemCode: "39095070", 
    itemName: "SN STABILIZER", 
    country: "Malaysia",
  },
  { 
    id: 9, 
    hsCodeNo: "3909.5080", 
    itemCode: "39095080", 
    itemName: "SN PLASTICIZER", 
    country: "South Korea",
  },
  { 
    id: 10, 
    hsCodeNo: "3909.5090", 
    itemCode: "39095090", 
    itemName: "SN CATALYST", 
    country: "Taiwan",
  },
]

// ← เปลี่ยน false = ใช้ API จริง
export const hsCodeNoService = createCrudService('hs-code-no', mockData, true)
