<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { ref, watch, watchEffect } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api' //---------------------- Import Api for Url *****

//------------------------ Get Where House Name From LocalStorage and define to whereHouseSelectedItem ---------------------------
//---------------------- new rel table --------------------

const props = defineProps({
  Data: Array,
})


const switchLog = ref(false)

watchEffect(() => {
  console.log('***switchLog', switchLog.value)
  if (sessionStorage.getItem('insetOpenLogSwitch1') === 'true') {
    switchLog.value = true

    // console.log('***switchLog2', switchLog.value)
  } else if (sessionStorage.getItem('insetOpenLogSwitch1') === 'false') {
    switchLog.value = false

    // console.log('***switchLog2', switchLog.value)
  }

  // console.log('***switchLog2', switchLog.value)
})

// Define the debugMode reactive reference
const debugMode = ref(localStorage.getItem('DebuggableMode') === 'true')

// Watch for changes in debugMode and update localStorage
watch(debugMode, newValue => {
  localStorage.setItem('DebuggableMode', newValue ? 'true' : 'false')
})

// Function to manually toggle debug mode
const toggleDebugMode = () => {
  debugMode.value = !debugMode.value
}

//-------------------- Model Image --------------------
const fileMuti = ref([])
const files = ref([])
const isDialogVisibleImgFileMuti = ref(false)

const fileCoaTestPath = ref('')

watch(() => {
  // console.log('Loading image', files.value)
})

const imgDialog = ref('')
const imgNameDialog = ref('')

///--------------------- Models for api ------------------------
// const roleAccount = ref(sessionStorage.getItem('accountRole'))
const roleAccount = ref('issues')

watchEffect(() => {
  if (localStorage.getItem('userCheck') === 'supwh') {
    roleAccount.value = 'manager'
  } else if (localStorage.getItem('userCheck') === 'staff') {
    roleAccount.value = 'issues'
  }
})

const whereHouse = ref(localStorage.getItem('whereHouseName'))
const userName = ref(localStorage.getItem('userCheck'))
const accountRole = ref(sessionStorage.getItem('accountRole'))

const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')

const route = useRoute()

const data = ref(JSON.parse(route.query.Data || '[]'))

// console.log('data props in raw mat', data.value)

const itemsManufacturer = ref([])

const getManufacturer = () => {
  axiosIns.get(`${urlApi.value}/api/v1/ReceivingForm/maker`, {
    params: {
      productId: data.value.itemCode,
      supplierId: data.value.supplierId,
    },
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  },
  {})
    .then(response => {

      itemsManufacturer.value = response.data.data

      // console.log('[itemsManufacturer.value]!!: ', itemsManufacturer.value)

    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })
}

const sktName = ref('')
const rawMatCode = ref('')
const SupplierName = ref('')
const TradeName = ref('')
const Manufacturer = ref('')
const receivedDate = ref(data.value.updatedDate)

const invoiceNo = ref('')
const expectDeliveryDate = ref('')
const isForHalalProductGet = ref(null)
const isForRspoProductGet = ref(null)
const poEtlLogDetailJournalID = ref('')

const dataHeaderReceving = ref([])

const NetCountPackage = ref('')

const purchaseOrder = ref({
  poEtlLogDetailJournalID: data.value.poEtlLogDetailJournalID,
  linkedJournalID: data.value.linkedJournalID,
  journalID: data.value.journalID,
  selectedMakerName: 'N/A',
  receivedDate: '',
  invoiceNo: '',
  expectDeliveryDate: null,
  customManufacturerName: '',
  actualMeanNetCountKgs: 0,
  actualGrandAmountUnits: 0,
  actualGrandTotalQuantityKgs: 0,
  noteText: '',
  isForHalalProduct: null,
  isForRspoProduct: null,
  updatedBy: userName.value,
  coAFile: '',
  coAFileName: files.value.name,
  lotId: data.value.batch,
  packagingTypeName: '',
  storagePlaceNo: '',

  actualMakerLotNo_1: null,
  actualNetCountKgs_1: NetCountPackage.value,
  actualAmountUnits_1: null,
  actualTotalQuantityKgs_1: null,
  customManufacturerName_1: '',
  customLable_1: '',

  actualMakerLotNo_2: null,
  actualNetCountKgs_2: NetCountPackage.value,
  actualAmountUnits_2: null,
  actualTotalQuantityKgs_2: null,
  customManufacturerName_2: '',
  customLable_2: '',

  actualMakerLotNo_3: null,
  actualNetCountKgs_3: null,
  actualAmountUnits_3: null,
  actualTotalQuantityKgs_3: null,
  customManufacturerName_3: '',
  customLable_3: '',

  actualMakerLotNo_4: null,
  actualNetCountKgs_4: null,
  actualAmountUnits_4: null,
  actualTotalQuantityKgs_4: null,
  customManufacturerName_4: '',
  customLable_4: '',


  actualMakerLotNo_5: null,
  actualNetCountKgs_5: null,
  actualAmountUnits_5: null,
  actualTotalQuantityKgs_5: null,
  customManufacturerName_5: '',
  customLable_5: '',
})

const deliveryQuantity = ref({
  netCount: "",
  packagingQtyKg: "",
  amount: "",
  totalQuantity: "",
})

const testPC = () => {
  console.log("Testing", purchaseOrder)
}

const generatedReceivingForm = () => {

  axiosIns.post(`${urlApi.value}/api/v1/ReceivingForm/generate`, {}, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
    params: {
      poEtlLogDetailJournalID: data.value.poEtlLogDetailJournalID,
      updatedBy: userName.value,
    },
  },
  {})
    .then(response => {

      // itemsManufacturer.value = response.data.data

      console.log('[*****generatedReceivingForm]!!: ', response.data)

    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })
}

//------------- journalId
const responseGener = ref([])

const statusId = ref(null) // ตัวแปรสำหรับเก็บค่า statusId

const generatedJournalId = () => {
  axiosIns.get(`${urlApi.value}/api/v1/ReceivingPlan/GetByPoEtlLogDetailJournalID/${data.value.poEtlLogDetailJournalID}`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  },
  {})
    .then(response => {
      console.log('%c[generatedJournalId] raw mat!!: ', "color: green; font-weight: bold", response.data)

      // ตรวจสอบว่ามีข้อมูลใน response.data.data ก่อน
      if (response.data && response.data.data && response.data.data.length > 0) {
        responseGener.value = response.data.data // เก็บค่า response.data.data ลงใน responseGener

        const item = responseGener.value[0] // เข้าถึงข้อมูลตัวแรกใน array

        statusId.value = item.statusId // เก็บค่า statusId
      } else {
        console.error("ไม่มีข้อมูลใน responseGener")
      }
    })
    .catch(error => {
      console.error('Error:', error)
    })
}

//----------------------------------- Set configuration Status ---

const readonlyAllInput = () => {
  return statusId.value !== 3 && statusId.value !== 1 && statusId.value !== 8 && statusId.value !== 9
}

const hidedAllIconInput = () => {
  return statusId.value === 3 || statusId.value === 1
}

watch(() => {
  console.log('Gene 1')
  generatedJournalId()
  generatedReceivingForm()
})

//------------------- Generated Data --------------------------------

//----------------- Function Clear When Maker Lot '' | undifined |----------------------------------------------------------------
const resetDataRaeMatRequest = () => {
  const actualLotNos = [
    purchaseOrder.value.actualMakerLotNo_1,
    purchaseOrder.value.actualMakerLotNo_2,
    purchaseOrder.value.actualMakerLotNo_3,
    purchaseOrder.value.actualMakerLotNo_4,
    purchaseOrder.value.actualMakerLotNo_5,
  ]

  // ตรวจสอบทีละ lotNo และรีเซ็ตค่าใน dataRaeMatRequest
  actualLotNos.forEach((lotNo, index) => {
    if (lotNo === '' || lotNo === undefined || lotNo === null) {
      const noKey = `no${index + 1}`  // สร้าง key เช่น no1, no2, no3, no4, no5

      dataRaeMatRequest.value = dataRaeMatRequest.value.map(item => {
        if (item.header === 'netCount' || item.header === 'amount' || item.header === 'packing') {
          // รีเซ็ตค่าของ noX ให้เป็น 0
          item.input[0][noKey] = 0
        }

        return item
      })
    }
  })
}

// อย่าลืมเรียกใช้ฟังก์ชัน resetDataRaeMatRequest เมื่อมีการเปลี่ยนแปลง actualMakerLotNo
watch(
  () => [
    purchaseOrder.value.actualMakerLotNo_1,
    purchaseOrder.value.actualMakerLotNo_2,
    purchaseOrder.value.actualMakerLotNo_3,
    purchaseOrder.value.actualMakerLotNo_4,
    purchaseOrder.value.actualMakerLotNo_5,
  ],
  resetDataRaeMatRequest,
)

const poEtlLogDetailJournalIDQueryParameters = ref(data.value.poEtlLogDetailJournalID)

const detailsReceivingForm = () => {
  axiosIns.get(`${urlApi.value}/api/v1/ReceivingForm/details`, {
    params: {
      poEtlLogDetailJournalID: poEtlLogDetailJournalIDQueryParameters.value,
    },
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  },
  {})
    .then(response => {

      purchaseOrder.value = response.data.datas

      // console.log('[products.value]!!: ', purchaseOrder.value)

    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })
}

