import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['react-icons'] // If you still want to externalize it for some reason, but this is usually not necessary
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
  },
});
