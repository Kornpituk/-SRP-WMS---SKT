<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: String, // รับค่าจาก v-model
  sapInValue: { type: String, default: '' },
  lotValue: { type: Array, default: () => [] },
  textAreaValue: { type: String, default: '' },
  textArea2Value: { type: String, default: '' },
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
    max-width="900px"
  >
    <VCard class="d-flex justify-center">
      <VRow
        v-if="props.typeDialog === 'ShipMC'"
        class="mt-5"
      >
        <VCol cols="6">
          <VCardTitle class="text-center">
            Shipping Mark
          </VCardTitle>
        </VCol>
        <VCol cols="6">
          <VCardTitle class="text-center">
            Shipping Condition
          </VCardTitle>
        </VCol>
      </VRow>
      <VCardTitle
        v-else
        class="text-center"
      >
        {{ titleDialog }}
      </VCardTitle>

      <DialogCloseBtn
        v-if="false"
        variant="text"
        size="default"
        @click="closeDialog"
      />
      <VCardText v-if="props.typeDialog !== 'Lot' && props.typeDialog !== 'ShipMC'">
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
      <VCardText v-else-if="props.typeDialog === 'ShipMC'">
        <div v-if="props.typeDialog === 'ShipMark'">
          SAP Invoice No.: {{ props.sapInValue }}
        </div>
        <VRow>
          <VCol cols="6">
            <div v-if="props.typeDialog === 'ShipMark'">
              SAP Invoice No.: {{ props.sapInValue }}
            </div>
            <VTextarea
              v-model="localText"
              auto-grow
              rows="7"
              counter
              :readonly="props.typeBtn === 'print'"
              class="text-center"
              outlined
            />
          </VCol>
          <VCol cols="6">
            <div v-if="props.typeDialog === 'ShipMark'">
              SAP Invoice No.: {{ props.sapInValue }}
            </div>
            <VTextarea
              v-model="localText"
              counter
              :readonly="props.typeBtn === 'print'"
              class="text-center"
              rows="15"
              outlined
            />
          </VCol>
        </VRow>
      </VCardText>
      <VCardText v-else>
        <VCard class="d-flex justify-center text-center">
          <VCardText>
            <VTable>
              <thead class="bg-grey-lighten-3 ">
                <tr>
                  <th class="text-center">
                    No.
                  </th>
                  <th class="text-center">
                    Name
                  </th>
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
        <VRow v-if="props.typeBtn === 'twinPrint'">
          <VCol
            cols="6"
            class="d-flex justify-center"
          >
            <VBtn
              variant="flat"
              color="warning"
              @click="submitDialog"
            >
              <VIcon icon="ri-printer-fill" />Print
            </VBtn>
          </VCol>
          <VCol
            cols="6"
            class="d-flex justify-center"
          >
            <VBtn
              
              variant="flat"
              color="warning"
              @click="submitDialog"
            >
              <VIcon icon="ri-printer-fill" />Print
            </VBtn>
          </VCol>
        </VRow>
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
