<script setup>
import VueApexCharts from 'vue3-apexcharts'
import {
  useRtl,
  useTheme,
} from 'vuetify'
import { hexToRgb } from '@layouts/utils'


import { defineProps, reactive, watchEffect  } from 'vue'

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

const typeDatepickerNew = ref('')
const dateStart = ref(localStorage.getItem('startDateFromPerformance'))
const dateEnd = ref(localStorage.getItem('endDateFromPerformance'))
const dataProps = ref(props.data)

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
const chartData = reactive({ value: [] })
const dataPO = ref([null])
const dataTransferIn = ref([null])
const dataOther = ref([null])
const dataDate = ref([null])

const maxReceived = reactive({ value: [] })
const maxReceivedIndex = reactive({ value: [] })
const maxReceivedTime = reactive({ value: [] })

const maxTransferIn = reactive({ value: [] })
const maxTransferInIndex = reactive({ value: [] })
const maxTransferInTime = reactive({ value: [] })

const maxOther = reactive({ value: [] })
const maxOtherIndex = reactive({ value: [] })
const maxOtherTime = reactive({ value: [] })

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
        date: dateLabel.value, // ตัวอย่างช่วงเวลา
      },
      total: {
        received: calculateAverage(mockDataReceived.value), // ค่าเฉลี่ยของข้อมูล Received
        transferIn: calculateAverage(mockDataTransferIn.value), // ค่าเฉลี่ยของข้อมูล Transfer In
        other: calculateAverage(mockDataOther.value), // ค่าเฉลี่ยของข้อมูล Other
      },
    },
  
  }

}

watchEffect(() => {
  chartData.value = mockDataFunction(props.data).dataReceived.barMixChart
})

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

    const dayNos = dataSorted.value.filter(item => item.dayNo).map(item => item.dayNo.toString())
    const qtyPo = dataSorted.value.filter(item => item.qty && item.qty.po !== undefined).map(item => item.qty.po)
    const qtyOther = dataSorted.value.filter(item => item.qty && item.qty.other !== undefined).map(item => item.qty.other)
    const qtyTransfer = dataSorted.value.filter(item => item.qty && item.qty.transferIn !== undefined).map(item => item.qty.transferIn)

    const sumQtyPo = qtyPo.reduce((acc, curr) => acc + curr, 0)
    const sumQtyOther = qtyOther.reduce((acc, curr) => acc + curr, 0)
    const sumQtyTransfer = qtyTransfer.reduce((acc, curr) => acc + curr, 0)

    // รวมผลรวมของแต่ละชุดข้อมูลเข้าด้วยกัน
    const totalSum = sumQtyPo + sumQtyOther + sumQtyTransfer

    totalReceived.value = totalSum

    const updatedSeries = [
      {
        name: 'PO',
        type: 'column',
        data: qtyPo,
      },
      {
        name: 'TRANSFER IN',
        type: 'column',
        data: qtyOther,
      },
      {
        name: 'OTHER',
        type: 'column',
        data: qtyTransfer,
      },
    ]

    series.value = updatedSeries // อัพเดตค่าของตัวแปร series
    // คำนวณค่าสูงสุดในแต่ละประเภท
    maxReceived.value = Math.max(...qtyPo)
    maxReceivedIndex.value = qtyPo.indexOf(maxReceived.value)

    

    maxTransferIn.value = Math.max(...qtyOther)
    maxTransferInIndex.value = qtyOther.indexOf(maxTransferIn.value)
    

    maxOther.value = Math.max(...qtyTransfer)
    maxOtherIndex.value = qtyTransfer.indexOf(maxOther.value)
    
    const dateLabelDays =  ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']
    const dateLabelWeeks =  ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    if(props.typeDate){
      typeDatepickerNew.value = props.typeDate

      if(typeDatepickerNew.value === 8){
        dateLabel.value = timeHours
        maxReceivedTime.value = dataSorted.value[maxReceivedIndex.value].timeHour
        maxTransferInTime.value = dataSorted.value[maxTransferInIndex.value].timeHour
        maxOtherTime.value = dataSorted.value[maxOtherIndex.value].timeHour
      }else if(typeDatepickerNew.value === 7){
        dateLabel.value = dayNames
        maxReceivedTime.value = dataSorted.value[maxReceivedIndex.value].dayName
        maxTransferInTime.value = dataSorted.value[maxTransferInIndex.value].dayName
        maxOtherTime.value = dataSorted.value[maxOtherIndex.value].dayName
      }
    }

    const updateAnnotations = [
      {
        title: 'PO',
        data: maxReceived.value,
        date: maxReceivedTime.value,
      },
      {
        title: 'TRANSFER IN',
        data: maxTransferIn.value,
        date: maxTransferInTime.value,
      },
      {
        title: 'OTHER',
        data: maxOther.value,
        date: maxOtherTime.value,
      },
    ]

    annotations.value = updateAnnotations

    // console.log('**pureData**', timeHours)
  }
})

