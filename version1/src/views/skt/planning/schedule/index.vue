<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { onMounted, ref, watch, watchEffect } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api' //---------------------- Import Api for Url *****

import { VDataTable } from 'vuetify/labs/VDataTable'

//------------------------ Get Where House Name From LocalStorage and define to whereHouseSelectedItem ---------------------------
const whereHouse = localStorage.getItem('whereHouseName')
const whereHouseSelectedItem = ref(whereHouse)

const products = ref([]) //---------------- variable for get All Product From X-Location(Where House) *****
const selectedDataTables = ref([])

// Get access token from localStorage in another page
const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')

//------------------------------------------- compoennt ----------------------------------------------------------------
import GTable from '@/pages/skt/planning/schedule/gridTable/index.vue'

//------------------------------------------ Data --------------------------------

import { useItemStore } from '@/stores/skt/receingFormStore/itemStore'

import { useGetBatchProductionPlanService, 
  useGetProductionPlanSearchService, 
  useApproveProductionPlanService,
  usePrintExportExcelService,
  useGetStatusTextService,
} from '@/services/skt/productionPlan/services'

import { useFormatDateUtilities } from '@/utilities/utilities'

import { useGetCOAFormController } from '@/utilities/format'

const { formatNumber } = useGetCOAFormController()

const itemStore = useItemStore()

const userDataInfo = ref(itemStore.getItemDetails('UserDataCookies'))

//----------------------------------- Permission -----------------------

import { fetchUserPermissions, canVisibleUserPermissionPermission } from '@/utilities/permission'

const statusIdPermussion = ref('-1')

