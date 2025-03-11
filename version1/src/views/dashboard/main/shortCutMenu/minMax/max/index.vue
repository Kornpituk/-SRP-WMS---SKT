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

const searchByWareHouseId = ref(whereHouse)

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
const searchByLastUpdate = ref(null)

//----- Search Filter Icon Header Table[Product Category, Group, Sub Group, Barcode, Product Category Code, Product Name]
const menuCategory= ref( false)
const menuGroup = ref( false)
const menuSubGroup = ref( false)
const menuBarcode = ref( false)
const menuProductCode = ref( false)
const menuProductName = ref( false)
const menuUoM = ref( false)
const menuLastUpdate = ref( false)

//------------------------ item ID for search ------------------------------
const itemsSearchByCategoryId = ref(null)
const typeItemsSearchById = ref(null)
const subTypeItemsSearchById = ref(null)
const itemsSearchByUOMId = ref(null)
const wareHouseItemsSearchById = ref(null)
const zoneItemsSearchById = ref(null)
const areaItemsSearchById = ref(null)
const subAreaItemsSearchById = ref(null)

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
  const sortRefs = { sortByColMax, sortByColTotalQty,  sortByColLastupdate }

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

const ClearModel = () => {

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

      console.log('products', products.value)

      
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })
}

//----------------------------------- Function Reset search Key word ---------------

//------------------------------- Function Get StockUpdate Auto Search -----------------
const stockId = ref('')
const barcode = ref('')
const productId = ref('')
const productName = ref('')
const categoryId = ref('')
const typeId = ref('')
const subTypeId = ref('')
const searchColCategory = ref('')
const searchColTypeName = ref('')
const searchColSubTypeName = ref('')
const searchColBarcode = ref('')
const searchColProductId = ref('')
const searchColProductName = ref('')
const searchColUoM = ref('')
const sortByColMin = ref('')
const sortByColMax = ref('')
const sortByColTotalQty = ref('')
const sortByColLastupdate = ref('')

const resetSearchKey = () => {
  barcode.value = (null)
  productName.value = (null)
  categoryId.value = (null)
  typeId.value = (null)
  subTypeId.value = (null)
  searchColCategory.value = (null)
  searchColTypeName.value = (null)
  searchColSubTypeName.value = (null)
  searchColBarcode.value = (null)
  searchColProductId.value = (null)
  searchColProductName.value = (null)
  searchColUoM.value = (null)
  sortByColMin.value = (null)
  sortByColMax.value = (null)
  sortByColTotalQty.value = (null)
  sortByColLastupdate.value = (null)

  searchByWareHouseId.value = whereHouse
}

