import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3001,
    open: true,
    proxy: {
      '/xmz': {
        target: 'http://localhost:8101',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
}) 