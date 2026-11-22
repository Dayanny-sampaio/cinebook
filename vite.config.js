import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy:{
      '/api-apple':{
        target: 'https://rss.marketingtools.apple.com',
        changeOrigin: true,
        followRedirects: true,
        rewrite: (path) => path.replace(/^\/api-apple/,''),
      },
    },
  },
})
