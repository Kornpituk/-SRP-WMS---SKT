<template>
  <BaseMasterCrud
    title="Forwarder"
    :fields="fields"
    :service="forwarderService"
    delete-name-key="forwarderId"
  />
</template>

<script setup>
import BaseMasterCrud           from '../components/BaseMasterCrud.vue'
import { fields }               from './field/Field'
import { forwarderService } from './services/Forwarder.service'
</script>
