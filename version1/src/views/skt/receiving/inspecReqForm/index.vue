<script setup>
import { urlApi } from '@/api' //---------------------- Import Api for Url *****
import axiosIns from '@axios'
import { ref, watch, watchEffect } from 'vue'

const props = defineProps({
  Data: Array,
})

const route = useRoute()

// const dataProps = ref(JSON.parse(route.query.Data || '[]'))

// //console.log('Data**', data)

import { useItemStore } from '@/stores/skt/receingFormStore/itemStore'

const itemStore = useItemStore()
const userDataInfo = ref(itemStore.getItemDetails('UserDataCookies'))


//-------------------------------------------- Permission -----------------------------------------

// const { getUserPermissionResult, errorGetUserPermission, fetchUserPermission } = useGetUserPermissionService()
import { canVisibleUserPermissionPermission, fetchUserPermissions } from '@/utilities/permission'


const paramsForGetPermission = ref({
  empId: String(userDataInfo.value.id) || '',
  statusId: '',
  uiControlContextId: '3',
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

const data = ref(itemStore.getItemDetails('itemDataCookies'))

const whereHouse = ref(localStorage.getItem('whereHouseName'))
const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')
const userName = ref(localStorage.getItem('userCheck'))

const roleAccount = ref('issues')

function formatDate(dateString) {
  const date = new Date(dateString) // แปลงสตริงเป็นวัตถุ Date
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // เดือนเริ่มต้นที่ 0, ดังนั้นต้อง +1
  const year = date.getFullYear()
  
  return `${day}/${month}/${year}`
}

const formatNumberToLocal = value => {
  if (value !== null && value !== undefined) {
    return parseFloat(value).toLocaleString(undefined)
  }
  
  return '0'
}

watchEffect(() => {
  if(localStorage.getItem('userCheck') === 'supwh'){
    roleAccount.value = 'manager'
  } else if(localStorage.getItem('userCheck') === 'staff'){
    roleAccount.value = 'issues'
  } else if(localStorage.getItem('userCheck') === 'admin'){
    roleAccount.value = 'admin'
  }
})

//-------------------------------------- Validate input --------------------------------
const maxLines = 4
const maxCharsPerLine = 130

const limitTextInputLine4Note = event => {
  const inputText = event.target.value
  let lines = inputText.split('\n')
  
  const maxLines = 4
  const maxCharsPerLine = 130

  // ป้องกันไม่ให้พิมพ์เกิน 130 ตัวอักษรในแต่ละบรรทัด
  for (let i = 0; i < lines.length; i++) {
    while (lines[i].length > maxCharsPerLine) {
      // ถ้าตัวอักษรเกิน 130 ตัวในบรรทัดที่กำหนด ให้ขึ้นบรรทัดใหม่
      let extraText = lines[i].slice(maxCharsPerLine)
      lines[i] = lines[i].slice(0, maxCharsPerLine)
      
      if (i + 1 < maxLines) {
        // ถ้าบรรทัดถัดไปยังไม่เกิน 4 ให้เพิ่มบรรทัดใหม่
        lines.splice(i + 1, 0, extraText)
      } else {
        // ถ้าเกิน 4 บรรทัดแล้ว ให้ตัดส่วนที่เกินทิ้ง
        break
      }
    }
  }

  // ป้องกันไม่ให้เกินจำนวนบรรทัดที่กำหนด
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines)
  }

  // อัปเดตค่าใน textarea
  event.target.value = lines.join('\n')
  headerInsp.value.note = event.target.value
}

const limitTextInputLine4Details = event => {
  const inputText = event.target.value
  let lines = inputText.split('\n')
  
  const maxLines = 4
  const maxCharsPerLine = 130

  // ป้องกันไม่ให้พิมพ์เกิน 130 ตัวอักษรในแต่ละบรรทัด
  for (let i = 0; i < lines.length; i++) {
    while (lines[i].length > maxCharsPerLine) {
      // ถ้าตัวอักษรเกิน 130 ตัวในบรรทัดที่กำหนด ให้ขึ้นบรรทัดใหม่
      let extraText = lines[i].slice(maxCharsPerLine)
      lines[i] = lines[i].slice(0, maxCharsPerLine)
      
      if (i + 1 < maxLines) {
        // ถ้าบรรทัดถัดไปยังไม่เกิน 4 ให้เพิ่มบรรทัดใหม่
        lines.splice(i + 1, 0, extraText)
      } else {
        // ถ้าเกิน 4 บรรทัดแล้ว ให้ตัดส่วนที่เกินทิ้ง
        break
      }
    }
  }

  // ป้องกันไม่ให้เกินจำนวนบรรทัดที่กำหนด
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines)
  }

  // อัปเดตค่าใน textarea
  event.target.value = lines.join('\n')
  headerInsp.value.details = event.target.value
}

//------------------------------------ Purchest Item --------------------------------
const headerInsp =ref({
  sktName: null,
  sktId: '',
  itemCode: null,
  supplierName: null,
  receivedDate: null,
  tradeNames: null,
  ManufacturerName: null,
  certiCOA: null,
  remark: null,
  note: null,
  details: null,

  updateByStaffWH: null,
  updateBySuperWH: null,
  updateByStaffInsp: null,
  updateBySuperInsp: null,

  lastUpdatedStaffWH: null,
  lastUpdatedSuperWH: null,
  lastUpdatedStaffInsp: null,
  lastUpdatedSuperInsp: null,

  remarkReject: null,

})

const analysistInsp = ref({

})

import { useGetCOAFormController } from '@/utilities/utilities'

//--------------------------- convert----------------------------
const { formatNumber } = useGetCOAFormController()

const covertFloatFixedTwo = convert => {
  return formatNumber(convert)
}

//-------------------------- Dialog ---------------------------
const isDialogVisibleInput = ref({}) // ใช้ Object แทน Boolean
const JournalIdAreaInput = ref(null)

const toggleDialog = journalId => {
  // ตรวจสอบว่าค่ามีอยู่ใน object หรือไม่
  isDialogVisibleInput.value[journalId] = !isDialogVisibleInput.value[journalId]
}

//--------------------------- API --------------------------------

//-------------- Generate---------------------------------------

const poEtlLogDetailJournalIDQueryParameters = ref(itemStore.getItemDetails('poEtlLogDetailJournalIDCookies'))

const generatedInsp = async () => {

  axiosIns.post(`${urlApi.value}/api/v1/Inspection/Generate/${poEtlLogDetailJournalIDQueryParameters.value}`, {}, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`, 
    },
  },
  {})
    .then(response => {

      // itemsManufacturer.value = response.data.data

      //console.log('[generatedReceivingForm]!!: ', response.data)
      loadingGenerated1.value = false

    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

const dataPO = ref('')

//------------- journalId
const responseGener = ref([])

const statusId = ref(null) // ตัวแปรสำหรับเก็บค่า statusId
const isReject = ref(null)
const isAccept = ref(null)
const frozeCheck = ref(true)
const frozeCheckNotDetialCheck  = ref(true)
const receiveTypeIdData = ref(null)
const poEiLog = ref()

const generatedJournalId = async () => {
  axiosIns.get(`${urlApi.value}/api/v1/ReceivingPlan/GetByPoEtlLogDetailJournalID/${poEtlLogDetailJournalIDQueryParameters.value}`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`, 
    },
  },
  {})
    .then(response => {
      //console.log('%c[generatedJournalId] nre!!: ', "color: green; font-weight: bold", response.data)

      // ตรวจสอบว่ามีข้อมูลใน response.data.data ก่อน
      if (response.data && response.data.data && response.data.data.length > 0) {
        responseGener.value = response.data.data // เก็บค่า response.data.data ลงใน responseGener

        const item = responseGener.value[0] // เข้าถึงข้อมูลตัวแรกใน array

        poEtlLogDetailJournalIDQueryParameters.value = item.poEtlLogDetailJournalID
        receiveTypeIdData.value = item.receiveTypeId
        statusId.value = item.statusId // เก็บค่า statusId
        loadingGenerated2.value = false
      } else {
        console.error("ไม่มีข้อมูลใน responseGener")
      }
    })
    .catch(error => {
      console.error('Error:', error)
    })
}

// eslint-disable-next-line sonarjs/cognitive-complexity
watchEffect(() => {
  if(statusId.value === 4 && canVisibleUserPermission(statusPermission.value, 'BTN_SAVE_DRAFT').canVisible){
    frozeCheck.value = false
  }

  if(statusId.value === 5 && canVisibleUserPermission(statusPermission.value, 'BTN_SAVE_DRAFT').canVisible){
    frozeCheck.value = false
  }

  if(sessionStorage.getItem('typeLorryInfoId') === '01' || sessionStorage.getItem('typeLorryInfoId') === '02'){
    
    if(statusId.value === 12 && canVisibleUserPermission(statusPermission.value, 'BTN_SAVE_DRAFT').canVisible){
      frozeCheck.value = false
    }

    if(statusId.value === 14 && canVisibleUserPermission(statusPermission.value, 'BTN_SAVE_DRAFT').canVisible){
      frozeCheck.value = false
    }

  }


  if(statusId.value === 4 && canVisibleUserPermission(statusPermission.value, 'BTN_SAVE_DRAFT').canVisible){
    frozeCheckNotDetialCheck.value = false
  }

  if(statusId.value === 5 && canVisibleUserPermission(statusPermission.value, 'BTN_SAVE_DRAFT').canVisible){
    frozeCheckNotDetialCheck.value = false
  }

})

// eslint-disable-next-line sonarjs/cognitive-complexity
watch( async () => {
  await generatedInsp()
  await generatedJournalId()

  if(statusId.value === 4 && canVisibleUserPermission(statusPermission.value, 'BTN_SAVE_DRAFT').canVisible){
    frozeCheck.value = false
  }

  if(statusId.value === 5 && canVisibleUserPermission(statusPermission.value, 'BTN_SAVE_DRAFT').canVisible){
    frozeCheck.value = false
  }
  if(sessionStorage.getItem('typeLorryInfoId') === '01' || sessionStorage.getItem('typeLorryInfoId') === '02'){
    
    if(statusId.value === 12 && canVisibleUserPermission(statusPermission.value, 'BTN_SAVE_DRAFT').canVisible){
      frozeCheck.value = false
    }

    if(statusId.value === 14 && canVisibleUserPermission(statusPermission.value, 'BTN_SAVE_DRAFT').canVisible){
      frozeCheck.value = false
    }

  }

  if(statusId.value === 4 && canVisibleUserPermission(statusPermission.value, 'BTN_SAVE_DRAFT').canVisible){
    frozeCheckNotDetialCheck.value = false
  }

  if(statusId.value === 5 && canVisibleUserPermission(statusPermission.value, 'BTN_SAVE_DRAFT').canVisible){
    frozeCheckNotDetialCheck.value = false
  }
})

//--------------- get header --------------------------------


//------------- Header
// eslint-disable-next-line sonarjs/cognitive-complexity
const getHearderInsp = async () => {
  if (!poEtlLogDetailJournalIDQueryParameters.value) {
    console.warn('poEtlLogDetailJournalIDQueryParameters ยังไม่มีค่า')
    
    return
  }

  loadingGenerated1.value = true

  try {
    const response = await axiosIns.get(
      `${urlApi.value}/api/v1/Inspection/View/${poEtlLogDetailJournalIDQueryParameters.value}`,
      {
        headers: {
          accept: '*/*',
          'x-location': whereHouse.value || '',
          Authorization: `Bearer ${accessTokenAtStore || ''}`,
        },
      },
    )

    const data = response.data.data
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('Data ไม่ถูกต้อง:', data)
      
      return
    }

    const inspData = data[0]

    headerInsp.value = {
      sktName: inspData?.productName || '',
      sktId: inspData?.sktLot || '',
      itemCode: inspData?.productId || '',
      supplierName: inspData?.supplierName || '',
      tradeNames: inspData?.tradeName || '',
      ManufacturerName: inspData?.makerName || '',
      receivedDate: inspData?.receivedDate || '',

      remark: inspData?.remark || '',
      note: inspData?.note || '',
      details: inspData?.limConditionDetail || '',

      updateByStaffWH: inspData?.whStaff || '',
      updateBySuperWH: inspData?.whSupervisor || '',
      updateByStaffInsp: inspData?.inspStaff || '',
      updateBySuperInsp: inspData?.inspSupervisor || '',

      lastUpdatedStaffWH: inspData?.whStaffUpdatedDate || '',
      lastUpdatedSuperWH: inspData?.whSupervisorDate || '',
      lastUpdatedStaffInsp: inspData?.inspStaffUpdatedDate || '',
      lastUpdatedSuperInsp: inspData?.inspSupervisorDate || '',

      remarkReject: inspData?.statusComments || '',
    }

    isReject.value = inspData?.isReject || false
    isAccept.value = inspData?.isAccept || false

    console.log('Headers Data:', headerInsp.value)
  } catch (error) {
    console.error('Error fetching inspection header:', error)
  } finally {
    loadingGenerated1.value = false
  }
}

const state = reactive({
  analyticalItems: [],  // เก็บข้อมูลทั้งหมด
})

//------------- Analysist
//---------------- Model
const rawMatInspec = ref([
  { header: "" },
])

const rawMaterialInspection = ref([
  { analysisItems: 'Appearance', unit: '', analysisMethodNo: 'B0020 0ST00000', specificationRanges: 'Colorless clear liquid', actualAnalysis: '', a: '', B: '', C: '', D: '', E: '', aa: true },
  { analysisItems: 'Purity', unit: '[%]', analysisMethodNo: 'JISK-8085-72', specificationRanges: '25.0 ~ 28.0', actualAnalysis: '', a: '', B: '', C: '', D: '', E: '', aa: false },
  { analysisItems: 'Chloride(Cl) content', unit: '[%]', analysisMethodNo: 'JISK-8085-72', specificationRanges: '0.0005 max.', actualAnalysis: '', a: '', B: '', C: '', D: '', E: '', aa: false },
  { analysisItems: 'Sulfate(SO4) content', unit: '[%]', analysisMethodNo: 'JISK-8085-72', specificationRanges: '0.0020 max.', actualAnalysis: '', a: '', B: '', C: '', D: '', E: '', aa: false },
  { analysisItems: 'Iron(Fe) content', unit: '[%]', analysisMethodNo: 'JISK-8085-72', specificationRanges: '0.0003 max.', actualAnalysis: '', a: '', B: '', C: '', D: '', E: '', aa: false },
  { analysisItems: 'Heavy metal content', unit: '[%]', analysisMethodNo: 'JISK-8085-72', specificationRanges: '0.0005 max.', actualAnalysis: '', a: '', B: '', C: '', D: '', E: '', aa: true },
  
])

