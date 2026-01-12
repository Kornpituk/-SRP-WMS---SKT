<script setup>
import { urlApi } from '@/api'
import ChartPerformanceReceived from '@/views/dashboard/main/receiptBy/picking/Chart/chartPerformance.vue'
import ChartPerformancePickingPie from '@/views/dashboard/main/receiptBy/picking/Chart/chartPerformancePie.vue'
import { defineProps, watch, watchEffect } from 'vue'
import axios from '@axios'

import { useRoute } from 'vue-router'

import DetailsTransferPicking from "@/views/dashboard/main/shortCutMenu/pickingUp/transferOut/datails.vue"
import DetailsDeliveryPicking from "@/views/dashboard/main/shortCutMenu/pickingUp/delivery/datails.vue"
import DetailsWriteOfPicking from "@/views/dashboard/main/shortCutMenu/pickingUp/writeOff/datails.vue"

import { useDashboardStore } from '@/pages/dashboards/store/performance/operations'
 
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  selectTypeDate: {
    type: Array,
    required: true,
  },
  datepickerDataEnd: {
    type: Array,
    required: true,
  },
  datepickerDataStart: {
    type: Array,
    required: true,
  },
})

const formateDateNew = inputDate => {
  const [day, month, year] = inputDate.split('/')

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}


const dashboardStore = useDashboardStore()

const dateRange = ref({
  dateSt: '2025-06-17',
  dateSp: '2025-06-17',
})

onMounted(async () => {

  console.log("props.datepickerDataStart", props.datepickerDataStart)

  if(props.datepickerDataStart){
    dateRange.value.dateSt = formateDateNew(props.datepickerDataStart)
    dateRange.value.dateSp = formateDateNew(props.datepickerDataStart)
  }

  await fetchDataChartPerformance()
})

async function fetchDataChartPerformance() {
  await dashboardStore.fetchPerformanceData({
    stockId: whereHouse,
    ...dateRange.value,
  })
}


const route = useRoute()
const MAX= 100

const whereHouse = localStorage.getItem('whereHouseName')
const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')



const isHoveredReceived = ref(false)
const isHoveredTransferIn = ref(false)
const isHoveredOther = ref(false)

//-----------------------------------
const colorAvatarReceived = ref('green-lighten-5') //
const colorAvatarTransferIn = ref('deep-orange-lighten-5') //
const colorAvatarOther = ref('teal-lighten-5') //
const colorIconReceived = ref('green-lighten-3') //
const colorIconTransferIn = ref('deep-orange-lighten-3') //
const colorIconOther = ref('teal-lighten-3') //

const typeDatepicker = ref('')
const dateStartProp = ref(new Date())
const dateEndProp = ref(new Date())
const typeTableReceiving = ref('Transfer Out')

watchEffect(() => {


  typeDatepicker.value = props.selectTypeDate

  // console.log('Props datepickerDataEnd', props.datepickerDataEnd, props.datepickerDataStart)

  //---------------- Set Date With Prop Data -----------------------------
  if(props.datepickerDataEnd && props.datepickerDataStart){
    dateStartProp.value = props.datepickerDataEnd
    dateEndProp.value = props.datepickerDataStart
  }

  if(isHoveredOther === true){
    colorAvatarReceived.value = 'light-blue'
    colorAvatarTransferIn.value = 'amber'
    colorAvatarOther.value = 'purple'
    colorIconReceived.value = 'light-blue'
    colorIconTransferIn.value = 'amber'
    colorIconOther.value = 'purple'
  }

  if(typeTableReceiving.value === 'Transfer Out'){
    colorAvatarReceived.value = 'light-blue'
    colorIconReceived.value = 'white'
    colorIconTransferIn.value = 'amber'
    colorAvatarTransferIn.value = ''
    colorAvatarOther.value = ''
    colorIconOther.value = 'purple'
  }else if(typeTableReceiving.value === 'Delivery'){
    colorIconTransferIn.value = 'white'
    colorAvatarTransferIn.value = 'amber'
    colorAvatarReceived.value = ''
    colorIconReceived.value = 'light-blue'
    colorAvatarOther.value = ''
    colorIconOther.value = 'purple'
  }else if(typeTableReceiving.value === 'Other'){
    colorIconTransferIn.value = 'amber'
    colorAvatarTransferIn.value = ''
    colorAvatarReceived.value = ''
    colorIconReceived.value = 'light-blue'
    colorAvatarOther.value = 'purple'
    colorIconOther.value = 'white'
  }else{
    colorAvatarReceived.value = 'light-blue'
    
    colorAvatarTransferIn.value = 'amber'
    
    colorAvatarTransferIn.value = 'amber'
  }
  
})

