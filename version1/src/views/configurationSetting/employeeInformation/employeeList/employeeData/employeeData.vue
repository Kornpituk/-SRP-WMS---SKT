<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { ref } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api'

const whereHouse = localStorage.getItem('whereHouseName')
const whereHouseSelectedItem = ref(whereHouse)
const Division = ref([])

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
const menuDivisionName= ref( false)
const menuDivisionLocation= ref( false)
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

      Division.value = response.data.items
      totalCount.value = response.data.totalCount
      currentPage.value = response.data.page
      totalPage.value = response.data.totalPages
      rowPerPage.value = response.data.perPage

      console.log('[products.value]!!: ', Division.value)
      console.log('Division At StockUpdate :', whereHouseSelectedItem.value)
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
  const firstIndex = Division.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = Division.value.length + (currentPage.value - 1) * rowPerPage.value

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

//--------------------------------- radio select title name -----------------------
const selectedRadio = ref('primary')

const colorsRadio = [
  'Primary',
  'Secondary',
  'Success',
  'Info',
  'Warning',
  'Error',
]

//--------------------------------- Image Upload ----------------------------------
//------------------------------------------ Import Purchase Order -----------------------------
const uploadSuccess = ref(false)
const uploadSignaSuccess = ref(false)
const importErrorMassage = ref('')
const isDefaultChipVisible = ref(false)
const importErrorMassage2 = ref('')
const isDefaultChipVisible2 = ref(false)
const refInputEl = ref()
const refInputElSigna = ref()
const avatar = ref('')
const avatarSigna = ref('')
const checkAvatarChange = ref('false')
const binaryFile = ref(null)

const nameImageUpload1 = ref('')
const sizeImageUpload1 = ref(0)

const nameImageUpload2 = ref('')
const sizeImageUpload2 = ref(0)

const accountData = {
  avatarImg: avatar,
}

const accountData2 = {
  avatarImg2: avatarSigna,
}

const accountDataLocal = ref(structuredClone(accountData))
const accountDataLocal2 = ref(structuredClone(accountData2))

//--------------- Alert ----------------------------------
const showAlert = ref('false')  // เพื่อควบคุมการแสดงหรือซ่อน Alert
const alertMessage = ref('') // 
const alertType = ref('')

//--------------- process linear ------------------------
const skill = ref(100)

const loadingProcessChangeAvatar = ref(false)

const showAlertMessage = async message => {
  
  if (message === 'File size exceeds the allowed limit (800 KB). Please choose a smaller file.' ||message === 'Invalid file type. Please choose a JPEG, PNG, or GIF file.' || message === 'ประเภทไฟล์ไม่ถูกต้อง โปรดเลือกไฟล์ JPEG, PNG หรือ GIF' || message === 'ขนาดไฟล์เกินขีดจำกัดที่อนุญาต (800 KB) โปรดเลือกไฟล์ที่มีขนาดเล็กลง'){
    alertType.value = 'error'
    uploadSuccess.value = false
    
  } else {
    alertType.value = 'success'
    
  }

  showAlert.value = true
  importErrorMassage.value = message

  // จะซ่อน Alert หลังจาก 5 วินาที
  setTimeout(() => {
    showAlert.value = false
  }, 5)
  
  
}

const showAlertMessage2 = async message => {
  
  if (message === 'File size exceeds the allowed limit (800 KB). Please choose a smaller file.' ||message === 'Invalid file type. Please choose a JPEG, PNG, or GIF file.' || message === 'ประเภทไฟล์ไม่ถูกต้อง โปรดเลือกไฟล์ JPEG, PNG หรือ GIF' || message === 'ขนาดไฟล์เกินขีดจำกัดที่อนุญาต (800 KB) โปรดเลือกไฟล์ที่มีขนาดเล็กลง'){
    alertType.value = 'error'
    uploadSuccess.value = false
    
  } else {
    alertType.value = 'success'
    
  }

  showAlert.value = true
  importErrorMassage2.value = message

  // จะซ่อน Alert หลังจาก 5 วินาที
  setTimeout(() => {
    showAlert.value = false
  }, 5)
  
  
}


