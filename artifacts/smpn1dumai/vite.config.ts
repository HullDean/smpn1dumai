import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const port = Number(process.env.PORT ?? 5173);
const basePath = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    // Replit-specific plugins hanya aktif kalau jalan di Replit
    ...(process.env.REPL_ID !== undefined
      ? [
          // lazy import supaya tidak error di local
          ...(await Promise.all([
            import("@replit/vite-plugin-runtime-error-modal").then((m) => m.default()),
            import("@replit/vite-plugin-cartographer").then((m) =>
              m.cartographer({ root: path.resolve(import.meta.dirname, "..") }),
            ),
            import("@replit/vite-plugin-dev-banner").then((m) => m.devBanner()),
          ]))
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
    // Optimasi build
    rollupOptions: {
      output: {
        // Manual chunk splitting para vendor libraries
        manualChunks(id) {
          // Core React runtime — always first to load
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "react-vendor";
          }
          // Framer Motion — large, only needed for animations
          if (id.includes("node_modules/framer-motion")) {
            return "motion";
          }
          // TanStack Query — data fetching layer
          if (id.includes("node_modules/@tanstack/react-query")) {
            return "query";
          }
          // Wouter — router
          if (id.includes("node_modules/wouter")) {
            return "router";
          }
          // Radix UI — large UI primitives, split into own chunk
          if (id.includes("node_modules/@radix-ui")) {
            return "radix";
          }
          // Recharts — only used in admin dashboard
          if (id.includes("node_modules/recharts") || id.includes("node_modules/d3-")) {
            return "charts";
          }
        },
      },
    },
    // Minify CSS
    cssMinify: true,
    // Target modern browsers
    target: "es2020",
    // Chunk size warning threshold
    chunkSizeWarningLimit: 600,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: { strict: true },
    // Proxy API calls ke backend supaya tidak kena CORS di dev
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist"],
  },
});
