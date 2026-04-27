<template>
  <div>
    <!-- Skeleton overlay -->
    <div v-show="loading">
      <VTable
        density="compact"
        class="skeleton-table"
      >
        <thead>
          <tr>
            <th style="width: 52px;">
              No.
            </th>
            <th
              v-for="h in visibleHeaders"
              :key="h.key"
            >
              {{ h.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="n in skeletonRows"
            :key="n"
          >
            <td><div class="skel-line skel-sm" /></td>
            <td
              v-for="h in visibleHeaders"
              :key="h.key"
            >
              <div
                class="skel-line"
                :style="{ width: skeletonWidth(h.key) }"
              />
            </td>
          </tr>
        </tbody>
      </VTable>
    </div>

    <!-- Table — always mounted -->
    <div v-show="!loading">
      <VDataTableServer
        :sort-by="sortBy"
        :headers="headers"
        :items="items"
        :items-length="total"
        :loading="false"
        :page="safePagination.page"
        :items-per-page="safePagination.itemsPerPage"
        :items-per-page-options="pageSizeOptions"
        density="compact"
        hover
        @update:sort-by="val => $emit('update:sortBy', val)"
        @update:options="$emit('update:options', $event)"
      >
        <template #item.no="{ index }">
          <span class="text-medium-emphasis text-body-2">
            {{ (safePagination.page - 1) * safePagination.itemsPerPage + index + 1 }}.
          </span>
        </template>

        <template #item.status="{ item }">
          <StatusBadge :status="item.raw?.status ?? item.status" />
        </template>

        <template #item.payerName="{ item }">
          <VTooltip
            :text="item.raw?.payerName ?? item.payerName"
            location="top"
          >
            <template #activator="{ props: tp }">
              <span
                v-bind="tp"
                class="text-truncate d-inline-block"
                style="max-width: 220px;"
              >
                {{ item.raw?.payerName ?? item.payerName }}
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
          <div class="d-flex flex-column align-center py-10 text-medium-emphasis">
            <VIcon
              size="48"
              class="mb-3"
              color="grey-lighten-1"
            >
              mdi-database-off-outline
            </VIcon>
            <span class="text-body-2">No data found</span>
          </div>
        </template>
      </VDataTableServer>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { SHIPPING_EXPENSE_HEADERS, PAGE_SIZE_OPTIONS } from '../../constants/shippingDocument.constants'
import StatusBadge from '../shared/StatusBadge.vue'

const props = defineProps({
  items: { type: Array,   default: () => [] },
  total: { type: Number,  default: 0 },
  loading: { type: Boolean, default: false },
  pagination: { type: Object,  default: () => ({ page: 1, itemsPerPage: 20 }) },
  sortBy: { type: Array,   default: () => [] },
})

defineEmits(['update:options', 'update:sortBy', 'action'])

const safePagination = computed(() => ({
  page: props.pagination?.page         ?? 1,
  itemsPerPage: props.pagination?.itemsPerPage ?? 20,
}))

const skeletonRows    = 6
const visibleHeaders  = SHIPPING_EXPENSE_HEADERS.filter(h => h.key !== 'no')
const headers         = SHIPPING_EXPENSE_HEADERS
const pageSizeOptions = PAGE_SIZE_OPTIONS.map(v => ({ value: v, title: String(v) }))

const SKELETON_WIDTHS = {
  status: '64px', invoiceInSAP: '88px', invoice: '96px',
  payerName: '130px', etd: '72px', actions: '64px',
}

const skeletonWidth = key => SKELETON_WIDTHS[key] ?? '80px'
</script>

<style scoped>
@keyframes shimmer {
  /* stylelint-disable-next-line block-opening-brace-space-before */
  0%   { background-position: -400px 0; }
  /* stylelint-disable-next-line declaration-colon-space-after */
  100% { background-position:  400px 0; }
}

.skel-line {
  block-size: 12px;
  /* stylelint-disable-next-line order/properties-order */
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 800px 100%;
  /* stylelint-disable-next-line order/properties-order */
  animation: shimmer 1.4s infinite linear;
}

/* stylelint-disable-next-line liberty/use-logical-spec */
.skel-sm { width: 24px; }

.skeleton-table thead th {
  background: rgb(var(--v-theme-surface));
  font-size: 12px;
  font-weight: 700;
  /* stylelint-disable-next-line order/properties-order */
  color: rgba(var(--v-theme-on-surface), 0.7);
  /* stylelint-disable-next-line liberty/use-logical-spec */
  /* stylelint-disable-next-line order/properties-order */
  padding-block: 8px;
  /* stylelint-disable-next-line liberty/use-logical-spec */
  /* stylelint-disable-next-line order/properties-order */
  padding-inline: 16px;
  /* stylelint-disable-next-line order/properties-order */
  border-block-end: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
  white-space: nowrap;
}

.skeleton-table tbody td {
  padding-block: 10px;
  padding-inline: 16px;
  /* stylelint-disable-next-line liberty/use-logical-spec */
  /* stylelint-disable-next-line order/properties-order */
  border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  vertical-align: middle;
}
</style>
