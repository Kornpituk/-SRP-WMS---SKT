<script setup>
const route = useRoute()

const dialogHistory = (route.query.dialogHistory)
const cardHistory = (route.query.cardBtnHistory)

const whereHouse = localStorage.getItem('whereHouseName')
const accessToken = localStorage.getItem('accessTokenAtStore')

import { urlApi } from '@/api'
import axios from '@axios'

const whereRoomNameSet = ref('')

const itemsWarehouse = []
const wareHouseSection = ref(whereHouse)
const select = ref(whereHouse)
const itemsWarehouseGetForAPI = ref('')

//**----------------------------------------- Get API ----------------------------------------------------- */
/**-- Get Categories  */
const GetCategoriesAll = () => {
  axios.get(`${urlApi.value}/api/v1/Product/Categories/All`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(response => {
      const responseData = response.data
      const responseLength = responseData.length

      localStorage.setItem('LengthCategories', responseLength)

      // console.log('Response Length:', responseLength)
      // console.log("DAta Cat", responseData)
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })

    
}

watchEffect(GetCategoriesAll)

/**-- Get Categories  */
const GetProductAll = () => {
  axios.get(`${urlApi.value}/api/v1/Product?page=1&perPage=90000`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-location': whereHouse,
    },
  })
    .then(response => {
      const responseData = response.data.items
      const responseLength = responseData.length

      localStorage.setItem('LengthProduct', responseLength)

      // console.log('Response Length product:', responseLength)
      // console.log("DAta", responseData)
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })

    
}

watchEffect(GetProductAll)

/**-- Get Categories  */
const GetLocationAll = () => {
  axios.get(`${urlApi.value}/api/Auth/GetLocation/all`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-location': whereHouse,
    },
  })
    .then(response => {
      const responseData = response.data

      itemsWarehouseGetForAPI.value = responseData

      // console.log('Response Length product:', responseLength)
      console.log("DAta", itemsWarehouseGetForAPI.value)
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })

    
}

watchEffect(GetLocationAll)

//------------------------------------------ Set Data For Dashboard -----------------------------------

watch(wareHouseSection, newValue => {
  console.log('Selected Warehouse:', newValue)
  localStorage.setItem('whereHouseName', newValue)

  location.reload()
})

//--------------------------------------- Row Date ---------------------------------------------------
import DateData from '@/views/dashboard/main/dateData/testDate.vue'

import EcommerceExpiryDate from '@/views/dashboard/main/exoiryDate/ecommerceExpiryDate.vue'
import EcommerceMaxMin from '@/views/dashboard/main/maxMinProduct/ecommerceMaxMin.vue'
import EcommerceProductAll from '@/views/dashboard/main/dataProdutcAll/ecommerceDataProduct.vue'
import EcommerceReceiptBy from '@/views/dashboard/main/receiptBy/ecommerceReceiptBy.vue'

import TotalUser from '@/views/dashboard/main/totalUsers/totalUser.vue'

// import DigitalDate from '@/views/dashboard/main/dateData/digitalDate.vue'

//------------------------------ Row last --------------------------------------------------------------
import AnalyticsTotalTransactionsMove from '@/views/dashboard/main/moveNonMove/AnalyticsTotalTransactionsMove.vue'

import ChartJsBarChartMove from "@/views/dashboard/main/moveNonMove/chartPola/barChartTopMove.vue"
import ChartJsBarChartNonMove from "@/views/dashboard/main/moveNonMove/chartPola/barChartTopNonMove.vue"
import TopProductMove from "@/views/dashboard/main/moveNonMove/topProductMove/EcommerceTopReferralSources.vue"
import TopProductNonMove from "@/views/dashboard/main/moveNonMove/topProductNonMove/EcommerceTopReferralSources.vue"

