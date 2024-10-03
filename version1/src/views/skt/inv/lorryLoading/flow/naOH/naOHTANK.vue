<script setup>
const vasss = ref('dd')

import image01 from '@/views/skt/inv/lorryLoading/flow/naOH/NaOH  TANK (11V-432) 1.png'
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
                  NaOH  TANK (11V-432)
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
  <div style="overflow-x: auto;">
    <VRow>
      <VCol cols="12">
        <table class="custom-table">
          <tr
            class="bg-perfect-scrollbar-thumb"
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
          <!-- 1 -->
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="1"
              rowspan="4"
            >
              1.check ใบส่งสินค้า   
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <span class="text-red">( A )</span> จำนวนน้ำมันที่ระบุ ในใบส่งสินค้า       
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            />
            <th
              class="py-0"
              colspan="4"
            >
              <VTextField
                class="py-1"
                density="compact"
                style="font-size: 14px;"
              >
                <template #label>
                  <span />
                </template>

                <template #append>
                  <span>Kg.</span>
                </template>
              </VTextField>
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th colspan="4">
              <VRow class="d-flex align-center">
                <VCol cols="6">
                  <span class="text-red">( B )</span> จำนวนน้ำมันที่คิดได้จาก Level
                </VCol>
                <VCol cols="6">
                  <VTextField
                    density="compact"
                    style="font-size: 14px;"
                  >
                    <template #label>
                      <span />
                    </template>

                    <template #append>
                      <span>mm.</span>
                    </template>
                  </VTextField>
                </VCol>
              </VRow>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              ต้องไม่เกิน 2,015 mm.
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <VTextField
                class="py-1"
                density="compact"
                style="font-size: 14px;"
              >
                <template #label>
                  <span />
                </template>

                <template #append>
                  <span>Kg.</span>
                </template>
              </VTextField>
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              <span class="text-red">( C )</span> จากการคำนวน Level (A + B)   
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ต้องไม่เกิน 45,000 Kg.
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <VTextField
                class="py-1"
                density="compact"
                style="font-size: 14px;"
              >
                <template #label>
                  <span />
                </template>

                <template #append>
                  <span>Kg.</span>
                </template>
              </VTextField>
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0 text-center"
              colspan="4"
            >
              <u>หากพบว่าไม่ตรงให้แจ้งหัวหน้างานทันที</u>
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            />
            <th
              class="py-0"
              colspan="4"
            />
          </tr>
        
          <!-- End 1 -->
          <!-- 3 -->
          <tr style="font-size: 14px;">
            <th
              colspan="1"
              rowspan="1"
              class="py-0"
            >
              2.Seal No. check 
            </th>
            <th
              colspan="4"
              class="py-0"
            >
              Check Seal No.ที่ล็อกวาล์วและฝาถังว่าตรงกับใบส่งหรือไม่
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div class="text-center py-0">
                ตรง
              </div>
            </th>
            <th
              colspan="4"
              class="text-center py-0"
            >
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
            </th>
          </tr>
          
          <!-- End 3 -->
          <!-- 3 -->
  
          <!-- New -->
          <tr style="font-size: 14px;">
            <th
              rowspan="1"
              class="py-0"
              colspan="1"
            >
              3. check ในlorry tank
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              Check level ในถัง Diesel oil ว่าท่วมแป้น 9,000 ลิตร NO.11
            </th>
            <th
              class="text-center py-0"
              colspan="4"
            >
              ทุกช่องต้องท่วมแป้น
            </th>
            <th
              class="py-0"
              colspan="4"
            >
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
            </th>
          </tr>
          
          <!-- End 3 -->

          <!-- New 4 -->
          <tr style="font-size: 14px;">
            <th
              rowspan="2"
              class="py-0"
              colspan="1"
            >
              4.อุปกรณ์ PPE  
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              O  ถุงมือ O ชุดป้องกันการกระเด็นใส่  O กระบังหน้า O รองเท้าบูท
            </th>
            <th
              class="text-center py-0"
              colspan="4"
            />
            <th
              class="py-0"
              colspan="4"
            />
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              O  แว่นตา
            </th>
            <th
              class="text-center py-0"
              colspan="4"
            />
            <th
              class="py-0"
              colspan="4"
            />
          </tr>
          <!-- End 4 -->

          <!-- 5 -->
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="1"
              rowspan="11"
            >
              5. ขั้นตอนการปฏิบัติ
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              O  หยุดรถบริเวณที่ปฏิบัติงาน และดับเครื่องยนต์ NO.1
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              เรียบร้อย
            </th>
            <th
              class="py-0"
              colspan="4"
            >
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
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              O  ใส่หมอนลองห้ามล้อเคลื่อน NO.2
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              เรียบร้อย
            </th>
            <th
              class="py-0"
              colspan="4"
            >
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
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              O  ต่อสายกราวน์เข้ากับตัวรถ NO.3
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              เรียบร้อย
            </th>
            <th
              class="py-0"
              colspan="4"
            >
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
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              O  นำกรวยมาวางกั้นบอกพื้นที่ปฏิบัติงาน NO.4
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              เรียบร้อย
            </th>
            <th
              class="py-0"
              colspan="4"
            >
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
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              O  ต่อสาย NO.5 จากรถเข้า pump 
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              เรียบร้อย
            </th>
            <th
              class="py-0"
              colspan="4"
            >
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
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              O   เปิด  valve จาก Lorry ทุก Tank NO.6
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              เปิดเรียบร้อย
            </th>
            <th
              class="py-0"
              colspan="4"
            >
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
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              O   เปิดวาล์วเข้า Pump  NO.7
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              เปิดเรียบร้อย
            </th>
            <th
              class="py-0"
              colspan="4"
            >
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
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              O   Check leak ที่สายต่อว่ารั่วหรื่อไม่  NO.5
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ต้องไม่รั่ว
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <VRadioGroup
                v-model="radios"
                inline
                class="d-flex justify-center"
              >
                <VRadio value="Google">
                  <template #label>
                    <div style="font-size: 14px;">
                      รั่ว     
                    </div>
                  </template>
                </VRadio>
                <VRadio value="Duckduckgo">
                  <template #label>
                    <div style="font-size: 14px;">
                      ไม่รั่ว
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              O   เปิดวาล์วตรง Hopper เพื่อ blow อากาศ  NO.8
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              เรียบร้อย
            </th>
            <th
              class="py-0"
              colspan="4"
            >
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
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              O   ปิด วาล์ว Hopper เมื่อไม่มีอากาศอยู่ใน line pump NO.8
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              เรียบร้อย
            </th>
            <th
              class="py-0"
              colspan="4"
            >
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
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              O   บันทึกเวลา start  (101P-023) NO.9
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            />
            <th
              class="py-0"
              colspan="4"
            >
              <VRow class="d-flex align-center">
                <VCol cols="5">
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
                <VCol cols="2">
                  :
                </VCol>
                <VCol cols="5">
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
            </th>
          </tr>


          <!-- End 4 -->
          <!-- 4 -->
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="1"
              rowspan="1"
            >
              6. ขั้นตอนขณะ
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                Check
              </div>
            </th>
            <th colspan="4" />
            <th
              class="py-0"
              colspan="4"
            />
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="1"
              rowspan="11"
            >
              <div class="d-flex align-start">
                ปฏิบัติงาน
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div class="px-6">
                :  pressure
              </div>
            </th>
            <th colspan="4">
              <div>อยู่ระหว่าง  0.2 - 0.4</div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div>
                <VTextField
                  class="py-1"
                  density="compact"
                  style="font-size: 14px;"
                >
                  <template #label>
                    <span />
                  </template>
                  <template #append>
                    <span>( Mpa )</span>
                  </template>
                </VTextField>
              </div>
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              <div class="px-6">
                :  Amp meter 
              </div>
            </th>
            <th colspan="4">
              <div>( 7 - 14 Amp )</div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div>
                <VTextField
                  class="py-1"
                  density="compact"
                  style="font-size: 14px;"
                >
                  <template #label>
                    <span />
                  </template>
                  <template #append>
                    <span>Amp</span>
                  </template>
                </VTextField>
              </div>
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              O   หยุด Pump  เมื่อ diesel ใน lorry หมด  NO.9
            </th>
            <th colspan="4">
              เรียบร้อย
            </th>
            <th
              class="py-0"
              colspan="4"
            >
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
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              O   ปิดวาล์ว Lorry  NO.6
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              เรียบร้อย
            </th>
            <th
              class="py-0"
              colspan="4"
            >
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
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              O   ปิดวาล์ว Receiving  NO.7 
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              เรียบร้อย
            </th>
            <th
              class="py-0"
              colspan="4"
            >
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
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              O   Drain น้ำมันในหม้อพักที่รถและในสาย hose ลง hopper. NO.10
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              เรียบร้อย
            </th>
            <th
              class="py-0"
              colspan="4"
            >
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
            </th>
          </tr>

          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              O   เปิดวาล์ว Hopper  NO.8
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              เรียบร้อย
            </th>
            <th
              class="py-0"
              colspan="4"
            >
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
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              O   Start pump อีกครั้ง  (101P-023). NO.9
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              เรียบร้อย
            </th>
            <th
              class="py-0"
              colspan="4"
            >
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
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              O   หยุด Pump เมื่อใน hopper หมด.NO.9
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              เรียบร้อย
            </th>
            <th
              class="py-0"
              colspan="4"
            >
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
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              O   ปิดวาล์วลง Hopper NO.8
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              เรียบร้อย
            </th>
            <th
              class="py-0"
              colspan="4"
            >
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
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              O  Check ใน lorry ว่าหมดแน่นอน  NO.11
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              เรียบร้อย
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <VRadioGroup
                v-model="radios"
                inline
                class="d-flex justify-center"
              >
                <VRadio value="Google">
                  <template #label>
                    <div style="font-size: 14px;">
                      หมด 
                    </div>
                  </template>
                </VRadio>
                <VRadio value="Duckduckgo">
                  <template #label>
                    <div style="font-size: 14px;">
                      ไม่หมด
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </th>
          </tr>
          

          <!-- End 4 -->
          <!-- 6 -->
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="1"
              rowspan="7"
            >
              7.ขั้นตอนเมื่อรับเสร็จ
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                O  บันทึกเวลารับเสร็จ 
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div class="text-center py-3" />
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <VRow class="d-flex align-center">
                <VCol cols="5">
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
                <VCol cols="2">
                  :
                </VCol>
                <VCol cols="5">
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
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                O   ถอด สาย hose - สายกราวด์ ออกแล้วหรือยัง NO.5 , NO.3
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div class="text-center py-3">
                เรียบร้อย
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
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
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                <span class="text-red">(D)</span> เช็ค Level ในแท้งค์101V-020 <span class="text-red">NO.12</span>  
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div class="text-center py-3">
                น้ำหนักที่อ่านได้
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
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
                  LTR
                </template>
              </VTextField>
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                O  ส่วนต่างระหว่างจำนวนที่คำนวณได้และจำนวนที่รับจริง            
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div class="text-center py-3">
                (C - D)
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
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
                  LTR
                </template>
              </VTextField>
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                O  ตรวจเช็ค valve เปิด-ปิด อีกครั้งให้อยู่ในสภาพเดิมก่อนรับ  NO.7 ,8 
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div class="text-center py-3">
                อยู่สภาพเดิมก่อนรับ
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
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
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                O  เอาหมอนลองล้อ รถออก  NO.2
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div class="text-center py-3">
                เอาออกแล้ว
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
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
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                O  เก็บกรวย และอุปกรณ์ PPE ทำความสะอาด  NO.4
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div class="text-center py-3">
                เก็บเรียบร้อย
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
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
            </th>
          </tr>
          <!-- End 6 -->
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
