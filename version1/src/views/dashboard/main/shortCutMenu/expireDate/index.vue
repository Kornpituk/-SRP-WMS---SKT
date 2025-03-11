<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { ref, watchEffect } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api'  //---------------------- Import Api for Url *****

//------------------------ Get Where House Name From LocalStorage and define to whereHouseSelectedItem ---------------------------
const whereHouse = localStorage.getItem('whereHouseName')
const whereHouseSelectedItem = ref(whereHouse)

const products = ref([]) //---------------- variable for get All Product From X-Location(Where House) *****

// Get access token from localStorage in another page
const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')

const perPage = ref(10)
const page = ref(1)
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

const searchByWareHouseId = ref(whereHouse)

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
const menuLot = ref(false)

const menuStatus = ref(null)
const selectedStatus = ref(null)

//---- adas ----//
const itemsMenuStatus = [
  {
    title: 'Expired',
    value: 'expire',
  },

  // {
  //   title: 'Alert',
  //   value: 'alert',
  // },
]

watchEffect(() => {
  console.log('selectedStatus: ', selectedStatus.value)
})

const selectStatus = status => {
  selectedStatus.value = status
}

const resetMenuStatus = () => {
  selectedStatus.value = ''
}

//------------------------ item ID for search ------------------------------
const itemsSearchByCategoryId = ref([])

const typeItemsSearchById = ref([])

const subTypeItemsSearchById = ref([])

const itemsSearchByUOMId = ref([])

const wareHouseItemsSearchById = ref([])

const zoneItemsSearchById = ref([])

const areaItemsSearchById = ref([])
const subAreaItemsSearchById = ref([])

//-------------------------- Model for search ------------------------------
const stockId = ref(searchByWareHouseId.value)
const barcode = ref(null)
const productId = ref(null)
const productName = ref(null)
const categoryId = ref(null)
const typeId = ref(null)
const subTypeId = ref(null)
const searchColStatus = ref(null)
const searchColCategory = ref(null)
const searchColTypeName = ref(null)
const searchColSubTypeName = ref(null)
const searchColBarcode = ref(null)
const searchColProductId = ref(null)
const searchColProductName = ref(null)
const searchColLot = ref(null)
const searchColUoM = ref(null)
const sortByColReceiveDate = ref(null)
const sortByColExpireDate = ref(null)
const sortByColRemainingDay = ref('asc')
const sortByColTotalQty = ref(null)

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
  const sortRefs = { sortByColReceiveDate, sortByColExpireDate, sortByColRemainingDay, sortByColTotalQty }

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

//----------------------------------- Function Reset search Key word ---------------

const resetSearchKey = () => {
  barcode.value = (null)
  productId.value = (null)
  productName.value = (null)
  categoryId.value = (null)
  typeId.value = (null)
  subTypeId.value = (null)
}

// watch(GetStockUpdateForPagination)

// Define the grouped parameter objects
const searchKeys = {
  barcode: barcode,
  productId: productId,
  productName: productName,
  categoryId: categoryId,
  typeId: typeId,
  subTypeId: subTypeId,
}

const searchColumns = {
  searchColStatus: selectedStatus,
  searchColCategory: searchColCategory,
  searchColTypeName: searchColTypeName,
  searchColSubTypeName: searchColSubTypeName,
  searchColBarcode: searchColBarcode,
  searchColProductId: searchColProductId,
  searchColProductName: searchColProductName,
  searchColLot: searchColLot,
  searchColUoM: searchColUoM,
}

const sortColumns = {
  sortByColReceiveDate: sortByColReceiveDate,
  sortByColExpireDate: sortByColExpireDate,
  sortByColRemainingDay: sortByColRemainingDay,
  sortByColTotalQty: sortByColTotalQty,
}

// Reset function to clear search keys
const resetSearchKeyNeo = () => {
  for (const key in searchKeys) {
    searchKeys[key].value = null
  }

  // Uncomment and modify if you need to reset searchColumns and sortColumns to default values
  for (const key in searchColumns) {
    searchColumns[key].value = '' // or null or any default value
  }

  for (const key in sortColumns) {
    sortColumns[key].value = '' // or null or any default value
  }

  searchByWareHouseId.value = whereHouse
}

// Combine all parameters for the request
const params = {
  page: currentPage.value,
  perPage: rowPerPage.value,
  stockId: searchByWareHouseId.value,
  ...Object.fromEntries(Object.entries(searchKeys).map(([key, ref]) => [key, ref.value])),
  ...Object.fromEntries(Object.entries(searchColumns).map(([key, ref]) => [key, ref.value])),
  ...Object.fromEntries(Object.entries(sortColumns).map(([key, ref]) => [key, ref.value])),
}

const expireDateNeo = ref(null)

