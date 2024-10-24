export const  gobalService = {
  
  async generateViewForm(poEtlLogDetailJournalID, urlApi, whereHouse, accessToken) {
    try {
      const response = await axios.get(`${urlApi}/api/v1/ReceivingPlan/View/${poEtlLogDetailJournalID}`, {}, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
        
      if (response && response.data) {
        console.log('Service Response data Genterate View:', response.data.data)
          
        return response.data.data
      } else {
        throw new Error('No data Genterate View from the server')
      }
    } catch (error) {
      console.error('Error in generatePackagingIdForm:', error)
      throw new Error(`Failed to fetch header for ID ${poEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
    }
  },
}
  