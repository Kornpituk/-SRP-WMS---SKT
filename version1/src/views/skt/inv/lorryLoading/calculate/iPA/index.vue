<script setup>
import image01 from '@/views/skt/inv/lorryLoading/calculate/iPA/IPA 1.png'
import { watchEffect, computed, watch } from 'vue'
import { ipaItemTemplate } from '@/services/skt/inv/lorryLoading/ipaService';

// let varA = ref(0)
// const varB = ref(0)
// const varC = ref('')
const varD = ref('')
// const varE = ref(0)
// const varF = ref(0)
// const resBpD = ref(0)
// const finalRes = ref(0)

const ipaItems = ref(ipaItemTemplate);

const getValue = function (e) {
  console.log(e.target);
  console.log(ipaItems);
}

watchEffect(ipaItemTemplate[0].result.field, (i) => {
  console.log(ipaItems);
});

const debugChange = function (e) {
  console.log(ipaItems);
}

</script>

<template>
  <div>
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
          <VCol style="border: 1px solid black;" cols="8">
            <div style="font-size: 18px; font-weight: bolder;" class="d-flex justify-center align-center">
              <VTextField density="compact" variant="outlined" label=" By : " v-model="varD" @change="debugChange" />
            </div>
          </VCol>
          <VCol style="border: 1px solid black;" cols="4">
            <div style="font-size: 18px; font-weight: bolder;" class="d-flex justify-center align-center">
              <VTextField density="compact" variant="outlined" label="Issued Date :" />
            </div>
          </VCol>
        </VRow>
        <VRow>
          <VCol style="border: 1px solid black;" cols="8">
            <div style="font-size: 18px; font-weight: bolder;" class="d-flex justify-center align-center">
              <VTextField density="compact" variant="outlined" label="Date" />
            </div>
          </VCol>
          <VCol style="border: 1px solid black;" cols="2">
            <div style="font-size: 18px; font-weight: bolder;" class="d-flex justify-center align-center">
              <VLabel for="customizer-navbar-blur" class="text-high-emphasis">
                Leader
              </VLabel>
            </div>
          </VCol>
          <VCol style="border: 1px solid black;" cols="2">
            <div style="font-size: 18px; font-weight: bolder;" class="d-flex justify-center align-center">
              <VLabel for="customizer-navbar-blur" class="text-high-emphasis">
                Supervisor
              </VLabel>
            </div>
          </VCol>
        </VRow>
        <VRow>
          <VCol style="border: 1px solid black;" cols="8">
            <div style="font-size: 18px; font-weight: bolder;" class="d-flex justify-center align-center">
              <VTextField density="compact" variant="outlined" label=" P/O no." />
            </div>
          </VCol>
          <VCol style="border: 1px solid black;" cols="2">
            <div style="font-size: 18px; font-weight: bolder;" class="d-flex justify-center align-center">
              <VTextField density="compact" variant="outlined" label="" />
            </div>
          </VCol>
          <VCol style="border: 1px solid black;" cols="2">
            <div style="font-size: 18px; font-weight: bolder;" class="d-flex justify-center align-center">
              <VTextField density="compact" variant="outlined" label="" />
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
              <td style="border: 1px solid black; text-align: center; padding: 10px;">
                <h4> Leader</h4>
              </td>
              <td style="border: 1px solid black; text-align: center; padding: 10px;">
                <h4> วิธีปฏิบัติ</h4>
              </td>
              <td style="border: 1px solid black; text-align: center; padding: 10px;">
                <h4> Condition</h4>
              </td>
              <td style="border: 1px solid black; text-align: center; padding: 10px;">
                <h4> ผลการเช็ค</h4>
              </td>
            </tr>
            <tr v-for="(section, sectionIndex) in ipaItems" :key="index">
              <td v-if="section.isSection === true"
                style="border-left: 1px solid black; border-top: 1px solid black; vertical-align : middle;text-align:center;"
                :rowspan=[section.rowSpan]>
                <div v-html=section.sequence></div>
              </td>
              <td style=" border-left: 1px solid black; text-align: left;">
                <VLabel class="d-flex justify-left pa-md-2 text-wrap">{{ section.practice }}</VLabel>
              </td>
              <td style="border-left: 1px solid black; text-align: left;">
                <VLabel class="d-flex justify-center pa-md-2">{{ section.condition }}</VLabel>
              </td>
              <td style="border-left: 1px solid black; width: 450px;">
                <div v-if="section.result.type === 'oknot'">
                  <VRadioGroup inline class="d-flex justify-center" v-model="section.result.field">
                    <VRadio label="Ok" value="1" />
                    <VRadio label="Not" value="0" />
                  </VRadioGroup>
                </div>
                <div v-if="section.result.type === 'ab'">
                  <VRow>
                    <VLabel>
                      (A)
                    </VLabel>
                    <VCol>
                      <VTextField density="compact" variant="outlined" label="" type="number"
                        v-model="section.result.field.a" />
                    </VCol>
                    <VLabel>
                      Kg.
                    </VLabel>
                    <VLabel>
                      (B)
                    </VLabel>
                    <VCol>
                      <VTextField density="compact" variant="outlined" label="" v-model="section.result.field.b" />
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
                      <VTextField density="compact" variant="outlined" label="" type="number"
                        v-model="section.result.field.c" />
                    </VCol>
                    <VLabel>
                      mm.
                    </VLabel>
                    <VLabel>
                      (D)
                    </VLabel>
                    <VCol>
                      <VTextField density="compact" variant="outlined" label="" v-model="section.result.field.d" />
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
                      <VTextField density="compact" variant="outlined" label="" type="number"
                        v-model="section.result.field.bd" />
                    </VCol>
                    <VLabel>
                      Litre
                    </VLabel>
                    <VCol>
                      <VRadioGroup inline class="d-flex justify-center" v-model="section.result.field.ok">
                        <VRadio label="Ok" value="1" />
                        <VRadio label="Not" value="0" />
                      </VRadioGroup>
                    </VCol>
                  </VRow>
                </div>
                <div v-if="section.result.type === 'litre'">
                  <VRow>
                    <VCol>
                      <VTextField density="compact" variant="outlined" label="" type="number"
                        v-model="section.result.field.litre" />
                    </VCol>
                    <VLabel>
                      Litre
                    </VLabel>
                    <VCol>
                      <VRadioGroup inline class="d-flex justify-center" v-model="section.result.field.ok">
                        <VRadio label="Ok" value="1" />
                        <VRadio label="Not" value="0" />
                      </VRadioGroup>
                    </VCol>
                  </VRow>
                </div>
                <div v-if="section.result.type === 'percen'">
                  <VRow>
                    <VCol>
                      <VTextField density="compact" variant="outlined" label="" type="number"
                        v-model="section.result.field.percen" />
                    </VCol>
                    <VLabel>
                      %
                    </VLabel>
                    <VCol>
                      <VRadioGroup inline class="d-flex justify-center" v-model="section.result.field.ok">
                        <VRadio label="Ok" value="1" />
                        <VRadio label="Not" value="0" />
                      </VRadioGroup>
                    </VCol>
                  </VRow>
                </div>
                <div v-if="section.result.type === 'c'">
                  <VRow>
                    <VCol>
                      <VTextField density="compact" variant="outlined" label="" type="number"
                        v-model="section.result.field.c" />
                    </VCol>
                    <VLabel>
                      C'
                    </VLabel>
                    <VCol>
                      <VRadioGroup inline class="d-flex justify-center" v-model="section.result.field.ok">
                        <VRadio label="Ok" value="1" />
                        <VRadio label="Not" value="0" />
                      </VRadioGroup>
                    </VCol>
                  </VRow>
                </div>
                <div v-if="section.result.type === 'actualCheck'">
                  <VRow>
                    <VCol>
                      <VTextField density="compact" variant="outlined" label="" type="number"
                        v-model="section.result.field.a" />
                    </VCol>
                    <VLabel>
                      :
                    </VLabel>
                    <VCol>
                      <VTextField density="compact" variant="outlined" label="" type="number"
                        v-model="section.result.field.b" />
                    </VCol>
                  </VRow>
                </div>
                <div v-if="section.result.type === 'mpa'">
                  <VRow>
                    <VCol>
                      <VTextField density="compact" variant="outlined" label="" type="number"
                        v-model="section.result.field.mpa" />
                    </VCol>
                    <VLabel>
                      ( Mpa )
                    </VLabel>
                    <VCol>
                      <VRadioGroup inline class="d-flex justify-center" v-model="section.result.field.value">
                        <VRadio label="Ok" value="1" />
                        <VRadio label="Not" value="0" />
                      </VRadioGroup>
                    </VCol>
                  </VRow>
                </div>
                <div v-if="section.result.type === 'amp'">
                  <VRow>
                    <VCol>
                      <VTextField density="compact" variant="outlined" label="" type="number"
                        v-model="section.result.field.amp" />
                    </VCol>
                    <VLabel>
                      Amp
                    </VLabel>
                    <VCol>
                      <VRadioGroup inline class="d-flex justify-center" v-model="section.result.field.ok">
                        <VRadio label="Ok" value="1" />
                        <VRadio label="Not" value="0" />
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
                      <VTextField density="compact" variant="outlined" label="" type="number"
                        v-model="section.result.field.e" />
                    </VCol>
                    <VLabel>
                      mm.
                    </VLabel>
                    <VLabel>
                      (F)
                    </VLabel>
                    <VCol>
                      <VTextField density="compact" variant="outlined" label="" v-model="section.result.field.f" />
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
                      <VTextField density="compact" variant="outlined" label="" type="number"
                        v-model="section.result.field.g" />
                    </VCol>        
                    <VLabel>
                      Litre
                    </VLabel>
                  </VRow>
                </div>
                <div v-if="section.result.type === 'litrekg'">
                  <VRow>
                    <VCol>
                      <VTextField density="compact" variant="outlined" label="" type="number"
                        v-model="section.result.field.litre" />
                    </VCol>        
                    <VLabel>
                      Litre
                    </VLabel>
                    <VCol>
                      <VTextField density="compact" variant="outlined" label="" type="number"
                        v-model="section.result.field.kg" />
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
          <VLabel class="d-flex justify-center"><u>สูตรคำนวน</u></VLabel>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <VLabel class="d-flex justify-center">หาเป็นลิตร = mm x 5.32 + 740.45</VLabel>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <VLabel class="d-flex justify-center">หาเป็น mm = Litre - 740.45 / 5.32</VLabel>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <VLabel class="d-flex justify-center">(B) = (A) / 0.78</VLabel>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <!-- <VLabel class="d-flex justify-center"> ={{ ipaItems[0].results[0].name }}/ 0.78</VLabel> -->
        </VCol>
      </VRow>
    </div>
  </div>

</template>

<style scoped>
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
