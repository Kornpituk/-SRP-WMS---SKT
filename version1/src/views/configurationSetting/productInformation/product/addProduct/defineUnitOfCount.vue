<script setup>
import dashboard from '@/navigation/vertical/dashboard'
import axiosIns from '@axios'
import { onMounted, ref, watchEffect, defineProps } from 'vue'

const productIdLocal = ref('')

watchEffect(() => {
  console.log('productIdForGenCode', localStorage.getItem('productIdForGenCode'))
  productIdLocal.value = localStorage.getItem('productIdForGenCode')
})


//// --------------------------------------------------------------------------------------


//------------------------------------- Define Props -------------------------------
const route = useRoute()

// ----------------- Route --------------------------.
// import { useRoute } from 'vue-router'



//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

//-------------------------------------------------------------  Search Table Nomaly-------------------
// const urlApi = ref('https://webapi.easetrackwms.com')

import { urlApi } from '@/api'
import DemoSwitchTrueAndFalseValue from '@/views/demos/forms/form-elements/switch/DemoSwitchTrueAndFalseValue.vue'

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
const colorName = ref(route.query.colorName)

const sizeItem = ref([])
const sizeID = ref(route.query.sizeID)
const sizeName = ref(route.query.sizeName)

const styleItem = ref([])
const styleID = ref(route.query.styleID)
const styleName = ref('')

const unitItem = ref([])
const unitID = ref('')
const unitName = ref('')

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

const barcode = ref('')

const details = ref('')

const productUnit = ref([])

//------------------------- Check Request -------------------------------

