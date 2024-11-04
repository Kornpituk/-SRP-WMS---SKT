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
  
  const printReceivingFormService = async (poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) => {
    try {
      errorMessageGenerateView.value = null
      console.log('Print Receiving Form Service Starting...')
  
      const result = await globalService.printReceivingFormPDF(poEtlLogDetailJournalID, urlApi, whereHouse, accessToken)
        
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
      
      return { success: false, data: null, error: error.message }
    }
  }
  
  return {
    printLabelFormViewResult,
    errorMessagePrintLabelView,
    printLabelFormViewService,
  }
}


