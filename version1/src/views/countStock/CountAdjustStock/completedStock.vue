<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { ref } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

//-------------------------------------------------------------  Search Table Nomaly-------------------
const urlApi = ref('https://webapi.easetrackwms.com')

const whereHouseSelectedItem = ref('')
const products = ref([])

// Get access token from localStorage in another page
const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')

const whereHouse = localStorage.getItem('whereHouseName')


const accessTokenTest = ('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoi4LiT4Lix4LiQ4Lie4LilIiwibmFtZWlkIjoiMDAwMDAxIiwibmJmIjoxNzAxMzEyMDY5LCJleHAiOjE3MDM0NzIwNjksImlhdCI6MTcwMTMxMjA2OSwiaXNzIjoiSXNzdWVyIiwiYXVkIjoiQXVkaWVuY2UifQ.CPMUUQDPkwS0qBiHUioxEdTW8f1TIZL3u--qENiH-UQ')

const url = ref(`${urlApi.value}/api/Auth/GetLocation/all`)

const ApiTure = '`${urlApi.value}/api/v1/StockUpdate?page=`+currentPageP.value+`&perPage=`+rowPerPageP.value'

const perPage = ref(10)
const page = ref(0)
const totalCount = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)

//------------------- Model ID For search ------------------------------------
const searchByCategoryId = ref(null)
const searchByTypeId = ref('')
const searchBySubTypeId = ref('')
const searchByBarcode = ref(null)
const searchByProductId = ref(null)
const searchByProductName = ref(null)
const searchByUOMId = ref(null)
const searchByWareHouseId = ref(null)
const searchByZoneId = ref('')
const searchByAreaId = ref('')
const searchBySubAreaId = ref('')
const searchBySearchByCategory = ref('')

//------------------------ Model Name for search ------------------------------
const searchByCategoryName = ref(null)
const searchByTypeName = ref(null)
const searchBySubTypeName = ref(null)
const searchByBarcodeName = ref(null)
const searchByProductCodeName = ref(null)
const searchByProductNameFilter = ref(null)
const searchByUOMName = ref(null)
const searchByZoneName = ref(null)
const searchByAreaName = ref(null)
const searchBySubAreaName = ref(null)
const searchByUnitName = ref(null)

//----- Search Filter Icon Header Table[Product Category, Group, Sub Group, Barcode, Product Category Code, Product Name]
const menuCategory= ref( false)
const menuGroup = ref( false)
const menuSubGroup = ref( false)
const menuBarcode = ref( false)
const menuProductCode = ref( false)
const menuProductName = ref( false)
const menuUoM = ref( false)
const menuArea = ref( false)
const menuLot = ref( false)

//----------------------------------- Area-------------------------
const menuWarehouse = ref( false)
const menuZone = ref( false)
const menuAreaArea = ref( false)
const menuSubAreaArea = ref( false)

//------------------------ item ID for search ------------------------------
const itemsSearchByCategoryId = ref([])

const typeItemsSearchById = ref([])

const subTypeItemsSearchById = ref([])

const itemsSearchByUOMId = ref([])

const wareHouseItemsSearchById = ref([])

const zoneItemsSearchById = ref([])

const areaItemsSearchById = ref([])

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


const toggleSortType = sortBy => {
  const sortRefs = { sortByCategory, sortByType, sortBySubType, sortByBarcode, sortByProductId, sortByProductName, sortByUnit, sortByQty, sortByTags, sortByNonTags }

  for (const key in sortRefs) {
    if (key === sortBy) {
      sortRefs[key].value = sortRefs[key].value === 'asc' ? 'desc' : 'asc'
    } else {
      sortRefs[key].value = '' // ล้างค่าที่ไม่เกี่ยวข้อง
    }
    console.log("Sort type:", sortRefs[key], 'Key', [key])
  }

  console.log("Sort type:", sortRefs[key], 'Key', [key])
}

//--------------------------------------------------------------------------------



