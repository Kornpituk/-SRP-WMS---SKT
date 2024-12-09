<script setup>
import axiosIns from '@axios'

//// --------------------------------------------------------------------------------------
import { ref, watchEffect } from 'vue'

//---------------------------------------------------------------  Get All Product From X-Location(Where House) ------------------------

import { urlApi } from '@/api'  //---------------------- Import Api for Url *****

//------------------------ Get Where House Name From LocalStorage and define to whereHouseSelectedItem ---------------------------
const whereHouse = localStorage.getItem('whereHouseName')
const whereHouseSelectedItem = ref(whereHouse)

const products = ref([]) //---------------- variable for get All Product From X-Location(Where House) *****

// Get access token from localStorage in another page
const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')

const perPage = ref(10)
const page = ref(0)
const totalCount = ref(0)

const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)

//------------------- Model ID For search ------------------------------------
const searchByCategoryId = ref(null)
const searchByTypeId = ref(null)
const searchBySubTypeId = ref(null)
const searchByBarcode = ref(null)
const searchByProductId = ref(null)
const searchByProductName = ref(null)
const searchByUOMId = ref(null)

const searchByWareHouseId = ref([whereHouse])

const searchByZoneId = ref(null)
const searchByAreaId = ref(null)
const searchBySubAreaId = ref(null)

//------------------------ Model Name for search ------------------------------
const searchByCategoryName = ref(null)
const searchByTypeName = ref(null)
const searchBySubTypeName = ref(null)
const searchByBarcodeName = ref(null)
const searchByProductCodeName = ref(null)
const searchByProductNameFilter = ref(null)
const searchByUnitName = ref(null)

//------------------------ item ID for search ------------------------------
const itemsSearchByCategoryId = ref([])

//----------------------  Variable for SortBy -------------------------------------
const sortByCategory = ref('')
const sortByType = ref('')
const sortBySubType = ref('')
const sortByBarcode = ref('')
const sortByProductId = ref('')
const sortByProductName = ref('')
const sortByUnit = ref('')
const sortByQty = ref('')
const sortByTags = ref('')
const sortByNonTags = ref('')


const toggleSortType = sortBy => {
  const sortRefs = { sortByCategory, sortByType, sortBySubType, sortByBarcode, sortByProductId, sortByProductName, sortByUnit, sortByQty, sortByTags, sortByNonTags }

  for (const key in sortRefs) {
    if (key === sortBy) {
      sortRefs[key].value = sortRefs[key].value === 'asc' ? 'desc' : 'asc'
    } else {
      sortRefs[key].value = '' // ล้างค่าที่ไม่เกี่ยวข้อง
    }

    // console.log("Sort type:",sortRefs[key],'Key',[key])
  }

  // console.log("Sort type:",sortRefs[key],'Key',[key])
}

const router = useRouter()

const serialProductCode = ref(null)

//------------------------------- Function Get StockUpdate Need Enter Search -----------------

const clearModel = () => {
  searchByCategoryId.value = null
  searchByTypeId.value = null
  searchBySubTypeId.value = null
  searchByBarcode.value = null
  searchByProductId.value = null
  searchByProductName.value = null
  searchByUOMId.value = null
  searchByZoneId.value = null
  searchByAreaId.value = null
  searchBySubAreaId.value = null
  serialProductCode.value = null
}

const searchParams = {
  searchByCategoryId,
  searchByTypeId,
  searchBySubTypeId,
  searchByBarcode,
  searchByProductId,
  searchByProductName,
  searchByUOMId,
  searchByZoneId,
  searchByAreaId,
  searchBySubAreaId,
  serialProductCode,

  searchByCategoryName,
  searchByTypeName,
  searchBySubTypeName,
  searchByBarcodeName,
  searchByProductCodeName,
  searchByProductNameFilter,
  searchByUnitName,
}

const sortParams = {
  sortByCategory,
  sortByType,
  sortBySubType,
  sortByBarcode,
  sortByProductId,
  sortByProductName,
  sortByUnit,
  sortByQty,
  sortByTags,
  sortByNonTags,
}

