<script setup>
const vasss = ref('dd')

import image01 from '@/views/skt/inv/lorryLoading/flow/eki/EKI-A ( 110 ) 1.png'

//------------------------------------ 
const tableData = ref([
  {
    header: '1. Check ใบส่งสินค้า',
    rows: [
      {
        manualWorks: '( A ) จำนวนที่ระบุ ในใบส่งสินค้า',
        condition: '',
        result: 'TypeTextField',
        Prefix: 'Kg.',
        label: '(A)',
      },
      {
        manualWorks: '( B ) จำนวนที่ได้จาก Level จากการอ่าน DCS',
        condition: 'ต้องไม่เกิน 15,000 kg',
        result: 'TypeTextField',
        Prefix: 'Kg.',
        label: '(B)',
      },
      {
        manualWorks: '( C ) ปริมาณที่คำนวณได้ก่อนการรับ (A + B)',
        condition: 'A + B',
        result: 'TypeTextField',
        Prefix: 'Kg.',
        label: '',
      },
      {
        manualWorks: 'จำเป็นต้องยืนยันว่า A + B ต้องน้อยกว่า 28,000 kg',
        condition: 'A + B = < 28,000 kg',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'ตรวจสอบไฟสถานะอนุญาติ ติดหรือดับ ( Y )',
        condition: 'ไฟดับ',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
    ],
  },
  {
    header: '2. Seal No. check',
    rows: [
      {
        manualWorks: 'Check Seal No.ที่ล็อกวาล์วและฝาถังว่าตรงกับใบส่งหรือไม่',
        typeMamualWorks: 'nomaly',
        condition: 'ตรง',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'หากพบว่าไม่ตรงให้แจ้งหัวหน้างานทันที',
        typeMamualWorks: 'UnderLine',
        condition: '',
        result: '',
        Prefix: '',
        label: '',
      },
    ],
  },
  {
    header: '3. อุปกรณ์ PPE',
    rows: [
      {
        manualWorks: 'O  ถุงมือ    O ชุดป้องกันสารเคมี  O กระบังหน้า  O รองเท้าบูท',
        typeMamualWorks: 'nomaly',
        condition: '',
        result: '',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'O แว่นตา    O หน้ากาก กรองอากาศสีเหลือง       O เข็มขัดนิรภัย',
        typeMamualWorks: 'nomaly',
        condition: '',
        result: '',
        Prefix: '',
        label: '',
      },
    ],
  },
  {
    header: '4. ขั้นตอนการปฏิบัติ',
    rows: [
      {
        manualWorks: 'O หยุดรถบริเวณที่ปฏิบัติงาน และดับเครื่องยนต์ No.1',
        condition: 'เรียบร้อย',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'O ใส่หมอนลองห้ามล้อเคลื่อนด้านหน้า-หลัง No.2',
        condition: 'ใส่แล้ว',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'O ต่อสายกราวน์เข้ากับตัวรถ No.3',
        condition: 'ต่อแล้ว',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'O นำกรวยมาวางกั้นบอกพื้นที่ปฏิบัติงาน No.1',
        condition: 'ทำ',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'O เก็บ Sample (จาก Lorry tank )ส่ง INSP รอผล Lab',
        condition: 'เรียบร้อย',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'O ต่อสายจากรถเข้า pump 11P-111A No.5',
        condition: 'ต่อแล้ว',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'O ตรวจดูการต่อสาย Hose มีการล็อก ข้อต่อสาย เรียบร้อย No.5,6',
        condition: 'ทำ',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'O เปิด valve จาก Lorry Tank No.6',
        condition: 'เปิด',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'O Check leak ที่สายต่อว่ารั่วหรื่อไม่ No.5',
        condition: 'ทำ(Ok = รั่ว Not = ไม่รั่ว)',
        result: 'TypeDoubleRadio',
      },
      {
        manualWorks: 'O เปิดวาล์วเข้า Pump No.5,8,9,10',
        condition: 'เปิด',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'O กดปุ่ม Unloading วงกลมสีแดง ( X )',
        condition: 'ทำ',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'O เช็คตู้ควบคุมวาล์ว XV-111C,D ต้องเปิด',
        condition: 'เปิด',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'O ตรวจสอบไฟสถานะอนุญาติ ดับหรือติด ( Y )/ ตัว Scrubber ต้องทำงาน',
        condition: 'ไฟติด/ทำงาน',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'O กดปุ่ม Start ที่ตัวควบคุม ( วงกลมสีแดง ) ( Z )',
        condition: 'ทำ',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'O บันทึกเวลา start (11P-111A)',
        condition: '',
        result: 'TypeDoubleTextField',
        Prefix: '',
        label: '',
      },
    ],
  },
  {
    header: '5. ขั้นตอนขณะปฏิบัติงาน',
    rows: [
      {
        manualWorks: 'Check',
        typeMamualWorks: 'nomaly',
        condition: '',
        result: '',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: ':pressure',
        typeMamualWorks: 'nomaly',
        condition: 'อยู่ระหว่าง 0.2 - 0.4',
        result: 'TypeTextField',
        Prefix: 'Mpa',
        label: '',
      },
      {
        manualWorks: ':Amp meter',
        typeMamualWorks: 'nomaly',
        condition: '( 5 - 10 Amp )',
        result: 'TypeTextField',
        Prefix: 'Amp',
        label: '',
      },
      {
        manualWorks: 'Pumpหยุดเมื่อเคมีใน lorry หมด ให้ปิดสวิตซ์ไป Off หรี่วาล์ว No.10',
        typeMamualWorks: 'nomaly',
        condition: 'ปิดสวิตซ์อยู่ที่ off',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'Start ไปที่ ON อีกครั้ง โดยหรี่วาล์ว Valve Line No.10 จนแน่ใจว่าหมดโดยดูที่ช่องใส No.9',
        typeMamualWorks: 'nomaly',
        condition: 'หมด',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'ปิดสวตซ์ Pump ไปตำแหน่ง OFF',
        typeMamualWorks: 'nomaly',
        condition: 'ทำ',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'ต่อสายลมจาก No.12 มาต่อที่ข้อต่อที่ Tank แล้วเปิด Air ไล่สารในสายให้หมด',
        typeMamualWorks: 'nomaly',
        condition: 'ทำ',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'ปิดวาล์ว No.12,6,5,8,9,10',
        typeMamualWorks: 'nomaly',
        condition: 'ทำ',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'เปิด No.13 ไล่อากาศออกถอดสาย Hose และล้างหัววาลว์ ปิด cap เรียบร้อย No.5',
        typeMamualWorks: 'nomaly',
        condition: 'ทำ',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
    ],
  },
  {
    header: '6. ขั้นตอนเมื่อรับเสร็จ',
    rows: [
      {
        manualWorks: 'บันทึกเวลาที่รับเสร็จ',
        typeMamualWorks: 'nomaly',
        condition: '',
        result: 'TypeDoubleTextField',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: '(D) เช็ค Level ในแท้งค์11V-111 เท่ากับ……………% ( X )',
        typeMamualWorks: 'nomaly',
        condition: 'น้ำหนักที่อ่านได้',
        result: 'TypeTextField',
        Prefix: 'Kg.',
        label: '',
      },
      {
        manualWorks: 'ส่วนต่างระหว่างจำนวนที่คำนวณได้และจำนวนที่รับจริง (C - D)',
        typeMamualWorks: 'nomaly',
        condition: '',
        result: 'TypeTextField',
        Prefix: 'Kg.',
        label: '',
      },
      {
        manualWorks: 'เช็ค valve ปิด อีกครั้ง No. 5,8,9,10',
        typeMamualWorks: 'nomaly',
        condition: 'ปิด',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'กดปุ่ม Stop ปั๊ม ( วงกลมสีเขียว ) ( Z )',
        typeMamualWorks: 'nomaly',
        condition: 'ทำ',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'กดปุ่ม Finish unloading ( วงกลมสีเขียว ) ( X )',
        typeMamualWorks: 'nomaly',
        condition: 'ทำ',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'เช็คตู้ควบคุมวาล์ว XV-111 C, D ต้องปิด ( X )',
        typeMamualWorks: 'nomaly',
        condition: 'ทำ',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'Scrubber blower ต้องดับไม่ทำงาน ( New scrubber area )',
        typeMamualWorks: 'nomaly',
        condition: 'ไม่ทำงาน',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'ตรวจสอบไฟสถานะอนุญาติ ติดหรือดับ ( Y )',
        typeMamualWorks: 'nomaly',
        condition: 'ดับ',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
      {
        manualWorks: 'เก็บกรวยและอุปกรณ์ PPE ทำความสะอาดพื้นที่',
        typeMamualWorks: 'nomaly',
        condition: 'ทำ',
        result: 'TypeDoubleRadio',
        Prefix: '',
        label: '',
      },
    ],
  },
 
])
</script>

<template>
  <div class="my-4">
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
                <div
                  style="font-size: 18px; font-weight: bolder;"
                  class="d-flex justify-center align-center pa-0"
                >
                  EKI-A  TANK (11V-110)
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
    </VRow>
  </div>
  
  <div>
    <VRow>
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
                colspan="4"
              >
                เงื่อนไข
              </th>
              <th
                class="text-center"
                colspan="4"
              >
                ผลการเช็ค
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
                  <th
                    v-if="row.result === 'TypeTextField'"
                    class="py-0"
                    colspan="4"
                  >
                    <VTextField
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
                  </th>
                  <th
                    v-else-if="row.result === 'TypeDoubleRadio'"
                    colspan="4"
                    class="text-center py-0"
                  >
                    <VRadioGroup
                      v-model="row.result"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio value="ok">
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                      <VRadio value="not">
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </th>
                  <th
                    v-else-if="row.result === 'TypeDoubleTextField'"
                    class="py-0"
                    colspan="4"
                  >
                    <div class="d-flex justify-spance-between align-center">
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
                  <td
                    v-else
                    colspan="4"
                  >
                    {{ row.result }}
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
                  <th
                    v-if="row.result === 'TypeTextField'"
                    class="py-0"
                    colspan="4"
                  >
                    <VTextField
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
                  </th>
                  <th
                    v-else-if="row.result === 'TypeDoubleRadio'"
                    colspan="4"
                    class="text-center py-0"
                  >
                    <VRadioGroup
                      v-model="row.result"
                      inline
                      class="d-flex justify-center"
                    >
                      <VRadio value="ok">
                        <template #label>
                          <div style="font-size: 14px;">
                            OK
                          </div>
                        </template>
                      </VRadio>
                      <VRadio value="not">
                        <template #label>
                          <div style="font-size: 14px;">
                            NOT
                          </div>
                        </template>
                      </VRadio>
                    </VRadioGroup>
                  </th>
                  <th
                    v-else-if="row.result === 'TypeDoubleTextField'"
                    class="py-0"
                    colspan="4"
                  >
                    <div class="d-flex justify-spance-between align-center">
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
                  <td
                    v-else
                    colspan="4"
                  >
                    {{ row.result }}
                  </td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
      </VCol>

      <!-- Flow Chart -->
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

      <VCol cols="12">
        <table class="custom-table">
          <tr>
            <th colspan="2">
              ข้อควรระวัง
            </th>
            <th colspan="10">
              <div>: "ห้ามเปิดประตูตู้ 2 บาน"เพราะจะทำให้สารเคมีไหลออกมาทั้งหมด</div>
              <div>
                : ให้สวมหน้ากาก ตลอดเวลา เพื่อป้องกันเหตุได้ทันท่วงที
              </div>
              <div>: Cap Lock ของข้อต่อกับวาวล์แน่นหนา ไม่หลุดง่าย หากรั่วไหลแจ้งหัวหน้างาน หรือผู้ที่เกี่ยวข้องโดย ด่วน</div>
            </th>
          </tr>
        </table>
      </VCol>
    </VRow>
  </div>

  <VRow class="mt-4">
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
  text-align: center;
}

.custom-table {
  border-collapse: collapse;
  border-spacing: 0;
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

.v-text-field .v-input__control .v-input__slot {
  display: flex !important;
  align-items: center !important;
  min-block-size: auto !important;
}
</style>
