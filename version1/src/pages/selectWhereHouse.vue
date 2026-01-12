<script setup>
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import axios from '@axios'
import authV1LoginMaskDark from '@images/pages/auth-v1-login-mask-dark.png'
import authV1LoginMaskLight from '@images/pages/auth-v1-login-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'


const router = useRouter() 

const form = ref({
  whereHouse: '',
  remember: false,
})

const authV1ThemeLoginMask = useGenerateImageVariant(authV1LoginMaskLight, authV1LoginMaskDark)
const isPasswordVisible = ref(false)

import { onMounted } from 'vue'
import { urlApi } from '../api'

const whereHouseSelectedItem = ref(null)

const items = ref([])


// Get access token from localStorage in another page
const accessToken = localStorage.getItem('accessTokenAtStore')

//console.log("accessToken:", accessToken)

const userName = localStorage.getItem('userCheck')

//console.log("userName:", userName)

const url = ref(`${urlApi.value}/api/Auth/GetLocation/all`)

onMounted(async () => {
  GetWhereHouse()
})

const GetWhereHouse = () => {
  // Clear the access token cookie
  // document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  // localStorage.removeItem('accessToken')

  // Clear the access token from localStorage
  // localStorage.removeItem('accessToken')

  axios.get(`${urlApi.value}/api/Auth/GetLocation`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(response => {
      const responseData = response.data

      items.value = response.data

      // Extracting the id and name properties
      // for (let i = 0; i < responseData.length; i++) {
      //   const { id, name } = responseData[i]

      //   items.push({ id, name })
      // }

      
      // Now `items` contains an array of objects with id and name properties
      //console.log('items location whereHouse', items)

      // You can use `items` for select or any other purpose
      //console.log(response.data)

      
    })
    .catch(error => {
      // Handle errors
      selectError.value = 'Where house not selected!!'
      console.error('Error:', error)
    })

    
}

// ----------------------------------  When Select Where House and Submit ------------------------
//console.log('whereHouseSelectedItem.value: ', whereHouseSelectedItem.value)

const saveToLocalStorage = () => {
  localStorage.setItem('whereHouseName', whereHouseSelectedItem.value)
}


const usernameError = ref('')
 
const validateSelection = ()  => {
  return [v => !!v || 'Warehouse is required']
}

const onSubmitWhereHouse = () => {

  if ( whereHouseSelectedItem.value.length === 0) {
    usernameError.value = 'Please Select A Warehouse'

    //console.log('Please Select A Warehouse!!!')
  } else {
    saveToLocalStorage()

    // บันทึกข้อมูลลงใน localStorage
    //console.log(whereHouseSelectedItem)

    // router.replace(route.query.to ? String(route.query.to) : '/dashboard/store')

    // router.replace('/skt/receiving')

    router.replace('/dashboards/main')
  }

  // saveToLocalStorage()

  // // บันทึกข้อมูลลงใน localStorage
  // //console.log(whereHouseSelectedItem)

  // // router.replace(route.query.to ? String(route.query.to) : '/dashboard/store')

  // router.replace('/dashboards/crm')
  
}


const inFoUser = ref([])
const nameCompany = ref('company')

const getInfoUser = () => {
  // Clear the access token cookie
  // document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  // localStorage.removeItem('nameCompany')
  // localStorage.removeItem('accessToken')

  axios.get(`${urlApi.value}/api/v1/User/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(response => {
      inFoUser.value = response.data

  
      // You can use `items` for select or any other purpose
      //console.log('inFoUser.value', inFoUser.value)
      //console.log('inFoUser.value.companyName', inFoUser.value.companyName)

      nameCompany.value = inFoUser.value.companyName

      //console.log('nameCompany: ', nameCompany.value)
      localStorage.setItem('nameCompany', inFoUser.value.companyName)

      //console.log('localStorag Name Company:', localStorage.getItem('nameCompany'))
      
    })
    .catch(error => {
      // Handle errors
      selectError.value = 'Where house not selected!!'
      console.error('Error:', error)
    })

    
}

watchEffect(getInfoUser)

const logoCompany = ref('')

watchEffect(() => {
  logoCompany.value = localStorage.getItem('companyLogo')
})
</script>

<template>
  <div class="auth-wrapper d-flex justify-center align-center ma-auto">
    <VImg
      :src="authV1ThemeLoginMask"
      class="d-none d-md-block auth-footer-mask"
    />
    <VCard
      class="auth-card pt-4 px-10"
      max-width="500"
    >
      <VCardItem class="justify-center pa-1">
        <template #prepend>
          <div class="me-n2">
            <VNodeRenderer
              v-if="false"
              :nodes="themeConfig.app.logo"
              style="width: 250px; height: auto;"
            />
            <VImg
              style="width: 250px; height: auto;"
              :src="logoCompany"
            />
          </div>
        </template>
      </VCardItem>

      <VCardTitle class="text-2xl font-weight-bold text-center">
        {{ nameCompany }} 
      </VCardTitle>
      <VCardText class="pt-2 text-center">
        <p class="mb-0">
          Please Select Your Warehouse 
        </p>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="onSubmitWhereHouse">
          <VRow>
            <!-- WareHouse -->
            <VCol cols="12 px-0">
              <VSelect
                v-model="whereHouseSelectedItem"
                class="mb-4"
                label="Warehouse "
                :items="items"
                :custom-filter="customFilter"
                :error-messages="usernameError"
                item-title="name"
                item-value="id"
                density="compact"
                clear-icon="mdi-close"
                base-color="primary"
              />
              <VDivider />
              <!-- login button -->

              <VBtn
                block
                type="submit"
                size="large"
              >
                Select
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
