<script setup>
import image01 from '@/views/skt/inv/lorryLoading/calculate/iPA/IPA 1.png'
import { watchEffect, computed, watch, ref } from 'vue'
import axios from '@axios'
import { ipaItemTemplate } from '@/services/skt/inv/lorryLoading/ipaService'
import { urlApi } from '@/api'

var ipaItems = reactive(ipaItemTemplate)
var ipaRequestData = ref({})

var aVariable = ref(ipaItems[6].result.field[0])
var bVariable = ref(ipaItems[6].result.field[1])
var cVariable = ref(ipaItems[7].result.field[0])
var dVariable = ref(ipaItems[7].result.field[1])
var bdVariable = ref(ipaItems[8].result.field[0])

// var eVariable = ref(ipaItems[8].result.field[0]);
// var eVariable = ref(ipaItems[8].result.field[0]);

onMounted(async () => {

  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  await axios.post(`${urlApi.value}/api/v1/LorryFormIPA/generate?poEtlLogDetailJournalID=415`, [], {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })

  const lorryFormIPA = await axios.get(`${urlApi.value}/api/v1/LorryFormIPA/get/415`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })

  ipaRequestData.value = lorryFormIPA.data.data
  for (var i of ipaItems) {
    for (var f of i.result.field) {
      console.log(f.name, ":", lorryFormIPA.data.data[f.name])
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

  console.log(ipaRequestData.value)

  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  await axios.post(`${urlApi.value}/api/v1/LorryFormIPA/save/415`, ipaRequestData.value, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
}

async function submit(e) {
  const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
  const whereHouse = localStorage.getItem('whereHouseName')

  await axios.post(`${urlApi.value}/api/v1/LorryFormIPA/submit/415`, null, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
}



watch(ipaItems[6].result.field[0], async x => {
  let b = x.value / (0.78)
  ipaItems[6].result.field[1].value = b
})

watch(ipaItems[7].result.field[0], async x => {
  let d = (x.value * 5.32) + 740.45
  ipaItems[7].result.field[1].value = d
  ipaItems[8].result.field[0].value = ipaItems[6].result.field[1].value + ipaItems[7].result.field[1].value
})

watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/1`,
  )

  var res = await response.json()
  console.log(res)
  
})
</script>

<template>
  <VContainer>
    <VRow>
      <VCol cols="6">
        <VRow>
          <VCol cols="12">
            <h3 class="d-flex justify-center align-center pa-0">
              Lorry Loading Check List<br>
            </h3>
          </VCol>
          <VCol cols="12">
            <h4 class="d-flex justify-center align-center pa-0">
              ISOPRO (IPA)
            </h4>
          </VCol>
        </VRow>
      </VCol>
      <VCol cols="6">
        <VRow>
          <VCol
            style="border: 1px solid black;"
            cols="8"
          >
            <div
              style="font-size: 18px; font-weight: bolder;"
              class="d-flex justify-center align-center"
            >
              <VTextField
                v-model="aValue"
                density="compact"
                variant="outlined"
                label=" By : "
              />
            </div>
          </VCol>
          <VCol
            style="border: 1px solid black;"
            cols="4"
          >
            <div
              style="font-size: 18px; font-weight: bolder;"
              class="d-flex justify-center align-center"
            >
              <VTextField
                density="compact"
                variant="outlined"
                label="Issued Date :"
              />
            </div>
          </VCol>
        </VRow>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VTable>
          <tbody>
            <tr>
              <td style="padding: 10px; border: 1px solid black; text-align: center;">
                <h4> Leader</h4>
              </td>
              <td style="padding: 10px; border: 1px solid black; text-align: center;">
                <h4> วิธีปฏิบัติ</h4>
              </td>
              <td style="padding: 10px; border: 1px solid black; text-align: center;">
                <h4> Condition</h4>
              </td>
              <td style="padding: 10px; border: 1px solid black; text-align: center;">
                <h4> ผลการเช็ค</h4>
              </td>
            </tr>
            <tr
              v-for="(section, sectionIndex) in ipaItems"
              :key="sectionIndex"
            >
              <td
                v-if="section.isSection === true"
                style="border-top: 1px solid black; border-left: 1px solid black; text-align: center; vertical-align: middle;"
                :rowspan="[section.rowSpan]"
              >
                <div v-html="section.sequence" />
              </td>
              <td style=" border-left: 1px solid black; text-align: start;">
                <VLabel class="d-flex justify-left pa-md-2 text-wrap">
                  {{ section.practice }}
                </VLabel>
              </td>
              <td style="border-left: 1px solid black; text-align: start;">
                <VLabel class="d-flex justify-center pa-md-2">
                  {{ section.condition }}
                </VLabel>
              </td>
              <td style="width: 450px; border-left: 1px solid black;">
                <div v-if="section.result.type === 'oknot'">
                  <!-- <VRadioGroup inline class="d-flex justify-center" v-model="section.result.field[0].value"> -->
                  <VRadioGroup
                    v-model="section.result.field[0].value"
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
                </div>
                <div v-if="section.result.type === 'ab'">
                  <VRow>
                    <VLabel>
                      (A)
                    </VLabel>
                    <VCol>
                      <VTextField
                        v-model="section.result.field[0].value"
                        density="compact"
                        variant="outlined"
                        label=""
                        type="number"
                      />
                    </VCol>
                    <VLabel>
                      Kg.
                    </VLabel>
                    <VLabel>
                      (B)
                    </VLabel>
                    <VCol>
                      <VTextField
                        v-model="section.result.field[1].value"
                        density="compact"
                        variant="outlined"
                        label=""
                      />
                    </VCol>
                    <VLabel>
                      Litre
                    </VLabel>
                  </VRow>
                </div>
                <div v-if="section.result.type === 'cd'">
                  <VRow>
                    <VLabel>
                      (C)
                    </VLabel>
                    <VCol>
                      <VTextField
                        v-model="section.result.field[0].value"
                        density="compact"
                        variant="outlined"
                        label=""
                        type="number"
                      />
                    </VCol>
                    <VLabel>
                      mm.
                    </VLabel>
                    <VLabel>
                      (D)
                    </VLabel>
                    <VCol>
                      <VTextField
                        v-model="section.result.field[1].value"
                        density="compact"
                        variant="outlined"
                        label=""
                      />
                    </VCol>
                    <VLabel>
                      Litre
                    </VLabel>
                  </VRow>
                </div>
                <div v-if="section.result.type === 'bd'">
                  <VRow>
                    <VLabel>
                      (B) + (D) =
                    </VLabel>
                    <VCol>
                      <VTextField
                        v-model="section.result.field[0].value"
                        density="compact"
                        variant="outlined"
                        label=""
                        type="number"
                      />
                    </VCol>
                    <VLabel>
                      Litre
                    </VLabel>
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
                <div v-if="section.result.type === 'litre'">
                  <VRow>
                    <VCol>
                      <VTextField
                        v-model="section.result.field[0].value"
                        density="compact"
                        variant="outlined"
                        label=""
                        type="number"
                      />
                    </VCol>
                    <VLabel>
                      Litre
                    </VLabel>
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
                <div v-if="section.result.type === 'percen'">
                  <VRow>
                    <VCol>
                      <VTextField
                        v-model="section.result.field[0].value"
                        density="compact"
                        variant="outlined"
                        label=""
                        type="number"
                      />
                    </VCol>
                    <VLabel>
                      %
                    </VLabel>
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
                  <VRow>
                    <VCol>
                      <VTextField
                        v-model="section.result.field[0].value"
                        density="compact"
                        variant="outlined"
                        label=""
                        type="number"
                      />
                    </VCol>
                    <VLabel>
                      C'
                    </VLabel>
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
                <div v-if="section.result.type === 'actualCheck'">
                  <VRow>
                    <VCol>
                      <VTextField
                        v-model="section.result.field[0].value"
                        density="compact"
                        variant="outlined"
                        label=""
                      />
                    </VCol>
                    <VLabel>
                      :
                    </VLabel>
                    <VCol>
                      <VTextField
                        v-model="section.result.field[1].value"
                        density="compact"
                        variant="outlined"
                        label=""
                      />
                    </VCol>
                  </VRow>
                </div>
                <div v-if="section.result.type === 'mpa'">
                  <VRow>
                    <VCol>
                      <VTextField
                        v-model="section.result.field[0].value"
                        density="compact"
                        variant="outlined"
                        label=""
                        type="number"
                      />
                    </VCol>
                    <VLabel>
                      ( Mpa )
                    </VLabel>
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
                <div v-if="section.result.type === 'amp'">
                  <VRow>
                    <VCol>
                      <VTextField
                        v-model="section.result.field[0].value"
                        density="compact"
                        variant="outlined"
                        label=""
                        type="number"
                      />
                    </VCol>
                    <VLabel>
                      Amp
                    </VLabel>
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
                <div v-if="section.result.type === 'ef'">
                  <VRow>
                    <VLabel>
                      (E)
                    </VLabel>
                    <VCol>
                      <VTextField
                        v-model="section.result.field[0].value"
                        density="compact"
                        variant="outlined"
                        label=""
                        type="number"
                      />
                    </VCol>
                    <VLabel>
                      mm.
                    </VLabel>
                    <VLabel>
                      (F)
                    </VLabel>
                    <VCol>
                      <VTextField
                        v-model="section.result.field[1].value"
                        density="compact"
                        variant="outlined"
                        label=""
                      />
                    </VCol>
                    <VLabel>
                      Litre
                    </VLabel>
                  </VRow>
                </div>
                <div v-if="section.result.type === 'g'">
                  <VRow>
                    <VLabel>
                      (G)
                    </VLabel>
                    <VCol>
                      <VTextField
                        v-model="section.result.field[0].value"
                        density="compact"
                        variant="outlined"
                        label=""
                        type="number"
                      />
                    </VCol>
                    <VLabel>
                      Litre
                    </VLabel>
                  </VRow>
                </div>
                <div v-if="section.result.type === 'litrekg'">
                  <VRow>
                    <VCol>
                      <VTextField
                        v-model="section.result.field[0].value"
                        density="compact"
                        variant="outlined"
                        label=""
                        type="number"
                      />
                    </VCol>
                    <VLabel>
                      Litre
                    </VLabel>
                    <VCol>
                      <VTextField
                        v-model="section.result.field[1].value"
                        density="compact"
                        variant="outlined"
                        label=""
                        type="number"
                      />
                    </VCol>
                    <VLabel>
                      Kg.
                    </VLabel>
                  </VRow>
                </div>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCol>
    </VRow>
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
    <div style="border: 1px solid black;">
      <VTable>
        <tr>
          <th />
          <th>DCS</th>
          <th>TANK</th>
          <th />
        </tr>
        <tr>
          <td>After</td>
          <td />
          <td />
          <td>Ltr</td>
        </tr>
        <tr>
          <td>Befor</td>
          <td />
          <td />
          <td>Ltr</td>
        </tr>
        <tr>
          <td>Diff</td>
          <td />
          <td />
          <td>Ltr</td>
        </tr>
      </VTable>
    </div>
    <div style="border: 1px solid black;">
      <Vrow>
        <VCol style="border: 1px solid black;">
          Flow Chart
        </VCol>
      </Vrow>
      <Vrow>
        <VCol cols="12">
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
        </VCol>
      </Vrow>
    </div>
    <div style="border: 1px solid black;">
      <VRow>
        <VCol
          cols="2"
          class="d-flex justify-center "
        >
          <VLabel class="d-flex justify-center pa-2">
            Location
          </VLabel>
        </VCol>
        <VCol
          cols="3"
          class="justify-left"
        >
          <VCombobox
            label="Combobox"
            :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
          />
        </VCol>
      </VRow>
    </div>
    <div style="border: 1px solid black;">
      <VRow>
        <VCol
          cols="12"
          class="d-flex justify-center"
        >
          Lorry Loading Check List
        </VCol>
      </VRow>
    </div>
    <div style="border: 1px solid black;">
      <VRow>
        <VCol
          cols="4"
          class="d-flex justify-center"
          style="border: 1px solid black;"
        >
          <VTextField
            density="compact"
            variant="outlined"
            label="Staff"
          />
        </VCol>
        <VCol
          cols="4"
          class="d-flex justify-center"
          style="border: 1px solid black;"
        >
          <VTextField
            density="compact"
            variant="outlined"
            label="Leader"
          />
        </VCol>
        <VCol
          cols="4"
          class="d-flex justify-center"
          style="border: 1px solid black;"
        >
          <VTextField
            density="compact"
            variant="outlined"
            label="SuperVisor"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="4"
          class="d-flex justify-center"
          style="border: 1px solid black;"
        >
          <VTextField
            density="compact"
            variant="outlined"
            label="Date"
          />
        </VCol>
        <VCol
          cols="4"
          class="d-flex justify-center"
          style="border: 1px solid black;"
        >
          <VTextField
            density="compact"
            variant="outlined"
            label="Date"
          />
        </VCol>
        <VCol
          cols="4"
          class="d-flex justify-center"
          style="border: 1px solid black;"
        >
          <VTextField
            density="compact"
            variant="outlined"
            label="Date"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="1"
          class="justify-right offset-10"
        >
          <VBtn
            type="text"
            style="width: 100%;"
            color="warning"
            @click="saveDraft"
          >
            Draft
          </VBtn>
        </Vcol>
        <VCol
          cols="1"
          class="justify-right"
        >
          <VBtn
            type="text"
            style="width: 100%;"
            color="secondary"
            @click="submit"
          >
            Submit
          </VBtn>
        </Vcol>
      </VRow>
    </div>
  </VContainer>
</template>

<style scoped>
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
