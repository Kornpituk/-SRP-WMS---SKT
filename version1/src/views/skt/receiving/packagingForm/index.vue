<script setup>
import axiosIns from '@axios'
import { ref, onMounted, watchEffect } from "vue"
import image from "./image/image.png"

import { urlApi } from '@/api'

// import { controllerDeleteAllCIA,  ReceivingModel } from "/Users/code/Easetrack/SRP_Store/src/controller/skt/receivingFrom/packaging/controller"

const props = defineProps({
  Data: Array,
})

//---------------------- Import Api for Url *****
const whereHouse = ref(localStorage.getItem('whereHouseName'))
const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')

const route = useRoute()

const data = ref(JSON.parse(route.query.Data || '[]'))

if(data.value){
  console.log('Data:', data)
}

const mockData = ref([
  { AItem: "Appearance(Dent/Clearness/Scratch)", CheckM: "By Sight", SR: "No Dent, Clearness, NoScratch", ActualC: [], A: [], B: [] },
  { AItem: "Color (Body and Top)", CheckM: "By Sight", SR: "Green, White (SK), B2C ", ActualC: [], A: [], B: [] },
])

const checkboxOne = ref(false)

//----------------------------------- COA ----------------------------------------------------------------
const fileMuti = ref([])
const files = ref([])
const coaFiles = ref([])
const isDialogVisibleImgFileMuti = ref(false)

const imgDialog = ref('')
const imgNameDialog = ref('')


//---------------------------------- function controller --------------------------------

const showDialogImageMuti = (img, name) => {

  // ตรวจสอบว่าข้อมูล img มี "data:image/png;base64," นำหน้าหรือไม่
  if (!img.startsWith('data:image')) {
  // ถ้าไม่มี ให้เพิ่ม "data:image/png;base64," นำหน้า
    img = `data:image/png;base64,${img}`
  }

  isDialogVisibleImgFileMuti.value =true
  imgDialog.value = img
  imgNameDialog.value = name
}

const formatFileSize = size => {
  if (size < 1024) {
    return size + ' Bytes'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  } else {
    return (size / (1024 * 1024)).toFixed(2) + ' MB'
  }
}

const handleFilesO = event => {
  files.value = [] // รีเซ็ตไฟล์

  const selectedFiles = event.target.files
  const maxFileSizeMB = 2 // กำหนดขนาดไฟล์สูงสุดที่อนุญาต (2 MB)

  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i]

    // ตรวจสอบขนาดไฟล์
    // if (file.size > maxFileSizeMB * 1024 * 1024) {
    //   alert(`File ${file.name} exceeds the 2 MB size limit and will not be uploaded.`)
    //   continue // ข้ามไฟล์ที่มีขนาดเกิน
    // }

    const reader = new FileReader()

    reader.onload = e => {
      files.value.push({
        name: file.name,
        src: e.target.result,
        size: formatFileSize(file.size), // Format ขนาดไฟล์
      })
    }
    reader.readAsDataURL(file) // อ่านไฟล์และแปลงเป็น base64
  }

  fileMuti.value = selectedFiles // อัปเดต fileMuti
}

const removeFile = index => {
  files.value.splice(index, 1)
  if (!files.value.length) {
    fileMuti.value = []
    console.log('removeFile', fileMuti.value)
  }
}

const removeFileDraft = index => {
  coaFiles.value.splice(index, 1)
  if (!coaFiles.value.length) {
    coaFiles.value = []
    console.log('coaFiles', coaFiles.value)
  }
}

//--------------- COA

let startTime

//----------------- Progression
const loading = ref(false)
const modelValue = ref(0) // Progress value
const bufferValue = ref(100) // Buffer value for the progress
const progressPercentage = ref('0%') // Percentage text
const interval = ref()

const maxFileSizeMB = 2 // Set max file size to 1 MB

watchEffect(() => {
  console.log('fileMuti++',  fileMuti.value)
  console.log('files+++',  files.value)
})