const GetExpireDateForPagination = async () => {
  try {
    console.log('Before API call - currentPage:', currentPage.value)
    
    const response = await axiosIns.get(`${urlApi.value}/api/v1/Dashboard/Summary/ProductExpire/Detail`, {
      headers: {
        'accept': '*/*',
        'x-location': `${searchByWareHouseId.value}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
      params: {
        page: currentPage.value,
        perPage: rowPerPage.value,
        stockId: searchByWareHouseId.value,
        ...Object.fromEntries(Object.entries(searchKeys).map(([key, ref]) => [key, ref.value])),
        ...Object.fromEntries(Object.entries(searchColumns).map(([key, ref]) => [key, ref.value])),
        ...Object.fromEntries(Object.entries(sortColumns).map(([key, ref]) => [key, ref.value])),
      },
    })

    console.log('API response:', response.data) 

    totalCount.value = response.data.totalCount
    totalPage.value = response.data.totalPages
    expireDateNeo.value = response.data.items
    
    console.log('After API call - currentPage:', currentPage.value)
    console.log('[expireDateNeo.value]!!:', response)
  } catch (error) {
    console.error('Error:', error)
  }
}

watchEffect(GetExpireDateForPagination)

const expiredDateExportExcel = async () => {
  try {
    const response = await axiosIns.get(
      `${urlApi.value}/api/v1/Dashboard/Summary/ProductExpire/Detail/Excel`, 
      {
        headers: {
          'accept': '*/*',
          'x-location': `${whereHouse}`,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
        params: {
          stockId: searchByWareHouseId.value,
          ...Object.fromEntries(Object.entries(searchKeys).map(([key, ref]) => [key, ref.value])),
          ...Object.fromEntries(Object.entries(searchColumns).map(([key, ref]) => [key, ref.value])),
          ...Object.fromEntries(Object.entries(sortColumns).map(([key, ref]) => [key, ref.value])),
        },
        responseType: 'blob', // ให้เซิร์ฟเวอร์รีเทิร์น blob สำหรับไฟล์ Excel
      },
    )

    // สร้าง URL ของไฟล์ Excel จาก binary data
    const url = window.URL.createObjectURL(new Blob([response.data]))

    const currentDate = new Date() // สร้างวัตถุ Date ปัจจุบัน
    const day = String(currentDate.getDate()).padStart(2, '0') // ดึงวันที่ปัจจุบันและเติม 0 ด้านหน้าให้ครบ 2 หลัก
    const month = String(currentDate.getMonth() + 1).padStart(2, '0') // ดึงเดือนปัจจุบันและเติม 0 ด้านหน้าให้ครบ 2 หลัก
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

    const dateString = `${day}/${month}/${fileYear}` // ตั้งค่ารูปแบบวันที่เป็น วว/ดด/ปปปป

    const fileName = `ExpiredDate_${dateString}.xlsx` // ตั้งชื่อไฟล์โดยรวมกับวันที่

    // สร้างลิงก์สำหรับดาวน์โหลดไฟล์ Excel
    const link = document.createElement('a')

    link.href = url
    link.setAttribute('download', fileName) // ตั้งชื่อไฟล์ที่จะดาวน์โหลด
    document.body.appendChild(link)
    link.click()

    // ลบ URL หลังจากดาวน์โหลดเสร็จเรียบร้อยแล้ว
    window.URL.revokeObjectURL(url)
  } catch (error) {
    // จัดการข้อผิดพลาด
    console.error('Error:', error)
  }
}

//--------------------------------------- Function Pagination --------------------------------------------
// 👉 watching current page
watch(() => {
  if (currentPage.value > totalPage.value && totalPage.value >= 1)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = products.value.length ? (currentPage.value -1 ) * rowPerPage.value + 1 : 1
  const lastIndex = products.value.length + (currentPage.value -1 ) * rowPerPage.value

  // console.log('const firstIndex ', firstIndex, '=', 'products.value.length:'+products.value.length, '?', (currentPage.value )* rowPerPage.value + 1)
  // console.log('const lastIndex ', lastIndex, '=', products.value.length, '+', (currentPage.value ), '*', rowPerPage.value)
  // console.log('products.value.length: ', products.value.length)
  
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
      'CategoryId': categoryId.value,
    },
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
    .then(response => {

      typeItemsSearchById.value = response.data

      
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
      'TypeId': typeId.value,
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
  isDialogImageVisible.value = true

  console.log('showImageFunction!!')
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
    title: 'Received No.',
    key: 'receivedNo',
  },
  {
    title: 'received date',
    key: 'receivedDate',
  },
  {
    title: 'Location',
    key: 'location',
  },
  {
    title: 'Ref. Doc.',
    key: 'refDoc',
  },
  {
    title: 'P/O No.',
    key: 'poNo',
  },
  {
    title: 'P/O Date',
    key: 'poDate',
  },
  {
    title: 'Total',
    key: 'total',
  },
  {
    title: 'Supplier ID.',
    key: 'supplierId',
  },
  {
    title: 'Supplier Name',
    key: 'supplierName',
  },
  {
    title: 'Delivered Date',
    key: 'deliveredDate',
  },
  {
    title: 'Remark',
    key: 'remark',
  },

]

const searchFilter = ref('')

const headersMock = [
  {
    title: 'id',
    key: 'index',
  },
  {
    title: 'image',
    key: 'image',
  },
  {
    title: 'category',
    key: 'categoryName',
  },
  {
    title: 'Group',
    key: 'typeName',
    color: '#000000',
  },
  {
    title: 'Sub Group',
    key: 'subTypeName',
    nowrap: 1,
    maxWidth: '250px',
    align: 'end',
    nowrap: false,
  },
  {
    title: 'barcode',
    key: 'barcode',
  },
  {
    title: 'product Id',
    key: 'productId',
    nowrap: true,
  },
  {
    title: 'productName',
    key: 'productName',
  },
  {
    title: 'lot',
    key: 'lot',
  },

]

function getRandomDate() {
  const start = new Date(2020, 0, 1) // 1st Jan 2020
  const end = new Date() // Current date
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  
  return randomDate.toISOString().split('T')[0] // Format: YYYY-MM-DD
}

const getRandomStatus = () => {
  const random = Math.floor(Math.random() * 4)
  switch (random) {
  case 0:
    return 'Received'
  case 1:
    return 'Partially Received'
  case 2:
    return 'Pending'
  case 3:
    return 'Partially Pending'
  default:
    return 'Success'
  }
}

const resolveChipColor = status => {
  if (status === "Expire") return "error"
  if (status === "Alert") return "amber-lighten-3"
}

const resolveChipColorTable = status => {
  if (status === "Expire") return "bg-error"
  if (status === "Alert") return "bg-amber-lighten-3"
}

const resolveCardDialogTitleColorTable = status => {
  if (status === "Expire") return "bg-error"
  if (status === "Alert") return "bg-amber-lighten-1"
}

const resolveTextColorTable = status => {
  if (status === "Expire") return "bg-red-lighten-4"
  if (status === "Alert") return "bg-amber-lighten-4"
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
  receivedNo: `RN-${index}`,
  receivedDate: getRandomDate(),
  location: `Location ${index + 1}`,
  refDoc: `RefDoc-${index}`,
  poNo: `RB00124000${index}`,
  poDate: getRandomDate(),
  supplierId: `Supplier-${index}`,
  supplierName: `Supplier Name ${index + 1}`,
  deliveredDate: getRandomDate(),
  remark: `Remark ${index + 1}`,
}))

// watch(mockData)
// console.log(mockData)

const isSorted = column => {
  console.log('isSorted Started', column)
}

const isFiltered = ''

const remove = key => {
  this.headers = this.headers.filter(header => header.key !== key)
}

const dataProductNew = ref([])


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
const menu = ref(false)

//---------------------------------- Dialog --------------------------------
const showExpansionDialog = ref(false)

//----------------------------------- New Data Table-------------------
const toggleSearch = column => {
  console.log('toggleSearch :', column )
}

const formatDate = dateString => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear())
  
  return `${day}/${month}/${year}`
}

const getColorMenuStatus = title => {
  if (title === 'Expired') {
    return 'error'
  } else if (title === 'Alert') {
    return 'amber'
  }
  
  return 'default'  // default color if title doesn't match
}
</script>

<template>
  <!-- Title Page -->
  <div v-if="false">
    <VCard>
      <VCardTitle class="bg-red-lighten-3 d-flex justify-space-between">
        <div class="d-flex justify-space-between">
          <IconBtn
            class="cursor-pointer"
            color="#FFFFFF"
            :to="{ name: 'dashboards-main',
            }"
          >
            <VIcon
              size="35"
              icon="ri-close-circle-fill"
            />
          </IconBtn>
          <h3 class="text-white">
            {{ $t('Expire Date') }}
          </h3>
        </div>
      </VCardTitle>
    </VCard>
  </div>
  <div>
    <VCard
      height="40px"
      class="d-flex align-center bg-red-lighten-3"
    >
      <VCardTitle class="pa-1">
        <div class="d-flex justify-start align-center">
          <IconBtn
            class="cursor-pointer"
            color="#FFFFFF"
            :to="{ name: 'dashboards-main',
            }"
          >
            <VIcon
              size="30"
              icon="ri-close-circle-fill"
            />
          </IconBtn>
          <h4 class="text-white">
            {{ $t('Expiry Date') }}
          </h4>
        </div>
      </VCardTitle>
    </VCard>
  </div>

  <!-- ----------          New Search bar  Expansion  pannels               ------------------------------------ -->
  <section
    v-if="true"
    class="my-2"
  >
    <VExpansionPanels>
      <VExpansionPanel>
        <VExpansionPanelTitle
          ripple
          class="pa-0"
        >
          <template #default="{ expanded }">
            <VRow
              no-gutters
              class="d-flex justify-center"
            >
              <div v-if="expanded">
                <span class="text-h5">{{ $t('Filter') }}</span>
              </div>
              <span
                v-if="!expanded"
                class="text-h6"
              ><VIcon
                :color="!expanded ? '' : ''"
                :icon="expanded ? filter : 'ri-equalizer-line'"
              /></span>
            </VRow>
          </template>
          <template #actions="" />
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <VForm @submit.prevent="submitSearchButton">
            <!-- Warehouse  | Storehouse barcode | Store area | Sub Storage area -->
            <VRow>
              <!-- 👉 Select WareHouse -->
              <VCol
                cols="12"
                lg="3"
                sm="6"
                class="py-1"
              >
                <VAutocomplete
                  v-model="searchByWareHouseId"
                  :label="$t('Warehouse')"
                  :items="wareHouseItemsSearchById"
                  :custom-filter="customFilter"
                  item-title="name"
                  item-value="id"
                  item-text="name"
                  density="compact"
                  clearable
                  clear-icon="mdi-close"
                />
              </VCol>

              <!-- 👉 Select categories -->
              <VCol
                cols="12"
                lg="3"
                sm="6"
                class="py-1"
              >
                <VAutocomplete
                  v-model="categoryId"
                  :label="$t('Categories')"
                  :items="itemsSearchByCategoryId"
                  :custom-filter="customFilter"
                  item-title="name"
                  item-value="id"
                  density="compact"
                  clearable
                  clear-icon="mdi-close"
                />
              </VCol>

              <!-- 👉 Select Store area -->
              <VCol
                cols="12"
                lg="3"
                sm="6"
                class="py-1"
              >
                <VAutocomplete
                  v-model="typeId"
                  :label="$t('Product Group')"
                  :items="typeItemsSearchById"
                  :custom-filter="customFilter"
                  item-title="name"
                  item-value="id"
                  density="compact"
                  clearable
                  clear-icon="mdi-close"
                />
              </VCol>

              <!-- 👉 Select Sub Storage area -->
              <VCol
                cols="12"
                lg="3"
                sm="6"
                class="py-1"
              >
                <VAutocomplete
                  v-model="subTypeId"
                  :label="$t('Product Sub Group')"
                  :items="subTypeItemsSearchById"
                  :custom-filter="customFilter"
                  item-title="name"
                  item-value="id"
                  density="compact"
                  clearable
                  clear-icon="mdi-close"
                />
              </VCol>
            </VRow>

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
                  v-model="barcode"
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
                  v-model="productId"
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
                  v-model="productName"
                  :label="$t('Product Name')"
                  type="Product Name"
                  density="compact"
                />
              </VCol>

              <!-- 👉 Button Search and Export -->
              <VCol
                cols="12"
                xs="4"
                sm="4"
                md="3"
                class="py-1"
              >
                <VRow>
                  <!-- 👉 Button Search  -->
                  <VCol
                    xs="4"
                    sm="6"
                    cols="6"
                  >
                    <VBtn
                      v-if="false"
                      type="submit"
                      density="compact"
                      size="x-large"
                      class="px-16 px-sm-12 custom-small-btn-search"
                      style="width: 100%; height: 40px;"
                      @click="GetStockUpdate"
                    >
                      <VIcon
                        icon="mdi-magnify"
                        size="25px"
                      />
                      {{ $t('Search') }}
                    </VBtn>
                    <VBtn
                      color="red"
                      size="x-large"
                      class="px-16 px-sm-12 custom-small-btn-search"
                      style="width: 100%; height: 40px;"
                      @click="resetSearchKeyNeo"
                    >
                      <VIcon
                        v-if="false"
                        icon="ri-filter-off-fill"
                        size="25px"
                      />
                      <span style="font-size: 16px;">{{ $t('Clear') }}</span>
                    </VBtn>
                  </VCol>
                  <!--  Export -->
                  <VCol
                    sm="6"
                    cols="6"
                  >
                    <VBtn
                      density="compact"
                      class=" px-16 px-sm-12 pa-sm-1 custom-small-btn-excel"
                      color="warning"
                      style="width: 100%; height: 100%;"
                      @click="expiredDateExportExcel"
                    >
                      <img
                        src="/src/assets/images/icons/vscode-icons_file-type-excel2.png"
                        style="width: 25px;"
                        class="custom-small-img"
                      >
                      <span style="font-size: 16px;">{{ $t('Export file') }}</span>
                    </VBtn>
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          </VForm>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
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
          class="d-flex justify-space-between"
          :class="resolveCardDialogTitleColorTable(statusProduct)"
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
          class=""
          :class="resolveCardDialogTitleColorTable(statusProduct)"
          style="width: 100%; padding: 0;"
        >
          <VBtn
            color="red-lighten-1"
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
            <VCardText :class="resolveTextColorTable(statusProduct)">
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
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Status")
                    }}:&nbsp;</span>&nbsp;
                    <VChip
                      :text="statusProduct"
                      :color="resolveChipColor(statusProduct)"
                      size="x-small"
                      variant="elevated"
                    />
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

  <!-- ----------             Product  Easetrack                                  ------------------------------------ -->
  <section>
    <VCard class="mt-6">
      <VDivider />

      <VTable class="text-no-wrap table-header-bg rounded-0">
        <!-- 👉 table head -->
        <thead>
          <tr>
            <th
              scope="row"
              class="text-center px-1"
            >
              {{ $t('No.') }}
            </th>
            <th
              v-if="true"
              scope="row"
              style="padding-left: 38px;"
              class="text-center "
            >
              {{ $t('Status') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VMenu
                v-model="menuStatus"
                location="end"
              >
                <template #activator="{ props }">
                  <VIcon
                    icon="ri-filter-fill"
                    v-bind="props"
                    color="primary"
                  />
                </template>

                <VCard>
                  <VCardTitle class="bg-red-lighten-3">
                    <span class="text-white">{{ $t('Status') }}</span>
                  </VCardTitle>
                  <VCardText class="pa-0">
                    <VList class="pa-0">
                      <VListItem
                        v-for="item in itemsMenuStatus"
                        :key="item.value"
                        class="d-flex justify-center pa-0"
                        @click="selectStatus(item.value)"
                      >
                        <VListItemTitle class="pa-2">
                          <VBtn 
                            variant="elevated"
                            :color="getColorMenuStatus(item.title)"
                            style="width: 100%;"
                          >
                            <span style="font-size: 18px;">{{ item.title }}</span>
                          </VBtn>
                        </VListItemTitle>
                      </VListItem>
                    </VList>
                  </VCardText>
                  
                  <VCardActions
                    v-if="false"
                    class="d-flex justify-center pt-2 px-2"
                  >
                    <VBtn
                      variant="flat"
                      color="warning"
                      @click="resetMenuStatus"
                    >
                      {{ $t('Reset') }}
                    </VBtn>
                    <VBtn variant="flat">
                      {{ $t('Cancel') }}
                    </VBtn>
                  </VCardActions>
                </VCard>
              </VMenu>
            </th>
            <th
              scope="row"
              class="text-center px-1"
            >
              {{ $t('Image') }}
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              {{ $t('Categories') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuCategory"
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
                            v-model="searchColCategory"
                            class="mt-4"
                            :label="$t('Product Categories')"
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
                            @click="searchColCategory = ''"
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
                            @click="menuCategory = false"
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
              {{ $t('Secondary product categories') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuGroup"
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
                            v-model="searchColTypeName"
                            class="mt-4"
                            :label="$t('Secondary product categories')"
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
                            @click="searchColTypeName = ''"
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
                            @click="menuGroup = false"
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
              {{ $t('Sub product categories') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuSubGroup"
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
                            v-model="searchColSubTypeName"
                            class="mt-4"
                            :label="$t('Sub product categories')"
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
                            @click="searchColSubTypeName = ''"
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
                            @click="menuSubGroup = false"
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
              {{ $t('Barcode') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuBarcode"
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
                            v-model="searchColBarcode"
                            class="mt-4"
                            :label="$t('Barcode')"
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
                            @click="searchColBarcode = ''"
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
                            @click="menuBarcode = false"
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
              {{ $t('Product Code') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuProductCode"
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
                            v-model="searchColProductId"
                            class="mt-4"
                            :label="$t('Product Code')"
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
                            @click="searchColProductId = ''"
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
                            @click="menuProductCode = false"
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
              {{ $t('Product Name') }}
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
                            v-model="searchColProductName"
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
                            @click="searchColProductName = ''"
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
              v-if="checkConfigUser(nameUser)"
              scope="row"
              class="text-start px-6"
            >
              {{ $t('Lot') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VMenu
                v-model="menuLot"
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
                            v-model="searchColLot"
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
                            @click="searchColLot = ''"
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
                            @click="menuLot = false"
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
              v-if="checkConfigUser(nameUser)"
              scope="row"
              class="text-start px-6"
            >
              {{ $t('Received Date') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByColReceiveDate')"
              />
            </th>
            <th
              v-if="checkConfigUser(nameUser)"
              scope="row"
              class="text-start px-6"
            >
              {{ $t('Expired Date') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByColExpireDate')"
              />
            </th>
            <th
              v-if="checkConfigUser(nameUser)"
              scope="row"
              class="text-end px-1"
            >
              {{ $t('Remaining Days') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByColRemainingDay')"
              />
            </th>
            
            <th
              v-if="false"
              scope="row"
              class="text-end px-1"
            >
              {{ $t('Alert') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByColTotalQty')"
              />
            </th>
            <th
              scope="row"
              class="text-end px-1"
            >
              {{ $t('QTY') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByColTotalQty')"
              />
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              {{ $t('Counting Unit') }}
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
                            v-model="searchColUoM"
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
                            @click="searchColUoM = ''"
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
                            @click="menuUoM = false"
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
          </tr>
        </thead>
        
        <!-- 👉 table body -->
        <tbody>
          <tr
            v-for="(product, index) in expireDateNeo"
            :key="index"
          >
            <!-- 👉 Ordinal Number -->
            <td class="text-center px-1">
              {{ (currentPage - 1) * rowPerPage + index + 1 }}
            </td>
            

            <!-- 👉 Total quantity of products -->
            <td
              v-if="product.status !== 'Expire' && product.status !== 'Alert'"
              class="text-center d-flex justify-center"
            >
              {{ (product.status) }}
            </td>

            <!-- 👉 Total quantity of products -->
            <td
              v-if="product.status === 'Alert'"
              class="text-center px-8"
            >
              <VChip
                v-if="false"
                color="amber-lighten-3"
                variant="elevated"
              >
                {{ $t('Alert') }}
              </VChip>
            </td>

            <!-- 👉 Total quantity of products -->
            <td
              v-if="product.status === 'Expire'"
              class="text-center  px-8"
            >
              <VChip
                v-if="false"
                color="error"
                variant="elevated"
              >
                {{ $t('Expiry') }}
              </VChip>
              <span class="text-red">{{ $t('Expired') }}</span>
            </td>

            <!-- 👉 Image -->
            <td class="text-center px-1">
              <div v-if="false">
                <VBtn
                  width="70px"
                  height="70px"
                  variant="text"
                >
                  <VImg
                    v-if="product.image"
                    :width="70"
                    :height="70"
                    aspect-ratio="16/9"
                    cover
                    :src="product.image"
                    @click="showDialogImage(
                      product.productId,
                      product.productName,
                      product.color,
                      product.size,
                      product.status,
                      product.image,
                      product.barcode,
                      product.category,
                      product.typeName,
                      product.subTypeName,
                      product.stockQty,
                      product.unit,
                      product.details,
                    )"
                  />
                </VBtn>
              </div>
              <div v-if="true">
                <VHover v-slot="{ isHovering, props }">
                  <VBtn
                    class="mx-auto"
                    color="grey-lighten-4"
                    max-width="70px"
                    height="70px"
                    v-bind="props"
                    variant="text"
                  >
                    <VImg
                      :src="product.image"
                      :width="70"
                      :height="70"
                      cover
                      class="image-transition"
                      @click="showDialogImage(
                        product.productId,
                        product.productName,
                        product.color,
                        product.size,
                        product.status,
                        product.image,
                        product.barcode,
                        product.category,
                        product.typeName,
                        product.subTypeName,
                        product.stockQty,
                        product.unit,
                        product.details,
                      )"
                    >
                      <VExpandTransition>
                        <div
                          v-if="isHovering"
                          style="height: 100%;"
                        >
                          <VAvatar
                            size="20"
                            color="primary"
                            class="d-flex"
                          >
                            <VIcon icon="mdi-magnify-plus-outline" />
                          </VAvatar>
                        </div>
                      </VExpandTransition>
                    </VImg>
                  </VBtn>
                </VHover>
              </div>
            </td>

            <!-- 👉 Product categories -->
            <td class="text-start px-1">
              {{ product.category }}
            </td>

            <!-- 👉 Secondary product categories -->
            <td class="text-start px-1">
              {{ product.typeName }}
            </td>

            <!-- 👉 Sub product categories -->
            <td class="text-start px-1">
              {{ product.subTypeName }}
            </td>

            <!-- 👉 Barcode -->
            <td class="text-center px-1">
              <VueBarcode
                v-if="product.barcode"
                :options="{
                  width: '1%',
                  height: '30%',
                  fontSize: '16px', 
                }"
                :value="product.barcode"
              />
            </td>

            <!-- 👉 Product code -->
            <td class="text-start px-1">
              {{ product.productId }}
            </td>

            <!-- 👉 Product Name -->
            <td class="text-start px-1">
              {{ (product.productName) }}
            </td>

            <!-- 👉 Number(Tag) -->
            <td
              v-if="checkConfigUser(nameUser)"
              class="text-start  px-6"
            >
              {{ (product.lot) }}
            </td>
            <!-- 👉 Number(Tag) -->
            <td
              v-if="checkConfigUser(nameUser)"
              class="text-start  px-6"
            >
              {{ formatDate(product.startDate) }}
            </td>
            <!-- 👉 Number(Tag) -->
            <td
              v-if="checkConfigUser(nameUser)"
              class="text-start  px-6"
            >
              {{ formatDate(product.endDate) }}
            </td>
            <!-- 👉 Number(Tag) -->
            <td
              v-if="checkConfigUser(nameUser)"
              class="text-end  px-8"
            >
              {{ (product.remainDays) }}
            </td>

            <!-- 👉 Number(Non-Tag) -->
            <td
              v-if="false"
              class="text-end  px-6"
            >
              {{ (formatDecimal(product.alert)).toLocaleString('en-US') }}
            </td>
           
            <!-- 👉 Total quantity of products -->
            <td class="text-end  px-8">
              {{ (formatDecimal(product.stockQty)).toLocaleString('en-US') }}
            </td>

            <!-- 👉 Counting unit -->
            <td
              class="text-start  px-1"
              style="width: 5rem;"
            >
              {{ product.unit }}
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

  <section v-if="false">
    <VCard>
      <template #text>
        <VTextField
          v-model="searchFilter"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        />
      </template>
      <VCardText>
        <VDataTable
          :headers="headersMock"
          :items="dataProductNew"
          :items-per-page="5"
          :search="searchFilter"
          density="comfortable"
          item-value="index"
          multi-sort
        >
          <template #headers="{ columns }">
            <tr>
              <template
                v-for="column in columns"
                :key="column.key"
              >
                <th class="text-no-wrap">
                  <span
                    class="cursor-pointer"
                    @click="() => toggleSearch(column)"
                  >{{ column.title }}</span>
                </th>
              </template>
            </tr>
          </template>

          <template #item="{ item }">
            <tr>
              <td
                :class="resolveChipColorTable(item.raw.status)"
                class="pa-0"
              >
                {{ item.raw.index }}
              </td>
              <td :class="resolveChipColorTable(item.raw.status)">
                <div v-if="false">
                  <VBtn
                    width="70px"
                    height="70px"
                    variant="text"
                  >
                    <VImg
                      v-if="item.raw.image"
                      :width="70"
                      :height="70"
                      aspect-ratio="16/9"
                      cover
                      :src="item.raw.image"
                      @click="showDialogImage(
                        item.raw.productCode,
                        item.raw.productName,
                        item.raw.color,
                        item.raw.size,
                        item.raw.status,
                        item.raw.image,
                        item.raw.barcode,
                        item.raw.categories,
                        item.raw.group,
                        item.raw.groupSup,
                        item.raw.total,
                        item.raw.unitName,
                        item.raw.details,
                      )"
                    />
                  </VBtn>
                </div>
                <div v-if="true">
                  <VHover v-slot="{ isHovering, props }">
                    <VBtn
                      class="mx-auto card-image-hover"
                      color="grey-lighten-4"
                      max-width="70px"
                      height="70px"
                      v-bind="props"
                      variant="text"
                    >
                      <VImg
                        :src="item.raw.image"
                        :width="70"
                        :height="70"
                        cover
                        class="image-transition"
                        @click="showDialogImage(
                          item.raw.productCode,
                          item.raw.productName,
                          item.raw.color,
                          item.raw.size,
                          item.raw.status,
                          item.raw.image,
                          item.raw.barcode,
                          item.raw.categories,
                          item.raw.group,
                          item.raw.groupSup,
                          item.raw.total,
                          item.raw.unitName,
                          item.raw.details,
                        )"
                      >
                        <VExpandTransition>
                          <div
                            v-if="isHovering"
                            style="height: 100%;"
                          >
                            <VAvatar
                              size="20"
                              color="primary"
                              class="d-flex"
                            >
                              <VIcon icon="mdi-magnify-plus-outline" />
                            </VAvatar>
                          </div>
                        </VExpandTransition>
                      </VImg>
                    </VBtn>
                  </VHover>
                </div>
              </td>
              <td>
                <span><strong>{{ item.raw.categoryName }}</strong></span>
              </td>
              <td>
                {{ item.raw.typeName }}
              </td>
              <td>
                {{ item.raw.subTypeName }}
              </td>
              <td>
                {{ item.raw.barcode }}
              </td>
              <td>
                {{ item.raw.productId }}
              </td>
              <td class="text-no-wrap">
                {{ item.raw.productName }}
              </td>
              <td>
                {{ item.raw.qty }}
              </td>
              <td>
                {{ item.raw.qty }}
              </td>
              <td>
                {{ item.raw.qty }}
              </td>
              <td>
                {{ item.raw.qty }}
              </td>
              <td>
                {{ item.raw.qty }}
              </td>
              
              <td @click="pushBtnTable(item.raw.productId, item.raw.remark)">
                {{ item.raw.remark }}
              </td>
            </tr>
          </template>
        </VDataTable>  
      </VCardText>
    </VCard>
  </section>

  <section v-if="false">
    <VCard>
      <VCardText>
        <VDataTable
          :headers="headers"
          :items="mockData"
          :items-per-page="5"
          item-value="index"
        >
          <template #item="{ item }">
            <tr>
              <td
                :class="resolveChipColorTable(item.raw.status)"
                class="pa-0"
              >
                {{ item.raw.index }}
              </td>
              <td :class="resolveChipColorTable(item.raw.status)">
                <div v-if="false">
                  <VBtn
                    width="70px"
                    height="70px"
                    variant="text"
                  >
                    <VImg
                      v-if="item.raw.image"
                      :width="70"
                      :height="70"
                      aspect-ratio="16/9"
                      cover
                      :src="item.raw.image"
                      @click="showDialogImage(
                        item.raw.productCode,
                        item.raw.productName,
                        item.raw.color,
                        item.raw.size,
                        item.raw.status,
                        item.raw.image,
                        item.raw.barcode,
                        item.raw.categories,
                        item.raw.group,
                        item.raw.groupSup,
                        item.raw.total,
                        item.raw.unitName,
                        item.raw.details,
                      )"
                    />
                  </VBtn>
                </div>
                <div v-if="true">
                  <VHover v-slot="{ isHovering, props }">
                    <VBtn
                      class="mx-auto card-image-hover"
                      color="grey-lighten-4"
                      max-width="70px"
                      height="70px"
                      v-bind="props"
                      variant="text"
                    >
                      <VImg
                        :src="item.raw.image"
                        :width="70"
                        :height="70"
                        cover
                        class="image-transition"
                        @click="showDialogImage(
                          item.raw.productCode,
                          item.raw.productName,
                          item.raw.color,
                          item.raw.size,
                          item.raw.status,
                          item.raw.image,
                          item.raw.barcode,
                          item.raw.categories,
                          item.raw.group,
                          item.raw.groupSup,
                          item.raw.total,
                          item.raw.unitName,
                          item.raw.details,
                        )"
                      >
                        <VExpandTransition>
                          <div
                            v-if="isHovering"
                            style="height: 100%;"
                          >
                            <VAvatar
                              size="20"
                              color="primary"
                              class="d-flex"
                            >
                              <VIcon icon="mdi-magnify-plus-outline" />
                            </VAvatar>
                          </div>
                        </VExpandTransition>
                      </VImg>
                    </VBtn>
                  </VHover>
                </div>
              </td>
              <td :class="resolveChipColorTable(item.raw.status)">
                <span :class="resolveTextColorTable(item.raw.status)"><strong>{{ item.raw.status }}</strong></span>
              </td>
              <td :class="resolveChipColorTable(item.raw.status)">
                {{ item.raw.poNo }}
              </td>
              <td :class="resolveChipColorTable(item.raw.status)">
                {{ item.raw.poDate }}
              </td>
              <td :class="resolveChipColorTable(item.raw.status)">
                {{ item.raw.location }}
              </td>
              <td :class="resolveChipColorTable(item.raw.status)">
                {{ item.raw.refDoc }}
              </td>
              <td :class="resolveChipColorTable(item.raw.status)">
                {{ item.raw.poNo }}
              </td>
              <td :class="resolveChipColorTable(item.raw.status)">
                {{ item.raw.poDate }}
              </td>
              <td :class="resolveChipColorTable(item.raw.status)">
                {{ item.raw.total }}
              </td>
              <td :class="resolveChipColorTable(item.raw.status)">
                {{ item.raw.supplierId }}
              </td>
              <td :class="resolveChipColorTable(item.raw.status)">
                {{ item.raw.supplierName }}
              </td>
              <td :class="resolveChipColorTable(item.raw.status)">
                {{ item.raw.deliveredDate }}
              </td>
              
              <td
                :class="resolveChipColorTable(item.raw.status)"
                
                @click="pushBtnTable(item.raw.productId, item.raw.remark)"
              >
                {{ item.raw.remark }}
              </td>
            </tr>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>
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

.center-expansion {
  align-items: center !important; /* จัดตำแหน่งตรงกลางแนวตั้ง */
  justify-items: center !important; /* จัดตำแหน่งตรงกลางแนวนอน */
}
</style>

