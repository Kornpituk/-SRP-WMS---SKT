<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { onMounted, ref, watch, watchEffect } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api' //---------------------- Import Api for Url *****

import { VDataTable } from 'vuetify/labs/VDataTable'

//------------------------ Get Where House Name From LocalStorage and define to whereHouseSelectedItem ---------------------------
const whereHouse = localStorage.getItem('whereHouseName')
const whereHouseSelectedItem = ref(whereHouse)

const products = ref([]) //---------------- variable for get All Product From X-Location(Where House) *****
const selectedDataTables = ref([])

// Get access token from localStorage in another page
const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')

//------------------------------------------ Data --------------------------------

import { useItemStore } from '@/stores/skt/receingFormStore/itemStore'

import { useGetBatchProductionPlanService, useGetProductionPlanSearchService, useApproveProductionPlanService } from '@/services/skt/productionPlan/services'

import { useFormatDateUtilities } from '@/utilities/utilities'

import { useGetCOAFormController } from '@/utilities/format'

const { formatNumber } = useGetCOAFormController()

//----------------------------------- Dialog -------------------------------------------
//------------------------ Dialog Confirm --------------------------------
import ConfirmDialog from '@/components/dialogs/alert/confirmDialog.vue'
import ConfirmDialog2 from '@/components/dialogs/alert/confirmDialog2.vue'
import AuthenticatorDialog from '@/components/dialogs/alert/alertDialog.vue'
import alertWordConst from '@/utilities/constant'

const isDialogVisibleConfirmDialog = ref(false)
const isDialogVisibleAlertDialog = ref(false)
const wordForSubmit = ref('')
const subWordForSubmit = ref('')
const successDialAlert = ref(false)
const confirmValueCheck = ref(false)

//--------------------- model --------------------------------
//-- dialog 2 
const confirmDialog2 = ref(null)


function openConfirmDialog() {
  // เรียกใช้ฟังก์ชัน openDialog ที่เปิดเผยจาก ConfirmDialog.vue

  selectedDataTables.value.forEach(item => {
    // กำหนดค่าเริ่มต้น
    console.log("selectedDataTables", item.statusId)

    if (item.statusId === 102 ) {
      wordForSubmit.value = alertWordConst.approve
      confirmDialog2.value.openDialog()
      isDialogVisibleAlertDialog.value = false
      console.log("selectedDataTables 102")
    }else if(item.statusId === 101){
      textSubAlertDialogFunction('SELECT APPROVE', "Plase select Plan Status 'Waitting for plan APVL' for approve.", false)
      console.log("selectedDataTables 101")
    }
    else{
      console.log("selectedDataTables failded")
      isDialogVisibleAlertDialog.value = false
    }

  })

}

function handleConfirmAction() {
  console.log('Confirmed! Executing action...')
  approvePlan()
}

function handleCancel() {
  console.log('Action canceled.')
}

const textAlertDialogFunction = (word, success) => {
  wordForSubmit.value = word
  successDialAlert.value = success
  isDialogVisibleAlertDialog.value = true
}

const textSubAlertDialogFunction = (word, subWord, success) => {
  wordForSubmit.value = word
  subWordForSubmit.value = subWord
  successDialAlert.value = success
  isDialogVisibleAlertDialog.value = true
}

//----------------------------------- DBClicks hightlight --------------------------------
const dataTableColor = ref('#E0F7FA')
const dataTableNummberedToggle = ref(null)

const isSelected = item => {
  return selectedDataTables.value.some(
    selectedItem => selectedItem.journalID === item.journalID,
  )
}

const dataTableCliclHighlightIsToggle = no => {
  // เช็คว่า no ที่รับเข้ามาตรงกับค่าเดิมหรือไม่
  if (dataTableNummberedToggle.value === no) {
    // ถ้าตรง ให้สลับกลับเป็น null
    dataTableNummberedToggle.value = null
  } else if (dataTableNummberedToggle.value === null) {
    // ถ้าเป็น null ให้ตั้งค่าเป็น no ใหม่
    dataTableNummberedToggle.value = no
  }

  console.log("dataTableNum", dataTableNummberedToggle.value)
}

//----------------------------------- Get Batch Production plan ---------------------------

