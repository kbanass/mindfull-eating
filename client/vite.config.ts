import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  server: {
    host: true,
    // Cloudflare Quick Tunnel assigns a random subdomain on every run
    // (e.g. random-words.trycloudflare.com) — without this Vite rejects the
    // request as "Blocked request" (DNS rebinding protection).
    allowedHosts: [".trycloudflare.com"],
  },
  test: {
    environment: "node",
  },
  plugins: [
    react(),
    svgr(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        // OPFS and IndexedDB don't go through the Workbox cache — the photos
        // (OPFS) and entries (Dexie) live outside this mechanism. This cache
        // only covers the app files (JS/CSS/HTML), so that the app can start
        // at all while offline.
        globPatterns: ["**/*.{js,css,html,svg}"],
      },
      manifest: {
        name: "Mindful Eating",
        short_name: "Mindful Eating",
        description: "Eating patterns journal",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          // TODO: add proper PNG icons at 192x192 and 512x512 (including one
          // maskable) — SVG as the only icon source isn't supported
          // everywhere when installing a PWA.
          {
            src: "/favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
});
