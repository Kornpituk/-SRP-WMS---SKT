<script setup>
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import axios from '@axios'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import authV2LoginMaskDark from '@images/pages/auth-v2-login-mask-dark.png'
import authV2LoginMaskLight from '@images/pages/auth-v2-login-mask-light.png'
import {
  requiredValidator,
} from '@validators'
import { VForm } from 'vuetify/components/VForm'

import { urlApi } from '../api'

import { useCookieStore, useItemStore } from '@/stores/skt/receingFormStore/itemStore'

const itemStore = useItemStore()

const cookieStore = useCookieStore()

const router = useRouter() 

const isPasswordVisible = ref(false)
const authV2LoginMask = useGenerateImageVariant(authV2LoginMaskLight, authV2LoginMaskDark)
const authV2LoginIllustration = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)

const errors = ref({
  email: undefined,
  password: undefined,
})

localStorage.setItem('versionWMS', '1.3.21-1')

// localStorage.setItem('srp-theme-config', 'primary')

const versionWMSConfig = ref('')



const refVForm = ref()
const username = ref('')
const password = ref('')

// const urlApi = process.env.API_KEY

const rememberMe = ref(false)

const usernameError = ref('') 
const passwordError = ref('')


watchEffect(() => {
  versionWMSConfig.value = localStorage.getItem('versionWMS')
  if(localStorage.getItem('rememberMe')){
    username.value = localStorage.getItem('rememberMeUserName')
  } else if(!localStorage.getItem('rememberMe')){
    localStorage.removeItem('rememberMeUserName')
    localStorage.removeItem('rememberMe')
  }
  
})
localStorage.removeItem('userCheck')

const userCheck = ref('')

const inFoCompany = ref([])
const companyName = ref('')
const companyLogo = ref('')

const getInfoCompany = () => {
  axios.get(`${urlApi.value}/api/v1/Company`, {
  })
    .then(response => {
      inFoCompany.value = response.data

      // console.log('inFoCompany.value At login:', inFoCompany.value)

      localStorage.setItem('companyId', inFoCompany.value.comId)
      localStorage.setItem('companyName', inFoCompany.value.companyName)
      companyName.value = inFoCompany.value.companyName
      companyLogo.value = inFoCompany.value.logo
      localStorage.setItem('companyLogo', inFoCompany.value.logo)

      

      // console.log('companyId', localStorage.getItem('companyId'))
      // console.log('companyName', localStorage.getItem('companyName'))
      // console.log('companyLogo', localStorage.getItem('companyLogo'))
    })
    .catch(error => {
      console.error('Error:', error)
    })
}

getInfoCompany()

watchEffect(getInfoCompany)

//----- function remember me -----
const rememberMeUserName = ref('')

watchEffect(() => {
  if(rememberMe.value){
    localStorage.setItem('rememberMeUserName', username.value)
    localStorage.setItem('rememberMe', true)
  } else if(!rememberMe.value){
    localStorage.setItem('rememberMeUserName', '')
  }
})

function clearLocalStorage(){
  // Clear the access token from localStorage
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  

  // Clear the access token from localStorage
  localStorage.removeItem('accessTokenAtStore')

  // Clear the access token from localStorage
  localStorage.removeItem('whereHouseName')

  localStorage.removeItem('nameCompany')
}

const login = async () => {

  var response = await axios.post(`${urlApi.value}/api/Auth`, {
    username: username.value,
    password: password.value,
    grantType: 'password',
  }) .catch(err => {
    // Handle errors
    usernameError.value = 'Username not found.'
    passwordError.value = 'Password not found.'
    console.error('Error:', err) 
    
    return false
  })


  if(response.status == 200){
    console.log(response.data)

    const { access_token, refresh_token } = response.data

    // Store access token in localStorage
    localStorage.setItem('accessToken', access_token)
    localStorage.setItem('accessTokenAtStore', access_token)
    localStorage.setItem('refreshToken', refresh_token)
    
    // ... store other relevant data if needed

    // Redirect to `to` query if exist or redirect to index route
    // router.replace(route.query.to ? String(route.query.to) : '/selectWhereHouse')

    if(!rememberMe){
      localStorage.removeItem('rememberMeUserName')
      localStorage.removeItem('rememberMe')
    }

    //*------------------------------ Set จำนวนเวลาที่สามารถใช้งานได้ --------------------------
    // const now = new Date().getTime()
    // const sessionDuration = 1 * 60 * 1000 // 30 นาที
    // const sessionExpiry = now + sessionDuration

    // localStorage.setItem('sessionExpiry', sessionExpiry)

    //*------------------------------ Set จำนวนเวลาที่สามารถใช้งานได้ --------------------------
    return true
  }
}

