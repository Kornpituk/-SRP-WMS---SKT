<script setup>
import { computed, defineProps, defineEmits } from 'vue'

// รับ props และ event
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  word: {
    type: String,
    default: '',
  },
  subword: {
    type: String,
    default: '',
  },
  success: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

// สร้าง computed เพื่อจัดการ modelValue
const dialogVisible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

// ฟังก์ชันปิด Dialog
const closeDialog = () => {
  dialogVisible.value = false
}
</script>

<template>
  <VDialog
    v-model="dialogVisible"
    class="v-dialog-sm"
  >
    <DialogCloseBtn
      variant="text"
      size="default"
      @click="closeDialog"
    />
    <!-- Dialog Content -->
    <VCard>
      <VCardText
        v-if="props.success"
        class="d-flex justify-center"
      >
        <VIcon
          v-if="props.word === 'SAVE DRAFT'"
          size="150"
          color="success"
          icon="ri-checkbox-circle-fill"
        />
        <VIcon
          v-else-if="props.word === 'REJECT'"
          size="150"
          color="error"
          icon="ri-checkbox-circle-fill"
        />
        <VIcon
          v-else
          size="150"
          color="success"
          icon="ri-checkbox-circle-fill"
        />
      </VCardText>
      <VCardText
        v-if="!props.success"
        class="d-flex justify-center"
      >
        <VIcon
          size="150"
          color="error"
          icon="ri-close-circle-fill"
        />
      </VCardText>

      <VCardText class="d-flex justify-center text-center pb-1">
        <div>
          <span
            class="text-center"
            v-if="props.success"
            style="font-size: 22px; font-weight: bolder;"
          >{{ word }} Completed.</span>
          <span
            v-if="!props.success"
            style="font-size: 22px; font-weight: bolder;"
          >{{ word }} Failed.</span>
        </div>
      </VCardText>
      <VCardText class="d-flex justify-center">
        <div>
          <span style="font-size: 16px; font-weight: bolder;">{{ subword }}</span>
        </div>
      </VCardText>

      <VCardText
        v-if="false"
        class="d-flex justify-center flex-wrap gap-4"
      >
        <VBtn
          color="warning"
          @click="closeDialog"
        >
          Close
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
