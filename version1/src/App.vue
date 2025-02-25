<script setup>
import { useTheme } from 'vuetify'
import ScrollToTop from '@core/components/ScrollToTop.vue'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import { hexToRgb } from '@layouts/utils'
import ErrorMan from '../src/pages/pages/misc/under-maintenance.vue'

const router = useRouter() 

watchEffect(() => {
  if (!localStorage.getItem('accessTokenAtStore') | localStorage.getItem('nameCompany')){
    // alert('You must log in before accessing this page. Please log in.')
    router.replace('/login')
  }
})

const INACTIVITY_TIMEOUT = 15 * 60 * 1000 // 15 นาที
let timeoutId
let isLoggingOut = false

const debounce = (func, delay) => {
  let timer
  
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => func(...args), delay)
  }
}

const resetTimeout = debounce(() => {
  clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    sessionStorage.removeItem('userSession')  // ล้าง session เฉพาะที่เกี่ยวข้อง
    localStorage.removeItem('accessToken')
    logout()
  }, INACTIVITY_TIMEOUT)
}, 300)

const logout = () => {
  if (isLoggingOut) return
  isLoggingOut = true

  localStorage.removeItem('accessToken')
  router.push('/login')
}

const handleVisibilityChange = () => {
  if (document.visibilityState === 'hidden') {
    timeoutId = setTimeout(() => {
      logout()
    }, 5 * 60 * 1000) // ถ้าเปลี่ยนแท็บนานกว่า 5 นาที → logout
  } else {
    clearTimeout(timeoutId)
  }
}

const handleBeforeUnload = event => {
  const navigationEntries = performance.getEntriesByType('navigation')
  if (navigationEntries.length > 0 && navigationEntries[0].type !== 'reload') {
    logout()
  }
}

onMounted(() => {
  ['mousemove', 'keydown', 'click'].forEach(event =>
    window.addEventListener(event, resetTimeout),
  )
  resetTimeout()

  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  ['mousemove', 'keydown', 'click'].forEach(event =>
    window.removeEventListener(event, resetTimeout),
  )
  clearTimeout(timeoutId)

  document.removeEventListener('visibilitychange', handleVisibilityChange)
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

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
