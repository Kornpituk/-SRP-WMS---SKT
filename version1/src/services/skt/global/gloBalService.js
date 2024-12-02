import { globalService } from '@/repository/skt/global/globalRepository'

export const useGenerateViewFormService = () => {
  const generateView = ref(null)
  const errorMessageGenerateView = ref(null)
  
  const fetchGenerateView = async (poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) => {
    try {
      errorMessageGenerateView.value = null
      console.log('Fetching Packaging Form Generate view...')
  
      const result = await gobalService.generateViewForm(poEtlLogDetailJournalID, urlApi, whereHouse, accessToken)
        
      if (result) {
        console.log('Packaging data Generate view Controller:', result)
          
        generateView.value = result
  
        return { success: true, data: result }
      } else {
        console.warn('No data returned from the API')
  
        return { success: false, error: 'No data returned from the API /Packaging/View.' }
      }
    } catch (error) {
      console.error('Error in fetchGenerateView:', error)
      errorMessageGenerateView.value = error.message
  
      return { success: false, error: error.message }
    }
  }
  
  return {
    generateView,
    errorMessageGenerateView,
    fetchGenerateView,
  }
}

export const usePrintReceivingFormService = () => {
  const printReceivingFormResult = ref(null)
  const errorMessageGenerateView = ref(null)
  
  const printReceivingFormService = async (typeReceiving, poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) => {
    try {
      errorMessageGenerateView.value = null
      console.log('Print Receiving Form Service Starting...')
  
      const result = await globalService.printReceivingFormPDF(typeReceiving, poEtlLogDetailJournalID, urlApi, whereHouse, accessToken)
        
      if (result) {
        console.log('Print Receiving Form Service Complate:', result)
          
        printReceivingFormResult.value = result
  
        return { success: true, data: result }
      } else {
        console.warn('Print Receiving Form Service Fialed')
  
        return { success: false, error: 'Print Receiving Form Service Fialed' }
      }
    } catch (error) {
      console.error('Error in printReceivingFormService:', error)
      errorMessageGenerateView.value = error.message
  
      return { success: false, error: error.message }
    }


  }
  
  return {
    printReceivingFormResult,
    errorMessageGenerateView,
    printReceivingFormService,
  }
}

export const usePrintInspectionFormService = () => {
  const printInspectionFormResult = ref(null)
  const errorMessageInspection = ref(null)
  
  const printInspectionFormService = async (poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) => {
    try {
      errorMessageInspection.value = null
      console.log('Print Inspection Form Service Starting...')
  
      const result = await globalService.printInspectionFormPDF(poEtlLogDetailJournalID, urlApi, whereHouse, accessToken)
        
      if (result) {
        console.log('Print Inspection Form Service Complate:', result)
          
        printInspectionFormResult.value = result
  
        return { success: true, data: result }
      } else {
        console.warn('Print Inspection Form Service Fialed')
  
        return { success: false, error: 'Print Inspection Form Service Fialed' }
      }
    } catch (error) {
      console.error('Error in printInspectionFormService:', error)
      errorMessageInspection.value = error.message
  
      return { success: false, error: error.message }
    }


  }
  
  return {
    printInspectionFormResult,
    errorMessageInspection,
    printInspectionFormService,
  }
}

export const usePrintPackagingFormService = () => {
  const printPackagingFormResult = ref(null)
  const errorMessagePackaging = ref(null)
  
  const printPackagingFormService = async (poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) => {
    try {
      errorMessagePackaging.value = null
      console.log('Print PackagingForm Form Service Starting...')
  
      const result = await globalService.printPackagingFormPDF(poEtlLogDetailJournalID, urlApi, whereHouse, accessToken)
        
      if (result) {
        console.log('Print PackagingForm Form Service Complate:', result)
          
        printPackagingFormResult.value = result
  
        return { success: true, data: result }
      } else {
        console.warn('Print Inspection Form Service Fialed')
  
        return { success: false, error: 'Print PackagingForm Form Service Fialed' }
      }
    } catch (error) {
      console.error('Error in printPackagingFormService:', error)
      errorMessagePackaging.value = error.message
  
      return { success: false, error: error.message }
    }


  }
  
  return {
    printPackagingFormResult,
    errorMessagePackaging,
    printPackagingFormService,
  }
}

//------------------------------------------------------------

export const useViewPrintLabelFormService = () => {
  const printLabelFormViewResult = ref(null)
  const errorMessagePrintLabelView = ref(null)
  
  const printLabelFormViewService = async (urlApi, whereHouse, accessToken, lot) => {
    try {
      errorMessagePrintLabelView.value = null
      console.log('Print Inspection Form Service Starting...')
  
      const result = await globalService.printLabelView(urlApi, whereHouse, accessToken, lot)
        
      if (result) {
        console.log('Print Inspection Form Service Complate:', result)
          
        printLabelFormViewResult.value = result
  
        return { success: true, data: result }
      } else {
        console.warn('Print Inspection Form Service Fialed')
  
        return { success: false, error: 'Print Inspection Form Service Fialed' }
      }
    } catch (error) {
      console.error('Error in printLabelFormViewService:', error)
      errorMessagePrintLabelView.value = error.message
  
      return { success: false, error: error.message }
    }


  }
  
  return {
    printLabelFormViewResult,
    errorMessagePrintLabelView,
    printLabelFormViewService,
  }
}

