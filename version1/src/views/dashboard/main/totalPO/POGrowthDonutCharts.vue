<script setup>
import VueApexCharts from "vue3-apexcharts"
import { useTheme } from "vuetify"
import { getDonutChartConfigPO } from "@/views/dashboard/main/totalPO/chartOptionsPO"

const vuetifyTheme = useTheme()

const expenseRationChartConfig = computed(() =>
  getDonutChartConfigPO(vuetifyTheme.current.value),
)

const series = [66, 46, 15]
</script>

<template>
  <VRow>
    <VCol cols="12">
      <div>
        <VueApexCharts
          type="donut"
          height="250"
          :options="expenseRationChartConfig"
          :series="series"
        />
      </div>
    </VCol>
  </VRow>
</template>
