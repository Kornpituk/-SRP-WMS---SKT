<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { ref, watch } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api'

import { useRouter } from 'vue-router'

const router = useRouter()

const whereHouse = localStorage.getItem('whereHouseName')
const whereHouseSelectedItem = ref(whereHouse)
const products = ref([])


// Get access token from localStorage in another page
const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')

const perPage = ref(10)
const page = ref(0)
const totalCount = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)

//------------------- Model ID For search ------------------------------------
const searchByCategoryId = ref(null)
const searchByTypeId = ref(null)
const searchBySubTypeId = ref(null)
const searchByBarcode = ref(null)
const searchByProductId = ref(null)
const searchByProductName = ref(null)
const searchByUOMId = ref(null)
const searchByWareHouseId = ref(whereHouse)
const searchAllProducts = ref(null)

const searchByColorId = ref(null)
const searchBySizeIdName = ref(null)

//------------------------ Model Name for search ------------------------------
const searchByCategoryName = ref(null)
const searchByTypeName = ref(null)
const searchBySubTypeName = ref(null)
const searchByBarcodeName = ref(null)
const searchByProductCodeName = ref(null)
const searchByProductNameFilter = ref(null)
const searchByUOMName = ref(null)
const searchByUnitName = ref(null)
const searchByColorName = ref(null)
const searchBySizeName = ref(null)

//----- Search Filter Icon Header Table[Product Category, Group, Sub Group, Barcode, Product Category Code, Product Name]
const menuCategory= ref( false)
const menuGroup = ref( false)
const menuSubGroup = ref( false)
const menuBarcode = ref( false)
const menuProductCode = ref( false)
const menuProductName = ref( false)
const menuUoM = ref( false)
const menuColor = ref( false)
const menuSize = ref( false)

//------------------------ item ID for search ------------------------------
const itemsSearchByCategoryId = ref([])

const typeItemsSearchById = ref([])

const subTypeItemsSearchById = ref([])

const itemsSearchByUOMId = ref([])

const wareHouseItemsSearchById = ref([])

//----------------------  SortBy Variable  -------------------------------------
const sortByCategory = ref('')
const sortByType = ref('')
const sortBySubType = ref('')
const sortByBarcode = ref('')
const sortByProductId = ref('')
const sortByProductName = ref('')
const sortByUnit = ref('')
const sortByQty = ref('')
const sortByTags = ref('')
const sortByNonTags = ref('')
const sortByLastupdate = ref('')


const toggleSortType = sortBy => {
  const sortRefs = { sortByCategory, sortByType, sortBySubType, sortByBarcode, sortByProductId, sortByProductName, sortByUnit, sortByQty, sortByLastupdate, sortByNonTags }

  for (const key in sortRefs) {
    if (key === sortBy) {
      sortRefs[key].value = sortRefs[key].value === 'asc' ? 'desc' : 'asc'
    } else {
      sortRefs[key].value = '' // ล้างค่าที่ไม่เกี่ยวข้อง
    }

    // console.log("Sort type:",sortRefs[key],'Key',[key])
  }

  // console.log("Sort type:",sortRefs[key],'Key',[key])
}

//--------------------------------------------------------------------------------
const clearFilter = () => {
  searchAllProducts.value = null
  searchByBarcode.value = null
  searchByProductId.value = null
  searchByProductName.value = null
  searchByUOMId.value = null
  searchByUOMName.value = null
  searchByCategoryId.value = null
  searchByTypeId.value = null
  searchBySubTypeId.value = null
  searchByColorId.value = null
  searchBySizeIdName.value = null

  searchByCategoryName.value = null
  searchByTypeName.value = null
  searchBySubTypeName.value = null
  searchByColorName.value = null
  searchBySizeName.value = null
  searchByBarcodeName.value = null
  searchByProductCodeName.value = null
  searchByProductNameFilter.value = null
  searchByUnitName.value = null
  
  sortByCategory.value = null
  sortByType.value = null
  sortBySubType.value = null
  sortByBarcode.value = null
  sortByProductId.value = null
  sortByProductName.value = null
  sortByUnit.value = null 
  sortByQty.value = null
  sortByLastupdate.value = null
}

const GetStockUpdate = () => {
  console.log("GetStockUpdate", searchByWareHouseId.value)

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.get(`${urlApi.value}/api/v1/Product/ProductList?page=`+currentPage.value+`&perPage=`+rowPerPage.value, {
    params: {
      searchAll: searchAllProducts.value,
      barcode: searchByBarcode.value,
      productId: searchByProductId.value,
      productName: searchByProductName.value,
      unitId: searchByUOMId.value,
      unitName: searchByUOMName.value,
      categoryId: searchByCategoryId.value,
      typeId: searchByTypeId.value,
      subTypeId: searchBySubTypeId.value,
      colorName: searchByColorId.value,
      sizeName: searchBySizeIdName.value,

      searchByCategory: searchByCategoryName.value,
      searchByType: searchByTypeName.value,
      searchBySubType: searchBySubTypeName.value,
      searchByColor: searchByColorName.value,
      searchBySize: searchBySizeName.value,
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
      'sortByLastupdate': sortByLastupdate.value,

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

      console.log('[products.value List]!!: ', response.data)

      
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })
}

watchEffect(GetStockUpdate)

// 👉 watching current page
watch(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})


// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = products.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = products.value.length + (currentPage.value - 1) * rowPerPage.value

  // console.log('const firstIndex ',firstIndex,'=','products.value.length:'+products.value.length,'?',(currentPage.value - 1)* rowPerPage.value + 1)
  // console.log('const lastIndex ',lastIndex,'=',products.value.length,'+',(currentPage.value - 1),'*',rowPerPage.value)
  // console.log('products.value.length: ',products.value.length)
  
  return `${ firstIndex }-${ lastIndex } of ${ totalCount.value }`
})

// SECTION Checkbox toggle
// -------------------------------------------------- Check box --------

const selectAll = ref(false)
const checkSelectItems = ref([])

const selectAllRows = () => {
  if (selectAll.value) {
    checkSelectItems.value = products.value.map(product => product)
  } else {
    checkSelectItems.value = []
  }
}

watch(() => {
  console.log('checkSelectItems:***', checkSelectItems.value)

})

//--------------------------------------- FetchItems for Search WareHouse  ----------------------------------------

const fetchItemsWareHouse = () => {
  axiosIns.get(`${urlApi.value}/api/Auth/GetLocation`, {
    headers: {
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
    .then(response => {

      wareHouseItemsSearchById.value = response.data

      // Now `items` contains an array of objects with id and name properties
      // console.log('wareHouse.value At index',wareHouseItemsSearchById.value)

      
    })
    .catch(error => {
      // Handle errors
      selectError.value = 'Where house not selected!!'
      console.error('Error:', error)
    })

    
}

watch(fetchItemsWareHouse)

const fetchItemsSearchBy = nameSearch => {
  return axiosIns.get(`${urlApi.value}/api/v1/Product/${nameSearch}`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }).then(response => {
    return response.data
  }).catch(error => {
    console.error('Error:', error)
    
    return null
  })
}

fetchItemsSearchBy('categories').then(data => {
  itemsSearchByCategoryId.value = data
})

//--------------------------------------- FetchItems for Search  Unit  ----------------------------------------

const getItemsProductUnit = () => {
  axiosIns.get(`${urlApi.value}/api/v1/Product/`+searchByCategoryId.value+'/Unit', {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
    .then(response => {

      itemsSearchByUOMId.value = response.data

      // Now `items` contains an array of objects with id and name properties
      // console.log('itemsSearchByUOMId.value At index',itemsSearchByUOMId.value)

      
    })
    .catch(error => {
      // Handle errors
      selectError.value = 'Where house not selected!!'
      console.error('Error:', error)
    })

    
}

watchEffect(getItemsProductUnit)

//--------------------------------------- FetchItems for Search  Type(Group) ----------------------------------------

const getItemsProductType = () => {
  axiosIns.get(`${urlApi.value}/api/v1/Product/Types`, {
    params: {
      'CategoryId': searchByCategoryId.value,
    },
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
    .then(response => {

      typeItemsSearchById.value = response.data

      
    })
    .catch(error => {
      // Handle errors
      selectError.value = 'Where house not selected!!'
      console.error('Error:', error)
    })

    
}

watchEffect(getItemsProductType)

//--------------------------------------- FetchItems for Search Sub Type(Sub Group) ----------------------------------------

const getItemsProductSubType = () => {
  axiosIns.get(`${urlApi.value}/api/v1/Product/SubTypes/All`, {
    params: {
      'TypeId': searchByTypeId.value,
    },
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
    .then(response => {

      subTypeItemsSearchById.value = response.data

      // Now `items` contains an array of objects with id and name properties
      // console.log('wareHouse.value At index',wareHouseItemsSearchById.value)

      
    })
    .catch(error => {
      // Handle errors
      selectError.value = 'Where house not selected!!'
      console.error('Error:', error)
    })

    
}

watchEffect(getItemsProductSubType)

// --------------------------------------- Export Barcode Excel ----------------------
const checkboxBarcode = ref(false)
const checkboxQRCode = ref(false)
const numberPrintPOBarcode = ref(1)

const exportExcel = async (endpoint, fileNamePrefix) => {
  const barcodes = checkSelectItems.value.map(item => item.barcode)

  try {
    const response = await axiosIns.post(`${urlApi.value}/api/v1/Product/ProductList/${endpoint}/Pdf`, barcodes, {
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
        'x-location': `${whereHouse}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
      params: {
        copy: numberPrintPOBarcode.value,
        'sortByCategory': sortByCategory.value,
        'sortByType': sortByType.value,
        'sortBySubType': sortBySubType.value,
        'sortByBarcode': sortByBarcode.value,
        'sortByProductId': sortByProductId.value,
        'sortByProductName': sortByProductName.value,
        'sortByUnit': sortByUnit.value,
        'sortByQty': sortByQty.value,
        'sortByLastupdate': sortByLastupdate.value,
      },
      responseType: 'blob', // ให้เซิร์ฟเวอร์รีเทิร์น blob สำหรับไฟล์ PDF
    })

    console.log(`${endpoint}/PDF`, response)

    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    let fileYear
    const threshold = 2500

    if (year > threshold) {
      fileYear = year - 543
    } else {
      fileYear = year
    }

    const dateString = currentDate.toISOString().slice(0, 10).replace(/-/g, '').replace(year.toString(), fileYear.toString())
    const fileName = `${fileNamePrefix}_${dateString}.pdf`

    const link = document.createElement('a')

    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error(`Error: ${endpoint}`, error)
    alert(`An error occurred while generating the ${fileNamePrefix} PDF. Please try again later.`)
  }
}

const onClickExportExcelList = async () => {
  if (checkboxBarcode.value && !checkboxQRCode.value) {
    await exportExcel('Barcode', 'Product_List_Barcode')
  } else if (!checkboxBarcode.value && checkboxQRCode.value) {
    await exportExcel('QrCode', 'Product_List_QRCode')
  } else if (checkboxBarcode.value && checkboxQRCode.value) {
    await exportExcel('Barcode', 'Product_List_Barcode')
    await exportExcel('QrCode', 'Product_List_QRCode')
  } else {
    console.log('No selection')
  }
}

//------------------------------ Btn Print IN Table -----------------
const printBarcode = product => {
  isDialogPrintBarcodeVisible.value = true

  // console.log('printBarcode:', product)
  checkSelectItems.value.push(product) // เพิ่มค่า product ลงใน checkSelectItems.value
}

//------------------------------ Delete Button --------------------------
// const isDialogVisible = ref(false)
const deleteBarcode = async  product => {
  try {
    const response = await axiosIns.post(`${urlApi.value}/api/v1/Product/Delete`, {
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
        'x-location': `${whereHouse}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
      params: {
        productId: product,
      },
    })
  } catch (error) {
    console.error(`Error: ${endpoint}`, error)
  }
}

//-------------------------------------  Formed Td ------------------------
const formattedProductName = productName => {
  if (productName !== undefined && productName !== null) {
    // console.log("productName: ",productName)
    
    return productName.replace(/((.{26})(\/|\s|$))/g, "$1\n")
  }
  
  return 'Non'
}

//-------------------------- format decimal -------------------

const formatDecimal = decimal => {
  const configsShowDigit = localStorage.getItem('configsShowDigit')
  if (configsShowDigit == 'true') {
    return Math.ceil(decimal)
  } else {
    return decimal
  }
}

//---------------------------- format date --------------------
const formatDate = dateString => {
  // แปลง string ให้เป็นวันที่
  const date = new Date(dateString)

  // ดึงวันที่ (day), เดือน (month), และปี (year) จากวันที่
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // เดือนใน JavaScript เริ่มต้นที่ 0
  const year = date.getFullYear()

  // สร้างรูปแบบวันที่ใหม่เป็น วว/ดด/ปปปป
  return `${day}/${month}/${year}`
}

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

//-------------------------------- Print Barcode --------------------------------

//----------------------------- Dialog --------------------------------------------
const isDialogPrintBarcodeVisible = ref(false)

//---------------------------- Filter -------------------------------------
const drawer = ref(null)

//----------------------------- App View -----------------------------------
const appView = ref(null)
const iconViewApp = ref('mdi-view-list')

const switchAppView = () => {
  appView.value = !appView.value
  if(!appView.value){
    iconViewApp.value = 'mdi-view-list'
  } else {
    iconViewApp.value = 'mdi-apps'
  }
}

//------------------------ Dialog Image ---------------------
const isDialogImageVisible = ref(false)
const showExpansionDialog = ref(false)
const urlImage = ref('')
const nameImage = ref('')
const nameProductImage = ref('')
const codeProductImage = ref('')
const codeProduct = ref('')
const nameProduct = ref('')
const colorProduct = ref('')
const sizeProduct = ref('')
const statusProduct = ref('')
const imgProduct = ref('')
const barcodeProduct = ref('')
const categoriesProduct = ref('')
const groupProduct = ref('')
const groupSupProduct = ref('')
const totalProduct = ref('')
const unitNameProduct = ref('')
const detailsProduct = ref('')

const showDialogImage = (urlImageProduct,
  code, name, categories, group, groupSup, details) => {
  urlImage.value = urlImageProduct
  codeProduct.value = code
  nameProduct.value = name
  categoriesProduct.value = categories
  groupProduct.value = group
  groupSupProduct.value = groupSup
  detailsProduct.value = details
  isDialogImageVisible.value = true
}

const items = ref([
  { title: 'Edit', icon: 'ri-edit-box-line', value: 'edit' },
  { title: 'Print', icon: 'ri-printer-line', value: 'print' },
  { title: 'Delete', icon: 'ri-delete-bin-line', value: 'delete' },
])

const MenuCardTableProduct = (value, barcode, productId) => {
  console.log('MenuCardTableProduct!!')
  if(value === 'edit'){
    console.log('MenuCardTableProductEdit!!', value)
    router.push({
      name: 'configurationSetting-productInformation-product-addProduct-editProductDetails',
      query: { productId: productId },
    })
  } else if(value === 'print'){
    checkSelectItems.value.push(barcode)
    isDialogPrintBarcodeVisible.value = true
    console.log('barcode', checkSelectItems.value)
  } else if(value === 'delete'){
    console.log('MenuCardTableProductDelete!!', value)
  }
}

//----------------------------------------- Dialogs ----------------------------------------------------------------
//-------------- Dialogs Delete -------------------------------
const isDialogDeleteVisible = ref(false)
const isDialogDeleteAlertVisible = ref(false)
const productIdDelete = ref('')
const productNameDelete = ref('')

const deleteProductAlert = () => {
  isDialogDeleteAlertVisible.value = true
  isDialogDeleteVisible.value = false
  getItemsProductSubType()
}

const deleteProductConfirm = (productId, productName) => {
  isDialogDeleteVisible.value = true
  productIdDelete.value = productId
  productNameDelete.value = productName

}

const deleteProduct = async productId => {
  try {
    const response = await axiosIns.post(`${urlApi.value}/api/v1/Product/Delete/`+productId, {}, {
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
        'x-location': `${whereHouse}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },

      // params: {
      //   productId: productId,
      // },
    })

    console.log(`response `, response)
    deleteProductAlert()
  } catch (error) {
    console.error(`Error: `, error)
  }
}
</script>

<template>
  <!-- Label -->
  <div>
    <VCard
      height="45px"
      class="bg-primary"
    >
      <VCardTitle class="pa-1">
        <div class="d-flex justify-lg-space-between align-center">
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
              {{ $t('Product List') }}
            </h4>
          </div>
        </div>
      </VCardTitle>
    </VCard>
  </div>

  <!-- Filter Search -->
  <section
    v-if="true"
    class="my-2"
  >
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
              </VCol>

              <!-- 👉 Select Store area -->
              <VCol
                cols="12"
                lg="3"
                sm="6"
                class="py-1"
              >
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

              <!-- 👉 Select Sub Storage area -->
              <VCol
                cols="12"
                lg="3"
                sm="6"
                class="py-1"
              >
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
                <VTextField
                  v-model="searchByBarcode"
                  :label="$t('Barcode')"
                  type="Barcode"
                  density="compact"
                  append-inner-icon="mdi-barcode-scan"
                />
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
                <VTextField
                  v-model="searchByProductId"
                  :label="$t('Product Code')"
                  type="Product Code"
                  density="compact"
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
                <VTextField
                  v-model="searchByProductName"
                  :label="$t('Product Name')"
                  type="Product Name"
                  density="compact"
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
                <section />
              </VCol>

              <!-- 👉 Select Counting unit -->
              <VCol
                v-if="true"
                cols="12"
                lg="3"
                sm="6"
                class="py-1"
              >
                <!-- App View -->
                <VBtn
                  density="compact"
                  color="red"
                  style="width: 100%; height: 40px;"
                  @click="clearFilter"
                >
                  <span>{{ $t('Clear') }}</span>
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </section>

  <!-- Search All / Print / Create / Cancel / Switch View -->
  <section>
    <VCard>
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            lg="6"
            class="py-1 d-flex align-center"
          >
            <VTextField
              v-model="searchAllProducts"
              density="compact"
            >
              <template #label>
                <span>{{ $t('Search') }}</span>
              </template>

              <template #prepend-inner>
                <VIcon
                  color="primary"
                  icon="mdi-magnify"
                />
              </template>
            </VTextField>
          </VCol>
          <VCol
            cols="12"
            lg="6"
            class="py-1"
          >
            <VRow>
              <VCol
                cols="12"
                lg="8"
                class="d-flex align-center"
              >
                <VRow>
                  <VCol cols="6 d-flex align-center">
                    <VBtn
                      color="orange"
                      prepend-icon="mdi-printer-outline"
                      style="width: 100%; height: 40px;"
                      @click="isDialogPrintBarcodeVisible = true"
                    >
                      <template #prepend>
                        <VIcon
                          size="30"
                          color="white"
                        />
                      </template>
                      <span
                        class="text-white"
                        style="font-size: 16px;"
                      >{{ $t('Print') }}</span>
                    </VBtn>
                  </VCol>
                  <VCol cols="6">
                    <VBtn
                      :to="{ name: 'configurationSetting-productInformation-product-addProduct-filterProductDetails' }"
                      color="green"
                      prepend-icon="ri-add-circle-fill"
                      style="width: 100%; height: 40px;"
                    >
                      <template #prepend>
                        <VIcon
                          size="30"
                          color="white"
                        />
                      </template>
                      <span
                        style="font-size: 16px;"
                        class="text-white"
                      >{{ $t('Create') }}</span>
                    </VBtn>
                  </VCol>
                </VRow>
              </VCol>
              <VCol
                cols="12"
                lg="4"
                class="d-flex align-center"
              >
                <VRow>
                  <VCol
                    cols="10"
                    lg="8"
                    class="d-flex align-center"
                  >
                    <!-- App View -->
                    <VBtn
                      density="compact"
                      color="red"
                      style="width: 100%; height: 40px;"
                      @click="clearFilter"
                    >
                      <span style="font-size: 16px;">{{ $t('Clear') }}</span>
                    </VBtn>
                  </VCol>
                  <VCol
                    cols="2"
                    lg="4"
                    class="d-flex align-center"
                  >
                    <!-- App View -->
                    <VBtn
                      size="50px"
                      color="red"
                      variant="text"
                      style="width: 100%; height: 100%; border-radius: 5px;"
                      @click="switchAppView"
                    >
                      <VIcon
                        size="50px"
                        :icon="iconViewApp"
                      />
                    </VBtn>
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </section>

  <!-- Dialog -->
  <section>
    <div>
      <VDialog
        v-model="isDialogPrintBarcodeVisible"
        max-width="450"
      >
        <!-- Dialog Content -->
        <VCard>
          <DialogCloseBtn
            variant="text"
            size="small"
            @click="isDialogPrintBarcodeVisible = false"
          />

          <VCardTitle><u>{{ $t('Print Product Barcode') }}</u></VCardTitle>

          <VCardText>
            <VRow>
              <!-- Number Print Barcode -->
              <VCol cols="12">
                <div class="mx-10 d-flex justify-start align-center">
                  <span>{{ $t('Number Of Prints(UoM) Barcode') }}:</span> 
                  <VTextField
                    v-model="numberPrintPOBarcode"
                    density="compact"
                    class="mx-3"
                    type="number"
                    style="max-inline-size: 5rem;"
                    :min="0"
                  />
                </div>
              </VCol>
              <!-- Checkbox -->
              <VCol
                cols="12"
                style=" margin-top: -1.5rem; margin-left: 3rem;"
              >
                <VCheckbox
                  v-model="checkboxBarcode"
                  class="mx-16"
                  :label="$t('Barcode')"
                />

                <VCheckbox
                  v-model="checkboxQRCode"
                  class="mx-16"
                  :label="$t('QR Code')"
                />
              </VCol>
            </VRow>
          </VCardText>

          <VCardActions>
            <VSpacer />
            <VBtn
              variant="flat"
              color="error"
              @click="isDialogPrintBarcodeVisible = false"
            >
              {{ $t('Close') }}
            </VBtn>
            <VBtn
              variant="flat"
              color="success"
              @click="onClickExportExcelList"
            >
              {{ $t('Print') }}
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
    </div>

    <!-- Dialog Delete -->
    <div>
      <VDialog
        v-model="isDialogDeleteVisible"
        persistent
        class="v-dialog-sm"
      >
        <!-- Dialog Content -->
        <VCard>
          <VCardTitle class="bg-error">
            <div class="d-flex justify-space-between align-center">
              {{ $t('Do you want to delete this product?') }}
              <IconBtn @click="isDialogDeleteVisible = false">
                <VIcon
                  size="45px"
                  color="white"
                  icon="ri-close-circle-fill"
                />
              </IconBtn>
            </div>
          </VCardTitle>
          

          <VCardText class="d-flex justify-center">
            <VAvatar
              size="150px"
              color="error"
            >
              <VIcon
                size="100px"
                icon="ri-delete-bin-6-fill"
              />
            </VAvatar>
          </VCardText>

          <VCardText class="d-flex justify-center">
            <VAlert
              :title="productNameDelete"
              type="error"
              closable
            />
          </VCardText>

          <VCardText class="d-flex justify-end flex-wrap gap-4">
            <VBtn
              color="error"
              @click="isDialogDeleteVisible = false"
            >
              {{ $t('Disagree') }}
            </VBtn>
            <VBtn
              color="success"
              @click="deleteProduct(productIdDelete)"
            >
              {{ $t('Agree') }}
            </VBtn>
          </VCardText>
        </VCard>
      </VDialog>
    </div>

    <!-- Dialog Alert -->
    <div>
      <VDialog
        v-model="isDialogDeleteAlertVisible"
        persistent
        class="v-dialog-sm"
      >
        <!-- Dialog Content -->
        <VCard>
          <VCardTitle class="bg-error">
            <div class="d-flex justify-space-between align-center">
              {{ $t('Delete Product Complete') }}
              <IconBtn @click="isDialogDeleteAlertVisible = false">
                <VIcon
                  size="45px"
                  color="white"
                  icon="ri-close-circle-fill"
                />
              </IconBtn>
            </div>
          </VCardTitle>
          

          <VCardText class="d-flex justify-center">
            <VAvatar
              size="150px"
              color="error"
            >
              <VIcon
                size="100px"
                icon="ri-delete-bin-4-fill"
              />
            </VAvatar>
          </VCardText>

          <VCardText class="d-flex justify-center">
            <VAlert
              title="Completed!"
              type="error"
              closable
            />
          </VCardText>
        </VCard>
      </VDialog>
    </div>
  </section>

  <!-- Filter navigation -->
  <section>
    <VNavigationDrawer
      v-model="drawer"
      temporary
      location="right"
      style="width: 350px;"
    >
      <div class="pa-6 d-flex align-center ">
        <VRow>
          <VCol cols="2">
            <IconBtn @click.stop="drawer = !drawer">
              <VIcon
                icon="mdi-close"
                size="20"
              />
            </IconBtn>
          </VCol>
          <VCol cols="10">
            <div>
              <div class="d-flex align-center justify-center">
                <h6 class="text-h4">
                  {{ $t('Filter') }}
                </h6>
              </div>
            </div>
          </VCol>
        </VRow>
      </div>


      <VDivider />

      <VList nav>
        <!-- Product Categories -->
        <VRow>
          <VCol
            cols="4"
            class="text-end d-flex align-center justify-end"
          >
            <span>{{ $t('Product Categories') }}:</span>
          </VCol>
          <VCol cols="8">
            <VTextField
              v-model="searchByCategoryName"
              title="Regular"
              :label="$t('Product Categories')"
            />
          </VCol>
        </VRow>
        <!-- Second Product Categories -->
        <VRow>
          <VCol
            cols="4"
            class="text-end d-flex align-center justify-end"
          >
            <span>{{ $t('Second Product Categories') }}:</span>
          </VCol>
          <VCol cols="8">
            <VTextField
              v-model="searchByTypeName"
              :label="$t('Second Product Categories')"
            />
          </VCol>
        </VRow>
        <!-- Sub Product Categories -->
        <VRow>
          <VCol
            cols="4"
            class="text-end d-flex align-center justify-end"
          >
            <span>{{ $t('Sub Product Categories') }}:</span>
          </VCol>
          <VCol cols="8">
            <VTextField
              v-model="searchBySubTypeName"
              :label=" $t('Sub Product Categories') "
            />
          </VCol>
        </VRow>
        <!-- Product Code -->
        <VRow>
          <VCol
            cols="4"
            class="text-end d-flex align-center justify-end"
          >
            <span>{{ $t('Product Code') }}:</span>
          </VCol>
          <VCol cols="8">
            <VTextField
              v-model="searchByProductCodeName"
              :label="$t('Product Code')"
            />
          </VCol>
        </VRow>
        <!-- Product Barcode -->
        <VRow>
          <VCol
            cols="4"
            class="d-flex align-center justify-end"
          >
            <span>{{ $t('Barcode') }}:</span>
          </VCol>
          <VCol cols="8">
            <VTextField
              v-model="searchByBarcodeName"
              :label="$t('Barcode')"
            />
          </VCol>
        </VRow>
        <!-- Product Name -->
        <VRow>
          <VCol
            cols="4"
            class="text-end d-flex align-center justify-end"
          >
            <span>{{ $t('Product Name') }}:</span>
          </VCol>
          <VCol cols="8">
            <VTextField
              v-model="searchByProductNameFilter"
              :label="$t('Product Name')"
            />
          </VCol>
        </VRow>
        <!-- Product Color -->
        <VRow>
          <VCol
            cols="4"
            class="text-end d-flex align-center justify-end"
          >
            <span>{{ $t('Color') }}:</span>
          </VCol>
          <VCol cols="8">
            <VTextField
              v-model="searchByColorName"
              :label="$t('Color')"
            />
          </VCol>
        </VRow>
        <!-- Product Size -->
        <VRow>
          <VCol
            cols="4"
            class="text-end d-flex align-center justify-end"
          >
            <span>{{ $t('Size') }}:</span>
          </VCol>
          <VCol cols="8">
            <VTextField
              v-model="searchBySizeName"
              :label="$t('Size')"
            />
          </VCol>
        </VRow>
        <!-- Product Unit -->
        <VRow>
          <VCol
            cols="4"
            class="text-end"
          >
            <span>{{ $t('Counting Unit') }}:</span>
          </VCol>
          <VCol cols="8">
            <VTextField
              v-model="searchByUnitName"
              :label="$t('Counting Unit')"
            />
          </VCol>
        </VRow>
        <!-- Btn Unit -->
        <VRow>
          <VCol
            class="d-flex justify-center"
            cols="12"
          >
            <VBtn
              class="mx-2"
              type="submit"
            >
              Filter
            </VBtn>
            <VBtn
              class="mx-2"
              color="error"
              variant="outlined"
              type="reset"
            >
              Reset
            </VBtn>
          </VCol>
        </VRow>
      </VList>
    </VNavigationDrawer>
    <VMain />
  </section>

  <!-- Dialog Image -->
  <section>
    <VDialog
      v-model="isDialogImageVisible"
      persistent
      class="v-dialog-sm"
      max-width="100%"
    >
      <VCard v-if="false">
        <VCardTitle>
          {{ (nameImage) }}
          <DialogCloseBtn
            variant="text"
            size="small"
            @click="isDialogImageVisible = false"
          />
        </VCardTitle>
        <Img
          style="width: 80%;"
          :src="urlImage"
        />
      </VCard>

      <VCard
        class=""
        max-width="500"
      >
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
          :src="urlImage"
          cover
        />
        <VCardActions
          class="bg-primary"
            
          style="width: 100%; padding: 0;"
        >
          <VBtn
            color="green-lighten-4"
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
            <VDivider />

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
                  </VCol>
                </VRow>
                <span style="font-size: large; font-weight: 900;">{{
                  $t("Details")
                }}:&nbsp;</span>&nbsp;{{ detailsProduct }}
              </div>
            </VCardText>
          </div>
        </VExpandTransition>
      </VCard>
    </VDialog>
  </section>

  <!-- ----------             Product  Easetrack                                  ------------------------------------ -->
  <section>
    <!-- Table -->
    <VCard
      v-if="!appView"
      class="mt-6"
    >
      <VDivider />

      <VTable class="text-no-wrap table-header-bg rounded-0">
        <!-- 👉 table head -->
        <thead>
          <tr>
            <th>
              <VCheckbox
                v-model="selectAll"
                @change="selectAllRows"
              />
            </th>
            <th
              scope="row"
              class="text-center"
            >
              {{ $t('No.') }}
            </th>
            <th
              scope="row"
              class="text-center"
            >
              {{ $t('Image') }}
            </th>
            <th
              scope="row"
              class="text-start"
            >
              {{ $t('Product Code') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
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
                            style="width: 100%;"
                            color="warning"
                            @click="searchByProductCodeName = ''"
                          >
                            {{ $t('Reset') }}
                          </VBtn>
                        </VCol>
                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            style="width: 100%;"
                            type="submit"
                            @click="menuProductCode = false"
                          >
                            Cancel
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
              class="text-center"
            >
              {{ $t('Barcode') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
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
                            class="mx-2"
                            color="warning"
                            style="width: 100%;"
                            @click="searchByBarcodeName = ''"
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
                            Cancel
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
              {{ $t('Product Name') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
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
                            
                            color="warning"
                            style="width: 100%;"
                            @click="searchByProductNameFilter = ''"
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
                            Cancel
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
              {{ $t('Product Categories') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
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
                            style="width: 100%;"
                            color="warning"
                            @click="searchByCategoryName = ''"
                          >
                            {{ $t('Reset') }}
                          </VBtn>
                        </VCol>
                        
                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            style="width: 100%;"
                            type="submit"
                            @click="menuCategory = false"
                          >
                            Cancel
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
              {{ $t('Secondary product categories') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
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
                            style="width: 100%;"
                            color="warning"
                            @click="searchByTypeName = ''"
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
                            Cancel
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
              {{ $t('Sub product categories') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
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
                            color="warning"
                            style="width: 100%;"
                            @click="searchBySubTypeName = ''"
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
                            Cancel
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
              {{ $t('Color') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
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
                            v-model="searchByColorName"
                            class="mt-4"
                            :label="$t('Color')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            style="width: 100%;"
                            color="warning"
                            @click="searchByColorName = ''"
                          >
                            {{ $t('Reset') }}
                          </VBtn>
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            style="width: 100%;"
                            type="submit"
                            @click="menuColor = false"
                          >
                            Cancel
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VListItem>
                  </VList>
                </VCard>
              </VMenu>
            </th>
            <th
              v-if="checkConfigUser(nameUser)"
              scope="row"
              class="text-end"
            >
              {{ $t('Size') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VMenu
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
                            v-model="searchBySizeName"
                            class="mt-4"
                            :label="$t('Size')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            color="warning"
                            style="width: 100%;"
                            @click="searchBySizeName = ''"
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
              class="text-start"
            >
              {{ $t('Counting Unit') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
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
                            color="warning"
                            style="width: 100%;"
                            @click="searchByUnitName = ''"
                          >
                            {{ $t('Reset') }}
                          </VBtn>
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
                            style="width: 100%;"
                            type="submit"
                            @click="menuUoM = false"
                          >
                            Cancel
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
              {{ $t('Last Update') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByLastupdate')"
              />
            </th>
            <th
              scope="row"
              class="text-center"
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
            <!-- 👉 Checkbox -->
            <td>
              <VCheckbox
                v-model="checkSelectItems"
                :value="product"
                hide-details
              />
            </td>
            
            <td class="text-center">
              {{ index+1 }}
            </td>

            <!-- 👉 Image -->
            <td
              class="text-center"
              style="position: relative;"
            >
              <VBtn
                v-if="false"
                width="70px"
                height="70px"
                variant="text"
                class="image-btn"
              >
                <VImg
                  v-if="product.image"
                  :width="70"
                  :height="70"
                  aspect-ratio="16/9"
                  cover
                  :src="product.image"
                  @click="showDialogImage(
                    product.image,
                    product.productId,
                    product.productName,
                    product.categoryName,
                    product.typeName,
                    product.subTypeName,
                    product.lastUpdate,
                  )"
                />
              </VBtn>

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
                        product.image,
                        product.productId,
                        product.productName,
                        product.categoryName,
                        product.typeName,
                        product.subTypeName,
                        product.lastUpdate,
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
            <td class="text-start">
              {{ product.productId }}
            </td>

            <!-- 👉 Barcode -->
            <td class="text-center px-2">
              <VueBarcode
                v-if="product.barcode"
                :options="{
                  width: '1%',
                  height: '30%',
                  fontSize: '16px',
                }"
                :value="product.barcode"
              />
            </td>

            <!-- 👉 Product Name -->
            <td class="text-start">
              {{ formattedProductName(product.productName) }}
            </td>

            <!-- 👉 Product categories -->
            <td class="text-start">
              {{ product.categoryName }}
            </td>

            <!-- 👉 Secondary product categories -->
            <td class="text-start">
              {{ product.typeName }}
            </td>

            <!-- 👉 Sub product categories -->
            <td class="text-start">
              {{ product.subTypeName }}
            </td>
        
            <!-- 👉 color -->
            <td class="text-start">
              {{ (product.color) }}
            </td>
            
            <!-- 👉 size -->
            <td class="text-end">
              {{ (product.size) }}
            </td>

            <!-- 👉 Counting unit -->
            <td
              class="text-start"
              style="width: 5rem;"
            >
              {{ product.unitName }}
            </td>

            <!-- 👉 Total quantity of products -->
            <td class="text-start">
              {{ formatDate(product.lastUpdate) }}
            </td>

            <!-- 👉 Actions -->
            <td
              style="width: 8rem;"
              class="text-center"
            >
              <IconBtn
                class="cursor-pointer"
                color="orange"
                variant="text" 
                :to="{ name: 'configurationSetting-productInformation-product-addProduct-editProductDetails',
                       query: { productId: product.productId }
                }"
              >
                <VIcon
                  color="orange"
                  icon="mdi-square-edit-outline"
                />
              </IconBtn>
          
              <IconBtn variant="text">
                <VIcon
                  v-model="checkSelectItems"
                  color="primary"
                  icon="mdi-printer-outline"
                  :value="product"
                  @click="printBarcode(product)"
                />
              </IconBtn>
              
              <VIcon
                color="red"
                icon="mdi-trash-can-outline"
                @click="deleteProductConfirm(product.productId, product.productName)"
              />
              <RouterLink
                v-if="false"
                :to="{ 
                  name: 'inventory-stockUpdateByProduct-view-id', 
                  params: { id: index }, 
                  query: { productId: product.productId ,UnitId: product.unitId,warehouseStock: searchByWareHouseId }, 
                }"
              >
                <VIcon
                  color="red"
                  icon="mdi-trash-can-outline"
                />
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

    <!-- Card -->
    <div v-if="appView">
      <div>
        <VRow>
          <VCol
            v-for="(product, index) in products"
            :key="index"
            cols="md-3"
          >
            <VCard
              class="mx-auto my-4"
              max-width="374"
            >
              <div>
                <VImg
                  cover
                  height="250"
                  :src="product.image"
                  class="d-flex justify-center pa-4"
                >
                  <VAvatar v-if="false">
                    <VIcon
                      icon="mdi-pencil"
                      class="heart-icon"
                    />
                  </VAvatar>
                  <VMenu
                    color="primary"
                    location="end"
                  >
                    <template #activator="{ props }">
                      <VBtn
                        icon="mdi-pencil"
                        v-bind="props"
                      />
                    </template>

                    <VList>
                      <VListItem
                        v-for="(item, i) in items"
                        :key="i"
                      >
                        <VListItemTitle
                          
                          class="cursor-pointer"
                          @click="MenuCardTableProduct(item.value, product.barcode, product.productId)"
                        >
                          <span ripple>
                            <VIcon :icon="item.icon" /> {{ item.title }}
                          </span>
                        </VListItemTitle>
                      </VListItem>
                    </VList>
                  </VMenu>
                </VImg>
              </div>
              

              <VCardItem>
                <VCardTitle>{{ product.productName }}</VCardTitle>

                <VCardSubtitle>
                  <span class="">Local Favorite</span>
                </VCardSubtitle>
              </VCardItem>

              <VCardText>
                <div>{{ $t('Product Code') }}: <span style="font-weight: 900;">{{ product.productId }}</span></div>
                <div>
                  <span v-if="product.color">{{ $t('Color') }}: <span style="font-weight: 900;">{{ product.color }}</span>&nbsp;&nbsp;</span>
                  <span v-if="product.size">{{ $t('Size') }}: <span style="font-weight: 900;">{{ product.size }}</span>&nbsp;&nbsp;</span>
                  <span v-if="product.unitName">{{ $t('Counting Unit') }}: <span style="font-weight: 900;">{{ product.unitName }}</span></span>
                </div>
              </VCardText>

              <VDivider class="" />
              <VCardText class="pa-0 d-flex justify-center">
                <VueBarcode
                  v-if="product.barcode"
                  :value="product.barcode"
                />
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </div>

      <VCard class="mt-6">
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
</style>

