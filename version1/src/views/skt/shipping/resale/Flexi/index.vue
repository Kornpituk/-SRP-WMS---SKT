<script setup>
const vasss = ref('dd')
import image02 from '@/views/skt/resale/ibc/img/02.png'
import img01 from '@/views/skt/shipping/resale/Flexi/img/01.png'
import img02 from '@/views/skt/shipping/resale/Flexi/img/02.png'
import img03 from '@/views/skt/shipping/resale/Flexi/img/03.png'
import img04 from '@/views/skt/shipping/resale/Flexi/img/04.png'

const imagePicture = ref([img01, img02, img03, img04])
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
      <table class="custom-table">
        <tr>
          <th
            colspan="12"
            class="text-center"
          >
            Filling direction & Report to FLEXI
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
            Issued by
          </th>
          <th
            colspan="2"
            class="text-center "
          >
            Checked by
          </th>
          <th
            colspan="4"
            class="text-center "
          >
            Approved by
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
            Strainer type
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
            <span class="font-weight-body">80&nbsp;&nbsp;&nbsp;100&nbsp;&nbsp;&nbsp;20&nbsp;&nbsp;&nbsp;150&nbsp;&nbsp;&nbsp;200&nbsp;&nbsp;&nbsp;300</span>
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
            <span class="font-weight-body">Bag filter</span>
          </th>
          <th
            colspan="5"
            class="text-start"
          >
            <div class="d-flex justify-center">
              <span class="font-weight-body">Cotton( pieces)</span>
            </div>
          </th>
          <th
            colspan="1"
            class="text-end "
          >
            <span class="end">
              <div class="d-flex justify-center">
                <span class="font-weight-body">flannel( pieces)</span>
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
              Checked by <VTextField
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
            Filling equipment
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
            (Filling order)
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
            Point of delivery
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
            <div class="d-flex justify-space-between align-center">
              Start Time <VTextField
                class="mx-2"
                density="compact"
              />
            </div>
          </th>
          <th
            colspan="5"
            class="text-center "
          >
            <div class="d-flex justify-space-between align-center">
              Finished Time <VTextField
                class="mx-2"
                density="compact"
              />
            </div>
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
            Person incharge
          </th>
        </tr>

        <tr>
          <th
            class="text-center "
            colspan="1"
          >
            Analysis result
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
            <VTextField
              density="compact"
              variant="outlined"
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
            <VTextField
              density="compact"
              variant="outlined"
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
            <VTextField
              density="compact"
              variant="outlined"
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
            <VTextField
              density="compact"
              variant="outlined"
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
            <VTextField
              density="compact"
              variant="outlined"
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
        <tbody>
          <tr
            v-for="(image, index) in imagePicture"
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
                    <div v-if="index === 0" class="d-flex justify-center">
                      Already Cleaned
                    </div>
                    <div v-if="index === 1" class="d-flex justify-center">
                      Shipping Mark and Valve
                    </div>
                    <div v-if="index === 2" class="d-flex justify-center">
                      Inside Tank
                    </div>
                    <div v-if="index === 3" class="d-flex justify-center">
                      Cleaning House and Air Blow
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
              <span>Filling direction & Report to FLEXI</span>
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
