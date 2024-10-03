<script setup>
import { ref } from "vue"

const items = ref([
  { sktLotNo: '', productCode: '', tradeName: '', netWeight: '', packing: '', quantity: '', customerName: '', deliveryPlace: '' },
  { sktLotNo: '', productCode: '', tradeName: '', netWeight: '', packing: '', quantity: '', customerName: '', deliveryPlace: '' },
])

const exportT = ref(false)
const domestic = ref(false)
const conditions = ref({ shippingMark: false, sanyoChemical: false })
const checkedBy = ref('')
const preparedBy = ref('')
const driverCheckedBy = ref('')


const checkboxOne = ref(false)

const checkboxThree = ref(true)
const checkboxTwo = ref(false)

import image01 from '../image/01.png'
import image02 from '../image/02.png'
import image03 from '../image/03.png'

const selectedLanguage = ref([])

const addItemsLang = item => {
  const index = selectedLanguage.value.indexOf(item)
  if (index === -1) {
    selectedLanguage.value.push(item)
  } else {
    selectedLanguage.value.splice(index, 1)
  }
  console.log('Log Lang Add', selectedLanguage.value)
}

const specialRequests = ref([
  { checked: false, shippingMark: 'SHIPPING MARK 1', dash: '--' },
  { checked: false, shippingMark: 'PR2E(1)2312', dash: '--' },
  { checked: false, shippingMark: 'SAN~O CHEMICAL', dash: '--' },
  { checked: false, shippingMark: 'KYO~O / JAPAN', dash: '--' },
  { checked: false, shippingMark: 'ส่ง ตัวอย่าง 250 g = 1 ขวด/Lot ให้ SCI พร้อมแนบไปกับสินค้า', dash: '--' },
  { checked: false, shippingMark: 'ตืดฉลากภาษาญี่ปุ่นและภาษาอังกฤษ', dash: '--' },
])

const languageLabels = ref([
  { language: 'Thai' },
  { language: 'English' },
  { language: 'Japanese' },
  { language: 'Chinese' },
  { language: 'Malaysia' },
  { language: 'SDS' },
])

const selectedPicture = ref([
  { image02: 'path/to/image02.jpg' },
  { image03: 'path/to/image03.jpg' },
])

const validateAfterPicking = ref([
  { item: 'สินค้ากับฉลากตรงกัน' },
  { item: 'มีฉลากติดตรงจุดที่กำหนด' },
  { item: 'ฉลากไม่ฉีกขาด' },
  { item: 'ชื่อและLot no.บนฉลากถูกต้อง' },
  { item: 'ฉลากมีทั้ง2ภาษาและติดคู่กันถูกต้อง' },
])

const resaleProductShipping = ref([
  { truckNo: 'SEGU2382128', sKTLotNo: 'PC2311000B', supplierLotNo: '4500178132/0320',  productCode: 'CHEMICAL PR-029',  tradeName: 'CHEMICAL PR-029',  packaging: 'DM',  netContent: '200',   amount: '8',   quantity: '1,800.00',  customerName: 'INNOVATIVE CHEMICALS', deliveryPlace: 'SKT', appearanceCheck: true, remark: '12 Bags X 1 พาเลท', files: [] },
  { truckNo: 'SEGU6545181', sKTLotNo: 'PC2311001C', supplierLotNo: '4500178133/0321',  productCode: 'CHEMICAL PR-030',  tradeName: 'CHEMICAL PR-030',  packaging: 'DM',  netContent: '300',   amount: '10',   quantity: '2,000.00',  customerName: 'ADVANCED CHEMICALS', deliveryPlace: 'SKT', appearanceCheck: false, remark: '10 Bags X 1 พาเลท', files: [] },
])

const expoertAndDomain = ref([
  { deliveryPlace: 'SKT', appearanceCheck: true, remark: '12 Bags X 1 พาเลท' },
  { deliveryPlace: 'SKT', appearanceCheck: false, remark: '10 Bags X 1 พาเลท' },
])


//------------------- Funtions Muti File Inpur Imge ------------------------

const fileMuti = ref([])
const files = ref([])
const isDialogVisibleImgFileMuti = ref(false)

const imgDialog = ref('')
const imgNameDialog = ref('')

const showDialogImageMuti = (img, name) => {
  isDialogVisibleImgFileMuti.value =true
  imgDialog.value = img
  imgNameDialog.value = name
}