//--------------------------------- Chart Receipt & Picking ------------------------------------
//** Receipt */
import ReceiptSuccess from '@/views/dashboard/main/chartAll/receiptAll/receiptSuccessDonutCharts.vue'
import ReceiptWaiting from '@/views/dashboard/main/chartAll/receiptAll/receiptWaitDonutCharts.vue'

//** Picking */
import PickingSuccess from '@/views/dashboard/main/chartAll/pickingAll/pickingSuccessDonutCharts.vue'
import PickingWaiting from '@/views/dashboard/main/chartAll/pickingAll/pickingWaitDonutCharts.vue'

const chartJsCustomColors = {
  white: '#fff',
  yellow: '#ffe802',
  primary: '#836af9',
  areaChartBlue: '#2c9aff',
  barChartYellow: '#ffcf5c',
  polarChartGrey: '#4f5d70',
  polarChartInfo: '#299aff',
  lineChartYellow: '#d4e157',
  polarChartGreen: '#28dac6',
  lineChartPrimary: '#9e69fd',
  lineChartWarning: '#ff9800',
  horizontalBarInfo: '#26c6da',
  polarChartWarning: '#ff8131',
  scatterChartGreen: '#28c76f',
  warningShade: '#ffbd1f',
  areaChartBlueLight: '#84d0ff',
  areaChartGreyLight: '#edf1f4',
  scatterChartWarning: '#ff9f43',
}

import illustration4 from '@images/cards/illustration-4.png'
import illustration5 from '@images/illustrations/faq-illustration.png'

const checkPropsThemesSwitch = () => {
  
}

const statisticsWithImages = [
  {
    title: 'Total Users',
    subtitle: 'Last Week',
    stats: '42',
    change: 10,
    image: illustration4,
    imgWidth: 30,
    color: 'secondary',
  },
]

//----------------- Row 1 Date --------------------------------
const dateRange = ref('')

//------------------ Row 2 SemiCircles --------------------------------
//------------------- Dialog --------------------------------
const isDialogVisibleProductIn = ref(false)
const isDialogVisibleProductOut = ref(false)
const isDialogVisibleProductStore = ref(false)

const clickDialogProductIn = () => {
  isDialogVisibleProductIn.value = true
}

const clickDialogProductOut = () => {
  isDialogVisibleProductOut.value = true
}

const clickDialogProductStore = () => {
  isDialogVisibleProductStore.value = true
}

//------------------------------------------------------ Top Product -----------
const isDialogTopProductVisible = ref(false)

//- -------------------------------------- Data ----------------------------------------------------------
const dataset1 = [
  {
    cat: 35,
    item: 250,
  },
]

const dataset2 = [
  {
    cat: 40,
    item: 350,
  },
]

//-------------------------------------------------- Date Data ---------------------------------------------------
import AppDataTimePickerAllWay from '@/views/dashboard/main/dateData/appTImePicker/appDatatimePicker.vue'
import { watchEffect } from 'vue'

const currentDate = new Date()
const dateApplication = ref('')

const options = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',

  // hour: '2-digit',
  // minute: '2-digit',
  // second: '2-digit',
  hour12: false, // ถ้าต้องการเวลาในรูปแบบ 24 ชั่วโมง
}

