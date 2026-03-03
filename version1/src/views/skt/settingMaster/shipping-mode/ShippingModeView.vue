<template>
  <BaseMasterCrud
    title="Shipping Mode"
    :fields="fields"
    :service="shippingmodeService"
    delete-name-key="id"
  />
</template>

<script setup>
import BaseMasterCrud           from '../components/BaseMasterCrud.vue'
import { fields }               from './field/Field'
import { shippingmodeService } from './services/shippingmode.service'
</script>
