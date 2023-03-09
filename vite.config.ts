import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import eslint from 'vite-plugin-eslint';

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // vite config
    define: {
      __APP_ENV__: env.APP_ENV,
    },
    server: {
      port: env.VITE_STAGING === 'false' ? 3000 : 4000,
    },
    preview: {
      port: env.VITE_STAGING === 'false' ? 3001 : 4001,
    },
    plugins: [eslint(), react()],
  };
});