const paramsForGetPermission = ref({
  empId: String(userDataInfo.value.id) || '',
  statusId: '',
  uiControlContextId: '6',
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

//----------------------------------- Dialog -------------------------------------------
//------------------------ Dialog Confirm --------------------------------
import ConfirmDialog from '@/components/dialogs/alert/confirmDialog.vue'
import ConfirmDialog2 from '@/components/dialogs/alert/confirmDialog2.vue'
import AuthenticatorDialog from '@/components/dialogs/alert/alertDialog.vue'
import alertWordConst from '@/utilities/constant'

const isDialogVisibleConfirmDialog = ref(false)
const isDialogVisibleAlertDialog = ref(false)
const wordForSubmit = ref('')
const subWordForSubmit = ref('')
const successDialAlert = ref(false)
const confirmValueCheck = ref(false)

//--------------------- model --------------------------------
//-- dialog 2 
const confirmDialog2 = ref(null)

const selectedDataTablesStatusId = ref('')

const activeBtnApporve = ref(false)
const activeBtnPRODApporve = ref(false)

watch( () => {
  selectedDataTables.value.forEach(item => {
    // กำหนดค่าเริ่มต้น
    //console.log("selectedDataTables", item.statusId)
    selectedDataTablesStatusId.value = item.statusId
  })
})

function openConfirmDialog() {
  // เรียกใช้ฟังก์ชัน openDialog ที่เปิดเผยจาก ConfirmDialog.vue

  selectedDataTables.value.forEach(item => {
    // กำหนดค่าเริ่มต้น
    //console.log("selectedDataTables", item.statusId)
    selectedDataTablesStatusId.value = item.statusId

    if (item.statusId === 102 ) {
      wordForSubmit.value = alertWordConst.approve
      confirmDialog2.value.openDialog()
      isDialogVisibleAlertDialog.value = false
      activeBtnApporve.value = true

      //console.log("activeBtnApporve ", activeBtnApporve.value)
      //console.log("selectedDataTables 102")
    }else if(item.statusId === 107){

      activeBtnPRODApporve.value = true
      wordForSubmit.value = "PROD APPROVED"
      confirmDialog2.value.openDialog()
      isDialogVisibleAlertDialog.value = false

      // textSubAlertDialogFunction('SELECT APPROVE', "Plase select Plan Status 'Waitting for plan APVL' for approve.", false)
      //console.log("activeBtnPRODApporve ", activeBtnPRODApporve.value)
    // eslint-disable-next-line sonarjs/no-duplicated-branches
    }else if(item.statusId === 101){
      textSubAlertDialogFunction('SELECT APPROVE', "Plase select Plan Status 'Waitting for plan APVL' for approve.", false)

      //console.log("selectedDataTables 101")
    }
    else{
      //console.log("selectedDataTables failded")
      isDialogVisibleAlertDialog.value = false
    }

  })

}

watchEffect(() => {
  if(selectedDataTables.value?.length){
    selectedDataTables.value.forEach(item => {
    // กำหนดค่าเริ่มต้น
      //console.log("selectedDataTables", item.statusId)
      selectedDataTablesStatusId.value = item.statusId

      if (item.statusId === 102 ) {
        activeBtnApporve.value = true

        //console.log("activeBtnApporve ", activeBtnApporve.value)
      
      }else if(item.statusId === 107){
        activeBtnPRODApporve.value = true

        //console.log("activeBtnPRODApporve ", activeBtnPRODApporve.value)
        // eslint-disable-next-line sonarjs/no-duplicated-branches
      }else if(item.statusId === 101){
      }
      else{
        //console.log("selectedDataTables failded")
        isDialogVisibleAlertDialog.value = false
      }


      //console.log("selectedDataTables ", selectedDataTables.value.length)

    })
  }else{
    activeBtnApporve.value = false
    activeBtnPRODApporve.value = false
  }
  
})

function handleConfirmAction() {
  //console.log('Confirmed! Executing action...')
  if(selectedDataTablesStatusId.value === 102){
    approvePlan('approve')
  }else if(selectedDataTablesStatusId.value === 107){
    approvePlan('PRODapproveplans')
  }
  
}

function handleCancel() {
  //console.log('Action canceled.')
}

const textAlertDialogFunction = (word, success) => {
  wordForSubmit.value = word
  successDialAlert.value = success
  isDialogVisibleAlertDialog.value = true
}

const textSubAlertDialogFunction = (word, subWord, success) => {
  wordForSubmit.value = word
  subWordForSubmit.value = subWord
  successDialAlert.value = success
  isDialogVisibleAlertDialog.value = true
}

//----------------------------------- DBClicks hightlight --------------------------------
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

  //console.log("dataTableNum", dataTableNummberedToggle.value)
}

//----------------------------------- Get Batch Production plan ---------------------------
import { ProductionDataModel } from '@/model/skt/planning/production/model'

const { getProductionplanSearchResult, errorMessageGetProductionPlanSearch, fetchGetProductionplanSearch } = useGetProductionPlanSearchService()

const sortColumn = ref('')
const sortDirection = ref('')

const filterForSearchBatchProductionPlan = ref({
  StatusID: '',
  ProductionTextSearch: sessionStorage.getItem("ProductionTextSearchProductionFilter") || '',
  ItemTextSearch: sessionStorage.getItem("ItemTextSearchProductionFilter") || '',
  ProducingDateFrom: sessionStorage.getItem("ProducingDateFromProductionFilter") || '',
  ProducingDateTo: sessionStorage.getItem("ProducingDateToProductionFilter") || '',
  LotTextSearch: sessionStorage.getItem("LotTextSearchProductionFilter") || '',
  SortColumn: '',
  SortDirection: '',
})

const clearModelFolter = async () => {
  filterForSearchBatchProductionPlan.value.StatusID = null,
  filterForSearchBatchProductionPlan.value.ProductionTextSearch = '',
  filterForSearchBatchProductionPlan.value.ItemTextSearch = '',
  filterForSearchBatchProductionPlan.value.ProducingDateFrom = '',
  filterForSearchBatchProductionPlan.value.ProducingDateTo = '',
  filterForSearchBatchProductionPlan.value.LotTextSearch = '',
  datePickerFilter.value = ''

  await fetchDataProductingPlan()
}

const progressLinearNoData = ref(false)

const searchFilters = ref({ ...filterForSearchBatchProductionPlan.value }) // ฟิลเตอร์จริงที่จะส่งไป API

const handleSearch = async () => {
  searchFilters.value = { ...filterForSearchBatchProductionPlan.value } // คัดลอกค่าฟิลเตอร์ที่กรอกเสร็จแล้ว
  saveHistoryFilterSearch()
  await fetchDataProductingPlan() // เรียก API ด้วยฟิลเตอร์ที่ผู้ใช้กรอก
}

onMounted( async () => {
  await fetchDataProductingPlan()
})

const searchResult = ref([]) // ตัวแปรสำหรับเก็บผลลัพธ์
const datePickerFilter = ref(null)


// ใช้ฟังก์ชันเพื่อกำหนดค่าเริ่มต้น
const productionPlanItems = ref([])

const formatToMMDDYYYY = date => {
  const [day, month, year] = date.split("/")
  
  return `${month}/${day}/${year}`
}

const sortBy = ref([{ key: 'planningID', order: 'asc' }])

function transformNullToDefault(item) {
  const transformedItem = {}
  for (const key in item) {
    transformedItem[key] = item[key] === null ? (typeof item[key] === "number" ? 0 : "") : item[key]
  }
  
  return transformedItem
}

const saveHistoryFilterSearch = () => {
  sessionStorage.setItem("StatusIDProductionFilter", filterForSearchBatchProductionPlan.value.StatusID)
  sessionStorage.setItem("ProductionTextSearchProductionFilter", filterForSearchBatchProductionPlan.value.ProductionTextSearch)
  sessionStorage.setItem("ItemTextSearchProductionFilter", filterForSearchBatchProductionPlan.value.ItemTextSearch)
  sessionStorage.setItem("ProducingDateFromProductionFilter", filterForSearchBatchProductionPlan.value.ProducingDateFrom)
  sessionStorage.setItem("ProducingDateToProductionFilter", filterForSearchBatchProductionPlan.value.ProducingDateTo)
  sessionStorage.setItem("LotTextSearchProductionFilter", filterForSearchBatchProductionPlan.value.LotTextSearch)
}

const fetchDataProductingPlan = async () => {
  try {
    progressLinearNoData.value = false
    if (datePickerFilter.value) {
      //console.log("datePickerFilter:", datePickerFilter.value)

      if (datePickerFilter.value.includes(" to ")) {
        // กรณีเป็นช่วงวันที่
        const [startDate, endDate] = datePickerFilter.value.split(" to ")

        filterForSearchBatchProductionPlan.value.ProducingDateFrom = formatToMMDDYYYY(startDate)
        filterForSearchBatchProductionPlan.value.ProducingDateTo = formatToMMDDYYYY(endDate)

      } else {
        // กรณีเป็นวันเดียว
        const singleDate = datePickerFilter.value

        filterForSearchBatchProductionPlan.value.ProducingDateFrom = formatToMMDDYYYY(singleDate)
        filterForSearchBatchProductionPlan.value.ProducingDateTo = formatToMMDDYYYY(singleDate)
      }
    }
    filterForSearchBatchProductionPlan.value.SortColumn = sortColumn.value
    filterForSearchBatchProductionPlan.value.SortDirection = sortDirection.value
    productionPlanItems.value = []

    const resultFetchGet = await fetchGetProductionplanSearch(
      filterForSearchBatchProductionPlan.value, 
      urlApi.value, 'ProductionPlan', whereHouse, 
      accessTokenAtStore)

    if(resultFetchGet){
      // ตรวจสอบว่า getProductionplanMasterResult มี data และเป็น array
      if (getProductionplanSearchResult.value?.data && Array.isArray(getProductionplanSearchResult.value.data)) {
  
        productionPlanItems.value = getProductionplanSearchResult.value.data.map((item, index) => ({
          ...item,
          no: index + 1, // เพิ่มฟิลด์ "no" โดยเริ่มจาก 1
        }))

        //console.log("productionPlanItems", productionPlanItems.value)
      } else {
        console.warn("getProductionplanSearchResult.data is not an array")
        productionPlanItems.value = []
        progressLinearNoData.value = true
      }
    }else{
      productionPlanItems.value = []
      progressLinearNoData.value = true
    }

    
  } catch (error) {
    console.error("Error fetching production plan master data:", error)
    progressLinearNoData.value = true
    productionPlanItems.value = []
  }
}

//----------------------------- export to excel --------------------------------

//-------------------------------- Export Excel ----------------------------

const { printExportExcelResult, printExportExcelErrorMessage, printExportExcelService } = usePrintExportExcelService()

const filledParamsCount= ref('')

const checkBtnExportExcel = () => {

  filledParamsCount.value = Object.values(filterForSearchBatchProductionPlan.value).filter(value => value !== null && value !== '' && value !== -1).length

  //console.log('filledParamsCount', filterForSearchBatchProductionPlan.value)

  return filledParamsCount.value === 0
}

const printExportExcel = async () => {
  try {
    if (datePickerFilter.value) {
      //console.log("datePickerFilter:", datePickerFilter.value)

      if (datePickerFilter.value.includes(" to ")) {
        // กรณีเป็นช่วงวันที่
        const [startDate, endDate] = datePickerFilter.value.split(" to ")

        filterForSearchBatchProductionPlan.value.ProducingDateFrom = formatToMMDDYYYY(startDate)
        filterForSearchBatchProductionPlan.value.ProducingDateTo = formatToMMDDYYYY(endDate)

      } else {
        // กรณีเป็นวันเดียว
        const singleDate = datePickerFilter.value

        filterForSearchBatchProductionPlan.value.ProducingDateFrom = formatToMMDDYYYY(singleDate)
        filterForSearchBatchProductionPlan.value.ProducingDateTo = formatToMMDDYYYY(singleDate)
      }
    }
    filterForSearchBatchProductionPlan.value.SortColumn = sortColumn.value
    filterForSearchBatchProductionPlan.value.SortDirection = sortDirection.value

    const resultFetchGet = await printExportExcelService(
      urlApi.value, whereHouse, 
      accessTokenAtStore, 
      filterForSearchBatchProductionPlan.value)

    if(resultFetchGet){
      // ตรวจสอบว่า getProductionplanMasterResult มี data และเป็น array
      //console.log("printExportExcelResult", printExportExcelResult.value)
    }else{
      console.error("Error export production plan master data:", printExportExcelErrorMessage.value)
    }

    
  } catch (error) {
    console.error("Error export production plan master data:", error)
  }
}

//--------------------------- New batch -----------------------------------------------------

const { getBatchProductionplanResult, errorMessageGetBatchProductionPlan, fetchGetBatchProductionplan } = useGetBatchProductionPlanService()



const date = ref(new Date())

const guidForBatch = ref(null)

const batchIDDataPlan = ref()

const newBatchGenBatch = async () => {
  try {
    if(batchIDDataPlan.value){
      itemStore.setItemDetails(batchIDDataPlan.value, 'guIDForBatchCookie')

      //console.log("getBatchProductionplanResult", itemStore.getItemDetails('guIDForBatchCookie'))
    }else{
      // เรียกใช้ fetch และรอให้ทำงานเสร็จ
      await fetchGetBatchProductionplan(urlApi.value, 'ProductionPlan', whereHouse, accessTokenAtStore)

      // ตรวจสอบว่าผลลัพธ์ไม่เป็น undefined หรือ null
      if (getBatchProductionplanResult.value) {
        itemStore.setItemDetails(getBatchProductionplanResult.value, 'guIDForBatchCookie')

        //console.log("getBatchProductionplanResult", itemStore.getItemDetails('guIDForBatchCookie'))
      } else {
        console.error("getBatchProductionplanResult.value is undefined or null")
      }
    }
    
  } catch (error) {
    console.error("Error in newBatchGenBatch:", error)
  }
}

//------------------------------- approved ----------------------------------------------------------------
const { responseApproveProductionPlan, errorMessageApproveProductionPlan, approveProdutcionPlanFunc } = useApproveProductionPlanService()

const approvePlan = async type => {

  const body = selectedDataTables.value.map(item => item.planningID)

  try {
  // เรียก fetchGetProductionplan และรอให้ทำงานเสร็จ
    await approveProdutcionPlanFunc(body, urlApi.value, 'ProductionPlan', type, whereHouse, accessTokenAtStore)
    if(responseApproveProductionPlan.value){
      textAlertDialogFunction(alertWordConst.approve, true)
      setTimeout(() => {
        location.reload()
      }, 500) // 10000 มิลลิวินาที = 10 วินาที
    }else{
      textAlertDialogFunction(alertWordConst.approve, false)
      setTimeout(() => {
        // location.reload()
      }, 500) // 10000 มิลลิวินาที = 10 วินาที
    }
  } catch (error) {
  // จัดการข้อผิดพลาด
    
    console.error("Error approved production plan:", error)
  }

  //console.log("body selectedDataTables", body)
}

// In case of a range picker, you'll receive [Date, Date]
const format = date => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

const formatDate = date => {
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()

  return `${day}/${month}/${year}`
}

const RoleAccount = ref('User')

// ฟังก์ชันสำหรับเปลี่ยนสถานะของแถวใน productionPlan
const changeStatusProductPlanSaveDraft = index => {
  productionPlan.value[index].status = 'Save Draft'
}

const indexSubmit = ref('')

// ฟังก์ชันสำหรับเปลี่ยนสถานะของแถวใน productionPlan
const changeStatusProductPlanSubmit = index => {
  isDialogSubmitVisible.value = true
  indexSubmit.value = index

}

const submitProductionPlan = index => {
  productionPlan.value[index].status = 'Submit'
  isDialogSubmitVisible.value = false
  isDialogSubmitSuccessVisible.value = true
}

const defaultStatus = ref('Working')

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

const toDayDate = format(new Date())
const toDayDatePFinished = ref('NaN')

//------------------------------------------ Mock Data --------------------------------
const countItemProduction = ref(1)

const selectedDateInput = ref(toDayDate)
const rules = [v => v.length <= 150 || 'Max 25 characters']

//---------------------------------

const statusFormApi = ref({
  StatusID: null,
})

const itemsStatus = ref([])

const colorStatusWithId = id => {
  switch (id) {
  case 101:
    return { color: 'orange', message: 'orange-darken-1', text: 'Draft PROD plan', bgColor: '#FFF3E0' }
  case 102:
    return { color: 'green', message: 'green', text: 'Waitting for plan APVL', bgColor: '#E8F5E9' }
  case 103:
    return { color: 'pink', message: 'pink-darken-4', text: 'Waiting for Mat. Picking', bgColor: '#FCE4EC' }
  case 105:
    return { color: 'purple', message: 'purple', text: 'In Producing', bgColor: '#F3E5F5' }
  case 107:
    return { color: 'brown', message: 'brown', text: 'Waiting for FG/PROD APVL', bgColor: '#EFEBE9' }
  case 108:
    return { color: 'green', message: 'green', text: 'PROD Completed', bgColor: '#E8F5E9' }
  case 109:
    return { color: 'red', message: 'red', text: 'Plan Rejected', bgColor: '#FFEBEE' }
  default:
    return { color: 'grey', message: 'grey', text: 'All', bgColor: '#FFF3E0' }
  }
}

///------------------------------------------------------------------------------
const panel = ref(['filter'])

const addBatch = ref(false)

const currentPageDataTable = ref(1)

const refeshPage = () => {
  isSpinning.value = true
  setTimeout(() => {
    isSpinning.value = false
  }, 10 * 1000) // ระยะเวลาในการหมุน (1000 มิลลิวินาที = 1 วินาที)
  location.reload()
}

const isSpinning = ref(false)

const headersDataTableNew = [
  {
    title: 'data-table-select',
    key: 'data-table-select',
    align: "center",
    fixed: true,
    readonly: true,
  },
  {
    title: 'Status',
    key: 'statusId',
    fixed: true,
    sortable: false,
  },
  {
    title: 'No.',
    key: 'no',
    sortable: false,
  },
  {
    title: 'Input Date',
    key: 'inputDate',
    sortable: false,
  },
  {
    title: 'Plants',
    sortable: false,
    key: 'plantName',
  },
  {
    title: 'Reactor',
    key: 'reactorName',
    sortable: false,
    class: 'my-header-style',
  },
  {
    title: 'Production Code',
    key: 'productionCode',
    sortable: false,
  },
  {
    title: 'Production Name',
    key: 'productionName',
    sortable: false,
  },
  {
    title: 'Batch Scale(Kgs)',
    key: 'quantityKgs',
    sortable: false,
  },

  {
    title: 'Lot',
    key: 'lotNumber',
    sortable: false,
    align: "start",
  },

  {
    title: 'Item Code1',
    key: 'product1SelectedCode',
    class: 'my-header-style',
    sortable: false,
  },
  {
    title: 'Item Name1',
    key: 'product1Name',
    sortable: false,
  },
  {
    title: 'Packaging Type1',
    key: 'product1SelectedPackagingCode',
    sortable: false,
  },
  {
    title: 'Packaging Kgs1',
    key: 'product1PackingQtyKgs',
    sortable: false,
  },
  {
    title: 'Packaging Pcs1',
    key: 'product1UomCount',
    sortable: false,
  },
  {
    title: 'Product1UomCountActual',
    key: 'actualPcs1',
    sortable: false,
  },

  //---------------
  {
    title: 'Item Code2',
    key: 'product2SelectedCode',
    sortable: false,
  },
  {
    title: 'Item Name2',
    key: 'product2Name',
    sortable: false,
  },
  {
    title: 'Packaging Type2',
    key: 'product2SelectedPackagingCode',
    sortable: false,
  },
  {
    title: 'Packaging Kgs2',
    key: 'product2PackingQtyKgs',
    sortable: false,
  },
  {
    title: 'Packaging Pcs2',
    key: 'product2UomCount',
    sortable: false,
  },
  {
    title: 'Product2UomCountActual',
    key: 'actualPcs2',
    sortable: false,
  },

  
  {
    title: 'Producing Date',
    key: 'producingDate',
    sortable: false,
  },
  {
    title: 'Finished Date',
    key: 'finishedDate',
    sortable: false,
  },

  {
    title: 'Remark',
    key: 'remark',
    sortable: false,
  },
  {
    title: 'Updated By',
    key: 'updatedBy',
    sortable: false,
  },
  {
    title: 'Updated Date',
    key: 'updatedDate',
    sortable: false,
  },
  
  {
    title: 'Action',
    key: 'action',
    sortable: false,
  },
]

const row_classes = item => {
  //console.log('itemdd', item)

  // const classes = []
  // if (item.statusId === 'active') {
  //   classes.push('active-row')
  // } else {
  //   classes.push('inactive-row')
  // }

  const rowClass = 'active-row'
  
  return rowClass
  
  return classes
}

const iconsSort = ref({
  sortColumn10: true,
  sortColumn11: true,
  sortColumn12: true,
  sortColumn13: true,
  sortColumn14: true,
})

// ฟังก์ชันสำหรับสลับสถานะของไอคอนแต่ละตัว
const toggleDirection = async key => {
  if (key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'

    //console.log(`Sorting direction is now: ${sortDirection.value} --> ${key}`)
  }
  sortColumn.value = key
  await fetchDataProductingPlan()
}

const getColumnClass = index => {
  const colorClasses = ["red-bg", "blue-bg", "yellow-bg", "green-bg"]
  
  return colorClasses[index] || "" // กำหนดสีตาม index
}

// ตัวอย่างฟังก์ชันของแต่ละ action

const newBatch = async batchID => {
  batchIDDataPlan.value = batchID
  try {
    // รอให้ newBatchGenBatch ทำงานเสร็จ
    await newBatchGenBatch()

    // เปลี่ยนเส้นทางหลังจากทำงานเสร็จ
    window.location.href = '/skt/planning/schedule/plan'
  } catch (error) {
    console.error("Error in newBatch:", error)
  }
}

//----------------------- staus text --------------------------------

const {  getStatusTextCodeResult, errorMessageGetStatusText, fetchGetStatusText } = useGetStatusTextService()

watch(async () => {
  try {
    const result = await fetchGetStatusText(
      urlApi.value,
      'ProductionPlan',
      whereHouse,
      accessTokenAtStore,
    )

    if (result && result.success && Array.isArray(result.data)) {
      getStatusTextCodeResult.value = result.data // กำหนดค่าเฉพาะ data
      itemsStatus.value = result.data.map(item => ({
        id: item.statusId || '', // ค่า item-value
        name: item.statusName|| '', // ค่า item-title
      }))

      //console.log('Status Text Code Result:', itemsStatus.value)
    } else {
      console.error('Invalid data structure:', result)
    }
  } catch (error) {
    console.error('Failed to fetch status text:', error)
  }
})

const statusText = statusId => {
  if (!getStatusTextCodeResult.value || !Array.isArray(getStatusTextCodeResult.value)) {
    console.error('getStatusTextCodeResult is not available or not an array')
    
    return 'All'
  }

  const status = getStatusTextCodeResult.value.find(item => item.statusId === statusId)
  
  return status ? status.statusName : 'All'
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
                >{{ $t('Production Plan') }}</span>
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
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <VSelect
                    v-model="filterForSearchBatchProductionPlan.StatusID"
                    :items="itemsStatus"
                    item-title="name"
                    item-value="id"
                    density="compact"
                    clearable
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
                        :style="{ color: colorStatusWithId(item.raw.id).message }"
                        size="x-small"
                        style="min-height: 20px;"
                        :color="colorStatusWithId(item.raw.id).color"
                      >
                        <span class="text-white">{{ statusText(item.raw.id) }}</span>
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
                    v-model="filterForSearchBatchProductionPlan.ProductionTextSearch"
                    type="Product Name"
                    density="compact"
                  >
                    <template #label>
                      <span style="font-size: 12px;">Production Code/Name</span>
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
                    v-model="filterForSearchBatchProductionPlan.ItemTextSearch"
                    type="Product Name"
                    density="compact"
                  >
                    <template #label>
                      <span style="font-size: 12px;">Item Code/Name</span>
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
                  <AppDateTimePicker
                    v-model="datePickerFilter"
                    placeholder="Producing Date (dd/mm/yyyy To dd/mm/yyyy)"
                    density="compact"
                    prepend-inner-icon="ri-calendar-schedule-fill"
                    :config="{ dateFormat: 'd/m/Y', mode: 'range' }"
                  />
                </VCol>

                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <VTextField
                    v-model="filterForSearchBatchProductionPlan.LotTextSearch"
                    density="compact"
                  >
                    <template #label>
                      <span style="font-size: 12px;">Lot</span>
                    </template>
                  </VTextField>
                </VCol>

                <!-- 👉 Button Search and Export -->
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1 d-flex"
                >
                  <VRow>
                    <VCol cols="4">
                      <VBtn
                        height="100%"
                        width="100%"
                        color="primary"
                        density="compact"
                        class="mx-0"
                        @click="handleSearch"
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
                        @click="clearModelFolter"
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
                        :disabled="checkBtnExportExcel()"
                        @click="printExportExcel"
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
  <!-- Dialog Add -->
  <section>
    <VDialog
      v-model="isDialogAddVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard title="Select Name To Plan">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogAddVisible = false"
        />

        <VCardText>
          <VCombobox
            v-model="selectedItem"
            :items="productNamesMockItems"
            placeholder="deployment"
          />
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            variant="outlined"
            color="secondary"
            @click="isDialogAddVisible = false"
          >
            close
          </VBtn>
          <VBtn @click="addProductToPlantrue">
            Add
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>
  <!-- Dialog Reject -->
  <section>
    <VDialog
      v-model="isDialogRejectVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard title="Comment">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogRejectVisible = false"
        />

        <VCardText>
          <VTextarea
            label="Comment"
            placeholder="Enter Comment Reject"
          />
        </VCardText>

        <VCardText class="d-flex justify-space-between flex-wrap gap-4">
          <VBtn
            color="error"
            @click="cancelProduct(indexReject)"
          >
            Reject
          </VBtn>
          <VBtn
            color="warning"
            @click="isDialogRejectVisible = false"
          >
            close
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <!-- Dialog Submit -->
  <section>
    <VDialog
      v-model="isDialogSubmitVisible"
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
            <span style="font-size: 22px; font-weight: bolder;">Are you sure you want to submit?</span>
          </div>
        </VCardText>

        <VCardAction class="d-flex justify-space-between pa-4">
          <VBtn
            color="error"
            @click="isDialogSubmitVisible = false"
          >
            Cancel
          </VBtn>
          <VBtn
            color="green"
            @click="submitProductionPlan(indexSubmit)"
          >
            Submit
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
            <span style="font-size: 22px; font-weight: bolder;">Submission Success</span>
          </div>
        </VCardText>

        <VCardAction class="d-flex justify-center pa-4">
          <VBtn
            color="success"
            @click="isDialogSubmitSuccessVisible = false"
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
            <span style="font-size: 22px; font-weight: bolder;">Submission Failed</span>
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

  <!-- Btn Approve / PROD APPROVE / NEW BATCH -->
  <div
    v-if="RoleAccount === 'User'"
    class="my-2"
  >
    <VCard>
      <VCardText class="pa-2">
        <VRow>
          <VCol cols="10">
            <!-- selectedDataTablesStatusId !== 102 -->
            <VBtn
              v-if="canVisibleUserPermission(statusPermission,'BTN_APPROVE').canVisible"
              :disabled="selectedDataTables.length === 0 || !activeBtnApporve"
              @click="openConfirmDialog"
            >
              <span style="font-size: 12px;">Approve</span>
            </VBtn>
            <!-- statusPermission !== 107 -->
            <VBtn
              v-if="canVisibleUserPermission(statusPermission,'BTN_PROD_APPROVE').canVisible"
              class="mx-2"
              color="info"
              :disabled="selectedDataTables.length === 0 || !activeBtnPRODApporve"
              @click="openConfirmDialog"
            >
              <span style="font-size: 12px;">PROD Approved</span>
            </VBtn>
            <VBtn
              v-if="canVisibleUserPermission(statusPermission,'BTN_NEW_BATCH').canVisible"
              class="mx-2"
              :disabled="!canVisibleUserPermission(statusPermission,'BTN_NEW_BATCH').canExecute"
              color="warning"
              @click="newBatch(null)"
            >
              <span style="font-size: 12px;">New Batch</span>
            </VBtn>
            <VBtn
              v-if="false"
              color="info"
              class="mx-2"
              @click="addEmptyRowToPlan"
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
        </VRow>
      </VCardText>
    </VCard>
  </div>

  <div
    v-if="RoleAccount === 'Manager'"
    class="mt-4"
  >
    <VBtn @click="showConfirmDialog">
      Approve
    </VBtn>
    <VBtn
      color="warning"
      class="mx-4"
      @click="addEmptyRowToPlan"
    >
      Add Plan
    </VBtn>
    <VBtn
      v-if="false"
      color="error"
      @click="addEmptyRowToPlan"
    >
      Reject
    </VBtn>
  </div>

  <!-- ----------             Production plan                                ------------------------------------ -->
  <section>
    <!-- VData table -->
    <VCard>
      <VCardText>
        <VProgressLinear
          v-if="progressLinearNoData"
          height="20"
          color="secondary"
          class="elevation-1"
        >
          <span>No Data....</span>
        </VProgressLinear>
        <VProgressLinear
          v-if="!productionPlanItems.length > 0 && progressLinearNoData === false"
          height="20"
          indeterminate
          color="primary"
          class="elevation-1"
        >
          <span>Loading Data....</span>
        </VProgressLinear>
        <VDataTable 
          v-if="productionPlanItems.length > 0"
          v-model:page="currentPageDataTable"
          v-model="selectedDataTables"
          :headers="headersDataTableNew"
          :items="productionPlanItems"
          :item-class="row_classes"
          :items-per-page="10"
          fixed-header
          height="550"
          show-select
          class="text-no-wrap"
        >
          <template #column.statusId="{ column }">
            <tr class="d-flex justify-center">
              <th>
                <span>{{ column.title }}<VIcon
                  :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection(column.key)"
                /></span>
              </th>
            </tr>
          </template>
          <template #column.no="{ column }">
            <tr class="d-flex justify-center">
              <th>
                <span>{{ column.title }}<VIcon class="clickable-icon" /></span>
              </th>
            </tr>
          </template>
          <template #column.inputDate="{ column }">
            <tr class="d-flex justify-center">
              <th>
                <span>{{ column.title }}<VIcon
                  :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection(column.key)"
                /></span>
              </th>
            </tr>
          </template>
          <template #column.plantName="{ column }">
            <tr class="d-flex justify-center">
              <th>
                <span>{{ column.title }}<VIcon
                  :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection(column.key)"
                /></span>
              </th>
            </tr>
          </template>
          <template #column.reactorName="{ column }">
            <tr class="d-flex justify-center">
              <th :class="getColumnClass(1)">
                <span>{{ column.title }}<VIcon
                  :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection(column.key)"
                /></span>
              </th>
            </tr>
          </template>
          <template #column.productionCode="{ column }">
            <tr class="d-flex justify-center">
              <th>
                <span>{{ column.title }}<VIcon
                  :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection(column.key)"
                /></span>
              </th>
            </tr>
          </template>
          <template #column.productionName="{ column }">
            <tr class="d-flex justify-center">
              <th>
                <span>{{ column.title }}<VIcon
                  :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection(column.key)"
                /></span>
              </th>
            </tr>
          </template>
          <template #column.quantityKgs="{ column }">
            <tr class="d-flex justify-center">
              <th>
                <span>{{ column.title }}<VIcon
                  :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection(column.key)"
                /></span>
              </th>
            </tr>
          </template>

          <template #column.lotNumber="{ column }">
            <tr class="d-flex justify-start">
              <th>
                <span>{{ column.title }}<VIcon
                  :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection(column.key)"
                /></span>
              </th>
            </tr>
          </template>

          <template #column.product1SelectedCode="{ column }">
            <tr class="d-flex justify-center">
              <th />
            </tr>
            <div>
              <tr class="d-flex justify-center">
                <th>
                  <span>{{ column.title }}<VIcon
                    :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                    class="clickable-icon"
                    @click="toggleDirection(column.key)"
                  /></span>
                </th>
              </tr>
            </div>
          </template>
          <template #column.product1Name="{ column }">
            <tr class="d-flex justify-center">
              <th />
            </tr>
            <tr class="d-flex justify-center">
              <th>
                <span>{{ column.title }}<VIcon
                  :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection(column.key)"
                /></span>
              </th>
            </tr>
          </template>
          <template #column.product1SelectedPackagingCode="{ column }">
            <tr class="d-flex justify-center py-0">
              <th>
                <span />
              </th>
            </tr>
            <tr class="d-flex justify-center">
              <th>
                <span>{{ column.title }}<VIcon
                  :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection(column.key)"
                /></span>
              </th>
            </tr>
          </template>
          <template #column.product1PackingQtyKgs="{ column }">
            <tr class="d-flex justify-center">
              <th />
            </tr>
            <tr class="d-flex justify-center">
              <th>
                <span>{{ column.title }}<VIcon
                  :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection(column.key)"
                /></span>
              </th>
            </tr>
          </template>
          <template #column.product1UomCount="{ column }">
            <tr class="d-flex justify-center">
              <th />
            </tr>
            <tr class="d-flex justify-center">
              <th>
                <span>{{ column.title }}<VIcon
                  :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection(column.key)"
                /></span>
              </th>
            </tr>
          </template>
          <template #column.actualPcs1="{ column }">
            <tr class="d-flex justify-center">
              <th />
            </tr>
            <tr class="d-flex justify-center">
              <th>
                <span>{{ column.title }}<VIcon
                  :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection(column.key)"
                /></span>
              </th>
            </tr>
          </template>

          <template #column.product2SelectedCode="{ column }">
            <tr class="d-flex justify-center">
              <th />
            </tr>
            <tr class="d-flex justify-center">
              <th>
                <span>{{ column.title }}<VIcon
                  :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection(column.key)"
                /></span>
              </th>
            </tr>
          </template>
          <template #column.product2Name="{ column }">
            <tr class="d-flex justify-center">
              <th />
            </tr>
            <tr class="d-flex justify-center">
              <th>
                <span>{{ column.title }}<VIcon
                  :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection(column.key)"
                /></span>
              </th>
            </tr>
          </template>
          <template #column.product2SelectedPackagingCode="{ column }">
            <tr class="d-flex justify-center py-0">
              <th>
                <span />
              </th>
            </tr>
            <tr class="d-flex justify-center">
              <th>
                <span>{{ column.title }}<VIcon
                  :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection(column.key)"
                /></span>
              </th>
            </tr>
          </template>
          <template #column.product2PackingQtyKgs="{ column }">
            <tr class="d-flex justify-center">
              <th />
            </tr>
            <tr class="d-flex justify-center">
              <th>
                <span>{{ column.title }}<VIcon
                  :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection(column.key)"
                /></span>
              </th>
            </tr>
          </template>
          <template #column.product2UomCount="{ column }">
            <tr class="d-flex justify-center">
              <th />
            </tr>
            <tr class="d-flex justify-center">
              <th>
                <span>{{ column.title }}<VIcon
                  :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection(column.key)"
                /></span>
              </th>
            </tr>
          </template>
          <template #column.actualPcs2="{ column }">
            <tr class="d-flex justify-center">
              <th />
            </tr>
            <tr class="d-flex justify-center">
              <th>
                <span>{{ column.title }}<VIcon
                  :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection(column.key)"
                /></span>
              </th>
            </tr>
          </template>

          
          <template #column.producingDate="{ column }">
            <tr class="d-flex justify-center">
              <th>
                <span>{{ column.title }}<VIcon
                  :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection(column.key)"
                /></span>
              </th>
            </tr>
          </template>
          <template #column.finishedDate="{ column }">
            <tr class="d-flex justify-center">
              <th>
                <span>{{ column.title }}<VIcon
                  :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection(column.key)"
                /></span>
              </th>
            </tr>
          </template>
          <template #column.remark="{ column }">
            <tr class="d-flex justify-center">
              <th>
                <span>{{ column.title }}<VIcon
                  :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection(column.key)"
                /></span>
              </th>
            </tr>
          </template>
          <template #column.updatedBy="{ column }">
            <tr class="d-flex justify-center">
              <th>
                <span>{{ column.title }}<VIcon
                  :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection(column.key)"
                /></span>
              </th>
            </tr>
          </template>
          <template #column.updatedDate="{ column }">
            <tr class="d-flex justify-center">
              <th>
                <span>{{ column.title }}<VIcon
                  :icon="sortColumn === column.key && sortDirection === 'desc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"
                  class="clickable-icon"
                  @click="toggleDirection(column.key)"
                /></span>
              </th>
            </tr>
          </template>
          

          <template #column.action="{ column }">
            <tr class="d-flex justify-center">
              <th>
                <span>{{ column.title }}</span>
              </th>
            </tr>
          </template>


          <template #item="{ item, index }">
            <tr style="font-size: 14px;">
              <td
                class="text-center px-2 cursor-pointer"
                style="position: sticky; z-index: 1; left: 0;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <VCheckboxBtn
                  v-if="item.raw.statusId === 102 && canVisibleUserPermission(statusPermission,'BTN_APPROVE').canVisible || 
                    item.raw.statusId === 107 && canVisibleUserPermission(statusPermission,'BTN_APPROVE').canVisible || 
                    item.raw.statusId === 102 && canVisibleUserPermission(statusPermission,'BTN_PROD_APPROVE').canVisible || 
                    item.raw.statusId === 107 && canVisibleUserPermission(statusPermission,'BTN_PROD_APPROVE').canVisible"
                  v-model="selectedDataTables"
                  :value="item.raw"
                  @update:modelValue="(selected) => handleSelection(selected, item.raw)"
                />
              </td>
              <td
                style="position: sticky; z-index: 1; left: 40px; min-width: 150px;  justify-content: center; padding-block: 2px !important;"
                class="text-start cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span>
                  <VChip
                    :color="colorStatusWithId(item.raw.statusId).color"
                    :style="{ color: colorStatusWithId(item.raw.statusId).color }"
                    style="font-size: 12px;"
                  >{{ statusText(item.raw.statusId) }}</VChip>
                </span>
              </td>
              <td
                class="cursor-pointer"
                style="font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ (currentPageDataTable - 1) * 10 + index + 1 }}
              </td>
              <td
                class="cursor-pointer"
                style="font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ formatDate(item.raw.inputDate) }}
              </td>
              <td
                class="cursor-pointer"
                style="font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.plantName }}
              </td>
              <td
                class="cursor-pointer"
                style="font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.reactorName }}
              </td>
              <td
                class="cursor-pointer"
                style="font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.productionCode }}
              </td>
              <td
                class="cursor-pointer"
                style="font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.productionName }}
              </td>
              <td
                class="px-8 text-end cursor-pointer"
                style="min-width: 150px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ formatNumber(item.raw.quantityKgs) }}
              </td>
              <td
                class="px-1 cursor-pointer text-start"
                style="min-width: 150px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span class="text-start">{{ item.raw.lotNumber }}</span>
              </td>
              <td
                style="font-size: 12px;"
                class="bg-light-blue-lighten-5 cursor-pointer" 
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.product1SelectedCode }}
              </td>
              <td
                style="font-size: 12px;"
                class="bg-light-blue-lighten-5 cursor-pointer" 
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.product1Name }}
              </td>
              <td
                style="font-size: 12px;"
                class="bg-light-blue-lighten-5 cursor-pointer" 
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.product1SelectedPackagingCode }}
              </td>
              <td
                style="font-size: 12px;"
                class="bg-light-blue-lighten-5 text-end cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span v-if="item.raw.product1PackingQtyKgs">{{ formatNumber(item.raw.product1PackingQtyKgs) }}</span>
                <span v-else />
              </td>
              <td
                style="font-size: 12px;"
                class="bg-light-blue-lighten-5 text-end cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span v-if="item.raw.product1UomCount">{{ item.raw.product1UomCount }}</span>
                <span v-else />
              </td>
              <td
                style="font-size: 12px;"
                class="bg-light-blue-lighten-5 text-end cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span v-if="item.raw.product1UomCountActual">{{ item.raw.product1UomCountActual }}</span>
                <span v-else />
              </td>

              <td
                style="font-size: 12px;"
                class="bg-red-lighten-5 cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #EF9A9A' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #EF9A9A' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.product2SelectedCode }}
              </td>
              <td
                style="font-size: 12px;"
                class="bg-red-lighten-5 cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #EF9A9A' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #EF9A9A' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.product2Name }}
              </td>
              <td
                style="font-size: 12px;"
                class="bg-red-lighten-5  cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #EF9A9A' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #EF9A9A' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.product2SelectedPackagingCode }}
              </td>
              <td
                style="font-size: 12px;"
                class="bg-red-lighten-5 text-end  cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #EF9A9A' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #EF9A9A' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span v-if="item.raw.product1PackingQtyKgs">{{ formatNumber(item.raw.product2PackingQtyKgs) }}</span>
                <span v-else />
              </td>
              <td
                style="font-size: 12px;"
                class="bg-red-lighten-5 text-end  cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #EF9A9A' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #EF9A9A' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span v-if="item.raw.product1UomCount">{{ item.raw.product2UomCount }}</span>
                <span v-else />
              </td>
              <td
                style="font-size: 12px;"
                class="bg-red-lighten-5 text-end  cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #EF9A9A' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #EF9A9A' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span v-if="item.raw.product2UomCountActual">{{ item.raw.product2UomCountActual }}</span>
                <span v-else />
              </td>
              <td
                class="px-1 text-center cursor-pointer"
                style="min-width: 150px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ formatDate(item.raw.producingDate) }}
              </td>
              <td
                class="px-1 text-center cursor-pointer"
                style="min-width: 150px; font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ formatDate(item.raw.finishedDate) }}
              </td>
              <td
                style="font-size: 12px;"
                class="cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.remark }}
              </td>

              <td
                style="font-size: 12px;"
                class="cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.updatedBy }}
              </td>

              <td
                style="font-size: 12px;"
                class="cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ useFormatDateUtilities(item.raw.updatedDate) }}
              </td>
              <td
                style="font-size: 12px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <VBtn
                  color="info"
                  style="font-size: 12px;"
                  @click="newBatch(item.raw.batchID)"
                >
                  Action
                </VBtn>
              </td>
            </tr>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>
  </section>

  <section v-if="false">
    <h3>GridTable</h3>
    <VCard>
      <VCardText>
        <GTable />
      </VCardText>
    </VCard>
  </section>

  <!-- Footer -->
  <section
    v-if="false"
    class="mt-3"
  >
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
          Version : 2.6(Last Updated 7/12/2024 ) {{ productionPlanItems.length }} Rows of Data
        </VAlert>
      </VCardText>
    </VCard>
  </section>

  <!-- Alert Dialog Component -->
  <section>
    <div>
      <!-- ใช้ confirmDialog component -->
      <ConfirmDialog2
        ref="confirmDialog2"
        :message="wordForSubmit"
        @confirm="handleConfirmAction"
        @cancel="handleCancel"
      />
    </div>

    <div>
      <!-- ใช้ AuthenticatorDialog component -->
      <AuthenticatorDialog
        :is-dialog-visible="isDialogVisibleAlertDialog"
        :word="wordForSubmit"
        :subword="subWordForSubmit"
        :success="successDialAlert"
        @update:isDialogVisible="(val) => isDialogVisibleAlertDialog.value = val"
      />
    </div>
  </section>
</template>

<style lang="scss" src="./productionPlan.scss"></style>
