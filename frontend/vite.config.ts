import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // In production the frontend calls the deployed backend directly via VITE_API_URL.
  // In development it proxies to localhost:8000.
  server: {
    port: 5173,
    proxy: {
      '/auth':  'http://localhost:8000',
      '/books': 'http://localhost:8000',
      '/users': 'http://localhost:8000',
      '/ai':    'http://localhost:8000',
    },
  },
}))
