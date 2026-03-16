<!--
  ShippingExpenseTab.vue
  ─ ใช้ useShipDocumentStore ตาม pattern เดิมของโปรเจกต์
  ─ Import TabKey จาก ../types/shipDocument
  ─ Style ใช้ shared [id].scss ตามที่ tab อื่นทำ
-->
<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useShippingDocumentStore  } from '../stores/shippingDocumentStore'
import { useTabForm }             from '../composables/useTabForm'
import { usePermissions }         from '../composables/usePermissions'
import { TabKey }                 from '../types/shipDocument'

// ─── Store ────────────────────────────────────────────────────────────────────
const store = useShippingDocumentStore ()
const { document: doc, masterData } = storeToRefs(store)

// ─── Permissions — computed จาก documentStatus + tabStatus ────────────────────
const { canEdit } = usePermissions(TabKey.SHIPPING_EXPENSE)

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

// ─── Format helpers ───────────────────────────────────────────────────────────
const fmtNum = v => {
  const n = Number(v)

  return v != null && !isNaN(n)
    ? n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '-'
}

const fmtStr = v => v?.toString().trim() || '-'

// ─── Sub-field update — spread + new ref สำหรับ Pinia reactivity ──────────────
const updateSubField = (field, subKey, value) => {
  handleUpdate(field, {
    ...(formData.value?.[field] ?? {}),
    [subKey]: value,
  })
}

const toPrice = val => (val !== '' && val != null ? Number(val) : null)
</script>

<!-- ─────────────────────────────────────────────────────────────────────────── -->

