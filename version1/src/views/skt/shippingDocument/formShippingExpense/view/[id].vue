<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useShippingDocumentStore } from '../stores/shippingDocumentStore'
import { useTabForm }             from '../composables/useTabForm'
import { usePermissions }         from '../composables/usePermissions'
import { TabKey }                 from '../types/shipDocument'
import DocumentHeader from "@/views/skt/shippingDocument/form/components/shared/DocumentHeader.vue"
import GenericFilterBar from "@/views/skt/components/filterBar/Genericfilterbar.vue"
import { useRouter } from 'vue-router'
import { mockFtaFormOptions, mockShippingModeOptions } from '../mock/mockData'

// ─── Store ────────────────────────────────────────────────────────────────────
const store = useShippingDocumentStore()
const router = useRouter()
const { document: doc, masterData } = storeToRefs(store)

// ─── Permissions & Status Logic ───────────────────────────────────────────────
const { canEdit } = usePermissions(TabKey.SHIPPING_EXPENSE)

// เช็ค Status จากเอกสาร: Completed, Void จะเป็น Read-only เท่านั้น
const isEditable = computed(() => {
  const currentStatus = doc.value?.status?.toLowerCase() || ''
  const readonlyStatuses = ['completed', 'void']
  
  return canEdit.value && !readonlyStatuses.includes(currentStatus)
})

// ─── Tab Form — single mutation path ─────────────────────────────────────────
const {
  formData,
  errors,
  isSaving,
  isConfirming,
  handleUpdate,
  handleSave,
  handleConfirm,
} = useTabForm(TabKey.SHIPPING_EXPENSE)

// ─── Master data dropdowns ────────────────────────────────────────────────────
const salePersonOptions = computed(() => masterData.value?.salePersons ?? [])
const forwarderOptions  = computed(() => masterData.value?.forwarders  ?? [])
const courierOptions    = computed(() => masterData.value?.couriers    ?? [])
const truckingOptions   = computed(() => masterData.value?.truckings   ?? [])

// ─── Document header rows (read-only from store.document) ─────────────────────
const leftInfo = computed(() => [
  { label: 'Invoice in SAP',  value: doc.value?.invoiceInSap  },
  { label: 'Payer Name',      value: doc.value?.payerName     },
  { label: 'Item',            value: doc.value?.item          },
  { label: 'Term Of Pricing', value: doc.value?.termOfPricing },
  { label: 'ETD',             value: doc.value?.etd           },
])

const rightInfo = computed(() => [
  { label: 'Invoice',       value: doc.value?.invoice      },
  { label: 'Consignee',     value: doc.value?.consignee    },
  { label: 'Qty',           value: doc.value?.qty          },
  { label: 'Shipping Mode', value: doc.value?.shippingMode },
  { label: 'Destination',   value: doc.value?.destination  },
])

// ─── Derived totals — computed only, never written to store ───────────────────
const total = computed(() => {
  const fd = formData.value
  if (!fd) return 0

  return [
    fd.forwarder?.price,
    fd.customsOverTime?.price,
    fd.courier?.price,
    fd.trucking?.price,
    fd.storage?.price,
    fd.insurance?.price,
    fd.ftaForm?.price,
    fd.shipping?.price,
    fd.other?.price,
  ].reduce((sum, p) => sum + (Number(p) || 0), 0)
})

const costPerUnit = computed(() => {
  const qty = parseFloat(
    String(doc.value?.qty ?? '').replace(/[^\d.]/g, ''),
  )

  return qty > 0 ? total.value / qty : 0
})

// เพื่อโชว์ placeholder "Sum Price" หากค่าเป็น 0
const totalDisplay = computed(() => total.value > 0 ? total.value.toFixed(2) : '')
const costPerUnitDisplay = computed(() => costPerUnit.value > 0 ? costPerUnit.value.toFixed(2) : '')

