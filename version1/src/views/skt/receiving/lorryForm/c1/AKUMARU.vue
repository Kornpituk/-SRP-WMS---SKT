<script setup>
import { urlApi } from '@/api'
import VCurrencyField from "@/components/VCurrencyField.vue"
import VNumberInput from '@/components/VNumberInput.vue'
import { akumuruItemTemplate, currencyFormat, passInitialData, passSubmitData, save } from '@/services/skt/inv/lorryLoading/akumaruService'
import { useItemStore } from '@/stores/skt/receingFormStore/itemStore'
import image01 from '@/views/skt/inv/lorryLoading/calculate/akumaru/Acrylic ( 431 ).png'
import axios from '@axios'
import { ref, watchEffect } from 'vue'

//--------------------- alertDialog--------------------------------------------------------
import AuthenticatorDialog from '@/components/dialogs/alert/alertDialog.vue'

import alertWordConst from '@/utilities/constant'


const itemStore = useItemStore()

var lorryItem = reactive(akumuruItemTemplate)
var lorryRequestData = ref({})
const route = useRoute()

const poEtlLogDetailJournalIDQueryParameters = ref(itemStore.getItemDetails('poEtlLogDetailJournalIDCookies'))
const poNo = ref('')


const isDialogVisibleAlertDialog = ref(false)
const wordForSubmit = ref('')
const successDialAlert = ref(false)

const statusId = ref(0)
var isReadOnly = ref(false)

const textAlertDialogFunction = (word, success) => {
  wordForSubmit.value = word
  successDialAlert.value = success
  isDialogVisibleAlertDialog.value = true
  console.log("textAlertDialogFunction Start!!")
}

onMounted(async () => {

  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  await axios.post(`${urlApi.value}/api/v1/LorryFormAkumaru/generate?poEtlLogDetailJournalID=${poEtlLogDetailJournalIDQueryParameters.value}`, [], {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })

  const lorryForm = await axios.get(`${urlApi.value}/api/v1/LorryFormAkumaru/get/${poEtlLogDetailJournalIDQueryParameters.value}`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })

  lorryRequestData.value = lorryForm.data.data
  poNo.value = lorryForm.data.data.purchaseOrderNo

  for (var i of lorryItem) {
    for (var f of i.result.field) {
      f.value = passInitialData(i.result.type, lorryRequestData.value[f.name])
    }
    if(i.practice.field != undefined){
      for (var f of i.practice.field) {
        f.value = passInitialData(i.practice.type, lorryRequestData.value[f.name])
      }
    }
  }


  const lorryFormIPAStatus = await axios.get(`${urlApi.value}/api/v1/ReceivingPlan/GetByPoEtlLogDetailJournalID/${poEtlLogDetailJournalIDQueryParameters.value}`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })

  statusId.value = lorryFormIPAStatus.data.data[0].statusId

  if(statusId.value === 15 || statusId.value === 18 || statusId.value === 17){
    isReadOnly.value = true
  }

})


async function saveDraft(e) {
  for (var i of lorryItem) {
    for (var f of i.result.field) {
      lorryRequestData.value[f.name] = passSubmitData(i.result.type, f.value)
    }

    if(i.practice.field != undefined){
      for (var f of i.practice.field) {
        lorryRequestData.value[f.name] = passSubmitData(i.practice.type, f.value)
      }
    }
  }

  var response = await save(poEtlLogDetailJournalIDQueryParameters, lorryRequestData)

  if (response.status == 200) {
    textAlertDialogFunction(alertWordConst.saveDraft, true)
    setTimeout(() => {
      location.reload()
    }, 1000) // 10000 มิลลิวินาที = 10 วินาที
  } else {
    console.error(response.data)
  }
}

