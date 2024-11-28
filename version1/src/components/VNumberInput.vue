<script setup>
import { ref, watch } from 'vue'
import { CurrencyDisplay, useCurrencyInput } from 'vue-currency-input'

const props = defineProps({
  textStart: {
    type: String,
    required: false,
  },
  textEnd: {
    type: String,
    required: false,
  },
  valueRange: {
    type: Number,
    required: false,
  },
})


const { inputRef, formattedValue, setValue } = useCurrencyInput({
  currency: 'THB',
  hideCurrencySymbolOnFocus: true,
  hideGroupingSeparatorOnFocus: true,
  precision: 0,
  valueRange: { max: props.valueRange },
  currencyDisplay: CurrencyDisplay.hidden,
})

const internalValue = ref('')

watch(formattedValue, newValue => {
  // Limit the input to a maximum of 2 digits
  if(newValue != null){
    if (newValue.length > 2) {
    // Strip any non-digit characters (e.g., commas) and limit to 2 digits
      internalValue.value = newValue.slice(0, 2)
      setValue(internalValue.value)
    } else {
      internalValue.value = newValue
    }
  }
}, { immediate: true })
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
        {{ props.textStart }}
      </VLabel>
    </template>
    <template #append>
      <VLabel>
        {{ props.textEnd }}
      </VLabel>
    </template>
  </VTextField>
</template>
