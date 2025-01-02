<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { ref, watchEffect } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api'  //---------------------- Import Api for Url *****

//------------------------ Get Where House Name From LocalStorage and define to whereHouseSelectedItem ---------------------------
const whereHouse = localStorage.getItem('whereHouseName')

const products = ref([]) //---------------- variable for get All Product From X-Location(Where House) *****

// Get access token from localStorage in another page
const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')

const perPage = ref(10)
const page = ref(0)
const totalCount = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)

const router = useRouter()

const serialProductCode = ref(null)

/// ------------------------------ Import Component --------------------------------
// --- Dialog Text Area --------------------------------

import TextAreaDialog from '@/components/dialogs/alert/textAreaDialog.vue' //--------- import component

const dialogDataTextArea = ref('')
const dialogData2TextArea = ref('')
const dialogVisible = ref(false)

// --- define Model

const shipmentModel = ref([])

const itemsTruck = [
  'LEO',
  'BTS',
  'LCL',
]

const shippingCondition = ref('')
const shippingmark = ref('')
const typeDialogTextArea = ref('')

const sapInValueView = ref('')
const lotValueView = ref('')
const typeDialogView = ref('')
const typeBtnView = ref('')
const titleDialogView = ref('')

const indexDataDialogTextArea = ref('')

//------ function for dialog text area ----------------------------------------------

// กำหนดค่าคอนฟิกสำหรับแต่ละ type
const dialogConfig = {
  ShipCon: { title: 'Shipping Condition', type: 'ShipCon', sapIn: '', btn: 'nonPrint' },
  ShipMark: { title: 'Shipping Mark', type: 'ShipMark', sapIn: 'TIX2406001', btn: 'nonPrint' },
  ShipMC: { title: 'Shipping Mark Con', type: 'ShipMC', sapIn: 'TIX2406001', btn: 'twinPrint' },
  Lot: { title: 'Lot', type: 'Lot', sapIn: 'TIX2406001', btn: 'nonPrint' },
  ShipMarkPrint: { title: 'Shipping Mark', type: 'ShipMark', sapIn: 'TIX240602', btn: 'print' },
  ShipConPrint: { title: 'Shipping Condition', type: 'ShipCon', sapIn: 'TIX240602', btn: 'print' },
  RemarkWH: { title: 'Remark WH', type: 'RemarkWH', sapIn: 'TIX2406001', btn: 'nonPrint' },
  RemarkSAL: { title: 'Remark SAL', type: 'RemarkSAL', sapIn: 'TIX2406001', btn: 'nonPrint' },
  RemarkLOG: { title: 'Remark LOG', type: 'RemarkLOG', sapIn: 'TIX2406001', btn: 'nonPrint' },
}

// ฟังก์ชันสำหรับเปิด dialog
const textAreaDialogActive = (type, data, index) => {
  typeDialogTextArea.value = type
  indexDataDialogTextArea.value = index

  // โหลดค่าจากคอนฟิก
  const config = dialogConfig[type]
  if (config) {
    titleDialogView.value = config.title
    typeDialogView.value = config.type
    sapInValueView.value = config.sapIn
    typeBtnView.value = config.btn
    dialogDataTextArea.value = data // ตั้งค่า dialogDataTextArea ด้วยค่า data
  }

  dialogVisible.value = true
}

const textAreaShipDialogActive = (type, data, data2, index) => {
  typeDialogTextArea.value = type
  indexDataDialogTextArea.value = index

  titleDialogView.value = 'Shipping Mark Con'
  typeDialogView.value = 'ShipMC'
  sapInValueView.value = 'TIX2406001'
  typeBtnView.value = 'twinPrint'
  dialogDataTextArea.value = data  // ตั้งค่า dialogDataTextArea ด้วยค่า data
  dialogData2TextArea.value = data2 // 
  dialogVisible.value = true
}

const handleDialogSubmit = data => {
  dialogDataTextArea.value = data

  const index = indexDataDialogTextArea.value

  if (index >= 0 && index < mockData.value.length) {
    const item = mockData.value[index]

    // อัปเดตค่าของ item
    item.value = data

    // ใช้งานข้อมูลตาม type
    if (typeDialogTextArea.value  === 'ShipCon') {
      item.shippingCondition = data
    } else if (typeDialogTextArea.value === 'ShipMark') {
      item.shippingMark = data
    } else if (typeDialogTextArea.value === 'RemarkSAL') {
      item.remarkSal = data
    }else if (typeDialogTextArea.value === 'RemarkWH') {
      item.remarkWh = data
    }else if (typeDialogTextArea.value === 'RemarkLOG') {
      item.remarkLog = data
    }
  } else {
    console.warn(`Index ${index} is out of range for mockData.`)
  }

  console.log('Updated mockData:', data)
}

//------------------------------- Function Get StockUpdate Need Enter Search -----------------

//--------------------------------------- Function Pagination --------------------------------------------
// 👉 watching current page
watch(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = products.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = products.value.length + (currentPage.value - 1) * rowPerPage.value
  
  return `${ firstIndex }-${ lastIndex } of ${ totalCount.value }`
})

// SECTION Checkbox toggle
const selectedRows = ref([])

//-------------------------- format decimal -------------------

const formatDecimal = decimal => {
  const configsShowDigit = localStorage.getItem('configsShowDigit')
  if (configsShowDigit == 'true') {
    return Math.ceil(decimal)
  } else {
    return decimal
  }
}

//------------------------ Dialog Image ----------------------------
const isDialogImageVisible = ref(false)
const urlImage = ref('')
const nameImage = ref('')

const checkRFID = ref ('')

watchEffect(() =>{
  const checkRFIDUpdate = ref (localStorage.getItem('configsShowRfdi'))
  if(checkRFIDUpdate.value === 'true'){
    console.log('RFID Check True:'+ checkRFIDUpdate.value)
    checkRFID.value = true
  } else if (checkRFIDUpdate.value === 'false') {
    console.log('RFID Check False:'+ checkRFIDUpdate.value)
    checkRFID.value = false
  }
})

const codeProduct = ref('')
const nameProduct = ref('')
const imgProduct = ref('')
const barcodeProduct = ref('')
const categoriesProduct = ref('')
const groupProduct = ref('')
const groupSupProduct = ref('')
const totalProduct = ref('')
const unitNameProduct = ref('')
const detailsProduct = ref('')

const showExpansionDialog = ref(false)

//---------------------------- check Status ---------------------------------

const colorStatus = ref('grey')
const bgStatus = ref('bg-grey')


const checkColorTextStatus = status => {
  if(status === 'Received'){
    return 'bg-green-lighten-4'
  }else if(status === 'Waiting for Receive') {
    return 'bg-yellow-lighten-4' 
  }
}

const checkColorBgStatus = status => {
  if(status === 'Received'){
    return 'text-green'
  }else if(status === 'Waiting for Receive') {
    return 'text-warning' 
  }
}

const statuses = [ 'Approve', 'Reject', 'Back to Edit']

// ฟังก์ชันสำหรับสุ่มสถานะ
function getRandomStatus() {
  const randomIndex = Math.floor(Math.random() * statuses.length)
  
  return statuses[randomIndex]
}

