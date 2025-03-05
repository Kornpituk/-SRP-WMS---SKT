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
  if (refreshToken && !accessToken) {
    try {
      // ทำการรีเฟรช token
      const response = await axios.post(`${urlApi.value}/api/Auth/refreshToken`, { refreshToken: refreshToken })
      const newAccessToken = response.data.accessToken

      localStorage.setItem('accessToken', newAccessToken)
      
      return next() // รีเฟรช token และอนุญาตให้เข้าถึงหน้า
    } catch (error) {
      console.error("Failed to refresh token", error)
      
      return next({ name: 'login' }) // ถ้าเกิดข้อผิดพลาดให้ส่งไปหน้า login
    }
  }

  next() // ถ้าทุกอย่างถูกต้อง ให้ดำเนินการไปตามปกติ
})


export default router
