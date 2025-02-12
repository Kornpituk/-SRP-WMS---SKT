<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api'  //---------------------- Import Api for Url *****
import { VDataTable } from 'vuetify/labs/VDataTable'

const whereHouse = localStorage.getItem('whereHouseName')
const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')

import { useCookieStore, useItemStore } from '@/stores/skt/receingFormStore/itemStore'

const itemStore = useItemStore()

//------------------------------- alert --------------------------------------------

import AlertWord2 from '@/components/dialogs/alert/alertDialog2.vue'
import alertWordConst from '@/utilities/constant'

const isDialogVisibleAlertDialog = ref(false)
const wordForSubmit = ref('')
const subWordForSubmit = ref('')
const successDialAlert = ref(false)
const confirmDialog2 = ref(null)

const statusId = ref(0)

const textAlertDialogFunction = (word, success) => {
  subWordForSubmit.value = ''
  wordForSubmit.value = word
  successDialAlert.value = success
  isDialogVisibleAlertDialog.value = true
}

//------------------------------ Formate --------------------------------------
function formatDateSave(date) {
  if (!date) return null // หากค่าว่างให้คืน null

  const [day, month, year] = date.split('/') // แยกวันที่ตามรูปแบบ dd/mm/yyyy
  if (!day || !month || !year) return null // ตรวจสอบว่าแยกข้อมูลสำเร็จ

  // สร้างวันที่ในรูปแบบ yyyy-mm-dd
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

//------------------------------ Get User Data --------------------------------

const userDataInfo = ref(itemStore.getItemDetails('UserDataCookies'))


//------------------------------ fetch data from API --------------------------------
import { 
  useGetSearchPlanService,
  useGetItemSelectService, usePrintExportExcelService,
} from '@/services/skt/stockUpdate/services'

// import { useGetSearchPlanService } from '@/services/skt/stockUpdate/services'

//--------------------------------- Section Get Item Select ------------------------------

const { getItemSelectResult,
  errorGetItemSelect,
  fetchItemSelect } =  useGetItemSelectService()
  
const warehouseItemModel = ref()
const categoriesItemModel = ref()
const zoneItemModel = ref()
const areaItemModel = ref()
const subAreaItemModel = ref()

const warehouseModel = ref()
const categoriesModel = ref()
const zoneModel = ref()
const areaModel = ref()
const subAreaModel = ref()

const sessionDataFilter = ref(JSON.parse(sessionStorage.getItem("stockUpdateDataSession")))

const filterForSearchPlan = ref({
  categoryId: sessionDataFilter.value?.categoryId || '',
  typeId: sessionDataFilter.value?.typeId || '',
  subTypeId: sessionDataFilter.value?.subTypeId || '',
  barcode: sessionDataFilter.value?.barcode || '',
  productId: sessionDataFilter.value?.productId || '',
  productName: sessionDataFilter.value?.productName || '',
  unitId: sessionDataFilter.value?.unitId || '',
  serialNo: sessionDataFilter.value?.serialNo || '',
  zoneId: sessionDataFilter.value?.zoneId || '',
  areaId: sessionDataFilter.value?.areaId || '',
  subAreaId: sessionDataFilter.value?.subAreaId || '',
  searchByCategory: sessionDataFilter.value?.searchByCategory || '',
  searchByType: sessionDataFilter.value?.searchByType || '',
  searchBySubType: sessionDataFilter.value?.searchBySubType || '',
  searchByBarcode: sessionDataFilter.value?.searchByBarcode || '',
  searchByProductId: sessionDataFilter.value?.searchByProductId || '',
  searchByProductName: sessionDataFilter.value?.searchByProductName || '',
  searchByUnit: sessionDataFilter.value?.searchByUnit || '',
  sortByCategory: sessionDataFilter.value?.sortByCategory || '',
  sortByType: sessionDataFilter.value?.sortByType || '',
  sortBySubType: sessionDataFilter.value?.sortBySubType || '',
  sortByBarcode: sessionDataFilter.value?.sortByBarcode || '',
  sortByProductId: sessionDataFilter.value?.sortByProductId || '',
  sortByProductName: sessionDataFilter.value?.sortByProductName || '',
  sortByUnit: sessionDataFilter.value?.sortByUnit || '',
  sortByQty: sessionDataFilter.value?.sortByQty || '',
  sortByTags: sessionDataFilter.value?.sortByTags || '',
  sortByNonTags: sessionDataFilter.value?.sortByNonTags || '',
})


const handleFetchItemSelectFilter = async (form, type, params) => {
  try{
    const result = await fetchItemSelect(
      urlApi.value,
      form,
      whereHouse,
      accessTokenAtStore,
      params,
      type,
    )

    if(result){
      // console.log(`result ${type}`, result)

      return result
    }else{
      console.log(errorGetItemSelect.value)
    }
  }catch(error){
    console.log(error)
  }
}

watch(async () => {
  const [warehouse, zone, area, subarea, categories] = await Promise.all([
    handleFetchItemSelectFilter('warehouse', '', ''),
    handleFetchItemSelectFilter('zone', '', ''),
    handleFetchItemSelectFilter('area', 'zoneCode', zoneModel.value),
    handleFetchItemSelectFilter('subArea', zoneModel.value, areaModel.value),
    handleFetchItemSelectFilter('Categories', 'Categories', ''),
  ])

  warehouseItemModel.value = warehouse
  zoneItemModel.value = zone
  areaItemModel.value = area
  subAreaItemModel.value = subarea
  categoriesItemModel.value = categories

})

//------------------------------- Function Get Search plan -----------------

// const { getSearchPlanResult, errorGetSearchPlan, fetchSearchPlan } = useGetSearchPlanService()

const { getSearchPlanResult,
  errorGetSearchPlan,
  fetchSearchPlan } =useGetSearchPlanService()

const searchPlanData = ref([])
const isLoading = ref(false)

import mockDataImport from './dataMock'

const selectedDataTables = ref([])

const currentPage = ref(1)
const itemsPerPage = ref(10)
const selectedItemsPerPage = ref(10)

//----------------------------- Expand Table Row -------------------------------------
const expandedRows = ref([])
const expendTest = ref(false)
const indexExpendRow = ref('')

// ฟังก์ชันสำหรับเปิด/ปิดการขยายแถว
const toggleRow = index => {
  if (expandedRows.value.includes(index)) {
    expandedRows.value = expandedRows.value.filter(i => i !== index)
    console.log('expandedRows if', expandedRows.value)
    expendTest.value = false
  } else {
    expandedRows.value.push(index)
    console.log('expandedRows else', expandedRows.value)
    expendTest.value = true
  }
}

watch(selectedItemsPerPage, newVal => {
  const newItems = newVal === 'All' ? totalItems.value : newVal
  if (itemsPerPage.value !== newItems) {
    itemsPerPage.value = newItems
    currentPage.value = 1 // รีเซ็ตหน้าเป็นหน้าแรกเมื่อเปลี่ยนจำนวนรายการต่อหน้า
  }
})

const totalItems = computed(() => searchPlanData.value.length)

// คำนวณจำนวนหน้าทั้งหมด
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

watch(currentPage, newVal => {
  if (newVal < 1) currentPage.value = 1
  if (newVal > totalPages.value) currentPage.value = totalPages.value
})

const formatToDate = dateString => {
  if (!dateString) return null // จัดการค่าว่าง
  const date = new Date(dateString)
  if (isNaN(date)) return null // จัดการค่าที่ไม่ใช่วันที่
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  
  return `${day}/${month}/${year}`
}

const goToFirstPage = () => (currentPage.value = 1)
const goToPrevPage = () => (currentPage.value = Math.max(1, currentPage.value - 1))
const goToNextPage = () => (currentPage.value = Math.min(totalPages.value, currentPage.value + 1))
const goToLastPage = () => (currentPage.value = totalPages.value)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = currentPage.value * itemsPerPage.value

  return searchPlanData.value.slice(start, end)

})