<template>
  <div class="tab-container">
    <!-- ══ Action Buttons (DRAFT / SAVED เท่านั้น) ══════════════════════════ -->
    <DocumentHeader
      @close="goBackToList"
      @void="showVoidDialog = true"
      @approve="handleApprove"
    />
    <div
      v-if="canEdit"
      class="d-flex gap-3 mb-5"
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

    <!-- ══ Document Header Card (อ่านอย่างเดียว / ดึงจาก store.document) ══ -->
    <VCard
      class="mb-4"
      variant="outlined"
      rounded="lg"
    >
      <VCardText class="pa-5">
        <VRow no-gutters>
          <VCol cols="6">
            <div
              v-for="item in leftInfo"
              :key="item.label"
              class="info-row"
            >
              <span class="info-label">{{ item.label }} :</span>
              <span class="info-value">{{ item.value ?? '-' }}</span>
            </div>
          </VCol>

          <VCol cols="6">
            <div
              v-for="item in rightInfo"
              :key="item.label"
              class="info-row"
            >
              <span class="info-label">{{ item.label }} :</span>
              <span class="info-value">{{ item.value ?? '-' }}</span>
            </div>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- ══ Expense Detail Card ═══════════════════════════════════════════════ -->
    <VCard
      variant="outlined"
      rounded="lg"
    >
      <VCardText class="pa-5">
        <VRow no-gutters>
          <!-- ╌╌ LEFT COLUMN ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌ -->
          <VCol
            cols="6"
            class="left-col p-6"
          >
            <!-- Sale Person -->
            <div class="expense-row">
              <span class="exp-label">Sale Person :</span>
              <div class="exp-vendor exp-vendor--full">
                <VSelect
                  v-if="canEdit"
                  :model-value="formData?.salePerson"
                  :items="salePersonOptions"
                  :error-messages="errors?.salePerson"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  @update:model-value="val => handleUpdate('salePerson', val)"
                />
                <span v-else>{{ fmtStr(formData?.salePerson) }}</span>
              </div>
            </div>

            <!-- Forwarder -->
            <div class="expense-row">
              <span class="exp-label">Forwarder :</span>
              <div class="exp-vendor">
                <VSelect
                  v-if="canEdit"
                  :model-value="formData?.forwarder?.vendor"
                  :items="forwarderOptions"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  @update:model-value="val => updateSubField('forwarder', 'vendor', val)"
                />
                <span v-else>{{ fmtStr(formData?.forwarder?.vendor) }}</span>
              </div>
              <div class="exp-price">
                <VTextField
                  v-if="canEdit"
                  :model-value="formData?.forwarder?.price"
                  type="number"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  @update:model-value="val => updateSubField('forwarder', 'price', toPrice(val))"
                />
                <span
                  v-else
                  class="price-val"
                >{{ fmtNum(formData?.forwarder?.price) }}</span>
              </div>
              <span class="exp-unit">Baht</span>
            </div>

            <!-- Customs Over Time -->
            <div class="expense-row">
              <span class="exp-label">Customs Over Time :</span>
              <div class="exp-vendor" />
              <div class="exp-price">
                <VTextField
                  v-if="canEdit"
                  :model-value="formData?.customsOverTime?.price"
                  type="number"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  @update:model-value="val => updateSubField('customsOverTime', 'price', toPrice(val))"
                />
                <span
                  v-else
                  class="price-val"
                >{{ fmtNum(formData?.customsOverTime?.price) }}</span>
              </div>
              <span class="exp-unit">Baht</span>
            </div>

            <!-- Courier -->
            <div class="expense-row">
              <span class="exp-label">Courier :</span>
              <div class="exp-vendor">
                <VSelect
                  v-if="canEdit"
                  :model-value="formData?.courier?.vendor"
                  :items="courierOptions"
                  placeholder="Select Courier"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  clearable
                  @update:model-value="val => updateSubField('courier', 'vendor', val)"
                />
                <span v-else>{{ fmtStr(formData?.courier?.vendor) }}</span>
              </div>
              <div class="exp-price">
                <VTextField
                  v-if="canEdit"
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
                  class="price-val"
                >{{ fmtNum(formData?.courier?.price) }}</span>
              </div>
              <span class="exp-unit">Baht</span>
            </div>

            <!-- Trucking -->
            <div class="expense-row">
              <span class="exp-label">Trucking :</span>
              <div class="exp-vendor">
                <VSelect
                  v-if="canEdit"
                  :model-value="formData?.trucking?.vendor"
                  :items="truckingOptions"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  @update:model-value="val => updateSubField('trucking', 'vendor', val)"
                />
                <span v-else>{{ fmtStr(formData?.trucking?.vendor) }}</span>
              </div>
              <div class="exp-price">
                <VTextField
                  v-if="canEdit"
                  :model-value="formData?.trucking?.price"
                  type="number"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  @update:model-value="val => updateSubField('trucking', 'price', toPrice(val))"
                />
                <span
                  v-else
                  class="price-val"
                >{{ fmtNum(formData?.trucking?.price) }}</span>
              </div>
              <span class="exp-unit">Baht</span>
            </div>

            <!-- Storage -->
            <div class="expense-row">
              <span class="exp-label">Storage :</span>
              <div class="exp-vendor">
                <VTextField
                  v-if="canEdit"
                  :model-value="formData?.storage?.vendor"
                  placeholder="Enter Storage"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  @update:model-value="val => updateSubField('storage', 'vendor', val)"
                />
                <span v-else>{{ fmtStr(formData?.storage?.vendor) }}</span>
              </div>
              <div class="exp-price">
                <VTextField
                  v-if="canEdit"
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
                  class="price-val"
                >{{ fmtNum(formData?.storage?.price) }}</span>
              </div>
              <span class="exp-unit">Baht</span>
            </div>
          </VCol>

          <!-- ╌╌ RIGHT COLUMN ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌ -->
          <VCol
            cols="6"
            class="p-6"
          >
            <!-- Insurance -->
            <div class="expense-row">
              <span class="exp-label">Insurance :</span>
              <div class="exp-vendor">
                <VTextField
                  v-if="canEdit"
                  :model-value="formData?.insurance?.vendor"
                  placeholder="Enter Insurance"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  @update:model-value="val => updateSubField('insurance', 'vendor', val)"
                />
                <span v-else>{{ fmtStr(formData?.insurance?.vendor) }}</span>
              </div>
              <div class="exp-price">
                <VTextField
                  v-if="canEdit"
                  :model-value="formData?.insurance?.price"
                  type="number"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  @update:model-value="val => updateSubField('insurance', 'price', toPrice(val))"
                />
                <span
                  v-else
                  class="price-val"
                >{{ fmtNum(formData?.insurance?.price) }}</span>
              </div>
              <span class="exp-unit">Baht</span>
            </div>

            <!-- FTA Form -->
            <div class="expense-row">
              <span class="exp-label">FTA Form :</span>
              <div class="exp-vendor">
                <VTextField
                  v-if="canEdit"
                  :model-value="formData?.ftaForm?.vendor"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  @update:model-value="val => updateSubField('ftaForm', 'vendor', val)"
                />
                <span v-else>{{ fmtStr(formData?.ftaForm?.vendor) }}</span>
              </div>
              <div class="exp-price">
                <VTextField
                  v-if="canEdit"
                  :model-value="formData?.ftaForm?.price"
                  type="number"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  @update:model-value="val => updateSubField('ftaForm', 'price', toPrice(val))"
                />
                <span
                  v-else
                  class="price-val"
                >{{ fmtNum(formData?.ftaForm?.price) }}</span>
              </div>
              <span class="exp-unit">Baht</span>
            </div>

            <!-- Shipping -->
            <div class="expense-row">
              <span class="exp-label">Shipping :</span>
              <div class="exp-vendor">
                <VTextField
                  v-if="canEdit"
                  :model-value="formData?.shipping?.vendor"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  @update:model-value="val => updateSubField('shipping', 'vendor', val)"
                />
                <span v-else>{{ fmtStr(formData?.shipping?.vendor) }}</span>
              </div>
              <div class="exp-price">
                <VTextField
                  v-if="canEdit"
                  :model-value="formData?.shipping?.price"
                  type="number"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  @update:model-value="val => updateSubField('shipping', 'price', toPrice(val))"
                />
                <span
                  v-else
                  class="price-val"
                >{{ fmtNum(formData?.shipping?.price) }}</span>
              </div>
              <span class="exp-unit">Baht</span>
            </div>

            <!-- Other -->
            <div class="expense-row">
              <span class="exp-label">Other :</span>
              <div class="exp-vendor">
                <VTextField
                  v-if="canEdit"
                  :model-value="formData?.other?.vendor"
                  placeholder="Enter Other"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  @update:model-value="val => updateSubField('other', 'vendor', val)"
                />
                <span v-else>{{ fmtStr(formData?.other?.vendor) }}</span>
              </div>
              <div class="exp-price">
                <VTextField
                  v-if="canEdit"
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
                  class="price-val"
                >{{ fmtNum(formData?.other?.price) }}</span>
              </div>
              <span class="exp-unit">Baht</span>
            </div>

            <!-- Remark -->
            <div class="expense-row">
              <span class="exp-label">Remark :</span>
              <div class="exp-remark">
                <VTextField
                  v-if="canEdit"
                  :model-value="formData?.remark"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  @update:model-value="val => handleUpdate('remark', val)"
                />
                <span v-else>{{ fmtStr(formData?.remark) }}</span>
              </div>
            </div>

            <!-- Formula note (edit mode only) -->
            <p
              v-if="canEdit"
              class="cost-note"
            >
              นำค่าใช้จ่ายรวม หารด้วย Qty.
            </p>

            <!-- Total (computed / read-only) -->
            <div class="expense-row">
              <span class="exp-label">Total :</span>
              <div class="exp-vendor" />
              <div class="exp-price">
                <VTextField
                  v-if="canEdit"
                  :model-value="total.toFixed(2)"
                  density="compact"
                  variant="outlined"
                  hide-details
                  readonly
                  bg-color="grey-lighten-4"
                />
                <span
                  v-else
                  class="price-val price-val--bold"
                >{{ fmtNum(total) }}</span>
              </div>
              <span class="exp-unit">Baht</span>
            </div>

            <!-- Cost Per Unit (computed / read-only) -->
            <div class="expense-row">
              <span class="exp-label">Cost Per Unit :</span>
              <div class="exp-vendor" />
              <div class="exp-price">
                <VTextField
                  v-if="canEdit"
                  :model-value="costPerUnit.toFixed(2)"
                  density="compact"
                  variant="outlined"
                  hide-details
                  readonly
                  bg-color="grey-lighten-4"
                />
                <span
                  v-else
                  class="price-val"
                >{{ fmtNum(costPerUnit) }}</span>
              </div>
              <span class="exp-unit">Baht</span>
            </div>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>
</template>

<!-- shared scss เดียวกับ tab อื่น -->
<style src="../view/styles/tab.scss" lang="scss" />
