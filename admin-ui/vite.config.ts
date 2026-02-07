import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/snapshots": {
        target: "http://localhost:7788",
        changeOrigin: true
      }
    }
  }
});
