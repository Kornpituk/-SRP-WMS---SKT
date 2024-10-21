
<script setup>
import axiosIns from '@axios'
import { urlApi } from '@/api' //---------------------- Import Api for Url *****
import { inject, defineProps, watchEffect } from 'vue'

const props = defineProps({
  Data: Array,
})

const route = useRoute()
const whereHouse = ref(localStorage.getItem('whereHouseName'))
const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')

const dataProps = ref(JSON.parse(route.query.Data || '[]'))

const a = ref('A')

const currentTableWatchSesstion = ref(0)

import RawMatForm from '../rawMat/index.vue' 
import LorryLoadingCal from '../lorryForm/flow/index.vue' 
import RawMatInspec from '../inspecReqForm/index.vue'
import PackagingInspec from '../packagingForm/index.vue'

const checkStatus = status => {
  switch (status) {
  case 'Cancel':
    return 'grey-darken-1'
  case 'Waiting for Receiving':
    return 'pink-darken-2'
  case 'ETL Failed!':
    return 'deep-orange-darken-3'
  case 'Draft Receiving Form':
    return 'yellow-darken-3'
  case 'Waiting for Inspection':
    return 'pink-lighten-3'
  case 'Draft R/M Inspection Form':
    return 'amber-darken-2'
  case 'Waiting for Inspection Approval':
    return 'green-darken-2'
  case 'Waiting for Warehouse Rejection':
    return 'red-lighten-1'
  case 'Waiting for Editing for Partial Receiving':
    return 'light-blue-lighten-1'
  case 'Waiting for Partial-Receiving':
    return 'pink-darken-2'
  case 'Draft Packaging Inspection Form':
    return 'amber-darken-4'
  case 'Waiting for Mobile Receiving':
    return 'pink-darken-2'
  case 'Waiting for Lorry Loading':
    return 'pink-darken-2'
  case 'Draft Mobile Receiving':
    return 'orange-darken-2'
  case 'Draft Lorry Loading':
    return 'orange-darken-2'
  case 'Waiting for Warehouse Approval':
    return 'teal'
  case 'Receiving Rejected':
    return 'red-darken-2'
  case 'Receiving Completed':
    return 'green-darken-2'
  default:
    return 'grey'
  }
}

const colorStatusWithId = id => {
  switch (id) {
  case 0:
    return { color: 'grey-darken-1', message: 'grey-darken-1' }
  case 1:
    return { color: 'red', message: 'red' }
  case 2:
    return { color: 'pink', message: 'pink-darken-4' }
  case 3:
    return { color: 'purple', message: 'purple' }
  case 4:
    return { color: 'deep-purple', message: 'deep-purple' }
  case 5:
    return { color: 'indigo', message: 'indigo' }
  case 6:
    return { color: 'blue', message: 'blue' }
  case 7:
    return { color: 'light-blue', message: 'light-blue' }
  case 8:
    return { color: 'cyan', message: 'cyan-darken-4' }
  case 9:
    return { color: 'teal', message: 'teal' }
  case 10:
    return { color: 'light-green', message: 'cycan' }
  case 11:
    return { color: 'lime', message: 'cycan' }
  case 12:
    return { color: 'yellow', message: 'brown' }
  case 13:
    return { color: 'orange', message: 'orange' }
  case 14:
    return { color: 'deep-orange', message: 'deep-orange-derken-4' }
  case 15:
    return { color: 'brown', message: 'brown' }
  case 16:
    return { color: 'red-darken-2', message: 'red-darken-2' }
  case 17:
    return { color: 'green-darken-2', message: 'green-darken-2' }
  default:
    return { color: 'grey', message: 'grey' }
  }
}

// sessionStorage.setItem('accountRole',  'manager')

const userRole = ref(sessionStorage.getItem('accountRole') || 'issues')

// Watch for changes to userRole and update sessionStorage accordingly
watch(userRole, newValue => {
  if(newValue){
    sessionStorage.setItem('accountRole', newValue)
    location.reload()
  }
  
})

