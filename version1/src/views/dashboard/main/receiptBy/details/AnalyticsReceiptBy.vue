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
  const borderColor = `rgba(${hexToRgb(String(variableTheme['border-color']))},${variableTheme['border-opacity']})`
  const disabledText = `rgba(${hexToRgb(String(themeColors['on-background']))},${variableTheme['disabled-opacity']})`
  const primaryText = `rgba(${hexToRgb(String(themeColors['on-background']))},${variableTheme['high-emphasis-opacity']})`

  return {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: true },
    },
    tooltip: {
      fixed: {
        enabled: false,
        position: 'topRight',
        offsetX: 0,
        offsetY: 0,
      },
      theme: 'dark',
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function () {
            return ''
          },
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        barHeight: '90%',
        horizontal: true,
        distributed: true,
        startingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'end',
      offsetY: 5,
      style: {
        fontWeight: 200,
        fontSize: '0.6rem',
      },
    },
    grid: {
      strokeDashArray: 8,
      borderColor,
      padding: {
        top: -18,
        left: 10,
        right: 33,
        bottom: 10,
      },
    },
    colors: [
      `rgba(${hexToRgb(String(themeColors.primary))}, 1)`,
      `rgba(${hexToRgb(String(themeColors.success))}, 1)`,
      `rgba(${hexToRgb(String(themeColors.warning))}, 1)`,
      `rgba(${hexToRgb(String(themeColors.info))}, 1)`,
      `rgba(${hexToRgb(String(themeColors.error))}, 1)`,
      `#E91E63`,
      `#9C27B0`,
      `#2196F3`,
      `#009688`,
      `#8BC34A`,
      `#CDDC39`,
      `#795548`,
      `#FF9800`,
      `#FFC107`,
      `#607D8B`,
      `#00BCD4`,
      `#03A9F4`,
    ],
    legend: { show: true, showForSingleSeries: true },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } },
    },
    xaxis: {
      categories: [
        'เสื้อเชิตแขนยาว-M',
        'เสื้อยืดสีพื้น-S	',
        'เสื้อยืดสีพื้น-S	',
        'LADIES WEAR/DENIM/PANTS/สีขาว/M/Beverly Hills Polo Club สำนักงานใหญ่	',
        'LADIES WEAR/DENIM/PANTS/สยามกลการ	',
        'กางเกง',
        'กางเกงยีนส์ทรงขาเดฟ:สีกลาง:27	',
        'กางเกงขายาว	',
        'กางเกงผู้หญิง	',
        'กางเกงยีนส์ทรงสลิม:สีกลาง:29	',
      ],
      labels: {
        formatter: val => `${Number(val) / 1000}k`,
        style: {
          fontSize: '0.8rem',
          colors: disabledText,
        },
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
  }
})

const min = 1000
const max = 99999
const numNumbers = 10
let sum = 0
const numbers = []
for (let i = 0; i < numNumbers; i++) {
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min

  const formattedNumber = randomNumber // แปลงค่า randomNumber เป็นรูปแบบที่มีเครื่องหมายคอมม่า (,)

  numbers.push(formattedNumber) // เพิ่มค่า formattedNumber เข้าไปในอาร์เรย์ numbers
  sum += randomNumber
}

const subtitleTotal = ref("Total :" + sum.toLocaleString() + " Product In")

const series = [{
  name: 'Sales',
  data: numbers,
}]
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Product In" :subtitle="subtitleTotal">
        <template #append>
          <div class="mt-n8 me-n3">
            <MoreBtn :menu-list="moreList" />
          </div>
        </template>

        <VueApexCharts type="bar" height="330" :options="chartConfig" :series="series" />
      </VCard>
    </VCol>
  </VRow>
</template>
