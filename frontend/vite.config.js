import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["guessr.warmsandybeaches.net"]
  },
  base: "https://guessr.warmsandybeaches.net",
})
