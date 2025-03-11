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
const cardBtnHistory = ('received')
const menu = ref(false)

//---------------------------------- Dialog --------------------------------
const showExpansionDialog = ref(false)

//------------------------------------ Tabs Details/Header -------------------------------------------
import PoHeader from '../po/header.vue'
import PoDetails from '../po/datails.vue'

const currentTab = ref('Bill')
const itemsSelectDetailsHeader = ['Bill', 'Items']

const getComponent = item => {
  if (item === 'Bill') {
    return PoHeader
  } else if (item === 'Items') {
    return PoDetails
  }
  
  return null
}
</script>

<template>
  <!-- Title Page -->
  <div>
    <VCard
      height="40px"
      class="d-flex align-center bg-green-lighten-1"
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
            {{ $t('Received - PO') }}
          </h4>
        </div>
      </VCardTitle>
    </VCard>
  </div>

  <!-- ----------          New Search bar  Expansion  pannels               ------------------------------------ -->
  <section
    v-if="false"
    class="my-2"
  >
    <VExpansionPanels>
      <VExpansionPanel>
        <VExpansionPanelTitle>
          <template #default="">
            <VRow
              no-gutters
              class="d-flex justify-center"
            >
              <span class="text-h6"><VIcon icon="ri-equalizer-line" />{{ $t('Filter Search') }}</span>
            </VRow>
          </template>
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <VContainer
            fluid
            ma-6
            pa-6
            fill-height
          >
            <VForm @submit.prevent="submitSearchButton">
              <!-- Warehouse  | Storehouse barcode | Store area | Sub Storage area -->

              <VRow>
                <!-- 👉 Select WareHouse -->
                <VCol
                  cols="12"
                  lg="3"
                  sm="6"
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
                    item-value="name"
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
    
              <!-- Barcode | Product code | Product Name | Button Export -->
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

                <!-- 👉 Button Search and Export -->
                <VCol
                  cols="12"
                  xs="4"
                  sm="4"
                  md="3"
                >
                  <VRow>
                    <!-- 👉 Button Search  -->
                    <VCol
                      xs="4"
                      sm="6"
                      cols="6"
                    >
                      <VBtn
                        type="submit"
                        density="compact"
                        size="x-large"
                        class="px-16 px-sm-12 custom-small-btn-search"
                        style="width: 100%; height: 100%;"
                        @click="GetStockUpdate"
                      >
                        <VIcon
                          icon="mdi-magnify"
                          size="20px"
                        />
                        {{ $t('Search') }}
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
                        @click="stockUpdateExcel"
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
                </VCol>
              </VRow>
            </VForm>
          </VContainer> 
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </section>

  <!-- Tab select Details \ Header -->
  <section>
    <VTabs
      v-model="currentTab"
      grow
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

  <!-- Expansion Filter -->
  <section
    v-if="false"
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
          <VContainer
            fluid
            ma-6
            pa-6
            fill-height
          >
            <VForm @submit.prevent="submitSearchButton">
              <!-- Delivery Date | Status -->

              <VRow class="py-0">
                <VCol
                  class="py-0"
                  cols="12"
                  lg="6"
                  sm="6"
                >
                  <VRow>
                    <!-- Delivery Date -->
                    <VCol
                      cols="12"
                      lg="4"
                      class="py-0"
                    >
                      <AppDateTimePicker
                        v-model="dateRangeDelivery"
                        label="Delivery Date"
                        density="compact"
                        placeholder="Select date"
                        :config="{ mode: 'range' }"
                      />
                    </VCol>
                    <!-- P/O Date -->
                    <VCol
                      cols="12"
                      lg="4"
                      class="py-0"
                    >
                      <AppDateTimePicker
                        v-model="dateRangeDelivery"
                        label="PO Date"
                        density="compact"
                        placeholder="Select date"
                        :config="{ mode: 'range' }"
                      />
                    </VCol>
                    <!-- P/O Date -->
                    <VCol
                      cols="12"
                      lg="4"
                      class="py-0"
                    >
                      <VAutocomplete
                        v-model="searchBySubTypeId"
                        :label="$t('Location')"
                        :items="subTypeItemsSearchById"
                        :custom-filter="customFilter"
                        item-title="name"
                        item-value="name"
                        density="compact"
                        clearable
                        clear-icon="mdi-close"
                      />
                    </VCol>
                  </VRow>
                </VCol>

                <VCol
                  cols="12"
                  lg="6"
                  sm="6"
                  class="py-0"
                >
                  <VRow>
                    <VCol
                      cols="12"
                      lg="12"
                      class="py-0"
                    >
                      <VRow>
                        <VCol
                          cols="12"
                          lg="4"
                        >
                          <VBtn
                            color="primary"
                            density="compact"
                            size="x-large"
                            class="px-16 px-sm-12"
                            style="width: 100%; height: 40px;"
                            @click="GetStockUpdate"
                          >
                            <span style="font-size: 16px;">{{ $t('Search') }}</span>
                          </VBtn>
                        </VCol>
                        <VCol
                          cols="12"
                          lg="4"
                        >
                          <VBtn
                            color="error"
                            density="compact"
                            size="x-large"
                            class="px-16 px-sm-12"
                            style="width: 100%; height: 40px;"
                            @click="GetStockUpdate"
                          >
                            <span style="font-size: 16px;">{{ $t('Clear') }}</span>
                          </VBtn>
                        </VCol>
                        <VCol
                          cols="12"
                          lg="4"
                        >
                          <VBtn
                            density="compact"
                            class=" px-16 px-sm-12 pa-sm-1"
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
                  <!-- 👉 Search Description -->
                </VCol>
              </VRow>
            </VForm>
          </VContainer> 
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
                      :text="statusProduct"
                      :color="resolveChipColor(statusProduct)"
                      size="x-small"
                      variant="elevated"
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

  <!-- ----------            Table                                  ------------------------------------ -->
  <section v-if="false">
    <VCard
      v-if="true"
      class="mt-6"
    >
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
              {{ $t('Status') }}
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
              {{ $t('Received No.') }}
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
                            :label="$t('Received No.')"
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
              {{ $t('Received date') }}
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
                            :label="$t('Received date')"
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
              {{ $t('Location') }}
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
                            :label="$t('Location')"
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
              class="text-start px-1"
            >
              {{ $t('Ref. Doc.') }}
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
                            :label="$t('Ref. Doc.')"
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
              {{ $t('PO No.') }}
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
                            :label="$t('PO No.')"
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
              {{ $t('PO Date') }}
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
                            :label="$t('PO Date')"
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
              {{ $t('Total') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByTags')"
              />
            </th>
            <th
              v-if="checkConfigUser(nameUser)"
              scope="row"
              class="text-end px-1"
            >
              {{ $t('Supplier ID.') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
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
                            :label="$t('Supplier ID.')"
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
              {{ $t('Supplier Name') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
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
                            :label="$t('Supplier Name')"
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
              {{ $t('Delivered Date') }}
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
                            :label="$t('Delivered Date')"
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
              {{ $t('Remark') }}
            </th>
          </tr>
        </thead>
        
        <!-- 👉 table body -->
        <tbody>
          <tr
            v-for="(product, index) in mockData"
            :key="index"
          >
            <!-- 👉 Ordinal Number -->
            <td
              :class="resolveChipColorTable(product.status)"
              class="text-center px-1"
            >
              {{ index+1 }}
            </td>

            <!-- 👉 Image -->
            <td
              :class="resolveChipColorTable(product.status)"
              class="text-center px-1"
            >
              <span :class="resolveTextColorTable(product.status )"><strong>{{ product.status }}</strong></span>
            </td>

            <!-- 👉 Image -->
            <td
              :class="resolveChipColorTable(product.status)"
              class="text-center px-1"
            >
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
                      product.productCode,
                      product.productName,
                      product.color,
                      product.size,
                      product.status,
                      product.image,
                      product.barcode,
                      product.categories,
                      product.group,
                      product.groupSup,
                      product.total,
                      product.unitName,
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
                        product.productCode,
                        product.productName,
                        product.color,
                        product.size,
                        product.status,
                        product.image,
                        product.barcode,
                        product.categories,
                        product.group,
                        product.groupSup,
                        product.total,
                        product.unitName,
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
            <td
              :class="resolveChipColorTable(product.status)"
              class="text-start px-1"
            >
              {{ product.receivedNo }}
            </td>

            <!-- 👉 Secondary product categories -->
            <td
              :class="resolveChipColorTable(product.status)"
              class="text-start px-1"
            >
              {{ product.receivedDate }}
            </td>

            <!-- 👉 Sub product categories -->
            <td
              :class="resolveChipColorTable(product.status)"
              class="text-start px-1"
            >
              {{ product.location }}
            </td>

            <!-- 👉 Barcode -->
            <td
              :class="resolveChipColorTable(product.status)"
              class="text-start px-1"
            >
              {{ product.refDoc }}
            </td>

            <!-- 👉 Product code -->
            <td
              :class="resolveChipColorTable(product.status)"
              class="text-start px-1"
            >
              {{ product.refDoc }}
            </td>

            <!-- 👉 Product Name -->
            <td
              :class="resolveChipColorTable(product.status)"
              class="text-start px-1"
            >
              {{ (product.poNo) }}
            </td>

            <!-- 👉 Number(Tag) -->
            <td
              :class="resolveChipColorTable(product.status)"
              class="text-end  px-1"
            >
              {{ formatDecimal(product.total) }}
            </td>

            <!-- 👉 Number(Non-Tag) -->
            <td
              :class="resolveChipColorTable(product.status)"
              class="text-end  px-1"
            >
              {{ (product.supplierId) }}
            </td>
            <!-- 👉 Total quantity of products -->
            <td
              :class="resolveChipColorTable(product.status)"
              class="text-end  px-1"
            >
              {{ (product.supplierName) }}
            </td>

            <!-- 👉 Counting unit -->
            <td
              :class="resolveChipColorTable(product.status)"
              class="text-start  px-1"
              style="width: 5rem;"
            >
              {{ product.deliveredDate }}
            </td>

            <!-- 👉 Actions -->
            <td
              :class="resolveChipColorTable(product.status)"
              style="width: 8rem;"
              class="text-center px-1"
            >
              {{ product.remark }}
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

.cell-hover-effect:hover {
  background-color: #e9fae9 !important; /* สีเขียวอ่อน */
}

.card-image-hover:hover {
  transform: scale(1.1); /* ทำให้ขยายใหญ่ขึ้นเมื่อ hover */
}
</style>

