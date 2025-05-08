import { fetchInspectionHeaderService,
  generateInspectionService,
  getReceivingPlanByJournalIdService,
  getAnalysisInspService,
  saveAnalyticalItemDetailsService,
  saveInspectionFormService,
} from '../api/receivingService'
import { mapInspectionHeader, success, failure, checkHasEmptyFields } from '../utils/inspectionUtils'
import { createAnalysisItemsCode } from '../types/analysisItems'

// *** generate Insp
export function useGenerateInspection() {
  const loading = ref(false)
  const error = ref(null)
  const result = ref(null)

  const generate = async id => {
    loading.value = true
    error.value = null

    try {
      const response = await generateInspectionService(id)

      result.value = response.data
      
      return true
    } catch (err) {
      error.value = err?.response?.data?.message || err.message
      console.error('[useGenerateInspection] error:', error.value)
      
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    generate,
    loading,
    error,
    result,
  }
}

// *** generate JournalId Insp
export function useGenerateJournalIdInspection() {
  const loading = ref(false)
  const error = ref(null)
  const result = ref(null)

  const generate = async id => {
    loading.value = true
    error.value = null

    try {
      const response = await getReceivingPlanByJournalIdService(id)

      result.value = response.data
      
      return true
    } catch (err) {
      error.value = err?.response?.data?.message || err.message
      console.error('[useGenerateJournalIdInspection] error:', error.value)
      
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    generate,
    loading,
    error,
    result,
  }
}

// *** fetch Head Insp
export async function fetchAndMapInspectionHeader(id) {
  const headerInsp = ref({})
  const isReject = ref(false)
  const isAccept = ref(false)
  
  try {
    const res = await fetchInspectionHeaderService(id)
    const data = res.data.data
  
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('ไม่พบข้อมูล')
      
      return { headerInsp, isReject, isAccept }
    }
  
    const insp = data[0]

    headerInsp.value = mapInspectionHeader(insp)
    isReject.value = insp?.isReject ?? false
    isAccept.value = insp?.isAccept ?? false
  } catch (e) {
    console.error('โหลดข้อมูลผิดพลาด', e)
  }
  
  return { headerInsp, isReject, isAccept }
}

// *** fetch Analysis Insp
export function useAnalysisItems() {
  const loading = ref(false)
  const error = ref(null)
  const analysisItems = ref([])
  const analysisItemsCode = ref(createAnalysisItemsCode()) // ✅ ใช้ model ที่แยกไว้
  const analysisResults = ref([])
  const analyticalItemsResults = ref([])

  const fetch = async id => {
    loading.value = true
    error.value = null

    try {
      const response = await getAnalysisInspService(id)
      const data = response.data

      if (!data || !data.items) {
        console.warn('No data received from API')
        
        return
      }

      analysisItems.value = data.items

      const firstItemAnalyticals = data.items[0]?.itemAnalyticals || []
      for (let i = 0; i < Math.min(5, firstItemAnalyticals.length); i++) {
        const ai = firstItemAnalyticals[i]

        analysisItemsCode.value[`actualAmountUnits_${i}`] = ai.actualAmountUnits ?? null
        analysisItemsCode.value[`actualAnalysis_${i}`] = ai.actualAnalysis ?? null
        analysisItemsCode.value[`actualMakerLotNo_${i}`] = ai.actualMakerLotNo ?? null
        analysisItemsCode.value[`actualNetCountKgs_${i}`] = ai.actualNetCountKgs ?? null
        analysisItemsCode.value[`actualTotalQuantityKgs_${i}`] = ai.actualTotalQuantityKgs ?? 0
      }

      analysisResults.value = data.items.map(item => ({
        rmInspReqFormAnalyticalItemsJournalId: item.rmInspReqFormAnalyticalItemsJournalId,
        typeID: item.typeID,
        typeName: item.typeName,
        analyticalItem: item.analyticalItem,
        unit: item.unit,
      }))

      analyticalItemsResults.value = data.items.reduce((acc, item) => {
        if (Array.isArray(item.itemAnalyticals)) {
          acc.push(...item.itemAnalyticals.map(ai => ({
            rmInspReqFormAnalyticalItemsJournalId: ai.rmInspReqFormAnalyticalItemsJournalId,
            actualAmountUnits: ai.actualAmountUnits,
            actualAnalysis: ai.actualAnalysis,
            actualMakerLotNo: ai.actualMakerLotNo,
            actualNetCountKgs: ai.actualNetCountKgs,
            actualTotalQuantityKgs: ai.actualTotalQuantityKgs,
            inspReqLotJournalId: ai.inspReqLotJournalId,
            lotID: ai.lotID,
            okState: ai.okState,
          })))
        }
        
        return acc
      }, [])

    } catch (err) {
      console.error('[useAnalysisItems] error:', err)
      error.value = err?.response?.data?.message || err.message
    } finally {
      loading.value = false
    }
  }

  return {
    fetch,
    loading,
    error,
    analysisItems,
    analysisItemsCode,
    analysisResults,
    analyticalItemsResults,
  }
}

//*** Save Head Insp */
export function useSaveHeaderInspect(options) {
  const {
    headerInsp,
    poEtlLogDetailJournalIDQueryParameters,
  } = options

  const isDialogSubmitFailedVisible = ref(false)

  const saveHeaderInspect = async () => {
    try {
      const body = {
        limConditionDetail: headerInsp.value.details,
        note: headerInsp.value.note,
      }

      await saveInspectionFormService(
        poEtlLogDetailJournalIDQueryParameters.value,
        body,
      )

      return true
    } catch (error) {
      isDialogSubmitFailedVisible.value = true
      
      return false
    }
  }

  return {
    saveHeaderInspect,
    isDialogSubmitFailedVisible,
  }
}

//*** Save Lot Insp *
export function useSaveLotInsp(analysisItems) {
  const emptyFields = ref([])
  const trickerSubmit = ref(false)

  const checkEmptyFields = () => {
    const emptyFieldsList = []

    analysisItems.value.forEach((item, itemIndex) => {
      const needActualCheck = item.needActualValue
      const shouldCheck = item.unit !== ''

      if (!shouldCheck) return

      item.itemAnalyticals.forEach((analyticalItem, analyticalIndex) => {
        const body = {
          inspReqLotJournalId: analyticalItem.inspReqLotJournalId,
          actualAnalysis: analyticalItem.actualAnalysis,
          okState: analyticalItem.okState,
        }

        const isMissingActual = needActualCheck && !body.actualAnalysis
        const isMissingOkState = !needActualCheck && body.okState === -1
        const isEmpty = isMissingActual || isMissingOkState

        emptyFieldsList.push({
          indexLabel: `No.${itemIndex + 1} - Lot ${analyticalIndex + 1}`,
          body,
          isEmpty,
          needActualCheck,
        })
      })
    })

    return emptyFieldsList
  }

  const checkHasEmptyFields = fields => fields.some(f => f.isEmpty)

  const saveLotInspect = async () => {
    emptyFields.value = checkEmptyFields()

    if (trickerSubmit.value && checkHasEmptyFields(emptyFields.value)) {
      throw 'Cannot proceed: There are errors in the fields.'
    }

    for (const item of analysisItems.value) {
      for (const analyticalItem of item.itemAnalyticals) {
        await saveAnalyticalItemDetailsService(analyticalItem)
      }
    }

    return true
  }

  return {
    emptyFields,
    trickerSubmit,
    saveLotInspect,
  }
}