const changeAvatar1 = async file => {

  const val = localStorage.getItem("18Val")
  const { files } = file.target

  isDefaultChipVisible.value = false

  try {
    if (files && files.length) {
      const selectedFile = files[0]
      
      if (await validateFileSize1(selectedFile, val)) {
        return
      }
      if (await validateFileType1(selectedFile, val)) {
        return
      }
      await processFile1(selectedFile, val)
    }
  } catch (error) {
    console.error('Error processing file:', error)
  }
}

const changeAvatar2 = async file => {

  console.log("changeAvatar2 Start!!")

  const val = localStorage.getItem("18Val")
  const { files } = file.target

  isDefaultChipVisible2.value = false

  try {
    if (files && files.length) {
      const selectedFile = files[0]
    
      if (await validateFileSize2(selectedFile, val)) {
        return
      }
      if (await validateFileType2(selectedFile, val)) {
        return
      }
      await processFile2(selectedFile, val)
    }
  } catch (error) {
    console.error('Error processing file:', error)
  }
}

const validateFileSize1 = async (file, val) => {
  const maxSizeInBytes = 800 * 1024 // 800 KB
  const fileSizeExceedsLimit = file.size > maxSizeInBytes

  if (fileSizeExceedsLimit) {
    const errorMessage = val === 'th'
      ? 'ขนาดไฟล์เกินขีดจำกัดที่อนุญาต (800 KB) โปรดเลือกไฟล์ที่มีขนาดเล็กลง'
      : 'File size exceeds the allowed limit (800 KB). Please choose a smaller file.'

    isDefaultChipVisible.value = true
    await showAlertMessage(errorMessage)
    
    return true
  }

  return false
}

const validateFileSize2 = async (file, val) => {
  console.log("validateFileSize2 Start!!")

  const maxSizeInBytes = 800 * 1024 // 800 KB
  const fileSizeExceedsLimit = file.size > maxSizeInBytes

  if (fileSizeExceedsLimit) {
    const errorMessage = val === 'th'
      ? 'ขนาดไฟล์เกินขีดจำกัดที่อนุญาต  (800 KB) โปรดเลือกไฟล์ที่มีขนาดเล็กลง'
      : 'File size exceeds the allowed limit (800 KB). Please choose a smaller file.'

    isDefaultChipVisible2.value = true
    await showAlertMessage(errorMessage)
    
    return true
  }

  return false
}

const validateFileType1 = async (file, val) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
  const isInvalidFileType = !allowedTypes.includes(file.type)

  if (isInvalidFileType) {
    const errorMessage = val === 'th'
      ? 'ประเภทไฟล์ไม่ถูกต้อง โปรดเลือกไฟล์ JPEG, PNG หรือ GIF'
      : 'Invalid file type. Please choose a JPEG, PNG, or GIF file.'

    isDefaultChipVisible.value = true
    await showAlertMessage(errorMessage)
    
    return true
  }

  return false
}

const validateFileType2 = async (file, val) => {
  console.log("validateFileType2 Start!!")

  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
  const isInvalidFileType = !allowedTypes.includes(file.type)

  if (isInvalidFileType) {
    const errorMessage = val === 'th'
      ? 'ประเภทไฟล์ไม่ถูกต้อง โปรดเลือกไฟล์ 2 JPEG, PNG หรือ GIF'
      : 'Invalid file type. Please choose a JPEG, PNG, or GIF file.'

    isDefaultChipVisible2.value = true
    await showAlertMessage(errorMessage)
    
    return true
  }

  return false
}

const formattedSize = imageSize => {
  return (imageSize / 1024).toFixed(2) + ' KB'
}

const processFile1 = async (file, val) => {
  const fileBinary = file instanceof File ? file : null

  nameImageUpload1.value = fileBinary.name
  sizeImageUpload1.value = formattedSize(fileBinary.size)

  if (fileBinary) {
    binaryFile.value = fileBinary

    const fileReader = new FileReader()

    fileReader.readAsDataURL(fileBinary)
    fileReader.onload = async () => {
      if (typeof fileReader.result === 'string') {
        accountDataLocal.value.avatarImg = fileReader.result
        avatar.value =  accountDataLocal.value.avatarImg
        checkAvatarChange.value = 'true'

        // const errorMessage = val === 'th'
        //   ? 'อัพโหลดรูปภาพให้เสร็จสิ้น 2'
        //   : 'Complete Upload Image.'

        // await showAlertMessage(errorMessage)
        uploadSuccess.value = true
      }
    }
  }
}

