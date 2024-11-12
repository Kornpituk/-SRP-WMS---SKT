<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { ref, watchEffect } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api' //---------------------- Import Api for Url *****

import { VDataTable } from 'vuetify/labs/VDataTable'

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
    console.log('RFID Check False:'+ checkRFIDUpdate.value)
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

//------------------------ Dialog Reject ----------------------------

const isDialogRejectVisible = ref(false)
const indexReject = ref('')

const rejectProduction = index => {
  isDialogRejectVisible.value = true
  indexReject.value = index
}

//--------------------------- Dialog Submit -------------------------------
const isDialogSubmitVisible = ref(false)
const isDialogSubmitSuccessVisible = ref(false)
const isDialogSubmitFailedVisible = ref(false)

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

//------------------------------------------ Data --------------------------------

const date = ref(new Date())


// In case of a range picker, you'll receive [Date, Date]
const format = date => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

const formatDate = date => {
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()

  return `${day}/${month}/${year}`
}

const statuses = [ 'Aprove', 'Reject', 'Back to Edit', 'Working', 'Save Draft']

// ฟังก์ชันสำหรับสุ่มสถานะ
function getRandomStatus() {
  const randomIndex = Math.floor(Math.random() * statuses.length)
  
  return statuses[3]
}

const RoleAccount = ref('User')

// ฟังก์ชันสำหรับเปลี่ยนสถานะของแถวใน productionPlan
const changeStatusProductPlanSaveDraft = index => {
  productionPlan.value[index].status = 'Save Draft'
}

const indexSubmit = ref('')

// ฟังก์ชันสำหรับเปลี่ยนสถานะของแถวใน productionPlan
const changeStatusProductPlanSubmit = index => {
  isDialogSubmitVisible.value = true
  indexSubmit.value = index
  
}

const submitProductionPlan = index => {
  productionPlan.value[index].status = 'Submit'
  isDialogSubmitVisible.value = false
  isDialogSubmitSuccessVisible.value = true
}

const defaultStatus = ref('Working')

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

const toDayDate = format(new Date())
const toDayDatePFinished = ref('NaN')

//------------------------------------------ Mock Data --------------------------------

