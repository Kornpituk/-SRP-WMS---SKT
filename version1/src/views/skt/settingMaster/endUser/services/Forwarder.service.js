import { createCrudService } from '@/views/skt/settingMaster/services/serviceUtils'

let mockData = [
  { 
    id: 1, 
    abb: "MPL", 
    forwarderName: "MASS POWER LOGISTICS CO.,LTD.", 
    address: "716/44 Sol Watchannai, Bangkolaem, Bangkokloam, Bangkok 10120", 
    contactName: "SIRIPORN", 
    contactNo: "091-5450630", 
  },
  { 
    id: 2, 
    abb: "LEO", 
    forwarderName: "LEO Global Logistics Public Company Limited", 
    address: "251/1 Soi Pakdee, Rama 3 Road, Bangkokreem, Bangkok 10120 Thailand", 
    contactName: "TOSAPOL", 
    contactNo: "084-3878325", 
  },
  { 
    id: 3, 
    abb: "TVL", 
    forwarderName: "T.V.L.Global Logistics (Thailand) Co.Ltd.", 
    address: "11/4 Ratchadaphisek Road, Chongnonsi, Yannawa, Bangkok 10120", 
    contactName: "WORATHIDA", 
    contactNo: "02-6781685 # 309", 
  },
  { 
    id: 4, 
    abb: "HCL", 
    forwarderName: "HazChem Logistics Management Co.Ltd.", 
    address: "628, 4th Floor, Triple i Builg, Soi Klab Chom, Nonsee Road, Chongnonsee, Yannawa, Bangkok 10120", 
    contactName: "SURAWADEE", 
    contactNo: "085-1256648", 
  },
]

export const forwarderService = createCrudService({
  resourceName: 'EndUser',
  idField: 'forwarderId',
  mockData,
  useMock: false, // สลับใช้ API จริงได้ทันที
  map: {
    id: 'forwarderId',
    code: 'ABB',
    name: 'forwarderName',
  },
})

// ← เปลี่ยน false = ใช้ API จริง
// export const forwarderService = createCrudService('term-of-payment', mockData, true)
