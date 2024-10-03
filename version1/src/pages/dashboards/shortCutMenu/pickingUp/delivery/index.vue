<script setup>
import IndexPickingUpDelivery from '@/views/dashboard/main/shortCutMenu/pickingUp/delivery/index.vue'
</script>

<template>
  <VRow class="match-height">
    <!-- 👉 User List -->
    <VCol
      cols="12"
      md="12"
    >
      <IndexPickingUpDelivery />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
