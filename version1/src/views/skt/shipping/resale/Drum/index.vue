<script setup>
import { onMounted, ref, watch } from "vue"

import iconMock1 from '@images/icons/Group 1000004801.png'
import iconMock2 from '@images/icons/Group 1000004802.png'
import iconMock3 from '@images/icons/Icon.png'


import { urlApi } from '@/api'  //---------------------- Import Api for Url *****
import { VDataTable } from 'vuetify/labs/VDataTable'

import { useCookieStore, useItemStore } from '@/stores/skt/receingFormStore/itemStore'

const itemStore = useItemStore()

const userDataInfo = ref(itemStore.getItemDetails('UserDataCookies'))
const department = ref(userDataInfo.value.departmentName)
const whereHouse = localStorage.getItem('whereHouseName')
const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')





//------------------------------------- Permissions ---------------------------------
const showBtnCheckSheet = () => {
  return !!(userDataInfo?.value.id === '00025' || userDataInfo?.value.id === '00023' || userDataInfo?.value.id === '00042' || userDataInfo?.value.id === '00043')
}

//------------------------------------ params section -------------------------------
import { useRoute } from 'vue-router'

const route = useRoute()

const dataProductRow = ref(JSON.parse(sessionStorage.getItem("productDataSession")))

const journalIdModel = ref(dataProductRow.value.journalID)
const itemCodeModel = ref(dataProductRow.value.itemCode)
const userCodeModel = ref(dataProductRow.value.shippingUserCode)
const SoEtlLogDetailJournalIDModel = ref(dataProductRow.value.soEtlLogDetailJournalID)
const salesOrderNoModel = ref(dataProductRow.value.salesOrderNo)
const checkSheetTypeNameModel = ref(dataProductRow.value.checkSheetTypeName)
const statusModel = ref(dataProductRow.value.csLfStatusId)

console.log('journalIdModel', dataProductRow.value.journalID)

//------------------------------- disabled input ---------------------------

const disableInpit = () => {
  return statusModel.value === 1005
}

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
  useGetFileFormService, useShippingCheckSheetFileFormService,
  useGetShippingSpecialConditionIconService, useDeleteFileFormService,
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


        // ✅ ใช้ Promise.all เพื่อรอให้ fetchFileLicensePlate ทำงานเสร็จก่อน
        getShippingCheckSheetResult.value.checkSheetItems = await Promise.all(
          getShippingCheckSheetResult.value.checkSheetItems.map(async item => ({
            ...item,
            fileeLicensePlate: await fetchFileLicensePlate(item.soEtlLogDetailJournalID, item.containerNo_LicPlNo),
            fileeLicensePlateMew: [],
            fileeLicensePlateDeleteOne: [],
            fileeLicensePlateDeleteAll: [],
          })),
        )
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
        if (labalMalaysia) languages.push('Malaysia')
        if (labalThai) languages.push('Thai')
        if (sds) languages.push('SDS')

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

const showImagNew = file => {
  return URL.createObjectURL(file)
}

const showData = () => {
  console.log('Data Current', getShippingCheckSheetResult.value)
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
  correctLabelPosition: "- ตำแหน่ง Label ถูกต้อง (อยู่ตรงกลาง)",
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

  console.log('filteredData', filteredData)
  
  return filteredData
})

onMounted(async () => {
  await getShippingCheckSheet()

  getShippingCheckSheetResult.value?.unfIbc.forEach(item => {
    tableData.value.No.push(item.ibcIndex)
    tableData.value.ibcNo.push(item.ibcNo || '')
    tableData.value.grossWeightBeforeShipping.push(item.grossWeightBeforeShipping || '')

    // ✅ ใช้ Boolean (`true` / `false`) แทน `Yes` / `No`
    tableData.value.rustFree.push(!!item.rustFree)
    tableData.value.noDentOrDeform.push(!!item.noDents)
    tableData.value.strongBaseSupport.push(!!item.baseStrong)

    tableData.value.labelNotTorn.push(!!item.labelIntact)
    tableData.value.correctLotNo.push(!!item.correctLotNo)
    tableData.value.correctWeight.push(!!item.accurateWeight)
    tableData.value.correctLabelPosition.push(!!item.centeredLabel)

    tableData.value.noTopVentHole.push(!!item.capSeal)
    tableData.value.capNoLeakAfterOpening.push(!!item.noLeakAtCap)
    tableData.value.correctCapSize.push(!!item.properCapSize)

    tableData.value.goodCapCondition.push(!!item.capCondition)
    tableData.value.topSealTight.push(!!item.topSeal)
    tableData.value.bottomValveSealTight.push(!!item.bottomSeal)
  })

  console.log(tableData.value)
})

