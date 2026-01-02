import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
  
    port: 3000, // <-- set the port here
    open: true, // optional: automatically opens in browser
  },
});
