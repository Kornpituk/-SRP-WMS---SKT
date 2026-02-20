<template>
  <section>
    <VDialog
      v-model="dialogLocal"
      persistent
      max-width="500"
      scrollable
    >
      <VCard>
        <VCardTitle class="d-flex justify-space-between align-center px-4 py-3">
          <span class="text-h6 font-weight-bold text-truncate">
            {{ productData.name || $t('Product Details') }}
          </span>
          <VBtn
            icon="mdi-close"
            variant="text"
            size="small"
            color="grey-darken-1"
            @click="closeDialog"
          />
        </VCardTitle>

        <VDivider />

        <VImg
          class="bg-grey-lighten-4"
          :src="imageSrc"
          cover
          max-height="300"
          width="100%"
          :alt="productData.name"
        />

        <VDivider />

        <VCardActions class="pa-0">
          <VBtn
            block
            variant="text"
            color="primary"
            class="py-3 rounded-0"
            @click="toggleDetails"
          >
            {{ $t('Details') }}
            <VIcon
              class="ms-2"
              :icon="showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            />
          </VBtn>
        </VCardActions>

        <VExpandTransition>
          <div v-show="showDetails">
            <VDivider />
            <VCardText class="pt-4 pb-6">
              <VRow>
                <VCol
                  cols="12"
                  sm="6"
                  class="d-flex flex-column gap-2"
                >
                  <div class="d-flex flex-column">
                    <span class="text-caption text-grey">{{ $t("Code") }}</span>
                    <span class="text-body-1 font-weight-medium">{{ productData.code || '-' }}</span>
                  </div>
                  <div class="d-flex flex-column">
                    <span class="text-caption text-grey">{{ $t("Barcode") }}</span>
                    <span class="text-body-1 font-weight-medium">{{ productData.barcode || '-' }}</span>
                  </div>
                </VCol>

                <VCol
                  cols="12"
                  sm="6"
                  class="d-flex flex-column gap-2"
                >
                  <div class="d-flex flex-column">
                    <span class="text-caption text-grey">{{ $t("Categories") }}</span>
                    <span class="text-body-1 font-weight-medium">{{ productData.categories || '-' }}</span>
                  </div>
                  <div class="d-flex flex-column">
                    <span class="text-caption text-grey">{{ $t("Group") }} / {{ $t("Sup Group") }}</span>
                    <span class="text-body-1 font-weight-medium">
                      {{ productData.group || '-' }} <span v-if="productData.supGroup">/ {{ productData.supGroup }}</span>
                    </span>
                  </div>
                </VCol>

                <VCol
                  cols="12"
                  class="d-flex flex-column gap-2 mt-2"
                >
                  <div
                    v-if="productData.total"
                    class="d-flex justify-space-between align-center bg-grey-lighten-4 pa-3 rounded"
                  >
                    <span class="font-weight-bold">{{ $t("Total") }}</span>
                    <span class="text-h6 text-primary font-weight-bold">
                      {{ formattedTotal }} <span class="text-body-2">{{ productData.unitName }}</span>
                    </span>
                  </div>

                  <div
                    v-if="productData.details?.note"
                    class="d-flex flex-column mt-2"
                  >
                    <span class="text-caption text-grey">{{ $t("Details ") }}</span>
                    <span class="text-body-2">{{ productData.details.note }}</span>
                  </div>
                </VCol>
              </VRow>
            </VCardText>
          </div>
        </VExpandTransition>
      </VCard>
    </VDialog>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  imageSrc: {
    type: String,
    default: '',
  },
  productData: {
    type: Object,
    default: () => ({
      name: '',
      code: '',
      barcode: '',
      categories: '',
      group: '',
      supGroup: '',
      total: 0,
      unitName: '',
      details: {
        note: '',
      },
    }),
  },
  formatDecimal: {
    type: Function,
    default: value => value,
  },
})

const emit = defineEmits(['update:modelValue'])

// Local state
const dialogLocal = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const showDetails = ref(false)

// Methods
const closeDialog = () => {
  dialogLocal.value = false
  showDetails.value = false
}

const toggleDetails = () => {
  showDetails.value = !showDetails.value
}

// Computed
const formattedTotal = computed(() => {
  if (!props.productData.total) return '0'
  
  return props.formatDecimal(props.productData.total).toLocaleString('en-US')
})

// Reset showDetails when dialog closes
watch(() => props.modelValue, newVal => {
  if (!newVal) {
    showDetails.value = false
  }
})
</script>
