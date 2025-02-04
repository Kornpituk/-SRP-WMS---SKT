<script setup>
import { onMounted, ref, watch } from "vue"

import iconMock1 from '@images/icons/Group 1000004801.png'
import iconMock2 from '@images/icons/Group 1000004802.png'
import iconMock3 from '@images/icons/Icon.png'


import { urlApi } from '@/api'  //---------------------- Import Api for Url *****
import { VDataTable } from 'vuetify/labs/VDataTable'

const whereHouse = localStorage.getItem('whereHouseName')
const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')

import { useCookieStore, useItemStore } from '@/stores/skt/receingFormStore/itemStore'

const itemStore = useItemStore()



//------------------------------------ params section -------------------------------
import { useRoute } from 'vue-router'

const route = useRoute()

const dataProductRow = ref(JSON.parse(sessionStorage.getItem("productDataSession")))

const journalIdModel = ref(dataProductRow.value.journalID)
const itemCodeModel = ref(dataProductRow.value.itemCode)
const SoEtlLogDetailJournalIDModel = ref(dataProductRow.value.soEtlLogDetailJournalID)
const salesOrderNoModel = ref(dataProductRow.value.salesOrderNo)
const checkSheetTypeNameModel = ref(dataProductRow.value.checkSheetTypeName)
const statusModel = ref(dataProductRow.value.csLfStatusId)

console.log('journalIdModel', dataProductRow.value.journalID)

//------------------------------- alert --------------------------------------------

import AlertWord2 from '@/components/dialogs/alert/alertDialog2.vue'
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

//------------------------------------- date time

function getCurrentDate() {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  
  return `${day}/${month}/${year}`
}

//------------------------------------ import service --------------------------------

import { useGenerateFormService, useGetShippingCheckSheetService,
  useGetShippingChecksheetImageService, useShippingCheckSheetService,
  useSubmitCheckSheetService, useGetShippingCheckSheetFileIconService,
} from '@/services/skt/shipmentPlan/checkSheetServices'

//------------------------------------ generate section ----------------------

//------------------------------------ Get ShippingCheckSheet Icon  ----------------------

const { getShippingCheckSheetFileResult,
  errorGetShippingCheckSheetFile,
  fetchShippingCheckSheetFile } = useGetShippingCheckSheetFileIconService()

const handleShippingFileIcon = async (type, userCode, itemCode, fileName) => {
  try {
    const result = await fetchShippingCheckSheetFile(
      urlApi.value, type, whereHouse, 
      accessTokenAtStore, SoEtlLogDetailJournalIDModel.value,
      userCode, itemCode, fileName,
    )

    if(result){
      getShippingCheckSheetFileResult.value = result
      console.log('getShippingCheckSheetFileResult', result)
    }else{
      console.log('errorGetShippingCheckSheetFile !result ', errorGetShippingCheckSheetFile.value)
    }
  }catch (e) {
    console.log('errorGetShippingCheckSheetFileIcon', e)
  }
}

onMounted( () => {
  // handleShippingFileIcon('GetSpecialConditionIcon', dataProductRow.value.shippingUserCode, )
})

//------------------------------------ Get ShippingCheckSheet  ----------------------

import { GBSmockDataIm, specialRequestsIm,
  validateAfterPickingIm, resaleProductShippingIm,
} from './GBSMockData'


const GBSMockData = ref(GBSmockDataIm)

const reportModel = ref()

const { getShippingCheckSheetResult, errorGetShippingCheckSheet, fetchShippingCheckSheet } = useGetShippingCheckSheetService()

const specialRequests = ref()

// eslint-disable-next-line sonarjs/cognitive-complexity
const getShippingCheckSheet = async () => {
  try {
    const result = await fetchShippingCheckSheet(urlApi.value, 'ShippingCheckSheet', whereHouse, accessTokenAtStore, SoEtlLogDetailJournalIDModel.value)
    if(result){
      getShippingCheckSheetResult.value = result

      specialRequests.value = result

      if(getShippingCheckSheetResult.value){
        reportModel.value = getShippingCheckSheetResult.value.reportCheckSheet 
      }

      if (reportModel.value) {
        const { 
          labalChinese,
          labalEnglish, 
          labalJapanese, 
          labalKorean,
          labalMalaysia, 
          labalThai, 
          sds,
        } = reportModel.value

        const languages = []

        if (labalChinese) languages.push('Chinese')
        if (labalEnglish) languages.push('English')
        if (labalJapanese) languages.push('Japanese')
        if (labalKorean) languages.push('Korean')
        if (labalMalaysia) languages.push('Korean')
        if (labalThai) languages.push('Thai')
        if (sds) languages.push('Thai')

        selectedLanguage.value = languages

        console.log('reportModel.value?.reportCheckSheet 1', labalChinese)
      }

      

      errorGetShippingCheckSheet.value = null
      console.log('getShippingCheckSheetResult', result)
    }else{
      console.log('errorGetShippingCheckSheet !result ', errorGetShippingCheckSheet.value)
    }
  } catch (error) {
    errorGetShippingCheckSheet.value = error.message
  }
}

const tableData = ref({
  No: [],
  ibcNo: [],
  grossWeightBeforeShipping: [],

  rustFree: [],
  noDentOrDeform: [],
  strongBaseSupport: [],

  labelNotTorn: [],
  correctLotNo: [],
  correctWeight: [],
  correctLabelPosition: [],

  noTopVentHole: [],
  capNoLeakAfterOpening: [],
  correctCapSize: [],

  goodCapCondition: [],
  topSealTight: [],
  bottomValveSealTight: [],
})

// ✅ ใช้ computed property แทน v-if ใน v-for
// 📝 แปล key ภาษาอังกฤษเป็นภาษาไทย
const translatedKeys = {
  rustFree: "1. ไม่เป็นสนิม",
  noDentOrDeform: "-ไม่บุบ ไม่เสียรูปทรง",
  strongBaseSupport: "-ฐานรองรับแข็งแรง",
  labelNotTorn: "2.Label ไม่ฉีกขาด",
  correctLotNo: "- Lot No.ถูกต้อง",
  correctWeight: "- น้ำหนักถูกต้อง",
  correctLabelPosition: "- ตำแหน่ง Lable ถูกต้อง (อยู่ตรงกลาง)",
  noTopVentHole: "3.ฝาปิดด้านบนไม่มีรูระบายอากาศ/น้ำไม่เข้า",
  capNoLeakAfterOpening: "- Check Leak ที่ CAPเปิดแล้วไม่รั่วแล้วปิดให้แน่น",
  correctCapSize: "- ฝาเกลียวที่ใช้ขนาดถูกต้อง",
  goodCapCondition: "- สภาพฝาที่ใช้ปิด ป้องกันการรั่วได้ดี",
  topSealTight: "4.มีการ Seal ที่ฝาด้านบน แน่นเรียบร้อย",
  bottomValveSealTight: "5.มีการ Seal ที่วาล์วด้านล่างแน่นเรียบร้อย ไม่รั่วซึม",
}

