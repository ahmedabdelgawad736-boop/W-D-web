import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.BASE_PATH || (process.env.NODE_ENV === 'production' ? '/W-D-web/' : '/'),
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
  },
})
