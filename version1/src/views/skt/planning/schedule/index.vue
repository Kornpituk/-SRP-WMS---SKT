<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { onMounted, ref, watchEffect } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api' //---------------------- Import Api for Url *****

import { VDataTable } from 'vuetify/labs/VDataTable'

//------------------------ Get Where House Name From LocalStorage and define to whereHouseSelectedItem ---------------------------
const whereHouse = localStorage.getItem('whereHouseName')
const whereHouseSelectedItem = ref(whereHouse)

const products = ref([]) //---------------- variable for get All Product From X-Location(Where House) *****

// Get access token from localStorage in another page
const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')

//------------------------------------------ Data --------------------------------

import { useItemStore } from '@/stores/skt/receingFormStore/itemStore'

import { useGetBatchProductionPlanService } from '@/services/skt/productionPlan/services'

const { getBatchProductionplanResult, errorMessageGetBatchProductionPlan, fetchGetBatchProductionplan } = useGetBatchProductionPlanService()


const itemStore = useItemStore()

const date = ref(new Date())

function generateGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0 // สุ่มตัวเลขระหว่าง 0-15
    const v = c === 'x' ? r : (r & 0x3) | 0x8 // ถ้าเป็น 'y' ต้องให้บิตนำหน้าเป็น 10
    
    return v.toString(16) // แปลงเป็นเลขฐาน 16
  })
}

const guidForBatch = ref(null)

const newBatchGenBatch = async () => {
  try {
    // สร้าง GUID สำหรับ batch
    guidForBatch.value = generateGUID()

    // เรียกใช้ fetch และรอให้ทำงานเสร็จ
    await fetchGetBatchProductionplan(urlApi.value, 'ProductionPlan', whereHouse, accessTokenAtStore)

    // ตรวจสอบว่าผลลัพธ์ไม่เป็น undefined หรือ null
    if (getBatchProductionplanResult.value) {
      itemStore.setItemDetails(getBatchProductionplanResult.value, 'guIDForBatchCookie')

      console.log("getBatchProductionplanResult", itemStore.getItemDetails('guIDForBatchCookie'))
    } else {
      console.error("getBatchProductionplanResult.value is undefined or null")
    }
  } catch (error) {
    console.error("Error in newBatchGenBatch:", error)
  }
}



// In case of a range picker, you'll receive [Date, Date]
const format = date => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

const formatDate = date => {
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()

  return `${day}/${month}/${year}`
}

const RoleAccount = ref('User')

// ฟังก์ชันสำหรับเปลี่ยนสถานะของแถวใน productionPlan
const changeStatusProductPlanSaveDraft = index => {
  productionPlan.value[index].status = 'Save Draft'
}

const indexSubmit = ref('')

// ฟังก์ชันสำหรับเปลี่ยนสถานะของแถวใน productionPlan
const changeStatusProductPlanSubmit = index => {
  isDialogSubmitVisible.value = true
  indexSubmit.value = index
  
}

const submitProductionPlan = index => {
  productionPlan.value[index].status = 'Submit'
  isDialogSubmitVisible.value = false
  isDialogSubmitSuccessVisible.value = true
}

const defaultStatus = ref('Working')

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

const toDayDate = format(new Date())
const toDayDatePFinished = ref('NaN')

//------------------------------------------ Mock Data --------------------------------
const countItemProduction = ref(1)

const mockData = ref([
  {
    
    status: 'Working',
    inputDate: toDayDate,
    plants: "Plant A",
    reactor: "R-101",
    productionCode: "porduction Code",
    productionName: "porduction Name",
    batchScaleKgs: 500,
    productCode1: "PC2311001",
    productName1: "Chemical X",
    quantityKgs1: 1000,
    quantityPcs1: 1,
    packagingType1: "Drum",
    productCode2: "PC2311001",
    productName2: "Chemical X",
    quantityKgs2: 1000,
    quantityPcs2: 1,
    packagingType2: "Drum",
    uom: "kg",
    lotNumber: "LT12345",
    producingDate: date,
    finishedDate: toDayDatePFinished.value,
    storageCondition: "Cool, Dry Place",
    checkBy: "John",
    remark: "Urgent",
    byWho: 'John',
    statusDate: getRandomDate('2023/01/01', '2023/12/31'),
  },
])

//---------------------------- Add Mock Data --------------------------------
const isDialogAddVisible = ref(false)

const selectedItemNamePD = ref(null)

// computed property to extract product names
const productNamesMockItems = computed(() => mockData.value.map(item => item.productName))

const findProductByName = productName => {
  return mockData.value.find(item => item.productName === productName) || {}
}

const productionPlan = ref([])
const selectedItem = ref(null)
const selectedDataTables = ref([])

const addProductToPlantrue = () => {
  if (selectedItem.value) {
    const product = findProductByName(selectedItem.value)
    if (product) {
      const formattedProducingDate = formatDate(product.producingDate) // แปลงเป็น string ตาม format ที่ต้องการ

      productionPlan.value.push({ ...product, producingDate: formattedProducingDate })
    }
    isDialogAddVisible.value = false
  }
}