const processFile2 = async (file, val) => {
  console.log("processFile2 Start!!")

  const fileBinary = file instanceof File ? file : null

  nameImageUpload2.value = fileBinary.name
  sizeImageUpload2.value = formattedSize(fileBinary.size)

  if (fileBinary) {
    binaryFile.value = fileBinary

    const fileReader = new FileReader()

    fileReader.readAsDataURL(fileBinary)
    fileReader.onload = async () => {
      if (typeof fileReader.result === 'string') {
        accountDataLocal2.value.avatarImg2 = fileReader.result
        avatarSigna.value =  accountDataLocal2.value.avatarImg2
        checkAvatarChange.value = 'true'

        // const errorMessage = val === 'th'
        //   ? 'อัพโหลดรูปภาพให้เสร็จสิ้น'
        //   : 'Complete Upload Image.'

        // await showAlertMessage(errorMessage)
        uploadSignaSuccess.value = true
      }
    }
  }
}

// reset avatar image
const resetAvatar1 = () => {
  accountDataLocal.value.avatarImg = accountData.avatarImg
  avatar.value = accountData.avatarImg
  uploadSuccess.value = false
  isDefaultChipVisible.value = false

  // console.log('Avatar has', localStorage.getItem('accountImageAvatar'))

}

const resetAvatar2 = () => {
  accountDataLocal.value.avatarImg2 = accountData.avatarImg2
  avatarSigna.value = accountData.avatarImg2
  uploadSignaSuccess.value = false
  isDefaultChipVisible2.value = false

}

const isDialogVisibleImage = ref(false)
const isDialogVisibleImage2 = ref(false)

const showAvartarImage1 = () => {
  isDialogVisibleImage.value = true
}

