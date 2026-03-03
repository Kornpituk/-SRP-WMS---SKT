<template>
  <BaseMasterCrud
    title="Carrier"
    :fields="fields"
    :service="carrierService"
    delete-name-key="id"
  />
</template>

<script setup>
import BaseMasterCrud           from '../components/BaseMasterCrud.vue'
import { fields }               from './field/Field'
import { carrierService } from './services/carrier.service'
</script>
