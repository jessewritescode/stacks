import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../../src/shared'),
      '@components': path.resolve(__dirname, '../../src/client/components'),
      '@features': path.resolve(__dirname, '../../src/client/features'),
      '@': path.resolve(__dirname, '../../src/client/'),
    },
  },
  plugins: [react()],
  root: './src/client',
  build: {
    outDir: '../../dist/client',
    manifest: true, // generate manifest.json in outDir
    rollupOptions: {
      input: './src/client/client.tsx',
    },
  },
});
