import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.VITE_META_PHONE_ID': JSON.stringify(env.VITE_META_PHONE_ID),
        'process.env.VITE_META_TOKEN': JSON.stringify(env.VITE_META_TOKEN),
        'process.env.VITE_STORE_PHONE': JSON.stringify(env.VITE_STORE_PHONE)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
