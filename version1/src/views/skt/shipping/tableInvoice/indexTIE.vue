<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api'  //---------------------- Import Api for Url *****
import { VDataTable } from 'vuetify/labs/VDataTable'

const whereHouse = localStorage.getItem('whereHouseName')
const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')

import { useCookieStore, useItemStore } from '@/stores/skt/receingFormStore/itemStore'

const itemStore = useItemStore()

//------------------------------- alert --------------------------------------------
import AuthenticatorDialog from '@/components/dialogs/alert/alertDialog.vue'
import AlertWord2 from '@/components/dialogs/alert/alertDialog2.vue'
import ConfirmDialog2 from '@/components/dialogs/alert/confirmDialog2.vue'
import alertWordConst from '@/utilities/constant'

const isDialogVisibleAlertDialog = ref(false)
const wordForSubmit = ref('')
const subWordForSubmit = ref('')
const successDialAlert = ref(false)
const confirmDialog2 = ref(null)

const statusId = ref(0)

const textAlertDialogFunction = (word, success) => {
  subWordForSubmit.value = ''
  wordForSubmit.value = word
  successDialAlert.value = success
  isDialogVisibleAlertDialog.value = true
}

//------------------------------ Formate --------------------------------------
function formatDateSave(date) {
  if (!date) return null // หากค่าว่างให้คืน null

  const [day, month, year] = date.split('/') // แยกวันที่ตามรูปแบบ dd/mm/yyyy
  if (!day || !month || !year) return null // ตรวจสอบว่าแยกข้อมูลสำเร็จ

  // สร้างวันที่ในรูปแบบ yyyy-mm-dd
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

//------------------------------- 

//------------------------------ Get User Data --------------------------------

const userDataInfo = ref(itemStore.getItemDetails('UserDataCookies'))


//------------------------------ fetch data from API --------------------------------
import { useGetUserPermissionService,
  useGetSelectDataService,
  useGetSearchPlanService,
  useSaveSearchPlanService,
  useSubmitShipmentPlanService,
} from '@/services/skt/shipmentPlan/services'

import { fetchUserPermissions, canVisibleUserPermissionPermission } from '@/utilities/permission'

const { getUserPermissionResult, errorGetUserPermission, fetchUserPermission } = useGetUserPermissionService()

const paramsForGetPermission = ref({
  empId: String(userDataInfo.value.id) || '',
  statusId: '',
  uiControlContextId: '7',
})

// เรียก fetchUserPermissions ครั้งเดียวใน lifecycle hook
onMounted(async () => {
  await fetchUserPermissions(
    urlApi.value,
    whereHouse,
    accessTokenAtStore,
    paramsForGetPermission.value,
  )
})

const statusPermission = ref(-1)

const canVisibleUserPermission = (statusId, uiControlContextId) => {
  // console.log('Permission Result:', result)

  // if (result.canVisible) {
  //   console.log('This UI element is visible!')
  // } else {
  //   console.log('This UI element is hidden!')
  // }
  
  return canVisibleUserPermissionPermission(statusId, uiControlContextId)
}


//------------------------ Get Where House Name From LocalStorage and define to whereHouseSelectedItem ---------------------------

const products = ref([]) //---------------- variable for get All Product From X-Location(Where House) *****

const perPage = ref(10)
const page = ref(0)
const totalCount = ref(0)

const rowPerPage = ref(10)
const totalPage = ref(1)

const router = useRouter()

const serialProductCode = ref(null)

//---------------------- Select Model ----------------------------------------------
const freightForwarderModel = ref([])
const carrierModel = ref([])
const vesselsModel = ref([])
const truckModel = ref([])

/// ------------------------------ Import Component --------------------------------
// --- Dialog Text Area --------------------------------

import TextAreaDialog from '@/components/dialogs/alert/textAreaDialog.vue' //--------- import component

const dialogDataTextArea = ref('')
const dialogData2TextArea = ref('')
const dialogVisible = ref(false)
const dialogVisibleTextarea = ref(false)
const dialogRemark = ref('')


// --- define Model

const shipmentModel = ref([])

const itemsTruck = [
  'LEO',
  'BTS',
  'LCL',
]

const shippingCondition = ref('')
const shippingmark = ref('')
const typeDialogTextArea = ref('')

const sapInValueView = ref('')
const lotValueView = ref('')
const typeDialogView = ref('')
const typeBtnView = ref('')
const titleDialogView = ref('')
const soEIdModel = ref('')
const indexDataDialogTextArea = ref('')

//------ function for dialog text area ----------------------------------------------

// กำหนดค่าคอนฟิกสำหรับแต่ละ type
const dialogConfig = {
  ShipCon: { title: 'Shipping Condition', type: 'ShipCon', sapIn: '', btn: 'nonPrint' },
  ShipMark: { title: 'Shipping Mark', type: 'ShipMark', sapIn: 'TIX2406001', btn: 'nonPrint' },
  ShipMC: { title: 'Shipping Mark Con', type: 'ShipMC', sapIn: 'TIX2406001', btn: 'twinPrint' },
  Lot: { title: 'Lot', type: 'Lot', sapIn: 'TIX2406001', btn: 'nonPrint' },
  ShipMarkPrint: { title: 'Shipping Mark', type: 'ShipMark', sapIn: 'TIX240602', btn: 'print' },
  ShipConPrint: { title: 'Shipping Condition', type: 'ShipCon', sapIn: 'TIX240602', btn: 'print' },
  RemarkWH: { title: 'Remark WH', type: 'RemarkWH', sapIn: 'TIX2406001', btn: 'nonPrint' },
  RemarkSAL: { title: 'Remark SAL', type: 'RemarkSAL', sapIn: 'TIX2406001', btn: 'nonPrint' },
  RemarkLOG: { title: 'Remark LOG', type: 'RemarkLOG', sapIn: 'TIX2406001', btn: 'nonPrint' },
}

// ฟังก์ชันสำหรับเปิด dialog
const textAreaDialogActive = (type, data, index) => {
  typeDialogTextArea.value = type
  indexDataDialogTextArea.value = index
  
  // โหลดค่าจากคอนฟิก
  const config = dialogConfig[type]
  if (config) {
    titleDialogView.value = config.title
    typeDialogView.value = config.type
    sapInValueView.value = config.sapIn
    typeBtnView.value = config.btn
    dialogDataTextArea.value = data // ตั้งค่า dialogDataTextArea ด้วยค่า data
  }

  dialogVisible.value = true
}

const textAreaShipDialogActive = (type, data, data2, index) => {
  typeDialogTextArea.value = type
  indexDataDialogTextArea.value = index

  titleDialogView.value = 'Shipping Mark Con'
  typeDialogView.value = 'ShipMC'
  sapInValueView.value = 'TIX2406001'
  typeBtnView.value = 'twinPrint'
  dialogDataTextArea.value = data  // ตั้งค่า dialogDataTextArea ด้วยค่า data
  dialogData2TextArea.value = data2 // 
  dialogVisible.value = true
}

const btnCloseShipCon = () => {
  // ค้นหาและอัปเดตค่าใน paginatedData
  paginatedData.value.forEach(item => {
    if (item.soEtlLogDetailJournalID === soEIdModel.value) {
      item.shipperMark = dialogDataTextArea.value
      item.shipperConditions = dialogData2TextArea.value
    }
  })
  console.log('btnCloseShipCon...')
  dialogVisible.value = false
}

const btnTextarea = () => {
  console.log('textAreaRemarkDialogActive', typeDialogTextArea.value)
  paginatedData.value.forEach(item => {
    if (item.soEtlLogDetailJournalID === soEIdModel.value) {
      if(typeDialogTextArea.value === 'Remark WH'){
        item.wH_Remarks = dialogRemark.value

        // console.log('btnCloseRemark... Remark WH', dialogRemark.value)
      }else if(typeDialogTextArea.value === 'Remark SAL'){
        item.saL_Remarks = dialogRemark.value

        // console.log('btnCloseRemark... Remark SAL', dialogRemark.value, item.saL_Remarks)
      }else if(typeDialogTextArea.value === 'Remark LOG'){
        item.loG_Remarks = dialogRemark.value

        // console.log('btnCloseRemark... Remark LOG', dialogRemark.value)
      }
    }else{
      console.log('btnCloseRemark... ELSe', typeDialogTextArea.value, soEIdModel.value, item.soEtlLogDetailJournalID)
    }
  })
  console.log('btnCloseRemark...')
  dialogVisibleTextarea.value = false
}

const textAreaRemarkDialogActive = (type, data, soEId) => {
 
  typeDialogTextArea.value = type
  soEIdModel.value = soEId
  titleDialogView.value = 'Shipping Mark Con'
  dialogRemark.value = data  // ตั้งค่า dialogDataTextArea ด้วยค่า data
  dialogVisibleTextarea.value = true
  console.log('Type dialog', typeDialogTextArea.value, '=', type)
}

const textAreaShipDialogActive2 = (type, data, data2, index, soEId) => {
  typeDialogTextArea.value = type
  indexDataDialogTextArea.value = index
  soEIdModel.value = soEId
  titleDialogView.value = 'Shipping Mark Con'
  typeDialogView.value = 'ShipMC'
  dialogDataTextArea.value = data  // ตั้งค่า dialogDataTextArea ด้วยค่า data
  dialogData2TextArea.value = data2 // 
  dialogVisible.value = true
}

const handleDialogSubmit = data => {
  dialogDataTextArea.value = data

  const index = indexDataDialogTextArea.value

  if (index >= 0 && index < mockData.value.length) {
    const item = mockData.value[index]

    // อัปเดตค่าของ item
    item.value = data

    // ใช้งานข้อมูลตาม type
    if (typeDialogTextArea.value  === 'ShipCon') {
      item.shippingCondition = data
    } else if (typeDialogTextArea.value === 'ShipMark') {
      item.shippingMark = data
    } else if (typeDialogTextArea.value === 'RemarkSAL') {
      item.remarkSal = data
    }else if (typeDialogTextArea.value === 'RemarkWH') {
      item.remarkWh = data
    }else if (typeDialogTextArea.value === 'RemarkLOG') {
      item.remarkLog = data
    }
  } else {
    console.warn(`Index ${index} is out of range for mockData.`)
  }

  console.log('Updated mockData:', data)
}

//------------------------------- Function Get Search plan -----------------

const { getSearchPlanResult, errorGetSearchPlan, fetchSearchPlan } = useGetSearchPlanService()

const searchPlanData = ref([])
const isLoading = ref(false)
const selectedDataTables = ref([])

const currentPage = ref(1)
const itemsPerPage = ref(10)
const selectedItemsPerPage = ref(10)

watch(selectedItemsPerPage, newVal => {
  const newItems = newVal === 'All' ? totalItems.value : newVal
  if (itemsPerPage.value !== newItems) {
    itemsPerPage.value = newItems
    currentPage.value = 1 // รีเซ็ตหน้าเป็นหน้าแรกเมื่อเปลี่ยนจำนวนรายการต่อหน้า
  }
})

const totalItems = computed(() => searchPlanData.value.length)

// คำนวณจำนวนหน้าทั้งหมด
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

watch(currentPage, newVal => {
  if (newVal < 1) currentPage.value = 1
  if (newVal > totalPages.value) currentPage.value = totalPages.value
})

const formatToDate = dateString => {
  if (!dateString) return null // จัดการค่าว่าง
  const date = new Date(dateString)
  if (isNaN(date)) return null // จัดการค่าที่ไม่ใช่วันที่
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  
  return `${day}/${month}/${year}`
}

const goToFirstPage = () => (currentPage.value = 1)
const goToPrevPage = () => (currentPage.value = Math.max(1, currentPage.value - 1))
const goToNextPage = () => (currentPage.value = Math.min(totalPages.value, currentPage.value + 1))
const goToLastPage = () => (currentPage.value = totalPages.value)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = currentPage.value * itemsPerPage.value
  
  // ตัดข้อมูลเฉพาะที่ต้องแสดงในหน้านั้น
  // จัดรูปแบบวันที่สำหรับ `eta` และ `etd`
  // return pageData.map(item => ({
  //   ...item,
  //   eta: formatToDate(item.eta),
  //   etd: formatToDate(item.etd),
  // }))

  return searchPlanData.value.slice(start, end)

})

const sortColumn = ref('')
const sortDirection = ref('')

