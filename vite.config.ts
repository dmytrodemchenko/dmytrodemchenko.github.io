import { defineConfig } from 'vite';

export default defineConfig({
  // Since your repo is currently named 'demchenkodmytro', 
  // the base path must match the repo name for assets to load.
  // If you rename the repo to 'dmytrodemchenko.github.io', 
  // you should change this back to '/'
  base: '/demchenkodmytro/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  },
});