const Reference = ref([
  { analysisItems: 'Carbonate content', unit: '[%]', analysisMethodNo: 'JISK-8085-72', specificationRanges: '0.010 max.', actualAnalysis: '', a: '', B: '', C: '', D: '', E: '' },
  { analysisItems: 'Ignition residue', unit: '[%]', analysisMethodNo: 'JISK-8085-72', specificationRanges: '0.0050 max.', actualAnalysis: '', a: '', B: '', C: '', D: '', E: '' },
])

const analysisItems = ref([])

const analysisItemsInside = ref([])

const analysisItemsCode = ref({
  actualAmountUnits_1: null,
  actualAmountUnits_2: null,
  actualAmountUnits_3: null,
  actualAmountUnits_4: null,
  actualAmountUnits_5: null,

  actualAnalysis_1: null,
  actualAnalysis_2: null,
  actualAnalysis_3: null,
  actualAnalysis_4: null,
  actualAnalysis_5: null,

  actualMakerLotNo_1: null,
  actualMakerLotNo_2: null,
  actualMakerLotNo_3: null,
  actualMakerLotNo_4: null,
  actualMakerLotNo_5: null,

  actualNetCountKgs_1: null,
  actualNetCountKgs_2: null,
  actualNetCountKgs_3: null,
  actualNetCountKgs_4: null,
  actualNetCountKgs_5: null,

  actualTotalQuantityKgs_1: 0,
  actualTotalQuantityKgs_2: 0,
  actualTotalQuantityKgs_3: 0,
  actualTotalQuantityKgs_4: 0,
  actualTotalQuantityKgs_5: 0,
})

//-------------- API

const analysisResults = ref([])
const analyticalItemsResults = ref([])

const columnRadio = ref(1)
const inlineRadio = ref('radio-1')

const textValue = () => {
  //console.log("[textValue]", analysisItems.value)
}

// ข้อมูลต้นแบบที่เราจะเก็บเพื่อส่งไปยัง API
const formData = ref({
  inspReqLotJournalId: 0,   // ID ที่จะอัปเดต
  updatedBy: '',     // ชื่อผู้ใช้งาน
  actualAnalysis: '', // ค่าวิเคราะห์จริง
  okState: 0,                // ค่าจาก VRadioGroup
})

// eslint-disable-next-line sonarjs/cognitive-complexity
const getAnalysistInsp = async () => {
  loadingGenerated1.value = true

  if (!poEtlLogDetailJournalIDQueryParameters.value) {
    loadingGenerated1.value = false
    
    return
  }

  try {
    const response = await axiosIns.get(
      `${urlApi.value}/api/v1/Inspection/GetAnalyticalItems/${poEtlLogDetailJournalIDQueryParameters.value}`,
      {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse.value,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
      },
    )

    if (!response.data || !response.data.items) {
      console.warn("No data received from API")
      
      return
    }

    analysisItems.value = response.data.items

    // ตรวจสอบว่า analysisItems มีข้อมูลและมี itemAnalyticals
    if (analysisItems.value.length > 0 && Array.isArray(analysisItems.value[0].itemAnalyticals)) {
      for (let i = 0; i < Math.min(5, analysisItems.value[0].itemAnalyticals.length); i++) {
        const analyticalItem = analysisItems.value[0].itemAnalyticals[i]

        analysisItemsCode.value[`actualAmountUnits_${i}`] = analyticalItem.actualAmountUnits || null
        analysisItemsCode.value[`actualMakerLotNo_${i}`] = analyticalItem.actualMakerLotNo || null
        analysisItemsCode.value[`actualNetCountKgs_${i}`] = analyticalItem.actualNetCountKgs || null
        analysisItemsCode.value[`actualTotalQuantityKgs_${i}`] = analyticalItem.actualTotalQuantityKgs || null
      }
    }

    // ใช้ map() เพื่อสร้าง `analysisResults`
    analysisResults.value = analysisItems.value.map(item => ({
      rmInspReqFormAnalyticalItemsJournalId: item.rmInspReqFormAnalyticalItemsJournalId,
      typeID: item.typeID,
      typeName: item.typeName,
      analyticalItem: item.analyticalItem,
      unit: item.unit,
    }))

    // ใช้ reduce() เพื่อลดซ้อน loop
    analyticalItemsResults.value = analysisItems.value.reduce((acc, item) => {
      if (Array.isArray(item.itemAnalyticals)) {
        acc.push(
          ...item.itemAnalyticals.map(analyticalItem => ({
            rmInspReqFormAnalyticalItemsJournalId: analyticalItem.rmInspReqFormAnalyticalItemsJournalId,
            actualAmountUnits: analyticalItem.actualAmountUnits,
            actualAnalysis: analyticalItem.actualAnalysis,
            actualMakerLotNo: analyticalItem.actualMakerLotNo,
            actualNetCountKgs: analyticalItem.actualNetCountKgs,
            actualTotalQuantityKgs: analyticalItem.actualTotalQuantityKgs,
            inspReqLotJournalId: analyticalItem.inspReqLotJournalId,
            lotID: analyticalItem.lotID,
            okState: analyticalItem.okState,
          })),
        )
      }
      
      return acc
    }, [])

  } catch (error) {
    console.error("Error fetching analysis items:", error)
  } finally {
    loadingGenerated1.value = false
  }
}


const loadingGenerated1 = ref(true)
const loadingGenerated2 = ref(true)

watch(
  () => poEtlLogDetailJournalIDQueryParameters.value,
  async newVal => {
    if (newVal) {
      await getHearderInsp()
      await getAnalysistInsp()
    }
  },
  { immediate: true }, // ให้ทำงานทันทีตอนโหลดหน้า
)

//--------------- save header --------------------------------
const saveHeaderInspect = async () => {
  try {
    const body = {
      limConditionDetail: headerInsp.value.details,
      note: headerInsp.value.note,
    }

    const response = await axiosIns.post(`${urlApi.value}/api/v1/Inspection/SaveInspectionForm?PoEtlLogDetailJournalID=${poEtlLogDetailJournalIDQueryParameters.value}`, body, {
      headers: {
        'accept': '*/*',
        'x-location': `${whereHouse.value}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
    })

    // //console.log('[products.value]!!: ', response.data)
    // isDialogSubmitSuccessVisible.value = true
    return true
  } catch (error) {
    // Handle errors
    isDialogSubmitFailedVisible.value = true
    console.error('Error:', error)
  }
}

//--------------- save Lot --------------------------------
//---------------- Validate
const emptyFields = ref([])

const showOnlyErrors = ref(false) // ตั้งเป็น true เพื่อแสดงเฉพาะค่า error

const textAlertErrorOkState = ref('')

const checkOkState = (item, typeId, indexAnalysis) => {
  // ตรวจสอบว่ามีค่าใน itemAnalyticals ก่อนที่จะเข้าถึง
  if (item.itemAnalyticals && item.itemAnalyticals.length > indexAnalysis) {
    const analyticalItem = item.itemAnalyticals[indexAnalysis]
    if (analyticalItem.okState != null) {
      textAlertErrorOkState.value = 'Analysis result OK/Not is required!'
      
      return !item.needActualValue &&
             item.typeID === typeId &&
             analyticalItem.okState === -1

      // ตรวจสอบ okState เท่ากับ -1
      
    }
  }
  
  return false
}

const textAlertErrorAnalysitItem = ref('')

const checkAnalysitItem = (item, typeId, indexAnalysis) => {
  // ตรวจสอบว่ามีค่าใน itemAnalyticals ก่อนที่จะเข้าถึง
  if (item.itemAnalyticals && item.itemAnalyticals.length > indexAnalysis) {
    const analyticalItem = item.itemAnalyticals[indexAnalysis]

    textAlertErrorAnalysitItem.value = 'Analysis result Text is required!'
    
    return item.needActualValue &&
             item.typeID === typeId &&
             !analyticalItem.actualAnalysis 

    // ตรวจสอบ okState เท่ากับ -1
  }
  
  return false
}

const checkEmptyFields = () => {
  const emptyFieldsList = []

  analysisItems.value.forEach((item, itemIndex) => {
    item.itemAnalyticals.forEach((analyticalItem, analyticalIndex) => {
      const body = {
        inspReqLotJournalId: analyticalItem.inspReqLotJournalId,
        actualAnalysis: analyticalItem.actualAnalysis,
        okState: analyticalItem.okState,
      }

      const indexLabelFiled = `No.${itemIndex + 1} - Lot ${analyticalIndex + 1}`

      const indexLabelSuccessed =  `${itemIndex + 1} - Lot ${analyticalIndex + 1}`
      const needActualCheck = item.needActualValue

      // ตรวจสอบว่าต้องเช็ค actualAnalysis หรือ okState ตามค่า needActualValue
      if (item.needActualValue) {
        // เช็คเฉพาะ actualAnalysis
        if (!body.actualAnalysis) {
          emptyFieldsList.push({ indexLabelFiled, body, isEmpty: true, needActualCheck })
        } else {
          emptyFieldsList.push({ indexLabelSuccessed, body, isEmpty: false, needActualCheck })
        }
      } else {
        // เช็คเฉพาะ okState
        if (body.okState === -1) {
          emptyFieldsList.push({ indexLabelFiled, body, isEmpty: true, needActualCheck })
        } else {
          emptyFieldsList.push({ indexLabelSuccessed, body, isEmpty: false, needActualCheck })
        }
      }
    })
  })

  return emptyFieldsList
}

const filteredFields = computed(() => {
  if (!showOnlyErrors.value) {
    return emptyFields.value.filter(field => field.isEmpty) // กรองเฉพาะค่า error
  }
  
  return emptyFields.value // แสดงทั้งหมด
})

//---------------- api
const saveLotInspect = async () => {
  emptyFields.value = checkEmptyFields()

  // ตรวจสอบว่ามี error (emptyFields ที่เป็น error)
  
  const hasErrors = ref(null)
  if(trickerSubmit.value === true){
    hasErrors.value = emptyFields.value.some(field => field.isEmpty)
  }
  
  // ถ้ามี error ไม่ส่งข้อมูลไปยัง API
  if (hasErrors.value) {
    //console.log('Cannot proceed: There are errors in the fields.')

    // แสดง dialog แจ้งเตือนถ้าจำเป็น
    // isDialogSubmitFailedVisible.value = true
    
    throw "Cannot proceed: There are errors in the fields."
  }

  try {
    for (const item of analysisItems.value) {
      for (const analyticalItem of item.itemAnalyticals) {
        // สร้าง body สำหรับแต่ละ analyticalItem
        const body = {
          updatedBy: '', // ข้อมูลที่ต้องการส่ง
          inspReqLotJournalId: analyticalItem.inspReqLotJournalId,
          actualAnalysis: analyticalItem.actualAnalysis,
          okState: analyticalItem.okState,
        }

        // ส่ง body ไปยัง API ทีละตัว
        const response = await axiosIns.post(`${urlApi.value}/api/v1/Inspection/SaveLotDetails`, body, {
          headers: {
            'accept': '*/*',
            'x-location': `${whereHouse.value}`,
            Authorization: `Bearer ${accessTokenAtStore}`,
          },
        })

        //console.log('[response]: ', response.data)
      }
    }

    // แสดง dialog เมื่อสำเร็จ
    // isDialogSubmitSuccessVisible.value = true
    return true
  } catch (error) {
    // แสดง dialog เมื่อมีข้อผิดพลาด
    // isDialogSubmitFailedVisible.value = true
    console.error('Error:', error)
  }
}

//--------------- Submit --------------------------------

const trickerSubmit = ref(false)

const submitInspForm = async () => {
  try {
    // รอให้ submitButtonVisibleNew ทำงานและตรวจสอบว่ามันสำเร็จโดยไม่มี error
    const submitVisibleResult = await submitButtonVisibleNew()

    // ตรวจสอบว่า submitButtonVisibleNew สำเร็จ (ไม่เป็น null หรือ false)
    if (submitVisibleResult) {
      // ส่งข้อมูลไปยัง API เมื่อ submitButtonVisibleNew สำเร็จ
      const response = await axiosIns.post(`${urlApi.value}/api/v1/Inspection/Submit/${data.value.poEtlLogDetailJournalID}`, {}, {
        headers: {
          'accept': '*/*',
          'x-location': `${whereHouse.value}`,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
      })

      if(response){
        //console.log('[products.value]!!: ', response.data)

        // รีโหลดหน้าเมื่อส่งข้อมูลสำเร็จ
        textAlertDialogFunction('SUBMIT', true)

        // หน่วงเวลา 10 วินาที ก่อนที่จะ reload หน้าเว็บ
        setTimeout(() => {
          window.location.href = '/skt/receiving' // ใส่ URL ของหน้าที่ต้องการไป
        }, 500) // 10000 มิลลิวินาที = 10 วินาที

        return true
      }else{
        // ถ้าการตรวจสอบ submitButtonVisibleNew ไม่สำเร็จ แสดง error
        console.error('submitButtonVisibleNew failed, cannot submit')
        textAlertDialogFunction('SUBMIT', false)
      
        return false
      }
     
    } else {
      // ถ้าการตรวจสอบ submitButtonVisibleNew ไม่สำเร็จ แสดง error
      console.error('submitButtonVisibleNew failed, cannot submit')
      textAlertDialogFunction('SUBMIT', false)
      
      return false
    }
  } catch (error) {
    // จัดการ error
    console.error('Error:', error)
    console.error('submitButtonVisibleNew failed, cannot submit')
    textAlertDialogFunction('SUBMIT', false)

    // isDialogSubmitFailedVisible.value = true
    return false
  }
}

//-------- Fuction Cancel --------------------------------
const isDialogSubmitFailedVisible = ref(false)

const commentReject = ref('')
const commentBackToEdit = ref('')

const textAlertError = ref({
  success: false,

  comment: '',
  coa: '',
})

const rejectInsp = () => {
  //console.log("StaertSSSSS!!")

  if(!commentReject.value){
    textAlertError.value.success = true
    textAlertError.value.comment = 'Please provide a comment to reject the inspection.'
    
    return
  }

  axiosIns.post(`${urlApi.value}/api/v1/Inspection/Reject/${data.value.poEtlLogDetailJournalID}`, {}, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`, 
    },
    params: {
      statusComments: commentReject.value,
    },
  },
  {})
    .then(response => {
      // //console.log('[products.value]!!: ', response.data)
      // isDialogSubmitSuccessVisible.value = true
      // isDialogConfirmVisible.value = false

      textAlertDialogFunction('REJECT', true)

      // หน่วงเวลา 10 วินาที ก่อนที่จะ reload หน้าเว็บ
      setTimeout(() => {
        window.location.href = '/skt/receiving' // ใส่ URL ของหน้าที่ต้องการไป
      }, 500) // 10000 มิลลิวินาที = 10 วินาที
    
    })
    .catch(error => {
    // Handle errors
      textAlertDialogFunction('REJECT', false)
      console.error('Error:', error)
      isDialogSubmitFailedVisible.value = true
    })
}

const approveInsp = () => {
  //console.log("StaertSSSSS!!")
  axiosIns.post(`${urlApi.value}/api/v1/Inspection/accept/${data.value.poEtlLogDetailJournalID}`, {}, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`, 
    },
    params: {
      stockId: whereHouse.value,
    },
  },
  {})
    .then(response => {
      isDialogConfirmVisible.value = false

      textAlertDialogFunction('ACCEPT', true)

      // หน่วงเวลา 10 วินาที ก่อนที่จะ reload หน้าเว็บ
      setTimeout(() => {
        window.location.href = '/skt/receiving' // ใส่ URL ของหน้าที่ต้องการไป
      }, 500) // 10000 มิลลิวินาที = 10 วินาที
    
    })
    .catch(error => {
    // Handle errors
      textAlertDialogFunction('ACCEPT', false)
      console.error('Error:', error)
      isDialogSubmitFailedVisible.value = true
    })
}

const approveReceivingPlant = () => {
  axiosIns.post(`${urlApi.value}/api/v1/ReceivingPlan/whapproval/${data.value.poEtlLogDetailJournalID}`, {}, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
    .then(response => {
      //console.log(`Response for poEtlLogDetailJournalID ${data.value.poEtlLogDetailJournalID}:`, response.data)

      // isDialogSubmitSuccessVisible.value = true
      isDialogConfirmVisible.value = false

      
    })
    .catch(error => {
      // Handle errors
      console.error(`Error for poEtlLogDetailJournalID ${data.value.poEtlLogDetailJournalID}:`, error)
      isDialogSubmitFailedVisible.value = true
    })
}

//-------------------------- Send Back ---------------------------

const handelSendBack = async () => {
  //console.log('Send start')
  await axiosIns.post(`${urlApi.value}/api/v1/Inspection/Back/${data.value.poEtlLogDetailJournalID}`, {}, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`, 
    },
  },
  {})
    .then(response => {
      isDialogConfirmVisible.value = false

      textAlertDialogFunction('SEND BACK', true)

      // หน่วงเวลา 10 วินาที ก่อนที่จะ reload หน้าเว็บ
      setTimeout(() => {
        window.location.href = '/skt/receiving' // ใส่ URL ของหน้าที่ต้องการไป
      }, 500) // 10000 มิลลิวินาที = 10 วินาที
    
    })
    .catch(error => {
    // Handle errors
      textAlertDialogFunction('SEND BACK', false)
      console.error('Error:', error)

      // isDialogSubmitFailedVisible.value = true
    })
}

