<script setup>
import VueApexCharts from 'vue3-apexcharts'
import {
  useRtl,
  useTheme,
} from 'vuetify'
import { hexToRgb } from '@layouts/utils'

const moreList = [
  {
    title: 'Yearly',
    value: 'refresh',
  },
  {
    title: 'Monthly',
    value: 'refresh',
  },
  {
    title: 'Weekly',
    value: 'update',
  },
  {
    title: 'Daily',
    value: 'share',
  },
]

const vuetifyTheme = useTheme()


const chartConfigMix = computed(() => {
  
  return {
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [1, 1, 4],
    },
    title: {
      text: 'XYZ - Stock Analysis (2009 - 2016)',
      align: 'left',
    },
    xaxis: {
      categories: [ '00:00', '03:00', '06:00', '09:00',  '12:00',  '15:00', '18:00', '21:00'],
    },
    yaxis: [
      {
        min: 0,
        seriesName: 'Income',
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#008FFB',
        },
        labels: {
          style: {
            colors: '#008FFB',
          },
        },
        title: {
          text: "Income (thousand crores)",
          style: {
            color: '#008FFB',
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      {
        min: 0,
        seriesName: 'Cashflow',
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#00E396',
        },
        labels: {
          style: {
            colors: '#00E396',
          },
        },
        title: {
          text: "Operating Cashflow (thousand crores)",
          style: {
            color: '#00E396',
          },
        },
      },
      {
        seriesName: 'Revenue',
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#FEB019',
        },
        labels: {
          style: {
            colors: '#FEB019',
          },
        },
        title: {
          text: "Revenue (thousand crores)",
          style: {
            color: '#FEB019',
          },
        },
      },
    ],
    tooltip: {
      fixed: {
        enabled: true,
        position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
        offsetY: 30,
        offsetX: 60,
      },
    },
    legend: {
      horizontalAlign: 'left',
      offsetX: 40,
    },
  }
})

const series = [
  {
    name: 'PO',
    type: 'column',
    data: [14, 20, 25, 15, 25, 28, 38, 46],
  }, {
    name: 'Transfer In',
    type: 'column',
    data: [11, 30, 31, 40, 41, 49, 65, 85],
  }, {
    name: 'Other',
    type: 'column',
    data: [25, 54, 11, 30, 55, 80, 13, 90],
  }, {
    name: 'Peoples',
    type: 'line',
    data: [20, 29, 37, 36, 44, 45, 50, 100],
  },
]

const total = computed(() => {
  return series[0].data.reduce((acc, val) => acc + val, 0)
})
</script>

<template>
  <VCard>
    <VCardTitle class="d-flex justify-center">
      <VRow>
        <VCol cols="6">
          <div class="d-flex justify-end">
            {{ $t('Category') }}
          </div>
        </VCol>
        <VCol cols="6">
          <div class="d-flex justify-end">
            <MoreBtn :menu-list="moreList" />
          </div>
        </VCol>
      </VRow>
    </VCardTitle>
    <VCardSubtitle>{{ $t(`Total ${total} Products`) }}</VCardSubtitle>

    <VueApexCharts
      type="line"
      height="330"
      :options="chartConfigMix"
      :series="series"
    />
  </VCard>
</template>
