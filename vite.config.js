// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: false,
    proxy: {
      '/api': {
        target: 'https://edunest-backend-pc16.onrender.com',
        changeOrigin: true,
        secure: false, // Set to true for HTTPS
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
