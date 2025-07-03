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

import { fetchAndMapInspectionHeader,
  useGenerateInspection,
  useGenerateJournalIdInspection,
  useAnalysisItems,
  useSaveLotInsp,
  useSaveHeaderInspect,
  useSaveLorryAfterMixing,
} from './composables/useInspection'

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

const roleAccount = ref('issues')

function formatDate(dateString) {
  const date = new Date(dateString) // แปลงสตริงเป็นวัตถุ Date
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // เดือนเริ่มต้นที่ 0, ดังนั้นต้อง +1
  const year = date.getFullYear()
  
  return `${day}/${month}/${year}`
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
  spacialCase: false,
  isAccept: false,
  isReject: false,

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

//-------------- Generate---------------------------------------

const poEtlLogDetailJournalIDQueryParameters = ref(itemStore.getItemDetails('poEtlLogDetailJournalIDCookies'))

const loadingGenerated1 = ref(true)

const { generate, loading, error } = useGenerateInspection()

const generatedInsp = async () => {
  loadingGenerated1.value = true

  const success = await generate(poEtlLogDetailJournalIDQueryParameters.value)

  // if (success) {
  //   loadingGenerated1.value = false

  //   // console.log('สร้างสำเร็จ:', data.value)

  // } else {
  //   // console.error('ล้มเหลว:', error.value)
    
  //   loadingGenerated1.value = false
  // }
}

//------------- journalId
const responseGener = ref([])

const statusId = ref(null) // ตัวแปรสำหรับเก็บค่า statusId
const typeIdLorry = ref(null) // ตัวแปรสำหรับเก็บค่า typeIdLorry
const isReject = ref(null)
const isAccept = ref(null)
const frozeCheck = ref(true)
const frozeCheckNotDetialCheck  = ref(true)
const receiveTypeIdData = ref(null)
const poEiLog = ref()

const journalInspection = useGenerateJournalIdInspection()

const generatedJournalId = async () => {
  loadingGenerated1.value = true

  const success = await journalInspection.generate(poEtlLogDetailJournalIDQueryParameters.value)
  if (success) {
    loadingGenerated1.value = false

    const item = journalInspection.result.value.data[0]

    poEtlLogDetailJournalIDQueryParameters.value = item.poEtlLogDetailJournalID
    receiveTypeIdData.value = item.receiveTypeId
    statusId.value = item.statusId
    loadingGenerated2.value = false
    typeIdLorry.value  = item.lorryInfos
  } else {
    loadingGenerated1.value = false
  }
}

const checkTypeIdLorry = () => {
  if (typeIdLorry.value && typeIdLorry.value.length > 0) {
    // return !!(typeIdLorry.value[0].lorryInfoKey === 1 || typeIdLorry.value[0].lorryInfoKey === 2)
    if(typeIdLorry.value[0].lorryInfoKey === '01' || typeIdLorry.value[0].lorryInfoKey === '02'){
      console.log('TypeIdLorry is true', typeIdLorry.value[0].lorryInfoKey)
      
      return true
    } else {
      console.log('TypeIdLorry is false', typeIdLorry.value[0].lorryInfoKey)

      return false
    }
  }
  
  return false
}

// eslint-disable-next-line sonarjs/cognitive-complexity
watchEffect(() => {
  if(statusId.value === 4 && canVisibleUserPermission(statusPermission.value, 'BTN_SAVE_DRAFT').canVisible){
    frozeCheck.value = false
  }

  if(statusId.value === 5 && canVisibleUserPermission(statusPermission.value, 'BTN_SAVE_DRAFT').canVisible){
    frozeCheck.value = false
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

  if(statusId.value === 4 && canVisibleUserPermission(statusPermission.value, 'BTN_SAVE_DRAFT').canVisible){
    frozeCheckNotDetialCheck.value = false
  }

  if(statusId.value === 5 && canVisibleUserPermission(statusPermission.value, 'BTN_SAVE_DRAFT').canVisible){
    frozeCheckNotDetialCheck.value = false
  }
})

//------------- Header

const getHearderInsp = async () => {
  const id = poEtlLogDetailJournalIDQueryParameters.value
  const result = await fetchAndMapInspectionHeader(id)
  
  if (result) {
    headerInsp.value = result.headerInsp.value
    isReject.value = result?.isReject || false
    isAccept.value = result?.isAccept || false
  }
}

const state = reactive({
  analyticalItems: [],  // เก็บข้อมูลทั้งหมด
})

//------------- Analysist

// ข้อมูลต้นแบบที่เราจะเก็บเพื่อส่งไปยัง API
const formData = ref({
  inspReqLotJournalId: 0,   // ID ที่จะอัปเดต
  updatedBy: '',     // ชื่อผู้ใช้งาน
  actualAnalysis: '', // ค่าวิเคราะห์จริง
  okState: 0,                // ค่าจาก VRadioGroup
})

const {
  fetch,
  loading: analysisLoading,
  error: analysisError,
  analysisItems,
  analysisItemsCode,
  analysisResults,
  analyticalItemsResults,
} = useAnalysisItems()

const getAnalysistInsp = async () => {
  if (!poEtlLogDetailJournalIDQueryParameters.value) return

  await fetch(poEtlLogDetailJournalIDQueryParameters.value)

  if (error.value) {
    console.error('ล้มเหลว:', error.value)
  } else {
    console.log('สำเร็จ:', analysisItems.value)
  }
}

const checkMakerLot = () => {

}

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

const {
  saveHeaderInspect: saveHeaderInspectUseCase,

  // isDialogSubmitFailedVisible,
} = useSaveHeaderInspect({
  headerInsp,
  poEtlLogDetailJournalIDQueryParameters,
})

const saveHeaderInspect = async () => {
  const success = await saveHeaderInspectUseCase()
  if (success) {
    // ทำอะไรต่อ เช่น แสดง Dialog สำเร็จ
    // isDialogSubmitFailedVisible.value = true
    console.log('บันทึกสำเร็จ saveHeaderInspect')
    
    return true
  } else {
    isDialogSubmitFailedVisible.value = true
    console.log('บันทึกล้มเหลว saveHeaderInspect')
  }
}

//--------------- save Lot --------------------------------
//---------------- Validate
// const emptyFields = ref([])

const showOnlyErrors = ref(false) // ตั้งเป็น true เพื่อแสดงเฉพาะค่า error

const textAlertErrorOkState = ref('')

const checkOkState = (item, typeId, indexAnalysis) => {
  // ตรวจสอบว่ามีค่าใน itemAnalyticals ก่อนที่จะเข้าถึง
  if (item.itemAnalyticals && item.itemAnalyticals.length > indexAnalysis && item.unit !== ''  ) {
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
  if (item.itemAnalyticals && item.itemAnalyticals.length > indexAnalysis && item.unit !== '') {
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

  // eslint-disable-next-line sonarjs/cognitive-complexity
  analysisItems.value.forEach((item, itemIndex) => {
    item.itemAnalyticals.forEach((analyticalItem, analyticalIndex) => {
      const body = {
        inspReqLotJournalId: analyticalItem.inspReqLotJournalId,
        actualAnalysis: analyticalItem.actualAnalysis,
        okState: analyticalItem.okState,
        acture: analyticalItem.acture,
        afterMixing: analyticalItem.afterMixing,
      }

      const indexLabelFiled = `No.${itemIndex + 1} - Lot ${analyticalIndex + 1}`

      const indexLabelSuccessed =  `${itemIndex + 1} - Lot ${analyticalIndex + 1}`
      const needActualCheck = item.needActualValue

      // ตรวจสอบว่าต้องเช็ค actualAnalysis หรือ okState ตามค่า needActualValue
      if(item.unit !== ''){
        if (item.lorryInput) {
        // เช็คเฉพาะ okState
          if (!body.acture && !body.afterMixing) {
            emptyFieldsList.push({ indexLabelFiled, body, isEmpty: true, needActualCheck })
          } else {
            emptyFieldsList.push({ indexLabelSuccessed, body, isEmpty: false, needActualCheck })
          }
        } else if (item.needActualValue) {
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
      }
      
    })
  })

  return emptyFieldsList
}

const generateActualAnalysis = async analysisItems => {
  for (const item of analysisItems) {
    const firstValue = item.itemAnalyticals?.[0]?.actualAnalysis ?? ''

    for (const analyticalItem of item.itemAnalyticals || []) {
      analyticalItem.actualAnalysis = firstValue
    }
  }

  // console.log('Result:', analysisItems.value)
}

const saveLotInspect = async () => {

  await generateActualAnalysis(analysisItems.value)

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
          "acture": analyticalItem.acture,
          "afterMixing": analyticalItem.afterMixing,
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

const {
  emptyFields,
  trickerSubmit,
  saveLotInspect: saveLotInspectUserCase,
} = useSaveLotInsp(analysisItems)

const filteredFields = computed(() => {
  console.log('All filteredFields start:', emptyFields.value)
  if (!showOnlyErrors.value) {
    return emptyFields.value.filter(field => field.isEmpty) // กรองเฉพาะค่า error
  }

  console.log('All fields:', emptyFields.value)
  
  return emptyFields.value // แสดงทั้งหมด
})



// const saveLotInspect = async () => {
//   try {

//     filteredFields

//     generateActualAnalysis(analysisItems)

//     const result = await saveLotInspectUserCase(analysisItems.value)

//     if (result) {
//       // แสดง dialog สำเร็จ
//       console.log('Save successful', result)
//     }
//   } catch (error) {
//     // แสดง dialog ผิดพลาด
//     console.log('Save not successful', error)
//     console.error('Error:', error)
    
//     return
//   }
// }

// ------------------------ Save After Mixing  --------------------------------------------------

const validateDisableInoutAferMixing = type => {
  if(type === 'Actual In Lorry'){
    return !(statusId.value === 5)
  }else if(type === 'After Mixing'){
    if(statusId.value === 5){
      return false
    }else if(statusId.value === 13 || statusId.value === 14){
      return false
    }
    else{
      return true
    }
  }else{
    return true
  }
}

const {
  saveLorryAfterMixing: saveLorryAfterMixingUseCase,

  // isDialogSubmitFailedVisible,
} = useSaveLorryAfterMixing(analysisItems)

const loadingSaveLorryAftherMixing = ref(false)

const saveLorryAfterMixing = async () => {
  loadingSaveLorryAftherMixing.value = true

  const success = await saveLorryAfterMixingUseCase()
  if (success) {
    // ทำอะไรต่อ เช่น แสดง Dialog สำเร็จ
    // isDialogSubmitFailedVisible.value = true
    console.log('บันทึกสำเร็จ saveLorryAfterMixing')
    textAlertDialogFunction('SAVE LORRY AFTER MIXING', true)

    // หน่วงเวลา 10 วินาที ก่อนที่จะ reload หน้าเว็บ
    setTimeout(() => {
      location.reload()
    }, 500) // 10000 มิลลิวินาที = 10 วินาที
    loadingSaveLorryAftherMixing.value = false
    
    return true
  } else {
    textAlertDialogFunction('SAVE LORRY AFTER MIXING', false)

    loadingSaveLorryAftherMixing.value = false

    // หน่วงเวลา 10 วินาที ก่อนที่จะ reload หน้าเว็บ
    setTimeout(() => {
      location.reload()
    }, 3 * 1000) // 10000 มิลลิวินาที = 10 วินาที
    isDialogSubmitFailedVisible.value = true
    console.log('บันทึกล้มเหลว saveLorryAfterMixing')
  }
}

//--------------- Submit --------------------------------

// const trickerSubmit = ref(false)

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

        console.log('Submit successful:', submitVisibleResult)

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

const colsCOALayout = ref(0)
const colsMainContent = ref(12)

const openDialog = index => {
  // if(index >= 7 ){
  //   selectedImageIndex.value = 0 
  // } else {
  //   selectedImageIndex.value = index  // กำหนด index ของรูปที่ถูกกด
  // }
  // isDialogVisibleCOA.value = true        // เปิด dialog

  if(colsMainContent.value === 8 ){
    colsCOALayout.value = 0
    colsMainContent.value = 12
  }else{
    colsCOALayout.value = 4
    colsMainContent.value = 8
  }

  


  console.log('cols', colsCOALayout.value, selectedImageIndex.value)
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

        console.log('[*****Headers COA]]!!: ',  coaFiles.value )
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
 
import VuePdfApp from "vue3-pdf-app"

// import this to use default icons for buttons
import "vue3-pdf-app/dist/icons/main.css"

const scaleCOA = ref(1.0)

const zoomInCoA = () => {
  scaleCOA.value += 0.1
}

const zoomOutCoA = () => {
  if (scaleCOA.value > 0.5) scaleCOA.value -= 0.1
}

const onProgress = progressData => {
  console.log('Loading progress:', progressData)
}

//------------------------ vue-easy-lightbox

console.log("coa", coaFiles.value)

const lightboxImages = ref([])
const VueEasyLightBoxShow = ref(false)

const showLightbox = async item => {
  // ถ้าเป็น PDF ต้องแปลงก่อน
  lightboxImages.value = [item.fileUri]
  VueEasyLightBoxShow.value = true
}

const hideLightbox = () => {
  VueEasyLightBoxShow.value = false
}

//------------------ custom carusor


// index ของไฟล์ที่กำลังแสดง
const currentIndexCustomCarousel = ref(0)
const currentItemCustomCarousel = computed(() => coaFiles.value[currentIndexCustomCarousel.value])

// ไปหน้าก่อน
const prev = () => {
  if (currentIndexCustomCarousel.value > 0) {
    currentIndexCustomCarousel.value--
  }
}

// ไปหน้าถัดไป
const next = () => {
  if (currentIndexCustomCarousel.value < coaFiles.value.length - 1) {
    currentIndexCustomCarousel.value++
  }
}


// optional styles
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

import { pdfToImages } from './utils/pdfToImages'

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

//-------------------------------------------------  Dynamic Column Merging Based on Conditions
// ตรวจสอบว่า itemAnalytical นี้ควรแสดงหรือไม่
const shouldShowInput = (item, index) => {
  return item.typeID === 1 || item.typeID === 2 
    // eslint-disable-next-line sonarjs/no-all-duplicated-branches
    ? item.needActualValue 
      ? item.itemAnalyticals[index] && item.unit !== '' 
      : item.itemAnalyticals[index] && item.unit !== ''
    : false
}

const shouldShowRadioGroup = item => {
  return item.typeID === 1 || item.typeID === 2
}

const getLengthInput = (itemAnalyticals, length) => {

  return !(itemAnalyticals + 1)

  
}

// คำนวณจำนวน columns ที่ต้อง merge
const getColspanCount = item => {
  if (item.lorryInput || !item.needActualValue) return 1

  let count = 0
  for (let i = 0; i < 5; i++) {
    const analytical = item.itemAnalyticals[i]
    if (
      analytical &&
      item.unit !== '' &&
      item.needActualValue &&     // ต้องการ input จริง
      !item.lorryInput            // ไม่ใช่ input แบบ lorry
    ) {
      count++
    }
  }

  return count > 0 ? count : 1
}

// กำหนดสีของ input ตามเงื่อนไข
const  getInputColor = value => {
  return value && value.length <= 99 ? 'primary' : 'red'
}

// Rules กลางสำหรับ input
const inputRules = [
  v => v !== '' || !v || 'Actual value is required!',
  v => v.length <= 99 || 'Must be 100 characters or less',
]

//----------------
</script>

<template>
  <!-- header section -->
  <section v-if="!loadingGenerated1 && !loadingGenerated2">
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
              <div
                v-if="false"
                class="card-stack-container cursor-pointer"
              >
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

              <div class="d-flex justify-center">
                <VBtn
                  width="100px"
                  @click="openDialog(index)"
                >
                  <VIcon
                    size="35"
                    icon="ri-gallery-line"
                  />
                  <span>{{ coaFiles.length }}+</span>
                </VBtn>
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
  </section>
  <!-- body section -->
  <section>
    <VRow>
      <VCol
        v-if="colsCOALayout !== 0"
        :cols="colsCOALayout"
      >
        <div class="mt-8">
          <VCard
            class="mx-auto"
            max-width="600"
            height="530px"
          >
            <VCardTitle
              v-if="false"
              class="bg-primary d-flex justify-space-between align-center"
            >
              <span>COA</span>
            </VCardTitle>

            <VCardText class="pa-0">
              <VImg
                v-if="false"
                :src="srcImagCOA"
              />
              <div class="pa-0">
                <div class="d-flex justify-space-around align-center py-1 bg-primary ">
                  <VBtn
                    v-if="false"
                    icon="mdi-minus"
                    variant="text"
                    size="30px"
                    @click="model = Math.max(model - 1, 0)"
                  />
                  <VRow>
                    <VCol
                      class="d-flex justify-center align-center"
                      cols="10"
                    >
                      <span>COA {{ selectedImageIndex+1 }}</span>
                    </VCol>
                    <VCol cols="2">
                      <VBtn
                        icon
                        @click="openDialog('0')"
                      >
                        <VIcon
                          color="white"
                          icon="ri-close-large-line"
                        />
                      </VBtn>
                    </VCol>
                  </VRow>
                
                  <VBtn
                    v-if="false"
                    icon="mdi-plus"
                    size="30px"
                    variant="text"
                    @click="model = Math.min(model + 1, 4)"
                  />
                </div>
                <!--
                  <VCarousel
                  v-model="selectedImageIndex"
                  show-arrows="hover"
                  height="450px"
                  :touch="false"
                  >
                  <VCarouselItem
                  v-for="(item, i) in coaFiles"
                  :key="i"
                  :value="i"
                  cover
                  >
                  <template v-if="item.fileUri.endsWith('.pdf')">
                  <VuePdfApp
                  style="height: 1600px;"
                  :pdf="item.fileUri"
                  />
                  </template>
    
                  <template v-else>
                  <div class="zoom-wrapper">
                  <VImg
                  v-if="!VueEasyLightBoxShow"
                  :src="item.fileUri"
                  alt="Image"
                  class="zoomable"
                  @click="showLightbox(item)"
                  /> 
                     

                  <VueEasyLightbox
                  :visible="VueEasyLightBoxShow"
                  :imgs="lightboxImages"
                  @hide="hideLightbox"
                  />
                  </div>
                  </template>
                  </VCarouselItem>
                  </VCarousel> 
                -->



                <div class="relative w-full max-w-xl mx-auto">
                  <!-- แสดงภาพหรือ PDF ทีละรายการ -->
                  <div class="relative h-[450px] overflow-hidden rounded-md border">
                    <template v-if="currentItemCustomCarousel">
                      <!-- ถ้าเป็น PDF -->
                      <VuePdfApp
                        v-if="currentItemCustomCarousel.fileUri.endsWith('.pdf')"
                        :pdf="currentItemCustomCarousel.fileUri"
                        style="width: 100%; height: 400px;"
                      />
        
                      <!-- ถ้าเป็นรูป -->
                      <div
                        v-else
                        class=""
                      >
                        <VImg
                          v-if="!VueEasyLightBoxShow"
                          :src="currentItemCustomCarousel.fileUri"
                          style="width: 100%; height: 400px;"
                          alt="Image"
                          class="zoomable"
                          @click="showLightbox(currentItemCustomCarousel)"
                        /> 
                      </div>
                    </template>
                  </div>

                  

                  <!-- Lightbox สำหรับรูปภาพ -->
                  <VueEasyLightbox
                    :visible="VueEasyLightBoxShow"
                    :imgs="lightboxImages"
                    @hide="hideLightbox"
                  />
                </div>

                <!-- Lightbox เดียว แสดงตามไฟล์ที่กด -->
              </div>
            </VCardText>
            <VCardText class="py-2">
              <!-- ปุ่มควบคุม -->
              <div class="d-flex justify-space-between align-center mt-2">
                <VBtn
                  :disabled="currentIndexCustomCarousel === 0"
                  icon="ri-arrow-left-fill"
                  size="30"
                  @click="prev"
                />
                <span class="text-sm text-gray-600">
                  รูปที่ {{ currentIndexCustomCarousel + 1 }} / {{ coaFiles.length }}
                </span>
                <VBtn
                  :disabled="currentIndexCustomCarousel === coaFiles.length - 1"
                  icon="ri-arrow-right-fill"
                  size="30"
                  @click="next"
                />
              </div>
            </VCardText>
          </VCard>
        </div>
      </VCol>
      <VCol :cols="colsMainContent">
        <div>
          <!-- Raw Material Inspection Request Form -->
          <VRow class="mt-4">
            <VCol
              class=""
              cols="12"
            >
              <div style="overflow-x: auto; white-space: nowrap;">
                <table class="custom-table">
                  <!-- Header Rows (unchanged) -->
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
                      Analytical Method No.
                    </th>
                    <th
                      class="text-center"
                      rowspan="3"
                      colspan="2"
                    >
                      Specification Ranges
                    </th>
                    <th
                      class="text-center"
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
                      v-for="i in 5"
                      :key="i"
                      class="text-center"
                      colspan="1"
                    >
                      <div class="d-flex justify-center align-center">
                        <span>{{ i }} : {{ analysisItemsCode[`actualMakerLotNo_${i-1}`] }}</span>
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
                      v-for="i in 5"
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
                      v-for="i in 5"
                      :key="i"
                      class="text-center"
                      colspan="1"
                      style="min-width: 160px; max-width: 160px;"
                    >
                      <span><VIcon icon="ri-functions" />: {{ covertFloatFixedTwo(analysisItemsCode[`actualTotalQuantityKgs_${i-1}`]) }}</span>
                    </td>
                  </tr>

                  <!-- Analysis Items -->
                  <tr
                    v-for="(item, index) in analysisItems"
                    :key="index"
                  >
                    <!-- Fixed Columns -->
                    <td
                      v-if="item.typeID === 1"
                      class="text-center"
                      :class="{ 'bg-primary': !item.needActualValue, 'bg-primary': item.needActualValue }"
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

                    <!-- Dynamic Input Columns - regular without Input Button & Textarea -->
                    <template v-if="item.typeID === 1 && !item.needActualValue">
                      <td
                        v-for="i in item.itemAnalyticals.length"
                        :key="i"
                        :colspan="getColspanCount(item)"
                        class="text-center pa-0"
                      >
                        <div class="d-flex flex-wrap">
                          <div
                            v-if="shouldShowInput(item, i-1)"
                            class="pa-2"
                            style="min-width: 220px; max-width: 200px;"
                          >
                            <!-- Radio Group -->
                            <VRadioGroup
                              v-if="!item.needActualValue && item.itemAnalyticals[i-1] && item.unit !== ''"
                              v-model="item.itemAnalyticals[i-1].okState"
                              :readonly="frozeCheck"
                              :mandatory="false"
                              :rules="[v => v !== -1 || 'Actual value is required!']"
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
                            <!-- Input AfterMixxin -->
                            <div v-if="item.lorryInput">
                              <VRow>
                                <VCol
                                  cols="5"
                                  class="d-flex justify-space-between align-center py-1"
                                >
                                  <span
                                    class="text-red"
                                    style="font-size: 12px;"
                                  >Actual In Lorry </span>
                                  <span
                                    class="text-red"
                                    style="font-size: 12px;"
                                  >=</span>
                                </VCol>
                                <VCol
                                  cols="7"
                                  class="py-0"
                                >
                                  <VTextField
                                    v-model="item.itemAnalyticals[i-1].acture"
                                    density="compact"
                                    placeholder="Actual In Lorry"
                                    class="py-2"
                                    type="number"
                                    :readonly="validateDisableInoutAferMixing('Actual In Lorry')"
                                  >
                                    <template
                                      v-if="!validateDisableInoutAferMixing('Actual In Lorry')"
                                      #label
                                    >
                                      <VIcon icon="ri-edit-line" />
                                    </template>
                                  </VTextField>
                                </VCol>
                              </VRow>

                              <VRow>
                                <VCol
                                  cols="5"
                                  class="d-flex justify-space-between align-center py-1"
                                >
                                  <span
                                    class="text-red"
                                    style="font-size: 12px;"
                                  >After Mixing </span>
                                  <span
                                    class="text-red"
                                    style="font-size: 12px;"
                                  >=</span>
                                </VCol>
                                <VCol
                                  cols="7"
                                  class="py-2"
                                >
                                  <VTextField
                                    v-model="item.itemAnalyticals[i-1].afterMixing"
                                    density="compact"
                                    placeholder="After Mixing"
                                    type="number"
                                    :readonly="validateDisableInoutAferMixing('After Mixing')"
                                  >
                                    <template
                                      v-if="!validateDisableInoutAferMixing('After Mixing')"
                                      #label
                                    >
                                      <VIcon icon="ri-edit-line" />
                                    </template>
                                  </VTextField>
                                </VCol>
                              </VRow>
                            </div>

                            <!-- Error Messages -->
                            <span
                              v-if="checkOkState(item, item.typeID, i-1) && item.unit !== ''"
                              class="text-red"
                            >
                              {{ textAlertErrorOkState }}
                            </span>
                            <span
                              v-if="checkAnalysitItem(item, item.typeID, i-1) && item.unit !== '' && !item.lorryInput"
                              class="text-red"
                            >
                              {{ textAlertErrorAnalysitItem }}
                            </span>
                          </div>
                        </div>
                      </td>

                
                      <td
                        v-for="i in 5 - item.itemAnalyticals.length"
                        :key="i"
                        :colspan="getColspanCount(item)"
                        class="text-center pa-0"
                      />
                    </template>

                    <template v-else-if="item.typeID === 1 && item.needActualValue && item.lorryInput">
                      <td
                        v-for="i in item.itemAnalyticals.length"
                        :key="i"
                        :colspan="getColspanCount(item)"
                        class="text-center pa-0"
                      >
                        <div class="d-flex flex-wrap">
                          <div
                            v-if="shouldShowInput(item, i-1)"
                            class="pa-2"
                            style="min-width: 220px; max-width: 200px;"
                          >
                            <!-- Input AfterMixxin -->
                            <div v-if="item.lorryInput">
                              <VRow>
                                <VCol
                                  cols="5"
                                  class="d-flex justify-space-between align-center py-1 px-1"
                                >
                                  <span
                                    class="text-red"
                                    style="font-size: 12px;"
                                  >Actual In Lorry </span>
                                  <span
                                    class="text-red"
                                    style="font-size: 12px;"
                                  >=</span>
                                </VCol>
                                <VCol
                                  cols="7"
                                  class="py-1 px-1"
                                >
                                  <VTextField
                                    v-model="item.itemAnalyticals[i-1].acture"
                                    density="compact"
                                    class="py-2"
                                    type="number"
                                    :readonly="validateDisableInoutAferMixing('Actual In Lorry')"
                                  >
                                    <template
                                      v-if="!validateDisableInoutAferMixing('Actual In Lorry')"
                                      #label
                                    >
                                      <VIcon icon="ri-edit-line" />
                                    </template>
                                  </VTextField>
                                </VCol>
                              </VRow>

                              <VRow>
                                <VCol
                                  cols="5"
                                  class="d-flex justify-space-between align-center py-1 px-1"
                                >
                                  <span
                                    class="text-red"
                                    style="font-size: 12px;"
                                  >After Mixing </span>
                                  <span
                                    class="text-red"
                                    style="font-size: 12px;"
                                  >=</span>
                                </VCol>
                                <VCol
                                  cols="7"
                                  class="py-1 px-1"
                                >
                                  <VTextField
                                    v-model="item.itemAnalyticals[i-1].afterMixing"
                                    density="compact"
                                    type="number"
                                    :readonly="validateDisableInoutAferMixing('After Mixing')"
                                  >
                                    <template
                                      v-if="!validateDisableInoutAferMixing('After Mixing')"
                                      #label
                                    >
                                      <VIcon icon="ri-edit-line" />
                                    </template>
                                  </VTextField>
                                </VCol>
                              </VRow>
                            </div>

                            <!-- Error Messages -->
                            <span
                              v-if="checkOkState(item, item.typeID, i-1) && item.unit !== ''"
                              class="text-red"
                            >
                              {{ textAlertErrorOkState }}
                            </span>
                            <span
                              v-if="checkAnalysitItem(item, item.typeID, i-1) && item.unit !== '' && !item.lorryInput"
                              class="text-red"
                            >
                              {{ textAlertErrorAnalysitItem }}
                            </span>
                          </div>
                        </div>
                      </td>

                
                      <td
                        v-for="i in 5 - item.itemAnalyticals.length"
                        :key="i"
                        :colspan="getColspanCount(item)"
                        class="text-center"
                      />
                    </template>

              
                    <!-- Dynamic Input Columns - iregular with Input Button & Textarea -->
                    <template v-if="item.typeID === 1 && item.needActualValue && !item.lorryInput">
                      <td
                        v-for="i in 1"
                        :key="i"
                        :colspan="getColspanCount(item)"
                        class="text-center pa-0"
                      >
                        <div
                          v-if="shouldShowInput(item, i-1)"
                          class="pa-2 "
                          style="width: auto;"
                        >
                          <!-- Input Button & Textarea -->
                          <div
                            v-if="item.needActualValue && !item.lorryInput"
                            style="width: auto;"
                          >
                            <VBtn
                              width="190"
                              :prepend-icon="!frozeCheck ? 'ri-edit-line' : ''"
                              variant="outlined"
                              density="compact"
                              :color="getInputColor(item.itemAnalyticals[i-1].actualAnalysis)"
                              @click="toggleDialog(item.itemAnalyticals[i-1]?.inspReqLotJournalId)"
                            >
                              <span
                                v-if="item.itemAnalyticals[i-1].actualAnalysis"
                                class="text-truncate"
                              >
                                {{ item.itemAnalyticals[i-1].actualAnalysis }}
                              </span>
                              <span v-else>Input</span>
                            </VBtn>
                  
                            <VTextarea
                              v-if="isDialogVisibleInput[item.itemAnalyticals[i-1]?.inspReqLotJournalId]"
                              v-model="item.itemAnalyticals[i-1].actualAnalysis"
                              class="my-2"
                              rows="2"
                              auto-grow
                              :color="getInputColor(item.itemAnalyticals[i-1].actualAnalysis)"
                              :readonly="frozeCheck"
                              :rules="inputRules"
                            />
                          </div>
                          <!-- Error Messages -->
                          <span
                            v-if="checkOkState(item, item.typeID, i-1) && item.unit !== ''"
                            class="text-red"
                          >
                            {{ textAlertErrorOkState }}
                          </span>
                          <span
                            v-if="checkAnalysitItem(item, item.typeID, i-1) && item.unit !== '' && !item.lorryInput"
                            class="text-red"
                          >
                            {{ textAlertErrorAnalysitItem }}
                          </span>
                        </div>
                      </td>

                
                      <td
                        v-for="i in 5 - item.itemAnalyticals.length"
                        :key="i"
                        :colspan="1"
                        class="text-center"
                      />
                    </template>
                  </tr>

                  <!-- Reference Section -->
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

                  <!-- Analysis Items -->
                  <tr
                    v-for="(item, index) in analysisItems"
                    :key="index"
                  >
                    <!-- Fixed Columns -->
                    <td
                      v-if="item.typeID === 2"
                      class="text-center"
                      :class="{ 'bg-primary': !item.needActualValue, 'bg-primary': item.needActualValue }"
                      colspan="1"
                    >
                      <span>{{ item.sqnText }}</span>
                    </td>
                    <td
                      v-if="item.typeID === 2"
                      colspan="2"
                    >
                      <span>{{ item.analyticalItem }}</span>
                    </td>
                    <td
                      v-if="item.typeID === 2"
                      class="text-center"
                      colspan="2"
                    >
                      <span>{{ item.unit }}</span>
                    </td>
                    <td
                      v-if="item.typeID === 2"
                      class="text-center"
                      colspan="2"
                    >
                      <span>{{ item.methodCode }}</span>
                    </td>
                    <td
                      v-if="item.typeID === 2"
                      class="text-center"
                      colspan="2"
                    >
                      <span>{{ item.specRange }}</span>
                    </td>
                    <td
                      v-if="item.typeID === 2"
                      class="text-center"
                      colspan="1"
                    >
                      <span>{{ item.actualAnalysis }}</span>
                    </td>

                    <!-- Dynamic Input Columns - regular without Input Button & Textarea -->
                    <template v-if="item.typeID === 2 && !item.needActualValue">
                      <td
                        v-for="i in item.itemAnalyticals.length"
                        :key="i"
                        :colspan="getColspanCount(item)"
                        class="text-center pa-0"
                      >
                        <div class="d-flex flex-wrap">
                          <div
                            v-if="shouldShowInput(item, i-1)"
                            class="pa-2"
                            style="min-width: 220px; max-width: 200px;"
                          >
                            <!-- Radio Group -->
                            <VRadioGroup
                              v-if="!item.needActualValue && item.itemAnalyticals[i-1] && item.unit !== ''"
                              v-model="item.itemAnalyticals[i-1].okState"
                              :readonly="frozeCheck"
                              :mandatory="false"
                              :rules="[v => v !== -1 || 'Actual value is required!']"
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
                            <!-- Input AfterMixxin -->
                            <div v-if="item.lorryInput">
                              <VRow>
                                <VCol
                                  cols="5"
                                  class="d-flex justify-space-between align-center py-1"
                                >
                                  <span
                                    class="text-red"
                                    style="font-size: 12px;"
                                  >Actual In Lorry </span>
                                  <span
                                    class="text-red"
                                    style="font-size: 12px;"
                                  >=</span>
                                </VCol>
                                <VCol
                                  cols="7"
                                  class="py-0"
                                >
                                  <VTextField
                                    v-model="item.itemAnalyticals[i-1].acture"
                                    density="compact"
                                    placeholder="Actual In Lorry"
                                    class="py-2"
                                    type="number"
                                    :readonly="validateDisableInoutAferMixing('Actual In Lorry')"
                                  >
                                    <template
                                      v-if="!validateDisableInoutAferMixing('Actual In Lorry')"
                                      #label
                                    >
                                      <VIcon icon="ri-edit-line" />
                                    </template>
                                  </VTextField>
                                </VCol>
                              </VRow>

                              <VRow>
                                <VCol
                                  cols="5"
                                  class="d-flex justify-space-between align-center py-1"
                                >
                                  <span
                                    class="text-red"
                                    style="font-size: 12px;"
                                  >After Mixing </span>
                                  <span
                                    class="text-red"
                                    style="font-size: 12px;"
                                  >=</span>
                                </VCol>
                                <VCol
                                  cols="7"
                                  class="py-2"
                                >
                                  <VTextField
                                    v-model="item.itemAnalyticals[i-1].afterMixing"
                                    density="compact"
                                    placeholder="After Mixing"
                                    type="number"
                                    :readonly="validateDisableInoutAferMixing('After Mixing')"
                                  >
                                    <template
                                      v-if="!validateDisableInoutAferMixing('After Mixing')"
                                      #label
                                    >
                                      <VIcon icon="ri-edit-line" />
                                    </template>
                                  </VTextField>
                                </VCol>
                              </VRow>
                            </div>

                            <!-- Error Messages -->
                            <span
                              v-if="checkOkState(item, item.typeID, i-1) && item.unit !== ''"
                              class="text-red"
                            >
                              {{ textAlertErrorOkState }}
                            </span>
                            <span
                              v-if="checkAnalysitItem(item, item.typeID, i-1) && item.unit !== '' && !item.lorryInput"
                              class="text-red"
                            >
                              {{ textAlertErrorAnalysitItem }}
                            </span>
                          </div>
                        </div>
                      </td>
                
                      <td
                        v-for="i in 5 - item.itemAnalyticals.length"
                        :key="i"
                        :colspan="getColspanCount(item)"
                        class="text-center"
                      />
                    </template>

                    <template v-else-if="item.typeID === 2 && item.needActualValue && item.lorryInput">
                      <td
                        v-for="i in item.itemAnalyticals.length"
                        :key="i"
                        :colspan="getColspanCount(item)"
                        class="text-center pa-0"
                      >
                        <div class="d-flex flex-wrap">
                          <div
                            v-if="shouldShowInput(item, i-1)"
                            class="pa-2"
                            style="min-width: 220px; max-width: 200px;"
                          >
                            <!-- Input AfterMixxin -->
                            <div v-if="item.lorryInput">
                              <VRow>
                                <VCol
                                  cols="5"
                                  class="d-flex justify-space-between align-center py-1 px-1"
                                >
                                  <span
                                    class="text-red"
                                    style="font-size: 12px;"
                                  >Actual In Lorry </span>
                                  <span
                                    class="text-red"
                                    style="font-size: 12px;"
                                  >=</span>
                                </VCol>
                                <VCol
                                  cols="7"
                                  class="py-1 px-1"
                                >
                                  <VTextField
                                    v-model="item.itemAnalyticals[i-1].acture"
                                    density="compact"
                                    placeholder="Actual In Lorry"
                                    class="py-2"
                                    type="number"
                                    :readonly="validateDisableInoutAferMixing('Actual In Lorry')"
                                  >
                                    <template
                                      v-if="!validateDisableInoutAferMixing('Actual In Lorry')"
                                      #label
                                    >
                                      <VIcon icon="ri-edit-line" />
                                    </template>
                                  </VTextField>
                                </VCol>
                              </VRow>

                              <VRow>
                                <VCol
                                  cols="5"
                                  class="d-flex justify-space-between align-center py-1 px-1"
                                >
                                  <span
                                    class="text-red"
                                    style="font-size: 12px;"
                                  >After Mixing </span>
                                  <span
                                    class="text-red"
                                    style="font-size: 12px;"
                                  >=</span>
                                </VCol>
                                <VCol
                                  cols="7"
                                  class="py-1 px-1"
                                >
                                  <VTextField
                                    v-model="item.itemAnalyticals[i-1].afterMixing"
                                    density="compact"
                                    placeholder="After Mixing"
                                    type="number"
                                    :readonly="validateDisableInoutAferMixing('After Mixing')"
                                  >
                                    <template
                                      v-if="!validateDisableInoutAferMixing('After Mixing')"
                                      #label
                                    >
                                      <VIcon icon="ri-edit-line" />
                                    </template>
                                  </VTextField>
                                </VCol>
                              </VRow>
                            </div>

                            <!-- Error Messages -->
                            <span
                              v-if="checkOkState(item, item.typeID, i-1) && item.unit !== ''"
                              class="text-red"
                            >
                              {{ textAlertErrorOkState }}
                            </span>
                            <span
                              v-if="checkAnalysitItem(item, item.typeID, i-1) && item.unit !== '' && !item.lorryInput"
                              class="text-red"
                            >
                              {{ textAlertErrorAnalysitItem }}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td
                        v-for="i in 5 - item.itemAnalyticals.length"
                        :key="i"
                        :colspan="getColspanCount(item)"
                        class="text-center"
                      />
                    </template>
                    <!-- Dynamic Input Columns - iregular with Input Button & Textarea -->
                    <template v-if="item.typeID === 2 && item.needActualValue && !item.lorryInput">
                      <td
                        v-for="i in 1"
                        :key="i"
                        :colspan="getColspanCount(item)"
                        class="text-center pa-0"
                      >
                        <div
                          v-if="shouldShowInput(item, i-1)"
                          class="pa-2 "
                          style="width: auto;"
                        >
                          <!-- Input Button & Textarea -->
                          <div
                            v-if="item.needActualValue && !item.lorryInput"
                            style="width: auto;"
                          >
                            <VBtn
                              width="190"
                              :prepend-icon="!frozeCheck ? 'ri-edit-line' : ''"
                              variant="outlined"
                              density="compact"
                              :color="getInputColor(item.itemAnalyticals[i-1].actualAnalysis)"
                              @click="toggleDialog(item.itemAnalyticals[i-1]?.inspReqLotJournalId)"
                            >
                              <span
                                v-if="item.itemAnalyticals[i-1].actualAnalysis"
                                class="text-truncate"
                              >
                                {{ item.itemAnalyticals[i-1].actualAnalysis }}
                              </span>
                              <span v-else>Input</span>
                            </VBtn>
                  
                            <VTextarea
                              v-if="isDialogVisibleInput[item.itemAnalyticals[i-1]?.inspReqLotJournalId]"
                              v-model="item.itemAnalyticals[i-1].actualAnalysis"
                              class="my-2"
                              rows="2"
                              auto-grow
                              :color="getInputColor(item.itemAnalyticals[i-1].actualAnalysis)"
                              :readonly="frozeCheck"
                              :rules="inputRules"
                            />
                          </div>
                          <!-- Error Messages -->
                          <span
                            v-if="checkOkState(item, item.typeID, i-1) && item.unit !== ''"
                            class="text-red"
                          >
                            {{ textAlertErrorOkState }}
                          </span>
                          <span
                            v-if="checkAnalysitItem(item, item.typeID, i-1) && item.unit !== '' && !item.lorryInput"
                            class="text-red"
                          >
                            {{ textAlertErrorAnalysitItem }}
                          </span>
                        </div>
                      </td>
                      <!--
                        <td
                        v-for="i in 5 - item.itemAnalyticals.length"
                        :key="i"
                        :colspan="getColspanCount(item)"
                        class="text-center"
                        /> 
                      -->
                    </template>
                  </tr>

            

                  <!-- Footer Note -->
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
        </div>
      </VCol>
    </VRow>
  </section>
  <!-- footer section -->
  <section v-if="!loadingGenerated1 && !loadingGenerated2">
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
        <VCol
          cols="6"
          class="d-flex align-center"
        >
          Note
        </VCol>
        <VCol
          cols="6 "
          class="px-0 d-flex align-center"
        >
          <VRow>
            <VCol
              cols="6"
              class="d-flex align-center"
            >
              Details of Limitation Condition
            </VCol>
            <VCol cols="6">
              <VCheckbox
                v-model="headerInsp.spacialCase"
                :readonly="frozeCheckNotDetialCheck"
                style="font-size: 12px;"
              >
                <template #label>
                  <span style="font-size: 12px;">Special case</span>
                </template>
              </vcheckbox>
            </VCol>
          </VRow>
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
            v-if="headerInsp.isAccept"
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
            v-if="headerInsp.isReject"
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
                style="min-width: 150px;  height: 35px;"
                colspan="3"
              >
                <div v-if="headerInsp.lastUpdatedStaffWH">
                  <span>{{ formatDate(headerInsp.lastUpdatedStaffWH) }}</span>
                </div>
              </td>
              <td
                style="min-width: 150px;  height: 35px;"
                colspan="3"
              >
                <div v-if="headerInsp.lastUpdatedSuperWH">
                  <span>{{ formatDate(headerInsp.lastUpdatedSuperWH) }}</span>
                </div>
              </td>
              <td
                style="min-width: 150px;  height: 35px;"
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
          v-if="canVisibleUserPermission(statusPermission,'BTN_SAVE_DRAFT').canVisible"
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
      v-if="statusId === 13 && checkTypeIdLorry() || statusId === 14 && checkTypeIdLorry()"
      cols="12"
      class="my-4"
    >
      <div class="d-flex justify-end">
        <VBtn
          v-if="canVisibleUserPermission(statusPermission,'BTN_INSP_APVL_ACCEPT\r\n').canVisible"
          class="mx-4"
          color="warning"
          style="font-size: 12px;"
          @click="saveLorryAfterMixing"
        >
          SAVE Lorry After Mixing
          <VProgressCircular
            v-if="loadingSaveLorryAftherMixing"
            :size="30"
            width="3"
            color="primary"
            indeterminate
          />
        </VBtn>
      </div>
    </section>

    <section
      v-if="statusId === 13 || statusId === 14"
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
  </section>
</template>

<style scoped src="./insp.scss"></style>
