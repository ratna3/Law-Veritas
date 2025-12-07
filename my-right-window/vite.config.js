import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Ensure single React instance to prevent useLayoutEffect errors
    dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
})
