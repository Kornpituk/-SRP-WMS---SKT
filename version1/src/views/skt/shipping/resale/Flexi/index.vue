<script setup>
const vasss = ref('dd')
import img01 from '@/views/skt/shipping/resale/Flexi/img/01.png'
import img02 from '@/views/skt/shipping/resale/Flexi/img/02.png'
import img03 from '@/views/skt/shipping/resale/Flexi/img/03.png'
import img04 from '@/views/skt/shipping/resale/Flexi/img/04.png'

import img05 from '@/views/skt/resale/flexible/img/01.png'
import img06 from '@/views/skt/resale/flexible/img/02.png'
import img07 from '@/views/skt/resale/flexible/img/03.png'
import img08 from '@/views/skt/resale/flexible/img/04.png'
import img09 from '@/views/skt/resale/flexible/img/05.png'

//-------------------------- Section Switch Flexi / Lorry ----------------
const typeResalse = ref('Flexi')

const TitleResalse = ref('Filling Direction & Report to FLEXI')

const imagePictureFlexi = ref([img01, img02, img03, img04])

const imagePictureLorry = ref([img05, img06, img07, img08, img09])

//--------------------------- Section import Services --------------------------------
import { urlApi } from '@/api' //---------------------- Import Api for Url *****

import { useItemStore } from '@/stores/skt/receingFormStore/itemStore'

const itemStore = useItemStore()

const whereHouse = localStorage.getItem('whereHouseName')
const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')

const userDataInfo = ref(itemStore.getItemDetails('UserDataCookies'))
const department = ref(userDataInfo.value.departmentName)

import {
  useGetShippingCheckSheetLorryFlexiService, useSaveShippingCheckSheetService,
  useShippingCheckSheetLorryService,
} from "@/services/skt/shipmentPlan/lorryFlexiServices"

import { watch } from 'vue'
import { useRoute } from 'vue-router'



const route = useRoute()

const dataProductRow = ref(JSON.parse(sessionStorage.getItem("productDataSession")))

const statusModel = ref(dataProductRow.value.csLfStatusId)
const soEIdModel = ref(dataProductRow.value.soEtlLogDetailJournalID)

//------------------------------------- Permissions ---------------------------------
const showBtnCheckSheet = () => {
  return !!(userDataInfo?.value.id === '00025' || userDataInfo?.value.id === '00023' || userDataInfo?.value.id === '00042' || userDataInfo?.value.id === '00043')
}

//--------------------------------- disabled ----------------------------------

const disabledInput = () => {
  return statusModel.value === 1105
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

//-------------------------- formate -------------------------------

const formatToDate = dateString => {
  if (!dateString) return null // จัดการค่าว่าง
  const date = new Date(dateString)
  if (isNaN(date)) return null // จัดการค่าที่ไม่ใช่วันที่
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  
  return `${day}/${month}/${year}`
}

const extractTime = isoString => {
  let date = new Date(isoString)

  // ถ้า isoString เป็น "1969-12-31T03:00:06.803" หรือเป็นค่าว่างหรือไม่ถูกต้อง ให้ใช้เวลาปัจจุบันแทน
  if (isoString === "1969-12-31T03:00:06.803" || isNaN(date.getTime())|| isoString === "2020-05-02T07:00:00" ) {
    date = new Date()
  }

  return date.toLocaleTimeString("en-GB", { hour12: false }) // รูปแบบ HH:mm:ss
}


const convertToISO = dateString => {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/
  const match = dateString.match(regex)

  if (!match) {
    return dateString // ถ้าไม่ตรงรูปแบบ ให้คืนค่าเดิม
  }

  const [, day, month, year, hour, minute] = match
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute, 6, 804))

  return date.toISOString()
}

function toCustomFormat(isoString) {
  let date = new Date(isoString)
  
  // ถ้า isoString เป็น "1969-12-31T03:00:06.803" หรือเป็นค่าว่างหรือไม่ถูกต้อง ให้ใช้เวลาปัจจุบันแทน
  if (isoString === "1969-12-31T03:00:06.803" || isNaN(date.getTime()) || !isoString) {
    date = new Date()
  }

  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0") // เดือนเริ่มจาก 0
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")

  return `${day}/${month}/${year} ${hours}:${minutes}`
  
}

//------------------------------ Alert Confirm ---------------------------
const confirmDialog2 = ref('')
const typeConfirmDialog = ref('')
const soEIdConfirmDialog = ref('')
const productRowModel = ref(null)

function openConfirmDialog(type, SoEId, productRow) {
  console.log('openConfirmDialog', type, SoEId)
  productRowModel.value = productRow

  // เรียกใช้ฟังก์ชัน openDialog ที่เปิดเผยจาก ConfirmDialog.vue
  if(type === 'submit'){
    wordForSubmit.value = type
    typeConfirmDialog.value = type
    soEIdConfirmDialog.value = SoEId
    console.log('openConfirmDialog', type, SoEId, wordForSubmit.value)
    
  }else if(type === 'back'){
    wordForSubmit.value = "SEND BACK"
    typeConfirmDialog.value = type
    soEIdConfirmDialog.value = SoEId
  }

  confirmDialog2.value.openDialog()

}

function handleConfirmAction() {
  if( wordForSubmit.value === 'submit'){
    submitShipmentPlanBySoEId(typeConfirmDialog.value, soEIdConfirmDialog.value)
  }else if(wordForSubmit.value === 'SEND BACK'){
    // submitShipmentPlanBySoEId('back', soEIdConfirmDialog.value)
    handleSubmit('back')
    console.log('back')
  }
  
  
}

function handleCancel() {
  console.log('Action canceled.')
}

//-------------------------- Section Get Data --------------------------------

const { getShippingCheckSheetResult,
  errorGetShippingCheckSheet,
  fetchShippingCheckSheet } = useGetShippingCheckSheetLorryFlexiService()

