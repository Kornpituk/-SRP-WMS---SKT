/** แสดงตัวเลข 2 ทศนิยม + " Baht"  หรือ  '-' ถ้า falsy */
const fmtMoney = val => {
  if (val === null || val === undefined || val === '') return '-'
  
  return `${Number(val).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} Baht`
}
