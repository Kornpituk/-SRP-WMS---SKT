<script setup>
const MAX = ref(123)

//-------------------- model switch ------------------------------
const switchAllMenu = ref(false)

const switchSystemData = ref(false)
const switchReceiveProductDeliveryData = ref(false)
const switchReleaseProductsData = ref(false)
const switchPurchaseOrderData = ref(false)
const switchWarehouseData = ref(false)
const switchReportData = ref(false)
const switchImportDataInformationData = ref(false)
const switchSecurityAdministrationData = ref(false)

//-------------------- Check Box --------------------------------
//-------------------- check box for system data --------------------------
const checkboxCompany = ref(false)
const checkboxProductData = ref(false)
const checkboxEmployeeData = ref(false)
const checkboxWarehouseData = ref(false)
const checkboxReceiptTypeData = ref(false)
const checkboxCustomerData = ref(false)
const checkboxVendorData = ref(false)
const checkboxRegisterProductLot = ref(false)

//-------------------- check box right ----------------------------------
const checkboxcheckboxConfirmationRights = ref(false) //---------------- ********
const checkboxApprovalRights = ref(false) //------------------------ ****
const checkboxCancellationRights = ref(false) //------------------------ ****
const checkboxRightToCloseStock = ref(false) //------------------------ ****
const checkboxCancelOutstandingPurchaseOrderPO = ref(false) //------------------------ ****
const checkboxPurchaseOrderAuthorization = ref(false) //-------------------- ********

//-------------------- Receive Product Deliver --------------------------
const checkboxReceiveFromPurchaseOrder = ref(false)
const checkboxReceiveFromOtherSources = ref(false)
const checkboxReceiveIntoWarehouse = ref(false)

//-------------------- Release Products --------------------------
const checkboxInventoryWithdrawalRequest = ref(false)
const checkboxRequisitionFromDelivery = ref(false)
const checkboxSellOffAsWriteOff = ref(false)

//-------------------- Purchase Order --------------------------
const checkboxGenerateAPO = ref(false)

//-------------------- Warehouse --------------------------
const checkboxArrangeProductsDisbursement = ref(false)
const checkboxDeliveryNote = ref(false)
const checkboxStockTransfer = ref(false)
const checkboxCheckStock = ref(false)
const checkboxUnitBreakdown = ref(false)
const checkboxCountingAdjustment = ref(false)

//-------------------- Report --------------------------
const checkboxPOReport = ref(false)
const checkboxProductReceiptReport = ref(false)
const checkboxDisbursementReport = ref(false)
const checkboxArrangeProductsDisbursementReport = ref(false)
const checkboxInventoryAuditReportReceivedReport = ref(false)
const checkboxStockTransferReport = ref(false)
const checkboxReportOnProductReturnsFromProductionOrder = ref(false)
const checkboxReportDeliveryNote = ref(false)
const checkboxInventoryLotReport = ref(false)
const checkboxProductionGoodsReceiptReport = ref(false)
const checkboxNonMovingInventoryItems = ref(false)
const checkboxReportOnSafetyStock = ref(false)
const checkboxProductAndRawMaterialReport = ref(false)
const checkboxProductSummaryReport = ref(false)

//-------------------- Import Data/Information --------------------------
const checkboxImportProduct = ref(false)
const checkboxImportPurchaseOrder = ref(false)
const checkboxImportWarehouseWithdrawalData = ref(false)
const checkboxImportDeliveryWithdrawalData = ref(false)

//-------------------- Set Permissions --------------------------
const checkboxSetUser = ref(false)
const checkboxSetUserPermissionMenu = ref(false)
const checkboxSetUserGroupBasedOnPermission = ref(false)

//---------------------- switchAll
watch(() => {
  if(switchAllMenu.value) {
    switchSystemData.value = true
    switchReceiveProductDeliveryData.value = true
    switchReleaseProductsData.value = true
    switchPurchaseOrderData.value = true
    switchWarehouseData.value = true
    switchReportData.value = true
    switchImportDataInformationData.value = true
    switchSecurityAdministrationData.value = true
  } else if(!switchAllMenu.value) {
    switchSystemData.value = false
    switchReceiveProductDeliveryData.value = false
    switchReleaseProductsData.value = false
    switchPurchaseOrderData.value = false
    switchWarehouseData.value = false
    switchReportData.value = false
    switchImportDataInformationData.value = false
    switchSecurityAdministrationData.value = false
  }
})

