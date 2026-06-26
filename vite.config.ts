import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');

  // Local Laravel URL (fallback to 127.0.0.1:8000 if env not set)
  const backendUrl = env.VITE_CRM_API_URL || 'http://127.0.0.1:8000';

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Allow ngrok and other tunnel hosts
      host: true,
      allowedHosts: [
        'localhost',
        '.ngrok-free.dev',
        '.ngrok.io',
        '.loca.lt',
        '.cloudflared.com',
      ],
      proxy: {
        // Forward /api/* → local Laravel (avoids CORS in dev)
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});

