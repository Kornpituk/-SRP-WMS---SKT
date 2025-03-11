<script setup>
import dashboard from '@/navigation/vertical/dashboard'
import axiosIns from '@axios'

import { useRouter } from 'vue-router'

//// --------------------------------------------------------------------------------------
import { onMounted, ref, watchEffect } from 'vue'

// ----------------- Route --------------------------.
// import { useRoute } from 'vue-router'

const route = useRoute()

const productIdLocal = ref('')

watchEffect(() => {
  console.log('productIdForGenCode', localStorage.getItem('productIdForGenCode'))
  productIdLocal.value = localStorage.getItem('productIdForGenCode')
})

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

//-------------------------------------------------------------  Search Table Nomaly-------------------
// const urlApi = ref('https://webapi.easetrackwms.com')

import { urlApi } from '@/api'

const whereHouseSelectedItem = ref('')
const products = ref([])



// Get access token from localStorage in another page
const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')

const whereHouse = localStorage.getItem('whereHouseName')

//--------------------------- WareHouse Id For Search ---------------------------
const wareHouseId = ref(null)

const accessTokenTest = ('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoi4LiT4Lix4LiQ4Lie4LilIiwibmFtZWlkIjoiMDAwMDAxIiwibmJmIjoxNzAxMzEyMDY5LCJleHAiOjE3MDM0NzIwNjksImlhdCI6MTcwMTMxMjA2OSwiaXNzIjoiSXNzdWVyIiwiYXVkIjoiQXVkaWVuY2UifQ.CPMUUQDPkwS0qBiHUioxEdTW8f1TIZL3u--qENiH-UQ')

const url = ref(`${urlApi}/api/Auth/GetLocation/all`)

const perPage = ref(10)
const page = ref(0)
const totalCount = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)

//------------------- model main filter product details ---------------------------------------
const productCode = ref(productIdLocal.value)
const productName = ref(route.query.productName)

const categoriesItem = ref([])
const categoriesID = ref(route.query.categoriesID)
const categoriesName = ref('')

const secondCategoriesItem = ref([])
const secondCategoriesID = ref(route.query.secondCategoriesID)
const secondCategoriesName = ref('')

const subCategoriesItem = ref([])
const subCategoriesID = ref(route.query.subCategoriesID)
const subCategoriesName = ref('')

const colorItem = ref([])
const colorID = ref(route.query.colorID)
const colorName = ref(route.query.productName)

const sizeItem = ref([])
const sizeID = ref(route.query.sizeID)
const sizeName = ref(route.query.sizeName)

const styleItem = ref([])
const styleID = ref(route.query.styleID)
const styleName = ref('')

const versionName = ref('')
const serialNumberName = ref('')
const bandName = ref('')

const weight = ref('')
const unitWeightItem = ref([])
const unitWeight = ref('')

const wide = ref('')
const long = ref('')
const hight = ref('')
const unit = ref('')

const unitMaxNumber = ref('')
const unitMaxItems = ref([])
const unitMaxId = ref('')
const unitMaxName = ref('')
const defineMax = ref('')
const alertMax = ref(false)

const unitMinNumber = ref('')
const unitMinItems = ref([])
const unitMinId = ref('')
const unitMinName = ref('')
const defineMin = ref('')
const alertMin = ref(false)

const details = ref('')

//--------------------------------- import ------------------------------

//------------------------------------------ Import Purchase Order -----------------------------
const uploadSuccess = ref(false)
const importErrorMassage = ref('')
const refInputEl = ref()
const avatar = ref('')
const checkAvatarChange = ref('false')
const binaryFile = ref(null)

const accountData = {
  avatarImg: avatar,
  firstName: 'john',
  lastName: 'Doe',
  email: 'johnDoe@example.com',
  org: 'Pixinvent',
  phone: '+1 (917) 543-9876',
  address: '123 Main St, New York, NY 10001',
  state: 'New York',
  zip: '10001',
  country: 'USA',
  language: 'English',
  timezone: '(GMT-11:00) International Date Line West',
  currency: 'USD',
}

const accountDataLocal = ref(structuredClone(accountData))

//--------------- Get Product Unit ----------------------------------

