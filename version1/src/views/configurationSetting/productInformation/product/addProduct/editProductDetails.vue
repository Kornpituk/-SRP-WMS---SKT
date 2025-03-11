<script setup>
import dashboard from '@/navigation/vertical/dashboard'
import axiosIns from '@axios'
import axios from '@axios'

import { useRouter } from 'vue-router'

//// --------------------------------------------------------------------------------------
import { onMounted, ref, watchEffect } from 'vue'

//--------------------------------------------- Import Expansion ---------------------------------
import DefineUnitCount from '../addProduct/defineUnitOfCount.vue'
import DefineCountRadio from '../addProduct/defineCountingRadio.vue'

// ----------------- Route --------------------------.
// import { useRoute } from 'vue-router'

const route = useRoute()

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

//-------------------------------------------------------------  Search Table Nomaly-------------------
// const urlApi = ref('https://webapi.easetrackwms.com')

import { urlApi } from '@/api'

const products = ref([])

const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')

const whereHouse = localStorage.getItem('whereHouseName')

//------------------- model main filter product details ---------------------------------------
const urlImage = ref('')
const urlImageParams = ref(route.query.imageShown)
const productCode = ref(route.query.productId)
const productName = ref(route.query.productName)

const catePoData = ref([])
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
const colorName = ref(route.query.productName)
const colorIDRoute = ref(route.query.colorID)
const colorNameRoute = ref(route.query.productName)

const sizeItem = ref([])
const sizeID = ref(route.query.sizeID)
const sizeName = ref(route.query.sizeName)
const sizeIDRoute = ref(route.query.sizeID)
const sizeNameRoute = ref(route.query.sizeName)

const unitItem = ref([])
const unitID = ref(route.query.unitWeightItemID)
const unitName = ref(route.query.unitWeightItemName)

const unitLengthItem = ref([])
const unitLengthID = ref(route.query.unitLengthItemID)
const unitLengthName = ref(route.query.unitLengthItemName)

const styleItem = ref([])
const styleID = ref(route.query.styleID)
const styleName = ref('')

const productModel = ref(route.query.productModel)
const versionName = ref(route.query.styleID)
const serialNumberName = ref(route.query.serialNumberName)
const bandName = ref(route.query.bandName)

const expiryDayAlertItem = ref([null])
const expiryDayAlertID = ref(null)
const expiryDayAlertName = ref(route.query.alertExpiryDateName)

const expiryDayItem = ref(['N/A'])
const expiryDayID = ref(route.query.expiryDay)
const expiryDayName = ref()

const weight = ref(route.query.weight)

//-----------------------
import { DataWeightUnit } from '@/plugins/dataGet/productData'

const unitWeightItem = ref([])

unitWeightItem.value = DataWeightUnit()

const unitWeightItemID = ref('')
const unitWeightItemName = ref('')

const wide = ref(route.query.wide)
const long = ref(route.query.long)
const hight = ref(route.query.hight)

const unit = ref(route.query.serialNumberName)

const details = ref(route.query.details)
const barcode = ref('')

