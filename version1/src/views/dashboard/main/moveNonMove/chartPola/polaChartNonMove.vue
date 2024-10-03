<script setup>
import VueApexCharts from "vue3-apexcharts"
import { useTheme } from "vuetify"
import { hexToRgb } from "@layouts/utils"

import TopProductMove from "@/views/dashboard/main/topProductMove/EcommerceTopReferralSources.vue"
import TopProductNonMove from "@/views/dashboard/main/topProductNonMove/EcommerceTopReferralSources.vue"


// console.log("Average of Move:", averages[0].toFixed(2)) // 172.71428571428572
// console.log("Average of Non Move:", averages[1].toFixed(2)) // -180.85714285714286

//------------------------- Pola area chart ----------------------------------------------
const series2 = [83, 153, 180, 150]

const chartConfigPola = computed(() => {
  return {
    chartOptions: {
      chart: {
        type: 'polarArea',
      },
      labels: ['Rose A', 'Rose B', 'Rose C', 'Rose D', 'Rose E'],
      stroke: {
        colors: ['#fff'],
      },
      fill: {
        opacity: 0.8,
      },
      responsive: [{
        options: {
          legend: {
            position: 'bottom',
          },
        },
      }],
    },
  }
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VCardTitle>{{ $t('Total Product Non Move') }}</VCardTitle>
        </VCardItem>

        <VCardText>
          <VueApexCharts
            id="total-transactions-chart"
            type="polarArea"
            height="278"
            :options="chartConfigPola"
            :series="series2"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
#total-transactions-chart {
  .apexcharts-series[rel="2"] {
    transform: translateX(5px);
  }
}
</style>
