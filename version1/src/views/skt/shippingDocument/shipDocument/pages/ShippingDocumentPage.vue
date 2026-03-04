<template>
  <VCard
    elevation="1"
    rounded="lg"
  >
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
      >
        {{ tab.label }}
      </VTab>
    </VTabs>

    <VDivider />

    <!--
      v-if = unmount เมื่อ switch tab
      filter toggle + X อยู่ภายใน tab component แต่ละตัว
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
import { ref } from 'vue'
import { TAB_CONFIG, ShippingDocTab } from '../constants/shippingDocument.constants'
import ShippingDocListTab from '../components/tabs/ShippingDocListTab.vue'
import ShippingExpenseTab from '../components/tabs/ShippingExpenseTab.vue'

defineEmits(['close'])

const activeTab = ref(ShippingDocTab.LIST)
</script>
