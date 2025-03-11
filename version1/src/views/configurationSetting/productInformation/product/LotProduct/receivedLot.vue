<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { ref, watchEffect } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api'

const whereHouse = localStorage.getItem('whereHouseName')
const whereHouseSelectedItem = ref(whereHouse)
const products = ref([])

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
const searchByCategoryId = ref(null)
const searchByTypeId = ref(null)
const searchBySubTypeId = ref(null)
const searchByBarcode = ref(null)
const searchByProductId = ref(null)
const searchByProductName = ref(null)
const searchByUOMId = ref(null)
const searchByWareHouseId = ref([whereHouse])

const searchByZoneId = ref(['All'])
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
const searchByZoneName = ref(null)
const searchByAreaName = ref(null)
const searchBySubAreaName = ref(null)
const searchByUnitName = ref(null)
const searchByColorName = ref(null)
const searchBySizeName = ref(null)

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
const groupItemsSearchById = ref([])
const subGroupItemsSearchById = ref([])

const areaItemsSearchById = ref([])
const subAreaItemsSearchById = ref([])

//----------------------  SortBy Variable  -------------------------------------
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

//--------------------------------------------------------------------------------



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

watch(GetStockUpdate)

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

//-------------------------------------  Formed Td ------------------------
const formattedProductName = productName => {
  if (productName !== undefined && productName !== null) {
    // console.log("productName: ",productName)
    
    return productName.replace(/((.{26})(\/|\s|$))/g, "$1\n")
  }
  
  return 'Non'
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

//-------------------------------- Print Barcode --------------------------------

//----------------------------- Dialog --------------------------------------------
const isDialogPrintBarcodeVisible = ref(false)


const checkboxOne = ref(true)
const checkboxTwo = ref(false)

const slider = ref(40)

//--------------------- check lot ------------------------------
const checkLot = ref(true)

const colorBtnManufacturingLot = ref('warning')
const variaintBtnManufacturingLot = ref('flat')
const colorBtnReceivedLot = ref('grey')
const variaintBtnReceivedLot = ref('outlined')

const changeBtnCheckLot = () => {
  if(checkLot.value){
    colorBtnManufacturingLot.value = 'grey'
    variaintBtnManufacturingLot.value = 'outlined'

    colorBtnReceivedLot.value = 'warning'
    variaintBtnReceivedLot.value = 'flat'
  } else {
    colorBtnManufacturingLot.value = 'warning'
    variaintBtnManufacturingLot.value = 'flat'

    colorBtnReceivedLot.value = 'grey'
    variaintBtnReceivedLot.value = 'outlined'
  }
}

watch(changeBtnCheckLot)
</script>

<template>
  <!-- ----------------        Label Page | Back           ------------------------------------ -->
  <section>
    <!-- Tag page back / Search / Btn -->
    <VRow>
      <VCol
        col="12"
        sm="3"
        md="2"
        lg="4"
      >
        <RouterLink :to="{ name: 'configurationSetting-productInformation-product-lot' }">
          <IconBtn>
            <VIcon
              icon="
                mdi-chevron-left"
            />
          </IconBtn>
        </RouterLink>
        {{ $t("Product Lot Registration List") }}
      </VCol>
      <VCol
        cols="12"
        sm="9"
        md="10"
        lg="8"
        class="d-flex justify-end justify-lg-end justify-sm-end"
      >
        <VRow>
          <!-- Search Bar -->
          <VCol
            cols="12"
            md="5"
            lg="8"
            class="d-flex justify-center align-center"
          >
            <VTextField
              v-model="SearchData"
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
            lg="4"
            class="d-flex justify-end"
          >
            <VRow>
              <!-- Btn Add / Btn Print Barcode -->
              <VCol
                cols="12"
                sm="8"
                lg="12"
                class="d-flex align-center"
              >
                <VRow style="justify-content: end;">
                  <!-- Btn Add -->
                  <VCol
                    sm="4"
                    cols="3"
                  >
                    <!-- Btn Add -->
                    <VBtn
                      class="red--text mx-2"
                      color="primary"
                      prepend-icon="mdi-plus"
                      style="width: 100%;"
                      @click="isDialogCreatedTheLotAccordingToThePOVisible = true"
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
                      <span class="text-white">{{ $t('Print') }}</span>
                    </VBtn>
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          </VCol> 
        </VRow>
      </VCol>
    </VRow>
    <!-- Tag page back / Search / Btn -->
    <VRow />
  </section>

  <!-- Btn Lot Data Created / Btn Lot Import -->
  <section>
    <VRow>
      <VCol
        cols="12"
        lg="3"
      >
        <VBtn
          class="d-flex justify-center"
          :color="colorBtnManufacturingLot"
          :variant="variaintBtnManufacturingLot"
          :to="{name: 'configurationSetting-productInformation-product-LotProduct-manufacturingLot'}"
        >
          {{ $t('Manufacturing Lot Information') }}
        </VBtn>
      </VCol>
      <VCol
        cols="12"
        lg="3"
      >
        <VBtn
          class="d-flex justify-center"
          :color="colorBtnReceivedLot"
          :variant="variaintBtnReceivedLot"
          :to="{name: 'configurationSetting-productInformation-product-LotProduct-receivedLot'}"
        >
          {{ $t('Received Lot Information') }}
        </VBtn>
      </VCol>
    </VRow>
  </section>

  <!-- Dialog -->
  <section>
    <VDialog
      v-model="isDialogPrintBarcodeVisible"
      max-width="450"
    >
      <!-- Dialog Content -->
      <VCard :title="$t('Print Barcode')">
        <DialogCloseBtn
          variant="text"
          size="small"
          @click="isDialogPrintBarcodeVisible = false"
        />

        <VCardText>
          <VRow>
            <!-- Number Print Barcode -->
            <VCol cols="12">
              <div class="mx-10 d-flex justify-start align-center">
                <span>{{ $t('Number Of Prints/Bar Codes') }}:</span> 
                <VTextField
                  v-model="slider"
                  density="compact"
                  class="mx-3"
                  type="number"
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
                v-model="checkboxOne"
                class="mx-16"
                :label="$t('Barcode')"
              />

              <VCheckbox
                v-model="checkboxTwo"
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
            Close
          </VBtn>
          <VBtn
            variant="flat"
            color="success"
            @click="isDialogPrintBarcodeVisible = false"
          >
            Save
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </section>

  <!-- Received Lot -->
  <section v-if="checkLot">
    <VCard class=" mt-6">
      <VCardText>
        <VRow>
          <!-- Barcode / Product Cat -->
          <VCol
            cols="12"
            lg="4"
          >
            <VRow>
              <VCol cols="12">
                <VTextField :label="$t('Barcode')" />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12">
                <VSelect :label="$t('Product Categories')" />
              </VCol>
            </VRow>
          </VCol>
          <!-- Product Code / Sec Product Cat -->
          <VCol
            cols="12"
            lg="4"
          >
            <VRow>
              <VCol cols="12">
                <VTextField :label="$t('Product Code')" />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12">
                <VSelect :label="$t('Second Product Categories')" />
              </VCol>
            </VRow>
          </VCol>
          <!-- Product Name / Sub Product Cat -->
          <VCol
            cols="12"
            lg="3"
          >
            <VRow>
              <VCol cols="12">
                <VTextField :label="$t('Product Name')" />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12">
                <VSelect :label="$t('Sub Product Categories')" />
              </VCol>
            </VRow>
          </VCol>
          <!-- Btn -->
          <VCol
            cols="12"
            lg="1"
          >
            <VBtn
              class="pa-4"
              style="width: 100%; height: 100%;"
            >
              {{ $t('Search') }}
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
    <VCard />

    <!-- Table -->
    <VCard class="mt-6">
      <VDivider />

      <VCardText>
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
                class="text-end"
              >
                {{ $t('Lot/Batch') }}
              </th>
              <th
                scope="row"
                class="text-end"
              >
                {{ $t('Production Date/Receipt Date') }}
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
                              :label="$t('Production Date/Receipt Date')"
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
                class="text-end"
              >
                {{ $t('Expiry Date') }}
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
                              :label="$t('Expiry Date')"
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
                class="text-center"
              >
                {{ $t('Remaining (Days)') }}
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
                              :label="$t('Remaining (Days)')"
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
                {{ $t('Purchase Order Number') }}
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
                              :label="$t('Purchase Order Number')"
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
                class="text-end"
              >
                {{ $t('Product Code') }}
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
                              :label="$t('Product Code')"
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
                {{ $t('Product Name') }}
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
                              :label="$t('Product Name')"
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
                class="text-center"
              >
                {{ $t('Counting Unit') }}
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
                              :label="$t('Counting Unit')"
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
                {{ $t('Product Categories') }}
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
                              :label="$t('Product Categories')"
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
                {{ $t('Second Product Categories') }}
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
                              :label="$t('Second Product Categories')"
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
                {{ $t('Sub Product Categories') }}
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
                              :label="$t('Sub Product Categories')"
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
                {{ $t('Received Number') }}
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
                              :label="$t('Sub Product Categories')"
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
                class="text-end"
              >
                {{ $t('Date Received') }}
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
                              :label="$t('Sub Product Categories')"
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
                class="text-center"
              >
                {{ $t('Change lot') }}
              </th>
            </tr>
          </thead>
        
          <!-- 👉 table body -->
          <tbody>
            <tr
              v-for="(product, index) in products"
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
                <!-- 👉 Ordinal Number -->
              </td>
            
              <td class="text-center">
                {{ index+1 }}
              </td>

              <!-- 👉 Image -->
              <td class="text-center">
                <VImg
                  v-if="product.image"
                  :width="100"
                  :height="100"
                  aspect-ratio="16/9"
                  cover
                  :src="product.image"
                />
              </td>

              <!-- 👉 Product code -->
              <td class="text-center">
                {{ product.productId }}
              </td>
              <!-- 👉 Product code -->
              <td class="text-center">
                {{ product.productId }}
              </td>

              <!-- 👉 Product code -->
              <td class="text-center">
                {{ product.productId }}
              </td>

              <!-- 👉 Barcode -->
              <td class="text-center">
                {{ product.barcode }}
              </td>

              <!-- 👉 Product Name -->
              <td style="overflow-wrap: break-word; white-space: pre-line;  word-wrap: break-word;">
                {{ formattedProductName(product.productName) }}
              </td>

              <!-- 👉 Product categories -->
              <td class="text-start">
                {{ product.categoryName }}
              </td>

              <!-- 👉 Secondary product categories -->
              <td class="text-start">
                {{ product.typeName }}
              </td>

              <!-- 👉 Sub product categories -->
              <td class="text-start">
                {{ product.subTypeName }}
              </td>
        
              <!-- 👉 Number(Tag) -->
              <td
                v-if="checkConfigUser(nameUser)"
                class="text-center"
              >
                {{ formatDecimal(product.tags) }}
              </td>
            

              <!-- 👉 Number(Non-Tag) -->
              <td
                v-if="checkConfigUser(nameUser)"
                class="text-center"
              >
                {{ formatDecimal(product.nonTags) }}
              </td>

              <!-- 👉 Counting unit -->
              <td
                class="text-start"
                style="width: 5rem;"
              >
                {{ product.unitName }}
              </td>

              <!-- 👉 Total quantity of products -->
              <td class="text-center">
                {{ formatDecimal(product.qty) }}
              </td>

              <!-- 👉 Actions -->
              <td
                style="width: 8rem;"
                class="text-center"
              >
                <RouterLink
                  :to="{ 
                    name: 'inventory-stockUpdateByProduct-view-id', 
                    params: { id: index }, 
                    query: { productId: product.productId ,UnitId: product.unitId,warehouseStock: searchByWareHouseId }, 
                  }"
                >
                  <VIcon icon="mdi-printer-outline" />
                </RouterLink>
                <RouterLink
                  :to="{ 
                    name: 'inventory-stockUpdateByProduct-view-id', 
                    params: { id: index }, 
                    query: { productId: product.productId ,UnitId: product.unitId,warehouseStock: searchByWareHouseId }, 
                  }"
                >
                  <VIcon
                    color="red"
                    icon="mdi-trash-can-outline"
                  />
                </RouterLink>
              
                <!-- MoreBtn component with menu list and item props -->
                <!--   <MoreBtn :menu-list="computedMoreListP(item.No)" item-props /> -->
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
</style>

