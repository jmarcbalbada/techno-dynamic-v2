import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const fileNames = [
  'apis',
  'assets',
  'components',
  'data',
  'hocs',
  'hooks',
  'layout',
  'pages',
  'src'
];

// this will generate aliases for fileNames
const filePaths = fileNames.reduce(
  (acc, cur) => ({
    ...acc,
    [cur]: `/${cur === 'src' ? cur : 'src/' + cur}`
  }),
  ''
);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      ...filePaths
    }
  },
  build: {
    outDir: 'dist'
  },
  server: {
    hmr: {
      overlay: true
    },
    watch: {
      usePolling: true
    },
    host: true,
    strictPort: true,
    port: 5173
  }
});
