<script setup>
import VueApexCharts from "vue3-apexcharts"
import { useTheme } from "vuetify"
import { getDonutChartConfigPOSuccess } from "@/views/dashboard/main/receiptBy/received/Chart/apexCharConfig"

import { defineProps, watch, watchEffect } from 'vue'

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
})

watchEffect(() => {
 
})

const dataTotalRecieved = ref([])
const dataTotalTransferIn = ref([])
const dataTotalOther = ref([])
const series = ref([dataTotalRecieved, dataTotalTransferIn, dataTotalOther])

watchEffect(() => {
  console.log("pureData ## in Pie", props.pureData)

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

    series.value = [
      sumQtyPo, sumQtyOther, sumQtyTransfer,
    ]
    

  }
})

function generateRandomData(min, max, count) {
  const data = []
  for (let i = 0; i < count; i++) {
    const randomValue = Math.floor(Math.random() * (max - min + 1)) + min

    data.push(randomValue)
  }
  
  return data
}


const vuetifyTheme = useTheme()

const expenseRationChartConfig = computed(() =>
  getDonutChartConfigPOSuccess(vuetifyTheme.current.value),
)
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardTitle class="py-5">
          <span>{{ $t('Total Performance Received') }}</span>
        </VCardTitle>
        <VDivider />
        <VCardText>
          <div>
            <VueApexCharts
              type="pie"
              height="450"
              :options="expenseRationChartConfig"
              :series="series"
            />
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