const showAvartarImage2 = () => {
  isDialogVisibleImage2.value = true
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
        lg="10"
      >
        <RouterLink :to="{ name: 'configurationSetting-employeeInformation-employeeList-list' }">
          <IconBtn>
            <VIcon
              icon="
                mdi-chevron-left"
            />
          </IconBtn>
        </RouterLink>
        {{ $t("Employee Data") }}
      </VCol>
      <VCol
        cols="12"
        sm="6"
        md="6"
        lg="2"
        class="d-flex justify-end justify-lg-end justify-sm-end"
      >
        <VRow>
          <VCol cols="6">
            <VBtn color="red">
              {{ $t('Clear') }}
            </VBtn>
          </VCol>
          <VCol
            class="d-flex justify-end"
            cols="6"
          >
            <VBtn
              class="red--text"
              color="primary"
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
          <VCard :title="$t('Add Division')">
            <DialogCloseBtn
              variant="text"
              size="small"
              @click="isDialogVisibleBtnAdd = false"
            />

            <VCardText>
              <VRow>
                <!-- Division Code -->
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
                      {{ $t('Division Code') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('Division Code')"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Division Name -->
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
                      {{ $t('Division Name') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="postSecondProductCategoryId"
                        :label="$t('Division Name')"
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
                @click="postSubProductCategory"
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
              <span class="text-h5 text-center px-6">{{ $t('The Division Has Been Added') }}</span>
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
          <VCard :title="$t('Edit Division')">
            <DialogCloseBtn
              variant="text"
              size="small"
              @click="isDialogVisibleBtnEdit = false"
            />

            <VCardText>
              <VRow>
                <!-- Division Code -->
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
                      {{ $t('Division Code') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('Division Code')"
                        readonly
                        variant="solo-filled"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Division Name -->
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
                      {{ $t('Division Name') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="postSecondProductCategoryId"
                        :label="$t('Division Name')"
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
                @click="editSubProductCategory"
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
              <span class="text-h5">{{ $t('The Division Has Been Edited') }}</span>
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
          <VCard :title="$t('Remove Division')">
            <DialogCloseBtn
              variant="text"
              size="small"
              @click="isDialogVisibleBtnDelete = false"
            />

            <VCardText>
              <VRow>
                <!-- Division Code -->
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
                      {{ $t('Division Code') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="postProductCategoryId"
                        :label="$t('Division Code')"
                        readonly
                        variant="solo-filled"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- Division Name -->
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
                      {{ $t('Division Name') }} :
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <VTextField
                        v-model="postSecondProductCategoryId"
                        :label="$t('Division Name')"
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
                @click="deleteSubProductCategory"
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
              <span class="text-h5">{{ $t('The Division Has Been Removed') }}</span>
            </VCardText>
          </VCard>
        </VDialog>
      </div>
    </section>
  </section>
  
  <!-- ----------             Product  Easetrack                                  ------------------------------------ -->
  <section>
    <VCard class="mt-1 pa-12">
      <div>
        <VRow>
          <!-- Employee Input Data -->
          <VCol cols="6">
            <!-- Employee Code -->
            <VRow class="d-flex align-center">
              <VCol
                class="d-flex justify-end"
                cols="3"
              >
                {{ $t('Employee Code') }}:
              </VCol>
              <VCol cols="9">
                <VTextField
                  density="compact"
                  variant="solo-filled"
                  label="Employee Code"
                  readonly
                />
              </VCol>
            </VRow>
            <!-- Name Title -->
            <VRow class="d-flex align-center">
              <VCol
                class="d-flex justify-end"
                cols="3"
              >
                {{ $t('Name Title') }}:
              </VCol>
              <VCol cols="9">
                <VRadioGroup
                  v-model="inline"
                  inline
                >
                  <VRadio
                    :label="$t('Mr.')"
                    :value="$t('Mr.')"
                  />
                  <VRadio
                    :label="$t('Mrs.')"
                    :value="$t('Mrs.')"
                  />
                  <VRadio
                    :label="$t('Miss')"
                    :value="$t('Miss')"
                  />
                </VRadioGroup>
              </VCol>
            </VRow>
            <!-- Name / Surname -->
            <VRow>
              <!-- Name -->
              <VCol cols="6">
                <VRow class="d-flex align-center">
                  <VCol
                    class="d-flex justify-end"
                    cols="6"
                  >
                    {{ $t('Name') }}:
                  </VCol>
                  <VCol
                    class="d-flex align-center"
                    cols="6"
                  >
                    <VTextField
                      density="compact"
                      label="Name"
                    />
                  </VCol>
                </VRow>
              </VCol>
              <!-- Surname -->
              <VCol cols="6">
                <VRow class="d-flex align-center">
                  <VCol
                    class="d-flex justify-end"
                    cols="4"
                  >
                    {{ $t('Surname') }}:
                  </VCol>
                  <VCol cols="8">
                    <VTextField
                      density="compact"
                      label="Surname"
                    />
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
            <!-- Department -->
            <VRow class="d-flex align-center">
              <VCol
                class="d-flex justify-end"
                cols="3"
              >
                {{ $t('Department') }}:
              </VCol>
              <VCol cols="2">
                <VTextField
                  density="compact"
                  type="number"
                  min="000"
                />
              </VCol>
              <VCol cols="7">
                <VSelect
                  density="compact"
                  label="Department"
                />
              </VCol>
            </VRow>
            <!-- Section -->
            <VRow class="d-flex align-center">
              <VCol
                class="d-flex justify-end"
                cols="3"
              >
                {{ $t('Section') }}:
              </VCol>
              <VCol cols="2">
                <VTextField
                  density="compact"
                  type="number"
                  min="000"
                />
              </VCol>
              <VCol cols="7">
                <VSelect
                  density="compact"
                  label="Section"
                />
              </VCol>
            </VRow>
            <!-- Position -->
            <VRow class="d-flex align-center">
              <VCol
                class="d-flex justify-end"
                cols="3"
              >
                {{ $t('Position') }}:
              </VCol>
              <VCol cols="2">
                <VTextField
                  density="compact"
                  type="number"
                  min="000"
                />
              </VCol>
              <VCol cols="7">
                <VSelect
                  density="compact"
                  label="Position"
                />
              </VCol>
            </VRow>
            <!-- Division -->
            <VRow class="d-flex align-center">
              <VCol
                class="d-flex justify-end"
                cols="3"
              >
                {{ $t('Division') }}:
              </VCol>
              <VCol cols="2">
                <VTextField
                  density="compact"
                  type="number"
                  min="000"
                />
              </VCol>
              <VCol cols="7">
                <VSelect
                  density="compact"
                  label="Division"
                />
              </VCol>
            </VRow>
            <!-- Phone Number -->
            <VRow class="d-flex align-center">
              <VCol
                class="d-flex justify-end"
                cols="3"
              >
                {{ $t('Phone Number') }}:
              </VCol>
              <VCol cols="2">
                <VTextField
                  density="compact"
                  type="number"
                  min="000"
                />
              </VCol>
              <VCol cols="7">
                <VSelect
                  density="compact"
                  label="Phone Number"
                />
              </VCol>
            </VRow>
            <!-- Email -->
            <VRow class="d-flex align-center">
              <VCol
                class="d-flex justify-end"
                cols="3"
              >
                {{ $t('Email') }}:
              </VCol>
              <VCol cols="2">
                <VTextField
                  density="compact"
                  type="number"
                  min="000"
                />
              </VCol>
              <VCol cols="7">
                <VSelect
                  density="compact"
                  label="Email"
                />
              </VCol>
            </VRow>
          </VCol>
          <!-- Employee Input Image -->
          <VCol cols="6">
            <VRow>
              <!-- Import Image -->
              <VCol
                v-if="!uploadSuccess"
                cols="12"
                lg="12"
                class="d-flex justify-center justify-lg-end"
              >
                <VAvatar
                  rounded
                  size="auto"
                  class="me-1"
                  :image="avatar"
                />
                <VCard width="600px">
                  <input
                    ref="refInputEl"
                    type="file"
                    name="file"
                    accept=".jpeg,.png,.jpg,GIF"
                    hidden
                    style="display: none;"
                    @change="changeAvatar1"
                  >
                  <div>
                    <div>
                      <VBtn
                        class="button-with-border"
                        height="200px"
                        width="50rem"
                        prepend-icon="mdi-file-image-outline"
                        stacked
                        color="white"
                        @click="refInputEl?.click()"
                      >
                        <template #prepend>
                          <VIcon
                            size="60px"
                            color="primary"
                          />
                        </template>
                        <div style="font-weight: bolder;">
                          <span>{{ $t ('Drop Your Files Here Or') }}</span><span class="text-primary">{{ $t('Browse') }}</span>
                        </div>
                        <div><span style="font-weight: 300;">{{ $t('JPG, PNG (Max 800x400px - 2Mb)') }}</span></div>
                      </VBtn>
                    </div>
                  </div>
                </VCard>
              </VCol>
            </VRow>
            <VRow>
              <!-- Upload Image -->
              <VCol
                v-if="uploadSuccess"
                cols="12"
                lg="12"
                class="d-flex justify-end"
              >
                <VCard width="600px">
                  <input
                    ref="refInputEl"
                    type="file"
                    name="file"
                    accept=".jpeg,.png,.jpg,GIF"
                    hidden
                    style="display: none;"
                    @change="changeAvatar1"
                  >
                  <div class="text-center">
                    <div class="text-center button-with-border">
                      <VAvatar
                        rounded
                        size="150"
                        class="ma-4"
                        :image="avatar"
                        @click="showAvartarImage1"
                      />
                    </div>
                  </div>
                </VCard>
              </VCol>

              <!-- Upload Image -->
              <VCol
                v-if="uploadSuccess"
                cols="12"
                lg="12"
                class="d-flex justify-end"
              >
                <VCard width="600px">
                  <div class="text-center">
                    <div class="text-center button-with-border">
                      <VCardText>
                        <!-- AVatar img / Name File / Size File / Icon 1 2 3 -->
                        <VRow class="d-flex align-center">
                          <!-- AVatar img -->
                          <VCol cols="1">
                            <VAvatar color="primary">
                              <VIcon icon="mdi-tooltip-image-outline" />
                            </VAvatar>
                          </VCol>
                          <!-- Name File / Size File -->
                          <VCol cols="5">
                            <VRow><span class="mx-4">{{ nameImageUpload1 }}</span></VRow>
                            <VRow><span class="mx-4">{{ sizeImageUpload1 }}</span></VRow>
                          </VCol>
                          <!-- Icon 1 2 3 -->
                          <VCol cols="6">
                            <VBtn color="white">
                              <VIcon icon="mdi-pencil" />
                            </VBtn>
                            <VBtn
                              color="white"
                              @click="showAvartarImage1"
                            >
                              <VIcon
                                icon="mdi-eye"
                                @click="showAvartarImage1"
                              />
                            </VBtn>
                            <VBtn
                              color="white"
                              @click="resetAvatar1"
                            >
                              <VIcon
                                icon="mdi-trash-can-outline"
                                @click="resetAvatar1"
                              />
                            </VBtn>
                          </VCol>
                        </VRow>
                      </VCardText>
                      <VCardActions class="d-flex justify-end">
                        <VRow class="d-flex align-center">
                          <VCol cols="10">
                            <VProgressLinear
                              v-model="skill"
                              color="primary"
                              rounded
                              height="10"
                            />
                          </VCol>
                          <VCol cols="2">
                            <strong>{{ Math.ceil(skill) }}%</strong>
                          </VCol>
                        </VRow>
                      </VCardActions>
                    </div>
                  </div>
                </VCard>
              </VCol>
            </VRow>

            <!-- Signature -->
            <VRow>
              <VCol
                class="d-flex justify-end"
                cols="3"
              >
                {{ $t('Signature') }}:
              </VCol>
              <VCol cols="9">
                <VRow>
                  <!-- Import Image -->
                  <VCol
                    v-if="!uploadSignaSuccess"
                    cols="12"
                    lg="12"
                    class="d-flex justify-center justify-lg-end"
                  >
                    <VAvatar
                      rounded
                      size="auto"
                      class="me-1"
                      :image="avatarSigna"
                    />
                    <VCard
                      :subtitle="$t('Signature')"
                      width="600px"
                    >
                      <input
                        ref="refInputElSigna"
                        type="file"
                        name="file"
                        accept=".jpeg,.png,.jpg,GIF"
                        hidden
                        style="display: none;"
                        @change="changeAvatar2"
                      >
                      <div>
                        <div>
                          <VBtn
                            class="button-with-border"
                            height="200px"
                            width="50rem"
                            prepend-icon="mdi-file-image-outline"
                            stacked
                            color="white"
                            @click="refInputElSigna?.click()"
                          >
                            <template #prepend>
                              <VIcon
                                size="60px"
                                color="primary"
                              />
                            </template>
                            <div style="font-weight: bolder;">
                              <span>{{ $t ('Drop Your Files Here Or') }}</span><span class="text-primary">{{ $t('Browse') }}</span>
                            </div>
                            <div
                              v-if="importErrorMassage2"
                              class="error-message"
                            >
                              <VChip
                                closable
                                color="error"
                                @click:close="isPrimaryChipVisible2 = !isPrimaryChipVisible2"
                              >
                                <span style="font-weight: 300;">{{ importErrorMassage2 }}</span>
                              </VChip>
                            </div>
                            <div><span style="font-weight: 300;">{{ $t('JPG, PNG (Max 800x400px - 2Mb)') }}</span></div>
                          </VBtn>
                        </div>
                      </div>
                    </VCard>
                  </VCol>
                </VRow>
                <VRow>
                  <!-- Upload Image -->
                  <VCol
                    v-if="uploadSignaSuccess"
                    cols="12"
                    lg="12"
                    class="d-flex justify-end"
                  >
                    <VCard width="600px">
                      <input
                        ref="refInputElSigna"
                        type="file"
                        name="file"
                        accept=".jpeg,.png,.jpg,GIF"
                        hidden
                        style="display: none;"
                        @change="changeAvatar2"
                      >
                      <div class="text-center">
                        <div class="text-center button-with-border">
                          <VAvatar
                            rounded
                            size="150"
                            class="ma-4"
                            :image="avatarSigna"
                            @click="showAvartarImage2"
                          />
                        </div>
                      </div>
                    </VCard>
                  </VCol>

                  <!-- Upload Image -->
                  <VCol
                    v-if="uploadSignaSuccess"
                    cols="12"
                    lg="12"
                    class="d-flex justify-end"
                  >
                    <VCard width="600px">
                      <div class="text-center">
                        <div class="text-center button-with-border">
                          <VCardText>
                            <!-- AVatar img / Name File / Size File / Icon 1 2 3 -->
                            <VRow class="d-flex align-center">
                              <!-- AVatar img -->
                              <VCol cols="1">
                                <VAvatar color="primary">
                                  <VIcon icon="mdi-tooltip-image-outline" />
                                </VAvatar>
                              </VCol>
                              <!-- Name File / Size File -->
                              <VCol cols="5">
                                <VRow><span class="mx-4">{{ nameImageUpload2 }}</span></VRow>
                                <VRow><span class="mx-4">{{ sizeImageUpload2 }}</span></VRow>
                              </VCol>
                              <!-- Icon 1 2 3 -->
                              <VCol cols="6">
                                <VBtn color="white">
                                  <VIcon icon="mdi-pencil" />
                                </VBtn>
                                <VBtn
                                  color="white"
                                  @click="showAvartarImage2"
                                >
                                  <VIcon
                                    icon="mdi-eye"
                                    @click="showAvartarImage2"
                                  />
                                </VBtn>
                                <VBtn
                                  color="white"
                                  @click="resetAvatar2"
                                >
                                  <VIcon
                                    icon="mdi-trash-can-outline"
                                    @click="resetAvatar2"
                                  />
                                </VBtn>
                              </VCol>
                            </VRow>
                          </VCardText>
                          <VCardActions class="d-flex justify-end">
                            <VRow class="d-flex align-center">
                              <VCol cols="10">
                                <VProgressLinear
                                  v-model="skill"
                                  color="primary"
                                  rounded
                                  height="10"
                                />
                              </VCol>
                              <VCol cols="2">
                                <strong>{{ Math.ceil(skill) }}%</strong>
                              </VCol>
                            </VRow>
                          </VCardActions>
                        </div>
                      </div>
                    </VCard>
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </div>
    </VCard>
  </section>

  <!-- Dialog show card -->
  <section>
    <VDialog
      v-model="isDialogVisibleImage"
      height="500"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard>
        <VImg
          class="align-end text-white"
          height="500"
          :src="avatar"
          cover
        >
          <VCardTitle>
            <DialogCloseBtn
              variant="text"
              @click="isDialogVisibleImage = false"
            />
          </VCardTitle>
        </VImg>
      </VCard>
    </VDialog>
  </section>

  <!-- Dialog show card Error -->
  <section>
    <VDialog
      v-model="isDefaultChipVisible"
      width="500"
      height="500"
    >
      <!-- Dialog Content -->
      <VCard>
        <DialogCloseBtn
          variant="text"
          size="small"
          @click="isDefaultChipVisible = false"
        />

        <VCardText>
          <div class="d-flex align-items-center justify-center">
            <VAvatar size="150">
              <VIcon
                size="350"
                color="red"
                icon="mdi-alpha-x-circle"
              />
            </VAvatar>
          </div>
          <span style="font-weight: 300;">{{ importErrorMassage }}</span>
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn @click="isDefaultChipVisible = false">
            I accept
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </section>

  <!-- Dialog show card 2 -->
  <section>
    <VDialog
      v-model="isDialogVisibleImage2"
      height="500"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard>
        <VImg
          class="align-end text-white"
          height="500"
          :src="avatarSigna"
          cover
        >
          <VCardTitle>
            <DialogCloseBtn
              variant="text"
              @click="isDialogVisibleImage2 = false"
            />
          </VCardTitle>
        </VImg>
      </VCard>
    </VDialog>
  </section>

  <!-- Dialog show card Error -->
  <section>
    <VDialog
      v-model="isDefaultChipVisible2"
      width="500"
      height="500"
    >
      <!-- Dialog Content -->
      <VCard>
        <DialogCloseBtn
          variant="text"
          size="small"
          @click="isDefaultChipVisible2 = false"
        />

        <VCardText>
          <div class="d-flex align-items-center justify-center">
            <VAvatar size="150">
              <VIcon
                size="350"
                color="red"
                icon="mdi-alpha-x-circle"
              />
            </VAvatar>
          </div>
          <span style="font-weight: 300;">{{ importErrorMassage }}</span>
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn @click="isDefaultChipVisible2 = false">
            I accept
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
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

.button-with-border {
  border: 3px dotted rgb(131, 131, 131); /* เส้นกรอบจุดๆ ด้วยสีดำ */
  border-radius: 10px; /* กำหนดรูปร่างของเส้นกรอบเป็นมนูมให้มีเส้นโค้งขนานกับมุม */
}
</style>

