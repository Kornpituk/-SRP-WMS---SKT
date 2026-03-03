import { createCrudService } from '@/views/skt/settingMaster/services/serviceUtils'

let mockData = [
  { id: 1, packageName: "250 KGS PLASTIC DRUM", package: "Drum", tareWeight: "2.00 KGS" },
  { id: 2, packageName: "PLASTIC Pallet", package: "Pallet", tareWeight: "5.00 KGS" },
  { id: 3, packageName: "Cardboard Box", package: "Box", tareWeight: "0.50 KGS" },
  { id: 4, packageName: "Wooden Pallet", package: "Pallet", tareWeight: "15.00 KGS" },
  { id: 5, packageName: "Steel Drum 200 L", package: "Drum", tareWeight: "20.00 KGS" },
  { id: 6, packageName: "IBC Tank 1000L", package: "Tank", tareWeight: "60.00 KGS" },
  { id: 7, packageName: "Plastic Bag 25KG", package: "Bag", tareWeight: "0.10 KGS" },
  { id: 8, packageName: "Wooden Crate", package: "Crate", tareWeight: "25.00 KGS" },
  { id: 9, packageName: "Cardboard Pallet", package: "Pallet", tareWeight: "3.00 KGS" },
  { id: 10, packageName: "Jerry Can 20L", package: "Jerrycan", tareWeight: "1.50 KGS" },
]

// ← เปลี่ยน false = ใช้ API จริง
export const packageService = createCrudService('term-of-payment', mockData, true)
