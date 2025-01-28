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
          return { name: 'inventory-stockUpdate' }
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


// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
// router.beforeEach( to =>  {

//   if(to.href != "/login" && to.href != "/selectWhereHouse"){
//     console.log("router.beforeEach")

//     const accessToken = localStorage.getItem('accessTokenAtStore')
//     const whereHouse = localStorage.getItem('whereHouseName')
//     const refreshToken = localStorage.getItem('refreshToken')

//     axios.post(`${urlApi.value}/api/Auth/refreshToken`, { refreshToken: refreshToken }, {
//       headers: {
//         'accept': '*/*',
//         'x-location': `${whereHouse}`,
//         Authorization: `Bearer ${accessToken}`,
//       },
//     }).then(response => {

      
//     })
//     router.replace("/login")
//   }

// })


export default router
