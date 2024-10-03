<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { ref } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api'

const whereHouse = localStorage.getItem('whereHouseName')
const whereHouseSelectedItem = ref(whereHouse)
const products = ref([])

// Get access token from localStorage in another page
const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')

const perPage = ref(10)
const page = ref(0)
const totalCount = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)

//------------------- Model ID For search ------------------------------------
const searchData = ref(null)
const searchByProductCategoryCodeId = ref(null)
const searchByProductCategoryNameId = ref(null)
const searchByDateLastEdtId = ref(null)

//------------------------ Model Name for search ------------------------------
const searchByProductCategoryName = ref(null)

//----- Search Filter Icon Header Table[Product Category, Group, Sub Group, Barcode, Product Category Code, Product Name]
const menuCategoryName= ref( false)

//----------------------  SortBy Variable  -------------------------------------
const sortByCatId = ref('')
const sortByCategoryName = ref('')
const sortByLastUpdat = ref('')

//--------------------------- Model Check Box ---------------------------------
const requisition = ref([])
const receipt = ref([])
const salesInvoice = ref([])

const requisitionOther = ref([''])
const receiptOther = ref([''])
const salesInvoiceOther = ref([''])

//-----------------------------------------------------------------------------------------
const toggleSortType = sortBy => {
  try {
    const sortRefs = { sortByCatId, sortByCategoryName, sortByLastUpdat }

    for (const key in sortRefs) {
      if (sortRefs.hasOwnProperty(key)) {
        if (key === sortBy) {
          sortRefs[key].value = sortRefs[key].value === 'asc' ? 'desc' : 'asc'
        } else {
          sortRefs[key].value = ''
        }

        console.log("Sort type:", sortRefs[key], 'Key', key)
      }
    }
  } catch (error) {
    console.error('An error occurred in toggleSortType:', error)
  }
}

