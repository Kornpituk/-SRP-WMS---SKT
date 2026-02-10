<template>
  <td
    class="sticky-columnBody cursor-pointer"
    :style="cellStyle"
    @dblclick="$emit('highlight')"
  >
    <span>{{ rowNumber }}</span>
  </td>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  rowNumber: {
    type: Number,
    required: true,
  },
  cellStyle: {
    type: Object,
    default: () => ({}),
  },
})

defineEmits(['highlight'])
</script>
