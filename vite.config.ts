import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: ['trueline.onrender.com', 'localhost','https://truelineproservices.com.au'],
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    build: {
      outDir: 'dist', // ✅ required by Vercel
      emptyOutDir: true,
    },
    base: './', // ✅ ensures assets load correctly on Vercel
  };
});
