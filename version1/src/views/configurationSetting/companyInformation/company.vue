<script setup>
import { useRoute } from 'vue-router'
import AccountSettingsAccount from '@/views/pages/account-settings/AccountSettingsAccount.vue'
import AccountSettingsBillingAndPlans from '@/views/pages/account-settings/AccountSettingsBillingAndPlans.vue'
import AccountSettingsConnections from '@/views/pages/account-settings/AccountSettingsConnections.vue'
import AccountSettingsNotification from '@/views/pages/account-settings/AccountSettingsNotification.vue'
import AccountSettingsConfig from '@/views/pages/account-settings/AccountSettingsConfig.vue'
import AccountSettingsSecurity from '@/views/pages/account-settings/AccountSettingsSecurity.vue'

//------------------ new company information -----------------
import CompanyInformation from '@/views/configurationSetting/companyInformation/information/company.vue'

const route = useRoute()
const activeTab = ref(route.params.tab)

// tabs
const tabs = [
  {
    title: 'Company',
    icon: 'mdi-account-outline',
    tab: 'company',
  },

  // {
  //   title: 'Security',
  //   icon: 'mdi-lock-open-outline',
  //   tab: 'security',
  // },
  // {
  //   title: 'Billing & Plans',
  //   icon: 'mdi-bookmark-outline',
  //   tab: 'billing-plans',
  // },
  // {
  //   title: 'Notifications',
  //   icon: 'mdi-bell-outline',
  //   tab: 'notification',
  // },
  // {
  //   title: 'Config',
  //   icon: 'mdi-bell-outline',
  //   tab: 'config',
  // },

  // {
  //   title: 'Connections',
  //   icon: 'mdi-link-variant',
  //   tab: 'connection',
  // },
]
</script>

<template>
  <div>
    <VWindow
      v-model="activeTab"
      class="mt-5 disable-tab-transition"
      :touch="false"
    >
      <!-- company -->
      <VWindowItem value="account">
        <CompanyInformation />
      </VWindowItem>

      <!-- Security -->
      <VWindowItem value="security">
        <AccountSettingsSecurity />
      </VWindowItem>

      <!-- Billing -->
      <VWindowItem value="billing-plans">
        <AccountSettingsBillingAndPlans />
      </VWindowItem>

      <!-- Notification -->
      <VWindowItem value="notification">
        <AccountSettingsNotification />
      </VWindowItem>

      <!-- Config -->
      <VWindowItem value="config">
        <AccountSettingsConfig />
      </VWindowItem>

      <!-- Connections -->
      <VWindowItem value="connection">
        <AccountSettingsConnections />
      </VWindowItem>
    </VWindow>
  </div>
</template>

<route lang="yaml">
meta:
  navActiveLink: pages-account-settings-tab
</route>
