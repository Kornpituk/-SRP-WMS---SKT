<script setup>
import axiosIns from '@axios'
import { urlApi } from '@/api' //---------------------- Import Api for Url *****
import { ref, watch, watchEffect } from 'vue'

const props = defineProps({
  Data: Array,
})

const route = useRoute()

const dataProps = ref(JSON.parse(route.query.Data || '[]'))

const data = ref(JSON.parse(route.query.Data || '[]'))

console.log('Data**', data)

const whereHouse = ref(localStorage.getItem('whereHouseName'))
const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
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

//------------------------------------ Purchest Item --------------------------------
const headerInsp =ref({
  sktName: dataProps.value.itemName,
  sktId: '',
  itemCode: dataProps.value.itemCode,
  supplierName: dataProps.value.supplierName,
  receivedDate: dataProps.value.deliveryDate,
  tradeNames: dataProps.value.concatTradename,
  ManufacturerName: null,
  certiCOA: null,
  remark: dataProps.value.statusComments,
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

//--------------------------- API --------------------------------

//-------------- Generate---------------------------------------
const generatedInsp = () => {

  axiosIns.post(`${urlApi.value}/api/v1/Inspection/generate/${data.value.poEtlLogDetailJournalID}`, {}, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`, 
    },
  },
  {})
    .then(response => {

      // itemsManufacturer.value = response.data.data

      console.log('[generatedReceivingForm]!!: ', response.data)

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
const frozeCheck = ref(true)

const generatedJournalId = () => {
  axiosIns.get(`${urlApi.value}/api/v1/ReceivingPlan/GetByPoEtlLogDetailJournalID/${dataProps.value.poEtlLogDetailJournalID}`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`, 
    },
  },
  {})
    .then(response => {
      console.log('%c[generatedJournalId] nre!!: ', "color: green; font-weight: bold", response.data)

      // ตรวจสอบว่ามีข้อมูลใน response.data.data ก่อน
      if (response.data && response.data.data && response.data.data.length > 0) {
        responseGener.value = response.data.data // เก็บค่า response.data.data ลงใน responseGener

        const item = responseGener.value[0] // เข้าถึงข้อมูลตัวแรกใน array

        statusId.value = item.statusId // เก็บค่า statusId
      } else {
        console.error("ไม่มีข้อมูลใน responseGener")
      }
    })
    .catch(error => {
      console.error('Error:', error)
    })
}

watch(() => {
  generatedInsp()
  generatedJournalId()

  if(statusId.value === 4 || statusId.value === 5){
    frozeCheck.value = false
  }
})

//--------------- get header --------------------------------
const poEtlLogDetailJournalIDQueryParameters = ref(data.value.poEtlLogDetailJournalID)