const handleFiles = truck => async event => {
  const selectedFiles = event.target.files

  truck.files = []

  const fileReaders = []

  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i]
    const reader = new FileReader()

    // สร้าง Promise เพื่ออ่านไฟล์
    const readerPromise = new Promise((resolve, reject) => {
      reader.onload = e => {
        console.log('File read successful:', e.target.result) // ดู Base64 ที่อ่านได้
        resolve({
          name: file.name,

          //src: e.target.result, // ตรวจสอบว่า src ถูกตั้งค่าอย่างถูกต้อง
        })
      }
      reader.onerror = error => {
        console.error('File reading error:', error) // ตรวจสอบข้อผิดพลาดในการอ่านไฟล์
        reject(error)
      }
    })

    reader.readAsDataURL(file)
    fileReaders.push(readerPromise)
  }

  // รอให้ไฟล์ทั้งหมดถูกอ่านเสร็จ
  try {
    const files = await Promise.all(fileReaders)

    truck.files = files
    console.log('All files read and set:', truck.files) // เพิ่มการ log เพื่อตรวจสอบไฟล์ทั้งหมด
  } catch (error) {
    console.error('Error reading files:', error)
  }
}

const watchFiles = async truck => {
  await nextTick()

  const promises = truck.files.map(file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = e => {
        file.src = e.target.result
        resolve()
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  })

  await Promise.all(promises)
}

resaleProductShipping.value.forEach(truck => {
  watch(() => truck.files, () => watchFiles(truck), { deep: true })
})

const removeFile = (truck, fileIndex) => {
  truck.files.splice(fileIndex, 1)
}

const removeFileO = index => {
  files.value.splice(index, 1)
  if (!files.value.length) {
    fileMuti.value = null
  }
}

const seeTruck = () => {
  console.log('data truck', resaleProductShipping.value)
}

const seeTruckO = () => {
  console.log('data truck', files.value)
}

const addTruck = () => {
  resaleProductShipping.value.push({
    truckNo: '',
    sKTLotNo: '',
    supplierLotNo: '',
    productCode: '',
    tradeName: '',
    packaging: '',
    netContent: '',
    amount: '',
    quantity: '',
    customerName: '',
    deliveryPlace: '',
    appearanceCheck: false,
    remark: '',
    files: [],
  })
}

const removeFilesInTruck = index => {
  resaleProductShipping.value[index].files = []
}

//------------------------ Dialog ----------------------------------------------------------------
const isDialogVisibleImgAmount = ref(false)

const dessertsMockAmountView = [
  {
    barcode: 'C-SAKUMARU-A',
    qty: 159,
    uom: 'Kg',
    description: '1/8',
    protein: 4,
  },
  {
    barcode: 'C-SAKUMARU-B',
    qty: 237,
    uom: 'Kg',
    description: '2/8',
    protein: 4,
  },
  {
    barcode: 'C-SAKUMARU-C',
    qty: 262,
    uom: 'Kg',
    description: '3/8',
    protein: 4,
  },
  {
    barcode: 'C-SAKUMARU-D',
    qty: 305,
    uom: 'Kg',
    description: '4/8',
    protein: 4,
  },
  {
    barcode: 'C-SAKUMARU-E',
    qty: 356,
    uom: 'Kg',
    description: '5/8',
    protein: 4,
  },
  {
    barcode: 'C-SAKUMARU-F',
    qty: 356,
    uom: 'Kg',
    description: '6/8',
    protein: 4,
  },
  {
    barcode: 'C-SAKUMARU-G',
    qty: 356,
    uom: 'Kg',
    description: '7/8',
    protein: 4,
  },
  {
    barcode: 'C-SAKUMARU-H',
    qty: 356,
    uom: 'Kg',
    description: '8/8',
    protein: 4,
  },
]
</script>

