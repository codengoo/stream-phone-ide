
import react from '@vitejs/plugin-react'
import { defineConfig } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    build: { bytecode: true }
  },
  preload: {
    build: { bytecode: true }
  },
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
    plugins: [react()],
    build: {
      minify: 'terser',
      sourcemap: false,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          passes: 2
        },
        mangle: {
          toplevel: true
        },
        format: {
          comments: false
        }
      }
    }
  }
})
