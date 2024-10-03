<script setup>
import VueApexCharts from 'vue3-apexcharts'
import {
  useRtl,
  useTheme,
} from 'vuetify'
import { hexToRgb } from '@layouts/utils'


import { defineProps, reactive, watchEffect  } from 'vue'
import { useRoute } from 'vue-router'

//------------------------------------- Define Props -------------------------------
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  pureData: {
    type: Array,
    required: true,
  },
  typeDate: {
    type: Array,
    required: true,
  },
})

const route = useRoute()

const typeDatepickerNew = ref('')

const dataProps = ref(props.data)
const dateStart = ref(localStorage.getItem('startDateFromPerformance'))
const dateEnd = ref(localStorage.getItem('endDateFromPerformance'))
const dateType = ref(route.query.typeDate)

watchEffect(() => {
  console.log('dataProps!!! picking**', props.pureData)
})

const chartData = reactive({ value: [] })
const dataPO = ref([null])
const dataTransferIn = ref([null])
const dataOther = ref([null])
const dataDate = ref([null])

const maxTransferOut = reactive({ value: [] })
const maxTransferOutIndex = reactive({ value: [] })
const maxTransferOutTime = reactive({ value: [] })

const maxDelivery = reactive({ value: [] })
const maxDeliveryIndex = reactive({ value: [] })
const maxDeliveryTime = reactive({ value: [] })

const maxWhiteOff = reactive({ value: [] })
const maxWhiteOffIndex = reactive({ value: [] })
const maxWhiteOffTime = reactive({ value: [] })

const series = ref([])

const annotations = ref([])

const typeDate = ref(['Day'])

const dateLabel = ref([])
const totalReceived = ref()

const sortDataByTimeHour = data => {
  return data.sort((a, b) => {
    const [hoursA, minutesA] = a.timeHour.split(':').map(Number)
    const [hoursB, minutesB] = b.timeHour.split(':').map(Number)

    return hoursA - hoursB || minutesA - minutesB
  })
}

watchEffect(() => {
  // console.log("Type Date", typeDatepickerNew.value)

  if(props.pureData){
    const data = (props.pureData)

    // console.log("data ** picking", data)

    const dataSorted = ref('')
    const typeDateFirst = ref('')

    typeDateFirst.value = props.typeDate
    if(props.typeDate  === 8){
      dataSorted.value = sortDataByTimeHour(data)
    } else {
      dataSorted.value = data
    }

    const dayNames = dataSorted.value.filter(item => item.dayName).map(item => item.dayName)
    const timeHours = dataSorted.value.filter(item => item.timeHour).map(item => item.timeHour.toString())

    const dayNos = dataSorted.value.filter(item => item.dayNo).map(item => item.dayNo.toString())// *** not working

    const qtyTransferOut = dataSorted.value.filter(item => item.qty && item.qty.transferOut !== undefined).map(item => item.qty.transferOut)
    const qtyDelivery = dataSorted.value.filter(item => item.qty && item.qty.delivery !== undefined).map(item => item.qty.delivery)
    const qtyWhiteOff = dataSorted.value.filter(item => item.qty && item.qty.writeOff !== undefined).map(item => item.qty.writeOff)

    const sumQtyTransferOut = qtyTransferOut.reduce((acc, curr) => acc + curr, 0)
    const sumQtyDelivery = qtyDelivery.reduce((acc, curr) => acc + curr, 0)
    const sumQtyWhiteOff = qtyWhiteOff.reduce((acc, curr) => acc + curr, 0)

    // รวมผลรวมของแต่ละชุดข้อมูลเข้าด้วยกัน
    const totalSum = sumQtyTransferOut + sumQtyDelivery + sumQtyWhiteOff

    totalReceived.value = totalSum

    const updatedSeries = [
      {
        name: 'TRANSFER OUT',
        type: 'column',
        data: qtyTransferOut,
      },
      {
        name: 'DELIVERY',
        type: 'column',
        data: qtyDelivery,
      },
      {
        name: 'WHITE OFF',
        type: 'column',
        data: qtyWhiteOff,
      },
    ]

    series.value = updatedSeries // อัพเดตค่าของตัวแปร series

    // คำนวณค่าสูงสุดในแต่ละประเภท
    maxTransferOut.value = Math.max(...qtyTransferOut)
    maxTransferOutIndex.value = qtyTransferOut.indexOf(maxTransferOut.value)

    maxDelivery.value = Math.max(...qtyDelivery)
    maxDeliveryIndex.value = qtyDelivery.indexOf(maxDelivery.value)
    
    maxWhiteOff.value = Math.max(...qtyWhiteOff)
    maxWhiteOffIndex.value = qtyWhiteOff.indexOf(maxWhiteOff.value)
    
    const dateLabelDays =  ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']
    const dateLabelWeeks =  ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    if(props.typeDate){
      typeDatepickerNew.value = props.typeDate

      if(typeDatepickerNew.value === 8){
        dateLabel.value = timeHours
        maxTransferOutTime.value = dataSorted.value[maxTransferOutIndex.value].timeHour
        maxDeliveryTime.value = dataSorted.value[maxDeliveryIndex.value].timeHour
        maxWhiteOffTime.value = dataSorted.value[maxWhiteOffIndex.value].timeHour
      }else if(typeDatepickerNew.value === 7){
        dateLabel.value = dayNames
        maxTransferOutTime.value = dataSorted.value[maxTransferOutIndex.value].dayName
        maxDeliveryTime.value = dataSorted.value[maxDeliveryIndex.value].dayName
        maxWhiteOffTime.value = dataSorted.value[maxWhiteOffIndex.value].dayName
      }
    }

    const updateAnnotations = [
      {
        title: 'TRANSFER OUT',
        data: maxTransferOut.value,
        date: maxTransferOutTime.value,
      },
      {
        title: 'DELIVERY',
        data: maxDelivery.value,
        date: maxDeliveryTime.value,
      },
      {
        title: 'WHITE OFF',
        data: maxWhiteOff.value,
        date: maxWhiteOffTime.value,
      },
    ]

    annotations.value = updateAnnotations

    // console.log('**pureData**', timeHours)
  }
})

