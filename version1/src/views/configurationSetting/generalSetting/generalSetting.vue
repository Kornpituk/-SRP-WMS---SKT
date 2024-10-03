<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useTheme } from 'vuetify'
import { staticPrimaryColor } from '@/plugins/vuetify/theme'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import {
  RouteTransitions,
  Skins,
} from '@core/enums'
import {
  AppContentLayoutNav,
  ContentWidth,
  FooterType,
  NavbarType,
} from '@layouts/enums'
import { themeConfig } from '@themeConfig'

const isNavDrawerOpen = ref(false)
const { theme, skin, appRouteTransition, navbarType, footerType, isVerticalNavCollapsed, isVerticalNavSemiDark, appContentWidth, appContentLayoutNav, isAppRtl, isNavbarBlurEnabled, isLessThanOverlayNavBreakpoint } = useThemeConfig()

// 👉 Primary Color
const vuetifyTheme = useTheme()

// const vuetifyThemesName = Object.keys(vuetifyTheme.themes.value)
const initialThemeColors = JSON.parse(JSON.stringify(vuetifyTheme.current.value.colors))

const colors = [
  'primary',
  'secondary',
  'success',
  'info',
  'warning',
  'error',
  'yellow',
]

import urlImageEng from '@images/icons/kingdom.png'
import urlImageTh from '@images/icons/thailand.png'

const countries = [
  { name: 'th', img: urlImageEng },
  { name: 'en', img: urlImageTh },
]

const setPrimaryCountry = language => {
  console.log("setPrimaryCountry", language)
}

const getCountryFlagPath = (lang, index) => {
  return countries[index].img
}

const setPrimaryColor = color => {
  const currentThemeName = vuetifyTheme.name.value

  vuetifyTheme.themes.value[currentThemeName].colors.primary = color
  localStorage.setItem(`${ themeConfig.app.title }-${ currentThemeName }ThemePrimaryColor`, color)
  localStorage.setItem(`${ themeConfig.app.title }-initial-loader-color`, color)
}

const getBoxColor = (color, index) => index ? color : staticPrimaryColor
const { width: windowWidth } = useWindowSize()

const headerValues = computed(() => {
  const entries = Object.entries(NavbarType)
  if (appContentLayoutNav.value === AppContentLayoutNav.Horizontal)
    return entries.filter(([_, val]) => val !== NavbarType.Hidden)
  
  return entries
})

//------------------- Section Digit ------------------------
import { urlApi } from '@/api'
import axios from '@axios'

// Get access token from localStorage in another page
const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')

const whereHouse = localStorage.getItem('whereHouseName')

const configs = ref([])

//---------------------------- Model Config ---------------
const idUser = ref(null)
const receiveBatch = ref(null)
const showDigit = ref(null)
const showRfid = ref(null)


