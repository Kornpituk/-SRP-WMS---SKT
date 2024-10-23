<script setup>
const vasss = ref('dd')

import image01 from '@/views/skt/inv/lorryLoading/calculate/iPA/IPA 1.png'
import { watchEffect, computed } from 'vue'

let varA = ref(0)
const varB = ref(0)
const varC = ref(0)
const varD = ref(0)
const varE = ref(0)
const varF = ref(0)
const resBpD = ref(0)
const finalRes = ref(0)



const ipaItems = [
  {
    "row": 1,
    "col1": "<strong><u>ข้อควรระวัง</u><strong>",
    "col2": [
      ": หากมีงาน Hot work or Fire work ใกล้เคียง ให้แจ้งหัวหน้างานให้หยุดชั่วคราว",
      ": ให้ ปิดโทรศัพท์ขณะ Loading EPICHLO",
      ": หากมี EPICHLO หยดลงพื้น ให้ใช้ผ้า หรือ ตัวดูดซับ ห้ามใช้น้ำล้าง",
      ": Check วาล์ว ปิด ประตูน้ำก่อนปฏิบัติงาน",
      ": แจ้ง Leader Production เวลา Loading ว่าไม่ตรงกับเวลาการใช้ Pump 109D,S",
      ": ในการผลิต Check ถังดับเพลิงประเภท เคมีแห้ง ว่าพร้อมใช้งาน"
    ],
    "col3": "",
    "col4": {
      type: "oknot",
    },
    "col5": ""
  },
  {
    "row": 2,
    "col1": "Document Check",
    "col2": [
      "จำนวนที่ระบุ ในใบส่งสินค้า",
      "Level ที่อ่านได้จาก Tank 11V-109D,S ก่อนรับ",
      "ตรวจสอบว่าปริมาณหลังจากรับไม่เกินความจุถัง",
      "ตรวจสอบ ปริมาณ ใน DCS",
      "Check Seal No.ที่รถส่งของ และ Line Vent ข้างบนแท็งค์"
    ],
    "col3": [
      "ตามเอกสารใบส่ง",
      "ต้องไม่เกิน 480 mm.",
      "ต้องไม่เกิน 15,500 Litre",
      "กดดูที่ถัง 11V-109D,S ต้องไม่เกิน 3,000 Litre.",
      "Seal ล็อกวาล์วไม่ขาดตรงตามใบส่ง"
    ],
    "col4": {
      type: "oknot",
    },
    "col5": ""
  },
  {
    "row": 3,
    "col1": "Document Check",
    "col2": [
      "จำนวนที่ระบุ ในใบส่งสินค้า",
      "Level ที่อ่านได้จาก Tank 11V-109D,S ก่อนรับ",
      "ตรวจสอบว่าปริมาณหลังจากรับไม่เกินความจุถัง",
      "ตรวจสอบ ปริมาณ ใน DCS",
      "Check Seal No.ที่รถส่งของ และ Line Vent ข้างบนแท็งค์"
    ],
    "col3": [
      "ตามเอกสารใบส่ง",
      "ต้องไม่เกิน 480 mm.",
      "ต้องไม่เกิน 15,500 Litre",
      "กดดูที่ถัง 11V-109D,S ต้องไม่เกิน 3,000 Litre.",
      "Seal ล็อกวาล์วไม่ขาดตรงตามใบส่ง"
    ],
    "col4": {
      type: "oknot",
      html: `<VRadioGroup
              inline
            >
              <VRadio
                label="Yes"
                :value="false"
              />
              <VRadio
                label="No"  
                :value="!false"
              />
            </VRadioGroup>`
    },
    "col5": ""
  }
]

watchEffect(() => {
  varA = ipaItems.length + 1
})

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
              <VTextField density="compact" variant="outlined" label=" By : " />
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
              <td style="border: 1px solid black; text-align: center; padding: 10px;" :rowspan="varA">
                <Image :src="image01" cover :width="300" :height="300" />
                <!-- <Image src="/image.jpg" alt="Image" width="250" preview /> -->
              </td>
            </tr>

            <tr v-for="ipaitem in ipaItems" :key="ipaitem.row">
              <td style="border: 1px solid black; text-align: center; padding: 10px;">
                <div v-html=ipaitem.col1></div>
              </td>

              <td style="border: 1px solid black; text-align: center; padding: 10px;">
                <div v-for="col2 in ipaitem.col2" class="d-flex justify-left">
                  {{ col2 }}
                </div>
              </td>
              <td style="border: 1px solid black; text-align: center; padding: 10px;">
                <div v-for=" col3 in ipaitem.col3" class="d-flex justify-center">
                  {{ col3 }}
                </div>
              </td>
              <td style=" border: 1px solid black; text-align: center; padding: 10px;">
                <div v-if="ipaitem.col4.type === 'oknot'">
                  <!-- <VRadioGroup v-model="showDigit" inline @update:modelValue="updateShowDigit"> -->
                  <VRadioGroup inline class="d-flex justify-center">
                    <VRadio label="Ok" :value="1" />
                    <VRadio label="Not" :value="0" />
                  </VRadioGroup>
                </div>
              </td>
            </tr>

            <!-- <tr>
              <td style="border: 1px solid black; text-align: center; padding: 10px;">
                Job Flow
              </td>
              <td style="border: 1px solid black; text-align: center; padding: 10px;">
                วิธีปฏิบัติ
              </td>
              <td style="border: 1px solid black; text-align: center; padding: 10px;">
                Condition
              </td>
              <td style="border: 1px solid black; text-align: center; padding: 10px;">
                ผลการเช็ค
              </td>
            </tr> -->
          </tbody>
        </VTable>
      </VCol>
    </VRow>
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
