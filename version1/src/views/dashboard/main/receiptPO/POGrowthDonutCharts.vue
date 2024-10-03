<script setup>
import VueApexCharts from "vue3-apexcharts"
import { useTheme } from "vuetify"
import { getDonutChartConfigPO } from "@/views/dashboard/main/receiptPO/apexCharConfig"

const vuetifyTheme = useTheme()

const expenseRationChartConfig = computed(() =>
  getDonutChartConfigPO(vuetifyTheme.current.value),
)

const series = [56, 75]
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
