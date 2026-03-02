<template>
  <BaseMasterCrud
    title="Port"
    :fields="fields"
    :service="ProtService"
    delete-name-key="id"
  />
</template>

<script setup>
import BaseMasterCrud           from '../components/BaseMasterCrud.vue'
import { fields }               from './types/port.types'
import { ProtService } from './services/port.service'
</script>
