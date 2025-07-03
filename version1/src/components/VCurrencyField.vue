<script setup>
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
  modelValue: Number, // Vue 2: value
})


const { inputRef, formattedValue, setValue } = useCurrencyInput({
  currency: 'THB',
  hideCurrencySymbolOnFocus: true,
  hideGroupingSeparatorOnFocus: false,
  precision: 4,

  // valueRange: { min: 0 },
  currencyDisplay: CurrencyDisplay.hidden,
})

watch(
  () => props.modelValue, // Vue 2: props.value
  value => {
    setValue(value)
  },
)

var handleInput = (async event =>{
  if(event.key == "-"){
    event.preventDefault()
  }
})

const textStart = ref(props.textStart)
</script>

<template>
  <VTextField
    ref="inputRef"
    v-model="formattedValue"
    density="compact"
    variant="solo"
    @keypress="handleInput"
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
