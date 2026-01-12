<script setup>
import { urlApi } from '@/api'
import ChartPerformanceReceived from '@/views/dashboard/main/receiptBy/received/Chart/chartPerformance.vue'
import axios from '@axios'
import { defineProps, watchEffect } from 'vue'

import { useRoute } from 'vue-router'

import DetailsPoReceiving from "@/views/dashboard/main/shortCutMenu/received/po/datails.vue"
import DetailsTranferInReceiving from "@/views/dashboard/main/shortCutMenu/received/transferIn/datails.vue"
import DetailsOtherReceiving from "@/views/dashboard/main/shortCutMenu/received/other/datails.vue"

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
 
const route = useRoute()
 
const MAX= 100

const whereHouse = localStorage.getItem('whereHouseName')
const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')

import ChartPerformancePickingPie from '@/views/dashboard/main/receiptBy/received/Chart/chartPerformancePie.vue'

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

const typeDatepicker = ref(localStorage.getItem('startDateFromPerformance'))
const dateStartProp = ref('')
const dateEndProp = ref(localStorage.getItem('endDateFromPerformance'))

watchEffect(() => {

  typeDatepicker.value = props.selectTypeDate

  //---------------- Set Date With Prop Data -----------------------------
  if(props.datepickerDataEnd && props.datepickerDataStart){
    dateStartProp.value = props.datepickerDataEnd
    dateEndProp.value = props.datepickerDataStart
  }

  if(isHoveredOther === true){
    colorAvatarReceived.value = 'green'
    colorAvatarTransferIn.value = 'deep-orange'
    colorAvatarOther.value = 'teal'
    colorIconReceived.value = 'green'
    colorIconTransferIn.value = 'deep-orange'
    colorIconOther.value = 'teal'
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

const formateDateNew = inputDate => {
  const [day, month, year] = inputDate.split('/')

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}


const getHeaderGroupTimeNew = () => {

  console.log('getHeaderGroupTimeNew: ', formateDateNew(props.datepickerDataStart))
  axios.get(`${urlApi.value}/api/v1/Dashboard/Performance/Receive/GroupTime`, {
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
      dateSt: '2025-06-11',
      dateSp: '2025-06-11',

      // ... and so on with other parameters
    },
  }, {})
    .then(response => {

      dataDatepicker.value = response.data

      console.log('Chart Data New Time:', dataDatepicker.value)

      // currentPage.value = response.data.page
      // totalPage.value = response.data.totalPages
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

const getHeaderGroupDayNew = () => {

  
  console.log('getHeaderGroupDayNew: ', formateDateNew(props.datepickerDataStart))
  axios.get(`${urlApi.value}/api/v1/Dashboard/Performance/Receive/GroupDay`, {
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
      dateSt: '2025-06-11',
      dateSp: '2025-06-11',

    // ... and so on with other parameters
    },
  }, {})
    .then(response => {

      dataDatepicker.value = response.data

      console.log('Chart Data New Day:', response.data)

      // currentPage.value = response.data.page
      // totalPage.value = response.data.totalPages
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })
}

const typeTableReceiving = ref('')



watch(() => {
  // if(!props.datepickerDataEnd && !props.datepickerDataStart){
  //   // console.log('Props datepickerDataEnd Empty', props.datepickerDataEnd, props.datepickerDataStart, props.selectTypeDate)
  //   dateEndProp.value = route.query.startDate
  //   dateStartProp.value = route.query.endDate
  // }

  console.log('compareType', typeDateProps)

  if (typeDateProps.value === 8) {
    getHeaderGroupTimeNew()
  } else if(typeDateProps.value === 7){
    getHeaderGroupDayNew()
  }


})
</script>


<template>
  <!-- Card To Received / Transfer In / Other -->
  <div>
    <VRow>
      <VCol
        cols="12"
        lg="4"
      >
        <VCard
          v-ripple
          :to="{ name: 'dashboards-shortCutMenu-received-po',
                 query: { dateStart: dateEndProp,
                          dateEnd: dateStartProp,
                          typeDate: typeDatepicker
                 }, }"
          class="cursor-pointer"
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
                      icon="ri-store-3-line"
                    />
                  </VAvatar><span
                    style="font-size: 16px; font-weight: bolder;"
                    class="px-4"
                    :class="{ 'text-green': isHoveredReceived, 'text-green-lighten-2': !isHoveredReceived }"
                  >{{ $t('PO') }}</span>
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
            :class="{ 'bg-green': isHoveredReceived, 'bg-green-lighten-3': !isHoveredReceived }"
            @mouseenter="isHoveredReceived = true"
            @mouseleave="isHoveredReceived = false"
          />
        </VCard>
      </VCol>
      <VCol
        cols="12"
        lg="4"
      >
        <VCard
          v-ripple
          :to="{ name: 'dashboards-shortCutMenu-received-transferIn',
                 query: { dateStart: dateEndProp,
                          dateEnd: dateStartProp,
                          typeDate: typeDatepicker
                 }, }"
          class="cursor-pointer"
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
                      icon="ri-folder-transfer-line"
                    />
                  </VAvatar><span
                    style="font-size: 16px; font-weight: bolder;"
                    class="px-4"
                    :class="{ 'text-deep-orange': isHoveredReceived, 'text-deep-orange-lighten-2': !isHoveredReceived }"
                  >{{ $t('Transfer In') }}</span>
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
            :class="{ 'bg-deep-orange': isHoveredTransferIn, 'bg-deep-orange-lighten-3': !isHoveredTransferIn }"
            @mouseenter="isHoveredTransferIn = true"
            @mouseleave="isHoveredTransferIn = false"
          />
        </VCard>
      </VCol>
      <VCol
        cols="12"
        lg="4"
      >
        <VCard
          v-ripple
          :to="{ name: 'dashboards-shortCutMenu-received-other',
                 query: { dateStart: dateEndProp,
                          dateEnd: dateStartProp,
                          typeDate: typeDatepicker
                 }, }"
          class="cursor-pointer"
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
                    :class="{ 'text-teal': isHoveredOther, 'text-teal-lighten-2': !isHoveredOther}"
                  >{{ $t('Other') }}</span>
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
            :class="{ 'bg-teal': isHoveredOther, 'bg-teal-lighten-3': !isHoveredOther }"
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
        <DetailsPoReceiving :date="props.datepickerDataStart" />
      </VCol>
      <VCol
        cols="12"
        lg="4"
      >
        <ChartPerformancePickingPie
          :pure-data="dataDatepicker"
          :data="dataPie"
        />
      </VCol>
    </VRow>
  </div>
</template>
