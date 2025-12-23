// =====================================================
// 📄 components/ShipmentRowActions.vue
// =====================================================
<template>
  <div class="row-actions">
    <VBtn
      v-if="canSave"
      size="small"
      color="warning"
      :loading="saving"
      @click="$emit('action', { type: 'save', item })"
    >
      Save Draft
    </VBtn>
    
    <VBtn
      v-if="canSubmit"
      size="small"
      color="primary"
      :loading="submitting"
      @click="$emit('action', { type: 'submit', item })"
    >
      Submit
    </VBtn>
    
    <VMenu>
      <template #activator="{ props }">
        <VBtn
          icon="ri-more-2-line"
          size="small"
          v-bind="props"
        />
      </template>
      
      <VList>
        <VListItem @click="$emit('action', { type: 'truck-order', item })">
          Truck Order
        </VListItem>
        <VListItem @click="$emit('action', { type: 'checksheet', item })">
          Checksheet
        </VListItem>
      </VList>
    </VMenu>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: Object,
  permissions: Object,
})

const emit = defineEmits(['action'])

const canSave = computed(() =>
  props.permissions.canExecute('BTN_SAVE_DRAFT') &&
  props.item.statusId !== 206 &&
  props.item.statusId !== 207,
)

const canSubmit = computed(() =>
  props.permissions.canExecute('BTN_SUBMIT') &&
  props.item.statusId !== 206 &&
  props.item.statusId !== 207,
)
</script>
