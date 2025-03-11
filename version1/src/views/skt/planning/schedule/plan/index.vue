<script setup>
import { ref, watch, watchEffect } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api' //---------------------- Import Api for Url *****

import { VDataTable } from 'vuetify/labs/VDataTable'

import AuthenticatorDialog from '@/components/dialogs/alert/alertDialog.vue'
import AlertWord2 from '@/components/dialogs/alert/alertDialog2.vue'
import ConfirmDialog2 from '@/components/dialogs/alert/confirmDialog2.vue'
import alertWordConst from '@/utilities/constant'

import { useItemStore } from '@/stores/skt/receingFormStore/itemStore'

const itemStore = useItemStore()

const userDataInfo = ref(itemStore.getItemDetails('UserDataCookies'))

//----------------------------------- Permission -----------------------

import { fetchUserPermissions, canVisibleUserPermissionPermission } from '@/utilities/permission'

const statusIdPermussion = ref('')

const paramsForGetPermission = ref({
  empId: String(userDataInfo.value.id) || '',
  statusId: statusIdPermussion.value,
  uiControlContextId: '10',
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

const isDialogVisibleAlertDialog = ref(false)
const isDialogVisibleConfirmLotValidateDialog = ref(false)
const wordForSubmit = ref('')
const subWordForSubmit = ref('')
const successDialAlert = ref(false)
const confirmDialog2 = ref(null)

const alertValidate = ref('')
const statusId = ref(0)

const textAlertDialogFunction = (word, success) => {
  subWordForSubmit.value = ''
  wordForSubmit.value = word
  successDialAlert.value = success
  isDialogVisibleAlertDialog.value = true
}

const textAlertSubDialogFunction = (word, subWord, success) => {
  wordForSubmit.value = word
  subWordForSubmit.value = subWord
  console.log(subWord, subWordForSubmit.value)
  successDialAlert.value = success
  isDialogVisibleAlertDialog.value = true
}

const typeConfirm = ref('')

function openConfirmDialog() {
  // เรียกใช้ฟังก์ชัน openDialog ที่เปิดเผยจาก ConfirmDialog.vue

  selectedDataTables.value.forEach(item => {
    // กำหนดค่าเริ่มต้น
    console.log("selectedDataTables", item.statusId)

    if (item.statusId === 102 ) {
      typeConfirm.value = 'approve'
      wordForSubmit.value = alertWordConst.approve
      confirmDialog2.value.openDialog()
      isDialogVisibleAlertDialog.value = false
      console.log("selectedDataTables 102")
    }else if(item.statusId === 101){
      textAlertSubDialogFunction('SELECT APPROVE', "Plase select Plan Status 'Waitting for plan APVL' for approve.", false)
      console.log("selectedDataTables 101")
    }
    else{
      console.log("selectedDataTables failded")
      isDialogVisibleAlertDialog.value = false
    }

  })

}

function btnSubmitConfirm() {
  selectedDataTables.value.forEach(item => {
    // กำหนดค่าเริ่มต้น
    typeConfirm.value = 'submit'
    wordForSubmit.value = alertWordConst.submit
    confirmDialog2.value.openDialog()
    isDialogVisibleAlertDialog.value = false

  })
}

function btnRejectConfirm() {
  selectedDataTables.value.forEach(item => {
    // กำหนดค่าเริ่มต้น
    typeConfirm.value = 'reject'
    wordForSubmit.value = alertWordConst.reject
    confirmDialog2.value.openDialog()
    isDialogVisibleAlertDialog.value = false

  })
}

function btnConfirmAll(type) {
  selectedDataTables.value.forEach(item => {
    // กำหนดค่าเริ่มต้น
    typeConfirm.value = type
    wordForSubmit.value = alertWordConst[type]
    
    confirmDialog2.value.openDialog()
    isDialogVisibleAlertDialog.value = false
  })
}


const btnConfirmLotValidate = async () => {
  isDialogVisibleConfirmLotValidateDialog.value = false
  await submitPlan()
}

async function handleConfirmAction () {
  console.log('Confirmed! Executing action...')
  if(typeConfirm.value === "approve"){
    approvePlan()
  }else if(typeConfirm.value === "submit"){
    trickerSubmit.value = true
    await saveProductionPlan()
    await validateLotBeforeSubmit()
    trickerSubmit.value = false

    // await submitPlan()
  }else if(typeConfirm.value === "reject"){
    isDialogVisibleCommentDialog.value = true
    trickerSubmit.value = false

    // await rejectPlan()
  }else if(typeConfirm.value === "sendBack"){
    sendBackPlan()
  }
  
}


//--------------------------------------- dialog -------------------------------------

const isDialogVisibleCommentDialog = ref(false)
const statusCommnetValue = ref('')

//------------------------ Get Where House Name From LocalStorage and define to whereHouseSelectedItem ---------------------------
const whereHouse = localStorage.getItem('whereHouseName')
const whereHouseSelectedItem = ref(whereHouse)

const products = ref([]) //---------------- variable for get All Product From X-Location(Where House) *****

// Get access token from localStorage in another page
const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')

///--- import Cookie

const batchId = ref(itemStore.getItemDetails('guIDForBatchCookie'))

const planningId = ref(itemStore.getItemDetails('guIDForPlannigCookie'))

//------------------------------------------- highlighter -----------------------------

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

  console.log("dataTableNum", dataTableNummberedToggle.value)
}

//------------------------------------------ Data --------------------------------

const date = ref(new Date())

const productionPlan = ref([])

import { useGetCOAFormController } from '@/utilities/format'

const { formatNumber } = useGetCOAFormController()

// In case of a range picker, you'll receive [Date, Date]
const format = date => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

function formatDateToYMD(dateString) {
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/
  if (isoDatePattern.test(dateString)) {
    return dateString // คืนค่าถ้าอยู่ในรูปแบบ ISO 8601
  }else if(dateString.includes('/')){
    const [day, month, year] = dateString.split('/')
    
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  return dateString
  
}

const formatDate = isoDate => {
  const date = new Date(isoDate)
  const day = String(date.getDate()).padStart(2, '0') // เพิ่ม 0 ข้างหน้าถ้าวันน้อยกว่า 10
  const month = String(date.getMonth() + 1).padStart(2, '0') // เดือนเริ่มต้นจาก 0 จึงต้อง +1
  const year = date.getFullYear()

  return `${month}/${day}/${year}`
}

const formatDateUpdate = isoDate => {
  const date = new Date(isoDate)
  const day = String(date.getDate()).padStart(2, '0') // เพิ่ม 0 ข้างหน้าถ้าวันน้อยกว่า 10
  const month = String(date.getMonth() + 1).padStart(2, '0') // เดือนเริ่มต้นจาก 0 จึงต้อง +1
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

const formatDateYMDWhyQ = date => {
  // ตรวจสอบรูปแบบวันที่เป็น YYYY-MM-DDTHH:mm:ss

  const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/
  if (isoDatePattern.test(date)) {
    return date // คืนค่าถ้าอยู่ในรูปแบบ ISO 8601
  }else if(date.includes('/')){
    const [day, month, year] = date.split('/')
    
    return `${year}-${month}-${day}`
  }else if(date === null){
    date = new Date().toISOString()
    console.log("Data null", date)
    
    return date
  }

  // คืนค่าว่างหรือข้อความแสดงข้อผิดพลาด หากไม่อยู่ในรูปแบบที่รองรับ
  console.log('Invalid date format:', date)
  
  return 'null'
}

const RoleAccount = ref('User')

// const changeStatusProductPlanSaveDraft = index => {
//   productionPlan.value[index].status = 'Save Draft'
// }

const indexSubmit = ref('')

// ฟังก์ชันสำหรับเปลี่ยนสถานะของแถวใน productionPlan
const changeStatusProductPlanSubmit = index => {
  isDialogSubmitVisible.value = true
  indexSubmit.value = index
  
}

const submitProductionPlan = index => {
  // productionPlan.value[index].status = 'Submit'
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

const itemsStatus = [
  { name: "All", id: null },
  { name: "Draft PROD plan", id: 101 },
  { name: "Waitting for plan APVL", id: 102 },
  { name: "Waiting for Mat. Picking", id: 103 },
  { name: "In Producing", id: 105 },
  { name: "Waiting for FG/PROD APVL", id: 107 },
  { name: "PROD Completed", id: 108 },
  { name: "Plan Rejected", id: 109 },
]

const colorStatusWithId = id => {
  switch (id) {
  case 101:
    return { color: 'orange', message: 'orange-darken-1', text: 'Draft PROD plan' }
  case 102:
    return { color: 'green', message: 'green', text: 'Waitting for plan APVL' }
  case 103:
    return { color: 'pink', message: 'pink-darken-4', text: 'Waiting for Mat. Picking' }
  case 105:
    return { color: 'purple', message: 'purple', text: 'In Producing' }
  case 107:
    return { color: 'brown', message: 'brown', text: 'Waiting for FG/PROD APVL' }
  case 108:
    return { color: 'green', message: 'green', text: 'PROD Completed' }
  case 109:
    return { color: 'red', message: 'red', text: 'Plan Rejected' }
  default:
    return { color: 'grey', message: 'grey', text: 'All' }
  }
}

//------------------------------------------ Mock Data --------------------------------

//----------------------------- function true data ---------------------------------

import {
  useApproveProductionPlanService,
  useDeleteProductionPlanService,
  useGenerateBatchProductionPlanService,
  useGetBatchProductionPlanService,
  useGetProductionPlanMasterService,
  useGetProductionPlanService,
  useNewProductionPlanService,
  useSaveProductionPlanService,
  useSubmitProductionPlanService,
  useValidateBatchProductionPlanService,
  useRejectProductionPlanService,
  useGetStatusTextService,
} from '@/services/skt/productionPlan/services'

const countItemProduction = ref(1)

const mockData = ref([
  {
    status: 'Working',
    inputDate: toDayDate,
    plants: "Plant A",
    reactor: "R-101",
    productionCode: "porduction Code",
    productionName: "porduction Name",
    batchScaleKgs: 500,
    productCode1: "PC2311001",
    productName1: "Chemical X",
    quantityKgs1: 1000,
    quantityPcs1: 1,
    packagingType1: "Drum",
    productCode2: "PC2311001",
    productName2: "Chemical X",
    quantityKgs2: 1000,
    quantityPcs2: 1,
    packagingType2: "Drum",
    uom: "kg",
    lotNumber: "LT12345",
    producingDate: date,
    finishedDate: toDayDatePFinished.value,
    storageCondition: "Cool, Dry Place",
    checkBy: "John",
    remark: "Urgent",
    byWho: 'John',
    statusDate: getRandomDate('2023/01/01', '2023/12/31'),
  },
])

const headerDataTableItem1 = [
  {
    title: 'Production Code',
    key: 'productionCode',
  },
  {
    title: 'Production Name',
    key: 'productionName',
  },
  {
    title: 'Plant Name',
    key: 'plantName',
  },
  {
    title: 'Reactor Name',
    key: 'reactorName',
  },
  {
    title: 'Batch Scale',
    key: 'batchScaleKgs',
  },
  {
    title: 'Duration Days',
    key: 'durationDays',
  },
  {
    title: 'Action',
    key: 'action',
  },
]

const itemCodeDataTable = [
  {
    title: 'Item Code',
    key: 'itemCode',
  },
  {
    title: 'Item Name',
    key: 'itemName',
  },
  {
    title: 'Action',
    key: 'action',
  },
]

const packagingKgsDataTable = [
  {
    title: 'Packaging Code',
    key: 'itemCode',
  },
  {
    title: 'Packaging Name',
    key: 'itemName',
  },
  {
    title: 'Packaging Qty Kgs',
    key: 'packingQtyKgs',
  },
  {
    title: 'Action',
    key: 'action',
  },
]

const dataMasterForSelectFilter = ref([])

const searchForMasterDataPlan = ref(null)

const { getProductionplanMasterResult, errorMessageGetProductionPlanMaster, fetchGetProductionplanMaster } = useGetProductionPlanMasterService()

watchEffect(async () => {
  try {
    await fetchGetProductionplanMaster(
      searchForMasterDataPlan.value,
      urlApi.value,
      'ProductionPlan',
      whereHouse,
      accessTokenAtStore,
    )

    // ตรวจสอบว่า getProductionplanMasterResult มี data และเป็น array
    if (getProductionplanMasterResult.value?.data && Array.isArray(getProductionplanMasterResult.value.data)) {
      // console.log("getProductionplanMasterResult", getProductionplanMasterResult.value.data)
      dataMasterForSelectFilter.value = getProductionplanMasterResult.value.data
    } else {
      // console.warn("getProductionplanMasterResult.data is not an array")
      dataMasterForSelectFilter.value = []
    }
  } catch (error) {
    console.error("Error fetching production plan master data:", error)
    dataMasterForSelectFilter.value = []
  }
})

const toggleDirection = async key => {
  if (key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    console.log(`Sorting direction is now: ${sortDirection.value} --> ${key}`)
  }
  sortColumn.value = key
  await fetchGetProductionplan()
}

// สถานะที่เก็บข้อมูล itemCode และ packagingtype ของแผนที่เลือก
const btnSelectitem1 = ref(true)
const btnSelectitem2 = ref(false)

//--------------------------------------------- item 1 && item 2 

const dataPlanningForSave = ref([
  {
    planningID: "",
    inputDate: "",
    productionCode: "",

    product1SelectedCode: "",
    product1SelectedPackagingCode: "",
    product1PackingQtyKgs: 10,
    product1UomCount: 2,

    product2SelectedCode: "",
    product2SelectedPackagingCode: "",
    product2PackingQtyKgs: 20,
    product2UomCount: 3,

    lotNumber: "",
    producingDate: "",
    remark: "",
  },
])

const selectedItemCodeForPlan = ref([])
const selectedPackagingTypeForPlan = ref([])

const selectedProductionCode = ref([])
const selectedProductionName = ref(null)
const selectedProductionbatchScaleKgs = ref(null)
const selectedProductionDurationDays = ref(null)
const selectedProductionReactorName = ref(null)
const selectedProductionPlanName = ref(null)

const selectedItemCode = ref(productionPlan.value[1] || null)
const selectedItemName = ref(null)
const selectedPackagingType = ref(null)
const selectedPackagingName = ref(null)
const selectedPackagingKgs = ref(null)

const selectedProductionCode2 = ref([])
const selectedItemCode2 = ref(null)
const selectedItemName2 = ref(null)
const selectedPackagingType2 = ref(null)
const selectedPackagingName2 = ref(null)
const selectedPackagingKgs2 = ref(null)

//------------------------------ func get production plan service --------------------------------
const { getProductionplanResult, errorMessageGetProductionPlan, fetchGetProductionplan } = useGetProductionPlanService()

const batchSale = ref(null)
const packagingkgs1 = ref(null)
const packagingPcs1 = ref(null)
const packagingkgs2 = ref(null)
const packagingPcs2 = ref(null)

const textAlert = ref(false)

const sortColumn = ref('producingDate')
const sortDirection = ref('desc')

const packag1QtyOle = ref('')
const packag2QtyOle = ref('')

watch(async () => {
  try {
    // เรียก fetchGetProductionplan และรอให้ทำงานเสร็จ
    await fetchGetProductionplan(batchId.value, sortColumn.value, sortDirection.value, urlApi.value, 'ProductionPlan', whereHouse, accessTokenAtStore)

    // จัดรูปแบบข้อมูลก่อนเก็บลง productionPlan.value
    const formattedData = getProductionplanResult.value.data.map((item, index) => ({
      ...item, // คัดลอกข้อมูลเดิมทั้งหมด
      inputDate: formatDateDMY(item.inputDate), // จัดรูปแบบ producingDate
      producingDate: formatDateDMY(item.producingDate), // จัดรูปแบบ producingDate
      no: index + 1, // เพิ่มฟิลด์ "no" โดยเริ่มจาก 1
    }))

    // อัปเดต productionPlan.value หลังจากจัดรูปแบบ
    productionPlan.value = formattedData

    // แสดงค่าใน console
    

    // set producing date when value is null
    productionPlan.value = productionPlan.value.map(item => ({
      ...item,
      producingDate: item.producingDate && item.producingDate !== "null" ? item.producingDate : new Date().toISOString(),
    }))

    productionPlan.value.forEach(item => {
      // ตรวจสอบข้อผิดพลาด
      const resultValidate = validateSpecificRow(
        item.quantityKgs,
        item.product1PackingQtyKgs,
        item.product1UomCount,
        item.product2PackingQtyKgs,
        item.product2UomCount,
      )
  
      // เพิ่มสถานะ hasError
      item.hasError = resultValidate // true: error, false: no error
    })

    console.log("productionPlan", productionPlan.value)
    
    selectedProductionCode.value = productionPlan.value[0].productionCode

    selectedItemCodeForPlan.value = productionPlan.value[0].product1SelectedCode
    

    //---------------------------- validate ------------------------------------
    batchSale.value = productionPlan.value[0].quantityKgs || 0
    packagingkgs1.value = productionPlan.value[0].product1PackingQtyKgs || 0
    packagingPcs1.value = productionPlan.value[0].product1UomCount || 0
    packagingkgs2.value = productionPlan.value[0].product2PackingQtyKgs || 0
    packagingPcs2.value = productionPlan.value[0].product2UomCount || 0

  } catch (error) {
    // จัดการข้อผิดพลาด
    console.error("Error fetching production plan:", error)
  }
})

//------------------------- select plan --------------------

const selectItemCodeSwitch = computed(() => {
  if (btnSelectitem1.value) return selectedItemCode.value
  if (btnSelectitem2.value) return selectedItemCode2.value
  
  return [] // Default empty or fallback data
})

const showDebug = () => {
  console.log("selectedItemCode", selectedItemCode.value)
  console.log("selectedItemCode2", selectedItemCode2.value)
}

const selectPackagingTypeSwitch = computed(() => {
  if (btnSelectitem1.value) return selectedPackagingType.value
  if (btnSelectitem2.value) return selectedPackagingType2.value
  
  return [] // Default empty or fallback data
})

const selectPackagingQtySwitch = computed(() => {
  if (btnSelectitem1.value) return packag1QtyOle.value
  if (btnSelectitem2.value) return packag2QtyOle.value
  
  return [] // Default empty or fallback data
})

const colorBtnSwitch = () => {
  if(btnSelectitem2.value){
    return 'red-lighten-1'
  }else if(btnSelectitem1.value){
    return 'blue-lighten-3'
  }else{
    return '#FFFFFF'
  }
}

const colorBtnSwitchActive = () => {
  if(btnSelectitem2.value){
    return 'red-lighten-1'
  }else if(btnSelectitem1.value){
    return 'info'
  }else{
    return '#FFFFFF'
  }
}

// ฟังก์ชันสำหรับเลือก plan
const selectPlan = plan => {
  selectedItemCodeForPlan.value = plan.itemCode // อัปเดต itemCode
  selectedProductionName.value = plan.productionName
  selectedProductionbatchScaleKgs.value = plan.batchScaleKgs
  selectedProductionDurationDays.value = plan.durationDays
  selectedProductionReactorName.value = plan.reactorName
  selectedProductionPlanName.value = plan.plantName

  selectedPackagingTypeForPlan.value = plan.packagingtype // อัปเดต packagingtype
  selectedProductionCode.value = plan.productionCode

  selectedPackagingType2.value = plan.itemCode
  selectedProductionCode2.value = plan.itemCode

  selectedItemCode.value = null
  selectedItemName.value = null
  selectedPackagingType.value = null
  selectedPackagingName.value = null
  selectedPackagingKgs.value = null

  selectedItemCode2.value = null
  selectedItemName2.value = null
  selectedPackagingType2.value = null
  selectedPackagingName2.value = null
  selectedPackagingKgs2.value = null

}

const selectItemCode = plan => {
  if(btnSelectitem1.value){
    selectedItemCode.value = plan.itemCode
    selectedItemName.value = plan.itemName
    console.log("selectedItemCode", selectedItemCode.value)
  }
  if(btnSelectitem2.value){
    selectedItemCode2.value = plan.itemCode
    selectedItemName2.value = plan.itemName
    console.log("selectedItemCode2", selectedItemCode2.value)
  }
}

const selectPackaging = plan => {
  if(btnSelectitem1.value){
    selectedPackagingType.value = plan.itemCode
    selectedPackagingName.value = plan.itemName
    selectedPackagingKgs.value = plan.packingQtyKgs
    packag1QtyOle.value = plan.packingQtyKgs
    console.log("selectedPackagingType", selectedPackagingType.value)
  }
  if(btnSelectitem2.value){
    selectedPackagingType2.value = plan.itemCode
    selectedPackagingName2.value = plan.itemName
    selectedPackagingKgs2.value = plan.packingQtyKgs
    packag2QtyOle.value = plan.packingQtyKgs
    console.log("selectedProductionCode2", selectedPackagingType2.value)
  }
}

const selectedDataTables = ref([])

//--------------------------------- validate  ------------------------------
const activeBtnApprove = ref(false)
const activeBtnSubmit = ref(false)
const activeBtnCancelPlan = ref(false)
const activeBtnRejectPlan = ref(false)
const activeBtnSendBackPlan = ref(false)
const activeBtnError =ref('primary')

watch(()=> {
  
  activeBtnApprove.value = false
  activeBtnSubmit.value = false
  activeBtnCancelPlan.value = false
  activeBtnRejectPlan.value = false
  activeBtnSendBackPlan.value = false
  if(selectedDataTables.value){
    selectedDataTables.value.forEach(item => {
      // กำหนดค่าเริ่มต้น
      console.log("vselectedDataTables in", activeBtnApprove.value)
      if (item.statusId === 102 ) {
        activeBtnApprove.value = true
        activeBtnCancelPlan.value = true
        activeBtnSendBackPlan.value = true
        console.log("vselectedDataTables", activeBtnApprove.value)
      }else if(item.statusId === 101){
        activeBtnCancelPlan.value = true
        activeBtnSubmit.value = true
      }else if(item.statusId === 105){
        activeBtnRejectPlan.value = true
        activeBtnSendBackPlan.value = true
      }else if(item.statusId === 103){
        activeBtnSendBackPlan.value = true
        activeBtnRejectPlan.value = true
      }
      else{
        activeBtnApprove.value = false
        activeBtnSubmit.value = false
        activeBtnCancelPlan.value = false
        activeBtnSendBackPlan.value = false
      }

    })
    console.log("vselectedDataTables out func", activeBtnSendBackPlan.value)
  }else{
    activeBtnCancelPlan.value = false
    activeBtnApprove.value = false
    activeBtnSubmit.value = false
    activeBtnCancelPlan.value = false
    activeBtnSendBackPlan.value = false
  }


  
})

const checkDisabledBtnSelectItem2 = (selectedItemCode, product2SelectedCode) => {
  if(selectedItemCode){
    return false
  }else if(product2SelectedCode){
    return false
  }else{
    
    return true
  }
}

const realTimeValue = ref()

// สร้างตัวแปรกลางสำหรับค่าที่ต้องการ validate
const validationData = reactive({
  batchSale: (batchSale.value),
  packagingkgs1: (packagingkgs1.value),
  packagingPcs1: (packagingPcs1.value),
  packagingkgs2: (packagingkgs2.value),
  packagingPcs2: (packagingPcs2.value),
})

watch(() => {
  validationData.packagingPcs1 = packagingPcs1.value
  validationData.packagingPcs2 = packagingPcs2.value
})

// สถานะการ validate
const isValid = ref(false)

// ตัวแปรสำหรับเก็บค่าที่คำนวณได้
const calculatedValues = reactive({
  totalKgs1: 0,
  totalKgs2: 0,
  total: 0,
})

// ฟังก์ชันสำหรับ validate
const validateBatchSale = (batchSale, kgs1, pcs1, kgs2, pcs2) => {
  // คำนวณค่าต่าง ๆ
  calculatedValues.totalKgs1 = (parseInt(kgs1 || 0) * parseInt(pcs1 || 0))
  calculatedValues.totalKgs2 = (parseInt(kgs2 || 0) * parseInt(pcs2 || 0))
  calculatedValues.total = calculatedValues.totalKgs1 + calculatedValues.totalKgs2

  // console.log("Batch Sale:", batchSale)
  // console.log("Total Kgs1:", kgs1, '*', pcs1, '=', calculatedValues.totalKgs1)
  // console.log("Total Kgs2:", kgs2, '*', pcs2, '=', calculatedValues.totalKgs2)
  // console.log("Total:", calculatedValues.total)
  // console.log("Result:", batchSale, '>=', calculatedValues.total)

  return parseInt(batchSale || 0) >= calculatedValues.total
}

const validateBatchSaleRow = ref()

// Watch เพื่อทำการ validate แบบ real-time
watch(
  () => Object.values(validationData), // ติดตามการเปลี่ยนแปลงใน validationData
  () => {
    isValid.value = validateBatchSale(
      batchSale.value,
      validationData.packagingkgs1,
      validationData.packagingPcs1 || selectedPackagingKgs.value,
      validationData.packagingkgs2,
      validationData.packagingPcs2 || selectedPackagingKgs2.value,
    )

    textAlert.value = !isValid.value
    console.log("Validation passed:", isValid.value)
  },
  { immediate: true }, // ให้ทำงานทันทีเมื่อ mount
)

const validateByRow = ref(false)

const validateRequired = value => {
  if (!value) {
    return 'Value is required!'
  }
  
  return true // Return `true` explicitly
}

const validateRow = item => {
  const isError = validateSpecificRow(
    item.raw.quantityKgs,
    item.raw.product1UomCount,
    item.raw.product1PackingQtyKgs,
    item.raw.product2UomCount,
    item.raw.product2PackingQtyKgs,
  )

  if (isError) {
    item.raw.hasError = true
    activeBtnError.value = 'red' // Update color
    
    return false // Return error message
  } else {
    item.raw.hasError = false
    activeBtnError.value = 'primary' // Reset color
    
    return true // Return `true` explicitly
  }
}

const validateSpecificRow = (batchSale, kgs1, pcs1, kgs2, pcs2) =>  {

  isValid.value = validateBatchSale(
    batchSale,
    kgs1,
    pcs1,
    kgs2,
    pcs2,
  )

  return !(isValid.value)

}

watch(()=> {
  console.log("realTimeValue", validationData.packagingkgs1)
  
})

// ฟังก์ชันจัดรูปแบบวันที่
const formatDateDMY = date => {
  if (!date) return null // ถ้าไม่มีวันที่ให้คืนค่า null

  const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/
  if (isoDatePattern.test(date)) {
    const [year, month, day] = date.split('T')[0].split('-') // แยกปี เดือน วัน
    
    return `${day}/${month}/${year}` // คืนค่าในรูปแบบ dd/mm/yyyy
  }

  // คืนค่าที่ไม่ได้ถูกแปลง
  return date
}

//-------------------------------- generate lot batch ------------------------
const { responseGenerateLotBatchProductionPlan, errorMessageGenerateLotBatchProductionPlan, generateLotBatchProdutcionPlanFunc } = useGenerateBatchProductionPlanService()

const handleBtnGenerateLotBatch = async () => {
  console.log("Alert: GenerateLotBatch", isDialogVisibleAlertDialog.value)
  try {
    await generateLotBatchProdutcionPlanFunc(batchId.value, urlApi.value, 'ProductionPlan', whereHouse, accessTokenAtStore)

    if(responseGenerateLotBatchProductionPlan.value){
      textAlertDialogFunction(alertWordConst.generateLot, true)
      setTimeout(() => {
        location.reload()
      }, 500) // 10000 มิลลิวินาที = 10 วินาที
    }else{
      console.error("Error API generate lot batch production plan:", error)
      textAlertDialogFunction(alertWordConst.generateLot, false)
      setTimeout(() => {
        // location.reload()
      }, 500) // 10000 มิลลิวินาที = 10 วินาที
    }
  } catch (error) {
    console.error("Error Try generate lot batch production plan:", error)
    textAlertDialogFunction(alertWordConst.generateLot, false)
    setTimeout(() => {
      // location.reload()
    }, 500) // 10000 มิลลิวินาที = 10 วินาที
  }
}

//------------------------------ func Save add data production plan service --------------------------------
const indexSelectBoxFilter = ref(null)
const productionCodeOld = ref(null)

const selectFilterProduction = (planningID, item) => {
  // ค้นหาออบเจกต์ที่ตรงกับ planningID
  indexSelectBoxFilter.value = planningID

  const selectedPlan = productionPlan.value.find(plan => plan.planningID === planningID)

  if (!selectedPlan) {
    console.error(`PlanningID ${planningID} not found.`)
    
    return
  }

  if (item === 1) {
    btnSelectitem1.value = true
    btnSelectitem2.value = false
    console.log("Item", item, planningID)
  } else if (item === 2) {
    btnSelectitem2.value = true
    btnSelectitem1.value = false
    console.log("Item", item)
  }
  isDialogVisibleFilterSelect.value = true

  selectedProductionCode.value = selectedPlan.productionCode
  productionCodeOld.value = selectedPlan.productionCode

  selectedItemCode.value = selectedPlan.product1SelectedCode
  selectedPackagingType.value = selectedPlan.product1SelectedPackagingCode
  packag1QtyOle.value = selectedPlan.product1PackingQtyKgs

  selectedItemCode2.value = selectedPlan.product2SelectedCode
  selectedPackagingType2.value = selectedPlan.product2SelectedPackagingCode
  packag2QtyOle.value = selectedPlan.product2PackingQtyKgs

  console.log("Selected item", selectedItemCode.value)
}

const comprePorductionCode = () => {
  const success = ref(false)
  if(productionCodeOld.value === selectedProductionCode.value){
    console.log("IF")
    success.value = true
    console.log("Selected", productionCodeOld.value, "=", selectedProductionCode.value, success.value)
    
  }else{
    console.log("ELSE")
    success.value = false
    console.log("Selected", productionCodeOld.value, "=", selectedProductionCode.value, success.value)
    
  }

  return success.value
}

watchEffect(() => {
  comprePorductionCode()
})

const compireHightlight = (itemCodeNew, itemOld, ComProductionCode) => {
  if(ComProductionCode){
    if(itemCodeNew === itemOld){
      return true
    }
  }else if(!ComProductionCode){
    if(itemCodeNew === itemOld){
      return true
    }else{
      return
    }
  }
}


// eslint-disable-next-line sonarjs/cognitive-complexity
const addSelectProductionCode = planningID => {
  const selectedPlan = productionPlan.value.find(plan => plan.planningID === planningID)

  console.log('addSelectProductionCode start.....')

  if (!selectedPlan) {
    console.error(`PlanningID ${planningID} not found.`)
    
    return
  }

  const trickerItem1N2 = ref(false)

  if (selectedPlan.productionCode !== selectedProductionCode.value) {
    trickerItem1N2.value = true
    console.log("Tricker true", trickerItem1N2.value, selectedPlan.productionCode, selectedProductionCode.value)
  } else {
    trickerItem1N2.value = false
    console.log("Tricker false", trickerItem1N2.value, selectedPlan.productionCode, selectedProductionCode.value)
  }

  if (trickerItem1N2.value) {
    // Reset product2 and product1 fields
    selectedPlan.product2SelectedCode = null
    selectedPlan.product2Name = null
    selectedPlan.product2SelectedPackagingCode = null
    selectedPlan.product2PackagingName = null
    selectedPlan.product2PackingQtyKgs = null
    selectedPlan.product2UomCount = null

    selectedPlan.product1SelectedCode = null
    selectedPlan.product1Name = null
    selectedPlan.product1SelectedPackagingCode = null
    selectedPlan.product1PackagingName = null
    selectedPlan.product1PackingQtyKgs = null
    selectedPlan.product1UomCount = null
  }

  // Update product1 fields
  if (selectedItemCode.value) selectedPlan.product1SelectedCode = selectedItemCode.value
  if (selectedItemName.value) selectedPlan.product1Name = selectedItemName.value
  if (selectedPackagingType.value) selectedPlan.product1SelectedPackagingCode = selectedPackagingType.value
  if (selectedPackagingName.value) selectedPlan.product1PackagingName = selectedPackagingName.value
  if (selectedPackagingKgs.value) {
    selectedPlan.product1PackingQtyKgs = selectedPackagingKgs.value
    if (selectedProductionbatchScaleKgs.value) {
      selectedPlan.product1UomCount = Math.floor(selectedProductionbatchScaleKgs.value / selectedPackagingKgs.value)
    }
  }

  // Update product2 fields
  if (selectedItemCode2.value) selectedPlan.product2SelectedCode = selectedItemCode2.value
  if (selectedItemName2.value) selectedPlan.product2Name = selectedItemName2.value
  if (selectedPackagingType2.value) selectedPlan.product2SelectedPackagingCode = selectedPackagingType2.value
  if (selectedPackagingName2.value) selectedPlan.product2PackagingName = selectedPackagingName2.value
  if (selectedPackagingKgs2.value) {
    selectedPlan.product2PackingQtyKgs = selectedPackagingKgs2.value
    if (selectedProductionbatchScaleKgs.value) {
      selectedPlan.product2UomCount = Math.floor(selectedProductionbatchScaleKgs.value / selectedPackagingKgs2.value)
    }
  }

  // Update production details
  if (selectedProductionCode.value) selectedPlan.productionCode = selectedProductionCode.value
  if (selectedProductionName.value) selectedPlan.productionName = selectedProductionName.value
  if (selectedProductionReactorName.value) selectedPlan.reactorName = selectedProductionReactorName.value
  if (selectedProductionbatchScaleKgs.value) selectedPlan.quantityKgs = selectedProductionbatchScaleKgs.value
  if (selectedProductionPlanName.value) selectedPlan.plantName = selectedProductionPlanName.value

  console.log("Updated row:", selectedPlan)
}

const confirmFilterSelectProduction = () => {
  dataPlanningForSave.value.productionCode = selectedProductionCode.value

  console.log('confirmFilterSelectProduction start....')

  const planningID = indexSelectBoxFilter.value // Update to store planningID instead of index
  if (planningID !== null) {
    addSelectProductionCode(planningID)
  }

  isDialogVisibleFilterSelect.value = false // Close dialog
}

//------------------------------ func save production plan service --------------------------------
const { responseSaveProductionPlan, errorMessageSaveProductionPlan, saveProdutcionPlanFunc } = useSaveProductionPlanService()

const trickerSubmit = ref(false)

const saveProductionPlan = async () => {
  console.log("saveProductionPlan staret")

  // ตรวจสอบฟิลด์ inputDate และ producingDate
  productionPlan.value = productionPlan.value.map(item => ({
    ...item,
    producingDate: item.producingDate && item.producingDate !== "null" ? item.producingDate : new Date().toISOString(),
  }))

  try {

    const filteredData = productionPlan.value.map(item => ({
      planningID: item.planningID,
      inputDate: formatDateToYMD(item.inputDate),
      producingDate: item.producingDate || new Date().toISOString(),
      productionCode: item.productionCode,

      product1SelectedCode: (item.product1SelectedCode),
      product1SelectedPackagingCode: item.product1SelectedPackagingCode,
      product1PackingQtyKgs: parseInt(item.product1PackingQtyKgs) || item.product1PackingQtyKgs,
      product1UomCount: item.product1UomCount,

      product2SelectedCode: item.product2SelectedCode,
      product2SelectedPackagingCode: item.product2SelectedPackagingCode,
      product2PackingQtyKgs: parseInt(item.product2PackingQtyKgs)  || item.product2PackingQtyKgs,
      product2UomCount: item.product2UomCount,

      lotNumber: item.lotNumber,
      producingDate: formatDateYMDWhyQ(item.producingDate),
      remark: item.remark,
    }))


    // ส่งข้อมูลที่กรองแล้วไปยัง API
    await saveProdutcionPlanFunc(filteredData, urlApi.value, 'ProductionPlan', whereHouse, accessTokenAtStore)
    if(responseSaveProductionPlan.value){
      if(!trickerSubmit.value){
        textAlertDialogFunction(alertWordConst.saveDraft, true)
        setTimeout(() => {
          location.reload()
        }, 500) // 10000 มิลลิวินาที = 10 วินาที
        console.log("Filtered Production Plan Saved:", filteredData)
      }
      
    }else{
      if(!trickerSubmit.value){
        textAlertDialogFunction(alertWordConst.saveDraft, false)
        setTimeout(() => {
        // location.reload()
        }, 500) // 10000 มิลลิวินาที = 10 วินาที
      }
    }

  } catch (error) {
    if(!trickerSubmit.value){
      // จัดการข้อผิดพลาด
      textAlertDialogFunction(alertWordConst.saveDraft, false)
      setTimeout(() => {
      // location.reload()
      }, 500) // 10000 มิลลิวินาที = 10 วินาที
      console.error("Error saving production plan:", error)
    }
  }
}

//--- func new plan service --------------------------------

const { responseNewProductionPlan, errorMessageNewProductionPlan, newProdutcionPlanFunc } = useNewProductionPlanService()

//---------------------------- Add Mock Data --------------------------------
const isDialogAddVisible = ref(false)

const selectedItemNamePD = ref(null)

// computed property to extract product names
const productNamesMockItems = computed(() => mockData.value.map(item => item.productionCode))

const findProductByName = productionCode => {
  return mockData.value.find(item => item.productionCode === productionCode) || {}
}

const selectedItem = ref(null)


const { getBatchProductionplanResult, errorMessageGetBatchProductionPlan, fetchGetBatchProductionplan } = useGetBatchProductionPlanService()

const genPlanningIdGUID = async () => {
  await fetchGetBatchProductionplan(urlApi.value, 'ProductionPlan', whereHouse, accessTokenAtStore)

  return getBatchProductionplanResult.value
}

// add plan productionPlan
const addEmptyRowToPlan = async () => {

  console.log("guIDForBatchCookie", itemStore.getItemDetails('guIDForBatchCookie'))

  planningId.value = await genPlanningIdGUID()

  await newProdutcionPlanFunc(batchId.value, planningId.value, urlApi.value, 'ProductionPlan', whereHouse, accessTokenAtStore)

  if(responseNewProductionPlan.value){
    console.log("New Plan Success")
    textAlertDialogFunction(alertWordConst.newPlan, true)
    setTimeout(() => {
      location.reload()
    }, 500) // 10000 มิลลิวินาที = 10 วินาที
  }else{
    console.log("New Plan Not Success")
    textAlertDialogFunction(alertWordConst.newPlan, false)
    setTimeout(() => {
      // location.reload()
    }, 500) // 10000 มิลลิวินาที = 10 วินาที
  }
  
  countItemProduction.value+= 1
}

// ฟังก์ชันสำหรับอัพเดทข้อมูลเมื่อเลือกชื่อสินค้า

//--------------------- delete plan
const { responseDeleteProductionPlan, errorMessageDeleteProductionPlan, deleteProdutcionPlanFunc } = useDeleteProductionPlanService()

const showSelectBox = () => {
  console.log("selectedDataTables", selectedDataTables.value)
}

const deletePlan = async () => {

  // console.log("selectedDataTables", selectedDataTables.value)

  const body = selectedDataTables.value.map(item => item.planningID)

  try {
    // เรียก fetchGetProductionplan และรอให้ทำงานเสร็จ
    await deleteProdutcionPlanFunc(body, urlApi.value, 'ProductionPlan', whereHouse, accessTokenAtStore)
    textAlertDialogFunction(alertWordConst.cancel, true)
    setTimeout(() => {
      location.reload()
    }, 500) // 10000 มิลลิวินาที = 10 วินาที
  } catch (error) {
    // จัดการข้อผิดพลาด
    console.error("Error deleted production plan:", error)
  }

  console.log("body selectedDataTables", body)
}

//------------------------- reject plan

const { responseRejectProductionPlan, errorMessageRejectProductionPlan, rejectProdutcionPlanFunc } = useRejectProductionPlanService()

const rejectPlan = async () => {
  const body = selectedDataTables.value.map(item => item.planningID)

  if(!statusCommnetValue.value){
    textAlertDialogFunction("Plase Enter Comment.", false)
    
    return
  }

  try {
    // เรียก fetchGetProductionplan และรอให้ทำงานเสร็จ
    await rejectProdutcionPlanFunc(statusCommnetValue.value, body, urlApi.value, 'ProductionPlan', whereHouse, accessTokenAtStore)
    textAlertDialogFunction(alertWordConst.reject, true)
    setTimeout(() => {
      location.reload()
    }, 500) // 10000 มิลลิวินาที = 10 วินาที
  } catch (error) {
    // จัดการข้อผิดพลาด
    console.error("Error deleted production plan:", error)
  }

  console.log("body selectedDataTables", body)
}

//------------------------  validate lot --------------------------------------------------

const { responseValidateLotBatchProductionPlan, errorMessageValidateLotBatchProductionPlan, validateLotBatchProdutcionPlanFunc } = useValidateBatchProductionPlanService()

const validateLotBeforeSubmit = async () => {
  const body = selectedDataTables.value.map(item => item.planningID)

  const requiredFields = [
    "inputDate",
    "productionCode",
    "product1SelectedCode",
    "product1Name",
    "product1SelectedPackagingCode",
    "product1PackingQtyKgs",
    "product1UomCount",
    "lotNumber",
    "planningID",
    "producingDate",
  ]

  // ตรวจสอบฟิลด์ที่ไม่มีค่า
  let hasErrors = false

  selectedDataTables.value.forEach(item => {
    // กำหนดค่าเริ่มต้น
    if (!item.missingFields) {
      item.missingFields = []
    }

    // ตรวจสอบฟิลด์ที่ต้องมีสำหรับ product1
    requiredFields.forEach(field => {
      if (isFieldMissing(item, field)) {
        item.missingFields.push(field)
        hasErrors = true // หากพบฟิลด์ที่ไม่มีค่า
      }
    })

    // ตรวจสอบเงื่อนไข product2
    const hasProduct2Values =
      item.product2SelectedCode &&
      item.product2SelectedPackagingCode &&
      item.product2PackingQtyKgs &&
      item.product2UomCount

    const isProduct2Empty =
      !item.product2SelectedCode &&
      !item.product2SelectedPackagingCode &&
      !item.product2PackingQtyKgs &&
      !item.product2UomCount

    if (!isProduct2Empty && !hasProduct2Values) {
      hasErrors = true
      item.missingFields.push(
        "product2SelectedCode",
        "product2SelectedPackagingCode",
        "product2PackingQtyKgs",
        "product2UomCount",
      )
    }
  })

  // ถ้ามีฟิลด์ที่ไม่มีค่า ให้หยุดและแจ้งเตือน
  if (hasErrors) {
    textAlertSubDialogFunction(alertWordConst.submit, "Please check input. Some fields are missing.", false)
    setTimeout(() => {
      location.reload()
    }, 1200)
    console.warn("Some fields are missing:", selectedDataTables.value)
    trickerSubmit.value = false
    
    return // หยุดการทำงานถ้าข้อมูลไม่ครบ
  }

  try {
    // เรียก fetchGetProductionplan และรอให้ทำงานเสร็จ
    const result = await validateLotBatchProdutcionPlanFunc(body, urlApi.value, 'ProductionPlan', whereHouse, accessTokenAtStore)
    if(responseValidateLotBatchProductionPlan.value){
      // textAlertDialogFunction(responseValidateLotBatchProductionPlan.value, true)
      // setTimeout(() => {
      //   isDialogVisibleAlertDialog.value = false
      // }, 500) // 10000 มิลลิวินาที = 10 วินาที
      await submitPlan()
    }else{
      // textAlertDialogFunction(errorMessageValidateLotBatchProductionPlan.value, false)
      alertValidate.value = errorMessageValidateLotBatchProductionPlan.value
      isDialogVisibleConfirmLotValidateDialog.value = true
    }

  } catch (error) {
    // จัดการข้อผิดพลาด
    console.error("Error deleted production plan:", error)
    console.error("Error deleted production plan:", errorMessageValidateLotBatchProductionPlan.value)
  }

  console.log("body selectedDataTables", body)
}

//------------------------- submit plan
const { responseSubmitProductionPlan, errorMessageSubmitProductionPlan, submitProdutcionPlanFunc } = useSubmitProductionPlanService()

const isFieldMissing = (item, field) => {
  return item[field] === null || item[field] === undefined || item[field] === ""
}

const submitPlan = async () => {
  trickerSubmit.value = true
  await saveProductionPlan()

  const requiredFields = [
    "inputDate",
    "productionCode",
    "product1SelectedCode",
    "product1Name",
    "product1SelectedPackagingCode",
    "product1PackingQtyKgs",
    "product1UomCount",
    "lotNumber",
    "planningID",
    "producingDate",
  ]

  // ตรวจสอบฟิลด์ที่ไม่มีค่า
  let hasErrors = false

  selectedDataTables.value.forEach(item => {
    // กำหนดค่าเริ่มต้น
    if (!item.missingFields) {
      item.missingFields = []
    }

    // ตรวจสอบฟิลด์ที่ต้องมีสำหรับ product1
    requiredFields.forEach(field => {
      if (isFieldMissing(item, field)) {
        item.missingFields.push(field)
        hasErrors = true // หากพบฟิลด์ที่ไม่มีค่า
      }
    })

    // ตรวจสอบเงื่อนไข product2
    const hasProduct2Values =
      item.product2SelectedCode &&
      item.product2SelectedPackagingCode &&
      item.product2PackingQtyKgs &&
      item.product2UomCount

    const isProduct2Empty =
      !item.product2SelectedCode &&
      !item.product2SelectedPackagingCode &&
      !item.product2PackingQtyKgs &&
      !item.product2UomCount

    if (!isProduct2Empty && !hasProduct2Values) {
      hasErrors = true
      item.missingFields.push(
        "product2SelectedCode",
        "product2SelectedPackagingCode",
        "product2PackingQtyKgs",
        "product2UomCount",
      )
    }
  })

  // ถ้ามีฟิลด์ที่ไม่มีค่า ให้หยุดและแจ้งเตือน
  if (hasErrors) {
    textAlertSubDialogFunction(alertWordConst.submit, "Please check input. Some fields are missing.", false)
    setTimeout(() => {
      location.reload()
    }, 1200)
    console.warn("Some fields are missing:", selectedDataTables.value)
    trickerSubmit.value = false
    
    return // หยุดการทำงานถ้าข้อมูลไม่ครบ
  }

  // ดำเนินการเรียก API ถ้าข้อมูลครบถ้วน
  try {
    const body = selectedDataTables.value.map(item => item.planningID)

    await submitProdutcionPlanFunc(
      body,
      urlApi.value,
      "ProductionPlan",
      whereHouse,
      accessTokenAtStore,
    )

    if (responseSubmitProductionPlan.value) {
      textAlertDialogFunction(alertWordConst.submit, true)
      setTimeout(() => {
        location.reload()
      }, 500)
    } else if (errorMessageSubmitProductionPlan.value) {
      textAlertSubDialogFunction(alertWordConst.submit, errorMessageSubmitProductionPlan.value, false)
      setTimeout(() => {
        location.reload()
      }, 1000)
      trickerSubmit.value = false

      console.log("AlertDialog Submit", errorMessageSubmitProductionPlan.value, responseSubmitProductionPlan.value)
    }
  } catch (error) {
    console.error("Error submitting production plan:", error)
    textAlertDialogFunction(alertWordConst.submit, false)
    setTimeout(() => {
      location.reload()
    }, 1000)
    trickerSubmit.value = false
  }
}


//------------------------- approve plan
const { responseApproveProductionPlan, errorMessageApproveProductionPlan, approveProdutcionPlanFunc } = useApproveProductionPlanService()


const approvePlan = async () => {

  // console.log("selectedDataTables", selectedDataTables.value)

  const body = selectedDataTables.value.map(item => item.planningID)

  try {
  // เรียก fetchGetProductionplan และรอให้ทำงานเสร็จ
    await approveProdutcionPlanFunc(body, urlApi.value, 'ProductionPlan', 'approve', whereHouse, accessTokenAtStore)
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

  console.log("body selectedDataTables", body)
}

const sendBackPlan = async () => {

  // console.log("selectedDataTables", selectedDataTables.value)

  const body = selectedDataTables.value.map(item => item.planningID)

  try {
    // เรียก fetchGetProductionplan และรอให้ทำงานเสร็จ
    await approveProdutcionPlanFunc(body, urlApi.value, 'ProductionPlan', 'back', whereHouse, accessTokenAtStore)
    if(responseApproveProductionPlan.value){
      textAlertDialogFunction(alertWordConst.sendBack, true)
      setTimeout(() => {
        location.reload()
      }, 500) // 10000 มิลลิวินาที = 10 วินาที
    }else{
      textAlertDialogFunction(alertWordConst.sendBack, false)
      setTimeout(() => {
      // location.reload()
      }, 500) // 10000 มิลลิวินาที = 10 วินาที
    }
  } catch (error) {
    // จัดการข้อผิดพลาด
  
    console.error("Error approved production plan:", error)
  }

  console.log("body selectedDataTables", body)
}

const cancelAllProducts = () => {
  productionPlan.value = []
}

const viewAllData = () => {
  console.log('ALl Data Date', productionPlan.value)
}

const selectedDateInput = ref(toDayDate)
const rules = [v => v.length <= 150 || 'Max 25 characters']

//---------------------------------

const items = [
  'Programming',
  'Design',
  'Vue',
  'Vuetify',
]

///------------------------------------------------------------------------------
const panel = ref(['filter'])

const addBatch = ref(false)

const currentPageDataTable = ref(1)

const refeshPage = () => {
  isSpinning.value = true
  setTimeout(() => {
    isSpinning.value = false
  }, 10*1000) // ระยะเวลาในการหมุน (1000 มิลลิวินาที = 1 วินาที)
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
    sortable: false,
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

  // {
  //   title: 'Plants',
  //   key: 'plants',
  // },
  {
    title: 'Production Code',
    sortable: false,
    key: 'productionCode',
  },
  {
    title: 'Reactor',
    key: 'reactorName',
    sortable: false,
  },
 
  {
    title: 'Production Name',
    key: 'productionName',
    sortable: false,
  },
  {
    title: 'Batch Scale(Kgs)',
    sortable: false,
    key: 'quantityKgs',
  },
  {
    title: 'Item Code1',
    sortable: false,
    key: 'product1SelectedCode',
    class: 'my-header-style',
  },
  {
    title: 'Item Name1',
    key: 'product1Name',
    sortable: false,
  },
  {
    title: 'Packaging Type1',
    sortable: false,
    key: 'product1SelectedPackagingCode',
  },
  {
    title: 'Packaging Kgs1',
    sortable: false,
    key: 'product1PackingQtyKgs',
  },
  {
    title: 'Packaging Pcs1',
    sortable: false,
    key: 'product1UomCount',
  },

  //---------------
  {
    title: 'Item Code2',
    sortable: false,
    key: 'product2SelectedCode',
  },
  {
    title: 'Item Name2',
    sortable: false,
    key: 'product2Name',
  },
  {
    title: 'Packaging Type2',
    sortable: false,
    key: 'product2SelectedPackagingCode',
  },
  {
    title: 'Packaging Kgs2',
    sortable: false,
    key: 'product2PackingQtyKgs',
  },
  {
    title: 'Packaging Pcs2',
    sortable: false,
    key: 'product2UomCount',
  },

  //----------------------------
  {
    title: 'Lot',
    sortable: false,
    key: 'lotNumber',
  },
  {
    title: 'Producing Date',
    sortable: false,
    key: 'producingDate',
  },
  {
    title: 'Finished Date',
    sortable: false,
    key: 'finishedDate',
  },
  
  {
    title: 'Remark',
    sortable: false,
    key: 'remark',
  },
  {
    title: 'Updated By',
    sortable: false,
    key: 'updatedBy',
  },
  {
    title: 'Updated Date',
    sortable: false,
    key: 'updateDated',
  },

  // {
  //   title: 'Action',
  //   key: 'action',
  // },
]

///---------------------- Filter Select
const isDialogVisibleFilterSelect = ref(false)

// ตัวอย่างฟังก์ชันของแต่ละ action
const saveDraft = () => {
  console.log('Draft saved')
}

const deleteItem = () => {
  console.log('Item deleted')
}

const submit = () => {
  console.log('Submitted')
  window.location.href = '/skt/planning/schedule/plan'
}

const print = () => {
  console.log('Printed')
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

      console.log('Status Text Code Result:', itemsStatus.value)
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
                :to="{ name: 'skt-planning-schedule',
                }"
              >
                <VIcon

                  size="30"
                  icon="ri-arrow-left-circle-fill"
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
            />
          </VRow>
        </div>
      </VCardTitle>
    </VCard>
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

  <!-- Dialog Filter Select -->
  <section>
    <VDialog
      v-model="isDialogVisibleFilterSelect"
      persistent
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardTitle class="d-flex justify-center">
          <h3>Production Plan Setting</h3>
        </VCardTitle>
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogVisibleFilterSelect = false"
        />

        <VCardText class="py-2">
          <VRow class="py-4">
            <!-- ตาราง 1: Production Code -->
            <VRow class="mb-1">
              <VCol cols="10">
                <VBtn
                  v-if="false"
                  color="light-blue-lighten-1"
                  :variant="btnSelectitem1 ? 'tonal' : 'flat'"
                  @click="btnSelectitem1 = true, btnSelectitem2 = false"
                >
                  Item 1
                </VBtn> 
                <VBtn
                  v-if="false"
                  color="red-lighten-1"
                  :variant="btnSelectitem2 ? 'tonal' : 'flat'"
                  @click="btnSelectitem1 = false, btnSelectitem2 = true"
                >
                  Item 2
                </VBtn>
              </VCol>
              <VCol
                cols="2"
                class="d-flex justify-end"
              >
                <VBtn
                  color="info"
                  @click="confirmFilterSelectProduction"
                >
                  Confirm
                </VBtn>
              </VCol>
            </VRow>
            <VCol
              style="border: 1px solid grey; border-radius: 20px;"
              cols="12"
              class="mb-4"
            >
              <div class="d-flex justify-center">
                <h4>Production</h4>
              </div>
              <div class="d-flex justify-start">
                <VTextField
                  v-model="searchForMasterDataPlan"
                  style="max-width: 500px;"
                  label="Search"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                  single-line
                />
              </div>
              <VDataTable
                v-if="dataMasterForSelectFilter.length > 0"
                :headers="headerDataTableItem1"
                :items="dataMasterForSelectFilter"
                :items-per-page="10"
                class="text-no-wrap"
              >
                <template #item="{ item }">
                  <tr>
                    <td
                      :style="{
                        background:
                          item.raw.productionCode === selectedProductionCode && btnSelectitem2
                            ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                            : item.raw.productionCode === selectedProductionCode && btnSelectitem1
                              ? '#D3E3FC' // เงื่อนไขแรก
                              : '#FFFFFF', // ค่าเริ่มต้น
                      }"
                    >
                      <span style="font-size: 12px;">{{ item.raw.productionCode }}</span>
                    </td>
                    <td
                      :style="{
                        background:
                          item.raw.productionCode === selectedProductionCode && btnSelectitem2
                            ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                            : item.raw.productionCode === selectedProductionCode && btnSelectitem1
                              ? '#D3E3FC' // เงื่อนไขแรก
                              : '#FFFFFF', // ค่าเริ่มต้น
                      }"
                    >
                      <span style="font-size: 12px;">{{ item.raw.productionName }}</span>
                    </td>
                    <td
                      :style="{
                        background:
                          item.raw.productionCode === selectedProductionCode && btnSelectitem2
                            ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                            : item.raw.productionCode === selectedProductionCode && btnSelectitem1
                              ? '#D3E3FC' // เงื่อนไขแรก
                              : '#FFFFFF', // ค่าเริ่มต้น
                      }"
                    >
                      <span style="font-size: 12px;">{{ item.raw.plantName }}</span>
                    </td>
                    <td
                      :style="{
                        background:
                          item.raw.productionCode === selectedProductionCode && btnSelectitem2
                            ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                            : item.raw.productionCode === selectedProductionCode && btnSelectitem1
                              ? '#D3E3FC' // เงื่อนไขแรก
                              : '#FFFFFF', // ค่าเริ่มต้น
                      }"
                    >
                      <span style="font-size: 12px;">{{ item.raw.reactorName }}</span>
                    </td>
                    <td
                      :style="{
                        background:
                          item.raw.productionCode === selectedProductionCode && btnSelectitem2
                            ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                            : item.raw.productionCode === selectedProductionCode && btnSelectitem1
                              ? '#D3E3FC' // เงื่อนไขแรก
                              : '#FFFFFF', // ค่าเริ่มต้น
                      }"
                    >
                      <span style="font-size: 12px;">{{ formatNumber(item.raw.batchScaleKgs) }}</span>
                    </td>
                    <td
                      :style="{
                        background:
                          item.raw.productionCode === selectedProductionCode && btnSelectitem2
                            ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                            : item.raw.productionCode === selectedProductionCode && btnSelectitem1
                              ? '#D3E3FC' // เงื่อนไขแรก
                              : '#FFFFFF', // ค่าเริ่มต้น
                      }"
                    >
                      <span style="font-size: 12px;">{{ item.raw.durationDays }}</span>
                    </td>
                    <td
                      :style="{
                        background:
                          item.raw.productionCode === selectedProductionCode && btnSelectitem2
                            ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                            : item.raw.productionCode === selectedProductionCode && btnSelectitem1
                              ? '#D3E3FC' // เงื่อนไขแรก
                              : '#FFFFFF', // ค่าเริ่มต้น
                      }"
                    >
                      <VBtn
                        v-if="item.raw.productionCode === selectedProductionCode"
                        :color="colorBtnSwitch()"
                        variant="tonal"
                        :disabled="btnSelectitem2"
                        @click="selectPlan(item.raw, index)"
                      >
                        Select
                      </VBtn>
                      <VBtn
                        v-if="item.raw.productionCode !== selectedProductionCode"
                        :disabled="btnSelectitem2"
                        :color="colorBtnSwitchActive()"
                        variant="flat"
                        @click="selectPlan(item.raw, index)"
                      >
                        <span style="font-size: 12px;">Select</span>
                      </VBtn>
                    </td>
                  </tr>
                </template>
              </VDataTable>
            </VCol>

            <!-- ตาราง 2: Item Code -->
            <VCol
              style="border: 1px solid grey; border-radius: 20px;"
              cols="6" 
              :style="{
                background:
                  selectedProductionCode && btnSelectitem2
                    ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                    : selectedProductionCode && btnSelectitem1
                      ? '#D3E3FC' // เงื่อนไขแรก
                      : '#FFFFFF', // ค่าเริ่มต้น
              }"
            >
              <div class="d-flex justify-center">
                <VTextField
                  v-if="false"
                  v-model="searchForMasterDataPlan"
                  label="Search"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                  single-line
                />
                <h5>Item</h5>
              </div>
              <VDataTable
                v-if="selectedProductionCode"
                :headers="itemCodeDataTable"
                :items="dataMasterForSelectFilter.find(
                  (data) => data.productionCode === selectedProductionCode
                ).products"
                :items-per-page="10"
                class="text-no-wrap"
              >
                <template #item="{ item }">
                  <tr>
                    <td
                      :style="{
                        background:
                          item.raw.itemCode === selectItemCodeSwitch && btnSelectitem2
                            ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                            : item.raw.itemCode === selectItemCodeSwitch && btnSelectitem1
                              ? '#D3E3FC' // เงื่อนไขแรก
                              : '#FFFFFF', // ค่าเริ่มต้น
                      }"
                    >
                      <span style="font-size: 12px;">{{ item.raw.itemCode }}</span>
                    </td>
                    <td
                      :style="{
                        background:
                          item.raw.itemCode === selectItemCodeSwitch && btnSelectitem2
                            ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                            : item.raw.itemCode === selectItemCodeSwitch && btnSelectitem1
                              ? '#D3E3FC' // เงื่อนไขแรก
                              : '#FFFFFF', // ค่าเริ่มต้น
                      }"
                    >
                      <span style="font-size: 12px;">{{ item.raw.itemName }}</span>
                    </td>
                    <td
                      :style="{
                        background:
                          item.raw.itemCode === selectItemCodeSwitch && btnSelectitem2
                            ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                            : item.raw.itemCode === selectItemCodeSwitch && btnSelectitem1
                              ? '#D3E3FC' // เงื่อนไขแรก
                              : '#FFFFFF', // ค่าเริ่มต้น
                      }"
                    >
                      <VBtn
                        v-if="item.raw.itemCode === selectItemCodeSwitch"
                        :color="colorBtnSwitch()"
                        variant="tonal"
                        @click="selectItemCode(item.raw, index)"
                      >
                        Select
                      </VBtn>
                      <VBtn
                        v-if="item.raw.itemCode !== selectItemCodeSwitch"
                        :color="colorBtnSwitchActive()"
                        variant="flat"
                        @click="selectItemCode(item.raw, index)"
                      >
                        <span style="font-size: 12px;">Select</span>
                      </VBtn>
                    </td>
                  </tr>
                </template>
              </VDataTable>
            </VCol>

            <!-- ตาราง 3: Packaging Type -->
            <VCol
              style="border: 1px solid grey; border-radius: 20px;"
              cols="6"
              :style="{
                background:
                  selectedProductionCode && btnSelectitem2
                    ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                    : selectedProductionCode && btnSelectitem1
                      ? '#D3E3FC' // เงื่อนไขแรก
                      : '#FFFFFF', // ค่าเริ่มต้น
              }"
            >
              <div class="d-flex justify-center">
                <VTextField
                  v-if="false"
                  v-model="searchForMasterDataPlan"
                  label="Search"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                  single-line
                />
                <h5>Packaging</h5>
              </div>
              <VDataTable
                v-if="selectedProductionCode"
                :headers="packagingKgsDataTable"
                :items="dataMasterForSelectFilter.find(
                  (data) => data.productionCode === selectedProductionCode
                ).packagings"
                :items-per-page="10"
                class="text-no-wrap"
              >
                <template #item.id="{ item }">
                  <span class="text-h6">{{ item.id }}</span>
                </template>

                <template #item="{ item }">
                  <tr>
                    <td
                      :style="{
                        background:
                          item.raw.itemCode === selectPackagingTypeSwitch && btnSelectitem2 && item.raw.packingQtyKgs === selectPackagingQtySwitch
                            ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                            : item.raw.itemCode === selectPackagingTypeSwitch && btnSelectitem1 && item.raw.packingQtyKgs === selectPackagingQtySwitch
                              ? '#D3E3FC' // เงื่อนไขแรก
                              : '#FFFFFF', // ค่าเริ่มต้น
                      }"
                    >
                      <span style="font-size: 12px;">{{ item.raw.itemCode }}</span>
                    </td>
                    <td
                      :style="{
                        background:
                          item.raw.itemCode === selectPackagingTypeSwitch && btnSelectitem2 && item.raw.packingQtyKgs === selectPackagingQtySwitch
                            ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                            : item.raw.itemCode === selectPackagingTypeSwitch && btnSelectitem1 && item.raw.packingQtyKgs === selectPackagingQtySwitch
                              ? '#D3E3FC' // เงื่อนไขแรก
                              : '#FFFFFF', // ค่าเริ่มต้น
                      }"
                    >
                      <span style="font-size: 12px;">{{ item.raw.itemName }} </span>
                    </td>
                    <td
                      :style="{
                        background:
                          item.raw.itemCode === selectPackagingTypeSwitch && btnSelectitem2 && item.raw.packingQtyKgs === selectPackagingQtySwitch
                            ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                            : item.raw.itemCode === selectPackagingTypeSwitch && btnSelectitem1 && item.raw.packingQtyKgs === selectPackagingQtySwitch
                              ? '#D3E3FC' // เงื่อนไขแรก
                              : '#FFFFFF', // ค่าเริ่มต้น
                      }"
                    >
                      <span
                        class="text-end"
                        style="font-size: 12px;"
                      >{{ formatNumber(item.raw.packingQtyKgs) }}</span>
                    </td>
                    <td
                      :style="{
                        background:
                          item.raw.itemCode === selectPackagingTypeSwitch && btnSelectitem2 && item.raw.packingQtyKgs === selectPackagingQtySwitch
                            ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                            : item.raw.itemCode === selectPackagingTypeSwitch && btnSelectitem1 && item.raw.packingQtyKgs === selectPackagingQtySwitch
                              ? '#D3E3FC' // เงื่อนไขแรก
                              : '#FFFFFF', // ค่าเริ่มต้น
                      }"
                    >
                      <VBtn
                        v-if="item.raw.itemCode === selectPackagingTypeSwitch && item.raw.packingQtyKgs === selectPackagingQtySwitch"
                        :color="colorBtnSwitch()"
                        variant="tonal"
                        @click="selectPackaging(item.raw)"
                      >
                        Select
                      </VBtn>
                      <VBtn
                        v-else
                        :color="colorBtnSwitchActive()"
                        variant="flat"
                        @click="selectPackaging(item.raw)"
                      >
                        Select
                      </VBtn>
                    </td>
                  </tr>
                </template>
              </VDataTable>
            </VCol>

            <!-- ตาราง 4: Semi -->
            <VCol
              v-if="false"
              cols="3"
            />
            <VCol
              v-if="false"
              style="border: 1px solid grey; border-radius: 20px;"
              cols="6"
              class="mt-4"
              :style="{
                background:
                  selectedProductionCode && btnSelectitem2
                    ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                    : selectedProductionCode && btnSelectitem1
                      ? '#D3E3FC' // เงื่อนไขแรก
                      : '#FFFFFF', // ค่าเริ่มต้น
              }"
            >
              <div class="d-flex justify-center">
                <VTextField
                  v-if="false"
                  v-model="searchForMasterDataPlan"
                  label="Search"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                  single-line
                />
                <h5>Semi</h5>
              </div>
              <VDataTable
                v-if="selectedProductionCode"
                :headers="packagingKgsDataTable"
                :items="dataMasterForSelectFilter.find(
                  (data) => data.productionCode === selectedProductionCode
                ).packagings"
                :items-per-page="10"
                class="text-no-wrap"
              >
                <template #item.id="{ item }">
                  <span class="text-h6">{{ item.id }}</span>
                </template>

                <template #item="{ item }">
                  <tr>
                    <td
                      :style="{
                        background:
                          item.raw.itemCode === selectPackagingTypeSwitch && btnSelectitem2 && item.raw.packingQtyKgs === selectPackagingQtySwitch
                            ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                            : item.raw.itemCode === selectPackagingTypeSwitch && btnSelectitem1 && item.raw.packingQtyKgs === selectPackagingQtySwitch
                              ? '#D3E3FC' // เงื่อนไขแรก
                              : '#FFFFFF', // ค่าเริ่มต้น
                      }"
                    >
                      <span style="font-size: 12px;">{{ item.raw.itemCode }}</span>
                    </td>
                    <td
                      :style="{
                        background:
                          item.raw.itemCode === selectPackagingTypeSwitch && btnSelectitem2 && item.raw.packingQtyKgs === selectPackagingQtySwitch
                            ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                            : item.raw.itemCode === selectPackagingTypeSwitch && btnSelectitem1 && item.raw.packingQtyKgs === selectPackagingQtySwitch
                              ? '#D3E3FC' // เงื่อนไขแรก
                              : '#FFFFFF', // ค่าเริ่มต้น
                      }"
                    >
                      <span style="font-size: 12px;">{{ item.raw.itemName }} </span>
                    </td>
                    <td
                      :style="{
                        background:
                          item.raw.itemCode === selectPackagingTypeSwitch && btnSelectitem2 && item.raw.packingQtyKgs === selectPackagingQtySwitch
                            ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                            : item.raw.itemCode === selectPackagingTypeSwitch && btnSelectitem1 && item.raw.packingQtyKgs === selectPackagingQtySwitch
                              ? '#D3E3FC' // เงื่อนไขแรก
                              : '#FFFFFF', // ค่าเริ่มต้น
                      }"
                    >
                      <span
                        class="text-end"
                        style="font-size: 12px;"
                      >{{ formatNumber(item.raw.packingQtyKgs) }}</span>
                    </td>
                    <td
                      :style="{
                        background:
                          item.raw.itemCode === selectPackagingTypeSwitch && btnSelectitem2 && item.raw.packingQtyKgs === selectPackagingQtySwitch
                            ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                            : item.raw.itemCode === selectPackagingTypeSwitch && btnSelectitem1 && item.raw.packingQtyKgs === selectPackagingQtySwitch
                              ? '#D3E3FC' // เงื่อนไขแรก
                              : '#FFFFFF', // ค่าเริ่มต้น
                      }"
                    >
                      <VBtn
                        v-if="item.raw.itemCode === selectPackagingTypeSwitch && item.raw.packingQtyKgs === selectPackagingQtySwitch"
                        :color="colorBtnSwitch()"
                        variant="tonal"
                        @click="selectPackaging(item.raw)"
                      >
                        Select
                      </VBtn>
                      <VBtn
                        v-else
                        :color="colorBtnSwitchActive()"
                        variant="flat"
                        @click="selectPackaging(item.raw)"
                      >
                        Select
                      </VBtn>
                    </td>
                  </tr>
                </template>
              </VDataTable>
            </VCol>
            <VCol
              v-if="false"
              cols="3"
            />
          </VRow>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <div
    v-if="RoleAccount === 'User'"
    class="my-2"
  >
    <VCard>
      <VCardText class="pa-2">
        <VBtn
          v-if="canVisibleUserPermission(statusPermission,'NEW_PLAN').canVisible"
          :disabled="!canVisibleUserPermission(statusPermission,'NEW_PLAN').canExecute"
          class="mx-1"
          color="orange-darken-3"
          @click="addEmptyRowToPlan"
        >
          <span style="font-size: 12px;">New Plan</span>
        </VBtn>
        <VBtn
          v-if="canVisibleUserPermission(statusPermission,'SAVE_DRAFT').canVisible"
          :disabled="!canVisibleUserPermission(statusPermission,'SAVE_DRAFT').canExecute"
          class="mx-1"
          color="warning"
          @click="saveProductionPlan"
        >
          <span style="font-size: 12px;">Save Draft</span>
        </VBtn>
        <VBtn
          v-if="canVisibleUserPermission(statusPermission,'GENLOT').canVisible"
          :disabled="!canVisibleUserPermission(statusPermission,'GENLOT').canExecute && !productionPlan"
          color="info"
          class="mx-1"
          @click="handleBtnGenerateLotBatch"
        >
          <span style="font-size: 12px;">Gen Lot</span>
        </VBtn>
        <VBtn
          v-if="canVisibleUserPermission(statusPermission,'DELETE_PLAN').canVisible"
          color="error"
          :disabled="!activeBtnCancelPlan || !canVisibleUserPermission(statusPermission,'DELETE_PLAN').canExecute"
          class="mx-1"
          @click="deletePlan"
        >
          <span style="font-size: 12px;">Delete Plan</span>
        </VBtn>
        <VBtn
          v-if="canVisibleUserPermission(statusPermission,'SUBMIT').canVisible"
          class="mx-1"
          color="light-green-darken-1"
          :disabled="!activeBtnSubmit || !canVisibleUserPermission(statusPermission,'DELETE_PLAN').canExecute"
          @click="btnSubmitConfirm"
        >
          <span style="font-size: 12px;">Submit</span>
        </VBtn>
        <VBtn
          v-if="canVisibleUserPermission(statusPermission,'APPROVE').canVisible"
          class="mx-1"
          :disabled="!activeBtnApprove || !canVisibleUserPermission(statusPermission,'APPROVE').canExecute"
          @click="openConfirmDialog"
        >
          <span style="font-size: 12px;">Approve</span>
        </VBtn>
        <VBtn
          v-if="canVisibleUserPermission(statusPermission,'REJECT_PLAN').canVisible"
          :disabled="!activeBtnRejectPlan || !canVisibleUserPermission(statusPermission,'REJECT_PLAN').canExecute"
          color="error"
          class="mx-1"
          @click="btnRejectConfirm"
        >
          <span style="font-size: 12px;">Reject Plan</span>
        </VBtn>

        <VBtn
          v-if="canVisibleUserPermission(statusPermission,'SEND_BACK').canVisible"
          :disabled="!activeBtnSendBackPlan"
          color="purple-accent-4"
          class="mx-1"
          @click="btnConfirmAll('sendBack')"
        >
          <span style="font-size: 12px;">Send Back</span>
        </VBtn>

        <VBtn
          v-if="false"
          color="error"
          class="mx-2"
          @click="showSelectBox"
        >
          <span style="font-size: 12px;">Debug Cancel Batch</span>
        </VBtn>
        
        
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
  </div>

  <div
    v-if="RoleAccount === 'Manager'"
    class="mt-4"
  >
    <VBtn @click="viewAllData">
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
      <VCardText><span style="font-weight: bolder;">BatchID: </span>{{ batchId }}</VCardText>
      <VCardText>
        <VBtn
          v-if="false"
          @click="showSelectBox"
        >
          ShowSelect
        </VBtn>
        <VDataTable
          v-if="productionPlan"
          v-model="selectedDataTables"
          v-model:sort-by="sortBy"
          :headers="headersDataTableNew"
          :items="productionPlan"
          :items-per-page="10"
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
              <th>
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

          <template #column.lotNumber="{ column }">
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

          <template #column.updateDated="{ column }">
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
                  v-model="selectedDataTables"
                  :value="item.raw"
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
                <VChip
                  :color="colorStatusWithId(item.raw.statusId).color"
                  :style="{ color: colorStatusWithId(item.raw.statusId).color }"
                  style="font-size: 12px;"
                >
                  {{ statusText(item.raw.statusId) }}
                </VChip>
              </td>
              <td 
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
                {{ (currentPageDataTable - 1) * 10 + index + 1 }}
              </td>
              <td
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
                style="min-width: 150px;"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span>{{ (item.raw.inputDate) }}</span>
              </td>
              <td
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
                <VBtn
                  v-if="item.raw.statusId === 101"
                  variant="outlined"
                  @click="selectFilterProduction(item.raw.planningID,1)"
                >
                  <span v-if="item.raw.productionCode">{{ item.raw.productionCode }}</span><span v-else>Select Production</span>
                  <template #append>
                    <VIcon icon="ri-arrow-down-s-fill" />
                  </template>
                </VBtn>
                <span v-else>{{ (item.raw.productionCode) }}</span>

                <!-- ตรวจสอบว่ามี missingFields ก่อนเรียก includes -->
                <div
                  v-if="item.raw.missingFields"
                  class="error-message"
                >
                  <span
                    v-if="item.raw.missingFields.includes('productionCode') && !item.raw.productionCode"
                    class="text-red"
                  >Missing Input Production Code</span>
                </div>
              </td>
              <td
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
                {{ item.raw.reactorName }}
              </td>
              <td
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
                {{ item.raw.productionName }}
              </td>
              <td
                class="px-8 text-end cursor-pointer"
                style="min-width: 150px;"
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
                <VBtn
                  v-if="item.raw.statusId === 101"
                  variant="outlined"
                  @click="selectFilterProduction(item.raw.planningID,1)"
                >
                  <span v-if="item.raw.product1SelectedCode">{{ item.raw.product1SelectedCode }}</span><span v-else>Select Item</span>
                  <template #append>
                    <VIcon icon="ri-arrow-down-s-fill" />
                  </template>
                </VBtn>
                <span v-else>{{ (item.raw.product1SelectedCode) }}</span>
                <!-- ตรวจสอบว่ามี missingFields ก่อนเรียก includes -->
                <div
                  v-if="item.raw.missingFields"
                  class="error-message"
                >
                  <span
                    v-if="item.raw.missingFields.includes('product1SelectedCode') && !item.raw.product1SelectedCode"
                    class="text-red"
                  >Missing Input Item Code 1</span>
                </div>
              </td>
              <td
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
                <VBtn
                  v-if="item.raw.statusId === 101"
                  variant="outlined"
                  @click="selectFilterProduction(item.raw.planningID,1)"
                >
                  <span v-if="item.raw.product1SelectedPackagingCode">{{ item.raw.product1SelectedPackagingCode }}</span><span v-else>Select Packaging</span>
                  <template #append>
                    <VIcon icon="ri-arrow-down-s-fill" />
                  </template>
                </VBtn>
                <span v-else>{{ (item.raw.product1SelectedPackagingCode) }}</span>
                <!-- ตรวจสอบว่ามี missingFields ก่อนเรียก includes -->
                <div
                  v-if="item.raw.missingFields"
                  class="error-message"
                >
                  <span
                    v-if="item.raw.missingFields.includes('product1SelectedPackagingCode') && !item.raw.product1SelectedPackagingCode"
                    class="text-red"
                  >Missing Input Packaging 1</span>
                </div>
              </td>
              <td class="bg-light-blue-lighten-5 text-end px-8">
                {{ formatNumber(item.raw.product1PackingQtyKgs) }}
              </td>
              <td
                style="min-width: 180px;"
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
                <VTextField
                  v-if="item.raw.statusId === 101 && item.raw.product1UomCount >= 0"
                  v-model="item.raw.product1UomCount"
                  style="min-width: 100px;"
                  density="compact"
                  type="number"
                  :color="activeBtnError"
                  min="0"
                  :step="1"
                  :readonly="item.raw.status === 'Submit'"
                  :rules="[value => validateRequired(value), value => validateRow(item)]"
                >
                  <template #label>
                    <span style="font-size: 12px;">Packaging Pcs 1</span>
                  </template>
                </VTextField>
                <span
                  v-else
                  class="px-6"
                >{{ (item.raw.product1UomCount) }}</span>
                <!-- ตรวจสอบว่ามี missingFields ก่อนเรียก includes -->
                <div
                  v-if="item.raw.missingFields"
                  class="error-message"
                >
                  <span
                    v-if="item.raw.missingFields.includes('product1UomCount') && !item.raw.product1UomCount"
                    class="text-red"
                  >Missing Input Packaging Pcs 1</span>
                </div>
                <div class="text-start">
                  <VAlert
                    v-if="false"
                    type="error"
                    class="pa-1"
                  >
                    <div style="font-size: 10px;">
                      Packaging exceed
                    </div>
                    <div style="font-size: 10px;">
                      the batch scale (Kgs).
                    </div>
                  </VAlert>
                  <span
                    v-if="item.raw.hasError"
                    style="font-size: 12px;"
                    class=""
                  >Packaging exceed</span>
                </div>
                <div class="text-start">
                  <span
                    v-if="item.raw.hasError"
                    style="font-size: 12px;"
                    class=""
                  >the batch scale (Kgs).</span>
                </div>
              </td>

              <td
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
                <VBtn
                  v-if="item.raw.statusId === 101"
                  :disabled="checkDisabledBtnSelectItem2(selectedItemCode,item.raw.product1SelectedCode)"
                  variant="outlined"
                  @click="selectFilterProduction(item.raw.planningID,2)"
                >
                  <span v-if="item.raw.product2SelectedCode">{{ item.raw.product2SelectedCode }}</span><span v-else>Select Item</span>
                  <template #append>
                    <VIcon icon="ri-arrow-down-s-fill" />
                  </template>
                </VBtn>
                <span v-else>{{ (item.raw.product2SelectedCode) }}</span>
                <div v-if="item.raw.statusId === 101 && checkDisabledBtnSelectItem2(selectedItemCode,item.raw.product1SelectedCode)">
                  <span class="text-warning">Invalid production or ITEM 1!</span>
                </div>
                <div v-if="item.raw.statusId === 101 && checkDisabledBtnSelectItem2(selectedItemCode,item.raw.product1SelectedCode)">
                  <span class="text-warning">
                    Please choose ITEM 1.</span>
                </div>
              </td>
              <td
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
                <VBtn
                  v-if="item.raw.statusId === 101"
                  :disabled="checkDisabledBtnSelectItem2(selectedItemCode,item.raw.product1SelectedCode)"
                  variant="outlined"
                  @click="selectFilterProduction(item.raw.planningID,2)"
                >
                  <span v-if="item.raw.product2SelectedPackagingCode">{{ item.raw.product2SelectedPackagingCode }}</span><span v-else>Select Packaging</span>
                  <template #append>
                    <VIcon icon="ri-arrow-down-s-fill" />
                  </template>
                </VBtn>
                <span v-else>{{ (item.raw.product2SelectedPackagingCode) }}</span>
              </td>
              <td
                class="bg-red-lighten-5 text-end px-8 cursor-pointer"
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
                {{ formatNumber(item.raw.product2PackingQtyKgs) }}
              </td>
              <td
                class="bg-red-lighten-5 text-end cursor-pointer"
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
                <VTextField
                  v-if="item.raw.statusId === 101"
                  v-model="item.raw.product2UomCount"
                  :disabled="checkDisabledBtnSelectItem2(selectedItemCode,item.raw.product1SelectedCode)"
                  type="number"
                  style="min-width: 100px;"
                  density="compact"
                  :readonly="item.raw.status === 'Submit'"
                  :rules="[
                    value => {
                      if(!value){
                        return `Value is required!`
                      }
                    },
                    value => {
                      if (validateSpecificRow(item.raw.quantityKgs,value,item.raw.product1PackingQtyKgs,item.raw.product2UomCount,item.raw.product2PackingQtyKgs)) {
                        textAlert = true;
                        item.raw.hasError = true
                        activeBtnError = `red`
                      }else {
                        textAlert = false;
                        item.raw.hasError = false
                        activeBtnError = `primary`
                      }
                    }
                  ]"
                >
                  <template #label>
                    <span style="font-size: 12px;">Packaging Pcs 2</span>
                  </template>
                </VTextField>
                <span
                  v-else
                  class="px-6"
                >{{ (item.raw.product2UomCount) }}</span>
              </td>
             
              <td
                class="px-1 cursor-pointer"
                style="min-width: 150px;"
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
                <VTextField
                  v-if="item.raw.statusId === 101"
                  v-model="item.raw.lotNumber"
                  density="compact"
                  style="min-width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                />
                <span
                  v-else
                  class="px-4"
                >{{ (item.raw.lotNumber) }}</span>
                <!-- ตรวจสอบว่ามี missingFields ก่อนเรียก includes -->
                <div
                  v-if="item.raw.missingFields"
                  class="error-message"
                >
                  <span
                    v-if="item.raw.missingFields.includes('lotNumber') && !item.raw.lotNumber"
                    class="text-red"
                  >Missing Input lotNumber</span>
                </div>
              </td>
              <td
                class="px-1 cursor-pointer"
                style="max-width: 150px;"
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
                <AppDateTimePicker
                  v-if="item.raw.statusId === 101"
                  v-model="item.raw.producingDate"
                  placeholder="Producing date"
                  density="compact"
                  style="font-size: 12px;"
                  prepend-inner-icon="ri-calendar-schedule-fill"
                  :config="{ dateFormat: 'd/m/Y' }"
                />
                <span
                  v-else
                  class="px-4"
                >{{ (item.raw.producingDate) }}</span>
                <!-- ตรวจสอบว่ามี missingFields ก่อนเรียก includes -->
                <div
                  v-if="item.raw.missingFields"
                  class="error-message"
                >
                  <span
                    v-if="item.raw.missingFields.includes('producingDate') && !item.raw.producingDate"
                    class="text-red"
                  >Missing Input Producing Date</span>
                </div>
              </td>
              <td
                class="px-4 cursor-pointer"
                style="min-width: 150px;"
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
                <span v-if="formatDate(item.raw.finishedDate) === '01/01/1970'" />
                <span v-else>{{ formatDateUpdate(item.raw.finishedDate) }}</span>
              </td>
              <td
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
                <VTextarea
                  v-if="item.raw.statusId === 101"
                  v-model="item.raw.remark"
                  style="min-width: 200px;"
                  class="pa-2"
                  label="Remark"
                  :rules="rules"
                  rows="2"
                  clearable
                  :readonly="item.raw.status === 'Submit'"
                >
                  <template #label>
                    <span style="font-size: 12px;">Remark</span>
                  </template>
                </VTextarea>
                <span v-else>{{ (item.raw.remark) }}</span>
                <!-- ตรวจสอบว่ามี missingFields ก่อนเรียก includes -->
                <div
                  v-if="item.raw.missingFields"
                  class="error-message"
                >
                  <span
                    v-if="item.raw.missingFields.includes('remark') && !item.raw.remark"
                    class="text-red"
                  >Missing Input Remark</span>
                </div>
              </td>
              <td
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
                {{ formatDateUpdate(item.raw.updatedDate) }}
              </td>
            </tr>
          </template>
        </VDataTable>
      </VCardText>
      <VBtn
        v-if="false"
        @click="showDataInput"
      >
        Show
      </VBtn>
    </VCard>
    <pre>{{ sortBy }}</pre>
  </section>

  <!-- Alert Dialog Success/Fiald new -->
  <section>
    <div>
      <!-- ใช้ AuthenticatorDialog component -->
      <AuthenticatorDialog
        v-if="false"
        :is-dialog-visible="isDialogVisibleAlertDialog"
        :word="wordForSubmit"
        :subword="subWordForSubmit"
        :success="successDialAlert"
        @update:isDialogVisible="(val) => isDialogVisibleAlertDialog.value = val"
      />
    </div>

    <div>
      <!-- ใช้ confirmDialog component -->
      <ConfirmDialog2
        ref="confirmDialog2"
        :message="wordForSubmit"
        :subword="subWordForSubmit"
        @confirm="handleConfirmAction"
        @cancel="handleCancel"
      />
    </div>

    <div>
      <!-- ใช้ AuthenticatorDialog Component -->
      <AlertWord2
        v-model="isDialogVisibleAlertDialog"
        :word="wordForSubmit"
        :subword="subWordForSubmit"
        :success="successDialAlert"
      />
    </div>

    <div>
      <VDialog
        v-model="isDialogVisibleConfirmLotValidateDialog"
        persistent
        class="v-dialog-sm"
      >
        <!-- Dialog Content -->
        <VCard>
          <VCardText class="text-center">
            <div class="d-flex justify-center">
              <VIcon
                size="100"
                color="warning"
                icon="ri-question-line"
              />
            </div>
            <div class="text-center">
              <span style="font-size: 22px; font-weight: bolder;">{{ alertValidate }}</span>
            </div>
          </VCardText>

          <VCardText class="d-flex justify-space-between flex-wrap gap-4">
            <VBtn
              color="error"
              @click="isDialogVisibleConfirmLotValidateDialog = false"
            >
              Cancel
            </VBtn>
            <VBtn
              color="success"
              @click="btnConfirmLotValidate"
            >
              Confirm
            </VBtn>
          </VCardText>
        </VCard>
      </VDialog>
    </div>

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
              placeholder="Enter Comment"
            />
          </VCardText>

          <VCardText class="d-flex justify-end flex-wrap gap-4">
            <VBtn
              color="error"
              @click="isDialogVisibleCommentDialog = false, rejectPlan()"
            >
              Reject
            </VBtn>
          </VCardText>
        </VCard>
      </VDialog>
    </div>
  </section>

  <!-- Footer -->
  <section v-if="false" class="mt-3">
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
          Version : 2.6(Last Updated 7/12/2024 ) {{ productionPlan.length }} Rows of Data 
        </VAlert>
      </VCardText>
    </VCard>
  </section>
</template>

<style lang="scss" src="./batch.scss"></style>

