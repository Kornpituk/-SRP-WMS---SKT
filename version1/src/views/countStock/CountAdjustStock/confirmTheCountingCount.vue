<script setup>
import axiosIns from '@axios'

 
//// --------------------------------------------------------------------------------------
import { ref, watchEffect } from 'vue'

// ----------------- Route --------------------------.
// import { useRoute } from 'vue-router'

const route = useRoute()

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

//-------------------------------------------------------------  Search Table Nomaly-------------------
// const urlApi = ref('https://webapi.easetrackwms.com')

import { urlApi } from '@/api'

const whereHouseSelectedItem = ref('')
const products = ref([])



// Get access token from localStorage in another page
const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')

const whereHouse = localStorage.getItem('whereHouseName')

//--------------------------- WareHouse Id For Search ---------------------------
const wareHouseId = ref(null)

const accessTokenTest = ('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoi4LiT4Lix4LiQ4Lie4LilIiwibmFtZWlkIjoiMDAwMDAxIiwibmJmIjoxNzAxMzEyMDY5LCJleHAiOjE3MDM0NzIwNjksImlhdCI6MTcwMTMxMjA2OSwiaXNzIjoiSXNzdWVyIiwiYXVkIjoiQXVkaWVuY2UifQ.CPMUUQDPkwS0qBiHUioxEdTW8f1TIZL3u--qENiH-UQ')

const url = ref(`${urlApi}/api/Auth/GetLocation/all`)

const perPage = ref(10)
const page = ref(0)
const totalCount = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)

const statusAdjustStock = ref(route.query.status)

//------------------- Model ID For search ------------------------------------
const searchByUserId = ref(null)


const StockAdjustIdId = ref(route.query.stockAdjustId)

const searchByCategoryId = ref(products.value.categoryName)
const searchByTypeId = ref(null)
const searchBySubTypeId = ref(null)
const searchByUOMId = ref(null)
const searchByWareHouseId = ref([whereHouse])

console.log('Test Product At Adjust!!**', products.value.categoryName)

//---------------- Model Search By ------------------------------
const searchByBarcode = ref(null)
const searchByProduct = ref(null)
const searchByLocationBarcode = ref(null)

const searchByZoneId = ref(route.query.zoneId)

const searchByAreaId = ref(['All'])
const searchBySubAreaId = ref(['All'])

const searchBySearchByCategory = ref(null)

//------------------------ Model Name for search ------------------------------
const searchByCategoryName = ref(null)
const searchByTypeName = ref(null)
const searchBySubTypeName = ref(null)
const searchByBarcodeName = ref(null)
const searchByProductCodeName = ref(null)
const searchByProductNameFilter = ref(null)
const searchByUOMName = ref(null)
const searchByLotName = ref(null)
const searchByStockName = ref(null)
const searchByZoneName = ref(null)
const searchByAreaName = ref(null)
const searchBySubAreaName = ref(null)
const searchByUnitName = ref(null)

//------------------- Model For Search Counting Stock ------------------------------------
const searchByStatus = ref(null)
const searchByCountingDate = ref(null)
const searchByProductGroup = ref(null)
const searchByLocation = ref(null)
const searchByProductId = ref(null)
const searchByProductName = ref(null)
const searchByConfirmDate = ref(null)
const searchByCountingBy = ref(null)

//----- Search Filter Icon Header Table[Product Category, Group, Sub Group, Barcode, Product Category Code, Product Name]
const menuCategory= ref( false)
const menuGroup = ref( false)
const menuSubGroup = ref( false)
const menuBarcode = ref( false)
const menuProductCode = ref( false)
const menuProductName = ref( false)
const menuUoM = ref( false)
const menuArea = ref( false)
const menuLot = ref( false)

//----------------------------------- Area-------------------------
const menuWarehouse = ref( false)
const menuZone = ref( false)
const menuAreaArea = ref( false)
const menuSubAreaArea = ref( false)

//------------------------ item ID for search ------------------------------
const itemsSearchByCategoryId = ref([])
const typeItemsSearchById = ref([])
const subTypeItemsSearchById = ref([])
const itemsSearchByUOMId = ref([])
const wareHouseItemsSearchById = ref([])
const zoneItemsSearchById = ref([])
const groupItemsSearchById = ref([])
const subGroupItemsSearchById = ref([])

const areaItemsSearchById = ref([])
const subAreaItemsSearchById = ref([])

//----------------------  SortBy Variable  -------------------------------------
//------------------- model Sort By At AdjustCounting  ----------------
const sortByQtyTagBefor = ref(null)
const sortByQtyTagAfter = ref(null)
const sortByQtyTagDif = ref(null)

const sortByQtyBarcodeBefor = ref(null)
const sortByQtyBarcodeAfter = ref(null)
const sortByQtyBarcodeDif = ref(null)


//----------------------------------------------------------------
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

//--------------------------------------------- Time Date Variables --------------------------------
const datest = ref('') /// date start
const datesp = ref('') /// date to

// ---------------------------------- Model stockAdjustId & zoneId Route to Count Barcode ---------------
const stockAdjustId = ref([])
const zoneId = ref([])

const countingStockSelected = ref(false)

const toggleSortType = sortBy => {
  countingStockSelected.value = true

  const sortRefs = { sortByQtyBarcodeBefor, sortByQtyBarcodeAfter, sortByQtyBarcodeDif, sortByQtyTagBefor, sortByQtyTagAfter, sortByQtyTagDif }

  for (const key in sortRefs) {
    if (key === sortBy) {
      sortRefs[key].value = sortRefs[key].value === 'asc' ? 'desc' : 'asc'
      getCountingStock()
    } else {
      sortRefs[key].value = '' // ล้างค่าที่ไม่เกี่ยวข้อง
    }

    // console.log("Sort type:",sortRefs[key],'Key',[key])
  }

  // console.log("Sort type:",sortRefs[key],'Key',[key])
}

//---------------------------------- Btn Save | Cancel | asdd ----------
const countingStarted = ref(true )// ตัวแปรเพื่อตรวจสอบว่าการนับได้เริ่มหรือยัง
const startButtonColor = ref('green') // สีเริ่มต้นของปุ่ม Start
const startButtonVariant = ref('flat')

const countingConfirem = ref(true )// ตัวแปรเพื่อตรวจสอบว่าการนับได้เริ่มหรือยัง
const confirmButtonColor = ref('green') // สีเริ่มต้นของปุ่ม confirm
const confirmButtonVariant = ref('flat')

const countingCancel = ref(false )// ตัวแปรเพื่อตรวจสอบว่าการนับได้เริ่มหรือยัง
const cancelButtonColor = ref('grey-lighten-2') // สีเริ่มต้นของปุ่ม Cancel
const cancelButtonVariant = ref('outlined')

//--------------------------- Export File -----------------------------
const countingExport = ref(false )// ตัวแปรเพื่อตรวจสอบว่าการนับได้เริ่มหรือยัง
const exportButtonColor = ref('grey-lighten-2') // สีเริ่มต้นของปุ่ม export
const exportButtonVariant = ref('outlined')

const exportButtonFunction = () => {
  countingExport.value = true // ตัวแปรเพื่อตรวจสอบว่าการนับได้เริ่มหรือยัง
  exportButtonColor.value = 'warning' // สีเริ่มต้นของปุ่ม export
  exportButtonVariant.value = 'flat'
}

const checkConfirmAdjustAll = ref(false)

//------------------------------------ Config Check --------------------
const configShowRfid = ref(null)

watchEffect(() => {
  configShowRfid.value = localStorage.getItem('configsShowRfdi')
})

const checkConfigUser = configShowRDID => {
  if (configShowRDID == 'false') {
    return false
  } else if (configShowRDID == 'true'){
    return true
  } else {
    return 'not find config!'
  }
}

