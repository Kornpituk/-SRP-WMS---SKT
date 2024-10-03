<script setup>
const vasss = ref('dd')

const route = useRoute()

const dataProps = ref(JSON.parse(route.query.Data || '[]'))

const roleAccount = ref(sessionStorage.getItem('accountRole'))

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
        result: 'TypeDoubleTextField',
        Prefix: 'Kg',
        label: '(A)',
        pressWord: '=',
        Prefix2: 'Litre',
        label2: '(B)',
        calculation: '(B) = (A) / 0.78',
        value: null,
      },
      {
        manualWorks: '2.Level ที่อ่านได้จาก Tank 11V-109A ก่อนรับ',
        typeMamualWorks: 'nomaly',
        condition: 'ต้องไม่เกิน 575 mm.',
        conditionRule: 575,
        conditionType: '>',
        result: 'TypeDoubleTextField',
        Prefix: 'mm',
        label: '(C)',
        pressWord: '=',
        Prefix2: 'Litre',
        label2: '(D)',
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

//------------------------ Dialog --------------------------------
//--------------------------- Dialog Submit -------------------------------
const isDialogConfirmVisible = ref(false)
const isDialogSubmitSuccessVisible = ref(false)
const isDialogTextAreaVisible = ref(false)

const wordForSubmit = ref('Word')

const submitButton = word => {
  isDialogConfirmVisible.value = true
  wordForSubmit.value = word
}

const areaTextRemarkButton = word => {
  isDialogTextAreaVisible.value = true
  wordForSubmit.value = word
}

const submitButtonVisible = () => {
  isDialogSubmitSuccessVisible.value = true
  isDialogConfirmVisible.value = false
}

const completeSubmit = () => {
  isDialogSubmitSuccessVisible.value = false
  isDialogConfirmVisible.value = false
}

const submitConfirm = () => {
  isDialogSubmitSuccessVisible.value = false
  sessionStorage.setItem('currentTableWatchSesstion', 1)

  // รีเฟรชหน้าจอ
  location.reload()
}

//--------------------------- Status Check --------------------------
const tabDisablingConfig = {
  'Waiting for Receiving': {
    manager: ['Raw Material Inspection Request Form', 'Lorry Loading Check List'],
    issues: ['Raw Material Inspection Request Form', 'Lorry Loading Check List'],
  },
  'Draft Receiving Form': {
    manager: ['Raw Material Inspection Request Form', 'Lorry Loading Check List'],
    issues: ['Raw Material Inspection Request Form', 'Lorry Loading Check List'],
  },
  'Waiting for Inspection': {
    manager: true,
    issues: true,
  },
  'Draft R/M Inspection Form': {
    manager: true,
    issues: true,
  },
  'Waiting for Inspection Approval': {
    manager: true,
    issues: false,
  },
  'Waiting for Warehouse Rejection': {
    manager: false,
    issues: false,
  },

  // Add more statuses and role combinations as needed
}

const btnVIfSaveDraft = ref(false)
const btnVIfSubmit = ref(false)
const btnVIfBackToEdit = ref(false)
const btnVIfReject = ref(false)
const btnVIfApprove = ref(false)

const getDisabledFollowStatusNRole = () => {
  const status = dataProps.value.statusText
  const role = roleAccount.value
  
  console.log('Status Lorry:', status)
  console.log('Role Lorry:', role)
  console.log('Disabled Tabs Lorry:',  (tabDisablingConfig[status]?.[role] || false))
  
  return tabDisablingConfig[status]?.[role] || false
}
</script>

<template>
  <div>
    <VRow>
      <VCol
        class="mt-2"
        cols="12"
      >
        <VRow>
          <VCol
            class="d-flex align-center justify-center"
            cols="8"
          >
            <VRow class="pa-0">
              <VCol cols="12">
                <div
                  style="font-size: 22px; font-weight: bolder;"
                  class="d-flex justify-center align-center pa-0"
                >
                  Lorry Loading Check List<br>
                </div>
              </VCol>
              <VCol cols="12">
                <div class="d-flex justify-center align-center pa-0">
                  ISOPRO (IPA) 
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
                    v-model="dataProps.pONo"
                    density="compact"
                    variant="outlined"
                    label="Raw Mat. Code"
                  />
                </div>
              </VCol>
              <VCol
                cols="12"
                style="border: 1px solid black;"
              >
                <div>
                  <VRow class="d-flex align-center">
                    <VCol cols="12">
                      <AppDateTimePicker
                        v-model="dataProps.deliveryDate"
                        label="Received Date"
                        placeholder="Received Date"
                        density="compact"
                        prepend-inner-icon="ri-calendar-schedule-fill"
                        :config="{ dateFormat: 'd/m/Y' }"
                      />
                    </VCol>
                  </VRow>
                </div>
              </VCol>
            </VRow>
          </VCol>
        </VRow>
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
              style="font-size: 12px;"
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
                Manual Works
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
          <tbody style="font-size: 12px;">
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
                  <th
                    style="font-size: 12px; text-transform: capitalize;"
                    :rowspan="group.rows.length"
                  >
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
                      style="font-size: 12px;"
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
                      style="min-width: 200px; font-size: 12px;"
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
                              <div style="font-size: 12px;">
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
                              <div style="font-size: 12px;">
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
                        style="min-width: 100px; font-size: 12px;"
                      >
                        <template #label>
                          <span>{{ row.label }}</span>
                        </template>
                        <template #append-inner>
                          <span>{{ row.Prefix }}</span>
                        </template>
                      </VTextField>
                      <span v-if="row.pressWord">
                        {{ row.pressWord }}
                      </span>
                      <VTextField
                        class="py-1"
                        density="compact"
                        style="min-width: 100px; font-size: 12px;"
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
                        style="min-width: 100px; font-size: 12px;"
                      >
                        <template #label>
                          <span>{{ row.label }}</span>
                        </template>
                        <template #append-inner>
                          <span>{{ row.Prefix }}</span>
                        </template>
                      </VTextField>
                      
                      <span v-if="row.pressWord">
                        {{ row.pressWord }}
                      </span>
                      <VTextField
                        class="py-1"
                        density="compact"
                        style="min-width: 100px; font-size: 12px;"
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
                          style="font-size: 12px;"
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
                          style="font-size: 12px;"
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
                                  <div style="font-size: 12px;">
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
                                  <div style="font-size: 12px;">
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
                      style="font-size: 12px;"
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
                      style="font-size: 12px;"
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
                      style="font-size: 12px;"
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
                      style="min-width: 320px; font-size: 12px;"
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
                              <div style="font-size: 12px;">
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
                              <div style="font-size: 12px;">
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
                        style="min-width: 100px; font-size: 12px;"
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
                        style="min-width: 100px; font-size: 12px;"
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
                        style="min-width: 100px; font-size: 12px;"
                      >
                        <template #label>
                          <span>{{ row.label }}</span>
                        </template>
                        <template #append-inner>
                          <span>{{ row.Prefix }}</span>
                        </template>
                      </VTextField>
                      <span v-if="row.pressWord">
                        {{ row.pressWord }}
                      </span>
                      <VTextField
                        class="py-1"
                        density="compact"
                        style="min-width: 100px; font-size: 12px;"
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
                          style="font-size: 12px;"
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
                          style="font-size: 12px;"
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
                          style="font-size: 12px;"
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
                          style="font-size: 12px;"
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
                                  <div style="font-size: 12px;">
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
                                  <div style="font-size: 12px;">
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

      <VCol cols="12">
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

    <!-- Btn -->
    <VCol
      cols="12"
      class="d-flex justify-end"
    >
      <VBtn
        v-if="getDisabledFollowStatusNRole()"
        class="mx-4"
        color="warning"
      >
        Save draft
      </VBtn>
      <VBtn
        v-if="getDisabledFollowStatusNRole()"
        color="green"
        @click="submitButton('Submit')"
      >
        SUBMIT
      </VBtn>
      <VBtn
        v-if="getDisabledFollowStatusNRole()"
        color="green"
        @click="submitButton('Approve')"
      >
        APPROVAL
      </VBtn>
    </VCol>
    <!-- Dialog Submit -->
    <section>
      <VDialog
        v-model="isDialogSubmitVisible"
        width="500"
      >
        <!-- Dialog Content -->
        <VCard>
          <VCardText>
            <div class="d-flex justify-center">
              <VIcon
                size="100"
                color="warning"
                icon="ri-question-line"
              />
            </div>
            <div class="text-center">
              <span style="font-size: 22px; font-weight: bolder;">Would you like to {{ wordForSubmit }} Transaction?</span>
            </div>
          </VCardText>

          <VCardAction class="d-flex justify-space-between pa-4">
            <VBtn
              color="error"
              @click="isDialogSubmitVisible = false"
            >
              Cancel
            </VBtn>
            <VBtn
              color="green"
              @click="submitProductionPlan(indexSubmit)"
            >
              Submit
            </VBtn>
          </VCardAction>
        </VCard>
      </VDialog>
    </section>
    <!-- Dialog Submit Success -->
    <section>
      <VDialog
        v-model="isDialogSubmitSuccessVisible"
        width="500"
      >
        <!-- Dialog Content -->
        <VCard>
          <VCardText>
            <div class="d-flex justify-center">
              <VIcon
                size="100"
                color="success"
                icon="ri-checkbox-circle-line"
              />
            </div>
            <div class="text-center">
              <span style="font-size: 22px; font-weight: bolder;">Submission Success</span>
            </div>
          </VCardText>

          <VCardAction class="d-flex justify-center pa-4">
            <VBtn
              color="success"
              @click="isDialogSubmitSuccessVisible = false"
            >
              Continue
            </VBtn>
          </VCardAction>
        </VCard>
      </VDialog>
    </section>
    <!-- Dialog Submit Failed -->
    <section>
      <VDialog
        v-model="isDialogSubmitFailedVisible"
        width="500"
      >
        <!-- Dialog Content -->
        <VCard>
          <VCardText>
            <div class="d-flex justify-center">
              <VIcon
                size="100"
                color="error"
                icon="ri-error-warning-line"
              />
            </div>
            <div class="text-center">
              <span style="font-size: 22px; font-weight: bolder;">Submission Failed</span>
            </div>
          </VCardText>

          <VCardAction class="d-flex justify-center pa-4">
            <VBtn
              color="error"
              @click="isDialogSubmitFailedVisible = false"
            >
              Continue
            </VBtn>
          </VCardAction>
        </VCard>
      </VDialog>
    </section>
  </VRow>

  <!-- Dialog Submit -->
  <section>
    <VDialog
      v-model="isDialogConfirmVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardText>
          <div class="d-flex justify-center">
            <VIcon
              size="100"
              color="warning"
              icon="ri-question-line"
            />
          </div>
          <div class="text-center">
            <span style="font-size: 22px; font-weight: bolder;">Would you like to {{ wordForSubmit }} Transaction?</span>
          </div>
        </VCardText>

        <VCardAction class="d-flex justify-space-between pa-4">
          <VBtn
            color="error"
            @click="isDialogConfirmVisible = false"
          >
            Cancel
          </VBtn>
          <VBtn
            color="green"
            @click="submitButtonVisible"
          >
            {{ wordForSubmit }}
          </VBtn>
        </VCardAction>
      </VCard>
    </VDialog>
  </section>
  <!-- Dialog Submit Success -->
  <section>
    <VDialog
      v-model="isDialogSubmitSuccessVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardText>
          <div class="d-flex justify-center">
            <VIcon
              size="100"
              color="success"
              icon="ri-checkbox-circle-line"
            />
          </div>
          <div class="text-center">
            <span style="font-size: 22px; font-weight: bolder;">{{ wordForSubmit }} Success</span>
          </div>
        </VCardText>

        <VCardAction class="d-flex justify-center pa-4">
          <VBtn
            color="success"
            @click="submitConfirm"
          >
            Continue
          </VBtn>
        </VCardAction>
      </VCard>
    </VDialog>
  </section>
  <!-- Dialog Submit Failed -->
  <section>
    <VDialog
      v-model="isDialogSubmitFailedVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardText>
          <div class="d-flex justify-center">
            <VIcon
              size="100"
              color="error"
              icon="ri-error-warning-line"
            />
          </div>
          <div class="text-center">
            <span style="font-size: 22px; font-weight: bolder;">{{ wordForSubmit }} Failed</span>
          </div>
        </VCardText>

        <VCardAction class="d-flex justify-center pa-4">
          <VBtn
            color="error"
            @click="isDialogSubmitFailedVisible = false"
          >
            Continue
          </VBtn>
        </VCardAction>
      </VCard>
    </VDialog>
  </section>

  <!-- Dialog Area Text Remark -->
  <section>
    <VDialog
      v-model="isDialogTextAreaVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard :title="wordForSubmit">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogTextAreaVisible = false"
        />

        <VCardText>
          <VTextarea
            :label="`Remark ${wordForSubmit}`"
            :placeholder="`Enter Remark ${wordForSubmit}`"
          />
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            :color="wordForSubmit === 'Back To Edit' ? 'info' : (wordForSubmit === 'Reject' ? 'error' : 'default')"
            @click="isDialogTextAreaVisible = false; isDialogVisibleAction = false"
          >
            {{ wordForSubmit }}
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>
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
