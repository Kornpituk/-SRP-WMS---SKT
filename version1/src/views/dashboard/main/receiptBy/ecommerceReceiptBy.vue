<script setup>
import VueApexCharts from 'vue3-apexcharts'
import {
  useRtl,
  useTheme,
} from 'vuetify'
import { hexToRgb } from '@layouts/utils'
import { height } from '@/views/demos/forms/tables/simple-table/demoCodeSimpleTable'

import { defineProps, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import axiosIns from '@axios'

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

import AnalyticsReceiptBy from '@/views/dashboard/main/receiptBy/details/AnalyticsReceiptBy.vue'

//-------------------------- Import Chart Receipt By ----------------------------------------------
import POGrowthDonutCharts from '@/views/dashboard/main/totalPO/POGrowthDonutCharts.vue'

//-------------------------- Import Table ----------------------------------------------------------------
import TableDetailsPerformanceReceivedPO from '@/views/dashboard/main/receiptBy/details/tablePerformanceReceivedPO.vue'
import TableDetailsPerformanceTransferIn from '@/views/dashboard/main/receiptBy/details/tablePerformanceTransferIn.vue'
import TableDetailsPerformanceTransferOut from '@/views/dashboard/main/receiptBy/details/tablePerformanceTransferOut.vue'
import TableDetailsPerformancePickingDelivery from '@/views/dashboard/main/receiptBy/details/tablePerformancePickingDelivery.vue'

import ChartMixPerformance from '@/views/dashboard/main/receiptBy/Chart/chartPerformance.vue'

import PerformanceReceived from '@/views/dashboard/main/receiptBy/received/index.vue'
import PerformancePicking from '@/views/dashboard/main/receiptBy/picking/index.vue'

const vuetifyTheme = useTheme()


const series = ref([
  {
    name: 'MAX',
    data: [44],
  },
  {
    name: 'MIN',
    data: [76],
  },
])

const chartConfig = computed(() => {
  const themeColors = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  const borderColor = `rgba(${hexToRgb(String(variableTheme['border-color']))},${variableTheme['border-opacity']})`
  const disabledText = `rgba(${hexToRgb(String(themeColors['on-background']))},${variableTheme['disabled-opacity']})`
  const primaryText = `rgba(${hexToRgb(String(themeColors['on-background']))},${variableTheme['high-emphasis-opacity']})`

  return {
    chart: {
      type: 'bar',
      height: 100,
      stacked: true,
      stackType: '100%',
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    stroke: {
      width: 1,
      colors: ['#fff'],
    },
    xaxis: {
      height: 50,
      categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "K"
        },
      },
    },
    colors: [
      `rgba(${hexToRgb(String(themeColors.primary))}, 1)`,
      `rgba(${hexToRgb(String(themeColors.error))}, 1)`,
    ],
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40,
    },
  }
})

//--------------------------------------- Card Action expand-transition------------------
const show = ref(false)

//-------------------------------------- Dialog Details ------------------------------------
const isDialogDetailVisible = ref(false)

const complateAll = ref ('')
const awaitAll = ref('')

const historyProp = ref(false)
const historyPropCancel = ref(null)

const blockHistoryProp = () => {
  
  historyPropCancel.value = true
  isDialogDetailVisible.value = false
  sessionStorage.setItem('historyPropBlock', true)
  
}

