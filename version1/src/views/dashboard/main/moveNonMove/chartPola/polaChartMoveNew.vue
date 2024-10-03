<script setup>
import { useTheme } from 'vuetify'

// import { getPolarChartConfig } from '@/views/dashboard/main/chartAll/pickingAll/apexCharConfig'

import { getDonutChartConfigPOSuccessMove } from "@/views/dashboard/main/moveNonMove/chartPola/apexCharConfig"


import PolarAreaChart from '@core/libs/chartjs/components/PolarAreaChart'

const props = defineProps({
  colors: {
    type: null,
    required: true,
  },
})

const vuetifyTheme = useTheme()
const chartConfig = computed(() => getDonutChartConfigPOSuccessMove(vuetifyTheme.current.value))

const data = {
  labels: [
    'Shoes',
    'Female',
    'Male',
    'Shirts',
    'Pants',
    'Jackets',
  ],
  datasets: [{
    borderWidth: 0,
    label: 'Product Move',
    data: [
      19,
      17.5,
      15,
      13.5,
      11,
      9,
    ],
    backgroundColor: [
      props.colors.primary,
      props.colors.yellow,
      props.colors.polarChartWarning,
      props.colors.polarChartInfo,
      props.colors.scatterChartGreen,
      props.colors.readAccent3,
    ],
  }],
}
</script>

<template>
  <PolarAreaChart
    :height="400"
    :chart-data="data"
    :chart-options="chartConfig"
  />
</template>
