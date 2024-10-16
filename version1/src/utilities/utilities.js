export const useGetCOAFormController = () => {
  const getCoaForm = ref(null)
  const errorMessageGetCoa = ref(null)
    
  const fetchCoaForm = async (poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken) => {
    try {
      errorMessageGetCoa.value = null
      console.log('Fetching Form COA...')
    
      const result = await coaService.GetCOAForm(poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken)
          
      if (result) {
        console.log('data COA Controller:', result)
        getCoaForm.value = result
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.error('Error in fetchCoaForm:', error)
      errorMessageGetCoa.value = error.message
    }
  }
    
  return {
    getCoaForm,
    errorMessageGetCoa,
    fetchCoaForm,
  }
}
