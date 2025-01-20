<script setup>
const vasss = ref('dd')
import image02 from '@/views/skt/resale/ibc/img/02.png'
import img01 from '@/views/skt/shipping/resale/Flexi/img/01.png'
import img02 from '@/views/skt/shipping/resale/Flexi/img/02.png'
import img03 from '@/views/skt/shipping/resale/Flexi/img/03.png'
import img04 from '@/views/skt/shipping/resale/Flexi/img/04.png'

import img05 from '@/views/skt/resale/flexible/img/01.png'
import img06 from '@/views/skt/resale/flexible/img/02.png'
import img07 from '@/views/skt/resale/flexible/img/03.png'
import img08 from '@/views/skt/resale/flexible/img/04.png'
import img09 from '@/views/skt/resale/flexible/img/05.png'

//-------------------------- Section Switch Flexi / Lorry ----------------
const typeResalse = ref('Flexi')

const TitleResalse = ref('Filling Direction & Report to FLEXI')

const imagePictureFlexi = ref([img01, img02, img03, img04])

const imagePictureLorry = ref([img05, img06, img07, img08, img09])
</script>

<template>
  <VRow>
    <div>
      <div style="position: fixed;">
        <VBtn
          :to="{ name: 'skt-shipping',
          }"
          class="mx-2 my-4"
          size="40"
      
          icon
        >
          <VIcon
            size="40"
            icon="ri-arrow-left-s-line"
          />
        </VBtn>
      </div>
    </div>

    
    <VCol cols="12">
      <div
        class="text-center d-flex justify-center align-center"
        style="font-weight: bold;"
      >
        <div class="d-flex justify-end" />
      </div>
    </VCol>


    <VCol
      class="text-center d-flex justify-center align-center"
      cols="10"
    >
      <span
        v-if="typeResalse ==='Flexi'"
        style="font-weight: bold;"
      >Filling Direction & Report to FLEXI</span>
      <span
        v-if="typeResalse ==='Lorry'"
        style="font-weight: bold;"
      >Filling Direction & Report to Lorry</span>
    </VCol>
    <VCol
      class="text-center d-flex justify-end align-center"
      cols="2"
    >
      <VBtn
        :variant="typeResalse === 'Lorry' ? 'tonal' : 'flat'"
        @click="typeResalse = 'Flexi'"
      >
        Flexi
      </VBtn>
      <VBtn
        :variant="typeResalse === 'Flexi' ? 'tonal' : 'flat'"
        @click="typeResalse = 'Lorry'"
      >
        Lorry
      </VBtn>
    </VCol>


    <VCol cols="12">
      <table class="custom-table">
        <tr v-if="false">
          <th
            colspan="12"
            class="text-center"
          >
            Filling Direction & Report to FLEXI
          </th>
        </tr>
        <tr>
          <th
            colspan="4"
            class="text-center"
          >
            <span>Customer Name: </span><span class="font-weight-body">FMT /SINGBURI,SO1100077656</span>
          </th>
          <th
            colspan="4"
            class="text-center"
          >
            <span>Delivery Place: </span><span class="font-weight-body">10-04-2024</span>
          </th>
          <th
            colspan="4"
            class="text-center"
          >
            <span> Weight: </span><span class="font-weight-body">12,500</span><span> Kg.</span>
          </th>
        </tr>
        <tr v-if="false">
          <th
            colspan="4"
            class="text-center "
          >
            Date of Issue :  10-04-2024
          </th>
          <th
            colspan="2"
            class="text-center "
          >
            Issued By
          </th>
          <th
            colspan="2"
            class="text-center "
          >
            Checked By
          </th>
          <th
            colspan="4"
            class="text-center "
          >
            Approved By
          </th>
        </tr>
        <tr>
          <th
            colspan="2"
            class="text-center "
          >
            <span>Item Name</span>
          </th>
          <th
            colspan="10"
            class="text-center "
          >
            <span class="font-weight-body">F-190</span>
          </th>
        </tr>
        <tr>
          <th
            colspan="2"
            class="text-center "
          >
            Lot No.
          </th>
          <th
            colspan="2"
            class="text-center "
          >
            <span class="font-weight-body">PA24020033</span>
          </th>
          <td
            colspan="8"
            class="text-center "
          >
            <span>Mix Lot no.PA24020032 = 8 IBC + PA24030012 = 8 IBC</span>
          </td>
        </tr>
      </table>
    </VCol>

    <VCol cols="12">
      <table class="custom-table">
        <tr>
          <th
            colspan="1"
            rowspan="3"
            class="text-center "
          >
            Strainer Type
          </th>
          <th
            colspan="2"
            class="text-center "
          >
            <span class="font-weight-body">Mesh</span>
          </th>
          <th
            colspan="6"
            class="text-center "
          >
            <span class="font-weight-body">80&nbsp;&nbsp;&nbsp;100&nbsp;&nbsp;&nbsp;120&nbsp;&nbsp;&nbsp;150&nbsp;&nbsp;&nbsp;200&nbsp;&nbsp;&nbsp;300</span>
          </th>
          <th
            colspan="3"
            class="text-center "
          >
            <div class="checkbox-container">
              <VRow>
                <VCol
                  cols="6"
                  class="d-flex justify-center align-center"
                >
                  <VCheckbox /><span class="font-weight-body">YES</span>
                </VCol>
                <VCol
                  cols="6"
                  class="d-flex justify-center align-center"
                >
                  <VCheckbox /><span class="font-weight-body">NO</span>
                </VCol>
              </VRow>
            </div>
          </th>
        </tr>
        <tr>
          <th
            colspan="2"
            class="text-center "
          >
            <span class="font-weight-body">Material</span>
          </th>
          <th
            colspan="6"
            class="text-center "
          >
            <span class="font-weight-body">VESEL……….    LOT NO.…PA24020033</span>
          </th>
          <th
            colspan="3"
            class="text-center "
          >
            <div class="checkbox-container">
              <VRow>
                <VCol
                  cols="6"
                  class="d-flex justify-center align-center"
                >
                  <VCheckbox /><span class="font-weight-body">YES</span>
                </VCol>
                <VCol
                  cols="6"
                  class="d-flex justify-center align-center"
                >
                  <VCheckbox /><span class="font-weight-body">NO</span>
                </VCol>
              </VRow>
            </div>
          </th>
        </tr>
        <tr>
          <th
            colspan="2"
            class="text-center "
          >
            <span class="font-weight-body">Bag Filter</span>
          </th>
          <th
            colspan="5"
            class="text-start"
          >
            <div class="d-flex justify-center">
              <span class="font-weight-body">Cotton( Pieces)</span>
            </div>
          </th>
          <th
            colspan="1"
            class="text-end "
          >
            <span class="end">
              <div class="d-flex justify-center">
                <span class="font-weight-body">Flannel( pieces)</span>
              </div>
            </span>
          </th>
          <th
            colspan="3"
            class="text-center "
          >
            <div class="checkbox-container">
              <VRow>
                <VCol
                  cols="6"
                  class="d-flex justify-center align-center"
                >
                  <VCheckbox /><span class="font-weight-body">YES</span>
                </VCol>
                <VCol
                  cols="6"
                  class="d-flex justify-center align-center"
                >
                  <VCheckbox /><span class="font-weight-body">NO</span>
                </VCol>
              </VRow>
            </div>
          </th>
        </tr>
      </table>
    </VCol>

    <VCol cols="12">
      <table class="custom-table">
        <tr>
          <th colspan="1">
            Filling Valve Open
          </th>
          <th colspan="5">
            Filling Line Valve Open
          </th>
          <th colspan="4">
            <div class="d-flex justify-space-between align-center">
              Checked By <VTextField
                class="mx-2"
                density="compact"
              />
            </div>
          </th>
        </tr>
        <tr>
          <th
            colspan="1"
            class="text-start "
          >
            Filling Equipment
          </th>
          <th
            colspan="11"
            rowspan="2"
            class="text-center "
          >
            <div class="d-flex">
              <VTextField
                density="compact"
                variant="outlined"
                @click:append-inner="visible = !visible"
              />
            </div>
          </th>
        </tr>
        <tr>
          <th
            colspan="1"
            class="text-start "
          >
            (Filling Order)
          </th>
        </tr>
        <tr>
          <th
            colspan="1"
            class="text-start "
          >
            Lot No.(Actual)
          </th>
          <th
            colspan="11"
            class="text-center "
          >
            <div>
              <VTextField
                density="compact"
                variant="outlined"
                @click:append-inner="visible = !visible"
              />
            </div>
          </th>
        </tr>
        <tr>
          <th
            colspan="1"
            class="text-start "
          >
            Container
          </th>
          <th
            colspan="11"
            class="text-center "
          >
            <div>
              <VTextField
                density="compact"
                variant="outlined"
                @click:append-inner="visible = !visible"
              />
            </div>
          </th>
        </tr>
        <tr>
          <th
            colspan="1"
            class="text-start "
          >
            Net 
          </th>
          <th
            colspan="11"
            class="text-center "
          >
            <div Class="d-flex">
              <VTextField
                density="compact"
                variant="outlined"
                suffix="Kg."
              />
            </div>
          </th>
        </tr>
        <tr>
          <th
            colspan="1"
            class="text-start "
          >
            Point of Delivery
          </th>
          <th
            colspan="11"
            class="text-center "
          >
            <div class="checkbox-container">
              <VRow>
                <VCol
                  class="d-flex justify-center align-center"
                  cols="6"
                >
                  <VCheckbox />Export
                </VCol>
                <VCol
                  class="d-flex justify-center align-center"
                  cols="6"
                >
                  <VCheckbox />Domestic
                </VCol>
              </VRow>
            </div>
          </th>
        </tr>
        <tr>
          <th
            colspan="1"
            class="text-start "
          />
          <th
            colspan="5"
            class="text-center "
          >
            <VRow>
              <VCol
                cols="3"
                class="d-flex align-center"
              >
                Start Time
              </VCol>
              <VCol cols="9">
                <AppDateTimePicker
                  v-model="date"
                  placeholder="Select time"
                  :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }"
                  density="compact"
                />
              </VCol>
            </VRow>
          </th>
          <th
            colspan="5"
            class="text-center "
          >
            <VRow>
              <VCol
                cols="3"
                class="d-flex align-center"
              >
                Finished Time
              </VCol>
              <VCol cols="9">
                <AppDateTimePicker
                  v-model="date"
                  placeholder="Select time"
                  :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }"
                  density="compact"
                />
              </VCol>
            </VRow>
          </th>
        </tr>

        <tr>
          <th
            colspan="1"
            class="text-center "
          >
            Filling Check
          </th>
          <th
            colspan="5"
            class="text-center "
          >
            Appearance
          </th>
          <th
            colspan="3"
            class="text-center "
          >
            Time Date
          </th>
          <th
            colspan="3"
            class="text-center "
          >
            Person Incharge
          </th>
        </tr>

        <tr>
          <th
            class="text-center "
            colspan="1"
          >
            Analysis Result
          </th>
          <th
            class="text-center "
            colspan="1"
          >
            Before
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
          <th
            class="text-center "
            colspan="2"
          >
            <AppDateTimePicker
              v-model="date"
              placeholder="Select date and time"
              :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
              density="compact"
            />
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
        </tr>
        <tr>
          <th
            class="text-center "
            colspan="1"
          >
            <span>
              1<sup>st</sup>  Sampling
            </span>
          </th>
          <th
            class="text-center "
            colspan="1"
          >
            Start
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
          <th
            class="text-center "
            colspan="2"
          >
            <AppDateTimePicker
              v-model="date"
              placeholder="Select date and time"
              :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
              density="compact"
            />
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
        </tr>
        <tr>
          <th
            class="text-center "
            colspan="1"
          >
            <span>
              2<sup>nd</sup>  Sampling
            </span>
          </th>
          <th
            class="text-center "
            colspan="1"
          >
            Middle
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
          <th
            class="text-center "
            colspan="2"
          >
            <AppDateTimePicker
              v-model="date"
              placeholder="Select date and time"
              :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
              density="compact"
            />
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
        </tr>
        <tr>
          <th
            class="text-center "
            colspan="1"
          >
            <span>
              3<sup>rd</sup>  Sampling
            </span>
          </th>
          <th
            class="text-center "
            colspan="1"
          >
            Final
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
          <th
            class="text-center "
            colspan="2"
          >
            <AppDateTimePicker
              v-model="date"
              placeholder="Select date and time"
              :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
              density="compact"
            />
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
        </tr>
        <tr>
          <th
            class="text-center "
            colspan="1"
          >
            <span>
              4<sup>th</sup>  Sampling
            </span>
          </th>
          <th
            class="text-center "
            colspan="1"
          >
            In Lorry
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
          <th
            class="text-center "
            colspan="2"
          >
            <AppDateTimePicker
              v-model="date"
              placeholder="Select date and time"
              :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
              density="compact"
            />
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
        </tr>
      </table>
    </VCol>
    
    <VCol cols="12">
      <table class="custom-table">
        <thead>
          <tr>
            <th
              class="text-center "
              colspan="6"
            >
              Picture
            </th>
            <th
              class="text-center "
              colspan="6"
            >
              <div class="d-flex justify-space-between align-center">
                Seal No. <VTextField
                  class="mx-2"
                  density="compact"
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody v-if="typeResalse === 'Flexi'">
          <tr
            v-for="(image, index) in imagePictureFlexi"
            :key="index"
          >
            <td
              style="min-width: 410px;"
              colspan="6"
            >
              <VImg :src="image" />
            </td>
            <td colspan="6">
              <div class="d-flex justify-center">
                <VRow>
                  <VCol cols="12">
                    <div
                      v-if="index === 0"
                      class="d-flex justify-center"
                    >
                      Already Cleaned
                    </div>
                    <div
                      v-if="index === 1"
                      class="d-flex justify-center"
                    >
                      Shipping Mark and Valve
                    </div>
                    <div
                      v-if="index === 2"
                      class="d-flex justify-center"
                    >
                      Inside Tank
                    </div>
                    <div
                      v-if="index === 3"
                      class="d-flex justify-center"
                    >
                      Cleaning Hose and Air Blow
                    </div>
                  </VCol>
                  <VCol
                    cols="6"
                    class="d-flex justify-center align-center"
                  >
                    <VCheckbox class="px-10">
                      <template #label>
                        <span class="font-size">YES</span>
                      </template>
                    </VCheckbox>
                  </VCol>
                  <VCol
                    cols="6"
                    class="d-flex justify-center align-center"
                  >
                    <VCheckbox
                      class="px-10"
                      label="NO"
                    >
                      <template #label>
                        <span class="font-size">NO</span>
                      </template>
                    </VCheckbox>
                  </VCol>
                </VRow>
              </div>
            </td>
          </tr>
        </tbody>

        <tbody v-if="typeResalse === 'Lorry'">
          <tr
            v-for="(image, index) in imagePictureLorry"
            :key="index"
          >
            <td
              style="min-width: 410px;"
              colspan="6"
            >
              <VImg :src="image" />
            </td>
            <td colspan="6">
              <div class="d-flex justify-center">
                <VRow>
                  <VCol cols="12">
                    <div
                      v-if="index === 0"
                      class="d-flex justify-center"
                    >
                      Already Cleaned
                    </div>
                    <div
                      v-if="index === 1"
                      class="d-flex justify-center"
                    >
                      After Seal
                    </div>
                    <div
                      v-if="index === 2"
                      class="d-flex justify-center"
                    >
                      Inside Tank
                    </div>
                    <div
                      v-if="index === 3"
                      class="d-flex justify-center"
                    >
                      Cleaning Hose and Air Blow
                    </div>
                    <div
                      v-if="index === 4"
                      class="d-flex justify-center"
                    >
                      Cover By Coping
                    </div>
                  </VCol>
                  <VCol
                    cols="6"
                    class="d-flex justify-center align-center"
                  >
                    <VCheckbox class="px-10">
                      <template #label>
                        <span class="font-size">YES</span>
                      </template>
                    </VCheckbox>
                  </VCol>
                  <VCol
                    cols="6"
                    class="d-flex justify-center align-center"
                  >
                    <VCheckbox
                      class="px-10"
                      label="NO"
                    >
                      <template #label>
                        <span class="font-size">NO</span>
                      </template>
                    </VCheckbox>
                  </VCol>
                </VRow>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </VCol>

    <VCol cols="12">
      <div
        class="mb-2"
        style="font-size: 12px;"
      >
        Remark
      </div>
      <table class="custom-table">
        <tr>
          <th colspan="12">
            <VTextarea>
              <template #label>
                <span class="font-size">Remark</span>
              </template>
            </VTextarea>
          </th>
        </tr>
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
              <span>Inspector </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th colspan="4">
              <VTextField
                v-model="varA"
                class="pa-0"
                density="compact"
                style="font-size: 16px;"
              >
                <template #prepend>
                  <span />
                </template>
                <template #label>
                  <span class="font-size">Staff</span>
                </template>
                <template #append>
                  <span />
                </template>
              </VTextField>
            </th>
            <th colspan="4">
              <VTextField
                v-model="varA"
                class="pa-0"
                density="compact"
                style="font-size: 16px;"
              >
                <template #prepend>
                  <span />
                </template>
                <template #label>
                  <span class="font-size">Leader</span>
                </template>
                <template #append>
                  <span />
                </template>
              </VTextField>
            </th>
            <th colspan="4">
              <VTextField
                v-model="varA"
                class="pa-0"
                density="compact"
                style="font-size: 16px;"
              >
                <template #prepend>
                  <span />
                </template>
                <template #label>
                  <span class="font-size">Supervisor</span>
                </template>
                <template #append>
                  <span />
                </template>
              </VTextField>
            </th>
          </tr>
          <tr>
            <th colspan="4">
              <VTextField
                v-model="varA"
                class="pa-0"
                density="compact"
                style="font-size: 16px;"
              >
                <template #prepend>
                  <span />
                </template>
                <template #label>
                  <span class="font-size">Date</span>
                </template>
                <template #append>
                  <span />
                </template>
              </VTextField>
            </th>
            <th colspan="4">
              <VTextField
                v-model="varA"
                class="pa-0"
                density="compact"
                style="font-size: 16px;"
              >
                <template #prepend>
                  <span />
                </template>
                <template #label>
                  <span class="font-size">Date</span>
                </template>
                <template #append>
                  <span />
                </template>
              </VTextField>
            </th>
            <th colspan="4">
              <VTextField
                v-model="varA"
                class="pa-0"
                density="compact"
                style="font-size: 16px;"
              >
                <template #prepend>
                  <span />
                </template>
                <template #label>
                  <span class="font-size">Date</span>
                </template>
                <template #append>
                  <span />
                </template>
              </VTextField>
            </th>
          </tr>
        </tbody>
      </table>
    </VCol>

    <VCol cols="12">
      <div class="d-flex justify-end">
        <VBtn
          class="mx-2"
          color="warning"
          @click="submitForm"
        >
          Save Draft
        </VBtn>
        <VBtn @click="resetForm">
          Submit
        </VBtn>
      </div>
    </VCol>
  </VRow>
</template>

<style scoped src="../Flexi/flexi.scss">

</style>
