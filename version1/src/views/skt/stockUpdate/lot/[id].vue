<script setup>
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import axiosIns from '@axios'

import { ref, watchEffect  } from 'vue'
import { useRoute } from 'vue-router'


const item = ref([])
const route = useRoute()


//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

// นำค่าที่ได้ไปใช้งานต่อได้ตามต้องการ
// console.log('productIdImport ID:', route.query.productId)
// console.log('unitIdImport ID:', route.query.UnitId)
// console.log('id ID view:', route.params.id)

// const perPage = ref('10')

// const urlApi = ref('https://webapi.easetrackwms.com')

// const urlApi = ref('https://vm02webapi.easetrackwms.com')
// const urlApi = ref('https://vm03webapi.easetrackwms.com')

import { urlApi } from '@/api'

const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')
const whereHouseStock = ref(route.query.warehouseStock)
const whereHouse = ref(route.query.warehouseStock)
const productId = ref(route.query.productId)
const UnitId = ref(route.query.UnitId)
const lotMaster = ref(route.query.LotMas)
const zoneId = ref(route.query.ZoneId)
const areaId = ref(route.query.AreaId)
const subAreaId = ref(route.query.subAreaId)

const products = ref([])
const productsLocation = ref([])
const productsTest = ref([])

//-------------------- variable for Pagination ----------------------------------------
const perPage = ref(10)
const page = ref(0)
const totalCount = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)

//------------------------ Model Name for Search By ------------------------------
const searchByStock = ref('')
const searchByZone = ref('')
const searchByArea = ref('')
const searchBySubArea = ref('')
const searchByLot = ref('')

//----------------------- Variable for Menu Search By -------------------------
const menuStock= ref( false)
const menuZone = ref( false)
const menuArea = ref( false)
const menuSubArea = ref( false)
const menuLot = ref( false)

//----------------------  SortBy Variable  -------------------------------------
const sortByStock = ref('')
const sortByZone = ref('')
const sortByArea = ref('')
const sortBySubArea = ref('')
const sortByLot = ref('')
const sortByQty = ref('')
const sortByTags = ref('')
const sortByNonTags = ref('')

const toggleSortType = sortBy => {
  const sortRefs = { sortByQty, sortByTags, sortByNonTags }

  for (const key in sortRefs) {
    if (key === sortBy) {
      sortRefs[key].value = sortRefs[key].value === 'asc' ? 'desc' : 'asc'
    } else {
      sortRefs[key].value = '' // ล้างค่าที่ไม่เกี่ยวข้อง
    }

    // console.log("Sort type:",sortRefs[key],'Ket',[key])
  }

  
}

//--------------------------------------------------------------------------------
const remarksProductLot = ref('')
const serialProduct = ref(route.query.serialCode)

const GetProduct = () => {

  axiosIns.get(`${urlApi.value}/api/v1/StockUpdate/ByProduct/Batch?page=`+currentPage.value+`&perPage=`+rowPerPage.value, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
    params: {
      //------------------------- request -------------------------------------------
      productId: productId.value,
      unitId: UnitId.value,
      lotMaster: lotMaster.value,
      zoneId: zoneId.value,
      areaId: areaId.value,
      subAreaId: subAreaId.value,
      serialNo: serialProduct.value,

      // ---------------------  Params For Search By ----------------------------------
      'searchByStock': searchByStock.value,
      'searchByZone': searchByZone.value,
      'searchByArea': searchByArea.value,
      'searchBySubArea': searchBySubArea.value,
      'searchByLot': searchByLot.value,

      // ---------------------  Params For Sort By ----------------------------------
      'sortByStock': sortByStock.value,
      'sortByZone': sortByZone.value,
      'sortByArea': sortByArea.value,
      'sortBySubArea': sortBySubArea.value,
      'sortByLot': sortByLot.value,
      'sortByQty': sortByQty.value,
      'sortByTags': sortByTags.value,
      'sortByNonTags': sortByNonTags.value,
    },
  }, {})
    .then(response => {

      // console.log('product response.data.locations view: ', response.data.locations)

      // console.log('product response.data view: ', response.data)

      products.value = response.data.locations.items
      productsLocation.value = response.data

      totalCount.value = response.data.locations.totalCount
      currentPage.value = response.data.locations.page
      totalPage.value = response.data.locations.totalPages
      rowPerPage.value = response.data.locations.perPage
      remarksProductLot.value = response.data.locations.items

      console.log('remarksProductLot.value: ', remarksProductLot.value)
      console.log('products.value: ', products.value)
      console.log('productsLocation.value.Lot: ', productsLocation.value.remark)

      // console.log('products.value At Id: ',products.value)

    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })
}

watch(GetProduct)

const onSubmitSeeProduct =() => {
  GetProduct()
}

watchEffect(GetProduct)

// 👉 ------------------------- watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})


// 👉 ----------------  Computing pagination data
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

const isDialogVisible = ref(false)

//--------------------------------  format commas for QTY.-----------------
const numberWithCommas = number => {
  if (number !== undefined && number !== null) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  
  return ''
}

// -------------------------------------- Export Bar Excel - --------------------------------

