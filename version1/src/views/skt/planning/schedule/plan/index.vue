<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { onMounted, ref, watch, watchEffect } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api' //---------------------- Import Api for Url *****

import { VDataTable } from 'vuetify/labs/VDataTable'

import AuthenticatorDialog from '@/components/dialogs/alert/alertDialog.vue'
import alertWordConst from '@/utilities/constant'

const isDialogVisibleAlertDialog = ref(false)
const wordForSubmit = ref('')
const successDialAlert = ref(false)

const statusId = ref(0)

const textAlertDialogFunction = (word, success) => {
  wordForSubmit.value = word
  successDialAlert.value = success
  isDialogVisibleAlertDialog.value = true
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

//------------------------------------------ Data --------------------------------

const date = ref(new Date())

const productionPlan = ref([])

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
  { name: "Waiting for PROD APVL", id: 102 },
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
    return { color: 'green', message: 'green', text: 'Waiting for PROD APVL' }
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

const dataMockProductionCodeModel1 = ref([
  {
    productionCode: '4509261005831250',
    productionName: ' F-190 (1250KG)  IBC  1st-org1',
    planName: 'TP-1',
    reactorName: '11R-311',
    batchScale: '11536.00',
    durationDays: '1',
    itemCode: [
      { itemsCode: '450926100561', InBomName: 'F-190  LORRY  1st-org1' },
      { itemsCode: '4509261005831250', InBomName: 'F-190 (1250KG)  IBC  1st-org1' },
      { itemsCode: '450926101764', InBomName: 'F-190 PE FLEXITANK' },
      { itemsCode: '4509261027831250', InBomName: 'F-190 IBC (EXPORT) 1ST-ORG1' },
    ],
    packagingtype: [
      { itemCode: '494603110', productName: 'IBC CONTAINER (SECOND HAND)  1st-Org1', packagingQtyKsg: '1250.00' },
    ],
  },
  {
    productionCode: '425626300551180',
    productionName: 'SKT DDA BE D/M 1st-org2',
    planName: 'TP-1',
    ReactorName: '11R-331',
    BatchScale: '6165.00',
    DurationDays: '2',
    itemCode: [
      { itemsCode: '425626300551180', ProductionCode: '425626300551180', InBomName: 'SKT DDA BE D/M 1st-org2' },
    ],
    packagingtype: [
      { itemCode: '494601910', productName: 'BC18D/M  1st-Org1', packagingQtyKsg: '180.00' },
      { itemCode: '494601930', productName: 'BC18D/M  1st-Org2', packagingQtyKsg: '180.00' },
    ],
  },
  {
    productionCode: '450171201753200',
    productionName: 'CHEMICLEAN PR-029 D/M  Clean',
    planName: 'Cleanroom',
    ReactorName: '13R-201',
    BatchScale: '5000.00',
    DurationDays: '3',
    itemCode: [
      { itemsCode: '45017120171320', InBomName: 'CHEMICLEAN PR-029  C/N  Clean' },
      { itemsCode: '450171201753200', InBomName: 'CHEMICLEAN PR-029 D/M  Clean' },
    ],
    packagingtype: [
      { itemCode: '494605425', productName: '20L CLEAN GALLON', packagingQtyKsg: '20.00' },
      { itemCode: '494605910', productName: 'PL D/M (9.4) 1st-Org-1(EURO)', packagingQtyKsg: '200.00' },
    ],
  },

  {
    productionCode: '451008201583800',
    productionName: 'OIL-AR (800 KG) IBC CLEAN ROOM',
    planName: 'Cleanroom',
    ReactorName: '13R-202',
    BatchScale: '3800.00',
    DurationDays: '1',
    itemCode: [
      { itemsCode: '451008201583800', InBomName: 'OIL-AR (800 KG) IBC CLEAN ROOM' },
    ],
    packagingtype: [
      { itemCode: '494603110', productName: 'IBC CONTAINER (SECOND HAND)  1st-Org1', packagingQtyKsg: '800.00' },
    ],
  },
  {
    productionCode: '451394201583925',
    productionName: 'OIL-BR (925 Kg) IBC CLEAN ROOM',
    planName: 'Cleanroom',
    ReactorName: '13R-202',
    BatchScale: '4380.00',
    DurationDays: '1',
    itemCode: [
      { itemsCode: '451394201583925', ProductionCode: '451394201583925', InBomName: 'OIL-BR (925 Kg) IBC CLEAN ROOM' },
    ],
    packagingtype: [
      { itemCode: '494603110', productName: 'IBC CONTAINER (SECOND HAND)  1st-Org1', packagingQtyKsg: '925.00' },
    ],
  },
  {
    productionCode: '451506101753180',
    productionName: 'OSMORIN DA-50 (180kg) D/M 1st-org1',
    planName: 'TP-1',
    ReactorName: '11R-311',
    BatchScale: '5943.00',
    DurationDays: '1',
    itemCode: [
      { itemsCode: '451506101753180', ProductionCode: '451506101753180', InBomName: 'OSMORIN DA-50 (180kg) D/M 1st-org1' },
    ],
    packagingtype: [
      { itemCode: '494604610', productName: 'PL D/M (9.5) 1st-Org-1(TAIKO)', packagingQtyKsg: '180.00' },
    ],
  },
])

const dataMockProductionCodeModel2 = ref([
  {
    productionCode: '451640101753170',
    productionName: ' CATION PG-50  D/M  1st-org1',
    planName: 'TP-1',
    reactorName: '11R-321',
    batchScale: '6111.00',
    durationDays: '3',
    itemCode: [
      { itemsCode: '451640101753170', InBomName: 'CATION PG-50  D/M  1st-org1' },
    ],
    packagingtype: [
      { itemCode: '494604610', productName: 'PL D/M (9.5) 1st-Org-1(TAIKO)', packagingQtyKsg: '170.00' },
    ],
  },
  {
    productionCode: '451715300551170',
    productionName: 'SANPRENE IB-D20  D/M  1st-Org2',
    planName: 'TP-1',
    ReactorName: '11R-331',
    BatchScale: '9118.00',
    DurationDays: '2',
    itemCode: [
      { itemsCode: '451715300551170', InBomName: 'SANPRENE IB-D20  D/M  1st-Org2' },
      { itemsCode: '451715300751170', InBomName: 'SANPRENE IB-D20(Export)  D/M  1st-Org2' },
    ],
    packagingtype: [
      { itemCode: '494601910', productName: 'BC18D/M  1st-Org1', packagingQtyKsg: '170.00' },
      { itemCode: '494601930', productName: 'BC18D/M  1st-Org2', packagingQtyKsg: '170.00' },
    ],
  },
  {
    productionCode: '451789102553200',
    productionName: 'AL-40  D/M  1st-org1 DO',
    planName: 'Cleanroom',
    ReactorName: '13R-201',
    BatchScale: '5000.00',
    DurationDays: '1',
    itemCode: [
      { itemsCode: '451789102553200', InBomName: 'AL-40  D/M  1st-org1 DO' },
    ],
    packagingtype: [
      { itemCode: '494604320', productName: 'PL D/M small cap PackDelta Clean room', packagingQtyKsg: '200.00' },
    ],
  },
])

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
      console.log("getProductionplanMasterResult", getProductionplanMasterResult.value.data)
      dataMasterForSelectFilter.value = getProductionplanMasterResult.value.data
    } else {
      console.warn("getProductionplanMasterResult.data is not an array")
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

const selectedItemCode = ref(null)
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

const selectItemCodeSwitch = computed(() => {
  if (btnSelectitem1.value) return selectedItemCode.value
  if (btnSelectitem2.value) return selectedItemCode2.value
  
  return [] // Default empty or fallback data
})

const selectPackagingTypeSwitch = computed(() => {
  if (btnSelectitem1.value) return selectedPackagingType.value
  if (btnSelectitem2.value) return selectedPackagingType2.value
  
  return [] // Default empty or fallback data
})

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

//------------------------------ func get production plan service --------------------------------
const { getProductionplanResult, errorMessageGetProductionPlan, fetchGetProductionplan } = useGetProductionPlanService()

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

  console.log("dataTableNummberedToggle.value:", dataTableNummberedToggle.value, "no:", no)
}

