<script setup>
import IndexReceivedPOHeader from '@/views/dashboard/main/shortCutMenu/received/po/header.vue'
</script>

<template>
  <VRow class="match-height">
    <!-- 👉 User List -->
    <VCol
      cols="12"
      md="12"
    >
      <IndexReceivedPOHeader />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
