import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { code_transform } from "./vite-transform-plugin"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), code_transform("./src/assets")],
})