const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`

const formattedDateNow = `${currentDate.getFullYear()}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}`
const formattedDateTime = ref('')
const oneWeekAgo = new Date(currentDate.getTime() - (7 * 24 * 60 * 60 * 1000))
const formattedDateOneWeekAgo = `${oneWeekAgo.getDate().toString().padStart(2, '0')}/${(oneWeekAgo.getMonth() + 1).toString().padStart(2, '0')}/${oneWeekAgo.getFullYear()}`+` to `+formattedDate

watchEffect(() => {
  const currentDate = new Date()

  formattedDateTime.value = currentDate.toLocaleString('en-GB', options)
})

const oneMonthAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate())
const formattedDateOneMonthAgo = `${oneMonthAgo.getDate().toString().padStart(2, '0')}/${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}/${oneMonthAgo.getFullYear()}`+` to `+formattedDate

const currentTime = ref(formattedDate)
const currentDateSelect = ref(null)
const checkDate = ref(true)
const checkDateCalendal = ref(false)

const formatDate = date => {
  if (date) {
    const [day, month, year] = date.split('/')
    
    return `${year}/${month}/${day}`
  }
  
  return ''
}

const dateDateSelection = ref('')

const handleItemClickNew = item => {
  
  if(dateApplication.value){
    localStorage.setItem('DateData', dateApplication.value)
  }

  if(item.value.value == 'day'){
     
    checkDate.value = false
    checkDateCalendal.value = true
    dateDateSelection.value = dateApplication.value
    console.log('item', item.value.value)
    
  } else {
    currentTime.value = item.value.value
    dateDateSelection.value = item.value.value
    checkDate.value = true
    console.log('item', item.value.value)
    
    
  }
}

const clearBtnDate = () => {
  currentTime.value = formattedDate
  checkDate.value = true
  checkDateCalendal.value = false

  console.log('DateData', `${formattedDate} to ${formattedDate}`)

  localStorage.setItem('DateData', currentTime.value)
  datelocal.value = localStorage.getItem('DateData')
  console.log("Apply Date Data Dashboard local:", datelocal.value)
  getDataForAPI()

  // location.reload()
}


const itemProps = item => {
  if(!item){
    return {
      title: 'Select',
      subtitle: 'none Value',
    }
  } else if(item.value){
    return {
      title: item.title,
      subtitle: item.value,
    }
  }
}

const items = [
  { title: 'Day', value: "day" },
  { title: 'Week', value: formattedDateOneWeekAgo },
  { title: 'Month', value: formattedDateOneMonthAgo },
]

const dateDate = ref(`${formattedDate} to ${formattedDate}`)

const datelocal = ref(`${formattedDate} to ${formattedDate}`)

const setDateData = () => {

  if(checkDate.value === true){
    localStorage.setItem('DateData', dateDateSelection.value)
  } else if(checkDate.value === false){
    localStorage.setItem('DateData', dateApplication.value)
  }
  datelocal.value = localStorage.getItem('DateData')
  console.log("Apply Date Data Dashboard local:", datelocal.value)
  getDataForAPI()
   
  // Reload the page
  // location.reload()
}

//----------------------------------------- get Data for chart All Performance -------------------------------------

import axiosIns from '@axios'

const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')


const dates = computed(() => {
  if (datelocal.value && datelocal.value.includes(' to ')) {
    return datelocal.value.split(' to ')
  } else if(datelocal.value && !datelocal.value.includes(' to ')){
    return [datelocal.value, datelocal.value]
  }
  
  return ['', '']
})

const startDate = computed(() => dates.value[0])
const endDate = computed(() => dates.value[1])

const formattedStartDate = computed(() => formatDate(startDate.value))
const formattedEndDate = computed(() => formatDate(endDate.value))

// Watcher สำหรับคอยตรวจสอบการเปลี่ยนแปลงใน datelocal
watch(datelocal, () => {
  formattedStartDate.value = formatDate(startDate.value)
  formattedEndDate.value = formatDate(endDate.value)
})

// เพิ่ม watcher สำหรับ dates เพื่ออัพเดต formatted date
watch([startDate, endDate], () => {
  formattedStartDate.value = formatDate(startDate.value)
  formattedEndDate.value = formatDate(endDate.value)
})

watchEffect(()=> {
  console.log("formattedStartDate.value", formattedStartDate.value)
  console.log("formattedEndDate.value", formattedEndDate.value)
})

const dateSetReceivedSuccess = ref([])
const dateSetReceivedPending = ref([])
const dateSetPickingSuccess = ref([])
const dateSetPickingPending = ref([])

const complateAll = ref('')
const awaitAll = ref('')
const mergedObj = {}

const summaryAll = (switchAll, obj1, obj2) => {
  for (let key in obj1) {
    mergedObj[key] = obj1[key] + (obj2[key] || 0)
  }

  for (let key in obj2) {
    if (!(key in obj1)) {
      mergedObj[key] = obj2[key]
    }
  }

  if(switchAll === 1){
    complateAll.value = mergedObj.receivedPo + mergedObj.tranferIn + mergedObj.receivedOther + mergedObj.tranferOut + mergedObj.pickingDelivery + mergedObj.pickingWriteOff
  } else if(switchAll === 2){
    awaitAll.value = mergedObj.receivedPo + mergedObj.tranferIn + mergedObj.receivedOther + mergedObj.tranferOut + mergedObj.pickingDelivery + mergedObj.pickingWriteOff
  }
  
}

const getDataForAPI = async () => {
  try {
    const response = await axiosIns.get(`${urlApi.value}/api/v1/Dashboard/Summary/Performance`, {
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
        'x-location': `${whereHouse}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },

      params: {
        stockId: whereHouse,
        dateSt: formattedDateNow,
        dateSp: formattedDateNow,
      },
    })

    dateSetReceivedSuccess.value = response.data.receivedSuccessfully
    dateSetReceivedPending.value = response.data.receivedPending

    dateSetPickingSuccess.value = response.data.pickingSuccessfully
    dateSetPickingPending.value = response.data.pickingPending

    summaryAll(1, dateSetReceivedSuccess.value, dateSetPickingSuccess.value)
    summaryAll(2, dateSetReceivedPending.value, dateSetPickingPending.value)

    // complateAll.vale = dateSetReceivedSuccess.value + dateSetPickingSuccess.value
    // awaitAll.value = dateSetReceivedPending.value + dateSetPickingPending.value

    console.log('response.data', response.data)
    console.log('complateAll', complateAll.value, 'awaitAll', awaitAll.value)

  } catch (error) {
    console.error(`Error: `, error)
  }
}

