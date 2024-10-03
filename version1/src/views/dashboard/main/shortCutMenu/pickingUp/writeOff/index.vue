<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { ref, watchEffect } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api'  //---------------------- Import Api for Url *****
import { useRoute } from 'vue-router'

const route = useRoute()

sessionStorage.setItem('historyPropBlock', false)

const datePickerStart = ref(route.query.dateStart)
const datePickerEnd = ref(route.query.dateEnd)
const datePickerType = ref(route.query.typeDate)

//------------------------ Get Where House Name From LocalStorage and define to whereHouseSelectedItem ---------------------------
const whereHouse = localStorage.getItem('whereHouseName')
const whereHouseSelectedItem = ref(whereHouse)

sessionStorage.setItem('historyPropBlock', false)

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

const searchByZoneId = ref([])
const searchByAreaId = ref([])
const searchBySubAreaId = ref([])

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

//------------------------------- Function Get StockUpdate Need Enter Search -----------------

const GetStockUpdate = () => {

  // Clear the access token from localStorage
  localStorage.removeItem('accessToken')

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
const GetStockUpdateForPagination = () => {

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.get(`${urlApi.value}/api/v1/StockUpdate?page=`+currentPage.value+`&perPage=`+rowPerPage.value, {
    headers: {
      'accept': '*/*',
      'x-location': `${searchByWareHouseId.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
    params: {
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
  }, {})
    .then(response => {

      products.value = response.data.items
      totalCount.value = response.data.totalCount
      currentPage.value = response.data.page
      totalPage.value = response.data.totalPages
      rowPerPage.value = response.data.perPage

      // console.log('[products.value]!!: ', products)
      // console.log('Warehouse At StockUpdate :', whereHouseSelectedItem.value)
    
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

watch(GetStockUpdateForPagination)

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

      // Now `items` contains an array of objects with id and name properties
      // console.log('wareHouse.value At index',wareHouseItemsSearchById.value)

      
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
      // selectError.value = 'Where house not selected!!'
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

  // console.log('configsShowDigit: ', configsShowDigit)
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


//---------------------------------- Dialog --------------------------------
const showExpansionDialog = ref(false)
const showStatusCancelDialog = ref(false)


/** Cancel Status */
const cancelBy = ref('')
const cancelDate = ref('')
const cancelFor = ref('')
const cancelRemark = ref('')
const cancelImage = ref('')
const cancelPOCode = ref('')

const showDetailsCancelDialog = (cancelByItem, cancelDateItem, cancelForItem, cancelRemarkItem, imagCancel, poNoItem) => {
  showStatusCancelDialog.value = true
  cancelBy.value = cancelByItem
  cancelDate.value = cancelDateItem
  cancelFor.value = cancelForItem
  cancelRemark.value = cancelRemarkItem
  cancelImage.value = imagCancel
  cancelPOCode.value = poNoItem
}

const detailsCancelDialog = () => {
  showStatusCancelDialog.value = true
}

//------------------------ Dialog Image ----------------------------
const isDialogImageVisible = ref(false)
const codeProduct = ref('')
const nameProduct = ref('')
const colorProduct = ref('')
const sizeProduct = ref('')
const statusProduct = ref('')
const imgProduct = ref('')
const barcodeProduct = ref('')
const categoriesProduct = ref('')
const groupProduct = ref('')
const groupSupProduct = ref('')
const totalProduct = ref('')
const unitNameProduct = ref('')
const detailsProduct = ref('')

const showDialogImage = (
  code, name, color, size, status, img, barcode, categories, group, groupSup, total, unitName, details,
  cancelByItem, cancelDateItem, cancelForItem, cancelRemarkItem, poNoItem,
) => {
  codeProduct.value = code
  nameProduct.value = name
  colorProduct.value = color
  sizeProduct.value = size
  statusProduct.value = status
  imgProduct.value = img
  barcodeProduct.value = barcode
  categoriesProduct.value = categories
  groupProduct.value = group
  groupSupProduct.value = groupSup
  totalProduct.value = total
  unitNameProduct.value = unitName
  detailsProduct.value = details
  
  cancelBy.value = cancelByItem
  cancelDate.value = cancelDateItem
  cancelFor.value = cancelForItem
  cancelRemark.value = cancelRemarkItem
  cancelPOCode.value = poNoItem
  isDialogImageVisible.value = true
 
  console.log('Cancel',  cancelBy.value, cancelDate.value, cancelFor.value)
}




///-------------------------- New Data Table -----------------------------
const headers = [
  {
    title: 'id',
    key: 'index',
    removable: false,
  },
  {
    title: 'image',
    key: 'image',
  },
  {
    title: 'Status',
    key: 'status',
  },
  {
    title: 'Picking No.',
    key: 'pickingNo',
  },
  {
    title: 'Picking date',
    key: 'picking',
  },
  {
    title: 'Picking Location',
    key: 'pickingLocation',
  },
  {
    title: 'Transfer No',
    key: 'transferNo',
  },
  {
    title: 'Transfer Location',
    key: 'transferLocation',
  },
  {
    title: 'Transfer By',
    key: 'transferBy',
  },
  {
    title: 'Supplier No',
    key: 'supplierNo',
  },
  {
    title: 'Supplier Name',
    key: 'supplierName',
  },
  {
    title: 'REF Doc',
    key: 'refDoc',
  },
  {
    title: 'Transfer Date',
    key: 'transferDate',
  },
  {
    title: 'Picking By',
    key: 'pickingBy',
  },
  {
    title: 'Approve/Cancel By',
    key: 'approveCancelBy',
  },
  {
    title: 'Approve/Cancel Date',
    key: 'approveCancelDate',
  },
  {
    title: 'Remark',
    key: 'remark',
  },
  {
    title: 'RFID',
    key: 'rfid',
  },
]

function getRandomDate() {
  const start = new Date(2020, 0, 1) // 1st Jan 2020
  const end = new Date() // Current date
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  
  return randomDate.toISOString().split('T')[0] // Format: YYYY-MM-DD
}

// <VChip :color="resolveChipColor(item.raw.status)">
//                   {{ item.raw.status }}
//                 </VChip>

const getRandomStatus = () => {
  const random = Math.floor(Math.random() * 4)
  switch (random) {
  case 0:
    return 'Picking'
  case 1:
    return 'Partially Picking'
  case 2:
    return 'Cancelled'
  case 3:
    return 'Partially Pending'
  default:
    return 'Success'
  }
}

const resolveChipColor = status => {
  if (status === "Picking") return "success"
  if (status === "Partially Picking") return "info"
  if (status === "Cancelled") return "error"
  if (status === "Partially Pending") return "warning"
}

const resolveChipColorTable = status => {
  if (status === "Picking") return "bg-green-lighten-5"
  if (status === "Partially Picking") return "bg-blue-lighten-5"
  if (status === "Cancelled") return "bg-red-lighten-5"
  if (status === "Partially Pending") return "bg-orange-lighten-5"
}

const resolveCardDialogTitleColorTable = status => {
  if (status === "Picking") return "bg-green"
  if (status === "Partially Picking") return "bg-blue"
  if (status === "Cancelled") return "bg-red"
  if (status === "Partially Pending") return "bg-orange"
}

const resolveTextColorTable = status => {
  if (status === "Picking") return "text-green"
  if (status === "Partially Picking") return "text-blue"
  if (status === "Cancelled") return "text-red"
  if (status === "Partially Pending") return "text-orange"
}

//*** Move */
import p1 from "@images/topProductMove/ladies/L01.webp"
import p2 from "@images/topProductMove/ladies/L02.jpg"
import p3 from "@images/topProductMove/ladies/L03.jpg"
import p4 from "@images/topProductMove/ladies/L04.jpg"
import p5 from "@images/topProductMove/ladies/L05.webp"
import p6 from "@images/topProductMove/ladies/L06.jpg"
import p7 from "@images/topProductMove/ladies/L07.jpg"
import p8 from "@images/topProductMove/ladies/L08.jpg"
import p9 from "@images/topProductMove/ladies/L09.webp"

import p10 from "@images/topProductMove/genter/genter01.webp"
import p11 from "@images/topProductMove/genter/genter02.webp"
import p12 from "@images/topProductMove/genter/genter03.webp"
import p13 from "@images/topProductMove/genter/genter04.jpg"
import p14 from "@images/topProductMove/genter/genter05.jpg"
import p15 from "@images/topProductMove/genter/genter06.jpg"
import p16 from "@images/topProductMove/genter/genter07.jpg"
import p17 from "@images/topProductMove/genter/genter08.jpg"
import p18 from "@images/topProductMove/genter/genter09.jpg"
import p19 from "@images/topProductMove/genter/genter10.jpg"

const imageLs = [p1, p2, p3, p4, p5, p6, p7, p8, p8, p9, p10,  p12, p12, p13, p14, p15, p16, p17, p18, p19]

const detailsMockData = [
  'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo dolore reprehenderit, doloribus nesciunt, ullam quisquam, nam ipsum itaque delectus inventore et natus odit alias ipsam magnam consequatur sed! Sequi, provident?',
]

const unitMockData = ['Piece', 'Kilogram', 'Meter', 'Liter', 'Pack', 'Box', 'Can', 'Bar', 'Bottle', 'Unit']

const dateRangeDelivery = ref('')

watchEffect(() => {
  console.log('Delivery Date', dateRangeDelivery.value)
})

const getRandomTransferRemark = () => {
  const random = Math.floor(Math.random() * 4)
  switch (random) {
  case 0:
    return 'Transfer Success'
  case 1:
    return 'Transfer Pending'
  case 2:
    return 'Transfer Partially Pending '
  case 3:
    return 'Transfer Cancelled'
  default:
    return 'Info'
  }
}

const mockData = Array.from({ length: 20 }, (_, index) => ({
  index: index + 1,
  image: imageLs[index + 1],
  status: getRandomStatus(),
  productName: `Product ${index + 1}` + `Color ${index + 1}` + `Size ${index + 1}`,
  productCode: `Code ${index + 1}`,
  color: `Color ${index + 1}`,
  size: `Size ${index + 1}`,
  unitName: unitMockData[index + 1],
  barcode: `Barcode ${index + 1}`,
  categories: `Category ${index + 1}`,
  groupSup: `Group Sup ${index + 1}`,
  group: `Group ${index + 1}`,
  total: Math.floor(Math.random() * 100) + 1,
  details: `Details ${index + 1}`+detailsMockData,
  pickingNo: `RN-${index}`,
  pickingDate: getRandomDate(),
  pickingBy: `Picking By ${index + 1}`, // สร้างชื่อคนที่ได้รับสินค้า
  pickingFor: `Picking For ${index + 1}`, // สร้างข้อมูลที่สินค้าได้รับมา
  pickingRemark: `Picking Remark ${index + 1}`, // สร้าง Remark การรับสินค้า
  pickingDate: getRandomDate(), // สร้างวันที่ Picking
  pKLocation: `PKLocation ${index + 1}`, // สร้างสถานที่ Picking
  pKRemark: `Transfer Remark ${index + 1}`, // สร้าง Remark การ Transfer
  transferBy: `Transfer By ${index + 1}`,
  transferLocation: `Transfer Location ${index + 1}`,
  transferNo: `Transfer No ${index + 1}`,
  transferDate: getRandomDate(), // สร้างชื่อคนที่ Transfer
  transferRemark: getRandomTransferRemark(), // สร้างชื่อคนที่ Transfer
  cancelBy: `Cancel By ${index + 1}`, // สร้างชื่อคนที่ยกเลิก
  cancelDate: getRandomDate(), // สร้างข้อมูลที่ยกเลิก
  cancelFor: `Cancel For ${index + 1}`, // สร้างข้อมูลที่ยกเลิก
  cancelRemark: `Cancel Remark ${index + 1}`, // สร้าง Remark การยกเลิก
  location: `Location ${index + 1}`,
  refDoc: `RefDoc-${index}`,
  poNo: `RB00124000${index}`,
  poDate: getRandomDate(),
  supplierId: `Supplier-${index}`,
  supplierName: `Supplier Name ${index + 1}`,
  deliveredDate: getRandomDate(),
  remark: `Remark ${index + 1}`,
  approveCancelBy: `Approve/Cancel By ${index + 1}`,
  approveCancelDate: `Approve/Cancel Date ${index + 1}`,
  rfid: `RFID ${index + 1}`,
}))

watch(mockData)
console.log(mockData)

const isSorted = column => {
  console.log('isSorted Started', column)
}

const isFiltered = ''

const remove = key => {
  this.headers = this.headers.filter(header => header.key !== key)
}

const dataProductNew = ref([])

const getDataProductNewData = () => {

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.get(`${urlApi.value}/api/v1/StockUpdate?page=1`+`&perPage=999`, {
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

      const dataWithIndex = response.data.items.map((item, index) => ({
        ...item,
        index: index, // เพิ่ม index เพื่อแสดงลำดับของสินค้า
      }))

      dataProductNew.value = dataWithIndex

      console.log('[dataProductNew.value]!!: ', dataProductNew.value)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

// watchEffect(getDataProductNewData)

const router = useRouter()

const pushBtnTable = (productId, productUnitId) => {
  console.log('pushBtnTable', productId, productUnitId), 

  // router.push('/dashboards/shortCutMenu/received/po/details')3
  router.push({
    name: '',
    query: {
      productIdParams: productId,
      productUnitIdParams: productUnitId,
    },
  })
}

//--------------------------------------- Menu Filter -------------------------------------------
import avatar1 from '@images/avatars/avatar-1.png'

const dialogHistory = (true)
const cardBtnHistory = ('picking')
const menu = ref(false)

//------------------------------------ Tabs Details/Header -------------------------------------------
import Header from '../writeOff/header.vue'
import Details from '../writeOff/datails.vue'

const currentTab = ref('Header')
const itemsSelectDetailsHeader = ['Header', 'Details']

const getComponent = item => {
  if (item === 'Header') {
    return Header
  } else if (item === 'Details') {
    return Details
  }
  
  return null
}
</script>

<template>
  <!-- Title Page -->
  <div>
    <VCard
      height="40px"
      class="d-flex align-center bg-purple-lighten-1"
    >
      <VCardTitle class="pa-1">
        <div class="d-flex justify-start align-center">
          <IconBtn
            class="cursor-pointer"
            color="#FFFFFF"
            :to="{ name: 'dashboards-main',
                   query:{
                     dialogHistory : dialogHistory,
                     cardBtnHistory : cardBtnHistory,
                     startDate : datePickerStart,
                     endDate : datePickerEnd,
                     typeDate: datePickerType
                   },
            }"
          >
            <VIcon
              size="30"
              icon="ri-close-circle-fill"
            />
          </IconBtn>
          <h4 class="text-white">
            {{ $t('Picking - Write Off') }}
          </h4>
        </div>
      </VCardTitle>
    </VCard>
  </div>

  <!-- Tab select Details \ Header -->
  <section>
    <VTabs
      v-model="currentTab"
      grow
      color="purple-lighten-1"
    >
      <VTab
        v-for="item in itemsSelectDetailsHeader"
        :key="item"
        :value="item"
      >
        {{ item }}
      </VTab>
    </VTabs>

    <VWindow
      v-model="currentTab"
      class="mt-6"
    >
      <VWindowItem
        v-for="item in itemsSelectDetailsHeader"
        :key="item"
        :value="item"
      >
        <Component
          :is="getComponent(item)"
          :start-date="datePickerStart"
          :end-date="datePickerEnd"
        />
      </VWindowItem>
    </VWindow>
  </section>

  <!-- Dialog Image -->
  <section>
    <VDialog
      v-model="isDialogImageVisible"
      class="v-dialog-sm"
      max-width="500"
    >
      <VCard>
        <VCardTitle
          :class="resolveCardDialogTitleColorTable(statusProduct)"
          class="d-flex justify-space-between"
        >
          <div>
            <span class="text-white">{{ (nameImage) }}</span>
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
        />

      
        <VCardActions
          :class="resolveCardDialogTitleColorTable(statusProduct)"
          style="width: 100%; padding: 0;"
        >
          <VBtn
            color="white-lighten-1"
            variant="text"
            style="width: 100%;"
            @click="showExpansionDialog = !showExpansionDialog"
          >
            <VIcon
              size="40px"
              color="white"
              :icon="showExpansionDialog ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            />
            {{ $t('Details') }}
          </VBtn>
        </VCardActions>

        <VExpandTransition>
          <div v-show="showExpansionDialog">
            <VDivider />

            <VCardText :class="resolveChipColorTable(statusProduct)">
              <div>
                <VRow>
                  <VCol
                    cols="12"
                    lg="6"
                  >
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Code :")
                    }}</span>{{ codeProduct }}<br>
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Barcode :")
                    }}</span>{{ barcodeProduct }}<br>
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Status :")
                    }}</span>
                    <VChip
                      v-if="statusProduct !== 'Cancelled'"
                      :text="statusProduct"
                      :color="resolveChipColor(statusProduct)"
                      size="x-small"
                      variant="elevated"
                    />
                    <VChip
                      v-if="statusProduct === 'Cancelled'"
                      :text="statusProduct"
                      :color="resolveChipColor(statusProduct)"
                      size="x-small"
                      variant="elevated"
                      @click="detailsCancelDialog"
                    />
                    <br>
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Size :")
                    }}</span>{{ sizeProduct }}<br>
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Color :")
                    }}</span>{{ colorProduct }}<br>
                  </VCol>
                  <VCol
                    cols="12"
                    lg="6"
                  >
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Name :")
                    }}</span>{{ nameProduct }}<br>
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Categories :")
                    }}</span>{{ categoriesProduct }}<br>
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Group :")
                    }}</span>{{ groupProduct }}<br>
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Sup Group :")
                    }}</span>{{ groupSupProduct }}<br>
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Total :")
                    }}</span>{{ totalProduct }} {{ unitNameProduct }}<br><br>
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
</template>

<style lang="scss">
@media screen and (min-width: 50px) and (max-width: 390px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    padding: 10px;
    font-size: 1rem;
    padding-inline: 10px;
  }

  .custom-small-btn-excel {
    padding: 2px;
    font-size: 1rem;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

@media screen and (min-width: 600px) and (max-width: 690px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    padding: 5px;
    font-size: 0;
  }

  .custom-small-btn-excel {
    font-size: 0;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

@media screen and (min-width: 400px) and (max-width: 430px) {
  .custom-small-btn-search {
    padding: 3px;
    font-size: 0.6rem;
  }

  .custom-small-btn-excel {
    padding: 3px;
    font-size: 0.6rem;
  }

  .custom-small-img {
    max-inline-size: 30px;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

@media screen and (min-width: 700px) and (max-width: 768px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    padding: 3px;
    font-size: 0.6rem;
  }

  .custom-small-btn-excel {
    padding: 3px;
    font-size: 0.6rem;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

@media screen and (min-width: 800px) and (max-width: 1200px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    padding: 3px;
    font-size: 0.6rem;
  }

  .custom-small-btn-excel {
    padding: 3px;
    font-size: 0.6rem;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

@media screen and (min-width: 1300px) and (max-width: 1500px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    padding: 3px;
    font-size: 0.6rem;
  }

  .custom-small-btn-excel {
    padding: 3px;
    font-size: 0.6rem;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

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

.cell-hover-effect:hover {
  background-color: #e9fae9 !important; /* สีเขียวอ่อน */
}

.card-image-hover:hover {
  transform: scale(1.1); /* ทำให้ขยายใหญ่ขึ้นเมื่อ hover */
}
</style>

