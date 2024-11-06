<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { ref, watchEffect } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api' //---------------------- Import Api for Url *****

//------------------------ Get Where House Name From LocalStorage and define to whereHouseSelectedItem ---------------------------
const whereHouse = localStorage.getItem('whereHouseName')
const whereHouseSelectedItem = ref(whereHouse)

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
import { usePrintLabelBarcodeFormService, useFetchPrintLabelData, useSavePrintBarcodeFormService }  from '@/services/skt/global/gloBalService'

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

const typePrintLabel = ref('Semi Label')

//----------------------- Filter Status 
const progressLinearNoData = ref(false)

//------------------------- Get Label ------------------------
const paramsFetchDataPrintLabel = ref({
  lot: '',
  productId: '',
  productName: '',
  purchaseOrderNo: '',
  receivedDate: '',
})

const fetchData = async () => {

  const result = await printLabelFormViewService(urlApi.value, whereHouse, accessTokenAtStore, paramsFetchDataPrintLabel.value)

  if (printLabelFormViewResult.value) {
    dataPrintLabel.value = result.data
    progressLinearNoData.value = true
    console.log("printLabelFormViewService successfully view")
  } else {
    console.log("printLabelFormViewService failed view")
  }
}

watchEffect(() => {
  fetchData()
})

//------------------------- Print Label ------------------------
//------------------------- Print Label By Barcode ------------------------

//-------------------------- table data -------------------------------

const { saveToPrintLabelFormBarcodeResult, saveToPrintLabelFormBarcodeService } = useSavePrintBarcodeFormService()
const { printLabelBarcodeFormViewResult, printLabelFormBarcodeService } = usePrintLabelBarcodeFormService()

const isLoadingPrintLabel = ref(false)
const successPrintLabel = ref(null)

const printLabel = async () => {
  console.log("12355", typePrintLabel.value)
  if(typePrintLabel.value === 'Raw Mat Label'){
    console.log('Raw Mat Label print start .....')

    const barcode = ref({})

    // await printLabelFormBarcodeService(urlApi.value, whereHouse, accessTokenAtStore, paramsFetchDataPrintLabel.value)
  }
  if(typePrintLabel.value === 'Semi Label'){
    console.log('Semi Label print start .....')

    const barcodes = selectedDataTables.value.map(item => item.barcode)

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
  }
  if(typePrintLabel.value === 'Product Label'){
    console.log('Product Label print start .....')
  }
}

const dataTableExpanded = ref([])

const headers = [
  {
    title: 'data-table-select',
    key: 'data-table-select',
    align: "center",
    fixed: true,
    readonly: true,
  },
  {
    title: '',
    key: 'data-table-expand',
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
    title: 'Barcode',
    key: 'barcode',
  },
  {
    title: 'NO/RCVD(PCS)',
    key: 'lotDescription',
  },
  {
    title: 'Received Date',
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
    key: 'updatedDate',
  },
  {
    title: 'PURC(PCS)',
    key: 'qtyPcs',
  },
  {
    title: 'PURC(KGS)',
    key: 'qtyKgs',
  },
]

const dataTableGroupBy = [{ key: 'lot' }]
const expanded = ref([])

const dessertHeaders = [
  {
    title: 'Dessert (100g serving)',
    align: 'start',
    sortable: false,
    key: 'name',
  },
  { title: 'Calories', key: 'calories' },
  { title: 'Fat (g)', key: 'fat' },
  { title: 'Carbs (g)', key: 'carbs' },
  { title: 'Protein (g)', key: 'protein' },
  { title: 'Iron (%)', key: 'iron' },
  { title: '', key: 'data-table-expand' },
]