const { getProductionplanSearchResult, errorMessageGetProductionPlanSearch, fetchGetProductionplanSearch } = useGetProductionPlanSearchService()

const filterForSearchBatchProductionPlan = ref({
  StatusID: null,
  ProductionTextSearch: "",
  ItemTextSearch: "",
  ProducingDateFrom: "",
  ProducingDateTo: "",
  LotTextSearch: "",
})

const clearModelFolter = () => {
  filterForSearchBatchProductionPlan.value.StatusID = null,
  filterForSearchBatchProductionPlan.value.ProductionTextSearch = "",
  filterForSearchBatchProductionPlan.value.ItemTextSearch = "",
  filterForSearchBatchProductionPlan.value.ProducingDateFrom = "",
  filterForSearchBatchProductionPlan.value.ProducingDateTo = "",
  filterForSearchBatchProductionPlan.value.LotTextSearch = "",
  datePickerFilter.value = ''
}

const searchResult = ref([]) // ตัวแปรสำหรับเก็บผลลัพธ์
const datePickerFilter = ref(null)
const productionPlanItems = ref([]) // กำหนดค่าเริ่มต้นเป็น array ว่าง

const formatToMMDDYYYY = date => {
  const [day, month, year] = date.split("/")
  
  return `${month}/${day}/${year}`
}

watchEffect(async () => {
  try {

    if (datePickerFilter.value) {
      console.log("datePickerFilter:", datePickerFilter.value)

      if (datePickerFilter.value.includes(" to ")) {
        // กรณีเป็นช่วงวันที่
        const [startDate, endDate] = datePickerFilter.value.split(" to ")

        filterForSearchBatchProductionPlan.value.ProducingDateFrom = formatToMMDDYYYY(startDate)
        filterForSearchBatchProductionPlan.value.ProducingDateTo = formatToMMDDYYYY(endDate)

        console.log("ช่วงวันที่:")
        console.log("ProducingDateFrom:", filterForSearchBatchProductionPlan.value.ProducingDateFrom)
        console.log("ProducingDateTo:", filterForSearchBatchProductionPlan.value.ProducingDateTo)

      } else {
        // กรณีเป็นวันเดียว
        const singleDate = datePickerFilter.value

        filterForSearchBatchProductionPlan.value.ProducingDateFrom = formatToMMDDYYYY(singleDate)
        filterForSearchBatchProductionPlan.value.ProducingDateTo = formatToMMDDYYYY(singleDate)

        console.log("วันเดียว:")
        console.log("ProducingDateFrom:", filterForSearchBatchProductionPlan.value.ProducingDateFrom)
        console.log("ProducingDateTo:", filterForSearchBatchProductionPlan.value.ProducingDateTo)
      }
    }

    await fetchGetProductionplanSearch(
      filterForSearchBatchProductionPlan.value, 
      urlApi.value, 'ProductionPlan', whereHouse, 
      accessTokenAtStore)

    // ตรวจสอบว่า getProductionplanMasterResult มี data และเป็น array
    if (getProductionplanSearchResult.value?.data && Array.isArray(getProductionplanSearchResult.value.data)) {
      
      productionPlanItems.value = getProductionplanSearchResult.value.data.map((item, index) => ({
        ...item,
        no: index + 1, // เพิ่มฟิลด์ "no" โดยเริ่มจาก 1
      }))
      console.log("productionPlanItems", productionPlanItems.value)
    } else {
      console.warn("getProductionplanSearchResult.data is not an array")
      productionPlanItems.value = []
    }
  } catch (error) {
    console.error("Error fetching production plan master data:", error)
    productionPlanItems.value = []
  }
})

//--------------------------- New batch -----------------------------------------------------

const { getBatchProductionplanResult, errorMessageGetBatchProductionPlan, fetchGetBatchProductionplan } = useGetBatchProductionPlanService()

const itemStore = useItemStore()

const date = ref(new Date())

const guidForBatch = ref(null)

const batchIDDataPlan = ref()

