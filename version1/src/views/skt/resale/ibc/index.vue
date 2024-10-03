<script setup>
const name= ref("ddd")

import image01 from '@/views/skt/resale/ibc/img/01.png'
import image02 from '@/views/skt/resale/ibc/img/02.png'

const GROSSWEIGHT01 = ref([
  { item: '- ไม่บุบ ไม่เสียรูปทรง' },
  { item: '- ฐานรองรับแข็งแรง' },
])

const GROSSWEIGHT02 = ref([
  { item: '- Lot No.ถูกต้อง' },
  { item: '- น้ำหนักถูกต้อง' },
  { item: '- ตำแหน่ง Lable ถูกต้อง (อยู่ตรงกลาง)' },
])

const GROSSWEIGHT03 = ref([
  { item: '- Check Leak ที่ CAPเปิดแล้วไม่รั่วแล้วปิดให้แน่น' },
  { item: '- ฝาเกลียวที่ใช้ขนาดถูกต้อง' },
  { item: '- สภาพฝาที่ใช้ปิด ป้องกันการรั่วได้ดี' },
])

const selectedLanguage = ref([])

const addItemsLang = item => {
  const index = selectedLanguage.value.indexOf(item)
  if (index === -1) {
    selectedLanguage.value.push(item)
  } else {
    selectedLanguage.value.splice(index, 1)
  }
  console.log('Log Lang Add', selectedLanguage.value)
}
</script>