//---------------------------------------------------------------------------------------------------------------

const data = ref(props.data)

const moreList = [
  {
    title: 'Yearly',
    value: 'refresh',
  },
  {
    title: 'Monthly',
    value: 'refresh',
  },
  {
    title: 'Weekly',
    value: 'update',
  },
  {
    title: 'Daily',
    value: 'share',
  },
]

const vuetifyTheme = useTheme()


const chartConfigMix = computed(() => {
  
  const color = {
    transferOut: '#03A9F4',
    delivery: '#FFC107',
    whiteOff: '#9C27B0',
  }

  return {
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: -50,
        tools: {
          download: true,
          selection: true,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false | '<img src="/static/icons/reset.png" width="20">',
          customIcons: [],
        },
        export: {
          csv: {
            filename: `Transaction Picking ${dateStart.value} - ${dateEnd.value}`,
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            },
          },
          svg: {
            filename: `Transaction Picking ${dateStart.value} - ${dateEnd.value}`,
          },
          png: {
            filename: `Transaction Picking ${dateStart.value} - ${dateEnd.value}`,
          },
        },
        autoSelected: 'zoom', 
      },
      
      
    },
    colors: [color.transferOut, color.delivery, color.whiteOff], // กำหนดสีที่นี่
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [1, 1, 4],
    },
    xaxis: {
      categories: dateLabel.value,
    },
    yaxis: [
      
    ],
    tooltip: {
      enabled: true,
      onDatasetHover: {
        highlightDataSeries: true,
      },
      theme: 'dark',
    },
    legend: {
      horizontalAlign: 'center',
      offsetX: 40,

      // labels: {
      //   colors: '#4C4E6499',
      //   useSeriesColors: false,
      // },
    },
    stroke: {
      width: 6, // กำหนดความกว้างของเส้น
    },
    annotations: {
      points: [
        {
          x: maxTransferOutTime.value, // หรือช่วงเวลาใดๆที่มีค่าสูงสุด
          y: maxTransferOut.value, // ค่าสูงสุดของ Transfer Out
          marker: {
            size: 6,
            fillColor: '#4CAF50',
            strokeColor: '#fff',
            radius: 2,
            offsetY: 0,
            offsetX: 0,
          },
          label: {
            borderColor: '#43A047',
            offsetY: 0,
            offsetX: 0,
            style: {
              color: '#fff',
              background: '#43A047',
            },
            text: `TRANSFER OUT: ${maxTransferOut.value} (${maxTransferOutTime.value})`, // ข้อความที่ต้องการแสดง
          },
        },
        {
          x: maxDeliveryTime.value, // หรือช่วงเวลาใดๆที่มีค่าสูงสุด
          y: maxDelivery.value, // ค่าสูงสุดของ Delivery
          marker: {
            size: 6,
            fillColor: '#FF5722',
            strokeColor: '#fff',
            radius: 2,
          },
          label: {
            borderColor: '#F4511E',
            offsetY: 0,
            style: {
              color: '#fff',
              background: '#F4511E',
            },
            text: `DELIVERY: ${maxDelivery.value} (${maxDeliveryTime.value})`, // ข้อความที่ต้องการแสดง
          },
        },
        {
          x: maxWhiteOffTime.value, // หรือช่วงเวลาใดๆที่มีค่าสูงสุด
          y: maxWhiteOff.value, // ค่าสูงสุดของ Write Off
          marker: {
            size: 6,
            fillColor: '#009688',
            strokeColor: '#fff',
            radius: 2,
          },
          label: {
            borderColor: '#00897B',
            offsetY: 0,
            style: {
              color: '#fff',
              background: '#00897B',
            },
            text: `WHITE OFF: ${maxWhiteOff.value} (${maxWhiteOffTime.value})`, // ข้อความที่ต้องการแสดง
          },
        },
      ],
    },
  }
})

// const total = computed(() => {
//   return series.value[0].data.reduce((acc, val) => acc + val, 0)
// })
</script>

<template>
  <VCard class="custom-legend-chart">
    <VCardTitle class="d-flex justify-center">
      <VRow>
        <VCol cols="6">
          <div class="d-flex justify-end">
            {{ $t('Transaction Picking') }}
          </div>
        </VCol>
      </VRow>
    </VCardTitle>
    <VCardSubtitle><span>{{ $t(`Total ${totalReceived} Transaction`) }}</span></VCardSubtitle>
    <VCardSubtitle v-if="false">
      <span style="font-weight: bolder;">{{ $t(`Performance Received Analysis For `) }}<span class="text-primary">{{ typeDate }}</span></span>
    </VCardSubtitle>
    <VueApexCharts
      type="line"
      height="450"
      :options="chartConfigMix"
      :series="series"
      :annotations="annotations"
    />
  </VCard>
</template>

<style>
.custom-legend-chart .apexcharts-legend {
  color: #f00; /* Change this to your desired color */
}
</style>
