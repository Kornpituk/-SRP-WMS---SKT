<script setup>
import { urlApi } from '@/api'
import VCurrencyField from "@/components/VCurrencyField.vue"
import VNumberInput from '@/components/VNumberInput.vue'
import {
  formatDate, generate, get, GetByPoEtlLogDetailJournalID, kumaruItemTemplate,
  passInitialData, passSubmitData, save,
} from '@/services/skt/inv/lorryLoading/kumaruService'
import { useItemStore } from '@/stores/skt/receingFormStore/itemStore'
import axios from '@axios'
import { ref, watchEffect } from 'vue'

//--------------------- alertDialog--------------------------------------------------------
import AuthenticatorDialog from '@/components/dialogs/alert/alertDialog.vue'
import alertWordConst from '@/utilities/constant'


const itemStore = useItemStore()

var kumaruItems = reactive(kumaruItemTemplate)
var ipaRequestData = ref({})
const route = useRoute()

const poEtlLogDetailJournalIDQueryParameters = ref(itemStore.getItemDetails('poEtlLogDetailJournalIDCookies'))
const poNo = ref('')
var isReadOnly = ref(false)

const isDialogVisibleAlertDialog = ref(false)
const wordForSubmit = ref('')
const successDialAlert = ref(false)

const statusId = ref(0)

const textAlertDialogFunction = (word, success) => {
  wordForSubmit.value = word
  successDialAlert.value = success
  isDialogVisibleAlertDialog.value = true
}

const textConfirmDialogFunction = async (word, success, confirm) => {
  wordForSubmit.value = word
  confirmValueCheck.value = confirm
  successDialAlert.value = success
  isDialogVisibleConfirmDialog.value = true

  // รอคำตอบจากผู้ใช้
  return new Promise(resolve => {
    const unwatch = watchEffect(
      () => isDialogVisibleConfirmDialog.value,
      newValue => {
        if (!newValue) { // เมื่อ Dialog ถูกปิด
          unwatch() // ยกเลิก watch
          resolve(confirmValueCheck.value) // คืนค่าคำตอบ
        }
      },
    )
  })
}

onMounted(async () => {

  await generate(poEtlLogDetailJournalIDQueryParameters.value)

  const lorryFormIPA = await get(poEtlLogDetailJournalIDQueryParameters.value)

  ipaRequestData.value = lorryFormIPA.data.data

  poNo.value = lorryFormIPA.data.data.purchaseOrderNo

  for (var i of kumaruItems) {
    for (var f of i.result.field) {
      f.value = passInitialData(i.result.type, lorryFormIPA.data.data[f.name])
    }
  }

  const lorryFormIPAStatus = await GetByPoEtlLogDetailJournalID(poEtlLogDetailJournalIDQueryParameters.value)

  statusId.value = lorryFormIPAStatus.data.data.statusId

  if(statusId.value === 15 || statusId.value === 18 || statusId.value === 17){
    isReadOnly.value=true
  }

})

async function saveDraft(e) {

  for (var i of kumaruItems) {
    for (var f of i.result.field) {
      ipaRequestData.value[f.name] = passSubmitData(i.result.type, f.value)
    }
  }

  var response = await save(poEtlLogDetailJournalIDQueryParameters, ipaRequestData)

  if (response.status == 200) {
    textAlertDialogFunction(alertWordConst.saveDraft, true)
    setTimeout(() => {
      location.reload()
    }, 1000) // 10000 มิลลิวินาที = 10 วินาที
  } else {
    console.log(response.data)
  }
}

