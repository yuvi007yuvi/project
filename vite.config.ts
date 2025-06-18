import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/project/', // Replace with your repository name
  build: {
    outDir: 'docs', // Output to the 'docs' folder for GitHub Pages
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
