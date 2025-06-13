<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  date: {
    type: String,
    required: true,
  },
})

const route = useRoute()

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api' //---------------------- Import Api for Url *****

//------------------------ Get Where House Name From LocalStorage and define to whereHouseSelectedItem ---------------------------
const whereHouse = localStorage.getItem('whereHouseName')
const whereHouseSelectedItem = ref(whereHouse)
const startDate = ref(route.query.dateStart)
const endDate = ref(route.query.dateEnd)

watchEffect(() => {
  console.log('startDate:****', startDate.value)
  console.log('endDate:****', endDate.value)
})


const products = ref([]) //---------------- variable for get All Product From X-Location(Where House) *****

// Get access token from localStorage in another page
const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')

const perPage = ref(10)
const page = ref(0)
const totalCount = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)

const currentDate = new Date()
const formattedDate = `${currentDate.getFullYear()}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}`

//------------------- Model ID For search ------------------------------------
const stockIdData = ref(whereHouse)
const dateStData = ref('2024/01/01')
const dateSpData = ref(formattedDate)
const barcodeData = ref(null)
const productIdData = ref(null)
const productNameData = ref(null)

const categoryIdData = ref(null)
const typeIdData = ref(null)
const subTypeIdData = ref(null)

const categoryNameData = ref(null)
const typeNameData = ref(null)
const subTypeNameData = ref(null)

const pickingGoodsDateData = ref(null)
const requestDateData = ref(null)
const deliveryDateData = ref(null)

const issueNoData = ref(null)
const refNoData = ref(null)
const remarkData = ref(null)
const reasonData = ref(null)
const issueByData = ref(null)
const issueDateData = ref(null)
const uomData = ref(null)
const lotData = ref(null)

const sortByColIssueDate = ref(null)
const requestNoData = ref(null)
const requestWarehouseData = ref(null)
const customerNameData = ref(null)
const remarkRequestData = ref(null)
const reasonRequestData = ref(null)
const pickingByData = ref(null)

const sortByColIssueDateData = ref(null)
const sortByColQtyData = ref(null)
const sortByColLocationData = ref(null)
const sortByColQtyRequestData = ref(null)
const sortByColQtyPickingData = ref(null)

const searchByCategoryId = ref(null)
const searchByTypeId = ref(null)
const searchBySubTypeId = ref(null)
const searchByBarcode = ref(null)
const searchByProductId = ref(null)
const searchByProductName = ref(null)
const searchByUOMId = ref(null)
const searchByLotId = ref(null)

const searchByWareHouseId = ref([whereHouse])

const searchByZoneId = ref([])
const searchByAreaId = ref([])
const searchBySubAreaId = ref([])

//------------------------ Model Name for search ------------------------------


//----- Search Filter Icon Header Table[Product Category, Group, Sub Group, Barcode, Product Category Code, Product Name]
const menuCategory= ref( false)
const menuGroup = ref( false)
const menuSubGroup = ref( false)
const menuBarcode = ref( false)
const menuProductCode = ref( false)
const menuProductReceivedNo = ref( false)
const menuProductName = ref( false)

const menuPickingGoodsNo = ref(false)
const menuRequestNo = ref(false)
const menuRequestWarehouse = ref(false)
const menuCustomerName = ref(false)
const menuRemarkRequest = ref(false)
const menuReasonRequest = ref(false)
const menuPickingBy = ref(false)
const menuUoM = ref(false)
const menuLot = ref(false)

const menuIssueNo = ref(false)
const menuRefNo = ref(false)
const menuRemark = ref(false)
const menuReason = ref(false)
const menuIssueBy = ref(false)
const menuIssueDate = ref(false)
const menuUom = ref(false)

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

const sortByReceive = ref('')
const sortByQtyOrder = ref('')

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

//------------------------------- Function Get StockUpdate Auto Search -----------------

// ฟังก์ชันสำหรับการดึงข้อมูลจาก localStorage
const loadFromLocalStorage = key => {
  const data = localStorage.getItem(key)
  
  return data ? JSON.parse(data) : []
}

const partialReceiveNos = ref([])
const completeReceiveNos = ref([])

