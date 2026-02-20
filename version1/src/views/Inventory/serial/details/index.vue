<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { onMounted, ref, watchEffect } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api'  //---------------------- Import Api for Url *****

//-------------------------- Import Use -----------------------------------
import { useStockupdate } from '@/views/Inventory/stockUpdate/hooks/useStockupdate'
import { useItemSearch } from '@/views/Inventory/stockUpdate/hooks/useItemSearch'
import { dialogImage, formatDecimal } from '@/views/Inventory/stockUpdate/utility/helper'

//-------------------------- Import Component -----------------------------------
import ProductImageDialog from '@/views/Inventory/stockUpdate/components/ProductImageDialog.vue'

//------------------------ Get Where House Name From LocalStorage and define to whereHouseSelectedItem ---------------------------
const whereHouse = localStorage.getItem('whereHouseName')

// Get access token from localStorage in another page
const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')

//-------------------------- Init Use -----------------------------------
const { 
  products,
  searchByCategoryId,
  searchByTypeId,
  searchBySubTypeId,
  searchByBarcode,
  searchByProductId,
  searchByProductName,
  searchByUOMId,
  searchByWareHouseId,
  searchByZoneId,
  searchByAreaId,
  searchBySubAreaId,
  searchByCategoryName,
  searchByTypeName,
  searchBySubTypeName,
  searchByBarcodeName,
  searchByProductCodeName,
  searchByProductNameFilter,
  searchByUnitName,
  menuCategory,
  menuGroup,
  menuSubGroup,
  menuBarcode,
  menuProductCode,
  menuProductName,
  menuUoM,
  itemsSearchByCategoryId,
  typeItemsSearchById,
  subTypeItemsSearchById,
  itemsSearchByUOMId,
  wareHouseItemsSearchById,
  zoneItemsSearchById,
  areaItemsSearchById,
  subAreaItemsSearchById,
  sortByCategory,
  sortByType,
  sortBySubType,
  sortByBarcode,
  sortByProductId,
  sortByProductName,
  sortByUnit,
  sortByQty,
  sortByTags,
  sortByNonTags, 

  serialProductCode,

  totalCount,
  currentPage,
  rowPerPage,
  totalPage,

  GetStockUpdateDetails: GetStockUpdate,
  resetSearchKey,
  clearModel,
  toggleSortType,
  stockUpdateExcelDetails: stockUpdateExcel,
} = useStockupdate(whereHouse, accessTokenAtStore)

const { 
  fetchItemsWareHouse,
  getItemsProductUnit,
  getItemsProductType,
  getItemsProductSubType,
  getItemLocalZone,
  getItemLocalArea,
  getItemLocalSubArea,
  fetchItemsSearchBy,
} = useItemSearch(
  urlApi, 
  accessTokenAtStore,
  whereHouse,
  wareHouseItemsSearchById,
  itemsSearchByUOMId,
  searchByCategoryId,
  typeItemsSearchById,
  subTypeItemsSearchById,
  searchByTypeId,
  zoneItemsSearchById,
  areaItemsSearchById,
  searchByZoneId,
  subAreaItemsSearchById,
  searchByAreaId,
)

const { 
  imgProduct,
  isDialogImageVisible,

  currentProduct,

  showDialogImage,
} = dialogImage(urlApi, accessTokenAtStore, whereHouse)

//------------------------------- Function Get StockUpdate Auto Search -----------------

// ใช้ watchDebounced สำหรับ search fields
watchDebounced(
  [
    searchByCategoryName,
    searchByTypeName,
    searchBySubTypeName,
    searchByBarcodeName,
    searchByProductCodeName,
    searchByProductNameFilter,
    searchByUnitName,
    searchByBarcode,
    searchByProductId,
    searchByProductName,
    serialProductCode,
  ],
  () => {
    // Reset to page 1 when search criteria changes
    currentPage.value = 1
    GetStockUpdate()
  },
  { debounce: 800, maxWait: 1500 }, // รอ 800ms หลังจากหยุดพิมพ์
)

// Watch สำหรับ dropdown selections (ไม่ต้อง debounce)
watch(
  [
    searchByCategoryId,
    searchByTypeId,
    searchBySubTypeId,
    searchByUOMId,
    searchByZoneId,
    searchByAreaId,
    searchBySubAreaId,
  ],
  () => {
    currentPage.value = 1
    GetStockUpdate()
  },
)

