import { defineStore } from 'pinia'

export const useAuthExStore = defineStore('auth', {
  state: () => ({
    isAuth: true, 
  }),

  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    setAuth(param) {
      this.isAuth = param
    },
    getAuth(){
      return this.isAuth
    },
  },
})