const itemsStatus = ([
  { name: 'Cancel', id: 200, color: 'blue-grey' },
  { name: 'ETL Failed!', id: 201, color: 'deep-orange' },
  { name: 'Waiting for Shipping', id: 202, color: 'pink' },
  { name: 'Draft Shipping', id: 203, color: 'amber' },

  // { name: 'Waiting for SAL Draft', id: 302, color: 'pink' },
  // { name: 'SAL Draft Shipping', id: 303, color: 'amber' },
  // { name: 'SAL Submitted', id: 304, color: 'teal' },

  // { name: 'Waiting for WH Draft', id: 402, color: 'pink' },
  // { name: 'WH Draft Shipping', id: 403, color: 'amber' },
  // { name: 'WH Submitted', id: 404, color: 'teal' },

  // { name: 'Waiting FOR LOG Draft', id: 502, color: 'pink' },
  // { name: 'LOG Draft Shipping', id: 503, color: 'amber' },
  // { name: 'LOG Submitted', id: 504, color: 'teal' },

  // { name: 'Waiting FOR INSP Draft', id: 602, color: 'pink' },
  // { name: 'INSP Draft Shipping', id: 603, color: 'amber' },
  // { name: 'INSP Submitted', id: 604, color: 'teal' },

  // { name: 'Waiting for CS Draft', id: 1002, color: 'pink' },
  // { name: 'CS1 Draft Shipping', id: 1003, color: 'amber' },
  // { name: 'CS2 Draft Shipping', id: 1004, color: 'amber' },
  // { name: 'CS Submitted', id: 1005, color: 'teal' },

  // { name: 'Waiting for Draft', id: 1102, color: 'pink' },
  // { name: 'Draft Shipping LF', id: 1103, color: 'amber' },
  // { name: 'Waiting for Lorry/Flex APVL', id: 1104, color: 'amber' },
  // { name: 'Lorry/Flex Submitted', id: 1105, color: 'teal' },

  { name: 'In Submitting', id: 204, color: 'pink' },
  { name: 'Waiting for WH APVL', id: 205, color: 'brown' },
  { name: 'Shipping Rejected', id: 206, color: 'red' },
  { name: 'Shipping Completed', id: 207, color: 'green' },

  { name: 'All', id: 0, color: 'grey' },

])

