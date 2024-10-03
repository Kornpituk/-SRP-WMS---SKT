<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { ref, watchEffect } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api'  //---------------------- Import Api for Url *****

//------------------------ Get Where House Name From LocalStorage and define to whereHouseSelectedItem ---------------------------
const whereHouse = localStorage.getItem('whereHouseName')
const whereHouseSelectedItem = ref(whereHouse)

const products = ref([]) //---------------- variable for get All Product From X-Location(Where House) *****

// Get access token from localStorage in another page
const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')

//-------------------------------- Tabs --------------------------------
const currentTab = ref(0)

import IndexTIE from '../shipping/tableInvoice/indexTIE.vue' 
import IndexTIP from '../shipping/tableInvoice/indexTIP.vue' 
import IndexTIX from '../shipping/tableInvoice/indexTIX.vue'
 
const tabs = [
  {
    title: 'TIE',
    component: IndexTIE,
  },
  {
    title: 'TIP',
    component: IndexTIP,
  },
  {
    title: 'TIX',
    component: IndexTIX,
  },
]
</script>

<template>
  <!-- Tabs -->
  <section>
    <div>
      <VTabs
        v-if="false"
        v-model="currentTab"
        :touch="touchless"
        mandatory
        grow
      >
        <VTab
          v-for="(tab, index) in tabs"
          :key="index"
          mandatory

          :touch="touchless"
        >
          {{ tab.title }}
        </VTab>
      </VTabs>

      <div
        v-for="(tab, index) in tabs"
        :key="index"
      >
        <Component
          :is="tab.component"
          v-if="currentTab === index"
        />
      </div>
    </div>
  </section>

  <!-- Footer -->
  <section
    v-if="false"
    section
    class="fixed-bottom"
  >
    <VCard>
      <VCardText>
        <VAlert
          color="red-lighten-3"
          style="font-size: 20px;"
        >
          (Demo) Shipment  - Version : 2.1  - Data 24 Row
        </VAlert>
      </VCardText>
    </VCard>
  </section>
</template>

<style lang="scss">
.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}

// Hover For Image Product
.image-transition {
  transition: inline-size 0.2s, inline-size 0.2s;
}

.fixed-bottom {
  position: fixed;
  justify-content: center;
  inline-size: 95%;
  inset-block-end: 0;
}

.custom-table {
  border-collapse: collapse;
  border-spacing: 0;
  inline-size: 100%;
}

.custom-table,
.custom-table th,
.custom-table td {
  border: 1px solid black;
}

.custom-table th,
.custom-table td {
  padding: 8px;
  text-align: start;
}

.custom-table td {
  font-weight: 400;
}

.header {
  justify-content: space-between;
  font-weight: bold;
  text-align: center;
}
</style>

