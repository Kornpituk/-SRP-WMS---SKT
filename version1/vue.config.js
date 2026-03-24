import { defineConfig } from '@vue/cli-service'
import pkg from './package.json'
import vue from '@vitejs/plugin-vue'

console.log("version", pkg.version)

// สร้างตัวแปรเพื่อเก็บวันที่ build
const buildDate = new Date().toLocaleDateString('en-GB')

export default defineConfig({
  plugins: [vue()],
  define: {
    APP_VERSION: JSON.stringify(pkg.version),
    BUILD_DATE: JSON.stringify(buildDate),
  },
})
