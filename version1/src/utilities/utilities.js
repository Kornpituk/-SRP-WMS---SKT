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
