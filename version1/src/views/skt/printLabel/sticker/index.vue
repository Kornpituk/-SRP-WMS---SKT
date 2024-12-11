<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { onMounted, ref, watch, watchEffect } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api' //---------------------- Import Api for Url *****

//------------------------ Get Where House Name From LocalStorage and define to whereHouseSelectedItem ---------------------------
const whereHouse = localStorage.getItem('whereHouseName')
const whereHouseSelectedItem = ref(whereHouse)

// conmot reeails

const products = ref([]) //---------------- variable for get All Product From X-Location(Where House) *****

const panel = ref(['filter']) //---------------- variable for

// Get access token from localStorage in another page
const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')

//------------------- 
//----------------------------------- DBClicks hightlight --------------------------------

const dataTableNummberedToggle = ref(null)

//---------------- format
function convertDate(dateString) {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  
  return `${day}/${month}/${year}`
}

const dataHeaders = [
  {
    title: 'Dessert (100g serving)',
    align: 'start',
    sortable: false,
    key: 'name',
  },
  { title: 'Calories', key: 'calories', align: 'end' },
  { title: 'Fat (g)', key: 'fat', align: 'end' },
  { title: 'Carbs (g)', key: 'carbs', align: 'end' },
  { title: 'Protein (g)', key: 'protein', align: 'end' },
  { title: 'Iron (%)', key: 'iron', align: 'end' },
]

