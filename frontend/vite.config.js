import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Use "/" for Vercel/custom domain; use "/AgriSeva2.0" for GitHub Pages
  base: process.env.VITE_BASE_PATH || "/AgriSeva2.0",
  server: {
    port: 5173
  }
});