//------------------------------------- File Section ---------------------------------------------------
//------------------------------- Get
const { getFileFormResult,
  errorMessageGetFileForm,
  getFileFormFunction } = useGetFileFormService()

const fetchFileLicensePlate = async (soEtlLogDetailJournalID, LicensePlate) => {
  try{
    const result = await getFileFormFunction(soEtlLogDetailJournalID, 
      LicensePlate, 'ShippingCheckSheetFile', 'GetLicensePlate', 
      urlApi.value, whereHouse, 
      accessTokenAtStore)

    if(result){
      console.log('result file', result.data.data)
      
      return result.data.data
    }
  }catch(error){
    console.log('result error', error)
  }
}

const convertFileUri = fileUri => {
  const parts = fileUri.split("/")
  
  // แปลงค่าที่เป็นทะเบียนรถ (index ที่ 7 ของ URL) ให้เป็น URL Encoding
  parts[7] = encodeURIComponent(parts[7])

  // เปลี่ยน "ShippingFile" เป็น "ShippingCheckSheetFile"
  return parts.join("/").replace("ShippingFile", "ShippingCheckSheetFile")
}

//-------------------------------- Save File
const { resultSaveFielForm,
  errorMessageSaveFileForm,
  functionSaveFileForm } = useShippingCheckSheetFileFormService()

const handleSaveFile = async (files, soEtlLogDetailJournalID, licensePlate ) => {
  try{
    const result = await functionSaveFileForm(files, soEtlLogDetailJournalID, licensePlate,
      'SaveLicensePlate', urlApi.value,  whereHouse, 
      accessTokenAtStore)

    if(result){
      console.log(`save file ${soEtlLogDetailJournalID} successed`, resultSaveFielForm.value)
    }else{
      console.log(`save file ${soEtlLogDetailJournalID} fialed`, errorMessageSaveFileForm.value, accessTokenAtStore)
    }
  }catch(error){
    console.log(`save file catch ${soEtlLogDetailJournalID} fialed`, error)
  }
}

//-------------------------------- Delete File
const { deleteFileFormResult,
  errorMessageDeleteFileForm,
  deleteFileFormFunction } = useDeleteFileFormService()

const testDelete = () => {
  return "DeleFiel"
}

const handleDeleteFileForm = async (type, 
  soEtlLogDetailJournalID, licensePlate, fileName) => {
  console.log("handleDeleteFileForm start! .....")
  console.log("handleDeleteFileForm", type, 
    soEtlLogDetailJournalID, licensePlate, fileName)
  try{
    const result = await deleteFileFormFunction(
      soEtlLogDetailJournalID, licensePlate, fileName,
      type, 'ShippingCheckSheetFile',  urlApi.value, whereHouse, 
      accessTokenAtStore)

    if(result){
      console.log('delete file successed', resultDeleteFileForm.value)
      
      return result
    }else{
      console.log('delete file fialed', errorMessageDeleteFileForm.value, accessTokenAtStore)
    }
  }catch(error){
    console.log('delete file catch fialed', error)
  }
}

//------------------------------------- Save Draft ---------------------------------------

const { saveShippingCheckSheetResult,
  errorSaveShippingCheckSheet,
  saveShippingCheckSheet } = useShippingCheckSheetService()

const appearanceCheckTrue = ref(true)
const checkThePackagingCheckTrue = ref(true)

