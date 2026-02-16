import {
  formatDate,
  formatDateSave,
  convertDateFormat,
} from '../../utils/formatters'

export const useSaveSearchPlan = () => {
  const saveDraftLoading = ref(false)
  const saveDraftLoadingSOERow = ref('')
    
  const trikerSaveDrft = ref(false)
  const isDialogSapInV = ref(false)
  const dataRowDailog = ref(null)
  const typeSap = ref(null)
  const soEIdSap = ref(null)

  const mapRequestData = data => ({
    soEtlLogDetailJournalID: getOrDefault(data.soEtlLogDetailJournalID, 0),
    loadingDate: formatDateSave(getOrDefault(data.logUpdatedDate, null)),
    updatedBy: getOrDefault(data.salUpdatedBy, "system"),
    poNo: getOrDefault(data.poNo),
    sapInvoiceNo: getOrDefault(data.sapInvoiceNo),
    shipperMark: getOrDefault(data.shipperMark, ""),
    shipperConditions: getOrDefault(data.shipperConditions, ""),
    shippingEndUser: getOrDefault(data.shippingEndUser, ""),
    shipperLocation: getOrDefault(data.shipperLocation, ""),
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
  })
  
  const getOrDefault = (value, defaultValue) => value ?? defaultValue
    
  const saveSearchPlan = async () => {
    
  }

  return {
    
    saveDraftLoading,
    saveDraftLoadingSOERow,
    trikerSaveDrft,
    isDialogSapInV,
    dataRowDailog,
    typeSap,
    soEIdSap,

    mapRequestData,

    saveSearchPlan,
  }
}
