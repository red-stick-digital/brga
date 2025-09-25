import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: parseInt(env.PORT) || 3000,
      host: true, // Allow external connections
      open: true, // Automatically open browser
    },
    build: {
      outDir: 'dist',
    },
  };
});