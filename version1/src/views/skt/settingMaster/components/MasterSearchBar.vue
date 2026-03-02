<!--
  MasterSearchBar.vue
  ─────────────────────────────────────────────────────────────────
  Search bar ที่ collapse/expand ได้
  • render inputs จาก searchFields prop (max 3)
  • ปุ่ม SEARCH (เขียว) + CLEAR (แดง)
  ─────────────────────────────────────────────────────────────────
-->
<template>
  <VExpandTransition>
    <div
      v-if="visible"
      class="search-bar"
    >
      <!-- ── Dynamic search inputs ──────────── -->
      <div class="search-fields">
        <template
          v-for="field in searchFields"
          :key="field.key"
        >
          <!-- Text / Number -->
          <VTextField
            v-if="field.type !== 'select'"
            :model-value="modelValue[field.key]"
            :label="field.label"
            variant="outlined"
            density="compact"
            hide-details
            class="search-input"
            bg-color="white"
            @update:model-value="onUpdate(field.key, $event)"
          />

          <!-- Select -->
          <VSelect
            v-else
            :model-value="modelValue[field.key]"
            :label="field.label"
            :items="field.options ?? []"
            item-title="label"
            item-value="value"
            variant="outlined"
            density="compact"
            hide-details
            class="search-input"
            bg-color="white"
            @update:model-value="onUpdate(field.key, $event)"
          />
        </template>
      </div>

      <!-- ── Buttons ─────────────────────────── -->
      <div class="search-actions">
        <VBtn
          color="primary"
          class="action-btn"
          :loading="loading"
          @click="emit('search')"
        >
          SEARCH
        </VBtn>
        <VBtn
          color="error"
          class="action-btn"
          @click="emit('clear')"
        >
          CLEAR
        </VBtn>
      </div>
    </div>
  </VExpandTransition>
</template>

<script setup>
defineProps({
  /** ควบคุมการแสดง / ซ่อน */
  visible: {
    type: Boolean,
    default: false,
  },

  /**
   * Field config ที่ filterable (max 3)
   * FieldConfig[]  { key, label, type, options? }
   */
  searchFields: {
    type: Array,
    required: true,
  },

  /**
   * Object ของค่า search — reactive object จาก parent
   * { [fieldKey]: value }
   */
  modelValue: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

// ─── Emits ────────────────────────────────────
const emit = defineEmits([
  'update:modelValue', // two-way binding
  'search',
  'clear',
])

// ─── Helpers ──────────────────────────────────
function onUpdate (key, val) {
  emit('update:modelValue', { ...this?.modelValue, [key]: val })
}
</script>

<style scoped src="./css/MasterSearchBar.css"></style>
