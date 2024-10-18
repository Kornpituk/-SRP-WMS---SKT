import { gobalService } from '@/repository/skt/gobal/gobalRepository'

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
