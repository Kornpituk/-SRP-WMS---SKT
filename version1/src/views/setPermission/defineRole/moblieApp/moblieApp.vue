<script setup>
const MAX = ref(123)

//-------------------- model switch ------------------------------
const switchAllMenu = ref(false)

const switchRegister = ref(false)
const switchCheckTag = ref(false)
const switchReceiveGoods = ref(false)
const switchPickingGoods = ref(false)
const switchIssueGoods = ref(false)
const switchMovedGoods = ref(false)
const switchCountingStock = ref(false)
const switchProductSearch = ref(false)
const switchBulkBreaking = ref(false)

//-------------------- Check Box --------------------------------
//-------------------- switchRegister --------------------------
const checkboxCreate = ref(false)
const checkboxClearTag = ref(false)

//-------------------- check box right ----------------------------------
const checkboxcheckboxConfirmationRights = ref(false) //---------------- ********
const checkboxApprovalRights = ref(false) //------------------------ ****
const checkboxCancellationRights = ref(false) //------------------------ ****
const checkboxRightToCloseStock = ref(false) //------------------------ ****

const checkboxRightToClosePO = ref(false)

const checkboxCancelOutstandingPurchaseOrderPO = ref(false) //------------------------ ****
const checkboxPurchaseOrderAuthorization = ref(false) //-------------------- ********

const checkboxSingle = ref(false) //------------------------ ****
const checkboxMulti = ref(false) //-------------------- ********

//-------------------- switchCheckTag --------------------------

//-------------------- switchReceiveGoods --------------------------
const checkboxByPO = ref(false)
const checkboxOther = ref(false)
const checkboxTransferIn = ref(false)

//-------------------- switchPickingGoods --------------------------
const checkboxSeleOrder = ref(false)
const checkboxTansferOut = ref(false)

//-------------------- switchIssueGoods --------------------------
const checkboxSeleOrderIssueGoods = ref(false)
const checkboxTansferOutIssueGoods = ref(false)
const checkbox3Party = ref(false)
const checkboxDetached = ref(false)

//-------------------- switchMovedGoods --------------------------
const checkboxScanRFID = ref(false)
const checkboxAllItem = ref(false)
const checkboxByItem = ref(false)

//-------------------- switchCountingStock --------------------------
const checkboxScanRFIDCountingStock = ref(false)
const checkboxSelectItem = ref(false)

//-------------------- switchProductSearch -------------------------

//------------------------ switchBulkBreaking -----------------------
const checkboxBarcode = ref(false)
const checkboxScanRFIDBulkBreaking = ref(false)

//---------------------- switchAll------------
watch(() => {
  if(switchAllMenu.value) {
    switchRegister.value = true
    switchCheckTag.value = true
    switchReceiveGoods.value = true
    switchPickingGoods.value = true
    switchIssueGoods.value = true
    switchMovedGoods.value = true
    switchCountingStock.value = true
    switchProductSearch.value = true
    switchBulkBreaking.value = true
  
  } else if(!switchAllMenu.value) {
    switchRegister.value = false
    switchCheckTag.value = false
    switchReceiveGoods.value = false
    switchPickingGoods.value = false
    switchIssueGoods.value = false
    switchMovedGoods.value = false
    switchCountingStock.value = false
    switchProductSearch.value = false
    switchBulkBreaking.value = false

  }
})

//---------------------- switchRegister
watch(() => {
  if(switchRegister.value) {
  } else if(!switchAllMenu.value) {
    console.log('asdas')
  }
})

//---------------------- switchCheckTag
watch(() => {
  if(switchCheckTag.value) {
    checkboxCreate.value = true
    checkboxClearTag.value = true
  } else if(!switchCheckTag.value) {
    checkboxCreate.value = false
    checkboxClearTag.value = false
  }
})

//---------------------- switchReceiveGoods
watch(() => {
  
  if(switchReceiveGoods.value) {
    checkboxByPO.value = true
    checkboxOther.value = true
    checkboxTransferIn.value = true
  } else if(!switchReceiveGoods.value) {
    checkboxByPO.value = false
    checkboxOther.value = false
    checkboxTransferIn.value = false
  }

})

//---------------------- switchPickingGoods
watch(() => {

  if(switchPickingGoods.value) {
    checkboxSeleOrder.value = true
    checkboxTansferOut.value = true
  } else if(!switchPickingGoods.value) {
    checkboxSeleOrder.value = false
    checkboxTansferOut.value = false
  }

})

//---------------------- switchIssueGoods
watch(() => {
  if(switchIssueGoods.value) {
    checkboxSeleOrderIssueGoods.value = true
    checkboxTansferOutIssueGoods.value = true
    checkbox3Party.value = true
    checkboxDetached.value = true
  } else if(!switchIssueGoods.value) {
    checkboxSeleOrderIssueGoods.value = false
    checkboxTansferOutIssueGoods.value = false
    checkbox3Party.value = false
    checkboxDetached.value = false
  }
})

