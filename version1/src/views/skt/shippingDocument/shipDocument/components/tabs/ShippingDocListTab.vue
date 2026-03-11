<template>
  <div>
    <!-- ── Filter Header Bar — แสดงตลอด ───────────────── -->
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
        {{ filterTitle }}
      </span>

      <VTooltip
        :text="filterVisible ? 'Hide Filters' : 'Show Filters'"
        location="left"
      >
        <template #activator="{ props: tp }">
          <VBtn
            v-bind="tp"
            :icon="filterVisible ? 'mdi-tune' : 'mdi-tune'"
            :color="filterVisible ? 'default' : 'primary'"
            :variant="filterVisible ? 'text' : 'tonal'"
            size="x-small"
            density="compact"
            @click="filterVisible = !filterVisible"
          />
        </template>
      </VTooltip>
    </div>

    <!--
      ✅ Smooth slide — ใช้ JS hooks วัด scrollHeight จริง
      ไม่ใช่ max-height fixed value ที่ทำให้ animation สะดุด
    -->
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
        <ShippingDocFilter
          :filters="filters"
          :status-filter-disabled="statusFilterDisabled"
          @update:filters="val => Object.assign(filters, val)"
          @search="handleSearch"
          @clear="handleClear"
          @export="handleExport"
        />
      </div>
    </Transition>

    <VDivider />

    <!-- ── Table ─────────────────────────────────────────── -->
    <ShippingDocTable
      :items="items"
      :total="total"
      :loading="loading"
      :pagination="pagination"
      :sort-by="sortBy"
      :mode="mode"
      @update:options="handleUpdateOptions"
      @action="handleAction"
      @void="handleVoidRequest"
    />

    <!-- ── Void Confirm Dialog ───────────────────────────── -->
    <VoidConfirmDialog
      v-model="voidDialog.open"
      :doc-label="voidDialog.docLabel"
      :loading="voidDialog.loading"
      @confirm="handleVoidConfirm"
      @cancel="handleVoidCancel"
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
import { ref, reactive, computed } from 'vue'
import { useShippingDocList } from '../../composables/useShippingDocList'
import ShippingDocFilter from '../filters/ShippingDocFilter.vue'
import ShippingDocTable  from '../tables/ShippingDocTable.vue'
import VoidConfirmDialog    from '@/views/skt/compoentn/dialog/voidConfirmDialog.vue'
import { ShippingDocStatus } from '../../constants/shippingDocument.constants'

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

const filterTitle = computed(() =>
  props.mode === 'list' ? 'List of Shipping Doc' : 'Void of Document',
)

// ─── Slide transition hooks (วัด scrollHeight จริง) ──────────
/**
 * เหตุผลที่ต้องใช้ JS hooks แทน CSS max-height:
 * - max-height: 0 → 500px = browser animate ตลอด 500px แม้ content จะแค่ 120px
 *   → animation ช้าช่วงแรก เร็วช่วงหลัง ดูสะดุด
 * - JS hooks วัด el.scrollHeight จริง → animate ตรงกับ content พอดี → smooth
 */
function onBeforeEnter(el) {
  el.style.height    = '0'
  el.style.opacity   = '0'
  el.style.overflow  = 'hidden'
}

function onEnter(el, done) {
  // ต้อง requestAnimationFrame เพื่อให้ browser บันทึก initial state ก่อน
  requestAnimationFrame(() => {
    el.style.transition = 'height 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease'
    el.style.height     = `${el.scrollHeight}px`
    el.style.opacity    = '1'
    el.addEventListener('transitionend', done, { once: true })
  })
}

function onAfterEnter(el) {
  // reset height ให้ auto เพื่อรองรับ content ที่อาจขยายทีหลัง
  el.style.height   = 'auto'
  el.style.overflow = ''
}

function onBeforeLeave(el) {
  // pin height ปัจจุบันก่อน animate ออก
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
  statusFilterDisabled,
  handleSearch, handleClear,
  handleUpdateOptions,
} = useShippingDocList(props.mode)

// ─── Void Dialog state ────────────────────────────────────────
const voidDialog = reactive({
  open: false,
  docLabel: '',
  loading: false,
  item: null,   // เก็บ item ที่จะ void ไว้รอ confirm
})

/**
 * Step 1 — user กด VOID button ในตาราง
 * เปิด dialog พร้อม docLabel
 */
function handleVoidRequest(item) {
  const raw = item.raw ?? item

  voidDialog.item     = raw
  voidDialog.docLabel = raw.invoiceInSAP ?? raw.invoice ?? 'this document'
  voidDialog.open     = true
}

/**
 * Step 2 — user กด VOID ใน dialog
 * เรียก API จริง ตรงนี้
 */
async function handleVoidConfirm() {
  voidDialog.loading = true
  try {
    // TODO: swap เป็น API จริง เช่น:
    // await voidShippingDoc(voidDialog.item.id)
    // eslint-disable-next-line promise/param-names
    await new Promise(res => setTimeout(res, 800)) // mock delay

    voidDialog.open = false
    showToast(`Voided: ${voidDialog.docLabel}`, 'success', 'mdi-check-circle-outline')
    reload() // refresh table
  }
  catch (err) {
    showToast('Failed to void document', 'error', 'mdi-alert-circle-outline')
  }
  finally {
    voidDialog.loading = false
  }
}

/**
 * Step 3 — user กด CANCEL
 */
function handleVoidCancel() {
  voidDialog.open = false
  voidDialog.item = null
}

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

  window.location.href = `/skt/shippingDocument/form/${invoice}`
  showToast(`Opening detail: ${invoice}`, 'primary', 'mdi-file-eye-outline')
}

function handleVoid(item) {
  const invoice = item.raw?.invoiceInSAP ?? item.invoiceInSAP

  showToast(`Voiding: ${invoice}`, 'error', 'mdi-file-cancel-outline')
}

function handleExport() {
  showToast('Exporting to Excel...', '', 'mdi-microsoft-excel')
}
</script>
