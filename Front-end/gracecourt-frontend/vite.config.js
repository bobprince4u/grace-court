import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  rules: {
    semi: "error",
  },
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
});
