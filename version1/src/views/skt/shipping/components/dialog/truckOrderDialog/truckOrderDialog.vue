<template>
  <VDialog
    v-model="dialogVisible"
    width="100%"
    persistent
  >
    <VCard>
      <DialogCloseBtn
        variant="text"
        size="default"
        @click="handleClose"
      />

      <VCardTitle class="text-center">
        Truck Order
      </VCardTitle>

      <VCardText style="overflow-x: auto;">
        <table class="custom-table">
          <thead>
            <tr>
              <th
                colspan="12"
                class="text-center"
              >
                SANYO KASEI (THAILAND) LTD.
              </th>
            </tr>
            <tr>
              <th
                colspan="12"
                class="text-center"
              >
                Rojana Industrial Park-Rayong, 5/5 Moo 11 T. Nongbua, A.Bankhai, Rayong 21120
              </th>
            </tr>
            <tr>
              <th
                colspan="12"
                class="text-center"
              >
                Tel. (038) 627-050 Fax. (038) 946-07
              </th>
            </tr>
            <tr>
              <th
                colspan="12"
                class="text-center"
              >
                ใบสั่งรถขนส่ง / Truck Order
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th colspan="4">
                วันที่ส่งสินค้า
              </th>
              <td
                colspan="8"
                class="text-start"
              >
                {{ dataRow?.logUpdatedDate }}
              </td>
            </tr>
            <tr>
              <th colspan="4">
                เลขที่ใบสั่งงานรถขนส่ง (Truck Order No)
              </th>
              <td colspan="8">
                {{ dataRow?.truckReservingNumber }}
              </td>
            </tr>
            <tr>
              <th colspan="4">
                เลขที่อ้างอิง (Ref SO No.)
              </th>
              <td
                colspan="8"
                class="text-start"
              >
                {{ saleOrderNumber }}
              </td>
            </tr>
            <tr>
              <th colspan="4">
                ชื่อลูกค้า
              </th>
              <th colspan="8">
                <VAutocomplete
                  v-model="formData.company"
                  class="text-start"
                  density="compact"
                  label="Company"
                  :items="companyList"
                  item-title="company"
                  item-value="company"
                />
              </th>
            </tr>
            <tr>
              <th colspan="4">
                สถานที่จัดส่ง
              </th>
              <td
                colspan="8"
                class="text-start"
                style="min-width: 500px; max-width: 500px;"
              >
                <VAutocomplete
                  v-model="formData.address"
                  class="text-start"
                  density="compact"
                  label="Address"
                  :items="addressList"
                  item-title="shipperLocation"
                  item-value="shipperLocation"
                />
              </td>
            </tr>
            <tr>
              <th colspan="4">
                บริษัทขนส่ง (Transportation Company Name)
              </th>
              <th
                colspan="8"
                class="text-center"
              >
                <VAutocomplete
                  v-model="formData.truckCompany"
                  class="text-center"
                  density="compact"
                  label="Transportation Company Name"
                  :items="truckList"
                  item-title="truck"
                  item-value="truck"
                />
              </th>
            </tr>
            <tr>
              <th colspan="4">
                ประเภทรถ (Truck Type)
              </th>
              <th
                colspan="8"
                class="text-center"
              >
                <VAutocomplete
                  v-model="formData.truckType"
                  class="text-center"
                  density="compact"
                  label="Truck Type"
                  :items="truckTypeList"
                  item-title="truckType"
                  item-value="truckType"
                />
              </th>
            </tr>
            <tr>
              <th colspan="4">
                ทะเบียนรถ (Truck License)
              </th>
              <th
                colspan="8"
                class="text-center"
              >
                <VTextField
                  v-model="formData.truckLicense"
                  style="min-width: 250px;"
                  density="compact"
                  label="Enter Truck License"
                  class="text-center"
                />
              </th>
            </tr>
            <tr>
              <th colspan="4">
                ชื่อผู้ติดต่อ
              </th>
              <td
                colspan="8"
                class="text-start"
              >
                <VTextField
                  v-model="formData.personIncharge"
                  style="min-width: 250px;"
                  density="compact"
                  label="Contact Name"
                  class="text-center"
                />
              </td>
            </tr>
            <tr>
              <th colspan="4">
                รายชื่อและเบอร์โทรผู้ติดต่อ
              </th>
              <td
                colspan="8"
                class="text-start"
              >
                <VTextField
                  v-model="formData.contact"
                  style="min-width: 250px;"
                  density="compact"
                  label="Contact & Tel."
                  class="text-center"
                />
              </td>
            </tr>
            <tr>
              <th
                colspan="4"
                style="text-align: start; vertical-align: top;"
              >
                <span>หมายเหตุ (Remark) </span>
              </th>
              <th
                colspan="8"
                class="text-center"
              >
                <VTextarea
                  v-model="formData.remark"
                  label="Default"
                  placeholder="Enter Remark"
                  clearable
                  clear-icon="ri-close-line"
                  row-height="30"
                />
              </th>
            </tr>
          </tbody>
        </table>
        
        <table class="custom-table">
          <tr>
            <th colspan="4">
              <VTextField
                v-model="formData.driverAndTel"
                density="compact"
                class="text-center"
              >
                <template #label>
                  ผู้ขับรถ&เบอร์โทร
                </template>
              </VTextField>
            </th>
            <th colspan="4">
              <VTextField
                v-model="formData.orderBy"
                density="compact"
                class="text-center"
              >
                <template #label>
                  ผู้สั่งการ / Order By
                </template>
              </VTextField>
            </th>
            <th colspan="4">
              <VTextField
                v-model="formData.authorizedBy"
                density="compact"
                class="text-center"
              >
                <template #label>
                  ผู้อนุมัติ / Authorized By
                </template>
              </VTextField>
            </th>
          </tr>
          <tr>
            <th colspan="4">
              <AppDateTimePicker
                v-model="formData.dateDriverDate"
                density="compact"
                placeholder="Select date"
                :config="{ dateFormat: 'd/m/Y' }"
              />
            </th>
            <th colspan="4">
              <AppDateTimePicker
                v-model="formData.dateOrderDate"
                density="compact"
                placeholder="Select date"
                :config="{ dateFormat: 'd/m/Y' }"
              />
            </th>
            <th colspan="4">
              <AppDateTimePicker
                v-model="formData.dateAuthorizedDate"
                density="compact"
                placeholder="Select date"
                :config="{ dateFormat: 'd/m/Y' }"
              />
            </th>
          </tr>
        </table>
      </VCardText>

      <VCardText class="d-flex justify-end">
        <VBtn
          v-if="!disabled"
          color="warning"
          class="d-flex justify-space-between mx-2"
          @click="handleSave"
        >
          <span v-if="!loadingSave">Save</span>
          <div>
            <VProgressCircular
              v-if="loadingSave"
              start
              :rotate="360"
              :size="30"
              indeterminate
              color="primary"
            />
          </div>
        </VBtn>

        <VBtn
          color="warning"
          class="d-flex justify-space-between"
          @click="handlePrint"
        >
          <span v-if="!loadingPrint">
            <VIcon
              start
              icon="ri-printer-fill"
            />
            Print
          </span>
          <div>
            <VProgressCircular
              v-if="loadingPrint"
              start
              :rotate="360"
              :size="30"
              indeterminate
              color="primary"
            />
          </div>
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>

  <!-- Confirm Close Dialog -->
  <VDialog
    v-model="confirmCloseVisible"
    max-width="420"
  >
    <VCard>
      <VCardTitle class="text-h6">
        ออกจากหน้านี้?
      </VCardTitle>

      <VCardText>
        มีการแก้ไขข้อมูลแต่ยังไม่ได้บันทึก
        ต้องการออกโดยไม่บันทึกใช่หรือไม่
      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn
          variant="text"
          @click="confirmCloseVisible = false"
        >
          ยกเลิก
        </VBtn>
        <VBtn
          color="error"
          @click="forceClose"
        >
          ออกโดยไม่บันทึก
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { ref, watch, watchEffect, computed, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  saleOrderNumber: {
    type: String,
    default: '',
  },
  dataRow: {
    type: Object,
    default: () => ({}),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  companyList: {
    type: Array,
    default: () => [],
  },
  addressList: {
    type: Array,
    default: () => [],
  },
  truckList: {
    type: Array,
    default: () => [],
  },
  truckTypeList: {
    type: Array,
    default: () => [],
  },
  currentUser: {
    type: Object,
    default: () => ({}),
  },
  existingData: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits([
  'update:modelValue',
  'save',
  'print',
  'close',
])

// ✅ Two-way binding for dialog
const dialogVisible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

// ✅ Loading states
const loadingSave = ref(false)
const loadingPrint = ref(false)

// ✅ Dirty tracking
const isDirty = ref(false)
const initialSnapshot = ref(null)
const confirmCloseVisible = ref(false)

// ✅ Form data
const formData = ref({
  company: '',
  address: '',
  truckCompany: '',
  truckType: '',
  truckLicense: '',
  personIncharge: '',
  contact: '',
  remark: '',
  driverAndTel: '',
  orderBy: '',
  authorizedBy: '',
  dateDriverDate: null,
  dateOrderDate: null,
  dateAuthorizedDate: null,
})

// ✅ Get current date helper
const getCurrentDate = () => {
  const today = new Date()
  const day = String(today.getDate()).padStart(2, '0')
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const year = today.getFullYear()
  
  return `${day}/${month}/${year}`
}

// ✅ Watch for changes to track dirty state
watch(
  formData,
  newVal => {
    if (!initialSnapshot.value) return
    isDirty.value = JSON.stringify(newVal) !== JSON.stringify(initialSnapshot.value)
  },
  { deep: true },
)

// ✅ Auto-fill contact info when truck company selected
watchEffect(() => {
  if (formData.value.truckCompany && props.truckList.length > 0) {
    const selectedTruck = props.truckList.find(
      item => item.truck === formData.value.truckCompany,
    )

    if (selectedTruck) {
      formData.value.personIncharge = selectedTruck.personIncharge || ''
      formData.value.contact = selectedTruck.contact || ''
    }
  }
})

// ✅ Initialize form data when dialog opens or existingData changes
watch(
  () => [props.modelValue, props.existingData],
  ([isOpen, existingData]) => {
    if (isOpen) {
      initializeFormData()
    }
  },
  { immediate: true },
)

// ✅ Initialize form data
const initializeFormData = () => {
  const currentDate = getCurrentDate()
  
  const initData = {
    company: props.existingData?.company || props.dataRow?.shipperName || '',
    address: props.existingData?.address || props.dataRow?.shipperLocation || '',
    truckCompany: props.existingData?.truckCompany || props.dataRow?.truck || '',
    truckType: props.existingData?.truckType || '',
    truckLicense: props.existingData?.truckLicense || '',
    personIncharge: props.existingData?.personIncharge || '',
    contact: props.existingData?.contact || '',
    remark: props.existingData?.remark || '',
    driverAndTel: props.existingData?.driverAndTel || '',
    orderBy: props.existingData?.orderBy || props.currentUser?.firstName || '',
    authorizedBy: props.existingData?.authorizedBy || '',
    dateDriverDate: props.existingData?.dateDriverDate || currentDate,
    dateOrderDate: props.existingData?.dateOrderDate || currentDate,
    dateAuthorizedDate: props.existingData?.dateAuthorizedDate || currentDate,
  }

  formData.value = initData
  initialSnapshot.value = JSON.parse(JSON.stringify(initData))
  isDirty.value = false
}

// ✅ Handle Save
const handleSave = () => {
  loadingSave.value = true
  
  const saveData = {
    ...formData.value,
    soEtlLogDetailJournalID: props.dataRow?.soEtlLogDetailJournalID,
    runningNum: props.dataRow?.truckReservingNumber,
  }
  
  emit('save', saveData)
  
  setTimeout(() => {
    initialSnapshot.value = JSON.parse(JSON.stringify(formData.value))
    isDirty.value = false
    loadingSave.value = false
  }, 1000)
}

// ✅ Handle Print
const handlePrint = () => {
  loadingPrint.value = true
  
  const printData = {
    ...formData.value,
    soEtlLogDetailJournalID: props.dataRow?.soEtlLogDetailJournalID,
    runningNum: props.dataRow?.truckReservingNumber,
    saleOrderNo: props.saleOrderNumber,
  }
  
  emit('print', printData)
  
  setTimeout(() => {
    loadingPrint.value = false
  }, 1000)
}

// ✅ Handle Close with dirty check
const handleClose = () => {
  if (isDirty.value && !props.disabled) {
    confirmCloseVisible.value = true
    
    return
  }
  
  forceClose()
}

// ✅ Force close without saving
const forceClose = () => {
  confirmCloseVisible.value = false
  dialogVisible.value = false
  isDirty.value = false
  emit('close')
}

// ✅ Clear form data (exposed method)
const clearFormData = () => {
  formData.value = {
    company: '',
    address: '',
    truckCompany: '',
    truckType: '',
    truckLicense: '',
    personIncharge: '',
    contact: '',
    remark: '',
    driverAndTel: '',
    orderBy: '',
    authorizedBy: '',
    dateDriverDate: null,
    dateOrderDate: null,
    dateAuthorizedDate: null,
  }
  initialSnapshot.value = null
  isDirty.value = false
}

defineExpose({
  clearFormData,
})
</script>

<style scoped>
.custom-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.custom-table th,
.custom-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.custom-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.custom-table .text-start {
  text-align: left;
}

.custom-table .text-center {
  text-align: center;
}
</style>