watchEffect(() => {
  console.log(dataProps.value)
})

const tabs = [
  {
    title: 'R/M Receiving Form',
    component: RawMatForm,
    icon: 'ri-folder-received-fill',
  },
  {
    title: 'R/M Inspection Request Form',
    component: RawMatInspec,
    icon: 'ri-uninstall-fill',
  },
]

const tabs3 = [
  {
    title: 'R/M Receiving Form',
    component: RawMatForm,
    icon: 'ri-folder-received-fill',
  },
  {
    title: 'R/M Inspection Request Form',
    component: RawMatInspec,
    icon: 'ri-uninstall-fill',
  },
  {
    title: 'Lorry Loading Check List',
    component: LorryLoadingCal,
    icon: 'ri-instance-fill',
  },
]

const tabs2 = [
  {
    title: 'Packaging Inspection Request Form',
    component: PackagingInspec,
    icon: 'ri-instance-fill',
  },
]

const tabDisablingConfig = {
  1: {
    manager: ['R/M Inspection Request Form', 'Lorry Loading Check List'],
    issues: ['R/M Inspection Request Form', 'Lorry Loading Check List'],
  },
  3: {
    manager: ['R/M Inspection Request Form', 'Lorry Loading Check List'],
    issues: ['R/M Inspection Request Form', 'Lorry Loading Check List'],
  },
  4: {
    manager: [ 'Lorry Loading Check List'],
    issues: [ 'Lorry Loading Check List'],
  },
  5: {
    manager: [ 'Lorry Loading Check List'],
    issues: [ 'Lorry Loading Check List'],
  },
  6: {
    manager: [ 'Lorry Loading Check List'],
    issues: [ 'Lorry Loading Check List'],
  },
  7: {
    manager: [ 'Lorry Loading Check List'],
    issues: [ 'Lorry Loading Check List'],
  },
  8: {
    manager: ['R/M Inspection Request Form', 'Lorry Loading Check List'],
    issues: ['R/M Inspection Request Form', 'Lorry Loading Check List'],
  },
  10: {
    manager: ['R/M Inspection Request Form', 'Lorry Loading Check List', 'R/M Receiving Form'],
    issues: ['R/M Inspection Request Form', 'Lorry Loading Check List', 'R/M Receiving Form'],
  },

  // Add more statuses and role combinations as needed
}

const tabConfig = {

  /// Packaging = 1 , Raw Material Receiving 2, Lorry 3 , NUll 0

  0: {
    manager: ['Raw Material Inspection Request Form', 'Lorry Loading Check List', 'Raw Material Receiving Form'],
    issues: ['Raw Material Inspection Request Form', 'Lorry Loading Check List', 'Raw Material Receiving Form'],
  },
  1: {
    manager: ['Raw Material Inspection Request Form', 'Lorry Loading Check List'],
    issues: ['Raw Material Inspection Request Form', 'Lorry Loading Check List'],
  },
  2: {
    manager: [ 'Lorry Loading Check List'],
    issues: [ 'Lorry Loading Check List'],
  },
  'Draft R/M Inspection Form': {
    manager: [ 'Lorry Loading Check List'],
    issues: [ 'Lorry Loading Check List'],
  },
  'Waiting for Inspection Approval': {
    manager: [ 'Lorry Loading Check List'],
    issues: [ 'Lorry Loading Check List'],
  },
  'Waiting for Warehouse Rejection': {
    manager: [ 'Lorry Loading Check List'],
    issues: [ 'Lorry Loading Check List'],
  },
  'Waiting for Partial-Receiving': {
    manager: ['Raw Material Inspection Request Form', 'Lorry Loading Check List'],
    issues: ['Raw Material Inspection Request Form', 'Lorry Loading Check List'],
  },
  'Draft Packaging Inspection Form': {
    manager: ['Raw Material Inspection Request Form', 'Lorry Loading Check List', 'Raw Material Receiving Form'],
    issues: ['Raw Material Inspection Request Form', 'Lorry Loading Check List', 'Raw Material Receiving Form'],
  },

  // Add more statuses and role combinations as needed
}

