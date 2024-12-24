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
import image04 from '../image/04.png'

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
  {
    conditions: [
      { checked: false, shippingMark: 'SHIPPING MARK 1', dash: '--' },
      { checked: false, shippingMark: 'PR2E(1)2312', dash: '--' },
      { checked: false, shippingMark: 'SAN~O CHEMICAL', dash: '--' },
      { checked: false, shippingMark: 'KYO~O / JAPAN', dash: '--' },
      { checked: false, shippingMark: 'ส่ง ตัวอย่าง 250 g = 1 ขวด/Lot ให้ SCI พร้อมแนบไปกับสินค้า', dash: '--' },
      { checked: false, shippingMark: 'ติดฉลากภาษาญี่ปุ่นและภาษาอังกฤษ', dash: '--' },
    ],
    label: [],
  },
  
])

const GBSMockData = ref({
  "No1": { title: "No.", c1: '1', c2: '2', c3: '3', c4: '4', c5: '5' },
  "ubc1": { title: "UBC No", c1: "", c2: "", c3: "", c4: "", c5: ""  },
  "GBS1": { title: "GROSSWEIGHT Before Shipping", c1: "", c2: "", c3: "", c4: "", c5: ""  },
  "rows1": { 
    "item1": [
      { "label": "1. ไม่เป็นสนิม", value1: false, value2: false, value3: false, value4: false, value5: false },
      { "label": "-ไม่บุบ ไม่เสียรูปทรง", value1: false, value2: false, value3: false, value4: false, value5: false },
      { "label": "-ฐานรองรับแข็งแรง", value1: false, value2: false, value3: false, value4: false, value5: false },
    ],
    "item2": [
      { "label": "2.Label ไม่ฉีกขาด", value1: false, value2: false, value3: false, value4: false, value5: false },
      { "label": "- Lot No.ถูกต้อง", value1: false, value2: false, value3: false, value4: false, value5: false },
      { "label": "- น้ำหนักถูกต้อง", value1: false, value2: false, value3: false, value4: false, value5: false },
      { "label": "- ตำแหน่ง Lable ถูกต้อง (อยู่ตรงกลาง)", value1: false, value2: false, value3: false, value4: false, value5: false },
    ],
    "item3": [
      { "label": "3.ฝาปิดด้านบนไม่มีรูระบายอากาศ/น้ำไม่เข้า", value1: false, value2: false, value3: false, value4: false, value5: false },
      { "label": "- Check Leak ที่ CAPเปิดแล้วไม่รั่วแล้วปิดให้แน่น", value1: false, value2: false, value3: false, value4: false, value5: false },
      { "label": "- ฝาเกลียวที่ใช้ขนาดถูกต้อง", value1: false, value2: false, value3: false, value4: false, value5: false },
      { "label": "- สภาพฝาที่ใช้ปิด ป้องกันการรั่วได้ดี", value1: false, value2: false, value3: false, value4: false, value5: false },
    ],
    "item4": [
      { "label": "4.มีการ Seal ที่ฝาด้านบน แน่นเรียบร้อย", value1: false, value2: false, value3: false, value4: false, value5: false },
    ],
    "item5": [
      { "label": "5.มีการ Seal ที่วาล์วด้านล่างแน่นเรียบร้อย ไม่รั่วซึม", value1: false, value2: false, value3: false, value4: false, value5: false },
    ],
  },

  "No2": { title: "No.", c1: '6', c2: '7', c3: '8', c4: '9', c5: '10' },
  "ubc2": { title: "UBC No", c1: "", c2: "", c3: "", c4: "", c5: ""  },
  "GBS2": { title: "GROSSWEIGHT Before Shipping", c1: "", c2: "", c3: "", c4: "", c5: ""  },
  "rows2": { 
    "item1": [
      { "label": "1. ไม่เป็นสนิม", value1: false, value2: false, value3: false, value4: false, value5: false },
      { "label": "-ไม่บุบ ไม่เสียรูปทรง", value1: false, value2: false, value3: false, value4: false, value5: false },
      { "label": "-ฐานรองรับแข็งแรง", value1: false, value2: false, value3: false, value4: false, value5: false },
    ],
    "item2": [
      { "label": "2.Label ไม่ฉีกขาด", value1: false, value2: false, value3: false, value4: false, value5: false },
      { "label": "- Lot No.ถูกต้อง", value1: false, value2: false, value3: false, value4: false, value5: false },
      { "label": "- น้ำหนักถูกต้อง", value1: false, value2: false, value3: false, value4: false, value5: false },
      { "label": "- ตำแหน่ง Lable ถูกต้อง (อยู่ตรงกลาง)", value1: false, value2: false, value3: false, value4: false, value5: false },
    ],
    "item3": [
      { "label": "3.ฝาปิดด้านบนไม่มีรูระบายอากาศ/น้ำไม่เข้า", value1: false, value2: false, value3: false, value4: false, value5: false },
      { "label": "- Check Leak ที่ CAPเปิดแล้วไม่รั่วแล้วปิดให้แน่น", value1: false, value2: false, value3: false, value4: false, value5: false },
      { "label": "- ฝาเกลียวที่ใช้ขนาดถูกต้อง", value1: false, value2: false, value3: false, value4: false, value5: false },
      { "label": "- สภาพฝาที่ใช้ปิด ป้องกันการรั่วได้ดี", value1: false, value2: false, value3: false, value4: false, value5: false },
    ],
    "item4": [
      { "label": "4.มีการ Seal ที่ฝาด้านบน แน่นเรียบร้อย", value1: false, value2: false, value3: false, value4: false, value5: false },
    ],
    "item5": [
      { "label": "5.มีการ Seal ที่วาล์วด้านล่างแน่นเรียบร้อย ไม่รั่วซึม", value1: false, value2: false, value3: false, value4: false, value5: false },
    ],
  },

  "No3": { title: "No.", c1: '11', c2: '12', c3: '13', c4: '14', c5: '15' },
  "ubc3": { title: "UBC No", c1: "", c2: "", c3: "", c4: "", c5: ""  },
  "GBS3": { title: "GROSSWEIGHT Before Shipping", c1: "", c2: "", c3: "", c4: "", c5: ""  },
  "rows3": { 
    "item1": [
      { "label": "1. ไม่เป็นสนิม", value1: false, value2: false, value3: false, value4: false, value5: false },
      { "label": "-ไม่บุบ ไม่เสียรูปทรง", value1: false, value2: false, value3: false, value4: false, value5: false },
      { "label": "-ฐานรองรับแข็งแรง", value1: false, value2: false, value3: false, value4: false, value5: false },
    ],
    "item2": [
      { "label": "2.Label ไม่ฉีกขาด", value1: false, value2: false, value3: false, value4: false, value5: false },
      { "label": "- Lot No.ถูกต้อง", value1: false, value2: false, value3: false, value4: false, value5: false },
      { "label": "- น้ำหนักถูกต้อง", value1: false, value2: false, value3: false, value4: false, value5: false },
      { "label": "- ตำแหน่ง Lable ถูกต้อง (อยู่ตรงกลาง)", value1: false, value2: false, value3: false, value4: false, value5: false },
    ],
    "item3": [
      { "label": "3.ฝาปิดด้านบนไม่มีรูระบายอากาศ/น้ำไม่เข้า", value1: false, value2: false, value3: false, value4: false, value5: false },
      { "label": "- Check Leak ที่ CAPเปิดแล้วไม่รั่วแล้วปิดให้แน่น", value1: false, value2: false, value3: false, value4: false, value5: false },
      { "label": "- ฝาเกลียวที่ใช้ขนาดถูกต้อง", value1: false, value2: false, value3: false, value4: false, value5: false },
      { "label": "- สภาพฝาที่ใช้ปิด ป้องกันการรั่วได้ดี", value1: false, value2: false, value3: false, value4: false, value5: false },
    ],
    "item4": [
      { "label": "4.มีการ Seal ที่ฝาด้านบน แน่นเรียบร้อย", value1: false, value2: false, value3: false, value4: false, value5: false },
    ],
    "item5": [
      { "label": "5.มีการ Seal ที่วาล์วด้านล่างแน่นเรียบร้อย ไม่รั่วซึม", value1: false, value2: false, value3: false, value4: false, value5: false },
    ],
  }
  ,
})


