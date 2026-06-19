// Casper Nexus - Vite Config - Build verified ✓
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/rpc-proxy': {
        target: 'https://rpc.testnet.casperlabs.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rpc-proxy/, '/rpc'),
      }
    }
  }
})
