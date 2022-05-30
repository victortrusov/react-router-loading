import { defineConfig } from 'vite';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

const resolvePath = (str: string) => path.resolve(__dirname, str);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true
    }),
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
