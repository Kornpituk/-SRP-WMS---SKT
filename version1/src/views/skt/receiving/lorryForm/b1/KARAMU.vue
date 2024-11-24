<script setup>
import { urlApi } from '@/api'
import VCurrencyField from "@/components/VCurrencyField.vue"
import {
  formatDate, generate, get, GetByPoEtlLogDetailJournalID, kumaruItemTemplate,
  passInitialData, passSubmitData
} from '@/services/skt/inv/lorryLoading/kumaruService'
import { useItemStore } from '@/stores/skt/receingFormStore/itemStore'
import image01 from '@/views/skt/inv/lorryLoading/calculate/iPA/IPA 1.png'
import axios from '@axios'
import { ref, watchEffect } from 'vue'

//--------------------- alertDialog--------------------------------------------------------
import AuthenticatorDialog from '@/components/dialogs/alert/alertDialog.vue'
import VNumberInput from '@/components/VNumberInput.vue'
import alertWordConst from '@/utilities/constant'


const itemStore = useItemStore()

var kumaruItems = reactive(kumaruItemTemplate)
var ipaRequestData = ref({})
const route = useRoute()

const data = ref(JSON.parse(route.query.Data || '[]'))
const poEtlLogDetailJournalIDQueryParameters = ref(itemStore.getItemDetails('poEtlLogDetailJournalIDCookies'))
const poNo = ref('')

const aVariable = ref(kumaruItems[6].result.field[0])
const bVariable = ref(kumaruItems[6].result.field[1])
const cVariable = ref(kumaruItems[7].result.field[0])
const dVariable = ref(kumaruItems[7].result.field[1])

var dcsAfter = ref(0);
var dcsBefore = ref(0);
var dcsDiff = 0;

var tankAfter = ref(0);
var tankBefore = ref(0);
var tankDiff = ref(0);

const isDialogVisibleAlertDialog = ref(false)
const wordForSubmit = ref('')
const successDialAlert = ref(false)

const statusId = ref(0)

const textAlertDialogFunction = (word, success) => {
  wordForSubmit.value = word
  successDialAlert.value = success
  isDialogVisibleAlertDialog.value = true
}

onMounted(async () => {

  await generate(poEtlLogDetailJournalIDQueryParameters.value);

  const lorryFormIPA = await get(poEtlLogDetailJournalIDQueryParameters.value);
  ipaRequestData.value = lorryFormIPA.data.data;

  poNo.value = lorryFormIPA.data.data.purchaseOrderNo;

  for (var i of kumaruItems) {
    for (var f of i.result.field) {
      f.value = passInitialData(i.result.type, lorryFormIPA.data.data[f.name])
    }
  }

  const lorryFormIPAStatus = await GetByPoEtlLogDetailJournalID(poEtlLogDetailJournalIDQueryParameters.value);
  statusId.value = lorryFormIPAStatus.data.data.statusId;

})

async function saveDraft(e) {

  for (var i of kumaruItems) {
    for (var f of i.result.field) {
      ipaRequestData.value[f.name] = passSubmitData(i.result.type, f.value)
    }
  }

  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  var response = await axios.post(`${urlApi.value}/api/v1/LorryFormIPA/save/${poEtlLogDetailJournalIDQueryParameters.value}`, ipaRequestData.value, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })

  if (response.status == 200) {
    textAlertDialogFunction(alertWordConst.saveDraft, true)
  } else {
    console.error(response.data)
  }
}

