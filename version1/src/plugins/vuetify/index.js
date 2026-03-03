//index.js
import { createVuetify } from 'vuetify'
import { VBtn } from 'vuetify/components/VBtn'
import { VDataTableServer } from 'vuetify/labs/VDataTable' // ← เพิ่ม
import defaults from './defaults'
import { icons } from './icons'
import theme from './theme'

// Styles
import '@core/scss/template/libs/vuetify/index.scss'
import 'vuetify/styles'

export default createVuetify({
  aliases: {
    IconBtn: VBtn,
  },
  components: {
    VDataTableServer, // ← เพิ่ม
  },
  defaults,
  icons,
  theme,
})