const getConfig = () => {
  axios.get(`${urlApi.value}/api/v1/Settings`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
    .then(response => {

      configs.value = response.data
      receiveBatch.value = response.data.receiveBatch
      showDigit.value = response.data.showDigit
      showRfid.value = response.data.showRfid
      idUser.value = response.data.id

      // console.log('configs.value:', configs.value)
      localStorage.setItem('configsShowRfdi', response.data.showRfid)
      localStorage.setItem('configsShowDigit', response.data.showDigit)

      // Now `items` contains an array of objects with id and name properties
      // console.log('wareHouse.value At index',wareHouseItemsSearchById.value)

      
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })

    
}

watch(getConfig)

const postConfig = async () => {
  try {
    const response = await axios.post(
      `${urlApi.value}/api/v1/Settings/Update`,
      {
        "id": idUser.value,
        "receiveBatch": receiveBatch.value,
        "showDigit": showDigit.value,
        "showRfid": showRfid.value,
      },
      {
        headers: {
          'accept': '*/*',
          'x-location': `${whereHouse}`,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
        params: {},  // Add any params if needed
      },
    )

    configs.value = response.data
    console.log('configs.value:', configs.value)

    // Now `items` contains an array of objects with id and name properties
    // console.log('wareHouse.value At index', wareHouseItemsSearchById.value);
  } catch (error) {
    // Handle errors
    console.error('Error:', error)
  }
}

const updateShowDigit = () => {
  // Call postConfig function when showDigit changes
  postConfig()
}

//------------------------------------------- range slider Font -------------------------------
const seasonModel = ref('')

const seasons = { 
  0: 'Winter',
  1: 'Spring',
  2: 'Summer',
  3: 'Fall',
  4: 'Cloudy',
}
  



const icons = [
  'mdi-snowflake',
  'mdi-leaf',
  'mdi-fire',
  'mdi-water',
  'mdi-weather-cloudy',
]


const season = val => {
  return icons[val]
}
</script>

<template>
  <!-- 👉 Header -->
  <!-- ----------------        Label Page | Back           ------------------------------------ -->
  <section>
    <!-- Tag page back -->
    <VRow>
      <VCol
        col="12"
        sm="12"
        md="12"
        lg="12"
      >
        <RouterLink :to="{ name: 'dashboards-crm' }">
          <VRow>
            <IconBtn>
              <VIcon
                icon="
                mdi-chevron-left"
              />
            </IconBtn>
            <span style="font-size: 1.5rem;">{{ $t("General Setting") }}</span>
          </VRow>
        </RouterLink>
      </VCol>
    </VRow>
  </section>

  <div class="main-container">
    <VCard class="pa-14 ma-4">
      <!-- Theme Setting -->
      <div>
        <div class="customizer-heading d-flex align-center justify-space-between">
          <div>
            <h6 class="text-h6">
              THEME SETTING
            </h6>
            <span class="text-body-1">Customize & Preview in Real Time</span>
          </div>
        </div>
        <VDivider />
        <!-- SECTION DIGIT -->
        <section title="DIGIT">
          <!-- 👉 Menu Unit -->
          <h6 class="text-base font-weight-regular">
            Set Decimal Units
          </h6>
          <VRadioGroup
            v-model="showDigit"
            inline
            @update:modelValue="updateShowDigit"
          >
            <VRadio
              label="Yes"
              :value="!false"
            />
            <VRadio
              label="No"
              :value="false"
            />
          </VRadioGroup>

          <!-- 👉 Menu Type -->
          <h6 class="text-base font-weight-regular">
            Set Decimals, Monetary Principles
          </h6>
          <VRadioGroup
            v-model="showDigit"
            inline
            @update:modelValue="updateShowDigit"
          >
            <VRadio
              label="Yes"
              :value="!false"
            />
            <VRadio
              label="No"
              :value="false"
            />
          </VRadioGroup>
        </section>
        <!-- !SECTION -->
        
        <!-- SECTION Theming -->
        <section
          title="THEMING"
          :divider="false"
        >
          <!-- 👉 Skin -->
          <h6 class="text-base font-weight-regular">
            Skins
          </h6>
          <VRadioGroup
            v-model="skin"
            inline
          >
            <VRadio
              v-for="[key, val] in Object.entries(Skins)"
              :key="key"
              :label="key"
              :value="val"
            />
          </VRadioGroup>

          <!-- 👉 Theme -->
          <h6 class="mt-3 text-base font-weight-regular">
            Theme
          </h6>
          <VRadioGroup
            v-model="theme"
            inline
          >
            <VRadio
              v-for="themeOption in ['system', 'light', 'dark']"
              :key="themeOption"
              :label="themeOption"
              :value="themeOption"
              class="text-capitalize"
            />
          </VRadioGroup>

          <!-- 👉 Primary color -->
          <h6 class="mt-3 text-base font-weight-regular">
            Primary Color
          </h6>
          <div class="d-flex gap-x-4 mt-2">
            <div
              v-for="(color, index) in colors"
              :key="color"
              style=" border-radius: 0.5rem; block-size: 2.5rem;inline-size: 2.5rem; transition: all 0.25s ease;"
              :style="{ backgroundColor: getBoxColor(initialThemeColors[color], index) }"
              class="cursor-pointer d-flex align-center justify-center"
              :class="{ 'elevation-4': vuetifyTheme.current.value.colors.primary === getBoxColor(initialThemeColors[color], index) }"
              @click="setPrimaryColor(getBoxColor(initialThemeColors[color], index))"
            >
              <VFadeTransition>
                <VIcon
                  v-show="vuetifyTheme.current.value.colors.primary === (getBoxColor(initialThemeColors[color], index))"
                  icon="mdi-check"
                  color="white"
                />
              </VFadeTransition>
            </div>
          </div>
        </section>
        <!-- !SECTION -->

        <!-- SECTION LAYOUT -->
        <section title="LAYOUT">
          <!-- 👉 Content Width -->
          <h6 class="text-base font-weight-regular">
            Content width
          </h6>
          <VRadioGroup
            v-model="appContentWidth"
            inline
          >
            <VRadio
              v-for="[key, val] in Object.entries(ContentWidth)"
              :key="key"
              :label="key"
              :value="val"
            />
          </VRadioGroup>
          <!-- 👉 Navbar Type -->
          <h6 class="mt-3 text-base font-weight-regular">
            {{ appContentLayoutNav === AppContentLayoutNav.Vertical ? 'Navbar' : 'Header' }} Type
          </h6>
          <VRadioGroup
            v-model="navbarType"
            inline
          >
            <VRadio
              v-for="[key, val] in headerValues"
              :key="key"
              :label="key"
              :value="val"
            />
          </VRadioGroup>
          <!-- 👉 Footer Type -->
          <h6 class="mt-3 text-base font-weight-regular">
            Footer Type
          </h6>
          <VRadioGroup
            v-model="footerType"
            inline
          >
            <VRadio
              v-for="[key, val] in Object.entries(FooterType)"
              :key="key"
              :label="key"
              :value="val"
            />
          </VRadioGroup>
          <!-- 👉 Navbar blur -->
          <div class="d-flex align-center justify-space-between">
            <VLabel
              for="customizer-navbar-blur"
              class="text-high-emphasis"
            >
              Navbar Blur
            </VLabel>
            <div>
              <VSwitch
                id="customizer-navbar-blur"
                v-model="isNavbarBlurEnabled"
                class="ms-2"
              />
            </div>
          </div>
        </section>
        <!-- !SECTION -->

        <!-- SECTION Menu -->
        <section title="MENU">
          <!-- 👉 Menu Type -->
          <h6 class="text-base font-weight-regular">
            Menu Type
          </h6>
          <VRadioGroup
            v-model="appContentLayoutNav"
            inline
          >
            <VRadio
              v-for="[key, val] in Object.entries(AppContentLayoutNav)"
              :key="key"
              :label="key"
              :value="val"
            />
          </VRadioGroup>

          <!-- 👉 Collapsed Menu -->
          <div
            v-if="appContentLayoutNav === AppContentLayoutNav.Vertical"
            class="d-flex align-center justify-space-between"
          >
            <VLabel
              for="customizer-menu-collapsed"
              class="text-high-emphasis"
            >
              Collapsed Menu
            </VLabel>
            <div>
              <VSwitch
                id="customizer-menu-collapsed"
                v-model="isVerticalNavCollapsed"
                class="ms-2"
              />
            </div>
          </div>

          <!-- 👉 Semi Dark Menu -->
          <div
            class="align-center justify-space-between"
            :class="vuetifyTheme.global.name.value === 'light' && appContentLayoutNav === AppContentLayoutNav.Vertical ? 'd-flex' : 'd-none'"
          >
            <VLabel
              for="customizer-menu-semi-dark"
              class="text-high-emphasis"
            >
              Semi Dark Menu
            </VLabel>
            <div>
              <VSwitch
                id="customizer-menu-semi-dark"
                v-model="isVerticalNavSemiDark"
                class="ms-2"
              />
            </div>
          </div>
        </section>
        <!-- !SECTION -->

        <!-- SECTION MISC -->
        <section title="MISC">
          <!-- 👉 RTL -->
          <div class="d-flex align-center">
            <VLabel
              for="customizer-rtl"
              class="text-high-emphasis"
            >
              RTL
            </VLabel>
            <div>
              <VSwitch
                id="customizer-rtl"
                v-model="isAppRtl"
                class="ms-2"
              />
            </div>
          </div>

          <!-- 👉 Route Transition -->
          <div class="mt-6">
            <VRow>
              <VCol
                cols="2"
                class="d-flex align-center"
              >
                <VLabel
                  for="route-transition"
                  class="text-high-emphasis"
                >
                  Router Transition
                </VLabel>
              </VCol>

              <VCol cols="10">
                <VSelect
                  id="route-transition"
                  v-model="appRouteTransition"
                  :items="Object.entries(RouteTransitions).map(([key, value]) => ({ key, value }))"
                  item-title="key"
                  item-value="value"
                  single-line
                />
              </VCol>
            </VRow>
          </div>
        </section>
      <!-- !SECTION -->
      </div>

      
      <!-- Theme Setting -->
      <div>
        <!-- SECTION Theming -->
        <section
          title="THEMING"
          :divider="false"
        >
          <!-- 👉 Skin -->
          <h6 class="text-h6">
            Font size
          </h6>
          <span class="text-body-1">Customize/Choose Your Font Size.</span>
          <div class="pa-8">
            <VSlider
              v-model="seasonModel"
              :ticks="seasons"
              min="0"
              max="4"
              :step="1"
              show-ticks="always"
              thumb-label="always"
              tick-size="2"
            >
              <template #thumb-label="{ modelValue }">
                <VIcon :icon="icons[modelValue]" />
              </template>
            </VSlider>
          </div>
        </section>
        <!-- !SECTION -->
      </div>
    </VCard>
  </div>
</template>

<style lang="scss">
.app-customizer {
  .customizer-section {
    padding: 1.25rem;
  }

  .customizer-heading {
    padding-block: 0.875rem;
    padding-inline: 1.25rem;
  }

  .v-navigation-drawer__content {
    display: flex;
    flex-direction: column;
  }
}

.app-customizer-toggler {
  position: fixed !important;
  inset-block-start: 50%;
  inset-inline-end: 0;
  transform: translateY(-50%);
}
</style>
