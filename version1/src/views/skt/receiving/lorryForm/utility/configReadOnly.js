import { canVisibleUserPermissionPermission, fetchUserPermissions } from '@/utilities/permission'

const canVisibleUserPermission = (statusId, uiControlContextId) => {

  return canVisibleUserPermissionPermission(statusId, uiControlContextId)
}

const readOnlyInput = (status, uiControlContextId) => {

  if(status === 15 || status ===     18 || status === 17){
    return true
  }else if(canVisibleUserPermission('-1', uiControlContextId).canVisible){
    return false
  }
}

export default readOnlyInput