//------------- Header
const getHearderInsp = () => {
  if(poEtlLogDetailJournalIDQueryParameters.value){
    axiosIns.get(`${urlApi.value}/api/v1/Inspection/View/${poEtlLogDetailJournalIDQueryParameters.value}`, {
      headers: {
        'accept': '*/*',
        'x-location': `${whereHouse.value}`,
        Authorization: `Bearer ${accessTokenAtStore}`, 
      },
    },
    {})
      .then(response => {

        const data = response.data.data

        //------- Headers --------------------------------
        headerInsp.value.sktName = data[0].productName
        headerInsp.value.sktId = data[0].sktLot
        headerInsp.value.itemCode = data[0].productId
        headerInsp.value.supplierName = data[0].supplierName
        headerInsp.value.tradeNames = data[0].tradeName
        headerInsp.value.ManufacturerName = data[0].makerName

        headerInsp.value.receivedDate = data[0].receivedDate

        //--------- Footers --------------------------------
        // Note Details Remarks:
        headerInsp.value.remark = data[0].remark
        headerInsp.value.note = data[0].note
        headerInsp.value.details = data[0].limConditionDetail
        headerInsp.value.remark = data[0].remark

        // WH/IP
        headerInsp.value.updateByStaffWH = data[0].whStaff
        headerInsp.value.updateBySuperWH = data[0].whSupervisor
        headerInsp.value.updateByStaffInsp = data[0].inspStaff
        headerInsp.value.updateBySuperInsp = data[0].inspSupervisor

        // lastUpdated
        headerInsp.value.lastUpdatedStaffWH = data[0].whStaffUpdatedDate
        headerInsp.value.lastUpdatedSuperWH = data[0].whSupervisorDate
        headerInsp.value.lastUpdatedStaffInsp = data[0].inspStaffUpdatedDate
        headerInsp.value.lastUpdatedSuperInsp = data[0].inspSupervisorDate

        // reject
        headerInsp.value.remarkReject = data[0].statusComments

        // purchaseOrder.value = response.data[0]
        console.log('[*****Headers]]!!: ', data[0])
    
      })
      .catch(error => {
        // Handle errors
        console.error('Error:', error)
      })
  }else {
    console.log('**poEtlLogDetailJournalIDQueryParameters = ', poEtlLogDetailJournalIDQueryParameters.value)
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
  console.log("[textValue]", analysisItems.value)
}

// ข้อมูลต้นแบบที่เราจะเก็บเพื่อส่งไปยัง API
const formData = ref({
  inspReqLotJournalId: 0,   // ID ที่จะอัปเดต
  updatedBy: '',     // ชื่อผู้ใช้งาน
  actualAnalysis: '', // ค่าวิเคราะห์จริง
  okState: 0,                // ค่าจาก VRadioGroup
})

// eslint-disable-next-line sonarjs/cognitive-complexity
const getAnalysistInsp = () => {
  if(poEtlLogDetailJournalIDQueryParameters.value){
    axiosIns.get(`${urlApi.value}/api/v1/Inspection/GetAnalyticalItems/${poEtlLogDetailJournalIDQueryParameters.value}`, {
      headers: {
        'accept': '*/*',
        'x-location': `${whereHouse.value}`,
        Authorization: `Bearer ${accessTokenAtStore}`, 
      },
    },
    {})
      .then(response => {

        analysisItems.value = response.data.items

        for (let i = 0; i < 5; i++) {
          analysisItemsCode.value[`actualAmountUnits_${i}`] = analysisItems.value[0].itemAnalyticals[i][`actualAmountUnits`]
          analysisItemsCode.value[`actualMakerLotNo_${i}`] = analysisItems.value[0].itemAnalyticals[i][`actualMakerLotNo`]
          analysisItemsCode.value[`actualNetCountKgs_${i}`] = analysisItems.value[0].itemAnalyticals[i][`actualNetCountKgs`]
          analysisItemsCode.value[`actualTotalQuantityKgs_${i}`] = analysisItems.value[0].itemAnalyticals[i][`actualTotalQuantityKgs`]
        }

        // วนลูปผ่าน analysisItems.value
        for (let i = 0; i < analysisItems.value.length; i++) {
          const item = analysisItems.value[i]
  
          // เก็บค่าจาก analysisItems
          analysisResults.value.push({
            rmInspReqFormAnalyticalItemsJournalId: item.rmInspReqFormAnalyticalItemsJournalId,
            typeID: item.typeID,
            typeName: item.typeName,
            analyticalItem: item.analyticalItem,
            unit: item.unit,
          })

          // ตรวจสอบว่า itemAnalyticals เป็นอาร์เรย์
          if (Array.isArray(item.itemAnalyticals)) {
            for (let j = 0; j < item.itemAnalyticals.length; j++) {
              const analyticalItem = item.itemAnalyticals[j]
      
              // เก็บค่าจาก itemAnalyticals
              analyticalItemsResults.value.push({
                rmInspReqFormAnalyticalItemsJournalId: analyticalItem.rmInspReqFormAnalyticalItemsJournalId,
                actualAmountUnits: analyticalItem.actualAmountUnits,
                actualAnalysis: analyticalItem.actualAnalysis,
                actualMakerLotNo: analyticalItem.actualMakerLotNo,
                actualNetCountKgs: analyticalItem.actualNetCountKgs,
                actualTotalQuantityKgs: analyticalItem.actualTotalQuantityKgs,
                inspReqLotJournalId: analyticalItem.inspReqLotJournalId,
                lotID: analyticalItem.lotID,
                okState: analyticalItem.okState,

                // เพิ่มฟิลด์ที่ต้องการเก็บข้อมูลได้ที่นี่
              })
            }
          }
        }
        console.log("***************55555555", analysisItems.value)
        
      })
      .catch(error => {
        // Handle errors
        console.error('Error:', error)
      })
  }else {
    console.log('**poEtlLogDetailJournalIDQueryParameters = ', poEtlLogDetailJournalIDQueryParameters.value)
  }
  
}

watch(() => {
  getHearderInsp()
  getAnalysistInsp()
})

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

    // console.log('[products.value]!!: ', response.data)
    // isDialogSubmitSuccessVisible.value = true
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

watchEffect(() => {
  // for (let i = 0; i < analysisItems.value.length; i++) {
  //   console.log('Test', analysisItems.value[i])
  // }
})

const textAlertErrorOkState = ref('')

const checkOkState = (item, typeId, indexAnalysis) => {
  // ตรวจสอบว่ามีค่าใน itemAnalyticals ก่อนที่จะเข้าถึง
  if (item.itemAnalyticals && item.itemAnalyticals.length > indexAnalysis) {
    const analyticalItem = item.itemAnalyticals[indexAnalysis]
    if (analyticalItem.okState != null) {
      textAlertErrorOkState.value = 'Analysis result OK/NOT is required!'
      
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
  const hasErrors = emptyFields.value.some(field => field.isEmpty)
  
  // ถ้ามี error ไม่ส่งข้อมูลไปยัง API
  if (hasErrors) {
    console.log('Cannot proceed: There are errors in the fields.')

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

        console.log('[response]: ', response.data)
      }
    }

    // แสดง dialog เมื่อสำเร็จ
    // isDialogSubmitSuccessVisible.value = true
  } catch (error) {
    // แสดง dialog เมื่อมีข้อผิดพลาด
    // isDialogSubmitFailedVisible.value = true
    console.error('Error:', error)
  }
}

//--------------- Submit --------------------------------
const submitInspForm = async () => {
  try {
    // รอให้ saveHeaderInspect และ saveLotInspect ทำงานเสร็จสมบูรณ์ก่อน
    await submitButtonVisibleNew()

    // ส่งข้อมูลไปยัง API เมื่อทุกอย่างเสร็จสิ้น
    const response = await axiosIns.post(`${urlApi.value}/api/v1/Inspection/Submit/${data.value.poEtlLogDetailJournalID}`, {}, {
      headers: {
        'accept': '*/*',
        'x-location': `${whereHouse.value}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
    })

    console.log('[products.value]!!: ', response.data)
    isDialogSubmitSuccessVisible.value = true
    isDialogConfirmVisible.value = false

  } catch (error) {
    // Handle errors
    console.error('Error:', error)

    // isDialogSubmitFailedVisible.value = true
  }
}

//-------- Fuction Cancel --------------------------------
// const isDialogSubmitFailedVisible = ref(false)

const commentReject = ref('')
const commentBackToEdit = ref('')

const rejectInsp = () => {
  console.log("StaertSSSSS!!")
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
      console.log('[products.value]!!: ', response.data)
      isDialogSubmitSuccessVisible.value = true
      isDialogConfirmVisible.value = false
    
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
      isDialogSubmitFailedVisible.value = true
    })
}

const approveInsp = () => {
  console.log("StaertSSSSS!!")
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
      console.log('[products.value]!!: ', response.data)
      isDialogSubmitSuccessVisible.value = true
      isDialogConfirmVisible.value = false
    
    })
    .catch(error => {
    // Handle errors
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
      console.log(`Response for poEtlLogDetailJournalID ${data.value.poEtlLogDetailJournalID}:`, response.data)

      // isDialogSubmitSuccessVisible.value = true
      isDialogConfirmVisible.value = false

      // รีเฟรชหน้าจอทั้งหมด
      location.reload()
    })
    .catch(error => {
      // Handle errors
      console.error(`Error for poEtlLogDetailJournalID ${data.value.poEtlLogDetailJournalID}:`, error)
      isDialogSubmitFailedVisible.value = true
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

        console.log('[*****Headers COA]]!!: ', lotData)
      })
      .catch(error => {
        console.error('Error:', error)
        isLoading.value = false
        checkBoxCOANo.value = true
      })
      .finally(() => {
        loading.value = false
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

import image from '../inspecReqForm/COAคืออะไร.jpg'

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

const submitButtonVisibleNew = async word => {
  wordForSubmit.value = word
  isDialogVisibleStepSaveDraft.value = true

  try {
    // Start Step 1
    loadindingSaveDatft1.value = true

    // Step 1: saveLotReceivingForm

    await saveHeaderInspect()
    console.log('saveHeaderReceivingForm success')

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
    console.log('saveLotReceivingForm success')
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
  //   console.log('saveCOARecevingFrom success')
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

  location.reload()

  // isDialogSubmitSuccessVisible.value = true
  isDialogConfirmVisible.value = false

  return true
}

const submitButton = word => {
  isDialogConfirmVisible.value = true
  wordForSubmit.value = word
  submitInspForm()
}

const saveDraftButton = word => {
  saveHeaderInspect()
  saveLotInspect()
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
  wordForSubmit.value = word
  isDialogConfirmVisible.value = true
}

const approvetButtonVisible = word => {
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
  
  console.log('Status Raw:', status)
  console.log('Role Raw:', role)
  console.log('Disabled Tabs Raw:',  (tabDisablingConfig[status]?.[role] || false))
  
  return tabDisablingConfig[status]?.[role] || false
}
</script>

<template>
  <div class="text-center mt-4">
    <span style="font-size: 22px; font-weight: bolder;">
      Raw Material Inspection Request Form
    </span>
  </div>

  <div v-if="false">
    {{ analysisItemsCode }}
  </div>

  <VRow>
    <VCol cols="3">
      <div
        class="my-4 pa-2 text-center"
        style="border: 1px solid black; font-size: 12px; font-weight: bold;"
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
                      :src="image.fileUri"
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
                      v-for="(image, index) in coaFiles"
                      :key="index"
                      :src="image.fileUri"
                    />
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
          <VCarousel v-model="selectedImageIndex">
            <VCarouselItem
              v-for="(item, i) in coaFiles"
              :key="item"
              :value="i"
              :src="item.fileUri"
            >
              <VSheet
                v-if="false"
                height="100%"
                tile
              >
                <div class="d-flex fill-height justify-center align-center">
                  <div class="text-h2">
                    Slide {{ i + 1 }}
                  </div>
                </div>
              </VSheet>
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
      class="px-0"
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
                          OK
                        </div>
                      </template>
                    </VRadio>
                  </VCol>
                  <VCol cols="6">
                    <VRadio :value="0">
                      <template #label>
                        <div style="font-size: 12px;">
                          NOT
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

              <VTextField
                v-if="item.needActualValue && item.typeID === 1 && item.itemAnalyticals[0]"
                v-model="item.itemAnalyticals[0].actualAnalysis"
                :readonly="frozeCheck"
                :rules="[
                  value => value !== '' || !value || 'Actual value is required!',
                  value => value.length <= 45 || 'Must be 45 characters or less',
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

              <span
                v-if="checkAnalysitItem(item, item.typeID, 0)"
                class="text-red"
              >{{ textAlertErrorAnalysitItem }}</span>
            </td>

            <td
              v-if="item.typeID === 1"
              class="text-center"
              colspan="1"
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
                          OK
                        </div>
                      </template>
                    </VRadio>
                  </VCol>
                  <VCol cols="6">
                    <VRadio :value="0">
                      <template #label>
                        <div style="font-size: 12px;">
                          NOT
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


              <VTextField
                v-if="item.needActualValue && item.typeID === 1 && item.itemAnalyticals[1]"
                v-model="item.itemAnalyticals[1].actualAnalysis"
                :readonly="frozeCheck"
                density="compact"
                :rules="[
                  value => value.length <= 44 || 'Must be 45 characters or less'
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
              <span
                v-if="checkAnalysitItem(item, item.typeID, 1)"
                class="text-red"
              >{{ textAlertErrorAnalysitItem }}</span>
            </td>

            <td
              v-if="item.typeID === 1"
              class="text-center"
              colspan="1"
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
                          OK
                        </div>
                      </template>
                    </VRadio>
                  </VCol>
                  <VCol cols="6">
                    <VRadio :value="0">
                      <template #label>
                        <div style="font-size: 12px;">
                          NOT
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


              <VTextField
                v-if="item.needActualValue && item.typeID === 1 && item.itemAnalyticals[2]"
                v-model="item.itemAnalyticals[2].actualAnalysis"
                :readonly="frozeCheck"
                density="compact"
                ::rules="[
                  value => value.length <= 44 || 'Must be 45 characters or less'
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

              <span
                v-if="checkAnalysitItem(item, item.typeID, 2)"
                class="text-red"
              >{{ textAlertErrorAnalysitItem }}</span>
            </td>

            <td
              v-if="item.typeID === 1"
              class="text-center"
              colspan="1"
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
                          OK
                        </div>
                      </template>
                    </VRadio>
                  </VCol>
                  <VCol cols="6">
                    <VRadio :value="0">
                      <template #label>
                        <div style="font-size: 12px;">
                          NOT
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

              <VTextField
                v-if="item.needActualValue && item.typeID === 1 && item.itemAnalyticals[3]"
                v-model="item.itemAnalyticals[3].actualAnalysis"
                :readonly="frozeCheck"
                density="compact"
                :rules="[
                  value => value.length <= 44 || 'Must be 45 characters or less'
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

              <span
                v-if="checkAnalysitItem(item, item.typeID, 3)"
                class="text-red"
              >{{ textAlertErrorAnalysitItem }}</span>
            </td>

            <td
              v-if="item.typeID === 1"
              class="text-center"
              colspan="1"
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
                          OK
                        </div>
                      </template>
                    </VRadio>
                  </VCol>
                  <VCol cols="6">
                    <VRadio :value="0">
                      <template #label>
                        <div style="font-size: 12px;">
                          NOT
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

              <VTextField
                v-if="item.needActualValue && item.typeID === 1 && item.itemAnalyticals[4]"
                v-model="item.itemAnalyticals[4].actualAnalysis"
                :readonly="frozeCheck"
                density="compact"
                :rules="[
                  value => value.length <= 45 || 'Must be 45 characters or less'
                ]"
              >
                <template
                  v-if="!frozeCheck"
                  #label
                >
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>

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
                          OK
                        </div>
                      </template>
                    </VRadio>
                  </VCol>
                  <VCol cols="6">
                    <VRadio :value="0">
                      <template #label>
                        <div style="font-size: 12px;">
                          NOT
                        </div>
                      </template>
                    </VRadio>
                  </VCol>
                </VRow>
              </VRadioGroup>

              <span
                v-if="checkOkState(item, item.typeID, 0)"
                class="text-red"
              >Analysis result Ok/Not is required!</span>


              <VTextField
                v-if="item.needActualValue && item.typeID === 2 && item.itemAnalyticals[0]"
                v-model="item.itemAnalyticals[0].actualAnalysis"
                density="compact"
                :readonly="frozeCheck"
              >
                <template
                  v-if="!frozeCheck"
                  #label
                >
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>

              <span
                v-if="checkAnalysitItem(item, item.typeID, 0)"
                class="text-red"
              >Analysis result Ok/Not is required!</span>
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
                          OK
                        </div>
                      </template>
                    </VRadio>
                  </VCol>
                  <VCol cols="6">
                    <VRadio :value="0">
                      <template #label>
                        <div style="font-size: 12px;">
                          NOT
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

              <VTextField
                v-if="item.needActualValue && item.typeID === 2 && item.itemAnalyticals[1]"
                v-model="item.itemAnalyticals[1].actualAnalysis"
                :readonly="frozeCheck"
                density="compact"
              >
                <template
                  v-if="!frozeCheck"
                  #label
                >
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>

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
                          OK
                        </div>
                      </template>
                    </VRadio>
                  </VCol>
                  <VCol cols="6">
                    <VRadio :value="0">
                      <template #label>
                        <div style="font-size: 12px;">
                          NOT
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

              <VTextField
                v-if="item.needActualValue && item.typeID === 2 && item.itemAnalyticals[2]"
                v-model="item.itemAnalyticals[2].actualAnalysis"
                :readonly="frozeCheck"
                density="compact"
              >
                <template
                  v-if="!frozeCheck"
                  #label
                >
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>

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
                          OK
                        </div>
                      </template>
                    </VRadio>
                  </VCol>
                  <VCol cols="6">
                    <VRadio :value="0">
                      <template #label>
                        <div style="font-size: 12px;">
                          NOT
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

              <VTextField
                v-if="item.needActualValue && item.typeID === 2 && item.itemAnalyticals[3]"
                v-model="item.itemAnalyticals[3].actualAnalysis"
                :readonly="frozeCheck"
                density="compact"
              >
                <template
                  v-if="!frozeCheck"
                  #label
                >
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>

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
                          OK
                        </div>
                      </template>
                    </VRadio>
                  </VCol>
                  <VCol cols="6">
                    <VRadio :value="0">
                      <template #label>
                        <div style="font-size: 12px;">
                          NOT
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
              <VTextField
                v-if="item.needActualValue && item.typeID === 2 && item.itemAnalyticals[4]"
                v-model="item.itemAnalyticals[4].actualAnalysis"
                :readonly="frozeCheck"
                density="compact"
              >
                <template
                  v-if="!frozeCheck"
                  #label
                >
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>

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
      <VCol cols="12 px-0">
        <span
          class=""
          style="font-size: 12px;"
        >Remark: {{ headerInsp.remark }}</span>
      </VCol>
      <VCol cols="6 px-0">
        Notes
      </VCol>
      <VCol cols="6 px-0">
        Details of Limitation Condition
      </VCol>

      <VCol
        cols="12"
        class="px-0"
      >
        <table class="custom-table">
          <tbody>
            <tr>
              <td>
                <VTextarea
                  v-model="headerInsp.note"
                  :readonly="frozeCheck"
                  auto-grow
                  :rules="[v => v.length <= 1000 || 'Max 1000 characters']"
                >
                  <template
                    v-if="!frozeCheck"
                    #label
                  >
                    <VIcon icon="ri-edit-line" />
                  </template>
                </VTextarea>
              </td>
              <td>
                <VTextarea
                  v-model="headerInsp.details"
                  :readonly="frozeCheck"
                  auto-grow
                  :rules="[v => v.length <= 1000 || 'Max 1000 characters']"
                >
                  <template
                    v-if="!frozeCheck"
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
  <section class="mt-5">
    <VRow>
      <VCol
        class="px-0"
        style="font-size: 12px;"
        cols="12"
      >
        Quality Evaluation
      </VCol>
      <VCol
        style="border: 1px solid black;"
        cols="4"
        class="d-flex align-center"
      >
        <VRow>
          <VCol
            cols="1"
            class="d-flex align-center"
            style="font-size: 12px; font-weight: bolder;"
          >
            Accept
          </VCol>
          <VCol
            class="d-flex justify-center"
            cols="10"
          >
            <VIcon
              v-if="statusId === 17 || statusId === 15"
              color="success"
              size="60"
              icon="ri-checkbox-circle-fill"
            />
          </VCol>
        </VRow>
      </VCol>
      <VCol
        style="border: 1px solid black;"
        cols="4"
        class="d-flex align-center"
      >
        <VRow>
          <VCol
            cols="1"
            class="d-flex align-center"
            style="font-size: 12px; font-weight: bolder;"
          >
            Reject
          </VCol>
          <VCol
            class="d-flex justify-center"
            cols="11"
          >
            <VIcon
              v-if="statusId === 7 || statusId === 16"
              color="red"
              size="60"
              icon="ri-close-circle-fill"
            />
          </VCol>
        </VRow>
      </VCol>
      <VCol
        style="border: 1px solid black;"
        cols="4"
        class="d-flex align-center"
      >
        <VRow>
          <VCol
            cols="2"
            class="d-flex align-center"
          >
            <span style="font-size: 12px; font-weight: bolder;">Comment:</span>
          </VCol>
          <VCol cols="10">
            <span
              v-if="statusId === 7 || statusId === 16"
              style=" white-space: normal; word-wrap: break-word;"
            >
              <VTextarea v-model="headerInsp.remarkReject" />
            </span>
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </section>
  
  <!-- WareHouse / Inspection -->
  <section>
    <!-- WareHouse / Inspection -->
    <VRow class="mt-6">
      <VCol cols="6">
        <VRow>
          <VCol
            style="border: 1px solid black; font-size: 12px;"
            class="text-center"
            cols="12"
          >
            Warehouse
          </VCol>
          <VCol
            style="border: 1px solid black;"
            class="text-start"
            cols="6"
          >
            <div style="font-size: 12px;">
              Staff: {{ headerInsp.updateByStaffWH }}
            </div>
            <VDivider />
            <div
              v-if="headerInsp.lastUpdatedStaffWH"
              style="font-size: 12px;"
            >
              <VIcon icon="ri-calendar-schedule-fill" />{{ formatDate(headerInsp.lastUpdatedStaffWH) }}
            </div>
          </VCol>
          <VCol
            style="border: 1px solid black;"
            class="text-start"
            cols="6"
          >
            <div style="font-size: 12px;">
              Supervisor: {{ headerInsp.updateBySuperWH }}
            </div>
            <VDivider />
            <div
              v-if="headerInsp.lastUpdatedSuperWH"
              style="font-size: 12px;"
            >
              <VIcon icon="ri-calendar-schedule-fill" />{{ formatDate(headerInsp.lastUpdatedSuperWH) }}
            </div>
          </VCol>
        </VRow>
      </VCol>
      <VCol cols="6">
        <VRow>
          <VCol
            style="border: 1px solid black; font-size: 12px;"
            class="text-center"
            cols="12"
          >
            Inspection
          </VCol>
          <VCol
            style="border: 1px solid black;"
            class="text-start"
            cols="6"
          >
            <div style="font-size: 12px;">
              Staff: {{ headerInsp.updateByStaffInsp }}
            </div>
            <VDivider />
            <div
              v-if="headerInsp.lastUpdatedStaffInsp"
              style="font-size: 12px;"
            >
              <VIcon icon="ri-calendar-schedule-fill" />{{ formatDate(headerInsp.lastUpdatedStaffInsp) }}
            </div>
          </VCol>
          <VCol
            style="border: 1px solid black;"
            class="text-start"
            cols="6"
          >
            <div style="font-size: 12px;">
              Supervisor: {{ headerInsp.updateBySuperInsp }}
            </div>
            <VDivider />
            <div
              v-if="headerInsp.lastUpdatedSuperInsp"
              style="font-size: 12px;"
            >
              <VIcon icon="ri-calendar-schedule-fill" />{{ formatDate(headerInsp.lastUpdatedSuperInsp) }}
            </div>
          </VCol>
        </VRow>
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
        class="mx-4"
        color="warning"
        style="font-size: 12px;"
        @click="submitButtonVisibleNew('SAVE DRAFT')"
      >
        SAVE DRAFT
      </VBtn>
      <VBtn
        color="green"
        style="font-size: 12px;"
        @click="submitButtonVisible('SUBMIT')"
      >
        SUBMIT
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
        v-if="false"
        class=""
        color="info"
        style="font-size: 12px;"
        @click="areaTextRemarkButton('Back To Edit')"
      >
        Back To Edit
      </VBtn>
      <VBtn
        class="mx-2"
        color="error"
        style="font-size: 12px;"
        @click="areaTextRemarkButton('Reject')"
      >
        Reject
      </VBtn>
      <VBtn
        color="green"
        style="font-size: 12px;"
        @click="approvetButtonVisible('ACCEPT')"
      >
        Accept
      </VBtn>
    </div>
  </section>

  <!-- Btn Approval -->
  <section
    v-if="false"
    class="mt-6"
  >
    <div
      style="font-size: 12px;"
      class="d-flex justify-end px-0"
    >
      <VBtn
        v-if="false"
        class=""
        color="info"
        style="font-size: 12px;"
        @click="areaTextRemarkButton('Back To Edit')"
      >
        Back To Edit
      </VBtn>
      <VBtn
        v-if="statusId === 7"
        class="mx-2"
        color="error"
        style="font-size: 12px;"
        @click="areaTextRemarkButton('APPROVE REJECT')"
      >
        Approve Reject
      </VBtn>
      <VBtn
        v-if="statusId === 15"
        color="green"
        style="font-size: 12px;"
        @click="approvetButtonVisible('APPROVE')"
      >
        Approve
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

  <!-- Dialog Step Save Draft -->
  <section style="font-size: 12px;">
    <VDialog
      v-model="isDialogVisibleStepSaveDraft"
      width="90%"
    >
      <!-- Dialog Content -->
      <VCard
        class="text-center"
        title="Save Draft"
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
              <div><span style="font-size: 12px;">Save Draft Header</span></div>
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
              <div><span style="font-size: 12px;">Save Draft Lot</span></div>
            </VCol>
          </VRow>
        </VCardText>

        <VCardText
          v-if="emptyFields"
          class="text-start"
        >
          <VDivider />
          <div>
            <VAlert variant="outlined">
              <VRow>
                <VCol cols="6">
                  Details Lot
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
                        <span v-else-if="field.body.okState !== -1 && !field.needActualCheck">Checkbox: <span v-if="field.body.okState === 0">NOT</span> <span v-if="field.body.okState === 1">OK</span> <br></span>
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
      <VCard :title="wordForSubmit">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogTextAreaVisible = false"
        />

        <VCardText>
          <VTextarea
            v-if="wordForSubmit === 'Back To Edit'"
            v-model="commentBackToEdit"
            :label="`Remark ${wordForSubmit}`"
            :placeholder="`Enter Remark ${wordForSubmit}`"
          />
          <VTextarea
            v-if="wordForSubmit === 'Reject'"
            v-model="commentReject"
            :label="`Remark ${wordForSubmit}`"
            :placeholder="`Enter Remark ${wordForSubmit}`"
          />
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            v-if="wordForSubmit === 'Back To Edit'"
            :color="wordForSubmit === 'Back To Edit' ? 'info' : (wordForSubmit === 'Reject' ? 'error' : 'default')"
            @click="backToEditReceivingPlan"
          >
            Back To Edit
          </VBtn>
          <VBtn
            v-if="wordForSubmit === 'Reject'"
            :color="wordForSubmit === 'Back To Edit' ? 'info' : (wordForSubmit === 'Reject' ? 'error' : 'default')"
            @click="rejectInsp"
          >
            Reject
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>
</template>

<style>
.text-center {
  text-align: center;
}

.centered-input >>> input {
  padding: 10px;
  text-align: center;
}

.custom-table {
  border-collapse: collapse;
  inline-size: 100%;
}

.custom-table,
.custom-table th,
.custom-table td {
  border: 1px solid black;
  font-size: 12px;
}

.custom-radio-group .v-label {
  font-size: 12px !important;
}

.custom-table th,
.custom-table td {
  padding: 8px;
  text-align: start;
}

.header {
  justify-content: space-between;
  font-weight: bold;
  text-align: center;
}

.section-title {
  font-weight: bold;
}

.image {
  inline-size: 100px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.divider {
  border-inline-end: 1px solid black;
  line-height: 20px; /* ปรับค่า line-height ตามที่คุณต้องการ */
  padding-inline-end: 10px;
}

.card-stack-container {
  display: flex;
  align-items: center !important; /* จัดกึ่งกลางแนวตั้ง */
  justify-content: center !important; /* จัดกึ่งกลางแนวนอน */
  block-size: 60px;
  inline-size: 200px; /* กำหนดขนาดที่ต้องการสำหรับการ์ด */
}

.card {
  position: absolute;
  block-size: 70px;
  inline-size: 60px;
  transition: transform 0.3s ease;
}

.v-text-field >>> input {
  font-size: 12px;
  text-transform: capitalize;
}

.cardHide:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 20%); /* เพิ่มเงาเมื่อ hover */
  transform: translateY(-20px) !important; /* เลื่อนการ์ดขึ้น 10px เมื่อ hover */
}

.view-all-button {
  margin-block-start: 16px;
}

.custom-date-time-picker >>> input {
  font-size: 12px; /* ปรับขนาดของข้อความในฟิลด์ */
}

.custom-date-time-picker >>> input icon--prepend {
  font-size: 12px; /* ปรับขนาดของไอคอนที่อยู่ด้านหน้า */
}
</style>
