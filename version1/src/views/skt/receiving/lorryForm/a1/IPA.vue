<script setup>
import image01 from '@/views/skt/inv/lorryLoading/calculate/iPA/IPA 1.png'
import { watchEffect, computed, watch, ref } from 'vue'
import axios from '@axios'
import { ipaItemTemplate } from '@/services/skt/inv/lorryLoading/ipaService'
import { urlApi } from '@/api'
import { useItemStore } from '@/stores/skt/receingFormStore/itemStore'
//--------------------- alertDialog--------------------------------------------------------
import AuthenticatorDialog from '@/components/dialogs/alert/alertDialog.vue'

const itemStore = useItemStore()

var ipaItems = reactive(ipaItemTemplate)
var ipaRequestData = ref({})
const route = useRoute()

const data = ref(JSON.parse(route.query.Data || '[]'))
const poEtlLogDetailJournalIDQueryParameters = ref(itemStore.getItemDetails('poEtlLogDetailJournalIDCookies'))
console.log(poEtlLogDetailJournalIDQueryParameters);
const poNo = ref(data.value.itemCode)

const aVariable = ref(ipaItems[6].result.field[0]);
const bVariable = ref(ipaItems[6].result.field[1]);
const cVariable = ref(ipaItems[7].result.field[0]);
const dVariable = ref(ipaItems[7].result.field[1]);
const bdVariable = ref(ipaItems[8].result.field[0]);
const dcsBefore = ref(ipaItems[9].result.field[0]);
const eVariable = ref(ipaItems[46].result.field[0]);
const fVariable = ref(ipaItems[46].result.field[1]);
const gVariable = ref(ipaItems[47].result.field[0]);
var dcsDiff = 0
var tankDiff = 0

const isDialogVisibleAlertDialog = ref(false)
const wordForSubmit = ref('')
const successDialAlert = ref(false)


const textAlertDialogFunction = (word, success) => {
  wordForSubmit.value = word;
  successDialAlert.value = success;
  isDialogVisibleAlertDialog.value = true;
  console.log("textAlertDialogFunction Start!!");
}

onMounted(async () => {

  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  await axios.post(`${urlApi.value}/api/v1/LorryFormIPA/generate?poEtlLogDetailJournalID=${poEtlLogDetailJournalIDQueryParameters.value}`, [], {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })

  const lorryFormIPA = await axios.get(`${urlApi.value}/api/v1/LorryFormIPA/get/${poEtlLogDetailJournalIDQueryParameters.value}`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  });


  ipaRequestData.value = lorryFormIPA.data.data
  for (var i of ipaItems) {
    for (var f of i.result.field) {
      f.value = passInitialData(i.result.type, lorryFormIPA.data.data[f.name])
    }
  }

})

function passInitialData(type, params) {
  if (type == "oknot") {
    if (params == 0) {
      return "0"
    } else if (params == 1) {
      return "1"
    } else {
      return "-1"
    }
  } else {
    return params
  }
}

function passSubmitData(type, params) {
  if (type == "oknot") {
    if (params == "0") {
      return 0
    } else if (params == "1") {
      return 1
    } else {
      return -1
    }
  }
  else {
    return params
  }
}

async function saveDraft(e) {
  for (var i of ipaItems) {
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
    textAlertDialogFunction(alertConst.saveDraft, true);
    window.location.reload();
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
    location.reload()
  } else {
    console.error(response.data)
  }
}

watch(ipaItems[6].result.field[0], async x => {// A
  let b = x.value / (0.78)

  // ipaItems[6].result.field[1].value = parseFloat(b.toFixed(2))

  ipaItems[6].result.field[1].value = b.toFixed(2);
});

watch(ipaItems[7].result.field[0], async x => {// C
  let d = (x.value * 5.32) + 740.45
  ipaItems[7].result.field[1].value = d.toFixed(2); // D
});

watch(ipaItems[46].result.field[0], async x => { // E
  ipaItems[46].result.field[1].value = mm2litre(x.value)// F
});

watchEffect(async () => {
  dcsDiff = (ipaItems[47].result.field[0].value - ipaItems[9].result.field[0].value).toFixed(2);
  tankDiff = (ipaItems[46].result.field[1].value - ipaItems[7].result.field[1].value).toFixed(2);
  ipaItems[8].result.field[0].value = (parseFloat(ipaItems[6].result.field[1].value) + parseFloat(ipaItems[7].result.field[1].value)).toFixed(2);
  ipaItems[49].result.field[0].value = (parseFloat(ipaItems[8].result.field[0].value) - parseFloat(ipaItems[46].result.field[1].value)).toFixed(2);
  ipaItems[49].result.field[1].value = (parseFloat(ipaItems[49].result.field[0].value) * 0.78).toFixed(2);
});


