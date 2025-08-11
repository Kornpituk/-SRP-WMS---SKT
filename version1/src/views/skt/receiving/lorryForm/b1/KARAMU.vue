<script setup>
import { urlApi } from '@/api'
import VCurrencyField from "@/components/VCurrencyField.vue"
import {
  currencyFormat,
  formatDate, generate, get, GetByPoEtlLogDetailJournalID, kumaruItemTemplate,
  passInitialData, passSubmitData, save,
} from '@/services/skt/inv/lorryLoading/kumaruService'
import { useItemStore } from '@/stores/skt/receingFormStore/itemStore'
import alertWordConst from '@/utilities/constant'
import { hour, minute } from '@/utilities/time'
import image01 from '@/views/skt/receiving/lorryForm/b1/CAPOLACTUM.png'
import axios from '@axios'
import { ref, watchEffect } from 'vue'

//-------------------------------------------- Permission -----------------------------------------

// const { getUserPermissionResult, errorGetUserPermission, fetchUserPermission } = useGetUserPermissionService()
import { canVisibleUserPermissionPermission, fetchUserPermissions } from '@/utilities/permission'

const itemStore = useItemStore()
const userDataInfo = ref(itemStore.getItemDetails('UserDataCookies'))

const paramsForGetPermission = ref({
  empId: String(userDataInfo.value.id) || '',
  statusId: '',
  uiControlContextId: '5',
})

// เรียก fetchUserPermissions ครั้งเดียวใน lifecycle hook
onMounted(async () => {
  await fetchUserPermissions(
    urlApi.value,
    whereHouse,
    accessTokenAtStore,
    paramsForGetPermission.value,
  )
})

const statusPermission = ref(-1)

const canVisibleUserPermission = (statusId, uiControlContextId) => {
  return canVisibleUserPermissionPermission(statusId, uiControlContextId)
}

//--------------------- alertDialog--------------------------------------------------------
import AuthenticatorDialog from '@/components/dialogs/alert/alertDialog.vue'
import ConfirmDialog2 from '@/components/dialogs/alert/confirmDialog2.vue'

const isDialogVisibleAlertDialog = ref(false)
const isDialogVisibleConfirmDialog = ref(false)
const confirmValueCheck = ref(false)
const wordForSubmit = ref('')
const successDialAlert = ref(false)

const statusId = ref(0)

const textAlertDialogFunction = (word, success) => {
  wordForSubmit.value = word
  successDialAlert.value = success
  isDialogVisibleAlertDialog.value = true
}

function openConfirmDialog(word) {
  // เรียกใช้ฟังก์ชัน openDialog ที่เปิดเผยจาก ConfirmDialog.vue

  wordForSubmit.value = word
  isDialogVisibleConfirmDialog.value.openDialog()
  
}

function handleConfirmAction() {
  console.log('Confirmed! Executing action...')

  if(wordForSubmit.value === "SUBMIT"){
    submit()
  }else if(wordForSubmit.value === "APPROVE"){
    approve()
  }

}

function handleCancel() {
  console.log('Action canceled.')
}

var kumaruItems = reactive(kumaruItemTemplate)
var ipaRequestData = ref({})
const route = useRoute()

const poEtlLogDetailJournalIDQueryParameters = ref(itemStore.getItemDetails('poEtlLogDetailJournalIDCookies'))
const poNo = ref('')
var isReadOnly = ref(false)

onMounted(async () => {

  await generate(poEtlLogDetailJournalIDQueryParameters.value)

  const lorryFormIPA = await get(poEtlLogDetailJournalIDQueryParameters.value)

  ipaRequestData.value = lorryFormIPA.data.data

  poNo.value = lorryFormIPA.data.data.purchaseOrderNo

  for (var i of kumaruItems) {
    for (var f of i.result.field) {
      f.value = passInitialData(i.result.type, lorryFormIPA.data.data[f.name])
    }
    if(i.condition.field != undefined){
      for (var f of i.condition.field) {
        f.value = passInitialData(i.condition.type, lorryFormIPA.data.data[f.name])
      }
    }
  }

  const lorryFormIPAStatus = await GetByPoEtlLogDetailJournalID(poEtlLogDetailJournalIDQueryParameters.value)

  statusId.value = lorryFormIPAStatus.data.data[0].statusId

  console.log("StatusId ", statusId.value)

  if(!canVisibleUserPermission(statusPermission.value, 'BTN_SAVE_DRAFT').canVisible){
    isReadOnly.value = true
  }else{
    if(statusId.value === 15 || statusId.value === 18 || statusId.value === 17){
      isReadOnly.value = true
    }
  }

})


