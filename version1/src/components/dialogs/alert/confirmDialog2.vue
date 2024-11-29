<script setup>
import { ref } from 'vue'

const props = defineProps({
  message: {
    type: String,
    default: 'Are you sure you want to proceed?',
  },
})

const emit = defineEmits(['confirm', 'cancel'])
const dialog = ref(false)

function openDialog() {
  dialog.value = true
}

function confirm() {
  emit('confirm')
  dialog.value = false
}

function cancel() {
  emit('cancel')
  dialog.value = false
}

// ใช้ defineExpose เพื่อเปิดเผยฟังก์ชัน openDialog
defineExpose({
  openDialog,
})
</script>

<template>
  <VDialog
    v-model="dialog"
    max-width="400"
  >
    <VCard>
      <VCardTitle class="text-h6">
        Confirmation
      </VCardTitle>
      <VCardText>{{ message }}</VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn
          text
          color="red"
          @click="cancel"
        >
          Cancel
        </VBtn>
        <VBtn
          text
          color="green"
          @click="confirm"
        >
          Confirm
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped>
.v-card-actions {
  justify-content: flex-end;
}
</style>
