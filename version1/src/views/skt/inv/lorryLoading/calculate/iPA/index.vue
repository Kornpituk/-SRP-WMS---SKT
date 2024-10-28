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

watch(ipaItems, (i) => {
  console.log(i);
});

const debugChange = function (e) {
  console.log(ipaItems.value[0].results);
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
              <td style="border: 1px solid black; text-align: center; padding: 10px;">
                <Image :src="image01" cover :width="300" :height="300" />
                <!-- <Image src="/image.jpg" alt="Image" width="250" preview /> -->
              </td>
            </tr>

            <tr v-for="(ipaitem, index) in ipaItems" :key="index">
              <td style="border: 1px solid black; text-align: center;">
                <div v-html=ipaitem.jobFlow></div>
              </td>
              <td style="border: 1px solid black; text-align: center; ">
                <div v-for="practice in ipaitem.practice">
                  <VLabel class="d-flex justify-left pa-md-2">{{ practice }}</VLabel>
                </div>
              </td>
              <td style="border: 1px solid black; text-align: center;">
                <div v-for="condition in ipaitem.condition">
                  <VLabel class="d-flex justify-center pa-md-2">{{ condition }}</VLabel>
                </div>
              </td>
              <td style="border: 1px solid black;">
                <div v-for=" (result, resIndex) in ipaitem.results" :key="resIndex">
                  <div v-if="result.type === 'oknot'">
                    <VRadioGroup inline class="d-flex justify-center" v-model="result.name">
                      <VRadio label="Ok" value="1" />
                      <VRadio label="Not" value="0" />
                    </VRadioGroup>
                  </div>
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
