import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    server: {
      port: parseInt(env.VITE_PORT || '3000', 10)
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icons/favicon.ico'],
        manifest: {
          name: 'Pluto',
          short_name: 'Pluto',
          description: 'Pluto is a budget app that helps you manage your money.',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'icons/icon-192-192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'icons/icon-512-512.png',
              sizes: '512x512',
              type: 'image/png',
            }
          ]
        }
      })
    ],
    // Define build-time replacements for env variables
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  }
})
