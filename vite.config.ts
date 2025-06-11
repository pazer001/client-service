import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import eslint from 'vite-plugin-eslint2'
import svgr from 'vite-plugin-svgr'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    basicSsl(),
    react(),
    eslint(),
    svgr(),
  ],
  server: {
    https: true,
    host: true,
    port: 3001,
  },
})
