<template>
  <section>
    <VDialog
      v-model="isDialogVisiblePrintTruck"
      width="100%"
      persistent
    >
      <!-- Dialog Content -->
      <VCard>
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="handleCloseDialog"
        />

        <VCardTitle class="text-center">
          Truck Order
        </VCardTitle>

        <VCardText style="overflow-x: auto;">
          <!-- Main Information Table -->
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
                  {{ dataRowModel?.logUpdatedDate }}
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  เลขที่ใบสั่งงานรถขนส่ง (Truck Order No)
                </th>
                <td colspan="8">
                  {{ dataRowModel?.truckReservingNumber }}
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
                  {{ saleOrderNo }}
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  ชื่อลูกค้า
                </th>
                <th colspan="8">
                  <VAutocomplete
                    v-model="CompanyPrint"
                    class="text-start"
                    density="compact"
                    label="Company"
                    :items="CompanyModel"
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
                    v-model="AddressPrint"
                    class="text-start"
                    density="compact"
                    label="Address"
                    :items="AddressModel"
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
                    v-model="TruckCompanyPrint"
                    class="text-center"
                    density="compact"
                    label="Transportation Company Name"
                    :items="truckModel"
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
                    v-model="TruckTypePrint"
                    class="text-center"
                    density="compact"
                    label="Truck Type"
                    :items="TruckTypeModel"
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
                    v-model="paramsTruckOrder.truckLicense"
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
                    v-model="personInchargeTruckCompanyModel"
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
                    v-model="contactTruckCompanyModel"
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
                  <span>หมายเหตุ (Remark)</span>
                </th>
                <th
                  colspan="8"
                  class="text-center"
                >
                  <VTextarea
                    v-model="paramsTruckOrder.remark"
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

          <!-- Signature Table -->
          <table class="custom-table">
            <tr>
              <th colspan="4">
                <VTextField
                  v-model="paramsTruckOrder.driverAndTel"
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
                  v-model="userDataInfo.firstName"
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
                  v-model="paramsTruckOrder.authorizedBy"
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
                  v-model="paramsTruckOrder.dateDriverDate"
                  density="compact"
                  placeholder="Select date"
                  :config="{ dateFormat: 'd/m/Y' }"
                />
              </th>
              <th colspan="4">
                <AppDateTimePicker
                  v-model="paramsTruckOrder.dateOrderDate"
                  density="compact"
                  placeholder="Select date"
                  :config="{ dateFormat: 'd/m/Y' }"
                />
              </th>
              <th colspan="4">
                <AppDateTimePicker
                  v-model="paramsTruckOrder.dateAuthorizedDate"
                  density="compact"
                  placeholder="Select date"
                  :config="{ dateFormat: 'd/m/Y' }"
                />
              </th>
            </tr>
          </table>
        </VCardText>

        <!-- Action Buttons -->
        <VCardText class="d-flex justify-end">
          <VBtn
            v-if="!disabledModel"
            color="warning"
            class="d-flex justify-space-between mx-2"
            @click="handleSaveDraft"
          >
            <span v-if="!loadingSaveTruckOrderForm">Save</span>
            <div>
              <VProgressCircular
                v-if="loadingSaveTruckOrderForm"
                start
                :rotate="360"
                :size="30"
                indeterminate
                :model-value="progressValue"
                color="primary"
              />
            </div>
          </VBtn>

          <VBtn
            color="warning"
            class="d-flex justify-space-between"
            @click="handlePrint"
          >
            <span v-if="!loadingPrintTruckOrderForm">
              <VIcon
                start
                icon="ri-printer-fill"
              />
              Print
            </span>
            <div>
              <VProgressCircular
                v-if="loadingPrintTruckOrderForm"
                start
                :rotate="360"
                :size="30"
                indeterminate
                :model-value="progressValue"
                color="primary"
              />
            </div>
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>
</template>

<script>
import { ref, reactive, computed } from 'vue'