const mockData = ref([
  {
    status: 'Working',
    inputDate: toDayDate,
    plants: "Plant A",
    reactor: "R-101",
    productCode: "PC2311001",
    productName: "Chemical X leasdasdasldjlaksdjl;kajs;ldkjalsdjl;asjd;lkasjdlkjasldkjalsjdlasjkdasdasdasdasd",
    quantity: 1000,
    uom: "kg",
    packagingType: "Drum",
    lotNumber: "LT12345",
    producingDate: date,
    finishedDate: toDayDatePFinished.value,
    storageCondition: "Cool, Dry Place",
    checkBy: "John",
    remark: "Urgent",
    byWho: 'John',
    statusDate: getRandomDate('2023/01/01', '2023/12/31'),
  },
  {
    status: 'Working',
    inputDate: toDayDate,
    plants: "Plant B",
    reactor: "R-102",
    productCode: "PC2311002",
    productName: "Chemical Y",
    quantity: 500,
    uom: "kg",
    packagingType: "Bag",
    lotNumber: "LT12346",
    producingDate: toDayDate,
    finishedDate: "2023-06-16",
    storageCondition: "Room Temperature",
    checkBy: "Alice",
    remark: "Standard Order",
    byWho: 'Alice',
    statusDate: getRandomDate('2023/01/01', '2023/12/31'),
  },
  {
    status: 'Working',
    inputDate: toDayDate,
    plants: "Plant C",
    reactor: "R-103",
    productCode: "PC2311003",
    productName: "Chemical Z",
    quantity: 1500,
    uom: "kg",
    packagingType: "Drum",
    lotNumber: "LT12347",
    producingDate: toDayDate,
    finishedDate: "2023-06-17",
    storageCondition: "Cool, Dry Place",
    checkBy: "Bob",
    remark: "",
    byWho: 'Bob',
    statusDate: getRandomDate('2023/01/01', '2023/12/31'),
  },
  {
    status: 'Working',
    inputDate: toDayDate,
    plants: "Plant D",
    reactor: "R-104",
    productCode: "PC2311004",
    productName: "Chemical A",
    quantity: 2000,
    uom: "kg",
    packagingType: "Bag",
    lotNumber: "LT12348",
    producingDate: toDayDate,
    finishedDate: "2023-06-18",
    storageCondition: "Room Temperature",
    checkBy: "Carol",
    remark: "",
    byWho: 'Carol',
    statusDate: getRandomDate('2023/01/01', '2023/12/31'),
  },
  {
    status: 'Working',
    inputDate: toDayDate,
    plants: "Plant E",
    reactor: "R-105",
    productCode: "PC2311005",
    productName: "Chemical B",
    quantity: 750,
    uom: "kg",
    packagingType: "Drum",
    lotNumber: "LT12349",
    producingDate: toDayDate,
    finishedDate: "2023-06-19",
    storageCondition: "Cool, Dry Place",
    checkBy: "Dave",
    remark: "Special Packaging",
    byWho: 'Dave',
    statusDate: getRandomDate('2023/01/01', '2023/12/31'),
  },
  {
    status: 'Working',
    inputDate: toDayDate,
    plants: "Plant F",
    reactor: "R-106",
    productCode: "PC2311006",
    productName: "Chemical C",
    quantity: 1250,
    uom: "kg",
    packagingType: "Bag",
    lotNumber: "LT12350",
    producingDate: toDayDate,
    finishedDate: "2023-06-20",
    storageCondition: "Room Temperature",
    checkBy: "Eva",
    remark: "",
    byWho: 'Eva',
    statusDate: getRandomDate('2023/01/01', '2023/12/31'),
  },
  {
    status: 'Working',
    inputDate: toDayDate,
    plants: "Plant G",
    reactor: "R-107",
    productCode: "PC2311007",
    productName: "Chemical D",
    quantity: 1750,
    uom: "kg",
    packagingType: "Drum",
    lotNumber: "LT12351",
    producingDate: toDayDate,
    finishedDate: "2023-06-21",
    storageCondition: "Cool, Dry Place",
    checkBy: "Frank",
    remark: "",
    byWho: 'Frank',
    statusDate: getRandomDate('2023/01/01', '2023/12/31'),
  },
  {
    status: 'Working',
    inputDate: toDayDate,
    plants: "Plant H",
    reactor: "R-108",
    productCode: "PC2311008",
    productName: "Chemical E",
    quantity: 2000,
    uom: "kg",
    packagingType: "Bag",
    lotNumber: "LT12352",
    producingDate: toDayDate,
    finishedDate: "2023-06-22",
    storageCondition: "Room Temperature",
    checkBy: "Grace",
    remark: "",
    byWho: 'Grace',
    statusDate: getRandomDate('2023/01/01', '2023/12/31'),
  },
  {
    status: 'Working',
    inputDate: toDayDate,
    plants: "Plant I",
    reactor: "R-109",
    productCode: "PC2311009",
    productName: "Chemical F",
    quantity: 3000,
    uom: "kg",
    packagingType: "Drum",
    lotNumber: "LT12353",
    producingDate: toDayDate,
    finishedDate: "2023-06-23",
    storageCondition: "Cool, Dry Place",
    checkBy: "Hank",
    remark: "Extra Care Required",
    byWho: 'Hank',
    statusDate: getRandomDate('2023/01/01', '2023/12/31'),
  },
  {
    status: 'Working',
    inputDate: toDayDate,
    plants: "Plant J",
    reactor: "R-110",
    productCode: "PC2311010",
    productName: "Chemical G",
    quantity: 500,
    uom: "kg",
    packagingType: "Bag",
    lotNumber: "LT12354",
    producingDate: toDayDate,
    finishedDate: "2023-06-24",
    storageCondition: "Room Temperature",
    checkBy: "Irene",
    remark: "",
    byWho: 'Irene',
    statusDate: getRandomDate('2023/01/01', '2023/12/31'),
  },
])

//---------------------------- Add Mock Data --------------------------------
const isDialogAddVisible = ref(false)

const selectedItemNamePD = ref(null)

// computed property to extract product names
const productNamesMockItems = computed(() => mockData.value.map(item => item.productName))

const findProductByName = productName => {
  return mockData.value.find(item => item.productName === productName) || {}
}

const productionPlan = ref([])
const selectedItem = ref(null)
const selectedDataTables = ref([])

const addProductToPlantrue = () => {
  if (selectedItem.value) {
    const product = findProductByName(selectedItem.value)
    if (product) {
      const formattedProducingDate = formatDate(product.producingDate) // แปลงเป็น string ตาม format ที่ต้องการ

      productionPlan.value.push({ ...product, producingDate: formattedProducingDate })
    }
    isDialogAddVisible.value = false
  }
}

const countItemProduction = ref(1)


// ฟังก์ชันสำหรับเพิ่มแถวว่างใน productionPlan
const addEmptyRowToPlan = () => {
  
  productionPlan.value.push({
    no: countItemProduction.value,
    productName: '',
    producingDate: '',

    // เพิ่มคอลัมน์อื่นๆ ตามข้อมูลใน mockData
    inputDate: '',
    plants: '',
    reactor: '',
    productCode: '',
    quantity: '',
    uom: '',
    packagingType: '',
    lotNumber: '',
    storageCondition: '',
    remark: '',
    byWho: '',
    statusDate: '',
    status: 'Working',
    updateDate: '',
  })
  countItemProduction.value+= 1
}

