import { MENU_LIST } from '@/navigation/vertical/skt'
import { getUserFromLocalStorage, validateMenuByUser } from '@/navigation/nav.utils'
import { useAuthExStore } from '@/stores/AuthExpireStore' // ปรับ path ตามโครงสร้างโปรเจคของคุณ

import appAndPages from './app-and-pages'
import charts from './charts'
import dashboard from './dashboard'
import forms from './forms'
import others from './others'
import uiElements from './ui-elements'
import inventory from './inventory'
import countStock from './countStock'
import securityAdmin from './securityAdmin'
import importData from './importData'
import configuration from './configuration'
import productList from './productList'
import permission from './permission'
import expireDate from './expireDate'
import minMax from './minMax'
import performance from './performance'

// import skt from './skt'

// export default [...dashboard, ...inventory, ...configuration, ...countStock  ]

const user = getUserFromLocalStorage()

// const menus = validateMenuByUser(MENU_LIST, user)

// export default [ ...menus]

const getMenus = () => {
  const authStore = useAuthExStore()
  
  return computed(() => {
    const user = authStore.user || getUserFromLocalStorage()
    const menus = validateMenuByUser(MENU_LIST, user)

    console.log('menus updated:', menus)
    
    return menus
  })
}

export default getMenus()
