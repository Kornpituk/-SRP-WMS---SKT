<template>
  <BaseMasterCrud
    title="Bank Account No"
    :fields="fields"
    :service="bankaccountnoService"
    delete-name-key="id"
  />
</template>

<script setup>
import BaseMasterCrud           from '../components/BaseMasterCrud.vue'
import { fields }               from './field/Field'
import { bankaccountnoService } from './services/bankaccountno.service'
</script>
