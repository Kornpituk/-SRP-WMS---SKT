<script setup>
const vasss = ref('dd')


import image01 from '@/views/skt/inv/lorryLoading/checkList/CAPOLACTUM 1.png'
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
                  CAPOLACTUM ( KARAMU MERUTO ) 21V-306
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
          <!-- 1 -->
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="1"
              rowspan="6"
            >
              <u class="text-decoration-underline">ข้อควรระวัง</u>
            </th>
            <td
              class="py-0"
              colspan="4"
            >
              : หากมีงาน Hot work or Fire work ใกล้เคียง ให้แจ้งหัวหน้างานให้หยุดชั่วคราว
            </td>
            <td
              class="py-0"
              colspan="2"
            />
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              : ให้ <u>ปิด</u> โทรศัพท์ขณะ Loading สาร
            </td>
            <td
              class="py-0"
              colspan="2"
            />
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              : หากมี สาร หยดลงพื้น ให้ใช้ผ้า หรือ ตัวดูดซับ <span style="font-size: 16px; font-weight: 900;">ห้ามใช้น้ำล้าง</span>
            </td>
            <td
              class="py-0"
              colspan="2"
            />
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
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
              class="py-0"
              colspan="2"
            />
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
        
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              : แจ้ง Leader Production TP-3 เพื่อตรวจสอบว่าไม่มีการใช้งานขณะที่กำลังจะ loading สาร
            </td>
            <td
              class="py-0"
              colspan="2"
            />
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              : Check ถังดับเพลิงประเภท เคมีแห้ง ว่าพร้อมใช้งาน
            </td>
            <td
              class="py-0"
              colspan="2"
            />
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <!-- End 1 -->
          <!-- 3 -->
          <tr style="font-size: 14px;">
            <th
              colspan="1"
              rowspan="5"
              class="py-0"
            >
              รายการที่ต้องตรวจสอบ
            </th>
            <td
              colspan="4"
              class="py-0"
            >
              1. จำนวนที่ระบุ ในใบส่งสินค้า
            </td>
            <td
              class="py-0"
              colspan="2"
            >
              <div class="text-center py-0">
                ตามเอกสารใบส่ง
              </div>
            </td>
            <td
              colspan="5"
              class="text-center py-0"
            >
              <VTextField
                :style="{ width: '150px', maxWidth: '300px' }"
                class="py-3"
                density="compact"
              >
                <template #label>
                  <span>(A)</span>
                </template>

                <template #append-inner>
                  <span>Kg</span>
                </template>
              </VTextField>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="text-start py-0"
              colspan="4"
            >
              2. Level ที่อ่านได้จาก Tank 21V-306 ก่อนรับ
            </td>
            <td
              class="text-center py-0"
              colspan="2"
            >
              ต้องไม่เกิน….....kg
            </td>
            <td
              class="text-center py-0"
              colspan="5"
            >
              <VTextField
                class="py-3"
                density="compact"
                :style="{ width: '150px', maxWidth: '300px' }"
              >
                <template #label>
                  <span>(B)DCS</span>
                </template>

                <template #append-inner>
                  <span>kg</span>
                </template>
              </VTextField>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              3. ตรวจสอบว่าปริมาณหลังจากรับไม่เกินความจุถัง
            </td>
            <td
              class="text-center py-0"
              colspan="2"
            >
              ต้องไม่เกิน…...kg
            </td>
            <td
              class="py-0"
              colspan="5"
            >
              <VRow>
                <VCol
                  cols="6"
                  class="py-3 text-center d-flex align-center justify-end"
                >
                  <VTextField
                    :style="{ width: '150px', maxWidth: '300px' }"
                    class="py-3"
                    density="compact"
                  >
                    <template #label>
                      <span>(A)</span>
                    </template>

                    <template #append-inner>
                      <span>Kg</span>
                    </template>
                  </VTextField>
                </VCol>
                <VCol
                  cols="6"
                  class="py-3 text-center d-flex align-center"
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
                          NO
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
              4. Check Seal No.ที่รถส่งของ
            </td>
            <td
              class="text-center py-0"
              colspan="2"
            >
              Seal ล็อกวาล์วไม่ขาดตรงตามใบส่ง
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              5. ตรวจสอบอุณหภูมิของรถ ISO container
            </td>
            <td
              class="text-center py-0"
              colspan="2"
            >
              ต้องอยู่ระหว่าง 60-90 องศาเซลเซียส
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <!-- End 3 -->
          <!-- 3 -->

          <!-- New -->
          <tr style="font-size: 14px;">
            <th
              rowspan="11"
              class="py-0"
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
              colspan="2"
            >
              รถต้องหยุดนิ่งสนิท
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
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
              colspan="2"
            >
              รองล้อรถทั่งด้านหน้าและด้านหลัง
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
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
              colspan="2"
            >
              ต่อสายกราวน์บริเวณที่โหลดเข้ากับรถ
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              4. ต่อสาย Hose line nitrogen เข้ากับท่อ line vent จากรถ ISO container 
            </td>
            <td
              class="text-center py-0"
              colspan="2"
            >
              ต่อสายHose line nitrogen
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              5. สวมข้อต่อเข้ากับเข้ากับท่อโหลดที่มากับรถ ISO container
            </td>
            <td
              class="text-center py-0"
              colspan="2"
            >
              สวมข้อต่อเข้ากับ ISO container
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              แล้วทำการทดสอบการรั่วโดยการอัดไนดตรเจนเข้าที่ความดัน 0.25 Mpa
            </td>
            <td
              class="text-center py-0"
              colspan="2"
            >
              ทำการเช็ครอยรั่ว
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              6. ต่อสาย Hose line load   จาก 21P-101 เข้ากับท่อโหลดจากรถ ISO container  แล้วทำการทดสอบการรั่วของข้อต่อ 
            </td>
            <td
              class="text-center py-0"
              colspan="2"
            >
              ต่อสายHose line loading
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
        
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              7. ต่อ line steam เพื่อให้ความร้อนแก่ท่อด้านในของ ISO container จนถึงท่อ line load ของ 21P-101 
            </td>
            <td
              class="text-center py-0"
              colspan="2"
            >
              ต่อสายHose line steam
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              8. เปิด valve steam ให้ความร้อนจนกว่า bottom valve ของ ISO container จะเปิดได้
            </td>
            <td
              class="text-center py-0"
              colspan="2"
            >
              เปิด valve steam
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              9. ทำการทดสอบความดันใน ISO container จนถึงวาล์วสุดท้ายของ ISO container โดยการอัดไนโตรเจนเข้าที่ความดัน 0.20 Mpa และเก็บเป็นเวลา 5 นาที
            </td>
            <td
              class="text-center py-0"
              colspan="2"
            >
              อัดไนโตรเจนเข้าที่ความดัน 0.20 Mpa และเก็บเป็นเวลา  นาที
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              10.ตรวจสอบความดันในถังถ้าลดลงต่ำกว่า 0.19 Mpa ให้ทำการตรวจสอบหารอยรั่วจนกว่าจะหายรั่ว แต่ถ้าความดันลดลงไม่เกิน0.19 Mpa ให้ทำขั้นตอนต่อไป
            </td>
            <td
              class="text-center py-0"
              colspan="2"
            >
              ลดลงไม่เกิน 0.19 Mpa
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <!-- End 3 -->
          <!-- 4 -->
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="1"
              rowspan="4"
            >
              ทำการสวมใส่อุปกรณ์PPE
            </td>
            <td
              class="py-0"
              colspan="4"
            >
              1.ถุงมือทนความร้อน
            </td>
            <td
              class="py-0 text-center"
              colspan="2"
            >
              สวมถุงมือขณะปฏิบัติงาน
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              2.แว่น safety
            </td>
            <td
              class="py-0 text-center"
              colspan="2"
            >
              สวมแว่นตาขณะปฏิบัติงาน
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              3.ผ้ากันเปื้อน
            </td>
            <td
              class="py-0 text-center"
              colspan="2"
            >
              สวมผ้ากันเปื้อนขณะปฏิบัติงาน
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              4.Harness แบบเต็มตัว
            </td>
            <td
              class="py-0 text-center"
              colspan="2"
            >
              สวม harness ขณะปฏิบัติงานบนที่สูง
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <!-- End 4 -->
          <!-- 4 -->
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="1"
              rowspan="10"
            >
              ขณะทำการ loading to 21V-306
            </th>
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                1.ทำการเปิดไนโตรเจนเข้าไปไน ISO container
              </div>
            </td>
            <td colspan="2">
              ทำการเปิดวาล์วค้างไว้
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                2.เปิดระบบควบคุมที่ DCS
              </div>
            </td>
            <td colspan="2">
              เปิดที่ DCS
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                3. ค่อยๆเปิดวาล์วตูดถังของ ISO container
              </div>
            </td>
            <td colspan="2">
              ระวังความดันตอนเปิดวาล์ว
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                4.ทำการตรวจสอบที่ side glass ว่ามีของมาหรือเปล่า
              </div>
            </td>
            <td colspan="2">
              ตรวจสอบด้วยสายตา
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                5.เปิดวาล์วจาก 21P-101 ไปที่ 21V-306
              </div>
            </td>
            <td colspan="2">
              ทำการยืนยันว่าเปิดทั้งหมด
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                6.ทำการ start pump 21P-101 ที่หน้างานชั้น 1
              </div>
            </td>
            <td colspan="2">
              สตาร์ทที่ Panel ตรงปั้มชั้น 1
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                7. ทำการตรวจสอบความดันในท่อโดยความดันจะอยู่ประมาณ 0.4 Mpa
              </div>
            </td>
            <td colspan="2">
              ความดันอยู่ประมาณ 0.4 Mpa
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                8. ทำการตรวจสอบแอมมิเตอร์ของปั้ม อยู่ประมาณ 14.2 Amp.
              </div>
            </td>
            <td colspan="2">
              แอม์มิเตอร์ที่ Panel อยู่ประมาณ 14.2 Amp
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                9. ทำการตรวจสอบการอัตราการไหล
              </div>
            </td>
            <td colspan="2">
              ตรวจสอบที่ side glass
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                10. ทำการตรวจสอบการทำงานของปั้ม
              </div>
            </td>
            <td colspan="2">
              โชว์สถาณะสีเขียว
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <!-- End 4 -->
          <!-- 6 -->
          <tr style="font-size: 14px;">
            <th
              class="py-0"
              colspan="1"
              rowspan="16"
            >
              เสร็จสิ้นการ loading
            </th>
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                1. เมื่ออัตราการไหลต่ำ ให้ทำการหยุดปั๊ม และทำการสตาร์ทปั้มอีกรอบจนกว่าจะแน่ใจว่าไม่มีของเหลวคงค้างในท่อ
              </div>
            </td>
            <td
              class="py-0"
              colspan="2"
            >
              <div class="text-center py-3">
                หยุดปั้ม ที่ Panel ตรงปั้มชั้น 1
              </div>
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                3. ปิดไนโตรเจนสำหรับ ISO container
              </div>
            </td>
            <td
              class="py-0"
              colspan="4"
            >
              <div class="text-center py-3">
                ตรวจเช็คว่า valve ปิดจริง
              </div>
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                3. ปิดวาล์วตูดถังของ ISO container
              </div>
            </td>
            <td
              class="py-0"
              colspan="2"
            >
              <div class="text-center py-3">
                ตรวจเช็คว่า valve ปิดจริง
              </div>
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                4. เปิดไนโตรเจนไล่ของเหลวที่อยู่ในท่อตั้งหน้าปั้ม 21P-101 จนถึง 21V-306
              </div>
            </td>
            <td
              class="py-0"
              colspan="2"
            >
              <div class="text-center py-3">
                ตรวจสอบที่ side glass ว่าไม่มีของเหลวเหลืออยู่
              </div>
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3 px-4">
                โดยให้ทำการตรวจสอบที่ side glass จนกว่าไม่มีของไหลแล้วจึงทำการปิดวาล์วไนโตรเจน
              </div>
            </td>
            <td
              class="py-0"
              colspan="5"
            >
              <div class="text-center py-3">
                ตรวจเช็คว่า valve ปิดจริง
              </div>
            </td>
            <td
              class="py-0"
              colspan="2"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                5.ต่อสายไนโตรเจนเข้ากับวาล์วหมายเลข9แล้วเปิดไนโตรเจนไล่ของเหลวที่อยู่ใน สาย hose  จนถึง 21V-306 
              </div>
            </td>
            <td
              class="py-0"
              colspan="2"
            >
              <div class="text-center py-3">
                ตรวจสอบที่ side glass ว่าไม่มีของเหลวตกค้าง
              </div>
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3 px-4">
                โดยให้ทำการตรวจสอบที่ side glass จนกว่าไม่มีของไหล
              </div>
            </td>
            <td
              class="py-0"
              colspan="2"
            >
              <div class="text-center py-3" />
            </td>
            <td
              class="py-0"
              colspan="5"
            />
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                6.ปิดวาล์วแล้วทำการถอดสายไนโตรเจนออกจากวาล์วหมายเลข 9
              </div>
            </td>
            <td
              class="py-0"
              colspan="2"
            >
              <div class="text-center py-3">
                ตรวจเช็คว่า valve ปิดจริง
              </div>
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                7.ปิดวาล์ว steam ให้ความร้อนแก่ สาย hose ที่เชื่อมต่อกับ ISO container และเก็บอุปกรณ์
              </div>
            </td>
            <td
              class="py-0"
              colspan="2"
            >
              <div class="text-center py-3">
                ตรวจเช็คว่า valve ปิดจริง
              </div>
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                8.ถอดสาย hose จาก ISO container ไปต่อกับ line ไนโตรเจน
              </div>
            </td>
            <td
              class="py-0"
              colspan="2"
            >
              <div class="text-center py-3">
                ตรวจเช็คว่าทำการต่อถุกต้อง
              </div>
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                9. ทำการเปิดไนโตรเจนไล่ของเหลวที่ค้างอยู่ในสาย hose และใน line ท่อ ให้หมดเพื่อป้องกันการอุดตัน
              </div>
            </td>
            <td
              class="py-0"
              colspan="2"
            >
              <div class="text-center py-3">
                ตรวจสอบที่ side glass ว่าไม่มีของเหลวตกค้าง
              </div>
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                10. หลังจากตรวจสอบแล้วว่าไม่มีของเหลวค้างภายในท่อให้ทำการปิดไนโตรเจนและปิดวาล์วที่ขึ้นไป 21V-306
              </div>
            </td>
            <td
              class="py-0"
              colspan="2"
            >
              <div class="text-center py-3">
                ตรวจเช็คว่า valve ปิดจริง
              </div>
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                11. ถอดสายดินที่ต่อกับรถออก
              </div>
            </td>
            <td
              class="py-0"
              colspan="2"
            >
              <div class="text-center py-3">
                ถอดออกและเก็บเข้าที่
              </div>
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                12.ปิดระบบควบคุมที่ DCS 
              </div>
            </td>
            <td
              class="py-0"
              colspan="2"
            >
              <div class="text-center py-3">
                ตรวจเช็คว่าของจริงว่าปิด
              </div>
            </td>
            <td
              class="py-0"
              colspan="5"
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
                      NO
                    </div>
                  </template>
                </VRadio>
              </VRadioGroup>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                13.ตรวจสอบระดับของเหลวใน 21V-306 
              </div>
            </td>
            <td
              class="py-0"
              colspan="2"
            >
              <div class="text-center py-3">
                ตรวจเช็คที่ DCS
              </div>
            </td>
            <td
              class="py-3"
              colspan="5"
            >
              <VTextField density="compact">
                <template #label>
                  <span>(C)DCS</span>
                </template>

                <template #append-inner>
                  <span>Kg</span>
                </template>
              </VTextField>
            </td>
          </tr>
          <tr style="font-size: 14px;">
            <td
              class="py-0"
              colspan="4"
            >
              <div class="py-3">
                14.ทำการจดบันทึกค่าที่ต่างกันหลังจากรับ
              </div>
            </td>
            <td
              class="py-0"
              colspan="2"
            >
              <div class="text-center py-3">
                ต้องไม่ต่างจากที่คำนวนไม่เกิน...........kg
              </div>
            </td>
            <td
              class="py-3"
              colspan="5"
            >
              <VTextField density="compact">
                <template #label>
                  <span>(C)-(B)</span>
                </template>

                <template #append-inner>
                  <span>Kg</span>
                </template>
              </VTextField>
            </td>
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

.custom-table td {
  font-weight: 400;
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
</style>
