import { createCrudService } from '@/views/skt/settingMaster/services/serviceUtils'

let mockData = [
  { id: 1, packageName: '250 KGS PLASTIC DRUM', packageType: 'Drum', tareWeight: 2 },
  { id: 2, packageName: 'PLASTIC Pallet', packageType: 'Pallet', tareWeight: 5 },
  { id: 3, packageName: 'Cardboard Box', packageType: 'Box', tareWeight: 0.5 },
  { id: 4, packageName: 'Wooden Pallet', packageType: 'Pallet', tareWeight: 15 },
  { id: 5, packageName: 'Steel Drum 200 L', packageType: 'Drum', tareWeight: 20 },
  { id: 6, packageName: 'IBC Tank 1000L', packageType: 'Tank', tareWeight: 60 },
  { id: 7, packageName: 'Plastic Bag 25KG', packageType: 'Bag', tareWeight: 0.1 },
  { id: 8, packageName: 'Wooden Crate', packageType: 'Crate', tareWeight: 25 },
  { id: 9, packageName: 'Cardboard Pallet', packageType: 'Pallet', tareWeight: 3 },
  { id: 10, packageName: 'Jerry Can 20L', packageType: 'Jerrycan', tareWeight: 1.5 },
]

const normalizeTareWeight = value => {
  if (value === '' || value === null || value === undefined) return null

  const parsed = Number.parseFloat(value)

  return Number.isFinite(parsed) ? parsed : value
}

const basePackageService = createCrudService({
  resourceName: 'package',
  idField: 'packageId',
  mockData,
  useMock: false,
  map: {
    id: 'packageId',
    packageName: 'packageName',
    packageType: 'packageType',
    tareWeight: 'tareWeight',
  },
})

export const packageService = {
  ...basePackageService,
  save: payload => basePackageService.save({
    ...payload,
    tareWeight: normalizeTareWeight(payload.tareWeight),
  }),
}
