<template>
  <VCardText>
    <div class="d-flex align-center flex-no-wrap justify-end pa-2">
      <VSelect
        v-model="localSelectedItemsPerPage"
        style="max-width: 80px;"
        :items="pageSizeOptions"
        hide-details
        density="compact"
        dense
        class="mx-4"
        @update:model-value="onItemsPerPageChange"
      />
      
      <span class="text-caption">
        {{ startItem }} - {{ endItem }} of {{ totalItems }}
      </span>
      
      <div class="pagination-container">
        <VBtn
          icon
          variant="text"
          size="small"
          :disabled="currentPage === 1"
          @click="goToFirstPage"
        >
          <VIcon size="18">
            ri-skip-left-line
          </VIcon>
        </VBtn>
        
        <VBtn
          icon
          variant="text"
          size="small"
          :disabled="currentPage === 1"
          @click="goToPrevPage"
        >
          <VIcon size="18">
            mdi-chevron-left
          </VIcon>
        </VBtn>
        
        <VBtn
          icon
          variant="text"
          size="small"
          :disabled="currentPage === totalPages"
          @click="goToNextPage"
        >
          <VIcon size="18">
            mdi-chevron-right
          </VIcon>
        </VBtn>
        
        <VBtn
          icon
          variant="text"
          size="small"
          :disabled="currentPage === totalPages"
          @click="goToLastPage"
        >
          <VIcon size="18">
            ri-skip-right-line
          </VIcon>
        </VBtn>
      </div>
    </div>
  </VCardText>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref, watch } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  selectedItemsPerPage: {
    type: [Number, String],
    default: 10,
  },
})

const emit = defineEmits([
  'update:selectedItemsPerPage',
  'goFirstPage',
  'goPrevPage',
  'goNextPage',
  'goLastPage',
])

// Local ref for selected items per page
const localSelectedItemsPerPage = ref(props.selectedItemsPerPage)

// Watch for changes from parent
watch(() => props.selectedItemsPerPage, newValue => {
  localSelectedItemsPerPage.value = newValue
})

const pageSizeOptions = [10, 25, 50, 100, 'All']

const startItem = computed(() => {
  if (props.totalItems === 0) return 0
  
  return (props.currentPage - 1) * props.itemsPerPage + 1
})

const endItem = computed(() => {
  if (props.totalItems === 0) return 0
  
  return Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
})

const totalPages = computed(() => {
  if (props.totalItems === 0) return 1
  
  return Math.ceil(props.totalItems / props.itemsPerPage)
})

const onItemsPerPageChange = value => {
  emit('update:selectedItemsPerPage', value)
}

const goToFirstPage = () => {
  if (props.currentPage !== 1) {
    emit('goFirstPage')
  }
}

const goToPrevPage = () => {
  if (props.currentPage > 1) {
    emit('goPrevPage')
  }
}

const goToNextPage = () => {
  if (props.currentPage < totalPages.value) {
    emit('goNextPage')
  }
}

const goToLastPage = () => {
  if (props.currentPage !== totalPages.value) {
    emit('goLastPage')
  }
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: 12px;
}

.pagination-container .v-btn {
  min-width: 32px;
  height: 32px;
}

.pagination-container .v-btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
