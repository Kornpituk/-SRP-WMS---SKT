<script setup>
import IndexPerformance from '@/views/dashboard/main/shortCutMenu/performance/index.vue'
</script>

<template>
  <VRow class="match-height">
    <!-- 👉 User List -->
    <VCol
      cols="12"
      md="12"
    >
      <IndexPerformance />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
