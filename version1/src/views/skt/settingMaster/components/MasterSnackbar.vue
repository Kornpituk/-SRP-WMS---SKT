<!--
  MasterSnackbar.vue
  ─────────────────────────────────────────────────────────────────
  Snackbar แจ้งผลลัพธ์ success / error
  • ตำแหน่ง bottom-right
  • timeout 3 วินาที
  ─────────────────────────────────────────────────────────────────
-->
<template>
  <VSnackbar
    :model-value="modelValue"
    :color="color"
    location="bottom right"
    :timeout="timeout"
    rounded="lg"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="snack-content">
      <VIcon
        size="18"
        class="me-2"
      >
        {{ color === 'success' ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline' }}
      </VIcon>
      {{ message }}
    </div>
  </VSnackbar>
</template>

<script setup>
defineProps({
  /** v-model: แสดง/ซ่อน snackbar */
  modelValue: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'success',  // 'success' | 'error' | 'warning' | 'info'
  },
  timeout: {
    type: Number,
    default: 3000,
  },
})

// ─── Emits ────────────────────────────────────
const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>
.snack-content {
  display: flex;
  align-items: center;
  font-weight: 500;
  /* stylelint-disable-next-line order/properties-order */
  font-size: 13px;
}
</style>
