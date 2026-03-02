<template>
  <BaseMasterCrud
    title="Term of Payment"
    :fields="fields"
    :service="termOfPaymentService"
    delete-name-key="termOfPaymentName"
  />
</template>

<script setup>
import BaseMasterCrud           from '../components/BaseMasterCrud.vue'
import { fields }               from './types/TermOfPaymentView'
import { termOfPaymentService } from './services/termofpayment.service'
</script>
