import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Use relative base path for GitHub Pages compatibility
  define: {
    // Polyfill process.env to avoid runtime errors when accessing process.env.API_KEY directly
    'process.env': {},
  },
});