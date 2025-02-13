import axios from '@axios'


export const checkSheetLorryFlexiRepository = {

  async getSearchPlan(urlApi, form, whereHouse, accessToken, params = {}, statusID) {
    try {
      const response = await axios.get(`${urlApi}/api/v1/${form}`, {
        headers: {
          'accept': '*/*',
          'x-location': whereHouse,
          Authorization: `Bearer ${accessToken}`,
        },
        params: this.constructParams(params),
      })
        
      if (response && response.data) {
    
        // console.log('Service Response data getSearchPlan:', response.data)
                
        return { data: response.data, success: true }
      } else {
        console.log('Error repo Error If getSearchPlan...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try getSearchPlan...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch getSearchPlan ${error.response?.data?.message || error.message}`)
    }
  },

  async printExportExcel(urlApi, form, type, whereHouse, accessToken, params = {}, statusID) {
    try {
      if(!params){
        throw 'params not f', params
      }else{
        console.log('params repo', params)
      }

      const response = await axios.get(
        `${urlApi}/api/v1/StockUpdate/ExportExcel/${form}/${type}`,
        {
          headers: {
            'accept': '*/*', 
            'x-location': whereHouse,
            Authorization: `Bearer ${accessToken}`,
          },
          params: this.constructParams2(params),
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

  constructParams(params) {
    return {
      ...this.constructSearchParams(params),
      ...this.constructSortParams(params),
      page: params.page || '',
      perPage: params.perPage || '',
    }
  },

  constructParams2(params) {
    return {
      ...this.constructSearchParams(params),
    }
  },

  constructSearchParams(params) {
    return {
      ...this.getBasicSearchParams(params),
      ...this.getAdvancedSearchParams(params),
    }
  },

  getBasicSearchParams(params) {
    return {
      categoryId: params.categoryId || '',
      typeId: params.typeId || '',
      subTypeId: params.subTypeId || '',
      barcode: params.barcode || '',
      productId: params.productId || '',
      productName: params.productName || '',
      unitId: params.unitId || '',
      serialNo: params.serialNo || '',
      zoneId: params.zoneId || '',
      areaId: params.areaId || '',
      subAreaId: params.subAreaId || '',
    }
  },

  getAdvancedSearchParams(params) {
    return {
      searchByCategory: params.searchByCategory || '',
      searchByType: params.searchByType || '',
      searchBySubType: params.searchBySubType || '',
      searchByBarcode: params.searchByBarcode || '',
      searchByProductId: params.searchByProductId || '',
      searchByProductName: params.searchByProductName || '',
      searchByUnit: params.searchByUnit || '',
    }
  },

  constructSortParams(params) {
    return {
      sortByCategory: params.sortByCategory || '',
      sortByType: params.sortByType || '',
      sortBySubType: params.sortBySubType || '',
      sortByBarcode: params.sortByBarcode || '',
      sortByProductId: params.sortByProductId || '',
      sortByProductName: params.sortByProductName || '',
      sortByUnit: params.sortByUnit || '',
      sortByQty: params.sortByQty || '',
      sortByTags: params.sortByTags || '',
      sortByNonTags: params.sortByNonTags || '',
    }
  },

  async getFilterSelectItem(urlApi, form, whereHouse, accessToken, params, typeParams) {
    try {
      let response 
      
      if(form === 'Categories'){
        response = await axios.get(`${urlApi}/api/v1/Product/${form}`, {
          headers: {
            'accept': '*/*',
            'x-location': whereHouse,
            Authorization: `Bearer ${accessToken}`,
          },
        })
      }else if(form === 'warehouse'){
        response = await axios.get(`${urlApi}/api/Auth/GetLocation`, {
          headers: {
            'accept': '*/*',
            'x-location': whereHouse,
            Authorization: `Bearer ${accessToken}`,
          },
        })
      }else if(form === 'zone'){
        response = await axios.get(`${urlApi}/api/v1/Locations/${form}`, {
          headers: {
            'accept': '*/*',
            'x-location': whereHouse,
            Authorization: `Bearer ${accessToken}`,
          },
        })
      }else if(form === 'subArea'){
        response = await axios.get(`${urlApi}/api/v1/Locations/${form}/all`, {
          headers: {
            'accept': '*/*',
            'x-location': whereHouse,
            Authorization: `Bearer ${accessToken}`,
          },
          Params: {
            zoneCode: params,
            areaCode: typeParams,
          },
        })
      }else{
        response = await axios.get(`${urlApi}/api/v1/Locations/${form}/all`, {
          headers: {
            'accept': '*/*',
            'x-location': whereHouse,
            Authorization: `Bearer ${accessToken}`,
          },
          Params: {
            zoneCode: params,
          },
        })
      }
      
      
        
      if (response && response.data) {
    
        // console.log('Service Response data getSearchPlan:', response.data)
                
        return { data: response.data, success: true }
      } else {
        console.log('Error repo Error If getSearchPlan...')
        throw new Error('No data received from the server')
      }
    } catch (error) {
      console.log('Error repo Error Try getSearchPlan...')
      console.error('Error in getProductionPlan:', error)
      throw new Error(`Failed to fetch getSearchPlan ${error.response?.data?.message || error.message}`)
    }
  },

}
  