import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { blogPlugin } from "./src/plugins/vite-plugin-blog"
import { seoPlugin } from "./src/plugins/vite-plugin-seo"

export default defineConfig(({ command }) => ({
  base: command === "serve" ? "/" : (process.env.BASE_PATH || "/"),
  plugins: [react(), blogPlugin(), seoPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom", "framer-motion"],
          markdown: ["react-markdown", "remark-gfm", "rehype-highlight", "rehype-slug"],
        },
      },
    },
  },
}))



