<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { VNodeRenderer } from './VNodeRenderer'
import { useLayouts } from '@layouts'
import {
  VerticalNavGroup,
  VerticalNavLink,
  VerticalNavSectionTitle,
} from '@layouts/components'
import { config } from '@layouts/config'
import { injectionKeyIsVerticalNavHovered } from '@layouts/symbols'

const props = defineProps({
  tag: {
    type: [
      String,
      null,
    ],
    required: false,
    default: 'aside',
  },
  navItems: {
    type: null,
    required: true,
  },
  isOverlayNavActive: {
    type: Boolean,
    required: true,
  },
  toggleIsOverlayNavActive: {
    type: Function,
    required: true,
  },
})

import { urlApi } from '@/api'
// eslint-disable-next-line regex/invalid
import axios from 'axios'
import { watch, watchEffect } from 'vue'

const logoCompanyApi = ref('')

const getInfoCompany = () => {
  axios.get(`${urlApi.value}/api/v1/Company`, {
  })
    .then(response => {
      logoCompanyApi.value =  response.data.logo
    })
    .catch(error => {
      console.error('Error:', error)
    })
}

const refNav = ref()
const { width: windowWidth } = useWindowSize()
const isHovered = useElementHover(refNav)

watch(()=> {
  // console.log("isHovered", typeof isHovered, useElementHover(false))
})

provide(injectionKeyIsVerticalNavHovered, isHovered)

const {
  isVerticalNavCollapsed: isCollapsed,
  isLessThanOverlayNavBreakpoint,
  isVerticalNavMini,
  isAppRtl,
} = useLayouts()

const hideTitleAndIcon = isVerticalNavMini(windowWidth, isHovered)

const resolveNavItemComponent = item => {
  if ('heading' in item)
    return VerticalNavSectionTitle
  if ('children' in item)
    return VerticalNavGroup
  
  return VerticalNavLink
}

const route = useRoute()

watch(() => route.name, () => {
  props.toggleIsOverlayNavActive(false)
})

const isVerticalNavScrolled = ref(false)
const updateIsVerticalNavScrolled = val => isVerticalNavScrolled.value = val

const handleNavScroll = evt => {
  isVerticalNavScrolled.value = evt.target.scrollTop > 0
}

const formatNameCompany = title => {
  const maxLineLength = 20

  if (title.length > 2 * maxLineLength) {
    const firstLine = title.slice(0, maxLineLength)
    const secondLine = title.slice(maxLineLength, 2 * maxLineLength)
    const thirdLine = title.slice(2 * maxLineLength)

    return `<span style="font-size: 14px;">${firstLine}</span><br><span style="font-size: 14px;">${secondLine}</span><br><span style="font-size: 10px;">${thirdLine}</span>`
  } else if (title.length > maxLineLength) {
    const firstLine = title.slice(0, maxLineLength)
    const secondLine = title.slice(maxLineLength)

    return `<span style="font-size: 16px;">${firstLine}</span><br><span style="font-size: 16px;">${secondLine}</span>`
  }
  
  return title
}

const router = useRouter()

const pushBtnTable = () => {
  router.push('/dashboards/main')

  // router.push('/skt/receiving')
}

const logoCompany = ref('')
const nameCompany = ref('')

const computedFontSize = computed(() => {
  if (!nameCompany.value) return 16
  if (nameCompany.value.length > 30) return 12
  if (nameCompany.value.length > 20) return 14
  
  return 16
})

watchEffect(() => {
  logoCompany.value = localStorage.getItem('companyLogo')
  nameCompany.value = localStorage.getItem('companyName')
  getInfoCompany()
})
</script>

