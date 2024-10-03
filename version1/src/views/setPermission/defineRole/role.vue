<script setup>
import urlImageTh from '@images/avatars/avatar-1.png'
import urlImageAddRole from '@images/pages/addRole.png'

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


//-------------------------------------- format date ---------------

const formatDate = date => {
  const dateObj = new Date(date)
  const formattedDate = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`
  const formattedTime = `${dateObj.getHours()}:${dateObj.getMinutes() < 10 ? '0' : ''}${dateObj.getMinutes()}`
  
  return `${formattedDate} ${formattedTime}`
}

//-------------------------------------- Mock Data -----------------------

const mockDataRole = []

const roles = ['Admin', 'Manager', 'Employee', 'Supervisor', 'Team Leader']
const names = ['John', 'Jane', 'Alice', 'Bob', 'Charlie']
const lastNames = ['Smith', 'Doe', 'Johnson', 'Brown', 'Miller']
const titles = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.']

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
  }

  mockDataRole.push(role)
}

// แสดงผลลัพธ์
// console.log(mockDataRole)
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
        {{ $t("Set Permissions / Define Roles") }}
      </VCol>
    </VRow>
  </section>
  
  <!-- Card Information Role -->
  <section>
    <VRow>
      <VCol
        v-for="(user, index) in mockDataRole"
        :key="index"
        cols="12"
        sm="12"
        lg="3"
      >
        <VCard
          max-width="400"
          height="165"
        >
          <VCardTitle>
            <VRow>
              <VCol cols="6">
                <VAvatar><VIcon color="primary" icon="mdi-account-circle" /></VAvatar><span>{{ user.Role }}</span>
              </VCol>
              <VCol
                cols="6"
                class="d-flex justify-end align-center"
              >
                <VIcon
                  size="x-small"
                  icon="mdi-star-outline"
                />
                <VIcon
                  size="x-small"
                  icon="mdi-dots-vertical"
                />
              </VCol>
            </VRow>
          </VCardTitle>
          <VCardText class="d-flex" />
          <VCardActions class="d-flex align-end">
            <VRow>
              <VCol
                cols="10"
                class="d-flex align-center"
              >
                <span>ID: {{ user.EmployeeId }}&nbsp;&nbsp;</span>
                <span>Name : {{ user.fullName }}</span>
              </VCol>
              <VCol
                class="d-flex justify-end align-center"
                cols="2"
              >
                <span><VAvatar :image="urlImageTh"><img
                  style="width: 30px;"
                  :src="urlImageTh"
                ></VAvatar></span>
              </VCol>
            </VRow>
          </VCardActions>
        </VCard>
      </VCol>
      <VCol
        cols="12"
        sm="12"
        lg="3"
      >
        <VCard max-width="400">
          <VCardTitle>
            <VRow>
              <VCol cols="6">
                <VImg
                  style="height: 150px;"
                  :src="urlImageAddRole"
                />
              </VCol>
              <VCol
                class="d-flex justify-end align-center"
                cols="6"
              >
                <VBtn :to="{ name: 'setPermission-defineRole-winApp-winApp' }">
                  Add Role
                </VBtn>
              </VCol>
            </VRow>
          </VCardTitle>
        </VCard>
      </VCol>
    </VRow>
  </section>

  <!-- Card Table -->
  <section>
    <!-- ----------------        Label Page | Back           ------------------------------------ -->
    <section>
      <!-- Tag page back -->
      <div class="my-4">
        <VCard>
          <VCardTitle>
            <VRow>
              <!-- Btn Export  -->
              <VCol
                col="12"
                sm="6"
                md="6"
                lg="1"
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
              <!-- Empty  -->
              <VCol cols="7" />
              <!-- Search / btn Search  -->
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
                      color="primary"
                      @click="isDialogVisibleBtnAdd = true"
                    >
                      <span class="text-white">{{ $t('Search') }}</span>
                    </VBtn>
                  </VCol>
                </VRow>
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
                    {{ $t('Gmail') }}
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
                                  :label="$t('Gmail')"
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
                  <!-- 👉 Product code -->
                  <td class="text-start">
                    {{ product.email }}
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
