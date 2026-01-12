<script setup>
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

const MAX= 100

import { defineProps } from 'vue'

import ChartPerformanceReceived from '@/views/dashboard/main/receiptBy/picking/Chart/chartPerformance.vue'

import ChartPerformancePickingPie from '@/views/dashboard/main/receiptBy/picking/Chart/chartPerformancePie.vue'

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

watchEffect()(() => {
  if(isHoveredOther === true){
    colorAvatarReceived.value = 'green'
    colorAvatarTransferIn.value = 'deep-orange'
    colorAvatarOther.value = 'teal'
    colorIconReceived.value = 'green'
    colorIconTransferIn.value = 'deep-orange'
    colorIconOther.value = 'teal'
  }
  
})

//-------------------- Mock Data ------------------------------
function generateRandomData(min, max, count) {
  const data = []
  for (let i = 0; i < count; i++) {
    const randomValue = Math.floor(Math.random() * (max - min + 1)) + min

    data.push(randomValue)
  }
  
  return data
}

function calculateAverage(data) {
  const sum = data.reduce((acc, val) => acc + val, 0)
  
  return Math.floor(sum / data.length)
}
const chartDataAll = ref({})
const chartData = ref({})
const chartDataTotal = ref({})
const dataTotalChartPO = reactive({ value: [] })
const dataTotalChartTransferIn = reactive({ value: [] })
const dataTotalChartOther = reactive({ value: [] })

const mockDataFunction = moreList => {

  const dateLabelDays =  ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']
  const dateLabelWeeks =  ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dateLabelMonths =  ['Week 1', 'Week 2', 'Week 3', 'Week 4']
  const dateLabelYears =  ['Jan', 'Feb', 'Mar', 'Api', 'May', 'June', 'July', 'Aug', 'Seb', 'Oct', 'Nov', 'Dec']

  const mockDataReceived = ref(generateRandomData(0, 100, moreList))
  const mockDataTransferIn = ref(generateRandomData(0, 100, moreList))
  const mockDataOther = ref(generateRandomData(0, 100, moreList))

  const dateLabel = ref([])

  if(moreList === 12){
    dateLabel.value = dateLabelYears
  } else if(moreList  === 4){
    dateLabel.value = dateLabelMonths
  } else if(moreList  === 7){
    dateLabel.value = dateLabelWeeks
  } else if(moreList  === 8){
    dateLabel.value = dateLabelDays
  }
    
  return {
    dataReceived: {
      barMixChart: {
        received: mockDataReceived.value, // สุ่มข้อมูล Received ตามช่วงเวลา
        transferIn: mockDataTransferIn.value, // สุ่มข้อมูล Transfer In ตามช่วงเวลา
        other: mockDataOther.value, // สุ่มข้อมูล Other ตามช่วงเวลา
        peoples: generateRandomData(0, 100, 8),
        date: dateLabel.value, // ตัวอย่างช่วงเวลา,
        typeDate: moreList,
      },
      total: {
        received: calculateAverage(mockDataReceived.value), // ค่าเฉลี่ยของข้อมูล Received
        transferIn: calculateAverage(mockDataTransferIn.value), // ค่าเฉลี่ยของข้อมูล Transfer In
        other: calculateAverage(mockDataOther.value), // ค่าเฉลี่ยของข้อมูล Other
        typeDate: moreList,
      },
    },
  
  }

}


//*******-------  */
const menusVariant = ['primary' ]

const items = [
  // {
  //   title: 'Yearly',
  //   value: 12,
  // },
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

const testPros = ref('')

const dataBar = ref({})
const dataPie = ref({})

const typeDate = ref('Daily')

const testPorps = items =>{
  testPros.value = items
  chartDataAll.value = mockDataFunction(items).dataReceived

 
  chartData.value = mockDataFunction(items).dataReceived.barMixChart
  chartDataTotal.value = mockDataFunction(items).dataReceived.total
  console.log('chart All data', chartDataAll.value)

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
    console.log('typeDateProps', typeDateProps.value)
    testPorps(typeDateProps.value)
  }
})

if(!props.selectTypeDate){
  chartDataAll.value = mockDataFunction(8).dataReceived
}

watch(() => {

  dataBar.value = chartDataAll.value.barMixChart
  dataPie.value = chartDataAll.value.total

  dataBar.value = chartDataAll.value.barMixChart
  dataPie.value = chartDataAll.value.total

  console.log('Chart Bar', dataBar.value)
  console.log('Chart Total', dataPie.value)

  
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
          :to="{ name: 'dashboards-shortCutMenu-pickingUp-transferOut' }"
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
                    color="light-blue-lighten-3"
                  >
                    <VIcon
                      color="light-blue"
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
      <VCol
        cols="12"
        lg="4"
      >
        <VCard
          v-ripple
          :to="{ name: 'dashboards-shortCutMenu-pickingUp-delivery' }"
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
                    color="amber-lighten-3"
                  >
                    <VIcon
                      color="amber"
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
      <VCol
        cols="12"
        lg="4"
      >
        <VCard
          v-ripple
          :to="{ name: 'dashboards-shortCutMenu-pickingUp-writeOff' }"
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
                    color="purple-lighten-3"
                  >
                    <VIcon
                      color="purple"
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
        <ChartPerformanceReceived :data="dataBar" />
      </VCol>
      <VCol
        cols="12"
        lg="4"
      >
        <ChartPerformancePickingPie :data="dataPie" />
      </VCol>
    </VRow>
  </div>
</template>
