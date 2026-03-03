import { createCrudService } from '@/views/skt/settingMaster/services/serviceUtils'

let mockData = [
  { id: 1, abb: "CLN", carrierName: "Cheng Lie Navigation" },
  { id: 2, abb: "HAS", carrierName: "Heung-A Shipping" },
  { id: 3, abb: "HMM", carrierName: "Hyundai Merchant Marine" },
  { id: 4, abb: "KMTC", carrierName: "Korea Marine Transport Corporation" },
  { id: 5, abb: "MSK", carrierName: "Maersk Line" },
  { id: 6, abb: "MSC", carrierName: "Mediterranean Shipping Company" },
  { id: 7, abb: "CMA", carrierName: "CMA CGM Group" },
  { id: 8, abb: "COS", carrierName: "COSCO Shipping Lines" },
  { id: 9, abb: "EVE", carrierName: "Evergreen Marine Corporation" },
  { id: 10, abb: "ONE", carrierName: "Ocean Network Express" },
  { id: 11, abb: "YML", carrierName: "Yang Ming Marine Transport" },
  { id: 12, abb: "WHL", carrierName: "Wan Hai Lines" },
  { id: 13, abb: "PIL", carrierName: "Pacific International Lines" },
  { id: 14, abb: "ZIM", carrierName: "ZIM Integrated Shipping Services" },
  { id: 15, abb: "RCL", carrierName: "Regional Container Lines" },
  { id: 16, abb: "TG", carrierName: "Thai Airways International" },
  { id: 17, abb: "EK", carrierName: "Emirates SkyCargo" },
  { id: 18, abb: "CX", carrierName: "Cathay Pacific Cargo" },
  { id: 19, abb: "KE", carrierName: "Korean Air Cargo" },
  { id: 20, abb: "SQ", carrierName: "Singapore Airlines Cargo" },
]

// ← เปลี่ยน false = ใช้ API จริง
export const carrierService = createCrudService('carrier', mockData, true)