//--------------------------------------- Pagination ----------------------------------------------

const currentPage = ref(1)  // หน้าที่กำลังแสดง
const rowsPerPage = 5       // จำนวนแถวที่จะแสดงในแต่ละหน้า
const totalRows = computed(() => Object.values(GBSMockData.value.rows1).flat().length)  // จำนวนแถวทั้งหมด

const displayedRows = computed(() => {
  const startIndex = (currentPage.value - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  
  return Object.values(GBSMockData.value.rows1).flat().slice(startIndex, endIndex)
})

const labelImages = ref([])


// Watch for changes in labelImages and clean up old URLs
watch(labelImages, newFiles => {
  newFiles.forEach((file, index) => {
    // ตรวจสอบก่อนว่าจะสร้าง Blob URL ใหม่หรือไม่
    if (file instanceof File) {
      // ลบ Blob URL เก่าออกหากมี
      if (labelImages.value[index].src) {
        URL.revokeObjectURL(labelImages.value[index].src)
      }

      // สร้าง Blob URL ใหม่
      labelImages.value[index] = {
        name: file.name,
        size: (file.size / 1024), // Size in KB
        src: URL.createObjectURL(file),
      }
    }
  })
}, { deep: true })

// ฟังก์ชันลบไฟล์
function removeFileLabel(index) {
  // ลบไฟล์ออกจาก `label` โดยใช้ index
  labelImages.value.splice(index, 1)
}

const removeFilesInLabel = index => {
  labelImages.value = []
}

const seeLabelItems = () => {
  console.log(labelImages.value)
}


// ติดตามการเปลี่ยนแปลงของไฟล์ที่เลือก
watch(() => specialRequests.value[0].label, newFiles => {
  // ทำความสะอาด URL เก่า
  newFiles.forEach(file => {
    if (file.imagePreview) {
      URL.revokeObjectURL(file.imagePreview)
    }
  })

  // สร้าง URL ใหม่
  specialRequests.value[0].label = newFiles.map(file => {
    const fileURL = file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    
    return {
      ...file,
      imagePreview: fileURL,
    }
  })
}, { deep: true })

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

resaleProductShipping.value.forEach(truck => {
  watch(() => truck.files, newFiles => {
    // Clean up the old URLs if they exist
    truck.files.forEach(file => {
      if (file.pdfPreview) {
        URL.revokeObjectURL(file.pdfPreview)
      }
      if (file.imagePreview) {
        URL.revokeObjectURL(file.imagePreview)
      }
    })

    if (newFiles && newFiles.length > 0) {
      newFiles.forEach((file, index) => {
        const fileType = file.type
        const fileName = file.name

        if (fileType === 'application/pdf') {
          const fileURL = URL.createObjectURL(file)

          truck.files[index] = {
            ...file,
            pdfPreview: fileURL,
            imagePreview: null, // Clear image preview if any
            fileName: fileName, // Add the file name
          }
        } else if (fileType.startsWith('image/')) {
          const fileURL = URL.createObjectURL(file)

          truck.files[index] = {
            ...file,
            imagePreview: fileURL,
            pdfPreview: null, // Clear PDF preview if any
            fileName: fileName, // Add the file name
          }
        } else {
          truck.files[index] = {
            ...file,
            pdfPreview: null,
            imagePreview: null,
            fileName: fileName, // Add the file name
          }
        }
      })
    } else {
      truck.files.forEach((file, index) => {
        truck.files[index] = {
          ...file,
          pdfPreview: null,
          imagePreview: null,
          fileName: null, // Clear the file name if no file
        }
      })
    }
  })
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
    <span
      class="text-center d-flex justify-center"
      style="font-weight: bolder;"
    >Resale / Product Shipping Check Sheet</span>
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
                    SKT Name
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

      <VRow style="overflow-x: auto;">
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
            <tbody
              v-for="(itemCore, index) in specialRequests"
              :key="index"
            >
              <!--  Condition check for special request | Check by -->
              <tr
                v-for="(item, index) in itemCore.conditions"
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
                <td
                  colspan="12"
                  style="height: 159px;"
                >
                  <VRow v-if="!labelImages.length">
                    <VCol cols="12">
                      <VFileInput
                        v-model="labelImages"
                        multiple
                        placeholder="Upload your documents"
                        label="File input"
                        prepend-icon="ri-attachment-line"
                        accept="image/png, image/jpeg, image/bmp"
                      >
                        <template #selection="{ fileNames }">
                          <template
                            v-for="fileName in fileNames"
                            :key="fileName"
                          >
                            <VChip
                              label
                              size="small"
                              variant="outlined"
                              color="primary"
                              class="me-2"
                            >
                              {{ fileName }}
                            </VChip>
                          </template>
                        </template>
                      </VFileInput>
                    </VCol>
                  </VRow>

                  <VRow
                    v-if="labelImages.length"
                    class=" d-flex justify-center"
                  >
                    <VCol
                      v-for="(file, index) in labelImages"
                      :key="index"
                      cols="3"
                      md="3"
                      lg="3"
                      style="min-height: 50px;"
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
                          <span>Label</span>
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
                  style="height: 53px;"
                  @click="addItemsLang('Thai')"
                >
                  Thai
                </td>
                <td
                  rowspan="9"
                  colspan="5"
                >
                  <div class="d-flex justify-center">
                    <VImg
                      height="250"
                      width="150"
                      :src="image02"
                      alt="Packaging Image"
                      class="image"
                    />
                  </div>
                </td>
                <td
                  rowspan="9"
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
                  style="height: 53px;"
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
                  style="height: 53px;"
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
                  style="height: 53px;"
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
                  style="height: 53px;"
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
                  style="height: 53px;"
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
                  style="height: 53px;"
                  @click="addItemsLang('SDS')"
                >
                  SDS
                </td>
              </tr>
              <tr>
                <td
                  class="text-center"
                  colspan="1"
                  ripple
                  style="height: 106px;"
                />
              </tr>
            </tbody>
          </table>
        </VCol>
      </VRow>

      <VRow style="overflow-x: auto; white-space: nowrap;">
        <!-- ตรวจสอบรายการต่อไปนี้ก่อนจัดส่ง -->
        <VCol
          class=""
          cols="12"
          md="6"
          lg="6"
        >
          <table class="custom-table">
            <tr>
              <th
                colspan="4"
                class="section-title text-center "
              >
                Check The Following Items Before Shipping.
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
          class=""
          cols="12"
          md="6"
          lg="6"
        >
          <table class="custom-table">
            <!--  header table -->
            <thead>
              <tr>
                <th
                  colspan="6"
                  class="text-center"
                >
                  <div class="d-flex justify-center align-center ">
                    <VCheckbox label="Wood" />
                  </div>
                </th>
                <th
                  colspan="6"
                  class="text-center"
                >
                  <div class="d-flex justify-center align-center ">
                    <VCheckbox label="Plastic" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <!--  body table -->
              <tr>
                <td
                  rowspan="6"
                  colspan="6"
                >
                  <div class="d-flex justify-center">
                    <VImg
                      height="250"
                      width="250"
                      :src="image04"
                    />
                  </div>
                </td>
                <td
                  rowspan="6"
                  colspan="6"
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
            </tbody>

            <thead>
              <tr>
                <th
                  colspan="12"
                  class="section-title text-center"
                >
                  Check The Packaging.
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="4">
                  <div class="d-flex justify-center">
                    Wrapping
                  </div>
                </td>
                <td colspan="4">
                  <div class="d-flex justify-center">
                    <div class="d-flex justify-center align-center">
                      <VCheckbox />
                      Yes 
                    </div>
                  </div>
                </td>
                <td colspan="4">
                  <div class="d-flex justify-center">
                    <div class="d-flex justify-center align-center">
                      <VCheckbox />
                      No 
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="4">
                  <div class="d-flex justify-center">
                    Strap
                  </div>
                </td>
                <td colspan="4">
                  <div class="d-flex justify-center">
                    <div class="d-flex justify-center align-center">
                      <VCheckbox />
                      Yes 
                    </div>
                  </div>
                </td>
                <td colspan="4">
                  <div class="d-flex justify-center">
                    <div class="d-flex justify-center align-center">
                      <VCheckbox />
                      No 
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </VCol>
      </VRow>
      
      <div
        v-if="false"
        class="my-4"
      >
        <VBtn @click="addTruck">
          Add Truck
        </VBtn>

        <VBtn @click="seeTruck">
          See Truck
        </VBtn>

        <VBtn @click="seeLabelItems">
          See Label
        </VBtn>
      </div>

      <section>
        <table class="custom-table my-4">
          <thead>
            <tr>
              <template
                v-for="(Gbs, key) in GBSMockData.No1"
                :key="key"
              />
              <th
                colspan="4"
                class="text-center"
              >
                {{ GBSMockData.No1.title }}
              </th>
              <th
                colspan="2"
                class="text-center"
              >
                {{ GBSMockData.No1.c1 }}
              </th>
              <th
                colspan="2"
                class="text-center"
              >
                {{ GBSMockData.No1.c2 }}
              </th>
              <th
                colspan="2"
                class="text-center"
              >
                {{ GBSMockData.No1.c3 }}
              </th>
              <th
                colspan="2"
                class="text-center"
              >
                {{ GBSMockData.No1.c4 }}
              </th>
              <th
                colspan="2"
                class="text-center"
              >
                {{ GBSMockData.No1.c5 }}
              </th>
            </tr>

            <tr>
              <template
                v-for="(Gbs, key) in GBSMockData.ubc1"
                :key="key"
              />
              <th
                colspan="4"
                class="text-center"
              >
                {{ GBSMockData.ubc1.title }}
              </th>
              <th
                colspan="2"
                class="text-center"
              >
                <VTextField
                  v-model="GBSMockData.ubc1.c1"
                  density="compact"
                />
              </th>
              <th
                colspan="2"
                class="text-center"
              >
                <VTextField
                  v-model="GBSMockData.ubc1.c2"
                  density="compact"
                />
              </th>
              <th
                colspan="2"
                class="text-center"
              >
                <VTextField
                  v-model="GBSMockData.ubc1.c3"
                  density="compact"
                />
              </th>
              <th
                colspan="2"
                class="text-center"
              >
                <VTextField
                  v-model="GBSMockData.ubc1.c4"
                  density="compact"
                />
              </th>
              <th
                colspan="2"
                class="text-center"
              >
                <VTextField
                  v-model="GBSMockData.ubc1.c5"
                  density="compact"
                />
              </th>
            </tr>

            <tr>
              <template
                v-for="(Gbs, key) in GBSMockData.GBS1"
                :key="key"
              />
              <th
                colspan="4"
                class="text-center"
              >
                {{ GBSMockData.GBS1.title }}
              </th>
              <th
                colspan="2"
                class="text-center"
              >
                <VTextField
                  v-model="GBSMockData.GBS1.c1"
                  density="compact"
                />
              </th>
              <th
                colspan="2"
                class="text-center"
              >
                <VTextField
                  v-model="GBSMockData.GBS1.c2"
                  density="compact"
                />
              </th>
              <th
                colspan="2"
                class="text-center"
              >
                <VTextField
                  v-model="GBSMockData.GBS1.c3"
                  density="compact"
                />
              </th>
              <th
                colspan="2"
                class="text-center"
              >
                <VTextField
                  v-model="GBSMockData.GBS1.c4"
                  density="compact"
                />
              </th>
              <th
                colspan="2"
                class="text-center"
              >
                <VTextField
                  v-model="GBSMockData.GBS1.c5"
                  density="compact"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- วนลูปข้อมูล item1 และ item2 -->
            <template
              v-for="(items, key) in GBSMockData.rows1"
              :key="key"
            >
              <!-- วนลูปแต่ละ row ใน item -->
              <tr
                v-for="(row, rowIndex) in items"
                :key="rowIndex"
              >
                <td
                  colspan="4"
                  :class="{ 'font-weight-bold': row.label.match(/^\d+\./) }"
                >
                  {{ row.label }}
                </td>
                <td colspan="2">
                  <div class="d-flex justify-center">
                    <VCheckbox
                      v-model="row.value1"
                      density="compact"
                    />
                  </div>
                </td>
                <td colspan="2">
                  <div class="d-flex justify-center">
                    <VCheckbox
                      v-model="row.value2"
                      density="compact"
                    />
                  </div>
                </td>
                <td colspan="2">
                  <div class="d-flex justify-center">
                    <VCheckbox
                      v-model="row.value3"
                      density="compact"
                    />
                  </div>
                </td>
                <td colspan="2">
                  <div class="d-flex justify-center">
                    <VCheckbox
                      v-model="row.value4"
                      density="compact"
                    />
                  </div>
                </td>
                <td colspan="2">
                  <div class="d-flex justify-center">
                    <VCheckbox
                      v-model="row.value5"
                      density="compact"
                    />
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <VPagination
          v-model:page="currentPage"
          :length="Math.ceil(totalRows.value / rowsPerPage)"
          :total-visible="5"
          class="my-4"
        />
      </section>

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
                    :src="file.imagePreview" 
                    height="100"
                    contain
                    @click="showDialogImageMuti(file.imagePreview, file.name)"
                  />
                  

                  <VCardText class="pa-2">
                    <div class="d-flex flex-column align-center text-center">
                      <span>{{ file.fileName }}</span>
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

      <!-- Inspector / Btn -->
      <div class="mt-4">
        <table class="custom-table">
          <thead>
            <tr>
              <th
                class="text-center"
                colspan="12"
              >
                <span>Inspector</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th colspan="4">
                <VTextField
                  v-model="varA"
                  class="pa-0"
                  density="compact"
                  style="font-size: 16px;"
                >
                  <template #prepend>
                    <span />
                  </template>
                  <template #label>
                    <span>WH Staff 1</span>
                  </template>
                  <template #append>
                    <span />
                  </template>
                </VTextField>
              </th>
              <th colspan="4">
                <VTextField
                  v-model="varA"
                  class="pa-0"
                  density="compact"
                  style="font-size: 16px;"
                >
                  <template #prepend>
                    <span />
                  </template>
                  <template #label>
                    <span>WH Staff 2</span>
                  </template>
                  <template #append>
                    <span />
                  </template>
                </VTextField>
              </th>
              <th colspan="4">
                <VTextField
                  v-model="varA"
                  class="pa-0"
                  density="compact"
                  style="font-size: 16px;"
                >
                  <template #prepend>
                    <span />
                  </template>
                  <template #label>
                    <span>Supervisor</span>
                  </template>
                  <template #append>
                    <span />
                  </template>
                </VTextField>
              </th>
            </tr>
            <tr>
              <th colspan="4">
                <VTextField
                  v-model="varA"
                  class="pa-0"
                  density="compact"
                  style="font-size: 16px;"
                >
                  <template #prepend>
                    <span />
                  </template>
                  <template #label>
                    <span>Date</span>
                  </template>
                  <template #append>
                    <span />
                  </template>
                </VTextField>
              </th>
              <th colspan="4">
                <VTextField
                  v-model="varA"
                  class="pa-0"
                  density="compact"
                  style="font-size: 16px;"
                >
                  <template #prepend>
                    <span />
                  </template>
                  <template #label>
                    <span>Date</span>
                  </template>
                  <template #append>
                    <span />
                  </template>
                </VTextField>
              </th>
              <th colspan="4">
                <VTextField
                  v-model="varA"
                  class="pa-0"
                  density="compact"
                  style="font-size: 16px;"
                >
                  <template #prepend>
                    <span />
                  </template>
                  <template #label>
                    <span>Date</span>
                  </template>
                  <template #append>
                    <span />
                  </template>
                </VTextField>
              </th>
            </tr>
            <tr>
              <td colspan="12">
                หมายเหตุ: คนขับรถ ตรวจรถสินค้าหลังนำขึ้นรถแล้ว สถาพปกติ ไม่รั่ว
              </td>
            </tr>
          </tbody>
        </table>

        <div class="d-flex justify-end mt-4">
          <VBtn
            class="mx-2"
            color="warning"
          >
            SAVE DRAFT
          </VBtn>
          <VBtn
            class="mx-2"
            color="green"
          >
            WH2
          </VBtn>
          <VBtn
            class="mx-2"
            color="green"
          >
            WH1
          </VBtn>
        </div>
      </div>
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
  font-weight: 300;
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
