export const useGetCOAFormController = () => {
  // const covertValue = ref(null)

  // const errorMessageGetCoa = ref(null)
    
  const formatNumber = value => {
    if (value !== null && value !== undefined) {
      return parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  
    // covertValue.value = '0.00'
    
    return 0.00
  }
    
  return {
    // covertValue,

    // errorMessageGetCoa,
    formatNumber,
  }
}

export const useFormatDateUtilities = dateInput => {
  if (!dateInput) return '' // ตรวจสอบว่าไม่มีค่า dateInput ส่งเข้ามา

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput

  if (isNaN(date)) return '' // ตรวจสอบว่าค่าไม่สามารถแปลงเป็น Date ได้

  const day = date.getDate().toString().padStart(2, '0') // เพิ่ม 0 ถ้าจำนวนเป็นหลักเดียว
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // เดือนเริ่มจาก 0
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}
