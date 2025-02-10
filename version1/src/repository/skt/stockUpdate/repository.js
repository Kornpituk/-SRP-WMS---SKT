import axios from '@axios'


export const checkSheetLorryFlexiRepository = {

  async getSearchPlan(urlApi, form, whereHouse, accessToken, params = {}, statusID) {
    try {
      const response = await axios.get(`${urlApi}/api/v1/${form}`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
        params: this.constructParams(params),
      })
        
      if (response && response.data) {
    
        // console.log('Service Response data getSearchPlan:', response.data)
                
        return { data: response.data, success: true }
      } else {
        console.log('Error repo Error If getSearchPlan...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try getSearchPlan...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch getSearchPlan ${error.response?.data?.message || error.message}`)
    }
  },

  constructParams(params) {
    return {
      ...this.constructSearchParams(params),
      ...this.constructSortParams(params),
      page: params.page || '',
      perPage: params.perPage || '',
    }
  },

  constructSearchParams(params) {
    return {
      ...this.getBasicSearchParams(params),
      ...this.getAdvancedSearchParams(params),
    }
  },

  getBasicSearchParams(params) {
    return {
      categoryId: params.categoryId || '',
      typeId: params.typeId || '',
      subTypeId: params.subTypeId || '',
      barcode: params.barcode || '',
      productId: params.productId || '',
      productName: params.productName || '',
      unitId: params.unitId || '',
      serialNo: params.serialNo || '',
      zoneId: params.zoneId || '',
      areaId: params.areaId || '',
      subAreaId: params.subAreaId || '',
    }
  },

  getAdvancedSearchParams(params) {
    return {
      searchByCategory: params.searchByCategory || '',
      searchByType: params.searchByType || '',
      searchBySubType: params.searchBySubType || '',
      searchByBarcode: params.searchByBarcode || '',
      searchByProductId: params.searchByProductId || '',
      searchByProductName: params.searchByProductName || '',
      searchByUnit: params.searchByUnit || '',
    }
  },

  constructSortParams(params) {
    return {
      sortByCategory: params.sortByCategory || '',
      sortByType: params.sortByType || '',
      sortBySubType: params.sortBySubType || '',
      sortByBarcode: params.sortByBarcode || '',
      sortByProductId: params.sortByProductId || '',
      sortByProductName: params.sortByProductName || '',
      sortByUnit: params.sortByUnit || '',
      sortByQty: params.sortByQty || '',
      sortByTags: params.sortByTags || '',
      sortByNonTags: params.sortByNonTags || '',
    }
  },

  async getFilterSelectItem(urlApi, form, whereHouse, accessToken, params, typeParams) {
    try {
      let response 
      
      if(form === 'Categories'){
        response = await axios.get(`${urlApi}/api/v1/Product/${form}/${typeParams}=${params}`, {
          headers: {
            'accept': '*/*',
            'x-location': whereHouse,
            Authorization: `Bearer ${accessToken}`,
          },
        })
      }else{
        response = await axios.get(`${urlApi}/api/v1/Product/${form}?${typeParams}=${params}`, {
          headers: {
            'accept': '*/*',
            'x-location': whereHouse,
            Authorization: `Bearer ${accessToken}`,
          },
        })
      }
      
      
        
      if (response && response.data) {
    
        // console.log('Service Response data getSearchPlan:', response.data)
                
        return { data: response.data, success: true }
      } else {
        console.log('Error repo Error If getSearchPlan...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try getSearchPlan...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch getSearchPlan ${error.response?.data?.message || error.message}`)
    }
  },

}
  