async function submit(e) {

  var response = save(poEtlLogDetailJournalIDQueryParameters, ipaRequestData)
  if (response.status == 200) {
    console.log(response.data)
  } else {
    console.error(response.data)
    e.preventDefault()
    
  }

  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  let isValid = true
  for (var i of kumaruItems) {
    for (var f of i.result.field) {
      if((i.result.type, f.value) == null || (i.result.type, f.value) == undefined || (i.result.type, f.value) == "-1"){     
        isValid = false
      }
    }
  }

  if(!isValid){
    alert("กรุณากรอกข้อมูลให้ครบ")
    
    return
  }

  var response = await axios.post(`${urlApi.value}/api/v1/LorryFormKaramu/submit/${poEtlLogDetailJournalIDQueryParameters.value}`, null, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })

  if (response.status == 200) {
    textAlertDialogFunction(alertWordConst.submit, true)
  } else {
    console.error(response.data)
  }
}

async function approve(e) {
  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
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
    location.reload()
  } else {
    console.error(response.data)
  }
}


watchEffect(async () => {
  kumaruItems[8].result.field[0].value = kumaruItems[6].result.field[0].value + kumaruItems[7].result.field[0].value 
  kumaruItems[49].result.field[0].value = kumaruItems[48].result.field[0].value - kumaruItems[7].result.field[0].value
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
                {{ section.practice }}
              </VLabel>
            </td>
            <td
              colspan="3"
              style="max-width: 350px; border-left: 1px solid black; text-align: start;"
            >
              <VLabel class="d-flex justify-center pa-md-2">
                {{ section.condition }}
              </VLabel>
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
                    label="Ok"
                    value="1"
                  />
                  <VRadio
                    label="Not"
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
                  </VCol>
                </vrow>
              </div>
              <div v-if="section.result.type === 'ab'">
                <VRow>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="outlined"
                      label=""
                      text-start="A) + (B) ="
                      text-end="Kg"
                      :readonly="isReadOnly"
                    />
                  </VCol>
                  <VCol>
                    <VRadioGroup
                      v-model="section.result.field[1].value"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        label="Ok"
                        value="1"
                      />
                      <VRadio
                        label="Not"
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
                      text-start="(A)"
                      text-end="kg"
                      :readonly="isReadOnly"
                    />
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
                  </VCol>
                </vrow>
              </div>
              <div v-if="section.result.type === 'actualCheck'">
                <VRow>
                  <VCol>
                    <VNumberInput
                      v-model="section.result.field[0].value"
                      :max-length="2"
                      :readonly="isReadOnly"
                    />
                  </VCol>
                  <VLabel>
                    :
                  </VLabel>
                  <VCol>
                    <VNumberInput
                      v-model="section.result.field[1].value"
                      :max-length="2"
                      :readonly="isReadOnly"
                    />
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'cb'">
                <!-- <VRadioGroup inline class="d-flex justify-center" v-model="section.result.field[0].value"> -->
                <VRow>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="outlined"
                      label=""
                      text-start="( C )-( B )"
                      text-end="kg"
                      :readonly="isReadOnly"
                    />
                  </VCol>
                </vrow>
              </div>
            </td>
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
            style="min-width: 150px;"
            colspan="4"
          >
            <div v-if="ipaRequestData.whStaffUpdatedDate">
              <span v-if="ipaRequestData.whStaffUpdatedDate">{{ formatDate(ipaRequestData.whStaffUpdatedDate) }}</span>
            </div>
          </td>
          <td
            style="min-width: 150px;"
            colspan="4"
          >
            <div v-if="ipaRequestData.whLeaderDate">
              <span v-if="ipaRequestData.whLeaderDate">{{ formatDate(ipaRequestData.whLeaderDate) }}</span>
            </div>
          </td>
          <td
            style="min-width: 150px;"
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
        v-if="(statusId !== 15 && statusId !== 18)"
        type="text"
        color="warning"
        class="mx-1"
        @click="saveDraft"
      >
        Draft
      </VBtn>
      <VBtn
        v-if="(statusId !== 15 && statusId !== 18)"
        type="text"
        color="secondary "
        class="mx-1"
        @click="submit"
      >
        Submit
      </VBtn>
      <VBtn
        v-if="(statusId === 18)"
        type="text"
        color="primary"
        class="mx-1"
        @click="approve"
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
