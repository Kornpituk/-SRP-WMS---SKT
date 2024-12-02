<script setup>
import { urlApi } from '@/api'
import {
  formatDate,
  generate,
  get,
  GetByPoEtlLogDetailJournalID,
  ItemTemplate,
  mm2litre,
  passInitialData,
  passSubmitData,
} from '@/services/skt/inv/lorryLoading/skt144Service'
import { useItemStore } from '@/stores/skt/receingFormStore/itemStore'
import image01 from '@/views/skt/inv/lorryLoading/calculate/iPA/IPA 1.png'
import axios from '@axios'
import { ref } from 'vue'

//--------------------- alertDialog--------------------------------------------------------
import AuthenticatorDialog from '@/components/dialogs/alert/alertDialog.vue'
import { currencyFormat } from '@/services/skt/inv/lorryLoading/akumaruService'
import alertWordConst from '@/utilities/constant'


const itemStore = useItemStore()

var lorryItems = reactive(ItemTemplate)
var lorryRequestData = ref({})
const route = useRoute()

const data = ref(JSON.parse(route.query.Data || '[]'))
const poEtlLogDetailJournalIDQueryParameters = ref(itemStore.getItemDetails('poEtlLogDetailJournalIDCookies'))
const poNo = ref('')

const aVariable = ref(lorryItems[6].result.field[0])
const bVariable = ref(lorryItems[6].result.field[1])
const cVariable = ref(lorryItems[7].result.field[0])
const dVariable = ref(0)
var isReadOnly = ref(false)

var dcsAfter = ref(0)
var dcsBefore = ref(0)
var dcsDiff = 0

var tankAfter = ref(0)
var tankBefore = ref(0)
var tankDiff = ref(0)

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

  await generate(poEtlLogDetailJournalIDQueryParameters.value)

  const lorryForm = await get(poEtlLogDetailJournalIDQueryParameters.value)

  lorryRequestData.value = lorryForm.data.data

  poNo.value = lorryForm.data.data.purchaseOrderNo

  for (var i of lorryItems) {
    let index = 0
    for (var f of i.result.field) {
      f.value = passInitialData(i.result.type, lorryForm.data.data[f.name], index)
      index ++
    }
  }

  const lorryFormStatus = await GetByPoEtlLogDetailJournalID(poEtlLogDetailJournalIDQueryParameters.value)

  console.log("statusId", lorryFormStatus.data)

  statusId.value = lorryFormStatus.data.data[0].statusId

  if(statusId.value == 15 || statusId.value == 18){
    isReadOnly.value = true
  }

})

async function saveDraft(e) {

  for (var i of lorryItems) {
    for (var f of i.result.field) {
      lorryRequestData.value[f.name] = passSubmitData(i.result.type, f.value)
    }
  }

  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  var response = await axios.post(`${urlApi.value}/api/v1/LorryFormEpichlo/save/${poEtlLogDetailJournalIDQueryParameters.value}`, lorryRequestData.value, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })

  if (response.status == 200) {
    textAlertDialogFunction(alertWordConst.saveDraft, true)
    setTimeout(() => {
      location.reload()
    }, 1000) // 10000 มิลลิวินาที = 10 วินาที
  } else {
    console.error(response.data)
  }
}

