<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { ref } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api'

const whereHouse = localStorage.getItem('whereHouseName')
const whereHouseSelectedItem = ref(whereHouse)
const Warehouse = ref([])

// Get access token from localSsessionStoragetorage in another page
const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')

const perPage = ref(10)
const page = ref(0)
const totalCount = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)

//------------------- Model ID For search ------------------------------------
const searchBySecondProductCategoryCode = ref('')
const searchByProductCategoryName = ref('')
const searchByDateLastEdtId = ref('')
const SearchData = ref('')

//------------------------ Model Name for search ------------------------------
const searchBySecondProductCategoryName = ref('')
const searchByDepartmentName = ref('')

//----- Search Filter Icon Header Table[SecProduct Category, Group, Sub Group, Barcode, SecProduct Category Code, SecProduct Name]
const menuWarehouseName= ref( false)
const menuWarehouseLocation= ref( false)
const menuSubCategoryName= ref( false)

//----------------------  SortBy Variable  -------------------------------------
const sortByDepartmentId = ref('')
const sortByCateogryName = ref('')
const sortBySubTypeName = ref('')
const sortByLastUpdate = ref('')


const toggleSortType = sortBy => {
  try {
    const sortRefs = { sortByDepartmentId, sortByLastUpdate }

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

//--------------------------------------------------------------------------------

const getDepartment = () => {

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.get(`${urlApi.value}/api/v1/EmpDepartment?page=`+currentPage.value+`&perPage=`+rowPerPage.value, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
    params: {
      SearchData: SearchData.value,
      searchByDepartmentName: searchByDepartmentName.value,

      sortByDepartmentId: sortByDepartmentId.value,
      sortByLastUpdate: sortByLastUpdate.value,
    },
  }, {})
    .then(response => {

      Warehouse.value = response.data.items
      totalCount.value = response.data.totalCount
      currentPage.value = response.data.page
      totalPage.value = response.data.totalPages
      rowPerPage.value = response.data.perPage

      console.log('[products.value]!!: ', Warehouse.value)
      console.log('Warehouse At StockUpdate :', whereHouseSelectedItem.value)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

watch(getDepartment)

// 👉 watching current page
watch(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = Warehouse.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = Warehouse.value.length + (currentPage.value - 1) * rowPerPage.value

  // console.log('const firstIndex ',firstIndex,'=','secProducts.value.length:'+secProducts.value.length,'?',(currentPage.value - 1)* rowPerPage.value + 1)
  // console.log('const lastIndex ',lastIndex,'=',secProducts.value.length,'+',(currentPage.value - 1),'*',rowPerPage.value)
  // console.log('secProducts.value.length: ',secProducts.value.length)
  
  return `${ firstIndex }-${ lastIndex } of ${ totalCount.value }`
})

// SECTION Checkbox toggle
const selectedRows = ref([])

//-------------- function Add Cat Add ^w^ ------------------
const postDepartmentId = ref('')
const postDepartmentName = ref('')

//---------------------------- Test Btn ---------------------------------
//------------------- Btn Add -------------------
const isDialogVisibleBtnAdd = ref(false)
const isDialogVisibleBtnAdded = ref(false)

const postDepartment = () => {

  const postData = {
    departmentId: postDepartmentId.value,
    departmentName: postDepartmentName.value,
  }

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.post(`${urlApi.value}/api/v1/EmpDepartment/Add`, postData, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
      'Content-Type': `application/json`,
    },
  }, {})
    .then(response => {
      isDialogVisibleBtnAdd.value = false ; isDialogVisibleBtnAdded.value = true
      getDepartment()
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
const editDepartmentId = ref('')
const editDepartmentName = ref('')
const editSecProductCategoryId = ref('')
const editSecProductCategoryName = ref('')

const startEdit = (DepartmentId, DepartmentName) => {
  isDialogVisibleBtnEdit.value = true
  editDepartmentId.value = DepartmentId
  editDepartmentName.value = DepartmentName
}

const editDepartment = () => {

  const postCatData = {
    departmentId: editDepartmentId.value,
    departmentName: editDepartmentName.value,
  }

  axiosIns.post(`${urlApi.value}/api/v1/EmpDepartment/Edit`, postCatData, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
      'Content-Type': `application/json`,
    },
  }, {})
    .then(response => {
      isDialogVisibleBtnEdit.value = false ; isDialogVisibleBtnEdited.value = true
      getDepartment()
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
const deleteDepartmentId = ref('')
const deleteDepartmentName = ref('')

const startDelete = (DepartmentId, DepartmentName) => {
  isDialogVisibleBtnDelete.value = true
  deleteDepartmentId.value = DepartmentId
  deleteDepartmentName.value = DepartmentName
}

const deleteDepartment = () => {
  const postCatData = ''

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.post(`${urlApi.value}/api/v1/EmpDepartment/Delete/${deleteDepartmentId.value}`, postCatData, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {
      isDialogVisibleBtnDelete.value = false ; isDialogVisibleBtnDeleted.value = true
      getDepartment()
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
        <RouterLink :to="{ name: 'inventory-stockUpdate' }">
          <IconBtn>
            <VIcon
              icon="
                mdi-chevron-left"
            />
          </IconBtn>
        </RouterLink>
        {{ $t("Department") }}
      </VCol>
      <VCol
        cols="12"
        sm="6"
        md="6"
        lg="4"
        class="d-flex justify-end justify-lg-end justify-sm-end"
      >
        <VRow>
          <VCol cols="9">
            <VTextField
              v-model="SearchData"
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
          <VCol cols="3">
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
      </VCol>
    </VRow>
  </section>

  <!-- Dialog Department -->
  <section>
    <!-- Dialog for Add -->
    <section>
      <!-- Dialog Content Confirming -->
      <div>
        <VDialog
          v-model="isDialogVisibleBtnAdd"
          max-width="450"
        >
          <!-- Dialog Content -->
          <VCard>
            <DialogCloseBtn
              variant="text"
              size="small"
              @click="isDialogVisibleBtnAdd = false"
            />

            <VCardTitle>
              <span style="text-decoration: underline;">{{ $t('Add Department') }}</span>
            </VCardTitle>
            <VCardText>
              <VRow>
                <!-- Department Code -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end "
                      cols="12"
                      lg="6"
                    >
                      {{ $t('Department Code') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="postDepartmentId"
                        :label="$t('Department Code')"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Department Name -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end "
                      cols="12"
                      lg="6"
                    >
                      {{ $t('Department Name') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="postDepartmentName"
                        :label="$t('Department Name')"
                        density="compact"
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
                @click="isDialogVisibleBtnAdd = false"
              >
                {{ $t('Cancel') }}
              </VBtn>
              <VBtn
                variant="flat"
                color="success"
                class="px-6"
                @click="postDepartment"
              >
                {{ $t('Save') }}
              </VBtn>
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
              <span class="text-h5 text-center px-6">{{ $t('The Department Has Been Added') }}</span>
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

            <VCardTitle>
              <span style="text-decoration: underline;">{{ $t('Edit Department') }}</span>
            </VCardTitle>

            <VCardText>
              <VRow>
                <!-- Warehouse Code -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end "
                      cols="12"
                      lg="6"
                    >
                      {{ $t('Department Code') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="editDepartmentId"
                        :label="$t('Department Code')"
                        readonly
                        variant="solo-filled"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Warehouse Name -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end "
                      cols="12"
                      lg="6"
                    >
                      {{ $t('Department Name') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="editDepartmentName"
                        :label="$t('Department Name')"
                        density="compact"
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
                @click="editDepartment"
              >
                {{ $t('Save') }}
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
              <span class="text-h5">{{ $t('The Department Has Been Edited') }}</span>
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
          max-width="500"
        >
          <!-- Dialog Content -->
          <VCard>
            <DialogCloseBtn
              variant="text"
              size="small"
              @click="isDialogVisibleBtnDelete = false"
            />

            <VCardTitle>
              <span style="text-decoration: underline;">{{ $t('Remove Department') }}</span>
            </VCardTitle>

            <VCardText>
              <VRow>
                <!-- Warehouse Code -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end "
                      cols="12"
                      lg="6"
                    >
                      {{ $t('Department Code') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="deleteDepartmentId"
                        :label="$t('Department Code')"
                        readonly
                        variant="solo-filled"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Warehouse Name -->
                <VCol
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <VRow class="mx-4">
                    <VCol
                      class="d-flex align-center justify-lg-end "
                      cols="12"
                      lg="6"
                    >
                      {{ $t('Department Name') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="deleteDepartmentName"
                        :label="$t('Department Name')"
                        density="compact"
                        readonly
                        variant="solo-filled"
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
                color="success"
                class="px-6"
                @click="deleteDepartment"
              >
                {{ $t('Save') }}
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
              <span class="text-h5">{{ $t('The Department Has Been Removed') }}</span>
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
              class="text-start"
            >
              {{ $t('Department Code') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByDepartmentId')"
              />
            </th>
            <th
              scope="row"
              class="text-start"
            >
              {{ $t('Department Name') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuWarehouseName"
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
                            v-model="searchByDepartmentName"
                            class="mt-4"
                            :label="$t('Department Name')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
                            @click="menuWarehouseName = false"
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
              {{ $t('Last Date Edit') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByLastUpdate')"
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
            v-for="(product, index) in Warehouse"
            :key="index"
          >
            <!-- 👉 Ordinal Number -->
            <td class="text-center">
              {{ index+1 }}
            </td>

            <!-- 👉 Product categories -->
            <td class="text-start">
              {{ product.departmentId }}
            </td>
            <!-- 👉 Product categories -->
            <td class="text-start">
              {{ product.departmentName }}
            </td>
            <!-- 👉 Product code -->
            <td class="text-start">
              {{ formatDate(product.lastupdate) }}
            </td>

            <!-- 👉 Actions -->
            <td
              style="width: 8rem;"
              class="text-center"
            >
              <VIcon
                color="primary"
                icon="mdi-square-edit-outline"
                @click="startEdit(product.departmentId,product.departmentName,)"
              />
              <VIcon
                color="error"
                icon="mdi-trash-can-outline"
                @click="startDelete(product.departmentId,product.departmentName,)"
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

