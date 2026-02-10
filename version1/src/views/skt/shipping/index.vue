<script setup>
import { urlApi } from '@/api' //---------------------- Import Api for Url *****

const whereHouse = localStorage.getItem('whereHouseName')
const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')

// Import Composable
import { useItemStore } from '@/stores/skt/receingFormStore/itemStore'
import { useStatusAndPermissions } from './tableInvoice/composables/useStatusAndPermissions'
import { useTruckOrder } from './composables/useTruckOrder'

// Import Component
import ShipmentPlanFilter from './components/header/ShipmentPlanFilter.vue'
import ShippingMarkDialog from './components/dialog/ShippingMarkDialog.vue'
import TruckOrderDialog from './components/dialog/truckOrderDialog/truckOrderDialog.vue'

// Import Utils
import { 
  isDraftDisabled, 
  isDraftLoading, 
  isSubmitDisabled, 
  isSubmitLoading,
  disabledStatus,
  disabledStatusSaveDraft,
  checkStatusInComplete,
  disableShowDataByDepartment,
  checkStatusBeforeAvtion,
  checkBgTruck,
} from './utils/validators'

//import formatters
import {
  formatDate,
  formatDateSave,
  convertDateFormat,
} from './utils/formatters'

//import dataConstant
import {
  itemsStatus,
} from './utils/dataConstant'

//import status
import {
  colorStatusWithId,
} from './utils/status'

const itemStore = useItemStore()
const userDataInfo = ref(itemStore.getItemDetails('UserDataCookies'))
const department = ref(userDataInfo.value.departmentName)

const { checkIfForBtnDeleteSOE } = useStatusAndPermissions()

// Initialize composable
const {
  isDialogVisible: isDialogVisiblePrintTruck,
  currentSaleOrderNo: saleOrderNo,
  currentDataRow: dataRowModel,
  existingTruckData,
  showDialog: showDialogTruckOrder,
  closeDialog: closeDialogTruckOrder,
  saveTruckOrderData,
  printTruckOrderDocument,
  restoreFromSession,
} = useTruckOrder(urlApi, whereHouse, accessTokenAtStore)

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
const checkConfirmBottonActive = ref(false)
const checkCancelBottonActive = ref(false)
const rowData = ref(null)

const resetValueInCheckBottonConfirm = () => {
  checkConfirmBottonActive.value = false
  checkCancelBottonActive.value = false
}

const confirmSapIn = async () => {
  if(typeSap.value === "save draft"){
    saveShipmentPlan(dataRowDailog.value)
  }else if(typeSap.value === "submit"){
    openConfirmDialog(typeSap.value, soEIdSap.value, dataRowDailog.value)
  }

  isDialogSapInV.value = false
}

const handleOpenConfirmDialogWrapSapInV = async (type, SoEId, productRow) => {
  dataRowDailog.value = productRow
  typeSap.value = type
  soEIdSap.value = SoEId

  const resultSap = await searchShipmentPlanSapInV(productRow)

  if(!resultSap || getSearchPlanSapInVResult.value?.datas.length < 1 ){
    
    openConfirmDialog(type, SoEId, productRow)

  
  }else if( getSearchPlanSapInVResult.value?.datas.length > 0){
    isDialogSapInV.value = true
  }
}

const openConfirmDialog = async (type, SoEId, productRow) => {
  productRowModel.value = productRow

  resetValueInCheckBottonConfirm()

  // เรียกใช้ฟังก์ชัน openDialog ที่เปิดเผยจาก ConfirmDialog.vue
  if (type === 'submit') {
    wordForSubmit.value = type
    typeConfirmDialog.value = type
    soEIdConfirmDialog.value = SoEId

  } else if (type === 'back') {
    wordForSubmit.value = "SEND BACK"
    typeConfirmDialog.value = type
    soEIdConfirmDialog.value = SoEId
  }else if (type === 'delete') {
    wordForSubmit.value = "DELETE SO Sale Order No: "+productRowModel.value.salesOrderNo
    typeConfirmDialog.value = type
    soEIdConfirmDialog.value = SoEId
  }else if (type === 'check sap invoice no') {
    rowData.value = productRow
    wordForSubmit.value = "Confirm sap invoice no"
    typeConfirmDialog.value = type
    soEIdConfirmDialog.value = SoEId
  }

  // console.log("select deta", selectedDataTables.value[0].soEtlLogDetailJournalID)
  confirmDialog2.value.openDialog()
}

