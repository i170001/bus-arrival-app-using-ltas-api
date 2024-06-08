import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: 'http://datamall2.mytransport.sg/ltaodataservice',
        changeOrigin: true,
        secure: false,
        rewrite: (p) => {
          console.log('proxy string', p);
          const replaceString =  p.replace(/^\/api/, "");
          console.log('replaced with', replaceString);
          return replaceString
        },
      },
    },
    cors: false,
  },
});