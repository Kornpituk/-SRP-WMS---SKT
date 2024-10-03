<script setup>
import IndexPickingUpTransferOut from '@/views/dashboard/main/shortCutMenu/pickingUp/transferOut/index.vue'
</script>

<template>
  <VRow class="match-height">
    <!-- 👉 User List -->
    <VCol
      cols="12"
      md="12"
    >
      <IndexPickingUpTransferOut />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
