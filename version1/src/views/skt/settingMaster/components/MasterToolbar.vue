<!--
  MasterToolbar.vue
  ─────────────────────────────────────────────────────────────────
  Toolbar ใต้ search bar
  • ปุ่ม CREATE [TITLE]  (ซ้าย, เขียว, h=40px, radius=8px)
  • ปุ่ม Refresh         (ขวา)
  ─────────────────────────────────────────────────────────────────
-->
<template>
  <div class="toolbar">
    <!-- ── ปุ่ม Create ─────────────────────── -->
    <VBtn
      color="primary"
      class="create-btn"
      prepend-icon="mdi-plus"
      @click="emit('create')"
    >
      CREATE {{ title.toUpperCase() }}
    </VBtn>

    <!-- ── ปุ่ม Refresh ────────────────────── -->
    <VBtn
      icon
      variant="tonal"
      :loading="loading"
      @click="handleRefresh"
    >
      <VIcon
        color="primary"
        :class="{ 'spin': loading }"
      >
        mdi-refresh-circle
      </VIcon>
    </VBtn>
  </div>
</template>

<script setup>
defineProps({
  /** ชื่อ entity  เช่น "Forwarder" → ปุ่มจะแสดง "CREATE FORWARDER" */
  title: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

// ─── Emits ────────────────────────────────────
const emit = defineEmits([
  'create',   // กดปุ่ม CREATE
  'refresh',  // กดปุ่ม Refresh
])

const loading = ref(false)

const handleRefresh = async () => {
  loading.value = true
  emit('refresh')

  // mock delay (หรือรอ API จริง)
  setTimeout(() => {
    loading.value = false
  }, 500)
}
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* stylelint-disable-next-line liberty/use-logical-spec */
  padding: 10px 16px;
  background: #f5f5f5;
  /* stylelint-disable-next-line order/properties-order */
  flex-shrink: 0;
}

.create-btn {
  /* stylelint-disable-next-line liberty/use-logical-spec */
  height: 40px !important;
  border-radius: 8px !important;
  font-weight: 700 !important;
  /* stylelint-disable-next-line liberty/use-logical-spec */
  /* stylelint-disable-next-line order/properties-order */
  font-size: 13px !important;
  letter-spacing: 0.5px;
}

.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  /* stylelint-disable-next-line rule-empty-line-before */
  to {
    transform: rotate(360deg);
  }
}
</style>
