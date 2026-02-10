<template>
  <span style="font-size: 12px;">
    <VChip
      :color="statusColor"
      :style="{ color: statusColor }"
      style="font-size: 12px;"
    >
      {{ product.statusText }}
      <VTooltip
        activator="parent"
        location="right"
        open-on-click
      >
        <p>{{ product.csLfStatusText }}</p>
        <p v-if="false">{{ product.inspStatusText }}</p>
        <p>{{ product.salStatusText }}</p>
        <p>{{ product.logStatusText }}</p>
        <p class="mb-0">{{ product.whStatusText }}</p>
      </VTooltip>
    </VChip>
    <span v-if="false">{{ product.checkSheetTypeName }}</span>
  </span>
</template>

<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

// ฟังก์ชันสำหรับหาสีตามสถานะ (ต้องนำเข้า/กำหนดจาก parent)
// ตัวอย่างฟังก์ชันพื้นฐาน ถ้าไม่มีฟังก์ชันจาก parent
const statusColor = computed(() => {
  const statusId = props.product.statusId
  
  // กำหนดสีตาม statusId
  if (statusId === 200) return 'success'  // ตัวอย่าง
  if (statusId === 201) return 'warning'  // ตัวอย่าง
  if (statusId === 202) return 'error'    // ตัวอย่าง
  
  return 'default'
})
</script>