<template>
  <VContainer fluid>
    <div>
      <VRow>
        <VCol
          cols="12"
          class="text-center"
        >
          <span style="font-weight: bolder;">Resale / Product Shipping Check Sheet ( IBC ) on 04-04-2024</span>
        </VCol>
        <VCol
          class="pa-0"
          cols="12"
        >
          <table class="custom-table">
            <tr class="header">
              <th colspan="2">
                Sale order: 1100077477
              </th>
              <th colspan="2">
                <VCheckbox
                  style="white-space: nowrap;"
                  label="DOMESTIC"
                />
              </th>
              <th colspan="2">
                <VCheckbox
                  style="white-space: nowrap;"
                  label="EXPORT"
                />
              </th>
            </tr>
          </table>
        </VCol>
      </VRow>

      <VRow>
        <VCol
          style="overflow-x: auto; white-space: nowrap;"
          class="px-0 pt-0"
          cols="12"
          lg="6"
          sm="12"
        >
          <table class="custom-table">
            <tr class="header">
              <th
                class="text-center"
                colspan="1"
              >
                Product Name
              </th>
              <th
                class="text-center"
                colspan="3"
              >
                PERMARIN US-203
              </th>
              <th colspan="1">
                Code
              </th>
              <th colspan="1">
                4577012005831000
              </th>
            </tr>
            <tr>
              <th
                class="text-center"
                colspan="1"
              >
                SKT Lot No.
              </th>
              <th
                class="text-center"
                colspan="1"
              >
                Net Weight
              </th>
              <th
                class="text-center"
                colspan="1"
              >
                Unit
              </th>
              <th
                class="text-center"
                colspan="1"
              >
                Amount
              </th>
              <th
                class="text-center"
                colspan="2"
              >
                Total Quality
              </th>
            </tr>

            <tr>
              <td
                colspan="1"
                class="text-center"
              >
                PC24020002
              </td>
              <td
                colspan="1"
                class="text-center"
              >
                1,000.0
              </td>
              <td
                colspan="1"
                class="text-center"
              >
                KG
              </td>
              <td
                colspan="1"
                class="text-center"
              >
                1
              </td>
              <td
                colspan="2"
                class="text-center"
              >
                1,000.0
              </td>
            </tr>
          </table>
        </VCol>
        <VCol
          style="overflow-x: auto; white-space: nowrap;"
          class="px-0 pt-0"
          cols="12"
          lg="6"
          sm="12"
        >
          <table class="custom-table">
            <tr class="header">
              <th
                class=" text-center"
                colspan="8"
              >
                Label Language
              </th>
              <th
                class="text-center"
                colspan="4"
              >
                CUSTOMER
              </th>
              <th
                class="text-center"
                colspan="4"
              >
                THAI UNITIKA SPUNBOND
              </th>
            </tr>

            <tr>
              <td
                class="text-center  cursor-pointer"
                colspan="4"
                ripple
                :style="{
                  borderColor: selectedLanguage.includes('Thai') ? 'green' : '',
                  borderWidth: selectedLanguage.includes('Thai') ? '2px': '1px',
                  borderStyle: 'solid',
                }"
                :class="{'bg-green-lighten-3': selectedLanguage.includes('Thai')}"
                @click="addItemsLang('Thai')"
              >
                Thai
              </td>
              <td
                class="text-center  cursor-pointer"
                colspan="4"
                ripple
                :style="{
                  borderColor: selectedLanguage.includes('Korean') ? 'green' : '',
                  borderWidth: selectedLanguage.includes('Korean') ? '2px': '1px',
                  borderStyle: 'solid',
                }"
                :class="{'bg-green-lighten-3': selectedLanguage.includes('Korean')}"
                @click="addItemsLang('Korean')"
              >
                Korean
              </td>
              <td
                rowspan="8"
                colspan="4"
              >
                <div class="d-flex justify-center">
                  <VImg
                    width="250px"
                    :src="image01"
                  />
                </div>
              </td>
              <td
                rowspan="8"
                colspan="4"
              >
                <div class="d-flex justify-center">
                  <VImg
                    width="250px"
                    :src="image02"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td
                class="text-center  cursor-pointer"
                colspan="4"
                ripple
                :style="{
                  borderColor: selectedLanguage.includes('Engilsh') ? 'green' : '',
                  borderWidth: selectedLanguage.includes('Engilsh') ? '2px': '1px',
                  borderStyle: 'solid',
                }"
                :class="{'bg-green-lighten-3': selectedLanguage.includes('Engilsh')}"
                @click="addItemsLang('Engilsh')"
              >
                Engilsh
              </td>
              <td
                class="text-center  cursor-pointer"
                colspan="4"
                ripple
                :style="{
                  borderColor: selectedLanguage.includes('Japanese') ? 'green' : '',
                  borderWidth: selectedLanguage.includes('Japanese') ? '2px': '1px',
                  borderStyle: 'solid',
                }"
                :class="{'bg-green-lighten-3': selectedLanguage.includes('Japanese')}"
                @click="addItemsLang('Japanese')"
              >
                Japanese
              </td>
            </tr>
            <tr>
              <td
                class="text-center  cursor-pointer"
                colspan="4"
                ripple
                :style="{
                  borderColor: selectedLanguage.includes('Malaysia') ? 'green' : '',
                  borderWidth: selectedLanguage.includes('Malaysia') ? '2px': '1px',
                  borderStyle: 'solid',
                }"
                :class="{'bg-green-lighten-3': selectedLanguage.includes('Malaysia')}"
                @click="addItemsLang('Malaysia')"
              >
                Malaysia
              </td>
              <td
                class="text-center  cursor-pointer"
                colspan="4"
                ripple
                :style="{
                  borderColor: selectedLanguage.includes('Chinese') ? 'green' : '',
                  borderWidth: selectedLanguage.includes('Chinese') ? '2px': '1px',
                  borderStyle: 'solid',
                }"
                :class="{'bg-green-lighten-3': selectedLanguage.includes('Chinese')}"
                @click="addItemsLang('Chinese')"
              >
                Chinese
              </td>
            </tr>
            <tr>
              <td
                class="text-center  cursor-pointer"
                colspan="4"
                ripple
                :style="{
                  borderColor: selectedLanguage.includes('SDS') ? 'green' : '',
                  borderWidth: selectedLanguage.includes('SDS') ? '2px': '1px',
                  borderStyle: 'solid',
                }"
                :class="{'bg-green-lighten-3': selectedLanguage.includes('SDS')}"
                @click="addItemsLang('SDS')"
              >
                SDS
              </td>
              <td colspan="4" />
            </tr>
          </table>
        </VCol>
      </VRow>

      <VRow style="overflow-x: auto; white-space: nowrap;">
        <VCol
          class="pa-0"
          cols="12"
        >
          <table class="custom-table">
            <tr>
              <th
                class="text-center"
                colspan="2"
              >
                No.
              </th>
              <th colspan="1">
                1
              </th>
              <th colspan="1">
                2
              </th>
              <th colspan="1">
                3
              </th>
              <th colspan="1">
                4
              </th>
              <th colspan="1">
                5
              </th>
              <th colspan="1">
                6
              </th>
              <th colspan="1">
                7
              </th>
              <th colspan="1">
                8
              </th>
              <th colspan="1">
                9
              </th>
              <th colspan="1">
                10
              </th>
            </tr>
            <tr>
              <th
                class="text-center"
                colspan="2"
              >
                IBC No.
              </th>
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
            </tr>
            <tr>
              <th
                class="text-center"
                colspan="2"
              >
                GROSSWEIGHT Before Shipping
              </th>
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
            </tr>
            <tr>
              <th
                class="text-start"
                colspan="2"
              >
                1.ไม่เป็นสนิม
              </th>
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
            </tr>
            <tr>
              <td
                class="text-start"
                colspan="2"
              >
                - ไม่บุบ ไม่เสียรูปทรง
              </td>
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
            </tr>
            <tr>
              <td
                class="text-start"
                colspan="2"
              >
                - ฐานรองรับแข็งแรง
              </td>
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
            </tr>
            <tr>
              <th
                class="text-start"
                colspan="2"
              >
                2 Lable ไม่ฉีกขาด
              </th>
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
            </tr>
            <tr>
              <td
                class="text-start"
                colspan="2"
              >
                - Lot No.ถูกต้อง
              </td>
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
            </tr>
            <tr>
              <td
                class="text-start"
                colspan="2"
              >
                - น้ำหนักถูกต้อง
              </td>
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
            </tr>
            <tr>
              <td
                class="text-start"
                colspan="2"
              >
                - ตำแหน่ง Lable ถูกต้อง (อยู่ตรงกลาง)
              </td>
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
            </tr>
            <tr>
              <th
                class="text-start"
                colspan="2"
              >
                3  ฝาปิดด้านบนไม่มีรูระบายอากาศ/น้ำไม่เข้า
              </th>
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
            </tr>
            <tr>
              <td
                class="text-start"
                colspan="2"
              >
                - Check Leak ที่ CAPเปิดแล้วไม่รั่วแล้วปิดให้แน่น 
              </td>
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
            </tr>
            <tr>
              <td
                class="text-start"
                colspan="2"
              >
                - ฝาเกลียวที่ใช้ขนาดถูกต้อง
              </td>
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
            </tr>
            <tr>
              <td
                class="text-start"
                colspan="2"
              >
                - สภาพฝาที่ใช้ปิด ป้องกันการรั่วได้ดี
              </td>
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
            </tr>
            <tr>
              <th
                class="text-start"
                colspan="2"
              >
                4  มีการ seal ที่ฝาด้านบน แน่นเรียบร้อย
              </th>
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
            </tr>
            <tr>
              <th
                class="text-start"
                colspan="2"
              >
                5 มีการ seal ที่วาล์วด้านล่างแน่นเรียบร้อย ไม่รั่วซึม
              </th>
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
              <th colspan="1" />
            </tr>
          </table>
        </VCol>
      </VRow>

      <VRow>
        <VCol
          class="px-0"
          cols="6"
        >
          <table class="custom-table">
            <tr>
              <th
                colspan="12"
                class="text-center "
              >
                ตรวจสอบรายการต่อไปนี้ก่อนจัดส่ง
              </th>
            </tr>
            
            <tr>
              <td colspan="12">
                <VCheckbox label="สินค้ากับฉลากตรงกัน" />
              </td>
            </tr>
            <tr>
              <td colspan="12">
                <VCheckbox label="มีฉลากติดและติดตรงจุดที่กำหนด" />
              </td>
            </tr>
            <tr>
              <td colspan="12">
                <VCheckbox label="ฉลากไม่ฉีกขาด" />
              </td>
            </tr>
            <tr>
              <td colspan="12">
                <VCheckbox label="ชื่อและLot no. บนฉลากถูกต้อง" />
              </td>
            </tr>
            <tr>
              <td colspan="12">
                <VCheckbox label="ฉลากมีทั้ง  2 ภาษาและติดคู่กันถูกต้อง" />
              </td>
            </tr>
          </table>
        </VCol>
        <VCol
          class="px-0"
          cols="6"
        >
          <table class="custom-table">
            <tr>
              <th
                colspan="12"
                class="text-center "
              >
                ** Condition check for special request.**
              </th>
            </tr>
            <tr>
              <td colspan="2">
                <VCheckbox label="เช็ค Gross Weight ก่อนขาย" />
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <VCheckbox label="ระบุ Net Weight,Gross Weight บนLabel ด้วย" />
              </td>
            </tr>
          </table>
        </VCol>
      </VRow>

      <VRow>
        <VCol
          class="px-0"
          cols="12"
        >
          <table class="custom-table">
            <tr>
              <th
                colspan="12"
                class="text-center "
              >
                ผู้ตรวจสอบ
              </th>
            </tr>
            <tr>
              <td colspan="12">
                <VRow>
                  <VCol cols="12">
                    <div class="d-flex justify-splace-between">
                      <VTextField
                        density="compact"
                        placeholder="Prepared By"
                        label="Prepared By"
                        variant="outlined"
                      />
                      <span><VueDatePicker
                        v-model="dateSupervisor"
                        :max-date="new Date()"
                        :enable-time-picker="false"
                      /></span>
                    </div>
                  </VCol>
                  <VCol cols="12">
                    <div class="d-flex justify-splace-between">
                      <VTextField
                        density="compact"
                        placeholder=" Checked By"
                        label=" Checked By"
                      />
                      <span><VueDatePicker
                        v-model="dateSupervisor"
                        :max-date="new Date()"
                        :enable-time-picker="false"
                      /></span>
                    </div>
                  </VCol>
                  <VCol cols="12">
                    <div class="d-flex justify-splace-between">
                      <VTextField
                        density="compact"
                        placeholder="Driver Checked By"
                        label="Driver Checked By"
                      />
                      <span><VueDatePicker
                        v-model="dateSupervisor"
                        :max-date="new Date()"
                        :enable-time-picker="false"
                      /></span>
                    </div>
                  </VCol>
                  <VCol cols="12">
                    <span class="px-1">หมายเหตุ : คนขับรถ ตรวจสภาพสินค้าหลังนำขึ้นรถแล้ว  สภาพปกติ ไม่รั่ว</span>
                  </VCol>
                  <VCol cols="12">
                    <VTextarea
                      autocomplete="email"
                      label="Comment"
                      placeholder="Comment"
                    />
                  </VCol>
                </VRow>
              </td>
            </tr>
          </table>
        </VCol>
      </VRow>

      <VRow>
        <VCol cols="12">
          <div class="py-3 d-flex justify-end">
            <VBtn
              class="mx-4"
              color="warning"
            >
              SAVE DRAFT
            </VBtn>
            <VBtn>
              SUBMIT
            </VBtn>
          </div>
        </VCol>
      </VRow>
    </div>
  </VContainer>
</template>

<style scoped>
.text-center {
  text-align: center;
}

.centered-input >>> input {
  padding: 0;
  text-align: center;
}

.custom-table {
  border-collapse: collapse;
  inline-size: 100%;
}

.custom-table,
.custom-table th,
.custom-table td {
  border: 1px solid black;
}

.custom-table th,
.custom-table td {
  padding: 8px;
  text-align: start;
}

.header {
  justify-content: space-between;
  font-weight: bolder;
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
</style>