//---------------------- switchSystemData
watch(() => {
  if(switchSystemData.value) {
    checkboxCompany.value = true
    checkboxProductData.value = true
    checkboxEmployeeData.value = true
    checkboxWarehouseData.value = true
    checkboxReceiptTypeData.value = true
    checkboxCustomerData.value = true
    checkboxVendorData.value = true
    checkboxRegisterProductLot.value = true
  } else if(!switchAllMenu.value) {
    checkboxCompany.value = false
    checkboxProductData.value = false
    checkboxEmployeeData.value = false
    checkboxWarehouseData.value = false
    checkboxReceiptTypeData.value = false
    checkboxCustomerData.value = false
    checkboxVendorData.value = false
    checkboxRegisterProductLot.value = false
  }
})

//---------------------- switchReceiveProductDeliveryData
watch(() => {
  if(switchReceiveProductDeliveryData.value) {
    checkboxReceiveFromPurchaseOrder.value = true
    checkboxReceiveFromOtherSources.value = true
    checkboxReceiveIntoWarehouse.value = true
  } else if(!switchReceiveProductDeliveryData.value) {
    checkboxReceiveFromPurchaseOrder.value = false
    checkboxReceiveFromOtherSources.value = false
    checkboxReceiveIntoWarehouse.value = false
  }
})

//---------------------- switchReleaseProductsData
watch(() => {
  
  if(switchReleaseProductsData.value) {
    checkboxInventoryWithdrawalRequest.value = true
    checkboxRequisitionFromDelivery.value = true
    checkboxSellOffAsWriteOff.value = true
  } else if(!switchReleaseProductsData.value) {
    checkboxInventoryWithdrawalRequest.value = false
    checkboxRequisitionFromDelivery.value = false
    checkboxSellOffAsWriteOff.value = false
  }

})

//---------------------- switchPurchaseOrderData
watch(() => {

  if(switchPurchaseOrderData.value) {
    checkboxGenerateAPO.value = true
  } else if(!switchPurchaseOrderData.value) {
    checkboxGenerateAPO.value = false
  }

})

//---------------------- switchWarehouseData
watch(() => {
  if(switchWarehouseData.value) {
    checkboxArrangeProductsDisbursement.value = true
    checkboxDeliveryNote.value = true
    checkboxStockTransfer.value = true
    checkboxCheckStock.value = true
    checkboxUnitBreakdown.value = true
    checkboxCountingAdjustment.value = true
  } else if(!switchWarehouseData.value) {
    checkboxArrangeProductsDisbursement.value = false
    checkboxDeliveryNote.value = false
    checkboxStockTransfer.value = false
    checkboxCheckStock.value = false
    checkboxUnitBreakdown.value = false
    checkboxCountingAdjustment.value = false
  }
})

//---------------------- switchReportData
watch(() => {
  if(switchReportData.value) {
    checkboxPOReport.value = true
    checkboxProductReceiptReport.value = true
    checkboxDisbursementReport.value = true
    checkboxArrangeProductsDisbursementReport.value = true
    checkboxInventoryAuditReportReceivedReport.value = true
    checkboxStockTransferReport.value = true
    checkboxReportOnProductReturnsFromProductionOrder.value = true
    checkboxReportDeliveryNote.value = true
    checkboxInventoryLotReport.value = true
    checkboxProductionGoodsReceiptReport.value = true
    checkboxNonMovingInventoryItems.value = true
    checkboxReportOnSafetyStock.value = true
    checkboxProductAndRawMaterialReport.value = true
    checkboxProductSummaryReport.value = true
  } else if(!switchReportData.value) {
    checkboxPOReport.value = false
    checkboxProductReceiptReport.value = false
    checkboxDisbursementReport.value = false
    checkboxArrangeProductsDisbursementReport.value = false
    checkboxInventoryAuditReportReceivedReport.value = false
    checkboxStockTransferReport.value = false
    checkboxReportOnProductReturnsFromProductionOrder.value = false
    checkboxReportDeliveryNote.value = false
    checkboxInventoryLotReport.value = false
    checkboxProductionGoodsReceiptReport.value = false
    checkboxNonMovingInventoryItems.value = false
    checkboxReportOnSafetyStock.value = false
    checkboxProductAndRawMaterialReport.value = false
    checkboxProductSummaryReport.value = false
  }
})

