export function formatNumber(value) {
  if (value === null || value === undefined || value === '') return '-'
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/** ISO → DD/MM/YYYY */
export function formatDate(dateStr) {
  if (!dateStr) return '-'
  
  return new Date(dateStr).toLocaleDateString('en-GB')
}
