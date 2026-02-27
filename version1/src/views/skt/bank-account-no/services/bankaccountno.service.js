import axiosIns from '@axios'
import { urlApi } from '@/api'

const buildHeaders = () => ({
  Authorization: sessionStorage.getItem('accessToken') || '',
  'x-location': sessionStorage.getItem('location') || '',
})

const API_PATH = '/api/v1/setting-master/bank-account-no'

export const fetchBankAccountNoListService = async params => {
  const response = await axiosIns.get(`${urlApi.value}${API_PATH}`, {
    params,
    headers: buildHeaders(),
  })

  return response.data?.data ?? response.data ?? []
}

export const createBankAccountNoService = async payload => {
  const response = await axiosIns.post(`${urlApi.value}${API_PATH}`, payload, {
    headers: buildHeaders(),
  })

  return response.data?.data ?? response.data
}

export const updateBankAccountNoService = async (id, payload) => {
  const response = await axiosIns.put(`${urlApi.value}${API_PATH}/${id}`, payload, {
    headers: buildHeaders(),
  })

  return response.data?.data ?? response.data
}

export const deleteBankAccountNoService = async id => {
  const response = await axiosIns.delete(`${urlApi.value}${API_PATH}/${id}`, {
    headers: buildHeaders(),
  })

  return response.data?.data ?? response.data
}
