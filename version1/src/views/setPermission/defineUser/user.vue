<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { ref } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api'

const whereHouse = localStorage.getItem('whereHouseName')
const whereHouseSelectedItem = ref(whereHouse)
const section = ref([])

// Get access token from localStorage in another page
const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')

const perPage = ref(10)
const page = ref(0)
const totalCount = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)

const EmpCode = ref('')
const EmpTitleName = ref('')
const EmpNameSurName = ref('')
const EmpDepart = ref('')
const EmpSection = ref('')
const EmpPosition = ref('')
const EmpDivision = ref('')
const EmpUerName = ref('')
const EmpRole = ref('')
const EmpEmail = ref('')

//------------------- Model ID For search ------------------------------------
const searchBySecondProductCategoryCode = ref('')
const searchByProductCategoryName = ref('')
const searchByDateLastEdtId = ref('')
const SearchData = ref('')

//------------------------ Model Name for search ------------------------------
const searchBySecondProductCategoryName = ref('')
const searchBySubProductCategoryName = ref('')

//----- Search Filter Icon Header Table[SecProduct Category, Group, Sub Group, Barcode, SecProduct Category Code, SecProduct Name]
const menusectionName= ref( false)
const menusectionLocation= ref( false)
const menuSubCategoryName= ref( false)

//----------------------  SortBy Variable  -------------------------------------
const sortBySubTypeId = ref('')
const sortByCateogryName = ref('')
const sortBySubTypeName = ref('')
const sortByLastUpdate = ref('')


