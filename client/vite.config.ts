import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  server: {
    host: true,
    // Cloudflare Quick Tunnel daje losową subdomenę przy każdym uruchomieniu
    // (np. random-words.trycloudflare.com) — bez tego Vite odrzuca żądanie
    // jako "Blocked request" (ochrona przed DNS rebinding).
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
        // OPFS i IndexedDB nie przechodzą przez cache Workboxa — to Twoje
        // zdjęcia (OPFS) i wpisy (Dexie) żyją poza tym mechanizmem. Ten
        // cache dotyczy tylko plików aplikacji (JS/CSS/HTML), żeby appka
        // w ogóle odpaliła się offline.
        globPatterns: ["**/*.{js,css,html,svg}"],
      },
      manifest: {
        name: "Mindful Eating",
        short_name: "Mindful Eating",
        description: "Dziennik wzorców żywieniowych",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          // TODO: dodaj właściwe ikony PNG 192x192 i 512x512 (w tym jedną
          // maskable) — SVG jako jedyne źródło ikon nie jest wspierane
          // wszędzie przy instalacji PWA.
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
