<script setup>
import { hexToRgb } from '@layouts/utils'
import {
  useTheme,
} from 'vuetify'

import axiosIns from '@axios'
import { defineProps, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

//------------------------------------- Define Props -------------------------------
const props = defineProps({
  dataset: {
    type: Array,
    required: true,
  },
  history: {
    type: Array, // หรือประเภทของข้อมูลที่ต้องการรับ
    required: true, // หากต้องการให้ prop นี้เป็นบังคับในการใช้งาน
  },
  card: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  complateAllProps: {
    type: Array,
    required: true,
  },
  awaitAllProps: {
    type: Array,
    required: true,
  },
  dateCurrent: {
    type: String,
    required: true,
  },
})

const route = useRoute()

const startDateQuery = ref('')
const endDateQuery = ref('')
const typeDateQuery = ref(route.query.type)
const whereHouse = ref('')

watchEffect(() => {
  if(localStorage.getItem('whereHouseName')){
    whereHouse.value = localStorage.getItem('whereHouseName')
  }
})

import { urlApi } from '@/api'
 
const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')
const warehouseShowHeaderPerformance = ref('')

const getDataProductNewData = () => {

  axiosIns.get(`${urlApi.value}/api/Auth/GetLocation`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {

      warehouseShowHeaderPerformance.value = response.data

      // ค้นหา warehouse ที่มี id = '001'
      const warehouseWithId = warehouseShowHeaderPerformance.value.find(warehouse => warehouse.id === whereHouse.value)
      
      if (warehouseWithId) {
        console.log('Found warehouse with id ', warehouseWithId)
        warehouseShowHeaderPerformance.value = warehouseWithId.name
      } else {
        console.log('Warehouse with id not found')
      }
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })
}

watchEffect(getDataProductNewData)

import PerformancePicking from '@/views/dashboard/main/receiptBy/picking/index.vue'
import PerformanceReceived from '@/views/dashboard/main/receiptBy/received/index.vue'


import PerformancePickingAwait from '@/views/dashboard/main/receiptByAwait/picking/index.vue'
import PerformanceReceivedAwait from '@/views/dashboard/main/receiptByAwait/received/index.vue'


const vuetifyTheme = useTheme()


//--------------------------------------- Card Action expand-transition------------------
const show = ref(false)

//-------------------------------------- Dialog Details ------------------------------------
const isDialogDetailVisible = ref(false)
const isDialogDetailVisibleAwait = ref(false)

const complateAll = ref ('')
const awaitAll = ref('')

const historyProp = ref(false)
const historyPropCancel = ref(null)

const historyPropAwait = ref(false)
const historyPropCancelAwait = ref(null)

const blockHistoryProp = type => {
  
  if( type === 'receiving'){
    historyPropCancel.value = true
    isDialogDetailVisible.value = false
    sessionStorage.setItem('historyPropBlock', true)
    isDialogDetailVisible.value = false
  }else if('await'){
    historyPropAwait.value = true
    historyPropCancelAwait.value = false
    sessionStorage.setItem('historyPropBlockAwait', true)
    isDialogDetailVisibleAwait.value = false
  }
  
  
}

watchEffect(() => {

  complateAll.value = props.complateAllProps
  awaitAll.value = props.awaitAllProps
})

const getSwitchThemeColor = ref('cyan-darken-1')
const getSwitchThemeColorText = ref('white')
const logicLuxOn = ref(false)
const hover = ref(false)

watchEffect(() => {
  localStorage.getItem('srp-theme-config')
  if(localStorage.getItem('srp-theme-config') === 'primary') {
    getSwitchThemeColor.value = 'cyan-lighten-1'
  }else if(localStorage.getItem('srp-theme-config') === 'warehouse-harmony'){
    getSwitchThemeColor.value = 'cyan-lighten-3'
    getSwitchThemeColorText.value = 'black'
  } else if(localStorage.getItem('srp-theme-config') === 'inventory-insight'){
    getSwitchThemeColor.value = 'cyan-lighten-2'
  } else if(localStorage.getItem('srp-theme-config') === 'logistics-luxe'){
    
    logicLuxOn.value = true

    if(hover.value){
      getSwitchThemeColor.value = 'cyan-lighten-1'
      getSwitchThemeColorText.value = 'white'
    }else {
      getSwitchThemeColor.value = 'white'
      getSwitchThemeColorText.value = 'cyan-lighten-1'
    }
  } else if(localStorage.getItem('srp-theme-config') === 'operation-optimizer'){
    logicLuxOn.value = true

    if(hover.value){
      getSwitchThemeColor.value = 'white'
      getSwitchThemeColorText.value = 'cyan-lighten-1'
    }else {
      getSwitchThemeColor.value = 'cyan-lighten-4'
      getSwitchThemeColorText.value = 'black'
    }
  }
})

//----------------------------------------------------- Tabs -------------------------------------------
const currentTabChartMix = ref(0)

const historyCard = ref(props.card)

watchEffect( () => {
  if(props.card === 'received'){
    currentTabChartMix.value = 0
  } else if (props.card === 'picking') {
    currentTabChartMix.value = 1
  } else {
  }
})

import '@vuepic/vue-datepicker/dist/main.css'

const menusVariant = ['primary' ]

const typeDate = ref(8)
const nameTypeDate = ref('Daily')

const currentDate = new Date()
const formattedDateTime = ref('')

const options = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false, // ถ้าต้องการเวลาในรูปแบบ 24 ชั่วโมง
}