// watchEffect(() =>{
  
//   if(props.data){
//     dataPO.value = props.data.received
//     dataTransferIn.value = props.data.transferIn
//     dataOther.value = props.data.other
//     dataDate.value = props.data.date

//     const updatedSeries = [
//       {
//         name: 'PO',
//         type: 'column',
//         data: dataPO.value,
//       },
//       {
//         name: 'TRANSFER IN',
//         type: 'column',
//         data: dataTransferIn.value,
//       },
//       {
//         name: 'OTHER',
//         type: 'column',
//         data: dataOther.value,
//       },
//     ]

    
//     // series.value = updatedSeries // อัพเดตค่าของตัวแปร series
  
//     // คำนวณค่าสูงสุดในแต่ละประเภท
//     maxReceived.value = Math.max(...dataPO.value)
//     maxReceivedIndex.value = dataPO.value.indexOf(maxReceived.value)
//     maxReceivedTime.value = dataDate.value[maxReceivedIndex.value]

//     maxTransferIn.value = Math.max(...dataTransferIn.value)
//     maxTransferInIndex.value = dataTransferIn.value.indexOf(maxTransferIn.value)
//     maxTransferInTime.value = dataDate.value[maxTransferInIndex.value]

//     maxOther.value = Math.max(...dataOther.value)
//     maxOtherIndex.value = dataOther.value.indexOf(maxOther.value)
//     maxOtherTime.value = dataDate.value[maxOtherIndex.value]


//     const updateAnnotations = [
//       {
//         title: 'PO',
//         data: maxReceived.value,
//         date: maxReceivedTime.value,
//       },
//       {
//         title: 'TRANSFER IN',
//         data: maxTransferIn.value,
//         date: maxTransferInTime.value,
//       },
//       {
//         title: 'OTHER',
//         data: maxOther.value,
//         date: maxOtherTime.value,
//       },
//     ]

//     // annotations.value = updateAnnotations

//     if(props.data.typeDate === 12){
//       typeDate.value = 'Years'
//     } else if(props.data.typeDate === 4){
//       typeDate.value = 'Monthly'
//     } else if(props.data.typeDate === 7){
//       typeDate.value = 'Weekly'
//     } else if(props.data.typeDate === 8){
//       typeDate.value = 'Daily'
//     }
    
//     console.log('typeDate', typeDate.value, props.data.typeDate)
//   }

 
  
// }) 

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
    received: '#4CAF50',
    transferIn: '#FF5722',
    other: '#009688',
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
            filename: `Transaction Receive ${dateStart.value} - ${dateEnd.value}`,
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            },
          },
          svg: {
            filename: `Transaction Receive ${dateStart.value} - ${dateEnd.value}`,
          },
          png: {
            filename: `Transaction Receive ${dateStart.value} - ${dateEnd.value}`,
          },
        },
        autoSelected: 'zoom', 
      },
      
    },
    colors: [color.received, color.transferIn, color.other], // กำหนดสีที่นี่
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
      horizontalAlign: 'left',
      offsetX: 40,
    },
    stroke: {
      width: 6, // กำหนดความกว้างของเส้น
    },
    annotations: {
      points: [
        {
          x: maxReceivedTime.value, // หรือช่วงเวลาใดๆที่มีค่าสูงสุด
          y: maxReceived.value, // ค่าสูงสุดของ Transfer Out
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
            text: `PO: ${maxReceived.value} (${maxReceivedTime.value})`, // ข้อความที่ต้องการแสดง
          },
        },
        {
          x: maxTransferInTime.value, // หรือช่วงเวลาใดๆที่มีค่าสูงสุด
          y: maxTransferIn.value, // ค่าสูงสุดของ Delivery
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
            text: `TRANSFER IN: ${maxTransferIn.value} (${maxTransferInTime.value})`, // ข้อความที่ต้องการแสดง
          },
        },
        {
          x: maxOtherTime.value, // หรือช่วงเวลาใดๆที่มีค่าสูงสุด
          y: maxOther.value, // ค่าสูงสุดของ Write Off
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
            text: `OTHER: ${maxOther.value} (${maxOtherTime.value})`, // ข้อความที่ต้องการแสดง
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
  <VCard>
    <VCardTitle class="d-flex justify-center">
      <VRow>
        <VCol cols="6">
          <div class="d-flex justify-end">
            {{ $t('Transaction Received') }}
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
