<script setup>
import avatar1 from '@images/avatars/avatar-1.png'
import axiosIns from '@axios'

const avatar = ref('')
const avatarEmpty = ref('')

const accountData = {
  avatarImg: avatarEmpty.value,
  firstName: 'john',
  lastName: 'Doe',
  email: 'johnDoe@example.com',
  org: 'Pixinvent',
  phone: '+1 (917) 543-9876',
  address: '123 Main St, New York, NY 10001',
  state: 'New York',
  zip: '10001',
  country: 'USA',
  language: 'English',
  timezone: '(GMT-11:00) International Date Line West',
  currency: 'USD',
}

const refInputEl = ref()
const isConfirmDialogOpen = ref(false)
const accountDataLocal = ref(structuredClone(accountData))
const isAccountDeactivated = ref(false)
const validateAccountDeactivation = [v => !!v || 'Please confirm account deactivation']

//--------------------- model for update company information ---------------------
const companyCode = ref('')
const companyName = ref('')
const subCompanyName = ref('')
const companyAddress = ref('')
const companyState = ref('')
const companyDistrict = ref('')
const companyZipCode = ref('')
const companyProvince = ref('')
const companyAddressAll = ref('')
const companyPhone = ref('')
const companyFex = ref('')
const companyEmail = ref('')
const companyIdLine = ref('')
const companyCodeText = ref('')
const companyText = ref(1.11)

const companyLogo = ref('')
const companyLogoLocal = ref('')


//------------------------------- model Company Information --------------------

watch(()=> {
  companyName.value = localStorage.getItem('companyName')
  companyCode.value = localStorage.getItem('companyId')
})

const resetForm = () => {
  companyCode.value = ''
  companyName.value = ''
  subCompanyName.value = ''
  companyAddress.value = ''
  companyState.value = ''
  companyDistrict.value = ''
  companyZipCode.value = ''
  companyProvince.value = ''
  companyAddressAll.value = ''
  companyPhone.value = ''
  companyFex.value = ''
  companyEmail.value = ''
  companyIdLine.value = ''
  companyCodeText.value = ''
  companyText.value = ''
}

const checkAvatarChange = ref('false')
const binaryFile = ref(null)

//--------------- Alert ----------------------------------
const showAlert = ref('false')  // เพื่อควบคุมการแสดงหรือซ่อน Alert
const alertMessage = ref('') // 
const alertType = ref('')

const loadingProcessChangeAvatar = ref(false)

const showAlertMessage = async message => {
  
  if (message === 'File size exceeds the allowed limit (800 KB). Please choose a smaller file.' ||message === 'Invalid file type. Please choose a JPEG, PNG, or GIF file.' || message === 'ประเภทไฟล์ไม่ถูกต้อง โปรดเลือกไฟล์ JPEG, PNG หรือ GIF' || message === 'ขนาดไฟล์เกินขีดจำกัดที่อนุญาต (800 KB) โปรดเลือกไฟล์ที่มีขนาดเล็กลง'){
    alertType.value = 'error'
    
    loadingProcessChangeAvatar.value = false
  } else {
    alertType.value = 'success'
    
    loadingProcessChangeAvatar.value = false
  }

  showAlert.value = true
  alertMessage.value = message

  // จะซ่อน Alert หลังจาก 5 วินาที
  setTimeout(() => {
    showAlert.value = false
  }, 5)
  
  
}

//--------------------------------------- upload avatar --------------------------------

const changeAvatar = async file => {
  
  const val = localStorage.getItem("18Val")
  const { files } = file.target

  loadingProcessChangeAvatar.value = true
  try {
    if (files && files.length) {
      const selectedFile = files[0]
      
      if (await validateFileSize(selectedFile, val)) {
      
        return
      }
      if (await validateFileType(selectedFile, val)) {

        return
      }
      await processFile(selectedFile, val)
    }
  } catch (error) {
  }
  console.error('Error processing file:', error)
}

const validateFileSize = async (file, val) => {
  const maxSizeInBytes = 800 * 1024 // 800 KB
  const fileSizeExceedsLimit = file.size > maxSizeInBytes

  if (fileSizeExceedsLimit) {
    const errorMessage = val === 'th'
      ? 'ขนาดไฟล์เกินขีดจำกัดที่อนุญาต (800 KB) โปรดเลือกไฟล์ที่มีขนาดเล็กลง'
      : 'File size exceeds the allowed limit (800 KB). Please choose a smaller file.'

    await showAlertMessage(errorMessage)
    
    return true
  }

  return false
}

const validateFileType = async (file, val) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
  const isInvalidFileType = !allowedTypes.includes(file.type)

  if (isInvalidFileType) {
    const errorMessage = val === 'th'
      ? 'ประเภทไฟล์ไม่ถูกต้อง โปรดเลือกไฟล์ JPEG, PNG หรือ GIF'
      : 'Invalid file type. Please choose a JPEG, PNG, or GIF file.'

    await showAlertMessage(errorMessage)
    
    return true
  }

  return false
}