const toggleSortType = sortBy => {
  try {
    const sortRefs = { sortBySubTypeId, sortByLastUpdate }

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

const getSubProductCategory = () => {

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.get(`${urlApi.value}/api/v1/SubType?page=`+currentPage.value+`&perPage=`+rowPerPage.value, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
    params: {
      SearchData: SearchData.value,
      searchByCategory: searchByProductCategoryName.value,
      searchByTypeName: searchBySecondProductCategoryName.value,
      searchBySubTypeName: searchBySubProductCategoryName.value,

      sortBySubTypeId: sortBySubTypeId.value,
      sortByLastUpdate: sortByLastUpdate.value,
    },
  }, {})
    .then(response => {

      section.value = response.data.items
      totalCount.value = response.data.totalCount
      currentPage.value = response.data.page
      totalPage.value = response.data.totalPages
      rowPerPage.value = response.data.perPage

      console.log('[products.value]!!: ', section.value)
      console.log('section At StockUpdate :', whereHouseSelectedItem.value)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

watch(getSubProductCategory)

// 👉 watching current page
watch(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = section.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = section.value.length + (currentPage.value - 1) * rowPerPage.value

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
const postSubProductCategoryId = ref('')
const postSubProductCategoryName = ref('')

//------------------- Get Category -------------------
const category = ref([])

const getProductCategory = () => {
  axiosIns.get(`${urlApi.value}/api/v1/Product/Categories`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {
      category.value = response.data
      console.log('category.value', category.value)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

watch(getProductCategory)

//------------------- Get Second Category -------------------
const SecondCategory = ref([])

const getProductSecondCategory = () => {
  axiosIns.get(`${urlApi.value}/api/v1/Product/Types?`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
    params: {
      CategoryId: postProductCategoryId.value,
    },
  }, {})
    .then(response => {
      SecondCategory.value = response.data
      console.log('second category.value', category.value)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

watch(getProductSecondCategory)

//------------------- Get Second Category -------------------
const subCategory = ref([])

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

const postSubProductCategory = () => {

  const postCatData = {
    typeId: postSecondProductCategoryId.value,
    subTypeId: postSubProductCategoryId.value,
    subTypeName: postSubProductCategoryName.value,
  }

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.post(`${urlApi.value}/api/v1/SubType/Add`, postCatData, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
      'Content-Type': `application/json`,
    },
  }, {})
    .then(response => {
      isDialogVisibleBtnAdd.value = false ; isDialogVisibleBtnAdded.value = true
      getSubProductCategory()
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
const editSecProductCategoryId = ref('')
const editSecProductCategoryName = ref('')
const editSubProductCategoryId = ref('')
const editSubProductCategoryName = ref('')

const startEdit = (catId, catName, secId, secName, SubId, name) => {
  isDialogVisibleBtnEdit.value = true
  editProductCategoryId.value = catId
  editProductCategoryName.value = catName
  editSecProductCategoryId.value = secId
  editSecProductCategoryName.value = secName
  editSubProductCategoryId.value = SubId
  editSubProductCategoryName.value = name
}

const editSubProductCategory = () => {

  const postCatData = {
    typeId: editSecProductCategoryId.value,
    subTypeId: editSubProductCategoryId.value,
    subTypeName: editSubProductCategoryName.value,
  }

  console.log('catId', postCatData.catId )


  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.post(`${urlApi.value}/api/v1/SubType/Edit`, postCatData, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
      'Content-Type': `application/json`,
    },
  }, {})
    .then(response => {
      isDialogVisibleBtnEdit.value = false ; isDialogVisibleBtnEdited.value = true
      getSubProductCategory()
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
const deleteSecProductCategoryId = ref('')
const deleteSecProductCategoryName = ref('')
const deleteSubProductCategoryId = ref('')
const deleteSubProductCategoryName = ref('')

const startDelete = (catId, catName, secId, secName, SubId, name) => {
  isDialogVisibleBtnDelete.value = true
  deleteProductCategoryId.value = catId
  deleteProductCategoryName.value = catName
  deleteSecProductCategoryId.value = secId
  deleteSecProductCategoryName.value = secName
  deleteSubProductCategoryId.value = SubId
  deleteSubProductCategoryName.value = name
}

const deleteSubProductCategory = () => {
  const postCatData = ''

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.post(`${urlApi.value}/api/v1/SubType/Delete/${deleteSubProductCategoryId.value}`, postCatData, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {
      isDialogVisibleBtnDelete.value = false ; isDialogVisibleBtnDeleted.value = true
      getSubProductCategory()
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

//---------------------------- Filter -------------------------------------
const drawer = ref(null)

//----------------------------- Mock Data --------------------------------
const mockDataRole = []

const roles = ['Admin', 'Manager', 'Employee', 'Supervisor', 'Team Leader']
const names = ['John', 'Jane', 'Alice', 'Bob', 'Charlie']
const lastNames = ['Smith', 'Doe', 'Johnson', 'Brown', 'Miller']
const titles = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.']
const department = ['Manager', 'Employee', 'Supervisor', 'Team Leader', 'Admin']
const sectionMock = ['Section A', 'Section B', 'Section C', 'Section D', 'Section E']
const division = ['Division A', 'Division B', 'Division C', 'Division D', 'Division E']
const position = ['Position A', 'Position B', 'Position C', 'Position D', 'Position E']

// สร้างข้อมูลแบบสุ่ม
for (let i = 0; i < roles.length; i++) {
  const role = {
    No: i + 1,
    Role: roles[i % roles.length],
    NameUser: names[i],
    EmployeeId: '00' + (i + 1), 
    fullName: names[i] + ' ' + lastNames[i],
    email: names[i].toLowerCase() + '@example.com',
    TitleName: titles[i % titles.length],
    Department: department[i % department.length],
    Section: sectionMock[i % sectionMock.length],
    Division: division[i % division.length],
    Position: position[i % position.length],
  }

  mockDataRole.push(role)
}

console.log(mockDataRole)
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
        {{ $t("Set Permissions / Set User") }}
      </VCol>
    </VRow>
  </section>
  
  <!-- Card Search -->
  <section>
    <VRow>
      <VCol
        lg="4"
        cols="12"
      >
        <VCard>
          <VRow class="d-flex align-center pa-6 px-10">
            <!-- Search With Code -->
            <VCol cols="2">
              <VRadioGroup
                v-model="radioGroup"
                class="d-flex justify-end"
              >
                <VRadio :value="n" />
              </VRadioGroup>
            </VCol>
            <VCol cols="10">
              <VTextField
                density="compact"
                :label="$t('Search With Code')"
              />
            </VCol>
            <!-- Search With Name -->
            <VCol cols="2">
              <VRadioGroup
                v-model="radioGroup"
                class="d-flex justify-end"
              >
                <VRadio :value="n" />
              </VRadioGroup>
            </VCol>
            <VCol cols="10">
              <VTextField
                density="compact"
                :label="$t('Search By Name')"
              />
            </VCol>
            <!-- Search With SurName -->
            <VCol cols="2">
              <VRadioGroup
                v-model="radioGroup"
                class="d-flex justify-end"
              >
                <VRadio :value="n" />
              </VRadioGroup>
            </VCol>
            <VCol cols="10">
              <VTextField
                density="compact"
                :label="$t('Search By Surname')"
              />
            </VCol>
          </VRow>
        </VCard>
      </VCol>
      <VCol
        lg="8"
        cols="12"
      >
        <VCard>
          <VRow class="pa-6 px-8">
            <VCol
              cols="12"
              lg="3"
              class="d-flex align-start"
            >
              <VRadioGroup v-model="radioGroup">
                <VRadio :label="$t('Search By Group')" />
              </VRadioGroup>
            </VCol>
            <VCol
              cols="12"
              lg="9"
            >
              <VRow>
                <VCol cols="6">
                  <VSelect :label="$t('Department')" />
                </VCol>
                <VCol cols="6">
                  <VSelect :label="$t('Section')" />
                </VCol>
                <VCol cols="6">
                  <VSelect :label="$t('Section')" />
                </VCol>
                <VCol cols="6">
                  <VSelect :label="$t('Position')" />
                </VCol>
              </VRow>
            </VCol>
          </VRow>
        </VCard>
      </VCol>
    </VRow>
  </section>

  <!-- Filter navigation Add user -->
  <section>
    <VNavigationDrawer
      v-model="drawer"
      width="350"
      temporary
      location="right"
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
                  {{ $t('Add User') }}
                </h6>
              </div>
            </div>
          </VCol>
        </VRow>
      </div>


      <VDivider />

      <VList
        density="compact"
        nav
      >
        <!-- Employee Code -->
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="EmpCode"
              title="Regular"
              :label="$t('Employee Code')"
              density="compact"
            >
              <template #append-inner>
                <VIcon
                  color="primary "
                  icon="mdi-magnify"
                />
              </template>
            </VTextField>
          </VCol>
          <!-- Title Name -->
          <VCol cols="12">
            <VTextField
              v-model="EmpTitleName"
              title="Regular"
              :label="$t('Title Name')"
              density="compact"
            />
          </VCol>
          <!-- Name SurName -->
          <VCol cols="12">
            <VTextField
              v-model="EmpNameSurName"
              title="Regular"
              :label="$t('Name SurName')"
              density="compact"
            />
          </VCol>
          <!-- Department -->
          <VCol cols="12">
            <VTextField
              v-model="EmpDepart"
              title="Regular"
              :label="$t('Department')"
              density="compact"
            />
          </VCol>
          <!-- Section -->
          <VCol cols="12">
            <VTextField
              v-model="EmpSection"
              title="Regular"
              :label="$t('Section')"
              density="compact"
            />
          </VCol>
          <!-- Position -->
          <VCol cols="12">
            <VTextField
              v-model="EmpPosition"
              title="Regular"
              :label="$t('Position')"
              density="compact"
            />
          </VCol>
          <!-- Division -->
          <VCol cols="12">
            <VTextField
              v-model="EmpDivision"
              title="Regular"
              :label="$t('Division')"
              density="compact"
            />
          </VCol>
          <!-- UserName -->
          <VCol cols="12">
            <VTextField
              v-model="EmpUerName"
              title="Regular"
              :label="$t('UserName')"
              density="compact"
            />
          </VCol>
          <!-- Role -->
          <VCol cols="12">
            <VTextField
              v-model="EmpRole"
              title="Regular"
              :label="$t('Role')"
              density="compact"
            />
          </VCol>
          <!-- Email -->
          <VCol cols="12">
            <VTextField
              v-model="EmpEmail"
              title="Regular"
              :label="$t('Email')"
              density="compact"
            />
          </VCol>
        </VRow>
      </VList>
      <VRow class="d-flex align-end pa-2">
        <VCol cols="6">
          <VBtn
            style="width: 100%;"
            :to="{ 
              name: 'setPermission-defineUser-setUser-userDetails', 
              query: { EmpCode: EmpCode, EmpTitleName: EmpTitleName,
                       EmpNameSurName:EmpNameSurName,EmpDepart:EmpDepart,EmpSection:EmpSection,
                       EmpPosition:EmpPosition,EmpDivision:EmpDivision,EmpUerName:EmpUerName,EmpRole:EmpRole,
                       EmpEmail:EmpEmail,
              },
            }"
          >
            {{ $t('Confirm') }}
          </VBtn>
        </VCol>
        <VCol cols="6">
          <VBtn
            color="error"
            style="width: 100%;"
          >
            {{ $t('Cancel') }}
          </VBtn>
        </VCol>
      </VRow>
    </VNavigationDrawer>
    <VMain style="height: auto;" />
  </section>

  <!-- Card Table -->
  <section>
    <!-- ----------------        Label Page | Back           ------------------------------------ -->
    <section>
      <!-- Tag page back -->
      <div class="my-4">
        <VCard>
          <VCardTitle>
            <VRow class="d-flex justify-space-between">
              <!-- Btn Export  -->
              <VCol
                col="12"
                sm="12"
                md="6"
                lg="2"
              >
                <VBtn
                  color="warning"
                  style="width: 100%;"
                  @click="onClickExportExcel"
                >
                  <img
                    style="width: 30px; height: 30px;"
                    src="/src/assets/images/icons/vscode-icons_file-type-excel2.png"
                  >
                  {{ $t('Export file') }}
                </VBtn>
              </VCol>
              <!-- Add User  -->
              <VCol
                cols="12"
                sm="12"
                md="6"
                lg="2"
                class="d-flex justify-end justify-lg-end justify-sm-end"
              >
                <VBtn
                  style="width: 100%;"
                  class="red--text"
                  color="primary"
                  @click.stop="drawer = !drawer"
                >
                  <VIcon icon="mdi-plus" /><span class="text-white">{{ $t('Add User') }}</span>
                </VBtn>
              </VCol>
            </VRow>
          </VCardTitle>
          <VCardText>
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
                    {{ $t('Role') }}
                    <!-- ----------------------------- Menu Search By --------------------- -->
                    <VMenu
                      v-model="menusectionName"
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
                                  :label="$t('Role')"
                                />
                              </VCol>

                              <VCol
                                class="text-end"
                                cols="12"
                              >
                                <VBtn
                                  type="submit"
                                  @click="menusectionName = false"
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
                    {{ $t('Username') }}
                    <!-- ----------------------------- Menu Search By --------------------- -->
                    <VMenu
                      v-model="menusectionName"
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
                                  :label="$t('Username')"
                                />
                              </VCol>

                              <VCol
                                class="text-end"
                                cols="12"
                              >
                                <VBtn
                                  type="submit"
                                  @click="menusectionName = false"
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
                    {{ $t('Employee Code') }}
                    <!-- ----------------------------- Menu Search By --------------------- -->
                    <VMenu
                      v-model="menusectionName"
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
                                  :label="$t('Employee Code')"
                                />
                              </VCol>

                              <VCol
                                class="text-end"
                                cols="12"
                              >
                                <VBtn
                                  type="submit"
                                  @click="menusectionName = false"
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
                    {{ $t('Name Title') }}
                    <!-- ----------------------------- Menu Search By --------------------- -->
                    <VMenu
                      v-model="menusectionName"
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
                                  :label="$t('Employee Code')"
                                />
                              </VCol>

                              <VCol
                                class="text-end"
                                cols="12"
                              >
                                <VBtn
                                  type="submit"
                                  @click="menusectionName = false"
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
                    {{ $t('Name - Surname') }}
                    <!-- ----------------------------- Menu Search By --------------------- -->
                    <VMenu
                      v-model="menusectionName"
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
                                  :label="$t('Name - Surname')"
                                />
                              </VCol>

                              <VCol
                                class="text-end"
                                cols="12"
                              >
                                <VBtn
                                  type="submit"
                                  @click="menusectionName = false"
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
                    {{ $t('Department') }}
                    <!-- ----------------------------- Menu Search By --------------------- -->
                    <VMenu
                      v-model="menusectionName"
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
                                  :label="$t('Department')"
                                />
                              </VCol>

                              <VCol
                                class="text-end"
                                cols="12"
                              >
                                <VBtn
                                  type="submit"
                                  @click="menusectionName = false"
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
                    {{ $t('Section') }}
                    <!-- ----------------------------- Menu Search By --------------------- -->
                    <VMenu
                      v-model="menusectionName"
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
                                  :label="$t('Section')"
                                />
                              </VCol>

                              <VCol
                                class="text-end"
                                cols="12"
                              >
                                <VBtn
                                  type="submit"
                                  @click="menusectionName = false"
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
                    {{ $t('Division') }}
                    <!-- ----------------------------- Menu Search By --------------------- -->
                    <VMenu
                      v-model="menusectionName"
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
                                  :label="$t('Division')"
                                />
                              </VCol>

                              <VCol
                                class="text-end"
                                cols="12"
                              >
                                <VBtn
                                  type="submit"
                                  @click="menusectionName = false"
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
                    {{ $t('Position') }}
                    <!-- ----------------------------- Menu Search By --------------------- -->
                    <VMenu
                      v-model="menusectionName"
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
                                  :label="$t('Position')"
                                />
                              </VCol>

                              <VCol
                                class="text-end"
                                cols="12"
                              >
                                <VBtn
                                  type="submit"
                                  @click="menusectionName = false"
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
                    Action
                  </th>
                </tr>
              </thead>
              <!-- 👉 table body -->
              <tbody>
                <tr
                  v-for="(product, index) in mockDataRole"
                  :key="index"
                >
                  <!-- 👉 Ordinal Number -->
                  <td class="text-center">
                    {{ index+1 }}
                  </td>

                  <!-- 👉 Product categories -->
                  <td class="text-start">
                    {{ product.Role }}
                  </td>
                  <!-- 👉 Product categories -->
                  <td class="text-start">
                    {{ product.NameUser }}
                  </td>
                  <!-- 👉 Product categories -->
                  <td class="text-start">
                    {{ product.EmployeeId }}
                  </td>
                  <!-- 👉 Product categories -->
                  <td class="text-start">
                    {{ product.TitleName }}
                  </td>
                  <!-- 👉 Product categories -->
                  <td class="text-start">
                    {{ product.fullName }}
                  </td>
                  <!-- 👉 Product categories -->
                  <td class="text-start">
                    {{ product.Department }}
                  </td>
                  <!-- 👉 Product categories -->
                  <td class="text-start">
                    {{ product.Section }}
                  </td>
                  <!-- 👉 Product categories -->
                  <td class="text-start">
                    {{ product.Division }}
                  </td>
                  <!-- 👉 Product code -->
                  <td class="text-start">
                    {{ product.Position }}
                  </td>

                  <!-- 👉 Actions -->
                  <td
                    style="width: 8rem;"
                    class="text-center"
                  >
                    <VBtn
                      icon
                      variant="text"
                      size="small"
                      color="medium-emphasis"
                    >
                      <VIcon
                        size="24"
                        icon="mdi-dots-vertical"
                      />

                      <VMenu activator="parent">
                        <VList>
                          <VListItem>
                            <template #prepend>
                              <VIcon icon="mdi-eye-outline" />
                            </template>
                            <VListItemTitle>View</VListItemTitle>
                          </VListItem>
                          <VListItem
                            link
                            @click="startEdit(product.catId,product.category,product.typeId,product.typeName,product.subTypeId,product.subTypeName)"
                          >
                            <template #prepend>
                              <VIcon icon="mdi-pencil-outline" />
                            </template>
                            <VListItemTitle>Edit</VListItemTitle>
                          </VListItem>
                          <VListItem @click="startDelete(product.catId,product.category,product.typeId,product.typeName,product.subTypeId,product.subTypeName)">
                            <template #prepend>
                              <VIcon icon="mdi-delete-outline" />
                            </template>
                            <VListItemTitle>Delete</VListItemTitle>
                          </VListItem>
                        </VList>
                      </VMenu>
                    </VBtn>
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
          </VCardText>
        </VCard>
      </div>
    </section>
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
