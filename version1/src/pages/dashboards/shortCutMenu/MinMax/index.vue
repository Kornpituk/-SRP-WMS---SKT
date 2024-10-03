<script setup>
import IndexMinMax from '@/views/dashboard/main/shortCutMenu/minMax/index.vue'
</script>

<template>
  <VRow class="match-height">
    <!-- 👉 User List -->
    <VCol
      cols="12"
      md="12"
    >
      <IndexMinMax />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
