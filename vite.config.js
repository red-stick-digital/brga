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
      // Optimize build for production
      minify: 'terser',
      // Enable terser compression options
      terserOptions: {
        compress: {
          drop_console: mode === 'production', // Remove console logs in production
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          // Improved code splitting strategy
          manualChunks: (id) => {
            // Separate node_modules by size and usage
            if (id.includes('node_modules')) {
              // React core - frequently used
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              // React Router - route specific
              if (id.includes('react-router-dom')) {
                return 'router';
              }
              // Supabase - authentication/database
              if (id.includes('@supabase')) {
                return 'supabase';
              }
              // UI libraries
              if (id.includes('@headlessui') || id.includes('@heroicons')) {
                return 'ui-vendor';
              }
              // All other dependencies
              return 'vendor';
            }
          },
          // Optimize chunk file names
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        }
      },
      // Increase chunk size warning limit (default is 500kb)
      chunkSizeWarningLimit: 600,
      // Generate source maps for debugging in production
      sourcemap: mode !== 'production'
    },
    // Optimize dependencies pre-bundling
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js']
    }
  };
});