const checkStatusCounting = () => {
  if (statusAdjustStock.value === 'กำลังตรวจนับ') {
  
    countingStarted.value = true
    startButtonColor.value = 'green'
    startButtonVariant.value = 'flat'

    countingCancel.value = false
    cancelButtonColor.value = 'red'
    cancelButtonVariant.value = 'flat'

  } else if (statusAdjustStock.value === undefined) {

    countingStarted.value = false
    startButtonColor.value = 'grey-lighten-2'
    startButtonVariant.value = 'outlined'

    countingCancel.value = true
    cancelButtonColor.value = 'red'
    cancelButtonVariant.value = 'outlined'
  } else if (statusAdjustStock.value === 'ตรวจนับ/ปรับยอดแล้ว') {
    countingStarted.value = false
    startButtonColor.value = 'grey-lighten-2'
    startButtonVariant.value = 'outlined'

    confirmButtonColor.value = ref('grey-lighten-2') // สีเริ่มต้นของปุ่ม confirm
    confirmButtonVariant.value = ref('outlined')
    countingConfirem.value = false

    countingCancel.value = true
    cancelButtonColor.value = 'red'
    cancelButtonVariant.value = 'outlined'
    exportButtonFunction()
  } else if (statusAdjustStock.value === 'รออนุมัติ') {

    countingConfirem.value = false

    countingStarted.value = true
    startButtonColor.value = 'grey-lighten-2'
    startButtonVariant.value = 'outlined'

    countingCancel.value = false
    cancelButtonColor.value = 'red'
    cancelButtonVariant.value = 'flat'
  }
}

watch(checkStatusCounting)



//--------------------------------------------------------------------------------
let responseData = null

//-------------------------------  Check State Adjust/Counting -------------------- 
const isConfirmBarcode = ref(null)
const isConfirmRfid = ref(null)

const getCountingStock = () => {

  axiosIns.get(`${urlApi.value}/api/v1/CountingStock/SearchCounting?`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
    params: {
      page: currentPage.value,
      perPage: rowPerPage.value,

      userId: searchByUserId.value,

      StockAdjustId: StockAdjustIdId.value, // ------------------- **Impotent To Search** -----------------

      categoryId: searchByCategoryId.value,

      typeId: searchByTypeId.value,
      subTypeId: searchBySubTypeId.value,
      barcode: searchByBarcode.value,
      productId: searchByProductId.value,
      productName: searchByProductName.value,
      unitId: searchByUOMId.value,

      locationBarcode: searchByLocationBarcode.value,

      // zoneId:searchByZoneId.value,// ------------------- **Impotent To Search** -----------------
      zoneId: searchByZoneId.value, // ------------------- **Impotent To Search** -----------------

      areaId: searchByAreaId.value,
      subAreaId: searchBySubAreaId.value,

      searchByCategory: searchByCategoryName.value,
      searchByType: searchByTypeName.value,
      searchBySubType: searchBySubTypeName.value,
      searchByBarcode: searchByBarcodeName.value,
      searchByProductId: searchByProductCodeName.value,
      searchByProductName: searchByProductNameFilter.value,
      searchByUnit: searchByUOMName.value,
      searchByLot: searchByLotName.value,
      searchByStockName: searchByStockName.value,
      searchByZone: searchByZoneName.value,
      searchByArea: searchByAreaName.value,
      searchBySubArea: searchBySubAreaName.value,

      sortByQtyBarcodeBefor: sortByQtyBarcodeBefor.value,
      sortByQtyBarcodeAfter: sortByQtyBarcodeAfter.value,
      sortByQtyBarcodeDif: sortByQtyBarcodeDif.value,

      sortByQtyTagBefor: sortByQtyTagBefor.value,
      sortByQtyTagAfter: sortByQtyTagAfter.value,
      sortByQtyTagDif: sortByQtyTagDif.value,

      // ... and so on with other parameters
    },
    
  }, {})
    .then(response => {

      
      const testpage = response.data

      console.log('testpage***!', testpage)

      products.value = response.data.items
      responseData = response.data
      stockAdjustId.value = response.data.stockAdjustId
      console.log('stockAdjustId.value: ', stockAdjustId.value)
      zoneId.value = response.data.zoneId

      totalCount.value = response.data.items.totalCount
      currentPage.value = response.data.items.page
      totalPage.value = response.data.items.totalPages
      rowPerPage.value = response.data.items.perPage

      console.log('products.value: ', products.value.items)

      isConfirmBarcode.value = response.data.isConfirmBarcode
      isConfirmRfid.value = response.data.isConfirmRfid

      // console.log('response.date: ',  response.data.items.totalCount )

      // console.log('perPage: ', perPage.value)
      // console.log('currentPage: ', currentPage.value)
      // console.log('totalCount: ', totalCount.value)
      // console.log('totalPages: ', totalPage.value)

    
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })
}

getCountingStock()

const handleCountingStock = () => {
  // Set the flag to indicate that a date is selected
  countingStockSelected.value = true

  // Execute GetCountingStock when a date is selected
  getCountingStock()
  watch(getCountingStock)
}

//------------------------------------------- Process Btn Start Cancel --------------------- 
const getCountingStockClear = () => {
  this.searchByCategoryId.value = null
  this.searchByTypeId.value = null
  this.searchBySubTypeName.value = null
  this.searchByUOMId.value = null
  this.searchByBarcode.value = null
  this.searchByZoneId.value = '999'
  this.searchByAreaId.value = null
  this.searchBySubAreaId.value = null
  this.searchByProductId.value = null
  this.searchByProductName.value = null
  getCountingStock()
  console.log("searchByZoneId", this.searchByZoneId.value)
}

const alertBtnStartNotSuccess = ref('')

const countingStockStart = async () => {

  try {
    const response = await axiosIns.post(
      `${urlApi.value}/api/v1/CountingStock/Start?`,

      null, // ไม่ได้ให้ข้อมูลใน request body ในกรณีนี้
      {
        headers: {
          'accept': '*/*',
          'x-location': `${whereHouse}`,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
        params: {
          page: currentPage.value,
          perPage: rowPerPage.value,

          categoryId: searchByCategoryId.value,

          typeId: searchByTypeId.value,
          subTypeId: searchBySubTypeId.value,
          barcode: searchByBarcode.value,
          productId: searchByProductId.value,
          productName: searchByProduct.value,
          unitId: searchByUOMId.value,

          locationBarcode: searchByLocationBarcode.value,

          // zoneId:searchByZoneId.value,// ------------------- **Impotent To Search** -----------------
          zoneId: searchByZoneId.value, // ------------------- **Impotent To Search** -----------------

          areaId: searchByAreaId.value,
          subAreaId: searchBySubAreaId.value,
        },
      },
    )

    isDialogVisibleStartSuccess.value = true

    countingStarted.value = true // เปลี่ยนสถานะเมื่อการนับเริ่มต้นแล้ว
    countingCancel.value = false // เปลี่ยนสถานะเมื่อการนับเริ่มต้นแล้ว
    cancelButtonColor.value = 'red' // เปลี่ยนสีปุ่ม Cancel เป็นสีแดง
    cancelButtonVariant.value  = 'flat'
    console.log('Response:', response)
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const errorMessage = error.response.data.message

      console.error('Error:', errorMessage)

      // ทำการแสดงข้อความ error บนหน้าจอ หรือทำการจัดการตามต้องการ
      // ตัวอย่างเช่นใช้ alert() หรือแสดงใน UI ด้วย Vue ตามความเหมาะสม
      alertBtnStartNotSuccess.value = errorMessage
      isDialogVisibleStartNotSuccess.value = true

      // alert(errorMessage)
    } else {
      console.error('Error:', error)

      // ทำการจัดการข้อผิดพลาดที่นี่ เมื่อไม่ได้รับ response ที่เป็น 400 Bad Request
    }

    // ทำการจัดการข้อผิดพลาดที่นี่
  }
}

const countingStockCancel = async () => {
  const route = useRoute()
  try {
    const response = await axiosIns.post(
      `${urlApi.value}/api/v1/CountingStock/Cancel/${stockAdjustId.value}`,

      null, // ไม่ได้ให้ข้อมูลใน request body ในกรณีนี้
      {
        headers: {
          'accept': '*/*',
          'x-location': `${whereHouse}`,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
      },
    )

    console.log('Response:', response)
    isDialogConfirmCancelVisible.value = true

    // route.push({ name: 'countStock-CountAdjustStock-countStock' })
    // route.push({ name: 'countStock-CountAdjustStock-countStock' })
  } catch (error) {
    console.error('Error:', error)

    // ทำการจัดการข้อผิดพลาดที่นี่
  }
}


//---------------------------------- Dialog Show User -----------------

const isDialogVisibleStartSuccess = ref(false)
const isDialogVisibleStartNotSuccess = ref(false)

const isDialogVisibleCancelSuccess = ref(false)


const isDialogVisibleCountAgain = ref(true)


// 👉 watching current page
watch(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})


