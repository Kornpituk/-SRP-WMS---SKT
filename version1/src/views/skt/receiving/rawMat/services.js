import axiosIns from '@axios'
import { urlApi } from '@/api'

//---------------------- Import Api for Url *****
const whereHouse = ref(localStorage.getItem('whereHouseName'))

const accessTokenAtStore = sessionStorage.getItem('accessTokenAtStore')


//--------------------------------- Services ----------------------------------------
// *** GenerateJournal
export const fetchGeneratedJournalService = async ({
  poEtlLogDetailJournalID,
}) => {
  try {
    const response = await axiosIns.get(`${urlApi.value}/api/v1/ReceivingPlan/GetByPoEtlLogDetailJournalID/${poEtlLogDetailJournalID}`, {
      headers: {
        accept: '*/*',
        'x-location': whereHouse.value,
        Authorization: `Bearer ${accessTokenAtStore}`,
      },
    })
  
    const data = response.data?.data
    if (data && data.length > 0) {
      const item = data[0]
      
      return {
        success: true,
        data: {
          fullResponse: data,
          poEtlLogDetailJournalID: item.poEtlLogDetailJournalID,
          statusId: item.statusId,
          receiveTypeId: item.receiveTypeId,
        },
      }
    } else {
      return { success: false, message: 'ไม่มีข้อมูลใน responseGener' }
    }
  } catch (error) {
    console.error('fetchGeneratedJournal error:', error)
    
    return { success: false, message: error.message }
  }
}

// *** fetch Header RawMat
export const fetchHeaderReceivingFormService = async ({
  poEtlLogDetailJournalID,
}) => {
  try {
    const response = await axiosIns.get(
      `${urlApi.value}/api/v1/ReceivingForm/get/${poEtlLogDetailJournalID}`,
      {
        headers: {
          accept: '*/*',
          'x-location': `${whereHouse.value}`,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
      },
    )
  
    const data = response.data?.data
    if (data && data.length > 0) {
      return {
        success: true,
        data: data[0], // ส่งข้อมูลตัวแรกกลับไป
      }
    } else {
      return { success: false, message: 'ไม่พบข้อมูล Header' }
    }
  } catch (error) {
    console.error('fetchHeaderReceivingForm error:', error)
    
    return { success: false, message: error.message }
  }
}

// *** fetch Lot RawMat
export const fetchLotReceivingFormService = async ({
  poEtlLogDetailJournalID,
}) => {
  try {
    const response = await axiosIns.get(
      `${urlApi.value}/api/v1/ReceivingForm/get-lot/${poEtlLogDetailJournalID}`,
      {
        headers: {
          accept: '*/*',
          'x-location': whereHouse.value,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
      },
    )
  
    const lotData = response.data?.data || []
  
    return {
      success: true,
      data: lotData,
    }
  } catch (error) {
    console.error('fetchLotReceivingForm error:', error)
    
    return {
      success: false,
      message: error.message,
    }
  }
}

// *** fetch CoA Raw Mat
export const fetchCOAReceivingFormService = async ({
  poEtlLogDetailJournalID,
  onProgress, // callback สำหรับ onDownloadProgress
}) => {
  try {
    const response = await axiosIns.get(
      `${urlApi.value}/api/v1/ReceivingForm/get-coA/${poEtlLogDetailJournalID}`,
      {
        headers: {
          accept: '*/*',
          'x-location': whereHouse.value,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
        onDownloadProgress: onProgress,
      },
    )
  
    return {
      success: true,
      data: response.data?.data || [],
    }
  } catch (error) {
    console.error('fetchCOAReceivingForm error:', error)
    
    return {
      success: false,
      message: error.message,
    }
  }
}

// *** save Header Raw Mat
export const saveHeaderReceivingFormService = async ({
  poEtlLogDetailJournalID,
  body,
}) => {
  try {
    const response = await axiosIns.post(
      `${urlApi.value}/api/v1/ReceivingForm/save/${poEtlLogDetailJournalID}`,
      body,
      {
        headers: {
          accept: '*/*',
          'x-location': whereHouse.value,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
      },
    )
  
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('saveHeaderReceivingForm error:', error)
    
    return {
      success: false,
      message: error.message,
    }
  }
}

// *** save Lot Raw Mat
export const saveLotReceivingFormService = async ({
  poEtlLogDetailJournalID,
  purchaseOrder,
  validateLotNo,
  validateAmount,
  lotCount = 5, // จำนวน lot ที่จะวนลูปตรวจสอบ
}) => {
  const body = []
  let hasError = false
  
  for (let i = 1; i <= lotCount; i++) {
    const actualMakerLotNo = purchaseOrder[`actualMakerLotNo_${i}`]
    const actualAmount = purchaseOrder[`actualAmountUnits_${i}`]
  
    const lotNoError = validateLotNo(i, actualMakerLotNo, actualAmount)
    const amountError = validateAmount(i, actualMakerLotNo, actualAmount)
  
    if (lotNoError || amountError) {
      hasError = true
    }
  
    if (actualMakerLotNo && actualMakerLotNo.trim()) {
      const lot = {
        actualMakerLotNo,
        actualNetCountKgs: purchaseOrder[`actualNetCountKgs_${i}`] || '',
        actualAmountUnits: purchaseOrder[`actualAmountUnits_${i}`] || '',
        actualTotalQuantityKgs: purchaseOrder[`actualTotalQuantityKgs_${i}`] || '',
        customManufacturerName: purchaseOrder[`customManufacturerName_${i}`] || '',
        customLable: purchaseOrder[`customLable_${i}`] || '',
      }
  
      body.push(lot)
    }
  }
  
  if (hasError) {
    throw new Error('Some actualMakerLotNo fields are empty while their respective amounts are not.')
  }
  
  try {
    const response = await axiosIns.post(
      `${urlApi.value}/api/v1/ReceivingForm/save-lot-details/${poEtlLogDetailJournalID}`,
      body,
      {
        headers: {
          accept: '*/*',
          'x-location': whereHouse.value,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
      },
    )
  
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('saveLotReceivingForm error:', error)
    
    return {
      success: false,
      message: error.message,
    }
  }
}

// *** Submit Raw Mat
export const submitReceivingFormService = async ({
  poEtlLogDetailJournalID,
}) => {
  try {
    const response = await axiosIns.post(
      `${urlApi.value}/api/v1/ReceivingForm/Submit/${poEtlLogDetailJournalID}`,
      {},
      {
        headers: {
          accept: '*/*',
          'x-location': whereHouse.value,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
      },
    )
  
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('[submitReceivingForm] error:', error)
    
    return {
      success: false,
      message: error.message,
    }
  }
}

// *** back to edit Raw Mat
export const savePoQtyKgsPcsService = async ({
  poEtlLogDetailJournalID,
  purchasingQuantityPcs,
  purchasingAmountKgs,
}) => {
  try {
    const response = await axiosIns.post(
      `${urlApi.value}/api/v1/Inspection/SavePoQtyKgsPcs/${poEtlLogDetailJournalID}`,
      {},
      {
        headers: {
          accept: '*/*',
          'x-location': whereHouse.value,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
        params: {
          purchasingQuantityPcs,
          purchasingAmountKgs,
        },
      },
    )
  
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('[savePoQtyKgsPcs] error:', error)
    
    return {
      success: false,
      message: error.message,
    }
  }
}
  