//--------------------------- Back To Edite ------------------

const handelBackToEdit = async () => {
  //console.log('Send start')
  await axiosIns.post(`${urlApi.value}/api/v1/Inspection/BackToEdit/${data.value.poEtlLogDetailJournalID}`, {}, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`, 
    },
    params: {
      statusComments: commentReject.value,
    },
  },
  {})
    .then(response => {
      isDialogConfirmVisible.value = false

      textAlertDialogFunction('Partial RCVD', true)

      // หน่วงเวลา 10 วินาที ก่อนที่จะ reload หน้าเว็บ
      setTimeout(() => {
        //location.reload()

        window.location.href = '/skt/receiving' // ใส่ URL ของหน้าที่ต้องการไป
      }, 500) // 10000 มิลลิวินาที = 10 วินาที
    
    })
    .catch(error => {
    // Handle errors
      textAlertDialogFunction('Partial RCVD', false)
      console.error('Error:', error)

      // isDialogSubmitFailedVisible.value = true
    })
}

//------------------- Btn ----------------------------

const  coaFiles = ref([])

const showAllImages = ref(false)
const selectedImageIndex = ref(0)  // เก็บ index ของรูปที่ถูกเลือก

const openDialog = index => {
  if(index >= 7 ){
    selectedImageIndex.value = 0 
  } else {
    selectedImageIndex.value = index  // กำหนด index ของรูปที่ถูกกด
  }
  isDialogVisibleCOA.value = true        // เปิด dialog
}

// จำกัดจำนวนรูปที่จะแสดงให้แค่ 9 รูป
const limitedImages = computed(() => coaFiles.value.slice(0, 9))

const imgExCOA = ref()

const progressValue = ref(0)
const interval = ref(null)
const isLoading = ref(true)  // เพิ่มตัวแปรเพื่อควบคุมการแสดงผลของ VProgressCircular
const startTime = ref('dd') // เพิ่มตัวแปรเพื่อเก็บเวลาที่เริ่มโหลด

const checkBoxCOAYes = ref(false)
const checkBoxCOANo = ref(false)

const getCOAReceivingForm = () => {
  if (poEtlLogDetailJournalIDQueryParameters.value) {
    axiosIns.get(
      `${urlApi.value}/api/v1/ReceivingForm/get-coA/${poEtlLogDetailJournalIDQueryParameters.value}`,
      {
        headers: {
          'accept': '*/*',
          'x-location': `${whereHouse.value}`,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
      },
    )
      .then(response => {
        const lotData = response.data.data

        coaFiles.value = lotData
        checkBoxCOAYes.value = true

        // ตรวจสอบความยาวของ coaFiles ก่อนตั้งค่า isLoading เป็น false
        if (coaFiles.value.length > 0) {
          isLoading.value = false
        }

        startTime.value = coaFiles.value.length

        //console.log('[*****Headers COA]]!!: ', lotData)
        loadingGenerated1.value = false
      })
      .catch(error => {
        console.error('Error:', error)
        loadingGenerated1.value = true
        checkBoxCOANo.value = true
      })
  }
}

onMounted(() => {
  getCOAReceivingForm() // เรียกใช้ฟังก์ชันเพื่อโหลดข้อมูลจาก API
})


//----------------- COA ---------------------------------------------
const  colors = [
  'primary',
  'secondary',
  'yellow darken-2',
  'red',
  'orange',
]
        
const model = ref(0)
        
const form = ref({
  sktName: '',
  rawMatCode: '',
  tradeName: '',
  supplierName: '',
  receivedDate: '',
  sktLotNo: '',
  manufacturerName: '',
  warehouse: '',
  poNo: '',
  invoiceNo: '',
  deliveryDetails: [],
  notes: '',
})

const tableHeaders = [
  { text: 'Maker Lot No.', value: 'makerLotNo' },
  { text: 'Net Cont.(kg)', value: 'netCont' },
  { text: 'Amount(Unit)', value: 'amount' },
  { text: 'Actions', value: 'actions', sortable: false },
]

const addNewDetail = () => {
  form.value.deliveryDetails.push({ makerLotNo: '', netCont: '', amount: '' })
}

const editDetail = item => {
  // Logic to edit the detail
}

const deleteDetail = item => {
  const index = form.value.deliveryDetails.indexOf(item)
  if (index > -1) {
    form.value.deliveryDetails.splice(index, 1)
  }
}

const checkboxOne = ref(false)

//--------------------------------- Date Time -----------------------------------------
const dateStaffWarehouse = ref(new Date())
const dateSupervisorWarehouse = ref(new Date())
const dateStaffInspection = ref(new Date())
const dateSupervisorInspection = ref(new Date())

//--------------------------------  Dialog COA ----------------------------------------------------------------
const isDialogVisibleCOA = ref(false)


const srcImagCOA = ref('')

const showDialogCOA = img => {
  isDialogVisibleCOA.value = true
  srcImagCOA.value = img
}


//--------------------------- Dialog Submit -------------------------------
const isDialogConfirmVisible = ref(false)
const isDialogSubmitSuccessVisible = ref(false)
const isDialogTextAreaVisible = ref(false)

//-------------------- Watch Validate --------------------------------
const isDialogVisibleStepSaveDraft = ref(false)

//---------- Step 1 ------------------------
const iconStep1 = ref('ri-save-3-line')
const colorStep1 = ref('secondary')

//---------- Step 2 ------------------------
const iconStep2 = ref('ri-save-3-line')
const colorStep2 = ref('secondary')

//---------- Step 3 ------------------------
const iconStep3 = ref('ri-save-3-line')
const colorStep3 = ref('secondary')

//------------ loadind 1---------------------
const loadindingSaveDatft1 = ref(false)
const loadindingSaveDatftFailed1 = ref(false)
const loadindingSaveDatftSeccess1 = ref(false)

//------------ loadind 2 ---------------------
const loadindingSaveDatft2 = ref(false)
const loadindingSaveDatftFailed2 = ref(false)
const loadindingSaveDatftSeccess2 = ref(false)

//------------ loadind 3 ---------------------
const loadindingSaveDatft3 = ref(false)
const loadindingSaveDatftFailed3 = ref(false)
const loadindingSaveDatftSeccess3 = ref(false)

const wordForSubmit = ref('Word')

//--------------------- alertDialog--------------------------------------------------------
import AuthenticatorDialog from '@/components/dialogs/alert/alertDialog.vue'

const isDialogVisibleAlertDialog = ref(false)


const submitButtonVisibleNew = async word => {
  wordForSubmit.value = word
  isDialogVisibleStepSaveDraft.value = true

  try {
    // Start Step 1
    loadindingSaveDatft1.value = true

    // Step 1: saveLotReceivingForm

    await saveHeaderInspect()

    //console.log('saveHeaderReceivingForm success')

    iconStep1.value = 'ri-check-line'
    colorStep1.value = 'success'
    loadindingSaveDatftSeccess1.value = true
    loadindingSaveDatft1.value = false
  } catch (error) {
    console.error('saveLotReceivingForm failed:', error)

    iconStep1.value = 'ri-error-warning-line'
    colorStep1.value = 'error'
    wordForSubmit.value = "SAVE HEADER"

    loadindingSaveDatftFailed1.value = false
    loadindingSaveDatftSeccess1.value = false

    loadindingSaveDatft1.value = false
    isDialogConfirmVisible.value = false

    // isDialogSubmitFailedVisible.value = true

    return // หยุดการทำงานหากฟังก์ชันนี้ล้มเหลว
  }

  try {
    // Start Step 2
    loadindingSaveDatft2.value = true

    // Step 2: saveHeaderReceivingForm
    // console.error('Error: actualMakerLotNo_1 is empty or undefined. out')
    await saveLotInspect()

    //console.log('saveLotReceivingForm success')
    iconStep2.value = 'ri-check-line'
    colorStep2.value = 'success'

    loadindingSaveDatftSeccess2.value = true
    loadindingSaveDatft2.value = false
  } catch (error) {
    console.error('saveLotReceivingForm failed:', error)
    wordForSubmit.value = "SAVE LOT"
    iconStep2.value = 'ri-error-warning-line'
    colorStep2.value = 'error'
    wordForSubmit.value = "SAVE COA"

    loadindingSaveDatftFailed2.value = false
    loadindingSaveDatftSeccess2.value = false

    loadindingSaveDatft2.value = false

    // wordForSubmit.value = '2'
    isDialogConfirmVisible.value = false
    isDialogSubmitFailedVisible.value = false

    return // หยุดการทำงานหากฟังก์ชันนี้ล้มเหลว
  }

  // try {
  //   // Start Step 1
  //   loadindingSaveDatft3.value = true

  //   // Step 3: saveCOARecevingFrom
  //   await saveCOARecevingFrom()
  //   //console.log('saveCOARecevingFrom success')
  //   iconStep3.value = 'ri-check-line'
  //   colorStep3.value = 'success'
  //   loadindingSaveDatftSeccess3.value = true
  //   loadindingSaveDatft3.value = false
  // } catch (error) {
  //   console.error('saveCOARecevingFrom failed:', error)
  //   iconStep3.value = 'ri-error-warning-line'
  //   colorStep3.value = 'error'

  //   loadindingSaveDatftFailed3.value = false
  //   loadindingSaveDatftSeccess3.value = false

  //   loadindingSaveDatft3.value = false

  //   isDialogSubmitFailedVisible.value = false
  //   isDialogConfirmVisible.value = false

  //   return // หยุดการทำงานหากฟังก์ชันนี้ล้มเหลว
  // }

  // ปิด dialog เมื่อสำเร็จทุกขั้นตอน
  // isDialogVisibleStepSaveDraft.value = false

  if(trickerSubmit.value !== true){

    textAlertDialogFunction('SAVE DRAFT', true)

    // หน่วงเวลา 10 วินาที ก่อนที่จะ reload หน้าเว็บ
    setTimeout(() => {
      location.reload()
    }, 500) // 10000 มิลลิวินาที = 10 วินาที
  }

  // isDialogSubmitSuccessVisible.value = true
  isDialogConfirmVisible.value = false

  return true
}

const submitButton = word => {
  isDialogConfirmVisible.value = true
  wordForSubmit.value = word
  submitInspForm()
}

const saveDraftButton = async word => {
  trickerSubmit.value = false
  await submitButtonVisibleNew(word)
  wordForSubmit.value = word
}

const areaTextRemarkButton = word => {
  if(word === 'APPROVE REJECT'){
    wordForSubmit.value = word
    isDialogConfirmVisible.value = true
  }else {
    isDialogTextAreaVisible.value = true
    wordForSubmit.value = word
  }
}

const submitButtonVisible = word => {
  trickerSubmit.value = true
  wordForSubmit.value = word
  isDialogConfirmVisible.value = true
}

const approvetButtonVisible = word => {
  wordForSubmit.value = word
  isDialogConfirmVisible.value = true
}

const sendBackButtonVisible = word => {
  wordForSubmit.value = word
  isDialogConfirmVisible.value = true
}

const completeSubmit = () => {
  isDialogSubmitSuccessVisible.value = false
  isDialogConfirmVisible.value = false
  location.reload()
}

const submitFailed = () => {
  isDialogSubmitFailedVisible.value = false

  // รีเฟรชหน้าจอ
  location.reload()
}

const submitConfirm = () => {
  isDialogSubmitSuccessVisible.value = true 
  isDialogSubmitVisible.value = false
  sessionStorage.setItem('currentTableWatchSesstion', 1)

  // รีเฟรชหน้าจอ
  location.reload()
}

const successDialAlert = ref(false)

const textAlertDialogFunction = (word, success) => {
  wordForSubmit.value = word
  successDialAlert.value = success
  isDialogVisibleAlertDialog.value = true

  //console.log("textAlertDialogFunction Start!!")
}

//--------------------------- Status Check --------------------------
const tabDisablingConfig = {
  1: {
    manager: ['Raw Material Inspection Request Form', 'Lorry Loading Check List'],
    issues: ['Raw Material Inspection Request Form', 'Lorry Loading Check List'],
  },
  3: {
    manager: ['Raw Material Inspection Request Form', 'Lorry Loading Check List'],
    issues: ['Raw Material Inspection Request Form', 'Lorry Loading Check List'],
  },
  4: {
    manager: true,
    issues: true,
  },
  5: {
    manager: true,
    issues: true,
  },
  6: {
    manager: true,
    issues: false,
  },
  7: {
    manager: false,
    issues: false,
  },

  // Add more statuses and role combinations as needed
}

const btnVIfSaveDraft = ref(false)
const btnVIfSubmit = ref(false)
const btnVIfBackToEdit = ref(false)
const btnVIfReject = ref(false)
const btnVIfApprove = ref(false)

const getDisabledFollowStatusNRole = () => {
  const status = dataProps.value.statusId
  const role = roleAccount.value
  
  //console.log('Status Raw:', status)
  //console.log('Role Raw:', role)
  //console.log('Disabled Tabs Raw:',  (tabDisablingConfig[status]?.[role] || false))
  
  return tabDisablingConfig[status]?.[role] || false
}
</script>

<template>
  <div class="text-center mt-4">
    <span style="font-size: 22px; font-weight: bolder;">
      Raw Material Inspection Request Form
    </span>
  </div>

  <div
    v-if="loadingGenerated1 && loadingGenerated2"
    class="mt-1"
  >
    <VProgressLinear
      height="20"
      color="success"
      indeterminate 
    >
      <span>Loading</span>
    </VProgressLinear>
  </div>

  <div v-if="false">
    -->{{ analysisItemsCode }}
  </div>

  <div v-if="!loadingGenerated1 && !loadingGenerated2">
    <VRow>
      <VCol cols="2">
        <div
          class="my-4 pa-2 text-center"
          style="max-width: 150px; border: 1px solid black; font-size: 12px; font-weight: bold;"
        >
          CONFIDENTIAL
        </div>
      </VCol>
    </VRow>

    <div style="overflow-x: auto; white-space: nowrap;">
      <table class="custom-table">
        <thead>
          <tr>
            <th colspan="4" />
            <th
              colspan="1"
              class="text-start"
            >
              SKT Name
            </th>
            <td colspan="2">
              {{ headerInsp.sktName }}
            </td>
            <th
              colspan="1"
              class="text-center"
            >
              Raw Mat. Code
            </th>
            <th colspan="2">
              Supplier Name
            </th>
            <td colspan="2">
              <div>{{ headerInsp.supplierName }}</div>
            </td>
          </tr>
          <tr>
            <th colspan="2">
              Received Date 
            </th>
            <td colspan="2">
              {{ formatDate(headerInsp.receivedDate) }}
            </td>
            <th
              colspan="1"
              class="text-start"
            >
              Trade Name
            </th>
            <td colspan="2">
              {{ headerInsp.tradeNames }}
            </td>
            <td
              colspan="1"
              class="text-center"
            >
              {{ headerInsp.itemCode }}
            </td>
            <th colspan="2">
              Manufacturer Name
            </th>
            <td colspan="2">
              {{ headerInsp.ManufacturerName }}
            </td>
          </tr>
          <tr>
            <th colspan="5">
              Certificate Of Analysis From Manufacturer
            </th>
            <td colspan="3">
              <VRow>
                <VCol cols="6">
                  <VCheckbox
                    v-model="checkBoxCOAYes"
                  
                    readonly
                  >
                    <template #label>
                      <span style="font-size: 12px;">Yes</span>
                    </template>
                  </VCheckbox>
                </VCol>
                <VCol cols="6">
                  <VCheckbox
                    v-model="checkBoxCOANo"
                    readonly
                  >
                    <template #label>
                      <span style="font-size: 12px;">No</span>
                    </template>
                  </VCheckbox>
                </VCol>
              </VRow>
            </td>
            <td colspan="4">
              <div class="card-stack-container cursor-pointer">
                <!-- แสดงการ์ดที่ซ้อนกัน -->
                <VCard
                  v-for="(image, index) in limitedImages"
                  :key="index"
                  :elevation="5"
                  class="card"
                  :style="{ zIndex: index, transform: `translate(${index * 30}px, ${index * 0}px)` }"
                  @click="openDialog(index)"
                >
                  <!-- แสดงภาพหรือจำนวนรูปทั้งหมดในการ์ดสุดท้าย -->
                  <template v-if="index < limitedImages.length - 1">
                    <VCardText class="pa-1">
                      <VImg
                        v-if="image.contentType === 'image/jpeg' || image.contentType === 'image/png'"
                        :src="image.fileUri"
                        aspect-ratio="1"
                      />
                      <iframe
                        v-else-if="image.contentType === 'application/pdf'"
                        :src="'https://docs.google.com/viewer?url=' +image.fileUri+'&embedded=true'"
                        width="100%"
                        height="500px"
                        aspect-ratio="1"
                      />
                    </VCardText>
                  </template>
                
                  <template v-else>
                    <VCardText class="bg-primary">
                      <VRow class="d-flex justify-center align-center">
                        <VCol
                          class="pa-0 d-flex justify-center align-center"
                          cols="12"
                        >
                          <VIcon
                            size="35"
                            icon="ri-gallery-line"
                          />
                        </VCol>
                        <VCol
                          class="pa-0 d-flex justify-center align-center"
                          cols="12"
                        >
                          <span>{{ coaFiles.length }}+</span>
                        </VCol>
                      </VRow>
                    </VCardText>
                  </template>
                </VCard>

                <!-- Modal สำหรับแสดงรูปทั้งหมด -->
                <VDialog
                  v-model="showAllImages"
                  width="80%"
                >
                  <VCard>
                    <VCarousel v-model="selectedImageIndex">
                      <VCarouselItem
                        v-for="(file, index) in coaFiles"
                        :key="index"
                      >
                        <div v-if="file.contentType === 'image/jpeg'">
                          <img
                            :src="file.fileUri"
                            alt="Image"
                          >
                        </div>
                        <div v-else-if="file.contentType === 'application/pdf'">
                          <iframe
                            :src="file.fileUri"
                            width="100%"
                            height="500px"
                          />
                        </div>
                      </VCarouselItem>
                    </VCarousel>

                    <VCardActions>
                      <VBtn
                        color="primary"
                        @click="showAllImages = false"
                      >
                        ปิด
                      </VBtn>
                    </VCardActions>
                  </VCard>
                </VDialog>

                <VProgressCircular
                  v-if="isLoading"
                  :size="50"
                  :width="3"
                  color="primary"
                  indeterminate
                  class="progress-circular"
                >
                  <span>Loading.....</span>
                </VProgressCircular>
              </div>
            </td>
          </tr>
        </thead>
      </table>
    </div>

    <!-- Dialog COA -->
    <VDialog
      v-model="isDialogVisibleCOA"
      width="80%"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardTitle class="bg-primary d-flex justify-space-between align-center">
          <span>COA</span>
          <VBtn
            color="white"
            variant="tonal"
            icon="ri-close-fill"
            @click="isDialogVisibleCOA = false"
          />
        </VCardTitle>

        <VCardText class="pa-0">
          <VImg
            v-if="false"
            :src="srcImagCOA"
          />
          <div class="pa-0">
            <div class="d-flex justify-space-around align-center py-1">
              <VBtn
                v-if="false"
                icon="mdi-minus"
                variant="text"
                size="30px"
                @click="model = Math.max(model - 1, 0)"
              />
              {{ selectedImageIndex+1 }}
              <VBtn
                v-if="false"
                icon="mdi-plus"
                size="30px"
                variant="text"
                @click="model = Math.min(model + 1, 4)"
              />
            </div>
            <VCarousel
              v-model="selectedImageIndex"
              show-arrows="hover"
            >
              <VCarouselItem
                v-for="(item, i) in coaFiles"
                :key="i"
                :value="i"
                cover
              >
                <!-- ตรวจสอบประเภทไฟล์ -->
                <template v-if="item.fileUri.endsWith('.pdf')">
                  <iframe
                    :src="'https://docs.google.com/viewer?url=' + item.fileUri + '&embedded=true'"
                    width="100%"
                    height="500px"
                  />
                </template>
    
                <!-- แสดงรูปภาพถ้าไม่ใช่ PDF -->
                <template v-else>
                  <VImg
                    :src="item.fileUri"
                    alt="Image"
                  />
                </template>
              </VCarouselItem>
            </VCarousel>
          </div>
        </VCardText>
      </VCard>
    </VDialog>

    <section v-if="false">
      <VBtn @click="textValue">
        Test
      </VBtn>
    </section>

    <!-- Raw Material Inspection Request Form -->
    <VRow class="mt-4">
      <VCol
        class=""
        cols="12"
      >
        <div style="overflow-x: auto; white-space: nowrap;">
          <table class="custom-table">
            <!-- Sanyo Lot No. -->
            <tr>
              <th
                class="text-center"
                rowspan="3"
                colspan="1"
              >
                No.
              </th>
              <th
                class="text-center"
                rowspan="3"
                colspan="2"
              >
                Analytical Items
              </th>
              <th
                class="text-center"
                rowspan="3"
                colspan="2"
              >
                Unit
              </th>
              <th
                class="text-center"
                rowspan="3"
                colspan="2"
              >
                Analytical  Method No.
              </th>
              <th
                class="text-center"
                rowspan="3"
                colspan="2"
              >
                Specification Ranges
              </th>
              <th
                class="text-center "
                colspan="1"
              >
                Sanyo Lot No.
              </th>
              <td
                colspan="5"
                class="text-center"
              >
                {{ headerInsp.sktId }}
              </td>
            </tr>
            <!-- Maker Lot No. -->
            <tr>
              <th
                class="text-center"
                colspan="1"
              >
                Maker Lot No.
              </th>
              <td
                class="text-center"
                colspan="1"
              >
                <div class="d-flex justify-center align-center">
                  <span>1 : {{ analysisItemsCode.actualMakerLotNo_0 }}</span>
                </div>
              </td>
              <td colspan="1">
                <div class="d-flex justify-center align-center">
                  <span>2 : {{ analysisItemsCode.actualMakerLotNo_1 }}</span>
                </div>
              </td>
              <td colspan="1">
                <div class="d-flex justify-center align-center">
                  <span>3 : {{ analysisItemsCode.actualMakerLotNo_2 }}</span>
                </div>
              </td>
              <td colspan="1">
                <div class="d-flex justify-center align-center">
                  <span>4 : {{ analysisItemsCode.actualMakerLotNo_3 }}</span>
                </div>
              </td>
              <td colspan="1">
                <div class="d-flex justify-center align-center">
                  <span>5 : {{ analysisItemsCode.actualMakerLotNo_4 }}</span>
                </div>
              </td>
            </tr>
            <!-- Net Count.x Amount -->
            <tr>
              <th
                class="text-center"
                colspan="1"
              >
                Net Count.x Amount
              </th>
              <td
                v-for="i = 1 in 5"
                :key="i"
                class="text-center"
                colspan="1"
                style="min-width: 160px; max-width: 160px;"
              >
                <span>{{ covertFloatFixedTwo(analysisItemsCode[`actualNetCountKgs_${i-1}`]) }} X {{ analysisItemsCode[`actualAmountUnits_${i-1}`] }}</span>
              </td>
            </tr>

            <!-- Actual Analysis -->
            <tr>
              <th
                class="text-center"
                colspan="9"
              />
              <th
                class="text-center"
                colspan="1"
              >
                Actual Analysis
              </th>
              <td
             
                class="text-center"
                colspan="1"
                style="min-width: 160px; max-width: 160px;"
              >
                <span><VIcon icon="ri-functions" />: {{ covertFloatFixedTwo(analysisItemsCode.actualTotalQuantityKgs_0) }}</span>
              </td>
              <td
              
                class="text-center"
                colspan="1"
                style="min-width: 160px; max-width: 160px;"
              >
                <span><VIcon icon="ri-functions" />: {{ covertFloatFixedTwo(analysisItemsCode.actualTotalQuantityKgs_1) }}</span>
              </td>
              <td
              
                class="text-center"
                colspan="1"
                style="min-width: 160px; max-width: 160px;"
              >
                <span><VIcon icon="ri-functions" />: {{ covertFloatFixedTwo(analysisItemsCode.actualTotalQuantityKgs_2) }}</span>
              </td>
              <td
             
                class="text-center"
                colspan="1"
                style="min-width: 160px; max-width: 160px;"
              >
                <span><VIcon icon="ri-functions" />: {{ covertFloatFixedTwo(analysisItemsCode.actualTotalQuantityKgs_3) }}</span>
              </td>
              <td 
              
                class="text-center"
                colspan="1"
                style="min-width: 160px; max-width: 160px;"
              >
                <span><VIcon icon="ri-functions" />: {{ covertFloatFixedTwo(analysisItemsCode.actualTotalQuantityKgs_4) }}</span>
              </td>
            </tr>

            <!-- AnalysisItems -->
            <tr
              v-for="(item , index) in analysisItems"
              :key="index"
              class=""
            >
              <td
                v-if="item.typeID === 1"
                :class="{ 'bg-primary': !item.needActualValue, 'bg-primary': item.needActualValue }"
                class="text-center"
                colspan="1"
              >
                <span>{{ item.sqnText }}</span>
              </td>

              <td
                v-if="item.typeID === 1"
                colspan="2"
              >
                <span>{{ item.analyticalItem }}</span>
              </td>
              <td
                v-if="item.typeID === 1"
                class="text-center"
                colspan="2"
              >
                <span>{{ item.unit }}</span>
              </td>
              <td
                v-if="item.typeID === 1"
                class="text-center"
                colspan="2"
              >
                <span>{{ item.methodCode }}</span>
              </td>
              <td
                v-if="item.typeID === 1"
                class="text-center"
                colspan="2"
              >
                <span>{{ item.specRange }}</span>
              </td>
              <td
                v-if="item.typeID === 1"
                class="text-center"
                colspan="1"
              >
                <span>{{ item.actualAnalysis }}</span>
              </td>

              <td
                v-if="item.typeID === 1"
                class="text-center"
                colspan="1"
                style="min-width: 200px; max-width: 200px;"
              >
                <VRadioGroup
                  v-if="!item.needActualValue && item.typeID === 1 && item.itemAnalyticals[0]"
                  v-model="item.itemAnalyticals[0].okState"
                  :readonly="frozeCheck"
                  :mandatory="false"
                  :rules="[
                    v => v !== -1 || 'Actual value is required!',
                  ]"
                >
                  <VRow>
                    <VCol cols="6">
                      <VRadio :value="1">
                        <template #label>
                          <div style="font-size: 12px;">
                            Ok
                          </div>
                        </template>
                      </VRadio>
                    </VCol>
                    <VCol cols="6">
                      <VRadio :value="0">
                        <template #label>
                          <div style="font-size: 12px;">
                            Not
                          </div>
                        </template>
                      </VRadio>
                    </VCol>
                  </VRow>
                </VRadioGroup>

                <span
                  v-if="checkOkState(item, item.typeID, 0)"
                  class="text-red"
                >{{ textAlertErrorOkState }}</span>

                <div v-if="false">
                  <VTextField
                    v-if="item.needActualValue && item.typeID === 1 && item.itemAnalyticals[0]"
                    v-model="item.itemAnalyticals[0].actualAnalysis"
                    :readonly="frozeCheck"
                    :rules="[
                      value => value !== '' || !value || 'Actual value is required!',
                      value => value.length <= 44 || 'Must be 45 characters or less',
                      value => {
                        if (value && value[0] === ' ') {
                          item.itemAnalyticals[0].actualAnalysis = null
                          return `first can't be a space.`
                        }
                        return true
                      }
                    ]"
                    density="compact"
                    :maxlength="45" 
                  >
                    <template
                      v-if="!frozeCheck"
                      #label
                    >
                      <VIcon icon="ri-edit-line" />
                    </template>
                  </VTextField>
                </div>
                
                <div v-if="item.needActualValue && item.typeID === 1 && item.itemAnalyticals[0]">
                  <VBtn
                    width="190"
                    :prepend-icon="!frozeCheck ? 'ri-edit-line' : ''"
                    variant="outlined"
                    dencity="compact"
                    :color="(item.itemAnalyticals[0].actualAnalysis && item.itemAnalyticals[0].actualAnalysis.length <= 44) ? 'primary' : 'red'"
                    @click="toggleDialog(item.itemAnalyticals[0]?.inspReqLotJournalId)"
                  >
                    <span
                      v-if="item.itemAnalyticals[0].actualAnalysis"
                      style="overflow: hidden; max-width: 130px; font-size: 12px; text-overflow: ellipsis;"
                    >{{ item.itemAnalyticals[0].actualAnalysis }}</span>
                    <span
                      v-else
                      style="font-size: 12px;"
                    >Input</span>
                  </VBtn>
                </div>
                
                <VTextarea
                  v-if="isDialogVisibleInput[item.itemAnalyticals[0]?.inspReqLotJournalId]"
                  v-model="item.itemAnalyticals[0].actualAnalysis"
                  class="my-2"
                  rows="2"
                  auto-grow
                  :color="(item.itemAnalyticals[0].actualAnalysis && item.itemAnalyticals[0].actualAnalysis.length <= 44) ? 'primary' : 'red'"
                  placeholder="Placeholder Text"
                  :readonly="frozeCheck"
                  :rules="[
                    value => value !== '' || !value || 'Actual value is required!',
                    value => value.length <= 44 || 'Must be 45 characters or less',
                    value => {
                      if (value && value[0] === ' ') {
                        item.itemAnalyticals[0].actualAnalysis = null
                        return `first can't be a space.`
                      }
                      return true
                    }
                  ]"
                >
                  <template
                    v-if="!frozeCheck"
                    #label
                  >
                    <VIcon icon="ri-edit-line" />
                  </template>
                </VTextarea>

                <span
                  v-if="checkAnalysitItem(item, item.typeID, 0)"
                  class="text-red"
                >{{ textAlertErrorAnalysitItem }}</span>
              </td>

              <td
                v-if="item.typeID === 1"
                class="text-center"
                colspan="1"
                style="min-width: 200px; max-width: 200px;"
              >
                <VRadioGroup
                  v-if="!item.needActualValue && item.typeID === 1 && item.itemAnalyticals[1]"
                  v-model="item.itemAnalyticals[1].okState"
                  :readonly="frozeCheck"
                  :mandatory="false"
                >
                  <VRow>
                    <VCol cols="6">
                      <VRadio :value="1">
                        <template #label>
                          <div style="font-size: 12px;">
                            Ok
                          </div>
                        </template>
                      </VRadio>
                    </VCol>
                    <VCol cols="6">
                      <VRadio :value="0">
                        <template #label>
                          <div style="font-size: 12px;">
                            Not
                          </div>
                        </template>
                      </VRadio>
                    </VCol>
                  </VRow>
                </VRadioGroup>

              
                <span
                  v-if="checkOkState(item, item.typeID, 1)"
                  class="text-red"
                >{{ textAlertErrorOkState }}</span>

                <div v-if="false">
                  <VTextField
                    v-if="item.needActualValue && item.typeID === 1 && item.itemAnalyticals[1]"
                    v-model="item.itemAnalyticals[1].actualAnalysis"
                    :readonly="frozeCheck"
                    density="compact"
                    :rules="[
                      value => value.length <= 44 || 'Must be 45 characters or less',
                      value => {
                        if (value && value[0] === ' ') {
                          item.itemAnalyticals[1].actualAnalysis = null
                          return `first can't be a space.`
                        }
                        return true
                      }
                    ]"
                    :maxlength="45"
                  >
                    <template
                      v-if="!frozeCheck"
                      #label
                    >
                      <VIcon icon="ri-edit-line" />
                    </template>
                  </VTextField>
                </div>
                

                <div v-if="item.needActualValue && item.typeID === 1 && item.itemAnalyticals[1]">
                  <VBtn
                    width="190"
                    :prepend-icon="!frozeCheck ? 'ri-edit-line' : ''"
                    variant="outlined"
                    dencity="compact"
                    :color="(item.itemAnalyticals[1].actualAnalysis && item.itemAnalyticals[1].actualAnalysis.length <= 44) ? 'primary' : 'red'"
                    @click="toggleDialog(item.itemAnalyticals[1]?.inspReqLotJournalId)"
                  >
                    <span
                      v-if="item.itemAnalyticals[1].actualAnalysis"
                      style="overflow: hidden; max-width: 130px; font-size: 12px; text-overflow: ellipsis;"
                    >{{ item.itemAnalyticals[1].actualAnalysis }}</span>
                    <span
                      v-else
                      style="font-size: 12px;"
                    >Input</span>
                  </VBtn>
                </div>
                
                <VTextarea
                  v-if="isDialogVisibleInput[item.itemAnalyticals[1]?.inspReqLotJournalId]"
                  v-model="item.itemAnalyticals[1].actualAnalysis"
                  class="my-2"
                  rows="2"
                  auto-grow
                  :color="(item.itemAnalyticals[1].actualAnalysis && item.itemAnalyticals[1].actualAnalysis.length <= 44) ? 'primary' : 'red'"
                  placeholder="Placeholder Text"
                  :readonly="frozeCheck"
                  :rules="[
                    value => value !== '' || !value || 'Actual value is required!',
                    value => value.length <= 44 || 'Must be 45 characters or less',
                    value => {
                      if (value && value[1] === ' ') {
                        item.itemAnalyticals[1].actualAnalysis = null
                        return `first can't be a space.`
                      }
                      return true
                    }
                  ]"
                >
                  <template
                    v-if="!frozeCheck"
                    #label
                  >
                    <VIcon icon="ri-edit-line" />
                  </template>
                </VTextarea>


                <span
                  v-if="checkAnalysitItem(item, item.typeID, 1)"
                  class="text-red"
                >{{ textAlertErrorAnalysitItem }}</span>
              </td>

              <td
                v-if="item.typeID === 1"
                class="text-center"
                colspan="1"
                style="min-width: 200px; max-width: 200px;"
              >
                <VRadioGroup
                  v-if="!item.needActualValue && item.typeID === 1 && item.itemAnalyticals[2]"
                  v-model="item.itemAnalyticals[2].okState"
                  :readonly="frozeCheck"
                  :mandatory="false"
                >
                  <VRow>
                    <VCol cols="6">
                      <VRadio :value="1">
                        <template #label>
                          <div style="font-size: 12px;">
                            Ok
                          </div>
                        </template>
                      </VRadio>
                    </VCol>
                    <VCol cols="6">
                      <VRadio :value="0">
                        <template #label>
                          <div style="font-size: 12px;">
                            Not
                          </div>
                        </template>
                      </VRadio>
                    </VCol>
                  </VRow>
                </VRadioGroup>

                <span
                  v-if="checkOkState(item, item.typeID, 2)"
                  class="text-red"
                >{{ textAlertErrorOkState }}</span>

                <div v-if="false">
                  <VTextField
                    v-if="item.needActualValue && item.typeID === 1 && item.itemAnalyticals[2]"
                    v-model="item.itemAnalyticals[2].actualAnalysis"
                    :readonly="frozeCheck"
                    density="compact"
                    :rules="[
                      value => value.length <= 44 || 'Must be 45 characters or less',
                      value => {
                        if (value && value[0] === ' ') {
                          item.itemAnalyticals[2].actualAnalysis = null
                          return `first can't be a space.`
                        }
                        return true
                      }
                    ]"
                    :maxlength="45" 
                  >
                    <template
                      v-if="!frozeCheck"
                      #label
                    >
                      <VIcon icon="ri-edit-line" />
                    </template>
                  </VTextField>
                </div>
                
                <div v-if="item.needActualValue && item.typeID === 1 && item.itemAnalyticals[2]">
                  <VBtn
                    width="190"
                    :prepend-icon="!frozeCheck ? 'ri-edit-line' : ''"
                    variant="outlined"
                    dencity="compact"
                    :color="(item.itemAnalyticals[2].actualAnalysis && item.itemAnalyticals[2].actualAnalysis.length <= 44) ? 'primary' : 'red'"
                    @click="toggleDialog(item.itemAnalyticals[2]?.inspReqLotJournalId)"
                  >
                    <span
                      v-if="item.itemAnalyticals[2].actualAnalysis"
                      style="overflow: hidden; max-width: 130px; font-size: 12px; text-overflow: ellipsis;"
                    >{{ item.itemAnalyticals[2].actualAnalysis }}</span>
                    <span
                      v-else
                      style="font-size: 12px;"
                    >Input</span>
                  </VBtn>
                </div>
                
                <VTextarea
                  v-if="isDialogVisibleInput[item.itemAnalyticals[2]?.inspReqLotJournalId]"
                  v-model="item.itemAnalyticals[2].actualAnalysis"
                  class="my-2"
                  rows="2"
                  auto-grow
                  :color="(item.itemAnalyticals[2].actualAnalysis && item.itemAnalyticals[2].actualAnalysis.length <= 44) ? 'primary' : 'red'"
                  placeholder="Placeholder Text"
                  :readonly="frozeCheck"
                  :rules="[
                    value => value !== '' || !value || 'Actual value is required!',
                    value => value.length <= 44 || 'Must be 45 characters or less',
                    value => {
                      if (value && value[2] === ' ') {
                        item.itemAnalyticals[2].actualAnalysis = null
                        return `first can't be a space.`
                      }
                      return true
                    }
                  ]"
                >
                  <template
                    v-if="!frozeCheck"
                    #label
                  >
                    <VIcon icon="ri-edit-line" />
                  </template>
                </VTextarea>

                <span
                  v-if="checkAnalysitItem(item, item.typeID, 2)"
                  class="text-red"
                >{{ textAlertErrorAnalysitItem }}</span>
              </td>

              <td
                v-if="item.typeID === 1"
                class="text-center"
                colspan="1"
                style="min-width: 200px; max-width: 200px;"
              >
                <VRadioGroup
                  v-if="!item.needActualValue && item.typeID === 1 && item.itemAnalyticals[3]"
                  v-model="item.itemAnalyticals[3].okState"
                  :readonly="frozeCheck"
                  :mandatory="false"
                >
                  <VRow>
                    <VCol cols="6">
                      <VRadio :value="1">
                        <template #label>
                          <div style="font-size: 12px;">
                            Ok
                          </div>
                        </template>
                      </VRadio>
                    </VCol>
                    <VCol cols="6">
                      <VRadio :value="0">
                        <template #label>
                          <div style="font-size: 12px;">
                            Not
                          </div>
                        </template>
                      </VRadio>
                    </VCol>
                  </VRow>
                </VRadioGroup>

                <span
                  v-if="checkOkState(item, item.typeID, 3)"
                  class="text-red"
                >Analysis result Ok/Not is required!</span>

                <div v-if="false">
                  <VTextField
                    v-if="item.needActualValue && item.typeID === 1 && item.itemAnalyticals[3]"
                    v-model="item.itemAnalyticals[3].actualAnalysis"
                    :readonly="frozeCheck"
                    density="compact"
                    :rules="[
                      value => value.length <= 44 || 'Must be 45 characters or less',
                      value => {
                        if (value && value[0] === ' ') {
                          item.itemAnalyticals[3].actualAnalysis = null
                          return `first can't be a space.`
                        }
                        return true
                      }
                    ]"
                    :maxlength="45" 
                  >
                    <template
                      v-if="!frozeCheck"
                      #label
                    >
                      <VIcon icon="ri-edit-line" />
                    </template>
                  </VTextField>
                </div>
                
                <div v-if="item.needActualValue && item.typeID === 1 && item.itemAnalyticals[3]">
                  <VBtn
                    width="190"
                    :prepend-icon="!frozeCheck ? 'ri-edit-line' : ''"
                    variant="outlined"
                    dencity="compact"
                    :color="(item.itemAnalyticals[3].actualAnalysis && item.itemAnalyticals[3].actualAnalysis.length <= 44) ? 'primary' : 'red'"
                    @click="toggleDialog(item.itemAnalyticals[3]?.inspReqLotJournalId)"
                  >
                    <span
                      v-if="item.itemAnalyticals[3].actualAnalysis"
                      style="overflow: hidden; max-width: 130px; font-size: 12px; text-overflow: ellipsis;"
                    >{{ item.itemAnalyticals[3].actualAnalysis }}</span>
                    <span
                      v-else
                      style="font-size: 12px;"
                    >Input</span>
                  </VBtn>
                </div>
                
                <VTextarea
                  v-if="isDialogVisibleInput[item.itemAnalyticals[3]?.inspReqLotJournalId]"
                  v-model="item.itemAnalyticals[3].actualAnalysis"
                  class="my-2"
                  rows="2"
                  auto-grow
                  :color="(item.itemAnalyticals[3].actualAnalysis && item.itemAnalyticals[3].actualAnalysis.length <= 44) ? 'primary' : 'red'"
                  placeholder="Placeholder Text"
                  :readonly="frozeCheck"
                  :rules="[
                    value => value !== '' || !value || 'Actual value is required!',
                    value => value.length <= 44 || 'Must be 45 characters or less',
                    value => {
                      if (value && value[3] === ' ') {
                        item.itemAnalyticals[3].actualAnalysis = null
                        return `first can't be a space.`
                      }
                      return true
                    }
                  ]"
                >
                  <template
                    v-if="!frozeCheck"
                    #label
                  >
                    <VIcon icon="ri-edit-line" />
                  </template>
                </VTextarea>

                <span
                  v-if="checkAnalysitItem(item, item.typeID, 3)"
                  class="text-red"
                >{{ textAlertErrorAnalysitItem }}</span>
              </td>

              <td
                v-if="item.typeID === 1"
                class="text-center"
                colspan="1"
                style="min-width: 200px; max-width: 200px;"
              >
                <VRadioGroup
                  v-if="!item.needActualValue && item.typeID === 1 && item.itemAnalyticals[4]"
                  v-model="item.itemAnalyticals[4].okState"
                  :readonly="frozeCheck"
                  :mandatory="false"
                >
                  <VRow>
                    <VCol cols="6">
                      <VRadio :value="1">
                        <template #label>
                          <div style="font-size: 12px;">
                            Ok
                          </div>
                        </template>
                      </VRadio>
                    </VCol>
                    <VCol cols="6">
                      <VRadio :value="0">
                        <template #label>
                          <div style="font-size: 12px;">
                            Not
                          </div>
                        </template>
                      </VRadio>
                    </VCol>
                  </VRow>
                </VRadioGroup>

                <span
                  v-if="checkOkState(item, item.typeID, 4)"
                  class="text-red"
                >Analysis result Ok/Not is required!</span>

                <div v-if="false">
                  <VTextField
                    v-if="item.needActualValue && item.typeID === 1 && item.itemAnalyticals[4]"
                    v-model="item.itemAnalyticals[4].actualAnalysis"
                    :readonly="frozeCheck"
                    density="compact"
                    :rules="[
                      value => value.length <= 44 || 'Must be 45 characters or less',
                      value => {
                        if (value && value[0] === ' ') {
                          item.itemAnalyticals[4].actualAnalysis = null
                          return `first can't be a space.`
                        }
                        return true
                      }
                    ]"
                    :maxlength="45" 
                  >
                    <template
                      v-if="!frozeCheck"
                      #label
                    >
                      <VIcon icon="ri-edit-line" />
                    </template>
                  </VTextField>
                </div>
                
                <div v-if="item.needActualValue && item.typeID === 1 && item.itemAnalyticals[4]">
                  <VBtn
                    width="190"
                    :prepend-icon="!frozeCheck ? 'ri-edit-line' : ''"
                    variant="outlined"
                    dencity="compact"
                    :color="(item.itemAnalyticals[4].actualAnalysis && item.itemAnalyticals[4].actualAnalysis.length <= 44) ? 'primary' : 'red'"
                    @click="toggleDialog(item.itemAnalyticals[4]?.inspReqLotJournalId)"
                  >
                    <span
                      v-if="item.itemAnalyticals[4].actualAnalysis"
                      style="overflow: hidden; max-width: 130px; font-size: 12px; text-overflow: ellipsis;"
                    >{{ item.itemAnalyticals[4].actualAnalysis }}</span>
                    <span
                      v-else
                      style="font-size: 12px;"
                    >Input</span>
                  </VBtn>
                </div>
                
                <VTextarea
                  v-if="isDialogVisibleInput[item.itemAnalyticals[4]?.inspReqLotJournalId]"
                  v-model="item.itemAnalyticals[4].actualAnalysis"
                  class="my-2"
                  rows="2"
                  auto-grow
                  :color="(item.itemAnalyticals[4].actualAnalysis && item.itemAnalyticals[4].actualAnalysis.length <= 44) ? 'primary' : 'red'"
                  placeholder="Placeholder Text"
                  :readonly="frozeCheck"
                  :rules="[
                    value => value !== '' || !value || 'Actual value is required!',
                    value => value.length <= 44 || 'Must be 45 characters or less',
                    value => {
                      if (value && value[4] === ' ') {
                        item.itemAnalyticals[4].actualAnalysis = null
                        return `first can't be a space.`
                      }
                      return true
                    }
                  ]"
                >
                  <template
                    v-if="!frozeCheck"
                    #label
                  >
                    <VIcon icon="ri-edit-line" />
                  </template>
                </VTextarea>

                <span
                  v-if="checkAnalysitItem(item, item.typeID, 4)"
                  class="text-red"
                >{{ textAlertErrorAnalysitItem }}</span>
              </td>
            </tr>
          
            <!-- Reference -->
            <tr class="">
              <td
                class="text-center"
                colspan="1"
              />
              <th
                class="text-start text-decoration-underline"
                colspan="14"
              >
                Reference
              </th>
            </tr>

            <tr
              v-for="(item , index) in analysisItems"
              :key="index"
            >
              <td
                v-if="item.typeID === 2"
                :class="{ 'bg-primary': !item.needActualValue, 'bg-primary': item.needActualValue }"
                class="text-center"
                colspan="1"
              >
                <span>{{ item.sqnText }}</span>
              </td>
            
              <td
                v-if="item.typeID === 2"
                colspan="2"
                style="text-transform: capitalize;"
              >
                <span>{{ item.analyticalItem }}</span>
              </td>
              <td
                v-if="item.typeID === 2"
                class="text-center"
                colspan="2"
                style="text-transform: capitalize;"
              >
                <span>{{ item.unit }}</span>
              </td>
              <td
                v-if="item.typeID === 2"
                class="text-center"
                colspan="2"
                style="text-transform: capitalize;"
              >
                <span>{{ item.methodCode }}</span>
              </td>
              <td
                v-if="item.typeID === 2"
                class="text-center"
                colspan="2"
                style="text-transform: capitalize;"
              >
                <span>{{ item.specRange }}</span>
              </td>
              <td
                v-if="item.typeID === 2"
                class="text-center"
                colspan="1"
                style="text-transform: capitalize;"
              >
                <span>{{ item.actualAnalysis }}</span>
              </td>

              <td
                v-if="item.typeID === 2"
                class="text-center"
                colspan="1"
              >
                <VRadioGroup
                  v-if="!item.needActualValue && item.typeID === 2 && item.itemAnalyticals[0]"
                  v-model="item.itemAnalyticals[0].okState"
                  :mandatory="false"
                  :readonly="frozeCheck"
                >
                  <VRow>
                    <VCol cols="6">
                      <VRadio :value="1">
                        <template #label>
                          <div style="font-size: 12px;">
                            Ok
                          </div>
                        </template>
                      </VRadio>
                    </VCol>
                    <VCol cols="6">
                      <VRadio :value="0">
                        <template #label>
                          <div style="font-size: 12px;">
                            Not
                          </div>
                        </template>
                      </VRadio>
                    </VCol>
                  </VRow>
                </VRadioGroup>

                <span
                  v-if="checkOkState(item, item.typeID, 0)"
                  class="text-red"
                >{{ textAlertErrorOkState }}</span>

                <div v-if="false">
                  <VTextField
                    v-if="item.needActualValue && item.typeID === 2 && item.itemAnalyticals[0]"
                    v-model="item.itemAnalyticals[0].actualAnalysis"
                    density="compact"
                    :readonly="frozeCheck"
                    :rules="[
                      value => value.length <= 44 || 'Must be 45 characters or less',
                      value => {
                        if (value && value[0] === ' ') {
                          item.itemAnalyticals[0].actualAnalysis = null
                          return `first can't be a space.`
                        }
                        return true
                      }
                    ]"
                    :maxlength="45" 
                  >
                    <template
                      v-if="!frozeCheck"
                      #label
                    >
                      <VIcon icon="ri-edit-line" />
                    </template>
                  </VTextField>
                </div>
                

                <div v-if="item.needActualValue && item.typeID === 2 && item.itemAnalyticals[0]">
                  <VBtn
                    width="190"
                    :prepend-icon="!frozeCheck ? 'ri-edit-line' : ''"
                    variant="outlined"
                    dencity="compact"
                    :color="(item.itemAnalyticals[0].actualAnalysis && item.itemAnalyticals[0].actualAnalysis.length <= 44) ? 'primary' : 'red'"
                    @click="toggleDialog(item.itemAnalyticals[0]?.inspReqLotJournalId)"
                  >
                    <span
                      v-if="item.itemAnalyticals[0].actualAnalysis"
                      style="overflow: hidden; max-width: 130px; font-size: 12px; text-overflow: ellipsis;"
                    >{{ item.itemAnalyticals[0].actualAnalysis }}</span>
                    <span
                      v-else
                      style="font-size: 12px;"
                    >Input</span>
                  </VBtn>
                </div>
                
                <VTextarea
                  v-if="isDialogVisibleInput[item.itemAnalyticals[0]?.inspReqLotJournalId]"
                  v-model="item.itemAnalyticals[0].actualAnalysis"
                  class="my-2"
                  rows="2"
                  auto-grow
                  :color="(item.itemAnalyticals[0].actualAnalysis && item.itemAnalyticals[0].actualAnalysis.length <= 44) ? 'primary' : 'red'"
                  placeholder="Placeholder Text"
                  :readonly="frozeCheck"
                  :rules="[
                    value => value !== '' || !value || 'Actual value is required!',
                    value => value.length <= 44 || 'Must be 45 characters or less',
                    value => {
                      if (value && value[0] === ' ') {
                        item.itemAnalyticals[0].actualAnalysis = null
                        return `first can't be a space.`
                      }
                      return true
                    }
                  ]"
                >
                  <template
                    v-if="!frozeCheck"
                    #label
                  >
                    <VIcon icon="ri-edit-line" />
                  </template>
                </VTextarea>
                

                <span
                  v-if="checkAnalysitItem(item, item.typeID, 0)"
                  class="text-red"
                >{{ textAlertErrorAnalysitItem }}</span>
              </td>


              <td
                v-if="item.typeID === 2"
                class="text-center"
                colspan="1"
              >
                <VRadioGroup
                  v-if="!item.needActualValue && item.typeID === 2 && item.itemAnalyticals[1]"
                  v-model="item.itemAnalyticals[1].okState"
                  :readonly="frozeCheck"
                  :mandatory="false"
                >
                  <VRow>
                    <VCol cols="6">
                      <VRadio :value="1">
                        <template #label>
                          <div style="font-size: 12px;">
                            Ok
                          </div>
                        </template>
                      </VRadio>
                    </VCol>
                    <VCol cols="6">
                      <VRadio :value="0">
                        <template #label>
                          <div style="font-size: 12px;">
                            Not
                          </div>
                        </template>
                      </VRadio>
                    </VCol>
                  </VRow>
                </VRadioGroup>

                <span
                  v-if="checkOkState(item, item.typeID, 1)"
                  class="text-red"
                >{{ textAlertErrorOkState }}</span>

                <div v-if="false">
                  <VTextField
                    v-if="item.needActualValue && item.typeID === 2 && item.itemAnalyticals[1]"
                    v-model="item.itemAnalyticals[1].actualAnalysis"
                    :readonly="frozeCheck"
                    density="compact"
                    :rules="[
                      value => value.length <= 44 || 'Must be 45 characters or less',
                      value => {
                        if (value && value[0] === ' ') {
                          item.itemAnalyticals[1].actualAnalysis = null
                          return `first can't be a space.`
                        }
                        return true
                      }
                    ]"
                    :maxlength="45" 
                  >
                    <template
                      v-if="!frozeCheck"
                      #label
                    >
                      <VIcon icon="ri-edit-line" />
                    </template>
                  </VTextField>
                </div>
                
                <div v-if="item.needActualValue && item.typeID === 2 && item.itemAnalyticals[1]">
                  <VBtn
                    width="190"
                    :prepend-icon="!frozeCheck ? 'ri-edit-line' : ''"
                    variant="outlined"
                    dencity="compact"
                    :color="(item.itemAnalyticals[1].actualAnalysis && item.itemAnalyticals[1].actualAnalysis.length <= 44) ? 'primary' : 'red'"
                    @click="toggleDialog(item.itemAnalyticals[1]?.inspReqLotJournalId)"
                  >
                    <span
                      v-if="item.itemAnalyticals[1].actualAnalysis"
                      style="overflow: hidden; max-width: 130px; font-size: 12px; text-overflow: ellipsis;"
                    >{{ item.itemAnalyticals[1].actualAnalysis }}</span>
                    <span
                      v-else
                      style="font-size: 12px;"
                    >Input</span>
                  </VBtn>
                </div>
                
                <VTextarea
                  v-if="isDialogVisibleInput[item.itemAnalyticals[1]?.inspReqLotJournalId]"
                  v-model="item.itemAnalyticals[1].actualAnalysis"
                  class="my-2"
                  rows="2"
                  auto-grow
                  :color="(item.itemAnalyticals[1].actualAnalysis && item.itemAnalyticals[1].actualAnalysis.length <= 44) ? 'primary' : 'red'"
                  placeholder="Placeholder Text"
                  :readonly="frozeCheck"
                  :rules="[
                    value => value !== '' || !value || 'Actual value is required!',
                    value => value.length <= 44 || 'Must be 45 characters or less',
                    value => {
                      if (value && value[1] === ' ') {
                        item.itemAnalyticals[1].actualAnalysis = null
                        return `first can't be a space.`
                      }
                      return true
                    }
                  ]"
                >
                  <template
                    v-if="!frozeCheck"
                    #label
                  >
                    <VIcon icon="ri-edit-line" />
                  </template>
                </VTextarea>

                <span
                  v-if="checkAnalysitItem(item, item.typeID, 1)"
                  class="text-red"
                >{{ textAlertErrorAnalysitItem }}</span>
              </td>

              <td
                v-if="item.typeID === 2"
                class="text-center"
                colspan="1"
              >
                <VRadioGroup
                  v-if="!item.needActualValue && item.typeID === 2 && item.itemAnalyticals[2]"
                  v-model="item.itemAnalyticals[2].okState"
                  :readonly="frozeCheck"
                  :mandatory="false"
                >
                  <VRow>
                    <VCol cols="6">
                      <VRadio :value="1">
                        <template #label>
                          <div style="font-size: 12px;">
                            Ok
                          </div>
                        </template>
                      </VRadio>
                    </VCol>
                    <VCol cols="6">
                      <VRadio :value="0">
                        <template #label>
                          <div style="font-size: 12px;">
                            Not
                          </div>
                        </template>
                      </VRadio>
                    </VCol>
                  </VRow>
                </VRadioGroup>

                <span
                  v-if="checkOkState(item, item.typeID, 2)"
                  class="text-red"
                >{{ textAlertErrorOkState }}</span>

                <div v-if="false">
                  <VTextField
                    v-if="item.needActualValue && item.typeID === 2 && item.itemAnalyticals[2]"
                    v-model="item.itemAnalyticals[2].actualAnalysis"
                    :readonly="frozeCheck"
                    density="compact"
                    :rules="[
                      value => value.length <= 44 || 'Must be 45 characters or less',
                      value => {
                        if (value && value[0] === ' ') {
                          item.itemAnalyticals[2].actualAnalysis = null
                          return `first can't be a space.`
                        }
                        return true
                      }
                    ]"
                    :maxlength="45" 
                  >
                    <template
                      v-if="!frozeCheck"
                      #label
                    >
                      <VIcon icon="ri-edit-line" />
                    </template>
                  </VTextField>
                </div>
                
                <div v-if="item.needActualValue && item.typeID === 2 && item.itemAnalyticals[2]">
                  <VBtn
                    width="190"
                    :prepend-icon="!frozeCheck ? 'ri-edit-line' : ''"
                    variant="outlined"
                    dencity="compact"
                    :color="(item.itemAnalyticals[2].actualAnalysis && item.itemAnalyticals[2].actualAnalysis.length <= 44) ? 'primary' : 'red'"
                    @click="toggleDialog(item.itemAnalyticals[2]?.inspReqLotJournalId)"
                  >
                    <span
                      v-if="item.itemAnalyticals[2].actualAnalysis"
                      style="overflow: hidden; max-width: 130px; font-size: 12px; text-overflow: ellipsis;"
                    >{{ item.itemAnalyticals[2].actualAnalysis }}</span>
                    <span
                      v-else
                      style="font-size: 12px;"
                    >Input</span>
                  </VBtn>
                </div>
                
                <VTextarea
                  v-if="isDialogVisibleInput[item.itemAnalyticals[2]?.inspReqLotJournalId]"
                  v-model="item.itemAnalyticals[2].actualAnalysis"
                  class="my-2"
                  rows="2"
                  auto-grow
                  :color="(item.itemAnalyticals[2].actualAnalysis && item.itemAnalyticals[2].actualAnalysis.length <= 44) ? 'primary' : 'red'"
                  placeholder="Placeholder Text"
                  :readonly="frozeCheck"
                  :rules="[
                    value => value !== '' || !value || 'Actual value is required!',
                    value => value.length <= 44 || 'Must be 45 characters or less',
                    value => {
                      if (value && value[2] === ' ') {
                        item.itemAnalyticals[2].actualAnalysis = null
                        return `first can't be a space.`
                      }
                      return true
                    }
                  ]"
                >
                  <template
                    v-if="!frozeCheck"
                    #label
                  >
                    <VIcon icon="ri-edit-line" />
                  </template>
                </VTextarea>


                <span
                  v-if="checkAnalysitItem(item, item.typeID, 2)"
                  class="text-red"
                >{{ textAlertErrorAnalysitItem }}</span>
              </td>
              <td
                v-if="item.typeID === 2"
                class="text-center"
                colspan="1"
              >
                <VRadioGroup
                  v-if="!item.needActualValue && item.typeID === 2 && item.itemAnalyticals[3]"
                  v-model="item.itemAnalyticals[3].okState"
                  :readonly="frozeCheck"
                  :mandatory="false"
                >
                  <VRow>
                    <VCol cols="6">
                      <VRadio :value="1">
                        <template #label>
                          <div style="font-size: 12px;">
                            Ok
                          </div>
                        </template>
                      </VRadio>
                    </VCol>
                    <VCol cols="6">
                      <VRadio :value="0">
                        <template #label>
                          <div style="font-size: 12px;">
                            Not
                          </div>
                        </template>
                      </VRadio>
                    </VCol>
                  </VRow>
                </VRadioGroup>

                <span
                  v-if="checkOkState(item, item.typeID, 3)"
                  class="text-red"
                >{{ textAlertErrorOkState }}</span>

                <div v-if="false">
                  <VTextField
                    v-if="item.needActualValue && item.typeID === 2 && item.itemAnalyticals[3]"
                    v-model="item.itemAnalyticals[3].actualAnalysis"
                    :readonly="frozeCheck"
                    density="compact"
                    :rules="[
                      value => value.length <= 44 || 'Must be 45 characters or less',
                      value => {
                        if (value && value[0] === ' ') {
                          item.itemAnalyticals[3].actualAnalysis = null
                          return `first can't be a space.`
                        }
                        return true
                      }
                    ]"
                    :maxlength="45" 
                  >
                    <template
                      v-if="!frozeCheck"
                      #label
                    >
                      <VIcon icon="ri-edit-line" />
                    </template>
                  </VTextField>
                </div>
                
                <div v-if="item.needActualValue && item.typeID === 2 && item.itemAnalyticals[3]">
                  <VBtn
                    width="190"
                    :prepend-icon="!frozeCheck ? 'ri-edit-line' : ''"
                    variant="outlined"
                    dencity="compact"
                    :color="(item.itemAnalyticals[3].actualAnalysis && item.itemAnalyticals[3].actualAnalysis.length <= 44) ? 'primary' : 'red'"
                    @click="toggleDialog(item.itemAnalyticals[3]?.inspReqLotJournalId)"
                  >
                    <span
                      v-if="item.itemAnalyticals[3].actualAnalysis"
                      style="overflow: hidden; max-width: 130px; font-size: 12px; text-overflow: ellipsis;"
                    >{{ item.itemAnalyticals[3].actualAnalysis }}</span>
                    <span
                      v-else
                      style="font-size: 12px;"
                    >Input</span>
                  </VBtn>
                </div>
                
                <VTextarea
                  v-if="isDialogVisibleInput[item.itemAnalyticals[3]?.inspReqLotJournalId]"
                  v-model="item.itemAnalyticals[3].actualAnalysis"
                  class="my-2"
                  rows="2"
                  auto-grow
                  :color="(item.itemAnalyticals[3].actualAnalysis && item.itemAnalyticals[3].actualAnalysis.length <= 44) ? 'primary' : 'red'"
                  placeholder="Placeholder Text"
                  :readonly="frozeCheck"
                  :rules="[
                    value => value !== '' || !value || 'Actual value is required!',
                    value => value.length <= 44 || 'Must be 45 characters or less',
                    value => {
                      if (value && value[3] === ' ') {
                        item.itemAnalyticals[3].actualAnalysis = null
                        return `first can't be a space.`
                      }
                      return true
                    }
                  ]"
                >
                  <template
                    v-if="!frozeCheck"
                    #label
                  >
                    <VIcon icon="ri-edit-line" />
                  </template>
                </VTextarea>

                <span
                  v-if="checkAnalysitItem(item, item.typeID, 3)"
                  class="text-red"
                >{{ textAlertErrorAnalysitItem }}</span>
              </td>
              <td
                v-if="item.typeID === 2"
                class="text-center"
                colspan="1"
              >
                <VRadioGroup
                  v-if="!item.needActualValue && item.typeID === 2 && item.itemAnalyticals[4]"
                  v-model="item.itemAnalyticals[4].okState"
                  :readonly="frozeCheck"
                  :mandatory="false"
                >
                  <VRow>
                    <VCol cols="6">
                      <VRadio :value="1">
                        <template #label>
                          <div style="font-size: 12px;">
                            Ok
                          </div>
                        </template>
                      </VRadio>
                    </VCol>
                    <VCol cols="6">
                      <VRadio :value="0">
                        <template #label>
                          <div style="font-size: 12px;">
                            Not
                          </div>
                        </template>
                      </VRadio>
                    </VCol>
                  </VRow>
                </VRadioGroup>

                <span
                  v-if="checkOkState(item, item.typeID, 4)"
                  class="text-red"
                >{{ textAlertErrorOkState }}</span>

                <div v-if="false">
                  <VTextField
                    v-if="item.needActualValue && item.typeID === 2 && item.itemAnalyticals[4]"
                    v-model="item.itemAnalyticals[4].actualAnalysis"
                    :readonly="frozeCheck"
                    density="compact"
                    :rules="[
                      value => value.length <= 44 || 'Must be 45 characters or less',
                      value => {
                        if (value && value[0] === ' ') {
                          item.itemAnalyticals[4].actualAnalysis = null
                          return `first can't be a space.`
                        }
                        return true
                      }
                    ]"
                    :maxlength="45" 
                  >
                    <template
                      v-if="!frozeCheck"
                      #label
                    >
                      <VIcon icon="ri-edit-line" />
                    </template>
                  </VTextField>
                </div>
                

                <div v-if="item.needActualValue && item.typeID === 2 && item.itemAnalyticals[4]">
                  <VBtn
                    width="190"
                    :prepend-icon="!frozeCheck ? 'ri-edit-line' : ''"
                    variant="outlined"
                    dencity="compact"
                    :color="(item.itemAnalyticals[4].actualAnalysis && item.itemAnalyticals[4].actualAnalysis.length <= 44) ? 'primary' : 'red'"
                    @click="toggleDialog(item.itemAnalyticals[4]?.inspReqLotJournalId)"
                  >
                    <span
                      v-if="item.itemAnalyticals[4].actualAnalysis"
                      style="overflow: hidden; max-width: 130px; font-size: 12px; text-overflow: ellipsis;"
                    >{{ item.itemAnalyticals[4].actualAnalysis }}</span>
                    <span
                      v-else
                      style="font-size: 12px;"
                    >Input</span>
                  </VBtn>
                </div>
                
                <VTextarea
                  v-if="isDialogVisibleInput[item.itemAnalyticals[4]?.inspReqLotJournalId]"
                  v-model="item.itemAnalyticals[4].actualAnalysis"
                  class="my-2"
                  rows="2"
                  auto-grow
                  :color="(item.itemAnalyticals[4].actualAnalysis && item.itemAnalyticals[4].actualAnalysis.length <= 44) ? 'primary' : 'red'"
                  placeholder="Placeholder Text"
                  :readonly="frozeCheck"
                  :rules="[
                    value => value !== '' || !value || 'Actual value is required!',
                    value => value.length <= 44 || 'Must be 45 characters or less',
                    value => {
                      if (value && value[4] === ' ') {
                        item.itemAnalyticals[4].actualAnalysis = null
                        return `first can't be a space.`
                      }
                      return true
                    }
                  ]"
                >
                  <template
                    v-if="!frozeCheck"
                    #label
                  >
                    <VIcon icon="ri-edit-line" />
                  </template>
                </VTextarea>


                <span
                  v-if="checkAnalysitItem(item, item.typeID, 4)"
                  class="text-red"
                >{{ textAlertErrorAnalysitItem }}</span>
              </td>
            </tr>

            <!-- Reference Item -->
            <tr>
              <td
                class="text-center"
                colspan="1"
              />
              <td
                class="text-start"
                colspan="14"
              >
                <div class="d-flex align-center">
                  <VIcon
                    color="primary"
                    icon="ri-circle-fill"
                  /> = After arrival of raw material, we have to actually analyze every lot.
                </div>
              </td>
            </tr>
          </table>
        </div>
      </VCol>
    </VRow>

    <!-- Note / Details -->
    <section>
      <VRow
        style="font-size: 12px;"
        class="mb-1"
      >
        <VCol cols="12 ">
          <span
            class=""
            style="font-size: 12px;"
          >Remark: {{ headerInsp.remark }}</span>
        </VCol>
        <VCol cols="6 ">
          Note
        </VCol>
        <VCol
          cols="6 "
          class="px-0"
        >
          Details of Limitation Condition
        </VCol>
        <VCol
          cols="12"
          class="py-0"
        >
          <table class="custom-table">
            <tbody>
              <tr>
                <td colspan="6">
                  <VTextarea
                    v-model="headerInsp.note"
                    :readonly="frozeCheckNotDetialCheck"
                    counter
                    auto-grow
                    :rules="[
                      v => v.length <= 520 || 'Max 130 characters per line, 4 lines max.',
                    ]" 
                    @input="limitTextInputLine4Note" 
                  >
                    <template
                      v-if="!frozeCheckNotDetialCheck"
                      #label
                    >
                      <VIcon icon="ri-edit-line" />
                    </template>
                  </VTextarea>
                </td>
                <td colspan="6">
                  <VTextarea
                    v-model="headerInsp.details"
                    :readonly="frozeCheckNotDetialCheck"
                    counter
                    auto-grow
                    :rules="[
                      v => v.length <= 520 || 'Max 130 characters per line, 4 lines max.',
                    ]" 
                    @input="limitTextInputLine4Details"
                  >
                    <template
                      v-if="!frozeCheckNotDetialCheck"
                      #label
                    >
                      <VIcon icon="ri-edit-line" />
                    </template>
                  </VTextarea>
                </td>
              </tr>
            </tbody>
          </table>
        </VCol>
      </VRow>
    </section>

    <!-- Quality Evaluation -->
    <section class="mt-3 px-3">
      <VRow>
        <VCol
          class="px-0"
          style="font-size: 12px;"
          cols="12"
        >
          Quality Evaluation
        </VCol>
        <!-- Accept Section -->
        <VCol
          cols="1"
          class="d-flex align-center py-0 justify-center"
          style="border-top: 1px solid black; border-bottom: 1px solid black; border-left: 1px solid black;"
        >
          <span style="font-size: 12px; font-weight: bolder;">Accept</span>
        </VCol>

        <VCol
          cols="3"
          class="d-flex align-center justify-center py-0"
          style="border-top: 1px solid black; border-bottom: 1px solid black; border-left: 1px solid black;"
        >
          <VIcon
            v-if="isAccept"
            color="success"
            size="60"
            icon="ri-checkbox-circle-fill"
          />
        </VCol>

        <!-- Reject Section -->
        <VCol
          cols="1"
          class="d-flex align-center justify-center py-0"
          style="border-top: 1px solid black; border-bottom: 1px solid black; border-left: 1px solid black;"
        >
          <span style="font-size: 12px; font-weight: bolder;">Reject</span>
        </VCol>

        <VCol
          cols="3"
          class="d-flex align-center justify-center py-0"
          style="border: 1px solid black;"
        >
          <VIcon
            v-if="isReject"
            color="red"
            size="60"
            icon="ri-close-circle-fill"
          />
        </VCol>

        <!-- Comment Section -->
        <VCol
          cols="4"
          class="d-flex align-center py-2"
          style="border-top: 1px solid black; border-right: 1px solid black; border-bottom: 1px solid black;"
        >
          <div style="width: 100%; text-align: start;">
            <span
              style="font-size: 12px; font-weight: bolder;"
              class="text-center"
            >Comment:</span>
            <VTextarea
              v-if="statusId === 7 || statusId === 16 || statusId === 12 || statusId === 13 || statusId === 14"
              v-model="headerInsp.remarkReject"
              rows="2"
              readonly
              style="white-space: normal; word-wrap: break-word;"
            />
          </div>
        </VCol>
      </VRow>
    </section>
  
    <!-- WareHouse / Inspection -->
    <section class="my-4">
      <VRow>
        <VCol
          cols="12"
          lg="12"
        >
          <table class="custom-table">
            <tr>
              <th
                class="text-center cursor-pointer"
                colspan="6"
              >
                Warehouse
              </th>
              <th
                class="text-center cursor-pointer"
                colspan="6"
              >
                Inspection
              </th>
            </tr>
            <tr>
              <td colspan="3">
                <span>Staff: {{ headerInsp.updateByStaffWH }}</span>
              </td>
              <td colspan="3">
                <span>Supervisor: {{ headerInsp.updateBySuperWH }}</span>
              </td>
              <td colspan="3">
                <span>Staff: {{ headerInsp.updateByStaffInsp }}</span>
              </td>
              <td colspan="3">
                <span>Supervisor: {{ headerInsp.updateBySuperInsp }}</span>
              </td>
            </tr>
            <tr>
              <td
                style="min-width: 150px;"
                colspan="3"
              >
                <div v-if="headerInsp.lastUpdatedStaffWH">
                  <span>{{ formatDate(headerInsp.lastUpdatedStaffWH) }}</span>
                </div>
              </td>
              <td
                style="min-width: 150px;"
                colspan="3"
              >
                <div v-if="headerInsp.lastUpdatedSuperWH">
                  <span>{{ formatDate(headerInsp.lastUpdatedSuperWH) }}</span>
                </div>
              </td>
              <td
                style="min-width: 150px;"
                colspan="3"
              >
                <div v-if="headerInsp.lastUpdatedStaffInsp">
                  <span>{{ formatDate(headerInsp.lastUpdatedStaffInsp) }}</span>
                </div>
              </td>
              <td
                style="min-width: 150px;"
                colspan="3"
              >
                <div v-if="headerInsp.lastUpdatedSuperInsp">
                  <span>{{ formatDate(headerInsp.lastUpdatedSuperInsp) }}</span>
                </div>
              </td>
            </tr>
          </table>
        </VCol>
      </VRow>
    </section>

    <!-- BTN -->
    <section
      v-if="statusId === 4 || statusId === 5"
      cols="12"
      class="my-4"
    >
      <div class="d-flex justify-end">
        <VBtn
          v-if="canVisibleUserPermission(statusPermission,'BTN_SEND_BACK').canVisible"
          class=""
          color="purple-accent-4"
          style="font-size: 12px;"
          @click="sendBackButtonVisible('SEND BACK')"
        >
          Send Back
        </VBtn>
        <VBtn
          v-if="!frozeCheck"
          class="mx-4"
          color="warning"
          style="font-size: 12px;"
          @click="saveDraftButton('SAVE DRAFT')"
        >
          SAVE DRAFT
        </VBtn>
        <VBtn
          v-if="canVisibleUserPermission(statusPermission,'BTN_SUBMIT').canVisible"
          color="green"
          style="font-size: 12px;"
          @click="submitButtonVisible('SUBMIT')"
        >
          SUBMIT
        </VBtn>
      </div>
    </section>

    <section
      v-if="statusId === 12 || statusId === 14"
      cols="12"
      class="my-4"
    >
      <div class="d-flex justify-end">
        <VBtn
          v-if="!frozeCheck"
          class="mx-4"
          color="warning"
          style="font-size: 12px;"
          @click="saveDraftButton('SAVE DRAFT')"
        >
          SAVE DRAFT
        </VBtn>
      </div>
    </section>

    <!-- Btn Approve , Reject, Back to edit -->
    <section
      v-if="statusId !== null && statusId === 6"
      class="mt-6"
    >
      <div
        style="font-size: 12px;"
        class="d-flex justify-end px-0"
      >
        <VBtn
          v-if="canVisibleUserPermission(statusPermission,'BTN_INSP_APVL_SEND_BACK').canVisible"
          class="mx-2"
          color="purple-accent-4"
          style="font-size: 12px;"
          @click="sendBackButtonVisible('SEND BACK')"
        >
          Send Back
        </VBtn>
        <VBtn
          v-if="canVisibleUserPermission(statusPermission,'BTN_PARTIAL_RCVD').canVisible && receiveTypeIdData !== 3"
          class="mx-2"
          color="warning"
          style="font-size: 12px;"
          @click="areaTextRemarkButton('Partial RCVD')"
        >
          Partial RCVD
        </VBtn>
        
        <VBtn
          v-if="canVisibleUserPermission(statusPermission,'BTN_INSP_APVL_REJECT').canVisible"
          class="mx-2"
          color="error"
          style="font-size: 12px;"
          @click="areaTextRemarkButton('REJECT')"
        >
          Reject
        </VBtn>
        <VBtn
          v-if="canVisibleUserPermission(statusPermission,'BTN_INSP_APVL_ACCEPT\r\n').canVisible"
          class="mx-2"
          color="green"
          style="font-size: 12px;"
          @click="approvetButtonVisible('ACCEPT')"
        >
          Accept
        </VBtn>
      </div>
    </section>

    <section
      v-if="responseGener && responseGener.statusId === '7' && roleAccount === 'admin'"
      cols="12"
    >
      <div class="py-3 d-flex justify-end">
        <VBtn
          class="mx-2"
          color="error"
          @click="areaTextRemarkButton('Reject')"
        >
          Approve Reject
        </VBtn>
      </div>
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

    <!-- Dialog Step Save Draft -->
    <section style="font-size: 12px;">
      <VDialog
        v-model="isDialogVisibleStepSaveDraft"
        width="90%"
      >
        <!-- Dialog Content -->
        <VCard
          class="text-center"
          :title="wordForSubmit"
        >
          <DialogCloseBtn
            variant="text"
            size="default"
            @click="isDialogVisibleStepSaveDraft = false"
          />
          <VCardText class="pa-1">
            <VRow>
              <VCol
                class="text-center d-flex flex-column align-center justify-center mx-auto"
                cols="4"
              >
                <div>
                  <VProgressLinear
                    v-if="loadindingSaveDatft1"
                    indeterminate
                    color="primary"
                  />
                  <VProgressLinear
                    v-if="loadindingSaveDatftSeccess1"
                    model-value="100"
                    color="primary"
                  />
                  <VProgressLinear
                    v-if="loadindingSaveDatftFailed1"
                    model-value="0"
                  />
                  <VAvatar
                    class="my-2"
                    size="150"
                    :color="colorStep1"
                  >
                    <VIcon
                      size="100"
                      :icon="iconStep1"
                    />
                  </VAvatar>
                </div>
                <div><span style="font-size: 12px;">Save Header</span></div>
              </VCol>
              <VCol
                class="text-center d-flex flex-column align-center justify-center mx-auto"
                cols="4"
              >
                <div>
                  <VProgressLinear
                    v-if="loadindingSaveDatft2"
                    indeterminate
                    color="primary"
                  />
                  <VProgressLinear
                    v-if="loadindingSaveDatftSeccess2"
                    model-value="100"
                    color="primary"
                  />
                  <VProgressLinear
                    v-if="loadindingSaveDatftFailed2"
                    model-value="0"
                  />
                  <VAvatar
                    class="my-2"
                    size="150"
                    :color="colorStep2"
                  >
                    <VIcon
                      size="100"
                      :icon="iconStep2"
                    />
                  </VAvatar>
                </div>
                <div><span style="font-size: 12px;">Save Lot</span></div>
              </VCol>
            </VRow>
          </VCardText>

          <VCardText class="text-start">
            <VDivider />
            <div>
              <VAlert variant="outlined">
                <VRow>
                  <VCol cols="6">
                    Save and Verify
                  </VCol>
                  <VCol
                    cols="6"
                    class="d-flex justify-end"
                  >
                    <VSwitch
                      v-model="showOnlyErrors"
                      :label="showOnlyErrors ? 'Show All Details' : 'Show Only Errors'"
                    />
                  </VCol>
                  <VCol
                    v-for="(field, index) in filteredFields"
                    :key="index"
                    cols="4"
                  >
                    <div :style="{ backgroundColor: field.isEmpty ? '#FBE9E7' : '#E8F5E9', borderRadius: '10px', }">
                      <span
                        v-if="field.isEmpty"
                        style="font-size: 14px;"
                      >
                        <VIcon
                          color="error"
                          icon="ri-error-warning-fill"
                        />
                        <span>{{ field.indexLabelFiled }} - </span>
                        <span v-if="!field.body.actualAnalysis && field.needActualCheck">Analysis result is required! <br></span>
                        <span v-else-if="field.body.okState === -1 && !field.needActualCheck">Analysis result is required! <br></span>

                      </span>
                      <span
                        v-else
                        style="font-size: 14px;"
                      >
                        <VIcon
                          color="success"
                          icon="ri-checkbox-circle-fill"
                        />
                        {{ field.indexLabelSuccessed }}: Successed
                        <div v-if="false">
                          <span v-if="field.body.actualAnalysis && field.needActualCheck">Free text: {{ field.body.actualAnalysis }} <br></span>
                          <span v-else-if="field.body.okState !== -1 && !field.needActualCheck">Checkbox: <span v-if="field.body.okState === 0">Not</span> <span v-if="field.body.okState === 1">Ok</span> <br></span>
                        </div>
                      </span>
                    </div>
                  </VCol>
                </VRow>
              </VAlert>
            </div>
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
              <span style="font-size: 22px; font-weight: bolder;">Would you like to {{ wordForSubmit }} Transaction?</span>
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
              v-if="wordForSubmit === 'SUBMIT'"
              color="green"
              @click="submitInspForm"
            >
              {{ wordForSubmit }}
            </VBtn>
            <VBtn
              v-if="['APPROVE'].includes(wordForSubmit)"
              color="success"
              @click="approveReceivingPlant"
            >
              {{ wordForSubmit }}
            </VBtn>
            <VBtn
              v-if="['ACCEPT'].includes(wordForSubmit)"
              color="success"
              @click="approveInsp"
            >
              {{ wordForSubmit }}
            </VBtn>

            <VBtn
              v-if="['SEND BACK'].includes(wordForSubmit)"
              color="purple-accent-4"
              @click="handelSendBack"
            >
              {{ wordForSubmit }}
            </VBtn>
            <VBtn
              v-if="['APPROVE REJECT'].includes(wordForSubmit)"
              color="warning"
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

    <!-- Dialog Area Text Remark -->
    <section>
      <VDialog
        v-model="isDialogTextAreaVisible"
        width="500"
      >
        <!-- Dialog Content -->
        <VCard title="Comment">
          <DialogCloseBtn
            variant="text"
            size="default"
            @click="isDialogTextAreaVisible = false"
          />

          <VCardText>
            <VTextarea
              v-if="wordForSubmit === 'Back To Edit'"
              v-model="commentBackToEdit"
            >
              <template #label>
                <VIcon icon="ri-edit-line" />
              </template>
            </VTextarea>
            <VTextarea
              v-if="wordForSubmit === 'REJECT'"
              v-model="commentReject"
            >
              <template #label>
                <VIcon icon="ri-edit-line" />
              </template>
            </VTextarea>
            <VTextarea
              v-else
              v-model="commentReject"
            >
              <template #label>
                <VIcon icon="ri-edit-line" />
              </template>
            </VTextarea>
            <span
              v-if="textAlertError.success && textAlertError.comment"
              class="text-red"
            >{{ textAlertError.comment }}</span>
            <span
              v-if="!commentReject"
              class="text-red"
            >Please provide a comment to reject the inspection.</span>
          </VCardText>

          <VCardText class="d-flex justify-end flex-wrap gap-4">
            <VBtn
              v-if="wordForSubmit === 'Back To Edit'"
              :color="wordForSubmit === 'Back To Edit' ? 'info' : (wordForSubmit === 'REJECT' ? 'error' : 'default')"
              @click="handelSendBack"
            >
              Back To Edit
            </VBtn>
            <VBtn
              v-if="wordForSubmit === 'Send Back'"
              color="purple-accent-4"
              @click="handelSendBack"
            >
              Send Back
            </VBtn>
            <VBtn
              v-if="wordForSubmit === 'Partial RCVD'"
              color="warning"
              @click="handelBackToEdit"
            >
              INsP AcCept / Partial RCVD
            </VBtn>
            <VBtn
              v-if="wordForSubmit === 'REJECT'"
              :color="wordForSubmit === 'Back To Edit' ? 'info' : (wordForSubmit === 'REJECT' ? 'error' : 'default')"
              @click="rejectInsp"
            >
              Reject
            </VBtn>
          </VCardText>
        </VCard>
      </VDialog>
    </section>
  </div>
</template>

<style scoped src="./insp.scss"></style>