//---------------------- switchMovedGoods
watch(() => {
  if(switchMovedGoods.value) {
    checkboxScanRFID.value = true
    checkboxAllItem.value = true
    checkboxByItem.value = true
  } else if(!switchMovedGoods.value) {
    checkboxScanRFID.value = false
    checkboxAllItem.value = false
    checkboxByItem.value = false
  }
})

//---------------------- switchCountingStock
watch(() => {

  if(switchCountingStock.value) {
    checkboxScanRFIDCountingStock.value = true
    checkboxSelectItem.value = true
  } else if(!switchCountingStock.value) {
    checkboxScanRFIDCountingStock.value = false
    checkboxSelectItem.value = false
  }
})

//---------------------- switchBulkBreaking
watch(() => {

  if(switchBulkBreaking.value) {
    checkboxBarcode.value = true
    checkboxScanRFIDBulkBreaking.value = true
  } else if(!switchBulkBreaking.value) {
    checkboxBarcode.value = false
    checkboxScanRFIDBulkBreaking.value = false
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
          {{ $t("Set Permissions / Define Roles / Moblie App") }}
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
              color="grey"
              variant="outlined"
              :to="{ name: 'setPermission-defineRole-winApp-winApp' }"
            >
              <template #prepend>
                <VIcon
                  size="30"
                  color="grey"
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
              style="width: 100%;"
              prepend-icon="mdi-apps"
              :to="{ name: 'setPermission-defineRole-moblieApp-moblieApp' }"
            >
              <template #prepend>
                <VIcon size="30" />
              </template>

              {{ $t('Moblie App Menu') }}
            </VBtn>
          </VCol>
        </VRow>
      </VCol>
      <VCol
        lg="7"
        cols="8"
      />
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
      <!-- Register / Check Tag / Receive Goods / Picking Goods -->
      <VRow
        style="margin-top: -60px;"
        class="pa-8"
      >
        <!-- System Data -->
        <VCol
          cols="12"
          lg="3"
        >
          <VCard>
            <VCardTitle>
              <VSwitch
                v-model="switchRegister"
                :label="$t('Switch Register')"
              />
            </VCardTitle>
            <VCardText class="py-0">
              <VList class="py-0">
                <VListGroup value="Checkbox Create">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxCreate" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Checkbox Create') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>

                  <VListGroup value="Single">
                    <template #activator="{ props }">
                      <VListItem v-bind="props">
                        <VRow>
                          <VCol cols="1">
                            <VCheckbox v-model="checkboxSingle" />
                          </VCol>
                          <VCol
                            class="d-flex align-center justify-start"
                            cols="10"
                          >
                            {{ $t('Single') }}
                          </VCol>
                        </VRow>
                      </VListItem>
                    </template>
                  </VListGroup>

                  <VListGroup value="checkboxMulti">
                    <template #activator="{ props }">
                      <VListItem v-bind="props">
                        <VRow>
                          <VCol cols="1">
                            <VCheckbox v-model="checkboxMulti" />
                          </VCol>
                          <VCol
                            class="d-flex align-center justify-start"
                            cols="10"
                          >
                            {{ $t('Multi') }}
                          </VCol>
                        </VRow>
                      </VListItem>
                    </template>
                  </VListGroup>
                </VListGroup>

                <VListGroup value="checkboxClearTag">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxClearTag" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Clear Tag') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
              </VList>
            </VCardText>
          </VCard>
        </VCol>
        <!-- Check Tag -->
        <VCol
          cols="12"
          lg="3"
        >
          <VCard style="height: 150px;">
            <VCardTitle>
              <VSwitch
                v-model="switchCheckTag"
                :label="$t('Check Tag')"
              />
            </VCardTitle>
          </VCard>
        </VCol>
        <!-- Receive Goods -->
        <VCol
          cols="12"
          lg="3"
        >
          <VCard>
            <VCardTitle>
              <VSwitch
                v-model="switchReceiveGoods"
                :label="$t('Receive Goods')"
              />
            </VCardTitle>
            <VCardText class="py-0">
              <VList class="py-0">
                <VListGroup value="checkboxByPO">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxByPO" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('By PO') }}
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

                  <VListGroup value="checkboxRightToClosePO">
                    <template #activator="{ props }">
                      <VListItem v-bind="props">
                        <VRow>
                          <VCol cols="1">
                            <VCheckbox v-model="checkboxRightToClosePO" />
                          </VCol>
                          <VCol
                            class="d-flex align-center justify-start"
                            cols="10"
                          >
                            {{ $t('Right To Close PO') }}
                          </VCol>
                        </VRow>
                      </VListItem>
                    </template>
                  </VListGroup>
                </VListGroup>

                <VListGroup value="checkboxOther">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxOther" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Other') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>

                <VListGroup value="checkboxTransferIn">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxTransferIn" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Transfer In') }}
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
                </VListGroup>
              </VList>
            </VCardText>
          </VCard>
        </VCol>
        <!-- Picking Goods -->
        <VCol
          cols="12"
          lg="3"
        >
          <VCard>
            <VCardTitle>
              <VSwitch
                v-model="switchPickingGoods"
                :label="$t('Picking Goods')"
              />
            </VCardTitle>
            <VCardText class="py-0">
              <VList class="py-0">
                <VListGroup value="checkboxSeleOrder">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxSeleOrder" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Sele Order') }}
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
                </VListGroup>

                <VListGroup value="checkboxTansferOut">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxTansferOut" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Tansfer Out') }}
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
                </VListGroup>
              </VList>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <!-- Issue Goods / Moved Goods  / Counting Stock / Product Search -->
      <VRow
        style="margin-top: -60px;"
        class="pa-8"
      >
        <!-- Issue Goods -->
        <VCol
          cols="12"
          lg="3"
        >
          <VCard>
            <VCardTitle>
              <VSwitch
                v-model="switchIssueGoods"
                :label="$t('Issue Goods')"
              />
            </VCardTitle>
            <VCardText class="py-0">
              <VList class="py-0">
                <VListGroup value="checkboxSeleOrderIssueGoods">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxSeleOrderIssueGoods" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Sele Order Issue Goods') }}
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

                <VListGroup value="checkboxTansferOutIssueGoods">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxTansferOutIssueGoods" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Tansfer Out Issue Goods') }}
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

                <VListGroup value="checkbox3Party">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkbox3Party" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('3 Party') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>

                <VListGroup value="checkboxDetached">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxDetached" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Detached') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
              </VList>
            </VCardText>
          </VCard>
        </VCol>
        <!-- Moved Goods -->
        <VCol
          cols="12"
          lg="3"
        >
          <VCard>
            <VCardTitle>
              <VSwitch
                v-model="switchMovedGoods"
                :label="$t('Moved Goods')"
              />
            </VCardTitle>
            <VCardText class="py-0">
              <VList class="py-0">
                <VListGroup value="checkboxScanRFID">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxScanRFID" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Scan RFID') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>

                <VListGroup value="checkboxAllItem">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxAllItem" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('All Item') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>

                <VListGroup value="checkboxByItem">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxByItem" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('By Item') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
              </VList>
            </VCardText>
          </VCard>
        </VCol>
        <!-- switchCountingStock -->
        <VCol
          cols="12"
          lg="3"
        >
          <VCard>
            <VCardTitle>
              <VSwitch
                v-model="switchCountingStock"
                :label="$t('Counting Stock')"
              />
            </VCardTitle>
            <VCardText class="py-0">
              <VList class="py-0">
                <VListGroup value="checkboxScanRFIDCountingStock">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxScanRFIDCountingStock" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Scan RFID Counting Stock') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>

                <VListGroup value="checkboxSelectItem">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxSelectItem" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Select Item') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>
              </VList>
            </VCardText>
          </VCard>
        </VCol>
        <!-- switchProductSearch -->
        <VCol
          cols="12"
          lg="3"
        >
          <VCard style="height: 150px;">
            <VCardTitle>
              <VSwitch
                v-model="switchProductSearch"
                :label="$t('Product Search')"
              />
            </VCardTitle>
          </VCard>
        </VCol>
      </VRow>

      <!-- switchBulkBreaking -->
      <VRow
        style="margin-top: -60px;"
        class="pa-8"
      >
        <!-- switchBulkBreaking -->
        <VCol
          cols="12"
          lg="3"
        >
          <VCard>
            <VCardTitle>
              <VSwitch
                v-model="switchBulkBreaking"
                :label="$t('Bulk Breaking')"
              />
            </VCardTitle>
            <VCardText class="py-0">
              <VList class="py-0">
                <VListGroup value="checkboxBarcode">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxBarcode" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('Barcode') }}
                        </VCol>
                      </VRow>
                    </VListItem>
                  </template>
                </VListGroup>

                <VListGroup value="checkboxScanRFIDBulkBreaking">
                  <template #activator="{ props }">
                    <VListItem
                      class="py-0"
                      v-bind="props"
                    >
                      <VRow>
                        <VCol cols="1">
                          <VCheckbox v-model="checkboxScanRFIDBulkBreaking" />
                        </VCol>
                        <VCol
                          class="d-flex align-center justify-start"
                          cols="10"
                        >
                          {{ $t('checkboxScanRFIDBulkBreaking') }}
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