const GetStockUpdate = () => {

  // console.log('searchByCategoryName: ',searchByCategoryName)
  axiosIns.get(`${urlApi.value}/api/v1/StockUpdate?page=`+currentPage.value+`&perPage=`+rowPerPage.value, {
    params: {
      categoryId: searchByCategoryId.value,
      typeId: searchByTypeId.value,
      subTypeId: searchBySubTypeId.value,
      barcode: searchByBarcode.value,
      productId: searchByProductId.value,
      productName: searchByProductName.value,
      unitId: searchByUOMId.value,
      zoneId: searchByZoneId.value,
      areaId: searchByAreaId.value,
      subAreaId: searchBySubAreaId.value,
      serialNo: serialProductCode.value,

      searchByCategory: searchByCategoryName.value,
      searchByType: searchByTypeName.value,
      searchBySubType: searchBySubTypeName.value,
      searchByBarcode: searchByBarcodeName.value,
      searchByProductId: searchByProductCodeName.value,
      searchByProductName: searchByProductNameFilter.value,
      searchByUnit: searchByUnitName.value,

      'sortByCategory': sortByCategory.value,
      'sortByType': sortByType.value,
      'sortBySubType': sortBySubType.value,
      'sortByBarcode': sortByBarcode.value,
      'sortByProductId': sortByProductId.value,
      'sortByProductName': sortByProductName.value,
      'sortByUnit': sortByUnit.value,
      'sortByQty': sortByQty.value,
      'sortByTags': sortByTags.value,
      'sortByNonTags': sortByNonTags.value,

      // ... and so on with other parameters
    },
    headers: {
      'accept': '*/*',
      'x-location': `${searchByWareHouseId.value}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  }, {})
    .then(response => {

      products.value = response.data.items
      totalCount.value = response.data.totalCount
      currentPage.value = response.data.page
      totalPage.value = response.data.totalPages
      rowPerPage.value = response.data.perPage

      console.log('[products.value]!!: ', products)
      console.log('Warehouse At StockUpdate :', whereHouseSelectedItem.value)

      // console.log('perPage: ',perPage)
      // console.log('currentPage: ',currentPage)
      // console.log('totalCount: ',totalCount)
      // console.log('totalPages: ',totalPage)

      // console.log('subTypeId',searchBySubTypeId.value)

      
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })
  
}

//------------------------------- Function Get StockUpdate Auto Search -----------------

watch(GetStockUpdate)

//--------------------------------------- Function Pagination --------------------------------------------
// 👉 watching current page
watch(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = products.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = products.value.length + (currentPage.value - 1) * rowPerPage.value

  // console.log('const firstIndex ',firstIndex,'=','products.value.length:'+products.value.length,'?',(currentPage.value - 1)* rowPerPage.value + 1)
  // console.log('const lastIndex ',lastIndex,'=',products.value.length,'+',(currentPage.value - 1),'*',rowPerPage.value)
  // console.log('products.value.length: ',products.value.length)
  
  return `${ firstIndex }-${ lastIndex } of ${ totalCount.value }`
})

// SECTION Checkbox toggle
const selectedRows = ref([])

//----------------------------------- End Function Pagination -----------------------------------------------

///--------------------------------------- FetchItems for Search Box ----------------------------------------------

fetchItemsSearchBy('categories').then(data => {
  itemsSearchByCategoryId.value = data
})

const submitSearchButton = () => {
  GetStockUpdate()
}

//-------------------------- format decimal -------------------

const formatDecimal = decimal => {
  const configsShowDigit = localStorage.getItem('configsShowDigit')
  if (configsShowDigit == 'true') {
    return Math.ceil(decimal)
  } else {
    return decimal
  }
}

/// ----------------------- check config Barcode / Tag ----------------
const nameUser = localStorage.getItem('userCheck')

const checkConfigUser = nameUser => {
  if (nameUser == 'Chutimon') {
    return false
  } else if (nameUser == 'Tamma'){
    return true
  } else {
    return true
  }
}

checkConfigUser(nameUser)

//------------------------ Dialog Image ----------------------------
const isDialogImageVisible = ref(false)
const checkRFID = ref ('')

watchEffect(() =>{
  const checkRFIDUpdate = ref (localStorage.getItem('configsShowRfdi'))
  if(checkRFIDUpdate.value === 'true'){
    console.log('RFID Check True:'+ checkRFIDUpdate.value)
    checkRFID.value = true
  } else if (checkRFIDUpdate.value === 'false') {
    console.log('RFID Check False:'+ checkRFIDUpdate.value)
    checkRFID.value = false
  }
})

const codeProduct = ref('')
const nameProduct = ref('')
const imgProduct = ref('')
const barcodeProduct = ref('')
const categoriesProduct = ref('')
const groupProduct = ref('')
const groupSupProduct = ref('')
const totalProduct = ref('')
const unitNameProduct = ref('')
const detailsProduct = ref('')

const showDialogImage = (code, name, img, barcode, categories, group, groupSup, total, unitName, details) => {
  codeProduct.value = code
  nameProduct.value = name
  imgProduct.value = img
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

const showExpansionDialog = ref(false)

//---------------------------- check Status ---------------------------------

const colorStatus = ref('grey')
const bgStatus = ref('bg-grey')

const checkColorTextStatus = status => {
  if(status === 'Received'){
    return 'bg-green-lighten-4'
  }else if(status === 'Waiting for Receive') {
    return 'bg-yellow-lighten-4' 
  }
}

const checkColorBgStatus = status => {
  if(status === 'Received'){
    return 'text-green'
  }else if(status === 'Waiting for Receive') {
    return 'text-warning' 
  }
}

const statuses = [ 'Aprove', 'Reject', 'Back to Edit']

// ฟังก์ชันสำหรับสุ่มสถานะ
function getRandomStatus() {
  const randomIndex = Math.floor(Math.random() * statuses.length)
  
  return statuses[randomIndex]
}

function getRandomDate(start, end) {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
  const randomDate = new Date(randomTime)
  
  const year = randomDate.getFullYear()
  const month = String(randomDate.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const day = String(randomDate.getDate()).padStart(2, '0')
  
  return `${day}/${month}/${year}`
}

//------------------------------------------ Mock Data --------------------------------

const mockData = ref([
  { no: 1, saleOrderNo: '1100078117', soAttachment: '(attach file)', sapInvoiceNo: 'TIX2406001', payerName: 'TORAY SG', user: '', shipper: '', shipperLocation: '', shippingMark: 'MAT-105T', endUser: '', consignee: '', product: '', lotNumber: 'attach file', qty: '16,000.00', coa: '', freightForwarder: 'LEO', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'SINGAPORE', loadingDate: '4-มิ.ย.-24', etd: '7-มิ.ย.-24', eta: '', deliveryNote: 'attach file', remarkSal: '', remarkWh: 'Shipping complete', remarkLog: '5501354541' },
  { no: 2, saleOrderNo: '1100078116', soAttachment: '', sapInvoiceNo: 'TIX2406002', payerName: 'SCI', user: '', shipper: '', shipperLocation: '', shippingMark: 'OSMORIN DA-50', endUser: '', consignee: '', product: '', lotNumber: '', qty: '14,400.00', coa: '', freightForwarder: 'LEO', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'JAPAN', loadingDate: '6-มิ.ย.-24', etd: '18-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: 'OSMO(1)2405' },
  { no: 3, saleOrderNo: '1100078128', soAttachment: '', sapInvoiceNo: 'TIX2406003', payerName: 'RESONAC', user: '', shipper: '', shipperLocation: '', shippingMark: 'CHEMICLEAN PR-084CT', endUser: '', consignee: '', product: '', lotNumber: '', qty: '5,000.00', coa: '', freightForwarder: 'LEO', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'MALAYSIA', loadingDate: '6-มิ.ย.-24', etd: '10-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: '7400' },
  { no: 4, saleOrderNo: '1100078129', soAttachment: '', sapInvoiceNo: 'TIX2406004', payerName: 'RESONAC', user: '', shipper: '', shipperLocation: '', shippingMark: 'CHEMICLEAN AS-S142T', endUser: '', consignee: '', product: '', lotNumber: '', qty: '15,000.00', coa: '', freightForwarder: 'LEO', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'MALAYSIA', loadingDate: '7-มิ.ย.-24', etd: '10-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: '7400' },
  { no: 5, saleOrderNo: '1100078158', soAttachment: '', sapInvoiceNo: 'TIX2406005', payerName: 'SKK-YOUNGJIN TECH', user: '', shipper: '', shipperLocation: '', shippingMark: 'PELESTAT 6500', endUser: '', consignee: '', product: '', lotNumber: '', qty: '5,000.00', coa: '', freightForwarder: 'BTS', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'SOUTH KOREA', loadingDate: '8-มิ.ย.-24', etd: '19-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: '' },
  { no: 6, saleOrderNo: '1100077998', soAttachment: '', sapInvoiceNo: 'TIX2406006', payerName: 'INABATA PH', user: '', shipper: '', shipperLocation: '', shippingMark: 'SANPRENE BS-4', endUser: '', consignee: '', product: '', lotNumber: '', qty: '32,000.00', coa: '', freightForwarder: 'LEO', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'PHILIPPINES', loadingDate: '9-มิ.ย.-24', etd: '15-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: '' },
  { no: 7, saleOrderNo: '1100078232', soAttachment: '', sapInvoiceNo: 'TIX2406007', payerName: 'SCI', user: '', shipper: '', shipperLocation: '', shippingMark: 'BEAULIGHT LCA-25F', endUser: '', consignee: '', product: '', lotNumber: '', qty: '16,000.00', coa: '', freightForwarder: 'LEO', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'JAPAN', loadingDate: '10-มิ.ย.-24', etd: '22-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: 'BEAU(1)2406 F' },
  { no: 8, saleOrderNo: '1100077971', soAttachment: '', sapInvoiceNo: 'TIX2406008', payerName: 'PT HITECH', user: '', shipper: '', shipperLocation: '', shippingMark: 'SANPRENE IB-967T', endUser: '', consignee: '', product: '', lotNumber: '', qty: '13,600.00', coa: '', freightForwarder: 'LEO', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'INDONESIA', loadingDate: '11-มิ.ย.-24', etd: '15-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: '679' },
  { no: 9, saleOrderNo: '1100077972', soAttachment: '', sapInvoiceNo: 'TIX2406009', payerName: 'PT HITECH', user: '', shipper: '', shipperLocation: '', shippingMark: 'SANPRENE IB-967T', endUser: '', consignee: '', product: '', lotNumber: '', qty: '13,600.00', coa: '', freightForwarder: 'LEO', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'INDONESIA', loadingDate: '11-มิ.ย.-24', etd: '15-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: '680' },
  { no: 10, saleOrderNo: '1100078230', soAttachment: '', sapInvoiceNo: 'TIX2406010', payerName: 'SCI', user: '', shipper: '', shipperLocation: '', shippingMark: 'LEBON CIB GSS', endUser: '', consignee: '', product: '', lotNumber: '', qty: '16,000.00', coa: '', freightForwarder: 'BTS', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'JAPAN', loadingDate: '12-มิ.ย.-24', etd: '26-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: 'LEBO(1)2407' },
  { no: 11, saleOrderNo: '1100078219', soAttachment: '', sapInvoiceNo: 'TIX2406011', payerName: 'SCI', user: '', shipper: '', shipperLocation: '', shippingMark: 'BEAULIGHT LCA-25N', endUser: '', consignee: '', product: '', lotNumber: '', qty: '32,000.00', coa: '', freightForwarder: 'BTS', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'JAPAN', loadingDate: '17-มิ.ย.-24', etd: '26-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: 'BEAU(1)2407 N' },
  { no: 12, saleOrderNo: '1100078244', soAttachment: '', sapInvoiceNo: 'TIX2406012', payerName: 'SKK- G-FAM', user: '', shipper: '', shipperLocation: '', shippingMark: 'PELESTAT 6500', endUser: '', consignee: '', product: '', lotNumber: '', qty: '3,000.00', coa: '', freightForwarder: 'LCL', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'SOUTH KOREA', loadingDate: '19-มิ.ย.-24', etd: '29-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: '' },
  { no: 13, saleOrderNo: '1100078254', soAttachment: '', sapInvoiceNo: 'TIX2406013', payerName: 'PT HITECH', user: '', shipper: '', shipperLocation: '', shippingMark: 'SANPRENE IB-967T', endUser: '', consignee: '', product: '', lotNumber: '', qty: '13,600.00', coa: '', freightForwarder: 'LEO', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'INDONESIA', loadingDate: '19-มิ.ย.-24', etd: '22-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: '1042' },
  { no: 14, saleOrderNo: '1100078255', soAttachment: '', sapInvoiceNo: 'TIX2406014', payerName: 'PT HITECH', user: '', shipper: '', shipperLocation: '', shippingMark: 'SANPRENE IB-967T', endUser: '', consignee: '', product: '', lotNumber: '', qty: '13,600.00', coa: '', freightForwarder: 'LEO', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'INDONESIA', loadingDate: '19-มิ.ย.-24', etd: '22-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: '1043' },
  { no: 15, saleOrderNo: '1100078256', soAttachment: '', sapInvoiceNo: 'TIX2406015', payerName: 'PT HITECH', user: '', shipper: '', shipperLocation: '', shippingMark: 'SANPRENE IB-967T', endUser: '', consignee: '', product: '', lotNumber: '', qty: '13,600.00', coa: '', freightForwarder: 'LEO', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'INDONESIA', loadingDate: '19-มิ.ย.-24', etd: '22-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: '1044' },
  { no: 16, saleOrderNo: '1100078240', soAttachment: '', sapInvoiceNo: 'TIX2406016', payerName: 'KURITA - MY', user: '', shipper: '', shipperLocation: '', shippingMark: 'KBC-661', endUser: '', consignee: '', product: '', lotNumber: '', qty: '16,800.00', coa: '', freightForwarder: 'LEO', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'MALAYSIA', loadingDate: '21-มิ.ย.-24', etd: '1-ก.ค.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: 'WM191' },
  { no: 17, saleOrderNo: '1100078227', soAttachment: '', sapInvoiceNo: 'TIX2406017', payerName: 'AGE D\'OR INDO', user: '', shipper: '', shipperLocation: '', shippingMark: 'SN DISPERSANT 5040', endUser: '', consignee: '', product: '', lotNumber: '', qty: '20,000.00', coa: '', freightForwarder: 'BTS', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'INDONESIA', loadingDate: '23-มิ.ย.-24', etd: '29-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: 'PO-240309' },
  { no: 18, saleOrderNo: '1100078294', soAttachment: '', sapInvoiceNo: 'TIX2406018', payerName: 'SCI', user: '', shipper: '', shipperLocation: '', shippingMark: 'CHEMICLEAN PR-029', endUser: '', consignee: '', product: '', lotNumber: '', qty: '10,000.00', coa: '', freightForwarder: 'LEO', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'JAPAN', loadingDate: '25-มิ.ย.-24', etd: '5-ก.ค.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: 'PR29(2)2406' },
  { no: 19, saleOrderNo: '1100078284', soAttachment: '', sapInvoiceNo: 'TIX2406019', payerName: 'SCI', user: '', shipper: '', shipperLocation: '', shippingMark: 'BEAULIGHT LCA-25F', endUser: '', consignee: '', product: '', lotNumber: '', qty: '16,000.00', coa: '', freightForwarder: 'LEO', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'JAPAN', loadingDate: '25-มิ.ย.-24', etd: '5-ก.ค.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: 'BEAU(1)2407 F' },
  { no: 20, saleOrderNo: '1100078361', soAttachment: '', sapInvoiceNo: 'TIX2406020', payerName: 'SCST', user: '', shipper: '', shipperLocation: '', shippingMark: 'PELECTRON PVL, PELESTAT 6500, PELESTAT 230', endUser: '', consignee: '', product: '', lotNumber: '', qty: '11,650.00', coa: '', freightForwarder: 'BTS', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'CHINA', loadingDate: '26-มิ.ย.-24', etd: '7-ก.ค.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: 'SCST240617ZX1' },
  { no: 21, saleOrderNo: '1100078457', soAttachment: '', sapInvoiceNo: 'TIX2406021', payerName: 'SANYO - TAIWAN', user: '', shipper: '', shipperLocation: '', shippingMark: 'PELECTRON PVL', endUser: '', consignee: '', product: '', lotNumber: '', qty: '40.00', coa: '', freightForwarder: '', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'TAIWAN', loadingDate: '28-มิ.ย.-24', etd: '1-ก.ค.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: 'DHL' },
  { no: 22, saleOrderNo: '1100078229', soAttachment: '', sapInvoiceNo: 'TIX2406022', payerName: 'AGE D\'OR VN - HCMC', user: '', shipper: '', shipperLocation: '', shippingMark: 'SN DISPERSANT 5040', endUser: '', consignee: '', product: '', lotNumber: '', qty: '20,000.00', coa: '', freightForwarder: 'LEO', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'VIETNAM', loadingDate: '28-มิ.ย.-24', etd: '30-มิ.ย.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: 'PO-240280' },
  { no: 23, saleOrderNo: '1100078356', soAttachment: '', sapInvoiceNo: 'TIX2406023', payerName: 'SCI', user: '', shipper: '', shipperLocation: '', shippingMark: 'BEAULIGHT LCA-30D', endUser: '', consignee: '', product: '', lotNumber: '', qty: '16,000.00', coa: '', freightForwarder: 'LEO', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'JAPAN', loadingDate: '30-มิ.ย.-24', etd: '11-ก.ค.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: 'BE30D(1)2407' },
  { no: 24, saleOrderNo: '1100078454', soAttachment: '', sapInvoiceNo: 'TIX2406024', payerName: 'SKK-SAN NOPCO', user: '', shipper: '', shipperLocation: '', shippingMark: 'SND-01', endUser: '', consignee: '', product: '', lotNumber: '', qty: '500.00', coa: '', freightForwarder: 'LCL', carrier: '', vesselName: '', truck: '', truckFee: '', doEx: '', country: 'SOUTH KOREA', loadingDate: '30-มิ.ย.-24', etd: '9-ก.ค.-24', eta: '', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: '' },
])

const accountAmin = ref (false)
const accountViewerKK = ref (false)
const accountINSP = ref (false)
const accountSALLOG = ref (false)
const accountWH = ref (false)
const accountAll = ref (true)

const setAccount = role => {
  accountAmin.value = false
  accountViewerKK.value = false
  accountINSP.value = false
  accountSALLOG.value = false
  accountWH.value = false
  accountAll.value = false

  if (role === 'Amin') {
    accountAmin.value = true
    accountViewerKK.value = false
    accountINSP.value = false
    accountSALLOG.value = false
    accountWH.value = false
    accountAll.value = false
  } else if (role === 'ViewerKK') {
    accountAmin.value = false
    accountViewerKK.value = true
    accountINSP.value = false
    accountSALLOG.value = false
    accountWH.value = false
    accountAll.value = false
  } else if (role === 'INSP') {
    accountAmin.value = false
    accountViewerKK.value = false
    accountINSP.value = true
    accountSALLOG.value = false
    accountWH.value = false
    accountAll.value = false
  } else if (role === 'SALLOG') {
    accountAmin.value = false
    accountViewerKK.value = false
    accountINSP.value = false
    accountSALLOG.value = true
    accountWH.value = false
    accountAll.value = false
  } else if (role === 'WH') {
    accountAmin.value = false
    accountViewerKK.value = false
    accountINSP.value = false
    accountSALLOG.value = false
    accountWH.value = true
    accountAll.value = false
  } else if (role === 'All') {
    accountAmin.value = false
    accountViewerKK.value = false
    accountINSP.value = false
    accountSALLOG.value = false
    accountWH.value = false
    accountAll.value = true
  }

  console.log('Switch Acc', accountAmin.value, accountViewerKK.value, accountINSP.value, accountSALLOG.value, accountWH.value, accountAll.value)

  // สามารถเพิ่มเงื่อนไขสำหรับ role อื่นๆ ได้ที่นี่
}

//-------------------
//----- Rune
const rules = [v => v.length <= 150 || 'Max 25 characters']

//--------- new expention
const panel = ref([])

///---------------- Dialog 
const isDialogVisiblePrintTruck = ref(false)
</script>

<template>
  <!-- Title Page -->

  <div>
    <VCard>
      <VCardTitle>
        <div class="d-flex align-center">
          <VRow class="d-flex align-center">
            <VCol cols="2">
              <IconBtn
                class="cursor-pointer"
                color="#FFFFFF"
                :to="{ name: 'dashboards-main',
                }"
              >
                <VIcon
                  size="30"
                  icon="ri-close-circle-fill"
                  color="#000000"
                />
              </IconBtn>
            </VCol>
            <VCol
              cols="8"
              class="text-center"
            >
              <div>
                <span
                  style="font-size: 18px;"
                  class="text-center"
                >{{ $t('Shipment Plan sss') }}</span>
              </div>
            </VCol>
            <VCol
              cols="2"
              class="d-flex justify-end"
            >
              <VBtn
                variant="flat"
                @click="panel = panel.length ? [] : ['filter']"
              >
                <VIcon icon="ri-equalizer-line" />
              </VBtn>
            </VCol>
          </VRow>
        </div>
      </VCardTitle>
    </VCard>
  </div>

  <section>
    <div>
      <VExpansionPanels
        v-model="panel"
        multiple
      >
        <VExpansionPanel value="filter">
          <VExpansionPanelText>
            <VForm @submit.prevent="submitSearchButton">
              <!-- Barcode | Product code | Product Name | Button Export -->
              <VRow>
                <!-- 👉 Select Barcode -->
                <VCol
                  cols="12"
                  lg="3"
                  sm="6"
                  class="py-1"
                >
                  <!-- 👉 Search Product code -->
                  <VTextField
                    v-model="searchByBarcode"
                    :label="$t('Barcode')"
                    type="Barcode"
                    density="compact"
                    append-inner-icon="mdi-barcode-scan"
                  />
                </VCol>

                <!-- 👉 Select Product code -->
                <VCol
                  cols="12"
                  lg="3"
                  sm="6"
                  class="py-1"
                >
                  <VTextField
                    v-model="searchByProductId"
                    :label="$t('Product Code')"
                    type="Product Code"
                    density="compact"
                  />
                </VCol>

                <!-- 👉 Select Product Name -->
                <VCol
                  cols="12"
                  lg="3"
                  sm="6"
                  class="py-1"
                >
                  <VTextField
                    v-model="searchByProductName"
                    :label="$t('Product Name')"
                    type="Product Name"
                    density="compact"
                  />
                </VCol>

                <!-- 👉 Button Search and Export -->
                <VCol
                  cols="6"
                  class="py-1 d-flex"
                >
                  <VRow>
                    <VCol cols="4">
                      <VBtn
                        color="red"
                        height="100%"
                        width="100%"
                        density="compact"
                        @click="clearModel"
                      >
                        {{ $t('Clear') }}
                      </VBtn>
                    </VCol>
                    <VCol cols="4">
                      <VBtn
                        height="100%"
                        width="100%"
                        color="primary"
                        density="compact"
                        prepend-icon="ri-printer-fill"
                        class="mx-0"
                        
                        @click="isDialogPrintLabelVisible = true"
                      >
                        {{ $t('Search') }}
                      </VBtn>
                    </VCol>
                  </VRow>
                </VCol>
              </VRow>
            </VForm>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </div>
  </section>

  <!-- Dialog Image -->
  <section>
    <VDialog
      v-model="isDialogImageVisible"
      persistent
      class=""
      max-width="500"
    >
      <VCard class="">
        <VCardTitle class="d-flex justify-space-between bg-primary">
          <div>
            <span class="text-white">{{ $t('Image Product') }}</span>
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
          cover
        />
        <VCardActions
          class="bg-primary"
          style="width: 100%; padding: 0;"
        >
          <VBtn
            color="red-green-1"
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
                    }}:&nbsp;</span>&nbsp;{{ barcodeProduct }}<br>
                  </VCol>
                  <VCol
                    cols="12"
                    lg="6"
                  >
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Categories")
                    }}:&nbsp;</span>&nbsp;{{ categoriesProduct }}<br>
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Group")
                    }}:&nbsp;</span>&nbsp;{{ groupProduct }}<br>
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Sup Group")
                    }}:&nbsp;</span>&nbsp;{{ groupSupProduct }}<br>
                    <span style="font-size: large; font-weight: 900;">{{
                      $t("Total")
                    }}:&nbsp;</span>&nbsp;<span v-if="totalProduct">{{ (formatDecimal(totalProduct)).toLocaleString('en-US') }} {{ unitNameProduct }}<br><br></span>
                  </VCol>
                </VRow>
                <span style="font-size: large; font-weight: 900;">{{
                  $t("Details ")
                }} :</span>{{ detailsProduct }}
              </div>
            </VCardText>
          </div>
        </VExpandTransition>
      </VCard>
    </VDialog>
  </section>

  <div class="mt-4">
    <VCard>
      <VCardText>
        <VRow>
          <VCol cols="6">
            <VBtn
              color="yellow"
              @click="setAccount('Amin')"
            >
              Admin
            </VBtn>
            <VBtn
              color="blue"
              @click="setAccount('ViewerKK')"
            >
              ViewerKK
            </VBtn>
            <VBtn
              color="brown"
              @click="setAccount('INSP')"
            >
              INSP
            </VBtn>
            <VBtn
              color="light-blue"
              @click="setAccount('SALLOG')"
            >
              SAL/LOG
            </VBtn>
            <VBtn
              color="deep-purple"
              @click="setAccount('WH')"
            >
              WH
            </VBtn>
            <VBtn @click="setAccount('All')">
              All
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>

  <section>
    <VDialog
      v-model="isDialogVisiblePrintTruck"
      width="100%"
    >
      <!-- Dialog Content -->
      <VCard title="Print Truck order">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogVisiblePrintTruck = false"
        />

        <VCardText style="overflow-x: auto;">
          <table class="custom-table">
            <thead>
              <tr>
                <th
                  colspan="12"
                  class="text-center"
                >
                  SANYO KASEI (THAILAND) LTD.
                </th>
              </tr>
              <tr>
                <th
                  colspan="12"
                  class="text-center"
                >
                  Rojana Industrial Park-Rayong, 5/5 Moo 11 T. Nongbua, A.Bankhai, Rayong 21120
                </th>
              </tr>
              <tr>
                <th
                  colspan="12"
                  class="text-center"
                >
                  Tel. : (038) 627-0505 Fax. (038 946-072)
                </th>
              </tr>
              <tr>
                <th
                  colspan="12"
                  class="text-center"
                >
                  ใบสั่งรถขนส่ง / Truck order
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th colspan="4">
                  วันที่ (Date):
                </th>
                <td
                  colspan="8"
                  class="text-center"
                >
                  24/07/2024
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  เลขที่ใบสั่งงานรถขนส่ง (Truck order no)
                </th>
                <th colspan="8">
                  <VTextField
                    style="min-width: 250px;"
                    density="compact"
                    class="text-center"
                  >
                    <template #prepend>
                      Running Number:
                    </template>
                  </VTextField>
                </th>
              </tr>
              <tr>
                <th colspan="4">
                  เลขที่อ้างอิง (Ref SO No.)
                </th>
                <td
                  colspan="8"
                  class="text-center"
                >
                  Shipment plan
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  ชื่อบริษัท (Company Name)
                </th>
                <th colspan="8">
                  <VAutocomplete
                    class="text-center"
                    density="compact"
                    label="Company Name"
                    :items="items"
                    placeholder="Select State"
                  />
                </th>
              </tr>
              <tr>
                <th colspan="4">
                  ที่อยู่ (Address)
                </th>
                <td
                  colspan="8"
                  class="text-center"
                >
                  LEO Global Logistics Public Company Limited 251-251/1 Soi Pakdee, Rama 3 Road, Bangkorlaem, Bangkok 10120 Thailand
                </td>
              </tr>
              <tr>
                <th colspan="4" />
                <th
                  colspan="8"
                  class="text-center"
                />
              </tr>
              <tr>
                <th colspan="4">
                  บริษัทขนส่ง (Transportation Company Name)
                </th>
                <th
                  colspan="8"
                  class="text-center"
                >
                  <VAutocomplete
                    class="text-center"
                    density="compact"
                    label="Transportation Company Name"
                    :items="items"
                    placeholder="Select State"
                  />
                </th>
              </tr>
              <tr>
                <th colspan="4">
                  ประเภทรถ (Truck type)
                </th>
                <th
                  colspan="8"
                  class="text-center"
                >
                  <VAutocomplete
                    class="text-center"
                    density="compact"
                    label="Truck type"
                    :items="items"
                    placeholder="Select State"
                  />
                </th>
              </tr>
              <tr>
                <th colspan="4">
                  ทะเบียนรถ (Truck license)
                </th>
                <th
                  colspan="8"
                  class="text-center"
                />
              </tr>
              <tr>
                <th colspan="4">
                  ชื่อพนักงานขับรถ (Drive name)
                </th>
                <td
                  colspan="8"
                  class="text-center"
                >
                  MR. TOSAPOL
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  เลขที่อ้างอิง (Ref SO No.)
                </th>
                <td
                  colspan="8"
                  class="text-center"
                >
                  Shipment plan
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  เบอร์ติดต่อ (Tel)    
                </th>
                <td
                  colspan="8"
                  class="text-center"
                >
                  084-3878325
                </td>
              </tr>
              <tr>
                <th colspan="4">
                  หมายเหตุ (Remark) 
                </th>
                <th
                  colspan="8"
                  class="text-center"
                />
              </tr>
            </tbody>
          </table>
          <table class="custom-table">
            <tr>
              <th colspan="4">
                <VTextField
                  
                  density="compact"
                  class="text-center"
                >
                  <template #label>
                    พนักงานขับรถ / Drivers By
                  </template>
                </VTextField>
              </th>
              <th colspan="4">
                <VTextField
                  
                  density="compact"
                  class="text-center"
                >
                  <template #label>
                    ผู้สั้งการ / Oder By
                  </template>
                </VTextField>
              </th>
              <th colspan="4">
                <VTextField
                  
                  density="compact"
                  class="text-center"
                >
                  <template #label>
                    ผู้อนุมัติ / Authorized By
                  </template>
                </VTextField>
              </th>
            </tr>
            <tr>
              <th colspan="4">
                <VueDatePicker
                  v-model="dateSupervisor"
                  :max-date="new Date()"
                  :enable-time-picker="false"
                />
              </th>
              <th colspan="4">
                <VueDatePicker
                  v-model="dateSupervisor"
                  :max-date="new Date()"
                  :enable-time-picker="false"
                />
              </th>
              <th colspan="4">
                <VueDatePicker
                  v-model="dateSupervisor"
                  :max-date="new Date()"
                  :enable-time-picker="false"
                />
              </th>
            </tr>
          </table>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            color="warning"
            @click="isDialogVisiblePrintTruck = false"
          >
            <VIcon
              start
              icon="ri-printer-fill"
            />
            Print
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <!-- ----------             Product  SKT                                  ------------------------------------ -->
  <section>
    <VCard class="mt-6">
      <VTable class="text-no-wrap table-header-bg rounded-0">
        <!-- 👉 table head -->
        <thead>
          <tr>
            <th>No.</th>
            <th v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll">
              Sale Order No.
            </th>
            <th v-if="accountAmin || accountViewerKK || accountAll">
              SO attachment
            </th>
            <th v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll">
              SAP Invoice no
            </th>
            <th v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll">
              Payer Name
            </th>
            <th v-if="accountAmin || accountViewerKK || accountSALLOG || accountINSP || accountAll">
              User
            </th>
            <th v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll">
              Shipper
            </th>
            <th v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll">
              Shipper location
            </th>
            <th v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll">
              Shipping mark
            </th>
            <th v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll">
              End user
            </th>
            <th v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll">
              Consignee
            </th>
            <th v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll">
              Product
            </th>
            <th v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll">
              Lot number
            </th>
            <th v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll">
              Qty (KG)
            </th>
            <th v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll">
              COA
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="bg-green-lighten-3"
            >
              <span class="text-black">Freight forwarder</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="bg-green-lighten-3"
            >
              <span class="text-black">Carrier</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="bg-green-lighten-3"
            >
              <span class="text-black">Vessel name</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="bg-yellow-lighten-3"
            >
              <span class="text-black">Vovy</span>
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="bg-green-lighten-3"
            >
              Truck
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="bg-yellow-lighten-3"
            >
              Truck Reserving Number
            </th>
            <th v-if="accountAmin || accountViewerKK || accountWH || accountAll">
              Truck fee
            </th>
            <th
              v-if="accountAmin || accountViewerKK || accountWH || accountAll"
              class="text-center"
            >
              Action Truck
            </th>
            <th v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll">
              DO/EX
            </th>
            <th v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll">
              Country
            </th>
            <th v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll">
              Loading date (DD/MM/YYYY)
            </th>
            <th v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll">
              ETD
            </th>
            <th v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll">
              ETA
            </th>
            <th v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll">
              Delivery note
            </th>
            <th v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll">
              Remark (SAL)
            </th>
            <th v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll">
              Remark (WH)
            </th>
            <th v-if="accountAmin || accountViewerKK || accountWH || accountAll">
              Remark (LOG)
            </th>
            <th v-if="accountAmin || accountViewerKK || accountWH || accountAll">
              Status
            </th>
            <th v-if="accountAmin || accountViewerKK || accountWH || accountAll">
              Status Date
            </th>
            <th v-if="accountAmin || accountViewerKK || accountWH || accountAll">
              By Who
            </th>
            <th>
              Action (LOG)
            </th>
          </tr>
        </thead>
        <!-- 👉 table body -->
        <tbody>
          <tr
            v-for="(product, index) in mockData"
            :key="index"
          >
            <!-- 👉 Ordinal Number -->
            <td class="text-center px-1">
              {{ index + 1 }}
            </td>

            <!-- 👉 Product categories -->
            <td
              v-if="false"
              class="text-center px-1"
              :class="checkColorTextStatus(product.status)"
            >
              <span :class="checkColorBgStatus(product.status)">{{ product.status }}</span>
            </td>

            <!-- 👉 Secondary product categories -->
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ product.saleOrderNo }}
            </td>

            <!-- 👉 Sub product categories -->
            <td
              v-if="accountAmin || accountViewerKK || accountAll"
              class="text-start px-1"
            >
              {{ product.soAttachment }}
            </td>

            <!-- 👉 Product code -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ product.sapInvoiceNo }}
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="text-start px-1"
            >
              {{ (product.payerName) }}
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountINSP || accountAll"
              class="text-start px-1"
            >
              {{ (product.user) }}
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ (product.shipper) }}
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ (product.shipperLocation) }}
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ (product.shippingMark) }}
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="text-end px-1"
            >
              {{ product.endUser }}
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="text-start px-1"
            >
              {{ (product.consignee) }}
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ (product.product) }}
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ (product.lotNumber) }}
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ (product.qty) }}
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ (product.coa) }}
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="text-start px-1"
            >
              {{ (product.truck) }}
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="text-start px-1"
            >
              {{ (product.carrier) }}
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="text-start px-1"
            >
              {{ (product.vesselName) }}
            </td>
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="text-start px-1"
            >
              <VTextField
                density="compact"
                style=" min-width: 150px;"
              />
            </td>


            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ (product.freightForwarder) }}
            </td>

            <td
              v-if="accountAmin || accountViewerKK || accountWH || accountAll"
              class="text-center px-1"
            >
              49
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountWH || accountAll"
              class="text-start px-1"
            >
              <VTextField
                v-model="product.truckFee"
                density="compact"
                style=" min-width: 150px;"
              />
            </td>

            <td
              v-if="accountAmin || accountViewerKK || accountWH || accountAll"
              class="text-start px-1"
            >
              <VBtn
                color="orange"
                class="mx-2"
                @click="isDialogVisiblePrintTruck = true"
              >
                Print
              </VBtn>
              <VBtn color="blue-accent-1">
                Attach file
              </VBtn>
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ (product.doEx) }}
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ (product.country) }}
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ (product.eta) }}
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ (product.loadingDate) }}
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ (product.etd) }}
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="text-start px-1"
            >
              <VBtn color="blue-accent-1">
                Attach file
              </VBtn>
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="text-start px-1"
            >
              <VTextarea
                v-model="product.remarkSa"
                class="pa-2"
                label="Remark (SAL)"
                style="min-width: 250px;"
                :rules="rules"
                rows="2"
                clearable
                placeholder="Placeholder Text"
              />
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountAll"
              class="text-start px-1"
            >
              <VTextarea
                v-model="product.remarkWh"
                class="pa-2"
                label="Remark (WH)"
                style="min-width: 250px;"
                :rules="rules"
                rows="2"
                clearable
                placeholder="Placeholder Text"
              />
            </td>

            <!-- 👉 Product Name -->
            <td
              v-if="accountAmin || accountViewerKK || accountWH || accountAll"
              class="text-start px-1"
            >
              <VTextarea
                v-model="product.remarkLog"
                class="pa-2"
                label="Remark (LOG)"
                style="min-width: 250px;"
                :rules="rules"
                rows="2"
                clearable
                placeholder="Placeholder Text"
              />
            </td>
            <td
              v-if="accountAmin || accountViewerKK || accountWH || accountAll"
              class="text-start px-1"
            >
              <span v-if="getRandomStatus() === 'Aprove'">
                <VChip color="success">{{ getRandomStatus() }}</VChip>
              </span>
              <span v-else-if="getRandomStatus() === 'Back to Edit'">
                <VChip color="warning">{{ getRandomStatus() }}</VChip>
              </span>
              <span v-else-if="getRandomStatus() === 'Reject'">
                <VChip color="error">{{ getRandomStatus() }}</VChip>
              </span>
            </td>
            <td
              v-if="accountAmin || accountViewerKK || accountWH || accountAll"
              class="text-start px-1"
            >
              {{ getRandomDate('2023/01/01', '2023/12/31') }}
            </td>
            <td
              v-if="accountAmin || accountViewerKK || accountWH || accountAll"
              class="text-start px-1"
            />

            <!-- 👉 Actions -->
            <td
              style="width: 8rem;"
              class="text-center px-1"
            >
              <RouterLink
                v-if="false"
                :to="{ 
                  name: 'inventory-stockUpdateByProduct-view-id', 
                  params: { id: index }, 
                  query: { productId: product.productId ,
                           UnitId: product.unitId,
                           warehouseStock: searchByWareHouseId ,
                           serialCode: serialProductCode,
                  }, 
                }"
              >
                <VIcon icon="mdi-eye-outline" />
              </RouterLink>
              
              <VBtn color="warning">
                Save Draft
              </VBtn>
              <VBtn class="mx-2">
                Submit
              </VBtn>
              <VBtn color="info">
                Action
              </VBtn>
            </td>
          </tr>
        </tbody>
        <VDivider />
        <tbody>
          <tr>
            <td class="bg-green-lighten-5">
              TOTAL
            </td>
            <td
              v-if="accountAmin || accountViewerKK || accountINSP || accountSALLOG || accountWH || accountAll"
              class="bg-green-lighten-5"
            >
              18 INVOICES
            </td>
            <td
              v-if="accountAmin || accountViewerKK || accountAll"
              class="bg-green-lighten-5"
            />
            <td
              v-if="accountAmin || accountViewerKK || accountSALLOG || accountWH || accountAll"
              class="bg-green-lighten-5"
            >
              18 INVOICES
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
    </VCard>
  </section>

  <!-- Footer -->
  <section
    section
    class="fixed-bottom"
  >
    <VCard>
      <VCardText>
        <VAlert
          color="red-lighten-3"
          style="font-size: 20px;"
        >
          (Demo) Shipment  - Version : 2.1  - Data 24 Row
        </VAlert>
      </VCardText>
    </VCard>
  </section>
</template>

<style lang="scss">
.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}

// Hover For Image Product
.image-transition {
  transition: inline-size 0.2s, inline-size 0.2s;
}

.fixed-bottom {
  position: fixed;
  justify-content: center;
  inline-size: 95%;
  inset-block-end: 0;
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
}

.custom-table th,
.custom-table td {
  padding: 8px;
  text-align: start;
}

.custom-table td {
  font-weight: 400;
}

.header {
  justify-content: space-between;
  font-weight: bold;
  text-align: center;
}
</style>

