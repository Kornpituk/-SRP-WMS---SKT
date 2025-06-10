<script setup>
import { hexToRgb } from '@layouts/utils'
import VueApexCharts from 'vue3-apexcharts'
import {
  useRtl,
  useTheme,
} from 'vuetify'

const props = defineProps({
  categories: Array,
  series: Array,
  date: String,
})

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

const calScaleBarHight = series => {
  if (!series || series.length === 0) {
    return '10%'
  }
  const maxValue = series.length
  if (maxValue > 4) {
    return '60%'
  } else if (maxValue > 2) {
    return '40%'
  } else if (maxValue > 1) {
    return '30%'
  } else {
    return '15%'
  }
}

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
      toolbar: { show: false,
        export: {
          csv: {
            filename: function() {
              const now = new Date()
              const dateStr = now.toISOString().slice(0, 10)
              const timeStr = now.toTimeString().slice(0, 5).replace(':', '')
              
              return `Non_Moving_Stock_(last 30 days)_${calDateReverse30Days.value}_${props.date}`
            }(),
  
            columnDelimiter: ',',
            headerCategory: 'Category',
            headerValue: 'Value',
          },
          svg: {
            filename: (() => {
              const date = new Date().toLocaleDateString('th-TH').replace(/\//g, '-')

              const time = new Date().toLocaleTimeString('th-TH', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
              }).replace(':', '')

              return `Non_Moving_Stock_(last 30 days)_${calDateReverse30Days.value}_${props.date}`
            })(),
          },
          png: {
            filename: (() => {
              const date = new Date().toLocaleDateString('th-TH').replace(/\//g, '-')

              const time = new Date().toLocaleTimeString('th-TH', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
              }).replace(':', '')

              return `Non_Moving_Stock_(last 30 days)_${calDateReverse30Days.value}_${props.date}`
            })(),
          },
        },
        
      },
    },
    title: {
      text: `Non Moving Stock (last 30 days) ${calDateReverse30Days.value} - ${props.date}`,
      align: 'center',
      style: {
        fontSize: '16px',

        // color: themePrimaryTextColor,
      },
    },
    subtitle: {
      text: '',
      align: 'center',
      style: {
        fontSize: '14px',

        // color: themeSecondaryTextColor,
      },
    },
    tooltip: { enabled: false },
    plotOptions: {
      bar: {
        borderRadius: 8,
        barHeight: calScaleBarHight(props.series),
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
      formatter: val => {
        // return val / 1000 + 'K'
        return new Intl.NumberFormat().format(val)
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
      `rgba(244, 67, 54, 0.5)`,
    ],
    legend: { show: false },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } },
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: props.categories,
    },
    yaxis: {
      labels: {
        align: rtl.isRtl.value ? 'right' : 'left',
        style: {
          fontWeight: 600,
          fontSize: '0.875rem',
          colors: primaryText,
        },

        // formatter: val => {
        //   // return val / 1000 + 'K'
        //   return new Intl.NumberFormat().format(val)
        // },
      },
    },
  }
})

const series = [{
  name: 'Sales',
  data: props.series,
}]

const chartSeries = computed(() => {
  if (!props.series || props.series.length === 0) {
    return [{
      name: 'จำนวน',
      data: [],
    }]
  }
  
  return [{
    name: 'จำนวน',
    data: props.series,
  }]
})

const calDateReverse30Days = computed(() => {
  const [dayStr, monthStr, yearStr] = props.date.split('/')
  const date = new Date(Number(yearStr), Number(monthStr) - 1, Number(dayStr)) // ✅ เดือน -1 เพราะ JavaScript นับเดือนจาก 0

  date.setDate(date.getDate() - 30) // ลบ 30 วัน

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
})

const total = computed(() => {
  return series[0].data.reduce((acc, val) => acc + val, 0)
})
</script>

<template>
  <VCard>
    <VCardTitle v-if="false" class="d-flex justify-center">
      {{ $t('Non Moving Stock (last 30 days)') }}: {{ calDateReverse30Days }} - {{ props.date }}
    </VCardTitle>
    <VCardSubtitle v-if="false">
      {{ $t(`Total ${total} Products`) }}
    </VCardSubtitle>
    <VueApexCharts
      type="bar"
      height="250"
      :options="chartConfig"
      :series="chartSeries"
    />
  </VCard>
</template>