async function saveDraft(e) {
  await passData()

  var response = await save(poEtlLogDetailJournalIDQueryParameters.value, ipaRequestData.value)

  if (response.status == 200) {
    textAlertDialogFunction(alertWordConst.saveDraft, true)
    setTimeout(() => {
      location.reload()
    }, 1000) // 10000 มิลลิวินาที = 10 วินาที
  } else {
    console.error(response.data)
    e.preventDefault()
  }
}

async function passData() {
  for (var i of kumaruItems) {
    for (var f of i.result.field) {
      ipaRequestData.value[f.name] = passSubmitData(i.result.type, f.value)
    }

    if(i.condition.field != undefined){
      for (var f of i.condition.field) {
        ipaRequestData.value[f.name] = passSubmitData(i.condition.type, f.value)
      }
    }
  }
}

async function validateField(){
  var isValid = true
  for (const i of kumaruItems) {
    for (const f of i.result.field) {
      const element = document.querySelector("[field-name='"+f.name+"']")
      if(element){
        if((f.value) == null || (f.value) == undefined){     
          element.classList.add('d-flex') // Adds the class to hide the element
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          isValid =false
    
          return isValid
        }else{
          element.classList.remove('d-flex') // Adds the class to hide the element  
          element.classList.add('d-none') // Adds the class to hide the element  
        }
      }   
    }
  }
  
  return isValid
}

