<script setup>
import { computed } from 'vue'

const props = defineProps({
  // สำหรับเปิด-ปิด Dialog
  isVisble: {
    type: Boolean,
    default: false,
  },

  // ข้อมูล Sale Order
  saleOrderNo: {
    type: String,
    default: '',
  },

  // ข้อความ Shipping Mark
  shippingMark: {
    type: String,
    default: '',
  },

  // จำนวน Copy ที่ต้องการพิมพ์
  printCopy: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits([
  'update:isVisble',
  'update:printCopy',
  'confirmPrint',
])

// ใช้ Computed เพื่อทำ Two-way binding กับ v-model ของ Dialog
const showDialog = computed({
  get: () => props.isVisble,
  set: val => emit('update:isVisble', val),
})

// สำหรับ v-model ของจำนวน Copy
const localPrintCopy = computed({
  get: () => props.printCopy,
  set: val => emit('update:printCopy', Number(val)),
})

const onPrint = () => {
  emit('confirmPrint')
}
</script>

<template>
  <VDialog
    v-model="showDialog"
    width="50%"
  >
    <VCard>
      <DialogCloseBtn
        variant="text"
        size="default"
        @click="showDialog = false"
      />

      <VCardTitle>
        <div class="text-center">
          <span>Print Shipping Mark</span>
        </div>
      </VCardTitle>

      <VCardText>
        <div class="d-flex justify-space-between align-center">
          <VRow>
            <VCol cols="12">
              <span class="my-4">Sale Order No. : {{ props.saleOrderNo }}</span>
            </VCol>
            <VCol cols="12">
              <VTextarea
                :model-value="props.shippingMark"
                readonly
                label="Shipping Mark"
                style="min-width: 220px;"
                rows="2"
                clearable
                placeholder="Shipping Mark"
              />
            </VCol>
          </VRow>
        </div>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-4">
        <VRow>
          <VCol
            cols="6"
            class="d-flex justify-end align-center"
          >
            <span>Print Copy:</span>
          </VCol>
          <VCol
            cols="6"
            class="d-flex justify-start"
          >
            <VTextField
              v-model="localPrintCopy"
              density="compact"
              type="number"
              min="0"
            >
              <template #append-inner>
                <span>Copy</span>
              </template>
            </VTextField>
          </VCol>
        </VRow>
        <VBtn
          color="warning"
          @click="onPrint"
        >
          <VIcon
            size="30"
            icon="ri-printer-fill"
          />
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
