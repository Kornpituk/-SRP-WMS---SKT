<script setup>
import navItems from '@/navigation/vertical'
import { useAuthExStore } from '@/stores/AuthExpireStore'
import { useThemeConfig } from '@core/composable/useThemeConfig'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavBarI18n from '@/layouts/components/NavBarI18n.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import WhereHouse from '@/layouts/components/WhereHouse.vue'
import { departmentData } from '@/utilities/department'


// @layouts plugin
import axios from '@axios'
import { VerticalNavLayout } from '@layouts'

const { appRouteTransition, isLessThanOverlayNavBreakpoint, isVerticalNavCollapsed } = useThemeConfig()
const { width: windowWidth } = useWindowSize()

import { useCookieStore, useItemStore } from '@/stores/skt/receingFormStore/itemStore'

const itemStore = useItemStore()

// ℹ️ Provide animation name for vertical nav collapse icon.
const verticalNavHeaderActionAnimationName = ref(null)

watch(isVerticalNavCollapsed, val => {
  verticalNavHeaderActionAnimationName.value = val ? 'rotate-180' : 'rotate-back-180'
})

const router = useRouter() 
const authStore = useAuthExStore()

const NameUser = ref('addmin001')
const NameDepartment = ref('')
const NameRole = ref('')
const whereHouseName = localStorage.getItem('WarehouseNameAtIcons')

function checkDepartment(wareHouseName) {
  // ค้นหาในข้อมูล
  const found = departmentData.value.find(
    person =>
      `${person.firstName}` === wareHouseName,
  )

  const result = ref('')

  // อัปเดตค่าของ NameDepartment
  if (found) {
    NameDepartment.value = found.department
    sessionStorage.setItem('department', found.department)
    result.value = found.department
    NameRole.value = found.role
  } else {
    NameDepartment.value = 'nothing'
    result.value = 'nothing'
    NameRole.value = 'nothing'
  }

  return result.value
}

watchEffect(() => {
  checkDepartment(itemStore.getItemDetails('UserDataCookies').firstName)
})

import { urlApi } from '@/api'
import { onMounted, watchEffect } from 'vue'

const whereHouseSelectedItem = ([])
const whereRoomNameSet = ref('')

const items = []


// Get access token from localStorage in another page
const accessToken = localStorage.getItem('accessTokenAtStore')

// console.log("accessToken:",accessToken)

const wareHouseName = ref('adasdsdad')
const wareHouseId = ref('')


const GetWhereHouse = () => {
  axios.get(`${urlApi.value}/api/Auth/GetLocation`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(response => {
      const responseData = response.data

      wareHouseName.value = responseData[0].name
      wareHouseId.value = responseData[0].id

      // Extracting the id and name properties
      for (let i = 0; i < responseData.length; i++) {
        const { id, name } = responseData[i]

        items.push({ id, name })
      }

      for (let i = 0; i < items.length; i++) {
        // console.log('items loop:'+[i],items[i])

        if ( items[i].id ===  whereHouseName){
          // console.log('items[i].Name:',items[i].name)
          wareHouseName.value = items[i].name
          wareHouseId.value = items[i].id
          localStorage.setItem('WarehouseNameAtIcons', items[i].name)
          localStorage.setItem('WarehouseIDAtIcons', items[i].id)
          break
        } else {
          // console.log('items'+items[i].id,'Not Match',whereHouseName)
        }
      }


      // console.log('localStorage Warehouse: ',localStorage.getItem('WarehouseNameAtIcons'))
      whereRoomNameSet.value = localStorage.getItem('WarehouseNameAtIcons')

      // Now `items` contains an array of objects with id and name properties
      // console.log('items location whereHouse At menu Warehouse:',items)

    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })

    
}

watchEffect(() => {
  NameUser.value = localStorage.getItem('userCheck')

  // console.log("AUTH : " + authStore.getAuth())
  if(authStore.getAuth()===false){
   
    authStore.setAuth(false)
    router.push('/login')
  }
  GetWhereHouse()
})

const removeUserCheck = () => {
  localStorage.removeItem('userCheck')

  // Clear the access token from localStorage
  localStorage.removeItem('accessToken')

  // Clear the access token from localStorage
  localStorage.removeItem('accessTokenAtStore')

  // Clear the access token from localStorage
  localStorage.removeItem('whereHouseName')


  localStorage.removeItem('WarehouseNameAtIcons')

  localStorage.removeItem('companyId')
  localStorage.removeItem('companyName')
  localStorage.removeItem('companyLogo')

  console.log("LOout!")

  router.replace('/login')
  
}

//----------------- Hidden navigation NavBarNotifications
// <NavBarNotifications class="me-3" />
</script>

<template>
  <VerticalNavLayout :nav-items="navItems">
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex align-center py-2">
        <IconBtn
          v-if="isLessThanOverlayNavBreakpoint(windowWidth)"
          class="ms-n3"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="mdi-menu" />
        </IconBtn>

        <VSpacer />
        <NavBarI18n
          v-if="false"
          class="me-1"
        />
        <WhereHouse
          v-if="false"
          disabled
          class="d-flex justify-end"
        />

        <VChip color="white">
          <span style="color: black; text-transform: capitalize;"><VIcon icon="ri-user-3-fill" />{{ NameDepartment }}:&nbsp;&nbsp;</span>

          <span
            style="text-transform: capitalize;"
            class="text-primary"
          >{{ NameUser }}</span>
          
          <span
            style="text-transform: capitalize;"
            class="text-primary"
          >-{{ NameRole }}</span>
        </VChip>

        <NavbarThemeSwitcher
          v-if="true"
          class="me-1"
        />
        <UserProfile v-if="false" />

        <VHover
          to="/login"
          class="cursor-pointer"
          @click="removeUserCheck"
        >
          <template #default="{ isHovering, props }">
            <div
              class="d-flex align-center justify-space-around"
              @click="removeUserCheck"
            >
              <VAvatar
                class="cursor-pointer"
                v-bind="props"
                :color="isHovering ? 'red' : 'black'"
                size="30"
                @click="removeUserCheck"
              >
                <VIcon
                  size="18"
                  icon="ri-login-box-line"
                />
              </VAvatar>
            </div>
          </template>
        </VHover>
      </div>
    </template>

    <!-- 👉 Pages -->
    <RouterView v-slot="{ Component }">
      <Transition
        :name="appRouteTransition"
        mode="out-in"
      >
        <Component :is="Component" />
      </Transition>
    </RouterView>

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
    <TheCustomizer v-if="false" />
  </VerticalNavLayout>
</template>

<style lang="scss">
@keyframes rotate-180 {
  from { transform: rotate(0deg); }
  to { transform: rotate(180deg); }
}

@keyframes rotate-back-180 {
  from { transform: rotate(180deg); }
  to { transform: rotate(0deg); }
}

.layout-vertical-nav {
  .nav-header {
    .header-action {
      animation-duration: 0s;
      animation-duration: 0.35s;
      animation-fill-mode: forwards;
      animation-name: v-bind(verticalNavHeaderActionAnimationName);
      transform: rotate(0deg);
    }
  }
}

.hover-red:hover {
  background-color: red !important;
}
</style>