function handleConfirmAction() {
  
  if (wordForSubmit.value === 'submit') {
    submitShipmentPlanBySoEId(typeConfirmDialog.value, soEIdConfirmDialog.value)
  } else if (wordForSubmit.value === 'SEND BACK') {
    submitShipmentPlanBySoEId('back', soEIdConfirmDialog.value)

  }else if (typeConfirmDialog.value === 'delete') {
    submitShipmentPlanBySoEId(typeConfirmDialog.value, soEIdConfirmDialog.value)

  }else if(wordForSubmit.value === 'Confirm sap invoice no'){
    saveShipmentPlan(rowData.value)
  }
  checkConfirmBottonActive.value = true
}

function handleCancel() {
  checkCancelBottonActive.value = true
}

//------------------------------ Formate --------------------------------------

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
  useGetSearchPlanSapinvoicenoIsexistService,
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

const userData = ref(null)

watch(() => {
  const storedData = sessionStorage.getItem('userData')
  if (storedData) {
    userData.value = JSON.parse(storedData)
  }
})

/// ------------------------------ Import Component --------------------------------
// --- Dialog Text Area --------------------------------

import TextAreaDialog from '@/components/dialogs/alert/textAreaDialog.vue' //--------- import component

const dialogDataTextArea = ref('')
const dialogData2TextArea = ref('')
const dialogVisible = ref(false)
const dialogVisibleTextarea = ref(false)
const dialogRemark = ref('')

// --- define Model

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

}

//------------------------------- Function Get Search plan -----------------

const { getSearchPlanResult, errorGetSearchPlan, fetchSearchPlan } = useGetSearchPlanService()

const { getSearchPlanSapInVResult, 
  errorGetSearchPlanSapInV, 
  fetchSearchPlanSapInV } = useGetSearchPlanSapinvoicenoIsexistService()

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

  return searchPlanData.value.slice(start, end)

})

