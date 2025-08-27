<script setup>
import { ref } from 'vue'

const props = defineProps({
  message: {
    type: String,
    default: 'Are you sure you want to proceed?',
  },
})

const emit = defineEmits(['confirm', 'cancel'])

const prefix = "LORRY LOADING"

// แยก LORRY LOADING ออกมา และส่วนที่เหลือ
const firstPart = computed(() => {
  if (props.message.startsWith(prefix)) {
    return prefix
  }
  
  return ''
})

const remainingPart = computed(() => {
  if (props.message.startsWith(prefix)) {
    return props.message.slice(prefix.length).trim()
  }
  
  return props.message
})

const dialog = ref(false)

function openDialog() {
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
}

function confirm() {
  emit('confirm')
  dialog.value = false
}

function cancel() {
  emit('cancel')
  dialog.value = false
}

defineExpose({
  openDialog,
  closeDialog,
})
</script>

<template>
  <VDialog
    v-model="dialog"
    max-width="500"
  >
    <VCard>
      <VCardText>
        <div class="d-flex justify-center">
          <VIcon
            size="100"
            color="warning"
            icon="ri-question-line"
          />
        </div>
        <div class="text-center">
          <span style="font-size: 22px; font-weight: bolder;">Would you like to {{ firstPart }}</span>
        </div>
        <div class="text-center">
          <span style="font-size: 22px; font-weight: bolder;">{{ remainingPart }}
            Transaction?</span>
        </div>
      </VCardText>
      <VCardActions class="d-flex justify-space-between">
        <VBtn
          color="red"
          variant="flat"
          @click="cancel"
        >
          Cancel
        </VBtn>
        <VBtn
          color="green"
          variant="flat"
          @click="confirm"
        >
          {{ props.message }}
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
