import { defineConfig } from 'vite';
import path from 'node:path';
import react from '@vitejs/plugin-react';

const resolvePath = (str: string) => path.resolve(__dirname, str);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  build: {
    lib: {
      entry: resolvePath('lib/index.ts'),
      name: 'react-router-loading',
      formats: ['es', 'umd'],
      fileName: (format) => `react-router-loading.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-router', 'topbar'],
      output: {
        globals: {
          react: 'React',
          'react-router': 'ReactRouter',
          'topbar': 'topbar'
        },
      },
    },
    sourcemap: true
  },
});
