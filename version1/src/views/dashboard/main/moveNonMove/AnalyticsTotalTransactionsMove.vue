<script setup>
import VueApexCharts from "vue3-apexcharts"
import { useTheme } from "vuetify"
import { hexToRgb } from "@layouts/utils"

import TopProductMove from "@/views/dashboard/main/moveNonMove/topProductMove/EcommerceTopReferralSources.vue"
import TopProductNonMove from "@/views/dashboard/main/moveNonMove/topProductNonMove/EcommerceTopReferralSources.vue"

import ChartJsPolarAreaChartMove from "@/views/dashboard/main/moveNonMove/chartPola/polaChartMoveNew.vue"
import ChartJsPolarAreaChartNonMove from "@/views/dashboard/main/moveNonMove/chartPola/polaChartNonMoveNew.vue"

import ChartJsBarChartMove from "@/views/dashboard/main/moveNonMove/chartPola/barChartTopMove.vue"
import ChartJsBarChartNonMove from "@/views/dashboard/main/moveNonMove/chartPola/barChartTopNonMove.vue"

const isDialogTopProductVisible = ref(false)

const series = [
  {
    name: "Move",
    data: [83, 153, 213, 279, 213, 153, 83],
  },
  {
    name: "Non Move",
    data: [-84, -100, -216, -282, -216, -156, -84],
  },
]

const averages = series.map(serie => {
  const total = serie.data.reduce((acc, curr) => acc + curr, 0)

  return total / serie.data.length
})

const moreList = [
  {
    title: "Refresh",
    value: "refresh",
  },
  {
    title: "Update",
    value: "update",
  },
  {
    title: "Share",
    value: "share",
  },
]

const reports = [
  {
    title: "Move",
    stats: averages[0].toFixed(2),
  },
  {
    title: "Non Move",
    stats: averages[1].toFixed(2),
  },
]

const vuetifyTheme = useTheme()

const chartConfig = computed(() => {
  const themeColors = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables

  const borderColor = `rgba(${hexToRgb(
    String(variableTheme["border-color"]),
  )},${variableTheme["border-opacity"]})`

  const disabledText = `rgba(${hexToRgb(
    String(themeColors["on-background"]),
  )},${variableTheme["disabled-opacity"]})`

  return {
    chart: {
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { show: true },
    },
    tooltip: { y: { formatter: val => `${Math.abs(val)}` } },
    legend: { show: true },
    dataLabels: { enabled: true },
    colors: [
      `rgba(${hexToRgb(String(themeColors.primary))}, 1)`,
      `rgba(${hexToRgb(String(themeColors.error))}, 1)`,
    ],
    grid: {
      borderColor,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
      padding: {
        top: 20,
        bottom: -25,
      },
    },
    states: {
      hover: { filter: { type: "none" } },
      active: { filter: { type: "none" } },
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        barHeight: "50%",
        horizontal: true,
        endingShape: "flat",
        startingShape: "rounded",
      },
    },
    xaxis: {
      position: "top",
      axisTicks: { show: true },
      axisBorder: { show: true },
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      labels: {
        formatter: val => `${Math.abs(Number(val))}`,
        style: { colors: disabledText },
      },
    },
    yaxis: { labels: { show: true } },
  }
})

const performance = (averages[0] + averages[1]) / 2

const chartJsCustomColors = {
  white: '#fff',
  yellow: '#ffe802',
  primary: '#836af9',
  areaChartBlue: '#2c9aff',
  barChartYellow: '#ffcf5c',
  polarChartGrey: '#4f5d70',
  polarChartInfo: '#299aff',
  lineChartYellow: '#d4e157',
  polarChartGreen: '#28dac6',
  lineChartPrimary: '#9e69fd',
  lineChartWarning: '#ff9800',
  horizontalBarInfo: '#26c6da',
  polarChartWarning: '#ff8131',
  scatterChartGreen: '#28c76f',
  warningShade: '#ffbd1f',
  areaChartBlueLight: '#84d0ff',
  areaChartGreyLight: '#edf1f4',
  scatterChartWarning: '#ff9f43',
  readAccent3: '#FF1744',
}