export const useFetchPrintLabelData = () => {
  const printLabelFormViewResult = ref(null)
  const errorMessagePrintLabelView = ref(null)

  const printLabelFormViewService = async (urlApi, whereHouse, accessToken, params = {}) => {
    try {
      errorMessagePrintLabelView.value = null
      console.log('Print Inspection Form Service Starting...')
  
      const result = await globalService.getPrintLabel(urlApi, whereHouse, accessToken, params)
        
      if (result) {
        console.log('Print Inspection Form Service Complete:', result)
        printLabelFormViewResult.value = result.map((item, index) => ({
          ...item,
          index: index + 1, // เริ่มนับจาก 1
        }))
        
        return { success: true, data: printLabelFormViewResult.value }
      } else {
        console.warn('Print Inspection Form Service Failed')
        
        return { success: false, error: 'Print Inspection Form Service Failed' }
      }
    } catch (error) {
      console.error('Error in printLabelFormViewService:', error)
      errorMessagePrintLabelView.value = error.message
      printLabelFormViewResult.value = []
      
      return { success: false, data: null, error: error.message }
    }
  }
  
  return {
    printLabelFormViewResult,
    errorMessagePrintLabelView,
    printLabelFormViewService,
  }
}

export const useSavePrintBarcodeFormService = () => {
  const saveToPrintLabelFormBarcodeResult = ref(null)
  const errorMessageSaveToPrintLabelBarcode = ref(null)
  
  const saveToPrintLabelFormBarcodeService = async (urlApi, whereHouse, accessToken, barcode) => {
    try {
      errorMessageSaveToPrintLabelBarcode.value = null
      console.log('Save To Print Barcode Form Service Starting...')
  
      const result = await globalService.saveToPrintLotByBarcode(urlApi, whereHouse, accessToken, barcode)
        
      if (result) {
        console.log('Save To Print Barcode Form Service Complate:', result)
          
        saveToPrintLabelFormBarcodeResult.value = result
  
        return { success: true, data: result }
      } else {
        console.warn('Save To Print Barcode Form Service Fialed')
  
        return { success: false, error: 'Save To Print Barcode Form Service Fialed' }
      }
    } catch (error) {
      console.error('Error in saveToPrintLabelFormBarcodeService:', error)
      errorMessageSaveToPrintLabelBarcode.value = error.message
  
      return { success: false, error: error.message }
    }


  }
  
  return {
    saveToPrintLabelFormBarcodeResult,
    errorMessageSaveToPrintLabelBarcode,
    saveToPrintLabelFormBarcodeService,
  }
}

export const usePrintLabelBarcodeFormService = () => {
  const printLabelBarcodeFormViewResult = ref(null)
  const errorMessagePrintLabelBarcode = ref(null)
  
  const printLabelFormBarcodeService = async (urlApi, whereHouse, accessToken) => {
    try {
      errorMessagePrintLabelBarcode.value = null
      console.log('Print Barcode Form Service Starting...')
  
      const result = await globalService.printLabelBarcode(urlApi, whereHouse, accessToken)
        
      if (result) {
        console.log('Print Barcode Form Service Complate:', result)
          
        printLabelBarcodeFormViewResult.value = result
  
        return { success: true, data: result }
      } else {
        console.warn('Print Barcode Form Service Fialed')
  
        return { success: false, error: 'Print Barcode Form Service Fialed' }
      }
    } catch (error) {
      console.error('Error in printLabelFormBarcodeService:', error)
      errorMessagePrintLabelBarcode.value = error.message
  
      return { success: false, error: error.message }
    }


  }
  
  return {
    printLabelBarcodeFormViewResult,
    errorMessagePrintLabelBarcode,
    printLabelFormBarcodeService,
  }
}

//---- export excel
export const usePrintExportExcelService = () => {
  const printExportExcelResult = ref(null)
  const printExportExcelErrorMessage = ref(null)

  const printExportExcelService = async (urlApi, whereHouse, accessToken, params = {}) => {
    try {
      printExportExcelErrorMessage.value = null
      console.log('Print Export Excel Form Service Starting...')
  
      const result = await globalService.printExportExcel(urlApi, whereHouse, accessToken, params)
        
      if (result && result.success) {
        console.log('Print Export Excel Form Service Complete:', result)
        printExportExcelResult.value = result.data
        
        return { success: true, data: printExportExcelResult.value }
      } else {
        console.warn('Print Export Excel Form Service Failed')
        
        return { success: false, error: 'Print Export Excel Form Service Failed' }
      }
    } catch (error) {
      console.error('Error in printExportExcelService:', error)
      printExportExcelErrorMessage.value = error.message
      printExportExcelResult.value = null
      
      return { success: false, error: error.message }
    }
  }
  
  return {
    printExportExcelResult,
    printExportExcelErrorMessage,
    printExportExcelService,
  }
}


