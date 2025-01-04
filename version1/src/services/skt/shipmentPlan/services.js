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
        console.log('Fetching data fetchUserPermission:', result)
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
