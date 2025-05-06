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
const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')

//-------------------------------- Tabs --------------------------------
const currentTab = ref(0)

import IndexTIE from '../shipping/tableInvoice/indexTIE.vue' 
</script>

<template>
  <!-- Tabs -->
  <section>
    <div>
      <IndexTIE />
    </div>
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

