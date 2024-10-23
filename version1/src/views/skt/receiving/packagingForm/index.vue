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

//--------------------------------------- Rule Page By Status -----------------------

const frozeCheck = ref(false)

const frozeCheckVif = ref(true)

const data = ref(JSON.parse(route.query.Data || '[]'))

if(data.value){
  console.log('Data:', data)
}

const statusId = ref('')

watch(() => {
  
})

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

//--------------------------------- Component ---------------------------------------------
//--------------------- alertDialog--------------------------------------------------------
import AuthenticatorDialog  from '@/components/dialogs/alert/alertDialog.vue'

const isDialogVisibleAlertDialog = ref(false)

//--------------------------------- MVC ----------------------------------------------------
// Import composable ที่เราสร้างสำหรับ logic การจัดการไฟล์
import { handleFilesOMvc, 
  getMockData, saveMockData, 
  saveMockHeaderData, getPropsData,
  getRouteData, submitData,
} from '@/services/skt/receivingFrom/packaging/controller'

import { modelHeader } from '@/model/skt/receivingPlan/packaging/lotDataModel'

//--------------------------------- real --------------------------
import { useReceivingFormController, 
  useGetLotPackagingFormController, 
  useGetCOAPackagingFormController,
  useGeneratePackagingFormController, useGeneratePackagingViewFormController,
  handleSaveDraft, handleSaveDraftLot,
  useSaveCOAFormController, useDeleteCoaFormController,
  useDeleteAllCoaFormController, useGetCOAFilePackagingFormController,
  useRejectPackagingFormController, useAcceptPackagingFormController,
} from '@/services/skt/receivingFrom/packaging/controller'

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
  actualCheck: 0,
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

//////--------------------------------- Defined Rules Input -------------------------------------------
const maxLines = 4
const maxCharsPerLine = 130

const limitTextInputLine4Note = event => {
  const inputText = event.target.value
  let lines = inputText.split('\n')
  
  const maxLines = 4
  const maxCharsPerLine = 130

  // ป้องกันไม่ให้พิมพ์เกิน 130 ตัวอักษรในแต่ละบรรทัด
  for (let i = 0; i < lines.length; i++) {
    while (lines[i].length > maxCharsPerLine) {
      // ถ้าตัวอักษรเกิน 130 ตัวในบรรทัดที่กำหนด ให้ขึ้นบรรทัดใหม่
      let extraText = lines[i].slice(maxCharsPerLine)
      lines[i] = lines[i].slice(0, maxCharsPerLine)
      
      if (i + 1 < maxLines) {
        // ถ้าบรรทัดถัดไปยังไม่เกิน 4 ให้เพิ่มบรรทัดใหม่
        lines.splice(i + 1, 0, extraText)
      } else {
        // ถ้าเกิน 4 บรรทัดแล้ว ให้ตัดส่วนที่เกินทิ้ง
        break
      }
    }
  }

  // ป้องกันไม่ให้เกินจำนวนบรรทัดที่กำหนด
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines)
  }

  // อัปเดตค่าใน textarea
  event.target.value = lines.join('\n')
  dataHeader.value.note = event.target.value
}

const limitTextInputLine4Details = event => {
  const inputText = event.target.value
  let lines = inputText.split('\n')
  
  const maxLines = 4
  const maxCharsPerLine = 130

  // ป้องกันไม่ให้พิมพ์เกิน 130 ตัวอักษรในแต่ละบรรทัด
  for (let i = 0; i < lines.length; i++) {
    while (lines[i].length > maxCharsPerLine) {
      // ถ้าตัวอักษรเกิน 130 ตัวในบรรทัดที่กำหนด ให้ขึ้นบรรทัดใหม่
      let extraText = lines[i].slice(maxCharsPerLine)
      lines[i] = lines[i].slice(0, maxCharsPerLine)
      
      if (i + 1 < maxLines) {
        // ถ้าบรรทัดถัดไปยังไม่เกิน 4 ให้เพิ่มบรรทัดใหม่
        lines.splice(i + 1, 0, extraText)
      } else {
        // ถ้าเกิน 4 บรรทัดแล้ว ให้ตัดส่วนที่เกินทิ้ง
        break
      }
    }
  }

  // ป้องกันไม่ให้เกินจำนวนบรรทัดที่กำหนด
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines)
  }

  // อัปเดตค่าใน textarea
  event.target.value = lines.join('\n')
  dataHeader.value.limConditionDetail = event.target.value
}

const wordForSubmit = ref('Word')

// Call API
//------------------------------------------- Gennterate

watch(() => {
  const { packagingFormGenerate, errorMessageGenerate, fetchPackagingFormGenerate } = useGeneratePackagingFormController()

  fetchPackagingFormGenerate(poEtlLogDetailJournalIDQueryParameters.value, urlApi.value, whereHouse.value, accessTokenAtStore)

  const { packagingFormGenerateView, errorMessageGenerateView, fetchPackagingViewFormGenerate } = useGeneratePackagingViewFormController()

  fetchPackagingViewFormGenerate(poEtlLogDetailJournalIDQueryParameters.value, urlApi.value, whereHouse.value, accessTokenAtStore)
})

//------------------------------------------- generate view---
//------------- journalId
const responseGener = ref([])

const loadingGenerated = ref(true)

