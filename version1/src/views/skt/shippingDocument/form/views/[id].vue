<template>
  <div class="ship-document-detail">
    <!-- Loading -->
    <div
      v-if="store.isLoading"
      class="d-flex justify-center align-center pa-16"
    >
      <VProgressCircular
        indeterminate
        color="primary"
        size="48"
      />
    </div>

    <!-- Error -->
    <VAlert
      v-else-if="fetchError"
      type="error"
      variant="tonal"
      class="ma-4"
    >
      {{ fetchError }}
      <template #append>
        <VBtn
          variant="text"
          @click="retry"
        >
          Retry
        </VBtn>
      </template>
    </VAlert>

    <!-- Document loaded -->
    <template v-else>
      <DocumentHeader
        @close="goBackToList"
        @void="showVoidDialog = true"
        @approve="handleApprove"
      />

      <VAlert
        v-if="store.isVoided"
        type="error"
        variant="tonal"
        density="compact"
        class="mx-4 mt-4"
        icon="mdi-cancel"
      >
        This document has been voided. All tabs are read-only. Only printing is
        available.
      </VAlert>

      <!-- Tab bar -->
      <VTabs
        v-model="store.activeTabKey"
        color="primary"
        grow
        class="bg-white"
      >
        <VTab
          v-for="tab in orderedTabs"
          :key="tab.key"
          :value="tab.key"
        >
          <TabStatusIndicator
            :status="store.tabs[tab.key].status"
            class="m-2"
          />
          {{ tab.label }}
        </VTab>
      </VTabs>
      <VDivider />

      <!-- Tab content -->
      <VWindow
        v-model="store.activeTabKey"
        class="flex-grow-1 overflow-y-auto"
      >
        <VWindowItem
          v-for="tab in orderedTabs"
          :key="tab.key"
          :value="tab.key"
        >
          <KeepAlive>
            <Component :is="tabComponents[tab.key]" />
          </KeepAlive>
        </VWindowItem>
      </VWindow>
    </template>

    <!-- Void dialog -->
    <VDialog
      v-model="showVoidDialog"
      max-width="420"
      persistent
    >
      <VCard>
        <VCardTitle class="text-h6 text-red">
          Void Document
        </VCardTitle>
        <VCardText>
          This cannot be undone. All tabs become read-only. Continue?
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            variant="text"
            @click="showVoidDialog = false"
          >
            Cancel
          </VBtn>
          <VBtn
            color="red"
            variant="elevated"
            @click="
              showVoidDialog = false;
              voidDocument();
            "
          >
            Yes, Void
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, markRaw } from "vue"
import { useRoute } from "vue-router"
import { useShipDocumentStore } from "../stores/shipDocumentStore"
import { useDocumentActions } from "../composables/useDocumentActions"
import { useUnsavedChangesGuard } from "../composables/useUnsavedChangesGuard"
import { getOrderedTabs } from "../constants/tabRegistry"
import { TabKey } from "../types/shipDocument"

import DocumentHeader from "../components/shared/DocumentHeader.vue"
import TabStatusIndicator from "../components/shared/TabStatusIndicator.vue"
import PackingListTab from "../components/tabs/PackingListTab.vue"
import CommercialInvoiceTab from "../components/tabs/CommercialInvoiceTab.vue"
import CertificateOfOriginTab from "../components/tabs/CertificateOfOriginTab.vue"
import PackingDeclarationTab from "../components/tabs/PackingDeclarationTab.vue"
import ShippingParticularTab from "../components/tabs/ShippingParticularTab.vue"

const route = useRoute()
const store = useShipDocumentStore()

const { fetchDocument, voidDocument, goBackToList, cleanup, fetchError } =
  useDocumentActions()

useUnsavedChangesGuard()

const orderedTabs = getOrderedTabs()

const tabComponents = {
  [TabKey.PACKING_LIST]: markRaw(PackingListTab),
  [TabKey.COMMERCIAL_INVOICE]: markRaw(CommercialInvoiceTab),
  [TabKey.CERTIFICATE_OF_ORIGIN]: markRaw(CertificateOfOriginTab),
  [TabKey.PACKING_DECLARATION]: markRaw(PackingDeclarationTab),
  [TabKey.SHIPPING_PARTICULAR]: markRaw(ShippingParticularTab),
}

const showVoidDialog = ref(false)

function handleApprove() {
  console.log("Approve document — TODO")
}

async function retry() {
  await fetchDocument(route.params.id)
}

onMounted(async () => {
  if (route.params.id) await fetchDocument(route.params.id)
})
onBeforeUnmount(() => cleanup())
</script>

<style scoped>
.ship-document-detail {
  display: flex;
  flex-direction: column;
  block-size: 100vh;
  /* stylelint-disable-next-line order/properties-order */
  background: #f5f5f5;
}
</style>
