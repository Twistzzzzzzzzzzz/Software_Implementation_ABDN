import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //设置以下域名可访问frp-few.com:23299
  server: {
    allowedHosts: ['localhost', 'frp-few.com', 'frp-aim.com']
  },

})

