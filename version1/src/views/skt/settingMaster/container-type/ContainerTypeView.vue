<template>
  <BaseMasterCrud
    title="Container Type"
    :fields="fields"
    :service="containerTypeService"
    delete-name-key="id"
  />
</template>

<script setup>
import BaseMasterCrud           from '../components/BaseMasterCrud.vue'
import { fields }               from './types/port.types'
import { containerTypeService } from './services/containertype.service'
</script>
