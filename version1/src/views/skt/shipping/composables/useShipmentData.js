// =====================================================
// 📄 composables/useShipmentData.js
// =====================================================
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'

export function useShipmentData() {
  const { get, post, put } = useApi()
  
  const data = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  
  // ✅ Centralized data fetching with caching
  const cache = new Map()
  
  async function fetchData(filters = {}) {
    const cacheKey = JSON.stringify(filters)
    
    if (cache.has(cacheKey)) {
      data.value = cache.get(cacheKey)
      
      return
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      const response = await get('/api/shipment/search', filters)

      data.value = response.data
      cache.set(cacheKey, response.data)
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }
  
  // ✅ Batch file loading
  async function loadFilesForItems(items) {
    const fileTypes = ['SO', 'COA', 'TruckOrder', 'DeliveryNote']
    
    const promises = items.flatMap(item =>
      fileTypes.map(type =>
        get(`/api/files/${type}/${item.soEtlLogDetailJournalID}`)
          .then(files => ({
            itemId: item.soEtlLogDetailJournalID,
            type,
            files,
          })),
      ),
    )
    
    const results = await Promise.allSettled(promises)
    
    // Map results back to items
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        const { itemId, type, files } = result.value
        const item = items.find(i => i.soEtlLogDetailJournalID === itemId)
        if (item) {
          item[`get${type}FileData`] = files
        }
      }
    })
    
    return items
  }
  
  // ✅ Optimized save with debouncing
  const saveQueue = new Map()
  let saveTimer = null
  
  function saveDraft(item) {
    saveQueue.set(item.soEtlLogDetailJournalID, item)
    
    clearTimeout(saveTimer)
    saveTimer = setTimeout(async () => {
      const itemsToSave = Array.from(saveQueue.values())

      saveQueue.clear()
      
      try {
        await post('/api/shipment/batch-save', itemsToSave)
      } catch (err) {
        console.error('Batch save failed:', err)
      }
    }, 1000)
  }
  
  return {
    data,
    isLoading,
    error,
    fetchData,
    loadFilesForItems,
    saveDraft,
  }
}
