<script setup>
import VueApexCharts from 'vue3-apexcharts'
import {
  useRtl,
  useTheme,
} from 'vuetify'
import { hexToRgb } from '@layouts/utils'
import { height } from '@/views/demos/forms/tables/simple-table/demoCodeSimpleTable'

import ReceiptWaiting from '@/views/dashboard/main/maxMinProduct/Details/details.vue'

import { defineProps } from 'vue'

//------------------------------------- Define Props -------------------------------
const props = defineProps({
  dataset: {
    type: Array,
    required: true,
  },
})

const getSwitchThemeColor = ref('indigo-darken-1')
const getSwitchThemeColorText = ref('white')
const logicLuxOn = ref(false)
const hover = ref(false)

watchEffect(() => {
  localStorage.getItem('srp-theme-config')
  if(localStorage.getItem('srp-theme-config') === 'primary') {
    getSwitchThemeColor.value = 'indigo'
  }else if(localStorage.getItem('srp-theme-config') === 'warehouse-harmony'){
    getSwitchThemeColor.value = 'indigo-lighten-3'
    getSwitchThemeColorText.value = 'black'
  } else if(localStorage.getItem('srp-theme-config') === 'inventory-insight'){
    getSwitchThemeColor.value = 'indigo-lighten-2'
  } else if(localStorage.getItem('srp-theme-config') === 'logistics-luxe'){
    logicLuxOn.value = true
    if(hover.value){
      getSwitchThemeColor.value = 'indigo-lighten-1'
      getSwitchThemeColorText.value = 'white'
    }else {
      getSwitchThemeColor.value = 'white'
      getSwitchThemeColorText.value = 'indigo-lighten-1'
    }
    
  } else if(localStorage.getItem('srp-theme-config') === 'operation-optimizer'){
    logicLuxOn.value = true
    if(hover.value){
      getSwitchThemeColor.value = 'white'
      getSwitchThemeColorText.value = 'indigo-lighten-1'
    }else {
      getSwitchThemeColor.value = 'indigo-lighten-4'
      getSwitchThemeColorText.value = 'black'
    }
  }
})

//--------------------------------------- Get Summa Api --------------------------------
const whereHouse = localStorage.getItem('whereHouseName')
const accessToken = localStorage.getItem('accessTokenAtStore')

import { urlApi } from '@/api'
import axios from '@axios'

//*******---------       Get Expire Date Form Api            --------------  */
const minMaxDateSummary = ref(0)
const minCatSummary = ref(0)
const minProductSummary = ref(0)
const maxCatSummary = ref(0)
const maxProductSummary = ref(0)

const getSummaryMinMax = () => {
  console.log('getSummaryMinMax')
  axios.get(`${urlApi.value}/api/v1/Dashboard/Summary/StockMaxMin`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-location': `${whereHouse}`,
    },
  })
    .then(response => {
      const responseData = response.data

      
      minMaxDateSummary.value = responseData

      console.log('getSummaryMinMax2', responseData.stockMax.categorys)
      minCatSummary.value = responseData.stockMin?.categorys || 0
      minProductSummary.value = responseData.stockMin?.products || 0
      maxCatSummary.value = responseData.stockMax?.categorys || 0
      maxProductSummary.value = responseData.stockMax?.products || 0

      

      // console.log('Response Length product:', responseLength)
      console.log("MinMax", minMaxDateSummary.value)
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })

    
}

watchEffect(getSummaryMinMax)

const vuetifyTheme = useTheme()

const series = ref([
  {
    name: 'MAX',
    data: [44],
  },
  {
    name: 'MIN',
    data: [76],
  },
])

const chartConfig = computed(() => {
  const themeColors = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  const borderColor = `rgba(${hexToRgb(String(variableTheme['border-color']))},${variableTheme['border-opacity']})`
  const disabledText = `rgba(${hexToRgb(String(themeColors['on-background']))},${variableTheme['disabled-opacity']})`
  const primaryText = `rgba(${hexToRgb(String(themeColors['on-background']))},${variableTheme['high-emphasis-opacity']})`

  return {
    chart: {
      type: 'bar',
      height: 100,
      stacked: true,
      stackType: '100%',
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    stroke: {
      width: 1,
      colors: ['#fff'],
    },
    xaxis: {
      height: 50,
      categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "K"
        },
      },
    },
    colors: [
      `rgba(${hexToRgb(String(themeColors.primary))}, 1)`,
      `rgba(${hexToRgb(String(themeColors.error))}, 1)`,
    ],
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40,
    },
  }
})