const generatedJournalId = () => {
  axiosIns.get(`${urlApi.value}/api/v1/ReceivingPlan/GetByPoEtlLogDetailJournalID/${poEtlLogDetailJournalIDQueryParameters.value}`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`, 
    },
  },
  {})
    .then(response => {
      console.log('%c[generatedJournalId] nre!!: ', "color: green; font-weight: bold", response.data)

      // ตรวจสอบว่ามีข้อมูลใน response.data.data ก่อน
      if (response.data && response.data.data && response.data.data.length > 0) {
        responseGener.value = response.data.data // เก็บค่า response.data.data ลงใน responseGener

        const item = responseGener.value[0] // เข้าถึงข้อมูลตัวแรกใน array

        statusId.value = item.statusId // เก็บค่า statusId
      } else {
        console.error("ไม่มีข้อมูลใน responseGener")
      }

      loadingGenerated.value = false
    })
    .catch(error => {
      console.error('Error:', error)
    })
}

watch(() => {
  generatedJournalId()

  if(statusId.value === 10 || statusId.value === 1){
    frozeCheck.value = false
    console.log("TfrozeCheckVifT", frozeCheck.value)
  }else{
    frozeCheck.value = true
  } 


})

//---- header --------------------------------

const alertHeaderErrorMessage = ref({
  success: false,

  coaChecked: '',
  actualCheck: '',
  note: '',
  limConditionDetail: '',
})

//----- GET
const checkCOAYes = ref(null)
const checkCOANo = ref(null)

// const dataHeader = ref(null)

const { packagingFormHeader, errorMessage, fetchPackagingFormHeader } = useReceivingFormController()

fetchPackagingFormHeader(poEtlLogDetailJournalIDQueryParameters.value, urlApi.value, whereHouse.value, accessTokenAtStore)

//----- POST

const handleInputNumberOnly = e => {
  let value = e.target.value

  // ตรวจสอบว่าเป็นตัวเลขจำนวนเต็มเท่านั้น (ไม่รวมทศนิยม)
  const regex = /^[0-9]*$/

  // หากไม่ตรงกับเงื่อนไขของ regex จะคืนค่าสุดท้ายที่ถูกต้อง
  if (!regex.test(value)) {
    value = value.replace(/\D/g, '') // ลบตัวอักษรที่ไม่ใช่ตัวเลขออก
  }

  // จำกัดจำนวนหลักรวมไม่เกิน 8 หลัก
  if (value.length > 8) {
    value = value.slice(0, 8) // ตัดค่าที่เกินออก
  }

  // อัปเดตค่าใน dataHeader.actualCheck
  dataHeader.value.actualCheck = value
}

const saveDraftHeader = async () => {
  
  const bodyCheck = dataHeader.value

  // console.log('Start saveDraftHeader!!', bodyCheck.actualCheck)

  if(trickerSubmit.value){
    if(!bodyCheck.actualCheck){
      alertHeaderErrorMessage.value.success = true

      alertHeaderErrorMessage.value.actualCheck = "Actual Check is required. Please enter a value."
      throw 'Actual Check is required. Please enter a value.'
    }

    if(dataHeader.value === 'null'){
    
      throw 'dataHeader invalid'
    }
  }

  const result = await handleSaveDraft(poEtlLogDetailJournalIDQueryParameters.value, dataHeader.value, urlApi.value, whereHouse.value, accessTokenAtStore)

  if (result.success === true) {
    // isDialogSubmitSuccessVisible.value = true
    console.log('Save header details successful')
  } else {
    // isDialogSubmitFailedVisible.value = true
    throw 'Failed to save header details'+result.error
  }
  alertHeaderErrorMessage.value.success = false
  
  return true
}

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

//----------------------------------------------- Post ----------------------------------------

const textAlertError = ref({
  success: true,

  comment: '',
  coa: '',
})

//----------------- Accept
const { packagingFormAccept, acceptPackagingForm } = useAcceptPackagingFormController()

const handleAcceptPackaging = async () => {
  isDialogConfirmVisible.value = false
  try {
    wordForSubmit.value = "ACCEPT"

    // รอให้ submitButtonVisibleNew() ทำงานเสร็จ
    const handeSaveDraf = await submitButtonVisibleNew()

    // ตรวจสอบถ้าการ submit ล้มเหลว
    if (!handeSaveDraf) {
      throw new Error('Failed to submit')
    }

    // ปิด dialog confirm
    isDialogConfirmVisible.value = false

    // เรียกใช้ฟังก์ชัน acceptPackagingForm
    await acceptPackagingForm(
      poEtlLogDetailJournalIDQueryParameters.value, 
      urlApi.value, 
      "Packaging", 
      whereHouse, 
      accessTokenAtStore,
    )

    // ตรวจสอบถ้า packagingFormAccept สำเร็จ
    if (packagingFormAccept) {
      console.log('accept reject successful')
      alertLotErrorMessage.value.success = false
      isDialogRejectVisible.value = false

      textAlertDialogFunction('ACCEPT', true)

      // หน่วงเวลา 10 วินาที ก่อนที่จะ reload หน้าเว็บ
      setTimeout(() => {
        location.reload()
      }, 300) // 10000 มิลลิวินาที = 10 วินาที

      // location.reload() // รีเฟรชหน้า
    } else {
      console.error('Failed to accept reject')
      isDialogRejectVisible.value = false
      textAlertDialogFunction('ACCEPT', false)
      throw new Error('Failed to accept reject.')
    }

    return true
  } catch (error) {
    isDialogRejectVisible.value = false
    console.error('Error in handleAcceptPackaging:', error)
    
    return false
  }
}

//----------------- Reject
const commentReject = ref('')
const { packagingFormReject, rejectPackagingForm } = useRejectPackagingFormController()

const handleRejectPackaging = async word => {

  const coaLotSave = await submitButtonVisibleNew(word)

  if(!coaLotSave){
    throw 'error save lot alert'
  }

  if(!commentReject.value){
    textAlertError.value.success = false
    textAlertError.value.comment = 'Please provide a comment to reject the packaging.'
    isDialogVisibleStepSaveDraft.value = false
    isDialogRejectVisible.value = true
    throw 'Please provide a comment to reject the packaging'
  }else{
    const result = await rejectPackagingForm(commentReject.value, poEtlLogDetailJournalIDQueryParameters.value, urlApi.value, "Packaging", whereHouse, accessTokenAtStore)

    console.log("result Packaing", packagingFormReject.success)
    if (result.success === true) {
      
      // console.log('Save lot reject successful')
      // alertLotErrorMessage.value.success = false
      // isDialogRejectVisible.value = false

      textAlertDialogFunction('REJECT', true)

      // หน่วงเวลา 10 วินาที ก่อนที่จะ reload หน้าเว็บ
      setTimeout(() => {
        location.reload()
      }, 300) // 10000 มิลลิวินาที = 10 วินาที
    } else {
      console.error('Failed to save lot reject')
      textAlertDialogFunction('REJECT', false)
      throw 'Failed to save lot reject.'
    }

    // alertLotErrorMessage.value.success = false
  
    // throw 'reject success!'
    
    return true
  }

  return true
}

//----- POST ---------------------------------------------------------------------------------------------------------------------------------
const alertLotErrorMessage = ref({
  success: false,
  actualAnalysis: {},

})

//
const saveDraftLotDetails = async () => {

  const bodyCheck = analyticalItemsData.value

  if(trickerSubmit.value){
    //validate
    bodyCheck.forEach((item, index) => {
      console.log('Validate Lot')
      if (!item.actualAnalysis || item.actualAnalysis === '') {
        console.log('Validate Lot if')
        alertLotErrorMessage.value.success = true // แสดงว่ามีข้อผิดพลาด
        // เก็บข้อความแยกตามลำดับไอเท็มที่มีปัญหา
        alertLotErrorMessage.value.actualAnalysis[`item_${index + 1}`] = `Actual Analysis is required for item ${index + 1}. Please enter a value.`
      }
    })

    // ตรวจสอบว่ามีข้อผิดพลาดหรือไม่
    if (alertLotErrorMessage.value.success) {
      throw 'Actual Analysis validation failed. Please check the errors.'
    }
  }
  
  const result = await handleSaveDraftLot(analyticalItemsData.value, urlApi.value, whereHouse, accessTokenAtStore)

  if (result.success) {
    console.log('Save lot details successful')
    alertLotErrorMessage.value.success = false
  } else {
    console.error('Failed to save lot details')
    throw 'Failed to save lot details.'
  }

  alertLotErrorMessage.value.success = false
  
  return true
}

//---- COA --------------------------------

//-------------------- Model Image --------------------

const fileCoaTestPath = ref('')

const fileCoaHeader = ref([])

const fileCoaNew = ref([])

//- Get
const { getFormCoa, errorMessageCoaHeader, fetchFormCoaHeader } = useGetCOAPackagingFormController()

fetchFormCoaHeader(poEtlLogDetailJournalIDQueryParameters.value, urlApi.value, whereHouse.value, accessTokenAtStore)

const showDialogImageMutiNew = (img, name) => {

  isDialogVisibleImgFileMuti.value = true
  imgDialog.value = img
  imgNameDialog.value = name

  d
}

// ---- Get File 

const { getFileCoa, errorMessageFileCoa, fetchFileCoaHeader } = useGetCOAFilePackagingFormController()

const getFileCoaByName = nameFiel => {
  fetchFileCoaHeader(nameFiel, poEtlLogDetailJournalIDQueryParameters.value, urlApi.value, whereHouse.value, accessTokenAtStore)

  console.log("+++++++getFileCoa.value", getFileCoa.value)

  return getFileCoa.value
}

getFileCoaByName('6aaf646f-d008-4e6a-aa46-75a17fc180b4.png')

const testCoa = () => {
  console.log('Test Coa')
}

const showValueUpload = index => {
  console.log("Start Upload!!", index)
}

const testCoaO = () => {
  console.log('Test Coa', getFormCoa.value)
}

const fileUrls = ref({}) // เก็บ URLs ที่ถูกสร้างขึ้น

// ฟังก์ชันสำหรับสร้าง URL ของไฟล์
const getFileUrl = file => {
  if (!fileUrls.value[file.name]) {
    fileUrls.value[file.name] = URL.createObjectURL(file)
  }
  
  return fileUrls.value[file.name]
}

const coaIdForDelete = ref([])

const testCoaODelete = () => {
  console.log('Test Coa', coaIdForDelete.value)
}

// ฟังก์ชันสำหรับลบไฟล์และปล่อย URL
const removeFileN = index => {
  const file = fileCoaNew.value[index]
  if (fileUrls.value[file.name]) {
    URL.revokeObjectURL(fileUrls.value[file.name]) // ปล่อย URL
    delete fileUrls.value[file.name] // ลบ URL จาก object
  }
  fileCoaNew.value.splice(index, 1) // ลบไฟล์จาก array

  if(file){
    if(file.length < 1){
      fileCoaNew.value = []
      console.log('clear fileCoaNew complet!')
    }else{
      console.log('Test length < 1')
    }
    
  }
}

const removeFileO = (index, id) => {
  const file = getFormCoa.value[index]
  if (fileUrls.value[file.name]) {
    URL.revokeObjectURL(fileUrls.value[file.name]) // ปล่อย URL
    delete fileUrls.value[file.name] // ลบ URL จาก object
  }

  // เพิ่ม journalID เข้าไปใน coaIdForDelete
  coaIdForDelete.value.push(id)

  getFormCoa.value.splice(index, 1) // ลบไฟล์จาก array

  if(file){
    if(file.length < 1){
      getFormCoa.value = []
      console.log('clear getFormCoa complet!')
    }else{
      console.log('Test length < 1')
    }
    
  }

}

const deleteAllStart = ref(false)

const removeFileAll = () => {
  getFormCoa.value = []
  fileCoaNew.value = []
  deleteAllStart.value = true
}

// ปล่อย URL ทั้งหมดเมื่อ component ถูกทำลาย
onBeforeUnmount(() => {
  Object.values(fileUrls.value).forEach(url => {
    URL.revokeObjectURL(url) // ปล่อย URL ที่สร้างไว้ทั้งหมด
  })
})

//---- delete coa

const { resultDeleteByIdCoa, errorMessageDeleteCoa, deleteCoaForm } = useDeleteCoaFormController()

const { resultDeleteAllCoa, errorMessageDeleteAllCoa, deleteAllCoaForm } = useDeleteAllCoaFormController()

//--- save draf
const { saveCoaForm, errorMessageCOA, handleSaveDraftCoaForm } = useSaveCOAFormController()

const trickerSubmit = ref(false)

// eslint-disable-next-line sonarjs/cognitive-complexity
const handleSaveDraftCoa = async () => {
  const result = ref(1)

  console.log("trickerSubmit", trickerSubmit.value)

  if(trickerSubmit.value && wordForSubmit.value !== 'REJECT'){
    console.log("trickerSubmit!++2", fileCoaNew.value, getFormCoa.value, wordForSubmit.value)
    if (!fileCoaNew.value.length > 0 && !getFormCoa.value) {
      result.value -=1
      textAlertError.value.success = false
      textAlertError.value.coa = 'Failed to save coa. Plase Upload COA ones.'
      throw 'Failed to save coa. Plase Upload COA ones.'
    }

    if(getFormCoa.value){
      result.value += 1
    }

    // console.log("!151551deleteAllStart", deleteAllStart.value)

    if(deleteAllStart.value === true){
      await deleteAllCoaForm(poEtlLogDetailJournalIDQueryParameters.value, urlApi.value, 'Packaging', whereHouse.value, accessTokenAtStore)
      if (resultDeleteAllCoa.value.success === true) {
        console.log('Delete coa all  successful')
        result.value +=1

      // return resultDeleteAllCoa
      } else {
        result.value -=1
        console.error('Failed to delete all coa')
        throw 'Failed to delete all coa'  
      }
    }
  }
  
  if(deleteAllStart.value === true){
    await deleteAllCoaForm(poEtlLogDetailJournalIDQueryParameters.value, urlApi.value, 'Packaging', whereHouse.value, accessTokenAtStore)
    if (resultDeleteAllCoa.value.success === true) {
      console.log('Delete coa all  successful')
      result.value +=1

      // return resultDeleteAllCoa
    } else {
      result.value -=1
      console.error('Failed to delete all coa')
      throw 'Failed to delete all coa'  
    }
  }
  

  if(coaIdForDelete.value.length > 0){
    await deleteCoaForm(coaIdForDelete.value, poEtlLogDetailJournalIDQueryParameters.value, urlApi.value, 'Packaging', whereHouse.value, accessTokenAtStore)

    if (resultDeleteByIdCoa.value.success === true) {
      console.log('Delete coa by id  successful')
      result.value +=1

      // return resultDeleteByIdCoa
    } else {
      result.value -=1
      console.error('Failed to delete by id coa')
      throw 'Failed to delete by id coa'
    }
  }

  if(fileCoaNew.value){
    await handleSaveDraftCoaForm(fileCoaNew.value, poEtlLogDetailJournalIDQueryParameters.value, 'Packaging', urlApi.value, whereHouse.value, accessTokenAtStore)

    if (saveCoaForm) {
      console.log('Save coa  successful')
      result.value +=1

      // return saveCoaForm
    } else {
      result.value -=1
      console.error('Failed to save coa')
      throw 'Failed to save coa'
    }
  }

  if(result.value <= 0) {
    throw 'Failed to handleSaveDraftCoa'
  }


  textAlertError.value.success = true
  
  return result

  // throw 'Success!!'

  
}

//---------------------- Function Btn ----------------------------------------------------------------

//-------------------- Watch Validate --------------------------------
const isDialogVisibleStepSaveDraft = ref(false)

//--------------------------- Dialog Submit -------------------------------
const isDialogConfirmVisible = ref(false)
const isDialogSubmitSuccessVisible = ref(false)
const isDialogTextAreaVisible = ref(false)

//---------- Step 1 ------------------------
const iconStep1 = ref('ri-save-3-line')
const colorStep1 = ref('secondary')

//---------- Step 2 ------------------------
const iconStep2 = ref('ri-save-3-line')
const colorStep2 = ref('secondary')

//---------- Step 3 ------------------------
const iconStep3 = ref('ri-save-3-line')
const colorStep3 = ref('secondary')

//------------ loadind 1---------------------
const loadindingSaveDatft1 = ref(false)
const loadindingSaveDatftFailed1 = ref(false)
const loadindingSaveDatftSeccess1 = ref(false)

//------------ loadind 2 ---------------------
const loadindingSaveDatft2 = ref(false)
const loadindingSaveDatftFailed2 = ref(false)
const loadindingSaveDatftSeccess2 = ref(false)

//------------ loadind 3 ---------------------
const loadindingSaveDatft3 = ref(false)
const loadindingSaveDatftFailed3 = ref(false)
const loadindingSaveDatftSeccess3 = ref(false)

const submitButtonVisibleNew = async word => {
  wordForSubmit.value = word
  isDialogVisibleStepSaveDraft.value = true

  //------------------ Validate Comment Reject -----------------------------------
  if(word === 'REJECT'){
    if(!commentReject.value){
      textAlertError.value.success = false
      isDialogVisibleStepSaveDraft.value = false
      isDialogRejectVisible.value = true
      textAlertError.value.comment = 'Please provide a comment to reject the packaging.'
      throw 'Please provide a comment to reject the packaging'
    }
  }else{
    console.log('no function')
  }
  

  //------------------ step -----------------------------------
  try {
    // Start Step 1
    loadindingSaveDatft1.value = true

    // Step 1: saveLotReceivingForm

    await saveDraftHeader()
    console.log('saveHeaderReceivingForm success')

    iconStep1.value = 'ri-check-line'
    colorStep1.value = 'success'
    loadindingSaveDatftSeccess1.value = true
    loadindingSaveDatft1.value = false
  } catch (error) {
    console.error('saveLotReceivingForm failed:', error)

    iconStep1.value = 'ri-error-warning-line'
    colorStep1.value = 'error'
    wordForSubmit.value = "SAVE HEADER"

    loadindingSaveDatftFailed1.value = false
    loadindingSaveDatftSeccess1.value = false

    loadindingSaveDatft1.value = false
    isDialogConfirmVisible.value = false

    // isDialogSubmitFailedVisible.value = true

    return // หยุดการทำงานหากฟังก์ชันนี้ล้มเหลว
  }

  try {
    // Start Step 2
    loadindingSaveDatft2.value = true

    // Step 2: saveHeaderReceivingForm
    // console.error('Error: actualMakerLotNo_1 is empty or undefined. out')
    await saveDraftLotDetails()
    console.log('saveLotReceivingForm success')
    iconStep2.value = 'ri-check-line'
    colorStep2.value = 'success'

    loadindingSaveDatftSeccess2.value = true
    loadindingSaveDatft2.value = false
  } catch (error) {
    console.error('saveLotReceivingForm failed:', error)
    wordForSubmit.value = "SAVE LOT"
    iconStep2.value = 'ri-error-warning-line'
    colorStep2.value = 'error'

    loadindingSaveDatftFailed2.value = false
    loadindingSaveDatftSeccess2.value = false

    loadindingSaveDatft2.value = false

    // wordForSubmit.value = '2'
    isDialogConfirmVisible.value = false

    // isDialogSubmitFailedVisible.value = false

    return // หยุดการทำงานหากฟังก์ชันนี้ล้มเหลว
  }

  try {
    // Start Step 1
    loadindingSaveDatft3.value = true

    // Step 3: saveCOARecevingFrom
    await handleSaveDraftCoa()
    console.log('saveCOARecevingFrom success')
    iconStep3.value = 'ri-check-line'
    colorStep3.value = 'success'
    loadindingSaveDatftSeccess3.value = true
    loadindingSaveDatft3.value = false
  } catch (error) {
    console.error('saveCOARecevingFrom failed:', error)
    iconStep3.value = 'ri-error-warning-line'
    colorStep3.value = 'error'

    wordForSubmit.value = "SUBMIT"

    loadindingSaveDatftFailed3.value = false
    loadindingSaveDatftSeccess3.value = false

    loadindingSaveDatft3.value = false

    isDialogSubmitFailedVisible.value = false
    isDialogConfirmVisible.value = false

    return // หยุดการทำงานหากฟังก์ชันนี้ล้มเหลว
  }

  // ปิด dialog เมื่อสำเร็จทุกขั้นตอน
  // isDialogVisibleStepSaveDraft.value = false

  textAlertDialogFunction('SAVE DRAFT', true)

  if(trickerSubmit.value !== true){
    location.reload()
  }

  // isDialogSubmitSuccessVisible.value = true
  isDialogConfirmVisible.value = false

  return true
}

//--------------------------- function --------------------------------------
const successDialAlert = ref(false)

const textAlertDialogFunction = (word, success) => {
  wordForSubmit.value = word
  successDialAlert.value = success
  isDialogVisibleAlertDialog.value = true
}

//-------------------------- Btn ----------------------------------------------------------------
const saveDraft = () => {
  trickerSubmit.value = false
}

const reject = word => {
  trickerSubmit.value = true
  wordForSubmit.value = word
  isDialogRejectVisible.value = false
  handleRejectPackaging(word)
}

const submitForm = word => {
  trickerSubmit.value = true
  wordForSubmit.value = word
  console.log("submitForm word", word)
  isDialogConfirmVisible.value = true
}

// ฟังก์ชันบันทึกข้อมูล (ส่งข้อมูลไปยัง model หรือ API)
const saveDraftData = word => {
  trickerSubmit.value = false
  submitButtonVisibleNew()
  wordForSubmit.value = word
  console.log('saveDraftData', trickerSubmit.value)
}
</script>

<template>
  <div v-if="loadingGenerated" class="mt-1">
    <VProgressLinear
      height="20"
      color="success"
      indeterminate 
    >
      <span>Loading</span>
    </VProgressLinear>
  </div>
  <div v-if="!loadingGenerated">
    <VRow>
      <VCol cols="12">
        <h2 class="text-center">
          Packaging Inspection Request Form
        </h2>
      </VCol>
    </VRow>

    <VRow>
      <VCol
        class="text-center pa-2 mx-3"
        style="max-width: 150px; border: 1px solid black; font-size: 12px; font-weight: bold;"
        cols="2"
      >
        CONFIDENTIAL
      </VCol>
    </VRow>

    <!-- Header -->
    <VRow>
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
              class="text-start"
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
                <span>Raw Mat. Code</span>
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
              class="text-start"
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
              class="text-start"
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
              class="text-start"
              colspan="3"
            >
              {{ dataHeader.makerName }}
            </td>
          </tr>
          <tr>
            <th colspan="7">
              Certification of Analysis From Manufacturer
            </th>
            <td
              class="text-center"
              colspan="3"
            >
              <VRow>
                <VCol cols="6">
                  <div class="demo-space-x">
                    <VCheckbox
                      v-model="dataHeader.coAChecked"
                      label="Yes"
                      readonly
                      :checked="dataHeader.coAChecked"
                    />
                  </div>
                </VCol>
                <VCol cols="6">
                  <div class="demo-space-x">
                    <VCheckbox
                      v-model="dataHeader.coAChecked"
                      label="No"
                      :value="false"
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
                class="text-center"
              >
                No.
              </th>
              <th
                colspan="2"
                rowspan="2"
                class="text-center"
              >
                Analytical Items
              </th>
              <th
                colspan="2"
                rowspan="2"
                class="text-center"
              >
                Checking Method
              </th>
              <th
                colspan="2"
                rowspan="2"
                class="text-center"
              >
                Specification Ranges
              </th>
              <th
                colspan="1"
                class="text-center"
              >
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
              <th
                colspan="1"
                class="text-center"
              >
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
              <th
                colspan="1"
                class="text-center"
              >
                Actual Check
              </th>
              <th colspan="4">
                <VTextField
                  v-model="dataHeader.actualCheck"
                  :readonly="frozeCheck"
                  density="compact"
                  :rules="[
                    value => !!value.trim() || 'Actual Check is required.',
                  ]"
                
                  @input="(e) => handleInputNumberOnly(e)"
                >
                  <template
                    v-if="!frozeCheck"
                    #label
                  >
                    <VIcon icon="ri-edit-line" />
                  </template>
                </VTextField>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in analyticalItemsData"
              :key="index"
            >
              <td
                colspan="1"
                class="text-center"
              >
                {{ index+1 }}
              </td>
              <td colspan="2">
                {{ item.analyticalItem }}
              </td>
              <td
                class="text-center"
                colspan="2"
              >
                {{ item.method }}
              </td>
              <td
                class="text-center"
                colspan="2"
              >
                {{ item.specRange }}
              </td>
              <td colspan="1" />
              <td
                Style="min-width: 200px;"
                colspan="4"
              >
                <VTextField
                  v-model="item.actualAnalysis"
                  :readonly="frozeCheck"
                  density="compact"
                  :rules="[
                    value => !!value.trim() || 'Analytical Items is required.',
                    value => value.length <= 44 || 'Must be 45 characters or less'
                  ]"
                  :maxlength="45"
                >
                  <template
                    v-if="!frozeCheck"
                    #label
                  >
                    <VIcon icon="ri-edit-line" />
                  </template>
                </VTextField>
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
                <div>
                  <VCard @click="showDialogImageMutiNew(dataHeader.packagingImg)">
                    <VImg
                      :src="dataHeader.packagingImg"
                      alt="Image Preview"
                      style="height: 250px;"
                    />
                  </VCard>
                </div>
              </th>
            </tr>
          </thead>
        </table>
      </VCol>
    </VRow>

    <!-- Note -->
    <VRow style="font-size: 12px;">
      <!-- Note -->
      <VCol
        cols="6"
        class="text-decoration-underlined pb-2"
      >
        Note
      </VCol>
      <VCol
        cols="6"
        class="text-decoration-underlined pb-2 px-0"
      >
        Details of Limitation Condition
      </VCol>
      <VCol
        cols="12"
        class="py-0"
      >
        <table class="custom-table">
          <thead>
            <tr>
              <th colspan="6">
                <VTextarea
                  v-model="dataHeader.note"
                  :readonly="frozeCheck"
                  auto-grow
                  :rules="[
                    v => v.length <= 520 || 'Max 130 characters per line, 4 lines max.',
                  ]"
                  @input="limitTextInputLine4Note"
                >
                  <template
                    v-if="!frozeCheck"
                    #label
                  >
                    <VIcon icon="ri-edit-line" />
                  </template>
                </VTextarea>
              </th>
              <th colspan="6">
                <VTextarea
                  v-model="dataHeader.limConditionDetail"
                  :readonly="frozeCheck"
                  auto-grow
                  :rules="[
                    v => v.length <= 520 || 'Max 130 characters per line, 4 lines max.',
                  ]"
                  @input="limitTextInputLine4Details"
                >
                  <template
                    v-if="!frozeCheck"
                    #label
                  >
                    <VIcon icon="ri-edit-line" />
                  </template>
                </VTextarea>
              </th>
            </tr>
          </thead>
        </table>
      </VCol>
    </VRow>

    <!-- Quality Evalution -->
    <VRow
      v-if="false"
      class="mx-0"
    >
      <VCol cols="12">
        <VRow>
          <VCol
            class="px-0"
            style="font-size: 12px;"
            cols="12"
          >
            Quality Evaluation
          </VCol>
          <VCol
            style="border: 1px solid black;"
            cols="4"
            class="d-flex align-center"
          >
            <VRow>
              <VCol
                cols="1"
                class="d-flex align-center"
                style="font-size: 12px; font-weight: bolder;"
              >
                Accept
              </VCol>
              <VCol
                class="d-flex justify-center"
                cols="10"
              >
                <VIcon
                  v-if="statusId === 17 || statusId === 15"
                  color="success"
                  size="60"
                  icon="ri-checkbox-circle-fill"
                />
              </VCol>
            </VRow>
          </VCol>
          <VCol
            style="border: 1px solid black;"
            cols="4"
            class="d-flex align-center"
          >
            <VRow>
              <VCol
                cols="1"
                class="d-flex align-center"
                style="font-size: 12px; font-weight: bolder;"
              >
                Reject
              </VCol>
              <VCol
                class="d-flex justify-center"
                cols="11"
              >
                <VIcon
                  v-if="statusId === 7 || statusId === 16"
                  color="red"
                  size="60"
                  icon="ri-close-circle-fill"
                />
              </VCol>
            </VRow>
          </VCol>
          <VCol
            style="border: 1px solid black;"
            cols="4"
            class="d-flex align-center"
          >
            <VRow>
              <VCol
                cols="2"
                class="d-flex align-center"
              >
                <span style="font-size: 12px; font-weight: bolder;">Comment:</span>
              </VCol>
              <VCol cols="10">
                <span
                  v-if="statusId === 7 || statusId === 16"
                  style=" white-space: normal; word-wrap: break-word;"
                >
                  <VTextarea
                    v-model="dataHeader.statusComments"
                    readonly
                  />
                </span>
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </VCol>
    </VRow>

    <VRow class="pt-4 px-3">
      <!-- Accept Section -->
      <VCol
        cols="1"
        class="d-flex align-center py-0 justify-center"
        style="border-top: 1px solid black; border-bottom: 1px solid black; border-left: 1px solid black;"
      >
        <span style="font-size: 12px; font-weight: bolder;">Accept</span>
      </VCol>

      <VCol
        cols="3"
        class="d-flex align-center justify-center py-0"
        style="border-top: 1px solid black; border-bottom: 1px solid black; border-left: 1px solid black;"
      >
        <VIcon
          v-if="statusId === 17 || statusId === 15"
          color="success"
          size="60"
          icon="ri-checkbox-circle-fill"
        />
      </VCol>

      <!-- Reject Section -->
      <VCol
        cols="1"
        class="d-flex align-center justify-center py-0"
        style="border-top: 1px solid black; border-bottom: 1px solid black; border-left: 1px solid black;"
      >
        <span style="font-size: 12px; font-weight: bolder;">Reject</span>
      </VCol>

      <VCol
        cols="3"
        class="d-flex align-center justify-center py-0"
        style="border: 1px solid black;"
      >
        <VIcon
          v-if="statusId === 7 || statusId === 16"
          color="red"
          size="60"
          icon="ri-close-circle-fill"
        />
      </VCol>

      <!-- Comment Section -->
      <VCol
        cols="4"
        class="d-flex align-center py-2"
        style="border-top: 1px solid black; border-right: 1px solid black; border-bottom: 1px solid black;"
      >
        <div style="width: 100%; text-align: start;">
          <span
            style="font-size: 12px; font-weight: bolder;"
            class="text-center"
          >Comment:</span>
          <VTextarea
            v-if="statusId === 7 || statusId === 16"
            v-model="dataHeader.statusComments"
            rows="2"
            readonly
            style="white-space: normal; word-wrap: break-word;"
          />
        </div>
      </VCol>
    </VRow>
  
    <!-- COA -->
    <VRow style="font-size: 12px;">
      <VCol cols="12">
        <div class="mb-2">
          COA
        </div>
        <Table class="custom-table">
          <tr>
            <th>
              <VRow>
                <VCol cols="12">
                  <VFileInput
                    v-model="fileCoaNew"
                    :disabled="frozeCheck"
                    label="File Upload COA"
                    accept="image/png, image/jpeg, image/bmp, application/pdf"
                    placeholder="Upload your documents"
                    multiple
                    prepend-icon="mdi-paperclip"
                  />
                </VCol>
                <div v-if="errorMessageCOA">
                  {{ errorMessageCOA.message }}
                </div>
              </VRow>

              <VBtn
                v-if="false"
                @click="testCoa"
              >
                Test Coa
              </VBtn>

              <!-- fILE Image New -->
              <VRow
                v-if="fileCoaNew.length > 0"
                class="pa-2 d-flex justify-center text-center bg-green-lighten-5"
              >
                <VCol
                  v-for="(file, index) in fileCoaNew"
                  :key="index"
                  cols="12"
                  md="4"
                  lg="3"
                >
                  <VCard>
                    <VCardTitle class="d-flex justify-start">
                      <VChip
                        variant="elevated"
                        color="success"
                      >
                        New
                      </VChip>
                    </VCardTitle>
                    <VCardText>
                      <!-- ตรวจสอบว่าถ้าเป็นรูปภาพ -->
                      <template v-if="file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/bmp'">
                        <VImg
                          role="presentation"
                          :alt="file.name"
                          :src="getFileUrl(file)"
                          height="150"
                          contain
                          @click="showDialogImageMuti(getFileUrl(file), file.name)"
                        />
                      </template>

                      <!-- ตรวจสอบว่าถ้าเป็น PDF -->
                      <template v-else-if="file.type === 'application/pdf'">
                        <iframe
                          :src="getFileUrl(file)"
                          width="100%"
                          height="150"
                          style="border: none;"
                        />
                      </template>
                    </VCardText>
                    <VCardActions>
                      <VBtn
                        v-if="!frozeCheck"
                        variant="flat"
                        width="100%"
                        color="error"
                        @click="removeFileN(index)"
                      >
                        <VIcon>ri-delete-bin-5-fill</VIcon>
                      </VBtn>
                    </VCardActions>
                  </VCard>
                </VCol>
              </VRow>

              <!-- fILE Image Old -->
              <VRow class="pa-2 d-flex justify-center text-center">
                <VCol
                  v-for="(file, index) in getFormCoa"
                  :key="index"
                  cols="12"
                  md="4"
                  lg="3"
                >
                  <VCard>
                    <VCardText>
                      <!-- ตรวจสอบว่าถ้าเป็นรูปภาพ -->
                      <template v-if="file.contentType === 'image/png' || file.contentType === 'image/jpeg' || file.contentType === 'image/bmp'">
                        <VImg
                          role="presentation"
                          :alt="file.name"
                          :src="file.fileUri"
                          height="150"
                          contain
                          @click="showDialogImageMuti(file.fileUri, file.name)"
                        />
                      </template>

                      <!-- ตรวจสอบว่าถ้าเป็น PDF -->
                      <template v-else-if="file.contentType === 'application/pdf'">
                        <iframe
                          :src="'https://docs.google.com/viewer?url=' + file.fileUri + '&embedded=true'"
                          width="100%"
                          height="150"
                          style="border: none;"
                        />
                      </template>
                    </VCardText>
                    <VCardActions>
                      <VBtn
                        v-if="!frozeCheck"
                        variant="flat"
                        width="100%"
                        color="error"
                        @click="removeFileO(index, file.journalID)"
                      >
                        <VIcon>ri-delete-bin-5-fill</VIcon>
                      </VBtn>
                    </VCardActions>
                  </VCard>
                </VCol>
              </VRow>

              <div v-if="getFormCoa || fileCoaNew.length > 0">
                <VCol
                  class="d-flex justify-end"
                  cols="12"
                >
                  <VBtn
                    v-if="!frozeCheck"
                    color="red"
                    @click="removeFileAll"
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
    </VRow>

    <VRow
      v-if="false"
      class="my-6"
    >
      <VCol cols="12">
        <VRow>
          <VCol
            style="border: 1px solid black; font-size: 12px;"
            class="text-cente"
            cols="12"
          >
            Warehouse
          </VCol>
          <VCol
            style="border: 1px solid black;"
            class="text-start"
            cols="6"
          >
            <div style="font-size: 12px;">
              Staff:  {{ dataHeader.inspStaffUpdateBy }}
            </div>
            <VDivider />
            <div style="font-size: 12px;">
              <VIcon icon="ri-calendar-schedule-fill" /><span v-if="dataHeader.inspStaffUpdateDate">{{ formatDate(dataHeader.inspStaffUpdateDate) }}</span>
            </div>
          </VCol>
          <VCol
            style="border: 1px solid black;"
            class="text-start"
            cols="6"
          >
            <div style="font-size: 12px;">
              Supervisor: {{ dataHeader.whUpdateBy }}
            </div>
            <VDivider />
            <div style="font-size: 12px;">
              <VIcon icon="ri-calendar-schedule-fill" /> <span v-if="dataHeader.whUpdateDate">{{ formatDate(dataHeader.whUpdateDate) }}</span>
            </div>
          </VCol>
        </VRow>
      </VCol>
    </VRow>

    <section class="my-4">
      <VRow>
        <VCol
          cols="12"
          lg="12"
        >
          <table class="custom-table">
            <tr>
              <th
                class="text-center cursor-pointer"
                colspan="12"
              >
                Warehouse
              </th>
            </tr>
            <tr>
              <td colspan="6">
                <span>Staff: {{ dataHeader.inspStaffUpdateBy }}</span>
              </td>
              <td colspan="6">
                <span>Supervisor: {{ dataHeader.whUpdateBy }}</span>
              </td>
            </tr>
            <tr>
              <td
                style="min-width: 150px;"
                colspan="6"
              >
                <div v-if="dataHeader.inspStaffUpdateDate">
                  <VIcon icon="ri-calendar-schedule-fill" /><span v-if="dataHeader.inspStaffUpdateDate">{{ formatDate(dataHeader.inspStaffUpdateDate) }}</span>
                </div>
              </td>
              <td
                style="min-width: 150px;"
                colspan="6"
              >
                <div v-if="dataHeader.whUpdateDate">
                  <VIcon icon="ri-calendar-schedule-fill" /> <span v-if="dataHeader.whUpdateDate">{{ formatDate(dataHeader.whUpdateDate) }}</span>
                </div>
              </td>
            </tr>
          </table>
        </VCol>
      </VRow>
    </section>

    <!-- Alert Dialog Success/Fiald new -->
    <section>
      <div>
        <!-- ใช้ AuthenticatorDialog component -->
        <AuthenticatorDialog
          :is-dialog-visible="isDialogVisibleAlertDialog"
          :word="wordForSubmit"
          :success="successDialAlert"
          @update:isDialogVisible="(val) => isDialogVisibleAlertDialog.value = val"
        />
      </div>
    </section>

    <!-- Dialog Image -->
    <VDialog
      v-model="isDialogVisibleImgFileMuti"
      width="80%"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardTitle class="bg-primary">
          <div class="d-flex justify-space-between">
            COA
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
            max-width="100%"
            max-height="600px"
            contain
          />
        </VCardText>
      </VCard>
    </VDialog>

    <!-- Dialog Reject -->
    <section style="font-size: 12px;">
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
            <VTextarea v-model="commentReject">
              <template #label>
                <VIcon icon="ri-edit-line" />
              </template>
            </VTextarea>
            <span
              v-if="textAlertError.comment && !commentReject"
              class="text-red"
            >{{ textAlertError.comment }}</span>
          </VCardText>

          <VCardText class="d-flex justify-end flex-wrap gap-4">
            <VBtn
              color="error"
              @click="reject('REJECT')"
            >
              Reject
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
          :title="wordForSubmit"
        >
          <DialogCloseBtn
            variant="text"
            size="default"
            @click="isDialogVisibleStepSaveDraft = false"
          />
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

          <!-- Header -->
          <VCardText v-if="alertHeaderErrorMessage.success">
            <VAlert
              title="Verify The Accuracy Of The Header"
              variant="outlined"
              closable
              class="text-start"
            >
              <span
                v-if="alertHeaderErrorMessage.actualCheck"
                class="text-start"
                style="font-size: 12px;"
              >Actual Check :</span> <span
                style="font-size: 12px;"
                class="text-red"
              >{{ alertHeaderErrorMessage.actualCheck }} </span>
            </VAlert>
          </VCardText>

          <!-- Lot -->
          <VCardText v-if="alertLotErrorMessage.success">
            <VAlert
              title="Verify The Accuracy Of The Lot"
              variant="outlined"
              closable
              class="text-start"
            >
              <span
                class="text-start"
                style="font-size: 12px;"
              >
                Actual Check Errors:
              </span>
    
              <ul>
                <!-- วนลูปเพื่อแสดงข้อผิดพลาดแต่ละอันใน actualAnalysis -->
                <li 
                  v-for="(errorMsg, key) in alertLotErrorMessage.actualAnalysis"
                  :key="key"
                  style="font-size: 12px;"
                  class="text-red"
                >
                  <VIcon
                    color="error"
                    icon="ri-error-warning-fill"
                  />{{ key }}: {{ errorMsg }}
                </li>
              </ul>
            </VAlert>
          </VCardText>

          <!-- Coa -->
          <VCardText v-if="!textAlertError.success && textAlertError.coa">
            <VAlert
              title="Verify The Accuracy Of The COA"
              variant="outlined"
              style="font-size: 12px;"
              class="text-start"
              closable
            >
              <span class="text-red"><VIcon
                color="error"
                icon="ri-error-warning-fill"
              />{{ textAlertError.coa }}</span>
            </VAlert>
          </VCardText>
        </VCard>
      </VDialog>
    </section>

    <!-- Dialog Submit -->
    <section>
      <VDialog
        v-model="isDialogConfirmVisible"
        width="500"
      >
        <!-- Dialog Content -->
        <VCard>
          <VCardText>
            <div class="d-flex justify-center">
              <VIcon
                size="100"
                color="warning"
                icon="ri-question-line"
              />
            </div>
            <div class="text-center">
              <span style="font-size: 22px; font-weight: bolder;">Would you like to {{ wordForSubmit }}
                Transaction?</span>
            </div>
          </VCardText>

          <VCardAction class="d-flex justify-space-between pa-4">
            <VBtn
              color="error"
              @click="isDialogConfirmVisible = false"
            >
              Cancel
            </VBtn>
            <VBtn
              v-if="wordForSubmit === 'ACCEPT'"
              color="green"
              @click="handleAcceptPackaging"
            >
              {{ wordForSubmit }}
            </VBtn>
          </VCardAction>
        </VCard>
      </VDialog>
    </section>
    <!-- Dialog Submit Success -->
    <section>
      <VDialog
        v-model="isDialogSubmitSuccessVisible"
        width="500"
      >
        <!-- Dialog Content -->
        <VCard>
          <VCardText>
            <div class="d-flex justify-center">
              <VIcon
                size="100"
                color="success"
                icon="ri-checkbox-circle-line"
              />
            </div>
            <div class="text-center">
              <span style="font-size: 22px; font-weight: bolder;">{{ wordForSubmit }} Success</span>
            </div>
          </VCardText>

          <VCardAction
            v-if="false"
            class="d-flex justify-center pa-4"
          >
            <VBtn
              color="success"
              @click="submitConfirm"
            >
              Continue
            </VBtn>
          </VCardAction>
        </VCard>
      </VDialog>
    </section>
    <!-- Dialog Submit Failed -->
    <section>
      <VDialog
        v-model="isDialogSubmitFailedVisible"
        width="500"
      >
        <!-- Dialog Content -->
        <VCard>
          <VCardText>
            <div class="d-flex justify-center">
              <VIcon
                size="100"
                color="error"
                icon="ri-error-warning-line"
              />
            </div>
            <div class="text-center">
              <span style="font-size: 22px; font-weight: bolder;">{{ wordForSubmit }} Failed</span>
            </div>
          </VCardText>

          <VCardAction class="d-flex justify-center pa-4">
            <VBtn
              color="error"
              @click="submitFailed"
            >
              Continue
            </VBtn>
          </VCardAction>
        </VCard>
      </VDialog>
    </section>

    <!-- Btn -->
    <VRow v-if="statusId === 10 || statusId === 1">
      <VCol cols="4" />
      <VCol
        cols="8"
        class="d-flex justify-end"
      >
        <VBtn

          height="100%"
          width="150px"
          color="warning"
          @click="saveDraftData('SAVE DRAFT')"
        >
          Save draft
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
          height="4 0px"
          width="150px"
          @click="submitForm('ACCEPT')"
        >
          <VRow>
            <VCol
              class="py-2"
              cols="12"
            >
              Accept
            </VCol>
          </VRow>
        </VBtn>

        <VBtn
          v-if="false"
          @click="handleSaveDraftCoa"
        >
          Save Coa
        </VBtn>
      </VCol>
    </VRow>
  </div>
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
