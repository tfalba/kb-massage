import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        // If your backend expects /api prefix exactly, leave rewrite out.
        // If your backend route is "/app/event-types" and you're calling "/api/event-types",
        // you could rewrite like this:
        // rewrite: (path) => path.replace(/^\/api/, "/app"),
      },
       '/gcal': {
        target: 'http://localhost:4001',
        changeOrigin: true,
      },
    },
  },
})
