<template>
  <td
    class="text-start px-1 cursor-pointer"
    :style="cellStyle"
    style="min-width: 150px; font-size: 12px;"
    @dblclick="$emit('highlight')"
  >
    {{ product.salesOrderNo }}
  </td>
</template>

<script setup>
import { defineProps, computed, defineEmits } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  canEdit: {
    type: Boolean,
    default: false,
  },

  // เพิ่ม props สำหรับสไตล์
  cellStyle: {
    type: Object,
    default: () => ({}),
  },
})

defineEmits(['highlight'])
</script>
