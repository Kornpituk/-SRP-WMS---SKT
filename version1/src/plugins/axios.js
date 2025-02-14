/* eslint-disable regex/invalid */
import { urlApi } from '@/api' //---------------------- Import Api for Url *****
// eslint-disable-next-line import/extensions, import/no-unresolved
import { useAuthExStore } from '@/stores/AuthExpireStore'
import axios from 'axios'

const router = useRouter()
const route = useRoute()



const axiosIns = axios.create({
// You can add your headers here
// ================================
  // baseURL: urlApi,
  // timeout: 1000,
  // headers: { 
  //   'accept': '*/*',
  //   'x-location': `${whereHouse}`,
  //   Authorization: `Bearer ${accessTokenAtStore}`,
  // },
})


// ℹ️ Add request interceptor to send the authorization header on each subsequent request after login
axiosIns.interceptors.request.use(config => {
  // Retrieve token from localStorage
  // const token = localStorage.getItem('accessToken')

  // // If token is found
  // if (token) {
  //   // Get request headers and if headers is undefined assign blank object
  //   config.headers = config.headers || {}

  //   // Set authorization header
  //   // ℹ️ JSON.parse will convert token to string
  //   config.headers.Authorization = token ? `Bearer ${token}` : ''
  // }

  // Return modified config
  return config
})

// // ℹ️ Add response interceptor to handle 401 response
// axiosIns.interceptors.response.use(response => {
//   return response
// }, error => {
//   // Handle error
//   if (error.response.status === 401) {
//     // ℹ️ Logout user and redirect to login page
//     // Remove "userData" from localStorage
//     // localStorage.removeItem('userData')

//     // // Remove "accessToken" from localStorage
//     // localStorage.removeItem('accessToken')
//     // localStorage.removeItem('userAbilities')

//     // // If 401 response returned from api
//     // router.push('/login')
//     console.log('[error 401 response returned from api]', error.response)
//   }
//   else {
//     return Promise.reject(error)
//   }
// })

// axios.interceptors.response.use(function (response) {
//   return response
// }, async function (error) {


//   const authStore = useAuthExStore()
  
//   const originalRequest = error.config

//   if (error.response.status === 401 && !originalRequest._retry) {

//     originalRequest._retry = true

//     const refreshToken = localStorage.getItem('refreshToken')
//     const whereHouse = localStorage.getItem('whereHouseName')
//     try{
//       var responstRefreshToken =  await axios.post(`${urlApi.value}/api/Auth/refreshToken`, { refreshToken: refreshToken }, {
//         headers: {
//           'accept': '*/*',
//           'x-location': `${whereHouse}`,
//         },
//       })
//       if(responstRefreshToken.status == 200){
//         const { access_token, refresh_token } = responstRefreshToken.data

//         authStore.setAuth(true)

//         // Store access token in localStorage
//         localStorage.setItem('accessToken', access_token)
//         localStorage.setItem('accessTokenAtStore', access_token)
//         localStorage.setItem('refreshToken', refresh_token)

//         axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token
//         originalRequest.headers['Authorization'] = 'Bearer ' + access_token
      
      
//         return axios(originalRequest)
//       }
//     }catch(err){
//       authStore.setAuth(false)
//     }
//   }

//   return Promise.reject(error)
// })


export default axiosIns
