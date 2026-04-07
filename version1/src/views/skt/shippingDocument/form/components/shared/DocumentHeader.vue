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
      class="toolbar-container px-2"
    >
      <!-- Left -->
      <VBtn
        icon="mdi-close"
        color="green"
        variant="text"
        size="small"
        @click="$emit('close')"
      />

      <!-- Center -->
      <VToolbarTitle class="toolbar-title text-body-1 font-weight-bold">
        Ship Document
      </VToolbarTitle>

      <!-- Right -->
      <!--
        <VBtn
        icon="mdi-cog-outline"
        variant="text"
        size="small"
        color="green"
        /> 
      -->
    </VToolbar>

    
    <!-- Action buttons row -->
    <div class="d-flex align-center ga-3 px-6 py-3">
      <!-- VOID button -->
      <VBtn
        variant="elevated"
        :color="perms.canVoid ? 'red' : 'grey-lighten-1'"
        size="small"
        rounded="lg"
        min-width="100"
        :disabled="!perms.canVoid"
        @click="$emit('void')"
      >
        VOID
      </VBtn>

      <!-- APPROVE button -->
      <VBtn
        variant="elevated"
        :color="perms.canApprove ? 'green' : 'grey-lighten-1'"
        size="small"
        rounded="lg"
        min-width="100"
        :disabled="!perms.canApprove"
        @click="$emit('approve')"
      >
        APPROVE
      </VBtn>
    </div>
  </div>
</template>

<script setup>
import { useDocumentPermissions } from '../../composables/usePermissions'

defineEmits(['close', 'void', 'approve'])

const { documentPermissions: perms } = useDocumentPermissions()
</script>

<style scoped>
.toolbar-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toolbar-title {
  position: absolute;
  inset-inline-start: 50%;
  transform: translateX(-50%);
}
</style>