const getCOAReceivingForm = () => {
  if (poEtlLogDetailJournalIDQueryParameters.value) {
    loading.value = true
    axiosIns.get(
      `${urlApi.value}/api/v1/ReceivingForm/get-coA/${poEtlLogDetailJournalIDQueryParameters.value}`,
      {
        headers: {
          'accept': '*/*',
          'x-location': `${whereHouse.value}`,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
        onDownloadProgress: progressEvent => {
          const { loaded, total } = progressEvent
          if (total > 0) {
            const percentCompleted = Math.round((loaded * 100) / total)

            modelValue.value = percentCompleted
            bufferValue.value = percentCompleted + 10 // Optional: Adjust buffer value if needed
          } else {
            // Handle the case where total is 0 or undefined
            console.warn('Total size of file is not available')
          }
        },
      },
    )
      .then(response => {
        const lotData = response.data.data

        coaFiles.value = lotData
        console.log('[*****Headers COA]]!!: ', lotData)
      })
      .catch(error => {
        console.error('Error:', error)
      })
      .finally(() => {
        loading.value = false
      })
  }
}

onBeforeUnmount(() => {
  clearInterval(interval.value)
})

// ฟังก์ชันเพื่อแปลง Base64 กลับเป็นไฟล์
const base64ToFile = (base64String, filename) => {
  let arr = base64String.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while(n--){
    u8arr[n] = bstr.charCodeAt(n)
  }
  
  return new File([u8arr], filename, { type: mime })
}

const base64ToBlob = (base64, mimeType) => {
  const byteCharacters = atob(base64)
  const byteArrays = []
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512)
    const byteNumbers = new Array(slice.length)
    
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }
    
    const byteArray = new Uint8Array(byteNumbers)

    byteArrays.push(byteArray)
  }
  
  return new Blob(byteArrays, { type: mimeType })
}

const formData = new FormData()

