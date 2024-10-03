<script setup>
import dashboard from "@/navigation/vertical/dashboard"
import axiosIns from "@axios"

//// --------------------------------------------------------------------------------------
import { onMounted, ref, watchEffect } from "vue"

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

//-------------------------------------------------------------  Search Table Nomaly-------------------
import { urlApi } from "@/api"

const whereHouseSelectedItem = ref("")
const products = ref([])
const stockAdjust = ref([])

// Get access token from localStorage in another page
const accessTokenAtStore = localStorage.getItem("accessTokenAtStore")

const whereHouse = localStorage.getItem("whereHouseName")

const accessTokenTest =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoi4LiT4Lix4LiQ4Lie4LilIiwibmFtZWlkIjoiMDAwMDAxIiwibmJmIjoxNzAxMzEyMDY5LCJleHAiOjE3MDM0NzIwNjksImlhdCI6MTcwMTMxMjA2OSwiaXNzIjoiSXNzdWVyIiwiYXVkIjoiQXVkaWVuY2UifQ.CPMUUQDPkwS0qBiHUioxEdTW8f1TIZL3u--qENiH-UQ"

const url = ref(`${urlApi.value}/api/Auth/GetLocation/all`)

const ApiTure =
  "`${urlApi.value}/api/v1/StockUpdate?page=`+currentPageP.value+`&perPage=`+rowPerPageP.value"

const perPage = ref(10)
const page = ref(0)
const totalCount = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)

//------------------- Model ID For search ------------------------------------
const searchByCategoryId = ref(null)
const searchByTypeId = ref("")
const searchBySubTypeId = ref("")
const searchByBarcode = ref(null)
const searchByUOMId = ref(null)
const searchByWareHouseId = ref(null)
const searchByZoneId = ref("")
const searchByAreaId = ref("")
const searchBySubAreaId = ref("")
const searchBySearchByCategory = ref("")

//------------------- Model For Search Counting Stock ------------------------------------
const searchByStatus = ref(null)
const searchByCountingDate = ref(null)
const searchByProductGroup = ref(null)
const searchByLocation = ref(null)
const searchByProductId = ref(null)
const searchByProductName = ref(null)
const searchByConfirmDate = ref(null)
const searchByCountingBy = ref(null)

//----- Search Filter Icon Header Table[Counting Stock] --------------------------------
const menuStatus = ref(false)
const menuCountingDate = ref(false)
const menuProductGroup = ref(false)
const menuLocation = ref(false)
const menuProductId = ref(false)
const menuProductName = ref(false)
const menuConfirmDate = ref(false)
const menuCountingBy = ref(false)

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
const menuCategory = ref(false)
const menuGroup = ref(false)
const menuSubGroup = ref(false)
const menuBarcode = ref(false)
const menuProductCode = ref(false)

//------------------------ item ID for search ------------------------------
const itemsSearchByCategoryId = ref([])
const typeItemsSearchById = ref([])
const subTypeItemsSearchById = ref([])
const itemsSearchByUOMId = ref([])
const wareHouseItemsSearchById = ref([])
const zoneItemsSearchById = ref([])
const areaItemsSearchById = ref([])

//----------------------  SortBy Variable  -------------------------------------
const sortByCategory = ref("")
const sortByType = ref("")
const sortBySubType = ref("")
const sortByBarcode = ref("")
const sortByProductId = ref("")
const sortByProductName = ref("")
const sortByUnit = ref("")
const sortByQty = ref("")
const sortByTags = ref("")
const sortByNonTags = ref("")

const toggleSortType = sortBy => {
  const sortRefs = {
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
  }

  for (const key in sortRefs) {
    if (key === sortBy) {
      sortRefs[key].value = sortRefs[key].value === "asc" ? "desc" : "asc"
    } else {
      sortRefs[key].value = "" // ล้างค่าที่ไม่เกี่ยวข้อง
    }
    console.log("Sort type:", sortRefs[key], "Key", [key])
  }

  console.log("Sort type:", sortRefs[key], "Key", [key])
}

//--------------------------------------------- Time Date Variables --------------------------------
const datest = ref(null) /// date start
const datesp = ref(null) /// date to

//--------------------------------------------------------------------------------