const GetStockUpdate = () => {

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.get(`${urlApi.value}/api/v1/Product/ProductList?page=1`+`&perPage=5000`, {
    params: {
      productId: productCode.value,

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
      localStorage.setItem('productIdForGenCode', productCode.value)
      avatar.value = products.value[0].image
      categoriesID.value = products.value[0].categoryId
      categoriesName.value = products.value[0].categoryName
      secondCategoriesID.value = products.value[0].typeId
      secondCategoriesName.value = products.value[0].typeName
      subCategoriesID.value = products.value[0].subTypeId
      subCategoriesName.value = products.value[0].subTypeName
      productName.value = products.value[0].productName
      colorID.value = products.value[0].colorId
      colorName.value = products.value[0].color
      sizeID.value = products.value[0].sizeId
      size.value = products.value[0].size
      styleID.value = products.value[0].styleNo
      barcode.value = products.value[0].barcode
      detailsProduct.value = products.value[0].remark

      console.log('[products.value List ***]!!: ', response.data)

      
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })
}

watchEffect(GetStockUpdate)

//--------------------------------------- For Gen Product Code --------------------------------

//--------------- Get Product Category ----------------------------------
const getPoCat = () => {``
  axiosIns.get(`${urlApi.value}/api/v1/Product/Categories/All`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {

      categoriesItem.value = response.data

      console.log(typeof categoriesItem.value, '[categoriesItem]!!: ', categoriesItem)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

watch(getPoCat)

//--------------- Get Product Second Category ----------------------------------

const getPoSecCat = () => {``
  axiosIns.get(`${urlApi.value}/api/v1/Product/Types/All`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
    params: {
      CategoryId: categoriesID.value,
    },
  }, {})
    .then(response => {

      secondCategoriesItem.value = response.data

      // console.log('[secondCategoriesItem]!!: ', secondCategoriesItem)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

watch(getPoSecCat)

//--------------- Get Product Sub Category ----------------------------------

const getPoSubCat = () => {
  axiosIns.get(`${urlApi.value}/api/v1/Product/SubTypes/All`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
    params: {
      TypeId: secondCategoriesID.value,
    },
  }, {})
    .then(response => {

      subCategoriesItem.value = response.data

      // console.log('[subCategoriesItem]!!: ', subCategoriesItem)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

watch(getPoSubCat)

//--------------- Get Product Color ----------------------------------
const getColorCat = () => {``
  axiosIns.get(`${urlApi.value}/api/v1/Product/Color`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {

      colorItem.value = response.data

      // console.log('[colorItem]!!: ', colorItem)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

watch(getColorCat)

//--------------- Get Product UnitWeight ----------------------------------
const getUnitWeight = () => {``
  axiosIns.get(`${urlApi.value}/api/v1/Unit/UnitWeight`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {

      // colorItem.value = response.data

      console.log('[response]!!: ', response.data)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

watch(getUnitWeight)

//--------------- Get Product UnitLength ----------------------------------
const getUnitLength = () => {``
  axiosIns.get(`${urlApi.value}/api/v1/Unit/UnitLength`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {

      unitLengthItem.value = response.data

      console.log('[unitLengthItem.value]!!: ', response.data)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

watch(getUnitLength)

//--------------- Get Product UnitLength ----------------------------------
const getAlert = () => {``
  axiosIns.get(`${urlApi.value}/api/v1/Alert`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {

      expiryDayAlertItem.value = response.data

      console.log('[Alert.value]!!: ', expiryDayAlertItem.value)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

watch(getAlert)

//--------------- Get Product Color ----------------------------------
const getSizeCat = () => {``
  axiosIns.get(`${urlApi.value}/api/v1/Product/Size`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {

      sizeItem.value = response.data

      // console.log('[sizeItem]!!: ', sizeItem)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

watch(getSizeCat)

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

      // console.log('[unitItem]!!: ', unitItem.value)
    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

watch(getUOMCat)

//--------------------------------------- Generate Product Code --------------------
//------------------- Status Create Product Code-------------------------
const colorStatusCreate = ref('grey')
const variantBtnGenCode = ref('tonal')
const disabledBtnGenCode = ref(true)

watch(() => {
  if (categoriesID.value !== '' && secondCategoriesID.value !== '' && subCategoriesID.value !== '') {
    colorStatusCreate.value = 'orange'
    variantBtnGenCode.value = 'flat'
    disabledBtnGenCode.value = false
  }
})

const genProductCode = async () => {
  try {
    const response = await axiosIns.post(`${urlApi.value}/api/v1/Product/GenCode?`, null, {
      headers: {
        'accept': '*/*',
        'x-location': `${whereHouse}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
      params: {
        CatId: categoriesID.value,
        TypeId: secondCategoriesID.value,
        SubTypeId: subCategoriesID.value,
      },
    }, {})

    productCode.value = response.data

    localStorage.setItem('productIdForGenCode', response.data)
    console.log('result.value: ', response.data)
  } catch (error) {
    // Handle errors
    console.error('Error:', error)
  }
}

watchEffect(() => {
  console.log('productCode.value has changed:', productCode.value)
})

//------------------------------------------ Import Purchase Order -----------------------------
const uploadSuccess = ref(false)
const importErrorMassage = ref('')
const refInputEl = ref(null)

const avatar = ref(route.query.imageShown)

// const avatar = ref('')
const checkAvatarChange = ref('false')
const binaryFile = ref(null)

const accountData = {
  avatarImg: avatar,
}

const accountDataLocal = ref(structuredClone(accountData))

//--------------- Alert ----------------------------------
const showAlert = ref('false')  // เพื่อควบคุมการแสดงหรือซ่อน Alert
const alertMessage = ref('') // 
const alertType = ref('')

const loadingProcessChangeAvatar = ref(false)

const isSnackbarValidateSizeVisible = ref(false) /// SnackBar Alert when the user Upload image over sized
const isSnackbarValidateTypeVisible = ref(false) /// SnackBar Alert when the user Upload image not matching type
const isSnackbarCompleteVisible = ref(false) /// SnackBar Alert when the user Upload image Complete

const checkBtnShank = ref(true)

const showAlertMessage = async message => {
  
  if (message === 'File size exceeds the allowed limit (800 KB). Please choose a smaller file.' ||message === 'Invalid file type. Please choose a JPEG, PNG, or GIF file.' || message === 'ประเภทไฟล์ไม่ถูกต้อง โปรดเลือกไฟล์ JPEG, PNG หรือ GIF' || message === 'ขนาดไฟล์เกินขีดจำกัดที่อนุญาต (800 KB) โปรดเลือกไฟล์ที่มีขนาดเล็กลง'){
    alertType.value = 'error'
    uploadSuccess.value = false
    
  } else {
    alertType.value = 'success'
    
  }

  showAlert.value = true
  alertMessage.value = message

  // จะซ่อน Alert หลังจาก 5 วินาที
  setTimeout(() => {
    showAlert.value = false
  }, 5)
  
  
}

const changeAvatar = async file => {
  
  const { files } = file.target

  try {
    if (files && files.length) {
      const selectedFile = files[0]
      
      if (await validateFileSize(selectedFile)) {
        return
      }
      if (await validateFileType(selectedFile)) {
        return
      }
      await processFile(selectedFile)
      isSnackbarCompleteVisible.value = true
    }
  } catch (error) {
    console.error('Error processing file:', error)
  }
}

const validateFileSize = async file => {
  const maxSizeInBytes = 800 * 1024 // 800 KB
  const fileSizeExceedsLimit = file.size > maxSizeInBytes

  if (fileSizeExceedsLimit) {
    isSnackbarValidateSizeVisible.value = true
    avatar.value = route.query.imageShown
    console.log('validateFileType Avatars!', avatar.value)
    checkBtnShank.value = false

    return true
  }
  console.log('validateFileSize Start!')
  
  
  return false
}

const validateFileType = async file => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
  const isInvalidFileType = !allowedTypes.includes(file.type)

  if (isInvalidFileType) {
    isSnackbarValidateTypeVisible.value = true
    avatar.value = route.query.imageShown
    console.log('validateFileType Avatars!', avatar.value)
    checkBtnShank.value = false

    return true
  }

  return false
}

const processFile = async file => {
  const fileBinary = file instanceof File ? file : null

  if (fileBinary) {
    binaryFile.value = fileBinary
    console.log('FileBinary:', binaryFile.value)
    urlImage.value = fileBinary

    const fileReader = new FileReader()

    fileReader.readAsDataURL(fileBinary)
    
    fileReader.onload = async () => {
      if (typeof fileReader.result === 'string') {

        accountDataLocal.value.avatarImg = fileReader.result
        avatar.value = accountDataLocal.value.avatarImg
        console.log('avatar:', avatar.value)

        urlImageParams.value = accountDataLocal.value.avatarImg

        checkAvatarChange.value = 'true'

        uploadSuccess.value = true
      }
    }
  }
}

watch(() => {
  if(route.query.imageShown !== '' && avatar.value !== undefined) {
    uploadSuccess.value = true
  }
})


// ฟังก์ชันแปลง Data URL เป็น Blob
const dataURLToBlob = dataURL => {
  const parts = dataURL.split(',')
  const byteString = atob(parts[1])
  const mimeType = parts[0].split(':')[1].split(';')[0]

  const arrayBuffer = new ArrayBuffer(byteString.length)
  const uint8Array = new Uint8Array(arrayBuffer)

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i)
  }

  return new Blob([arrayBuffer], { type: mimeType })
}

const resetAvatar = () => {
  accountDataLocal.value.avatarImg = accountData.avatarImg
  avatar.value = route.query.imageShown
  localStorage.removeItem('accountImageAvatar')
  uploadSuccess.value = false
  urlImageParams.value = ''
  urlImage.value = ''

  // console.log('Avatar has', localStorage.getItem('accountImageAvatar'))

}

const isDialogVisibleImage = ref(false)

const showAvartarImage = () => {
  isDialogVisibleImage.value = true
}

//------------------------- for Dialog ------------------------------------
const isDialogVisibleStartSuccess = ref(false)

//------------------------- Save Product Data  -------------------------------
const saveProductData = async () => {
  const formData = new FormData()

  // กำหนดข้อมูลที่ต้องการส่งไปยัง API
  formData.append("ProductId", productCode.value.toString())
  formData.append("ProductName", productName.value)
  formData.append("ProductNameEng", productName.value)
  formData.append("CatId", categoriesID.value)
  formData.append("TypeId", secondCategoriesID.value)
  formData.append("SubTypeId", subCategoriesID.value)
  formData.append("ColorId", colorID.value)
  formData.append("SizeId", sizeID.value)

  // formData.append("StyleNo", styleID.value)
  // formData.append("ModelNo", productModel.value)
  // formData.append("Serial", serialNumberName.value)
  // formData.append("Brand", bandName.value)
  // formData.append("Note", details.value)
  // formData.append("PdWeight", parseInt(weight.value))
  // formData.append("PdWeightUnitid", parseInt(unitWeightItemID.value))
  // formData.append("DimensionWidth", parseInt(wide.value))
  // formData.append("DimensionLength", parseInt(long.value))
  // formData.append("DimensionHeight", parseInt(hight.value))
  // formData.append("DimensionUnitid", parseInt(expiryDayID.value))
  // formData.append("ExpireDay", parseInt(expiryDayAlertID.value))
  // formData.append("alertId", 5544)
  formData.append("img", urlImage.value)
  

  // formData.append("logo", binaryFile.value)
  
  try {
    const response = await axiosIns.post(`${urlApi.value}/api/v1/Product/Edit?`, formData, {
      headers: {
        'accept': '*/*',
        'x-location': `${whereHouse}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
    }, {})

    console.log('result.value Save Product: ', response.data)
    isDialogVisibleStartSuccess.value = true
  } catch (error) {
    console.error('Error:', error)
  }
}

//------------------------------ Params To Next Pages -------------------------------
const paramsToNextPage = ref({})

watchEffect(() => {
  console.log('Avartar:', avatar.value)
})

watch(() => {
  paramsToNextPage.value.value = {
    productCode: productCode,
    productName: productName,
    image: binaryFile,
    imageShown: urlImageParams.value,

    categoriesID: categoriesID,
    categoriesName: categoriesName,
    secondCategoriesID: secondCategoriesID,
    secondCategoriesName: secondCategoriesName,
    subCategoriesID: subCategoriesID,
    subCategoriesName: subCategoriesName,

    colorID: colorID,
    colorName: colorName,
    sizeID: sizeID,
    sizeName: sizeName,
    styleID: styleID,
                           
    productModel: productModel,
    serialNumberName: serialNumberName,
    bandName: bandName,

    weight: weight,
    unitWeightItemID: unitID,
    unitWeightItemName: unitName,
    wide: wide,
    long: long,
    hight: hight,
    whereHouse: whereHouse,
    unitLengthItemID: unitLengthID,
    unitLengthItemName: unitLengthName,

    expiryDay: expiryDayID,

    alertExpiryDate: expiryDayAlertID,
    alertExpiryDateName: expiryDayAlertName,

    details: details,
  }
})

console.log('params:', paramsToNextPage.value)

//----------------------------------------------------- Expansion ----------------------
const expandDataTitle = [
  { title: 'Defined Product Details' },
  { title: 'Defined Unit Of Radio' },
  { title: 'Defined Counting Radio' },
]

const panel = ref(0)

//*------------ Dialog Image --------------------
const isDialogImageVisible = ref(false)
const showExpansionDialog = ref(false)
const codeProduct = ref('')
const nameProduct = ref('')
const colorProduct = ref('')
const sizeProduct = ref('')
const statusProduct = ref('')
const imgProduct = ref('')
const barcodeProduct = ref('')
const categoriesProduct = ref('')
const groupProduct = ref('')
const groupSupProduct = ref('')
const totalProduct = ref('')
const unitNameProduct = ref('')
const detailsProduct = ref('')

const showDialogImage = (
  code, name, color, size, status, img, barcode, categories, group, groupSup, total, unitName, details,
) => {
  codeProduct.value = productCode
  nameProduct.value = productName
  colorProduct.value = color
  sizeProduct.value = size
  statusProduct.value = status
  imgProduct.value = avatar.value
  barcodeProduct.value = barcode
  categoriesProduct.value = categories
  groupProduct.value = group
  groupSupProduct.value = groupSup
  totalProduct.value = total
  unitNameProduct.value = unitName
  detailsProduct.value = details
  isDialogImageVisible.value = true

  console.log('showImageFunction!!')
}
</script>

<template>
  <!-- ----------------        Label Page | Back           ------------------------------------ -->
  <section>
    <!-- Label Count/Adjust && Timeline -->
    <VRow v-if="false">
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
            dot-color="warning"
            size="small"
            class="text-center"
          >
            <template #opposite>
              <RouterLink
                :to="{ 
                  name: 'configurationSetting-productInformation-product-addProduct-filterProductDetails',
                  query: paramsToNextPage.value,
                }"
              >
                {{ $t('Filter Product Details') }}
              </RouterLink>
            </template>
            <template #icon>
              <RouterLink
                :to="{ 
                  name: 'configurationSetting-productInformation-product-addProduct-filterProductDetails', 
                  query: paramsToNextPage.value, 
                }"
              >
                <div class="v-timeline-avatar-wrapper rounded-circle ">
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

          <!-- -   Define Unit Of Count   - -->
          <VTimelineItem
            size="small"
            dot-color="gray"
            class="text-center"
          >
            <template #default>
              <RouterLink
                :to="{ 
                  name: 'configurationSetting-productInformation-product-addProduct-defineUnitOfCount', 
                  query: paramsToNextPage.value, 
                }"
              >
                {{ $t('Define Unit Of Count') }}
              </RouterLink>
            </template>
            <template #icon>
              <RouterLink
                :to="{ 
                  name: 'configurationSetting-productInformation-product-addProduct-defineUnitOfCount', 
                  query: paramsToNextPage.value, 
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
                  query: paramsToNextPage.value, 
                }"
              >
                {{ $t('Define Counting Ratio') }}
              </RouterLink>
            </template>
            <template #icon>
              <RouterLink
                :to="{ 
                  name: 'configurationSetting-productInformation-product-addProduct-defineCountingRadio', 
                  query: paramsToNextPage.value, 
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
                  query: paramsToNextPage.value, 
                }"
              >
                {{ $t('Add Product Successful') }}
              </RouterLink>
            </template>
            <template #icon>
              <RouterLink
                :to="{ 
                  name: 'configurationSetting-productInformation-product-addProduct-addProductSuccessful', 
                  query: paramsToNextPage.value, 
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

    <div>
      <VCard
        height="40px"
        class="bg-primary"
      >
        <VCardTitle class="pa-1">
          <div class="d-flex justify-start align-center">
            <IconBtn
              class="cursor-pointer"
              color="#FFFFFF"
              :to="{ name: 'configurationSetting-productInformation-product-list',
              }"
            >
              <VIcon
                size="30"
                icon="ri-arrow-left-circle-fill"
              />
            </IconBtn>
            <h4 class="text-white">
              {{ $t('Edit Product') }}
            </h4>
          </div>
        </VCardTitle>
      </VCard>
    </div>
  </section>

  <!-- Dialog -->
  <!-- Dialog Save Success -->
  <section>
    <!-- Dialog Save Success -->
    <VDialog
      v-model="isDialogVisibleStartSuccess"
      persistent
      class="v-dialog-sm"
    >
      <!-- Dialog Content -->
      <VCard>
        <DialogCloseBtn
          variant="text"
          size="small"
          @click="isDialogVisibleStartSuccess = false"
        />
        <div class="py-4 text-center">
          <div class="v-timeline-avatar-wrapper rounded-circle">
            <VAvatar
              size="160"
              color="success"
              variant="tonal"
            >
              <VIcon
                icon="mdi-check-circle"
                color="success"
                size="128"
              />
            </VAvatar>
          </div>

          <VCardText>
            <span class="text-h5">{{ $t('Complete Edit Product Details!') }}</span>
          </VCardText>
        </div>
      </VCard>
    </VDialog>
    <!-- Dialog Save Not Success -->

    <!-- Dialog Image -->
    <section>
      <VDialog
        v-model="isDialogImageVisible"
        class="v-dialog-sm"
        max-width="500"
      >
        <VCard>
          <VCardTitle class="d-flex justify-space-between bg-primary">
            <div>
              <span class="text-white">{{ (nameImage) }}</span>
            </div>
            <div>
              <IconBtn
                size="30"
                @click="isDialogImageVisible = false"
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
            :src="imgProduct"
          />

      
          <VCardActions
            class="bg-primary"
            
            style="width: 100%; padding: 0;"
          >
            <VBtn
              color="red-lighten-1"
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
                      }}:&nbsp;</span>&nbsp;{{ nameProduct }}<br>
                      <span style="font-size: large; font-weight: 900;">{{
                        $t("Code")
                      }}:&nbsp;</span>&nbsp;{{ codeProduct }}<br>
                      <span style="font-size: large; font-weight: 900;">{{
                        $t("Barcode")
                      }}:&nbsp;</span>&nbsp;{{ barcode }}<br>
                    </VCol>
                    <VCol
                      cols="12"
                      lg="6"
                    >
                      <span style="font-size: large; font-weight: 900;">{{
                        $t("Categories")
                      }}:&nbsp;</span>&nbsp;{{ categoriesName }}<br>
                      <span style="font-size: large; font-weight: 900;">{{
                        $t("Group")
                      }}:&nbsp;</span>&nbsp;{{ secondCategoriesName }}<br>
                      <span style="font-size: large; font-weight: 900;">{{
                        $t("Sup Group")
                      }}:&nbsp;</span>&nbsp;{{ subCategoriesName }}<br>
                      <span style="font-size: large; font-weight: 900;">{{
                        $t("Total")
                      }}:&nbsp;</span>&nbsp;<span v-if="totalProduct">{{ (formatDecimal(totalProduct)).toLocaleString('en-US') }} {{ unitNameProduct }}<br><br></span>
                    </VCol>
                  </VRow>
                  <span style="font-size: large; font-weight: 900;">{{
                    $t("Details")
                  }}:&nbsp;</span>&nbsp;{{ detailsProduct }}
                </div>
              </VCardText>
            </div>
          </VExpandTransition>
        </VCard>
      </VDialog>
    </section>
  </section>

  <!-- -   Define Counting Radio   - -->
  <section v-if="false">
    <VCard class="pa-4">
      <!-- Product Code / Product Name / Image -->
      <section>
        <VRow>
          <!-- Product Code / Product Name -->
          <VCol
            cols="12"
            lg="8"
          >
            <VRwo>
              <VCol cols="12" />
              <!-- Product Code  -->
              <VCol cols="12">
                <VRow>
                  <VCol
                    cols="4"
                    lg="2"
                    class="d-flex align-center pa-6 justify-end"
                  >
                    <span class="d-flex align-start"><VIcon
                      size="10"
                      color="error"
                      icon="mdi-asterisk"
                    />{{ $t('Product Code') }}: </span>
                  </VCol>
                  <VCol
                    cols="8"
                    lg="6"
                    class="d-flex align-center pa-0"
                  >
                    <VTextField
                      v-model="productCode"
                      density="compact"
                      :label="$t('Product Code')"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    lg=""
                  >
                    <VBtn
                      style="width: 100%; height: 100%;"
                      rounded="lg"
                      :disabled="disabledBtnGenCode"
                      :variant="variantBtnGenCode"
                      :color="colorStatusCreate"
                      class="d-flex justify-center"
                      @click="genProductCode"
                    >
                      {{ $t('Create Product Code') }}
                    </VBtn>
                  </VCol>
                </VRow>
              </VCol>
              <!--  Product Name -->
              <VCol cols="12">
                <VRow>
                  <VCol
                    cols="4"
                    lg="2"
                    class="d-flex align-center pa-6 justify-end"
                  >
                    <span class="d-flex align-start"><VIcon
                      size="10"
                      color="error"
                      icon="mdi-asterisk"
                    />{{ $t('Product Name') }}: </span>
                  </VCol>
                  <VCol
                    cols="8"
                    lg="6"
                    class="d-flex align-center pa-0"
                  >
                    <VTextField
                      v-model="productName"
                      density="compact"
                      :label="$t('Product Name')"
                    />
                  </VCol>
                </VRow>
              </VCol>
            </VRwo>
          </VCol>
        </VRow>
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

      <!-- Product cat / Product sec cat / Product sub cat  -->
      <section>
        <VRow>
          <!-- Product cat -->
          <VCol
            cols="12"
            lg="4"
          >
            <VRow class="d-flex align-center">
              <VCol
                cols="5"
                md="2"
                lg="4"
                class="d-flex justify-end"
              >
                <VIcon
                  size="10"
                  color="error"
                  icon="mdi-asterisk"
                />{{ $t('Categories') }}:
              </VCol>
              <VCol
                cols="12"
                lg="8"
              >
                <VAutocomplete
                  v-model="categoriesID"
                  class="mb-4"
                  label="Product Categories"
                  :items="categoriesItem"
                  :custom-filter="customFilter"
                  item-title="name"
                  item-value="id"
                  density="compact"
                  clearable
                  clear-icon="mdi-close"
                  base-color="primary"
                />
              </VCol>
            </VRow>
          </VCol>
          <!-- Product sec cat -->
          <VCol
            cols="12"
            lg="4"
          >
            <VRow>
              <VCol
                cols="6"
                lg="4"
                class="d-flex align-start justify-end text-end"
              >
                <VIcon
                  size="20"
                  color="error"
                  icon="mdi-asterisk"
                />{{ $t('Second Categories') }}:
              </VCol>
              <VCol
                cols="12"
                lg="8"
              >
                <VAutocomplete
                  v-model="secondCategoriesID"
                  class="mb-4"
                  :label="$t('Second Category')"
                  :items="secondCategoriesItem"
                  :custom-filter="customFilter"
                  item-title="name"
                  item-value="id"
                  density="compact"
                  clearable
                  clear-icon="mdi-close"
                  base-color="primary"
                />
              </VCol>
            </VRow>
          </VCol>
          <!-- Product sub cat -->
          <VCol
            cols="12"
            lg="4"
          >
            <VRow>
              <VCol
                cols="6"
                lg="4"
                class="d-flex align-start  justify-end text-end"
              >
                <VIcon
                  size="20"
                  color="error"
                  icon="mdi-asterisk"
                />{{ $t('Sub Categories') }}:
              </VCol>
              <VCol
                cols="12"
                lg="8"
              >
                <VAutocomplete
                  v-model="subCategoriesID"
                  class="mb-4"
                  :label="$t('Sub Category')"
                  :items="subCategoriesItem"
                  :custom-filter="customFilter"
                  item-title="name"
                  item-value="id"
                  density="compact"
                  clearable
                  clear-icon="mdi-close"
                  base-color="primary"
                />
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
                cols="3"
                lg="4"
                class="d-flex align-start justify-end"
              >
                {{ $t('Color') }}:
              </VCol>
              <VCol
                cols="12"
                lg="8"
              >
                <VAutocomplete
                  v-model="colorID"
                  class="mb-4"
                  :label="$t('Color')"
                  :items="colorItem"
                  :custom-filter="customFilter"
                  item-title="name"
                  item-value="id"
                  density="compact"
                  clearable
                  clear-icon="mdi-close"
                  base-color="primary"
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
                cols="3"
                lg="4"
                class="d-flex align-start justify-end"
              >
                {{ $t('Size') }}:
              </VCol>
              <VCol
                cols="12"
                lg="8"
              >
                <VAutocomplete
                  v-model="sizeID"
                  class="mb-4"
                  :label="$t('Size')"
                  :items="sizeItem"
                  :custom-filter="customFilter"
                  item-title="name"
                  item-value="id"
                  density="compact"
                  clearable
                  clear-icon="mdi-close"
                  base-color="primary"
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
                lg="3"
                class="d-flex align-start justify-end"
              >
                {{ $t('Style') }}:
              </VCol>
              <VCol
                cols="9"
                lg="9"
              >
                <VTextField
                  v-model="styleID"
                  density="compact"
                  type="number"
                  :max="255"
                  :min="0"
                />
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </section>

      <!-- Product Model / Serial Number / Brands -->
      <section>
        <VRow>
          <!-- Product Model -->
          <VCol
            cols="12"
            lg="4"
          >
            <!-- Version -->
            <VRow class="d-flex align-center">
              <VCol
                cols="4"
                lg="3"
                class="d-flex justify-end"
              >
                {{ $t('Product Model') }}:
              </VCol>
              <VCol
                cols="8"
                lg="9"
              >
                <VTextField
                  v-model="productModel"
                  :label="$t('Product Model')"
                  density="compact"
                />
              </VCol>
            </VRow>
          </VCol>
          <!-- Serial Number -->
          <VCol
            cols="12"
            lg="4"
          >
            <!-- Serial Number -->
            <VRow class="d-flex align-center">
              <VCol
                cols="5"
                lg="4"
                class="d-flex justify-end px-0"
              >
                {{ $t('Serial Number') }}:
              </VCol>
              <VCol
                cols="7"
                lg="8"
              >
                <VTextField
                  v-model="serialNumberName"
                  :label="$t('Serial Number')"
                  density="compact"
                />
              </VCol>
            </VRow>
          </VCol>
          <!-- Brands -->
          <VCol
            cols="12"
            lg="4"
          >
            <!-- Band -->
            <VRow class="d-flex align-center">
              <VCol
                cols="3"
                class="d-flex justify-end"
              >
                {{ $t('Brands') }}:
              </VCol>
              <VCol cols="9">
                <VTextField
                  v-model="bandName"
                  :label="$t('Brands')"
                  density="compact"
                />
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </section>

      <!-- weight / unit / x-y-hieght-unit -->
      <section>
        <VRow>
          <!-- weight / unit -->
          <VCol
            cols="12"
            lg="6"
          >
            <VCard class="pa-4">
              <VRow>
                <!-- weight -->
                <VCol
                  cols="12"
                  lg="6"
                >
                  <VRow class="d-flex align-center">
                    <VCol
                      cols="3"
                      class="d-flex justify-end"
                    >
                      {{ $t('Weight') }}
                    </VCol>
                    <VCol cols="9">
                      <VTextField
                        v-model="weight"
                        :label="$t('Weight')"
                        density="compact"
                        type="number"
                        :min="0.00"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- unit -->
                <VCol
                  cols="12"
                  lg="6"
                >
                  <VRow class="d-flex align-center">
                    <VCol
                      cols="3"
                      class="d-flex justify-end"
                    >
                      {{ $t('Unit') }}
                    </VCol>
                    <VCol cols="9">
                      <VSelect
                        v-model="unitID"
                        :items="unitItem"
                        item-title="name"
                        item-value="id"
                        density="compact"
                        :label="$t('Unit')"
                        :placeholder="$t('Unit')"
                      />
                    </VCol>
                  </VRow>
                </VCol>
              </VRow>
            </VCard>
          </VCol>
          <!-- x-y-hieght-unit -->
          <VCol
            cols="12"
            lg="6"
          >
            <VCard class="pa-4">
              <VRow>
                <!-- width -->
                <VCol
                  cols="12"
                  lg="3"
                >
                  <VRow class="d-flex align-center">
                    <VCol
                      cols="3"
                      lg="4"
                      class="d-flex justify-end"
                    >
                      {{ $t('wide') }}:
                    </VCol>
                    <VCol
                      cols="9"
                      lg="8"
                    >
                      <VTextField
                        v-model="wide"
                        density="compact"
                        type="number"
                        placeholder="00"
                        :min="0"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- long -->
                <VCol
                  cols="12"
                  lg="3"
                >
                  <VRow class="d-flex align-center">
                    <VCol
                      cols="3"
                      lg="4"
                      class="d-flex justify-end"
                    >
                      {{ $t('Length') }}:
                    </VCol>
                    <VCol
                      cols="9"
                      lg="8"
                    >
                      <VTextField
                        v-model="long"
                        density="compact"
                        type="number"
                        placeholder="00"
                        :min="0"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- height -->
                <VCol
                  cols="12"
                  lg="3"
                >
                  <VRow class="d-flex align-center">
                    <VCol
                      cols="3"
                      lg="4"
                      class="d-flex justify-end"
                    >
                      {{ $t('Height') }}:
                    </VCol>
                    <VCol
                      cols="9"
                      lg="8"
                    >
                      <VTextField
                        v-model="hight"
                        placeholder="00"
                        density="compact"
                        type="number"
                        :min="0"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <!-- unit -->
                <VCol
                  cols="12"
                  lg="3"
                >
                  <VRow class="d-flex align-center">
                    <VCol
                      cols="3"
                      lg="4"
                      class="d-flex justify-end"
                    >
                      {{ $t('Unit') }}:
                    </VCol>
                    <VCol
                      cols="9"
                      lg="8"
                    >
                      <VSelect
                        v-model="unitLengthID"
                        :items="unitLengthItem"
                        item-title="unitname"
                        item-value="unitid"
                        :label="$t('Unit')"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCol>
              </VRow>
            </VCard>
          </VCol>
        </VRow>
      </section>

      <section>
        <VRow>
          <!-- Expiry Date | Alert  -->
          <VCol
            cols="12"
            lg="6"
          >
            <VCard>
              <VCardText>
                <VRow>
                  <!-- Expiry Date   -->
                  <VCol cols="6">
                    <VRow class="d-flex align-center">
                      <VCol
                        cols="12"
                        lg="4"
                      >
                        {{ $t('Expiry Date') }}
                      </VCol>
                      <VCol
                        cols="12"
                        lg="5"
                      >
                        <VTextField
                          v-model="expiryDayID"
                          density="compact"
                          type="number"
                          placeholder="0"
                          :min="0"
                        />
                      </VCol>
                      <VCol
                        cols="12"
                        lg="3"
                      >
                        <span>{{ $t('Days') }}</span>
                      </VCol>
                    </VRow>
                  </VCol>
                  <!--  Alert  -->
                  <VCol cols="6">
                    <VRow class="d-flex align-center">
                      <VCol
                        cols="12"
                        lg="4"
                      >
                        {{ $t('Alert') }}
                      </VCol>
                      <VCol
                        cols="12"
                        lg="8"
                      >
                        <VAutocomplete
                          v-model="expiryDayAlertID"
                          :items="expiryDayAlertItem"
                          item-title="alertName"
                          item-value="alertId"
                          :label="$t('Alert')"
                          density="compact"
                        />
                      </VCol>
                    </VRow>
                  </VCol>
                </VRow>
              </VCardText>
            </VCard>
          </VCol>
          <!-- Detail  -->
          <VCol
            cols="12"
            lg="6"
          >
            <VRow>
              <VCol
                cols="4"
                lg="2"
                class="d-flex justify-end align-center"
              >
                {{ $t('Detail') }}:
              </VCol>
              <VCol
                cols="8"
                lg="10"
              >
                <VTextarea
                  v-model="details"
                  :label="$t('Detail')"
                  auto-grow
                  rows="1"
                  row-height="15"
                  :placeholder="$t('Detail')"
                />
              </VCol>
            </VRow>
          </VCol>
        </VRow>
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
                    >
                      {{ $t('Reset') }}
                    </VBtn>
                  </VCol>
                  <VCol cols="4">
                    <VBtn
                      disabled
                      @click="saveProductData"
                    >
                      {{ $t('Save') }}
                    </VBtn>
                  </VCol>
                  <VCol cols="4">
                    <VBtn
                      color="orange"
                      :to="{ 
                        name: 'configurationSetting-productInformation-product-addProduct-defineUnitOfCount', 
                        query: paramsToNextPage.value, 
                      }"
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

      <!-- Button -->
    </VCard>
  </section>

  <!-- SnackBar Alert -->
  <div>
    <!-- SnackBar Alert Over Size -->
    <section>
      <!-- Snackbar -->
      <VSnackbar
        v-model="isSnackbarValidateSizeVisible"
        color="error"
        multi-line
      >
        {{ $t('Sorry, the product image you uploaded exceeds the size limit. Please upload an image with a size not exceeding [800 X 400 px] 2MB. Thank you.') }}

        <template #actions>
          <IconBtn @click="isSnackbarValidateSizeVisible = false , checkBtnShank = true">
            <VIcon
              size="40px"
              icon="ri-close-circle-fill"
            />
          </IconBtn>
        </template>
      </VSnackbar>
    </section>

    <!-- SnackBar Alert not match the specified format -->
    <section>
      <!-- Snackbar -->
      <VSnackbar
        v-model="isSnackbarValidateTypeVisible"
        color="error"
        multi-line
      >
        {{ $t('Sorry, the type of the product image you uploaded does not match the specified format. Please upload a file of type [JPG, PNG,]. Thank you.') }}

        <template #actions>
          <IconBtn @click="isSnackbarValidateTypeVisible = false , checkBtnShank = true">
            <VIcon
              size="40px"
              icon="ri-close-circle-fill"
            />
          </IconBtn>
        </template>
      </VSnackbar>
    </section>

    <!-- SnackBar Alert complete -->
    <section>
      <!-- Snackbar -->
      <VSnackbar
        v-model="isSnackbarCompleteVisible"
        color="primary"
        multi-line
      >
        {{ $t('Product image uploaded successfully. Thank you.') }}

        <template #actions>
          <IconBtn @click="isSnackbarCompleteVisible = false , checkBtnShank = true">
            <VIcon
              size="40px"
              icon="ri-close-circle-fill"
            />
          </IconBtn>
        </template>
      </VSnackbar>
    </section>
  </div>

  <!-- -   Expansion New Define   - -->
  <section
    v-if="true"
    class="my-2"
  >
    <!-- Btn Cancel / Save -->
    <div class="mx-2 my-2">
      <VRow class="d-flex justify-end">
        <VCol
          cols="6"
          lg="1"
        >
          <VBtn
            style="width: 100%;"
            color="red"
          >
            {{ $t('Cancel') }}
          </VBtn>
        </VCol>
        <VCol
          cols="6"
          lg="1"
        >
          <VBtn
            style="width: 100%;"
            @click="saveProductData"
          >
            {{ $t('Edit') }}
          </VBtn>
        </VCol>
      </VRow>
    </div>
    <!-- Expansion -->
    <div>
      <VExpansionPanels
        v-model="panel"
        multiple
      >
        <VExpansionPanel>
          <VExpansionPanelTitle disable-icon-rotate>
            <span style="font-size: 18px;"><strong>{{ $t('Set Product Details') }}</strong></span>
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <!-- Product Details -->
            <div>
              <!-- Image -->
              <VRow>
                <VCol cols="12">
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
                    <VCard width="100%">
                      <input
                        ref="refInputEl"
                        type="file"
                        name="file"
                        accept=".jpeg,.png,.jpg,GIF"
                        hidden
                        style="display: none;"
                        @change="changeAvatar"
                      >
                      <div>
                        <div>
                          <VBtn
                            :class="{'shake': !checkBtnShank }"
                            class="button-with-border"
                            height="200px"
                            width="100%"
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
                              <span>{{ $t ('Drag & Drop Images For Product (Or) Select') }}</span>
                            </div>
                            <div
                              v-if="importErrorMassage"
                              class="error-message"
                            >
                              <span style="color: red;font-weight: 300;">{{ importErrorMassage }}</span>
                            </div>
                            <div><span style="font-weight: 300;">{{ $t('JPG, PNG (Max 800x400px - 2Mb)') }}</span></div>
                          </VBtn>
                        </div>
                      </div>
                    </VCard>
                  </VCol>

                  <!-- Upload Image -->
                  <VCol
                    v-if="uploadSuccess"
                    cols="12"
                    lg="12"
                    class="d-flex"
                  >
                    <VCard width="100%">
                      <input
                        ref="refInputEl"
                        type="file"
                        name="file"
                        accept=".jpeg,.png,.jpg,GIF"
                        hidden
                        style="display: none;"
                        @change="changeAvatar"
                      >
                      <div class="text-center button-with-border">
                        <VRow>
                          <VCol
                            cols="12"
                            lg="11"
                          >
                            <VAvatar
                              rounded
                              size="150"
                              class="ma-4"
                              :image="avatar"
                              @click="showDialogImage"
                            />
                          </VCol>
                          <VCol
                            cols="12"
                            lg="1"
                            ripple
                            class="d-flex justify-center align-center bg-error cursor-pointer"
                            @click="resetAvatar"
                          >
                            <VIcon
                              size="50px"
                              icon="mdi-trash-can-outline"
                              @click="resetAvatar"
                            />
                          </VCol>
                        </VRow>
                      </div>
                    </VCard>
                  </VCol>
                </VCol>
              </VRow>
              <!-- Pro cate / Sec Cat / Sub Cat -->
              <VRow>
                <VCol
                  cols="12"
                  lg="4"
                >
                  <VAutocomplete
                    v-model="categoriesID"
                    class="mb-4"
                    :label="$t('Categories')"
                    :items="categoriesItem"
                    :custom-filter="customFilter"
                    item-title="name"
                    item-value="id"
                    density="compact"
                    clearable
                    clear-icon="mdi-close"
                    base-color="primary"
                  >
                    <template #prepend-inner>
                      <VIcon
                        color="red"
                        icon="ri-asterisk"
                        size="small"
                      />
                    </template>
                  </VAutocomplete>
                </VCol>
                <VCol
                  cols="12"
                  lg="4"
                >
                  <VAutocomplete
                    v-model="secondCategoriesID"
                    class="mb-4"
                    :label="$t('Product Group')"
                    :items="secondCategoriesItem"
                    :custom-filter="customFilter"
                    item-title="name"
                    item-value="id"
                    density="compact"
                    clearable
                    clear-icon="mdi-close"
                    base-color="primary"
                  >
                    <template #prepend-inner>
                      <VIcon
                        color="red"
                        icon="ri-asterisk"
                        size="small"
                      />
                    </template>
                  </VAutocomplete>
                </VCol>
                <VCol
                  cols="12"
                  lg="4"
                >
                  <VAutocomplete
                    v-model="subCategoriesID"
                    class="mb-4"
                    :label="$t('Product Sub Group')"
                    :items="subCategoriesItem"
                    :custom-filter="customFilter"
                    item-title="name"
                    item-value="id"
                    density="compact"
                    clearable
                    clear-icon="mdi-close"
                    base-color="primary"
                    placeholder
                  >
                    <template #prepend-inner>
                      <VIcon
                        color="red"
                        icon="ri-asterisk"
                        size="small"
                      />
                    </template>
                  </VAutocomplete>
                </VCol>
              </VRow>
              <!-- Pro Code -->
              <VRow>
                <VCol
                  cols="12"
                  lg="10"
                >
                  <VTextField
                    v-model="productCode"
                    density="compact"
                    :label="$t('Product Code')"
                  />
                </VCol>
                <VCol
                  cols="12"
                  lg="2"
                >
                  <VBtn
                    style="width: 100%; height: 100%;"
                    rounded="lg"
                    :disabled="disabledBtnGenCode"
                    :variant="variantBtnGenCode"
                    :color="colorStatusCreate"
                    class="d-flex justify-center"
                    @click="genProductCode"
                  >
                    {{ $t('Create Product Code') }}
                  </VBtn>
                </VCol>
              </VRow>
              <!-- Pro Name -->
              <VRow>
                <VCol cols="12">
                  <VTextField
                    v-model="productName"
                    density="compact"
                    :label="$t('Product Name')"
                  />
                </VCol>
              </VRow>
              <!-- Pro Color -->
              <VRow>
                <VCol
                  cols="12"
                  lg="4"
                >
                  <VAutocomplete
                    v-model="colorID"
                    class="mb-4"
                    :label="$t('Color')"
                    :items="colorItem"
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
                >
                  <VAutocomplete
                    v-model="sizeID"
                    class="mb-4"
                    :label="$t('Size')"
                    :items="sizeItem"
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
                >
                  <VTextField
                    v-model="styleID"
                    :label="$t('Style')"
                    density="compact"
                    type="number"
                    :max="255"
                    :min="0"
                  />
                </VCol>
              </VRow>
              <!-- Pro Model / Pro Serial / Pro Band -->
              <VRow>
                <VCol
                  cols="12"
                  lg="4"
                >
                  <VTextField
                    v-model="productModel"
                    :label="$t('Product Model')"
                    density="compact"
                  />
                </VCol>
                <VCol
                  cols="12"
                  lg="4"
                >
                  <VTextField
                    v-model="serialNumberName"
                    :label="$t('Serial Number')"
                    density="compact"
                  />
                </VCol>
                <VCol
                  cols="12"
                  lg="4"
                >
                  <VTextField
                    v-model="bandName"
                    :label="$t('Brands')"
                    density="compact"
                  />
                </VCol>
              </VRow>
              <!-- Weight / Unit -->
              <VRow>
                <VCol cols="6">
                  <VTextField
                    v-model="weight"
                    :label="$t('Weight')"
                    density="compact"
                    type="number"
                    :min="0.00"
                  />
                </VCol>
                <VCol cols="6">
                  <VSelect
                    v-model="unitID"
                    :items="unitItem"
                    item-title="name"
                    item-value="id"
                    density="compact"
                    :label="$t('Unit')"
                    :placeholder="$t('Unit')"
                  />
                </VCol>
              </VRow>
              <!-- Wide / Long / Hight -->
              <VRow>
                <VCol
                  cols="6"
                  lg="3"
                >
                  <VTextField
                    v-model="wide"
                    :label="$t('Wide')"
                    density="compact"
                    type="number"
                    placeholder="00"
                    :min="0"
                  />
                </VCol>
                <VCol
                  cols="6"
                  lg="3"
                >
                  <VTextField
                    v-model="long"
                    :label="$t('Long')"
                    density="compact"
                    type="number"
                    placeholder="00"
                    :min="0"
                  />
                </VCol>
                <VCol
                  cols="6"
                  lg="3"
                >
                  <VTextField
                    v-model="hight"
                    :label="$t('Hight')"
                    placeholder="00"
                    density="compact"
                    type="number"
                    :min="0"
                  />
                </VCol>
                <VCol
                  cols="6"
                  lg="3"
                >
                  <VSelect
                    v-model="unitLengthID"
                    :items="unitLengthItem"
                    item-title="unitname"
                    item-value="unitid"
                    :label="$t('Unit')"
                    density="compact"
                  />
                </VCol>
              </VRow>
            </div>
            <!-- Expiry Date -->
            <div>
              <VRow>
                <VCol cols="12">
                  <strong>{{ $t('Notification Of Expiration Date') }}</strong>
                </VCol>
                <VCol cols="6">
                  <VTextField
                    v-model="expiryDayID"
                    :label="$t('Expired Date')"
                    density="compact"
                    type="number"
                    placeholder="0"
                    :min="0"
                  />
                </VCol>
                <VCol cols="6">
                  <VAutocomplete
                    v-model="expiryDayAlertID"
                    :items="expiryDayAlertItem"
                    item-title="alertName"
                    item-value="alertId"
                    :label="$t('Alert')"
                    :placeholder="$t('Alert')"
                    density="compact"
                  />
                </VCol>
                <VCol cols="12">
                  <VTextarea
                    v-model="details"
                    :label="$t('Detail')"
                    auto-grow
                    rows="1"
                    row-height="15"
                    :placeholder="$t('Detail')"
                  />
                </VCol>
              </VRow>
            </div>
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
          <VExpansionPanelTitle disable-icon-rotate>
            <span style="font-size: 18px;"><strong>{{ $t('Set The Counting Unit') }}</strong></span>
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <DefineUnitCount />
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
          <VExpansionPanelTitle disable-icon-rotate>
            <span style="font-size: 18px;"><strong>{{ $t('Set Count Ratio') }}</strong></span>
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <DefineCountRadio />
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </div>
  </section>

  <section />
</template>

<style lang="scss">
.shake {
  animation: shake 1s;
  animation-iteration-count: 1;
}

@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
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