const newBatchGenBatch = async () => {
  try {
    if(batchIDDataPlan.value){
      itemStore.setItemDetails(batchIDDataPlan.value, 'guIDForBatchCookie')

      console.log("getBatchProductionplanResult", itemStore.getItemDetails('guIDForBatchCookie'))
    }else{
      // เรียกใช้ fetch และรอให้ทำงานเสร็จ
      await fetchGetBatchProductionplan(urlApi.value, 'ProductionPlan', whereHouse, accessTokenAtStore)

      // ตรวจสอบว่าผลลัพธ์ไม่เป็น undefined หรือ null
      if (getBatchProductionplanResult.value) {
        itemStore.setItemDetails(getBatchProductionplanResult.value, 'guIDForBatchCookie')

        console.log("getBatchProductionplanResult", itemStore.getItemDetails('guIDForBatchCookie'))
      } else {
        console.error("getBatchProductionplanResult.value is undefined or null")
      }
    }
    
  } catch (error) {
    console.error("Error in newBatchGenBatch:", error)
  }
}

//------------------------------- approved ----------------------------------------------------------------
const { responseApproveProductionPlan, errorMessageApproveProductionPlan, approveProdutcionPlanFunc } = useApproveProductionPlanService()

const approvePlan = async () => {

  const body = selectedDataTables.value.map(item => item.planningID)

  try {
  // เรียก fetchGetProductionplan และรอให้ทำงานเสร็จ
    await approveProdutcionPlanFunc(body, urlApi.value, 'ProductionPlan', whereHouse, accessTokenAtStore)
    if(responseApproveProductionPlan.value){
      textAlertDialogFunction(alertWordConst.approve, true)
      setTimeout(() => {
        location.reload()
      }, 500) // 10000 มิลลิวินาที = 10 วินาที
    }else{
      textAlertDialogFunction(alertWordConst.approve, false)
      setTimeout(() => {
        // location.reload()
      }, 500) // 10000 มิลลิวินาที = 10 วินาที
    }
  } catch (error) {
  // จัดการข้อผิดพลาด
    
    console.error("Error approved production plan:", error)
  }

  console.log("body selectedDataTables", body)
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

const selectedDateInput = ref(toDayDate)
const rules = [v => v.length <= 150 || 'Max 25 characters']

//---------------------------------

const itemsStatus = [
  { name: "All", id: null },
  { name: "Draft PROD plan", id: 101 },
  { name: "Waitting for plan APVL", id: 102 },
  { name: "Waiting for Mat. Picking", id: 103 },
  { name: "In Producing", id: 105 },
  { name: "Waiting for FG/PROD APVL", id: 107 },
  { name: "PROD Completed", id: 108 },
  { name: "Plan Rejected", id: 109 },
]

const colorStatusWithId = id => {
  switch (id) {
  case 101:
    return { color: 'orange', message: 'orange-darken-1', text: 'Draft PROD plan', bgColor: '#FFF3E0' }
  case 102:
    return { color: 'green', message: 'green', text: 'Waitting for plan APVL', bgColor: '#E8F5E9' }
  case 103:
    return { color: 'pink', message: 'pink-darken-4', text: 'Waiting for Mat. Picking', bgColor: '#FCE4EC' }
  case 105:
    return { color: 'purple', message: 'purple', text: 'In Producing', bgColor: '#F3E5F5' }
  case 107:
    return { color: 'brown', message: 'brown', text: 'Waiting for FG/PROD APVL', bgColor: '#EFEBE9' }
  case 108:
    return { color: 'green', message: 'green', text: 'PROD Completed', bgColor: '#E8F5E9' }
  case 109:
    return { color: 'red', message: 'red', text: 'Plan Rejected', bgColor: '#FFEBEE' }
  default:
    return { color: 'grey', message: 'grey', text: 'All', bgColor: '#FFF3E0' }
  }
}

///------------------------------------------------------------------------------
const panel = ref(['filter'])

const addBatch = ref(false)

const currentPageDataTable = ref(1)

const refeshPage = () => {
  isSpinning.value = true
  setTimeout(() => {
    isSpinning.value = false
  }, 10 * 1000) // ระยะเวลาในการหมุน (1000 มิลลิวินาที = 1 วินาที)
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

const newBatch = async batchID => {
  batchIDDataPlan.value = batchID
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
                :to="{
                  name: 'dashboards-main',
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
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <VAutocomplete
                    v-model="filterForSearchBatchProductionPlan.StatusID"
                    :items="itemsStatus"
                    item-title="name"
                    item-value="id"
                    density="compact"
                  >
                    <template #label>
                      <span
                        class="d-flex align-center"
                        style="font-size: 12px;"
                      >
                        Select Status
                      </span>
                    </template>

                    <template #selection="{ item }">
                      <VChip
                        variant="elevated"
                        :style="{ color: colorStatusWithId(item.raw.id).message }"
                        size="x-small"
                        style="min-height: 20px;"
                        :color="colorStatusWithId(item.raw.id).color"
                      >
                        <span class="text-white">{{ colorStatusWithId(item.raw.id).text }}</span>
                      </VChip>
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
                    v-model="filterForSearchBatchProductionPlan.ProductionTextSearch"
                    type="Product Name"
                    density="compact"
                  >
                    <template #label>
                      <span style="font-size: 12px;">Production Code/Name</span>
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
                    v-model="filterForSearchBatchProductionPlan.ItemTextSearch"
                    type="Product Name"
                    density="compact"
                  >
                    <template #label>
                      <span style="font-size: 12px;">Item Code/Name</span>
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
                  <AppDateTimePicker
                    v-model="datePickerFilter"
                    placeholder="Producing date"
                    density="compact"
                    prepend-inner-icon="ri-calendar-schedule-fill"
                    :config="{ dateFormat: 'd/m/Y', mode: 'range' }"
                  />
                </VCol>

                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <VTextField
                    v-model="filterForSearchBatchProductionPlan.LotTextSearch"
                    density="compact"
                  >
                    <template #label>
                      <span style="font-size: 12px;">Lot</span>
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
                        @click="clearModelFolter"
                      >
                        <span style="font-size: 12px;">{{ $t('Clear') }}</span>
                      </VBtn>
                    </VCol>
                    <VCol
                      cols="4"
                      md="4"
                    >
                      <VBtn
                        disabled
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
                    }}:&nbsp;</span>&nbsp;<span v-if="totalProduct">{{
                      (formatDecimal(totalProduct)).toLocaleString('en-US') }} {{ unitNameProduct }}<br><br></span>
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

  <!-- Btn Approve / PROD APPROVE / NEW BATCH -->
  <div
    v-if="RoleAccount === 'User'"
    class="my-2"
  >
    <VCard>
      <VCardText class="pa-2">
        <VRow>
          <VCol cols="10">
            <VBtn :disabled="!selectedDataTables.length > 0" @click="openConfirmDialog">
              <span style="font-size: 12px;">Approve</span>
            </VBtn>
            <VBtn
              class="mx-2"
              color="info"
              disabled
              @click="viewAllData"
            >
              <span style="font-size: 12px;">PROD Approved</span>
            </VBtn>
            <VBtn
              class="mx-2"
              color="warning"
              @click="newBatch(null)"
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
    <VBtn @click="showConfirmDialog">
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
          v-if="productionPlanItems.length > 0"
          v-model:page="currentPageDataTable"
          v-model="selectedDataTables"
          :headers="headersDataTableNew"
          :items="productionPlanItems"
          :items-per-page="10"
          show-select
          class="text-no-wrap"
        >
          <template #column.action="{ column }">
            <tr class="d-flex justify-center">
              <th>
                {{ column.column }} action
              </th>
            </tr>
          </template>
          <template #item="{ item, index }">
            <tr style="font-size: 14px;">
              <td
                class="text-center px-2 cursor-pointer"
                style="position: sticky; z-index: 1; left: 0;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <VCheckboxBtn
                  v-if="item.raw.statusId === 102"
                  v-model="selectedDataTables"
                  :value="item.raw"
                  @update:modelValue="(selected) => handleSelection(selected, item.raw)"
                />
              </td>
              <td
                style="position: sticky; z-index: 1; left: 40px; min-width: 150px;  justify-content: center; padding-block: 2px !important;"
                class="text-start cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span>
                  <VChip
                    :color="colorStatusWithId(item.raw.statusId).color"
                    :style="{ color: colorStatusWithId(item.raw.statusId).color }"
                  >{{ colorStatusWithId(item.raw.statusId).text }}</VChip>
                </span>
              </td>
              <td
                class="cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ (currentPageDataTable - 1) * 10 + index + 1 }}
              </td>
              <td
                class="cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ formatDate(item.raw.inputDate) }}
              </td>
              <td
                class="cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.plantName }}
              </td>
              <td
                class="cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.reactorName }}
              </td>
              <td
                class="cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.productionCode }}
              </td>
              <td
                class="cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.productionName }}
              </td>
              <td
                class="px-8 text-end cursor-pointer"
                style="min-width: 150px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ formatNumber(item.raw.quantityKgs) }}
              </td>
              <td
                class="bg-light-blue-lighten-5 cursor-pointer" 
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.product1SelectedCode }}
              </td>
              <td
                class="bg-light-blue-lighten-5 cursor-pointer" 
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.product1Name }}
              </td>
              <td
                class="bg-light-blue-lighten-5 cursor-pointer" 
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.product1SelectedPackagingCode }}
              </td>
              <td
                class="bg-light-blue-lighten-5 text-end cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span v-if="item.raw.product1PackingQtyKgs">{{ formatNumber(item.raw.product1PackingQtyKgs) }}</span>
                <span v-else />
              </td>
              <td
                class="bg-light-blue-lighten-5 text-end cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span v-if="item.raw.product1UomCount">{{ item.raw.product1UomCount }}</span>
                <span v-else />
              </td>

              <td
                class="bg-red-lighten-5 cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #EF9A9A' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #EF9A9A' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.product2SelectedCode }}
              </td>
              <td
                class="bg-red-lighten-5 cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #EF9A9A' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #EF9A9A' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.product2Name }}
              </td>
              <td
                class="bg-red-lighten-5  cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #EF9A9A' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #EF9A9A' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.product2SelectedPackagingCode }}
              </td>
              <td
                class="bg-red-lighten-5 text-end  cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #EF9A9A' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #EF9A9A' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span v-if="item.raw.product1PackingQtyKgs">{{ formatNumber(item.raw.product2PackingQtyKgs) }}</span>
                <span v-else />
              </td>
              <td
                class="bg-red-lighten-5 text-end  cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #EF9A9A' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #EF9A9A' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <span v-if="item.raw.product1UomCount">{{ item.raw.product2UomCount }}</span>
                <span v-else />
              </td>

              <td
                class="px-1 cursor-pointer"
                style="min-width: 150px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.lotNumber }}
              </td>
              <td
                class="px-1 text-center cursor-pointer"
                style="min-width: 150px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ formatDate(item.raw.producingDate) }}
              </td>
              <td
                class="px-1 text-center cursor-pointer"
                style="min-width: 150px;"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ formatDate(item.raw.finishedDate) }}
              </td>
              <td
                class="cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.remark }}
              </td>
              <td
                class="cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ useFormatDateUtilities(item.raw.updatedDate) }}
              </td>
              <td
                class="cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                {{ item.raw.updatedBy }}
              </td>
              <td
                class="cursor-pointer"
                :style="{ 
                  backgroundColor: 
                    dataTableNummberedToggle === item.raw.no ? dataTableColor : 
                    isSelected(item.raw) ? '#E0F7FA' : 
                    '',
                  borderTop:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : '',
                  borderBottom:
                    dataTableNummberedToggle === item.raw.no ? '1px solid #BBDEFB' : ''
                    
                }"
                @dblclick="dataTableCliclHighlightIsToggle(item.raw.no)"
              >
                <VBtn
                  color="info"
                  @click="newBatch(item.raw.batchID)"
                >
                  Action
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
          Version : 2.6(Last Updated 7/12/2024 ) {{ productionPlanItems.length }} Rows of Data
        </VAlert>
      </VCardText>
    </VCard>
  </section>

  <!-- Alert Dialog Component -->
  <section>
    <div>
      <!-- ใช้ confirmDialog component -->
      <ConfirmDialog2
        ref="confirmDialog2"
        :message="wordForSubmit"
        @confirm="handleConfirmAction"
        @cancel="handleCancel"
      />
    </div>

    <div>
      <!-- ใช้ AuthenticatorDialog component -->
      <AuthenticatorDialog
        :is-dialog-visible="isDialogVisibleAlertDialog"
        :word="wordForSubmit"
        :subword="subWordForSubmit"
        :success="successDialAlert"
        @update:isDialogVisible="(val) => isDialogVisibleAlertDialog.value = val"
      />
    </div>
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
