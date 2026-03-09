<!-- ============================================================
  FieldRow.vue
  Renders: "LABEL :" followed by value (input or text)
  Matches the label-value pattern used throughout all tabs
============================================================ -->
<template>
  <div class="field-row">
    <div v-if="label" class="field-row__label text-caption font-weight-bold text-grey-darken-2">
      {{ label }}
    </div>
    <div class="field-row__value">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, default: '' },
})
</script>

<style scoped>
.field-row {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 36px;
}
.field-row__label {
  flex-shrink: 0;
  white-space: nowrap;
}
.field-row__value {
  flex: 1;
  min-width: 0;
}
</style>
