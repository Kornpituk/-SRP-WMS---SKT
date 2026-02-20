<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { onMounted, ref, watchEffect } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api'  //---------------------- Import Api for Url *****

import { useToast } from "vue-toastification" //---------------- Import Toast alert

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

const totalPage = computed(() => {
  return Math.ceil(totalCount.value / rowPerPage.value)
})

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

const GetStockUpdate = async () => {

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
      'sortByProductId': sortByProductId.value || 'asc',
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

      products.value = response.data.items.map((item, index) => {
        return {
          ...item,
          noItem: (response.data.page - 1) * response.data.perPage + index + 1,
        }
      })

      totalCount.value = response.data.totalCount
      currentPage.value = response.data.page

      rowPerPage.value = response.data.perPage
      
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

// ใช้ watchDebounced สำหรับ search fields
watchDebounced(
  [
    searchByCategoryName,
    searchByTypeName,
    searchBySubTypeName,
    searchByBarcodeName,
    searchByProductCodeName,
    searchByProductNameFilter,
    searchByUnitName,
    searchByBarcode,
    searchByProductId,
    searchByProductName,
    serialProductCode,
  ],
  () => {
    // Reset to page 1 when search criteria changes
    currentPage.value = 1
    GetStockUpdate()
  },
  { debounce: 800, maxWait: 1500 }, // รอ 800ms หลังจากหยุดพิมพ์
)

// Watch สำหรับ dropdown selections (ไม่ต้อง debounce)
watch(
  [
    searchByCategoryId,
    searchByTypeId,
    searchBySubTypeId,
    searchByUOMId,
    searchByZoneId,
    searchByAreaId,
    searchBySubAreaId,
  ],
  () => {
    currentPage.value = 1
    GetStockUpdate()
  },
)

// เปลี่ยนจาก watchEffect เป็น watch specific values
watch([currentPage, rowPerPage], () => {
  GetStockUpdate()
})

onMounted(() => {
  GetStockUpdate()
})

//--------------------------------------- Function Pagination --------------------------------------------
// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value

  if (currentPage.value < 1)
    currentPage.value = 1
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  if (!products.value.length) return '0'

  const firstIndex = (currentPage.value - 1) * rowPerPage.value + 1
  const lastIndex = firstIndex + products.value.length - 1

  return `${firstIndex}-${lastIndex} of ${totalCount.value}`
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

// ✅ ควรเป็น
onMounted(() => {
  fetchItemsWareHouse()
})

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

// ✅ ควรเป็น
onMounted(() => {
  getItemsProductUnit()
})

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

// ✅ ควรเป็น
onMounted(() => {
  getItemsProductType()
})

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

// ✅ ควรเป็น
onMounted(() => {
  getItemsProductSubType()
})

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

// ✅ ควรเป็น
onMounted(() => {
  getItemLocalZone()
})

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

// ✅ ควรเป็น
onMounted(() => {
  getItemLocalArea()
})

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

// ✅ ควรเป็น
onMounted(() => {
  getItemLocalSubArea()
})

// -------------------------------------- Export Bar Excel - --------------------------------

const stockUpdateExcel = () => {
  const toast = useToast()

  toast.info("Exporting Excel...", { timeout: 1000 })

  axiosIns.post(`${urlApi.value}/api/v1/StockUpdate/Excel`, {}, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
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
      'sortByProductId': sortByProductId.value || 'asc',
      'sortByProductName': sortByProductName.value,
      'sortByUnit': sortByUnit.value,
      'sortByQty': sortByQty.value,
      'sortByTags': sortByTags.value,
      'sortByNonTags': sortByNonTags.value,

      // ... and so on with other parameters
    },
    responseType: 'blob',
  })
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]))

      const currentDate = new Date()
      const year = currentDate.getFullYear()
      const threshold = 2500
      const fileYear = year > threshold ? year - 543 : year

      const dateString = currentDate.toISOString().slice(0, 10).replace(/-/g, '').replace(year.toString(), fileYear.toString())
      const fileName = `stock_update_Tag_${dateString}.xlsx`

      const link = document.createElement('a')

      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()

      window.URL.revokeObjectURL(url)

      // ✅ แจ้งผู้ใช้ว่าโหลดสำเร็จ
      toast.success("Export successful!")
    })
    .catch(error => {
      console.error('Error:', error)
      toast.error("Export failed. Please try again.")
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

const codeProduct = ref('')
const nameProduct = ref('')
const imgProduct = ref('')
const barcodeProduct = ref('')
const categoriesProduct = ref('')
const groupProduct = ref('')
const groupSupProduct = ref('')
const totalProduct = ref('')
const unitNameProduct = ref('')
const detailsProduct = ref()

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
  console.log('showImageFunction!!', details)
}

const showExpansionDialog = ref(false)
</script>

<template>
  <!-- Title Page -->
  <div v-if="false">
    <VCard>
      <VCardTitle
        style="background-color: #ffd66b;"
        class=" d-flex justify-space-between"
      >
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
            {{ $t('Stock Update') }}
          </h3>
        </div>
      </VCardTitle>
    </VCard>
  </div>
  <div>
    <VCard
      height="40px"
      class="bg-primary"
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
            {{ $t('Stock Update') }}
          </h4>
        </div>
      </VCardTitle>
    </VCard>
  </div>
  <!-- ----------           Search bar                                   ------------------------------------ -->
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
                  v-model="searchByZoneId"
                  :label="$t('Store Zone')"
                  :items="zoneItemsSearchById"
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
                class="py-1"
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

            <!-- product categories | Group | Sub Group | Counting unit -->
            <VRow>
              <!-- 👉 Select  product categories  -->
              <VCol
                cols="12"
                lg="3"
                sm="6"
                class="py-1"
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
                class="py-1"
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
                class="py-1"
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
                v-if="false"
                cols="12"
                lg="3"
                sm="6"
                class="py-1"
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

              <!-- 👉 Select Counting unit -->
              <VCol
                v-if="true"
                cols="12"
                lg="3"
                sm="6"
                class="py-1"
              >
                <section>
                  <VTextField
                    v-model="serialProductCode"
                    :label="$t('Serial')"
                    density="compact"
                  />
                </section>
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
                        size="20px"
                      />
                      {{ $t('Search') }}
                    </VBtn>
                    <VBtn
                      size="x-large"
                      color="red"
                      style="width: 100%; height: 40px;"
                      @click="clearModel"
                    >
                      <VIcon
                        v-if="false"
                        icon="ri-filter-off-fill"
                        size="20px"
                      />
                      {{ $t('Clear') }}
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
                      style="width: 100%; height: 40px;"
                      @click="stockUpdateExcel"
                    >
                      <img
                        src="/src/assets/images/icons/vscode-icons_file-type-excel2.png"
                        style="width: 27px;"
                        class="custom-small-img"
                      >
                      <span style="font-size: 18px;">{{ $t('Export file') }}</span>
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
                }} :</span>{{ detailsProduct?.note }}
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
                v-if="false"
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
                v-if="false"
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
                v-if="false"
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
              class="text-center px-1"
            >
              {{ $t('Barcode') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-if="false"
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
                v-if="false"
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
                v-if="false"
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
              v-if="false"
              scope="row"
              class="text-start"
            >
              {{ $t('Serial') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByTags')"
              />
            </th>
            <th
              v-if="checkRFID"
              scope="row"
              class="text-end px-1"
            >
              TAG QTY.
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByTags')"
              />
            </th>
            <th
              v-if="checkRFID"
              scope="row"
              class="text-end px-1"
            >
              NON-TAG QTY.
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByNonTags')"
              />
            </th>
            <th
              scope="row"
              class="text-end px-1"
            >
              {{ $t('TOTAL QTY.') }} 
              <!-- ----------------------------- Icon Search By --------------------- -->
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
              {{ $t('Counting Unit') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-if="false"
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
              class="text-center px-1"
            >
              Action
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
            <td
              v-if="false"
              class="text-center px-1"
            >
              {{ (currentPage - 1) * rowPerPage + index + 1 }}
            </td>

            <td
              v-if="true"
              class="text-center px-1"
            >
              {{ product.noItem }}
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
                      product.image,
                      product.barcode,
                      product.categoryName,
                      product.typeName,
                      product.subTypeName,
                      product.qty,
                      product.unitName,
                      product,
                      
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
                        product.image,
                        product.barcode,
                        product.categoryName,
                        product.typeName,
                        product.subTypeName,
                        product.qty,
                        product.unitName,
                        product,
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
              {{ product.categoryName }}
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
            <td class="text-start px-1">
              <div class="d-flex justify-center align-items-center">
                <VueBarcode
                  v-if="product.barcode"
                  class="text-start"
                  :options="{
                    width: '1%',
                    height: '20%',
                    fontSize: '16px', 
                  }"
                  :value="product.barcode"
                />
              </div>
            </td>

            <!-- 👉 Product code -->
            <td class="text-start px-1">
              {{ product.productId }}
            </td>

            <!-- 👉 Product Name -->
            <td class="text-start px-1">
              {{ (product.productName) }}
            </td>

            <!-- 👉 Tag -->
            <td
              v-if="false"
              class="text-start"
            >
              {{ (product.serial) }}
            </td>

            <!-- 👉 Number(Tag) -->
            <td
              v-if="checkRFID"
              class="text-end px-1"
            >
              {{ (formatDecimal(product.tags)).toLocaleString('en-US') }}
            </td>

            <!-- 👉 Number(Non-Tag) -->
            <td
              v-if="checkRFID"
              class="text-end  px-1"
            >
              {{ (formatDecimal(product.nonTags)).toLocaleString('en-US') }}
            </td>
            <!-- 👉 Total quantity of products -->
            <td class="text-end px-1">
              {{ (formatDecimal(product.qty)).toLocaleString('en-US') }}
            </td>

            <!-- 👉 Counting unit -->
            <td
              class="text-start px-1"
              style="width: 5rem;"
            >
              {{ product.unitName }}
            </td>

            <!-- 👉 Actions -->
            <td
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
</style>