const filterForSearchPlan = ref({
  StatusId: sessionStorage.getItem("StatusIdSearchProductionFilter") || '',
  ETA: (sessionStorage.getItem("ETASearchProductionFilter")) || '',
  ETD: (sessionStorage.getItem("ETDSearchProductionFilter")) || '',
  SalesOrderNoSearch: sessionStorage.getItem("SalesOrderNoSearchProductionFilter") || '',
  PayerNameSearch: sessionStorage.getItem("PayerNameSearchProductionFilter") || '',
  ItemNameSearch: sessionStorage.getItem("ItemNameSearchProductionFilter") || '',
  SortColumn: '',
  SortDirection: '',
})

const saveHistoryFilter = () => {
  sessionStorage.setItem("StatusIdSearchProductionFilter", filterForSearchPlan.value.StatusId || ''),
  sessionStorage.setItem("ETASearchProductionFilter", filterForSearchPlan.value.ETA) || '',
  sessionStorage.setItem("ETDSearchProductionFilter", filterForSearchPlan.value.ETD) || '',
  sessionStorage.setItem("SalesOrderNoSearchProductionFilter", filterForSearchPlan.value.SalesOrderNoSearch) || '',
  sessionStorage.setItem("PayerNameSearchProductionFilter", filterForSearchPlan.value.PayerNameSearch) || '',
  sessionStorage.setItem("ItemNameSearchProductionFilter", filterForSearchPlan.value.ItemNameSearch) || ''
}

// ฟังก์ชันสำหรับสลับสถานะของไอคอนแต่ละตัว
const toggleDirection = async key => {
  if (key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    console.log(`Sorting direction is now: ${sortDirection.value} --> ${key}`)
  }
  sortColumn.value = key
  await searchShipmentPlan()
}

const searchShipmentPlan = async () => {
  isLoading.value = true

  // Format ค่า ETA และ ETD ก่อนส่ง API
  filterForSearchPlan.value.ETA = formatDateSave(filterForSearchPlan.value.ETA)
  filterForSearchPlan.value.ETD = formatDateSave(filterForSearchPlan.value.ETD)

  filterForSearchPlan.value.SortColumn = sortColumn.value
  filterForSearchPlan.value.SortDirection = sortDirection.value

  saveHistoryFilter()
  try {
    const result = await fetchSearchPlan(
      urlApi.value,
      'searchplans',
      whereHouse,
      accessTokenAtStore,
      filterForSearchPlan.value,
    )

    if (result && getSearchPlanResult.value.datas) {
      searchPlanData.value = getSearchPlanResult.value.datas // เก็บข้อมูลใน reactive stat
      
      searchPlanData.value = getSearchPlanResult.value.datas.map(item => ({
        ...item,
        eta: formatToDate(item.eta),
        etd: formatToDate(item.etd),
      }))
      console.log(`Fetched search plan:`, searchPlanData.value)
    } else {
      console.error('No result from API')
      searchPlanData.value = [] // Set empty data if no result
    }
  } catch (error) {
    console.error(`Error fetching search plan:`, error)
    console.error(`Error(service) fetching search plan:`, errorGetSearchPlan)
    searchPlanData.value = [] // Set empty data on error
  } finally {
    isLoading.value = false // Stop loading indicator
  }
}

const searchFilterPlanFunctionBtn = async () => {
  await searchShipmentPlan()
}

const clearFilterPlanFunctionBtn = async () => {
  filterForSearchPlan.value = {
    StatusId: '',
    ETA: '',
    ETD: '',
    SalesOrderNoSearch: '',
    PayerNameSearch: '',
    ItemNameSearch: '',
    SortColumn: '',
    SortDirection: '',
  }
  await searchShipmentPlan()
}

//------------------------------- Function check --------------------------------

const allData = ref([]) // ข้อมูลทั้งหมดที่แสดงในตาราง
const isSelectAll = ref(false) // สถานะของ Checkbox "Select All"

const testValue = () => {
  console.log('Test Value', selectedDataTables.value)
}

// คำนวณว่าทุกแถวถูกเลือกหรือไม่
const isAllSelected = computed(() => {
  return paginatedData.value.length > 0 && selectedDataTables.value.length === paginatedData.value.length
})

// เมื่อกด "Select All"
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedDataTables.value = [] // ยกเลิกการเลือกทั้งหมด
    console.log('clear data checkbox...')
  } else {
    selectedDataTables.value = [...paginatedData.value] // เลือกทั้งหมด
    console.log('add all data checkbox...')
  }
}


//------------------------------- Function save Search plan -----------------

const { saveSearchPlanResult, errorSaveSearchPlan, saveSearchPlan } = useSaveSearchPlanService()

const mapRequestData = data => ({
  soEtlLogDetailJournalID: getOrDefault(data.soEtlLogDetailJournalID, 0),
  updatedBy: getOrDefault(data.salUpdatedBy, "system"),
  shipperMark: getOrDefault(data.shipperMark, ""),
  shipperConditions: getOrDefault(data.shipperConditions, ""),
  shippingEndUser: getOrDefault(data.shippingEndUser, ""),
  freightForwarder: getOrDefault(data.freightForwarder, ""),
  carrier: getOrDefault(data.carrier, ""),
  vesselName: getOrDefault(data.vesselName, ""),
  voy: getOrDefault(data.voy, ""),
  truck: getOrDefault(data.truck, ""),
  truckReservingNumber: getOrDefault(data.truckReservingNumber, ""),
  truckFee: getOrDefault(data.truckFee, ""),
  etd: formatDateSave(getOrDefault(data.etd, null)),
  eta: formatDateSave(getOrDefault(data.eta, null)),
  saL_Remarks: getOrDefault(data.saL_Remarks, ""),
  wH_Remarks: getOrDefault(data.wH_Remarks, ""),
  loG_Remarks: getOrDefault(data.loG_Remarks, ""),
})

const getOrDefault = (value, defaultValue) => value ?? defaultValue

const saveShipmentPlan = async row => {
  console.log("save plan start...", row)
  try {
    // ตรวจสอบว่า row เป็นอาร์เรย์หรือออบเจ็กต์เดี่ยว
    const requestData = mapRequestData(row)

    const response = await saveSearchPlan(
      urlApi.value,
      "save",
      whereHouse,
      accessTokenAtStore,
      requestData,
    )

    if(saveSearchPlanResult.value){
      textAlertDialogFunction(alertWordConst.saveDraft, true)
      setTimeout(() => {
        location.reload()
      }, 500) // 10000 มิลลิวินาที = 10 วินาที
    }else{
      textAlertDialogFunction(alertWordConst.saveDraft, false)
      setTimeout(() => {
        // location.reload()
      }, 500) // 10000 มิลลิวินาที = 10 วินาที
    }

    console.log(`Saved search plan:`, response)
  } catch (error) {
    console.error(`Error saving search plan:`, error)
  }
}

//------------------------------------- Function Submit shipment plan --------------------------------------


const { submitShipmentPlanResult, errorSubmitShipmentPlan, submitShipmentPlan } = useSubmitShipmentPlanService()

const submitShipmentPlanBySoEId = soEtlLogDetailJournalID => {
  try{
    
    const result = submitShipmentPlan(urlApi.value,
      "submit",
      whereHouse,
      accessTokenAtStore,
      soEtlLogDetailJournalID)
    
    if(result){
      textAlertDialogFunction(alertWordConst.submit, true)
      setTimeout(() => {
        location.reload()
      }, 500) // 10000 มิลลิวินาที = 10 วินาที
    }else{
      textAlertDialogFunction(alertWordConst.submit, false)
      setTimeout(() => {
      }, 500) // 10000 มิลลิวินาที = 10 วินาที
    }
  } catch (e) {
    console.error(`Error saving search plan:`, error)
  }
}


// const handlePageChange = newPage => {
//   currentPage.value = newPage
//   console.log(`Page changed to: ${newPage}`)
// }

//--------------------------------------- hihtlight -------------------
const dataTableColor = ref('#E0F7FA')
const dataTableNummberedToggle = ref(null)

const isSelected = item => {
  return selectedDataTables.value.some(
    selectedItem => selectedItem.journalID === item.journalID,
  )
}

const dataTableCliclHighlightIsToggle = no => {
  // เช็คว่า no ที่รับเข้ามาตรงกับค่าเดิมหรือไม่
  if (dataTableNummberedToggle.value === no) {
    // ถ้าตรง ให้สลับกลับเป็น null
    dataTableNummberedToggle.value = null
  } else if (dataTableNummberedToggle.value === null) {
    // ถ้าเป็น null ให้ตั้งค่าเป็น no ใหม่
    dataTableNummberedToggle.value = no
  }

  console.log("dataTableNum", dataTableNummberedToggle.value)
}

//--------------------------------------- Function Pagination --------------------------------------------
// 👉 watching current page
onMounted( async () => {
  searchShipmentPlan()
})

//------------------------------------- Vdata --------------------
const headersShipment = [
  { title: 'No.', align: 'start', key: 'no' },
  { title: 'Status', align: 'center', key: 'statusComments' },
  { title: 'Sale Order No.', align: 'center', key: 'salesOrderNo' },
  { title: 'SO Attachment', align: 'center', key: 'sOAttachment' },
  { title: 'SAP Invoice No', align: 'center', key: 'sapInvoiceNo' },
  { title: 'Payer Name', align: 'center', key: 'payerName' },
  { title: 'User', align: 'center', key: 'User' },
  { title: 'Shipper', align: 'center', key: 'shippingUserName' },
  { title: 'Shipper Location', align: 'center', key: 'shipperLocation' },
  { title: 'Shipping Mark/Cond.', align: 'center', key: 'shippingMark' },
  { title: 'End User', align: 'center', key: 'shippingEndUser' },
  { title: 'Consignee', align: 'center', key: 'consignee' },
  { title: 'Item Name', align: 'center', key: 'itemName' },
  { title: 'Lot', align: 'center', key: 'lot' },
  { title: 'Qty. (Kg.)', align: 'end', key: 'quantity' },
  { title: 'COA', align: 'center', key: 'COA' },
  { title: 'Freight Forwarder', align: 'center', key: 'freightForwarder' },
  { title: 'Carrier', align: 'start', key: 'carrier' },
  { title: 'Vessel Name', align: 'center', key: 'vesselName' },
  { title: 'Voy', align: 'center', key: 'voy' },
  { title: 'Truck', align: 'center', key: 'truck' },
  { title: 'Truck Reserving Number', align: 'end', key: 'truckReservingNumber' },
  { title: 'Truck Fee', align: 'center', key: 'truckFee' },
  { title: 'Truck Order', align: 'center', key: 'truckOrder' },
  { title: 'DO/EX', align: 'center', key: 'doEx' },
  { title: 'Country', align: 'center', key: 'country' },
  { title: 'Loading Date', align: 'start', key: 'loadingDate' },
  { title: 'ETD', align: 'center', key: 'etd' },
  { title: 'ETA', align: 'center', key: 'eta' },
  { title: 'Delivery Note', align: 'center', key: 'DeliveryNote' },
  { title: 'Remark (SAL)', align: 'center', key: 'saL_Remarks' },
  { title: 'Remark (WH)', align: 'center', key: 'wH_Remarks' },
  { title: 'Remark (LOG)', align: 'center', key: 'loG_Remarks' },
  { title: 'Updated By', align: 'start', key: 'updatedBy' },
  { title: 'Updated Date', align: 'start', key: 'updatedDate' },
  { title: 'Action', align: 'center', key: 'Action' },
]

//-------------------------- format decimal -------------------

import { useGetCOAFormController } from '@/utilities/format'

const { formatNumber } = useGetCOAFormController()

const formatDecimal = decimal => {
  const configsShowDigit = localStorage.getItem('configsShowDigit')
  if (configsShowDigit == 'true') {
    return Math.ceil(decimal)
  } else {
    return decimal
  }
}

const formatDate = date => {
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()

  return `${day}/${month}/${year}`
}

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

const showExpansionDialog = ref(false)

//---------------------------- check Status ---------------------------------

const colorStatus = ref('grey')
const bgStatus = ref('bg-grey')

