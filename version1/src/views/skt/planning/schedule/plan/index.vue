<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { onMounted, ref, watch, watchEffect } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api' //---------------------- Import Api for Url *****

import { VDataTable } from 'vuetify/labs/VDataTable'

import AuthenticatorDialog from '@/components/dialogs/alert/alertDialog.vue'
import alertWordConst from '@/utilities/constant'
import ConfirmDialog2 from '@/components/dialogs/alert/confirmDialog2.vue'

const isDialogVisibleAlertDialog = ref(false)
const wordForSubmit = ref('')
const subWordForSubmit = ref('')
const successDialAlert = ref(false)
const confirmDialog2 = ref(null)

const statusId = ref(0)

const textAlertDialogFunction = (word, success) => {
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

function openConfirmDialog() {
  // เรียกใช้ฟังก์ชัน openDialog ที่เปิดเผยจาก ConfirmDialog.vue

  selectedDataTables.value.forEach(item => {
    // กำหนดค่าเริ่มต้น
    console.log("selectedDataTables", item.statusId)

    if (item.statusId === 102 ) {
      wordForSubmit.value = alertWordConst.approve
      confirmDialog2.value.openDialog()
      isDialogVisibleAlertDialog.value = false
      console.log("selectedDataTables 102")
    }else if(item.statusId === 101){
      textSubAlertDialogFunction('SELECT APPROVE', "Plase select Plan Status 'Waitting for plan APVL' for approve.", false)
      console.log("selectedDataTables 101")
    }
    else{
      console.log("selectedDataTables failded")
      isDialogVisibleAlertDialog.value = false
    }

  })

}

function handleConfirmAction() {
  console.log('Confirmed! Executing action...')
  approvePlan()
}

//------------------------ Get Where House Name From LocalStorage and define to whereHouseSelectedItem ---------------------------
const whereHouse = localStorage.getItem('whereHouseName')
const whereHouseSelectedItem = ref(whereHouse)

const products = ref([]) //---------------- variable for get All Product From X-Location(Where House) *****

// Get access token from localStorage in another page
const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')

///--- import Cookie
import { useItemStore } from '@/stores/skt/receingFormStore/itemStore'

const itemStore = useItemStore()

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

import { useGetProductionPlanService, 
  useNewProductionPlanService, 
  useGetBatchProductionPlanService, 
  useDeleteProductionPlanService,
  useGetProductionPlanMasterService,
  useSaveProductionPlanService,
  useSubmitProductionPlanService,
  useApproveProductionPlanService,
  useGenerateBatchProductionPlanService,
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
    title: 'Plan Name',
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
    title: 'Item Code',
    key: 'itemCode',
  },
  {
    title: 'Product Name',
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

watch(async () => {
  try {
    // เรียก fetchGetProductionplan และรอให้ทำงานเสร็จ
    await fetchGetProductionplan(batchId.value, urlApi.value, 'ProductionPlan', whereHouse, accessTokenAtStore)

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

  console.log("selectedProductionCode", selectedProductionCode.value)

  console.log("selectedProductionCode", selectedProductionCode.value)
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
    console.log("selectedPackagingType", selectedPackagingType.value)
  }
  if(btnSelectitem2.value){
    selectedPackagingType2.value = plan.itemCode
    selectedPackagingName2.value = plan.itemName
    selectedPackagingKgs2.value = plan.packingQtyKgs
    console.log("selectedProductionCode2", selectedPackagingType2.value)
  }
}

const selectedDataTables = ref([])

//--------------------------------- validate  ------------------------------
const activeBtnApprove = ref(false)
const activeBtnSubmit = ref(false)
const activeBtnCancelPlan = ref(false)
const activeBtnError =ref('primary')

watch(()=> {
  console.log("vselectedDataTables out func", activeBtnApprove.value)
  activeBtnApprove.value = false
  activeBtnSubmit.value = false
  activeBtnCancelPlan.value = false
  if(selectedDataTables.value){
    selectedDataTables.value.forEach(item => {
      // กำหนดค่าเริ่มต้น
      console.log("vselectedDataTables in", activeBtnApprove.value)
      if (item.statusId === 102 ) {
        activeBtnApprove.value = true
        activeBtnCancelPlan.value = true
        console.log("vselectedDataTables", activeBtnApprove.value)
      }else if(item.statusId === 101){
        activeBtnCancelPlan.value = true
        activeBtnSubmit.value = true
      }
      else{
        activeBtnApprove.value = false
        activeBtnSubmit.value = false
        activeBtnCancelPlan.value = false
      }

    })
  }else{
    activeBtnCancelPlan.value = false
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

const selectFilterProduction = (index, item) => {
  indexSelectBoxFilter.value = index
  if(item === 1){
    btnSelectitem1.value = true
    btnSelectitem2.value = false
    console.log("Itesm", item)
  }else if(item === 2){
    btnSelectitem2.value = true
    btnSelectitem1.value = false
    console.log("Itesm", item)
  }
  isDialogVisibleFilterSelect.value = true

  selectedProductionCode.value = productionPlan.value[index].productionCode

  selectedItemCode.value = productionPlan.value[index].product1SelectedCode
  selectedPackagingType.value = productionPlan.value[index].product1SelectedPackagingCode

  selectedItemCode2.value = productionPlan.value[index].product2SelectedCode
  selectedPackagingType2.value = productionPlan.value[index].product2SelectedPackagingCode

  console.log("Selected item", selectedItemCode.value)

}

// eslint-disable-next-line sonarjs/cognitive-complexity
const addSelectProdutionCode = index => {
  // อัปเดตค่าที่เลือกในตำแหน่งของแถวที่กด
  productionPlan.value[index].productionCode = selectedProductionCode.value || null
  productionPlan.value[index].productionName = selectedProductionName.value || null
  productionPlan.value[index].reactorName = selectedProductionReactorName.value || null
  productionPlan.value[index].quantityKgs = selectedProductionbatchScaleKgs.value || null
  productionPlan.value[index].plantName = selectedProductionPlanName.value || null
    
  productionPlan.value[index].product1SelectedCode = selectedItemCode.value || null
  productionPlan.value[index].product1Name = selectedItemName.value || null
  productionPlan.value[index].product1SelectedPackagingCode = selectedPackagingType.value || null
  productionPlan.value[index].product1PackagingName = selectedPackagingName.value || null
  productionPlan.value[index].product1PackingQtyKgs = selectedPackagingKgs.value || null
  productionPlan.value[index].product1UomCount = Math.floor(selectedProductionbatchScaleKgs.value/selectedPackagingKgs.value) || null

  productionPlan.value[index].product2SelectedCode = selectedItemCode2.value || null
  productionPlan.value[index].product2Name = selectedItemName2.value || null
  productionPlan.value[index].product2SelectedPackagingCode = selectedPackagingType2.value || null
  productionPlan.value[index].product2PackagingName = selectedPackagingName2.value || null
  productionPlan.value[index].product2PackingQtyKgs = selectedPackagingKgs2.value || null
  productionPlan.value[index].product2UomCount = Math.floor(selectedProductionbatchScaleKgs.value/selectedPackagingKgs2.value) || null

  console.log("Updated row:", productionPlan.value[index])
}

const confirmFilterSelectProduction = () => {
  dataPlanningForSave.value.productionCode = selectedProductionCode.value

  dataPlanningForSave.value.product1SelectedCode = selectedItemCode.value
  dataPlanningForSave.value.product1SelectedPackagingCode = selectedPackagingType.value
  dataPlanningForSave.value.product2SelectedCode = selectedItemCode2.value
  dataPlanningForSave.value.product2SelectedPackagingCode = selectedPackagingType2.value

  const index = indexSelectBoxFilter.value
  if (index !== null) {
    addSelectProdutionCode(index)
  }

  isDialogVisibleFilterSelect.value = false // ปิด dialog

}

//------------------------------ func save production plan service --------------------------------
const { responseSaveProductionPlan, errorMessageSaveProductionPlan, saveProdutcionPlanFunc } = useSaveProductionPlanService()

const saveProductionPlan = async () => {
  console.log("saveProductionPlan staret")

  // ตรวจสอบฟิลด์ inputDate และ producingDate
  productionPlan.value = productionPlan.value.map(item => ({
    ...item,
    producingDate: item.producingDate && item.producingDate !== "null" ? item.producingDate : new Date().toISOString(),
  }))

  console.log("saveProductionPlan staret in 2", productionPlan.value.producingDate)
  try {
    console.log("saveProductionPlan staret in", productionPlan.value)

    const filteredData = productionPlan.value.map(item => ({
      planningID: item.planningID,
      inputDate: formatDateToYMD(item.inputDate),
      producingDate: item.producingDate || new Date().toISOString(),
      productionCode: item.productionCode,

      product1SelectedCode: (item.product1SelectedCode),
      product1SelectedPackagingCode: item.product1SelectedPackagingCode,

      product1PackingQtyKgs: parseInt(item.product1PackingQtyKgs),
      product1UomCount: item.product1UomCount,

      product2SelectedCode: item.product2SelectedCode,
      product2SelectedPackagingCode: item.product2SelectedPackagingCode,

      product2PackingQtyKgs: parseInt(item.product2PackingQtyKgs),
      product2UomCount: item.product2UomCount,

      lotNumber: item.lotNumber,
      producingDate: formatDateYMDWhyQ(item.producingDate),
      remark: item.remark,
    }))

    console.log("saveProductionPlan staret in 2")

    // ส่งข้อมูลที่กรองแล้วไปยัง API
    await saveProdutcionPlanFunc(filteredData, urlApi.value, 'ProductionPlan', whereHouse, accessTokenAtStore)
    if(responseSaveProductionPlan.value){
      textAlertDialogFunction(alertWordConst.saveDraft, true)
      setTimeout(() => {
        location.reload()
      }, 500) // 10000 มิลลิวินาที = 10 วินาที

      console.log("saveProductionPlan staret in 3")

      // แสดงค่าใน console
      console.log("Filtered Production Plan Saved:", filteredData)
    }else{
      textAlertDialogFunction(alertWordConst.saveDraft, false)
      setTimeout(() => {
        // location.reload()
      }, 500) // 10000 มิลลิวินาที = 10 วินาที
    }

  } catch (error) {
    // จัดการข้อผิดพลาด
    textAlertDialogFunction(alertWordConst.saveDraft, false)
    setTimeout(() => {
      // location.reload()
    }, 500) // 10000 มิลลิวินาที = 10 วินาที
    console.error("Error saving production plan:", error)
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
      location.reload()
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

//------------------------- submit plan
const { responseSubmitProductionPlan, errorMessageSubmitProductionPlan, submitProdutcionPlanFunc } = useSubmitProductionPlanService()

const isFieldMissing = (item, field) => {
  return item[field] === null || item[field] === undefined || item[field] === ""
}

const submitPlan = async () => {
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

    requiredFields.forEach(field => {
      if (isFieldMissing(item, field)) {
        item.missingFields.push(field)
        hasErrors = true // หากพบฟิลด์ที่ไม่มีค่า
      }
    })
  })

  // ถ้ามีฟิลด์ที่ไม่มีค่า ให้หยุดและแจ้งเตือน
  if (hasErrors) {
    textAlertSubDialogFunction(alertWordConst.submit, "Plases check input.", false)
    console.warn("Some fields are missing:", selectedDataTables.value, subWordForSubmit.value)
    
    
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
    textAlertDialogFunction(alertWordConst.submit, true)
    setTimeout(() => {
      location.reload()
    }, 500)
  } catch (error) {
    console.error("Error submitting production plan:", error)
    textAlertDialogFunction(alertWordConst.submit, false)
  }
}

//------------------------- approve plan
const { responseApproveProductionPlan, errorMessageApproveProductionPlan, approveProdutcionPlanFunc } = useApproveProductionPlanService()


const approvePlan = async () => {

  // console.log("selectedDataTables", selectedDataTables.value)

  const body = selectedDataTables.value.map(item => item.planningID)

  try {
  // เรียก fetchGetProductionplan และรอให้ทำงานเสร็จ
    await approveProdutcionPlanFunc(body, urlApi.value, 'ProductionPlan', whereHouse, accessTokenAtStore)
    if(responseApproveProductionPlan.value){
      textAlertDialogFunction(alertWordConst.approve, true)
      setTimeout(() => {
        location.reload()
      }, 500) // 10000 มิลลิวินาที = 10 วินาที
    }else{
      textAlertDialogFunction(alertWordConst.approve, false)
      setTimeout(() => {
        location.reload()
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
  },
  {
    title: 'Status',
    key: 'status',
    fixed: true,
  },
  {
    title: 'No.',
    key: 'no',
  },
  {
    title: 'Input Date',
    key: 'inputDate',
  },

  // {
  //   title: 'Plants',
  //   key: 'plants',
  // },
  {
    title: 'Production Code',
    key: 'productCode',
  },
  {
    title: 'Reactor',
    key: 'reactor',
  },
 
  {
    title: 'Production Name',
    key: 'productName',
  },
  {
    title: 'Batch Scale(Kgs)',
    key: 'batchScaleKgs',
  },
  {
    title: 'Item Code1',
    key: 'productCode1',
    class: 'my-header-style',
  },
  {
    title: 'Item Name1',
    key: 'productName1',
  },
  {
    title: 'Packaging Type1',
    key: 'packagingType1',
  },
  {
    title: 'Packaging Kgs1',
    key: 'packagingKgs1',
  },
  {
    title: 'Packaging Pcs1',
    key: 'packagingPcs1',
  },

  //---------------
  {
    title: 'Item Code2',
    key: 'productCode2',
  },
  {
    title: 'Item Name2',
    key: 'productName2',
  },
  {
    title: 'Packaging Type2',
    key: 'packagingType2',
  },
  {
    title: 'Packaging Kgs2',
    key: 'packagingKgs2',
  },
  {
    title: 'Packaging Pcs2',
    key: 'packagingPcs2',
  },
  
  {
    title: 'Lot',
    key: 'lotNumber',
  },
  {
    title: 'Producing Date',
    key: 'producingDate',
  },
  {
    title: 'Finished Date',
    key: 'finishedDate',
  },
  
  {
    title: 'Remark',
    key: 'remark',
  },
  {
    title: 'Update Date',
    key: 'updateDate',
  },
  {
    title: 'Update By',
    key: 'byWho',
  },

  // {
  //   title: 'Action',
  //   key: 'action',
  // },
]

//--------------------- Menu

const menuDataTable = ref(false)

const itemsActionDataTable = [
  {
    title: 'Save Draft',
    value: 'Save Draft',
    icon: 'ri-save-3-line',
  },
  {
    title: 'Delete Item',
    value: 'Delete Item',
    icon: 'ri-delete-bin-5-line',
  },
  {
    title: 'Submit',
    value: 'Submit',
    icon: 'ri-upload-2-line',
  },
  {
    title: 'Print',
    value: 'Print',
    icon: 'ri-printer-line',
  },
]

const handleAction = action => {
  switch (action) {
  case 'Save Draft':
    saveDraft()
    break
  case 'Delete Item':
    deleteItem()
    break
  case 'Submit':
    submit()
    break
  case 'Print':
    print()
    break
  default:
    console.warn('Action not defined:', action)
  }
}

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
                >{{ $t('Production Plan ฺBatch') }}</span>
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
          <h3>Select Plan</h3>
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
              <VCol cols="2">
                <VBtn
                  color="info"
                  @click="confirmFilterSelectProduction"
                >
                  Confirm select
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
                          item.raw.itemCode === selectPackagingTypeSwitch && btnSelectitem2
                            ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                            : item.raw.itemCode === selectPackagingTypeSwitch && btnSelectitem1
                              ? '#D3E3FC' // เงื่อนไขแรก
                              : '#FFFFFF', // ค่าเริ่มต้น
                      }"
                    >
                      <span style="font-size: 12px;">{{ item.raw.itemCode }}</span>
                    </td>
                    <td
                      :style="{
                        background:
                          item.raw.itemCode === selectPackagingTypeSwitch && btnSelectitem2
                            ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                            : item.raw.itemCode === selectPackagingTypeSwitch && btnSelectitem1
                              ? '#D3E3FC' // เงื่อนไขแรก
                              : '#FFFFFF', // ค่าเริ่มต้น
                      }"
                    >
                      <span style="font-size: 12px;">{{ item.raw.itemName }}</span>
                    </td>
                    <td
                      :style="{
                        background:
                          item.raw.itemCode === selectPackagingTypeSwitch && btnSelectitem2
                            ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                            : item.raw.itemCode === selectPackagingTypeSwitch && btnSelectitem1
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
                          item.raw.itemCode === selectPackagingTypeSwitch && btnSelectitem2
                            ? '#FFEBEE' // กรณีทั้งสองเงื่อนไขเป็นจริง
                            : item.raw.itemCode === selectPackagingTypeSwitch && btnSelectitem1
                              ? '#D3E3FC' // เงื่อนไขแรก
                              : '#FFFFFF', // ค่าเริ่มต้น
                      }"
                    >
                      <VBtn
                        v-if="item.raw.itemCode === selectPackagingTypeSwitch"
                        :color="colorBtnSwitch()"
                        variant="tonal"
                        @click="selectPackaging(item.raw)"
                      >
                        Select
                      </VBtn>
                      <VBtn
                        v-if="item.raw.itemCode !== selectPackagingTypeSwitch"
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
          color="orange-darken-3"
          @click="addEmptyRowToPlan"
        >
          <span style="font-size: 12px;">New Plan</span>
        </VBtn>
        <VBtn
          class="mx-1"
          color="warning"
          @click="saveProductionPlan"
        >
          <span style="font-size: 12px;">Save Draft</span>
        </VBtn>
        <VBtn
          color="info"
          class="mx-1"
          :disabled="!productionPlan"
          @click="handleBtnGenerateLotBatch"
        >
          <span style="font-size: 12px;">Gen Lot</span>
        </VBtn>
        <VBtn
          class="mx-1"
          color="light-green-darken-1"
          :disabled="!activeBtnSubmit"
          @click="submitPlan"
        >
          <span style="font-size: 12px;">Submit</span>
        </VBtn>
        <VBtn
          color="error"
          :disabled="!activeBtnCancelPlan"
          class="mx-1"
          @click="deletePlan"
        >
          <span style="font-size: 12px;">Reject Plan</span>
        </VBtn>
        <VBtn
          class="mx-1"
          :disabled="!activeBtnApprove"
          @click="openConfirmDialog"
        >
          <span style="font-size: 12px;">Approve</span>
        </VBtn>
        <VBtn
          v-if="false"
          color="info"
          class="mx-2"
          @click="addEmptyRowToPlan"
        >
          <span style="font-size: 12px;">Add Item</span>
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
          :headers="headersDataTableNew"
          :items="productionPlan"
          :items-per-page="10"
          show-select
          class="text-no-wrap"
        >
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
                >
                  {{ colorStatusWithId(item.raw.statusId).text }}
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
                <AppDateTimePicker
                  v-if="false"
                  v-model="item.raw.inputDate"
                  density="compact"
                  prepend-inner-icon="ri-calendar-schedule-fill"
                  :config="{ dateFormat: 'd/m/Y' }"
                >
                  <template #label>
                    <span>Input Data</span>
                  </template>
                </AppDateTimePicker>
                <span>{{ formatDate(item.raw.inputDate) }}</span>
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
                  @click="selectFilterProduction(index,1)"
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
                  @click="selectFilterProduction(index,1)"
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
                  @click="selectFilterProduction(index,1)"
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
                      packaging exceed
                    </div>
                    <div style="font-size: 10px;">
                      the batch scale (kgs).
                    </div>
                  </VAlert>
                  <span
                  style="font-size: 12px;"
                    v-if="item.raw.hasError"
                    class=""
                  >packaging exceed</span>
                </div>
                <div class="text-start">
                  <span
                  style="font-size: 12px;"
                    v-if="item.raw.hasError"
                    class=""
                  >the batch scale (kgs).</span>
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
                  @click="selectFilterProduction(index,2)"
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
                  @click="selectFilterProduction(index,2)"
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
                {{ formatDateUpdate(item.raw.updatedDate) }}
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
  </section>

  <!-- Alert Dialog Success/Fiald new -->
  <section>
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

    <div>
      <!-- ใช้ confirmDialog component -->
      <ConfirmDialog2
        ref="confirmDialog2"
        :message="wordForSubmit"
        @confirm="handleConfirmAction"
        @cancel="handleCancel"
      />
    </div>
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
          Version : 2.6(Last Updated 7/12/2024 ) {{ productionPlan.length }} Rows of Data 
        </VAlert>
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

.fixed-bottom {
  position: fixed;
  justify-content: center;
  inline-size: 95%;
  inset-block-end: 0;
}

.spinning {
  animation: spin 0.5s linear infinite;
}

.my-header-style {
  background: aquamarine;
}
</style>

