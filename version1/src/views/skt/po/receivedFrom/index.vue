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
    console.log('RFID Check True:'+ checkRFIDUpdate.value)
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
  if(status === 'Complete' ){
    return 'bg-green-lighten-2'
  }else if(status === 'On-going (INSP)') {
    return 'bg-yellow-lighten-1' 
  }else if(status === 'Cancel') {
    return 'bg-red' 
  }else if(status === 'All') {
    return 'bg-light-blue-lighten-2' 
  }
}

const checkColorBgStatus = status => {
  if(status === ''){
    return 'text-green'
  }else if(status === 'On-going (INSP)') {
    return 'text-warning' 
  }else if(status === 'Cancel') {
    return 'text-red' 
  }else if(status === 'All') {
    return 'text-info' 
  }
}

//------------------------------------------ Mock Data --------------------------------

// รายการของสถานะที่เป็นไปได้
const statuses2 = ['All', 'Complete', 'On-going (INSP)', 'Cancel', 'Wait for receiving', 'Send back for Edit']

const statuses = [ 'Complete', 'On-going (INSP)', 'Cancel']

// ฟังก์ชันสำหรับสุ่มสถานะ
function getRandomStatus() {
  const randomIndex = Math.floor(Math.random() * statuses.length)
  
  return statuses[randomIndex]
}


