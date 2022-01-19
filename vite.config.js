import path from 'path';
import { defineConfig } from 'vite';

import { imagetools } from 'vite-imagetools'

export default defineConfig({
  plugins: [
    imagetools()
  ],
  server: {
    host: '0.0.0.0'
  },
  build: {
     target: 'ES2020',
     sourcemap: true,
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './source')
    }
  }
})