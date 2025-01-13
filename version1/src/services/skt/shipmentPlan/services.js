import { shipmentPlanRepository,
} from '@/repository/skt/shipmentPlan/respository'

export const useGetUserPermissionService = () => {
  const getUserPermissionResult = ref(null)
  const errorGetUserPermission = ref(null)
  
  const fetchUserPermission = async (urlApi, form, whereHouse, accessToke, params = {}) => {
    try {
      errorGetUserPermission.value = null
      console.log('Fetching fetchUserPermission...')
  
      const result = await shipmentPlanRepository.getPermissionUser(urlApi, form, whereHouse, accessToke, params)
        
      if (result) {
        // console.log('Fetching data fetchUserPermission:', result)
        getUserPermissionResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.log('Error in fetchUserPermission:', error)
      errorGetUserPermission.value = error.message
    }
  }
  
  return {
    getUserPermissionResult,
    errorGetUserPermission,
    fetchUserPermission,
  }
}

//----------------------------------- get ----------------------------
export const useGetSelectDataService = () => {
  const getSelectDataResult = ref(null)
  const errorGetSelectData = ref(null)
  
  const fetchSelectData = async (urlApi, form, whereHouse, accessToke) => {
    try {
      errorGetSelectData.value = null
      console.log('Fetching fetchSelectData...')
  
      const result = await shipmentPlanRepository.getSelect(urlApi, form, whereHouse, accessToke)
        
      if (result) {
        // console.log('Fetching data fetchSelectData:', result)
        getSelectDataResult.value = result.data.data
        
        return result.data.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.log('Error in fetchSelectData:', error)
      errorGetSelectData.value = error.message
    }
  }
  
  return {
    getSelectDataResult,
    errorGetSelectData,
    fetchSelectData,
  }
}

export const useGetSearchPlanService = () => {
  const getSearchPlanResult = ref(null)
  const errorGetSearchPlan = ref(null)
  
  const fetchSearchPlan = async (urlApi, form, whereHouse, accessToke, params = {}) => {
    try {
      errorGetSearchPlan.value = null
      console.log('Fetching fetchSearchPlan...')
  
      const result = await shipmentPlanRepository.getSearchPlan(urlApi, form, whereHouse, accessToke, params)
        
      if (result) {
        // console.log('Fetching data fetchSearchPlan:', result)
        getSearchPlanResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.log('Error in fetchSearchPlan:', error)
      errorGetSearchPlan.value = error.message
    }
  }
  
  return {
    getSearchPlanResult,
    errorGetSearchPlan,
    fetchSearchPlan,
  }
}

//---------------------------------- post ---------------------------------
export const useSaveSearchPlanService = () => {
  const saveSearchPlanResult = ref(null)
  const errorSaveSearchPlan = ref(null)
  
  const saveSearchPlan = async (urlApi, form, whereHouse, accessToke, body) => {
    try {
      errorSaveSearchPlan.value = null
      console.log('Fetching saveSearchPlan...')
  
      const result = await shipmentPlanRepository.saveSearchPlan(urlApi, form, whereHouse, accessToke, body)
        
      if (result) {
        // console.log('Fetching data saveSearchPlan:', result)
        saveSearchPlanResult.value = result.data
        
        return result.data
      } else {
        console.warn('No data returned from the API')
      }
    } catch (error) {
      console.log('Error in saveSearchPlan:', error)
      errorSaveSearchPlan.value = error.message
    }
  }
  
  return {
    saveSearchPlanResult,
    errorSaveSearchPlan,
    saveSearchPlan,
  }
}
