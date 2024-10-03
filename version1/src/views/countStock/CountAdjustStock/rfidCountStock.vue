<script setup>
import dashboard from '@/navigation/vertical/dashboard'
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { onMounted, ref, watchEffect } from 'vue'

// ----------------- Route --------------------------.
import { useRoute } from 'vue-router'

const route = useRoute()

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

//-------------------------------------------------------------  Search Table Nomaly-------------------
// const urlApi = ref('https://webapi.easetrackwms.com')

import { urlApi } from '@/api'

const whereHouseSelectedItem = ref('')
const products = ref([])

// Get access token from localStorage in another page
const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')

const whereHouse = localStorage.getItem('whereHouseName')

//--------------------------- WareHouse Id For Search ---------------------------
const wareHouseId = ref(null)

const accessTokenTest = ('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoi4LiT4Lix4LiQ4Lie4LilIiwibmFtZWlkIjoiMDAwMDAxIiwibmJmIjoxNzAxMzEyMDY5LCJleHAiOjE3MDM0NzIwNjksImlhdCI6MTcwMTMxMjA2OSwiaXNzIjoiSXNzdWVyIiwiYXVkIjoiQXVkaWVuY2UifQ.CPMUUQDPkwS0qBiHUioxEdTW8f1TIZL3u--qENiH-UQ')

const url = ref(`${urlApi}/api/Auth/GetLocation/all`)

const ApiTure = '`${urlApi.value}/api/v1/StockUpdate?page=`+currentPageP.value+`&perPage=`+rowPerPageP.value'

const perPage = ref(10)
const page = ref(0)
const totalCount = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)

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
const sortByQtyBefor = ref(null)
const sortByQtyAfter = ref(null)
const sortByQtyDif = ref(null)

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
  const sortRefs = { sortByQtyBefor, sortByQtyAfter, sortByQtyDif }

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

//--------------------------------------------------------------------------------
let responseData = null

//-------------------------------  Check State Adjust/Counting --------------------
const isConfirmBarcode = ref(null)
const isConfirmRfid = ref(null)