async function submit(e) {
  
  await passData()

  var isValid = validateField()

  if(isValid){

    var response = await save(poEtlLogDetailJournalIDQueryParameters.value, ipaRequestData.value)

    if (response.status != 200) 
      return
  
    const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')
    const whereHouse = localStorage.getItem('whereHouseName')

    console.log("User confirmed:", confirmValueCheck.value)

    // เรียก API หรือดำเนินการต่อ
    var response = await axios.post(`${urlApi.value}/api/v1/LorryFormKaramu/submit/${poEtlLogDetailJournalIDQueryParameters.value}`, null, {
      headers: {
        'accept': '*/*',
        'x-location': `${whereHouse}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
    })

    if (response.status == 200) {
      textAlertDialogFunction(alertWordConst.submit, true)
      setTimeout(() => {
        window.location.href = '/skt/receiving' // ใส่ URL ของหน้าที่ต้องการไป
      }, 1000) // 10000 มิลลิวินาที = 10 วินาที
    } else {
      console.error(response.data)
      textAlertDialogFunction(alertWordConst.submit, false)
    }
  }

}

async function approve(e) {
  const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  var response = await axios.post(`${urlApi.value}/api/v1/LorryFormKaramu/approve/${poEtlLogDetailJournalIDQueryParameters.value}`, null, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })

  if (response.status == 200) {
    textAlertDialogFunction(alertWordConst.approve, true)
    setTimeout(() => {
      window.location.href = '/skt/receiving' // ใส่ URL ของหน้าที่ต้องการไป
    }, 1000) // 10000 มิลลิวินาที = 10 วินาที
  } else {
    console.error(response.data)
  }
}


watchEffect(async () => {
  var a  = kumaruItems[6].result.field[0].value
  var b = kumaruItems[7].result.field[0].value 
  var c = kumaruItems[49].result.field[0].value
  var ab = a+b
  kumaruItems[8].result.field[0].value = currencyFormat(ab)
  kumaruItems[50].result.field[0].value = currencyFormat(c-b)
})
</script>

<template>
  <VRow class="ma-2">
    <VCol cols="4" />
    <VCol cols="4">
      <div
        style="font-size: 22px; font-weight: bolder;"
        class="d-flex justify-center align-center"
      >
        Lorry Loading Check List
      </div>
    </VCol>
    <VCol cols="4">
      <h3>
        <table class="custom-table">
          <tr>
            <th>P/O No.</th>
            <td>{{ poNo }}</td>
          </tr>
        </table>
      </h3>
    </VCol>
    <VCol cols="4" />
    <VCol cols="4">
      <div
        style="font-size: 22px; font-weight: bolder;"
        class="d-flex justify-center align-center"
      >
        KARAMU MERUTO 21V-306
      </div>
    </VCol>
    <VCol cols="4" />
  </VRow>

  <VRow>
    <!-- Lorry Form -->
    <VCol
      cols="12"
      style="overflow-x: auto;"
    >
      <table class="custom-table">
        <thead>
          <tr>
            <th
              class="text-center"
              style="font-size: 16px;"
              colspan="2"
            >
              ขั้นตอน
            </th>
            <th
              class="text-center"
              style="font-size: 16px;"
              colspan="3"
            >
              เนื้อหารายละเอียด
            </th>
            <th
              class="text-center"
              style="font-size: 16px;"
              colspan="3"
            >
              เงื่อนไข
            </th>
            <th
              class="text-center"
              style="font-size: 16px;"
              colspan="4"
            >
              ผลการเช็ค
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(section, sectionIndex) in kumaruItems"
            :key="sectionIndex"
            :sectionIndex="sectionIndex"
          >
            <td
              v-if="section.isSection === true"
              style="border-top: 1px solid black; border-left: 1px solid black; text-align: center; vertical-align: middle;"
              :rowspan="[section.rowSpan]"
              colspan="2"
            >
              <div v-html="section.sequence" />
            </td>
            <td
              colspan="3"
              style="max-width: 400px; border-left: 1px solid black; text-align: start;"
            >
              <VLabel class="d-flex justify-left pa-md-2 text-wrap">
                <div v-html="section.practice" />
              </VLabel>
            </td>
            <td
              colspan="3"
              style="max-width: 350px; border-left: 1px solid black; text-align: start;"
            >
              <div v-if="section.condition.type === 'kg'">
                <VRow>
                  <VCol>
                    <VCurrencyField
                      v-model="section.condition.field[0].value"
                      density="compact"
                      variant="outlined"
                      label=""
                      :text-start="section.condition.startText"
                      :text-end="section.condition.endText"
                      :readonly="isReadOnly"
                    />
                  </VCol>
                </vrow>
              </div>
              <div v-else>
                <VLabel class="d-flex justify-center pa-md-2 text-wrap">
                  {{ section.condition }}
                </VLabel>
              </div>
            </td>
            <td
              colspan="4"
              style="min-width: 450px; border-left: 1px solid black;"
            >
              <div v-if="section.result.type === 'oknot'">
                <!-- <VRadioGroup inline class="d-flex justify-center" v-model="section.result.field[0].value"> -->
                <VRadioGroup
                  v-model="section.result.field[0].value"
                  inline
                  class="d-flex justify-center"
                  :fieldname="section.result.field[0].name"
                  :readonly="isReadOnly"
                >
                  <VRadio
                    label="OK"
                    value="1"
                  />
                  <VRadio
                    label="NOT"
                    value="0"
                  />
                </VRadioGroup>
              </div>
              <div v-if="section.result.type === 'a'">
                <!-- <VRadioGroup inline class="d-flex justify-center" v-model="section.result.field[0].value"> -->
                <VRow>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="outlined"
                      label=""
                      text-start="(A)"
                      text-end="kg"
                      :readonly="isReadOnly"
                    />
                    <span
                      class="text-red justify-center d-none"
                      :field-name="section.result.field[0].name"
                    >This field is required. <span />
                    </span>
                  </VCol>
                </vrow>
              </div>
              <div v-if="section.result.type === 'b'">
                <!-- <VRadioGroup inline class="d-flex justify-center" v-model="section.result.field[0].value"> -->
                <VRow>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="outlined"
                      label=""
                      text-start="(B) DCS"
                      text-end="kg"
                      :readonly="isReadOnly"
                    />
                    <span
                      class="text-red justify-center d-none"
                      :field-name="section.result.field[0].name"
                    >This field is required. <span />
                    </span>
                  </VCol>
                </vrow>
              </div>
              <div v-if="section.result.type === 'ab'">
                <VRow>
                  <VCol>
                    <VTextField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="solo"
                      readonly="true"
                    >
                      <template #prepend>
                        <VLabel>
                          (A) + (B) = 
                        </VLabel>
                      </template>
                      <template #append>
                        <VLabel>
                          Kg
                        </VLabel>
                      </template>
                    </VTextField>
                    <span
                      class="text-red justify-center d-none"
                      :field-name="section.result.field[0].name"
                    >This field is required. <span />
                    </span>
                  </VCol>
                  <VCol>
                    <VRadioGroup
                      v-model="section.result.field[1].value"
                      inline
                      class="d-flex justify-center"
                      :readonly="isReadOnly"
                    >
                      <VRadio
                        label="OK"
                        value="1"
                      />
                      <VRadio
                        label="NOT"
                        value="0"
                      />
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'c'">
                <!-- <VRadioGroup inline class="d-flex justify-center" v-model="section.result.field[0].value"> -->
                <VRow>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="outlined"
                      label=""
                      text-start=""
                      text-end="℃"
                      :readonly="isReadOnly"
                    />
                    <span
                      class="text-red justify-center d-none"
                      :field-name="section.result.field[0].name"
                    >This field is required. <span />
                    </span>
                  </VCol>
                </vrow>
              </div>
              <div v-if="section.result.type === 'cdcs'">
                <!-- <VRadioGroup inline class="d-flex justify-center" v-model="section.result.field[0].value"> -->
                <VRow>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="outlined"
                      label=""
                      text-start="( C ) DCS"
                      text-end="kg"
                      :readonly="isReadOnly"
                    />
                    <span
                      class="text-red justify-center d-none"
                      :field-name="section.result.field[0].name"
                    >This field is required. <span />
                    </span>
                  </VCol>
                </vrow>
              </div>
              <div v-if="section.result.type === 'actualCheck'">
                <VRow>
                  <VCol>
                    <VSelect
                      v-model="section.result.field[0].value"
                      :items="hour"
                      :readonly="isReadOnly"
                    >
                      <template #prepend>
                        <VLabel>
                          เวลาเริ่ม
                        </VLabel>
                      </template>
                      <template #append>
                        <VLabel />
                      </template>
                    </VSelect>
                  </VCol>
                  <VLabel>
                    :
                  </VLabel>
                  <VCol>
                    <VSelect
                      v-model="section.result.field[1].value"
                      :items="minute"
                      :readonly="isReadOnly"
                    >
                      <template #prepend>
                        <VLabel />
                      </template>
                      <template #append>
                        <VLabel>
                          น.
                        </VLabel>
                      </template>
                    </VSelect>
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'actualCheck2'">
                <VRow>
                  <VCol>
                    <VSelect
                      v-model="section.result.field[0].value"
                      :items="hour"
                      :readonly="isReadOnly"
                    >
                      <template #prepend>
                        <VLabel>
                          เวลารับเสร็จ
                        </VLabel>
                      </template>
                      <template #append>
                        <VLabel />
                      </template>
                    </VSelect>
                  </VCol>
                  <VLabel>
                    :
                  </VLabel>
                  <VCol>
                    <VSelect
                      v-model="section.result.field[1].value"
                      :items="minute"
                      :readonly="isReadOnly"
                    >
                      <template #prepend>
                        <VLabel />
                      </template>
                      <template #append>
                        <VLabel>
                          น.
                        </VLabel>
                      </template>
                    </VSelect>
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'cb'">
                <VRow>
                  <VCol>
                    <VTextField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="solo"
                      readonly="true"
                    >
                      <template #prepend>
                        <VLabel>
                          ( C )-( B )
                        </VLabel>
                      </template>
                      <template #append>
                        <VLabel>
                          Kg
                        </VLabel>
                      </template>
                    </VTextField>
                    <span
                      class="text-red justify-center d-none"
                      :field-name="section.result.field[0].name"
                    >This field is required. <span />
                    </span>
                  </VCol>
                </vrow>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </VCol>
    <!-- Flow Chat -->
    <VCol cols="12">
      <table class="custom-table">
        <thead>
          <tr>
            <th style="font-size: 16px;">
              Flow Chart
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <div class="d-flex justify-space-around align-center bg-grey-lighten-4">
              <div class="ma-4">
                <div class="text-subtitle-2">
                  Default
                </div>
                <VImg
                  :aspect-ratio="1"
                  class="bg-white"
                  :src="image01"
                  width="500"
                />
              </div>
            </div>
          </tr>
        </tbody>
      </table>
    </VCol>
    <VCol
      cols="12"
      lg="12"
    >
      <table class="custom-table">
        <tr>
          <th
            class="text-center cursor-pointer"
            colspan="12"
          >
            Lorry Loading Check List
          </th>
        </tr>
        <tr>
          <td colspan="4">
            <span>Staff: {{ ipaRequestData.whStaff }}</span>
          </td>
          <td colspan="4">
            <span>Leader: {{ ipaRequestData.whLeader }}</span>
          </td>
          <td colspan="4">
            <span>Supervisor: {{ ipaRequestData.whSupervisor }}</span>
          </td>
        </tr>
        <tr>
          <td
            style="min-width: 150px; height: 35px;"
            colspan="4"
          >
            <div v-if="ipaRequestData.whStaffUpdatedDate">
              <span v-if="ipaRequestData.whStaffUpdatedDate">{{ formatDate(ipaRequestData.whStaffUpdatedDate) }}</span>
            </div>
          </td>
          <td
            style="min-width: 150px; height: 35px;"
            colspan="4"
          >
            <div v-if="ipaRequestData.whLeaderDate">
              <span v-if="ipaRequestData.whLeaderDate">{{ formatDate(ipaRequestData.whLeaderDate) }}</span>
            </div>
          </td>
          <td
            style="min-width: 150px; height: 35px;"
            colspan="4"
          >
            <div v-if="ipaRequestData.whSupervisorDate">
              <span v-if="ipaRequestData.whSupervisorDate">{{ formatDate(ipaRequestData.whSupervisorDate) }}</span>
            </div>
          </td>
        </tr>
      </table>
    </VCol>
  </VRow>
  <!-- Btn -->
  <VRow>
    <!-- Btn -->
    <VCol cols="4" />
    <VCol
      cols="8"
      class="d-flex justify-end"
    >
      <VBtn
        v-if="statusId !== 15 && statusId !== 18 && statusId !== 17 && canVisibleUserPermission(statusPermission,'BTN_SAVE_DRAFT').canVisible"
        type="text"
        color="warning"
        class="mx-1"
        @click="saveDraft"
      >
        SAVE Draft
      </VBtn>
      <VBtn
        v-if="statusId !== 15 && statusId !== 18 && statusId !== 17 && canVisibleUserPermission(statusPermission,'BTN_SUBMIT').canVisible"
        type="text"
        color="primary "
        class="mx-1"
        @click="openConfirmDialog('SUBMIT')"
      >
        Submit
      </VBtn>
      <VBtn
        v-if="(statusId === 18) && canVisibleUserPermission(statusPermission,'BTN_WH_APVL_APPROVE').canVisible"
        type="text"
        color="primary"
        class="mx-1"
        @click="openConfirmDialog('APPROVE')"
      >
        Approve
      </VBtn>
    </VCol>
  </VRow>
  
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
      <ConfirmDialog2
        ref="isDialogVisibleConfirmDialog"
        :message="wordForSubmit"
        @confirm="handleConfirmAction"
        @cancel="handleCancel"
      />
    </div>
  </section>
</template>

<style scoped>
.dcs-tank-td {
  line-height: 60px;
}

.br-1 {
  border: 1px solid black;
}

.table-container {
  overflow-x: auto;
}

.text-center {
  text-align: center;
}

.centered-input >>> input {
  padding: 0;
  block-size: 20px !important;
  text-align: center;
}

.custom-text-field {
  block-size: 30px;
  font-size: 12px;
}

.custom-table {
  border-collapse: collapse;
  border-spacing: 0;
  inline-size: 100%;

  /* stylelint-disable-next-line scss/double-slash-comment-whitespace-inside color: #000; */
  /* stylelint-disable-next-line comment-whitespace-inside background-color: #ffff; */
}

.custom-table,
.custom-table th,
.custom-table td {
  border: 1px solid black;
}

.custom-table th,
.custom-table td {
  padding: 4px;
  text-align: start;
}

.custom-table td {
  font-weight: 400;
}

.custom-sub-table {
  border-collapse: collapse;
  border-spacing: 0;
}

.custom-sub-table,
.custom-sub-table th,
.custom-sub-table td {
  border: 0 solid black;
}

.custom-sub-table th,
.custom-sub-table td {
  padding: 8px;
  text-align: start;
}

.header {
  justify-content: space-between;
  font-weight: bold;
  text-align: center;
}

.section-title {
  font-weight: bold;
}

.image {
  inline-size: 100px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.custom-radio input[type="radio"] {
  block-size: 20px !important;
  inline-size: 20px !important;
}

.v-selection-control__wrapper {
  block-size: 50% !important;
  inline-size: 50% !important;
}
</style>