// Configuration to specify which tab index to show based on status
const tabIndexConfig = {
  1: 0,  // Show tab index 1 for this status
  3: 0,   // Show tab index 0 for this status
  4: 1, // Show tab index 2 for this status
  5: 1,
  6: 1,
  7: 1,
  8: 0,
  10: 0,
  12: 2,
  13: 2,

  // Add more statuses and indices as needed
}

const getDisabledTabs = () => {
  const status = dataProps.value.statusId
  const role = userRole.value
  
  // console.log('Status:', status)
  // console.log('Role:', role)
  // console.log('Disabled Tabs:', tabDisablingConfig[status]?.[role])
  
  return tabDisablingConfig[status]?.[role] || []
}

const getCurrentTabIndex = () => {
  const status = dataProps.value.statusId

  return tabIndexConfig[status] !== undefined ? tabIndexConfig[status] : 0
}

// console.log('***Current Tab Index:', getCurrentTabIndex())

const currentTab = ref(getCurrentTabIndex())

const isActive = ref(true)

//------------- journalId
const responseGener = ref([])

const statusId = ref(null) // ตัวแปรสำหรับเก็บค่า statusId
const receivedTypeId = ref(null) // ตัวแปรสำหรับเก็บค่า statusId

const generatedJournalId = () => {
  axiosIns.get(`${urlApi.value}/api/v1/ReceivingPlan/GetByPoEtlLogDetailJournalID/${dataProps.value.poEtlLogDetailJournalID}`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`, 
    },
  },
  {})
    .then(response => {
      console.log('%c[generatedJournalId] raw mat!!: ', "color: green; font-weight: bold", response.data)

      // ตรวจสอบว่ามีข้อมูลใน response.data.data ก่อน
      if (response.data && response.data.data && response.data.data.length > 0) {
        responseGener.value = response.data.data // เก็บค่า response.data.data ลงใน responseGener

        const item = responseGener.value[0] // เข้าถึงข้อมูลตัวแรกใน array

        receivedTypeId.value = item.receiveTypeId // เก็บค่า statusId
        statusId.value = item.statusId // เก็บค่า statusId
      } else {
        console.error("ไม่มีข้อมูลใน responseGener")
      }
    })
    .catch(error => {
      console.error('Error:', error)
    })
}

const generated = () => {

  axiosIns.post(`${urlApi.value}/api/v1/ReceivingForm/generate?poEtlLogDetailJournalID=${data.value.poEtlLogDetailJournalID}`, {}, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`, 
    },
  },
  {})
    .then(response => {

      // itemsManufacturer.value = response.data.data

      console.log('[generatedReceivingForm]!!: ', response.data.data)

    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })
}

// Watch ค่า statusId และเรียกใช้ generated ถ้ามีการเปลี่ยนแปลง
watch(statusId.value, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    generated() // เรียกใช้ function generated เมื่อ statusId เปลี่ยน
  }
})

// เรียกใช้ generatedJournalId เมื่อ component ถูกสร้างขึ้น
onMounted(() => {
  generatedJournalId()
})

//---------------------------------- Approve ------------------------------------
const wordForSubmit = ref('')

const isDialogConfirmVisible = ref(false)
const isDialogSubmitSuccessVisible = ref(false)
const isDialogSubmitFailedVisible = ref(false)

const btnApprove = word => {
  isDialogConfirmVisible.value = true
  console.log("word")
  wordForSubmit.value = word

}

