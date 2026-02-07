import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/edge": {
        target: "http://localhost:7788",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/edge/, ""),
      },
    },
  },
});
