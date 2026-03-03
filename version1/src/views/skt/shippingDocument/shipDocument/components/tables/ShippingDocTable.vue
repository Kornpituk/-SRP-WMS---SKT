<template>
  <!--
    v-data-table-server: Vuetify จัดการ sort/page ผ่าน @update:options
    items-length ต้องส่ง total จาก server เสมอ
  -->
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
    <!-- No. column: running index บน current page -->
    <template #item.no="{ index }">
      <span class="text-medium-emphasis text-body-2">
        {{ (pagination.page - 1) * pagination.itemsPerPage + index + 1 }}.
      </span>
    </template>

    <!-- Status badge -->
    <template #item.status="{ item }">
      <StatusBadge :status="item.raw.status" />
    </template>

    <!-- Qty: format number -->
    <template #item.qty="{ item }">
      {{ formatNumber(item.raw.qty) }}
    </template>

    <!-- Payer / Consignee: truncate long text -->
    <template #item.payerName="{ item }">
      <VTooltip
        :text="item.raw.payerName"
        location="top"
      >
        <template #activator="{ props }">
          <span
            v-bind="props"
            class="text-truncate d-inline-block"
            style="max-width: 160px;"
          >
            {{ item.raw.payerName }}
          </span>
        </template>
      </VTooltip>
    </template>

    <template #item.consignee="{ item }">
      <VTooltip
        :text="item.raw.consignee"
        location="top"
      >
        <template #activator="{ props }">
          <span
            v-bind="props"
            class="text-truncate d-inline-block"
            style="max-width: 160px;"
          >
            {{ item.raw.consignee }}
          </span>
        </template>
      </VTooltip>
    </template>

    <!-- Action column — ต่างกันตาม mode + status ของแต่ละ row -->
    <template #item.actions="{ item }">
      <div class="d-flex justify-center gap-1">
        <!-- LIST mode -->
        <template v-if="mode === 'list'">
          <!-- Waiting: CREATE button -->
          <VBtn
            v-if="item.status === ShippingDocStatus.WAITING"
            color="success"
            size="x-small"
            variant="flat"
            @click="$emit('action', item)"
          >
            CREATE
          </VBtn>

          <!-- Non-Void: ACTION + VOID -->
          <template v-else-if="item.status !== ShippingDocStatus.VOID">
            <VBtn
              color="primary"
              size="x-small"
              variant="flat"
              @click="$emit('action', item)"
            >
              ACTION
            </VBtn>
            <VBtn
              color="error"
              size="x-small"
              variant="flat"
              @click="$emit('void', item)"
            >
              VOID
            </VBtn>
          </template>
        </template>

        <!-- VOID mode: ACTION only (read-only view) -->
        <VBtn
          v-else
          color="primary"
          size="x-small"
          variant="flat"
          @click="$emit('action', item)"
        >
          ACTION
        </VBtn>
      </div>
    </template>

    <!-- Empty state -->
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
import { ShippingDocStatus, SHIPPING_DOC_HEADERS, PAGE_SIZE_OPTIONS } from '../../constants/shippingDocument.constants'
import StatusBadge from '../shared/StatusBadge.vue'

defineProps({
  items: { type: Array,   required: true },
  total: { type: Number,  required: true },
  loading: { type: Boolean, default: false },
  pagination: { type: Object,  required: true }, // { page, itemsPerPage }
  sortBy: { type: Array,   default: () => [] },
  mode: { type: String,  default: 'list', validator: v => ['list', 'void'].includes(v) },
})

defineEmits(['update:options', 'action', 'void'])

const formatNumber = val =>
  val != null ? Number(val).toLocaleString() : '-'

const headers        = SHIPPING_DOC_HEADERS
const pageSizeOptions = PAGE_SIZE_OPTIONS.map(v => ({ value: v, title: String(v) }))
</script>
