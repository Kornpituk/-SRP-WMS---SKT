<script setup>
import CrmAward from '@/views/dashboard/crm/CrmAward.vue'
import CrmExternalLinks from '@/views/dashboard/crm/CrmExternalLinks.vue'
import CrmGrowthDonutCharts from '@/views/dashboard/crm/CrmGrowthDonutCharts.vue'
import CrmMeetingSchedule from '@/views/dashboard/crm/CrmMeetingSchedule.vue'
import CrmMonthlyBudget from '@/views/dashboard/crm/CrmMonthlyBudget.vue'
import CrmMostSalesInCountries from '@/views/dashboard/crm/CrmMostSalesInCountries.vue'
import CrmOrganicSessions from '@/views/dashboard/crm/CrmOrganicSessions.vue'
import CrmPaymentHistory from '@/views/dashboard/crm/CrmPaymentHistory.vue'
import CrmProfitBarWithGapCharts from '@/views/dashboard/crm/CrmProfitBarWithGapCharts.vue'
import CrmProjectTimeline from '@/views/dashboard/crm/CrmProjectTimeline.vue'
import CrmSocialNetworkVisits from '@/views/dashboard/crm/CrmSocialNetworkVisits.vue'
import CrmUserList from '@/views/dashboard/crm/CrmUserList.vue'
import CrmWeeklyOverview from '@/views/dashboard/crm/CrmWeeklyOverview.vue'
</script>

<template>
  <VRow class="match-height">
    <!-- 👉 Award -->
    <VCol
      cols="12"
      md="4"
    >
      <CrmAward />
    </VCol>

    <!-- 👉 Total Orders -->
    <VCol
      cols="12"
      sm="3"
      md="2"
    >
      <CardStatisticsVertical  
        v-bind="{
          title: 'Total Orders',
          color: 'primary',
          icon: 'mdi-cart-plus',
          stats: '155k',
          change: 22,
          subtitle: 'Last 4 Month',
        }"
      />
    </VCol>

    <!-- 👉 Total Sales -->
    <VCol
      cols="12"
      sm="3"
      md="2"
    >
      <CardStatisticsVertical
        v-bind="{
          title: 'Total Sales',
          color: 'success',
          icon: 'mdi-currency-usd',
          stats: '$13.4k',
          change: 38,
          subtitle: 'Last Six Months',
        }"
      />
    </VCol>

    <!-- 👉 Profile Line Charts -->
    <VCol
      cols="12"
      sm="3"
      md="2"
    >
      <CrmProfitBarWithGapCharts />
    </VCol>

    <!-- 👉 Total Growth -->
    <VCol
      cols="12"
      md="2"
      sm="3"
    >
      <CrmGrowthDonutCharts />
    </VCol>

    <!-- 👉 Organic Sessions -->
    <VCol
      cols="12"
      md="4"
    >
      <CrmOrganicSessions />
    </VCol>

    <!-- 👉 Project Timeline -->
    <VCol
      cols="12"
      md="8"
    >
      <CrmProjectTimeline />
    </VCol>

    <!-- 👉 Weekly Overview -->
    <VCol
      cols="12"
      sm="6"
      md="4"
    >
      <CrmWeeklyOverview />
    </VCol>

    <!-- 👉 Social Network Visits -->
    <VCol
      cols="12"
      sm="6"
      md="4"
    >
      <CrmSocialNetworkVisits />
    </VCol>

    <!-- 👉 Monthly Budget -->
    <VCol
      cols="12"
      md="4"
      sm="6"
    >
      <CrmMonthlyBudget />
    </VCol>

    <!-- 👉 Meeting Schedule -->
    <VCol
      cols="12"
      md="4"
      sm="6"
    >
      <CrmMeetingSchedule />
    </VCol>

    <!-- 👉 External Links -->
    <VCol
      cols="12"
      sm="6"
      md="4"
    >
      <CrmExternalLinks />
    </VCol>

    <!-- 👉 Payment History -->
    <VCol
      cols="12"
      sm="6"
      md="4"
    >
      <CrmPaymentHistory />
    </VCol>

    <!-- 👉 Most Sales in Countries -->
    <VCol
      cols="12"
      md="4"
    >
      <CrmMostSalesInCountries />
    </VCol>

    <!-- 👉 User List -->
    <VCol
      cols="12"
      md="8"
    >
      <CrmUserList />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