//--------------------------------------- Card Action expand-transition------------------
const show = ref(false)

const isDialogDetailVisible = ref(false)

const router = useRouter()

const pushBtnMaxMin = MaxOrMin => {
  sessionStorage.setItem('indicationMaxMin', MaxOrMin)
  router.push('/dashboards/shortCutMenu/MinMax')
}

const indicatMin = ref('min')
const indicatMax = ref('max')
</script>

<template>
  <VCard
    v-if="!logicLuxOn"
    :color="getSwitchThemeColor"
  >
    <VCardText style="padding: 10px;">
      <div class="d-flex align-center justify-center">
        <VIcon
          size="80"
          icon="mdi-contrast-box"
          :color="getSwitchThemeColorText"
        />
      </div>
    </VCardText>
    <VCardText class="clamp-text text-white mb-0">
      <div class="d-flex align-center justify-center ">
        <span>
          <span
            style="font-size: 16px; font-weight: bolder;"
            class="clamp-text text-white"
            :class="`text-${getSwitchThemeColorText}`"
          >
            {{ $t('Stock Min & Max') }}
          </span>
        </span>
      </div>
    </VCardText>

    <!-- MAX - MIN -->
    <VCardText class="">
      <VRow no-gutters>
        <VCol>
          <VCard
            class="cursor-pointer pa-0"
            ripple
            variant="text"
            @click="pushBtnMaxMin('Min')"
          >
            <VCardText class="pa-0">
              <div class="d-flex align-center justify-center mb-3">
                <span
                  style="font-size: 16px; font-weight: bolder;"
                  class="me-2 text-white"
                  :class="`text-${getSwitchThemeColorText}`"
                >{{ $t('Min') }}</span>
              </div>

              <VRow class="d-flex justify-center">
                <VCol
                  class="d-flex justify-center align-center py-0"
                  cols="12"
                >
                  <div>
                    <span
                      :class="`text-${getSwitchThemeColorText}`"
                      class="text-xs clamp-text text-white"
                    >
                      {{ $t('Categories') }} / {{ $t('List') }}
                    </span>
                  </div>
                </VCol>
              </VRow>

              <VRow class="d-flex justify-center ">
                <VCol
                  class="d-flex justify-center align-center "
                  cols="4"
                >
                  <div>
                    <span
                      :class="`text-${getSwitchThemeColorText}`"
                      class="text-h5 text-disabled clamp-text text-white"
                    >{{ minCatSummary }}</span>
                  </div>
                </VCol>
                <VCol cols="2">
                  <div class="d-flex flex-column align-center justify-center h-100">
                    <VDivider
                      class="border-opacity-100 mx-auto"
                      :color="getSwitchThemeColorText"
                      vertical
                    />
                  </div>
                </VCol>
                <VCol
                  class="d-flex justify-center align-center"
                  cols="4"
                >
                  <div>
                    <span
                      :class="`text-${getSwitchThemeColorText}`"
                      class="text-h5 text-disabled clamp-text text-white"
                    >{{ minProductSummary }}</span>
                  </div>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>

        <VCol cols="2">
          <div class="d-flex flex-column align-center justify-center h-100">
            <VDivider
              class="border-opacity-100 mx-auto"
              :color="getSwitchThemeColorText"
              vertical
            />
          </div>
        </VCol>

        <VCol
          cols="5"
          class="text-end"
        >
          <VCard
            variant="text"
            ripple
            class="cursor-pointer pa-0"
            @click="pushBtnMaxMin('Max')"
          >
            <VCardText class="pa-0">
              <div class="d-flex align-center justify-center mb-3">
                <span
                  style="font-size: 16px; font-weight: bolder;"
                  class="me-2 text-white"
                  :class="`text-${getSwitchThemeColorText}`"
                >{{ $t('Max') }}</span>
              </div>
              <VRow class="d-flex justify-center">
                <VCol
                  class="d-flex justify-center align-center py-0"
                  cols="12"
                >
                  <div>
                    <span
                      :class="`text-${getSwitchThemeColorText}`"
                      class="text-xs clamp-text text-white"
                    >
                      {{ $t('Categories') }} / {{ $t('List') }}
                    </span>
                  </div>
                </VCol>
              </VRow>

              <VRow class="d-flex justify-center ">
                <VCol
                  class="d-flex justify-end align-center "
                  cols="4"
                >
                  <div>
                    <span
                      :class="`text-${getSwitchThemeColorText}`"
                      class="text-h5 text-disabled clamp-text text-white"
                    >{{ maxCatSummary }}</span>
                  </div>
                </VCol>
            
                <VCol cols="2">
                  <div class="d-flex flex-column align-center justify-center h-100">
                    <VDivider
                      class="border-opacity-100 mx-auto"
                      :color="getSwitchThemeColorText"
                      vertical
                    />
                  </div>
                </VCol>

                <VCol
                  class="d-flex justify-center align-start"
                  cols="4"
                >
                  <div>
                    <span
                      :class="`text-${getSwitchThemeColorText}`"
                      class="text-h5 text-disabled clamp-text text-white"
                    >{{ maxProductSummary }}</span>
                  </div>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCardText>


    <!-- Dialog -->
    <section>
      <VDialog
        v-model="isDialogDetailVisible"
        width="100%"
      >
        <!-- Dialog Content -->
        <VCard>
          <VCardTitle
            style="height: 65px;"
            class="d-flex justify-start align-center bg-indigo-lighten-1"
          >
            <span
              class="text-h5 text-white"
              style="margin-left: 10px;"
            >{{ $t('Max Min') }}</span> 
          </VCardTitle>
          <DialogCloseBtn
            style="background-color: white;"
            variant="text"
            size="small"
            @click="isDialogDetailVisible = false"
          />
          <VCardText>
            <ReceiptWaiting />
          </VCardText>
          <VCardActions
            class="d-flex justify-center bg-indigo-lighten-1 cursor-pointer"
            @click="isDialogDetailVisible = false"
          >
            <span class="text-h6 text-white">{{ $t('Close') }}</span>
          </VCardActions>
        </VCard>
      </VDialog>
    </section>
  </VCard>


  <VCard
    v-if="logicLuxOn"
    :color="getSwitchThemeColor"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <VCardText class="pa-2">
      <div class="d-flex align-center justify-start">
        <VIcon
          size="60"
          :color="getSwitchThemeColorText"
          icon="mdi-contrast-box"
          @mouseover="hover = true"
          @mouseleave="hover = false"
        />
      </div>
    </VCardText>
    <VCardText class="clamp-text text-white mb-0 py-0">
      <div class="d-flex align-center justify-start ">
        <span>
          <span
            style="font-size: 16px;"
            class="clamp-text text-white"
          >
            <span :class="`text-${getSwitchThemeColorText}`"><strong>{{ $t('Stock Min & Max') }}</strong></span>
          </span>
        </span>
      </div>
    </VCardText>

    <!--  -->
    <VCardText class="py-1">
      <VRow no-gutters>
        <VCol
          cols="6"
          class="text-start"
        >
          <VCard
            :color="getSwitchThemeColor"
            variant="text"
            @click="pushBtnMaxMin('Min')"
          >
            <VCardTitle
              class="pa-0"
              :class="`text-${getSwitchThemeColorText}`"
            >
              <span
                style="font-size: 14px; font-weight: bolder;"
                class="me-2 text-white"
                :class="`text-${getSwitchThemeColorText}`"
              >{{ $t('Min') }}&nbsp;</span>
              <span style="font-size: 25px;">&nbsp;{{ minCatSummary }} / {{ minProductSummary }}</span>
            </VCardTitle>
          </VCard>
        </VCol>
        <VCol
          cols="6"
          class="text-start"
        >
          <VCard
            :style="{ 'border-color': getSwitchThemeColorText }"
            :color="getSwitchThemeColor"
            variant="text"
            @click="pushBtnMaxMin('Max')"
          >
            <VCardTitle
              class="pa-0"
              :class="`text-${getSwitchThemeColorText}`"
              :style="{ borderColor: getSwitchThemeColorText }"
            >
              <span
                style="font-size: 14px; font-weight: bolder;"
                class="me-2 text-white"
                :class="`text-${getSwitchThemeColorText}`"
              >{{ $t('Max') }}&nbsp;</span><span style="font-size: 25px;">&nbsp;{{ maxCatSummary }} / {{ maxProductSummary }}</span> 
            </VCardTitle>
          </VCard>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