const getCountingStock = () => {

  // Clear the access token from localStorage
  localStorage.removeItem('accessToken')
  axiosIns.get(`${urlApi.value}/api/v1/CountingStock/SearchCounting/Rfid?`, {
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
      productName: searchByProduct.value,
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

      sortByQtyBefor: sortByQtyBefor.value,
      sortByQtyAfter: sortByQtyAfter.value,
      sortByQtyDif: sortByQtyDif.value,

    // ... and so on with other parameters
    },
    
  }, {})
    .then(response => {
      products.value = response.data.items
      responseData = response.data
      stockAdjustId.value = response.data.stockAdjustIdBarcodeSaveItem
      zoneId.value = response.data.zoneId

      totalCount.value = response.data.items.totalCount
      currentPage.value = response.data.items.page
      totalPage.value = response.data.items.totalPages
      rowPerPage.value = response.data.items.perPage

      console.log('products.value: ', products.value.items)
      console.log('responseData: ', response.data)
      isConfirmBarcode.value = response.data.isConfirmBarcode
      isConfirmRfid.value = response.data.isConfirmRfid

      // console.log('perPage: ',perPage)
      // console.log('currentPage: ',currentPage)
      // console.log('totalCount: ',totalCount)
      // console.log('totalPages: ',totalPage)

    
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

const getCountingStockClear = () => {
  this.searchByCategoryId.value = null
  this.searchByTypeId.value = null
  this.searchBySubTypeName.value = null
  this.searchByUOMId.value = null
  this.searchByBarcode.value = null
  this.searchByZoneId.value = null
  this.searchByAreaId.value = null
  this.searchBySubAreaId.value = null
  this.searchByProductId.value = null
  this.searchByProductName.value = null
  getCountingStock()
  console.log("Function Clear Search Start!")
}

// watch(getCountingStock)

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

const onClickExportExcel = () => {
  stockUpdateExcel()
}

//--------------------------------- Zone Check ----------------------------------- 
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

//-------------------------------------  Formed Td ------------------------
const formattedProductName = productName => {
  if (productName !== undefined && productName !== null) {
    // console.log("productName: ",productName)
    
    return productName.replace(/((.{26})(\/|\s|$))/g, "$1\n")
  }
  
  return 'Non'
}

//------------------------------ RFID SAVE WEB ----------------------------------
// -------------------------------------------------- Check box RFID --------
// SECTION Checkbox toggle
const selectedRowsRFID = ref([])
const selectAllUser = ref(false)

const selectUnselectAll = () => {
  selectAllUser.value = !selectAllUser.value
  if (selectAllUser.value) {
    products.value.items.forEach((products, index) => {
      if (!selectedRowsRFID.value.includes(products))
        selectedRowsRFID.value.push(`check${index}`, products)
    })
  } else {
    selectedRowsRFID.value = []
  }
  console.log('selectedRowsRFID All:', selectedRowsRFID)
}

// 👉 watch if checkbox array is empty all select should be uncheck
watch(selectedRowsRFID, () => {
  if (!selectedRowsRFID.value.length)
    selectAllUser.value = false
}, { deep: true })

const addRemoveIndividualCheckbox = (checkID, product) => {
  if (selectedRowsRFID.value.includes(product)) {
    const index = selectedRowsRFID.value.indexOf(product)

    selectedRowsRFID.value.splice(index, 1)
  } else {
    selectedRowsRFID.value.push(product)
    selectAllUser.value = true
    console.log('selectedRowsRFID:', selectedRowsRFID.value)
    
  }

  // console.log('selectedRowsRFID:', selectedRowsRFID)
}

//---------------------------------------- Table Data Test ---------------------------
//------------------------------ Barcode Save Item -------------
const stockAdjustIdBarcodeSaveItem = ref(searchByCategoryId)
const productIdBarcodeSaveItem = ref(null)
const unitIdBarcodeSaveItem = ref(null)
const lotBarcodeSaveItem = ref(null)
const zoneIdBarcodeSaveItem = ref(null)
const areaIdBarcodeSaveItem = ref(null)
const subAreaIdBarcodeSaveItem = ref(null)
const qtyAdjBarcodeSaveItem = ref([])

//------------------ model dialog save btn -------------
const isDialogVisibleConfirm = ref(false)
const isDialogVisibleError = ref(false)
const isDialogVisibleSaveBarcodeSuccess = ref(false)

//------------------- model btn edit -------------------
const isVisibleFieldEdit = ref(false)
const isIconVisibleEdit = ref(false)
const isIconVisibleConfirmEdit = ref(false)
const isIconVisibleCancelEdit = ref(false)

const iconConfirmEditColor = ref('grey')
const iconCancelEditColor = ref('grey')

const btnIconEdit = () => {
  isVisibleFieldEdit.value = true
  isIconVisibleConfirmEdit.value = true
  isIconVisibleCancelEdit.value = true
  iconConfirmEditColor.value = 'primary'
  iconCancelEditColor.value = 'warning'

}

const btnIconEditCancel = () => {
  isVisibleFieldEdit.value = false
  isIconVisibleConfirmEdit.value = false
  isIconVisibleCancelEdit.value = false
  iconConfirmEditColor.value = 'grey'
  iconCancelEditColor.value = 'grey'

}

const saveRFIDWeb = async () => {
  try {
    // สร้าง JSON Array เพื่อเก็บข้อมูลทั้งหมด
    const requestDataArray = selectedRowsRFID.value
      .filter(product => typeof product === 'object' && Object.keys(product).length > 0) // กรองเฉพาะ Object ที่มี Property
      .map(product => ({
        stockAdjustId: product.stockAdjustId,
        productId: product.productId,
        unitId: product.unitId,
        lot: product.lot,
        zoneId: product.zoneId,
        areaId: product.areaId,
        subAreaId: product.subAreaId,
        qtyAdj: product.qtyBefor,
      }))

    // ตรวจสอบว่ามีข้อมูลที่ไม่ว่างเป็นว่างหรือไม่
    if (requestDataArray.length > 0) {
      // ส่ง JSON Array ทั้งหมดไปที่ server
      const response = await axiosIns.post(
        `${urlApi.value}/api/v1/CountingStock/Rfid/Save/Web?`,
        requestDataArray,
        {
          headers: {
            'accept': '*/*',
            'x-location': `${whereHouse}`,
            Authorization: `Bearer ${accessTokenAtStore}`,
          },
        },
      )

      console.log('products.value:', response.data)

      // ตั้งค่า Dialog แสดงเมื่อบันทึกสำเร็จ
      isDialogVisibleConfirm.value = true

      // โหลดข้อมูลใหม่หลังจากการบันทึก
      getCountingStock()
    } else {
      // ถ้าไม่มีข้อมูลที่ไม่ว่าง
      console.log('No valid data to send.')
    }
  } catch (error) {
    // แสดง Dialog แสดงเมื่อเกิดข้อผิดพลาด
    isDialogVisibleError.value = true
    console.error('Error:', error)
  }
}


//----------------------------------- Btn Save StockAdjustId -------------------------------
const saveBarcodeWebAdjustID = async index => {
  try {
    const response = await axiosIns.post(
      `${urlApi.value}/api/v1/CountingStock/Barcode/Save/Web/${StockAdjustIdId.value}`,
      {},
      {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse, // ไม่ควรใส่ `${}` เพราะค่า whereHouse เป็น string อยู่แล้ว
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
      },
    )

    isDialogVisibleConfirm.value = true // แสดง Dialog สำเร็จ
    console.log('products.value:', response.data)
    getCountingStock()
  } catch (error) {
    // Handle errors
    isDialogVisibleError.value = true // แสดง Dialog ไม่สำเร็จ
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
        cols="12"
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
            size="small"
            dot-color="green"
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
            size="small"
            dot-color="warning"
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

          <!-- -   Barcode Count   - -->
          <VTimelineItem
            size="small"
            dot-color="gray"
            class="text-center"
          >
            <template #opposite>
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
                    color="secondary"
                    variant="outlined"
                  >
                    <VIcon
                      icon="mdi-circle-small"
                      size="50"
                    />
                  </VAvatar>
                </div>
              </RouterLink>
            </template>
          </VTimelineItem>

          <!-- -   Confirm the counting count   - -->
          <VTimelineItem
            size="small"
            dot-color="gray"
            class="text-center"
          >
            <template #default>
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
                    color="secondary"
                    variant="outlined"
                  >
                    <VIcon
                      icon="mdi-circle-small"
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
  </section>

  <!-- ----------           Search bar                                   ------------------------------------ -->
  <section>
    <VCard class="ma-2">
      <VContainer
        fluid
        ma-6
        pa-6
        fill-height
      >
        <VForm disabled>
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
                    disabled
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
                    disabled
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

  <!-- --------------------- Btn Confirm When Success ----------------------- -->
  <VDialog
    v-model="isDialogVisibleConfirm"
    persistent
    class="v-dialog-sm"
  >
    <!-- Dialog Content -->
    <VCard>
      <RouterLink
        :to="{ 
          name: 'countStock-CountAdjustStock-barcodeCStock', 
          query: { stockAdjustId: StockAdjustIdId ,
                   zoneId:searchByZoneId,
                   warehouseStock: whereHouse,
                   status:statusAdjustStock }, 
        }"
      >
        <DialogCloseBtn
          variant="text"
          size="small"
          @click="isDialogVisibleConfirm = false"
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
              icon="mdi-check-circle"
              color="success"
              size="128"
            />
          </VAvatar>
        </div>

        <VCardText>
          <span class="text-h5">{{ $t('RFID/counting successfully recorded') }}</span>
        </VCardText>
      </div>
    </VCard>
  </VDialog>

  <!-- ----------           Btn Refresh Save                                  ------------------------------------ -->
  <section>
    <VRow>
      <!-- Btn Refresh & Save -->
      <VCol
        cols="12"
        md="4"
        sm="12"
        lg="4"
        class="mt-4"
      >
        <VRow class="d-flex justify-center">
          <!-- Refresh -->
          <VCol
            cols="6"
            class="d-flex justify-center"
          >
            <!-- Refresh -->
            <VBtn
              prepend-icon="mdi-refresh"
              color="green"
              @click="getCountingStock"
              size="large"
              style="width: 100%;"
            >
              <template #prepend>
                <VIcon color="white" />
              </template>
              {{ $t('Refresh') }}
            </VBtn>
          </VCol>
          <!-- Save -->
          <VCol
            cols="6"
            class="d-flex justify-center"
          >
            <!-- Save -->
            <VBtn
              prepend-icon="mdi-content-save-outline"
              variant="outlined"
              color="primary"
              :disabled="isConfirmRfid"
              @click="saveRFIDWeb"
              size="large"
              style="width: 100%;"
            >
              <template #prepend>
                <VIcon color="primary" />
              </template>
              {{ $t('Save') }}
            </VBtn>
          </VCol>
        </VRow>
      </VCol>
      <!-- Text Alert !! When [Save] **** -->
      <VCol
        cols="12"
        md="8"
        sm="12"
        lg="8"
        style="margin-top: 10px;"
      >
        <span class="d-flex justify-center justify-lg-start justify-md-center justify-sm-center" style="color: red;">{{ $t('When [Save] button is pressed and the scanned tag is not found, the tag will be cleared to empty value. The stock will be saved as automatic barcode stock.') }}</span>
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
              scope="col"
              style="width: 3rem;"
            >
              <VCheckbox
                :model-value="selectedRowsRFID.includes(`check${index}`,products)"
                :indeterminate="(products.length !== selectedRowsRFID.length) && !!selectedRowsRFID.length"
                class="mx-1"
                @click="selectUnselectAll"
              />
            </th>
            <th
              scope="row"
              class="text-center"
            >
              {{ $t('No.') }}
            </th>
            <th
              scope="row"
              class="text-start"
            >
              {{ $t('Product Categories') }}
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
              class="text-start"
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
                            @click="searchByTypeName = false"
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
              class="text-start"
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
              class="text-start"
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
              class="text-start"
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
              class="text-start"
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
              class="text-start"
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
              class="text-start"
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
              scope="row"
              class="text-end "
            >
              {{ $t('QTY [Pre Count]') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                icon="mdi-unfold-more-horizontal"
                color="primary"
                @click="toggleSortType('sortByQtyBefor')"
                @input="handleCountingStock"
              />
            </th>
            <th
              scope="row"
              class="text-end "
            >
              {{ $t('QTY [Count]') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                icon="mdi-unfold-more-horizontal"
                color="primary"
                @click="toggleSortType('sortByQtyAfter')"
                @input="handleCountingStock"
              />
            </th>
            <th
              scope="row"
              class="text-end "
            >
              {{ $t('QTY [Different Parts]') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                icon="mdi-unfold-more-horizontal"
                color="primary"
                @click="toggleSortType('sortByQtyDif')"
                @input="handleCountingStock"
              />
            </th>
          </tr>
        </thead>
        <!-- 👉 table body -->
        <tbody>
          <tr
            v-for="(product, index) in products.items"
            :key="index"
          >
            <!-- 👉 Checkbox -->
            <td>
              <VCheckbox
                :id="`check${index}`"
                :model-value="selectedRowsRFID.includes(`check${index}`,product)"
                class="mx-1"
                @click="addRemoveIndividualCheckbox(`check${index}`,product)"
              />
            </td>
            <!-- 👉 Ordinal Number -->
            <td class="text-start">
              {{ index+1 }}
            </td>

            <!-- 👉 Product Group -->
            <td class="text-start">
              {{ product.categoryName }}
            </td>

            <!-- 👉 product Area -->
            <td class="text-start">
              {{ product.typeName }}
            </td>

            <!-- 👉 Barcode -->
            <td class="text-start">
              {{ product.subTypeName }}
            </td>

            <!-- 👉 Barcode -->
            <td class="text-start">
              {{ product.barcode }}
            </td>

            <!-- 👉 Product Code -->
            <td class="text-start">
              {{ product.productId }}
            </td>

            <!-- 👉 Product Name -->
            <td class="text-start">
              {{ product.productName }}
            </td>
            <!-- 👉 Total quantity of products -->
            <td class="text-start">
              {{ product.unitName }}
            </td>
            <!-- 👉 Total quantity of products -->
            <td class="text-start">
              {{ product.lot }}
            </td>
            <!-- ---------------------------- TD RFID[Tag] -------------------------- -->
            <!-- 👉 RFID[Tag] -->
            <td class="text-end ">
              {{ product.qtyBefor !== null ? product.qtyBefor : 0 }}
            </td>
            <!-- 👉 RFID[Tag] -->
            <td class="text-end ">
              {{ product.qtyAfter !== null ? product.qtyAfter : 0 }}
            </td>
            <!-- 👉 RFID[Tag] -->
            <td class="text-end ">
              {{ product.qtyDif !== null ? product.qtyDif : 0 }}
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

  .custom-btn-save {
    padding-inline: 2rem;
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

  .custom-btn-save {
    padding-inline: 2rem;
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

  .custom-btn-save {
    padding-inline: 3rem;
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

  .custom-btn-save {
    padding-inline: 2rem;
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

  .custom-btn-save {
    padding-inline: 0.5rem;
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

  .custom-btn-save {
    padding-inline: 1.5rem;
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

  .custom-btn-save {
    padding-inline: 2rem;
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

  .custom-btn-save {
    padding-inline: 2rem;
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

  .custom-btn-save {
    padding-inline: 2rem;
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

  .custom-btn-save {
    padding-inline: 2rem;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>

