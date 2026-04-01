<!--
  ============================================================
  InputOrText.vue
  Shows v-text-field in edit mode, plain text (or highlight chip) in readonly
  Used to easily toggle between edit/view modes across all tabs
  ============================================================ 
-->
<template>
  <div>
    <VTextField
      v-if="!readonly"
      :model-value="value"
      :type="type"
      variant="outlined"
      density="compact"
      hide-details
      @update:model-value="(v) => $emit('input', v)"
    />
    <template v-else>
      <VChip
        v-if="highlight && value"
        color="amber-lighten-4"
        variant="flat"
        size="small"
      >
        {{ value }}
      </VChip>
      <span v-else>{{ value || '—' }}</span>
    </template>
  </div>
</template>

<script setup>
defineProps({
  value: { type: [String, Number], default: '' },
  readonly: { type: Boolean, default: false },
  type: { type: String, default: 'text' },
  highlight: { type: Boolean, default: false },
})
defineEmits(['input'])
</script>
