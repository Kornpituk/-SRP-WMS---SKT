<!-- ============================================================
  TabStatusIndicator.vue
  ● CONFIRMED = green check (mdi-check-circle)
  ● SAVED     = orange circle (mdi-circle-half-full)  
  ● DRAFT     = grey outline (mdi-circle-outline)
  ● VOID override = red lock
============================================================ -->
<template>
  <v-icon :color="display.color" :icon="display.icon" size="20" />
</template>

<script setup>
import { computed } from 'vue'
import { useShipDocumentStore } from '../../stores/shipDocumentStore'
import { TabStatus } from '../../types/shipDocument'

const props = defineProps({
  status: { type: String, required: true },
})

const store = useShipDocumentStore()

const statusMap = {
  [TabStatus.DRAFT]: { color: 'grey-lighten-1', icon: 'mdi-circle-outline' },
  [TabStatus.SAVED]: { color: 'orange', icon: 'mdi-circle-half-full' },
  [TabStatus.CONFIRMED]: { color: 'green', icon: 'mdi-check-circle' },
}

const display = computed(() => {
  if (store.isVoided) return { color: 'red', icon: 'mdi-lock' }
  return statusMap[props.status] ?? { color: 'grey', icon: 'mdi-circle-outline' }
})
</script>
