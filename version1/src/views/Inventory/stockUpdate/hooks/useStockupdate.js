import { urlApi } from '@/api'
import axiosIns from '@axios'
import { useToast } from "vue-toastification" //---------------- Import Toast alert

export const useStockupdate = (whereHouse, accessTokenAtStore) => {


  const products = ref([]) //---------------- variable for get All Product From X-Location(Where House) *****
    
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
    
  //----- Search Filter Icon Header Table[Product Category, Group, Sub Group, Barcode, Product Category Code, Product Name]
  const menuCategory= ref( false)
  const menuGroup = ref( false)
  const menuSubGroup = ref( false)
  const menuBarcode = ref( false)
  const menuProductCode = ref( false)
  const menuProductName = ref( false)
  const menuUoM = ref( false)
    
  //------------------------ item ID for search ------------------------------
  const itemsSearchByCategoryId = ref([])
  const typeItemsSearchById = ref([])
  const subTypeItemsSearchById = ref([])
  const itemsSearchByUOMId = ref([])
  const wareHouseItemsSearchById = ref([])
  const zoneItemsSearchById = ref([])
  const areaItemsSearchById = ref([])
  const subAreaItemsSearchById = ref([])
    
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

  //----------------------  Variable for Pagination -------------------------------------
  const totalCount = ref(0)
  const currentPage = ref(1)
  const rowPerPage = ref(10)

  const totalPage = computed(() => {
    return Math.ceil(totalCount.value / rowPerPage.value)
  })

  //----------------------- Sorting --------------------------------
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

  const serialProductCode = ref(null)

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

  const GetStockUpdate = async () => {

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
        'sortByProductId': sortByProductId.value || 'asc',
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

        products.value = response.data.items.map((item, index) => {
          return {
            ...item,
            noItem: (response.data.page - 1) * response.data.perPage + index + 1,
          }
        })

        totalCount.value = response.data.totalCount
        currentPage.value = response.data.page

        rowPerPage.value = response.data.perPage
      
      })
      .catch(error => {
      // Handle errors
        console.error('Error:', error)
      })
  
  }

  const GetStockUpdateSummary = async () => {
  
    // console.log('searchByCategoryName: ',searchByCategoryName)
    axiosIns.get(`${urlApi.value}/api/v1/StockUpdate/byLot?page=`+currentPage.value+`&perPage=`+rowPerPage.value, {
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
  
        // searchByCategory: searchByCategoryId.value,
        // searchByType: searchByTypeId.value,
        // searchBySubType: searchBySubTypeId.value,
        // searchByBarcode: searchByBarcode.value,
        // searchByProductId: searchByProductId.value,
        // searchByProductName: searchByProductName.value,
        
  
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
  
        // totalPage.value = response.data.totalCount
        rowPerPage.value = response.data.perPage
  
      })
      .catch(error => {
        // Handle errors
        console.error('Error:', error)
      })
    
  }

  const GetStockUpdateDetails = async () => {
  
    // console.log('searchByCategoryName: ',searchByCategoryName)
    axiosIns.get(`${urlApi.value}/api/v1/StockUpdate/byLotBatch?page=`+currentPage.value+`&perPage=`+rowPerPage.value, {
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
  
        // totalPage.value = response.data.totalCount
        rowPerPage.value = response.data.perPage

      })
      .catch(error => {
        // Handle errors
        console.error('Error:', error)
      })
    
  }

  const stockUpdateExcel = () => {
    const toast = useToast()

    toast.info("Exporting Excel...", { timeout: 1000 })

    axiosIns.post(`${urlApi.value}/api/v1/StockUpdate/Excel`, {}, {
      headers: {
        'accept': '*/*',
        'x-location': `${whereHouse}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
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
        'sortByProductId': sortByProductId.value || 'asc',
        'sortByProductName': sortByProductName.value,
        'sortByUnit': sortByUnit.value,
        'sortByQty': sortByQty.value,
        'sortByTags': sortByTags.value,
        'sortByNonTags': sortByNonTags.value,

      // ... and so on with other parameters
      },
      responseType: 'blob',
    })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]))

        const currentDate = new Date()
        const year = currentDate.getFullYear()
        const threshold = 2500
        const fileYear = year > threshold ? year - 543 : year

        const dateString = currentDate.toISOString().slice(0, 10).replace(/-/g, '').replace(year.toString(), fileYear.toString())
        const fileName = `stock_update_Tag_${dateString}.xlsx`

        const link = document.createElement('a')

        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()

        window.URL.revokeObjectURL(url)

        // ✅ แจ้งผู้ใช้ว่าโหลดสำเร็จ
        toast.success("Export successful!")
      })
      .catch(error => {
        console.error('Error:', error)
        toast.error("Export failed. Please try again.")
      })
  }

  const stockUpdateExcelSummary = () => {
    const toast = useToast()
  
    toast.info("Exporting Excel...", { timeout: 1000 })
  
    axiosIns.post(`${urlApi.value}/api/v1/StockUpdate/ByLot/Excel`, {}, {
      headers: {
        'accept': '*/*',
        'x-location': `${whereHouse}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
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
        'sortByProductId': sortByProductId.value || 'asc',
        'sortByProductName': sortByProductName.value,
        'sortByUnit': sortByUnit.value,
        'sortByQty': sortByQty.value,
        'sortByTags': sortByTags.value,
        'sortByNonTags': sortByNonTags.value,
  
        // ... and so on with other parameters
      },
      responseType: 'blob',
    })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
  
        const currentDate = new Date()
        const year = currentDate.getFullYear()
        const threshold = 2500
        const fileYear = year > threshold ? year - 543 : year
  
        const dateString = currentDate.toISOString().slice(0, 10).replace(/-/g, '').replace(year.toString(), fileYear.toString())
        const fileName = `stock_update_Tag_${dateString}.xlsx`
  
        const link = document.createElement('a')
  
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
  
        window.URL.revokeObjectURL(url)
  
        // ✅ แจ้งผู้ใช้ว่าโหลดสำเร็จ
        toast.success("Export successful!")
      })
      .catch(error => {
        console.error('Error:', error)
        toast.error("Export failed. Please try again.")
      })
  }

  const stockUpdateExcelDetails = () => {
    const toast = useToast()
  
    toast.info("Exporting Excel...", { timeout: 1000 })
  
    axiosIns.post(`${urlApi.value}/api/v1/StockUpdate/ByLotBatch/Excel`, {}, {
      headers: {
        'accept': '*/*',
        'x-location': `${whereHouse}`,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
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
        'sortByProductId': sortByProductId.value || 'asc',
        'sortByProductName': sortByProductName.value,
        'sortByUnit': sortByUnit.value,
        'sortByQty': sortByQty.value,
        'sortByTags': sortByTags.value,
        'sortByNonTags': sortByNonTags.value,
  
        // ... and so on with other parameters
      },
      responseType: 'blob',
    })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
  
        const currentDate = new Date()
        const year = currentDate.getFullYear()
        const threshold = 2500
        const fileYear = year > threshold ? year - 543 : year
  
        const dateString = currentDate.toISOString().slice(0, 10).replace(/-/g, '').replace(year.toString(), fileYear.toString())
        const fileName = `stock_update_Tag_${dateString}.xlsx`
  
        const link = document.createElement('a')
  
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
  
        window.URL.revokeObjectURL(url)
  
        // ✅ แจ้งผู้ใช้ว่าโหลดสำเร็จ
        toast.success("Export successful!")
      })
      .catch(error => {
        console.error('Error:', error)
        toast.error("Export failed. Please try again.")
      })
  }
  

  //----------------------------------- Function Reset search Key word ---------------
  const resetSearchKey = () => {
    searchByCategoryName.value = ('')
    searchByTypeName.value = ('')
    searchBySubTypeName.value = ('')
    searchByBarcodeName.value = ('')
    searchByProductCodeName.value = ('')
    searchByProductNameFilter.value = ('')
    searchByUnitName.value = ('')
  }

  return {
    products,

    searchByCategoryId,
    searchByTypeId,
    searchBySubTypeId,
    searchByBarcode,
    searchByProductId,
    searchByProductName,
    searchByUOMId,
    searchByWareHouseId,
    searchByZoneId,
    searchByAreaId,
    searchBySubAreaId,
    searchByCategoryName,
    searchByTypeName,
    searchBySubTypeName,
    searchByBarcodeName,
    searchByProductCodeName,
    searchByProductNameFilter,
    searchByUnitName,
    menuCategory,
    menuGroup,
    menuSubGroup,
    menuBarcode,
    menuProductCode,
    menuProductName,
    menuUoM,
    itemsSearchByCategoryId,
    typeItemsSearchById,
    subTypeItemsSearchById,
    itemsSearchByUOMId,
    wareHouseItemsSearchById,
    zoneItemsSearchById,
    areaItemsSearchById,
    subAreaItemsSearchById,
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

    serialProductCode,

    totalCount,
    currentPage,
    rowPerPage,
    totalPage,

    GetStockUpdate,
    GetStockUpdateSummary,
    GetStockUpdateDetails,
    resetSearchKey,
    clearModel,
    toggleSortType,
    stockUpdateExcel,
    stockUpdateExcelSummary,
    stockUpdateExcelDetails,
  }
}
