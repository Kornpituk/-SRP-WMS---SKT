<script setup>
import IndexReceivedTransferIn from '@/views/dashboard/main/shortCutMenu/received/transferIn/index.vue'
</script>

<template>
  <VRow class="match-height">
    <!-- 👉 User List -->
    <VCol
      cols="12"
      md="12"
    >
      <IndexReceivedTransferIn />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
