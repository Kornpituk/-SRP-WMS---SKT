export const useGetCOAFormController = () => {
  const covertValue = ref(null)
  const errorMessageGetCoa = ref(null)
    
  const formatNumber = value => {
    if (value !== null && value !== undefined) {
      covertValue.value = parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

      return covertValue.value
    }
  
    covertValue.value = '0.00'
    
    return covertValue.value
  }
    
  return {
    covertValue,
    errorMessageGetCoa,
    formatNumber,
  }
}