const handleAcceptPackaging = word => {
  console.log("StaertSSSSS!!")
  axiosIns.post(`${urlApi.value}/api/v1/ReceivingPlan/whapproval/${dataProps.value.poEtlLogDetailJournalID}`, {}, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`, 
    },
    params: {
      stockId: whereHouse.value,
    },
  },
  {})
    .then(response => {
      console.log('[products.value]!!: ', response.data)
      window.location.reload()
      isDialogSubmitSuccessVisible.value = true
      isDialogConfirmVisible.value = false

     
    
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
      isDialogSubmitFailedVisible.value = true
    })
}
</script>

<template>
  <div v-if="false">
    <span />
    <VAlert

      border="top"
      type="error"
      variant="flat"
      prominent
    >
      Failded To Loading Page, Plaease Back To Receving Plant.
    </VAlert>
  </div>
  <VCard
    v-if="false"
    hover
    style="position: fixed; min-width: 95%; opacity: 1 !important;"
    elevation="6"
  >
    <VCardText>
      <VTabs
        v-model="currentTab"
        grow
      >
        <VTab
          v-for="(tab, index) in tabs"
          :key="index"
        >
          <VIcon
            v-if="false"
            :icon="tab.icon"
            size="40"
          />
          <span style="font-size: 22px; font-weight: bolder;">{{ tab.title }}</span>
        </VTab>
      </VTabs>
    </VCardText>
  </VCard>
  <div v-if="receivedTypeId === 2">
    <VTabs
      v-model="currentTab"
      grow
    >
      <VTab
        v-for="(tab, index) in tabs"
        :key="index"
        :disabled="getDisabledTabs().includes(tab.title)"
      >
        <VIcon
          v-if="false"
          :icon="tab.icon"
          size="40"
        />
        <span style="font-size: 18px; font-weight: bolder;">{{ tab.title }}</span>
      </VTab>
    </VTabs>
  </div>
  <div v-if="receivedTypeId === 3">
    <VTabs
      v-model="currentTab"
      grow
    >
      <VTab
        v-for="(tab, index) in tabs3"
        :key="index"
        :disabled="getDisabledTabs().includes(tab.title)"
        style="font-size: 12px; font-weight: bolder;"
      >
        <VIcon
          v-if="false"
          :icon="tab.icon"
          size="40"
        />
        <span style="font-size: 18px; font-weight: bolder;">{{ tab.title }}</span>
      </VTab>
    </VTabs>
  </div>
  <div v-if="receivedTypeId === 1">
    <VTabs
      v-model="currentTab"
      grow
    >
      <VTab
        v-for="(tab, index) in tabs2"
        :key="index"
        :disabled="getDisabledTabs().includes(tab.title)"
        style="font-size: 12px; font-weight: bolder;"
      >
        <VIcon
          v-if="false"
          :icon="tab.icon"
          size="40"
        />
        <span style="font-size: 18px; font-weight: bolder;">{{ tab.title }}</span>
      </VTab>
    </VTabs>
  </div>

  <div v-if="false">
    <section>
      <VAlert
        title="Alert Wrong Step"
        type="error"
        closable
      >
        asdasdasdasasd
      </VAlert>
    </section>
  </div>

  <!-- min Menu -->
  <div style="position: fixed;">
    <VBtn
      :to="{ name: 'skt-receiving',
      }"
      class="mx-2 my-2"
      size="40"
      
      icon
    >
      <VIcon
        size="40"
        icon="ri-arrow-left-s-line"
      />
    </VBtn>
    <VBtn
      v-if="false"
      :icon="isActive ? 'ri-close-fill' : 'ri-menu-fill'"
      @click="isActive = !isActive"
    />
    <VChip
      v-if="false"
      class="mx-2"
      style="min-height: 40px;"
      :color="colorStatusWithId(dataProps.statusId).color"
      variant="elevated"
      closable
    >
      <span
        class="text-wrap"
        style="font-size: 12px; text-transform: capitalize;"
      >{{ dataProps.statusText }}</span>
    </VChip>
    <VChip
      v-if="false"
      class=""
      style="min-height: 40px;"
      variant="elevated"
      closable
    >
      <VSwitch
        v-model="userRole"
        inset
        false-value="issues"
        true-value="manager"
      />
      <span
        class="text-wrap mx-2"
        style="font-size: 16px; text-transform: capitalize;"
      >{{ userRole }}</span>
    </VChip>
  </div>

  <div v-if="receivedTypeId === 2">
    <div
      v-for="(tab, index) in tabs"
      :key="index"
      class="mt-20"
    >
      <Component
        :is="tab.component"
        v-if="currentTab === index"
      />
    </div>
  </div>
  <div v-if=" receivedTypeId === 3">
    <div
      v-for="(tab, index) in tabs3"
      :key="index"
      class="mt-20"
    >
      <Component
        :is="tab.component"
        v-if="currentTab === index"
      />
    </div>
  </div>
  <div v-if="receivedTypeId === 1">
    <div
      v-for="(tab, index) in tabs2"
      :key="index"
      class="mt-20"
    >
      <Component
        :is="tab.component"
        v-if="currentTab === index"
      />
    </div>
  </div>

  <div
    v-if="statusId === 7 || statusId === 15"
    style="position: fixed;
          display: flex;
          box-sizing: border-box;
          justify-content: start;
          padding: 8px;
          inline-size: 105vw;
          inset-block-end: 0;
          margin-block-end: 598px;
          margin-inline-start: 50px;
          max-inline-size: 1500vw; /* ไม่ให้เกินขอบหน้าจอ */"
    class="d-flex justify-start"
  >
    <VBtn
      class="mb-2"
      @click="btnApprove('APPROVE')"
    >
      Approve
    </VBtn>
  </div>

  <!-- Dialog Submit -->
  <section>
    <VDialog
      v-model="isDialogConfirmVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardText>
          <div class="d-flex justify-center">
            <VIcon
              size="100"
              color="warning"
              icon="ri-question-line"
            />
          </div>
          <div class="text-center">
            <span style="font-size: 22px; font-weight: bolder;">Would you like to {{ wordForSubmit }}
              Transaction?</span>
          </div>
        </VCardText>

        <VCardAction class="d-flex justify-space-between pa-4">
          <VBtn
            color="error"
            @click="isDialogConfirmVisible = false"
          >
            Cancel
          </VBtn>
          <VBtn
            v-if="wordForSubmit === 'APPROVE'"
            color="green"
            @click="handleAcceptPackaging"
          >
            {{ wordForSubmit }}
          </VBtn>
        </VCardAction>
      </VCard>
    </VDialog>
  </section>
  <!-- Dialog Submit Success -->
  <section>
    <VDialog
      v-model="isDialogSubmitSuccessVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardText>
          <div class="d-flex justify-center">
            <VIcon
              size="100"
              color="success"
              icon="ri-checkbox-circle-line"
            />
          </div>
          <div class="text-center">
            <span style="font-size: 22px; font-weight: bolder;">{{ wordForSubmit }} Success</span>
          </div>
        </VCardText>

        <VCardAction
          v-if="false"
          class="d-flex justify-center pa-4"
        >
          <VBtn
            color="success"
            @click="submitConfirm"
          >
            Continue
          </VBtn>
        </VCardAction>
      </VCard>
    </VDialog>
  </section>
  <!-- Dialog Submit Failed -->
  <section>
    <VDialog
      v-model="isDialogSubmitFailedVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardText>
          <div class="d-flex justify-center">
            <VIcon
              size="100"
              color="error"
              icon="ri-error-warning-line"
            />
          </div>
          <div class="text-center">
            <span style="font-size: 22px; font-weight: bolder;">{{ wordForSubmit }} Failed</span>
          </div>
        </VCardText>

        <VCardAction class="d-flex justify-center pa-4">
          <VBtn
            color="error"
            @click="submitFailed"
          >
            Continue
          </VBtn>
        </VCardAction>
      </VCard>
    </VDialog>
  </section>

  <VDivider />
</template>