const chartDataAll = ref({})
const chartData = ref({})
const chartDataTotal = ref({})
const dataTotalChartPO = reactive({ value: [] })
const dataTotalChartTransferIn = reactive({ value: [] })
const dataTotalChartOther = reactive({ value: [] })

//*******-------  */
const menusVariant = ['primary' ]

const items = [
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
]

const testPros = ref(7)

const dataBar = ref({})
const dataPie = ref({})

const typeDate = ref('Daily')

const testProps = items =>{
  testPros.value = items

  if(items === 12){
    typeDate.value = 'Yearly'
  } else if(items === 4){
    typeDate.value = 'Monthly'
  } else if(items === 7){
    typeDate.value = 'Weekly'
  } else if(items === 8){
    typeDate.value = 'Daily'
  }

  
}

const typeDateProps = ref(0)

watch(() => {
  if(props.selectTypeDate){
    typeDateProps.value = props.selectTypeDate
    testProps(typeDateProps.value)
  }
})

//------------------------------------------------- Get Data from API ---------------------------------------------
const dataDatepicker = ref()

const getHeaderGroupTimeNew = () => {

  // console.log('searchByCategoryName: ',searchByCategoryName)Receive Picking
  axios.get(`${urlApi.value}/api/v1/Dashboard/Performance/Picking/GroupTime`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
    params: {
    // stockId: stockIdData.value,
    // dateSt: dateStData.value,
    // dateSp: dateSpData.value,

      stockId: whereHouse,
      dateSt: formateDateNew(props.datepickerDataStart),
      dateSp: formateDateNew(props.datepickerDataStart),

      // ... and so on with other parameters
    },
  }, {})
    .then(response => {

      dataDatepicker.value = response.data

      console.log('Chart Data New Time PK:', dataDatepicker.value)

      // currentPage.value = response.data.page
      // totalPage.value = response.data.totalPages
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

const getHeaderGroupDayNew = () => {

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axios.get(`${urlApi.value}/api/v1/Dashboard/Performance/Picking/GroupDay`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
    params: {
      // stockId: stockIdData.value,
      // dateSt: dateStData.value,
      // dateSp: dateSpData.value,

      stockId: whereHouse,
      dateSt: formateDateNew(props.datepickerDataStart),
      dateSp: formateDateNew(props.datepickerDataStart),

    // ... and so on with other parameters
    },
  }, {})
    .then(response => {

      dataDatepicker.value = response.data

      console.log('Chart Data New Day PK:', response.data)

      // currentPage.value = response.data.page
      // totalPage.value = response.data.totalPages
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })
}




// watch([dateStartProp, dateEndProp, typeDateProps], ([newDateStart, newDateEnd, newTypeDate]) => {
//   if (newTypeDate === 8) {
//     getHeaderGroupTimeNew()
//   } else if(newTypeDate === 7){
//     getHeaderGroupDayNew()
//   }
// })

watchEffect(() => {
  if(!props.datepickerDataEnd && !props.datepickerDataStart){
    console.log('Props datepickerDataEnd Empty picking', props.datepickerDataEnd, props.datepickerDataStart, props.selectTypeDate)
    dateEndProp.value = route.query.startDate
    dateStartProp.value = route.query.endDate
  }

  console.log('Props datepickerDataEnd picking', props.datepickerDataEnd, props.datepickerDataStart)

  // if (typeDateProps === 8) {
  //   getHeaderGroupTimeNew()
  // } else if(typeDateProps === 7){
  //   getHeaderGroupDayNew()
  // }

})

watch(() => {
  getHeaderGroupDayNew()
})
</script>


<template>
  <!-- Card To Received / Transfer In / Other -->
  <div>
    <VRow>
      <!-- Transfer Out  -->
      <VCol
        cols="12"
        lg="6"
      >
        <VCard
          v-ripple
          class="cursor-pointer"
          @click="typeTableReceiving = 'Transfer Out'"
          @mouseenter="isHoveredReceived = true"
          @mouseleave="isHoveredReceived = false"
        >
          <VCardText>
            <VRow>
              <VCol
                cols="12"
                lg="6"
                class="pa-0"
              >
                <div class="px-2">
                  <VAvatar
                    rounded
                    :color="colorAvatarReceived"
                  >
                    <VIcon
                      :color="colorIconReceived"
                      icon="ri-logout-box-line"
                    />
                  </VAvatar><span
                    style="font-size: 16px; font-weight: bolder;"
                    class="px-4"
                    :class="{ 'text-light-blue': isHoveredReceived, 'text-light-blue-lighten-2': !isHoveredReceived }"
                  >{{ $t('Transfer Out') }}</span>
                </div>
              </VCol>
              <VCol
                cols="12"
                lg="6"
                class="py-0 d-flex align-center justify-end"
              >
                <div>
                  <span
                    style="font-size: 16px;"
                    class="text-h7"
                  >{{ $t('Details') }}</span>
                </div>
              </VCol>
            </VRow>
          </VCardText>
          <VCardActions
            :class="{ 'bg-light-blue': isHoveredReceived, 'bg-light-blue-lighten-3': !isHoveredReceived }"
            @mouseenter="isHoveredReceived = true"
            @mouseleave="isHoveredReceived = false"
          />
        </VCard>
      </VCol>
      <!-- Delivery  -->
      <VCol
        cols="12"
        lg="6"
      >
        <VCard
          v-ripple
          class="cursor-pointer"
          @click="typeTableReceiving = 'Delivery'"
          @mouseenter="isHoveredTransferIn = true"
          @mouseleave="isHoveredTransferIn = false"
        >
          <VCardText>
            <VRow>
              <VCol
                cols="12"
                lg="6"
                class="pa-0"
              >
                <div class="px-2">
                  <VAvatar
                    rounded
                    :color="colorAvatarTransferIn"
                  >
                    <VIcon
                      :color="colorIconTransferIn"
                      icon="ri-truck-line"
                    />
                  </VAvatar><span
                    style="font-size: 16px; font-weight: bolder;"
                    class="px-4"
                    :class="{ 'text-amber': isHoveredTransferIn, 'text-amber-lighten-2': !isHoveredTransferIn }"
                  >{{ $t('Delivery') }}</span>
                </div>
              </VCol>
              <VCol
                cols="12"
                lg="6"
                class="py-0 d-flex align-center justify-end"
              >
                <div>
                  <span
                    style="font-size: 16px;"
                    class="text-h7"
                  >{{ $t('Details') }}</span>
                </div>
              </VCol>
            </VRow>
          </VCardText>
          <VCardActions
            :class="{ 'bg-amber': isHoveredTransferIn, 'bg-amber-lighten-3': !isHoveredTransferIn }"
            @mouseenter="isHoveredTransferIn = true"
            @mouseleave="isHoveredTransferIn = false"
          />
        </VCard>
      </VCol>
      <!--  White Off -->
      <VCol
        v-if="false"
        cols="12"
        lg="4"
      >
        <VCard
          v-ripple
          class="cursor-pointer"
          @click="typeTableReceiving = 'Write Off'"
          @mouseenter="isHoveredOther = true"
          @mouseleave="isHoveredOther = false"
        >
          <VCardText>
            <VRow>
              <VCol
                cols="12"
                lg="6"
                class="pa-0"
              >
                <div class="px-2">
                  <VAvatar
                    rounded
                    :color="colorAvatarOther"
                  >
                    <VIcon
                      :color="colorIconOther"
                      icon="ri-sparkling-2-line"
                    />
                  </VAvatar><span
                    style="font-size: 16px; font-weight: bolder;"
                    class="px-4"
                    :class="{ 'text-purple': isHoveredOther, 'text-purple-lighten-2': !isHoveredOther}"
                  >{{ $t('Write Off') }}</span>
                </div>
              </VCol>
              <VCol
                cols="12"
                lg="6"
                class="py-0 d-flex align-center justify-end"
              >
                <div>
                  <span
                    style="font-size: 16px;"
                    class="text-h7"
                  >{{ $t('Details') }}</span>
                </div>
              </VCol>
            </VRow>
          </VCardText>
          <VCardActions
            :class="{ 'bg-purple': isHoveredOther, 'bg-purple-lighten-3': !isHoveredOther }"
            @mouseenter="isHoveredOther = true"
            @mouseleave="isHoveredOther = false"
          />
        </VCard>
      </VCol>
    </VRow>
  </div>
  <div>
    <VRow>
      <VCol
        cols="12"
        lg="8"
      >
        <ChartPerformanceReceived
          v-if="false"
          :data="dataBar"
          :pure-data="dataDatepicker"
          :type-date="typeDatepicker"
        />

        <DetailsTransferPicking
          v-if="typeTableReceiving === 'Transfer Out'"
          :date="formateDateNew(props.datepickerDataStart)"
        />
        <DetailsDeliveryPicking
          v-if="typeTableReceiving === 'Delivery'"
          :date="formateDateNew(props.datepickerDataStart)"
        />
        <DetailsWriteOfPicking
          v-if="typeTableReceiving === 'Write Off'"
          :date="formateDateNew(props.datepickerDataStart)"
        />
      </VCol>
      <VCol
        cols="12"
        lg="4"
      >
        <ChartPerformancePickingPie
          :pure-data="dataDatepicker"
          :data="dataPie"
          :data-chart-white="dashboardStore.pickingSuccessfully.pickingWriteOff"
          :data-chart-transfer-out="dashboardStore.pickingSuccessfully.tranferOut"
          :data-chart-delivery="dashboardStore.pickingSuccessfully.pickingDelivery"
          type-data="sussess"
        />
      </VCol>
    </VRow>
  </div>
</template>
