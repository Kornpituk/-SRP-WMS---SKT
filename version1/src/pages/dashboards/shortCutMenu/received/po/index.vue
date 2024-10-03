<script setup>
import IndexReceivedPO from '@/views/dashboard/main/shortCutMenu/received/po/index.vue'
</script>

<template>
  <VRow class="match-height">
    <!-- 👉 User List -->
    <VCol
      cols="12"
      md="12"
    >
      <IndexReceivedPO />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