// eslint-disable-next-line sonarjs/cognitive-complexity
const mapShippingCheckSheetData = data => {
  
  return {
    checkSheetItems: data.checkSheetItems.map(item => ({
      journalID: item.journalID,
      soEtlLogDetailJournalID: item.soEtlLogDetailJournalID,
      containerNo_LicPlNo: item.containerNo_LicPlNo,
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
      grossWeightBeforeShipping: item.grossWeightBeforeShipping || "", // ค่าเริ่มต้น เนื่องจากไม่มีข้อมูลจาก getShippingCheckSheetResult
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
      noDents: tableData.value.noDentOrDeform[index], // Boolean
      baseStrong: tableData.value.strongBaseSupport[index], // Boolean
      labelIntact: tableData.value.labelNotTorn[index], // Boolean
      correctLotNo: tableData.value.correctLotNo[index], // Boolean
      accurateWeight: tableData.value.correctWeight[index], // Boolean
      centeredLabel: tableData.value.correctLabelPosition[index], // Boolean
      capSeal: tableData.value.noTopVentHole[index], // Boolean
      noLeakAtCap: tableData.value.capNoLeakAfterOpening[index], // Boolean
      properCapSize: tableData.value.correctCapSize[index], // Boolean
      capCondition: tableData.value.goodCapCondition[index], // Boolean
      topSeal: tableData.value.topSealTight[index], // Boolean
      bottomSeal: tableData.value.bottomValveSealTight[index], // Boolean
    }))
  }

  if (getShippingCheckSheetResult.value?.reportCheckSheet) {

    const selectedLanguages = selectedLanguage.value || [] // เอาข้อมูลจาก selectedLanguage.value
    const reportCheckSheet = getShippingCheckSheetResult.value.reportCheckSheet
    if(selectedLanguage.value){
      getShippingCheckSheetResult.value.reportCheckSheet = {
        soEtlLogDetailJournalID: getShippingCheckSheetResult.value.reportCheckSheet.soEtlLogDetailJournalID,
        labalThai: selectedLanguages.includes('Thai'),
        labalEnglish: selectedLanguages.includes('English'),
        labalJapanese: selectedLanguages.includes('Japanese'),
        labalChinese: selectedLanguages.includes('Chinese'),
        labalMalaysia: selectedLanguages.includes('Malaysia'),
        labalKorean: selectedLanguages.includes('Korean'),
        sds: selectedLanguages.includes('SDS'), // ถ้า SDS เป็นภาษาให้ใช้ ถ้าไม่ใช่ให้เอาออก
      }
    }

    // console.log('reportCheckSheet start update .....', getShippingCheckSheetResult.value?.reportCheckSheet)
  }
}

const trickerSaveDraft = ref(false)

// eslint-disable-next-line sonarjs/cognitive-complexity
const habdleSaveDraft = async () => {

  // อัพเดตข้อมูลใน getShippingCheckSheetResult.value?.unfIbc ก่อน
  await updateShippingCheckSheetData()

  // รอให้การบันทึกไฟล์ทั้งหมดเสร็จก่อน
  const fileSavePromises = getShippingCheckSheetResult.value.checkSheetItems
    .filter(item => item.fileeLicensePlateMew && item.fileeLicensePlateMew.length > 0)
    .map(item => handleSaveFile(item.fileeLicensePlateMew, 
      item.soEtlLogDetailJournalID, item.containerNo_LicPlNo))

  const fileDeleteOnePromises = getShippingCheckSheetResult.value.checkSheetItems
    .flatMap(item => Array.isArray(item.fileeLicensePlateDeleteOne) ? item.fileeLicensePlateDeleteOne : []) 
    .filter(item => item && item.containerNo_LicPlNo) // กรองค่าที่ไม่มี ID ออก
    .map(item => handleDeleteFileForm('DeleteOneLicensePlate', item.soEtlLogDetailJournalID, 
      item.containerNo_LicPlNo, item.fileName))

  const fileDeleteAllPromises = getShippingCheckSheetResult.value.checkSheetItems
    .flatMap(item => Array.isArray(item.fileeLicensePlateDeleteAll) ? item.fileeLicensePlateDeleteAll : []) 
    .filter(item => item && item.containerNo_LicPlNo) // กรองค่าที่ไม่มี ID ออก
    .map(item => handleDeleteFileForm('DeleteAllLicensePlate', item.soEtlLogDetailJournalID, 
      item.containerNo_LicPlNo, 'fileNameAll'))

  const file = await Promise.all(fileSavePromises) // รอให้ทุก Promise เสร็จสิ้น
  const file2 = await Promise.all(fileDeleteOnePromises)
  const file3 = await Promise.all(fileDeleteAllPromises)
  
  if(!file){
    textAlertDialogFunction('FILE', false)
    setTimeout(() => {
      // location.reload()
    }, 500) // 0.5 วินาที
    
    return
  }

  if(!file2){
    textAlertDialogFunction('FILE2', false)
    setTimeout(() => {
      // location.reload()
    }, 500) // 0.5 วินาที
    
    return
  }else{
    console.log('FILE2', fileDeleteOnePromises)
  }

  if(!file3){
    textAlertDialogFunction('FILE3', false)
    setTimeout(() => {
      // location.reload()
    }, 500) // 0.5 วินาที
    
    return
  }else{
    console.log('FILE3', fileDeleteAllPromises)
  }

  console.log('getShippingCheckSheetResult.value', getShippingCheckSheetResult.value)

  // console.log('getShippingCheckSheetResult.value update', getShippingCheckSheetResult.value)

  // ส่งข้อมูลที่อัพเดตไปบันทึก
  const requestData = mapShippingCheckSheetData(getShippingCheckSheetResult.value)

  console.log("requestData", requestData)

  try {
    const result = await saveShippingCheckSheet(
      urlApi.value, 'save', whereHouse, 
      accessTokenAtStore, requestData)

    if(saveShippingCheckSheetResult.value){
      saveShippingCheckSheetResult.value = result
      if(!trickerSaveDraft.value){
        textAlertDialogFunction(alertWordConst.saveDraft, true)
        setTimeout(() => {
        // location.reload()

          location.reload()
        }, 500) // 0.5 วินาที
      }
      
    }else{
      console.log('errorSaveShippingCheckSheet !result ', errorSaveShippingCheckSheet.value)
      if(!trickerSaveDraft.value){
        textAlertDialogFunction(alertWordConst.saveDraft, false)
        setTimeout(() => {
        // location.reload()
        }, 500) // 0.5 วินาที
      }
      
    }
  } catch (error) {
    errorSaveShippingCheckSheet.value = error.message
  }
}

