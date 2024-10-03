<script setup>
import RfidCountStock from '@/views/countStock/CountingStock/rfidCountingStock.vue'
</script>

<template>
  <VRow class="match-height">
    <!-- 👉 User List -->
    <VCol
      cols="12"
      md="12"
    >
      <RfidCountStock />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
