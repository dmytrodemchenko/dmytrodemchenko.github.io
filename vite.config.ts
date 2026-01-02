import { defineConfig } from 'vite';

export default defineConfig({
  // Now that the repo is renamed to 'dmytrodemchenko.github.io',
  // we use the root path '/'
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  },
});
