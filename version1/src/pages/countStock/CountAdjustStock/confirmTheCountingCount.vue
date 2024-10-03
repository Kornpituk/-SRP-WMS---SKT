<script setup>
import ConfirmTheCountingCount from '@/views/countStock/CountAdjustStock/confirmTheCountingCount.vue'
</script>

<template>
  <VRow class="match-height">
    <!-- 👉 User List -->
    <VCol
      cols="12"
      md="12"
    >
      <ConfirmTheCountingCount />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
