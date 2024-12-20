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
import { useFetchPrintLabelData, 
  usePrintLabelBarcodeFormService, 
  useSavePrintBarcodeFormService,
  useGetTemplatesByItemCodeSearchService,
} from '@/services/skt/global/gloBalService'

const { printLabelFormViewResult, errorMessagePrintLabelView, printLabelFormViewService } = useFetchPrintLabelData()

const dataPrintLabel = ref([])
const selectedDataTables = ref([''])
const isDialogPrintLabelVisible = ref(false)

const showSelectBox = () => {
  console.log("showSelectBox", selectedDataTables.value)
}

const itemsTypeLabel = ref([
  {
    title: 'Product Label',
    value: 'Product Label',
  },
])

const typePrintLabel = ref('Semi Label')

//----------------------- Filter Status 
const progressLinearNoData = ref(false)

//------------------------- Get Label ------------------------

const itemsCategoriesOld = ['Packaging', 'Raw material', 'Lorry']

const itemsCategories = [
  { name: 'Packaging', value: 'Packaging' },
  { name: 'Raw material', value: 'Raw material' },
  { name: 'Lorry', value: 'Lorry' },
  { name: 'All', value: '' },
]

const paramsFetchDataPrintLabel = ref({
  lot: '',
  productId: '',
  productName: '',
  purchaseOrderNo: '',
  receivedDate: '',
  category: '',
  plant: '',
})

const clearModel = () => {
  paramsFetchDataPrintLabel.value.lot = ''
  paramsFetchDataPrintLabel.value.productId = ''
  paramsFetchDataPrintLabel.value.productName = ''
  paramsFetchDataPrintLabel.value.purchaseOrderNo = ''
  paramsFetchDataPrintLabel.value.receivedDate = ''
  paramsFetchDataPrintLabel.value.category = ''
  paramsFetchDataPrintLabel.value.plant = ''

  fetchData()
}

const fetchData = async () => {

  const result = await printLabelFormViewService('GetProductLabels', urlApi.value, whereHouse, accessTokenAtStore, paramsFetchDataPrintLabel.value)

  progressLinearNoData.value = true
  if (result) {
    // เพิ่มหมายเลขลำดับให้แต่ละข้อมูล
    dataPrintLabel.value = result.data.map((item, index) => ({
      ...item, // คงข้อมูลเดิมใน item
      no: index + 1, // เพิ่มฟิลด์ number โดยเริ่มจาก 1
    }))

    // dataPrintLabel.value = result

    progressLinearNoData.value = true
    console.log("printLabelFormViewService successfully view", dataPrintLabel.value)

    // console.log("printLabelFormViewResult successfully view", printLabelFormViewResult.value)
  } else {
    console.log("printLabelFormViewService failed view")
  }
}

onMounted(() => {
  fetchData()
})

