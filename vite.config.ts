import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true,
    port: 3000,
  },
  preview: {
    port: 3001,
  },
  build: {
    outDir: 'build',
  },
  plugins: [eslint(), react(), mkcert()],
});
