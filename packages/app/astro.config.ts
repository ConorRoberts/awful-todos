import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import { VitePWA } from "vite-plugin-pwa";
import { manifest, seoConfig } from "./src/seo";

// https://astro.build/config
export default defineConfig({
  image: {
    service: {
      entrypoint: "astro/assets/services/noop",
    },
  },
  site: seoConfig.baseURL,
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    solid(),
    sitemap(),
  ],
  output: "server",
  adapter: node({
    mode: "middleware",
  }),
  vite: {
    ssr: {},
    envPrefix: "PUBLIC",
    logLevel: "info",
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        manifest,
        workbox: {
          globDirectory: "dist",
          globPatterns: ["**/*.{js,css,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}"],
          // Don't fallback on document based (e.g. `/some-page`) requests
          // This removes an errant console.log message from showing up.
          navigateFallback: null,
        },
      }),
    ],
  },
});