//------------------------------ Dialog --------------------------------
const isDialogMovingVisible = ref(false)
const isDialogNonMovingVisible = ref(false)

//----------------------------------------------------------------------------
const getSwitchThemeColor = ref('primary')
const getSwitchThemeColorText = ref('white')
const logicLuxOn = ref(false)
const hover = ref(false)

watchEffect(() => {
  localStorage.getItem('srp-theme-config')
  if(localStorage.getItem('srp-theme-config') === 'primary') {
    getSwitchThemeColor.value = 'red-darken-4'
  }else if(localStorage.getItem('srp-theme-config') === 'warehouse-harmony'){
    getSwitchThemeColor.value = 'red-lighten-3'
    getSwitchThemeColorText.value = 'black'
  } else if(localStorage.getItem('srp-theme-config') === 'inventory-insight'){
    getSwitchThemeColor.value = 'red-lighten-2'
  } else if(localStorage.getItem('srp-theme-config') === 'logistics-luxe'){
    
    logicLuxOn.value = true

    if(hover.value){
      getSwitchThemeColor.value = 'red-lighten-1'
      getSwitchThemeColorText.value = 'white'
    }else {
      getSwitchThemeColor.value = 'white'
      getSwitchThemeColorText.value = 'red-lighten-1'
    }
  } else if(localStorage.getItem('srp-theme-config') === 'operation-optimizer'){
    getSwitchThemeColor.value = 'red'
  }
})
</script>

<template>
  <div>
    <!-- Dialog Moving -->
    <VDialog
      v-model="isDialogMovingVisible"
      persistent
      width="800"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardTitle class="d-flex justify-space-between bg-green">
          <div>
            <span class="text-white">{{ $t('Item Moving Stock') }}</span>
          </div>
          <div>
            <IconBtn
              size="30"
              @click="isDialogMovingVisible = false"
            >
              <VIcon
                size="30"
                icon="mdi-close-circle"
              />
            </IconBtn>
          </div>
        </VCardTitle>

        <VCardText>
          <TopProductMove />
        </VCardText>
      </VCard>
    </VDialog>

    <!-- Dialog Non Moving -->
    <VDialog
      v-model="isDialogNonMovingVisible"
      width="800"
      persistent
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardTitle class="d-flex justify-space-between bg-red">
          <div>
            <span class="text-white">{{ $t('Item Non Moving Stock') }}</span>
          </div>
          <div>
            <IconBtn
              size="30"
              @click="isDialogNonMovingVisible = false"
            >
              <VIcon
                size="30"
                icon="mdi-close-circle"
              />
            </IconBtn>
          </div>
        </VCardTitle>

        <VCardText>
          <TopProductNonMove />
        </VCardText>
      </VCard>
    </VDialog>
  </div>

  <VRow>
    <VCol
      cols="12"
      lg="6"
    >
      <VCard
        class=""
        @click="isDialogMovingVisible = true"
      >
        <VCardTitle class="d-flex justify-center">
          <span style="font-size: 16px; font-weight: 800;">{{ $t('Top 5 : Moving Stock') }}</span>
        </VCardTitle>
        <VRow no-gutters>
          <VCol
            cols="12"
            sm="12"
            :class="$vuetify.display.xs ? 'border-b' : 'border-e'"
          >
            <VCardText>
              <ChartJsBarChartMove />
            </VCardText>
          </VCol>
        </VRow>
      </VCard>
    </VCol>

    <VCol
      cols="12"
      lg="6"
    >
      <VCard @click="isDialogNonMovingVisible = true">
        <VCardTitle class="d-flex justify-center">
          <span style="font-size: 16px; font-weight: 800;">{{ $t('Top 5 : Non Moving Stock') }}</span>
        </VCardTitle>
        <VRow no-gutters>
          <VCol
            cols="12"
            sm="12"
            :class="$vuetify.display.xs ? 'border-b' : 'border-e'"
          >
            <VCardText>
              <ChartJsBarChartNonMove />
            </VCardText>
          </VCol>
        </VRow>
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
