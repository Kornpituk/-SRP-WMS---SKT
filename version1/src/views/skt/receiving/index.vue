<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { onMounted, ref, watch, watchEffect } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api' //---------------------- Import Api for Url *****

//------------------------ Get Where House Name From LocalStorage and define to whereHouseSelectedItem ---------------------------
//---------------------- new rel table --------------------
import { VDataTable } from 'vuetify/labs/VDataTable'

import { useItemStore, useCookieStore } from '@/stores/skt/receingFormStore/itemStore'

import { useCookie } from '@/stores/skt/receingFormStore/useCookie'

const whereHouse = localStorage.getItem('whereHouseName')
const whereHouseSelectedItem = ref(whereHouse)

const accountRole = ref('issues')

const roleAccount = ref('issues')

watchEffect(() => {
  if(localStorage.getItem('userCheck') === 'supwh'){
    accountRole.value = 'manager'
  } else if(localStorage.getItem('userCheck') === 'staff'){
    accountRole.value = 'issues'
  }
})

// Define the debugMode reactive reference
const debugMode = ref(localStorage.getItem('DebuggableMode') === 'true')

// Watch for changes in debugMode and update localStorage
watch(debugMode, newValue => {
  localStorage.setItem('DebuggableMode', newValue ? 'true' : 'false')
})

// Function to manually toggle debug mode
const toggleDebugMode = () => {
  debugMode.value = !debugMode.value
}

//-------------------------------------- Defined Version --------------------------------
const buildDate = process.env.BUILD_DATE

const showSection = ref(false)

