import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pkg from './package.json' with { type: 'json' };

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },

  server: {
    watch: {
      // Local browser profiles and acceptance outputs are not application sources.
      ignored: ['**/.cache/**', '**/migration-runs/**'],
    },
    proxy: {
      '/api/dynmap': {
        target: 'https://satellite.ria.red',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/dynmap/, '/map'),
      },
    },
  },

  build: {
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.replace(/\\/g, '/');

          // Keep heavyweight third-party modules out of the initial app chunk.
          // JSZip is only loaded by import/export package flows and should remain async.
          if (normalized.includes('/node_modules/jszip/')) {
            return 'vendor-jszip';
          }

          if (normalized.includes('/node_modules/')) {
            return 'vendor-main';
          }

          // Let Rollup preserve the actual async entry boundaries. Pinning a
          // shared helper into a UI chunk would eagerly download that whole UI.

        },
      },
    },
  },
});
