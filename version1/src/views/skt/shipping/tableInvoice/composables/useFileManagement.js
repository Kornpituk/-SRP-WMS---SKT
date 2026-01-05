/**
 * File Management Composable
 * Handles file upload/download operations for SO, PO, COA, Truck Order, and Delivery Note
 */
import { ref } from 'vue'

export function useFileManagement() {
  // =============== File States ===============
  const filesFromUploaderSO = ref([])
  const filesFromUploaderPO = ref([])
  const filesFromUploaderCOA = ref([])
  const filesFromUploaderTruckOrder = ref([])
  const filesFromUploaderDeliNote = ref([])
  
  // File results from API  
  const getSoFileModel = ref([])
  const getPoFileModel = ref([])
  const getCoAFileModel = ref([])
  const getTruckOrderFileModel = ref([])
  const getDeliveryNoteFileModel = ref([])
  
  const typeFileInput = ref('hideInput')
  const typeNameFileInput = ref('')
  
  // =============== File Update Handlers ===============
  
  function handleFileUpdatesSO(updatedFiles) {
    filesFromUploaderSO.value = updatedFiles
  }
  
  function handleFileUpdatesPO(updatedFiles) {
    filesFromUploaderPO.value = updatedFiles
  }
  
  function handleFileUpdatesCOA(updatedFiles) {
    filesFromUploaderCOA.value = updatedFiles
  }
  
  function handleFileUpdatesTruckOrder(updatedFiles) {
    filesFromUploaderTruckOrder.value = updatedFiles
  }
  
  function handleFileUpdatesDeliNote(updatedFiles) {
    filesFromUploaderDeliNote.value = updatedFiles
  }
  
  // =============== Reset Files ===============
  
  function resetAllFiles() {
    filesFromUploaderSO.value = []
    filesFromUploaderPO.value = []
    filesFromUploaderCOA.value = []
    filesFromUploaderTruckOrder.value = []
    filesFromUploaderDeliNote.value = []
  }
  
  return {
    // File States
    filesFromUploaderSO,
    filesFromUploaderPO,
    filesFromUploaderCOA,
    filesFromUploaderTruckOrder,
    filesFromUploaderDeliNote,
    getSoFileModel,
    getPoFileModel,
    getCoAFileModel,
    getTruckOrderFileModel,
    getDeliveryNoteFileModel,
    typeFileInput,
    typeNameFileInput,
    
    // File Handlers
    handleFileUpdatesSO,
    handleFileUpdatesPO,
    handleFileUpdatesCOA,
    handleFileUpdatesTruckOrder,
    handleFileUpdatesDeliNote,
    resetAllFiles,
  }
}
