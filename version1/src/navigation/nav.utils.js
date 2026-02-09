export function getUserFromLocalStorage() {
  const raw = sessionStorage.getItem("userData")
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}


// user ที่ถูกจำกัดสิทธิ์
const LIMITED_USER_IDS = ['20303', '20302']

// เมนูที่อนุญาตให้เห็น
const LIMITED_MENU_KEYS = ['shipment']

export function validateMenuByUser(menus, user) {
  if (!user || !user.id) return menus

  // ถ้าเป็น user กลุ่มจำกัด
  if (LIMITED_USER_IDS.includes(String(user.id))) {
    return menus.filter(menu =>
      LIMITED_MENU_KEYS.includes(menu.key),
    )
  }

  // user อื่น ๆ เห็นทุกเมนู
  return menus
}