const formatNumber = value => {
  if (value !== null && value !== undefined) {
    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  
  return '0.00'
}

///--------------------------------- 

const printLabelForm = () => {

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.get(`${urlApi.value}/api/v1/StockUpdatsdsde?page=`+currentPage.value+`&perPage=`+rowPerPage.value, {
    params: {
      categoryId: searchByCategoryId.value,
      typeId: searchByTypeId.value,
      subTypeId: searchBySubTypeId.value,
      barcode: searchByBarcode.value,
      productId: searchByProductId.value,
      productName: searchByProductName.value,
      unitId: searchByUOMId.value,
      zoneId: searchByZoneId.value,
      areaId: searchByAreaId.value,
      subAreaId: searchBySubAreaId.value,
      serialNo: serialProductCode.value,

      searchByCategory: searchByCategoryName.value,
      searchByType: searchByTypeName.value,
      searchBySubType: searchBySubTypeName.value,
      searchByBarcode: searchByBarcodeName.value,
      searchByProductId: searchByProductCodeName.value,
      searchByProductName: searchByProductNameFilter.value,
      searchByUnit: searchByUnitName.value,

      'sortByCategory': sortByCategory.value,
      'sortByType': sortByType.value,
      'sortBySubType': sortBySubType.value,
      'sortByBarcode': sortByBarcode.value,
      'sortByProductId': sortByProductId.value,
      'sortByProductName': sortByProductName.value,
      'sortByUnit': sortByUnit.value,
      'sortByQty': sortByQty.value,
      'sortByTags': sortByTags.value,
      'sortByNonTags': sortByNonTags.value,

    // ... and so on with other parameters
    },
    headers: {
      'accept': '*/*',
      'x-location': `${searchByWareHouseId.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {

      products.value = response.data.items
      totalCount.value = response.data.totalCount
      currentPage.value = response.data.page
      totalPage.value = response.data.totalPages
      rowPerPage.value = response.data.perPage

      console.log('[products.value]!!: ', products)
      console.log('Warehouse At StockUpdate :', whereHouseSelectedItem.value)

      // console.log('perPage: ',perPage)
      // console.log('currentPage: ',currentPage)
      // console.log('totalCount: ',totalCount)
      // console.log('totalPages: ',totalPage)

      // console.log('subTypeId',searchBySubTypeId.value)

    
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })

}

//---------------------- new rel table --------------------
import { VDataTable } from 'vuetify/labs/VDataTable'

//----------------------------- api ------------------------------
import { useFetchPrintLabelData, usePrintLabelBarcodeFormService, useSavePrintBarcodeFormService } from '@/services/skt/global/gloBalService'

const { printLabelFormViewResult, errorMessagePrintLabelView, printLabelFormViewService } = useFetchPrintLabelData()

const dataPrintLabel = ref([])
const selectedDataTables = ref([])
const isDialogPrintLabelVisible = ref(false)

const itemsTypeLabel = ref([
  {
    title: 'Raw Material Label',
    value: 'Raw Mat Label',
  },
  {
    title: 'Semi Label',
    value: 'Semi Label',
  },
  {
    title: 'Product Label',
    value: 'Product Label',
  },
])

const typePrintLabel = ref('')

//----------------------- Filter Status 
const progressLinearNoData = ref(false)
const activeBtnprint = ref(false)

//------------------------- Get Label ------------------------

const itemsCategoriesOld = ['Packaging', 'Raw material', 'Lorry']

const itemsCategories = [
  { name: 'Packaging', value: 'Packaging' },
  { name: 'Raw material', value: 'Raw material' },
  { name: 'Lorry', value: 'Lorry' },
  { name: 'Semi', value: 'Semi' },
]

const paramsFetchDataPrintLabel = ref({
  lot: '',
  productId: '',
  productName: '',
  purchaseOrderNo: '',
  receivedDate: '',
  category: '',
})

const searchFilters = ref({ ...paramsFetchDataPrintLabel.value }) // ฟิลเตอร์จริงที่จะส่งไป API

const handleSearch = async () => {
  searchFilters.value = { ...paramsFetchDataPrintLabel.value } // คัดลอกค่าฟิลเตอร์ที่กรอกเสร็จแล้ว
  await fetchData() // เรียก API ด้วยฟิลเตอร์ที่ผู้ใช้กรอก
}

const clearModel = async () => {
  paramsFetchDataPrintLabel.value.lot = ''
  paramsFetchDataPrintLabel.value.productId = ''
  paramsFetchDataPrintLabel.value.productName = ''
  paramsFetchDataPrintLabel.value.purchaseOrderNo = ''
  paramsFetchDataPrintLabel.value.receivedDate = ''
  paramsFetchDataPrintLabel.value.category = ''

  await fetchData()
}

onMounted( async () => {
  await fetchData()
})


const fetchData = async () => {
  try {
    progressLinearNoData.value = false

    const hasValue = Object.values(paramsFetchDataPrintLabel.value).some(value => !!value)

    if (!hasValue) {
      dataPrintLabel.value = []
      progressLinearNoData.value = true
      throw new Error('Invalid paramsFetchDataPrintLabel')
    }

    progressLinearNoData.value = false // เริ่มแสดง Progress

    dataPrintLabel.value = []

    const result = await printLabelFormViewService(
      urlApi.value,
      whereHouse,
      accessTokenAtStore,
      paramsFetchDataPrintLabel.value,
    )

    dataPrintLabel.value = []

    if (result && result.data) {
      // เพิ่มหมายเลขลำดับให้แต่ละข้อมูล
      dataPrintLabel.value = result.data.map((item, index) => ({
        ...item,
        no: index + 1, // เพิ่มฟิลด์ลำดับ
      }))
      console.log('printLabelFormViewService successfully fetched data', dataPrintLabel.value)
      progressLinearNoData.value = true
    } else {
      console.log('No data found in API response')
      dataPrintLabel.value = []
      progressLinearNoData.value = true
    }
  } catch (error) {
    console.error('Error fetching data:', error.message || error)
    dataPrintLabel.value = [] // ตั้งค่าเป็นค่าว่างเมื่อเกิดข้อผิดพลาด
  } finally {
    progressLinearNoData.value = true // ซ่อน Progress เมื่อการทำงานเสร็จสิ้น
  }
}


const groupDataByLot = data => {
  let previousLot = null
  const groupedData = []

  data.forEach(item => {
    // ถ้า lot เดิมเหมือนกับแถวปัจจุบัน
    console.log("start ForEach")
    if (item.lot === previousLot) {
      // เพิ่ม barcode และ lotDescription ไปยังรายการล่าสุดใน groupedData
      groupedData[groupedData.length - 1].items.push({
        barcode: item.barcode,
        lotDescription: item.lotDescription,
      })
    } else {
      // ถ้า lot ไม่เหมือน ให้สร้างรายการใหม่
      groupedData.push({
        lot: item.lot,
        category: item.category,
        items: [{ barcode: item.barcode, lotDescription: item.lotDescription }],
      })
      previousLot = item.lot // ตั้ง lot เป็นแถวปัจจุบันสำหรับการเปรียบเทียบครั้งต่อไป
    }
  })

  return data
}

const dataFilterPrintLabel = [{ key: 'lot' }]

//------------------------- Print Label ------------------------
//------------------------- Print Label By Barcode ------------------------

//-------------------------- table data -------------------------------

const { saveToPrintLabelFormBarcodeResult, saveToPrintLabelFormBarcodeService } = useSavePrintBarcodeFormService()
const { printLabelBarcodeFormViewResult, printLabelFormBarcodeService } = usePrintLabelBarcodeFormService()

const isLoadingPrintLabel = ref(false)
const successPrintLabel = ref(null)

// eslint-disable-next-line sonarjs/cognitive-complexity
const printLabel = async () => {
  console.log("12355", typePrintLabel.value)
  console.log('Raw Mat Label print start .....')

  const barcodes = Array.isArray(selectedDataTables.value)
    ? selectedDataTables.value.flatMap(item => 
      Array.isArray(item.barcodes) 
        ? item.barcodes.map(b => b.barcode)   // กรณีที่ `barcodes` เป็นอาเรย์ ให้ดึง `barcode`
        : [item.barcode],                      // กรณีที่ `barcode` เป็นตัวเดียว ให้เก็บค่า `barcode`
    )
    : [selectedDataTables.value.barcode]  // ถ้า `selectedDataTables.value` ไม่ใช่อาเรย์ ให้ใช้ `barcode` ตรง ๆ

  console.log('Semi Label print start .....', barcodes)

  isLoadingPrintLabel.value = true
  successPrintLabel.value = null
  await saveToPrintLabelFormBarcodeService(urlApi.value, whereHouse, accessTokenAtStore, barcodes)
  if(saveToPrintLabelFormBarcodeResult.value){
    await printLabelFormBarcodeService(urlApi.value, whereHouse, accessTokenAtStore)
    isLoadingPrintLabel.value = false
    if(printLabelBarcodeFormViewResult.value){
      console.log('print label by barcode success', printLabelBarcodeFormViewResult)
      isLoadingPrintLabel.value = false
      successPrintLabel.value = true
    }else {
      successPrintLabel.value = false
    }
  }else {
    isLoadingPrintLabel.value = false
    successPrintLabel.value = false
    throw 'Could not save to print label form'
  }

  // await printLabelFormBarcodeService(urlApi.value, whereHouse, accessTokenAtStore, paramsFetchDataPrintLabel.value)

}

const expanded = ref([])

const updateSelectedData = sub => {
  // Add to selectedDataTables if selected, remove if deselected
  if (sub.selected) {
    selectedDataTables.value.push(sub)
  } else {
    const index = selectedDataTables.value.findIndex(item => item.name === sub.name)
    if (index !== -1) selectedDataTables.value.splice(index, 1)
  }
}

const eXprtreeNode = () => {
  console.log('eXprtreeNode', selectedDataTables.value)
}

const headersNewEx = [
  { title: '', key: 'data-table-expand' },
  {
    title: 'No.',
    key: 'no',
  },
  {
    title: 'Category',
    key: 'category',
  },
  {
    title: 'Lot',
    key: 'lot',
  },
  {
    title: 'Lot QTY',
    key: 'lotQty',
  },
  {
    title: 'RCVD Date',
    key: 'receivedDate',
    
  },
  {
    title: 'P/O No',
    key: 'purchaseOrderNo',
  },
  {
    title: 'Item Code',
    key: 'productId',
  },
  {
    title: 'Item Name',
    key: 'productName',
  },
  
  {
    title: 'Location',
    key: 'locationName',
  },
  {
    title: 'RCVD(PCS)',
    key: 'qtyPcs',
  },
  {
    title: 'RCVD(KGS)',
    key: 'qtyKgs',
  },
  {
    title: 'Update By',
    key: 'updatedBy',
  },
  {
    title: 'Update Date',
    key: 'updatedDate',
  },
]

const headerSubtitle = [
  { title: '' },
  { title: '' },
  { title: '' },
  { title: '' },
  { title: '', key: 'checkbox' },
  { title: 'Item Code', key: 'name' },
  { title: 'Item Name', key: 'calories' },
  { title: 'Lot', key: 'fat' },
  { title: 'Barcode', key: 'carbs' },
  { title: 'NO/Lot QTY', key: 'protein' },
  { title: '' },
  { title: '' },
  { title: '' },
  { title: '' },
  { title: '' },
]

//------------------- Highlighter --------------------------------
const dataTableColor = ref('#E0F7FA')
const selectedItemIdForColotRow = ref(null)

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
                >{{ $t('Sticker Label') }}</span>
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

  <!-- Filter -->
  <section>
    <div>
      <VExpansionPanels
        v-model="panel"
        multiple
        class="pa-2"
      >
        <VExpansionPanel
          class="px-1"
          value="filter"
        >
          <VExpansionPanelText class="px-1">
            <VRow class="px-1">
              <VCol
                cols="12"
                lg="4"
                sm="6"
                class="py-2"
              >
                <VSelect
                  v-model="paramsFetchDataPrintLabel.category"
                  :items="itemsCategories"
                  density="compact"
                  item-title="name"
                  item-value="value"
                  clearable
                >
                  <template #label>
                    <span>Categories</span>
                  </template>
                </VSelect>
              </VCol>

              <!-- 👉 Select Product code -->
              <VCol
                cols="12"
                lg="4"
                sm="6"
                class="py-2"
              >
                <VTextField
                  v-model="paramsFetchDataPrintLabel.productId"
                  density="compact"
                  height="20px"
                  class="py-0"
                >
                  <template #label>
                    <span
                      class="d-flex align-center"
                      style="font-size: 12px;"
                    >
                      Item Code
                    </span>
                  </template>
                </VTextField>
              </VCol>

              <!-- 👉 Select Product Name -->
              <VCol
                cols="12"
                lg="4"
                sm="6"
                class="py-2"
              >
                <VTextField
                  v-model="paramsFetchDataPrintLabel.productName"
                  density="compact"
                  height="20px"
                  class="py-0"
                >
                  <template #label>
                    <span style="font-size: 12px;">
                      Item Name
                    </span>
                  </template>
                </VTextField>
              </VCol>
              <VCol
                cols="12"
                lg="4"
                sm="6"
                class="py-1"
              >
                <AppDateTimePicker
                  v-model="paramsFetchDataPrintLabel.receivedDate"
                  placeholder="Received Date"
                  density="compact"
                  :config="{ dateFormat: 'd/m/Y' }"
                  prepend-inner-icon="ri-calendar-schedule-fill"
                  class="custom-date-time-picker"
                >
                  <template #label>
                    <span>Received Date</span>
                  </template>
                </AppDateTimePicker>
              </VCol>
              <VCol
                cols="12"
                lg="4"
                sm="6"
                class="py-1"
              >
                <VTextField
                  v-model="paramsFetchDataPrintLabel.purchaseOrderNo"
                  density="compact"
                >
                  <template #label>
                    <span style="font-size: 12px;">
                      P/O No.
                    </span>
                  </template>
                </VTextField>
              </VCol>
              <VCol
                cols="12"
                lg="4"
                sm="6"
                class="py-1"
              >
                <VTextField
                  v-model="paramsFetchDataPrintLabel.lot"
                  density="compact"
                >
                  <template #label>
                    <span style="font-size: 12px;">
                      Lot
                    </span>
                  </template>
                </VTextField>
              </VCol>

              <!-- 👉 Button Search and Export -->
              <VCol
                cols="12"
                lg="4"
                sm="6"
                class="py-1"
              />
              <VCol
                cols="12"
                lg="4"
                sm="6"
                class="py-1"
              />
              <VCol
                cols="12"
                lg="4"
                sm="6"
                class="py-1"
              >
                <VRow>
                  <VCol
                    cols="4"
                    md="4"
                  >
                    <VBtn
                      height="100%"
                      width="100%"
                      color="green"
                      density="compact"
                      class="mx-0"
                      style="font-size: 12px;"
                      @click="handleSearch"
                    >
                      {{ $t('Search') }}
                    </VBtn>
                  </VCol>
                  <VCol
                    cols="4"
                    md="4"
                  >
                    <VBtn
                      color="red"
                      height="100%"
                      width="100%"
                      density="compact"
                      style="font-size: 12px;"
                      @click="clearModel"
                    >
                      {{ $t('Clear') }}
                    </VBtn>
                  </VCol>
                  <VCol
                    cols="4"
                    md="4"
                  >
                    <VBtn
                      :disabled="!selectedDataTables.length > 0"
                      color="warning"
                      style="width: 100%; height: 50px;"
                      @click="printLabel"
                    >
                      <VIcon
                        v-if="!isLoadingPrintLabel"
                        size="20"
                        icon="ri-printer-fill"
                      />
                      <VProgressCircular
                        v-if="isLoadingPrintLabel"
                        :rotate="360"
                        indeterminate
                        :size="40"
                        :width="6"
                        color="primary"
                      >
                        <VIcon
                          size="20"
                          icon="ri-printer-fill"
                        />
                      </VProgressCircular>
                      <span style="font-size: 12px;">{{ $t('Print') }}</span>
                    </VBtn>
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
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
      <VCard title="Privacy Policy">
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
          <VBtn @click="isDialogAddVisible = false">
            I accept
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <!-- Dialog Print Label -->
  <div>
    <VDialog
      v-model="isDialogPrintLabelVisible"
      width="50%"
      :persistent="isLoadingPrintLabel"
    >
      <!-- Dialog Content -->
      <VCard>
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogPrintLabelVisible = false"
        />

        <VCardTitle>
          <div class="text-center">
            <span>Type of Label</span>
          </div>
        </VCardTitle>

        <VCardText>
          <div class="">
            <VSelect
              v-model="typePrintLabel"
              :items="itemsTypeLabel"
              label="Type"
              density="compact"
              item-value="value"
              placeholder="Type Label"
            />
          </div>

          <div
            v-if="typePrintLabel === 'Product Label' "
            class="d-flex justify-center"
          >
            <VList
              density="compact"
              select-strategy="classic"
            >
              <VListheader class="bg-grey-lighten-3">
                Select Language
              </VListheader>

              <VListItem value="Thai">
                <VListItemTitle>Thai</VListItemTitle>
              </VListItem>

              <VListItem value="English">
                <VListItemTitle>English</VListItemTitle>
              </VListItem>

              <VListItem value="Japanese">
                <VListItemTitle>Japanese</VListItemTitle>
              </VListItem>

              <VListItem value="Chinese">
                <VListItemTitle>Chinese</VListItemTitle>
              </VListItem>

              <VListItem value="Maiyasia">
                <VListItemTitle>Maiyasia</VListItemTitle>
              </VListItem>

              <VListItem value="Korea">
                <VListItemTitle>Korea</VListItemTitle>
              </VListItem>
            </VList>
          </div>
          <div
            v-if="false"
            class="d-flex justify-spance-between align-center"
          >
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
                      Copy
                    </span>
                  </template>
                </VTextField>
              </VCol>
            </VRow>
          </div>
        </VCardText>

        <VCardText class="d-flex justify-end align-center flex-wrap gap-4">
          <VAlert
            v-if="successPrintLabel"
            border="end"
            border-color="success"
            variant="tonal"
            closable
            class="pa-2"
          >
            <div class="d-flex justify-start align-center">
              <VIcon
                icon="ri-checkbox-circle-line"
                class="mx-4"
              />Print Completed.
            </div>
          </VAlert>
          <VAlert
            v-if="successPrintLabel === false"
            border="end"
            border-color="error"
            variant="tonal"
            closable
          >
            Print Failed.
          </VAlert>
          <VBtn
            color="warning"
            style="width: 100%; height: 50px;"
            @click="printLabel"
          >
            <VIcon
              v-if="!isLoadingPrintLabel"
              size="20"
              icon="ri-printer-fill"
            />
            <VProgressCircular
              v-if="isLoadingPrintLabel"
              :rotate="360"
              indeterminate
              :size="40"
              :width="6"
              color="primary"
            >
              <VIcon
                size="20"
                icon="ri-printer-fill"
              />
            </VProgressCircular>
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>

  <!-- ----------             Production plan                                ------------------------------------ -->
  <section>
    <VCard>
      <VCardText>
        <VProgressLinear
          v-if="progressLinearNoData && dataPrintLabel.length <= 0"
          height="20"
          color="secondary"
          class="elevation-1"
        >
          <span>No Data....</span>
        </VProgressLinear>
        <VProgressLinear
          v-if="!dataPrintLabel.length > 0 && progressLinearNoData === false"
          height="20"
          indeterminate
          color="primary"
          class="elevation-1"
        >
          <span>Loading Data....</span>
        </VProgressLinear>
        <VDataTable
          v-if="dataPrintLabel.length > 0 && progressLinearNoData === true"
          v-model:expanded="expanded"
          v-model="selectedDataTables"
          :headers="headersNewEx"
          :items="dataPrintLabel"
          :items-per-page="10"
          class="text-no-wrap"
          expand-on-click
          fixed-header
          height="550"
          show-expand
          show-select
        >
          <!-- Expanded Row Data -->
          <!-- Expanded Row Data -->
          <template #expanded-row="{ item }">
            <tr>
              <th
                v-for="(headerSub, index) in headerSubtitle"
                :key="index"
                class="px-2"
              >
                {{ headerSub.title }}
              </th>
            </tr>
            <tr>
              <td />
              <td />
              <td />
              <td />
              <td class="px-2">
                <div
                  v-for="(sub, index) in item.raw.barcodes"
                  :key="sub.name + '-checkbox-' + index"
                  :style="{ backgroundColor: index % 2 === 0 ? '#f7f7f9' : '#f0f0f0', height: '36px' }"
                >
                  <VCheckbox
                    v-model="sub.selected" 
                    @change="updateSelectedData(sub)" 
                  />
                </div>
              </td>
              <td class="px-2">
                <div
                  v-for="(sub, index) in item.raw.barcodes"
                  :key="sub.productId +index"
                  :style="{ backgroundColor: index % 2 === 0 ? '#f7f7f9' : '#f0f0f0', height: '36px' }"
                  class="d-flex align-center"
                >
                  {{ sub.productId }}
                </div>
              </td>
              <td class="px-2">
                <div
                  v-for="(sub, index) in item.raw.barcodes"
                  :key="sub.productName + index"
                  class="d-flex align-center"
                  :style="{ backgroundColor: index % 2 === 0 ? '#f7f7f9' : '#f0f0f0', height: '36px' }"
                >
                  {{ sub.productName }}
                </div>
              </td>
              <td class="px-2">
                <div
                  v-for="(sub, index) in item.raw.barcodes"
                  :key="sub.lotId + index"
                  class="d-flex align-center"
                  :style="{ backgroundColor: index % 2 === 0 ? '#f7f7f9' : '#f0f0f0', height: '36px' }"
                >
                  {{ sub.lotId }}
                </div>
              </td>
              <td class="px-2">
                <div
                  v-for="(sub, index) in item.raw.barcodes"
                  :key="sub.barcode + index"
                  class="d-flex align-center"
                  :style="{ backgroundColor: index % 2 === 0 ? '#f7f7f9' : '#f0f0f0', height: '36px' }"
                >
                  {{ sub.barcode }}
                </div>
              </td>
              <td class="px-2">
                <div
                  v-for="(sub, index) in item.raw.barcodes"
                  :key="sub.lotDescription + index"
                  :style="{ backgroundColor: index % 2 === 0 ? '#f7f7f9' : '#f0f0f0', height: '36px' }"
                  class="d-flex align-center"
                >
                  {{ sub.lotDescription }}
                </div>
              </td>
            </tr>
          </template>

          <template #item.no="{item}">
            <tr>
              <td>
                <span class="text-capitalize">{{ item.raw.no }}</span>
              </td>
            </tr>
          </template>

          <template #item.lotQty="{ item}">
            <tr>
              <td>
                <span class="text-capitalize">{{ item.raw.barcodes.length }}</span>
              </td>
            </tr>
          </template>
          <template #item.receivedDate="{ item}">
            <tr>
              <td>
                <span class="text-capitalize">{{ convertDate(item.raw.receivedDate) }}</span>
              </td>
            </tr>
          </template>
          <template #item.qtyKgs="{item}">
            <tr>
              <td
                class="text-end px-2"
                style="justify-content: end;"
              >
                <span
                  style="font-size: 12px;"
                  class="text-wrap"
                >{{ formatNumber(item.raw.qtyKgs) }}</span>
              </td>
            </tr>
          </template>
          <template #item.qtyPcs="{item}">
            <tr>
              <td
                class="text-end px-2"
                style="justify-content: end;"
              >
                <span
                  style="font-size: 12px;"
                  class="text-wrap"
                >{{ (item.raw.qtyPcs) }}</span>
              </td>
            </tr>
          </template>
          <template #item.updatedDate="{ item}">
            <tr>
              <td>
                <span class="text-capitalize">{{ convertDate(item.raw.updatedDate) }}</span>
              </td>
            </tr>
          </template>
        </VDataTable>
        <VBtn
          v-if="false"
          @click="eXprtreeNode"
        >
          EXprtreeNode
        </VBtn>
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

.resizable-column {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.resize-handle {
  position: absolute;
  background: transparent;
  block-size: 100%;
  cursor: col-resize;
  inline-size: 5px;
  inset-block-start: 0;
  inset-inline-end: 0;
}
</style>

