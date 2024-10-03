<script setup>
import VueApexCharts from 'vue3-apexcharts'
import {
  useRtl,
  useTheme,
} from 'vuetify'
import { hexToRgb } from '@layouts/utils'

const moreList = [
  {
    title: 'Refresh',
    value: 'refresh',
  },
  {
    title: 'Update',
    value: 'update',
  },
  {
    title: 'Share',
    value: 'share',
  },
]

const vuetifyTheme = useTheme()

const chartConfig = computed(() => {
  const rtl = useRtl()
  const themeColors = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  const borderColor = `rgba(${ hexToRgb(String(variableTheme['border-color'])) },${ variableTheme['border-opacity'] })`
  const disabledText = `rgba(${ hexToRgb(String(themeColors['on-background'])) },${ variableTheme['disabled-opacity'] })`
  const primaryText = `rgba(${ hexToRgb(String(themeColors['on-background'])) },${ variableTheme['high-emphasis-opacity'] })`
  
  return {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: true },
    },
    tooltip: { enabled: false },
    plotOptions: {
      bar: {
        borderRadius: 8,
        barHeight: '60%',
        horizontal: true,
        distributed: true,
        startingShape: 'rounded',
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: {
      offsetY: 8,
      style: {
        fontWeight: 500,
        fontSize: '0.875rem',
      },
    },
    grid: {
      strokeDashArray: 8,
      borderColor,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
      padding: {
        top: -18,
        left: 21,
        right: 33,
        bottom: 10,
      },
    },
    colors: [
      // `rgba(${ hexToRgb(String(themeColors.primary)) }, 1)`,
      `rgba(129, 199, 132, 1)`,
    ],
    legend: { show: false },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } },
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: [
        'Shoes',
        'Female',
        'Male',
        'Shirt',
        'Beverage',
      ],
    },
    yaxis: {
      labels: {
        align: rtl.isRtl.value ? 'right' : 'left',
        style: {
          fontWeight: 600,
          fontSize: '0.875rem',
          colors: primaryText,
        },
      },
    },
  }
})

const series = [{
  name: 'Sales',
  data: [
    20,
    50,
    75,
    60,
    8,
  ],
}]

const total = computed(() => {
  return series[0].data.reduce((acc, val) => acc + val, 0)
})
</script>

<template>
  <VCard>
    <VCardTitle class="d-flex justify-center">
      <span style="font-size: 16px; font-weight: bolder;">{{ $t('Moving Stock') }}</span>
    </VCardTitle>
    <VCardSubtitle v-if="false">{{$t(`Total ${total} Products`)}}</VCardSubtitle>

    <VueApexCharts
      type="bar"
      height="250"
      :options="chartConfig"
      :series="series"
    />
  </VCard>
</template>
