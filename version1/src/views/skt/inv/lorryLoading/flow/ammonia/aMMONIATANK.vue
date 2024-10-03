<script setup>
const vasss = ref('dd')

import image01 from '@/views/skt/inv/lorryLoading/flow/ammonia/TELA ( 511 ) 1.png'
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
                  TELA (AMMONIA TANK   11V - 511 )
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
          <!-- 1 -->
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="1"
              rowspan="1"
            >
              1.check ใบส่งสินค้า  
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              O  จำนวนที่ระบุ ในใบส่งสินค้า    
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ทำ
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
                  <span>Kg</span>
                </template>
              </VTextField>
            </th>
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
              Check No.ตู้ ตรงกับใบส่งหรือไม่
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
              rowspan="2"
              class="py-0"
              colspan="1"
            >
              3.อุปกรณ์ PPE  
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              O  ถุงมือ O ชุดป้องกันสารเคมี  O กระบังหน้า 
            </th>
            <th
              class="text-center py-0"
              colspan="4"
            >
              ทำ
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
              O แว่นตา  O เข็มขัดนิรภัย
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
          
          <!-- End 3 -->
          <!-- 4 -->
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="1"
              rowspan="19"
            >
              5. ขั้นตอนการปฏิบัติ
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              O  หยุดรถบริเวณที่ปฏิบัติงาน และดับเครื่องยนต์ No.1
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ทำ
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
              O  ใส่หมอนลองห้ามล้อเคลื่อนด้านหน้า-หลัง No.2
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ทำ
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
              O   ประตูด้านซ้าย ติดป้ายเตือน "ห้ามเปิดประตูตู้ 2 บาน"
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ทำ
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
              แล้วให้เปิดประตูบานด้านขวาบานเดียว
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ทำ
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
              ( Please do not open this latch Liquid Contents may spill out)
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
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              O  ต่อสายกราวน์เข้ากับตัวรถ No.3
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ต่อแล้ว
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
              O นำกรวยมาวางกั้นบอกพื้นที่ปฏิบัติงาน No.1
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ทำ
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
              O ต่อสายจากรถเข้า pump 11P-143 No.6 ,7
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ต่อแล้ว
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
              O ตรวจดูการต่อสาย Hose มีการล็อก ข้อต่อสาย เรียบร้อย No.6,7
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ทำ
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
              O นำ IBC มาวางเพื่อรับเคมี ที่ line ลง IBC,Drums
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              เปิด
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
              O เปิด  valve จาก Lorry  Tank No.6
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              เปิด
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
              O เปิดวาล์วเข้า Pump  No.7
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ทำ
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
              O Check leak ที่สายต่อว่ารั่วหรื่อไม่ No.6,7
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ทำ
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
              O Check pump ว่าพร้อมใช้งานหรือไม่ โดยกด switch ไปที่ ON  
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ทำ
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
              O เปิด Valve No.10 (line circulate)
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ทำ
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
              O กดswitch 11P-143 ไปที่ ON  No.13
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ทำ
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
              O เปิด Valve No.11 ไป IBC No.12, 13(เก็บ sample ส่งQC ที่ IBC ใบแรก)
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ทำ
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
              O ปรับระดับการไหลของเคมี โดยค่อยๆ ปิด line circulate No.10  80%
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ทำ
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
              O  บันทึกเวลา start  (11P-143)ลงใน check sheet
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            />
            <th
              class="py-0"
              colspan="4"
            >
              <VRow>
                <VCol cols="6">
                  <VTextField
                    class="py-1"
                    density="compact"
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
                  >
                    <template #label>
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
              rowspan="6"
            >
              ปฏิบัติงาน
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
              <div>อยู่ระหว่าง 0.35 - 0.50</div>
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
              <div> ( 6.1 Amp )</div>
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
              <div class="px-6" />
            </th>
            <th colspan="4">
              <div />
            </th>
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
              เปิดวาล์ว circulate No.10 เพิ่มขึ้นและ ปิด วาล์วไป IBC No.11 , 12, 13
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ทำ
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
              O Start ไปที่ ON อีกครั้ง โดยหรี่วาล์ว Line circulate No.10 
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ทำ
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
              O เปิดวาล์ว  Line circulate 20%
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ทำ
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
                O  เปิด Valve ไป IBC และ เปิดวาล์ว  Line circulate 100% 
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
            />
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                เปิด N2 เพื่อไล่สารออกให้หมด
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div class="text-center py-3">
                ทำ
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
                O  ถอดสาย Hose และล้างหัววาลว์ ปิด cap เรียบร้อย No.7
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div class="text-center py-3">
                ทำ
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
                O  บันทึกเวลาที่รับเสร็จ
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div class="text-center py-3">
                ทำ
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
                O  เช็ค valveปิด อีกครั้ง 
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div class="text-center py-3">
                ปิด
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
                O  เอาหมอนลองล้อ รถออก  No.2
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
                O  เก็บกรวย และอุปกรณ์ PPE ทำความสะอาด No.1
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
