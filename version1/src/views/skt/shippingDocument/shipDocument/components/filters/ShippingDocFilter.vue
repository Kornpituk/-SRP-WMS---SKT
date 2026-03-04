<template>
  <VCardText class="pb-2">
    <VRow dense>
      <!-- Row 1 -->
      <VCol
        cols="12"
        sm="4"
      >
        <VSelect
          v-model="local.status"
          :items="statusOptions"
          :disabled="statusFilterDisabled"
          label="Select Status"
          density="compact"
          variant="outlined"
          hide-details
          clearable
        />
      </VCol>

      <VCol
        cols="12"
        sm="4"
      >
        <VTextField
          v-model="local.invoiceInSAP"
          label="Invoice In SAP"
          density="compact"
          variant="outlined"
          hide-details
          clearable
          @keyup.enter="$emit('search')"
        />
      </VCol>

      <VCol
        cols="12"
        sm="4"
      >
        <VTextField
          v-model="local.invoice"
          label="Invoice"
          density="compact"
          variant="outlined"
          hide-details
          clearable
          @keyup.enter="$emit('search')"
        />
      </VCol>

      <!-- Row 2 -->
      <VCol
        cols="12"
        sm="4"
      >
        <VTextField
          v-model="local.payerName"
          label="Payer Name"
          density="compact"
          variant="outlined"
          hide-details
          clearable
          @keyup.enter="$emit('search')"
        />
      </VCol>

      <VCol
        cols="12"
        sm="4"
      >
        <VTextField
          v-model="local.consignee"
          label="Consignee"
          density="compact"
          variant="outlined"
          hide-details
          clearable
          @keyup.enter="$emit('search')"
        />
      </VCol>

      <VCol
        cols="12"
        sm="4"
      >
        <VTextField
          v-model="local.item"
          label="Item"
          density="compact"
          variant="outlined"
          hide-details
          clearable
          @keyup.enter="$emit('search')"
        />
      </VCol>

      <!-- Row 3 -->
      <VCol
        cols="12"
        sm="4"
      >
        <VSelect
          v-model="local.shippingMode"
          :items="shippingModeOptions"
          label="Shipping Mode"
          density="compact"
          variant="outlined"
          hide-details
          clearable
        />
      </VCol>

      <VCol
        cols="12"
        sm="4"
      >
        <VTextField
          v-model="local.etdRange"
          label="ETD dd/mm/yyyy - dd/mm/yyyy"
          density="compact"
          variant="outlined"
          hide-details
          clearable
          prepend-inner-icon="mdi-calendar-range"
        />
      </VCol>

      <!-- Action buttons -->
      <VCol
        cols="12"
        sm="4"
        class="d-flex align-center gap-2"
      >
        <VBtn
          color="primary"
          prepend-icon="mdi-magnify"
          @click="$emit('search')"
        >
          Search
        </VBtn>
        <VBtn
          color="error"
          prepend-icon="mdi-close"
          @click="$emit('clear')"
        >
          Clear
        </VBtn>
        <VBtn
          color="amber"
          style="color: #fff !important;"
          prepend-icon="mdi-microsoft-excel"
          @click="$emit('export')"
        >
          Export
        </VBtn>
      </VCol>
    </VRow>
  </VCardText>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { STATUS_OPTIONS, SHIPPING_MODE_OPTIONS } from '../../constants/shippingDocument.constants'

// ─── Props & Emits ────────────────────────────────────────────
const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
  statusFilterDisabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:filters', 'search', 'clear', 'export'])

// ─── Local copy (ไม่ mutate prop โดยตรง) ─────────────────────
/**
 * สร้าง reactive copy จาก prop
 * v-model ทุกตัวผูกกับ local แทน props.filters
 */
const local = reactive({ ...props.filters })

/**
 * Sync ขึ้น parent ทุกครั้งที่ user แก้ไข field ใด ๆ
 * ใช้ spread เพื่อส่ง plain object ไม่ใช่ reactive ref
 */
watch(local, newVal => {
  emit('update:filters', { ...newVal })
})

/**
 * Sync ลงมาจาก parent (กรณี parent reset filters จาก handleClear)
 * deep: true เพราะ filters เป็น object
 */
watch(
  () => props.filters,
  newVal => Object.assign(local, newVal),
  { deep: true },
)

// ─── Options ──────────────────────────────────────────────────
const statusOptions       = STATUS_OPTIONS
const shippingModeOptions = SHIPPING_MODE_OPTIONS
</script>
