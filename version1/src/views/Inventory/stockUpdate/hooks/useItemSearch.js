import axiosIns from '@axios'
import { helper } from '../utility/helper'
import { useToast } from "vue-toastification"

export const useItemSearch = (
  urlApi, 
  accessTokenAtStore,
  whereHouse,
  wareHouseItemsSearchById,
  itemsSearchByUOMId,
  searchByCategoryId,
  typeItemsSearchById,
  subTypeItemsSearchById,
  searchByTypeId,
  zoneItemsSearchById,
  areaItemsSearchById,
  searchByZoneId,
  subAreaItemsSearchById,
  searchByAreaId,
) => {
  
  const { buildHeaders } = helper(whereHouse, accessTokenAtStore)
  const toast = useToast()

  const fetchItemsWareHouse = () => {
    axiosIns.get(`${urlApi.value}/api/Auth/GetLocation`, {
      headers: {
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
    })
      .then(response => {

        wareHouseItemsSearchById.value = response.data
      })
      .catch(error => {
      // Handle errors
        // selectError.value = 'Where house not selected!!'
        toast.error('Where house not selected!!')
        console.error('Error:', error)
      })

  }

  const getItemsProductUnit = () => {
    axiosIns.get(`${urlApi.value}/api/v1/Product/`+searchByCategoryId.value+'/Unit', {
      headers: buildHeaders(),
    })
      .then(response => {
  
        itemsSearchByUOMId.value = response.data
  
        // Now `items` contains an array of objects with id and name properties
        // console.log('itemsSearchByUOMId.value At index',itemsSearchByUOMId.value)
  
        
      })
      .catch(error => {
        // Handle errors
        selectError.value = 'Where house not selected!!'
        toast.error('Where house not selected!!')
        console.error('Error:', error)
      })
  
      
  }

  const getItemsProductType = () => {
    axiosIns.get(`${urlApi.value}/api/v1/Product/Types`, {
      params: {
        'CategoryId': searchByCategoryId.value,
      },
      headers: buildHeaders(),
    })
      .then(response => {

        typeItemsSearchById.value = response.data

        // Now `items` contains an array of objects with id and name properties
        // console.log('wareHouse.value At index',wareHouseItemsSearchById.value)

      
      })
      .catch(error => {
      // Handle errors
        selectError.value = 'Where house not selected!!'
        toast.error('Where house not selected!!')
        console.error('Error:', error)
      })

    
  }

  const getItemsProductSubType = () => {
    axiosIns.get(`${urlApi.value}/api/v1/Product/SubTypes/All`, {
      params: {
        'TypeId': searchByTypeId.value,
      },
      headers: buildHeaders(),
    })
      .then(response => {

        subTypeItemsSearchById.value = response.data

        // Now `items` contains an array of objects with id and name properties
        // console.log('wareHouse.value At index',wareHouseItemsSearchById.value)

      
      })
      .catch(error => {
      // Handle errors
        selectError.value = 'Where house not selected!!'
        console.error('Error:', error)
      })

    
  }

  const getItemLocalZone = () => {
    axiosIns.get(`${urlApi.value}/api/v1/Locations/zone/all`, {
      headers: buildHeaders(),
    })
      .then(response => {
  
        zoneItemsSearchById.value = response.data
  
        // Now `items` contains an array of objects with id and name properties
        // console.log('zoneItemsSearchById At index',zoneItemsSearchById.value)
  
        
      })
      .catch(error => {
        // Handle errors
        selectError.value = 'Where house not selected!!'
        console.error('Error:', error)
      })
  
      
  }
  
  const getItemLocalArea = () => {
    axiosIns.get(`${urlApi.value}/api/v1/Locations/area/all`, {
      params: {
        'zoneCode': searchByZoneId.value,
      },
      headers: buildHeaders(),
    })
      .then(response => {
  
        areaItemsSearchById.value = response.data
  
        // Now `items` contains an array of objects with id and name properties
        // console.log('areaItemsSearchById At index',areaItemsSearchById.value)
  
        
      })
      .catch(error => {
        // Handle errors
        selectError.value = 'Where house not selected!!'
        console.error('Error:', error)
      })
  
      
  }

  const getItemLocalSubArea = () => {
    axiosIns.get(`${urlApi.value}/api/v1/Locations/subArea/all`, {
      params: {
        'zoneCode': searchByZoneId.value,
        'areaCode': searchByAreaId.value,
      },
      headers: buildHeaders(),
    })
      .then(response => {
  
        subAreaItemsSearchById.value = response.data
  
        // Now `items` contains an array of objects with id and name properties
        // console.log('areaItemsSearchById At index',areaItemsSearchById.value)
  
        
      })
      .catch(error => {
        // Handle errors
        selectError.value = 'Where house not selected!!'
        console.error('Error:', error)
      })
  
      
  }

  const fetchItemsSearchBy = nameSearch => {
    return axiosIns.get(`${urlApi.value}/api/v1/Product/${nameSearch}`, {
      headers: buildHeaders(),
    }).then(response => {
      return response.data
    }).catch(error => {
      console.error('Error:', error)
      
      return null
    })
  }


  return {
    fetchItemsWareHouse,
    getItemsProductUnit,
    getItemsProductType,
    getItemsProductSubType,
    getItemLocalZone,
    getItemLocalArea,
    getItemLocalSubArea,
    fetchItemsSearchBy,
  }
}
