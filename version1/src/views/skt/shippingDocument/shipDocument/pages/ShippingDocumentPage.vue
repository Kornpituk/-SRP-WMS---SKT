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
      @create="onCreateShipDoc"
    />
    <ShippingDocListTab
      v-else-if="activeTab === ShippingDocTab.VOID"
      mode="void"
      @create="onCreateShipDoc"
    />
    <ShippingExpenseTab v-else-if="activeTab === ShippingDocTab.EXPENSE" />

    <SelectShippingModeDialog
      v-model="showModeDialog"
      @confirm="handleModeConfirm"
    />
  </VCard>
</template>

<script setup>
import { ref } from 'vue'
import { TAB_CONFIG, ShippingDocTab } from '../constants/shippingDocument.constants'
import ShippingDocListTab from '../components/tabs/ShippingDocListTab.vue'
import ShippingExpenseTab from '../components/tabs/ShippingExpenseTab.vue'
import SelectShippingModeDialog from '../components/tables/Selectshippingmodedialog.vue'

defineEmits(['close'])

const router = useRouter()
const activeTab = ref(ShippingDocTab.LIST)

// ─── Shipping Mode Dialog ─────────────────────────────────────
const showModeDialog = ref(false)
const pendingItem = ref(null)

function onCreateShipDoc(item) {
  pendingItem.value = item.raw ?? item
  showModeDialog.value = true
}

function handleModeConfirm(mode) {
  const sourceId = pendingItem.value?.id ?? ''

  // TODO: เปลี่ยน path ตาม router จริงของโปรเจค
  router.push({
    path: '/skt/shippingDocument/form/create',
    query: { mode, sourceId },
  })

  pendingItem.value = null
}
</script>
