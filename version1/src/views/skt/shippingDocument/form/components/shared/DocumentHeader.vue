<!--
  ============================================================
  DocumentHeader.vue
  Matches: Top bar with X, "Ship Document" title, VOID / APPROVE
  Screenshot ref: all images — green bar with buttons
  ============================================================ 
-->
<template>
  <div>
    <!-- Top bar -->
    <VToolbar
      color="white"
      flat
      density="compact"
      class="px-2 d-flex align-center ga-3"
    >
      <VBtn
        icon="mdi-close"
        color="green"
        variant="text"
        size="small"
        @click="$emit('close')"
      />
      <VToolbarTitle class="text-center text-body-1 font-weight-bold">
        Ship Document
      </VToolbarTitle>
      <VSpacer />
      <!-- Settings icon placeholder -->
      <VBtn
        icon="mdi-cog-outline"
        variant="text"
        size="small"
        color="green"
      />
    </VToolbar>

    <!-- Action buttons row -->
    <div class="d-flex align-center ga-3 px-6 py-3">
      <!-- VOID button -->
      <VBtn
        v-if="perms.canVoid"
        variant="elevated"
        color="red"
        size="small"
        rounded="lg"
        min-width="100"
        @click="$emit('void')"
      >
        VOID
      </VBtn>
      <VBtn
        v-else
        variant="elevated"
        color="grey-lighten-1"
        size="small"
        rounded="lg"
        min-width="100"
        disabled
      >
        VOID
      </VBtn>

      <!-- APPROVE button -->
      <VBtn
        v-if="perms.canApprove && store.allTabsConfirmed"
        variant="elevated"
        color="green"
        size="small"
        rounded="lg"
        min-width="100"
        @click="$emit('approve')"
      >
        APPROVE
      </VBtn>
      <VBtn
        v-else
        variant="elevated"
        color="grey-lighten-1"
        size="small"
        rounded="lg"
        min-width="100"
        disabled
      >
        APPROVE
      </VBtn>
    </div>
  </div>
</template>

<script setup>
import { useShipDocumentStore } from '../../stores/shipDocumentStore'
import { useDocumentPermissions } from '../../composables/usePermissions'

defineEmits(['close', 'void', 'approve'])

const store = useShipDocumentStore()
const { documentPermissions: perms } = useDocumentPermissions()
</script>