//---------------------- switchImportDataInformationData
watch(() => {

  if(switchImportDataInformationData.value) {
    checkboxImportProduct.value = true
    checkboxImportPurchaseOrder.value = true
    checkboxImportWarehouseWithdrawalData.value = true
    checkboxImportDeliveryWithdrawalData.value = true
  } else if(!switchImportDataInformationData.value) {
    checkboxImportProduct.value = false
    checkboxImportPurchaseOrder.value = false
    checkboxImportWarehouseWithdrawalData.value = false
    checkboxImportDeliveryWithdrawalData.value = false
  }
})

//---------------------- switchSecurityAdministrationData
watch(() => {

  if(switchSecurityAdministrationData.value) {
    checkboxSetUser.value = true
    checkboxSetUserPermissionMenu.value = true
    checkboxSetUserGroupBasedOnPermission.value = true

  } else if(!switchSecurityAdministrationData.value) {
    checkboxSetUser.value = false
    checkboxSetUserPermissionMenu.value = false
    checkboxSetUserGroupBasedOnPermission.value = false
  }
})

const toggleCheckbox = () => {
  checkboxCompany.value = !checkboxCompany.value
}

//------------------------------------------------------------
const company = ref(false)


const checkboxActions = ([
  { icon: 'mdi-checkbox-marked', onClick: toggleCheckbox },
])


const capitalizedLabel = label => {
  const convertLabelText = label.toString()
  
  return convertLabelText.charAt(0).toUpperCase() + convertLabelText.slice(1)
}

const systemData = ref([
  'Users',
  'Admin',
])

const admins = [
  [
    'Management',
    'mdi-account-multiple-outline',
  ],
  [
    'Settings',
    'mdi-cog-outline',
  ],
]

const cruds = [
  [
    'Create',
    'mdi-plus-outline',
  ],
  [
    'Read',
    'mdi-file-outline',
  ],
  [
    'Update',
    'mdi-update',
  ],
  [
    'Delete',
    'mdi-delete-outline',
  ],
]
</script>

