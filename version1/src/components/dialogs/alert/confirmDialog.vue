<script setup>
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
  success: {
    type: Boolean,
    required: true,
  },
  word: {
    type: String,
    default: 'Operation',
  },
})

const emit = defineEmits(['update:isDialogVisible'])

// ใช้ ref แทน props
const localDialogVisible = ref(props.isDialogVisible)

// ใช้ watch เพื่อตรวจจับการเปลี่ยนแปลงของ props
watch(() => props.isDialogVisible, newValue => {
  localDialogVisible.value = newValue
})

const wordAlert = ref('')

watch(() => {
  if(props.word === 'REJECT'){
    wordAlert.value = 'REJECTION'
  }else{
    wordAlert.value = props.word
  }
})

// ฟังก์ชันปิด Dialog
const closeDialog = () => {
  localDialogVisible.value = false
  emit('update:isDialogVisible', false)
}
</script>

<template>
  <VDialog
    v-model="isDialogConfirmVisible"
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
          <span style="font-size: 22px; font-weight: bolder;">Would you like to {{ wordForSubmit }}
            Transaction?</span>
        </div>
      </VCardText>

      <VCardAction class="d-flex justify-space-between pa-4">
        <VBtn
          color="error"
          @click="isDialogConfirmVisible = false"
        >
          Cancel
        </VBtn>
        <VBtn
          v-if="wordForSubmit === 'ACCEPT'"
          color="green"
          @click="btnAccept"
        >
          {{ wordForSubmit }}
        </VBtn>
      </VCardAction>
    </VCard>
  </VDialog>
</template>
