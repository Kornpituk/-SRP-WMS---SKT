<template>
  <div class="ship-document-detail">
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

    <template v-else>
      <DocumentHeader
        @close="goBackToList"
        @void="openActionDialog('void')"
        @approve="openActionDialog('approve')"
      />

      <VAlert
        v-if="store.isVoided"
        type="error"
        variant="tonal"
        density="compact"
        class="mx-4 mt-4"
        icon="mdi-cancel"
      >
        This document has been voided. All tabs are read-only. Only printing is available.
      </VAlert>

      <VAlert
        v-else-if="store.isApproved"
        type="success"
        variant="tonal"
        density="compact"
        class="mx-4 mt-4"
        icon="mdi-check-decagram"
      >
        This document has been approved. APPROVE and VOID can no longer be used.
      </VAlert>

      <VTabs
        v-model="store.activeTabKey"
        color="primary"
        grow
        class="bg-white"
      >
        <VTab
          v-for="tab in visibleTabs"
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

      <VWindow
        v-model="store.activeTabKey"
        class="flex-grow-1 overflow-y-auto"
      >
        <VWindowItem
          v-for="tab in visibleTabs"
          :key="tab.key"
          :value="tab.key"
        >
          <KeepAlive>
            <Component :is="tabComponents[tab.key]" />
          </KeepAlive>
        </VWindowItem>
      </VWindow>
    </template>

    <VDialog
      v-model="actionDialog.open"
      max-width="520"
      persistent
    >
      <VCard>
        <VCardTitle
          class="text-h6"
          :class="actionDialog.action === 'void' ? 'text-red' : 'text-green'"
        >
          {{ dialogConfig.title }}
        </VCardTitle>
        <VCardText>
          <div class="mb-3">
            {{ dialogConfig.message }}
          </div>

          <div v-if="incompleteTabs.length > 0">
            <div class="text-subtitle-2 mb-2">
              Tabs not confirmed:
            </div>
            <VList
              density="compact"
              class="border rounded"
            >
              <VListItem
                v-for="tab in incompleteTabs"
                :key="tab.key"
              >
                <VListItemTitle>{{ tab.label }}</VListItemTitle>
                <VListItemSubtitle>Status: {{ tab.status }}</VListItemSubtitle>
              </VListItem>
            </VList>
          </div>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            variant="text"
            :disabled="actionDialog.loading"
            @click="closeActionDialog"
          >
            Cancel
          </VBtn>
          <VBtn
            :color="dialogConfig.buttonColor"
            variant="elevated"
            :loading="actionDialog.loading"
            @click="handleConfirmAction"
          >
            {{ dialogConfig.buttonText }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, markRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useShipDocumentStore } from '../stores/shipDocumentStore'
import { useDocumentActions } from '../composables/useDocumentActions'
import { useUnsavedChangesGuard } from '../composables/useUnsavedChangesGuard'
import { getOrderedTabs } from '../constants/tabRegistry'
import { DocumentStatus, TabKey, TabStatus } from '../types/shipDocument'

import DocumentHeader from '../components/shared/DocumentHeader.vue'
import TabStatusIndicator from '../components/shared/TabStatusIndicator.vue'
import PackingListTab from '../components/tabs/PackingListTab.vue'
import CommercialInvoiceTab from '../components/tabs/CommercialInvoiceTab.vue'
import CertificateOfOriginTab from '../components/tabs/CertificateOfOriginTab.vue'
import PackingDeclarationTab from '../components/tabs/PackingDeclarationTab.vue'
import ShippingParticularTab from '../components/tabs/ShippingParticularTab.vue'
import { shipDocumentApi } from '../services/shipDocumentApi'
import { getVisibleTabs } from '../constants/shippingMode'

const route = useRoute()
const router = useRouter()
const store = useShipDocumentStore()

const { fetchDocument, voidDocument, approveDocument, goBackToList, cleanup, fetchError } =
  useDocumentActions()

useUnsavedChangesGuard()

const orderedTabs = getOrderedTabs()

const shippingMode = computed(() => route.query.mode || 'ocean')

const visibleTabs = computed(() => {
  const allowedKeys = getVisibleTabs(shippingMode.value)

  return orderedTabs.filter(tab => allowedKeys.includes(tab.key))
})

const incompleteTabs = computed(() =>
  visibleTabs.value
    .filter(tab => store.tabs[tab.key].status !== TabStatus.CONFIRMED)
    .map(tab => ({
      key: tab.key,
      label: tab.label,
      status: store.tabs[tab.key].status,
    })),
)

const tabComponents = {
  [TabKey.PACKING_LIST]: markRaw(PackingListTab),
  [TabKey.COMMERCIAL_INVOICE]: markRaw(CommercialInvoiceTab),
  [TabKey.CERTIFICATE_OF_ORIGIN]: markRaw(CertificateOfOriginTab),
  [TabKey.PACKING_DECLARATION]: markRaw(PackingDeclarationTab),
  [TabKey.SHIPPING_PARTICULAR]: markRaw(ShippingParticularTab),
}

const actionDialog = ref({
  open: false,
  action: null,
  loading: false,
})

const dialogConfig = computed(() => {
  const isVoidAction = actionDialog.value.action === 'void'
  const hasIncompleteTabs = incompleteTabs.value.length > 0

  if (isVoidAction) {
    return {
      title: 'Void Document',
      message: hasIncompleteTabs
        ? 'Some tabs are not confirmed yet. If you continue, the document will still be voided and all tabs will become read-only.'
        : 'This cannot be undone. All tabs become read-only. Continue?',
      buttonText: 'Yes, Void',
      buttonColor: 'red',
    }
  }

  return {
    title: 'Approve Document',
    message: hasIncompleteTabs
      ? 'Some tabs are not confirmed yet. Review the list below before continuing with approval.'
      : 'Approve this document?',
    buttonText: 'Approve',
    buttonColor: 'green',
  }
})

function openActionDialog(action) {
  if (store.documentStatus !== DocumentStatus.ACTIVE) return

  const needsConfirmation = action === 'void' || incompleteTabs.value.length > 0

  if (!needsConfirmation && action === 'approve') {
    actionDialog.value = {
      open: false,
      action,
      loading: false,
    }
    handleConfirmAction()

    return
  }

  actionDialog.value = {
    open: true,
    action,
    loading: false,
  }
}

function closeActionDialog() {
  actionDialog.value = {
    open: false,
    action: null,
    loading: false,
  }
}

async function handleConfirmAction() {
  const action = actionDialog.value.action ?? 'approve'

  actionDialog.value = {
    ...actionDialog.value,
    loading: true,
  }

  const success = action === 'void'
    ? await voidDocument()
    : await approveDocument()

  if (success) {
    closeActionDialog()

    return
  }

  actionDialog.value = {
    ...actionDialog.value,
    loading: false,
  }
}

async function retry() {
  await fetchDocument(route.params.id)
}

onMounted(async () => {
  const id = route.params.id
  const mode = route.query.mode
  const sourceId = route.query.sourceId

  if (id === 'create') {
    try {
      const res = await shipDocumentApi.createDocument(mode, sourceId)

      if (res.success) {
        store.loadDocument(res.data)

        router.replace({
          path: `/skt/shippingDocument/form/${res.data.id}`,
          query: { mode },
        })
      }
    }
    catch (err) {
      fetchError.value = 'Failed to create document'
    }
  }
  else {
    await fetchDocument(id)
  }
})

onBeforeUnmount(() => cleanup())
</script>

<style scoped>
.ship-document-detail {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}
</style>
