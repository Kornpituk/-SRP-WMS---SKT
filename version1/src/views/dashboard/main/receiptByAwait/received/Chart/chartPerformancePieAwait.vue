<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import VueApexCharts from "vue3-apexcharts"
import { useTheme } from "vuetify"
import { getDonutChartConfigPOSuccessAwait } from "@/views/dashboard/main/receiptByAwait/received/Chart/apexCharConfig"

const props = defineProps({
  data: { type: Array, required: true },
  pureData: { type: Array, required: true },
  dataChartPO: { type: [String, Number], required: true },
  dataChartTransferIn: { type: [String, Number], required: true },
  typeData: {
    type: String,
    required: true,
  },
})

const series = ref([])
const vuetifyTheme = useTheme()
const chartConfig = ref({})

// ตรวจสอบ props และอัปเดต series
watch(() => ({
  po: props.dataChartPO,
  transferIn: props.dataChartTransferIn,
}), ({ po, transferIn }) => {
  series.value = [
    Number(po) || 0,
    Number(transferIn) || 0,
  ]
}, { immediate: true, deep: true })

// ตรวจสอบ theme และอัปเดตการตั้งค่าแผนภูมิ
watchEffect(() => {
  if (vuetifyTheme.current.value) {
    chartConfig.value = {
      ...getDonutChartConfigPOSuccessAwait(vuetifyTheme.current.value),
      
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
          <span v-if="props.typeData ==='Await'">{{ $t('Total Performance Await Receiving') }}</span>
          <span v-else>{{ $t('Total Performance Received') }}</span>
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