const stockUpdateExcel = async () => {
  try {
    const response = await axiosIns.post(`${urlApi.value}/api/v1/StockUpdate/ByProduct/Batch/Excel?`+`&productId=`+productId.value+`&unitId=`+UnitId.value+`&lotMaster=`+lotMaster.value+`&zoneId=`+zoneId.value+`&areaId=`+areaId.value+`&subAreaId=`+subAreaId.value, {}, {
      headers: {
        'accept': '*/*',
        'x-location': `${whereHouse.value}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
      responseType: 'blob', // ให้เซิร์ฟเวอร์รีเทิร์น blob สำหรับไฟล์ Excel
    })

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

    const fileName = `stock_update_By_Product_Batch_${productsLocation.value.productName}_${dateString}.xlsx` // ตั้งชื่อไฟล์โดยรวมกับวันที่

    // สร้างลิงก์สำหรับดาวน์โหลดไฟล์ Excel
    const link = document.createElement('a')

    link.href = url
    link.setAttribute('download', fileName) // ตั้งชื่อไฟล์ที่จะดาวน์โหลด
    document.body.appendChild(link)
    link.click()

    // ลบ URL หลังจากดาวน์โหลดเสร็จเรียบร้อยแล้ว
    window.URL.revokeObjectURL(url)
  } catch (error) {
    // จัดการข้อผิดพลาด
    console.error('Error:', error)
  }
}


const onClickExportExcel = () => {
  stockUpdateExcel()
}

//---------------- check company name -------------------------------------
const nameCompany = localStorage.getItem('nameCompany')
const configExpiryDate = localStorage.getItem('configsShowExpiryDate')

const serialNoIsVisible = ref(false)
const expiryDateIsVisible = ref(false)

const checkSeritalNo = () => {
  if (nameCompany === 'บริษัท บิ๊กยา จำกัด') {
    serialNoIsVisible.value = true
    expiryDateIsVisible.value = true
  } else {
    serialNoIsVisible.value = false
    expiryDateIsVisible.value = false
  }
}

watch(checkSeritalNo)


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

const formatDecimal = decimal => {
  const configsShowDigit = localStorage.getItem('configsShowDigit')
  if (configsShowDigit == 'true') {
    return Math.ceil(decimal)
  } else {
    return decimal
  }
}

const showExpansionDialog = ref(false)
</script>

<template>
  <div
    v-if="true"
    class="py-2"
  >
    <VCard
      height="40px"
      class="bg-primary"
    >
      <VCardTitle class="pa-1">
        <div class="d-flex justify-start align-center">
          <IconBtn
            class="cursor-pointer"
            color="#FFFFFF"
            :to="{ name: 'skt-stockUpdate-view-id',query: $route.query
            }"
          >
            <VIcon
              size="30"
              icon="ri-arrow-left-circle-fill"
            />
          </IconBtn>
          <h4 class="text-white">
            {{ $t('Stock Update - Details - Lot') }}
          </h4>
        </div>
      </VCardTitle>
    </VCard>
  </div>

  <!-- -------------------------------------- Details Body Product ------------------------------------  -->
  <section>
    <VRow>
      <!-- ------------------------------- Image Product -------------------------    -->
      <VCol
        cols="12"
        sm="12"
        xs="12"
        lg="1"
      >
        <VCard
          class="mx-auto card-image"
          max-width="100%"
          height="120px"
          :image="productsLocation.image"
          theme="dark"
          @click="isDialogVisible = true"
        />

        <div>
          <section>
            <VDialog
              v-model="isDialogVisible"
              persistent
              class="v-dialog-sm"
              max-width="100%"
            >
              <VCard>
                <VCardTitle class="d-flex justify-space-between bg-primary">
                  <div>
                    <span class="text-white">{{ $t('Image Product') }}</span>
                  </div>
                  <div>
                    <IconBtn
                      size="30"
                      @click="isDialogVisible = false"
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
                  :src="productsLocation.image"
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
                            }}:&nbsp;</span>&nbsp;{{ productsLocation.productName }}<br>
                            <span style="font-size: large; font-weight: 900;">{{
                              $t("Code")
                            }}:&nbsp;</span>&nbsp;{{ productsLocation.productId }}<br>
                            <span style="font-size: large; font-weight: 900;">{{
                              $t("Barcode")
                            }}:&nbsp;</span>&nbsp;{{ productsLocation.barcode }}<br>
                          </VCol>
                          <VCol
                            cols="12"
                            lg="6"
                          >
                            <span style="font-size: large; font-weight: 900;">{{
                              $t("Categories")
                            }}:&nbsp;</span>&nbsp;{{ productsLocation.categoryName }}<br>
                            <span style="font-size: large; font-weight: 900;">{{
                              $t("Group")
                            }}:&nbsp;</span>&nbsp;{{ productsLocation.typeName }}<br>
                            <span style="font-size: large; font-weight: 900;">{{
                              $t("Sup Group")
                            }}:&nbsp;</span>&nbsp;{{ productsLocation.subTypeName }}<br>
                            <span style="font-size: large; font-weight: 900;">{{
                              $t("Total")
                            }}:&nbsp;</span><span v-if="productsLocation.qty">&nbsp;{{ (formatDecimal(productsLocation.qty)).toLocaleString('en-US') }} {{ productsLocation.unitName }}<br><br></span>
                          </VCol>
                        </VRow>
                        <span style="font-size: large; font-weight: 900;">{{
                          $t("Details ")
                        }} :</span>&nbsp;{{ productsLocation.productNam }}
                      </div>
                    </VCardText>
                  </div>
                </VExpandTransition>
              </VCard>
            </VDialog>
          </section>
        </div>
      </VCol>
      <!-- ------------------------------- Details Product -------------------------    -->
      <VCol
        cols="12"
        xs="12"
        sm="12"
        lg="8"
        class="custom-details-product"
      >
        <!--  Catagories Product | Secondary product categories | Sub product categories   -->
        <VCard
          height="200"
          class="pa-4"
        >
          <!--  Catagories Product | Secondary product categories | Sub product categories   -->
          <VRow class="pt-1">
            <!-- ------------------------------- Catagories Product -------------------------    -->
            <VCol
              cols="12"
              sm="4"
              style="padding: 10px;"
            >
              <VRow>
                <VCol
                  cols="4"
                  lg="4"
                  xs="6"
                  sm="5"
                  style="padding: 1px;"
                >
                  <p
                    class="text-end"
                    style="font-size: 0.8rem;"
                  >
                    {{ $t('product categories') }}:&nbsp;
                  </p>
                </VCol>
                <VCol
                  cols="8"
                  lg="8"
                  xs="6"
                  sm="7"
                  style="padding: 1px;"
                >
                  <p
                    class="text-start"
                    style="font-size: 0.8rem;"
                  >
                    {{ productsLocation.categoryName }}
                    <VProgressLinear
                      v-if="productsLocation.categoryName"
                      model-value="100"
                      color="primary"
                      height="2"
                    />
                  </p>
                </VCol>
              </VRow>
            </VCol>
            <!-- ------------------------------- Secondary product categories Product -------------------------    -->
            <VCol
              cols="12"
              sm="4"
              style="padding: 10px;"
            >
              <VRow class="pt-0">
                <!-- --------------------Label--------------- -->
                <VCol
                  cols="4"
                  lg="4"
                  sm="5"
                  style="padding: 1px;"
                >
                  <p
                    class="text-end"
                    style="font-size: 0.8rem;"
                  >
                    {{ $t('Product Group') }}:&nbsp;
                  </p>
                </VCol>
                <!-- --------------------Input From APi-------------- -->
                <VCol
                  cols="8"
                  lg="8"
                  sm="7"
                  style="padding: 1px;"
                >
                  <p
                    class="text-start"
                    style="font-size: 0.8rem;"
                  >
                    {{ productsLocation.typeName }}
                    <VProgressLinear
                      v-if="productsLocation.typeName"
                      model-value="100"
                      color="primary"
                      height="2"
                    />
                  </p>
                </VCol>
              </VRow>
            </VCol>
            <!-- ------------------------------- Sub product categories Product -------------------------    -->
            <VCol
              cols="12"
              sm="4"
              style="padding: 10px;"
            >
              <VRow>
                <!-- --------------------Label--------------- -->
                <VCol
                  cols="4"
                  lg="4"
                  sm="5"
                  style="padding: 1px;"
                >
                  <p
                    class="text-end"
                    style="font-size: 0.8rem;"
                  >
                    {{ $t('Sub product categories') }}:&nbsp;
                  </p>
                </VCol>
                <!-- --------------------Input From APi-------------- -->
                <VCol
                  cols="8"
                  lg="8"
                  sm="7"
                  style="padding: 1px;"
                >
                  <p
                    class="text-start"
                    style="font-size: 0.8rem;"
                  >
                    {{ productsLocation.subTypeName }}
                    <VProgressLinear
                      v-if="productsLocation.subTypeName"
                      model-value="100"
                      height="2"
                      color="primary"
                    />
                  </p>
                </VCol>
              </VRow>
            </VCol>
          </VRow>

          <!--  Barcode | Product code | Product Name   -->
          <VRow style="padding: 1px;">
            <!-- ------------------------------- Barcode -------------------------    -->
            <VCol
              cols="12"
              sm="4"
              style="padding: 10px;"
            >
              <VRow>
                <VCol
                  cols="4"
                  lg="4"
                  sm="5"
                  style="padding: 1px;"
                >
                  <p
                    class="text-end"
                    style="font-size: 0.8rem;"
                  >
                    {{ $t('Barcode') }}:&nbsp;
                  </p>
                </VCol>
                <VCol
                  cols="8"
                  lg="8"
                  sm="7"
                  style="padding: 1px;"
                >
                  <p
                    class="text-start"
                    style="font-size: 0.8rem;"
                  >
                    {{ productsLocation.barcode }}
                    <VProgressLinear
                      v-if="productsLocation.barcode"
                      model-value="100"
                      height="2"
                      color="primary"
                    />
                  </p>
                </VCol>
              </VRow>
            </VCol>
            <!-- ------------------------------- Product code -------------------------    -->
            <VCol
              cols="12"
              sm="4"
              style="padding: 10px;"
            >
              <VRow>
                <VCol
                  cols="4"
                  lg="4"
                  sm="5"
                  style="padding: 1px;"
                >
                  <p
                    class="text-end"
                    style="font-size: 0.8rem;"
                  >
                    {{ $t('Product Code') }}:&nbsp;
                  </p>
                </VCol>
                <VCol
                  cols="8"
                  lg="8"
                  sm="7"
                  style="padding: 1px;"
                >
                  <p
                    class="text-start"
                    style="font-size: 0.8rem;"
                  >
                    {{ productsLocation.productId }}
                    <VProgressLinear
                      v-if="productsLocation.productId"
                      model-value="100"
                      height="2"
                      color="primary"
                    />
                  </p>
                </VCol>
              </VRow>
            </VCol>
            <!-- ------------------------------- Product Name -------------------------    -->
            <VCol
              cols="12"
              sm="4"
              style="padding: 10px;"
            >
              <VRow>
                <VCol
                  cols="4"
                  lg="4"
                  sm="5"
                  style="padding: 1px;"
                >
                  <p
                    class="text-end"
                    style="font-size: 0.8rem;"
                  >
                    {{ $t('Product Name') }}:&nbsp;
                  </p>
                </VCol>
                <VCol
                  cols="8"
                  lg="8"
                  sm="7"
                  style="padding: 1px;"
                >
                  <p
                    class="text-start"
                    style="font-size: 0.8rem;"
                  >
                    {{ productsLocation.productName }}
                    <VProgressLinear
                      v-if="productsLocation.productName"
                      model-value="100"
                      height="2"
                      color="primary"
                      inset
                    />
                  </p>
                </VCol>
              </VRow>
            </VCol>
          </VRow>

          <!--  Counting unit | Product Size | Product Color   -->
          <VRow style="padding: 1px;">
            <!-- ------------------------------- Counting unit -------------------------    -->
            <VCol
              cols="12 "
              sm="4"
              style="padding: 10px;"
            >
              <VRow class="">
                <VCol
                  cols="4"
                  lg="4"
                  sm="5"
                  style="padding: 1px;"
                >
                  <p
                    class="text-end"
                    style="font-size: 0.8rem;"
                  >
                    {{ $t('Counting Unit') }}:&nbsp;
                  </p>
                </VCol>
                <VCol
                  cols="8"
                  lg="8"
                  sm="7"
                  style="padding: 1px;"
                >
                  <p
                    class="text-start "
                    style="font-size: 0.8rem;"
                    density="compact"
                  >
                    {{ productsLocation.unitName }}
                    <VProgressLinear
                      v-if="productsLocation.unitName"
                      model-value="100"
                      density="compact"
                      height="2"
                      color="primary"
                    />
                  </p>
                </VCol>
              </VRow>
            </VCol>
            <!-- ------------------------------- Product Size -------------------------    -->
            <VCol
              cols="12"
              sm="4"
              style="padding: 10px;"
            >
              <VRow>
                <VCol
                  cols="4"
                  lg="4"
                  sm="5"
                  style="padding: 1px;"
                >
                  <p
                    class="text-end"
                    style="font-size: 0.8rem;"
                  >
                    {{ $t('Size') }}:&nbsp;
                  </p>
                </VCol>
                <VCol
                  cols="8"
                  lg="8"
                  sm="7"
                  style="padding: 1px;"
                >
                  <p
                    class="text-start"
                    style="font-size: 0.8rem;"
                  >
                    {{ productsLocation.size }}
                    <VProgressLinear
                      v-if="productsLocation.size"
                      model-value="100"
                      height="2"
                      color="primary"
                    />

                    <VProgressLinear
                      v-if="!productsLocation.size"
                      class="bottom-progress"
                      model-value="0"
                      height="2"
                      color="primary"
                    />
                  </p>
                </VCol>
              </VRow>
            </VCol>
            <!-- ------------------------------- Product Color -------------------------    -->
            <VCol
              cols="12"
              sm="4"
              style="padding: 10px;"
            >
              <VRow>
                <VCol
                  cols="4"
                  lg="4"
                  sm="5"
                  style="padding: 1px;"
                >
                  <p
                    class="text-end"
                    style="font-size: 0.8rem;"
                  >
                    {{ $t('Color') }}:&nbsp;
                  </p>
                </VCol>
                <VCol
                  cols="8"
                  lg="8"
                  sm="7"
                  style="padding: 1px;"
                >
                  <p
                    class="text-start"
                    style="font-size: 0.8rem;"
                  >
                    {{ productsLocation.color }}
                    <VProgressLinear
                      v-if="productsLocation.color"
                      model-value="100"
                      height="2"
                      color="primary"
                    />
                  </p>
                </VCol>
              </VRow>
            </VCol>
          </VRow>

          <!--  stockName | areaName| Product Color   -->
          <VRow style="padding: 1px;">
            <!-- ------------------------------- stockName -------------------------    -->
            <VCol
              cols="12 "
              sm="4"
              style="padding: 10px;"
            >
              <VRow class="">
                <VCol
                  cols="4"
                  lg="4"
                  sm="5"
                  style="padding: 1px;"
                >
                  <p
                    class="text-end"
                    style="font-size: 0.8rem;"
                  >
                    {{ $t('Warehouse') }}:&nbsp;
                  </p>
                </VCol>
                <VCol
                  cols="8"
                  lg="8"
                  sm="7"
                  style="padding: 1px;"
                >
                  <p
                    class="text-start "
                    style="font-size: 0.8rem;"
                    density="compact"
                  >
                    {{ productsLocation.stockName }}
                    <VProgressLinear
                      v-if="productsLocation.stockName"
                      model-value="100"
                      density="compact"
                      height="2"
                      color="primary"
                    />
                  </p>
                </VCol>
              </VRow>
            </VCol>
            <!-- ------------------------------- zoneName -------------------------    -->
            <VCol
              cols="12"
              sm="4"
              style="padding: 10px;"
            >
              <VRow>
                <VCol
                  cols="4"
                  lg="4"
                  sm="5"
                  style="padding: 1px;"
                >
                  <p
                    class="text-end"
                    style="font-size: 0.8rem;"
                  >
                    {{ $t('Zone') }}:&nbsp;
                  </p>
                </VCol>
                <VCol
                  cols="8"
                  lg="8"
                  sm="7"
                  style="padding: 1px;"
                >
                  <p
                    class="text-start"
                    style="font-size: 0.8rem;"
                  >
                    {{ productsLocation.zoneName }}
                    <VProgressLinear
                      v-if="productsLocation.zoneName"
                      model-value="100"
                      height="2"
                      color="primary"
                    />
                  </p>
                </VCol>
              </VRow>
            </VCol>
            <!-- ------------------------------- areaName -------------------------    -->
            <VCol
              cols="12"
              sm="4"
              style="padding: 10px;"
            >
              <VRow>
                <VCol
                  cols="4"
                  lg="4"
                  sm="5"
                  style="padding: 1px;"
                >
                  <p
                    class="text-end"
                    style="font-size: 0.8rem;"
                  >
                    {{ $t('Area') }}:&nbsp;
                  </p>
                </VCol>
                <VCol
                  cols="8"
                  lg="8"
                  sm="7"
                  style="padding: 1px;"
                >
                  <p
                    class="text-start"
                    style="font-size: 0.8rem;"
                  >
                    {{ productsLocation.areaName }}
                    <VProgressLinear
                      v-if="productsLocation.areaName"
                      model-value="100"
                      height="2"
                      color="primary"
                    />
                  </p>
                </VCol>
              </VRow>
            </VCol>
          </VRow>

          <!--  subAreaName | Lot Master | Product Color   -->
          <VRow style="padding: 1px;">
            <!-- ------------------------------- subAreaName -------------------------    -->
            <VCol
              cols="12 "
              sm="4"
              style="padding: 10px;"
            >
              <VRow class="">
                <VCol
                  cols="4"
                  lg="4"
                  sm="5"
                  style="padding: 1px;"
                >
                  <p
                    class="text-end"
                    style="font-size: 0.8rem;"
                  >
                    {{ $t('Sub Area') }}:&nbsp;
                  </p>
                </VCol>
                <VCol
                  cols="8"
                  lg="8"
                  sm="7"
                  style="padding: 1px;"
                >
                  <p
                    class="text-start "
                    style="font-size: 0.8rem;"
                    density="compact"
                  >
                    {{ productsLocation.subAreaName }}
                    <VProgressLinear
                      v-if="productsLocation.subAreaName"
                      model-value="100"
                      density="compact"
                      height="2"
                      color="primary"
                    />
                  </p>
                </VCol>
              </VRow>
            </VCol>
            <!-- ------------------------------- Lot Master -------------------------    -->
            <VCol
              cols="12 "
              sm="4"
              style="padding: 10px;"
            >
              <VRow class="">
                <VCol
                  cols="4"
                  lg="4"
                  sm="5"
                  style="padding: 1px;"
                >
                  <p
                    class="text-end"
                    style="font-size: 0.8rem;"
                  >
                    {{ $t('Lot') }}:&nbsp;
                  </p>
                </VCol>
                <VCol
                  cols="8"
                  lg="8"
                  sm="7"
                  style="padding: 1px;"
                >
                  <p
                    class="text-start "
                    style="font-size: 0.8rem;"
                    density="compact"
                  >
                    {{ lotMaster }}
                    <VProgressLinear
                      v-if="lotMaster"
                      model-value="100"
                      density="compact"
                      height="2"
                      color="primary"
                    />
                  </p>
                </VCol>
              </VRow>
            </VCol>
            <!-- ------------------------------- Serial -------------------------    -->
          </VRow>
        </VCard>
      </VCol>
      <!-- ------------------------------- Total Product and Button Export -------------------------    -->
      <VCol
        cols="12"
        xs="12"
        sm="12"
        lg="3"
        class="custom-total-all"
      >
        <!-- ------------------------------- Total Product  -------------------------    -->
        <VCard height="120">
          <VRow style="padding: 14px;">
            <VCol
              style="padding: 5px;"
              cols="4"
              lg="4"
            >
              <VRow>
                <VCol
                  style="padding: 16px;"
                  cols="12"
                  class="custom-tag-total"
                >
                  <p style="margin: -0.5px; font-size: 15px;">
                    <strong>{{ $t('TolTalQTY') }}:</strong>
                  </p>
                  <p
                    v-if="checkRFID"
                    style="margin: -0.5px; font-size: 15px;"
                  >
                    <strong>Tag:</strong> {{ (formatDecimal(productsLocation.tags)).toLocaleString('en-US') }}
                  </p>
                  <p
                    v-if="checkRFID"
                    style="margin-top: -0.5px; margin-bottom: -0.5px; font-size: 15px;"
                  >
                    <strong>Non-Tag:</strong> {{ (formatDecimal(productsLocation.nonTags)).toLocaleString('en-US') }}
                  </p>
                </VCol>
                <VCol
                  style="padding: 8px;"
                  cols="12"
                />
              </VRow>
            </VCol>
            <VCol
              style="padding: 4px;"
              cols="8"
              lg="8"
              class="custom-total-product"
            >
              <VRow>
                <VCol
                  style="padding: 8px;"
                  cols="12"
                  class="custom-total-product"
                >
                  <VCard
                    class="bg-yellow-lighten-4 text-center"
                    style="padding: 10px; margin: 4px; padding-inline: 1rem;"
                  >
                    <span
                      v-if="productsLocation.qty"
                      class="text-center text-grey-darken-4 text-h4 font-weight-bold custom-text-total"
                    >{{ (formatDecimal(productsLocation.qty)).toLocaleString('en-US') }} {{ productsLocation.unitName }}</span>
                  </VCard>
                </VCol>
                
                <VCol
                  style="padding: 10px; margin-top: -12px; margin-bottom: 6px;"
                  cols="12"
                  class="custom-total-export"
                >
                  <VBtn
                    style="padding-inline: 6rem;"
                    color="warning"
                    size="smaller"
                    @click="stockUpdateExcel"
                  >
                    <img src="/src/assets/images/icons/vscode-icons_file-type-excel2.png">
                    {{ $t('Export file') }}
                  </VBtn>
                </VCol>
              </VRow>
            </VCol>
          </VRow>
        </VCard>
      </VCol>
    </VRow>
  </section>

  <!-- -------------------------------------- Table Product ------------------------------------  -->
  <section>
    <VCard class="mb-4 mt-4">
      <VTable class="text-no-wrap table-header-bg rounded-0">
        <!-- 👉 table head -->
        <thead>
          <tr>
            <th class="text-center px-1">
              {{ $t('No.') }}
            </th>
            <th class="text-start px-1">
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
                            v-model="searchByLot"
                            class="mt-4"
                            :label="$t('Lot/Batch')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="6"
                        >
                          <VBtn
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
                            style="width: 100%;"
                            type="submit"
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
              v-if="!serialNoIsVisible"
              class="text-start px-1"
            >
              {{ $t('Serial') }}
            </th>
            <th
              v-if="expiryDateIsVisible"
              class="text-start px-1"
            >
              {{ $t('ExpiryDate') }}
            </th>
            <th
              v-if="true"
              class="text-start px-1"
            >
              {{ $t('Remark') }}
            </th>
            <th
              v-if="checkRFID"
              class="text-end px-1"
            >
              {{ $t('ManyTags') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                icon="mdi-pan-vertical"
                color="primary"
                @click="toggleSortType('sortByTags')"
              />
            </th>
            <th v-if="checkRFID" class="text-end px-1">
              {{ $t('ManyNonTags') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                icon="mdi-pan-vertical"
                color="primary"
                @click="toggleSortType('sortByNonTags')"
              />
            </th>
            <th class="text-end px-1">
              {{ $t('QTY') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                icon="mdi-pan-vertical"
                color="primary"
                @click="toggleSortType('sortByQty')"
              />
            </th>
          </tr>
        </thead>

        <!-- 👉 table body Product x-location -->
        <tbody style="text-align: center;">
          <tr
            v-for="(product, index) in products"
            :key="index"
          >
            <!-- 👉 Ordinal Number -->
            <td class="px-1">
              {{ (currentPage - 1) * rowPerPage + index + 1 }}
            </td>

            <!-- 👉 Lot/bach -->
            <td class="text-start px-1">
              {{ product.lotBatch }}
            </td>

            <!--  Total quantity of products -->
            <td
              v-if="!serialNoIsVisible"
              class="text-start px-1"
            >
              {{ product.serialNo }}
            </td>

            <!--  Total quantity of products -->
            <td
              v-if="expiryDateIsVisible"
              class="text-start px-1"
            >
              {{ product.serialNo }}expiryDate
            </td>

            <!--  Total quantity of products -->
            <td
              v-if="true"
              class="text-start px-1"
            >
              {{ product.remark }}
            </td>

            <!--  Number(Tag) -->
            <td
              v-if="checkRFID"
              class="text-end px-6"
            >
              <span v-if="product.tags">{{ (formatDecimal(product.tags)).toLocaleString('en-US') }}</span> 
            </td>

            <!--  Number(Non-Tag) -->
            <td v-if="checkRFID" class="text-end px-6">
              <span v-if="product.nonTags"> {{ (formatDecimal(product.nonTags)).toLocaleString('en-US') }}</span>
            </td>
            <!--  Total quantity of products -->
            <td class="text-end px-6">
              <span v-if="product.qty">{{ (formatDecimal(product.qty)).toLocaleString('en-US') }}</span> 
            </td>
          </tr>
        </tbody>
      </VTable>

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
            size="small"
            :total-visible="1"
            :length="totalPage"
            @next="selectedRows = []"
            @prev="selectedRows = []"
          />
        </div>
      </VCardText>
    </VCard>

    <VCard v-if="false">
      <VCardTitle>{{ $t('Remark') }}</VCardTitle>
      <VCardText>
        <VTextarea
          v-model="textareaValue"
          clearable
          clear-icon="ri-close-line"
          label="Text"
          placeholder="Placeholder Text"
        />
      </VCardText>
    </VCard>
  </section>
</template>

<style lang="scss">
@media screen and (min-width: 1301px) and (max-width: 1400px) {
  /* New */
  .custom-total-product {
    padding: 10px !important;
  }

  .custom-total-product .v-card {
    padding: 6px !important;
  }

  .custom-total-export {
    padding: 12px !important;
    margin-block-end: -2px !important;
    margin-block-start: -16px !important;
  }

  .custom-text-total {
    font-size: 20px !important;
  }

  .custom-total-export .v-btn {
    padding-inline: 4rem !important;
  }

  .custom-details-product .v-card {
    block-size: auto !important;
  }

  .custom-total-all .v-card {
    block-size: auto !important;
  }
}

@media screen and (min-width: 1201px) and (max-width: 1299px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .custom-total-all {
    padding: 10px !important;
  }

  .custom-text-total {
    padding: 1px;
  }

  .custom-btn-export {
    padding-inline: 24rem !important;
  }

  .custom-details-product .v-card {
    block-size: auto !important;
  }

  .custom-total-all .v-card {
    block-size: auto !important;
  }
}

@media screen and (min-width: 1051px) and (max-width: 1200px) {
  /* New */
  .custom-total-product {
    padding: 10px !important;
  }

  .custom-total-export {
    padding: 12px !important;
    margin-block-end: -2px !important;
    margin-block-start: -16px !important;
  }

  .custom-total-export .v-btn {
    padding-inline: 20rem !important;
  }

  .custom-details-product .v-card {
    block-size: auto !important;
  }

  .custom-total-all .v-card {
    block-size: auto !important;
  }
}

@media screen and (min-width: 1000px) and (max-width: 1030px) {
  /* New */
  .custom-total-product {
    padding: 10px !important;
  }

  .custom-total-export {
    padding: 12px !important;
    margin-block-end: -2px !important;
    margin-block-start: -16px !important;
  }

  .custom-total-export .v-btn {
    padding-inline: 18rem !important;
  }

  .custom-details-product .v-card {
    block-size: auto !important;
  }

  .custom-total-all .v-card {
    block-size: auto !important;
  }
}

@media screen and (min-width: 900px) and (max-width: 999px) {
  /* New */
  .custom-total-product {
    padding: 4px !important;
    margin-block-start: 4px !important;
    margin-inline-start: -6px !important;
  }

  .custom-total-product .v-card {
    padding: 2px !important;
  }

  .custom-btn-export {
    padding: 4px !important;
  }

  .custom-total-export .v-btn {
    margin-block-end: 4px !important;
    margin-inline-start: -6px !important;
    padding-inline: 18rem !important;
  }

  .custom-details-product .v-card {
    block-size: auto !important;
  }

  .custom-total-all .v-card {
    block-size: auto !important;
  }
}

@media screen and (min-width: 851px) and (max-width: 899px) {
  /* New */
  .custom-total-product-all {
    padding: 12px !important;
  }

  .custom-total-export {
    padding: 10px !important;
  }

  .custom-total-export .v-btn {
    margin-block-end: 4px !important;
    padding-inline: 15rem !important;
  }

  .custom-total-product .v-card {
    padding: 5px !important;
  }

  .custom-details-product .v-card {
    block-size: auto !important;
  }

  .custom-total-all .v-card {
    block-size: auto !important;
  }
}

@media screen and (min-width: 840px) and (max-width: 850px) {
  /* New */
  .custom-total-product {
    padding: 4px !important;
    margin-block-start: 4px !important;
    margin-inline-start: -6px !important;
  }

  .custom-total-product .v-card {
    padding: 2px !important;
  }

  .custom-btn-export {
    padding: 5px !important;
  }

  .custom-total-export .v-btn {
    margin-inline-start: -8px !important;
    padding-inline: 17rem !important;
  }

  .custom-details-product .v-card {
    block-size: auto !important;
  }

  .custom-total-all .v-card {
    block-size: auto !important;
  }
}

@media screen and (min-width: 810px) and (max-width: 820px) {
  /* New */
  .custom-total-product {
    padding: 10px !important;
  }

  .custom-total-export {
    padding: 12px !important;
    margin-block-end: -2px !important;
    margin-block-start: -16px !important;
  }

  .custom-total-export .v-btn {
    padding-inline: 12.8rem !important;
  }

  .custom-details-product .v-card {
    block-size: auto !important;
  }

  .custom-total-all .v-card {
    block-size: auto !important;
  }
}

@media screen and (min-width: 751px) and (max-width: 799px) {
  /* New */
  .custom-total-product {
    padding: 10px !important;
  }

  .custom-total-export {
    padding: 12px !important;
    margin-block-end: -2px !important;
    margin-block-start: -16px !important;
  }

  .custom-total-export .v-btn {
    padding-inline: 12rem !important;
  }

  .custom-details-product .v-card {
    block-size: auto !important;
  }

  .custom-total-all .v-card {
    block-size: auto !important;
  }
}

@media screen and (min-width: 700px) and (max-width: 750px) {
  /* New */
  .custom-total-product {
    padding: 10px !important;
  }

  .custom-total-export {
    padding: 12px !important;
    margin-block-end: -2px !important;
    margin-block-start: -16px !important;
  }

  .custom-total-export .v-btn {
    padding-inline: 12rem !important;
  }

  .custom-details-product .v-card {
    block-size: auto !important;
  }

  .custom-total-all .v-card {
    block-size: auto !important;
  }
}

@media screen and (min-width: 600px) and (max-width: 699px) {
  /* New */
  .custom-total-product-all {
    padding: 12px !important;
  }

  .custom-total-export {
    padding: 10px !important;
  }

  .custom-total-export .v-btn {
    padding-inline: 12rem !important;
  }

  .custom-details-product .v-card {
    block-size: auto !important;
  }

  .custom-total-all .v-card {
    block-size: auto !important;
  }
}

@media screen and (min-width: 500px) and (max-width: 550px) {
  /* New */
  .custom-total-product {
    padding: 4px !important;
    margin-block-start: 4px !important;
    margin-inline-start: -6px !important;
  }

  .custom-total-product .v-card {
    padding: 2px !important;
  }

  .custom-total-export {
    padding: 6px !important;
    margin-block-end: 12px !important;
    margin-block-start: -2px !important;
    margin-inline-start: -6px !important;
  }

  .custom-total-export .v-btn {
    padding-inline: 8rem !important;
  }

  .custom-details-product .v-card {
    block-size: auto !important;
  }

  .custom-total-all .v-card {
    block-size: auto !important;
  }
}

@media screen and (min-width: 400px) and (max-width: 499px) {
  /* New */
  .custom-total-product {
    padding: 8px !important;
    margin-block-start: 4px !important;
    margin-inline-start: -6px !important;
  }

  .custom-total-product .v-card {
    padding: 2px !important;
  }

  .custom-total-export {
    padding: 6px !important;
    margin-block-end: 12px !important;
    margin-block-start: -2px !important;
    margin-inline-start: -6px !important;
  }

  .custom-details-product .v-card {
    block-size: auto !important;
  }

  .custom-total-all .v-card {
    block-size: auto !important;
  }
}

@media screen and (min-width: 390px) and (max-width: 399px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  .totalScreen {
    margin-block-end: -40px;
    margin-block-start: 2px;
  }

  .custom-text-total {
    block-size: 5px !important;
    font-size: 20px !important;
    margin-block-start: 2px !important;
    padding-inline: 1px !important;
  }

  .custom-total {
    margin-inline-end: 15px !important;
    padding-block: 10px;
  }

  .col-vcard-total {
    padding: 1px;
  }

  /* New */
  .custom-total-product {
    padding: 4px !important;
    margin-block-start: 4px !important;
    margin-inline-start: -6px !important;
  }

  .custom-total-product .v-card {
    padding: 2px !important;
  }

  .custom-btn-export {
    padding: 5px !important;
  }

  .custom-total-export .v-btn {
    margin-block-end: 1px !important;
    margin-block-start: 10px !important;
    margin-inline-start: -6px !important;
    padding-inline: 6rem !important;
  }

  .custom-details-product .v-card {
    block-size: auto !important;
  }

  .custom-total-all .v-card {
    block-size: auto !important;
  }
}

@media screen and (min-width: 300px) and (max-width: 389px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  /* New */
  .custom-total-product {
    padding: 10px !important;
  }

  .custom-total-export {
    padding: 12px !important;
    margin-block-end: -2px !important;
    margin-block-start: -16px !important;
  }

  .custom-total-export .v-btn {
    padding-inline: 3.6rem !important;
  }

  .custom-details-product .v-card {
    block-size: auto !important;
  }

  .custom-total-all .v-card {
    block-size: auto !important;
  }
}

@media screen and (min-width: 250px) and (max-width: 299px) {
  /* กำหนดสไตล์ที่ต้องการเมื่อหน้าจอขนาดไม่เกิน 768px */

  /* New */
  .custom-total-product {
    padding: 4px !important;
    margin-block-start: 4px !important;
    margin-inline-start: -6px !important;
  }

  .custom-total-product .v-card {
    padding: 2px !important;
  }

  .custom-total-export {
    padding: 6px !important;
    margin-block-end: 12px !important;
    margin-block-start: -2px !important;
    margin-inline-start: -6px !important;
  }

  .custom-total-export .v-btn {
    padding-inline: 3.6rem !important;
  }

  .custom-tag-total {
    font-size: 20px !important;
  }

  .custom-details-product .v-card {
    block-size: auto !important;
  }

  .custom-total-all .v-card {
    block-size: auto !important;
  }
}

@media print {
  .v-application {
    background: none !important;
  }

  .product-buy-now {
    display: none;
  }

  .v-navigation-drawer,
  .layout-vertical-nav,
  .app-customizer-toggler,
  .layout-footer,
  .layout-navbar,
  .layout-navbar-and-nav-container {
    display: none;
  }

  .v-card {
    box-shadow: none !important;

    .print-row {
      flex-direction: row !important;
    }
  }

  .layout-content-wrapper {
    padding-inline-start: 0 !important;
  }
}

.card-image {
  transition: transform 0.2s ease-in-out; /* เพิ่มการเปลี่ยนแปลงที่นุ่มนวล */
}

.flex-center {
  display: flex;
  align-items: center; /* จัดตำแหน่งตรงกลางแนวตั้ง */
  justify-content: center; /* จัดตำแหน่งตรงกลางแนวนอน */
}

.card-image:hover {
  transform: scale(1.1); /* ทำให้ขยายใหญ่ขึ้นเมื่อ hover */
}

.bottom-progress {
  position: absolute;
  inline-size: 100%;
  inset-block-end: 0;
}
</style>

