<template>
  <VDataTableServer
    :sort-by="sortBy"
    :headers="headers"
    :items="items"
    :items-length="total"
    :loading="loading"
    :page="pagination.page"
    :items-per-page="pagination.itemsPerPage"
    :items-per-page-options="pageSizeOptions"
    density="compact"
    hover
    @update:sort-by="val => $emit('update:sortBy', val)"
    @update:options="$emit('update:options', $event)"
  >
    <template #item.no="{ index }">
      <span class="text-medium-emphasis text-body-2">
        {{ (pagination.page - 1) * pagination.itemsPerPage + index + 1 }}.
      </span>
    </template>

    <template #item.status="{ item }">
      <StatusBadge :status="item.raw.status" />
    </template>

    <template #item.payerName="{ item }">
      <VTooltip
        :text="item.raw.payerName"
        location="top"
      >
        <template #activator="{ props }">
          <span
            v-bind="props"
            class="text-truncate d-inline-block"
            style="max-width: 220px;"
          >
            {{ item.raw.payerName }}
          </span>
        </template>
      </VTooltip>
    </template>

    <template #item.actions="{ item }">
      <VBtn
        color="primary"
        size="x-small"
        variant="flat"
        @click="$emit('action', item)"
      >
        ACTION
      </VBtn>
    </template>

    <template #no-data>
      <div class="text-center py-8 text-medium-emphasis">
        <VIcon
          size="40"
          class="mb-2"
        >
          mdi-database-off-outline
        </VIcon>
        <div>No data found</div>
      </div>
    </template>
  </VDataTableServer>
</template>

<script setup>
import { SHIPPING_EXPENSE_HEADERS, PAGE_SIZE_OPTIONS } from '../../constants/shippingDocument.constants'
import StatusBadge from '../shared/StatusBadge.vue'

defineProps({
  items: { type: Array,   required: true },
  total: { type: Number,  required: true },
  loading: { type: Boolean, default: false },
  pagination: { type: Object,  required: true },
  sortBy: { type: Array,   default: () => [] },
})

defineEmits(['update:options', 'action'])

const headers         = SHIPPING_EXPENSE_HEADERS
const pageSizeOptions = PAGE_SIZE_OPTIONS.map(v => ({ value: v, title: String(v) }))
</script>
