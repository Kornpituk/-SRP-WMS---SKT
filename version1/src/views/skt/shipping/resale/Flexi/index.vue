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

//--------------------------- Section import Services --------------------------------
import { urlApi } from '@/api'  //---------------------- Import Api for Url *****
import { VDataTable } from 'vuetify/labs/VDataTable'

const whereHouse = localStorage.getItem('whereHouseName')
const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')

import { useGetShippingCheckSheetService } from "@/services/skt/shipmentPlan/lorryFlexiServices"

import { useRoute } from 'vue-router'
import { onMounted, watch } from 'vue'

const route = useRoute()

const dataProductRow = ref(JSON.parse(sessionStorage.getItem("productDataSession")))

const soEIdModel = ref(dataProductRow.value.soEtlLogDetailJournalID)

//-------------------------- formate -------------------------------

const formatToDate = dateString => {
  if (!dateString) return null // จัดการค่าว่าง
  const date = new Date(dateString)
  if (isNaN(date)) return null // จัดการค่าที่ไม่ใช่วันที่
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  
  return `${day}/${month}/${year}`
}

//-------------------------- Section Get Data --------------------------------

const { getShippingCheckSheetResult,
  errorGetShippingCheckSheet,
  fetchShippingCheckSheet } = useGetShippingCheckSheetService()

const handleFetchDataLorry = async () => {
  try{
    const result = await fetchShippingCheckSheet(urlApi.value, 
      'ShippingLorryFlexi', whereHouse, accessTokenAtStore, soEIdModel.value)

    if(result){
      console.log('Result: ', result)
      getShippingCheckSheetResult.value = result.data.reportLorryFlexi
      console.log('getShippingCheckSheetResult: ', getShippingCheckSheetResult.value)
    }else{
      console.error('Error: ', errorGetShippingCheckSheet.value)
    }
  }catch(e){
    console.error(e)
  }
}