async function submit(e) {
  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  var response = await axios.post(`${urlApi.value}/api/v1/LorryFormIPA/submit/${poEtlLogDetailJournalIDQueryParameters.value}`, null, {
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

  var response = await axios.post(`${urlApi.value}/api/v1/LorryFormIPA/approve/${poEtlLogDetailJournalIDQueryParameters.value}`, null, {
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

})


</script>

<template>
  <VRow class="ma-2">
    <VCol cols="4" />
    <VCol cols="4">
      <div style="font-size: 22px; font-weight: bolder;" class="d-flex justify-center align-center">
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
      <div style="font-size: 22px; font-weight: bolder;" class="d-flex justify-center align-center">
        KARAMU MERUTO 21V-306
      </div>
    </VCol>
    <VCol cols="4" />
  </VRow>

  <VRow>
    <!-- Lorry Form -->
    <VCol cols="12" style="overflow-x: auto;">
      <table class="custom-table">
        <thead>
          <tr>
            <th class="text-center" style="font-size: 16px;" colspan="2">
              ขั้นตอน
            </th>
            <th class="text-center" style="font-size: 16px;" colspan="3">
              เนื้อหารายละเอียด
            </th>
            <th class="text-center" style="font-size: 16px;" colspan="3">
              เงื่อนไข
            </th>
            <th class="text-center" style="font-size: 16px;" colspan="4">
              ผลการเช็ค
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(section, sectionIndex) in kumaruItems" :key="sectionIndex" :sectionIndex="sectionIndex">
            <td v-if="section.isSection === true"
              style="border-top: 1px solid black; border-left: 1px solid black; text-align: center; vertical-align: middle;"
              :rowspan="[section.rowSpan]" colspan="2">
              <div v-html="section.sequence" />
            </td>
            <td colspan="3" style="max-width: 400px; border-left: 1px solid black; text-align: start;">
              <VLabel class="d-flex justify-left pa-md-2 text-wrap">
                {{ section.practice }}
              </VLabel>
            </td>
            <td colspan="3" style="max-width: 350px; border-left: 1px solid black; text-align: start;">
              <VLabel class="d-flex justify-center pa-md-2">
                {{ section.condition }}
              </VLabel>
            </td>
            <td colspan="4" style="min-width: 450px; border-left: 1px solid black;">
              <div v-if="section.result.type === 'oknot'">
                <!-- <VRadioGroup inline class="d-flex justify-center" v-model="section.result.field[0].value"> -->
                <VRadioGroup v-model="section.result.field[0].value" inline class="d-flex justify-center"
                  :fieldname="section.result.field[0].name">
                  <VRadio label="Ok" value="1" />
                  <VRadio label="Not" value="0" />
                </VRadioGroup>
              </div>
              <div v-if="section.result.type === 'ab'">
                <VRow>
                  <VCol>
                    <VCurrencyField v-model="section.result.field[0].value" density="compact" variant="solo"
                      text-start="(A)" text-end="Kg." />
                  </VCol>
                  <VCol>
                    <VCurrencyField v-model="section.result.field[1].value" density="compact" variant="solo"
                      text-start="(B)" text-end="Litre" readonly="true" />
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'cd'">
                <VRow>
                  <VCol>
                    <VCurrencyField v-model="section.result.field[0].value" density="compact" variant="outlined"
                      label="" text-start="(C)" text-end="mm." />
                  </VCol>
                  <VCol>
                    <VCurrencyField v-model="section.result.field[1].value" density="compact" variant="solo"
                      text-start="(D)" text-end="mm." readonly="true" />
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'bd'">
                <VRow>
                  <VCol>
                    <VCurrencyField v-model="section.result.field[0].value" density="compact" variant="solo"
                      text-start=" (B) + (D) =" text-end="Litre" readonly="true" />
                  </VCol>
                  <VCol>
                    <VRadioGroup v-model="section.result.field[1].value" inline class="d-flex justify-center">
                      <VRadio label="Ok" value="1" />
                      <VRadio label="Not" value="0" />
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'litre'">
                <VRow>
                  <VCol>
                    <VCurrencyField v-model="section.result.field[0].value" density="compact" variant="outlined"
                      label="" text-start="" text-end="Litre" />
                  </VCol>
                  <VCol>
                    <VRadioGroup v-model="section.result.field[1].value" inline class="d-flex justify-center">
                      <VRadio label="Ok" value="1" />
                      <VRadio label="Not" value="0" />
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'percen'">
                <VRow>
                  <VCol>
                    <VCurrencyField v-model="section.result.field[0].value" density="compact" variant="outlined"
                      label="" text-start="" text-end="%" />
                  </VCol>
                  <VCol>
                    <VRadioGroup v-model="section.result.field[1].value" inline class="justify-center">
                      <VRadio label="Ok" value="1" />
                      <VRadio label="Not" value="0" />
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'c'">
                <VRow>
                  <VCol>
                    <VCurrencyField v-model="section.result.field[0].value" density="compact" variant="outlined"
                      label="" text-start="" text-end="C°" />
                  </VCol>
                  <VCol>
                    <VRadioGroup v-model="section.result.field[1].value" inline class="justify-center">
                      <VRadio label="Ok" value="1" />
                      <VRadio label="Not" value="0" />
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'actualCheck'">
                <VRow>
                  <VCol>
                    <!-- <VNumberInput v-model="section.result.field[0]" density="compact" variant="outlined" label=""
                      type="number" /> -->
                    <VNumberInput v-model="section.result.field[0].value" density="compact" variant="outlined" />
                  </VCol>
                  <VLabel>
                    :
                  </VLabel>
                  <VCol>
                    <VNumberInput v-model="section.result.field[1].value" density="compact" variant="outlined" />
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'mpa'">
                <VRow>
                  <VCol>
                    <VCurrencyField v-model="section.result.field[0].value" density="compact" variant="outlined"
                      label="" text-start="" text-end="(Mpa)" />
                  </VCol>
                  <VCol>
                    <VRadioGroup v-model="section.result.field[1].value" inline class="d-flex justify-center">
                      <VRadio label="Ok" value="1" />
                      <VRadio label="Not" value="0" />
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'amp'">
                <VRow>
                  <VCol>
                    <VCurrencyField v-model="section.result.field[0].value" density="compact" variant="outlined"
                      label="" text-start="" text-end="Amp" />
                  </VCol>

                  <VCol>
                    <VRadioGroup v-model="section.result.field[1].value" inline class="d-flex justify-center">
                      <VRadio label="Ok" value="1" />
                      <VRadio label="Not" value="0" />
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'ef'">
                <VRow>
                  <VCol>
                    <VCurrencyField v-model="section.result.field[0].value" density="compact" variant="outlined"
                      label="" text-start="(E)" text-end="mm." />
                  </VCol>
                  <VCol>
                    <VCurrencyField v-model="section.result.field[1].value" density="compact" variant="outlined"
                      label="" text-start="(F)" text-end="Litre" readonly="true" />
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'g'">
                <VRow>
                  <VCol>
                    <VCurrencyField v-model="section.result.field[0].value" density="compact" variant="outlined"
                      label="" text-start="(G)" text-end="Litre" />
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'litrekg'">
                <VRow>
                  <VCol>
                    <VCurrencyField v-model="section.result.field[0].value" density="compact" variant="outlined"
                      label="" text-start="" text-end="Litre" readonly="true" />
                  </VCol>
                  <VCol>
                    <VCurrencyField v-model="section.result.field[1].value" density="compact" variant="outlined"
                      label="" text-start="" text-end="Kg." readonly="true">
                      <template #append>
                        <VLabel>
                          Kg.
                        </VLabel>
                      </template>
                    </VCurrencyField>
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'kg'">
                <VRow>
                  <VCol>
                    <VCurrencyField v-model="section.result.field[1].value" density="compact" variant="outlined"
                      label="" text-start="" text-end="Kg.">
                    </VCurrencyField>
                  </VCol>
                </VRow>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </VCol>
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
                <VImg :aspect-ratio="1" class="bg-white" :src="image01" width="500" />
              </div>
            </div>
          </tr>
        </tbody>
      </table>
    </VCol>
    <VCol cols="12" lg="12">
      <table class="custom-table">
        <tr>
          <th class="text-center cursor-pointer" colspan="12">
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
          <td style="min-width: 150px;" colspan="4">
            <div v-if="ipaRequestData.whStaffUpdatedDate">
              <span v-if="ipaRequestData.whStaffUpdatedDate">{{ formatDate(ipaRequestData.whStaffUpdatedDate) }}</span>
            </div>
          </td>
          <td style="min-width: 150px;" colspan="4">
            <div v-if="ipaRequestData.whLeaderDate">
              <span v-if="ipaRequestData.whLeaderDate">{{ formatDate(ipaRequestData.whLeaderDate) }}</span>
            </div>
          </td>
          <td style="min-width: 150px;" colspan="4">
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
    <VCol cols="8" class="d-flex justify-end">
      <VBtn v-if="(statusId !== 15 && statusId !== 18)" type="text" color="warning" class="mx-1" @click="saveDraft">
        Draft
      </VBtn>
      <VBtn v-if="(statusId !== 15 && statusId !== 18)" type="text" color="secondary " class="mx-1" @click="submit">
        Submit
      </VBtn>
      <VBtn v-if="(statusId === 18)" type="text" color="primary" class="mx-1" @click="approve">
        Approve
      </VBtn>
    </VCol>
  </VRow>

  <!-- Alert Dialog Success/Fiald new -->
  <section>
    <div>
      <!-- ใช้ AuthenticatorDialog component -->
      <AuthenticatorDialog :is-dialog-visible="isDialogVisibleAlertDialog" :word="wordForSubmit"
        :success="successDialAlert" @update:isDialogVisible="(val) => isDialogVisibleAlertDialog.value = val" />
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

.centered-input>>>input {
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
