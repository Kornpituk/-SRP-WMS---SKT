<script setup>
import { useTheme } from 'vuetify'
import ScrollToTop from '@core/components/ScrollToTop.vue'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import { hexToRgb } from '@layouts/utils'
import ErrorMan from '../src/pages/pages/misc/under-maintenance.vue'

const router = useRouter() 

watchEffect(() => {
  console.log('watch effect Now', localStorage.getItem('accessTokenAtStore'))
  if (!localStorage.getItem('accessTokenAtStore') | localStorage.getItem('nameCompany')){
    // alert('You must log in before accessing this page. Please log in.')
    router.replace('/login')
  }
})

//------------------------ Function check SessionsToken Time Out --------------------
//-------*** ยังไม่จำเป็นปิดไปก่อน
// const sessionExpiry = ref(null)

// const checkSessionExpiry = () => {
//   console.log('check session!')

//   const now = new Date().getTime()
//   const expiry = localStorage.getItem('sessionExpiry')

//   if (expiry) {
//     const timeLeft = expiry - now
//     if (timeLeft > 0) {
//       // แปลง timeLeft จาก milliseconds เป็น minutes and seconds
//       const minutesLeft = Math.floor(timeLeft / (1000 * 60))
//       const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000)

//       console.log(`Time left before session expires: ${minutesLeft} minutes and ${secondsLeft} seconds`)
//     } else {
//       localStorage.removeItem('sessionExpiry')
//       alert('Session expired. Please log in again.')
//       router.push('/login') // เปลี่ยนเส้นทางไปยังหน้าเข้าสู่ระบบ
//     }
//   }
// }

// watchEffect(() => {
//   console.log('sessionExpiry', localStorage.getItem('sessionExpiry'))

//   sessionExpiry.value = localStorage.getItem('sessionExpiry')

//   if (sessionExpiry.value) {
//     setInterval(checkSessionExpiry, 1000 * 10) // ตรวจสอบทุกๆ นาที
//   }

// })

//---------------------------------------------------------------------------------

const {
  syncInitialLoaderTheme,
  syncVuetifyThemeWithTheme: syncConfigThemeWithVuetifyTheme,
  isAppRtl,
  handleSkinChanges,
} = useThemeConfig()

const { global } = useTheme()

// ℹ️ Sync current theme with initial loader theme
syncInitialLoaderTheme()
syncConfigThemeWithVuetifyTheme()
handleSkinChanges()
</script>

<template>
  <VLocaleProvider :rtl="isAppRtl">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <!--
        <RouterView />
        <ScrollToTop /> 
      --> 
      <RouterView />
      <ScrollToTop />
      <!-- <ErrorMan /> -->
    </VApp>
  </VLocaleProvider>
</template>