const GetStockUpdateForPagination = async () => {
  try {
    console.log('Before API call - currentPage:', currentPage.value)
    
    const response = await axiosIns.get(`${urlApi.value}/api/v1/Dashboard/Summary/StockMaxMin/Max`, {
      headers: {
        'accept': '*/*',
        'x-location': `${searchByWareHouseId.value}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
      params: {
        page: currentPage.value,
        perPage: rowPerPage.value,
        stockId: searchByWareHouseId.value,
        barcode: barcode.value,
        productId: productId.value,
        productName: productName.value,
        categoryId: categoryId.value,
        typeId: typeId.value,
        subTypeId: subTypeId.value,
        searchColCategory: searchColCategory.value,
        searchColTypeName: searchColTypeName.value,
        searchColSubTypeName: searchColSubTypeName.value,
        searchColBarcode: searchColBarcode.value,
        searchColProductId: searchColProductId.value,
        searchColProductName: searchColProductName.value,
        searchColUoM: searchColUoM.value,
        sortByColMin: sortByColMin.value,
        sortByColMax: sortByColMax.value,
        sortByColTotalQty: sortByColTotalQty.value,
        sortByColLastupdate: sortByColLastupdate.value,
      },
    })

    console.log('API response:', response.data) 

    products.value = response.data.items
    totalCount.value = response.data.totalCount
    totalPage.value = response.data.totalPages
    
    console.log('After API call - currentPage:', currentPage.value)
    console.log('[expireDateNeo.value]!!:', response)
  } catch (error) {
    console.error('Error:', error)
  }
}

watch(GetStockUpdateForPagination)

//--------------------------------------- Function Pagination --------------------------------------------
// 👉 watching current page
watch(() => {
  if (currentPage.value > totalPage.value & totalPage.value >= 1)
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
      'CategoryId': categoryId.value,
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
  if (status === "Received") return "success"
  if (status === "Partially Received") return "info"
  if (status === "Pending") return "error"
  if (status === "Partially Pending") return "warning"
}

const resolveChipColorTable = status => {
  if (status === "Received") return "bg-green-lighten-5"
  if (status === "Partially Received") return "bg-blue-lighten-5"
  if (status === "Pending") return "bg-red-lighten-5"
  if (status === "Partially Pending") return "bg-orange-lighten-5"
}

const resolveCardDialogTitleColorTable = status => {
  if (status === "Received") return "bg-green"
  if (status === "Partially Received") return "bg-blue"
  if (status === "Pending") return "bg-red"
  if (status === "Partially Pending") return "bg-orange"
}

const resolveTextColorTable = status => {
  if (status === "Received") return "text-green"
  if (status === "Partially Received") return "text-blue"
  if (status === "Pending") return "text-red"
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

const checkMinMax = () => {

}

watchEffect(() => {
  console.log('Delivery Date', dateRangeDelivery.value)
})

const mockData = Array.from({ length: 50 }, (_, index) => ({
  index: index + 1,
  imageMock: imageLs[index + 1],
  status: getRandomStatus(),
  productNameMock: `Product ${index + 1}` + `Color ${index + 1}` + `Size ${index + 1}`,
  productCodeMock: `Code ${index + 1}`,
  color: `Color ${index + 1}`,
  size: `Size ${index + 1}`,
  unitNameMock: unitMockData[index + 1],
  barcodeMock: `Barcode ${index + 1}`,
  categoriesMock: `Category ${index + 1}`,
  groupSupMock: `Group Sup ${index + 1}`,
  groupMock: `Group ${index + 1}`,
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
  min: (Math.floor(Math.random() * 100) + 0).toFixed(2),
  max: (Math.floor(Math.random() * (500 - 100 + 1)) + 100),
  maxTotalQTY: (Math.floor(Math.random() * (1000 - 501 + 1)) + 501).toFixed(2),
  alert: Math.random() < 0.5,
  lastUpdated: getRandomDate(),
}))

const isSorted = column => {
  console.log('isSorted Started', column)
}

const isFiltered = ''

const remove = key => {
  this.headers = this.headers.filter(header => header.key !== key)
}

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

const colorBtnToMin = ref('red-lighten-3')
const variantBtnToMin = ref('light-blue-lighten-3')
const colorBtnToMAx = ref('light-blue-lighten-3')
const variantBtnToMAx = ref('flat')

watchEffect(() => {
  const indicator = 'max'

  if(indicator === 'max'){
    colorBtnToMin.value = 'grey'
    variantBtnToMin.value = 'tonal'
  }
})

//---------------------------- Tabs -----------------------------------
const currentTab = ref(0)
const tabItemContent = 'Candy canes donut chupa chups candy canes lemon drops oat cake wafer. Cotton candy candy canes marzipan carrot cake. Sesame snaps lemon drops candy marzipan donut brownie tootsie roll. Icing croissant bonbon biscuit gummi bears. Pudding candy canes sugar plum cookie chocolate cake powder croissant.'


//------------------------* Beta --------------------------------------------------

const formatDate = dateString => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear())
  
  return `${day}/${month}/${year}`
}
</script>

<template>
  <!-- Title Page -->
  <div v-if="false">
    <VCard>
      <VCardTitle class="bg-indigo-lighten-1 d-flex justify-space-between">
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
            {{ $t('Stock Min & Max') }}
          </h3>
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

              <!-- 👉 Select Storehouse Zone -->
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
                  :items="subTypeItemsSearchById"
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
                      @click="resetSearchKey"
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
                      @click="resetSearchKey"
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
                      class="px-16 px-sm-12 pa-sm-1 custom-small-btn-excel"
                      color="warning"
                      style="width: 100%; height: 40px;"
                      @click="stockUpdateExcel"
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
        <VCardTitle class="d-flex justify-space-between bg-indigo">
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
          class="bg-indigo"
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

            <VCardText class="bg-indigo-lighten-4">
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

  <!-- ----------             Product  Easetrack                                  ------------------------------------ -->
  <section>
    <VCard>
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
              class="text-center"
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
              v-if="checkConfigUser(nameUser)"
              scope="row"
              class="text-end px-1"
            >
              {{ $t('Maximum') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByColMax')"
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
            
            
            <th
              scope="row"
              class="text-start px-1"
            >
              {{ $t('Last Update') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByColLastupdate')"
              />
            </th>
          </tr>
        </thead>
        
        <!-- 👉 table body -->
        <tbody>
          <tr
            v-for="(product, index) in products"
            :key="index"
          >
            <!-- 👉 Ordinal Number -->
            <td class="text-center px-1">
              {{ (currentPage - 1) * rowPerPage + index + 1 }}
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
                    class="mx-auto card-image-hover"
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
              class="text-end  px-1"
            >
              <span class="text-end  px-6">{{ formatDecimal(product.maxQty).toLocaleString('en-US') }}</span>
            </td>
            <!-- 👉 Number(Tag) -->
            <td
              v-if="checkConfigUser(nameUser)"
              class="text-end  px-6"
            >
              {{ formatDecimal(product.stockQty).toLocaleString('en-US') }}
            </td>

            <!-- 👉 Number(Non-Tag) -->
            <td
              v-if="checkConfigUser(unitName)"
              class="text-start  px-1"
            >
              {{ (product.unit) }}
            </td>

            <!-- 👉 Counting unit -->
            <td
              class="text-start  px-1"
              style="width: 5rem;"
            >
              {{ formatDate(product.lastupdate) }}
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

