<script setup>

//// --------------------------------------------------------------------------------------
import { ref, watchEffect } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

//-------------------------------------------------------------  Search Table Nomaly-------------------

const whereHouseSelectedItem = ref('')
const products = ref([])
const stockAdjust = ref([])

// Get access token from localStorage in another page
const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')

const whereHouse = localStorage.getItem('whereHouseName')

import { avatarText } from '@/@core/utils/formatters'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar7 from '@images/avatars/avatar-7.png'
import avatar8 from '@images/avatars/avatar-8.png'
import { VDataTable } from 'vuetify/labs/VDataTable'

const data = [
  {
    responsive_id: '',
    ordinalNumber: 95,
    approvedCancelledBy: avatar2,
    vendorName: 'Edwina Ebsworth',
    deliveryDate: 'Human Resources Assistant',
    buyer: 'eebsworth2m@sbwire.com',
    orderedByTheWarehouse: 'Puzi',
    startDate: '09/27/2018',
    references: 19586.23,
    vendorCode: '27',
    orderDate: '2 Years',
    status: 1,
    approvedCancelledDate: 'asdasdsad',
    Import: 'GGWP',
    remark: 'remark test 001',
  },
  {
    responsive_ordinalNumber: '',
    ordinalNumber: 1,
    approvedCancelledBy: avatar8,
    vendorName: 'Korrie O\'Crevy',
    deliveryDate: 'Nuclear Power Engineer',
    buyer: 'kocrevy0@thetimes.co.uk',
    orderedByTheWarehouse: 'Krasnosilka',
    startDate: '09/23/2016',
    references: 23896.35,
    vendorCode: '61',
    orderDate: '1 Year',
    status: 2,
    approvedCancelledDate: 'asdasdsad',
    Import: 'GGWP',
    remark: 'remark test 002',
  },
  {
    responsive_ordinalNumber: '',
    ordinalNumber: 7,
    approvedCancelledBy: '',
    vendorName: 'Eileen Diehn',
    deliveryDate: 'Environmental Specialist',
    buyer: 'ediehn6@163.com',
    orderedByTheWarehouse: 'Lampuyang',
    startDate: '10/15/2017',
    references: 18991.67,
    vendorCode: '59',
    orderDate: '9 Years',
    status: 3,
    approvedCancelledDate: 'asdasdsad',
    Import: 'GGWP',
    remark: 'remark test 003',
  },
  {
    responsive_ordinalNumber: '',
    ordinalNumber: 11,
    approvedCancelledBy: '',
    vendorName: 'De Falloon',
    deliveryDate: 'Sales Representative',
    buyer: 'dfalloona@ifeng.com',
    orderedByTheWarehouse: 'Colima',
    startDate: '06/12/2018',
    references: 19252.12,
    vendorCode: '30',
    orderDate: '0 Year',
    status: 4,
    approvedCancelledDate: 'asdasdsad',
    Import: 'GGWP',
    remark: 'remark test 004',
  },
  {
    responsive_ordinalNumber: '',
    ordinalNumber: 3,
    approvedCancelledBy: avatar7,
    vendorName: 'Stella Ganderton',
    deliveryDate: 'Operator',
    buyer: 'sganderton2@tuttocitta.it',
    orderedByTheWarehouse: 'Golcowa',
    startDate: '03/24/2018',
    references: 13076.28,
    vendorCode: '66',
    orderDate: '6 Years',
    status: 5,
    approvedCancelledDate: 'asdasdsad',
    Import: 'GGWP',
    remark: 'remark test 005',
  },
  {
    responsive_ordinalNumber: '',
    ordinalNumber: 5,
    approvedCancelledBy: '',
    vendorName: 'Harmonia Nisius',
    deliveryDate: 'Senior Cost Accountant',
    buyer: 'hnisius4@gnu.org',
    orderedByTheWarehouse: 'Lucan',
    startDate: '08/25/2017',
    references: 10909.52,
    vendorCode: '33',
    orderDate: '3 Years',
    status: 2,
    approvedCancelledDate: 'asdasdsad',
    Import: 'GGWP',
    remark: 'remark test 006',
  },
]

const { t } = useI18n()

const translatedOrdinalNumber = ref('')
const translatedStatus = ref('')
const translatedStartDate = ref('')
const translatedOrderDate = ref('')
const translatedReferences = ref('')
const translatedVendorCode = ref('')
const translatedVendorName = ref('')
const translatedDeliveryDate = ref('')
const translatedOrderedByTheWarehouse = ref('')
const translatedBuyer = ref('')
const translatedApprovedCancelledBy = ref('')
const translatedApprovedCancelledDate = ref('')
const translatedImport = ref('')

