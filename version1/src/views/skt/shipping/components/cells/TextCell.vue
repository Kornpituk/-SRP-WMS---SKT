// =====================================================
// 📄 components/cells/TextCell.vue (Example Cell)
// =====================================================
<template>
  <div v-if="!editable">
    {{ displayValue }}
  </div>
  
  <VTextField
    v-else
    :model-value="value"
    density="compact"
    @update:model-value="$emit('update', $event)"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: [String, Number],
  editable: Boolean,
  format: Function,
})

const emit = defineEmits(['update'])

const displayValue = computed(() =>
  props.format ? props.format(props.value) : props.value,
)
</script>