watch(async() => {
  await handleFetchDataLorry()
})
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
            <span>Customer Name: </span><span class="font-weight-body">{{ dataProductRow.shippingUserName }}</span>
          </th>
          <th
            colspan="4"
            class="text-center"
          >
            <span>Delivery Place: </span><span class="font-weight-body">{{ }}</span>
          </th>
          <th
            colspan="4"
            class="text-center"
          >
            <span> Weight: </span><span class="font-weight-body">{{ getShippingCheckSheetResult?.weight }}</span><span> Kg.</span>
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
            <span class="font-weight-body">{{ dataProductRow.itemName }}</span>
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
            style="min-width: 150px;"
          >
            <span class="font-weight-body">{{ dataProductRow.lot }}</span>
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
                  <VCheckbox
                    v-if="getShippingCheckSheetResult"
                    v-model="getShippingCheckSheetResult.meshOption"
                  /><span class="font-weight-body">YES</span>
                </VCol>
                <VCol
                  cols="6"
                  class="d-flex justify-center align-center"
                >
                  <VCheckbox
                    v-if="getShippingCheckSheetResult"
                    v-model="getShippingCheckSheetResult.meshOption"
                    value="false"
                  /><span class="font-weight-body">NO</span>
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
                  <VCheckbox
                    v-if="getShippingCheckSheetResult"
                    v-model="getShippingCheckSheetResult.materialOption"
                  /><span class="font-weight-body">YES</span>
                </VCol>
                <VCol
                  cols="6"
                  class="d-flex justify-center align-center"
                >
                  <VCheckbox
                    v-if="getShippingCheckSheetResult"
                    v-model="getShippingCheckSheetResult.materialOption"
                    value="false"
                  /><span class="font-weight-body">NO</span>
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
                  <VCheckbox
                    v-if="getShippingCheckSheetResult"
                    v-model="getShippingCheckSheetResult.bagFilterOption"
                  /><span class="font-weight-body">YES</span>
                </VCol>
                <VCol
                  cols="6"
                  class="d-flex justify-center align-center"
                >
                  <VCheckbox
                    v-if="getShippingCheckSheetResult"
                    v-model="getShippingCheckSheetResult.bagFilterOption"
                    value="false"
                  /><span class="font-weight-body">NO</span>
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
                v-if="getShippingCheckSheetResult"
                v-model="getShippingCheckSheetResult.fillingEquipment"
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
                v-if="getShippingCheckSheetResult"
                v-model="getShippingCheckSheetResult.lotNoActual"
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
                v-if="getShippingCheckSheetResult"
                v-model="getShippingCheckSheetResult.container"
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
                v-if="getShippingCheckSheetResult"
                v-model="getShippingCheckSheetResult.net"
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
                  <VCheckbox
                    v-if="getShippingCheckSheetResult"
                    v-model="getShippingCheckSheetResult.pointOfDelivery"
                    value="EX"
                  />Export
                </VCol>
                <VCol
                  class="d-flex justify-center align-center"
                  cols="6"
                >
                  <VCheckbox
                    v-if="getShippingCheckSheetResult"
                    v-model="getShippingCheckSheetResult.pointOfDelivery"
                    value="DO"
                  />Domestic
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
                  v-if="getShippingCheckSheetResult"
                  v-model="getShippingCheckSheetResult.dateTimeStart"
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
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.dateTimeBefore"
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
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.apprearanceBefore"
              density="compact"
              variant="outlined"
            />
          </th>
          <th
            class="text-center "
            colspan="2"
          >
            <AppDateTimePicker
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.dateTimeStart"
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
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.personInchargeStart"
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
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.apprearanceStart"
              density="compact"
              variant="outlined"
            />
          </th>
          <th
            class="text-center "
            colspan="2"
          >
            <AppDateTimePicker
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.dateTimeMiddle"
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
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.personInchargeMiddle"
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
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.apprearanceFinal"
              density="compact"
              variant="outlined"
            />
          </th>
          <th
            class="text-center "
            colspan="2"
          >
            <AppDateTimePicker
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.dateTimeFinal"
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
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.personInchargeFinal"
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
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.apprearanceInLorry"
              density="compact"
              variant="outlined"
            />
          </th>
          <th
            class="text-center "
            colspan="2"
          >
            <AppDateTimePicker
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.dateTimeInLorry"
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
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.personInchargeInLorry"
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
                  v-if="getShippingCheckSheetResult"
                  v-model="getShippingCheckSheetResult.sealNo"
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
                    <div v-if="index === 0">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.flexiAlreadyCleanedOption"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">YES</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 1">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.flexiShippingMarkOption"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">YES</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 2">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.flexiInsideTankOption"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">YES</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 3">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.flexiCleaningHoseAirBlowOption"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">YES</span>
                        </template>
                      </VCheckbox>
                    </div>
                  </VCol>
                  <VCol
                    cols="6"
                    class="d-flex justify-center align-center"
                  >
                    <div v-if="index === 0">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.flexiAlreadyCleanedOption"
                        value="false"
                        class="px-10"
                        label="NO"
                      >
                        <template #label>
                          <span class="font-size">NO</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 1">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.flexiShippingMarkOption"
                        class="px-10"
                        label="NO"
                        value="false"
                      >
                        <template #label>
                          <span class="font-size">NO</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 2">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.flexiInsideTankOption"
                        value="false"
                        class="px-10"
                        label="NO"
                      >
                        <template #label>
                          <span class="font-size">NO</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 3">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.flexiCleaningHoseAirBlowOption"
                        value="false"
                        class="px-10"
                        label="NO"
                      >
                        <template #label>
                          <span class="font-size">NO</span>
                        </template>
                      </VCheckbox>
                    </div>
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
                    <div v-if="index === 0">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.lorryAlreadyCleanedOption"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">YES</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 1">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.lorryAfterSealOption"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">YES</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 2">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.lorryInsideTankOption"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">YES</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 3">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.lorryCleaningHoseAirBlowOption"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">YES</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 4">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.lorryCoverByCopingOption"
                        
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">YES</span>
                        </template>
                      </VCheckbox>
                    </div>
                  </VCol>
                  <VCol
                    cols="6"
                    class="d-flex justify-center align-center"
                  >
                    <div v-if="index === 0">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.lorryAlreadyCleanedOption"
                        value="false"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">NO</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 1">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.lorryAfterSealOption"
                        value="false"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">NO</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 2">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.lorryInsideTankOption"
                        value="false"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">NO</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 3">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.lorryCleaningHoseAirBlowOption"
                        value="false"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">NO</span>
                        </template>
                      </VCheckbox>
                    </div>
                    <div v-if="index === 4">
                      <VCheckbox
                        v-if="getShippingCheckSheetResult"
                        v-model="getShippingCheckSheetResult.lorryCoverByCopingOption"
                        value="false"
                        class="px-10"
                      >
                        <template #label>
                          <span class="font-size">NO</span>
                        </template>
                      </VCheckbox>
                    </div>
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
            <VTextarea
              v-if="getShippingCheckSheetResult"
              v-model="getShippingCheckSheetResult.remark"
            >
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
            <td
              style="min-width: 150px;"
              colspan="4"
            >
              Staff: <span v-if="getShippingCheckSheetResult">{{ getShippingCheckSheetResult.updatedBy }}</span>
            </td>
            <td
              style="min-width: 150px;"
              colspan="4"
            >
              Leader: <span v-if="getShippingCheckSheetResult">{{ getShippingCheckSheetResult.leadedBy }}</span>
            </td>
            <td
              style="min-width: 150px;"
              colspan="4"
            >
              Approver: <span v-if="getShippingCheckSheetResult">{{ getShippingCheckSheetResult.approvedBy }}</span>
            </td>
          </tr>
          <tr>
            <td colspan="4">
              <span v-if="getShippingCheckSheetResult">{{ formatToDate(getShippingCheckSheetResult.updatedDate) }}</span>
            </td>
            <td colspan="4">
              <span v-if="getShippingCheckSheetResult">{{ formatToDate(getShippingCheckSheetResult.leadedDate) }}</span>
            </td>
            <td colspan="4">
              <span v-if="getShippingCheckSheetResult">{{ formatToDate(getShippingCheckSheetResult.approvedDate) }}</span>
            </td>
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
