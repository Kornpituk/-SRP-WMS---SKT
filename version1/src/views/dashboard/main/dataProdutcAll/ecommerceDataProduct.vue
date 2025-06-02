<script setup>
import VueApexCharts from 'vue3-apexcharts'
import {
  useRtl,
  useTheme,
} from 'vuetify'
import { hexToRgb } from '@layouts/utils'
import { height } from '@/views/demos/forms/tables/simple-table/demoCodeSimpleTable'

import { defineProps, watch, watchEffect } from 'vue'

//------------------------------------- Define Props -------------------------------
const props = defineProps({
  dataset: {
    type: Array,
    required: true,
  },
  switchtheme: {
    type: Array,
    required: true,
  },
})

const switchTheme = ref(props.switchtheme)
const theme1 = ref(false)
const theme2 = ref(false)

watchEffect(() => {
  console.log('switchTheme:', switchTheme.value)

  if(switchTheme.value === 1){
    theme1.value = true
  } else if(switchTheme.value === 2){
    theme2.value = true
  }
})


const getSwitchThemeColor = ref('primary')
const getSwitchThemeColorText = ref('white')
const logicLuxOn = ref(false)
const hover = ref(false)

watchEffect(() => {
  localStorage.getItem('srp-theme-config')
  if(localStorage.getItem('srp-theme-config') === 'primary') {
    getSwitchThemeColor.value = 'green-lighten-1'
  }else if(localStorage.getItem('srp-theme-config') === 'warehouse-harmony'){
    getSwitchThemeColor.value = 'green-lighten-3'
    getSwitchThemeColorText.value = 'black'
  } else if(localStorage.getItem('srp-theme-config') === 'inventory-insight'){
    getSwitchThemeColor.value = 'green-lighten-2'
  } else if(localStorage.getItem('srp-theme-config') === 'logistics-luxe'){
    
    logicLuxOn.value = true

    if(hover.value){
      getSwitchThemeColor.value = 'green-lighten-1'
      getSwitchThemeColorText.value = 'white'
    }else {
      getSwitchThemeColor.value = 'white'
      getSwitchThemeColorText.value = 'green-lighten-1'
    }
  } else if(localStorage.getItem('srp-theme-config') === 'operation-optimizer'){
    logicLuxOn.value = true

    if(hover.value){
      getSwitchThemeColor.value = 'white'
      getSwitchThemeColorText.value = 'green-lighten-1'
    }else {
      getSwitchThemeColor.value = 'green-lighten-4'
      getSwitchThemeColorText.value = 'black'
    } 
  }

  console.log('logicLuxOn', logicLuxOn.value)
})


const whereHouse = localStorage.getItem('whereHouseName')
const accessToken = localStorage.getItem('accessTokenAtStore')

import { urlApi } from '@/api'
import axios from '@axios'

//*******---------       Get Expire Date Form Api            --------------  */
const productDataSummaryCat = ref(0)
const productDataSummaryProduct = ref(0)

const categoriesStockUpdate = ref(0)
const listStockUpdate = ref(0)

const getSummaryProduct = () => {
  axios.get(`${urlApi.value}/api/v1/Dashboard/Summary/Product`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-location': whereHouse,
    },
  })
    .then(response => {
      const responseData = response.data

      productDataSummaryCat.value = responseData.categorys
      productDataSummaryProduct.value = responseData.products
      categoriesStockUpdate.value = responseData.categorys
      listStockUpdate.value = responseData.products

      // console.log('Response Length product:', responseLength)
      console.log("Data Product", response.data)
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })

    
}

watchEffect(getSummaryProduct)

// console.log('props :', props.dataset[0].cat)

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

//--- Get Length Categories--------------------------------
const getLengthCategories = ref(0)
const getLengthProduct = ref(0)

watchEffect(() => {
  getLengthProduct .value = localStorage.getItem('LengthProduct')
  getLengthCategories .value = localStorage.getItem('LengthCategories')
})


//---------------------------------------- Length Stock Update-------------------------------- 


// const lengthStockUpdate = () => {
//   axios.get(`${urlApi.value}/api/v1/StockUpdate?page=1&perPage=9999`, {
//     headers: {
//       'accept': '*/*',
//       'x-location': `${whereHouse}`,
//       Authorization: `Bearer ${accessToken}`,
//     },
//   })
//     .then(response => {
//       // สมมติว่า response.data เป็น array ของวัตถุ
//       const data = response.data.items

//       // สร้าง Set เพื่อเก็บ categoryId ที่ไม่ซ้ำกัน
//       const uniqueCategoryIds = new Set()

//       // วนลูปผ่านข้อมูลและเพิ่ม categoryId ที่ไม่ซ้ำกันลงใน Set
//       data.forEach(item => {
//         uniqueCategoryIds.add(item.categoryId)
//       })

