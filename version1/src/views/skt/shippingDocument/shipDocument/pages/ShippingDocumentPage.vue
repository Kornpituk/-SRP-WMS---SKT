<template>
  <VCard
    elevation="1"
    rounded="lg"
  >
    <!-- Card Title row -->
    <VCardTitle class="d-flex align-center justify-space-between pa-4 pb-0">
      <span class="text-h6 font-weight-bold">{{ pageTitle }}</span>
      <VBtn
        icon="mdi-close"
        variant="text"
        size="small"
        @click="$emit('close')"
      />
    </VCardTitle>

    <!-- Tab bar -->
    <VTabs
      v-model="activeTab"
      color="primary"
      density="comfortable"
      class="px-2"
    >
      <VTab
        v-for="tab in TAB_CONFIG"
        :key="tab.key"
        :value="tab.key"
        :prepend-icon="tab.icon"
      >
        {{ tab.label }}
      </VTab>
    </VTabs>

    <VDivider />

    <!--
      ใช้ v-if แทน VTabsWindow เพื่อ:
      1. render เฉพาะ tab ที่ active — ไม่มี filter ซ้อนกัน
      2. unmount เมื่อ switch tab — state reset อัตโนมัติ ไม่ต้องพึ่ง key
    -->
    <ShippingDocListTab
      v-if="activeTab === ShippingDocTab.LIST"
      mode="list"
    />

    <ShippingDocListTab
      v-else-if="activeTab === ShippingDocTab.VOID"
      mode="void"
    />

    <ShippingExpenseTab v-else-if="activeTab === ShippingDocTab.EXPENSE" />
  </VCard>
</template>

<script setup>
import { ref, computed } from 'vue'
import { TAB_CONFIG, ShippingDocTab } from '../constants/shippingDocument.constants'
import ShippingDocListTab from '../components/tabs/ShippingDocListTab.vue'
import ShippingExpenseTab from '../components/tabs/ShippingExpenseTab.vue'

defineEmits(['close'])

const activeTab = ref(ShippingDocTab.LIST)

const pageTitle = computed(
  () => TAB_CONFIG.find(t => t.key === activeTab.value)?.label ?? '',
)
</script>
