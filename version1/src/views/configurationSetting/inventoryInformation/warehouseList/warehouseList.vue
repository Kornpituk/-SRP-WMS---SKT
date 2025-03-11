<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { ref, watchEffect } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api'

const whereHouse = localStorage.getItem('whereHouseName')
const whereHouseSelectedItem = ref(whereHouse)
const inventoryList = ref([])

import imgWarehouse from '@images/config/warehouse.webp'


// Get access token from localStorage in another page
const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')

const accessTokenTest = ('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoi4LiT4Lix4LiQ4Lie4LilIiwibmFtZWlkIjoiMDAwMDAxIiwibmJmIjoxNzAxMzEyMDY5LCJleHAiOjE3MDM0NzIwNjksImlhdCI6MTcwMTMxMjA2OSwiaXNzIjoiSXNzdWVyIiwiYXVkIjoiQXVkaWVuY2UifQ.CPMUUQDPkwS0qBiHUioxEdTW8f1TIZL3u--qENiH-UQ')

const url = ref(`${urlApi.value}/api/Auth/GetLocation/all`)

const ApiTure = '`${urlApi.value}/api/v1/StockUpdate?page=`+currentPageP.value+`&perPage=`+rowPerPageP.value'

const perPage = ref(10)
const page = ref(0)
const totalCount = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)

//------------------- Model ID For search ------------------------------------
const searchBystockName = ref(null)
const searchByZoneName = ref(null)
const searchByAreaName = ref(null)
const searchBySubAreaName = ref(null)
const searchByBarcode = ref(null)
const searchByStockId = ref(null)
const searchByZoneId = ref(null)
const searchByAreaId = ref(null)
const searchByWareHouseId = ref([whereHouse])
const searchBySubAreaId = ref(null)
const searchData = ref(null)

const searchBySearchByCategory = ref(null)

//------------------------ Model Name for search ------------------------------
const searchByArea = ref(null)
const searchBySubArea = ref(null)
const searchByZone = ref(null)
const searchByStock = ref(null)
const searchByZoneIdFilter = ref(null)
const searchByUnitName = ref(null)
const searchByColorName = ref(null)
const searchBySizeName = ref(null)

//----- Search Filter Icon Header Table[Product Category, Group, Sub Group, Barcode, Product Category Code, Product Name]
const menuCategory= ref( false)
const menuGroup = ref( false)
const menuSubGroup = ref( false)
const menuBarcode = ref( false)
const menuWarehouse = ref( false)
const menuProductName = ref( false)
const menuUoM = ref( false)

//------------------------ item ID for search ------------------------------
const itemsSearchBystockName = ref([])

//----------------------  SortBy Variable  -------------------------------------
const sortByBarcode = ref('')
const sortByCodeStock = ref('')
const sortByLastUpdate = ref('')

