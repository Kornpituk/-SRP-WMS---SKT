<template>
  <VIcon
    :icon="icon"
    class="clickable-icon mx-1"
    size="18"
    @click="$emit('click')"
  />
</template>

<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  column: {
    type: String,
    required: true,
  },
  currentColumn: {
    type: String,
    default: '',
  },
  direction: {
    type: String,
    default: 'desc',
  },
})

defineEmits(['click'])

const icon = computed(() => {
  if (props.currentColumn !== props.column) {
    return 'ri-arrow-down-line'
  }
  
  return props.direction === 'desc' ? 'ri-arrow-down-line' : 'ri-arrow-up-line'
})
</script>

<style scoped>
.clickable-icon {
  cursor: pointer;
  opacity: 0.7;
}

.clickable-icon:hover {
  opacity: 1;
}
</style>