function mm2litre(mm) {
  let litre = mm * 5.32 + 740.45;
  return litre.toFixed(2);
}

//----------------- Formate
function formatDate(dateString) {
  if (dateString === null || dateString === '' || dateString === undefined) {
    return 'Null'
  } else if (dateString.length > 0) {
    const date = new Date(dateString) // แปลงสตริงเป็นวัตถุ Date
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0') // เดือนเริ่มต้นที่ 0, ดังนั้นต้อง +1
    const year = date.getFullYear()

    return `${day}/${month}/${year}`

  }

  return 'null'
}
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
        ISOPRO (IPA)
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
              Job Flow
            </th>
            <th class="text-center" style="font-size: 16px;" colspan="3">
              Manual works
            </th>
            <th class="text-center" style="font-size: 16px;" colspan="3">
              Condition
            </th>
            <th class="text-center" style="font-size: 16px;" colspan="4">
              Result
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(section, sectionIndex) in ipaItems" :key="sectionIndex" :sectionIndex="sectionIndex">
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
                    <VTextField v-model="section.result.field[0].value" density="compact" variant="outlined" label=""
                      type="number">
                      <template #append>
                        <VLabel>
                          Kg.
                        </VLabel>
                      </template>
                      <template #prepend>
                        <VLabel>
                          (A)
                        </VLabel>
                      </template>
                    </VTextField>
                  </VCol>
                  <VCol>
                    <VTextField v-model="section.result.field[1].value" density="compact" variant="solo" type="number"
                      readonly>
                      <template #append>
                        <VLabel>
                          Litre
                        </VLabel>
                      </template>
                      <template #prepend>
                        <VLabel>
                          (B)
                        </VLabel>
                      </template>
                    </VTextField>
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'cd'">
                <VRow>
                  <VCol>
                    <VTextField v-model="section.result.field[0].value" density="compact" variant="outlined" label=""
                      type="number">
                      <template #append>
                        <VLabel>
                          mm.
                        </VLabel>
                      </template>
                      <template #prepend>
                        <VLabel>
                          (C)
                        </VLabel>
                      </template>
                    </VTextField>
                  </VCol>
                  <VCol>
                    <VTextField v-model="section.result.field[1].value" density="compact" variant="solo" readonly
                      type="number">
                      <template #append>
                        <VLabel>
                          Litre
                        </VLabel>
                      </template>
                      <template #prepend>
                        <VLabel>
                          (D)
                        </VLabel>
                      </template>
                    </VTextField>
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'bd'">
                <VRow>
                  <VCol>
                    <VTextField v-model="section.result.field[0].value" density="compact" variant="solo" type="number">
                      <template #append>
                        <VLabel>
                          Litre
                        </VLabel>
                      </template>
                      <template #prepend>
                        <VLabel>
                          (B) + (D) =
                        </VLabel>
                      </template>
                    </VTextField>
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
                    <VTextField v-model="section.result.field[0].value" density="compact" variant="outlined" label=""
                      type="number" />
                  </VCol>
                  <VLabel>
                    Litre
                  </VLabel>
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
                    <VTextField v-model="section.result.field[0].value" density="compact" variant="outlined" label=""
                      type="number" />
                  </VCol>
                  <VLabel>
                    %
                  </VLabel>
                  <VCol>
                    <VRadioGroup v-model="section.result.field[1].value" inline class="d-flex justify-center">
                      <VRadio label="Ok" value="1" />
                      <VRadio label="Not" value="0" />
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'c'">
                <VRow>
                  <VCol>
                    <VTextField v-model="section.result.field[0].value" density="compact" variant="outlined" label=""
                      type="number" />
                  </VCol>
                  <VLabel>
                    C'
                  </VLabel>
                  <VCol>
                    <VRadioGroup v-model="section.result.field[1].value" inline class="d-flex justify-center">
                      <VRadio label="Ok" value="1" />
                      <VRadio label="Not" value="0" />
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'actualCheck'">
                <VRow>
                  <VCol>
                    <VTextField v-model="section.result.field[0].value" density="compact" variant="outlined" label="" />
                  </VCol>
                  <VLabel>
                    :
                  </VLabel>
                  <VCol>
                    <VTextField v-model="section.result.field[1].value" density="compact" variant="outlined" label="" />
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'mpa'">
                <VRow>
                  <VCol>
                    <VTextField v-model="section.result.field[0].value" density="compact" variant="outlined" label=""
                      type="number">
                      <template #append>
                        <VLabel>
                          ( Mpa )
                        </VLabel>
                      </template>
                    </VTextField>
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
                    <VTextField v-model="section.result.field[0].value" density="compact" variant="outlined" label=""
                      type="number">
                      <template #append>
                        <VLabel>
                          Amp
                        </VLabel>
                      </template>
                    </VTextField>
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
                    <VTextField v-model="section.result.field[0].value" density="compact" variant="outlined" label=""
                      type="number">
                      <template #prepend>
                        <VLabel>
                          (E)
                        </VLabel>
                      </template>
                      <template #append>
                        <VLabel>
                          mm.
                        </VLabel>
                      </template>
                    </VTextField>
                  </VCol>
                  <VCol>
                    <VTextField v-model="section.result.field[1].value" density="compact" variant="outlined" label="">
                      <template #prepend>
                        <VLabel>
                          (F)
                        </VLabel>
                      </template>
                      <template #append>
                        <VLabel>
                          Litre
                        </VLabel>
                      </template>
                    </VTextField>
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'g'">
                <VRow>
                  <VCol>
                    <VTextField v-model="section.result.field[0].value" density="compact" variant="outlined" label=""
                      type="number">
                      <template #prepend>
                        <VLabel>
                          (G)
                        </VLabel>
                      </template>
                      <template #append>
                        <VLabel>
                          Litre
                        </VLabel>
                      </template>
                    </VTextField>
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'litrekg'">
                <VRow>
                  <VCol>
                    <VTextField v-model="section.result.field[0].value" density="compact" variant="outlined" label=""
                      type="number">
                      <template #append>
                        <VLabel>
                          Litre
                        </VLabel>
                      </template>
                    </VTextField>
                  </VCol>

                  <VCol>
                    <VTextField v-model="section.result.field[1].value" density="compact" variant="outlined" label=""
                      type="number">
                      <template #append>
                        <VLabel>
                          Kg.
                        </VLabel>
                      </template>
                    </VTextField>
                  </VCol>
                </VRow>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </VCol>
    <!-- Calculation formula -->
    <VCol cols="12">
      <div style="border: 1px solid black;">
        <VRow>
          <VCol>
            <VLabel class="d-flex justify-center">
              <u>สูตรคำนวน</u>
            </VLabel>
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VLabel class="d-flex justify-center">
              หาเป็นลิตร = mm x 5.32 + 740.45
            </VLabel>
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VLabel class="d-flex justify-center">
              หาเป็น mm = Litre - 740.45 / 5.32
            </VLabel>
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VLabel class="d-flex justify-center">
              (B) = (A) / 0.78
            </VLabel>
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VLabel class="d-flex justify-center">
              = {{ aVariable.value }} /0.78
            </VLabel>
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VLabel class="d-flex justify-center">
              = {{ bVariable.value }} Litre
            </VLabel>
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VLabel class="d-flex justify-center">
              (D) - ((C) X 5.32) + 740.45
            </VLabel>
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VLabel class="d-flex justify-center">
              = ({{ cVariable.value }}X 5.32 ) + 740.45
            </VLabel>
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VLabel class="d-flex justify-center">
              = {{ dVariable.value }}Litre
            </VLabel>
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VLabel class="d-flex justify-center">
              Density IPA = 0.78
            </VLabel>
          </VCol>
        </VRow>
      </div>
    </VCol>
    <!-- Dcs Tank -->
    <VCol cols="12">
      <table class="custom-table">
        <thead>
          <tr>
            <th />
            <th class="text-center" style="font-size: 16px;">
              DSC
            </th>
            <th class="text-center" style="font-size: 16px;">
              TANK
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-size: 16px;">
              After
            </td>
            <td class="py-4 text-center">
              {{ gVariable.value }}
            </td>
            <td class="py-4 text-center">
              {{ fVariable.value }}
            </td>
            <td style="font-size: 16px;">
              Ltr
            </td>
          </tr>
          <tr>
            <td style="font-size: 16px;">
              Before
            </td>
            <td class="py-4 text-center">
              {{ dcsBefore.value }}
            </td>
            <td class="py-4 text-center">
              {{ dVariable.value }}
            </td>
            <td style="font-size: 16px;">
              Ltr
            </td>
          </tr>
          <tr>
            <td style="font-size: 16px;">
              Diff
            </td>
            <td class="py-4 text-center">
              {{ dcsDiff }}
            </td>
            <td class="py-4 text-center">
              {{ tankDiff }}
            </td>
            <td style="font-size: 16px;">
              Ltr
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
      <VBtn type="text" color="warning" class="mx-2" @click="saveDraft">
        Draft
      </VBtn>
      <VBtn type="text" color="secondary" @click="submit">
        Submit
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
