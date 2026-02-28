import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    // Copy sql.js WASM files so jeep-sqlite can run SQLite in the browser during dev/test
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/sql.js/dist/sql-wasm.wasm',
          dest: '',
        },
      ],
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.svg', 'logo.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'إدارة المخزن',
        short_name: 'المخزن',
        description: 'تطبيق إدارة المخزون لمنشأة التخزين',
        theme_color: '#1677ff',
        background_color: '#ffffff',
        display: 'standalone',
        lang: 'ar',
        dir: 'rtl',
        start_url: './',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,wasm}'],
      },
    }),
  ],
})
