/* stylelint-disable liberty/use-logical-spec */
/* stylelint-disable order/properties-order */
<!--
  MasterCreateDialog.vue
  ─────────────────────────────────────────────────────────────────
  Dialog สำหรับ Create record
  • width 500px
  • Form auto-generate จาก fields prop
  • รองรับ text / number / textarea / select
  • ปุ่ม SAVE ด้านล่างขวา
  • expose validate() ออกให้ parent เรียกได้
  ─────────────────────────────────────────────────────────────────
-->
<template>
  <VDialog
    :model-value="modelValue"
    width="500"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
  >
    <VCard class="dialog-card">
      <!-- ─── Header ──────────────────────────── -->
      <VCardTitle class="dialog-title">
        {{ title }}
        <VBtn
          icon
          variant="plain"
          size="small"
          class="dialog-close"
          @click="emit('close')"
          color="grey-"
        >
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </VCardTitle>

      <VDivider />

      <!-- ─── Dynamic Form ─────────────────────── -->
      <VCardText class="dialog-body">
        <VForm
          ref="formRef"
          @submit.prevent="emit('save')"
        >
          <div
            v-for="field in fields"
            :key="field.key"
            class="form-group"
          >
            <label class="form-label">
              {{ field.label }}
              <span
                v-if="field.required"
                class="required-star"
              >*</span>
            </label>

            <!-- Text / Number -->
            <VTextField
              v-if="field.type === 'text' || field.type === 'number'"
              :model-value="formData[field.key]"
              :type="field.type"
              :placeholder="`Enter ${field.label}`"
              variant="outlined"
              density="compact"
              :rules="field.required ? [requiredRule] : []"
              hide-details="auto"
              @update:model-value="onFieldUpdate(field.key, $event)"
            />

            <!-- Textarea -->
            <VTextarea
              v-else-if="field.type === 'textarea'"
              :model-value="formData[field.key]"
              :placeholder="`Enter ${field.label}`"
              variant="outlined"
              density="compact"
              rows="3"
              :rules="field.required ? [requiredRule] : []"
              hide-details="auto"
              @update:model-value="onFieldUpdate(field.key, $event)"
            />

            <!-- Select -->
            <VSelect
              v-else-if="field.type === 'select'"
              :model-value="formData[field.key]"
              :items="field.options ?? []"
              item-title="label"
              item-value="value"
              :placeholder="`Enter ${field.label}`"
              variant="outlined"
              density="compact"
              :rules="field.required ? [requiredRule] : []"
              hide-details="auto"
              @update:model-value="onFieldUpdate(field.key, $event)"
            />
          </div>
        </VForm>
      </VCardText>

      <!-- ─── Footer ──────────────────────────── -->
      <VCardActions class="dialog-footer">
        <VSpacer />
        <VBtn
          color="primary"
          class="save-btn"
          variant="flat"
          :loading="saving"
          @click="handleSave"
        >
          SAVE
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { ref } from 'vue'

// ─── Props ────────────────────────────────────
defineProps({
  /** v-model: เปิด/ปิด dialog */
  modelValue: {
    type: Boolean,
    required: true,
  },

  /** ชื่อ entity เช่น "Forwarder" */
  title: {
    type: String,
    required: true,
  },

  /** FieldConfig[] ทุก field (รวม hideInTable) */
  fields: {
    type: Array,
    required: true,
  },

  /**
   * Object ค่าใน form  { [fieldKey]: value }
   * ส่งมาจาก parent (reactive object จาก useMasterCrud)
   */
  formData: {
    type: Object,
    required: true,
  },
  saving: {
    type: Boolean,
    default: false,
  },
})

// ─── Emits ────────────────────────────────────
const emit = defineEmits([
  'update:modelValue',   // v-model open/close
  'close',               // กดปุ่ม ✕
  'save',                // กดปุ่ม SAVE (หลังผ่าน validate)
  'field-update',        // (key, value) อัปเดต formData ใน parent
])

// ─── Local refs ───────────────────────────────
const formRef = ref(null)

// ─── Rules ────────────────────────────────────
const requiredRule = v => !!v || 'This field is required'

// ─── Methods ──────────────────────────────────

/** อัปเดต field เดี่ยว */
function onFieldUpdate (key, val) {
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('field-update', key, val)
}

/** Validate แล้ว emit save */
async function handleSave () {
  const { valid } = await formRef.value?.validate() ?? { valid: true }
  if (valid) emit('save')
}

/**
 * expose validate ออกให้ parent เรียกได้โดยตรงถ้าต้องการ
 * เช่น  createDialogRef.value.validate()
 */
defineExpose({
  validate: () => formRef.value?.validate(),
  reset: () => formRef.value?.reset(),
})
</script>

<style scoped>
.dialog-card {
  border-radius: 12px !important;
}

.dialog-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px !important;
  font-weight: 600 !important;
  padding-block: 16px 12px !important;
  padding-inline: 20px !important;
}

.dialog-close {
  margin-inline-start: auto;
}

.dialog-body {
  max-block-size: 60vh;
  padding-block: 20px !important;
  padding-inline: 24px !important;
  /* stylelint-disable-next-line order/properties-order */
  overflow-y: auto;
}

.form-group {
  margin-block-end: 14px;
}

.form-label {
  display: block;
  font-size: 12.5px;
  font-weight: 500;
  /* stylelint-disable-next-line order/properties-order */
  color: #424242;
  margin-block-end: 4px;
}

.required-star {
  color: #e53935;
  margin-inline-start: 2px;
}

.dialog-footer {
  padding-block: 12px 16px !important;
  padding-inline: 20px !important;
  /* stylelint-disable-next-line order/properties-order */
  border-block-start: 1px solid #e0e0e0;
}

.save-btn {
  min-inline-size: 90px !important;
  /* stylelint-disable-next-line order/properties-order */
  block-size: 38px !important;
  font-weight: 700 !important;
  /* stylelint-disable-next-line order/properties-order */
  border-radius: 8px !important;
}
</style>
