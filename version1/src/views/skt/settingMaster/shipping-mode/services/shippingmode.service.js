import { createCrudService } from '@/views/skt/settingMaster/services/serviceUtils'

let mockData = [
  { 
    id: 1, 
    abb: "SEA", 
    shippingModeName: "Sea Freight",
  },
  { 
    id: 2, 
    abb: "AIR", 
    shippingModeName: "Air Freight",
  },
  { 
    id: 3, 
    abb: "TRK", 
    shippingModeName: "Truck / Land Transport",
  },
  { 
    id: 4, 
    abb: "CRR", 
    shippingModeName: "Courier / Parcel",
  },

  // เพิ่มข้อมูลตัวอย่างเพิ่มเติม
  { 
    id: 5, 
    abb: "RAI", 
    shippingModeName: "Rail Freight",
  },
  { 
    id: 6, 
    abb: "MLT", 
    shippingModeName: "Multimodal Transport",
  },
  { 
    id: 7, 
    abb: "PIP", 
    shippingModeName: "Pipeline Transport",
  },
  { 
    id: 8, 
    abb: "LCL", 
    shippingModeName: "Less than Container Load",
  },
  { 
    id: 9, 
    abb: "FCL", 
    shippingModeName: "Full Container Load",
  },
  { 
    id: 10, 
    abb: "LTL", 
    shippingModeName: "Less than Truck Load",
  },
]

// ← เปลี่ยน false = ใช้ API จริง
export const shippingmodeService = createCrudService('shipping-mode', mockData, true)
