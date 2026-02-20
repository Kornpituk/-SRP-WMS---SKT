export const helper = (whereHouse, accessTokenAtStore) => {
  const buildHeaders = () => ({
    'accept': '*/*',
    'x-location': `${whereHouse}`,
    Authorization: `Bearer ${accessTokenAtStore}`,
  })

  return {
    buildHeaders,
  }
}


export const dialogImage = (urlApi, accessTokenAtStore, whereHouse) => {
  const codeProduct = ref('')
  const nameProduct = ref('')
  const imgProduct = ref('')
  const barcodeProduct = ref('')
  const categoriesProduct = ref('')
  const groupProduct = ref('')
  const groupSupProduct = ref('')
  const totalProduct = ref('')
  const unitNameProduct = ref('')
  const detailsProduct = ref()
  const showExpansionDialog = ref(false)
  const isDialogImageVisible = ref(false)

  const showDialogImage = (code, name, img, barcode, categories, group, groupSup, total, unitName, details) => {
    codeProduct.value = code
    nameProduct.value = name
    imgProduct.value = img
    barcodeProduct.value = barcode
    categoriesProduct.value = categories
    groupProduct.value = group
    groupSupProduct.value = groupSup
    totalProduct.value = total
    unitNameProduct.value = unitName
    detailsProduct.value = details
    isDialogImageVisible.value = true
    console.log('showImageFunction!!', details)
  }

  const currentProduct = ref({
    name: nameProduct,
    code: codeProduct,
    barcode: barcodeProduct,
    categories: categoriesProduct,
    group: groupProduct,
    supGroup: groupSupProduct,
    total: totalProduct,
    unitName: unitNameProduct,
    details: {
      note: detailsProduct.note,
    },
  })

  return {
    
    codeProduct,
    nameProduct,
    imgProduct,
    barcodeProduct,
    categoriesProduct,
    groupProduct,
    groupSupProduct,
    totalProduct,
    unitNameProduct,
    detailsProduct,
    showExpansionDialog,
    isDialogImageVisible,

    currentProduct,

    showDialogImage,
  }

}

export const formatDecimal = decimal => {
  const configsShowDigit = localStorage.getItem('configsShowDigit')
  if (configsShowDigit == 'true') {
    return Math.ceil(decimal)
  } else {
    return decimal
  }
}
