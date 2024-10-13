import axios from '@axios'


///- --- ------------------------------ COA -----------------------------------------
export const coaService = {
  async GetCOAForm(poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken) {
    try {
      const response = await axios.get(`${urlApi}/api/v1/${form}/GetCoa/${poEtlLogDetailJournalID}`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
        
      if (response && response.data) {
        console.log(`Service Response data COA:`, response.data.data)
          
        return response.data.data
      } else {
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.error('Error in GetCOAForm:', error)
      throw new Error(`Failed to fetch header for ID ${poEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
    }
  },

  async saveDraftCOAForm(files, poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken) {
    const formData = new FormData()
  
    // Loop ผ่านไฟล์ที่ต้องการอัปโหลด
    files.forEach(file => {
      formData.append('files', file)
    })
  
    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/SaveCoA/${poEtlLogDetailJournalID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-location': whereHouse,
          'Authorization': `Bearer ${accessToken}`,
        },
      })
  
      return response.data
    } catch (error) {
      throw new Error(`Error while saving COA: ${error.message}`)
    }
  },
  
  async deleteCoaForm(poEtlLogDetailJournalID, urlApi, form, whereHouse, accessToken) {
  
    const body = 0
  
    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/DeleteCoa/${poEtlLogDetailJournalID}`, body, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })
        
      if (response && response.data) {
        console.log('Service Response data detelete coa:', response.data.data)
          
        return response.data.data
      } else {
        throw new Error('No data delete coa from the server')
      }
    } catch (error) {
      console.error('Error in deleteCoaForm:', error)
      throw new Error(`Failed to delete coa for ID ${poEtlLogDetailJournalID}: ${error.response?.data?.message || error.message}`)
    }
  },


}
  

  