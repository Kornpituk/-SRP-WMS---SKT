import { createCrudService } from '@/views/skt/settingMaster/services/serviceUtils'

const mockData = [
  { id: 1, abb: "FOB", termOfPricingName: "Free On Board" },
  { id: 2, abb: "CIF", termOfPricingName: "Cost, Insurance and Freight" },
  { id: 3, abb: "C&F", termOfPricingName: "Cost and Freight" },
  { id: 4, abb: "EXW", termOfPricingName: "Ex Works" },
  { id: 5, abb: "FAS", termOfPricingName: "Free Alongside Ship" },
  { id: 6, abb: "FCA", termOfPricingName: "Free Carrier" },
  { id: 7, abb: "CPT", termOfPricingName: "Carriage Paid To" },
  { id: 8, abb: "CIP", termOfPricingName: "Carriage and Insurance Paid To" },
  { id: 9, abb: "DPU", termOfPricingName: "Delivered at Place Unloaded" },
  { id: 10, abb: "DAP", termOfPricingName: "Delivered at Place" },
  { id: 11, abb: "DDP", termOfPricingName: "Delivered Duty Paid" },
]

// ← เปลี่ยน false = ใช้ API จริง
export const termofpricingService = createCrudService(
  {
    resourceName: 'TermOfPricing',
    idField: 'termOfPricingId',
    mockData,
    useMock: false,
    map: {
      id: 'termOfPricingId',
      code: 'abb',
      name: 'termOfPricingName',
    },
  },
)

//                                                      ↑ endpoint        ↑ mock data  ↑ USE_MOCK