const mockData = ref([
  {
    status: getRandomStatus(),
    productId: '415600020053200',
    productName: 'EKI-B  D/M  Clean (200 kg)',
    supplierProductName: 'POTASSIUM HYDROXIDE 48% (200KG)',
    supplierCode: '400215000',
    supplierName: 'GK FINECHEM CO.,LTD.',
    pONo: '4500048218',
    deliveryDate: '2023/1/9',
    batch: '1N23010018',
    quantity: '16.000',
  },
  {
    status: getRandomStatus(),
    productId: '415600020053200',
    productName: 'EKI-B  D/M  Clean (200 kg)',
    supplierProductName: 'POTASSIUM HYDROXIDE 48% (200KG)',
    supplierCode: '400215000',
    supplierName: 'GK FINECHEM CO.,LTD.',
    pONo: '4500048946',
    deliveryDate: '2023/2/16',
    batch: '1N23020039',
    quantity: '16.000',
  },
  {
    status: getRandomStatus(),
    productId: '415600020053200',
    productName: 'EKI-B  D/M  Clean (200 kg)',
    supplierProductName: 'POTASSIUM HYDROXIDE 48% (200KG)',
    supplierCode: '400215000',
    supplierName: 'GK FINECHEM CO.,LTD.',
    pONo: '4500052803',
    deliveryDate: '2023/11/13',
    batch: '1N23110046',
    quantity: '4.000',
  },
  {
    status: getRandomStatus(),
    productId: '415600020053200',
    productName: 'EKI-B  D/M  Clean (200 kg)',
    supplierProductName: 'POTASSIUM HYDROXIDE 48% (200KG)',
    supplierCode: '400215000',
    supplierName: 'GK FINECHEM CO.,LTD.',
    pONo: '4500052986',
    deliveryDate: '2023/11/23',
    batch: '1N23110051',
    quantity: '16.000',
  },
  {
    status: getRandomStatus(),
    productId: '4156001300731.71',
    productName: 'PA C/N (1.71 Kg)',
    supplierProductName: 'ORTHO-PHOSPHORIC ACID85% (1L/BT)',
    supplierCode: '400132000',
    supplierName: 'CHEMICAL EXPRESS CO., LTD.',
    pONo: '4500052743',
    deliveryDate: '2023/11/10',
    batch: '1N23110039',
    quantity: '4.000',
  },
  {
    status: getRandomStatus(),
    productId: '4156001300731.71',
    productName: 'PA C/N (1.71 Kg)',
    supplierProductName: 'ORTHO-PHOSPHORIC ACID85% (1L/BT)',
    supplierCode: '400132000',
    supplierName: 'CHEMICAL EXPRESS CO., LTD.',
    pONo: '4500049117',
    deliveryDate: '2023/3/24',
    batch: '1N23030024',
    quantity: '4.000',
  },
  {
    status: getRandomStatus(),
    productId: '4156001300731.71',
    productName: 'PA C/N (1.71 Kg)',
    supplierProductName: 'ORTHO-PHOSPHORIC ACID85% (1L/BT)',
    supplierCode: '400132000',
    supplierName: 'CHEMICAL EXPRESS CO., LTD.',
    pONo: '4500048217',
    deliveryDate: '2023/1/17',
    batch: '1N23010017',
    quantity: '4.000',
  },
  {
    status: getRandomStatus(),
    productId: '4156001300731.71',
    productName: 'PA C/N (1.71 Kg)',
    supplierProductName: 'ORTHO-PHOSPHORIC ACID85% (1L/BT)',
    supplierCode: '400132000',
    supplierName: 'CHEMICAL EXPRESS CO., LTD.',
    pONo: '4500051353',
    deliveryDate: '2023/8/22',
    batch: '1N23080027',
    quantity: '4.000',
  },
  {
    status: getRandomStatus(),
    productId: '415600235051210',
    productName: 'ANORUMIN(210kg)  D/M  1st-Org2',
    supplierProductName: 'AEEA  (210KG)D/M',
    supplierCode: '400120001',
    supplierName: 'CATALITE CO.,LTD.',
    pONo: '4500052070',
    deliveryDate: '2023/11/3',
    batch: '1N23110014',
    quantity: '12.000',
  },
  {
    status: getRandomStatus(),
    productId: '415600235051210',
    productName: 'ANORUMIN(210kg)  D/M  1st-Org2',
    supplierProductName: 'AEEA  (210KG)D/M',
    supplierCode: '400120001',
    supplierName: 'CATALITE CO.,LTD.',
    pONo: '4500048129',
    deliveryDate: '2023/1/9',
    batch: '1N23010011',
    quantity: '16.000',
  },
  {
    status: getRandomStatus(),
    productId: '415600235051210',
    productName: 'ANORUMIN(210kg)  D/M  1st-Org2',
    supplierProductName: 'AEEA  (210KG)D/M',
    supplierCode: '400120001',
    supplierName: 'CATALITE CO.,LTD.',
    pONo: '4500048798',
    deliveryDate: '2023/3/7',
    batch: '1N23030057',
    quantity: '20.000',
  },
  {
    status: getRandomStatus(),
    productId: '415600235051210',
    productName: 'ANORUMIN(210kg)  D/M  1st-Org2',
    supplierProductName: 'AEEA  (210KG)D/M',
    supplierCode: '400120001',
    supplierName: 'CATALITE CO.,LTD.',
    pONo: '4500052784',
    deliveryDate: '2023/12/4',
    batch: '1N23120025',
    quantity: '12.000',
  },
  {
    status: getRandomStatus(),
    productId: '415600235051210',
    productName: 'ANORUMIN(210kg)  D/M  1st-Org2',
    supplierProductName: 'AEEA  (210KG)D/M',
    supplierCode: '400120001',
    supplierName: 'CATALITE CO.,LTD.',
    pONo: '4500053025',
    deliveryDate: '2023/11/27',
    batch: '1N23110053',
    quantity: '12.000',
  },
  {
    status: getRandomStatus(),
    productId: '415600810051180',
    productName: 'AKUME  D/M  1st-Org1',
    supplierProductName: 'METHYL ACRYLATE (180KG) D/M',
    supplierCode: '408432002',
    supplierName: 'VIV INTERCHEM CO.,LTD.',
    pONo: '4500052964',
    deliveryDate: '2023/12/7',
    batch: '1N23120033',
    quantity: '2.000',
  },
  {
    status: getRandomStatus(),
    productId: '415600810051180',
    productName: 'AKUME  D/M  1st-Org1',
    supplierProductName: 'METHYL ACRYLATE (180KG) D/M',
    supplierCode: '400106000',
    supplierName: 'BRIGHTEN  POLYTRADING CO.,LTD.',
    pONo: '4500049365',
    deliveryDate: '2023/3/3',
    batch: '1N23030036',
    quantity: '2.000',
  },
  {
    status: getRandomStatus(),
    productId: '415600810051180',
    productName: 'AKUME  D/M  1st-Org1',
    supplierProductName: 'METHYL ACRYLATE (180KG) D/M',
    supplierCode: '400106000',
    supplierName: 'BRIGHTEN  POLYTRADING CO.,LTD.',
    pONo: '4500051939',
    deliveryDate: '2023/9/11',
    batch: '1N23090039',
    quantity: '1.000',
  },
  {
    status: getRandomStatus(),
    productId: '415601335051200',
    productName: 'IPK  D/M  1st-Org1',
    supplierProductName: 'ISOPHORONE (200KG) D/M',
    supplierCode: '408432001',
    supplierName: 'BRIGHTEN  POLYTRADING CO.,LTD.',
    pONo: '4500052881',
    deliveryDate: '2023/11/16',
    batch: '1N23110047',
    quantity: '1.000',
  },
  {
    status: getRandomStatus(),
    productId: '415601335051200',
    productName: 'IPK  D/M  1st-Org1',
    supplierProductName: 'ISOPHORONE (200KG) D/M',
    supplierCode: '408432001',
    supplierName: 'BRIGHTEN  POLYTRADING CO.,LTD.',
    pONo: '4500048906',
    deliveryDate: '2023/2/28',
    batch: '1N23020028',
    quantity: '1.000',
  },
  {
    status: getRandomStatus(),
    productId: '415601335051200',
    productName: 'IPK  D/M  1st-Org1',
    supplierProductName: 'ISOPHORONE (200KG) D/M',
    supplierCode: '408432001',
    supplierName: 'BRIGHTEN  POLYTRADING CO.,LTD.',
    pONo: '4500052432',
    deliveryDate: '2023/10/12',
    batch: '1N23100048',
    quantity: '1.000',
  },
  {
    status: getRandomStatus(),
    productId: '415601335051200',
    productName: 'IPK  D/M  1st-Org1',
    supplierProductName: 'ISOPHORONE (200KG) D/M',
    supplierCode: '408432001',
    supplierName: 'BRIGHTEN  POLYTRADING CO.,LTD.',
    pONo: '4500052698',
    deliveryDate: '2023/10/24',
    batch: '1N23100056',
    quantity: '1.000',
  },
  {
    status: getRandomStatus(),
    productId: '415601335051200',
    productName: 'IPK  D/M  1st-Org1',
    supplierProductName: 'ISOPHORONE (200KG) D/M',
    supplierCode: '408432001',
    supplierName: 'BRIGHTEN  POLYTRADING CO.,LTD.',
    pONo: '4500047803',
    deliveryDate: '2023/1/20',
    batch: '1N23010032',
    quantity: '1.000',
  },
  {
    status: getRandomStatus(),
    productId: '415601940053200',
    productName: 'SHOKU-KY(RME)  D/M  2nd-Org1',
    supplierProductName: 'Glycerine USP (200KG)',
    supplierCode: '400125001',
    supplierName: 'UNIVATION Co.,LTD.',
    pONo: '4500049107',
    deliveryDate: '2023/2/27',
    batch: '1N23020025',
    quantity: '5.000',
  },
  {
    status: getRandomStatus(),
    productId: '415601940053200',
    productName: 'SHOKU-KY(RME)  D/M  2nd-Org1',
    supplierProductName: 'Glycerine USP (200KG)',
    supplierCode: '400125001',
    supplierName: 'UNIVATION Co.,LTD.',
    pONo: '4500048614',
    deliveryDate: '2023/1/31',
    batch: '1N23010056',
    quantity: '5.000',
  },
  {
    status: getRandomStatus(),
    productId: '415601940053200',
    productName: 'SHOKU-KY(RME)  D/M  2nd-Org1',
    supplierProductName: 'Glycerine USP (200KG)',
    supplierCode: '400125001',
    supplierName: 'UNIVATION Co.,LTD.',
    pONo: '4500051764',
    deliveryDate: '2023/9/5',
    batch: '1N23090032',
    quantity: '5.000',
  },
  {
    status: getRandomStatus(),
    productId: '415601940053200',
    productName: 'SHOKU-KY(RME)  D/M  2nd-Org1',
    supplierProductName: 'Glycerine USP (200KG)',
    supplierCode: '400125001',
    supplierName: 'UNIVATION Co.,LTD.',
    pONo: '4500052552',
    deliveryDate: '2023/10/27',
    batch: '1N23100068',
    quantity: '5.000',
  },
  {
    status: getRandomStatus(),
    productId: '415601940053200',
    productName: 'SHOKU-KY(RME)  D/M  2nd-Org1',
    supplierProductName: 'Glycerine USP (200KG)',
    supplierCode: '400125001',
    supplierName: 'UNIVATION Co.,LTD.',
    pONo: '4500052785',
    deliveryDate: '2023/11/16',
    batch: '1N23110042',
    quantity: '5.000',
  },
  {
    status: getRandomStatus(),
    productId: '415601940053200',
    productName: 'SHOKU-KY(RME)  D/M  2nd-Org1',
    supplierProductName: 'Glycerine USP (200KG)',
    supplierCode: '400125001',
    supplierName: 'UNIVATION Co.,LTD.',
    pONo: '4500052915',
    deliveryDate: '2023/11/30',
    batch: '1N23110057',
    quantity: '5.000',
  },
  {
    status: getRandomStatus(),
    productId: '415601940053200',
    productName: 'SHOKU-KY(RME)  D/M  2nd-Org1',
    supplierProductName: 'Glycerine USP (200KG)',
    supplierCode: '400125001',
    supplierName: 'UNIVATION Co.,LTD.',
    pONo: '4500053153',
    deliveryDate: '2023/12/10',
    batch: '1N23120035',
    quantity: '5.000',
  },
  {
    status: getRandomStatus(),
    productId: '415602145051200',
    productName: 'CYMERUS  D/M  1st-Org1',
    supplierProductName: 'SILICONE OIL KF96-50 (200KG) D/M',
    supplierCode: '400140001',
    supplierName: 'TECHNOSIL CO.,LTD.',
    pONo: '4500048181',
    deliveryDate: '2023/1/19',
    batch: '1N23010029',
    quantity: '1.000',
  },
  {
    status: getRandomStatus(),
    productId: '415602145051200',
    productName: 'CYMERUS  D/M  1st-Org1',
    supplierProductName: 'SILICONE OIL KF96-50 (200KG) D/M',
    supplierCode: '400140001',
    supplierName: 'TECHNOSIL CO.,LTD.',
    pONo: '4500048814',
    deliveryDate: '2023/2/21',
    batch: '1N23020036',
    quantity: '1.000',
  },
  {
    status: getRandomStatus(),
    productId: '415602145051200',
    productName: 'CYMERUS  D/M  1st-Org1',
    supplierProductName: 'SILICONE OIL KF96-50 (200KG) D/M',
    supplierCode: '400140001',
    supplierName: 'TECHNOSIL CO.,LTD.',
    pONo: '4500048928',
    deliveryDate: '2023/3/6',
    batch: '1N23030029',
    quantity: '1.000',
  },
  {
    status: getRandomStatus(),
    productId: '415602145051200',
    productName: 'CYMERUS  D/M  1st-Org1',
    supplierProductName: 'SILICONE OIL KF96-50 (200KG) D/M',
    supplierCode: '400140001',
    supplierName: 'TECHNOSIL CO.,LTD.',
    pONo: '4500049032',
    deliveryDate: '2023/3/20',
    batch: '1N23030047',
    quantity: '1.000',
  },
  {
    status: getRandomStatus(),
    productId: '415602145051200',
    productName: 'CYMERUS  D/M  1st-Org1',
    supplierProductName: 'SILICONE OIL KF96-50 (200KG) D/M',
    supplierCode: '400140001',
    supplierName: 'TECHNOSIL CO.,LTD.',
    pONo: '4500051307',
    deliveryDate: '2023/8/2',
    batch: '1N23080010',
    quantity: '1.000',
  },
  {
    status: getRandomStatus(),
    productId: '415602145051200',
    productName: 'CYMERUS  D/M  1st-Org1',
    supplierProductName: 'SILICONE OIL KF96-50 (200KG) D/M',
    supplierCode: '400140001',
    supplierName: 'TECHNOSIL CO.,LTD.',
    pONo: '4500052014',
    deliveryDate: '2023/9/7',
    batch: '1N23090020',
    quantity: '1.000',
  },
  {
    status: getRandomStatus(),
    productId: '415602145051200',
    productName: 'CYMERUS  D/M  1st-Org1',
    supplierProductName: 'SILICONE OIL KF96-50 (200KG) D/M',
    supplierCode: '400140001',
    supplierName: 'TECHNOSIL CO.,LTD.',
    pONo: '4500052156',
    deliveryDate: '2023/9/21',
    batch: '1N23090057',
    quantity: '1.000',
  },
  {
    status: getRandomStatus(),
    productId: '415602145051200',
    productName: 'CYMERUS  D/M  1st-Org1',
    supplierProductName: 'SILICONE OIL KF96-50 (200KG) D/M',
    supplierCode: '400140001',
    supplierName: 'TECHNOSIL CO.,LTD.',
    pONo: '4500052735',
    deliveryDate: '2023/10/31',
    batch: '1N23100061',
    quantity: '1.000',
  },
  {
    status: getRandomStatus(),
    productId: '415602145051200',
    productName: 'CYMERUS  D/M  1st-Org1',
    supplierProductName: 'SILICONE OIL KF96-50 (200KG) D/M',
    supplierCode: '400140001',
    supplierName: 'TECHNOSIL CO.,LTD.',
    pONo: '4500052790',
    deliveryDate: '2023/11/16',
    batch: '1N23110037',
    quantity: '1.000',
  },
  {
    status: getRandomStatus(),
    productId: '415602215051200',
    productName: 'PAME B  D/M  1st-Org1',
    supplierProductName: 'N-BUTYL ACETATE (200KG) D/M',
    supplierCode: '400200003',
    supplierName: 'VIV INTERCHEM CO.,LTD.',
    pONo: '4500052504',
    deliveryDate: '2023/11/6',
    batch: '1N23110009',
    quantity: '2.000',
  },
  {
    status: getRandomStatus(),
    productId: '415602215051200',
    productName: 'PAME B  D/M  1st-Org1',
    supplierProductName: 'N-BUTYL ACETATE (200KG) D/M',
    supplierCode: '400200003',
    supplierName: 'VIV INTERCHEM CO.,LTD.',
    pONo: '4500048831',
    deliveryDate: '2023/3/3',
    batch: '1N23030014',
    quantity: '2.000',
  },
  {
    status: getRandomStatus(),
    productId: '415602215051200',
    productName: 'PAME B  D/M  1st-Org1',
    supplierProductName: 'N-BUTYL ACETATE (200KG) D/M',
    supplierCode: '400200003',
    supplierName: 'VIV INTERCHEM CO.,LTD.',
    pONo: '4500052396',
    deliveryDate: '2023/10/12',
    batch: '1N23100045',
    quantity: '2.000',
  },
  {
    status: getRandomStatus(),
    productId: '415602215051200',
    productName: 'PAME B  D/M  1st-Org1',
    supplierProductName: 'N-BUTYL ACETATE (200KG) D/M',
    supplierCode: '400200003',
    supplierName: 'VIV INTERCHEM CO.,LTD.',
    pONo: '4500052604',
    deliveryDate: '2023/11/9',
    batch: '1N23110012',
    quantity: '2.000',
  },
  {
    status: getRandomStatus(),
    productId: '415602715051180',
    productName: 'OKOM  D/M  1st-Org2',
    supplierProductName: 'METHYL ISOBUTYL KETONE (180KG) D/M',
    supplierCode: '400154000',
    supplierName: 'THAI POLY CHEMICALS CO., LTD.',
    pONo: '4500052870',
    deliveryDate: '2023/11/23',
    batch: '1N23110052',
    quantity: '3.000',
  },
  {
    status: getRandomStatus(),
    productId: '415602715051180',
    productName: 'OKOM  D/M  1st-Org2',
    supplierProductName: 'METHYL ISOBUTYL KETONE (180KG) D/M',
    supplierCode: '400154000',
    supplierName: 'THAI POLY CHEMICALS CO., LTD.',
    pONo: '4500052102',
    deliveryDate: '2023/8/15',
    batch: '1N23080022',
    quantity: '2.000',
  },
  {
    status: getRandomStatus(),
    productId: '415602715051180',
    productName: 'OKOM  D/M  1st-Org2',
    supplierProductName: 'METHYL ISOBUTYL KETONE (180KG) D/M',
    supplierCode: '400154000',
    supplierName: 'THAI POLY CHEMICALS CO., LTD.',
    pONo: '4500048219',
    deliveryDate: '2023/1/25',
    batch: '1N23010027',
    quantity: '3.000',
  },
  {
    status: getRandomStatus(),
    productId: '415602215051200',
    productName: 'PAME B  D/M  1st-Org1',
    supplierProductName: 'N-BUTYL ACETATE (200KG) D/M',
    supplierCode: '400200003',
    supplierName: 'VIV INTERCHEM CO.,LTD.',
    pONo: '4500052604',
    deliveryDate: '2023/11/9',
    batch: '1N23110012',
    quantity: '2.000',
  },
  {
    status: getRandomStatus(),
    productId: '415602715051180',
    productName: 'OKOM  D/M  1st-Org2',
    supplierProductName: 'METHYL ISOBUTYL KETONE (180KG) D/M',
    supplierCode: '400154000',
    supplierName: 'THAI POLY CHEMICALS CO., LTD.',
    pONo: '4500052870',
    deliveryDate: '2023/11/23',
    batch: '1N23110052',
    quantity: '3.000',
  },
  {
    status: getRandomStatus(),
    productId: '415602715051180',
    productName: 'OKOM  D/M  1st-Org2',
    supplierProductName: 'METHYL ISOBUTYL KETONE (180KG) D/M',
    supplierCode: '400154000',
    supplierName: 'THAI POLY CHEMICALS CO., LTD.',
    pONo: '4500052102',
    deliveryDate: '2023/8/15',
    batch: '1N23080022',
    quantity: '2.000',
  },
  {
    status: getRandomStatus(),
    productId: '415602715051180',
    productName: 'OKOM  D/M  1st-Org2',
    supplierProductName: 'METHYL ISOBUTYL KETONE (180KG) D/M',
    supplierCode: '400154000',
    supplierName: 'THAI POLY CHEMICALS CO., LTD.',
    pONo: '4500048219',
    deliveryDate: '2023/1/25',
    batch: '1N23010027',
    quantity: '3.000',
  },
  {
    status: getRandomStatus(),
    productId: '415602715051180',
    productName: 'OKOM  D/M  1st-Org2',
    supplierProductName: 'METHYL ISOBUTYL KETONE (180KG) D/M',
    supplierCode: '400154000',
    supplierName: 'THAI POLY CHEMICALS CO., LTD.',
    pONo: '4500052102',
    deliveryDate: '2023/8/15',
    batch: '1N23080022',
    quantity: '2.000',
  },
  {
    status: getRandomStatus(),
    productId: '415602715051180',
    productName: 'OKOM  D/M  1st-Org2',
    supplierProductName: 'METHYL ISOBUTYL KETONE (180KG) D/M',
    supplierCode: '400154000',
    supplierName: 'THAI POLY CHEMICALS CO., LTD.',
    pONo: '4500048219',
    deliveryDate: '2023/1/25',
    batch: '1N23010027',
    quantity: '3.000',
  },
])