const handleFetchDataLorry = async () => {
  try{
    const result = await fetchShippingCheckSheet(urlApi.value, 
      'ShippingLorryFlexi', whereHouse, accessTokenAtStore, soEIdModel.value)

  
    if (result && result.data.reportLorryFlexi) {
      console.log('res', result.data.reportLorryFlexi) // แสดงข้อมูลดูก่อน

      const newData = ref()

      if (Array.isArray(result.data.reportLorryFlexi)) {
        // ถ้าเป็น array -> ใช้ .map() ได้
        newData.value = result.data.reportLorryFlexi.map(item => ({
          ...item,

          startedDate: extractTime(item.startedDate),
          finishedDate: extractTime(item.finishedDate),

          dateTimeStart: toCustomFormat(item.dateTimeStart),
          dateTimeBefore: toCustomFormat(item.dateTimeBefore),
          dateTimeMiddle: toCustomFormat(item.dateTimeMiddle),
          dateTimeFinal: toCustomFormat(item.dateTimeFinal),
          dateTimeInLorry: toCustomFormat(item.dateTimeInLorry),
        }))
      } else {
        // ถ้าเป็น object -> แปลงเป็น array ก่อน
        newData.value = [{
          ...result.data.reportLorryFlexi,

          startedDate: extractTime(result.data.reportLorryFlexi.startedDate),
          finishedDate: extractTime(result.data.reportLorryFlexi.finishedDate),

          dateTimeStart: toCustomFormat(result.data.reportLorryFlexi.dateTimeStart),
          dateTimeBefore: toCustomFormat(result.data.reportLorryFlexi.dateTimeBefore),
          dateTimeMiddle: toCustomFormat(result.data.reportLorryFlexi.dateTimeMiddle),
          dateTimeFinal: toCustomFormat(result.data.reportLorryFlexi.dateTimeFinal),
          dateTimeInLorry: toCustomFormat(result.data.reportLorryFlexi.dateTimeInLorry),
        }]
      }

      getShippingCheckSheetResult.value = newData.value[0]

      console.log('getShippingCheckSheetResult: ', getShippingCheckSheetResult.value)
    } else {
      console.error('Error: result.data.reportLorryFlexi เป็น null หรือ undefined', result.data.reportLorryFlexi)
    }
  }catch(e){
    console.error(e)
  }
}

watch(async() => {
  await handleFetchDataLorry()
})

const variantBtnMesh = ref('text')

const meshVariant = computed(() => value => {
  if (getShippingCheckSheetResult.value) {
    return getShippingCheckSheetResult.value.mesh === value ? "flat" : "text"
  }
  
  return "text"
})

// ฟังก์ชันเปลี่ยนค่า mesh
const setMeshValue = value => {
  
  if(getShippingCheckSheetResult.value.mesh === value){
    getShippingCheckSheetResult.value.mesh = ''
  }else{
    getShippingCheckSheetResult.value.mesh = value
  }
}

const variantBtnBagFilter = ref('text')

// ฟังก์ชันเช็คว่า bagFilter ตรงกับค่าที่ส่งเข้ามาหรือไม่
const bagFilterVariant = value => {
  if(getShippingCheckSheetResult.value){
    return getShippingCheckSheetResult.value.bagFilter === value
  }
  
}

// ฟังก์ชันเปลี่ยนค่า bagFilter
const setBagFilterValue = value => {
  if(getShippingCheckSheetResult.value){
    getShippingCheckSheetResult.value.bagFilter = getShippingCheckSheetResult.value.bagFilter === value ? "" : value
  }
  
}

//--------------------------- Section Save -------------------------------------------
const { saveShippingCheckSheetResult,
  errorSaveShippingCheckSheet,
  saveShippingCheckSheet } = useSaveShippingCheckSheetService()

const prepareLorryFlexiData = data => {
  return {
    ...prepareCommonData(data),
    ...prepareAppearanceData(data),
    ...prepareDateTimeData(data),
    ...preparePersonInchargeData(data),
    ...prepareOptionsData(data),
    remark: data.remark ?? "remark001",
  }
}

const prepareCommonData = data => ({
  ...prepareCommonDataPart1(data),
  ...prepareCommonDataPart2(data),
  ...prepareCommonDataPart3(data),
})

const prepareCommonDataPart1 = data => ({
  soEtlLogDetailJournalID: data.soEtlLogDetailJournalID ?? null,
  isLorry: data.isLorry ?? false,
  weight: data.weight ?? 35,
  lotNo: data.lotNo ?? "",
  lotNote: data.lotNote ?? "",
})

const prepareCommonDataPart2 = data => ({
  mesh: data.meshOption === false ? "" : data.mesh ?? "",
  material: data.materialOption === false ? "" :  data.material ?? "",
  bagFilter: data.bagFilterOption === false ? "" :  data.bagFilter ?? "",
  fillingLineValveOpen: data.fillingLineValveOpen ?? "",
  fillingEquipment: data.fillingEquipment ?? "",
  fillingOrder: data.fillingOrder ?? "",
})

const prepareCommonDataPart3 = data => ({
  lotNoActual: data.lotNoActual ?? "",
  container: data.container ?? "",
  net: data.net ?? 22,
  pointOfDelivery: data.pointOfDelivery ?? "",

  startedDate: ('2020-05-02T'+data.startedDate),
  finishedDate: ('2020-05-02T'+data.finishedDate),

  // startedDate: "2020-05-02T08:08:00.000Z",
  // finishedDate: "2020-05-02T08:08:00.000Z",
})

const prepareAppearanceData = data => ({
  apprearanceBefore: data.apprearanceBefore ?? "",
  apprearanceStart: data.apprearanceStart ?? "",
  apprearanceMiddle: data.apprearanceMiddle ?? "",
  apprearanceFinal: data.apprearanceFinal ?? "",
  apprearanceInLorry: data.apprearanceInLorry ?? "",
})

const prepareDateTimeData = data => ({
  dateTimeStart: convertToISO(data.dateTimeStart) ?? new Date().toISOString(),
  dateTimeBefore: convertToISO(data.dateTimeBefore) ?? new Date().toISOString(),
  dateTimeMiddle: convertToISO(data.dateTimeMiddle) ?? new Date().toISOString(),
  dateTimeFinal: convertToISO(data.dateTimeFinal) ?? new Date().toISOString(),
  dateTimeInLorry: convertToISO(data.dateTimeInLorry) ?? new Date().toISOString(),
})

const preparePersonInchargeData = data => ({
  personInchargeBefore: data.personInchargeBefore ?? "",
  personInchargeStart: data.personInchargeStart ?? "",
  personInchargeMiddle: data.personInchargeMiddle ?? "",
  personInchargeFinal: data.personInchargeFinal ?? "",
  personInchargeInLorry: data.personInchargeInLorry ?? "",
})

