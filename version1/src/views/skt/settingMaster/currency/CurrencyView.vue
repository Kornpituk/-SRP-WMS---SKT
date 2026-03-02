<template>
  <BaseMasterCrud
    title="Currency"
    :fields="fields"
    :service="currencyService"
    delete-name-key="id"
  />
</template>

<script setup>
import BaseMasterCrud from '../components/BaseMasterCrud.vue'
import { currencyService } from './services/currency.service'
import { fields } from './types/currency.types'
</script>
