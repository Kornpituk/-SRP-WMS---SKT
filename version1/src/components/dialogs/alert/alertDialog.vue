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
  subword: {
    type: String,
    default: '',
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
const subWordAlert = ref('')

watch(() => {
  if(props.word === 'REJECT'){
    wordAlert.value = 'REJECTION'
  }else{
    wordAlert.value = props.word
    subWordAlert.value = props.subword

    console.log("invalid word in component", props.word, props.subword)
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
    v-model="localDialogVisible"
    class="v-dialog-sm"
    @update:model-value="val => emit('update:isDialogVisible', val)"
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
          v-else-if="props.word === 'ACCEPT'"
          size="150"
          color="success"
          icon="ri-checkbox-circle-fill"
        />
        <VIcon
          v-else-if="props.word === 'APPROVE'"
          size="150"
          color="success"
          icon="ri-checkbox-circle-fill"
        />
        <VIcon
          v-else-if="props.word === 'CENCEL'"
          size="150"
          color="success"
          icon="ri-checkbox-circle-fill"
        />
        <VIcon
          v-else-if="props.word === 'SUBMIT'"
          size="150"
          color="success"
          icon="ri-checkbox-circle-fill"
        />
        <VIcon
          v-else-if="props.word === 'NEWPLAN'"
          size="150"
          color="success"
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

      <VCardText class="d-flex justify-center pb-1">
        <div>
          <span
            v-if="props.success"
            style="font-size: 22px; font-weight: bolder;"
          >{{ wordAlert }} Completed.</span>
          <span
            v-if="!props.success"
            style="font-size: 22px; font-weight: bolder;"
          >{{ wordAlert }} Failed.</span>
        </div>
      </VCardText>
      <VCardText class="d-flex justify-center">
        <div>
          <span style="font-size: 16px; font-weight: bolder;">{{ subWordAlert }}</span>
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
