<script setup>
import VueApexCharts from "vue3-apexcharts"
import { useTheme } from "vuetify"
import { getDonutChartConfigPOSuccess } from "@/views/dashboard/main/receiptBy/picking/Chart/apexCharConfig"

import { defineProps, watch, watchEffect } from 'vue'

//------------------------------------- Define Props -------------------------------
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  pureData: {
    type: Array,
    required: true,
  },
  dataChartWhite: {
    type: String,
    required: true,
  },
  dataChartTransferOut: {
    type: String,
    required: true,
  },
  dataChartDelivery: {
    type: String,
    required: true,
  },
  typeData: {
    type: String,
    required: true,
  },
})

const vuetifyTheme = useTheme()
const series = ref([])
const chartConfig = ref({})

// ตรวจสอบ props และอัปเดต series
watch(() => ({
  tranferOut: props.dataChartTransferOut,
  pickingDelivery: props.dataChartDelivery,
  pickingWriteOff: props.dataChartWhite,
}), ({ tranferOut, pickingDelivery, pickingWriteOff }) => {
  series.value = [
    Number(tranferOut) || 0,
    Number(pickingDelivery) || 0,
    Number(pickingWriteOff) || 0,
  ]
}, { immediate: true, deep: true })

// ตรวจสอบ theme และอัปเดตการตั้งค่าแผนภูมิ
watchEffect(() => {
  if (vuetifyTheme.current.value) {
    chartConfig.value = {
      ...getDonutChartConfigPOSuccess(vuetifyTheme.current.value),
      
      chart: { animations: { enabled: true } },
    }
  }
})

// Debug
onMounted(() => {
  console.log('Component mounted with series:', series.value)
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardTitle class="py-5">
          <span v-if="props.typeData ==='Await'">{{ $t('Total Performance Await Picking') }}</span>
          <span v-else>{{ $t('Total Performance Picked') }}</span>
        </VCardTitle>
        <VDivider />
        <VCardText>
          <div style="width: 100%; height: 400px;">
            <template v-if="series.length > 0">
              <VueApexCharts
                type="pie"
                height="450"
                :options="chartConfig"
                :series="series"
              />
            </template>
            <template v-else>
              <div class="text-center py-4">
                <VProgressCircular indeterminate />
              </div>
            </template>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
