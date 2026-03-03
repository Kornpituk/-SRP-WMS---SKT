<template>
  <BaseMasterCrud
    title="Sale Person"
    :fields="fields"
    :service="salepersonService"
    delete-name-key="id"
  />
</template>

<script setup>
import BaseMasterCrud           from '../components/BaseMasterCrud.vue'
import { fields }               from './field/Field'
import { salepersonService } from './services/saleperson.service'
</script>
