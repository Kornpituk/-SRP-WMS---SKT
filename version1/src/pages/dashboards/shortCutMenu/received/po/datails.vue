<script setup>
import IndexReceivedPODetails from '@/views/dashboard/main/shortCutMenu/received/po/datails.vue'
</script>

<template>
  <VRow class="match-height">
    <!-- 👉 User List -->
    <VCol
      cols="12"
      md="12"
    >
      <IndexReceivedPODetails />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