watchEffect(() => {
  
  const historyBlock = sessionStorage.getItem('historyPropBlock')

  if(historyBlock === "false"){
    isDialogDetailVisible.value = true
    historyProp.value = props.history
  }else if(historyBlock === "true"){
    historyProp.value = false
    isDialogDetailVisible.value = false
  }
   
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

//----------------------------------- Data Table ------------------------------------------
import { VDataTable } from 'vuetify/labs/VDataTable'
import data from '@/views/demos/forms/tables/data-table/datatable'

//--------------------------------- Chart Receipt & Picking ------------------------------------
//** Receipt */
import ReceiptSuccess from '@/views/dashboard/main/chartAll/receiptAll/receiptSuccessDonutCharts.vue'
import ReceiptWaiting from '@/views/dashboard/main/chartAll/receiptAll/receiptWaitDonutCharts.vue'

//** Picking */
import PickingSuccess from '@/views/dashboard/main/chartAll/pickingAll/pickingSuccessDonutCharts.vue'
import PickingWaiting from '@/views/dashboard/main/chartAll/pickingAll/pickingWaitDonutCharts.vue'
import { trueAndFalseValue } from '@/views/demos/forms/form-elements/switch/demoCodeSwitch'

const headers = [
  { title: 'Employee Total', sortable: true, value: 'id' },
  { title: 'NAME', key: 'name' },
  {
    title: 'Waiting For Receipt',
    align: 'center',
    children: [
      { title: 'Waiting For Receipt', key: 'waitingForReceiptRPO' },
      { title: 'Receipt Success', key: 'receiptSuccessRPO' },
    ],
  },
  {
    title: 'Receipt Success',
    align: 'center',
    children: [
      { title: 'Waiting For Receipt', key: 'waitingForReceiptRPO' },
      { title: 'Receipt Success', key: 'receiptSuccessRPO' },
    ],
  },
  {
    title: 'Transfer In',
    align: 'center',
    children: [
      { title: 'Waiting For Receipt', value: 'waitingForReceiptTI' },
      { title: 'Receipt Success', value: 'receiptSuccessTI' },
    ],
  },
  {
    title: 'Picking For Delivery',
    align: 'center',
    children: [
      { title: 'Waiting For Delivery', value: 'waitingForDeliveryPD' },
      { title: 'Approved', value: 'ApprovedPD' },
    ],
  },
  {
    title: 'Transfer Out',
    align: 'center',
    children: [
      { title: 'Waiting For Receipt', value: 'waitingForReceiptTO' },
      { title: 'Receipt Success', value: 'receiptSuccessTO' },
    ],
  },
]

const randomizeNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

// Example usage: generating a random number between 1 and 999
const randomIntNumber = ref(randomizeNumber(1, 999))

const desserts = [
  {
    id: 'Successfully',
    po: 34,
    transferIn: 12,
    Other: 56,
    TransferOut: 10, 
    delivery: 23,
    writeOff: 23,
  },
  {
    id: 'Successfully Partial ',
    po: 34,
    transferIn: 12,
    Other: 56,
    TransferOut: 10, 
    delivery: 23,
    writeOff: 23,
  },
  {
    id: 'Pending',
    po: 34,
    transferIn: 12,
    Other: 56,
    TransferOut: 10, 
    delivery: 23,
    writeOff: 23,
  },
  {
    id: 'Pending Partial',
    po: 34,
    transferIn: 12,
    Other: 56,
    TransferOut: 10, 
    delivery: 23,
    writeOff: 23,
  },
]

//-------------------- Tabs Table Performance --------------------------------------
const currentTab = ref(0)

const items = [
  'Received PO',
  'Transfer In',
  'Transfer Out',
  'Picking For Delivery',
]

const tabItemText = [
  TableDetailsPerformanceReceivedPO, 
  TableDetailsPerformanceTransferIn, 
  TableDetailsPerformanceTransferOut, 
  TableDetailsPerformancePickingDelivery,
]

const totalTabs = items.length

const preTab = () => {
  if (currentTab.value !== 0)
    currentTab.value -= 1
}

const nextTab = () => {
  if (currentTab.value !== totalTabs - 1)
    currentTab.value += 1
}

//*** change color bg Tabs */
const resolveColorTabs = index => {
  if (index === 0)
    return 'light-green'
  else if(index === 1){
    // console.log('resolveColorTabs Transfer In', index)
    
    return 'deep-orange'
  } else if(index === 2){
    // console.log('resolveColorTabs Out', index)
    
    return 'blue'
  } else if(index === 3){
    // console.log('resolveColorTabs ', index)
    
    return 'amber'
  } else {
    // console.log('resolveColorTabs', index)
    
    return 'error'
  }
}


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

const itemsDate = [
  {
    title: 'Daily',
    value: 8,
  },
  
  {
    title: 'Weekly',
    value: 7,
  },

  {
    title: 'Monthly',
    value: 4,
  },

  {
    title: 'Custom',
    value: 0,
  },

]

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { endOfWeek, endOfMonth, endOfYear, startOfWeek, startOfMonth, startOfYear, subMonths, subWeeks, format  } from 'date-fns'
import DemoSwitchTrueAndFalseValue from '@/views/demos/forms/form-elements/switch/DemoSwitchTrueAndFalseValue.vue'

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

watchEffect(() => {
  const currentDate = new Date()

  formattedDateTime.value = currentDate.toLocaleString('en-GB', options)
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

watchEffect(() => {
  const typeSelectDatepickerHistoryCheck = ref('no data')

  typeSelectDatepickerHistoryCheck.value = localStorage.getItem('typeSelectDatepickerHistory', typeSelectDatepickerHistoryCheck.value)
  
  // if(typeSelectDatepickerHistoryCheck.value === 'day true'){
  //   typeSelectDatepicker.value = 1
  // } else if(typeSelectDatepickerHistoryCheck.value === 'week true'){
  //   typeSelectDatepicker.value = 2
  //   console.log('typeSelectDatepicker2222 week = ', typeSelectDatepicker.value)
  // } else if(typeSelectDatepickerHistoryCheck.value === 'month true'){
  //   typeSelectDatepicker.value = 3
  // } else if(typeSelectDatepickerHistoryCheck.value === 'custom true'){
  //   typeSelectDatepicker.value = 4
  // } 

  // console.log('typeSelectDatepicker111', typeSelectDatepicker.value)
  
})

const selectTypeDatepicker = value => {
  typeSelectDatepicker.value = value
}

const formatForShowDatepicker = date => {
  // ตรวจสอบว่าเป็น range หรือ single date picker
  if (Array.isArray(date)) { 
    // Range picker
    const [startDate, endDate] = date
    const start = `${startDate.getDate()}/${startDate.getMonth() + 1}/${startDate.getFullYear()}`
    const end = `${endDate.getDate()}/${endDate.getMonth() + 1}/${endDate.getFullYear()}`
    
    return `${start} - ${end}`
  } else {
    // Single date picker
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    
    return `${day}/${month}/${year}`
  }
}

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

const formatDateMaster = date => {
  if (!date) return ''
  
  return date.toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',

    // hour: '2-digit',
    // minute: '2-digit',
    // second: '2-digit',
    // hour12: false,
  })
}

const formatDateYMD = date => {
  if (!date) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')  // เดือนจะเริ่มจาก 0
  const day = String(date.getDate()).padStart(2, '0')
  
  return `${year}/${month}/${day}`
}

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

// const datePropMasterStart =  ref(localStorage.getItem('startDateFromPerformance'))
// const datePropMasterEnd =  ref(localStorage.getItem('EndDateFromPerformance'))

const datePropMasterStart =  ref('')
const datePropMasterEnd =  ref('')

// watchEffect(() => {
//   if(localStorage.getItem('startDateFromPerformance') && localStorage.getItem('endDateFromPerformance')){
//     datePropMasterStart.value = localStorage.getItem('startDateFromPerformance')
//     datePropMasterEnd.value = localStorage.getItem('endDateFromPerformance')
//   }
// })

watchEffect(() => {
  // console.log('datePickerMaster value format Date', formatDateMaster(startDate.value), formatDateMaster(endDate.value), formatDateYMD(startDate.value),  formatDateYMD(endDate.value))
  // console.log('datePicker Query***', startDateQuery.value, endDateQuery.value)
  if(startDateQuery.value && endDateQuery.value){
    datePropMasterStart.value = startDateQuery.value
    datePropMasterEnd.value = endDateQuery.value
  }else if(showDatepickerCustom.value){
    datePropMasterStart.value = formatDateMaster(startDate.value)
    datePropMasterEnd.value = formatDateMaster(endDate.value)
  }else if(showDatepickerMonth.value){
    datePropMasterStart.value = formatDateYMD(startDate.value)
    datePropMasterEnd.value = formatDateYMD(endDate.value)
  }else if(showDatepickerWeek.value){
    datePropMasterStart.value = formatDateMaster(startDate.value)
    datePropMasterEnd.value = formatDateMaster(endDate.value)
    "Week"
  }else if(showDatepickerDateMax.value){
    datePropMasterStart.value = formatDateMaster(startDate.value)
    datePropMasterEnd.value = formatDateMaster(endDate.value)
    "Date"
  }

  console.log('Prop Date Master', datePropMasterStart.value, datePropMasterEnd.value, typeDate.value)
  if(datePropMasterStart.value && datePropMasterEnd.value) {
    localStorage.setItem('startDateFromPerformance', datePropMasterStart.value)
    localStorage.setItem('endDateFromPerformance', datePropMasterEnd.value)
  }
 
})
</script>

<template>
  <VCard
    v-if="!logicLuxOn"
    :color="getSwitchThemeColor"
    @click="isDialogDetailVisible = true"
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
        <VCol cols="5">
          <div class="d-flex align-center justify-center mb-3">
            <span
              style="font-size: 16px; font-weight: bolder;"
              class="text-white"
              :class="`text-${getSwitchThemeColorText}`"
            >{{ $t('Complete') }}</span>
          </div>

          <VRow class="d-flex justify-center ">
            <VCol
              class="d-flex justify-center align-center "
              cols="4"
            >
              <div>
                <span
                  :class="`text-${getSwitchThemeColorText}`"
                  class="text-h5 text-disabled clamp-text text-white"
                >{{ complateAll }}</span>
              </div>
            </VCol>
          </VRow>
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

        <VCol
          cols="5"
          class="text-end"
        >
          <div class="d-flex align-center justify-center mb-3">
            <span
              style="font-size: 16px; font-weight: bolder;"
              class="text-white"
              :class="`text-${getSwitchThemeColorText}`"
            >{{ $t('Await') }}</span>
          </div>
          <VRow class="d-flex justify-center ">
            <VCol
              class="d-flex justify-center align-center "
              cols="4"
            >
              <div>
                <span
                  :class="`text-${getSwitchThemeColorText}`"
                  class="text-h5 text-disabled clamp-text text-white"
                >{{ awaitAll }}</span>
              </div>
            </VCol>
          </VRow>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>

  <!-- Dialog -->
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
            >{{ $t('Performance') }}</span>
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
            >{{ warehouseShowHeaderPerformance }} - {{ formattedDateTime }}</span>
          </div>
        </VCardSubtitle>

        <DialogCloseBtn
          style="background-color: white;"
          variant="text"
          size="small"
          @click="blockHistoryProp"
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
                    {{ $t('Picking') }}
                  </VTab>
                </VTabs>
              </div>
              
              <div class="d-flex">
                <!-- Select Datepicker -->
                <div>
                  <VMenu>
                    <template #activator="{ props }">
                      <VBtn v-bind="props">
                        {{ $t('Select Type Date') }}
                      </VBtn>
                    </template>

                    <VList>
                      <VListItem
                        v-for="item in itemsMenuTypeDate"
                        :key="item.value"
                        @click="selectTypeDatepicker(item.value)"
                      >
                        {{ item.title }}
                      </VListItem>
                    </VList>
                  </VMenu>
                </div>

                <div
                  v-if="showDatepickerDateMax || showDatepickerWeek || showDatepickerMonth || showDatepickerCustom"
                  style="width: 200px; height: 40px; border-radius: 10px;"
                  class="bg-green-lighten-4 d-flex justify-end aligh-center"
                >
                  <!-- Datepicker Type Date Max-Date -->
                  <div
                    v-if="showDatepickerDateMax"
                    class="px-4"
                  >
                    <VueDatePicker
                      v-model="dateMax"
                      :max-date="new Date()"
                      :enable-time-picker="false"
                    />
                  </div>

                  <!-- Datepicker Type Date Week -->
                  <div
                    v-if="showDatepickerWeek"
                    class="px-4"
                  >
                    <VueDatePicker
                      v-model="dateWeek"
                      week-picker
                      :week-numbers="{ type: 'local' }"
                      :max-date="new Date()"
                      :enable-time-picker="false"
                    />
                  </div>

                  <!-- Datepicker Type Date Month -->
                  <div
                    v-if="showDatepickerMonth"
                    class="px-4"
                  >
                    <VueDatePicker
                      v-model="dateMonth"
                      month-picker
                      :max-date="new Date()"
                      :enable-time-picker="false"
                    />
                  </div>

                  <!-- Datepicker Type Date Custom -->
                  <div
                    v-if="showDatepickerCustom"
                    class="px-4"
                  >
                    <VueDatePicker
                      v-model="dateCustom"
                      :max-date="new Date()"
                      :range="{ maxRange: 30, minMaxRawRange: true }"
                      multi-calendars
                      :enable-time-picker="false"
                    />
                  </div>
                </div>

                <div class="px-2" />

                <div v-if="showDatepickerDateMax || showDatepickerWeek || showDatepickerMonth || showDatepickerCustom">
                  <VBtn>
                    {{ $t('View') }}
                  </VBtn>
                </div>
                  
                <div v-if="showDatepickerDateMax || showDatepickerWeek || showDatepickerMonth || showDatepickerCustom">
                  <VBtn
                    v-if="!btnTypeChartDayDisabled"
                    :disabled="btnTypeChartDayDisabled"
                    :color="colorBtnChartDay"
                    :variant="variantBtnChartDay"
                    @click="btnTypeChartDayCheck = true; btnTypeChartTimeCheck = false"
                  >
                    {{ $t('Day') }}
                  </VBtn>
                  <VBtn
                    :color="colorBtnChartTime"
                    :variant="variantBtnChartTime"
                    @click="btnTypeChartTimeCheck = true; btnTypeChartDayCheck = false"
                  >
                    {{ $t('Time') }}
                  </VBtn>
                </div>
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
                      :datepicker-data-start="datePropMasterStart"
                      :datepicker-data-end="datePropMasterEnd"
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
