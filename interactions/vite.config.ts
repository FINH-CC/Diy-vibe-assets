import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative asset paths so the built dist/ folder works when opened from
  // any path (dashboard iframe, file://, a different host, etc.) — see the
  // trailing-slash/base-path issues documented in the dashboard's README.
  base: './',
})
