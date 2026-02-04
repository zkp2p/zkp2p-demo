import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@zkp2p/brand/logos", replacement: path.resolve(__dirname, "./packages/brand/logos") },
      { find: "@zkp2p/brand/icons", replacement: path.resolve(__dirname, "./packages/brand/icons") },
      { find: "@zkp2p/brand/videos", replacement: path.resolve(__dirname, "./packages/brand/videos") },
      { find: "@zkp2p/brand/fonts", replacement: path.resolve(__dirname, "./packages/brand/fonts") },
      { find: "@zkp2p/brand/tiers", replacement: path.resolve(__dirname, "./packages/brand/tiers") },
      { find: "@zkp2p/brand/textures", replacement: path.resolve(__dirname, "./packages/brand/src/textures") },
      { find: "@zkp2p/brand", replacement: path.resolve(__dirname, "./packages/brand/src") },
      { find: "@components", replacement: path.resolve(__dirname, "./src/components") },
      { find: "@theme", replacement: path.resolve(__dirname, "./src/theme") },
      { find: "@assets", replacement: path.resolve(__dirname, "./src/assets") },
    ],
  },
  server: {
    port: 3000,
    allowedHosts: [".tail4a886f.ts.net"],
  },
  build: {
    outDir: 'build',
  },
});