const processFile = async  (file, val) => {
  const fileBinary = file instanceof File ? file : null

  if (fileBinary) {
    binaryFile.value = fileBinary

    const fileReader = new FileReader()

    fileReader.readAsDataURL(fileBinary)
    fileReader.onload = async () => {
      if (typeof fileReader.result === 'string') {
        accountDataLocal.value.avatarImg = fileReader.result
        localStorage.setItem('accountImageAvatar', accountDataLocal.value.avatarImg)
        avatar.value = localStorage.getItem('accountImageAvatar')
        checkAvatarChange.value = 'true'

        const errorMessage = val === 'th'
          ? 'อัพโหลดรูปภาพให้เสร็จสิ้น'
          : 'Complete Upload Image.'

        await showAlertMessage(errorMessage)
        loadingProcessChangeAvatar.value = false
      }
    }
  }
}


watchEffect(() => {
  // console.log('accountImageAvatar:', localStorage.getItem('accountImageAvatar'))
})

avatar.value = localStorage.getItem('accountImageAvatar')



const submitSettingsAccount = () => {
  console.log('Form is working!')
  if (checkAvatarChange) {
    postCompanySave()
    console.log('Avatar has changed!')
  } else {
    console.log('Avatar has not changed.')
  }
  
}

// reset avatar image
const resetAvatar = () => {
  accountDataLocal.value.avatarImg = accountData.avatarImg
  avatar.value = accountData.avatarImg
  localStorage.removeItem('accountImageAvatar')

  // console.log('Avatar has', localStorage.getItem('accountImageAvatar'))

}

//--------------------------------- API Get Company Logo --------------------------
import { urlApi } from '@/api'


const companyLogoReal = ref(null)

// Get access token from localStorage in another page
const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')

const whereHouse = localStorage.getItem('whereHouseName')

const logoCom = ref('')

const getCompanyLogo = () => {

  axiosIns.get(`${urlApi.value}/api/v1/Company/logo?`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {
      const result = response.data

      avatar.value = result
      console.log('avatar.value result', avatar.value)

    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })
}

// watch(getCompanyLogo)

const getDataCompany = () => {

  axiosIns.get(`${urlApi.value}/api/v1/Company`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {
      const result = response.data

      avatar.value = result.logo
      console.log('logoCompany com:', avatar)

    })
    .catch(error => {
    // Handle errors
      console.error('Error:', error)
    })
}

watch(getDataCompany)

// ตรวจสอบว่าเป็น URL หรือไม่
function isUrl(value) {
  // ใช้ Regular Expression สำหรับตรวจสอบ URL
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
  
  return urlPattern.test(value)
}

// ตรวจสอบว่าเป็น base64 string หรือไม่
function isBase64(value) {
  // ใช้ Regular Expression สำหรับตรวจสอบ base64 string
  const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/
  
  return base64Pattern.test(value) && value.length % 4 === 0
}


const file = ref([])

watchEffect()(() => {
  console.log('file:', file)
})


//-------------------------------------- API Post Company Save ------------------------------
const postCompanySave = () => {
  const formData = new FormData()

  // กำหนดข้อมูลที่ต้องการส่งไปยัง API
  formData.append("CompanyName", companyName.value)
  formData.append("Branch", companyCode.value)
  formData.append("Addr", companyAddress.value)
  formData.append("Road", companyState.value)
  formData.append("Tumbol", "Tumbol1")
  formData.append("Amphur", companyDistrict.value)
  formData.append("Province", companyProvince.value)
  formData.append("FullAddr", companyAddressAll.value)
  formData.append("Zipcode", companyZipCode.value)
  formData.append("Tel", companyPhone.value)
  formData.append("Fax", companyFex.value)
  formData.append("TaxId", companyCodeText.value)
  formData.append("Email", companyEmail.value)
  formData.append("IdLine", companyIdLine.value)
  formData.append("Vat1", companyText.value)
  
  // นำรูปภาพมาเพิ่มใน FormData
  // formData.append("logo", file.value[0], file.value[0].name)
  // console.log('file in post', file.value[0])

  formData.append("logo", binaryFile.value)
  console.log('file in post', binaryFile.value)

  axiosIns.post(`${urlApi.value}/api/v1/Company/Save`, formData, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
      'Content-Type': 'multipart/form-data', // ตั้งค่า Content-Type เป็น multipart/form-data
    },
  })
    .then(response => {
      console.log('Company Save', response.data)
    })
    .catch(error => {
      console.error('Error:', error)
    })
}

const rulesImage = () =>{
  return !value || !value.length || value[0].size < 1 || 'Avatar size should be less than 2 MB!'
}