const getPoUnit = () => {``
  axiosIns.get(`${urlApi.value}/api/v1/Unit/?page=1&perPage=900`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {

      // unitMaxItems.value = response.data

      // console.log('[getPoUnit]!!: ', response.data)
      const units = response.data.items.map(item => ({
        id: item.unitId,
        name: item.unitName,
      }))

      // กำหนดค่าของ unitMaxItems.value เท่ากับรายการหน่วยที่ได้จาก response
      unitMaxItems.value = units
      unitMinItems.value = units

      // ทดสอบการทำงานด้วยการแสดงค่า unitMaxItems.value ใน console
      // console.log('[unitMaxItems]:', unitMaxItems.value)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

watchEffect(getPoUnit)

//--------------- Get Product Second Category ----------------------------------
const unitTest = ref([])

const getPoCat = () => {``
  axiosIns.get(`${urlApi.value}/api/v1/Product/Categories/All`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {

      unitTest.value = response.data

      // console.log(typeof unitTest.value, '[categoriesItem]!!: ', unitTest.value)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

watchEffect(getPoCat)

//-------------------------- Save Product Radio --------------------------------
//------------------- ProductUnit ------------------------
const colorStatusAddRadio = ref('grey')
const variantBtnAddRadio = ref('flat')
const disabledBtnAddRadio = ref(true)

watch(() => {
  if (unitMaxId.value !== '' && unitMinId.value !== '' && unitMinNumber.value !== '') {
    colorStatusAddRadio.value = 'primary'
    variantBtnAddRadio.value = 'flat'
    disabledBtnAddRadio.value = false
  }
})

watchEffect(() => {
  console.log('unitMaxId$$', unitMaxId.value)
  if(unitMaxId.value !== ''){
    unitMaxNumber.value = 1
  } 
  if (unitMaxId.value === '' || unitMaxId.value === null){
    unitMaxNumber.value = ''
  }
})

const genProductBarCode = async () => {
  try {
    const response = await axiosIns.get(`${urlApi.value}/api/v001/Product/ProductUnit/GenBarcode?`, {
      headers: {
        'accept': '*/*',
        'x-location': `${whereHouse}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
      params: {
        catId: categoriesID.value,
        typeId: secondCategoriesID.value,
        subTypeId: subCategoriesID.value,
        unitId: unitID.value,
      },
    }, {})

    barcode.value = response.data
    console.log('result.value: ', response.data)
  } catch (error) {
    // Handle errors
    console.error('Error:', error)
  }
}

//-------------------------- gen barcode save ---------------------
const colorStatusSaveRadio = ref('green')
const variantBtnSaveRadio = ref('flat')
const disabledBtnSaveRadio = ref(false)
const barcode = ref('')

const isDialogSaveAllVisible = ref(false)
const checkSaveAll = ref(false)

const btnNextAllColor = ref('grey')
const btnNextAllVariant = ref('flat')
const btnNextAllDisabled = ref(true)

const saveUnitRadio = () => {
  console.log('resetDefineUnitBacode Start!')
  isDialogSaveAllVisible.value = ref(true)
}

const checkAllSaveUnitRadio = () => {
  isDialogSaveAllVisible.value = false
  
  colorStatusSaveRadio.value = 'grey'
  variantBtnSaveRadio.value = 'flat'
  disabledBtnSaveRadio.value = true

  btnNextAllColor.value = 'orange'
  btnNextAllVariant.value = 'flat'
  btnNextAllDisabled.value = false
}

const resetDefineUnitBacode = () => {
  console.log('resetDefineUnitBacode Start!')
}

watch(() => {
  if (barcode.value !== '') {
    colorStatusSaveRadio.value = 'primary'
    variantBtnSaveRadio.value = 'flat'
    disabledBtnSaveRadio.value = false
  }
})

const resetAddBarcode = () =>{
  colorStatusSaveRadio.value = 'grey'
  variantBtnSaveRadio.value = 'tonal'
  disabledBtnSaveRadio.value = true

  unitMaxNumber.value = ''
  unitMaxId.value = ''
  unitMaxName.value = ''
  defineMax.value = ''
  alertMax.value = false

  unitMinNumber.value = ''
  unitMinId.value = ''
  unitMinName.value = ''
  defineMin.value = ''
  alertMin.value = false


  barcode.value = ''
}

const genProductUnitRatio = async () => {
  const data = ({
    unitId_B: unitMaxId.value,
    qty_B: unitMaxNumber.value,
    unitId_S: unitMinId.value,
    qty_S: unitMinNumber.value,
    qty_Max: parseFloat(defineMax.value),
    qty_Min: parseFloat(defineMin.value),
    alert: alertMax.value,
  })

  try {
    const response = await axiosIns.post(`${urlApi.value}/api/v1/Product/ProductUnitRetio/${productCode.value}/Save?`, data, {
      headers: {
        'accept': '*/*',
        'x-location': `${whereHouse}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
    }, {})

    resetAddBarcode()
    genProductUnitRadio()
    console.log('result.value: ', response.data)
  } catch (error) {
    // Handle errors
    console.error('Error:', error)
  }
}

const productUnitRadio = ref([])

const genProductUnitRadio = async () => {
  try {
    const response = await axiosIns.get(`${urlApi.value}/api/v001/Product/ProductUnitRetio/${productCode.value}`, {
      headers: {
        'accept': '*/*',
        'x-location': `${whereHouse}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
    }, {})

    productUnitRadio.value = response.data
    console.log('productUnitRadio.value: ', productUnitRadio.value)
  } catch (error) {
    // Handle errors
    console.error('Error:', error)
  }
}

watchEffect(genProductUnitRadio)


//------------------------- Check Request -------------------------------

//------------------- Status Create Product Code-------------------------
const colorStatusCreate = ref('grey')

//------------------------------- Add / Edit / Delete -------------------------------
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
const qtyBDelete = ref('')
const unitIdBDelete = ref('')
const unitNameBDelete = ref('')
const qtySDelete = ref('')
const unitIdSDelete = ref('')
const unitNameSDelete = ref('')
const qtyMax = ref('')
const qtyMin = ref('')

const startDelete = (qtyBDeleteIn, unitNameBDeleteIn, unitIdBDeleteIn, qtySDeleteIn, unitNameSDeleteIn, unitIdSDeleteIn, qtyMaxIn, qtyMinIn ) => {
  qtyBDelete.value = qtyBDeleteIn
  unitIdBDelete.value = unitIdBDeleteIn
  unitNameBDelete.value = unitNameBDeleteIn
  qtySDelete.value = qtySDeleteIn
  unitIdSDelete.value = unitIdSDeleteIn
  unitNameSDelete.value = unitNameSDeleteIn
  qtyMax.value = qtyMaxIn
  qtyMin.value = qtyMinIn
  isDialogVisibleBtnDelete.value = true
}

const deleteProductUnitRadio = () => {

  const postData = {
    
  }

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.post(`${urlApi.value}/api/v1/Product/ProductUnitRetio/${productCode.value}/Delete`, postData, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
    params: {
      unitIdB: unitIdBDelete.value,
      unitIdS: unitIdSDelete.value,
    },
  }, {})
    .then(response => {
      isDialogVisibleBtnDelete.value = false ; isDialogVisibleBtnDeleted.value = true
      console.log('response ', response)
      genProductUnitRadio()
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })
}

//------------------------- define Max/Min Alert--------------------
//-------------- define Max ----------------------------------------
const insetSwitchDefineMax = ref(false)

//-------------- define Max ----------------------------------------
const insetSwitchDefineMin = ref(false)

//---------------------------- format date --------------------
const formatDateTime = dateTimeStr => {
  const dateTime = new Date(dateTimeStr)

  const formattedDate = `${dateTime.getDate().toString().padStart(2, "0")}/${(
    dateTime.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${dateTime.getFullYear()}`

  const formattedTime = `${dateTime
    .getHours()
    .toString()
    .padStart(2, "0")}:${dateTime.getMinutes().toString().padStart(2, "0")}`

  return `${formattedDate}`
}
</script>

<template>
  <!-- ----------------        Label Page | Back           ------------------------------------ -->
  <section v-if="false">
    <!-- Label Count/Adjust && Timeline -->
    <VRow>
      <!-- Tag page back -->
      <VCol
        cols="12"
        sm="12"
        lg="2"
        style="padding: 0;"
      >
        <RouterLink :to="{ name: 'configurationSetting-productInformation-product-list' }">
          <IconBtn>
            <VIcon
              icon="
                mdi-chevron-left"
            />
          </IconBtn>
        </RouterLink>
        <span class="text-h7">{{ $t('Product Data / Add Product') }}</span>
      </VCol>
      <!-- Time Line -->
      <VCol
        cols="12"
        sm="12"
        lg="8"
        style="padding: 0; margin-top: -30px; margin-bottom: 20px;"
      >
        <!-- -   Time Line Page   - -->
        <VTimeline
          truncate-line="both"
          direction="horizontal"
          line-inset="15"
          class="custom-avatar-size"
        >
          <!-- -   Filter Product Details   - -->
          <VTimelineItem 
            dot-color="green"
            size="small"
            class="text-center"
          >
            <template #opposite>
              <RouterLink
                :to="{ 
                  name: 'configurationSetting-productInformation-product-addProduct-filterProductDetails', 
                  query: $route.query,
                }"
              >
                {{ $t('Filter Product Details') }}
              </RouterLink>
            </template>
            <template #icon>
              <RouterLink
                :to="{ 
                  name: 'configurationSetting-productInformation-product-addProduct-filterProductDetails', 
                  query: $route.query,
                }"
              >
                <div class="v-timeline-avatar-wrapper rounded-circle ">
                  <VAvatar
                    size="40"
                    color="green"
                    variant="outlined"
                  >
                    <VIcon
                      icon="mdi-check"
                      color="white"
                      size="20"
                    />
                  </VAvatar>
                </div>
              </RouterLink>
            </template>
          </VTimelineItem>

          <!-- -   Define Unit Of Count   - -->
          <VTimelineItem
            size="small"
            dot-color="green"
            class="text-center"
          >
            <template #default>
              <RouterLink
                :to="{ 
                  name: 'configurationSetting-productInformation-product-addProduct-defineUnitOfCount', 
                  query: $route.query, 
                }"
              >
                {{ $t('Define Unit Of Count') }}
              </RouterLink>
            </template>
            <template #icon>
              <RouterLink
                :to="{ 
                  name: 'configurationSetting-productInformation-product-addProduct-defineUnitOfCount', 
                  query: $route.query, 
                }"
              >
                <div class="v-timeline-avatar-wrapper rounded-circle">
                  <VAvatar
                    size="40"
                    color="green"
                    variant="outlined"
                  >
                    <VIcon
                      icon="mdi-check"
                      color="white"
                      size="20"
                    />
                  </VAvatar>
                </div>
              </RouterLink>
            </template>
          </VTimelineItem>

          <!-- -   Define Counting Radio   - -->
          <VTimelineItem
            size="small"
            dot-color="warning"
            class="text-center"
          >
            <template #opposite>
              <RouterLink 
                :to="{ 
                  name: 'configurationSetting-productInformation-product-addProduct-defineCountingRadio', 
                  query: $route.query, 
                }"
              >
                {{ $t('Define Counting Ratio') }}
              </RouterLink>
            </template>
            <template #icon>
              <RouterLink
                :to="{ 
                  name: 'configurationSetting-productInformation-product-addProduct-defineCountingRadio', 
                  query: $route.query, 
                }"
              >
                <div class="v-timeline-avatar-wrapper rounded-circle">
                  <VAvatar
                    size="40"
                    color="warning"
                    variant="outlined"
                  >
                    <VIcon
                      icon="mdi-circle-small"
                      color="white"
                      size="50"
                    />
                  </VAvatar>
                </div>
              </RouterLink>
            </template>
          </VTimelineItem>

          <!-- -   Add Product Successful   - -->
          <VTimelineItem
            class="text-center"
            size="small"
            dot-color="gray"
          >
            <template #default>
              <RouterLink
                :to="{ 
                  name: 'configurationSetting-productInformation-product-addProduct-addProductSuccessful', 
                  query: $route.query, 
                }"
              >
                {{ $t('Add Product Successful') }}
              </RouterLink>
            </template>
            <template #icon>
              <RouterLink
                :to="{ 
                  name: 'configurationSetting-productInformation-product-addProduct-addProductSuccessful', 
                  query: $route.query, 
                }"
              >
                <div class="v-timeline-avatar-wrapper rounded-circle">
                  <VAvatar
                    size="40"
                    color="secondary"
                    variant="outlined"
                  >
                    <VIcon
                      icon="mdi-circle-small"
                      size="50"
                    />
                  </VAvatar>
                </div>
              </RouterLink>
            </template>
          </VTimelineItem>
        </VTimeline>
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
          max-width="500"
        >
          <!-- Dialog Content -->
          <VCard>
            <DialogCloseBtn
              variant="text"
              size="small"
              @click="isDialogVisibleBtnAdd = false"
            />

            <VCardTitle style="text-decoration: underline;">
              {{ $t('Print Product Barcode') }}
            </VCardTitle>

            <VCardText>
              <VRow>
                <!-- Print Barcode -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-1">
                    <VCol
                      class="d-flex align-center justify-end "
                      cols="6"
                    >
                      <span>{{ $t('Print Product Barcode') }}</span>
                    </VCol>
                    <VCol cols="3">
                      <VTextField
                        v-model="postProductCategoryName"
                        type="number"
                        density="compact"
                        :min="0"
                        placeholder="001"
                      />
                    </VCol>
                    <VCol cols="3">
                      <VBtn variant="flat">
                        Print
                      </VBtn>
                    </VCol>
                  </VRow>
                </VCol>
              </VRow>
            </VCardText>
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
              <span class="text-h5">{{ $t('The Product Categories Has Been Added') }}</span>
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
          max-width="500"
        >
          <!-- Dialog Content -->
          <VCard>
            <DialogCloseBtn
              variant="text"
              size="small"
              @click="isDialogVisibleBtnEdit = false"
            />

            <VCardTitle style="text-decoration: underline;">
              {{ $t('Edit Unit Counting Barcode') }}
            </VCardTitle>

            <VCardText>
              <VRow>
                <!-- Unit Counting Edit -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-end "
                      cols="4"
                    >
                      {{ $t('Unit Counting') }}
                    </VCol>
                    <VCol cols="8">
                      <VTextField
                        v-model="editProductCategoryId"
                        readonly
                        :label="$t('Unit Counting')"
                        placeholder="ลัง"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Barcode Edit -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-end "
                      cols="4"
                    >
                      {{ $t('Barcode') }}
                    </VCol>
                    <VCol cols="8">
                      <VTextField
                        v-model="editProductCategoryName"
                        :label="$t('Barcode')"
                        placeholder="0000000000"
                      />
                    </VCol>
                  </VRow>
                </VCol>
              </VRow>
            </VCardText>

            <VCardActions class="mx-2">
              <VSpacer />
              <VBtn
                color="error"
                variant="flat"
                class="px-6"
                @click="isDialogVisibleBtnEdit = false"
              >
                {{ $t('Cancel') }}
              </VBtn>
              <VBtn
                variant="flat"
                color="success"
                class="px-6"
                @click="editProductCategory"
              >
                {{ $t('Edit') }}
              </VBtn>
            </VCardActions>
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
              <span class="text-h5">{{ $t('Edit Unit Counting Barcode Complete.') }}</span>
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
          max-width="550"
        >
          <!-- Dialog Content -->
          <VCard>
            <DialogCloseBtn
              variant="text"
              size="small"
              @click="isDialogVisibleBtnDelete = false"
            />

            <VCardTitle style="text-decoration: underline;">
              {{ $t('Delete unit ratio') }}
            </VCardTitle>

            <VCardText>
              <VTable>
                <thead>
                  <tr>
                    <th class="text-left">
                      Number
                    </th>
                    <th class="text-left">
                      Unit
                    </th>
                    <th class="text-left">
                      Number
                    </th>
                    <th class="text-left">
                      Sub Unit
                    </th>
                    <th class="text-left">
                      Max
                    </th>
                    <th class="text-left">
                      Min
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ qtyBDelete }}</td>
                    <td>{{ unitNameBDelete }}</td>
                    <td>{{ qtySDelete }}</td>
                    <td>{{ unitNameSDelete }}</td>
                    <td>{{ qtyMax }}</td>
                    <td>{{ qtyMin }}</td>
                  </tr>
                </tbody>
              </VTable>
            </VCardText>

            <VCardActions class="mx-2">
              <VSpacer />
              <VBtn
                color="error"
                variant="flat"
                class="px-6"
                @click="isDialogVisibleBtnDelete = false"
              >
                {{ $t('Cancel') }}
              </VBtn>
              <VBtn
                variant="flat"
                color="warning"
                class="px-6"
                @click="deleteProductUnitRadio"
              >
                {{ $t('Delete') }}
              </VBtn>
            </VCardActions>
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
              <span class="text-h5">{{ $t('Delete Unit Counting Radio Complete.') }}</span>
            </VCardText>
          </VCard>
        </VDialog>
      </div>
    </section>

    <!-- Dialog Save All Confirmed -->
    <section>
      <!-- Dialog Save All Confirmed -->
      <div>
        <VDialog
          v-model="isDialogSaveAllVisible"
          max-width="600"
        >
          <!-- Dialog Content -->
          <VCard>
            <DialogCloseBtn
              variant="text"
              size="small"
              @click="checkAllSaveUnitRadio"
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
              <span class="text-h5">{{ $t('Save Unit Counting Barcode Complete.') }}</span>
            </VCardText>
          </VCard>
        </VDialog>
      </div>
    </section>
  </section>

  <section v-if="false">
    <VCard class="pa-8">
      <VCardTitle>
        <u>{{ $t('Define Unit Of Count') }}</u>
      </VCardTitle>
      <!-- Text Input -->
      <section>
        <VCard class="pa-6">
          <!-- Product Code / Product Name / Image -->
          <section>
            <VRow>
              <!-- Product Code / Product Name -->
              <VCol cols="12">
                <VRow>
                  <!-- Product Code -->
                  <VCol
                    cols="12"
                    lg="6"
                  >
                    <VRow>
                      <VCol
                        cols="4"
                        lg="2"
                        class="d-flex align-center"
                      >
                        <span>{{ $t('Product Code') }}: </span>
                      </VCol>
                      <VCol
                        cols="8"
                        lg="10"
                      >
                        <VTextField
                          v-model="productCode"
                          variant="solo-filled"
                          density="compact"
                          :label="$t('Product Code')"
                        />
                      </VCol>
                    </VRow>
                  </VCol>
                  <!-- Product Name -->
                  <VCol
                    cols="12"
                    lg="6"
                  >
                    <VRow>
                      <VCol
                        cols="4"
                        lg="2"
                        class="d-flex align-center"
                      >
                        <span>{{ $t('Product Name') }}: </span>
                      </VCol>
                      <VCol
                        cols="8"
                        lg="10"
                      >
                        <VTextField
                          v-model="productName"
                          variant="solo-filled"
                          density="compact"
                          :label="$t('Product Name')"
                        />
                      </VCol>
                    </VRow>
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          </section>

          <!-- Color / Size / Style -->
          <section>
            <VRow>
              <!-- Color -->
              <VCol
                cols="12"
                lg="4"
              >
                <VRow>
                  <VCol
                    cols="4"
                    lg="3"
                    class="d-flex align-center justify-start"
                  >
                    {{ $t('Color') }}:
                  </VCol>
                  <VCol
                    cols="8"
                    lg="3"
                  >
                    <VTextField
                      v-model="colorID"
                      variant="solo-filled"
                      readonly
                      density="compact"
                      type="number"
                      :max="255"
                      :min="0"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    lg="6"
                  >
                    <VTextField
                      v-model="colorName"
                      variant="solo-filled"
                      readonly
                      density="compact"
                      :label="$t('Color')"
                      placeholder="Color"
                    />
                  </VCol>
                </VRow>
              </VCol>
              <!-- Size -->
              <VCol
                cols="12"
                lg="4"
              >
                <VRow>
                  <VCol
                    cols="4"
                    lg="3"
                    class="d-flex align-center justify-start"
                  >
                    {{ $t('Size') }}:
                  </VCol>
                  <VCol
                    cols="8"
                    lg="3"
                  >
                    <VTextField
                      v-model="sizeID"
                      variant="solo-filled"
                      readonly
                      density="compact"
                      type="number"
                      :max="255"
                      :min="0"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    lg="6"
                  >
                    <VSelect
                      v-model="sizeName"
                      variant="solo-filled"
                      readonly
                      :items="items"
                      density="compact"
                      :label="$t('Size')"
                      placeholder="Size"
                    />
                  </VCol>
                </VRow>
              </VCol>
              <!-- Style -->
              <VCol
                cols="12"
                lg="4"
              >
                <VRow>
                  <VCol
                    cols="3"
                    class="d-flex align-start justify-start"
                  >
                    {{ $t('Style') }}:
                  </VCol>
                  <VCol cols="9">
                    <VTextField
                      v-model="styleID"
                      variant="solo-filled"
                      readonly
                      density="compact"
                    />
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          </section>

          <!-- Number Unit Counting / Number Sub Unit Counting -->
          <section class="px-0">
            <VRow>
              <!-- Number Unit Counting -->
              <VCol
                cols="12"
                lg="5"
              >
                <VRow>
                  <!-- Number Unit Counting  -->
                  <VCol
                    cols="12"
                    lg="6"
                  >
                    <VRow>
                      <VCol
                        cols="5"
                        lg="4"
                        class="d-flex align-center justify-start"
                      >
                        {{ $t('Number') }}:
                      </VCol>
                      <VCol
                        cols="7"
                        lg="8"
                      >
                        <VTextField
                          v-model="unitMaxNumber"
                          readonly
                          variant="solo-filled"
                          density="compact"
                          type="number"
                          :min="0"
                        />
                      </VCol>
                    </VRow>
                  </VCol>
                  <!-- Number Sub Unit Counting -->
                  <VCol
                    cols="12"
                    lg="6"
                  >
                    <VRow>
                      <VCol
                        cols="4"
                        lg="4"
                        class="d-flex align-center justify-start"
                      >
                        {{ $t('Unit') }}:
                      </VCol>
                      <VCol
                        cols="8"
                        lg="8"
                      >
                        <VAutocomplete
                          v-model="unitMaxId"
                          class="mb-4"
                          :label="$t('Unit')"
                          :items="unitMaxItems"
                          :custom-filter="customFilter"
                          item-title="name"
                          item-value="id"
                          density="compact"
                          clearable
                          clear-icon="mdi-close"
                          base-color="primary"
                        />
                      </VCol>
                    </VRow>
                  </VCol>
                </VRow>
              </VCol>
              <VCol
                cols="12"
                lg="2"
                class="d-flex align-center justify-center"
              >
                <VAvatar>
                  <VIcon
                    size="50"
                    icon="mdi-arrow-right"
                  />
                </VAvatar>
              </VCol>
              <!-- Number Sub Unit Counting -->
              <VCol
                cols="12"
                lg="5"
              >
                <VRow>
                  <!-- Number Unit Counting  -->
                  <VCol
                    cols="12"
                    lg="6"
                  >
                    <VRow>
                      <VCol
                        cols="5"
                        lg="4"
                        class="d-flex align-center justify-start"
                      >
                        {{ $t('Number') }}:
                      </VCol>
                      <VCol
                        cols="7"
                        lg="8"
                      >
                        <VTextField
                          v-model="unitMinNumber"
                          density="compact"
                          type="number"
                          :min="0"
                        />
                      </VCol>
                    </VRow>
                  </VCol>
                  <!-- Number Sub Unit Counting -->
                  <VCol
                    cols="12"
                    lg="6"
                  >
                    <VRow>
                      <VCol
                        cols="5"
                        lg="4"
                        class="d-flex align-center justify-start"
                      >
                        {{ $t('Sub Unit') }}:
                      </VCol>
                      <VCol
                        cols="7"
                        lg="8"
                      >
                        <VAutocomplete
                          v-model="unitMinId"
                          class="mb-4"
                          :label="$t('Sub Unit')"
                          :items="unitMinItems"
                          :custom-filter="customFilter"
                          item-title="name"
                          item-value="id"
                          density="compact"
                          clearable
                          clear-icon="mdi-close"
                          base-color="primary"
                        />
                      </VCol>
                    </VRow>
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          </section>

          <!-- define Max / Alert / define Min / Alert / Btn -->
          <section>
            <VRow class="d-flex justify-center">
              <!-- define Max  -->
              <VCol
                cols="12"
                lg="4"
              >
                <VRow class="d-flex align-center">
                  <VCol
                    cols="6"
                    lg="3"
                  >
                    {{ $t('Define Max') }}:
                  </VCol>
                  <VCol
                    cols="6"
                    lg="3"
                  >
                    <VTextField
                      v-model="defineMax"
                      density="compact"
                      type="number"
                      step="0.01"
                      :min="0.00"
                    />
                  </VCol>
                  <VCol
                    cols="6"
                    lg="3"
                  >
                    {{ $t('Alert') }}:
                  </VCol>
                  <VCol
                    cols="6"
                    lg="3"
                  >
                    <VSwitch
                      v-model="alertMax"
                      inset
                      label="alertMax"
                    />
                  </VCol>
                </VRow>
              </VCol>
              <!-- define Min  -->
              <VCol
                cols="12"
                lg="4"
              >
                <VRow class="d-flex align-center">
                  <VCol
                    cols="6"
                    lg="3"
                  >
                    {{ $t('Define Min') }}:
                  </VCol>
                  <VCol
                    cols="6"
                    lg="3"
                  >
                    <VTextField
                      v-model="defineMin"
                      density="compact"
                      type="number"
                      step="0.01"
                      :min="0.00"
                    />
                  </VCol>
                  <VCol
                    cols="6"
                    lg="3"
                  >
                    {{ $t('Alert') }}:
                  </VCol>
                  <VCol
                    cols="6"
                    lg="3"
                  >
                    <VSwitch
                      v-model="alertMin"
                      inset
                    />
                  </VCol>
                </VRow>
              </VCol>
              <!-- Btn  -->
              <VCol
                cols="12"
                lg="3"
                class="d-flex justify-end"
              >
                <VRow>
                  <VCol
                    class="d-flex justify-center"
                    col="6"
                    lg="4"
                  >
                    <VBtn
                      :variant="variantBtnAddRadio"
                      :color="colorStatusAddRadio"
                      :disabled="disabledBtnAddRadio"
                      style="width: 100%;"
                      @click="genProductUnitRatio"
                    >
                      {{ $t('Add') }}
                    </VBtn>
                  </VCol>
                  <VCol
                    class="d-flex justify-center"
                    col="6"
                    lg="4"
                  >
                    <VBtn
                      color="grey"
                      disabled
                      style="width: 100%;"
                    >
                      {{ $t('Edit') }}
                    </VBtn>
                  </VCol>
                  <VCol
                    class="d-flex justify-center"
                    col="12"
                    lg="4"
                  >
                    <VBtn
                      color="grey"
                      variant="outlined"
                      disabled
                      style="width: 100%;"
                    >
                      {{ $t('Clear') }}
                    </VBtn>
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          </section>
        </VCard>
      </section>

      <!-- 👉 Table   -->
      <section
        v-if="!checkData"
        class="mt-4 pa-4"
      >
        <VTable density="compact">
          <thead>
            <tr>
              <th class="text-center">
                {{ $t('No.') }}
              </th>
              <th class="text-end">
                {{ $t('Number') }}
              </th>
              <th class="text-start">
                {{ $t('Unit') }}
              </th>
              <th class="text-end">
                {{ $t('Number') }}
              </th>
              <th class="text-start">
                {{ $t('Unit') }}
              </th>
              <th class="text-end">
                {{ $t('Max') }}
              </th>
              <th class="text-end">
                {{ $t('Min') }}
              </th>
              <th class="text-start">
                {{ $t('Save') }}
              </th>
            </tr>
          </thead>
          <!-- 👉 table body -->
          <tbody v-if="productUnitRadio">
            <tr
              v-for="(product, index) in productUnitRadio"
              :key="index"
            >
              <!-- 👉 Ordinal Number -->
              <td class="text-center">
                {{ index+1 }}
              </td>

              <!-- 👉 Product categories -->
              <td class="text-end">
                {{ product.qty_B }}
              </td>

              <!-- 👉 Secondary product categories -->
              <td class="text-start">
                {{ product.unitName_B }}
              </td>

              <!-- 👉 Product code -->
              <td class="text-end">
                {{ product.qty_S }}
              </td>

              <!-- 👉 Product code -->
              <td class="text-start">
                {{ product.unitName_S }}
              </td>

              <!-- 👉 Product code -->
              <td class="text-end">
                {{ product.qty_Max }}
              </td>

              <!-- 👉 Product code -->
              <td class="text-end">
                {{ product.qty_Min }}
              </td>

              <!-- 👉 Product code -->
              <td class="text-start">
                {{ formatDateTime(product.lastupdate) }}
              </td>

              <!-- 👉 Actions -->
              <td
                style="width: 8rem;"
                class="text-center"
              >
                <VIcon
                  color="primary"
                  icon="mdi-square-edit-outline"
                  @click="startEdit(product.catId,product.category1)"
                />
                <VIcon
                  color="error"
                  icon="mdi-trash-can-outline"
                  @click="startDelete(product.qty_B,product.unitName_B,product.unitId_B,product.qty_S,product.unitName_S,product.unitId_S,product.qty_Max,product.qty_Min)"
                />
              </td>
            </tr>
          </tbody>
        </VTable>

        <VDivider v-if="productUnitRadio" />

        <VCardText
          v-if="productUnitRadio"
          class="d-flex align-center flex-wrap justify-end gap-4 pa-2"
        >
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
        <div
          v-if="!productUnitRadio"
          class="d-flex justify-center align-center"
        >
          <VAvatar
            class="avatar-with-text"
            size="200"
            rounded="0"
          >
            <div>
              <VIcon
                size="150"
                icon="mdi-package-variant-closed"
                color="grey-lighten-2"
              />
            </div>
            <div class="no-data-text">
              {{ $t('No Data') }}
            </div>
          </VAvatar>
        </div>
      </section>

    
      <!-- Details / Btn -->
      <section>
        <VRow>
          <!-- Details -->
          <VCol
            cols="12"
            lg="6"
          />
          <!--  Btn -->
          <VCol
            cols="12"
            lg="6"
            class="d-flex justify-end align-end"
          >
            <section>
              <div class="d-flex justify-end">
                <VRow>
                  <VCol cols="4">
                    <VBtn
                      style="width: 100%;"
                      variant="outlined"
                      color="red"
                    >
                      {{ $t('Reset') }}
                    </VBtn>
                  </VCol>
                  <VCol cols="4">
                    <VBtn
                      :color="colorStatusSaveRadio"
                      :variant="variantBtnSaveRadio"
                      :disabled="disabledBtnSaveRadio"
                      style="width: 100%;"
                      @click="saveUnitRadio"
                    >
                      {{ $t('Save') }}
                    </VBtn>
                  </VCol>
                  <VCol cols="4">
                    <VBtn
                      :to="{ 
                        name: 'configurationSetting-productInformation-product-addProduct-defineUnitOfCount', 
                        query: $route.query,
                      }"
                      style="width: 100%;"
                      :color="btnNextAllColor"
                      :disabled="btnNextAllDisabled"
                      :variant="btnNextAllVariant"
                    >
                      {{ $t('Next') }}
                    </VBtn>
                  </VCol>
                </VRow>
              </div>
            </section>
          </VCol>
        </VRow>
      </section>
    </VCard>
  </section>

  <!-- Table Define New -->
  <section>
    <VRow>
      <VCol
        cols="12"
        lg="6"
      >
        <VAutocomplete
          v-model="unitMaxId"
          class="mb-4"
          :label="$t('Mega Unit')"
          :items="unitMaxItems"
          :custom-filter="customFilter"
          item-title="name"
          item-value="id"
          density="compact"
          clearable
          clear-icon="mdi-close"
          base-color="primary"
        />
      </VCol>
      <VCol
        cols="12"
        lg="6"
      >
        <VTextField
          v-model="unitMaxNumber"
          readonly
          variant="solo-filled"
          density="compact"
          type="number"
          :label="$t('QTY')"
          :min="0"
        />
      </VCol>
      <VCol
        cols="12"
        lg="6"
      >
        <VAutocomplete
          v-model="unitMinId"
          class="mb-4"
          :label="$t('Sub Unit')"
          :items="unitMinItems"
          :custom-filter="customFilter"
          item-title="name"
          item-value="id"
          density="compact"
          clearable
          clear-icon="mdi-close"
          base-color="primary"
        />
      </VCol>
      <VCol
        cols="12"
        lg="6"
      >
        <VTextField
          v-model="unitMinNumber"
          density="compact"
          type="number"
          :label="$t('QTY')"
          :min="0"
        />
      </VCol>
    </VRow>
    <VRow>
      <VCol
        cols="12"
        lg="12"
      >
        <VRow>
          <VCol
            cols="12"
            lg="6"
          >
            <VRow>
              <VCol
                cols="12"
                lg="8"
              >
                <VTextField
                  v-model="defineMin"
                  label="Min"
                  density="compact"
                  type="number"
                  step="0.01"
                  :min="0.00"
                />
              </VCol>
              <VCol
                cols="12"
                lg="4"
              >
                <VSwitch
                  v-model="alertMin"
                  :label="$t('Alert Min')"
                  inset
                />
              </VCol>
            </VRow>
          </VCol>
          <VCol
            cols="12"
            lg="6"
          >
            <VRow>
              <VCol
                cols="12"
                lg="8"
              >
                <VTextField
                  v-model="defineMax"
                  density="compact"
                  label="Max"
                  type="number"
                  step="0.01"
                  :min="0.00"
                />
              </VCol>
              <VCol
                cols="12"
                lg="4"
              >
                <VSwitch
                  v-model="alertMax"
                  inset
                  :label="$t('Alert Max')"
                />
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </VCol>
      <VCol
        cols="12"
        lg="12"
      >
        <div class="d-flex justify-end">
          <VRow class="d-flex justify-end">
            <VCol
              cols="12"
              lg="1"
            >
              <VBtn
                :variant="variantBtnAddRadio"
                :color="colorStatusAddRadio"
                :disabled="disabledBtnAddRadio"
                style="width: 100%;"
                @click="genProductUnitRatio"
              >
                {{ $t('Add') }}
              </VBtn>
            </VCol>
            <VCol
              cols="12"
              lg="1"
            >
              <VBtn
                color="grey"
                disabled
                style="width: 100%;"
              >
                {{ $t('Edit') }}
              </VBtn>
            </VCol>
            <VCol
              cols="12"
              lg="1"
            >
              <VBtn
                color="grey"
                variant="outlined"
                disabled
                style="width: 100%;"
              >
                {{ $t('Clear') }}
              </VBtn>
            </VCol>
          </VRow>
        </div>
        <div>
          <!-- 👉 Table   -->
          <section
            v-if="!checkData"
            class="mt-4 pa-4"
          >
            <VTable density="compact">
              <thead>
                <tr>
                  <th class="text-center">
                    {{ $t('No.') }}
                  </th>
                  <th class="text-end">
                    {{ $t('Number') }}
                  </th>
                  <th class="text-start">
                    {{ $t('Unit') }}
                  </th>
                  <th class="text-end">
                    {{ $t('Number') }}
                  </th>
                  <th class="text-start">
                    {{ $t('Unit') }}
                  </th>
                  <th class="text-end">
                    {{ $t('Max') }}
                  </th>
                  <th class="text-end">
                    {{ $t('Min') }}
                  </th>
                  <th class="text-start">
                    {{ $t('Last Update') }}
                  </th>
                  <th class="text-center">
                    {{ $t('Action') }}
                  </th>
                </tr>
              </thead>
              <!-- 👉 table body -->
              <tbody v-if="productUnitRadio">
                <tr
                  v-for="(product, index) in productUnitRadio"
                  :key="index"
                >
                  <!-- 👉 Ordinal Number -->
                  <td class="text-center">
                    {{ index+1 }}
                  </td>

                  <!-- 👉 Product categories -->
                  <td class="text-end">
                    {{ product.qty_B }}
                  </td>

                  <!-- 👉 Secondary product categories -->
                  <td class="text-start">
                    {{ product.unitName_B }}
                  </td>

                  <!-- 👉 Product code -->
                  <td class="text-end">
                    {{ product.qty_S }}
                  </td>

                  <!-- 👉 Product code -->
                  <td class="text-start">
                    {{ product.unitName_S }}
                  </td>

                  <!-- 👉 Product code -->
                  <td class="text-end">
                    {{ product.qty_Max }}
                  </td>

                  <!-- 👉 Product code -->
                  <td class="text-end">
                    {{ product.qty_Min }}
                  </td>

                  <!-- 👉 Product code -->
                  <td class="text-start">
                    {{ formatDateTime(product.lastupdate) }}
                  </td>

                  <!-- 👉 Actions -->
                  <td
                    style="width: 8rem;"
                    class="text-center"
                  >
                    <VIcon
                      v-if="false"
                      color="primary"
                      icon="mdi-square-edit-outline"
                      @click="startEdit(product.catId,product.category1)"
                    />
                    <VIcon
                      color="error"
                      icon="mdi-trash-can-outline"
                      @click="startDelete(product.qty_B,product.unitName_B,product.unitId_B,product.qty_S,product.unitName_S,product.unitId_S,product.qty_Max,product.qty_Min)"
                    />
                  </td>
                </tr>
              </tbody>
            </VTable>

            <VDivider v-if="productUnitRadio" />

            <VCardText
              v-if="productUnitRadio"
              class="d-flex align-center flex-wrap justify-end gap-4 pa-2"
            >
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
            <div
              v-if="!productUnitRadio"
              class="d-flex justify-center align-center"
            >
              <VAvatar
                class="avatar-with-text"
                size="200"
                rounded="0"
              >
                <div>
                  <VIcon
                    size="150"
                    icon="mdi-package-variant-closed"
                    color="grey-lighten-2"
                  />
                </div>
                <div class="no-data-text">
                  {{ $t('No Data') }}
                </div>
              </VAvatar>
            </div>
          </section>
        </div>
      </VCol>
    </VRow>
  </section>
</template>

<style lang="scss">
@media screen and (min-width: 200px) and (max-width: 290px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    font-size: 0.8rem;
    padding-inline: 2.5rem;
  }

  .custom-small-btn-clear {
    font-size: 0.8rem;
    padding-inline: 2.5rem;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  .custom-avatar-size {
    font-size: 10px;
  }

  .custom-avatar-size .v-avatar {
    block-size: 30px !important; /* กำหนดความสูงตามต้องการ */
    inline-size: 30px !important; /* กำหนดความกว้างตามต้องการ */
  }

  .custom-avatar-size .v-icon {
    inline-size: 30px !important;
  }

  .custom-btn-start-dialog {
    padding-inline: 13px;
  }
}

@media screen and (min-width: 300px) and (max-width: 399px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    font-size: 0.9rem;
    padding-inline: 50px;
  }

  .custom-small-btn-clear {
    padding: 2px;
    font-size: 0.9rem;
    padding-inline: 50px;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  .custom-avatar-size {
    font-size: 10px;
  }

  .custom-avatar-size .v-avatar {
    block-size: 30px !important; /* กำหนดความสูงตามต้องการ */
    inline-size: 30px !important; /* กำหนดความกว้างตามต้องการ */
  }

  .custom-avatar-size .v-icon {
    inline-size: 30px !important;
  }

  .custom-btn-start-dialog {
    padding-inline: 13px;
  }
}

@media screen and (min-width: 400px) and (max-width: 430px) {
  .custom-small-btn-search {
    padding: 3px;
    font-size: 0.9rem;
    padding-inline: 4rem;
  }

  .custom-small-btn-clear {
    padding: 3px;
    font-size: 0.9rem;
    padding-inline: 4rem;
  }

  .custom-small-img {
    max-inline-size: 30px;
  }

  .custom-avatar-size {
    font-size: 10px;
  }

  .custom-avatar-size .v-avatar {
    block-size: 30px !important; /* กำหนดความสูงตามต้องการ */
    inline-size: 30px !important; /* กำหนดความกว้างตามต้องการ */
  }

  .custom-avatar-size .v-icon {
    inline-size: 30px !important;
  }

  .custom-btn-start-dialog {
    padding-inline: 13px;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

@media screen and (min-width: 500px) and (max-width: 599px) {
  .custom-small-btn-search {
    padding: 3px;
    font-size: 0.9rem;
    padding-inline: 4rem;
  }

  .custom-small-btn-clear {
    padding: 3px;
    font-size: 0.9rem;
    padding-inline: 5rem;
  }

  .custom-small-img {
    max-inline-size: 30px;
  }

  .custom-avatar-size {
    font-size: 10px;
  }

  .custom-avatar-size .v-avatar {
    block-size: 30px !important; /* กำหนดความสูงตามต้องการ */
    inline-size: 30px !important; /* กำหนดความกว้างตามต้องการ */
  }

  .custom-avatar-size .v-icon {
    inline-size: 30px !important;
  }

  .custom-btn-start-dialog {
    padding-inline: 13px;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

@media screen and (min-width: 600px) and (max-width: 690px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    padding: 5px;
    font-size: 1rem;
  }

  .custom-small-btn-excel {
    font-size: 0;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  .custom-avatar-size {
    font-size: 10px;
  }

  .custom-avatar-size .v-avatar {
    block-size: 30px !important; /* กำหนดความสูงตามต้องการ */
    inline-size: 30px !important; /* กำหนดความกว้างตามต้องการ */
  }

  .custom-avatar-size .v-icon {
    inline-size: 30px !important;
  }

  .custom-btn-start-dialog {
    padding-inline: 13px;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

@media screen and (min-width: 700px) and (max-width: 799px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    padding: 3px;
    font-size: 0.8rem;
  }

  .custom-small-btn-clear {
    padding: 3px;
    font-size: 0.8rem;
    padding-inline: 4rem;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  .custom-avatar-size {
    font-size: 10px;
  }

  .custom-avatar-size .v-avatar {
    block-size: 30px !important; /* กำหนดความสูงตามต้องการ */
    inline-size: 30px !important; /* กำหนดความกว้างตามต้องการ */
  }

  .custom-avatar-size .v-icon {
    inline-size: 30px !important;
  }

  .custom-btn-start-dialog {
    padding-inline: 13px;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

@media screen and (min-width: 800px) and (max-width: 899px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    font-size: 1rem;
    padding-inline: 1.5rem;
  }

  .custom-small-btn-clear {
    font-size: 1rem;
    padding-inline: 4rem;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  .custom-avatar-size {
    font-size: 10px;
  }

  .custom-avatar-size .v-avatar {
    block-size: 30px !important; /* กำหนดความสูงตามต้องการ */
    inline-size: 30px !important; /* กำหนดความกว้างตามต้องการ */
  }

  .custom-avatar-size .v-icon {
    inline-size: 30px !important;
  }

  .custom-btn-start-dialog {
    padding-inline: 13px;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

@media screen and (min-width: 900px) and (max-width: 1099px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    font-size: 1rem;
    padding-inline: 1.5rem;
  }

  .custom-small-btn-clear {
    font-size: 1rem;
    padding-inline: 6rem;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  .custom-avatar-size {
    font-size: 10px;
  }

  .custom-avatar-size .v-avatar {
    block-size: 30px !important; /* กำหนดความสูงตามต้องการ */
    inline-size: 30px !important; /* กำหนดความกว้างตามต้องการ */
  }

  .custom-avatar-size .v-icon {
    inline-size: 30px !important;
  }

  .custom-btn-start-dialog {
    padding-inline: 13px;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

@media screen and (min-width: 1100px) and (max-width: 1200px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    font-size: 1.3rem;
    padding-inline: 2rem;
  }

  .custom-small-btn-clear {
    font-size: 1.3rem;
    padding-inline: 7rem;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  .custom-avatar-size {
    font-size: 10px;
  }

  .custom-avatar-size .v-avatar {
    block-size: 30px !important; /* กำหนดความสูงตามต้องการ */
    inline-size: 30px !important; /* กำหนดความกว้างตามต้องการ */
  }

  .custom-avatar-size .v-icon {
    inline-size: 30px !important;
  }

  .custom-btn-start-dialog {
    padding-inline: 13px;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

@media screen and (min-width: 1201px) and (max-width: 1599px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    font-size: 1rem !important;
    padding-inline: 2rem;
  }

  .custom-small-btn-clear {
    font-size: 1rem;
    padding-inline: 7rem;
  }

  .custom-small-img {
    inline-size: 25px;
  }

  .custom-avatar-size {
    font-size: 10px;
  }

  .custom-avatar-size .v-avatar {
    block-size: 30px !important; /* กำหนดความสูงตามต้องการ */
    inline-size: 30px !important; /* กำหนดความกว้างตามต้องการ */
  }

  .custom-avatar-size .v-icon {
    inline-size: 30px !important;
  }

  .custom-btn-start-dialog {
    padding-inline: 13px;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}

.button-with-border {
  border: 3px dotted rgb(131, 131, 131); /* เส้นกรอบจุดๆ ด้วยสีดำ */
  border-radius: 10px; /* กำหนดรูปร่างของเส้นกรอบเป็นมนูมให้มีเส้นโค้งขนานกับมุม */
}

.avatar-with-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.no-data-text {
  color: rgb(222, 222, 222); /* ตั้งค่าสีข้อความ */
  font-weight: bold; /* ตั้งค่าตัวหนา */
  margin-block-start: 10px; /* ปรับตำแหน่งข้อความให้ห่างจากไอคอน */
}
</style>