<template>
  <Component
    :is="props.tag"
    ref="refNav"
    class="layout-vertical-nav"
    :class="[
      {
        'overlay-nav': isLessThanOverlayNavBreakpoint(windowWidth),
        'hovered': isHovered,
        'visible': isOverlayNavActive,
        'scrolled': isVerticalNavScrolled,
      },
    ]"
  >
    <!-- 👉 Header -->
    <div class="nav-header">
      <slot name="nav-header">
        <VRow>
          <VCol
            cols="12"
            class="d-flex justify-center pa-0 align-center app-title-wrapper cursor-pointer"
            @click="pushBtnTable"
          >
            <VNodeRenderer
              v-if="false"
              :nodes="config.app.logo"
              style="width: 60%;"
            />
            <VImg
              v-if="true"
              :src="logoCompanyApi"
              class="company-logo"
            />
          </VCol>
          <VCol
            cols="12"
            class="d-flex align-center justify-center gap-x-2 pt-0 "
          >
            <Transition name="vertical-nav-app-title">
              <h1
                v-show="!hideTitleAndIcon"
                class="company-name-auto"
                :style="{ fontSize: computedFontSize + 'px' }"
              >
                {{ nameCompany }}
              </h1>
            </Transition>
          </VCol>
        </VRow>
        <!-- 👉 Vertical nav actions -->
        <!-- Show toggle collapsible in >md and close button in <md -->
        <template v-if="!isLessThanOverlayNavBreakpoint(windowWidth)">
          <Component
            :is="config.app.iconRenderer || 'div'"
            v-show="isCollapsed && !hideTitleAndIcon"
            class="header-action"
            @click="isCollapsed = !isCollapsed"
          >
            <VIcon
              size="large"
              icon="mdi-chevron-double-right"
            />
          </Component>
          <Component 
            :is="config.app.iconRenderer || 'div'"
            v-show="!isCollapsed && !hideTitleAndIcon"
            class="header-action"
            
            @click="isCollapsed = !isCollapsed"
          >
            <VIcon
              size="large"
              icon="mdi-chevron-double-right"
            />
          </Component>
        </template>
        <template v-else>
          <Component
            :is="config.app.iconRenderer || 'div'"
            class="header-action"
            v-bind="config.icons.close"
            @click="toggleIsOverlayNavActive(false)"
          />
        </template>
      </slot>
    </div>
    <slot name="before-nav-items">
      <div class="vertical-nav-items-shadow" />
    </slot>
    <slot
      name="nav-items"
      :update-is-vertical-nav-scrolled="updateIsVerticalNavScrolled"
    >
      <PerfectScrollbar
        :key="isAppRtl"
        tag="ul"
        class="nav-items"
        :options="{ wheelPropagation: false }"
        @ps-scroll-y="handleNavScroll"
      >
        <Component
          :is="resolveNavItemComponent(item)"
          v-for="(item, index) in navItems"
          :key="index"
          :item="item"
          style="font-size: 12px;"
        />
      </PerfectScrollbar>
    </slot>
  </Component>
</template>

<style lang="scss" scoped>
.app-logo {
  display: flex;
  align-items: center;
  column-gap: 0.5rem;

  .app-logo-title {
    font-size: 12px;
    font-weight: 600;
    line-height: 1.75rem;
    text-transform: capitalize;
  }
}

// ใน style scoped
.company-logo {
  margin: auto;
  max-block-size: 60px;
  max-inline-size: 120px;
  object-fit: contain;
}

.company-name {
  display: block;
  overflow: hidden;
  font-size: clamp(12px, 2.5vw, 18px);
  max-inline-size: 200px;
  text-align: center;
  white-space: nowrap;
}
</style>

<style lang="scss">
@use "@configured-variables" as variables;
@use "@layouts/styles/mixins";

// 👉 Vertical Nav
.layout-vertical-nav {
  position: fixed;
  z-index: variables.$layout-vertical-nav-z-index;
  display: flex;
  flex-direction: column;
  block-size: 100%;
  inline-size: variables.$layout-vertical-nav-width;
  inset-block-start: 0;
  inset-inline-start: 0;
  transition: transform 0.25s ease-in-out, inline-size 0.25s ease-in-out, box-shadow 0.25s ease-in-out;
  will-change: transform, inline-size;

  .nav-header {
    display: flex;
    align-items: center;

    .header-action {
      cursor: pointer;
    }
  }

  .app-title-wrapper {
    margin-inline-end: auto;
  }

  .nav-items {
    block-size: 100%;

    // ℹ️ We no loner needs this overflow styles as perfect scrollbar applies it
    // overflow-x: hidden;

    // // ℹ️ We used `overflow-y` instead of `overflow` to mitigate overflow x. Revert back if any issue found.
    // overflow-y: auto;
  }

  .nav-item-title {
    overflow: hidden;
    margin-inline-end: auto;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // 👉 Collapsed
  .layout-vertical-nav-collapsed & {
    &:not(.hovered) {
      inline-size: variables.$layout-vertical-nav-collapsed-width;
    }
  }

  // 👉 Overlay nav
  &.overlay-nav {
    &:not(.visible) {
      transform: translateX(-#{variables.$layout-vertical-nav-width});

      @include mixins.rtl {
        transform: translateX(variables.$layout-vertical-nav-width);
      }
    }
  }
}
</style>
 