//----------------------------------------------------------------
const panel = ref([])

//----------------------------- Dialog ----------------------------------------------------------------
//--- Dialog Print / Receiving / Ins  ----------------------------------------------------------------
const isDialogVisibleAction = ref(false)

const detailsReceiv = ref([])

const viewDetailsReceive = index => {
  if (index >= 0 && index < mockData.value.length) {
    detailsReceiv.value = mockData.value[index]
  } else {
    detailsReceiv.value = {}
  }
  isDialogVisibleAction.value = true
}
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
                  style="font-size: 18px;"
                  class="text-center"
                >{{ $t('Receive Form') }}</span>
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
                  lg="3"
                  sm="6"
                  class="py-1"
                >
                  <!-- 👉 Search Product code -->
                  <VTextField
                    v-model="searchByBarcode"
                    :label="$t('Barcode')"
                    type="Barcode"
                    density="compact"
                    append-inner-icon="mdi-barcode-scan"
                  />
                </VCol>

                <!-- 👉 Select Product code -->
                <VCol
                  cols="12"
                  lg="3"
                  sm="6"
                  class="py-1"
                >
                  <VTextField
                    v-model="searchByProductId"
                    :label="$t('Product Code')"
                    type="Product Code"
                    density="compact"
                  />
                </VCol>

                <!-- 👉 Select Product Name -->
                <VCol
                  cols="12"
                  lg="3"
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
                  cols="6"
                  class="py-1 d-flex"
                >
                  <VRow>
                    <VCol cols="4">
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
                    <VCol cols="4">
                      <VBtn
                        height="100%"
                        width="100%"
                        class="mx-2"
                        color="primary"
                        density="compact"
                       
                        @click="clearModel"
                      >
                        {{ $t('Search') }}
                      </VBtn>
                    </VCol>
                    <VCol cols="4">
                      <VBtn
                        height="100%"
                        width="100%"
                        color="primary"
                        density="compact"
                        prepend-icon="ri-printer-fill"
                        class="mx-0"
                        
                        @click="isDialogPrintLabelVisible = true"
                      >
                        {{ $t('Search') }}
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

  <!-- Dialog Action -->
  <section>
    <VDialog
      v-model="isDialogVisibleAction"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardTitle class="text-center">
          RECEIVE PLAN DETAILS
        </VCardTitle>
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogVisibleAction = false"
        />

        <VCardText>
          <VTable
            height="600"
            fixed-header
          >
            <thead>
              <tr>
                <th class="text-uppercase bg-grey-lighten-1">
                  Field
                </th>
                <th class="text-uppercase bg-grey-lighten-1">
                  Value
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(value, key) in detailsReceiv"
                :key="key"
              >
                <th>{{ key }}</th>
                <td>
                  <template v-if="key === 'status'">
                    <span v-if="value === 'Complete'">
                      <VChip color="success">{{ value }}</VChip>
                    </span>
                    <span v-else-if="value === 'On-going (INSP)'">
                      <VChip color="warning">{{ value }}</VChip>
                    </span>
                    <span v-else-if="value === 'Cancel'">
                      <VChip color="error">{{ value }}</VChip>
                    </span>
                    <span v-else>
                      {{ value }}
                    </span>
                  </template>
                  <template v-else>
                    {{ value }}
                  </template>
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>

        <VCardText class="d-flex justify-center flex-wrap gap-4">
          <VBtn
            color="warning"
            @click="isDialogVisibleAction = false"
          >
            Print Labels
          </VBtn>
          <VBtn @click="isDialogVisibleAction = false">
            Receiving Form
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
            <th
              scope="row"
              class="text-center px-1"
            >
              {{ $t('Status') }}
            </th>
            <th
              scope="row"
              class="text-center px-1"
            >
              {{ $t('No.') }}
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              {{ $t('Material Code') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuProductName"
                :close-on-content-click="false"
                location="end"
              >
                <template #activator="{ props }">
                  <VIcon
                    v-bind="props"
                    color="primary"
                    icon="mdi-magnify"
                  />
                </template>

                <VCard min-width="300">
                  <VDivider />

                  <VList>
                    <VListItem>
                      <VRow>
                        <VCol
                          cols="12"
                          md="12"
                        >
                          <VTextField
                            v-model="searchByProductNameFilter"
                            class="mt-4"
                            :label="$t('Material Code')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            color="warning"
                            @click="resetSearchKey"
                          >
                            {{ $t('Reset') }}
                          </VBtn>
                        </VCol>
                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            @click="menuProductName = false"
                          >
                            {{ $t('Cancel') }}
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VListItem>
                  </VList>
                </VCard>
              </VMenu>
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              {{ $t('Material') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
               
                :close-on-content-click="false"
                location="end"
              >
                <template #activator="{ props }">
                  <VIcon
                    v-bind="props"
                    color="primary"
                    icon="mdi-magnify"
                  />
                </template>

                <VCard min-width="300">
                  <VDivider />

                  <VList>
                    <VListItem>
                      <VRow>
                        <VCol
                          cols="12"
                          md="12"
                        >
                          <VTextField
                            v-model="searchByProductNameFilter"
                            class="mt-4"
                            :label="$t('Product Name')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            color="warning"
                            @click="resetSearchKey"
                          >
                            {{ $t('Reset') }}
                          </VBtn>
                        </VCol>
                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            @click="menuProductName = false"
                          >
                            {{ $t('Cancel') }}
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VListItem>
                  </VList>
                </VCard>
              </VMenu>
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              {{ $t('Trade name') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                :close-on-content-click="false"
                location="end"
              >
                <template #activator="{ props }">
                  <VIcon
                    v-bind="props"
                    color="primary"
                    icon="mdi-magnify"
                  />
                </template>

                <VCard min-width="300">
                  <VDivider />

                  <VList>
                    <VListItem>
                      <VRow>
                        <VCol
                          cols="12"
                          md="12"
                        >
                          <VTextField
                            v-model="searchByProductNameFilter"
                            class="mt-4"
                            :label="$t('Product Name')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            color="warning"
                            @click="resetSearchKey"
                          >
                            {{ $t('Reset') }}
                          </VBtn>
                        </VCol>
                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            @click="menuProductName = false"
                          >
                            {{ $t('Cancel') }}
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VListItem>
                  </VList>
                </VCard>
              </VMenu>
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              {{ $t('Supplier Code') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                v-if="false"
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByQty')"
              />
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              {{ $t('Supplier Name') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              {{ $t('P/O No.') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuUoM"
                :close-on-content-click="false"
                location="end"
              >
                <template #activator="{ props }">
                  <VIcon
                    v-bind="props"
                    color="primary"
                    icon="mdi-magnify"
                  />
                </template>

                <VCard min-width="300">
                  <VDivider />

                  <VList>
                    <VListItem>
                      <VRow>
                        <VCol
                          cols="12"
                          md="12"
                        >
                          <VTextField
                            v-model="searchByUnitName"
                            class="mt-4"
                            :label="$t('Counting Unit')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            color="warning"
                            @click="resetSearchKey"
                          >
                            {{ $t('Reset') }}
                          </VBtn>
                        </VCol>
                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            @click="menuProductName = false"
                          >
                            {{ $t('Cancel') }}
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VListItem>
                  </VList>
                </VCard>
              </VMenu>
            </th>
            <th
              scope="row"
              class="text-end px-1"
            >
              {{ $t('Delivery Date') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByQty')"
              />
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              {{ $t('Batch') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuUoM"
                :close-on-content-click="false"
                location="end"
              >
                <template #activator="{ props }">
                  <VIcon
                    v-bind="props"
                    color="primary"
                    icon="mdi-magnify"
                  />
                </template>

                <VCard min-width="300">
                  <VDivider />

                  <VList>
                    <VListItem>
                      <VRow>
                        <VCol
                          cols="12"
                          md="12"
                        >
                          <VTextField
                            v-model="searchByUnitName"
                            class="mt-4"
                            :label="$t('Counting Unit')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            color="warning"
                            @click="resetSearchKey"
                          >
                            {{ $t('Reset') }}
                          </VBtn>
                        </VCol>
                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            @click="menuProductName = false"
                          >
                            {{ $t('Cancel') }}
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VListItem>
                  </VList>
                </VCard>
              </VMenu>
            </th>
            <th
              scope="row"
              class="text-end px-1"
            >
              {{ $t('(PCS)') }}
            </th>
            <th
              scope="row"
              class="text-end px-1"
            >
              {{ $t('(Kgs)') }}
            </th>
            <th
              scope="row"
              class="text-center px-1"
            >
              {{ $t('Action') }}
            </th>
          </tr>
        </thead>
        <!-- 👉 table body -->
        <tbody>
          <tr
            v-for="(product, index) in mockData"
            :key="index"
          >
            <td class="text-center px-1">
              <span>
                <VChip
                  v-if="product.status === 'Complete' "
                  color="success"
                >
                  {{ product.status }}
                </VChip>
              </span>
              <span>
                <VChip
                  v-if="product.status === 'On-going (INSP)' "
                  color="warning"
                >
                  {{ product.status }}
                </VChip>
              </span>
              <span>
                <VChip
                  v-if="product.status === 'Cancel' "
                  color="error"
                >
                  {{ product.status }}
                </VChip>
              </span>
            </td>

            <!-- 👉 Ordinal Number -->
            <td class="text-center px-1">
              {{ index + 1 }}
            </td>

            <!-- 👉 Product categories -->
           

            <!-- 👉 Secondary product categories -->
            <td class="text-start px-1">
              {{ product.productId }}
            </td>

            <!-- 👉 Sub product categories -->
            <td class="text-start px-1">
              {{ product.productName }}
            </td>

            <!-- 👉 Product code -->
            <td class="text-start px-1">
              {{ product.supplierProductName }}
            </td>

            <!-- 👉 Product Name -->
            <td class="text-start px-1">
              {{ (product.supplierCode) }}
            </td>

            <!-- 👉 Product Name -->
            <td class="text-start px-1">
              {{ (product.supplierName) }}
            </td>

            <!-- 👉 Product Name -->
            <td class="text-start px-1">
              {{ (product.pONo) }}
            </td>

            <!-- 👉 Product Name -->
            <td class="text-end px-1">
              {{ (product.deliveryDate) }}
            </td>

            <!-- 👉 Product Name -->
            <td class="text-start px-1">
              {{ (product.batch) }}
            </td>

            <!-- 👉 Product Name -->
            <td class="text-end px-1">
              {{ ((product.quantity)) }}
            </td>

            <!-- 👉 Product Name -->
            <td class="text-start px-1">
              {{ (product.purchasingDate) }}
            </td>

            <!-- 👉 Actions -->
            <td
              v-if="false"
              style="width: 8rem;"
              class="text-center px-1"
            >
              <RouterLink
                :to="{ 
                  name: 'inventory-stockUpdateByProduct-view-id', 
                  params: { id: index }, 
                  query: { productId: product.productId ,
                           UnitId: product.unitId,
                           warehouseStock: searchByWareHouseId ,
                           serialCode: serialProductCode,
                  }, 
                }"
              >
                <VIcon icon="mdi-eye-outline" />
              </RouterLink>
              
              <!-- MoreBtn component with menu list and item props -->
              <!--   <MoreBtn :menu-list="computedMoreListP(item.No)" item-props /> -->
            </td>
            <td
              style="width: 8rem;"
              class="text-center px-1"
            >
              <VBtn
                color="info"
                @click="viewDetailsReceive(index)"
              >
                <div>Action</div>
              </VBtn>
            </td>
          </tr>
        </tbody>
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
    section
    class="fixed-bottom"
  >
    <VCard>
      <VCardText>
        <VAlert
          color="red-lighten-3"
          style="font-size: 20px;"
        >
          Version : 2.1   Datd 50 Row
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
</style>