// ✅ เฉพาะ key ที่เป็น checkbox
const checkboxKeys = [
  'rustFree',
  'noDentOrDeform',
  'strongBaseSupport',
  'labelNotTorn',
  'correctLotNo',
  'correctWeight',
  'correctLabelPosition',
  'noTopVentHole',
  'capNoLeakAfterOpening',
  'correctCapSize',
  'goodCapCondition',
  'topSealTight',
  'bottomValveSealTight',
]

// ✅ ใช้ computed property เพื่อกรองเฉพาะข้อมูลที่ต้องการแสดงใน <tbody>
const filteredTableData = computed(() => {
  const { No, ibcNo, grossWeightBeforeShipping, ...filteredData } = tableData.value
  
  return filteredData
})

onMounted(async () => {
  await getShippingCheckSheet()

  getShippingCheckSheetResult.value?.unfIbc.forEach(item => {
    tableData.value.No.push(item.ibcIndex)
    tableData.value.ibcNo.push(item.ibcNo || 'N/A')
    tableData.value.grossWeightBeforeShipping.push(item.grossWeightBeforeShipping || 'N/A')

    // ✅ ใช้ Boolean (`true` / `false`) แทน `Yes` / `No`
    tableData.value.rustFree.push(!!item.rustFree)
    tableData.value.noDentOrDeform.push(!!item.noDentOrDeform)
    tableData.value.strongBaseSupport.push(!!item.strongBaseSupport)

    tableData.value.labelNotTorn.push(!!item.labelNotTorn)
    tableData.value.correctLotNo.push(!!item.correctLotNo)
    tableData.value.correctWeight.push(!!item.correctWeight)
    tableData.value.correctLabelPosition.push(!!item.correctLabelPosition)

    tableData.value.noTopVentHole.push(!!item.noTopVentHole)
    tableData.value.capNoLeakAfterOpening.push(!!item.capNoLeakAfterOpening)
    tableData.value.correctCapSize.push(!!item.correctCapSize)

    tableData.value.goodCapCondition.push(!!item.goodCapCondition)
    tableData.value.topSealTight.push(!!item.topSealTight)
    tableData.value.bottomValveSealTight.push(!!item.bottomValveSealTight)
  })

  console.log(tableData.value)
})


//------------------------------------- Save Draft ---------------------------------------

const { saveShippingCheckSheetResult,
  errorSaveShippingCheckSheet,
  saveShippingCheckSheet } = useShippingCheckSheetService()

const payLoad = ref([{
  "checkSheetItems": [
    {
      "soEtlLogDetailJournalID": 0,
      "supplierLotNo": "string",
      "appearanceCheck": true,
      "remark": "string",
    },
  ],
  "specialRequestChecks": [
    {
      "soEtlLogDetailJournalID": 0,
      "checkedValue": true,
    },
  ],
  "itemChecks": [
    {
      "soEtlLogDetailJournalID": 0,
      "checkedValue": true,
    },
  ],
  "packagingChecks": [
    {
      "soEtlLogDetailJournalID": 0,
      "checkedValue": true,
    },
  ],
  "unfIbc": [
    {
      "soEtlLogDetailJournalID": 0,
      "ibcIndex": 0,
      "ibcNo": "string",
      "grossWeightBeforeShipping": "string",
      "rustFree": true,
      "noDents": true,
      "baseStrong": true,
      "labelIntact": true,
      "correctLotNo": true,
      "accurateWeight": true,
      "centeredLabel": true,
      "capSeal": true,
      "noLeakAtCap": true,
      "properCapSize": true,
      "capCondition": true,
      "topSeal": true,
      "bottomSeal": true,
    },
  ],
}])

const appearanceCheckTrue = ref(true)
const checkThePackagingCheckTrue = ref(true)

const mapShippingCheckSheetData = data => {
  console.log('mapShippingCheckSheetData', data.reportCheckSheet)
  
  return {
    checkSheetItems: data.checkSheetItems.map(item => ({
      journalID: item.journalID,
      soEtlLogDetailJournalID: item.soEtlLogDetailJournalID,
      supplierLotNo: item.supplierLotNo, // ค่า default เป็น true หรือกำหนดจากข้อมูลที่ได้
      appearanceCheck: item.appearanceCheck,
      remark: item.remark,
    })), // ไม่มีข้อมูลใน getShippingCheckSheetResult
    specialRequestChecks: data.specialRequestChecks.map(item => ({
      journalID: item.journalID,
      soEtlLogDetailJournalID: item.soEtlLogDetailJournalID,
      checkedValue: item.checkedValue, // ค่า default เป็น true หรือกำหนดจากข้อมูลที่ได้
    })),
    itemChecks: data.itemChecks.map(item => ({
      journalID: item.journalID,
      soEtlLogDetailJournalID: item.soEtlLogDetailJournalID,
      checkedValue: item.checkedValue,
    })),
    packagingChecks: data.packagingChecks.map(item => ({
      journalID: item.journalID,
      soEtlLogDetailJournalID: item.soEtlLogDetailJournalID,
      checkedValue: item.checkedValue,
    })),
    unfIbc: data.unfIbc.map(item => ({
      journalID: item.journalID,
      soEtlLogDetailJournalID: item.soEtlLogDetailJournalID,
      ibcIndex: item.ibcIndex,
      ibcNo: item.ibcNo || "", // ถ้า ibcNo เป็น null ให้ใช้ค่าว่าง
      grossWeightBeforeShipping: "", // ค่าเริ่มต้น เนื่องจากไม่มีข้อมูลจาก getShippingCheckSheetResult
      rustFree: item.rustFree || false,
      noDents: item.noDents || false,
      baseStrong: item.baseStrong || false,
      labelIntact: item.labelIntact || false,
      correctLotNo: item.correctLotNo || false,
      accurateWeight: item.accurateWeight || false,
      centeredLabel: item.centeredLabel || false,
      capSeal: item.capSeal || false,
      noLeakAtCap: item.noLeakAtCap || false,
      properCapSize: item.properCapSize || false,
      capCondition: item.capCondition || false,
      topSeal: item.topSeal || false,
      bottomSeal: item.bottomSeal || false,
    })),

    reportCheckSheet: data.reportCheckSheet 
      ? {
        soEtlLogDetailJournalID: data.reportCheckSheet.soEtlLogDetailJournalID,
        labalThai: data.reportCheckSheet.labalThai,
        labalEnglish: data.reportCheckSheet.labalEnglish,
        labalJapanese: data.reportCheckSheet.labalJapanese,
        labalChinese: data.reportCheckSheet.labalChinese,
        labalMalaysia: data.reportCheckSheet.labalMalaysia,
        labalKorean: data.reportCheckSheet.labalKorean,
        sds: data.reportCheckSheet.sds,
      }
      : [],

   
  }

  
}

