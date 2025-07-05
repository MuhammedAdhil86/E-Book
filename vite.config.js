// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // <-- Add this

export default defineConfig({
  plugins: [react()],
  base: '/', // Important for proper routing on Vercel
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // <-- This allows @ to point to /src
    },
  },
});
