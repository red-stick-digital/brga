import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 3000,
  },
  build: {
    outDir: 'dist',
  },
});