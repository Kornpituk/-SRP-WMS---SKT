import { createCrudService } from '@/views/skt/settingMaster/services/serviceUtils'

const mockData = [
  { 
    id: 1, 
    abb: "CY", 
    containerTypeName: "Container Yard",
  },
  { 
    id: 2, 
    abb: "CFS", 
    containerTypeName: "Container Freight Station",
  },

  // เพิ่มข้อมูลตัวอย่างเพิ่มเติมตามประเภท container ทั่วไป
  { 
    id: 3, 
    abb: "20DC", 
    containerTypeName: "20' Dry Container",
  },
  { 
    id: 4, 
    abb: "40DC", 
    containerTypeName: "40' Dry Container",
  },
  { 
    id: 5, 
    abb: "40HC", 
    containerTypeName: "40' High Cube Container",
  },
  { 
    id: 6, 
    abb: "20RF", 
    containerTypeName: "20' Reefer Container",
  },
  { 
    id: 7, 
    abb: "40RF", 
    containerTypeName: "40' Reefer Container",
  },
  { 
    id: 8, 
    abb: "20OT", 
    containerTypeName: "20' Open Top Container",
  },
  { 
    id: 9, 
    abb: "40OT", 
    containerTypeName: "40' Open Top Container",
  },
  { 
    id: 10, 
    abb: "20FR", 
    containerTypeName: "20' Flat Rack Container",
  },
  { 
    id: 11, 
    abb: "40FR", 
    containerTypeName: "40' Flat Rack Container",
  },
  { 
    id: 12, 
    abb: "20TK", 
    containerTypeName: "20' Tank Container",
  },
  { 
    id: 13, 
    abb: "40TK", 
    containerTypeName: "40' Tank Container",
  },
]

// ← เปลี่ยน false = ใช้ API จริง
export const containerTypeService = createCrudService(
  {
    resourceName: 'ContainerType',
    idField: 'containerTypeId',
    mockData,
    useMock: false,
    map: {
      id: 'containerTypeId',
      code: 'abb',
      name: 'containerTypeName',
    },
  },
)

//                                                      ↑ endpoint        ↑ mock data  ↑ USE_MOCK