const GetCountingStock = () => {
  // Clear the access token from localStorage
  localStorage.removeItem("accessToken")
  axiosIns
    .get(
      `${urlApi.value}/api/v1/CountingStock?`,
      {
        params: {
          page: currentPage.value,
          perPage: rowPerPage.value,
          datest: datest.value,
          datesp: datesp.value,
          searchByStatus: searchByStatus.value,
          searchByCountingDate: searchByCountingDate.value,
          searchByProductGroup: searchByProductGroup.value,
          searchByLocation: searchByLocation.value,
          searchByProductId: searchByProductId.value,
          searchByProductName: searchByProductName.value,
          searchByConfirmDate: searchByConfirmDate.value,
          searchByCountingBy: searchByCountingBy.value,

          // ... and so on with other parameters
        },
        headers: {
          accept: "*/*",
          "x-location": `${whereHouse}`,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
      },
      {},
    )
    .then(response => {
      products.value = response.data.items
      totalCount.value = response.data.totalCount
      currentPage.value = response.data.page
      totalPage.value = response.data.totalPages
      rowPerPage.value = response.data.perPage

      console.log("products.value: ", products.value)
      console.log("perPage: ", perPage)
      console.log("currentPage: ", currentPage)
      console.log("totalCount: ", totalCount)
      console.log("totalPages: ", totalPage)
    })
    .catch(error => {
      // Handle errors
      console.error("Error:", error)
    })
}

watch(GetCountingStock)

// 👉 watching current page
watch(() => {
  if (currentPage.value > totalPage.value) currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = products.value.length
    ? (currentPage.value - 1) * rowPerPage.value + 1
    : 0

  const lastIndex =
    products.value.length + (currentPage.value - 1) * rowPerPage.value

  // console.log('const firstIndex ',firstIndex,'=','products.value.length:'+products.value.length,'?',(currentPage.value - 1)* rowPerPage.value + 1)
  // console.log('const lastIndex ',lastIndex,'=',products.value.length,'+',(currentPage.value - 1),'*',rowPerPage.value)
  // console.log('products.value.length: ',products.value.length)

  return `${firstIndex}-${lastIndex} of ${totalCount.value}`
})

// SECTION Checkbox toggle
const selectedRows = ref([])

///--------------------------------------- FetchItems for Search Box ----------------------------------------------

const fetchItemsSearchBy = nameSearch => {
  return axiosIns
    .get(`${urlApi.value}/api/v1/Product/${nameSearch}`, {
      headers: {
        accept: "*/*",
        "x-location": `${whereHouse}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
    })
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.error("Error:", error)

      return null
    })
}

fetchItemsSearchBy("categories").then(data => {
  itemsSearchByCategoryId.value = data
})

fetchItemsSearchBy("UOM").then(data => {
  itemsSearchByUOMId.value = data
})

function customFilter(item, queryText, itemText) {
  const textOne = itemText.title.toLowerCase()
  const textTwo = itemText.value.toLowerCase()
  const searchText = queryText.toLocaleLowerCase()

  return textOne.includes(searchText) || textTwo.includes(searchText)
}

const submitSearchButton = () => {
  console.log("submitSearchButton function!!")
  GetStockUpdate()
}

//--------------------------------------- FetchItems for Search WareHouse Zone Area ----------------------------------------

const fetchItemsWareHouse = () => {
  axiosIns
    .get("https://webapi.easetrackwms.com/api/Auth/GetLocation", {
      headers: {
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
    })
    .then(response => {
      wareHouseItemsSearchById.value = response.data

      // Now `items` contains an array of objects with id and name properties
      console.log("wareHouse.value At index", wareHouseItemsSearchById.value)
    })
    .catch(error => {
      // Handle errors
      selectError.value = "Where house not selected!!"
      console.error("Error:", error)
    })
}

watch(fetchItemsWareHouse)

//----------------------------------------------------- -----------------------------------------------//
// -------------------------------------- Export Bar Excel - --------------------------------

const stockUpdateExcel = () => {
  axiosIns
    .post(
      `${urlApi.value}/api/v1/StockUpdate/Excel`,
      {},
      {
        headers: {
          accept: "*/*",
          "x-location": `${whereHouse}`,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
        responseType: "blob", // ให้เซิร์ฟเวอร์รีเทิร์น blob สำหรับไฟล์ Excel
      },
    )
    .then(response => {
      // สร้าง URL ของไฟล์ Excel จาก binary data
      const url = window.URL.createObjectURL(new Blob([response.data]))

      // สร้างลิงก์สำหรับดาวน์โหลดไฟล์ Excel
      const link = document.createElement("a")

      const currentDate = new Date() // สร้างวัตถุ Date ปัจจุบัน

      const dateString = currentDate
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "") // แปลงวันที่เป็นรูปแบบ 'yyyyMMdd'

      const fileName = `stock_update_Non_Tag_${dateString}.xlsx` // ตั้งชื่อไฟล์โดยรวมกับวันที่

      link.href = url
      link.setAttribute("download", fileName) // ตั้งชื่อไฟล์ที่จะดาวน์โหลด
      document.body.appendChild(link)
      link.click()

      // ลบ URL หลังจากดาวน์โหลดเสร็จเรียบร้อยแล้ว
      window.URL.revokeObjectURL(url)
    })
    .catch(error => {
      // จัดการข้อผิดพลาด
      console.error("Error:", error)
    })
}

const onClickExportExcel = () => {
  stockUpdateExcel()
}

/// ------------------------------- Time Picker ------------------------
import AppDateTimePicker from "@core/components/app-form-elements/AppDateTimePicker.vue"

const date = ref("")

// watchEffect(TestTimeDate)
///-------------------------------------------  Status Even Change Btn ----------------------------------------------------------------
const colorBtn = ref("red")

//------------------------------

const now = new Date()
const offset = now.getTimezoneOffset() * 60000
const date2 = new Date(now.getTime() - offset).toISOString().slice(0, 10) // หรือ .substring(0, 10)
const picker = ref(date2)

//----------------------------------------- format Date -------------------------

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

  return `${formattedDate} ${formattedTime}`
}

const eventStatusChanged = statusName => {
  if (statusName === "กำลังตรวจนับ") {
    return "orange"
  } else if (statusName === "ตรวจนับ/ปรับยอดแล้ว") {
    return "green"
  } else {
    // สีเริ่มต้นหรือสีอื่น ๆ ที่ต้องการกำหนด
    return "blue" // เปลี่ยนเป็นสีที่ต้องการ
  }
}
</script>

<template>
  <!-- ----------------        Label Page | Back           ------------------------------------ -->
  <section>
    <!-- Tag page back -->
    <VRow>
      <VCol
        col="12"
        sm="6"
        md="6"
        lg="8"
      >
        <RouterLink :to="{ name: 'dashboards-main' }">
          <IconBtn>
            <VIcon
              icon="
                mdi-chevron-left"
            />
          </IconBtn>
        </RouterLink>
        {{ $t('Count Stock List') }}  
      </VCol>
      <VCol
        cols="12"
        sm="6"
        md="6"
        lg="4"
        class="d-flex justify-end justify-lg-end justify-sm-end"
      >
        <VBtn
          class="red--text"
          color="orange"
          to="rfidCountingStock"
        >
          <template>
            <VIcon color="white" />
          </template>
          <span class="text-white ">
            {{ $t('Count') }}
          </span>
        </VBtn>
      </VCol>
    </VRow>
  </section>

  <!-- ----------------       Date picker           ------------------------------------ -->
  <section>
    <VRow class="mt-2">
      <VCol
        cols="12"
        sm="12"
        md="8"
        lg="5"
        xl="6"
        class="VCol-DatePicker"
      >
        <VCard class="pa-2">
          <VRow>
            <!-- ---------------TimeDate-------  -->
            <VCol
              cols="12"
              sm="7"
              md="7"
              lg="7"
              xl="6"
            >
              <!-- ---------------TimeDate-------  -->
              <VRow>
                <VCol
                  cols="5"
                  sm="4"
                  md="5"
                  lg="5"
                  class="pt-5"
                >
                  <span style="font-size: 0.9rem;">{{
                    $t("Counting Date")
                  }}</span>
                </VCol>
                <VCol
                  cols="7"
                  sm="8"
                  md="7"
                  lg="7"
                >
                  <AppDateTimePicker
                    v-model="datest"
                    density="compact"
                    :label="$t('Date')"
                    append-inner-icon="mdi-calendar-range"
                    append-color="primary"
                  />
                </VCol>
              </VRow>
            </VCol>
            <!-- ---------------TimeDate To -------  -->
            <VCol
              cols="12"
              sm="5"
              md="5"
              lg="5"
              xl="6"
            >
              <!-- --------------- TimeDate To -------  -->
              <VRow>
                <VCol
                  cols="5"
                  xs="4"
                  md="4"
                  sm="2"
                  lg="2"
                  class="pt-5"
                  style="padding: 1px;"
                >
                  <span style="padding: 10px; font-size: 0.9rem;">{{
                    $t("To")
                  }}</span>
                </VCol>
                <VCol
                  cols="7"
                  md="8"
                  sm="10"
                  lg="10"
                >
                  <AppDateTimePicker
                    v-model="datesp"
                    append-inner-icon="mdi-calendar-range"
                    density="compact"
                    :label="$t('Date')"
                  />
                </VCol>
              </VRow>
            </VCol>
          </VRow>
        </VCard>
      </VCol>
    </VRow>
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
              {{ $t("No.") }}
            </th>
            <th
              scope="row"
              class="text-center"
            >
              {{ $t("Status") }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuStatus"
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
                            v-model="searchByStatus"
                            class="mt-4"
                            :label="$t('Status')"
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
              {{ $t("Counting Date") }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuCountingDate"
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
                            v-model="searchByCountingDate"
                            class="mt-4"
                            :label="$t('Counting Date')"
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
              {{ $t("Product Group Adjust") }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuProductGroup"
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
                            v-model="searchByProductGroup"
                            class="mt-4"
                            :label="$t('Product Group Adjust')"
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
              {{ $t("Product Area") }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuLocation"
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
                            v-model="searchByLocation"
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
              {{ $t("Product Code") }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuProductId"
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
                            v-model="searchByProductId"
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
              {{ $t("Product Name") }}
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
                            v-model="searchByProductName"
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
              {{ $t("Date of Confirmation") }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuConfirmDate"
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
                            v-model="searchByConfirmDate"
                            class="mt-4"
                            :label="$t('Date of Confirmation')"
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
              {{ $t("Confirmed by") }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuCountingBy"
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
                            v-model="searchByCountingBy"
                            class="mt-4"
                            :label="$t('Confirmed by')"
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
            <td class="text-center">
              {{ index + 1 }}
            </td>

            <!-- 👉 Status -->
            <td class="text-center">
              <VBtn
                :color="eventStatusChanged(product.statusName)"
                variant="outlined"
                :to="{
                  name: 'countStock-CountAdjustStock-countAdjust',
                  params: { id: index },
                  query: {
                    stockAdjustId: product.stockAdjustId,
                    zoneId: product.zoneId,
                    warehouseStock: whereHouse,
                  },
                }"
              >
                {{ product.statusName }}
              </VBtn>
            </td>

            <!-- 👉 Counting Date -->
            <td class="text-start">
              {{ formatDateTime(product.countingDate) }}
            </td>

            <!-- 👉 Product Group Adjust -->
            <td class="text-start">
              {{ product.productGroup }}
            </td>

            <!-- 👉 Product Area -->
            <td class="text-start">
              {{ product.locationName }}
            </td>

            <!-- 👉 Product Code -->
            <td class="text-center">
              {{ product.productId }}
            </td>

            <!-- 👉 Product Name -->
            <td class="text-start">
              {{ product.productName }}
            </td>

            <!-- 👉 Date of Confirmation -->
            <td>
              {{ product.approveAndCancelDate }}
            </td>
            <!-- 👉 Confirmed By -->
            <td class="text-start">
              {{ product.approveAndCancelBy }}
            </td>
          </tr>
        </tbody>
      </VTable>

      <VDivider />

      <div
        v-if="!checkData"
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

  /* สไตล์อื่นๆ ตามต้องการ */
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

@media screen and (min-width: 1201px) and (max-width: 1399px) {
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

  .custom-col-style {
    inline-size: calc(100% / 12 * 7);
    inline-size: 60%;
  }

  /* สไตล์อื่นๆ ตามต้องการ */
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}

.no-data-text {
  color: rgb(222, 222, 222); /* ตั้งค่าสีข้อความ */
  font-weight: bold; /* ตั้งค่าตัวหนา */
  margin-block-start: 10px; /* ปรับตำแหน่งข้อความให้ห่างจากไอคอน */
}
</style>

