<template>
  <div>
    <!-- ── Filter Header Bar ─────────────────────────────── -->
    <div class="d-flex align-center px-4 pt-3 pb-2">
      <VBtn
        icon="mdi-close"
        variant="text"
        size="x-small"
        density="compact"
        class="me-3"
        @click="$emit('close')"
      />

      <span class="text-subtitle-1 font-weight-bold flex-grow-1 text-center">
        Shipping Expense
      </span>

      <VTooltip
        :text="filterVisible ? 'Hide Filters' : 'Show Filters'"
        location="left"
      >
        <template #activator="{ props: tp }">
          <VBtn
            v-bind="tp"
            icon="mdi-tune"
            :color="filterVisible ? 'default' : 'primary'"
            :variant="filterVisible ? 'text' : 'tonal'"
            size="x-small"
            density="compact"
            @click="filterVisible = !filterVisible"
          />
        </template>
      </VTooltip>
    </div>

    <!-- Smooth slide filter panel -->
    <Transition
      name="slide"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @before-leave="onBeforeLeave"
      @leave="onLeave"
      @after-leave="onAfterLeave"
    >
      <div
        v-if="filterVisible"
        class="filter-body"
      >
        <ShippingExpenseFilter
          :filters="filters"
          @update:filters="val => Object.assign(filters, val)"
          @search="handleSearch"
          @clear="handleClear"
          @export="handleExport"
        />
      </div>
    </Transition>

    <VDivider />

    <!-- ── Table ─────────────────────────────────────────── -->
    <ShippingExpenseTable
      :items="items"
      :total="total"
      :loading="loading"
      :pagination="pagination"
      :sort-by="sortBy"
      @update:options="handleUpdateOptions"
      @action="handleAction"
    />

    <!-- ── Toast ─────────────────────────────────────────── -->
    <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="2500"
      location="top right"
    >
      <VIcon start>
        {{ snackbar.icon }}
      </VIcon>
      {{ snackbar.message }}
    </VSnackbar>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useShippingExpense } from '../../composables/useShippingExpense'
import ShippingExpenseFilter from '../filters/ShippingExpenseFilter.vue'
import ShippingExpenseTable  from '../tables/ShippingExpenseTable.vue'
import { ShippingDocStatus, SHIPPING_EXPENSE_HEADERS, PAGE_SIZE_OPTIONS } from '../../constants/shippingDocument.constants'
import { exportToExcel } from '../../../utilities/exportExcel'
import { mapTableToExcel } from '../../../mappers/shippingDocExcel.mapper'


// ─── Props ────────────────────────────────────────────────────
const props = defineProps({
  mode: {
    type: String,
    default: 'list',
    validator: v => ['list', 'void'].includes(v),
  },
})

const emit = defineEmits(['close', 'create'])

// ─── Filter toggle ────────────────────────────────────────────
const filterVisible = ref(true)

// ─── Slide transition hooks ───────────────────────────────────
function onBeforeEnter(el) {
  el.style.height   = '0'
  el.style.opacity  = '0'
  el.style.overflow = 'hidden'
}

function onEnter(el, done) {
  requestAnimationFrame(() => {
    el.style.transition = 'height 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease'
    el.style.height     = `${el.scrollHeight}px`
    el.style.opacity    = '1'
    el.addEventListener('transitionend', done, { once: true })
  })
}

function onAfterEnter(el) {
  el.style.height   = 'auto'
  el.style.overflow = ''
}

function onBeforeLeave(el) {
  el.style.height   = `${el.scrollHeight}px`
  el.style.overflow = 'hidden'
}

function onLeave(el, done) {
  requestAnimationFrame(() => {
    el.style.transition = 'height 0.22s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease'
    el.style.height     = '0'
    el.style.opacity    = '0'
    el.addEventListener('transitionend', done, { once: true })
  })
}

function onAfterLeave(el) {
  el.style.height   = ''
  el.style.overflow = ''
  el.style.opacity  = ''
}

// ─── Data ─────────────────────────────────────────────────────
const {
  loading, items, total,
  filters, pagination, sortBy,
  handleSearch, handleClear,
  handleUpdateOptions,
} = useShippingExpense(props.mode)

// ─── Toast ────────────────────────────────────────────────────
const snackbar = reactive({ show: false, message: '', color: 'primary', icon: 'mdi-information' })

function showToast(message, color = 'primary', icon = 'mdi-information') {
  Object.assign(snackbar, { show: true, message, color, icon })
}

function handleAction(item) {
  const raw = item.raw ?? item
  const status = raw.status

  // WAITING = CREATE → เปิด dialog เลือก shipping mode ที่ parent
  if (status === ShippingDocStatus.WAITING) {
    emit('create', item)

    return
  }

  // อื่นๆ = ACTION → ไปหน้า form ตรง
  const invoice = raw.invoiceInSAP

  window.location.href = `/skt/shippingDocument/formShippingExpense/${invoice}`
  showToast(`Opening detail: ${invoice}`, 'primary', 'mdi-file-eye-outline')
}

// ─── Export Excel ────────────────────────────────────────

function handleExport() {
  if (!items.value.length) {
    showToast('No data to export', 'warning', 'mdi-alert-circle-outline')
    
    return
  }

  const mapped = mapTableToExcel(items.value, SHIPPING_EXPENSE_HEADERS, pagination)

  exportToExcel(
    mapped,
    `Shipping Expense Page ${pagination.page}.xlsx`,
  )

  showToast('Export success', 'success', 'mdi-check-circle-outline')
}
</script>
