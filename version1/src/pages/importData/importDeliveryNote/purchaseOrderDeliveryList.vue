<script setup>
import PurchaseOrderDeliveryList from '@/views/importData/importDeliveryNote/purchaseOrderDeliveryList.vue'
</script>

<template>
  <VRow class="match-height">
    <!-- 👉 User List -->
    <VCol
      cols="12"
      md="12"
    >
      <PurchaseOrderDeliveryList />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
