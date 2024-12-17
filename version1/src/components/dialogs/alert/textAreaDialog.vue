<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: String, // รับค่าจาก v-model
  sapInValue: { type: String, default: '' },
  lotValue: { type: Array, default: () => [] },
  textAreaValue: { type: String, default: '' },
  typeDialog: { type: String, default: '' },
  typeBtn: { type: String, default: '' },
  titleDialog: { type: String, default: 'Dialog Title' },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const localText = ref(props.modelValue || '')  // ใช้ค่าเริ่มต้นจาก modelValue
const localDialog = ref(false)
const sapInValueText = ref(props.sapInValue)
const typeDialogCom = ref(props.typeDialog)
const titleDialogCom = ref(props.titleDialog)

// Sync localText เมื่อ props.textAreaValue เปลี่ยน
watch(() => props.textAreaValue, newVal => {
  localText.value = newVal || '' // ซิงค์ค่า localText กับ props.textAreaValue (ค่าที่ส่งจาก Parent)
})

// Sync localDialog กับ modelValue
watch(() => props.modelValue, newVal => {
  localDialog.value = newVal ? true : false // ถ้า modelValue เป็นค่าที่ไม่ใช่ false จะเปิด Dialog
})

// ปิด Dialog
const closeDialog = () => {
  localDialog.value = false
  emit('update:modelValue', '')  // เมื่อปิด dialog ให้ส่งค่ากลับเป็นค่าว่าง
}

// ส่งข้อมูลกลับ Parent
const submitDialog = () => {
  emit('submit', localText.value) // ส่งค่าไปยัง Parent
  emit('update:modelValue', localText.value) // อัพเดต modelValue
  closeDialog()
}
</script>

<template>
  <VDialog
    v-model="localDialog"
    persistent
    max-width="600px"
  >
    <VCard class="d-flex justify-center">
      <VCardTitle class="text-center">
        {{ titleDialog }}
      </VCardTitle>
      <DialogCloseBtn
        v-if="false"
        variant="text"
        size="default"
        @click="closeDialog"
      />
      <VCardText v-if="props.typeDialog !== 'Lot'">
        <div v-if="props.typeDialog === 'ShipMark'">
          SAP Invoice No.: {{ props.sapInValue }}
        </div>
        <VTextarea
          v-model="localText"
          counter
          :readonly="props.typeBtn === 'print'"
          class="text-center"
          rows="4"
          outlined
        />
      </VCardText>
      <VCardText v-else>
        <VCard>
          <VCardText>
            <VTable>
              <thead class="bg-grey-lighten-3">
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in localText"
                  :key="index"
                >
                  <td>{{ index+1 }}</td>
                  <td>{{ item.lotNUmber }}</td>
                </tr>
              </tbody>
            </VTable>
          </VCardText>
        </VCard>
      </VCardText>
      <VCardActions class="d-flex justify-center">
        <VBtn
          v-if="props.typeBtn === 'print'"
          variant="flat"
          color="warning"
          @click="submitDialog"
        >
          <VIcon icon="ri-printer-fill" />Print
        </VBtn>
        <VBtn
          v-else
          variant="flat"
          color="warning"
          @click="submitDialog"
        >
          OK
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
