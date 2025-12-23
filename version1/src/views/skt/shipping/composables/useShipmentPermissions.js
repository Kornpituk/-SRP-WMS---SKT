// =====================================================
// 📄 composables/useShipmentPermissions.js
// =====================================================
import { ref, computed } from 'vue'

export function useShipmentPermissions() {
  const userPermissions = ref([])
  
  // ✅ Load once on mount
  async function loadPermissions() {
    const userData = JSON.parse(sessionStorage.getItem('userData'))

    const response = await fetch('/api/permissions', {
      method: 'POST',
      body: JSON.stringify({
        empId: userData.id,
        uiControlContextId: '7',
      }),
    })

    userPermissions.value = await response.json()
  }
  
  // ✅ Memoized permission checker
  const permissionMap = computed(() => {
    const map = new Map()

    userPermissions.value.forEach(p => {
      map.set(`${p.statusId}-${p.uiControlContextId}`, {
        canVisible: p.canVisible,
        canExecute: p.canExecute,
      })
    })
    
    return map
  })
  
  function canVisible(statusId, uiControlContextId) {
    return permissionMap.value.get(`${statusId}-${uiControlContextId}`)?.canVisible ?? false
  }
  
  function canExecute(statusId, uiControlContextId) {
    return permissionMap.value.get(`${statusId}-${uiControlContextId}`)?.canExecute ?? false
  }
  
  return {
    userPermissions,
    loadPermissions,
    canVisible,
    canExecute,
  }
}