// Watch สำหรับอัพเดทข้อมูลเมื่อเลือกชื่อสินค้า
watch(productionPlan, newPlan => {
  newPlan.forEach((item, index) => {
    if ((item.plants || item.productCode) && item.status === 'Working') {
      const product = findProductByName(item.productCode || item.plants)
      if (product && (product.plants || product.productCode)) {
        const formattedProducingDate = formatDate(product.producingDate)

        // ตรวจสอบสถานะปัจจุบันและอัพเดทเฉพาะเมื่อจำเป็น
        if (item.producingDate !== formattedProducingDate) {
          productionPlan.value[index] = { 
            ...product, 
            producingDate: formattedProducingDate, 
            status: item.status, 
          }
        }
      }
    }
  })
}, { deep: true })

// ฟังก์ชันสำหรับอัพเดทข้อมูลเมื่อเลือกชื่อสินค้า

const cancelProduct = index => {
  productionPlan.value.splice(index, 1) ; ''
  isDialogRejectVisible.value = false
}

const cancelAllProducts = () => {
  productionPlan.value = []
}

const viewAllData = () => {
  console.log('ALl Data Date', productionPlan.value)
}

const selectedDateInput = ref(toDayDate)
const rules = [v => v.length <= 150 || 'Max 25 characters']

//---------------------------------

const items = [
  'Programming',
  'Design',
  'Vue',
  'Vuetify',
]

///------------------------------------------------------------------------------
const panel = ref(['filter'])

const addBatch = ref(false)

const currentPageDataTable = ref(1)

const refeshPage = () => {
  isSpinning.value = true
  setTimeout(() => {
    isSpinning.value = false
  }, 10*1000) // ระยะเวลาในการหมุน (1000 มิลลิวินาที = 1 วินาที)
  location.reload()
}

const isSpinning = ref(false)

const headers = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: 'NAME',
    key: 'fullName',
  },
  {
    title: 'EMAIL',
    key: 'email',
  },
  {
    title: 'DATE',
    key: 'startDate',
  },
  {
    title: 'EXPERIENCE',
    key: 'experience',
  },
  {
    title: 'AGE',
    key: 'age',
  },
]