//       // นับจำนวน categoryId ที่ไม่ซ้ำกัน
//       const uniqueCategoryCount = uniqueCategoryIds.size

//       categoriesStockUpdate.value = uniqueCategoryCount
//       listStockUpdate.value = data.length
//     })
//     .catch(error => {
//       // จัดการข้อผิดพลาด
//       console.error('Error:', error)
//     })
// }

// watchEffect(lengthStockUpdate)
</script>

<template>
  <VCard
    v-if="!logicLuxOn"
    :to="{ name: 'inventory-stockUpdate' }"
    color="primary"
  >
    <VCardText>
      <div class="d-flex align-center justify-center">
        <VIcon
          v-if="false"
          size="80"
          :color="getSwitchThemeColorText"
          icon="mdi-clipboard-text-search-outline"
        />
        <VIcon
          size="80"
          :color="getSwitchThemeColorText"
          icon="mdi-ballot"
        />
      </div>
    </VCardText>
    <VCardText class="clamp-text text-white mb-0">
      <div class="d-flex align-center justify-center ">
        <span>
          <span
            style="font-size: 16px;"
            class="clamp-text text-white"
            :class="`text-${getSwitchThemeColorText}`"
          >
            <strong>{{ $t('Stock Update') }}</strong>
          </span>
        </span>
      </div>
    </VCardText>

    <!--  -->
    <VCardText class="">
      <VRow no-gutters>
        <VCol cols="5">
          <div class="d-flex align-center justify-center mb-3">
            <span
              style="font-size: 16px; font-weight: bolder;"
              class="me-2 text-white"
              :class="`text-${getSwitchThemeColorText}`"
            >{{ $t('Categories') }}</span>
          </div>

          <div class="d-flex align-center justify-center">
            <span
              v-if="false"
              class="text-h5 text-disabled clamp-text text-white"
              :class="`text-${getSwitchThemeColorText}`"
            >{{ productDataSummaryCat }}</span>
            <span
              :class="`text-${getSwitchThemeColorText}`"
              class="text-h5 text-disabled clamp-text text-white"
            >{{ categoriesStockUpdate }}</span>
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
          cols="5"
          class="text-end"
        >
          <div class="d-flex align-center justify-center mb-3">
            <span
              style="font-size: 16px; font-weight: bolder;"
              class="me-2 text-white"
              :class="`text-${getSwitchThemeColorText}`"
            >{{ $t('List') }}</span>
          </div>
          <div class="d-flex align-center justify-center">
            <span
              v-if="false"
              :class="`text-${getSwitchThemeColorText}`"
              class="text-h5 text-disabled clamp-text text-white"
            >{{ productDataSummaryProduct }}</span>
            <span
              :class="`text-${getSwitchThemeColorText}`"
              class="text-h5 text-disabled clamp-text text-white"
            >{{ listStockUpdate }}</span>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>

  <VCard
    v-if="logicLuxOn"
    :to="{ name: 'inventory-stockUpdate' }"
    :color="getSwitchThemeColor"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <VCardText class="pa-2">
      <div class="d-flex align-center justify-start">
        <VIcon
          size="60"
          :color="getSwitchThemeColorText"
          icon="mdi-ballot"
        />
      </div>
    </VCardText>
    <VCardText class="clamp-text text-white mb-0 py-0">
      <div class="d-flex align-center justify-start ">
        <span>
          <span
            style="font-size: 16px;"
            class="clamp-text"
          >
            <span :class="`text-${getSwitchThemeColorText}`"><strong>{{ $t('Stock Update ') }}</strong></span>
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
              >{{ categoriesStockUpdate }}</span>
            </VCardTitle>
          </VCard>
        </VCol>

        <VCol
          cols="6"
          class="text-end px-3"
        >
          <VCard
            :color="getSwitchThemeColor"
            variant="text"
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
              >{{ listStockUpdate }}</span>
            </VCardTitle>
          </VCard>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<style scoped>
.page-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff0;
  min-block-size: 5vh;
}

.circle-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1px;
  block-size: 80px;
  inline-size: 80px;
}

.icon {
  position: relative;
  z-index: 1;
  color: #fff;
  font-size: 55px;
}

.circle {
  position: absolute;
  padding: 2.5px;
  border-radius: 50%;
  animation: spin 10s linear infinite;
  background-clip: content-box;
  block-size: 100%;
  inline-size: 100%;
}

.success {
  border: 4px dashed #4bb543;
}

.error {
  border: 2.5px dashed #ca0b00;
}

.warning {
  border: 2.5px dashed #f0d500;
}

@keyframes spin {
  100% {
    transform: rotateZ(360deg);
  }
}

.circle-wrapper:active .circle {
  animation: spin 2s linear infinite;
}
</style>
