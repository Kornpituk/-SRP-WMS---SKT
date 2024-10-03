<script setup>
import { ref, watchEffect } from 'vue'
import VueApexCharts from "vue3-apexcharts"

const series2 = [150, 50, 213, 279]

const chartConfigPola = computed(() => {
  return {
    chartOptions: {
      chart: {
        type: 'polarArea',
      },
      labels: ['Rose A', 'Rose B', 'Rose C', 'Rose D'], // เปลี่ยนชื่อตรงนี้
      stroke: {
        colors: ['#fff'],
      },
      fill: {
        opacity: 0.8,
      },
      legend: {
        position: 'bottom',
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
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
          <VCardTitle>Total Product Move</VCardTitle>
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