const searchFilter = () => {
  fetchData()
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

const headersNewEx = [
  {
    title: 'Print',
    key: 'print',
    align: "center",
    fixed: true,
    readonly: true,
    sortable: false,
  },
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

//-------------------- print production lable -------------------

const { getTemplateByItemCodeResult, errorMessageGetTemplatesByItemCodeSearch, fetchGetTemplateByItemCode } = useGetTemplatesByItemCodeSearchService()

const actionPrintProductLable = ItemCode => {
  isDialogPrintLabelVisible.value = true

  const result = fetchGetTemplateByItemCode(ItemCode, urlApi.value, 'PrintLabel', whereHouse, accessTokenAtStore)
  if(result){
    console.log('getTemplateByItemCodeResult', getTemplateByItemCodeResult.value)
  }else{
    console.log('errorMessageGetTemplatesByItemCodeSearch', errorMessageGetTemplatesByItemCodeSearch.value)
  }

}

//------------------- Highlighter --------------------------------

const selectedItemIdForColotRow = ref(null)

watch(() => {
  console.log('selected', selectedDataTables.value)
})

const isSelected = (item, type) => {
  if(type === 1){
    return selectedDataTables.value.some(
      selectedItem => selectedItem.lot === item,
    )
  }

  if(type === 2){
    return selectedDataTables.value.some(
      selectedItem => selectedItem.barcode === item,
    )
  }

}

const dataTableColor = ref('#E0F7FA')
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
                >{{ $t('Product Label') }}</span>
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
                  v-if="false"
                  v-model="paramsFetchDataPrintLabel.plant"
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
                      Plant
                    </span>
                  </template>
                </VTextField>
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
                  placeholder="Production Date"
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
                      Reactor
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
                    cols="6"
                    md="6"
                  >
                    <VBtn
                      height="100%"
                      width="100%"
                      color="green"
                      density="compact"
                      class="mx-0"
                      style="font-size: 12px;"
                      @click="searchFilter"
                    >
                      {{ $t('Search') }}
                    </VBtn>
                  </VCol>
                  <VCol
                    cols="6"
                    md="6"
                  >
                    <VBtn
                      color="red"
                      width="100%"
                      density="compact"
                      style="height: 40px; font-size: 12px;"
                      @click="clearModel"
                    >
                      {{ $t('Clear') }}
                    </VBtn>
                  </VCol>
                  <VCol
                    v-if="false"
                    cols="4"
                    md="4"
                  >
                    <VBtn
                      density="compact"
                      class=" px-16 px-sm-12 pa-sm-1 custom-small-btn-excel"
                      color="warning"
                      style="width: 100%; height: 40px;"
                      @click="isDialogPrintLabelVisible = true"
                    >
                      <VIcon
                        style="width: 27px;"
                        icon="ri-printer-fill"
                      />
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
            <span>Select Language</span>
          </div>
        </VCardTitle>

        <VCardText>
          <div
            v-if="false"
            class=""
          >
            <VSelect
              v-model="typePrintLabel"
              :items="itemsTypeLabel"
              label="Type"
              density="compact"
              item-value="value"
              placeholder="Type Label"
            />
          </div>

          <div class="d-flex justify-center">
            <VTable>
              <thead>
                <tr>
                  <th>NO</th>
                  <th>LanguageName</th>
                  <th>LabelName</th>
                  <th>FileName</th>
                </tr>
              </thead>
              <tbody>
                <tr />
              </tbody>
            </VTable>
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
          v-if="!dataPrintLabel"
          height="20"
          color="secondary"
          class="elevation-1"
        >
          <span>No Data....</span>
        </VProgressLinear>
        <VProgressLinear
          v-if="progressLinearNoData === false"
          height="20"
          indeterminate
          color="primary"
          class="elevation-1"
        >
          <span>Loading Data....</span>
        </VProgressLinear>
        <VBtn
          v-if="false"
          @click="showSelectBox"
        >
          Test
        </VBtn>
        <VDataTable
          v-if="dataPrintLabel && progressLinearNoData === true"
          v-model="selectedDataTables"
          :headers="headersNewEx"
          :items="dataPrintLabel"
          :items-per-page="10"
          class="text-no-wrap"
        >
          <template #item="{item}">
            <tr>
              <td style="position: sticky; z-index: 1; left: 0;">
                <VBtn
                  color="warning"
                  @click="actionPrintProductLable(123123)"
                >
                  <VIcon
                    v-if="!isLoadingPrintLabel"
                    size="20"
                    icon="ri-printer-fill"
                  />
                </VBtn>
              </td>
              <td>
                <span class="text-capitalize">{{ item.raw.no }}</span>
              </td>
              <td>
                <span class="text-capitalize">{{ item.raw.category }}</span>
              </td>
              <td>
                <span class="text-capitalize">{{ item.raw.lot }}</span>
              </td>
              <td>
                <span class="text-capitalize">{{ item.raw.lot }}</span>
              </td>
              <td>
                <span class="text-capitalize">{{ convertDate(item.raw.receivedDate) }}</span>
              </td>
              <td>
                <span class="text-capitalize">{{ item.raw.purchaseOrderNo }}</span>
              </td>
              <td>
                <span class="text-capitalize">{{ item.raw.productId }}</span>
              </td>
              <td>
                <span class="text-capitalize">{{ item.raw.productName }}</span>
              </td>
              <td>
                <span class="text-capitalize">{{ item.raw.locationName }}</span>
              </td>
              <td>
                <span class="text-capitalize">{{ item.raw.qtyPcs }}</span>
              </td>
              <td>
                <span class="text-capitalize">{{ formatNumber(item.raw.qtyKgs) }}</span>
              </td>
              <td>
                <span class="text-capitalize">{{ (item.raw.updatedByName) }}</span>
              </td>
              <td>
                <span
                  v-if="item.raw.updatedDate"
                  class="text-capitalize"
                >{{ convertDate(item.raw.updatedDate) }}</span>
                <span
                  v-else
                  class="text-capitalize"
                />
              </td>
            </tr>
          </template>
          <template #item.print="{}">
            <tr>
              <td>
                <VBtn
                  color="warning"
                  @click="actionPrintProductLable(123123)"
                >
                  <VIcon
                    v-if="!isLoadingPrintLabel"
                    size="20"
                    icon="ri-printer-fill"
                  />
                </VBtn>
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
                <span class="text-capitalize">{{ item.raw.barcodes }}</span>
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
                <span
                  v-if="item.raw.updatedDate"
                  class="text-capitalize"
                >{{ convertDate(item.raw.updatedDate) }}</span>
                <span
                  v-else
                  class="text-capitalize"
                />
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