//------------------------- Main Function -----------------------------------------
const getProductCategory = () => {
  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.get(`${urlApi.value}/api/v1/Category?page=`+currentPage.value+`&perPage=`+rowPerPage.value, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
    params: {
      SearchData: searchData.value,
      sortByCatId: sortByCatId.value,
      sortByCategoryName: searchByProductCategoryName.value,
      sortByLastUpdat: sortByLastUpdat.value,
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

watch(getProductCategory)

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
const selectedRows = ref([])

//-------------------------------------  Formed Td ------------------------
const formattedProductName = productName => {
  if (productName !== undefined && productName !== null) {
    // console.log("productName: ",productName)
    
    return productName.replace(/((.{26})(\/|\s|$))/g, "$1\n")
  }
  
  return 'Non'
}

//------------------- Btn Add -------------------
const isDialogVisibleBtnAdd = ref(false)
const isDialogVisibleBtnAdded = ref(false)

//-------------- function Add Cat Add ^w^ ------------------
const postProductCategoryId = ref('')
const postProductCategoryName = ref('')

const postProductCategory = () => {

  const postCatData = {
    catId: postProductCategoryId.value,
    category: postProductCategoryName.value,
  }


  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.post(`${urlApi.value}/api/v1/Category/Add`, postCatData, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
      'Content-Type': `application/json`,
    },
  }, {})
    .then(response => {
      isDialogVisibleBtnAdd.value = false ; isDialogVisibleBtnAdded.value = true
      getProductCategory()
      console.log('response ', response)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

//------------------ Btn Edit -------------------
const isDialogVisibleBtnEdit = ref(false)
const isDialogVisibleBtnEdited = ref(false)

//-------------------- Function Add Cat Edit ^w^ ------------------
const editProductCategoryId = ref('')
const editProductCategoryName = ref('')

const startEdit = (id, name) => {
  isDialogVisibleBtnEdit.value = true
  editProductCategoryId.value = id
  editProductCategoryName.value = name
}

const editProductCategory = () => {

  const postCatData = {
    catId: editProductCategoryId.value,
    category: editProductCategoryName.value,
  }

  console.log('catId', postCatData.catId )


  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.post(`${urlApi.value}/api/v1/Category/Edit`, postCatData, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
      'Content-Type': `application/json`,
    },
  }, {})
    .then(response => {
      isDialogVisibleBtnEdit.value = false ; isDialogVisibleBtnEdited.value = true
      getProductCategory()
      console.log('response ', response)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

//------------------- Btn Delete -------------------
const isDialogVisibleBtnDelete = ref(false)
const isDialogVisibleBtnDeleted = ref(false)

//------------------------ Function Add Cat Delete ^w^ --------------
const deleteProductCategoryId = ref('')
const deleteProductCategoryName = ref('')

const startDelete = (id, name) => {
  isDialogVisibleBtnDelete.value = true
  deleteProductCategoryId.value = id
  deleteProductCategoryName.value = name
}

const deleteProductCategory = () => {
  const postCatData = ''


  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.post(`${urlApi.value}/api/v1/Category/Delete/${deleteProductCategoryId.value}`, postCatData, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {
      isDialogVisibleBtnDelete.value = false ; isDialogVisibleBtnDeleted.value = true
      getProductCategory()
      console.log('response ', response)
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })
}

//-------------------------------------- format date ---------------

const formatDate = date => {
  const dateObj = new Date(date)
  const formattedDate = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`
  const formattedTime = `${dateObj.getHours()}:${dateObj.getMinutes() < 10 ? '0' : ''}${dateObj.getMinutes()}`
  
  return `${formattedDate} ${formattedTime}`
}

//----------------------------- Mock Data --------------------------------
const mockData = []

const receiptIssueCatMock = ['FEX01', 'FEX02', 'FEX03', 'FEX04', 'FEX05']
const requisitionMock = [true, false, false, true, true]
const receiptMock = [false, false, true, true, false]
const salesInvoiceMock = [true, true, false, false, true]
const lastupdateMock = ['2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01']

// สร้างข้อมูลแบบสุ่ม
for (let i = 0; i < receiptIssueCatMock.length; i++) {
  const dataMock = {
    receiptIssueCatMock: receiptIssueCatMock[i % receiptIssueCatMock.length],
    requisitionMock: requisitionMock[i % requisitionMock.length],
    receiptMock: receiptMock[i % receiptMock.length],
    salesInvoiceMock: salesInvoiceMock[i % salesInvoiceMock.length], 
    LastUpDate: lastupdateMock[i % lastupdateMock.length],
  }

  mockData.push(dataMock)
}
</script>

<template>
  <!-- ----------------        Label Page | Back           ------------------------------------ -->
  <section>
    <!-- Tag page back -->
    <VRow>
      <VCol
        col="12"
        sm="4"
        md="4"
        lg="4"
      >
        <RouterLink :to="{ name: 'inventory-stockUpdate' }">
          <IconBtn>
            <VIcon
              icon="
                mdi-chevron-left"
            />
          </IconBtn>
        </RouterLink>
        {{ $t("Receipt/Issue Categories") }}
      </VCol>
      <VCol
        cols="6"
        sm="6"
        lg="4"
        class="d-flex justify-end justify-lg-end justify-sm-end"
      >
        <VTextField
          v-model="searchData"
          density="compact"
          style="width: 50%;"
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
        sm="2"
        md="6"
        lg="4"
        class="d-flex justify-end justify-lg-end justify-sm-end"
      >
        <VBtn
          class="red--text"
          color="orange"
          prepend-icon="mdi-plus"
          @click="isDialogVisibleBtnAdd = true"
        >
          <template #prepend>
            <VIcon color="white" />
          </template>
          <span class="text-white">{{ $t('Add') }}</span>
        </VBtn>
      </VCol>
    </VRow>
  </section>

  <!-- Dialog Zone -->
  <section>
    <!-- Dialog for Add -->
    <section>
      <!-- Dialog Content Confirming -->
      <div>
        <VDialog
          v-model="isDialogVisibleBtnAdd"
          max-width="600"
        >
          <!-- Dialog Content -->
          <VCard>
            <DialogCloseBtn
              variant="text"
              size="small"
              @click="isDialogVisibleBtnAdd = false"
            />

            <VCardTitle>
              <span style="text-decoration: underline;">{{ $t('Add Receipt/Issue Categories') }}</span>
            </VCardTitle>

            <VCardText class="pa-4">
              <VRow>
                <!-- Vendor Id -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-1">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="5"
                      sm="12"
                    >
                      {{ $t('Receipt/Issue Categories') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="7"
                      sm="12"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('Receipt/Issue Categories')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Vendor Id -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                  class="px-14"
                >
                  <VCard>
                    <VCardTitle><span style="text-decoration: underline;">{{ $t('Apply To Menu') }}</span></VCardTitle>
                    <div class="d-flex justify-center">
                      <VDivider
                        length="60%"
                        class="my-2"
                      />
                    </div>
                    <VRow class="px-8 py-2">
                      <VCol cols="12">
                        <VCheckbox
                          v-model="requisitionOther"
                          :label="$t('Requisition [Inter Warehouse, Delivery]')"
                        />
                      </VCol>
                      <VCol cols="12">
                        <VCheckbox
                          v-model="receiptOther"
                          :label="$t('Receipt[Inward, Purchase Receipt, Inter Warehouse]')"
                        />
                      </VCol>
                      <VCol cols="12">
                        <VCheckbox
                          v-model="salesInvoiceOther"
                          :label="$t('Sales Invoice')"
                        />
                      </VCol>
                    </VRow>
                  </VCard>
                </VCol>
              </VRow>
            </VCardText>
            <VCardActions>
              <VRow class="mx-4">
                <VCol
                  class="d-flex align-center justify-end justify-lg-end "
                  cols="6"
                  lg="6"
                  sm="6"
                >
                  <VBtn
                    color="error"
                    variant="flat"
                    class="px-6"
                    @click="isDialogVisibleBtnAdd = false"
                  >
                    {{ $t('Cancel') }}
                  </VBtn>
                </VCol>
                <VCol
                  cols="6"
                  lg="6"
                  sm="6"
                >
                  <VBtn
                    variant="flat"
                    color="success"
                    class="px-6"
                    @click="postProductCategory"
                  >
                    {{ $t('Save') }}
                  </VBtn>
                </VCol>
              </VRow>
            </VCardActions>
          </VCard>
        </VDialog>
      </div>
      <!-- Dialog Content Confirmed -->
      <div>
        <VDialog
          v-model="isDialogVisibleBtnAdded"
          max-width="600"
        >
          <!-- Dialog Content -->
          <VCard>
            <DialogCloseBtn
              variant="text"
              size="small"
              @click="isDialogVisibleBtnAdded = false"
            />

            <VCardText class="d-flex justify-center">
              <div class="v-timeline-avatar-wrapper rounded-circle">
                <VAvatar
                  size="160"
                  color="primary"
                  variant="tonal"
                >
                  <VIcon
                    icon="mdi-check-circle"
                    color="primary"
                    size="128"
                  />
                </VAvatar>
              </div>
            </VCardText>
            <VCardText class="d-flex justify-center">
              <span class="text-h5">{{ $t('Receipt/Issue Categories Has Been Added') }}</span>
            </VCardText>
          </VCard>
        </VDialog>
      </div>
    </section>

    <!-- Dialog for Edit -->
    <section>
      <!-- Dialog Edit Confirming -->
      <div>
        <VDialog
          v-model="isDialogVisibleBtnEdit"
          max-width="900"
        >
          <!-- Dialog Content -->
          <VCard>
            <DialogCloseBtn
              variant="text"
              size="small"
              @click="isDialogVisibleBtnEdit = false"
            />

            <VCardTitle>
              <span style="text-decoration: underline;">{{ $t('Edit Vendor Data') }}</span>
            </VCardTitle>

            <VCardText class="pa-4">
              <VRow>
                <!-- Vendor Id -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-1">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="2"
                      sm="12"
                    >
                      {{ $t('Vendor Code') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="8"
                      sm="12"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('Vendor Code')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Vendor Name -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="2"
                      sm="12"
                    >
                      {{ $t('Vendor Name') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="10"
                      sm="12"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('Vendor Name')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Address -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="2"
                      sm="12"
                    >
                      {{ $t('Address') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="8"
                      sm="12"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('Address')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- ----------- UnRegular 6 - 6 -----------------------  -->
                <!-- Road/Street -->
                <VCol
                  cols="12"
                  sm="12"
                  md="6"
                  lg="6"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="4"
                      sm="12"
                    >
                      {{ $t('Road/Street') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="8"
                      sm="12"
                    >
                      <VSelect
                        v-model="postProductCategoryId"
                        :label="$t('Road/Street')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Sub-district/ Sub-Area -->
                <VCol
                  cols="12"
                  sm="12"
                  md="6"
                  lg="6"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="4"
                      sm="12"
                    >
                      {{ $t('Sub-district') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="8"
                      sm="12"
                    >
                      <VSelect
                        v-model="postProductCategoryId"
                        :label="$t('Sub-district')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- District / Area -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                  lg="6"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="4"
                      sm="12"
                    >
                      {{ $t('District') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="8"
                      sm="12"
                    >
                      <VSelect
                        v-model="postProductCategoryId"
                        :label="$t('District')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Province -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                  lg="6"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="4"
                      sm="12"
                    >
                      {{ $t('Province') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="8"
                      sm="12"
                    >
                      <VSelect
                        v-model="postProductCategoryId"
                        :label="$t('Province')"
                        placeholder="00"
                        density="compact"
                        style="width: 100%;"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- ----------- UnRegular 6 - 6 -----------------------  -->
                <!-- Postal Code -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="2"
                      sm="12"
                    >
                      {{ $t('Postal Code') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                      sm="12"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('Postal Code')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Address -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="2"
                      sm="12"
                    >
                      {{ $t('Address') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                      sm="12"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('Address')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Address All -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="2"
                      sm="12"
                    >
                      {{ $t('Address All') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                      sm="12"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('Address All')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Phone Number -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="2"
                      sm="12"
                    >
                      {{ $t('Phone Number') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                      sm="12"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('Phone Number')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Fex -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="2"
                      sm="12"
                    >
                      {{ $t('Fex') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                      sm="12"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('Fex')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Tax ID Number -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="2"
                      sm="12"
                    >
                      {{ $t('Tax ID Number') }}:
                    </VCol>
                    <VCol
                      cols="12"
                      lg="9"
                      sm="12"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('Tax ID Number')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Email -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="2"
                      sm="12"
                    >
                      {{ $t('Email') }}
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                      sm="12"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('Email')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- ID Line -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                  lg="8"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="2"
                      sm="12"
                    >
                      {{ $t('ID Line') }}
                    </VCol>
                    <VCol
                      cols="12"
                      lg="10"
                      sm="12"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('ID Line')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Btn -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                  lg="4"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-end justify-lg-end "
                      cols="6"
                      lg="6"
                      sm="6"
                    >
                      <VBtn
                        color="error"
                        variant="flat"
                        class="px-6"
                        @click="isDialogVisibleBtnAdd = false"
                      >
                        {{ $t('Cancel') }}
                      </VBtn>
                    </VCol>
                    <VCol
                      cols="6"
                      lg="6"
                      sm="6"
                    >
                      <VBtn
                        variant="flat"
                        color="success"
                        class="px-6"
                        @click="postProductCategory"
                      >
                        {{ $t('Save') }}
                      </VBtn>
                    </VCol>
                  </VRow>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VDialog>
      </div>
      <!-- Dialog Edit Confirmed -->
      <div>
        <VDialog
          v-model="isDialogVisibleBtnEdited"
          max-width="600"
        >
          <!-- Dialog Content -->
          <VCard>
            <DialogCloseBtn
              variant="text"
              size="small"
              @click="isDialogVisibleBtnEdited = false"
            />

            <VCardText class="d-flex justify-center">
              <div class="v-timeline-avatar-wrapper rounded-circle">
                <VAvatar
                  size="160"
                  color="primary"
                  variant="tonal"
                >
                  <VIcon
                    icon="mdi-check-circle"
                    color="primary"
                    size="128"
                  />
                </VAvatar>
              </div>
            </VCardText>
            <VCardText class="d-flex justify-center">
              <span class="text-h5">{{ $t('Vendor Data Has Been Edited') }}</span>
            </VCardText>
          </VCard>
        </VDialog>
      </div>
    </section>

    <!-- Dialog for Delete -->
    <section>
      <!-- Dialog Delete Confirming -->
      <div>
        <VDialog
          v-model="isDialogVisibleBtnDelete"
          max-width="900"
        >
          <!-- Dialog Content -->
          <VCard>
            <DialogCloseBtn
              variant="text"
              size="small"
              @click="isDialogVisibleBtnDelete = false"
            />

            <VCardTitle>
              <span style="text-decoration: underline;">{{ $t('Remove Vendor Data') }}</span>
            </VCardTitle>

            <VCardText class="pa-4">
              <VRow>
                <!-- Vendor Id -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-1">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="2"
                      sm="12"
                    >
                      {{ $t('Vendor Code') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="8"
                      sm="12"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('Vendor Code')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Vendor Name -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="2"
                      sm="12"
                    >
                      {{ $t('Vendor Name') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="10"
                      sm="12"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('Vendor Name')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Address -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="2"
                      sm="12"
                    >
                      {{ $t('Address') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="8"
                      sm="12"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('Address')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- ----------- UnRegular 6 - 6 -----------------------  -->
                <!-- Road/Street -->
                <VCol
                  cols="12"
                  sm="12"
                  md="6"
                  lg="6"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="4"
                      sm="12"
                    >
                      {{ $t('Road/Street') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="8"
                      sm="12"
                    >
                      <VSelect
                        v-model="postProductCategoryId"
                        :label="$t('Road/Street')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Sub-district/ Sub-Area -->
                <VCol
                  cols="12"
                  sm="12"
                  md="6"
                  lg="6"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="4"
                      sm="12"
                    >
                      {{ $t('Sub-district') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="8"
                      sm="12"
                    >
                      <VSelect
                        v-model="postProductCategoryId"
                        :label="$t('Sub-district')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- District / Area -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                  lg="6"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="4"
                      sm="12"
                    >
                      {{ $t('District') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="8"
                      sm="12"
                    >
                      <VSelect
                        v-model="postProductCategoryId"
                        :label="$t('District')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Province -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                  lg="6"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="4"
                      sm="12"
                    >
                      {{ $t('Province') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="8"
                      sm="12"
                    >
                      <VSelect
                        v-model="postProductCategoryId"
                        :label="$t('Province')"
                        placeholder="00"
                        density="compact"
                        style="width: 100%;"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- ----------- UnRegular 6 - 6 -----------------------  -->
                <!-- Postal Code -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="2"
                      sm="12"
                    >
                      {{ $t('Postal Code') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                      sm="12"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('Postal Code')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Address -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="2"
                      sm="12"
                    >
                      {{ $t('Address') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                      sm="12"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('Address')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Address All -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="2"
                      sm="12"
                    >
                      {{ $t('Address All') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                      sm="12"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('Address All')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Phone Number -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="2"
                      sm="12"
                    >
                      {{ $t('Phone Number') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                      sm="12"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('Phone Number')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Fex -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="2"
                      sm="12"
                    >
                      {{ $t('Fex') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                      sm="12"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('Fex')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Tax ID Number -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="2"
                      sm="12"
                    >
                      {{ $t('Tax ID Number') }}:
                    </VCol>
                    <VCol
                      cols="12"
                      lg="9"
                      sm="12"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('Tax ID Number')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Email -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="2"
                      sm="12"
                    >
                      {{ $t('Email') }}
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                      sm="12"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('Email')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- ID Line -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                  lg="8"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end pa-0"
                      cols="12"
                      lg="2"
                      sm="12"
                    >
                      {{ $t('ID Line') }}
                    </VCol>
                    <VCol
                      cols="12"
                      lg="10"
                      sm="12"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('ID Line')"
                        placeholder="00"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Btn -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                  lg="4"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-end justify-lg-end "
                      cols="6"
                      lg="6"
                      sm="6"
                    >
                      <VBtn
                        color="error"
                        variant="flat"
                        class="px-6"
                        @click="isDialogVisibleBtnAdd = false"
                      >
                        {{ $t('Cancel') }}
                      </VBtn>
                    </VCol>
                    <VCol
                      cols="6"
                      lg="6"
                      sm="6"
                    >
                      <VBtn
                        variant="flat"
                        color="success"
                        class="px-6"
                        @click="postProductCategory"
                      >
                        {{ $t('Save') }}
                      </VBtn>
                    </VCol>
                  </VRow>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VDialog>
      </div>
      <!-- Dialog Deleted Confirmed -->
      <div>
        <VDialog
          v-model="isDialogVisibleBtnDeleted"
          max-width="600"
        >
          <!-- Dialog Content -->
          <VCard>
            <DialogCloseBtn
              variant="text"
              size="small"
              @click="isDialogVisibleBtnDeleted = false"
            />

            <VCardText class="d-flex justify-center">
              <div class="v-timeline-avatar-wrapper rounded-circle">
                <VAvatar
                  size="160"
                  color="primary"
                  variant="tonal"
                >
                  <VIcon
                    icon="mdi-check-circle"
                    color="primary"
                    size="128"
                  />
                </VAvatar>
              </div>
            </VCardText>
            <VCardText class="d-flex justify-center">
              <span class="text-h5">{{ $t('Vendor Data Has Been Deleted') }}</span>
            </VCardText>
          </VCard>
        </VDialog>
      </div>
    </section>
  </section>
  
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
              class="text-center"
            >
              {{ $t('No.') }}
            </th>
            <th
              scope="row"
              class="text-center"
            >
              {{ $t('Receipt/Issue Categories') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByCatId')"
              />
            </th>
            <th
              scope="row"
              class="text-center"
            >
              {{ $t('Requisition') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuCategoryName"
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
                            v-model="searchData"
                            class="mt-4"
                            :label="$t('Customer Name')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
                            @click="menuCategoryName = false"
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
              {{ $t('Receipt') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuCategoryName"
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
                            v-model="searchData"
                            class="mt-4"
                            :label="$t('Tax ID Number')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
                            @click="menuCategoryName = false"
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
              {{ $t('Sales Invoice') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuCategoryName"
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
                            v-model="searchData"
                            class="mt-4"
                            :label="$t('Address')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
                            @click="menuCategoryName = false"
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
              {{ $t('Last Date Edit') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByLastUpdat')"
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
            v-for="(product, index) in mockData"
            :key="index"
          >
            <!-- 👉 Ordinal Number -->
            <td class="text-center">
              {{ index+1 }}
            </td>

            <!-- 👉 Product categories -->
            <td class="text-center">
              {{ product.receiptIssueCatMock }}
            </td>

            <!-- 👉 Secondary product categories -->
            <td class="text-center">
              <VCheckbox
                v-model="requisition"
                :value="product.receiptMock"
              />
            </td>
            <!-- 👉 Secondary product categories -->
            <td class="text-center">
              <VCheckbox
                v-model="receipt"
                :value="product.requisitionMock"
              />
            </td>
            <td class="text-center">
              <VCheckbox
                v-model="salesInvoice"
                :value="product.salesInvoiceMock"
              />
            </td>

            <!-- 👉 Product code -->
            <td class="text-center">
              {{ formatDate(product.LastUpDate) }}
            </td>

            <!-- 👉 Actions -->
            <td
              style="width: 8rem;"
              class="text-center"
            >
              <VIcon
                color="warning"
                icon="mdi-square-edit-outline"
                @click="startEdit(product.catId,product.category1)"
              />
              <VIcon
                color="error"
                icon="mdi-trash-can-outline"
                @click="startDelete(product.catId,product.category1)"
              />
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

  <!-- Mock Data Label -->
  <section class="py-4">
    <VCard class="bg-red-lighten-5">
      <VCardText>
        <VIcon
          icon="mdi-file-table-box-multiple"
          class="custom-small-img"
        />
        <span>!Mock Data</span>
      </VCardText>
    </VCard>
  </section>
</template>

<style lang="scss">
@media screen and (min-width: 50px) and (max-width: 390px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    padding: 10px;
    font-size: 1rem;
    padding-inline: 10px;
  }

  .custom-small-btn-excel {
    padding: 2px;
    font-size: 1rem;
  }

  .custom-small-img {
    inline-size: 25px;
  }
}

@media screen and (min-width: 600px) and (max-width: 690px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    padding: 5px;
    font-size: 0;
  }

  .custom-small-btn-excel {
    font-size: 0;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

@media screen and (min-width: 400px) and (max-width: 430px) {
  .custom-small-btn-search {
    padding: 3px;
    font-size: 0.6rem;
  }

  .custom-small-btn-excel {
    padding: 3px;
    font-size: 0.6rem;
  }

  .custom-small-img {
    max-inline-size: 30px;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

@media screen and (min-width: 700px) and (max-width: 768px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    padding: 3px;
    font-size: 0.6rem;
  }

  .custom-small-btn-excel {
    padding: 3px;
    font-size: 0.6rem;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

@media screen and (min-width: 800px) and (max-width: 1200px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    padding: 3px;
    font-size: 0.6rem;
  }

  .custom-small-btn-excel {
    padding: 3px;
    font-size: 0.6rem;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

@media screen and (min-width: 1300px) and (max-width: 1500px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    padding: 3px;
    font-size: 0.6rem;
  }

  .custom-small-btn-excel {
    padding: 3px;
    font-size: 0.6rem;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>

