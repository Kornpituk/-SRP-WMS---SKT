<template>
  <VDialog
    :model-value="modelValue"
    width="500"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
  >
    <VCard class="dialog-card">
      <VCardTitle class="dialog-title">
        {{ title }}
        <VBtn
          icon
          variant="plain"
          size="small"
          class="dialog-close"
          @click="emit('close')"
        >
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </VCardTitle>

      <VDivider />

      <VCardText class="dialog-body">
        <VForm
          ref="formRef"
          @submit.prevent="emit('save')"
        >
          <div
            v-for="field in visibleFields"
            :key="field.key"
            class="form-group"
          >
            <label class="form-label">
              {{ field.label }}
              <span
                v-if="field.required"
                class="required-star"
              >
                *
              </span>
            </label>

            <VTextField
              v-if="field.type === 'text' || field.type === 'number'"
              :model-value="formData[field.key]"
              :type="field.type"
              :placeholder="`Enter ${field.label}`"
              variant="outlined"
              density="compact"
              :maxlength="getMaxLength(field)"
              :counter="getCounter(field)"
              :rules="getRules(field)"
              hide-details="auto"
              @update:model-value="onFieldUpdate(field, $event)"
            />

            <VTextarea
              v-else-if="field.type === 'textarea'"
              :model-value="formData[field.key]"
              :placeholder="`Enter ${field.label}`"
              variant="outlined"
              density="compact"
              rows="3"
              :maxlength="getMaxLength(field)"
              :counter="getCounter(field)"
              :rules="getRules(field)"
              hide-details="auto"
              @update:model-value="onFieldUpdate(field, $event)"
            />

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
              @update:model-value="onFieldUpdate(field, $event)"
            />
          </div>
        </VForm>
      </VCardText>

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
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  fields: {
    type: Array,
    required: true,
  },
  formData: {
    type: Object,
    required: true,
  },
  saving: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'update:modelValue',
  'close',
  'save',
  'field-update',
])

const formRef = ref(null)
const visibleFields = computed(() => props.fields.filter(field => !field.hideInForm))
const requiredRule = v => !!v || 'This field is required'

function getMaxLength(field) {
  return Number.isFinite(Number(field.maxLength)) ? Number(field.maxLength) : undefined
}

function getCounter(field) {
  return getMaxLength(field) ?? false
}

function limitValue(field, val) {
  const maxLength = getMaxLength(field)
  if (!maxLength || val === null || val === undefined) return val

  return String(val).slice(0, maxLength)
}

function getRules(field) {
  const rules = []
  const maxLength = getMaxLength(field)

  if (field.required) rules.push(requiredRule)
  if (maxLength) {
    rules.push(value => (
      value === null ||
      value === undefined ||
      String(value).length <= maxLength ||
      `Maximum ${maxLength} characters`
    ))
  }

  return rules
}

function onFieldUpdate(field, val) {
  emit('field-update', field.key, limitValue(field, val))
}

async function handleSave() {
  const { valid } = await formRef.value?.validate() ?? { valid: true }
  if (valid) emit('save')
}

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
  overflow-y: auto;
}

.form-group {
  margin-block-end: 14px;
}

.form-label {
  display: block;
  font-size: 12.5px;
  font-weight: 500;
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
  border-block-start: 1px solid #e0e0e0;
}

.save-btn {
  min-inline-size: 90px !important;
  block-size: 38px !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
}
</style>
