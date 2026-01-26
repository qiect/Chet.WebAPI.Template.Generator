import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  build: {
    outDir: './dist'
  },
  resolve: {
    alias: {
      '@': '/src',
    }
  },
  define: {
    // 解决Vite与某些库的兼容性问题
    global: 'globalThis',
  }
})