// eslint-disable-next-line sonarjs/cognitive-complexity
async function submit(e) {
  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  for (var i of lorryItem) {
    for (var f of i.result.field) {
      lorryRequestData.value[f.name] = passSubmitData(i.result.type, f.value)
    }

    if(i.practice.field != undefined){
      for (var f of i.practice.field) {
        lorryRequestData.value[f.name] = passSubmitData(i.practice.type, f.value)
      }
    }
  }
  
  var response = await save(poEtlLogDetailJournalIDQueryParameters, lorryRequestData)
  if (response.status == 200) {
    console.log(response.data)
  } else {
    e.preventDefault()
  }

  let isValid = true
  for (var i of lorryItem) {
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

  var response = await axios.post(`${urlApi.value}/api/v1/LorryFormAkumaru/submit/${poEtlLogDetailJournalIDQueryParameters.value}`, null, {
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

  var response = await axios.post(`${urlApi.value}/api/v1/LorryFormAkumaru/approve/${poEtlLogDetailJournalIDQueryParameters.value}`, null, {
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
  var c = lorryItem[0].result.field[0].value + lorryItem[1].result.field[0].value
  var d = lorryItem[37].result.field[0].value
  
  lorryItem[2].result.field[0].value = currencyFormat(c)
  lorryItem[38].result.field[0].value = currencyFormat(c-d)
})


// function mm2litre(mm) {
//   let litre = mm * 5.32 + 740.45

//   return litre.toFixed(2)
// }

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
        AKUMARU S Tank ( 11V - 431 )
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
            v-for="(section, sectionIndex) in lorryItem"
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
              <div v-if="section.practice.type === 'd'">
                <VRow>
                  <VCol>
                    <VLabel class="d-flex justify-left pa-md-2 text-wrap">
                      {{ section.practice.startPracticeText }}
                      <VCurrencyField
                        v-model="section.practice.field[0].value"
                        density="compact"
                        variant="solo"
                        text-start=""
                        text-end=""
                      /> {{ section.practice.endPracticeText }}
                    </VLabel>
                  </VCol>
                </VRow>
              </div>
              <div v-else-if="section.practice.type === 'checkbox'">
                <VCheckbox
                  v-model="section.practice.field[0].value"
                  :label="section.practice.startPracticeText"
                  :false-value="0"
                  :true-value="1"
                />
              </div>
              <div v-else-if="section.practice.type === 'checkbox3'">
                <VRow>
                  <VCol>
                    <VCheckbox
                      v-model="section.practice.field[0].value"
                      :label="section.practice.field[0].startPracticeText"
                      :false-value="0"
                      :true-value="1"
                    />
                  </VCol>
                  <VCol>
                    <VCheckbox
                      v-model="section.practice.field[1].value"
                      :label="section.practice.field[1].startPracticeText"
                      :false-value="0"
                      :true-value="1"
                    />
                  </VCol>
                  <VCol>
                    <VCheckbox
                      v-model="section.practice.field[2].value"
                      :label="section.practice.field[2].startPracticeText"
                      :false-value="0"
                      :true-value="1"
                    />
                  </VCol>
                </VRow>
              </div>
              <div v-else-if="section.practice.type === 'checkbox4'">
                <VRow>
                  <VCol>
                    <VCheckbox
                      v-model="section.practice.field[0].value"
                      :label="section.practice.field[0].startPracticeText"
                      :false-value="0"
                      :true-value="1"
                    />
                  </VCol>
                  <VCol>
                    <VCheckbox
                      v-model="section.practice.field[1].value"
                      :label="section.practice.field[1].startPracticeText"
                      :false-value="0"
                      :true-value="1"
                    />
                  </VCol>
                  <VCol>
                    <VCheckbox
                      v-model="section.practice.field[2].value"
                      :label="section.practice.field[2].startPracticeText"
                      :false-value="0"
                      :true-value="1"
                    />
                  </VCol>
                  <VCol>
                    <VCheckbox
                      v-model="section.practice.field[3].value"
                      :label="section.practice.field[3].startPracticeText"
                      :false-value="0"
                      :true-value="1"
                    />
                  </VCol>
                </VRow>
              </div>
              <div v-else>
                <VLabel class="d-flex justify-left pa-md-2 text-wrap">
                  {{ section.practice }}
                </VLabel>
              </div>
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
              <div v-if="section.result.type === 'ab'">
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
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[1].value"
                      density="compact"
                      variant="solo"
                      text-start="Litre"
                      text-end="(B)"
                      :readonly="isReadOnly"
                    />
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'cd'">
                <VRow>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="outlined"
                      label=""
                      text-start="(C)"
                      text-end="mm."
                      :readonly="isReadOnly"
                    />
                  </VCol>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[1].value"
                      density="compact"
                      variant="solo"
                      text-start="(D)"
                      text-end="mm."
                      :readonly="isReadOnly"
                    />
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'bd'">
                <VRow>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="solo"
                      text-start=" (B) + (D) ="
                      text-end="Litre"
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
              <div v-if="section.result.type === 'litre'">
                <VRow>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="outlined"
                      label=""
                      text-start=""
                      text-end="Litre"
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
              <div v-if="section.result.type === 'percen'">
                <VRow>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="outlined"
                      label=""
                      text-start=""
                      text-end="%"
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
              <div v-if="section.result.type === 'c'">
                <VRow>
                  <VCol>
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
                          Kg.
                        </VLabel>
                      </template>
                    </VTextField> 
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
                      :value-range="23"
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
                      :value-range="59"
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
                      text-end="( Mpa )'"
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
              <div v-if="section.result.type === 'amp'">
                <VRow>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="outlined"
                      label=""
                      text-start=""
                      text-end="Amp'"
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
                      text-end="mm.'"
                      :readonly="isReadOnly"
                    />
                  </VCol>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[1].value"
                      density="compact"
                      variant="outlined"
                      label=""
                      text-start="(F)"
                      text-end="Litre'"
                      :readonly="isReadOnly"
                    />
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'g'">
                <VRow>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="outlined"
                      label=""
                      text-start="(G)"
                      text-end="Litre'"
                      type="number"
                      :readonly="isReadOnly"
                    />
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'litrekg'">
                <VRow>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="outlined"
                      label=""
                      text-start=""
                      text-end="Litre'"
                      :readonly="isReadOnly"
                    />
                  </VCol>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[1].value"
                      density="compact"
                      variant="outlined"
                      label=""
                      text-start=""
                      text-end="Kg.'"
                      :readonly="isReadOnly"
                    >
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
                </VRow>
              </div>
              <div v-if="section.result.type === 'cdkg'">
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
                          Kg.
                        </VLabel>
                      </template>
                    </VTextField> 
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'mpa2'">
                <VRow>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="outlined"
                      label=""
                      text-start=""
                      text-end="( Mpa )"
                      :readonly="isReadOnly"
                    />
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'amp2'">
                <VRow>
                  <VCol>
                    <VCurrencyField
                      v-model="section.result.field[0].value"
                      density="compact"
                      variant="outlined"
                      label=""
                      text-start=""
                      text-end="Amp"
                      :readonly="isReadOnly"
                    />
                  </VCol>
                </VRow>
              </div>
              <div v-if="section.result.type === 'c2'">
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
                </VRow>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </VCol>
    <VCol cols="12">
      <table class="custom-table">
        <tr>
          <td class="tr-border-right-0">
            <VLabel class="d-flex justify-left pa-md-2 text-wrap">
              ข้อควรระวัง
            </VLabel>
          </td>
          <td class="tr-border-left-0">
            : ให้สวมชุด-หน้ากาก ตลอดเวลา เพื่อป้องกันเหตุได้ทันท่วงที
            <br>
            : ขณะ หากเกิดเคมีรั่วไหล ที่ข้อต่อวาล์วท้ายรถให้ทำการดึงสายปิดวาล์วที่อยู่ด้านขางรถ เป็นวาล์ว ฉุกเฉิน และแจ้งหัวหน้างาน หรือผู้ที่เกี่ยวข้องโดย ด่วน
          </td>
          <!--
            <th style="font-size: 16px;" colspan="3">
            : ให้สวมชุด-หน้ากาก ตลอดเวลา เพื่อป้องกันเหตุได้ทันท่วงที
            </th> 
          -->
        </tr>
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
              <span v-if="lorryRequestData.whStaffUpdatedDate">{{ formatDate(lorryRequestData.whStaffUpdatedDate)
              }}</span>
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
        v-if="(statusId !== 15 && statusId !== 18 && statusId !== 17)"
        type="text"
        color="warning"
        class="mx-1"
        @click="saveDraft"
      >
        SAVE Draft
      </VBtn>
      <VBtn
        v-if="(statusId !== 15 && statusId !== 18 && statusId !== 17)"
        type="text"
        color="primary "
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

.tr-border-right-0 {
  border-inline-end: 0 !important;
  font-size: 16px;
}

.tr-border-left-0 {
  border-inline-start: 0 !important;
  font-size: 16px;
}
</style>
