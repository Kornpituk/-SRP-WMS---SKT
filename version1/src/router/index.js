import SelectWhereHouse from '@/pages/selectWhereHouse.vue'
import { setupLayouts } from 'virtual:generated-layouts'
import { watchEffect } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'

// watchEffect(() => {
//   console.log('AccessToken', localStorage.getItem('accessToken'))
// })



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: to => {
        // const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        // const userRole = (userData && userData.role) ? userData.role : null
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken)
          return { name: 'skt-stockUpdate' }
        else if(!accessToken) {
          return { name: 'login' }
        }

        // return { name: 'login', query: to.query }
        return { name: 'login' }
      },
    },
    {
      path: '/pages/user-profile',
      redirect: () => ({ name: 'pages-user-profile-tab', params: { tab: 'profile' } }),
    },
    {
      path: '/pages/account-settings',
      redirect: () => ({ name: 'pages-account-settings-tab', params: { tab: 'account' } }),
    },
    {
      path: '/selectWhereHouse',
      component: SelectWhereHouse,
    },
    ...setupLayouts(routes),
  ],
})

router.beforeEach(async (to, from, next) => {
  const accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')
  
  // ถ้าไม่มี accessToken และไม่ใช่หน้า login หรือ selectWhereHouse
  if (!accessToken && to.name !== 'login' && to.name !== 'selectWhereHouse') {
    return next({ name: 'login' }) // ส่งไปหน้า login
  }

  // ถ้ามี accessToken แต่กำลังจะไปหน้า login หรือ selectWhereHouse
  if (accessToken && (to.name === 'login' || to.name === 'selectWhereHouse')) {
    return next({ name: 'skt-stockUpdate' }) // ส่งไปหน้า stockUpdate
  }

  // ถ้ามี refreshToken และ accessToken ตรวจสอบการรีเฟรช token
  // if (refreshToken && !accessToken) {
  //   try {
  //     // ทำการรีเฟรช token
  //     const response = await axios.post(`${urlApi.value}/api/Auth/refreshToken`, { refreshToken: refreshToken })
  //     const newAccessToken = response.data.accessToken

  //     localStorage.setItem('accessToken', newAccessToken)
      
  //     return next() // รีเฟรช token และอนุญาตให้เข้าถึงหน้า
  //   } catch (error) {
  //     console.error("Failed to refresh token", error)
      
  //     return next({ name: 'login' }) // ถ้าเกิดข้อผิดพลาดให้ส่งไปหน้า login
  //   }
  // }

  next() // ถ้าทุกอย่างถูกต้อง ให้ดำเนินการไปตามปกติ
})

// ฟังก์ชันสำหรับตรวจสอบการปิดแท็บหรือปิดเบราว์เซอร์
function setupBrowserCloseDetection() {
  // ฟังก์ชันที่จะทำงานเมื่อมีการปิดแท็บหรือเบราว์เซอร์
  function handleTabClosing() {
    // ล้างค่า token ต่างๆ จาก localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('accessTokenAtStore')
    localStorage.removeItem('refreshToken')
    
    // สามารถเพิ่มการล้างค่าจาก sessionStorage ได้ด้วยถ้าต้องการ
    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem('accessTokenAtStore')
    sessionStorage.removeItem('refreshToken')
    
    // ถ้ามีการใช้ cookies สามารถล้าง cookies ได้ด้วย
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = 'accessTokenAtStore=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }

  // เพิ่ม event listener สำหรับ beforeunload event
  // event นี้จะถูกเรียกเมื่อผู้ใช้พยายามปิดแท็บหรือเบราว์เซอร์
  window.addEventListener('beforeunload', function(event) {
    handleTabClosing()
    
    // บางเบราว์เซอร์ต้องการให้กำหนดค่า returnValue หรือ return string
    // เพื่อแสดง dialog ยืนยันการออกจากหน้าเว็บ (แต่ไม่จำเป็นสำหรับกรณีนี้)
    // event.returnValue = 'คุณแน่ใจหรือไม่ว่าต้องการออกจากหน้านี้?';
    // return 'คุณแน่ใจหรือไม่ว่าต้องการออกจากหน้านี้?';
  })
  
  // เพิ่ม event listener สำหรับ unload event
  // event นี้จะถูกเรียกเมื่อเบราว์เซอร์กำลังจะปิดหรือเปลี่ยนหน้า
  window.addEventListener('unload', function() {
    handleTabClosing()
  })
  
  // เพิ่ม event listener สำหรับ visibilitychange event
  // ใช้ตรวจสอบเมื่อผู้ใช้เปลี่ยนแท็บหรือเบราว์เซอร์ (ไม่ได้ปิดโดยตรง)
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
      // ในบางกรณีอาจไม่ต้องการล้างค่าเมื่อเพียงแค่เปลี่ยนแท็บ
      // ดังนั้นสามารถเอา code ข้างล่างออกได้ถ้าไม่ต้องการ
      // handleTabClosing();
    }
  })
  
  console.log('Browser close detection has been set up successfully')
}

// เรียกใช้ฟังก์ชันเพื่อเริ่มการตรวจสอบ
setupBrowserCloseDetection()


export default router
