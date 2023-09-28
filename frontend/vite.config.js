import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const fileNames = ['src', 'components', 'hooks', 'assets', 'pages']

// this will generate aliases for fileNames
const filePaths = fileNames.reduce(
  (acc, cur) => ({
    ...acc,
    [cur]: `/${cur === 'src' ? cur: 'src/' + cur}`
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
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    port: 5173
  }
})
