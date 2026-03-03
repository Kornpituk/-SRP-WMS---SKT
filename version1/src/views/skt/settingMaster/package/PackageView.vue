<template>
  <BaseMasterCrud
    title="Package"
    :fields="fields"
    :service="packageService"
    delete-name-key="id"
  />
</template>

<script setup>
import BaseMasterCrud           from '../components/BaseMasterCrud.vue'
import { fields }               from './field/Field'
import { packageService } from './services/package.service'
</script>
