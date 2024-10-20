import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Esto asegura que las rutas sean manejadas por React Router
    historyApiFallback: true,
  },
})