const prepareOptionsData = data => ({
  meshOption: data.meshOption ?? null,
  materialOption: data.materialOption ?? null,
  bagFilterOption: data.bagFilterOption ?? null,
  sealNo: data.sealNo ?? "",
  lorryAfterSealOption: data.lorryAfterSealOption ?? true,
  lorryAlreadyCleanedOption: data.lorryAlreadyCleanedOption ?? true,
  lorryInsideTankOption: data.lorryInsideTankOption ?? true,
  lorryCoverByCopingOption: data.lorryCoverByCopingOption ?? true,
  lorryCleaningHoseAirBlowOption: data.lorryCleaningHoseAirBlowOption ?? true,
  flexiAlreadyCleanedOption: data.flexiAlreadyCleanedOption ?? true,
  flexiInsideTankOption: data.flexiInsideTankOption ?? true,
  flexiShippingMarkOption: data.flexiShippingMarkOption ?? true,
  flexiCleaningHoseAirBlowOption: data.flexiCleaningHoseAirBlowOption ?? true,
})

const trickerSaveDraft = ref(false)

const handleSaveDraft = async () => {

  const requestBody = prepareLorryFlexiData(getShippingCheckSheetResult.value)

  try{
    const result = await saveShippingCheckSheet(
      urlApi.value, 
      'save', whereHouse, accessTokenAtStore, requestBody,
    )

    if(result){
      if(!trickerSaveDraft.value){
        textAlertDialogFunction(alertWordConst.saveDraft, true)
        setTimeout(() => {
        // window.location.href = `${window.location.origin}/skt/shipping`
          location.reload()
        }, 500) // 0.5 วินาที
      }
      
    }else{
      
      if(!trickerSaveDraft.value){
        textAlertDialogFunction(alertWordConst.saveDraft, false)
        setTimeout(() => {
          location.reload()
        }, 500) // 0.5 วินาที
      }
    }
  }catch(error){
    console.log(error)
  }
}

//------------------------------------ Section Submit & Approv --------------------------
const { submitShipmentPlanResult,
  errorShippingCheckSheetLorry,
  submitShipmentPlan } = useShippingCheckSheetLorryService()

const handleSubmit = async type => {

  trickerSaveDraft.value = true

  await handleSaveDraft()

  try{
    const result = await submitShipmentPlan(
      urlApi.value, 
      type, whereHouse, accessTokenAtStore, soEIdModel.value,
    )

    if(result || submitShipmentPlanResult.value){
      if(type === 'submit'){
        textAlertDialogFunction(alertWordConst.submit, true)
        setTimeout(() => {
          window.location.href = `${window.location.origin}/skt/shipping`
        }, 500) // 0.5 วินาที
      }else if(type === 'leaderapprove'){
        textAlertDialogFunction(alertWordConst.approve, true)
        setTimeout(() => {
          window.location.href = `${window.location.origin}/skt/shipping`
        }, 500) // 0.5 วินาที
      }else if(type === 'back'){
        textAlertDialogFunction(alertWordConst.sendBack, true)
        setTimeout(() => {
          window.location.href = `${window.location.origin}/skt/shipping`
        }, 500) // 0.5 วินาที
      }
    }else{
      if(type === 'submit'){
        textAlertDialogFunction(alertWordConst.submit, false)
        setTimeout(() => {
          // location.reload()
        }, 500) // 0.5 วินาที
      }else if(type === 'leaderapprove'){
        textAlertDialogFunction(alertWordConst.approve, false)
        setTimeout(() => {
          // location.reload()
        }, 500) // 0.5 วินาที
      }else if(type === 'back'){
        textAlertDialogFunction(alertWordConst.sendBack, false)
        setTimeout(() => {
          // location.reload()
        }, 500) // 0.5 วินาที
      }
    }
  }catch(error){
    console.log(error)
  }
}

//-------------------------------------send back ------------------------

import {
  useSubmitShipmentPlanService2,
} from '@/services/skt/shipmentPlan/services'

const { submitShipmentPlanResult2, errorSubmitShipmentPlan2, submitShipmentPlan2 } = useSubmitShipmentPlanService2()

// eslint-disable-next-line sonarjs/cognitive-complexity
const submitShipmentPlanBySoEId = async (type, soEtlLogDetailJournalID) => {

  try{
    console.log('submitShipmentPlanBySoEId start!!')

    // if(type === 'submit'){

    // }else if(type === 'approve' || type === 'reject'){
    //   console.log('submitShipmentPlanBySoEId start!! 3')
    //   soEtlLogDetailJournalID = selectedDataTables.value.map(item => item.soEtlLogDetailJournalID)
    //   console.log('submitShipmentPlanBySoEId start!! 2')
    // }else if(type === 'back'){
    //   soEtlLogDetailJournalID = selectedDataTables.value.map(item => item.soEtlLogDetailJournalID)
    //   console.log('submitShipmentPlanBySoEId back !! 3')
    // }

    // if(!statusCommnetValue.value && type === 'reject'){
    //   textAlertDialogFunction('Please enter Reject Comment.', false)
      
    //   return
    // }

    soEtlLogDetailJournalID = soEIdModel.value
    
    const result = submitShipmentPlan2(urlApi.value,
      type,
      whereHouse,
      accessTokenAtStore,
      soEtlLogDetailJournalID,
      '',
    )

    console.log('submitShipmentPlanBySoEId start!! 3')
    
    if(submitShipmentPlanResult.value || result){
      if(type === 'submit'){
        textAlertDialogFunction(alertWordConst.submit, true)
        setTimeout(() => {
          window.location.href = `${window.location.origin}/skt/shipping`
        }, 500) // 10000 มิลลิวินาที = 10 วินาที
      }else if(type === 'approve'){
        textAlertDialogFunction(alertWordConst.approve, true)
        setTimeout(() => {
          window.location.href = `${window.location.origin}/skt/shipping`
        }, 500) // 10000 มิลลิวินาที = 10 วินาที
      }else if(type === 'reject'){
        textAlertDialogFunction(alertWordConst.reject, true)
        setTimeout(() => {
          // window.location.href = `${window.location.origin}/skt/shipping`
        }, 500) // 10000 มิลลิวินาที = 10 วินาที
      }else if(type === 'back'){
        textAlertDialogFunction(alertWordConst.sendBack, true)
        setTimeout(() => {
          window.location.href = `${window.location.origin}/skt/shipping`
        }, 500) // 10000 มิลลิวินาที = 10 วินาที
      }

      console.log('submitShipmentPlanBySoEId start!! 4')
      
    }else{
      if(type === 'submit'){
        textAlertDialogFunction(alertWordConst.submit, false)
        setTimeout(() => {
          location.reload()
        }, 500) // 10000 มิลลิวินาที = 10 วินาที
      }else if(type === 'approve'){
        textAlertDialogFunction(alertWordConst.approve, false)
        setTimeout(() => {
          location.reload()
        }, 500) // 10000 มิลลิวินาที = 10 วินาที
      }else if(type === 'reject'){
        textAlertDialogFunction(alertWordConst.reject, false)
        setTimeout(() => {
          location.reload()
        }, 500) // 10000 มิลลิวินาที = 10 วินาที
      }else if(type === 'back'){
        textAlertDialogFunction(alertWordConst.sendBack, false)
        setTimeout(() => {
          location.reload()
        }, 500) // 10000 มิลลิวินาที = 10 วินาที
      }
    }
  } catch (error) {
    console.error(`Error saving search plan:`, error)
  }
}
</script>