// ฟังก์ชันสำหรับเพิ่มแถวว่างใน productionPlan
const addEmptyRowToPlan = () => {
  
  productionPlan.value.push({
    no: countItemProduction.value,
    
    producingDate: '',

    // เพิ่มคอลัมน์อื่นๆ ตามข้อมูลใน mockData
    inputDate: '',
    plants: '',
    reactor: '',
    productionName: '',
    productionCode: '',
    batchScaleKgs: '',

    productName1: '',
    productCode1: '',
    packagingType1: '',
    packagingKgs1: '',
    packagingPcs1: '',

    productName2: '',
    productCode2: '',
    packagingType2: '',
    packagingKgs2: '',
    packagingPcs2: '',

    uom: '',
    lotNumber: '',
    storageCondition: '',
    remark: '',
    byWho: '',
    statusDate: '',
    status: 'Working',
    updateDate: '',
  })
  countItemProduction.value+= 1
}

// Watch สำหรับอัพเดทข้อมูลเมื่อเลือกชื่อสินค้า
watch(productionPlan, newPlan => {
  newPlan.forEach((item, index) => {
    if ((item.plants || item.productCode) && item.status === 'Working') {
      const product = findProductByName(item.productCode || item.plants)
      if (product && (product.plants || product.productCode)) {
        const formattedProducingDate = formatDate(product.producingDate)

        // ตรวจสอบสถานะปัจจุบันและอัพเดทเฉพาะเมื่อจำเป็น
        if (item.producingDate !== formattedProducingDate) {
          productionPlan.value[index] = { 
            ...product, 
            producingDate: formattedProducingDate, 
            status: item.status, 
          }
        }
      }
    }
  })
}, { deep: true })

// ฟังก์ชันสำหรับอัพเดทข้อมูลเมื่อเลือกชื่อสินค้า

const cancelProduct = index => {
  productionPlan.value.splice(index, 1) ; ''
  isDialogRejectVisible.value = false
}

const cancelAllProducts = () => {
  productionPlan.value = []
}

const viewAllData = () => {
  console.log('ALl Data Date', productionPlan.value)
}

const selectedDateInput = ref(toDayDate)
const rules = [v => v.length <= 150 || 'Max 25 characters']

//---------------------------------

const items = [
  'Programming',
  'Design',
  'Vue',
  'Vuetify',
]

///------------------------------------------------------------------------------
const panel = ref(['filter'])

const addBatch = ref(false)

const currentPageDataTable = ref(1)

const refeshPage = () => {
  isSpinning.value = true
  setTimeout(() => {
    isSpinning.value = false
  }, 10*1000) // ระยะเวลาในการหมุน (1000 มิลลิวินาที = 1 วินาที)
  location.reload()
}

const isSpinning = ref(false)

const headersDataTable = [
  {
    title: 'data-table-select',
    key: 'data-table-select',
    align: "center",
    fixed: true,
    readonly: true,
  },
  {
    title: 'Status',
    key: 'status',
    fixed: true,
  },
  {
    title: 'No.',
    key: 'no',
  },
  {
    title: 'Input Date',
    key: 'inputDate',
  },
  {
    title: 'Plants',
    key: 'plants',
  },
  {
    title: 'Reactor',
    key: 'reactor',
  },
  {
    title: 'Item Code',
    key: 'productCode',
  },
  {
    title: 'Item Name',
    key: 'productName',
  },
  {
    title: 'Qty(Kg.)',
    key: 'quantity',
  },
  {
    title: 'UOM(Packaging)',
    key: 'uom',
  },
  {
    title: 'Packaging Type',
    key: 'packagingType',
  },
  {
    title: 'Lot Number',
    key: 'lotNumber',
  },
  {
    title: 'Producing Date',
    key: 'producingDate',
  },
  {
    title: 'Finished Date',
    key: 'finishedDate',
  },
  {
    title: 'Remark',
    key: 'remark',
  },
  {
    title: 'Update By',
    key: 'byWho',
  },
  {
    title: 'Update Date',
    key: 'updateDate',
  },
  {
    title: 'Action',
    key: 'Action',
  },
]

