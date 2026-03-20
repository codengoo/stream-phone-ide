import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@components': resolve('src/renderer/src/components'),
        '@ui': resolve('src/renderer/src/components/ui'),
        '@services': resolve('src/renderer/src/services'),
        '@store': resolve('src/renderer/src/store'),
        '@hooks': resolve('src/renderer/src/hooks'),
        '@pages': resolve('src/renderer/src/components/pages')
      }
    },
    plugins: [react()]
  }
})