const handleScroll = () => {
  // เช็คว่าผู้ใช้เลื่อนถึงด้านล่างสุดหรือไม่
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    showSection.value = true
  } else {
    showSection.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

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

const searchByZoneId = ref(null)
const searchByAreaId = ref(null)
const searchBySubAreaId = ref(null)

//-- New Modlets
const itemsCode = ref(null)
const itemsName = ref(null)
const supplierCode = ref(null)
const deliveryDateRange = ref(null)

const testMoldelSearch = () => {
  console.log(itemsCode.value)
  console.log(itemsName.value)
  console.log(supplierCode.value)
  console.log(supplierName.value)
  console.log(deliveryDateRange.value)
}

//------------------------ Model Name for search SKT ------------------------------
const deliveryDateFrom = ref(sessionStorage.getItem('deliveryDateFrom') || '')
const deliveryDateTo = ref(sessionStorage.getItem('deliveryDateTo') || '')
const productId = ref(sessionStorage.getItem('productId') || '')
const productName = ref(sessionStorage.getItem('productName') || '')
const supplierId = ref(sessionStorage.getItem('supplierId') || '')
const supplierName = ref(sessionStorage.getItem('supplierName') || '')
const purchaseOrderNo = ref(sessionStorage.getItem('purchaseOrderNo') || '')
const fileterStatusInPAI = ref(sessionStorage.getItem('fileterStatusInPAI') || '')

const tempFilters = ref({
  deliveryDateRange: sessionStorage.getItem('deliveryDateFrom') || '',
  deliveryDateTo: sessionStorage.getItem('deliveryDateTo') || '',
  productId: sessionStorage.getItem('productId') || '',
  productName: sessionStorage.getItem('productName') || '',
  supplierId: sessionStorage.getItem('supplierId') || '',
  supplierName: sessionStorage.getItem('supplierName') || '',
  purchaseOrderNo: sessionStorage.getItem('purchaseOrderNo') || '',
  fileterStatusInPAI: sessionStorage.getItem('fileterStatusInPAI') || '',
})

const setValueFilter = () => {
  
}

const disBtnExoport = ref(true)

// ดึงค่าจาก sessionStorage
const storedStatus = sessionStorage.getItem('fileterStatusInPAI')

// ตรวจสอบว่ามีค่าหรือไม่ และแปลงค่าเป็น array
const statusFilter = ref(sessionStorage.getItem('fileterStatusInPAI'))


if(sessionStorage.getItem('fileterStatusInPAI') === ''){
  statusFilter.value = 'All'
}

// ฟังก์ชันสำหรับเพิ่มค่าจาก sessionStorage เข้าไปใน statusFilter
const addStoredStatus = () => {
  console.log("statusFilter addStoredStatus", statusFilter.value)
  if (storedStatus && storedStatus !== null && storedStatus !== '') {
    const newItems = storedStatus.split(',')

    // newItems.forEach(item => {
    //   if (!statusFilter.value.includes(item.trim())) { // เช็คว่าค่าไม่มีใน array
    //     statusFilter.value.push(item.trim()) // เพิ่มค่าใหม่เข้าไป
    //   }
    // })

    // อัปเดต sessionStorage
    sessionStorage.setItem('fileterStatusInPAI', statusFilter.value)
    sessionStorage.setItem('statusFilter', statusFilter.value)

    console.log("statusFilter if", sessionStorage.getItem('fileterStatusInPAI', statusFilter.value))
  }else if(statusFilter.value){
    sessionStorage.setItem('fileterStatusInPAI', statusFilter.value)
    console.log("statusFilter addStoredStatus else", statusFilter.value)
  }
}

watch(() => {
  if(sessionStorage.getItem('fileterStatusInPAI') === null || sessionStorage.getItem('fileterStatusInPAI') === undefined) {
    sessionStorage.setItem('fileterStatusInPAI', '')
  }
  if(sessionStorage.getItem('statusFilter') === null || sessionStorage.getItem('fileterStatusInPAI') === undefined) {
    sessionStorage.setItem('statusFilter', '')
  }

  addStoredStatus()
})

// eslint-disable-next-line sonarjs/cognitive-complexity
const validateFields = () => {
  const fields = {
    // deliveryDateFrom: deliveryDateFrom.value,
    // deliveryDateTo: deliveryDateTo.value,
    // productId: productId.value,
    // productName: productName.value,
    // supplierId: supplierId.value,
    // supplierName: supplierName.value,
    // purchaseOrderNo: purchaseOrderNo.value,
    // statusName: fileterStatusInPAI.value,

    deliveryDateFrom: tempFilters.value.deliveryDateRange || '',
    deliveryDateTo: tempFilters.value.deliveryDateTo || '',
    productId: tempFilters.value.productId || '',
    productName: tempFilters.value.productName || '',
    supplierId: tempFilters.value.supplierId || '',
    supplierName: tempFilters.value.supplierName || '',
    purchaseOrderNo: tempFilters.value.purchaseOrderNo || '',
    statusName: tempFilters.value.fileterStatusInPAI || '',

  }

  // ตรวจสอบว่ามีฟิลด์ใดที่ไม่ใช่ค่าว่างอย่างน้อย 1 ค่า
  const hasValue = Object.values(fields).some(value => value !== '' && value.length !== 0)

  if (!hasValue) {
    disBtnExoport.value = true
    
    return false // คืนค่า false ถ้าไม่มีฟิลด์ไหนที่มีค่า
  } else {
    disBtnExoport.value = false
    console.log("filter Validate", fields)

    sessionStorage.setItem('deliveryDateFrom', fields.deliveryDateRange || '')
    sessionStorage.setItem('deliveryDateTo', fields.deliveryDateTo || '')
    sessionStorage.setItem('productId', fields.productId || '')
    sessionStorage.setItem('productName', fields.productName || '')
    sessionStorage.setItem('supplierId', fields.supplierId || '')
    sessionStorage.setItem('supplierName', fields.supplierName || '')
    sessionStorage.setItem('purchaseOrderNo', fields.purchaseOrderNo || '')
    sessionStorage.setItem('fileterStatusInPAI', fields.fileterStatusInPAI || '')

    addStoredStatus()

    sessionStorage.setItem('productId', fields.productId)
    
    return true // คืนค่า true ถ้ามีข้อมูลในฟิลด์อย่างน้อย 1 ฟิลด์
  }
}

watch(() => {
  if(sessionStorage.getItem('fileterStatusInPAI') === 'null'){
    sessionStorage.setItem('fileterStatusInPAI', '')
  }
  if(sessionStorage.getItem('statusFilter') === 'null'){
    sessionStorage.setItem('statusFilter', '')
  }

  validateFields()
})

// ใช้ watch function เพื่ออัปเดต sessionStorage เมื่อแต่ละค่าถูกเปลี่ยนแปลง
watch(tempFilters.value.deliveryDateRange, newValue => {
  sessionStorage.setItem('deliveryDateFrom', newValue)
})
watch(tempFilters.value.deliveryDateTo, newValue => {
  sessionStorage.setItem('deliveryDateTo', newValue)
})
watch(tempFilters.value.productId, newValue => {
  sessionStorage.setItem('productId', newValue)
  console.log("Update Filter", tempFilters.value.productId, newValue)
})
watch(tempFilters.value.productName, newValue => {
  sessionStorage.setItem('productName', newValue)
})
watch(tempFilters.value.supplierId, newValue => {
  sessionStorage.setItem('supplierId', newValue)
})
watch(tempFilters.value.supplierName, newValue => {
  sessionStorage.setItem('supplierName', newValue)
})
watch(tempFilters.value.purchaseOrderNo, newValue => {
  sessionStorage.setItem('purchaseOrderNo', newValue)
})
watch(tempFilters.value.fileterStatusInPAI, newValue => {
  sessionStorage.setItem('fileterStatusInPAI', newValue)
})

onMounted(() => {
  tempFilters.value.deliveryDateRange = sessionStorage.getItem('deliveryDateFrom') || ''
  tempFilters.value.deliveryDateTo = sessionStorage.getItem('deliveryDateTo') || ''
  tempFilters.value.productId = sessionStorage.getItem('productId') || ''
  tempFilters.value.productName = sessionStorage.getItem('productName') || ''
  tempFilters.value.supplierId = sessionStorage.getItem('supplierId') || ''
  tempFilters.value.supplierName = sessionStorage.getItem('supplierName') || ''
  tempFilters.value.fileterStatusInPAI = sessionStorage.getItem('fileterStatusInPAI') || ''
  tempFilters.value.purchaseOrderNo = sessionStorage.getItem('purchaseOrderNo') || ''
})

// เรียกใช้ฟังก์ชันเพื่อเพิ่มค่าใหม่

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

const clearModel = async () => {
  deliveryDateFrom.value = ''
  deliveryDateTo.value = ''
  productId.value = ''
  productName.value = ''
  supplierId.value = ''
  supplierName.value = ''
  deliveryDateRange.value = ''
  searchByZoneId.value = ''
  searchByAreaId.value = ''
  searchBySubAreaId.value = ''
  serialProductCode.value = ''
  fileterStatusInPAI.value = ''
  statusFilter.value = []

  tempFilters.value.deliveryDateRange = ''
  tempFilters.value.deliveryDateTo = ''
  tempFilters.value.productId = ''
  tempFilters.value.productName = ''
  tempFilters.value.supplierId = ''
  tempFilters.value.supplierName = ''
  tempFilters.value.purchaseOrderNo = ''
  tempFilters.value.fileterStatusInPAI = ''

  sessionStorage.setItem('deliveryDateFrom', '')
  sessionStorage.setItem('deliveryDateTo', '')
  sessionStorage.setItem('productId', '')
  sessionStorage.setItem('productName', '')
  sessionStorage.setItem('supplierId', '')
  sessionStorage.setItem('supplierName', '')
  sessionStorage.setItem('purchaseOrderNo', '')
  sessionStorage.setItem('fileterStatusInPAI', '')

  await handleSearch()
}

const searchParams = {
  searchByCategoryId,
  searchByTypeId,
  searchBySubTypeId,
  searchByBarcode,
  searchByProductId,
  searchByProductName,
  searchByUOMId,
  searchByZoneId,
  searchByAreaId,
  searchBySubAreaId,
  serialProductCode,

  searchByCategoryName,
  searchByTypeName,
  searchBySubTypeName,
  searchByBarcodeName,
  searchByProductCodeName,
  searchByProductNameFilter,
  searchByUnitName,
}

const sortParams = {
  sortByCategory,
  sortByType,
  sortBySubType,
  sortByBarcode,
  sortByProductId,
  sortByProductName,
  sortByUnit,
  sortByQty,
  sortByTags,
  sortByNonTags,
}

// Clear function to reset all values
const clearValuesNeo = () => {
  // Reset search parameters
  for (const key in searchParams) {
    searchParams[key].value = null
  }

  // Reset sort parameters
  for (const key in sortParams) {
    sortParams[key].value = null
  }
}

//----------------------------- Filter Status --------------------------------
const itemStatus = ref([{
  statusID: -1,
  statusText: 'All',
}])

const getStatusReceiving = async () => {
  try {
    const response = await axiosIns.get(`${urlApi.value}/api/v1/ReceivingPlan/status`, {
      headers: {
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
    })

    itemStatus.value = [
      { statusID: -1, statusText: "All" },  // ค่าเริ่มต้น "All"
      ...response.data.data, // ข้อมูลจาก API
    ]

    console.log('itemStatus', itemStatus.value)
  } catch (error) {
    // จัดการข้อผิดพลาด
    selectError.value = 'Where house not selected!!'
    console.error('Error:', error)
  }
}

const colorStatusWithId = id => {
  switch (id) {
  case 0:
    return { color: 'grey-darken-1', message: 'grey-darken-1' }
  case 1:
    return { color: 'red-lighten-4', message: 'red' }
  case 2:
    return { color: 'pink-lighten-4', message: 'pink-darken-4' }
  case 3:
    return { color: 'purple-lighten-4', message: 'purple' }
  case 4:
    return { color: 'deep-purple-lighten-4', message: 'deep-purple' }
  case 5:
    return { color: 'indigo-lighten-4', message: 'indigo' }
  case 6:
    return { color: 'blue-lighten-4', message: 'blue' }
  case 7:
    return { color: 'light-blue-lighten-4', message: 'light-blue' }
  case 8:
    return { color: 'cyan-lighten-4', message: 'cyan-darken-4' }
  case 9:
    return { color: 'teal-lighten-4', message: 'teal' }
  case 10:
    return { color: 'green-darken-3', message: 'cycan' }
  case 11:
    return { color: 'lime-lighten-4', message: 'cycan' }
  case 12:
    return { color: 'yellow-darken-3', message: 'brown' }
  case 13:
    return { color: 'orange-lighten-4', message: 'orange' }
  case 14:
    return { color: 'deep-orange-lighten-4', message: 'deep-orange-derken-4' }
  case 15:
    return { color: 'brown-lighten-4', message: 'brown' }
  case 16:
    return { color: 'red-darken-2', message: 'red-darken-2' }
  case 17:
    return { color: 'green-darken-2', message: 'green-darken-2' }
  case 18:
    return { color: 'orange-darken-4', message: 'green-darken-2' }
  default:
    return { color: 'grey', message: 'grey' }
  }
}

const colorStatusWithId2 = id => {
  switch (id) {
  case 0:
    return { color: 'grey-darken-1', message: 'grey-darken-1' }
  case 1:
    return { color: 'red', message: 'red' }
  case 2:
    return { color: 'pink', message: 'pink-darken-4' }
  case 3:
    return { color: 'purple', message: 'purple' }
  case 4:
    return { color: 'deep-purple', message: 'deep-purple' }
  case 5:
    return { color: 'indigo', message: 'indigo' }
  case 6:
    return { color: 'blue', message: 'blue' }
  case 7:
    return { color: 'light-blue', message: 'light-blue' }
  case 8:
    return { color: 'cyan', message: 'cyan-darken-4' }
  case 9:
    return { color: 'teal', message: 'teal' }
  case 10:
    return { color: 'light-green', message: 'cycan' }
  case 11:
    return { color: 'lime', message: 'cycan' }
  case 12:
    return { color: 'yellow-darken-4', message: 'brown' }
  case 13:
    return { color: 'orange', message: 'orange' }
  case 14:
    return { color: 'deep-orange', message: 'deep-orange-derken-4' }
  case 15:
    return { color: 'brown', message: 'brown' }
  case 16:
    return { color: 'red-darken-2', message: 'red-darken-2' }
  case 17:
    return { color: 'green-darken-2', message: 'green-darken-2' }
  case 18:
    return { color: 'orange-darken-4', message: 'green-darken-2' }
  default:
    return { color: 'grey', message: 'grey' }
  }
}

const colorStatusWithCheckBox = id => {

  switch (id) {
  // case 0:
  //   return { color: 'grey-lighten-1', message: 'grey-lighten-1' }
  // case 1:
  //   return { color: '#FFEBEE', message: 'red' }
  // case 2:
  //   return { color: '#FCE4EC', message: 'pink-lighten-4' }
  // case 3:
  //   return { color: '#EDE7F6', message: 'purple-lighten-4' }
  // case 4:
  //   return { color: '#D1C4E9', message: 'deep-purple-lighten-4' }
  // case 5:
  //   return { color: '#E8EAF6', message: 'indigo' }
  // case 6:
  //   return { color: '#E3F2FD', message: 'blue' }
  case 7:
    return { color: '#E1F5FE', message: 'light-blue' }

  // case 8:
  //   return { color: '#E0F7FA', message: 'cyan-lighten-4' }
  // case 9:
  //   return { color: '#E0F2F1', message: 'teal' }
  // case 10:
  //   return { color: '#F1F8E9', message: 'cycan' }
  // case 11:
  //   return { color: '#F9FBE7', message: 'cycan' }
  // case 12:
  //   return { color: '#FFFDE7', message: 'brown' }
  // case 13:
  //   return { color: '#FFF3E0', message: 'orange' }
  // case 14:
  //   return { color: '#FBE9E7', message: 'deep-orange-derken-4' }
  case 15:
    return { color: '#EFEBE9', message: 'brown' }

  // case 16:
  //   return { color: '#FFCDD2', message: 'red-lighten-2' }
  // case 17:
  //   return { color: '#E8F5E9', message: 'green-lighten-2' }
  default:
    return { color: '', message: 'grey' }
  }
}

//test branches

// const dataTableColor = ref('#F1F8E9')

const dataTableColor = ref('#E0F7FA')
const dataTableNummberedToggle = ref(null)

const dataTableCliclHighlightIsToggle = no => {
  // เช็คว่า no ที่รับเข้ามาตรงกับค่าเดิมหรือไม่
  if (dataTableNummberedToggle.value === no) {
    // ถ้าตรง ให้สลับกลับเป็น null
    dataTableNummberedToggle.value = null
  } else if (dataTableNummberedToggle.value === null) {
    // ถ้าเป็น null ให้ตั้งค่าเป็น no ใหม่
    dataTableNummberedToggle.value = no
  }
}

//--------------------------------- Convert Date To API ----------------------------------------------------------------

//----------------------- Filter Status 
const progressLinearNoData = ref(false)

const handleSelection = (selected, item) => {
  if (item.statusId === 17 || item.statusId === 15) {
    this.selectedDataTables = selected
  }
}

const searchFilters = ref({ ...tempFilters.value }) // ฟิลเตอร์จริงที่จะส่งไป API

const handleSearch = async () => {
  searchFilters.value = { ...tempFilters.value } // คัดลอกค่าฟิลเตอร์ที่กรอกเสร็จแล้ว

  sessionStorage.setItem('deliveryDateFrom', tempFilters.value.deliveryDateRange || '')
  sessionStorage.setItem('deliveryDateTo', tempFilters.value.deliveryDateTo || '')
  sessionStorage.setItem('productId', tempFilters.value.productId || '')
  sessionStorage.setItem('productName', tempFilters.value.productName || '')
  sessionStorage.setItem('supplierId', tempFilters.value.supplierId || '')
  sessionStorage.setItem('supplierName', tempFilters.value.supplierName || '')
  sessionStorage.setItem('purchaseOrderNo', tempFilters.value.purchaseOrderNo || '')
  sessionStorage.setItem('fileterStatusInPAI', tempFilters.value.fileterStatusInPAI || '')

  await GetStockUpdate() // เรียก API ด้วยฟิลเตอร์ที่ผู้ใช้กรอก
}

onMounted( async () => {
  await GetStockUpdate()
  addStoredStatus()
})

const GetStockUpdate = async () => {
  try {
    progressLinearNoData.value = false

    const { deliveryDateRange, productId, productName, supplierId, supplierName, purchaseOrderNo } = searchFilters.value

    // จัดการวันที่
    if (deliveryDateRange) {
      const [fromDate, toDate] = deliveryDateRange.split(" to ")

      deliveryDateFrom.value = fromDate || ''
      deliveryDateTo.value = toDate || ''
    } else {
      deliveryDateFrom.value = ''
      deliveryDateTo.value = ''
    }

    // จัดการสถานะ
    fileterStatusInPAI.value = statusFilter.value === 'All' ? '' : statusFilter.value

    // แปลงสถานะเป็น String
    const fileterStatusInApiStr = typeof fileterStatusInPAI.value === 'object' && fileterStatusInPAI.value !== null
      ? fileterStatusInPAI.value.join(',')
      : fileterStatusInPAI.value

    // เรียก API ด้วย await
    progressLinearNoData.value = false

    products.value = []

    addStoredStatus()

    const response = await axiosIns.get(`${urlApi.value}/api/v1/ReceivingPlan/View`, {
      params: {
        deliveryDateFrom: deliveryDateFrom.value,
        deliveryDateTo: deliveryDateTo.value,
        productId: productId,
        productName: productName,
        supplierId: supplierId,
        supplierName: supplierName,
        statusName: fileterStatusInApiStr || '',
        purchaseOrderNo: purchaseOrderNo,
      },
      headers: {
        accept: '*/*',
        'x-location': `${searchByWareHouseId.value}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
    })

    progressLinearNoData.value = false

    const data = response.data.datas

    // กรองข้อมูล

    const filteredData = data.filter(item => item.receiveTypeId !== 33)

    // เพิ่ม field no และ selectable
    products.value = filteredData.map((item, index) => ({
      ...item,
      no: index + 1,
      selectable: item.statusId === 15,
    }))

    console.log('[products.value]:', products.value)

  } catch (error) {
    // จัดการข้อผิดพลาด
    products.value = []
    progressLinearNoData.value = true
    console.error('Error:', error)
  }
}


//--------------------------------------- Data Model Table Data ----------------------------
const headers = [
  {
    title: 'data-table-select',
    key: 'data-table-select',
    align: "center",
    fixed: true,
    readonly: true,
  },
  {
    title: 'Status',
    key: 'statusText',
    align: "center",
    fixed: true,
  },
  {
    title: 'No.',
    key: 'no',
    align: "center",
  },
  {
    title: 'Item Code',
    key: 'itemCode',
  },
  {
    title: 'Item Name',
    key: 'itemName',
  },
  {
    title: 'Trade Name',
    key: 'concatTradename',
  },
  {
    title: 'Supplier Code',
    key: 'supplierId',
    
  },
  {
    title: 'Supplier Name',
    key: 'supplierName',
  },
  {
    title: 'P/O No.',
    key: 'purchaseOrderNo',
  },
  {
    title: 'Delivery Date',
    key: 'deliveryDate',
  },
  {
    title: 'Lot',
    key: 'batch',
  },
  { title: 'PURC(Pcs)', align: 'end', key: 'purchasingQuantityPcs' },
  { title: 'PURC(Kgs)', align: 'end', key: 'purchasingAmountKgs' },
  { title: 'RCVD(Pcs)', align: 'end', key: 'purchasingQuantityRcvdPcs' },
  { title: 'RCVD(Kgs)', align: 'end', key: 'purchasingAmountRcvdKgs' },
  {
    title: 'Updated By',
    key: 'updatedBy',
  },
  {
    title: 'Updated Date',
    key: 'updatedDate',
  },
  {
    title: 'Action',
    key: 'action',
    align: 'center',
    class: 'sticky-right',
  },
]

const tableDataPerpage = ref(15)
const tableDataHeight = ref(550)

onMounted(() => {
  // โหลดค่าเริ่มต้นจาก sessionStorage ถ้ามี
  const savedItemsPerPage = sessionStorage.getItem('itemsPerPage')

  tableDataPerpage.value = savedItemsPerPage ? parseInt(savedItemsPerPage, 10) : 10 // ค่าเริ่มต้นเป็น 10 ถ้าไม่มีใน session

})


const updateItemsPerPage = newItemsPerPage => {
  // อัปเดตค่าใน sessionStorage เมื่อมีการเปลี่ยนแปลง
  sessionStorage.setItem('itemsPerPage', newItemsPerPage)
  tableDataPerpage.value = newItemsPerPage
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

watch(() => {
  getStatusReceiving()
})


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
  if (configsShowDigit == 'true') {
    return Math.ceil(decimal)
  } else {
    return decimal
  }
}

function convertDate(dateString) {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  
  return `${day}/${month}/${year}`
}

function convertDateTime(dateString) {
  const date = new Date(dateString)
  
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
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
    console.log('RFID Check False:'+ checkRFIDUpdate.value)
    checkRFID.value = false
  }
})

const nameProductDialog = ref('')
const qtyProductDialog = ref('')
const unitProductDialog = ref('')
const barcodeProductDialog = ref('')

const codeProduct = ref('')
const nameProduct = ref('')
const imgProduct = ref('')
const barcodeProduct = ref('')
const categoriesProduct = ref('')
const groupProduct = ref('')
const groupSupProduct = ref('')
const totalProduct = ref('')
const unitNameProduct = ref('')
const detailsProduct = ref('')

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
  console.log('showImageFunction!!')
}

const showExpansionDialog = ref(false)

//------------------------------------------ Mock Data --------------------------------

// รายการของสถานะที่เป็นไปได้
const statuses2 = ['All', 'Completed', 'On-going (INSP)', 'Cancel', 'Wait for receiving', 'Send back for Edit']

const statuses = [ 'Cancel',
  'Waiting for Receiving',
  'ETL Failed',
  'Draft Receiving Form',
  'Waiting for Insp.', 
  'Draft R/M Insp. Form',
  'Waiting for Insp. Approval',
  'Waiting for WH Rejection',
  'Waiting for Editing for Partial Receiving',
  'Waiting for Partial Receiving',
  'Draft Packaging Insp. Form',
  'Waiting for Mobile Receiving',
  'Waiting for Lorry Loading',
  'Draft Mobile Receiving',
  'Draft Lorry Loading',
  'Waiting for WH Approval',
  'Receiving Rejected',
  'Receiving Completed']

const checkStatus = status => {
  switch (status) {
  case 'Cancel':
    return 'grey-darken-1'
  case 'Waiting for Receiving':
    return 'pink-darken-2'
  case 'ETL Failed!':
    return 'deep-orange-darken-3'
  case 'Draft Receiving Form':
    return 'yellow-darken-3'
  case 'Waiting for Inspection':
    return 'pink-lighten-3'
  case 'Draft R/M Inspection Form':
    return 'amber-darken-2'
  case 'Waiting for Inspection Approval':
    return 'green-darken-2'
  case 'Waiting for Warehouse Rejection':
    return 'red-lighten-1'
  case 'Waiting for Editing for Partial Receiving':
    return 'light-blue-lighten-1'
  case 'Waiting for Partial-Receiving':
    return 'pink-darken-2'
  case 'Draft Packaging Inspection Form':
    return 'amber-darken-4'
  case 'Waiting for Mobile Receiving':
    return 'pink-darken-2'
  case 'Waiting for Lorry Loading':
    return 'pink-darken-2'
  case 'Draft Mobile Receiving':
    return 'orange-darken-2'
  case 'Draft Lorry Loading':
    return 'orange-darken-2'
  case 'Waiting for Warehouse Approval':
    return 'teal'
  case 'Receiving Rejected':
    return 'red-darken-2'
  case 'Receiving Completed':
    return 'green-darken-2'
  default:
    return 'grey'
  }
}

const checkReceivedStatus = status => !(status === 'Approved' || status === 'Completely Received' || status === 'Completely Picked')

// ฟังก์ชันสำหรับสุ่มสถานะ
function getRandomStatus() {
  const randomIndex = Math.floor(Math.random() * statuses.length)
  
  return statuses[randomIndex]
}

function getRandomDate(start) {
  const startDate = new Date(start)
  const endDate = new Date() // Set the end date to the current date
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
  const randomDate = new Date(randomTime)
  
  const year = randomDate.getFullYear()
  const month = String(randomDate.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const day = String(randomDate.getDate()).padStart(2, '0')
  
  return `${day}/${month}/${year}`
}

const dateNow = ref(new Date())

const randomInt = (Math.random() * 99000 + 1000).toFixed(2) // สร้างเลขสุ่มพร้อมทศนิยม 2 ตำแหน่ง

const formatNumber = value => {
  if (value !== null && value !== undefined) {
    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  
  return '0.00'
}

//----------------------------------------------------------------
const panel = ref(['filter'])

//--------------------------- Role --------------------------------
const roleAuthor = ref('manager')

//----------------------------- Dialog Action ----------------------------------------------------------------
//--- Dialog Print / Receiving / Ins  ----------------------------------------------------------------

const isDialogVisibleActionPrintLabel = ref(false)

const printLabel = ref(false)
const printForm = ref(false)

const selectedPrintLabel = ref([])
const copiesPrintForm = ref(1)
const isDialogVisibleAction = ref(false)

const itemStore = useItemStore()

const cookieStore = useCookieStore()

const cookie = useCookie('itemCookie')

cookieStore.setCookieValue(cookie.value)

const detailsReceiv = ref({
  statusText: '',
  itemCode: '',
  itemName: '',
  supplierId: '',
  supplierName: '',
  purchaseOrderNo: '',
  deliveryDate: '',
  expectDeliveryDate: '',
  receivedDate: '',
  purchasingQuantityPcs: '',
  purchasingAmountKgs: '',
  purchasingQuantityRcvdPcs: '',
  purchasingAmountRcvdKgs: '',
  updatedDate: '',
  updatedBy: '',
})

const journalIDModel = ref('')
const updateByReceivingPlan = ref('')
const idStatusDialogAction = ref('')
const poEtILogAction = ref('')
const receivingTypeAction = ref('')
const lotAction = ref('')

const checkCurrentTabBeforIn = status => {
  let tabIndex

  switch (status) {
  case 1:
  case 3:
  case 8:
  case 10:
    tabIndex = 0 // สำหรับ status 1, 3, 8, 10 ให้แสดง tab index 0
    break
    
  case 4:
  case 5:
  case 6:
  case 7:
    tabIndex = 1 // สำหรับ status 4, 5, 6, 7 ให้แสดง tab index 1
    break
    
  case 12:
  case 14:
  case 13:
    tabIndex = 2 // สำหรับ status 12, 13 ให้แสดง tab index 2
    break

  default:
    tabIndex = 0 // ค่าเริ่มต้นถ้าไม่มี status ที่ตรงกับเงื่อนไข
  }

  return tabIndex
}

const viewDetailsReceive = (index, journalID, updateBy, status, itemCode, poEtlLogDetailJournalID, receivingType, lot) => {
  // console.log('isDialogVisibleAction **', index, journalID, updateBy, status, itemCode)
  journalIDModel.value = journalID
  updateByReceivingPlan.value = updateBy
  detailsReceiv.value = products.value[index-1]

  itemStore.clearItemDetails()
  itemStore.setItemDetails(products.value[index-1], 'itemDataCookies')

  itemStore.setItemDetails(products.value[index-1].poEtlLogDetailJournalID, 'poEtlLogDetailJournalIDCookies')
  itemStore.setItemDetails(products.value[index-1].itemCode, 'itemCodeCookies')
  itemStore.setItemDetails(products.value[index-1].supplierId, 'supplierIdCookies')
  itemStore.setItemDetails(products.value[index-1].lorryInfoKey, 'typeLorryInfoId')


  // console.log("setItemDetails", itemStore.getItemDetails('poEtlLogDetailJournalIDCookies'))

  idStatusDialogAction.value = status
  receivingTypeAction.value = receivingType
  lotAction.value = lot
  sessionStorage.setItem('currentTabReceivingForm', checkCurrentTabBeforIn(status))

  selectedPrintLabel.value = []

  poEtILogAction.value = poEtlLogDetailJournalID
  findProductByJournalID(poEtlLogDetailJournalID)
  isDialogVisibleAction.value = true
  
  
}

const fieldsToShow = ['statusText', 
  'itemCode',
  'itemName',
  'supplierId',
  'supplierName',
  'purchaseOrderNo',
  'deliveryDate',
  'expectDeliveryDate',
  'receivedDate',
  'purchasingQuantityPcs',
  'purchasingAmountKgs',
  'purchasingQuantityRcvdPcs',
  'purchasingAmountRcvdKgs',
  'updatedDate',
  'updatedBy']

const filteredDetails = computed(() => {
  return Object.fromEntries(
    Object.entries(detailsReceiv.value).filter(([key]) => fieldsToShow.includes(key)),
  )
})

function getDisplayName(key) {
  const displayNames = {
    statusText: 'Status',
    itemCode: 'Item Code',
    itemName: 'Item Name',
    supplierId: 'Supplier Code',
    supplierName: 'Supplier Name',
    purchaseOrderNo: 'Purchase Order No',
    deliveryDate: 'Delivery Date',
    expectDeliveryDate: 'Expect Delivery Date',
    receivedDate: 'Received Date',
    purchasingQuantityPcs: 'Purchasing Qty',
    purchasingAmountKgs: 'Purchasing Amount',
    purchasingQuantityRcvdPcs: 'Receiving Qty',
    purchasingAmountRcvdKgs: 'Receiving Amount',
    updatedDate: 'Updated Date',
    updatedBy: 'Updated By',
  }

  
  return displayNames[key] || 'Unknown'
}

const resultDetailsAvtion = ref(null)

const findProductByJournalID = journalID => {
  const foundProduct = products.value.find(product => product.poEtlLogDetailJournalID === journalID)
  
  if (foundProduct) {
    console.log('Found Product:', foundProduct)

    const typeLorryIDOld = ref(sessionStorage.getItem('typeLorryInfoId'))
    if(foundProduct.lorryInfos.length > 0){
      if(foundProduct.lorryInfos.length === 1){
        const typeLorryOnce = foundProduct.lorryInfos[0].lorryInfoKey

        typeLorryID.value = foundProduct.lorryInfos[0].lorryInfoKey

        itemStore.setItemDetails(typeLorryOnce, 'typeLorryInfoId')
        sessionStorage.setItem('typeLorryInfoId', typeLorryOnce)
        
        console.log('Found Product typeLorryOnce:', typeLorryOnce)
      }
      else if(foundProduct.lorryInfos.length >= 1 && typeLorryIDOld.value){
        itemStore.clearItemDetails('typeLorryInfoId')
        sessionStorage.removeItem('typeLorryInfoId')
        console.log('Clear typeLorryOnce2:', sessionStorage.getItem('typeLorryInfoId'), typeLorryIDOld.value)
      }
      else{
        itemStore.clearItemDetails('typeLorryInfoId')
        sessionStorage.removeItem('typeLorryInfoId')
        console.log('Clear typeLorryOnce:', sessionStorage.getItem('typeLorryInfoId'), typeLorryIDOld.value)
      }
    }else{
      console.log('No typeLorryOnce')
    }
    resultDetailsAvtion.value = foundProduct
    
    return foundProduct
  } else {
    console.log('No product found with poEtlLogDetailJournalID:', journalID)
    
    return null
  }
}

if (resultDetailsAvtion.value) {
  // สามารถจัดการกับข้อมูลที่พบได้ที่นี่
  console.log('Product Details:', resultDetailsAvtion.value)
} else {
  console.log('No matching product found')
}

const dataPrintlabel = ref([])

//------------------------ Print Label------------------------------------------
// const success = ref(false)
import { useViewPrintLabelFormService, usePrintReceivingFormService, 
  usePrintInspectionFormService, usePrintPackagingFormService, 
  usePrintExportExcelService }  from '@/services/skt/global/gloBalService'

import { usePrintIPAFormService } from '@/services/skt/receivingFrom/lorry/ipaServices'

const { printLabelFormViewResult, printLabelFormViewService } = useViewPrintLabelFormService()
const processingPrintLabel = ref(false)
const successGetPrintLabelView = ref(false)

const disabledBtnLebal = () => {
  return [0, 1, 2, 3, 4, 5, 6, 7, 10, 16, 13].includes(idStatusDialogAction.value)
}

const disabledBtnLebalLorry = () => {
  return [0, 1, 2, 3, 4, 5, 6, 7, 10, 16, 13].includes(idStatusDialogAction.value)
}

const disabledTypeReceiving = ref(itemStore.getItemDetails('typeLorryInfoId'))

const getPrintLabelView = async lot => {
  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.get(`${urlApi.value}/api/v1/PrintLabel/Label?lot=${lot}`, {
    headers: {
      'accept': '*/*',
      'x-location': `${searchByWareHouseId.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {

      const data = response.data

      dataPrintlabel.value = data
      console.log("getPrintLabelView 55555+", data)
      
      successGetPrintLabelView.value = true
    })
    .catch(error => {
      console.error('Error:', error)
      
      successGetPrintLabelView.value = false
    })

  // const result = printLabelFormViewService(urlApi.value, searchByWareHouseId.value, accessTokenAtStore, lot)

  // if(printLabelFormViewResult){
  //   console.log('printLabelFormViewService Success')
  // }

}

// ฟังก์ชันเตรียมข้อมูลเพื่อให้เหลือเฉพาะฟิลด์ที่ต้องการ
const prepareDataForPrintLabel = originalData => {
  const firstItem = originalData[0] // ดึงรายการแรก
  
  return {
    copy: 1,  // ตั้งค่า copy เป็น 1
    lot: firstItem.lot,  // ฟิลด์ lot
    productId: firstItem.productId,  // ฟิลด์ productId
    productName: firstItem.productName,  // ฟิลด์ productName
    purchaseOrderNo: firstItem.purchaseOrderNo,  // ฟิลด์ purchaseOrderNo
    receivedDate: firstItem.receivedDate,  // ฟิลด์ receivedDate
  }
}

const successSavePrintLabel = ref(false)

// เรียกใช้งานฟังก์ชันนี้ก่อนส่งข้อมูลใน API
const savePrintLabel = async () => {
  // ใช้ prepareDataForPrintLabel เพื่อจัดข้อมูลใน dataForPrintLabelSave
  const body = prepareDataForPrintLabel(dataPrintlabel.value)

  try {
    const response = await axiosIns.post(
      `${urlApi.value}/api/v1/PrintLabel/SaveToPrintLot`,
      body,
      {
        headers: {
          'accept': '*/*',
          'x-location': `${searchByWareHouseId.value}`,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
      },
    )

    // บันทึกข้อมูล response ที่ได้รับมา
    dataPrintlabel.value = response.data

    const data = response.data
    const success = false

    console.log("save Print Label success:", response.data)
    
    successSavePrintLabel.value = true
  } catch (error) {
    // กรณี error
    progressLinearNoData.value = true
    console.error('Error in savePrintLabel:', error)

    successSavePrintLabel.value = false
  }
}

const btnPrintLabelTest = () => {
  savePrintLabel()
}

const printLabelSmallPdf = async () => {
  savePrintLabel()
  
  try {
    const response = await axiosIns.post(
      `${urlApi.value}/api/v1/PrintLabel/Label/Small/Pdf`,
      {},
      {
        headers: {
          'accept': 'application/pdf', // รับไฟล์ PDF
          'x-location': whereHouse,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
        responseType: 'blob', // รับ response เป็น Blob
      },
    )
  
    if (response && response.data) {
      console.log('Service Response print Label form:', response.data)
  
      // สร้าง Blob จาก response
      const blob = new Blob([response.data], { type: 'application/pdf' })
  
      // สร้าง URL สำหรับ Blob
      const blobUrl = URL.createObjectURL(blob)
  
      // เปิดหน้าต่างใหม่เพื่อแสดง PDF หรือเปลี่ยนเป็นการดาวน์โหลดก็ได้
      window.open(blobUrl)
      processingPrintLabel.value = false

  
      return { success: true, data: blob }
    } else {
      processingPrintLabel.value = false
      throw new Error('No data Genterate print Label form')
    }
  } catch (error) {
    console.error('Error in printLabelView:', error)
    throw new Error(`Failed to printLabelView for: ${error.response?.data?.message || error.message}`)
  }
}

///test commit

const btnPrintLabel = async () => {
  processingPrintLabel.value = true
  
  console.log('btnPrintLabel start!')
  try {
    // เรียกใช้ savePrintLabel ก่อน
    console.log('get PrintLabel start!')

    await getPrintLabelView(lotAction.value)
    if(!successGetPrintLabelView.value){
      throw 'get PrintLabel:'+successGetPrintLabelView.value
    }

    console.log('save PrintLabel start!')

    await savePrintLabel()
    if(!successSavePrintLabel.value){
      throw 'save PrintLabel:'+successSavePrintLabel.value
    }

    console.log('savePrintLabel end!')


    console.log('printLabelSmallPdf start!')

    const printResponse = await printLabelSmallPdf()

    console.log('printLabelSmallPdf end!')

    if (printResponse.success) {
      console.log('Print label PDF successfully generated and displayed.')
    } else {
      processingPrintLabel.value = false
      console.error('Error generating print label PDF.')
    }
  } catch (error) {
    processingPrintLabel.value = false
    console.error('Error in btnPrintLabel:', error)
  }
}

//---------------------------- definde tabel


//------------------------ Fuction Print Form --------------------------------

const { errorMessageGenerateView, printReceivingFormService } = usePrintReceivingFormService()

const { errorMessageInspection, printInspectionFormService } = usePrintInspectionFormService()

const { errorMessagePackaging, printPackagingFormService } = usePrintPackagingFormService()

const { printIPAFormResult, errorMessageIPAPrintPDF, printIPAFormService } = usePrintIPAFormService()

const processingPrint = ref(false)

const processingPrintForm1 = ref(false)
const processingPrintForm2 = ref(false)
const processingPrintForm3 = ref(false)

const processingPrintForm4 = ref(false)

const disabledCheckboxListRawM = () => {
  // ถ้า idStatusDialogAction.value มีค่าเป็น 0, 1, 2 หรือ 3 จะคืนค่าเป็น true
  return [0, 1, 2, 3, 10].includes(idStatusDialogAction.value)
}

const disabledCheckboxListInsp = () => {
  return [0, 1, 2, 3, 4, 5, 10].includes(idStatusDialogAction.value)
}

const disabledCheckboxListPk = () => {
  return [0, 1, 2, 3, 4, 5, 10].includes(idStatusDialogAction.value)
}

const disabledCheckboxListLorry = () => {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].includes(idStatusDialogAction.value)
}

const typeLorryID = ref(null)

const checkTypeLorryToPrintPDF = () => {
  const typeID = ref(sessionStorage.getItem('typeLorryInfoId'))
  switch (typeLorryID.value) {
  case '01':
    return 'LorryFormIPA'
  case '02':
    return "LorryFormEA"
  case '03':
    return "LorryFormEPICHLO"
  case '04':
    return 'LorryFormSKTEP-400BE11V-144'
  case '05':
    return "LorryFormSKTEP-400BE11V-145"
  case '06':
    return "LorryFormKARAMU"
  case '07':
    return "LorryFormAKUMARU"
  case '09':
    return "LorryFormHAKU-C(11V-111)"
  case '10':
    return "LorryFormEKI-A(11V-110)"
  case '11':
    return "LorryFormDIESELOIL"
  case '12':
    return "LorryFormTELA"
  case '13':
    return "LorryFormEKI-ATANK(11V-432)"
  case '15':
    return "LorryFormNPAN"
  case '16':
    return "LorryFormSANNIXFA-703V"
  default:
    console.warn(`No component found for key: ${typeID.value}`)
    
    return null
  }
}

const printFormAll = async () => {
  // ตั้งค่าสถานะการประมวลผลให้เป็น true
  processingPrint.value = true

  const typeReceiving = ref('ReceivingForm')

  const printPromises = selectedPrintLabel.value.map(async label => {
    if (label === 'Receiving Form') {
      processingPrintForm1.value = true // เริ่มพิมพ์
      console.log('Printing Receiving Form...')

      if(receivingTypeAction.value === 2){
        typeReceiving.value = 'ReceivingForm'
      }else if(receivingTypeAction.value === 3){
        typeReceiving.value = 'ReceivingFormByLorry'
      }

      try {
        return await printReceivingFormService(typeReceiving.value, poEtILogAction.value, urlApi.value, whereHouse, accessTokenAtStore) // คืนค่าผลลัพธ์
      } finally {
        processingPrintForm1.value = false // เสร็จสิ้นการพิมพ์
      }
    }
    if (label === 'Inspection Request Form') {
      processingPrintForm2.value = true // เริ่มพิมพ์
      console.log('Printing Inspection Request Form...')

      try {
        return await printInspectionFormService(poEtILogAction.value, urlApi.value, whereHouse, accessTokenAtStore) 
      } finally {
        processingPrintForm2.value = false // เสร็จสิ้นการพิมพ์
      }
    }
    if (label === 'Packaging Inspection Request Form') {
      processingPrintForm3.value = true // เริ่มพิมพ์
      console.log('Printing Packaging Inspection Request Form...')

      try {
        return await printPackagingFormService(poEtILogAction.value, urlApi.value, whereHouse, accessTokenAtStore)
      } finally {
        processingPrintForm3.value = false // เสร็จสิ้นการพิมพ์
      }
    }

    if (label === 'Lorry Loading Checklist') {
      processingPrintForm4.value = true // เริ่มพิมพ์
      console.log('Printing Lorry Loading Checklist...')

      const typeLorryID = ref(checkTypeLorryToPrintPDF())

      try {
        console.log('Printing Lorry Loading Checklist...', typeLorryID.value)
        
        return await printIPAFormService(typeLorryID.value, poEtILogAction.value, urlApi.value, whereHouse, accessTokenAtStore)
      } finally {
        processingPrintForm4.value = false // เสร็จสิ้นการพิมพ์
      }
    }
  })

  // รอให้ฟังก์ชันทั้งหมดทำงานเสร็จ
  try {
    const results = await Promise.all(printPromises)

    processingPrint.value = false
    console.log('All forms printed:', results)
  } catch (error) {
    console.error('Error printing forms:', error)
  }
}

const printReceivingForm = () => {
  console.log('Printing Receiving Form...')

  // การพิมพ์ฟอร์มสามารถใช้ window.print หรืออื่นๆ ตามต้องการ
}

const checkPersistent = computed(() => {
  if (processingPrintLabel.value === true || processingPrint.value === true) {
    return true
  }
  console.log("false")
  
  return false
})

//-------------------- print Excel---------------------------------
const { printExportExcelResult, printExportExcelService } = usePrintExportExcelService()

const loadingPrintExportExcel = ref(false)

const printExportExcelFunction = async () => {
  console.log('Staet Export!')
  loadingPrintExportExcel.value = true

  const { deliveryDateRange, productId, productName, supplierId, supplierName, purchaseOrderNo } = searchFilters.value

  // จัดการวันที่
  if (deliveryDateRange) {
    const [fromDate, toDate] = deliveryDateRange.split(" to ")

    deliveryDateFrom.value = fromDate || ''
    deliveryDateTo.value = toDate || ''
  } else {
    deliveryDateFrom.value = ''
    deliveryDateTo.value = ''
  }

  // จัดการสถานะ
  fileterStatusInPAI.value = statusFilter.value === 'All' ? '' : statusFilter.value

  // แปลงสถานะเป็น String
  const fileterStatusInApiStr = typeof fileterStatusInPAI.value === 'object' && fileterStatusInPAI.value !== null
    ? fileterStatusInPAI.value.join(',')
    : fileterStatusInPAI.value

  
  // กำหนดค่า params
  const params = {
    deliveryDateFrom: deliveryDateFrom.value,
    deliveryDateTo: deliveryDateTo.value,
    productId: productId,
    productName: productName,
    supplierId: supplierId,
    supplierName: supplierName,
    statusName: fileterStatusInApiStr || '',
    purchaseOrderNo: purchaseOrderNo,
  }

  console.log('Staet Export!6')

  // ตรวจสอบว่ามีค่าที่ไม่ว่างอย่างน้อยหนึ่งค่าใน params
  const filledParamsCount = Object.values(params).filter(value => value !== null && value !== '').length

  console.log('Staet Export!6.5')

  if (filledParamsCount < 1) {
    console.log('กรุณากรอกข้อมูลอย่างน้อย 1 ค่าในฟิลด์ที่จำเป็น')
    loadingPrintExportExcel.value = false
    console.log('Staet Export!6.5.2')

    return
  }

  console.log('Staet Export!7')
  
  try {
    // รอให้ printExportExcel ทำงานและได้ผลลัพธ์กลับมา
    await printExportExcelService(urlApi.value, whereHouse, accessTokenAtStore, params)
    console.log('Staet Export!')
    console.log('การส่งออก Excel เสร็จสมบูรณ์')
    loadingPrintExportExcel.value = false
  } catch (error) {
    loadingPrintExportExcel.value = false
    console.error('เกิดข้อผิดพลาดในการส่งออก Excel:', error)
  }
  loadingPrintExportExcel.value = false
}

//-------------------- Dialog Confirm Submit --------------------
const isDialogConfirmVisible = ref(false)
const isDialogSubmitSuccessVisible = ref(false)

const wordForSubmit = ref('Word')

const submitButton = word => {
  isDialogConfirmVisible.value = true
  wordForSubmit.value = word
}

const submitButtonVisible = () => {
  isDialogSubmitSuccessVisible.value = true
  isDialogConfirmVisible.value = false
}

const completeSubmit = () => {
  isDialogSubmitSuccessVisible.value = false
  isDialogConfirmVisible.value = false
}

//-------------------------------------- Sub Fuction --------------------------------
//-------- Fuction Action --------------------------------

//-------- Approve -----------------------------------------

const selectedDataTables = ref([])

const selectedItemIdForColotRow = ref(null)

const testCheckBox = () => {
  console.log("%c selectedDataTables: ", "color: blue; background-color: yellow; font-size: 16px", selectedDataTables.value)

}

const statusCheckApprove = ref('')

const approveReceivingPlant = () => {
  selectedDataTables.value.forEach(item => {
    // นำ poEtlLogDetailJournalID จากแต่ละ item ไปใส่ใน URL

    selectedItemIdForColotRow.value = item.itemCode

    if(item.statusId === 15 || item.statusId === 7){
      statusCheckApprove.value = item.statusId
      axiosIns.post(`${urlApi.value}/api/v1/ReceivingPlan/whapproval/${item.poEtlLogDetailJournalID}`, {}, {
        headers: {
          'accept': '*/*',
          'x-location': `${whereHouse}`,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
        params: {
          stockId: whereHouse,
        },
      })
        .then(response => {
          console.log(`Response for poEtlLogDetailJournalID ${item.poEtlLogDetailJournalID}:`, response.data)

          // isDialogSubmitSuccessVisible.value = true
          isDialogConfirmVisible.value = false

          // รีเฟรชหน้าจอทั้งหมด
          window.location.reload()
        })
        .catch(error => {
          // Handle errors
          console.error(`Error for poEtlLogDetailJournalID ${item.poEtlLogDetailJournalID}:`, error)
          isDialogSubmitFailedVisible.value = true
        })
    } else {
      
      statusCheckApprove.value = item.statusId
      console.log(`Status ID not equal to 17 for poEtlLogDetailJournalID ${item.poEtlLogDetailJournalID}:`, item.statusId, statusCheckApprove.value)
    }
    
  })
}

const isSelected = item => {
  return selectedDataTables.value.some(
    selectedItem => selectedItem.journalID === item.journalID,
  )
}


const testBtn = () => {
  console.log('selectedDataTables', selectedDataTables.value)
}

//-------- Fuction Cancel --------------------------------
const isDialogSubmitFailedVisible = ref(false)

const cancelReceivingPlan = () => {
  // กำหนดข้อมูลที่จะส่งใน body
  const data = {
    journalID: journalIDModel.value, // หรือค่าที่เหมาะสมตามต้องการ
    statusComments: filteredDetails.value.statusComments, // ใส่ข้อมูลที่ต้องการ
    updatedBy: updateByReceivingPlan.value, // ใส่ข้อมูลที่ต้องการ
  }


  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.post(`${urlApi.value}/api/v1/ReceivingPlan/Cancel`, data, {
    headers: {
      'accept': '*/*',
      'x-location': `${searchByWareHouseId.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {
      const result = response.data.datas

      console.log('subTypeId', result)
      wordForSubmit.value = 'Cancel'
      isDialogSubmitSuccessVisible.value = true
      location.reload()
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
      wordForSubmit.value = 'Cancel'
      isDialogSubmitFailedVisible.value = true
    })

}

const backToEditReceivingPlan = () => {
  // กำหนดข้อมูลที่จะส่งใน body
  const data = {
    journalID: journalIDModel.value, // หรือค่าที่เหมาะสมตามต้องการ
    statusComments: filteredDetails.value.statusComments, // ใส่ข้อมูลที่ต้องการ
    updatedBy: updateByReceivingPlan.value, // ใส่ข้อมูลที่ต้องการ
  }

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.post(`${urlApi.value}/api/v1/ReceivingPlan/BackToEdit?`, data, {
    headers: {
      'accept': '*/*',
      'x-location': `${searchByWareHouseId.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {
      const result = response.data.datas

      console.log('subTypeId', result)
      wordForSubmit.value = 'Cancel'
      isDialogSubmitSuccessVisible.value = true
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
      wordForSubmit.value = 'Cancel'
      isDialogSubmitFailedVisible.value = true
    })

}

const rejectReceivingPlan = () => {
  // กำหนดข้อมูลที่จะส่งใน body
  const data = {
    journalID: journalIDModel.value, // หรือค่าที่เหมาะสมตามต้องการ
    statusComments: filteredDetails.value.statusComments, // ใส่ข้อมูลที่ต้องการ
    updatedBy: updateByReceivingPlan.value, // ใส่ข้อมูลที่ต้องการ
  }

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.post(`${urlApi.value}/api/v1/ReceivingPlan/Reject?`, data, {
    headers: {
      'accept': '*/*',
      'x-location': `${searchByWareHouseId.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {
      const result = response.data.datas

      console.log('subTypeId', result)
      wordForSubmit.value = 'Cancel'
      isDialogSubmitSuccessVisible.value = true
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
      wordForSubmit.value = 'Cancel'
      isDialogSubmitFailedVisible.value = true
    })

}

const hideColumnsTable = () => {

}

//-------------------------------------- End Sub Fuction --------------------------------

//---------------------------------- Date Picker --------------------------------
//------- Date Picker Filter --------------------------------
const dateDeliveryFilter = ref()

// For demo purposes assign range from the current date
onMounted(() => {
  const startDate = new Date()
  const endDate = new Date(new Date().setDate(startDate.getDate() + 7))

  dateDeliveryFilter.value = [startDate, endDate]
})

//--------------------- Dialog Cancel ------------------------
const isDialogVisibleCanncel = ref(false)

//--------------------- Dialog Reject ------------------------
const isDialogVisibleReject = ref(false)

//--------------------- Dialog Back to Edit ------------------------
const isDialogVisibleEdit = ref(false)

//------------------------- Dialog Details For RVCD Qty --------------------------
const isDialogVisibleDetailsRCVD = ref(false)
const itemCodeDialogDetails = ref('asdasd')

const showDialogItemDetails = code => {
  console.log(code)
  isDialogVisibleDetailsRCVD.value = true
  itemCodeDialogDetails.value = code
}

//-------------------------------------------- Bottom Refesh --------------------------------
const refeshPage = () => {
  isSpinning.value = true
  setTimeout(() => {
    isSpinning.value = false
  }, 10*1000) // ระยะเวลาในการหมุน (1000 มิลลิวินาที = 1 วินาที)
  location.reload()
}

const isSpinning = ref(false)

//------------ Debug Role ----------------------

// Reactive variable to hold the current value
const insetSwitch1 = ref('')

//---------------------- Test Mock-
</script>

<template>
  <!-- Title Page -->
  <div v-if="true">
    <VCard>
      <VCardTitle>
        <div class="d-flex align-center">
          <VRow class="d-flex align-center">
            <VCol
              cols="2"
              class="py-2"
            >
              <IconBtn
                v-if="false"
                class="cursor-pointer"
                color="#FFFFFF"
                :to="{ name: 'dashboards-main',
                }"
              >
                <VIcon
                  size="30"
                  icon="ri-close-circle-fill"
                  color="#000000"
                />
              </IconBtn>
              <IconBtn
                class="cursor-pointer"
                color="#FFFFFF"
              >
                <VIcon
                  size="30"
                  icon="ri-close-circle-fill"
                  color="#000000"
                />
              </IconBtn>
            </VCol>
            <VCol
              cols="8"
              class="text-center py-2"
            >
              <div>
                <span
                  style="font-size: 18px; font-weight: bold;"
                  class="text-center"
                >{{ $t('Receiving Plan') }}</span>
              </div>
            </VCol>
            <VCol
              cols="2"
              class="d-flex justify-end py-2"
            >
              <VBtn
                style="height: 30px;"
                variant="flat"
                @click="panel = panel.length ? [] : ['filter']"
              >
                <VIcon icon="ri-equalizer-line" />
              </VBtn>
            </VCol>
          </VRow>
        </div>
      </VCardTitle>
    </VCard>
    <!-- Expension Filter -->
    <section>
      <VExpansionPanels
        v-model="panel"
        multiple
        class="pa-0"
      >
        <VExpansionPanel
          class="px-1"
          value="filter"
        >
          <VExpansionPanelText class="px-1">
            <VRow class="px-1">
              <VCol
                cols="12"
                lg="4"
                sm="6"
                class="py-2"
              >
                <VSelect
                  v-model="statusFilter"
                  :items="itemStatus"
                  item-title="statusText"
                  item-value="statusText"
                  density="compact"
                >
                  <template #label>
                    <span
                      class="d-flex align-center"
                      style="font-size: 12px;"
                    >
                      Select Status
                    </span>
                  </template>

                  <template #selection="{ item }">
                    <VChip
                      variant="elevated"
                      :style="{ color: colorStatusWithId(item.raw.statusId).message }"
                      size="x-small"
                      style="min-height: 20px;"
                      :color="colorStatusWithId(item.raw.statusID).color"
                    >
                      <span>{{ item.raw.statusText === '' ? 'All' : item.raw.statusText }}</span>
                    </VChip>
                  </template>
                </VSelect>
              </VCol>

              <!-- 👉 Select Product code -->
              <VCol
                cols="12"
                lg="4"
                sm="6"
                class="py-2"
              >
                <VTextField
                  v-model="tempFilters.productId"
                  density="compact"
                  height="20px"
                  class="py-0"
                >
                  <template #label>
                    <span
                      class="d-flex align-center"
                      style="font-size: 12px;"
                    >
                      Item Code
                    </span>
                  </template>
                </VTextField>
              </VCol>

              <!-- 👉 Select Product Name -->
              <VCol
                cols="12"
                lg="4"
                sm="6"
                class="py-2"
              >
                <VTextField
                  v-model="tempFilters.productName"
                  density="compact"
                  height="20px"
                  class="py-0"
                >
                  <template #label>
                    <span style="font-size: 12px;">
                      Item Name
                    </span>
                  </template>
                </VTextField>
              </VCol>
              <VCol
                cols="12"
                lg="4"
                sm="6"
                class="py-1"
              >
                <AppDateTimePicker
                  v-model="tempFilters.deliveryDateRange"
                  placeholder="Select Date"
                  density="compact"
                  :config="{ mode: 'range',dateFormat: 'd/m/Y' }"
                  prepend-inner-icon="ri-calendar-schedule-fill"
                  class="custom-date-time-picker"
                >
                  <template #label>
                    <span>Delivery Date</span>
                  </template>
                </AppDateTimePicker>
              </VCol>
              <VCol
                cols="12"
                lg="4"
                sm="6"
                class="py-1"
              >
                <VTextField
                  v-model="tempFilters.purchaseOrderNo"
                  density="compact"
                >
                  <template #label>
                    <span style="font-size: 12px;">
                      P/O No.
                    </span>
                  </template>
                </VTextField>
              </VCol>
              <VCol
                cols="12"
                lg="4"
                sm="6"
                class="py-1"
              >
                <VTextField
                  v-model="tempFilters.supplierName"
                  :label="$t('Supplier Name')"
                  type="Supplier Name"
                  density="compact"
                >
                  <template #label>
                    <span style="font-size: 12px;">
                      Supplier Name
                    </span>
                  </template>
                </VTextField>
              </VCol>

              <!-- 👉 Button Search and Export -->
              <VCol
                cols="12"
                lg="4"
                sm="6"
                class="py-1"
              />
              <VCol
                cols="12"
                lg="4"
                sm="6"
                class="py-1"
              />
              <VCol
                cols="12"
                lg="4"
                sm="6"
                class="py-1"
              >
                <VRow>
                  <VCol
                    cols="4"
                    md="4"
                  >
                    <VBtn
                      height="100%"
                      width="100%"
                      color="green"
                      density="compact"
                      class="mx-0"
                      style="font-size: 12px;"
                      @click="handleSearch"
                    >
                      {{ $t('Search') }}
                    </VBtn>
                  </VCol>
                  <VCol
                    cols="4"
                    md="4"
                  >
                    <VBtn
                      color="red"
                      height="100%"
                      width="100%"
                      density="compact"
                      style="font-size: 12px;"
                      @click="clearModel"
                    >
                      {{ $t('Clear') }}
                    </VBtn>
                  </VCol>
                  <VCol
                    cols="4"
                    md="4"
                  >
                    <VBtn
                      :disabled="disBtnExoport"
                      density="compact"
                      class=" px-16 px-sm-12 pa-sm-1 custom-small-btn-excel"
                      color="warning"
                      style="width: 100%; height: 40px;"
                      @click="printExportExcelFunction"
                    >
                      <img
                        v-if="!loadingPrintExportExcel"
                        src="/src/assets/images/icons/vscode-icons_file-type-excel2.png"
                        style="width: 27px;"
                        class="custom-small-img"
                      >

                      <VProgressCircular
                        v-if="loadingPrintExportExcel"
                        indeterminate
                        color="success"
                      >
                        <img
                          src="/src/assets/images/icons/vscode-icons_file-type-excel2.png"
                          style="width: 18px;"
                          class="custom-small-img"
                        >
                      </VProgressCircular>
                      <span style="font-size: 12px;">{{ $t('Export file') }}</span>
                    </VBtn>
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </section>

    <!-- Btn Approve -->
    <section class="mb-4 mt-2">
      <VCard>
        <VCardText class="pa-2 d-flex justify-space-between align-center">
          <VBtn
            style="font-size: 12px;"
            :disabled="selectedDataTables.length < 1"
            @click="submitButton('Approve')"
          >
            Approve
          </VBtn>

          <VBtn
            v-if="false"
            :disabled="insetSwitch1 === 'issues'"
            style="font-size: 12px;"
            @click="testBtn"
          >
            Test
          </VBtn>

          <VSwitch
            v-if="false"
            v-model="insetSwitch1"
            :inset="false"
            true-value="issues"
            false-value="manager"
            :label="`Role: ${insetSwitch1}`"
          />
          <VBtn
            icon
            size="small"
            @click="refeshPage"
          >
            <VIcon
              size="20"
              icon="ri-restart-line"
              :class="{ spinning: isSpinning }"
            />
          </VBtn>
        </VCardText>
      </VCard>
    </section>
  </div>
  
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
                }} :</span>{{ detailsProduct }}
              </div>
            </VCardText>
          </div>
        </VExpandTransition>
      </VCard>
    </VDialog>
  </section>

  <!-- Dialog Reject -->
  <section>
    <VDialog
      v-model="isDialogVisibleReject"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard title="Remark Reject">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogVisibleReject = false"
        />

        <VCardText>
          <VTextarea
            label="Remark Reject"
            placeholder="Enter Remark Reject"
          />
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            color="error"
            @click="isDialogVisibleReject = false; isDialogVisibleAction = false"
          >
            Reject
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <!-- Dialog Cnacel -->
  <section>
    <VDialog
      v-model="isDialogVisibleCanncel"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard title="Remark Cancel">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogVisibleCanncel = false"
        />

        <VCardText>
          <VTextarea
            v-model="filteredDetails.statusComments"
            label="Remark"
            placeholder="Enter Remark Cancel"
          />
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            color="error"
            @click="cancelReceivingPlan"
          >
            Cancel
          </VBtn>
          <VBtn
            v-if="false"
            color="warning"
            @click="isDialogVisibleCanncel = false; isDialogVisibleAction = false"
          >
            close
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <!-- Dialog Back to edit -->
  <section>
    <VDialog
      v-model="isDialogVisibleEdit"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard title="Remark Back To Edit">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogVisibleEdit = false"
        />

        <VCardText>
          <VTextarea
            label="Remark Back To Edit"
            placeholder="Enter Remark Back To Edit"
          />
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            color="info"
            @click="isDialogVisibleEdit = false; isDialogVisibleAction = false"
          >
            Back To Edit
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <!-- Dialog Submit -->
  <section>
    <VDialog
      v-model="isDialogConfirmVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardText>
          <div class="d-flex justify-center">
            <VIcon
              size="100"
              color="warning"
              icon="ri-question-line"
            />
          </div>
          <div class="text-center">
            <span style="font-size: 22px; font-weight: bolder;">Would You Like To {{ wordForSubmit }} Transaction?</span>
          </div>
        </VCardText>

        <VCardAction class="d-flex justify-space-between pa-4">
          <VBtn
            color="error"
            @click="isDialogConfirmVisible = false"
          >
            Cancel
          </VBtn>
          <VBtn
            v-if="wordForSubmit ==! 'Approve'"
            color="green"
            @click="submitButtonVisible"
          >
            {{ wordForSubmit }}
          </VBtn>

          <VBtn
            v-if="wordForSubmit === 'Approve'"
            color="green"
            @click="approveReceivingPlant"
          >
            {{ wordForSubmit }}
          </VBtn>
        </VCardAction>
      </VCard>
    </VDialog>
  </section>
  <!-- Dialog Submit Success -->
  <section>
    <VDialog
      v-model="isDialogSubmitSuccessVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardText>
          <div class="d-flex justify-center">
            <VIcon
              size="100"
              color="success"
              icon="ri-checkbox-circle-line"
            />
          </div>
          <div class="text-center">
            <span style="font-size: 22px; font-weight: bolder;">{{ wordForSubmit }} Success</span>
          </div>
        </VCardText>

        <VCardAction class="d-flex justify-center pa-4">
          <VBtn
            color="success"
            @click="completeSubmit"
          >
            Continue
          </VBtn>
        </VCardAction>
      </VCard>
    </VDialog>
  </section>
  <!-- Dialog Submit Failed -->
  <section>
    <VDialog
      v-model="isDialogSubmitFailedVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardText>
          <div class="d-flex justify-center">
            <VIcon
              size="100"
              color="error"
              icon="ri-error-warning-line"
            />
          </div>
          <div class="text-center">
            <span style="font-size: 22px; font-weight: bolder;">{{ wordForSubmit }} Failed</span>
          </div>
        </VCardText>

        <VCardAction class="d-flex justify-center pa-4">
          <VBtn
            color="error"
            @click="isDialogSubmitFailedVisible = false"
          >
            Continue
          </VBtn>
        </VCardAction>
      </VCard>
    </VDialog>
  </section>

  <!-- Dialog Action -->
  <section v-if="accountRole === 'issues' ">
    <VDialog
      v-model="isDialogVisibleAction"
      width="600"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardTitle
          style="font-size: 18px;"
          class="text-center"
        >
          RECEIVING PLAN DETAILS
        </VCardTitle>
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogVisibleAction = false"
        />

        <VCardText class="pt-0">
          <VTable
            height="600"
            fixed-header
          >
            <thead>
              <tr class="bg-table-header-background">
                <th class="bg-table-header-background">
                  <span style="font-size: 12px; text-transform: capitalize;">Field</span>
                </th>
                <th class="bg-table-header-background">
                  <span style="font-size: 12px; text-transform: capitalize;">Value</span>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <th><span style="font-size: 12px; text-transform: capitalize;">{{ getDisplayName('statusText') }}</span></th>
                <td class="px-2">
                  <VChip :color="colorStatusWithId2(idStatusDialogAction).color">
                    <span
                      :style="{ color: colorStatusWithId(idStatusDialogAction).message }"
                      style="font-size: 12px; text-transform: capitalize;"
                    >{{ filteredDetails.statusText }}</span>
                  </VChip>
                </td>
              </tr>
            </tbody>
            <tbody style="font-size: 12px;">
              <tr>
                <td style="font-weight: 500;">
                  Item Code
                </td>
                <td>{{ resultDetailsAvtion.itemCode }}</td>
              </tr>
              <tr>
                <td style="font-weight: 500;">
                  Item Name
                </td>
                <td>{{ resultDetailsAvtion.itemName }}</td>
              </tr>
              <tr>
                <td style="font-weight: 500;">
                  Supplier Code
                </td>
                <td>{{ resultDetailsAvtion.supplierId }}</td>
              </tr>
              <tr>
                <td style="font-weight: 500;">
                  Supplier Name
                </td>
                <td>{{ resultDetailsAvtion.supplierName }}</td>
              </tr>
              <tr>
                <td style="font-weight: 500;">
                  Purchase Order No
                </td>
                <td>{{ resultDetailsAvtion.purchaseOrderNo }}</td>
              </tr>
              <tr v-if="!resultDetailsAvtion.expectDeliveryDate">
                <td style="font-weight: 500;">
                  Delivery Date
                </td>
                <td>{{ convertDate(resultDetailsAvtion.deliveryDate) }}</td>
              </tr>
              <tr v-if="resultDetailsAvtion.expectDeliveryDate">
                <td style="font-weight: 500;">
                  Delivery Date
                </td>
                <td><span v-if="convertDate(resultDetailsAvtion.expectDeliveryDate) !== '01/01/1970'">{{ convertDate(resultDetailsAvtion.expectDeliveryDate) }}</span></td>
              </tr>
              <tr>
                <td style="font-weight: 500;">
                  Purchasing Qty
                </td>
                <td>
                  <span style="text-transform: capitalize;">{{ resultDetailsAvtion.purchasingQuantityPcs.toLocaleString() }}  PCS</span>
                </td>
              </tr>
              <tr>
                <td>Purchasing Amount</td>
                <td><span style="text-transform: capitalize;">{{ formatNumber(resultDetailsAvtion.purchasingAmountKgs).toLocaleString() }}  Kgs</span></td>
              </tr>
              <tr>
                <td>Receiving Qty</td>
                <td>{{ (resultDetailsAvtion.purchasingQuantityRcvdPcs).toLocaleString() }} PCS</td>
              </tr>
              <tr>
                <td>Receiving Amount</td>
                <td>{{ formatNumber(resultDetailsAvtion.purchasingAmountRcvdKgs).toLocaleString() }} Kgs</td>
              </tr>
              <tr>
                <td style="font-weight: 500;">
                  Received Date
                </td>
                <td><span v-if="convertDate(resultDetailsAvtion.receivedDate) !== '01/01/1970'">{{ convertDate(resultDetailsAvtion.receivedDate) }}</span></td>
              </tr>
              <tr>
                <td>Updated Date</td>
                <td>{{ convertDateTime(resultDetailsAvtion.updatedDate) }}</td>
              </tr>
              <tr>
                <td>Updated By</td>
                <td>{{ resultDetailsAvtion.updatedBy }}</td>
              </tr>
              <!-- เพิ่มข้อมูลเพิ่มเติมตามต้องการ -->
              <div v-if="false">
                <span
                  v-if="detailsReceiv.statusText !== 'Waiting for Editing for Partial Receiving'"
                  style="text-transform: capitalize;"
                >{{ formatNumber(detailsReceiv.purchasingAmountKgs) }} Kgs</span>
                <VTextField
                  v-if="detailsReceiv.statusText === 'Waiting for Editing for Partial Receiving'"
                  v-model="detailsReceiv.purchasingAmountKgs"
                  label="Purchesing Amount"
                  suffix="Kgs"
                  type="number"
                  density="compact"
                  placeholder="2000"
                  :step="0.01"
                  pattern="^\d+(\.\d{1,2})?$"
                />
              </div>
              <div v-if="false">
                <span
                  v-if="detailsReceiv.statusText !== 'Waiting for Editing for Partial Receiving' && key !== 'statusText'"
                  style="text-transform: capitalize;"
                >{{ detailsReceiv.purchasingQuantityPcs.toLocaleString() }}  PCS</span>
                <VTextField
                  v-if="detailsReceiv.statusText === 'Waiting for Editing for Partial Receiving'"
                  v-model="detailsReceiv.purchasingQuantityPcs"
                  label="Purchesing Qty"
                  suffix="PCS"
                  type="number"
                  density="compact"
                />
              </div>
            </tbody>
          </VTable>
        </VCardText>

        <VCardText class="d-flex justify-center flex-wrap gap-4">
          <VBtn
            v-if="detailsReceiv.statusText === 'Waiting for Editing for Partial Receiving'"
            color="green"
            style="font-size: 12px;"
            @click="submitButton('Edit')"
          >
            Confirm
          </VBtn>
          <VBtn
            v-if="detailsReceiv.statusText === 'ETL Failed!' && detailsReceiv.statusText !== 'Waiting for Editing for Partial Receiving' && detailsReceiv.statusText !== 'Cancel'"
            color="red"
            style="font-size: 12px;"
            @click="isDialogVisibleCanncel = true"
          >
            Cancel
          </VBtn>
          <VBtn
            v-if="detailsReceiv.statusText !== 'ETL Failed!' && detailsReceiv.statusText !== 'Waiting for Editing for Partial Receiving' && detailsReceiv.statusText !== 'Cancel'"
            color="warning"
            style="font-size: 12px;"
            @click="isDialogVisibleActionPrintLabel = true"
          >
            Print Label &  Form
          </VBtn>
          <VBtn
            v-if="detailsReceiv.statusText !== 'ETL Failed!' && detailsReceiv.statusText !== 'Waiting for Editing for Partial Receiving' && detailsReceiv.statusText !== 'Cancel'"
            :color="colorStatusWithId2(idStatusDialogAction).color"
            style="font-size: 12px;"
            :disabled="!checkReceivedStatus(detailsReceiv.statusText)"
            :to="{ 
              name: 'skt-receiving-receingForm'
            }"
          >
            <span class="text-white">{{ detailsReceiv.statusText }}</span>
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <section v-if="accountRole === 'manager'">
    <VDialog
      v-model="isDialogVisibleAction"
      width="600"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardTitle class="text-center py-0 mt-4">
          RECEIVING PLAN DETAILS
        </VCardTitle>
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogVisibleAction = false"
        />

        <VCardText class="pt-0">
          <VTable
            height="700"
            fixed-header
          >
            <thead>
              <tr class="bg-table-header-background">
                <th class="bg-table-header-background">
                  <span style="font-size: 12px; text-transform: capitalize;">Field</span>
                </th>
                <th class="bg-table-header-background">
                  <span style="font-size: 12px; text-transform: capitalize;">Value</span>
                </th>
              </tr>
            </thead>

            <tbody style="font-size: 12px;">
              <tr>
                <th><span style="font-size: 12px; text-transform: capitalize;">{{ getDisplayName('statusText') }}</span></th>
                <td>
                  <VChip :color="colorStatusWithId2(idStatusDialogAction).color">
                    <span
                      :style="{ color: colorStatusWithId(idStatusDialogAction).message }"
                      style="font-size: 12px; text-transform: capitalize;"
                    >{{ filteredDetails.statusText }}</span>
                  </VChip>
                  <VChip
                    :color="colorStatusWithId2(filteredDetails).color"
                    class="font-weight-medium"
                    style="min-height: 50px;"
                    :style="{ color: colorStatusWithId(filteredDetails).message }"
                  >
                    <span
                      style="font-size: 12px;"
                      class="text-wrap"
                    >{{ item.raw.statusText }}</span>
                  </VChip>
                </td>
              </tr>
            </tbody>
            <tbody style="font-size: 12px;">
              <tr>
                <td style="font-weight: 500;">
                  Item Code
                </td>
                <td>{{ resultDetailsAvtion.itemCode }}</td>
              </tr>
              <tr>
                <td style="font-weight: 500;">
                  Item Name
                </td>
                <td>{{ resultDetailsAvtion.itemName }}</td>
              </tr>
              <tr>
                <td style="font-weight: 500;">
                  Supplier Code
                </td>
                <td>{{ resultDetailsAvtion.supplierId }}</td>
              </tr>
              <tr>
                <td style="font-weight: 500;">
                  Supplier Name
                </td>
                <td>{{ resultDetailsAvtion.supplierName }}</td>
              </tr>
              <tr>
                <td style="font-weight: 500;">
                  Purchase Order No
                </td>
                <td>{{ resultDetailsAvtion.purchaseOrderNo }}</td>
              </tr>
              <tr>
                <td style="font-weight: 500;">
                  Delivery Date
                </td>
                <td>{{ convertDate(resultDetailsAvtion.deliveryDate) }}</td>
              </tr>
              <tr v-if="false">
                <td style="font-weight: 500;">
                  Expect Delivery Date
                </td>
                <td><span v-if="convertDate(resultDetailsAvtion.expectDeliveryDate) !== '01/01/1970'">{{ convertDate(resultDetailsAvtion.expectDeliveryDate) }}</span></td>
              </tr>
              <tr>
                <td style="font-weight: 500;">
                  Purchasing Qty
                </td>
                <td>
                  <span style="text-transform: capitalize;">{{ resultDetailsAvtion.purchasingQuantityPcs.toLocaleString() }}  PCS</span>
                </td>
              </tr>
              <tr>
                <td>Purchasing Amount</td>
                <td><span style="text-transform: capitalize;">{{ formatNumber(resultDetailsAvtion.purchasingAmountKgs).toLocaleString() }}  Kgs</span></td>
              </tr>
              <tr>
                <td>Receiving Qty</td>
                <td>{{ (resultDetailsAvtion.purchasingQuantityRcvdPcs).toLocaleString() }} PCS</td>
              </tr>
              <tr>
                <td>Receiving Amount</td>
                <td>{{ formatNumber(resultDetailsAvtion.purchasingAmountRcvdKgs).toLocaleString() }} Kgs</td>
              </tr>
              <tr>
                <td style="font-weight: 500;">
                  Received Date
                </td>
                <td><span v-if="convertDate(resultDetailsAvtion.receivedDate) !== '01/01/1970'">{{ convertDate(resultDetailsAvtion.receivedDate) }}</span></td>
              </tr>
              <tr>
                <td>Updated Date</td>
                <td>{{ convertDateTime(resultDetailsAvtion.updatedDate) }}</td>
              </tr>
              <tr>
                <td>Updated By</td>
                <td>{{ resultDetailsAvtion.updatedBy }}</td>
              </tr>
              <tr>
                <td style="font-weight: 500;">
                  Received Date
                </td>
                <td><span v-if="convertDate(resultDetailsAvtion.receivedDate) !== '01/01/1970'">{{ convertDate(resultDetailsAvtion.receivedDate) }}</span></td>
              </tr>
              <!-- เพิ่มข้อมูลเพิ่มเติมตามต้องการ -->
              <div v-if="false">
                <span
                  v-if="detailsReceiv.statusText !== 'Waiting for Editing for Partial Receiving'"
                  style="text-transform: capitalize;"
                >{{ formatNumber(detailsReceiv.purchasingAmountKgs) }} Kgs</span>
                <VTextField
                  v-if="detailsReceiv.statusText === 'Waiting for Editing for Partial Receiving'"
                  v-model="detailsReceiv.purchasingAmountKgs"
                  label="Purchesing Amount"
                  suffix="Kgs"
                  type="number"
                  density="compact"
                  placeholder="2000"
                  :step="0.01"
                  pattern="^\d+(\.\d{1,2})?$"
                />
              </div>
              <div v-if="false">
                <span
                  v-if="detailsReceiv.statusText !== 'Waiting for Editing for Partial Receiving' && key !== 'statusText'"
                  style="text-transform: capitalize;"
                >{{ detailsReceiv.purchasingQuantityPcs.toLocaleString() }}  PCS</span>
                <VTextField
                  v-if="detailsReceiv.statusText === 'Waiting for Editing for Partial Receiving'"
                  v-model="detailsReceiv.purchasingQuantityPcs"
                  label="Purchesing Qty"
                  suffix="PCS"
                  type="number"
                  density="compact"
                />
              </div>
            </tbody>
          </VTable>
        </VCardText>

        <VCardText class="d-flex justify-center flex-wrap gap-4">
          <VBtn
            v-if="detailsReceiv.statusText === 'Waiting for Editing for Partial Receiving'"
            style="font-size: 12px;"
            color="green"
            @click="submitButton('Edit')"
          >
            Confirm
          </VBtn>
          
          <VBtn
            v-if="detailsReceiv.statusText === 'ETL Failed!' && detailsReceiv.statusText !== 'Waiting for Editing for Partial Receiving'"
            style="font-size: 12px;"
            color="red"
            @click="isDialogVisibleReject = true"
          >
            Reject
          </VBtn>
          
          <VBtn
            v-if="detailsReceiv.statusText !== 'ETL Failed!' && detailsReceiv.statusText !== 'Waiting for Editing for Partial Receiving' && detailsReceiv.statusText !== 'Cancel'"
            style="font-size: 12px;"
            color="warning"
            @click="isDialogVisibleActionPrintLabel = true"
          >
            Print Label & Form
          </VBtn>
          <VBtn
            v-if="detailsReceiv.statusText !== 'ETL Failed!' && detailsReceiv.statusText !== 'Waiting for Editing for Partial Receiving' && detailsReceiv.statusText !== 'Cancel'"
            style="font-size: 12px;"
            :disabled="!checkReceivedStatus(detailsReceiv.statusText)"
            :to="{ 
              name: 'skt-receiving-receingForm',
            }"
          >
            Receiving Form
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <!-- Dialog 2 Print Label -->
  <section>
    <VDialog
      v-model="isDialogVisibleActionPrintLabel"
      class="v-dialog-sm"
      :persistent="checkPersistent"
    >
      <VCard
        class="text-center"
        title="Print"
      >
        <DialogCloseBtn
          :disabled="checkPersistent"
          variant="text"
          size="default"
          @click="isDialogVisibleActionPrintLabel = false"
        />
        <VCardText class="text-end">
          <VRow>
            <VCol
              cols="6"
              @click="printLabel = true, printForm = false, getPrintLabelView(lotAction)"
            >
              <VHover>
                <template #default="{ isHovering, props }">
                  <VCard
                    class="cursor-pointer"
                    v-bind="props"
                    ripple
                    :color="isHovering || printLabel ? 'yellow-lighten-4' : undefined"
                  >
                    <VCardText class="d-flex justify-center">
                      <VProgressCircular
                        v-if="processingPrintLabel"
                        :size="105"
                        :width="15"
                        color="primary"
                        indeterminate
                      >
                        <VIcon
                          icon="ri-price-tag-3-line"
                          size="60"
                        />
                      </VProgressCircular>
                      <VIcon
                        v-if="!processingPrintLabel"
                        icon="ri-price-tag-3-line"
                        size="80"
                      />
                    </VCardText>
                    <VCardText class="text-center">
                      <span>Label</span>
                    </VCardText>
                  </VCard>
                </template>
              </VHover>
            </VCol>
            <VCol
              cols="6"
              @click="printForm = true, printLabel = false"
            >
              <VHover>
                <template #default="{ isHovering, props }">
                  <VCard
                    class="cursor-pointer"
                    v-bind="props"
                    ripple
                    :color="isHovering || printForm ? 'light-blue-lighten-4' : undefined"
                  >
                    <VCardText class="d-flex justify-center pa-2">
                      <VProgressCircular
                        v-if="processingPrint"
                        :size="105"
                        :width="15"
                        color="primary"
                        indeterminate
                      >
                        <VIcon
                          icon="ri-survey-line"
                          size="60"
                        />
                      </VProgressCircular>

                      <VIcon
                        v-if="!processingPrint"
                        icon="ri-survey-line"
                        size="105"
                      />
                    </VCardText>
                    <VCardText class="text-center">
                      <span>Form</span>
                    </VCardText>
                  </VCard>
                </template>
              </VHover>
            </VCol>
          </VRow>
        </VCardText>

        <VCardText>
          <VContainer
            fluid
            class="py-0"
          />

          <VRow v-if="printForm">
            <VCol cols="6" />
            <VCol cols="6">
              <!-- Align VCheckbox items to the right -->
              <VCheckbox
                v-if="receivingTypeAction === 2 || receivingTypeAction === 3"
                v-model="selectedPrintLabel"
                :disabled="disabledCheckboxListRawM()"
                label="Receiving Form"
                value="Receiving Form"
                class="ms-auto"
              >
                <template #append>
                  <VProgressCircular
                    v-if="processingPrintForm1"
                    :size="10"
                    color="primary"
                    indeterminate
                  />
                </template>
              </VCheckbox>
              <VCheckbox
                v-if="receivingTypeAction === 2 || receivingTypeAction === 3"
                v-model="selectedPrintLabel"
                :disabled="disabledCheckboxListInsp()"
                label="Inspection Request Form"
                value="Inspection Request Form"
                class="ms-auto"
              >
                <template #append>
                  <VProgressCircular
                    v-if="processingPrintForm2"
                    :size="10"
                    color="primary"
                    indeterminate
                  />
                </template>
              </VCheckbox>
              <VCheckbox
                v-if="receivingTypeAction === 2 || receivingTypeAction === 3"
                v-model="selectedPrintLabel"
                :disabled="disabledCheckboxListLorry()"
                label="Lorry Loading Checklist"
                value="Lorry Loading Checklist"
                class="ms-auto"
              >
                <template #append>
                  <VProgressCircular
                    v-if="processingPrintForm4"
                    :size="10"
                    color="primary"
                    indeterminate
                  />
                </template>
              </VCheckbox>
              <VCheckbox
                v-if="receivingTypeAction === 1"
                v-model="selectedPrintLabel"
                :disabled="disabledCheckboxListPk()"
                label="Inspection Request Form"
                value="Packaging Inspection Request Form"
                class="ms-auto"
              >
                <template #append>
                  <VProgressCircular
                    v-if="processingPrintForm3"
                    :size="10"
                    color="primary"
                    indeterminate
                  />
                </template>
              </VCheckbox> 
              <div class="mt-4">
                <VBtn
                  :disabled="checkPersistent"
                  style="width: 100%;"
                  @click="printFormAll"
                >
                  Print
                </VBtn>
              </div>
            </VCol>
          </VRow>

          <VRow v-if="printLabel">
            <VCol cols="6">
              <div
                v-if="!disabledBtnLebal()"
                class="mt-4"
              >
                <VBtn
                  v-if="!disabledBtnLebalLorry()"
                  style="width: 100%;"
                  :disabled="checkPersistent"
                  @click="btnPrintLabel"
                >
                  Print
                </VBtn>
              </div>
            </VCol>
            <VCol cols="6" />
          </VRow>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <!-- Dialog Details Item -->
  <section>
    <VDialog
      v-model="isDialogVisibleDetailsRCVD"
      width="800"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardTitle class="text-center">
          <div class="text-center">
            <span class="text-center">Item Details</span>
            <DialogCloseBtn
              variant="text"
              size="default"
              @click="isDialogVisibleDetailsRCVD = false"
            />
          </div>
        </VCardTitle>

        <VCardText>
          <div>
            Item Code : {{ itemCodeDialogDetails }}
          </div>

          <VTable
            height="350"
            fixed-header
          >
            <thead>
              <tr>
                <th class="text-uppercase">
                  No.
                </th>
                <th class="text-uppercase">
                  Item Code
                </th>
                <th class="text-end">
                  Item Name
                </th>
                <th class="text-uppercase">
                  Trade Name
                </th>
                <th class="text-uppercase">
                  Lot
                </th>
                <th class="text-uppercase">
                  Qty.
                </th>
                <th class="text-uppercase">
                  UoM
                </th>
                <th class="text-uppercase">
                  C/No.
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(item, index) in itemDetailsMockData"
                :key="index"
              >
                <td class="text-start">
                  {{ index+1 }}
                </td>
                <td class="text-start">
                  {{ item.itemCode }}
                </td>
                <td class="text-end">
                  {{ item.itemName }}
                </td>
                <td class="text-start">
                  {{ item.tradeName }}
                </td>
                <td class="text-start">
                  {{ item.lot }}
                </td>
                <td class="text-start">
                  {{ item.qty }}
                </td>
                <td class="text-start">
                  {{ item.uom }}
                </td>
                <td class="text-start">
                  {{ item.cNo }}
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <!-- Data Table Beta1.0 -->
  <section>
    <VCard>
      <CardText>
        <VProgressLinear
          v-if="progressLinearNoData"
          height="20"
          color="secondary"
          class="elevation-1"
        >
          <span>No Data....</span>
        </VProgressLinear>
        <VProgressLinear
          v-if="!products.length > 0 && progressLinearNoData === false"
          height="20"
          indeterminate
          color="primary"
          class="elevation-1"
        >
          <span>Loading Data....</span>
        </VProgressLinear>
        <VDataTable
          v-if="Array.isArray(products) && products.length > 0 && progressLinearNoData === false"
          v-model="selectedDataTables"
          show-select
          fixed-header
          :headers="headers"
          :items="products"
          height="550"
          :items-per-page="tableDataPerpage"
          item-selectable="selectable"
          class="elevation-1"
          :header-props="{ 'sort-icon': 'mdi-triangle-down' }"
          @update:items-per-page="updateItemsPerPage"
        >
          <!-- 
            <template #column.action="{ column }">
            <tr>
            <th
            >
            {{ column.column }} action custom
            </th>
            </tr>
            </template>
          -->
          <template #item="{ item }">
            <tr>
              <td
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? colorStatusWithCheckBox(item.raw.statusId).color : 
                    ''
                }"
                class="text-center px-2"
                style="position: sticky; z-index: 1; left: 0;"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <VCheckboxBtn
                  v-if="item.raw.statusId === 7 || item.raw.statusId === 15"
                  v-model="selectedDataTables"
                  :value="item.raw"
                  @update:modelValue="(selected) => handleSelection(selected, item.raw)"
                />
              </td>
              <td
                class="text-center px-2"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? colorStatusWithCheckBox(item.raw.statusId).color : 
                    ''
                }"
                style="position: sticky; z-index: 1; left: 40px; min-width: 150px;  justify-content: center; padding-block: 2px !important;"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <VChip
                  :color="colorStatusWithId2(item.raw.statusId).color"
                  class="font-weight-medium"
                  style="min-height: 40px;"
                  :style="{ color: colorStatusWithId(item.raw.statusId).message }"
                >
                  <span
                    v-if="debugMode === false"
                    style="font-size: 12px;"
                    class="text-wrap"
                  >{{ item.raw.statusText }}</span>
                  <span
                    v-if="debugMode === true"
                    style="font-size: 12px;"
                    class="text-wrap"
                  >{{ debugMode }} {{ item.raw.statusText }}[{{ item.raw.poEtlLogDetailJournalID }}]({{ item.raw.receiveTypeName }})</span>
                </VChip>
              </td>
              <td
                class="px-2 text-center"
                style="min-width: 30px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? colorStatusWithCheckBox(item.raw.statusId).color : 
                    ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span style="font-size: 12px;">{{ item.raw.no }}</span>
              </td>
              <td
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? colorStatusWithCheckBox(item.raw.statusId).color : 
                    ''
                }"
                class="px-2"
                style="min-width: 130px;  justify-content: start;"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span
                  style="font-size: 12px;"
                  class="text-wrap"
                >{{ item.raw.itemCode }}</span>
              </td>
              <td
                class="px-2"
                style="min-width: 300px; max-width: 350px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? colorStatusWithCheckBox(item.raw.statusId).color : 
                    ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span
                  style="font-size: 12px;"
                  class="text-wrap"
                  v-html="item.raw.itemName.replace(/\s/g, '&nbsp;')"
                />
              </td>
              <td
                class="px-2 "
                style="min-width: 250px; max-width: 350px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? colorStatusWithCheckBox(item.raw.statusId).color : 
                    ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span
                  style="font-size: 12px;"
                  class="text-wrap"
                  v-html="item.raw.concatTradename.replace(/\s/g, '&nbsp;')"
                />
              </td>
              <td
                class="px-2 text-center"
                style="min-width: 150px; justify-content: center;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? colorStatusWithCheckBox(item.raw.statusId).color : 
                    ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span
                  style="font-size: 12px;"
                  class="text-wrap"
                >{{ item.raw.supplierId }}</span>
              </td>
              <td
                class="px-2"
                style="justify-content: start;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? colorStatusWithCheckBox(item.raw.statusId).color : 
                    ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span
                  style="max-width: 200px; font-size: 12px;"
                  class="text-wrap"
                  v-html="item.raw.supplierName.replace(/\s/g, '&nbsp;')"
                />
              </td>
              <td
                class="text-start px-2"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? colorStatusWithCheckBox(item.raw.statusId).color : 
                    ''
                }"
                style="min-width: 100px;"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              > 
                <span
                  style="font-size: 12px;"
                  class="text-wrap"
                >{{ item.raw.purchaseOrderNo }}</span>
              </td>
              <td
                class="text-center px-2"
                style="min-width: 150px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? colorStatusWithCheckBox(item.raw.statusId).color : 
                    ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span
                  style="font-size: 12px;"
                  class=""
                >{{ convertDate(item.raw.deliveryDate) }}</span>
              </td>
              <td
                class="text-start px-2"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? colorStatusWithCheckBox(item.raw.statusId).color : 
                    ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span
                  style="font-size: 12px;"
                  class="text-wrap"
                >{{ item.raw.batch }}</span>
              </td>
              <td
                class="text-end px-2"
                style="justify-content: end;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? colorStatusWithCheckBox(item.raw.statusId).color : 
                    ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span
                  style="font-size: 12px;"
                  class="text-wrap"
                >{{ (item.raw.purchasingQuantityPcs.toLocaleString()) }}</span>
              </td>
              <td
                class="text-end px-2"
                style="justify-content: end;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? colorStatusWithCheckBox(item.raw.statusId).color : 
                    ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span
                  style="font-size: 12px;"
                  class="text-wrap"
                >{{ formatNumber(item.raw.purchasingAmountKgs) }}</span>
              </td>
              <td
                class="text-end px-2"
                style="justify-content: end;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? colorStatusWithCheckBox(item.raw.statusId).color : 
                    ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span
                  style="font-size: 12px;"
                  class="text-wrap"
                >{{ (item.raw.purchasingQuantityRcvdPcs.toLocaleString()) }}</span>
              </td>
              <td
                class="text-end px-2"
                style="justify-content: end;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? colorStatusWithCheckBox(item.raw.statusId).color : 
                    ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span
                  style="font-size: 12px;"
                  class="text-wrap"
                >{{ formatNumber(item.raw.purchasingAmountRcvdKgs) }}</span>
              </td>
              <td
                class="text-start px-2"
                style="min-width: 150px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? colorStatusWithCheckBox(item.raw.statusId).color : 
                    ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span
                  style="font-size: 12px;"
                  class="text-wrap"
                >{{ item.raw.updatedBy }}</span>
              </td>
              <td
                class="text-center"
                style="min-width: 150px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? colorStatusWithCheckBox(item.raw.statusId).color : 
                    ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span style="font-size: 12px;">{{ convertDate(item.raw.updatedDate) }}</span>
              </td>
              <td
                class="text-start px-2"
                style="justify-content: center;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? colorStatusWithCheckBox(item.raw.statusId).color : 
                    ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <VBtn
                  color="info"
                  @click="viewDetailsReceive(item.raw.no, item.raw.journalID, item.raw.updatedBy, item.raw.statusId, item.raw.itemCode, item.raw.poEtlLogDetailJournalID, item.raw.receiveTypeId, item.raw.batch)"
                >
                  <div style="font-size: 12px;">
                    Action
                  </div>
                </VBtn>
              </td>
            </tr>
          </template>
        </VDataTable>
      </CardText>
    </VCard>
  </section>

  <section v-if="false">
    <div>
      <div
        v-for="(color, index) in itemStatus"
        :key="index"
      >
        <VChip
          v-if="false"
          :color="colorStatusWithId(color.statusID).color"
          class="font-weight-medium"
          style="min-height: 50px;"
        >
          <span
            style="font-size: 12px;"
            :style="{ color: colorStatusWithId(color.statusID).message }"
            class="text-wrap"
          >{{ color.statusText }}</span>
        </VChip>

        <VChip
          v-if="false"
          :color="colorStatusWithId(color.statusID).color"
          class="font-weight-medium mx-10"
          style="min-height: 50px;"
          variant="elevated"
        >
          <span
            style="font-size: 12px;"
            :style="{ color: colorStatusWithId(color.statusID).message }"
            class="text-wrap"
          >{{ color.statusText }}</span>
        </VChip>

        <VChip
          v-if="true"
          :color="colorStatusWithId2(color.statusID).color"
          class="font-weight-medium mx-10"
          style="min-height: 50px;"
          variant="outlined"
        >
          <span
            style="font-size: 12px;"
            :style="{ color: colorStatusWithId(color.statusID).message }"
            class="text-wrap"
          >{{ color.statusText }}</span>
        </VChip>

        <VChip
          v-if="false"
          :color="colorStatusWithId(color.statusID).color"
          class="font-weight-medium mx-10"
          style="min-height: 50px;"
          label
        >
          <span
            style="font-size: 12px;"
            :style="{ color: colorStatusWithId(color.statusID).message }"
            class="text-wrap"
          >{{ color.statusText }}</span>
        </VChip>
      </div>
    </div>
  </section> 

  <section v-if="false">
    <VDataTable
      :headers="headersTest"
      :items="dessertsTest"
      item-selectable="selectable"
      item-value="name"
      items-per-page="5"
      show-select
    />
  </section>

  <!-- Footer -->
  <section class="mt-3">
    <VCard>
      <VCardText
        class="pa-1"
        style="min-width: 500px;"
      >
        <VAlert
          color="green-lighten-3"
          style="font-size: 12px;"
          class="pa-1"
        >
          Version : 2.(Last Updated 11/11/2024 ) {{ products.length }} Rows of Data 
        </VAlert>
      </VCardText>
    </VCard>
  </section>
</template>

<style scoped>
.text-capitalize {
  text-transform: capitalize;
}

.code input {
  text-transform: lowercase;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}

.image-transition {
  transition: inline-size 0.2s, inline-size 0.2s;
}

.fixed-top {
  position: fixed; /* Fix the position relative to the viewport */
  z-index: 1000; /* Ensure it's on top of other content */
  inline-size: 92%; /* Set the width to 95% of the viewport width */
  inset-block-start: 5%; /* Position it at the top of the viewport */
}

.fixed-bottom {
  position: fixed;
  display: flex;
  box-sizing: border-box;
  justify-content: start;
  padding: 2px;
  inline-size: 105vw;
  inset-block-end: 0;
  margin-block-end: 80px;
  max-inline-size: 1500vw; /* ไม่ให้เกินขอบหน้าจอ */
}

.spinning {
  animation: spin 0.5s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.v-text-field >>> input {
  font-size: 12px !important;

  /* text-transform: capitalize; */
}

.v-text-field-density-compact >>> input {
  padding-block-start: 10px;

  /* text-transform: capitalize; */
}

.custom-date-time-picker >>> input {
  font-size: 12px; /* ปรับขนาดของข้อความในฟิลด์ */
}

.custom-date-time-picker >>> input icon--prepend {
  font-size: 12px; /* ปรับขนาดของไอคอนที่อยู่ด้านหน้า */
}

.custom-header {
  margin: 2px; /* ปรับค่า margin ที่นี่ */
}

.auto-wide-table {
  inline-size: 100%; /* ให้ตารางใช้ความกว้างทั้งหมด */
  table-layout: auto; /* ให้ตารางปรับขนาดตามเนื้อหา */
}

.auto-wide-table th,
.auto-wide-table td {
  max-inline-size: 250px; /* กำหนดความกว้างสูงสุด */
  overflow-wrap: break-word; /* ให้ข้อความตัดบรรทัดเมื่อยาวเกิน */
  white-space: normal; /* ให้ข้อความสามารถตัดบรรทัดได้ */
  word-wrap: break-word; /* รองรับข้อความตัดบรรทัด */
}

/* กำหนด CSS สำหรับคอลัมน์ที่ต้องการให้ sticky ด้านซ้าย */
.pa-5 {
  position: sticky;
  z-index: 1;
  background-color: white;
  inset-inline-start: 0;
}

/* กำหนด CSS สำหรับคอลัมน์ Action ที่ต้องการให้ sticky ด้านขวา */
.sticky-right {
  position: sticky;
  z-index: 1;
  inset-inline-end: 0;
}
</style>