//------------- Header
const getHearderReceivingForm = () => {
  if (poEtlLogDetailJournalIDQueryParameters.value) {
    axiosIns.get(`${urlApi.value}/api/v1/ReceivingForm/get/${poEtlLogDetailJournalIDQueryParameters.value}`, {
      headers: {
        'accept': '*/*',
        'x-location': `${whereHouse.value}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
    },
    {})
      .then(response => {

        const data = response.data.data

        dataHeaderReceving.value = data[0]

        // sktName.value = data[0].Lable
        // rawMatCode.value = data[0].Lable
        // SupplierName.value = data[0].Lable
        // TradeName.value = data[0].Lable
        // Manufacturer.value = data[0].Lable
        purchaseOrder.value.journalID = data[0].journalID

        UserNameAccoutWork.value = data[0].updatedBy
        supplier.value = data[0].approveBy

        purchaseOrder.value.receivedDate = formatDate(data[0].receivedDate)
        purchaseOrder.value.expectDeliveryDate = formatDate(data[0].expectDeliveryDate)
        purchaseOrder.value.invoiceNo = data[0].invoiceNo

        purchaseOrder.value.isForHalalProduct = data[0].isForHalalProduct
        purchaseOrder.value.isForRspoProduct = data[0].isForRspoProduct
        purchaseOrder.value.noteText = data[0].noteText

        purchaseOrder.value.selectedMakerName = data[0].selectedMakerName
        Manufacturer.value = data[0].selectedMakerName
        purchaseOrder.value.packagingTypeName = data[0].packagingTypeName

        poEtlLogDetailJournalID.value = data[0].poEtlLogDetailJournalID
        purchaseOrder.value.storagePlaceNo = data[0].storagePlaceNo

        purchaseOrder.value.receivedDate = data[0].receivedDate

        //------------------------- DeliveryQueue ------------------------
        deliveryQuantity.value.netCount = data[0].actualMeanNetCountKgs
        deliveryQuantity.value.packagingQtyKg = data[0].packagingQtyKg

        // purchaseOrder.value = response.data[0]
        console.log('[*****Headers]]!!: ', data[0])

        console.log("dataHeaderReceving.packagingQtyKg!!***", dataHeaderReceving.value.packagingQtyKg)

      })
      .catch(error => {
        // Handle errors
        console.error('Error:', error)
      })
  } else {
    console.log('**poEtlLogDetailJournalIDQueryParameters = ', poEtlLogDetailJournalIDQueryParameters.value)
  }

}

//--------------- Lot
// eslint-disable-next-line sonarjs/cognitive-complexity
const getLotReceivingForm = () => {
  if (poEtlLogDetailJournalIDQueryParameters.value) {
    axiosIns.get(`${urlApi.value}/api/v1/ReceivingForm/get-lot/${poEtlLogDetailJournalIDQueryParameters.value}`, {
      headers: {
        'accept': '*/*',
        'x-location': `${whereHouse.value}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
    })
      .then(response => {
        const lotData = response.data.data

        // แมพข้อมูลจาก API ลงใน purchaseOrder
        lotData.forEach((lot, index) => {
          const lotNumber = index + 1 // เริ่มจาก 1, 2, 3, ...

          // เก็บข้อมูลแต่ละ lot ใน purchaseOrder
          purchaseOrder.value[`actualMakerLotNo_${lotNumber}`] = lot.actualMakerLotNo
          purchaseOrder.value[`actualNetCountKgs_${lotNumber}`] = lot.actualNetCountKgs
          purchaseOrder.value[`actualAmountUnits_${lotNumber}`] = lot.actualAmountUnits
          purchaseOrder.value[`actualTotalQuantityKgs_${lotNumber}`] = lot.actualTotalQuantityKgs
          purchaseOrder.value[`customManufacturerName_${lotNumber}`] = lot.customManufacturerName
          purchaseOrder.value[`customLable_${lotNumber}`] = lot.customLable
        })

        NetCountPackage.value = lotData[0].actualNetCountKgs

        purchaseOrder.value.actualNetCountKgs_1 = NetCountPackage.value

        console.log('[*****Headers Lot]]!!:', lotData[0])

      })
      .catch(error => {
        // Handle errors
        console.error('Error:', error)
      })
  }
}

import { useGetCOAFormController, 
  useDeleteCoaFormController, 
  useDeleteAllCoaFormController, 
  useSaveCOAFormController } from '@/controllers/skt/receivingFrom/rawMat/controller'

const coaFiles = ref([])

//--------------- COA

const { getCoaForm, errorMessageGetCoa, fetchCoaForm } = useGetCOAFormController()

fetchCoaForm(poEtlLogDetailJournalIDQueryParameters.value, urlApi.value, 'ReceivingForm', whereHouse.value, accessTokenAtStore)

let startTime

//----------------- Progression
const loading = ref(false)
const modelValue = ref(0) // Progress value
const bufferValue = ref(100) // Buffer value for the progress
const progressPercentage = ref('0%') // Percentage text
const interval = ref()

const maxFileSizeMB = 2 // Set max file size to 1 MB

const rules = [
  fileList => {
    if (!fileList || !fileList.length) return true // Allow empty input
    // Check if all files are within the size limit
    for (const file of fileList) {
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        fileMuti.value = null
        files.value = null

        return `File size should be less than ${maxFileSizeMB} MB!`
      }
    }

    return true
  },
]