const updateShippingCheckSheetData = async ()  => {
  // ตรวจสอบว่า getShippingCheckSheetResult.value?.unfIbc มีข้อมูลหรือไม่
  if (getShippingCheckSheetResult.value?.unfIbc) {
    getShippingCheckSheetResult.value.unfIbc = tableData.value.No.map((_, index) => ({
      journalID: getShippingCheckSheetResult.value.unfIbc[index].journalID, // ใช้ journalID เดิมจาก unfIbc
      soEtlLogDetailJournalID: getShippingCheckSheetResult.value.unfIbc[index].soEtlLogDetailJournalID, // ใช้ soEtlLogDetailJournalID เดิม
      ibcIndex: tableData.value.No[index], // เอาข้อมูลจาก tableData.value
      ibcNo: tableData.value.ibcNo[index] === 'N/A' ? null : tableData.value.ibcNo[index], // เปลี่ยน 'N/A' กลับเป็น null ถ้าต้องการ
      grossWeightBeforeShipping: tableData.value.grossWeightBeforeShipping[index] === 'N/A' ? null : tableData.value.grossWeightBeforeShipping[index],
      rustFree: tableData.value.rustFree[index], // Boolean
      noDentOrDeform: tableData.value.noDentOrDeform[index], // Boolean
      strongBaseSupport: tableData.value.strongBaseSupport[index], // Boolean
      labelNotTorn: tableData.value.labelNotTorn[index], // Boolean
      correctLotNo: tableData.value.correctLotNo[index], // Boolean
      correctWeight: tableData.value.correctWeight[index], // Boolean
      correctLabelPosition: tableData.value.correctLabelPosition[index], // Boolean
      noTopVentHole: tableData.value.noTopVentHole[index], // Boolean
      capNoLeakAfterOpening: tableData.value.capNoLeakAfterOpening[index], // Boolean
      correctCapSize: tableData.value.correctCapSize[index], // Boolean
      goodCapCondition: tableData.value.goodCapCondition[index], // Boolean
      topSealTight: tableData.value.topSealTight[index], // Boolean
      bottomValveSealTight: tableData.value.bottomValveSealTight[index], // Boolean
    }))
  }

  if (getShippingCheckSheetResult.value?.reportCheckSheet) {
    console.log('reportCheckSheet start update .....')

    const selectedLanguages = selectedLanguage.value || [] // เอาข้อมูลจาก selectedLanguage.value
    const reportCheckSheet = getShippingCheckSheetResult.value.reportCheckSheet
    if(selectedLanguage.value){
      getShippingCheckSheetResult.value.reportCheckSheet = {
        soEtlLogDetailJournalID: getShippingCheckSheetResult.value.reportCheckSheet.soEtlLogDetailJournalID,
        labalThai: selectedLanguages.includes('Thai'),
        labalEnglish: selectedLanguages.includes('English'),
        labalJapanese: selectedLanguages.includes('Japanese'),
        labalChinese: selectedLanguages.includes('Chinese'),
        labalMalaysia: selectedLanguages.includes('Malay'),
        labalKorean: selectedLanguages.includes('Korean'),
        sds: selectedLanguages.includes('SDS'), // ถ้า SDS เป็นภาษาให้ใช้ ถ้าไม่ใช่ให้เอาออก
      }
    }

    console.log('reportCheckSheet start update .....', getShippingCheckSheetResult.value?.reportCheckSheet)
  }
}

const habdleSaveDraft = async () => {

  // อัพเดตข้อมูลใน getShippingCheckSheetResult.value?.unfIbc ก่อน
  await updateShippingCheckSheetData()
  

  console.log('getShippingCheckSheetResult.value update', getShippingCheckSheetResult.value)

  // ส่งข้อมูลที่อัพเดตไปบันทึก
  const requestData = mapShippingCheckSheetData(getShippingCheckSheetResult.value)

  console.log("requestData", requestData)

  try {
    const result = await saveShippingCheckSheet(
      urlApi.value, 'save', whereHouse, 
      accessTokenAtStore, requestData)

    if(saveShippingCheckSheetResult.value){
      console.log("requestData 2")
      saveShippingCheckSheetResult.value = result
      console.log("requestData 3")
      console.log('saveShippingCheckSheetResult', result)
      textAlertDialogFunction(alertWordConst.saveDraft, true)
      console.log("requestData 4")
      setTimeout(() => {
        // location.reload()
      }, 500) // 0.5 วินาที
    }else{
      console.log('errorSaveShippingCheckSheet !result ', errorSaveShippingCheckSheet.value)
      textAlertDialogFunction(alertWordConst.saveDraft, false)
      setTimeout(() => {
        // location.reload()
      }, 500) // 0.5 วินาที
    }
  } catch (error) {
    errorSaveShippingCheckSheet.value = error.message
  }
}

//------------------------------------ Submit ---------------------------------------
const { submitCheckSheetResult,
  submitCheckSheetError,
  submitCheckSheetFunction } = useSubmitCheckSheetService()

const handleSubmit = () => {
  try {
    console.log("requestData 1")

    const result = submitCheckSheetFunction(urlApi.value, 'submit', whereHouse, 
      accessTokenAtStore, SoEtlLogDetailJournalIDModel.value)

    console.log("requestData 2")
    if(submitCheckSheetResult.value){
      submitCheckSheetResult.value = result
      submitCheckSheetError.value = null
      console.log('submitCheckSheetResult', result)
      textAlertDialogFunction(alertWordConst.submit, true)
      console.log("requestData 4")
      setTimeout(() => {
        // location.reload()
      }, 500) // 0.5 วินาที
    }else{
      console.log('submitCheckSheetError !result ', submitCheckSheetError.value)
      textAlertDialogFunction(alertWordConst.submit, false)
      console.log("requestData 4")
      setTimeout(() => {
        // location.reload()
      }, 500) // 0.5 วินาที
    }
  } catch (error) {
    submitCheckSheetError.value = error.message
  }
}

// --- Dialog Text Area --------------------------------

import TextAreaDialog from '@/components/dialogs/alert/textAreaDialog.vue' //--------- import component

const dialogVisible = ref(false)
const typeDialogTextArea = ref('')
const indexDataDialogTextArea = ref('')
const dialogDataTextArea = ref('')
const titleDialogView = ref('')

// ฟังก์ชันสำหรับเปิด dialog
const textAreaDialogActive = (type, data, index) => {
  typeDialogTextArea.value = type
  indexDataDialogTextArea.value = index
  titleDialogView.value = 'Remark'
  dialogDataTextArea.value = data // ตั้งค่า dialogDataTextArea ด้วยค่า data
  // dialogVisible.value = true
  isDialogAreaVisible.value = true

  
}

const saveRemark = () => {
  // ค้นหาและอัปเดตค่า remark ใน checkSheetItems
  getShippingCheckSheetResult.value.checkSheetItems.forEach(item => {
    if (item.journalID ===  indexDataDialogTextArea.value) {
      item.remark = dialogDataTextArea.value
      console.log("item.remark", item.remark, 'data', dialogDataTextArea.value)
    }
  })
  isDialogAreaVisible.value = false
}

const isDialogAreaVisible = ref(false)

