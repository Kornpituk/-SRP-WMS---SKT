<script setup>
const vasss = ref('dd')

import image01 from '@/views/skt/inv/lorryLoading/calculate/iPA/IPA 1.png'
import { watchEffect, computed } from 'vue'

const varA = ref(0)
const varB = ref(0)
const varC = ref(0)
const varD = ref(0)
const varE = ref(0)
const varF = ref(0)
const resBpD = ref(0)
const finalRes = ref(0)


watchEffect(() => {
  if(varA.value >= 0 ){
    varB.value = varA.value / 0.78
  } else {
    varA.value = 0
  }
  if(varC.value >= 0 && varC.value < 575){
    varD.value = (varC.value * 5.32) + 740.45
  }else {
    varD.value = 0
  }

  if(varB.value > 0 && varD.value > 0){
    resBpD.value = (varB.value).toFixed(2)+'+'+(varD.value).toFixed(2)
  }else {
    resBpD.value = 0
  }

  if(varA.value == 0 && varC.value == 0){
    finalRes.value = 0
    resBpD.value = 0
    varD.value = 0
  }

  if(varB.value > 0 && varC.value > 0){
    finalRes.value = varB.value+varD.value
  }else {
    finalRes.value = 0
  }
})

//------------------------------------  Mock Data Table --------------------------------
const tableData = ref([
  {
    header: 'ข้อควรระวัง',
    rows: [
      {
        manualWorks: 'หากมีงาน Hot work or Fire work ใกล้เคียง ให้แจ้งหัวหน้างานให้หยุดชั่วคราว',
        typeMamualWorks: 'nomaly',
        condition: '',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
        calculation: '',
      },
      {
        manualWorks: 'ให้ ปิดโทรศัพท์ขณะ Loading Solvent',
        typeMamualWorks: 'nomaly',
        condition: '',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
        calculation: '',
      },
      {
        manualWorks: 'หากมี Solvent หยดลงพื้น ให้ใช้ผ้า หรือ ตัวดูดซับ ห้ามใช้น้ำล้าง',
        typeMamualWorks: 'nomaly',
        condition: '',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
        calculation: '',
      },
      {
        manualWorks: 'Check วาล์ว ปิด ประตูน้ำก่อนปฏิบัติงาน',
        typeMamualWorks: 'nomaly',
        condition: '',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
        calculation: '',
      },
      {
        manualWorks: 'แจ้ง Leader Production เวลา Loading ว่าไม่ตรงกับเวลาการใช้ Pump 109A ในการผลิต',
        typeMamualWorks: 'nomaly',
        condition: '',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
        calculation: 'หาเป็นลิตร = mm x 5.32 + 740.45',
      },
      {
        manualWorks: 'Check ถังดับเพลิงประเภท เคมีแห้ง ว่าพร้อมใช้งาน',
        typeMamualWorks: 'nomaly',
        condition: '',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
        calculation: 'หาเป็น mm  =  Litre - 740.45 / 5.32',
      },
    ],
  },
  {
    header: 'Document Check',
    rows: [
      {
        manualWorks: '1.จำนวนที่ระบุ ในใบส่งสินค้า',
        typeMamualWorks: 'nomaly',
        condition: 'ตามเอกสารใบส่ง',
        result: 'TypeTextField',
        Prefix: 'Kg.',
        label: '(A)',
        calculation: '(B) = (A) / 0.78',
        value: null,
      },
      {
        manualWorks: '2.Level ที่อ่านได้จาก Tank 11V-109A ก่อนรับ',
        typeMamualWorks: 'nomaly',
        condition: 'ต้องไม่เกิน 575 mm.',
        conditionRule: 575,
        conditionType: '>',
        result: 'TypeTextField',
        Prefix: 'mm.',
        label: '(C)',
        calculation: '=……………….….….………/ 0.78',
        value: null,
      },
      {
        manualWorks: '3.ตรวจสอบว่าปริมาณหลังจากรับไม่เกินความจุถัง',
        typeMamualWorks: 'nomaly',
        condition: 'ต้องไม่เกิน 15,800 Litre',
        conditionRule: 15800,
        conditionType: '>',
        result: 'TypeTextFieldRadio',
        Prefix: '',
        label: '(B) + (D) = ',
        calculation: '=………….……………………Litre',
        value: null,
      },
      {
        manualWorks: '4.ตรวจสอบ ปริมาณ ใน DCS',
        typeMamualWorks: 'nomaly',
        condition: 'กดดูที่ถัง 11V-109A ต้องไม่เกิน 3790 Litre.',
        conditionRule: 3790,
        conditionType: '>',
        result: 'TypeTextFieldRadio',
        Prefix: 'Litre.',
        label: '',
        calculation: '(D) = ( (C) X 5.32 ) + 740.45',
        value: null,
      },
      {
        manualWorks: '5.Check Seal No.ที่รถส่งของ และ แป้นในถัง lorry ว่าตรง 10,000 ลิตร หรือไม่',
        typeMamualWorks: 'nomaly',
        condition: 'Seal ล็อกวาล์วไม่ขาดตรงตามใบส่ง',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
        calculation: ' = (……………………….X 5.32 ) + 740.45',
        value: null,
      },
    ],
  },
  {
    header: 'ก่อนการปฏิบัติงาน',
    rows: [
      {
        manualWorks: '1.หยุดรถและดับเครื่องเรียบร้อย',
        typeMamualWorks: 'nomaly',
        condition: 'รถต้องหยุดนิ่งสนิท',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
        calculation: '= …………………...…………Litre',
      },
      {
        manualWorks: '2.เอาหมอนรองล้อรถเรียบร้อย',
        typeMamualWorks: 'nomaly',
        condition: 'รองล้อรถทั่งด้านหน้าและด้านหลัง',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: '3.ต่อสายกราวน์เรียบร้อย',
        typeMamualWorks: 'nomaly',
        condition: 'ต่อสายกราวน์บริเวณที่โหลดเข้ากับรถ',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
        calculation: 'Density IPA = 0.78',
      },
      {
        manualWorks: '4.เก็บตัวอย่าง ส่ง INSP เรียบร้อย',
        typeMamualWorks: 'nomaly',
        condition: '1 ขวดแก้วเล็กและ 1 ขวดแก้วใหญ่เล็กด้านบนรถ',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: '5.นำลูกกุญแจมาเปิดล็อกวาล์ว 11',
        typeMamualWorks: 'nomaly',
        condition: 'IPA กุญแจใช้รหัสล็อค',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: '6.Moisture เท่าไหร่',
        typeMamualWorks: 'nomaly',
        condition: '0.100 Max',
        result: 'TypeTextFieldRadio',
        Prefix: '%',
        label: '',
      },
    ],
  },
  {
    header: 'Line setting',
    rows: [
      {
        manualWorks: '1.วาล์ว 1, 2',
        typeMamualWorks: 'nomaly',
        condition: 'Open ( เปิด )',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: '2.หัวถัง 11V-109A',
        typeMamualWorks: 'nomaly',
        condition: 'วาล์ว 3, 4 , 5',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: '3.Temperature เท่าไหร่',
        typeMamualWorks: 'nomaly',
        condition: 'อุณหภูมิต้องไม่สูงกว่า  25 C\'',
        result: 'TypeTextFieldRadio',
        Prefix: 'C\'',
        label: '',
      },
    ],
  },
  {
    header: '11P-109A',
    rows: [
      {
        manualWorks: '1.วาล์ว 6 , 7 , 8 , 9',
        typeMamualWorks: 'nomaly',
        condition: 'Close ( ปิด )',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: '2.วาล์ว 10 Open 40 %',
        typeMamualWorks: 'nomaly',
        condition: 'Open 40 % ตามขีดที่กำหนดไว้',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: '3.Check ว่า valve 13 Open',
        typeMamualWorks: 'nomaly',
        condition: 'ปกติวาล์วจะเปิด',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
    ],
  },
  {
    header: 'Operator',
    rows: [
      {
        manualWorks: '-ถุงมือ',
        typeMamualWorks: 'PPE',
        condition: 'ใส่ถุงมือยาง',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: '-แว่น safety',
        typeMamualWorks: 'PPE',
        condition: 'ต้องเป็นแว่น safety เท่านั้น',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: '-หน้ากากคางหมู',
        typeMamualWorks: 'PPE',
        condition: 'ใส่ให้ถูกวิธี',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: '-กรองอากาศ ( สีดำ )',
        typeMamualWorks: 'PPE',
        condition: 'ใช้เฉพาะตัวกรองสีดำ',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: '-ชุดป้องกันสารเคมี',
        typeMamualWorks: 'PPE',
        condition: 'ใส่ทั้งเสื้อและกางเกงแล้ว',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: '-เข็มขัดนิรภัย',
        typeMamualWorks: 'PPE',
        condition: '',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
    ],
  },
  {
    header: 'Lorry tank',
    rows: [
      {
        manualWorks: '1.ต่อสายHose เข้ากับ Valve 11',
        typeMamualWorks: 'nomaly',
        condition: 'ต่อโดยตรงโดยไม่ผ่านPump รถ Lorry',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: '2.ต่อ Line Vent เข้ากับ Vent ของ Lorry และเปิด Valve 12',
        typeMamualWorks: 'nomaly',
        condition: 'อย่าลืมเปิดวาล์ว 12',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: '3.เปิดวาล์วจาก Lorry',
        typeMamualWorks: 'nomaly',
        condition: 'No.14 Open ( เปิด )',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: '4.Check Leak สาย Hose, ข้อต่อวาล์ว ระหว่าง Valve 11 , 14',
        typeMamualWorks: 'nomaly',
        condition: 'ต้องไม่รั่ว',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
    ],
  },
  {
    header: 'Charging',
    rows: [
      {
        manualWorks: '1.เปิดวาล์ว',
        typeMamualWorks: 'nomaly',
        condition: 'วาล์ว 11 เปิด',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: '2.Start Pump เวลาเริ่ม',
        typeMamualWorks: 'nomaly',
        condition: 'Actual Check',
        result: 'TypeDoubleTextField',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: '3.Check pressure 11P-109A',
        typeMamualWorks: 'nomaly',
        condition: 'ดูจาก pressure guage ผ่าน Pump (0.2 - 0.45)',
        conditionRule: 0.2,
        conditionRule2: 0.45,
        conditionType: '><',
        result: 'TypeTextFieldRadio',
        Prefix: 'Mpa',
        label: '',
      },
      {
        manualWorks: '4.Check Ampmeter ของตัว Pump',
        typeMamualWorks: 'nomaly',
        condition: 'ดูจากตู้ Control Pump 11P-109A ( ไม่ต่ำกว่า 8 Amp)',
        conditionRule: 8,
        conditionType: '<',
        result: 'TypeTextFieldRadio',
        Prefix: 'Amp',
        label: '',
      },
      {
        manualWorks: '5.Check ไฟที่ หัว Pump',
        typeMamualWorks: 'nomaly',
        condition: 'ไฟต้องแสดงเป็นสีเขียวเท่านั้น',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
    ],
  },
  {
    header: 'เมื่อรับเสร็จ',
    rows: [
      {
        manualWorks: 'เมื่อ Pump หยุดทำงาน ปิด Valve 11, 14 และ Vent 12',
        typeMamualWorks: 'nomaly',
        condition: 'ด้านล่าง บริเวณ Pump 11V-109A',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'Drain จากสาย Hose และ Lorry ให้หมด',
        typeMamualWorks: 'nomaly',
        condition: 'ใน Lorry และ Hose หมด',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'บันทึกเวลารับเสร็จ',
        typeMamualWorks: 'nomaly',
        condition: 'Actual Check',
        result: 'TypeDoubleTextField',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'ถอดสายดินออกจากรถ',
        typeMamualWorks: 'nomaly',
        condition: 'เอาออกเรียบร้อย',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'เปิด Valve 8 และ Cerculate 10 นาที',
        typeMamualWorks: 'nomaly',
        condition: 'Open ( เปิด ) วาล์ว 8',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'เก็บ Sample Check Moisture 1 ขวดแก้วใหญ่',
        typeMamualWorks: 'nomaly',
        condition: '0.100 Max',
        conditionRule: 0.100,
        result: 'TypeTextFieldRadio',
        Prefix: '%',
        label: '',
      },
      {
        manualWorks: 'ปิด Valve 8',
        typeMamualWorks: 'nomaly',
        condition: 'Close ( ปิด ) วาล์ว 8',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'เปิด Valve 4 , 5',
        typeMamualWorks: 'nomaly',
        condition: 'ด้านบนถัง 11V-109A',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'อ่าน Level ที่ถัง11V-109A ทำการ Record',
        typeMamualWorks: 'nomaly',
        condition: 'Actual Check',
        result: 'TypeDoubleTextField',
        Prefix: 'mm.',
        Prefix2: 'Litre',
        label: '(E).',
        label2: '(F)',
      },
      {
        manualWorks: 'Check level DCS ได้เท่าไหร่',
        typeMamualWorks: 'nomaly',
        condition: 'Actual Check',
        result: 'TypeTextField',
        Prefix: 'Litre',
        label: '( G )',
      },
      {
        manualWorks: 'หลังจากโหลดเสร็จล็อกวาล์ว 11',
        typeMamualWorks: 'nomaly',
        condition: 'กุญแจล็อครหัส',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'ส่วนต่างระหว่าง (B + D ) -F =',
        typeMamualWorks: 'nomaly',
        condition: 'ต้องไม่ต่างกันมากจากการคำนวน',
        result: 'TypeDoubleTextField',
        Prefix: 'Litre',
        label: '',
        Prefix2: ' Kg',
        label2: '',
      },
    ],
  },
 
])
</script>

<template>
  <div>
    <VRow>
      <VCol cols="12">
        <VRow>
          <VCol
            class="d-flex align-center justify-center"
            cols="8"
          >
            <VRow class="pa-0">
              <VCol cols="12">
                <div
                  style="font-size: 18px; font-weight: bolder;"
                  class="d-flex justify-center align-center pa-0"
                >
                  Lorry Loading Check List<br>
                </div>
              </VCol>
              <VCol cols="12">
                <div class="d-flex justify-center align-center pa-0">
                  ISOPRO (IPA) xxxx
                </div>
              </VCol>
            </VRow>
          </VCol>
          <VCol
            class="pa-6"
            
            cols="4"
          >
            <VRow>
              <VCol
                style="border: 1px solid black;"
                cols="12"
              >
                <div
                  style="font-size: 18px; font-weight: bolder;"
                  class="d-flex justify-center align-center"
                >
                  <VTextField
                    density="compact"
                    variant="outlined"
                    label=" P/O no."
                  />
                </div>
              </VCol>
              <VCol
                cols="12"
                style="border: 1px solid black;"
              >
                <div>
                  <VRow class="d-flex align-center">
                    <VCol cols="4">
                      Issued Date
                    </VCol>
                    <VCol cols="8">
                      <VueDatePicker
                        v-model="dateSupervisor"
                        :max-date="new Date()"
                        :enable-time-picker="false"
                      />
                    </VCol>
                  </VRow>
                </div>
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </VCol>
      <VCol cols="12">
        <div style="overflow-x: auto;">
          <table class="custom-table">
            <thead>
              <tr
                class=""
                style="font-size: 16px;"
              />
              <tr
                class=""
                style="font-size: 16px;"
              >
                <th
                  class="text-center pa-0"
                  colspan="1"
                >
                  ขั้นตอน
                </th>
                <th
                  class="text-center"
                  colspan="4"
                >
                  เนื้อหารายละเอียด
                </th>
                <th
                  class="text-center"
                  colspan="2"
                >
                  เงื่อนไข
                </th>
                <th
                  class="text-center"
                  colspan="5"
                >
                  ผลการเช็ค
                </th>
              </tr>
            </thead>
          
            <!-- ข้อควรระวัง -->
            <tr style="font-size: 14px;">
              <th
                class="pa-0 text-center"
                colspan="1"
                rowspan="6"
              >
                <b><u class="text-decoration-underline">ข้อควรระวัง</u></b>
              </th>
              <td
                class="py-0"
                colspan="4"
              >
                : หากมีงาน Hot work or Fire work ใกล้เคียง ให้แจ้งหัวหน้างานให้หยุดชั่วคราว
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              />
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                : ให้ ปิดโทรศัพท์ขณะ Loading Solvent
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              />
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                : หากมี Solvent หยดลงพื้น ให้ใช้ผ้า หรือ ตัวดูดซับ ห้ามใช้น้ำล้าง 
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              />
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                : Check วาล์ว ปิด ประตูน้ำก่อนปฏิบัติงาน 
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              />
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                : แจ้ง Leader Production เวลา Loading ว่าไม่ตรงกับเวลาการใช้ Pump 109A ในการผลิต
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              />
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                : ในการผลิต Check ถังดับเพลิงประเภท เคมีแห้ง ว่าพร้อมใช้งาน
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              />
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
          
        
            <!-- Document Check -->
            <tr style="font-size: 14px;">
              <th
                colspan="1"
                rowspan="5"
                class="pa-0 text-center"
              >
                Document Check
              </th>
              <td
                colspan="4"
                class="py-0"
              >
                1. จำนวนที่ระบุ ในใบส่งสินค้า   
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <div class="text-center py-0">
                  ตามเอกสารใบส่ง
                </div>
              </td>
              <td
                colspan="4"
                class="text-center py-1"
              >
                <VRow>
                  <VCol
                    class="d-flex justify-center align-center"
                    cols="5"
                  >
                    <VTextField
                      v-model="varA"
                      :style="{ width: '200px', maxWidth: '300px' }"
                      class="py-1"
                      density="compact"
                      style="font-size: 14px;"
                      type="number"
                    >
                      <template #label>
                        <span> (A)</span>
                      </template>
                      <template #append-inner>
                        <span>Kg</span>
                      </template>
                    </VTextField>
                  </VCol>
                  <VCol
                    class="d-flex justify-center align-center text-center"
                    cols="2"
                  >
                    =
                  </VCol>
                  <VCol
                    class="d-flex justify-center align-center"
                    cols="5"
                  >
                    <VTextField
                      v-model="varB"
                      :style="{ width: '200px', maxWidth: '300px' }"
                      readonly
                      class="py-1"
                      density="compact"
                      style="font-size: 14px;"
                      type="number"
                    >
                      <template #label>
                        <span>(B)</span>
                      </template>
                      <template #append-inner>
                        <span>Kg</span>
                      </template>
                    </VTextField>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                colspan="4"
                class="py-0"
              >
                2.  Level ที่อ่านได้จาก Tank 11V-109A ก่อนรับ      
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <div class="text-center py-0">
                  ต้องไม่เกิน 575 mm.
                </div>
              </td>
              <td
                colspan="4"
                class="text-center py-1"
              >
                <VRow>
                  <VCol
                    class="d-flex justify-center align-center"
                    cols="5"
                  >
                    <VTextField
                      v-model="varC"
                      :color="{
                        color: varC > 575 ? 'red' : 'green'
                      }"
                      :style="{
                        color: varC > 575 ? 'red' : 'green'
                      }"
                      class="py-1"
                      density="compact"
                      type="number"
                      style="font-size: 14px;"
                    >
                      <template #label>
                        <span> (C)</span>
                      </template>
                      <template #append-inner>
                        <span>mm.</span>
                      </template>
                    </VTextField>
                  </VCol>
                  <VCol
                    class="d-flex justify-center align-center text-center"
                    cols="2"
                  >
                    =
                  </VCol>
                  <VCol
                    class="d-flex justify-center align-center"
                    cols="5"
                  >
                    <VTextField
                      v-model="varD"
                      class="py-1"
                      density="compact"
                      type="number"
                      style="font-size: 14px;"
                      readonly
                    >
                      <template #label>
                        <span>(D)</span>
                      </template>
                      <template #append-inner>
                        <span>Litre</span>
                      </template>
                    </VTextField>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                colspan="4"
                class="py-0"
              >
                3. ตรวจสอบว่าปริมาณหลังจากรับไม่เกินความจุถัง
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <div class="text-center py-0">
                  ต้องไม่เกิน 15,800 Litre
                </div>
              </td>
              <td
                colspan="4"
                class="text-center py-1"
              >
                <VRow>
                  <VCol
                    class="d-flex justify-center align-center"
                    cols="6"
                  >
                    <VTextField
                      v-model="resBpD"
                      readonly
                      class="py-1"
                      density="compact"
                      style="font-size: 14px;"
                      :color="{
                        color: resBpD > 15500 ? 'red' : 'green'
                      }"
                      :style="{
                        color: resBpD > 15500 ? 'red' : 'green'
                      }"
                    >
                      <template #label>
                        <span> (B) + (D)</span>
                      </template>
                      <template #append-inner>
                        <span>Litre</span>
                      </template>
                    </VTextField>
                  </VCol>
                  <VCol
                    class="d-flex justify-center align-center"
                    cols="6"
                  >
                    <VRow>
                      <VCol cols="6">
                        <VRadioGroup
                          v-model="radios"
                          inline
                          class="d-flex justify-center"
                        >
                          <VRadio
                            color="green"
                            value="Google"
                          >
                            <template #label>
                              <div style="font-size: 14px;">
                                OK
                              </div>
                            </template>
                          </VRadio>
                        </VRadioGroup>
                      </VCol>
                      <VCol cols="6">
                        <VRadioGroup
                          v-model="radios"
                          inline
                          class="d-flex justify-center"
                        >
                          <VRadio
                            color="green"
                            value="Google"
                          >
                            <template #label>
                              <div style="font-size: 14px;">
                                NOT
                              </div>
                            </template>
                          </VRadio>
                        </VRadioGroup>
                      </VCol>
                    </VRow>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                colspan="4"
                class="py-0"
              >
                4. ตรวจสอบ ปริมาณ ใน DCS  
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <div class="text-center py-0">
                  กดดูที่ถัง 11V-109A ต้องไม่เกิน 3790 Litre.
                </div>
              </td>
              <td
                colspan="4"
                class="text-center py-0"
              >
                <VRow>
                  <VCol
                    class="d-flex justify-center align-center"
                    cols="6"
                  >
                    <VTextField
                      v-model="finalRes"
                      readonly
                      class="py-1"
                      density="compact"
                      style="font-size: 14px;"
                      :color="{
                        color: finalRes > 3790 ? 'red' : 'green'
                      }"
                      :style="{
                        color: finalRes > 3790 ? 'red' : 'green'
                      }"
                    >
                      <template #label>
                        <span />
                      </template>
                      <template #append-inner>
                        <span>Litre</span>
                      </template>
                    </VTextField>
                  </VCol>
                  <VCol
                    class="d-flex justify-center align-center"
                    cols="6"
                  >
                    <VRow>
                      <VCol cols="6">
                        <VRadioGroup
                          v-model="radios"
                          inline
                          class="d-flex justify-center"
                        >
                          <VRadio
                            color="green"
                            value="Google"
                          >
                            <template #label>
                              <div style="font-size: 14px;">
                                OK
                              </div>
                            </template>
                          </VRadio>
                        </VRadioGroup>
                      </VCol>
                      <VCol cols="6">
                        <VRadioGroup
                          v-model="radios"
                          inline
                          class="d-flex justify-center"
                        >
                          <VRadio
                            color="green"
                            value="Google"
                          >
                            <template #label>
                              <div style="font-size: 14px;">
                                NOT
                              </div>
                            </template>
                          </VRadio>
                        </VRadioGroup>
                      </VCol>
                    </VRow>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                colspan="4"
                class="py-0"
              >
                5. Check Seal No.ที่รถส่งของ และ แป้นในถัง lorry ว่าตรง 10,000 ลิตร หรือไม่
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <div class="text-center py-0">
                  Seal ล็อกวาล์วไม่ขาดตรงตามใบส่ง
                </div>
              </td>
              <td
                colspan="4"
                class="text-center py-0"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
          
            <!-- ก่อนการปฏิบัติงาน -->
            <tr style="font-size: 14px;">
              <th
                rowspan="6"
                class="pa-0 text-center"
                colspan="1"
              >
                ก่อนการปฏิบัติงาน 
              </th>
              <td
                class="py-0"
                colspan="4"
              >
                1. หยุดรถและดับเครื่องเรียบร้อย
              </td>
              <td
                class="text-center py-0"
                colspan="4"
              >
                รถต้องหยุดนิ่งสนิท
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                2. เอาหมอนรองล้อรถเรียบร้อย
              </td>
              <td
                class="text-center py-0"
                colspan="4"
              >
                รองล้อรถทั่งด้านหน้าและด้านหลัง
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                3. ต่อสายกราวน์เรียบร้อย
              </td>
              <td
                class="text-center py-0"
                colspan="4"
              >
                ต่อสายกราวน์บริเวณที่โหลดเข้ากับรถ
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                4. เก็บตัวอย่าง ส่ง INSP เรียบร้อย
              </td>
              <td
                class="text-center py-0"
                colspan="4"
              >
                1 ขวดแก้วเล็กและ 1 ขวดแก้วใหญ่เล็กด้านบนรถ
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                5. นำลูกกุญแจมาเปิดล็อกวาล์ว 11
              </td>
              <td
                class="text-center py-0"
                colspan="4"
              >
                IPA กุญแจใช้รหัสล็อค
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                6. Moisture เท่าไหร่
              </td>
              <td
                class="text-center py-0"
                colspan="4"
              >
                0.100 Max
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol
                    class="d-flex justify-center align-center"
                    cols="6"
                  >
                    <VTextField
                      class="py-1"
                      density="compact"
                      type="number"
                      style="font-size: 14px;"
                    >
                      <template #prepend>
                        <span />
                      </template>
                      <template #label>
                        <span />
                      </template>
                      <template #append-inner>
                        <span>%</span>
                      </template>
                    </VTextField>
                  </VCol>
                
                  <VCol
                    class="d-flex justify-center align-center"
                    cols="6"
                  >
                    <VRow>
                      <VCol cols="6">
                        <VRadioGroup
                          v-model="radios"
                          inline
                          class="d-flex justify-center"
                        >
                          <VRadio
                            color="green"
                            value="Google"
                          >
                            <template #label>
                              <div style="font-size: 14px;">
                                OK
                              </div>
                            </template>
                          </VRadio>
                        </VRadioGroup>
                      </VCol>
                      <VCol cols="6">
                        <VRadioGroup
                          v-model="radios"
                          inline
                          class="d-flex justify-center"
                        >
                          <VRadio
                            color="green"
                            value="Google"
                          >
                            <template #label>
                              <div style="font-size: 14px;">
                                NOT
                              </div>
                            </template>
                          </VRadio>
                        </VRadioGroup>
                      </VCol>
                    </VRow>
                  </VCol>
                </VRow>
              </td>
            </tr>

            <!-- Line setting -->
            <tr style="font-size: 14px;">
              <th
                class="pa-0 text-center"
                colspan="1"
                rowspan="3"
              >
                <div>Line setting</div>
                <div>
                  หัวถัง 11V-109A
                </div>
              </th>
              <td
                class="py-0"
                colspan="4"
              >
                1. วาล์ว 1, 2
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                Open ( เปิด )
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                2. วาล์ว 3, 4 , 5
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                Close ( ปิด )
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                3. Temperature เท่าไหร่
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                อุณหภูมิต้องไม่สูงกว่า  25 C' 
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol
                    class="d-flex justify-center align-center"
                    cols="6"
                  >
                    <VTextField
                      class="py-1"
                      density="compact"
                      style="font-size: 14px;"
                    >
                      <template #label>
                        <span />
                      </template>
                      <template #append-inner>
                        <span>C"</span>
                      </template>
                    </VTextField>
                  </VCol>
                  <VCol
                    class="d-flex justify-center align-center"
                    cols="6"
                  >
                    <VRow>
                      <VCol cols="6">
                        <VRadioGroup
                          v-model="radios"
                          inline
                          class="d-flex justify-center"
                        >
                          <VRadio
                            color="green"
                            value="Google"
                          >
                            <template #label>
                              <div style="font-size: 14px;">
                                OK
                              </div>
                            </template>
                          </VRadio>
                        </VRadioGroup>
                      </VCol>
                      <VCol cols="6">
                        <VRadioGroup
                          v-model="radios"
                          inline
                          class="d-flex justify-center"
                        >
                          <VRadio
                            color="green"
                            value="Google"
                          >
                            <template #label>
                              <div style="font-size: 14px;">
                                NOT
                              </div>
                            </template>
                          </VRadio>
                        </VRadioGroup>
                      </VCol>
                    </VRow>
                  </VCol>
                </VRow>
              </td>
            </tr>

            <!-- 11P-109D -->
            <tr style="font-size: 14px;">
              <th
                class="pa-0 text-center"
                colspan="1"
                rowspan="3"
              >
                <div>
                  11P-109A
                </div>
              </th>
              <td
                class="py-0"
                colspan="4"
              >
                1. วาล์ว 6 , 7 , 8 , 9 
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                Close ( ปิด )
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                2. วาล์ว 10 Open 40 % 
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                Open 40 % ตามขีดที่กำหนดไว้
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                3.Check ว่า valve 13 Open
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                ปกติวาล์วจะเปิด
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>

            <!-- Operator -->
            <tr style="font-size: 14px;">
              <th
                class="pa-0 text-center"
                colspan="1"
                rowspan="6"
              >
                <div>
                  Operator
                </div>
                <div>
                  ทำการสวมใส่อุปกรณ์ PPE 
                </div>
              </th>
              <td
                class="py-0"
                colspan="4"
              >
                - ถุงมือ
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                ใส่ถุงมือยาง
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                - แว่น safety
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                ต้องเป็นแว่น safety เท่านั้น
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                -  หน้ากากคางหมู
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                ใส่ให้ถูกวิธี
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                - กรองอากาศ ( สีดำ )
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                ใช้เฉพาะตัวกรองสีดำ
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                - ชุดป้องกันสารเคมี
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                ใส่ทั้งเสื้อและกางเกงแล้ว
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                - เข็มขัดนิรภัย
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              />
              <td
                class="py-0"
                colspan="4"
              />
            </tr>

            <!-- Lorry tank -->
            <tr style="font-size: 14px;">
              <th
                class="pa-0 text-center"
                colspan="1"
                rowspan="4"
              >
                <div>
                  Lorry tank
                </div>
              </th>
              <td
                class="py-0"
                colspan="4"
              >
                1. ต่อสายHose   เข้ากับ Valve 11
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                ต่อโดยตรงโดยไม่ผ่านPump รถ Lorry
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                2. ต่อ Line Vent  เข้ากับ Vent ของ Lorry และเปิด Valve 12
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                อย่าลืมเปิดวาล์ว 12
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                3. เปิดวาล์วจาก Lorry
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                No.14 Open ( เปิด )
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                4. Check Leak สาย Hose, ข้อต่อวาล์ว ระหว่าง Valve 11 , 14
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                ต้องไม่รั่ว
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>

            <!-- Charging -->
            <tr style="font-size: 14px;">
              <th
                class="pa-0 text-center"
                colspan="1"
                rowspan="5"
              >
                <div>
                  Charging
                </div>
              </th>
              <td
                class="py-0"
                colspan="4"
              >
                1. เปิดวาล์ว
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                วาล์ว 11 เปิด
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                2. Start Pump  เวลาเริ่ม
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                Actual  Check
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VTextField
                      class="py-1"
                      density="compact"
                      style="font-size: 14px;"
                    >
                      <template #label>
                        <span />
                      </template>
                      <template #append>
                        <span>:</span>
                      </template>
                    </VTextField>
                  </VCol>
                  <VCol cols="6">
                    <VTextField
                      class="py-1"
                      density="compact"
                      style="font-size: 14px;"
                    >
                      <template #label>
                        <span />
                      </template>
                    </VTextField>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                3. Check pressure 11P- 109A
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                ดูจาก pressure guage  ผ่าน Pump (0.2 - 0.45)
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VTextField
                      class="py-1"
                      density="compact"
                      style="font-size: 14px;"
                    >
                      <template #label>
                        <span />
                      </template>
                      <template #append-inner>
                        <span>(Mpa)</span>
                      </template>
                    </VTextField>
                  </VCol>
                  <VCol cols="6">
                    <VRow>
                      <VCol cols="6">
                        <VRadioGroup
                          v-model="radios"
                          inline
                          class="d-flex justify-center"
                        >
                          <VRadio
                            color="green"
                            value="Google"
                          >
                            <template #label>
                              <div style="font-size: 14px;">
                                OK
                              </div>
                            </template>
                          </VRadio>
                        </VRadioGroup>
                      </VCol>
                      <VCol cols="6">
                        <VRadioGroup
                          v-model="radios"
                          inline
                          class="d-flex justify-center"
                        >
                          <VRadio
                            color="green"
                            value="Google"
                          >
                            <template #label>
                              <div style="font-size: 14px;">
                                NOT
                              </div>
                            </template>
                          </VRadio>
                        </VRadioGroup>
                      </VCol>
                    </VRow>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                4. Check Ampmeter ของตัว Pump
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                ดูจากตู้ Control Pump 11P-109A ( ไม่ต่ำกว่า  8 Amp)
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VTextField
                      class="py-1"
                      density="compact"
                      style="font-size: 14px;"
                    >
                      <template #label>
                        <span />
                      </template>
                      <template #append-inner>
                        <span>Amp</span>
                      </template>
                    </VTextField>
                  </VCol>
                  <VCol cols="6">
                    <VRow>
                      <VCol cols="6">
                        <VRadioGroup
                          v-model="radios"
                          inline
                          class="d-flex justify-center"
                        >
                          <VRadio
                            color="green"
                            value="Google"
                          >
                            <template #label>
                              <div style="font-size: 14px;">
                                OK
                              </div>
                            </template>
                          </VRadio>
                        </VRadioGroup>
                      </VCol>
                      <VCol cols="6">
                        <VRadioGroup
                          v-model="radios"
                          inline
                          class="d-flex justify-center"
                        >
                          <VRadio
                            color="green"
                            value="Google"
                          >
                            <template #label>
                              <div style="font-size: 14px;">
                                NOT
                              </div>
                            </template>
                          </VRadio>
                        </VRadioGroup>
                      </VCol>
                    </VRow>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                5. Check ไฟที่ หัว Pump
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                ไฟต้องแสดงเป็นสีเขียวเท่านั้น
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>

            <!-- เมื่อรับเสร็จ -->
            <tr style="font-size: 14px;">
              <th
                class="pa-0 text-center"
                colspan="1"
                rowspan="12"
              >
                <div>
                  เมื่อรับเสร็จ
                </div>
              </th>
              <td
                class="py-0"
                colspan="4"
              >
                1. เมื่อ Pump หยุดทำงาน ปิด Valve   11, 14 และ Vent  12 
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                ด้านล่าง บริเวณ Pump 11V-109A
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px; font-style: regura;">
              <td
                class="py-0"
                colspan="4"
              >
                2. Drain จากสาย Hose และ Lorry ให้หมด
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                ใน Lorry และ Hose หมด
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                3. บันทึกเวลารับเสร็จ 
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                Actual  Check
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VTextField
                      class="py-1"
                      density="compact"
                      style="font-size: 14px;"
                    >
                      <template #label>
                        <span />
                      </template>
                      <template #append>
                        <span>:</span>
                      </template>
                    </VTextField>
                  </VCol>
                  <VCol cols="6">
                    <VTextField
                      class="py-1"
                      density="compact"
                      style="font-size: 14px;"
                    >
                      <template #label>
                        <span />
                      </template>
                      <template #append>
                        <span />
                      </template>
                    </VTextField>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                4. ถอดสายดินออกจากรถ
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                เอาออกเรียบร้อย
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                5. เปิด Valve  8 และ Cerculate 10 นาที
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                Open ( เปิด ) วาล์ว 8
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                6. เก็บ Sample Check Moisture  1 ขวดแก้วใหญ่
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                0.100 Max
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VTextField
                      class="py-1"
                      density="compact"
                      style="font-size: 14px;"
                    >
                      <template #prepend>
                        <span />
                      </template>
                      <template #label>
                        <span />
                      </template>
                      <template #append-inner>
                        <span>%</span>
                      </template>
                    </VTextField>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio value="Google">
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                      <VRadio value="Duckduckgo">
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                7. ปิด Valve 8
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                Close ( ปิด ) วาล์ว 8
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                8. เปิด Valve  4 , 5 
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                ด้านบนถัง 11V-109D
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                9. อ่าน Level ที่ถัง11V-109A ทำการ Record 
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                Actual  Check
              </td>
              <td
                class="py-1"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VTextField
                      class="py-1"
                      density="compact"
                      style="font-size: 14px;"
                    >
                      <template #label>
                        <span>(E)</span>
                      </template>
                      <template #append-inner>
                        <span>mm.</span>
                      </template>
                    </VTextField>
                  </VCol>
                  <VCol cols="6">
                    <VTextField
                      class="py-1"
                      density="compact"
                      style="font-size: 14px;"
                    >
                      <template #label>
                        <span>(F)</span>
                      </template>
                      <template #append-inner>
                        <span>Litre</span>
                      </template>
                    </VTextField>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                10. Check level DCS ได้เท่าไหร่
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                Actual  Check
              </td>
              <td
                class="py-1"
                colspan="4"
              >
                <VRow>
                  <VCol cols="12">
                    <VTextField
                      class="py-1"
                      density="compact"
                      style="font-size: 14px;"
                    >
                      <template #label>
                        <span>(G)</span>
                      </template>
                      <template #append-inner>
                        <span>Litre</span>
                      </template>
                    </VTextField>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                11. หลังจากโหลดเสร็จล็อกวาล์ว 11 
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                กุญแจล็อครหัส
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                  <VCol cols="6">
                    <VRadioGroup
                      v-model="radios"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio
                        color="green"
                        value="Google"
                      >
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </VCol>
                </VRow>
              </td>
            </tr>
            <tr style="font-size: 14px;">
              <td
                class="py-0"
                colspan="4"
              >
                12. ส่วนต่างระหว่าง  (B + D ) -F = 
              </td>
              <td
                class="py-0 text-center"
                colspan="4"
              >
                ต้องไม่ต่างกันมากจากการคำนวน
              </td>
              <td
                class="py-0"
                colspan="4"
              >
                <VRow>
                  <VCol cols="6">
                    <VTextField
                      class="py-1"
                      density="compact"
                      style="font-size: 14px;"
                    >
                      <template #prepend>
                        <span />
                      </template>
                      <template #label>
                        <span />
                      </template>
                      <template #append-inner>
                        <span>Litre</span>
                      </template>
                    </VTextField>
                  </VCol>
                  <VCol cols="6">
                    <VTextField
                      class="py-1"
                      density="compact"
                      style="font-size: 14px;"
                    >
                      <template #prepend>
                        <span />
                      </template>
                      <template #label>
                        <span />
                      </template>
                      <template #append-inner>
                        <span>Kg</span>
                      </template>
                    </VTextField>
                  </VCol>
                </VRow>
              </td>
            </tr>

          <!-- End 6 -->
          </table>

          <!-- Flow Chart -->
          <table class="custom-table">
            <thead>
              <tr>
                <th
                  class="text-center"
                  colspan="12"
                >
                  Flow Chart
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="d-flex justify-center">
                  <div>
                    <VImg
                      width="600px"
                      :src="image01"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </VCol>

      <!-- New DAta Table -->
      <VCol
        cols="12"
        style="overflow-x: auto; white-space: nowrap;"
      >
        <table class="custom-table">
          <thead>
            <tr
              class=""
              style="font-size: 16px;"
            >
              <th
                class="text-center"
                colspan="1"
              >
                Job Flow
              </th>
              <th
                class="text-center"
                colspan="4"
              >
                Manual works
              </th>
              <th
                class="text-center"
                colspan="4"
              >
                Condition
              </th>
              <th
                class="text-center"
                colspan="4"
              >
                Result
              </th>
              <th
                class="text-center"
                colspan="4"
              >
                Calculation Formula
              </th>
            </tr>
          </thead>
          <tbody>
            <template
              v-for="(group, groupIndex) in tableData"
              :key="groupIndex"
            >
              <template
                v-for="(row, rowIndex) in group.rows"
                :key="rowIndex"
              >
                <tr v-if="rowIndex === 0">
                  <!-- First row of the group -->
                  <th :rowspan="group.rows.length">
                    {{ group.header }}
                  </th>
                  <td colspan="4">
                    <span v-if="row.typeMamualWorks === 'UnderLine' "><strong><u>{{ row.manualWorks }}</u></strong></span>
                    <span v-else>{{ row.manualWorks }}</span>
                  </td>
                  <td
                    colspan="4"
                    class="text-center"
                  >
                    {{ row.condition }}
                  </td>
                  <!-- TextField -->
                  <th
                    v-if="row.result === 'TypeTextField'"
                    class=""
                    colspan="4"
                  >
                    <VTextField
                      v-if="row.conditionRule"
                      v-model="finalRes"
                      class="py-1"
                      density="compact"
                      style="font-size: 14px;"
                      :color="{
                        color: finalRes > row.conditionRule ? 'red' : 'green'
                      }"
                      :style="{
                        color: finalRes > row.conditionRule ? 'red' : 'green'
                      }"
                    >
                      <template #label>
                        <span>{{ row.label }}</span>
                        <span>{{ row.conditionRule }}</span>
                      </template>
                      <template #append-inner>
                        <span>{{ row.Prefix }}</span>
                      </template>
                    </VTextField>
                    <VTextField
                      v-if="!row.conditionRule"
                      class=""
                      density="compact"
                      style="min-width: 200px; font-size: 14px;"
                    >
                      <template #label>
                        <span>{{ row.label }}</span>
                      </template>
                      <template #append-inner>
                        <span>{{ row.Prefix }}</span>
                      </template>
                    </VTextField>
                  </th>
                  <!-- TypeDoubleRadio -->
                  <th
                    v-else-if="row.result === 'TypeDoubleRadio'"
                    colspan="4"
                    class="text-center"
                  >
                    <VRow>
                      <VCol cols="6">
                        <VRadioGroup
                          v-model="radios"
                          inline
                          class="d-flex justify-center"
                        >
                          <VRadio
                            color="green"
                            value="Google"
                          >
                            <template #label>
                              <div style="font-size: 14px;">
                                OK
                              </div>
                            </template>
                          </VRadio>
                        </VRadioGroup>
                      </VCol>
                      <VCol cols="6">
                        <VRadioGroup
                          v-model="radios"
                          inline
                          class="d-flex justify-center"
                        >
                          <VRadio
                            color="green"
                            value="Google"
                          >
                            <template #label>
                              <div style="font-size: 14px;">
                                NOT
                              </div>
                            </template>
                          </VRadio>
                        </VRadioGroup>
                      </VCol>
                    </VRow>
                  </th>
                  <!-- TypeDoubleTextField -->
                  <th
                    v-else-if="row.result === 'TypeDoubleTextField' && !row.Prefix2"
                    class=""
                    colspan="4"
                  >
                    <div class="d-flex justify-spance-between align-center">
                      <VTextField
                        class=""
                        density="compact"
                        style="min-width: 100px; font-size: 14px;"
                      >
                        <template #label>
                          <span>{{ row.label }}</span>
                        </template>
                        <template #append-inner>
                          <span>{{ row.Prefix }}</span>
                        </template>
                      </VTextField>
                      :
                      <VTextField
                        class="py-1"
                        density="compact"
                        style="min-width: 100px; font-size: 14px;"
                      >
                        <template #label>
                          <span>{{ row.label }}</span>
                        </template>
                        <template #append-inner>
                          <span>{{ row.Prefix }}</span>
                        </template>
                      </VTextField>
                    </div>
                  </th>
                  <th
                    v-else-if="row.result === 'TypeDoubleTextField' && row.Prefix2"
                    class=""
                    colspan="4"
                  >
                    <div class="d-flex justify-spance-between align-center">
                      <VTextField
                        class=""
                        density="compact"
                        style="min-width: 100px; font-size: 14px;"
                      >
                        <template #label>
                          <span>{{ row.label }}</span>
                        </template>
                        <template #append-inner>
                          <span>{{ row.Prefix }}</span>
                        </template>
                      </VTextField>
                      :
                      <VTextField
                        class="py-1"
                        density="compact"
                        style="min-width: 100px; font-size: 14px;"
                      >
                        <template #label>
                          <span>{{ row.label2 }}</span>
                        </template>
                        <template #append-inner>
                          <span>{{ row.Prefix2 }}</span>
                        </template>
                      </VTextField>
                    </div>
                  </th>
                  <!-- TypeTextFieldRadio -->
                  <th
                    v-else-if="row.result === 'TypeTextFieldRadio'"
                    class=""
                    colspan="4"
                  >
                    <VRow>
                      <VCol
                        class="d-flex justify-center align-center"
                        cols="6"
                      >
                        <VTextField
                          v-if="row.conditionRule"
                          v-model="finalRes"
                          readonly
                          class="py-1"
                          density="compact"
                          style="font-size: 14px;"
                          :color="{
                            color: finalRes > row.conditionRule ? 'red' : 'green'
                          }"
                          :style="{
                            color: finalRes > row.conditionRule ? 'red' : 'green'
                          }"
                        >
                          <template #label>
                            <span>{{ row.label }}</span>
                            <span>{{ row.conditionRule }}</span>
                          </template>
                          <template #append-inner>
                            <span>{{ row.Prefix }}</span>
                          </template>
                        </VTextField>
                        <VTextField
                          v-if="!row.conditionRule"
                          v-model="finalRes"
                          class="py-1"
                          density="compact"
                          style="font-size: 14px;"
                        >
                          <template #label>
                            <span>{{ row.label }}</span>
                          </template>
                          <template #append-inner>
                            <span>{{ row.Prefix }}</span>
                          </template>
                        </VTextField>
                      </VCol>
                      <VCol
                        class="d-flex justify-center align-center"
                        cols="6"
                      >
                        <VRow>
                          <VCol cols="6">
                            <VRadioGroup
                              v-model="radios"
                              inline
                              class="d-flex justify-center"
                            >
                              <VRadio
                                color="green"
                                value="Google"
                              >
                                <template #label>
                                  <div style="font-size: 14px;">
                                    OK
                                  </div>
                                </template>
                              </VRadio>
                            </VRadioGroup>
                          </VCol>
                          <VCol cols="6">
                            <VRadioGroup
                              v-model="radios"
                              inline
                              class="d-flex justify-center"
                            >
                              <VRadio
                                color="green"
                                value="Google"
                              >
                                <template #label>
                                  <div style="font-size: 14px;">
                                    NOT
                                  </div>
                                </template>
                              </VRadio>
                            </VRadioGroup>
                          </VCol>
                        </VRow>
                      </VCol>
                    </VRow>
                  </th>
                  <td
                    v-else
                    colspan="4"
                  >
                    {{ row.result }}
                  </td>
                  <td
                    colspan="4"
                    class="text-center"
                  >
                    {{ row.calculation }}
                  </td>
                </tr>
                <tr v-else>
                  <!-- Subsequent rows of the group -->
                  <td colspan="4">
                    <span v-if="row.typeMamualWorks === 'UnderLine' "><strong><u>{{ row.manualWorks }}</u></strong></span>
                    <span v-else>{{ row.manualWorks }}</span>
                  </td>
                  <td
                    colspan="4"
                    class="text-center"
                  >
                    {{ row.condition }}
                  </td>
                  <!-- TypeTextField -->
                  <th
                    v-if="row.result === 'TypeTextField'"
                    class="py-0"
                    colspan="4"
                  >
                    <VTextField
                      v-if="row.conditionRule && row.conditionType === '>'"
                      v-model="finalRes"
                      class="py-1"
                      density="compact"
                      style="font-size: 14px;"
                      :color="{
                        color: finalRes > row.conditionRule ? 'red' : 'green'
                      }"
                      :style="{
                        color: finalRes > row.conditionRule ? 'red' : 'green'
                      }"
                    >
                      <template #label>
                        <span>{{ row.label }}</span>
                        <span>{{ row.conditionRule }}</span>
                      </template>
                      <template #append-inner>
                        <span>{{ row.Prefix }}</span>
                      </template>
                    </VTextField>
                    <VTextField
                      v-if="row.conditionRule && row.conditionType === '<'"
                      v-model="finalRes"
                      class="py-1"
                      density="compact"
                      style="font-size: 14px;"
                      :color="{
                        color: finalRes < row.conditionRule ? 'red' : 'green'
                      }"
                      :style="{
                        color: finalRes < row.conditionRule ? 'red' : 'green'
                      }"
                    >
                      <template #label>
                        <span>{{ row.label }}</span>
                        <span>{{ row.conditionRule }}</span>
                      </template>
                      <template #append-inner>
                        <span>{{ row.Prefix }}</span>
                      </template>
                    </VTextField>
                    <VTextField
                      v-if="row.conditionRule && row.conditionType === '><'"
                      v-model="finalRes"
                      class="py-1"
                      density="compact"
                      style="font-size: 14px;"
                      :color="{
                        color: finalRes > row.conditionRule && finalRes < row.conditionRule2 ? 'red' : 'green'
                      }"
                      :style="{
                        color: finalRes > row.conditionRule && finalRes < row.conditionRule2 ? 'red' : 'green'
                      }"
                    >
                      <template #label>
                        <span>{{ row.label }}</span>
                        <span>{{ row.conditionRule }}</span>
                      </template>
                      <template #append-inner>
                        <span>{{ row.Prefix }}</span>
                      </template>
                    </VTextField>
                    <VTextField
                      v-if="!row.conditionRule"
                      class="py-1"
                      density="compact"
                      style="min-width: 320px; font-size: 14px;"
                    >
                      <template #label>
                        <span>{{ row.label }}</span>
                      </template>
                      <template #append-inner>
                        <span>{{ row.Prefix }}</span>
                      </template>
                    </VTextField>
                  </th>
                  <!-- TypeDoubleRadio -->
                  <th
                    v-else-if="row.result === 'TypeDoubleRadio'"
                    colspan="4"
                    class="text-center"
                  >
                    <VRow>
                      <VCol cols="6">
                        <VRadioGroup
                          v-model="radios"
                          inline
                          class="d-flex justify-center"
                        >
                          <VRadio
                            color="green"
                            value="Google"
                          >
                            <template #label>
                              <div style="font-size: 14px;">
                                OK
                              </div>
                            </template>
                          </VRadio>
                        </VRadioGroup>
                      </VCol>
                      <VCol cols="6">
                        <VRadioGroup
                          v-model="radios"
                          inline
                          class="d-flex justify-center"
                        >
                          <VRadio
                            color="green"
                            value="Google"
                          >
                            <template #label>
                              <div style="font-size: 14px;">
                                NOT
                              </div>
                            </template>
                          </VRadio>
                        </VRadioGroup>
                      </VCol>
                    </VRow>
                  </th>
                  <!-- TypeDoubleTextField -->
                  <th
                    v-else-if="row.result === 'TypeDoubleTextField' && !row.Prefix2"
                    class=""
                    colspan="4"
                  >
                    <div class="d-flex justify-spance-between align-center">
                      <VTextField
                        class=""
                        density="compact"
                        style="min-width: 100px; font-size: 14px;"
                      >
                        <template #label>
                          <span>{{ row.label }}</span>
                        </template>
                        <template #append-inner>
                          <span>{{ row.Prefix }}</span>
                        </template>
                      </VTextField>
                      :
                      <VTextField
                        class="py-1"
                        density="compact"
                        style="min-width: 100px; font-size: 14px;"
                      >
                        <template #label>
                          <span>{{ row.label }}</span>
                        </template>
                        <template #append-inner>
                          <span>{{ row.Prefix }}</span>
                        </template>
                      </VTextField>
                    </div>
                  </th>
                  <th
                    v-else-if="row.result === 'TypeDoubleTextField' && row.Prefix2"
                    class=""
                    colspan="4"
                  >
                    <div class="d-flex justify-spance-between align-center">
                      <VTextField
                        class=""
                        density="compact"
                        style="min-width: 100px; font-size: 14px;"
                      >
                        <template #label>
                          <span>{{ row.label }}</span>
                        </template>
                        <template #append-inner>
                          <span>{{ row.Prefix }}</span>
                        </template>
                      </VTextField>
                      :
                      <VTextField
                        class="py-1"
                        density="compact"
                        style="min-width: 100px; font-size: 14px;"
                      >
                        <template #label>
                          <span>{{ row.label2 }}</span>
                        </template>
                        <template #append-inner>
                          <span>{{ row.Prefix2 }}</span>
                        </template>
                      </VTextField>
                    </div>
                  </th>
                  <!-- TypeTextFieldRadio -->
                  <th
                    v-else-if="row.result === 'TypeTextFieldRadio'"
                    class=""
                    colspan="4"
                  >
                    <VRow>
                      <VCol
                        class="d-flex justify-center align-center"
                        cols="6"
                      >
                        <VTextField
                          v-if="row.conditionRule && row.conditionType === '>'"
                          v-model="finalRes"
                          class="py-1"
                          density="compact"
                          style="font-size: 14px;"
                          :color="{
                            color: finalRes > row.conditionRule ? 'red' : 'green'
                          }"
                          :style="{
                            color: finalRes > row.conditionRule ? 'red' : 'green'
                          }"
                        >
                          <template #label>
                            <span>{{ row.label }}</span>
                            <span>{{ row.conditionRule }}</span>
                          </template>
                          <template #append-inner>
                            <span>{{ row.Prefix }}</span>
                          </template>
                        </VTextField>
                        <VTextField
                          v-if="row.conditionRule && row.conditionType === '<'"
                          v-model="finalRes"
                          class="py-1"
                          density="compact"
                          style="font-size: 14px;"
                          :color="{
                            color: finalRes < row.conditionRule ? 'red' : 'green'
                          }"
                          :style="{
                            color: finalRes < row.conditionRule ? 'red' : 'green'
                          }"
                        >
                          <template #label>
                            <span>{{ row.label }}</span>
                            <span>{{ row.conditionRule }}</span>
                          </template>
                          <template #append-inner>
                            <span>{{ row.Prefix }}</span>
                          </template>
                        </VTextField>
                        <VTextField
                          v-if="row.conditionRule && row.conditionType === '><'"
                          v-model="finalRes"
                          class="py-1"
                          density="compact"
                          style="font-size: 14px;"
                          :color="{
                            color: (finalRes > row.conditionRule && finalRes < row.conditionRule2) ? 'green' : 'red'
                          }"
                          :style="{
                            color: (finalRes > row.conditionRule && finalRes < row.conditionRule2) ? 'green' : 'red'
                          }"
                        >
                          <template #label>
                            <span>{{ row.label }}</span>
                            <span>{{ row.conditionRule }}</span>
                            <span>{{ row.conditionRule2 }}</span>
                          </template>
                          <template #append-inner>
                            <span>{{ row.Prefix }}</span>
                          </template>
                        </VTextField>
                        <VTextField
                          v-if="!row.conditionRule"
                          v-model="finalRes"
                          class="py-1"
                          density="compact"
                          style="font-size: 14px;"
                        >
                          <template #label>
                            <span>{{ row.label }}</span>
                          </template>
                          <template #append-inner>
                            <span>{{ row.Prefix }}</span>
                          </template>
                        </VTextField>
                      </VCol>
                      <VCol
                        class="d-flex justify-center align-center"
                        cols="6"
                      >
                        <VRow>
                          <VCol cols="6">
                            <VRadioGroup
                              v-model="radios"
                              inline
                              class="d-flex justify-center"
                            >
                              <VRadio
                                color="green"
                                value="Google"
                              >
                                <template #label>
                                  <div style="font-size: 14px;">
                                    OK
                                  </div>
                                </template>
                              </VRadio>
                            </VRadioGroup>
                          </VCol>
                          <VCol cols="6">
                            <VRadioGroup
                              v-model="radios"
                              inline
                              class="d-flex justify-center"
                            >
                              <VRadio
                                color="green"
                                value="Google"
                              >
                                <template #label>
                                  <div style="font-size: 14px;">
                                    NOT
                                  </div>
                                </template>
                              </VRadio>
                            </VRadioGroup>
                          </VCol>
                        </VRow>
                      </VCol>
                    </VRow>
                  </th>
                  <td
                    v-else
                    colspan="4"
                  >
                    {{ row.result }}
                  </td>
                  <td
                    colspan="4"
                    class="text-center"
                  >
                    {{ row.calculation }}
                  </td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
      </VCol>
    </VRow>
  </div>

  <!-- Footer -->
  <VRow>
    <VCol cols="12">
      <table class="custom-table">
        <tr>
          <td colspan="3" />
          <th
            class="text-center "
            colspan="3"
          >
            DCS  
          </th>
          <th
            class="text-center "
            colspan="3"
          >
            TANK
          </th>
          <th colspan="3" />
        </tr>
        <tr>
          <th
            class=""
            colspan="3"
          >
            After
          </th>
          <th colspan="3">
            <VTextField
              class="py-1"
              density="compact"
              style="font-size: 14px;"
            >
              <template #prepend>
                <span />
              </template>
              <template #label>
                <span />
              </template>
              <template #append>
                <span />
              </template>
            </VTextField>  
          </th>
          <th colspan="3">
            <VTextField
              class="py-1"
              density="compact"
              style="font-size: 14px;"
            >
              <template #prepend>
                <span />
              </template>
              <template #label>
                <span />
              </template>
              <template #append>
                <span />
              </template>
            </VTextField>
          </th>
          <th
            class=""
            colspan="3"
          >
            Ltr
          </th>
        </tr>
        <tr>
          <th
            class=""
            colspan="3"
          >
            Before
          </th>
          <th colspan="3">
            <VTextField
              class="py-1"
              density="compact"
              style="font-size: 14px;"
            >
              <template #prepend>
                <span />
              </template>
              <template #label>
                <span />
              </template>
              <template #append>
                <span />
              </template>
            </VTextField>  
          </th>
          <th colspan="3">
            <VTextField
              class="py-1"
              density="compact"
              style="font-size: 14px;"
            >
              <template #prepend>
                <span />
              </template>
              <template #label>
                <span />
              </template>
              <template #append>
                <span />
              </template>
            </VTextField>
          </th>
          <th
            class=""
            colspan="3"
          >
            Ltr
          </th>
        </tr>
        <tr>
          <th
            class=""
            colspan="3"
          >
            Diff
          </th>
          <th colspan="3">
            <VTextField
              class="py-1"
              density="compact"
              style="font-size: 14px;"
            >
              <template #prepend>
                <span />
              </template>
              <template #label>
                <span />
              </template>
              <template #append>
                <span />
              </template>
            </VTextField>  
          </th>
          <th colspan="3">
            <VTextField
              class="py-1"
              density="compact"
              style="font-size: 14px;"
            >
              <template #prepend>
                <span />
              </template>
              <template #label>
                <span />
              </template>
              <template #append>
                <span />
              </template>
            </VTextField>
          </th>
          <th
            class=""
            colspan="3"
          >
            Ltr
          </th>
        </tr>
      </table>
    </VCol>
    <VCol cols="6">
      <table class="custom-table">
        <tr>
          <th colspan="12">
            <VTextField
              density="compact"
              variant="outlined"
              label="By :"
              placeholder="Mrs. John"
            />
          </th>
        </tr>
      </table>
    </VCol>
    <VCol cols="6" />

    <VCol
      cols="12"
      class="d-flex justify-end"
    >
      <VBtn
        class="mx-4"
        color="warning"
      >
        Save draft
      </VBtn>
      <VBtn color="green">
        submit 
        FOR R/M INSPRECTION
      </VBtn>
    </VCol>
  </VRow>
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
