import axiosIns from '@axios'
import { urlApi } from '@/api'

//---------------------- Import Api for Url *****
const whereHouse = ref(localStorage.getItem('whereHouseName'))

const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')

//--------------------------- Header ------------------------------------

const headers = () => ({
  accept: '*/*',
  'x-location': whereHouse.value,
  Authorization: `Bearer ${accessTokenAtStore}`,
})

//-------------------------- Services ------------------------------------

// *** generate Insp
export const generateInspectionService = id => {
  return axiosIns.post(`${urlApi.value}/api/v1/Inspection/Generate/${id}`, {}, {
    headers: headers(),
  })
}

// *** generate JournalId Insp
export const getReceivingPlanByJournalIdService = id => {
  return axiosIns.get(`${urlApi.value}/api/v1/ReceivingPlan/GetByPoEtlLogDetailJournalID/${id}`, {
    headers: headers(),
  })
}

// *** fetch Head Insp
export const fetchInspectionHeaderService = id => {
  return axiosIns.get(`${urlApi.value}/api/v1/Inspection/View/${id}`, {
    headers: headers(),
  })
}

// *** fetch Analysis Insp
export const getAnalysisInspService = id => {
  return axiosIns.get(`${urlApi.value}/api/v1/Inspection/GetAnalyticalItems/${id}`, {
    headers: headers(),
  })
}
