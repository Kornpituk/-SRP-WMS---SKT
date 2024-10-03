<script setup>
import navItems from '@/navigation/horizontal'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import { themeConfig } from '@themeConfig'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavBarI18n from '@/layouts/components/NavBarI18n.vue'
import NavBarNotifications from '@/layouts/components/NavBarNotifications.vue'
import NavbarShortcuts from '@/layouts/components/NavbarShortcuts.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import NavSearchBar from '@/layouts/components/NavSearchBar.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import { HorizontalNavLayout } from '@layouts'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'

const { appRouteTransition } = useThemeConfig()

// :to="{ name: 'dashboards-main' }"
</script>

<template>
  <HorizontalNavLayout :nav-items="navItems">
    <!-- 👉 navbar -->
    <template #navbar>
      <RouterLink
        :to="{ name: 'dashboards-main' }"
        class="d-flex align-start"
      >
        <VNodeRenderer
          :nodes="themeConfig.app.logo"
          style="min-height: 80px;"
        />

        <h1 class="font-weight-bold leading-normal text-xl">
          {{ themeConfig.app.title }}
        </h1>
      </RouterLink>
      <VSpacer />

      <NavSearchBar trigger-btn-class="ms-lg-n3" />

      <NavBarI18n class="mx-1" />
      <NavbarThemeSwitcher class="me-1" />
      <NavbarShortcuts class="me-1" />
      <NavBarNotifications class="me-3" />
      <UserProfile />
    </template>

    <!-- 👉 Pages -->
    <RouterView v-slot="{ Component, route }">
      <Transition
        :name="appRouteTransition"
        mode="out-in"
      >
        <Component
          :is="Component"
          :key="route.path"
        />
      </Transition>
    </RouterView>

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
    <TheCustomizer v-if="false" />
  </HorizontalNavLayout>
</template>

<style lang="scss">
.logo-size {
  block-size: 20px;
}
</style>

