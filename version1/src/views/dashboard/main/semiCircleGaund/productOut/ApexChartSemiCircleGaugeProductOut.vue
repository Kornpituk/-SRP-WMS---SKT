<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { getSemiCircularChartConfigProduct } from '@/views/dashboard/main/optionsChart/apexCharConfig'

const vuetifyTheme = useTheme()
const expenseSemiCircleChartConfig = computed(() => getSemiCircularChartConfigProduct(vuetifyTheme.current.value, colorChartConfig, nameTypeProduct.value))

const colorChartConfig = '#FFEB3B'

const series = [
  45,
]

const nameTypeProduct = ref('Product Out')
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VueApexCharts type="radialBar" :options="expenseSemiCircleChartConfig" :series="series" />
    </VCol>
  </VRow>
</template>
