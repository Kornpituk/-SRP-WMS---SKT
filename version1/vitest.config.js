// vitest.config.js
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'  // ← เพิ่ม (ถ้ามีในโปรเจกต์)

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),  // ← ให้ vuetify จัดการ CSS เอง
  ],
  test: {
    environment: 'jsdom',
    server: {
      deps: {
        inline: ['vuetify'],  // ← ⭐ key fix: บังคับให้ vite transform vuetify แทน node
      },
    },
    setupFiles: ['tests/setup.js'],
  },
})
