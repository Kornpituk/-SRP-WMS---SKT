import { defineStore } from 'pinia'

export const useAuthExStore = defineStore('auth', {
  state: () => ({
    isAuth: true, 
    user: null,
  }),

  // could also be defined as
  // state: () => ({ count: 0 })
  // getters: {
  //   // ใช้ getters แทน actions สำหรับการดึงข้อมูล
  //   getUser: state => state.user,
  //   getAuth: state => state.isAuth,
  //   isAuthenticated: state => state.isAuth && state.user !== null,
  // },
  
  actions: {
    setAuth(param) {
      this.isAuth = param
    },
    setUser(user) {
      this.user = user
    },
    getUser(){
      return this.user
    },
    getAuth(){
      return this.isAuth
    },
    logout() {
      this.user = null
      this.isAuth = false
      sessionStorage.removeItem('userData')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userName')
    },

    // เพิ่ม action สำหรับ restore session
    restoreSession() {
      const savedUser = sessionStorage.getItem('userData')
      if (savedUser) {
        this.user = JSON.parse(savedUser)
        this.isAuth = true
      }
    },
  },
})