const headersDataTableNew = [
  {
    title: 'data-table-select',
    key: 'data-table-select',
    align: "center",
    fixed: true,
    readonly: true,
  },
  {
    title: 'Status',
    key: 'status',
    fixed: true,
  },
  {
    title: 'No.',
    key: 'no',
  },
  {
    title: 'Input Date',
    key: 'inputDate',
  },
  {
    title: 'Plants',
    key: 'plants',
  },
  {
    title: 'Reactor',
    key: 'reactor',
  },
  {
    title: 'Production Code',
    key: 'productCode',
  },
  {
    title: 'Production Name',
    key: 'productName',
  },
  {
    title: 'Batch Scale(Kgs)',
    key: 'batchScaleKgs',
  },
  {
    title: 'Item Code1',
    key: 'productCode1',
    class: 'my-header-style',
  },
  {
    title: 'Item Name1',
    key: 'productName1',
  },
  {
    title: 'Packaging Type1',
    key: 'packagingType1',
  },
  {
    title: 'Packaging Kgs1',
    key: 'packagingKgs1',
  },
  {
    title: 'Packaging Pcs1',
    key: 'packagingPcs1',
  },

  //---------------
  {
    title: 'Item Code2',
    key: 'productCode2',
  },
  {
    title: 'Item Name2',
    key: 'productName2',
  },
  {
    title: 'Packaging Type2',
    key: 'packagingType2',
  },
  {
    title: 'Packaging Kgs2',
    key: 'packagingKgs2',
  },
  {
    title: 'Packaging Pcs2',
    key: 'packagingPcs2',
  },
  
  {
    title: 'Lot',
    key: 'lotNumber',
  },
  {
    title: 'Producing Date',
    key: 'producingDate',
  },
  {
    title: 'Finished Date',
    key: 'finishedDate',
  },
  
  {
    title: 'Remark',
    key: 'remark',
  },
  {
    title: 'Update Date',
    key: 'updateDate',
  },
  {
    title: 'Update By',
    key: 'byWho',
  },
  {
    title: 'Action',
    key: 'action',
  },
]

//--------------------- Menu

const menuDataTable = ref(false)

const itemsActionDataTable = [
  {
    title: 'Save Draft',
    value: 'Save Draft',
    icon: 'ri-save-3-line',
  },
  {
    title: 'Delete Item',
    value: 'Delete Item',
    icon: 'ri-delete-bin-5-line',
  },
  {
    title: 'Submit',
    value: 'Submit',
    icon: 'ri-upload-2-line',
  },
  {
    title: 'Print',
    value: 'Print',
    icon: 'ri-printer-line',
  },
]

const handleAction = action => {
  switch (action) {
  case 'Save Draft':
    saveDraft()
    break
  case 'Delete Item':
    deleteItem()
    break
  case 'Submit':
    submit()
    break
  case 'Print':
    print()
    break
  default:
    console.warn('Action not defined:', action)
  }
}

// ตัวอย่างฟังก์ชันของแต่ละ action
const saveDraft = () => {
  console.log('Draft saved')
}

const deleteItem = () => {
  console.log('Item deleted')
}

const submit = () => {
  console.log('Submitted')
  window.location.href = '/skt/planning/schedule/plan'
}

const print = () => {
  console.log('Printed')
}

