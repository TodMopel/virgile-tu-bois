import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// Build hébergé (GitHub Pages) — sert de fallback à la clé USB : une vraie
// origine https:// élimine toute la classe de bugs file:// (module scripts,
// sandboxing WebKit) rencontrée sur iOS. Service worker = tout le contenu
// (audio compris) est mis en cache après la première visite, donc utilisable
// hors-ligne ensuite comme une app installée.
export default defineConfig({
  base: "/virgile-tu-bois/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/*.png", "cover/*"],
      manifest: {
        name: "Virgile Tu Bois — Les Coucous",
        short_name: "Virgile Tu Bois",
        description: "Sables d'O-Zone — Cou Cou Records",
        start_url: ".",
        scope: ".",
        display: "standalone",
        background_color: "#1a0f08",
        theme_color: "#1a0f08",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,woff2,png,jpeg,jpg,svg,mp3}"],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
      },
    }),
  ],
});
