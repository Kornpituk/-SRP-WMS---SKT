<template>
  <BaseMasterCrud
    title="HS Code No"
    :fields="fields"
    :service="hsCodeNoService"
    delete-name-key="id"
  />
</template>

<script setup>
import BaseMasterCrud           from '../components/BaseMasterCrud.vue'
import { fields }               from './field/Field'
import { hsCodeNoService } from './services/hscodeno.service'
</script>
