import { defineConfig } from '@vue/cli-service'
import { DefinePlugin } from 'webpack'

// สร้างตัวแปรเพื่อเก็บวันที่ build
const buildDate = new Date().toLocaleDateString('en-GB')

export default defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new DefinePlugin({
        'process.env': {
          BUILD_DATE: JSON.stringify(buildDate),
        },
      }),
    ],
  },
})
