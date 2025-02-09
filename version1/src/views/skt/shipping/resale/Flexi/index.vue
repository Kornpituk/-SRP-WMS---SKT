<script setup>
const vasss = ref('dd')
import image02 from '@/views/skt/resale/ibc/img/02.png'
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
import { urlApi } from '@/api'  //---------------------- Import Api for Url *****
import { VDataTable } from 'vuetify/labs/VDataTable'

const whereHouse = localStorage.getItem('whereHouseName')
const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')

import { useGetShippingCheckSheetService, useSaveShippingCheckSheetService,
  useShippingCheckSheetLorryService,
  
} from "@/services/skt/shipmentPlan/lorryFlexiServices"

import { useRoute } from 'vue-router'
import { onMounted, watch } from 'vue'

const route = useRoute()

const dataProductRow = ref(JSON.parse(sessionStorage.getItem("productDataSession")))

const soEIdModel = ref(dataProductRow.value.soEtlLogDetailJournalID)

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

function formatDateTime(value) {
  // ตรวจสอบว่าเป็นรูปแบบ ISO 8601 แบบมี "Z"
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
    return value.replace("T", " ").slice(0, 16)
  }

  // ตรวจสอบว่าเป็นรูปแบบ ISO 8601 แบบไม่มี "Z"
  else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}$/.test(value)) {
    return value.replace("T", " ").slice(0, 16)
  }

  // ตรวจสอบว่าเป็นรูปแบบ "YYYY-MM-DD HH:mm"
  else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(value)) {
    return new Date(value.replace(" ", "T") + ":00.000Z").toISOString()
  }

  // ตรวจสอบว่าเป็นรูปแบบ "YY/MM/DD HH:mm"
  else if (/^\d{2}\/\d{2}\/\d{2} \d{2}:\d{2}$/.test(value)) {
    let [yy, mm, dd, hh, min] = value.match(/\d+/g)
    let year = parseInt(yy) + 2000 // แปลงปี 2 หลักให้เป็น 4 หลัก (เช่น 20 → 2020)
    
    return new Date(`${year}-${mm}-${dd}T${hh}:${min}:00.000Z`).toISOString()
  } 
  else {
    throw new Error("Invalid date format")
  }
}

//-------------------------- Section Get Data --------------------------------

const { getShippingCheckSheetResult,
  errorGetShippingCheckSheet,
  fetchShippingCheckSheet } = useGetShippingCheckSheetService()

const handleFetchDataLorry = async () => {
  try{
    const result = await fetchShippingCheckSheet(urlApi.value, 
      'ShippingLorryFlexi', whereHouse, accessTokenAtStore, soEIdModel.value)

  
    if(result){
 
      getShippingCheckSheetResult.value = result.data.reportLorryFlexi

      console.log('getShippingCheckSheetResult: ', getShippingCheckSheetResult.value)

      const dataNew =  await Promise.all(
        getShippingCheckSheetResult.value.map(async item => ({
          ...item,
      
          startedDate: formatDateTime(item.startedDate), // ใช้ await ที่นี่
          finishedDate: formatDateTime(item.finishedDate), // ใช้ await ที่นี่
      
          dateTimeStart: formatDateTime(item.dateTimeStart), // ใช้ await ที่นี่
          dateTimeBefore: formatDateTime(item.dateTimeBefore), // ใช้ await ที่นี่
          dateTimeMiddle: formatDateTime(item.dateTimeMiddle), // ใช้ await ที่นี่
          dateTimeFinal: formatDateTime(item.dateTimeFinal), // ใช้ await ที่นี่
          dateTimeInLorry: formatDateTime(item.dateTimeInLorry), // ใช้ await ที่นี่
        })),
      )
      
      getShippingCheckSheetResult.value = dataNew

      console.log('getShippingCheckSheetResult: ', getShippingCheckSheetResult.value)
    }else{
      console.error('Error: ', errorGetShippingCheckSheet.value)
    }
  }catch(e){
    console.error(e)
  }
}

watch(async() => {
  await handleFetchDataLorry()
})

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
  mesh: data.mesh ?? "",
  material: data.material ?? "",
  bagFilter: data.bagFilter ?? "",
  fillingLineValveOpen: data.fillingLineValveOpen ?? "",
  fillingEquipment: data.fillingEquipment ?? "",
  fillingOrder: data.fillingOrder ?? "",
})

