import axios from '@axios'

export const productionPlanRepository = {

  async getProductionPlan(batchId, sortColumn, sortDirection, urlApi, form, whereHouse, accessToken) {
    console.log('get repo Production Plan...')
    try {
      const response = await axios.get(`${urlApi}/api/v1/${form}/get/${batchId}`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          SortColumn: sortColumn,
          SortDirection: sortDirection,
        },
      })

      console.log("response", response)
      if (response && response.data) {
        console.log('success get repo Production Plan...')
        console.log('Service Response data Production Plan:', response.data.data)
        
        return { data: response.data.data, success: true }
      } else {
        console.log('Error repo Error If Production Plan...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try Production Plan...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch Production Plan for batch ID ${batchId}: ${error.response?.data?.message || error.message}`)
    }
  },

  async getProductionPlanSearch(filter, urlApi, form, whereHouse, accessToken) {
    console.log('get repo Production Plan Search...')
    try {
      const response = await axios.get(`${urlApi}/api/v1/${form}/searchplans`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          StatusID: filter.StatusID,
          ProductionTextSearch: filter.ProductionTextSearch,
          ItemTextSearch: filter.ItemTextSearch,
          ProducingDateFrom: filter.ProducingDateFrom,
          ProducingDateTo: filter.ProducingDateTo,
          LotTextSearch: filter.LotTextSearch,
          SortColumn: filter.SortColumn,
          SortDirection: filter.SortDirection,
        },
      })

      console.log("response", response)
      if (response && response.data) {
        console.log('success get repo Production Plan Search...')
        console.log('Service Response data Production Plan Search:', response.data.data)
        
        return { data: response.data.data, success: true }
      } else {
        console.log('Error repo Error If Production Plan Search...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try Production Plan Search...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch Production Plan Search ${error.response?.data?.message || error.message}`)
    }
  },

  async getProductionPlanMaster(search, urlApi, form, whereHouse, accessToken) {
    console.log('get repo Production Plan...')
    try {
      const response = await axios.get(`${urlApi}/api/v1/${form}/getmasters`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          Search: search,
        },
      })

      console.log("response", response)
      if (response && response.data) {
        console.log('success get repo Production Plan Master...')
        console.log('Service Response data Production Plan Master:', response.data.data)
        
        return { data: response.data.data, success: true }
      } else {
        console.log('Error repo Error If Production Plan Master...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try Production Plan Master...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch Production Plan Master${error.response?.data?.message || error.message}`)
    }
  },

  async getProductionPlanBatch(urlApi, form, whereHouse, accessToken) {
    console.log('get batch repo Production Plan...')
    try {
      const response = await axios.get(`${urlApi}/api/v1/${form}/newId/`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response && response.data) {
        console.log('success get batch repo Production Plan...')

        // console.log('Service Response data Production Plan:', response.data)
        
        return { data: response.data, success: true }
      } else {
        console.log('Error repo Error If Production Plan...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try Production Plan...')
      console.error('Error in getProductionPlanBatch:', error)
      throw new Error(`Failed to fetch Production Plan for batch }: ${error.response?.data?.message || error.message}`)
    }
  },

  async newProductionPlan(batchId, planningId, urlApi, form, whereHouse, accessToken) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/new`, {}, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-location': whereHouse,
          'Authorization': `Bearer ${accessToken}`,
        },
        params: {
          BatchID: batchId,
          PlaningID: planningId,
        },
      })
  
      if (response && response.data) {
        console.log('Repo Response data new production plan:', response.data.data)
        
        return { data: response.data.data, success: true }
      } else {
        throw new Error('No data received from the server')
      }
    } catch (error) {
      throw { success: false, error }
    }
  },

  async deleteBatchProductionPlan(batchId, urlApi, form, whereHouse, accessToken) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/delete`, batchId, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-location': whereHouse,
          'Authorization': `Bearer ${accessToken}`,
        },
      })
  
      if (response && response.data) {
        console.log('Repo Response data delete Batch production plan:', response.data.data)
        
        return { data: response.data.data, success: true }
      } else {
        throw new Error('No data received from the server')
      }
    } catch (error) {
      throw { success: false, error }
    }
  },

  async rejectBatchProductionPlan(statusComment, batchId, urlApi, form, whereHouse, accessToken) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/reject`, batchId, {
        headers: {
          'x-location': whereHouse,
          'Authorization': `Bearer ${accessToken}`,
        },
        params: {
          StatusComment: statusComment,
        },
      })
  
      if (response && response.data) {
        console.log('Repo Response data reject Batch production plan:', response.data.data)
        
        return { data: response.data.data, success: true }
      } else {
        throw new Error('No data received from the server')
      }
    } catch (error) {
      throw { success: false, error }
    }
  },

  async generateLotBatchProductionPlan(batchId, urlApi, form, whereHouse, accessToken) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/genlot?BatchID=${batchId}`, {}, {
        headers: {
          'x-location': whereHouse,
          'Authorization': `Bearer ${accessToken}`,
        },
      })
  
      if (response && response.data) {
        console.log('Repo Response data genlot Batch production plan:', response.data.data)
        
        return { data: response.data.data, success: true }
      } else {
        throw new Error('No data received from the server')
      }
    } catch (error) {
      throw { success: false, error }
    }
  },

  async validateLotBatchProductionPlan(batchId, urlApi, form, whereHouse, accessToken) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/Validate`, batchId, {
        headers: {
          'x-location': whereHouse,
          'Authorization': `Bearer ${accessToken}`,
        },
      })
  
      if (response && response.data) {
        console.log('Repo Response data validate lot Batch production plan:', response.data)
        
        return { data: response.data, success: true }
      } else {
        throw new Error('No data received from the server')
      }
    } catch (error) {
      throw { success: false, error: error.response }
    }
  },

  async submitProductionPlan(planningId, urlApi, form, whereHouse, accessToken) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/submit`, planningId, {
        headers: {
          'x-location': whereHouse,
          'Authorization': `Bearer ${accessToken}`,
        },
      })
  
      if (response && response.data) {
        console.log('Repo Response data submit Batch production plan:', response.data.data)
  
        return { data: response.data.data, success: true }
      } else {
        return { success: false, error: 'Unexpected response format.' }
      }
    } catch (error) {
      // จัดการข้อผิดพลาดและระบุข้อความที่ส่งกลับ
      if (error.response && error.response.data) {
        // กรณี API ส่งข้อผิดพลาดพร้อม response
        console.error('API Error:', error.response.data.message || 'Unknown API error')
        
        return { 
          success: false, 
          error: error.response.data.message || 'Unknown error from server.', 
        }
      } else if (error.request) {
        // กรณีข้อผิดพลาดเกี่ยวกับการเชื่อมต่อเครือข่าย
        console.error('Network Error:', error.message)
        
        return { 
          success: false, 
          error: 'Network error. Please check your internet connection.', 
        }
      } else {
        // กรณีข้อผิดพลาดทั่วไป เช่น การตั้งค่าผิดพลาด
        console.error('Unexpected Error:', error.message)
        
        return { 
          success: false, 
          error: 'An unexpected error occurred. Please try again.', 
        }
      }
    }
  },

  async approveProductionPlan(planningId, urlApi, form, type, whereHouse, accessToken) {
    try {
      let response
      if(type === 'back'){
        response = await axios.post(`${urlApi}/api/v1/${form}/${type}?PlanningID=${planningId}`, {}, {
          headers: {
            'x-location': whereHouse,
            'Authorization': `Bearer ${accessToken}`,
          },
        })
      }else{
        response = await axios.post(`${urlApi}/api/v1/${form}/${type}`, planningId, {
          headers: {
            'x-location': whereHouse,
            'Authorization': `Bearer ${accessToken}`,
          },
        })
      }
  
      if (response && response.data) {
        console.log('Repo Response data approve Batch production plan:', response.data.data)
        
        return { data: response.data.data, success: true }
      } else {
        throw new Error('No data received from the server')
      }
    } catch (error) {
      throw { success: false, error }
    }
  },

  async deleteProductionPlan(planningId, urlApi, form, whereHouse, accessToken) {
    const body = JSON.stringify(planningId)  // แปลงเป็น JSON string
    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/delete`, planningId, {
        headers: {
          'x-location': whereHouse,
          'Authorization': `Bearer ${accessToken}`,
        },
      })
  
      if (response && response.data) {
        console.log('Repo Response data delete production plan:', response.data.data)
        
        return { data: response.data.data, success: true }
      } else {
        throw new Error('No data received from the server')
      }
    } catch (error) {
      throw { success: false, error }
    }
  },

  async saveProductionPlan(formData, urlApi, form, whereHouse, accessToken) {
    try {
      const response = await axios.post(`${urlApi}/api/v1/${form}/save`, formData, {
        headers: {
          'x-location': whereHouse,
          'Authorization': `Bearer ${accessToken}`,
        },
      })
  
      if (response && response.data) {
        console.log('Repo Response data save production plan:', response.data.data)
        
        return { data: response.data.data, success: true }
      } else {
        throw new Error('No data received from the server')
      }
    } catch (error) {
      throw { success: false, error }
    }
  },

  //------------------------------------------- Excel Production Plan --------------------------------------------
  async printExportExcel(urlApi, whereHouse, accessToken, params = {}) {
    try {
      const response = await axios.get(
        `${urlApi}/api/v1/ProductionPlan/ExportExcel/Production/Detail`,
        {
          headers: {
            'accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
            'x-location': whereHouse,
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            StatusID: params.StatusID,
            ProductionTextSearch: params.ProductionTextSearch,
            ItemTextSearch: params.ItemTextSearch,
            ProducingDateFrom: params.ProducingDateFrom,
            ProducingDateTo: params.ProducingDateTo,
            LotTextSearch: params.LotTextSearch,
            SortColumn: params.SortColumn,
            SortDirection: params.SortDirection,
          },
          responseType: 'blob', // รับ response เป็น Blob
        },
      )
  
      if (response && response.data) {
        console.log('Service Response export Excel form:', response.data)
  
        // สร้าง Blob จาก response
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  
        // สร้าง URL สำหรับ Blob
        const blobUrl = URL.createObjectURL(blob)
  
        // สร้างลิงก์สำหรับดาวน์โหลดไฟล์
        const link = document.createElement('a')

        link.href = blobUrl
        link.download = 'exported_file.xlsx' // ตั้งชื่อไฟล์ที่ต้องการให้ดาวน์โหลด
        document.body.appendChild(link)
        link.click()
  
        // ลบลิงก์ออกหลังการดาวน์โหลด
        document.body.removeChild(link)
        URL.revokeObjectURL(blobUrl) // ปิด URL Blob
  
        return { success: true, data: blob }
      } else {
        throw new Error('No data generated for export Excel form')
      }
    } catch (error) {
      console.error('Error in export excel:', error)
      throw new Error(`Failed to export Excel file: ${error.response?.data?.message || error.message}`)
    }
  },

  async getStatusText(urlApi, form, whereHouse, accessToken) {
    console.log('get repo getStatusText...')
    try {
      const response = await axios.get(`${urlApi}/api/v1/${form}/status`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response && response.data) {
        console.log('success get repo getStatusText...')
        console.log('Service Response data getStatusText:', response.data)
        
        return { data: response.data, success: true }
      } else {
        console.log('Error repo Error If getStatusText...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try getStatusText...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch getStatusText ${error.response?.data?.message || error.message}`)
    }
  },
}
