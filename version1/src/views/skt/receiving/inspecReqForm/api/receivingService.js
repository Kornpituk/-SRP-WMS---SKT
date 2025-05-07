import axiosIns from '@axios'
import { urlApi } from '@/api'

import { getHeaders } from '../utils/headers'

//-------------------------- Services ------------------------------------

// *** generate Insp
export const generateInspectionService = id => {
  return axiosIns.post(`${urlApi.value}/api/v1/Inspection/Generate/${id}`, {}, {
    headers: getHeaders(),
  })
}

// *** generate JournalId Insp
export const getReceivingPlanByJournalIdService = id => {
  return axiosIns.get(`${urlApi.value}/api/v1/ReceivingPlan/GetByPoEtlLogDetailJournalID/${id}`, {
    headers: getHeaders(),
  })
}

// *** fetch Head Insp
export const fetchInspectionHeaderService = id => {
  return axiosIns.get(`${urlApi.value}/api/v1/Inspection/View/${id}`, {
    headers: getHeaders(),
  })
}

// *** fetch Analysis Insp
export const getAnalysisInspService = id => {
  return axiosIns.get(`${urlApi.value}/api/v1/Inspection/GetAnalyticalItems/${id}`, {
    headers: getHeaders(),
  })
}

//*** Save Lot Insp */
export const saveAnalyticalItemDetailsService = async analyticalItem => {
  const body = {
    updatedBy: '', // ใส่ผู้ใช้ที่แก้ไขจริง
    inspReqLotJournalId: analyticalItem.inspReqLotJournalId,
    actualAnalysis: analyticalItem.actualAnalysis,
    okState: analyticalItem.okState,
    acture: analyticalItem.acture || 0,
    afterMixing: analyticalItem.afterMixing || 0,
  }

  const response = await axiosIns.post(
    `${urlApi.value}/api/v1/Inspection/SaveLotDetails`,
    body,
    { headers: getHeaders() },
  )

  return response.data
}
