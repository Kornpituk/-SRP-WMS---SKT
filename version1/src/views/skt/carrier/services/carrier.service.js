import axiosIns from '@axios'
import { urlApi } from '@/api'

const buildHeaders = () => ({
  Authorization: sessionStorage.getItem('accessToken') || '',
  'x-location': sessionStorage.getItem('location') || '',
})

const API_PATH = '/api/v1/setting-master/carrier'

export const fetchCarrierListService = async params => {
  const response = await axiosIns.get(`${urlApi.value}${API_PATH}`, {
    params,
    headers: buildHeaders(),
  })

  return response.data?.data ?? response.data ?? []
}

export const createCarrierService = async payload => {
  const response = await axiosIns.post(`${urlApi.value}${API_PATH}`, payload, {
    headers: buildHeaders(),
  })

  return response.data?.data ?? response.data
}

export const updateCarrierService = async (id, payload) => {
  const response = await axiosIns.put(`${urlApi.value}${API_PATH}/${id}`, payload, {
    headers: buildHeaders(),
  })

  return response.data?.data ?? response.data
}

export const deleteCarrierService = async id => {
  const response = await axiosIns.delete(`${urlApi.value}${API_PATH}/${id}`, {
    headers: buildHeaders(),
  })

  return response.data?.data ?? response.data
}