async function submit(e) {
  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')


  let isValid = true
  for (var i of lorryItems) {
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
 

  var response = await axios.post(`${urlApi.value}/api/v1/LorryFormEpichlo/submit/${poEtlLogDetailJournalIDQueryParameters.value}`, null, {
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
  }
}

async function approve(e) {
  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  var response = await axios.post(`${urlApi.value}/api/v1/LorryFormEpichlo/approve/${poEtlLogDetailJournalIDQueryParameters.value}`, null, {
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
  var b = lorryItems[6].result.field[0].value / (0.78)
  var d = lorryItems[7].result.field[0].value == 0 ? 0 : (lorryItems[7].result.field[0].value * 5.32) + 740.45
  var f = lorryItems[42].result.field[0].value == 0 ? 0 : mm2litre(lorryItems[42].result.field[0].value)
  lorryItems[6].result.field[1].value = currencyFormat(b)
  lorryItems[7].result.field[1].value = currencyFormat(d)
  lorryItems[8].result.field[0].value = currencyFormat(b+d)
  lorryItems[42].result.field[1].value = currencyFormat(f)
  lorryItems[44].result.field[0].value = currencyFormat(((b + d) - f))
  lorryItems[44].result.field[1].value = currencyFormat(((b + d) - f) * 0.78)

  dcsAfter.value = currencyFormat(lorryItems[43].result.field[0].value)
  dcsBefore.value = currencyFormat(lorryItems[9].result.field[0].value)
  dcsDiff = currencyFormat(lorryItems[43].result.field[0].value - lorryItems[9].result.field[0].value)

  tankAfter.value = currencyFormat(f)
  tankBefore.value = currencyFormat(d)
  tankDiff.value = currencyFormat(f-d)


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
        SKTV-144
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
              Job Flow
            </th>
            <th
              class="text-center"
              style="font-size: 16px;"
              colspan="3"
            >
              Manual works
            </th>
            <th
              class="text-center"
              style="font-size: 16px;"
              colspan="3"
            >
              Condition
            </th>
            <th
              class="text-center"
              style="font-size: 16px;"
              colspan="4"
            >
              Result
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(section, sectionIndex) in lorryItems"
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
              style="min-width: 500px; border-left: 1px solid black;"
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
                <VRow>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="solo"
                      text-start="(A)"
                      text-end="Kg."
                      :readonly="isReadOnly"
                    />
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'bc'">
                <VRow>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="outlined"
                      label=""
                      text-start="(B)"
                      text-end="mm."
                      :readonly="isReadOnly"
                    />
                  </VCol>
                  <VCol>
                    <VTextField
                      v-model="section.result.field[1].value"
                      density="compact"
                      variant="solo"
                      readonly="true"
                    >
                      <template #prepend>
                        <VLabel>
                          (C)
                        </VLabel>
                      </template>
                      <template #append>
                        <VLabel>
                          kg
                        </VLabel>
                      </template>
                    </VTextField>
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'mm'">
                <VRow>
                  <VCol col="9">
                    <VTextField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="solo"
                      :readonly="isReadOnly"
                    >
                      <template #prepend>
                        <VLabel />
                      </template>
                      <template #append>
                        <VLabel>
                          mm.
                        </VLabel>
                      </template>
                    </VTextField>
                  </VCol>
                  <VCol col="3">
                    <VRadioGroup
                      v-model="section.result.field[1].value"
                      inline
                      class="d-flex justify-center"
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
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'ac'">
                <VRow>
                  <VCol>
                    <VTextField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="solo"
                      :readonly="isReadOnly"
                    >
                      <template #prepend>
                        <VLabel>
                          (A)+(C) = D
                        </VLabel>
                      </template>
                      <template #append>
                        <VLabel>
                          Kg.
                        </VLabel>
                      </template>
                    </VTextField>
                  </VCol>
                  <VCol col="3">
                    <VRadioGroup
                      v-model="section.result.field[1].value"
                      inline
                      class="d-flex justify-center"
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
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'percent'">
                <VRow>
                  <VCol col="9">
                    <VTextField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="solo"
                      :readonly="isReadOnly"
                    >
                      <template #prepend>
                        <VLabel />
                      </template>
                      <template #append>
                        <VLabel>
                          %
                        </VLabel>
                      </template>
                    </VTextField>
                  </VCol>
                  <VCol col="3">
                    <VRadioGroup
                      v-model="section.result.field[1].value"
                      inline
                      class="d-flex justify-center"
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
                  </VCol>
                </VRow>
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
              <div v-if="section.result.type === 'mpa'">
                <VRow>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="outlined"
                      label=""
                      text-start=""
                      text-end="(Mpa)"
                      :readonly="isReadOnly"
                    />
                  </VCol>
                  <VCol>
                    <VRadioGroup
                      v-model="section.result.field[1].value"
                      inline
                      class="d-flex justify-center"
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
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'ef'">
                <VRow>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="outlined"
                      label=""
                      text-start="(E)"
                      text-end="mm."
                      :readonly="isReadOnly"
                    />
                  </VCol>
                  <VCol>
                    <VTextField
                      v-model="section.result.field[1].value"
                      density="compact"
                      variant="solo"
                      readonly="true"
                    >
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
              <div v-if="section.result.type === 'mm2'">
                <VRow>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="outlined"
                      label=""
                      text-start=""
                      text-end="mm."
                      :readonly="isReadOnly"
                    />
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'kg'">
                <VRow>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="outlined"
                      label=""
                      text-start=""
                      text-end="Kg."
                      :readonly="isReadOnly"
                    />
                  </VCol>

                  <VCol>
                    <VRadioGroup
                      v-model="section.result.field[1].value"
                      inline
                      class="d-flex justify-center"
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
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === '25c'">
                <VRow>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="outlined"
                      label=""
                      text-start=""
                      text-end="C°"
                      :readonly="isReadOnly"
                    />
                  </VCol>
                  <VCol>
                    <VRadioGroup
                      v-model="section.result.field[1].value"
                      inline
                      class="justify-center"
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
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'litrekg'">
                <VRow>
                  <VCol>
                    <VTextField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="solo"
                      readonly="true"
                    >
                      <template #prepend>
                        <VLabel />
                      </template>
                      <template #append>
                        <VLabel>
                          Litre
                        </VLabel>
                      </template>
                    </VTextField> 
                  </VCol>
                  <VCol>
                    <VTextField
                      v-model="section.result.field[1].value"
                      density="compact"
                      variant="solo"
                      readonly="true"
                    >
                      <template #prepend>
                        <VLabel />
                      </template>
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
              (D) = ((C) X 5.32) + 740.45
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
              = {{ dVariable }} Litre
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
            <th
              class="text-center"
              style="font-size: 16px;"
            >
              DSC
            </th>
            <th
              class="text-center"
              style="font-size: 16px;"
            >
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
              {{ dcsAfter }}
            </td>
            <td class="py-4 text-center">
              {{ tankAfter }}
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
              {{ dcsBefore }}
            </td>
            <td class="py-4 text-center">
              {{ tankBefore }}
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
            <span>Staff: {{ lorryRequestData.whStaff }}</span>
          </td>
          <td colspan="4">
            <span>Leader: {{ lorryRequestData.whLeader }}</span>
          </td>
          <td colspan="4">
            <span>Supervisor: {{ lorryRequestData.whSupervisor }}</span>
          </td>
        </tr>
        <tr>
          <td
            style="min-width: 150px;"
            colspan="4"
          >
            <div v-if="lorryRequestData.whStaffUpdatedDate">
              <span v-if="lorryRequestData.whStaffUpdatedDate">{{ formatDate(lorryRequestData.whStaffUpdatedDate) }}</span>
            </div>
          </td>
          <td
            style="min-width: 150px;"
            colspan="4"
          >
            <div v-if="lorryRequestData.whLeaderDate">
              <span v-if="lorryRequestData.whLeaderDate">{{ formatDate(lorryRequestData.whLeaderDate) }}</span>
            </div>
          </td>
          <td
            style="min-width: 150px;"
            colspan="4"
          >
            <div v-if="lorryRequestData.whSupervisorDate">
              <span v-if="lorryRequestData.whSupervisorDate">{{ formatDate(lorryRequestData.whSupervisorDate) }}</span>
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