// เปลี่ยนจาก watchEffect เป็น watch specific values
watch([currentPage, rowPerPage], () => {
  GetStockUpdate()
})

onMounted(() => {
  GetStockUpdate()
})

//--------------------------------------- Function Pagination --------------------------------------------
// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value

  if (currentPage.value < 1)
    currentPage.value = 1
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  if (!products.value.length) return '0'

  const firstIndex = (currentPage.value - 1) * rowPerPage.value + 1
  const lastIndex = firstIndex + products.value.length - 1

  return `${firstIndex}-${lastIndex} of ${totalCount.value}`
})

// SECTION Checkbox toggle
const selectedRows = ref([])

///--------------------------------------- FetchItems for Search Box ----------------------------------------------

fetchItemsSearchBy('categories').then(data => {
  itemsSearchByCategoryId.value = data
})

function customFilter(item, queryText, itemText) {
  const textOne = itemText.title.toLowerCase()
  const textTwo = itemText.value.toLowerCase()
  const searchText = queryText.toLocaleLowerCase()
  
  return textOne.includes(searchText) || textTwo.includes(searchText)
}

const submitSearchButton = () => {
  GetStockUpdate()
}

onMounted(() => {
  fetchItemsWareHouse()
})

// ✅ ระบุ dependency ชัดเจน
watch(searchByCategoryId, () => {
  getItemsProductType()
  getItemsProductUnit()
}, { immediate: true })

watch(searchByTypeId, getItemsProductSubType, { immediate: true })
watch(searchByZoneId, getItemLocalArea, { immediate: true })
watch([searchByZoneId, searchByAreaId], getItemLocalSubArea, { immediate: true })

onMounted(() => {
  getItemLocalZone()
})

/// ----------------------- check config Barcode / Tag ----------------
const nameUser = localStorage.getItem('userCheck')

const checkConfigUser = nameUser => {
  if (nameUser == 'Chutimon') {
    return false
  } else if (nameUser == 'Tamma'){
    return true
  } else {
    return true
  }
}

checkConfigUser(nameUser)

//------------------------ Dialog Image ----------------------------

const checkRFID = ref ('')

watchEffect(() =>{
  const checkRFIDUpdate = ref (localStorage.getItem('configsShowRfdi'))
  if(checkRFIDUpdate.value === 'true'){
    console.log('RFID Check True:'+ checkRFIDUpdate.value)
    checkRFID.value = true
  } else if (checkRFIDUpdate.value === 'false') {
    // console.log('RFID Check False:'+ checkRFIDUpdate.value)
    checkRFID.value = false
  }
}) 
</script>

