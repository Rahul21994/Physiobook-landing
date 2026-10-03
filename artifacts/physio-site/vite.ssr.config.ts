import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  publicDir: false,
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/server"),
    ssr: "src/entry-server.tsx",
    emptyOutDir: true,
    // The SSR bundle is consumed by prerender.mjs, not debugged in-browser.
    // Explicitly disable maps so transformed Radix wrappers do not emit
    // misleading "can't resolve original location" diagnostics.
    sourcemap: false,
    rollupOptions: {
      output: {
        format: "esm",
      },
    },
  },
});
