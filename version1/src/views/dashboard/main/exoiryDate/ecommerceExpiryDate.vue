<script setup>
import VueApexCharts from 'vue3-apexcharts'
import {
  useRtl,
  useTheme,
} from 'vuetify'
import { hexToRgb } from '@layouts/utils'
import { height } from '@/views/demos/forms/tables/simple-table/demoCodeSimpleTable'

import ReceiptWaiting from '@/views/dashboard/main/exoiryDate/Details/details.vue'

import { defineProps } from 'vue'

//------------------------------------- Define Props -------------------------------
const props = defineProps({
  dataset: {
    type: Array,
    required: true,
  },
})

const getSwitchThemeColor = ref('red-darken-1')
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
    logicLuxOn.value = true

    if(hover.value){
      getSwitchThemeColor.value = 'white'
      getSwitchThemeColorText.value = 'red-lighten-1'
    }else {
      getSwitchThemeColor.value = 'red-lighten-4'
      getSwitchThemeColorText.value = 'black'
    }
  }
})

const whereHouse = localStorage.getItem('whereHouseName')
const accessToken = localStorage.getItem('accessTokenAtStore')

import { urlApi } from '@/api'
import axios from '@axios'
import DemoFormLayoutCollapsible from '@/views/demos/forms/form-layout/DemoFormLayoutCollapsible.vue'

//*******---------       Get Expire Date Form Api            --------------  */
const expiryDateSummary = ref('')
const expiryDateSummaryCat = ref(0)
const expiryDateSummaryProduct = ref(0)

const getSummaryExpiryDate = () => {
  axios.get(`${urlApi.value}/api/v1/Dashboard/Summary/ProductExpire`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-location': whereHouse,
    },
  })
    .then(response => {
      const responseData = response.data

      expiryDateSummary.value = responseData
      expiryDateSummaryCat.value = responseData.categorys
      expiryDateSummaryProduct.value = responseData.products

      // console.log('Response Length product:', responseLength)
      console.log("expireDate", responseData)
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })

    
}

watchEffect(getSummaryExpiryDate)

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
</script>

<template>
  <VCard
    v-if="!logicLuxOn"
    ripple
    class="cursor-pointer"
    :color="getSwitchThemeColor" 
    :to="{ name: 'dashboards-shortCutMenu-expireDate' }"
  >
    <VCardText>
      <div class="d-flex align-center justify-center">
        <VIcon
          size="80"
          icon="mdi-alert-box"
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
            {{ $t('Expiry Date') }}
          </span>
        </span>
      </div>
    </VCardText>

    <!-- MAX - MIN -->
    <VCardText class="">
      <VRow no-gutters>
        <VCol cols="5">
          <div class="d-flex align-center justify-center mb-3">
            <span
              style="font-size: 16px; font-weight: bolder;"
              class="text-white"
              :class="`text-${getSwitchThemeColorText}`"
            >{{ $t('Categories') }}</span>
          </div>

          <VRow class="d-flex justify-center ">
            <VCol
              class="d-flex justify-center align-center "
              cols="4"
            >
              <div>
                <span
                  :class="`text-${getSwitchThemeColorText}`"
                  class="text-h5 text-disabled clamp-text text-white"
                >{{ expiryDateSummaryCat }}</span>
              </div>
            </VCol>
          </VRow>
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
          <div class="d-flex align-center justify-center mb-3">
            <span
              style="font-size: 16px; font-weight: bolder;"
              class="text-white"
              :class="`text-${getSwitchThemeColorText}`"
            >{{ $t('List') }}</span>
          </div>
          <VRow class="d-flex justify-center ">
            <VCol
              class="d-flex justify-center align-center "
              cols="4"
            >
              <div>
                <span
                  :class="`text-${getSwitchThemeColorText}`"
                  class="text-h5 text-disabled clamp-text text-white"
                >{{ expiryDateSummaryProduct }}</span>
              </div>
            </VCol>
          </VRow>
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
            class="bg-red-lighten-1 d-flex justify-start align-center text-h5"
          >
            <span style="margin-left: 10px;">{{ $t('Expiry Date') }}</span> 
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
            class="text-h5 bg-red-lighten-1 d-flex justify-center cursor-pointer"
            @click="isDialogDetailVisible = false"
          >
            {{ $t('Close') }}
          </VCardActions>
        </VCard>
      </VDialog>
    </section>
  </VCard>


  <VCard
    v-if="logicLuxOn"
    :to="{ name: 'dashboards-shortCutMenu-expireDate' }"
    :color="getSwitchThemeColor"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <VCardText class="pa-2">
      <div class="d-flex align-center justify-start">
        <VIcon
          size="60"
          :color="getSwitchThemeColorText"
          icon="mdi-alert-box"
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
            <span :class="`text-${getSwitchThemeColorText}`"><strong>{{ $t('Expiry Date') }}</strong></span>
          </span>
        </span>
      </div>
    </VCardText>

    <!--  -->
    <VCardText class="py-1">
      <VRow no-gutters>
        <VCol cols="6">
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
                class="me-2"
                :class="`text-${getSwitchThemeColorText}`"
              >{{ $t('Categories') }}&nbsp;</span><span
                :class="`text-${getSwitchThemeColorText}`"
                style="font-size: 25px;"
              >{{ expiryDateSummaryCat }}</span>
            </VCardTitle>
          </VCard>
        </VCol>

        <VCol
          cols="6"
          class="text-start px-3"
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
              >{{ $t('List') }}&nbsp;</span><span
                :class="`text-${getSwitchThemeColorText}`"
                style="font-size: 25px;"
              >{{ expiryDateSummaryProduct }}</span>
            </VCardTitle>
          </VCard>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