//------------------------------------ Submit ---------------------------------------
const { submitCheckSheetResult,
  submitCheckSheetError,
  submitCheckSheetFunction } = useSubmitCheckSheetService()

const handleSubmit = async type => {

  trickerSaveDraft.value = true

  await habdleSaveDraft()

  try {
    console.log("requestData 1")

    const result = submitCheckSheetFunction(urlApi.value, type, whereHouse, 
      accessTokenAtStore, SoEtlLogDetailJournalIDModel.value)

    console.log("requestData 2")
    if(result || submitCheckSheetResult.value){
      submitCheckSheetResult.value = result
      submitCheckSheetError.value = null
      console.log('submitCheckSheetResult', result)
      textAlertDialogFunction(alertWordConst.submit, true)
      console.log("requestData 3")
      setTimeout(() => {
        window.location.href = `${window.location.origin}/skt/shipping`
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
  if(dateString){
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0") // เดือนเริ่มจาก 0
    const year = date.getFullYear()
  
    return `${day}/${month}/${year}`
  }else{
    return ``
  }
  
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

const { getShippingSpecialConditionIconResult,
  errorGetShippingSpecialConditionIcon,
  fetchShippingSpecialConditionIcon } = useGetShippingSpecialConditionIconService()

const fetIconCondition = async () => {
  try{
    const result = fetchShippingSpecialConditionIcon(urlApi.value, 
      'GetSpecialConditionIcon', whereHouse, accessTokenAtStore, 
      itemCodeModel.value, userCodeModel.value)

    if(result){
      getShippingSpecialConditionIconResult.value = result
      errorGetShippingSpecialConditionIcon.value = null
      console.log('getShippingSpecialConditionIconResult', getShippingSpecialConditionIconResult.value)
      
      return result
    }else{
      console.log('errorGetShippingSpecialConditionIcon !result ', errorGetShippingSpecialConditionIcon.value)
    }
  } catch (error) {
    errorGetShippingSpecialConditionIcon.value = error.message
  }
}

onMounted(async () => {
  fetIconCondition()
})

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

    if(newFiles){
      if (newFiles.length > 0) {
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
    }

    
  })
})

const removeFileAll = (truck, fileIndex) => {
  console.log("removeFileAll!", truck, fileIndex)
  if(truck && truck.fileeLicensePlate){
    truck.fileeLicensePlateDeleteAll.push({
      containerNo_LicPlNo: truck.containerNo_LicPlNo,
      soEtlLogDetailJournalID: truck.fileeLicensePlate[0].soEtlLogDetailJournalID,
    })
    truck.fileeLicensePlate.splice(fileIndex, 1)
    truck.fileeLicensePlateMew.splice(fileIndex, 1)
    console.log("removeFileAll!", truck)
  }else{
    console.log("not find!", truck)
  }
  
}

const removeFileNew = (truck, fileIndex, type) => {
  if (truck && truck.fileeLicensePlateMew) {
    
    truck.fileeLicensePlateMew.splice(fileIndex, 1)
  }
}

const removeFileOld = (truck, fileIndex, type) => {
  console.log("removeFileOld", truck)
  if (truck && truck.fileeLicensePlate) {
    truck.fileeLicensePlateDeleteOne.push({
      containerNo_LicPlNo: truck.containerNo_LicPlNo, 
      fileName: truck.fileeLicensePlate[fileIndex].fileName, 
      soEtlLogDetailJournalID: truck.fileeLicensePlate[fileIndex].soEtlLogDetailJournalID,
    })
    truck.fileeLicensePlate.splice(fileIndex, 1)
    
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

const lengthGetShippingSpecialConditionIconResult = data => {
  if(data){
    return 3 -data.length
  }
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
      v-if="checkSheetTypeNameModel === 'IBC'"
      class="text-center d-flex justify-center"
      style="font-weight: bolder;"
    >Resale / Product Shipping Check Sheet ({{ dataProductRow?.checkSheetTypeName }}) on&nbsp;<span
      v-if="getShippingCheckSheetResult?.reportCheckSheet"
      style="font-weight: bold;"
    >{{ formatDate(getShippingCheckSheetResult?.reportCheckSheet.updatedDate) }}</span></span>
    <span
      v-else
      class="text-center d-flex justify-center"
      style="font-weight: bolder;"
    >Resale / Product Shipping Check Sheet ({{ dataProductRow?.checkSheetTypeName }}) on {{ getCurrentDate() }}</span>
    <div class="my-6">
      <VRow>
        <VCol cols="12">
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
                        readonly
                        value="EX"
                      />Export
                      <VCheckbox
                        v-model="reportModel.doEx"
                        readonly
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
                    Container No. /License Plate No.
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
                  <td>
                    <span v-if="statusModel === 1002 || statusModel === 1003 || statusModel === 0">
                      <VTextField
                        v-model="item.containerNo_LicPlNo"
                        :readonly="disableInpit()"
                        density="compact"
                      /></span>
                    <span v-else>{{ item.containerNo_LicPlNo }}</span>
                  </td>
                  <td>{{ item.sktLotNo }}</td>
                  <td style="min-width: 200px;">
                    <VTextField
                      v-model="item.supplierLotNo"
                      density="compact"
                      :readonly="disableInpit()"
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
                      :readonly="disableInpit()"
                      density="compact"
                    />
                  </td>
                  <td style="min-width: 250px;">
                    <VTextField
                      v-model="item.deliveryPlace"
                      :readonly="disableInpit()"
                      density="compact"
                    />
                  </td>
                  <td>
                    <VRow>
                      <VCol cols="6">
                        <VCheckbox
                          v-model="item.appearanceCheck"
                          :readonly="disableInpit()"
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
                          :readonly="disableInpit()"
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
                    <VCheckbox
                      v-model="item.checkedValue"
                      :readonly="disableInpit()"
                    />
                  </div>
                </td>
                <td colspan="8">
                  {{ item.displayText }}
                </td>
              </tr>
              <tr v-if="getShippingSpecialConditionIconResult">
                <td
                  colspan="12"
                  style="height: 159px;"
                >
                  <VRow v-if="false">
                    <VCol
                      v-for="(file, index) in getShippingSpecialConditionIconResult.data"
                      :key="index"
                    >
                      <VCard class="pa-2 cursor-pointer">
                        <VImg
                          role="presentation"
                          :alt="file.iconName"
                          :src="`https://sktdevwebapi.easetrackwms.com/api/v1/ShippingCheckSheetFile/ShippingSpecialConditionIcon/${file}`"
                          height="100"
                          contain
                          @click="showDialogImageMuti(`https://sktdevwebapi.easetrackwms.com/api/v1/ShippingCheckSheetFile/ShippingSpecialConditionIcon/${file}`, file.iconName)"
                        />
                      </VCard>
                    </VCol>
                  </VRow>
                  <VRow
                    v-if="getShippingSpecialConditionIconResult"
                    class="d-flex justify-start"
                  >
                    <VCol
                      v-for="(file, index) in getShippingSpecialConditionIconResult.data"
                      :key="index"
                      cols="4"
                    >
                      <VCard class="pa-2 cursor-pointer">
                        <VImg
                          role="presentation"
                          :alt="file.iconName"
                          :src="`https://sktdevwebapi.easetrackwms.com/api/v1/ShippingCheckSheetFile/ShippingSpecialConditionIcon/${file}`"
                          height="100"
                          contain
                          @click="showDialogImageMuti(`https://sktdevwebapi.easetrackwms.com/api/v1/ShippingCheckSheetFile/ShippingSpecialConditionIcon/${file}`, file.iconName)"
                        />
                      </VCard>
                    </VCol>
                    <!-- เพิ่มช่องว่างถ้ามีรูป < 3 -->
                  </VRow>
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
            <tbody v-if="!disableInpit()">
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
                      cover
                      max-height="370"
                      min-height="150"
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
                      cover
                      max-height="370"
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

            <tbody v-if="disableInpit()">
              <!--  Picture Label -->
              <tr>
                <td
                  class="text-center"
                  colspan="1"
                  ripple
                  :style="{
                    borderColor: selectedLanguage.includes('Thai') ? 'green' : '',
                    borderWidth: selectedLanguage.includes('Thai') ? '2px': '1px',
                    borderStyle: 'solid',
                  }"
                  :class="{'bg-green-lighten-3': selectedLanguage.includes('Thai')}"
                  style="height: 53px;"
                >
                  Thai
                </td>
                <td
                  rowspan="9"
                  colspan="5"
                >
                  <div class="d-flex justify-center cursor-pointer">
                    <VImg
                      cover
                      max-height="370"
                      min-height="150"
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
                      cover
                      max-height="370"
                      width="150"
                      :src="picturePackaging"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  class="text-center "
                  colspan="1"
                  ripple
                  :style="{
                    borderColor: selectedLanguage.includes('English') ? 'green' : '',
                    borderWidth: selectedLanguage.includes('English') ? '2px': '1px',
                    borderStyle: 'solid',
              
                  }"
                  :class="{'bg-green-lighten-3': selectedLanguage.includes('English')}"
                  style="height: 53px;"
                >
                  English
                </td>
              </tr>
              <tr>
                <td
                  class="text-center  "
                  colspan="1"
                  ripple
                  :style="{
                    borderColor: selectedLanguage.includes('Japanese') ? 'green' : '',
                    borderWidth: selectedLanguage.includes('Japanese') ? '2px': '1px',
                    borderStyle: 'solid',
                  }"
                  :class="{'bg-green-lighten-3': selectedLanguage.includes('Japanese')}"
                  style="height: 53px;"
                >
                  Japanese
                </td>
              </tr>
              <tr>
                <td
                  class="text-center  "
                  colspan="1"
                  ripple
                  :style="{
                    borderColor: selectedLanguage.includes('Chinese') ? 'green' : '',
                    borderWidth: selectedLanguage.includes('Chinese') ? '2px': '1px',
                    borderStyle: 'solid',
                  }"
                  :class="{'bg-green-lighten-3': selectedLanguage.includes('Chinese')}"
                  style="height: 53px;"
                >
                  Chinese
                </td>
              </tr>
              <tr>
                <td
                  class="text-center  "
                  colspan="1"
                  ripple
                  :style="{
                    borderColor: selectedLanguage.includes('Malaysia') ? 'green' : '',
                    borderWidth: selectedLanguage.includes('Malaysia') ? '2px': '1px',
                    borderStyle: 'solid',
                  }"
                  :class="{'bg-green-lighten-3': selectedLanguage.includes('Malaysia')}"
                  style="height: 53px;"
                >
                  Malaysia
                </td>
              </tr>
              <tr>
                <td
                  class="text-center  "
                  colspan="1"
                  ripple
                  :style="{
                    borderColor: selectedLanguage.includes('Korean') ? 'green' : '',
                    borderWidth: selectedLanguage.includes('Korean') ? '2px': '1px',
                    borderStyle: 'solid',
                  }"
                  :class="{'bg-green-lighten-3': selectedLanguage.includes('Korean')}"
                  style="height: 53px;"
                >
                  Korean
                </td>
              </tr>
              <tr>
                <td
                  class="text-center  "
                  colspan="1"
                  ripple
                  :style="{
                    borderColor: selectedLanguage.includes('SDS') ? 'green' : '',
                    borderWidth: selectedLanguage.includes('SDS') ? '2px': '1px',
                    borderStyle: 'solid',
                  }"
                  :class="{'bg-green-lighten-3': selectedLanguage.includes('SDS')}"
                  style="height: 53px;"
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
                  <VCheckbox
                    v-model="item.checkedValue"
                    :readonly="disableInpit()"
                  />
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
                        :readonly="disableInpit()"
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
                        :readonly="disableInpit()"
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
                        :readonly="disableInpit()"
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
                        :readonly="disableInpit()"
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
                    :readonly="disableInpit()"
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
                  GROSS WEIGHT Before Shipping
                </th>
                <th
                  v-for="(num, index) in tableData.grossWeightBeforeShipping"
                  :key="index"
                  colspan="2"
                >
                  <VTextField
                    v-model="tableData.grossWeightBeforeShipping[index]"
                    :readonly="disableInpit()"
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
                    <VCheckbox
                      v-model="tableData[key][index]"
                      :readonly="disableInpit()"
                    />
                  </div>
                  <div v-else>
                    {{ value }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <VBtn
        v-if="false"
        @click="showData"
      >
        asdasd
      </VBtn>

      <div v-if="true">
        <section
          v-for="(truck, index) in getShippingCheckSheetResult?.checkSheetItems"
        
          :key="index"
        >
          <!-- Muti File Inpur Imge -->
          <VRow
            v-if="!truck.fileeLicensePlate"
            class="my-4"
          >
            <VCol cols="3">
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
                      {{ truck.containerNo_LicPlNo }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </VCol>

            <VCol
              style="border: 2px dashed black; border-radius: 10px;"
              cols="9"
            >
              <VRow>
                <VCol cols="12">
                  <VFileInput
                    v-if="disableInpit()"
                    v-model="truck.fileeLicensePlateMew"
                    label="File input"
                    multiple
                  />
                </VCol>
                <VCol
                  v-for="(file, fileIndex) in truck.fileeLicensePlateMew"
                  :key="fileIndex"
                  cols="3"
                  md="3"
                  lg="3"
                  class="bg-green-lighten-5"
                >
                  <VCard class="pa-2">
                    <VChip
                      variant="elevated"
                      color="success"
                    >
                      New
                    </VChip>
                    <VImg
                      role="presentation"
                      :alt="file.name"
                      :src="showImagNew(file)"
                      height="100"
                      contain
                      @click="showDialogImageMuti(showImagNew(file))"
                    />

                    <VCardText class="pa-2">
                      <div class="d-flex flex-column align-center text-center">
                        <VBtn
                          class="mt-2"
                          icon="mdi-close"
                          color="error"
                          size="small"
                          variant="tonal"
                          @click="removeFileNew(truck, fileIndex)"
                        />
                      </div>
                    </VCardText>
                  </VCard>
                </VCol>
                <VCol
                  v-for="(file, fileIndex) in truck.fileeLicensePlate"
                  :key="fileIndex"
                  cols="3"
                  md="3"
                  lg="3"
                >
                  <VCard
                    style="height: 210px;"
                    class="pa-2"
                  >
                    <VImg
                      role="presentation"
                      :alt="file.name"
                      :src="convertFileUri(file.fileUri)" 
                      height="100"
                      contain
                      @click="showDialogImageMuti(convertFileUri(file.fileUri))"
                    />

                    <VCardText class="pa-2">
                      <div class="d-flex flex-column align-center text-center">
                        <span v-if="false">{{ file.fileName }}</span>
                        <VBtn
                          class="mt-2"
                          icon="mdi-close"
                          color="error"
                          size="small"
                          variant="tonal"
                          @click="removeFileOld(truck, fileIndex)"
                        />
                      </div>
                    </VCardText>
                  </VCard>
                </VCol>
                <Vcol
                  style="width: 100%;"
                  cols="12"
                >
                  <VBtn
                    class="mx-2 mb-2"
                    color="red"
                    width="98%"
                    @click="removeFileAll(truck)"
                  >
                    Delete Image
                  </VBtn>
                </Vcol>
              </VRow>
              <VRow />
            </VCol>
          </VRow>
          
          <!-- Muti File Show Imge -->
          <VRow
            v-if="truck.fileeLicensePlate"
            class="my-4"
          >
            <VCol cols="3">
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
                      {{ truck.containerNo_LicPlNo }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </VCol>

            <VCol
              style="border: 2px dashed black; border-radius: 10px;"
              cols="9"
            >
              <VRow>
                <VCol cols="12">
                  <VFileInput
                    v-if="!disableInpit()"
                    v-model="truck.fileeLicensePlateMew"
                    label="File input"
                    multiple
                  />
                </VCol>
                <VCol
                  v-for="(file, fileIndex) in truck.fileeLicensePlateMew"
                  :key="fileIndex"
                  cols="3"
                  md="3"
                  lg="3"
                  class="bg-green-lighten-5"
                >
                  <VCard class="pa-2">
                    <VChip
                      variant="elevated"
                      color="success"
                    >
                      New
                    </VChip>
                    <VImg
                      role="presentation"
                      :alt="file.name"
                      :src="showImagNew(file)"
                      height="100"
                      contain
                      @click="showDialogImageMuti(showImagNew(file))"
                    />

                    <VCardText class="pa-2">
                      <div class="d-flex flex-column align-center text-center">
                        <VBtn
                          class="mt-2"
                          icon="mdi-close"
                          color="error"
                          size="small"
                          variant="tonal"
                          @click="removeFileNew(truck, fileIndex)"
                        />
                      </div>
                    </VCardText>
                  </VCard>
                </VCol>
                <VCol
                  v-for="(file, fileIndex) in truck.fileeLicensePlate"
                  :key="fileIndex"
                  cols="3"
                  md="3"
                  lg="3"
                >
                  <VCard
                    style="height: 210px;"
                    class="pa-2"
                  >
                    <VImg
                      role="presentation"
                      :alt="file.name"
                      :src="convertFileUri(file.fileUri)" 
                      height="100"
                      contain
                      @click="showDialogImageMuti(convertFileUri(file.fileUri))"
                    />

                    <VCardText class="pa-2">
                      <div class="d-flex flex-column align-center text-center">
                        <span v-if="false">{{ file.fileName }}</span>
                        <VBtn
                          v-if="!disableInpit()"
                          class="mt-2"
                          icon="mdi-close"
                          color="error"
                          size="small"
                          variant="tonal"
                          @click="removeFileOld(truck, fileIndex)"
                        />
                      </div>
                    </VCardText>
                  </VCard>
                </VCol>
                <Vcol
                  style="width: 100%;"
                  cols="12"
                >
                  <VBtn
                    :disabled="disableInpit()"
                    class="mx-2 mb-2"
                    color="red"
                    width="98%"
                    @click="removeFileAll(truck)"
                  >
                    Delete Image
                  </VBtn>
                </Vcol>
              </VRow>
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
                style="height: 38px;"
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
                <span
                  v-else
                  style="font-size: 12px;"
                />
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
        <div
          v-if="department === 'Warehouse' || showBtnCheckSheet()"
          class="d-flex justify-end mt-4"
        >
          <VBtn
            v-if="statusModel === 1002 || statusModel === 1003 || statusModel === 0"
            class="mx-2"
            color="warning"
            @click="habdleSaveDraft"
          >
            SAVE DRAFT
          </VBtn>
          <VBtn
            v-if="statusModel === 1002 || statusModel === 1003 || statusModel === 0"
            class="mx-2"
            color="green"
            @click="handleSubmit('submit')"
          >
            WH1
          </VBtn>
          <VBtn
            v-if="statusModel === 1004"
            class="mx-2"
            color="green"
            @click="handleSubmit('leaderapprove')"
          >
            WH2
          </VBtn>
        </div>

        <div
          v-if="false"
          class="d-flex justify-end mt-4"
        >
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
            @click="handleSubmit('submit')"
          >
            WH1
          </VBtn>
          <VBtn
            class="mx-2"
            color="green"
            @click="handleSubmit('leaderapprove')"
          >
            WH2
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
              :readonly="disableInpit()"
              counter
              label="Text"
              placeholder="Placeholder Text"
            />
          </VCardText>

          <VCardText class="d-flex justify-center flex-wrap gap-4">
            <VBtn
              v-if="!disableInpit()"
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

    <!-- Dialog img -->
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