//--------------- Get Product Color ----------------------------------
const getUOMCat = () => {``
  axiosIns.get(`${urlApi.value}/api/v1/Product/UOM/All`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {

      unitItem.value = response.data

      console.log('[unitItem]!!: ', unitItem.value)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

watch(getUOMCat)

//---------------------------- Gen Barcode ------------------
//------------------- ProductUnit ------------------------
const colorStatusCreate = ref('grey')
const variantBtnGenBarcode = ref('tonal')
const disabledBtnGenBarCode = ref(true)

watch(() => {
  if (unitID.value !== '') {
    colorStatusCreate.value = 'orange'
    variantBtnGenBarcode.value = 'flat'
    disabledBtnGenBarCode.value = false
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
const colorStatusSaveBarcode = ref('grey')
const variantBtnSaveBarcode = ref('tonal')
const disabledBtnSaveBarCode = ref(true)

watch(() => {
  if (barcode.value !== '') {
    colorStatusSaveBarcode.value = 'primary'
    variantBtnSaveBarcode.value = 'flat'
    disabledBtnSaveBarCode.value = false
  }
})

const resetAddBarcode = () =>{
  colorStatusSaveBarcode.value = 'grey'
  variantBtnSaveBarcode.value = 'tonal'
  disabledBtnSaveBarCode.value = true

  colorStatusCreate.value = 'grey'
  variantBtnGenBarcode.value = 'tonal'
  disabledBtnGenBarCode.value = true

  barcode.value = ''
}


const genProductUnitBarCode = async () => {
  const data = ({
    unitId: unitID.value,
    barcode: barcode.value.toString(),
  })

  try {
    const response = await axiosIns.post(`${urlApi.value}/api/v1/Product/ProductUnit/${productCode.value}/Save?`, data, {
      headers: {
        'accept': '*/*',
        'x-location': `${whereHouse}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
    }, {})

    resetAddBarcode()
    genProductUnitId()
    console.log('result.value: ', response.data)
  } catch (error) {
    // Handle errors
    console.error('Error:', error)
  }
}

//------------------------ Get Product Unit Product Id ----------------------
const genProductUnitId = async () => {
  try {
    const response = await axiosIns.get(`${urlApi.value}/api/v001/Product/ProductUnit/${productCode.value}`, {
      headers: {
        'accept': '*/*',
        'x-location': `${whereHouse}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
    }, {})

    productUnit.value = response.data
    console.log('productUnit.value: ', response.data)
  } catch (error) {
    // Handle errors
    console.error('Error:', error)
  }
}

watch(genProductUnitId)

//-------------------- Function product unit Edit ^w^ ------------------
//------------------ Btn Edit -------------------
const isDialogVisibleBtnEdit = ref(false)
const isDialogVisibleBtnEdited = ref(false)
const editColorId = ref('')
const editBarcode = ref('')
const editUnitName = ref('')

const startEdit = (unitName, barcode) => {
  isDialogVisibleBtnEdit.value = true
  editBarcode.value = barcode
  editUnitName.value = unitName
}

const editProductUnit = () => {
  const postCatData = {
    barcode: editBarcode.value,
    unitId: editUnitName.value,
  }

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.post(`${urlApi.value}/api/v1/Color/Edit`, postCatData, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
      'Content-Type': `application/json`,
    },
  }, {})
    .then(response => {
      isDialogVisibleBtnEdit.value = false ; isDialogVisibleBtnEdited.value = true
      getColor()
      console.log('response ', response)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

//--------------------------- Delete Product Unit -------------------------
const isDialogVisibleBtnDelete = ref(false)
const isDialogVisibleBtnDeleted = ref(false)

//------------------------ Function Add Cat Delete ^w^ --------------
const deleteUnit = ref('')
const deleteName = ref('')
const deleteBarcode = ref('')

const startDelete = (UnitId, UnitName, Barcode) => {
  isDialogVisibleBtnDelete.value = true
  deleteUnit.value = UnitId
  deleteName.value = UnitName
  deleteBarcode.value = Barcode
}

const deleteProductUnitBarCode = async () => {
  try {
    const response = await axiosIns.post(`${urlApi.value}/api/v1/Product/ProductUnit/${productCode.value}/Delete?`, null, {
      headers: {
        'accept': '*/*',
        'x-location': `${whereHouse}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
      params: {
        productId: productCode.value,
        unitId: deleteUnit.value,
      },
    }, {})

    isDialogVisibleBtnDelete.value = false ; isDialogVisibleBtnDeleted.value = true
    genProductUnitId()
    console.log('result.value: ', response.data)
  } catch (error) {
    // Handle errors
    console.error('Error:', error)
  }
}

//----------------------------- Print Barcode ----------------------------
//----------------------------- Dialog --------------------------------------------
const isDialogPrintBarcodeVisible = ref(false)

// --------------------------------------- Export Barcode Excel ----------------------
const checkboxBarcode = ref(false)
const checkboxQRCode = ref(false)
const numberPrintPOBarcode = ref(1)

const barcodeExcelExport = () => {
  const Data = checkSelectItems.value.map(item => ({
    barcode: item.barcode,
    brand: item.brand,
    categoryId: item.categoryId,
    categoryName: item.categoryName,
    color: item.color,
    colorId: item.colorId,
    image: item.image,
    lastUpdate: item.lastUpdate,
    locations: item.locations,
    nonTags: item.nonTags,
    productId: item.productId,
    productName: item.productName,
    qty: item.qty,
    size: item.size,
    sizeId: item.sizeId,
    styleNo: item.styleNo,
    subTypeId: item.subTypeId,
    subTypeName: item.subTypeName,
    tags: item.tags,
    typeId: item.typeId,
    typeName: item.typeName,
    unitId: item.unitId,
    unitName: item.unitName,
  }))
  
  axiosIns.post(`${urlApi.value}/api/v1/Product/ProductList/Excel/Barcode`, Data, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
    responseType: 'blob', // ให้เซิร์ฟเวอร์รีเทิร์น blob สำหรับไฟล์ Excel
  })
    .then(response => {
      // สร้าง URL ของไฟล์ Excel จาก binary data
      const url = window.URL.createObjectURL(new Blob([response.data]))

      const currentDate = new Date() // สร้างวัตถุ Date ปัจจุบัน
      const year = currentDate.getFullYear() // ดึงปีปัจจุบัน
      let fileYear
      const threshold = 2500 // กำหนดจุดแบ่ง พ.ศ. กับ ค.ศ.

      if (year > threshold) {
        // พ.ศ. เปลี่ยนเป็น ค.ศ.
        fileYear = year - 543
      } else {
        // ค.ศ.
        fileYear = year
      }

      const dateString = currentDate.toISOString().slice(0, 10).replace(/-/g, '').replace(year.toString(), fileYear.toString())

      const fileName = `Product_List_Barcode_${dateString}.xlsx` // ตั้งชื่อไฟล์โดยรวมกับวันที่

      // สร้างลิงก์สำหรับดาวน์โหลดไฟล์ Excel
      const link = document.createElement('a')

      link.href = url
      link.setAttribute('download', fileName) // ตั้งชื่อไฟล์ที่จะดาวน์โหลด
      document.body.appendChild(link)
      link.click()

      // ลบ URL หลังจากดาวน์โหลดเสร็จเรียบร้อยแล้ว
      window.URL.revokeObjectURL(url)
    })
    .catch(error => {
      // จัดการข้อผิดพลาด
      console.error('Error:', error)
    })
}


const onClickExportExcelList = () => {
  if(checkboxBarcode.value && !checkboxQRCode.value){
    for(let i = 0; i < numberPrintPOBarcode.value; i++){
      barcodeExcelExport()
    }
  } else if(!checkboxBarcode.value && checkboxQRCode.value){
    for(let i = 0; i < numberPrintPOBarcode.value; i++){
      qrCodeExcelExport()
    }
  } else if(checkboxBarcode.value && checkboxQRCode.value){
    for(let i = 0; i < numberPrintPOBarcode.value; i++){
      barcodeExcelExport()
      qrCodeExcelExport()
    }
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

//---------------------------- for btn Save Reset next -----------------
const isDialogSaveAllVisible = ref(false)
const checkSaveAll = ref(false)

const btnSaveAllColor = ref('green')
const btnSaveAllVariant = ref('flat')
const btnSaveAllDisabled = ref(false)

const btnNextAllColor = ref('grey')
const btnNextAllVariant = ref('tonal')
const btnNextAllDisabled = ref(true)

const saveUnitBarcode = () => {
  console.log('resetDefineUnitBacode Start!')
  isDialogSaveAllVisible.value = ref(true)
}

const checkAllSaveBarcode = () => {
  isDialogSaveAllVisible.value = false
  
  btnSaveAllDisabled.value = false
  btnSaveAllColor.value = 'grey'
  btnSaveAllVariant.value = 'tonal'
  btnSaveAllDisabled.value = true

  btnNextAllColor.value = 'orange'
  btnNextAllVariant.value = 'flat'
  btnNextAllDisabled.value = false
}

const resetDefineUnitBacode = () => {
  console.log('resetDefineUnitBacode Start!')
}
</script>

<template>
  <!-- ----------------        Label Page | Back           ------------------------------------ -->
  <div v-if="false">
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
            dot-color="warning"
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

          <!-- -   Define Counting Radio   - -->
          <VTimelineItem
            size="small"
            dot-color="gray"
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
  </div>
  <!-- -   Define Counting Radio   - -->

  <!-- Dialog Zone -->
  <div>
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
                        v-model="editUnitName"
                        readonly
                        variant="solo-filled"
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
                        v-model="editBarcode"
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
                @click="editProductUnit"
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
          <VCard :title="$t('Delete Unit Counting Barcode')">
            <DialogCloseBtn
              variant="text"
              size="small"
              @click="isDialogVisibleBtnDelete = false"
            />

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
                        v-model="deleteName"
                        readonly
                        variant="solo-filled"
                        :label="$t('Unit Counting')"
                        placeholder="Unit"
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
                        v-model="deleteBarcode"
                        readonly
                        variant="solo-filled"
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
                @click="isDialogVisibleBtnDelete = false"
              >
                {{ $t('Cancel') }}
              </VBtn>
              <VBtn
                variant="flat"
                color="warning"
                class="px-6"
                @click="deleteProductUnitBarCode"
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
                    icon="mdi-delete-circle"
                    color="primary"
                    size="128"
                  />
                </VAvatar>
              </div>
            </VCardText>
            <VCardText class="d-flex justify-center">
              <span class="text-h5">{{ $t('Delete Unit Counting Barcode Complete.') }}</span>
            </VCardText>
          </VCard>
        </VDialog>
      </div>
    </section>

    <!-- Dialog for Print Barcode -->
    <section>
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
                  <span>{{ $t('Number Of Prints/Bar Codes') }}:</span> 
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
    </section>

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
              @click="checkAllSaveBarcode"
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
  </div>

  <!-- Main Table Btn -->
  <div v-if="false">
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
                      >
                        <span class="d-flex align-start">{{ $t('Product Code') }}: </span>
                      </VCol>
                      <VCol
                        cols="8"
                        lg="10"
                      >
                        <VTextField
                          v-model="productCode"
                          readonly
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
                      >
                        <span class="d-flex align-start">{{ $t('Product Name') }}: </span>
                      </VCol>
                      <VCol
                        cols="8"
                        lg="10"
                      >
                        <VTextField
                          v-model="productName"
                          readonly
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
                    class="d-flex align-center justify-end"
                  >
                    {{ $t('Color') }}:
                  </VCol>
                  <VCol
                    cols="8"
                    lg="3"
                  >
                    <VTextField
                      v-model="colorID"
                      readonly
                      density="compact"
                      type="number"
                      placeholder="00"
                      variant="solo-filled"
                      :max="255"
                      :min="0"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    lg="6"
                  >
                    <VSelect
                      v-model="colorName"
                      :items="items"
                      readonly
                      variant="solo-filled"
                      density="compact"
                      :label="$t('Color')"
                      :placeholder="$t('Color')"
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
                    class="d-flex align-center justify-end"
                  >
                    {{ $t('Size') }}:
                  </VCol>
                  <VCol
                    cols="8"
                    lg="3"
                  >
                    <VTextField
                      v-model="sizeID"
                      readonly
                      variant="solo-filled"
                      density="compact"
                      type="number"
                      placeholder="00"
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
                      readonly
                      :items="items"
                      density="compact"
                      :label="$t('Size')"
                      :placeholder="$t('Size')"
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
                    class="d-flex align-center justify-end"
                  >
                    {{ $t('Style') }}:
                  </VCol>
                  <VCol cols="9">
                    <VTextField
                      v-model="styleID"
                      readonly
                      variant="solo-filled"
                      :label="$t('Style')"
                      density="compact"
                    />
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          </section>

          <!-- Unit Counting / Barcode / Btn -->
          <section>
            <VRow>
              <!-- Unit Counting  -->
              <VCol
                cols="12"
                lg="5"
              >
                <VRow class="d-flex align-center">
                  <VCol
                    cols="4"
                    lg="2"
                    class="px-0"
                  >
                    <span class="d-flex align-start">{{ $t('UoM') }}: </span>
                  </VCol>
                  <VCol
                    cols="8"
                    lg="6"
                    class="px-0"
                  >
                    <VAutocomplete
                      v-model="unitID"
                      class="mb-4"
                      :label="$t('Color')"
                      :items="unitItem"
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
                    lg="4"
                    class="d-flex align-center justify-center justify-lg-end"
                  >
                    <VBtn
                      :color="colorStatusCreate"
                      :variant="variantBtnGenBarcode"
                      :disabled="disabledBtnGenBarCode"
                      @click="genProductBarCode"
                    >
                      {{ $t('Create Barcode') }}
                    </VBtn>
                  </VCol>
                </VRow>
              </VCol>
              <!-- Barcode  -->
              <VCol
                cols="12"
                lg="5"
              >
                <VRow>
                  <VCol
                    cols="4"
                    lg="2"
                    class="px-0 d-flex align-center"
                  >
                    <span>{{ $t('Barcode') }}: </span>
                  </VCol>
                  <VCol
                    cols="8"
                    lg="10"
                    class="px-0"
                  >
                    <VTextField
                      v-model="barcode"
                      density="compact"
                      :label="$t('Barcode')"
                    />
                  </VCol>
                </VRow>
              </VCol>
              <!-- Btn  -->
              <VCol
                cols="12"
                lg="2"
              >
                <VRow>
                  <VCol cols="12">
                    <VBtn
                      class="mx-2"
                      :disabled="disabledBtnSaveBarCode"
                      :color="colorStatusSaveBarcode"
                      :variant="variantBtnSaveBarcode"
                      style="width: 100%;"
                      @click="genProductUnitBarCode"
                    >
                      {{ $t('Add') }}
                    </VBtn>
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          </section>

          <!-- Button -->
        </VCard>
      </section>

      <!-- 👉 Table   -->
      <section class="mt-4 pa-4">
        <VTable density="compact">
          <thead>
            <tr>
              <th class="text-center">
                {{ $t('No.') }}
              </th>
              <th class="text-left">
                {{ $t('Counting Unit') }}
              </th>
              <th class="text-left">
                {{ $t('Barcode') }}
              </th>
              <th class="text-center">
                {{ $t('Action') }}
              </th>
            </tr>
          </thead>
          <tbody v-if="productUnit && productUnit.length > 0">
            <tr
              v-for="(product, index) in productUnit"
              :key="index"
            >
              <!-- 👉 Ordinal Number -->
              <td class="text-center">
                {{ index+1 }}
              </td>

              <!-- 👉 Product categories -->
              <td class="text-start">
                {{ product.unitName }}
              </td>

              <!-- 👉 Secondary product categories -->
              <td class="text-start">
                {{ product.barcode }}
              </td>

              <!-- 👉 Actions -->
              <td class="text-center">
                <VIcon
                  color="primary"
                  icon="mdi-square-edit-outline"
                  @click="startEdit(product.unitName,product.barcode)"
                />
                <VIcon
                  color="error"
                  icon="mdi-trash-can-outline"
                  @click="startDelete(product.unitId,product.unitName,product.barcode)"
                />
                <VIcon
                  v-model="checkSelectItems"
                  color="primary"
                  icon="mdi-printer-outline"
                  :value="product"
                  @click="printBarcode(product)"
                />
              </td>
            </tr>
          </tbody>
        </VTable>

        <VDivider v-if="productUnit && productUnit.length > 0" />

        <VCardText
          v-if="productUnit && productUnit.length > 0"
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
          v-if="!productUnit && productUnit.length > 0"
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
                      variant="outlined"
                      color="red"
                      style="width: 100%;"
                    >
                      {{ $t('Reset') }}
                    </VBtn>
                  </VCol>
                  <VCol cols="4">
                    <VBtn
                      :variant="btnSaveAllVariant"
                      :color="btnSaveAllColor"
                      :disabled="btnSaveAllDisabled"
                      style="width: 100%;"
                      @click="saveUnitBarcode"
                    >
                      {{ $t('Save') }}
                    </VBtn>
                  </VCol>
                  <VCol cols="4">
                    <VBtn
                      :to="{ 
                        name: 'configurationSetting-productInformation-product-addProduct-defineCountingRadio', 
                        query: $route.query,
                      }"
                      :variant="btnNextAllVariant"
                      :color="btnNextAllColor"
                      :disabled="btnNextAllDisabled"
                      style="width: 100%;"
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
  </div>

  <!-- Define Unit Of Count New -->
  <div>
    <VRow>
      <VCol
        cols="12"
        lg="10"
      >
        <VAutocomplete
          v-model="unitID"
          :label="$t('Counting Unit')"
          :items="unitItem"
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
        lg="2"
      >
        <VBtn
          :color="colorStatusCreate"
          :variant="variantBtnGenBarcode"
          :disabled="disabledBtnGenBarCode"
          clearable
          clear-icon="mdi-close"
          style="width: 100%;"
          @click="genProductBarCode"
        >
          {{ $t('Create Barcode') }}
        </VBtn>
      </VCol>
    </VRow>
    <VRow>
      <VCol
        cols="12"
        lg="10"
      >
        <VTextField
          v-model="barcode"
          density="compact"
          :label="$t('Barcode')"
        />
      </VCol>
      <VCol
        cols="12"
        lg="2"
      >
        <VBtn
          :disabled="disabledBtnSaveBarCode"
          :color="colorStatusSaveBarcode"
          :variant="variantBtnSaveBarcode"
          style="width: 100%;"
          @click="genProductUnitBarCode"
        >
          {{ $t('Add') }}
        </VBtn>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12">
        <!-- 👉 Table   -->
        <section class="mt-4 pa-4">
          <VTable density="compact">
            <thead>
              <tr>
                <th class="text-center">
                  {{ $t('No.') }}
                </th>
                <th class="text-left">
                  {{ $t('UoM') }}
                </th>
                <th class="text-left">
                  {{ $t('Barcode') }}
                </th>
                <th class="text-center">
                  {{ $t('Action') }}
                </th>
              </tr>
            </thead>
            <tbody v-if="productUnit && productUnit.length > 0">
              <tr
                v-for="(product, index) in productUnit"
                :key="index"
              >
                <!-- 👉 Ordinal Number -->
                <td class="text-center">
                  {{ index+1 }}
                </td>

                <!-- 👉 Product categories -->
                <td class="text-start">
                  {{ product.unitName }}
                </td>

                <!-- 👉 Secondary product categories -->
                <td class="text-start">
                  {{ product.barcode }}
                </td>

                <!-- 👉 Actions -->
                <td class="text-center">
                  <VIcon
                    v-if="false"
                    color="primary"
                    icon="mdi-square-edit-outline"
                    @click="startEdit(product.unitName,product.barcode)"
                  />
                  <VIcon
                    color="error"
                    icon="mdi-trash-can-outline"
                    @click="startDelete(product.unitId,product.unitName,product.barcode)"
                  />
                  <VIcon
                    v-if="false"
                    v-model="checkSelectItems"
                    color="primary"
                    icon="mdi-printer-outline"
                    :value="product"
                    @click="printBarcode(product)"
                  />
                </td>
              </tr>
            </tbody>
          </VTable>

          <VDivider v-if="productUnit && productUnit.length > 0" />

          <VCardText
            v-if="productUnit && productUnit.length > 0"
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
            v-if="!productUnit && productUnit.length > 0"
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
      </VCol>
    </VRow>
  </div>
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

/* Avartar Under Table */
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

