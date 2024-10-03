<script setup>
import CompletedStock from '@/views/countStock/CountAdjustStock/completedStock.vue'
</script>

<template>
  <VRow class="match-height">
    <!-- 👉 User List -->
    <VCol
      cols="12"
      md="12"
    >
      <CompletedStock />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