watchEffect(() => {
  getDataForAPI()

})

const dataSetTEst = 'Test Data Props'

//------------------------------------- config switch theme -------------------------------------
//----------------------------------------------------------------------------
const getSwitchThemeColor = ref('primary')
const getSwitchThemeColorText = ref('white')
const logicLuxOn = ref(false)
const operationOn = ref(false)
const hover = ref(false)

watchEffect(() => {
  localStorage.getItem('srp-theme-config')
  if(localStorage.getItem('srp-theme-config') === 'primary') {
    getSwitchThemeColor.value = 'red-darken-4'
  }else if(localStorage.getItem('srp-theme-config') === 'warehouse-harmony'){
    getSwitchThemeColor.value = 'red-lighten-3'
    getSwitchThemeColorText.value = 'black'
  } else if(localStorage.getItem('srp-theme-config') === 'inventory-insight'){
    getSwitchThemeColor.value = 'red-lighten-2'
  } else if(localStorage.getItem('srp-theme-config') === 'logistics-luxe'){
    
    logicLuxOn.value = true
    operationOn.value = false
    if(hover.value){
      getSwitchThemeColor.value = 'red-lighten-1'
      getSwitchThemeColorText.value = 'white'
    }else {
      getSwitchThemeColor.value = 'white'
      getSwitchThemeColorText.value = 'red-lighten-1'
    }
  } else if(localStorage.getItem('srp-theme-config') === 'operation-optimizer'){
    logicLuxOn.value = false
    operationOn.value = true
  }
})

//---------------------------------- Switch Move None Mobe -----------------------
const lengthMove = ref(2)
const onboardingMove = ref(0)
const lengthNonMove = ref(2)
const onboardingNonMove = ref(0)

//--------------------------------------------------- Digital ---------------------------------------------------
const time = ref('')
const date = ref('')

const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

function zeroPadding(num, digit) {
  return num.toString().padStart(digit, '0')
}