const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`

const oneWeekAgo = new Date(currentDate.getTime() - (7 * 24 * 60 * 60 * 1000))
const formattedDateOneWeekAgo = `${oneWeekAgo.getDate().toString().padStart(2, '0')}/${(oneWeekAgo.getMonth() + 1).toString().padStart(2, '0')}/${oneWeekAgo.getFullYear()}`+` to `+formattedDate

const oneMonthAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate())
const formattedDateOneMonthAgo = `${oneMonthAgo.getDate().toString().padStart(2, '0')}/${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}/${oneMonthAgo.getFullYear()}`+` to `+formattedDate

watch(() => {
  const currentDate = new Date()

  // formattedDateTime.value = currentDate.toLocaleString('en-GB', options)
  formattedDateTime.value = props.dateCurrent

})

const formatDateNew = date => {

  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

//--------------------------------------- Menu Select Type Date Picker -----------------------------
//------------- Model ----------------------------
const showDatepickerDateMax = ref(true)
const showDatepickerWeek = ref(false)
const showDatepickerMonth = ref(false)
const showDatepickerCustom = ref(false)

const dateMax = ref(new Date()) //Model date-max
const dateWeek = ref(new Date()) //Model date-max
const dateMonth = ref(new Date()) //Model date-max

onMounted(() => {
  const startDate = new Date()
  const endDate = new Date(new Date().setDate(startDate.getDate() + 7))

  dateCustom.value = [startDate, endDate]
})

const dateCustom = ref('') //Model date-max

const datePickerMaster = ref(null)  // เริ่มต้นเป็น null

const startDate = ref(null)
const endDate = ref(null)
const selectedMonth = ref(null)
const selectedYear = ref(null)

const itemsMenuTypeDate = [
  { title: 'Day', value: 1 }, 
  { title: 'Week', value: 2 }, 
  { title: 'Month', value: 3 },
  { title: 'Custom', value: 4 },
]

const typeSelectDatepicker = ref(0)

watchEffect(() => { // function check type datepicker with select

  const typeSelectDatepickerHistoryCheck = ref('')

  localStorage.getItem('typeSelectDatepickerHistory', typeSelectDatepickerHistoryCheck.value)
  if(typeSelectDatepickerHistoryCheck.value === 'day true'){
    showDatepickerDateMax.value = true
  } else if(typeSelectDatepickerHistoryCheck.value === 'week true'){
    showDatepickerWeek.value = true
  } else if(typeSelectDatepickerHistoryCheck.value === 'month true'){
    showDatepickerMonth.value = true
  } else if(typeSelectDatepickerHistoryCheck.value === 'custom true'){
    showDatepickerCustom.value = true
  } else if(typeSelectDatepicker.value === 1){
    showDatepickerCustom.value = false
    showDatepickerMonth.value = false
    showDatepickerWeek.value = false
    showDatepickerDateMax.value = true
    localStorage.setItem('typeSelectDatepickerHistory', 'day true')
    datePickerMaster.value = dateMax.value
  } else if(typeSelectDatepicker.value === 2){
    showDatepickerCustom.value = false
    showDatepickerMonth.value = false
    showDatepickerWeek.value = true
    localStorage.setItem('typeSelectDatepickerHistory', 'week true')
    showDatepickerDateMax.value = false
    datePickerMaster.value = dateWeek.value
  } else if(typeSelectDatepicker.value === 3){
    showDatepickerCustom.value = false
    showDatepickerMonth.value = true
    localStorage.setItem('typeSelectDatepickerHistory', 'month true')
    showDatepickerWeek.value = false
    showDatepickerDateMax.value = false
    datePickerMaster.value = dateMonth.value
  } else if(typeSelectDatepicker.value === 4){
    showDatepickerCustom.value = true
    localStorage.setItem('typeSelectDatepickerHistory', 'custom true')
    showDatepickerMonth.value = false
    showDatepickerWeek.value = false
    showDatepickerDateMax.value = false
    datePickerMaster.value = dateCustom.value
  }
})

//--------------  Type Chart  -------------------- 

//---------- MOdel------
const btnTypeChartDayDisabled = ref(false)
const btnTypeChartDayCheck = ref(false)
const btnTypeChartTimeCheck = ref(false)

const colorBtnChartDay = ref("secondary")
const colorBtnChartTime = ref("green-lighten-4")

const variantBtnChartDay = ref("tonal")
const variantBtnChartTime = ref("flat")

const typeSelectDatepickerHistory = ref('')

watchEffect(() => {

  // console.log('datePickerMaster value', datePickerMaster.value)

  if(showDatepickerDateMax.value === true && showDatepickerCustom.value === false){
    colorBtnChartDay.value = 'secondary'
    variantBtnChartDay.value = 'tonal'
    colorBtnChartTime.value = 'green-lighten-4'
    variantBtnChartTime.value = 'flat'
    btnTypeChartDayDisabled.value = true
    typeDate.value = 8
  }

  else if(!showDatepickerDateMax.value || !showDatepickerCustom.value){
    
    btnTypeChartDayDisabled.value = false
    if(btnTypeChartDayCheck.value){
      colorBtnChartTime.value = 'secondary'
      variantBtnChartTime.value = 'tonal'
      colorBtnChartDay.value = 'green-lighten-4'
      variantBtnChartDay.value = 'flat'
      typeDate.value = 7
    }
    else if(btnTypeChartTimeCheck.value){
      colorBtnChartTime.value = 'green-lighten-4'
      variantBtnChartTime.value = 'flat'
      colorBtnChartDay.value = 'secondary'
      variantBtnChartDay.value = 'tonal'
      typeDate.value = 8
    }
  }
})


watch(datePickerMaster, newValue => {
  if (Array.isArray(newValue)) {
    // ถ้าเป็น Array ให้เก็บค่าของ startDate และ endDate จาก Array นั้น
    if (newValue.length === 2) {
      startDate.value = newValue[0]
      endDate.value = newValue[1]
    }
  } else if (newValue instanceof Date) {
    // ถ้าเป็น Date เดี่ยว ให้เก็บค่าของ startDate และ endDate เป็นค่าวันเดียวกัน
    startDate.value = newValue
    endDate.value = newValue
  } else if (newValue && typeof newValue === 'object' && 'month' in newValue && 'year' in newValue) {
    // ถ้าเป็น Object ที่มี month และ year
    selectedMonth.value = newValue.month
    selectedYear.value = newValue.year

    // ตั้งค่า startDate และ endDate เป็นวันที่เริ่มต้นและสิ้นสุดของเดือนนั้น ๆ
    startDate.value = new Date(newValue.year, newValue.month - 1, 1)
    endDate.value = new Date(newValue.year, newValue.month, 0)  // วันสุดท้ายของเดือน
  } else {
    // ถ้าไม่เป็นอะไรจากข้างบน ให้ reset ค่า
    startDate.value = null
    endDate.value = null
  }
}, { immediate: true })


const datePropMasterStart =  ref((formattedDateTime))
const datePropMasterEnd =  ref((formattedDateTime))
</script>

 <!-- @click="isDialogDetailVisible = true" -->
<template>
  <VCard
    v-if="!logicLuxOn"
    :color="getSwitchThemeColor"
  >
    <VCardText>
      <div class="d-flex align-center justify-center">
        <VIcon
          :color="getSwitchThemeColorText"
          size="80"
          icon=" mdi-chart-box"
        />
      </div>
    </VCardText>
    <VCardText class="clamp-text text-white mb-0">
      <div class="d-flex align-center justify-center ">
        <span
          style="font-size: 16px; font-weight: bolder;"
          class=" clamp-text text-white"
          :class="`text-${getSwitchThemeColorText}`"
        >
          {{ $t('Performance') }}
        </span>
      </div>
    </VCardText>

    <!-- MAX - MIN -->
    <VCardText class="">
      <VRow no-gutters>
        <VCol>
          <VCard
            class="cursor-pointer pa-0"
            ripple
            variant="text"
            @click="isDialogDetailVisible = true"
          >
            <VCardText class="pa-0">
              <div class="d-flex align-center justify-center mb-3">
                <span
                  style="font-size: 16px; font-weight: bolder;"
                  class="me-2 text-white"
                  :class="`text-${getSwitchThemeColorText}`"
                >{{ $t('Completed') }}</span>
              </div>

              <VRow class="d-flex justify-center ">
                <VCol
                  class="d-flex justify-center align-center"
                  cols="12"
                >
                  <div>
                    <span
                      :class="`text-${getSwitchThemeColorText}`"
                      class="text-h5 text-disabled clamp-text text-white"
                    >{{ complateAll }}</span>
                  </div>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>

        <VCol cols="2">
          <div class="d-flex flex-column align-center justify-center h-100">
            <VDivider
              class="border-opacity-100 mx-auto"
              :color="getSwitchThemeColorText"
              vertical
            />
          </div>
        </VCol>

        <VCol>
          <VCard
            class="cursor-pointer pa-0"
            ripple
            variant="text"
            @click="isDialogDetailVisibleAwait = true"
          >
            <VCardText class="pa-0">
              <div class="d-flex align-center justify-center mb-3">
                <span
                  style="font-size: 16px; font-weight: bolder;"
                  class="me-2 text-white"
                  :class="`text-${getSwitchThemeColorText}`"
                >{{ $t('Await') }}</span>
              </div>

              <VRow class="d-flex justify-center ">
                <VCol
                  class="d-flex justify-center align-center"
                  cols="12"
                >
                  <div>
                    <span
                      :class="`text-${getSwitchThemeColorText}`"
                      class="text-h5 text-disabled clamp-text text-white"
                    >{{ awaitAll }}</span>
                  </div>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>

  <!-- Dialog Complate -->
  <section>
    <VDialog
      v-model="isDialogDetailVisible"
      width="100%"
      persistent
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardTitle
          style="height: 65px;"
          class="d-flex align-center"
          :class="`bg-${getSwitchThemeColor}`"
        >
          <div>
            <span
              style="margin-left: 10px;"
              class="text-h5 text-white d-flex align-center justify-start"
            >{{ $t('Performance - Complete') }}</span>
          </div>
          <br>
        </VCardTitle>
        <VCardSubtitle
          class="pb-2"
          :class="`bg-${getSwitchThemeColor}`"
        >
          <div>
            <span
              class="px-3"
              style="color: white; font-size: 18px;"
            >{{ warehouseShowHeaderPerformance }} - {{ formattedDateTime }} </span>
          </div>
        </VCardSubtitle>

        <DialogCloseBtn
          style="background-color: white;"
          variant="text"
          size="small"
          @click="blockHistoryProp('receiving')"
        />

        <VCardText>
          <VRow class="">
            <VCol cols="12" />
          </VRow>

          <div class="pb-1">
            <div class="d-flex justify-space-between"> 
              <div>
                <VTabs
                  v-model="currentTabChartMix"
                  class="v-tabs-pill"
                >
                  <VTab
                    color="light-green"
                    variant="flat"
                  >
                    {{ $t('Received') }}
                  </VTab>
                  <VTab
                    color="light-green"
                    variant="flat"
                  >
                    {{ $t('Picked') }}
                  </VTab>
                </VTabs>
              </div>
            </div>
            <VWindow
              v-model="currentTabChartMix"
              class="py-0"
            >
              <VWindowItem class="py-0">
                <VCard>
                  <VCardText class="py-0">
                    <PerformanceReceived
                      v-if="currentTabChartMix === 0"
                      :select-type-date="typeDate"
                      :datepicker-data-start="props.dateCurrent"
                      :datepicker-data-end="props.dateCurrent"
                    />
                  </VCardText>
                </VCard>
              </VWindowItem>
              <VWindowItem class="py-0">
                <VCard>
                  <VCardText class="py-0">
                    <PerformancePicking
                      v-if="currentTabChartMix === 1"
                      :select-type-date="typeDate"
                      :datepicker-data-start="datePropMasterStart"
                      :datepicker-data-end="datePropMasterEnd"
                    />
                  </VCardText>
                </VCard>
              </VWindowItem>
            </VWindow>
          </div>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <!-- Dialog Await -->
  <section>
    <VDialog
      v-model="isDialogDetailVisibleAwait"
      width="100%"
      persistent
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardTitle
          style="height: 65px;"
          class="d-flex align-center"
          :class="`bg-${getSwitchThemeColor}`"
        >
          <div>
            <span
              style="margin-left: 10px;"
              class="text-h5 text-white d-flex align-center justify-start"
            >{{ $t('Performance - Awaiting') }}</span>
          </div>
          <br>
        </VCardTitle>
        <VCardSubtitle
          class="pb-2"
          :class="`bg-${getSwitchThemeColor}`"
        >
          <div>
            <span
              class="px-3"
              style="color: white; font-size: 18px;"
            >{{ warehouseShowHeaderPerformance }} - {{ formattedDateTime }} </span>
          </div>
        </VCardSubtitle>

        <DialogCloseBtn
          style="background-color: white;"
          variant="text"
          size="small"
          @click="blockHistoryProp('await')"
        />

        <VCardText>
          <VRow class="">
            <VCol cols="12" />
          </VRow>

          <div class="pb-1">
            <div class="d-flex justify-space-between"> 
              <div>
                <VTabs
                  v-model="currentTabChartMix"
                  class="v-tabs-pill"
                >
                  <VTab
                    color="light-green"
                    variant="flat"
                  >
                    {{ $t('Receiving') }}
                  </VTab>
                  <VTab
                    color="light-green"
                    variant="flat"
                  >
                    {{ $t('Picking') }}
                  </VTab>
                </VTabs>
              </div>
            </div>
            <VWindow
              v-model="currentTabChartMix"
              class="py-0"
            >
              <VWindowItem class="py-0">
                <VCard>
                  <VCardText class="py-0">
                    <PerformanceReceivedAwait
                      v-if="currentTabChartMix === 0"
                      :select-type-date="typeDate"
                      :datepicker-data-start="props.dateCurrent"
                      :datepicker-data-end="props.dateCurrent"
                    />
                  </VCardText>
                </VCard>
              </VWindowItem>
              <VWindowItem class="py-0">
                <VCard>
                  <VCardText class="py-0">
                    <PerformancePickingAwait
                      v-if="currentTabChartMix === 1"
                      :select-type-date="typeDate"
                      :datepicker-data-start="datePropMasterStart"
                      :datepicker-data-end="datePropMasterEnd"
                    />
                  </VCardText>
                </VCard>
              </VWindowItem>
            </VWindow>
          </div>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <VCard
    v-if="logicLuxOn"
    :color="getSwitchThemeColor"
    @click="isDialogDetailVisible = true"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <VCardText class="pa-1">
      <div class="d-flex align-center justify-start">
        <VIcon
          size="60"
          :color="getSwitchThemeColorText"
          icon="mdi-chart-box"
        />
      </div>
    </VCardText>
    <VCardText class="clamp-text text-white py-0">
      <div class="d-flex align-center justify-start ">
        <span>
          <span
            style="font-size: 16px;"
            class="clamp-text text-white"
          >
            <span :class="`text-${getSwitchThemeColorText}`"><strong>{{ $t('Performance') }}</strong></span>
          </span>
        </span>
      </div>
    </VCardText>

    <!--  -->
    <VCardText class="py-1">
      <VRow no-gutters>
        <VCol
          cols="6"
          class="pb-1"
        >
          <div class="d-flex align-end justify-start">
            <span
              style="font-size: 14px; font-weight: bolder;"
              class="me-2"
              :class="`text-${getSwitchThemeColorText}`"
            >{{ $t('Complete') }}<br>{{ $t('Await') }}&nbsp;</span><span
              :class="`text-${getSwitchThemeColorText}`"
              style="font-size: 25px;"
            >{{ complateAll }}</span>
          </div>
        </VCol>

        <VCol
          cols="6"
          class="text-start px-3 pb-1"
        >
          <div class="d-flex align-end justify-start">
            <span
              style="font-size: 14px; font-weight: bolder;"
              class="me-2"
              :class="`text-${getSwitchThemeColorText}`"
            >{{ $t('Await') }}<br>{{ $t('Receiving') }}</span><span
              :class="`text-${getSwitchThemeColorText}`"
              style="font-size: 25px;"
            >{{ awaitAll }}</span>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