const userData = ref([])

const getInfoUserData = async () => {
  const accessToken = localStorage.getItem('accessToken')

  var response =  await axios.get(`${urlApi.value}/api/v1/User/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if(response.status == 200){
    userData.value  = response.data
    itemStore.setItemDetails(userData.value, 'UserDataCookies')
    console.log('getInfoUserData: name', userData.username)
    localStorage.setItem('userName', userData.username)
    console.log("localStorage.setItem('userData', userData)", localStorage.getItem('userDate'))
  }
}

// watchEffect(getInfoUserData)

const checkIsLogin = () => {
  // console.log('Check islogon userData:', localStorage.getItem('userDate'))
  // console.log('Check islogon accessToken:', localStorage.getItem('accessToken'))
}


const onSubmit = async () => {
  localStorage.setItem('userCheck', username.value)

  clearLocalStorage()

  // console.log('!![username.value In Login 01]',username.value)
  // console.log('!![localStorage UserCheck In Login 01]', localStorage.getItem('userCheck', username.value))
  // const userTest = localStorage.getItem('userCheck')
  // console.log('Test:', userTest)
  
  // getInfoCompany()

  // const accessToken = localStorage.getItem('accessToken')
  // if (accessToken) {
  //   console.error('Access token is available')
  //   getInfoUserData()

  //   // checkIsLogin()
  // } else {
  //   // Handle the case when accessToken is not available
  //   console.error('Access token is not available')

  //   // You might want to prompt the user to login again or handle this scenario accordingly
  // }

  var isSuccess =  await login()

  if(isSuccess){
    await getInfoUserData()
    router.replace('/selectWhereHouse')
  }
  
}

const nameCompany = localStorage.getItem('companyName')
</script>

<template>
  <!--     -->
  <section>
    <div class="auth-wrapper d-flex align-center justify-center pa-4">
      <VCard
        class="auth-card pa-2 pt-7"
        max-width="448"
      >
        <VCardItem class="justify-center">
          <template #prepend>
            <div class="me-n2">
              <img
                v-if="companyLogo"
                :src="companyLogo"
                style="width: 250px; height: auto;"
              >
              <div v-else>
                <!-- Show a loading spinner -->
                <VProgressCircular
                  indeterminate
                  size="64"
                />
              </div>
            </div>
          </template>
        </VCardItem>

        <VCardText class="px-0">
          <h5 class="text-h5 font-weight-semibold text-center">
            {{ companyName }}
          </h5>
        </VCardText>
        <VCardSubtitle class="d-flex justify-center">
          Version {{ versionWMSConfig }}
        </VCardSubtitle>

        <VCardText>
          <VForm @submit.prevent="onSubmit">
            <VRow>
              <!-- username -->
              <VCol
                cols="12"
                class="px-12"
              >
                <VTextField
                  v-model="username"
                  label="Username"
                  type="username"
                  :rules="[requiredValidator]"
                  :error-messages="usernameError" 
                />
              </VCol>

              <!-- password -->
              <VCol
                cols="12"
                class="px-12"
              >
                <VTextField
                  v-model="password"
                  label="Password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                  :rules="[requiredValidator]"
                  :error-messages="passwordError"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <!-- remember me checkbox -->
                <div class="d-flex align-center flex-wrap justify-space-between mt-1 mb-4">
                  <VCheckbox
                    v-model="rememberMe"
                    label="Remember Me"
                  />
                </div>


                <!-- login button -->
                <VBtn
                  block
                  type="submit"
                >
                  Login
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
      <VImg
        :src="authV1ThemeLoginMask"
        class="d-none d-md-block auth-footer-mask"
      />
    </div>
  </section>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
