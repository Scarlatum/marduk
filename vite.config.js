import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
     target: 'ES2020',
     sourcemap: true
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './source')
    }
  }
})