onMounted(() => {
  // ดึงข้อมูลจาก localStorage
  partialReceiveNos.value = loadFromLocalStorage('partialReceiveNos')
  completeReceiveNos.value = loadFromLocalStorage('completeReceiveNos')

  console.log('Partial ReceiveNos:', partialReceiveNos.value)
  console.log('Complete ReceiveNos:', completeReceiveNos.value)
})

const resolveChipColor = status => {
  if (status === "รับครบ") return "success"
  if (status === "Partially Received") return "info"
  if (status === "Pending") return "error"
  if (status === "รับเข้าบางส่วน") return "warning"
}

const resolveChipColorTable = status => {
  if (status === "รับครบ") return "bg-green-lighten-5"
  if (status === "Partially Received") return "bg-blue-lighten-5"
  if (status === "Pending") return "bg-red-lighten-5"
  if (status === "รับเข้าบางส่วน") return "bg-orange-lighten-5"
}

const resolveTextColorTable = status => {
  if (status === "รับครบ") return "text-green"
  if (status === "Partially Received") return "text-blue"
  if (status === "Pending") return "text-red"
  if (status === "รับเข้าบางส่วน") return "text-orange"
}

// ฟังก์ชันตรวจสอบ receiveNo
const checkReceiveNos = receivedPO => {
  for (const receiveNo of partialReceiveNos.value) {
    if (receiveNo === receivedPO) {
      return "รับเข้าบางส่วน"
    }
  }

  for (const receiveNo of completeReceiveNos.value) {
    if (receiveNo === receivedPO) {
      return "รับครบ"
    }
  }

  return false
}

