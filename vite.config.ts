import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * Vite 开发服务器中间件：GitHub 代理
 * 在 Node 端请求 GitHub 资源并跟随重定向，彻底避免浏览器 CORS 问题
 * 使用方式：GET /gh-proxy/<encoded_url>
 */
function githubProxyPlugin(): Plugin {
  return {
    name: 'github-proxy',
    configureServer(server) {
      server.middlewares.use('/gh-proxy', async (req, res) => {
        const encodedUrl = req.url?.slice(1) // 去掉开头的 /
        if (!encodedUrl) {
          res.statusCode = 400
          res.end('Missing URL parameter')
          return
        }

        try {
          const targetUrl = decodeURIComponent(encodedUrl)
          console.log(`[gh-proxy] 请求: ${targetUrl}`)

          const response = await fetch(targetUrl, {
            redirect: 'follow',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': '*/*',
            },
          })

          // 复制响应头（跳过可能冲突的 header）
          const skipHeaders = new Set(['access-control-allow-origin', 'access-control-allow-headers', 'access-control-allow-methods'])
          response.headers.forEach((value, key) => {
            if (!skipHeaders.has(key.toLowerCase())) {
              res.setHeader(key, value)
            }
          })
          // 允许浏览器跨域访问本代理
          res.setHeader('Access-Control-Allow-Origin', '*')

          res.statusCode = response.status
          const body = await response.arrayBuffer()
          res.end(Buffer.from(body))
        } catch (error: any) {
          console.error(`[gh-proxy] 请求失败:`, error)
          res.statusCode = 502
          res.end(`Proxy error: ${error.message}`)
        }
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Chet.WebAPI.Template.Generator/',
  plugins: [vue(), githubProxyPlugin()],
  server: {
    port: 3000,
    open: true,
    cors: true,
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
