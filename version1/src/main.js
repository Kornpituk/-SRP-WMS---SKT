/* eslint-disable import/order */
import '@/@fake-db/db'

// import '@/@iconify/icons-bundle'
// import '@/@iconify/build-icons'
import App from '@/App.vue'
import ability from '@/plugins/casl/ability'
import i18n from '@/plugins/i18n'
import layoutsPlugin from '@/plugins/layouts'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import { abilitiesPlugin } from '@casl/vue'
import VueBarcode from '@chenfengyuan/vue-barcode'
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

// import { VColumnsResizablePlugin } from 'vue-columns-resizable-vuetify'
// import VueColumnsResizableVuetify from 'vue-columns-resizable-vuetify'
import resizable from './plugins/resizable/resizable' // Import resizable directive

loadFonts()


// Create vue app
const app = createApp(App)


// Use plugins
app.use(vuetify)
app.use(createPinia())

const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
app.use(router)
app.use(layoutsPlugin)
app.use(i18n)

// app.use(VueColumnsResizableVuetify)
app.directive('resizable', resizable)

app.component(VueBarcode.name, VueBarcode)
app.component('VueDatePicker', VueDatePicker) // Vue DateTimePick  New Import
app.use(abilitiesPlugin, ability, {
  useGlobalProperties: true,
})

// Mount vue app
app.mount('#app')