const desserts = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    iron: 1,
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    iron: 1,
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    iron: 7,
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    iron: 8,
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    iron: 16,
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    iron: 0,
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    iron: 2,
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    iron: 45,
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    iron: 22,
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    iron: 6,
  },
]

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
                >{{ $t('Print Label') }}</span>
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
                <VTextField
                  v-model="paramsFetchDataPrintLabel.lot"
                  density="compact"
                  height="20px"
                  class="py-0"
                >
                  <template #label>
                    <span
                      class="d-flex align-center"
                      style="font-size: 12px;"
                    >
                      Lot
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
                  placeholder="Select Date"
                  density="compact"
                  :config="{ mode: 'range',dateFormat: 'd/m/Y' }"
                  prepend-inner-icon="ri-calendar-schedule-fill"
                  class="custom-date-time-picker"
                >
                  <template #label>
                    <span>Delivery Date</span>
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
                      Po No.
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
                  v-model="supplierName"
                  :label="$t('Supplier Name')"
                  type="Supplier Name"
                  density="compact"
                >
                  <template #label>
                    <span style="font-size: 12px;">
                      Supplier Name
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
                      @click="searchFilter"
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
                      density="compact"
                      class=" px-16 px-sm-12 pa-sm-1 custom-small-btn-excel"
                      color="warning"
                      style="width: 100%; height: 40px;"
                      @click="isDialogPrintLabelVisible = true"
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
  <section v-if="false">
    <VCard class="mt-6">
      <VTable
        id="myTable"
        class="elevation-1"
      >
        <!-- 👉 table head -->
        <thead class="text-no-wrap">
          <tr>
            <th
              scope="row"
              class="text-cente"
            >
              <VCheckbox v-model="checkBoxAll" />
            </th>
            <th
              scope="row"
              class="text-center px-1"
            >
              <span style="font-size: 14px; text-transform: capitalize;">{{ $t('No.') }}</span>
            </th>
            <th
              scope="row"
              class="text-start"
            >
              <div>
                <span style="font-size: 14px; text-transform: capitalize;">{{ $t('Lot') }}</span>
              </div>
              
              <VMenu
                v-if="false"
                v-model="menuUoM"
                :close-on-content-click="false"
                location="end"
                disabled
              >
                <template #activator="{ props }">
                  <VIcon
                    v-bind="props"
                    color="primary"
                    icon="mdi-magnify"
                  />
                </template>

                <VCard min-width="300">
                  <VDivider />

                  <VList>
                    <VListItem>
                      <VRow>
                        <VCol
                          cols="12"
                          md="12"
                        >
                          <VTextField
                            v-model="searchByUnitName"
                            class="mt-4"
                            :label="$t('Counting Unit')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            color="warning"
                            @click="resetSearchKey"
                          >
                            {{ $t('Reset') }}
                          </VBtn>
                        </VCol>
                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            @click="menuProductName = false"
                          >
                            {{ $t('Cancel') }}
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VListItem>
                  </VList>
                </VCard>
              </VMenu>
            </th>
            <th
              scope="row"
              class="text-center px-1"
            >
              <span style="font-size: 14px; text-transform: capitalize;">{{ $t('Barcode') }}</span>
              <VMenu
                v-if="false"
                v-model="menuUoM"
                :close-on-content-click="false"
                location="end"
                disabled
              >
                <template #activator="{ props }">
                  <VIcon
                    v-bind="props"
                    color="primary"
                    icon="mdi-magnify"
                  />
                </template>

                <VCard min-width="300">
                  <VDivider />

                  <VList>
                    <VListItem>
                      <VRow>
                        <VCol
                          cols="12"
                          md="12"
                        >
                          <VTextField
                            v-model="searchByUnitName"
                            class="mt-4"
                            :label="$t('Counting Unit')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            color="warning"
                            @click="resetSearchKey"
                          >
                            {{ $t('Reset') }}
                          </VBtn>
                        </VCol>
                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            @click="menuProductName = false"
                          >
                            {{ $t('Cancel') }}
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VListItem>
                  </VList>
                </VCard>
              </VMenu>
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              <span style="font-size: 14px; text-transform: capitalize;">{{ $t('Description') }}</span>
              <VMenu
                v-if="false"
                v-model="menuUoM"
                :close-on-content-click="false"
                location="end"
                disabled
              >
                <template #activator="{ props }">
                  <VIcon
                    v-bind="props"
                    color="primary"
                    icon="mdi-magnify"
                  />
                </template>

                <VCard min-width="300">
                  <VDivider />

                  <VList>
                    <VListItem>
                      <VRow>
                        <VCol
                          cols="12"
                          md="12"
                        >
                          <VTextField
                            v-model="searchByUnitName"
                            class="mt-4"
                            :label="$t('Counting Unit')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            color="warning"
                            @click="resetSearchKey"
                          >
                            {{ $t('Reset') }}
                          </VBtn>
                        </VCol>
                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            @click="menuProductName = false"
                          >
                            {{ $t('Cancel') }}
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VListItem>
                  </VList>
                </VCard>
              </VMenu>
            </th>
            <th
              scope="row"
              class="text-start"
            >
              <span style="font-size: 14px; text-transform: capitalize;">{{ $t('Received Date') }}</span>
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                style="font-size: 14px; text-transform: capitalize;"
                @click="toggleSortType('sortByQty')"
              />
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              <span style="font-size: 14px; text-transform: capitalize;">{{ $t('Expired Date') }}</span>
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                style="font-size: 14px; text-transform: capitalize;"
                @click="toggleSortType('sortByQty')"
              />
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              <span style="font-size: 14px; text-transform: capitalize;">{{ $t('Reminding Days') }}</span>
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                style="font-size: 14px; text-transform: capitalize;"
                @click="toggleSortType('sortByQty')"
              />
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              <span style="font-size: 14px; text-transform: capitalize;">{{ $t('Purchase Order No.') }}</span>
              <VMenu
                v-if="false"
                v-model="menuUoM"
                :close-on-content-click="false"
                location="end"
                disabled
              >
                <template #activator="{ props }">
                  <VIcon
                    v-bind="props"
                    color="primary"
                    icon="mdi-magnify"
                  />
                </template>

                <VCard min-width="300">
                  <VDivider />

                  <VList>
                    <VListItem>
                      <VRow>
                        <VCol
                          cols="12"
                          md="12"
                        >
                          <VTextField
                            v-model="searchByUnitName"
                            class="mt-4"
                            :label="$t('Counting Unit')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            color="warning"
                            @click="resetSearchKey"
                          >
                            {{ $t('Reset') }}
                          </VBtn>
                        </VCol>
                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            @click="menuProductName = false"
                          >
                            {{ $t('Cancel') }}
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VListItem>
                  </VList>
                </VCard>
              </VMenu>
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              <span style="font-size: 14px; text-transform: capitalize;">{{ $t('Production No.') }}</span>
              <VMenu
                v-if="false"
                v-model="menuUoM"
                :close-on-content-click="false"
                location="end"
                disabled
              >
                <template #activator="{ props }">
                  <VIcon
                    v-bind="props"
                    color="primary"
                    icon="mdi-magnify"
                  />
                </template>

                <VCard min-width="300">
                  <VDivider />

                  <VList>
                    <VListItem>
                      <VRow>
                        <VCol
                          cols="12"
                          md="12"
                        >
                          <VTextField
                            v-model="searchByUnitName"
                            class="mt-4"
                            :label="$t('Counting Unit')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            color="warning"
                            @click="resetSearchKey"
                          >
                            {{ $t('Reset') }}
                          </VBtn>
                        </VCol>
                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            @click="menuProductName = false"
                          >
                            {{ $t('Cancel') }}
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VListItem>
                  </VList>
                </VCard>
              </VMenu>
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              <span style="font-size: 14px; text-transform: capitalize;">{{ $t('Product Code') }}</span>
              <VMenu
                v-if="false"
                v-model="menuUoM"
                :close-on-content-click="false"
                location="end"
                disabled
              >
                <template #activator="{ props }">
                  <VIcon
                    v-bind="props"
                    color="primary"
                    icon="mdi-magnify"
                  />
                </template>

                <VCard min-width="300">
                  <VDivider />

                  <VList>
                    <VListItem>
                      <VRow>
                        <VCol
                          cols="12"
                          md="12"
                        >
                          <VTextField
                            v-model="searchByUnitName"
                            class="mt-4"
                            :label="$t('Counting Unit')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            color="warning"
                            @click="resetSearchKey"
                          >
                            {{ $t('Reset') }}
                          </VBtn>
                        </VCol>
                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            @click="menuProductName = false"
                          >
                            {{ $t('Cancel') }}
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VListItem>
                  </VList>
                </VCard>
              </VMenu>
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              <span style="font-size: 14px; text-transform: capitalize;">{{ $t('Product Name') }}</span>
              <VMenu
                v-if="false"
                v-model="menuUoM"
                :close-on-content-click="false"
                location="end"
                disabled
              >
                <template #activator="{ props }">
                  <VIcon
                    v-bind="props"
                    color="primary"
                    icon="mdi-magnify"
                  />
                </template>

                <VCard min-width="300">
                  <VDivider />

                  <VList>
                    <VListItem>
                      <VRow>
                        <VCol
                          cols="12"
                          md="12"
                        >
                          <VTextField
                            v-model="searchByUnitName"
                            class="mt-4"
                            :label="$t('Counting Unit')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            color="warning"
                            @click="resetSearchKey"
                          >
                            {{ $t('Reset') }}
                          </VBtn>
                        </VCol>
                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            @click="menuProductName = false"
                          >
                            {{ $t('Cancel') }}
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VListItem>
                  </VList>
                </VCard>
              </VMenu>
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              <span style="font-size: 14px; text-transform: capitalize;">{{ $t('Qty.') }}</span>
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                style="font-size: 14px; text-transform: capitalize;"
                @click="toggleSortType('sortByQty')"
              />
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              <span style="font-size: 14px; text-transform: capitalize;">{{ $t('Unit') }}</span>
              <VMenu
                v-if="false"
                v-model="menuUoM"
                :close-on-content-click="false"
                location="end"
                disabled
              >
                <template #activator="{ props }">
                  <VIcon
                    v-bind="props"
                    color="primary"
                    icon="mdi-magnify"
                  />
                </template>

                <VCard min-width="300">
                  <VDivider />

                  <VList>
                    <VListItem>
                      <VRow>
                        <VCol
                          cols="12"
                          md="12"
                        >
                          <VTextField
                            v-model="searchByUnitName"
                            class="mt-4"
                            :label="$t('Counting Unit')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            color="warning"
                            @click="resetSearchKey"
                          >
                            {{ $t('Reset') }}
                          </VBtn>
                        </VCol>
                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            @click="menuProductName = false"
                          >
                            {{ $t('Cancel') }}
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VListItem>
                  </VList>
                </VCard>
              </VMenu>
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              <span style="font-size: 14px; text-transform: capitalize;">{{ $t('Category') }}</span>
              <VMenu
                v-if="false"
                v-model="menuUoM"
                :close-on-content-click="false"
                location="end"
                disabled
              >
                <template #activator="{ props }">
                  <VIcon
                    v-bind="props"
                    color="primary"
                    icon="mdi-magnify"
                  />
                </template>

                <VCard min-width="300">
                  <VDivider />

                  <VList>
                    <VListItem>
                      <VRow>
                        <VCol
                          cols="12"
                          md="12"
                        >
                          <VTextField
                            v-model="searchByUnitName"
                            class="mt-4"
                            :label="$t('Counting Unit')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            color="warning"
                            @click="resetSearchKey"
                          >
                            {{ $t('Reset') }}
                          </VBtn>
                        </VCol>
                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            @click="menuProductName = false"
                          >
                            {{ $t('Cancel') }}
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VListItem>
                  </VList>
                </VCard>
              </VMenu>
            </th>
            <th
              scope="row"
              class="text-start"
            >
              <span style="font-size: 14px; text-transform: capitalize;">{{ $t('Remark') }}</span>
              <VMenu
                v-if="false"
                v-model="menuUoM"
                :close-on-content-click="false"
                location="end"
                disabled
              >
                <template #activator="{ props }">
                  <VIcon
                    v-bind="props"
                    color="primary"
                    icon="mdi-magnify"
                  />
                </template>

                <VCard min-width="300">
                  <VDivider />

                  <VList>
                    <VListItem>
                      <VRow>
                        <VCol
                          cols="12"
                          md="12"
                        >
                          <VTextField
                            v-model="searchByUnitName"
                            class="mt-4"
                            :label="$t('Counting Unit')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            color="warning"
                            @click="resetSearchKey"
                          >
                            {{ $t('Reset') }}
                          </VBtn>
                        </VCol>
                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            type="submit"
                            style="width: 100%;"
                            @click="menuProductName = false"
                          >
                            {{ $t('Cancel') }}
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VListItem>
                  </VList>
                </VCard>
              </VMenu>
            </th>
          </tr>
        </thead>

        <tbody class="">
          <tr
            v-for="(item, index) in mockData"
            :key="index"
          >
            <td>
              <VCheckbox v-model="item.checkBox" />
            </td>
            <td>{{ index + 1 }}</td>
            <td>
              <div>
                {{ item.lot }}
              </div> 
            </td>
            <td>{{ item.barcode }}</td>
            <td>{{ item.description }}</td>
            <td>{{ (item.productionDate) }}</td>
            <td>
              {{ item.expiryDate }}
            </td>
            <td>{{ item.remainingDays }}</td>
            <td>{{ item.purchaseOrderNo }}</td>
            <td>{{ item.productionNo }}</td>
            <td>
              {{ item.productId }}
            </td>
            <td>
              {{ item.productName }}
            </td>
            <td>
              {{ item.qty }}
            </td>
            <td>
              {{ item.uom }}
            </td>
           
            <td style="width: 35px;">
              {{ item.productCategory }}
            </td>
            <td>
              {{ item.remarks }}
            </td>
          </tr>
        </tbody>
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

  <!-- table data -->
  <section v-if="false">
    <VCard>
      <CardText>
        <VProgressLinear
          v-if="progressLinearNoData && !printLabelFormViewResult"
          height="20"
          color="secondary"
          class="elevation-1"
        >
          <span>No Data....</span>
        </VProgressLinear>
        <VProgressLinear
          v-if="!printLabelFormViewResult && progressLinearNoData === false"
          height="20"
          indeterminate
          color="primary"
          class="elevation-1"
        >
          <span>Loading Data....</span>
        </VProgressLinear>
        <VDataTable
          v-if="progressLinearNoData && printLabelFormViewResult"
          v-model="selectedDataTables"
          show-select
          :headers="headers"
          :items="printLabelFormViewResult"
          :items-per-page="10"
          item-selectable="selectable"
          class="elevation-1"
          :header-props="{ 'sort-icon': 'mdi-triangle-down' }"
          :item-class="row_classes" 
          :group-by="dataTableGroupBy"
        >
          <template #data-table-group="{ props, item, count }">
            <td
              :style="{ 
                backgroundColor: 
                  isSelected(item.value, 1) ? dataTableColor : 
                  ''
              }"
              style="position: sticky; z-index: 1; left: 20px; min-width: 200px;"
            >
              <VBtn
                v-bind="props"
                variant="text"
                density="comfortable"
              >
                <VIcon
                  class="flip-in-rtl"
                  icon="ri-arrow-down-s-line"
                />
              </VBtn>
              <span style="font-size: 12px;">{{ item.value }}</span>
              <span style="font-size: 12px;">({{ count }})</span>
            </td>
          </template>





          <template #item="{ item }">
            <tr>
              <td
                class="text-center"
                style="position: sticky; z-index: 1; left: 0;"
                :style="{ 
                  backgroundColor: 
                    isSelected(item.raw.barcode, 2) ? dataTableColor : 
                    ''
                }"
              >
                <VCheckboxBtn
                  v-model="selectedDataTables"
                  :value="item.raw"
                />
              </td>
              <td
                :style="{ 
                  backgroundColor: 
                    isSelected(item.raw.barcode, 2) ? dataTableColor : 
                    ''
                }"
                class="text-center px-2"
              >
                {{ item.raw.productionCode }}
              </td>
              <td
                class="text-start px-2"
                style="min-width: 120px;"
                :style="{ 
                  backgroundColor: 
                    isSelected(item.raw.barcode, 2) ? dataTableColor : 
                    ''
                }"
              >
                <span style="font-size: 12px;">{{ (item.raw.category) }}</span>
              </td>
              <td
                :style="{ 
                  backgroundColor: 
                    isSelected(item.raw.barcode, 2) ? dataTableColor : 
                    ''
                }"
                class="px-2"
                style="min-width: 100px;  justify-content: start;"
              >
                <span
                  style="font-size: 12px;"
                  class="text-wrap"
                >{{ item.raw.lot }}</span>
              </td>
              <td
                class="px-2 text-start"
                style="min-width: 100px; justify-content: center;"
                :style="{ 
                  backgroundColor: 
                    isSelected(item.raw.barcode, 2) ? dataTableColor : 
                    ''
                }"
              >
                <span
                  style="font-size: 12px;"
                  class="text-wrap"
                >{{ item.raw.barcode }}</span>
              </td>
              <td
                class="text-center px-2"
                :style="{ 
                  backgroundColor: 
                    isSelected(item.raw.barcode, 2) ? dataTableColor : 
                    ''
                }"
                style="min-width: 100px;"
              > 
                <span style="font-size: 12px;">{{ item.raw.lotDescription }}</span>
              </td>
              <td
                class="text-center px-2"
                style="min-width: 150px;"
                :style="{ 
                  backgroundColor: 
                    isSelected(item.raw.barcode, 2) ? dataTableColor : 
                    ''
                }"
              >
                <span
                  style="font-size: 12px;"
                  class=""
                >{{ convertDate(item.raw.receivedDate) }}</span>
              </td>
              <td
                v-if="false"
                class="text-start px-2"
                :style="{ 
                  backgroundColor: 
                    isSelected(item.raw.barcode, 2) ? dataTableColor : 
                    ''
                }"
              >
                <span
                  style="font-size: 12px;"
                  class="text-wrap"
                >{{ convertDate(item.raw.expiredDate) }}</span>
              </td>
              <td
                v-if="false"
                class="text-end px-2"
                style="justify-content: end;"
              >
                <span
                  style="font-size: 12px;"
                  class="text-wrap"
                >{{ (item.raw.remindingDays) }}</span>
              </td>
              <td
                v-if="false"
                class="text-end px-2"
                style="justify-content: end;"
              >
                <span
                  style="font-size: 12px;"
                  class="text-wrap"
                >{{ (item.raw.deliveryDate) }}</span>
              </td>
              <td
                class="text-start px-2"
                style="min-width: 100px; justify-content: end;"
                :style="{ 
                  backgroundColor: 
                    isSelected(item.raw.barcode, 2) ? dataTableColor : 
                    ''
                }"
              >
                <span
                  style="font-size: 12px;"
                  class="text-wrap"
                >{{ (item.raw.purchaseOrderNo) }}</span>
              </td>
              <td
                v-if="false"
                class="text-end px-2"
                style="min-width: 140px; justify-content: start;"
              >
                <span
                  style="font-size: 12px;"
                  class="text-wrap"
                >{{ (item.raw.productionCode) }}</span>
              </td>
              <td
                class="text-start px-2"
                style="min-width: 120px;"
                :style="{ 
                  backgroundColor: 
                    isSelected(item.raw.barcode, 2) ? dataTableColor : 
                    ''
                }"
              >
                <span
                  style="font-size: 12px;"
                  class="text-wrap"
                >{{ item.raw.productId }}</span>
              </td>
              <td
                class="text-start px-2"
                style="min-width: 200px;"
                :style="{ 
                  backgroundColor: 
                    isSelected(item.raw.barcode, 2) ? dataTableColor : 
                    ''
                }"
              >
                <span
                  style="font-size: 12px;"
                  class="text-wrap"
                  v-html="item.raw.productName.replace(/\s/g, '&nbsp;')"
                />
              </td>
              
              <td
                class="text-center px-2"
                style="min-width: 130px;"
                :style="{ 
                  backgroundColor: 
                    isSelected(item.raw.barcode, 2) ? dataTableColor : 
                    ''
                }"
              >
                <span style="font-size: 12px;">{{ (item.raw.updatedDate) }}</span>
              </td>
              <td
                class="text-center px-2"
                style="min-width: 130px;"
                :style="{ 
                  backgroundColor: 
                    isSelected(item.raw.barcode, 2) ? dataTableColor : 
                    ''
                }"
              >
                <span style="font-size: 12px;">{{ (item.raw.qtyPcs).toLocaleString() }}</span>
              </td>
              <td
                class="text-center px-2"
                style="min-width: 130px;"
                :style="{ 
                  backgroundColor: 
                    isSelected(item.raw.barcode, 2) ? dataTableColor : 
                    ''
                }"
              >
                <span style="font-size: 12px;">{{ formatNumber(item.raw.qtyKgs) }}</span>
              </td>
              <td
                v-if="false"
                class="text-start px-2"
                style="justify-content: center;"
              >
                <VBtn color="info">
                  <div style="font-size: 12px;">
                    Action
                  </div>
                </VBtn>
              </td>
            </tr>
          </template>
        </VDataTable>
      </CardText>
    </VCard>
  </section>

  <section>
    <VCard>
      <CardText>
        <VDataTable
          v-if="printLabelFormViewResult"
          :headers="headers"
          :items="printLabelFormViewResult"
          :items-per-page="5"
          class="text-no-wrap"
          show-expand
          expand-on-click
          item-key="raw.barcode"
        >
          <template #item="{ item, isExpanded, expand }">
            <tr @click="expand(!isExpanded)">
              <!-- Checkbox column -->
              <td
                class="text-center"
                style="position: sticky; z-index: 1; left: 0;"
                :style="{ 
                  backgroundColor: 
                    isSelected(item.raw.barcode, 2) ? dataTableColor : ''
                }"
              >
                <VCheckboxBtn
                  v-model="selectedDataTables"
                  :value="item.raw"
                />
              </td>
              <!-- Other columns -->
              <td
                class="text-start px-2"
                style="min-width: 120px;"
                :style="{ 
                  backgroundColor: 
                    isSelected(item.raw.barcode, 2) ? dataTableColor : ''
                }"
              >
                <span style="font-size: 12px;">{{ item.raw.category }}</span>
              </td>
              <td
                class="px-2"
                style="min-width: 100px; justify-content: start;"
                :style="{ 
                  backgroundColor: 
                    isSelected(item.raw.barcode, 2) ? dataTableColor : ''
                }"
              >
                <span
                  style="font-size: 12px;"
                  class="text-wrap"
                >{{ item.raw.lot }}</span>
              </td>
              <td
                class="px-2 text-start"
                style="min-width: 100px; justify-content: center;"
                :style="{ 
                  backgroundColor: 
                    isSelected(item.raw.barcode, 2) ? dataTableColor : ''
                }"
              >
                <span
                  style="font-size: 12px;"
                  class="text-wrap"
                >{{ item.raw.barcode }}</span>
              </td>
              <td
                class="text-center px-2"
                style="min-width: 100px;"
                :style="{ 
                  backgroundColor: 
                    isSelected(item.raw.barcode, 2) ? dataTableColor : ''
                }"
              > 
                <span style="font-size: 12px;">{{ item.raw.lotDescription }}</span>
              </td>
              <td
                class="text-center px-2"
                style="min-width: 150px;"
                :style="{ 
                  backgroundColor: 
                    isSelected(item.raw.barcode, 2) ? dataTableColor : ''
                }"
              >
                <span style="font-size: 12px;">{{ convertDate(item.raw.receivedDate) }}</span>
              </td>
            </tr>
          </template>
        </VDataTable>
      </CardText>
    </VCard>
  </section>

  <section>
    <VDataTable
      v-model:expanded="expanded"
      :headers="dessertHeaders"
      :items="desserts"
      item-value="name"
      show-expand
    >
      <template #top>
        <VToolbar flat>
          <VToolbarTitle>Expandable Table</VToolbarTitle>
        </VToolbar>
      </template>
      <!-- Customize each row's cells -->
      <!-- Customize each row's cells -->
      <template #item="{ item, columns, isExpanded, expand }">
        <tr @click="expand(!isExpanded)">
          <td 
            v-for="(column, index) in columns" 
            :key="index"
            class="custom-cell"
            :class="[column.key]"
            :style="{ color: column.key === 'calories' && item.raw.calories > 400 ? 'red' : 'inherit' }"
          >
            {{ item[column.key] }}
          </td>
        </tr>
      </template>
      <template #expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length">
            More info about {{ item.name }}
          </td>
        </tr>
      </template>
    </VDataTable>
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

