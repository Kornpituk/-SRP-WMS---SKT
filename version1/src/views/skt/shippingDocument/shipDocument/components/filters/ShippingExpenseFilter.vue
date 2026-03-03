<template>
  <VCardText class="pb-2">
    <VRow dense>
      <VCol
        cols="12"
        sm="4"
      >
        <VSelect
          v-model="local.status"
          :items="statusOptions"
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
          v-model="local.etdRange"
          label="ETD dd/mm/yyyy - dd/mm/yyyy"
          density="compact"
          variant="outlined"
          hide-details
          clearable
          prepend-inner-icon="mdi-calendar-range"
        />
      </VCol>

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
          color="success"
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
import { STATUS_OPTIONS } from '../../constants/shippingDocument.constants'

const props = defineProps({
  filters: { type: Object, required: true },
})

const emit = defineEmits(['update:filters', 'search', 'clear', 'export'])

// local copy — v-model ผูกกับ local ไม่แตะ prop โดยตรง
const local = reactive({ ...props.filters })

// emit ขึ้น parent ทุกครั้งที่ user แก้ไข
watch(local, val => emit('update:filters', { ...val }))

// รับ reset จาก parent (handleClear เรียก Object.assign ใน composable)
watch(() => props.filters, val => Object.assign(local, val), { deep: true })

const statusOptions = STATUS_OPTIONS
</script>