const headersDataTable = [
  {
    title: 'data-table-select',
    key: 'data-table-select',
    align: "center",
    fixed: true,
    readonly: true,
  },
  {
    title: 'Status',
    key: 'status',
    fixed: true,
  },
  {
    title: 'No.',
    key: 'no',
  },
  {
    title: 'Input Date',
    key: 'inputDate',
  },
  {
    title: 'Plants',
    key: 'plants',
  },
  {
    title: 'Reactor',
    key: 'reactor',
  },
  {
    title: 'Item Code',
    key: 'productCode',
  },
  {
    title: 'Item Name',
    key: 'productName',
  },
  {
    title: 'Qty(Kg.)',
    key: 'quantity',
  },
  {
    title: 'UOM(Packaging)',
    key: 'uom',
  },
  {
    title: 'Packaging Type',
    key: 'packagingType',
  },
  {
    title: 'Lot Number',
    key: 'lotNumber',
  },
  {
    title: 'Producing Date',
    key: 'producingDate',
  },
  {
    title: 'Finished Date',
    key: 'finishedDate',
  },
  {
    title: 'Remark',
    key: 'remark',
  },
  {
    title: 'Update By',
    key: 'byWho',
  },
  {
    title: 'Update Date',
    key: 'updateDate',
  },
  {
    title: 'Action',
    key: 'Action',
  },
]
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
                >{{ $t('Production Plan') }}</span>
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
  <!-- Expansion -->
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
                <!-- 👉 Select Product code -->
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <AppDateTimePicker
                    v-model="date"
                    label="Producing Date"
                    placeholder="Select date"
                    density="compact"
                    prepend-inner-icon="ri-calendar-schedule-fill"
                    :config="{ dateFormat: 'd/m/Y' }"
                  />
                </VCol>
                
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <AppDateTimePicker
                    v-model="date"
                    label="Finished Date"
                    placeholder="Select date"
                    density="compact"
                    prepend-inner-icon="ri-calendar-schedule-fill"
                    :config="{ dateFormat: 'd/m/Y' }"
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
                    :label="$t('Lot Number')"
                    type="Product Name"
                    density="compact"
                  >
                    <template #label>
                      <span style="font-size: 12px;">Lot Number</span>
                    </template>
                  </VTextField>
                </VCol>
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <VAutocomplete
                    label="Status"
                    :items="items"
                    density="compact"
                    placeholder="Select State"
                  >
                    <template #label>
                      <span style="font-size: 12px;">Status</span>
                    </template>
                  </VAutocomplete> 
                </VCol>
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
                  >
                    <template #label>
                      <span style="font-size: 12px;">Product Name</span>
                    </template>
                  </VTextField>
                </VCol>

                <!-- 👉 Button Search and Export -->
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1 d-flex"
                >
                  <VRow>
                    <VCol cols="4">
                      <VBtn
                        height="100%"
                        width="100%"
                        color="primary"
                        density="compact"
                        class="mx-0"
                      
                        @click="isDialogPrintLabelVisible = true"
                      >
                        <span style="font-size: 12px;">{{ $t('Search') }}</span>
                      </VBtn>
                    </VCol>
                    <VCol cols="4">
                      <VBtn
                        color="red"
                        height="100%"
                        width="100%"
                        density="compact"
                        @click="clearModel"
                      >
                        <span style="font-size: 12px;">{{ $t('Clear') }}</span>
                      </VBtn>
                    </VCol>
                    <VCol
                      cols="4"
                      md="4"
                    >
                      <VBtn
                        density="compact"
                        class=" px-16 px-sm-12 pa-sm-1 custom-small-btn-excel"
                        color="warning"
                        style="width: 100%; height: 40px;"
                        @click="stockUpdateExcel"
                      >
                        <img
                          src="/src/assets/images/icons/vscode-icons_file-type-excel2.png"
                          style="width: 27px;"
                          class="custom-small-img"
                        >
                        <span style="font-size: 12px;">{{ $t('Export file') }}</span>
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
  <!-- Dialog Add -->
  <section>
    <VDialog
      v-model="isDialogAddVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard title="Select Name To Plan">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogAddVisible = false"
        />

        <VCardText>
          <VCombobox
            v-model="selectedItem"
            :items="productNamesMockItems"
            placeholder="deployment"
          />
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            variant="outlined"
            color="secondary"
            @click="isDialogAddVisible = false"
          >
            close
          </VBtn>
          <VBtn @click="addProductToPlantrue">
            Add
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>
  <!-- Dialog Reject -->
  <section>
    <VDialog
      v-model="isDialogRejectVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard title="Comment">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogRejectVisible = false"
        />

        <VCardText>
          <VTextarea
            label="Comment"
            placeholder="Enter Comment Reject"
          />
        </VCardText>

        <VCardText class="d-flex justify-space-between flex-wrap gap-4">
          <VBtn
            color="error"
            @click="cancelProduct(indexReject)"
          >
            Reject
          </VBtn>
          <VBtn
            color="warning"
            @click="isDialogRejectVisible = false"
          >
            close
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <!-- Dialog Submit -->
  <section>
    <VDialog
      v-model="isDialogSubmitVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardText>
          <div class="d-flex justify-center">
            <VIcon
              size="100"
              color="warning"
              icon="ri-question-line"
            />
          </div>
          <div class="text-center">
            <span style="font-size: 22px; font-weight: bolder;">Are you sure you want to submit?</span>
          </div>
        </VCardText>

        <VCardAction class="d-flex justify-space-between pa-4">
          <VBtn
            color="error"
            @click="isDialogSubmitVisible = false"
          >
            Cancel
          </VBtn>
          <VBtn
            color="green"
            @click="submitProductionPlan(indexSubmit)"
          >
            Submit
          </VBtn>
        </VCardAction>
      </VCard>
    </VDialog>
  </section>
  <!-- Dialog Submit Success -->
  <section>
    <VDialog
      v-model="isDialogSubmitSuccessVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardText>
          <div class="d-flex justify-center">
            <VIcon
              size="100"
              color="success"
              icon="ri-checkbox-circle-line"
            />
          </div>
          <div class="text-center">
            <span style="font-size: 22px; font-weight: bolder;">Submission Success</span>
          </div>
        </VCardText>

        <VCardAction class="d-flex justify-center pa-4">
          <VBtn
            color="success"
            @click="isDialogSubmitSuccessVisible = false"
          >
            Continue
          </VBtn>
        </VCardAction>
      </VCard>
    </VDialog>
  </section>
  <!-- Dialog Submit Failed -->
  <section>
    <VDialog
      v-model="isDialogSubmitFailedVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardText>
          <div class="d-flex justify-center">
            <VIcon
              size="100"
              color="error"
              icon="ri-error-warning-line"
            />
          </div>
          <div class="text-center">
            <span style="font-size: 22px; font-weight: bolder;">Submission Failed</span>
          </div>
        </VCardText>

        <VCardAction class="d-flex justify-center pa-4">
          <VBtn
            color="error"
            @click="isDialogSubmitFailedVisible = false"
          >
            Continue
          </VBtn>
        </VCardAction>
      </VCard>
    </VDialog>
  </section>

  <div
    v-if="RoleAccount === 'User'"
    class="my-2"
  >
    <VCard>
      <VCardText class="pa-2">
        <VBtn @click="addBatch = true">
          <span style="font-size: 12px;">Add Batch</span>
        </VBtn>
        <VBtn
          color="error"
          class="mx-2"
          @click="addBatch = false"
        >
          <span style="font-size: 12px;">Cancel Batch</span>
        </VBtn>
        <VBtn
          class="mx-2"
          color="warning"
          @click="viewAllData"
        >
          <span style="font-size: 12px;">Save Draft</span>
        </VBtn>
        <VBtn @click="viewAllData">
          <span style="font-size: 12px;">Approve</span>
        </VBtn>
        <VBtn
          color="info"
          class="mx-2"
          @click="addEmptyRowToPlan"
        >
          <span style="font-size: 12px;">Add Item</span>
        </VBtn>
        <VBtn
          icon
          size="small"
          @click="refeshPage"
        >
          <VIcon
            size="20"
            icon="ri-restart-line"
            :class="{ spinning: isSpinning }"
          />
        </VBtn>
      </VCardText>
    </VCard>
  </div>

  <div
    v-if="RoleAccount === 'Manager'"
    class="mt-4"
  >
    <VBtn @click="viewAllData">
      Approve
    </VBtn>
    <VBtn
      color="warning"
      class="mx-4"
      @click="addEmptyRowToPlan"
    >
      Add Plan
    </VBtn>
    <VBtn
      v-if="false"
      color="error"
      @click="addEmptyRowToPlan"
    >
      Reject
    </VBtn>
  </div>

  <!-- ----------             Production plan                                ------------------------------------ -->
  <section v-if="addBatch">
    <VCard
      v-if="false"
      class="mt-4"
    >
      <VTable class=" table-header-bg rounded-0">
        <!-- 👉 table head -->
        <thead class="text-no-wrap">
          <tr>
            <th
              scope="row"
              class="text-center px-1"
            >
              <span style="font-size: 12px; text-transform: capitalize;">{{ $t('No.') }}</span>
            </th>
            <th
              scope="row"
              class="text-start "
            >
              <span style="font-size: 12px; text-transform: capitalize;">{{ $t('Status') }}</span>
            </th>
            <th
              scope="row"
              class="text-center"
              style="padding-inline: 50px;"
            >
              <span style="font-size: 12px; text-transform: capitalize;">{{ $t('Input Date') }}</span>
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                style="font-size: 14px; text-transform: capitalize;"
                @click="toggleSortType('sortByQty')"
              />
            </th>
            <th
              scope="row"
              class="text-center px-1"
            >
              <span style="font-size: 12px; text-transform: capitalize;">{{ $t('Plants') }}</span>
              <VMenu
                v-if="false"
                v-model="menuUoM"
                :close-on-content-click="false"
                location="end"
                disabled
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
              class="text-center px-1"
            >
              <span style="font-size: 12px; text-transform: capitalize;">{{ $t('Reactor') }}</span>
              <VMenu
                v-if="false"
                v-model="menuUoM"
                :close-on-content-click="false"
                location="end"
                disabled
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
              class="text-start px-1"
            >
              <span style="font-size: 12px; text-transform: capitalize;">{{ $t('Product code') }}</span>
              <VMenu
                v-if="false"
                v-model="menuUoM"
                :close-on-content-click="false"
                location="end"
                disabled
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
              class="text-start px-1"
            >
              <span style="font-size: 12px; text-transform: capitalize;">{{ $t('Product name') }}</span>
              <VMenu
                v-if="false"
                v-model="menuUoM"
                :close-on-content-click="false"
                location="end"
                disabled
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
              class="text-start px-1"
            >
              <span style="font-size: 12px; text-transform: capitalize;">{{ $t('Qty. (Kg)') }}</span>
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                style="font-size: 14px; text-transform: capitalize;"
                @click="toggleSortType('sortByQty')"
              />
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              <span style="font-size: 12px; text-transform: capitalize;">{{ $t('UOM (Packaging)') }}</span>
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                style="font-size: 14px; text-transform: capitalize;"
                @click="toggleSortType('sortByQty')"
              />
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              <span style="font-size: 12px; text-transform: capitalize;">{{ $t('Packaging type') }}</span>
              <VMenu
                v-if="false"
                v-model="menuUoM"
                :close-on-content-click="false"
                location="end"
                disabled
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
              class="text-start px-1"
            >
              <span style="font-size: 12px; text-transform: capitalize;">{{ $t('Lot number') }}</span>
              <VMenu
                v-if="false"
                v-model="menuUoM"
                :close-on-content-click="false"
                location="end"
                disabled
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
              class="text-start"
            >
              <span style="font-size: 12px; text-transform: capitalize;">{{ $t('Producing date') }}</span>
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                style="font-size: 14px; text-transform: capitalize;"
                @click="toggleSortType('sortByQty')"
              />
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              <span style="font-size: 12px; text-transform: capitalize;">{{ $t('Finished date') }}</span>
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                style="font-size: 14px; text-transform: capitalize;"
                @click="toggleSortType('sortByQty')"
              />
            </th>
            <th
              scope="row"
              class="text-start"
              style="padding-inline: 100px;"
            >
              <span style="font-size: 12px; text-transform: capitalize;">{{ $t('Remark') }}</span>
            </th>
            
            <th
              scope="row"
              class="text-start "
            >
              <span style="font-size: 12px; text-transform: capitalize;">{{ $t('Update By') }}</span>
              <VMenu
                v-model="menuUoM"
                :close-on-content-click="false"
                location="end"
                disabled
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
              class="text-center px-1"
            >
              <span style="font-size: 12px; text-transform: capitalize;">{{ $t('Update On') }}</span>
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                style="font-size: 14px; text-transform: capitalize;"
                @click="toggleSortType('sortByQty')"
              />
            </th>
            <th
              scope="row"
              class="text-center px-1"
            >
              <span style="font-size: 12px; text-transform: capitalize;">{{ $t('Action') }}</span>
            </th>
          </tr>
        </thead>
        <tbody class="text-no-wrap">
          <tr
            v-for="(item, index) in productionPlan"
            :key="index"
            style="font-size: 14px;"
          >
            <td>{{ index + 1 }}</td>
            <td class="text-start">
              <span v-if="item.status === 'Aprove'">
                <VChip color="success">{{ item.status }}</VChip>
              </span>
              <span v-if="item.status === 'Submit'">
                <VChip color="success">{{ item.status }}</VChip>
              </span>
              <span v-else-if="item.status === 'Back to Edit'">
                <VChip color="warning">{{ item.status }}</VChip>
              </span>
              <span v-else-if="item.status === 'Working'">
                <VChip color="info">{{ item.status }}</VChip>
              </span>
              <span v-else-if="item.status === 'Save Draft'">
                <VChip color="warning">{{ item.status }}</VChip>
              </span>
              <span v-else-if="item.status === 'Reject'">
                <VChip color="error">{{ item.status }}</VChip>
              </span>
            </td>
            <td>
              <AppDateTimePicker
                v-model="item.inputDate"
                density="compact"
                prepend-inner-icon="ri-calendar-schedule-fill"
                :config="{ dateFormat: 'd/m/Y' }"
              >
                <template #label>
                  <span>Input Data</span>
                </template>
              </AppDateTimePicker>
            </td>
            <td>
              <VCombobox
                v-model="item.plants"
                :readonly="item.status === 'Submit'"
                :items="productNamesMockItems"
                placeholder="deployment"
                density="compact"
                label="Plants Type"
                style="width: 150px;"
              />
            </td>
            <td>{{ item.reactor }}</td>
            <td>
              <VCombobox
                v-model="item.productCode"
                :items="productNamesMockItems"
                placeholder="deployment"
                density="compact"
                label="Plants Code"
                style="width: 150px;"
                :readonly="item.status === 'Submit'"
              />
            </td>
            <td>
              <VCombobox
                v-model="item.productName"
                :items="productNamesMockItems"
                placeholder="deployment"
                density="compact"
                label="Plants Name"
                style="width: 150px;"
                :readonly="item.status === 'Submit'"
              />
            </td>
            <td
              class="px-1"
              style="min-width: 150px;"
            >
              <VTextField
                v-model="item.quantity"
                label="Qty."
                type="number"
                placeholder="Select UOM"
                style="min-width: 100px;"
                density="compact"
                :readonly="item.status === 'Submit'"
              />
            </td>
            <td
              class="px-1"
              style="min-width: 150px;"
            >
              <VSelect
                v-model="item.uom"
                density="compact"
                :items="items"
                label="UOM"
                placeholder="Select UOM"
                eager
                :readonly="item.status === 'Submit'"
              />
            </td>
            <td
              class="px-1"
              style="min-width: 150px;"
            >
              <VCombobox
                v-model="item.packagingType"
                :items="productNamesMockItems"
                placeholder="deployment"
                density="compact"
                label="Packaging Type"
                :readonly="item.status === 'Submit'"
              />
            </td>
            <td
              class="px-1"
              style="min-width: 150px;"
            >
              <VTextField
                v-model="item.lotNumber"
                density="compact"
                style="min-width: 150px;"
                :readonly="item.status === 'Submit'"
              />
            </td>
            <td
              class="px-1"
              style="min-width: 150px;"
            >
              <AppDateTimePicker
                v-model="item.producingDate"
                label="Producing Date"
                placeholder="Producing date"
                density="compact"
                prepend-inner-icon="ri-calendar-schedule-fill"
                :config="{ dateFormat: 'd/m/Y' }"
              />
            </td>
            <td
              class="px-1"
              style="min-width: 150px;"
            >
              <AppDateTimePicker
                v-model="item.finishedDate"
                label="Finished Date"
                placeholder="Finished date"
                density="compact"
                prepend-inner-icon="ri-calendar-schedule-fill"
                :config="{ dateFormat: 'd/m/Y' }"
              />
            </td>
            <td style="width: 35px;">
              <VTextarea
                v-model="item.remark"
                class="pa-2"
                label="Remark"
                :rules="rules"
                rows="2"
                clearable
                placeholder="Placeholder Text"
                :readonly="item.status === 'Submit'"
              />
            </td>
            <td>
              <VTextField
                v-model="item.byWho"
                density="compact"
                style="min-width: 150px;"
                :readonly="item.status === 'Submit'"
              />
            </td>
            <td>
              {{ item.statusDate }}
            </td>
            <td v-if="item.status !== 'Submit' || RoleAccount === 'Manager'"> 
              <VBtn
                color="warning"
                @click="changeStatusProductPlanSaveDraft(index)"
              >
                Save Draft
              </VBtn>
              <VBtn
                v-if="RoleAccount === 'Manager'"
                color="red"
                class="mx-2"
                @click="rejectProduction(index)"
              >
                Reject
              </VBtn>
              <VBtn
                v-if="RoleAccount !== 'Manager'"
                color="red"
                class="mx-2"
                @click="cancelProduct(index)"
              >
                Cancel
              </VBtn>
              <VBtn
                v-if="RoleAccount !== 'Manager'"
                class="mx-2"
                color="green"
                @click="changeStatusProductPlanSubmit(index)"
              >
                Submit
              </VBtn>
              <VBtn
                v-if="RoleAccount === 'Manager'"
                class="mx-2"
                color="green"
                @click="changeStatusProductPlanSubmit(index)"
              >
                Approve
              </VBtn>
             
              
              <VBtn
                color="warning"
                prepend-icon="ri-printer-fill"
              >
                {{ $t('Print') }}
              </VBtn>
            </td>
            <td v-if="item.status === 'Submit' && RoleAccount !== 'Manager'"> 
              <VBtn
                color="grey"
                disabled
                @click="changeStatusProductPlanSaveDraft(index)"
              >
                Save Draft
              </VBtn>
              <VBtn
                color="grey"
                disabled
                class="mx-2"
                @click="cancelProduct(index)"
              >
                Cancel
              </VBtn>
              <VBtn
                class="mx-2"
                color="grey"
                disabled
                @click="changeStatusProductPlanSubmit(index)"
              >
                Submit
              </VBtn>
              
              <VBtn
                color="warning"
                prepend-icon="ri-printer-fill"
              >
                {{ $t('Print') }}
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

    <!-- VData table -->
    <VCard>
      <VCardText>
        <VDataTable
          v-model:page="currentPageDataTable"
          v-model="selectedDataTables"
          :headers="headersDataTable"
          :items="productionPlan"
          :items-per-page="5"
          show-select
          class="text-no-wrap"
        >
          <template #item="{ item }">
            <tr style="font-size: 14px;">
              <td
                class="text-center px-2"
                style="position: sticky; z-index: 1; left: 0;"
              >
                <VCheckboxBtn
                  v-model="selectedDataTables"
                  :value="item.raw"
                  @update:modelValue="(selected) => handleSelection(selected, item.raw)"
                />
              </td>
              <td
                style="position: sticky; z-index: 1; left: 40px; min-width: 150px;  justify-content: center; padding-block: 2px !important;"
                class="text-start"
              >
                <span v-if="item.raw.status === 'Aprove'">
                  <VChip color="success">{{ item.raw.status }}</VChip>
                </span>
                <span v-if="item.raw.status === 'Submit'">
                  <VChip color="success">{{ item.raw.status }}</VChip>
                </span>
                <span v-else-if="item.raw.status === 'Back to Edit'">
                  <VChip color="warning">{{ item.raw.status }}</VChip>
                </span>
                <span v-else-if="item.raw.status === 'Working'">
                  <VChip color="info">{{ item.raw.status }}</VChip>
                </span>
                <span v-else-if="item.raw.status === 'Save Draft'">
                  <VChip color="warning">{{ item.raw.status }}</VChip>
                </span>
                <span v-else-if="item.raw.status === 'Reject'">
                  <VChip color="error">{{ item.raw.status }}</VChip>
                </span>
              </td>
              <td>{{ item.raw.no }}</td>
              <td>
                <AppDateTimePicker
                  v-model="item.raw.inputDate"
                  density="compact"
                  prepend-inner-icon="ri-calendar-schedule-fill"
                  :config="{ dateFormat: 'd/m/Y' }"
                >
                  <template #label>
                    <span>Input Data</span>
                  </template>
                </AppDateTimePicker>
              </td>
              <td>
                <VCombobox
                  v-model="item.raw.plants"
                  :readonly="item.raw.status === 'Submit'"
                  :items="productNamesMockItems"
                  placeholder="deployment"
                  density="compact"
                  label="Plants Type"
                  style="width: 150px;"
                />
              </td>
              <td>{{ item.raw.reactor }}</td>
              <td>
                <VCombobox
                  v-model="item.raw.productCode"
                  :items="productNamesMockItems"
                  placeholder="deployment"
                  density="compact"
                  label="Plants Code"
                  style="width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                />
              </td>
              <td>
                <VCombobox
                  v-model="item.raw.productName"
                  :items="productNamesMockItems"
                  placeholder="deployment"
                  density="compact"
                  label="Plants Name"
                  style="width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                />
              </td>
              <td
                class="px-1"
                style="min-width: 150px;"
              >
                <VTextField
                  v-model="item.raw.quantity"
                  label="Qty."
                  type="number"
                  placeholder="Select UOM"
                  style="min-width: 100px;"
                  density="compact"
                  :readonly="item.raw.status === 'Submit'"
                />
              </td>
              <td
                class="px-1"
                style="min-width: 150px;"
              >
                <VSelect
                  v-model="item.raw.uom"
                  density="compact"
                  :items="items"
                  label="UOM"
                  placeholder="Select UOM"
                  eager
                  :readonly="item.raw.status === 'Submit'"
                />
              </td>
              <td
                class="px-1"
                style="min-width: 150px;"
              >
                <VCombobox
                  v-model="item.raw.packagingType"
                  :items="productNamesMockItems"
                  placeholder="deployment"
                  density="compact"
                  label="Packaging Type"
                  :readonly="item.raw.status === 'Submit'"
                />
              </td>
              <td
                class="px-1"
                style="min-width: 150px;"
              >
                <VTextField
                  v-model="item.raw.lotNumber"
                  density="compact"
                  style="min-width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                />
              </td>
              <td
                class="px-1"
                style="min-width: 150px;"
              >
                <AppDateTimePicker
                  v-model="item.raw.producingDate"
                  label="Producing Date"
                  placeholder="Producing date"
                  density="compact"
                  prepend-inner-icon="ri-calendar-schedule-fill"
                  :config="{ dateFormat: 'd/m/Y' }"
                />
              </td>
              <td
                class="px-1"
                style="min-width: 150px;"
              >
                <AppDateTimePicker
                  v-model="item.raw.finishedDate"
                  label="Finished Date"
                  placeholder="Finished date"
                  density="compact"
                  prepend-inner-icon="ri-calendar-schedule-fill"
                  :config="{ dateFormat: 'd/m/Y' }"
                />
              </td>
              <td>
                <VTextarea
                  v-model="item.raw.remark"
                  style="min-width: 200px;"
                  class="pa-2"
                  label="Remark"
                  :rules="rules"
                  rows="2"
                  clearable
                  placeholder="Placeholder Text"
                  :readonly="item.raw.status === 'Submit'"
                />
              </td>
              <td>
                <VTextField
                  v-model="item.raw.byWho"
                  density="compact"
                  style="min-width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                />
              </td>
              <td>
                {{ item.raw.statusDate }}
              </td>
              <td v-if="item.raw.status !== 'Submit' || RoleAccount === 'Manager'"> 
                <VBtn
                  color="warning"
                  @click="changeStatusProductPlanSaveDraft(index)"
                >
                  Save Draft
                </VBtn>
                <VBtn
                  v-if="RoleAccount === 'Manager'"
                  color="red"
                  class="mx-2"
                  @click="rejectProduction(index)"
                >
                  Reject
                </VBtn>
                <VBtn
                  v-if="RoleAccount !== 'Manager'"
                  color="red"
                  class="mx-2"
                  @click="cancelProduct(index)"
                >
                  Cancel
                </VBtn>
                <VBtn
                  v-if="RoleAccount !== 'Manager'"
                  class="mx-2"
                  color="green"
                  @click="changeStatusProductPlanSubmit(index)"
                >
                  Submit
                </VBtn>
                <VBtn
                  v-if="RoleAccount === 'Manager'"
                  class="mx-2"
                  color="green"
                  @click="changeStatusProductPlanSubmit(index)"
                >
                  Approve
                </VBtn>
             
              
                <VBtn
                  color="warning"
                  prepend-icon="ri-printer-fill"
                >
                  {{ $t('Print') }}
                </VBtn>
              </td>
              <td v-if="item.status === 'Submit' && RoleAccount !== 'Manager'"> 
                <VBtn
                  color="grey"
                  disabled
                  @click="changeStatusProductPlanSaveDraft(index)"
                >
                  Save Draft
                </VBtn>
                <VBtn
                  color="grey"
                  disabled
                  class="mx-2"
                  @click="cancelProduct(index)"
                >
                  Cancel
                </VBtn>
                <VBtn
                  class="mx-2"
                  color="grey"
                  disabled
                  @click="changeStatusProductPlanSubmit(index)"
                >
                  Submit
                </VBtn>
              
                <VBtn
                  color="warning"
                  prepend-icon="ri-printer-fill"
                >
                  {{ $t('Print') }}
                </VBtn>
              </td>
            </tr>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>
  </section>

  <!-- Footer -->
  <section class="mt-3">
    <VCard>
      <VCardText
        class="pa-1"
        style="min-width: 500px;"
      >
        <VAlert
          color="green-lighten-3"
          style="font-size: 12px;"
          class="pa-1"
        >
          Version : 2.5(Last Updated 11/11/2024 ) {{ products.length }} Rows of Data 
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

.spinning {
  animation: spin 0.5s linear infinite;
}
</style>