// 👉 Computing pagination data
const paginationData = computed(() => {
  // const LengthPage = computed(() => products.value.items.length)
  const itemsLength = computed(() => {
    if (products.value && products.value.items) {
      return Object.keys(products.value.items).length
    } else {
      return 0 // หรือค่าที่เหมาะสมที่คุณต้องการให้มีค่าเมื่อไม่สามารถคำนวณได้
    }
  })

  const firstIndex = itemsLength.value ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = itemsLength.value + (currentPage.value - 1) * rowPerPage.value

  // console.log('const firstIndex ', firstIndex, '=', 'itemsLength.value:'+itemsLength.value, '?', (currentPage.value - 1)* rowPerPage.value + 1)
  // console.log('const lastIndex ', lastIndex, '=', itemsLength.value, '+', (currentPage.value - 1), '*', rowPerPage.value)
  // console.log('itemsLength.value: ', itemsLength.value)
  
  return `${ firstIndex }-${ lastIndex } of ${ totalCount.value }`
})

// SECTION Checkbox toggle
const selectedRows = ref([])

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
  axiosIns.get(`${urlApi.value}/api/v1/Locations/area/all`, {
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


//----------------------------------------------------- -----------------------------------------------//
// -------------------------------------- Export Bar Excel - --------------------------------

const countingAdjustExcel = () => {
  axiosIns.post(`${urlApi.value}/api/v1/CountingStock/CountingSheet/Excel?`, {}, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
    params: {
      userId: searchByUserId.value,
      StockAdjustId: StockAdjustIdId.value,
      categoryId: searchByCategoryId.value,
      typeId: searchByTypeId.value,
      subTypeId: searchBySubTypeId.value,
      barcode: searchByBarcode.value,
      productId: searchByProductId.value,
      productName: searchByProductName.value,
      unitId: searchByUOMId.value,
      locationBarcode: searchByLocationBarcode.value,
      zoneId: searchByZoneId.value,
      areaId: searchByAreaId.value,
      subAreaId: searchBySubAreaId.value,
      searchByCategory: searchByCategoryName.value,
      searchByType: searchByTypeName.value,
      searchBySubType: searchBySubTypeName.value,
      searchByBarcode: searchByBarcodeName.value,
      searchByProductId: searchByProductCodeName.value,
      searchByProductName: searchByProductNameFilter.value,
      searchByUnit: searchByUOMName.value,
      searchByLot: searchByLotName.value,
      searchByStockName: searchByStockName.value,
      searchByZone: searchByZoneName.value,
      searchByArea: searchByAreaName.value,
      searchBySubArea: searchBySubAreaName.value,
      sortByQtyBarcodeBefor: sortByQtyBarcodeBefor.value,
      sortByQtyBarcodeAfter: sortByQtyBarcodeAfter.value,
      sortByQtyBarcodeDif: sortByQtyBarcodeDif.value,
      sortByQtyTagBefor: sortByQtyTagBefor.value,
      sortByQtyTagAfter: sortByQtyTagAfter.value,
      sortByQtyTagDif: sortByQtyTagDif.value,
    },
    responseType: 'blob', // ให้เซิร์ฟเวอร์รีเทิร์น blob สำหรับไฟล์ Excel
  })
    .then(response => {
      // สร้าง URL ของไฟล์ Excel จาก binary data
      const url = window.URL.createObjectURL(new Blob([response.data]))

      // สร้างลิงก์สำหรับดาวน์โหลดไฟล์ Excel
      const link = document.createElement('a')

      const currentDate = new Date() // สร้างวัตถุ Date ปัจจุบัน
      const dateString = currentDate.toISOString().slice(0, 10).replace(/-/g, '') // แปลงวันที่เป็นรูปแบบ 'yyyyMMdd'
      const fileName = `Counting_Sheet_${dateString}.xlsx` // ตั้งชื่อไฟล์โดยรวมกับวันที่

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

const stockUpdateExcel = () => {
  axiosIns.post(`${urlApi.value}/api/v1/StockUpdate/Excel?`, {}, {
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

      // สร้างลิงก์สำหรับดาวน์โหลดไฟล์ Excel
      const link = document.createElement('a')

      const currentDate = new Date() // สร้างวัตถุ Date ปัจจุบัน
      const dateString = currentDate.toISOString().slice(0, 10).replace(/-/g, '') // แปลงวันที่เป็นรูปแบบ 'yyyyMMdd'
      const fileName = `stock_update_Tag_${dateString}.xlsx` // ตั้งชื่อไฟล์โดยรวมกับวันที่

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

//-------------------------------------  Formed Td ------------------------
const formattedProductName = productName => {
  if (productName !== undefined && productName !== null) {
    // console.log("productName: ",productName)
    
    return productName.replace(/((.{26})(\/|\s|$))/g, "$1\n")
  }
  
  return 'Non'
}

// ------------------------------------  Save Btb Confirm ------------------------------ 
const isDialogVisible = ref(false)

const isDialogConfirmVisible = ref(false)

const isDialogNotConfirmVisible = ref(false)

const isDialogAgreeConfirmVisible = () => {
  saveConfirmStockAdjustId()
  isDialogVisible.value = false
}

//------------------------------------------ Dialog Re Count ---------------
const isDialogReCountVisible = ref(false)
const isDialogReCountConfirmVisible = ref(false)


//------------------------------------------- Cancel --------------
const  isDialogConfirmCancelVisible = ref(false)

const isDialogAgreeConfirmReCountVisible = () => {
  countingStockCancel()
  isDialogReCountVisible.value = false
}

//-----------null---------------------- Zone Check ----------------------------------- 
const isDialogVisibleBtnZone = ref(false)

const checkZoneSearchBtn = searchByZoneId => {
  if (!searchByZoneId) {
    // กำหนด isDialogVisible เป็น true หาก searchByZoneId เป็นค่าว่าง
    isDialogVisibleBtnZone.value = true
    console.log('true:', searchByZoneId)
  } else {
    // หากไม่ใช่ค่าว่าง กำหนด isDialogVisible เป็น false
    isDialogVisibleBtnZone.value = false
    getCountingStock()
    console.log('false')
  }
}

//-----------------------------  Function Confirm AdjustId -------------------------------
//----------------------------------- Btn Save StockAdjustId -------------------------------
const saveConfirmStockAdjustId = async index => {
  try {
    const response = await axiosIns.post(
      `${urlApi.value}/api/v1/CountingStock/ConfirmWin/${StockAdjustIdId.value}`,
      {},
      {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse, // ไม่ควรใส่ `${}` เพราะค่า whereHouse เป็น string อยู่แล้ว
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
      },
    )

    // isDialogVisibleConfirm.value = true // แสดง Dialog สำเร็จ
    console.log('products.value:', response.data)
    isDialogConfirmVisible.value = true
    checkConfirmAdjustAll.value = true
    getCountingStock()
    exportButtonFunction()
    console.log('exportButtonFunction in saveConfirmStockAdjustId!')
  } catch (error) {
    // Handle errors
    isDialogNotConfirmVisible.value = true
    console.error('Error:', error)
  }
}
</script>

<template>
  <!-- ----------------        Label Page | Back           ------------------------------------ -->
  <section>
    <!-- Label Count/Adjust && Timeline -->
    <VRow>
      <!-- Tag page back -->
      <VCol
        col="12"
        sm="12"
        lg="2"
      >
        <RouterLink
          :to="{ name: 'countStock-CountAdjustStock-countAdjust',
                 query: $route.query, }"
        >
          <IconBtn>
            <VIcon
              icon="
                mdi-chevron-left"
            />
          </IconBtn>
        </RouterLink>
        <span class="text-h6">{{ $t('Count Adjust') }}</span>
      </VCol>
      <!-- Time Line -->
      <VCol
        cols="12"
        sm="12"
        lg="8"
        style=" margin-top: -30px;"
      >
        <!-- -   Time Line Page   - -->
        <VTimeline
          truncate-line="both"
          direction="horizontal"
          line-inset="15"
          class="custom-avatar-size"
        >
          <!-- -   Count/Adjust   - -->
          <VTimelineItem
            dot-color="green"
            to="countAdjust"
            size="small"
            class="text-center"
          >
            <template #opposite>
              <RouterLink
                :to="{ 
                  name: 'countStock-CountAdjustStock-countAdjust', 
                  query: $route.query, 
                }"
              >
                {{ $t('Counting') }}
              </RouterLink>
            </template>
            <template #icon>
              <RouterLink
                :to="{ 
                  name: 'countStock-CountAdjustStock-countAdjust', 
                  query: $route.query, 
                }"
              >
                <div class="v-timeline-avatar-wrapper rounded-circle">
                  <VAvatar
                    size="40"
                    color="green"
                    variant="outlined"
                  >
                    <VIcon
                      icon="mdi-check"
                      color="white"
                      size="20"
                    />
                  </VAvatar>
                </div>
              </RouterLink>
            </template>
          </VTimelineItem>

          <!-- -   RFID Count   - -->
          <VTimelineItem
            v-if="checkConfigUser(configShowRfid)"
            size="small"
            dot-color="green"
            class="text-center"
          >
            <template #default>
              <RouterLink
                :to="{ 
                  name: 'countStock-CountAdjustStock-rfidCountStock', 
                  query: $route.query, 
                }"
              >
                {{ $t('RFID Count') }}
              </RouterLink>
            </template>
            <template #icon>
              <RouterLink
                :to="{ 
                  name: 'countStock-CountAdjustStock-rfidCountStock', 
                  query: { stockAdjustId: StockAdjustIdId ,zoneId:searchByZoneId,warehouseStock: whereHouse }, 
                }"
              >
                <div class="v-timeline-avatar-wrapper rounded-circle">
                  <VAvatar
                    size="40"
                    color="green"
                    variant="outlined"
                  >
                    <VIcon
                      icon="mdi-check"
                      color="white"
                      size="20"
                    />
                  </VAvatar>
                </div>
              </RouterLink>
            </template>
          </VTimelineItem>

          <!-- -   Barcode Count   - -->
          <VTimelineItem
            size="small"
            dot-color="green"
            class="text-center"
          >
            <div v-if="!checkConfigUser(configShowRfid)">
              <RouterLink
                :to="{ 
                  name: 'countStock-CountAdjustStock-barcodeCStock', 
                  query: $route.query, 
                }"
              >
                {{ $t('Barcode Count') }}
              </RouterLink>
            </div>
            <template
              v-if="checkConfigUser(configShowRfid)"
              #opposite
            >
              <RouterLink
                :to="{ 
                  name: 'countStock-CountAdjustStock-barcodeCStock', 
                  query: $route.query, 
                }"
              >
                {{ $t('Barcode Count') }}
              </RouterLink>
            </template>
            <template #icon>
              <RouterLink
                :to="{ 
                  name: 'countStock-CountAdjustStock-barcodeCStock', 
                  query: $route.query, 
                }"
              >
                <div class="v-timeline-avatar-wrapper rounded-circle">
                  <VAvatar
                    size="40"
                    color="green"
                    variant="outlined"
                  >
                    <VIcon
                      icon="mdi-check"
                      color="white"
                      size="20"
                    />
                  </VAvatar>
                </div>
              </RouterLink>
            </template>
          </VTimelineItem>

          <!-- -   Confirm   - -->
          <VTimelineItem
            size="small"
            dot-color="warning"
            class="text-center"
          >
            <template
              v-if="!checkConfigUser(configShowRfid)"
              #opposite
            >
              <RouterLink
                :to="{ 
                  name: 'countStock-CountAdjustStock-barcodeCStock', 
                  query: $route.query, 
                }"
              >
                {{ $t('Confirm The Counting Count') }}
              </RouterLink>
            </template>
            <template
              v-if="checkConfigUser(configShowRfid)"
              #default
            >
              <RouterLink
                :to="{ 
                  name: 'countStock-CountAdjustStock-confirmTheCountingCount', 
                  query: $route.query, 
                }"
              >
                {{ $t('Confirm The Counting Count') }}
              </RouterLink>
            </template>
            <template #icon>
              <RouterLink
                :to="{ 
                  name: 'countStock-CountAdjustStock-confirmTheCountingCount', 
                  query: $route.query, 
                }"
              >
                <div class="v-timeline-avatar-wrapper rounded-circle">
                  <VAvatar
                    size="40"
                    color="warning"
                    variant="outlined"
                  >
                    <VIcon
                      icon="mdi-circle-small"
                      color="white"
                      size="50"
                    />
                  </VAvatar>
                </div>
              </RouterLink>
            </template>
          </VTimelineItem>
        </VTimeline>
      </VCol>
    </VRow>
    <VRow class="d-flex justify-end">
      <VCol
        cols="12"
        lg="3"
        sm="12"
        md="6"
        class="pa-4"
      >
        <VBtn
          density="compact"
          :color="exportButtonColor"
          :variant="exportButtonVariant"
          size="x-large "
          :disabled="!countingExport"
          style="width: 100%;"
          @click="countingAdjustExcel"
        >
          <img
            src="/src/assets/images/icons/vscode-icons_file-type-excel2.png"
            style="width: 27px;"
            class="custom-small-img"
          >
          {{ $t('Export file') }}
        </VBtn>
      </VCol>
    </VRow>
  </section>

  <!-- ----------           Search bar                                   ------------------------------------ -->
  <section>
    <VCard
      class="ma-2"
      disabled
    >
      <VContainer
        fluid
        ma-6
        pa-6
        fill-height
      >
        <VForm>
          <!-- product categories | Group | Sub Group | Counting unit -->
          <VRow>
            <!-- 👉 Select  product categories  -->
            <VCol
              cols="12"
              lg="3"
              sm="6"
            >
              <!-- 👉 Search categories -->

              <section>
                <VAutocomplete
                  v-model="searchByCategoryId"
                  :label="$t('Categories')"
                  :items="itemsSearchByCategoryId"
                  :custom-filter="customFilter"
                  item-title="name"
                  item-value="id"
                  density="compact"
                  clearable
                  clear-icon="mdi-close"
                />
              </section>
            </VCol>

            <!-- 👉 Select Group -->
            <VCol
              cols="12"
              lg="3"
              sm="6"
              md="6"
            >
              <!-- 👉 Search ProductID -->
              <VAutocomplete
                v-model="searchByTypeId"
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

            <!-- 👉 Select  Sub Group -->
            <VCol
              cols="12"
              lg="3"
              sm="6"
            >
              <!-- 👉 Search Description -->
              <VAutocomplete
                v-model="searchBySubTypeId"
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

            <!-- 👉 Select Counting unit -->
            <VCol
              cols="12"
              lg="3"
              sm="6"
            >
              <section>
                <VAutocomplete
                  v-model="searchByUOMId"
                  :label="$t('Counting Unit')"
                  :items="itemsSearchByUOMId"
                  :custom-filter="customFilter"
                  item-title="name"
                  item-value="id"
                  density="compact"
                  clearable
                  clear-icon="mdi-close"
                />
              </section>
            </VCol>
          </VRow>
          
          <!-- Warehouse  | Zone | Store area | Sub Storage area -->
          <VRow>
            <!-- 👉 Select WareHouse Code -->
            <VCol
              cols="12"
              lg="3"
              sm="6"
            >
              <VTextField
                v-model="searchByLocationBarcode"
                :label="$t('Location Barcode')"
                type="Barcode"
                density="compact"
                append-inner-icon="mdi-barcode-scan"
              />
            </VCol>

            <!-- 👉 Select Storehouse Zone -->
            <VCol
              cols="12"
              lg="3"
              sm="6"
            >
              <VAutocomplete
                v-model="searchByZoneId"
                :label="$t('*Zone')"
                :items="zoneItemsSearchById"
                :custom-filter="customFilter"
                item-title="name"
                item-value="id"
                density="compact"
                clearable
                clear-icon="mdi-close"
                color="red"
              >
                <template #label>
                  <span
                    class="red-label"
                    style="color: red;"
                  >{{ $t('*Zone') }}</span>
                </template>
              </VAutocomplete>
            </VCol>

            <!-- 👉 Select Store area -->
            <VCol
              cols="12"
              lg="3"
              sm="6"
            >
              <VAutocomplete
                v-model="searchByAreaId"
                :label="$t('Store Area')"
                :items="areaItemsSearchById"
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
            >
              <VAutocomplete
                v-model="searchBySubAreaId"
                :label="$t('Sub Area')"
                :items="subAreaItemsSearchById"
                :custom-filter="customFilter"
                item-title="name"
                item-value="id"
                density="compact"
                clearable
                clear-icon="mdi-close"
              />
            </VCol>
          </VRow>

          <!-- Barcode | Product code | Product Name | Button Search&Clear -->
          <VRow>
            <!-- 👉 Select Barcode -->
            <VCol
              cols="12"
              lg="3"
              sm="6"
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
            >
              <VTextField
                v-model="searchByProductName"
                :label="$t('Product Name')"
                type="Product Name"
                density="compact"
              />
            </VCol>

            <!-- 👉 Button Search & Clear -->
            <VCol
              cols="12"
              xs="12"
              sm="6"
              md="6"
              lg="3"
            >
              <VRow>
                <!-- 👉 Button Search  -->
                <VCol
                  cols="6"
                  sm="6"
                  md="6"
                  lg="6"
                  class="d-flex justify-center justify-lg-center justify-sm-end justify-xs-end"
                >
                  <VBtn
                    density="compact"
                    size="x-large"
                    class="px-lg-16 px-md-16 px-sm-12 custom-small-btn-search"
                    @click="checkZoneSearchBtn(searchByZoneId)"
                  >
                    <VIcon icon="mdi-magnify" />
                    {{ $t('Search') }}
                  </VBtn>
                </VCol>
                <!-- 👉 Button Clear  -->
                <VCol
                  cols="6"
                  sm="6"
                  md="6"
                  lg="6"
                  
                  class="d-flex justify-center justify-sm-end justify-xs-end"
                >
                  <VBtn
                    type="reset"
                    density="compact"
                    size="x-large"
                    color="red"
                    class="px-lg-16 custom-small-btn-clear"
                    @click="getCountingStockClear"
                  >
                    {{ $t('Clear') }}
                  </VBtn>
                </VCol>
              </VRow>
            </VCol>
          </VRow>
        </VForm>
      </VContainer>
    </VCard>
  </section>

  <!-- Check Zone Dialog -->
  <section>
    <!-- --------------------- Btn Confirm ----------------------- -->
    <VDialog
      v-model="isDialogVisibleBtnZone"
      persistent
      class="v-dialog-sm"
    >
      <!-- Dialog Content -->
      <VCard>
        <DialogCloseBtn
          variant="text"
          size="small"
          @click="isDialogVisibleBtnZone = false"
        />

        <div class="py-4 text-center">
          <div class="v-timeline-avatar-wrapper rounded-circle">
            <VAvatar
              size="160"
              color="warning"
              variant="tonal"
            >
              <VIcon
                icon="mdi-alert-circle-outline"
                color="warning"
                size="128"
              />
            </VAvatar>
          </div>

          <VCardText>
            <span class="text-h5">{{ $t('Please Choose Zone') }}</span>
          </VCardText>
        </div>
      </VCard>
    </VDialog>
  </section>

  <!-- Dialog  -->
  <section>
    <!-- Dialog Confirm -->
    <section>
      <!-- --------------------- Btn Confirm ----------------------- -->
      <VDialog
        v-model="isDialogVisible"
        persistent
        class="v-dialog-sm"
      >
        <!-- Dialog Content -->
        <VCard>
          <DialogCloseBtn
            variant="text"
            size="small"
            @click="isDialogVisible = false"
          />

          <div class="py-4 text-center">
            <div class="v-timeline-avatar-wrapper rounded-circle">
              <VAvatar
                size="160"
                color="warning"
                variant="tonal"
              >
                <VIcon
                  icon="mdi-alert-circle"
                  color="warning"
                  size="128"
                />
              </VAvatar>
            </div>

            <VCardText>
              <span class="text-h5">{{ $t('Would you like to confirm the count/adjustment?') }}</span>
            </VCardText>

            <VCardActions class="mx-8">
              <VSpacer />
              <VBtn
                size="large"
                color="error"
                variant="flat"
                @click="isDialogVisible = false"
              >
                {{ $t('Cancel') }}
              </VBtn>
              <VBtn
                size="large"
                color="success"
                variant="flat"
                @click="isDialogAgreeConfirmVisible"
              >
                {{ $t('Confirm') }}
              </VBtn>
            </VCardActions>
          </div>
        </VCard>
      </VDialog>
      <!-- --------------------- Btn Agree Confirm ----------------------- -->
      <VDialog
        v-model="isDialogConfirmVisible"
        persistent
        class="v-dialog-sm"
      >
        <!-- Dialog Content -->
        <VCard>
          <DialogCloseBtn
            variant="text"
            size="small"
            @click="isDialogConfirmVisible = false"
          />

          <div class="py-4 text-center">
            <div class="v-timeline-avatar-wrapper rounded-circle">
              <VAvatar
                size="160"
                color="success"
                variant="tonal"
              >
                <VIcon
                  icon="mdi-check-circle"
                  color="success"
                  size="128"
                />
              </VAvatar>
            </div>

            <VCardText>
              <span class="text-h5">{{ $t('Confirmed already') }}</span>
            </VCardText>
          </div>
        </VCard>
      </VDialog>
      <!-- --------------------- Btn Not Agree Confirm  ----------------------- -->
      <VDialog
        v-model="isDialogNotConfirmVisible"
        persistent
        class="v-dialog-sm"
      >
        <!-- Dialog Content -->
        <VCard>
          <DialogCloseBtn
            variant="text"
            size="small"
            @click="isDialogNotConfirmVisible = false"
          />

          <div class="py-4 text-center">
            <div class="v-timeline-avatar-wrapper rounded-circle">
              <VAvatar
                size="160"
                color="warning"
                variant="tonal"
              >
                <VIcon
                  icon="mdi-alert-circle"
                  color="warning"
                  size="128"
                />
              </VAvatar>
            </div>

            <VCardText>
              <span class="text-h5">{{ $t('Confirmed Not Already') }}</span>
            </VCardText>
          </div>
        </VCard>
      </VDialog>
    </section>

    <!-- Dialog Cancel -->
    <section>
      <!-- --------------------- Btn Canel Confirm ----------------------- -->
      <VDialog
        v-model="isDialogVisibleCancelSuccess"
        persistent
        class="v-dialog-sm"
      >
        <!-- Dialog Content -->
        <VCard>
          <DialogCloseBtn
            variant="text"
            size="small"
            @click="isDialogVisibleCancelSuccess = false"
          />

          <div class="py-4 text-center">
            <div class="v-timeline-avatar-wrapper rounded-circle">
              <VAvatar
                size="160"
                color="error"
                variant="tonal"
              >
                <VIcon
                  icon="mdi-alert-circle"
                  color="error"
                  size="128"
                />
              </VAvatar>
            </div>

            <VCardText>
              <span class="text-h5">{{ $t('Would You Like To Confirm The Count/Adjustment Cancellation?') }}</span>
            </VCardText>

            <VCardActions class="mx-8">
              <VSpacer />
              <VBtn
                size="large"
                color="error"
                variant="flat"
                @click="isDialogVisibleCancelSuccess = false"
              >
                {{ $t('Cancel') }}
              </VBtn>
              <VBtn
                size="large"
                color="success"
                variant="flat"
                @click="isDialogAgreeConfirmReCountVisible"
              >
                {{ $t('Confirm') }}
              </VBtn>
            </VCardActions>
          </div>
        </VCard>
      </VDialog>
      <!-- --------------------- Btn Canel Agree Confirm ----------------------- -->
      <VDialog
        v-model="isDialogConfirmCancelVisible"
        persistent
        class="v-dialog-sm"
      >
        <!-- Dialog Content -->
        <VCard>
          <RouterLink :to="{ name: 'countStock-CountAdjustStock-countStock' }">
            <DialogCloseBtn
              variant="text"
              size="small"
              @click="isDialogConfirmCancelVisible = false"
            />
          </RouterLink>
            
          <div class="py-4 text-center">
            <div class="v-timeline-avatar-wrapper rounded-circle">
              <VAvatar
                size="160"
                color="success"
                variant="tonal"
              >
                <VIcon
                  icon="mdi-alpha-x-circle"
                  color="success"
                  size="128"
                />
              </VAvatar>
            </div>

            <VCardText>
              <span class="text-h5">{{ $t('Count/Adjustment Successfully Canceled') }}</span>
            </VCardText>
          </div>
        </VCard>
      </VDialog>
    </section>

    <!-- Dialog Count Againt -->
    <section>
      <!-- --------------------- Dialog Re Again ----------------------- -->
      <VDialog
        v-model="isDialogReCountVisible"
        persistent
        class="v-dialog-sm"
      >
        <!-- Dialog Content -->
        <VCard>
          <DialogCloseBtn
            variant="text"
            size="small"
            @click="isDialogReCountVisible = false"
          />

          <div class="py-4 text-center">
            <div class="v-timeline-avatar-wrapper rounded-circle">
              <VAvatar
                size="160"
                color="error"
                variant="tonal"
              >
                <VIcon
                  icon="mdi-alert-circle"
                  color="error"
                  size="128"
                />
              </VAvatar>
            </div>

            <VCardText>
              <span class="text-h5">{{ $t('You Want To Confirm The Count/Adjustment. Again Or Not?') }}</span>
            </VCardText>

            <VCardActions class="mx-8">
              <VSpacer />
              <VBtn
                size="large"
                color="error"
                variant="flat"
                @click="isDialogReCountVisible = false"
              >
                {{ $t('Cancel') }}
              </VBtn>
              <VBtn
                size="large"
                color="success"
                variant="flat"
                to="countAdjust"
                @click="isDialogAgreeConfirmReCountVisible"
              >
                {{ $t('Confirm') }}
              </VBtn>
            </VCardActions>
          </div>
        </VCard>
      </VDialog>
      <!-- --------------------- Dialog Re Agree Confirm ----------------------- -->
      <VDialog
        v-model="isDialogReCountConfirmVisible"
        persistent
        class="v-dialog-sm"
      >
        <!-- Dialog Content -->
        <VCard>
          <DialogCloseBtn
            variant="text"
            size="small"
            @click="isDialogReCountConfirmVisible = false"
          />

          <div class="py-4 text-center">
            <div class="v-timeline-avatar-wrapper rounded-circle">
              <VAvatar
                size="160"
                color="success"
                variant="tonal"
              >
                <VIcon
                  icon="mdi-alpha-x-circle"
                  color="success"
                  size="128"
                />
              </VAvatar>
            </div>

            <VCardText>
              <span class="text-h5">{{ $t('Count/Adjustment Started Again') }}</span>
            </VCardText>
          </div>
        </VCard>
      </VDialog>
    </section>
  </section>

  <!-- ----------           Btn Start cancel clearable                                   ------------------------------------ -->
  <section>
    <VRow>
      <VCol
        cols="6"
        lg="2"
        sm="6"
        md="3"
        class="mt-1 d-flex justify-center justify-lg-start justify-sm-start"
      >
        <!-- --------------------- Btn Confirm ----------------------- -->
        <VBtn
          :color="confirmButtonColor"
          :varliant="confirmButtonVariant"
          v-bind="props"
          :disabled="countingConfirem"
          style="width: 100%;"
          size="large"
          @click="isDialogVisible = true"
        >
          {{ $t('Confirm') }}
        </VBtn>
      </VCol>

      <VCol
        cols="6"
        lg="2"
        md="3"
        sm="6"
        class="mt-1 d-flex justify-center justify-lg-start justify-sm-start"
      >
        <!-- ----------------------- Btn Canel ----------------------- -->
        <VBtn
          class="mx-1 custom-btn-start-dialog"
          :disabled="countingCancel"
          :variant="cancelButtonVariant"
          :color="cancelButtonColor"
          style="width: 100%;"
          size="large"
          @click="isDialogVisibleCancelSuccess = true"
        >
          {{ $t('Cancel') }}
        </VBtn>
      </VCol>
      <VCol
        cols="12"
        lg="3"
        md="6"
        sm="12"
        class="mt-1 d-flex justify-center justify-lg-start justify-sm-start"
      >
        <!-- ----------------------- Btn Re Again ----------------------- -->
        <VBtn
          class="mx-1"
          variant="outlined"
          color="red"
          style="width: 100%;"
          size="large"
          @click="isDialogReCountVisible = true"
        >
          {{ $t('CountAgain/ReCount') }}
        </VBtn>
      </VCol>
    </VRow>
  </section>

  <!-- ----------             Product  Easetrack Table & Paginate                                   ------------------------------------ -->
  <section>
    <VCard class="mt-6">
      <VDivider />

      <VTable class="text-no-wrap table-header-bg rounded-0">
        <!-- 👉 table head -->
        <thead>
          <tr>
            <th
              scope="row"
              class="text-center px-0 px-0"
            />
            <th
              scope="row"
              class="text-center px-0"
            />
            <th
              scope="row"
              class="text-center px-0"
            />
            <th
              scope="row"
              class="text-center px-0"
            />
            <th
              scope="row"
              class="text-center px-0"
            />
            <th
              scope="row"
              class="text-center px-0"
            />
            <th
              scope="row"
              class="text-center px-0"
            />
            <th
              scope="row"
              class="text-center px-0"
            />
            <th
              scope="row"
              class="text-center px-0"
            />

            <!-- ---------------------------- TH RFID[Tag] -------------------------- -->
            <th
              v-if="checkConfigUser(configShowRfid)"
              scope="row"
              class="text-center px-0 bg-green-barcode"
            />
            <th
              v-if="checkConfigUser(configShowRfid)"
              scope="row"
              class="text-center px-0 bg-green-barcode"
            >
              RFID[Tag]
            </th>
            <th
              v-if="checkConfigUser(configShowRfid)"
              scope="row"
              class="text-center px-0 bg-green-barcode"
            />

            <!-- ---------------------------- Barcode -------------------------- -->
            <th
              scope="row"
              class="text-center px-0 bg-violet-RFID"
            />
            <th
              scope="row"
              class="text-center px-0 bg-violet-RFID"
            >
              {{ $t('Barcode') }}
            </th>
            <th
              scope="row"
              class="text-center px-0 bg-violet-RFID"
            />

            <!-- ---------------------------- Summary  -------------------------- -->
            <th
              scope="row"
              class="text-center px-0"
            />
            <th
              scope="row"
              class="text-center px-0"
            >
              {{ $t('Summary') }}
            </th>
            <th
              scope="row"
              class="text-center px-0"
            />

            <!-- ---------------------------- Store Area -------------------------- -->
            <th
              scope="row"
              class="text-center px-0"
            />
            <th
              scope="row"
              class="text-center px-0"
            >
              <span>{{ $t('Location') }}</span>
            </th>
            <th
              scope="row"
              class="text-center px-0"
            />
            <th
              scope="row"
              class="text-center px-0"
            />
          </tr>
        </thead>

        <thead>
          <tr>
            <th
              scope="row"
              class="text-center px-0"
            >
              {{ $t('No.') }}
            </th>
            <th
              scope="row"
              class="text-start px-2"
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
                            v-model="searchByCategoryName"
                            class="mt-4"
                            :label="$t('Product Categories')"
                            @input="handleCountingStock"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
                            @click="menuCategory = false"
                          >
                            Cancel
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
              class="text-start px-0"
            >
              {{ $t('Product Group') }}
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
                            v-model="searchByTypeName"
                            class="mt-4"
                            :label="$t('Product Group')"
                            @input="handleCountingStock"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
                            @click="menuGroup = false"
                          >
                            Cancel
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
              class="text-start px-0"
            >
              {{ $t('Product Sub Group') }}
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
                            v-model="searchBySubTypeName"
                            class="mt-4"
                            :label="$t('Product Sub Group')"
                            @input="handleCountingStock"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
                            @click="menuSubGroup = false"
                          >
                            Cancel
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
              class="text-start px-0"
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
                            v-model="searchByBarcodeName"
                            class="mt-4"
                            :label="$t('Barcode')"
                            @input="handleCountingStock"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
                            @click="menuBarcode = false"
                          >
                            Cancel
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
              class="text-start px-0"
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
                            v-model="searchByProductCodeName"
                            class="mt-4"
                            :label="$t('Product Code')"
                            @input="handleCountingStock"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
                            @click="menuProductCode = false"
                          >
                            Cancel
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
              class="text-start px-0"
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
                            v-model="searchByProductNameFilter"
                            class="mt-4"
                            :label="$t('Product Name')"
                            @input="handleCountingStock"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
                            @click="menuProductName = false"
                          >
                            Cancel
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
              class="text-start px-0"
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
                            v-model="searchByUOMName"
                            class="mt-4"
                            :label="$t('Counting Unit')"
                            @input="handleCountingStock"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
                            @click="menuUoM = false"
                          >
                            Cancel
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
              class="text-start px-0"
            >
              {{ $t('Lot/Batch') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
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
                            v-model="searchByLotName"
                            class="mt-4"
                            :label="$t('Lot/Batch')"
                            @input="handleCountingStock"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
                            @click="menuLot = false"
                          >
                            Cancel
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VListItem>
                  </VList>
                </VCard>
              </VMenu>
            </th>
            <!-- ---------------------------- children TH RFID[Tag] -------------------------- -->
            <th
              v-if="checkConfigUser(configShowRfid)"
              scope="row"
              class="text-center px-0 bg-green-barcode"
            >
              {{ $t('QTY [Pre Count]') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                icon="mdi-unfold-more-horizontal"
                color="primary"
                @click="toggleSortType('sortByQtyTagBefor')"
                @input="handleCountingStock"
              />
            </th>
            <th
              v-if="checkConfigUser(configShowRfid)"
              scope="row"
              class="text-center px-0 bg-green-barcode"
            >
              {{ $t('QTY [Count]') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                icon="mdi-unfold-more-horizontal"
                color="primary"
                @click="toggleSortType('sortByQtyTagAfter')"
                @input="handleCountingStock"
              />
            </th>
            <th
              v-if="checkConfigUser(configShowRfid)"
              scope="row"
              class="text-center px-0 bg-green-barcode"
            >
              {{ $t('QTY [Different Parts]') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                icon="mdi-unfold-more-horizontal"
                color="primary"
                @click="toggleSortType('sortByQtyTagDif')"
                @input="handleCountingStock"
              />
            </th>
            <!-- ---------------------------- children Barcode -------------------------- -->
            <th
              scope="row"
              class="text-center px-0 bg-violet-RFID"
            >
              {{ $t('QTY [Pre Count]') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                icon="mdi-unfold-more-horizontal"
                color="primary"
                @click="toggleSortType('sortByQtyBarcodeBefor')"
                @input="handleCountingStock"
              />
            </th>
            <th
              scope="row"
              class="text-center px-0 bg-violet-RFID"
            >
              {{ $t('QTY [Count]') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                icon="mdi-unfold-more-horizontal"
                color="primary"
                @click="toggleSortType('sortByQtyBarcodeAfter')"
                @input="handleCountingStock"
              />
            </th>
            <th
              scope="row"
              class="text-center px-0 bg-violet-RFID"
            >
              {{ $t('QTY [Different Parts]') }} 
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                icon="mdi-unfold-more-horizontal"
                color="primary"
                @click="toggleSortType('sortByQtyBarcodeDif')"
                @input="handleCountingStock"
              />
            </th>
            <!-- ---------------------------- children Summy -------------------------- -->
            <th
              scope="row"
              class="text-center px-0"
            >
              {{ $t('The Summary [Pre Count]') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                icon="mdi-unfold-more-horizontal"
                color="primary"
                @click="toggleSortType('sortByQtyTagBefor')"
                @input="handleCountingStock"
              />
            </th>
            <th
              scope="row"
              class="text-center px-0"
            >
              {{ $t('The Summary [Count]') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                icon="mdi-unfold-more-horizontal"
                color="primary"
                @click="toggleSortType('sortByQtyTagAfter')"
                @input="handleCountingStock"
              />
            </th>
            <th
              scope="row"
              class="text-center px-0"
            >
              {{ $t('The Summary [Different Parts]') }} 
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                icon="mdi-unfold-more-horizontal"
                color="primary"
                @click="toggleSortType('sortByQtyTagDif')"
                @input="handleCountingStock"
              />
            </th>
            <!-- ---------------------------- children Store Area -------------------------- -->
            <th
              scope="row"
              class="text-start px-0"
            >
              {{ $t('Warehouse') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuWarehouse"
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
                            v-model="searchByStockName"
                            class="mt-4"
                            :label="$t('Warehouse')"
                            @input="handleCountingStock"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
                            @click="menuWarehouse = false"
                          >
                            Cancel
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
              class="text-start px-0"
            >
              {{ $t('Zone') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuZone"
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
                            v-model="searchByZoneName"
                            class="mt-4"
                            :label="$t('Zone')"
                            @input="handleCountingStock"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
                            @click="menuZone = false"
                          >
                            Cancel
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
              class="text-start px-0"
            >
              {{ $t('Area') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuAreaArea"
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
                            v-model="searchByAreaName"
                            class="mt-4"
                            :label="$t('Area')"
                            @input="handleCountingStock"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
                            @click="menuAreaArea = false"
                          >
                            Cancel
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
              class="text-start px-0"
            >
              {{ $t('Sub Area') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuSubAreaArea"
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
                            v-model="searchBySubAreaName"
                            class="mt-4"
                            :label="$t('Sub Area')"
                            @input="handleCountingStock"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
                            @click="menuSubAreaArea = false"
                          >
                            Cancel
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
            v-for="(product, index) in products.items"
            :key="index"
          >
            <!-- 👉 Ordinal Number -->
            <td class="text-start px-2">
              {{ index+1 }}
            </td>

            <!-- 👉 Product Catagories -->
            <td class="text-start px-2">
              {{ product.categoryName }}
            </td>

            <!-- 👉 Product Group -->
            <td class="text-start px-2">
              {{ product.typeName }}
            </td>

            <!-- 👉 product Area -->
            <td class="text-start px-2">
              {{ product.subTypeName }}
            </td>

            <!-- 👉 Barcode -->
            <td class="text-start px-2">
              {{ product.barcode }}
            </td>

            <!-- 👉 ProductId -->
            <td class="text-start px-2">
              {{ product.productId }}
            </td>

            <!-- 👉 productName -->
            <td class="text-start px-2">
              {{ product.productName }}
            </td>

            <!-- 👉 unitName -->
            <td class="text-start px-2">
              {{ product.unitName }}
            </td>
            <!-- 👉 lot -->
            <td class="text-start px-2">
              {{ product.lot }}
            </td>
            <!-- ---------------------------- TD RFID[Tag] -------------------------- -->
            <!-- 👉 tagQtyAfter -->
            <td
              v-if="checkConfigUser(configShowRfid)"
              class="text-end bg-green-barcode px-2"
            >
              {{ product.tagQtyBefor !== null ? product.tagQtyBefor : 0 }}
            </td>
            <!-- 👉 tagQtyBefor -->
            <td
              v-if="checkConfigUser(configShowRfid)"
              class="text-end bg-green-barcode px-2"
            >
              {{ product.tagQtyAfter !== null ? product.tagQtyAfter : 0 }}
            </td>
            <!-- 👉 tagQtyDif -->
            <td
              v-if="checkConfigUser(configShowRfid)"
              class="text-end bg-green-barcode px-2"
            >
              {{ product.tagQtyDif !== null ? product.tagQtyDif : 0 }}
            </td>
            <!-- ---------------------------- Barcode -------------------------- -->
            <!-- 👉 barcodeQtyAfter -->
            <td class="text-end bg-violet-RFID px-2">
              {{ product.barcodeQtyBefor !== null ? product.barcodeQtyBefor : 0 }}
            </td>
            <!-- 👉 barcodeQtyBefor -->
            <td class="text-end bg-violet-RFID px-2">
              {{ product.barcodeQtyAfter !== null ? product.barcodeQtyAfter : 0 }}
            </td>
            <!-- 👉 barcodeQtyDif -->
            <td class="text-end bg-violet-RFID px-2">
              {{ product.barcodeQtyDif !== null ? product.barcodeQtyDif : 0 }}
            </td>
            <!-- ---------------------------- Summary -------------------------- -->
            <!-- 👉 barcodeQtyAfter -->
            <td class="text-end px-2">
              {{ product.qtyBefor !== null ? product.qtyBefor : 0 }}
            </td>
            <!-- 👉 barcodeQtyBefor -->
            <td class="text-end px-2">
              {{ product.qtyAfter !== null ? product.qtyAfter : 0 }}
            </td>
            <!-- 👉 barcodeQtyDif -->
            <td class="text-end px-2">
              {{ product.qtyDif !== null ? product.qtyDif : 0 }}
            </td>
            <!-- ---------------------------- Store Area -------------------------- -->
            <!-- 👉 stockName -->
            <td class="text-start px-2">
              {{ product.stockName }}
            </td>
            <!-- 👉 zoneName -->
            <td class="text-start px-2">
              {{ product.zoneName }}
            </td>
            <!-- 👉 areaName -->
            <td class="text-start px-2">
              {{ product.areaName }}
            </td>
            <!-- 👉 subAreaName -->
            <td class="text-start px-2">
              {{ product.subAreaName }}
            </td>
          </tr>
        </tbody>
      </VTable>

      <VDivider />

  
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
            @input="handleCountingStock"
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
            @input="handleCountingStock"
          />
        </div>
      </VCardText>
    </VCard>
  </section>
</template>

<style lang="scss">
@media screen and (min-width: 200px) and (max-width: 290px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    font-size: 0.8rem;
    padding-inline: 2.5rem;
  }

  .custom-small-btn-clear {
    font-size: 0.8rem;
    padding-inline: 2.5rem;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  .custom-avatar-size {
    font-size: 10px;
  }

  .custom-avatar-size .v-avatar {
    block-size: 30px !important; /* กำหนดความสูงตามต้องการ */
    inline-size: 30px !important; /* กำหนดความกว้างตามต้องการ */
  }

  .custom-avatar-size .v-icon {
    inline-size: 30px !important;
  }
}

@media screen and (min-width: 300px) and (max-width: 399px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    font-size: 0.9rem;
    padding-inline: 50px;
  }

  .custom-small-btn-clear {
    padding: 2px;
    font-size: 0.9rem;
    padding-inline: 50px;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  .custom-avatar-size {
    font-size: 10px;
  }

  .custom-avatar-size .v-avatar {
    block-size: 30px !important; /* กำหนดความสูงตามต้องการ */
    inline-size: 30px !important; /* กำหนดความกว้างตามต้องการ */
  }

  .custom-avatar-size .v-icon {
    inline-size: 30px !important;
  }
}

@media screen and (min-width: 400px) and (max-width: 430px) {
  .custom-small-btn-search {
    padding: 3px;
    font-size: 0.9rem;
    padding-inline: 4rem;
  }

  .custom-small-btn-clear {
    padding: 3px;
    font-size: 0.9rem;
    padding-inline: 4rem;
  }

  .custom-small-img {
    max-inline-size: 30px;
  }

  .custom-avatar-size {
    font-size: 10px;
  }

  .custom-avatar-size .v-avatar {
    block-size: 30px !important; /* กำหนดความสูงตามต้องการ */
    inline-size: 30px !important; /* กำหนดความกว้างตามต้องการ */
  }

  .custom-avatar-size .v-icon {
    inline-size: 30px !important;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

@media screen and (min-width: 500px) and (max-width: 599px) {
  .custom-small-btn-search {
    padding: 3px;
    font-size: 0.9rem;
    padding-inline: 4rem;
  }

  .custom-small-btn-clear {
    padding: 3px;
    font-size: 0.9rem;
    padding-inline: 5rem;
  }

  .custom-small-img {
    max-inline-size: 30px;
  }

  .custom-avatar-size {
    font-size: 10px;
  }

  .custom-avatar-size .v-avatar {
    block-size: 30px !important; /* กำหนดความสูงตามต้องการ */
    inline-size: 30px !important; /* กำหนดความกว้างตามต้องการ */
  }

  .custom-avatar-size .v-icon {
    inline-size: 30px !important;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

@media screen and (min-width: 600px) and (max-width: 690px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    padding: 5px;
    font-size: 1rem;
  }

  .custom-small-btn-excel {
    font-size: 0;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  .custom-avatar-size {
    font-size: 10px;
  }

  .custom-avatar-size .v-avatar {
    block-size: 30px !important; /* กำหนดความสูงตามต้องการ */
    inline-size: 30px !important; /* กำหนดความกว้างตามต้องการ */
  }

  .custom-avatar-size .v-icon {
    inline-size: 30px !important;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

@media screen and (min-width: 700px) and (max-width: 799px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    padding: 3px;
    font-size: 0.8rem;
  }

  .custom-small-btn-clear {
    padding: 3px;
    font-size: 0.8rem;
    padding-inline: 4rem;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  .custom-avatar-size {
    font-size: 10px;
  }

  .custom-avatar-size .v-avatar {
    block-size: 30px !important; /* กำหนดความสูงตามต้องการ */
    inline-size: 30px !important; /* กำหนดความกว้างตามต้องการ */
  }

  .custom-avatar-size .v-icon {
    inline-size: 30px !important;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

@media screen and (min-width: 800px) and (max-width: 899px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    font-size: 1rem;
    padding-inline: 1.5rem;
  }

  .custom-small-btn-clear {
    font-size: 1rem;
    padding-inline: 4rem;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  .custom-avatar-size {
    font-size: 10px;
  }

  .custom-avatar-size .v-avatar {
    block-size: 30px !important; /* กำหนดความสูงตามต้องการ */
    inline-size: 30px !important; /* กำหนดความกว้างตามต้องการ */
  }

  .custom-avatar-size .v-icon {
    inline-size: 30px !important;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

@media screen and (min-width: 900px) and (max-width: 1099px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    font-size: 1rem;
    padding-inline: 1.5rem;
  }

  .custom-small-btn-clear {
    font-size: 1rem;
    padding-inline: 6rem;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  .custom-avatar-size {
    font-size: 10px;
  }

  .custom-avatar-size .v-avatar {
    block-size: 30px !important; /* กำหนดความสูงตามต้องการ */
    inline-size: 30px !important; /* กำหนดความกว้างตามต้องการ */
  }

  .custom-avatar-size .v-icon {
    inline-size: 30px !important;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

@media screen and (min-width: 1100px) and (max-width: 1200px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    font-size: 1.3rem;
    padding-inline: 2rem;
  }

  .custom-small-btn-clear {
    font-size: 1.3rem;
    padding-inline: 7rem;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  .custom-avatar-size {
    font-size: 10px;
  }

  .custom-avatar-size .v-avatar {
    block-size: 30px !important; /* กำหนดความสูงตามต้องการ */
    inline-size: 30px !important; /* กำหนดความกว้างตามต้องการ */
  }

  .custom-avatar-size .v-icon {
    inline-size: 30px !important;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

@media screen and (min-width: 1201px) and (max-width: 1399px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    font-size: 1rem;
    padding-inline: 2rem;
  }

  .custom-small-btn-clear {
    font-size: 1rem;
    padding-inline: 7rem;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  .custom-avatar-size {
    font-size: 10px;
  }

  .custom-avatar-size .v-avatar {
    block-size: 30px !important; /* กำหนดความสูงตามต้องการ */
    inline-size: 30px !important; /* กำหนดความกว้างตามต้องการ */
  }

  .custom-avatar-size .v-icon {
    inline-size: 30px !important;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}

.edited-cell {
  color: green;
}

.positive-dif {
  color: rgb(0, 0, 255);
}

.negative-dif {
  color: red;
}

.green-dif {
  background-color: green;
  color: rgb(255, 255, 255);
}

.red-dif {
  background-color: rgb(255, 0, 0);
  color: rgb(255, 255, 255);
}

.blue-dif {
  background-color: rgb(0, 0, 255);
  color: rgb(255, 255, 255);
}
</style>

