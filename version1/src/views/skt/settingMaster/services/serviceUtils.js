import axiosIns from '@axios'
import { urlApi } from '@/api'

export const getHeaders = () => ({
  Authorization: `Bearer ${sessionStorage.getItem('accessToken') || ''}`,
  'x-location': sessionStorage.getItem('location') || '',
})

const h = () => ({ headers: getHeaders() })

// eslint-disable-next-line sonarjs/cognitive-complexity
function normalizeListResult(result, transformFromApi) {
  if (Array.isArray(result)) {
    return {
      data: transformFromApi(result),
      total: result.totalCount || result.totalRows,
    }
  }

  if (!result || Array.isArray(result)) return null

  if (Array.isArray(result.data)) {
    return {
      data: transformFromApi(result.data),
      total: result.totalRows ?? result.totalCount,
    }
  }

  if (Array.isArray(result.items)) {
    return {
      data: transformFromApi(result.items),
      total: result.totalRows ?? result.totalCount,
    }
  }

  if (Array.isArray(result.result)) {
    return {
      data: transformFromApi(result.result),
      total: result.totalRows ?? result.totalCount,
    }
  }

  if (result.data && Array.isArray(result.data.data)) {
    return {
      data: transformFromApi(result.data.data),
      total: result.totalRows ?? result.totalCount,
    }
  }

  if (result.result && Array.isArray(result.result.data)) {
    return {
      data: transformFromApi(result.result.data),
      total: result.totalRows ?? result.totalCount,
    }
  }

  return null
}

/**
 * @param {Object} config
 * @param {string} config.resourceName
 * @param {Object} config.map - UI field -> API field
 * @param {boolean} [config.useMock=true]
 * @param {Array} [config.mockData=[]]
 */
export function createCrudService({ resourceName, map, useMock = true, mockData = [] }) {
  const baseUrl = `${urlApi.value}/api/Mst${resourceName}`
  const apiKey = map.id

  const transformFromApi = data => {
    if (!data) return data
    if (Array.isArray(data)) return data.map(transformFromApi)

    const transformed = {}
    for (const [uiKey, apiField] of Object.entries(map)) {
      transformed[uiKey] = data[apiField]
    }

    

    return { ...data, ...transformed }
  }

  const transformToApi = payload => {
    const apiPayload = { ...payload }

    for (const [uiKey, apiField] of Object.entries(map)) {
      if (apiPayload[uiKey] !== undefined) {
        apiPayload[apiField] = apiPayload[uiKey]
        if (uiKey !== apiField) delete apiPayload[uiKey]
      }
    }

    const pkField = map.id
    if (!apiPayload[pkField]) {
      apiPayload[pkField] = 0
    }

    if (apiPayload.isActive === undefined) {
      apiPayload.isActive = true
    }

    return apiPayload
  }

  return {
    getList: async (params = {}) => {
      if (useMock) return transformFromApi(mockData)

      const query = { ...params }
      if (query.sortField && map[query.sortField]) {
        query.sortField = map[query.sortField]
      }

      const response = await axiosIns.get(`${baseUrl}/Get${resourceName}Active`, {
        ...h(),
        params: query,
      })

      
      const normalized = normalizeListResult(response.data, transformFromApi)

      console.log("response", normalized)
      if (normalized) return normalized

      

      return transformFromApi(response.data)
    },

    save: async payload => {
      const apiPayload = transformToApi(payload)
      if (useMock) return payload

      const response = await axiosIns.post(`${baseUrl}/Save${resourceName}`, apiPayload, h())

      return transformFromApi(response.data)
    },

    delete: async id => {
      if (useMock) return { success: true }

      const response = await axiosIns.post(`${baseUrl}/Delete${resourceName}`, { [apiKey]: id }, h())

      return response.data
    },
  }
}