watchEffect(() => {
  console.log('fileMuti++', fileMuti.value)
  console.log('files+++', files.value)

  
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


watch(() => {
  console.log('Gene 2')
  getManufacturer()
  getLotReceivingForm()
  getHearderReceivingForm()
  getCOAReceivingForm()
})

watchEffect(() => {
  console.log('selectedMakerName', purchaseOrder.value.selectedMakerName.makerName, "+", dataHeaderReceving.value.customManufacturerName)
})

const saveReceivingForm = () => {
  console.log('Submit buttonVisible Start In')
  axiosIns.post(`${urlApi.value}/api/v1/ReceivingForm/save`, purchaseOrder.value, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  },
  {})
    .then(response => {
      console.log('[products.value]!!: ', response.data)
      isDialogSubmitSuccessVisible.value = true
      isDialogConfirmVisible.value = false

    })
    .catch(error => {
      // Handle errors
      isDialogSubmitFailedVisible.value = true
      console.error('Error:', error)
    })
}

//--------------- save header --------------------------------
const textAlertError = ref({
  mgs: '',
  success: false,

  note: '',
  coa: '',
})

const validateHeader = () => {
  textAlertError.value.success = true
  console.log("Start validateHeader!!++1")

  let value = 'NaN'

  if(purchaseOrder.value.actualMeanNetCountKgs  === value ){
    textAlertError.value.mgs += 'Net Count Kgs failed.'
    textAlertError.value.success = false
  }

  if(purchaseOrder.value.actualGrandAmountUnits === value){
    textAlertError.value.mgs += 'Total Amount Units failed.'
    textAlertError.value.success = false
  }

  if(purchaseOrder.value.actualGrandTotalQuantityKgs === value){
    textAlertError.value.mgs += 'Total Quantity Kgs failed.'
    textAlertError.value.success = false
  }

  return textAlertError.value.success
}

const saveHeaderReceivingForm = async () => {
  const body = {
    poEtlLogDetailJournalID: purchaseOrder.value.poEtlLogDetailJournalID,
    linkedJournalID: purchaseOrder.value.linkedJournalID,
    selectedMakerName: purchaseOrder.value.selectedMakerName.makerName || purchaseOrder.value.selectedMakerName,
    receivedDate: formatDate(purchaseOrder.value.receivedDate) || formatDate(receivedDate.value),
    invoiceNo: purchaseOrder.value.invoiceNo,
    expectDeliveryDate: purchaseOrder.value.expectDeliveryDate,
    customManufacturerName: purchaseOrder.value.customManufacturerName,
    
    actualMeanNetCountKgs: purchaseOrder.value.actualMeanNetCountKgs,
    actualGrandAmountUnits: purchaseOrder.value.actualGrandAmountUnits,
    actualGrandTotalQuantityKgs: purchaseOrder.value.actualGrandTotalQuantityKgs,

    noteText: purchaseOrder.value.noteText,
    isForHalalProduct: purchaseOrder.value.isForHalalProduct,
    isForRspoProduct: purchaseOrder.value.isForRspoProduct,
    updatedBy: purchaseOrder.value.updatedBy,
  }

  const validatedHeader = ref(validateHeader())

  if(!validatedHeader.value){
    throw 'Save header Failed'+textAlertError.value.msg
  }

  if(!purchaseOrder.value.noteText){
    textAlertError.value.success = false
    textAlertError.value.note = "Request Note"
    throw 'Save header Failed. request note.'
  }

  try {
    const response = await axiosIns.post(`${urlApi.value}/api/v1/ReceivingForm/save/${data.value.poEtlLogDetailJournalID}`, body, {
      headers: {
        'accept': '*/*',
        'x-location': `${whereHouse.value}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
    })

    console.log('[saveHeaderReceivingForm] success:', response.data)

    return response.data  // คืนค่า response กลับไป
  } catch (error) {
    console.error('Error [saveHeaderReceivingForm]:', error)
    throw error  // โยนข้อผิดพลาดให้ฟังก์ชันที่เรียกใช้จัดการ
  }
}

//--------------- save Lot --------------------------------

const alertErrorLot = ref({

  alertMakerLot1: {
    index: 1,
    msg: '',
    success: false,
  },

  alertAmountLot1: {
    index: 1,
    msg: '',
    success: false,
  },

  alertMakerLot2: {
    index: 2,
    msg: '',
    success: false,
  },
  alertAmountLot2: {
    index: 2,
    msg: '',
    success: false,
  },

  alertMakerLot3: {
    index: 3,
    msg: '',
    success: false,
  },
  alertAmountLot3: {
    index: 3,
    msg: '',
    success: false,
  },

  alertMakerLot4: {
    index: 4,
    msg: '',
    success: false,
  },
  alertAmountLot4: {
    index: 4,
    msg: '',
    success: false,
  },

  alertMakerLot5: {
    index: 5,
    msg: '',
    success: false,
  },
  alertAmountLot5: {
    index: 5,
    msg: '',
    success: false,
  },
})

const alertErrorAmount = ref({

  alertAmountLot1: {
    index: 1,
    msg: '',
    success: false,
  },

  alertAmountLot2: {
    index: 2,
    msg: '',
    success: false,
  },

  alertAmountLot3: {
    index: 3,
    msg: '',
    success: false,
  },

  alertAmountLot4: {
    index: 4,
    msg: '',
    success: false,
  },

  alertAmountLot5: {
    index: 5,
    msg: '',
    success: false,
  },
})

const validateLotNoInput = (actualAmountUnits, actualMakerLotNo, index) => {
  if(!actualMakerLotNo && actualAmountUnits){
    return `Lot No.${index} is required.`
  }else{
    
    return ''
  }
}

const validateAmountInput = (actualAmountUnits, actualMakerLotNo, index) => {
  if(actualMakerLotNo && !actualAmountUnits){
    return `Amount(Unit)${index} is required.`
  }else{
    return ''
  }
}

const validateMissing = l => {
  if(l === 1 && !purchaseOrder.value[`actualMakerLotNo_${l}`]){
    return 0
  }
  if(!purchaseOrder.value[`actualMakerLotNo_${l}`]){

    for (let i = l+1; i <= 5; i++) {

      if(purchaseOrder.value[`actualMakerLotNo_${i}`] || purchaseOrder.value[`actualAmountUnits_${i}`]){
        return 0
      }
    }

    if(purchaseOrder.value[`actualAmountUnits_${l}`]){
      return 0
    }
    
    return -1
  }

  return 1
}

// ฟังก์ชันสำหรับตรวจสอบเงื่อนไข Lot No.
const validateLotNo = (i, actualMakerLotNo, actualAmount) => {

  const validate = ref(validateMissing(i))

  console.log("validate++++3", validate.value)

  if(validate.value === 0){
    alertErrorLot.value[`alertMakerLot${i}`].msg = `- Maker Lot - missing.`
    alertErrorLot.value[`alertMakerLot${i}`].success = false

    return true  // มีข้อผิดพลาด
  }

  // if(!actualMakerLotNo && !purchaseOrder.value[`actualMakerLotNo_${i+1}`] ){
  //   alertErrorLot.value[`alertMakerLot${i}`].msg = The Lot No.${i} field missing.
  //   alertErrorLot.value[`alertMakerLot${i}`].success = false

  //   return true  // มีข้อผิดพลาด
  // }



  if (validate.value === 0 && actualAmount) {
    alertErrorLot.value[`alertMakerLot${i}`].msg = `- Maker Lot - Field cannot be left blank. Please enter the required information without leaving any spaces.`
    alertErrorLot.value[`alertMakerLot${i}`].success = false

    return true  // มีข้อผิดพลาด
  } else {
    alertErrorLot.value[`alertMakerLot${i}`].msg = `- Maker Lot -  Successed.`
    alertErrorLot.value[`alertMakerLot${i}`].success = true

    return false
  }
}

// ฟังก์ชันสำหรับตรวจสอบเงื่อนไข Amount(Unit)
const validateAmount = (i, actualMakerLotNo, actualAmount) => {
  // เริ่มต้นข้อความแสดงข้อผิดพลาด

  const validate = ref(validateMissing(i))
  let errorMessage = ''

  if(validate.value === 0 || validate.value === 1){
    
    // ตรวจสอบเงื่อนไขแรก
    if (!actualAmount) {
      errorMessage +=
      `- Amount(Unit) - field blank`
    }

    // ตรวจสอบเงื่อนไขที่สอง
    else if (actualAmount < 1 && actualAmount !== null) {
      errorMessage +=
      `- Amount(Unit) - more than 1. `
    }
  }

  // cnosole.log("errorMessage+++", errorMessage)

  // ถ้ามีข้อความข้อผิดพลาด
  if (errorMessage) {
    alertErrorLot.value[`alertAmountLot${i}`].msg = errorMessage.trim() // ลบช่องว่างที่ไม่จำเป็น
    alertErrorLot.value[`alertAmountLot${i}`].success = false
    
    return true  // มีข้อผิดพลาด
  } else {
    alertErrorLot.value[`alertAmountLot${i}`].msg  = `- Amount(Unit) - Successed.` // ไม่มีข้อผิดพลาด
    alertErrorLot.value[`alertAmountLot${i}`].success = true
    
    return false // ไม่มีข้อผิดพลาด
  }
}

const saveLotReceivingForm = async () => {
  const body = []
  let hasError = false

  // ตรวจสอบว่า actualMakerLotNo มีค่า (ไม่เป็นค่าว่างหรือ undefined)
  for (let i = 1; i <= 5; i++) {
    const actualMakerLotNo = purchaseOrder.value[`actualMakerLotNo_${i}`]
    const actualAmount = purchaseOrder.value[`actualAmountUnits_${i}`]

    // ตรวจสอบข้อผิดพลาด
    const lotNoError = validateLotNo(i, actualMakerLotNo, actualAmount)
    const amountError = validateAmount(i, actualMakerLotNo, actualAmount)

    // ถ้ามีข้อผิดพลาดจะตั้งค่า hasError = true
    if (lotNoError || amountError) {
      hasError = true
    }

    // ถ้าไม่มีข้อผิดพลาด และ actualMakerLotNo มีค่า
    if (actualMakerLotNo && actualMakerLotNo.trim()) {
      const lot = {
        actualMakerLotNo: actualMakerLotNo,
        actualNetCountKgs: purchaseOrder.value[`actualNetCountKgs_${i}`] || '',
        actualAmountUnits: purchaseOrder.value[`actualAmountUnits_${i}`] || '',
        actualTotalQuantityKgs: purchaseOrder.value[`actualTotalQuantityKgs_${i}`] || '',
        customManufacturerName: purchaseOrder.value[`customManufacturerName_${i}`] || '',
        customLable: purchaseOrder.value[`customLable_${i}`] || '',
      }

      // เพิ่ม lot ลงใน body เฉพาะเมื่อ actualMakerLotNo มีค่า
      body.push(lot)
    }
  }

  // ถ้ามีข้อผิดพลาด ให้หยุดการทำงาน
  if (hasError) {
    throw "Error: Some actualMakerLotNo fields are empty while their respective amounts are not."
  }

  // ถ้าไม่มีข้อผิดพลาด ส่งข้อมูลไปยัง API
  try {
    const response = await axiosIns.post(`${urlApi.value}/api/v1/ReceivingForm/save-lot-details/${data.value.poEtlLogDetailJournalID}`, body, {
      headers: {
        'accept': '*/*',
        'x-location': `${whereHouse.value}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
    })

    console.log('[saveLotReceivingForm] success:', body)

    return response.data
  } catch (error) {
    console.error('Error [saveLotReceivingForm]:', error)
    throw error
  }
}

// -------------------------- Save COA ---------------------------
const fileCoaNew = ref([])
const coaIdForDelete = ref([])
const fileUrls = ref({}) // เก็บ URLs ที่ถูกสร้างขึ้น

// ฟังก์ชันสำหรับสร้าง URL ของไฟล์
const getFileUrl = file => {
  if (!fileUrls.value[file.name]) {
    fileUrls.value[file.name] = URL.createObjectURL(file)
  }
  
  return fileUrls.value[file.name]
}

const testCoaNew = () => {
  console.log('Test Coa', fileCoaNew.value)
}

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
}

const removeFileO = (index, id) => {
  const file = getCoaForm.value[index]
  if (fileUrls.value[file.name]) {
    URL.revokeObjectURL(fileUrls.value[file.name]) // ปล่อย URL
    delete fileUrls.value[file.name] // ลบ URL จาก object
  }

  // เพิ่ม journalID เข้าไปใน coaIdForDelete
  coaIdForDelete.value.push(id)

  getCoaForm.value.splice(index, 1) // ลบไฟล์จาก array

}

const deleteAllStart = ref(false)

const removeFileAll = () => {
  getCoaForm.value = []
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

// eslint-disable-next-line sonarjs/cognitive-complexity
const handleSaveDraftCoa = async () => {

  const result = ref(1)

  if (!fileCoaNew.value.length > 0 && !getCoaForm.value.length > 0) {
    // alert('Please upload at least one file')
    result.value -=1
    textAlertError.value.success = false
    textAlertError.value.coa = 'Failed to save coa. Plase Upload COA ones.'
    throw 'Failed To Save COA. Plase Upload COA Ones.'
  }
  if(deleteAllStart.value === true){
    console.log("Delete All Start++++")
    await deleteAllCoaForm(poEtlLogDetailJournalIDQueryParameters.value, urlApi.value, 'ReceivingForm', whereHouse.value, accessTokenAtStore)
    if (resultDeleteAllCoa.value.success) {
      console.log('Delete all coa  successful', resultDeleteAllCoa.value.success)
      result.value += 1
      
      
    } else {
      result.value -=1
      console.error('Failed to delete all coa')
      throw 'Failed to save coa'
    }
  }
  if(fileCoaNew.value.length > 0){
    console.log("Upload Start++++")
    await handleSaveDraftCoaForm(fileCoaNew.value, poEtlLogDetailJournalIDQueryParameters.value, urlApi.value, 'ReceivingForm', whereHouse.value, accessTokenAtStore)
    if (saveCoaForm) {
      console.log('Save coa  successful', saveCoaForm.value.success)
      result.value += 1
      
      // return saveCoaForm
    } else {
      result.value -=1
      console.error('Failed to save coa')
      throw 'Failed to save coa'
    }
  }
  if(coaIdForDelete.value.length > 0){
    console.log("delete by id Start++++")
    await deleteCoaForm(coaIdForDelete.value, poEtlLogDetailJournalIDQueryParameters.value, urlApi.value, 'ReceivingForm', whereHouse.value, accessTokenAtStore)
    if (resultDeleteByIdCoa.value.success === true) {
      console.log('Delete coa by id successful', resultDeleteByIdCoa.value.success)
      result.value += 1
      
      // return resultDeleteByIdCoa
    } else {
      result.value -=1
      console.error('Failed to save coa')
      throw 'Failed to delete coa by id'
    }
  }
  if(getCoaForm.value.length > 0){
    result.value += 1
  }
  if(result.value <= 0) {
    throw 'Failed to handleSaveDraftCoa'
  }
  console.log("Result COA", result.value)
  
  return result
}

// ฟังก์ชันเพื่อแปลง Base64 กลับเป็นไฟล์
const base64ToFile = (base64String, filename) => {
  let arr = base64String.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
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

const deleteAllCIA = () => {
  coaFiles.value = []
  files.value = []
}


const wordForSubmit = ref('Word')

//------------- Dialog Step SaveDraf ----------------------------------------------------------------
const iconsSteps = [
  {
    title: 'Save Darft Header',
    icon: 'ri-mac-line',
  },
  {
    title: 'Save Darft Lot',
    icon: 'ri-mac-line',
  },
  {
    title: 'Save Darft COA',
    icon: 'ri-mac-line',
  },
]

const isDialogVisibleStepSaveDraft = ref(false)

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

// ri-check-line

const countErr = ref(0)

const submitButtonVisibleNew = async word => {
  wordForSubmit.value = word
  isDialogVisibleStepSaveDraft.value = true

  try { // Start Step 1
    // Start Step 1
    loadindingSaveDatft1.value = true

    // Step 1: saveLotReceivingForm

    await saveHeaderReceivingForm()
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

  try { // Start Step 2
    // Start Step 2
    loadindingSaveDatft2.value = true

    // Step 2: saveHeaderReceivingForm
    // console.error('Error: actualMakerLotNo_1 is empty or undefined. out')
    await saveLotReceivingForm()
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
    wordForSubmit.value = "SAVE COA"

    loadindingSaveDatftFailed2.value = false
    loadindingSaveDatftSeccess2.value = false

    loadindingSaveDatft2.value = false

    // wordForSubmit.value = '2'
    isDialogConfirmVisible.value = false
    isDialogSubmitFailedVisible.value = false

    return // หยุดการทำงานหากฟังก์ชันนี้ล้มเหลว
  }

  try { // Start Step 3
    // Start Step 3
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

    loadindingSaveDatftFailed3.value = false
    loadindingSaveDatftSeccess3.value = false

    loadindingSaveDatft3.value = false

    isDialogSubmitFailedVisible.value = false
    isDialogConfirmVisible.value = false

    return // หยุดการทำงานหากฟังก์ชันนี้ล้มเหลว
  }

  // ปิด dialog เมื่อสำเร็จทุกขั้นตอน
  // isDialogVisibleStepSaveDraft.value = false

  location.reload()

  // isDialogSubmitSuccessVisible.value = true
  isDialogConfirmVisible.value = false

  return true
}

const submitReceivingForm = async () => {
  try {
    // เรียก submitButtonVisibleNew() และรอให้ทำงานเสร็จ
    const isSuccess = await submitButtonVisibleNew()

    // ถ้า submitButtonVisibleNew() ไม่สำเร็จ (สมมติว่ามันคืนค่า false เมื่อไม่สำเร็จ)
    if (!isSuccess) {
      console.log('submitButtonVisibleNew failed, stopping submission.')

      return // หยุดการทำงาน
    }

    isDialogConfirmVisible.value = false
    console.log('Submit buttonVisible Start In')

    axiosIns.post(`${urlApi.value}/api/v1/ReceivingForm/Submit/${data.value.poEtlLogDetailJournalID}`, {}, {
      headers: {
        'accept': '*/*',
        'x-location': `${whereHouse.value}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
    })
      .then(response => {
        console.log('[products.value]!!: ', response.data)
        location.reload()
        isDialogSubmitSuccessVisible.value = true
        isDialogConfirmVisible.value = false
      })
      .catch(error => {
        // Handle errors
        console.error('Error:', error)
        isDialogSubmitFailedVisible.value = true
      })
  } catch (error) {
    // จับ error จากการทำงานของ submitButtonVisibleNew() หรือโค้ดอื่นๆ
    console.error('Error in submitButtonVisibleNew:', error)
    isDialogSubmitFailedVisible.value = true
  }
}

const submitButtonVisible = word => {
  wordForSubmit.value = word

  saveLotReceivingForm()
  saveHeaderReceivingForm()
  saveCOARecevingFrom()

  // ปิด dialog เมื่อสำเร็จทุกขั้นตอน
  isDialogVisibleStepSaveDraft.value = false
  isDialogSubmitSuccessVisible.value = true
  isDialogConfirmVisible.value = false
}

watchEffect(() => {
  console.log("formData", formData)
  console.log("coaFiles.value", coaFiles.value)
  console.log("files.value", files.value)
})

//---------------------------------- MOck Data Table --------------------------------
const makerLotNo1 = ref('')
const makerLotNo2 = ref('')
const makerLotNo3 = ref('')
const makerLotNo4 = ref('')
const makerLotNo5 = ref('')

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

const UserNameAccoutWork = ref('')
const dateStaff = ref(formatDate(new Date()))
const supplier = ref('')
const dateSupplier = ref(formatDate(new Date()))

const convertToInt = value => {
  return Number(value) // หรือ parseInt(value) ถ้าต้องการแปลงจากสตริงเป็นจำนวนเต็ม
}

const dataRaeMatRequest = ref([
  {
    header: 'makerLotNo',
    input: [{ no1: purchaseOrder.value.actualMakerLotNo_1, no2: purchaseOrder.value.actualMakerLotNo_2, no3: purchaseOrder.value.actualMakerLotNo_3, no4: purchaseOrder.value.actualMakerLotNo_4, no5: purchaseOrder.value.actualMakerLotNo_5 }],
  },
  {
    header: 'netCount',
    input: [{ no1: purchaseOrder.value.actualNetCountKgs_1, no2: purchaseOrder.value.actualNetCountKgs_2, no3: purchaseOrder.value.actualNetCountKgs_3, no4: purchaseOrder.value.actualNetCountKgs_4, no5: purchaseOrder.value.actualNetCountKgs_5, total: 0 }],
  },
  {
    header: 'amount',
    input: [{ no1: 0, no2: 0, no3: 0, no4: 0, no5: 0, total: 0 }],
  },
  {
    header: 'packing',
    input: [{ no1: purchaseOrder.value.actualTotalQuantityKgs_1, no2: purchaseOrder.value.actualTotalQuantityKgs_2, no3: purchaseOrder.value.actualTotalQuantityKgs_3, no4: purchaseOrder.value.actualTotalQuantityKgs_4, no5: purchaseOrder.value.actualTotalQuantityKgs_5, total: purchaseOrder.value.actualTotalQuantityKgs_5 }],
  },
])

// eslint-disable-next-line sonarjs/cognitive-complexity
watchEffect(() => {
  const updateNetCountKgs = (index, lotNo, netCountField) => {
    if (lotNo) {
      if (data.value.receiveTypeId === 2) {
        purchaseOrder.value[netCountField] = dataHeaderReceving.value.packagingQtyKg
      } else if (data.value.receiveTypeId === 3 && dataHeaderReceving.value.packagingQtyKg === 0) {
        purchaseOrder.value[netCountField] = data.value.purchasingAmountKgs
      }
    } else {
      purchaseOrder.value[netCountField] = null
    }
  }

  // ใช้ลูปในการจัดการ lotNo 1 ถึง 5
  for (let i = 1; i <= 5; i++) {
    const lotNo = purchaseOrder.value[`actualMakerLotNo_${i}`]
    const netCountField = `actualNetCountKgs_${i}`

    updateNetCountKgs(i, lotNo, netCountField)
  }
  

  // ---------------------- Amount ---------------------  
  for (let i = 1; i <= 5; i++) {
    const amountUnits = purchaseOrder.value[`actualAmountUnits_${i}`]
    const makerLotNo = purchaseOrder.value[`actualMakerLotNo_${i}`]

    if (makerLotNo === "") {
      purchaseOrder.value[`actualAmountUnits_${i}`] = ""
    }

    // } else if (amountUnits === "") {
    //   purchaseOrder.value[`actualMakerLotNo_${i}`] = null
    // }
  }

  // ---------------------- reset grand net count  ---------------------
  if(purchaseOrder.value.actualMeanNetCountKgs === 'NaN'){
    purchaseOrder.value.actualMeanNetCountKgs = 0
  }
})

// ฟังก์ชันสำหรับคำนวณค่า total

// eslint-disable-next-line sonarjs/cognitive-complexity
const calculationPONew = () => {
  if (purchaseOrder.value) {

    const covertFloatFixedTwo = number => {
      if (number === '' || number === undefined) {
        return 0
      }

      return parseFloat(number).toFixed(2)
    }

    function covertToInteger(value) {
      return value ? parseInt(value, 10) || 0 : 0
    }

    //------------------- Total Amount
    const totalAmount = (covertToInteger(purchaseOrder.value.actualAmountUnits_1) +
      covertToInteger(purchaseOrder.value.actualAmountUnits_2) +
      covertToInteger(purchaseOrder.value.actualAmountUnits_3) +
      covertToInteger(purchaseOrder.value.actualAmountUnits_4) +
      covertToInteger(purchaseOrder.value.actualAmountUnits_5)
    )


    //------------------- Total Qty By Columns ----------------
    const totlaQty_1 = (purchaseOrder.value.actualNetCountKgs_1) * (purchaseOrder.value.actualAmountUnits_1) || 0.00
    const totlaQty_2 = (purchaseOrder.value.actualNetCountKgs_2) * (purchaseOrder.value.actualAmountUnits_2) || 0.00
    const totlaQty_3 = (purchaseOrder.value.actualNetCountKgs_3) * (purchaseOrder.value.actualAmountUnits_3) || 0.00
    const totlaQty_4 = (purchaseOrder.value.actualNetCountKgs_4) * (purchaseOrder.value.actualAmountUnits_4) || 0.00
    const totlaQty_5 = (purchaseOrder.value.actualNetCountKgs_5) * (purchaseOrder.value.actualAmountUnits_5) || 0.00

    purchaseOrder.value.actualTotalQuantityKgs_1 = parseFloat(totlaQty_1).toFixed(2)
    purchaseOrder.value.actualTotalQuantityKgs_2 = parseFloat(totlaQty_2).toFixed(2)
    purchaseOrder.value.actualTotalQuantityKgs_3 = parseFloat(totlaQty_3).toFixed(2)
    purchaseOrder.value.actualTotalQuantityKgs_4 = parseFloat(totlaQty_4).toFixed(2)
    purchaseOrder.value.actualTotalQuantityKgs_5 = parseFloat(totlaQty_5).toFixed(2)

    //---------------------- Total all
    purchaseOrder.value.actualMeanNetCountKgs = covertFloatFixedTwo(purchaseOrder.value.actualNetCountKgs_1) || 0
    purchaseOrder.value.actualGrandAmountUnits = covertToInteger(totalAmount) || 0.00
    purchaseOrder.value.actualGrandTotalQuantityKgs = covertFloatFixedTwo(totlaQty_1 + totlaQty_2 + totlaQty_3 + totlaQty_4 + totlaQty_5) || 0.00
  }
}

function formatNumberWithCommas(value) {
  const parts = value.split('.')

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return parts.join('.')
}

const formatNumber = value => {
  if (value !== null && value !== undefined) {
    return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return '0.00'
}

const formatNumberToLocal = value => {
  if (value !== null && value !== undefined) {
    return parseFloat(value).toLocaleString(undefined)
  }

  return '0'
}

const handleInputNetCount = (e, actualNetCountKgs) => {
  let value = e.target.value

  // จำกัดจำนวนหลักรวมไม่เกิน 8 หลัก
  if (value.replace('.', '').length > 8) {
    value = value.slice(0, 11) // ตัดค่าที่เกินออก
  }

  // ตรวจสอบว่าเป็นตัวเลขที่มีทศนิยม 2 ตำแหน่ง
  if (value && value.includes('.')) {
    const [intPart, decimalPart] = value.split('.')
    if (decimalPart.length > 2) {
      purchaseOrder.value[actualNetCountKgs] = `${intPart}.${decimalPart.substring(0, 2)}`
    } else {
      purchaseOrder.value[actualNetCountKgs] = value
    }
  } else {
    purchaseOrder.value[actualNetCountKgs] = value
  }
}

const handleInputAmount = (e, AmountUnits) => {
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

  // อัปเดตค่าใน purchaseOrder
  purchaseOrder.value[AmountUnits] = value
}

// watchEffect จะเรียกใช้ calculateTotals ทุกครั้งที่ข้อมูลใน dataRaeMatRequest เปลี่ยนแปลง
watchEffect(() => {
  calculationPONew()
})

const showDialogImageMuti = (img, name) => {

  // ตรวจสอบว่าข้อมูล img มี "data:image/png;base64," นำหน้าหรือไม่
  // if (!img.startsWith('data:image')) {
  //   // ถ้าไม่มี ให้เพิ่ม "data:image/png;base64," นำหน้า
  //   img = `data:image/png;base64,${img}`
  // }

  isDialogVisibleImgFileMuti.value = true
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

const seeTruck = () => {
  console.log('data truck', resaleProductShipping.value)
}

const seeTruckO = () => {
  console.log('data truck', files.value)
}

const removeFilesInTruck = index => {
  resaleProductShipping.value[index].files = []
}

//------------------------ Dialog --------------------------------
//--------------------------- Dialog Submit -------------------------------
const isDialogConfirmVisible = ref(false)
const isDialogSubmitSuccessVisible = ref(false)
const isDialogTextAreaVisible = ref(false)
const isDialogSubmitFailedVisible = ref(false)


const submitButton = word => {
  isDialogConfirmVisible.value = true
  wordForSubmit.value = word
}

const areaTextRemarkButton = word => {
  isDialogTextAreaVisible.value = true
  wordForSubmit.value = word
}

const completeSubmit = () => {
  isDialogSubmitSuccessVisible.value = false
  isDialogConfirmVisible.value = false
}

const submitConfirm = () => {
  isDialogSubmitSuccessVisible.value = false
  sessionStorage.setItem('currentTableWatchSesstion', 1)

  // รีเฟรชหน้าจอ
  location.reload()
}

const submitFailed = () => {
  isDialogSubmitFailedVisible.value = false

  // รีเฟรชหน้าจอ
  location.reload()
}

//--------------------------- Status Check --------------------------
const tabDisablingConfig = {
  1: {
    manager: true,
    issues: true,
  },
  3: {
    manager: ['Raw Material Inspection Request Form', 'Lorry Loading Check List'],
    issues: ['Raw Material Inspection Request Form', 'Lorry Loading Check List'],
  },
  4: {
    manager: false,
    issues: false,
  },
  5: {
    manager: false,
    issues: false,
  },
  6: {
    manager: false,
    issues: false,
  },
  7: {
    manager: false,
    issues: false,
  },
  8: {
    manager: true,
    issues: true,
  },

  // Add more statuses and role combinations as needed
}

const getDisabledFollowStatusNRole = () => {
  const status = data.value.statusId
  const role = roleAccount.value

  // console.log('Status Raw:', status)
  // console.log('Role Raw:', role)
  // console.log('Disabled Tabs Raw:', tabDisablingConfig[status]?.[role])

  return tabDisablingConfig[status]?.[role] || false
}
</script>

<template>
  <section
    v-if="debugMode === true"
    class="mt-10"
  >
    {{ purchaseOrder }}

    Net Total : {{ }}
    data : {{ }}
  </section>

  <VRow>
    <VCol cols="12">
      <div
        style="font-size: 22px; font-weight: bolder;"
        class="d-flex justify-center align-center mt-4"
      >
        Raw Material Receiving Form
      </div>
    </VCol>

    <VCol
      class="text-center mx-4"
      style="border: 1px solid black; font-size: 12px; font-weight: bold;"
      cols="2"
    >
      CONFIDENTIAL
    </VCol>

    <VCol
      cols="12"
      style="overflow-x: auto;"
    >
      <table class="custom-table">
        <tr>
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
            {{ dataHeaderReceving.productName }}
          </td>
          <th
            rowspan="1"
            colspan="2"
            class=""
          >
            <div class="text-center">
              <span style="font-size: 12px;">Raw Mat. Code</span>
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
            {{ dataHeaderReceving.supplierName }}
          </td>
        </tr>
        <tr>
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
            {{ dataHeaderReceving.tradeName }}
          </td>
          <td
            colspan="2"
            class="text-center"
          >
            {{ dataHeaderReceving.productId }}
          </td>
          <th colspan="2">
            Manufacturer Name
          </th>
          <td
            class="text-center text-wrap"
            colspan="3"
            style="width: 400px;"
          >
            <VSelect
              v-model="purchaseOrder.selectedMakerName"
              :readonly="readonlyAllInput()"
              :items="itemsManufacturer"
              item-title="makerName"
              item-value="productId"
              label="Select"
              persistent-hint
              center-affix="true"
              return-object
              density="compact"
              single-line
              style="font-size: 12px;"
            >
              <template #selection="{ item }">
                <div
                  class="d-flex justify-center"
                  style="width: 100%;"
                >
                  <span
                    style="font-size: 12px;"
                    class="text-center"
                  >
                    {{ item.title }}
                  </span>
                </div>
              </template>
            </VSelect>
          </td>
        </tr>
        <tr>
          <th colspan="2">
            Received Date
          </th>
          <td
            colspan="3"
            class="text-start"
          >
            {{ formatDate(purchaseOrder.receivedDate) }}
          </td>
          <th
            class="text-center"
            colspan="2"
          >
            SKT LOT No.
          </th>
          <td
            v-if="data.batch"
            class="text-center"
            colspan="3"
          >
            {{ dataHeaderReceving.sktLot }}
          </td>
        </tr>
      </table>
    </VCol>

    <section v-if="false">
      <VBtn @click="testPC">
        Test
      </VBtn>
    </section>

    <!-- Purchasing Order -->
    <VCol
      cols="12"
      style="overflow-x: auto; white-space: nowrap;"
    >
      <div style="overflow-x: auto;">
        <table class="custom-table">
          <tr>
            <th
              class="text-start"
              colspan="5"
            >
              <div>
                Purchasing Order
              </div>
            </th>
            <th
              class="text-center"
              colspan="11"
            >
              <div>
                Raw Material Receiving
              </div>
            </th>
          </tr>
          <!-- P/O -->
          <tr class="text-center">
            <th
              class="text-start"
              colspan="1"
            >
              P/O No.
            </th>
            <td
              class="text-start"
              colspan="2"
            >
              {{ data.purchaseOrderNo }}
            </td>
            <th
              class="text-center"
              colspan="2"
            >
              Maker Lot No.
            </th>
            <th
              class="text-center"
              colspan="1"
            >
              1
            </th>
            <th
              class="text-center"
              colspan="1"
            >
              <VTextField
                v-model="purchaseOrder.actualMakerLotNo_1"
                :readonly="readonlyAllInput()"
                density="compact"
                :style="{ width: '100%', minWidth: '150px', fontSize: '12px !important;' }"
                :rules="[
                  value => !!value.trim() || 'Lot No.1 is required.',
                  value => value.length <= 20 || 'Must be 20 characters or less'
                ]"
                maxlegth="20"
                class="custom-text-field"
              >
                <template
                  v-if="hidedAllIconInput"
                  #label
                >
                  <VIcon
                    
                    color="green"
                    icon="ri-edit-line"
                  />
                </template>
              </VTextField>
              <span
                v-if="validateLotNoInput(purchaseOrder.actualAmountUnits_1, purchaseOrder.actualMakerLotNo_1, 1)"
                class="text-red"
              >
                {{ validateLotNoInput(purchaseOrder.actualAmountUnits_1, purchaseOrder.actualMakerLotNo_1, 1) }}
              </span>
            </th>
            <th
              class="text-center"
              colspan="1"
            >
              2
            </th>
            <td
              class="text-center"
              colspan="1"
            >
              <VTextField
                v-model="purchaseOrder.actualMakerLotNo_2"
                :readonly="readonlyAllInput()"
                :style="{ width: '100%', minWidth: '150px' }"
                :rules="[
                  value => value.length <= 20 || 'Must be 20 characters or less',
                ]"
                density="compact"
                style="font-size: 16px;"
              >
                <template
                  v-if="hidedAllIconInput"
                  #label
                >
                  <VIcon
                    color="green"
                    icon="ri-edit-line"
                  />
                </template>
              </VTextField>
              <span
                v-if="validateLotNoInput(purchaseOrder.actualAmountUnits_2, purchaseOrder.actualMakerLotNo_2, 2)"
                class="text-red"
              >
                {{ validateLotNoInput(purchaseOrder.actualAmountUnits_2, purchaseOrder.actualMakerLotNo_2, 2) }}
              </span>
            </td>
            <th
              class="text-center"
              colspan="1"
            >
              3
            </th>
            <th
              class="text-center"
              colspan="1"
            >
              <VTextField
              
                v-model="purchaseOrder.actualMakerLotNo_3"
                :readonly="readonlyAllInput()"
                :style="{ width: '100%', minWidth: '150px' }"
                :rules="[
                  value => value.length <= 20 || 'Must be 20 characters or less'
                ]"
                density="compact"
                style="font-size: 16px;"
              >
                <template
                  v-if="hidedAllIconInput"
                  #label
                >
                  <VIcon
                    color="green"
                    icon="ri-edit-line"
                  />
                </template>
              </VTextField>
              <span
                v-if="validateLotNoInput(purchaseOrder.actualAmountUnits_3, purchaseOrder.actualMakerLotNo_3, 3) !== ''"
                class="text-red"
              >
                {{ validateLotNoInput(purchaseOrder.actualAmountUnits_3, purchaseOrder.actualMakerLotNo_3, 3) }}
              </span>
            </th>
            <th
              class="text-center"
              colspan="1"
              :disabled="purchaseOrder.actualMakerLotNo_4 === null || purchaseOrder.actualMakerLotNo_4 === undefined"
            >
              4
            </th>
            <th
              class="text-center"
              colspan="1"
            >
              <VTextField
                v-model="purchaseOrder.actualMakerLotNo_4"
                :readonly="readonlyAllInput()"
                :style="{ width: '100%', minWidth: '150px' }"
                :rules="[
                  value => value.length <= 20 || 'Must be 20 characters or less'
                ]"
                density="compact"
                style="font-size: 16px;"
              >
                <template
                  v-if="hidedAllIconInput"
                  #label
                >
                  <VIcon
                    color="green"
                    icon="ri-edit-line"
                  />
                </template>
              </VTextField>
              <span
                v-if="validateLotNoInput(purchaseOrder.actualAmountUnits_4, purchaseOrder.actualMakerLotNo_4, 4) !== ''"
                class="text-red"
              >
                {{ validateLotNoInput(purchaseOrder.actualAmountUnits_4, purchaseOrder.actualMakerLotNo_4, 4) }}
              </span>
            </th>
            <th
              class="text-center"
              colspan="1"
              :disabled="!purchaseOrder.actualMakerLotNo_5 === null || purchaseOrder.actualMakerLotNo_5 === undefined"
            >
              5
            </th>
            <th
              class="text-center"
              colspan="1"
            >
              <VTextField
                v-model="purchaseOrder.actualMakerLotNo_5"
                :readonly="readonlyAllInput()"
                :style="{ width: '100%', minWidth: '150px' }"
                :rules="[
                  value => value.length <= 20 || 'Must be 20 characters or less'
                ]"
                density="compact"
                style="font-size: 16px;"
              >
                <template
                  v-if="hidedAllIconInput"
                  #label
                >
                  <VIcon
                    color="green"
                    icon="ri-edit-line"
                  />
                </template>
              </VTextField>
              <span
                v-if="validateLotNoInput(purchaseOrder.actualAmountUnits_5, purchaseOrder.actualMakerLotNo_5, 5) !== ''"
                class="text-red"
              >
                {{ validateLotNoInput(purchaseOrder.actualAmountUnits_5, purchaseOrder.actualMakerLotNo_5, 5) }}
              </span>
            </th>
            <th
              class="text-center"
              colspan="2"
            >
              Total
            </th>
          </tr>
          <!-- Invoice -->
          <tr class="text-center">
            <th
              class="text-start"
              colspan="1"
            >
              Invoice No.
            </th>
            <th
              class="text-center"
              colspan="2"
            >
              <VTextField
                v-model="purchaseOrder.invoiceNo"
                :readonly="readonlyAllInput()"
                density="compact"
              />
            </th>
            <th
              class="text-center"
              colspan="2"
            >
              Net Count.(Kg)
            </th>

            <td
              class="text-center"
              colspan="2"
            >
              <VTextField
                
                v-if="false"
                v-model="purchaseOrder.actualNetCountKgs_1"
                :style="{ width: '100%', minWidth: '150px' }"
                density="compact"
                :rules="[
                  v => v === '' || (!!v && /^\d+(\.\d{0,2})?$/.test(v)) || 'กรุณากรอกตัวเลขเท่านั้น',
                  v => (!dataHeaderReceving.packagingQtyKg || v == dataHeaderReceving.packagingQtyKg) ||
                    `ค่าที่กรอกต้องเท่ากับ ${dataHeaderReceving.packagingQtyKg} Kg`
                ]"
                @input="(e) => handleInputNetCount(e, 'actualNetCountKgs_1')"
              >
                <template
                  v-if="hidedAllIconInput"
                  #label
                >
                  <VIcon icon="ri-edit-line" />
                </template>
                <template #append-inner>
                  <span style="font-size: 12px; padding-block-start: 2px;">Kg</span>
                </template>
              </VTextField>
              <VTextField
                v-if="data.receiveTypeId === 3 && dataHeaderReceving.packagingQtyKg === 0 && purchaseOrder.actualMakerLotNo_1"
                v-model="purchaseOrder.actualNetCountKgs_1"
                :style="{ width: '100%', minWidth: '150px' }"
                density="compact"
                :rules="[
                  v => v === '' || (!!v && /^\d+(\.\d{0,2})?$/.test(v)) || 'กรุณากรอกตัวเลขเท่านั้น',
                  v => (!data.purchasingAmountKgs || v == data.purchasingAmountKgs) ||
                    `ค่าที่กรอกต้องเท่ากับ ${data.purchasingAmountKgs} Kg`

                ]"
                @input="(e) => handleInputNetCount(e, 'actualNetCountKgs_1')"
              >
                <template #label>
                  <VIcon icon="ri-edit-line" />
                </template>
                <template #append-inner>
                  <span style="font-size: 12px; padding-block-start: 2px;">Kg</span>
                </template>
              </VTextField>

              {{ formatNumber(purchaseOrder.actualNetCountKgs_1) }}
            </td>

            <td
              class="text-center"
              colspan="2"
            >
              <VTextField
                v-if="false"
                v-model="purchaseOrder.actualNetCountKgs_2"
                :rules="[
                  v => v === '' || (!!v && /^\d+(\.\d{0,2})?$/.test(v)) || 'กรุณากรอกตัวเลขเท่านั้น',
                  v => (!dataHeaderReceving.packagingQtyKg || v == dataHeaderReceving.packagingQtyKg) ||
                    `ค่าที่กรอกต้องเท่ากับ ${dataHeaderReceving.packagingQtyKg} Kg`

                ]"
                density="compact"
                style="font-size: 16px;"
                @input="(e) => handleInputNetCount(e, 'actualNetCountKgs_2')"
              >
                <template #label>
                  <VIcon icon="ri-edit-line" />
                </template>
                <template #append-inner>
                  <span style="font-size: 12px; padding-block-start: 2px;">Kg</span>
                </template>
              </VTextField>
              <VTextField
                v-if="data.receiveTypeId === 3 && dataHeaderReceving.packagingQtyKg === 0 && purchaseOrder.actualMakerLotNo_2"
                v-model="purchaseOrder.actualNetCountKgs_2"
                :rules="[
                  v => v === '' || (!!v && /^\d+(\.\d{0,2})?$/.test(v)) || 'กรุณากรอกตัวเลขเท่านั้น',
                  v => (!data.purchasingAmountKgs || v == data.purchasingAmountKgs) ||
                    `ค่าที่กรอกต้องเท่ากับ ${data.purchasingAmountKgs} Kg`

                ]"
                density="compact"
                style="font-size: 16px;"
                @input="(e) => handleInputNetCount(e, 'actualNetCountKgs_2')"
              >
                <template #label>
                  <VIcon icon="ri-edit-line" />
                </template>
                <template #append-inner>
                  <span style="font-size: 12px; padding-block-start: 2px;">Kg</span>
                </template>
              </VTextField>
              {{ formatNumber(purchaseOrder.actualNetCountKgs_2) }}
            </td>

            <td
              class="text-center"
              colspan="2"
            >
              <VTextField
                v-if="false"
                v-model="purchaseOrder.actualNetCountKgs_3"
                :rules="[
                  v => v === '' || (!!v && /^\d+(\.\d{0,2})?$/.test(v)) || 'กรุณากรอกตัวเลขเท่านั้น',
                  v => (!dataHeaderReceving.packagingQtyKg || v == dataHeaderReceving.packagingQtyKg) ||
                    `ค่าที่กรอกต้องเท่ากับ ${dataHeaderReceving.packagingQtyKg} Kg`

                ]"
                density="compact"
                style="font-size: 16px;"
                @input="(e) => handleInputNetCount(e, 'actualNetCountKgs_3')"
              >
                <template #label>
                  <VIcon icon="ri-edit-line" />
                </template>
                <template #append-inner>
                  <span style="font-size: 12px; padding-block-start: 2px;">Kg</span>
                </template>
              </VTextField>
              <VTextField
                v-if="data.receiveTypeId === 3 && dataHeaderReceving.packagingQtyKg === 0 && purchaseOrder.actualMakerLotNo_3"
                v-model="purchaseOrder.actualNetCountKgs_3"
                :rules="[
                  v => v === '' || (!!v && /^\d+(\.\d{0,2})?$/.test(v)) || 'กรุณากรอกตัวเลขเท่านั้น',
                  v => (!data.purchasingAmountKgs || v == data.purchasingAmountKgs) ||
                    `ค่าที่กรอกต้องเท่ากับ ${data.purchasingAmountKgs} Kg`

                ]"
                density="compact"
                style="font-size: 16px;"
                @input="(e) => handleInputNetCount(e, 'actualNetCountKgs_3')"
              >
                <template #label>
                  <VIcon icon="ri-edit-line" />
                </template>
                <template #append-inner>
                  <span style="font-size: 12px; padding-block-start: 2px;">Kg</span>
                </template>
              </VTextField>
              {{ formatNumber(purchaseOrder.actualNetCountKgs_3) }}
            </td>
            <td
              class="text-center"
              colspan="2"
            >
              <VTextField
                v-if="false"
                v-model="purchaseOrder.actualNetCountKgs_4"
                :rules="[
                  v => v === '' || (!!v && /^\d+(\.\d{0,2})?$/.test(v)) || 'กรุณากรอกตัวเลขเท่านั้น',
                  v => (!dataHeaderReceving.packagingQtyKg || v == dataHeaderReceving.packagingQtyKg) ||
                    `ค่าที่กรอกต้องเท่ากับ ${dataHeaderReceving.packagingQtyKg} Kg`

                ]"
                density="compact"
                style="font-size: 16px;"
                @input="(e) => handleInputNetCount(e, 'actualNetCountKgs_4')"
              >
                <template #label>
                  <VIcon icon="ri-edit-line" />
                </template>
                <template #append-inner>
                  <span style="font-size: 12px; padding-block-start: 2px;">Kg</span>
                </template>
              </VTextField>
              <VTextField
                v-if="data.receiveTypeId === 3 && dataHeaderReceving.packagingQtyKg === 0 && purchaseOrder.actualMakerLotNo_4"
                v-model="purchaseOrder.actualNetCountKgs_4"
                :rules="[
                  v => v === '' || (!!v && /^\d+(\.\d{0,2})?$/.test(v)) || 'กรุณากรอกตัวเลขเท่านั้น',
                  v => (!data.purchasingAmountKgs || v == data.purchasingAmountKgs) ||
                    `ค่าที่กรอกต้องเท่ากับ ${data.purchasingAmountKgs} Kg`

                ]"
                density="compact"
                style="font-size: 16px;"
                @input="(e) => handleInputNetCount(e, 'actualNetCountKgs_4')"
              >
                <template #label>
                  <VIcon icon="ri-edit-line" />
                </template>
                <template #append-inner>
                  <span style="font-size: 12px; padding-block-start: 2px;">Kg</span>
                </template>
              </VTextField>
              {{ formatNumber(purchaseOrder.actualNetCountKgs_4) }}
            </td>
            <td
              colspan="2"
              class="text-center"
            >
              <VTextField
                v-if="false"
                v-model="purchaseOrder.actualNetCountKgs_5"
                :rules="[
                  v => v === '' || (!!v && /^\d+(\.\d{0,2})?$/.test(v)) || 'กรุณากรอกตัวเลขเท่านั้น',
                  v => (!dataHeaderReceving.packagingQtyKg || v == dataHeaderReceving.packagingQtyKg) ||
                    `ค่าที่กรอกต้องเท่ากับ ${dataHeaderReceving.packagingQtyKg} Kg`

                ]"
                density="compact"
                style="font-size: 16px;"
                @input="(e) => handleInputNetCount(e, 'actualNetCountKgs_5')"
              >
                <template #label>
                  <VIcon icon="ri-edit-line" />
                </template>
                <template #append-inner>
                  <span style="font-size: 12px; padding-block-start: 2px;">Kg</span>
                </template>
              </VTextField>
              <VTextField
                v-if="data.receiveTypeId === 3 && dataHeaderReceving.packagingQtyKg === 0 && purchaseOrder.actualMakerLotNo_5"
                v-model="purchaseOrder.actualNetCountKgs_5"
                :rules="[
                  v => v === '' || (!!v && /^\d+(\.\d{0,2})?$/.test(v)) || 'กรุณากรอกตัวเลขเท่านั้น',
                  v => (!data.purchasingAmountKgs || v == data.purchasingAmountKgs) ||
                    `ค่าที่กรอกต้องเท่ากับ ${data.purchasingAmountKgs} Kg`


                ]"
                density="compact"
                style="font-size: 16px;"
                @input="(e) => handleInputNetCount(e, 'actualNetCountKgs_5')"
              >
                <template #label>
                  <VIcon icon="ri-edit-line" />
                </template>
                <template #append-inner>
                  <span style="font-size: 12px; padding-block-start: 2px;" />
                </template>
              </VTextField>
              {{ formatNumber(purchaseOrder.actualNetCountKgs_5) }}
            </td>
            <td
              class="text-center"
              colspan="2"
              :style="{ width: '100%', minWidth: '150px' }"
            >
              <span class="px-2">{{ formatNumber(purchaseOrder.actualMeanNetCountKgs) }}</span>
            </td>
          </tr>
          <!-- Expect Delivery -->
          <tr class="text-center">
            <th
              class="text-start"
              colspan="1"
            >
              Expect Delivery Date
            </th>
            <td
              class="text-center"
              colspan="2"
            >
              <AppDateTimePicker
                v-if="!readonlyAllInput()"
                v-model="purchaseOrder.expectDeliveryDate"
                density="compact"
                prepend-inner-icon="ri-calendar-schedule-fill"
                :config="{ dateFormat: 'd/m/Y' }"
                class="custom-date-time-picker"
                :style="{ fontSize: '12px;' }"
              />
              <span v-if="readonlyAllInput()"><VIcon icon="ri-calendar-schedule-fill" />{{ purchaseOrder.expectDeliveryDate }}</span>
            </td>
            <th
              class="text-center"
              colspan="2"
            >
              Amount (Unit)
            </th>

            <th
              class="text-center"
              colspan="2"
            >
              <VTextField
                v-model="purchaseOrder.actualAmountUnits_1"
                :readonly="readonlyAllInput()"
                :rules="[
                  v => v === '' || (!!v && /^\d+$/.test(v)) || 'กรุณากรอกตัวเลขเท่านั้น', 
                  v => v === '' || v >= 1 || 'ค่าที่กรอกต้องไม่น้อยกว่า 1'
                ]"
                density="compact"
                style="font-size: 16px; text-align: end;"
                @input="(e) => handleInputAmount(e, 'actualAmountUnits_1')"
              >
                <template
                  v-if="hidedAllIconInput"
                  #label
                >
                  <VIcon icon="ri-edit-line" />
                </template>
                <template #append-inner>
                  <span style="font-size: 12px; padding-block-start: 2px;">Unit</span>
                </template>
              </VTextField>
              <span
                v-if="validateAmountInput(purchaseOrder.actualAmountUnits_1, purchaseOrder.actualMakerLotNo_1, 1) !== ''"
                class="text-red"
              >
                {{ validateAmountInput(purchaseOrder.actualAmountUnits_1, purchaseOrder.actualMakerLotNo_1, 1) }}
              </span>
            </th>

            <th
              class="text-center"
              colspan="2"
            >
              <VTextField
                v-model="purchaseOrder.actualAmountUnits_2"
                :readonly="readonlyAllInput()"
                :rules="[
                  v => v === '' || (!!v && /^\d+$/.test(v)) || 'กรุณากรอกตัวเลขเท่านั้น', 
                  v => v === '' || v >= 1 || 'ค่าที่กรอกต้องไม่น้อยกว่า 1'
                ]"
                density="compact"
                style="font-size: 16px;"
                @input="(e) => handleInputAmount(e, 'actualAmountUnits_2')"
              >
                <template
                  v-if="hidedAllIconInput"
                  #label
                >
                  <VIcon icon="ri-edit-line" />
                </template>
                <template #append-inner>
                  <span style="font-size: 12px; padding-block-start: 2px;">Unit</span>
                </template>
              </VTextField>
              <span
                v-if="validateAmountInput(purchaseOrder.actualAmountUnits_2, purchaseOrder.actualMakerLotNo_2, 2) !== ''"
                class="text-red"
              >
                {{ validateAmountInput(purchaseOrder.actualAmountUnits_2, purchaseOrder.actualMakerLotNo_2, 2) }}
              </span>
            </th>

            <th
              class="text-center"
              colspan="2"
            >
              <VTextField
                v-model="purchaseOrder.actualAmountUnits_3"
                :readonly="readonlyAllInput()"
                :rules="[
                  v => v === '' || (!!v && /^\d+$/.test(v)) || 'กรุณากรอกตัวเลขเท่านั้น', 
                  v => v === '' || v >= 1 || 'ค่าที่กรอกต้องไม่น้อยกว่า 1'
                ]"
                density="compact"
                style="font-size: 16px;"
                @input="(e) => handleInputAmount(e, 'actualAmountUnits_3')"
              >
                <template
                  v-if="hidedAllIconInput"
                  #label
                >
                  <VIcon icon="ri-edit-line" />
                </template>
                <template #append-inner>
                  <span style="font-size: 12px; padding-block-start: 2px;">Unit</span>
                </template>
              </VTextField>
              <span
                v-if="validateAmountInput(purchaseOrder.actualAmountUnits_3, purchaseOrder.actualMakerLotNo_3, 3) !== ''"
                class="text-red"
              >
                {{ validateAmountInput(purchaseOrder.actualAmountUnits_3, purchaseOrder.actualMakerLotNo_3, 3) }}
              </span>
            </th>
            <th
              class="text-center"
              colspan="2"
            >
              <VTextField
                v-model="purchaseOrder.actualAmountUnits_4"
                :readonly="readonlyAllInput()"
                :rules="[
                  v => v === '' || (!!v && /^\d+$/.test(v)) || 'กรุณากรอกตัวเลขเท่านั้น', 
                  v => v === '' || v >= 1 || 'ค่าที่กรอกต้องไม่น้อยกว่า 1'
                ]"
                density="compact"
                style="font-size: 16px;"
                @input="(e) => handleInputAmount(e, 'actualAmountUnits_4')"
              >
                <template
                  v-if="hidedAllIconInput"
                  #label
                >
                  <VIcon icon="ri-edit-line" />
                </template>
                <template #append-inner>
                  <span style="font-size: 12px; padding-block-start: 2px;">Unit</span>
                </template>
              </VTextField>
              <span
                v-if="validateAmountInput(purchaseOrder.actualAmountUnits_4, purchaseOrder.actualMakerLotNo_4, 4) !== ''"
                class="text-red"
              >
                {{ validateAmountInput(purchaseOrder.actualAmountUnits_4, purchaseOrder.actualMakerLotNo_4, 4) }}
              </span>
            </th>
            <th
              class="text-center"
              colspan="2"
            >
              <VTextField
                v-model="purchaseOrder.actualAmountUnits_5"
                :readonly="readonlyAllInput()"
                :rules="[
                  v => v === '' || (!!v && /^\d+$/.test(v)) || 'กรุณากรอกตัวเลขเท่านั้น', 
                  v => v === '' || v >= 1 || 'ค่าที่กรอกต้องไม่น้อยกว่า 1'
                ]"
                density="compact"
                style="font-size: 16px;"
                @input="(e) => handleInputAmount(e, 'actualAmountUnits_5')"
              >
                <template
                  v-if="hidedAllIconInput"
                  #label
                >
                  <VIcon icon="ri-edit-line" />
                </template>
                <template #append-inner>
                  <span style="font-size: 12px; padding-block-start: 2px;">Unit</span>
                </template>
              </VTextField>
              <span
                v-if="validateAmountInput(purchaseOrder.actualAmountUnits_5, purchaseOrder.actualMakerLotNo_5, 5) !== ''"
                class="text-red"
              >
                {{ validateAmountInput(purchaseOrder.actualAmountUnits_5, purchaseOrder.actualMakerLotNo_5, 5) }}
              </span>
            </th>
            <td
              class="text-center"
              colspan="2"
              :style="{ width: '100%', minWidth: '150px' }"
            >
              <span class="px-2">{{ formatNumberToLocal(purchaseOrder.actualGrandAmountUnits) }} </span>
            </td>
          </tr>

          <!-- Packaging -->
          <tr class="text-center">
            <th
              class="text-center"
              colspan="1"
              rowspan="6"
            >
              Delivery Quantity
            </th>
            <th
              class="text-center"
              colspan="1"
            >
              Packing
            </th>
            <td
              class="text-center"
              colspan="1"
            >
              {{ purchaseOrder.packagingTypeName }}
            </td>
            <th
              class="text-center"
              colspan="2"
              rowspan="3"
            />

            <td
              class="text-start"
              colspan="2"
            >
              <div>
                <VIcon icon="ri-functions" />{{ formatNumber(purchaseOrder.actualTotalQuantityKgs_1) }}
              </div>
            </td>

            <td
              class="text-start"
              colspan="2"
            >
              <div>
                <VIcon icon="ri-functions" />{{ formatNumber(purchaseOrder.actualTotalQuantityKgs_2) }}
              </div>
            </td>

            <td
              class="text-start"
              colspan="2"
            >
              <div>
                <VIcon icon="ri-functions" />{{ formatNumber(purchaseOrder.actualTotalQuantityKgs_3) }}
              </div>
            </td>
            <td
              class="text-start"
              colspan="2"
            >
              <div>
                <VIcon icon="ri-functions" />{{ formatNumber(purchaseOrder.actualTotalQuantityKgs_4) }}
              </div>
            </td>
            <td
              class="text-start"
              colspan="2"
            >
              <div>
                <VIcon icon="ri-functions" />{{ formatNumber(purchaseOrder.actualTotalQuantityKgs_5) }}
              </div>
            </td>
            <td
              v-if="purchaseOrder.actualMakerLotNo_1 || purchaseOrder.actualMakerLotNo_2 || purchaseOrder.actualMakerLotNo_3 || purchaseOrder.actualMakerLotNo_4 || purchaseOrder.actualMakerLotNo_5"
              class="text-center"
              colspan="2"
              :style="{ width: '100%', minWidth: '150px' }"
            >
              {{ formatNumber(purchaseOrder.actualGrandTotalQuantityKgs) }}
            </td>
          </tr>
          <!-- Net Cont.(Kg) -->
          <tr class="text-center">
            <th
              class="text-center"
              colspan="1"
            >
              Net Count.(Kg)
            </th>
            <td
              class="text-center"
              colspan="1"
              style="min-width: 150px; max-width: 150px;"
            >
              <span v-if="data.receiveTypeId === 3 && dataHeaderReceving.packagingQtyKg === 0">{{
                formatNumber(data.purchasingAmountKgs) }}</span>
              <span v-if="data.receiveTypeId === 2">{{ formatNumber(dataHeaderReceving.packagingQtyKg) }}</span>
            </td>
            <th
              :disabled="!purchaseOrder.actualMakerLotNo_1"
              class="text-center"
              colspan="2"
            />
            <th
              :disabled="!purchaseOrder.actualMakerLotNo_2 === null || purchaseOrder.actualMakerLotNo_2 === undefined"
              class="text-center"
              colspan="2"
            />

            <th
              :disabled="purchaseOrder.actualMakerLotNo_3 === null || purchaseOrder.actualMakerLotNo_3 === undefined"
              class="text-center"
              colspan="2"
            />
            <th
              :disabled="!purchaseOrder.actualMakerLotNo_4 === null || purchaseOrder.actualMakerLotNo_4 === undefined"
              class="text-center"
              colspan="2"
            />
            <th
              :disabled="!purchaseOrder.actualMakerLotNo_5 === null || purchaseOrder.actualMakerLotNo_5 === undefined"
              class="text-center"
              colspan="2"
            />
            <th
              class="text-center"
              colspan="2"
            />
          </tr>
          <!--  Amount (Unit) -->
          <tr class="text-center">
            <th
              class="text-center"
              colspan="1"
            >
              Amount (Unit)
            </th>
            <td
              class="text-center"
              colspan="1"
              style="min-width: 150px; max-width: 150px;"
            >
              {{ formatNumberToLocal(data.purchasingQuantityPcs) }}
            </td>
            <th
              :disabled="!purchaseOrder.actualMakerLotNo_1"
              class="text-center"
              colspan="2"
            />
            <th
              :disabled="!purchaseOrder.actualMakerLotNo_2 === null || purchaseOrder.actualMakerLotNo_2 === undefined"
              class="text-center"
              colspan="2"
            />

            <th
              :disabled="purchaseOrder.actualMakerLotNo_3 === null || purchaseOrder.actualMakerLotNo_3 === undefined"
              class="text-center"
              colspan="2"
            />
            <th
              :disabled="!purchaseOrder.actualMakerLotNo_4 === null || purchaseOrder.actualMakerLotNo_4 === undefined"
              class="text-center"
              colspan="2"
            />
            <th
              :disabled="!purchaseOrder.actualMakerLotNo_5 === null || purchaseOrder.actualMakerLotNo_5 === undefined"
              class="text-center"
              colspan="2"
            />
            <th
              class="text-center"
              colspan="2"
            />
          </tr>
          <!-- Total Quantity -->
          <tr class="text-center">
            <th
              class="text-center"
              colspan="1"
            >
              Total Quantity
            </th>
            <td
              class="text-center"
              colspan="1"
              style="min-width: 150px; max-width: 150px;"
            >
              {{ formatNumber(data.purchasingAmountKgs) }}
            </td>
            <th
              class="text-center"
              colspan="2"
            >
              Manufacturer Name
            </th>
            <th
              class="text-center"
              colspan="2"
            >
              <VTextField
                v-model="purchaseOrder.customManufacturerName_1"
                :readonly="readonlyAllInput()"
                density="compact"
                style="font-size: 16px;"
                :style="{ width: '100%', minWidth: '150px' }"
                :rules="[
                  value => value.length <= 250 || 'Must be 250 characters or less'
                ]"
              >
                <template
                  v-if="hidedAllIconInput"
                  #label
                >
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>
            </th>
            <th
              class="text-center"
              colspan="2"
            >
              <VTextField
                v-model="purchaseOrder.customManufacturerName_2"
                :readonly="readonlyAllInput()"
                density="compact"
                style="font-size: 16px;"
                :style="{ width: '100%', minWidth: '150px' }"
                :rules="[
                  value => value.length <= 250 || 'Must be 250 characters or less'
                ]"
              >
                <template
                  v-if="hidedAllIconInput"
                  #label
                >
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>
            </th>

            <th
              class="text-center"
              colspan="2"
            >
              <VTextField
                v-model="purchaseOrder.customManufacturerName_3"
                :readonly="readonlyAllInput()"
                density="compact"
                style="font-size: 16px;"
                :style="{ width: '100%', minWidth: '150px' }"
                :rules="[
                  value => value.length <= 250 || 'Must be 250 characters or less'
                ]"
              >
                <template
                  v-if="hidedAllIconInput"
                  #label
                >
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>
            </th>
            <th
              class="text-center"
              colspan="2"
            >
              <VTextField
                v-model="purchaseOrder.customManufacturerName_4"
                :readonly="readonlyAllInput()"
                density="compact"
                style="font-size: 16px;"
                :style="{ width: '100%', minWidth: '150px' }"
                :rules="[
                  value => value.length <= 250 || 'Must be 250 characters or less'
                ]"
              >
                <template
                  v-if="hidedAllIconInput"
                  #label
                >
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>
            </th>
            <th
              class="text-center"
              colspan="2"
            >
              <VTextField
                v-model="purchaseOrder.customManufacturerName_5"
                :readonly="readonlyAllInput()"
                density="compact"
                style="font-size: 16px;"
                :style="{ width: '100%', minWidth: '150px' }"
                :rules="[
                  value => value.length <= 250 || 'Must be 250 characters or less'
                ]"
              >
                <template
                  v-if="hidedAllIconInput"
                  #label
                >
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>
            </th>
            <th
              class="text-center"
              colspan="2"
            />
          </tr>
          <!-- Label -->
          <tr class="text-center">
            <th
              class="text-center"
              colspan="1"
            />
            <th
              class="text-center"
              colspan="1"
            />
            <th
              class="text-center"
              colspan="2"
            >
              Label / Warning Label
            </th>
            <th
              disabled="purchaseOrder.actualMakerLotNo_1"
              class="text-center"
              colspan="2"
            >
              <VTextField
                v-model="purchaseOrder.customLable_1"
                :readonly="readonlyAllInput()"
                density="compact"
                style="font-size: 16px;"
                :style="{ width: '100%', minWidth: '150px' }"
                :rules="[
                  value => value.length <= 100 || 'Must be 100 characters or less'
                ]"
              >
                <template
                  v-if="hidedAllIconInput"
                  #label
                >
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>
            </th>
            <th
              disabled="!purchaseOrder.actualMakerLotNo_2"
              class="text-center"
              colspan="2"
            >
              <VTextField
                v-model="purchaseOrder.customLable_2"
                density="compact"
                :readonly="readonlyAllInput()"
                style="font-size: 16px;"
                :style="{ width: '100%', minWidth: '150px' }"
                :rules="[
                  value => value.length <= 100 || 'Must be 100 characters or less'
                ]"
              >
                <template
                  v-if="hidedAllIconInput"
                  #label
                >
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>
            </th>

            <th
              disabled="!purchaseOrder.actualMakerLotNo_3"
              class="text-center"
              colspan="2"
            >
              <VTextField
                v-model="purchaseOrder.customLable_3"
                density="compact"
                :readonly="readonlyAllInput()"
                style="font-size: 16px;"
                :style="{ width: '100%', minWidth: '150px' }"
                :rules="[
                  value => value.length <= 100 || 'Must be 100 characters or less'
                ]"
              >
                <template
                  v-if="hidedAllIconInput"
                  #label
                >
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>
            </th>
            <th
              disabled="!purchaseOrder.actualMakerLotNo_4"
              class="text-center"
              colspan="2"
            >
              <VTextField
                v-model="purchaseOrder.customLable_4"
                density="compact"
                :readonly="readonlyAllInput()"
                style="font-size: 16px;"
                :style="{ width: '100%', minWidth: '150px' }"
                :rules="[
                  value => value.length <= 100 || 'Must be 100 characters or less'
                ]"
              >
                <template
                  v-if="hidedAllIconInput"
                  #label
                >
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>
            </th>
            <th
              disabled="!purchaseOrder.actualMakerLotNo_5"
              class="text-center"
              colspan="2"
            >
              <VTextField
                v-model="purchaseOrder.customLable_5"
                density="compact"
                :readonly="readonlyAllInput()"
                style="font-size: 16px;"
                :style="{ width: '100%', minWidth: '150px' }"
                :rules="[
                  value => value.length <= 100 || 'Must be 100 characters or less'
                ]"
              >
                <template
                  v-if="hidedAllIconInput"
                  #label
                >
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>
            </th>
            <th
              class="text-center"
              colspan="2"
            />
          </tr>
          <!-- Storage Place No. -->
          <tr class="text-center">
            <th
              class="text-center"
              colspan="1"
            />
            <th
              class="text-center"
              colspan="1"
            />
            <th
              class="text-center"
              colspan="2"
            >
              Storage Place No.
            </th>
            <td
              class="text-start"
              colspan="10"
            >
              {{ purchaseOrder.storagePlaceNo }}
            </td>
            <th
              disabled="purchaseOrder.actualMakerLotNo_2"
              class="text-center"
              colspan="2"
            />
          </tr>
        </table>
      </div>
    </VCol>

    <!-- Notes -->
    <VCol cols="12">
      <div
        style="font-size: 12px;"
        class="mb-2"
      >
        Notes
      </div>
      <Table class="custom-table">
        <tr>
          <th>
            <VTextarea
              v-model="purchaseOrder.noteText"
              :readonly="readonlyAllInput()"
              label="Enter Your Notes"
              placeholder="Text"
              :rules="[
                v => v.length <= 1000 || 'Max 1000 characters',
              ]"
            />
            <span
              v-if="textAlertError.note && !purchaseOrder.noteText"
              class="text-red"
            >{{ textAlertError.note }}</span>
          </th>
        </tr>
      </Table>
    </VCol>

    <!-- RM for Halal -->
    <VCol cols="4">
      <Table class="custom-table">
        <tr>
          <th>
            <div class="demo-space-x">
              <VCheckbox
                v-model="purchaseOrder.isForHalalProduct"
                :readonly="readonlyAllInput()"
              >
                <template #label>
                  <span style="font-size: 12px;">
                    RM for Halal Product
                  </span>
                </template>
              </VCheckbox>
            </div>
          </th>
        </tr>
      </Table>
    </VCol>
    <!-- RM for RSPO -->
    <VCol cols="4">
      <Table class="custom-table">
        <tr>
          <th>
            <div class="demo-space-x">
              <VCheckbox
                v-model="purchaseOrder.isForRspoProduct"
                :readonly="readonlyAllInput()"
              >
                <template #label>
                  <span style="font-size: 12px;">
                    RM for RSPO Product
                  </span>
                </template>
              </VCheckbox>
            </div>
          </th>
        </tr>
      </Table>
    </VCol>

    <!-- COA -->
    <VCol cols="12">
      <div
        style="font-size: 12px;"
        class="mb-2"
      >
        COA
      </div>
      <Table class="custom-table">
        <tr>
          <th>
            <VRow>
              <VCol cols="12">
                <VFileInput
                  v-if="!readonlyAllInput()"
                  v-model="fileCoaNew"
                  accept="image/png, image/jpeg, image/bmp, application/pdf"
                  prepend-icon="mdi-paperclip"
                  multiple
                  color="black"
                >
                  <template #label>
                    <span style="font-size: 12px;">
                      File Upload COA
                    </span>
                  </template>
                </VFileInput>
              </VCol>
            </VRow>

            <VBtn v-if="false" @click="testCoaNew">
              TestNew
            </VBtn>

            <div class="demo-space-y">
              <VProgressLinear
                v-if="loading"
                v-model="modelValue"
                height="8"
                :buffer-value="bufferValue"
                indeterminate
                color="primary"
              >
                <template #default>
                  <div>Loading Image....</div>
                </template>
              </VProgressLinear>
            </div>

            <!-- Upload -->
            <VRow
              v-if="fileCoaNew.length"
              class="pa-2 d-flex justify-center bg-green-lighten-5"
            >
              <VCol
                v-for="(file, index) in fileCoaNew"
                :key="index"
                cols="12"
                md="4"
                lg="3"
              >
                <VCard>
                  <VCardText style="min-height: 250px;">
                    <VChip
                      color="success"
                      variant="elevated"
                    >
                      New
                    </VChip>

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

                    <div
                      v-if="false"
                      class="d-flex flex-column align-center"
                    >
                      <span>{{ file.name }}</span>
                    </div>
                  </VCardText>
                  <VCardActions>
                    <VBtn
                      v-if="!readonlyAllInput()"
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

            <!-- o -->
            <VRow
              v-if="getCoaForm"
              class="pa-2 d-flex justify-center"
            >
              <VCol
                v-for="(file, index) in getCoaForm"
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
                    <div
                      v-if="false"
                      class="d-flex flex-column align-center"
                    >
                      <span>{{ file.fileName }}</span>
                    </div>
                  </VCardText>

                  <VCardActions>
                    <VBtn
                      v-if="!readonlyAllInput()"
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

            <div v-if="coaFiles.length || files.length">
              <VCol
                class="d-flex justify-end"
                cols="12"
              >
                <VBtn
                  v-if="!readonlyAllInput()"
                  color="red"
                  @click="removeFileAll"
                >
                  <VIcon icon="ri-delete-bin-6-line" />
                  Delete All COA
                </VBtn>
              </VCol>
            </div>

            <span class="text-red" v-if="textAlertError.coa || !getCoaForm">!{{ textAlertError.coa }}</span>
          </th>
        </tr>
      </Table>
    </VCol>
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
            height="80%"
            contain
          />
        </VCardText>
      </VCard>
    </VDialog>

    <!-- WareHouse -->
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
            <span>Staff: {{ UserNameAccoutWork }}</span>
          </td>
          <td colspan="6">
            <span>Supervisor: {{ supplier }}</span>
          </td>
        </tr>
        <tr>
          <td
            style="min-width: 150px;"
            colspan="6"
          >
            <div v-if="dataHeaderReceving.updatedDate">
              <VIcon
                class="mx-2"
                icon="ri-calendar-schedule-fill"
                size="30"
              />{{
                formatDate(dataHeaderReceving.updatedDate)
              }}
            </div>
          </td>
          <td
            style="min-width: 150px;"
            colspan="6"
          >
            <div v-if="dataHeaderReceving.approveRejectDate">
              <VIcon
                class="mx-2"
                icon="ri-calendar-schedule-fill"
                size="30"
              />{{
                formatDate(dataHeaderReceving.approveRejectDate) }}
            </div>
          </td>
        </tr>
      </table>
    </VCol>

    <!-- BTN -->
    <VCol
      v-if="statusId === 3 || statusId === 1"
      cols="12"
      class="py-0"
    >
      <div class="py-0 d-flex justify-end">
        <VBtn
          v-if="getDisabledFollowStatusNRole()"
          class="mx-4"
          color="warning"
          style="font-size: 12px;"
          @click="submitButtonVisibleNew('SAVE DRAFT')"
        >
          SAVE DRAFT
        </VBtn>
        <VBtn
          v-if="getDisabledFollowStatusNRole()"
          color="green"
          style="font-size: 12px;"
          @click="submitButton('SUBMIT')"
        >
          SUBMIT
        </VBtn>
        <VBtn
          v-if="false"
          color="green"
          style="font-size: 12px;"
          @click="submitButton('APPROVE')"
        >
          Approve
        </VBtn>
      </div>
    </VCol>

    <VCol
      v-if="statusId === 3 || statusId === 1"
      class="text-end pb-4 pt-1"
      cols="12"
    >
      <span
        v-if="getDisabledFollowStatusNRole()"
        class="px-1"
        style="font-size: 12px;"
      >For Inspection </span>
    </VCol>

    <!-- Dialog Step Save Draft -->
    <section style="font-size: 12px;">
      n
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
          <VCardText />
          <!-- Header -->
          <VCardText v-if="!textAlertError.success && textAlertError.note">
            <VAlert 
              title="Verify The Accuracy Of The Header"
              variant="outlined"
              closable
              class="text-start"
            >
              <span v-if="false" class="text-start">Header Validated :</span> <span class="text-red">{{ textAlertError.mgs }} </span>
              <span class="text-start">Alert Note :</span> <span class="text-red">{{ textAlertError.note }} </span>
            </VAlert>
          </VCardText>
          <!-- Lot -->
          <VCardText
            v-if="alertErrorLot && textAlertError.success"
            class="text-start"
          >
            <VDivider />
            <div>
              <VAlert
                title="Verify the accuracy of the Lot"
                variant="outlined"
                closable
              >
                <div
                  v-for="(value, key, index) in alertErrorLot"
                  :key="index"
                >
                  <span
                    v-if="!value.success"
                    style="font-size: 14px;"
                  >
                    <VIcon
                      color="error"
                      icon="ri-error-warning-fill"
                    />Lot No.{{ value.index }} 
                    {{ value.msg }}
                  </span>
                  <span
                    v-if="value.success"
                    style="font-size: 14px;"
                  >
                    <VIcon
                      color="success"
                      icon="ri-checkbox-circle-fill"
                    />Lot No.{{ value.index }}
                    {{ value.msg }}
                  </span>
                </div>
              </VAlert>
            </div>
          </VCardText>
          <!-- Coa -->
          <VCardText v-if="!textAlertError.success && textAlertError.coa && !textAlertError.note">
            <VAlert 
              title="Verify The Accuracy Of The COA"
              variant="outlined"
              closable
              class="text-start"
            >
              <span class="text-start">Alert COA :</span> <span class="text-red">{{ textAlertError.coa }} </span>
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
              v-if="wordForSubmit === 'SUBMIT'"
              color="green"
              @click="submitReceivingForm"
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

    <!-- Dialog Area Text Remark -->
    <section>
      <VDialog
        v-model="isDialogTextAreaVisible"
        width="500"
      >
        <!-- Dialog Content -->
        <VCard :title="wordForSubmit">
          <DialogCloseBtn
            variant="text"
            size="default"
            :rules="[v => v.length <= 240 || 'Max 240 characters']"
            @click="isDialogTextAreaVisible = false"
          />

          <VCardText>
            <VTextarea
              :label="`Remark ${wordForSubmit}`"
              :placeholder="`Enter Remark ${wordForSubmit}`"
            />
          </VCardText>

          <VCardText class="d-flex justify-end flex-wrap gap-4">
            <VBtn
              :color="wordForSubmit === 'Back To Edit' ? 'info' : (wordForSubmit === 'Reject' ? 'error' : 'default')"
              @click="isDialogTextAreaVisible = false; isDialogVisibleAction = false"
            >
              {{ wordForSubmit }}
            </VBtn>
          </VCardText>
        </VCard>
      </VDialog>
    </section>
  </VRow>
</template>

<style scoped>
.table-container {
  overflow-x: auto;
}

.text-wrap {
  overflow-wrap: break-word;

  /* Ensures long words are wrapped */
  white-space: normal;

  /* Allows text to wrap */
  word-wrap: break-word;

  /* Breaks long words if necessary */
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

.image {
  inline-size: 100px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.custom-radio input[type="radio"] {
  block-size: 20px !important;
  inline-size: 20px !important;
}

.v-selection-control__wrapper {
  block-size: 50% !important;
  inline-size: 50% !important;
}

.centered-input >>> input {
  padding: 10px;
  text-align: center;
}

.v-text-field >>> input {
  font-size: 12px;
  text-transform: capitalize;
}

.v-field >>> input {
  text-align: center;
}

.custom-date-time-picker >>> input {
  font-size: 12px;

  /* ปรับขนาดของข้อความในฟิลด์ */
}

.custom-date-time-picker >>> input icon--prepend {
  font-size: 12px;

  /* ปรับขนาดของไอคอนที่อยู่ด้านหน้า */
}
</style>