// --------------- Model Sort by

const sortColumn = ref('')
const sortDirection = ref('')

const etaDateModel = ref(sessionStorage.getItem("ETASearchProductionFilter"))
const etdDateModel = ref(sessionStorage.getItem("ETDSearchProductionFilter"))

const saveHistoryFilter = () => {
  
  sessionStorage.setItem('stockUpdateDataSession', JSON.stringify(filterForSearchPlan.value))
}

// ฟังก์ชันสำหรับสลับสถานะของไอคอนแต่ละตัว---------------------------------
const toggleDirection = async key => {
  if (key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    console.log(`Sorting direction is now: ${sortDirection.value} --> ${key}`)
  }
  sortColumn.value = key
  await searchShipmentPlan()
}

//- เปรียบเทียบ status text = id
function getStatusIdByName(statusName) {
  const matchedItem = itemsStatus.find(item => item.name === statusName)
  
  return matchedItem ? matchedItem.id : '' // คืนค่า id หรือ null หากไม่พบ
}

const searchShipmentPlan = async () => {
  isLoading.value = true

  

  const statusID  = getStatusIdByName(filterForSearchPlan.value.StatusId)

  try {
    const result = await fetchSearchPlan(
      urlApi.value,
      'StockUpdate',
      whereHouse,
      accessTokenAtStore,
      filterForSearchPlan.value,
      statusID,
    )

    if (result) {
      searchPlanData.value = getSearchPlanResult.value // เก็บข้อมูลใน reactive stat

      console.log(`Fetched search plan:`, searchPlanData.value)
    } else {
      console.error('No result from API')
      searchPlanData.value = [] // Set empty data if no result
    }
  } catch (error) {
    console.error(`Error fetching search plan:`, error)
    console.error(`Error(service) fetching search plan:`, errorGetSearchPlan)
    searchPlanData.value = [] // Set empty data on error
  } finally {
    isLoading.value = false // Stop loading indicator
  }
}

