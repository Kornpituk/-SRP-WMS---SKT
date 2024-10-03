<script setup>
import ImportPurchaseOrderDelivery from '@/views/importData/importDeliveryNote/importPurchaseOrderDelivery.vue'
</script>

<template>
  <VRow class="match-height">
    <!-- 👉 User List -->
    <VCol
      cols="12"
      md="12"
    >
      <ImportPurchaseOrderDelivery />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
