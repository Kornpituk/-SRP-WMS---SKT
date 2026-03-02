import { createCrudService } from '@/views/skt/settingMaster/services/serviceUtils'

const mockData = [
  { id: 1, abb: 'T/T', termOfPaymentName: 'T/T 30 DAYS FROM B/L DATE', startDate: 'B/L Date', days: '30' },
  { id: 2, abb: 'T/T', termOfPaymentName: 'T/T 30 DAYS FROM END OF DELIVERY MONTH', startDate: 'END MONTH', days: '30' },
]

// ← เปลี่ยน false = ใช้ API จริง
export const termOfPaymentService = createCrudService('term-of-payment', mockData, true)

//                                                      ↑ endpoint        ↑ mock data  ↑ USE_MOCK

