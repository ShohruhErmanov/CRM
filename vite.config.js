import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const backendOrigin = process.env.VITE_BACKEND_ORIGIN || 'http://localhost:4000'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': backendOrigin,
      '/uploads': backendOrigin,
    },
  },
  preview: {
    port: 4173,
    proxy: {
      '/api': backendOrigin,
      '/uploads': backendOrigin,
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
