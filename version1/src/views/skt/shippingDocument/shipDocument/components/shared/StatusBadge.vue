<template>
  <VChip
    :color="config.color"
    :text="status"
    size="small"
    label
    variant="tonal"
    class="font-weight-bold"
  />
</template>

<script setup>
import { computed } from 'vue'
import { STATUS_CONFIG } from '../../constants/shippingDocument.constants'

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
})

const config = computed(
  () => STATUS_CONFIG[props.status] ?? { color: 'default' },
)
</script>