const colorStatusWithId = id => {
  switch (id) {
  case 200:
    return { color: 'orange', message: 'orange-darken-1', text: 'Cancel', bgColor: '#E0E0E0' }
  case 201:
    return { color: 'green', message: 'green', text: 'ETL Failed!', bgColor: '#EF9A9A' }
  case 202:
    return { color: 'pink', message: 'pink-darken-4', text: 'Waiting for Shipping', bgColor: '#FCE4EC' }
  case 203:
    return { color: 'purple', message: 'purple', text: 'Draft Shipping', bgColor: '#F3E5F5' }

  case 302:
    return { color: 'brown', message: 'brown', text: 'Waiting for SAL Draft', bgColor: '#EFEBE9' }
  case 303:
    return { color: 'green', message: 'green', text: 'SAL Draft Shipping', bgColor: '#E8F5E9' }
  case 304:
    return { color: 'red', message: 'red', text: 'SAL Submitted', bgColor: '#FFEBEE' }

  case 402:
    return { color: 'red', message: 'red', text: 'Waiting for WH Draft', bgColor: '#FFEBEE' }
  case 403:
    return { color: 'red', message: 'red', text: 'WH Draft Shipping', bgColor: '#FFEBEE' }
  case 404:
    return { color: 'red', message: 'red', text: 'WH Submitted', bgColor: '#FFEBEE' }

  case 502:
    return { color: 'red', message: 'red', text: 'Waiting FOR LOG Draft', bgColor: '#FFEBEE' }
  case 503:
    return { color: 'red', message: 'red', text: 'LOG Draft Shipping', bgColor: '#FFEBEE' }
  case 504:
    return { color: 'red', message: 'red', text: 'LOG Submitted', bgColor: '#FFEBEE' }

  case 602:
    return { color: 'red', message: 'red', text: 'Waiting FOR INSP Draft', bgColor: '#FFEBEE' }
  case 603:
    return { color: 'red', message: 'red', text: 'INSP Draft Shipping', bgColor: '#FFEBEE' }
  case 604:
    return { color: 'red', message: 'red', text: 'INSP Submitted', bgColor: '#FFEBEE' }

  case 1002:
    return { color: 'red', message: 'red', text: 'Waiting for CS Draft', bgColor: '#FFEBEE' }
  case 1003:
    return { color: 'red', message: 'red', text: 'CS1 Draft Shipping', bgColor: '#FFEBEE' }
  case 1004:
    return { color: 'red', message: 'red', text: 'CS2 Draft Shipping', bgColor: '#FFEBEE' }
  case 1005:
    return { color: 'red', message: 'red', text: 'CS Submitted', bgColor: '#FFEBEE' }

  case 1102:
    return { color: 'red', message: 'red', text: 'Waiting for Draft', bgColor: '#FFEBEE' }
  case 1103:
    return { color: 'red', message: 'red', text: 'Draft Shipping LF', bgColor: '#FFEBEE' }
  case 1104:
    return { color: 'red', message: 'red', text: 'Waiting for Lorry/Flex APVL', bgColor: '#FFEBEE' }
  case 1105:
    return { color: 'red', message: 'red', text: 'Lorry/Flex Submitted', bgColor: '#FFEBEE' }

  case 204:
    return { color: 'red', message: 'red', text: 'In Submitting (SWL )', bgColor: '#FFEBEE' }
  case 205:
    return { color: 'red', message: 'red', text: 'Waiting for WH APVL', bgColor: '#FFEBEE' }
  case 206:
    return { color: 'red', message: 'red', text: 'Shipping Rejected', bgColor: '#FFEBEE' }
  case 207:
    return { color: 'red', message: 'red', text: 'Shipping Completed', bgColor: '#FFEBEE' }
  default:
    return { color: 'grey', message: 'grey', text: '', bgColor: '#FFF3E0' }
  }
}

const statuses = [ 'Approve', 'Reject', 'Back to Edit']

// ฟังก์ชันสำหรับสุ่มสถานะ
function getRandomStatus() {
  const randomIndex = Math.floor(Math.random() * statuses.length)
  
  return statuses[randomIndex]
}