const GetReceivedPoDetails = () => {

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.get(`${urlApi.value}/api/v1/Dashboard/Performance/PickingDelivery/Detail?page=`+currentPage.value+`&perPage=`+rowPerPage.value, {
    headers: {
      'accept': '*/*',
      'x-location': `${searchByWareHouseId.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
    params: {
      // stockId: stockIdData.value,
      // dateSt: dateStData.value,
      // dateSp: dateSpData.value,
      stockId: stockIdData.value,
      dateSt: props.date,
      dateSp: props.date,

      issueDate: issueDateData.value,

      issueNo: issueNoData.value,
      refNo: refNoData.value,
      remark: remarkData.value,
      reason: reasonData.value,
      issueBy: issueByData.value,
     
      uom: uomData.value,
      Lot: lotData.value,

      barcode: barcodeData.value,
      productId: productIdData.value,
      productName: productNameData.value,

      categoryId: categoryIdData.value,
      typeId: typeIdData.value,
      subTypeId: subTypeIdData.value,

      Category: categoryNameData.value,
      TypeName: typeNameData.value,
      SubTypeName: subTypeNameData.value,

      sortByColIssueDate: sortByColIssueDateData.value,
      sortByColQty: sortByColQtyData.value,
      sortByColLocation: sortByColLocationData.value,
    },
  }, {})
    .then(response => {

      products.value = response.data.items
      totalCount.value = response.data.totalCount

      // currentPage.value = response.data.page
      totalPage.value = response.data.totalPages

      // rowPerPage.value = response.data.perPage

      console.log('[products.value.RecPODetails]!!: ', products.value)

      // console.log('Warehouse At StockUpdate :', whereHouseSelectedItem.value)

      // ตรวจสอบข้อมูล receiveNo ในเพจนี้กับข้อมูลใน partialReceiveNos และ completeReceiveNos
      const checkReceiveNos = currentPageReceiveNos => {
        const matchedPartial = currentPageReceiveNos.filter(receiveNo => partialReceiveNos.value.includes(receiveNo))
        const matchedComplete = currentPageReceiveNos.filter(receiveNo => completeReceiveNos.value.includes(receiveNo))

        return { matchedPartial, matchedComplete }
      }

      const currentPageReceiveNos = products.value.map(item => item.receiveNo)
      const matchedReceiveNos = checkReceiveNos(currentPageReceiveNos)

      console.log('Matched Partial ReceiveNos:', matchedReceiveNos.matchedPartial)
      console.log('Matched Complete ReceiveNos:', matchedReceiveNos.matchedComplete)
  
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })
}

watch(GetReceivedPoDetails)

//--------------------------------------- Function Pagination --------------------------------------------
// 👉 watching current page
watch(() => {
  if (currentPage.value > totalPage.value && totalPage.value >= 1)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = products.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 1
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

//--------------------------------------- FetchItems for Search Categories ----------------------------------------

const itemsCategories = ref([])

const fetchItemsCategorise = () => {
  axiosIns.get(`${urlApi.value}/api/v1/Product/Categories`, {
    headers: {
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
    .then(response => {

      itemsCategories.value = response.data

      console.log('Categories.value At index', itemsCategories.value)

      
    })
    .catch(error => {
      // Handle errors
      selectError.value = 'Where house not selected!!'
      console.error('Error:', error)
    })

    
}

watch(fetchItemsCategorise)

//--------------------------------------- FetchItems for Search  Type(Group) ----------------------------------------

const itemsType = ref(null)

const getItemsProductType = () => {
  axiosIns.get(`${urlApi.value}/api/v1/Product/Types`, {
    params: {
      'CategoryId': categoryIdData.value,
    },
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
    .then(response => {

      itemsType.value = response.data

      console.log('itemsType.value At index', itemsCategories.value)

      
    })
    .catch(error => {
      // Handle errors
      selectError.value = 'Where house not selected!!'
      console.error('Error:', error)
    })

    
}

watchEffect(getItemsProductType)

//--------------------------------------- FetchItems for Search Sub Type(Sub Group) ----------------------------------------
const subtypeItems = ref(null)

const getItemsProductSubType = () => {
  axiosIns.get(`${urlApi.value}/api/v1/Product/SubTypes/All`, {
    params: {
      'TypeId': typeIdData.value,
    },
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
    .then(response => {

      subtypeItems.value = response.data

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

//------------------------------ fotmate Date Data -----------------------
const formatDate = dateString => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear())
  
  return `${day}/${month}/${year}`
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

//---------------------------------- Check Status -----------------------------------------
const resolveCardDialogTitleColorTable = status => {
  if (status === "Received") return "bg-green"
  if (status === "Partially Received") return "bg-blue"
  if (status === "Pending") return "bg-red"
  if (status === "Partially Pending") return "bg-orange"
}



//--------------------------------------- Menu Filter -------------------------------------------

const dialogHistory = (true)
const cardBtnHistory = ('received')
const menu = ref(false)

//---------------------------------- Dialog --------------------------------
const showExpansionDialog = ref(false)

//------------------------------------ Tabs Details/Header -------------------------------------------
const currentTab = ref('Header')
const itemsSelectDetailsHeader = ['Header', 'Details']
const tabItemText = 'hortbread chocolate bar marshmallow bear claw tiramisu chocolate cookie wafer. Gummies sweet brownie brownie marshmallow chocolate cake pastry. Topping macaroon shortbread liquorice dragée macaroon.'
</script>

<template>
  <!-- Expansion Filter -->
  <section v-if="false">
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
          <VRow class="py-0">
            <!-- Categories -->
            <VCol
              class="py-1"
              cols="12"
              lg="4"
              sm="6"
            >
              <VAutocomplete
                v-model="categoryIdData"
                clearable
                label="Categories"
                density="compact"
                item-title="name"
                item-value="id"
                placeholder="Categories"
                :items="itemsCategories"
              />
            </VCol>
            <!-- Group -->
            <VCol
              class="py-1"
              cols="12"
              lg="4"
              sm="6"
            >
              <VAutocomplete
                v-model="typeIdData"
                clearable
                label="Group"
                density="compact"
                item-title="name"
                item-value="id"
                placeholder="Group"
                :items="itemsType"
              />
            </VCol>
            <!-- Sub Group -->
            <VCol
              class="py-1"
              cols="12"
              lg="4"
              sm="6"
            >
              <VAutocomplete
                v-model="subTypeIdData"
                clearable
                label="Sub Group"
                density="compact"
                item-title="name"
                item-value="id"
                placeholder="Sub Group"
                :items="subtypeItems"
              />
            </VCol>
            <!-- Picking Date -->
            <VCol
              class="py-1"
              cols="12"
              lg="4"
              sm="6"
            >
              <VueDatePicker
                v-model="pickingGoodsDateData"
                :max-date="new Date()"
                :enable-time-picker="false"
                placeholder="Picking Date"
              />
            </VCol>
            <!-- Request Date -->
            <VCol
              class="py-1"
              cols="12"
              lg="4"
              sm="6"
            >
              <VueDatePicker
                v-model="requestDateData"
                :max-date="new Date()"
                :enable-time-picker="false"
                placeholder="Request Date"
              />
            </VCol>
            <!-- Delivery Date -->
            <VCol
              class="py-1"
              cols="12"
              lg="4"
              sm="6"
            >
              <VueDatePicker
                v-model="deliveryDateData"
                :max-date="new Date()"
                :enable-time-picker="false"
                placeholder="Delivery Date"
              />
            </VCol>
            
            <!-- Btn Search -->
            <VCol
              class="py-1"
              cols="12"
              lg="4"
              sm="6"
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
            <!-- Btn Clear -->
            <VCol
              class="py-1"
              cols="12"
              lg="2"
              sm="6"
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
            <!-- Btn Export -->
            <VCol
              class="py-1"
              cols="12"
              lg="2"
              sm="6"
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
  <section>
    <VCard
      v-if="true"
      class=""
    >
      <VCardTitle class="text-center bg-amber">
        <span class="text-white">Picking Delivery Table</span>
      </VCardTitle>

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
                            v-model="categoryNameData"
                            class="mt-4"
                            :label="$t('Categories')"
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
                            @click="categoryNameData = ''"
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
              {{ $t('Group') }}
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
                            v-model="typeNameData"
                            class="mt-4"
                            :label="$t('Group')"
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
                            @click="typeNameData = ' ' "
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
              {{ $t('Sub Group') }}
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
                            v-model="subTypeNameData"
                            class="mt-4"
                            :label="$t('Sub Group')"
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
                            @click="subTypeNameData = ''"
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
                            v-model="barcodeData"
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
                            @click="barcodeData = ''"
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
                            v-model="productIdData"
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
                            @click="productIdData = ''"
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
                            v-model="productNameData"
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
                            @click="productNameData = ''"
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
              {{ $t('Picking No.') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-if="false"
                v-model="menuPickingGoodsNo"
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
                            v-model="pickingGoodsNoData"
                            class="mt-4"
                            :label="$t('Picking No.')"
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
                            @click="pickingGoodsNoData = ''"
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
                            @click="menuPickingGoodsNo = false"
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
              {{ $t('Picking date') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VIcon
                v-if="false"
                color="primary"
                icon="mdi-pan-vertical"
                @click="sortByColIssueDateData = sortByColIssueDateData === 'asc' ? 'desc' : 'asc'"
              />
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              {{ $t('Request No.') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-if="false"
                v-model="menuRequestNo"
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
                            v-model="requestNoData"
                            class="mt-4"
                            :label="$t('Request No.')"
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
                            @click="requestNoData = ''"
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
                            @click="menuRequestNo = false"
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
              {{ $t('Request Date') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VIcon
                v-if="false"
                color="primary"
                icon="mdi-pan-vertical"
                @click="sortByColQtyData = sortByColQtyData === 'asc' ? 'desc' : 'asc'"
              />
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              {{ $t('Picking By') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-if="false"
                v-model="menuPickingBy"
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
                            v-model="pickingBy"
                            class="mt-4"
                            :label="$t('Picking By')"
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
                            @click="pickingBy = ''"
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
                            @click="menuPickingBy = false"
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
              {{ $t('Delivery Date') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VIcon
                v-if="false"
                color="primary"
                icon="mdi-pan-vertical"
                @click="sortByColLocationData = sortByColLocationData === 'asc' ? 'desc' : 'asc'"
              />
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              {{ $t('QTY Picking') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VIcon
                v-if="false"
                color="primary"
                icon="mdi-pan-vertical"
                @click="sortByColQtyPickingData = sortByColQtyPickingData === 'asc' ? 'desc' : 'asc'"
              />
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              {{ $t('QTY Request') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VIcon
                v-if="false"
                color="primary"
                icon="mdi-pan-vertical"
                @click="sortByColQtyRequestData = sortByColQtyRequestData === 'asc' ? 'desc' : 'asc'"
              />
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              {{ $t('qty') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
            </th>
            <th
              v-if="checkConfigUser(nameUser)"
              scope="row"
              class="text-start px-1"
            >
              {{ $t('UoM') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
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
                            v-model="uomData"
                            class="mt-4"
                            :label="$t('UoM')"
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
                            @click="uomData = ''"
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
            <th
              scope="row"
              class="text-end px-1"
            >
              {{ $t('Reason Request') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VMenu
                v-if="false"
                v-model="menuReasonRequest"
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
                            v-model="reasonRequestData"
                            class="mt-4"
                            :label="$t('Reason Request')"
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
                            @click="reasonRequestData = ''"
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
                            @click="menuReasonRequest = false"
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
              {{ $t('Remark Request') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VMenu
                v-if="false"
                v-model="menuRemarkRequest"
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
                            v-model="remarkRequestData"
                            class="mt-4"
                            :label="$t('Reason Request')"
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
                            @click="remarkRequestData = ''"
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
                            @click="menuRemarkRequest = false"
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
            v-for="(product, index) in products"
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
              {{ product.category }}
            </td>

            <!-- 👉 Secondary product categories -->
            <td
              :class="resolveChipColorTable(product.status)"
              class="text-start px-1"
            >
              {{ product.typeName }}
            </td>

            <!-- 👉 Sub product categories -->
            <td
              :class="resolveChipColorTable(product.status)"
              class="text-start px-1"
            >
              {{ product.subTypeName }}
            </td>

            <!-- 👉 Barcode -->
            <td
              :class="resolveChipColorTable(product.status)"
              class="text-center px-1"
            >
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
            <td
              :class="resolveChipColorTable(product.status)"
              class="text-start px-1"
            >
              {{ product.productId }}
            </td>

            <!-- 👉 Product Name -->
            <td
              :class="resolveChipColorTable(product.status)"
              class="text-start px-1"
            >
              {{ (product.productName) }}
            </td>

            <!-- 👉 Number(Tag) -->
            <td
              :class="resolveChipColorTable(product.status)"
              class="text-start  px-1"
            >
              {{ (product.pickingGoodsNo) }}
            </td>

            <!-- 👉 Number(Non-Tag) -->
            <td
              :class="resolveChipColorTable(product.status)"
              class="text-start  px-1"
            >
              {{ formatDate(product.pickingDate) }}
            </td>
            <!-- 👉 Total quantity of products -->
            <td
              :class="resolveChipColorTable(product.status)"
              class="text-start  px-1"
            >
              {{ (product.requestNo) }}
            </td>

            <!-- 👉 Counting unit -->
            <td
              :class="resolveChipColorTable(product.status)"
              class="text-start  px-1"
              style="width: 5rem;"
            >
              {{ formatDate(product.requestDate) }}
            </td>

            <td
              :class="resolveChipColorTable(product.status)"
              style="width: 8rem;"
              class="text-start px-1"
            >
              {{ (product.receiveBy) }}
            </td>
            <td
              :class="resolveChipColorTable(product.status)"
              style="width: 8rem;"
              class="text-start px-1"
            >
              {{ formatDate(product.pickingDate) }}
            </td>
            <td
              :class="resolveChipColorTable(product.status)"
              style="width: 8rem;"
              class="text-end px-1"
            >
              {{ product.qtyPicking }}
            </td>
            <td
              :class="resolveChipColorTable(product.status)"
              style="width: 8rem;"
              class="text-end px-1"
            >
              {{ product.qtyRequest }}
            </td>
            <td
              :class="resolveChipColorTable(product.status)"
              style="width: 8rem;"
              class="text-end px-1"
            >
              {{ product.qty }}
            </td>
            <td
              :class="resolveChipColorTable(product.status)"
              style="width: 8rem;"
              class="text-start px-1"
            >
              {{ (product.unitName) }}
            </td>
            <td
              :class="resolveChipColorTable(product.status)"
              style="width: 8rem;"
              class="text-end px-1"
            >
              {{ (product.reasonRequest) }}
            </td>
            <td
              :class="resolveChipColorTable(product.status)"
              style="width: 8rem;"
              class="text-end px-1"
            >
              {{ (product.remarkRequest) }}
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

