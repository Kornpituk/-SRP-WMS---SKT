<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { ref, watchEffect } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api'

const whereHouse = localStorage.getItem('whereHouseName')
const whereHouseSelectedItem = ref(whereHouse)
const secondProducts = ref([])

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
const searchByProductCategoryName = ref('')
const searchByDateLastEdtId = ref('')
const SearchData = ref('')

const searchBySecondProductCategoryId = ref('')

//------------------------ Model Name for search ------------------------------
const searchBySecondProductCategoryName = ref('')

//----- Search Filter Icon Header Table[SecProduct Category, Group, Sub Group, Barcode, SecProduct Category Code, SecProduct Name]
const menuCategoryName= ref( false)
const menuSecondCategoryName= ref( false)

//----------------------  SortBy Variable  -------------------------------------
const sortByTypeId = ref('')
const sortByCateogryName = ref('')
const sortByTypeName = ref('')
const sortByLastUpdate = ref('')


const toggleSortType = sortBy => {
  try {
    const sortRefs = { sortByCateogryName, sortByTypeId, sortByTypeName, sortByLastUpdate }

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

const getSecondProductType = () => {

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.get(`${urlApi.value}/api/v1/Type?page=`+currentPage.value+`&perPage=`+rowPerPage.value, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
    params: {
      SearchData: SearchData.value,
      searchByCategory: searchByProductCategoryName.value,
      searchByTypeName: searchBySecondProductCategoryName.value,

      sortByCateogryName: sortByCateogryName.value,
      sortByTypeId: sortByTypeId.value,
      sortByTypeName: sortByTypeName.value,
      sortByLastUpdate: sortByLastUpdate.value,
    },
  }, {})
    .then(response => {

      secondProducts.value = response.data.items
      totalCount.value = response.data.totalCount
      currentPage.value = response.data.page
      totalPage.value = response.data.totalPages
      rowPerPage.value = response.data.perPage

      console.log('[products.value]!!: ', secondProducts.value)
      console.log('Warehouse At StockUpdate :', whereHouseSelectedItem.value)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

watch(getSecondProductType)

// 👉 watching current page
watch(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = secondProducts.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = secondProducts.value.length + (currentPage.value - 1) * rowPerPage.value

  // console.log('const firstIndex ',firstIndex,'=','secProducts.value.length:'+secProducts.value.length,'?',(currentPage.value - 1)* rowPerPage.value + 1)
  // console.log('const lastIndex ',lastIndex,'=',secProducts.value.length,'+',(currentPage.value - 1),'*',rowPerPage.value)
  // console.log('secProducts.value.length: ',secProducts.value.length)
  
  return `${ firstIndex }-${ lastIndex } of ${ totalCount.value }`
})

// SECTION Checkbox toggle
const selectedRows = ref([])

//---------------------------- Test Btn ---------------------------------
//------------------- Btn Add -------------------
const isDialogVisibleBtnAdd = ref(false)
const isDialogVisibleBtnAdded = ref(false)

//-------------- function Add Cat Add ^w^ ------------------
const postProductCategoryId = ref('')
const postSecondProductCategoryId = ref('')
const postSecondProductCategoryName = ref('')

const postSecondProductCategory = () => {

  const postCatData = {
    catId: postProductCategoryId.value,
    typeId: postSecondProductCategoryId.value,
    typeName: postSecondProductCategoryName.value,
  }

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.post(`${urlApi.value}/api/v1/Type/Add`, postCatData, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
      'Content-Type': `application/json`,
    },
  }, {})
    .then(response => {
      isDialogVisibleBtnAdd.value = false ; isDialogVisibleBtnAdded.value = true
      getSecondProductType()
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
const editSecondProductCategoryId = ref('')
const editSecondProductCategoryName = ref('')

const startEdit = (catId, catName, id, name) => {
  isDialogVisibleBtnEdit.value = true
  editProductCategoryId.value = catId
  editProductCategoryName.value = catName
  editSecondProductCategoryId.value = id
  editSecondProductCategoryName.value = name
}

const editSecondProductCategory = () => {

  const postCatData = {
    catId: editProductCategoryId.value,
    typeId: editSecondProductCategoryId.value,
    typeName: editSecondProductCategoryName.value,
  }

  console.log('catId', postCatData.catId )


  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.post(`${urlApi.value}/api/v1/Type/Edit`, postCatData, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
      'Content-Type': `application/json`,
    },
  }, {})
    .then(response => {
      isDialogVisibleBtnEdit.value = false ; isDialogVisibleBtnEdited.value = true
      getSecondProductType()
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
const deleteSecondProductCategoryId = ref('')
const deleteSecondProductCategoryName = ref('')

const startDelete = (catId, catName, id, name) => {
  isDialogVisibleBtnDelete.value = true
  deleteProductCategoryId.value = catId
  deleteProductCategoryName.value = catName
  deleteSecondProductCategoryId.value = id
  deleteSecondProductCategoryName.value = name
}

const deleteSecondProductCategory = () => {
  const postCatData = ''

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.post(`${urlApi.value}/api/v1/Type/Delete/${deleteSecondProductCategoryId.value}`, postCatData, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {
      isDialogVisibleBtnDelete.value = false ; isDialogVisibleBtnDeleted.value = true
      getSecondProductType()
      console.log('response ', response)
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })
}

//---------------------------- get items --------------

//--------------------------- Get Cat ---------------------------
const categories = ref([])
const type = ref([])

const getProductCategory = () => {
  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.get(`${urlApi.value}/api/v1/Category?page=`+`&perPage=500`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {

      categories.value = response.data.items
      console.log('categories!!: ', categories.value)
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })
}

watch(getProductCategory)

//-------------------------- Get Type ----------------------------
//--------------------------------------- FetchItems for Search  Type(Group) ----------------------------------------

const getItemsProductType = () => {
  axiosIns.get(`${urlApi.value}/api/v1/Product/Types`, {
    params: {
      'CategoryId': postProductCategoryId.value,
    },
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
    .then(response => {

      type.value = response.data
      console.log('type', type.value)

      
    })
    .catch(error => {
      // Handle errors
      selectError.value = 'Where house not selected!!'
      console.error('Error:', error)
    })

    
}

watchEffect(getItemsProductType)

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
                {{ $t('Group') }}
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
              <span style="text-decoration: underline;">{{ $t('Add Group') }}</span>
            </VCardTitle>

            <VCardText>
              <VRow>
                <!-- Cat Id -->
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
                      {{ $t('Categories') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VAutocomplete
                        v-model="postProductCategoryId"
                        :items="categories"
                        item-title="category1"
                        item-value="catId"
                        placeholder="Select User"
                        :label="$t('Categories')"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Second Cat Id -->
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
                      {{ $t('Group Code') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="postSecondProductCategoryId"
                        :label="$t('Group Code')"
                        placeholder="Peter Parker"
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
                      {{ $t('Group Name') }}:
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="postSecondProductCategoryName"
                        :label="$t('Group Name')"
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
                @click="postSecondProductCategory"
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
              <span class="text-h5 text-center px-6">{{ $t('The Group Has Been Added') }}</span>
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
          max-width="600"
        >
          <!-- Dialog Content -->
          <VCard>
            <DialogCloseBtn
              variant="text"
              size="small"
              @click="isDialogVisibleBtnEdit = false"
            />

            <VCardTitle>
              <span style="text-decoration: underline;">{{ $t('Edit Group') }}</span>
            </VCardTitle>

            <VCardText>
              <VRow>
                <!-- Cat Id -->
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
                      {{ $t('Group Code') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="editProductCategoryName"
                        readonly
                        variant="solo-filled"
                        :label="$t('Group Code')"
                        placeholder="Peter Parker"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Sec Cat Id -->
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
                      {{ $t('Group Code') }}
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="editSecondProductCategoryId"
                        readonly
                        variant="solo-filled"
                        :label="$t('Group Code')"
                        placeholder="Peter Parker"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Sec Cat Name -->
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
                      {{ $t('Group Name') }}
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="editSecondProductCategoryName"
                        :label="$t('Group Name')"
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
                @click="editSecondProductCategory"
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
              <span class="text-h5">{{ $t('The Group Has Been Edited') }}</span>
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
          max-width="600"
        >
          <!-- Dialog Content -->
          <VCard>
            <DialogCloseBtn
              variant="text"
              size="small"
              @click="isDialogVisibleBtnDelete = false"
            />

            <VCardTitle>
              <span style="text-decoration: underline;">{{ $t('Remove Group') }}</span>
            </VCardTitle>

            <VCardText>
              <VRow>
                <!-- Cat id -->
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
                      {{ $t('Remove Group') }}
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="deleteProductCategoryName"
                        readonly
                        variant="solo-filled"
                        :label="$t('Remove Group')"
                        placeholder="00"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Sec Cat id -->
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
                      {{ $t('Remove Group') }}
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="deleteSecondProductCategoryId"
                        readonly
                        variant="solo-filled"
                        :label="$t('Remove Group')"
                        placeholder="00"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Sec Cat Name -->
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
                      {{ $t('Remove Group') }}
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="deleteSecondProductCategoryName"
                        readonly
                        variant="solo-filled"
                        :label="$t('Remove Group')"
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
                @click="deleteSecondProductCategory"
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
              <span class="text-h5">{{ $t('The Group Has Been Removed') }}</span>
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
              {{ $t('Categories') }}
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
                            v-model="searchByProductCategoryName"
                            class="mt-4"
                            :label="$t('Categories')"
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
              class="text-start"
            >
              {{ $t('Group Code') }}
              <!-- ----------------------------- Icon Search By --------------------- -->
              <VIcon
                color="primary"
                icon="mdi-pan-vertical"
                @click="toggleSortType('sortByTypeId')"
              />
            </th>
            <th
              scope="row"
              class="text-start"
            >
              {{ $t('Group Name') }}
              <!-- ----------------------------- Menu Search By --------------------- -->
              <VMenu
                v-model="menuSecondCategoryName"
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
                            v-model="searchBySecondProductCategoryName"
                            class="mt-4"
                            :label="$t('Group Name')"
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
            v-for="(product, index) in secondProducts"
            :key="index"
          >
            <!-- 👉 Ordinal Number -->
            <td class="text-center">
              {{ index+1 }}
            </td>

            <!-- 👉 Group -->
            <td class="text-start">
              {{ product.category }}
            </td>
            <!-- 👉 Group -->
            <td class="text-start">
              {{ product.typeId }}
            </td>
            <!-- 👉 Secondary Group -->
            <td class="text-start">
              {{ product.typeName }}
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
                @click="startEdit(product.catId, product.category, product.typeId,product.typeName)"
              />
              <VIcon
                color="error"
                icon="mdi-trash-can-outline"
                @click="startDelete(product.catId, product.category, product.typeId, product.typeName)"
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