const translatedRemark = ref('')


// ใช้ watchEffect เพื่อให้มั่นใจว่า translatedOrdinalNumber ถูกอัปเดตเมื่อข้อความถูกแปล
watchEffect(() => {
  translatedOrdinalNumber.value = t('Ordinal Number')
  translatedStatus.value = t('Status')
  translatedStartDate.value = t('Start date')
  translatedOrderDate.value = t('Order Date')
  translatedReferences.value = t('References')
  translatedVendorCode.value = t('Vendor Code')
  translatedVendorName.value = t('Vendor Name')
  translatedDeliveryDate.value = t('Delivery Date')
  translatedOrderedByTheWarehouse.value = t('Ordered By The Warehouse')
  translatedBuyer.value = t('Buyer')
  translatedApprovedCancelledBy.value = t('Approved/Cancelled By')
  translatedApprovedCancelledDate.value = t('Approved/Cancelled Date')
  translatedImport.value = t('Import')
  translatedRemark.value = t('remark')
})

const headers = [
  {
    title: translatedOrdinalNumber,
    key: 'ordinalNumber',
  },
  {
    title: '',
    key: 'data-table-expand',
  },
  {
    title: translatedStatus,
    key: 'status',
  },
  {
    title: translatedStartDate,
    key: 'startDate',
  },
  {
    title: translatedOrderDate,
    key: 'orderDate',
  },
  {
    title: translatedReferences,
    key: 'references',
  },
  {
    title: translatedVendorCode,
    key: 'vendorCode',
  },
  {
    title: translatedVendorName,
    key: 'vendorName',
  },
  {
    title: translatedRemark,
    key: 'remark',
  },
]

const resolveStatusVariant = status => {
  if (status === 1)
    return {
      color: 'primary',
      text: 'Current',
    }
  else if (status === 2)
    return {
      color: 'success',
      text: 'Professional',
    }
  else if (status === 3)
    return {
      color: 'error',
      text: 'Rejected',
    }
  else if (status === 4)
    return {
      color: 'warning',
      text: 'Resigned',
    }
  else
    return {
      color: 'info',
      text: 'Applied',
    }
}

//---------------------------- Upload Image ---------------------------------------------
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

const nameImageUpload = ref('')
const sizeImageUpload = ref(0)
const typeImageUpload = ref('')

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

const formattedSize = imageSize => {
  return (imageSize / 1024).toFixed(2) + ' KB'
}