const toggleSortType = sortBy => {
  const sortRefs = { sortByBarcode, sortByCodeStock, sortByLastUpdate }

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

const GetInventoryList = () => {

  // Clear the access token from localStorage
  localStorage.removeItem('accessToken')

  // console.log('searchByArea: ',searchByArea)
  axiosIns.get(`${urlApi.value}/api/v1/InventoryList?page=`+currentPage.value+`&perPage=`+rowPerPage.value, {
    params: {
      stockName: searchBystockName.value,
      zoneName: searchByZoneName.value,
      areaName: searchByAreaName.value,
      subAreaName: searchBySubAreaName.value,
      stockId: searchByStockId.value,
      zoneId: searchByZoneId.value,
      areaId: searchByAreaId.value,
      subAreaId: searchBySubAreaId.value,

      searchByStock: searchByStock.value,
      searchByZone: searchByZone.value,
      searchByArea: searchByArea.value,
      searchBySubArea: searchBySubArea.value,
      searchByBarcode: searchByBarcode.value,
      searchByData: searchData.value,

      sortByBarcode: sortByBarcode.value,
      sortByCodeStock: sortByCodeStock.value,
      sortByLastUpdate: sortByLastUpdate.value,

      // ... and so on with other parameters
    },
    headers: {
      'accept': '*/*',
      'x-location': `${searchByWareHouseId.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {

      inventoryList.value = response.data.items
      totalCount.value = response.data.totalCount
      currentPage.value = response.data.page
      totalPage.value = response.data.totalPages
      rowPerPage.value = response.data.perPage

      console.log('[inventoryList.value]!!: ', inventoryList)
      console.log('Warehouse At StockUpdate :', whereHouseSelectedItem.value)

      // console.log('perPage: ',perPage)
      // console.log('currentPage: ',currentPage)
      // console.log('totalCount: ',totalCount)
      // console.log('totalPages: ',totalPage)

      // console.log('subTypeId',searchByAreaName.value)

      
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })
}

watch(GetInventoryList)

// 👉 watching current page
watch(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})


// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = inventoryList.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = inventoryList.value.length + (currentPage.value - 1) * rowPerPage.value

  // console.log('const firstIndex ',firstIndex,'=','inventoryList.value.length:'+inventoryList.value.length,'?',(currentPage.value - 1)* rowPerPage.value + 1)
  // console.log('const lastIndex ',lastIndex,'=',inventoryList.value.length,'+',(currentPage.value - 1),'*',rowPerPage.value)
  // console.log('inventoryList.value.length: ',inventoryList.value.length)
  
  return `${ firstIndex }-${ lastIndex } of ${ totalCount.value }`
})

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
  itemsSearchBystockName.value = data
})

function customFilter(item, queryText, itemText) {
  const textOne = itemText.title.toLowerCase()
  const textTwo = itemText.value.toLowerCase()
  const searchText = queryText.toLocaleLowerCase()
  
  return textOne.includes(searchText) || textTwo.includes(searchText)
}

const submitSearchButton = () => {
  GetInventoryList()
}

//---------------------------------------- Check Box -----------------------------------------------//
const selectAll = ref(false)
const checkSelectItems = ref([])

const selectAllRows = () => {
  if (selectAll.value) {
    checkSelectItems.value = inventoryList.value.map(inventoryList => inventoryList)
  } else {
    checkSelectItems.value = []
  }
}

watch(() => {
  console.log('checkSelectItems:***', checkSelectItems.value)

})


//-------------------------- format decimal -------------------

const formatDecimal = decimal => {
  const configsShowDigit = localStorage.getItem('configsShowDigit')

  console.log('configsShowDigit: ', configsShowDigit)
  if (configsShowDigit == 'true') {
    return Math.ceil(decimal)
  } else {
    return decimal
  }
}

//---------------------------- format date --------------------
const formatDateTime = dateTimeStr => {
  const dateTime = new Date(dateTimeStr)

  const formattedDate = `${dateTime.getDate().toString().padStart(2, "0")}/${(
    dateTime.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${dateTime.getFullYear()}`

  const formattedTime = `${dateTime
    .getHours()
    .toString()
    .padStart(2, "0")}:${dateTime.getMinutes().toString().padStart(2, "0")}`

  return `${formattedDate} ${formattedTime}`
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

//----------------------------- Dialog --------------------------------------------
//------------------------------ Dialog Print Barcode Warehouse-----------------------
const isDialogPrintBarcodeVisible = ref(false)

//------------------------------ Dialog Add Warehouse -----------------------
const isDialogVisibleBtnAdd = ref(false)
const isDialogVisibleBtnAdded = ref(false)

const postSubProductCategory = () => {

  const postCatData = {
    typeId: postSecondProductCategoryId.value,
    subTypeId: postSubProductCategoryId.value,
    subTypeName: postSubProductCategoryName.value,
  }

  // console.log('searchByArea: ',searchByArea)
  axiosIns.post(`${urlApi.value}/api/v1/SubType/Add`, postCatData, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
      'Content-Type': `application/json`,
    },
  }, {})
    .then(response => {
      isDialogVisibleBtnAdd.value = false ; isDialogVisibleBtnAdded.value = true
      getSubProductCategory()
      console.log('response ', response)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

//------------------ Btn Edit -------------------
const isDialogVisibleBtnEdit = ref(false)
const isDialogVisibleBtnEdited = ref(false)

//-------------------- Function Add Cat Edit ^w^ ------------------
const editProductCategoryId = ref('')
const editProductCategoryName = ref('')
const editSecProductCategoryId = ref('')
const editSecProductCategoryName = ref('')
const editSubProductCategoryId = ref('')
const editSubProductCategoryName = ref('')

const startEdit = (catId, catName, secId, secName, SubId, name) => {
  isDialogVisibleBtnEdit.value = true
  editProductCategoryId.value = catId
  editProductCategoryName.value = catName
  editSecProductCategoryId.value = secId
  editSecProductCategoryName.value = secName
  editSubProductCategoryId.value = SubId
  editSubProductCategoryName.value = name
}

const editSubProductCategory = () => {

  const postCatData = {
    typeId: editSecProductCategoryId.value,
    subTypeId: editSubProductCategoryId.value,
    subTypeName: editSubProductCategoryName.value,
  }

  console.log('catId', postCatData.catId )


  // console.log('searchByArea: ',searchByArea)
  axiosIns.post(`${urlApi.value}/api/v1/SubType/Edit`, postCatData, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
      'Content-Type': `application/json`,
    },
  }, {})
    .then(response => {
      isDialogVisibleBtnEdit.value = false ; isDialogVisibleBtnEdited.value = true
      getSubProductCategory()
      console.log('response ', response)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

//------------------- Btn Delete -------------------
const isDialogVisibleBtnDelete = ref(false)
const isDialogVisibleBtnDeleted = ref(false)

//------------------------ Function Add Cat Delete ^w^ --------------
const deleteProductCategoryId = ref('')
const deleteProductCategoryName = ref('')
const deleteSecProductCategoryId = ref('')
const deleteSecProductCategoryName = ref('')
const deleteSubProductCategoryId = ref('')
const deleteSubProductCategoryName = ref('')

const startDelete = (catId, catName, secId, secName, SubId, name) => {
  isDialogVisibleBtnDelete.value = true
  deleteProductCategoryId.value = catId
  deleteProductCategoryName.value = catName
  deleteSecProductCategoryId.value = secId
  deleteSecProductCategoryName.value = secName
  deleteSubProductCategoryId.value = SubId
  deleteSubProductCategoryName.value = name
}

const deleteSubProductCategory = () => {
  const postCatData = ''

  // console.log('searchByArea: ',searchByArea)
  axiosIns.post(`${urlApi.value}/api/v1/SubType/Delete/${deleteSubProductCategoryId.value}`, postCatData, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {
      isDialogVisibleBtnDelete.value = false ; isDialogVisibleBtnDeleted.value = true
      getSubProductCategory()
      console.log('response ', response)
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })
}

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

const onClickExportExcel = () => {
  stockUpdateExcel()
}

// --------------------------------------- Export Barcode Excel ----------------------
const checkboxBarcode = ref(false)
const checkboxQRCode = ref(false)
const numberPrintPOBarcode = ref(1)

const barcodeExcelExport = () => {
  const Data = checkSelectItems.value.map(item => ({
    barcode: item.barcode,
    brand: item.brand,
    categoryId: item.categoryId,
    categoryName: item.categoryName,
    color: item.color,
    colorId: item.colorId,
    image: item.image,
    lastUpdate: item.lastUpdate,
    locations: item.locations,
    nonTags: item.nonTags,
    productId: item.productId,
    productName: item.productName,
    qty: item.qty,
    size: item.size,
    sizeId: item.sizeId,
    styleNo: item.styleNo,
    subTypeId: item.subTypeId,
    subTypeName: item.subTypeName,
    tags: item.tags,
    typeId: item.typeId,
    typeName: item.typeName,
    unitId: item.unitId,
    unitName: item.unitName,
  }))
  
  axiosIns.post(`${urlApi.value}/api/v1/Product/ProductList/Excel/Barcode`, Data, {
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

      const fileName = `Product_List_Barcode_${dateString}.xlsx` // ตั้งชื่อไฟล์โดยรวมกับวันที่

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

const qrCodeExcelExport = () => {
  const Data = checkSelectItems.value.map(item => ({
    barcode: item.barcode,
    brand: item.brand,
    categoryId: item.categoryId,
    categoryName: item.categoryName,
    color: item.color,
    colorId: item.colorId,
    image: item.image,
    lastUpdate: item.lastUpdate,
    locations: item.locations,
    nonTags: item.nonTags,
    productId: item.productId,
    productName: item.productName,
    qty: item.qty,
    size: item.size,
    sizeId: item.sizeId,
    styleNo: item.styleNo,
    subTypeId: item.subTypeId,
    subTypeName: item.subTypeName,
    tags: item.tags,
    typeId: item.typeId,
    typeName: item.typeName,
    unitId: item.unitId,
    unitName: item.unitName,
  }))
  
  axiosIns.post(`${urlApi.value}/api/v1/Product/ProductList/Excel/QRCode`, Data, {
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

      const fileName = `Product_List_QRCode_${dateString}.xlsx` // ตั้งชื่อไฟล์โดยรวมกับวันที่

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

const onClickExportExcelList = () => {
  if(checkboxBarcode.value && !checkboxQRCode.value){
    for(let i = 0; i < numberPrintPOBarcode.value; i++){
      barcodeExcelExport()
    }
  } else if(!checkboxBarcode.value && checkboxQRCode.value){
    for(let i = 0; i < numberPrintPOBarcode.value; i++){
      qrCodeExcelExport()
    }
  } else if(checkboxBarcode.value && checkboxQRCode.value){
    for(let i = 0; i < numberPrintPOBarcode.value; i++){
      barcodeExcelExport()
      qrCodeExcelExport()
    }
  } else {
    console.log('No selection')
  }
}


//---------------------------- Filter -------------------------------------
const drawer = ref(null)

//----------------------------- App View -----------------------------------
const appView = ref(null)

const iconViewApp = ref('mdi-view-list')

const switchAppView = () => {
  appView.value = !appView.value
  if(!appView.value){
    iconViewApp.value = 'mdi-view-list'
  } else {
    iconViewApp.value = 'mdi-apps'
  }
}
</script>

<template>
  <!-- ----------------        Label Page | Back           ------------------------------------ -->
  <section>
    <!-- Tag page back -->
    <VRow>
      <VCol
        col="12"
        sm="3"
        md="2"
        lg="2"
      >
        <RouterLink :to="{ name: 'configurationSetting-productInformation-product-list' }">
          <IconBtn>
            <VIcon
              icon="
                mdi-chevron-left"
            />
          </IconBtn>
        </RouterLink>
        {{ $t("Warehouse List") }}
      </VCol>
      <VCol
        cols="12"
        sm="9"
        md="10"
        lg="10"
        class="d-flex justify-end justify-lg-end justify-sm-end"
      >
        <VRow>
          <!-- Search Bar -->
          <VCol
            cols="12"
            md="5"
            lg="7"
            class="d-flex justify-center"
          >
            <VTextField
              v-model="searchData"
              density="compact"
            >
              <template #label>
                <span>{{ $t('Search') }}</span>
              </template>

              <template #prepend-inner>
                <VIcon
                  color="primary"
                  icon="mdi-magnify"
                />
              </template>
            </VTextField>
          </VCol>
          <!-- Btn -->
          <VCol
            cols="12"
            md="7"
            lg="5"
            class="d-flex justify-end"
          >
            <VRow>
              <!-- Btn Add / Btn Print Barcode -->
              <VCol
                cols="12"
                sm="8"
                lg="9"
                class="d-flex align-center"
              >
                <VRow style="justify-content: end;">
                  <!-- Btn Add -->
                  <VCol
                    sm="4"
                    cols="3"
                    lg="3"
                  >
                    <!-- Btn Add -->
                    <VBtn
                      class="red--text mx-2"
                      color="primary"
                      prepend-icon="mdi-plus"
                      style="width: 100%;"
                      @click="isDialogVisibleBtnAdd = true"
                    >
                      <template #prepend>
                        <VIcon color="white" />
                      </template>
                      <span class="text-white">{{ $t('Add') }}</span>
                    </VBtn>
                  </VCol>
                  <!-- Btn Print Barcode -->
                  <VCol
                    class="d-flex justify-end justify-lg-start"
                    sm="8"
                    cols="9"
                  >
                    <!-- Btn Print Barcode -->
                    <VBtn
                      class="red--text  mx-2"
                      color="orange"
                      prepend-icon="mdi-printer-outline"
                      style="width: 100%;"
                      @click="isDialogPrintBarcodeVisible = true"
                    >
                      <template #prepend>
                        <VIcon color="white" />
                      </template>
                      <span class="text-white">{{ $t('Print Barcode PO') }}</span>
                    </VBtn>
                  </VCol>
                </VRow>
              </VCol>
              <!-- Filter / App View -->
              <VCol
                cols="12"
                sm="4"
                lg="3"
              >
                <VRow>
                  <!-- Filter -->
                  <VCol
                    class="d-flex justify-end justify-lg-center"
                    cols="6"
                  >
                    <!-- Filter -->
                    <VBtn
                      size="50px"
                      variant="text"
                      color="orange"
                      style="width: 100%;"
                      @click.stop="drawer = !drawer"
                    >
                      <VIcon
                        size="50px"
                        icon="mdi-filter-outline"
                      />
                    </VBtn>
                  </VCol>
                  <!-- App View -->
                  <VCol cols="6">
                    <!-- App View -->
                    <VBtn
                      size="50px"
                      color="red"
                      variant="text"
                      style="width: 100%; border-radius: 5px;"
                      @click="switchAppView"
                    >
                      <VIcon
                        size="50px"
                        :icon="iconViewApp"
                      />
                    </VBtn>
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          </VCol> 
        </VRow>
      </VCol>
    </VRow>
  </section>

  <!-- Dialog  -->
  <div>
    <!-- Dialog Print Barcode -->
    <section>
      <VDialog
        v-model="isDialogPrintBarcodeVisible"
        max-width="450"
      >
        <!-- Dialog Content -->
        <VCard>
          <DialogCloseBtn
            variant="text"
            size="small"
            @click="isDialogPrintBarcodeVisible = false"
          />
          <VCardTitle style="text-decoration: underline;">
            {{ $t('Print Barcode Warehouse') }}
          </VCardTitle>

          <VCardText>
            <VRow>
              <!-- Number Print Barcode -->
              <VCol cols="12">
                <div class="mx-10 d-flex justify-start align-center">
                  <span>{{ $t('Number Of Prints/Bar Codes') }}:</span> 
                  <VTextField
                    v-model="numberPrintPOBarcode"
                    density="compact"
                    class="mx-3"
                    type="number"
                    :min="0"
                    style="max-inline-size: 5rem;"
                  />
                </div>
              </VCol>
              <!-- Checkbox -->
              <VCol
                cols="12"
                style=" margin-top: -1.5rem; margin-left: 3rem;"
              >
                <VCheckbox
                  v-model="checkboxBarcode"
                  class="mx-16"
                  :label="$t('Barcode')"
                />

                <VCheckbox
                  v-model="checkboxQRCode"
                  class="mx-16"
                  :label="$t('QR Code')"
                />
              </VCol>
            </VRow>
          </VCardText>

          <VCardActions>
            <VSpacer />
            <VBtn
              variant="flat"
              color="error"
              @click="isDialogPrintBarcodeVisible = false"
            >
              {{ $t('Close') }}
            </VBtn>
            <VBtn
              variant="flat"
              color="success"
              @click="onClickExportExcelList"
            >
              {{ $t('Print') }}
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
    </section>
    
    <!-- Dialog Add  -->
    <section>
      <VDialog
        v-model="isDialogVisibleBtnAdd"
        max-width="650"
      >
        <!-- Dialog Content -->
        <VCard>
          <DialogCloseBtn
            variant="text"
            size="small"
            @click="isDialogVisibleBtnAdd = false"
          />
          <VCardTitle style="text-decoration: underline;">
            {{ $t('Add Inventory') }}
          </VCardTitle>

          <VCardText>
            <VRow>
              <!-- WareHouse -->
              <VCol cols="12">
                <VRow>
                  <VCol
                    class="d-flex justify-start justify-lg-end"
                    cols="12"
                    lg="3"
                  >
                    {{ $t('Warehouse') }}:
                  </VCol>
                  <VCol
                    cols="4"
                    lg="2"
                  >
                    <VTextField
                      density="compact"
                      type="number"
                      placeholder="00"
                      :min="0"
                    />
                  </VCol>
                  <VCol
                    cols="6"
                    lg="6"
                  >
                    <VSelect
                      density="compact"
                      :label="$t('Inventory Warehouse')"
                    />
                  </VCol>
                  <VCol
                    cols="2"
                    lg="1"
                    class="d-flex align-center"
                  >
                    <VIcon
                      color="blue"
                      icon="mdi-file"
                    />
                  </VCol>
                </VRow>
              </VCol>
              <!-- Zone -->
              <VCol cols="12">
                <VRow>
                  <VCol
                    class="d-flex justify-start justify-lg-end"
                    cols="12"
                    lg="3"
                  >
                    {{ $t('Zone') }}:
                  </VCol>
                  <VCol
                    cols="4"
                    lg="2"
                  >
                    <VTextField
                      density="compact"
                      type="number"
                      placeholder="00"
                      :min="0"
                    />
                  </VCol>
                  <VCol
                    cols="6"
                    lg="6"
                  >
                    <VSelect
                      density="compact"
                      :label="$t('Zone')"
                    />
                  </VCol>
                  <VCol
                    cols="2"
                    lg="1"
                    class="d-flex align-center"
                  >
                    <VIcon
                      color="blue"
                      icon="mdi-file"
                    />
                  </VCol>
                </VRow>
              </VCol>
              <!-- Area -->
              <VCol cols="12">
                <VRow>
                  <VCol
                    class="d-flex justify-start justify-lg-end"
                    cols="12"
                    lg="3"
                  >
                    {{ $t('Area') }}:
                  </VCol>
                  <VCol
                    cols="4"
                    lg="2"
                  >
                    <VTextField
                      density="compact"
                      type="number"
                      placeholder="00"
                      :min="0"
                    />
                  </VCol>
                  <VCol
                    cols="6"
                    lg="6"
                  >
                    <VSelect
                      density="compact"
                      :label="$t('Area')"
                    />
                  </VCol>
                  <VCol
                    cols="2"
                    lg="1"
                    class="d-flex align-center"
                  >
                    <VIcon
                      color="blue"
                      icon="mdi-file"
                    />
                  </VCol>
                </VRow>
              </VCol>
              <!-- Sub Area -->
              <VCol cols="12">
                <VRow>
                  <VCol
                    class="d-flex justify-start justify-lg-end"
                    cols="12"
                    lg="3"
                  >
                    {{ $t('Sub Area') }}:
                  </VCol>
                  <VCol
                    cols="4"
                    lg="2"
                  >
                    <VTextField
                      density="compact"
                      type="number"
                      placeholder="00"
                      :min="0"
                    />
                  </VCol>
                  <VCol
                    cols="6"
                    lg="6"
                  >
                    <VSelect
                      density="compact"
                      :label="$t('Sub Area')"
                    />
                  </VCol>
                  <VCol
                    cols="2"
                    lg="1"
                    class="d-flex align-center"
                  >
                    <VIcon
                      color="blue"
                      icon="mdi-file"
                    />
                  </VCol>
                </VRow>
              </VCol>
              <!-- Barcode -->
              <VCol cols="12">
                <VRow>
                  <VCol
                    class="d-flex justify-start justify-lg-end"
                    cols="12"
                    lg="3"
                  >
                    {{ $t('Barcode') }}:
                  </VCol>
                  <VCol
                    cols="4"
                    lg="2"
                  >
                    <VTextField
                      density="compact"
                      type="number"
                      placeholder="00"
                      :min="0"
                    />
                  </VCol>
                  <VCol
                    cols="6"
                    lg="6"
                  >
                    <VSelect
                      density="compact"
                      :label="$t('Barcode')"
                    />
                  </VCol>
                  <VCol
                    cols="2"
                    lg="1"
                    class="d-flex align-center"
                  >
                    <VIcon
                      color="blue"
                      icon="mdi-file"
                    />
                  </VCol>
                </VRow>
              </VCol>
              <!-- RFID -->
              <VCol cols="12">
                <VRow>
                  <VCol
                    class="d-flex justify-start justify-lg-end"
                    cols="12"
                    lg="3"
                  >
                    {{ $t('RFID') }}:
                  </VCol>
                  <VCol
                    cols="4"
                    lg="2"
                  >
                    <VTextField
                      density="compact"
                      placeholder="00"
                      type="number"
                      :min="0"
                    />
                  </VCol>
                  <VCol
                    cols="6"
                    lg="6"
                  >
                    <VSelect
                      density="compact"
                      :label="$t('RFID')"
                    />
                  </VCol>
                  <VCol
                    cols="2"
                    lg="1"
                    class="d-flex align-center"
                  >
                    <VIcon
                      color="blue"
                      icon="mdi-file"
                    />
                  </VCol>
                </VRow>
              </VCol>
              <!-- Checkbox -->
              <VCol cols="12">
                <VCheckbox
                  v-model="checkboxOne"
                  class="mx-lg-16"
                  :label="$t('Default Admission Area')"
                />

                <VCheckbox
                  v-model="checkboxTwo"
                  class="mx-lg-16"
                  :label="$t('Storage Space For Delivery inventoryList')"
                />
              </VCol>
            </VRow>
          </VCardText>

          <VCardActions>
            <VSpacer />
            <VBtn
              variant="flat"
              color="error"
              @click="isDialogVisibleBtnAdd = false"
            >
              Close
            </VBtn>
            <VBtn
              variant="flat"
              color="success"
              @click="isDialogVisibleBtnAdd = false"
            >
              Save
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
    </section>
    <!-- Dialog Content Confirmed -->
    <section>
      <VDialog
        v-model="isDialogVisibleBtnAdded"
        max-width="600"
      >
        <!-- Dialog Content -->
        <VCard>
          <DialogCloseBtn
            variant="text"
            size="small"
            @click="isDialogVisibleBtnAdded = false"
          />

          <VCardText class="d-flex justify-center">
            <div class="v-timeline-avatar-wrapper rounded-circle">
              <VAvatar
                size="160"
                color="primary"
                variant="tonal"
              >
                <VIcon
                  icon="mdi-check-circle"
                  color="primary"
                  size="128"
                />
              </VAvatar>
            </div>
          </VCardText>
          <VCardText class="d-flex justify-center">
            <span class="text-h5 text-center px-6">{{ $t('The Warehouse Has Been Added') }}</span>
          </VCardText>
        </VCard>
      </VDialog>
    </section>

    <!-- Dialog Delete  -->
    <section>
      <VDialog
        v-model="isDialogVisibleBtnDelete"
        max-width="650"
      >
        <!-- Dialog Content -->
        <VCard>
          <DialogCloseBtn
            variant="text"
            size="small"
            @click="isDialogVisibleBtnDelete = false"
          />
          <VCardTitle style="text-decoration: underline;">
            {{ $t('Remove Warehouse') }}
          </VCardTitle>

          <VCardText>
            <VRow>
              <!-- WareHouse -->
              <VCol cols="12">
                <VRow>
                  <VCol
                    class="d-flex justify-end"
                    cols="3"
                  >
                    {{ $t('Warehouse') }}:
                  </VCol>
                  <VCol cols="2">
                    <VTextField
                      density="compact"
                      type="number"
                      :min="0"
                      variant="solo-filled"
                      readonly
                    />
                  </VCol>
                  <VCol cols="6">
                    <VSelect
                      density="compact"
                      :label="$t('Inventory Warehouse')"
                      variant="solo-filled"
                      readonly
                    />
                  </VCol>
                  <VCol
                    cols="1"
                    class="d-flex align-center"
                  >
                    <VIcon
                      color="blue"
                      icon="mdi-file"
                      variant="solo-filled"
                    />
                  </VCol>
                </VRow>
              </VCol>
              <!-- Zone -->
              <VCol cols="12">
                <VRow>
                  <VCol
                    class="d-flex justify-end"
                    cols="3"
                    lg="3"
                  >
                    {{ $t('Zone') }}:
                  </VCol>
                  <VCol cols="2">
                    <VTextField
                      density="compact"
                      type="number"
                      :min="0"
                      variant="solo-filled"
                      readonly
                    />
                  </VCol>
                  <VCol cols="6">
                    <VSelect
                      density="compact"
                      :label="$t('Zone')"
                      variant="solo-filled"
                      readonly
                    />
                  </VCol>
                  <VCol
                    cols="1"
                    class="d-flex align-center"
                  >
                    <VIcon
                      color="blue"
                      icon="mdi-file"
                      variant="solo-filled"
                    />
                  </VCol>
                </VRow>
              </VCol>
              <!-- Area -->
              <VCol cols="12">
                <VRow>
                  <VCol
                    class="d-flex justify-end"
                    cols="3"
                    lg="3"
                  >
                    {{ $t('Area') }}:
                  </VCol>
                  <VCol cols="2">
                    <VTextField
                      density="compact"
                      type="number"
                      :min="0"
                      variant="solo-filled"
                      readonly
                    />
                  </VCol>
                  <VCol cols="6">
                    <VSelect
                      density="compact"
                      :label="$t('Area')"
                      variant="solo-filled"
                      readonly
                    />
                  </VCol>
                  <VCol
                    cols="1"
                    class="d-flex align-center"
                  >
                    <VIcon
                      color="blue"
                      icon="mdi-file"
                    />
                  </VCol>
                </VRow>
              </VCol>
              <!-- Sub Area -->
              <VCol cols="12">
                <VRow>
                  <VCol
                    class="d-flex justify-end"
                    cols="3"
                    lg="3"
                  >
                    {{ $t('Sub Area') }}:
                  </VCol>
                  <VCol cols="2">
                    <VTextField
                      density="compact"
                      type="number"
                      :min="0"
                      variant="solo-filled"
                      readonly
                    />
                  </VCol>
                  <VCol cols="6">
                    <VSelect
                      density="compact"
                      :label="$t('Sub Area')"
                      variant="solo-filled"
                      readonly
                    />
                  </VCol>
                  <VCol
                    cols="1"
                    class="d-flex align-center"
                  >
                    <VIcon
                      color="blue"
                      icon="mdi-file"
                    />
                  </VCol>
                </VRow>
              </VCol>
              <!-- Barcode -->
              <VCol cols="12">
                <VRow>
                  <VCol
                    class="d-flex justify-end"
                    cols="3"
                    lg="3"
                  >
                    {{ $t('Barcode') }}:
                  </VCol>
                  <VCol cols="2">
                    <VTextField
                      density="compact"
                      type="number"
                      :min="0"
                      variant="solo-filled"
                      readonly
                    />
                  </VCol>
                  <VCol cols="6">
                    <VSelect
                      density="compact"
                      :label="$t('Barcode')"
                      variant="solo-filled"
                      readonly
                    />
                  </VCol>
                  <VCol
                    cols="1"
                    class="d-flex align-center"
                  >
                    <VIcon
                      color="blue"
                      icon="mdi-file"
                    />
                  </VCol>
                </VRow>
              </VCol>
              <!-- RFID -->
              <VCol cols="12">
                <VRow>
                  <VCol
                    class="d-flex justify-end"
                    cols="3"
                    lg="3"
                  >
                    {{ $t('RFID') }}:
                  </VCol>
                  <VCol cols="2">
                    <VTextField
                      density="compact"
                      type="number"
                      :min="0"
                      variant="solo-filled"
                      readonly
                    />
                  </VCol>
                  <VCol cols="6">
                    <VSelect
                      density="compact"
                      :label="$t('RFID')"
                      variant="solo-filled"
                      readonly
                    />
                  </VCol>
                  <VCol
                    cols="1"
                    class="d-flex align-center"
                  >
                    <VIcon
                      color="blue"
                      icon="mdi-file"
                    />
                  </VCol>
                </VRow>
              </VCol>
              <!-- Checkbox -->
              <VCol
                cols="12"
                style=" margin-top: 0.1rem; margin-left: 6rem;"
              >
                <VCheckbox
                  v-model="checkboxOne"
                  class="mx-16"
                  :label="$t('Default Admission Area')"
                />

                <VCheckbox
                  v-model="checkboxTwo"
                  class="mx-16"
                  :label="$t('Storage Space For Delivery inventoryList')"
                />
              </VCol>
            </VRow>
          </VCardText>

          <VCardActions>
            <VSpacer />
            <VBtn
              variant="flat"
              color="error"
              @click="isDialogVisibleBtnDelete = false"
            >
              Close
            </VBtn>
            <VBtn
              variant="flat"
              color="success"
              @click="isDialogVisibleBtnDelete = false"
            >
              Save
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
    </section>
    <!-- Dialog Delete Content Confirmed -->
    <section>
      <VDialog
        v-model="isDialogVisibleBtnDeleted"
        max-width="600"
      >
        <!-- Dialog Content -->
        <VCard>
          <DialogCloseBtn
            variant="text"
            size="small"
            @click="isDialogVisibleBtnDeleted = false"
          />

          <VCardText class="d-flex justify-center">
            <div class="v-timeline-avatar-wrapper rounded-circle">
              <VAvatar
                size="160"
                color="primary"
                variant="tonal"
              >
                <VIcon
                  icon="mdi-check-circle"
                  color="primary"
                  size="128"
                />
              </VAvatar>
            </div>
          </VCardText>
          <VCardText class="d-flex justify-center">
            <span class="text-h5 text-center px-6">{{ $t('The Warehouse Has Been Removed') }}</span>
          </VCardText>
        </VCard>
      </VDialog>
    </section>
  </div>

  <!-- Filter navigation -->
  <section>
    <VNavigationDrawer
      v-model="drawer"
      width="350"
      temporary
      location="right"
    >
      <div class="pa-6 d-flex align-center ">
        <VRow>
          <VCol cols="2">
            <IconBtn @click.stop="drawer = !drawer">
              <VIcon
                icon="mdi-close"
                size="20"
              />
            </IconBtn>
          </VCol>
          <VCol cols="10">
            <div>
              <div class="d-flex align-center justify-center">
                <h6 class="text-h4">
                  {{ $t('Filter') }}
                </h6>
              </div>
            </div>
          </VCol>
        </VRow>
      </div>


      <VDivider />

      <VList
        density="compact"
        nav
      >
        <!-- Warehouse Barcode -->
        <VRow>
          <VCol
            cols="4"
            class="text-end d-flex align-center justify-end"
          >
            <span>{{ $t('Warehouse Code') }}:</span>
          </VCol>
          <VCol cols="8">
            <VTextField
              v-model="searchByStockId"
              title="Regular"
              :label="$t('Warehouse Code')"
            />
          </VCol>
        </VRow>
        <!-- Warehouse Name -->
        <VRow>
          <VCol
            cols="4"
            class="text-end d-flex align-center justify-end"
          >
            <span>{{ $t('Warehouse Name') }}:</span>
          </VCol>
          <VCol cols="8">
            <VTextField
              v-model="searchBystockName"
              :label="$t('Warehouse Name')"
            />
          </VCol>
        </VRow>
        <!-- Storage Zone -->
        <VRow>
          <VCol
            cols="4"
            class="text-end d-flex align-center justify-end"
          >
            <span>{{ $t('Storage Zone') }}:</span>
          </VCol>
          <VCol cols="8">
            <VTextField
              v-model="searchByZoneName"
              :label="$t('Storage Zone')"
            />
          </VCol>
        </VRow>
        <!-- Storage Area -->
        <VRow>
          <VCol
            cols="4"
            class="text-end d-flex align-center justify-end"
          >
            <span>{{ $t('Storage Area') }}:</span>
          </VCol>
          <VCol cols="8">
            <VTextField
              v-model="searchByAreaName"
              :label=" $t('Storage Area') "
            />
          </VCol>
        </VRow>
        <!-- Sub Storage Area -->
        <VRow>
          <VCol
            cols="4"
            class="text-end d-flex align-center justify-end"
          >
            <span>{{ $t('Sub Storage Area') }}:</span>
          </VCol>
          <VCol cols="8">
            <VTextField
              v-model="searchBySubAreaName"
              :label="$t('Sub Storage Area')"
            />
          </VCol>
        </VRow>
        <!-- Product Barcode -->
        <VRow>
          <VCol
            cols="4"
            class="d-flex align-center justify-end"
          >
            <span>{{ $t('Barcode') }}:</span>
          </VCol>
          <VCol cols="8">
            <VTextField
              v-model="searchByBarcode"
              :label="$t('Barcode')"
            />
          </VCol>
        </VRow>
        
        <!-- Btn Unit -->
        <VRow class="d-flex align-end">
          <VCol
            class="d-flex justify-center"
            cols="12"
          >
            <VBtn
              class="mx-2"
              type="submit"
            >
              Filter
            </VBtn>
            <VBtn
              class="mx-2"
              color="error"
              variant="outlined"
              type="reset"
            >
              Reset
            </VBtn>
          </VCol>
        </VRow>
      </VList>
    </VNavigationDrawer>
    <VMain style="height: auto;" />
  </section>

  <!-- ----------             Product  Easetrack                                  ------------------------------------ -->
  <section>
    <!-- Table -->
    <VCard
      v-if="!appView"
      class="mt-6"
    >
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
                v-model="selectAll"
                @change="selectAllRows"
              />
            </th>
            <th
              scope="row"
              class="text-start"
            >
              {{ $t('No.') }}
            </th>
            <th
              scope="row"
              class="text-start"
            >
              {{ $t('Warehouse Code') }}
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByCodeStock')"
              />
            </th>
            <th
              scope="row"
              class="text-start"
            >
              {{ $t('Warehouse Name') }}
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
                            v-model="searchByStock"
                            class="mt-4"
                            :label="$t('Warehouse Name')"
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
              class="text-start"
            >
              {{ $t('Storage Zone') }}
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
                            v-model="searchByZone"
                            class="mt-4"
                            :label="$t('Storage Zone')"
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
              {{ $t('Storage Area') }}
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
                            v-model="searchByArea"
                            class="mt-4"
                            :label="$t('Storage Area')"
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
              {{ $t('Sub Storage Area') }}
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
                            v-model="searchBySubArea"
                            class="mt-4"
                            :label="$t('Sub Storage Area')"
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
              class="text-start"
            >
              {{ $t('Barcode') }}
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
                            v-model="searchByBarcode"
                            class="mt-4"
                            :label="$t('Barcode')"
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

              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByCodeStock')"
              />
            </th>
            <th
              scope="row"
              class="text-start"
            >
              {{ $t('Last Date Edit') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByLastUpdate')"
              />
            </th>
            <th
              scope="row"
              class="text-center"
            >
              Action
            </th>
          </tr>
        </thead>
        
        <!-- 👉 table body -->
        <tbody>
          <tr
            v-for="(product, index) in inventoryList"
            :key="index"
          >
            <!-- 👉 Checkbox -->
            <td>
              <VCheckbox
                v-model="checkSelectItems"
                :value="product"
                hide-details
              />
            <!-- 👉 Ordinal Number -->
            </td>
            
            <td class="text-center">
              {{ index+1 }}
            </td>

            <!-- 👉 WareHouse Barcode -->
            <td class="text-start">
              {{ product.inventoryId }}
            </td>

            <!-- 👉 WareHouse Name -->
            <td class="text-start">
              {{ product.inventoryName }}
            </td>

            <!-- 👉 Store Zone -->
            <td class="text-start">
              {{ product.zoneName }}
            </td>
        
            <!-- 👉 Store Area -->
            <td
              v-if="checkConfigUser(nameUser)"
              class="text-start"
            >
              {{ (product.areaName) }}
            </td>
            

            <!-- 👉 Sub Store Area -->
            <td
              v-if="checkConfigUser(nameUser)"
              class="text-start"
            >
              {{ (product.subAreaName) }}
            </td>

            <!-- 👉 barcodeQtyBefor -->
            <td
              class="text-start"
              style="width: 5rem;"
            >
              {{ product.barcode }}
            </td>

            <!-- 👉 Last Date Edit -->
            <td class="text-start">
              {{ formatDateTime(product.lastUpdate) }}
            </td>

            <!-- 👉 Actions -->
            <td
              style="width: 8rem;"
              class="text-center"
            >
              <VIcon
                color="orange"
                icon="mdi-square-edit-outline"
                @click="startEdit(product.catId,product.category,product.typeId,product.typeName,product.subTypeId,product.subTypeName)"
              />
              <RouterLink
                :to="{ 
                  name: 'inventory-stockUpdateByProduct-view-id', 
                  params: { id: index }, 
                  query: { productId: product.productId ,UnitId: product.unitId,warehouseStock: searchByWareHouseId }, 
                }"
              >
                <VIcon icon="mdi-printer-outline" />
              </RouterLink>
              <VIcon
                color="red"
                icon="mdi-trash-can-outline"
                @click="startDelete(product.catId,product.category,product.typeId,product.typeName,product.subTypeId,product.subTypeName)"
              />
              <!-- MoreBtn component with menu list and item props -->
              <!--   <MoreBtn :menu-list="computedMoreListP(item.No)" item-props /> -->
            </td>
          </tr>
        </tbody>
      </VTable>

      <VDivider />

      <VCardText class="container">
        <VRow>
          <VCol
            cols="12"
            sm="6"
            lg="6"
          >
            <div class="left">
              <div style="margin-bottom: 10px;">
                <span
                  class="text-red"
                  style="font-weight: 800;"
                >{{ $t('Remask:') }}</span><br>
                <span><VIcon
                  icon="mdi-asterisk"
                  color="green"
                />{{ $t('Green Asterisk = Default Admission Area') }}</span><br>
                <span><VIcon
                  icon="mdi-asterisk"
                  color="red"
                />{{ $t('Green Asterisk = Storage Space For Delivery inventoryList') }}</span><br>
              </div>
            </div>
          </VCol>
          <VCol
            cols="12"
            sm="6"
            lg="6"
            class="right d-flex align-center"
          >
            <div>
              <VRow>
                <VCol
                  cols="12"
                  lg="3"
                  class="right d-flex align-center"
                >
                  <div
                    class="right d-flex align-center"
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
                </VCol>
                <VCol
                  cols="12"
                  lg="9"
                >
                  <div class="right d-flex align-center">
                    <VRow>
                      <VCol
                        cols="4"
                        lg="3"
                        class="right d-flex align-center"
                      >
                        <h6 class="text-sm font-weight-regular">
                          {{ paginationData }}
                        </h6>
                      </VCol>
                      <VCol
                        cols="8"
                        lg="9"
                      >
                        <VPagination
                          v-model="currentPage"
                          :length="totalPage"
                          :total-visible="$vuetify.display.mdAndUp ? 7 : 3"
                          @next="selectedRows = []"
                          @prev="selectedRows = []"
                        />
                      </VCol>
                    </VRow>
                  </div>
                </VCol>
              </VRow>
            </div>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Card -->
    <div v-if="appView">
      <div class="d-flex flex-row flex-wrap justify-center">
        <VRow>
          <VCol
            v-for="(product, index) in inventoryList"
            :key="index"
            cols="md-3"
          >
            <VCard
              :loading="loading"
              class="mx-auto my-12"
              max-width="374"
            >
              <template #loader="{ isActive }">
                <VProgressLinear
                  :active="isActive"
                  color="deep-purple"
                  height="4"
                  indeterminate
                />
              </template>

              <VImg
                v-if="product.img"
                cover
                height="250"
                :src="product.img"
              />
              <VImg
                cover
                height="250"
                :src="imgWarehouse"
              />

              <VCardItem>
                <VCardTitle>{{ product.productName }}</VCardTitle>

                <VCardSubtitle>
                  <span class="">Local Favorite</span>
                </VCardSubtitle>
              </VCardItem>

              <VCardText>
                <div>{{ $t('Product Code') }}: {{ product.productId }}</div>
                <div>
                  <span v-if="product.color">{{ $t('Color') }}: {{ product.color }}</span>
                  <span v-if="product.size">{{ $t('Size') }}: {{ product.size }}</span>
                  <span v-if="product.unitName">{{ $t('Counting Unit') }}: {{ product.unitName }}</span>
                </div>
              </VCardText>

              <VDivider class="mx-4 mb-1" />

              <VCardTitle>{{ product.barcode }}</VCardTitle>
            </VCard>
          </VCol>
        </VRow>
      </div>
      <VCard>
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
    </div>
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

/* Css For footer Table  */
.container {
  display: flex;
  align-content: center;
  justify-content: space-between; /* จัดการให้ div ใน container มีช่องว่างสองข้างของ container */
}

.left {
  display: flex;
  align-content: center;
  justify-content: flex-start; /* จัดการให้ div ซ้ายมีช่องว่างไว้ทางขวา */
}

.right {
  display: flex;
  align-content: center;
  justify-content: flex-end; /* จัดการให้ div ขวามีช่องว่างไว้ทางซ้าย */
}
</style>

