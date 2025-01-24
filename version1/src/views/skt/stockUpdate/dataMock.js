// ฟังก์ชันสำหรับสุ่มสถานะ (ตามที่ใช้ใน mockData)
const getRandomStatus = () => {
  const statuses = ['Pending', 'Approved', 'Rejected']
  
  return statuses[Math.floor(Math.random() * statuses.length)]
}

import img1 from '@images/cards/apple-iMac-4k.png'
import img2 from '@images/cards/apple-iPhone-13-pro.png'
import img3 from '@images/cards/apple-iphone-x-lg.png'
  
// ข้อมูล mockData
export const mockData = ref([
  { no: 1, image: img1, itemCode: '415600020053200', itemName: 'EKI-B D/M Clean (200 kg)', qty: 10, categories: 'Raw Material', lot: '1N241219094', lotQty: '4',
    uom: 'Kgs', warehouse: 'สำนักงานใหญ่', zone: 'คลังสินค้า 1', Area: 'ชั้น1-2 ฝั่งบริษัท', shelfLife: -30, expireDate: '2025-07-21', remark: 'สินค้ามีปัญหา',
    lotBatch: [
      { no: 1, lotNo: '1N241219094', itemCode: 'apple-iMac-4k', itemName: '1N241219094', qty: 10.123, UoM: 'Kgs', noLotQty: '1/4', palletName: 'Pallet No. 1' },
      { no: 2, lotNo: '1N241219094', itemCode: 'apple-iMac-4k', itemName: '1N241219094', qty: 10.123, UoM: 'Kgs', noLotQty: '2/4', palletName: 'Pallet No. 1' },
      { no: 2, lotNo: '1N241219094', itemCode: 'apple-iMac-4k', itemName: '1N241219094', qty: 10.123, UoM: 'Kgs', noLotQty: '3/4', palletName: 'Pallet No. 1' },
      { no: 3, lotNo: '1N241219094', itemCode: 'apple-iMac-4k', itemName: '1N241219094', qty: 10.123, UoM: 'Kgs', noLotQty: '4/4', palletName: 'Pallet No. 1' },
    ],
  },
  { no: 2, image: img2, itemCode: '415600025053300', itemName: 'Apple iPhone-13', qty: 10, categories: 'Packaging', lot: '1N241219094', lotQty: '1',
    uom: 'Kgs', warehouse: 'สำนักงานใหญ่', zone: 'คลังสินค้า 1', Area: 'ชั้น1-2 ฝั่งบริษัท', shelfLife: -5, expireDate: '2025-07-21', remark: 'สินค้ามีปัญหา',
    lotBatch: [
      { no: 1, lotNo: '1N241219094', itemCode: '1N241219094001', itemName: 'apple-iPhone-13-pro', qty: 10.123, UoM: 'Kgs', noLotQty: '1/1', palletName: 'Pallet No. 1' },
    ] },
  { no: 3, image: img3, itemCode: '415600235051210', itemName: 'Apple iphone-x', qty: 10, categories: 'Product', lot: '1N241219094', lotQty: '2',
    uom: 'Kgs', warehouse: 'สำนักงานใหญ่', zone: 'คลังสินค้า 1', Area: 'ชั้น1-2 ฝั่งบริษัท', shelfLife: 10, expireDate: '2025-07-21', remark: 'สินค้ามีปัญหา', 
    lotBatch: [
      { no: 1, lotNo: '1N241219094', itemCode: '1N241219094001', itemName: 'apple-iphone-x-lg', qty: 10.123, UoM: 'Kgs', noLotQty: '1/2', palletName: 'Pallet No. 1' },
      { no: 2, lotNo: '1N241219094', itemCode: '1N241219094002', itemName: 'apple-iphone-x-lg', qty: 10.123, UoM: 'Kgs', noLotQty: '2/2', palletName: 'Pallet No. 1' },
    ]  },
])
  
export default mockData
