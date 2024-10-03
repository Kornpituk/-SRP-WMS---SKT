<script setup>
const vasss = ref('dd')

import image01 from '@/views/skt/inv/lorryLoading/calculate/ePP/EP-400 (144,145 ) 1.png'
import { watchEffect } from 'vue'

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
    varB.value = varA.value / 1.17
  } else {
    varA.value = 0
  }
  if(varC.value >= 0 && varC.value < 480){
    varD.value = (varC.value * 5.288) - 172.970
  }else {
    varD.value = 0
  }

  if(varB.value > 0 && varD.value > 0){
    resBpD.value = varB.value+varD.value
  }else {
    resBpD.value = 0
  }

  if(varA.value == 0 && varC.value == 0){
    finalRes.value = 0
    resBpD.value = 0
    varD.value = 0
  }

  if(resBpD.value > 0){
    finalRes.value = (resBpD.value*5.288)-172.970
  }else {
    finalRes.value = 0
  }
})
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
                  EP-400BE 11V-144
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
          <!-- ข้อควรระวัง -->
          <tr style="font-size: 14px;">
            <th
              class="py-0 text-center"
              colspan="1"
              rowspan="6"
            >
              <u class="text-decoration-underline">ข้อควรระวัง</u>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              : หากมีงาน Hot work or Fire work ใกล้เคียง ให้แจ้งหัวหน้างานให้หยุดชั่วคราว
            </th>
            <th
              class="py-0 text-center"
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
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              : ให้ ปิดโทรศัพท์ขณะ Loading สาร
            </th>
            <th
              class="py-0 text-center"
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
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              : หากมี ของเหลว หยดลงพื้น ให้ใช้ผ้า หรือ ตัวดูดซับ ห้ามใช้น้ำล้าง 
            </th>
            <th
              class="py-0 text-center"
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
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              : Check วาล์ว ปิด ประตูน้ำก่อนปฏิบัติงาน 
            </th>
            <th
              class="py-0 text-center"
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
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              : แจ้ง Leader Production เวลา Loading ว่าไม่ตรงกับเวลาการใช้ 11P-144,11P-145 ในการผลิต
            </th>
            <th
              class="py-0 text-center"
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
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              : Check ถังดับเพลิงประเภท เคมีแห้ง ว่าพร้อมใช้งาน
            </th>
            <th
              class="py-0 text-center"
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
        
          <!-- Document Check -->
          <tr style="font-size: 14px;">
            <th
              colspan="1"
              rowspan="5"
              class="py-0 text-center"
            >
              Document Check
            </th>
            <th
              colspan="4"
              class="py-0"
            >
              1. จำนวนที่ระบุ ในใบส่งสินค้า   
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div class="text-center py-0">
                ตามเอกสารใบส่ง
              </div>
            </th>
            <th
              colspan="4"
              class="text-center py-0"
            >
              <VRow>
                <VCol
                  class="d-flex justify-center align-center"
                  cols="12"
                >
                  <VTextField
                    v-model="varA"
                    class="py-1"
                    density="compact"
                    style="font-size: 14px;"
                    type="number"
                  >
                    <template #prepend>
                      <span> (A)</span>
                    </template>
                    <template #label>
                      <span />
                    </template>
                    <template #append>
                      <span>Kg</span>
                    </template>
                  </VTextField>
                </VCol>
              </VRow>
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              colspan="4"
              class="py-0"
            >
              2.  Level ที่อ่านได้จาก Tank 11V-144 ก่อนรับ       
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div class="text-center py-0">
                ต้องไม่เกิน 180 mm.
              </div>
            </th>
            <th
              colspan="4"
              class="text-center py-0"
            >
              <VRow>
                <VCol
                  class="d-flex justify-center align-center"
                  cols="5"
                >
                  <VTextField
                    v-model="varC"
                    :color="{
                      color: varC > 180 ? 'red' : 'green'
                    }"
                    :style="{
                      color: varC > 180 ? 'red' : 'green'
                    }"
                    class="py-1"
                    density="compact"
                    type="number"
                    style="font-size: 14px;"
                  >
                    <template #prepend>
                      <span> (B)</span>
                    </template>
                    <template #label>
                      <span />
                    </template>
                    <template #append>
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
                    <template #prepend>
                      <span>(C)</span>
                    </template>
                    <template #label>
                      <span />
                    </template>
                    <template #append>
                      <span>Kg.</span>
                    </template>
                  </VTextField>
                </VCol>
              </VRow>
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              colspan="4"
              class="py-0"
            >
              3. ตรวจสอบว่าปริมาณหลังจากรับไม่เกินความจุถัง
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div class="text-center py-0">
                ต้องไม่เกิน 2,130 mm.
              </div>
            </th>
            <th
              colspan="4"
              class="text-center py-0"
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
                      color: resBpD > 2130 ? 'red' : 'green'
                    }"
                    :style="{
                      color: resBpD > 2130 ? 'red' : 'green'
                    }"
                  >
                    <template #prepend>
                      <span> (B) + (C)</span>
                    </template>
                    <template #label>
                      <span />
                    </template>
                    <template #append>
                      <span>Kg.</span>
                    </template>
                  </VTextField>
                </VCol>
                <VCol
                  class="d-flex justify-center align-center"
                  cols="6"
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
                </VCol>
              </VRow>
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              colspan="4"
              class="py-0"
            >
              4. ตรวจสอบ ปริมาณ ใน DCS  
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div class="text-center py-0">
                กดดูที่ถัง 11V-144 ต้องไม่เกิน 22,835 kg.
              </div>
            </th>
            <th
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
                      color: finalRes > 22835 ? 'red' : 'green'
                    }"
                    :style="{
                      color: finalRes > 22835 ? 'red' : 'green'
                    }"
                  >
                    <template #label>
                      <span />
                    </template>
                    <template #append>
                      <span>Kg.</span>
                    </template>
                  </VTextField>
                </VCol>
                <VCol
                  class="d-flex justify-center align-center"
                  cols="6"
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
                </VCol>
              </VRow>
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              colspan="4"
              class="py-0"
            >
              5. Check Seal No.ที่รถส่งของ 
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <div class="text-center py-0">
                Seal ล็อกวาล์วไม่ขาดตรงตามใบส่ง
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
          
          <!-- ก่อนการปฏิบัติงาน -->
          <tr style="font-size: 14px;">
            <th
              rowspan="6"
              class="py-0 text-center"
              colspan="1"
            >
              ก่อนการปฏิบัติงาน 
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              1. หยุดรถและดับเครื่องเรียบร้อย
            </th>
            <th
              class="text-center py-0"
              colspan="4"
            >
              รถต้องหยุดนิ่งสนิท
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
              2. เอาหมอนรองล้อรถเรียบร้อย
            </th>
            <th
              class="text-center py-0"
              colspan="4"
            >
              รองล้อรถทั่งด้านหน้าและด้านหลัง
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
              3. ต่อสายกราวน์เรียบร้อย
            </th>
            <th
              class="text-center py-0"
              colspan="4"
            >
              ต่อสายกราวน์บริเวณที่โหลดเข้ากับรถ
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
              4. เก็บตัวอย่าง ส่ง Inspection เรียบร้อย
            </th>
            <th
              class="text-center py-0"
              colspan="4"
            >
              1 ขวดแก้วใหญ่ด้านบนรถ
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
              5. นำลูกกุญแจมาเปิดล็อกวาล์ว 29จากหัวหน้างาน
            </th>
            <th
              class="text-center py-0"
              colspan="4"
            >
              กุญแจ EP-400BE
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
              6. Moisture เท่าไหร่
            </th>
            <th
              class="text-center py-0"
              colspan="4"
            >
              0.05 Max
            </th>
            <th
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
                    <template #append>
                      <span>%</span>
                    </template>
                  </VTextField>
                </VCol>
                <VCol
                  class="d-flex justify-center align-center"
                  cols="6"
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
                </VCol>
              </VRow>
            </th>
          </tr>

          <!-- Line setting -->
          <tr style="font-size: 14px;">
            <th
              class="py-0 text-center"
              colspan="1"
              rowspan="3"
            >
              <div>Line setting</div>
              <div>
                หัวถัง 11V-144
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              1. วาล์ว 1, 2,3,4,5,19
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              Open ( เปิด )
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
              2. วาล์ว 6,7,8,9
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              Close ( ปิด )
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
              3. Temperature เท่าไหร่
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              อุณหภูมิต้องไม่สูงกว่า  35 C' 
            </th>
            <th
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
                    <template #append>
                      <span>C"</span>
                    </template>
                  </VTextField>
                </VCol>
                <VCol
                  class="d-flex justify-center align-center"
                  cols="6"
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
                </VCol>
              </VRow>
            </th>
          </tr>

          <!-- Operator -->
          <tr style="font-size: 14px;">
            <th
              class="py-0 text-center"
              colspan="1"
              rowspan="5"
            >
              <div>
                Operator
              </div>
              <div>
                ทำการสวมใส่อุปกรณ์ PPE 
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              - ถุงมือ
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ใส่ถุงมือยาง
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
              - แว่น safety
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ต้องเป็นแว่น safety เท่านั้น
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
              - ผ้าปิดจมูกคาร์บอนสีเขียว
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ใส่ให้ถูกวิธี
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
              - เข็มขัดนิรภัย
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ใช้เฉพาะตัวกรองสีดำ
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
              - ชุดป้องกันสารเคมี
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ใส่ทั้งเสื้อและกางเกงแล้ว
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

          <!-- Lorry tank -->
          <tr style="font-size: 14px;">
            <th
              class="py-0 text-center"
              colspan="1"
              rowspan="3"
            >
              <div>
                Lorry tank
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              1. วาล์ว 18,21,24,25,26,27,28,29
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              Close ( ปิด )
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
              2. ต่อสายHose   เข้ากับ Valve 29 แล้วต่อเข้ากับ Valve ตูดถังของ ISO Container
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
              3. เปิดวาล์วระบายอากาศบนหัวถัง ISO Container
            </th>
            <th
              class="py-0 text-center"
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

          <!-- Charging -->
          <tr style="font-size: 14px;">
            <th
              class="py-0 text-center"
              colspan="1"
              rowspan="8"
            >
              <div>
                Charging
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              1. เปิดวาล์ว 22
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              Open ( เปิด )
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
              2. เลือกโหมด Manual ที่ตู้สวิตท์ 11P-145
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              บิด switch ไปที่โหมด Manual
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
              3. หน้าจอ DCS ตรง SELECTION TO ให้เลือกถัง 11V-144 แล้วเปิดวาล์ว XV-11FT145
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              วงกลมสีแดงไปอยู่ที่ตำแหน่งถัง 11V-144
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <VRow>
                <VCol cols="12">
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
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              4. ทำการเปิดวาล์ว XV-11FT145
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              วาล์ว XV-11FT145 เปลี่ยนจากสีเขียวเป็นสีแดง
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <VRow>
                <VCol cols="12">
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
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              5. เปิดวาล์วที่ตูด ISO Container 
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              Open ( เปิด )
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
              6. ค่อยๆเปิดวาล์ว 25 เพื่อทำการให้ปั้มทำงาน 
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              Open ( เปิด )
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
              7. เปิดวาล์ว 29  
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              Open ( เปิด ) เวลาเริ่มโหลดสินค้า......................
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
              8. ในกรณีที่ระดับของเหลวในถัง11V-144 สูงไม่สามารถรับได้ให้สลับไป Charging เข้าสู่ถัง 11V-145
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ต้องไม่เกิน 2130 mm.หรือ 22,835 kg.
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

          <!-- เมื่อรับเสร็จ -->
          <tr style="font-size: 14px;">
            <th
              class="py-0 text-center"
              colspan="1"
              rowspan="12"
            >
              <div>
                เมื่อรับเสร็จ
              </div>
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              1. เมื่อมั่นใจว่าของเหลวใน ISO Container หมดแล้วให้ทำการปิดวาล์วที่ตูดถัง ISO Container
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              Close ( ปิด )
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
              2. ถอดสาย Hose ที่ต่อกับวาล์วตูดถัง ISO Container ออกโดยที่ปั้มยังทำงานอยู่เพื่อให้ดูดของเหลวที่ค้างอยู่ในสายจนหมด
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ยกสายเพื่อทำการไล่ของเหลวในสายจนหมด(โดยดูจาก pressure gauge)
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
              3. ปิดวาล์ว 25 เพื่อทำการหยุดปั้ม
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              Close ( ปิด )
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
            </th>
          </tr>
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="4"
            >
              4. ปิดวาล์ว 29 
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              Close ( ปิด ) เวลาโหลดสินค้าเสร็จ...............................
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
              5. เปิดวาล์ว 28 เพื่อทำการไล่ของเหลวที่ค้างในท่อให้เข้าไปในถัง 11V-144  จนหมดแล้วจึงทำการปิด
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ทำการไล่ของเหลวในท่อจนหมด(โดยดูจาก pressure gauge)แล้วจึงทำการปิด
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
              6.ปิดวาล์ว 22,19,1
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              Close ( ปิด )
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
              7.ปิดวาล์วระบายอากาศบนหัวถัง ISO Container
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ด้านบนถัง ISO Container
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
              8.ปิดวาล์ว 24 ที่หน้าจอ DCS
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              วาล์ว XV-11FT145 เปลี่ยนจากสีแดงเป็นสีเขียว
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
              9. อ่าน Level ที่ถัง11V-144 ทำการ Record 
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              Actual  Check
            </th>
            <th
              class="py-0"
              colspan="4"
            >
              <VRow>
                <VCol cols="12">
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
                      <span>mm.</span>
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
              10. Check level DCS ได้เท่าไหร่
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              Actual  Check
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
                <template #prepend>
                  <span />
                </template>
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
              11. ส่วนต่างระหว่าง ก่อนการรับ และหลังรับ จำนวนกี่กีโลกรัม
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              ต้องไม่ต่างกันมากจากการคำนวน
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
                <template #prepend>
                  <span />
                </template>
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
              12. หลังจากโหลดเสร็จล็อกวาล์ว 29 คืนกุญแจ และให้หัวหน้างานให้Checkซ้ำ
            </th>
            <th
              class="py-0 text-center"
              colspan="4"
            >
              Lock valve
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
    </VRow>
  </div>

  <!-- Footer -->
  <VRow>
    <VCol cols="12">
      <table class="custom-table">
        <tr>
          <th colspan="3" />
          <th
            class="text-center bg-perfect-scrollbar-thumb"
            colspan="3"
          >
            DCS  
          </th>
          <th
            class="text-center bg-perfect-scrollbar-thumb"
            colspan="3"
          >
            TANK
          </th>
          <th colspan="3" />
        </tr>
        <tr>
          <th
            class="bg-perfect-scrollbar-thumb"
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
            class="bg-perfect-scrollbar-thumb"
            colspan="3"
          >
            Ltr
          </th>
        </tr>
        <tr>
          <th
            class="bg-perfect-scrollbar-thumb"
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
            class="bg-perfect-scrollbar-thumb"
            colspan="3"
          >
            Ltr
          </th>
        </tr>
        <tr>
          <th
            class="bg-perfect-scrollbar-thumb"
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
            class="bg-perfect-scrollbar-thumb"
            colspan="3"
          >
            Ltr
          </th>
        </tr>
      </table>
    </VCol>
  </VRow>

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
