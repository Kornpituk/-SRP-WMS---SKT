<script setup>
import { CurrencyDisplay, useCurrencyInput } from 'vue-currency-input'
import { watch, watchEffect } from 'vue'

const props = defineProps({
  textStart: {
    type: String,
    required: false,
  },
  textEnd: {
    type: String,
    required: false,
  },
})


const { inputRef, formattedValue, setValue } = useCurrencyInput({
  currency: 'THB',
  hideCurrencySymbolOnFocus: true,
  hideGroupingSeparatorOnFocus: true,
  precision: 2,
  valueRange: { min: 0 },
  currencyDisplay: CurrencyDisplay.hidden,
})


const textStart = ref(props.textStart)
</script>

<template>
  <VTextField
    ref="inputRef"
    v-model="formattedValue"
    density="compact"
    variant="solo"
  >
    <template #prepend>
      <VLabel>
        {{ textStart }}
      </VLabel>
    </template>
    <template #append>
      <VLabel>
        {{ props.textEnd }}
      </VLabel>
    </template>
  </VTextField>
</template>
