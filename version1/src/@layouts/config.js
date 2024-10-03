import { breakpointsVuetify } from '@vueuse/core'
import { AppContentLayoutNav, ContentWidth, FooterType, NavbarType } from '@layouts/enums'

export const config = {
  app: {
    title: 'title',
    logo: h('img', { src: '/src/assets/logo.svg' }),

    // logo: () => h('img', { src: 'assets/colored-logo.png' }, null),
    contentWidth: ref(ContentWidth.Boxed),
    contentLayoutNav: ref(AppContentLayoutNav.Vertical),
    overlayNavFromBreakpoint: breakpointsVuetify.md,
    enableI18n: true,
    isRtl: ref(false),
  },
  navbar: {
    type: ref(NavbarType.Sticky),
    navbarBlur: ref(true),
  },
  footer: { type: ref(FooterType.Static) },
  verticalNav: {
    isVerticalNavCollapsed: ref(false),
    defaultNavItemIconProps: { icon: 'mdi-circle-outline', width: '50px', height: '50px', color: 'primary' },
  },
  horizontalNav: {
    type: ref('sticky'),
  },
  icons: {
    chevronDown: { icon: 'mdi-chevron-down', width: '50px', height: '50px' },
    chevronRight: { icon: 'mdi-chevron-right', width: '50px', height: '50px' },
    close: { icon: 'mdi-close', width: '50px', height: '50px' },
    verticalNavPinned: { icon: 'mdi-record-circle-outline', width: '50px', height: '50px' },
    verticalNavUnPinned: { icon: 'mdi-radiobox-blank', width: '50px', height: '50px', color: 'primary' },
    sectionTitlePlaceholder: { icon: 'mdi-minus' },
  },
}