onMounted(async () => {
  await searchShipmentPlan()
})

const searchFilterPlanFunctionBtn = async () => {

  saveHistoryFilter()

  await searchShipmentPlan()

}

const clearFilterPlanFunctionBtn = async () => {
  filterForSearchPlan.value = {
    StatusId: '',
    ETA: '',
    ETD: '',
    SalesOrderNoSearch: '',
    PayerNameSearch: '',
    ItemNameSearch: '',
    LotSearch: '',
    SortColumn: '',
    SortDirection: '',
  }

  etaDateModel.value = ''
  etdDateModel.value = ''
}

//-------------------------------------------- Export Excel -----------------------


const { printExportExcelResult,
  printExportExcelErrorMessage,
  printExportExcelService } = usePrintExportExcelService()

//--------------------------------------------- Print section --------------
const isDialogPrintVisible = ref(false)

const  loadingPrint = ref(false) 

const printShipmentPDFBySoEIdPlan = async type => {
  loadingPrint.value = true
  console.log('loadingPrint', loadingPrint.value)

  saveHistoryFilter()

  const statusID  = getStatusIdByName(filterForSearchPlan.value.StatusId)

  try {
    // ✅ เรียก printShipmentPDF
    const result = await printExportExcelService(
      urlApi.value,
      type,
      'Detail',
      whereHouse,
      accessTokenAtStore,
      filterForSearchPlan.value,
      statusID,
      
    )
    
    if (result) {
      console.log('result print', result)

      // textAlertDialogFunction(alertWordConst.print, true)

      // setTimeout(() => {
      //   // location.reload()
      // }, 500)
    } else {
      textAlertDialogFunction(alertWordConst.print, false)
    }

  } catch (error) {
    console.error(`Error printing shipment PDF:`, error)
  } finally {
    loadingPrint.value = false
  }
}

//--------------------------------------- highlight -------------------
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


//-------------------------- format decimal -------------------

import { useGetCOAFormController } from '@/utilities/format'
import { onMounted, watch } from 'vue'

const { formatNumber } = useGetCOAFormController()

const formatDecimal = decimal => {
  const configsShowDigit = localStorage.getItem('configsShowDigit')
  if (configsShowDigit == 'true') {
    return Math.ceil(decimal)
  } else {
    return decimal
  }
}

const formatDate = date => {
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()

  return `${day}/${month}/${year}`
}

//------------------------ Dialog Image ----------------------------
const isDialogImageVisible = ref(false)
const urlImage = ref('')
const nameImage = ref('')

const showImage = url => {
  console.log('Show Image:', url)
  urlImage.value = url
  isDialogImageVisible.value = true
}

const checkRFID = ref ('')

