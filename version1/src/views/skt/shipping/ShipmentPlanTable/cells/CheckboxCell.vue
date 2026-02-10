<template>
  <td
    style="min-width: 60px;"
    class="sticky-columnBody cursor-pointer flex-d justify-center"
    :style="cellStyle"
    @dblclick="$emit('highlight')"
  >
    <div class="cell-center">
      <VCheckboxBtn
        v-if="showCheckbox"
        :model-value="isSelected"
        @update:model-value="$emit('select', product)"
      />
      
      <VBtn
        v-if="showDeleteButton"
        color="red"
        variant="outlined"
        @click="$emit('delete')"
      >
        <span style="font-size: 12px;">
          <VIcon icon="ri-delete-bin-line" /> SO
        </span>
        <VTooltip
          activator="parent"
          location="end"
        >
          Delete SO
        </VTooltip>
      </VBtn>
    </div>
  </td>
</template>

<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  selectedDataTables: {
    type: Array,
    default: () => [],
  },
  cellStyle: {
    type: Object,
    default: () => ({}),
  },
  showCheckbox: {
    type: Boolean,
    default: false,
  },
  showDeleteButton: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['highlight', 'delete', 'select'])

const isSelected = computed(() => 
  props.selectedDataTables.includes(props.product),
)
</script>
