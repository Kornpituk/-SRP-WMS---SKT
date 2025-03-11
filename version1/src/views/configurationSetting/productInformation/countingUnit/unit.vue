<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { ref, watchEffect } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api'

const whereHouse = localStorage.getItem('whereHouseName')
const whereHouseSelectedItem = ref(whereHouse)
const unit = ref([])

// Get access token from localStorage in another page
const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')

const perPage = ref(10)
const page = ref(0)
const totalCount = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)

//------------------- Model ID For search ------------------------------------
const searchBySecondProductCategoryCode = ref('')
const searchByUnitName = ref('')
const searchByDateLastEdtId = ref('')
const SearchData = ref('')

//------------------------ Model Name for search ------------------------------
const searchBySecondProductCategoryName = ref('')
const searchBySubProductCategoryName = ref('')

//----- Search Filter Icon Header Table[SecProduct Category, Group, Sub Group, Barcode, SecProduct Category Code, SecProduct Name]
const menuUnitName= ref( false)
const menuSecondCategoryName= ref( false)

//----------------------  SortBy Variable  -------------------------------------
const sortByUnitId = ref('')
const sortByCateogryName = ref('')
const sortBySubTypeName = ref('')
const sortByLastUpdate = ref('')


const toggleSortType = sortBy => {
  try {
    const sortRefs = { sortByUnitId, sortByLastUpdate }

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

const getUnitCounting = () => {

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.get(`${urlApi.value}/api/v1/Unit?page=`+currentPage.value+`&perPage=`+rowPerPage.value, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
    params: {
      SearchData: SearchData.value,
      searchByUnitName: searchByUnitName.value,

      sortByUnitId: sortByUnitId.value,
      sortByLastUpdate: sortByLastUpdate.value,
    },
  }, {})
    .then(response => {

      unit.value = response.data.items
      totalCount.value = response.data.totalCount
      currentPage.value = response.data.page
      totalPage.value = response.data.totalPages
      rowPerPage.value = response.data.perPage

      console.log('[unit.value]!!: ', unit.value)
      console.log('Warehouse At StockUpdate :', whereHouseSelectedItem.value)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

watch(getUnitCounting)

// 👉 watching current page
watch(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = unit.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = unit.value.length + (currentPage.value - 1) * rowPerPage.value

  // console.log('const firstIndex ',firstIndex,'=','secProducts.value.length:'+secProducts.value.length,'?',(currentPage.value - 1)* rowPerPage.value + 1)
  // console.log('const lastIndex ',lastIndex,'=',secProducts.value.length,'+',(currentPage.value - 1),'*',rowPerPage.value)
  // console.log('secProducts.value.length: ',secProducts.value.length)
  
  return `${ firstIndex }-${ lastIndex } of ${ totalCount.value }`
})

// SECTION Checkbox toggle
const selectedRows = ref([])

//-------------- function Add Cat Add ^w^ ------------------
const postProductCategoryId = ref('')
const postSecondProductCategoryId = ref('')
const postUnitCountingId = ref('')
const postUnitCountingName = ref('')

const getProductSubCategory = () => {
  axiosIns.get(`${urlApi.value}/api/v1/Product/SubTypes?`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
    params: {
      TypeId: postSecondProductCategoryId.value,
    },
  }, {})
    .then(response => {
      subCategory.value = response.data
      console.log('sub category.value', subCategory.value)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

watch(getProductSubCategory)

//---------------------------- Test Btn ---------------------------------
//------------------- Btn Add -------------------
const isDialogVisibleBtnAdd = ref(false)
const isDialogVisibleBtnAdded = ref(false)

const postUnitCounting = () => {

  const postCatData = {
    unitId: postUnitCountingId.value,
    unitName: postUnitCountingName.value,
  }

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.post(`${urlApi.value}/api/v1/Unit/Add`, postCatData, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
      'Content-Type': `application/json`,
    },
  }, {})
    .then(response => {
      isDialogVisibleBtnAdd.value = false ; isDialogVisibleBtnAdded.value = true
      getUnitCounting()
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
const editUnitCountingId = ref('')
const editUnitCountingName = ref('')

const startEdit = (unitId, unitName) => {
  console.log(unitId, unitName)
  isDialogVisibleBtnEdit.value = true
  editUnitCountingId.value = unitId
  editUnitCountingName.value = unitName
}

const editSubUnitCounting = () => {

  const postCatData = {
    unitId: editUnitCountingId.value,
    unitName: editUnitCountingName.value,
  }

  console.log('catId', postCatData.catId )


  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.post(`${urlApi.value}/api/v1/Unit/Edit`, postCatData, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
      'Content-Type': `application/json`,
    },
  }, {})
    .then(response => {
      isDialogVisibleBtnEdit.value = false ; isDialogVisibleBtnEdited.value = true
      getUnitCounting()
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
const deleteUnitCountingId = ref('')
const deleteUnitCountingName = ref('')

const startDelete = (unitId, unitName) => {
  isDialogVisibleBtnDelete.value = true
  deleteUnitCountingId.value = unitId
  deleteUnitCountingName.value = unitName
}

const deleteSubUnitCounting = () => {
  const postCatData = ''

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.post(`${urlApi.value}/api/v1/Unit/Delete/${deleteUnitCountingId.value}`, postCatData, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {
      isDialogVisibleBtnDelete.value = false ; isDialogVisibleBtnDeleted.value = true
      getUnitCounting()
      console.log('response ', response)
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })
}

//-------------------------------------- format date ---------------

function formatDate(inputDate) {
  const date = new Date(inputDate)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // getMonth() returns month from 0 to 11
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}
</script>

<template>
  <!-- ----------------        Label Page | Back           ------------------------------------ -->
  <section>
    <div>
      <VCard
        height="100%"
        class="bg-primary"
      >
        <VCardTitle class="pa-1">
          <VRow>
            <VCol
              class="d-flex align-center"
              cols="12"
              lg="8"
            >
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
                {{ $t('UoM') }}
              </h4>
            </VCol>
          </VRow>
        </VCardTitle>
      </VCard>
    </div>
  </section>

  <section class="mt-2">
    <VCard>
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            lg="11"
          >
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
          <VCol
            cols="12"
            lg="1"
          >
            <VBtn
              class="red--text"
              color="orange"
              prepend-icon="mdi-plus"
              @click="isDialogVisibleBtnAdd = true"
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
              >{{ $t('Add') }}</span>
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </section>

  <!-- Dialog Zone -->
  <div>
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
              <span style="text-decoration: underline;">{{ $t('Add Counting Unit') }}</span>
            </VCardTitle>

            <VCardText>
              <VRow>
                <!-- Sub Cat Id -->
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
                      {{ $t('Counting Unit Code') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="postUnitCountingId"
                        :label="$t('Counting Unit Code')"
                        placeholder="000"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Cat Name -->
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
                      {{ $t('Counting Unit Name') }}:
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="postUnitCountingName"
                        :label="$t('Counting Unit Name')"
                        placeholder="Peter Parker"
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
                @click="postUnitCounting"
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
              <span class="text-h5 text-center px-6">{{ $t('The Counting Unit Has Been Added') }}</span>
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
          max-width="450"
        >
          <!-- Dialog Content -->
          <VCard>
            <DialogCloseBtn
              variant="text"
              size="small"
              @click="isDialogVisibleBtnEdit = false"
            />

            <VCardTitle>
              <span style="text-decoration: underline;">{{ $t('Edit Counting Unit') }}</span>
            </VCardTitle>

            <VCardText>
              <VRow>
                <!-- Sub Cat Id -->
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
                      {{ $t('Counting Unit Code') }}
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="editUnitCountingId"
                        readonly
                        variant="solo-filled"
                        :label="$t('Counting Unit Code')"
                        placeholder="00"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Sub Cat Name -->
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
                      {{ $t('Counting Unit Name') }}
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField

                        v-model="editUnitCountingName"
                        :label="$t('Counting Unit Name')"
                        placeholder="Peter Parker"
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
                @click="editSubUnitCounting"
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
              <span class="text-h5">{{ $t('The Counting Unit Has Been Edited') }}</span>
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
          max-width="450"
        >
          <!-- Dialog Content -->
          <VCard>
            <DialogCloseBtn
              variant="text"
              size="small"
              @click="isDialogVisibleBtnDelete = false"
            />

            <VCardTitle>
              <span style="text-decoration: underline;">{{ $t('Remove Counting Unit') }}</span>
            </VCardTitle>

            <VCardText>
              <VRow>
                <!-- Sub Cat Id -->
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
                      {{ $t('Counting Unit Code') }}
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="deleteUnitCountingId"
                        readonly
                        variant="solo-filled"
                        :label="$t('Counting Unit Code')"
                        placeholder="00"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Sub Cat Name -->
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
                      {{ $t('Counting Unit Name') }}
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="deleteUnitCountingName"
                        readonly
                        variant="solo-filled"
                        :label="$t('Counting Unit Name')"
                        placeholder="Peter Parker"
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
                @click="deleteSubUnitCounting"
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
              <span class="text-h5">{{ $t('The Counting Unit Has Been Removed') }}</span>
            </VCardText>
          </VCard>
        </VDialog>
      </div>
    </section>
  </div>
  

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
              {{ $t('UoM Code') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByUnitId')"
              />
            </th>
            <th
              scope="row"
              class="text-start"
            >
              {{ $t('UoM Name') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuUnitName"
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
                            :label="$t('Counting Unit Name')"
                          />
                        </VCol>

                        <VCol
                          class="text-end"
                          cols="12"
                        >
                          <VBtn
                            type="submit"
                            @click="menuUnitName = false"
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
            v-for="(product, index) in unit"
            :key="index"
          >
            <!-- 👉 Ordinal Number -->
            <td class="text-center">
              {{ index+1 }}
            </td>

            <!-- 👉 Product unitId -->
            <td class="text-start">
              {{ product.unitId }}
            </td>
            <!-- 👉 Product unitName -->
            <td class="text-start">
              {{ product.unitName }}
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
                @click="startEdit(product.unitId,product.unitName)"
              />
              <VIcon
                color="error"
                icon="mdi-trash-can-outline"
                @click="startDelete(product.unitId,product.unitName)"
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

