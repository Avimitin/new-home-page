import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { code_transform } from "./vite-transform-plugin"

const config = {
  layoutFile: "./src/assets/codes-layout.json",
  displayText: "Hello, here is sh1marin",
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), code_transform(config)],
})
