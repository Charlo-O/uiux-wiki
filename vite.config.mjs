import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  base: "./",
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [
    react(),
    basicSsl({
      name: "kandong-ui-local",
      domains: ["localhost", "127.0.0.1", "uiux.wiki", "www.uiux.wiki"],
      certDir: "node_modules/.vite/basic-ssl-uiux-wiki",
    }),
  ],
});
