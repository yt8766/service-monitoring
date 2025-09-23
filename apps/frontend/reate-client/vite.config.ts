import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7001',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '') // 去掉 /api 前缀
      }
    }
  }
});
