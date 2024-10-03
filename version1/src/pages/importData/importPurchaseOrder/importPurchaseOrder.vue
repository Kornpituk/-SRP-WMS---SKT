<script setup>
import ImportPurchaseOrder from '@/views/importData/importPurchaseOrder/importPurchaseOrder.vue'
</script>

<template>
  <VRow class="match-height">
    <!-- 👉 User List -->
    <VCol
      cols="12"
      md="12"
    >
      <ImportPurchaseOrder />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
