<script setup>
import { urlApi } from '@/api' //---------------------- Import Api for Url *****

const whereHouse = localStorage.getItem('whereHouseName')
const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')

import { useItemStore } from '@/stores/skt/receingFormStore/itemStore'

const itemStore = useItemStore()
const userDataInfo = ref(itemStore.getItemDetails('UserDataCookies'))
const department = ref(userDataInfo.value.departmentName)
const dataRowModel = ref()

// eslint-disable-next-line sonarjs/cognitive-complexity
const disabledStatus = (inspStatusId, logStatusId, salStatusId, whStatusId, dataRow) => {

  if (dataRow?.statusId === 205) {
    return true
  } else if (
    department.value === 'Warehouse' &&
    (dataRow?.csLfStatusId === 1005 || dataRow?.csLfStatusId === 1105)
  ) {
    return !['00022', '00023', '00025'].includes(userDataInfo.value.id)
  }
  else if (department.value === 'Warehouse' && whStatusId === 404) {
    return true
  } else if (department.value === 'Logistic' && logStatusId === 504) {
    return true
  } else if (department.value === 'Inspection' && inspStatusId === 604) {
    return true
  } else if (department.value === 'Sale and Marketing' && salStatusId === 304) {
    return true
  } else {
    return false
  }
}

const disabledStatusWithOutAdminUser = (inspStatusId, logStatusId, salStatusId, whStatusId) => {

  if (department.value === 'Warehouse' && whStatusId === 404) {
    return true
  } else if (department.value === 'Logistic' && logStatusId === 504) {
    return true
  } else if (department.value === 'Inspection' && inspStatusId === 604) {
    return true
  } else if (department.value === 'Sale and Marketing' && salStatusId === 304) {
    return true
  } else {
    return false
  }
}

//------------------------------- alert --------------------------------------------

import AlertWord2 from '@/components/dialogs/alert/alertDialog2.vue'
import ConfirmDialog2 from '@/components/dialogs/alert/confirmDialog2.vue'
import alertWordConst from '@/utilities/constant'

const isDialogVisibleAlertDialog = ref(false)
const wordForSubmit = ref('')
const subWordForSubmit = ref('')
const successDialAlert = ref(false)

const textAlertDialogFunction = (word, success) => {
  subWordForSubmit.value = ''
  wordForSubmit.value = word
  successDialAlert.value = success
  isDialogVisibleAlertDialog.value = true
}

//------------------------------ Alert Loading -----------------------------------
const isDialogLoadingVisible = ref(false)
const wordLoading = ref('')

const handleDialogLoading = type => {
  wordLoading.value = type
  isDialogLoadingVisible.value = true
}

//------------------------------ Alert Confirm ---------------------------
const confirmDialog2 = ref('')
const typeConfirmDialog = ref('')
const soEIdConfirmDialog = ref('')
const productRowModel = ref(null)

function openConfirmDialog(type, SoEId, productRow) {
  //console.log('openConfirmDialog', type, SoEId)
  productRowModel.value = productRow

  // เรียกใช้ฟังก์ชัน openDialog ที่เปิดเผยจาก ConfirmDialog.vue
  if (type === 'submit') {
    wordForSubmit.value = type
    typeConfirmDialog.value = type
    soEIdConfirmDialog.value = SoEId

    //console.log('openConfirmDialog', type, SoEId, wordForSubmit.value)

  } else if (type === 'back') {
    wordForSubmit.value = "SEND BACK"
    typeConfirmDialog.value = type
    soEIdConfirmDialog.value = SoEId
  }

  confirmDialog2.value.openDialog()

  // selectedDataTables.value.forEach(item => {
  //   // กำหนดค่าเริ่มต้น
  //   //console.log("selectedDataTables", item.statusId)
  //   selectedDataTablesStatusId.value = item.statusId

  //   if (item.statusId === 102 || item.statusId === 107 ) {
  //     wordForSubmit.value = alertWordConst.approve
  //     confirmDialog2.value.openDialog()
  //     isDialogVisibleAlertDialog.value = false
  //     //console.log("selectedDataTables 102")
  //   }else if(item.statusId === 101){
  //     textSubAlertDialogFunction('SELECT APPROVE', "Plase select Plan Status 'Waitting for plan APVL' for approve.", false)
  //     //console.log("selectedDataTables 101")
  //   }
  //   else{
  //     //console.log("selectedDataTables failded")
  //     isDialogVisibleAlertDialog.value = false
  //   }

  // })

}

function handleConfirmAction() {
  if (wordForSubmit.value === 'submit') {
    submitShipmentPlanBySoEId(typeConfirmDialog.value, soEIdConfirmDialog.value)
  } else if (wordForSubmit.value === 'SEND BACK') {
    submitShipmentPlanBySoEId('back', soEIdConfirmDialog.value)

    //console.log('back')
  }

}

function handleCancel() {
  //console.log('Action canceled.')
}

//------------------------------ Formate --------------------------------------
function formatDateSave(date) {
  if (!date) return null // หากค่าว่างให้คืน null

  const [day, month, year] = date.split('/') // แยกวันที่ตามรูปแบบ dd/mm/yyyy
  if (!day || !month || !year) return null // ตรวจสอบว่าแยกข้อมูลสำเร็จ

  // สร้างวันที่ในรูปแบบ yyyy-mm-dd
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function convertDateFormat(dateString) {
  const parts = dateString.split("/") // แยกส่วนของวันที่
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts // จัดเรียงใหม่

    return `${yyyy}-${mm}-${dd}`
  }

  return "Invalid Date Format" // กรณีรูปแบบไม่ถูกต้อง
}

const dateCurrent = ref()

function getCurrentDateFormatted() {
  const today = new Date()
  const day = String(today.getDate()).padStart(2, '0')
  const month = String(today.getMonth() + 1).padStart(2, '0') // เดือนเริ่มที่ 0 ต้อง +1
  const year = today.getFullYear()

  dateCurrent.value = `${day}/${month}/${year}`

  return `${day}/${month}/${year}`
}

onMounted(() => {
  getCurrentDateFormatted()
})

//------------------------------ fetch data from API --------------------------------
import {
  useDeleteFileFormService,
  useGetDataTruckOrderService,
  useGetFileFormService,
  useGetSearchPlanService,
  useGetSelectDataService,
  usePrintExportExcelService,
  usePrintPDFService, 
  usePrintShipmentPDFService,
  usePrintTruckOrderFormPDFService,
  useSaveFileFormService,
  useSaveSearchPlanService,
  useSaveTruckOrderService,
  useSubmitShipmentPlanService,
} from '@/services/skt/shipmentPlan/services'

import {
  useGetShippingCheckSheetLorryFlexi2Service,
} from "@/services/skt/shipmentPlan/lorryFlexiServices"

//-------------------------------------------- Permission -----------------------------------------

// const { getUserPermissionResult, errorGetUserPermission, fetchUserPermission } = useGetUserPermissionService()
import { canVisibleUserPermissionPermission, fetchUserPermissions } from '@/utilities/permission'

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
  return canVisibleUserPermissionPermission(statusId, uiControlContextId)
}

const disShowTableShipmentPLand = () => !['00011',
  '00012',
  '00013',
  '00014',
  '00015',
  '00029',
  '00030',
  '00031',
  '00033',
  '00032',
  '00034',
  '00044',
  '00045'].includes(userDataInfo.value.id)

const userData = ref(null)

watch(() => {
  const storedData = sessionStorage.getItem('userData')
  if (storedData) {
    userData.value = JSON.parse(storedData)
  }
})