//-------------------------- for mat -------------- 
const formatNumber = value => {
  if (value !== null && value !== undefined) {
    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return '0.00'
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0") // เดือนเริ่มจาก 0
  const year = date.getFullYear()
  
  return `${day}/${month}/${year}`
}

const iconMock = [
  { iconName: 'icon1', src: iconMock1 },
  { iconName: 'icon2', src: iconMock2 },
  { iconName: 'icon3', src: iconMock3 },
]

//------------------------------ Section Image 
//------------------------------ Picture Label	

const { getShippingChecksheetImageResult,
  errorGetShippingChecksheetImage,
  fetchShippingChecksheetImage } = useGetShippingChecksheetImageService()

const pictureLabel = ref(`https://sktdevwebapi.easetrackwms.com/api/v1/ShippingFile/ShippingChecksheetImage/${itemCodeModel.value}/Label.png`)
const picturePackaging = ref(`https://sktdevwebapi.easetrackwms.com/api/v1/ShippingFile/ShippingChecksheetImage/${itemCodeModel.value}/Packaging.png`)

const fetchPicture = type => {
  try{
    const result = fetchShippingChecksheetImage(urlApi.value, 
      'ShippingChecksheetImage', whereHouse, accessTokenAtStore, 
      itemCodeModel.value, type)

    if(result){
      getShippingChecksheetImageResult.value = result
      errorGetShippingChecksheetImage.value = null
      console.log('getShippingChecksheetImageResult', result)
      
      return result
    }else{
      console.log('errorGetShippingChecksheetImage !result ', errorGetShippingChecksheetImage.value)
    }
  } catch (error) {
    errorGetShippingChecksheetImage.value = error.message
  }
}

// watch(async () => {
//   pictureLabel.value = await fetchPicture('Label.png')
//   picturePackaging.value = await fetchPicture('Packaging.png')
// })

import image01 from '@/views/skt/shipping/image/01.png'
import image02 from '@/views/skt/shipping/image/02.png'



import image03 from '@/views/skt/shipping/image/03.png'
import image04 from '@/views/skt/shipping/image/04.png'

const selectedLanguage = ref([])


const addItemsLang = item => {
  const index = selectedLanguage.value.indexOf(item)
  if (index === -1) {
    selectedLanguage.value.push(item)
  } else {
    selectedLanguage.value.splice(index, 1)
  }
  console.log('Log Lang Add', selectedLanguage.value)
}

const validateAfterPicking = ref(validateAfterPickingIm)
const resaleProductShipping = ref(resaleProductShippingIm)

const currentData = ref({
  no: GBSMockData.value.No1,
  ubc: GBSMockData.value.ubc1,
  gbs: GBSMockData.value.GBS1,
  rows: GBSMockData.value.rows1,
})

const currentDataIndex = ref(1) // ใช้สำหรับเก็บหมายเลขชุดข้อมูลปัจจุบัน

function switchData(set) {
  currentData.value.no = GBSMockData.value[`No${set}`]
  currentData.value.ubc = GBSMockData.value[`ubc${set}`]
  currentData.value.gbs = GBSMockData.value[`GBS${set}`]
  currentData.value.rows = GBSMockData.value[`rows${set}`]
}

// ฟังก์ชัน switchData ที่เปลี่ยนชุดข้อมูล
const switchDataSet = index => {
  if (index >= 1 && index <= 3) {
    currentDataIndex.value = index

    currentData.value.no = GBSMockData.value[`No${index}`]
    currentData.value.ubc = GBSMockData.value[`ubc${index}`]
    currentData.value.gbs = GBSMockData.value[`GBS${index}`]
    currentData.value.rows = GBSMockData.value[`rows${index}`]
  }
}

//--------------------------------------- Pagination ----------------------------------------------

const currentPage = ref(1)  // หน้าที่กำลังแสดง
const rowsPerPage = 5       // จำนวนแถวที่จะแสดงในแต่ละหน้า
const totalRows = computed(() => Object.values(GBSMockData.value.rows1).flat().length)  // จำนวนแถวทั้งหมด

const displayedRows = computed(() => {
  const startIndex = (currentPage.value - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  
  return Object.values(GBSMockData.value.rows1).flat().slice(startIndex, endIndex)
})

const labelImages = ref([])

// Watch for changes in labelImages and clean up old URLs
watch(labelImages, newFiles => {
  newFiles.forEach((file, index) => {
    // ตรวจสอบก่อนว่าจะสร้าง Blob URL ใหม่หรือไม่
    if (file instanceof File) {
      // ลบ Blob URL เก่าออกหากมี
      if (labelImages.value[index].src) {
        URL.revokeObjectURL(labelImages.value[index].src)
      }

      // สร้าง Blob URL ใหม่
      labelImages.value[index] = {
        name: file.name,
        size: (file.size / 1024), // Size in KB
        src: URL.createObjectURL(file),
      }
    }
  })
}, { deep: true })

// ฟังก์ชันลบไฟล์
function removeFileLabel(index) {
  // ลบไฟล์ออกจาก `label` โดยใช้ index
  labelImages.value.splice(index, 1)
}

const removeFilesInLabel = index => {
  labelImages.value = []
}

const seeLabelItems = () => {
  console.log(labelImages.value)
}

// ติดตามการเปลี่ยนแปลงของไฟล์ที่เลือก
// watch(() => specialRequests.value[0].label, newFiles => {
//   // ทำความสะอาด URL เก่า
//   newFiles.forEach(file => {
//     if (file.imagePreview) {
//       URL.revokeObjectURL(file.imagePreview)
//     }
//   })

//   // สร้าง URL ใหม่
//   specialRequests.value[0].label = newFiles.map(file => {
//     const fileURL = file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    
//     return {
//       ...file,
//       imagePreview: fileURL,
//     }
//   })
// }, { deep: true })



//------------------- Funtions Muti File Inpur Imge ------------------------

const fileMuti = ref([])
const files = ref([])
const isDialogVisibleImgFileMuti = ref(false)

const imgDialog = ref('')
const imgNameDialog = ref('')

const showDialogImageMuti = img => {
  isDialogVisibleImgFileMuti.value = true
  imgDialog.value = img

  // imgNameDialog.value = name
  console.log("showDialogImageMuti!", img, isDialogVisibleImgFileMuti.value)
}

resaleProductShipping.value.forEach(truck => {
  watch(() => truck.files, newFiles => {
    // Clean up the old URLs if they exist
    truck.files.forEach(file => {
      if (file.pdfPreview) {
        URL.revokeObjectURL(file.pdfPreview)
      }
      if (file.imagePreview) {
        URL.revokeObjectURL(file.imagePreview)
      }
    })

    if (newFiles && newFiles.length > 0) {
      newFiles.forEach((file, index) => {
        const fileType = file.type
        const fileName = file.name

        if (fileType === 'application/pdf') {
          const fileURL = URL.createObjectURL(file)

          truck.files[index] = {
            ...file,
            pdfPreview: fileURL,
            imagePreview: null, // Clear image preview if any
            fileName: fileName, // Add the file name
          }
        } else if (fileType.startsWith('image/')) {
          const fileURL = URL.createObjectURL(file)

          truck.files[index] = {
            ...file,
            imagePreview: fileURL,
            pdfPreview: null, // Clear PDF preview if any
            fileName: fileName, // Add the file name
          }
        } else {
          truck.files[index] = {
            ...file,
            pdfPreview: null,
            imagePreview: null,
            fileName: fileName, // Add the file name
          }
        }
      })
    } else {
      truck.files.forEach((file, index) => {
        truck.files[index] = {
          ...file,
          pdfPreview: null,
          imagePreview: null,
          fileName: null, // Clear the file name if no file
        }
      })
    }
  })
})

const removeFile = (truck, fileIndex) => {
  truck.files.splice(fileIndex, 1)
}

const removeFileO = index => {
  files.value.splice(index, 1)
  if (!files.value.length) {
    fileMuti.value = null
  }
}

const seeTruck = () => {
  console.log('data truck', resaleProductShipping.value)
}

const addTruck = () => {
  resaleProductShipping.value.push({
    truckNo: '',
    sKTLotNo: '',
    supplierLotNo: '',
    productCode: '',
    tradeName: '',
    packaging: '',
    netContent: '',
    amount: '',
    quantity: '',
    customerName: '',
    deliveryPlace: '',
    appearanceCheck: false,
    remark: '',
    files: [],
  })
}

const removeFilesInTruck = index => {
  resaleProductShipping.value[index].files = []
}

//------------------------ Dialog ----------------------------------------------------------------
const isDialogVisibleImgAmount = ref(false)

const dessertsMockAmountView = [
  {
    barcode: 'C-SAKUMARU-A',
    qty: 159,
    uom: 'Kg',
    description: '1/8',
    protein: 4,
  },
  {
    barcode: 'C-SAKUMARU-B',
    qty: 237,
    uom: 'Kg',
    description: '2/8',
    protein: 4,
  },
  {
    barcode: 'C-SAKUMARU-C',
    qty: 262,
    uom: 'Kg',
    description: '3/8',
    protein: 4,
  },
  {
    barcode: 'C-SAKUMARU-D',
    qty: 305,
    uom: 'Kg',
    description: '4/8',
    protein: 4,
  },
  {
    barcode: 'C-SAKUMARU-E',
    qty: 356,
    uom: 'Kg',
    description: '5/8',
    protein: 4,
  },
  {
    barcode: 'C-SAKUMARU-F',
    qty: 356,
    uom: 'Kg',
    description: '6/8',
    protein: 4,
  },
  {
    barcode: 'C-SAKUMARU-G',
    qty: 356,
    uom: 'Kg',
    description: '7/8',
    protein: 4,
  },
  {
    barcode: 'C-SAKUMARU-H',
    qty: 356,
    uom: 'Kg',
    description: '8/8',
    protein: 4,
  },
]
</script>

<template>
  <VContainer fluid>
    <div>
      <div style="position: fixed;">
        <VBtn
          :to="{ name: 'skt-shipping',
          }"
          class="mx-2"
          size="40"
      
          icon
        >
          <VIcon
            size="40"
            icon="ri-arrow-left-s-line"
          />
        </VBtn>
      </div>
    </div>
    <span
      v-if="checkSheetTypeNameModel === 'General'"
      class="text-center d-flex justify-center"
      style="font-weight: bolder;"
    >Resale / Product Shipping Check Sheet (Drum) on {{ getCurrentDate() }}</span>
    <span
      v-if="checkSheetTypeNameModel === 'IBC'"
      class="text-center d-flex justify-center"
      style="font-weight: bolder;"
    >Resale / Product Shipping Check Sheet (IBC) on {{ getCurrentDate() }}</span>
    <div class="my-6">
      <VRow>
        <VCol
          class="px-0"
          cols="12"
        >
          <div style="overflow-x: auto; white-space: nowrap;">
            <table class="custom-table">
              <thead>
                <tr>
                  <th
                    colspan="9"
                    class="section-title text-center"
                  >
                    Sale Order: {{ salesOrderNoModel }}
                  </th>
                  <th
                    colspan="5"
                    class="section-title text-center"
                  >
                    <div
                      v-if="reportModel"
                      class="checkbox-container pa-0"
                    >
                      <VCheckbox
                        v-model="reportModel.doEx"
                        value="EX"
                      />Export
                      <VCheckbox
                        v-model="reportModel.doEx"
                        value="DO"
                      />Domestic
                    </div>
                  </th>
                </tr>
                <tr>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    No.
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    Container No. /License plate No.
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    SKT Lot No.
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    Supplier Lot No.
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    Item Code
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    Trade Name	
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    Packaging
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    Net Content
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    Amount
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    Quantity (Kg.)
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    Customer Name
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    Delivery Place
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    Appearance Check
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    Remark
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in getShippingCheckSheetResult?.checkSheetItems"
                  :key="index"
                >
                  <td>{{ index+1 }}</td>
                  <td>{{ item.containerNo_LicPlNo }}</td>
                  <td>{{ item.sktLotNo }}</td>
                  <td style="min-width: 200px;">
                    <VTextField
                      v-model="item.supplierLotNo"
                      density="compact"
                    />
                  </td>
                  <td>{{ item.itemCode }}</td>
                  <td>{{ item.tradeName }}</td>
                  <td class="text-center">
                    {{ item.packging }}
                  </td>
                  <td class="text-end">
                    {{ formatNumber(item.netCount) }}
                  </td>
                  <td>
                    <VRow>
                      <VCol
                        class="text-end"
                        cols="12"
                      >
                        {{ item.amount }}
                      </VCol>
                      <VCol
                        v-if="false"
                        class="d-flex align-start justify-end pa-2"
                        cols="6"
                        @click="isDialogVisibleImgAmount = true"
                      >
                        <VIcon
                          icon=" ri-eye-fill"
                          class="cursor-pointer"
                        />
                      </VCol>
                    </VRow>
                  </td>
                  <td class="text-end">
                    {{ item.quantityKgs }}
                  </td>
                  <td style="min-width: 200px; font-size: 14px;">
                    <VTextField
                      v-model="item.customerName"
                      density="compact"
                    />
                  </td>
                  <td style="min-width: 250px;">
                    <VTextField
                      v-model="item.deliveryPlace"
                      density="compact"
                    />
                  </td>
                  <td>
                    <VRow>
                      <VCol cols="6">
                        <VCheckbox
                          v-model="item.appearanceCheck"
                          :value="appearanceCheckTrue"
                        >
                          <template #label>
                            <span class="font-size">YES</span>
                          </template>
                        </VCheckbox>
                      </VCol>
                      <VCol cols="6">
                        <VCheckbox
                          v-model="item.appearanceCheck"
                          :value="false"
                        >
                          <template #label>
                            <span class="font-size">NO</span>
                          </template>
                        </VCheckbox>
                      </VCol>
                    </VRow>
                  </td>
                  <td>
                    <VBtn
                      style="min-width: 150px;"
                      variant="outlined"
                      :color="item.remark ? 'primary' : 'grey'"
                      @click="textAreaDialogActive('RemarkLOG', item.remark, item.journalID)"
                    >
                      <span
                        v-if="item.remark"
                        style="overflow: hidden; max-width: 130px; text-overflow: ellipsis;"
                      >{{ item.remark }}</span>
                      <span v-else>{{ item.remark }}</span>
                    </VBtn>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </VCol>
      </VRow>
      <!-- Dialog For Amount -->
      <section>
        <VDialog
          v-model="isDialogVisibleImgAmount"
          width="800"
        >
          <!-- Dialog Content -->
          <VCard>
            <VCardTitle class="bg-primary">
              <div class="d-flex justify-center">
                <span>Product Detail</span>
              </div>
            </VCardTitle>

            <VCardText>
              <div>
                <VTable
                  height="250"
                  fixed-header
                >
                  <thead>
                    <tr>
                      <th class="text-uppercase">
                        No.
                      </th>
                      <th class="text-uppercase">
                        Barcode
                      </th>
                      <th class="text-end">
                        QTY.
                      </th>
                      <th class="text-uppercase">
                        UoM
                      </th>
                      <th class="text-uppercase">
                        Description
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="(item, index) in dessertsMockAmountView"
                      :key="index"
                    >
                      <td class="text-start">
                        {{ index+1 }}
                      </td>
                      <td class="text-start">
                        {{ item.barcode }}
                      </td>
                      <td class="text-end">
                        {{ item.qty }}
                      </td>
                      <td class="text-start">
                        {{ item.uom }}
                      </td>
                      <td class="text-start">
                        {{ item.description }}
                      </td>
                    </tr>
                  </tbody>
                </VTable>
              </div>
            </VCardText>
            <VCardAction>
              <div class="d-flex justify-end">
                <VBtn
                  class="ma-2"
                  color="warning"
                  @click="isDialogVisibleImgAmount = false"
                >
                  Close
                </VBtn>
              </div>
            </VCardAction>
          </VCard>
        </VDialog>
      </section>

      <VRow style="overflow-x: auto;">
        <!--  Condition check for special request	Check by -->
        <VCol
          cols="12"
          lg="6"
          md="6"
        >
          <table class="custom-table">
            <thead>
              <tr>
                <th
                  colspan="12"
                  class="section-title text-center"
                >
                  ** Condition Check for Special Request **
                </th>
              </tr>
            </thead>
            <tbody>
              <!--  Condition check for special request | Check by -->
              <tr
                v-for="item in getShippingCheckSheetResult?.specialRequestChecks"
                :key="item.journalID"
              >
                <td colspan="4">
                  <div class="d-flex justify-center">
                    <VCheckbox v-model="item.checkedValue" />
                  </div>
                </td>
                <td colspan="8">
                  {{ item.displayText }}
                </td>
              </tr>
              <tr v-if="false">
                <td
                  colspan="12"
                  style="height: 159px;"
                >
                  <VRow>
                    <VCol
                      v-for="(file, index) in iconMock"
                      :key="index"
                      cols="4"
                    >
                      <VCard class="pa-2 cursor-pointer">
                        <VImg
                          role="presentation"
                          :alt="file.iconName"
                          :src="file.src"
                          height="100"
                          contain
                          @click="showDialogImageMuti(file.src, file.iconName)"
                        />
                      </VCard>
                    </VCol>
                  </VRow>

                  <VDialog
                    v-model="isDialogVisibleImgFileMuti"
                    width="500"
                  >
                    <!-- Dialog Content -->
                    <VCard>
                      <VCardTitle class="bg-primary">
                        <div class="d-flex justify-space-between">
                          <span>Label</span>
                          <VBtn
                            icon="mdi-close"
                            color="white"
                            size="small"
                            variant="tonal"
                            @click="isDialogVisibleImgFileMuti = false"
                          />
                        </div>
                      </VCardTitle>

                      <VCardText class="cursor-pointer">
                        <VImg
                          role="presentation"
                          :src="imgDialog"
                          height="100%"
                          contain
                        />
                      </VCardText>
                    </VCard>
                  </VDialog>
                </td>
              </tr>
            </tbody>
          </table>
        </VCol>
        <!-- Picture Labely -->
        <VCol
          cols="12"
          lg="6"
          md="6"
        >
          <table class="custom-table">
            <thead>
              <tr>
                <th
                  colspan="6"
                  class="section-title text-center"
                >
                  Picture Label
                </th>
                <th
                  colspan="6"
                  class="section-title text-center"
                >
                  Picture for Packaging
                </th>
              </tr>
            </thead>
            <tbody>
              <!--  Picture Label -->
              <tr>
                <td
                  class="text-center  cursor-pointer"
                  colspan="1"
                  ripple
                  :style="{
                    borderColor: selectedLanguage.includes('Thai') ? 'green' : '',
                    borderWidth: selectedLanguage.includes('Thai') ? '2px': '1px',
                    borderStyle: 'solid',
                  }"
                  :class="{'bg-green-lighten-3': selectedLanguage.includes('Thai')}"
                  style="height: 53px;"
                  @click="addItemsLang('Thai')"
                >
                  Thai
                </td>
                <td
                  rowspan="9"
                  colspan="5"
                >
                  <div class="d-flex justify-center cursor-pointer">
                    <VImg
                      height="250"
                      width="150"
                      :src="pictureLabel"
                      alt="Packaging Image"
                      class="image"
                      @click="showDialogImageMuti(pictureLabel)"
                    />
                  </div>
                </td>
                <td
                  rowspan="9"
                  colspan="6"
                >
                  <div class="d-flex justify-center cursor-pointer">
                    <VImg
                      height="150"
                      width="150"
                      :src="picturePackaging"
                      @click="showDialogImageMuti(picturePackaging)"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  class="text-center cursor-pointer"
                  colspan="1"
                  ripple
                  :style="{
                    borderColor: selectedLanguage.includes('English') ? 'green' : '',
                    borderWidth: selectedLanguage.includes('English') ? '2px': '1px',
                    borderStyle: 'solid',
              
                  }"
                  :class="{'bg-green-lighten-3': selectedLanguage.includes('English')}"
                  style="height: 53px;"
                  @click="addItemsLang('English')"
                >
                  English
                </td>
              </tr>
              <tr>
                <td
                  class="text-center  cursor-pointer"
                  colspan="1"
                  ripple
                  :style="{
                    borderColor: selectedLanguage.includes('Japanese') ? 'green' : '',
                    borderWidth: selectedLanguage.includes('Japanese') ? '2px': '1px',
                    borderStyle: 'solid',
                  }"
                  :class="{'bg-green-lighten-3': selectedLanguage.includes('Japanese')}"
                  style="height: 53px;"
                  @click="addItemsLang('Japanese')"
                >
                  Japanese
                </td>
              </tr>
              <tr>
                <td
                  class="text-center  cursor-pointer"
                  colspan="1"
                  ripple
                  :style="{
                    borderColor: selectedLanguage.includes('Chinese') ? 'green' : '',
                    borderWidth: selectedLanguage.includes('Chinese') ? '2px': '1px',
                    borderStyle: 'solid',
                  }"
                  :class="{'bg-green-lighten-3': selectedLanguage.includes('Chinese')}"
                  style="height: 53px;"
                  @click="addItemsLang('Chinese')"
                >
                  Chinese
                </td>
              </tr>
              <tr>
                <td
                  class="text-center  cursor-pointer"
                  colspan="1"
                  ripple
                  :style="{
                    borderColor: selectedLanguage.includes('Malaysia') ? 'green' : '',
                    borderWidth: selectedLanguage.includes('Malaysia') ? '2px': '1px',
                    borderStyle: 'solid',
                  }"
                  :class="{'bg-green-lighten-3': selectedLanguage.includes('Malaysia')}"
                  style="height: 53px;"
                  @click="addItemsLang('Malaysia')"
                >
                  Malaysia
                </td>
              </tr>
              <tr>
                <td
                  class="text-center  cursor-pointer"
                  colspan="1"
                  ripple
                  :style="{
                    borderColor: selectedLanguage.includes('Korean') ? 'green' : '',
                    borderWidth: selectedLanguage.includes('Korean') ? '2px': '1px',
                    borderStyle: 'solid',
                  }"
                  :class="{'bg-green-lighten-3': selectedLanguage.includes('Korean')}"
                  style="height: 53px;"
                  @click="addItemsLang('Korean')"
                >
                  Korean
                </td>
              </tr>
              <tr>
                <td
                  class="text-center  cursor-pointer"
                  colspan="1"
                  ripple
                  :style="{
                    borderColor: selectedLanguage.includes('SDS') ? 'green' : '',
                    borderWidth: selectedLanguage.includes('SDS') ? '2px': '1px',
                    borderStyle: 'solid',
                  }"
                  :class="{'bg-green-lighten-3': selectedLanguage.includes('SDS')}"
                  style="height: 53px;"
                  @click="addItemsLang('SDS')"
                >
                  SDS
                </td>
              </tr>
            </tbody>
          </table>
        </VCol>
      </VRow>

      <VRow style="overflow-x: auto; white-space: nowrap;">
        <!-- ตรวจสอบรายการต่อไปนี้ก่อนจัดส่ง -->
        <VCol
          class=""
          cols="12"
          md="6"
          lg="6"
        >
          <table class="custom-table">
            <tr>
              <th
                colspan="4"
                class="section-title text-center "
              >
                Check The Following Items Before Shipping
              </th>
            </tr>
            <tr
              v-for="(item , index) in getShippingCheckSheetResult?.itemChecks"
              :key="index"
            >
              <td colspan="1">
                <div class="d-flex justify-center align-center">
                  <VCheckbox v-model="item.checkedValue" />
                </div>
              </td>
              <td colspan="3">
                {{ item.displayText }}
              </td>
            </tr>
          </table>
        </VCol>
        <!-- ตรวจสอบบรรจุภัณฑ์ -->
        <VCol
          class=""
          cols="12"
          md="6"
          lg="6"
        >
          <table class="custom-table">
            <tbody>
              <!--  body table -->
              <tr>
                <td
                  rowspan="6"
                  colspan="6"
                >
                  <div class="d-flex justify-center cursor-pointer">
                    <VImg
                      height="250"
                      width="250"
                      :src="image04"
                      @click="showDialogImageMuti(image04)"
                    />
                  </div>
                </td>
                <td
                  rowspan="6"
                  colspan="6"
                >
                  <div class="d-flex justify-center cursor-pointer">
                    <VImg
                      height="250"
                      width="250"
                      :src="image03"
                      @click="showDialogImageMuti(image03)"
                    />
                  </div>
                </td>
              </tr>
            </tbody>

            <thead>
              <tr>
                <th
                  colspan="12"
                  class="section-title text-center"
                >
                  Check The Packaging
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item , index) in getShippingCheckSheetResult?.packagingChecks"
                :key="index"
              >
                <td colspan="4">
                  <div class="d-flex justify-center">
                    {{ item.displayText }}
                  </div>
                </td>
                <td colspan="4">
                  <div class="d-flex justify-center">
                    <div
                      v-if="item.option1Text === 'Wood'"
                      class="d-flex justify-center align-center"
                    >
                      <VCheckbox
                        v-model="item.checkedValue"
                        :value="checkThePackagingCheckTrue"
                      />
                      Wood
                    </div>
                    <div
                      v-else
                      class="d-flex justify-center align-center"
                    >
                      <VCheckbox
                        v-model="item.checkedValue"
                        :value="checkThePackagingCheckTrue"
                      />
                      Yes
                    </div>
                  </div>
                </td>
                <td colspan="4">
                  <div class="d-flex justify-center">
                    <div
                      v-if="item.option2Text === 'Plastic'"
                      class="d-flex justify-center align-center"
                    >
                      <VCheckbox
                        v-model="item.checkedValue"
                        :value="false"
                      />
                      Plastic 
                    </div>
                    <div
                      v-else
                      class="d-flex justify-center align-center"
                    >
                      <VCheckbox
                        v-model="item.checkedValue"
                        :value="false"
                      />
                      NO 
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </VCol>
      </VRow>
      
      <div
        v-if="false"
        class="my-4"
      >
        <VBtn @click="addTruck">
          Add Truck
        </VBtn>

        <VBtn @click="seeTruck">
          See Truck
        </VBtn>

        <VBtn @click="seeLabelItems">
          See Label
        </VBtn>
      </div>

      <section v-if="checkSheetTypeNameModel === 'IBC'">
        <div style="overflow-x: auto; white-space: nowrap;">
          <table class="custom-table my-4">
            <thead>
              <tr>
                <th
                  style="position: sticky;z-index: 1;  left: 0; min-width: 350px;  background-color: #fafafa;"
                  colspan="4"
                  class="text-center"
                >
                  No.
                </th>
                <th
                  v-for="(num, index) in tableData.No"
                  :key="index"
                  colspan="2"
                  class="text-center"
                >
                  {{ num }}
                </th>
              </tr>
              <tr>
                <th
                  style="position: sticky;z-index: 1;  left: 0; min-width: 350px; background-color: #fafafa;"
                  colspan="4"
                  class="text-center"
                >
                  IBC No.
                </th>
                <th
                  v-for="(num, index) in tableData.ibcNo"
                  :key="index"
                  colspan="2"
                  style="min-width: 150px;"
                >
                  <VTextField
                    v-model="tableData.ibcNo[index]"
                    variant="outlined"
                    density="compact"
                  />
                </th>
              </tr>
              <tr>
                <th
                  colspan="4"
                  class="text-center"
                  style="position: sticky;z-index: 1;  left: 0; min-width: 350px; background-color: #fafafa;"
                >
                  GROSSWEIGHT Before Shipping
                </th>
                <th
                  v-for="(num, index) in tableData.grossWeightBeforeShipping"
                  :key="index"
                  colspan="2"
                >
                  <VTextField
                    v-model="tableData.grossWeightBeforeShipping[index]"
                    variant="outlined"
                    density="compact"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(values, key) in filteredTableData"
                :key="key"
              >
                <th
                  v-if="key === 'rustFree' || key === 'labelNotTorn' || key === 'noTopVentHole' || key === 'topSealTight'|| key === 'bottomValveSealTight'"
                  class="font-weight-bold"
                  style="position: sticky; z-index: 1; left: 0; min-width: 350px; background-color: #fafafa;"
                  colspan="4"
                >
                  <span>{{ translatedKeys[key] || key }}</span>
                </th>
                <td
                  v-else
                  style="position: sticky; z-index: 1; left: 0; min-width: 350px; background-color: #fafafa;"
                  colspan="4"
                >
                  {{ translatedKeys[key] || key }}
                </td>
                <td
                  v-for="(value, index) in values"
                  :key="index"
                  colspan="2"
                >
                  <div v-if="checkboxKeys.includes(key)">
                    <VCheckbox v-model="tableData[key][index]" />
                  </div>
                  <div v-else>
                    {{ value }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <section v-if="false">
          <div>
            <VRow>
              <VCol cols="6" />
              <VCol
                cols="6"
                class="d-flex justify-end"
              >
                <!-- ปุ่มย้อนกลับ (ไปที่ชุดข้อมูลก่อนหน้า) -->
                <VBtn
                  variant="text"
                  icon
                  class="mx-2"
                  :disabled="currentDataIndex === 1"
                  @click="switchDataSet(currentDataIndex - 1)"
                >
                  <VIcon icon="ri-arrow-left-s-line" />
                </VBtn>

                <!-- ปุ่มไปข้างหน้า (ไปที่ชุดข้อมูลถัดไป) -->
                <VBtn
                  variant="text"
                  icon
                  :disabled="currentDataIndex === 3"
                  @click="switchDataSet(currentDataIndex + 1)"
                >
                  <VIcon icon="ri-arrow-right-s-line" />
                </VBtn>
              </VCol>
            </VRow>
          </div>
        </section>
      </section>

      <div v-if="true">
        <section
          v-for="(truck, index) in resaleProductShipping"
        
          :key="index"
        >
          <!-- Muti File Inpur Imge -->
          <VRow v-if="!truck.files.length">
            <VCol cols="4">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th class="text-center">
                      Container No. /License Plate No.
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-center">
                      {{ truck.truckNo }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </VCol>

            <VCol cols="8">
              <VFileInput
                v-model="truck.files"
                label="File input"
                multiple
              >
                <template #selection>
                  <VRow
                    class="d-flex align-center justify-center"
                    style="height: 150px; border: 2px dashed #ccc; cursor: pointer;"
                  >
                    <VCol
                      class="d-flex flex-column align-center justify-center"
                      cols="12"
                    >
                      <span>Upload your documents</span>
                    </VCol>
                  </VRow>
                </template>
              </VFileInput>
            </VCol>
          </VRow>
        </section>
      </div>
      

      <!-- Inspector / Btn -->
      <div class="mt-4">
        <table class="custom-table">
          <thead>
            <tr>
              <th
                class="text-center"
                colspan="12"
              >
                <span>Inspector</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                class="text-start"
                colspan="4"
                style="min-width: 150px; max-width: 150px;"
              >
                <span
                  v-if="getShippingCheckSheetResult?.reportCheckSheet"
                  style="font-size: 12px;"
                >WH Staff 1:{{ getShippingCheckSheetResult?.reportCheckSheet.updatedBy }}</span>
              </td>
              <td
                class="text-start"
                colspan="4"
                style="min-width: 150px; max-width: 150px;"
              >
                <span
                  v-if="getShippingCheckSheetResult?.reportCheckSheet"
                  style="font-size: 12px;"
                >WH Staff 2:{{ getShippingCheckSheetResult?.reportCheckSheet.leadedBy }}</span>
              </td>
              <td
                class="text-start"
                colspan="4"
                style="min-width: 150px; max-width: 150px;"
              >
                <span
                  v-if="getShippingCheckSheetResult?.reportCheckSheet"
                  style="font-size: 12px;"
                >Supervisor:{{ getShippingCheckSheetResult?.reportCheckSheet.approvedBy }}</span>
              </td>
            </tr>
            <tr>
              <td
                class="text-start"
                colspan="4"
              >
                <span
                  v-if="getShippingCheckSheetResult?.reportCheckSheet"
                  style="font-size: 12px;"
                >{{ formatDate(getShippingCheckSheetResult?.reportCheckSheet.updatedDate) }}</span>
              </td>
              <td
                class="text-start"
                colspan="4"
              >
                <span
                  v-if="getShippingCheckSheetResult?.reportCheckSheet"
                  style="font-size: 12px;"
                >{{ formatDate(getShippingCheckSheetResult?.reportCheckSheet.leadedDate) }}</span>
              </td>
              <td
                class="text-start"
                colspan="4"
              >
                <span
                  v-if="getShippingCheckSheetResult?.reportCheckSheet"
                  style="font-size: 12px;"
                >{{ formatDate(getShippingCheckSheetResult?.reportCheckSheet.approvedDate) }}</span>
              </td>
            </tr>
            <tr>
              <td
                class="text-start"
                colspan="12"
              >
                หมายเหตุ: คนขับรถ ตรวจรถสินค้าหลังนำขึ้นรถแล้ว สภาพปกติ ไม่รั่ว
              </td>
            </tr>
          </tbody>
        </table>

        <div class="d-flex justify-end mt-4">
          <VBtn
            class="mx-2"
            color="warning"
            @click="habdleSaveDraft"
          >
            SAVE DRAFT
          </VBtn>
          <VBtn
            class="mx-2"
            color="green"
            @click="handleSubmit"
          >
            WH2
          </VBtn>
          <VBtn
            class="mx-2"
            color="green"
            @click="handleSubmit"
          >
            WH1
          </VBtn>
        </div>
      </div>
    </div>
  </VContainer>

  <!-- Dialog Text area -->
  <section>
    <div>
      <TextAreaDialog
        v-model="dialogVisible"
        :sap-in-value="sapInValueView"
        :lot-value="lotValueView"
        :model-value-text="dialogDataTextArea"
        :type-btn="typeBtnView"
        :title-dialog="titleDialogView"
        @submit="handleDialogSubmit"
      />
    </div>

    <div>
      <VDialog
        v-model="isDialogAreaVisible"
        persistent
        class="v-dialog-sm"
      >
        <!-- Dialog Content -->
        <VCard>
          <VCardTitle class="text-center">
            Remark
          </VCardTitle>
          <DialogCloseBtn
            variant="text"
            size="default"
            @click="saveRemark"
          />

          <VCardText>
            <VTextarea
              v-model="dialogDataTextArea"
              counter
              label="Text"
              placeholder="Placeholder Text"
            />
          </VCardText>

          <VCardText class="d-flex justify-center flex-wrap gap-4">
            <VBtn
              color="warning"
              @click="saveRemark"
            >
              OK
            </VBtn>
          </VCardText>
        </VCard>
      </VDialog>
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

    //------------------ Dialog img
    <VDialog
      v-model="isDialogVisibleImgFileMuti"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardTitle class="bg-primary">
          <div class="d-flex justify-space-between">
            <VBtn
              icon="mdi-close"
              color="white"
              size="small"
              variant="tonal"
              @click="isDialogVisibleImgFileMuti = false"
            />
          </div>
        </VCardTitle>

        <VCardText>
          <VImg
            role="presentation"
            :src="imgDialog"
            height="100%"
            contain
          />
        </VCardText>
      </VCard>
    </VDialog>
  </section>
</template>

<style lang="scss" src="./drum.scss"></style>