const processFile1 = async (file, val) => {
  const fileBinary = file instanceof File ? file : null

  nameImageUpload.value = fileBinary.name
  sizeImageUpload.value = formattedSize(fileBinary.size)

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

// reset avatar image
const resetAvatar1 = () => {
  accountDataLocal.value.avatarImg = accountData.avatarImg
  avatar.value = accountData.avatarImg
  uploadSuccess.value = false
  isDefaultChipVisible.value = false

  // console.log('Avatar has', localStorage.getItem('accountImageAvatar'))

}

const isDialogVisibleImage = ref(false)
const isDialogVisibleImage2 = ref(false)

const showAvartarImage1 = () => {
  isDialogVisibleImage.value = true
}

//--------------------------------- Dialog Success----------------------
const isDialogVisibleSuccess = ref(false)                
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
        <RouterLink :to="{ name: 'importData-importPurchaseOrder-purchaseOrderList' }">
          <IconBtn>
            <VIcon
              icon="
                mdi-chevron-left"
            />
          </IconBtn>
        </RouterLink>
        {{ $t('Import Purchase Order') }}  
      </VCol>
    </VRow>
  </section>

  <!-- ----------------       Import File | Check box Text & DeleteOP          ------------------------------------ -->
  <section>
    <VRow class="mt-2">
      <!-- Empty COl 1 -->
      <VCol
        lg="3"
        cols="12"
      />
      <!-- Btn Import File -->
      <!-- Employee Input Image -->
      <VCol
        lg="6"
        cols="12"
      >
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
            <VCard width="100%">
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
            <VCard width="100%">
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
            <VCard width="100%">
              <div class="text-center">
                <div class="text-center button-with-border">
                  <VCardText>
                    <!-- AVatar img / Name File / Size File / Icon 1 2 3 -->
                    <VRow class="d-flex align-center">
                      <!-- AVatar img -->
                      <VCol
                        lg="1"
                        cols="2"
                      >
                        <VAvatar color="primary">
                          <VIcon icon="mdi-tooltip-image-outline" />
                        </VAvatar>
                      </VCol>
                      <!-- Name File / Size File -->
                      <VCol
                        lg="5"
                        cols="10"
                      >
                        <VRow><span class="mx-4">{{ nameImageUpload }}</span></VRow>
                        <VRow><span class="mx-4">{{ sizeImageUpload }}</span></VRow>
                      </VCol>
                      <!-- Icon 1 2 3 -->
                      <VCol
                        lg="6"
                        cols="12"
                      >
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
      </VCol>
      <!-- Check box Text & DeleteOP  -->
      <VCol
        lg="3"
        cols="12"
      >
        <div>
          <VCheckbox
            v-model="checkText"
            label="Calculate Text"
          />
        </div>
        <div>
          <VCheckbox
            v-model="checkDeleteOP"
            label="Delete PO Older And Import"
          />
        </div>
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

  <!-- Dialog Show Success -->
  <section>
    <VDialog
      v-model="isDialogVisibleSuccess"
      width="500"
      height="500"
    >
      <VCard>
        <DialogCloseBtn
          variant="text"
          size="small"
          @click="isDialogVisibleSuccess = false"
        />
        <VCardText>
          <VRow>
            <VCol
              cols="12"
              class="d-flex align-center justify-center"
            >
              <VAvatar
                size="160"
                variant="tonal"
                color="success"
              >
                <VIcon
                  size="150"
                  color="success"
                  icon="mdi-check-circle"
                />
              </VAvatar>
            </VCol>
            <VCol
              cols="12"
              class="d-flex align-center justify-center"
            >
              {{ $t('Data Has Been Successfully Imported') }}
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <!-- Table -->
  <section>
    <VCard class="mt-8">
      <VCardText>
        <VDataTable
          :headers="headers"
          :items="data"
          :items-per-page="5"
          expanded
        >
          <!-- Expanded Row Data -->

          <template #expanded-row="slotProps">
            <tr class="pa-4">
              <th />
              <th />
              <th class="text-uppercase">
                {{ $t('Product Code') }}
              </th>
              <th class="text-uppercase">
                {{ $t('Product Name') }}
              </th>
              <th class="text-uppercase">
                {{ $t('Quantity') }}
              </th>
              <th class="text-uppercase">
                {{ $t('Counting Unit') }}
              </th>
              <th class="text-uppercase">
                {{ $t('Unit price') }}
              </th>
              <th class="text-uppercase">
                {{ $t('Discount') }}
              </th>
              <th />
            </tr>
            <tr>
              <td />
              <td>
                City: {{ slotProps.item.raw.city }}
              </td>
              <td>
                Experience: {{ slotProps.item.raw.experience }}
              </td>
              <td>
                Post: {{ slotProps.item.raw.post }}
              </td>
              <td>
                Experience: {{ slotProps.item.raw.start_date }}
              </td>
              <td>
                Post: {{ slotProps.item.raw.age }}
              </td>
              <td>
                -
              </td>
            </tr>
          </template>      

          <!-- full name -->
          <template #item.full_name="{ item }">
            <div class="d-flex align-center">
              <VAvatar
                size="32"
                :color="item.raw.avatar ? '' : 'primary'"
                :class="item.raw.avatar ? '' : 'v-avatar-light-bg primary--text'"
                :variant="!item.raw.avatar ? 'tonal' : undefined"
              >
                <VImg
                  v-if="item.raw.avatar"
                  :src="item.raw.avatar"
                />
                <span
                  v-else
                  class="text-sm"
                >{{ avatarText(item.raw.full_name) }}</span>
              </VAvatar>
              <div class="d-flex flex-column ms-3">
                <span class="d-block font-weight-medium text-high-emphasis text-truncate">{{ item.raw.full_name }}</span>
                <small>{{ item.raw.post }}</small>
              </div>
            </div>
          </template>

          <template #item.status="{ item }">
            <VChip
              :color="resolveStatusVariant(item.raw.status).color"
              class="font-weight-medium"
              size="small"
            >
              {{ resolveStatusVariant(item.raw.status).text }}
            </VChip>
          </template>
        </VDataTable>
      </VCardText>
      <VCardText />
    </VCard>
  </section>

  <!-- Btn Cancel / Save -->
  <section class="mt-4">
    <VRow class="d-flex justify-end">
      <VCol
        cols="6"
        sm="6"
        lg="2"
      >
        <VBtn
          style="width: 100%;"
          variant="outlined"
          color="red"
        >
          {{ $t('Cancel') }}
        </VBtn>
      </VCol>
      <VCol
        cols="6"
        sm="6"
        lg="2"
      >
        <VBtn style="width: 100%;">
          {{ $t('Save') }}
        </VBtn>
      </VCol>
    </VRow>
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

.custom-title {
  display: flex;
  align-items: center;
}

.icon-left {
  margin-inline-end: 8px; /* ปรับขนาดของ icon กับข้อความตามความต้องการ */
}
</style>


