
<script setup>
import axiosIns from '@axios'
import { urlApi } from '@/api' //---------------------- Import Api for Url *****
import { inject, defineProps, watchEffect, watch, onMounted } from 'vue'

const props = defineProps({
  Data: Array,
})

import { useItemStore } from '@/stores/skt/receingFormStore/itemStore'

import ConfirmDialog from '@/components/dialogs/alert/confirmDialog.vue'
import alertWordConst from '@/utilities/constant'

const isDialogVisibleConfirmDialog = ref(false)
const confirmValueCheck = ref(false)

const itemStore = useItemStore()
const poEtlLogDetailJournalID = itemStore.getItemDetails('poEtlLogDetailJournalIDCookies')

console.log("setItemDetails", poEtlLogDetailJournalID)


const route = useRoute()
const whereHouse = ref(localStorage.getItem('whereHouseName'))
const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')

const dataProps = ref(JSON.parse(route.query.Data || '[]'))

const statusId = ref(itemStore.setItemDetails?.statusId) // ตัวแปรสำหรับเก็บค่า statusId
const receivedTypeId = ref(null) // ตัวแปรสำหรับเก็บค่า statusId

const a = ref('A')

const currentTableWatchSesstion = ref(0)

import RawMatForm from '../rawMat/index.vue' 
import LorryLoadingCal from '../lorryForm/flow/index.vue' 
import RawMatInspec from '../inspecReqForm/index.vue'
import PackagingInspec from '../packagingForm/index.vue'
import PackagingInspec2 from '../packagingForm/index.vue'
import PackagingInspec3 from '../packagingForm/index.vue'

//---------------- Import Lorry -------------------------------
//--- A1
import LorryLoadingA1IPA from '../lorryForm/a1/IPA.vue'
import LorryLoadingA1EA11V1098C from '../lorryForm/a1/EA11V-1098C.vue'
import LorryLoadingA1EPICHLO from '../lorryForm/a1/EPICHLO.vue'

//--- A2
import LorryLoadingA2SKTV144 from '../lorryForm/a2/SKTV-144.vue'
import LorryLoadingA2SKTV145 from '../lorryForm/a2/SKTV-145.vue'

//--- B1
import LorryLoadingB1KARAMU from '../lorryForm/b1/KARAMU.vue'

//--- C1
import LorryLoadingC1AKUMARU from '../lorryForm/c1/AKUMARU.vue'

//--- C2
import LorryLoadingC2EKIAA111 from '../lorryForm/c2/EKIAA-111.vue'
import LorryLoadingC2HAKU from '../lorryForm/c2/HAKU.vue'

//--- C3
import LorryLoadingC3DieselOil from '../lorryForm/c3/DieselOil.vue'

//--- C4
import LorryLoadingC4EKIAV432 from '../lorryForm/c4/EKIAV-432.vue'
import LorryLoadingC4TELA from '../lorryForm/c4/TELA.vue'

//--- C5
import LorryLoadingC5NPAN30 from '../lorryForm/c5/NPAN30.vue'

//--- C6
import LorryLoadingC6SANNIX from '../lorryForm/c6/SANNIX.vue'

const LorryComponents = {
  '1': () => "IPA", //----- A1
  '2': () => import('@/views/skt/receiving/lorryForm/a1/EA11V-1098C.vue'), //----- A1
  '3': () => import('@/views/skt/receiving/lorryForm/a1/EPICHLO.vue'), //----- A1

  '4': () => import('@/views/skt/receiving/lorryForm/a2/SKTV-144.vue'), //----- A2
  '5': () => import('@/views/skt/receiving/lorryForm/a2/SKTV-145.vue'), //----- A2

  '6': () => import('@/views/skt/receiving/lorryForm/b1/KARAMU.vue'), //----- B1

  '7': () => import('@/views/skt/receiving/lorryForm/c1/AKUMARU.vue'), //----- C1

  '9': () => import('@/views/skt/receiving/lorryForm/c2/HAKU.vue'), //----- C2
  '10': () => import('@/views/skt/receiving/lorryForm/c2/EKIAA-111.vue'), //----- C2

  '11': () => import('@/views/skt/receiving/lorryForm/c3/DieselOil.vue'), //----- C3

  '12': () => import('@/views/skt/receiving/lorryForm/c4/TELA.vue'), //----- C4
  '13': () => import('@/views/skt/receiving/lorryForm/c4/EKIAV-432.vue'), //----- C4

  '15': () => import('@/views/skt/receiving/lorryForm/c5/NPAN30.vue'), //----- C5

  '16': () => import('@/views/skt/receiving/lorryForm/c6/SANNIX.vue'), //----- C6

  // Add other mappings as needed...
}

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

