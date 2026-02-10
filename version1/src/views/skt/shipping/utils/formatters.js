export const formatDateSave = date => {
  if (!date) return null // หากค่าว่างให้คืน null

  const [day, month, year] = date.split('/') // แยกวันที่ตามรูปแบบ dd/mm/yyyy
  if (!day || !month || !year) return null // ตรวจสอบว่าแยกข้อมูลสำเร็จ

  // สร้างวันที่ในรูปแบบ yyyy-mm-dd
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function convertDateFormat(dateString) {
  const parts = dateString.split("/") // แยกส่วนของวันที่
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts // จัดเรียงใหม่

    return `${yyyy}-${mm}-${dd}`
  }

  return "Invalid Date Format" // กรณีรูปแบบไม่ถูกต้อง
}

export const formatDate = date => {
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()

  return `${day}/${month}/${year}`
}
