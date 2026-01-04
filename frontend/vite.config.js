import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  optimizeDeps: {
    // Exclude problematic packages from pre-bundling
    exclude: [
      '@tensorflow/tfjs-backend-webgpu',
      '@mediapipe/pose',
      '@tensorflow/tfjs-backend-webgl',
    ],
  },
  build: {
    // Configure rollup options
    rollupOptions: {
      external: [
        // These will be loaded from CDN at runtime
        '@tensorflow/tfjs-backend-webgpu',
        '@mediapipe/pose',
      ],
      output: {
        manualChunks: {
          // Separate TensorFlow into its own chunk
          tensorflow: ['@tensorflow/tfjs', '@tensorflow/tfjs-backend-webgl'],
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  // Define global constants
  define: {
    // Disable TensorFlow.js debug logging for production
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'global': 'globalThis',
  },
});