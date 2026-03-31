import { createCrudService } from '@/views/skt/settingMaster/services/serviceUtils'

const mockData = [
  { 
    id: 1, 
    abb: "LCH", 
    port: "Laem Chabang", 
    country: "Thailand",
  },
  { 
    id: 2, 
    abb: "SHA", 
    port: "Shanghai", 
    country: "China",
  },
  { 
    id: 3, 
    abb: "SGP", 
    port: "Singapore", 
    country: "Singapore",
  },
  { 
    id: 4, 
    abb: "YOK", 
    port: "Yokohama", 
    country: "Japan",
  },
  { 
    id: 5, 
    abb: "BUS", 
    port: "Busan", 
    country: "South Korea",
  },
  { 
    id: 6, 
    abb: "ROT", 
    port: "Rotterdam", 
    country: "Netherlands",
  },
  { 
    id: 7, 
    abb: "LGB", 
    port: "Long Beach", 
    country: "USA",
  },
  { 
    id: 8, 
    abb: "HCM", 
    port: "Ho Chi Minh", 
    country: "Vietnam",
  },
]

// ← เปลี่ยน false = ใช้ API จริง
export const ProtService = createCrudService(
  {
    resourceName: 'Port',
    idField: 'portId',
    mockData,
    useMock: false,
    map: {
      id: 'portId',
      portCode: 'portCode',
      portName: 'portName',
      country: 'country',
    },
  },
)

//                                                      ↑ endpoint        ↑ mock data  ↑ USE_MOCK
