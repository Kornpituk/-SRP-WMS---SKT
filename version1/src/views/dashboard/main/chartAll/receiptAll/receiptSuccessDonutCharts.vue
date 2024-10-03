<script setup>
import { getDonutChartConfigPOSuccess, getDonutChartConfigPOSuccessNoData } from "@/views/dashboard/main/chartAll/receiptAll/apexCharConfig"
import { defineProps, watchEffect } from 'vue'
import VueApexCharts from "vue3-apexcharts"
import { useTheme } from "vuetify"

const props = defineProps({
  dataset: {
    type: Array,
    required: true,
  },
})

const vuetifyTheme = useTheme()

const expenseRationChartConfig = computed(() =>
  getDonutChartConfigPOSuccess(vuetifyTheme.current.value),
)

const expenseRationChartConfigNoData = computed(() =>
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
      </div>
    </VCol>
  </VRow>
</template>
