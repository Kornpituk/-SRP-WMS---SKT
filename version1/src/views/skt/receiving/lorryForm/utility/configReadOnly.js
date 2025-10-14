import { canVisibleUserPermissionPermission, fetchUserPermissions } from '@/utilities/permission'

const canVisibleUserPermission = (statusId, uiControlContextId) => {

  return canVisibleUserPermissionPermission(statusId, uiControlContextId)
}

const readOnlyInput = (status, uiControlContextId) => {


  if(canVisibleUserPermission('-1', uiControlContextId).canVisible){
    if(status === 15 || status ===     18 || status === 17){
      console.log('s')
      
      return true
    }else{
      return false
    }
  }else{
    return true
  }
}

export default readOnlyInput
