export const validateBatchSale = (batchSale, packagingkgs1, packagingPcs1, packagingkgs2, packagingPcs2) => {
  const batchSaleInt = parseInt(batchSale) || 0
  const packagingkgs1Int = parseInt(packagingkgs1) || 0
  const packagingPcs1Int = parseInt(packagingPcs1) || 0
  const packagingkgs2Int = parseInt(packagingkgs2) || 0
  const packagingPcs2Int = parseInt(packagingPcs2) || 0
  
  const totalKgs1 = packagingkgs1Int * packagingPcs1Int
  const totalKgs2 = packagingkgs2Int * packagingPcs2Int
  const total = totalKgs1 + totalKgs2
  
  return batchSaleInt >= total
}