console.log('avatar', avatar)
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard :title="$t('Company Information')">
        <!-- Upload Image -->
        <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            size="120"
            class="me-6"
            :src="avatar"
          >
            <VImg :src="avatar" />
          </VAvatar>
          <!-- 👉 Upload Photo -->
          <form
            ref="refForm"
            class="d-flex flex-column justify-center gap-3"
          >
            <div class="d-flex flex-wrap gap-4">
              <VBtn
                color="primary"
                @click="refInputEl?.click()"
              >
                <VIcon
                  icon="mdi-cloud-upload-outline"
                  class="d-sm-none"
                />
                <span class="d-none d-sm-block">{{ $t('Upload New Photo') }}</span>
              </VBtn>

              <input
                ref="refInputEl"
                type="file"
                name="file"
                accept=".jpeg,.png,.jpg,GIF"
                hidden
                @input="changeAvatar"
              >

              <VBtn
                type="reset"
                color="error"
                variant="tonal"
                @click="resetAvatar"
              >
                <span class="d-none d-sm-block">{{ $t('Reset') }}</span>
                <VIcon
                  icon="mdi-refresh"
                  class="d-sm-none"
                />
              </VBtn>
              <VProgressCircular
                v-if="loadingProcessChangeAvatar"
                :size="40"
                color="primary"
                indeterminate
              />
            </div>

            <p class="mb-0">
              {{ $t('Allowed JPG, GIF, Or PNG. Max Size Of 800K') }}
            </p>
            
            <VAlert
              v-if="!showAlert"
              :type="alertType"
            >
              {{ alertMessage }}
            </VAlert>
          </form>
        </VCardText>
        <!-- From Text Input -->
        <VCardText>
          <!-- 👉 Form -->
          <VForm
            class="mt-6"
            @submit.prevent="postCompanySave"
          >
            <VRow>
              <!-- 👉 Company Code -->
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="companyCode"
                  :placeholder="$t('Company Code')"
                  :label="$t('Company Code')"
                />
              </VCol>
              <!-- 👉 Company Name -->
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="companyName"
                  :placeholder="$t('Company Name')"
                  :label="$t('Company Name')"
                />
              </VCol>
              <!-- 👉 Company Sub Name -->
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="subCompanyName"
                  :placeholder="$t('Store')"
                  :label="$t('Store')"
                />
              </VCol>
              <!-- 👉 Company Address -->
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="companyAddress"
                  :placeholder="$t('Address')"
                  :label="$t('Address')"
                />
              </VCol>
              <!-- 👉 Company State -->
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="companyState"
                  :placeholder="$t('Road/Street')"
                  :label="$t('Road/Street')"
                />
              </VCol>

              <!-- 👉 Company District -->
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="companyDistrict"
                  :placeholder="$t('Sub-District/ Sub-Area')"
                  :label="$t('Sub-District/ Sub-Area')"
                />
              </VCol>
              <!-- 👉 Company ZipCode -->
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="companyZipCode"
                  :placeholder="$t('Postal Code')"
                  :label="$t('Postal Code')"
                />
              </VCol>
              <!-- 👉 Company Province -->
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="companyProvince"
                  :placeholder="$t('Province')"
                  :label="$t('Province')"
                />
              </VCol>
              <!-- 👉 Company AddressAll -->
              <VCol
                md="12"
                cols="12"
              >
                <VTextField
                  v-model="companyAddressAll"
                  :placeholder="$t('Address All')"
                  :label="$t('Address All')"
                />
              </VCol>
              <!-- 👉 Company Phone -->
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="companyPhone"
                  :placeholder="$t('Phone Number')"
                  :label="$t('Phone Number')"
                />
              </VCol>
              <!-- 👉 Company Fex -->
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="companyFex"
                  :placeholder="$t('Fax')"
                  :label="$t('Fax')"
                />
              </VCol>
              <!-- 👉 Company Email -->
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="companyEmail"
                  :placeholder="$t('Email')"
                  :label="$t('Email')"
                />
              </VCol>
              <!-- 👉 Company IdLine -->
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="companyIdLine"
                  :placeholder="$t('ID Line')"
                  :label="$t('ID Line')"
                />
              </VCol>
              <!-- 👉 Company CodeText -->
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="companyCodeText"
                  :placeholder="$t('Tax ID Number')"
                  :label="$t('Tax ID Number')"
                />
              </VCol>
              <!-- 👉 Company Text -->
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="companyText"
                  :placeholder="$t('Tax')"
                  :label="$t('Tax')"
                />
              </VCol>
              <!-- 👉 Form Actions -->
              <VCol
                cols="12"
                class="d-flex flex-wrap gap-4 justify-end"
              >
                <VBtn
                  color="red"
                  type="cancel"
                  variant="outlined"
                  @click.prevent="resetForm"
                >
                  {{ $t('Cancel') }}
                </VBtn>
                <VBtn type="submit">
                  {{ $t('Save') }}
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <!-- 👉 Delete Account -->
    </VCol>
  </VRow>

  <!-- 👉 Confirm Dialog -->
  <ConfirmDialog
    v-model:isDialogVisible="isConfirmDialogOpen"
    confirmation-msg="Are you sure you want to deactivate your account?"
  />
</template>
