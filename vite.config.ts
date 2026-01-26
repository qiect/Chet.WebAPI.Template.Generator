import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Chet.WebAPI.Template.Generator/',
  plugins: [vue()],
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  build: {
    outDir: './dist',
    rollupOptions: {
      output: {
        // 确保资源路径正确
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/[name].[ext]';
          }
          return 'assets/[name].[hash].[ext]';
        },
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
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