const disableShowDataByDepartment = () => {


  if (userData?.value) {
    return !(userData.value.departmentId === '007' ||
      userData.value.departmentId === '008' ||
      userData.value.departmentId === '010' ||
      userData.value.departmentId === '009')
  }
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
const activeShipMarkModel = ref('')
const disabledModel = ref(false)

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

const btnCloseShipCon = async () => {
  // ค้นหาและอัปเดตค่าใน paginatedData
  paginatedData.value.forEach(item => {
    if (item.soEtlLogDetailJournalID === soEIdModel.value) {
      item.shipperMark = dialogDataTextArea.value
      item.shipperConditions = dialogData2TextArea.value
      item.shippingMarkActive = activeShipMarkModel.value
    }
  })

  //console.log('btnCloseShipCon...', paginatedData.value)

  if (!disabledModel.value) {
    await saveShipmentPlan(dataRowForUse.value)
  }

  dialogVisible.value = false
}

const btnTextarea = () => {
  //console.log('textAreaRemarkDialogActive', typeDialogTextArea.value)
  paginatedData.value.forEach(item => {
    if (item.soEtlLogDetailJournalID === soEIdModel.value) {
      if (typeDialogTextArea.value === 'Remark WH') {
        item.wH_Remarks = dialogRemark.value

        // //console.log('btnCloseRemark... Remark WH', dialogRemark.value)
      } else if (typeDialogTextArea.value === 'Remark SAL') {
        item.saL_Remarks = dialogRemark.value

        // //console.log('btnCloseRemark... Remark SAL', dialogRemark.value, item.saL_Remarks)
      } else if (typeDialogTextArea.value === 'Remark LOG') {
        item.loG_Remarks = dialogRemark.value

        // //console.log('btnCloseRemark... Remark LOG', dialogRemark.value)
      } else if (typeDialogTextArea.value === 'Lot') {
        item.lot = dialogRemark.value
      }

    } else {
      //console.log('btnCloseRemark... ELSe', typeDialogTextArea.value, soEIdModel.value, item.soEtlLogDetailJournalID)
    }
  })

  //console.log('btnCloseRemark...')
  dialogVisibleTextarea.value = false
}

const textAreaRemarkDialogActive = (type, data, soEId, disabledRow, disPermiss) => {

  typeDialogTextArea.value = type
  soEIdModel.value = soEId
  titleDialogView.value = 'Shipping Mark Con'
  dialogRemark.value = data  // ตั้งค่า dialogDataTextArea ด้วยค่า data
  dialogVisibleTextarea.value = true

  //console.log('Type dialog', typeDialogTextArea.value, '=', type)


  const disabledCanExecute = ref(false)

  if (disPermiss) {
    // eslint-disable-next-line sonarjs/no-all-duplicated-branches

    if (disabledRow) {
      disabledCanExecute.value = true
    } else {
      disabledCanExecute.value = false
    }
  } else {
    disabledCanExecute.value = true
  }

  disabledModel.value = disabledCanExecute.value
}

const dataRowForUse = ref()

const textAreaShipDialogActive2 = (type, data, data2,
  index, soEId, activeShipMark, dataProduct, disabledRow,
  disabledPermission) => {
  typeDialogTextArea.value = type
  indexDataDialogTextArea.value = index
  soEIdModel.value = soEId
  titleDialogView.value = 'Shipping Mark Con'
  typeDialogView.value = 'ShipMC'
  dialogDataTextArea.value = data  // ตั้งค่า dialogDataTextArea ด้วยค่า data
  dialogData2TextArea.value = data2 // 
  activeShipMarkModel.value = activeShipMark
  dataRowForUse.value = dataProduct
  dialogVisible.value = true

  const disabledCanExecute = ref(false)

  if (disabledPermission) {
    // eslint-disable-next-line sonarjs/no-all-duplicated-branches

    if (disabledRow) {
      disabledCanExecute.value = true
    } else {
      disabledCanExecute.value = false
    }
  } else {
    disabledCanExecute.value = true
  }

  //console.log('disabledCanExecute', disabledCanExecute.value, 'status', disabledRow, 'permis', disabledPermission )

  disabledModel.value = disabledCanExecute.value
}

const handleDialogSubmit = data => {
  dialogDataTextArea.value = data

  const index = indexDataDialogTextArea.value

  if (index >= 0 && index < mockData.value.length) {
    const item = mockData.value[index]

    // อัปเดตค่าของ item
    item.value = data

    // ใช้งานข้อมูลตาม type
    if (typeDialogTextArea.value === 'ShipCon') {
      item.shippingCondition = data
    } else if (typeDialogTextArea.value === 'ShipMark') {
      item.shippingMark = data
    } else if (typeDialogTextArea.value === 'RemarkSAL') {
      item.remarkSal = data
    } else if (typeDialogTextArea.value === 'RemarkWH') {
      item.remarkWh = data
    } else if (typeDialogTextArea.value === 'RemarkLOG') {
      item.remarkLog = data
    }
  } else {
    console.warn(`Index ${index} is out of range for mockData.`)
  }

  //console.log('Updated mockData:', data)
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

const itemsStatus = ([
  { name: 'Cancel', id: 200, color: 'blue-grey' },
  { name: 'ETL Failed!', id: 201, color: 'deep-orange' },
  { name: 'Waiting for Shipping', id: 202, color: 'pink' },
  { name: 'Draft Shipping', id: 203, color: 'amber' },

  // { name: 'Waiting for SAL Draft', id: 302, color: 'pink' },
  // { name: 'SAL Draft Shipping', id: 303, color: 'amber' },
  // { name: 'SAL Submitted', id: 304, color: 'teal' },

  // { name: 'Waiting for WH Draft', id: 402, color: 'pink' },
  // { name: 'WH Draft Shipping', id: 403, color: 'amber' },
  // { name: 'WH Submitted', id: 404, color: 'teal' },

  // { name: 'Waiting FOR LOG Draft', id: 502, color: 'pink' },
  // { name: 'LOG Draft Shipping', id: 503, color: 'amber' },
  // { name: 'LOG Submitted', id: 504, color: 'teal' },

  // { name: 'Waiting FOR INSP Draft', id: 602, color: 'pink' },
  // { name: 'INSP Draft Shipping', id: 603, color: 'amber' },
  // { name: 'INSP Submitted', id: 604, color: 'teal' },

  // { name: 'Waiting for CS Draft', id: 1002, color: 'pink' },
  // { name: 'CS1 Draft Shipping', id: 1003, color: 'amber' },
  // { name: 'CS2 Draft Shipping', id: 1004, color: 'amber' },
  // { name: 'CS Submitted', id: 1005, color: 'teal' },

  // { name: 'Waiting for Draft', id: 1102, color: 'pink' },
  // { name: 'Draft Shipping LF', id: 1103, color: 'amber' },
  // { name: 'Waiting for Lorry/Flex APVL', id: 1104, color: 'amber' },
  // { name: 'Lorry/Flex Submitted', id: 1105, color: 'teal' },

  { name: 'In Submitting', id: 204, color: 'pink' },
  { name: 'Waiting for WH APVL', id: 205, color: 'brown' },
  { name: 'Shipping Rejected', id: 206, color: 'red' },
  { name: 'Shipping Completed', id: 207, color: 'green' },

  { name: 'All', id: 0, color: 'grey' },

])

const etaDateModel = ref(sessionStorage.getItem("ETASearchProductionFilter"))
const etdDateModel = ref(sessionStorage.getItem("ETDSearchProductionFilter"))

const filterForSearchPlan = ref({
  StatusId: sessionStorage.getItem("StatusIdSearchProductionFilter") || '',
  ETA: etaDateModel.value || '',
  ETD: etdDateModel.value || '',
  ETDDateFrom: '',
  ETDDateTo: '',
  SalesOrderNoSearch: sessionStorage.getItem("SalesOrderNoSearchProductionFilter") || '',
  PayerNameSearch: sessionStorage.getItem("PayerNameSearchProductionFilter") || '',
  ItemNameSearch: sessionStorage.getItem("ItemNameSearchProductionFilter") || '',
  LotSearch: sessionStorage.getItem("LotSearchProductionFilter") || '',
  SortColumn: '',
  SortDirection: '',
})

const saveHistoryFilter = () => {
  sessionStorage.setItem("StatusIdSearchProductionFilter", filterForSearchPlan.value.StatusId || ''),
  sessionStorage.setItem("ETASearchProductionFilter", etaDateModel.value) || '',
  sessionStorage.setItem("ETDSearchProductionFilter", etdDateModel.value) || '',
  sessionStorage.setItem("SalesOrderNoSearchProductionFilter", filterForSearchPlan.value.SalesOrderNoSearch) || '',
  sessionStorage.setItem("PayerNameSearchProductionFilter", filterForSearchPlan.value.PayerNameSearch) || '',
  sessionStorage.setItem("LotSearchProductionFilter", filterForSearchPlan.value.LotSearch) || '',
  sessionStorage.setItem("ItemNameSearchProductionFilter", filterForSearchPlan.value.ItemNameSearch) || ''
}

// ฟังก์ชันสำหรับสลับสถานะของไอคอนแต่ละตัว
const toggleDirection = async key => {
  if (key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'

    //console.log(`Sorting direction is now: ${sortDirection.value} --> ${key}`)
  }
  sortColumn.value = key
  await searchShipmentPlan()
}

//- เปรียบเทียบ status text = id
function getStatusIdByName(statusName) {
  const matchedItem = itemsStatus.find(item => item.name === statusName)

  return matchedItem ? matchedItem.id : '' // คืนค่า id หรือ null หากไม่พบ
}

const disabledBtnExport = ref(false)

watchEffect(() => {
  const etaDateForApi = ref(etaDateModel.value)
  const etdDateForApi = ref(etdDateModel.value)

  filterForSearchPlan.value.ETA = formatDateSave(etaDateForApi.value)
  filterForSearchPlan.value.ETD = formatDateSave(etdDateForApi.value)

  filterForSearchPlan.value.SortColumn = sortColumn.value
  filterForSearchPlan.value.SortDirection = sortDirection.value

  const statusID = getStatusIdByName(filterForSearchPlan.value.StatusId)

  disabledBtnExport.value = Object.values(filterForSearchPlan.value).some(value => value !== null && value !== "")

  //console.log('checkValueFilter', filterForSearchPlan.valu)
})



const searchShipmentPlan = async () => {
  isLoading.value = true

  // Format ค่า ETA และ ETD ก่อนส่ง API
  // filterForSearchPlan.value.ETA = formatDateSave(filterForSearchPlan.value.ETA)

  const etaDateForApi = ref(etaDateModel.value)
  const etdDateForApi = ref(etdDateModel.value)

  filterForSearchPlan.value.ETA = formatDateSave(etaDateForApi.value)
  filterForSearchPlan.value.ETD = (etdDateForApi.value)

  if (filterForSearchPlan.value.ETD) {
    if (filterForSearchPlan.value.ETD.includes(" to ")) {
      // กรณีเป็นช่วงวันที่
      const [startDate, endDate] = filterForSearchPlan.value.ETD.split(" to ")

      filterForSearchPlan.value.ETDDateFrom = convertDateFormat(startDate)
      filterForSearchPlan.value.ETDDateTo = convertDateFormat(endDate)

    } else {
      // กรณีเป็นวันเดียว
      const singleDate = filterForSearchPlan.value.ETD

      filterForSearchPlan.value.ETDDateFrom = convertDateFormat(singleDate)
      filterForSearchPlan.value.ETDDateTo = convertDateFormat(singleDate)
    }
  }

  filterForSearchPlan.value.SortColumn = sortColumn.value
  filterForSearchPlan.value.SortDirection = sortDirection.value

  saveHistoryFilter()

  const statusID = getStatusIdByName(filterForSearchPlan.value.StatusId)

  try {
    const result = await fetchSearchPlan(
      urlApi.value,
      'searchplans',
      whereHouse,
      accessTokenAtStore,
      filterForSearchPlan.value,
      statusID,
    )

    if (result && getSearchPlanResult.value.datas) {
      searchPlanData.value = getSearchPlanResult.value.datas // เก็บข้อมูลใน reactive stat

      searchPlanData.value = await Promise.all(
        getSearchPlanResult.value.datas.map(async item => ({
          ...item,
          eta: formatToDate(item.eta),
          etd: formatToDate(item.etd),
          logUpdatedDate: formatToDate(item.loadingDate),

          // fileSo: await getFileForm('GetSo', item.soEtlLogDetailJournalID), // ใช้ await ที่นี่
          // fileCoA: await getFileForm('GetCoA', item.soEtlLogDetailJournalID), // ใช้ await ที่นี่
          // fileTruckOrder: await getFileForm('GetTruckOrder', item.soEtlLogDetailJournalID), // ใช้ await ที่นี่
          // fileDeliveryNote: await getFileForm('GetDeliveryNote', item.soEtlLogDetailJournalID), // ใช้ await ที่นี่
        })),
      )

      //console.log('searchPlanData.value', searchPlanData.value)

      // //console.log(`Fetched search plan:`, searchPlanData.value)
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
    LotSearch: '',
    SortColumn: '',
    SortDirection: '',
  }

  etaDateModel.value = ''
  etdDateModel.value = ''
  await searchShipmentPlan()
}

//------------------------------- Function check --------------------------------

const allData = ref([]) // ข้อมูลทั้งหมดที่แสดงในตาราง
const isSelectAll = ref(false) // สถานะของ Checkbox "Select All"

const testValue = () => {
  //console.log('Test Value', selectedDataTables.value)
}

// คำนวณว่าทุกแถวถูกเลือกหรือไม่
const isAllSelected = watch(() => {
  return paginatedData.value.length > 0 && selectedDataTables.value.length === paginatedData.value.length
})

// เมื่อกด "Select All"
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedDataTables.value = [] // ยกเลิกการเลือกทั้งหมด
    //console.log('clear data checkbox...')
  } else {
    selectedDataTables.value = [...paginatedData.value] // เลือกทั้งหมด
    //console.log('add all data checkbox...')
  }
}

//--------------------------- File INput --------------------------------

import FileInputDialogCarousels from '@/components/golbal/flieUploadDialogCarousels.vue' //--------- import component
import { onMounted, watch, watchEffect } from 'vue'

const viewAllData = () => {
  //console.log(mockData.value)
}

const typeFileInput = ref('hideInput')

const filesFromUploaderSO = ref([])
const filesFromUploaderPO = ref([])
const filesFromUploaderCOA = ref([])
const filesFromUploaderTruckOrder = ref([])
const filesFromUploaderDeliNote = ref([])

const typeNameFileInput = ref('')

// ฟังก์ชันจัดการข้อมูลที่ส่งมาจาก FileUploader

//------------------------------- Section FIle Form -------------------------------------
//------------------------------- Delete File --------------------------------
const { deleteFileFormResult, errorMessageDeleteFileForm, deleteFileFormFunction } = useDeleteFileFormService()

const handleDeleteFileForm = async (file,
  typeFile,
  soEtlLogDetailJournalID) => {

  try {
    // ตรวจสอบว่า row เป็นอาร์เรย์หรือออบเจ็กต์เดี่ยว
    const requestData = file

    const response = await deleteFileFormFunction(
      soEtlLogDetailJournalID,
      typeFile,
      urlApi.value,
      whereHouse,
      accessTokenAtStore,
    )

    //console.log("Response from functionSaveFileForm:", response)

    if (deleteFileFormResult.value?.success) {
      // textAlertDialogFunction(alertWordConst.delete, true)
      //console.log(`Saved File Plan:`, deleteFileFormResult.value)

      // Reload หลังแจ้งเตือนสำเร็จ
      setTimeout(() => {
        // location.reload()
      }, 500) // 0.5 วินาที

      return true
    } else {
      // กรณีบันทึกไม่สำเร็จ
      console.error(`Error saving File plan:`, errorMessageDeleteFileForm.value)

      // textAlertDialogFunction(errorMessageDeleteFileForm.value, false)

      return false
    }
  } catch (error) {
    // กรณีเกิดข้อผิดพลาดในกระบวนการ
    console.error(`Error saving File plan:`, error)

    // textAlertDialogFunction("An error occurred while saving the file.", false)

    return false
  }
}

//------------------------------- Function Save File ------------------------
const { resultSaveFielForm, errorMessageSaveFileForm, functionSaveFileForm } = useSaveFileFormService()

const saveFileFormShipment = async (
  file,
  typeFile,
  soEtlLogDetailJournalID,
) => {
  //console.log("save file start...", soEtlLogDetailJournalID)

  try {
    // ตรวจสอบว่า row เป็นอาร์เรย์หรือออบเจ็กต์เดี่ยว
    const requestData = file

    const response = await functionSaveFileForm(
      requestData,
      soEtlLogDetailJournalID,
      typeFile,
      urlApi.value,
      whereHouse,
      accessTokenAtStore,
    )

    //console.log("Response from functionSaveFileForm:", response)

    if (resultSaveFielForm.value?.success) {
      if (disabledModel.value) {
        // textAlertDialogFunction('Print', true)

        // // Reload หลังแจ้งเตือนสำเร็จ
        // setTimeout(() => {
        // location.reload()
        // }, 500) // 0.5 วินาที
      } else {
        if (trikerSaveDrft.value === false) {
          textAlertDialogFunction(alertWordConst.saveDraft, true)

          //console.log(`Saved File Plan:`, resultSaveFielForm.value)

          // Reload หลังแจ้งเตือนสำเร็จ
          setTimeout(() => {
            // location.reload()
          }, 500) // 0.5 วินาที
        }

      }


      return true
    } else {
      // กรณีบันทึกไม่สำเร็จ
      console.error(`Error saving File plan:`, errorMessageSaveFileForm.value)
      textAlertDialogFunction(errorMessageSaveFileForm.value, false)

      return false
    }
  } catch (error) {
    // กรณีเกิดข้อผิดพลาดในกระบวนการ
    console.error(`Error saving File plan:`, error)
    textAlertDialogFunction("An error occurred while saving the file.", false)

    return false
  }
}

//------------------------------- Function Get File Form --------------------------
const { getFileFormResult, errorMessageGetFileForm, getFileFormFunction } = useGetFileFormService()

const getSoFileModel = ref([])
const getPoFileModel = ref([])
const getCoAFileModel = ref([])
const getTruckOrderFileModel = ref([])
const getDeliveryNoteFileModel = ref([])

const getFileForm = async (
  typeFile,
  soEtlLogDetailJournalID,
) => {
  try {

    const response = await getFileFormFunction(
      soEtlLogDetailJournalID,
      'ShippingFile',
      typeFile,
      urlApi.value,
      whereHouse,
      accessTokenAtStore,
    )

    if (getFileFormResult.value?.success) {

      return response.data.data
    } else {

      return ''
    }
  } catch (error) {

    return ''
  }
}

const showFileFormByTypeAndSoId = async (type, soId) => {
  if (type === 'GetSo') {
    //console.log('showFileFormByTypeAndSoId', await getFileForm(type, soId))

    getSoFileModel.value = await getFileForm(type, soId)

    //console.log(`showFileFormByTypeAnd${soId}`, getSoFileModel.value)

    // return await getFileForm(type, soId)
  }
}

// showFileFormByTypeAndSoId('GetSo', '152')

const handleFileUpdatesSO = updatedFiles => {
  filesFromUploaderSO.value = updatedFiles

}

const handleFileUpdatesPO = updatedFiles => {
  filesFromUploaderPO.value = updatedFiles

}

const handleFileUpdatesCOA = updatedFiles => {
  filesFromUploaderCOA.value = updatedFiles
}

const handleFileUpdatesTruckOrder = updatedFiles => {
  filesFromUploaderTruckOrder.value = updatedFiles
}

const handleFileUpdatesDeliNote = updatedFiles => {
  filesFromUploaderDeliNote.value = updatedFiles
}


//------------------------------- Function save Search plan -----------------

const { saveSearchPlanResult, errorSaveSearchPlan, saveSearchPlan } = useSaveSearchPlanService()

const mapRequestData = data => ({
  soEtlLogDetailJournalID: getOrDefault(data.soEtlLogDetailJournalID, 0),
  loadingDate: formatDateSave(getOrDefault(data.logUpdatedDate, null)),
  updatedBy: getOrDefault(data.salUpdatedBy, "system"),
  shipperMark: getOrDefault(data.shipperMark, ""),
  shipperConditions: getOrDefault(data.shipperConditions, ""),
  shippingEndUser: getOrDefault(data.shippingEndUser, ""),
  shippingMarkActive: getOrDefault(data.shippingMarkActive, ""),
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

const saveDraftLoading = ref(false)
const saveDraftLoadingSOERow = ref('')

const trikerSaveDrft = ref(false)

// eslint-disable-next-line sonarjs/cognitive-complexity
const saveShipmentPlan = async row => {
  console.log("save plan start...", row)
  saveDraftLoadingSOERow.value = row.soEtlLogDetailJournalID

  if (
    filesFromUploaderSO.value ||
    filesFromUploaderPO.value ||
    filesFromUploaderCOA.value ||
    filesFromUploaderTruckOrder.value ||
    filesFromUploaderDeliNote.value
  ) {
    //console.log("Uploading files...",  filesFromUploaderSO.value)

    const deleteFie1 = ref()
    const deleteFie2 = ref()
    const deleteFie3 = ref()
    const deleteFie4 = ref()

    const saveFile1 = ref()
    const saveFile2 = ref()
    const saveFile3 = ref()
    const saveFile4 = ref()

    if (filesFromUploaderSO.value) {
      if (filesFromUploaderSO.value.length === 0) {
        //console.log("SaveSo")
      } else {
        deleteFie1.value = await handleDeleteFileForm(
          filesFromUploaderSO.value,
          "DeleteSO",
          row.soEtlLogDetailJournalID,
        )

        saveFile1.value = await saveFileFormShipment(
          filesFromUploaderSO.value,
          "SaveSo",
          row.soEtlLogDetailJournalID,
        )
      }
    }

    if (filesFromUploaderPO.value) {
      if (filesFromUploaderPO.value.length === 0) {
        //console.log("SaveSo")
      } else {
        deleteFie1.value = await handleDeleteFileForm(
          filesFromUploaderPO.value,
          "DeletePO",
          row.soEtlLogDetailJournalID,
        )

        saveFile1.value = await saveFileFormShipment(
          filesFromUploaderPO.value,
          "SavePo",
          row.soEtlLogDetailJournalID,
        )
      }
    }

    if (filesFromUploaderCOA.value) {
      if (filesFromUploaderCOA.value.length === 0) {
        //console.log("SaveCOA")
      } else {
        deleteFie2.value = await handleDeleteFileForm(
          filesFromUploaderCOA.value,
          "DeleteCOA",
          row.soEtlLogDetailJournalID,
        )

        saveFile2.value = await saveFileFormShipment(
          filesFromUploaderCOA.value,
          "SaveCOA",
          row.soEtlLogDetailJournalID,
        )
      }
    }

    if (filesFromUploaderTruckOrder.value) {
      if (filesFromUploaderTruckOrder.value.length === 0) {
        //console.log("SaveTruckOrder")
      } else {
        deleteFie3.value = await handleDeleteFileForm(
          filesFromUploaderTruckOrder.value,
          "DeleteTruckOrder",
          row.soEtlLogDetailJournalID,
        )

        saveFile3.value = await saveFileFormShipment(
          filesFromUploaderTruckOrder.value,
          "SaveTruckOrder",
          row.soEtlLogDetailJournalID,
        )
      }
    }

    if (filesFromUploaderDeliNote.value) {
      if (filesFromUploaderDeliNote.value.length === 0) {
        //console.log("SaveDeliveryNote")
      } else {
        deleteFie4.value = await handleDeleteFileForm(
          filesFromUploaderDeliNote.value,
          "DeleteDeliveryNote",
          row.soEtlLogDetailJournalID,
        )

        saveFile4.value = await saveFileFormShipment(
          filesFromUploaderDeliNote.value,
          "SaveDeliveryNote",
          row.soEtlLogDetailJournalID,
        )
      }
    }

    // if(!deleteFie1.value||!deleteFie2.value||!deleteFie3.value||!deleteFie4.value){
    //   throw 'Delete File Fiald!'
    // }

    // if(!saveFile1||!saveFile2||!saveFile3||!saveFile4){
    //   throw 'Save File Fiald!'
    // }

    //console.log("File upload completed.", row.soEtlLogDetailJournalID)
  } else {
    //console.log("File not foand", filesFromUploaderSO.value)
  }


  //console.log("submitShipmentPlanBySoEId start. save draft", trikerSaveDrft.value)
  if (row.statusId === 207) {
    //console.log('Saved Shipment plan if', row.csLfStatusId)
    saveDraftLoading.value = false
    if (disabledModel.value !== true) {
      if (trikerSaveDrft.value === false) {
        textAlertDialogFunction('Print', true)
        setTimeout(() => {
          location.reload()
        }, 500) // 500 มิลลิวินาที = 0.5 วินาที
        saveDraftLoading.value = false

        return true
      }

    } else {

      if (trikerSaveDrft.value !== true) {
        textAlertDialogFunction(alertWordConst.saveDraft, true)
        setTimeout(() => {
          location.reload()
          saveDraftLoading.value = false
        }, 500) // 500 มิลลิวินาที = 0.5 วินาที

      }

      return true
    }



  } else {
    //console.log('saveShipmentPlan complated', row)

    // ตรวจสอบและรอให้การอัปโหลดไฟล์เสร็จสิ้น
    // Mapping request data และส่งคำขอ
    const requestData = mapRequestData(row)

    const response = await saveSearchPlan(
      urlApi.value,
      "save",
      whereHouse,
      accessTokenAtStore,
      requestData,
    )

    if (saveSearchPlanResult.value) {

      if (disabledModel.value) {
        if (trikerSaveDrft.value === false) {
          textAlertDialogFunction('Print', true)
          setTimeout(() => {
            location.reload()
          }, 500) // 500 มิลลิวินาที = 0.5 วินาที
          saveDraftLoading.value = false

          return true
        }

        saveDraftLoading.value = false

      } else {

        if (trikerSaveDrft.value === false) {
          textAlertDialogFunction(alertWordConst.saveDraft, true)
          setTimeout(() => {
            location.reload()
          }, 500) // 500 มิลลิวินาที = 0.5 วินาที
          saveDraftLoading.value = false
        }

        return true
      }

    } else {
      textAlertDialogFunction(alertWordConst.saveDraft, false)
      setTimeout(() => {
        location.reload()
      }, 1000) // 500 มิลลิวินาที = 0.5 วินาที
      saveDraftLoading.value = false

      return false
    }

    saveDraftLoading.value = false


    //console.log(`Saved search plan:`, response)
  }

  saveDraftLoading.value = false
}

//------------------------------------- Function Submit shipment plan --------------------------------------

const isDialogVisibleCommentDialog = ref(false)
const statusCommnetValue = ref('')

const checkStatusBeforeAvtion = sataus => {
  if (sataus === 205) {
    return true
  } else if (sataus === 206) {
    return false
  } else {
    return false
  }
}

const { submitShipmentPlanResult, errorSubmitShipmentPlan, submitShipmentPlan } = useSubmitShipmentPlanService()

const submitLoading = ref(false)
const submitLoadingSOERow = ref('')

// eslint-disable-next-line sonarjs/cognitive-complexity
const submitShipmentPlanBySoEId = async (type, soEtlLogDetailJournalID) => {
  console.log('submitShipmentPlanBySoEId start!!', type, soEtlLogDetailJournalID)
  trikerSaveDrft.value = true
  submitLoadingSOERow.value = soEtlLogDetailJournalID || '0'

  if (type !== 'approve' && type !== 'reject' && type !== 'back') {
    console.log('submitShipmentPlanBySoEId start!! 1.1', type)

    const saveDraftRes = await saveShipmentPlan(productRowModel.value)
    if (!saveDraftRes) {
      textAlertDialogFunction(alertWordConst.saveDraft, false)
      throw new Error('saveDraftRes failed: ' + saveDraftRes)
    }
  }

  try {
    console.log('submitShipmentPlanBySoEId start!!3.1')
    if (type === 'submit') {

    } else if (type === 'approve' || type === 'reject') {
      console.log('submitShipmentPlanBySoEId start!! 3')
      soEtlLogDetailJournalID = selectedDataTables.value.map(item => item.soEtlLogDetailJournalID)

      console.log('submitShipmentPlanBySoEId start!! 2', selectedDataTables.value)
    } else if (type === 'back') {
      soEtlLogDetailJournalID = selectedDataTables.value.map(item => item.soEtlLogDetailJournalID)

      //console.log('submitShipmentPlanBySoEId back !! 3')
    }

    if (!statusCommnetValue.value && type === 'reject') {
      textAlertDialogFunction('Please enter Reject Comment.', false)

      return
    }

    const result = submitShipmentPlan(urlApi.value,
      type,
      whereHouse,
      accessTokenAtStore,
      soEtlLogDetailJournalID,
      statusCommnetValue.value,
    )

    //console.log('submitShipmentPlanBySoEId start!! 3')

    if (submitShipmentPlanResult.value || result) {
      if (type === 'submit') {
        textAlertDialogFunction(alertWordConst.submit, true)
        setTimeout(() => {
          location.reload()
        }, 500) // 10000 มิลลิวินาที = 10 วินาที
      } else if (type === 'approve') {
        textAlertDialogFunction(alertWordConst.approve, true)
        setTimeout(() => {
          location.reload()
        }, 500) // 10000 มิลลิวินาที = 10 วินาที
      } else if (type === 'reject') {
        textAlertDialogFunction(alertWordConst.reject, true)
        setTimeout(() => {
          location.reload()
        }, 500) // 10000 มิลลิวินาที = 10 วินาที
      } else if (type === 'back') {
        textAlertDialogFunction(alertWordConst.sendBack, true)
        setTimeout(() => {
          location.reload()
        }, 500) // 10000 มิลลิวินาที = 10 วินาที
      }

      //console.log('submitShipmentPlanBySoEId start!! 4')

    } else {
      if (type === 'submit') {
        textAlertDialogFunction(alertWordConst.submit, false)
        setTimeout(() => {
          location.reload()
        }, 500) // 10000 มิลลิวินาที = 10 วินาที
      } else if (type === 'approve') {
        textAlertDialogFunction(alertWordConst.approve, false)
        setTimeout(() => {
          location.reload()
        }, 500) // 10000 มิลลิวินาที = 10 วินาที
      } else if (type === 'reject') {
        textAlertDialogFunction(alertWordConst.reject, false)
        setTimeout(() => {
          location.reload()
        }, 500) // 10000 มิลลิวินาที = 10 วินาที
      } else if (type === 'back') {
        textAlertDialogFunction(alertWordConst.sendBack, false)
        setTimeout(() => {
          location.reload()
        }, 500) // 10000 มิลลิวินาที = 10 วินาที
      }
    }
  } catch (e) {
    console.error(`Error saving search plan:`, error)
  } finally {
    // เคลียร์สถานะต่างๆ ถ้าจำเป็น
    trikerSaveDrft.value = false
  }
}

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

    //console.log("dataTableNum if", dataTableNummberedToggle.value, no)
  } else if (dataTableNummberedToggle.value === null) {
    // ถ้าเป็น null ให้ตั้งค่าเป็น no ใหม่
    dataTableNummberedToggle.value = no

    //console.log("dataTableNum else", dataTableNummberedToggle.value, no)
  }


  //console.log("dataTableNum", dataTableNummberedToggle.value, no)
}

//--------------------------------------- Function Pagination --------------------------------------------
// 👉 watching current page
onMounted(async () => {
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

const checkRFID = ref('')

watchEffect(() => {
  const checkRFIDUpdate = ref(localStorage.getItem('configsShowRfdi'))
  if (checkRFIDUpdate.value === 'true') {
    // //console.log('RFID Check True:'+ checkRFIDUpdate.value)
    checkRFID.value = true
  } else if (checkRFIDUpdate.value === 'false') {
    // //console.log('RFID Check False:'+ checkRFIDUpdate.value)
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
    return { color: 'grey', message: 'orange-darken-1', text: 'Cancel', bgColor: '#E0E0E0' }
  case 201:
    return { color: 'deep-orange', message: 'green', text: 'ETL Failed!', bgColor: '#EF9A9A' }
  case 202:
    return { color: 'pink', message: 'pink-darken-4', text: 'Waiting for Shipping', bgColor: '#FCE4EC' }
  case 203:
    return { color: 'amber', message: 'purple', text: 'Draft Shipping', bgColor: '#FFC107' }

  case 302:
    return { color: 'pink', message: 'brown', text: 'Waiting for SAL Draft', bgColor: '#EFEBE9' }
  case 303:
    return { color: 'amber', message: 'green', text: 'SAL Draft Shipping', bgColor: '#E8F5E9' }
  case 304:
    return { color: 'teal', message: 'red', text: 'SAL Submitted', bgColor: '#FFEBEE' }

  case 402:
    return { color: 'pink', message: 'red', text: 'Waiting for WH Draft', bgColor: '#FFEBEE' }
  case 403:
    return { color: 'amber', message: 'red', text: 'WH Draft Shipping', bgColor: '#FFEBEE' }
  case 404:
    return { color: 'teal', message: 'red', text: 'WH Submitted', bgColor: '#FFEBEE' }

  case 502:
    return { color: 'pink', message: 'red', text: 'Waiting FOR LOG Draft', bgColor: '#FFEBEE' }
  case 503:
    return { color: 'amber', message: 'red', text: 'LOG Draft Shipping', bgColor: '#FFEBEE' }
  case 504:
    return { color: 'teal', message: 'red', text: 'LOG Submitted', bgColor: '#FFEBEE' }

  case 602:
    return { color: 'pink', message: 'red', text: 'Waiting FOR INSP Draft', bgColor: '#FFEBEE' }
  case 603:
    return { color: 'amber', message: 'red', text: 'INSP Draft Shipping', bgColor: '#FFEBEE' }
  case 604:
    return { color: 'teal', message: 'red', text: 'INSP Submitted', bgColor: '#FFEBEE' }

  case 1002:
    return { color: 'pink', message: 'red', text: 'Waiting for CS Draft', bgColor: '#FFEBEE' }
  case 1003:
    return { color: 'amber', message: 'red', text: 'CS1 Draft Shipping', bgColor: '#FFEBEE' }
  case 1004:
    return { color: 'amber', message: 'red', text: 'CS2 Draft Shipping', bgColor: '#FFEBEE' }
  case 1005:
    return { color: 'teal', message: 'red', text: 'CS Submitted', bgColor: '#FFEBEE' }

  case 1102:
    return { color: 'pink', message: 'red', text: 'Waiting for Draft', bgColor: '#FFEBEE' }
  case 1103:
    return { color: 'amber', message: 'red', text: 'Draft Shipping LF', bgColor: '#FFEBEE' }
  case 1104:
    return { color: 'amber', message: 'red', text: 'Waiting for Lorry/Flex APVL', bgColor: '#FFEBEE' }
  case 1105:
    return { color: 'teal', message: 'red', text: 'Lorry/Flex Submitted', bgColor: '#FFEBEE' }

  case 204:
    return { color: 'pink', message: 'red', text: 'In Submitting (SWL )', bgColor: '#FFEBEE' }
  case 205:
    return { color: 'brown', message: 'red', text: 'Waiting for WH APVL', bgColor: '#FFEBEE' }
  case 206:
    return { color: 'red', message: 'red', text: 'Shipping Rejected', bgColor: '#FFEBEE' }
  case 207:
    return { color: 'green', message: 'red', text: 'Shipping Completed', bgColor: '#FFEBEE' }
  default:
    return { color: 'grey', message: 'grey', text: '', bgColor: '#FFF3E0' }
  }
}

const statuses = ['Approve', 'Reject', 'Back to Edit']

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
  if (truck === 'BTS') {
    return 'bg-red-lighten-4'
  } else if (truck === 'LCL') {
    return 'bg-warning'
  }
}

//----------------------------------------- fetch data ----------------------------------
//---- select data --------------------------------

const freightForwarderModel = ref([])
const carrierModel = ref([])
const vesselsModel = ref([])
const truckModel = ref([])

const TruckCompanyModel = ref([])
const TruckTypeModel = ref([])
const CompanyModel = ref([])
const AddressModel = ref([])

const CompanyPrint = ref([])
const AddressPrint = ref([])

const TruckCompanyPrint = ref([])

const { getSelectDataResult, errorGetSelectData, fetchSelectData } = useGetSelectDataService()

const getSelectData = async (format, type) => {
  try {
    const result = await fetchSelectData(
      urlApi.value,
      type,
      format,
      whereHouse,
      accessTokenAtStore,
    )

    if (result) {
      // //console.log(`Fetched ${type}:`, getSelectDataResult.value)

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
  const [freightForwarders, carriers, vessels, truck, truckConpany, truckType, company, address] = await Promise.all([
    getSelectData('ShipmentPlan', 'getfreightforwarders'),
    getSelectData('ShipmentPlan', 'getcarriers'),
    getSelectData('ShipmentPlan', 'getvessels'),
    getSelectData('ShipmentPlan', 'gettrucks'),
    getSelectData('ShippingTruckOrder', 'getTruckCompany'),
    getSelectData('ShippingTruckOrder', 'getTruckType'),
    getSelectData('ShippingTruckOrder', 'getCompany'),
    getSelectData('ShippingTruckOrder', 'getAddress'),
  ])

  freightForwarderModel.value = freightForwarders
  carrierModel.value = carriers
  vesselsModel.value = vessels
  truckModel.value = truck

  TruckCompanyModel.value = truckConpany.sort((a, b) => a.truck.localeCompare(b.truck))
  TruckTypeModel.value = truckType.sort((a, b) => a.truckType.localeCompare(b.truckType))
  CompanyModel.value = company.sort((a, b) => a.company.localeCompare(b.company))
  AddressModel.value = address

})



const itemMock = ref([
  'Foo', 'Barหกฟหกฟหกฟหกฟหกฟหก', 'Fizz', 'Buzz',
])

//---------------------- Select Model ----------------------------------------------


const addressTruckCompanyModel = ref('')
const personInchargeTruckCompanyModel = ref('')
const contactTruckCompanyModel = ref('')

const selectedTruckCompany2 = () => {
  const foundItem = TruckCompanyModel.value.find(item => item.truck === TruckCompanyPrint.value)
  if (foundItem) {
    personInchargeTruckCompanyModel.value = foundItem.personIncharge || ''
    contactTruckCompanyModel.value = foundItem.contact || ''
  } else {
    //console.log('selectedTruckCompany2', TruckCompanyPrint.value, '==')
  }
}

// อัปเดตค่าเมื่อ TruckCompanyPrint เปลี่ยน
watchEffect(() => {
  selectedTruckCompany2()
})


const TruckTypePrint = ref([])

//------------------------------------------ Mock Data --------------------------------
import mockData from './dataMock'

//------------------------ Set Permissions (Hiden and Show Column) ------------------------
const accountAmin = ref(false)
const accountViewerKK = ref(false)
const accountINSP = ref(false)
const accountSALLOG = ref(false)
const accountSAL = ref(false)
const accountLOG = ref(false)
const accountWH = ref(false)
const accountWHSub = ref(false)
const accountAll = ref(true)

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

  //console.log('Switch Acc', accountAmin.value, accountViewerKK.value, accountINSP.value, accountSALLOG.value, accountWH.value, accountAll.value)

  // สามารถเพิ่มเงื่อนไขสำหรับ role อื่นๆ ได้ที่นี่
}

//-------------------
//----- Rune
const rules = [v => v.length <= 150 || 'Max 25 characters']

//--------- new expention
const panel = ref(['filter'])

///---------------- Dialog  truck order ------------------
const isDialogVisiblePrintTruck = ref(false)
const saleOrderNo = ref('')

const sOHistoryTruckOrder = ref()
const sOeIdHistoryTruckOrder = ref()
const rowDataHistoryTruckOrder = ref(JSON.parse(sessionStorage.getItem('rowDataHistoryTruckOrderSST')))



const showDialogTruckOrder = (SoId, SoeId, rowData) => {

  dataRowModel.value = rowData
  isDialogVisiblePrintTruck.value = true
  saleOrderNo.value = SoId
  soEIdModel.value = SoeId


  //console.log("RowData", rowData)

  CompanyPrint.value = rowData.shipperName || ' '
  AddressPrint.value = rowData.shipperLocation || ' '
  TruckCompanyPrint.value = rowData.truck || ' '

  // 🔹 บันทึกค่าไว้ใน sessionStorage
  sessionStorage.setItem("savedTruckOrder", JSON.stringify({ SoId, SoeId, rowData }))

  getDataTruckOrder()
}

const clearHistoryTruckOrder = () => {
  saleOrderNo.value = ""
  soEIdModel.value = ""
  dataRowModel.value = null
  isDialogVisiblePrintTruck.value = false

  // 🔹 ลบค่าจาก sessionStorage
  sessionStorage.removeItem("savedTruckOrder")
}

// ⏳ ตรวจสอบเมื่อเปิดหน้าใหม่ (onMounted)
onMounted(() => {
  const savedData = sessionStorage.getItem("savedTruckOrder")
  if (savedData) {
    const { SoId, SoeId, rowData } = JSON.parse(savedData)

    // if (isDialogVisiblePrintTruck.value) {
    //   showDialogTruckOrder(SoId, SoeId, rowData)
    // }

    showDialogTruckOrder(SoId, SoeId, rowData)
  }
})

// 🎯 ถ้า Dialog ปิด → เรียก clearParamsTruckOrder()
watch(isDialogVisiblePrintTruck, newVal => {
  if (!newVal) {
    clearParamsTruckOrder()
  }
})

///------------ Dialog PDF

const isDialogPDFViewVisible = ref(false)
const currentPageDataTable = ref(1)
const imgDialogPDF = ref('')
const imgDialogPng = ref('')

//------------------------------------------ Check Sheet To Page Resale -----------------------
async function redirectBasedOnStatus(product) {
  // ดึงเฉพาะตัวเลขหลักแรกของ status
  const mainStatus = Math.floor(product.statusId / 100)

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

  // const mainCheckSheetTypeName = (product.packagingTypeID)

  const mainCheckSheetTypeName = (product.checkSheetTypeID)

  // const checkSheetTypeNameMapping = {
  //   0: '',
  //   1: 'Drum',
  //   2: 'Drum',
  //   3: 'Drum',
  //   4: 'Drum',
  //   5: 'Drum',
  //   6: 'Flexi',
  //   7: 'Flexi',
  //   8: 'Drum',
  //   9: 'Drum',
  //   10: 'Drum',
  //   11: 'Flexi',

  // }

  const checkSheetTypeNameMapping = {
    0: '',
    1: 'Drum',
    2: 'Drum',
    3: 'Flexi',
    4: 'Flexi',

  }

  // ตรวจสอบว่า status มีใน mapping หรือไม่
  const subPath = checkSheetTypeNameMapping[mainCheckSheetTypeName] || "unknown-status"

  // ต่อ URL เดิมด้วย path ใหม่
  const currentPath = window.location.pathname // ดึง path ปัจจุบัน
  const newPath = `${currentPath}/${subPath}` // ต่อท้าย subPath

  const params = new URLSearchParams({
    journalIdParams: product.journalID,
    SoEtlLogDetailJournalIDParams: product.soEtlLogDetailJournalID,
    statusParams: product.statusId,
    salesOrderNoParams: product.salesOrderNo,
    itemCodeParams: product.itemCode,
    checkSheetTypeNameParams: product.checkSheetTypeName,
    csLfStatusIdParams: product.csLfStatusId,
  }).toString()

  sessionStorage.setItem('productDataSession', JSON.stringify(product))

  // 🔥 Redirect ไปยัง URL ใหม่พร้อม Query
  const finalPath = `${newPath}`

  //console.log(`Redirecting to: ${finalPath}`)
  window.location.href = finalPath
}

const actionIsDialogVisible = ref(false)
const prouctRowAction = ref()

function actionBtn(product) {
  prouctRowAction.value = product
  actionIsDialogVisible.value = true

}

const isSpinning = ref(false)

const refeshPage = () => {
  isSpinning.value = true
  setTimeout(() => {
    isSpinning.value = false
  }, 10 * 1000) // ระยะเวลาในการหมุน (1000 มิลลิวินาที = 1 วินาที)
  location.reload()
}

//----------------------------------------- Print Section -------------------------------


const { printShipmentPDFResult, errorPrintShipmentPDF, printShipmentPDF } = usePrintShipmentPDFService()
const loadingPrint = ref(false)

const printShipmentPDFBySoEId = async type => {
  loadingPrint.value = true

  //console.log('loadingPrint', loadingPrint.value)


  // ✅ ใช้ for...of เพื่อรองรับ async/await
  for (const item of paginatedData.value) {
    if (item.soEtlLogDetailJournalID === soEIdModel.value) {
      item.shipperMark = dialogDataTextArea.value
      item.shipperConditions = dialogData2TextArea.value
      item.shippingMarkActive = activeShipMarkModel.value
    }
  }
  if (!disabledModel.value) {
    // ✅ บันทึกข้อมูลก่อนพิมพ์
    await saveShipmentPlan(dataRowForUse.value)
    console.log("printShipmentPDFBySoEId")
  }

  try {
    // ✅ เรียก printShipmentPDF
    const result = await printShipmentPDF(
      urlApi.value,
      type,
      whereHouse,
      accessTokenAtStore,
      soEIdModel.value,
    )

    if (result) {
      //console.log('result print', result)

      // textAlertDialogFunction(alertWordConst.print, true)

      // setTimeout(() => {
      //   // location.reload()
      // }, 500)
    } else {
      textAlertDialogFunction(alertWordConst.print, false)
    }
  } catch (error) {
    console.error(`Error printing shipment PDF:`, error)
  } finally {
    loadingPrint.value = false
  }
}

//-------------------------------- Print PDF -------------------------------------------------

//-------------------------------- Call api checksheet for  containerNo_LicPlNo --------------------

import { useGetShippingCheckSheetService } from '@/services/skt/shipmentPlan/checkSheetServices'

const { getShippingCheckSheetResult, errorGetShippingCheckSheet, fetchShippingCheckSheet } = useGetShippingCheckSheetService()

const getShippingCheckSheet = async soEId => {
  try {
    const result = await fetchShippingCheckSheet(
      urlApi.value, 'ShippingCheckSheet', whereHouse,
      accessTokenAtStore, soEId)

    if (result) {
      getShippingCheckSheetResult.value = result

      errorGetShippingCheckSheet.value = null

      // //console.log('getShippingCheckSheetResult', result)
    } else {

      // //console.log('errorGetShippingCheckSheet !result ', errorGetShippingCheckSheet.value)
    }
  } catch (error) {
    errorGetShippingCheckSheet.value = error.message
  }
}

const { getShippingCheckSheetResult2,
  errorGetShippingCheckSheet2,
  fetchShippingCheckSheet2 } = useGetShippingCheckSheetLorryFlexi2Service()

const getShippingCheckSheetLorryFlexi = async soEId => {
  try {
    const result = await fetchShippingCheckSheet2(
      urlApi.value, 'ShippingLorryFlexi', whereHouse,
      accessTokenAtStore, soEId)

    if (result) {
      getShippingCheckSheetResult2.value = result.data.reportLorryFlexi

      errorGetShippingCheckSheet.value = null

      //console.log('getShippingCheckSheetResult2', result)
    } else {

      // //console.log('errorGetShippingCheckSheet !result ', errorGetShippingCheckSheet.value)
    }
  } catch (error) {
    errorGetShippingCheckSheet.value = error.message
  }
}

const { printPDFResult,
  printPDFErrorMessage,
  printPDFService } = usePrintPDFService()

const paramsPrintPDFCheckSheet = ref({
  SoEtlLogDetailJournalID: '',
  ItemName: '',
  ItemCode: '',
  UserCode: '',
  Customer: '',
  SaleOrder: '',
  location: '',
  LicensePlate: [],
})

const licensePlate = ref({

})

const mapProductRowToPramsPrint = async item => {
  // ถ้า item ไม่ใช่ array ให้แปลงเป็น array
  const items = Array.isArray(item) ? item : [item]

  paramsPrintPDFCheckSheet.value = items.map(item => ({
    SoEtlLogDetailJournalID: item.soEtlLogDetailJournalID,
    ItemName: item.itemName,
    ItemCode: item.itemCode,
    UserCode: item.shippingUserCode,
    Customer: item.shippingUserName,
    SaleOrder: item.salesOrderNo,
    location: item.ShipperLocationProvince,
    LicensePlate: item.containerNo_LicPlNo, // ✅ ใช้ค่าที่ถูกต้อง
  }))
}

const didabledPrintPDFCheckSheet = statusId => {
  return !(statusId === 1003 || statusId === 1004 || statusId === 1005 || statusId === 1103 || statusId === 1104 || statusId === 1105)
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const hanbleBtnPrintPDFCheckSheet = type => {
  //console.log('Check BtnPrintPDF start...', prouctRowAction.value.checkSheetTypeID)

  if (prouctRowAction.value) {
    //console.log('Check BtnPrintPDF start if', prouctRowAction.value.checkSheetTypeID)
    if (prouctRowAction.value.checkSheetTypeID !== 3 && prouctRowAction.value.checkSheetTypeID !== 4) {
      //console.log('Check BtnPrintPDF start ===', prouctRowAction.value.checkSheetTypeID)
      if (prouctRowAction.value.checkSheetTypeID === 2) {
        handlePrintDPFCheckSheet('ShippingCheckSheetIBC2')
      } else if (prouctRowAction.value.checkSheetTypeID === 1) {
        handlePrintDPFCheckSheet('ShippingCheckSheet')
      }
    } else if (prouctRowAction.value.checkSheetTypeID === 3 || prouctRowAction.value.checkSheetTypeID === 4) {
      handlePrintDPFCheckSheet('ShippingLorry')

      //console.log('Check BtnPrintPDF start ===', prouctRowAction.value.checkSheetTypeID)
      if (getShippingCheckSheetResult2?.value.isLorry) {
        //console.log('Check getShippingCheckSheetResult2 start ===', getShippingCheckSheetResult2.value.isLorry)
        handlePrintDPFCheckSheet('ShippingLorry')
      } else if (!getShippingCheckSheetResult2?.value.isLorry) {
        handlePrintDPFCheckSheet('ShippingFlexi')
      } else {
        //console.log('Please prouctRowAction3', prouctRowAction.value)
      }
    } else {
      //console.log('Please prouctRowAction2', prouctRowAction.value)
    }
  } else {
    //console.log('Please prouctRowAction1', prouctRowAction.value)
  }
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const handlePrintDPFCheckSheet = async type => {

  if (prouctRowAction.value) {
    if (type === 'ShippingCheckSheetIBC2' || type === 'ShippingCheckSheet') {
      //console.log('getShippingCheckSheet start')
      await getShippingCheckSheet(prouctRowAction.value.soEtlLogDetailJournalID)

      if (getShippingCheckSheetResult.value) {
        //console.log('getShippingCheckSheet start',  getShippingCheckSheetResult.value.containerNo_LicPlNo)
        licensePlate.value = getShippingCheckSheetResult.value.checkSheetItems

        //console.log('getShippingCheckSheet start',  licensePlate.value)
      }


    } else {
      await getShippingCheckSheetLorryFlexi(prouctRowAction.value.soEtlLogDetailJournalID)

      //console.log('getShippingCheckSheetResult.value Lorry', getShippingCheckSheetResult2.value)
    }

  }

  await mapProductRowToPramsPrint(prouctRowAction.value)

  //console.log('paramsPrintPDFCheckSheet.value', paramsPrintPDFCheckSheet.value)

  const countPage = ref(1)

  if (type === 'ShippingCheckSheetIBC2') {
    //console.log('type.value', type)
    handleDialogLoading("PRINT CHECK SHEETS")
    await callAPIPrintPDFChecksheet('ShippingCheckSheet', '', countPage.value++)
    await callAPIPrintPDFChecksheet(type, '', countPage.value++)

    const licensePlates = Array.isArray(licensePlate.value)
      ? licensePlate.value
      : [licensePlate.value]

    for (const item of licensePlates) {
      await callAPIPrintPDFChecksheet('ShippingCheckSheetContainer', item.containerNo_LicPlNo, countPage.value++)
    }

    setTimeout(() => {
      isDialogLoadingVisible.value = false
    }, 3 * 1000) // ระยะเวลาในการหมุน (1000 มิลลิวินาที = 1 วินาที)

  } else if (type === 'ShippingCheckSheet') {
    //console.log('type.value', type)
    handleDialogLoading("PRINT CHECK SHEETS")
    await callAPIPrintPDFChecksheet(type, '', countPage.value++)

    const licensePlates = Array.isArray(licensePlate.value)
      ? licensePlate.value
      : [licensePlate.value]

    for (const item of licensePlates) {
      await callAPIPrintPDFChecksheet('ShippingCheckSheetContainer', item.containerNo_LicPlNo, countPage.value++)
    }

    setTimeout(() => {
      isDialogLoadingVisible.value = false
    }, 3 * 1000) // ระยะเวลาในการหมุน (1000 มิลลิวินาที = 1 วินาที)
    //console.log('Completed')
  } else if (getShippingCheckSheetResult2?.value.isLorry) {
    handleDialogLoading("PRINT CHECK SHEETS")
    callAPIPrintPDFChecksheet('ShippingLorry')

    //console.log("getShippingCheckSheetResult?.value.isLorry", getShippingCheckSheetResult2?.value.isLorry)

    setTimeout(() => {
      isDialogLoadingVisible.value = false
    }, 3 * 1000) // ระยะเวลาในการหมุน (1000 มิลลิวินาที = 1 วินาที)
  } else if (!getShippingCheckSheetResult2?.value.isLorry) {
    handleDialogLoading("PRINT CHECK SHEETS")
    callAPIPrintPDFChecksheet('ShippingFlexi')

    //console.log("getShippingCheckSheetResult2?.value.Flexi", getShippingCheckSheetResult2?.value.isLorry)

    setTimeout(() => {
      isDialogLoadingVisible.value = false
    }, 3 * 1000) // ระยะเวลาในการหมุน (1000 มิลลิวินาที = 1 วินาที)
  }
  else {
    // handleDialogLoading("PRINT CHECK SHEETS")
    // callAPIPrintPDFChecksheet(type)

    // setTimeout(() => {
    //   isDialogLoadingVisible.value = false
    // }, 3 * 1000) // ระยะเวลาในการหมุน (1000 มิลลิวินาที = 1 วินาที)

    //console.log("getShippingCheckSheetResult2?.value.Flexi", getShippingCheckSheetResult2?.value.isLorry)
  }

}

const callAPIPrintPDFChecksheet = async (type, LicensePlate, page) => {


  try {
    const result = printPDFService(
      urlApi.value,
      'Pdf',
      type,
      whereHouse,
      accessTokenAtStore,
      paramsPrintPDFCheckSheet.value,
      LicensePlate,
      page,
    )

    if (printPDFResult.value) {
      //console.log(result)

    }
  } catch (error) {
    console.error(`Error printing PDF:`, error)
    setTimeout(() => {
      wordForSubmit.value = "PRINT CHECKSHEET"
    }, 500)
  }
  setTimeout(() => {
    wordForSubmit.value = "PRINT CHECKSHEET"
  }, 500)
}

//--------------------------- Export Excel

const { printExportExcelResult,
  printExportExcelErrorMessage,
  printExportExcelService } = usePrintExportExcelService()

const testExport = () => {
  //console.log('printShipmentPDFBySoEIdPlan')
}

const printShipmentPDFBySoEIdPlan = async () => {
  loadingPrint.value = true

  //console.log('loadingPrint', loadingPrint.value)


  const etaDateForApi = ref(etaDateModel.value)
  const etdDateForApi = ref(etdDateModel.value)

  filterForSearchPlan.value.ETA = formatDateSave(etaDateForApi.value)
  filterForSearchPlan.value.ETD = formatDateSave(etdDateForApi.value)

  filterForSearchPlan.value.SortColumn = sortColumn.value
  filterForSearchPlan.value.SortDirection = sortDirection.value


  saveHistoryFilter()


  const statusID = getStatusIdByName(filterForSearchPlan.value.StatusId)

  const typeDepartment = () => {

    if (department.value === 'Warehouse') {
      return 'ShipmentPlanWH'
    } else if (department.value === 'Logistic') {
      return 'ShipmentPlanLOG'
    } else if (department.value === 'Sale and marketing') {
      return 'ShipmentPlanSALE'
    } else if (department.value === 'Inspection') {
      return 'ShipmentPlanInspection'
    }
  }

  try {
    // ✅ เรียก printShipmentPDF
    const result = await printExportExcelService(
      urlApi.value,
      'ShipmentPlan',
      typeDepartment(),
      whereHouse,
      accessTokenAtStore,
      filterForSearchPlan.value,
      statusID,

    )

    if (result) {
      //console.log('result print', result)

      // textAlertDialogFunction(alertWordConst.print, true)

      // setTimeout(() => {
      //   // location.reload()
      // }, 500)
    } else {
      textAlertDialogFunction(alertWordConst.print, false)
    }
  } catch (error) {
    console.error(`Error printing shipment PDF:`, error)
  } finally {
    loadingPrint.value = false
  }
}

const { printTruckOrderFormPDFResult, errorPrintTruckOrderFormPDF, printTruckOrderFormPDF } = usePrintTruckOrderFormPDFService()

const paramsTruckOrder = ref({
  runningNum: '',
  comName: '',
  address: '',
  transportComName: '',
  truckType: '',
  truckLicense: '',
  driverName: '',
  tel: '',
  remark: '',
  driverBy: contactTruckCompanyModel.value || '',
  dateDriverBy: '',
  orderBy: '',
  dateOrderBy: dateCurrent.value,
  authorizedBy: dateCurrent.value,
  dateAuthorizedBy: dateCurrent.value,
})


//------------------- formate truck date

function convertToISO8601(dateStr) {
  // แยกค่าจากรูปแบบ "DD/MM/YYYY"
  const [day, month, year] = dateStr.split('/')
  const date = new Date(`${year}-${month}-${day}T00:00:00.000Z`)

  return date.toISOString() || ''
}

function convertToDDMMYYYY(isoDateStr) {
  const date = new Date(isoDateStr)
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const year = date.getUTCFullYear()

  return `${day}/${month}/${year}` || ''
}

const { getTruckOrderDataResult,
  errorGetTruckOrderData,
  fetchTruckOrderData } = useGetDataTruckOrderService()

const getDataTruckOrder = async () => {


  paramsTruckOrder.value.dateOrderDate = dateCurrent.value
  paramsTruckOrder.value.dateDriverDate = dateCurrent.value
  paramsTruckOrder.value.dateAuthorizedDate = dateCurrent.value

  try {
    const result = await fetchTruckOrderData(
      urlApi.value,
      soEIdModel.value,
      'get',
      'ShippingTruckOrder',
      whereHouse,
      accessTokenAtStore,
    )

    if (result) {


      if (getTruckOrderDataResult?.value) {
        if (paramsTruckOrder.value) {

          paramsTruckOrder.value.address = getTruckOrderDataResult?.value.address
          paramsTruckOrder.value.company = getTruckOrderDataResult?.value.company
          paramsTruckOrder.value.contactAndTel = getTruckOrderDataResult?.value.contactAndTel
          paramsTruckOrder.value.remark = getTruckOrderDataResult?.value.remark
          paramsTruckOrder.value.transComName = getTruckOrderDataResult?.value.transComName
          paramsTruckOrder.value.truckLicense = getTruckOrderDataResult?.value.truckLicense
          paramsTruckOrder.value.truckType = getTruckOrderDataResult?.value.truckType
          paramsTruckOrder.value.updatedDateTime = getTruckOrderDataResult?.value.updatedDateTime

          paramsTruckOrder.value.contactDate = getTruckOrderDataResult?.value.contactDate
          paramsTruckOrder.value.driverName = getTruckOrderDataResult?.value.driverName
          paramsTruckOrder.value.orderBy = getTruckOrderDataResult?.value.orderBy
          paramsTruckOrder.value.orderDate = getTruckOrderDataResult?.value.orderDate
          paramsTruckOrder.value.authorizedBy = getTruckOrderDataResult?.value.authorizedBy
          paramsTruckOrder.value.authorizedDate = getTruckOrderDataResult?.value.authorizedDate

          TruckTypePrint.value = getTruckOrderDataResult?.value.truckType
          contactTruckCompanyModel.value = getTruckOrderDataResult?.value.contactAndTel
          personInchargeTruckCompanyModel.value = getTruckOrderDataResult?.value.driverName

          //console.log('getDataTruckOrder', getTruckOrderDataResult?.value)
        }
      } else {
        // conslolr
      }

      return getTruckOrderDataResult.value

    }
  } catch (error) {
    //console.log(error)
  }
}

// watch(() => {
//   if(rowDataHistoryTruckOrder.value !== '' && 
//   rowDataHistoryTruckOrder.value !== 'null' && 
//   rowDataHistoryTruckOrder.value !== null){
//     isDialogVisiblePrintTruck.value = true
//     showDialogTruckOrder(sessionStorage.getItem('sOHistoryTruckOrderSST'), 
//       sessionStorage.getItem('sOeIdHistoryTruckOrderSST'), 
//       JSON.parse(sessionStorage.getItem('rowDataHistoryTruckOrderSST')))
//   }
// })

const loadingPrintTruckOrderForm = ref(false)

const clearParamsTruckOrder = () => {
  //console.log('clearParamsTruckOrder', CompanyPrint.value)

  sessionStorage.removeItem('savedTruckOrder')
  dataRowModel.value = null
  isDialogVisiblePrintTruck.value = false
  saleOrderNo.value = null
  soEIdModel.value = null

  CompanyPrint.value = []
  AddressPrint.value = []
  TruckCompanyPrint.value = []
  TruckTypePrint.value = []
  paramsTruckOrder.value = {
    runningNum: '',
    comName: '',
    address: '',
    transportComName: '',
    truckType: '',
    truckLicense: '',
    driverName: '',
    tel: '',
    remark: '',
    driverBy: contactTruckCompanyModel.value || '',
    dateDriverBy: '',
    orderBy: '',
    dateOrderBy: dateCurrent.value,
    authorizedBy: dateCurrent.value,
    dateAuthorizedBy: dateCurrent.value,
  }
  personInchargeTruckCompanyModel.value = ''
  contactTruckCompanyModel.value = ''

  //console.log('clearParamsTruckOrder', CompanyPrint.value)

  // sessionStorage.setItem('sOHistoryTruckOrderSST', 'null')
  // sessionStorage.setItem('sOeIdHistoryTruckOrderSST', 'null')
  // sessionStorage.setItem('rowDataHistoryTruckOrderSST', null)


}

const handlePrintTruckOrderPDF = () => {
  setTimeout(() => {
    loadingPrintTruckOrderForm.value = true
  }, 3 * 1000) // ระยะเวลาในการหมุน (1000 มิลลิวินาที = 1 วินาที)

  paramsTruckOrder.value.comName = CompanyPrint.value
  paramsTruckOrder.value.address = AddressPrint.value
  paramsTruckOrder.value.transportComName = TruckCompanyPrint.value
  paramsTruckOrder.value.truckType = TruckTypePrint.value
  paramsTruckOrder.value.driverName = personInchargeTruckCompanyModel.value
  paramsTruckOrder.value.tel = contactTruckCompanyModel.value
  paramsTruckOrder.value.driverBy = contactTruckCompanyModel.value
  paramsTruckOrder.value.orderBy = userDataInfo.value.firstName
  paramsTruckOrder.value.runningNum = dataRowModel?.value.truckReservingNumber

  paramsTruckOrder.value.dateDriverBy = dateCurrent.value || ''
  paramsTruckOrder.value.dateOrderBy = dateCurrent.value || ''
  paramsTruckOrder.value.dateAuthorizedBy = dateCurrent.value || ''

  //console.log('loading.......')


  try {
    const result = printTruckOrderFormPDF(
      urlApi.value,
      paramsTruckOrder.value,
      whereHouse,
      accessTokenAtStore,
      soEIdModel.value)

    if (result) {
      // textAlertDialogFunction(alertWordConst.print, true)
      // setTimeout(() => {
      //   location.reload()
      // }, 500) // 10000 มิลลิวินาที = 10 วินาที
      // loadingPrintTruckOrderForm.value = false


      setTimeout(() => {
        loadingPrintTruckOrderForm.value = false
      }, 3 * 1000) // ระยะเวลาในการหมุน (1000 มิลลิวินาที = 1 วินาที)

    } else {
      setTimeout(() => {
        loadingPrintTruckOrderForm.value = false
      }, 3 * 1000) // ระยะเวลาในการหมุน (1000 มิลลิวินาที = 1 วินาที)
      textAlertDialogFunction(alertWordConst.print, false)
      setTimeout(() => {
      }, 500) // 10000 มิลลิวินาที = 10 วินาที
      loadingPrintTruckOrderForm.value = false

    }
  } catch (e) {
    setTimeout(() => {

    }, 3 * 1000) // ระยะเวลาในการหมุน (1000 มิลลิวินาที = 1 วินาที)
    console.error(`Error saving search plan:`, error)
    loadingPrintTruckOrderForm.value = false

  }
  setTimeout(() => {

  }, 3 * 1000) // ระยะเวลาในการหมุน (1000 มิลลิวินาที = 1 วินาที)
  loadingPrintTruckOrderForm.value = false


}

const { saveTruckOrderResult,
  errorSaveTruckOrder,
  saveTruckOrder } = useSaveTruckOrderService()

const bodySaveTruckOrder = data => ({
  soEtlLogDetailJournalID: soEIdModel.value,
  company: CompanyPrint.value,
  address: AddressPrint.value,
  transComName: TruckCompanyPrint.value,
  truckType: TruckTypePrint.value,
  truckLicense: data.truckLicense,
  remark: data.remark,

  driverName: personInchargeTruckCompanyModel.value,

  orderBy: userDataInfo?.value.firstName,
  contactAndTel: contactTruckCompanyModel.value,
  authorizedBy: data.authorizedBy,

  contactDate: convertToISO8601(data.dateDriverBy) || convertToISO8601(dateCurrent.value) || '',
  orderDate: data.orderDate || convertToISO8601(dateCurrent.value),
  authorizedDate: data.authorizedDate || convertToISO8601(dateCurrent.value),
  lastPrintDateTime: data.orderDate || convertToISO8601(dateCurrent.value),
})

const bodyFirstTruckOrder = ref(
  {
    "soEtlLogDetailJournalID": 0,
    "company": "string",
    "address": "string",
    "transComName": "string",
    "truckType": "string",
    "truckLicense": "string",
    "driverName": "string",
    "contactAndTel": "string",
    "remark": "string",
    "orderBy": "string",
    "authorizedBy": "string",
    "contactDate": "2025-03-10T04:43:53.887Z",
    "orderDate": "2025-03-10T04:43:53.887Z",
    "authorizedDate": "2025-03-10T04:43:53.887Z",
    "lastPrintDateTime": "2025-03-10T04:43:53.887Z",
  },
)

const loadingSaveTruckOrderForm = ref(false)
const trickerSaveTruckOrder = ref(0)

const handleSavetruckOrder = async type => {

  loadingSaveTruckOrderForm.value = true

  //console.log('paramsTruckOrder', paramsTruckOrder.value)

  paramsTruckOrder.value.dateOrderBy = dateCurrent.value
  paramsTruckOrder.value.dateDriverBy = dateCurrent.value
  paramsTruckOrder.value.dateAuthorizedBy = dateCurrent.value

  // const body = null

  // if(type ==='first'){
  //   body = bodyFirstTruckOrder()
  // }else{
  //   body = bodySaveTruckOrder(paramsTruckOrder.value)
  // }

  const body = bodySaveTruckOrder(paramsTruckOrder.value)

  trikerSaveDrft.value = true

  const saveDraftRes = await saveShipmentPlan(dataRowModel.value)

  if (!saveDraftRes) {
    textAlertDialogFunction(alertWordConst.saveDraft, false)
    throw new Error('saveDraftRes failed: ' + saveDraftRes)
  }


  try {
    const result = await saveTruckOrder(
      urlApi.value,
      'save',
      whereHouse,
      accessTokenAtStore,
      body,
    )

    if (result) {
      //console.log('saveTruckOrderResult', saveTruckOrderResult?.value)


      sessionStorage.removeItem('sOHistoryTruckOrderSST')
      sessionStorage.removeItem('sOeIdHistoryTruckOrderSST')
      sessionStorage.removeItem('rowDataHistoryTruckOrderSST')

      if (trickerSaveTruckOrder.value == !1) {
        console.log("asdasdasd", trickerSaveTruckOrder.value)
        textAlertDialogFunction("SAVE TRUCK ORDER", true)
        setTimeout(() => {
          location.reload()
        }, 500)
      }
    } else {
      //console.log('errorSaveTruckOrder', errorSaveTruckOrder.value)
      textAlertDialogFunction("SAVE TRUCK ORDER", false)

      trikerSaveDrft.value = false
    }
  } catch (error) {
    trikerSaveDrft.value = false
  }

  loadingSaveTruckOrderForm.value = false
  trikerSaveDrft.value = false
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
                :to="{
                  name: 'skt-receiving',
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
                  <VSelect
                    v-model="filterForSearchPlan.StatusId"
                    :items="itemsStatus"
                    item-title="name"
                    item-value="name"
                    clearable
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
                        size="x-small"
                        style="min-height: 20px;"
                        :color="item.raw.color ? item.raw.color : 'grey'"
                      >
                        <span
                          v-if="item.raw.name"
                          class="text-white"
                        >{{ item.raw.name }}</span>
                        <span
                          v-else
                          class="text-white"
                        >All</span>
                      </VChip>
                    </template>
                  </VSelect>
                </VCol>

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


                <!-- 👉 Select Product code -->
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <!-- 👉 Search Product code -->
                  <AppDateTimePicker
                    v-model="etdDateModel"
                    prepend-inner-icon="ri-calendar-schedule-fill"
                    placeholder="ETD (dd/mm/yyyy To dd/mm/yyyy)"
                    density="compact"
                    style="font-size: 14px;"
                    :config="{ dateFormat: 'd/m/Y', mode: 'range' }"
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

                <!-- 👉 Select Product Name -->
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <VTextField
                    v-model="filterForSearchPlan.LotSearch"
                    density="compact"
                  >
                    <template #label>
                      <span style="font-size: 12px;">Lot</span>
                    </template>
                  </VTextField>
                </VCol>

                <!-- 👉 Button Search and Export -->
                <VCol cols="8" />
                <VCol
                  cols="12"
                  lg="4"
                  class="py-1"
                >
                  <VRow class="d-flex justify-end">
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
                        :disabled="!disabledBtnExport"
                        density="compact"
                        class=" px-16 px-sm-12 pa-sm-1 custom-small-btn-excel"
                        color="warning"
                        style="width: 100%; height: 40px;"
                        @click="printShipmentPDFBySoEIdPlan"
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
                    }}:&nbsp;</span>&nbsp;<span v-if="totalProduct">{{
                      (formatDecimal(totalProduct)).toLocaleString('en-US') }} {{ unitNameProduct }}<br><br></span>
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

  <!-- Truck Order -->
  <section>
    <VDialog
      v-model="isDialogVisiblePrintTruck"
      width="100%"
      persistent
    >
      <!-- Dialog Content -->
      <VCard>
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="trikerSaveDrft = false, trickerSaveTruckOrder = 1, handleSavetruckOrder(), isDialogVisiblePrintTruck = false, clearParamsTruckOrder(), clearHistoryTruckOrder()"
        />

        <VCardTitle class="text-center">
          Truck Order
        </VCardTitle>

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
                  Tel. (038) 627-050 Fax. (038) 946-07
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
                  วันที่ส่งสินค้า
                </th>
                <td
                  colspan="8"
                  class="text-start"
                >
                  {{ dataRowModel?.logUpdatedDate }}
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  เลขที่ใบสั่งงานรถขนส่ง (Truck Order No)
                </th>
                <td colspan="8">
                  <VTextField
                    v-if="false"
                    style="min-width: 250px;"
                    density="compact"
                    class="text-center"
                  >
                    <template #prepend>
                      Running Number:
                    </template>
                  </VTextField>
                  {{ dataRowModel?.truckReservingNumber }}
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  เลขที่อ้างอิง (Ref SO No.)
                </th>
                <td
                  colspan="8"
                  class="text-start"
                >
                  {{ saleOrderNo }}
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  ชื่อลูกค้า
                </th>
                <th colspan="8">
                  <VAutocomplete
                    v-model="CompanyPrint"
                    class="text-start"
                    density="compact"
                    label="Company"
                    :items="CompanyModel"
                    item-title="company"
                    item-value="company"
                  />
                </th>
              </tr>
              <tr>
                <th colspan="4">
                  สถานที่จัดส่ง
                </th>
                <td
                  colspan="8"
                  class="text-start"
                  style="min-width: 500px; max-width: 500px;"
                >
                  <VAutocomplete
                    v-model="AddressPrint"
                    class="text-start"
                    density="compact"
                    label="Address"
                    :items="AddressModel"
                    item-title="shipperLocation"
                    item-value="shipperLocation"
                  />
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
                    v-model="TruckCompanyPrint"
                    class="text-center"
                    density="compact"
                    label="Transportation Company Name"
                    :items="TruckCompanyModel"
                    item-title="truck"
                    item-value="truck"
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
                    v-model="TruckTypePrint"
                    class="text-center"
                    density="compact"
                    label="Truck Type"
                    :items="TruckTypeModel"
                    item-title="truckType"
                    item-value="truckType"
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
                    v-model="paramsTruckOrder.truckLicense"
                    style="min-width: 250px;"
                    density="compact"
                    label="Enter Truck License"
                    class="text-center"
                  />
                </th>
              </tr>
              <tr>
                <th colspan="4">
                  ชื่อผู้ติดต่อ
                </th>
                <td
                  colspan="8"
                  class="text-start"
                >
                  <VTextField
                    v-model="personInchargeTruckCompanyModel"
                    style="min-width: 250px;"
                    density="compact"
                    label="Contact Name"
                    class="text-center"
                  />
                  <span v-if="false">{{ personInchargeTruckCompanyModel }}</span>
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
                    v-model="personInchargeTruckCompanyModel"
                    style="min-width: 250px;"
                    density="compact"
                    label="Ref SO No."
                    placeholder="000000000"
                    class="text-center"
                  />
                  <span v-if="selectedTruckCompany2('contact')">{{ selectedTruckCompany2('contact') }}</span>
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  รายชื่อและเบอร์โทรผู้ติดต่อ
                </th>
                <td
                  colspan="8"
                  class="text-start"
                >
                  <span v-if="false">{{ (selectedTruckCompany2('contact')) }}</span>
                  <VTextField
                    v-model="contactTruckCompanyModel"
                    style="min-width: 250px;"
                    density="compact"
                    label="Contact & Tel."
                    class="text-center"
                  />
                </td>
              </tr>
              <tr>
                <th
                  colspan="4"
                  style="text-align: start; vertical-align: top;"
                >
                  <span>หมายเหตุ (Remark) </span>
                </th>
                <th
                  colspan="8"
                  class="text-center"
                >
                  <VTextarea
                    v-model="paramsTruckOrder.remark"
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
                  v-model="contactTruckCompanyModel"
                  density="compact"
                  class="text-center"
                >
                  <template #label>
                    ผู้ขับรถ&เบอร์โทร
                  </template>
                </VTextField>
              </th>
              <th colspan="4">
                <VTextField
                  v-model="userDataInfo.firstName"
                  density="compact"
                  class="text-center"
                >
                  <template #label>
                    ผู้สั่งการ / Order By
                  </template>
                </VTextField>
              </th>
              <th colspan="4">
                <VTextField
                  v-model="paramsTruckOrder.authorizedBy"
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
                <AppDateTimePicker
                  v-model="paramsTruckOrder.dateDriverDate"
                  density="compact"
                  placeholder="Select date"
                  :config="{ dateFormat: 'd/m/Y' }"
                />
              </th>
              <th colspan="4">
                <AppDateTimePicker
                  v-model="paramsTruckOrder.dateOrderDate"
                  density="compact"
                  placeholder="Select date"
                  :config="{ dateFormat: 'd/m/Y' }"
                />
              </th>
              <th colspan="4">
                <AppDateTimePicker
                  v-model="paramsTruckOrder.dateAuthorizedDate"
                  density="compact"
                  placeholder="Select date"
                  :config="{ dateFormat: 'd/m/Y' }"
                />
              </th>
            </tr>
          </table>
        </VCardText>

        <VCardText class="d-flex justify-end">
          <VBtn
            color="warning"
            class="d-flex justify-space-between mx-2"
            @click="trickerSaveTruckOrder = 0, trikerSaveDrft = true, handleSavetruckOrder(), loadingSaveTruckOrderForm = true"
          >
            <span v-if="!loadingSaveTruckOrderForm">

              Save

            </span>

            <div>
              <VProgressCircular
                v-if="loadingSaveTruckOrderForm"
                start
                :rotate="360"
                :size="30"
                indeterminate
                :model-value="progressValue"
                color="primary"
              />
            </div>
          </VBtn>

          <VBtn
            color="warning"
            class="d-flex justify-space-between"
            @click="handlePrintTruckOrderPDF(), loadingPrintTruckOrderForm = true"
          >
            <span v-if="!loadingPrintTruckOrderForm">
              <VIcon
                start
                icon="ri-printer-fill"
              />

              Print

            </span>

            <div>
              <VProgressCircular
                v-if="loadingPrintTruckOrderForm"
                start
                :rotate="360"
                :size="30"
                indeterminate
                :model-value="progressValue"
                color="primary"
              />
            </div>
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
      <VBtn
        v-if="false"
        @click="showText"
      >
        asdasd
      </VBtn>
      <VCardText class="pa-2">
        <VRow>
          <VCol cols="10">
            <VBtn
              v-if="false"
              class="mx-2"
              color="warning"
              @click="saveShipmentPlan"
            >
              <span style="font-size: 12px;">Save</span>
            </VBtn>
            <VBtn
              v-if="false"
              class="mx-2"
              color="primary"
              @click="submitShipmentPlanBySoEId"
            >
              <span style="font-size: 12px;">Submit</span>
            </VBtn>

            <VBtn
              v-if="userDataInfo.id === '00023' || userDataInfo.id === '00025' || canVisibleUserPermission(statusPermission, 'BTN_APPROVE').canVisible"
              :disabled="selectedDataTables.length < 1"
              class="mx-2"
              color="primary"
              @click="submitShipmentPlanBySoEId('approve', '001')"
            >
              <span style="font-size: 12px;">Approve</span>
            </VBtn>

            <VBtn
              v-if="userDataInfo.id === '00023' || userDataInfo.id === '00025' || canVisibleUserPermission(statusPermission, 'BTN_REJECT').canVisible"
              :disabled="selectedDataTables.length < 1"
              class="mx-2"
              color="error"
              @click="isDialogVisibleCommentDialog = true"
            >
              <span style="font-size: 12px;">Reject</span>
            </VBtn>

            <VBtn
              v-if="userDataInfo.id === '00023' || userDataInfo.id === '00025' || canVisibleUserPermission(statusPermission, 'BTN_SENDBACK').canVisible"
              :disabled="selectedDataTables.length < 1"
              class="mx-2"
              color="purple-accent-4"
              @click="openConfirmDialog('back', '001')"
            >
              <span style="font-size: 12px;">Send Back</span>
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
  <section v-if="disableShowDataByDepartment()">
    <VCard class="mt-2">
      <div>
        <div
          v-if="errorMessage"
          class="error"
        >
          {{ errorMessage }}
        </div>

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
      <section v-if="!isLoading && paginatedData.length > 0">
        <VTable
          v-if="!isLoading"
          class="text-wrap table-header-bg rounded-0"
        >
          <!-- 👉 table head -->
          <thead class="">
            <tr>
              <th
                style="width: 60px;"
                class="sticky-column"
              >
                <VCheckbox
                  v-if="userDataInfo.id === '00023' || userDataInfo.id === '00025' || canVisibleUserPermission(statusPermission, 'BTN_APPROVE').canVisible"
                  v-model="isSelectAll"
                  :indeterminate="isIndeterminate"
                  @click="toggleSelectAll"
                />
              </th>
              <th
                scope="row"
                class="sticky-column text-center px-1"
              >
                <span style="font-weight: bold;">{{ $t('No.') }}</span>
              </th>
              <th class="sticky-column text-center">
                <span style="font-weight: bold;">{{ $t('Status') }}</span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_SALE_ORDER_NO').canVisible"
                class="px-2"
              >
                <span style="font-weight: bold;">{{ $t('Sale Order No.') }}
                  <VIcon
                    :icon="sortColumn === 'salesOrderNo' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('salesOrderNo')"
                  />
                </span>
              </th>
              
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_SO_ATTACHMENT').canVisible"
                class="text-center"
              >
                <span style="font-weight: bold;">{{ $t('SO attachment') }}</span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_SO_ATTACHMENT').canVisible"
                class="text-start"
              >
                <span style="font-weight: bold;">{{ $t('PO No.') }}</span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_SO_ATTACHMENT').canVisible"
                class="text-center"
              >
                <span style="font-weight: bold;">{{ $t('PO attachment') }}</span>
              </th>
              
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_SAP_INVOICE_NO').canVisible"
                class="px-2"
              >
                <span style="font-weight: bold;">{{ $t('SAP Invoice no') }}
                  <VIcon
                    :icon="sortColumn === 'sapInvoiceNo' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('sapInvoiceNo')"
                  />
                </span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_PAYER_NAME').canVisible"
                class="px-2"
              >
                <span style="font-weight: bold;">{{ $t('Payer Name') }}
                  <VIcon
                    :icon="sortColumn === 'payerName' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('payerName')"
                  />
                </span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_USER').canVisible"
                class="px-2"
              >
                <span style="font-weight: bold;">{{ $t('User') }}</span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_SHIPPER').canVisible"
                class="px-2"
              >
                <span style="font-weight: bold;">{{ $t('Shipper') }}
                  <VIcon
                    :icon="sortColumn === 'shipper' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('shipper')"
                  />
                </span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_SHIPPER_LOCATION').canVisible"
                class="px-2"
              >
                <span style="font-weight: bold;">{{ $t('Shipper location') }}
                  <VIcon
                    :icon="sortColumn === 'shipperLocation' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('shipperLocation')"
                  />
                </span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_SHIPPING_MARK').canVisible"
                class="text-start px-2"
              >
                <div>
                  <span style="font-weight: bold;">
                    {{ $t('Shipping Mark/Cond.') }}
                  </span>
                </div>
              </th>
              <th v-if="canVisibleUserPermission(statusPermission, 'COL_END_USER').canVisible">
                <span style="font-weight: bold;">{{ $t('End User') }}</span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_CONSIGNEE').canVisible"
                class="px-2"
              >
                <span style="font-weight: bold;">{{ $t('Consignee') }}
                  <VIcon
                    :icon="sortColumn === 'consignee' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('consignee')"
                  />
                </span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_PRODUCT').canVisible"
                class="px-2"
              >
                <span style="font-weight: bold;">{{ $t('Item Name') }}
                  <VIcon
                    :icon="sortColumn === 'itemName' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('itemName')"
                  />
                </span>
              </th>
              <th v-if="canVisibleUserPermission(statusPermission, 'COL_LOT_NUMBER').canVisible">
                <span style="font-weight: bold;">{{ $t('Lot') }}
                  <VIcon
                    :icon="sortColumn === 'lot' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('lot')"
                  />
                </span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_QTY_KG').canVisible"
                class="text-end px-2"
              >
                <span style="font-weight: bold;">{{ $t('Qty. (Kg.)') }}
                  <VIcon
                    :icon="sortColumn === 'quantity' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('quantity')"
                  />
                </span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_COA').canVisible"
                class="text-center"
              >
                <span style="font-weight: bold;">{{ $t('COA') }}</span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_FREIGHT_FORWARDER').canVisible"
                class="bg-green-lighten-3"
              >
                <span
                  style="font-weight: bold;"
                  class="text-black"
                >{{ $t('Freight forwarder') }}
                  <VIcon
                    :icon="sortColumn === 'freightForwarder' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('freightForwarder')"
                  />
                </span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_CARRIER').canVisible"
                class="bg-green-lighten-3 text-start"
                style="min-width: 150px;"
              >
                <span
                  style="min-width: 250px; font-weight: bold;"
                  class="text-start"
                >{{ $t('Carrier') }}
                  <VIcon
                    :icon="sortColumn === 'carrier' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('carrier')"
                  />
                </span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_VESSEL_NAME').canVisible"
                class="bg-green-lighten-3"
              >
                <span
                  style="font-weight: bold;"
                  class="text-black"
                >{{ $t('Vessel name') }}
                  <VIcon
                    :icon="sortColumn === 'vesselName' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('vesselName')"
                  />
                </span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_VOY').canVisible"
                class="bg-yellow-lighten-3"
              >
                <span
                  style="font-weight: bold;"
                  class="text-black"
                >{{ $t('Voy') }}
                  <VIcon
                    :icon="sortColumn === 'voy' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('voy')"
                  />
                </span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_TRUCK').canVisible"
                class="bg-green-lighten-3"
              >
                <span style="font-weight: bold;">{{ $t('Truck') }}
                  <VIcon
                    :icon="sortColumn === 'truck' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('truck')"
                  />
                </span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_TRUCK_RESERVING_NUMBER').canVisible"
                class="bg-yellow-lighten-3 texct-end"
              >
                <span style="font-weight: bold;">{{ $t('Truck Reserving Number') }}
                  <VIcon
                    :icon="sortColumn === 'truckReservingNumber' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('truckReservingNumber')"
                  />
                </span>
              </th>
              <th v-if="canVisibleUserPermission(statusPermission, 'COL_TRUCK_FEE').canVisible">
                <span style="font-weight: bold;">{{ $t('Truck fee') }}
                  <VIcon
                    :icon="sortColumn === 'truckFee' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('truckFee')"
                  />
                </span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_TRUCK_ORDER').canVisible"
                class="text-center"
              >
                <span style="padding-left: 1px; font-weight: bold;">{{ $t('Truck Order') }}</span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_DO_EX').canVisible"
                class="px-4"
              >
                <span style="font-weight: bold;">{{ $t('DO/EX') }}
                  <VIcon
                    :icon="sortColumn === 'doEx' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('doEx')"
                  />
                </span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_COUNTRY').canVisible"
                class="px-2"
              >
                <span style="font-weight: bold;">{{ $t('Country') }}
                  <VIcon
                    :icon="sortColumn === 'country' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('country')"
                  />
                </span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_LOADING_DATE').canVisible"
                class="text-start px-2"
              >
                <span style="font-weight: bold;">{{ $t('Loading date') }}
                  <VIcon
                    :icon="sortColumn === 'logUpdatedDate' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('logUpdatedDate')"
                  />
                </span>
              </th>
              <th v-if="canVisibleUserPermission(statusPermission, 'COL_ETD').canVisible">
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
              <th v-if="canVisibleUserPermission(statusPermission, 'COL_ETA').canVisible">
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
                v-if="canVisibleUserPermission(statusPermission, 'COL_DELIVERY_NOTE').canVisible"
                class="text-center"
              >
                <span style="font-weight: bold;">{{ $t('Delivery note') }}</span>
              </th>
              <th v-if="canVisibleUserPermission(statusPermission, 'COL_REMARK_SAL').canVisible">
                <span style="font-weight: bold;">{{ $t('Remark (SAL)') }}
                  <VIcon
                    :icon="sortColumn === 'saL_Remarks' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('saL_Remarks')"
                  />
                </span>
              </th>
              <th v-if="canVisibleUserPermission(statusPermission, 'COL_REMARK_WH').canVisible">
                <span style="font-weight: bold;">{{ $t('Remark (WH)') }}
                  <VIcon
                    :icon="sortColumn === 'wH_Remarks' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('wH_Remarks')"
                  />
                </span>
              </th>
              <th v-if="canVisibleUserPermission(statusPermission, 'COL_REMARK_LOG').canVisible">
                <span style="font-weight: bold;">{{ $t('Remark (LOG)') }}
                  <VIcon
                    :icon="sortColumn === 'loG_Remarks' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('loG_Remarks')"
                  />
                </span>
              </th>
              <th class="px-1">
                <span style="font-weight: bold;">{{ $t('Updated By') }}
                  <VIcon
                    :icon="sortColumn === 'updatedBy' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('updatedBy')"
                  />
                </span>
              </th>
              <th class="px-1">
                <span style="font-weight: bold;">{{ $t('Updated Date') }}
                  <VIcon
                    :icon="sortColumn === 'updatedDate' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('updatedDate')"
                  />
                </span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'BTN_SAVE_DRAFT').canVisible"
                class="text-center"
              >
                <span style="font-weight: bold;" />
              </th>
              <th class="text-center">
                <span style="font-weight: bold;">{{ $t('Action') }}</span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'BTN_SUBMIT').canVisible"
                class="text-center "
              >
                <span style="font-weight: bold;" />
              </th>
              <th class="sticky-action">
                <span style="font-weight: bold;">{{ $t('Action') }}</span>
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
                style="min-width: 60px;"
                class="sticky-columnBody cursor-pointer"
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
                  v-if="checkStatusBeforeAvtion(product.statusId) && userDataInfo.id === '00023' || checkStatusBeforeAvtion(product.statusId) && userDataInfo.id === '00025' || checkStatusBeforeAvtion(product.statusId) && canVisibleUserPermission(statusPermission, 'BTN_APPROVE').canVisible"
                  v-model="selectedDataTables"
                  :value="product"
                />
              </td>
              <td
                class="sticky-columnBody cursor-pointer"
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
                <span>{{ (currentPage - 1) * 10 + index + 1 }}</span>
              </td>
              <td
                class="sticky-columnBody cursor-pointer"
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
                <span style="font-size: 12px;">
                  <VChip
                    :color="colorStatusWithId(product.statusId).color"
                    :style="{ color: colorStatusWithId(product.statusId).color }"
                    style="font-size: 12px;"
                  >{{
                     product.statusText }}
                    <VTooltip
                      activator="parent"
                      location="right"
                      open-on-click
                    >
                      <p>{{ (product.csLfStatusText) }}</p>
                      <p v-if="false">{{ (product.inspStatusText) }}</p>
                      <p>{{ (product.salStatusText) }}</p>
                      <p>{{ (product.logStatusText) }}</p>
                      <p class="mb-0">{{ (product.whStatusText) }}</p>
                    </VTooltip>
                  </VChip>
                  <span v-if="false">{{ product.checkSheetTypeName }}</span>

                </span>
              </td>
              <!-- 👉 saleOrderNo -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_SALE_ORDER_NO').canVisible"
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
                v-if="canVisibleUserPermission(statusPermission, 'COL_SO_ATTACHMENT').canVisible"
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
                <VForm
                  ref="product"
                  :disabled="disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
                  @submit.prevent="submitShipmentPlanBySoEId('submit', product.soEtlLogDetailJournalID)"
                >
                  <div>
                    <FileInputDialogCarousels
                      :files-from-a-p-i="product.getSOFileData"
                      title-dialog="SO Attachment"
                      :disabled-prop="!canVisibleUserPermission(statusPermission, 'COL_SO_ATTACHMENT').canExecute || disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
                      :type-file-input="typeFileInput"
                      file-name="So Attachment"
                      @updateFiles="handleFileUpdatesSO"
                    />
                  </div>
                </VForm>
              </td>

              <!-- 👉 PO No -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_SO_ATTACHMENT').canVisible"
                class="text-start px-3 cursor-pointer"
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
                {{ product.poNo }}
              </td>

              <!-- 👉 PO Attachment -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_SO_ATTACHMENT').canVisible"
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
                <VForm
                  ref="product"
                  :disabled="disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
                  @submit.prevent="submitShipmentPlanBySoEId('submit', product.soEtlLogDetailJournalID)"
                >
                  <div>
                    <FileInputDialogCarousels
                      :files-from-a-p-i="product.getPOFileData"
                      title-dialog="PO Attachment"
                      :disabled-prop="!canVisibleUserPermission(statusPermission, 'COL_SO_ATTACHMENT').canExecute || disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
                      :type-file-input="typeFileInput"
                      file-name="Po Attachment"
                      @updateFiles="handleFileUpdatesPO"
                    />
                  </div>
                </VForm>
              </td>

              <!-- 👉 sapInvoiceNo -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_SAP_INVOICE_NO').canVisible"
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
                v-if="canVisibleUserPermission(statusPermission, 'COL_PAYER_NAME').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 220px; font-size: 12px;"
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
                v-if="canVisibleUserPermission(statusPermission, 'COL_USER').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 220px; font-size: 12px;"
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
                <span class="d-felx align-start">{{ (product.shippingUserName) }}</span>
              </td>
              <!-- 👉 shipper -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_SHIPPER').canVisible"
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
                {{ (product.shipperName) }}
              </td>
              <!-- 👉 shipperLocation -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_SHIPPER_LOCATION').canVisible"
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
                v-if="canVisibleUserPermission(statusPermission, 'COL_SHIPPING_MARK').canVisible"
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
                    style="min-width: 160px; max-width: 160px;"
                    variant="outlined"
                    :color="product.shipperConditions ? 'primary' : 'grey'"
                    @click="textAreaShipDialogActive2('ShipMC', product.shipperMark,
                                                      product.shipperConditions, index, product.soEtlLogDetailJournalID,
                                                      product.shippingMarkActive, product,
                                                      disabledStatus(product.inspStatusId,
                                                                     product.logStatusId, product.salStatusId,
                                                                     product.whStatusId, product),
                                                      canVisibleUserPermission(statusPermission, 'COL_SHIPPING_MARK').canExecute)"
                  >
                    <span
                      v-if="product.shipperConditions"
                      style="overflow: hidden; min-width: 100px; max-width: 150px; font-size: 12px; text-overflow: ellipsis;"
                    >{{
                      product.shipperConditions }}</span>
                    <span
                      v-else
                      style="font-size: 12px;"
                    >Shipping Mark/ConD</span>
                  </VBtn>
                </div>
              </td>

              <!-- 👉 endUser -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_END_USER').canVisible"
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
                  class="text-field"
                  :disabled="!canVisibleUserPermission(statusPermission, 'COL_END_USER').canExecute || disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
                  style=" min-width: 150px; font-size: 12px !important;"
                >
                  <template #label>
                    <span style="font-size: 12px;">End User</span>
                  </template>
                </VTextField>
                <VTooltip
                  v-if="product.shippingEndUser"
                  activator="parent"
                  location="end"
                  open-on-click
                >
                  {{ product.shippingEndUser }}
                </VTooltip>
              </td>

              <!-- 👉 consignee -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_CONSIGNEE').canVisible"
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
                v-if="canVisibleUserPermission(statusPermission, 'COL_PRODUCT').canVisible"
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
                v-if="canVisibleUserPermission(statusPermission, 'COL_LOT_NUMBER').canVisible"
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
                  style="min-width: 150px; max-width: 150px;"
                  variant="outlined"
                  :color="product.lot ? 'primary' : 'grey'"
                  @click="textAreaRemarkDialogActive('Lot', product.lot, product.soEtlLogDetailJournalID,
                                                     disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product),
                                                     canVisibleUserPermission(statusPermission, 'COL_LOT_NUMBER').canExecute)"
                >
                  <span
                    v-if="product.lot"
                    style="overflow: hidden; max-width: 130px; font-size: 12px; text-overflow: ellipsis;"
                  >{{ product.lot
                  }}</span>
                  <span
                    v-else
                    style="font-size: 12px;"
                  >Lot</span>
                </VBtn>
              </td>

              <!-- 👉 qty -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_QTY_KG').canVisible"
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
                class="text-end px-2 cursor-pointer"
                style="min-width: 120px; font-size: 12px;"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                {{ formatNumber(product.quantity) }}
              </td>

              <!-- 👉 coa -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_COA').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 100px; font-size: 12px;"
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
                    :disabled-prop="!canVisibleUserPermission(statusPermission, 'COL_COA').canExecute || disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
                    :type-file-input="typeFileInput"
                    :files-from-a-p-i="product.getCOAFileData"
                    file-name="COA"
                    @updateFiles="handleFileUpdatesCOA"
                  />
                </div>
              </td>

              <!-- 👉 Freight Forwarder -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_FREIGHT_FORWARDER').canVisible"
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
                <VAutocomplete
                  v-model="product.freightForwarder"
                  :disabled="!canVisibleUserPermission(statusPermission, 'COL_FREIGHT_FORWARDER').canExecute || disabledStatusWithOutAdminUser(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId) || disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
                  :items="freightForwarderModel"
                  item-title="freightForwarder"
                  item-value="freightForwarder"
                  class="truncate-select my-1"
                  density="compact"
                  dense
                >
                  <template #selection="{ item }">
                    <div
                      class="truncate-select"
                      style="min-width: 150px;"
                    >
                      {{ item.title }}
                    </div>
                  </template>
                </VAutocomplete>
                <VTooltip
                  v-if="product.freightForwarder"
                  activator="parent"
                  location="end"
                  open-on-click
                >
                  {{ product.freightForwarder }}
                </VTooltip>
              </td>

              <!-- 👉 carrier -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_CARRIER').canVisible"
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
                <VAutocomplete
                  v-model="product.carrier"
                  :disabled="!canVisibleUserPermission(statusPermission, 'COL_CARRIER').canExecute || disabledStatusWithOutAdminUser(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId) || disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
                  :items="carrierModel"
                  class="truncate-select"
                  item-title="carrier"
                  item-value="carrier"
                  density="compact"
                  dense
                >
                  <template #selection="{ item }">
                    <div
                      class="truncate-select"
                      style="min-width: 150px;"
                    >
                      {{ item.title }}
                    </div>
                  </template>
                </VAutocomplete>
                <VTooltip
                  v-if="product.carrier"
                  activator="parent"
                  location="end"
                  open-on-click
                >
                  {{ product.carrier }}
                </VTooltip>
              </td>

              <!-- 👉 vesselName -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_VESSEL_NAME').canVisible"
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
                <VAutocomplete
                  v-model="product.vesselName"
                  class="truncate-select"
                  :items="vesselsModel"
                  item-title="carrier"
                  item-value="carrier"
                  :disabled="!canVisibleUserPermission(statusPermission, 'COL_VESSEL_NAME').canExecute || disabledStatusWithOutAdminUser(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId) || disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
                  density="compact"
                  dense
                >
                  <template #selection="{ item }">
                    <div
                      class="truncate-select"
                      style="min-width: 150px;"
                    >
                      {{ item.title }}
                    </div>
                  </template>
                </VAutocomplete>
                <VTooltip
                  v-if="product.vesselName"
                  activator="parent"
                  location="end"
                  open-on-click
                >
                  {{ product.vesselName }}
                </VTooltip>
              </td>

              <!-- 👉 voy -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_VOY').canVisible"
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
                  :disabled="!canVisibleUserPermission(statusPermission, 'COL_VOY').canExecute || disabledStatusWithOutAdminUser(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId) || disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
                  density="compact"
                  style=" min-width: 150px;"
                />
                <VTooltip
                  v-if="product.voy"
                  activator="parent"
                  location="end"
                  open-on-click
                >
                  {{ product.voy }}
                </VTooltip>
              </td>

              <!-- 👉 COL_TRUCK -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_TRUCK').canVisible"
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
                    <VAutocomplete
                      v-model="product.truck"
                      :items="truckModel"
                      :menu-props="{ top: true, offsetY: true }"
                      item-title="truck"
                      class="truncate-select"
                      item-value="truck"
                      :disabled="!canVisibleUserPermission(statusPermission, 'COL_TRUCK').canExecute || disabledStatusWithOutAdminUser(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId) || disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
                      density="compact"
                      dense
                    >
                      <template #selection="{ item }">
                        <div
                          class="truncate-select"
                          style="min-width: 150px;"
                        >
                          {{ item.title }}
                        </div>
                      </template>
                    </VAutocomplete>
                  </VCol>
                </VRow>
                <VTooltip
                  v-if="product.truck"
                  activator="parent"
                  location="end"
                  open-on-click
                >
                  {{ product.truck }}
                </VTooltip>
              </td>

              <!-- 👉 truckReserving -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_TRUCK_RESERVING_NUMBER').canVisible"
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
                  :disabled="!canVisibleUserPermission(statusPermission, 'COL_TRUCK_RESERVING_NUMBER').canExecute || disabledStatusWithOutAdminUser(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId) || disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
                  style=" min-width: 150px;"
                />
                <VTooltip
                  v-if="product.truckReservingNumber"
                  activator="parent"
                  location="end"
                  open-on-click
                >
                  {{ product.truckReservingNumber }}
                </VTooltip>
              </td>

              <!-- 👉 truckFee -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_TRUCK_FEE').canVisible"
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
                  :disabled="!canVisibleUserPermission(statusPermission, 'COL_TRUCK_FEE').canExecute || disabledStatusWithOutAdminUser(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId) || disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
                  density="compact"
                  style=" min-width: 150px;"
                />
                <VTooltip
                  v-if="product.truckFee"
                  activator="parent"
                  location="end"
                  open-on-click
                >
                  {{ product.truckFee }}
                </VTooltip>
              </td>

              <!-- 👉 truckOrder -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_TRUCK_ORDER').canVisible"
                class="text-start px-2 cursor-pointer"
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
                <VRow>
                  <VCol cols="6">
                    <VBtn
                      color="warning"
                      class="mx-2"
                      @click="showDialogTruckOrder(product.salesOrderNo, product.soEtlLogDetailJournalID, product)"
                    >
                      <VIcon
                        size="30"
                        icon="ri-pencil-line"
                      />
                    </VBtn>
                  </VCol>
                  <VCol
                    style="width: 50px;"
                    cols="6"
                  >
                    <FileInputDialogCarousels
                      title-dialog="Truck Order"
                      :disabled-prop="!canVisibleUserPermission(statusPermission, 'COL_TRUCK_ORDER').canExecute || disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
                      :type-file-input="typeFileInput"
                      file-name="Truck Order"
                      :files-from-a-p-i="product.getTruckOrderFileData"
                      @updateFiles="handleFileUpdatesTruckOrder"
                    />
                  </VCol>
                </VRow>
              </td>

              <!-- 👉 doEx -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_DO_EX').canVisible"
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
                v-if="canVisibleUserPermission(statusPermission, 'COL_COUNTRY').canVisible"
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
                v-if="canVisibleUserPermission(statusPermission, 'COL_LOADING_DATE').canVisible"
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
                <AppDateTimePicker
                  v-if="canVisibleUserPermission(statusPermission, 'COL_LOADING_DATE').canExecute &&
                    !disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product) &&
                    !disabledStatusWithOutAdminUser(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId)"
                  v-model="product.logUpdatedDate"
                  density="compact"
                  prepend-inner-icon="ri-calendar-schedule-fill"
                  :config="{ dateFormat: 'd/m/Y' }"
                />
                <span v-else>{{ (product.logUpdatedDate) }}</span>
              </td>

              <!-- 👉 etd -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_ETD').canVisible"
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
                  v-if="canVisibleUserPermission(statusPermission, 'COL_ETD').canExecute && !disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product) && !disabledStatusWithOutAdminUser(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId)"
                  v-model="product.etd"
                  density="compact"
                  prepend-inner-icon="ri-calendar-schedule-fill"
                  :config="{ dateFormat: 'd/m/Y' }"
                />
                <span v-else>{{ (product.etd) }}</span>
              </td>

              <!-- 👉 eta -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_ETA').canVisible"
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
                  v-if="canVisibleUserPermission(statusPermission, 'COL_ETA').canExecute && !disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product) && !disabledStatusWithOutAdminUser(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId)"
                  v-model="product.eta"
                  disabeld
                  density="compact"
                  prepend-inner-icon="ri-calendar-schedule-fill"
                  :config="{ dateFormat: 'd/m/Y' }"
                />
                <span v-else>{{ (product.eta) }}</span>
              </td>

              <!-- 👉 deliveryNote -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_DELIVERY_NOTE').canVisible"
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
                <div>
                  <FileInputDialogCarousels
                    title-dialog="Delivery Note"
                    :disabled-prop="!canVisibleUserPermission(statusPermission, 'COL_DELIVERY_NOTE').canExecute || disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
                    :type-file-input="typeFileInput"
                    :files-from-a-p-i="product.getDeliveryNoteFileData"
                    file-name="Delivery Note"
                    @updateFiles="handleFileUpdatesDeliNote"
                  />
                </div>
              </td>

              <!-- 👉 remarkSAL -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_REMARK_SAL').canVisible"
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
                  style="min-width: 150px; max-width: 150px;"
                  variant="outlined"
                  :color="product.saL_Remarks ? 'primary' : 'grey'"
                  @click="textAreaRemarkDialogActive('Remark SAL', product.saL_Remarks, product.soEtlLogDetailJournalID,
                                                     disabledStatusWithOutAdminUser(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId),
                                                     canVisibleUserPermission(statusPermission, 'COL_REMARK_SAL').canExecute)"
                >
                  <span
                    v-if="product.saL_Remarks"
                    style="overflow: hidden; max-width: 130px; font-size: 12px; text-overflow: ellipsis;"
                  >{{
                    product.saL_Remarks }}</span>
                  <span
                    v-else
                    style="font-size: 12px;"
                  >remark(SAL)</span>
                </VBtn>
              </td>

              <!-- 👉 remarkWH -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_REMARK_WH').canVisible"
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
                  variant="outlined"
                  :color="product.wH_Remarks ? 'primary' : 'grey'"
                  @click="textAreaRemarkDialogActive('Remark WH', product.wH_Remarks, product.soEtlLogDetailJournalID,
                                                     disabledStatusWithOutAdminUser(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId),
                                                     canVisibleUserPermission(statusPermission, 'COL_REMARK_WH').canExecute)"
                >
                  <span
                    v-if="product.wH_Remarks"
                    style="overflow: hidden; max-width: 130px; font-size: 12px; text-overflow: ellipsis;"
                  >{{
                    product.wH_Remarks }}</span>
                  <span
                    v-else
                    style="font-size: 12px;"
                  >remark(WH)</span>
                </VBtn>
              </td>

              <!-- 👉 remarkLOG -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_REMARK_LOG').canVisible"
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
                  style="min-width: 150px; max-width: 150px;"
                  variant="outlined"
                  :color="product.loG_Remarks ? 'primary' : 'grey'"
                  @click="textAreaRemarkDialogActive('Remark LOG', product.loG_Remarks, product.soEtlLogDetailJournalID,
                                                     disabledStatusWithOutAdminUser(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId),
                                                     canVisibleUserPermission(statusPermission, 'COL_REMARK_LOG').canExecute)"
                >
                  <span
                    v-if="product.loG_Remarks"
                    style="overflow: hidden; max-width: 130px; font-size: 12px; text-overflow: ellipsis;"
                  >{{
                    product.loG_Remarks }}</span>
                  <span
                    v-else
                    style="font-size: 12px;"
                  >remark(LOG)</span>
                </VBtn>
              </td>

              <!-- 👉 update by -->
              <td
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
                class="text-start px-1 cursor-pointer"
                style="min-width: 130px; font-size: 12px;"
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
                v-if="canVisibleUserPermission(statusPermission, 'BTN_SAVE_DRAFT').canVisible"
                style="width: 150px; font-size: 12px;"
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
                  :disabled="disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product) ||
                    !canVisibleUserPermission(statusPermission, 'BTN_SAVE_DRAFT').canVisible"
                  :color="accountINSP ? 'grey' : 'warning'"
                  @click="saveShipmentPlan(product), saveDraftLoading = true"
                >
                  <span
                    v-if="saveDraftLoading && product.soEtlLogDetailJournalID === saveDraftLoadingSOERow"
                    style="font-size: 12px;"
                  >
                    <VProgressCircular
                      :size="30"
                      color="primary"
                      indeterminate
                    />
                  </span>
                  <span
                    v-else
                    style="font-size: 12px;"
                  >Save Draft</span>
                </VBtn>
              </td>
              <td
                v-if="canVisibleUserPermission(statusPermission, 'BTN_SUBMIT').canVisible"
                style="width: 150px; font-size: 12px;"
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
                class="text-center px-1"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                <VBtn
                  :disabled="disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)
                    || !canVisibleUserPermission(statusPermission, 'BTN_SUBMIT').canVisible || disabledStatusWithOutAdminUser(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId)"
                  class="mx-2"
                  :color="accountINSP ? 'grey' : 'primary'"
                  @Click="openConfirmDialog('submit', product.soEtlLogDetailJournalID, product), submitLoading = true"
                >
                  <span
                    v-if="submitLoading && product.soEtlLogDetailJournalID === submitLoadingSOERow"
                    style="font-size: 12px;"
                  >
                    <VProgressCircular
                      :size="30"
                      color="primary"
                      indeterminate
                    />
                  </span>
                  <span
                    v-else
                    style="font-size: 12px;"
                  >Submit </span>
                </VBtn>
              </td>
              <td
                v-if="accountWHSub"
                style="max-width: 130px; font-size: 12px;"
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
                  width="100%"
                  :color="accountINSP ? 'grey' : 'primary'"
                >
                  <span style="font-size: 12px;">Approve</span>
                </VBtn>
              </td>
              <td
                style="max-width: 150px; font-size: 12px;"
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
                  :color="accountINSP ? 'grey' : 'pink-lighten-2'"
                  @click="actionBtn(product)"
                >
                  <span style="font-size: 12px;">Action</span>
                </VBtn>
              </td>

              <td
                style="max-width: 150px; font-size: 12px;"
                class="text-center px-1 sticky-action"
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
                <VBtn color="primary">
                  <VIcon icon="ri-menu-line" />
                  <VMenu activator="parent">
                    <VList>
                      <VListItem
                        key="1"
                        value="1"
                      >
                        <VBtn
                          :color="accountINSP ? 'grey' : 'pink-lighten-2'"
                          @click="actionBtn(product)"
                        >
                          <span style="font-size: 12px;">Action</span>
                        </VBtn>
                      </VListItem>
                      <VListItem
                        v-if="canVisibleUserPermission(statusPermission, 'BTN_SAVE_DRAFT').canVisible"
                        key="2"
                        value="1"
                      >
                        <VBtn
                          :disabled="disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product) ||
                            !canVisibleUserPermission(statusPermission, 'BTN_SAVE_DRAFT').canVisible"
                          :color="accountINSP ? 'grey' : 'warning'"
                          @click="saveShipmentPlan(product), saveDraftLoading = true"
                        >
                          <span
                            v-if="saveDraftLoading && product.soEtlLogDetailJournalID === saveDraftLoadingSOERow"
                            style="font-size: 12px;"
                          >
                            <VProgressCircular
                              :size="30"
                              color="primary"
                              indeterminate
                            />
                          </span>
                          <span
                            v-else
                            style="font-size: 12px;"
                          >Save Draft</span>
                        </VBtn>
                      </VListItem>
                      <VListItem
                        v-if="canVisibleUserPermission(statusPermission, 'BTN_SUBMIT').canVisible"
                        key="3"
                        value="1"
                      >
                        <VBtn
                          :disabled="disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)
                            || !canVisibleUserPermission(statusPermission, 'BTN_SUBMIT').canVisible || disabledStatusWithOutAdminUser(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId)"
                          class="mx-2"
                          :color="accountINSP ? 'grey' : 'primary'"
                          @Click="openConfirmDialog('submit', product.soEtlLogDetailJournalID, product), submitLoading = true"
                        >
                          <span
                            v-if="submitLoading && product.soEtlLogDetailJournalID === submitLoadingSOERow"
                            style="font-size: 12px;"
                          >
                            <VProgressCircular
                              :size="30"
                              color="primary"
                              indeterminate
                            />
                          </span>
                          <span
                            v-else
                            style="font-size: 12px;"
                          >Submit </span>
                        </VBtn>
                      </VListItem>
                      <VListItem
                        key="4"
                        value="1"
                      >
                        <VListItemTitle>1</VListItemTitle>
                      </VListItem>
                    </VList>
                  </VMenu>
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
    </VCard>
  </section>

  <section v-else>
    <VProgressLinear
      height="20"
      color="secondary"
      class="elevation-1"
    >
      <span>No Data....</span>
    </VProgressLinear>
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
          (Demo) Shipment - Version : 2.1 - Data 24 Row
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

    <div>
      <!-- ใช้ confirmDialog component -->
      <ConfirmDialog2
        ref="confirmDialog2"
        :message="wordForSubmit"
        @confirm="handleConfirmAction"
        @cancel="handleCancel"
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
                  :readonly="disabledModel"
                  rows="7"
                  counter
                  class="text-center"
                  outlined
                />
                <VCheckbox
                  v-model="activeShipMarkModel"
                  :disabled="disabledModel"
                  label="Shipping Mark Active"
                />
              </VCol>
              <VCol cols="6">
                <VTextarea
                  v-model="dialogData2TextArea"
                  :readonly="disabledModel"
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
                  @click="printShipmentPDFBySoEId('ShipperMarkLabel')"
                >
                  <VIcon icon="ri-printer-fill" />Print
                </VBtn>
              </VCol>
              <VCol
                cols="6"
                class="d-flex justify-center"
              >
                <VBtn
                  variant="flat"
                  color="warning"
                  @click="printShipmentPDFBySoEId('ShipperConditionLabel')"
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
              :readonly="disabledModel"
              auto-grow
              rows="7"
              counter
              class="text-center"
              outlined
            />
          </VCardText>
        </VCard>
      </VDialog>
    </div>

    <!-- comment reject  -->
    <!-- dialogcomment -->
    <div>
      <VDialog
        v-model="isDialogVisibleCommentDialog"
        persistent
        class="v-dialog-sm"
      >
        <!-- Dialog Content -->
        <VCard title="Comment">
          <DialogCloseBtn
            variant="text"
            size="default"
            @click="isDialogVisibleCommentDialog = false"
          />

          <VCardText>
            <VTextarea
              v-model="statusCommnetValue"
              counter
              placeholder="Enter Commnet"
            />
          </VCardText>

          <VCardText class="d-flex justify-end flex-wrap gap-4">
            <VBtn
              color="error"
              @click="isDialogVisibleCommentDialog = false, submitShipmentPlanBySoEId('reject', '101')"
            >
              Reject
            </VBtn>
          </VCardText>
        </VCard>
      </VDialog>
    </div>
  </section>

  <!-- ใช้ AuthenticatorDialog Component -->
  <div>
    <AlertWord2
      v-model="isDialogVisibleAlertDialog"
      :word="wordForSubmit"
      :subword="subWordForSubmit"
      :success="successDialAlert"
    />
  </div>

  <!-- action Dialog Component -->
  <div>
    <VDialog
      v-model="actionIsDialogVisible"
      persistent
      style="max-width: 405px;"
      class="v-dialog-sm d-flex justify-center"
    >
      <!-- Dialog Content -->
      <VCard
        class="text-center"
        title="Checksheet"
        style="min-height: 160px;"
      >
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="actionIsDialogVisible = false"
        />

        <VCardText>
          <VRow>
            <VCol
              cols="6"
              style="min-width: 170px; max-width: 170px;"
            >
              <VBtn
                :disabled="didabledPrintPDFCheckSheet(prouctRowAction.csLfStatusId)"
                color="warning"
                style="min-width: 150px; max-width: 150px; height: 160px;"
                @click="hanbleBtnPrintPDFCheckSheet('test')"
              >
                <VRow>
                  <VCol cols="12">
                    <VIcon
                      v-if="!loadingPrint"
                      size="60"
                      icon="ri-printer-fill"
                    />
                    <VProgressCircular
                      v-if="loadingPrint"
                      :size="80"
                      color="primary"
                      indeterminate
                    >
                      <VIcon
                        size="60"
                        icon="ri-printer-fill"
                      />
                    </VProgressCircular>
                  </VCol>
                  <VCol cols="12">
                    <span>Print</span>
                  </VCol>
                </VRow>
              </VBtn>
            </VCol>
            <VCol
              cols="6"
              style="min-width: 170px; max-width: 170px;"
            >
              <VBtn
                style="min-width: 150px; max-width: 150px; height: 160px;"
                color="info"
                @click="redirectBasedOnStatus(prouctRowAction)"
              >
                <VRow>
                  <VCol cols="12">
                    <VIcon
                      size="60"
                      icon="ri-article-fill"
                    />
                  </VCol>
                  <VCol cols="12">
                    <span>Check Sheet</span>
                  </VCol>
                </VRow>
              </VBtn>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VDialog>
  </div>

  <VBtn
    v-if="false"
    @click=" isDialogLoadingVisible = true"
  >
    asdM
  </VBtn>

  <!-- Dialog -->
  <VDialog
    v-model="isDialogLoadingVisible"
    width="700"
  >
    <DialogCloseBtn
      variant="text"
      size="default"
      @click="isDialogLoadingVisible = false"
    />
    <VCard width="700">
      <VCardText class="d-flex justify-center">
        <VProgressCircular
          :size="150"
          :width="10"
          color="primary"
          indeterminate
        >
          <VIcon
            size="100"
            color="primary"
            icon="ri-printer-fill"
          />
        </VProgressCircular>
      </VCardText>

      <VCardText class="d-flex justify-center text-center pb-1">
        <div>
          <span style="font-size: 22px; font-weight: bolder;">{{ wordLoading }}!</span>
        </div>
      </VCardText>
    </VCard>
  </VDialog>
  <div />
</template>

<style scoped lang="scss" src="./indexTIE.scss"></style>
