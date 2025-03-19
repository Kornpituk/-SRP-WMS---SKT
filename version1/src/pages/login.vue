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
import { watchEffect } from 'vue'

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

localStorage.setItem('versionWMS', '1.3.25.1')

// localStorage.setItem('srp-theme-config', 'primary')

const versionWMSConfig = ref('')



const refVForm = ref()

// const urlApi = process.env.API_KEY

const usernameError = ref('') 
const passwordError = ref('')
const nameCompany = localStorage.getItem('companyName')

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const savedUsernames = ref(JSON.parse(localStorage.getItem('usernames')) || []) // ดึง usernames ที่เคยบันทึกไว้


watchEffect(() => {
  versionWMSConfig.value = localStorage.getItem('versionWMS')
  if(localStorage.getItem('rememberMe')){
    username.value = localStorage.getItem('rememberMeUserName')
  } else if(!localStorage.getItem('rememberMe')){
    localStorage.removeItem('rememberMeUserName')
    localStorage.removeItem('rememberMe')
  }
  
})

// localStorage.removeItem('userCheck')

const userCheck = ref('')

const inFoCompany = ref([])
const companyName = ref('')
const companyLogo = ref('')

const getInfoCompany = () => {
  axios.get(`${urlApi.value}/api/v1/Company`, {
  })
    .then(response => {
      inFoCompany.value = response.data

      // //console.log('inFoCompany.value At login:', inFoCompany.value)

      localStorage.setItem('companyId', inFoCompany.value.comId)
      localStorage.setItem('companyName', inFoCompany.value.companyName)
      companyName.value = inFoCompany.value.companyName
      companyLogo.value = inFoCompany.value.logo
      localStorage.setItem('companyLogo', inFoCompany.value.logo)

      

      // //console.log('companyId', localStorage.getItem('companyId'))
      // //console.log('companyName', localStorage.getItem('companyName'))
      // //console.log('companyLogo', localStorage.getItem('companyLogo'))
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

  watchEffect(() => {
    if(username.value === '' || !username.value){
      usernameError.value = true
    }

    if(password.value === '' || !password.value){
      passwordError.value = true
    }
  })


  if(response.status == 200){
    //console.log(response.data)

    const { access_token, refresh_token } = response.data

    // Store access token in localStorage
    localStorage.setItem('accessToken', access_token)
    localStorage.setItem('accessTokenAtStore', access_token)
    localStorage.setItem('refreshToken', refresh_token)

    sessionStorage.setItem('accessToken', access_token)
    sessionStorage.setItem('accessTokenAtStore', access_token)
    sessionStorage.setItem('refreshToken', refresh_token)
    
    // ... store other relevant data if needed

    // Redirect to `to` query if exist or redirect to index route
    // router.replace(route.query.to ? String(route.query.to) : '/selectWhereHouse')

    if(!rememberMe){
      localStorage.removeItem('rememberMeUserName')
      localStorage.removeItem('rememberMe')
    }

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

    //console.log('getInfoUserData: name', userData.username)
    sessionStorage.setItem('userData', JSON.stringify(userData.value))
    localStorage.setItem('userName', userData.username)

    //console.log("localStorage.setItem('userData', userData)", localStorage.getItem('userDate'))
  }
}

// watchEffect(getInfoUserData)

const checkIsLogin = () => {
  // //console.log('Check islogon userData:', localStorage.getItem('userDate'))
  // //console.log('Check islogon accessToken:', localStorage.getItem('accessToken'))
}

const onSubmit = async () => {
  localStorage.setItem('userCheck', username.value)

  clearLocalStorage()

  if (username.value && password.value) {
    if (rememberMe.value) {
      saveUsername(username.value)
    }
    var isSuccess =  await login()

    if(isSuccess){
      await getInfoUserData()
      router.replace('/selectWhereHouse')
    }
  } else {
    alert('Please fill in all fields')
  }
  
}

function saveUsername(username) {
  if (!savedUsernames.value.includes(username)) {
    savedUsernames.value.push(username)
    localStorage.setItem('usernames', JSON.stringify(savedUsernames.value)) // เก็บ usernames ใน Local Storage
  }
}

// ลบ Username ที่บันทึกไว้
function removeUsername(index) {
  savedUsernames.value.splice(index, 1)
  localStorage.setItem('usernames', JSON.stringify(savedUsernames.value))
}
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
                  v-if="false"
                  v-model="username"
                  label="Username"
                  type="username"
                  :items="savedUsernames"
                  :error-messages="usernameError" 
                />
                <VCombobox
                  v-model="username"
                  label="Username"
                  clearable
                  :items="savedUsernames "
                  :error-messages="usernameError" 
                  placeholder="Enter Username"
                  @select="handleSelect"
                />
                <ul v-if="false">
                  <li
                    v-for="(user, index) in savedUsernames"
                    :key="index"
                  >
                    {{ user }}
                    <VBtn
                      icon
                      @click="removeUsername(index)"
                    >
                      X
                    </VBtn>
                  </li>
                </ul>
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