<template>
  <!-- ----------------        Label Page | Back           ------------------------------------ -->
  <section>
    <!-- Tag page back -->
    <VRow>
      <VCol
        col="12"
        sm="4"
        md="4"
        lg="4"
      >
        <RouterLink :to="{ name: 'setPermission-defineRole-role' }">
          <IconBtn>
            <VIcon
              icon="
                mdi-chevron-left"
            />
          </IconBtn>
          {{ $t("Set Permissions / Define Roles / win App") }}
        </RouterLink>
      </VCol>
    </VRow>
  </section>

  <!-- Tab Role Name  -->
  <div>
    <VCard>
      <VCardText>
        <VRow>
          <VCol
            cols="5"
            lg="3"
            class="d-flex align-center justify-end"
          >
            <span>{{ $t('Role Name') }} :</span>
          </VCol>
          <VCol
            cols="7"
            lg="6"
          >
            <VTextField
              v-model="Manager"
              :label="$t('Role Name')"
              density="compact"
            />
          </VCol>
          <VCol
            cols="12"
            lg="3"
          >
            <VSwitch
              v-model="switchAllMenu"
              :label="$t('All Menu')"
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>

  <!-- Btn Menu Win App / Btn Menu Moblie App / Btn Save -->
  <div class="my-4">
    <VRow>
      <!-- Btn Win App / Btn Moblie App -->
      <VCol
        lg="4"
        cols="12"
      >
        <VRow>
          <VCol
            lg="6"
            cols="12"
          >
            <VBtn
              style="width: 100%;"
              prepend-icon="mdi-apps"
              :to="{ name: 'setPermission-defineRole-winApp-winApp' }"
            >
              <template #prepend>
                <VIcon
                  size="30"
                  color="white"
                />
              </template>

              {{ $t('Win App Menu') }}
            </VBtn>
          </VCol>
          <VCol
            lg="6"
            cols="12"
          >
            <VBtn
            :to="{ name: 'setPermission-defineRole-moblieApp-moblieApp' }"
              style="width: 100%;"
              variant="outlined"
              color="grey"
              prepend-icon="mdi-apps"
            >
              <template #prepend>
                <VIcon
                  size="30"
                  color="grey"
                />
              </template>

              {{ $t('Moblie App Menu') }}
            </VBtn>
          </VCol>
        </VRow>
      </VCol>
      <!-- Empty -->
      <VCol
        lg="7"
        cols="8"
      />
      <!-- Save -->
      <VCol
        lg="1"
        cols="12"
      >
        <VBtn style="width: 100%;">
          {{ $t('Save') }}
        </VBtn>
      </VCol>
    </VRow>
  </div>

  <!-- Switch Checkbox Toggle -->
  <div>
    <section>
      <VRow style="margin-top: -60px;" class="pa-8">
        <!-- System Data -->
        <VCol
          cols="12"
          lg="3"
        >
          <VCard>
            <VCardTitle>
              <VSwitch
                v-model="switchSystemData"
                :label="$t('System Data')"
              />
            </VCardTitle>
            <VCardText class="py-0">
              <VList
                v-model:opened="systemData"
                class="py-0"
              >
                <VListGroup
                  class="py-0"
                  value="Company"
                >
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                      :actions="checkboxActions"
                    >
                      <VRow class="py-0">
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxCompany" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Company') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>

                <VListGroup value="Product Information/Data">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxProductData" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Product Information/Data') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>

                  <VListGroup value="Admin">
                    <template #activator="{ props }">
                      <VListItem
                        v-bind="props"
                        title="Admin"
                      />
                    </template>

                    <VListItem
                      v-for="([title, icon], i) in admins"
                      :key="i"
                      :value="title"
                      :title="title"
                      :prepend-icon="icon"
                    />
                  </VListGroup>

                  <VListGroup value="Actions">
                    <template #activator="{ props }">
                      <VListItem
                        v-bind="props"
                        title="Actions"
                      />
                    </template>

                    <VListItem
                      v-for="([title, icon], i) in cruds"
                      :key="i"
                      :value="title"
                      :title="title"
                      :prepend-icon="icon"
                    />
                  </VListGroup>
                </VListGroup>

                <VListGroup value="Employee Information/Data">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                      :actions="checkboxActions"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxEmployeeData" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Employee Information/Data') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>

                  <VListGroup value="Admin">
                    <template #activator="{ props }">
                      <VListItem
                        v-bind="props"
                        title="Admin"
                      />
                    </template>

                    <VListItem
                      v-for="([title, icon], i) in admins"
                      :key="i"
                      :value="title"
                      :title="title"
                      :prepend-icon="icon"
                    />
                  </VListGroup>

                  <VListGroup value="Actions">
                    <template #activator="{ props }">
                      <VListItem
                        v-bind="props"
                        title="Actions"
                      />
                    </template>

                    <VListItem
                      v-for="([title, icon], i) in cruds"
                      :key="i"
                      :value="title"
                      :title="title"
                      :prepend-icon="icon"
                    />
                  </VListGroup>
                </VListGroup>

                <VListGroup value="Warehouse Information/Data">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                      :actions="checkboxActions"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxWarehouseData" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Warehouse Information/Data') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>

                  <VListGroup value="Admin">
                    <template #activator="{ props }">
                      <VListItem
                        v-bind="props"
                        title="Admin"
                      />
                    </template>

                    <VListItem
                      v-for="([title, icon], i) in admins"
                      :key="i"
                      :value="title"
                      :title="title"
                      :prepend-icon="icon"
                    />
                  </VListGroup>

                  <VListGroup value="Actions">
                    <template #activator="{ props }">
                      <VListItem
                        v-bind="props"
                        title="Actions"
                      />
                    </template>

                    <VListItem
                      v-for="([title, icon], i) in cruds"
                      :key="i"
                      :value="title"
                      :title="title"
                      :prepend-icon="icon"
                    />
                  </VListGroup>
                </VListGroup>

                <VListGroup value="Receipt Type / Disbursement Type">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                      :actions="checkboxActions"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxReceiptTypeData" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Receipt Type / Disbursement Type') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>

                <VListGroup value="Customer Information/Data">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                      :actions="checkboxActions"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxCustomerData" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Customer Information/Data') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>

                <VListGroup value="Vendor Information/Data">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                      :actions="checkboxActions"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxVendorData" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Vendor Information/Data') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>

                <VListGroup value="Register Product Lot">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                      :actions="checkboxActions"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxRegisterProductLot" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Register Product Lot') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
              </VList>
            </VCardText>
          </VCard>
        </VCol>
        <!-- Receive Product Delivery -->
        <VCol
          cols="12"
          lg="3"
        >
          <VCard>
            <VCardTitle class="py-0">
              <VSwitch
                v-model="switchReceiveProductDeliveryData"
                :label="$t('Receive Product Delivery')"
              />
            </VCardTitle>
            <VCardText class="py-0">
              <VList
                v-model:opened="systemData"
                class="py-0"
              >
                <VListGroup value="ReceiveFromPurchaseOrder">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                      :actions="checkboxActions"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxReceiveFromPurchaseOrder" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Receive From Purchase Order') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>

                  <VListGroup value="Purchase Order Authorization">
                    <template #activator="{ props }">
                      <VListItem v-bind="props">
                        <VRow>
                          <VCol cols="1">
                            <VCheckbox v-model="checkboxPurchaseOrderAuthorization" />
                          </VCol>
                          <VCol
                            class="d-flex align-center justify-start"
                            cols="10"
                          >
                            {{ $t('Purchase Order Authorization') }}
                          </VCol>
                        </VRow>
                      </VListItem>
                    </template>
                  </VListGroup>
                </VListGroup>

                <VListGroup value="ReceiveFromOtherSources">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxReceiveFromOtherSources" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Receive From Other Sources') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>

                <VListGroup value="ReceiveIntoWarehouse">
                  <template #activator="{ props }">
                    <VListItem
                      v-bind="props"
                      class="py-0"
                      :actions="checkboxActions"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxReceiveIntoWarehouse" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Receive Into Warehouse') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>

                  <VListGroup value="Purchase Order Authorization">
                    <template #activator="{ props }">
                      <VListItem v-bind="props">
                        <VRow>
                          <VCol cols="1">
                            <VCheckbox v-model="checkboxCancellationRights" />
                          </VCol>
                          <VCol
                            class="d-flex align-center justify-start"
                            cols="10"
                          >
                            {{ $t('Cancellation Rights') }}
                          </VCol>
                        </VRow>
                      </VListItem>
                    </template>
                  </VListGroup>
                </VListGroup>
              </VList>
            </VCardText>
          </VCard>
        </VCol>
        <!-- Release Products -->
        <VCol
          cols="12"
          lg="3"
        >
          <VCard>
            <VCardTitle>
              <VSwitch
                v-model="switchReleaseProductsData"
                :label="$t('Release Products')"
              />
            </VCardTitle>
            <VCardText class="py-0">
              <VList
                v-model:opened="systemData"
                class="py-0"
              >
                <VListGroup value="InventoryWithdrawalRequest ">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                      :actions="checkboxActions"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxInventoryWithdrawalRequest" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Inventory Withdrawal Request') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                  <VListGroup value="checkboxApprovalRights">
                    <template #activator="{ props }">
                      <VListItem v-bind="props">
                        <VRow>
                          <VCol cols="1">
                            <VCheckbox v-model="checkboxApprovalRights" />
                          </VCol>
                          <VCol
                            class="d-flex align-center justify-start"
                            cols="10"
                          >
                            {{ $t('Approval Rights') }}
                          </VCol>
                        </VRow>
                      </VListItem>
                    </template>
                  </VListGroup>
                  <VListGroup value="checkboxCancellationRights">
                    <template #activator="{ props }">
                      <VListItem v-bind="props">
                        <VRow>
                          <VCol cols="1">
                            <VCheckbox v-model="checkboxCancellationRights" />
                          </VCol>
                          <VCol
                            class="d-flex align-center justify-start"
                            cols="10"
                          >
                            {{ $t('Cancellation Rights') }}
                          </VCol>
                        </VRow>
                      </VListItem>
                    </template>
                  </VListGroup>
                </VListGroup>

                <VListGroup value="RequisitionFromDelivery">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxRequisitionFromDelivery" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Requisition from Delivery') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>

                  <VListGroup value="checkboxApprovalRights">
                    <template #activator="{ props }">
                      <VListItem v-bind="props">
                        <VRow>
                          <VCol cols="1">
                            <VCheckbox v-model="checkboxApprovalRights" />
                          </VCol>
                          <VCol
                            class="d-flex align-center justify-start"
                            cols="10"
                          >
                            {{ $t('Approval Rights') }}
                          </VCol>
                        </VRow>
                      </VListItem>
                    </template>
                  </VListGroup>
                  <VListGroup value="checkboxCancellationRights">
                    <template #activator="{ props }">
                      <VListItem v-bind="props">
                        <VRow>
                          <VCol cols="1">
                            <VCheckbox v-model="checkboxCancellationRights" />
                          </VCol>
                          <VCol
                            class="d-flex align-center justify-start"
                            cols="10"
                          >
                            {{ $t('Cancellation Rights') }}
                          </VCol>
                        </VRow>
                      </VListItem>
                    </template>
                  </VListGroup>
                </VListGroup>

                <VListGroup value="SellOffAsWriteOff">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                      :actions="checkboxActions"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxSellOffAsWriteOff" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Sell Off As Write-off') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>

                  <VListGroup value="checkboxApprovalRights">
                    <template #activator="{ props }">
                      <VListItem v-bind="props">
                        <VRow>
                          <VCol cols="1">
                            <VCheckbox v-model="checkboxApprovalRights" />
                          </VCol>
                          <VCol
                            class="d-flex align-center justify-start"
                            cols="10"
                          >
                            {{ $t('Approval Rights') }}
                          </VCol>
                        </VRow>
                      </VListItem>
                    </template>
                  </VListGroup>
                  <VListGroup value="checkboxCancellationRights">
                    <template #activator="{ props }">
                      <VListItem v-bind="props">
                        <VRow>
                          <VCol cols="1">
                            <VCheckbox v-model="checkboxCancellationRights" />
                          </VCol>
                          <VCol
                            class="d-flex align-center justify-start"
                            cols="10"
                          >
                            {{ $t('Cancellation Rights') }}
                          </VCol>
                        </VRow>
                      </VListItem>
                    </template>
                  </VListGroup>
                </VListGroup>
              </VList>
            </VCardText>
          </VCard>
        </VCol>
        <!-- Purchase Order -->
        <VCol
          cols="12"
          lg="3"
        >
          <VCard>
            <VCardTitle>
              <VSwitch
                v-model="switchPurchaseOrderData"
                :label="$t('Purchase Order')"
              />
            </VCardTitle>
            <VCardText class="py-0">
              <VList
                v-model:opened="systemData"
                class="py-0"
              >
                <VListGroup
                  class="py-0"
                  value="Generate A PO"
                >
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxGenerateAPO" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Generate A PO') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                  <VListGroup value="checkboxApprovalRights">
                    <template #activator="{ props }">
                      <VListItem v-bind="props">
                        <VRow>
                          <VCol cols="1">
                            <VCheckbox v-model="checkboxApprovalRights" />
                          </VCol>
                          <VCol
                            class="d-flex align-center justify-start"
                            cols="10"
                          >
                            {{ $t('Approval Rights') }}
                          </VCol>
                        </VRow>
                      </VListItem>
                    </template>
                  </VListGroup>
                  <VListGroup value="checkboxCancellationRights">
                    <template #activator="{ props }">
                      <VListItem v-bind="props">
                        <VRow>
                          <VCol cols="1">
                            <VCheckbox v-model="checkboxCancellationRights" />
                          </VCol>
                          <VCol
                            class="d-flex align-center justify-start"
                            cols="10"
                          >
                            {{ $t('Cancellation Rights') }}
                          </VCol>
                        </VRow>
                      </VListItem>
                    </template>
                  </VListGroup>
                  <VListGroup value="checkboxCancelOutstandingPurchaseOrderPO">
                    <template #activator="{ props }">
                      <VListItem v-bind="props">
                        <VRow>
                          <VCol cols="1">
                            <VCheckbox v-model="checkboxCancelOutstandingPurchaseOrderPO" />
                          </VCol>
                          <VCol
                            class="d-flex align-center justify-start"
                            cols="10"
                          >
                            {{ $t('Cancel Outstanding Purchase Order/PO') }}
                          </VCol>
                        </VRow>
                      </VListItem>
                    </template>
                  </VListGroup>
                </VListGroup>
              </VList>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
      <VRow style="margin-top: -80px;" class="pa-10">
        <!-- Warehouse -->
        <VCol
          cols="12"
          lg="3"
        >
          <VCard>
            <VCardTitle>
              <VSwitch
                v-model="switchWarehouseData"
                :label="$t('Warehouse')"
              />
            </VCardTitle>
            <VCardText class="py-0">
              <VList
                v-model:opened="systemData"
                class="py-0"
              >
                <VListGroup
                  class="py-0"
                  value="ArrangeProductsDisbursement"
                >
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxArrangeProductsDisbursement" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Arrange Products / Disbursement') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                  <VListGroup
                    class="py-0"
                    value="checkboxConfirmationRights"
                  >
                    <template #activator="{ props }">
                      <VListItem
                        class="py-0"
                        v-bind="props"
                      >
                        <VRow>
                          <VCol cols="1">
                            <VCheckbox v-model="checkboxcheckboxConfirmationRights" />
                          </VCol>
                          <VCol
                            class="d-flex align-center justify-start"
                            cols="10"
                          >
                            {{ $t('Confirmation Rights') }}
                          </VCol>
                        </VRow>
                      </VListItem>
                    </template>
                  </VListGroup>
                  <VListGroup
                    class="py-0"
                    value="checkboxApprovalRights"
                  >
                    <template #activator="{ props }">
                      <VListItem
                        class="py-0"
                        v-bind="props"
                      >
                        <VRow>
                          <VCol cols="1">
                            <VCheckbox v-model="checkboxApprovalRights" />
                          </VCol>
                          <VCol
                            class="d-flex align-center justify-start"
                            cols="10"
                          >
                            {{ $t('Approval Rights') }}
                          </VCol>
                        </VRow>
                      </VListItem>
                    </template>
                  </VListGroup>
                  <VListGroup
                    class="py-0"
                    value="checkboxCancellationRights"
                  >
                    <template #activator="{ props }">
                      <VListItem
                        class="py-0"
                        v-bind="props"
                      >
                        <VRow>
                          <VCol cols="1">
                            <VCheckbox v-model="checkboxCancellationRights" />
                          </VCol>
                          <VCol
                            class="d-flex align-center justify-start"
                            cols="10"
                          >
                            {{ $t('Cancellation Rights') }}
                          </VCol>
                        </VRow>
                      </VListItem>
                    </template>
                  </VListGroup>
                </VListGroup>

                <VListGroup value="DeliveryNote">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxDeliveryNote" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Delivery Note') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                  <VListGroup value="checkboxApprovalRights">
                    <template #activator="{ props }">
                      <VListItem v-bind="props">
                        <VRow>
                          <VCol cols="1">
                            <VCheckbox v-model="checkboxApprovalRights" />
                          </VCol>
                          <VCol
                            class="d-flex align-center justify-start"
                            cols="10"
                          >
                            {{ $t('Approval Rights') }}
                          </VCol>
                        </VRow>
                      </VListItem>
                    </template>
                  </VListGroup>
                  <VListGroup value="checkboxCancellationRights">
                    <template #activator="{ props }">
                      <VListItem v-bind="props">
                        <VRow>
                          <VCol cols="1">
                            <VCheckbox v-model="checkboxCancellationRights" />
                          </VCol>
                          <VCol
                            class="d-flex align-center justify-start"
                            cols="10"
                          >
                            {{ $t('Cancellation Rights') }}
                          </VCol>
                        </VRow>
                      </VListItem>
                    </template>
                  </VListGroup>
                </VListGroup>

                <VListGroup value="StockTransfer">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxStockTransfer" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Stock Transfer') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                  <VListGroup value="checkboxConfirmationRights">
                    <template #activator="{ props }">
                      <VListItem v-bind="props">
                        <VRow>
                          <VCol cols="1">
                            <VCheckbox v-model="checkboxcheckboxConfirmationRights" />
                          </VCol>
                          <VCol
                            class="d-flex align-center justify-start"
                            cols="10"
                          >
                            {{ $t('Confirmation Rights') }}
                          </VCol>
                        </VRow>
                      </VListItem>
                    </template>
                  </VListGroup>
                </VListGroup>

                <VListGroup value="CheckStock ">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxCheckStock" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Check Stock') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>

                <VListGroup value="UnitBreakdown">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxUnitBreakdown" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Unit Breakdown') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>

                <VListGroup value="Adjust">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxCountingAdjustment" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Adjust') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                  <VListGroup value="checkboxApprovalRights">
                    <template #activator="{ props }">
                      <VListItem v-bind="props">
                        <VRow>
                          <VCol cols="1">
                            <VCheckbox v-model="checkboxApprovalRights" />
                          </VCol>
                          <VCol
                            class="d-flex align-center justify-start"
                            cols="10"
                          >
                            {{ $t('Approval Rights') }}
                          </VCol>
                        </VRow>
                      </VListItem>
                    </template>
                  </VListGroup>
                  <VListGroup value="checkboxRightToCloseStock">
                    <template #activator="{ props }">
                      <VListItem v-bind="props">
                        <VRow>
                          <VCol cols="1">
                            <VCheckbox v-model="checkboxRightToCloseStock" />
                          </VCol>
                          <VCol
                            class="d-flex align-center justify-start"
                            cols="10"
                          >
                            {{ $t('Right To Close Stock') }}
                          </VCol>
                        </VRow>
                      </VListItem>
                    </template>
                  </VListGroup>
                </VListGroup>
              </VList>
            </VCardText>
          </VCard>
        </VCol>
        <!-- Report -->
        <VCol
          cols="12"
          lg="3"
        >
          <VCard>
            <VCardTitle>
              <VSwitch
                v-model="switchReportData"
                :label="$t('Report')"
              />
            </VCardTitle>
            <VCardText class="py-0">
              <VList v-model:opened="systemData">
                <VListGroup value="PO Report">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxPOReport" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('PO Report') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
                <VListGroup value="Product Receipt Report">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxProductReceiptReport" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Product Receipt Report') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
                <VListGroup value="Disbursement Report">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxDisbursementReport" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Disbursement Report') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
                <VListGroup value="Arrange Products / Disbursement Report">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxArrangeProductsDisbursementReport" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Arrange Products / Disbursement Report') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
                <VListGroup value="Inventory Audit Report / Received Report">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxInventoryAuditReportReceivedReport" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Inventory Audit Report / Received Report') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
                <VListGroup value="Stock Transfer Report">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxStockTransferReport" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Stock Transfer Report') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
                <VListGroup value="Report On Product Returns from Production Order">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxReportOnProductReturnsFromProductionOrder" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Report On Product Returns from Production Order') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
                <VListGroup value="Delivery Note">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxReportDeliveryNote" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Report Delivery Note') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
                <VListGroup value="Production Goods Receipt Report">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxProductionGoodsReceiptReport" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Production Goods Receipt Report') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
                <VListGroup value="Non-Moving Inventory Items">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxNonMovingInventoryItems" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Non-Moving Inventory Items') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
                <VListGroup value="Report On Safety Stock">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxReportOnSafetyStock" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Report On Safety Stock') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
                <VListGroup value="Product And Raw Material Report">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxProductAndRawMaterialReport" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Product And Raw Material Report') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
                <VListGroup value="Inventory Lot Report">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxInventoryLotReport" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Inventory Lot Report') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
                <VListGroup value="Product Summary Report">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxProductSummaryReport" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Product Summary Report') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
              </VList>
            </VCardText>
          </VCard>
        </VCol>
        <!-- Import Data/Information -->
        <VCol
          cols="12"
          lg="3"
        >
          <VCard>
            <VCardTitle>
              <VSwitch
                v-model="switchImportDataInformationData"
                :label="$t('Import Data/Information')"
              />
            </VCardTitle>
            <VCardText class="py-0">
              <VList v-model:opened="systemData">
                <VListGroup  value="Import Product">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxImportProduct" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Import Product') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
                <VListGroup value="Import Purchase Order">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxImportPurchaseOrder" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Import Purchase Order') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
                <VListGroup  value="Import Warehouse Withdrawal Data">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxImportWarehouseWithdrawalData" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Import Warehouse Withdrawal Data') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
                <VListGroup value="Import Delivery Withdrawal Data">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxImportDeliveryWithdrawalData" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Import Delivery Withdrawal Data') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
              </VList>
            </VCardText>
          </VCard>
        </VCol>
        <!-- Security Administration -->
        <VCol
          cols="12"
          lg="3"
        >
          <VCard>
            <VCardTitle>
              <VSwitch
                v-model="switchSecurityAdministrationData"
                :label="$t('Security Administration')"
              />
            </VCardTitle>
            <VCardText class="py-0">
              <VList v-model:opened="systemData">
                <VListGroup value="Set User">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxSetUser" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Set User') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
                <VListGroup value="Set User Permission Menu">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxSetUserPermissionMenu" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Set User Permission Menu') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
                <VListGroup value="Set User Group Based On Permission">
                  <template #activator="{ props }">
                    <VListItem class="py-0" v-bind="props">
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxSetUserGroupBasedOnPermission" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Set User Group Based On Permission') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
              </VList>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </section>
  </div>
</template>
