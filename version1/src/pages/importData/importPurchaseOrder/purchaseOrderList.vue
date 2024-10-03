<script setup>
import PurchaseOrderList from '@/views/importData/importPurchaseOrder/purchaseOrderList.vue'
</script>

<template>
  <VRow class="match-height">
    <!-- 👉 User List -->
    <VCol
      cols="12"
      md="12"
    >
      <PurchaseOrderList />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