<template>
  <!-- Title Page -->
  <div>
    <VCard
      height="40px"
      class="bg-primary"
    >
      <VCardTitle class="pa-1">
        <div class="d-flex justify-start align-center">
          <IconBtn
            class="cursor-pointer"
            color="#FFFFFF"
            :to="{ name: 'dashboards-main',
            }"
          >
            <VIcon
              size="30"
              icon="ri-close-circle-fill"
            />
          </IconBtn>
          <h4 class="text-white">
            {{ $t('Stock Update - Total Details') }}
          </h4>
        </div>
      </VCardTitle>
    </VCard>
  </div>
  <!-- ----------           Search bar                                   ------------------------------------ -->
  <section class="my-2">
    <VExpansionPanels>
      <VExpansionPanel>
        <VExpansionPanelTitle
          ripple
          class="pa-0"
        >
          <template #default="{ expanded }">
            <VRow
              no-gutters
              class="d-flex justify-center"
            >
              <div v-if="expanded">
                <span class="text-h5">{{ $t('Filter') }}</span>
              </div>
              <span
                v-if="!expanded"
                class="text-h6"
              ><VIcon
                :color="!expanded ? '' : ''"
                :icon="expanded ? filter : 'ri-equalizer-line'"
              /></span>
            </VRow>
          </template>
          <template #actions="" />
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <VForm @submit.prevent="submitSearchButton">
            <!-- Warehouse  | Storehouse barcode | Store area | Sub Storage area -->

            <VRow>
              <!-- 👉 Select WareHouse -->
              <VCol
                cols="12"
                lg="3"
                sm="6"
                class="py-1"
              >
                <VAutocomplete
                  v-model="searchByWareHouseId"
                  :label="$t('Warehouse')"
                  :items="wareHouseItemsSearchById"
                  :custom-filter="customFilter"
                  item-title="name"
                  item-value="id"
                  item-text="name"
                  density="compact"
                  clearable
                  clear-icon="mdi-close"
                />
              </VCol>

              <!-- 👉 Select Storehouse Zone -->
              <VCol
                cols="12"
                lg="3"
                sm="6"
                class="py-1"
              >
                <VAutocomplete
                  v-model="searchByZoneId"
                  :label="$t('Store Zone')"
                  :items="zoneItemsSearchById"
                  :custom-filter="customFilter"
                  item-title="name"
                  item-value="id"
                  density="compact"
                  clearable
                  clear-icon="mdi-close"
                />
              </VCol>

              <!-- 👉 Select Store area -->
              <VCol
                cols="12"
                lg="3"
                sm="6"
                class="py-1"
              >
                <VAutocomplete
                  v-model="searchByAreaId"
                  :label="$t('Store Area')"
                  :items="areaItemsSearchById"
                  :custom-filter="customFilter"
                  item-title="name"
                  item-value="id"
                  density="compact"
                  clearable
                  clear-icon="mdi-close"
                />
              </VCol>

              <!-- 👉 Select Sub Storage area -->
              <VCol
                cols="12"
                lg="3"
                sm="6"
                class="py-1"
              >
                <VAutocomplete
                  v-model="searchBySubAreaId"
                  :label="$t('Sub Area')"
                  :items="subAreaItemsSearchById"
                  :custom-filter="customFilter"
                  item-title="name"
                  item-value="id"
                  density="compact"
                  clearable
                  clear-icon="mdi-close"
                />
              </VCol>
            </VRow>

            <!-- product categories | Group | Sub Group | Counting unit -->
            <VRow>
              <!-- 👉 Select  product categories  -->
              <VCol
                cols="12"
                lg="3"
                sm="6"
                class="py-1"
              >
                <!-- 👉 Search categories -->

                <section>
                  <VAutocomplete
                    v-model="searchByCategoryId"
                    :label="$t('Categories')"
                    :items="itemsSearchByCategoryId"
                    :custom-filter="customFilter"
                    item-title="name"
                    item-value="id"
                    density="compact"
                    clearable
                    clear-icon="mdi-close"
                  />
                </section>
              </VCol>

              <!-- 👉 Select Group -->
              <VCol
                cols="12"
                lg="3"
                sm="6"
                md="6"
                class="py-1"
              >
                <!-- 👉 Search ProductID -->
                <VAutocomplete
                  v-model="searchByTypeId"
                  :label="$t('Product Group')"
                  :items="typeItemsSearchById"
                  :custom-filter="customFilter"
                  item-title="name"
                  item-value="id"
                  density="compact"
                  clearable
                  clear-icon="mdi-close"
                />
              </VCol>

              <!-- 👉 Select  Sub Group -->
              <VCol
                cols="12"
                lg="3"
                sm="6"
                class="py-1"
              >
                <!-- 👉 Search Description -->
                <VAutocomplete
                  v-model="searchBySubTypeId"
                  :label="$t('Product Sub Group')"
                  :items="subTypeItemsSearchById"
                  :custom-filter="customFilter"
                  item-title="name"
                  item-value="id"
                  density="compact"
                  clearable
                  clear-icon="mdi-close"
                />
              </VCol>

              <!-- 👉 Select Counting unit -->
              <VCol
                v-if="false"
                cols="12"
                lg="3"
                sm="6"
                class="py-1"
              >
                <section>
                  <VAutocomplete
                    v-model="searchByUOMId"
                    :label="$t('Counting Unit')"
                    :items="itemsSearchByUOMId"
                    :custom-filter="customFilter"
                    item-title="name"
                    item-value="id"
                    density="compact"
                    clearable
                    clear-icon="mdi-close"
                  />
                </section>
              </VCol>

              <!-- 👉 Select Counting unit -->
              <VCol
                v-if="true"
                cols="12"
                lg="3"
                sm="6"
                class="py-1"
              >
                <section>
                  <VTextField
                    v-model="serialProductCode"
                    :label="$t('Serial')"
                    density="compact"
                  />
                </section>
              </VCol>
            </VRow>
    
            <!-- Barcode | Product code | Product Name | Button Export -->
            <VRow>
              <!-- 👉 Select Barcode -->
              <VCol
                cols="12"
                lg="3"
                sm="6"
                class="py-1"
              >
                <!-- 👉 Search Product code -->
                <VTextField
                  v-model="searchByBarcode"
                  :label="$t('Barcode')"
                  type="Barcode"
                  density="compact"
                  append-inner-icon="mdi-barcode-scan"
                />
              </VCol>

              <!-- 👉 Select Product code -->
              <VCol
                cols="12"
                lg="3"
                sm="6"
                class="py-1"
              >
                <VTextField
                  v-model="searchByProductId"
                  :label="$t('Product Code')"
                  type="Product Code"
                  density="compact"
                />
              </VCol>

              <!-- 👉 Select Product Name -->
              <VCol
                cols="12"
                lg="3"
                sm="6"
                class="py-1"
              >
                <VTextField
                  v-model="searchByProductName"
                  :label="$t('Product Name')"
                  type="Product Name"
                  density="compact"
                />
              </VCol>

              <!-- 👉 Button Search and Export -->
              <VCol
                cols="12"
                xs="4"
                sm="4"
                md="3"
                class="py-1"
              >
                <VRow>
                  <!-- 👉 Button Search  -->
                  <VCol
                    xs="4"
                    sm="6"
                    cols="6"
                  >
                    <VBtn
                      v-if="false"
                      type="submit"
                      density="compact"
                      size="x-large"
                      class="px-16 px-sm-12 custom-small-btn-search"
                      style="width: 100%; height: 40px;"
                      @click="GetStockUpdate"
                    >
                      <VIcon
                        icon="mdi-magnify"
                        size="20px"
                      />
                      {{ $t('Search') }}
                    </VBtn>
                    <VBtn
                      size="x-large"
                      color="red"
                      style="width: 100%; height: 40px;"
                      @click="clearModel"
                    >
                      <VIcon
                        v-if="false"
                        icon="ri-filter-off-fill"
                        size="20px"
                      />
                      {{ $t('Clear') }}
                    </VBtn>
                  </VCol>
                  <!--  Export -->
                  <VCol
                    sm="6"
                    cols="6"
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
                      <span style="font-size: 18px;">{{ $t('Export file') }}</span>
                    </VBtn>
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          </VForm>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </section>

  <!-- Dialog Image -->

  <ProductImageDialog
    v-model="isDialogImageVisible"
    :image-src="imgProduct"
    :product-data="currentProduct"
    :format-decimal="formatDecimal"
    @update:model-value="handleDialogClose"
  />

  <!-- ----------             Product  Easetrack                                  ------------------------------------ -->
  <section>
    <VCard class="mt-6">
      <VDivider />

      <VTable class="text-no-wrap table-header-bg rounded-0">
        <!-- 👉 table head -->
        <thead>
          <tr>
            <th
              scope="row"
              class="text-center px-1"
            >
              {{ $t('No.') }}
            </th>
            <th
              scope="row"
              class="text-center px-1"
            >
              {{ $t('Image') }}
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              {{ $t('Product Code') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-if="false"
                v-model="menuProductCode"
                :close-on-content-click="false"
                location="end"
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
                            v-model="searchByProductCodeName"
                            class="mt-4"
                            :label="$t('Product Code')"
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
                            @click="menuProductCode = false"
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
              {{ $t('Product Name') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-if="false"
                v-model="menuProductName"
                :close-on-content-click="false"
                location="end"
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
                            v-model="searchByProductNameFilter"
                            class="mt-4"
                            :label="$t('Product Name')"
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
              {{ $t('Categories') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-if="false"
                v-model="menuCategory"
                :close-on-content-click="false"
                location="end"
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
                            v-model="searchByCategoryName"
                            class="mt-4"
                            :label="$t('Product Categories')"
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
                            @click="menuCategory = false"
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
              {{ $t('Secondary product categories') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-if="false"
                v-model="menuGroup"
                :close-on-content-click="false"
                location="end"
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
                            v-model="searchByTypeName"
                            class="mt-4"
                            :label="$t('Secondary product categories')"
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
                            @click="menuGroup = false"
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
              {{ $t('Sub product categories') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-if="false"
                v-model="menuSubGroup"
                :close-on-content-click="false"
                location="end"
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
                            v-model="searchBySubTypeName"
                            class="mt-4"
                            :label="$t('Sub product categories')"
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
                            @click="menuSubGroup = false"
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
              {{ $t('Barcode') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-if="false"
                v-model="menuBarcode"
                :close-on-content-click="false"
                location="end"
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
                            v-model="searchByBarcodeName"
                            class="mt-4"
                            :label="$t('Barcode')"
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
                            @click="menuBarcode = false"
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
              {{ $t('Lot') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VIcon
                v-if="false"
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByQty')"
              />
              <VMenu
                v-if="false"
                v-model="menuLot"
                :close-on-content-click="false"
                location="end"
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
                            v-model="searchByLot"
                            class="mt-4"
                            :label="$t('Lot')"
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
                            @click="searchByLot = ''"
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
                            @click="menuLot = false"
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
              {{ $t('Lot Batch') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VIcon
                v-if="false"
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByQty')"
              />
              <VMenu
                v-if="false"
                v-model="menuLot"
                :close-on-content-click="false"
                location="end"
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
                            v-model="searchByLot"
                            class="mt-4"
                            :label="$t('Lot')"
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
                            @click="searchByLot = ''"
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
                            @click="menuLot = false"
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
              class="text-end px-1"
            >
              SERIAL NO.
              <!-- ----------------------------- Icon Search By --------------------- -->
            </th>
            <th
              v-if="true"
              scope="row"
              class="text-start px-1"
            >
              {{ $t('Remark') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
            </th>
            <th
              v-if="checkRFID"
              scope="row"
              class="text-end px-1"
            >
              TAG QTY.
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByTags')"
              />
            </th>
            <th
              v-if="checkRFID"
              scope="row"
              class="text-end px-1"
            >
              NON-TAG QTY.
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByNonTags')"
              />
            </th>
            <th
              scope="row"
              class="text-end px-1"
            >
              {{ $t('TOTAL QTY.') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByQty')"
              />
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              {{ $t('Counting Unit') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-if="false"
                v-model="menuUoM"
                :close-on-content-click="false"
                location="end"
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
              {{ $t('Color') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-if="false"
                v-model="menuColor"
                :close-on-content-click="false"
                location="end"
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
                            v-model="searchByColor"
                            class="mt-4"
                            :label="$t('Color')"
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
                            @click="searchByColor = ''"
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
                            @click="menuColor = false"
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
              {{ $t('Size') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-if="false"
                v-model="menuSize"
                :close-on-content-click="false"
                location="end"
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
                            v-model="searchBySize"
                            class="mt-4"
                            :label="$t('Size')"
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
                            @click="searchBySize = ''"
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
                            @click="menuSize = false"
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
              {{ $t('Style No.') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-if="false"
                v-model="menuStyle"
                :close-on-content-click="false"
                location="end"
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
                            v-model="searchByStyle"
                            class="mt-4"
                            :label="$t('Style No.')"
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
                            @click="searchByStyle = ''"
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
                            @click="menuStyle = false"
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
              {{ $t('Model') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-if="false"
                v-model="menuVersion"
                :close-on-content-click="false"
                location="end"
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
                            v-model="searchByVersion"
                            class="mt-4"
                            :label="$t('Version')"
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
                            @click="searchByVersion = ''"
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
                            @click="menuVersion = false"
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
              {{ $t('Brand') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-if="false"
                v-model="menuBrand"
                :close-on-content-click="false"
                location="end"
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
                            v-model="searchByBrand"
                            class="mt-4"
                            :label="$t('Product Brand')"
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
                            @click="searchByBrand = ''"
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
                            @click="menuBrand = false"
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
              {{ $t('Weight') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByQty')"
              />
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              {{ $t('UoM Weight') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByQty')"
              />
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              {{ $t('width') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByQty')"
              />
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              {{ $t('length') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByQty')"
              />
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              {{ $t('height') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByQty')"
              />
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              {{ $t('UoM Scale') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByQty')"
              />
            </th>
            <th
              scope="row"
              class="text-start px-1"
            >
              {{ $t('Warehouse') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-if="false"
                v-model="menuWarehouse"
                :close-on-content-click="false"
                location="end"
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
                            v-model="searchByWarehouse"
                            class="mt-4"
                            :label="$t('Warehouse')"
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
                            @click="searchByWarehouse = ''"
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
                            @click="menuWarehouse = false"
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
              {{ $t('Zone') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-if="false"
                v-model="menuZone"
                :close-on-content-click="false"
                location="end"
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
                            v-model="searchByZone"
                            class="mt-4"
                            :label="$t('Zone')"
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
                            @click="searchByZone = ''"
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
                            @click="menuZone = false"
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
              {{ $t('Area') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-if="false"
                v-model="menuArea"
                :close-on-content-click="false"
                location="end"
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
                            v-model="searchByArea"
                            class="mt-4"
                            :label="$t('Area')"
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
                            @click="searchByArea = ''"
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
                            @click="menuArea = false"
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
              {{ $t('Sub Area') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-if="false"
                v-model="menuSubArea"
                :close-on-content-click="false"
                location="end"
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
                            v-model="searchBySubArea"
                            class="mt-4"
                            :label="$t('Area')"
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
                            @click="searchBySubArea = ''"
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
                            @click="menuSubArea = false"
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
              v-if="false"
              scope="row"
              class="text-start"
            >
              {{ $t('Serial') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByTags')"
              />
            </th>
            <th
              v-if="false"
              scope="row"
              class="text-start px-1"
            >
              {{ $t('Serial No.') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-if="false"
                v-model="menuSerial"
                :close-on-content-click="false"
                location="end"
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
                            v-model="searchBySerial"
                            class="mt-4"
                            :label="$t('Serial No.')"
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
                            @click="searchBySerial = ''"
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
                            @click="menuSerial = false"
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
              v-if="false"
              scope="row"
              class="text-center px-1"
            >
              Action
            </th>
          </tr>
        </thead>
        
        <!-- 👉 table body -->
        <tbody>
          <tr
            v-for="(product, index) in products"
            :key="index"
          >
            <!-- 👉 Ordinal Number -->
            <td class="text-center px-1">
              {{ (currentPage - 1) * rowPerPage + index + 1 }}
            </td>

            <!-- 👉 Image -->
            <td class="text-center px-1">
              <div v-if="false">
                <VBtn
                  width="70px"
                  height="70px"
                  variant="text"
                >
                  <VImg
                    v-if="product.image"
                    :width="70"
                    :height="70"
                    aspect-ratio="16/9"
                    cover
                    :src="product.image"
                    @click="showDialogImage(
                      product.productId,
                      product.productName,
                      product.image,
                      product.barcode,
                      product.categoryName,
                      product.typeName,
                      product.subTypeName,
                      product.qty,
                      product.unitName,
                      product,
                      
                    )"
                  />
                </VBtn>
              </div>
              <div v-if="true">
                <VHover v-slot="{ isHovering, props }">
                  <VBtn
                    class="mx-auto"
                    color="grey-lighten-4"
                    max-width="70px"
                    height="70px"
                    v-bind="props"
                    variant="text"
                  >
                    <VImg
                      :src="product.image"
                      :width="70"
                      :height="70"
                      cover
                      class="image-transition"
                      @click="showDialogImage(
                        product.productId,
                        product.productName,
                        product.image,
                        product.barcode,
                        product.categoryName,
                        product.typeName,
                        product.subTypeName,
                        product.qty,
                        product.unitName,
                        product,
                      )"
                    >
                      <VExpandTransition>
                        <div
                          v-if="isHovering"
                          style="height: 100%;"
                        >
                          <VAvatar
                            size="20"
                            color="primary"
                            class="d-flex"
                          >
                            <VIcon icon="mdi-magnify-plus-outline" />
                          </VAvatar>
                        </div>
                      </VExpandTransition>
                    </VImg>
                  </VBtn>
                </VHover>
              </div>
            </td>

            <!-- 👉 Product code -->
            <td class="text-start px-1">
              {{ product.productId }}
            </td>

            <!-- 👉 Product Name -->
            <td class="text-start px-1">
              {{ (product.productName) }}
            </td>

            <!-- 👉 Product categories -->
            <td class="text-start px-1">
              {{ product.categoryName }}
            </td>

            <!-- 👉 Secondary product categories -->
            <td class="text-start px-1">
              {{ product.typeName }}
            </td>

            <!-- 👉 Sub product categories -->
            <td class="text-start px-1">
              {{ product.subTypeName }}
            </td>

            <!-- 👉 Barcode -->
            <td class="text-start px-1">
              <VueBarcode
                v-if="product.barcode"
                class="text-start"
                :options="{
                  width: '1%',
                  height: '20%',
                  fontSize: '16px', 
                }"
                :value="product.barcode"
              />
            </td>

            <td
              class="text-start px-1"
              style="width: 5rem;"
              data-field="lotBatch"
            >
              {{ product.lotM }}
            </td>

            <td
              data-field="LotMaster"
              class="text-start px-1"
              style="width: 5rem;"
            >
              {{ product.lotMaster }}
            </td>

            <td
              class="text-start px-1"
              style="width: 5rem;"
            >
              {{ product.serialNo }}
            </td>
            <td
              class="text-start px-1"
              style="width: 5rem;"
            >
              {{ product.remark }}
            </td> 

            <!-- 👉 Tag -->
            <td
              v-if="false"
              class="text-start"
            >
              {{ (product.serial) }}
            </td>

            <!-- 👉 Number(Tag) -->
            <td
              v-if="checkRFID"
              class="text-end px-1"
            >
              {{ (formatDecimal(product.tags)).toLocaleString('en-US') }}
            </td>

            <!-- 👉 Number(Non-Tag) -->
            <td
              v-if="checkRFID"
              class="text-end  px-1"
            >
              {{ (formatDecimal(product.nonTags)).toLocaleString('en-US') }}
            </td>
            <!-- 👉 Total quantity of products -->
            <td class="text-end px-1">
              {{ (formatDecimal(product.qty)).toLocaleString('en-US') }}
            </td>

            <!-- 👉 Counting unit -->
            <td
              class="text-start px-1"
              style="width: 5rem;"
            >
              {{ product.unitName }}
            </td>
            
            <td
              class="text-start px-1"
              style="width: 5rem;"
            >
              {{ product.color }}
            </td>
            <td
              class="text-start px-1"
              style="width: 5rem;"
            >
              {{ product.size }}
            </td>
            <td
              class="text-start px-1"
              style="width: 5rem;"
            >
              {{ product.style }}
            </td>
            <td
              class="text-start px-1"
              style="width: 5rem;"
            >
              {{ product.modelNo }}
            </td>
            
            <td
              class="text-start px-1"
              style="width: 5rem;"
            >
              {{ product.brand }} 
            </td>
            <td
              class="text-end px-1"
              style="width: 5rem;"
            >
              {{ (product.pdWeight).toLocaleString('en-US') }}
            </td>
            <td
              class="text-start px-1"
              style="width: 5rem;"
            >
              {{ (product.unitWeight).toLocaleString('en-US') }}
            </td>
            <td
              class="text-end px-1"
              style="width: 5rem;"
            >
              {{ (product.dimensionWidth).toLocaleString('en-US') }}
            </td>
            <td
              class="text-end px-1"
              style="width: 5rem;"
            >
              {{ (product.dimensionLength).toLocaleString('en-US') }}
            </td>
            <td
              class="text-end px-1"
              style="width: 5rem;"
            >
              {{ (product.dimensionHeight).toLocaleString('en-US') }}
            </td>
            <td
              class="text-start px-1"
              style="width: 5rem;"
            >
              {{ product.unitDimension }}
            </td>
            <td
              class="text-start px-1"
              style="width: 5rem;"
            >
              {{ product.stockName }}
            </td>
            <td
              class="text-start px-1"
              style="width: 5rem;"
            >
              {{ product.zoneName }}
            </td>
            <td
              class="text-start px-1"
              style="width: 5rem;"
            >
              {{ product.areaName }}
            </td>
            <td
              class="text-start px-1"
              style="width: 5rem;"
            >
              {{ product.subAreaName }}
            </td>
            <!--
              <td
              class="text-start px-1"
              style="width: 5rem;"
              >
              {{ product.serailNo }}
              </td>
              
            -->

            <!-- 👉 Actions -->
            <td
              v-if="false"
              style="width: 8rem;"
              class="text-center px-1"
            >
              <RouterLink
                :to="{ 
                  name: 'inventory-stockUpdateByProduct-view-id', 
                  params: { id: index }, 
                  query: { productId: product.productId ,
                           UnitId: product.unitId,
                           warehouseStock: searchByWareHouseId ,
                           serialCode: serialProductCode,
                  }, 
                }"
              >
                <VIcon icon="mdi-eye-outline" />
              </RouterLink>
              
              <!-- MoreBtn component with menu list and item props -->
              <!--   <MoreBtn :menu-list="computedMoreListP(item.No)" item-props /> -->
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
</style>