const newBatch = async () => {
  try {
    // รอให้ newBatchGenBatch ทำงานเสร็จ
    await newBatchGenBatch()

    // เปลี่ยนเส้นทางหลังจากทำงานเสร็จ
    window.location.href = '/skt/planning/schedule/plan'
  } catch (error) {
    console.error("Error in newBatch:", error)
  }
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
                :to="{ name: 'dashboards-main',
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
                >{{ $t('Production Plan') }}</span>
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
                <!-- 👉 Select Product code -->
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <AppDateTimePicker
                    v-model="date"
                    label="Producing Date"
                    placeholder="Select date"
                    density="compact"
                    prepend-inner-icon="ri-calendar-schedule-fill"
                    :config="{ dateFormat: 'd/m/Y' }"
                  />
                </VCol>
                
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <AppDateTimePicker
                    v-model="date"
                    label="Finished Date"
                    placeholder="Select date"
                    density="compact"
                    prepend-inner-icon="ri-calendar-schedule-fill"
                    :config="{ dateFormat: 'd/m/Y' }"
                  />
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
                    :label="$t('Lot Number')"
                    type="Product Name"
                    density="compact"
                  >
                    <template #label>
                      <span style="font-size: 12px;">Lot Number</span>
                    </template>
                  </VTextField>
                </VCol>
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <VAutocomplete
                    label="Status"
                    :items="items"
                    density="compact"
                    placeholder="Select State"
                  >
                    <template #label>
                      <span style="font-size: 12px;">Status</span>
                    </template>
                  </VAutocomplete> 
                </VCol>
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <VTextField
                    v-model="searchByProductName"
                    :label="$t('Product Name')"
                    type="Product Name"
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
                  sm="6"
                  class="py-1 d-flex"
                >
                  <VRow>
                    <VCol cols="4">
                      <VBtn
                        height="100%"
                        width="100%"
                        color="primary"
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
  <!-- Dialog Add -->
  <section>
    <VDialog
      v-model="isDialogAddVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard title="Select Name To Plan">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogAddVisible = false"
        />

        <VCardText>
          <VCombobox
            v-model="selectedItem"
            :items="productNamesMockItems"
            placeholder="deployment"
          />
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            variant="outlined"
            color="secondary"
            @click="isDialogAddVisible = false"
          >
            close
          </VBtn>
          <VBtn @click="addProductToPlantrue">
            Add
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>
  <!-- Dialog Reject -->
  <section>
    <VDialog
      v-model="isDialogRejectVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard title="Comment">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogRejectVisible = false"
        />

        <VCardText>
          <VTextarea
            label="Comment"
            placeholder="Enter Comment Reject"
          />
        </VCardText>

        <VCardText class="d-flex justify-space-between flex-wrap gap-4">
          <VBtn
            color="error"
            @click="cancelProduct(indexReject)"
          >
            Reject
          </VBtn>
          <VBtn
            color="warning"
            @click="isDialogRejectVisible = false"
          >
            close
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <!-- Dialog Submit -->
  <section>
    <VDialog
      v-model="isDialogSubmitVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardText>
          <div class="d-flex justify-center">
            <VIcon
              size="100"
              color="warning"
              icon="ri-question-line"
            />
          </div>
          <div class="text-center">
            <span style="font-size: 22px; font-weight: bolder;">Are you sure you want to submit?</span>
          </div>
        </VCardText>

        <VCardAction class="d-flex justify-space-between pa-4">
          <VBtn
            color="error"
            @click="isDialogSubmitVisible = false"
          >
            Cancel
          </VBtn>
          <VBtn
            color="green"
            @click="submitProductionPlan(indexSubmit)"
          >
            Submit
          </VBtn>
        </VCardAction>
      </VCard>
    </VDialog>
  </section>
  <!-- Dialog Submit Success -->
  <section>
    <VDialog
      v-model="isDialogSubmitSuccessVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardText>
          <div class="d-flex justify-center">
            <VIcon
              size="100"
              color="success"
              icon="ri-checkbox-circle-line"
            />
          </div>
          <div class="text-center">
            <span style="font-size: 22px; font-weight: bolder;">Submission Success</span>
          </div>
        </VCardText>

        <VCardAction class="d-flex justify-center pa-4">
          <VBtn
            color="success"
            @click="isDialogSubmitSuccessVisible = false"
          >
            Continue
          </VBtn>
        </VCardAction>
      </VCard>
    </VDialog>
  </section>
  <!-- Dialog Submit Failed -->
  <section>
    <VDialog
      v-model="isDialogSubmitFailedVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardText>
          <div class="d-flex justify-center">
            <VIcon
              size="100"
              color="error"
              icon="ri-error-warning-line"
            />
          </div>
          <div class="text-center">
            <span style="font-size: 22px; font-weight: bolder;">Submission Failed</span>
          </div>
        </VCardText>

        <VCardAction class="d-flex justify-center pa-4">
          <VBtn
            color="error"
            @click="isDialogSubmitFailedVisible = false"
          >
            Continue
          </VBtn>
        </VCardAction>
      </VCard>
    </VDialog>
  </section>

  <div
    v-if="RoleAccount === 'User'"
    class="my-2"
  >
    <VCard>
      <VCardText class="pa-2">
        <VRow>
          <VCol cols="10">
            <VBtn @click="viewAllData">
              <span style="font-size: 12px;">Approve</span>
            </VBtn>
            <VBtn
              class="mx-2"
              color="info"
              @click="viewAllData"
            >
              <span style="font-size: 12px;">Finished Apporve </span>
            </VBtn>
            <VBtn
              class="mx-2"
              color="warning"
              @click="newBatch"
            >
              <span style="font-size: 12px;">New Batch</span>
            </VBtn>
        
            <VBtn
              v-if="false"
              color="info"
              class="mx-2"
              @click="addEmptyRowToPlan"
            >
              <span style="font-size: 12px;">Add Item</span>
            </VBtn>
          </VCol>
          <VCol
            cols="2"
            class="d-flex justify-end"
          >
            <VBtn
              icon
              size="small"
              @click="refeshPage"
            >
              <VIcon
                size="20"
                icon="ri-restart-line"
                :class="{ spinning: isSpinning }"
              />
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>

  <div
    v-if="RoleAccount === 'Manager'"
    class="mt-4"
  >
    <VBtn @click="viewAllData">
      Approve
    </VBtn>
    <VBtn
      color="warning"
      class="mx-4"
      @click="addEmptyRowToPlan"
    >
      Add Plan
    </VBtn>
    <VBtn
      v-if="false"
      color="error"
      @click="addEmptyRowToPlan"
    >
      Reject
    </VBtn>
  </div>

  <!-- ----------             Production plan                                ------------------------------------ -->
  <section>
    <!-- VData table -->
    <VCard>
      <VCardText>
        <VDataTable
          v-model:page="currentPageDataTable"
          v-model="selectedDataTables"
          :headers="headersDataTableNew"
          :items="productionPlan"
          :items-per-page="5"
          show-select
          class="text-no-wrap"
        >
          <template #column.action="{ column }">
            <tr style="background-color: aqua !important;">
              <th>
                {{ column.column }} action custom
              </th>
            </tr>
          </template>

          <!--
            <template #column.item1="{ column }">
            <tr class="bg-light-blue-lighten-4">
            <th class="bg-light-blue-lighten-4">
            {{ column.column }} Item 1
            <tr class="bg-light-blue-lighten-4">
            <td class="px-2">Item Code</td>
            <td class="px-2">Item Name1</td>
            <td class="px-2">Packaging Type1</td>
            <td class="px-2">Packaging Kgs1</td>
            <td class="px-2">Packaging Pcs1</td>
            </tr>
            </th>
            </tr>
            </template>
          -->
          <template #item="{ item }">
            <tr style="font-size: 14px;">
              <td
                class="text-center px-2"
                style="position: sticky; z-index: 1; left: 0;"
              >
                <VCheckboxBtn
                  v-model="selectedDataTables"
                  :value="item.raw"
                  @update:modelValue="(selected) => handleSelection(selected, item.raw)"
                />
              </td>
              <td
                style="position: sticky; z-index: 1; left: 40px; min-width: 150px;  justify-content: center; padding-block: 2px !important;"
                class="text-start"
              >
                <span v-if="item.raw.status === 'Aprove'">
                  <VChip color="success">{{ item.raw.status }}</VChip>
                </span>
                <span v-if="item.raw.status === 'Submit'">
                  <VChip color="success">{{ item.raw.status }}</VChip>
                </span>
                <span v-else-if="item.raw.status === 'Back to Edit'">
                  <VChip color="warning">{{ item.raw.status }}</VChip>
                </span>
                <span v-else-if="item.raw.status === 'Working'">
                  <VChip color="info">{{ item.raw.status }}</VChip>
                </span>
                <span v-else-if="item.raw.status === 'Save Draft'">
                  <VChip color="warning">{{ item.raw.status }}</VChip>
                </span>
                <span v-else-if="item.raw.status === 'Reject'">
                  <VChip color="error">{{ item.raw.status }}</VChip>
                </span>
              </td>
              <td>{{ item.raw.no }}</td>
              <td>
                <AppDateTimePicker
                  v-model="item.raw.inputDate"
                  density="compact"
                  prepend-inner-icon="ri-calendar-schedule-fill"
                  :config="{ dateFormat: 'd/m/Y' }"
                >
                  <template #label>
                    <span>Input Data</span>
                  </template>
                </AppDateTimePicker>
              </td>
              <td>
                <VCombobox
                  v-model="item.raw.plants"
                  :readonly="item.raw.status === 'Submit'"
                  :items="productNamesMockItems"
                  placeholder="deployment"
                  density="compact"
                  label="Plants Type"
                  style="width: 150px;"
                />
              </td>
              <td>{{ item.raw.reactor }}</td>
              <td>
                <VCombobox
                  v-model="item.raw.productionCode"
                  :items="productNamesMockItems"
                  placeholder="deployment"
                  density="compact"
                  label="Plants Code"
                  style="width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                />
              </td>
              <td>
                {{ productionName }}
              </td>
              <td
                class="px-1"
                style="min-width: 150px;"
              >
                batchScaleKgs
              </td>
              <td class="bg-light-blue-lighten-5">
                <VCombobox
                  v-model="item.raw.productCode1"
                  :items="productNamesMockItems"
                  density="compact"
                  style="width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                >
                  <template #label>
                    <span style="font-size: 12px;">Item Code 1</span>
                  </template>
                </VCombobox>
              </td>
              <td class="bg-light-blue-lighten-5">
                {{ productName1 }}
              </td>
              <td class="bg-light-blue-lighten-5">
                <VCombobox
                  v-model="item.raw.packagingType1"
                  :items="productNamesMockItems"
                  density="compact"
                  style="width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                >
                  <template #label>
                    <span style="font-size: 12px;">Packaging Type</span>
                  </template>
                </VCombobox>
              </td>
              <td class="bg-light-blue-lighten-5">
                {{ packagingKgs1 }}
              </td>
              <td class="bg-light-blue-lighten-5">
                <VTextField
                  v-model="item.raw.packagingPcs1"
                  type="number"
                  style="min-width: 100px;"
                  density="compact"
                  :readonly="item.raw.status === 'Submit'"
                >
                  <template #label>
                    <span style="font-size: 12px;">Packaging Pcs 1</span>
                  </template>
                </VTextField>
              </td>

              <td class="bg-red-lighten-5">
                <VCombobox
                  v-model="item.raw.productCode2"
                  :items="productNamesMockItems"
                  density="compact"
                  style="width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                >
                  <template #label>
                    <span style="font-size: 12px;">Item Code 2</span>
                  </template>
                </VCombobox>
              </td>
              <td class="bg-red-lighten-5">
                {{ productName2 }}
              </td>
              <td class="bg-red-lighten-5">
                <VCombobox
                  v-model="item.raw.packagingType2"
                  :items="productNamesMockItems"
                  density="compact"
                  style="width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                >
                  <template #label>
                    <span style="font-size: 12px;">Packaging Type 2</span>
                  </template>
                </VCombobox>
              </td>
              <td class="bg-red-lighten-5">
                {{ packagingKgs2 }}
              </td>
              <td class="bg-red-lighten-5">
                <VCombobox
                  v-model="item.raw.packagingPcs2"
                  :items="productNamesMockItems"
                  density="compact"
                  style="width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                >
                  <template #label>
                    <span style="font-size: 12px;">Packaging Pcs 2</span>
                  </template>
                </VCombobox>
              </td>
             
              <td
                class="px-1"
                style="min-width: 150px;"
              >
                <VTextField
                  v-model="item.raw.lotNumber"
                  density="compact"
                  style="min-width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                />
              </td>
              <td
                class="px-1"
                style="min-width: 150px;"
              >
                <AppDateTimePicker
                  v-model="item.raw.producingDate"
                  placeholder="Producing date"
                  density="compact"
                  style="font-size: 12px;"
                  prepend-inner-icon="ri-calendar-schedule-fill"
                  :config="{ dateFormat: 'd/m/Y' }"
                />
              </td>
              <td
                class="px-1"
                style="min-width: 150px;"
              >
                {{ item.raw.finishedDate }}
              </td>
              <td>
                <VTextarea
                  v-model="item.raw.remark"
                  style="min-width: 200px;"
                  class="pa-2"
                  label="Remark"
                  :rules="rules"
                  rows="2"
                  clearable
                  :readonly="item.raw.status === 'Submit'"
                >
                  <template #label>
                    <span style="font-size: 12px;">Remark</span>
                  </template>
                </VTextarea>
              </td>
              <td>
                {{ item.raw.statusDate }}
              </td>
              <td>
                {{ item.raw.byWho }}
              </td>
              <td v-if="item.raw.status !== 'Submit' || RoleAccount === 'Manager'"> 
                <div class="d-flex justify-center">
                  <VMenu transition="scale-transition">
                    <template #activator="{ props }">
                      <VIcon
                        v-bind="props"
                        icon="ri-more-2-fill"
                      />
                    </template>
                    <VList>
                      <VListItem
                        v-for="(itemAction, index) in itemsActionDataTable"
                        :key="index"
                        @click="handleAction(itemAction.value)"
                      >
                        {{ itemAction.title }}
                        <template #prepend>
                          <VIcon :icon="itemAction.icon" />
                        </template>
                      </VListItem>
                    </VList>
                  </VMenu>
                </div>
                <div v-if="false">
                  <VBtn
                    color="warning"
                    @click="changeStatusProductPlanSaveDraft(index)"
                  >
                    Save Draft
                  </VBtn>
                  <VBtn
                    v-if="RoleAccount === 'Manager'"
                    color="red"
                    class="mx-2"
                    @click="rejectProduction(index)"
                  >
                    Reject
                  </VBtn>
                  <VBtn
                    v-if="RoleAccount !== 'Manager'"
                    color="red"
                    class="mx-2"
                    @click="cancelProduct(index)"
                  >
                    Cancel
                  </VBtn>
                  <VBtn
                    v-if="RoleAccount !== 'Manager'"
                    class="mx-2"
                    color="green"
                    @click="changeStatusProductPlanSubmit(index)"
                  >
                    Submit
                  </VBtn>
                  <VBtn
                    v-if="RoleAccount === 'Manager'"
                    class="mx-2"
                    color="green"
                    @click="changeStatusProductPlanSubmit(index)"
                  >
                    Approve
                  </VBtn>
                  <VBtn
                    color="warning"
                    prepend-icon="ri-printer-fill"
                  >
                    {{ $t('Print') }}
                  </VBtn>
                </div>
              </td>
              <td v-if="item.status === 'Submit' && RoleAccount !== 'Manager'"> 
                <VBtn
                  color="grey"
                  disabled
                  @click="changeStatusProductPlanSaveDraft(index)"
                >
                  Save Draft
                </VBtn>
                <VBtn
                  color="grey"
                  disabled
                  class="mx-2"
                  @click="cancelProduct(index)"
                >
                  Cancel
                </VBtn>
                <VBtn
                  class="mx-2"
                  color="grey"
                  disabled
                  @click="changeStatusProductPlanSubmit(index)"
                >
                  Submit
                </VBtn>
              
                <VBtn
                  color="warning"
                  prepend-icon="ri-printer-fill"
                >
                  {{ $t('Print') }}
                </VBtn>
              </td>
            </tr>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>

    <VCard>
      <VCardText>
        <VDataTable
          v-model:page="currentPageDataTable"
          v-model="selectedDataTables"
          :headers="headersDataTableNew"
          :items="productionPlan"
          :items-per-page="5"
          show-select
          class="text-no-wrap"
        >
          <template #column.action="{ column }">
            <tr style="background-color: aqua !important;">
              <th>
                {{ column.column }} action custom
              </th>
            </tr>
          </template>

          <!--
            <template #column.item1="{ column }">
            <tr class="bg-light-blue-lighten-4">
            <th class="bg-light-blue-lighten-4">
            {{ column.column }} Item 1
            <tr class="bg-light-blue-lighten-4">
            <td class="px-2">Item Code</td>
            <td class="px-2">Item Name1</td>
            <td class="px-2">Packaging Type1</td>
            <td class="px-2">Packaging Kgs1</td>
            <td class="px-2">Packaging Pcs1</td>
            </tr>
            </th>
            </tr>
            </template>
          -->
          <template #item="{ item }">
            <tr style="font-size: 14px;">
              <td
                class="text-center px-2"
                style="position: sticky; z-index: 1; left: 0;"
              >
                <VCheckboxBtn
                  v-model="selectedDataTables"
                  :value="item.raw"
                  @update:modelValue="(selected) => handleSelection(selected, item.raw)"
                />
              </td>
              <td
                style="position: sticky; z-index: 1; left: 40px; min-width: 150px;  justify-content: center; padding-block: 2px !important;"
                class="text-start"
              >
                <span v-if="item.raw.status === 'Aprove'">
                  <VChip color="success">{{ item.raw.status }}</VChip>
                </span>
                <span v-if="item.raw.status === 'Submit'">
                  <VChip color="success">{{ item.raw.status }}</VChip>
                </span>
                <span v-else-if="item.raw.status === 'Back to Edit'">
                  <VChip color="warning">{{ item.raw.status }}</VChip>
                </span>
                <span v-else-if="item.raw.status === 'Working'">
                  <VChip color="info">{{ item.raw.status }}</VChip>
                </span>
                <span v-else-if="item.raw.status === 'Save Draft'">
                  <VChip color="warning">{{ item.raw.status }}</VChip>
                </span>
                <span v-else-if="item.raw.status === 'Reject'">
                  <VChip color="error">{{ item.raw.status }}</VChip>
                </span>
              </td>
              <td>{{ item.raw.no }}</td>
              <td>
                <AppDateTimePicker
                  v-model="item.raw.inputDate"
                  density="compact"
                  prepend-inner-icon="ri-calendar-schedule-fill"
                  :config="{ dateFormat: 'd/m/Y' }"
                >
                  <template #label>
                    <span>Input Data</span>
                  </template>
                </AppDateTimePicker>
              </td>
              <td>
                <VCombobox
                  v-model="item.raw.plants"
                  :readonly="item.raw.status === 'Submit'"
                  :items="productNamesMockItems"
                  placeholder="deployment"
                  density="compact"
                  label="Plants Type"
                  style="width: 150px;"
                />
              </td>
              <td>{{ item.raw.reactor }}</td>
              <td>
                <VCombobox
                  v-model="item.raw.productionCode"
                  :items="productNamesMockItems"
                  placeholder="deployment"
                  density="compact"
                  label="Plants Code"
                  style="width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                />
              </td>
              <td>
                {{ productionName }}
              </td>
              <td
                class="px-1"
                style="min-width: 150px;"
              >
                batchScaleKgs
              </td>
              <td class="bg-light-blue-lighten-5">
                <VCombobox
                  v-model="item.raw.productCode1"
                  :items="productNamesMockItems"
                  density="compact"
                  style="width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                >
                  <template #label>
                    <span style="font-size: 12px;">Item Code 1</span>
                  </template>
                </VCombobox>
              </td>
              <td class="bg-light-blue-lighten-5">
                {{ productName1 }}
              </td>
              <td class="bg-light-blue-lighten-5">
                <VCombobox
                  v-model="item.raw.packagingType1"
                  :items="productNamesMockItems"
                  density="compact"
                  style="width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                >
                  <template #label>
                    <span style="font-size: 12px;">Packaging Type</span>
                  </template>
                </VCombobox>
              </td>
              <td class="bg-light-blue-lighten-5">
                {{ packagingKgs1 }}
              </td>
              <td class="bg-light-blue-lighten-5">
                <VTextField
                  v-model="item.raw.packagingPcs1"
                  type="number"
                  style="min-width: 100px;"
                  density="compact"
                  :readonly="item.raw.status === 'Submit'"
                >
                  <template #label>
                    <span style="font-size: 12px;">Packaging Pcs 1</span>
                  </template>
                </VTextField>
              </td>

              <td class="bg-red-lighten-5">
                <VCombobox
                  v-model="item.raw.productCode2"
                  :items="productNamesMockItems"
                  density="compact"
                  style="width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                >
                  <template #label>
                    <span style="font-size: 12px;">Item Code 2</span>
                  </template>
                </VCombobox>
              </td>
              <td class="bg-red-lighten-5">
                {{ productName2 }}
              </td>
              <td class="bg-red-lighten-5">
                <VCombobox
                  v-model="item.raw.packagingType2"
                  :items="productNamesMockItems"
                  density="compact"
                  style="width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                >
                  <template #label>
                    <span style="font-size: 12px;">Packaging Type 2</span>
                  </template>
                </VCombobox>
              </td>
              <td class="bg-red-lighten-5">
                {{ packagingKgs2 }}
              </td>
              <td class="bg-red-lighten-5">
                <VCombobox
                  v-model="item.raw.packagingPcs2"
                  :items="productNamesMockItems"
                  density="compact"
                  style="width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                >
                  <template #label>
                    <span style="font-size: 12px;">Packaging Pcs 2</span>
                  </template>
                </VCombobox>
              </td>
             
              <td
                class="px-1"
                style="min-width: 150px;"
              >
                <VTextField
                  v-model="item.raw.lotNumber"
                  density="compact"
                  style="min-width: 150px;"
                  :readonly="item.raw.status === 'Submit'"
                />
              </td>
              <td
                class="px-1"
                style="min-width: 150px;"
              >
                <AppDateTimePicker
                  v-model="item.raw.producingDate"
                  placeholder="Producing date"
                  density="compact"
                  style="font-size: 12px;"
                  prepend-inner-icon="ri-calendar-schedule-fill"
                  :config="{ dateFormat: 'd/m/Y' }"
                />
              </td>
              <td
                class="px-1"
                style="min-width: 150px;"
              >
                {{ item.raw.finishedDate }}
              </td>
              <td>
                <VTextarea
                  v-model="item.raw.remark"
                  style="min-width: 200px;"
                  class="pa-2"
                  label="Remark"
                  :rules="rules"
                  rows="2"
                  clearable
                  :readonly="item.raw.status === 'Submit'"
                >
                  <template #label>
                    <span style="font-size: 12px;">Remark</span>
                  </template>
                </VTextarea>
              </td>
              <td>
                {{ item.raw.statusDate }}
              </td>
              <td>
                {{ item.raw.byWho }}
              </td>
              <td v-if="item.raw.status !== 'Submit' || RoleAccount === 'Manager'"> 
                <div class="d-flex justify-center">
                  <VMenu transition="scale-transition">
                    <template #activator="{ props }">
                      <VIcon
                        v-bind="props"
                        icon="ri-more-2-fill"
                      />
                    </template>
                    <VList>
                      <VListItem
                        v-for="(itemAction, index) in itemsActionDataTable"
                        :key="index"
                        @click="handleAction(itemAction.value)"
                      >
                        {{ itemAction.title }}
                        <template #prepend>
                          <VIcon :icon="itemAction.icon" />
                        </template>
                      </VListItem>
                    </VList>
                  </VMenu>
                </div>
                <div v-if="false">
                  <VBtn
                    color="warning"
                    @click="changeStatusProductPlanSaveDraft(index)"
                  >
                    Save Draft
                  </VBtn>
                  <VBtn
                    v-if="RoleAccount === 'Manager'"
                    color="red"
                    class="mx-2"
                    @click="rejectProduction(index)"
                  >
                    Reject
                  </VBtn>
                  <VBtn
                    v-if="RoleAccount !== 'Manager'"
                    color="red"
                    class="mx-2"
                    @click="cancelProduct(index)"
                  >
                    Cancel
                  </VBtn>
                  <VBtn
                    v-if="RoleAccount !== 'Manager'"
                    class="mx-2"
                    color="green"
                    @click="changeStatusProductPlanSubmit(index)"
                  >
                    Submit
                  </VBtn>
                  <VBtn
                    v-if="RoleAccount === 'Manager'"
                    class="mx-2"
                    color="green"
                    @click="changeStatusProductPlanSubmit(index)"
                  >
                    Approve
                  </VBtn>
                  <VBtn
                    color="warning"
                    prepend-icon="ri-printer-fill"
                  >
                    {{ $t('Print') }}
                  </VBtn>
                </div>
              </td>
              <td v-if="item.status === 'Submit' && RoleAccount !== 'Manager'"> 
                <VBtn
                  color="grey"
                  disabled
                  @click="changeStatusProductPlanSaveDraft(index)"
                >
                  Save Draft
                </VBtn>
                <VBtn
                  color="grey"
                  disabled
                  class="mx-2"
                  @click="cancelProduct(index)"
                >
                  Cancel
                </VBtn>
                <VBtn
                  class="mx-2"
                  color="grey"
                  disabled
                  @click="changeStatusProductPlanSubmit(index)"
                >
                  Submit
                </VBtn>
              
                <VBtn
                  color="warning"
                  prepend-icon="ri-printer-fill"
                >
                  {{ $t('Print') }}
                </VBtn>
              </td>
            </tr>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>
  </section>

  <!-- Footer -->
  <section class="mt-3">
    <VCard>
      <VCardText
        class="pa-1"
        style="min-width: 500px;"
      >
        <VAlert
          color="green-lighten-3"
          style="font-size: 12px;"
          class="pa-1"
        >
          Version : 2.5(Last Updated 11/11/2024 ) {{ products.length }} Rows of Data 
        </VAlert>
      </VCardText>
    </VCard>
  </section>
</template>

<style lang="scss">
.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}

// Hover For Image Product
.image-transition {
  transition: inline-size 0.2s, inline-size 0.2s;
}

.fixed-bottom {
  position: fixed;
  justify-content: center;
  inline-size: 95%;
  inset-block-end: 0;
}

.spinning {
  animation: spin 0.5s linear infinite;
}

.my-header-style {
  background: aquamarine;
}
</style>

