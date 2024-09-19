import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Inoltra tutte le richieste a "/api" verso il backend
      '/v1': {
        target: 'https://localhost:3001',
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/v1/, ''),
      },
    },
  }
})
