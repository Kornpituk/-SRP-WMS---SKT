import { createCrudService } from '@/views/skt/settingMaster/services/serviceUtils'

let mockData = [
  { id: 1, displayName: "Runghiiwa", firstName: "Runghiiwa", lastName: "Sunpakeaw" },
  { id: 2, displayName: "Kittipong", firstName: "Kittipong", lastName: "Suksawat" },
  { id: 3, displayName: "Pontip", firstName: "Pontip", lastName: "Wattanachai" },
  { id: 4, displayName: "Chonthicha", firstName: "Chonthicha", lastName: "Pridakhul" },
  { id: 5, displayName: "Somsak", firstName: "Somsak", lastName: "Jitnawakul" },
  { id: 6, displayName: "Pranee", firstName: "Pranee", lastName: "Suthiphol" },
  { id: 7, displayName: "Somchai", firstName: "Somchai", lastName: "Wongsuwan" },
  { id: 8, displayName: "Nattapong", firstName: "Nattapong", lastName: "Kaewprasert" },
  { id: 9, displayName: "Siriporn", firstName: "Siriporn", lastName: "Anantakul" },
  { id: 10, displayName: "Worawat", firstName: "Worawat", lastName: "Maneekul" },
]

// ← เปลี่ยน false = ใช้ API จริง
export const salepersonService = createCrudService(
  {
    resourceName: 'SalePerson',
    idField: 'salePersonId',
    mockData,
    useMock: false,
    map: {
      id: 'salePersonId',
      code: 'salePersonCode',
      name: 'salePersonName',
    },
  },
)

