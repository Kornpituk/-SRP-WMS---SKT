<script setup>
const vasss = ref('dd')

import image01 from '@/views/skt/inv/lorryLoading/flow/aAT/Acrylic ( 431 ) 1.png'
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
                  HAKU-C  TANK (11V-111)
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
              rowspan="4"
            >
              1.check ใบส่งสินค้า  
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              ( <span class="text-red">A</span>  ) จำนวนที่ระบุ ในใบส่งสินค้า       
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
                  <span>Kg</span>
                </template>
              </VTextField>
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              <VRow>
                <VCol cols="6">
                  ( B ) จำนวนที่คิดได้จาก Level ก่อนรับ
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

                    <template #append-inner>
                      <span>mm.</span>
                    </template>
                  </VTextField>
                </VCol>
              </VRow>
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ต้องไม่เกิน 1,100 mm.
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
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              ( C ) จากการคำนวนค่าที่ได้( A + B )   
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ต้องไม่เกิน 40,000  Kg.
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
              2.Seal check 
            </th>
            <th
              colspan="4"
              class="py-0"
            >
              Check Seal ที่ล็อกวาล์วและฝาถังว่าล็อกสนิดหรือไม่
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div class="text-center py-0">
                เรียบร้อย
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
              rowspan="3"
              class="py-0"
              colspan="1"
            >
              3. check ก่อนปฏิบัติ 
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              Confirm Fire Work บริเวณที่ใกล้เคียง
            </th>
            <th
              class="text-center py-0"
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
              Checkอุณหภูมิ ในlorry tank 
            </th>
            <th
              class="text-center py-0"
              colspan="4"
            >
              <span class="text-blue">ต้องไม่เกิน 25 C'</span>
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
                  <span>'C</span>
                </template>
              </VTextField>
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              สายดินไม่ขาด
            </th>
            <th
              class="text-center py-0"
              colspan="4"
            />
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
          <!-- 5 -->
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="1"
              rowspan="14"
            >
              5. ขั้นตอนการปฏิบัติ
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              O  หยุดรถบริเวณที่ปฏิบัติงาน และดับเครื่องยนต์
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              หยุด
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
              O  ใส่หมอนลองห้ามล้อเคลื่อนด้านหน้า-หลัง
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ใส่แล้ว
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
              O  ต่อสายกราวน์เข้ากับตัวรถ
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
              O  ต่อ Line Vent เข้ากับ Vent บนรถ พร้อมเปิด Vent (No. 6)
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
              O  เก็บตัวอย่างที่ 1 จาก Line Drain sample ( No. 16 )
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              เก็บแล้ว
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
              O  ต่อสายจากรถเข้า pump <span class="text-red">(ในวงกลม)</span> พร้อมล็อกให้เรียบร้อย
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
              O  เปิด pump ว่าพร้อมใช้งานหรือไม่โดยเลื่อน สวิตซ์ไปที่ ON ถ้า Pump 
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
              ทำงานปกติให้เลื่อนกลับมาที่ AUTO  ( No. 14 )
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              pump ทำงาน
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
              O   เปิดวาล์วท้ายรถ Check leak ที่สายต่อว่ารั่วหรื่อไม่
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ไม่รั่ว
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
              O   ปิดวาล์วหมายเลข No. 4 , 3 , 2 ,16 
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ปิด
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
              O   เปิดวาล์วท้ายรถ และเปิดวาล์วเข้า Pump No.5 , 1
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
              O   ปรับระดับการไหลของเคมี โดยค่อย ๆ ปิด Line circulate
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ปิด
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
              O   หากมีสิ่งแปลกปลอมเข้า pump ให้หยุดทันที <span class="text-blue">(สังเกตแผ่นกระจกใส No. 5)</span>  
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ไม่มีสิ่งแปลกปลอม
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
              O   บันทึกเวลา start  (11P-131)
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
              rowspan="8"
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
            <th
              colspan="4"
              class="text-center"
            >
              <div>อยู่ระหว่าง  0.2 - 0.6</div>
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
            <th
              colspan="4"
              class="text-center"
            >
              <div>( 7 - 20 Amp )</div>
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
              <div class="">
                O    Pumpหยุดเมื่อเคมีใน lorry หมด ให้ปิดสวิตซ์ไป Off เปิด circulate No. 17
              </div>
            </th>
            <th
              colspan="4"
              class="text-center"
            >
              ปิดสวิตซ์อยู่ที่ off
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
              O   Start ไปที่ ON อีกครั้ง โดยหรี่วาล์ว Line circulate 431 จนแน่ใจว่าหมด
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              หมด
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
              O   ปิดวาล์วท้ายรถ และ วาล์วหัว pump No 5,1
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ปิด
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
              O   Start pump โดยเปิด circulate 431 100% ทิ้งไว้ 15 นาที
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
              O   ถอดสาย Hose และเก็บ sample จาก line No.2
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
              O   ถอด line vent และปิด เรียบร้อย  No.6
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
          

          <!-- End 4 -->
          <!-- 7 -->
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="1"
              rowspan="10"
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
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                O   ถอด สาย hose - สายกราวด์ ออกแล้วหรือยัง
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
                O  ตรวจเช็ค valve เปิด อีกครั้งให้อยู่ในสภาพเดิมก่อนรับ No.17,431,413
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
                O  หลังจาก 15 นาที ให้เลื่อนสวิตซ์ไปที่ auto เก็บตัวอย่างที่ 3 No.16
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div class="text-center py-3">
                เก็บแล้ว
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
                O  เก็บกรวย และอุปกรณ์ PPE ทำความสะอาด
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div class="text-center py-3">
                เก็บแล้ว
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
              <div class="py-0">
                <VRow>
                  <VCol cols="6">
                    <span class="text-red">(D)</span>เช็ค Level ในแท้งค์11V-431 เท่ากับ
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
                        <span>mm.</span>
                      </template>
                    </VTextField>
                  </VCol>
                </VRow>         
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
              <div class="py-3">
                O  ส่วนต่างระหว่างจำนวนที่คำนวณได้และจำนวนที่รับจริง  <span class="text-red">(C - D) </span>                 
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
              <div class="py-3">
                O  ตรวจเช็ค valve ปิด อีกครั้งให้อยู่ในสภาพเดิมก่อนรับ No. 5,4,3,2,1,16 
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
                O  ทำการล้าง ตาม check sheet วิธีการล้าง 
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
