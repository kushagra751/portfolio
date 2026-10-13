import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' lets the built site work on GitHub Pages, Vercel, Netlify or any static host.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: [
            '@react-three/fiber',
            '@react-three/drei',
            '@react-three/postprocessing',
            'postprocessing',
          ],
        },
      },
    },
  },
})
