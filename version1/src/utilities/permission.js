import { ref } from 'vue'
import { useGetUserPermissionService } from '@/services/skt/shipmentPlan/services'

const { getUserPermissionResult, fetchUserPermission } = useGetUserPermissionService()

// ตัวแปรสำหรับเก็บผลลัพธ์
const userPermissions = ref([])

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

      console.log('Fetched User Permissions:', userPermissions.value)

      return result
    } else {
      console.error('No result from API')
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
