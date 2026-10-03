import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    "BASE_PATH environment variable is required but was not provided.",
  );
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    manifest: "manifest.json",
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          // React core — always needed, split so it caches independently
          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("/react-is/") ||
            id.includes("/scheduler/")
          ) return "vendor-react";

          // TanStack Query — data-fetching, used across many pages
          if (id.includes("/@tanstack/")) return "vendor-query";

          // Radix UI primitives + icons — large but stable
          if (id.includes("/@radix-ui/") || id.includes("/lucide-react/")) return "vendor-ui";

          // Form validation stack — only booking & contact pages need it
          if (
            id.includes("/react-hook-form/") ||
            id.includes("/@hookform/") ||
            id.includes("/zod/")
          ) return "vendor-forms";

          // QR code — only used on booking confirmation
          if (id.includes("/qrcode") || id.includes("/qr-code")) return "vendor-qr";

          // Overlay / notification libs — not on initial paint
          if (id.includes("/vaul/") || id.includes("/sonner/")) return "vendor-overlay";

          // Command palette — heavy, only used in comboboxes
          if (id.includes("/cmdk/") || id.includes("cmdk@")) return "vendor-cmdk";

          // Date/calendar picker — heavy, only used in booking
          if (
            id.includes("/react-day-picker/") ||
            id.includes("/date-fns/") ||
            id.includes("/@internationalized/")
          ) return "vendor-date";

          // Carousel — only used where explicitly imported
          if (id.includes("/embla-carousel")) return "vendor-carousel";

          // Leave other dependencies to Rollup's shared-chunk logic. A
          // catch-all vendor chunk here can create a cycle with React's
          // runtime chunk and break hydration before interactive controls run.
          return undefined;
        },
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
