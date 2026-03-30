import { createCrudService } from '@/views/skt/settingMaster/services/serviceUtils'

const mockData = [
  { id: 1, abb: "US$", currencyName: "US Dollar" },
  { id: 2, abb: "THB", currencyName: "Thai Baht" },
  { id: 3, abb: "JPY", currencyName: "Japan Yens" },
  { id: 4, abb: "EUR", currencyName: "Euro" },
  { id: 5, abb: "GBP", currencyName: "British Pound" },
  { id: 6, abb: "CNY", currencyName: "Chinese Yuan" },
  { id: 7, abb: "SGD", currencyName: "Singapore Dollar" },
  { id: 8, abb: "KRW", currencyName: "South Korean Won" },
  { id: 9, abb: "AUD", currencyName: "Australian Dollar" },
  { id: 10, abb: "HKD", currencyName: "Hong Kong Dollar" },
  { id: 11, abb: "MYR", currencyName: "Malaysian Ringgit" },
  { id: 12, abb: "VND", currencyName: "Vietnamese Dong" },
  { id: 13, abb: "INR", currencyName: "Indian Rupee" },
]

// ← เปลี่ยน false = ใช้ API จริง
export const currencyService = createCrudService(
  {
    resourceName: 'Currency',
    idField: 'currencyId',
    mockData,
    useMock: false,
    map: {
      id: 'currencyId',
      code: 'abb',
      name: 'currencyName',
    },
  },
)

//                                                      ↑ endpoint        ↑ mock data  ↑ USE_MOCK

