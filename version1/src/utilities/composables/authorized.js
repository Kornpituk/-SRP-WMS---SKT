import authorizedJson from "./authorized.json"

// ดึง userData จาก sessionStorage (สมมติ login แล้วมีเก็บ user name)
// const userData =  ref('')

function getUserPermissions(username) {
  // const userData = ref(JSON.parse(sessionStorage.getItem("userData") || "{}"))
  
  const mainKey = Object.keys(authorizedJson)[0]
  const data = authorizedJson[mainKey]

  const menus = data[0]   // mapping เมนู
  const users = data.slice(2) // record user\

  // console.log("user Aut", userData.value)

  // หา user
  const user = users.find(u => u["Column2"] === username)
  if (!user) return {}

  const permissions = {}

  // ฟังก์ชัน normalize ค่า
  const normalize = val => val === true

  // loop menu
  for (const col in menus) {
    const menuName = menus[col]
    if (!menuName) continue

    const visibleCol = col
    const executeCol = "Column" + (parseInt(col.replace("Column", "")) + 1)

    permissions[menuName] = {
      visible: normalize(user[visibleCol]),
      execute: normalize(user[executeCol]),
    }
  }

  return permissions
}

export function hasPermission(menuName, action) {
  const userData = ref(JSON.parse(sessionStorage.getItem("userData") || "{}"))
  
  const username = userData.value?.username || userData.value?.Column2
  const permissions = getUserPermissions(username)

  return permissions?.[menuName]?.[action] || false
}
