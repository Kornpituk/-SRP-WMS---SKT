<script setup>
import VueApexCharts from "vue3-apexcharts"
import { useTheme } from "vuetify"
import { getDonutChartConfigPOSuccess } from "@/views/dashboard/main/receiptBy/picking/Chart/apexCharConfig"

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

    const dayNos = dataSorted.value.filter(item => item.dayNo).map(item => item.dayNo.toString())// *** not working

    const qtyTransferOut = dataSorted.value.filter(item => item.qty && item.qty.transferOut !== undefined).map(item => item.qty.transferOut)
    const qtyDelivery = dataSorted.value.filter(item => item.qty && item.qty.delivery !== undefined).map(item => item.qty.delivery)
    const qtyWhiteOff = dataSorted.value.filter(item => item.qty && item.qty.writeOff !== undefined).map(item => item.qty.writeOff)
    
    const sumQtyTransferOut = qtyTransferOut.reduce((acc, curr) => acc + curr, 0)
    const sumQtyDelivery = qtyDelivery.reduce((acc, curr) => acc + curr, 0)
    const sumQtyWhite = qtyWhiteOff.reduce((acc, curr) => acc + curr, 0)

    series.value = [
      sumQtyTransferOut, sumQtyDelivery, sumQtyWhite,
    ]
    
  }
})

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
          <span>{{ $t('Total Performance Picking') }}</span>
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
