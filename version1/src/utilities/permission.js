import { ref } from 'vue'
import { useGetUserPermissionService } from '@/services/skt/shipmentPlan/services'

const { getUserPermissionResult, fetchUserPermission } = useGetUserPermissionService()

// ตัวแปรสำหรับเก็บผลลัพธ์
const userPermissions = ref([])

const userPermissionsAll = ref([])

// ฟังก์ชันสำหรับเรียก API และเก็บผลลัพธ์
export const fetchUserPermissions = async (urlApi, whereHouse, accessToken, paramsForGetPermission) => {
  try {
    const result = await fetchUserPermission(
      urlApi,
      'getPermission',
      whereHouse,
      accessToken,
      paramsForGetPermission,
    )

    if (result) {
      userPermissions.value = getUserPermissionResult.value || []

      // console.log('Fetched User Permissions:', userPermissions.value)

      return result
    } else {
      console.error('No result from API')
    }
  } catch (error) {
    console.error('Error fetching user permissions:', error)
    userPermissions.value = [] // Clear permissions on error
  }
}

export const fetchUserPermissionsAll = async (urlApi, whereHouse, accessToken, paramsForGetPermission) => {
  try {
    const result = await fetchUserPermission(
      urlApi,
      'getPermission',
      whereHouse,
      accessToken,
      paramsForGetPermission,
    )

    if (result) {
      userPermissions.value = getUserPermissionResult.value || []

      // console.log('Fetched User Permissions: sdsd', userPermissions.value)sdds

      return result
    } else {
      console.error('No result from API dss')
    }
  } catch (error) {
    console.error('Error fetching user permissions:', error)
    userPermissions.value = [] // Clear permissions on error
  }
}

// ฟังก์ชันสำหรับตรวจสอบสิทธิ์
export const canVisibleUserPermissionPermission = (statusId, uiControlContextId) => {
  if (userPermissions.value.length > 0) {
    const userPermission = userPermissions.value.find(item => {
      const itemStatusId = String(item.statusID).trim()
      const providedStatusId = String(statusId).trim()
      const itemUiControlContextId = String(item.uiControlName).trim().toLowerCase()
      const providedUiControlContextId = String(uiControlContextId).trim().toLowerCase()

      return (
        itemStatusId === providedStatusId &&
        itemUiControlContextId === providedUiControlContextId
      )
    })

    if (userPermission) {
      return {
        canExecute: userPermission.canExecute,
        canVisible: userPermission.canVisible,
      }
    }
  }

  return {
    canExecute: false,
    canVisible: false,
  }
}

export const canVisibleUserPermissionPermissionAll = (statusIdAll, uiControlContextIdAll) => {
  if (userPermissionsAll.value.length > 0) {
    const userPermissionAll = userPermissionsAll.value.find(item => {
      const itemStatusId = String(item.statusID).trim()
      const providedStatusId = String(statusIdAll).trim()
      const itemUiControlContextId = String(item.uiControlName).trim().toLowerCase()
      const providedUiControlContextId = String(uiControlContextIdAll).trim().toLowerCase()

      return (
        itemStatusId === providedStatusId &&
        itemUiControlContextId === providedUiControlContextId
      )
    })

    if (userPermissionAll) {
      return {
        canExecute: userPermissionAll.canExecute,
        canVisible: userPermissionAll.canVisible,
      }
    }else{

    }
  }

  return {
    canExecute: false,
    canVisible: false,
  }
}
