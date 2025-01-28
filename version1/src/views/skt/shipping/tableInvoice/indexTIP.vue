<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { ref, watchEffect } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api'  //---------------------- Import Api for Url *****

//------------------------ Get Where House Name From LocalStorage and define to whereHouseSelectedItem ---------------------------
const whereHouse = localStorage.getItem('whereHouseName')
const whereHouseSelectedItem = ref(whereHouse)

const products = ref([]) //---------------- variable for get All Product From X-Location(Where House) *****

// Get access token from localStorage in another page
const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')

const perPage = ref(10)
const page = ref(0)
const totalCount = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)

//------------------- Model ID For search ------------------------------------
const searchByCategoryId = ref(null)
const searchByTypeId = ref(null)
const searchBySubTypeId = ref(null)
const searchByBarcode = ref(null)
const searchByProductId = ref(null)
const searchByProductName = ref(null)
const searchByUOMId = ref(null)

const searchByWareHouseId = ref([whereHouse])

const searchByZoneId = ref(null)
const searchByAreaId = ref(null)
const searchBySubAreaId = ref(null)

//------------------------ Model Name for search ------------------------------
const searchByCategoryName = ref(null)
const searchByTypeName = ref(null)
const searchBySubTypeName = ref(null)
const searchByBarcodeName = ref(null)
const searchByProductCodeName = ref(null)
const searchByProductNameFilter = ref(null)
const searchByUnitName = ref(null)

//----- Search Filter Icon Header Table[Product Category, Group, Sub Group, Barcode, Product Category Code, Product Name]
const menuCategory= ref( false)
const menuGroup = ref( false)
const menuSubGroup = ref( false)
const menuBarcode = ref( false)
const menuProductCode = ref( false)
const menuProductName = ref( false)
const menuUoM = ref( false)

//------------------------ item ID for search ------------------------------
const itemsSearchByCategoryId = ref([])
const typeItemsSearchById = ref([])
const subTypeItemsSearchById = ref([])
const itemsSearchByUOMId = ref([])
const wareHouseItemsSearchById = ref([])
const zoneItemsSearchById = ref([])
const areaItemsSearchById = ref([])
const subAreaItemsSearchById = ref([])

//----------------------  Variable for SortBy -------------------------------------
const sortByCategory = ref('')
const sortByType = ref('')
const sortBySubType = ref('')
const sortByBarcode = ref('')
const sortByProductId = ref('')
const sortByProductName = ref('')
const sortByUnit = ref('')
const sortByQty = ref('')
const sortByTags = ref('')
const sortByNonTags = ref('')


const toggleSortType = sortBy => {
  const sortRefs = { sortByCategory, sortByType, sortBySubType, sortByBarcode, sortByProductId, sortByProductName, sortByUnit, sortByQty, sortByTags, sortByNonTags }

  for (const key in sortRefs) {
    if (key === sortBy) {
      sortRefs[key].value = sortRefs[key].value === 'asc' ? 'desc' : 'asc'
    } else {
      sortRefs[key].value = '' // ล้างค่าที่ไม่เกี่ยวข้อง
    }

    // console.log("Sort type:",sortRefs[key],'Key',[key])
  }

  // console.log("Sort type:",sortRefs[key],'Key',[key])
}

const router = useRouter()

const serialProductCode = ref(null)

//------------------------------- Function Get StockUpdate Need Enter Search -----------------

const clearModel = () => {
  searchByCategoryId.value = null
  searchByTypeId.value = null
  searchBySubTypeId.value = null
  searchByBarcode.value = null
  searchByProductId.value = null
  searchByProductName.value = null
  searchByUOMId.value = null
  searchByZoneId.value = null
  searchByAreaId.value = null
  searchBySubAreaId.value = null
  serialProductCode.value = null
}

const searchParams = {
  searchByCategoryId,
  searchByTypeId,
  searchBySubTypeId,
  searchByBarcode,
  searchByProductId,
  searchByProductName,
  searchByUOMId,
  searchByZoneId,
  searchByAreaId,
  searchBySubAreaId,
  serialProductCode,

  searchByCategoryName,
  searchByTypeName,
  searchBySubTypeName,
  searchByBarcodeName,
  searchByProductCodeName,
  searchByProductNameFilter,
  searchByUnitName,
}

const sortParams = {
  sortByCategory,
  sortByType,
  sortBySubType,
  sortByBarcode,
  sortByProductId,
  sortByProductName,
  sortByUnit,
  sortByQty,
  sortByTags,
  sortByNonTags,
}

// Clear function to reset all values
const clearValuesNeo = () => {
  // Reset search parameters
  for (const key in searchParams) {
    searchParams[key].value = null
  }

  // Reset sort parameters
  for (const key in sortParams) {
    sortParams[key].value = null
  }
}

