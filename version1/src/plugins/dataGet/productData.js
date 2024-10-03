import axiosIns from '@axios'
import { onMounted, ref, watchEffect } from 'vue'
import { urlApi } from '@/api'

const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')

const whereHouse = localStorage.getItem('whereHouseName')



const getPoCatData = () => {
  const categoriesItem = ref([])

  axiosIns.get(`${urlApi.value}/api/v1/Product/Categories/All`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {

      categoriesItem.value = response.data

      console.log('[categoriesItem]!!: ', categoriesItem)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })

  return categoriesItem
}


const getPoSecCatData = categoriesID => {``

  const secondCategoriesItem = ref([])

  axiosIns.get(`${urlApi.value}/api/v1/Product/Types/All`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
    params: {
      CategoryId: categoriesID.value,
    },
  }, {})
    .then(response => {

      secondCategoriesItem.value = response.data

      console.log('[secondCategoriesItem]!!: ', secondCategoriesItem)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })

  return secondCategoriesItem
}

const getPoSubCatData = secondCategoriesID => {
  const secondCategoriesItem = ref([])

  axiosIns.get(`${urlApi.value}/api/v1/Product/SubTypes/All`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
    params: {
      TypeId: secondCategoriesID.value,
    },
  }, {})
    .then(response => {

      subCategoriesItem.value = response.data

      console.log('[subCategoriesItem]!!: ', subCategoriesItem)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
  
  return secondCategoriesItem
}

const testFunction = () => {

  const DataTest = []

  const receiptIssueCatMock = ['FEX01', 'FEX02', 'FEX03', 'FEX04', 'FEX05']
  const requisitionMock = [true, false, false, true, true]
  const receiptMock = [false, false, true, true, false]
  const salesInvoiceMock = [true, true, false, false, true]
  const lastupdateMock = ['2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01']

  // สร้างข้อมูลแบบสุ่ม
  for (let i = 0; i < receiptIssueCatMock.length; i++) {
    const Data = {
      receiptIssueCatMock: receiptIssueCatMock[i % receiptIssueCatMock.length],
      requisitionMock: requisitionMock[i % requisitionMock.length],
      receiptMock: receiptMock[i % receiptMock.length],
      salesInvoiceMock: salesInvoiceMock[i % salesInvoiceMock.length], 
      LastUpDate: lastupdateMock[i % lastupdateMock.length],
    }

    DataTest.push(Data)
  }

  return DataTest
}

const DataWeightUnit = () => {
  return [
    { id: '01', name: 'กิโลกรัม' },
    { id: '02', name: 'กรัม' },
    { id: '03', name: 'มิลลิกรัม' },
    { id: '04', name: 'ตัน' },
    { id: '05', name: 'เท่า' },
    { id: '06', name: 'ออนซ์' },
    { id: '07', name: 'ปอนด์' },
    { id: '08', name: 'ไมโครกรัม ' },
    { id: '09', name: 'สตน' },
    { id: '10', name: 'ตระกูล' },
    { id: '11', name: 'ลิตร' },
    { id: '12', name: 'มิลลิลิตร' },
    { id: '13', name: 'ลิตรต่อวินาที' },
    { id: '14', name: 'ปอนด์ต่อนิ้วกลาง' },
    { id: '15', name: 'ปอนด์ต่อตารางนิ้ว' },
    { id: '16', name: 'ปอนด์ต่อล้านล้านเมกาไบต์' },
    { id: '17', name: 'ปอนด์ต่อตารางเมตร' },
    { id: '18', name: 'ตารางองศา' },
    { id: '19', name: 'กำลังม้า' },
    { id: '20', name: 'เครื่องบินไอพ่นน้ำ' },

  // เพิ่มหน่วยนับอื่นๆ ตามต้องการ
  ]
}


export { getPoCatData, getPoSecCatData, getPoSubCatData, testFunction, DataWeightUnit }
 