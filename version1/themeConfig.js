import { breakpointsVuetify } from '@vueuse/core'
import { VIcon } from 'vuetify/components/VIcon'

// ❗ Logo SVG must be imported with ?raw suffix
import logo from '@images/logo.svg?raw'
import { defineThemeConfig } from '@core'
import { RouteTransitions, Skins } from '@core/enums'
import { AppContentLayoutNav, ContentWidth, FooterType, NavbarType } from '@layouts/enums'

import { urlApi } from '@/api'
// eslint-disable-next-line regex/invalid
import axios from 'axios'
import { watchEffect } from 'vue'

// Get access token from localStorage in another page
const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')

const whereHouse = localStorage.getItem('whereHouseName')

const showRfid = ref(null)
const bigyaFormat = ref(null)

const getConfig = () => {
  axios.get(`${urlApi.value}/api/v1/Settings`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
    .then(response => {
      showRfid.value = response.data.showRfid
      bigyaFormat.value = response.data.bigyaFormat

      localStorage.setItem('configsShowRfdi', response.data.showRfid)
      localStorage.setItem('configsShowExpiryDate', response.data.bigyaFormat)

      console.log('configsShowExpiryDate in theme', localStorage.getItem('configsShowExpiryDate'))

      // Now `items` contains an array of objects with id and name properties
      // console.log('wareHouse.value At index',wareHouseItemsSearchById.value)

      
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })

    
}

watch(getConfig)

const nameCompany = ref('')
const utlLogoCompany = ref('')

watchEffect(() => {
  nameCompany.value = localStorage.getItem('nameCompany')
  utlLogoCompany.value = localStorage.getItem('companyLogo')
})

export const { themeConfig, layoutConfig } = defineThemeConfig({
  app: {
    // title: 'materialize',
    title: nameCompany.value,

    // ❗ if you have SVG logo and want it to adapt according to theme color, you have to apply color as `color: rgb(var(--v-global-theme-primary))`
    // logo: h('div', { innerHTML: logo, style: 'line-height:0; color: rgb(var(--v-global-theme-primary))' }),
    logo: h('img', { src: utlLogoCompany.value, alt: 'app-logo' }),
    contentWidth: ContentWidth.Fluid,
    contentLayoutNav: AppContentLayoutNav.Vertical,
    overlayNavFromBreakpoint: breakpointsVuetify.md + 16,
    enableI18n: true,
    theme: 'system',
    isRtl: false,
    skin: Skins.Default,
    routeTransition: RouteTransitions.Fade,
    iconRenderer: VIcon,
  },
  navbar: {
    type: NavbarType.Sticky,
    navbarBlur: true,
  },
  footer: { type: FooterType.Static },
  verticalNav: {
    isVerticalNavCollapsed: false,
    defaultNavItemIconProps: { icon: 'mdi-circle' },
    isVerticalNavSemiDark: false,
  },
  horizontalNav: {
    type: 'sticky',
    transition: 'slide-y-reverse-transition',
  },
  icons: {
    chevronDown: { icon: 'mdi-chevron-down' },
    chevronRight: { icon: 'mdi-chevron-right' },
    close: { icon: 'mdi-close' },
    verticalNavPinned: { icon: 'custom-vertical-nav-header-arrow', size: 50 },
    verticalNavUnPinned: { icon: 'custom-vertical-nav-header-arrow', size: 50 },
    sectionTitlePlaceholder: { icon: 'mdi-minus' },
  },
})
