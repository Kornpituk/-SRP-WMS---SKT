/**
 * Shipment Operations Composable
 * Handles core shipment operations: search, save, submit, and SAP validation
 */
import { ref } from 'vue'

// Import services
import { useDeleteFileFormService, useGetSearchPlanSapinvoicenoIsexistService, useGetSearchPlanService, useSaveFileFormService, useSaveSearchPlanService, useSubmitShipmentPlanService } from '@/services/skt/shipmentPlan/services'

// Import utilities
import { formatDateSave } from '../utils/formatters'
import { getOrDefault } from '../utils/validators'

export function useShipmentOperations() {
  // =============== Loading States ===============
  const saveDraftLoading = ref(false)
  const saveDraftLoadingSOERow = ref('')
  const submitLoading = ref(false)
  const submitLoadingSOERow = ref('')
  const trikerSaveDrft = ref(false)
  
  // =============== Service Initialization ===============
  const { getSearchPlanResult, errorGetSearchPlan, fetchSearchPlan } = useGetSearchPlanService()
  const { getSearchPlanSapInVResult, errorGetSearchPlanSapInV, fetchSearchPlanSapInV } = useGetSearchPlanSapinvoicenoIsexistService()
  const { saveSearchPlanResult, errorSaveSearchPlan, saveSearchPlan } = useSaveSearchPlanService()
  const { submitShipmentPlanResult, errorSubmitShipmentPlan, submitShipmentPlan } = useSubmitShipmentPlanService()
  const { saveFileFormResult, errorSaveFileForm, saveFileForm } = useSaveFileFormService()
  const { deleteFileFormResult, errorDeleteFileForm, deleteFileForm } = useDeleteFileFormService()
  
  // =============== Data Transformation ===============
  
  /**
   * Map product data to API request format
   */
  function mapRequestData(data) {
    return {
      soEtlLogDetailJournalID: getOrDefault(data.soEtlLogDetailJournalID, 0),
      loadingDate: formatDateSave(getOrDefault(data.logUpdatedDate, null)),
      updatedBy: getOrDefault(data.salUpdatedBy, "system"),
      poNo: getOrDefault(data.poNo),
      sapInvoiceNo: getOrDefault(data.sapInvoiceNo),
      shipperMark: getOrDefault(data.shipperMark, ""),
      shipperConditions: getOrDefault(data.shipperConditions, ""),
      shippingEndUser: getOrDefault(data.shippingEndUser, ""),
      shippingMarkActive: getOrDefault(data.shippingMarkActive, ""),
      freightForwarder: getOrDefault(data.freightForwarder, ""),
      carrier: getOrDefault(data.carrier, ""),
      vesselName: getOrDefault(data.vesselName, ""),
      voy: getOrDefault(data.voy, ""),
      truck: getOrDefault(data.truck, ""),
      truckReservingNumber: getOrDefault(data.truckReservingNumber, ""),
      truckFee: getOrDefault(data.truckFee, ""),
      etd: formatDateSave(getOrDefault(data.etd, null)),
      eta: formatDateSave(getOrDefault(data.eta, null)),
      saL_Remarks: getOrDefault(data.saL_Remarks, ""),
      wH_Remarks: getOrDefault(data.wH_Remarks, ""),
      loG_Remarks: getOrDefault(data.loG_Remarks, ""),
      shipperLocation: getOrDefault(data.shipperLocation, ""),
    }
  }
  
  return {
    // Loading States
    saveDraftLoading,
    saveDraftLoadingSOERow,
    submitLoading,
    submitLoadingSOERow,
    trikerSaveDrft,
    
    // Service Results
    getSearchPlanResult,
    errorGetSearchPlan,
    getSearchPlanSapInVResult,
    errorGetSearchPlanSapInV,
    saveSearchPlanResult,
    errorSaveSearchPlan,
    submitShipmentPlanResult,
    errorSubmitShipmentPlan,
    
    // Service Functions
    fetchSearchPlan,
    fetchSearchPlanSapInV,
    saveSearchPlan,
    submitShipmentPlan,
    saveFileForm,
    deleteFileForm,
    
    // Helper Methods
    mapRequestData,
  }
}