const saveCOARecevingFrom = async () => {  ////---- โค้ดใหม่ ยังไม่ได้เทสส****

  const formData = new FormData() // สร้าง FormData สำหรับส่งไฟล์

  // ตรวจสอบว่ามีไฟล์ใหม่หรือไฟล์เก่าอยู่ในระบบหรือไม่
  const hasNewFiles = files.value.length > 0
  const hasOldFiles = coaFiles.value.length > 0

  // ถ้ามีไฟล์ใหม่ ให้นำไฟล์ใหม่มาเพิ่มลงใน formData
  if (hasNewFiles) {
    await Promise.all(files.value.map((file, index) => {
      return new Promise(resolve => {
        const fileBlob = base64ToFile(file.src, `newFile_${index}.png`)

        formData.append('coaFiles', fileBlob) // ใส่ไฟล์ใหม่ลงใน formData
        resolve()
      })
    }))
    console.log('Added new files from files.value', formData)
  }

  // ถ้ามีไฟล์เก่า ให้นำไฟล์เก่ามาเพิ่มลงใน formData
  if (hasOldFiles) {
    await Promise.all(coaFiles.value.map((file, index) => {
      return new Promise(resolve => {
        const fileBlob = base64ToBlob(file.coAFile, 'image/png') // แปลงไฟล์เก่าเป็น blob

        formData.append('coaFiles', fileBlob, `oldFile_${index}.png`) // ใส่ไฟล์เก่าลงใน formData
        resolve()
      })
    }))
    console.log('Added old files from coaFiles', formData)
  }

  // ถ้าไม่มีไฟล์ใหม่หรือไฟล์เก่าเลย ให้หยุดการทำงาน
  if (!hasNewFiles && !hasOldFiles) {
    console.log('No files to save.')
    

  }

  deleteCOARecevingFrom() // ลบไฟล์เก่าก่อนทำการอัปโหลดไฟล์ใหม่และเก่ารวมกัน

  // ส่ง formData ที่รวมไฟล์เก่าและไฟล์ใหม่ไปยัง API
  
  try {
    console.log('formData++', formData)

    const response = await axiosIns.post(`${urlApi.value}/api/v1/ReceivingForm/save-coas/${data.value.poEtlLogDetailJournalID}`, formData, {
      headers: {
        'accept': '*/*',
        'x-location': `${whereHouse.value}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log('[products.value]!!: ', response.data)
  } catch (error) {
    console.error('Error:', error)
  }
}

const deleteCOARecevingFrom = () => {
  axiosIns.delete(`${urlApi.value}/api/v1/ReceivingForm/deleteCoA/${data.value.journalID}`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(response => {
      console.log('[products.value]!!: ', response.data)
    })
    .catch(error => {
      console.error('Error:', error)
    })
}

//--------------------------------- Date Time -----------------------------------------
const datePreparedBy = ref(new Date())

const dateManagerWarehouseApprove = ref(new Date())
const dateSupervisorWarehouseApprove = ref(new Date())

const dateStaffWarehouse = ref(new Date())
const dateSupervisorWarehouse = ref(new Date())

function formatDate(dateString) {
  if (dateString === null || dateString === '' || dateString === undefined) {
    return 'Null'
  } else if (dateString.length > 0) {
    const date = new Date(dateString) // แปลงสตริงเป็นวัตถุ Date
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0') // เดือนเริ่มต้นที่ 0, ดังนั้นต้อง +1
    const year = date.getFullYear()

    return `${day}/${month}/${year}`

  }

  return 'null'
}

//------------------------------ Basic -----------------------------------------------------
const isDialogRejectVisible = ref(false)

//---------------------------------- Controllers ----------------------------------------------------
const poEtlLogDetailJournalIDQueryParameters = ref(data.value.poEtlLogDetailJournalID)

const getHearderPackagingForm = () => {
  if (poEtlLogDetailJournalIDQueryParameters.value) {
    axiosIns.get(`${urlApi.value}/api/v1/Packaging/View/${poEtlLogDetailJournalIDQueryParameters.value}`, {
      headers: {
        'accept': '*/*',
        'x-location': `${whereHouse.value}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
    },
    {})
      .then(response => {

        const data = response.data.data

        console.log('[*****Headers]]!!: ', response.data.data)

      })
      .catch(error => {
        // Handle errors
        console.error('Error:', error)
      })
  } else {
    console.log('**poEtlLogDetailJournalIDQueryParameters = ', poEtlLogDetailJournalIDQueryParameters.value)
  }

}

//---------------------------------- Call function functions --------------------------------

// watchEffect(() => {
//   getHearderPackagingForm()
// })

//--------------------------------- MVC ----------------------------------------------------
// Import composable ที่เราสร้างสำหรับ logic การจัดการไฟล์
import { handleFilesOMvc, 
  getMockData, saveMockData, 
  saveMockHeaderData, getPropsData,
  getRouteData, submitData,
} from '@/controllers/skt/receivingFrom/packaging/controller'

import { modelHeader } from '@/model/skt/receivingPlan/packaging/lotDataModel'

//--------------------------------- real --------------------------
import { useReceivingFormController, useGetLotPackagingFormController } from '@/controllers/skt/receivingFrom/packaging/controller'

const dataHeader = ref({
  rmInspectionRequestFormJournalId: null,
  productId: "",
  productName: "",
  supplierId: "",
  supplierName: "",
  tradeName: "",
  makerName: "",
  coAChecked: false,
  remark: "",
  note: "",
  limConditionDetail: "",
  sktLot: "",
  purchaseOrderNo: "",
  purchasingQuantityPcs: 0,
  actualCheck: true,
  inspStaffUpdateBy: "",
  inspStaffUpdateDate: "",
  whUpdateBy: "",
  whUpdateDate: "",
  receivedDate: "",
  isAccept: false,
  isReject: false,
  statusComments: "",
  packagingImg: null,
})

// const dataHeader = ref(null)

const { packagingFormHeader, errorMessage, fetchPackagingFormHeader } = useReceivingFormController()

// Call API
//---- header --------------------------------
const checkCOAYes = ref(null)
const checkCOANo = ref(null)

fetchPackagingFormHeader(poEtlLogDetailJournalIDQueryParameters.value, urlApi.value, whereHouse.value, accessTokenAtStore)


//---- lot --------------------------------
const dataLot = ref({
  pkgInspReqFormAnalyticalItemsJournalId: 0,
  sqnText: "",
  typeID: 0,
  typeName: "",
  analyticalItem: "",
  method: "",
  specRange: "",
  needActualValue: false,
})

const analyticalItemsData = ref([])

const { packagingFormLot, errorMessageLot, fetchPackagingFormLot } = useGetLotPackagingFormController()

fetchPackagingFormLot(poEtlLogDetailJournalIDQueryParameters.value, urlApi.value, whereHouse.value, accessTokenAtStore)

watchEffect(() => {
  // ตรวจสอบว่า packagingFormHeader มีข้อมูลหรือไม่
  if (packagingFormHeader.value && packagingFormHeader.value.length > 0) {
    const receivedData = packagingFormHeader.value[0] // รับข้อมูลอ็อบเจกต์แรก

    // กำหนดค่าทั้งหมดให้กับ dataHeader
    dataHeader.value = {
      rmInspectionRequestFormJournalId: receivedData.rmInspectionRequestFormJournalId,
      productId: receivedData.productId,
      productName: receivedData.productName,
      supplierId: receivedData.supplierId,
      supplierName: receivedData.supplierName,
      tradeName: receivedData.tradeName,
      makerName: receivedData.makerName,
      coAChecked: receivedData.coAChecked,
      remark: receivedData.remark,
      note: receivedData.note,
      limConditionDetail: receivedData.limConditionDetail,
      sktLot: receivedData.sktLot,
      purchaseOrderNo: receivedData.purchaseOrderNo,
      purchasingQuantityPcs: receivedData.purchasingQuantityPcs,
      actualCheck: receivedData.actualCheck,
      inspStaffUpdateBy: receivedData.inspStaffUpdateBy,
      inspStaffUpdateDate: receivedData.inspStaffUpdateDate,
      whUpdateBy: receivedData.whUpdateBy,
      whUpdateDate: receivedData.whUpdateDate,
      receivedDate: receivedData.receivedDate,
      isAccept: receivedData.isAccept,
      isReject: receivedData.isReject,
      statusComments: receivedData.statusComments,
      packagingImg: receivedData.packagingImg,
    }
  }

  if(dataHeader.value.coAChecked === true){
    checkCOAYes.value = dataHeader.value.coAChecked
  }else if(dataHeader.value.coAChecked === false){
    checkCOANo.value = !dataHeader.value.coAChecked
  }

  if (packagingFormLot.value) {
    analyticalItemsData.value = packagingFormLot.value
  }

  if (packagingFormLot.length > 0) {
    // กำหนดค่าให้ dataLot จากอาร์เรย์ที่ได้รับจาก API
    const receivedData = packagingFormLot[0] // ใช้ข้อมูลอ็อบเจกต์แรก

    dataLot.value = {
      pkgInspReqFormAnalyticalItemsJournalId: receivedData.pkgInspReqFormAnalyticalItemsJournalId,
      sqnText: receivedData.sqnText,
      typeID: receivedData.typeID,
      typeName: receivedData.typeName,
      analyticalItem: receivedData.analyticalItem,
      method: receivedData.method,
      specRange: receivedData.specRange,
      needActualValue: receivedData.needActualValue,
    }
  }

})


//---- COA --------------------------------











//------------- Headers --------------------------------
// สร้างตัวแปรเพื่อเก็บไฟล์ที่เลือก
const filesMvc = ref([])
const headersMvc = ref(null)

// ฟังก์ชันที่จัดการไฟล์เมื่อผู้ใช้เลือกไฟล์
const onFilesSelected = () => {
  handleFilesOMvc(filesMvc.value)
}

// เก็บข้อมูลที่จะนำมาแสดงผล
const testResult = ref(null)

// เมื่อ component ทำงาน ให้ดึงข้อมูลจาก controller
onMounted(() => {
  testResult.value = getMockData()
})

//-------------------- Lot --------------------

//--------------------- Get --------------------
// ตั้งค่า dataModel โดยใช้ modelHeader
const dataModel = ref({ ...modelHeader })

// ข้อมูลที่มาจาก route

const routeData = ref(getRouteData())

const propsData = ref(getPropsData(props.Data))

//--------------------- Post --------------------

console.log("dataModel", dataModel.value)

// ฟังก์ชันสำหรับการส่งข้อมูล
const handleSubmit = () => {
  if(routeData.value){
    submitData(routeData.value)
    console.log("propsData data !", routeData.value)
  }else {
    console.log("propsData note data !")
  }
  
}

//---------------------- Function Btn ----------------------------------------------------------------
// ฟังก์ชันบันทึกข้อมูล (ส่งข้อมูลไปยัง model หรือ API)
const saveDraftData = () => {
  saveMockData(testResult.value)
  saveMockHeaderData(headersMvc.value)
  handleSubmit()
  console.log('Lot :', testResult.value)
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <h2 class="text-center">
        Packaging Inspection Request Form
      </h2>
    </VCol>
  </VRow>

  

  <!-- mvc -->
  <VRow v-if="true">
    <VCol cols="12">
      <div>
        <h4>Test Result (Mock Data):</h4>
        <pre>{{ testResult }}</pre>
      </div>

      <div>
        <h2>Packaging Form Header</h2>
        <pre>{{ analyticalItemsData }}</pre>
        <pre>{{ dataHeader }}</pre>

        <!-- Display error message if there's an error -->
        <div
          v-if="errorMessage"
          class="error-message"
        >
          <p>Error: {{ errorMessage }}</p>
        </div>
      </div>
    </VCol>
  </VRow>

  <!-- Header -->
  <VRow>
    <VCol
      class="text-center mx-4"
      style="border: 1px solid black; font-size: 14px; font-weight: bold;"
      cols="2"
    >
      CONFIDENTIAL
    </VCol>

    <VCol
      cols="12"
      style="overflow-x: auto; white-space: nowrap;"
    >
      <table class="custom-table">
        <tr>
          <th
            class=""
            colspan="4"
          />
          <th
            class=""
            colspan="2"
          >
            SKT Name
          </th>
          <td
            class="text-center"
            colspan="3"
          >
            {{ dataHeader.productName }}
          </td>
          <th
            rowspan="1"
            colspan="2"
            class=""
          >
            <div class="text-center">
              <span style="font-size: 16px;">Raw Mat. Code</span>
            </div>
          </th>
          <th
            colspan="2"
            class=""
          >
            Supplier Name
          </th>
          <td
            colspan="3"
            class="text-center"
          >
            {{ dataHeader.supplierName }}
          </td>
        </tr>
        <tr>
          <th
            colspan="2"
            class=""
          >
            Received Date
          </th>
          <td
            colspan="2"
            class=""
          >
            {{ formatDate(dataHeader.receivedDate) }}
          </td>
          <th
            colspan="2"
            class=""
          >
            Trade Name
          </th>
          <td
            colspan="3"
            class="text-center"
          >
            {{ dataHeader.tradeName }}
          </td>
          <td
            colspan="2"
            class="text-center"
          >
            {{ dataHeader.productId }}
          </td>
          <th colspan="2">
            Manufacturer Name
          </th>
          <td
            class="text-center"
            colspan="3"
          >
            {{ dataHeader.makerName }}
          </td>
        </tr>
        <tr>
          <th colspan="7">
            Certification of analysis from manufacturer
          </th>
          <td
            class="text-center"
            colspan="3"
          >
            <VRow>
              <VCol cols="6">
                <div class="demo-space-x">
                  <VCheckbox
                    v-model="checkCOAYes"
                    label="Yes"
                    readonly
                  />
                </div>
              </VCol>
              <VCol cols="6">
                <div class="demo-space-x">
                  <VCheckbox
                    v-model="checkCOANo"
                    label="No"
                    readonly
                  />
                </div>
              </VCol>
            </VRow>
          </td>
        </tr>
      </table>
    </VCol>
  </VRow>

  <div>
    <!-- แสดงข้อมูลใน props -->
    <div
      v-for="(item, index) in propsData"
      :key="index"
      class="bg-red"
    >
      {{ item }}
    </div>

    <div v-if="false">
      {{ routeData }}
    </div>
  </div>

  <!-- Analysis Item -->
  <VRow>
    <VCol
      cols="12"
      style="overflow-x: auto; white-space: nowrap;"
    >
      <!-- Table New MVC -->
      <table class="custom-table">
        <thead>
          <tr>
            <th
              colspan="1"
              rowspan="2"
            >
              No.
            </th>
            <th
              colspan="2"
              rowspan="2"
            >
              Analysis Items
            </th>
            <th
              colspan="2"
              rowspan="2"
            >
              Checking Method
            </th>
            <th
              colspan="2"
              rowspan="2"
            >
              Specification Ranges
            </th>
            <th colspan="1">
              P/O NO.
            </th>
            <td
              colspan="4"
              class="text-center"
            >
              <span>{{ dataHeader.purchaseOrderNo }}</span>
            </td>
          </tr>
          <tr>
            <th colspan="1">
              Amount (Piece)
            </th>
            <td
              colspan="4"
              class="text-center"
            >
              <span>{{ dataHeader.purchasingQuantityPcs }}</span>
            </td>
          </tr>
          <tr>
            <th colspan="7" />
            <th colspan="1">
              Actual Check
            </th>
            <th colspan="4">
              <VTextField density="compact" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in analyticalItemsData"
            :key="index"
          >
            <td colspan="1">
              {{ index+1 }}
            </td>
            <td colspan="2">
              {{ item.analyticalItem }}
            </td>
            <td colspan="2">
              {{ item.method }}
            </td>
            <td colspan="2">
              {{ item.specRange }}
            </td>
            <td colspan="1" />
            <td
              Style="min-width: 200px;"
              colspan="4"
            >
              <VTextField
                v-model="asdasd"
                density="compact"
              />
            </td>
          </tr>
        </tbody>
        <tbody v-if="false">
          <tr
            v-for="(item, index) in testResult"
            :key="index"
          >
            <th colspan="1">
              {{ index + 1 }}
            </th>
            <td colspan="2">
              {{ item.AItem }}
            </td>
            <td colspan="2">
              {{ item.CheckM }}
            </td>
            <td colspan="2">
              {{ item.SR }}
            </td>
            <td colspan="1">
              <VTextField
                v-model="item.ActualC"
                density="compact"
              />
            </td>
            <td colspan="2">
              <VTextField
                v-model="item.A"
                :style="{ width: '150px', maxWidth: '300px' }"
                density="compact"
              />
            </td>
            <td colspan="2">
              <VTextField
                v-model="item.B"
                :style="{ width: '150px', maxWidth: '300px' }"
                density="compact"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </VCol>

    <!-- Image -->
    <VCol cols="12">
      <table class="custom-table">
        <thead>
          <tr>
            <th>
              <VRow>
                <VCol cols="12">
                  <VImg
                    max-height="350px"
                    :src="dataHeader.packagingImg"
                  />
                </VCol>
              </VRow>
            </th>
          </tr>
        </thead>
      </table>
    </VCol>
  </VRow>

  <!-- Note -->
  <VRow>
    <!-- Note -->
    <VCol
      cols="6"
      class="text-decoration-underlined pb-2"
    >
      Note
    </VCol>
    <VCol
      cols="6"
      class="text-decoration-underlined pb-2"
    >
      Details of Limitation Condition
    </VCol>
    <VCol
      cols="12"
      class="pt-0"
    >
      <table class="custom-table">
        <thead>
          <tr>
            <th colspan="6">
              <VTextarea
                v-model="dataHeader.note"
                variant="plain"
                placeholder="Enter Your Notes"
                auto-grow
              />
            </th>
            <th colspan="6">
              <VTextarea
                v-model="dataHeader.remark"
                variant="plain"
                placeholder="Enter Your Details"
                auto-grow
              />
            </th>
          </tr>
        </thead>
      </table>
    </VCol>
  </VRow>

  <!-- Quality Evalution -->
  <VRow>
    <VCol cols="12">
      <span class="mb-2">Quality Evalution</span>
      <table class="custom-table mt-2">
        <thead>
          <tr>
            <th colspan="3">
              Approve
            </th>
            <th colspan="3">
              Reject
            </th>
            <th colspan="6">
              Comment
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="3">
              <div class="d-flex justify-center">
                <VIcon
                  v-if="statusId === 17 || statusId === 15"
                  color="success"
                  size="60"
                  icon="ri-checkbox-circle-fill"
                />
              </div>
            </td>
            <td colspan="3">
              <div class="d-flex justify-center">
                <VIcon
                  v-if="statusId === 7 || statusId === 16"
                  color="red"
                  size="60"
                  icon="ri-close-circle-fill"
                />
              </div>
            </td>
            <td colspan="6">
              <span v-if="statusId === 7 || statusId === 16">Comments Rejected because of the following error</span>
            </td>
          </tr>
        </tbody>
      </table>
    </VCol>
  </VRow>
  
  <!-- COA -->
  <VRow>
    <VCol cols="12">
      <div class="mb-2">
        COA
      </div>
      <Table class="custom-table">
        <tr>
          <th>
            <VRow v-if="!files.length">
              <VCol cols="12">
                <VFileInput
                  v-model="files"
                  label="File Input COA"
                  placeholder="Upload your documents"
                  multiple
                  prepend-icon="mdi-paperclip"
                  @change="handleFilesO"
                />
              </VCol>
            </VRow>

            <VRow
              v-if="files.length"
              class="pa-2 d-flex justify-center"
            >
              <VCol
                v-for="(file, index) in files"
                :key="index"
                cols="12"
                md="4"
                lg="3"
              >
                <VCard>
                  <VCardText>
                    <VImg
                      role="presentation"
                      :alt="file.name"
                      :src="file.src"
                      height="150"
                      contain
                      @click="showDialogImageMuti(file.src, file.name )"
                    />
                    <div class="d-flex flex-column align-center">
                      <span>{{ file.name }}</span>
                      <span>{{ file.size }} KB</span>
                    </div>
                  </VCardText>
                  <VCardActions>
                    <VBtn
                      variant="flat"
                      width="100%"
                      color="error"
                      @click="removeFile(index)"
                    >
                      <VIcon>ri-delete-bin-5-fill</VIcon>
                    </VBtn>
                  </VCardActions>
                </VCard>
              </VCol>
            </VRow>

            <div v-if="coaFiles.length || files.length">
              <VCol
                class="d-flex justify-end"
                cols="12"
              >
                <VBtn
                  color="red"
                  @click="deleteAllCIA"
                >
                  <VIcon icon="ri-delete-bin-6-line" />
                  Delete All COA
                </VBtn>
              </VCol>
            </div>
          </th>
        </tr>
      </Table>
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

  <!-- Warehouse -->
  <VRow>
    <VCol cols="6">
      <table class="custom-table">
        <thead>
          <tr>
            <th
              class="text-center"
              colspan="12"
            >
              Warehouse
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="6">
              <VTextField
                v-model="dataHeader.inspStaffUpdateBy"
                density="compact"
                label="Staff"
                readonly
              />
            </td>
            <td colspan="6">
              <VTextField
                v-model="dataHeader.whUpdateBy"
                density="compact"
                label="Supervisor"
                readonly
              />
            </td>
          </tr>
          <tr>
            <td colspan="6">
              <VueDatePicker
                v-model="dataHeader.inspStaffUpdateDate"
                :max-date="new Date()"
                :enable-time-picker="false"
                readonly
              />
            </td>
            <td colspan="6">
              <VueDatePicker
                v-model="dataHeader.whUpdateDate"
                :max-date="new Date()"
                :enable-time-picker="false"
                readonly
              />
            </td>
          </tr>
        </tbody>
      </table>
    </VCol>
  </VRow>

  <!-- Dialog Reject -->
  <section>
    <VDialog
      v-model="isDialogRejectVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard title="Comment">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogRejectVisible = false"
        />

        <VCardText>
          <VTextarea
            label="Comment"
            placeholder="Enter Comment Reject"
          />
        </VCardText>

        <VCardText class="d-flex justify-space-between flex-wrap gap-4">
          <VBtn
            color="error"
            @click="isDialogRejectVisible = false"
          >
            Reject
          </VBtn>
          <VBtn
            color="warning"
            @click="isDialogRejectVisible = false"
          >
            close
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <!-- Dialog Step Save Draft -->
  <section style="font-size: 12px;">
    <VDialog
      v-model="isDialogVisibleStepSaveDraft"
      width="80%"
    >
      <!-- Dialog Content -->
      <VCard
        class="text-center"
        title="Save Draft"
      >
        <VCardText class="pa-1">
          <VRow>
            <VCol
              class="text-center d-flex flex-column align-center justify-center mx-auto"
              cols="4"
            >
              <div>
                <VProgressLinear
                  v-if="loadindingSaveDatft1"
                  indeterminate
                  color="primary"
                />
                <VProgressLinear
                  v-if="loadindingSaveDatftSeccess1"
                  model-value="100"
                  color="primary"
                />
                <VProgressLinear
                  v-if="loadindingSaveDatftFailed1"
                  model-value="0"
                />
                <VAvatar
                  class="my-2"
                  size="150"
                  :color="colorStep1"
                >
                  <VIcon
                    size="100"
                    :icon="iconStep1"
                  />
                </VAvatar>
              </div>
              <div><span style="font-size: 12px;">Save Draft Header</span></div>
            </VCol>
            <VCol
              class="text-center d-flex flex-column align-center justify-center mx-auto"
              cols="4"
            >
              <div>
                <VProgressLinear
                  v-if="loadindingSaveDatft2"
                  indeterminate
                  color="primary"
                />
                <VProgressLinear
                  v-if="loadindingSaveDatftSeccess2"
                  model-value="100"
                  color="primary"
                />
                <VProgressLinear
                  v-if="loadindingSaveDatftFailed2"
                  model-value="0"
                />
                <VAvatar
                  class="my-2"
                  size="150"
                  :color="colorStep2"
                >
                  <VIcon
                    size="100"
                    :icon="iconStep2"
                  />
                </VAvatar>
              </div>
              <div><span style="font-size: 12px;">Save Draft Lot</span></div>
            </VCol>
            <VCol
              class="text-center d-flex flex-column align-center justify-center mx-auto"
              cols="4"
            >
              <div>
                <VProgressLinear
                  v-if="loadindingSaveDatft3"
                  indeterminate
                  color="primary"
                />
                <VProgressLinear
                  v-if="loadindingSaveDatftSeccess3"
                  model-value="100"
                  color="primary"
                />
                <VProgressLinear
                  v-if="loadindingSaveDatftFailed3"
                  model-value="0"
                />
                <VAvatar
                  class="my-2"
                  size="150"
                  :color="colorStep3"
                >
                  <VIcon
                    size="100"
                    :icon="iconStep3"
                  />
                </VAvatar>
              </div>
              <div><span style="font-size: 12px;">Save Draft COA</span></div>
            </VCol>
          </VRow>
        </VCardText>
        <VCardText
          v-if="alertErrorLot"
          class="text-start"
        >
          <VDivider />
          <div>
            <VAlert
              title="Details Lot"
              variant="outlined"
              closable
            >
              <div
                v-for="(value, key) in alertErrorLot"
                :key="key"
              >
                <span
                  v-if="value"
                  style="font-size: 14px;"
                >
                  <VIcon
                    color="error"
                    icon="ri-error-warning-fill"
                  />{{ key }}: {{ value }}
                </span>
                <span
                  v-if="!value"
                  style="font-size: 14px;"
                >
                  <VIcon
                    color="success"
                    icon="ri-checkbox-circle-fill"
                  />{{ key }} {{ value }}
                </span>
              </div>
            </VAlert>
          </div>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <!-- Btn -->
  <VRow>
    <VCol cols="4" />
    <VCol
      cols="8"
      class="d-flex justify-end"
    >
      <VBtn

        height="100%"
        width="150px"
        color="warning"
        @click="saveDraftData"
      >
        Save daft
      </VBtn>
      <VBtn

        height="100%"
        width="150px"
        class="mx-2"
        color="error"
        @click="isDialogRejectVisible = true"
      >
        Reject
      </VBtn>
      <VBtn

        height="40px"
        width="150px"
      >
        <VRow>
          <VCol
            class="py-2"
            cols="12"
          >
            submit
          </VCol>
        </VRow>
      </VBtn>
    </VCol>
  </VRow>
</template>

<style scoped>
.text-center {
  text-align: center;
}

.centered-input >>> input {
  padding: 0;
  text-align: center;
}

.table-container {
  overflow-x: auto;
}

.custom-table {
  border-collapse: collapse;
  border-spacing: 0;
  inline-size: 100%;
}

.custom-table,
.custom-table th,
.custom-table td {
  border: 1px solid black;
  font-size: 12px;
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
</style>