function updateTime() {
  const cd = new Date()

  time.value = `${zeroPadding(cd.getHours(), 2)}:${zeroPadding(cd.getMinutes(), 2)}:${zeroPadding(cd.getSeconds(), 2)}`
  date.value = `${zeroPadding(cd.getFullYear(), 4)}-${zeroPadding(cd.getMonth() + 1, 2)}-${zeroPadding(cd.getDate(), 2)} ${week[cd.getDay()]}`
}

onMounted(() => {
  updateTime()

  const timerID = setInterval(updateTime, 1000)

  onUnmounted(() => {
    clearInterval(timerID)
  })
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <!-- Row 1 WareHouse & Date -->
      <div>
        <VRow class="match-height">
          <!-- Select Week -->
          <VCol
            cols="12"
            lg="8"
            sm="6"
          >
            <span style="font-size: 25px; font-weight: bolder;">{{ $t('Dashboard Overview') }}</span>
          </VCol>
          <VCol
            cols="12"
            lg="2"
            sm="3"
            class="px-2"
          >
            <VCard>
              <VCardText class="pa-2">
                <VRow>
                  <VCol cols="12">
                    <VAutocomplete
                      v-model="wareHouseSection"
                      :label="$t('Warehouse')"
                      density="compact"
                      placeholder="Select State"
                      :items="itemsWarehouseGetForAPI"
                      item-title="name"
                      item-value="id"
                    />
                  </VCol>
                </VRow>
              </VCardText>
            </VCard>
          </VCol>
          <VCol
            cols="12"
            lg="2"
            sm="3"
            class="px-2"
          >
            <VCard class="d-flex justify-center align-center">
              <VCardText class="pa-2 ">
                <div>
                  <VRow>
                    <VCol
                      v-if="false"
                      class="d-flex"
                      cols="3"
                    >
                      <div class="">
                        <VIcon
                          size="30"
                          icon="ri-calendar-2-fill"
                        />
                      </div>
                    </VCol>
                    <VCol
                      class="d-flex align-center justify-center py-1"
                      cols="12"
                    >
                      <div class="d-flex justify-center align-center py-0">
                        <span
                          class="d-flex justify-center align-center"
                          style="font-size: 18px; font-weight: bolder;"
                        >{{ formattedDateTime }}</span>
                      </div>
                    </VCol>
                    <VCol
                      class="d-flex align-center justify-center py-1"
                      cols="12"
                    >
                      <div class="d-flex justify-center align-center py-0">
                        <span
                          class="d-flex justify-center align-center"
                          style="font-size: 18px; font-weight: bolder;"
                        >{{ time }}</span>
                      </div>
                    </VCol>
                  </VRow>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </div>

      <!-- Row 2 Product Data & Expiry Date & Stock MaxMin & Performance -->
      <div>
        <VRow>
          <!-- Data Product -->
          <VCol
            cols="12"
            lg="3"
            md="6"
            sm="6"
          >
            <EcommerceProductAll
              :dataset="dataset1"
              :switchtheme="2"
            />
          </VCol>

          <!-- Expire Date -->
          <VCol
            cols="12"
            lg="3"
            md="6"
            sm="6"
          >
            <EcommerceExpiryDate />
          </VCol>

          <!-- Max / Min Product -->
          <VCol
            cols="12"
            lg="3"
            md="6"
            sm="6"
          >
            <EcommerceMaxMin />
          </VCol>

          <!-- Performance -->
          <VCol
            cols="12"
            lg="3"
            md="6"
            sm="6"
          >
            <EcommerceReceiptBy
              :card="cardHistory"
              :history="dialogHistory"
              :complate-all-props="complateAll"
              :await-all-props="awaitAll"
            />
          </VCol>
        </VRow>
      </div>

      <!-- Row 2 Receipt && Picking -->
      <div v-if="!logicLuxOn && !operationOn">
        <VRow>
          <!-- 👉 Receipt Success -->
          <VCol
            cols="12"
            sm="6"
            md="6"
            lg="3"
          >
            <VCard style="height: 100%;">
              <VCardTitle>
                <span
                  class="d-flex justify-center"
                  style="font-size: 16px; font-weight: 800;"
                >{{ $t('Inventory Arrived') }}</span>
              </VCardTitle>
              <VCardText>
                <ReceiptSuccess :dataset="dateSetReceivedSuccess" />
                {{ dateSetReceivedSuccess  }}
              </VCardText>
            </VCard>
          </VCol>

          <!-- 👉 Receipt wait -->
          <VCol
            cols="12"
            md="6"
            sm="6"
            lg="3"
          >
            <VCard style="height: 100%;">
              <VCardTitle>
                <span
                  class="d-flex justify-center"
                  style="font-size: 16px; font-weight: 800;"
                >{{ $t('Await Received') }}</span>
              </VCardTitle>
              <VCardText>
                <ReceiptWaiting :dataset="dateSetReceivedPending" />
                {{ dateSetReceivedPending  }}
              </VCardText>
            </VCard>
          </VCol>

          <!-- 👉 Picking Success -->
          <VCol
            cols="12"
            lg="3"
            md="6"
            sm="6"
          >
            <VCard style="height: 100%;">
              <VCardTitle>
                <span
                  class="d-flex justify-center"
                  style="font-size: 16px; font-weight: 800;"
                >{{ $t('Inventory Delivery') }}</span>
              </VCardTitle>
              <VCardText>
                <PickingSuccess :dataset="dateSetPickingSuccess" />
                {{ dateSetPickingSuccess  }}
              </VCardText>
            </VCard>
          </VCol>

          <!-- 👉 Picking wait -->
          <VCol
            cols="12"
            md="6"
            sm="6"
            lg="3"
          >
            <VCard style="height: 100%;">
              <VCardTitle>
                <span
                  class="d-flex justify-center"
                  style="font-size: 16px; font-weight: 800;"
                >{{ $t('Await Picking') }}</span>
              </VCardTitle>
              <VCardText>
                <PickingWaiting :dataset="dateSetPickingPending" />
                {{ dateSetPickingPending }}
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </div>

      <div v-if="logicLuxOn">
        <VRow>
          <!-- 👉 Receipt Success -->
          <VCol
            cols="12"
            sm="6"
            md="6"
            lg="3"
          >
            <VCard style="height: 100%;">
              <VCardTitle>
                <span
                  class="d-flex justify-center"
                  style="font-size: 16px; font-weight: 800;"
                >{{ $t('Received Successfully') }}</span>
              </VCardTitle>
              <VCardText>
                <ReceiptSuccess :dataset="dateSetReceivedSuccess" />
              </VCardText>
            </VCard>
          </VCol>

          <!-- 👉 Move -->
          <VCol
            cols="12"
            lg="6"
            md="6"
            sm="6"
          >
            <VWindow
              v-model="onboardingMove"
              show-arrows="hover"
            >
              <VWindowItem
                v-for="n in lengthMove"
                :key="`card-${n}`"
              >
                <VCardText
                  v-if="onboardingMove === 0"
                  class="pa-1"
                >
                  <ChartJsBarChartMove v-if="onboardingMove === 0" />
                </VCardText>
                <VCardText
                  v-else
                  class="pa-1"
                >
                  <TopProductMove v-if="onboardingMove === 1" />
                </VCardText>
              </VWindowItem>
            </VWindow>
          </VCol>


          <!-- 👉 Picking Success -->
          <VCol
            cols="12"
            lg="3"
            md="6"
            sm="6"
          >
            <VCard style="height: 100%;">
              <VCardTitle>
                <span
                  class="d-flex justify-center"
                  style="font-size: 16px; font-weight: 800;"
                >{{ $t('Picking Successfully') }}</span>
              </VCardTitle>
              <VCardText>
                <PickingSuccess :dataset="dateSetPickingSuccess" />
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
        <VRow>
          <!-- 👉 Receipt wait -->
          <VCol
            cols="12"
            md="6"
            sm="6"
            lg="3"
          >
            <VCard style="height: 100%;">
              <VCardTitle>
                <span
                  class="d-flex justify-center"
                  style="font-size: 16px; font-weight: 800;"
                >{{ $t('Received Pending') }}</span>
              </VCardTitle>
              <VCardText>
                <ReceiptWaiting :dataset="dateSetReceivedPending" />
              </VCardText>
            </VCard>
          </VCol>


          <!-- 👉 Non Move -->
          <VCol
            cols="12"
            sm="6"
            md="6"
            lg="6"
          >
            <VWindow
              v-model="onboardingNonMove"
              show-arrows="hover"
            >
              <VWindowItem
                v-for="n in lengthNonMove"
                :key="`card-${n}`"
              >
                <VCardText
                  v-if="onboardingNonMove === 0"
                  class="pa-1"
                >
                  <ChartJsBarChartNonMove v-if="onboardingNonMove === 0" />
                </VCardText>
                <VCardText
                  v-else
                  class="pa-1"
                >
                  <TopProductNonMove v-if="onboardingNonMove === 1" />
                </VCardText>
              </VWindowItem>
            </VWindow>
          </VCol>

          <!-- 👉 Picking wait -->
          <VCol
            cols="12"
            md="6"
            sm="6"
            lg="3"
          >
            <VCard style="height: 100%;">
              <VCardTitle>
                <span
                  class="d-flex justify-center"
                  style="font-size: 16px; font-weight: 800;"
                >{{ $t('Picking Pending') }}</span>
              </VCardTitle>
              <VCardText>
                <PickingWaiting :dataset="dateSetPickingPending" />
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </div>
  
      <!-- Row  5 Top Product Move -->
      <div v-if="!logicLuxOn && !operationOn">
        <VRow>
          <VCol cols="6">
            <!--
              <VWindow
              v-model="onboardingMove"
              show-arrows="hover"
              >
              <VWindowItem
              v-for="n in lengthMove"
              :key="`card-${n}`"
              >
              <VCardText
              v-if="onboardingMove === 0"
              class="pa-1"
              >
              <ChartJsBarChartMove v-if="onboardingMove === 0" />
              </VCardText>
              <VCardText
              v-else
              class="pa-1"
              >
              <TopProductMove v-if="onboardingMove === 1" />
              </VCardText>
              </VWindowItem>
              </VWindow> 
            -->

            <VCardText
              v-if="onboardingMove === 0"
              class="pa-1"
            >
              <ChartJsBarChartMove v-if="onboardingMove === 0" />
            </VCardText>
          </VCol>
          <VCol cols="6">
            <!--
              <VWindow
              v-model="onboardingNonMove"
              show-arrows="hover"
              >
              <VWindowItem
              v-for="n in lengthNonMove"
              :key="`card-${n}`"
              >
              <VCardText
              v-if="onboardingNonMove === 0"
              class="pa-1"
              >
              <ChartJsBarChartNonMove v-if="onboardingNonMove === 0" />
              </VCardText>
              <VCardText
              v-else
              class="pa-1"
              >
              <TopProductNonMove v-if="onboardingNonMove === 1" />
              </VCardText>
              </VWindowItem>
              </VWindow> 
            -->

            <VCardText
              v-if="onboardingNonMove === 0"
              class="pa-1"
            >
              <ChartJsBarChartNonMove v-if="onboardingNonMove === 0" />
            </VCardText>
          </VCol>
        </VRow>
      </div>

      <div v-if="operationOn">
        <VRow>
          <!-- 👉 Move -->
          <VCol
            cols="12"
            lg="6"
            md="6"
            sm="6"
          >
            <VWindow
              v-model="onboardingMove"
              show-arrows="hover"
            >
              <VWindowItem
                v-for="n in lengthMove"
                :key="`card-${n}`"
              >
                <VCardText
                  v-if="onboardingMove === 0"
                  class="pa-1"
                >
                  <ChartJsBarChartMove v-if="onboardingMove === 0" />
                </VCardText>
                <VCardText
                  v-else
                  class="pa-1"
                >
                  <TopProductMove v-if="onboardingMove === 1" />
                </VCardText>
              </VWindowItem>
            </VWindow>
          </VCol>

          <!-- 👉 Receipt Success -->
          <VCol
            cols="12"
            sm="6"
            md="6"
            lg="3"
          >
            <VCard style="height: 100%;">
              <VCardTitle>
                <span
                  class="d-flex justify-center"
                  style="font-size: 16px; font-weight: 800;"
                >{{ $t('Received Successfully') }}</span>
              </VCardTitle>
              <VCardText>
                <ReceiptSuccess :dataset="dateSetReceivedSuccess" />
              </VCardText>
            </VCard>
          </VCol>

          <!-- 👉 Picking Success -->
          <VCol
            cols="12"
            lg="3"
            md="6"
            sm="6"
          >
            <VCard style="height: 100%;">
              <VCardTitle>
                <span
                  class="d-flex justify-center"
                  style="font-size: 16px; font-weight: 800;"
                >{{ $t('Picking Successfully') }}</span>
              </VCardTitle>
              <VCardText>
                <PickingSuccess :dataset="dateSetPickingSuccess" />
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
        <VRow>
          <!-- 👉 Non Move -->
          <VCol
            cols="12"
            sm="6"
            md="6"
            lg="6"
          >
            <VWindow
              v-model="onboardingNonMove"
              show-arrows="hover"
            >
              <VWindowItem
                v-for="n in lengthNonMove"
                :key="`card-${n}`"
              >
                <VCardText
                  v-if="onboardingNonMove === 0"
                  class="pa-1"
                >
                  <ChartJsBarChartNonMove v-if="onboardingNonMove === 0" />
                </VCardText>
                <VCardText
                  v-else
                  class="pa-1"
                >
                  <TopProductNonMove v-if="onboardingNonMove === 1" />
                </VCardText>
              </VWindowItem>
            </VWindow>
          </VCol>

          <!-- 👉 Receipt wait -->
          <VCol
            cols="12"
            md="6"
            sm="6"
            lg="3"
          >
            <VCard style="height: 100%;">
              <VCardTitle>
                <span
                  class="d-flex justify-center"
                  style="font-size: 16px; font-weight: 800;"
                >{{ $t('Received Pending') }}</span>
              </VCardTitle>
              <VCardText>
                <ReceiptWaiting :dataset="dateSetReceivedPending" />
              </VCardText>
            </VCard>
          </VCol>

          <!-- 👉 Picking wait -->
          <VCol
            cols="12"
            md="6"
            sm="6"
            lg="3"
          >
            <VCard style="height: 100%;">
              <VCardTitle>
                <span
                  class="d-flex justify-center"
                  style="font-size: 16px; font-weight: 800;"
                >{{ $t('Picking Pending') }}</span>
              </VCardTitle>
              <VCardText>
                <PickingWaiting :dataset="dateSetPickingPending" />
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </div>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";

html {
  block-size: 100%;
}

body {
  background: #0f3854;
  background: radial-gradient(ellipse at center, #0a2e38 0%, #000 70%);
  background-size: 100%;
  block-size: 100%;
}

p {
  padding: 0;
  margin: 0;
}

#clock {
  position: absolute;
  font-family: "Share Tech Mono", monospace;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  text-align: center;
  text-shadow: 0;
  transform: translate(-50%, -50%);
}

.time {
  font-size: 18px;
  letter-spacing: 0.05em;
  padding-block: 5px 0;
  padding-inline: 5px 0;
}

.date {
  font-size: 18px;
  letter-spacing: 0.1em;
}

.text {
  font-size: 20px;
  letter-spacing: 0.1em;
  padding-block: 20px 0 0;
  padding-inline: 20px 0 0;
}
</style>