watchEffect(async () => {
  try {
    // เรียก fetchGetProductionplan และรอให้ทำงานเสร็จ
    await fetchGetProductionplan(batchId.value, urlApi.value, 'ProductionPlan', whereHouse, accessTokenAtStore)

    // อัปเดต productionPlan.value หลังจากได้ผลลัพธ์
    productionPlan.value = (getProductionplanResult.value.data)

    // แสดงค่าใน console
    console.log("productionPlan", productionPlan.value)
  } catch (error) {
    // จัดการข้อผิดพลาด
    console.error("Error fetching production plan:", error)
  }
})

//------------------------------ func Save add data production plan service --------------------------------
const indexSelectBoxFilter = ref(null)

const selectFilterProduction = index => {
  indexSelectBoxFilter.value = index
  isDialogVisibleFilterSelect.value = true
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const addSelectProdutionCode = index => {
  // อัปเดตค่าที่เลือกในตำแหน่งของแถวที่กด
  productionPlan.value[index].productionCode = selectedProductionCode.value || null
  productionPlan.value[index].productionName = selectedProductionName.value || null
  productionPlan.value[index].reactorName = selectedProductionReactorName.value || null
  productionPlan.value[index].batchID = selectedProductionbatchScaleKgs.value || null
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
  try {
    console.log("saveProductionPlan staret in")


    // กรองข้อมูลเฉพาะฟิลด์ที่ต้องการจาก getProductionplanResult.value
    

    const filteredData = productionPlan.value.map(item => ({
      planningID: item.planningID,
      inputDate: item.inputDate,
      productionCode: item.productionCode,

      product1SelectedCode: item.product1SelectedCode,
      product1SelectedPackagingCode: item.product1SelectedPackagingCode,
      product1PackingQtyKgs: item.product1PackingQtyKgs,
      product1UomCount: item.product1UomCount,

      product2SelectedCode: item.product2SelectedCode,
      product2SelectedPackagingCode: item.product2SelectedPackagingCode,
      product2PackingQtyKgs: item.product2PackingQtyKgs,
      product2UomCount: item.product2UomCount,

      lotNumber: item.lotNumber,
      producingDate: item.producingDate,
      remark: item.remark,
    }))

    console.log("saveProductionPlan staret in 2")

    // ส่งข้อมูลที่กรองแล้วไปยัง API
    await saveProdutcionPlanFunc(filteredData, urlApi.value, 'ProductionPlan', whereHouse, accessTokenAtStore)

    // // อัปเดต productionPlan.value หลังจากบันทึกข้อมูล
    // productionPlan.value = filteredData

    console.log("saveProductionPlan staret in 3")

    // แสดงค่าใน console
    console.log("Filtered Production Plan Saved:", filteredData)
  } catch (error) {
    // จัดการข้อผิดพลาด
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
const selectedDataTables = ref([])

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
    textAlertDialogFunction(alertWordConst.saveDraft, true)
    setTimeout(() => {
      location.reload()
    }, 500) // 10000 มิลลิวินาที = 10 วินาที
  }else{
    console.log("New Plan Not Success")
    textAlertDialogFunction(alertWordConst.saveDraft, false)
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
                  color="light-blue-lighten-1"
                  :variant="btnSelectitem1 ? 'tonal' : 'flat'"
                  @click="btnSelectitem1 = true, btnSelectitem2 = false"
                >
                  Item 1
                </VBtn> 
                <VBtn
                  color="red-lighten-1"
                  :variant="btnSelectitem2 ? 'tonal' : 'flat'"
                  @click="btnSelectitem1 = false, btnSelectitem2 = true"
                >
                  Item 2
                </VBtn>
              </VCol>
              <VCol cols="2">
                <VBtn @click="confirmFilterSelectProduction">
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
              <div class="d-flex justify-center">
                <VTextField
                  v-model="searchForMasterDataPlan"
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
                :items-per-page="5"
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
                      <span style="font-size: 12px;">{{ item.raw.batchScaleKgs }}</span>
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
                        color="info"
                        variant="tonal"
                        
                        @click="selectPlan(item.raw, index)"
                      >
                        Select
                      </VBtn>
                      <VBtn
                        v-if="item.raw.productionCode !== selectedProductionCode"
                        color="info"
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
                v-if="selectedProductionCode.length > 0"
                :headers="itemCodeDataTable"
                :items="dataMasterForSelectFilter.find(
                  (data) => data.productionCode === selectedProductionCode
                ).products"
                :items-per-page="5"
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
                        color="info"
                        variant="tonal"
                        @click="selectItemCode(item.raw, index)"
                      >
                        Select
                      </VBtn>
                      <VBtn
                        v-if="item.raw.itemCode !== selectItemCodeSwitch"
                        color="info"
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
                v-if="selectedProductionCode.length > 0"
                :headers="packagingKgsDataTable"
                :items="dataMasterForSelectFilter.find(
                  (data) => data.productionCode === selectedProductionCode
                ).packagings"
                :items-per-page="5"
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
                      <span style="font-size: 12px;">{{ item.raw.packingQtyKgs }}</span>
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
                        color="info"
                        variant="tonal"
                        @click="selectPackaging(item.raw)"
                      >
                        Select
                      </VBtn>
                      <VBtn
                        v-if="item.raw.itemCode !== selectPackagingTypeSwitch"
                        color="info"
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
        <VBtn @click="addEmptyRowToPlan">
          <span style="font-size: 12px;">New Plan</span>
        </VBtn>
        <VBtn
          class="mx-2"
          color="warning"
          @click="saveProductionPlan"
        >
          <span style="font-size: 12px;">Save Draft</span>
        </VBtn>
        <VBtn
          class="mx-2"
          color="warning"
          @click="viewAllData"
        >
          <span style="font-size: 12px;">Submit</span>
        </VBtn>
        <VBtn @click="viewAllData">
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
          color="error"
          class="mx-2"
          @click="deletePlan"
        >
          <span style="font-size: 12px;">Cancel Batch</span>
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
                class="text-center px-2"
                style="position: sticky; z-index: 1; left: 0;"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <VCheckboxBtn
                  v-model="selectedDataTables"
                  :value="item.raw"
                  @update:modelValue="(selected) => handleSelection(selected, item.raw)"
                />
              </td>
              <td
                style="position: sticky; z-index: 1; left: 40px; min-width: 150px;  justify-content: center; padding-block: 2px !important;"
                class="text-start"
              >
                <VChip
                  :color="colorStatusWithId(item.raw.statusId).color"
                  :style="{ color: colorStatusWithId(item.raw.statusId).color }"
                >
                  {{ colorStatusWithId(item.raw.statusId).text }}
                </VChip>
              </td>
              <td>{{ item.raw.no }}</td>
              <td>
                <AppDateTimePicker
                  v-model="item.raw.inputDate"
                  density="compact"
                  prepend-inner-icon="ri-calendar-schedule-fill"
                  :config="{ dateFormat: 'Y-m-d' }"
                >
                  <template #label>
                    <span>Input Data</span>
                  </template>
                </AppDateTimePicker>
              </td>
              <td>
                <VCombobox
                  v-if="false"
                  v-model="item.raw.productionCode"
                  :items="dataMockProductionCode"
                  placeholder="deployment"
                  density="compact"
                  label="Plants Code"
                  style="width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                />
                <VBtn
                  variant="outlined"
                  @click="selectFilterProduction(index)"
                >
                  <span v-if="item.raw.productionCode">{{ item.raw.productionCode }}</span><span v-else>Select Production</span>
                  <template #append>
                    <VIcon icon="ri-arrow-down-s-fill" />
                  </template>
                </VBtn>
              </td>
              <td>{{ item.raw.reactorName }}</td>
              <td>
                {{ productionName }}
              </td>
              <td
                class="px-1"
                style="min-width: 150px;"
              >
                batchScaleKgs
              </td>
              <td class="bg-light-blue-lighten-5">
                <VCombobox
                  v-if="false"
                  v-model="item.raw.product1SelectedCode"
                  :items="productNamesMockItems"
                  density="compact"
                  style="width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                >
                  <template #label>
                    <span style="font-size: 12px;">Item Code 1</span>
                  </template>
                </VCombobox>
                <VBtn
                  variant="outlined"
                  @click="selectFilterProduction(index)"
                >
                  <span v-if="item.raw.product1SelectedCode">{{ item.raw.product1SelectedCode }}</span><span v-else>Select Item</span>
                  <template #append>
                    <VIcon icon="ri-arrow-down-s-fill" />
                  </template>
                </VBtn>
              </td>
              <td class="bg-light-blue-lighten-5">
                {{ item.raw.product1Name }}
              </td>
              <td class="bg-light-blue-lighten-5">
                <VCombobox
                  v-if="false"
                  v-model="item.raw.product1SelectedPackagingCode"
                  :items="productNamesMockItems"
                  density="compact"
                  style="width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                >
                  <template #label>
                    <span style="font-size: 12px;">Packaging Type</span>
                  </template>
                </VCombobox>
                <VBtn
                  variant="outlined"
                  @click="selectFilterProduction(index)"
                >
                  <span v-if="item.raw.product1SelectedPackagingCode">{{ item.raw.product1SelectedPackagingCode }}</span><span v-else>Select Packaging</span>
                  <template #append>
                    <VIcon icon="ri-arrow-down-s-fill" />
                  </template>
                </VBtn>
              </td>
              <td class="bg-light-blue-lighten-5">
                {{ item.raw.product1PackingQtyKgs }}
              </td>
              <td class="bg-light-blue-lighten-5">
                <VTextField
                  v-model="item.raw.product1UomCount"
                  type="number"
                  style="min-width: 100px;"
                  density="compact"
                  :readonly="item.raw.status === 'Submit'"
                >
                  <template #label>
                    <span style="font-size: 12px;">Packaging Pcs 1</span>
                  </template>
                </VTextField>
              </td>

              <td class="bg-red-lighten-5">
                <VCombobox
                  v-if="false"
                  v-model="item.raw.product2SelectedCode"
                  :items="productNamesMockItems"
                  density="compact"
                  style="width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                >
                  <template #label>
                    <span style="font-size: 12px;">Item Code 2</span>
                  </template>
                </VCombobox>
                <VBtn
                  variant="outlined"
                  @click="selectFilterProduction(index)"
                >
                  <span v-if="item.raw.product2SelectedCode">{{ item.raw.product2SelectedCode }}</span><span v-else>Select Production</span>
                  <template #append>
                    <VIcon icon="ri-arrow-down-s-fill" />
                  </template>
                </VBtn>
              </td>
              <td class="bg-red-lighten-5">
                {{ item.raw.product2Name }}
              </td>
              <td class="bg-red-lighten-5">
                <VCombobox
                  v-if="false"
                  v-model="item.raw.product2SelectedPackagingCode"
                  :items="productNamesMockItems"
                  density="compact"
                  style="width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                >
                  <template #label>
                    <span style="font-size: 12px;">Packaging Type 2</span>
                  </template>
                </VCombobox>
                <VBtn
                  variant="outlined"
                  @click="selectFilterProduction(index)"
                >
                  <span v-if="item.raw.product2SelectedPackagingCode">{{ item.raw.product2SelectedPackagingCode }}</span><span v-else>Select Packaging</span>
                  <template #append>
                    <VIcon icon="ri-arrow-down-s-fill" />
                  </template>
                </VBtn>
              </td>
              <td class="bg-red-lighten-5">
                {{ item.raw.product2PackingQtyKgs }}
              </td>
              <td class="bg-red-lighten-5">
                <VTextField
                  v-model="item.raw.product2UomCount"
                  type="number"
                  style="min-width: 100px;"
                  density="compact"
                  :readonly="item.raw.status === 'Submit'"
                >
                  <template #label>
                    <span style="font-size: 12px;">Packaging Pcs 1</span>
                  </template>
                </VTextField>
              </td>
             
              <td
                class="px-1"
                style="min-width: 150px;"
              >
                <VTextField
                  v-model="item.raw.lotNumber"
                  density="compact"
                  style="min-width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                />
              </td>
              <td
                class="px-1"
                style="min-width: 150px;"
              >
                <AppDateTimePicker
                  v-model="item.raw.producingDate"
                  placeholder="Producing date"
                  density="compact"
                  style="font-size: 12px;"
                  prepend-inner-icon="ri-calendar-schedule-fill"
                  :config="{ dateFormat: 'Y-m-d' }"
                />
              </td>
              <td
                class="px-1"
                style="min-width: 150px;"
              >
                {{ formatDate(item.raw.finishedDate) }}
              </td>
              <td>
                <VTextarea
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
              </td>
              <td>
                {{ item.raw.statusDate }}
              </td>
              <td>
                {{ item.raw.byWho }}
              </td>
              <td v-if="false"> 
                <div class="d-flex justify-center">
                  <VMenu transition="scale-transition">
                    <template #activator="{ props }">
                      <VIcon
                        v-bind="props"
                        icon="ri-more-2-fill"
                      />
                    </template>
                    <VList>
                      <VListItem
                        v-for="(itemAction, index) in itemsActionDataTable"
                        :key="index"
                        @click="handleAction(itemAction.value)"
                      >
                        {{ itemAction.title }}
                        <template #prepend>
                          <VIcon :icon="itemAction.icon" />
                        </template>
                      </VListItem>
                    </VList>
                  </VMenu>
                </div>
                <div v-if="false">
                  <VBtn
                    color="warning"
                    @click="changeStatusProductPlanSaveDraft(index)"
                  >
                    Save Draft
                  </VBtn>
                  <VBtn
                    v-if="RoleAccount === 'Manager'"
                    color="red"
                    class="mx-2"
                    @click="rejectProduction(index)"
                  >
                    Reject
                  </VBtn>
                  <VBtn
                    v-if="RoleAccount !== 'Manager'"
                    color="red"
                    class="mx-2"
                    @click="cancelProduct(index)"
                  >
                    Cancel
                  </VBtn>
                  <VBtn
                    v-if="RoleAccount !== 'Manager'"
                    class="mx-2"
                    color="green"
                    @click="changeStatusProductPlanSubmit(index)"
                  >
                    Submit
                  </VBtn>
                  <VBtn
                    v-if="RoleAccount === 'Manager'"
                    class="mx-2"
                    color="green"
                    @click="changeStatusProductPlanSubmit(index)"
                  >
                    Approve
                  </VBtn>
                  <VBtn
                    color="warning"
                    prepend-icon="ri-printer-fill"
                  >
                    {{ $t('Print') }}
                  </VBtn>
                </div>
              </td>
              <td v-if="item.status === 'Submit' && RoleAccount !== 'Manager'"> 
                <VBtn
                  color="grey"
                  disabled
                  @click="changeStatusProductPlanSaveDraft(index)"
                >
                  Save Draft
                </VBtn>
                <VBtn
                  color="grey"
                  disabled
                  class="mx-2"
                  @click="cancelProduct(index)"
                >
                  Cancel
                </VBtn>
                <VBtn
                  class="mx-2"
                  color="grey"
                  disabled
                  @click="changeStatusProductPlanSubmit(index)"
                >
                  Submit
                </VBtn>
              
                <VBtn
                  color="warning"
                  prepend-icon="ri-printer-fill"
                >
                  {{ $t('Print') }}
                </VBtn>
              </td>
            </tr>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>
  </section>

  <!-- Alert Dialog Success/Fiald new -->
  <section>
    <div>
      <!-- ใช้ AuthenticatorDialog component -->
      <AuthenticatorDialog
        :is-dialog-visible="isDialogVisibleAlertDialog"
        :word="wordForSubmit"
        :success="successDialAlert"
        @update:isDialogVisible="(val) => isDialogVisibleAlertDialog.value = val"
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
          Version : 2.5(Last Updated 11/11/2024 ) {{ products.length }} Rows of Data 
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

