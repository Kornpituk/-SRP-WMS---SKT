<!--
  MasterHeader.vue
  ─────────────────────────────────────────────────────────────────
  Header ของหน้า Master CRUD
  • ปุ่ม ✕  ด้านซ้าย  (emit close)
  • ชื่อหน้า centered
  • ปุ่ม filter ด้านขวา (toggle search bar)
  ─────────────────────────────────────────────────────────────────
-->
<template>
  <div class="page-header">
    <!-- ── ซ้าย: ปุ่มปิด ──────────────────────── -->
    <div class="header-side header-side--left">
      <VBtn
        icon
        variant="plain"
        size="small"
        @click="emit('close')"
      >
        <VIcon color="red-darken-2">
          mdi-close
        </VIcon>
      </VBtn>
    </div>

    <!-- ── กลาง: ชื่อหน้า ────────────────────── -->
    <h2 class="page-title">
      {{ title }}
    </h2>

    <!-- ── ขวา: ปุ่ม toggle filter ──────────── -->
    <div class="header-side header-side--right">
      <VBtn
        icon
        variant="flat"
        size="small"
        density="compact"
        class="filter-toggle-btn"
        :class="{ 'filter-toggle-btn--active': searchVisible }"
        :color="searchVisible ? 'grey-darken-1' : 'primary'"
        @click="emit('toggle-search')"
      >
        <VIcon class="filter-toggle-icon">
          ri-equalizer-line
        </VIcon>
      </VBtn>
    </div>
  </div>
</template>

<script setup>
defineProps({
  /** ชื่อที่แสดงกลางหัว เช่น "Forwarder" */
  title: {
    type: String,
    required: true,
  },

  /** สถานะว่า search bar เปิดอยู่ไหม (เพื่อ highlight icon) */
  searchVisible: {
    type: Boolean,
    default: false,
  },
})

// ─── Emits ────────────────────────────────────
const emit = defineEmits([
  'close',          // กดปุ่ม ✕
  'toggle-search',  // กดปุ่ม filter
])
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-block-end: 1px solid #e0e0e0;
  padding-block: 0;
  padding-inline: 10px;
  /* stylelint-disable-next-line order/properties-order */
  block-size: 52px;
  /* stylelint-disable-next-line order/properties-order */
  position: relative;
  /* stylelint-disable-next-line order/properties-order */
  flex-shrink: 0;
  border-radius: 10px;
}

.header-side {
  display: flex;
  align-items: center;
  /* stylelint-disable-next-line liberty/use-logical-spec */
  inline-size: 48px;
}

.header-side--right {
  justify-content: flex-end;
}

.filter-toggle-btn {
  box-shadow: 0 10px 22px rgb(15 23 42 / 8%) !important;
  transition:
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 220ms cubic-bezier(0.22, 1, 0.36, 1),
    background-color 180ms ease;
  will-change: transform;
}

.filter-toggle-btn:hover {
  transform: translateY(-1px);
  /* stylelint-disable-next-line order/properties-order */
  box-shadow: 0 14px 28px rgb(15 23 42 / 14%) !important;
}

.filter-toggle-btn--active {
  transform: scale(0.98);
  /* stylelint-disable-next-line order/properties-order */
  box-shadow: 0 8px 18px rgb(15 23 42 / 12%) inset !important;
}

.filter-toggle-icon {
  transition:
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 180ms ease;
}

.filter-toggle-btn--active .filter-toggle-icon {
  transform: rotate(90deg) scale(1.04);
}

.page-title {
  font-size: 18px;
  font-weight: bold;
  /* stylelint-disable-next-line order/properties-order */
  color: #000;
  letter-spacing: 0.3px;
  /* stylelint-disable-next-line order/properties-order */
  position: absolute;
  /* stylelint-disable-next-line order/properties-order */
  inset-inline-start: 50%;
  /* stylelint-disable-next-line order/properties-order */
  transform: translateX(-50%);
  /* stylelint-disable-next-line order/properties-order */
  white-space: nowrap;
}
</style>
