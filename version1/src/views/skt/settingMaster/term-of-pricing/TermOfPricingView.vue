<template>
  <BaseMasterCrud
    title="Term of Pricing"
    :fields="fields"
    :service="termofpricingService"
    delete-name-key="id"
  />
</template>

<script setup>
import BaseMasterCrud           from '../components/BaseMasterCrud.vue'
import { fields }               from './types/termofpricing.types'
import { termofpricingService } from './services/termofpricing.service'
</script>
