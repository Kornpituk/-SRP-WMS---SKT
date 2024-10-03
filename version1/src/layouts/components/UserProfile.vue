<script setup>
import avatar1 from '@images/avatars/avatar-1.png'

import WhereHouse from '@/pages/wherehouse.vue'

const router = useRouter() 

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
  
}

//---------------------------- LocalStorage Account Avatar -----------------------------

const AvatarAccount = ref('')

watchEffect(() => {
  AvatarAccount.value = localStorage.getItem('accountImageAvatar')

  // console.log("AvatarAccountAtUserProfile:!!",localStorage.getItem('accountImageAvatar'))
})


const NameUser = ref('addmin001')



watchEffect(() => {
  NameUser.value = localStorage.getItem('userCheck')

  const userTest = localStorage.getItem('userCheck')


  // console.log("UserLocalStorage", localStorage.getItem('userCheck'))
  // console.log("userCheck", userTest)
  console.log('NameUser:', NameUser.value)
})

const goTOProfile = () => {
  router.replace('/setpermission/defineuser/uerprofile')
}

const insetOpenLogSwitch1 = ref(sessionStorage.getItem('insetOpenLogSwitch1') === 'true')


// ฟังก์ชันสำหรับบันทึกค่าใน sessionStorage
const saveToSessionStorage = value => {
  sessionStorage.setItem('insetOpenLogSwitch1', value.toString())
}

// เมื่อ component ถูก mount เรียกบันทึกค่าเริ่มต้นเข้า sessionStorage
onMounted(() => {
  saveToSessionStorage(insetOpenLogSwitch1.value)
})

// Watch การเปลี่ยนแปลงของค่า insetOpenLogSwitch1
watch(insetOpenLogSwitch1, newValue => {
  saveToSessionStorage(newValue)
  location.reload()
})
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <VImg :src="AvatarAccount" />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    class="cursor-pointer"
                    color="primary"
                    variant="tonal"
                    @click="goTOProfile"
                  >
                    <VImg :src="AvatarAccount" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ NameUser }}
            </VListItemTitle>
            <VListItemSubtitle>Admin</VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VSwitch
                  v-model="insetOpenLogSwitch1"
                  :inset="false"
                  :label="`Switch Log: ${insetOpenLogSwitch1.toString()}`"
                />
              </VListItemAction>
            </template>
          </VListItem>

          <VDivider class="my-2" />

          <!-- 👉 Settings -->
          <VListItem :to="{ name: 'pages-account-settings-tab', params: { tab: 'account' } }">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-cog-outline"
                size="22"
              />
            </template>

            <VListItemTitle>Settings</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem
            to="/login"
            @click="removeUserCheck"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-logout"
                size="22"
              />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
