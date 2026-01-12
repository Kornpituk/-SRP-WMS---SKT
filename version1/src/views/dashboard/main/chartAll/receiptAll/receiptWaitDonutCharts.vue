<script setup>
import VueApexCharts from "vue3-apexcharts"
import { useTheme } from "vuetify"
import { getDonutChartConfigPOWaiting, getDonutChartConfigPOWaitingNoData } from "@/views/dashboard/main/chartAll/receiptAll/apexCharConfig"
import { watchEffect, defineProps } from 'vue'

const props = defineProps({
  dataset: {
    type: Array,
    required: true,
  },
})

const vuetifyTheme = useTheme()

const expenseRationChartConfig = computed(() =>
  getDonutChartConfigPOWaiting(vuetifyTheme.current.value),
)

const expenseRationChartConfigNoData = computed(() =>
  getDonutChartConfigPOWaitingNoData(vuetifyTheme.current.value),
)

const series = ref([])

const seriesNoData = [100]

const checkSeries = ref(true)

watch(() => {
  // console.log('date Set', props.dataset)

  if(props.dataset.receivedPo === 0 && props.dataset.tranferIn === 0  ){
    checkSeries.value = false
  } else {
    series.value = [
      props.dataset.receivedPo || 0,
      props.dataset.tranferIn || 0,
    ]
    checkSeries.value = true
  }
})
</script>

<template>
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