const sortColumn = ref('')
const sortDirection = ref('')

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
        })),
      )
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

    if (deleteFileFormResult.value?.success) {

      setTimeout(() => {
        // location.reload()
      }, 500) // 0.5 วินาที

      return true
    } else {
      console.error(`Error saving File plan:`, errorMessageDeleteFileForm.value)

      return false
    }
  } catch (error) {
    console.error(`Error saving File plan:`, error)

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

  try {
    const requestData = file

    const response = await functionSaveFileForm(
      requestData,
      soEtlLogDetailJournalID,
      typeFile,
      urlApi.value,
      whereHouse,
      accessTokenAtStore,
    )


    if (resultSaveFielForm.value?.success) {
      if (disabledModel.value) {
      } else {
        if (trikerSaveDrft.value === false) {
          textAlertDialogFunction(alertWordConst.saveDraft, true)
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
  poNo: getOrDefault(data.poNo),
  sapInvoiceNo: getOrDefault(data.sapInvoiceNo),
  shipperMark: getOrDefault(data.shipperMark, ""),
  shipperConditions: getOrDefault(data.shipperConditions, ""),
  shippingEndUser: getOrDefault(data.shippingEndUser, ""),
  shipperLocation: getOrDefault(data.shipperLocation, ""),
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
const isDialogSapInV = ref(false)
const dataRowDailog = ref(null)
const typeSap = ref(null)
const soEIdSap = ref(null)

const searchShipmentPlanSapInV = async row => {
  try {
    const result = await fetchSearchPlanSapInV(
      urlApi.value,
      'sapinvoiceno/isexist',
      whereHouse,
      accessTokenAtStore,
      row.soEtlLogDetailJournalID,
      row.sapInvoiceNo,
    )

    if (result && getSearchPlanSapInVResult.value.datas) {


      return result

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

const handleSaveRowShipmentPlan = async (row, type) => {
  dataRowDailog.value = row
  typeSap.value = type

  const resultSap = await searchShipmentPlanSapInV(row)

  if(!resultSap || getSearchPlanSapInVResult.value?.datas.length < 1 ){
    saveShipmentPlan(row)

    return
  }

  isDialogSapInV.value = true

}

const handleFilterSap = (SOEI, ETD) => {
  // localStorage.setItem('ETDSearchProductionFilter', ETD)
  // localStorage.setItem('SalesOrderNoSearchProductionFilter', SOEI)

  etdDateModel.value = ETD
  filterForSearchPlan.value.SalesOrderNoSearch = SOEI
  isDialogSapInV.value = false

  searchShipmentPlan()
}


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
  } else {
    //console.log("File not foand", filesFromUploaderSO.value)
  }


  if (row.statusId === 207) {
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
  }

  saveDraftLoading.value = false
}

//------------------------------------- Function Submit shipment plan --------------------------------------

const isDialogVisibleCommentDialog = ref(false)
const statusCommnetValue = ref('')

const { submitShipmentPlanResult, errorSubmitShipmentPlan, submitShipmentPlan } = useSubmitShipmentPlanService()

const submitLoading = ref(false)
const submitLoadingSOERow = ref('')

// eslint-disable-next-line sonarjs/cognitive-complexity
const submitShipmentPlanBySoEId = async (type, soEtlLogDetailJournalID) => {
  trikerSaveDrft.value = true
  submitLoadingSOERow.value = soEtlLogDetailJournalID || '0'

  if (type !== 'approve' && type !== 'reject' && type !== 'back' && type !== 'delete') {

    const saveDraftRes = await saveShipmentPlan(productRowModel.value)
    if (!saveDraftRes) {
      textAlertDialogFunction(alertWordConst.saveDraft, false)
      throw new Error('saveDraftRes failed: ' + saveDraftRes)
    }
  }

  try {
    if (type === 'submit') {

    } else if (type === 'approve' || type === 'reject') {
      soEtlLogDetailJournalID = selectedDataTables.value.map(item => item.soEtlLogDetailJournalID)

    } else if (type === 'back' ) {
      soEtlLogDetailJournalID = selectedDataTables.value.map(item => item.soEtlLogDetailJournalID)

    } 

    if (!statusCommnetValue.value && type === 'reject') {
      textAlertDialogFunction('Please enter Reject Comment.', false)

      return
    }


    const result = await submitShipmentPlan(urlApi.value,
      type,
      whereHouse,
      accessTokenAtStore,
      soEtlLogDetailJournalID,
      statusCommnetValue.value,
    )

    if (result) {
      console.log("result", result)
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
      }else if (type === 'delete') {
        if(errorSubmitShipmentPlan.value){
          textAlertDialogFunction(alertWordConst.delete, false)
          setTimeout(() => {
            location.reload()
          }, 500) // 10000 มิลลิวินาที = 10 วินาที
        }else{
          textAlertDialogFunction(alertWordConst.delete, true)
          setTimeout(() => {
            location.reload()
          }, 500) // 10000 มิลลิวินาที = 10 วินาที
        }
        
      }

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
      } else if (type === 'delete') {
        console.log("errorSubmitShipmentPlan.value", errorSubmitShipmentPlan.value)
        textAlertDialogFunction(errorSubmitShipmentPlan.value, false)
        setTimeout(() => {
          // location.reload()
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

//-------------------------- format decimal -------------------

import { useGetCOAFormController } from '@/utilities/format'

const { formatNumber } = useGetCOAFormController()

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

  // กู้คืนข้อมูลจาก session storage (ถ้ามี)
  restoreFromSession()

})

// Handler สำหรับบันทึก
const handleSaveTruckOrder = async formData => {
  try {
    const result = await saveTruckOrderData(
      formData,
      saveShipmentPlan,      // function ที่มีอยู่แล้ว
      disabledModel,         // ref ที่มีอยู่แล้ว
      trikerSaveDrft,         // ref ที่มีอยู่แล้ว
    )
    
    if (result) {
      textAlertDialogFunction("SAVE TRUCK ORDER", true)
      setTimeout(() => location.reload(), 500)
    } else {
      textAlertDialogFunction("SAVE TRUCK ORDER", false)
    }
  } catch (error) {
    console.error('Error:', error)
    textAlertDialogFunction("SAVE TRUCK ORDER", false)
  }
}

// Handler สำหรับพิมพ์
const handlePrintTruckOrder = async formData => {
  try {
    await printTruckOrderDocument(formData)
  } catch (error) {
    console.error('Error:', error)
    textAlertDialogFunction("PRINT TRUCK ORDER", false)
  }
}

// Handler สำหรับปิด Dialog
const handleCloseTruckOrder = () => {
  closeDialogTruckOrder()
}

//---------------------- Select Model ----------------------------------------------

const personInchargeTruckCompanyModel = ref('')
const contactTruckCompanyModel = ref('')

const selectedTruckCompany2 = () => {
  const foundItem = truckModel.value.find(item => item.truck === TruckCompanyPrint.value)

  if (foundItem) {
    personInchargeTruckCompanyModel.value = foundItem.personIncharge || ''
    contactTruckCompanyModel.value = foundItem.contact || ''
  } else {
  }
}

// อัปเดตค่าเมื่อ TruckCompanyPrint เปลี่ยน
watchEffect(() => {
  selectedTruckCompany2()
})


const TruckTypePrint = ref([])

//------------------------------------------ Mock Data --------------------------------
import mockData from './tableInvoice/dataMock'

//------------------------ Set Permissions (Hiden and Show Column) ------------------------

const accountINSP = ref(false)
const accountWHSub = ref(false)

//-------------------
//----- Rune
const rules = [v => v.length <= 150 || 'Max 25 characters']

//--------- new expention
const panel = ref(['filter'])

///---------------- Dialog  truck order ------------------
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

  const mainCheckSheetTypeName = (product.checkSheetTypeID)



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

const licensePlate = ref({})

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
    console.log('countPage.value 1', countPage.value)
    handleDialogLoading("PRINT CHECK SHEETS")
    await callAPIPrintPDFChecksheet('ShippingCheckSheet', '', countPage.value++)
    console.log('countPage.value 2', countPage.value)
    await callAPIPrintPDFChecksheet(type, '', countPage.value++)
    console.log('countPage.value 3', countPage.value)

    // if(countPage.value === 3){
    //   await callAPIPrintPDFChecksheet(type, '', countPage.value)
    // }

    const licensePlates = Array.isArray(licensePlate.value)
      ? licensePlate.value
      : [licensePlate.value]

    for (const item of licensePlates) {
      await callAPIPrintPDFChecksheet('ShippingCheckSheetContainer', item.containerNo_LicPlNo, countPage.value++)
    }
    console.log('countPage.value end', countPage.value)
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
    }, 3 * 1000) // ระยะเวลาในการหมุน 
  } else if (getShippingCheckSheetResult2?.value.isLorry) {
    handleDialogLoading("PRINT CHECK SHEETS")
    callAPIPrintPDFChecksheet('ShippingLorry')


    setTimeout(() => {
      isDialogLoadingVisible.value = false
    }, 3 * 1000) // ระยะเวลาในการหมุน (1000 มิลลิวินาที = 1 วินาที)
  } else if (!getShippingCheckSheetResult2?.value.isLorry) {
    handleDialogLoading("PRINT CHECK SHEETS")
    callAPIPrintPDFChecksheet('ShippingFlexi')

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

const printShipmentPDFBySoEIdPlan = async () => {
  loadingPrint.value = true

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
  driverAndTel: '',
})

//------------------- formate truck date

const clearParamsTruckOrder = () => {

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

}
</script>

<template>
  <!-- Title Page -->
  <section>
    <ShipmentPlanFilter
      v-model:filter-form="filterForSearchPlan"  
      v-model:etd-date="etdDateModel"
      v-model:panel-state="panel"
      :items-status="itemsStatus"
      :disabled-btn-export="disabledBtnExport"
      @search="searchFilterPlanFunctionBtn"
      @clear="clearFilterPlanFunctionBtn"
      @export="printShipmentPDFBySoEIdPlan"
    />  
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

  <section>
    <ShippingMarkDialog
      v-model:is-visble="isDialogVisiblePrintShippingMark"
      v-model:print-copy="printCopyModel"
      :sale-order-no="exmpleSaleOrder"
      :shipping-mark="exmpleShippingMark"
      @confirm-print="printLabel"
    />
  </section>

  <!-- Truck Order -->
  <section>
    <TruckOrderDialog
      v-model="isDialogVisiblePrintTruck"
      :sale-order-number="saleOrderNo"
      :data-row="dataRowModel"
      :disabled="disabledModel"
      :company-list="CompanyModel"
      :address-list="AddressModel"
      :truck-list="TruckCompanyModel"
      :truck-type-list="TruckTypeModel"
      :current-user="userDataInfo"
      :existing-data="existingTruckData"
      @save="handleSaveTruckOrder"
      @print="handlePrintTruckOrder"
      @close="handleCloseTruckOrder"
    />
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
              v-if="canVisibleUserPermission(statusPermission, 'BTN_APPROVE').canVisible"
              :disabled="selectedDataTables.length < 1"
              class="mx-2"
              color="primary"
              @click="submitShipmentPlanBySoEId('approve', '001')"
            >
              <span style="font-size: 12px;">Approve</span>
            </VBtn>

            <VBtn
              v-if="canVisibleUserPermission(statusPermission, 'BTN_REJECT').canVisible"
              :disabled="selectedDataTables.length < 1"
              class="mx-2"
              color="error"
              @click="isDialogVisibleCommentDialog = true"
            >
              <span style="font-size: 12px;">Reject</span>
            </VBtn>

            <VBtn
              v-if="canVisibleUserPermission(statusPermission, 'BTN_SENDBACK').canVisible "
              :disabled="selectedDataTables.length < 1"
              class="mx-2"
              color="purple-accent-4"
              @click="openConfirmDialog('back', '001')"
            >
              <span style="font-size: 12px;">Send Back</span>
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
        </VRow>
      </VCardText>
    </VCard>
  </div>

  <!-- ----------             Product  SKT                                  ------------------------------------ -->
  <section v-if="disableShowDataByDepartment(userData)">
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
                v-if="false"
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
                style="width: 60px;"
                class="sticky-column px-1"
              />
              <th
                scope="row"
                class="sticky-column text-center px-1"
              >
                <span style="font-weight: bold;">{{ $t('No.') }}</span>
              </th>
              <th class="sticky-column text-center px-1">
                <span style="font-weight: bold;">{{ $t('Status') }}</span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_SALE_ORDER_NO').canVisible"
                class="px-1"
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
                class="text-center text-wrap px-1"
                style="max-width: 80px;"
              >
                <span style="font-weight: bold;">{{ $t('SO attachment') }}</span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_SO_ATTACHMENT').canVisible"
                class="text-start px-1"
              >
                <span style="font-weight: bold;">{{ $t('PO No.') }}</span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_SO_ATTACHMENT').canVisible"
                class="text-center px-1"
                style="max-width: 80px;"
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
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_END_USER').canVisible"
                class="px-1"
              >
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
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_LOT_NUMBER').canVisible"
                class="px-1"
              >
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
                class="text-end px-1"
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
                class="text-center px-1"
                style="max-width: 80px;"
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
                class="bg-yellow-lighten-3 texct-end px-1"
                style=" max-width: 150px; "
              >
                <span style="font-weight: bold;">{{ $t('Truck Reserving Number') }}
                  <VIcon
                    :icon="sortColumn === 'truckReservingNumber' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('truckReservingNumber')"
                  />
                </span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_TRUCK_FEE').canVisible"
                class="px-1"
              >
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
                class="text-center px-1"
              >
                <span style="padding-left: 1px; font-weight: bold;">{{ $t('Truck Order') }}</span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_DO_EX').canVisible"
                class="px-1"
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
                class="text-center px-1"
              >
                <span style="font-weight: bold;">{{ $t('Loading date') }}
                  <VIcon
                    :icon="sortColumn === 'logUpdatedDate' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('logUpdatedDate')"
                  />
                </span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_ETD').canVisible"
                class="px-1 text-center"
              >
                <span style="font-weight: bold;">{{ $t('ETD') }}</span>
                <VIcon
                  size="25"
                  icon="ri-calendar-todo-fill"
                />
                <VIcon
                  :icon="sortColumn === 'etd' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('etd')"
                />
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_ETA').canVisible"
                class="px-1 text-center"
              >
                <span style="font-weight: bold;">{{ $t('ETA') }}</span>
                
                <VIcon
                  size="25"
                  icon="ri-calendar-todo-fill"
                />
                <VIcon
                  :icon="sortColumn === 'eta' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection('eta')"
                />
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_DELIVERY_NOTE').canVisible"
                class="text-center px-1"
                style="max-width: 100px;"
              >
                <span style="font-weight: bold;">{{ $t('Delivery note') }}</span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_REMARK_SAL').canVisible"
                class="px-1"
              >
                <span style="font-weight: bold;">{{ $t('Remark (SAL)') }}
                  <VIcon
                    :icon="sortColumn === 'saL_Remarks' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('saL_Remarks')"
                  />
                </span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_REMARK_WH').canVisible"
                class="px-1"
              >
                <span style="font-weight: bold;">{{ $t('Remark (WH)') }}
                  <VIcon
                    :icon="sortColumn === 'wH_Remarks' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('wH_Remarks')"
                  />
                </span>
              </th>
              <th
                v-if="canVisibleUserPermission(statusPermission, 'COL_REMARK_LOG').canVisible"
                class="px-1"
              >
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
              <th class="px-1 text-center">
                <span style="font-weight: bold;">{{ $t('Updated Date') }}
                  <VIcon
                    :icon="sortColumn === 'updatedDate' && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection('updatedDate')"
                  />
                </span>
              </th>
              <!-- Action Dev -->
              <section v-if="false">
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
              </section>
              
              <th
                v-if="true"
                class="sticky-action"
              >
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
                class="sticky-columnBody cursor-pointer flex-d justify-center"
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
                <div class="cell-center">
                  <VCheckboxBtn
                    v-if="checkStatusBeforeAvtion(product.statusId) && userDataInfo.id === '00023'
                      || checkStatusBeforeAvtion(product.statusId) && userDataInfo.id === '00025'
                      || checkStatusBeforeAvtion(product.statusId) && canVisibleUserPermission(statusPermission, 'BTN_APPROVE').canVisible"
                    v-model="selectedDataTables"
                    :value="product"
                  />

                  <VBtn
                    v-if="canVisibleUserPermission(statusPermission, 'BTN_SENDBACK').canVisible && checkIfForBtnDeleteSOE(product)"
                    color="red"
                    variant="outlined"
                    @click="openConfirmDialog('delete', product.soEtlLogDetailJournalID, product)"
                  >
                    <span style="font-size: 12px;">
                      <VIcon icon="ri-delete-bin-line" /> SO
                    </span>

                    <VTooltip
                      activator="parent"
                      location="end"
                    >
                      Delete SO
                    </VTooltip>
                  </VBtn>
                </div>
              </td>
              <td
                class="sticky-columnBody cursor-pointer px-1"
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
                class="sticky-columnBody cursor-pointer px-1"
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
                style="min-width: 80px; font-size: 12px;"
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
                style="min-width: 80px; font-size: 12px;"
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
                v-if="canVisibleUserPermission(statusPermission, 'COL_SAP_INVOICE_NO').canVisible"
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
                <span v-if="product.statusId === 207 || product.statusId === 206">
                  {{ product.poNo }} 
                </span>
                
                <VTextField
                  v-if="product.statusId !== 207 && product.statusId !== 206"
                  v-model="product.poNo"
                  :disabled="!canVisibleUserPermission(statusPermission, 'COL_SAP_INVOICE_NO').canExecute || 
                    disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
                  density="compact"
                  style=" min-width: 150px;"
                />
              </td>

              <!-- 👉 PO Attachment -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_SO_ATTACHMENT').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 80px; font-size: 12px;"
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
                <span v-if="product.statusId === 207 || product.statusId === 206">
                  {{ product.sapInvoiceNo }} 
                </span>
                
                <VTextField
                  v-if="product.statusId !== 207 && product.statusId !== 206"
                  v-model="product.sapInvoiceNo"
                  :disabled="!canVisibleUserPermission(statusPermission, 'COL_SAP_INVOICE_NO').canExecute || 
                    disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
                  density="compact"
                  style=" min-width: 150px;"
                />
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
                <VTextField
                  v-model="product.shipperLocation"
                  density="compact"
                  :disabled="!canVisibleUserPermission(statusPermission, 'COL_SHIPPER_LOCATION').canExecute || disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
                  class="text-field"
                  style=" min-width: 150px; font-size: 12px !important;"
                >
                  <template #label>
                    <span style="font-size: 12px;">Shipper Location</span>
                  </template>
                </VTextField>
                <VTooltip
                  v-if="product.shipperLocation"
                  activator="parent"
                  location="end"
                  open-on-click
                >
                  {{ product.shipperLocation }}
                </VTooltip>
              </td>

              <!-- 👉 Shipping Condition -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_SHIPPING_MARK').canVisible"
                class="text-start px-1 cursor-pointer"
                style="max-width: 170px; font-size: 12px;"
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
                class="text-end px-1 cursor-pointer"
                style="min-width: 100px; font-size: 12px;"
                @dblclick="dataTableCliclHighlightIsToggle(product.soEtlLogDetailJournalID)"
              >
                {{ formatNumber(product.quantity) }}
              </td>

              <!-- 👉 coa -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_COA').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 80px; font-size: 12px;"
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
                    :disabled-prop="!canVisibleUserPermission(statusPermission, 'COL_COA').canExecute ||
                      disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product) ||
                      product.catId !== '04'"
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
                  :disabled="!canVisibleUserPermission(statusPermission, 'COL_FREIGHT_FORWARDER').canExecute 
                    || disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
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
                  :disabled="!canVisibleUserPermission(statusPermission, 'COL_CARRIER').canExecute || 
                    disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
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
                  :disabled="!canVisibleUserPermission(statusPermission, 'COL_VESSEL_NAME').canExecute ||
                    disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
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
                  :disabled="!canVisibleUserPermission(statusPermission, 'COL_VOY').canExecute || 
                    disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
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
                      :disabled="!canVisibleUserPermission(statusPermission, 'COL_TRUCK').canExecute || 
                        disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
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
                <VTextField
                  v-if="true"
                  v-model="product.truckReservingNumber"
                  density="compact"
                  :disabled="!canVisibleUserPermission(statusPermission, 'COL_TRUCK_RESERVING_NUMBER').canExecute || 
                    disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
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
                  :disabled="!canVisibleUserPermission(statusPermission, 'COL_TRUCK_FEE').canExecute || 
                    disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
                  density="compact"
                  style=" min-width: 90px;"
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
                <div class="d-flex align-center justify-center">
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
                  <FileInputDialogCarousels
                    title-dialog="Truck Order"
                    :disabled-prop="!canVisibleUserPermission(statusPermission, 'COL_TRUCK_ORDER').canExecute || 
                      disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
                    :type-file-input="typeFileInput"
                    file-name="Truck Order"
                    :files-from-a-p-i="product.getTruckOrderFileData"
                    @updateFiles="handleFileUpdatesTruckOrder"
                  />
                </div>
              </td>

              <!-- 👉 doEx -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_DO_EX').canVisible"
                class="text-start px-1 cursor-pointer"
                style="min-width: 50px; font-size: 12px;"
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
                {{ (product.country) }}
              </td>

              <!-- 👉 loadingDate -->
              <td
                v-if="canVisibleUserPermission(statusPermission, 'COL_LOADING_DATE').canVisible"
                class="text-start px-1"
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
                <AppDateTimePicker
                  v-if="canVisibleUserPermission(statusPermission, 'COL_LOADING_DATE').canExecute &&
                    !disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
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
                <AppDateTimePicker
                  v-if="canVisibleUserPermission(statusPermission, 'COL_ETD').canExecute && 
                    !disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
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
                <AppDateTimePicker
                  v-if="canVisibleUserPermission(statusPermission, 'COL_ETA').canExecute && 
                    !disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
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
                    title-dialog="Delivery Note"
                    :disabled-prop="!canVisibleUserPermission(statusPermission, 'COL_DELIVERY_NOTE').canExecute || 
                      disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)"
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
                                                     checkStatusInComplete(product.statusId),
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
                                                     checkStatusInComplete(product.statusId),
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
                                                     checkStatusInComplete(product.statusId),
                                                     canVisibleUserPermission(statusPermission, 'COL_REMARK_LOG').canExecute)"
                >
                  <span
                    v-if="product.loG_Remarks"
                    style="overflow: hidden; max-width: 130px; font-size: 12px; text-overflow: ellipsis;"
                  >{{ product.loG_Remarks }}</span>
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
                class="text-center px-1 cursor-pointer"
                style="max-width: 90px; font-size: 12px;"
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
              <section v-if="false">
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
                    :disabled="disabledStatusSaveDraft(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product) ||
                      !canVisibleUserPermission(statusPermission, 'BTN_SAVE_DRAFT').canVisible"
                    :color="accountINSP ? 'grey' : 'warning'"
                    @click="handleSaveRowShipmentPlan(product, 'save draft'), saveDraftLoading = true"
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
                      || !canVisibleUserPermission(statusPermission, 'BTN_SUBMIT').canVisible "
                    class="mx-2"
                    :color="accountINSP ? 'grey' : 'primary'"
                    @Click="handleOpenConfirmDialogWrapSapInV('submit', product.soEtlLogDetailJournalID, product), submitLoading = true"
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
              </section>
              
              <!-- Action Dev -->
              <td
                v-if="true"
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
                  <VMenu
                    activator="parent"
                    location="start"
                  >
                    <VList
                      density="compact"
                      min-width="200"
                    >
                      <!-- Action -->
                      <VListItem
                        prepend-icon="ri-flashlight-line"
                        title="Action"
                        :disabled="accountINSP"
                        @click="actionBtn(product)"
                      />

                      <!-- Save Draft -->
                      <VListItem
                        title="Save Draft"
                        :disabled="isDraftDisabled(product, accountINSP, disabledStatus)"
                        @click="saveShipmentPlan(product), saveDraftLoading = true"
                      >
                        <template #prepend>
                          <VIcon
                            icon="ri-save-line"
                            :color="isDraftDisabled(product, accountINSP, disabledStatus) ? undefined : 'warning'"
                          />
                        </template>

                        <template #append>
                          <VProgressCircular
                            v-if="isDraftLoading(saveDraftLoading, product)"
                            size="16"
                            indeterminate
                          />
                        </template>
                      </VListItem>
                      <!-- Submit -->
                      <VListItem
                        v-if="canVisibleUserPermission(statusPermission, 'BTN_SUBMIT').canVisible"
                        title="Submit"
                        :disabled="disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)
                          || !canVisibleUserPermission(statusPermission, 'BTN_SUBMIT').canVisible "
                        @click="openConfirmDialog('submit', product.soEtlLogDetailJournalID, product), submitLoading = true"
                      >
                        <template #prepend>
                          <VIcon
                            icon="ri-send-plane-line"
                            :color="disabledStatus(product.inspStatusId, product.logStatusId, product.salStatusId, product.whStatusId, product)
                              || !canVisibleUserPermission(statusPermission, 'BTN_SUBMIT').canVisible ? undefined : 'success'"
                          />
                        </template>
                        <template #append>
                          <VProgressCircular
                            v-if="isSubmitLoading(product, submitLoading)"
                            indeterminate
                            size="16"
                          />
                        </template>
                      </VListItem>

                      <!-- Divider -->
                      <VDivider v-if="accountWHSub" />

                      <!-- Approve -->
                      <VListItem
                        v-if="accountWHSub"
                        prepend-icon="ri-check-line"
                        title="Approve"
                        class="text-success"
                        @click="onApprove(product)"
                      />
                    </VList>
                  </VMenu>
                </VBtn>
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
                  :disabled="!activeShipMarkModel"
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

  <!-- Dialog Print -->
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

  <!-- Dialog Sap NiV -->
  <VDialog
    v-model="isDialogSapInV"
    max-width="500"
  >
    <template #default="{ isActive }">
      <VCard>
        <VCardText class="px-2">
          <div class="d-flex justify-center">
            <VIcon
              size="100"
              color="warning"
              icon="ri-question-line"
            />
          </div>
          <div class="text-center">
            <span style="font-size: 22px; font-weight: bolder;">There are duplicated SAP invoice No.{{ getSearchPlanSapInVResult?.datas[0].sapInvoiceNo }}
            </span>
          </div>
          <div class="text-center">
            <span style="font-size: 22px; font-weight: bolder;">Would you like to confirm the transactions?</span>
          </div>

          
          <VTable>
            <thead class="text-no-wrap">
              <tr>
                <!--
                  <th class="text-left">
                  soEtlLogDetailJournalID
                  </th> 
                -->
                
                <!--
                  <th class="text-left">
                  shippingUserCode
                  </th>
                  <th class="text-left">
                  shippingUserName
                  </th>  
                -->
               
                <th>No.</th>
                <th class="text-left">
                  sales Order No.
                </th>
                <th class="text-left">
                  sap Invoice No.
                </th>
                
                <th class="text-left">
                  etd
                </th>
                <th>
                  Filter
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in getSearchPlanSapInVResult?.datas"
                :key="index"
              >
                <!--
                  <td>{{ item.soEtlLogDetailJournalID }}</td>
                  <td>{{ item.salesOrderNo }}</td>
                  <td>{{ item.shippingUserCode }}</td>
                  <td>{{ item.shippingUserName }}</td>  
                -->
                <td>{{ index+1 }}</td>
                <td>{{ item.salesOrderNo }}</td>
                <td>{{ item.sapInvoiceNo }}</td>
                <td>{{ formatToDate(item.etd) }}</td>
                <td>
                  <VBtn
                    icon="ri-arrow-right-circle-line"
                    variant="text"
                    @click="handleFilterSap(item.salesOrderNo, item.etd)"
                  />
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>

        <VCardActions class="d-flex justify-space-between">
          <VBtn
            text="Close"
            color="red"
            variant="flat"
            @click="isActive.value = false"
          />
          <VBtn
            text="Confirm"
            color="green"
            variant="flat"
            @click="confirmSapIn"
          />
        </VCardActions>
      </VCard>
    </template>
  </VDialog>
  <div />
</template>

<style scoped lang="scss" src="./indexTIE.scss"></style>
