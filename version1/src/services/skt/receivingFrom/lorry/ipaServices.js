import { ipaRepo } from '@/repository/skt/receivingPlan/lorry/ipaRepo'

export const usePrintIPAFormService = () => {
  const printIPAFormResult = ref(null)
  const errorMessageIPAPrintPDF = ref(null)
    
  const printIPAFormService = async (typeLorryID, poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) => {
    try {
      errorMessageIPAPrintPDF.value = null
      console.log('Print IPA Form Service Starting...')
    
      const result = await ipaRepo.printIPAFormPDF(typeLorryID, poEtlLogDetailJournalID, urlApi, whereHouse, accessToken)
          
      if (result) {
        console.log('Print IPA Form Service Complate:', result)
            
        printIPAFormResult.value = result
    
        return { success: true, data: result }
      } else {
        console.warn('Print IPA Form Service Fialed')
    
        return { success: false, error: 'Print IPA Form Service Fialed' }
      }
    } catch (error) {
      console.error('Error in printIPAFormService:', error)
      errorMessageIPAPrintPDF.value = error.message
    
      return { success: false, error: error.message }
    }
  
  
  }
    
  return {
    printIPAFormResult,
    errorMessageIPAPrintPDF,
    printIPAFormService,
  }
}
  