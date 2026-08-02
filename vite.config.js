import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api/github-projects': {
        target: 'https://api.github.com',
        changeOrigin: true,
        rewrite: () => '/users/kuberbassi/repos?sort=updated&per_page=100',
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'kuberbassi-portfolio',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(projectRoot, './src'),
    },
  },
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    cssMinify: true,
    modulePreload: { polyfill: false },
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      input: {
        main: path.resolve(projectRoot, 'index.html'),
        404: path.resolve(projectRoot, 'public/404.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'vendor-three';
          }
          if (id.includes('node_modules/gsap')) {
            return 'vendor-gsap';
          }
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/react-icons') || id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
        }
      }
    }
  },
})
