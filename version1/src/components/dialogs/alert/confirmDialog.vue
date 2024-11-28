<script setup>
import { trueAndFalseValue } from '@/views/demos/forms/form-elements/switch/demoCodeSwitch'
import pixinventQr from '@images/pages/pixinvent-qr.png'

const props = defineProps({
  authCode: {
    type: String,
    required: false,
  },
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  confirm: {
    type: Boolean,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
  },
  word: {
    type: String,
    default: 'Operation',
  },
})

const emit = defineEmits(['update:isDialogVisible', 'update:confirm'])

// ใช้ ref แทน props
const localDialogVisible = ref(props.isDialogVisible)
const localConfirm = ref(props.confirm)

const wordAlert = ref(null)

// ใช้ watch เพื่อตรวจจับการเปลี่ยนแปลงของ props
watch([() => props.isDialogVisible, () => props.confirm, () => props.word], ([newVisible, newConfirm, newWord]) => {
  localDialogVisible.value = newVisible
  localConfirm.value = newConfirm
  wordAlert.value = newWord === 'REJECT' ? 'REJECTION' : newWord
})

// ฟังก์ชันปิด Dialog
const closeDialog = () => {
  localConfirm.value = true
  emit('update:confirm', false)
  localDialogVisible.value = false
  emit('update:isDialogVisible', false)
}

const confirmDialog = () => {
  localConfirm.value = true
  emit('update:confirm', true)
  console.log("Confirm dialog", localConfirm.value)
  localDialogVisible.value = false
  emit('update:isDialogVisible', false)
}
</script>

<template>
  <VDialog
    v-model="localDialogVisible"
    width="500"
  >
    <!-- Dialog Content -->
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
          <span style="font-size: 22px; font-weight: bolder;">Would you like to {{ wordAlert }}
            Transaction?</span>
        </div>
      </VCardText>

      <VCardAction class="d-flex justify-space-between pa-4">
        <VBtn
          color="error"
          @click="closeDialog"
        >
          Cancel
        </VBtn>
        <VBtn
          v-if="wordAlert === 'SUBMIT' || wordAlert === 'ACCEPT' || wordAlert === 'APPROVE' "
          color="green"
          @click="confirmDialog"
        >
          {{ wordAlert }}
        </VBtn>
        <VBtn
          v-else
          color="green"
          @click="confirmDialog"
        >
          Select
        </VBtn>
      </VCardAction>
    </VCard>
  </VDialog>
</template>