const countCurrentTab = ref(0)

//------------- journalId
const responseGener = ref([])
const currentTabNew = ref(sessionStorage.getItem('currentTabReceivingForm'))
const trickerLorryLoadind = ref(false)
const isDialogVisibleSelecrLorry = ref(true)
const checkSelectLorry = ref([])

const typeLorryOnce = ref(itemStore.getItemDetails('typeLorryInfoId'))
const typeLorryTwo = ref(null)

const generatedJournalId = async () => {
  console.log("generatedJournalId 0")

  try {
    // ใช้ await เพื่อรอการส่ง API เสร็จ
    const response = await axiosIns.get(
      `${urlApi.value}/api/v1/ReceivingPlan/GetByPoEtlLogDetailJournalID/${poEtlLogDetailJournalID}`,
      {
        headers: {
          accept: '*/*',
          'x-location': `${whereHouse.value}`,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
      },
    )

    console.log('%c[generatedJournalId] raw mat!!: ', "color: red; font-weight: bold", response.data)
    console.log("generatedJournalId 1")

    // ตรวจสอบว่ามีข้อมูลใน response.data.data ก่อน
    if (response.data && response.data.data && response.data.data.length > 0) {
      responseGener.value = response.data.data // เก็บค่า response.data.data ลงใน responseGener

      const item = responseGener.value[0] // เข้าถึงข้อมูลตัวแรกใน array

      receivedTypeId.value = item.receiveTypeId // เก็บค่า statusId
      statusId.value = item.statusId

      checkSelectLorry.value = item.lorryInfos

      if (checkSelectLorry.value.length > 0) {
        if (checkSelectLorry.value.length === 1) {
          typeLorryOnce.value = checkSelectLorry.value[0].lorryInfoKey
        }
      } else {
        trickerLorryLoadind.value = false
        typeLorryTwo.value = checkSelectLorry.value
      }

      sessionStorage.setItem('currentTabReceivingForm', checkCurrentTabBeforIn(statusId.value))
      currentTabNew.value = JSON.parse(sessionStorage.getItem('currentTabReceivingForm'))

      console.log("lorryInfos", checkSelectLorry.value)
    } else {
      console.error("ไม่มีข้อมูลใน responseGener")
    }

    console.log("generatedJournalId 3")
  } catch (error) {
    console.log("generatedJournalId 4")
    console.error("Error:", error)
  }
}

onMounted(async () => {
  await generatedJournalId()
})

const resultSelectLorry = ref([])

watch(() => {
  if(checkSelectLorry.value === 0){
    isDialogVisibleSelecrLorry.value = true
  }
})

const checkCurrentTabBeforIn = status => {
  let tabIndex

  switch (status) {
  case 1:
  case 3:
  case 8:
  case 10:
  case 7:
    tabIndex = 0 // สำหรับ status 1, 3, 8, 10 ให้แสดง tab index 0
    break
    
  case 4:
  case 5:
  case 6:
    tabIndex = 1 // สำหรับ status 4, 5, 6, 7 ให้แสดง tab index 1
    break
    
  case 12:
  case 13:
  case 14:
  case 18:
    tabIndex = 2 // สำหรับ status 12, 13 ให้แสดง tab index 2
    break
    
  default:
    tabIndex = 0 // ค่าเริ่มต้นถ้าไม่มี status ที่ตรงกับเงื่อนไข
  }

  return tabIndex
}

const itemsLorrySelect = [
  'N PAN 30',
  'SANNIX KC-703  TANK ',
  'TELA (AMMONIA TANK   11V - 511 )',
]

const updateCurrentTab = async () => {
  // รอให้ generatedJournalId และ generated ทำงานเสร็จก่อน
  await generatedJournalId()
  await generated()

  // จากนั้นค่อยอัปเดต currentTab ด้วยค่าใหม่จาก getCurrentTabIndex(
}

// เรียกฟังก์ชันเพื่อให้ทุกขั้นตอนทำงานเสร็จก่อน
updateCurrentTab()

const componentLorryForm = ref(null)

const matchingLorryInfoWithComponent = lorryInfoKey => {
  switch (lorryInfoKey) {
  case '01':
    console.log("case 1", lorryInfoKey)
    componentLorryForm.value = LorryLoadingA1IPA
    
    return LorryLoadingA1IPA
  case '02':
    return LorryLoadingA1EA11V1098C
  case '03':
    return LorryLoadingA1EPICHLO
  case '04':
    return LorryLoadingA2SKTV144
  case '05':
    return LorryLoadingA2SKTV145
  case '06':
    return LorryLoadingB1KARAMU
  case '07':
    return LorryLoadingC1AKUMARU
  case '09':
    return LorryLoadingC2HAKU
  case '10':
    return LorryLoadingC2EKIAA111
  case '11':
    return LorryLoadingC3DieselOil
  case '12':
    return LorryLoadingC4TELA
  case '13':
    return LorryLoadingC4EKIAV432
  case '15':
    return LorryLoadingC5NPAN30
  case '16':
    return LorryLoadingC6SANNIX
  default:
    console.warn(`No component found for key: ${lorryInfoKey}`)
    
    return null
  }
}

const checkSelectLorryLoadingForItem = () => {
  if(checkSelectLorry.value.length > 0){
    if(checkSelectLorry.value.length === 2){
      trickerLorryLoadind.value = false
      
      return null
    }else if(checkSelectLorry.value.length === 1){
      trickerLorryLoadind.value = true

      // console.log("Component", checkSelectLorry.value[0].lorryInfoKey)
      
      testComponent()
    }
  }
}

const testComponent = () => {
  const result = ref('00')
  
  if(typeLorryOnce.value){
    result.value = typeLorryOnce.value
    sessionStorage.setItem('typeLorryInfoId', result.value)
    console.log("Component type lorry result", result.value)
  }else{
    result.value = null
    console.log("Component typeLorryOnce.value", typeLorryOnce.value)
  }

  return matchingLorryInfoWithComponent(sessionStorage.getItem('typeLorryInfoId'))
  
}

watch(() => {
  testComponent()
  checkSelectLorryLoadingForItem()

  if(typeLorryOnce.value === null){
    testComponent()
    checkSelectLorryLoadingForItem()
  }else{
    console.log("find typeLorryOnce.value", typeLorryOnce.value)
  }
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
    component: testComponent(),
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
  14: 2,
  18: 2,

  // Add more statuses and indices as needed
}

const getDisabledTabs = () => {

  const role = userRole.value

  const status = ref(statusId.value)
  
  // console.log('Status:', status)
  // console.log('Role:', role)
  // console.log('Disabled Tabs:', tabDisablingConfig[status]?.[role])
  
  return tabDisablingConfig[status.value]?.[role] || []
}

const getCurrentTabIndex = () => {
  const status = ref(statusId.value)

  return tabIndexConfig[status.value] !== undefined ? tabIndexConfig[status.value] : 0
}

// เรียกใช้ฟังก์ชันนี้เพื่อให้เกิดการเปลี่ยนค่า currentTab หลังจากทุกอย่างเสร็จสิ้น

const isActive = ref(true)

//--------------------- alertDialog--------------------------------------------------------
import AuthenticatorDialog  from '@/components/dialogs/alert/alertDialog.vue'

const isDialogVisibleAlertDialog = ref(false)

//---------------------------------- Approve ------------------------------------
const wordForSubmit = ref('')

const isDialogConfirmVisible = ref(false)
const isDialogSubmitSuccessVisible = ref(false)
const isDialogSubmitFailedVisible = ref(false)

const selectLorryInfoKey = ref(null)

const successDialAlert = ref(false)

const textAlertDialogFunction = (word, success) => {
  wordForSubmit.value = word
  successDialAlert.value = success
  isDialogVisibleAlertDialog.value = true
  console.log("textAlertDialogFunction Start!!")
}

const btnApprove = word => {
  isDialogConfirmVisible.value = true
  wordForSubmit.value = word

}

const textConfirmDialogFunction = async (word, success, confirm) => {
  wordForSubmit.value = word
  confirmValueCheck.value = confirm
  successDialAlert.value = success
  isDialogConfirmVisible.value = true

  console.log("User textConfirmDialogFunction", isDialogVisibleConfirmDialog.value)

  
}

const handleSelectLorryLoading = word => {
  confirmValueCheck.value = true
  sessionStorage.setItem('typeLorryInfoId', selectLorryInfoKey.value)
  typeLorryOnce.value = selectLorryInfoKey.value

  // window.location.href = '/skt/receiving'

  // isDialogConfirmVisible.value = false
  // isDialogSubmitSuccessVisible.value = true


}

const handleAcceptPackaging = word => {
  console.log("StaertSSSSS!!")
  axiosIns.post(`${urlApi.value}/api/v1/ReceivingPlan/whapproval/${poEtlLogDetailJournalID}`, {}, {
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
      textAlertDialogFunction('APPROVE', true)

      // หน่วงเวลา 10 วินาที ก่อนที่จะ reload หน้าเว็บ
      setTimeout(() => {
        window.location.href = '/skt/receiving' // ใส่ URL ของหน้าที่ต้องการไป
      }, 300) // 10000 มิลลิวินาที = 3 วินาที

    })
    .catch(error => {
    // Handle errors
      textAlertDialogFunction('APPROVE', false)

      console.error('Error:', error)
      isDialogSubmitFailedVisible.value = true
    })
}

const btnSelectLorry = async (word, word2, lorryInfoKey) => {
  isDialogVisibleConfirmDialog.value = false
  selectLorryInfoKey.value = lorryInfoKey

  const confirmed = await textConfirmDialogFunction(word+word2, true, false)

  
}
</script>

<template>
  <div v-if="receivedTypeId === 2">
    <VTabs
      v-model="currentTabNew"
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
      v-model="currentTabNew"
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
      v-model="currentTabNew"
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
      :color="colorStatusWithId(statusId).color"
      variant="elevated"
      closable
    >
      <span
        class="text-wrap"
        style="font-size: 12px; text-transform: capitalize;"
      > 'statusText' </span>
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
        v-if="currentTabNew === index"
      />
    </div>
  </div>
  <div v-if="receivedTypeId === 3">
    <div v-if="currentTabNew === 2 && trickerLorryLoadind === false">
      <VDialog
        v-model="isDialogVisibleSelecrLorry"
        width="500"
        persistent
      >
        <!-- Dialog Content -->
        <VCard>
          <VCardTitle class="text-center">
            <span>Select Lorry Loading</span>
          </VCardTitle>
          <VCardText>
            <VTable>
              <thead>
                <tr>
                  <th
                    v-if="false"
                    class="bg-grey-lighten-3"
                  >
                    Lorry Key
                  </th>
                  <th class="bg-grey-lighten-3">
                    Lorry Name
                  </th>
                  <th class="bg-grey-lighten-3 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(itemLorry, index) in checkSelectLorry"
                  :key="index"
                >
                  <td v-if="false">
                    {{ itemLorry.lorryInfoKey }}
                  </td>
                  <td>
                    {{ itemLorry.title }}
                  </td>
                  <td class="text-center">
                    <VBtn
                      color="info"
                      @click="btnSelectLorry('LORRY LOADING', itemLorry.title, itemLorry.lorryInfoKey)"
                    >
                      Action
                    </VBtn>
                  </td>
                </tr>
              </tbody>
            </VTable>
          </VCardText>

          <VCardText class="d-flex justify-center flex-wrap gap-4">
            <VBtn
              color="error"
              @click="isDialogVisibleSelecrLorry = false"
            >
              close
            </VBtn>
          </VCardText>
        </VCard>
      </VDialog>
      <div
        v-if="!typeLorryOnce"
        class=" d-flex align-center justify-center mt-4"
        @click="isDialogVisibleSelecrLorry = true"
      >
        <VBtn
          append-icon="ri-file-list-line"
          variant="outlined"
        >
          Select Lorry LOADING
          <template #append>
            <VIcon size="30" />
          </template>
        </VBtn>
      </div>
    </div>
    <div
      v-for="(tab, index) in tabs3"
      :key="index"
      class="mt-20"
    >
      <div v-if="typeLorryOnce">
        <Component
          :is="tab.component"
          v-if="currentTabNew === index"
        />
      </div>
      <div v-else>
        <VProgressLinear
          height="20"
          color="success"
          indeterminate 
        >
          <span>Loading</span>
        </VProgressLinear>
      </div>
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
        v-if="currentTabNew === index"
      />
    </div>
  </div>

  <!-- Approval Btn --> 
  <div
    v-if="statusId === 7 || statusId === 15"
    style="position: fixed;
          display: flex;
          box-sizing: border-box;
          justify-content: start;
          padding: 8px;
          inset-block-end: 0;
          margin-block-end: 30px;
          margin-inline-start: -8px;"
    class="d-flex justify-start"
  >
    <VBtn
      style="min-width: 320px;"
      class="mb-2"
      @click="btnApprove('APPROVE')"
    >
      Approve
    </VBtn>
  </div>

  <section v-if="false">
    <VRow
      style="position: fixed;
          display: flex;
          justify-content: start;
          padding: 8px;
          inset-block-end: 0;
          margin-block-end: 20px;
          margin-inline-start: -8px;"
      class="d-flex justify-start"
    >
      <VCol cols="12">
        <VBtn
          width="100%"
          class="mb-2"
          @click="btnApprove('APPROVE')"
        >
          Approve
        </VBtn>
      </VCol>
    </VRow>
  </section>

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
          <div
            v-if="wordForSubmit === 'LORRY LOADING'"
            class="text-center"
          >
            <span style="font-size: 22px; font-weight: bolder;">Would you like to selcet {{ wordForSubmit }}
              from {{ resultSelectLorry }}?</span>
          </div>
          <div
            v-else
            class="text-center"
          >
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
            color="green"
            @click="handleSelectLorryLoading"
          >
            Confirm
          </VBtn>
        </VCardAction>
      </VCard>
    </VDialog>
  </section>
  <!-- Dialog Submit Success -->
  <section>
    <VDialog
      v-model="isDialogSubmitSuccessVisible"
      width="700"
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
          <div
            v-if="wordForSubmit === 'LORRY LOADING'"
            class="text-center"
          >
            <span style="font-size: 22px; font-weight: bolder;">Select form {{ resultSelectLorry }} Success</span>
          </div>
          <div
            v-else
            class="text-center"
          >
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

  <!-- Alert Dialog Success/Fiald new -->
  <section>
    <div>
      <!-- ใช้ AuthenticatorDialog component -->
      <AuthenticatorDialog
        :is-dialog-visible="isDialogVisibleAlertDialog"
        :word="wordForSubmit"
        :success="successDialAlert"
        @update:isDialogVisible="(val) => isDialogVisibleAlertDialog.value = val"
      />
    </div>

    <div>
      <!-- ใช้ confirmDialog component -->
      <ConfirmDialog
        :is-dialog-visible="isDialogVisibleConfirmDialog"
        :word="wordForSubmit"
        :success="successDialAlert"
        @update:confirm="confirmValueCheck = $event"
        @update:isDialogVisible="(val) => isDialogVisibleConfirmDialog.value = val"
      />
    </div>
  </section>
</template>
