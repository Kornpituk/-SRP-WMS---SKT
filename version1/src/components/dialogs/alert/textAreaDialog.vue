<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: String, // รับค่าจาก v-model
  modelValueText: { type: String, default: '' }, // ค่าแรก
  modelValueText2: { type: String, default: '' }, // ค่าที่สอง
  sapInValue: { type: String, default: '' },
  lotValue: { type: Array, default: () => [] },
  textAreaValue: { type: String, default: '' },
  textArea2Value: { type: String, default: '' },
  typeDialog: { type: String, default: '' },
  typeBtn: { type: String, default: '' },
  titleDialog: { type: String, default: 'Dialog Title' },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const isShipMC = computed(() => props.typeDialog === 'ShipMC')
const isShipMark = computed(() => props.typeDialog === 'ShipMark')
const isLotType = computed(() => props.typeDialog === 'Lot')

const localText = ref(props.modelValueText)  // ใช้ค่าเริ่มต้นจาก modelValue
const localText2 = ref(props.modelValueText2)  // ใช้ค่าเริ่มต้นจาก modelValue
const localDialog = ref(false)
const sapInValueText = ref(props.sapInValue)
const typeDialogCom = ref(props.typeDialog)
const titleDialogCom = ref(props.titleDialog)

// Sync localText เมื่อ props.textAreaValue เปลี่ยน
watch(
  () => props.modelValue,
  newVal => {
    localDialog.value = newVal
  },
)

watch(
  () => props.modelValueText,
  newVal => {
    localText.value = newVal
  },
)

watch(
  () => props.modelValueText2,
  newVal => {
    localText2.value = newVal
  },
)

// ปิด Dialog
const closeDialog = () => {
  emit('update:modelValue', false) // ส่งค่า false กลับไปยัง parent ก่อน
  localDialog.value = false // ปิด dialog ที่ local
}

// ส่งข้อมูลกลับ Parent
const submitDialog = () => {
  emit('update:modelValue', { text1: localText.value, text2: localText2.value }) // ส่งค่าข้อมูลกลับไป
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
        v-if="true"
        variant="text"
        size="default"
        @click="submitDialog"
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
              v-model="localText2"
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