// ─── Format helpers ───────────────────────────────────────────────────────────
const fmtNum = v => {
  const n = Number(v)
  
  return v != null && v !== '' && !isNaN(n)
    ? n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '-'
}

const fmtStr = v => v?.toString().trim() || '-'

// ─── Sub-field update ─────────────────────────────────────────────────────────
const updateSubField = (field, subKey, value) => {
  handleUpdate(field, {
    ...(formData.value?.[field] ?? {}),
    [subKey]: value,
  })
}

const handleBack = () => {
  router.back()
}

const toPrice = val => (val !== '' && val != null ? Number(val) : null)
</script>

<template>
  <div class="tab-container">
    <div
      v-if="store.isLoading"
      class="d-flex justify-center align-center pa-16"
    >
      <VProgressCircular
        indeterminate
        color="primary"
        size="48"
      />
    </div>

    <VAlert
      v-else-if="store.fetchError"
      type="error"
      variant="tonal"
      class="ma-4"
    >
      {{ store.fetchError }}
      <template #append>
        <VBtn
          variant="text"
          @click="store.retry"
        >
          Retry
        </VBtn>
      </template>
    </VAlert>

    <div v-else>
      <!-- <DocumentHeader @close="goBackToList" /> -->

      <!--
        ── GenericFilterBar ใช้แทน DocumentHeader ──────────────────────
        :show-actions="false"  → ซ่อน filter body + Search/Reset/Export
        :filter-config="[]"    → ไม่มี field ใดเลย
        #actions slot          → ใส่ปุ่ม Back + Save Draft / Confirm
      -->

      <GenericFilterBar
        title="Ship Document"
        @back="handleBack"
      />

      
      
      <div
        v-if="isEditable"
        class="d-flex gap-3 my-5" 
      >
        <VBtn
          color="warning"
          variant="flat"
          min-width="130"
          :loading="isSaving"
          :disabled="isConfirming"
          @click="handleSave"
        >
          SAVE DRAFT
        </VBtn>

        <VBtn
          color="success"
          variant="flat"
          min-width="130"
          :loading="isConfirming"
          :disabled="isSaving"
          @click="handleConfirm"
        >
          CONFIRM
        </VBtn>
      </div>
      <div
        v-else
        class="my-5"
      /> 

      <VCard
        class="mb-4"
        rounded="lg"
      >
        <VCardText class="pa-5">
          <VRow no-gutters>
            <VCol
              cols="6"
              class="p-4"
            >
              <div
                v-for="item in leftInfo"
                :key="item.label"
                class="d-flex align-center mb-2"
              >
                <span
                  class="info-label text-subtitle-2 font-weight-bold"
                  style="width: 140px;"
                >{{ item.label }} :</span>
                <span class="info-value">{{ item.value || '-' }}</span>
              </div>
            </VCol>

            <VCol
              cols="6"
              class="p-4"
            >
              <div
                v-for="item in rightInfo"
                :key="item.label"
                class="d-flex align-center mb-2"
              >
                <span
                  class="info-label text-subtitle-2 font-weight-bold"
                  style="width: 140px;"
                >{{ item.label }} :</span>
                <span class="info-value">{{ item.value || '-' }}</span>
              </div>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>

      <VCard rounded="lg">
        <VCardText class="pa-6">
          <VRow>
            <VCol
              cols="6"
              class="p-6"
            >
              <div class="expense-row">
                <span class="exp-label">Sale Person :</span>
                <div class="exp-full-width">
                  <VSelect
                    v-if="isEditable"
                    :model-value="formData?.salePerson"
                    :items="salePersonOptions"
                    placeholder="Select and Enter Sale Person"
                    :error-messages="errors?.salePerson"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    @update:model-value="val => handleUpdate('salePerson', val)"
                  />
                  <span
                    v-else
                    class="read-only-text"
                  >{{ fmtStr(formData?.salePerson) }}</span>
                </div>
              </div>

              <div class="expense-row">
                <span class="exp-label">Forwarder :</span>
                <div class="exp-vendor">
                  <VSelect
                    v-if="isEditable"
                    :model-value="formData?.forwarder?.vendor"
                    :items="forwarderOptions"
                    placeholder="Select Forwarder"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    clearable
                    @update:model-value="val => updateSubField('forwarder', 'vendor', val)"
                  />
                  <span
                    v-else
                    class="read-only-text"
                  >{{ fmtStr(formData?.forwarder?.vendor) }}</span>
                </div>
                <div class="exp-price">
                  <VTextField
                    v-if="isEditable"
                    :model-value="formData?.forwarder?.price"
                    type="number"
                    placeholder="Enter Price"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    @update:model-value="val => updateSubField('forwarder', 'price', toPrice(val))"
                  />
                  <span
                    v-else
                    class="read-only-text"
                  >{{ fmtNum(formData?.forwarder?.price) }}</span>
                </div>
                <span
                  v-if="isEditable || formData?.forwarder?.price"
                  class="exp-unit"
                >Baht</span>
              </div>

              <div class="expense-row">
                <span class="exp-label">Customs Over Time :</span>
                <div class="exp-vendor" />
                <div class="exp-price">
                  <VTextField
                    v-if="isEditable"
                    :model-value="formData?.customsOverTime?.price"
                    type="number"
                    placeholder="Enter Price"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    @update:model-value="val => updateSubField('customsOverTime', 'price', toPrice(val))"
                  />
                  <span
                    v-else
                    class="read-only-text"
                  >{{ fmtNum(formData?.customsOverTime?.price) }}</span>
                </div>
                <span
                  v-if="isEditable || formData?.customsOverTime?.price"
                  class="exp-unit"
                >Baht</span>
              </div>

              <div class="expense-row">
                <span class="exp-label">Courier :</span>
                <div class="exp-vendor">
                  <VSelect
                    v-if="isEditable"
                    :model-value="formData?.courier?.vendor"
                    :items="courierOptions"
                    placeholder="Select Courier"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    clearable
                    @update:model-value="val => updateSubField('courier', 'vendor', val)"
                  />
                  <span
                    v-else
                    class="read-only-text"
                  >{{ fmtStr(formData?.courier?.vendor) }}</span>
                </div>
                <div class="exp-price">
                  <VTextField
                    v-if="isEditable"
                    :model-value="formData?.courier?.price"
                    type="number"
                    placeholder="Enter Price"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    @update:model-value="val => updateSubField('courier', 'price', toPrice(val))"
                  />
                  <span
                    v-else
                    class="read-only-text"
                  >{{ fmtNum(formData?.courier?.price) }}</span>
                </div>
                <span
                  v-if="isEditable || formData?.courier?.price"
                  class="exp-unit"
                >Baht</span>
              </div>

              <div class="expense-row">
                <span class="exp-label">Trucking :</span>
                <div class="exp-vendor">
                  <VSelect
                    v-if="isEditable"
                    :model-value="formData?.trucking?.vendor"
                    :items="truckingOptions"
                    placeholder="Select Trucking"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    clearable
                    @update:model-value="val => updateSubField('trucking', 'vendor', val)"
                  />
                  <span
                    v-else
                    class="read-only-text"
                  >{{ fmtStr(formData?.trucking?.vendor) }}</span>
                </div>
                <div class="exp-price">
                  <VTextField
                    v-if="isEditable"
                    :model-value="formData?.trucking?.price"
                    type="number"
                    placeholder="Enter Price"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    @update:model-value="val => updateSubField('trucking', 'price', toPrice(val))"
                  />
                  <span
                    v-else
                    class="read-only-text"
                  >{{ fmtNum(formData?.trucking?.price) }}</span>
                </div>
                <span
                  v-if="isEditable || formData?.trucking?.price"
                  class="exp-unit"
                >Baht</span>
              </div>

              <div class="expense-row">
                <span class="exp-label">Storage :</span>
                <div class="exp-vendor">
                  <VTextField
                    v-if="isEditable"
                    :model-value="formData?.storage?.vendor"
                    placeholder="Enter Storage"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    @update:model-value="val => updateSubField('storage', 'vendor', val)"
                  />
                  <span
                    v-else
                    class="read-only-text"
                  >{{ fmtStr(formData?.storage?.vendor) }}</span>
                </div>
                <div class="exp-price">
                  <VTextField
                    v-if="isEditable"
                    :model-value="formData?.storage?.price"
                    type="number"
                    placeholder="Enter Price"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    @update:model-value="val => updateSubField('storage', 'price', toPrice(val))"
                  />
                  <span
                    v-else
                    class="read-only-text"
                  >{{ fmtNum(formData?.storage?.price) }}</span>
                </div>
                <span
                  v-if="isEditable || formData?.storage?.price"
                  class="exp-unit"
                >Baht</span>
              </div>
              <div class="expense-row">
                <span class="exp-label">Storage :</span>
                <div class="exp-vendor" />
                <div class="exp-price">
                  <span class="text-caption text-grey-darken-5">นำค่าใช้จ่ายรวม หารด้วย Qty.</span>
                </div>
              </div>
            </VCol>

            <VCol
              cols="6"
              class="p-6"
            >
              <div class="expense-row">
                <span class="exp-label">Insurance :</span>
                <div class="exp-vendor">
                  <VTextField
                    v-if="isEditable"
                    :model-value="formData?.insurance?.vendor"
                    placeholder="Enter Insurance"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    @update:model-value="val => updateSubField('insurance', 'vendor', val)"
                  />
                  <span
                    v-else
                    class="read-only-text"
                  >{{ fmtStr(formData?.insurance?.vendor) }}</span>
                </div>
                <div class="exp-price">
                  <VTextField
                    v-if="isEditable"
                    :model-value="formData?.insurance?.price"
                    type="number"
                    placeholder="Enter Price"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    @update:model-value="val => updateSubField('insurance', 'price', toPrice(val))"
                  />
                  <span
                    v-else
                    class="read-only-text"
                  >{{ fmtNum(formData?.insurance?.price) }}</span>
                </div>
                <span
                  v-if="isEditable || formData?.insurance?.price"
                  class="exp-unit"
                >Baht</span>
              </div>

              <div class="expense-row">
                <span class="exp-label">FTA Form :</span>
                <div class="exp-vendor">
                  <VSelect
                    v-if="isEditable"
                    :model-value="formData?.ftaForm?.vendor"
                    :items="mockFtaFormOptions"
                    placeholder="Select FTA Form"
                    density="compact"
                    item-title="label"
                    item-value="value"
                    variant="outlined"
                    hide-details="auto"
                    clearable
                    @update:model-value="val => updateSubField('ftaForm', 'vendor', val)"
                  />
                  <span
                    v-else
                    class="read-only-text"
                  >{{ fmtStr(formData?.ftaForm?.vendor) }}</span>
                </div>
                <div class="exp-price">
                  <VTextField
                    v-if="isEditable"
                    :model-value="formData?.ftaForm?.price"
                    type="number"
                    placeholder="Enter Price"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    @update:model-value="val => updateSubField('ftaForm', 'price', toPrice(val))"
                  />
                  <span
                    v-else
                    class="read-only-text"
                  >{{ fmtNum(formData?.ftaForm?.price) }}</span>
                </div>
                <span
                  v-if="isEditable || formData?.ftaForm?.price"
                  class="exp-unit"
                >Baht</span>
              </div>

              <div class="expense-row">
                <span class="exp-label">Shipping :</span>
                <div class="exp-vendor">
                  <VSelect
                    v-if="isEditable"
                    :model-value="formData?.shipping?.vendor"
                    :items="mockShippingModeOptions"
                    item-title="label"
                    item-value="value"
                    placeholder="Select Shipping"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    clearable
                    @update:model-value="val => updateSubField('shipping', 'vendor', val)"
                  />
                  <span
                    v-else
                    class="read-only-text"
                  >{{ fmtStr(formData?.shipping?.vendor) }}</span>
                </div>
                <div class="exp-price">
                  <VTextField
                    v-if="isEditable"
                    :model-value="formData?.shipping?.price"
                    type="number"
                    placeholder="Enter Price"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    @update:model-value="val => updateSubField('shipping', 'price', toPrice(val))"
                  />
                  <span
                    v-else
                    class="read-only-text"
                  >{{ fmtNum(formData?.shipping?.price) }}</span>
                </div>
                <span
                  v-if="isEditable || formData?.shipping?.price"
                  class="exp-unit"
                >Baht</span>
              </div>

              <div class="expense-row">
                <span class="exp-label">Other :</span>
                <div class="exp-vendor">
                  <VTextField
                    v-if="isEditable"
                    :model-value="formData?.other?.vendor"
                    placeholder="Enter Other"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    @update:model-value="val => updateSubField('other', 'vendor', val)"
                  />
                  <span
                    v-else
                    class="read-only-text"
                  >{{ fmtStr(formData?.other?.vendor) }}</span>
                </div>
                <div class="exp-price">
                  <VTextField
                    v-if="isEditable"
                    :model-value="formData?.other?.price"
                    type="number"
                    placeholder="Enter Price"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    @update:model-value="val => updateSubField('other', 'price', toPrice(val))"
                  />
                  <span
                    v-else
                    class="read-only-text"
                  >{{ fmtNum(formData?.other?.price) }}</span>
                </div>
                <span
                  v-if="isEditable || formData?.other?.price"
                  class="exp-unit"
                >Baht</span>
              </div>

              <div class="expense-row">
                <span class="exp-label">Remark :</span>
                <div class="exp-full-width">
                  <VTextField
                    v-if="isEditable"
                    :model-value="formData?.remark"
                    placeholder="Enter Remark"
                    density="compact"
                    variant="outlined"
                    hide-details="auto"
                    @update:model-value="val => handleUpdate('remark', val)"
                  />
                  <span
                    v-else
                    class="read-only-text"
                  >{{ fmtStr(formData?.remark) }}</span>
                </div>
              </div>

              <div class="my-4" />

              <div class="expense-row mb-2">
                <span class="exp-label font-weight-bold">Total :</span>
                <div class="exp-vendor" />
                <div class="exp-price">
                  <VTextField
                    v-if="isEditable"
                    :model-value="totalDisplay"
                    placeholder="Sum Price"
                    density="compact"
                    variant="outlined"
                    hide-details
                    readonly
                  />
                  <span
                    v-else
                    class="read-only-text"
                  >{{ total > 0 ? fmtNum(total) : '-' }}</span>
                </div>
                <span
                  v-if="isEditable || total > 0"
                  class="exp-unit"
                >Baht</span>
              </div>

              <div class="my-4" />

              <div class="expense-row">
                <span class="exp-label font-weight-bold">Cost Per Unit :</span>
                <div class="exp-vendor" />
                <div class="exp-price">
                  <VTextField
                    v-if="isEditable"
                    :model-value="costPerUnitDisplay"
                    placeholder="Sum Cost Per Unit"
                    density="compact"
                    variant="outlined"
                    hide-details
                    readonly
                  />
                  <span
                    v-else
                    class="read-only-text"
                  >{{ costPerUnit > 0 ? fmtNum(costPerUnit) : '-' }}</span>
                </div>
                <span
                  v-if="isEditable || costPerUnit > 0"
                  class="exp-unit"
                >Baht</span>
              </div>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style src="../view/styles/tab.scss" lang="scss" />