function getRandomDate(start, end) {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
  const randomDate = new Date(randomTime)
  
  const year = randomDate.getFullYear()
  const month = String(randomDate.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const day = String(randomDate.getDate()).padStart(2, '0')
  
  return `${day}/${month}/${year}`
}

const checkBgTruck = truck => {
  if(truck === 'BTS'){
    return 'bg-red-lighten-4'
  }else if(truck === 'LCL'){
    return 'bg-warning'
  } 
}

//----------------------------------------- fetch data ----------------------------------
//---- select data --------------------------------

const { getSelectDataResult, errorGetSelectData, fetchSelectData } = useGetSelectDataService()

const getSelectData = async type => {
  try {
    const result = await fetchSelectData(
      urlApi.value,
      type,
      whereHouse,
      accessTokenAtStore,
    )

    if (result) {
      // console.log(`Fetched ${type}:`, getSelectDataResult.value)
      
      return getSelectDataResult.value
    } else {
      console.error('No result from API')
      
      return [] // Return empty array if no result
    }
  } catch (error) {
    console.error(`Error fetching ${type}:`, error)
    console.error(`Error(service) fetching ${type}:`, errorGetSelectData)
    
    return [] // Return empty array on error
  }
}

onMounted(async () => {
  const [freightForwarders, carriers, vessels, truck] = await Promise.all([
    getSelectData('getfreightforwarders'),
    getSelectData('getcarriers'),
    getSelectData('getvessels'),
    getSelectData('gettrucks'),
  ])

  freightForwarderModel.value = freightForwarders
  carrierModel.value = carriers
  vesselsModel.value = vessels
  truckModel.value = truck
})

const itemMock = ref([
  'Foo', 'Barหกฟหกฟหกฟหกฟหกฟหก', 'Fizz', 'Buzz',
])

//------------------------------------------ Mock Data --------------------------------
import mockData from './dataMock'

//------------------------ Set Permissions (Hiden and Show Column) ------------------------
const accountAmin = ref (false)
const accountViewerKK = ref (false)
const accountINSP = ref (false)
const accountSALLOG = ref (false)
const accountSAL = ref (false)
const accountLOG = ref (false)
const accountWH = ref (false)
const accountWHSub = ref (false)
const accountAll = ref (true)

const setAccount = role => {
  accountAmin.value = false
  accountViewerKK.value = false
  accountINSP.value = false
  accountSALLOG.value = false

  accountSAL.value = false
  accountLOG.value = false

  accountWH.value = false
  accountAll.value = false

  accountWHSub.value = false

  if (role === 'Amin') {
    accountAmin.value = true
    accountViewerKK.value = false
    accountINSP.value = false
    accountSALLOG.value = false
    accountWH.value = false
    accountWHSub.value = false
    accountAll.value = false
  } else if (role === 'ViewerKK') {
    accountAmin.value = false
    accountViewerKK.value = true
    accountINSP.value = false
    accountSALLOG.value = false
    accountWH.value = false
    accountWHSub.value = false
    accountAll.value = false
  } else if (role === 'INSP') {
    accountAmin.value = false
    accountViewerKK.value = false
    accountINSP.value = true
    accountSALLOG.value = false
    accountWH.value = false
    accountWHSub.value = false
    accountAll.value = false
  } else if (role === 'SALLOG') {
    accountAmin.value = false
    accountViewerKK.value = false
    accountINSP.value = false
    accountSALLOG.value = true
    accountWH.value = false
    accountWHSub.value = false
    accountAll.value = false
  } 

  else if (role === 'SAL') {
    accountAmin.value = false
    accountViewerKK.value = false
    accountINSP.value = false
    accountSAL.value = true
    accountLOG.value = false
    accountWH.value = false
    accountWHSub.value = false
    accountAll.value = false
  } 

  else if (role === 'LOG') {
    accountAmin.value = false
    accountViewerKK.value = false
    accountINSP.value = false
    accountSAL.value = false
    accountLOG.value = true
    accountWH.value = false
    accountWHSub.value = false
    accountAll.value = false
  } 
  
  else if (role === 'WH') {
    accountAmin.value = false
    accountViewerKK.value = false
    accountINSP.value = false
    accountSALLOG.value = false
    accountWH.value = true
    accountWHSub.value = false
    accountAll.value = false
    
  } else if (role === 'WHSub') {
    accountAmin.value = false
    accountViewerKK.value = false
    accountINSP.value = false
    accountSALLOG.value = false
    accountWH.value = false
    accountWHSub.value = true
    accountAll.value = false
    
  }  
  else if (role === 'All') {
    accountAmin.value = false
    accountViewerKK.value = false
    accountINSP.value = false
    accountSALLOG.value = false
    accountWH.value = false
    accountWHSub.value = false
    accountAll.value = true
  }

  console.log('Switch Acc', accountAmin.value, accountViewerKK.value, accountINSP.value, accountSALLOG.value, accountWH.value, accountAll.value)

  // สามารถเพิ่มเงื่อนไขสำหรับ role อื่นๆ ได้ที่นี่
}

//-------------------
//----- Rune
const rules = [v => v.length <= 150 || 'Max 25 characters']

//--------- new expention
const panel = ref(['filter'])

///---------------- Dialog 
const isDialogVisiblePrintTruck = ref(false)

///------------ Dialog PDF

const isDialogPDFViewVisible = ref(false)
const currentPageDataTable = ref(1)
const imgDialogPDF = ref('')
const imgDialogPng = ref('')

//--------------------------- File INput --------------------------------

import FileInputDialogCarousels from '@/components/golbal/flieUploadDialogCarousels.vue' //--------- import component
import { watchEffect } from 'vue'

const viewAllData = () => {
  console.log(mockData.value)
}

const typeFileInput = ref('hideInput')

const filesFromUploader = ref([])
const typeNameFileInput = ref('')

const addNameTypeFileInput = name => {
  typeNameFileInput.value = name
}

// ฟังก์ชันจัดการข้อมูลที่ส่งมาจาก FileUploader
const handleFileUpdates = updatedFiles => {
  filesFromUploader.value = updatedFiles
  console.log('Updated Files:', filesFromUploader.value)
  console.log('Name Files:', typeNameFileInput.value)
}

//------------------------------------------ Check Sheet To Page Resale -----------------------
function redirectBasedOnStatus(status) {
  // ดึงเฉพาะตัวเลขหลักแรกของ status
  const mainStatus = Math.floor(status / 100)

  // กำหนดประเภทตามเลขหลักแรกของ status
  const statusMapping = {
    1: "Drum",
    2: "Drum",
    3: "Drum",
    4: "Drum",
    0: "Drum",
    8: "Drum",
    9: "Drum",
    5: "IBC",
    6: "Flexi",
    7: "Lorry",
    10: "Flexi",
  }

  // ตรวจสอบว่า status มีใน mapping หรือไม่
  const subPath = statusMapping[mainStatus] || "unknown-status"

  // ต่อ URL เดิมด้วย path ใหม่
  const currentPath = window.location.pathname // ดึง path ปัจจุบัน
  const newPath = `${currentPath}/${subPath}` // ต่อท้าย subPath

  // เปลี่ยนเส้นทางไปยัง path ใหม่
  console.log(`Redirecting to: ${newPath}`)
  window.location.href = newPath
}

const isSpinning = ref(false)

const refeshPage = () => {
  isSpinning.value = true
  setTimeout(() => {
    isSpinning.value = false
  }, 10 * 1000) // ระยะเวลาในการหมุน (1000 มิลลิวินาที = 1 วินาที)
  location.reload()
}
</script>

<template>
  <!-- Title Page -->
  <div>
    <VCard>
      <VCardTitle>
        <div class="d-flex align-center">
          <VRow class="d-flex align-center">
            <VCol cols="2">
              <IconBtn
                class="cursor-pointer"
                color="#FFFFFF"
                :to="{ name: 'skt-receiving',
                }"
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
              class="text-center"
            >
              <div>
                <span
                  style="font-size: 22px; font-weight: bold;"
                  class="text-center"
                >{{ $t('Shipment Plan') }}</span>
              </div>
            </VCol>
            <VCol
              cols="2"
              class="d-flex justify-end"
            >
              <VBtn
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
  </div>
  <!-- Expansion -->
  <section>
    <div>
      <VExpansionPanels
        v-model="panel"
        multiple
      >
        <VExpansionPanel value="filter">
          <VExpansionPanelText>
            <VForm @submit.prevent="submitSearchButton">
              <!-- Barcode | Product code | Product Name | Button Export -->
              <VRow>
                <!-- 👉 Select Barcode -->
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <!-- 👉 Search Product code -->
                  <AppDateTimePicker
                    v-model="filterForSearchPlan.ETA"
                    placeholder="Select ETA"
                    prepend-inner-icon="ri-calendar-schedule-fill"
                    density="compact"
                    :config="{ dateFormat: 'd/m/Y' }"
                  />
                </VCol>

                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <!-- 👉 Search Product code -->
                  <AppDateTimePicker
                    v-model="filterForSearchPlan.ETD"
                    prepend-inner-icon="ri-calendar-schedule-fill"
                    placeholder="Select ETD"
                    density="compact"
                    style="font-size: 14px;"
                    :config="{ dateFormat: 'd/m/Y' }"
                  >
                    <template #label>
                      <span style="font-size: 12px;">ETD</span>
                    </template>
                  </AppDateTimePicker>
                </VCol>
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <!-- 👉 Search Product code -->
                  <VTextField
                    v-model="filterForSearchPlan.SalesOrderNoSearch"
                    density="compact"
                  >
                    <template #label>
                      <span style="font-size: 12px;">Sale Order No.</span>
                    </template>
                  </VTextField>
                </VCol>

                <!-- 👉 Select Product code -->
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <VTextField
                    v-model="filterForSearchPlan.PayerNameSearch"
                    density="compact"
                  >
                    <template #label>
                      <span style="font-size: 12px;">Payer Name</span>
                    </template>
                  </VTextField>
                </VCol>

                <!-- 👉 Select Product Name -->
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <VTextField
                    v-model="filterForSearchPlan.ItemNameSearch"
                    density="compact"
                  >
                    <template #label>
                      <span style="font-size: 12px;">Item Name</span>
                    </template>
                  </VTextField>
                </VCol>

                <!-- 👉 Button Search and Export -->
                <VCol
                  cols="12"
                  lg="4"
                  class="py-1 d-flex"
                >
                  <VRow>
                    <VCol cols="4">
                      <VBtn
                        height="100%"
                        width="100%"
                        color="green"
                        density="compact"
                        class="mx-0"
                        
                        @click="searchFilterPlanFunctionBtn"
                      >
                        <span style="font-size: 12px;">{{ $t('Search') }}</span>
                      </VBtn>
                    </VCol>
                    <VCol cols="4">
                      <VBtn
                        color="red"
                        height="100%"
                        width="100%"
                        density="compact"
                        @click="clearFilterPlanFunctionBtn"
                      >
                        <span style="font-size: 12px;">{{ $t('Clear') }}</span>
                      </VBtn>
                    </VCol>
                    <VCol
                      cols="4"
                      md="4"
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
                        <span style="font-size: 12px;">{{ $t('Export file') }}</span>
                      </VBtn>
                    </VCol>
                  </VRow>
                </VCol>
              </VRow>
            </VForm>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </div>
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
                }} :</span>{{ detailsProduct }}
              </div>
            </VCardText>
          </div>
        </VExpandTransition>
      </VCard>
    </VDialog>
  </section>

  <!-- Dialog Print Shipping Mark -->
  <div>
    <VDialog
      v-model="isDialogVisiblePrintShippingMark"
      width="50%"
    >
      <!-- Dialog Content -->
      <VCard>
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogVisiblePrintShippingMark = false"
        />

        <VCardTitle>
          <div class="text-center">
            <span>Print Shipping Mark</span>
          </div>
        </VCardTitle>

        <VCardText>
          <div class="d-flex justify-spance-between align-center">
            <VRow>
              <VCol cols="12">
                <span class="my-4">Sale Order No. : {{ exmpleSaleOrder }}</span>
              </VCol>
              <VCol cols="12">
                <VTextarea
                  v-model="exmpleShippingMark"
                  readonly
                  label="Shipping Mark"
                  style="min-width: 220px;"
                  :rules="rules"
                  rows="2"
                  clearable
                  placeholder="Shipping Mark"
                />
              </VCol>
            </VRow>
          </div>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VRow>
            <VCol
              cols="6"

              class="d-flex justify-end align-center"
            >
              <span>Print Coppy:</span>
            </VCol>
            <VCol
              cols="6"
              class="d-flex justify-start"
            >
              <VTextField
                density="compact"
                  
                type="number"
                min="0"
              >
                <template #append-inner>
                  <span>
                    Coppy
                  </span>
                </template>
              </VTextField>
            </VCol>
          </VRow>
          <VBtn
            color="warning"
            @click="printLabel"
          >
            <VIcon
              size="30"
              icon="ri-printer-fill"
            />
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>

  <!-- Btn Test Role -->
  <div
    v-if="false"
    class="mt-4"
  >
    <VCard>
      <VCardText>
        <VRow>
          <VCol cols="6">
            <VBtn
              color="yellow"
              @click="setAccount('Amin')"
            >
              Admin
            </VBtn>
            <VBtn
              color="blue"
              @click="setAccount('ViewerKK')"
            >
              ViewerKK
            </VBtn>
            <VBtn
              color="brown"
              @click="setAccount('INSP')"
            >
              INSP
            </VBtn>
            <VBtn
              color="light-blue"
              @click="setAccount('SAL')"
            >
              SAL
            </VBtn>
            <VBtn
              color="light-blue"
              @click="setAccount('LOG')"
            >
              LOG
            </VBtn>
            <VBtn
              color="light-blue"
              @click="setAccount('SALLOG')"
            >
              SAL/LOG
            </VBtn>
            <VBtn
              color="deep-purple"
              @click="setAccount('WH')"
            >
              WH
            </VBtn>
            <VBtn
              color="deep-purple"
              @click="setAccount('WHSub')"
            >
              WH Sub
            </VBtn>
            <VBtn @click="setAccount('All')">
              All
            </VBtn>
            <VBtn @click="viewAllData">
              All
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>

  <section>
    <VDialog
      v-model="isDialogVisiblePrintTruck"
      width="100%"
    >
      <!-- Dialog Content -->
      <VCard title="Truck Order">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogVisiblePrintTruck = false"
        />

        <VCardText style="overflow-x: auto;">
          <table class="custom-table">
            <thead>
              <tr>
                <th
                  colspan="12"
                  class="text-center"
                >
                  SANYO KASEI (THAILAND) LTD.
                </th>
              </tr>
              <tr>
                <th
                  colspan="12"
                  class="text-center"
                >
                  Rojana Industrial Park-Rayong, 5/5 Moo 11 T. Nongbua, A.Bankhai, Rayong 21120
                </th>
              </tr>
              <tr>
                <th
                  colspan="12"
                  class="text-center"
                >
                  Tel. : (038) 627-050 Fax. (038 946-072)
                </th>
              </tr>
              <tr>
                <th
                  colspan="12"
                  class="text-center"
                >
                  ใบสั่งรถขนส่ง / Truck Order
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th colspan="4">
                  วันที่ (Date):
                </th>
                <td
                  colspan="8"
                  class="text-start"
                >
                  24/07/2024
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  เลขที่ใบสั่งงานรถขนส่ง (Truck Order No)
                </th>
                <th colspan="8">
                  <VTextField
                    style="min-width: 250px;"
                    density="compact"
                    class="text-center"
                  >
                    <template #prepend>
                      Running Number:
                    </template>
                  </VTextField>
                </th>
              </tr>
              <tr>
                <th colspan="4">
                  เลขที่อ้างอิง (Ref SO No.)
                </th>
                <td
                  colspan="8"
                  class="text-start"
                >
                  1100077645
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  ชื่อบริษัท (Company Name)
                </th>
                <th colspan="8">
                  <VAutocomplete
                    class="text-center"
                    density="compact"
                    label="Company Name"
                    :items="items"
                    placeholder="Select State"
                  />
                </th>
              </tr>
              <tr>
                <th colspan="4">
                  ที่อยู่ (Address)
                </th>
                <td
                  colspan="8"
                  class="text-start"
                >
                  LEO Global Logistics Public Company Limited 251-251/1 Soi Pakdee, Rama 3 Road, Bangkorlaem, Bangkok 10120 Thailand
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  บริษัทขนส่ง (Transportation Company Name)
                </th>
                <th
                  colspan="8"
                  class="text-center"
                >
                  <VAutocomplete
                    class="text-center"
                    density="compact"
                    label="Transportation Company Name"
                    :items="items"
                    placeholder="Select State"
                  />
                </th>
              </tr>
              <tr>
                <th colspan="4">
                  ประเภทรถ (Truck Type)
                </th>
                <th
                  colspan="8"
                  class="text-center"
                >
                  <VAutocomplete
                    class="text-center"
                    density="compact"
                    label="Truck Type"
                    :items="items"
                    placeholder="Select State"
                  />
                </th>
              </tr>
              <tr>
                <th colspan="4">
                  ทะเบียนรถ (Truck License)
                </th>
                <th
                  colspan="8"
                  class="text-center"
                >
                  <VTextField
                    style="min-width: 250px;"
                    density="compact"
                    label="Enter Truck License"
                    class="text-center"
                  />
                </th>
              </tr>
              <tr>
                <th colspan="4">
                  ชื่อพนักงานขับรถ (Driver's Name)
                </th>
                <td
                  colspan="8"
                  class="text-center"
                >
                  <VTextField
                    style="min-width: 250px;"
                    density="compact"
                    label="Driver's Name"
                    placeholder="MR. ABCD"
                    class="text-center"
                  />
                </td>
              </tr>
              <tr v-if="false">
                <th colspan="4">
                  เลขที่อ้างอิง (Ref SO No.)
                </th>
                <td
                  colspan="8"
                  class="text-center"
                >
                  <VTextField
                    style="min-width: 250px;"
                    density="compact"
                    label="Ref SO No."
                    placeholder="000000000"
                    class="text-center"
                  />
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  เบอร์ติดต่อ (Tel.)    
                </th>
                <td
                  colspan="8"
                  class="text-center"
                >
                  <VTextField
                    style="min-width: 250px;"
                    density="compact"
                    label="Tel."
                    placeholder="000-0000000"
                    class="text-center"
                  />
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  หมายเหตุ (Remark) 
                </th>
                <th
                  colspan="8"
                  class="text-center"
                >
                  <VTextarea
                    label="Default"
                    placeholder="Enter Remark"
                    clearable
                    clear-icon="ri-close-line"
                    row-height="30"
                  />
                </th>
              </tr>
            </tbody>
          </table>
          <table class="custom-table">
            <tr>
              <th colspan="4">
                <VTextField
                  
                  density="compact"
                  class="text-center"
                >
                  <template #label>
                    พนักงานขับรถ / Drivers By
                  </template>
                </VTextField>
              </th>
              <th colspan="4">
                <VTextField
                  
                  density="compact"
                  class="text-center"
                >
                  <template #label>
                    ผู้สั่งการ / Oder By
                  </template>
                </VTextField>
              </th>
              <th colspan="4">
                <VTextField
                  
                  density="compact"
                  class="text-center"
                >
                  <template #label>
                    ผู้อนุมัติ / Authorized By
                  </template>
                </VTextField>
              </th>
            </tr>
            <tr>
              <th colspan="4">
                <VueDatePicker
                  v-model="dateSupervisor"
                  :max-date="new Date()"
                  :enable-time-picker="false"
                />
              </th>
              <th colspan="4">
                <VueDatePicker
                  v-model="dateSupervisor"
                  :max-date="new Date()"
                  :enable-time-picker="false"
                />
              </th>
              <th colspan="4">
                <VueDatePicker
                  v-model="dateSupervisor"
                  :max-date="new Date()"
                  :enable-time-picker="false"
                />
              </th>
            </tr>
          </table>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            color="warning"
            @click="isDialogVisiblePrintTruck = false"
          >
            <VIcon
              start
              icon="ri-printer-fill"
            />
            Print
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <!-- Dialog PDF -->
  <section>
    <VDialog
      v-model="isDialogPDFViewVisible"
      width="60%"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardText>
          <iframe
            v-if="imgDialogPDF"
            :src="imgDialogPDF"
            width="100%"
            height="650px"
          />
          <VImg
            v-else
            height="650px"
            :src="imgDialogPng"
          />
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            variant="outlined"
            color="secondary"
            @click="isDialogPDFViewVisible = false"
          >
            close
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <!-- Btn Approve / PROD APPROVE / NEW BATCH -->
  <div class="my-2">
    <VCard>
      <VCardText class="pa-2">
        <VRow>
          <VCol cols="10">
            <VBtn
              class="mx-2"
              color="warning"
              @click="saveShipmentPlan"
            >
              <span style="font-size: 12px;">Save</span>
            </VBtn>
            <VBtn
              class="mx-2"
              color="primary"
              @click="submitShipmentPlanBySoEId"
            >
              <span style="font-size: 12px;">Submit</span>
            </VBtn>

            <VBtn
              v-if="false"
              color="info"
              class="mx-2"
              @click="saveShipmentPlan"
            >
              <span style="font-size: 12px;">Add Item</span>
            </VBtn>
          </VCol>
          <VCol
            cols="2"
            class="d-flex justify-end"
          >
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
          </VCol>
          <VBtn
            v-if="false"
            @click="testValue"
          >
            Test
          </VBtn>
        </VRow>
      </VCardText>
    </VCard>
  </div>

  <!-- ----------             Product  SKT                                  ------------------------------------ -->
  <section>
    <VCard class="mt-6">
      <div>
        <div
          v-if="errorMessage"
          class="error"
        >
          {{ errorMessage }}
        </div>
        <VProgressLinear
          v-if="!paginatedData"
          height="20"
          color="secondary"
          class="elevation-1"
        >
          <span>No Data....</span>
        </VProgressLinear>
        <VProgressLinear
          v-if="isLoading"
          height="20"
          indeterminate
          color="primary"
          class="elevation-1"
        >
          <span>Loading Data.... {{ errorMessage }}</span>
        </VProgressLinear>
      </div>
      <section v-if="!isLoading">
        <VTable
          v-if="!isLoading"
          class="text-wrap table-header-bg rounded-0"
        >
          <!-- 👉 table head -->
          <thead class="">
            <tr>
              <th>
                <VCheckbox
                  v-model="isSelectAll"
                  :indeterminate="isIndeterminate"
                  @click="toggleSelectAll"
                />
              </th>
              <th
                scope="row"
                class="text-center px-1"
              >
                <span style="font-weight: bold;">{{ $t('No.') }}</span>
              </th>
              <th class="text-center">
                <span style="font-weight: bold;">{{ $t('Status') }}</span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission,'COL_SALE_ORDER_NO').canVisible"
                class="px-2"
              >
                <span style="font-weight: bold;">{{ $t('Sale Order No.') }}<VIcon
                  :icon="sortColumn === 'salesOrderNo' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('salesOrderNo')"
                /></span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission,'COL_SO_ATTACHMENT').canVisible"
                class="text-center"
              >
                <span style="font-weight: bold;">{{ $t('SO attachment') }}</span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission,'COL_SAP_INVOICE_NO').canVisible"
                class="px-2"
              >
                <span style="font-weight: bold;">{{ $t('SAP Invoice no') }}<VIcon
                  :icon="sortColumn === 'sapInvoiceNo' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('sapInvoiceNo')"
                /></span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission,'COL_PAYER_NAME').canVisible"
                class="px-2"
              >
                <span style="font-weight: bold;">{{ $t('Payer Name') }}<VIcon
                  :icon="sortColumn === 'payerName' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('payerName')"
                /></span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission,'COL_USER').canVisible"
                class="px-2"
              >
                <span style="font-weight: bold;">{{ $t('User') }}</span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission,'COL_SHIPPER').canVisible"
                class="px-2"
              >
                <span style="font-weight: bold;">{{ $t('Shipper') }}<VIcon
                  :icon="sortColumn === 'shipper' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('shipper')"
                /></span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission,'COL_SHIPPER_LOCATION').canVisible"
                class="px-2"
              >
                <span style="font-weight: bold;">{{ $t('Shipper location') }}<VIcon
                  :icon="sortColumn === 'shipperLocation' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('shipperLocation')"
                /></span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission,'COL_SHIPPING_MARK').canVisible"
                class="text-start px-2"
              >
                <div>
                  <span style="font-weight: bold;">
                    {{ $t('Shipping Mark/Cond.') }}
                  </span>
                </div>
              </th>
              <th v-if="canVisibleUserPermission(statusPermission,'COL_END_USER').canVisible">
                <span style="font-weight: bold;">{{ $t('End User') }}</span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission,'COL_CONSIGNEE').canVisible"
                class="px-2"
              >
                <span style="font-weight: bold;">{{ $t('Consignee') }}<VIcon
                  :icon="sortColumn === 'consignee' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('consignee')"
                /></span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission,'COL_PRODUCT').canVisible"
                class="px-2"
              >
                <span style="font-weight: bold;">{{ $t('Item Name') }}<VIcon
                  :icon="sortColumn === 'itemName' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('itemName')"
                /></span>
              </th>
              <th v-if="canVisibleUserPermission(statusPermission,'COL_LOT_NUMBER').canVisible">
                <span style="font-weight: bold;">{{ $t('Lot') }}<VIcon
                  :icon="sortColumn === 'lot' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('lot')"
                /></span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission,'COL_QTY_KG').canVisible"
                class="text-end px-2"
              >
                <span style="font-weight: bold;">{{ $t('Qty. (Kg.)') }}<VIcon
                  :icon="sortColumn === 'quantity' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('quantity')"
                /></span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission,'COL_COA').canVisible"
                class="text-center"
              >
                <span style="font-weight: bold;">{{ $t('COA') }}</span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission,'COL_FREIGHT_FORWARDER').canVisible"
                class="bg-green-lighten-3"
              >
                <span
                  style="font-weight: bold;"
                  class="text-black"
                >{{ $t('Freight forwarder') }}<VIcon
                  :icon="sortColumn === 'freightForwarder' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('freightForwarder')"
                /></span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission,'COL_CARRIER').canVisible"
                class="bg-green-lighten-3 text-start"
                style="min-width: 150px;"
              >
                <span
                  style="min-width: 250px; font-weight: bold;"
                  class="text-start"
                >{{ $t('Carrier') }}<VIcon
                  :icon="sortColumn === 'carrier' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('carrier')"
                /></span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission,'COL_VESSEL_NAME').canVisible"
                class="bg-green-lighten-3"
              >
                <span
                  style="font-weight: bold;"
                  class="text-black"
                >{{ $t('Vessel name') }}<VIcon
                  :icon="sortColumn === 'vesselName' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('vesselName')"
                /></span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission,'COL_VOY').canVisible"
                class="bg-yellow-lighten-3"
              >
                <span
                  style="font-weight: bold;"
                  class="text-black"
                >{{ $t('Voy') }}<VIcon
                  :icon="sortColumn === 'voy' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('voy')"
                /></span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission,'COL_TRUCK').canVisible"
                class="bg-green-lighten-3"
              >
                <span style="font-weight: bold;">{{ $t('Truck') }}<VIcon
                  :icon="sortColumn === 'truck' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('truck')"
                /></span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission,'COL_TRUCK_RESERVING_NUMBER').canVisible"
                class="bg-yellow-lighten-3 texct-end"
              >
                <span style="font-weight: bold;">{{ $t('Truck Reserving Number') }}<VIcon
                  :icon="sortColumn === 'truckReservingNumber' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('truckReservingNumber')"
                /></span>
              </th>
              <th v-if="canVisibleUserPermission(statusPermission,'COL_TRUCK_FEE').canVisible">
                <span style="font-weight: bold;">{{ $t('Truck fee') }}<VIcon
                  :icon="sortColumn === 'truckFee' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('truckFee')"
                /></span>
              </th>
              <th
                v-if="true"
                class="text-center"
              >
                <span style="padding-left: 1px; font-weight: bold;">{{ $t('Truck Order') }}</span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission,'COL_DO_EX').canVisible"
                class="px-4"
              >
                <span style="font-weight: bold;">{{ $t('DO/EX') }}<VIcon
                  :icon="sortColumn === 'doEx' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('doEx')"
                /></span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission,'COL_COUNTRY').canVisible"
                class="px-2"
              >
                <span style="font-weight: bold;">{{ $t('Country') }}<VIcon
                  :icon="sortColumn === 'country' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('country')"
                /></span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission,'COL_LOADING_DATE').canVisible"
                class="text-start px-2"
              >
                <span style="font-weight: bold;">{{ $t('Loading date') }}<VIcon
                  :icon="sortColumn === 'logUpdatedDate' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('logUpdatedDate')"
                /></span>
              </th>
              <th v-if="canVisibleUserPermission(statusPermission,'COL_ETD').canVisible">
                <VRow>
                  <VCol cols="6">
                    <span style="font-weight: bold;">{{ $t('ETD') }}</span>
                  </VCol>
                  <VCol
                    class="d-flex justify-end"
                    cols="6"
                  >
                    <VIcon
                      :icon="sortColumn === 'etd' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                      class="clickable-icon"
                      @click="toggleDirection('etd')"
                    />
                    <VIcon
                      size="25"
                      icon="ri-calendar-todo-fill"
                    />
                  </VCol>
                </VRow>
              </th>
              <th v-if="canVisibleUserPermission(statusPermission,'COL_ETA').canVisible">
                <VRow>
                  <VCol cols="6">
                    <span style="font-weight: bold;">{{ $t('ETA') }}</span>
                  </VCol>
                  <VCol
                    class="d-flex justify-end"
                    cols="6"
                  >
                    <VIcon
                      :icon="sortColumn === 'eta' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                      class="clickable-icon"
                      @click="toggleDirection('eta')"
                    />
                    <VIcon
                      size="25"
                      icon="ri-calendar-todo-fill"
                    />
                  </VCol>
                </VRow>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission,'COL_DELIVERY_NOTE').canVisible"
                class="text-center"
              >
                <span style="font-weight: bold;">{{ $t('Delivery note') }}</span>
              </th>
              <th v-if="canVisibleUserPermission(statusPermission,'COL_REMARK_SAL').canVisible">
                <span style="font-weight: bold;">{{ $t('Remark (SAL)') }}<VIcon
                  :icon="sortColumn === 'saL_Remarks' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('saL_Remarks')"
                /></span>
              </th>
              <th v-if="canVisibleUserPermission(statusPermission,'COL_REMARK_WH').canVisible">
                <span style="font-weight: bold;">{{ $t('Remark (WH)') }}<VIcon
                  :icon="sortColumn === 'wH_Remarks' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('wH_Remarks')"
                /></span>
              </th>
              <th v-if="canVisibleUserPermission(statusPermission,'COL_REMARK_LOG').canVisible">
                <span style="font-weight: bold;">{{ $t('Remark (LOG)') }}<VIcon
                  :icon="sortColumn === 'loG_Remarks' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('loG_Remarks')"
                /></span>
              </th>
              <th class="px-1">
                <span style="font-weight: bold;">{{ $t('Updated By') }}<VIcon
                  :icon="sortColumn === 'updatedBy' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('updatedBy')"
                /></span>
              </th>
              <th class="px-1">
                <span style="font-weight: bold;">{{ $t('Updated Date') }}<VIcon
                  :icon="sortColumn === 'updatedDate' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('updatedDate')"
                /></span>
              </th>
              <th class="text-center">
                <span style="font-weight: bold;" />
              </th>
              <th class="text-center">
                <span style="font-weight: bold;">{{ $t('Action') }}</span>
              </th>
              <th class="text-center">
                <span style="font-weight: bold;" />
              </th>
            </tr>
          </thead>
          <!-- 👉 table body -->
          <tbody>
            <tr
              v-for="(product, index) in paginatedData"
              :key="index"
            >
              <td
                class="cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <VCheckboxBtn
                  v-model="selectedDataTables"
                  :value="product"
                />
              </td>
              <td
                class="cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <span>{{ (currentPageDataTable - 1) * 10 + index + 1 }}</span>
              </td>
              <td
                class="cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <span>
                  <VChip
                    :color="colorStatusWithId(product.statusId).color"
                    :style="{ color: colorStatusWithId(product.statusId).color }"
                  >{{ colorStatusWithId(product.statusId).text }} 
                    <VTooltip
                      activator="parent"
                      location="right"
                    >
                      <p>{{ colorStatusWithId(product.inspStatusId).text }}</p>
                      <p>{{ colorStatusWithId(product.salStatusId).text }}</p>
                      <p>{{ colorStatusWithId(product.logStatusId).text }}</p>
                      <p class="mb-0">{{ colorStatusWithId(product.whStatusId).text }}</p>
                    </VTooltip>
                  </VChip>
                  
                </span>
              </td>
              <!-- 👉 saleOrderNo -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_SALE_ORDER_NO').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 150px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                {{ product.salesOrderNo }}
              </td>
              <!-- 👉 soAttachment -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_SO_ATTACHMENT').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 250px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <div>
                  <FileInputDialogCarousels
                    title-dialog="So Attachment"
                    :disabled-prop="!canVisibleUserPermission(statusPermission,'COL_SO_ATTACHMENT').canExecute"
                    :type-file-input="typeFileInput"
                    file-name="So Attachment" 
                    @updateFiles="handleFileUpdates"
                  />
                </div>
              </td>
              <!-- 👉 sapInvoiceNo -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_SAP_INVOICE_NO').canVisible"
                class="text-start px-2 cursor-pointer"
                style="min-width: 150px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                {{ product.sapInvoiceNo }}
              </td>
              <!-- 👉 payerName -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_PAYER_NAME').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 150px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                {{ (product.payerName) }}
              </td>
              <!-- 👉 user -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_USER').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 200px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <span class="d-felx align-start">{{ (product.user) }}</span>
              </td>
              <!-- 👉 shipper -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_SHIPPER').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 200px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                {{ (product.shippingUserName) }}
              </td>

              <!-- 👉 shipperLocation -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_SHIPPER_LOCATION').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 300px; max-width: 300px;  font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                {{ (product.shipperLocation) }}
              </td>

              <!-- 👉 Shipping Condition -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_SHIPPING_MARK').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 180px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <div class="text-start cursor-pointer">
                  <VBtn
                    :disabled="!canVisibleUserPermission(statusPermission,'COL_SHIPPING_MARK').canExecute"
                    style="min-width: 150px; max-width: 160px;"
                    variant="outlined"
                    :color="product.shipperConditions ? 'primary' : 'grey'"
                    @click="textAreaShipDialogActive2('ShipMC',product.shipperMark, product.shipperConditions, index, product.soEtlLogDetailJournalID)"
                  >
                    <span
                      v-if="product.shipperConditions"
                      style="overflow: hidden;min-width: 100px; max-width: 150px; text-overflow: ellipsis;"
                    >{{ product.shipperConditions }}</span>
                    <span
                      v-else
                      style="font-size: 12px;"
                    >Shipping Mark/ConD</span>
                  </VBtn>
                </div>
              </td>

              <!-- 👉 endUser -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_END_USER').canVisible"
                class="text-start px-1 cursor-pointer"
                style="font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <VTextField
                  v-model="product.shippingEndUser"
                  density="compact"
                  :disabled="!canVisibleUserPermission(statusPermission,'COL_END_USER').canExecute"
                  style=" min-width: 150px;"
                >
                  <template #label>
                    <span style="font-size: 12px;">End User</span>
                  </template>
                </VTextField>
              </td>

              <!-- 👉 consignee -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_CONSIGNEE').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 200px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                {{ (product.consignee) }}
              </td>

              <!-- 👉 product -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_PRODUCT').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 250px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                {{ (product.itemName) }}
              </td>

              <!-- 👉 Lot Number -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_LOT_NUMBER').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 150px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <VBtn
                  v-if=" product.lot.length > 1"
                  style="min-width: 50px; max-width: 80px;"
                  :disabled="!canVisibleUserPermission(statusPermission,'COL_LOT_NUMBER').canExecute"
                  variant="outlined"
                  @click="textAreaDialogActive('Lot', product.lot)"
                >
                  <span
                    v-if="product.lot"
                    style="overflow: hidden; max-width: 60px; text-overflow: ellipsis;"
                  >{{ product.lot[0].lotNUmber }}...</span>
                  <span v-else>Lot Number</span>
                </VBtn>
                <span v-else>{{ product.lot }}</span>
              </td>

              <!-- 👉 qty -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_QTY_KG').canVisible"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                class="text-end px-1 cursor-pointer"
                style="min-width: 100px; font-size: 12px;"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                {{ formatNumber(product.quantity) }}
              </td>

              <!-- 👉 coa -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_COA').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 250px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <div>
                  <FileInputDialogCarousels
                    title-dialog="COA"
                    :disabled-prop="!canVisibleUserPermission(statusPermission,'COL_COA').canExecute"
                    :type-file-input="typeFileInput"
                    file-name="COA" 
                    @updateFiles="handleFileUpdates"
                  />
                </div>
              </td>

              <!-- 👉 Freight Forwarder -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_FREIGHT_FORWARDER').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 200px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <VSelect
                  v-model="product.freightForwarder"
                  :items="freightForwarderModel"
                  class="truncate-select"
                  item-title="freightForwarder"
                  item-value="freightForwarder"
                  density="compact"
                  eager
                />
              </td>

              <!-- 👉 carrier -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_CARRIER').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 200px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <VSelect
                  v-model="product.carrier"
                  :disabled="!canVisibleUserPermission(statusPermission,'COL_CARRIER').canExecute"
                  :items="carrierModel"
                  class="truncate-select"
                  item-title="carrier"
                  item-value="carrier"
                  density="compact"
                  eager
                />
              </td>

              <!-- 👉 vesselName -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_VESSEL_NAME').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 200px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <VSelect
                  v-model="product.vesselName"
                  class="truncate-select"
                  :items="vesselsModel"
                  item-title="carrier"
                  item-value="carrier"
                  :disabled="!canVisibleUserPermission(statusPermission,'COL_VESSEL_NAME').canExecute"
                  density="compact"
                  eager
                />
              </td>

              <!-- 👉 voy -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_VOY').canVisible"
                style="font-size: 12px;"
                class="text-start px-1 cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <VTextField
                  v-model="product.voy"
                  :disabled="!canVisibleUserPermission(statusPermission,'COL_VOY').canExecute"
                  density="compact"
                  style=" min-width: 150px;"
                />
              </td>


              <!-- 👉 COL_TRUCK -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_TRUCK').canVisible"
                class="text-start px-1 cursor-pointer"
                :class="checkBgTruck(product.truck)"
                style="font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <VRow>
                  <VCol cols="12">
                    <VSelect
                      v-model="product.truck"
                      :items="truckModel"
                      :menu-props="{ top: true, offsetY: true }"
                      item-title="truck"
                      class="truncate-select"
                      item-value="truck"
                      :disabled="!canVisibleUserPermission(statusPermission,'COL_TRUCK').canExecute"
                      density="compact"
                      dense
                    />
                  </VCol>
                </VRow>
              </td>

              <!-- 👉 truckReserving -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_TRUCK_RESERVING_NUMBER').canVisible"
                class="text-center px-1 cursor-pointer"
                style="min-width: 250px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <VTextField
                  v-if="true"
                  v-model="product.truckReservingNumber"
                  density="compact"
                  :disabled="!canVisibleUserPermission(statusPermission,'COL_TRUCK_RESERVING_NUMBER').canExecute"
                  style=" min-width: 150px;"
                />
              </td>

              <!-- 👉 truckFee -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_TRUCK_FEE').canVisible"
                class="text-start px-1 cursor-pointer"
                style="font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <VTextField
                  v-model="product.truckFee"
                  :disabled="!canVisibleUserPermission(statusPermission,'COL_TRUCK_FEE').canExecute"
                  density="compact"
                  style=" min-width: 150px;"
                />
              </td>

              <!-- 👉 truckOrder -->
              <td
                v-if="accountAmin || accountViewerKK || accountWH || accountWHSub || accountAll"
                class="text-start px-2 cursor-pointer"
                style="min-width: 350px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <VRow>
                  <VCol cols="3">
                    <VBtn
                      width="90px"
                      color="warning"
                      class="mx-2"
                      @click="isDialogVisiblePrintTruck = true"
                    >
                      <VIcon
                        size="30"
                        icon="ri-printer-fill"
                      />
                    </VBtn>
                  </VCol>
                  <VCol cols="9">
                    <FileInputDialogCarousels
                      title-dialog="Truck Order"
                      :disabled-prop="false"
                      :type-file-input="typeFileInput"
                      file-name="Truck Order"
                    
                      @updateFiles="handleFileUpdates"
                    />
                  </VCol>
                </VRow>
              </td>

              <!-- 👉 doEx -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_DO_EX').canVisible"
                class="text-start px-4 cursor-pointer"
                style="min-width: 150px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                {{ (product.doEx) }}
              </td>

              <!-- 👉 country -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_COUNTRY').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 150px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                {{ (product.country) }}
              </td>

              <!-- 👉 loadingDate -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_LOADING_DATE').canVisible"
                class="text-start px-1"
                style="min-width: 150px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                {{ (product.loadingDate) }}
              </td>

              <!-- 👉 etd -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_ETD').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 150px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <AppDateTimePicker
                  v-if="canVisibleUserPermission(statusPermission,'COL_ETD').canExecute"
                  v-model="product.etd"
                  density="compact"
                  prepend-inner-icon="ri-calendar-schedule-fill"
                  :config="{ dateFormat: 'd/m/Y' }"
                />
                <span v-else>{{ formatDate(product.etd) }}</span>
              </td>

              <!-- 👉 eta -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_ETA').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 150px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <AppDateTimePicker
                  v-if="canVisibleUserPermission(statusPermission,'COL_ETA').canExecute"
                  v-model="product.eta"
                  disabeld
                  density="compact"
                  prepend-inner-icon="ri-calendar-schedule-fill"
                  :config="{ dateFormat: 'd/m/Y' }"
                />
                <span v-else>{{ formatDate(product.eta) }}</span>
              </td>

              <!-- 👉 deliveryNote -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_DELIVERY_NOTE').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 250px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <div>
                  <FileInputDialogCarousels
                    title-dialog="Delivery Note"
                    :disabled-prop="canVisibleUserPermission(statusPermission,'COL_DELIVERY_NOTE').canExecute"
                    :type-file-input="typeFileInput"
                    file-name="Delivery Note" 
                    @updateFiles="handleFileUpdates"
                  />
                </div>
              </td>

              <!-- 👉 remarkSAL -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_REMARK_SAL').canVisible"
                class="text-start px-1 cursor-pointer"
                style="font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <VBtn
                  style="min-width: 150px;"
                  :disabled-prop="!canVisibleUserPermission(statusPermission,'COL_REMARK_SAL').canExecute"
                  variant="outlined"
                  :color="product.saL_Remarks ? 'primary' : 'grey'"
                  @click="textAreaRemarkDialogActive('Remark SAL', product.saL_Remarks, product.soEtlLogDetailJournalID)"
                >
                  <span
                    v-if="product.saL_Remarks"
                    style="overflow: hidden; max-width: 130px; text-overflow: ellipsis;"
                  >{{ product.saL_Remarks }}</span>
                  <span v-else>remark(SAL)</span>
                </VBtn>
              </td>

              <!-- 👉 remarkWH -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_REMARK_WH').canVisible"
                class="text-start px-1 cursor-pointer"
                style=" overflow: hidden; max-width: 185px; font-size: 12px; text-overflow: ellipsis;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <VBtn
                  style="min-width: 150px; max-width: 150px;"
                  :disabled-prop="!canVisibleUserPermission(statusPermission,'COL_REMARK_WH').canExecute"
                  variant="outlined"
                  :color="product.wH_Remarks ? 'primary' : 'grey'"
                  @click="textAreaRemarkDialogActive('Remark WH', product.wH_Remarks, product.soEtlLogDetailJournalID)"
                >
                  <span
                    v-if="product.wH_Remarks"
                    style="overflow: hidden; max-width: 130px; text-overflow: ellipsis;"
                  >{{ product.wH_Remarks }}</span>
                  <span v-else>remark(WH)</span>
                </VBtn>
              </td>

              <!-- 👉 remarkLOG -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_REMARK_LOG').canVisible"
                class="text-start px-1 cursor-pointer"
                style="font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <VBtn
                  style="min-width: 150px;"
                  variant="outlined"
                  :disabled-prop="!canVisibleUserPermission(statusPermission,'COL_REMARK_LOG').canExecute"
                  :color="product.loG_Remarks ? 'primary' : 'grey'"
                  @click="textAreaRemarkDialogActive('Remark LOG', product.loG_Remarks, product.soEtlLogDetailJournalID)"
                >
                  <span
                    v-if="product.loG_Remarks"
                    style="overflow: hidden; max-width: 130px; text-overflow: ellipsis;"
                  >{{ product.loG_Remarks }}</span>
                  <span v-else>remark(LOG)</span>
                </VBtn>
              </td>

              <!-- 👉 update by -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_COUNTRY').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 110px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                {{ (product.updatedBy) }}
              </td>

              <!-- 👉 update date -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_COUNTRY').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 120px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                {{ formatDate(product.updatedDate) }}
              </td>


              <!-- 👉 Actions -->
              <td
                v-if="!accountWHSub"
                style="width: 8rem; font-size: 12px;"
                class="text-center px-1 cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <VBtn
                  :disabled="accountINSP"
                  :color="accountINSP ? 'grey' : 'warning'"
                  @click="saveShipmentPlan(product)"
                >
                  <span style="font-size: 12px;">Save Draft</span>
                </VBtn>
              </td>
              <td
                v-if="!accountWHSub"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                style="width: 8rem; font-size: 12px;"
                class="text-center px-1"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <VBtn
                  :disabled="accountINSP"
                  class="mx-2"
                  :color="accountINSP ? 'grey' : 'primary'"
                  @Click="submitShipmentPlanBySoEId(product.soEtlLogDetailJournalID)"
                >
                  <span style="font-size: 12px;">Submit</span>
                </VBtn>
              </td>
              <td
                v-if="accountWHSub"
                style="width: 8rem; font-size: 12px;"
                class="text-center px-1"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <VBtn
                  class="mx-2"
                  :color="accountINSP ? 'grey' : 'primary'"
                >
                  <span style="font-size: 12px;">Approve</span>
                </VBtn>
              </td>
              <td
                style="width: 8rem; font-size: 12px;"
                class="text-center px-1"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? dataTableColor : 
                    isSelected(product) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === product.soEtlLogDetailJournalID ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <VBtn
                  :disabled="accountINSP"
                  :color="accountINSP ? 'grey' : 'pink-lighten-2'"
                  @click="redirectBasedOnStatus(product.statusId)"
                >
                  <span style="font-size: 12px;">Check Sheet</span>
                </VBtn>
              </td>
            </tr>
          </tbody>
          <!-- Total -->
          <tbody v-if="false">
            <tr>
              <td class="bg-green-lighten-5" />
              <td class="bg-green-lighten-5 px-1">
                <span style="font-size: 12px;">TOTAL</span>
              </td>
              <td class="bg-green-lighten-5" />
              <td
                v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll"
                class="bg-green-lighten-5 px-1"
              >
                <span style="font-size: 12px;">{{ mockData.length }} INVOICES</span>
              </td>
              <td
                v-if="accountAmin || accountViewerKK || accountAll"
                class="bg-green-lighten-5"
              />
              <td
                v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
                class="bg-green-lighten-5"
              >
                <span style="font-size: 12px;">{{ mockData.length }} INVOICES</span>
              </td>
            </tr>
          </tbody>
          <VDivider />
        </VTable>

        <VDivider />
        <VCardText>
          <div class="d-flex align-center flex-no-wrap justify-end pa-2">
            <VSelect
              v-model="selectedItemsPerPage"
              style="max-width: 80px;"
              :items="[10, 25, 50, 100, 'All']"
              hide-details
              density="compact"
              dense
              class="mx-4"
            />
            <span>
              {{ (currentPage - 1) * itemsPerPage + 1 }} -
              {{ Math.min(currentPage * itemsPerPage, totalItems) }}
              of {{ totalItems }}
            </span>
            <div class="pagination-container">
              <VBtn
                icon
                variant="text"
                :disabled="currentPage === 1"
                @click="goToFirstPage"
              >
                <VIcon>ri-skip-left-line</VIcon>
              </VBtn>
              <VBtn
                icon
                variant="text"
                :disabled="currentPage === 1"
                @click="goToPrevPage"
              >
                <VIcon>mdi-chevron-left</VIcon>
              </VBtn>
              <VBtn
                icon
                variant="text"
                :disabled="currentPage === totalPages"
                @click="goToNextPage"
              >
                <VIcon>mdi-chevron-right</VIcon>
              </VBtn>
              <VBtn
                icon
                variant="text"
                :disabled="currentPage === totalPages"
                @click="goToLastPage"
              >
                <VIcon>ri-skip-right-line</VIcon>
              </VBtn>
            </div>
          </div>
        </VCardText>
      </section>
      
      <VCardText v-if="false">
        {{ searchPlanData.length }}
        <VDataTable
          v-if="searchPlanData"
          :headers="headersShipment"
          :items="searchPlanData"
          item-key="id"
          show-select
          class="elevation-1"
        >
          <template #item="{ item, index }">
            <tr>
              <td>
                <VCheckboxBtn
                  v-model="selectedDataTables"
                  :value="item.raw"
                  @update:modelValue="(selected) => handleSelection(selected, item.raw)"
                />
              </td>
              <td>
                <span>{{ (currentPageDataTable - 1) * 10 + index + 1 }}</span>
              </td>
              <td>
                <span>{{ item.raw.statusComments }}</span>
              </td>
              <!-- 👉 saleOrderNo -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_SALE_ORDER_NO').canVisible"
                class="text-start px-1"
                style="min-width: 120px; font-size: 12px;"
              >
                {{ item.raw.salesOrderNo }}
              </td>
              <!-- 👉 soAttachment -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_SO_ATTACHMENT').canVisible"
                class="text-start px-1"
                style="min-width: 250px; font-size: 12px;"
              >
                <div>
                  <FileInputDialogCarousels
                    title-dialog="So Attachment"
                    :disabled-prop="!canVisibleUserPermission(statusPermission,'COL_SO_ATTACHMENT').canExecute"
                    :type-file-input="typeFileInput"
                    file-name="So Attachment" 
                    @updateFiles="handleFileUpdates"
                  />
                </div>
              </td>
              <!-- 👉 sapInvoiceNo -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_SAP_INVOICE_NO').canVisible"
                class="text-start px-2"
                style="min-width: 120px; font-size: 12px;"
              >
                {{ item.raw.sapInvoiceNo }}
              </td>
              <!-- 👉 payerName -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_PAYER_NAME').canVisible"
                class="text-start px-1"
                style="min-width: 150px; font-size: 12px;"
              >
                {{ (item.raw.payerName) }}
              </td>
              <!-- 👉 user -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_USER').canVisible"
                class="text-start px-1"
                style="min-width: 200px; font-size: 12px;"
              >
                <span class="d-felx align-start">{{ (item.raw.user) }}</span>
              </td>
              <!-- 👉 shipper -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_SHIPPER').canVisible"
                class="text-start px-1"
                style="min-width: 200px; font-size: 12px;"
              >
                {{ (item.raw.shippingUserName) }}
              </td>

              <!-- 👉 shipperLocation -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_SHIPPER_LOCATION').canVisible"
                class="text-start px-1"
                style="min-width: 300px; max-width: 300px;  font-size: 12px;"
              >
                {{ (item.raw.shipperLocation) }}
              </td>

              <!-- 👉 Shipping Condition -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_SHIPPING_MARK').canVisible"
                class="text-start px-1"
                style="min-width: 180px; font-size: 12px;"
              >
                <div class="text-start">
                  <VBtn
                    :disabled="!canVisibleUserPermission(statusPermission,'COL_SHIPPING_MARK').canExecute"
                    style="min-width: 150px; max-width: 160px;"
                    variant="outlined"
                    :color="item.raw.shipperConditions ? 'primary' : 'grey'"
                    @click="textAreaShipDialogActive('ShipMC',item.raw.shipperMark, item.raw.shipperConditions, index)"
                  >
                    <span
                      v-if="item.raw.shipperConditions"
                      style="overflow: hidden;min-width: 100px; max-width: 150px; text-overflow: ellipsis;"
                    >{{ item.raw.shipperConditions }}</span>
                    <span v-else>Shipping Mark/Coundition.</span>
                  </VBtn>
                </div>
              </td>

              <!-- 👉 endUser -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_END_USER').canVisible"
                class="text-start px-1"
                style="font-size: 12px;"
              >
                <VTextField
                  v-model="item.raw.shippingEndUser"
                  density="compact"
                  :disabled="!canVisibleUserPermission(statusPermission,'COL_END_USER').canExecute"
                  style=" min-width: 150px;"
                >
                  <template #label>
                    <span style="font-size: 12px;">End User</span>
                  </template>
                </VTextField>
              </td>

              <!-- 👉 consignee -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_CONSIGNEE').canVisible"
                class="text-start px-1"
                style="min-width: 200px; font-size: 12px;"
              >
                {{ (item.raw.consignee) }}
              </td>

              <!-- 👉 product -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_PRODUCT').canVisible"
                class="text-start px-1"
                style="min-width: 250px; font-size: 12px;"
              >
                {{ (item.raw.itemName) }}
              </td>

              <!-- 👉 Lot Number -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_LOT_NUMBER').canVisible"
                class="text-start px-1"
                style="font-size: 12px;"
              >
                <VBtn
                  v-if=" item.raw.lot.length > 1"
                  style="min-width: 50px; max-width: 80px;"
                  :disabled="!canVisibleUserPermission(statusPermission,'COL_LOT_NUMBER').canExecute"
                  variant="outlined"
                  @click="textAreaDialogActive('Lot', product.lot)"
                >
                  <span
                    v-if="item.raw.lot"
                    style="overflow: hidden; max-width: 60px; text-overflow: ellipsis;"
                  >{{ item.raw.lot[0].lotNUmber }}...</span>
                  <span v-else>Lot Number</span>
                </VBtn>
                <span v-else>{{ item.raw.lot }}</span>
              </td>

              <!-- 👉 qty -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_QTY_KG').canVisible"
                class="text-end px-1"
                style="min-width: 100px; font-size: 12px;"
              >
                {{ (item.raw.quantity) }}
              </td>

              <!-- 👉 coa -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_COA').canVisible"
                class="text-start px-1"
                style="min-width: 250px; font-size: 12px;"
              >
                <div>
                  <FileInputDialogCarousels
                    title-dialog="COA"
                    :disabled-prop="!canVisibleUserPermission(statusPermission,'COL_COA').canExecute"
                    :type-file-input="typeFileInput"
                    file-name="COA" 
                    @updateFiles="handleFileUpdates"
                  />
                </div>
              </td>

              <!-- 👉 Freight Forwarder -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_FREIGHT_FORWARDER').canVisible"
                class="text-start px-1"
                style="min-width: 200px; font-size: 12px;"
              >
                <VSelect
                  v-model="item.raw.freightForwarder"
                  :items="freightForwarderModel"
                  item-title="freightForwarder"
                  item-value="freightForwarder"
                  density="compact"
                  eager
                />
              </td>

              <!-- 👉 carrier -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_CARRIER').canVisible"
                class="text-start px-1"
                style="min-width: 200px; font-size: 12px;"
              >
                <VSelect
                  v-model="item.raw.carrier"
                  :disabled="!canVisibleUserPermission(statusPermission,'COL_CARRIER').canExecute"
                  :items="carrierModel"
                  item-title="carrier"
                  item-value="carrier"
                  density="compact"
                  eager
                />
              </td>

              <!-- 👉 vesselName -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_VESSEL_NAME').canVisible"
                class="text-start px-1"
                style="min-width: 200px; font-size: 12px;"
              >
                <VSelect
                  v-model="item.raw.vesselName"
                  :items="vesselsModel"
                  item-title="carrier"
                  item-value="carrier"
                  :disabled="!canVisibleUserPermission(statusPermission,'COL_VESSEL_NAME').canExecute"
                  density="compact"
                  eager
                />
              </td>

              <!-- 👉 voy -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_VOY').canVisible"
                style="font-size: 12px;"
                class="text-start px-1"
              >
                <VTextField
                  v-model="item.raw.voy"
                  :disabled="!canVisibleUserPermission(statusPermission,'COL_VOY').canExecute"
                  density="compact"
                  style=" min-width: 150px;"
                />
              </td>


              <!-- 👉 COL_TRUCK -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_TRUCK').canVisible"
                class="text-start px-1"
                :class="checkBgTruck(item.raw.truck)"
                style="min-width: 120px; font-size: 12px;"
              >
                <VSelect
                  v-model="item.raw.truck"
                  :items="truckModel"
                  item-title="truck"
                  item-value="truck"
                  :disabled="!canVisibleUserPermission(statusPermission,'COL_TRUCK').canExecute"
                  density="compact"
                  eager
                />
              </td>

              <!-- 👉 truckReserving -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_TRUCK_RESERVING_NUMBER').canVisible"
                class="text-center px-1"
                style="min-width: 250px; font-size: 12px;"
              >
                <VTextField
                  v-if="false"
                  v-model="item.raw.truckReserving"
                  density="compact"
                  :disabled="!canVisibleUserPermission(statusPermission,'COL_TRUCK_RESERVING_NUMBER').canExecute"
                  style=" min-width: 150px;"
                />
                {{ item.raw.truckReserving }}
              </td>

              <!-- 👉 truckFee -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_TRUCK_FEE').canVisible"
                class="text-start px-1"
                style="font-size: 12px;"
              >
                <VTextField
                  :disabled="!canVisibleUserPermission(statusPermission,'COL_TRUCK_FEE').canExecute"
                  density="compact"
                  style=" min-width: 150px;"
                />
              </td>

              <!-- 👉 truckOrder -->
              <td
                v-if="accountAmin || accountViewerKK || accountWH || accountWHSub || accountAll"
                class="text-start px-2"
                style="min-width: 350px; font-size: 12px;"
              >
                <VRow>
                  <VCol cols="3">
                    <VBtn
                      width="90px"
                      color="warning"
                      class="mx-2"
                      @click="isDialogVisiblePrintTruck = true"
                    >
                      <VIcon
                        size="30"
                        icon="ri-printer-fill"
                      />
                    </VBtn>
                  </VCol>
                  <VCol cols="9">
                    <FileInputDialogCarousels
                      title-dialog="Truck Order"
                      :disabled-prop="false"
                      :type-file-input="typeFileInput"
                      file-name="Truck Order"
                    
                      @updateFiles="handleFileUpdates"
                    />
                  </VCol>
                </VRow>
              </td>

              <!-- 👉 doEx -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_DO_EX').canVisible"
                class="text-start px-4"
                style="font-size: 12px;"
              >
                {{ (item.raw.doEx) }}
              </td>

              <!-- 👉 country -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_COUNTRY').canVisible"
                class="text-start px-1"
                style="font-size: 12px;"
              >
                {{ (item.raw.country) }}
              </td>

              <!-- 👉 loadingDate -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_LOADING_DATE').canVisible"
                class="text-start px-1"
                style="min-width: 120px; font-size: 12px;"
              >
                {{ (item.raw.loadingDate) }}
              </td>

              <!-- 👉 etd -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_ETD').canVisible"
                class="text-start px-1"
                style="min-width: 150px; font-size: 12px;"
              >
                <AppDateTimePicker
                  v-if="!canVisibleUserPermission(statusPermission,'COL_ETD').canExecute"
                  v-model="item.raw.etd"
                  density="compact"
                  prepend-inner-icon="ri-calendar-schedule-fill"
                  :config="{ dateFormat: 'd/m/Y' }"
                />
                <span v-else>{{ item.raw.etd }}</span>
              </td>

              <!-- 👉 eta -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_ETA').canVisible"
                class="text-start px-1"
                style="min-width: 150px; font-size: 12px;"
              >
                <AppDateTimePicker
                  v-if="!canVisibleUserPermission(statusPermission,'COL_ETA').canExecute"
                  disabeld
                  density="compact"
                  prepend-inner-icon="ri-calendar-schedule-fill"
                  :config="{ dateFormat: 'd/m/Y' }"
                />
                <span v-else>{{ item.raw.etd }}</span>
              </td>

              <!-- 👉 deliveryNote -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_DELIVERY_NOTE').canVisible"
                class="text-start px-1"
                style="min-width: 250px; font-size: 12px;"
              >
                <div>
                  <FileInputDialogCarousels
                    title-dialog="Delivery Note"
                    :disabled-prop="!canVisibleUserPermission(statusPermission,'COL_DELIVERY_NOTE').canExecute"
                    :type-file-input="typeFileInput"
                    file-name="Delivery Note" 
                    @updateFiles="handleFileUpdates"
                  />
                </div>
              </td>

              <!-- 👉 remarkSAL -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_REMARK_SAL').canVisible"
                class="text-start px-1"
                style="font-size: 12px;"
              >
                <VBtn
                  style="min-width: 150px;"
                  :disabled-prop="!canVisibleUserPermission(statusPermission,'COL_REMARK_SAL').canExecute"
                  variant="outlined"
                  :color="item.raw.saL_Remarks ? 'primary' : 'grey'"
                  @click="textAreaDialogActive('RemarkSAL', item.raw.saL_Remarks, index)"
                >
                  <span
                    v-if="item.raw.saL_Remarks"
                    style="overflow: hidden; max-width: 130px; text-overflow: ellipsis;"
                  >{{ item.raw.saL_Remarks }}</span>
                  <span v-else>remark(SAL)</span>
                </VBtn>
              </td>

              <!-- 👉 remarkWH -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_REMARK_WH').canVisible"
                class="text-start px-1"
                style=" overflow: hidden; max-width: 185px; font-size: 12px; text-overflow: ellipsis;"
              >
                <VBtn
                  style="min-width: 150px; max-width: 150px;"
                  :disabled-prop="!canVisibleUserPermission(statusPermission,'COL_REMARK_WH').canExecute"
                  variant="outlined"
                  :color="item.raw.wH_Remarks ? 'primary' : 'grey'"
                  @click="textAreaRemarkDialogActive2('RemarkWH', item.raw.wH_Remarks, index)"
                >
                  <span
                    v-if="item.raw.wH_Remarks"
                    style="overflow: hidden; max-width: 130px; text-overflow: ellipsis;"
                  >{{ item.raw.wH_Remarks }}</span>
                  <span v-else>remark(WH)</span>
                </VBtn>
              </td>

              <!-- 👉 remarkLOG -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_REMARK_LOG').canVisible"
                class="text-start px-1"
                style="font-size: 12px;"
              >
                <VBtn
                  style="min-width: 150px;"
                  variant="outlined"
                  :disabled-prop="!canVisibleUserPermission(statusPermission,'COL_REMARK_LOG').canExecute"
                  :color="item.raw.loG_Remarks ? 'primary' : 'grey'"
                  @click="textAreaDialogActive('RemarkLOG', item.raw.loG_Remarks, index)"
                >
                  <span
                    v-if="item.raw.loG_Remarks"
                    style="overflow: hidden; max-width: 130px; text-overflow: ellipsis;"
                  >{{ item.raw.loG_Remarks }}</span>
                  <span v-else>remark(LOG)</span>
                </VBtn>
              </td>

              <!-- 👉 update by -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_COUNTRY').canVisible"
                class="text-start px-1"
                style="font-size: 12px;"
              >
                {{ (item.raw.updatedBy) }}
              </td>

              <!-- 👉 update date -->
              <td
                v-if="canVisibleUserPermission(statusPermission,'COL_COUNTRY').canVisible"
                class="text-start px-1"
                style="font-size: 12px;"
              >
                {{ (item.raw.updatedDate) }}
              </td>

              <!-- 👉 Actions -->
              <td
                v-if="!accountWHSub"
                style="width: 8rem; font-size: 12px;"
                class="text-center px-1"
              >
                <VBtn
                  :disabled="accountINSP"
                  :color="accountINSP ? 'grey' : 'warning'"
                >
                  <span style="font-size: 12px;">Save Draft</span>
                </VBtn>
              </td>
              <td
                v-if="!accountWHSub"
                style="width: 8rem; font-size: 12px;"
                class="text-center px-1"
              >
                <VBtn
                  :disabled="accountINSP"
                  class="mx-2"
                  :color="accountINSP ? 'grey' : 'primary'"
                >
                  <span style="font-size: 12px;">Submit</span>
                </VBtn>
              </td>
              <td
                v-if="accountWHSub"
                style="width: 8rem; font-size: 12px;"
                class="text-center px-1"
              >
                <VBtn
                  class="mx-2"
                  :color="accountINSP ? 'grey' : 'primary'"
                >
                  <span style="font-size: 12px;">Approve</span>
                </VBtn>
              </td>
              <td
                style="width: 8rem; font-size: 12px;"
                class="text-center px-1"
              >
                <VBtn
                  :disabled="accountINSP"
                  :color="accountINSP ? 'grey' : 'pink-lighten-2'"
                  @click="redirectBasedOnStatus(item.raw.statusId)"
                >
                  <span style="font-size: 12px;">Check Sheet</span>
                </VBtn>
              </td>
            </tr>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>
  </section>

  <!-- Footer -->
  <section
    v-if="false"
    section
    class="fixed-bottom"
  >
    <VCard>
      <VCardText>
        <VAlert
          color="red-lighten-3"
          style="font-size: 20px;"
        >
          (Demo) Shipment  - Version : 2.1  - Data 24 Row
        </VAlert>
      </VCardText>
    </VCard>
  </section>

  <!-- Dialog Text area -->
  <section>
    <div v-if="false">
      <TextAreaDialog
        v-model="dialogVisible"
        :sap-in-value="sapInValueView"
        :lot-value="lotValueView"
        :model-value-text="dialogDataTextArea"
        :model-value-text2="dialogData2TextArea"
        :type-dialog="typeDialogView"
        :type-btn="typeBtnView"
        :title-dialog="titleDialogView"
        @submit="handleDialogSubmit"
      />
    </div>

    <!-- Shipment mark/ con -->
    <div>
      <VDialog
        v-model="dialogVisible"
        persistent
        max-width="900px"
      >
        <VCard class="d-flex justify-center">
          <VRow class="mt-5">
            <VCol cols="6">
              <VCardTitle class="text-center">
                Shipping Mark
              </VCardTitle>
            </VCol>
            <VCol cols="6">
              <VCardTitle class="text-center">
                Shipping Condition
              </VCardTitle>
            </VCol>
          </VRow>

          <DialogCloseBtn
            v-if="true"
            variant="text"
            size="default"
            @click="btnCloseShipCon"
          />
          <VCardText>
            <VRow>
              <VCol cols="6">
                <VTextarea
                  v-model="dialogDataTextArea"
                  auto-grow
                  rows="7"
                  counter
                  class="text-center"
                  outlined
                />
              </VCol>
              <VCol cols="6">
                <VTextarea
                  v-model="dialogData2TextArea"
                  counter
                  class="text-center"
                  rows="15"
                  outlined
                />
              </VCol>
            </VRow>
          </VCardText>
          <VCardActions class="d-flex justify-center">
            <VRow>
              <VCol
                cols="6"
                class="d-flex justify-center"
              >
                <VBtn
                  variant="flat"
                  color="warning"
                  disabled
                >
                  <VIcon icon="ri-printer-fill" />Print
                </VBtn>
              </VCol>
              <VCol
                cols="6"
                class="d-flex justify-center"
              >
                <VBtn
                  disabled
                  variant="flat"
                  color="warning"
                >
                  <VIcon icon="ri-printer-fill" />Print
                </VBtn>
              </VCol>
            </VRow>
          </VCardActions>
        </VCard>
      </VDialog>
    </div>

    <!-- text area -->
    <div>
      <VDialog
        v-model="dialogVisibleTextarea"
        persistent
        max-width="900px"
      >
        <VCard class="d-flex justify-center">
          <VRow class="mt-5">
            <VCol cols="12">
              <VCardTitle class="text-center">
                {{ typeDialogTextArea }}
              </VCardTitle>
            </VCol>
          </VRow>

          <DialogCloseBtn
            v-if="true"
            variant="text"
            size="default"
            @click="btnTextarea"
          />
          <VCardText>
            <VTextarea
              v-model="dialogRemark"
              auto-grow
              rows="7"
              counter
              class="text-center"
              outlined
            />
          </VCardText>
          <VCardActions
            v-if="false"
            class="d-flex justify-center"
          >
            <VRow>
              <VCol
                cols="12"
                class="d-flex justify-center"
              >
                <VBtn
                  variant="flat"
                  color="warning"
                  disabled
                >
                  <VIcon icon="ri-printer-fill" />Print
                </VBtn>
              </VCol>
            </VRow>
          </VCardActions>
        </VCard>
      </VDialog>
    </div>
  </section>

  <div>
    <!-- ใช้ AuthenticatorDialog Component -->
    <AlertWord2
      v-model="isDialogVisibleAlertDialog"
      :word="wordForSubmit"
      :subword="subWordForSubmit"
      :success="successDialAlert"
    />
  </div>
</template>

<style scoped lang="scss" src="./indexTIE.scss"></style>