<template>
  <VContainer fluid>
    <div class="my-6">
      <VRow>
        <VCol
          class="px-0"
          cols="12"
        >
          <div style="overflow-x: auto; white-space: nowrap;">
            <table class="custom-table">
              <thead>
                <tr>
                  <th
                    colspan="9"
                    class="section-title text-center"
                  >
                    Resale / Product Shipping Check Sheet (Drum and Gallon) on ....27-11-2023...1100076181......
                  </th>
                  <th
                    colspan="5"
                    class="section-title text-center"
                  >
                    <div class="checkbox-container pa-0">
                      <VCheckbox />Export
                      <VCheckbox />Domestic
                    </div>
                  </th>
                </tr>
                <tr>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    No.
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    Container No/License plate No
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    SKT Lot No.
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    Supplier Lot No.
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    Product Code
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    Trade Name	
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    Packaging
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    Net Content
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    Amount
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    Quantity (Kg.)
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    Customer Name
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    Delivery Place
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    Appearance Check
                  </th>
                  <th
                    colspan="1"
                    class="section-title text-center"
                  >
                    Remark
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in resaleProductShipping"
                  :key="index"
                >
                  <td>{{ index+1 }}</td>
                  <td>{{ item.truckNo }}</td>
                  <td>{{ item.sKTLotNo }}</td>
                  <td>{{ item.supplierLotNo }}</td>
                  <td>{{ item.productCode }}</td>
                  <td>{{ item.tradeName }}</td>
                  <td>{{ item.packaging }}</td>
                  <td>{{ item.netContent }}</td>
                  <td>
                    <VRow>
                      <VCol cols="6">
                        {{ item.amount }}
                      </VCol>
                      <VCol
                        class="d-flex align-start justify-end pa-2"
                        cols="6"
                        @click="isDialogVisibleImgAmount = true"
                      >
                        <VIcon icon=" ri-eye-fill" />
                      </VCol>
                    </VRow>
                  </td>
                  <td>{{ item.quantity }}</td>
                  <td style="font-size: 14px;">
                    {{ item.customerName }}
                  </td>
                  <td>{{ item.deliveryPlace }}</td>
                  <td>{{ item.appearanceCheck }}</td>
                  <td>{{ item.remark }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </VCol>
      </VRow>
      <!-- Dialog For Amount -->
      <section>
        <VDialog
          v-model="isDialogVisibleImgAmount"
          width="800"
        >
          <!-- Dialog Content -->
          <VCard>
            <VCardTitle class="bg-primary">
              <div class="d-flex justify-center">
                <span>Product Detail</span>
              </div>
            </VCardTitle>

            <VCardText>
              <div>
                <VTable
                  height="250"
                  fixed-header
                >
                  <thead>
                    <tr>
                      <th class="text-uppercase">
                        No.
                      </th>
                      <th class="text-uppercase">
                        Barcode
                      </th>
                      <th class="text-end">
                        QTY.
                      </th>
                      <th class="text-uppercase">
                        UoM
                      </th>
                      <th class="text-uppercase">
                        Description
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="(item, index) in dessertsMockAmountView"
                      :key="index"
                    >
                      <td class="text-start">
                        {{ index+1 }}
                      </td>
                      <td class="text-start">
                        {{ item.barcode }}
                      </td>
                      <td class="text-end">
                        {{ item.qty }}
                      </td>
                      <td class="text-start">
                        {{ item.uom }}
                      </td>
                      <td class="text-start">
                        {{ item.description }}
                      </td>
                    </tr>
                  </tbody>
                </VTable>
              </div>
            </VCardText>
            <VCardAction>
              <div class="d-flex justify-end">
                <VBtn
                  class="ma-2"
                  color="warning"
                  @click="isDialogVisibleImgAmount = false"
                >
                  Close
                </VBtn>
              </div>
            </VCardAction>
          </VCard>
        </VDialog>
      </section>

      <VRow style="overflow-x: auto; white-space: nowrap;">
        <!--  Condition check for special request	Check by -->
        <VCol
          cols="12"
          lg="6"
          md="6"
        >
          <table class="custom-table">
            <thead>
              <tr>
                <th
                  colspan="12"
                  class="section-title text-center"
                >
                  ** Condition check for special request **
                </th>
              </tr>
            </thead>
            <tbody>
              <!--  Condition check for special request | Check by -->
              <tr
                v-for="(item, index) in specialRequests"
                :key="index"
              >
                <td colspan="4">
                  <div class="d-flex justify-center">
                    <VCheckbox v-model="item.checked" />
                  </div>
                </td>
                <td colspan="8">
                  {{ item.shippingMark }}
                </td>
              </tr>
              <tr>
                <td colspan="12">
                  <VRow v-if="!files.length">
                    <VCol cols="12">
                      <VFileInput
                        v-model="files"
                        hide-input
                        label="Actatch a file"
                        multiple
                        @change="handleFilesO"
                      />
                    </VCol>
                  </VRow>

                  <VRow
                    v-if="files.length"
                    class="ma-2 d-flex justify-center"
                    style="border: 1px dashed black; border-radius: 10px;"
                  >
                    <VCol
                      v-for="(file, index) in files"
                      :key="index"
                      cols="3"
                      md="4"
                      lg="3"
                    >
                      <VCard>
                        <VCardText class="pa-2">
                          <VImg
                            role="presentation"
                            :alt="file.name"
                            :src="file.src"
                            width="150"
                            contain
                            @click="showDialogImageMuti(file.src, file.name )"
                          />
                          <div class="d-flex flex-column align-center">
                            <span>{{ file.name }}</span>
                            <span>{{ file.size }} KB</span>
                          </div>
                        </VCardText>
                        <VCardActions class="d-flex justify-center">
                          <VBtn
                            icon
                            variant="flat"
                            color="error"
                            size="15"
                            @click="removeFileO(index)"
                          >
                            <VIcon size="15">
                              ri-close-large-line
                            </VIcon>
                          </VBtn>
                        </VCardActions>
                      </VCard>
                    </VCol>
                  </VRow>
                  <VDialog
                    v-model="isDialogVisibleImgFileMuti"
                    width="500"
                  >
                    <!-- Dialog Content -->
                    <VCard>
                      <VCardTitle class="bg-primary">
                        <div class="d-flex justify-space-between">
                          <span>{{ imgNameDialog }}</span>
                          <VBtn
                            icon="mdi-close"
                            color="white"
                            size="small"
                            variant="tonal"
                            @click="isDialogVisibleImgFileMuti = false"
                          />
                        </div>
                      </VCardTitle>

                      <VCardText>
                        <VImg
                          role="presentation"
                          :src="imgDialog"
                          height="100%"
                          contain
                        />
                      </VCardText>
                    </VCard>
                  </VDialog>
                </td>
              </tr>
            </tbody>
          </table>
        </VCol>
        <!-- Picture Labely -->
        <VCol
          cols="12"
          lg="6"
          md="6"
        >
          <table class="custom-table">
            <thead>
              <tr>
                <th
                  colspan="6"
                  class="section-title text-center"
                >
                  Picture Label
                </th>
                <th
                  colspan="6"
                  class="section-title text-center"
                >
                  Picture for Packaging
                </th>
              </tr>
            </thead>
            <tbody>
              <!--  Picture Label -->
              <tr>
                <td
                  class="text-center  cursor-pointer"
                  colspan="1"
                  ripple
                  :style="{
                    borderColor: selectedLanguage.includes('Thai') ? 'green' : '',
                    borderWidth: selectedLanguage.includes('Thai') ? '2px': '1px',
                    borderStyle: 'solid',
                  }"
                  :class="{'bg-green-lighten-3': selectedLanguage.includes('Thai')}"
                  @click="addItemsLang('Thai')"
                >
                  Thai
                </td>
                <td
                  rowspan="7"
                  colspan="6"
                >
                  <VImg
                    height="150"
                    width="150"
                    :src="image02"
                    alt="Packaging Image"
                    class="image"
                  />
                </td>
                <td
                  rowspan="7"
                  colspan="6"
                >
                  <div class="d-flex justify-center">
                    <VImg
                      height="150"
                      width="150"
                      :src="image01"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  class="text-center cursor-pointer"
                  colspan="1"
                  ripple
                  :style="{
                    borderColor: selectedLanguage.includes('English') ? 'green' : '',
                    borderWidth: selectedLanguage.includes('English') ? '2px': '1px',
                    borderStyle: 'solid',
              
                  }"
                  :class="{'bg-green-lighten-3': selectedLanguage.includes('English')}"
                  @click="addItemsLang('English')"
                >
                  English
                </td>
              </tr>
              <tr>
                <td
                  class="text-center  cursor-pointer"
                  colspan="1"
                  ripple
                  :style="{
                    borderColor: selectedLanguage.includes('Japanese') ? 'green' : '',
                    borderWidth: selectedLanguage.includes('Japanese') ? '2px': '1px',
                    borderStyle: 'solid',
                  }"
                  :class="{'bg-green-lighten-3': selectedLanguage.includes('Japanese')}"
                  @click="addItemsLang('Japanese')"
                >
                  Japanese
                </td>
              </tr>
              <tr>
                <td
                  class="text-center  cursor-pointer"
                  colspan="1"
                  ripple
                  :style="{
                    borderColor: selectedLanguage.includes('Chinese') ? 'green' : '',
                    borderWidth: selectedLanguage.includes('Chinese') ? '2px': '1px',
                    borderStyle: 'solid',
                  }"
                  :class="{'bg-green-lighten-3': selectedLanguage.includes('Chinese')}"
                  @click="addItemsLang('Chinese')"
                >
                  Chinese
                </td>
              </tr>
              <tr>
                <td
                  class="text-center  cursor-pointer"
                  colspan="1"
                  ripple
                  :style="{
                    borderColor: selectedLanguage.includes('Malaysia') ? 'green' : '',
                    borderWidth: selectedLanguage.includes('Malaysia') ? '2px': '1px',
                    borderStyle: 'solid',
                  }"
                  :class="{'bg-green-lighten-3': selectedLanguage.includes('Malaysia')}"
                  @click="addItemsLang('Malaysia')"
                >
                  Malaysia
                </td>
              </tr>
              <tr>
                <td
                  class="text-center  cursor-pointer"
                  colspan="1"
                  ripple
                  :style="{
                    borderColor: selectedLanguage.includes('Korean') ? 'green' : '',
                    borderWidth: selectedLanguage.includes('Korean') ? '2px': '1px',
                    borderStyle: 'solid',
                  }"
                  :class="{'bg-green-lighten-3': selectedLanguage.includes('Korean')}"
                  @click="addItemsLang('Korean')"
                >
                  Korean
                </td>
              </tr>
              <tr>
                <td
                  class="text-center  cursor-pointer"
                  colspan="1"
                  ripple
                  :style="{
                    borderColor: selectedLanguage.includes('SDS') ? 'green' : '',
                    borderWidth: selectedLanguage.includes('SDS') ? '2px': '1px',
                    borderStyle: 'solid',
                  }"
                  :class="{'bg-green-lighten-3': selectedLanguage.includes('SDS')}"
                  @click="addItemsLang('SDS')"
                >
                  SDS
                </td>
              </tr>
            </tbody>
          </table>
        </VCol>
      </VRow>

      <VRow style="overflow-x: auto; white-space: nowrap;">
        <!-- ตรวจสอบรายการต่อไปนี้ก่อนจัดส่ง -->
        <VCol
          class="px-0"
          cols="5"
        >
          <table class="custom-table">
            <tr>
              <th
                colspan="4"
                class="section-title text-center "
              >
                ตรวจสอบรายการต่อไปนี้ก่อนจัดส่ง
              </th>
            </tr>
            <tr
              v-for="(item , index) in validateAfterPicking"
              :key="index"
            >
              <td colspan="1">
                <div class="d-flex justify-center align-center">
                  <VCheckbox />
                </div>
              </td>
              <td colspan="3">
                {{ item.item }}
              </td>
            </tr>
          </table>
        </VCol>
        <!-- ตรวจสอบบรรจุภัณฑ์ -->
        <VCol
          class="px-5"
          cols="7"
        >
          <table class="custom-table">
            <!--  header table -->
            <tr class="">
              <th
                colspan="2"
                class="text-center"
              >
                <div class="d-flex justify-center align-center ">
                  <VCheckbox /> Wood
                </div>
              </th>
              <th
                colspan="2"
                class="text-center"
              >
                <div class="d-flex justify-center align-center ">
                  <VCheckbox /> Plastic
                </div>
              </th>
            </tr>
            <!--  body table -->
            <tr>
              <td
                rowspan="6"
                colspan="2"
              >
                <div class="d-flex justify-center">
                  <VImg
                    height="250"
                    width="250"
                    :src="image03"
                  />
                </div>
              </td>
              <td
                rowspan="6"
                colspan="2"
              >
                <div class="d-flex justify-center">
                  <VImg
                    height="250"
                    width="250"
                    :src="image03"
                  />
                </div>
              </td>
            </tr>
          </table>
          <table class="custom-table">
            <!--  header table -->
            <tr class="">
              <th
                colspan="4"
                class="section-title text-center"
              >
                ตรวจสอบบรรจุภัณฑ์
              </th>
            </tr>
            <!--  body table -->
            <tr>
              <td
                rowspan="6"
                colspan="2"
              >
                <div class="d-flex justify-center">
                  Wrapping
                </div>
              </td>
              <td
                rowspan="6"
                colspan="1"
              >
                <div class="d-flex justify-center">
                  <div class="d-flex justify-center align-center">
                    <VCheckbox />
                    Yes 
                  </div>
                </div>
              </td>
              <td
                rowspan="6"
                colspan="1"
              >
                <div class="d-flex justify-center">
                  <div class="d-flex justify-center align-center">
                    <VCheckbox />
                    No 
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </VCol>
      </VRow>


      <VBtn @click="addTruck">
        Add Truck
      </VBtn>

      <VBtn @click="seeTruck">
        See Truck
      </VBtn>

      <VBtn @click="seeTruckO">
        See TruckO
      </VBtn>
      <section
        v-for="(truck, index) in resaleProductShipping"
        :key="index"
      >
        <!-- Muti File Inpur Imge -->
        <VRow v-if="!truck.files.length">
          <VCol cols="4">
            <table class="custom-table">
              <thead>
                <tr>
                  <th class="text-center">
                    Container No/License plate No
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center">
                    {{ truck.truckNo }}
                  </td>
                </tr>
              </tbody>
            </table>
          </VCol>

          <VCol cols="8">
            <VFileInput
              v-model="truck.files"
              label="File input"
              multiple
              @change="handleFiles(truck)"
            >
              <template #selection>
                <VRow
                  class="d-flex align-center justify-center"
                  style="height: 150px; border: 2px dashed #ccc; cursor: pointer;"
                >
                  <VCol
                    class="d-flex flex-column align-center justify-center"
                    cols="12"
                  >
                    <span>Upload your documents</span>
                  </VCol>
                </VRow>
              </template>
            </VFileInput>
          </VCol>
        </VRow>
        <!-- Muti File Show Imge -->
        <VRow
          v-if="truck.files.length"
          class="my-4"
        >
          <VCol cols="3">
            <table class="custom-table">
              <thead>
                <tr>
                  <th class="text-center">
                    เลขตู้ /ทะเบียนรถ
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center">
                    {{ truck.truckNo }}
                  </td>
                </tr>
              </tbody>
            </table>
          </VCol>

          <VCol
            style="border: 2px dashed black; border-radius: 10px;"
            cols="9"
          >
            <VRow>
              <VCol
                v-for="(file, fileIndex) in truck.files"
                :key="fileIndex"
                cols="3"
                md="3"
                lg="3"
              >
                <VCard class="pa-2">
                  <VImg
                    role="presentation"
                    :alt="file.name"
                    :src="file.src" 
                    height="100"
                    contain
                    @click="showDialogImageMuti(file.src, file.name)"
                  />

                  <VCardText class="pa-2">
                    <div class="d-flex flex-column align-center text-center">
                      <span>{{ file.name }}</span>
                      <span>{{ file.size }} KB</span>
                      <VBtn
                        class="mt-2"
                        icon="mdi-close"
                        color="error"
                        size="small"
                        variant="tonal"
                        @click="removeFile(truck, fileIndex)"
                      />
                    </div>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
            <VRow>
              <Vcol
                style="width: 100%;"
                cols="12"
              >
                <VBtn
                  class="mx-2 mb-2"
                  color="red"
                  width="98%"
                  @click="removeFilesInTruck(index)"
                >
                  Delete Image
                </VBtn>
              </Vcol>
            </VRow>
          </VCol>


          <VDialog
            v-model="isDialogVisibleImgFileMuti"
            width="500"
          >
            <!-- Dialog Content -->
            <VCard>
              <VCardTitle class="bg-primary">
                <div class="d-flex justify-space-between">
                  <span>{{ imgNameDialog }}</span>
                  <VBtn
                    icon="mdi-close"
                    color="white"
                    size="small"
                    variant="tonal"
                    @click="isDialogVisibleImgFileMuti = false"
                  />
                </div>
              </VCardTitle>

              <VCardText>
                <VImg
                  role="presentation"
                  :src="imgDialog"
                  height="100%"
                  contain
                />
              </VCardText>
            </VCard>
          </VDialog>
        </VRow>
      </section>
    </div>
  </VContainer>
</template>

<style scoped>
.text-center {
  text-align: center;
}

.centered-input >>> input {
  padding: 0;
  text-align: center;
}

.custom-table {
  border-collapse: collapse;
  inline-size: 100%;
}

.custom-table,
.custom-table th,
.custom-table td {
  border: 1px solid black;
}

.custom-table td {
  font-size: 14px;
  font-weight: 200;
}

.custom-table th,
.custom-table td {
  padding: 8px;
  text-align: start;
}

.header {
  justify-content: space-between;
  font-weight: bold;
  text-align: center;
}

.section-title {
  font-weight: bold;
}

.image {
  inline-size: 100px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
</style>
