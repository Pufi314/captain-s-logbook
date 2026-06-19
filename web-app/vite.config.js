import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/captain-s-logbook/',  // GitHub Pages subpath
  plugins: [react()],
})
