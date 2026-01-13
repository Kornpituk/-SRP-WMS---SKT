<script setup>
import { getDonutChartConfigPOSuccess, getDonutChartConfigPOSuccessNoData } from "@/views/dashboard/main/chartAll/receiptAll/apexCharConfig"
import { defineProps, onMounted, watchEffect } from 'vue'
import VueApexCharts from "vue3-apexcharts"
import { useTheme } from "vuetify"
import { urlApi } from '@/api'
import axios from '@axios'


const props = defineProps({
  dataset: {
    type: Array,
    required: true,
  },
  dateFormate: {
    type: String,
    required: true,
  },
})

const whereHouse = localStorage.getItem('whereHouseName')
const accessToken = localStorage.getItem('accessTokenAtStore')
const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')

const dateSetReceivedSuccess = ref('')

const getDataForAPI = async () => {
  try {
    const response = await axios.get(`${urlApi.value}/api/v1/Dashboard/Summary/Performance`, {
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
        'x-location': whereHouse,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },

      params: {
        stockId: whereHouse,
        dateSt: props.dateFormate,
        dateSp: props.dateFormate,
      },
    })

    dateSetReceivedSuccess.value = response.data.receivedSuccessfully

    console.log("dateSetReceivedSuccess", dateSetReceivedSuccess.value)
  } catch (error) {
    console.error(`Error: `, error)
  }
}

onMounted(() => {
  getDataForAPI()

})

const vuetifyTheme = useTheme()

const expenseRationChartConfig = watch(() =>
  getDonutChartConfigPOSuccess(vuetifyTheme.current.value),
)

const expenseRationChartConfigNoData = watch(() =>
  getDonutChartConfigPOSuccessNoData(vuetifyTheme.current.value),
)

const series = ref([])

const seriesNoData = [100]

const checkSeries = ref(true)

watchEffect(() => {
  // console.log('date Set', props.dataset)
  
  if(props.dataset.receivedPo === 0 && props.dataset.tranferIn === 0 && props.dataset.receivedOther === 0 ){
    checkSeries.value = false
  } else {
    series.value = [
      props.dataset.receivedPo || 0,
      props.dataset.tranferIn || 0,
      props.dataset.receivedOther || 0,
    ]
    checkSeries.value = true
  }

  
  // if(dateSetReceivedSuccess.value.receivedPo === 0 && dateSetReceivedSuccess.value.tranferIn === 0 && dateSetReceivedSuccess.value.receivedOther === 0 ){
  //   checkSeries.value = false
  // } else {
  //   series.value = [
  //     dateSetReceivedSuccess.value.receivedPo || 0,
  //     dateSetReceivedSuccess.value.tranferIn || 0,
  //     dateSetReceivedSuccess.value.receivedOther || 0,
  //   ]
  //   checkSeries.value = true
  // }

  series.value = [
    10,
    2,
    4,
  ]
})
</script>

<template>
  <i class="ri-pie-chart-2-fill" />
  <VRow>
    <VCol cols="12">
      <div v-if="checkSeries">
        <VueApexCharts
          type="donut"
          height="250"
          :options="expenseRationChartConfig"
          :series="series"
        />
        {{ checkSeries }}
      </div>
      <div
        v-if="!checkSeries"
        class="d-flex justify-center alight-center"
      >
        <VueApexCharts
          type="donut"
          height="250"
          :options="expenseRationChartConfigNoData"
          :series="seriesNoData"
        />
        
        <div class="d-flex justify-center align-center">
          <VIcon icon="ri-donut-chart-fill" />
        </div>
        <div class="d-flex justify-center align-center">
          NO DATA
        </div>
      </div>
    </VCol>
  </VRow>
</template>