watchEffect(() =>{
  const checkRFIDUpdate = ref (localStorage.getItem('configsShowRfdi'))
  if(checkRFIDUpdate.value === 'true'){
    // console.log('RFID Check True:'+ checkRFIDUpdate.value)
    checkRFID.value = true
  } else if (checkRFIDUpdate.value === 'false') {
    // console.log('RFID Check False:'+ checkRFIDUpdate.value)
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

//----------------------------------------- fetch data ----------------------------------

//-------------------
//----- Rune
const rules = [v => v.length <= 150 || 'Max 25 characters']

//--------- new expention
const panel = ref(['filter'])

///---------------- Dialog 
const isDialogVisiblePrintTruck = ref(false)

///------------ Dialog PDF

const isDialogPDFViewVisible = ref(false)
const currentPageDataTable = ref(1)
const imgDialogPDF = ref('')
const imgDialogPng = ref('')

//------------------------------------------ Check Sheet To Page Resale -----------------------

const isSpinning = ref(false)

const refeshPage = () => {
  isSpinning.value = true
  setTimeout(() => {
    isSpinning.value = false
  }, 10 * 1000) // ระยะเวลาในการหมุน (1000 มิลลิวินาที = 1 วินาที)
  location.reload()
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
                >{{ $t('Stock Update') }}</span>
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
                  lg="3"
                  sm="6"
                  class="py-1"
                >
                  <VSelect
                    v-model="warehouseModel"
                    :items="warehouseItemModel"
                    label="Warehouse"
                    item-title="name"
                    item-value="id"
                    density="compact"
                    eager
                  >
                    <template #label>
                      <span
                        class="d-flex align-center"
                        style="font-size: 14px;"
                      >
                        Warehouse
                      </span>
                    </template>
                  </VSelect>
                </VCol>

                <VCol
                  cols="12"
                  lg="3"
                  sm="6"
                  class="py-1"
                >
                  <VSelect
                    v-model="filterForSearchPlan.zoneId"
                    :items="zoneItemModel"
                    label="Warehouse"
                    density="compact"
                    item-title="name"
                    item-value="id"
                    eager
                  >
                    <template #label>
                      <span
                        class="d-flex align-center"
                        style="font-size: 14px;"
                      >
                        Zone
                      </span>
                    </template>
                  </VSelect>
                </VCol>
                <VCol
                  cols="12"
                  lg="3"
                  sm="6"
                  class="py-1"
                >
                  <VSelect
                    v-model="filterForSearchPlan.areaId"
                    :items="areaItemModel"
                    label="Warehouse"
                    item-title="name"
                    item-value="id"
                    density="compact"
                    eager
                  >
                    <template #label>
                      <span
                        class="d-flex align-center"
                        style="font-size: 14px;"
                      >
                        Area
                      </span>
                    </template>
                  </VSelect>
                </VCol>
                <!-- 👉 Select Product code -->
                <VCol
                  cols="12"
                  lg="3"
                  sm="6"
                  class="py-1"
                >
                  <VTextField
                    v-model="filterForSearchPlan.SalesOrderNoSearch"
                    density="compact"
                  >
                    <template #label>
                      <span style="font-size: 14px;">Lot</span>
                    </template>
                  </VTextField>
                </VCol>

                <VCol
                  cols="12"
                  lg="3"
                  sm="6"
                  class="py-1"
                >
                  <!-- 👉 Search Product code -->
                  <VSelect
                    v-model="filterForSearchPlan.subAreaId"
                    :items="subAreaItemModel"
                    label="Warehouse"
                    item-title="name"
                    item-value="id"
                    density="compact"
                    eager
                  >
                    <template #label>
                      <span
                        class="d-flex align-center"
                        style="font-size: 14px;"
                      >
                        Categories
                      </span>
                    </template>
                  </VSelect>
                </VCol>

                <!-- 👉 Select Product Name -->
                <VCol
                  cols="12"
                  lg="3"
                  sm="6"
                  class="py-1"
                >
                  <VTextField
                    v-model="filterForSearchPlan.searchByProductId"
                    density="compact"
                  >
                    <template #label>
                      <span style="font-size: 14px;">Item Code</span>
                    </template>
                  </VTextField>
                </VCol>
                <!-- 👉 Select Product Name -->
                <VCol
                  cols="12"
                  lg="3"
                  sm="6"
                  class="py-1"
                >
                  <VTextField
                    v-model="filterForSearchPlan.searchByProductName"
                    density="compact"
                  >
                    <template #label>
                      <span style="font-size: 14px;">Item Name</span>
                    </template>
                  </VTextField>
                </VCol>
                <VCol
                  cols="12"
                  lg="3"
                  class="py-1"
                >
                  <VRow class="d-flex justify-end">
                    <VCol
                      class="px-2"
                      cols="4"
                    >
                      <VBtn
                        height="100%"
                        width="100%"
                        color="green"
                        density="compact"
                        class="mx-0"
                        
                        @click="searchFilterPlanFunctionBtn"
                      >
                        <span style="font-size: 14px;">{{ $t('Search') }}</span>
                      </VBtn>
                    </VCol>
                    <VCol
                      class="px-2"
                      cols="4"
                    >
                      <VBtn
                        color="red"
                        height="100%"
                        width="100%"
                        density="compact"
                        @click="clearFilterPlanFunctionBtn"
                      >
                        <span style="font-size: 14px;">{{ $t('Clear') }}</span>
                      </VBtn>
                    </VCol>
                    <VCol
                      cols="4"
                      md="4"
                      class="px-2"
                    >
                      <VBtn
                        density="compact"
                        class=""
                        color="warning"
                        style="width: 100%; height: 40px;"
                        @click="isDialogPrintVisible = true"
                      >
                        <img
                          src="/src/assets/images/icons/vscode-icons_file-type-excel2.png"
                          style="width: 27px;"
                          class="custom-small-img"
                        >
                        <span style="font-size: 14px;">{{ $t('Export file') }}</span>
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
        <VCardTitle class="d-flex justify-space-between">
          <div>
            <span>{{ $t('Image Product') }}</span>
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
          :src="urlImage"
          cover
        />
      </VCard>
    </VDialog>
  </section>

  <section>
    <VDialog
      v-model="isDialogPrintVisible"
      persistent
      class=""
      max-width="500"
    >
      <VCard>
        <VCardTitle class="text-center">
          <span>Export Stock Update</span>
        </VCardTitle>
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogPrintVisible = false"
        />

        <VCardText>
          <VRow>
            <VCol cols="12>">
              <VBtn
                color="green-lighten-1"
                style="width: 100%; height: 150px;"
                class="d-flex justify-center"
                @click="printShipmentPDFBySoEIdPlan('StockUpdate')"
              >
                <VRow class="d-flex justify-center">
                  <VCol cols="12">
                    <VIcon
                      size="80"
                      icon="ri-list-check-2"
                      color="white"
                    />
                  </VCol>
                  <VCol
                    class="py-0"
                    cols="6"
                  >
                    <span class="text-center text-white">{{ $t('Summary') }}</span>
                  </VCol>
                </VRow>
              </VBtn>
            </VCol>
            <VCol cols="6>">
              <VBtn
                color="info"
                style="width: 100%; height: 100%;"
                class="d-flex justify-center"
                @click="printShipmentPDFBySoEIdPlan('StockUpdateByItem')"
              >
                <VRow class="d-flex justify-center">
                  <VCol cols="12">
                    <VIcon
                      size="80"
                      icon="ri-quote-text"
                    />
                  </VCol>
                  <VCol
                    class="py-0"
                    cols="6"
                  >
                    <span class="text-center">{{ $t('Details') }}</span>
                  </VCol>
                </VRow>
              </VBtn>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <!-- Btn Test Role -->
  <div
    v-if="false"
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

  <!-- Btn Approve / PROD APPROVE / NEW BATCH -->
  <div class="my-2">
    <VCard>
      <VCardText class="pa-2">
        <VRow>
          <VCol cols="10" />
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
          <VBtn
            v-if="false"
            @click="testValue"
          >
            Test
          </VBtn>
        </VRow>
      </VCardText>
    </VCard>
  </div>

  <!-- ----------             Product  SKT                                  ------------------------------------ -->
  <section>
    <VCard class="mt-6">
      <div>
        <div
          v-if="errorMessage"
          class="error"
        >
          {{ errorMessage }}
        </div>
        <VProgressLinear
          v-if="!paginatedData && !isLoading"
          height="20"
          color="secondary"
          class="elevation-1"
        >
          <span>No Data....</span>
        </VProgressLinear>
        <VProgressLinear
          v-if="isLoading"
          height="20"
          indeterminate
          color="primary"
          class="elevation-1"
        >
          <span>Loading Data.... {{ errorMessage }}</span>
        </VProgressLinear>
      </div>
      <section v-if="!isLoading">
        <VTable class="text-wrap table-header-bg rounded-0">
          <!-- 👉 table head -->
          <thead>
            <tr>
              <th />
              <th class="px-1">
                No.
              </th>
              <th class="px-1">
                Image
              </th>
              <th class="px-1">
                Item Code
              </th>
              <th class="px-1">
                Item Name
              </th>
              <th class="px-1">
                Categories
              </th>
              <th class="px-1">
                Lot
              </th>
              <th class="px-1">
                Lot Qty
              </th>
              <th class="px-1">
                Total Qty
              </th>
              <th class="px-1">
                UoM
              </th>
              <th class="px-1">
                Warehouse
              </th>
              <th class="px-1">
                Zone
              </th>
              <th class="px-1">
                Area
              </th>
              <th class="px-1 text-end">
                Shelf Life (Days)
              </th>
              <th class="px-1">
                Expired Date
              </th>
            </tr>
          </thead>
          <!-- 👉 table body -->
          <tbody>
            <template
              v-for="(item, index) in paginatedData"
              :key="item.no"
            >
              <!-- แถวหลัก -->
              <tr>
                <td>
                  <VBtn
                    variant="text"
                    icon
                    @click="toggleRow(index)"
                  >
                    <VIcon :icon="expandedRows.includes(index) ? 'ri-arrow-down-s-line' : 'ri-arrow-up-s-line'" />
                  </VBtn>
                </td>
                <td>{{ item.no }}</td>
                <td
                  class="cursor-pointer"
                  @click="showImage(item.image)"
                >
                  <img
                    v-if="item.image"
                    :src="item.image"
                    alt="Item Image"
                    width="50"
                    @click="showImage(item.image)"
                  >
                </td>
                <td
                  class="px-1"
                  style="min-width: 170px; max-width: 170px;  font-size: 14px;"
                >
                  {{ item.productId }}
                </td>
                <td
                  class="px-1"
                  style="min-width: 200px; max-width: 200px;  font-size: 14px;"
                >
                  {{ item.productName }}
                </td>
                <td
                  class="px-1"
                  style="min-width: 110px; max-width: 110px;  font-size: 14px;"
                >
                  {{ item.category }}
                </td>
                <td
                  class="px-1"
                  style="min-width: 120px; max-width: 120px;  font-size: 14px;"
                >
                  {{ item.lot }}
                </td>
                <td
                  class="px-1"
                  style="min-width: 70px; max-width: 70px;  font-size: 14px;"
                >
                  {{ item.locations.length }}
                </td>
                <td
                  class="px-1"
                  style="min-width: 80px; max-width: 80px;  font-size: 14px;"
                >
                  {{ item.qty }}
                </td>
                <td
                  class="px-1"
                  style="min-width: 30px; max-width: 30px;  font-size: 14px;"
                >
                  {{ item.unitName }}
                </td>
                <td
                  class="px-1"
                  style="min-width: 110px; max-width: 110px;  font-size: 14px;"
                >
                  {{ item.stockName }}
                </td>
                <td
                  class="px-1"
                  style="min-width: 100px; max-width: 100px;  font-size: 14px;"
                >
                  {{ item.zoneName }}
                </td>
                <td
                  class="px-1"
                  style="min-width: 120px; max-width: 120px;  font-size: 14px;"
                >
                  {{ item.areaName }}
                </td>
                <td
                  class="px-1 text-end"
                  style="min-width: 150px; max-width: 150px;  font-size: 14px;"
                >
                  <span
                    v-if="item.shelfLifeDays < 1"
                    class="text-red text-end"
                  >{{ item.shelfLifeDays }}</span>
                  <span v-else>{{ item.shelfLifeDays }}</span>
                </td>
                <td
                  class="px-1"
                  style="min-width: 120px; max-width: 120px;  font-size: 14px;"
                >
                  <span
                    v-if="item.shelfLife < 1"
                    class="text-red text-end"
                  >{{ formatToDate(item.expirationDate) }}</span>
                  <span v-else>{{ formatToDate(item.expirationDate) }}</span>
                </td>
              </tr>
              <!-- แถวที่ขยาย (Expandable Row) -->
              <tr v-if="expandedRows.includes(index)">
                <td colspan="16">
                  <div class="py-2 px-6 d-flex justify-center">
                    <VTable>
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>Lot No.</th>
                          <th>Qty</th>
                          <th>UoM</th>
                          <th>No. Lot Qty</th>
                          <th>Pallet Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(batch, batchIndex) in item.locations"
                          :key="batchIndex"
                        >
                          <td
                            style="font-size: 14px;"
                            :style="{ backgroundColor: batchIndex % 2 === 0 ? '#f7f7f9' : '#f0f0f0', height: '36px' }"
                          >
                            {{ batch.no }}
                          </td>
                          <td
                            style="font-size: 14px;"
                            :style="{ backgroundColor: batchIndex % 2 === 0 ? '#f7f7f9' : '#f0f0f0', height: '36px' }"
                          >
                            {{ batch.productId }}
                          </td>
                          <td
                            style="font-size: 14px;"
                            :style="{ backgroundColor: batchIndex % 2 === 0 ? '#f7f7f9' : '#f0f0f0', height: '36px' }"
                          >
                            {{ batch.productName }}
                          </td>
                          <td
                            style="font-size: 14px;"
                            :style="{ backgroundColor: batchIndex % 2 === 0 ? '#f7f7f9' : '#f0f0f0', height: '36px' }"
                          >
                            {{ batch.lot }}
                          </td>
                          <td
                            style="font-size: 14px;"
                            :style="{ backgroundColor: batchIndex % 2 === 0 ? '#f7f7f9' : '#f0f0f0', height: '36px' }"
                          >
                            {{ batch.qty }}
                          </td>
                          <td
                            style="font-size: 14px;"
                            :style="{ backgroundColor: batchIndex % 2 === 0 ? '#f7f7f9' : '#f0f0f0', height: '36px' }"
                          >
                            {{ batch.unitName }}
                          </td>
                          <td
                            style="font-size: 14px;"
                            :style="{ backgroundColor: batchIndex % 2 === 0 ? '#f7f7f9' : '#f0f0f0', height: '36px' }"
                          >
                            {{ batch.lotDescription }}
                          </td>
                          <td
                            style="font-size: 14px;"
                            :style="{ backgroundColor: batchIndex % 2 === 0 ? '#f7f7f9' : '#f0f0f0', height: '36px' }"
                          >
                            {{ batch.productName }}
                          </td>
                        </tr>
                      </tbody>
                    </VTable>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </VTable>

        <VDivider />
        <VCardText>
          <div class="d-flex align-center flex-no-wrap justify-end pa-2">
            <VSelect
              v-model="selectedItemsPerPage"
              style="max-width: 80px;"
              :items="[10, 25, 50, 100, 'All']"
              hide-details
              density="compact"
              dense
              class="mx-4"
            />
            <span>
              {{ (currentPage - 1) * itemsPerPage + 1 }} -
              {{ Math.min(currentPage * itemsPerPage, totalItems) }}
              of {{ totalItems }}
            </span>
            <div class="pagination-container">
              <VBtn
                icon
                variant="text"
                :disabled="currentPage === 1"
                @click="goToFirstPage"
              >
                <VIcon>ri-skip-left-line</VIcon>
              </VBtn>
              <VBtn
                icon
                variant="text"
                :disabled="currentPage === 1"
                @click="goToPrevPage"
              >
                <VIcon>mdi-chevron-left</VIcon>
              </VBtn>
              <VBtn
                icon
                variant="text"
                :disabled="currentPage === totalPages"
                @click="goToNextPage"
              >
                <VIcon>mdi-chevron-right</VIcon>
              </VBtn>
              <VBtn
                icon
                variant="text"
                :disabled="currentPage === totalPages"
                @click="goToLastPage"
              >
                <VIcon>ri-skip-right-line</VIcon>
              </VBtn>
            </div>
          </div>
        </VCardText>
      </section>
    </VCard>
  </section>
</template>

<style scoped lang="scss" src="./indexTIE.scss"></style>