const GetStockUpdate = () => {

  // Clear the access token from localStorage
  localStorage.removeItem('accessToken')
  console.log('searchByCategoryName: ', searchByCategoryName)
  axiosIns.get(`${urlApi.value}/api/v1/StockUpdate?page=`+currentPage.value+`&perPage=`+rowPerPage.value, {
    params: {
      categoryId: searchByCategoryId.value,
      typeId: searchByTypeId.value,
      subTypeId: searchBySubTypeId.value,
      barcode: searchByBarcode.value,
      productId: searchByProductId.value,
      productName: searchByProductName.value,
      unitId: searchByUOMId.value,
      zoneId: '',
      areaId: '',
      subAreaId: '',
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

      // ... and so on with other parameters
    },
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {

      products.value = response.data.items
      totalCount.value = response.data.totalCount
      currentPage.value = response.data.page
      totalPage.value = response.data.totalPages
      rowPerPage.value = response.data.perPage

      console.log('products.value: ', products.value)
      console.log('perPage: ', perPage)
      console.log('currentPage: ', currentPage)
      console.log('totalCount: ', totalCount)
      console.log('totalPages: ', totalPage)

      
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })
}

watch(GetStockUpdate)

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

///--------------------------------------- FetchItems for Search Box ----------------------------------------------

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

fetchItemsSearchBy('UOM').then(data => {
  itemsSearchByUOMId.value = data
})

function customFilter(item, queryText, itemText) {
  const textOne = itemText.title.toLowerCase()
  const textTwo = itemText.value.toLowerCase()
  const searchText = queryText.toLocaleLowerCase()
  
  return textOne.includes(searchText) || textTwo.includes(searchText)
}

const submitSearchButton = () => {
  console.log('submitSearchButton function!!')
  GetStockUpdate()
}

//--------------------------------------- FetchItems for Search WareHouse Zone Area ----------------------------------------

const fetchItemsWareHouse = () => {
  axiosIns.get('https://webapi.easetrackwms.com/api/Auth/GetLocation', {
    headers: {
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
    .then(response => {

      wareHouseItemsSearchById.value = response.data

      // Now `items` contains an array of objects with id and name properties
      console.log('wareHouse.value At index', wareHouseItemsSearchById.value)

      
    })
    .catch(error => {
      // Handle errors
      selectError.value = 'Where house not selected!!'
      console.error('Error:', error)
    })

    
}

watch(fetchItemsWareHouse)


//----------------------------------------------------- -----------------------------------------------//
// -------------------------------------- Export Bar Excel - --------------------------------

const stockUpdateExcel = () => {
  axiosIns.post(`${urlApi.value}/api/v1/StockUpdate/Excel`, {}, {
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

      // สร้างลิงก์สำหรับดาวน์โหลดไฟล์ Excel
      const link = document.createElement('a')

      const currentDate = new Date() // สร้างวัตถุ Date ปัจจุบัน
      const dateString = currentDate.toISOString().slice(0, 10).replace(/-/g, '') // แปลงวันที่เป็นรูปแบบ 'yyyyMMdd'
      const fileName = `stock_update_Non_Tag_${dateString}.xlsx` // ตั้งชื่อไฟล์โดยรวมกับวันที่

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

const onClickExportExcel = () => {
  stockUpdateExcel()
}

/// ------------------------------- Time Picker ------------------------

const date = ref('')

//-------------------------------- Table Demo Mock Data --------------------------------

//--------------------------------  Btn Start Cancel Clear --------------------------------

const bntColorStart = ref('primary')
const btnVarianStart = ref('flat')

const btnColorCancel = ref('grey-lighten-2')
const btnVariantCancel = ref('outlined')

const btnColorPrintCounting = ref('orange')
const btnIconColorPrintCounting = ref('white')
const btnVariantPrintCounting = ref('flat')

const eventBtnStartOnToChangBtnCancel = () => {
  btnColorCancel.value = 'red'
  btnVariantCancel.value = 'flat'

  bntColorStart.value = 'grey-lighten-2'
  btnVarianStart.value = 'outlined'

  btnColorPrintCounting.value = 'grey-lighten-2'
  btnIconColorPrintCounting.value = 'grey-lighten-2'
  btnVariantPrintCounting.value = 'outlined'

}

//--------------------------------- Zone Check ----------------------------------- 
const isDialogVisibleBtnZone = ref(false)

const checkZoneSearchBtn = searchByZoneId => {
  if (!searchByZoneId) {
    // กำหนด isDialogVisible เป็น true หาก searchByZoneId เป็นค่าว่าง
    isDialogVisibleBtnZone.value = true
    console.log('true:', searchByZoneId)
  } else {
    // หากไม่ใช่ค่าว่าง กำหนด isDialogVisible เป็น false
    isDialogVisibleBtnZone.value = false
    console.log('false')
  }
}
</script>

<template>
  <!-- ----------------        Label Page | Back           ------------------------------------ -->
  <section>
    <!-- Label Count/Adjust && Timeline -->
    <VRow>
      <!-- Tag page back -->
      <VCol
        col="12"
        sm="12"
        lg="2"
      >
        <RouterLink :to="{ name: 'inventory-CountAdjustStock-zoneStock' }">
          <IconBtn>
            <VIcon
              icon="
                mdi-chevron-left"
            />
          </IconBtn>
        </RouterLink>
        <span class="text-h6">{{ $t('Count Adjust') }}</span>
      </VCol>
      <!-- Time Line -->
      <VCol
        cols="12"
        sm="12"
        lg="8"
        
        style=" margin-top: -30px;"
      >
        <!-- -   Time Line Page   - -->
        <VTimeline
          direction="horizontal"
          line-inset="15"
          class="custom-avatar-size"
        >
          <!-- -   Count/Adjust   - -->
          <VTimelineItem
            size="small"
            dot-color="green"
            class="text-center"
          >
            <template #opposite>
              <RouterLink to="countAdjust">
                {{ $t('Counting') }}
              </RouterLink>
            </template>
            <template #icon>
              <RouterLink to="countAdjust">
                <div class="v-timeline-avatar-wrapper rounded-circle">
                  <VAvatar
                    size="60"
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

          <!-- -   Completed   - -->
          <VTimelineItem
            size="small"
            dot-color="warning"
            class="text-center"
          >
            <template #opposite />
            <template #icon>
              <RouterLink to="completedStock">
                <div class="v-timeline-avatar-wrapper rounded-circle">
                  <VAvatar
                    size="60"
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
            <RouterLink to="completedStock">
              {{ $t('Completed') }}
            </RouterLink>
          </VTimelineItem>

          <!-- -   RFID Count   - -->
          <VTimelineItem
            size="small"
            dot-color="gray"
            class="text-center"
          >
            <template #opposite>
              <RouterLink to="rfidCountStock">
                {{ $t('RFID Count') }}
              </RouterLink>
            </template>
            <template #icon>
              <RouterLink to="rfidCountStock">
                <div class="v-timeline-avatar-wrapper rounded-circle">
                  <VAvatar
                    size="60"
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

          <!-- -   Barcode Count   - -->
          <VTimelineItem
            size="small"
            dot-color="gray"
            class="text-center"
          >
            <template #opposite />
            <template #icon>
              <RouterLink to="barcodeCStock">
                <div class="v-timeline-avatar-wrapper rounded-circle">
                  <VAvatar
                    size="60"
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
            <RouterLink to="barcodeCStock">
              {{ $t('Barcode Count') }}
            </RouterLink>
          </VTimelineItem>

          <!-- -   Confirm the counting count   - -->
          <VTimelineItem
            size="small"
            dot-color="gray"
            class="text-center"
          >
            <template #opposite>
              <RouterLink to="confirmTheCountingCount">
                {{ $t('Confirm The Counting Count') }}
              </RouterLink>
            </template>
            <template #icon>
              <RouterLink to="confirmTheCountingCount">
                <div class="v-timeline-avatar-wrapper rounded-circle">
                  <VAvatar
                    size="60"
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
    <VRow class="pa-2">
      <VCol
        cols="12"
        lg="8"
      />
      <VCol
        cols="12"
        lg="4"
      >
        <div class="d-flex justify-center justify-lg-end justify-sm-end">
          <VBtn
            size="large"
            :color="btnColorPrintCounting"
            :variant="btnVariantPrintCounting"
            prepend-icon="mdi-printer"
          >
            <template #prepend>
              <VIcon
                :color="btnIconColorPrintCounting"
                size="30"
              />
            </template>
            <span class="text-white">{{ $t('Print A Counting Sheet') }}</span>
          </VBtn>
        </div>
      </VCol>
    </VRow>
  </section>

  <!-- ----------           Search bar                                   ------------------------------------ -->
  <section>
    <VCard class="ma-2">
      <VContainer
        fluid
        ma-6
        pa-6
        fill-height
      >
        <VForm @submit.prevent="submitSearchButton">
          <!-- product categories | Group | Sub Group | Counting unit -->
          <VRow>
            <!-- 👉 Select  product categories  -->
            <VCol
              cols="12"
              lg="3"
              sm="6"
            >
              <!-- 👉 Search categories -->

              <section>
                <VAutocomplete
                  v-model="searchByCategoryId"
                  :label="$t('Product Categories')"
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
            >
              <!-- 👉 Search Description -->
              <VAutocomplete
                v-model="searchBySubTypeName"
                :label="$t('Product Sub Group')"
                :items="subTypeItemsSearchById"
                :custom-filter="customFilter"
                item-title="name"
                item-value="name"
                density="compact"
                clearable
                clear-icon="mdi-close"
              />
            </VCol>

            <!-- 👉 Select Counting unit -->
            <VCol
              cols="12"
              lg="3"
              sm="6"
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
          </VRow>
          
          <!-- Warehouse  | Storehouse barcode | Store area | Sub Storage area -->
          <VRow>
            <!-- 👉 Select WareHouse -->
            <VCol
              cols="12"
              lg="3"
              sm="6"
            >
              <VTextField
                v-model="searchByBarcode"
                :label="$t('Storehouse Barcode')"
                type="Barcode"
                density="compact"
                append-inner-icon="mdi-barcode-scan"
              />
            </VCol>

            <!-- 👉 Select Storehouse Zone -->
            <VCol
              cols="12"
              lg="3"
              sm="6"
            >
              <VAutocomplete
                v-model="searchByZoneId"
                :label="$t('*Zone')"
                :items="zoneItemsSearchById"
                :custom-filter="customFilter"
                item-title="name"
                item-value="id"
                density="compact"
                clearable
                clear-icon="mdi-close"
                color="red"
              >
                <template #label>
                  <span
                    class="red-label"
                    style="color: red;"
                  >{{ $t('*Zone') }}</span>
                </template>
              </VAutocomplete>
            </VCol>

            <!-- 👉 Select Store area -->
            <VCol
              cols="12"
              lg="3"
              sm="6"
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
            >
              <VAutocomplete
                v-model="searchBySubAreaId"
                :label="$t('Sub Storage Area')"
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

          <!-- Barcode | Product code | Product Name | Button Export -->
          <VRow>
            <!-- 👉 Select Barcode -->
            <VCol
              cols="12"
              lg="3"
              sm="6"
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
            >
              <VTextField
                v-model="searchByProductName"
                :label="$t('Product Name')"
                type="Product Name"
                density="compact"
              />
            </VCol>

            <!-- 👉 Button Search -->
            <VCol
              cols="12"
              xs="12"
              sm="6"
              md="6"
              lg="3"
            >
              <VRow>
                <!-- 👉 Button Search  -->
                <VCol
                  cols="6"
                  sm="6"
                  md="6"
                  lg="6"
                  class="d-flex justify-center justify-lg-center justify-sm-end justify-xs-end"
                >
                  <VBtn
                    density="compact"
                    size="x-large"
                    class="px-lg-16 px-md-16 px-sm-12 custom-small-btn-search"
                    @click="checkZoneSearchBtn(searchByZoneId)"
                  >
                    <VIcon icon="mdi-magnify" />
                    {{ $t('Search') }}
                  </VBtn>
                </VCol>
                <!-- 👉 Button Clear  -->
                <VCol
                  cols="6"
                  sm="6"
                  md="6"
                  lg="6"
                  
                  class="d-flex justify-center justify-sm-end justify-xs-end"
                >
                  <VBtn
                    type="submit"
                    density="compact"
                    size="x-large"
                    color="red"
                    class="px-lg-16 custom-small-btn-clear"
                  >
                    {{ $t('Clear2') }}
                  </VBtn>
                </VCol>
              </VRow>
            </VCol>
          </VRow>
        </VForm>
      </VContainer>
    </VCard>
  </section>

  <!-- Check Zone Dialog -->
  <section>
    <!-- --------------------- Btn Confirm ----------------------- -->
    <VDialog
      v-model="isDialogVisibleBtnZone"
      persistent
      class="v-dialog-sm"
    >
      <!-- Dialog Content -->
      <VCard>
        <DialogCloseBtn
          variant="text"
          size="small"
          @click="isDialogVisibleBtnZone = false"
        />

        <div class="py-4 text-center">
          <div class="v-timeline-avatar-wrapper rounded-circle">
            <VAvatar
              size="160"
              color="warning"
              variant="tonal"
            >
              <VIcon
                icon="mdi-alert-circle-outline"
                color="warning"
                size="128"
              />
            </VAvatar>
          </div>

          <VCardText>
            <span class="text-h5">{{ $t('Please Choose Zone') }}</span>
          </VCardText>
        </div>
      </VCard>
    </VDialog>
  </section>

  <!-- ----------           Btn Start cancel clearable                                   ------------------------------------ -->
  <section>
    <VRow>
      <VCol
        cols="12"
        lg="5"
        class="mt-4 d-flex justify-center justify-lg-start justify-sm-start"
      >
        <!-- Btn Start -->
        <VBtn
          class="mx-1"
          :color="bntColorStart"
          :variant="btnVarianStart"
          @click="eventBtnStartOnToChangBtnCancel"
        >
          {{ $t('Start') }}
        </VBtn>
        <!-- Btn Cancel -->
        <VBtn
          class="mx-1"
          :color="btnColorCancel"
          :variant="btnVariantCancel"
        >
          {{ $t('Cancel') }}
        </VBtn>
        <!-- Btn Clear -->
        <VBtn
          class="mx-1"
          color="red"
          variant="outlined"
        >
          {{ $t('CountAgain/ReCount') }}
        </VBtn>
      </VCol><VCol
        cols="12"
        lg="7"
      />
    </VRow>
  </section>
  
  <!-- ----------             Product  Easetrack Table & Paginate                                   ------------------------------------ -->
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
            />
            <th
              scope="row"
              class="text-center"
            />
            <th
              scope="row"
              class="text-center"
            />
            <th
              scope="row"
              class="text-center"
            />
            <th
              scope="row"
              class="text-center"
            />
            <th
              scope="row"
              class="text-center"
            />
            <th
              scope="row"
              class="text-center"
            />
            <th
              scope="row"
              class="text-center"
            />
            <th
              scope="row"
              class="text-center"
            />

            <!-- ---------------------------- TH RFID[Tag] -------------------------- -->
            <th
              scope="row"
              class="text-center bg-purple-lighten-5"
            />
            <th
              scope="row"
              class="text-center bg-purple-lighten-5"
            >
              RFID[Tag]
            </th>
            <th
              scope="row"
              class="text-center bg-purple-lighten-5"
            />

            <!-- ---------------------------- Barcode -------------------------- -->
            <th
              scope="row"
              class="text-center bg-green-accent-1"
            />
            <th
              scope="row"
              class="text-center bg-green-accent-1"
            >
              {{ $t('Barcode') }}
            </th>
            <th
              scope="row"
              class="text-center bg-green-accent-1"
            />

            <!-- ---------------------------- Store Area -------------------------- -->
            <th
              scope="row"
              class="text-center"
            />
            <th
              scope="row"
              class="text-center"
            >
              <span>{{ $t('Store Area') }}</span>
            </th>
            <th
              scope="row"
              class="text-center"
            />
            <th
              scope="row"
              class="text-center"
            />
          </tr>
        </thead>

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
              {{ $t('Product Categories') }}
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
                            :label="$t('Product Categories')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
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
              class="text-center"
            >
              {{ $t('Product Group') }}
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
                            :label="$t('Product Group')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
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
              class="text-center"
            >
              {{ $t('Product Area') }}
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
                            :label="$t('Product Area')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
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
              class="text-center"
            >
              {{ $t('Barcode') }}
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
                            :label="$t('Barcode')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
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
              class="text-center"
            >
              {{ $t('Product Code') }}
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
                            :label="$t('Product Code')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
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
              class="text-center"
            >
              {{ $t('Product Name') }}
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
                            :label="$t('Product Name')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
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
                            v-model="searchByProductNameFilter"
                            class="mt-4"
                            :label="$t('Counting Unit')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
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
              class="text-center"
            >
              {{ $t('Lot/Batch') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
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
                            v-model="searchByProductNameFilter"
                            class="mt-4"
                            :label="$t('Lot/Batch')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
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
            <!-- ---------------------------- children TH RFID[Tag] -------------------------- -->
            <th
              scope="row"
              class="text-center bg-purple-lighten-5"
            >
              {{ $t('The number[pre count]') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                icon="mdi-unfold-more-horizontal"
                color="primary"
                @click="toggleSortType('sortByTags')"
              />
            </th>
            <th
              scope="row"
              class="text-center bg-purple-lighten-5"
            >
              {{ $t('The number[count]') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                icon="mdi-unfold-more-horizontal"
                color="primary"
                @click="toggleSortType('sortByTags')"
              />
            </th>
            <th
              scope="row"
              class="text-center bg-purple-lighten-5"
            >
              {{ $t('The number[different parts]') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                icon="mdi-unfold-more-horizontal"
                color="primary"
                @click="toggleSortType('sortByTags')"
              />
            </th>
            <!-- ---------------------------- children Barcode -------------------------- -->
            <th
              scope="row"
              class="text-center bg-green-accent-1"
            >
              {{ $t('The number[pre count]') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                icon="mdi-unfold-more-horizontal"
                color="primary"
                @click="toggleSortType('sortByTags')"
              />
            </th>
            <th
              scope="row"
              class="text-center bg-green-accent-1"
            >
              {{ $t('The number[count]') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                icon="mdi-unfold-more-horizontal"
                color="primary"
                @click="toggleSortType('sortByTags')"
              />
            </th>
            <th
              scope="row"
              class="text-center bg-green-accent-1"
            >
              {{ $t('The number[different parts]') }} 
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                icon="mdi-unfold-more-horizontal"
                color="primary"
                @click="toggleSortType('sortByTags')"
              />
            </th>
            <!-- ---------------------------- children Store Area -------------------------- -->
            <th
              scope="row"
              class="text-center"
            >
              {{ $t('Warehouse') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
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
                            v-model="searchByProductNameFilter"
                            class="mt-4"
                            :label="$t('Warehouse')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
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
              class="text-center"
            >
              {{ $t('Zone') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
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
                            v-model="searchByProductNameFilter"
                            class="mt-4"
                            :label="$t('Zone')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
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
              class="text-center"
            >
              {{ $t('Area') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuAreaArea"
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
                            :label="$t('Area')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
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
              class="text-center"
            >
              {{ $t('Sub Area') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuSubAreaArea"
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
                            :label="$t('Sub Area')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
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
          </tr>
        </thead>
        

        <!-- 👉 table body -->
        <tbody>
          <tr
            v-for="(product, index) in products"
            :key="index"
          >
            <!-- 👉 Ordinal Number -->
            <td class="text-start">
              {{ index+1 }}
            </td>

            <!-- 👉 Product Catagories -->
            <td class="text-start">
              <VImg
                v-if="product.image"
                :width="75"
                aspect-ratio="16/9"
                cover
                :src="product.image"
              />
            </td>

            <!-- 👉 Product Group -->
            <td class="text-start">
              {{ product.categoryName }}
            </td>

            <!-- 👉 product Area -->
            <td class="text-start">
              {{ product.typeName }}
            </td>

            <!-- 👉 Barcode -->
            <td class="text-start">
              {{ product.subTypeName }}
            </td>

            <!-- 👉 Barcode -->
            <td class="text-center">
              {{ product.barcode }}
            </td>

            <!-- 👉 Product Code -->
            <td class="text-center">
              {{ product.productId }}
            </td>

            <!-- 👉 Product Name -->
            <td class="text-start">
              {{ product.productName }}
            </td>
            <!-- 👉 Total quantity of products -->
            <td class="text-center">
              {{ product.qty }}
            </td>
            <!-- ---------------------------- TD RFID[Tag] -------------------------- -->
            <!-- 👉 RFID[Tag] -->
            <td class="text-end bg-purple-lighten-5">
              {{ product.tags }}
            </td>
            <!-- 👉 RFID[Tag] -->
            <td class="text-end bg-purple-lighten-5">
              {{ product.tags }}
            </td>
            <!-- 👉 RFID[Tag] -->
            <td class="text-end bg-purple-lighten-5">
              {{ product.tags }}
            </td>
            <!-- ---------------------------- Barcode -------------------------- -->
            <!-- 👉 RFID[Tag] -->
            <td class="text-end bg-green-accent-1">
              {{ product.tags }}
            </td>
            <!-- 👉 RFID[Tag] -->
            <td class="text-end bg-green-accent-1">
              {{ product.tags }}
            </td>
            <!-- 👉 RFID[Tag] -->
            <td class="text-end bg-green-accent-1">
              {{ product.tags }}
            </td>
            <!-- ---------------------------- Store Area -------------------------- -->
            <!-- 👉 RFID[Tag] -->
            <td class="text-end ">
              {{ product.tags }}
            </td>
            <!-- 👉 RFID[Tag] -->
            <td class="text-end ">
              {{ product.tags }}
            </td>
            <!-- 👉 RFID[Tag] -->
            <td class="text-end ">
              {{ product.tags }}
            </td>
            <!-- 👉 RFID[Tag] -->
            <td class="text-end ">
              {{ product.tags }}
            </td>
          </tr>
        </tbody>
      </VTable>

      <VDivider />

  
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

  /* สไตล์อื่นๆ ตามต้องการ */
}

@media screen and (min-width: 1201px) and (max-width: 1399px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-small-btn-search {
    font-size: 1rem;
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

  /* สไตล์อื่นๆ ตามต้องการ */
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>