const prepareCommonDataPart3 = data => ({
  lotNoActual: data.lotNoActual ?? "",
  container: data.container ?? "",
  net: data.net ?? 22,
  pointOfDelivery: data.pointOfDelivery ?? "",

  // startedDate: (data.startedDate),
  // finishedDate: (data.startedDate),
  startedDate: "2020-05-02T08:08:00.000Z",
  finishedDate: "2020-05-02T08:08:00.000Z",
})

const prepareAppearanceData = data => ({
  apprearanceBefore: data.apprearanceBefore ?? "",
  apprearanceStart: data.apprearanceStart ?? "",
  apprearanceMiddle: data.apprearanceMiddle ?? "",
  apprearanceFinal: data.apprearanceFinal ?? "",
  apprearanceInLorry: data.apprearanceInLorry ?? "",
})

const prepareDateTimeData = data => ({
  dateTimeStart: formatDateTime(data.dateTimeStart) ?? new Date().toISOString(),
  dateTimeBefore: formatDateTime(data.dateTimeBefore) ?? new Date().toISOString(),
  dateTimeMiddle: formatDateTime(data.dateTimeMiddle) ?? new Date().toISOString(),
  dateTimeFinal: formatDateTime(data.dateTimeFinal) ?? new Date().toISOString(),
  dateTimeInLorry: formatDateTime(data.dateTimeInLorry) ?? new Date().toISOString(),
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

const handleSaveDraft = async () => {

  const requestBody = prepareLorryFlexiData(getShippingCheckSheetResult.value)

  try{
    const result = await saveShippingCheckSheet(
      urlApi.value, 
      'save', whereHouse, accessTokenAtStore, requestBody,
    )

    if(result){
      textAlertDialogFunction(alertWordConst.saveDraft, true)
      setTimeout(() => {
      // location.reload()
      }, 500) // 0.5 วินาที
    }else{
      textAlertDialogFunction(alertWordConst.saveDraft, false)
      setTimeout(() => {
      // location.reload()
      }, 500) // 0.5 วินาที
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
  try{
    const result = await submitShipmentPlan(
      urlApi.value, 
      type, whereHouse, accessTokenAtStore, soEIdModel.value,
    )

    if(result){
      if(type === 'submit'){
        textAlertDialogFunction(alertWordConst.submit, true)
        setTimeout(() => {
          location.reload()
        }, 500) // 0.5 วินาที
      }else if(type === 'leaderapprove'){
        textAlertDialogFunction(alertWordConst.approve, true)
        setTimeout(() => {
          location.reload()
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
      }
    }
  }catch(error){
    console.log(error)
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
        v-if="typeResalse ==='Flexi'"
        style="font-weight: bold;"
      >Filling Direction & Report to FLEXI</span>
      <span
        v-if="typeResalse ==='Lorry'"
        style="font-weight: bold;"
      >Filling Direction & Report to Lorry</span>
    </VCol>
    <VCol
      class="text-center d-flex justify-end align-center"
      cols="2"
    >
      <VBtn
        :variant="typeResalse === 'Lorry' ? 'tonal' : 'flat'"
        @click="typeResalse = 'Flexi'"
      >
        Flexi
      </VBtn>
      <VBtn
        :variant="typeResalse === 'Flexi' ? 'tonal' : 'flat'"
        @click="typeResalse = 'Lorry'"
      >
        Lorry
      </VBtn>
    </VCol>


    <VCol cols="12">
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
            <span>Customer Name: </span><span class="font-weight-body">{{ dataProductRow.shippingUserName }}</span>
          </th>
          <th
            colspan="4"
            class="text-center"
          >
            <span>Delivery Place: </span><span class="font-weight-body">{{ }}</span>
          </th>
          <th
            colspan="4"
            class="text-center"
          >
            <span> Weight: </span><span class="font-weight-body">{{ getShippingCheckSheetResult?.weight }}</span><span> Kg.</span>
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
            class="text-center "
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
          <th
            colspan="2"
            class="text-center "
            style="min-width: 150px;"
          >
            <span class="font-weight-body">{{ dataProductRow.lot }}</span>
          </th>
          <td
            colspan="8"
            class="text-center "
          >
            <span>Mix Lot no.PA24020032 = 8 IBC + PA24030012 = 8 IBC</span>
          </td>
        </tr>
      </table>
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
            colspan="6"
            class="text-center "
          >
            <span class="font-weight-body">80&nbsp;&nbsp;&nbsp;100&nbsp;&nbsp;&nbsp;120&nbsp;&nbsp;&nbsp;150&nbsp;&nbsp;&nbsp;200&nbsp;&nbsp;&nbsp;300</span>
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
                  /><span class="font-weight-body">YES</span>
                </VCol>
                <VCol
                  cols="6"
                  class="d-flex justify-center align-center"
                >
                  <VCheckbox
                    v-if="getShippingCheckSheetResult"
                    v-model="getShippingCheckSheetResult.meshOption"
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
            class="text-center "
          >
            <span class="font-weight-body">VESEL……….    LOT NO.…PA24020033</span>
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
                  /><span class="font-weight-body">YES</span>
                </VCol>
                <VCol
                  cols="6"
                  class="d-flex justify-center align-center"
                >
                  <VCheckbox
                    v-if="getShippingCheckSheetResult"
                    v-model="getShippingCheckSheetResult.materialOption"
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
            colspan="5"
            class="text-start"
          >
            <div class="d-flex justify-center">
              <span class="font-weight-body">Cotton( Pieces)</span>
            </div>
          </th>
          <th
            colspan="1"
            class="text-end "
          >
            <span class="end">
              <div class="d-flex justify-center">
                <span class="font-weight-body">Flannel( pieces)</span>
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
                  /><span class="font-weight-body">YES</span>
                </VCol>
                <VCol
                  cols="6"
                  class="d-flex justify-center align-center"
                >
                  <VCheckbox
                    v-if="getShippingCheckSheetResult"
                    v-model="getShippingCheckSheetResult.bagFilterOption"
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
          <th colspan="5">
            Filling Line Valve Open
          </th>
          <th colspan="4">
            <div class="d-flex justify-space-between align-center">
              Checked By <VTextField
                v-if="getShippingCheckSheetResult"
                v-model="getShippingCheckSheetResult.fillingLineValveOpen"
                class="mx-2"
                density="compact"
              />
            </div>
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
            rowspan="2"
            class="text-center "
          >
            <div class="d-flex">
              <VTextField
                v-if="getShippingCheckSheetResult"
                v-model="getShippingCheckSheetResult.fillingEquipment"
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
              <VCol cols="9">
                <AppDateTimePicker
                  v-if="getShippingCheckSheetResult"
                  v-model="getShippingCheckSheetResult.startedDate"
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
            Time Date
          </th>
          <th
            colspan="3"
            class="text-center "
          >
            Person Incharge
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
              placeholder="Select date and time"
              :config="{ enableTime: true, dateFormat: 'd/m/y H:i' }"
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
              placeholder="Select date and time"
              :config="{ enableTime: true, dateFormat: 'd/m/y H:i' }"
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
              placeholder="Select date and time"
              :config="{ enableTime: true, dateFormat: 'd/m/y H:i' }"
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
              placeholder="Select date and time"
              :config="{ enableTime: true, dateFormat: 'd/m/y H:i' }"
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
              placeholder="Select date and time"
              :config="{ enableTime: true, dateFormat: 'd/m/y H:i' }"
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
                  class="mx-2"
                  density="compact"
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody v-if="typeResalse === 'Flexi'">
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

        <tbody v-if="typeResalse === 'Lorry'">
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
            <td colspan="4">
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

    <VCol cols="12">
      <div class="d-flex justify-end">
        <VBtn
          class="mx-2"
          color="warning"
          @click="handleSaveDraft"
        >
          Save Draft
        </VBtn>
        <VBtn
          class="mx-2"
          @click="handleSubmit('submit')"
        >
          Submit
        </VBtn>
        <VBtn
          class="mx-2"
          @click="handleSubmit('leaderapprove')"
        >
          Approve
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
</template>

<style scoped src="../Flexi/flexi.scss">

</style>