const GetStockUpdate = () => {

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.get(`${urlApi.value}/api/v1/StockUpdate?page=`+currentPage.value+`&perPage=`+rowPerPage.value, {
    params: {
      categoryId: searchByCategoryId.value,
      typeId: searchByTypeId.value,
      subTypeId: searchBySubTypeId.value,
      barcode: searchByBarcode.value,
      productId: searchByProductId.value,
      productName: searchByProductName.value,
      unitId: searchByUOMId.value,
      zoneId: searchByZoneId.value,
      areaId: searchByAreaId.value,
      subAreaId: searchBySubAreaId.value,
      serialNo: serialProductCode.value,

      searchByCategory: searchByCategoryName.value,
      searchByType: searchByTypeName.value,
      searchBySubType: searchBySubTypeName.value,
      searchByBarcode: searchByBarcodeName.value,
      searchByProductId: searchByProductCodeName.value,
      searchByProductName: searchByProductNameFilter.value,
      searchByUnit: searchByUnitName.value,

      'sortByCategory': sortByCategory.value,
      'sortByType': sortByType.value,
      'sortBySubType': sortBySubType.value,
      'sortByBarcode': sortByBarcode.value,
      'sortByProductId': sortByProductId.value,
      'sortByProductName': sortByProductName.value,
      'sortByUnit': sortByUnit.value,
      'sortByQty': sortByQty.value,
      'sortByTags': sortByTags.value,
      'sortByNonTags': sortByNonTags.value,

      // ... and so on with other parameters
    },
    headers: {
      'accept': '*/*',
      'x-location': `${searchByWareHouseId.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {

      products.value = response.data.items
      totalCount.value = response.data.totalCount
      currentPage.value = response.data.page
      totalPage.value = response.data.totalPages
      rowPerPage.value = response.data.perPage

      console.log('[products.value]!!: ', products)
      console.log('Warehouse At StockUpdate :', whereHouseSelectedItem.value)

      // console.log('perPage: ',perPage)
      // console.log('currentPage: ',currentPage)
      // console.log('totalCount: ',totalCount)
      // console.log('totalPages: ',totalPage)

      // console.log('subTypeId',searchBySubTypeId.value)

      
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })
  
}

//----------------------------------- Function Reset search Key word ---------------
const resetSearchKey = () => {
  searchByCategoryName.value = ('')
  searchByTypeName.value = ('')
  searchBySubTypeName.value = ('')
  searchByBarcodeName.value = ('')
  searchByProductCodeName.value = ('')
  searchByProductNameFilter.value = ('')
  searchByUnitName.value = ('')
}

//------------------------------- Function Get StockUpdate Auto Search -----------------

watch(GetStockUpdate)

//--------------------------------------- Function Pagination --------------------------------------------
// 👉 watching current page
watch(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = products.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = products.value.length + (currentPage.value - 1) * rowPerPage.value

  // console.log('const firstIndex ',firstIndex,'=','products.value.length:'+products.value.length,'?',(currentPage.value - 1)* rowPerPage.value + 1)
  // console.log('const lastIndex ',lastIndex,'=',products.value.length,'+',(currentPage.value - 1),'*',rowPerPage.value)
  // console.log('products.value.length: ',products.value.length)
  
  return `${ firstIndex }-${ lastIndex } of ${ totalCount.value }`
})

// SECTION Checkbox toggle
const selectedRows = ref([])

//----------------------------------- End Function Pagination -----------------------------------------------

///--------------------------------------- FetchItems for Search Box ----------------------------------------------

const fetchItemsSearchBy = nameSearch => {
  return axiosIns.get(`${urlApi.value}/api/v1/Product/${nameSearch}`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }).then(response => {
    return response.data
  }).catch(error => {
    console.error('Error:', error)
    
    return null
  })
}

fetchItemsSearchBy('categories').then(data => {
  itemsSearchByCategoryId.value = data
})

function customFilter(item, queryText, itemText) {
  const textOne = itemText.title.toLowerCase()
  const textTwo = itemText.value.toLowerCase()
  const searchText = queryText.toLocaleLowerCase()
  
  return textOne.includes(searchText) || textTwo.includes(searchText)
}

const submitSearchButton = () => {
  GetStockUpdate()
}

//--------------------------------------- FetchItems for Search WareHouse  ----------------------------------------

const fetchItemsWareHouse = () => {
  axiosIns.get(`${urlApi.value}/api/Auth/GetLocation`, {
    headers: {
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
    .then(response => {

      wareHouseItemsSearchById.value = response.data
    })
    .catch(error => {
      // Handle errors
      selectError.value = 'Where house not selected!!'
      console.error('Error:', error)
    })

}

watch(fetchItemsWareHouse)

//--------------------------------------- FetchItems for Search  Unit  ----------------------------------------

const getItemsProductUnit = () => {
  axiosIns.get(`${urlApi.value}/api/v1/Product/`+searchByCategoryId.value+'/Unit', {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
    .then(response => {

      itemsSearchByUOMId.value = response.data

      // Now `items` contains an array of objects with id and name properties
      // console.log('itemsSearchByUOMId.value At index',itemsSearchByUOMId.value)

      
    })
    .catch(error => {
      // Handle errors
      selectError.value = 'Where house not selected!!'
      console.error('Error:', error)
    })

    
}

watchEffect(getItemsProductUnit)

//--------------------------------------- FetchItems for Search  Type(Group) ----------------------------------------

const getItemsProductType = () => {
  axiosIns.get(`${urlApi.value}/api/v1/Product/Types`, {
    params: {
      'CategoryId': searchByCategoryId.value,
    },
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
    .then(response => {

      typeItemsSearchById.value = response.data

      // Now `items` contains an array of objects with id and name properties
      // console.log('wareHouse.value At index',wareHouseItemsSearchById.value)

      
    })
    .catch(error => {
      // Handle errors
      selectError.value = 'Where house not selected!!'
      console.error('Error:', error)
    })

    
}

watchEffect(getItemsProductType)

//--------------------------------------- FetchItems for Search Sub Type(Sub Group) ----------------------------------------

const getItemsProductSubType = () => {
  axiosIns.get(`${urlApi.value}/api/v1/Product/SubTypes/All`, {
    params: {
      'TypeId': searchByTypeId.value,
    },
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
    .then(response => {

      subTypeItemsSearchById.value = response.data

      // Now `items` contains an array of objects with id and name properties
      // console.log('wareHouse.value At index',wareHouseItemsSearchById.value)

      
    })
    .catch(error => {
      // Handle errors
      selectError.value = 'Where house not selected!!'
      console.error('Error:', error)
    })

    
}

watchEffect(getItemsProductSubType)

//--------------------------------------- FetchItems for Search  Zone  ----------------------------------------

const getItemLocalZone = () => {
  axiosIns.get(`${urlApi.value}/api/v1/Locations/zone/all`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
    .then(response => {

      zoneItemsSearchById.value = response.data

      // Now `items` contains an array of objects with id and name properties
      // console.log('zoneItemsSearchById At index',zoneItemsSearchById.value)

      
    })
    .catch(error => {
      // Handle errors
      selectError.value = 'Where house not selected!!'
      console.error('Error:', error)
    })

    
}

watch(getItemLocalZone)

//--------------------------------------- FetchItems for Search  Area ----------------------------------------

const getItemLocalArea = () => {
  axiosIns.get(`${urlApi.value}api/v1/Locations/area/all`, {
    params: {
      'zoneCode': searchByZoneId.value,
    },
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
    .then(response => {

      areaItemsSearchById.value = response.data

      // Now `items` contains an array of objects with id and name properties
      // console.log('areaItemsSearchById At index',areaItemsSearchById.value)

      
    })
    .catch(error => {
      // Handle errors
      selectError.value = 'Where house not selected!!'
      console.error('Error:', error)
    })

    
}

watchEffect(getItemLocalArea)

//--------------------------------------- FetchItems for Search Sub Area ----------------------------------------

const getItemLocalSubArea = () => {
  axiosIns.get(`${urlApi.value}/api/v1/Locations/subArea/all`, {
    params: {
      'zoneCode': searchByZoneId.value,
      'areaCode': searchByAreaId.value,
    },
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
    .then(response => {

      subAreaItemsSearchById.value = response.data

      // Now `items` contains an array of objects with id and name properties
      // console.log('areaItemsSearchById At index',areaItemsSearchById.value)

      
    })
    .catch(error => {
      // Handle errors
      selectError.value = 'Where house not selected!!'
      console.error('Error:', error)
    })

    
}

watchEffect(getItemLocalSubArea)

// -------------------------------------- Export Bar Excel - --------------------------------

const stockUpdateExcel = () => {
  axiosIns.post(`${urlApi.value}/api/v1/StockUpdate/Excel`, {}, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
    responseType: 'blob', // ให้เซิร์ฟเวอร์รีเทิร์น blob สำหรับไฟล์ Excel
  })
    .then(response => {
      // สร้าง URL ของไฟล์ Excel จาก binary data
      const url = window.URL.createObjectURL(new Blob([response.data]))

      const currentDate = new Date() // สร้างวัตถุ Date ปัจจุบัน
      const year = currentDate.getFullYear() // ดึงปีปัจจุบัน
      let fileYear
      const threshold = 2500 // กำหนดจุดแบ่ง พ.ศ. กับ ค.ศ.

      if (year > threshold) {
        // พ.ศ. เปลี่ยนเป็น ค.ศ.
        fileYear = year - 543
      } else {
        // ค.ศ.
        fileYear = year
      }

      const dateString = currentDate.toISOString().slice(0, 10).replace(/-/g, '').replace(year.toString(), fileYear.toString())

      const fileName = `stock_update_Tag_${dateString}.xlsx` // ตั้งชื่อไฟล์โดยรวมกับวันที่

      // สร้างลิงก์สำหรับดาวน์โหลดไฟล์ Excel
      const link = document.createElement('a')

      link.href = url
      link.setAttribute('download', fileName) // ตั้งชื่อไฟล์ที่จะดาวน์โหลด
      document.body.appendChild(link)
      link.click()

      // ลบ URL หลังจากดาวน์โหลดเสร็จเรียบร้อยแล้ว
      window.URL.revokeObjectURL(url)
    })
    .catch(error => {
      // จัดการข้อผิดพลาด
      console.error('Error:', error)
    })
}

//-------------------------- format decimal -------------------

const formatDecimal = decimal => {
  const configsShowDigit = localStorage.getItem('configsShowDigit')
  if (configsShowDigit == 'true') {
    return Math.ceil(decimal)
  } else {
    return decimal
  }
}

/// ----------------------- check config Barcode / Tag ----------------
const nameUser = localStorage.getItem('userCheck')

const checkConfigUser = nameUser => {
  if (nameUser == 'Chutimon') {
    return false
  } else if (nameUser == 'Tamma'){
    return true
  } else {
    return true
  }
}

checkConfigUser(nameUser)

//------------------------ Dialog Image ----------------------------
const isDialogImageVisible = ref(false)
const urlImage = ref('')
const nameImage = ref('')

const checkRFID = ref ('')

watchEffect(() =>{
  const checkRFIDUpdate = ref (localStorage.getItem('configsShowRfdi'))
  if(checkRFIDUpdate.value === 'true'){
    // console.log('RFID Check True:'+ checkRFIDUpdate.value)
    checkRFID.value = true
  } else if (checkRFIDUpdate.value === 'false') {
    // console.log('RFID Check False:'+ checkRFIDUpdate.value)
    checkRFID.value = false
  }
})

const nameProductDialog = ref('')
const qtyProductDialog = ref('')
const unitProductDialog = ref('')
const barcodeProductDialog = ref('')

const codeProduct = ref('')
const nameProduct = ref('')
const imgProduct = ref('')
const barcodeProduct = ref('')
const categoriesProduct = ref('')
const groupProduct = ref('')
const groupSupProduct = ref('')
const totalProduct = ref('')
const unitNameProduct = ref('')
const detailsProduct = ref('')

const showDialogImage = (code, name, img, barcode, categories, group, groupSup, total, unitName, details) => {
  codeProduct.value = code
  nameProduct.value = name
  imgProduct.value = img
  barcodeProduct.value = barcode
  categoriesProduct.value = categories
  groupProduct.value = group
  groupSupProduct.value = groupSup
  totalProduct.value = total
  unitNameProduct.value = unitName
  detailsProduct.value = details
  isDialogImageVisible.value = true
  console.log('showImageFunction!!')
}

const showExpansionDialog = ref(false)

//---------------------------- check Status ---------------------------------

const colorStatus = ref('grey')
const bgStatus = ref('bg-grey')


const checkColorTextStatus = status => {
  if(status === 'Received'){
    return 'bg-green-lighten-4'
  }else if(status === 'Waiting for Receive') {
    return 'bg-yellow-lighten-4' 
  }
}

const checkColorBgStatus = status => {
  if(status === 'Received'){
    return 'text-green'
  }else if(status === 'Waiting for Receive') {
    return 'text-warning' 
  }
}

const statuses = [ 'Aprove', 'Reject', 'Back to Edit']

// ฟังก์ชันสำหรับสุ่มสถานะ
function getRandomStatus() {
  const randomIndex = Math.floor(Math.random() * statuses.length)
  
  return statuses[randomIndex]
}


function getRandomDate(start, end) {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
  const randomDate = new Date(randomTime)
  
  const year = randomDate.getFullYear()
  const month = String(randomDate.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const day = String(randomDate.getDate()).padStart(2, '0')
  
  return `${day}/${month}/${year}`
}

const checkBgTruck = truck => {
  if(truck === 'BTS'){
    return 'bg-red-lighten-4'
  }else if(truck === 'LCL'){
    return 'bg-warning'
  } 
}

//------------------------------------------ Mock Data --------------------------------

const mockData = ref([
  { no: 1, status: getRandomStatus(), saleOrderNo: '1100078117', soAttachment: '', sapInvoiceNo: 'TIX2406001', payerName: 'TORAY SG', user: '', shipper: '', shipperLocation: '', shippingMark: 'MAT-105T', endUser: '', consignee: '', product: '', lotNumber: '', qty: '16,000.00', coa: '', freightForwarder: 'LCL', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'SINGAPORE', loadingDate: '4-มิ.ย.-24', etd: '7-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: 'Shipping complete', remarkLog: '5501354541', byWhow: 'ธนาธิป' },
  { no: 2, status: getRandomStatus(), saleOrderNo: '1100078116', soAttachment: '', sapInvoiceNo: 'TIX2406002', payerName: 'SCI', user: '', shipper: '', shipperLocation: '', shippingMark: 'OSMORIN DA-50', endUser: '', consignee: '', product: '', lotNumber: '', qty: '14,400.00', coa: '', freightForwarder: 'LEO', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'JAPAN', loadingDate: '6-มิ.ย.-24', etd: '18-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: 'OSMO(1)2405', byWhow: 'กาญจนา' },
  { no: 3, status: getRandomStatus(), saleOrderNo: '1100078128', soAttachment: '', sapInvoiceNo: 'TIX2406003', payerName: 'RESONAC', user: '', shipper: '', shipperLocation: '', shippingMark: 'CHEMICLEAN PR-084CT', endUser: '', consignee: '', product: '', lotNumber: '', qty: '5,000.00', coa: '', freightForwarder: 'LCL', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'MALAYSIA', loadingDate: '6-มิ.ย.-24', etd: '10-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: '7400', byWhow: 'สมชาย' },
  { no: 4, status: getRandomStatus(), saleOrderNo: '1100078129', soAttachment: '', sapInvoiceNo: 'TIX2406004', payerName: 'RESONAC', user: '', shipper: '', shipperLocation: '', shippingMark: 'CHEMICLEAN AS-S142T', endUser: '', consignee: '', product: '', lotNumber: '', qty: '15,000.00', coa: '', freightForwarder: 'LEO', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'MALAYSIA', loadingDate: '7-มิ.ย.-24', etd: '10-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: '7400', byWhow: 'สมชาย' },
  { no: 5, status: getRandomStatus(), saleOrderNo: '1100078158', soAttachment: '', sapInvoiceNo: 'TIX2406005', payerName: 'SKK-YOUNGJIN TECH', user: '', shipper: '', shipperLocation: '', shippingMark: 'PELESTAT 6500', endUser: '', consignee: '', product: '', lotNumber: '', qty: '5,000.00', coa: '', freightForwarder: 'BTS', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'SOUTH KOREA', loadingDate: '8-มิ.ย.-24', etd: '19-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: '', byWhow: 'ศิริพร' },
  { no: 6, status: getRandomStatus(), saleOrderNo: '1100077998', soAttachment: '', sapInvoiceNo: 'TIX2406006', payerName: 'INABATA PH', user: '', shipper: '', shipperLocation: '', shippingMark: 'SANPRENE BS-4', endUser: '', consignee: '', product: '', lotNumber: '', qty: '32,000.00', coa: '', freightForwarder: 'LCL', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'PHILIPPINES', loadingDate: '9-มิ.ย.-24', etd: '15-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: '', byWhow: 'จิรายุ' },
  { no: 7, status: getRandomStatus(), saleOrderNo: '1100078232', soAttachment: '', sapInvoiceNo: 'TIX2406007', payerName: 'SCI', user: '', shipper: '', shipperLocation: '', shippingMark: 'BEAULIGHT LCA-25F', endUser: '', consignee: '', product: '', lotNumber: '', qty: '16,000.00', coa: '', freightForwarder: 'LEO', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'JAPAN', loadingDate: '10-มิ.ย.-24', etd: '22-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: 'BEAU(1)2406 F', byWhow: 'อรอนงค์' },
  { no: 8, status: getRandomStatus(), saleOrderNo: '1100077971', soAttachment: '', sapInvoiceNo: 'TIX2406008', payerName: 'PT HITECH', user: '', shipper: '', shipperLocation: '', shippingMark: 'SANPRENE IB-967T', endUser: '', consignee: '', product: '', lotNumber: '', qty: '13,600.00', coa: '', freightForwarder: 'LCL', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'INDONESIA', loadingDate: '11-มิ.ย.-24', etd: '15-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: '679', byWhow: 'อภิชาติ' },
  { no: 9, status: getRandomStatus(), saleOrderNo: '1100077972', soAttachment: '', sapInvoiceNo: 'TIX2406009', payerName: 'PT HITECH', user: '', shipper: '', shipperLocation: '', shippingMark: 'SANPRENE IB-967T', endUser: '', consignee: '', product: '', lotNumber: '', qty: '13,600.00', coa: '', freightForwarder: 'LEO', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'INDONESIA', loadingDate: '11-มิ.ย.-24', etd: '15-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: '680', byWhow: 'มนัสนันท์' },
  { no: 10, status: getRandomStatus(), saleOrderNo: '1100078230', soAttachment: '', sapInvoiceNo: 'TIX2406010', payerName: 'SCI', user: '', shipper: '', shipperLocation: '', shippingMark: 'LEBON CIB GSS', endUser: '', consignee: '', product: '', lotNumber: '', qty: '16,000.00', coa: '', freightForwarder: 'BTS', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'JAPAN', loadingDate: '12-มิ.ย.-24', etd: '26-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: 'LEBO(1)2407', byWhow: 'วีระชัย' },
  { no: 11, status: getRandomStatus(), saleOrderNo: '1100078219', soAttachment: '', sapInvoiceNo: 'TIX2406011', payerName: 'SCI', user: '', shipper: '', shipperLocation: '', shippingMark: 'BEAULIGHT LCA-25N', endUser: '', consignee: '', product: '', lotNumber: '', qty: '32,000.00', coa: '', freightForwarder: 'LCL', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'JAPAN', loadingDate: '17-มิ.ย.-24', etd: '26-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: 'BEAU(1)2407 N', byWhow: 'พรพรรณ' },
])

const accountAmin = ref (false)
const accountViewerKK = ref (false)
const accountINSP = ref (false)
const accountSALLOG = ref (false)
const accountWH = ref (false)
const accountAll = ref (true)

const setAccount = role => {
  accountAmin.value = false
  accountViewerKK.value = false
  accountINSP.value = false
  accountSALLOG.value = false
  accountWH.value = false
  accountAll.value = false

  if (role === 'Amin') {
    accountAmin.value = true
    accountViewerKK.value = false
    accountINSP.value = false
    accountSALLOG.value = false
    accountWH.value = false
    accountAll.value = false
  } else if (role === 'ViewerKK') {
    accountAmin.value = false
    accountViewerKK.value = true
    accountINSP.value = false
    accountSALLOG.value = false
    accountWH.value = false
    accountAll.value = false
  } else if (role === 'INSP') {
    accountAmin.value = false
    accountViewerKK.value = false
    accountINSP.value = true
    accountSALLOG.value = false
    accountWH.value = false
    accountAll.value = false
  } else if (role === 'SALLOG') {
    accountAmin.value = false
    accountViewerKK.value = false
    accountINSP.value = false
    accountSALLOG.value = true
    accountWH.value = false
    accountAll.value = false
  } else if (role === 'WH') {
    accountAmin.value = false
    accountViewerKK.value = false
    accountINSP.value = false
    accountSALLOG.value = false
    accountWH.value = true
    accountAll.value = false
  } else if (role === 'All') {
    accountAmin.value = false
    accountViewerKK.value = false
    accountINSP.value = false
    accountSALLOG.value = false
    accountWH.value = false
    accountAll.value = true
  }

  console.log('Switch Acc', accountAmin.value, accountViewerKK.value, accountINSP.value, accountSALLOG.value, accountWH.value, accountAll.value)

  // สามารถเพิ่มเงื่อนไขสำหรับ role อื่นๆ ได้ที่นี่
}


//-------------------
//----- Rune
const rules = [v => v.length <= 150 || 'Max 25 characters']

//--------- new expention
const panel = ref([])
const files = ref([])

///---------------- Dialog 
const isDialogVisiblePrintTruck = ref(false)

///------------ Dialog PDF

const isDialogPDFViewVisible = ref(false)

const imgDialogPDF = ref('')
const imgDialogPng = ref('')

const showDialogPDF = (pdfUrl, imageUrl) => {
  console.log('Start PDF or Image!')

  if (pdfUrl) {
    imgDialogPDF.value = pdfUrl
    imgDialogPng.value = null
  } else if (imageUrl) {
    imgDialogPng.value = imageUrl
    imgDialogPDF.value = null
  }
  
  isDialogPDFViewVisible.value = true
}

// Watch for changes in soAttachment for each product
mockData.value.forEach(product => {
  watch(() => product.soAttachment, newAttachment => {
    // Clean up the old URL if exists
    if (product.pdfPreview) {
      URL.revokeObjectURL(product.pdfPreview)
    }
    if (product.imagePreview) {
      URL.revokeObjectURL(product.imagePreview)
    }

    if (newAttachment && newAttachment.length > 0) {
      const file = newAttachment[0] // Assuming single file upload
      const fileType = file.type

      if (fileType === 'application/pdf') {
        const fileURL = URL.createObjectURL(file)

        product.pdfPreview = fileURL
        product.imagePreview = null // Clear image preview if any
      } else if (fileType.startsWith('image/')) {
        const fileURL = URL.createObjectURL(file)

        product.imagePreview = fileURL
        product.pdfPreview = null // Clear PDF preview if any
      } else {
        product.pdfPreview = null
        product.imagePreview = null
      }
    } else {
      product.pdfPreview = null
      product.imagePreview = null
    }
  })
})
</script>

<template>
  <!-- Title Page -->

  <div>
    <VCard>
      <VCardTitle>
        <div class="d-flex align-center">
          <VRow class="d-flex align-center">
            <VCol cols="2">
              <IconBtn
                class="cursor-pointer"
                color="#FFFFFF"
                :to="{ name: 'dashboards-main',
                }"
              >
                <VIcon
                  size="30"
                  icon="ri-close-circle-fill"
                  color="#000000"
                />
              </IconBtn>
            </VCol>
            <VCol
              cols="8"
              class="text-center"
            >
              <div>
                <span
                  style="font-size: 22px; font-weight: bold;"
                  class="text-center"
                >{{ $t('Shipment Plan') }}</span>
              </div>
            </VCol>
            <VCol
              cols="2"
              class="d-flex justify-end"
            >
              <VBtn
                variant="flat"
                @click="panel = panel.length ? [] : ['filter']"
              >
                <VIcon icon="ri-equalizer-line" />
              </VBtn>
            </VCol>
          </VRow>
        </div>
      </VCardTitle>
    </VCard>
  </div>

  <section>
    <div>
      <VExpansionPanels
        v-model="panel"
        multiple
      >
        <VExpansionPanel value="filter">
          <VExpansionPanelText>
            <VForm @submit.prevent="submitSearchButton">
              <!-- Barcode | Product code | Product Name | Button Export -->
              <VRow>
                <!-- 👉 Select Barcode -->
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <!-- 👉 Search Product code -->
                  <AppDateTimePicker
                    v-model="date"
                    label="ETA"
                    placeholder="Select date"
                    prepend-inner-icon="ri-calendar-schedule-fill"
                    density="compact"
                  />
                </VCol>

                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <!-- 👉 Search Product code -->
                  <AppDateTimePicker
                    v-model="date"
                    label="ETD"
                    prepend-inner-icon="ri-calendar-schedule-fill"
                    placeholder="Select date"
                    density="compact"
                  />
                </VCol>
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <!-- 👉 Search Product code -->
                  <VTextField
                    v-model="searchByProductId"
                    :label="$t('Sale Order No.')"
                    type="Sale Order No."
                    density="compact"
                  />
                </VCol>

                <!-- 👉 Select Product code -->
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <VTextField
                    v-model="searchByProductId"
                    :label="$t('Payer Name')"
                    type="Payer Name"
                    density="compact"
                  />
                </VCol>

                <!-- 👉 Select Product Name -->
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <VTextField
                    v-model="searchByProductName"
                    :label="$t('Product Name')"
                    type="Product Name"
                    density="compact"
                  />
                </VCol>

                <!-- 👉 Button Search and Export -->
                <VCol
                  cols="12"
                  lg="4"
                  class="py-1 d-flex"
                >
                  <VRow>
                    <VCol cols="6">
                      <VBtn
                        height="100%"
                        width="100%"
                        color="green"
                        density="compact"
                        class="mx-0"
                        
                        @click="isDialogPrintLabelVisible = true"
                      >
                        {{ $t('Search') }}
                      </VBtn>
                    </VCol>
                    <VCol cols="6">
                      <VBtn
                        color="red"
                        height="100%"
                        width="100%"
                        density="compact"
                        @click="clearModel"
                      >
                        {{ $t('Clear') }}
                      </VBtn>
                    </VCol>
                  </VRow>
                </VCol>
              </VRow>
            </VForm>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </div>
  </section>

  <!-- Dialog Image -->
  <section>
    <VDialog
      v-model="isDialogImageVisible"
      persistent
      class=""
      max-width="500"
    >
      <VCard class="">
        <VCardTitle class="d-flex justify-space-between bg-primary">
          <div>
            <span class="text-white">{{ $t('Image Product') }}</span>
          </div>
          <div>
            <IconBtn
              size="30"
              @click="isDialogImageVisible = false"
            >
              <VIcon
                size="30"
                icon="mdi-close-circle"
              />
            </IconBtn>
          </div>
        </VCardTitle>
        <VImg
          style="width: 100%;"
          :src="imgProduct"
          cover
        />
        <VCardActions
          class="bg-primary"
          style="width: 100%; padding: 0;"
        >
          <VBtn
            color="red-green-1"
            variant="text"
            style="width: 100%;"
            @click="showExpansionDialog = !showExpansionDialog"
          >
            <VIcon
              size="40px"
              color="white"
              :icon="showExpansionDialog ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            />
            <span class="text-white">{{ $t('Details') }}</span>
          </VBtn>
        </VCardActions>

        <VExpandTransition>
          <div v-show="showExpansionDialog">
            <VCardText class="bg-green-lighten-3">
              <div>
                <VRow>
                  <VCol
                    cols="12"
                    lg="6"
                  >
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Name")
                    }}:&nbsp;</span>&nbsp;{{ nameProduct }}<br>
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Code")
                    }}:&nbsp;</span>&nbsp;{{ codeProduct }}<br>
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Barcode")
                    }}:&nbsp;</span>&nbsp;{{ barcodeProduct }}<br>
                  </VCol>
                  <VCol
                    cols="12"
                    lg="6"
                  >
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Categories")
                    }}:&nbsp;</span>&nbsp;{{ categoriesProduct }}<br>
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Group")
                    }}:&nbsp;</span>&nbsp;{{ groupProduct }}<br>
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Sup Group")
                    }}:&nbsp;</span>&nbsp;{{ groupSupProduct }}<br>
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Total")
                    }}:&nbsp;</span>&nbsp;<span v-if="totalProduct">{{ (formatDecimal(totalProduct)).toLocaleString('en-US') }} {{ unitNameProduct }}<br><br></span>
                  </VCol>
                </VRow>
                <span style="font-size: large; font-weight: 900;">{{
                  $t("Details ")
                }} :</span>{{ detailsProduct }}
              </div>
            </VCardText>
          </div>
        </VExpandTransition>
      </VCard>
    </VDialog>
  </section>

  <div class="mt-4">
    <VCard>
      <VCardText>
        <VRow>
          <VCol cols="6">
            <VBtn
              color="yellow"
              @click="setAccount('Amin')"
            >
              Admin
            </VBtn>
            <VBtn
              color="blue"
              @click="setAccount('ViewerKK')"
            >
              ViewerKK
            </VBtn>
            <VBtn
              color="brown"
              @click="setAccount('INSP')"
            >
              INSP
            </VBtn>
            <VBtn
              color="light-blue"
              @click="setAccount('SALLOG')"
            >
              SAL/LOG
            </VBtn>
            <VBtn
              color="deep-purple"
              @click="setAccount('WH')"
            >
              WH
            </VBtn>
            <VBtn @click="setAccount('All')">
              All
            </VBtn>
            <VBtn @click="viewAllData">
              All
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>

  <section>
    <VDialog
      v-model="isDialogVisiblePrintTruck"
      width="100%"
    >
      <!-- Dialog Content -->
      <VCard title="Truck Order">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogVisiblePrintTruck = false"
        />

        <VCardText style="overflow-x: auto;">
          <table class="custom-table">
            <thead>
              <tr>
                <th
                  colspan="12"
                  class="text-center"
                >
                  SANYO KASEI (THAILAND) LTD.
                </th>
              </tr>
              <tr>
                <th
                  colspan="12"
                  class="text-center"
                >
                  Rojana Industrial Park-Rayong, 5/5 Moo 11 T. Nongbua, A.Bankhai, Rayong 21120
                </th>
              </tr>
              <tr>
                <th
                  colspan="12"
                  class="text-center"
                >
                  Tel. : (038) 627-0505 Fax. (038 946-072)
                </th>
              </tr>
              <tr>
                <th
                  colspan="12"
                  class="text-center"
                >
                  ใบสั่งรถขนส่ง / Truck order
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th colspan="4">
                  วันที่ (Date):
                </th>
                <td
                  colspan="8"
                  class="text-center"
                >
                  24/07/2024
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  เลขที่ใบสั่งงานรถขนส่ง (Truck order no)
                </th>
                <th colspan="8">
                  <VTextField
                    style="min-width: 250px;"
                    density="compact"
                    class="text-center"
                  >
                    <template #prepend>
                      Running Number:
                    </template>
                  </VTextField>
                </th>
              </tr>
              <tr>
                <th colspan="4">
                  เลขที่อ้างอิง (Ref SO No.)
                </th>
                <td
                  colspan="8"
                  class="text-center"
                >
                  Shipment plan
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  ชื่อบริษัท (Company Name)
                </th>
                <th colspan="8">
                  <VAutocomplete
                    class="text-center"
                    density="compact"
                    label="Company Name"
                    :items="items"
                    placeholder="Select State"
                  />
                </th>
              </tr>
              <tr>
                <th colspan="4">
                  ที่อยู่ (Address)
                </th>
                <td
                  colspan="8"
                  class="text-center"
                >
                  LEO Global Logistics Public Company Limited 251-251/1 Soi Pakdee, Rama 3 Road, Bangkorlaem, Bangkok 10120 Thailand
                </td>
              </tr>
              <tr>
                <th colspan="4" />
                <th
                  colspan="8"
                  class="text-center"
                />
              </tr>
              <tr>
                <th colspan="4">
                  บริษัทขนส่ง (Transportation Company Name)
                </th>
                <th
                  colspan="8"
                  class="text-center"
                >
                  <VAutocomplete
                    class="text-center"
                    density="compact"
                    label="Transportation Company Name"
                    :items="items"
                    placeholder="Select State"
                  />
                </th>
              </tr>
              <tr>
                <th colspan="4">
                  ประเภทรถ (Truck type)
                </th>
                <th
                  colspan="8"
                  class="text-center"
                >
                  <VAutocomplete
                    class="text-center"
                    density="compact"
                    label="Truck type"
                    :items="items"
                    placeholder="Select State"
                  />
                </th>
              </tr>
              <tr>
                <th colspan="4">
                  ทะเบียนรถ (Truck license)
                </th>
                <th
                  colspan="8"
                  class="text-center"
                >
                  <VTextField
                    style="min-width: 250px;"
                    density="compact"
                    label="Enter Truck License"
                    class="text-center"
                  />
                </th>
              </tr>
              <tr>
                <th colspan="4">
                  ชื่อพนักงานขับรถ (Drive Name)
                </th>
                <td
                  colspan="8"
                  class="text-center"
                >
                  <VTextField
                    style="min-width: 250px;"
                    density="compact"
                    label="Drive Name"
                    placeholder="MR. ABCD"
                    class="text-center"
                  />
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  เลขที่อ้างอิง (Ref SO No.)
                </th>
                <td
                  colspan="8"
                  class="text-center"
                >
                  <VTextField
                    style="min-width: 250px;"
                    density="compact"
                    label="Ref SO No."
                    placeholder="000000000"
                    class="text-center"
                  />
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  เบอร์ติดต่อ (Tel)    
                </th>
                <td
                  colspan="8"
                  class="text-center"
                >
                  <VTextField
                    style="min-width: 250px;"
                    density="compact"
                    label="Tel"
                    placeholder="000-0000000"
                    class="text-center"
                  />
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  หมายเหตุ (Remark) 
                </th>
                <th
                  colspan="8"
                  class="text-center"
                >
                  <VTextarea
                    label="Default"
                    placeholder="Enter Remark"
                    clearable
                    clear-icon="ri-close-line"
                    row-height="30"
                  />
                </th>
              </tr>
            </tbody>
          </table>
          <table class="custom-table">
            <tr>
              <th colspan="4">
                <VTextField
                  
                  density="compact"
                  class="text-center"
                >
                  <template #label>
                    พนักงานขับรถ / Drivers By
                  </template>
                </VTextField>
              </th>
              <th colspan="4">
                <VTextField
                  
                  density="compact"
                  class="text-center"
                >
                  <template #label>
                    ผู้สั้งการ / Oder By
                  </template>
                </VTextField>
              </th>
              <th colspan="4">
                <VTextField
                  
                  density="compact"
                  class="text-center"
                >
                  <template #label>
                    ผู้อนุมัติ / Authorized By
                  </template>
                </VTextField>
              </th>
            </tr>
            <tr>
              <th colspan="4">
                <VueDatePicker
                  v-model="dateSupervisor"
                  :max-date="new Date()"
                  :enable-time-picker="false"
                />
              </th>
              <th colspan="4">
                <VueDatePicker
                  v-model="dateSupervisor"
                  :max-date="new Date()"
                  :enable-time-picker="false"
                />
              </th>
              <th colspan="4">
                <VueDatePicker
                  v-model="dateSupervisor"
                  :max-date="new Date()"
                  :enable-time-picker="false"
                />
              </th>
            </tr>
          </table>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            color="warning"
            @click="isDialogVisiblePrintTruck = false"
          >
            <VIcon
              start
              icon="ri-printer-fill"
            />
            Print
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <!-- Dialog PDF -->
  <section>
    <VDialog
      v-model="isDialogPDFViewVisible"
      width="100%"
      height="100%"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardText>
          <iframe
            v-if="imgDialogPDF"
            :src="imgDialogPDF"
            width="100%"
            height="800px"
          />
          <VImg
            v-if="imgDialogPng"
            :src="imgDialogPng"
            width="100%"
          />
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            variant="outlined"
            color="secondary"
            @click="isDialogPDFViewVisible = false"
          >
            close
          </VBtn>
          <VBtn @click="isDialogPDFViewVisible = false">
            I accept
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <!-- ----------             Product  SKT                                  ------------------------------------ -->
  <section>
    <VCard class="mt-6">
      <VTable class="text-no-wrap table-header-bg rounded-0">
        <!-- 👉 table head -->
        <thead>
          <tr>
            <th>
              <VCheckbox />
            </th>
            <th
              scope="row"
              class="text-center px-1"
            >
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('No.') }}</span>
            </th>
            <th class="text-center">
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('Status') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll"
              class="px-2"
            >
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('Sale Order No.') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountAll"
              class="text-center"
            >
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('SO attachment') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="px-2"
            >
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('SAP Invoice no') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="px-2"
            >
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('Payer Name') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountINSP || accountAll"
              class="px-2"
            >
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('User') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="px-2"
            >
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('Shipper') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="px-2"
            >
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('Shipper location') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="text-center"
            >
              <span style="font-size: 16px; text-transform: capitalize;">
                {{ $t('Shipping Mark') }}
                
              </span>
            </th>
            <th v-if="accountAmin || accountViewerKK || accountSALLOG || accountINSP || accountAll">
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('End User') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="px-2"
            >
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('Consignee') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll"
              class="px-2"
            >
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('Product') }}</span>
            </th>
            <th v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll">
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('Lot number') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll"
              class="text-end px-2"
            >
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('Qty. (KG)') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="text-center"
            >
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('COA') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="bg-green-lighten-3"
            >
              <span
                style="font-size: 16px; text-transform: capitalize;"
                class="text-black"
              >{{ $t('Freight forwarder') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="bg-green-lighten-3 text-center"
              style="min-width: 150px;"
            >
              <span
                style="min-width: 250px; font-size: 16px; text-transform: capitalize;"
                class="text-center"
              >{{ $t('Carrier') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="bg-green-lighten-3"
            >
              <span
                style="font-size: 16px; text-transform: capitalize;"
                class="text-black"
              >{{ $t('Vessel name') }}</span>
            </th>
            <th class="bg-yellow-lighten-3">
              <span
                style="font-size: 16px; text-transform: capitalize;"
                class="text-black"
              >{{ $t('Voy') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="bg-green-lighten-3"
            >
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('Truck') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="bg-yellow-lighten-3 texct-end"
            >
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('Truck Reserving Number') }}</span>
            </th>
            <th v-if="accountAmin || accountViewerKK || accountWH || accountAll">
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('Truck fee') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountWH || accountSALLOG || accountAll"
              class="text-center"
              style="min-width: 300px;"
            >
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('Truck Order') }}</span>
              <VRow>
                <VCol
                  class="px-1"
                  cols="4"
                >
                  <span style="font-size: 16px; text-transform: capitalize;">Print</span> 
                </VCol>
                <VCol
                  class="px-1"
                  cols="8"
                >
                  <span style="font-size: 16px; text-transform: capitalize;">Attach File</span>
                </VCol>
              </VRow>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll"
              class="px-2"
            >
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('DO/EX') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="px-2"
            >
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('Country') }}</span>
            </th>
            <th v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll">
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('Loading date') }}</span>
            </th>
            <th v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll">
              <VRow>
                <VCol cols="6">
                  <span style="font-size: 16px; text-transform: capitalize;">{{ $t('ETD') }}</span>
                </VCol>
                <VCol
                  class="d-flex justify-end"
                  cols="6"
                >
                  <VIcon
                    size="25"
                    icon="ri-calendar-todo-fill"
                  />
                </VCol>
              </VRow>
            </th>
            <th v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll">
              <VRow>
                <VCol cols="6">
                  <span style="font-size: 16px; text-transform: capitalize;">{{ $t('ETA') }}</span>
                </VCol>
                <VCol
                  class="d-flex justify-end"
                  cols="6"
                >
                  <VIcon
                    size="25"
                    icon="ri-calendar-todo-fill"
                  />
                </VCol>
              </VRow>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="text-center"
            >
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('Delivery note') }}</span>
            </th>
            <th v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll">
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('Remark (SAL)') }}</span>
            </th>
            <th v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll">
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('Remark (WH)') }}</span>
            </th>
            <th v-if="accountAmin || accountViewerKK || accountWH || accountAll">
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('Remark (LOG)') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountWH || accountAll"
              class="px-1"
            >
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('Update By') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountWH || accountAll"
              class="px-1"
            >
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('Update Dated') }}</span>
            </th>
            <th class="text-center">
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('Save Draft') }}</span>
            </th>
            <th class="text-center">
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('Submit') }}</span>
            </th>
            <th class="text-center">
              <span style="font-size: 16px; text-transform: capitalize;">{{ $t('Action') }}</span>
            </th>
          </tr>
        </thead>
        <!-- 👉 table body -->
        <tbody>
          <tr
            v-for="(product, index) in mockData"
            :key="index"
          >
            <td>
              <VCheckbox />
            </td>
            <!-- 👉 Ordinal Number -->
            <td class="text-center px-1">
              {{ index + 1 }}
            </td>

            <td class="text-start px-1">
              <span v-if="product.status === 'Aprove'">
                <VChip color="success">{{ product.status }}</VChip>
              </span>
              <span v-else-if="product.status === 'Back to Edit'">
                <VChip color="warning">{{ product.status }}</VChip>
              </span>
              <span v-else-if="product.status === 'Reject'">
                <VChip color="error">{{ product.status }}</VChip>
              </span>
            </td>

            <!-- 👉 Secondary product categories -->
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ product.saleOrderNo }}
            </td>

            <!-- 👉 Attach File -->
            <td
              v-if="accountAmin || accountViewerKK || accountAll"
              class="text-start px-1"
              style="min-width: 380px;"
            >
              <VRow>
                <VCol cols="9">
                  <VFileInput
                    v-model="product.soAttachment"
                    hide-details
                    clearable="false"
                    placeholder="Upload your documents"
                    density="compact"
                    label="Attach File"
                    prepend-icon="ri-attachment-line"
                    style="min-width: 250px;"
                    @change="handleFileChange"
                  >
                    <template #selection="{ fileNames }">
                      <template
                        v-for="fileName in fileNames"
                        :key="fileName"
                      >
                        <VChip
                          label
                          size="small"
                          variant="outlined"
                          color="primary"
                          class="me-2"
                        >
                          {{ fileName }}
                        </VChip>
                      </template>
                    </template>
                  </VFileInput>
                </VCol>
                <VCol
                  cols="3"
                  class="pa-2"
                >
                  <VCard
                    v-if="product.pdfPreview || product.imagePreview"
                    class="pa-1"
                    @click="showDialogPDF(product.pdfPreview, product.imagePreview)"
                  >
                    <VCardText class="pa-1">
                      <div style="display: inline-block; cursor: pointer;">
                        <!-- Display PDF if available -->
                        <iframe
                          v-if="product.pdfPreview"
                          :src="product.pdfPreview"
                          width="60px"
                          height="30px"
                          style="pointer-events: none;"
                        />
                        <!-- Display Image if available -->
                        <VImg
                          v-else-if="product.imagePreview"
                          :src="product.imagePreview"
                          width="60px"
                          height="30px"
                          style="pointer-events: none;"
                        />
                      </div>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
            </td>

            <!-- 👉 Product code -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ product.sapInvoiceNo }}
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="text-start px-1"
            >
              {{ (product.payerName) }}
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountINSP || accountAll"
              class="text-start px-1"
            >
              {{ (product.user) }}
              User
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ (product.shipper) }}
              Shipper
            </td>

            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ (product.shipperLocation) }}
              shipperLocation
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
              style="min-width: 250px;"
            >
              <VRow>
                <VCol cols="8">
                  <VTextarea
                    v-model="product.shippingMark"
                    label="Shipping Mark"
                    style="min-width: 220px;"
                    :rules="rules"
                    rows="2"
                    clearable
                    placeholder="Shipping Mark"
                  />
                </VCol>
                <VCol cols="4">
                  <VBtn
                    color="warning"
                    width="100%"
                    height="100%"
                    @click="isDialogPrintLabelVisible = true"
                  >
                    <VIcon
                      size="30"
                      icon="ri-printer-fill"
                    />
                  </VBtn>
                </VCol>
              </VRow>
            </td>
            <!-- 👉 Product Name -->
            <td
              v-if="false"
              class="text-end px-1"
            >
              {{ product.endUser }}
            </td>

            <td class="text-start px-1">
              <VTextField
                v-model="product.endUser"
                density="compact"
                label="End User"
                style=" min-width: 150px;"
              />
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="text-start px-1"
            >
              {{ (product.consignee) }}
              consignee
            </td>

          

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ (product.product) }}
              product
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              <VSelect
                v-model="product.lotNumber"
                :items="items"
                label="Lot Number"
                placeholder="Select Lot"
                density="compact"
                eager
              />
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ (product.qty) }}
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              <VFileInput
                v-model="product.coa"
                hide-details
                clearable="false"
                placeholder="Upload your documents"
                density="compact"
                label="Attach File"
                prepend-icon="ri-attachment-line"
                style="min-width: 250px;"
              >
                <template #selection="{ fileNames }">
                  <template
                    v-for="fileName in fileNames"
                    :key="fileName"
                  >
                    <VChip
                      label
                      size="small"
                      variant="outlined"
                      color="primary"
                      class="me-2"
                    >
                      {{ fileName }}
                    </VChip>
                  </template>
                </template>
              </VFileInput>
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="text-start px-1"
            >
              <VSelect
                :items="items"
                label="Freight Forwarder"
                placeholder="Select Item"
                density="compact"
                eager
              />
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="text-start px-1"
            >
              <VSelect
                v-model="product.carrier"
                :items="items"
                label="Carrier"
                placeholder="Select Carrier"
                density="compact"
                eager
              />
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="text-start px-1"
            >
              <VSelect
                v-model="product.vesselName"
                :items="items"
                label="Vessel Name"
                placeholder="Select Vessel"
                density="compact"
                eager
              />
            </td>
            <td class="text-start px-1">
              <VTextField
                v-model="product.voy"
                density="compact"
                label="Voy"
                style=" min-width: 150px;"
              />
            </td>


            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
              :class="checkBgTruck(product.freightForwarder)"
            >
              {{ (product.freightForwarder) }}
            </td>

            <td
              v-if="accountAmin || accountViewerKK || accountWH || accountAll"
              class="text-center px-1"
            >
              <VTextField
                v-model="product.truckReserving"
                density="compact"
                label="Truck Reserving Number"
                style=" min-width: 150px;"
              />
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountWH || accountSALLOG || accountAll"
              class="text-start px-1"
            >
              <VTextField
                v-model="product.truckFee"
                density="compact"
                label="Truck Fee"
                style=" min-width: 150px;"
              />
            </td>

            <td
              v-if="accountAmin || accountViewerKK || accountWH || accountSALLOG || accountAll"
              class="text-start px-1"
            >
              <VRow>
                <VCol
                  class="text-center px-2"
                  cols="4"
                >
                  <VBtn
                    color="warning"
                    @click="isDialogVisiblePrintTruck = true"
                  >
                    <VIcon
                      size="30"
                      icon="ri-printer-fill"
                    />
                  </VBtn>
                </VCol>
                <VCol
                  cols="8"
                  class="px-2"
                >
                  <VFileInput
                    v-model="product.coa"
                    hide-details
                    clearable="false"
                    placeholder="Upload your documents"
                    density="compact"
                    label="Attach File"
                    prepend-icon="ri-attachment-line"
                    style="min-width: 150px;"
                  >
                    <template #selection="{ fileNames }">
                      <template
                        v-for="fileName in fileNames"
                        :key="fileName"
                      >
                        <VChip
                          label
                          size="small"
                          variant="outlined"
                          color="primary"
                          class="me-2"
                        >
                          {{ fileName }}
                        </VChip>
                      </template>
                    </template>
                  </VFileInput>
                </VCol>
              </VRow>
              
              <div class="d-flex justify-space-evenly" />
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll"
              class="text-start px-2"
            >
              {{ (product.doEx) }}
              doEx
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ (product.country) }}
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              <VueDatePicker
                v-model="product.loadingDate"
                :max-date="new Date()"
                :enable-time-picker="false"
                teleport
                :format="format"
                position="left"
                style="min-width: 150px;"
              />
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              <VueDatePicker
                v-model="product.loadingDate"
                :max-date="new Date()"
                :enable-time-picker="false"
                teleport
                :format="format"
                position="left"
                style="min-width: 150px;"
              />
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              <VueDatePicker
                v-model="product.etd"
                :max-date="new Date()"
                :enable-time-picker="false"
                teleport
                :format="format"
                position="left"
                style="min-width: 150px;"
              />
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              <VFileInput
                v-model="product.deliveryNote"
                hide-details
                clearable="false"
                placeholder="Upload your documents"
                density="compact"
                label="Attach File"
                prepend-icon="ri-attachment-line"
                style="min-width: 250px;"
              >
                <template #selection="{ fileNames }">
                  <template
                    v-for="fileName in fileNames"
                    :key="fileName"
                  >
                    <VChip
                      label
                      size="small"
                      variant="outlined"
                      color="primary"
                      class="me-2"
                    >
                      {{ fileName }}
                    </VChip>
                  </template>
                </template>
              </VFileInput>
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="text-start px-1"
            >
              <VTextarea
                v-model="product.remarkSa"
                class="pa-2"
                label="Remark (SAL)"
                style="min-width: 250px;"
                :rules="rules"
                rows="2"
                clearable
                placeholder="Placeholder Text"
              />
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="text-start px-1"
            >
              <VTextarea
                v-model="product.remarkWh"
                class="pa-2"
                label="Remark (WH)"
                style="min-width: 250px;"
                :rules="rules"
                rows="2"
                clearable
                placeholder="Placeholder Text"
              />
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountWH || accountAll"
              class="text-start px-1"
            >
              <VTextarea
                v-model="product.remarkLog"
                class="pa-2"
                label="Remark (LOG)"
                style="min-width: 250px;"
                :rules="rules"
                rows="2"
                clearable
                placeholder="Placeholder Text"
              />
            </td>

            <td
              v-if="accountAmin || accountViewerKK || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ product.byWhow }}
            </td>

            <td
              v-if="accountAmin || accountViewerKK || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ getRandomDate('2022-01-01', '2023-12-31') }}
            </td>
            
            <!-- 👉 Actions -->
            <td
              style="width: 8rem;"
              class="text-center px-1"
            >
              <VBtn color="warning">
                Save Draft
              </VBtn>
            </td>
            <td
              style="width: 8rem;"
              class="text-center px-1"
            >
              <VBtn class="mx-2">
                Submit
              </VBtn>
            </td>
            <td
              style="width: 8rem;"
              class="text-center px-1"
            >
              <VBtn
                :to="{ 
                  name: 'skt-shipping-resale',  
                }"
                color="info"
              >
                Action
              </VBtn>
            </td>
          </tr>
        </tbody>
        <!-- Total -->
        <tbody>
          <tr>
            <td class="bg-green-lighten-5" />
            <td class="bg-green-lighten-5 px-1">
              TOTAL
            </td>
            <td class="bg-green-lighten-5" />
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll"
              class="bg-green-lighten-5 px-1"
            >
              18 INVOICES
            </td>
            <td
              v-if="accountAmin || accountViewerKK || accountAll"
              class="bg-green-lighten-5"
            />
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="bg-green-lighten-5"
            >
              18 INVOICES
            </td>
          </tr>
        </tbody>
        <VDivider />
      </VTable>

      <VDivider />
      <VCardText class="d-flex align-center flex-wrap justify-end gap-4 pa-2">
        <div
          class="d-flex align-center me-3"
          style="width: 171px;"
        >
          <span class="text-no-wrap me-3">Rows per page:</span>

          <VSelect
            v-model="rowPerPage"
            density="compact"
            variant="plain"
            class="mt-n4"
            :items="[10, 20, 30, 50]"
          />
        </div>

        <div class="d-flex align-center">
          <h6 class="text-sm font-weight-regular">
            {{ paginationData }}
          </h6>

          <VPagination
            v-model="currentPage"
            :length="totalPage"
            :total-visible="$vuetify.display.mdAndUp ? 7 : 3"
            @next="selectedRows = []"
            @prev="selectedRows = []"
          />
        </div>
      </VCardText>
    </VCard>
  </section>

  <!-- Footer -->
  <section
    v-if="false"
    section
    class="fixed-bottom"
  >
    <VCard>
      <VCardText>
        <VAlert
          color="red-lighten-3"
          style="font-size: 20px;"
        >
          (Demo) Shipment  - Version : 2.1  - Data 24 Row
        </VAlert>
      </VCardText>
    </VCard>
  </section>
</template>

<style lang="scss">
.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}

// Hover For Image Product
.image-transition {
  transition: inline-size 0.2s, inline-size 0.2s;
}

.fixed-bottom {
  position: fixed;
  justify-content: center;
  inline-size: 95%;
  inset-block-end: 0;
}

.custom-table {
  border-collapse: collapse;
  border-spacing: 0;
  inline-size: 100%;
}

.custom-table,
.custom-table th,
.custom-table td {
  border: 1px solid black;
}

.custom-table th,
.custom-table td {
  padding: 8px;
  text-align: start;
}

.custom-table td {
  font-weight: 400;
}

.header {
  justify-content: space-between;
  font-weight: bold;
  text-align: center;
}
</style>