export default {
  name: 'TruckOrderDialog',
  
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    dataRowModel: {
      type: Object,
      default: () => ({}),
    },
    saleOrderNo: {
      type: String,
      default: '',
    },
    disabledModel: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['update:modelValue', 'save', 'print'],

  setup(props, { emit }) {
    // Dialog visibility
    const isDialogVisiblePrintTruck = computed({
      get: () => props.modelValue,
      set: value => emit('update:modelValue', value),
    })

    // Loading states
    const loadingSaveTruckOrderForm = ref(false)
    const loadingPrintTruckOrderForm = ref(false)
    const progressValue = ref(0)

    // Form data
    const paramsTruckOrder = reactive({
      truckLicense: '',
      remark: '',
      driverAndTel: '',
      authorizedBy: '',
      dateDriverDate: null,
      dateOrderDate: null,
      dateAuthorizedDate: null,
    })

    // User data
    const userDataInfo = reactive({
      firstName: '',
    })

    // Dropdown models
    const CompanyPrint = ref('')
    const CompanyModel = ref([])

    const AddressPrint = ref('')
    const AddressModel = ref([])

    const TruckCompanyPrint = ref('')
    const truckModel = ref([])

    const TruckTypePrint = ref('')
    const TruckTypeModel = ref([])

    const personInchargeTruckCompanyModel = ref('')
    const contactTruckCompanyModel = ref('')

    // State flags
    const trikerSaveDrft = ref(false)
    const trickerSaveTruckOrder = ref(0)

    // Methods
    const clearParamsTruckOrder = () => {
      paramsTruckOrder.truckLicense = ''
      paramsTruckOrder.remark = ''
      paramsTruckOrder.driverAndTel = ''
      paramsTruckOrder.authorizedBy = ''
      paramsTruckOrder.dateDriverDate = null
      paramsTruckOrder.dateOrderDate = null
      paramsTruckOrder.dateAuthorizedDate = null
      
      CompanyPrint.value = ''
      AddressPrint.value = ''
      TruckCompanyPrint.value = ''
      TruckTypePrint.value = ''
      personInchargeTruckCompanyModel.value = ''
      contactTruckCompanyModel.value = ''
    }

    const clearHistoryTruckOrder = () => {
      // Clear history logic here
      console.log('Clear history')
    }

    const handleSavetruckOrder = () => {
      const formData = {
        ...paramsTruckOrder,
        company: CompanyPrint.value,
        address: AddressPrint.value,
        truckCompany: TruckCompanyPrint.value,
        truckType: TruckTypePrint.value,
        personIncharge: personInchargeTruckCompanyModel.value,
        contact: contactTruckCompanyModel.value,
        isDraft: trikerSaveDrft.value,
        saveType: trickerSaveTruckOrder.value,
      }
      
      emit('save', formData)
    }

    const handlePrintTruckOrderPDF = () => {
      const printData = {
        ...paramsTruckOrder,
        company: CompanyPrint.value,
        address: AddressPrint.value,
        truckCompany: TruckCompanyPrint.value,
        truckType: TruckTypePrint.value,
        personIncharge: personInchargeTruckCompanyModel.value,
        contact: contactTruckCompanyModel.value,
        dataRow: props.dataRowModel,
        saleOrderNo: props.saleOrderNo,
      }
      
      emit('print', printData)
    }

    const handleCloseDialog = () => {
      trikerSaveDrft.value = false
      trickerSaveTruckOrder.value = 1
      handleSavetruckOrder()
      isDialogVisiblePrintTruck.value = false
      clearParamsTruckOrder()
      clearHistoryTruckOrder()
    }

    const handleSaveDraft = () => {
      trickerSaveTruckOrder.value = 0
      trikerSaveDrft.value = true
      loadingSaveTruckOrderForm.value = true
      handleSavetruckOrder()
      
      // Simulate saving process
      setTimeout(() => {
        loadingSaveTruckOrderForm.value = false
      }, 1000)
    }

    const handlePrint = () => {
      loadingPrintTruckOrderForm.value = true
      handlePrintTruckOrderPDF()
      
      // Simulate printing process
      setTimeout(() => {
        loadingPrintTruckOrderForm.value = false
      }, 1000)
    }

    // Initialize data (you may want to fetch this from API)
    const initializeData = () => {
      // Example data - replace with actual API calls
      CompanyModel.value = [
        { company: 'Company A' },
        { company: 'Company B' },
        { company: 'Company C' },
      ]

      AddressModel.value = [
        { shipperLocation: 'Location 1' },
        { shipperLocation: 'Location 2' },
      ]

      truckModel.value = [
        { truck: 'Transport Company 1' },
        { truck: 'Transport Company 2' },
      ]

      TruckTypeModel.value = [
        { truckType: '4 Wheels' },
        { truckType: '6 Wheels' },
        { truckType: '10 Wheels' },
      ]

      // Set current user name
      userDataInfo.firstName = 'Current User'
    }

    // Initialize on component mount
    initializeData()

    return {
      // Dialog
      isDialogVisiblePrintTruck,
      
      // Loading states
      loadingSaveTruckOrderForm,
      loadingPrintTruckOrderForm,
      progressValue,
      
      // Form data
      paramsTruckOrder,
      userDataInfo,
      
      // Dropdown models
      CompanyPrint,
      CompanyModel,
      AddressPrint,
      AddressModel,
      TruckCompanyPrint,
      truckModel,
      TruckTypePrint,
      TruckTypeModel,
      personInchargeTruckCompanyModel,
      contactTruckCompanyModel,
      
      // State flags
      trikerSaveDrft,
      trickerSaveTruckOrder,
      
      // Methods
      handleCloseDialog,
      handleSaveDraft,
      handlePrint,
      clearParamsTruckOrder,
      clearHistoryTruckOrder,
      handleSavetruckOrder,
      handlePrintTruckOrderPDF,
    }
  },
}
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
