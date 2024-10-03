<script setup>
import VueApexCharts from "vue3-apexcharts";
import { useTheme } from "vuetify";
import { getSemiCircularChartConfigProduct } from "@/views/dashboard/main/optionsChart/apexCharConfig";

const vuetifyTheme = useTheme();
const expenseSemiCircleChartConfig = computed(() =>
  getSemiCircularChartConfigProduct(
    vuetifyTheme.current.value,
    colorChartConfig,
    nameTypeProduct.value
  )
);

const colorChartConfig = "#651FFF"

const series = [55]

const nameTypeProduct = ref("Product Store")
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VueApexCharts type="radialBar" :options="expenseSemiCircleChartConfig" :series="series" />
    </VCol>
  </VRow>
</template>