<template>
  <VRow>
    <div>
      <div style="position: fixed;">
        <VBtn
          :to="{ name: 'skt-shipping',
          }"
          class="mx-2 my-4"
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

    
    <VCol cols="12">
      <div
        class="text-center d-flex justify-center align-center"
        style="font-weight: bold;"
      >
        <div class="d-flex justify-end" />
      </div>
    </VCol>

    <VCol
      class="text-center d-flex justify-center align-center"
      cols="10"
    >
      <span
        v-if="!getShippingCheckSheetResult?.isLorry"
        style="font-weight: bold;"
      >Filling Direction & Report to FLEXI</span>
      <span
        v-if="getShippingCheckSheetResult?.isLorry"
        style="font-weight: bold;"
      >Filling Direction & Report to LORRY</span>
    </VCol>
    <VCol
      class="text-center d-flex justify-end align-center"
      cols="2"
    >
      <VBtn
        :disabled="disabledInput()"
        :variant="getShippingCheckSheetResult?.isLorry ? 'tonal' : 'flat'"
        @click="getShippingCheckSheetResult.isLorry = false"
      >
        Flexi
      </VBtn>
      <VBtn
        :disabled="disabledInput()"
        :variant="!getShippingCheckSheetResult?.isLorry ? 'tonal' : 'flat'"
        @click="getShippingCheckSheetResult.isLorry = true"
      >
        Lorry
      </VBtn>
    </VCol>

    <VCol cols="12">
      <div style="overflow-x: auto; white-space: nowrap;">
        <table class="custom-table">
          <tr v-if="false">
            <th
              colspan="12"
              class="text-center"
            >
              Filling Direction & Report to FLEXI
            </th>
          </tr>
          <tr>
            <th
              colspan="4"
              class="text-center"
            >
              <span>Customer Name: </span><span class="font-weight-body">{{ dataProductRow?.shippingUserName }} , </span><span>SO No. </span><span class="font-weight-body">{{ dataProductRow?.salesOrderNo }}</span>
            </th>
            <th
              colspan="4"
              class="text-center"
            >
              <span>Delivery Place: </span><span class="font-weight-body">{{ dataProductRow?.shipperLocation }}</span>
            </th>
            <th
              colspan="4"
              class="text-center"
            >
              <span> Weight: </span><span class="font-weight-body">{{ Number(getShippingCheckSheetResult?.weight).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span><span> Kg.</span>
            </th>
          </tr>
          <tr>
            <th
              colspan="2"
              class="text-center "
            >
              <span>Item Name</span>
            </th>
            <th
              colspan="10"
              class="text-start "
            >
              <span class="font-weight-body">{{ dataProductRow.itemName }}</span>
            </th>
          </tr>
          <tr>
            <th
              colspan="2"
              class="text-center "
            >
              Lot No.
            </th>
            <td
              colspan="2"
              class="text-center "
              style="min-width: 150px;"
            >
              <span v-if="getShippingCheckSheetResult">{{ getShippingCheckSheetResult.lotNo }}</span>
            </td>
            <td
              colspan="8"
              class="text-center "
            >
              <span v-if="getShippingCheckSheetResult">{{ getShippingCheckSheetResult.lotNote }}</span>
            </td>
          </tr>
        </table>
      </div>
    </VCol>

    <VCol cols="12">
      <table class="custom-table">
        <tr>
          <th
           
            colspan="1"
            rowspan="3"
            class="text-center "
          >
            Strainer Type
          </th>
          <th
            colspan="2"
            class="text-center "
          >
            <span class="font-weight-body">Mesh</span>
          </th>
          <th
            v-if="getShippingCheckSheetResult?.meshOption"
            colspan="6"
            class="text-center "
          >
            <VBtn
              :disabled="disabledInput()"
              :variant="(meshVariant('80'))"
              icon
              @click="setMeshValue('80')"
            >
              80
            </VBtn>
            <VBtn
              :disabled="disabledInput()"
              :variant="meshVariant('100')"
              icon
              @click="setMeshValue('100')"
            >
              100
            </VBtn>
            <VBtn
              :disabled="disabledInput()"
              :variant="meshVariant('120')"
              icon
              @click="setMeshValue('120')"
            >
              120
            </VBtn>
            <VBtn
              :disabled="disabledInput()"
              :variant="meshVariant('150')"
              icon
              @click="setMeshValue('150')"
            >
              150
            </VBtn>
            <VBtn
              :disabled="disabledInput()"
              :variant="meshVariant('200')"
              icon
              @click="setMeshValue('200')"
            >
              200
            </VBtn>
            <VBtn
              :disabled="disabledInput()"
              :variant="meshVariant('300')"
              icon
              @click="setMeshValue('300')"
            >
              300
            </VBtn>
          </th>
          <th
            v-if="!getShippingCheckSheetResult?.meshOption"
            colspan="6"
            class="text-center "
          >
            <VBtn
              variant="text"
              icon
              disabled
            >
              80
            </VBtn>
            <VBtn
              variant="text"
              icon
              disabled
            >
              100
            </VBtn>
            <VBtn
              disabled
              variant="text"
              icon
            >
              120
            </VBtn>
            <VBtn
              disabled
              variant="text"
              icon
            >
              150
            </VBtn>
            <VBtn
              disabled
              variant="text"
              icon
            >
              200
            </VBtn>
            <VBtn
              disabled
              variant="text"
              icon
            >
              300
            </VBtn>
          </th>
          <th
            colspan="3"
            class="text-center "
          >
            <div class="checkbox-container">
              <VRow>
                <VCol
                  cols="6"
                  class="d-flex justify-center align-center"
                >
                  <VCheckbox
                    v-if="getShippingCheckSheetResult"
                    v-model="getShippingCheckSheetResult.meshOption"
                    :readonly="disabledInput()"
                  /><span class="font-weight-body">YES</span>
                </VCol>
                <VCol
                  cols="6"
                  class="d-flex justify-center align-center"
                >
                  <VCheckbox
                    v-if="getShippingCheckSheetResult"
                    v-model="getShippingCheckSheetResult.meshOption"
                    :readonly="disabledInput()"
                    :value="false"
                  /><span class="font-weight-body">NO</span>
                </VCol>
              </VRow>
            </div>
          </th>
        </tr>
        <tr>
          <th
            colspan="2"
            class="text-center "
          >
            <span class="font-weight-body">Material</span>
          </th>
          <th
            colspan="6"
            class="text-center"
            style="height: 57px;"
          >
            <span
              v-if="getShippingCheckSheetResult?.materialOption"
              class="font-weight-body"
            ><VTextField
              v-if="getShippingCheckSheetResult?.materialOption"
              v-model="getShippingCheckSheetResult.material"
              :readonly="disabledInput()"
              class="mx-2"
              density="compact"
            />
            </span>
            <span
              v-if="!getShippingCheckSheetResult?.materialOption"
              class="font-weight-body"
            />
          </th>
          <th
            colspan="3"
            class="text-center "
          >
            <div class="checkbox-container">
              <VRow>
                <VCol
                  cols="6"
                  class="d-flex justify-center align-center"
                >
                  <VCheckbox
                    v-if="getShippingCheckSheetResult"
                    v-model="getShippingCheckSheetResult.materialOption"
                    :readonly="disabledInput()"
                  /><span class="font-weight-body">YES</span>
                </VCol>
                <VCol
                  cols="6"
                  class="d-flex justify-center align-center"
                >
                  <VCheckbox
                    v-if="getShippingCheckSheetResult"
                    v-model="getShippingCheckSheetResult.materialOption"
                    :readonly="disabledInput()"
                    :value="false"
                  /><span class="font-weight-body">NO</span>
                </VCol>
              </VRow>
            </div>
          </th>
        </tr>
        <tr>
          <th
            colspan="2"
            class="text-center "
          >
            <span class="font-weight-body">Bag Filter</span>
          </th>
          <th
            v-if="disabledInput()"
            colspan="5"
            class="text-start"
            ripple
            :style="{
              borderColor: bagFilterVariant('Cotton(Pieces)') ? 'green' : '',
              borderWidth: bagFilterVariant('Cotton(Pieces)') ? '1px' : '1px',
              borderStyle: 'solid'
            }"
            :class="{ 'bg-green-lighten-3': bagFilterVariant('Cotton(Pieces)') }"
          >
            <div class="d-flex justify-center">
              <span class="font-weight-body">Cotton(Pieces)</span>
            </div>
          </th>
          <th
            v-if="disabledInput()"
            colspan="1"
            class="text-end"
            ripple
            :style="{
              borderColor: bagFilterVariant('Flannel(pieces)') ? 'green' : '',
              borderWidth: bagFilterVariant('Flannel(pieces)') ? '1px' : '1px',
              borderStyle: 'solid'
            }"
            :class="{ 'bg-green-lighten-3': bagFilterVariant('Flannel(pieces)') }"
          >
            <span class="end">
              <div class="d-flex justify-center">
                <span class="font-weight-body">Flannel(pieces)</span>
              </div>
            </span>
          </th>

          <th
            v-if="getShippingCheckSheetResult?.bagFilterOption && !disabledInput()"
            colspan="5"
            class="text-start cursor-pointer"
            ripple
            :style="{
              borderColor: bagFilterVariant('Cotton(Pieces)') ? 'green' : '',
              borderWidth: bagFilterVariant('Cotton(Pieces)') ? '1px' : '1px',
              borderStyle: 'solid'
            }"
            :class="{ 'bg-green-lighten-3': bagFilterVariant('Cotton(Pieces)') }"
            @click="setBagFilterValue('Cotton(Pieces)')"
          >
            <div class="d-flex justify-center">
              <span class="font-weight-body">Cotton(Pieces)</span>
            </div>
          </th>
          <th
            v-if="getShippingCheckSheetResult?.bagFilterOption && !disabledInput()"
            colspan="1"
            class="text-end cursor-pointer"
            ripple
            :style="{
              borderColor: bagFilterVariant('Flannel(pieces)') ? 'green' : '',
              borderWidth: bagFilterVariant('Flannel(pieces)') ? '1px' : '1px',
              borderStyle: 'solid'
            }"
            :class="{ 'bg-green-lighten-3': bagFilterVariant('Flannel(pieces)') }"
            @click="setBagFilterValue('Flannel(pieces)')"
          >
            <span class="end">
              <div class="d-flex justify-center">
                <span class="font-weight-body">Flannel(pieces)</span>
              </div>
            </span>
          </th>


          <th
            v-if="!getShippingCheckSheetResult?.bagFilterOption && !disabledInput()"
            colspan="5"
            class="text-start"
          >
            <div class="d-flex justify-center">
              <span class="font-weight-body">Cotton(Pieces)</span>
            </div>
          </th>
          <th
            v-if="!getShippingCheckSheetResult?.bagFilterOption && !disabledInput()"
            colspan="1"
            class="text-end"
          >
            <span class="end">
              <div class="d-flex justify-center">
                <span class="font-weight-body">Flannel(pieces)</span>
              </div>
            </span>
          </th>
          <th
            colspan="3"
            class="text-center "
          >
            <div class="checkbox-container">
              <VRow>
                <VCol
                  cols="6"
                  class="d-flex justify-center align-center"
                >
                  <VCheckbox
                    v-if="getShippingCheckSheetResult"
                    v-model="getShippingCheckSheetResult.bagFilterOption"
                    :readonly="disabledInput()"
                  /><span class="font-weight-body">YES</span>
                </VCol>
                <VCol
                  cols="6"
                  class="d-flex justify-center align-center"
                >
                  <VCheckbox
                    v-if="getShippingCheckSheetResult"
                    v-model="getShippingCheckSheetResult.bagFilterOption"
                    :readonly="disabledInput()"
                    :value="false"
                  /><span class="font-weight-body">NO</span>
                </VCol>
              </VRow>
            </div>
          </th>
        </tr>
      </table>
    </VCol>

    <VCol cols="12">
      <table class="custom-table">
        <tr>
          <th colspan="1">
            Filling Valve Open
          </th>
          <th
            style="max-width: 150px;"
            colspan="11"
          >
            <VRow>
              <VCol
                class="d-flex justify-center align-center"
                cols="3"
              >
                Filling Line Valve Open
              </VCol>
              <VCol ocls="9">
                <div class="d-flex justify-space-between align-center">
                  <VTextField
                    v-if="getShippingCheckSheetResult"
                    v-model="getShippingCheckSheetResult.fillingLineValveOpen"
                    :readonly="disabledInput()"
                    class="mx-2"
                    density="compact"
                  />
                </div>
              </VCol>
            </VRow>
          </th>
        </tr>
        <tr>
          <th
            colspan="1"
            class="text-start "
          >
            Filling Equipment
          </th>
          <th
            colspan="11"
            class="text-center "
          >
            <div class="d-flex">
              <VTextField
                v-if="getShippingCheckSheetResult"
                v-model="getShippingCheckSheetResult.fillingEquipment"
                :readonly="disabledInput()"
                density="compact"
                variant="outlined"
                @click:append-inner="visible = !visible"
              />
            </div>
          </th>
        </tr>
        <tr>
          <th
            colspan="1"
            class="text-start "
          >
            (Filling Order)
          </th>
          <th
            colspan="11"
            class="text-center "
          >
            <div class="d-flex">
              <VTextField
                v-if="getShippingCheckSheetResult"
                v-model="getShippingCheckSheetResult.fillingOrder"
                :readonly="disabledInput()"
                density="compact"
                variant="outlined"
                @click:append-inner="visible = !visible"
              />
            </div>
          </th>
        </tr>
        <tr>
          <th
            colspan="1"
            class="text-start "
          >
            Lot No.(Actual)
          </th>
          <th
            colspan="11"
            class="text-center "
          >
            <div>
              <VTextField
                v-if="getShippingCheckSheetResult"
                v-model="getShippingCheckSheetResult.lotNoActual"
                :readonly="disabledInput()"
                density="compact"
                variant="outlined"
                @click:append-inner="visible = !visible"
              />
            </div>
          </th>
        </tr>
        <tr>
          <th
            colspan="1"
            class="text-start "
          >
            Container
          </th>
          <th
            colspan="11"
            class="text-center "
          >
            <div>
              <VTextField
                v-if="getShippingCheckSheetResult"
                v-model="getShippingCheckSheetResult.container"
                :readonly="disabledInput()"
                density="compact"
                variant="outlined"
                @click:append-inner="visible = !visible"
              />
            </div>
          </th>
        </tr>
        <tr>
          <th
            colspan="1"
            class="text-start "
          >
            Net 
          </th>
          <th
            colspan="11"
            class="text-center "
          >
            <div Class="d-flex">
              <VTextField
                v-if="getShippingCheckSheetResult"
                v-model="getShippingCheckSheetResult.net"
                :readonly="disabledInput()"
                density="compact"
                variant="outlined"
                type="number"
                suffix="Kg."
              />
            </div>
          </th>
        </tr>
        <tr>
          <th
            colspan="1"
            class="text-start "
          >
            Point of Delivery
          </th>
          <th
            colspan="11"
            class="text-center "
          >
            <div class="checkbox-container">
              <VRow>
                <VCol
                  class="d-flex justify-center align-center"
                  cols="6"
                >
                  <VCheckbox
                    v-if="getShippingCheckSheetResult"
                    v-model="getShippingCheckSheetResult.pointOfDelivery"
                    readonly
                    value="EX"
                  />Export
                </VCol>
                <VCol
                  class="d-flex justify-center align-center"
                  cols="6"
                >
                  <VCheckbox
                    v-if="getShippingCheckSheetResult"
                    v-model="getShippingCheckSheetResult.pointOfDelivery"
                    readonly
                    value="DO"
                  />Domestic
                </VCol>
              </VRow>
            </div>
          </th>
        </tr>
        <tr>
          <th
            colspan="1"
            class="text-start "
          />
          <th
            colspan="5"
            class="text-center "
          >
            <VRow>
              <VCol
                cols="3"
                class="d-flex align-center"
              >
                Start Time
              </VCol>
              <VCol
                v-if="getShippingCheckSheetResult"
                cols="9"
              >
                <AppDateTimePicker
                  v-if="getShippingCheckSheetResult"
                  v-model="getShippingCheckSheetResult.startedDate"
                  :disabled="disabledInput()"
                  placeholder="Select time"
                  :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }"
                  density="compact"
                />
              </VCol>
            </VRow>
          </th>
          <th
            colspan="5"
            class="text-center "
          >
            <VRow>
              <VCol
                cols="3"
                class="d-flex align-center"
              >
                Finished Time
              </VCol>
              <VCol cols="9">
                <AppDateTimePicker
                  v-if="getShippingCheckSheetResult"
                  v-model="getShippingCheckSheetResult.finishedDate"
                  :disabled="disabledInput()"
                  placeholder="Select time"
                  :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }"
                  density="compact"
                />
              </VCol>
            </VRow>
          </th>
        </tr>

        <tr>
          <th
            colspan="1"
            class="text-center "
          >
            Filling Check
          </th>
          <th
            colspan="5"
            class="text-center "
          >
            Appearance
          </th>
          <th
            colspan="3"
            class="text-center "
          >
            Date Time 
          </th>
          <th
            colspan="3"
            class="text-center "
          >
            Person In Charge
          </th>
        </tr>

        <tr>
          <th
            class="text-center "
            colspan="1"
          >
            Analysis Result
          </th>
          <th
            class="text-center "
            colspan="1"
          >
            Before
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.apprearanceBefore"
              :readonly="disabledInput()"
              density="compact"
              variant="outlined"
            />
          </th>
          <th
            class="text-center "
            colspan="2"
          >
            <AppDateTimePicker
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.dateTimeBefore"
              :disabled="disabledInput()"
              placeholder="Select date and time"
              :config="{ enableTime: true, dateFormat: 'd/m/Y H:i' }"
              density="compact"
            />
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.personInchargeBefore"
              :readonly="disabledInput()"
              density="compact"
              variant="outlined"
            />
          </th>
        </tr>
        <tr>
          <th
            class="text-center "
            colspan="1"
          >
            <span>
              1<sup>st</sup>  Sampling
            </span>
          </th>
          <th
            class="text-center "
            colspan="1"
          >
            Start
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.apprearanceStart"
              :readonly="disabledInput()"
              density="compact"
              variant="outlined"
            />
          </th>
          <th
            class="text-center "
            colspan="2"
          >
            <AppDateTimePicker
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.dateTimeStart"
              :disabled="disabledInput()"
              placeholder="Select date and time"
              :config="{ enableTime: true, dateFormat: 'd/m/Y H:i' }"
              density="compact"
            />
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.personInchargeStart"
              :readonly="disabledInput()"
              density="compact"
              variant="outlined"
            />
          </th>
        </tr>
        <tr>
          <th
            class="text-center "
            colspan="1"
          >
            <span>
              2<sup>nd</sup>  Sampling
            </span>
          </th>
          <th
            class="text-center "
            colspan="1"
          >
            Middle
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.apprearanceMiddle"
              :readonly="disabledInput()"
              density="compact"
              variant="outlined"
            />
          </th>
          <th
            class="text-center "
            colspan="2"
          >
            <AppDateTimePicker
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.dateTimeMiddle"
              :disabled="disabledInput()"
              placeholder="Select date and time"
              :config="{ enableTime: true, dateFormat: 'd/m/Y H:i' }"
              density="compact"
            />
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.personInchargeMiddle"
              :readonly="disabledInput()"
              density="compact"
              variant="outlined"
            />
          </th>
        </tr>
        <tr>
          <th
            class="text-center "
            colspan="1"
          >
            <span>
              3<sup>rd</sup>  Sampling
            </span>
          </th>
          <th
            class="text-center "
            colspan="1"
          >
            Final
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.apprearanceFinal"
              :readonly="disabledInput()"
              density="compact"
              variant="outlined"
            />
          </th>
          <th
            class="text-center "
            colspan="2"
          >
            <AppDateTimePicker
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.dateTimeFinal"
              :disabled="disabledInput()"
              placeholder="Select date and time"
              :config="{ enableTime: true, dateFormat: 'd/m/Y H:i' }"
              density="compact"
            />
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.personInchargeFinal"
              :readonly="disabledInput()"
              density="compact"
              variant="outlined"
            />
          </th>
        </tr>
        <tr>
          <th
            class="text-center "
            colspan="1"
          >
            <span>
              4<sup>th</sup>  Sampling
            </span>
          </th>
          <th
            class="text-center "
            colspan="1"
          >
            In Lorry
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.apprearanceInLorry"
              :readonly="disabledInput()"
              density="compact"
              variant="outlined"
            />
          </th>
          <th
            class="text-center "
            colspan="2"
          >
            <AppDateTimePicker
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.dateTimeInLorry"
              :disabled="disabledInput()"
              placeholder="Select date and time"
              :config="{ enableTime: true, dateFormat: 'd/m/Y H:i' }"
              density="compact"
            />
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.personInchargeInLorry"
              :readonly="disabledInput()"
              density="compact"
              variant="outlined"
            />
          </th>
        </tr>
      </table>
    </VCol>
    
    <VCol cols="12">
      <table class="custom-table">
        <thead>
          <tr>
            <th
              class="text-center "
              colspan="6"
            >
              Picture
            </th>
            <th
              class="text-center "
              colspan="6"
            >
              <div class="d-flex justify-space-between align-center">
                Seal No. <VTextField
                  v-if="getShippingCheckSheetResult"
                  v-model="getShippingCheckSheetResult.sealNo"
                  :readonly="disabledInput()"
                  class="mx-2"
                  density="compact"
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody v-if="!getShippingCheckSheetResult?.isLorry">
          <tr
            v-for="(image, index) in imagePictureFlexi"
            :key="index"
          >
            <td
              style="min-width: 410px;"
              colspan="6"
            >
              <VImg :src="image" />
            </td>
            <td colspan="6">
              <div class="d-flex justify-center">
                <VRow>
                  <VCol cols="12">
                    <div
                      v-if="index === 0"
                      class="d-flex justify-center"
                    >
                      Already Cleaned
                    </div>
                    <div
                      v-if="index === 1"
                      class="d-flex justify-center"
                    >
                      Shipping Mark and Valve
                    </div>
                    <div
                      v-if="index === 2"
                      class="d-flex justify-center"
                    >
                      Inside Tank
                    </div>
                    <div
                      v-if="index === 3"
                      class="d-flex justify-center"
                    >
                      Cleaning Hose and Air Blow
                    </div>
                  </VCol>
                  <VCol
                    cols="6"
                    class="d-flex justify-center align-center"
                  >
                    <div v-if="index === 0">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.flexiAlreadyCleanedOption"
                        :readonly="disabledInput()"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">YES</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 1">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.flexiShippingMarkOption"
                        :readonly="disabledInput()"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">YES</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 2">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.flexiInsideTankOption"
                        :readonly="disabledInput()"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">YES</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 3">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.flexiCleaningHoseAirBlowOption"
                        :readonly="disabledInput()"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">YES</span>
                        </template>
                      </VCheckbox>
                    </div>
                  </VCol>
                  <VCol
                    cols="6"
                    class="d-flex justify-center align-center"
                  >
                    <div v-if="index === 0">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.flexiAlreadyCleanedOption"
                        :readonly="disabledInput()"
                        :value="false"
                        class="px-10"
                        label="NO"
                      >
                        <template #label>
                          <span class="font-size">NO</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 1">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.flexiShippingMarkOption"
                        :readonly="disabledInput()"
                        class="px-10"
                        label="NO"
                        :value="false"
                      >
                        <template #label>
                          <span class="font-size">NO</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 2">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.flexiInsideTankOption"
                        :readonly="disabledInput()"
                        :value="false"
                        class="px-10"
                        label="NO"
                      >
                        <template #label>
                          <span class="font-size">NO</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 3">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.flexiCleaningHoseAirBlowOption"
                        :readonly="disabledInput()"
                        :value="false"
                        class="px-10"
                        label="NO"
                      >
                        <template #label>
                          <span class="font-size">NO</span>
                        </template>
                      </VCheckbox>
                    </div>
                  </VCol>
                </VRow>
              </div>
            </td>
          </tr>
        </tbody>

        <tbody v-if="getShippingCheckSheetResult?.isLorry">
          <tr
            v-for="(image, index) in imagePictureLorry"
            :key="index"
          >
            <td
              style="min-width: 410px;"
              colspan="6"
            >
              <VImg :src="image" />
            </td>
            <td colspan="6">
              <div class="d-flex justify-center">
                <VRow>
                  <VCol cols="12">
                    <div
                      v-if="index === 0"
                      class="d-flex justify-center"
                    >
                      Already Cleaned
                    </div>
                    <div
                      v-if="index === 1"
                      class="d-flex justify-center"
                    >
                      After Seal
                    </div>
                    <div
                      v-if="index === 2"
                      class="d-flex justify-center"
                    >
                      Inside Tank
                    </div>
                    <div
                      v-if="index === 3"
                      class="d-flex justify-center"
                    >
                      Cleaning Hose and Air Blow
                    </div>
                    <div
                      v-if="index === 4"
                      class="d-flex justify-center"
                    >
                      Cover By Coping
                    </div>
                  </VCol>
                  <VCol
                    cols="6"
                    class="d-flex justify-center align-center"
                  >
                    <div v-if="index === 0">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.lorryAlreadyCleanedOption"
                        :readonly="disabledInput()"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">YES</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 1">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.lorryAfterSealOption"
                        :readonly="disabledInput()"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">YES</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 2">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.lorryInsideTankOption"
                        :readonly="disabledInput()"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">YES</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 3">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.lorryCleaningHoseAirBlowOption"
                        :readonly="disabledInput()"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">YES</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 4">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.lorryCoverByCopingOption"
                        :readonly="disabledInput()"
                        
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">YES</span>
                        </template>
                      </VCheckbox>
                    </div>
                  </VCol>
                  <VCol
                    cols="6"
                    class="d-flex justify-center align-center"
                  >
                    <div v-if="index === 0">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.lorryAlreadyCleanedOption"
                        :readonly="disabledInput()"
                        :value="false"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">NO</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 1">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.lorryAfterSealOption"
                        :readonly="disabledInput()"
                        :value="false"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">NO</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 2">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.lorryInsideTankOption"
                        :readonly="disabledInput()"
                        :value="false"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">NO</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 3">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.lorryCleaningHoseAirBlowOption"
                        :readonly="disabledInput()"
                        :value="false"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">NO</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 4">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.lorryCoverByCopingOption"
                        :readonly="disabledInput()"
                        :value="false"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">NO</span>
                        </template>
                      </VCheckbox>
                    </div>
                  </VCol>
                </VRow>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </VCol>

    <VCol cols="12">
      <div
        class="mb-2"
        style="font-size: 12px;"
      >
        Remark
      </div>
      <table class="custom-table">
        <tr>
          <th colspan="12">
            <VTextarea
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.remark"
              :readonly="disabledInput()"
            >
              <template #label>
                <span class="font-size">Remark</span>
              </template>
            </VTextarea>
          </th>
        </tr>
      </table>
    </VCol>

    <VCol cols="12">
      <table class="custom-table">
        <thead>
          <tr>
            <th
              class="text-center"
              colspan="12"
            >
              <span>Inspector </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style="min-width: 150px;"
              colspan="4"
            >
              Staff: <span v-if="getShippingCheckSheetResult">{{ getShippingCheckSheetResult.updatedBy }}</span>
            </td>
            <td
              style="min-width: 150px;"
              colspan="4"
            >
              Leader: <span v-if="getShippingCheckSheetResult">{{ getShippingCheckSheetResult.leadedBy }}</span>
            </td>
            <td
              style="min-width: 150px;"
              colspan="4"
            >
              Approver: <span v-if="getShippingCheckSheetResult">{{ getShippingCheckSheetResult.approvedBy }}</span>
            </td>
          </tr>
          <tr>
            <td
              style="height: 35px;"
              colspan="4"
            >
              <span v-if="getShippingCheckSheetResult">{{ formatToDate(getShippingCheckSheetResult.updatedDate) }}</span>
            </td>
            <td colspan="4">
              <span v-if="getShippingCheckSheetResult">{{ formatToDate(getShippingCheckSheetResult.leadedDate) }}</span>
            </td>
            <td colspan="4">
              <span v-if="getShippingCheckSheetResult">{{ formatToDate(getShippingCheckSheetResult.approvedDate) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </VCol>

    <VCol
      v-if="department === 'Warehouse' || showBtnCheckSheet()"
      cols="12"
    >
      <div class="d-flex justify-end">
        <VBtn
          v-if="statusModel === 1102 || statusModel === 1103 || statusModel === 0"
          class="mx-2"
          color="warning"
          @click="handleSaveDraft"
        >
          Save Draft
        </VBtn>
        <VBtn
          v-if="statusModel === 1102 || statusModel === 1103 || statusModel === 0"
          class="mx-2"
          @click="handleSubmit('submit')"
        >
          WH1 ACCEPT
        </VBtn>
        <VBtn
          v-if="statusModel === 1104"
          class="mx-2"
          color="purple-accent-4"
          @click="openConfirmDialog('back')"
        >
          Send Back
        </VBtn>
        <VBtn
          v-if="statusModel === 1104"
          class="mx-2"
          @click="handleSubmit('leaderapprove')"
        >
          WH2 ACCEPT
        </VBtn>
      </div>
    </VCol>
  </VRow>


  <!--  Component -->
  <section>
    <div>
      <!-- ใช้ AuthenticatorDialog Component -->
      <AlertWord2
        v-model="isDialogVisibleAlertDialog"
        :word="wordForSubmit"
        :subword="subWordForSubmit"
        :success="successDialAlert"
      />
    </div>
  </section>

  <!-- ใช้ confirmDialog component -->
  <div>
    <ConfirmDialog2
      ref="confirmDialog2"
      :message="wordForSubmit"
      @confirm="handleConfirmAction"
      @cancel="handleCancel"
    />
  </div>
</template>

<style scoped src="../Flexi/flexi.scss">

</style>

