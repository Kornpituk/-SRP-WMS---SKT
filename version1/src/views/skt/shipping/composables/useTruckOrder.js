import { ref } from 'vue'
import { 
  useGetDataTruckOrderService,
  useSaveTruckOrderService,
  usePrintTruckOrderFormPDFService, 
} from '@/services/skt/shipmentPlan/services'

export function useTruckOrder(urlApi, whereHouse, accessTokenAtStore) {
  const { getTruckOrderDataResult, errorGetTruckOrderData, fetchTruckOrderData } = useGetDataTruckOrderService()
  const { saveTruckOrderResult, errorSaveTruckOrder, saveTruckOrder } = useSaveTruckOrderService()
  const { printTruckOrderFormPDFResult, errorPrintTruckOrderFormPDF, printTruckOrderFormPDF } = usePrintTruckOrderFormPDFService()

  // ✅ Dialog state
  const isDialogVisible = ref(false)
  const currentSaleOrderNo = ref('')
  const currentSoEId = ref(null)
  const currentDataRow = ref(null)
  const existingTruckData = ref({})

  // ✅ Date utilities
  const convertToISO8601 = dateStr => {
    if (!dateStr) return ''
    const [day, month, year] = dateStr.split('/')
    const date = new Date(`${year}-${month}-${day}T00:00:00.000Z`)
    
    return date.toISOString()
  }

  const convertToDDMMYYYY = isoDateStr => {
    if (!isoDateStr) return ''
    const date = new Date(isoDateStr)
    const day = String(date.getUTCDate()).padStart(2, '0')
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const year = date.getUTCFullYear()
    
    return `${day}/${month}/${year}`
  }

  // ✅ Load truck order data from API
  const loadTruckOrderData = async soEId => {
    try {
      const result = await fetchTruckOrderData(
        urlApi.value,
        soEId,
        'get',
        'ShippingTruckOrder',
        whereHouse,
        accessTokenAtStore,
      )

      if (result && getTruckOrderDataResult?.value) {
        existingTruckData.value = {
          company: getTruckOrderDataResult.value.company,
          address: getTruckOrderDataResult.value.address,
          truckCompany: getTruckOrderDataResult.value.transComName,
          truckType: getTruckOrderDataResult.value.truckType,
          truckLicense: getTruckOrderDataResult.value.truckLicense,
          personIncharge: getTruckOrderDataResult.value.driverName,
          contact: getTruckOrderDataResult.value.contactAndTel,
          remark: getTruckOrderDataResult.value.remark,
          driverAndTel: getTruckOrderDataResult.value.driverAndTel,
          orderBy: getTruckOrderDataResult.value.orderBy,
          authorizedBy: getTruckOrderDataResult.value.authorizedBy,
          dateDriverDate: convertToDDMMYYYY(getTruckOrderDataResult.value.contactDate),
          dateOrderDate: convertToDDMMYYYY(getTruckOrderDataResult.value.orderDate),
          dateAuthorizedDate: convertToDDMMYYYY(getTruckOrderDataResult.value.authorizedDate),
        }
      }

      return getTruckOrderDataResult.value
    } catch (error) {
      console.error('Error loading truck order data:', error)
      
      return null
    }
  }

  // ✅ Show dialog
  const showDialog = async (saleOrderNo, soEId, dataRow) => {
    currentSaleOrderNo.value = saleOrderNo
    currentSoEId.value = soEId
    currentDataRow.value = dataRow
    
    // Save to session storage
    sessionStorage.setItem('savedTruckOrder', JSON.stringify({ 
      saleOrderNo, 
      soEId, 
      dataRow, 
    }))
    
    // Load existing data from API
    await loadTruckOrderData(soEId)
    
    // Open dialog
    isDialogVisible.value = true
  }

  // ✅ Close dialog
  const closeDialog = () => {
    isDialogVisible.value = false
    currentSaleOrderNo.value = ''
    currentSoEId.value = null
    currentDataRow.value = null
    existingTruckData.value = {}
    
    // Clear session storage
    sessionStorage.removeItem('savedTruckOrder')
  }

  // ✅ Save truck order data
  const saveTruckOrderData = async (formData, saveShipmentPlan, disabledModel, trikerSaveDrft) => {
    const body = {
      soEtlLogDetailJournalID: currentSoEId.value,
      company: formData.company,
      address: formData.address,
      transComName: formData.truckCompany,
      truckType: formData.truckType,
      truckLicense: formData.truckLicense,
      remark: formData.remark,
      driverName: formData.personIncharge,
      driverAndTel: formData.driverAndTel,
      orderBy: formData.orderBy,
      contactAndTel: formData.contact,
      authorizedBy: formData.authorizedBy,
      contactDate: convertToISO8601(formData.dateDriverDate),
      orderDate: convertToISO8601(formData.dateOrderDate),
      authorizedDate: convertToISO8601(formData.dateAuthorizedDate),
      lastPrintDateTime: convertToISO8601(formData.dateOrderDate),
    }

    trikerSaveDrft.value = true

    // Save shipment plan first (if not disabled)
    if (!disabledModel.value) {
      try {
        const saveDraftRes = await saveShipmentPlan(currentDataRow.value)
        if (!saveDraftRes) {
          throw new Error('Save shipment plan failed')
        }
      } catch (error) {
        console.error('Error saving shipment plan:', error)
        trikerSaveDrft.value = false
        
        return false
      }
    }

    // Save truck order
    try {
      const result = await saveTruckOrder(
        urlApi.value,
        'save',
        whereHouse,
        accessTokenAtStore,
        body,
      )

      if (result) {
        // Clear session storage after successful save
        sessionStorage.removeItem('savedTruckOrder')
        
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Error saving truck order:', error)
      
      return false
    } finally {
      trikerSaveDrft.value = false
    }
  }

  // ✅ Print truck order document
  const printTruckOrderDocument = async formData => {
    const printParams = {
      runningNum: currentDataRow.value?.truckReservingNumber,
      comName: formData.company,
      address: formData.address,
      transportComName: formData.truckCompany,
      truckType: formData.truckType,
      truckLicense: formData.truckLicense,
      driverName: formData.personIncharge,
      tel: formData.contact,
      remark: formData.remark,
      driverBy: formData.driverAndTel,
      orderBy: formData.orderBy,
      authorizedBy: formData.authorizedBy,
      dateDriverBy: formData.dateDriverDate,
      dateOrderBy: formData.dateOrderDate,
      dateAuthorizedBy: formData.dateAuthorizedDate,
    }

    try {
      return await printTruckOrderFormPDF(
        urlApi.value,
        printParams,
        whereHouse,
        accessTokenAtStore,
        currentSoEId.value,
      )
    } catch (error) {
      console.error('Error printing truck order:', error)
      
      return false
    }
  }

  // ✅ Restore from session storage (call this in onMounted)
  const restoreFromSession = () => {
    const savedData = sessionStorage.getItem('savedTruckOrder')
    if (savedData) {
      try {
        const { saleOrderNo, soEId, dataRow } = JSON.parse(savedData)

        showDialog(saleOrderNo, soEId, dataRow)
      } catch (error) {
        console.error('Error restoring from session:', error)
        sessionStorage.removeItem('savedTruckOrder')
      }
    }
  }

  return {
    // State
    isDialogVisible,
    currentSaleOrderNo,
    currentSoEId,
    currentDataRow,
    existingTruckData,
    
    // Methods
    showDialog,
    closeDialog,
    saveTruckOrderData,
    printTruckOrderDocument,
    loadTruckOrderData,
    restoreFromSession,
  }
}