function getRandomDate(start, end) {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
  const randomDate = new Date(randomTime)
  
  const year = randomDate.getFullYear()
  const month = String(randomDate.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const day = String(randomDate.getDate()).padStart(2, '0')
  
  return `${day}/${month}/${year}`
}

const checkBgTruck = truck => {
  if(truck === 'BTS'){
    return 'bg-red-lighten-4'
  }else if(truck === 'LCL'){
    return 'bg-warning'
  } 
}

//------------------------------------------ Mock Data --------------------------------
import mockData from './dataMock'

//------------------------ Set Permissions (Hiden and Show Column) ------------------------
const accountAmin = ref (false)
const accountViewerKK = ref (false)
const accountINSP = ref (false)
const accountSALLOG = ref (false)
const accountSAL = ref (false)
const accountLOG = ref (false)
const accountWH = ref (false)
const accountWHSub = ref (false)
const accountAll = ref (true)

const setAccount = role => {
  accountAmin.value = false
  accountViewerKK.value = false
  accountINSP.value = false
  accountSALLOG.value = false

  accountSAL.value = false
  accountLOG.value = false

  accountWH.value = false
  accountAll.value = false

  accountWHSub.value = false

  if (role === 'Amin') {
    accountAmin.value = true
    accountViewerKK.value = false
    accountINSP.value = false
    accountSALLOG.value = false
    accountWH.value = false
    accountWHSub.value = false
    accountAll.value = false
  } else if (role === 'ViewerKK') {
    accountAmin.value = false
    accountViewerKK.value = true
    accountINSP.value = false
    accountSALLOG.value = false
    accountWH.value = false
    accountWHSub.value = false
    accountAll.value = false
  } else if (role === 'INSP') {
    accountAmin.value = false
    accountViewerKK.value = false
    accountINSP.value = true
    accountSALLOG.value = false
    accountWH.value = false
    accountWHSub.value = false
    accountAll.value = false
  } else if (role === 'SALLOG') {
    accountAmin.value = false
    accountViewerKK.value = false
    accountINSP.value = false
    accountSALLOG.value = true
    accountWH.value = false
    accountWHSub.value = false
    accountAll.value = false
  } 

  else if (role === 'SAL') {
    accountAmin.value = false
    accountViewerKK.value = false
    accountINSP.value = false
    accountSAL.value = true
    accountLOG.value = false
    accountWH.value = false
    accountWHSub.value = false
    accountAll.value = false
  } 

  else if (role === 'LOG') {
    accountAmin.value = false
    accountViewerKK.value = false
    accountINSP.value = false
    accountSAL.value = false
    accountLOG.value = true
    accountWH.value = false
    accountWHSub.value = false
    accountAll.value = false
  } 
  
  else if (role === 'WH') {
    accountAmin.value = false
    accountViewerKK.value = false
    accountINSP.value = false
    accountSALLOG.value = false
    accountWH.value = true
    accountWHSub.value = false
    accountAll.value = false
    
  } else if (role === 'WHSub') {
    accountAmin.value = false
    accountViewerKK.value = false
    accountINSP.value = false
    accountSALLOG.value = false
    accountWH.value = false
    accountWHSub.value = true
    accountAll.value = false
    
  }  
  else if (role === 'All') {
    accountAmin.value = false
    accountViewerKK.value = false
    accountINSP.value = false
    accountSALLOG.value = false
    accountWH.value = false
    accountWHSub.value = false
    accountAll.value = true
  }

  console.log('Switch Acc', accountAmin.value, accountViewerKK.value, accountINSP.value, accountSALLOG.value, accountWH.value, accountAll.value)

  // สามารถเพิ่มเงื่อนไขสำหรับ role อื่นๆ ได้ที่นี่
}

//-------------------
//----- Rune
const rules = [v => v.length <= 150 || 'Max 25 characters']

//--------- new expention
const panel = ref(['filter'])

///---------------- Dialog 
const isDialogVisiblePrintTruck = ref(false)

///------------ Dialog PDF

const isDialogPDFViewVisible = ref(false)

const imgDialogPDF = ref('')
const imgDialogPng = ref('')

//--------------------------- File INput --------------------------------

import FileInputDialogCarousels from '@/components/golbal/flieUploadDialogCarousels.vue' //--------- import component

const viewAllData = () => {
  console.log(mockData.value)
}

const typeFileInput = ref('hideInput')

const filesFromUploader = ref([])
const typeNameFileInput = ref('')

const addNameTypeFileInput = name => {
  typeNameFileInput.value = name
}

// ฟังก์ชันจัดการข้อมูลที่ส่งมาจาก FileUploader
const handleFileUpdates = updatedFiles => {
  filesFromUploader.value = updatedFiles
  console.log('Updated Files:', filesFromUploader.value)
  console.log('Name Files:', typeNameFileInput.value)
}
</script>

<template>
  <!-- Title Page -->
  <div>
    <VCard>
      <VCardTitle>
        <div class="d-flex align-center">
          <VRow class="d-flex align-center">
            <VCol cols="2">
              <IconBtn
                class="cursor-pointer"
                color="#FFFFFF"
                :to="{ name: 'skt-receiving',
                }"
              >
                <VIcon
                  size="30"
                  icon="ri-close-circle-fill"
                  color="#000000"
                />
              </IconBtn>
            </VCol>
            <VCol
              cols="8"
              class="text-center"
            >
              <div>
                <span
                  style="font-size: 22px; font-weight: bold;"
                  class="text-center"
                >{{ $t('Shipment Plan') }}</span>
              </div>
            </VCol>
            <VCol
              cols="2"
              class="d-flex justify-end"
            >
              <VBtn
                variant="flat"
                @click="panel = panel.length ? [] : ['filter']"
              >
                <VIcon icon="ri-equalizer-line" />
              </VBtn>
            </VCol>
          </VRow>
        </div>
      </VCardTitle>
    </VCard>
  </div>
  <!-- Expansion -->
  <section>
    <div>
      <VExpansionPanels
        v-model="panel"
        multiple
      >
        <VExpansionPanel value="filter">
          <VExpansionPanelText>
            <VForm @submit.prevent="submitSearchButton">
              <!-- Barcode | Product code | Product Name | Button Export -->
              <VRow>
                <!-- 👉 Select Barcode -->
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <!-- 👉 Search Product code -->
                  <AppDateTimePicker
                    v-model="date"
                    placeholder="Select ETA"
                    prepend-inner-icon="ri-calendar-schedule-fill"
                    density="compact"
                    :config="{ dateFormat: 'd/m/Y' }"
                  />
                </VCol>

                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <!-- 👉 Search Product code -->
                  <AppDateTimePicker
                    v-model="date"
                    prepend-inner-icon="ri-calendar-schedule-fill"
                    placeholder="Select ETD"
                    density="compact"
                    style="font-size: 14px;"
                    :config="{ dateFormat: 'd/m/Y' }"
                  >
                    <template #label>
                      <span style="font-size: 12px;">ETD</span>
                    </template>
                  </AppDateTimePicker>
                </VCol>
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <!-- 👉 Search Product code -->
                  <VTextField
                    v-model="searchByProductId"
                    density="compact"
                  >
                    <template #label>
                      <span style="font-size: 12px;">Sale Order No.</span>
                    </template>
                  </VTextField>
                </VCol>

                <!-- 👉 Select Product code -->
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <VTextField
                    v-model="searchByProductId"
                    density="compact"
                  >
                    <template #label>
                      <span style="font-size: 12px;">Payer Name</span>
                    </template>
                  </VTextField>
                </VCol>

                <!-- 👉 Select Product Name -->
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <VTextField
                    v-model="searchByProductName"
                    density="compact"
                  >
                    <template #label>
                      <span style="font-size: 12px;">Product Name</span>
                    </template>
                  </VTextField>
                </VCol>

                <!-- 👉 Button Search and Export -->
                <VCol
                  cols="12"
                  lg="4"
                  class="py-1 d-flex"
                >
                  <VRow>
                    <VCol cols="4">
                      <VBtn
                        height="100%"
                        width="100%"
                        color="green"
                        density="compact"
                        class="mx-0"
                        
                        @click="isDialogPrintLabelVisible = true"
                      >
                        <span style="font-size: 12px;">{{ $t('Search') }}</span>
                      </VBtn>
                    </VCol>
                    <VCol cols="4">
                      <VBtn
                        color="red"
                        height="100%"
                        width="100%"
                        density="compact"
                        @click="clearModel"
                      >
                        <span style="font-size: 12px;">{{ $t('Clear') }}</span>
                      </VBtn>
                    </VCol>
                    <VCol
                      cols="4"
                      md="4"
                    >
                      <VBtn
                        density="compact"
                        class=" px-16 px-sm-12 pa-sm-1 custom-small-btn-excel"
                        color="warning"
                        style="width: 100%; height: 40px;"
                        @click="stockUpdateExcel"
                      >
                        <img
                          src="/src/assets/images/icons/vscode-icons_file-type-excel2.png"
                          style="width: 27px;"
                          class="custom-small-img"
                        >
                        <span style="font-size: 12px;">{{ $t('Export file') }}</span>
                      </VBtn>
                    </VCol>
                  </VRow>
                </VCol>
              </VRow>
            </VForm>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </div>
  </section>

  <!-- Dialog Image -->
  <section>
    <VDialog
      v-model="isDialogImageVisible"
      persistent
      class=""
      max-width="500"
    >
      <VCard class="">
        <VCardTitle class="d-flex justify-space-between bg-primary">
          <div>
            <span class="text-white">{{ $t('Image Product') }}</span>
          </div>
          <div>
            <IconBtn
              size="30"
              @click="isDialogImageVisible = false"
            >
              <VIcon
                size="30"
                icon="mdi-close-circle"
              />
            </IconBtn>
          </div>
        </VCardTitle>
        <VImg
          style="width: 100%;"
          :src="imgProduct"
          cover
        />
        <VCardActions
          class="bg-primary"
          style="width: 100%; padding: 0;"
        >
          <VBtn
            color="red-green-1"
            variant="text"
            style="width: 100%;"
            @click="showExpansionDialog = !showExpansionDialog"
          >
            <VIcon
              size="40px"
              color="white"
              :icon="showExpansionDialog ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            />
            <span class="text-white">{{ $t('Details') }}</span>
          </VBtn>
        </VCardActions>

        <VExpandTransition>
          <div v-show="showExpansionDialog">
            <VCardText class="bg-green-lighten-3">
              <div>
                <VRow>
                  <VCol
                    cols="12"
                    lg="6"
                  >
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Name")
                    }}:&nbsp;</span>&nbsp;{{ nameProduct }}<br>
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Code")
                    }}:&nbsp;</span>&nbsp;{{ codeProduct }}<br>
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Barcode")
                    }}:&nbsp;</span>&nbsp;{{ barcodeProduct }}<br>
                  </VCol>
                  <VCol
                    cols="12"
                    lg="6"
                  >
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Categories")
                    }}:&nbsp;</span>&nbsp;{{ categoriesProduct }}<br>
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Group")
                    }}:&nbsp;</span>&nbsp;{{ groupProduct }}<br>
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Sup Group")
                    }}:&nbsp;</span>&nbsp;{{ groupSupProduct }}<br>
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Total")
                    }}:&nbsp;</span>&nbsp;<span v-if="totalProduct">{{ (formatDecimal(totalProduct)).toLocaleString('en-US') }} {{ unitNameProduct }}<br><br></span>
                  </VCol>
                </VRow>
                <span style="font-size: large; font-weight: 900;">{{
                  $t("Details ")
                }} :</span>{{ detailsProduct }}
              </div>
            </VCardText>
          </div>
        </VExpandTransition>
      </VCard>
    </VDialog>
  </section>

  <!-- Dialog Print Shipping Mark -->
  <div>
    <VDialog
      v-model="isDialogVisiblePrintShippingMark"
      width="50%"
    >
      <!-- Dialog Content -->
      <VCard>
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogVisiblePrintShippingMark = false"
        />

        <VCardTitle>
          <div class="text-center">
            <span>Print Shipping Mark</span>
          </div>
        </VCardTitle>

        <VCardText>
          <div class="d-flex justify-spance-between align-center">
            <VRow>
              <VCol cols="12">
                <span class="my-4">Sale Order No. : {{ exmpleSaleOrder }}</span>
              </VCol>
              <VCol cols="12">
                <VTextarea
                  v-model="exmpleShippingMark"
                  readonly
                  label="Shipping Mark"
                  style="min-width: 220px;"
                  :rules="rules"
                  rows="2"
                  clearable
                  placeholder="Shipping Mark"
                />
              </VCol>
            </VRow>
          </div>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VRow>
            <VCol
              cols="6"

              class="d-flex justify-end align-center"
            >
              <span>Print Coppy:</span>
            </VCol>
            <VCol
              cols="6"
              class="d-flex justify-start"
            >
              <VTextField
                density="compact"
                  
                type="number"
                min="0"
              >
                <template #append-inner>
                  <span>
                    Coppy
                  </span>
                </template>
              </VTextField>
            </VCol>
          </VRow>
          <VBtn
            color="warning"
            @click="printLabel"
          >
            <VIcon
              size="30"
              icon="ri-printer-fill"
            />
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>

  <!-- Btn Test Role -->
  <div
    v-if="true"
    class="mt-4"
  >
    <VCard>
      <VCardText>
        <VRow>
          <VCol cols="6">
            <VBtn
              color="yellow"
              @click="setAccount('Amin')"
            >
              Admin
            </VBtn>
            <VBtn
              color="blue"
              @click="setAccount('ViewerKK')"
            >
              ViewerKK
            </VBtn>
            <VBtn
              color="brown"
              @click="setAccount('INSP')"
            >
              INSP
            </VBtn>
            <VBtn
              color="light-blue"
              @click="setAccount('SAL')"
            >
              SAL
            </VBtn>
            <VBtn
              color="light-blue"
              @click="setAccount('LOG')"
            >
              LOG
            </VBtn>
            <VBtn
              color="light-blue"
              @click="setAccount('SALLOG')"
            >
              SAL/LOG
            </VBtn>
            <VBtn
              color="deep-purple"
              @click="setAccount('WH')"
            >
              WH
            </VBtn>
            <VBtn
              color="deep-purple"
              @click="setAccount('WHSub')"
            >
              WH Sub
            </VBtn>
            <VBtn @click="setAccount('All')">
              All
            </VBtn>
            <VBtn @click="viewAllData">
              All
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>

  <section>
    <VDialog
      v-model="isDialogVisiblePrintTruck"
      width="100%"
    >
      <!-- Dialog Content -->
      <VCard title="Truck Order">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogVisiblePrintTruck = false"
        />

        <VCardText style="overflow-x: auto;">
          <table class="custom-table">
            <thead>
              <tr>
                <th
                  colspan="12"
                  class="text-center"
                >
                  SANYO KASEI (THAILAND) LTD.
                </th>
              </tr>
              <tr>
                <th
                  colspan="12"
                  class="text-center"
                >
                  Rojana Industrial Park-Rayong, 5/5 Moo 11 T. Nongbua, A.Bankhai, Rayong 21120
                </th>
              </tr>
              <tr>
                <th
                  colspan="12"
                  class="text-center"
                >
                  Tel. : (038) 627-0505 Fax. (038 946-072)
                </th>
              </tr>
              <tr>
                <th
                  colspan="12"
                  class="text-center"
                >
                  ใบสั่งรถขนส่ง / Truck order
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th colspan="4">
                  วันที่ (Date):
                </th>
                <td
                  colspan="8"
                  class="text-center"
                >
                  24/07/2024
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  เลขที่ใบสั่งงานรถขนส่ง (Truck order no)
                </th>
                <th colspan="8">
                  <VTextField
                    style="min-width: 250px;"
                    density="compact"
                    class="text-center"
                  >
                    <template #prepend>
                      Running Number:
                    </template>
                  </VTextField>
                </th>
              </tr>
              <tr>
                <th colspan="4">
                  เลขที่อ้างอิง (Ref SO No.)
                </th>
                <td
                  colspan="8"
                  class="text-center"
                >
                  Shipment plan
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  ชื่อบริษัท (Company Name)
                </th>
                <th colspan="8">
                  <VAutocomplete
                    class="text-center"
                    density="compact"
                    label="Company Name"
                    :items="items"
                    placeholder="Select State"
                  />
                </th>
              </tr>
              <tr>
                <th colspan="4">
                  ที่อยู่ (Address)
                </th>
                <td
                  colspan="8"
                  class="text-center"
                >
                  LEO Global Logistics Public Company Limited 251-251/1 Soi Pakdee, Rama 3 Road, Bangkorlaem, Bangkok 10120 Thailand
                </td>
              </tr>
              <tr>
                <th colspan="4" />
                <th
                  colspan="8"
                  class="text-center"
                />
              </tr>
              <tr>
                <th colspan="4">
                  บริษัทขนส่ง (Transportation Company Name)
                </th>
                <th
                  colspan="8"
                  class="text-center"
                >
                  <VAutocomplete
                    class="text-center"
                    density="compact"
                    label="Transportation Company Name"
                    :items="items"
                    placeholder="Select State"
                  />
                </th>
              </tr>
              <tr>
                <th colspan="4">
                  ประเภทรถ (Truck type)
                </th>
                <th
                  colspan="8"
                  class="text-center"
                >
                  <VAutocomplete
                    class="text-center"
                    density="compact"
                    label="Truck type"
                    :items="items"
                    placeholder="Select State"
                  />
                </th>
              </tr>
              <tr>
                <th colspan="4">
                  ทะเบียนรถ (Truck license)
                </th>
                <th
                  colspan="8"
                  class="text-center"
                >
                  <VTextField
                    style="min-width: 250px;"
                    density="compact"
                    label="Enter Truck License"
                    class="text-center"
                  />
                </th>
              </tr>
              <tr>
                <th colspan="4">
                  ชื่อพนักงานขับรถ (Drive Name)
                </th>
                <td
                  colspan="8"
                  class="text-center"
                >
                  <VTextField
                    style="min-width: 250px;"
                    density="compact"
                    label="Drive Name"
                    placeholder="MR. ABCD"
                    class="text-center"
                  />
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  เลขที่อ้างอิง (Ref SO No.)
                </th>
                <td
                  colspan="8"
                  class="text-center"
                >
                  <VTextField
                    style="min-width: 250px;"
                    density="compact"
                    label="Ref SO No."
                    placeholder="000000000"
                    class="text-center"
                  />
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  เบอร์ติดต่อ (Tel)    
                </th>
                <td
                  colspan="8"
                  class="text-center"
                >
                  <VTextField
                    style="min-width: 250px;"
                    density="compact"
                    label="Tel"
                    placeholder="000-0000000"
                    class="text-center"
                  />
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  หมายเหตุ (Remark) 
                </th>
                <th
                  colspan="8"
                  class="text-center"
                >
                  <VTextarea
                    label="Default"
                    placeholder="Enter Remark"
                    clearable
                    clear-icon="ri-close-line"
                    row-height="30"
                  />
                </th>
              </tr>
            </tbody>
          </table>
          <table class="custom-table">
            <tr>
              <th colspan="4">
                <VTextField
                  
                  density="compact"
                  class="text-center"
                >
                  <template #label>
                    พนักงานขับรถ / Drivers By
                  </template>
                </VTextField>
              </th>
              <th colspan="4">
                <VTextField
                  
                  density="compact"
                  class="text-center"
                >
                  <template #label>
                    ผู้สั้งการ / Oder By
                  </template>
                </VTextField>
              </th>
              <th colspan="4">
                <VTextField
                  
                  density="compact"
                  class="text-center"
                >
                  <template #label>
                    ผู้อนุมัติ / Authorized By
                  </template>
                </VTextField>
              </th>
            </tr>
            <tr>
              <th colspan="4">
                <VueDatePicker
                  v-model="dateSupervisor"
                  :max-date="new Date()"
                  :enable-time-picker="false"
                />
              </th>
              <th colspan="4">
                <VueDatePicker
                  v-model="dateSupervisor"
                  :max-date="new Date()"
                  :enable-time-picker="false"
                />
              </th>
              <th colspan="4">
                <VueDatePicker
                  v-model="dateSupervisor"
                  :max-date="new Date()"
                  :enable-time-picker="false"
                />
              </th>
            </tr>
          </table>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            color="warning"
            @click="isDialogVisiblePrintTruck = false"
          >
            <VIcon
              start
              icon="ri-printer-fill"
            />
            Print
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <!-- Dialog PDF -->
  <section>
    <VDialog
      v-model="isDialogPDFViewVisible"
      width="60%"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardText>
          <iframe
            v-if="imgDialogPDF"
            :src="imgDialogPDF"
            width="100%"
            height="650px"
          />
          <VImg
            v-else
            height="650px"
            :src="imgDialogPng"
          />
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            variant="outlined"
            color="secondary"
            @click="isDialogPDFViewVisible = false"
          >
            close
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <!-- ----------             Product  SKT                                  ------------------------------------ -->
  <section>
    <VCard class="mt-6">
      <VTable class="text-wrap table-header-bg rounded-0">
        <!-- 👉 table head -->
        <thead class="">
          <tr>
            <th>
              <VCheckbox />
            </th>
            <th
              scope="row"
              class="text-center px-1"
            >
              <span style="font-weight: bold;">{{ $t('No.') }}</span>
            </th>
            <th class="text-center">
              <span style="font-weight: bold;">{{ $t('Status') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountSAL || accountLOG || accountWH || accountWHSub || accountAll"
              class="px-2"
            >
              <span style="font-weight: bold;">{{ $t('Sale Order No.') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountLOG || accountAll"
              class="text-center"
            >
              <span style="font-weight: bold;">{{ $t('SO attachment') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountLOG || accountWH || accountWHSub || accountAll"
              class="px-2"
            >
              <span style="font-weight: bold;">{{ $t('SAP Invoice no') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountSAL || accountLOG || accountAll"
              class="px-2"
            >
              <span style="font-weight: bold;">{{ $t('Payer Name') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountSAL || accountLOG || accountINSP || accountAll"
              class="px-2"
            >
              <span style="font-weight: bold;">{{ $t('User') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountSAL || accountLOG || accountWH || accountWHSub || accountAll"
              class="px-2"
            >
              <span style="font-weight: bold;">{{ $t('Shipper') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountSAL || accountLOG || accountWH || accountWHSub || accountAll"
              class="px-2"
            >
              <span style="font-weight: bold;">{{ $t('Shipper location') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountSAL || accountLOG || accountWH || accountWHSub || accountAll"
              class="text-center"
            >
              <div>
                <span style="padding-right: 60px; font-weight: bold;">
                  {{ $t('Shipping Mark/Cound.') }}
                </span>
              </div>
            </th>
            <th
              v-if="false"
              class="text-center"
            >
              <div>
                <span style="padding-right: 60px; font-weight: bold;">
                  {{ $t('Shipping Condition') }}
                </span>
              </div>
            </th>
            <th
              v-if="false"
              class="text-center"
            >
              <div>
                <span style="padding-right: 60px; font-weight: bold;">
                  {{ $t('Shipping Mark') }}
                </span>
              </div>
            </th>
            <th v-if="accountAmin || accountViewerKK || accountSALLOG || accountSAL || accountLOG || accountAll">
              <span style="font-weight: bold;">{{ $t('End User') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountSAL || accountLOG || accountAll"
              class="px-2"
            >
              <span style="font-weight: bold;">{{ $t('Consignee') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountSAL || accountLOG || accountWH || accountWHSub || accountAll"
              class="px-2"
            >
              <span style="font-weight: bold;">{{ $t('Item Name') }}</span>
            </th>
            <th v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountSAL || accountLOG || accountWH || accountWHSub || accountAll">
              <span style="font-weight: bold;">{{ $t('Lot') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountSAL || accountLOG || accountWH || accountWHSub || accountAll"
              class="text-end px-2"
            >
              <span style="font-weight: bold;">{{ $t('Qty. (Kg.)') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountSAL || accountLOG || accountWH || accountWHSub || accountAll"
              class="text-center"
            >
              <span style="font-weight: bold;">{{ $t('COA') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountLOG || accountAll"
              class="bg-green-lighten-3"
            >
              <span
                style="font-weight: bold;"
                class="text-black"
              >{{ $t('Freight forwarder') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountLOG || accountAll"
              class="bg-green-lighten-3 text-start"
              style="min-width: 150px;"
            >
              <span
                style="min-width: 250px; font-weight: bold;"
                class="text-start"
              >{{ $t('Carrier') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountLOG || accountAll"
              class="bg-green-lighten-3"
            >
              <span
                style="font-weight: bold;"
                class="text-black"
              >{{ $t('Vessel name') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountLOG || accountAll"
              class="bg-yellow-lighten-3"
            >
              <span
                style="font-weight: bold;"
                class="text-black"
              >{{ $t('Voy') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountLOG || accountWH || accountWHSub || accountAll"
              class="bg-green-lighten-3"
            >
              <span style="font-weight: bold;">{{ $t('Truck') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountLOG || accountWH || accountWHSub || accountAll"
              class="bg-yellow-lighten-3 texct-end"
            >
              <span style="font-weight: bold;">{{ $t('Truck Reserving Number') }}</span>
            </th>
            <th v-if="accountAmin || accountViewerKK || accountWH || accountWHSub || accountAll">
              <span style="font-weight: bold;">{{ $t('Truck fee') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountWH || accountWHSub || accountAll"
              class="text-center"
              style="min-width: 300px;"
            >
              <span style="padding-left: 1px; font-weight: bold;">{{ $t('Truck Order') }}</span>
              <VRow>
                <VCol
                  class="px-1"
                  cols="6"
                >
                  <span style="font-weight: bold;">Print</span> 
                </VCol>
                <VCol
                  class="px-1"
                  cols="6"
                >
                  <span style="font-weight: bold;">Attach File</span>
                </VCol>
              </VRow>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountINSP || accountLOG || accountWH || accountWHSub || accountAll"
              class="px-4"
            >
              <span style="font-weight: bold;">{{ $t('DO/EX') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountSAL || accountLOG || accountWH || accountWHSub || accountAll"
              class="px-2"
            >
              <span style="font-weight: bold;">{{ $t('Country') }}</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountSAL || accountLOG || accountWH || accountWHSub || accountAll"
              class="text-start px-2"
            >
              <span style="font-weight: bold;">{{ $t('Loading date') }}</span>
            </th>
            <th v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountSAL || accountLOG || accountWH || accountWHSub || accountAll">
              <VRow>
                <VCol cols="6">
                  <span style="font-weight: bold;">{{ $t('ETD') }}</span>
                </VCol>
                <VCol
                  class="d-flex justify-end"
                  cols="6"
                >
                  <VIcon
                    size="25"
                    icon="ri-calendar-todo-fill"
                  />
                </VCol>
              </VRow>
            </th>
            <th v-if="accountAmin || accountViewerKK || accountSALLOG || accountSAL || accountLOG || accountWH || accountWHSub || accountAll">
              <VRow>
                <VCol cols="6">
                  <span style="font-weight: bold;">{{ $t('ETA') }}</span>
                </VCol>
                <VCol
                  class="d-flex justify-end"
                  cols="6"
                >
                  <VIcon
                    size="25"
                    icon="ri-calendar-todo-fill"
                  />
                </VCol>
              </VRow>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountLOG || accountWH || accountWHSub || accountAll"
              class="text-center"
            >
              <span style="font-weight: bold;">{{ $t('Delivery note') }}</span>
            </th>
            <th v-if="accountAmin || accountViewerKK || accountSALLOG || accountSAL || accountAll">
              <span style="font-weight: bold;">{{ $t('Remark (SAL)') }}</span>
            </th>
            <th v-if="accountAmin || accountViewerKK || accountWH || accountWHSub || accountAll">
              <span style="font-weight: bold;">{{ $t('Remark (WH)') }}</span>
            </th>
            <th v-if="accountAmin || accountViewerKK || accountAll || accountLOG">
              <span style="font-weight: bold;">{{ $t('Remark (LOG)') }}</span>
            </th>
            <th class="px-1">
              <span style="font-weight: bold;">{{ $t('Updated By') }}</span>
            </th>
            <th class="px-1">
              <span style="font-weight: bold;">{{ $t('Updated Date') }}</span>
            </th>
            <th class="text-center">
              <span style="font-weight: bold;" />
            </th>
            <th class="text-center">
              <span style="font-weight: bold;">{{ $t('Action') }}</span>
            </th>
            <th class="text-center">
              <span style="font-weight: bold;" />
            </th>
          </tr>
        </thead>
        <!-- 👉 table body -->
        <tbody>
          <tr
            v-for="(product, index) in mockData"
            :key="index"
          >
            <td>
              <VCheckbox />
            </td>
            <!-- 👉 Ordinal Number -->
            <td class="text-center px-1">
              {{ index + 1 }}
            </td>
            <!-- 👉 status -->
            <td class="text-start px-1">
              <span v-if="product.status === 'Approve'">
                <VChip color="success">{{ product.status }}</VChip>
              </span>
              <span v-else-if="product.status === 'Back to Edit'">
                <VChip color="warning">{{ product.status }}</VChip>
              </span>
              <span v-else-if="product.status === 'Reject'">
                <VChip color="error">{{ product.status }}</VChip>
              </span>
            </td>

            <!-- 👉 saleOrderNo -->
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountSAL || accountLOG || accountWH || accountWHSub || accountAll"
              class="text-start px-1"
              style="min-width: 150px; font-size: 12px;"
            >
              {{ product.saleOrderNo }}
            </td>

            <!-- 👉 soAttachment -->
            <td
              v-if="accountAmin || accountViewerKK || accountLOG || accountAll"
              class="text-start px-1"
              style="min-width: 300px; font-size: 12px;"
            >
              <div>
                <FileInputDialogCarousels
                  title-dialog="So Attachment"
                  :type-file-input="typeFileInput"
                  file-name="So Attachment" 
                  @updateFiles="handleFileUpdates"
                />
              </div>
            </td>

            <!-- 👉 sapInvoiceNo -->
            <td
              v-if="accountAmin || accountViewerKK || accountLOG || accountWH || accountWHSub || accountAll"
              class="text-start px-2"
              style="min-width: 120px; font-size: 12px;"
            >
              {{ product.sapInvoiceNo }}
            </td>

            <!-- 👉 payerName -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountSAL || accountLOG || accountAll"
              class="text-start px-1"
              style="min-width: 150px; font-size: 12px;"
            >
              {{ (product.payerName) }}
            </td>

            <!-- 👉 user -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountSAL || accountLOG || accountINSP || accountAll"
              class="text-start px-1"
              style="min-width: 200px; font-size: 12px;"
            >
              {{ (product.user) }}
              User
            </td>

            <!-- 👉 shipper -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountSAL || accountLOG || accountWH || accountWHSub || accountAll"
              class="text-start px-1"
              style="min-width: 200px; font-size: 12px;"
            >
              {{ (product.shipper) }}
            </td>

            <!-- 👉 shipperLocation -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountSAL || accountLOG || accountWH || accountWHSub || accountAll"
              class="text-start px-1"
              style="min-width: 300px; max-width: 300px;  font-size: 12px;"
            >
              {{ (product.shipperLocation) }}
            </td>

            <!-- 👉 Shipping Condition -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountSAL || accountLOG || accountWH || accountWHSub || accountAll"
              class="text-start px-2"
              style="min-width: 300px; font-size: 12px;"
            >
              <div class="d-flex justify-space-between">
                <VBtn
                  style="min-width: 196px;"
                  variant="outlined"
                  :color="product.shippingCondition ? 'primary' : 'grey'"
                  @click="textAreaShipDialogActive('ShipMC',product.shippingMark, product.shippingCondition, index)"
                >
                  <span
                    v-if="product.shippingCondition"
                    style="overflow: hidden;min-width: 180px; max-width: 180px; text-overflow: ellipsis;"
                  >{{ product.shippingCondition }}</span>
                  <span v-else>Shipping Mark/Cound.</span>
                </VBtn>
                <VBtn
                  v-if="false"
                  class="mx-2"
                  :color="product.shippingCondition ? 'warning' : 'grey'"
                  :disabled="!product.shippingCondition"
                  @click="textAreaDialogActive('ShipConPrint', product.shippingCondition, index)"
                >
                  <VIcon
                    size="30"
                    icon="ri-eye-fill"
                    @click="textAreaDialogActive('ShipConPrint', product.shippingCondition, index)"
                  />
                </VBtn>
              </div>
            </td>

            <!-- 👉 Shipping Condition -->
            <td
              v-if="false"
              class="text-start px-2"
              style="min-width: 300px; font-size: 12px;"
            >
              <div class="d-flex justify-space-between">
                <VBtn
                  style="min-width: 196px;"
                  variant="outlined"
                  :color="product.shippingCondition ? 'primary' : 'grey'"
                  @click="textAreaDialogActive('ShipCon', product.shippingCondition, index)"
                >
                  <span
                    v-if="product.shippingCondition"
                    style="overflow: hidden; max-width: 159px; text-overflow: ellipsis;"
                  >{{ product.shippingCondition }}</span>
                  <span v-else>Shipping Condition</span>
                </VBtn>
                <VBtn
                  class="mx-2"
                  :color="product.shippingCondition ? 'warning' : 'grey'"
                  :disabled="!product.shippingCondition"
                  @click="textAreaDialogActive('ShipConPrint', product.shippingCondition, index)"
                >
                  <VIcon
                    size="30"
                    icon="ri-printer-fill"
                    @click="textAreaDialogActive('ShipConPrint', product.shippingCondition, index)"
                  />
                </VBtn>
              </div>
            </td>

            <!-- 👉 Shipping Mark -->
            <td
              v-if="false"
              class="text-start px-1"
              style="min-width: 300px; font-size: 12px;"
            >
              <div class="d-flex justify-space-between">
                <VBtn
                  style="min-width: 196px;"
                  variant="outlined"
                  :color="product.shippingMark ? 'primary' : 'grey'"
                  @click="textAreaDialogActive('ShipMark', product.shippingMark, index)"
                >
                  <span
                    v-if="product.shippingMark"
                    style="overflow: hidden; max-width: 130px; text-overflow: ellipsis;"
                  >{{ product.shippingMark }}</span>
                  <span v-else>Shipping Mark</span>
                </VBtn>
                <VBtn
                  class="mx-2"
                  :color="product.shippingMark ? 'warning' : 'grey'"
                  :disabled="!product.shippingMark"
                  @click="textAreaDialogActive('ShipMarkPrint', product.shippingMark, index)"
                >
                  <VIcon
                    size="30"
                    icon="ri-printer-fill"
                  />
                </VBtn>
              </div>
            </td>
            <!-- 👉 endUser -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountSAL || accountLOG || accountAll"
              class="text-start px-1"
              style="font-size: 12px;"
            >
              <VTextField
                v-model="product.endUser"
                density="compact"
                style=" min-width: 150px;"
              >
                <template #label>
                  <span style="font-size: 12px;">End User</span>
                </template>
              </VTextField>
            </td>

            <!-- 👉 consignee -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountSAL || accountLOG || accountAll"
              class="text-start px-1"
              style="min-width: 200px; font-size: 12px;"
            >
              {{ (product.consignee) }}
            </td>

            <!-- 👉 product -->
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountSAL || accountLOG || accountWH || accountWHSub || accountAll"
              class="text-start px-1"
              style="min-width: 250px; font-size: 12px;"
            >
              {{ (product.product) }}
            </td>

            <!-- 👉 Lot Number -->
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountSAL || accountLOG || accountWH || accountWHSub || accountAll"
              class="text-start px-1"
              style="font-size: 12px;"
            >
              <VBtn
                v-if="product.lotNumber.length > 1"
                style="min-width: 177px;"
                variant="outlined"
                @click="textAreaDialogActive('Lot', product.lotNumber)"
              >
                <span
                  v-if="product.lotNumber"
                  style="overflow: hidden; max-width: 150px; text-overflow: ellipsis;"
                >{{ product.lotNumber[0].lotNUmber }}...</span>
                <span v-else>Lot Number</span>
              </VBtn>
              <span v-else>{{ product.lotNumber[0].lotNUmber }}</span>
            </td>

            <!-- 👉 qty -->
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountSAL || accountLOG || accountWH || accountWHSub || accountAll"
              class="text-end px-1"
              style="min-width: 100px; font-size: 12px;"
            >
              {{ (product.qty) }}
            </td>

            <!-- 👉 coa -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountSAL || accountLOG || accountWH || accountWHSub || accountAll"
              class="text-start px-1"
              style="min-width: 300px; font-size: 12px;"
            >
              <div>
                <FileInputDialogCarousels
                  title-dialog="COA"
                  :type-file-input="typeFileInput"
                  file-name="COA" 
                  @updateFiles="handleFileUpdates"
                />
              </div>
            </td>

            <!-- 👉 Freight Forwarder -->
            <td
              v-if="accountAmin || accountViewerKK || accountLOG || accountAll"
              class="text-start px-1"
              style="min-width: 200px; font-size: 12px;"
            >
              <VSelect
                :items="items"
                density="compact"
                eager
              />
            </td>

            <!-- 👉 carrier -->
            <td
              v-if="accountAmin || accountViewerKK || accountLOG || accountAll"
              class="text-start px-1"
              style="min-width: 200px; font-size: 12px;"
            >
              <VSelect
                v-model="product.carrier"
                :items="items"
                density="compact"
                eager
              />
            </td>

            <!-- 👉 vesselName -->
            <td
              v-if="accountAmin || accountViewerKK || accountLOG || accountAll"
              class="text-start px-1"
              style="min-width: 200px; font-size: 12px;"
            >
              <VSelect
                v-model="product.vesselName"
                :items="items"
                density="compact"
                eager
              />
            </td>

            <!-- 👉 voy -->
            <td
              v-if="accountAmin || accountViewerKK || accountLOG || accountAll"
              style="font-size: 12px;"
              class="text-start px-1"
            >
              <VTextField
                v-model="product.voy"
                density="compact"
                style=" min-width: 150px;"
              />
            </td>


            <!-- 👉 freightForwarder -->
            <td
              v-if="accountAmin || accountViewerKK || accountLOG || accountWH || accountWHSub || accountAll"
              class="text-start px-1"
              :class="checkBgTruck(product.truck)"
              style="min-width: 120px; font-size: 12px;"
            >
              <VSelect
                v-model="product.truck"
                :items="itemsTruck"
                density="compact"
                eager
              />
            </td>

            <!-- 👉 truckReserving -->
            <td
              v-if="accountAmin || accountViewerKK || accountWH || accountWHSub || accountAll"
              class="text-center px-1"
              style="min-width: 250px; font-size: 12px;"
            >
              <VTextField
                v-if="false"
                v-model="product.truckReserving"
                density="compact"
                style=" min-width: 150px;"
              />
              {{ product.truckReserving }}
            </td>

            <!-- 👉 truckFee -->
            <td
              v-if="accountAmin || accountViewerKK || accountWH || accountWHSub || accountLOG || accountAll"
              class="text-start px-1"
              style="font-size: 12px;"
            >
              <VTextField
                v-model="product.truckFee"
                density="compact"
                style=" min-width: 150px;"
              />
            </td>

            <!-- 👉 truckOrder -->
            <td
              v-if="accountAmin || accountViewerKK || accountWH || accountWHSub || accountAll"
              class="text-start px-1"
              style="min-width: 450px; font-size: 12px;"
            >
              <VRow>
                <VCol
                  class="text-center px-2"
                  cols="6"
                >
                  <VBtn
                    width="60%"
                    color="warning"
                    @click="isDialogVisiblePrintTruck = true"
                  >
                    <VIcon
                      size="30"
                      icon="ri-printer-fill"
                    />
                  </VBtn>
                </VCol>
                <VCol
                  cols="6"
                  class="px-2"
                >
                  <div>
                    <FileInputDialogCarousels
                      title-dialog="Truck Order"
                      :type-file-input="typeFileInput"
                      file-name="Truck Order" 
                      @updateFiles="handleFileUpdates"
                    />
                  </div>
                </VCol>
              </VRow>
              
              <div class="d-flex justify-space-evenly" />
            </td>

            <!-- 👉 doEx -->
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountLOG || accountWH || accountWHSub || accountAll"
              class="text-start px-4"
              style="font-size: 12px;"
            >
              {{ (product.doEx) }}
              doEx
            </td>

            <!-- 👉 country -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountSAL || accountLOG || accountWH || accountWHSub || accountAll"
              class="text-start px-1"
              style="font-size: 12px;"
            >
              {{ (product.country) }}
            </td>

            <!-- 👉 loadingDate -->
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountSAL || accountLOG || accountWH || accountWHSub || accountAll"
              class="text-start px-1"
              style="min-width: 120px; font-size: 12px;"
            >
              {{ (product.loadingDate) }}
            </td>

            <!-- 👉 etd -->
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountSAL || accountLOG || accountWH || accountWHSub || accountAll"
              class="text-start px-1"
              style="min-width: 150px; font-size: 12px;"
            >
              <AppDateTimePicker
                v-model="product.etd"
                density="compact"
                prepend-inner-icon="ri-calendar-schedule-fill"
                :config="{ dateFormat: 'd/m/Y' }"
              />
            </td>

            <!-- 👉 eta -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountSAL || accountLOG || accountWH || accountWHSub || accountAll"
              class="text-start px-1"
              style="min-width: 150px; font-size: 12px;"
            >
              <AppDateTimePicker
                v-model="product.eta"
                density="compact"
                prepend-inner-icon="ri-calendar-schedule-fill"
                :config="{ dateFormat: 'd/m/Y' }"
              />
            </td>

            <!-- 👉 deliveryNote -->
            <td
              v-if="accountAmin || accountViewerKK || accountWH || accountWHSub || accountAll"
              class="text-start px-1"
              style="min-width: 300px; font-size: 12px;"
            >
              <div>
                <FileInputDialogCarousels
                  title-dialog="Delivery Note"
                  :type-file-input="typeFileInput"
                  file-name="Delivery Note" 
                  @updateFiles="handleFileUpdates"
                />
              </div>
            </td>

            <!-- 👉 remarkSAL -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountSAL || accountAll"
              class="text-start px-1"
              style="font-size: 12px;"
            >
              <VBtn
                style="min-width: 177px;"
                variant="outlined"
                :color="product.remarkSal ? 'primary' : 'grey'"
                @click="textAreaDialogActive('RemarkSAL', product.remarkSal, index)"
              >
                <span
                  v-if="product.remarkSal"
                  style="overflow: hidden; max-width: 130px; text-overflow: ellipsis;"
                >{{ product.remarkSal }}</span>
                <span v-else>remark(SAL)</span>
              </VBtn>
            </td>

            <!-- 👉 remarkWH -->
            <td
              v-if="accountAmin || accountViewerKK || accountLOG || accountWH || accountWHSub || accountAll"
              class="text-start px-1"
              style=" overflow: hidden; max-width: 185px; font-size: 12px; text-overflow: ellipsis;"
            >
              <VBtn
                style="min-width: 177px; max-width: 177px;"
                variant="outlined"
                :color="product.remarkWh ? 'primary' : 'grey'"
                @click="textAreaDialogActive('RemarkWH', product.remarkWh, index)"
              >
                <span
                  v-if="product.remarkWh"
                  style="overflow: hidden; max-width: 130px; text-overflow: ellipsis;"
                >{{ product.remarkWh }}</span>
                <span v-else>remark(WH)</span>
              </VBtn>
            </td>

            <!-- 👉 remarkLOG -->
            <td
              v-if="accountAmin || accountViewerKK || accountAll || accountLOG"
              class="text-start px-1"
              style="font-size: 12px;"
            >
              <VBtn
                style="min-width: 177px;"
                variant="outlined"
                :color="product.remarkLog ? 'primary' : 'grey'"
                @click="textAreaDialogActive('RemarkLOG', product.remarkLog, index)"
              >
                <span
                  v-if="product.remarkLog"
                  style="overflow: hidden; max-width: 130px; text-overflow: ellipsis;"
                >{{ product.remarkLog }}</span>
                <span v-else>remark(LOG)</span>
              </VBtn>
            </td>

            <!-- 👉 byWhow -->
            <td
              class="text-start px-1"
              style="min-width: 100px; font-size: 12px;"
            >
              {{ product.byWhow }}
            </td>

            <!-- 👉 Update now -->
            <td
              class="text-start px-1"
              style="min-width: 120px; font-size: 12px;"
            >
              {{ getRandomDate('2022-01-01', '2023-12-31') }}
            </td>
            
            <!-- 👉 Actions -->
            <td
              v-if="!accountWHSub"
              style="width: 8rem; font-size: 12px;"
              class="text-center px-1"
            >
              <VBtn
                :disabled="accountINSP"
                :color="accountINSP ? 'grey' : 'warning'"
              >
                <span style="font-size: 12px;">Save Draft</span>
              </VBtn>
            </td>
            <td
              v-if="!accountWHSub"
              style="width: 8rem; font-size: 12px;"
              class="text-center px-1"
            >
              <VBtn
                :disabled="accountINSP"
                class="mx-2"
                :color="accountINSP ? 'grey' : 'primary'"
              >
                <span style="font-size: 12px;">Submit</span>
              </VBtn>
            </td>
            <td
              v-if="accountWHSub"
              style="width: 8rem; font-size: 12px;"
              class="text-center px-1"
            >
              <VBtn
                class="mx-2"
                :color="accountINSP ? 'grey' : 'primary'"
              >
                <span style="font-size: 12px;">Approve</span>
              </VBtn>
            </td>
            <td
              style="width: 8rem; font-size: 12px;"
              class="text-center px-1"
            >
              <VBtn
                :disabled="accountINSP"
                :to="{ 
                  name: 'skt-shipping-resale',  
                }"
                :color="accountINSP ? 'grey' : 'pink-lighten-2'"
              >
                <span style="font-size: 12px;">Check Sheet</span>
              </VBtn>
            </td>
          </tr>
        </tbody>
        <!-- Total -->
        <tbody v-if="false">
          <tr>
            <td class="bg-green-lighten-5" />
            <td class="bg-green-lighten-5 px-1">
              <span style="font-size: 12px;">TOTAL</span>
            </td>
            <td class="bg-green-lighten-5" />
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll"
              class="bg-green-lighten-5 px-1"
            >
              <span style="font-size: 12px;">{{ mockData.length }} INVOICES</span>
            </td>
            <td
              v-if="accountAmin || accountViewerKK || accountAll"
              class="bg-green-lighten-5"
            />
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="bg-green-lighten-5"
            >
              <span style="font-size: 12px;">{{ mockData.length }} INVOICES</span>
            </td>
          </tr>
        </tbody>
        <VDivider />
      </VTable>

      <VDivider />
      <VCardText class="d-flex align-center flex-wrap justify-end gap-4 pa-2">
        <div
          class="d-flex align-center me-3"
          style="width: 171px;"
        >
          <span class="text-no-wrap me-3">Rows per page:</span>

          <VSelect
            v-model="rowPerPage"
            density="compact"
            variant="plain"
            class="mt-n4"
            :items="[10, 20, 30, 50]"
          />
        </div>

        <div class="d-flex align-center">
          <h6 class="text-sm font-weight-regular">
            {{ paginationData }}
          </h6>

          <VPagination
            v-model="currentPage"
            :length="totalPage"
            :total-visible="$vuetify.display.mdAndUp ? 7 : 3"
            @next="selectedRows = []"
            @prev="selectedRows = []"
          />
        </div>
      </VCardText>
    </VCard>
  </section>

  <!-- Footer -->
  <section
    v-if="false"
    section
    class="fixed-bottom"
  >
    <VCard>
      <VCardText>
        <VAlert
          color="red-lighten-3"
          style="font-size: 20px;"
        >
          (Demo) Shipment  - Version : 2.1  - Data 24 Row
        </VAlert>
      </VCardText>
    </VCard>
  </section>

  <!-- Dialog Text area -->
  <section>
    <div>
      <TextAreaDialog
        v-model="dialogVisible"
        :sap-in-value="sapInValueView"
        :lot-value="lotValueView"
        :model-value-text="dialogDataTextArea"
        :model-value-text2="dialogData2TextArea"
        :type-dialog="typeDialogView"
        :type-btn="typeBtnView"
        :title-dialog="titleDialogView"
        @submit="handleDialogSubmit"
      />
    </div>
  </section>
</template>

<style lang="scss" src="./indexTIE.scss"></style>

